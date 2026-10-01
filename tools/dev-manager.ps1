# Dev Manager — Kejaksaan Negeri Purbalingga (v1.2.1)
# GUI desktop (Windows Forms) untuk mengelola backend + frontend tanpa terminal.
# Cara pakai: double-click "Dev Manager.bat" di folder project.
# Tidak butuh install apa-apa, hanya butuh Node.js terinstall.
#
# Catatan arsitektur v1.2.1: child process (node) me-redirect stdout/stderr ke
# FILE log, lalu timer UI me-tail file tersebut. Pola lama (event handler async
# .NET add_OutputDataReceived yang menulis ke antrean dari thread pool) bisa
# melempar unhandled exception di thread non-UI dan mematikan seluruh GUI
# ("forced close" saat klik Start). Pola file + tail 100% berjalan di UI thread.

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
$script:backendLog = Join-Path $logDir 'backend.log'
$script:backendErr = Join-Path $logDir 'backend.err.log'
$script:frontendLog = Join-Path $logDir 'frontend.log'
$script:frontendErr = Join-Path $logDir 'frontend.err.log'
$script:backendPos = 0
$script:backendErrPos = 0
$script:frontendPos = 0
$script:frontendErrPos = 0

# ---------- helper ----------
function Add-Log($msg) {
    $txtLog.AppendText(('[{0:HH:mm:ss}] {1}' -f (Get-Date), $msg) + [Environment]::NewLine)
    Trim-Log
    $txtLog.SelectionStart = $txtLog.Text.Length
    $txtLog.ScrollToCaret()
}

function Trim-Log {
    $baris = $txtLog.Lines
    if ($baris.Count -gt 800) {
        $txtLog.Lines = $baris[($baris.Count - 800)..($baris.Count - 1)]
    }
}

function Test-Port($port) {
    $c = New-Object Net.Sockets.TcpClient
    try {
        $iar = $c.BeginConnect('127.0.0.1', $port, $null, $null)
        if (-not $iar.AsyncWaitHandle.WaitOne(500)) { return $false }
        $c.EndConnect($iar)  # melempar jika koneksi ditolak -> port tertutup
        return $true
    } catch { return $false }
    finally { $c.Close() }
}

function Start-Proses($namaExe, $argumen, $workdir, $logPath, $errPath) {
    # Segarkan file log setiap start agar isi lama tidak terbaca ulang.
    [IO.File]::WriteAllText($logPath, '')
    [IO.File]::WriteAllText($errPath, '')
    return (Start-Process $namaExe -ArgumentList $argumen -WorkingDirectory $workdir `
        -NoNewWindow -PassThru `
        -RedirectStandardOutput $logPath -RedirectStandardError $errPath)
}

function Stop-Proses($p) {
    if ($p -and -not $p.HasExited) { try { $p.Kill() } catch {} }
}

function Stop-Sweep($pola) {
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like $pola } |
        ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} }
}

# Baca byte baru dari file log (aman dibaca walau sedang ditulis proses lain).
function Baca-LogBaru($path, $tag, [ref]$pos) {
    if (-not (Test-Path $path)) { return }
    try {
        $fs = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        try {
            if ($fs.Length -lt $pos.Value) { $pos.Value = 0 }  # file di-truncate
            $fs.Seek($pos.Value, [IO.SeekOrigin]::Begin) | Out-Null
            $sr = New-Object IO.StreamReader($fs)
            $teks = $sr.ReadToEnd()
            $pos.Value = $fs.Position
            $sr.Close()
            if ($teks) {
                $prefix = '[{0:HH:mm:ss}] [{1}] ' -f (Get-Date), $tag
                $barisBaru = $teks -split "`r?`n" | Where-Object { $_ -ne '' } | ForEach-Object { $prefix + $_ }
                return ($barisBaru -join [Environment]::NewLine)
            }
        } finally { $fs.Close() }
    } catch {}
    return $null
}

function Tail-SemuaLog {
    $semua = @(
        (Baca-LogBaru $script:backendLog 'backend' ([ref]$script:backendPos)),
        (Baca-LogBaru $script:backendErr 'backend:err' ([ref]$script:backendErrPos)),
        (Baca-LogBaru $script:frontendLog 'frontend' ([ref]$script:frontendPos)),
        (Baca-LogBaru $script:frontendErr 'frontend:err' ([ref]$script:frontendErrPos))
    ) | Where-Object { $_ }
    if ($semua) {
        $txtLog.AppendText(($semua -join [Environment]::NewLine) + [Environment]::NewLine)
        Trim-Log
        $txtLog.SelectionStart = $txtLog.Text.Length
        $txtLog.ScrollToCaret()
    }
}

# ---------- aksi backend ----------
function Start-Backend {
    if (Test-Port $BACKEND_PORT) { Add-Log 'Backend sudah berjalan di :3001'; return }
    try {
        $script:backendProc = Start-Proses 'node' 'index.js' (Join-Path $root 'server') $script:backendLog $script:backendErr
        $script:backendPos = 0; $script:backendErrPos = 0
        Add-Log 'Backend starting... (node server/index.js)'
    } catch { Add-Log ('Gagal start backend: ' + $_.Exception.Message) }
}

function Stop-Backend {
    Stop-Proses $script:backendProc
    $script:backendProc = $null
    Stop-Sweep '*index.js*'
    Add-Log 'Backend dihentikan.'
}

# ---------- aksi frontend ----------
function Start-Frontend {
    if (Test-Port $FRONTEND_PORT) { Add-Log 'Frontend sudah berjalan di :5173'; return }
    $viteBin = Join-Path $root 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path $viteBin)) { Add-Log 'vite belum terinstall — jalankan "npm install" dulu.'; return }
    try {
        $script:frontendProc = Start-Proses 'node' "`"$viteBin`"" $root $script:frontendLog $script:frontendErr
        $script:frontendPos = 0; $script:frontendErrPos = 0
        Add-Log 'Frontend starting... (vite dev server)'
    } catch { Add-Log ('Gagal start frontend: ' + $_.Exception.Message) }
}

function Stop-Frontend {
    Stop-Proses $script:frontendProc
    $script:frontendProc = $null
    Stop-Sweep '*vite*'
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

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 1000
$timer.Add_Tick({
    Set-Status $gB (Test-Port $BACKEND_PORT) 'Backend'
    Set-Status $gF (Test-Port $FRONTEND_PORT) 'Frontend'
    Tail-SemuaLog
})

$form.Add_Shown({
    Add-Log 'Dev Manager siap. Klik "Start Semua" untuk menjalankan backend + frontend.'
    Add-Log "Project: $root"
    Add-Log "Log file tersimpan di: $logDir"
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
