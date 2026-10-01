# Dev Manager - Kejaksaan Negeri Purbalingga (v2.0.0)
# Dashboard Desktop GUI Terpadu untuk mengelola Backend API (:3001) dan Frontend (:5173).
# Jalankan via "Dev Manager.bat" di root project tanpa perlu terminal CMD terbuka.

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$scriptDir = $PSScriptRoot
if (-not $scriptDir -and $MyInvocation.MyCommand -and $MyInvocation.MyCommand.Path) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
if (-not $scriptDir) {
    $scriptDir = Join-Path (Get-Location).Path 'tools'
}
$root = Split-Path $scriptDir -Parent
$logDir = Join-Path $scriptDir 'logs'
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

$BACKEND_PORT = 3001
$FRONTEND_PORT = 5173

# Cek ketersediaan Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    [System.Windows.Forms.MessageBox]::Show(
        "Node.js tidak ditemukan di PATH sistem.`nSilakan install Node.js (v20+) terlebih dahulu lalu jalankan kembali aplikasi ini.",
        "Dev Manager - Node.js Diperlukan",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
    exit 1
}

$nodeVersion = ""
try {
    $nodeVersion = (node -v 2>$null).Trim()
} catch {
    $nodeVersion = "Node.js"
}

# Simbol lingkaran Unicode yang aman
$CHAR_DOT = [char]0x25CF
$CHAR_CIRCLE = [char]0x25CB

# ==========================================
# STATE & LOG BUFFER
# ==========================================
$script:backendProc = $null
$script:frontendProc = $null

$script:backendLog = Join-Path $logDir 'backend.log'
$script:backendErr = Join-Path $logDir 'backend.err.log'
$script:frontendLog = Join-Path $logDir 'frontend.log'
$script:frontendErr = Join-Path $logDir 'frontend.err.log'

$script:backendPos = 0
$script:backendErrPos = 0
$script:frontendPos = 0
$script:frontendErrPos = 0

$script:backendState = $false
$script:frontendState = $false
$script:backendPID = $null
$script:frontendPID = $null

$script:logBufferAll = New-Object System.Collections.ArrayList
$script:logBufferBackend = New-Object System.Collections.ArrayList
$script:logBufferFrontend = New-Object System.Collections.ArrayList
$script:logBufferError = New-Object System.Collections.ArrayList

$script:activeTab = 'All'
$script:autoScroll = $true
$script:tickCounter = 0

# ==========================================
# HELPER FUNCTIONS
# ==========================================
function Strip-Ansi($teks) {
    if (-not $teks) { return '' }
    return ($teks -replace '\x1b\[[0-9;?]*[a-zA-Z]|\x1b\([a-zA-Z0-9]|\x1b[=>]', '')
}

function Is-PortActive($port) {
    try {
        $listeners = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
        return ($listeners.Port -contains $port)
    } catch {
        return $false
    }
}

function Get-PortPID($port) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conns) {
            $first = $conns | Select-Object -First 1
            if ($first.OwningProcess -gt 0) { return $first.OwningProcess }
        }
    } catch {}
    return $null
}

function Stop-PortProcess($port) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($c in $conns) {
            if ($c.OwningProcess -gt 0) {
                try {
                    & taskkill /PID $c.OwningProcess /T /F 2>$null | Out-Null
                } catch {
                    try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
                }
            }
        }
    } catch {}
}

function Append-LogLine($line, $category, $isError) {
    [void]$script:logBufferAll.Add($line)
    if ($script:logBufferAll.Count -gt 1500) { $script:logBufferAll.RemoveAt(0) }

    if ($category -eq 'Backend') {
        [void]$script:logBufferBackend.Add($line)
        if ($script:logBufferBackend.Count -gt 1000) { $script:logBufferBackend.RemoveAt(0) }
    } elseif ($category -eq 'Frontend') {
        [void]$script:logBufferFrontend.Add($line)
        if ($script:logBufferFrontend.Count -gt 1000) { $script:logBufferFrontend.RemoveAt(0) }
    }

    if ($isError) {
        [void]$script:logBufferError.Add($line)
        if ($script:logBufferError.Count -gt 1000) { $script:logBufferError.RemoveAt(0) }
    }

    $shouldDisplay = ($script:activeTab -eq 'All') -or `
                     ($script:activeTab -eq 'Backend' -and $category -eq 'Backend') -or `
                     ($script:activeTab -eq 'Frontend' -and $category -eq 'Frontend') -or `
                     ($script:activeTab -eq 'Error' -and $isError)

    if ($shouldDisplay -and $txtLog -and -not $txtLog.IsDisposed) {
        $txtLog.AppendText($line + [Environment]::NewLine)
        if ($script:autoScroll) {
            $txtLog.SelectionStart = $txtLog.Text.Length
            $txtLog.ScrollToCaret()
        }
    }
}

function Add-SystemLog($message, $category = 'System', $isError = $false) {
    $time = (Get-Date).ToString("HH:mm:ss")
    $tag = if ($isError) { "$category:ERR" } else { $category }
    $line = "[$time] [$tag] $message"
    Append-LogLine $line $category $isError
}

function Baca-FileBaru($path, $tag, $category, $isError, [ref]$pos) {
    if (-not (Test-Path $path)) { return }
    try {
        $fs = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        try {
            if ($fs.Length -lt $pos.Value) { $pos.Value = 0 }
            $fs.Seek($pos.Value, [IO.SeekOrigin]::Begin) | Out-Null
            $sr = New-Object IO.StreamReader($fs, [System.Text.Encoding]::UTF8)
            $teks = $sr.ReadToEnd()
            $pos.Value = $fs.Position
            $sr.Close()
            if ($teks) {
                $clean = Strip-Ansi $teks
                $lines = $clean -split "`r?`n" | Where-Object { $_.Trim() -ne '' }
                $time = (Get-Date).ToString("HH:mm:ss")
                foreach ($l in $lines) {
                    $formatted = "[$time] [$tag] $l"
                    Append-LogLine $formatted $category $isError
                }
            }
        } finally { $fs.Close() }
    } catch {}
}

function Update-LogsFromDisk {
    Baca-FileBaru $script:backendLog 'Backend' 'Backend' $false ([ref]$script:backendPos)
    Baca-FileBaru $script:backendErr 'Backend:ERR' 'Backend' $true ([ref]$script:backendErrPos)
    Baca-FileBaru $script:frontendLog 'Frontend' 'Frontend' $false ([ref]$script:frontendPos)
    Baca-FileBaru $script:frontendErr 'Frontend:ERR' 'Frontend' $true ([ref]$script:frontendErrPos)
}

# ==========================================
# SERVICE CONTROL LOGIC
# ==========================================
function Start-Backend {
    if (Is-PortActive $BACKEND_PORT) {
        Add-SystemLog "Backend API sudah aktif di port :$BACKEND_PORT" 'Backend'
        return
    }

    try {
        [IO.File]::WriteAllText($script:backendLog, '')
        [IO.File]::WriteAllText($script:backendErr, '')
        $script:backendPos = 0
        $script:backendErrPos = 0

        $workDir = Join-Path $root 'server'
        $script:backendProc = Start-Process 'node' -ArgumentList 'index.js' -WorkingDirectory $workDir `
            -NoNewWindow -PassThru `
            -RedirectStandardOutput $script:backendLog -RedirectStandardError $script:backendErr

        Set-ServiceStatusUI $panelBackend 'STARTING'
        Add-SystemLog "Memulai Backend API... (node server/index.js)" 'Backend'
    } catch {
        Add-SystemLog "Gagal memulai Backend: $($_.Exception.Message)" 'Backend' $true
    }
}

function Stop-Backend {
    Add-SystemLog "Menghentikan Backend API..." 'Backend'
    Set-ServiceStatusUI $panelBackend 'STOPPING'

    if ($script:backendProc -and -not $script:backendProc.HasExited) {
        try {
            & taskkill /PID $script:backendProc.Id /T /F 2>$null | Out-Null
        } catch {
            try { $script:backendProc.Kill() } catch {}
        }
    }
    $script:backendProc = $null
    Stop-PortProcess $BACKEND_PORT
    Add-SystemLog "Backend API telah dihentikan." 'Backend'
    Refresh-StatusImmediately
}

function Restart-Backend {
    Add-SystemLog "Merestart Backend API..." 'Backend'
    Stop-Backend
    Start-Sleep -Milliseconds 600
    Start-Backend
}

function Start-Frontend {
    if (Is-PortActive $FRONTEND_PORT) {
        Add-SystemLog "Frontend Website sudah aktif di port :$FRONTEND_PORT" 'Frontend'
        return
    }

    $viteBin = Join-Path $root 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path $viteBin)) {
        Add-SystemLog "Vite belum terinstall. Silakan klik tombol 'npm install' terlebih dahulu." 'Frontend' $true
        [System.Windows.Forms.MessageBox]::Show(
            "Vite dev server belum ditemukan di folder node_modules.`nSilakan jalankan 'npm install' terlebih dahulu.",
            "Dev Manager",
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Warning
        ) | Out-Null
        return
    }

    try {
        [IO.File]::WriteAllText($script:frontendLog, '')
        [IO.File]::WriteAllText($script:frontendErr, '')
        $script:frontendPos = 0
        $script:frontendErrPos = 0

        $script:frontendProc = Start-Process 'node' -ArgumentList "`"$viteBin`"" -WorkingDirectory $root `
            -NoNewWindow -PassThru `
            -RedirectStandardOutput $script:frontendLog -RedirectStandardError $script:frontendErr

        Set-ServiceStatusUI $panelFrontend 'STARTING'
        Add-SystemLog "Memulai Frontend Website... (vite dev server di :$FRONTEND_PORT)" 'Frontend'
    } catch {
        Add-SystemLog "Gagal memulai Frontend: $($_.Exception.Message)" 'Frontend' $true
    }
}

function Stop-Frontend {
    Add-SystemLog "Menghentikan Frontend Website..." 'Frontend'
    Set-ServiceStatusUI $panelFrontend 'STOPPING'

    if ($script:frontendProc -and -not $script:frontendProc.HasExited) {
        try {
            & taskkill /PID $script:frontendProc.Id /T /F 2>$null | Out-Null
        } catch {
            try { $script:frontendProc.Kill() } catch {}
        }
    }
    $script:frontendProc = $null
    Stop-PortProcess $FRONTEND_PORT
    Add-SystemLog "Frontend Website telah dihentikan." 'Frontend'
    Refresh-StatusImmediately
}

function Restart-Frontend {
    Add-SystemLog "Merestart Frontend Website..." 'Frontend'
    Stop-Frontend
    Start-Sleep -Milliseconds 600
    Start-Frontend
}

function Start-AllServices {
    Add-SystemLog "Memulai seluruh layanan (Backend dan Frontend)..." 'System'
    Start-Backend
    Start-Frontend
}

function Stop-AllServices {
    Add-SystemLog "Menghentikan seluruh layanan..." 'System'
    Stop-Backend
    Stop-Frontend
}

function Restart-AllServices {
    Add-SystemLog "Merestart seluruh layanan..." 'System'
    Stop-Backend
    Stop-Frontend
    Start-Sleep -Milliseconds 700
    Start-Backend
    Start-Frontend
}

function Run-NpmInstall {
    $confirm = [System.Windows.Forms.MessageBox]::Show(
        "Jalankan 'npm install' untuk memperbarui dependencies project?`nProses akan berjalan di jendela terpisah.",
        "Konfirmasi npm install",
        [System.Windows.Forms.MessageBoxButtons]::YesNo,
        [System.Windows.Forms.MessageBoxIcon]::Question
    )
    if ($confirm -eq [System.Windows.Forms.DialogResult]::Yes) {
        Add-SystemLog "Menjalankan 'npm install'..." 'System'
        try {
            Start-Process 'cmd.exe' -ArgumentList "/c npm install && pause" -WorkingDirectory $root
            Add-SystemLog "Jendela npm install telah dibuka." 'System'
        } catch {
            Add-SystemLog "Gagal menjalankan npm install: $($_.Exception.Message)" 'System' $true
        }
    }
}

# ==========================================
# GUI BUILDER
# ==========================================
$form = New-Object System.Windows.Forms.Form
$form.Text = 'Dev Manager - Kejaksaan Negeri Purbalingga'
$form.Size = New-Object System.Drawing.Size(830, 730)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedSingle'
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(248, 250, 252)

# --- HEADER BANNER ---
$headerPanel = New-Object System.Windows.Forms.Panel
$headerPanel.Location = New-Object System.Drawing.Point(0, 0)
$headerPanel.Size = New-Object System.Drawing.Size(830, 68)
$headerPanel.BackColor = [System.Drawing.Color]::FromArgb(10, 54, 34)

$lblHeaderTitle = New-Object System.Windows.Forms.Label
$lblHeaderTitle.Text = 'KEJAKSAAN NEGERI PURBALINGGA'
$lblHeaderTitle.Font = New-Object System.Drawing.Font('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$lblHeaderTitle.ForeColor = [System.Drawing.Color]::White
$lblHeaderTitle.Location = New-Object System.Drawing.Point(18, 12)
$lblHeaderTitle.AutoSize = $true

$lblHeaderSub = New-Object System.Windows.Forms.Label
$lblHeaderSub.Text = 'Dev Manager Desktop - Fullstack Dashboard Control (Backend :3001 | Frontend :5173)'
$lblHeaderSub.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$lblHeaderSub.ForeColor = [System.Drawing.Color]::FromArgb(167, 243, 208)
$lblHeaderSub.Location = New-Object System.Drawing.Point(19, 36)
$lblHeaderSub.AutoSize = $true

$lblGlobalStatus = New-Object System.Windows.Forms.Label
$lblGlobalStatus.Text = "$CHAR_CIRCLE SEMUA NONAKTIF"
$lblGlobalStatus.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$lblGlobalStatus.ForeColor = [System.Drawing.Color]::FromArgb(203, 213, 225)
$lblGlobalStatus.Location = New-Object System.Drawing.Point(600, 24)
$lblGlobalStatus.Size = New-Object System.Drawing.Size(200, 24)
$lblGlobalStatus.TextAlign = 'MiddleRight'

$headerPanel.Controls.AddRange(@($lblHeaderTitle, $lblHeaderSub, $lblGlobalStatus))
$form.Controls.Add($headerPanel)

# --- FUNCTION CARD BUILDER ---
function Create-ServiceCard($x, $y, $w, $h, $title, $tech, $port) {
    $card = New-Object System.Windows.Forms.Panel
    $card.Location = New-Object System.Drawing.Point($x, $y)
    $card.Size = New-Object System.Drawing.Size($w, $h)
    $card.BackColor = [System.Drawing.Color]::White
    $card.BorderStyle = 'FixedSingle'

    $lblTitle = New-Object System.Windows.Forms.Label
    $lblTitle.Text = $title
    $lblTitle.Font = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Bold)
    $lblTitle.ForeColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
    $lblTitle.Location = New-Object System.Drawing.Point(14, 12)
    $lblTitle.AutoSize = $true

    $lblTech = New-Object System.Windows.Forms.Label
    $lblTech.Text = $tech
    $lblTech.Font = New-Object System.Drawing.Font('Segoe UI', 8)
    $lblTech.ForeColor = [System.Drawing.Color]::FromArgb(100, 116, 139)
    $lblTech.Location = New-Object System.Drawing.Point(14, 32)
    $lblTech.AutoSize = $true

    $lblPort = New-Object System.Windows.Forms.Label
    $lblPort.Text = "Port: $port"
    $lblPort.Font = New-Object System.Drawing.Font('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)
    $lblPort.ForeColor = [System.Drawing.Color]::FromArgb(71, 85, 105)
    $lblPort.Location = New-Object System.Drawing.Point(14, 54)
    $lblPort.AutoSize = $true

    $lblPID = New-Object System.Windows.Forms.Label
    $lblPID.Text = "PID: -"
    $lblPID.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
    $lblPID.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
    $lblPID.Location = New-Object System.Drawing.Point(100, 54)
    $lblPID.AutoSize = $true

    $lblBadge = New-Object System.Windows.Forms.Label
    $lblBadge.Text = "$CHAR_DOT BERHENTI"
    $lblBadge.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
    $lblBadge.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
    $lblBadge.Location = New-Object System.Drawing.Point(240, 12)
    $lblBadge.Size = New-Object System.Drawing.Size(135, 24)
    $lblBadge.TextAlign = 'MiddleRight'

    $btnStart = New-Object System.Windows.Forms.Button
    $btnStart.Text = 'Start'
    $btnStart.Location = New-Object System.Drawing.Point(14, 80)
    $btnStart.Size = New-Object System.Drawing.Size(75, 30)
    $btnStart.BackColor = [System.Drawing.Color]::FromArgb(21, 128, 61)
    $btnStart.ForeColor = [System.Drawing.Color]::White
    $btnStart.FlatStyle = 'Flat'
    $btnStart.Font = New-Object System.Drawing.Font('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)

    $btnStop = New-Object System.Windows.Forms.Button
    $btnStop.Text = 'Stop'
    $btnStop.Location = New-Object System.Drawing.Point(93, 80)
    $btnStop.Size = New-Object System.Drawing.Size(75, 30)
    $btnStop.BackColor = [System.Drawing.Color]::FromArgb(220, 38, 38)
    $btnStop.ForeColor = [System.Drawing.Color]::White
    $btnStop.FlatStyle = 'Flat'
    $btnStop.Font = New-Object System.Drawing.Font('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)

    $btnRestart = New-Object System.Windows.Forms.Button
    $btnRestart.Text = 'Restart'
    $btnRestart.Location = New-Object System.Drawing.Point(172, 80)
    $btnRestart.Size = New-Object System.Drawing.Size(75, 30)
    $btnRestart.BackColor = [System.Drawing.Color]::FromArgb(51, 65, 85)
    $btnRestart.ForeColor = [System.Drawing.Color]::White
    $btnRestart.FlatStyle = 'Flat'
    $btnRestart.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)

    $btnLink = New-Object System.Windows.Forms.Button
    $btnLink.Location = New-Object System.Drawing.Point(252, 80)
    $btnLink.Size = New-Object System.Drawing.Size(124, 30)
    $btnLink.BackColor = [System.Drawing.Color]::FromArgb(241, 245, 249)
    $btnLink.ForeColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
    $btnLink.FlatStyle = 'Flat'
    $btnLink.Font = New-Object System.Drawing.Font('Segoe UI', 8)

    $card.Controls.AddRange(@($lblTitle, $lblTech, $lblPort, $lblPID, $lblBadge, $btnStart, $btnStop, $btnRestart, $btnLink))
    $form.Controls.Add($card)

    return @{
        Panel = $card
        Title = $lblTitle
        Port = $port
        LblPID = $lblPID
        Badge = $lblBadge
        BtnStart = $btnStart
        BtnStop = $btnStop
        BtnRestart = $btnRestart
        BtnLink = $btnLink
    }
}

# Backend Card
$panelBackend = Create-ServiceCard 15 78 388 122 'Backend API' 'Node.js Express + SQLite DB' $BACKEND_PORT
$panelBackend.BtnLink.Text = 'Test /api/konten'
$panelBackend.BtnStart.Add_Click({ Start-Backend })
$panelBackend.BtnStop.Add_Click({ Stop-Backend })
$panelBackend.BtnRestart.Add_Click({ Restart-Backend })
$panelBackend.BtnLink.Add_Click({ Start-Process "http://localhost:$BACKEND_PORT/api/konten" })

# Frontend Card
$panelFrontend = Create-ServiceCard 411 78 388 122 'Frontend Website' 'React 19, Vite + Tailwind CSS' $FRONTEND_PORT
$panelFrontend.BtnLink.Text = 'Buka Website'
$panelFrontend.BtnStart.Add_Click({ Start-Frontend })
$panelFrontend.BtnStop.Add_Click({ Stop-Frontend })
$panelFrontend.BtnRestart.Add_Click({ Restart-Frontend })
$panelFrontend.BtnLink.Add_Click({ Start-Process "http://localhost:$FRONTEND_PORT" })

# --- MASTER ACTION TOOLBAR ---
$toolbar = New-Object System.Windows.Forms.Panel
$toolbar.Location = New-Object System.Drawing.Point(15, 208)
$toolbar.Size = New-Object System.Drawing.Size(784, 42)
$toolbar.BackColor = [System.Drawing.Color]::FromArgb(241, 245, 249)
$toolbar.BorderStyle = 'FixedSingle'

function Create-ToolbarBtn($text, $bg, $fg, $x, $w, $click) {
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $text
    $btn.Location = New-Object System.Drawing.Point($x, 5)
    $btn.Size = New-Object System.Drawing.Size($w, 30)
    $btn.BackColor = $bg
    $btn.ForeColor = $fg
    $btn.FlatStyle = 'Flat'
    $btn.Font = New-Object System.Drawing.Font('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)
    $btn.Add_Click($click)
    $toolbar.Controls.Add($btn)
    return $btn
}

Create-ToolbarBtn 'Start Semua' ([System.Drawing.Color]::FromArgb(15, 81, 50)) ([System.Drawing.Color]::White) 8 115 { Start-AllServices } | Out-Null
Create-ToolbarBtn 'Stop Semua' ([System.Drawing.Color]::FromArgb(153, 27, 27)) ([System.Drawing.Color]::White) 128 115 { Stop-AllServices } | Out-Null
Create-ToolbarBtn 'Restart Semua' ([System.Drawing.Color]::FromArgb(30, 41, 59)) ([System.Drawing.Color]::White) 248 125 { Restart-AllServices } | Out-Null

Create-ToolbarBtn 'Buka Web' ([System.Drawing.Color]::FromArgb(3, 105, 161)) ([System.Drawing.Color]::White) 410 95 { Start-Process "http://localhost:$FRONTEND_PORT" } | Out-Null
Create-ToolbarBtn 'Admin CMS' ([System.Drawing.Color]::FromArgb(107, 33, 168)) ([System.Drawing.Color]::White) 510 100 { Start-Process "http://localhost:$FRONTEND_PORT/admin" } | Out-Null
Create-ToolbarBtn 'npm install' ([System.Drawing.Color]::FromArgb(71, 85, 105)) ([System.Drawing.Color]::White) 615 105 { Run-NpmInstall } | Out-Null

$form.Controls.Add($toolbar)

# --- LOG VIEWER SECTION ---
$logContainer = New-Object System.Windows.Forms.Panel
$logContainer.Location = New-Object System.Drawing.Point(15, 258)
$logContainer.Size = New-Object System.Drawing.Size(784, 405)

$logBar = New-Object System.Windows.Forms.Panel
$logBar.Location = New-Object System.Drawing.Point(0, 0)
$logBar.Size = New-Object System.Drawing.Size(784, 34)

$script:tabButtons = @{}
function Create-TabBtn($name, $label, $x, $w) {
    $b = New-Object System.Windows.Forms.Button
    $b.Text = $label
    $b.Location = New-Object System.Drawing.Point($x, 2)
    $b.Size = New-Object System.Drawing.Size($w, 28)
    $b.FlatStyle = 'Flat'
    $b.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
    $b.Add_Click({ Switch-LogTab $name })
    $logBar.Controls.Add($b)
    $script:tabButtons[$name] = $b
    return $b
}

Create-TabBtn 'All' 'Semua Log' 0 90 | Out-Null
Create-TabBtn 'Backend' 'Backend (API)' 93 105 | Out-Null
Create-TabBtn 'Frontend' 'Frontend (Vite)' 201 110 | Out-Null
Create-TabBtn 'Error' 'Error Log' 314 90 | Out-Null

$chkAutoScroll = New-Object System.Windows.Forms.CheckBox
$chkAutoScroll.Text = 'Auto-scroll'
$chkAutoScroll.Checked = $true
$chkAutoScroll.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$chkAutoScroll.Location = New-Object System.Drawing.Point(430, 6)
$chkAutoScroll.Size = New-Object System.Drawing.Size(90, 22)
$chkAutoScroll.Add_CheckedChanged({
    $script:autoScroll = $chkAutoScroll.Checked
})
$logBar.Controls.Add($chkAutoScroll)

$btnCopyLog = New-Object System.Windows.Forms.Button
$btnCopyLog.Text = 'Salin'
$btnCopyLog.Location = New-Object System.Drawing.Point(525, 2)
$btnCopyLog.Size = New-Object System.Drawing.Size(75, 28)
$btnCopyLog.FlatStyle = 'Flat'
$btnCopyLog.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$btnCopyLog.Add_Click({
    if (-not [string]::IsNullOrEmpty($txtLog.Text)) {
        [System.Windows.Forms.Clipboard]::SetText($txtLog.Text)
        Add-SystemLog 'Log berhasil disalin ke clipboard.' 'System'
    }
})
$logBar.Controls.Add($btnCopyLog)

$btnClearLog = New-Object System.Windows.Forms.Button
$btnClearLog.Text = 'Bersihkan'
$btnClearLog.Location = New-Object System.Drawing.Point(604, 2)
$btnClearLog.Size = New-Object System.Drawing.Size(85, 28)
$btnClearLog.FlatStyle = 'Flat'
$btnClearLog.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$btnClearLog.Add_Click({
    $txtLog.Clear()
    switch ($script:activeTab) {
        'All' { $script:logBufferAll.Clear() }
        'Backend' { $script:logBufferBackend.Clear() }
        'Frontend' { $script:logBufferFrontend.Clear() }
        'Error' { $script:logBufferError.Clear() }
    }
    Add-SystemLog "Log tab '$($script:activeTab)' telah dibersihkan." 'System'
})
$logBar.Controls.Add($btnClearLog)

$btnOpenLogDir = New-Object System.Windows.Forms.Button
$btnOpenLogDir.Text = 'Folder Log'
$btnOpenLogDir.Location = New-Object System.Drawing.Point(693, 2)
$btnOpenLogDir.Size = New-Object System.Drawing.Size(91, 28)
$btnOpenLogDir.FlatStyle = 'Flat'
$btnOpenLogDir.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
$btnOpenLogDir.Add_Click({
    Start-Process 'explorer.exe' $logDir
})
$logBar.Controls.Add($btnOpenLogDir)

$logContainer.Controls.Add($logBar)

$txtLog = New-Object System.Windows.Forms.TextBox
$txtLog.Multiline = $true
$txtLog.ReadOnly = $true
$txtLog.ScrollBars = 'Vertical'
$txtLog.Font = New-Object System.Drawing.Font('Consolas', 9)
$txtLog.Location = New-Object System.Drawing.Point(0, 36)
$txtLog.Size = New-Object System.Drawing.Size(784, 365)
$txtLog.BackColor = [System.Drawing.Color]::FromArgb(17, 24, 39)
$txtLog.ForeColor = [System.Drawing.Color]::FromArgb(229, 231, 235)
$logContainer.Controls.Add($txtLog)

$form.Controls.Add($logContainer)

# --- STATUS BAR / FOOTER ---
$statusStrip = New-Object System.Windows.Forms.StatusStrip
$statusStrip.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)

$lblStatusProject = New-Object System.Windows.Forms.ToolStripStatusLabel
$lblStatusProject.Text = "Project: $root"
$lblStatusProject.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$lblStatusProject.Spring = $true
$lblStatusProject.TextAlign = 'MiddleLeft'

$lblStatusNode = New-Object System.Windows.Forms.ToolStripStatusLabel
$lblStatusNode.Text = "Node: $nodeVersion"
$lblStatusNode.ForeColor = [System.Drawing.Color]::FromArgb(167, 243, 208)

$statusStrip.Items.AddRange(@($lblStatusProject, $lblStatusNode))
$form.Controls.Add($statusStrip)

# ==========================================
# UI UPDATE HELPERS
# ==========================================
function Switch-LogTab($name) {
    $script:activeTab = $name

    foreach ($key in $script:tabButtons.Keys) {
        $btn = $script:tabButtons[$key]
        if ($key -eq $name) {
            $btn.BackColor = [System.Drawing.Color]::FromArgb(10, 54, 34)
            $btn.ForeColor = [System.Drawing.Color]::White
            $btn.Font = New-Object System.Drawing.Font('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)
        } else {
            $btn.BackColor = [System.Drawing.Color]::FromArgb(241, 245, 249)
            $btn.ForeColor = [System.Drawing.Color]::FromArgb(71, 85, 105)
            $btn.Font = New-Object System.Drawing.Font('Segoe UI', 8.5)
        }
    }

    $txtLog.Clear()
    $buffer = switch ($name) {
        'All' { $script:logBufferAll }
        'Backend' { $script:logBufferBackend }
        'Frontend' { $script:logBufferFrontend }
        'Error' { $script:logBufferError }
    }
    if ($buffer -and $buffer.Count -gt 0) {
        $txtLog.AppendText(($buffer -join [Environment]::NewLine) + [Environment]::NewLine)
    }
    if ($script:autoScroll) {
        $txtLog.SelectionStart = $txtLog.Text.Length
        $txtLog.ScrollToCaret()
    }
}

function Set-ServiceStatusUI($serviceCard, $state) {
    if ($state -eq 'RUNNING') {
        $serviceCard.Badge.Text = "$CHAR_DOT BERJALAN"
        $serviceCard.Badge.ForeColor = [System.Drawing.Color]::FromArgb(22, 163, 74)
        $serviceCard.BtnStart.Enabled = $false
        $serviceCard.BtnStop.Enabled = $true
        $serviceCard.BtnRestart.Enabled = $true
    } elseif ($state -eq 'STARTING') {
        $serviceCard.Badge.Text = "$CHAR_DOT MEMULAI..."
        $serviceCard.Badge.ForeColor = [System.Drawing.Color]::FromArgb(217, 119, 6)
    } elseif ($state -eq 'STOPPING') {
        $serviceCard.Badge.Text = "$CHAR_DOT MENGHENTIKAN..."
        $serviceCard.Badge.ForeColor = [System.Drawing.Color]::FromArgb(217, 119, 6)
    } else {
        $serviceCard.Badge.Text = "$CHAR_DOT BERHENTI"
        $serviceCard.Badge.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
        $serviceCard.LblPID.Text = 'PID: -'
        $serviceCard.BtnStart.Enabled = $true
        $serviceCard.BtnStop.Enabled = $false
        $serviceCard.BtnRestart.Enabled = $false
    }
}

function Refresh-StatusImmediately {
    $bActive = Is-PortActive $BACKEND_PORT
    $fActive = Is-PortActive $FRONTEND_PORT

    $script:backendState = $bActive
    $script:frontendState = $fActive

    if ($bActive) {
        Set-ServiceStatusUI $panelBackend 'RUNNING'
        if ($script:backendPID -eq $null -or ($script:tickCounter % 3 -eq 0)) {
            $script:backendPID = Get-PortPID $BACKEND_PORT
            if ($script:backendPID) { $panelBackend.LblPID.Text = "PID: $($script:backendPID)" }
        }
    } else {
        Set-ServiceStatusUI $panelBackend 'STOPPED'
        $script:backendPID = $null
    }

    if ($fActive) {
        Set-ServiceStatusUI $panelFrontend 'RUNNING'
        if ($script:frontendPID -eq $null -or ($script:tickCounter % 3 -eq 0)) {
            $script:frontendPID = Get-PortPID $FRONTEND_PORT
            if ($script:frontendPID) { $panelFrontend.LblPID.Text = "PID: $($script:frontendPID)" }
        }
    } else {
        Set-ServiceStatusUI $panelFrontend 'STOPPED'
        $script:frontendPID = $null
    }

    # Header Global Status
    if ($bActive -and $fActive) {
        $lblGlobalStatus.Text = "$CHAR_DOT SEMUA AKTIF"
        $lblGlobalStatus.ForeColor = [System.Drawing.Color]::FromArgb(74, 222, 128)
    } elseif ($bActive -or $fActive) {
        $lblGlobalStatus.Text = "$CHAR_DOT 1 LAYANAN AKTIF"
        $lblGlobalStatus.ForeColor = [System.Drawing.Color]::FromArgb(253, 224, 71)
    } else {
        $lblGlobalStatus.Text = "$CHAR_CIRCLE SEMUA NONAKTIF"
        $lblGlobalStatus.ForeColor = [System.Drawing.Color]::FromArgb(203, 213, 225)
    }
}

# --- TIMER (1000ms non-blocking) ---
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 1000
$timer.Add_Tick({
    $script:tickCounter++
    Refresh-StatusImmediately
    Update-LogsFromDisk
})

# --- EVENT HANDLERS FORM ---
$form.Add_Shown({
    Switch-LogTab 'All'
    Add-SystemLog 'Dev Manager Dashboard siap digunakan.' 'System'
    Add-SystemLog "Project Root: $root" 'System'
    Add-SystemLog "Klik 'Start Semua' untuk menjalankan Backend (:3001) dan Frontend (:5173) sekaligus." 'System'

    Refresh-StatusImmediately
    $timer.Start()
})

$form.Add_FormClosing({
    $timer.Stop()
    if ($script:backendProc -and -not $script:backendProc.HasExited) {
        try { & taskkill /PID $script:backendProc.Id /T /F 2>$null | Out-Null } catch {}
    }
    if ($script:frontendProc -and -not $script:frontendProc.HasExited) {
        try { & taskkill /PID $script:frontendProc.Id /T /F 2>$null | Out-Null } catch {}
    }
    Stop-PortProcess $BACKEND_PORT
    Stop-PortProcess $FRONTEND_PORT
})

# Eksekusi Aplikasi
[System.Windows.Forms.Application]::Run($form)
