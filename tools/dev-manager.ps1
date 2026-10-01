# Dev Manager — Kejaksaan Negeri Purbalingga
# GUI desktop (Windows Forms) untuk mengelola backend + frontend tanpa terminal.
# Cara pakai: double-click "Dev Manager.bat" di folder project.
# Tidak butuh install apa-apa, hanya butuh Node.js terinstall.

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$root = Split-Path $PSScriptRoot -Parent
$logDir = Join-Path $PSScriptRoot 'logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$BACKEND_PORT = 3001
$FRONTEND_PORT = 5173

# Cek node tersedia
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    [System.Windows.Forms.MessageBox]::Show(
        'Node.js tidak ditemukan di PATH. Install Node.js 20+ dulu, lalu buka lagi aplikasi ini.',
        'Dev Manager', 'OK', 'Error') | Out-Null
    exit 1
}

# ---------- state ----------
$script:backendProc = $null
$script:frontendProc = $null
$script:logQueue = [System.Collections.Concurrent.ConcurrentQueue[string]]::new()

# ---------- helper ----------
function Add-Log($msg) {
    $script:logQueue.Enqueue(('[{0:HH:mm:ss}] {1}' -f (Get-Date), $msg))
}

function Test-Port($port) {
    try {
        $c = New-Object Net.Sockets.TcpClient
        $iar = $c.BeginConnect('127.0.0.1', $port, $null, $null)
        $ok = $iar.AsyncWaitHandle.WaitOne(500)
        $c.Close()
        return $ok
    } catch { return $false }
}

function Start-ProsesTertangkap($file, $args, $workdir, $tag) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $file
    $psi.Arguments = $args
    $psi.WorkingDirectory = $workdir
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $psi
    $p.add_OutputDataReceived({
        param($s, $e)
        if ($e.Data) { $script:logQueue.Enqueue(('[{0:HH:mm:ss}] [{1}] {2}' -f (Get-Date), $tag, $e.Data)) }
    })
    $p.add_ErrorDataReceived({
        param($s, $e)
        if ($e.Data) { $script:logQueue.Enqueue(('[{0:HH:mm:ss}] [{1}:err] {2}' -f (Get-Date), $tag, $e.Data)) }
    })
    $p.Start() | Out-Null
    $p.BeginOutputReadLine()
    $p.BeginErrorReadLine()
    return $p
}

function Stop-Proses($p) {
    if ($p -and -not $p.HasExited) { try { $p.Kill() } catch {} }
}

function Stop-Sweep($pola) {
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like $pola } |
        ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} }
}

# ---------- aksi backend ----------
function Start-Backend {
    if (Test-Port $BACKEND_PORT) { Add-Log 'Backend sudah berjalan di :3001'; return }
    try {
        $script:backendProc = Start-ProsesTertangkap 'node' 'index.js' (Join-Path $root 'server') 'backend'
        Add-Log 'Backend starting... (node server/index.js)'
    } catch { Add-Log ('Gagal start backend: ' + $_.Exception.Message) }
}

function Stop-Backend {
    Stop-Proses $script:backendProc
    $script:backendProc = $null
    Stop-Sweep '*test-muse\server*'
    Add-Log 'Backend dihentikan.'
}

# ---------- aksi frontend ----------
function Start-Frontend {
    if (Test-Port $FRONTEND_PORT) { Add-Log 'Frontend sudah berjalan di :5173'; return }
    $viteBin = Join-Path $root 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path $viteBin)) { Add-Log 'vite belum terinstall — jalankan "npm install" dulu.'; return }
    try {
        $script:frontendProc = Start-ProsesTertangkap 'node' "`"$viteBin`"" $root 'frontend'
        Add-Log 'Frontend starting... (vite dev server)'
    } catch { Add-Log ('Gagal start frontend: ' + $_.Exception.Message) }
}

function Stop-Frontend {
    Stop-Proses $script:frontendProc
    $script:frontendProc = $null
    Stop-Sweep '*test-muse*vite*'
    Add-Log 'Frontend dihentikan.'
}

# ---------- bangun GUI ----------
$form = New-Object System.Windows.Forms.Form
$form.Text = 'Kejari Purbalingga — Dev Manager'
$form.Size = New-Object System.Drawing.Size(660, 600)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::White

$y = 12
function Tambah-Group($judul, $port) {
    $gb = New-Object System.Windows.Forms.GroupBox
    $gb.Text = "$judul  (port $port)"
    $gb.Location = New-Object System.Drawing.Point(12, $script:y)
    $gb.Size = New-Object System.Drawing.Size(620, 64)
    $gb.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)

    $dot = New-Object System.Windows.Forms.Label
    $dot.Text = '●'; $dot.Font = New-Object System.Drawing.Font('Segoe UI', 16)
    $dot.Location = New-Object System.Drawing.Point(16, 22); $dot.Size = New-Object System.Drawing.Size(28, 30)

    $st = New-Object System.Windows.Forms.Label
    $st.Text = 'mengecek...'; $st.Font = New-Object System.Drawing.Font('Segoe UI', 9)
    $st.Location = New-Object System.Drawing.Point(44, 28); $st.Size = New-Object System.Drawing.Size(300, 20)

    $btnStart = New-Object System.Windows.Forms.Button
    $btnStart.Text = 'Start'; $btnStart.Size = New-Object System.Drawing.Size(90, 30)
    $btnStart.Location = New-Object System.Drawing.Point(420, 22)
    $btnStart.BackColor = [System.Drawing.Color]::FromArgb(13, 40, 24)
    $btnStart.ForeColor = [System.Drawing.Color]::White; $btnStart.FlatStyle = 'Flat'

    $btnStop = New-Object System.Windows.Forms.Button
    $btnStop.Text = 'Stop'; $btnStop.Size = New-Object System.Drawing.Size(90, 30)
    $btnStop.Location = New-Object System.Drawing.Point(518, 22)
    $btnStop.FlatStyle = 'Flat'

    $gb.Controls.AddRange(@($dot, $st, $btnStart, $btnStop))
    $form.Controls.Add($gb)
    $script:y += 72
    return @{ Dot = $dot; Status = $st; Start = $btnStart; Stop = $btnStop }
}

$gB = Tambah-Group 'Backend API' $BACKEND_PORT
$gF = Tambah-Group 'Frontend Website' $FRONTEND_PORT
$gB.Start.Add_Click({ Start-Backend })
$gB.Stop.Add_Click({ Stop-Backend })
$gF.Start.Add_Click({ Start-Frontend })
$gF.Stop.Add_Click({ Stop-Frontend })

# baris tombol aksi cepat
$panelAksi = New-Object System.Windows.Forms.FlowLayoutPanel
$panelAksi.Location = New-Object System.Drawing.Point(12, $script:y)
$panelAksi.Size = New-Object System.Drawing.Size(620, 40)
$panelAksi.FlowDirection = 'LeftToRight'
function Tombol-Aksi($teks, $aksi) {
    $b = New-Object System.Windows.Forms.Button
    $b.Text = $teks; $b.Size = New-Object System.Drawing.Size(118, 32)
    $b.FlatStyle = 'Flat'; $b.Font = New-Object System.Drawing.Font('Segoe UI', 9)
    $b.Add_Click($aksi); $panelAksi.Controls.Add($b) | Out-Null
}
Tombol-Aksi 'Start Semua' { Start-Backend; Start-Frontend }
Tombol-Aksi 'Stop Semua' { Stop-Backend; Stop-Frontend }
Tombol-Aksi 'Buka Website' { Start-Process "http://localhost:$FRONTEND_PORT" }
Tombol-Aksi 'Buka Admin' { Start-Process "http://localhost:$FRONTEND_PORT/admin" }
Tombol-Aksi 'Bersihkan Log' { $txtLog.Clear() }
$form.Controls.Add($panelAksi)
$script:y += 46

$lblLog = New-Object System.Windows.Forms.Label
$lblLog.Text = 'Log:'
$lblLog.Location = New-Object System.Drawing.Point(12, $script:y)
$lblLog.Size = New-Object System.Drawing.Size(620, 18)
$lblLog.Font = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($lblLog)
$script:y += 20

$txtLog = New-Object System.Windows.Forms.TextBox
$txtLog.Multiline = $true; $txtLog.ReadOnly = $true
$txtLog.ScrollBars = 'Vertical'
$txtLog.Font = New-Object System.Drawing.Font('Consolas', 9)
$txtLog.Location = New-Object System.Drawing.Point(12, $script:y)
$txtLog.Size = New-Object System.Drawing.Size(620, 300)
$txtLog.BackColor = [System.Drawing.Color]::FromArgb(24, 24, 24)
$txtLog.ForeColor = [System.Drawing.Color]::FromArgb(220, 220, 220)
$form.Controls.Add($txtLog)

function Set-Status($g, $jalan, $nama) {
    if ($jalan) {
        $g.Dot.ForeColor = [System.Drawing.Color]::ForestGreen
        $g.Status.Text = "$nama BERJALAN"
        $g.Status.ForeColor = [System.Drawing.Color]::ForestGreen
    } else {
        $g.Dot.ForeColor = [System.Drawing.Color]::Gray
        $g.Status.Text = "$nama BERHENTI"
        $g.Status.ForeColor = [System.Drawing.Color]::Gray
    }
}

function Kuras-Log {
    $item = $null
    $n = 0
    while ($script:logQueue.TryDequeue([ref]$item) -and $n -lt 200) {
        $txtLog.AppendText($item + [Environment]::NewLine)
        $n++
    }
    # batasi 800 baris terakhir
    $baris = $txtLog.Lines
    if ($baris.Count -gt 800) {
        $txtLog.Lines = $baris[($baris.Count - 800)..($baris.Count - 1)]
    }
    if ($n -gt 0) { $txtLog.SelectionStart = $txtLog.Text.Length; $txtLog.ScrollToCaret() }
}

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 2000
$timer.Add_Tick({
    Set-Status $gB (Test-Port $BACKEND_PORT) 'Backend'
    Set-Status $gF (Test-Port $FRONTEND_PORT) 'Frontend'
    Kuras-Log
})

$form.Add_Shown({
    Add-Log 'Dev Manager siap. Klik "Start Semua" untuk menjalankan backend + frontend.'
    Add-Log "Project: $root"
    $timer.Start()
    # status awal langsung
    Set-Status $gB (Test-Port $BACKEND_PORT) 'Backend'
    Set-Status $gF (Test-Port $FRONTEND_PORT) 'Frontend'
})

$form.Add_FormClosing({
    $timer.Stop()
    Stop-Proses $script:backendProc
    Stop-Proses $script:frontendProc
})

[System.Windows.Forms.Application]::Run($form)
