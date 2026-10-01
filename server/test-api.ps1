$base = 'http://localhost:3001'
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType 'application/json' -Body '{"username":"admin","password":"admin123"}'
$token = $login.token
"login_ok token_len=$($token.Length)"
$h = @{ Authorization = "Bearer $token" }
$b = Invoke-RestMethod -Method Post -Uri "$base/api/admin/berita" -Headers $h -ContentType 'application/json' -Body '{"judul":"Tes Berita","ringkasan":"ringkasan","gambar":"/upacara.jpg","tanggal":"2026-10-01"}'
"create_ok id=$($b.id)"
$u = Invoke-RestMethod -Method Put -Uri "$base/api/admin/berita/$($b.id)" -Headers $h -ContentType 'application/json' -Body '{"judul":"Tes Berita Diedit","ringkasan":"ringkasan","gambar":"/upacara.jpg","tanggal":"2026-10-01"}'
"update_ok judul=$($u.judul)"
Invoke-RestMethod -Method Delete -Uri "$base/api/admin/berita/$($b.id)" -Headers $h | Out-Null
'delete_ok'
try { Invoke-RestMethod "$base/api/admin/berita" -ErrorAction Stop | Out-Null; 'unauth_FAIL' }
catch { 'unauth_' + $_.Exception.Response.StatusCode.value__ }
try { Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType 'application/json' -Body '{"username":"admin","password":"salah"}' -ErrorAction Stop | Out-Null; 'badlogin_FAIL' }
catch { 'badlogin_' + $_.Exception.Response.StatusCode.value__ }
$p = Invoke-RestMethod -Uri "$base/api/admin/pengaturan" -Headers $h
'pengaturan_keys=' + ($p.PSObject.Properties.Name -join ',')
Invoke-RestMethod -Method Post -Uri "$base/api/auth/logout" -Headers $h | Out-Null
'logout_ok'
