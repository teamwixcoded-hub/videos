# Renders a Remotion composition in small pieces so a crash costs minutes, not hours. Built on a 16 GB laptop where a
# single full render kept dying (headless Chrome ran out of memory). Safe to stop and re-run: finished pieces are skipped.
#
#   powershell -File scripts/render-chunked.ps1 -Comp Video01 -Total 7797
#   (total frames: run `npx remotion compositions src/index.ts`; Video01 = 7797)
#
# 1) video pieces of -Chunk frames, muted, each retried up to 5 times, each try killed after 25 minutes
# 2) the audio on its own at --scale=0.1 (the picture is not needed for audio, so this is ~10x faster)
# 3) all pieces stitched with the audio using Remotion's own ffmpeg, without re-encoding the video -> out/<Comp>.mp4
param([string]$Comp = 'Video01', [int]$Total = 7797, [int]$Chunk = 250, [int]$Concurrency = 3, [int]$MaxMinutes = 25)
Set-Location (Split-Path $PSScriptRoot -Parent)
$dir = "out/chunks-$Comp"; New-Item -ItemType Directory -Force $dir | Out-Null
$log = "$dir/render.log"
function L($m) { Add-Content $log "$(Get-Date -Format 'HH:mm:ss') $m"; Write-Host $m }

for ($a = 0; $a -lt $Total; $a += $Chunk) {
  $b = [math]::Min($a + $Chunk - 1, $Total - 1); $f = "$dir/f$a.mp4"
  if (Test-Path $f) { continue }
  $ok = $false
  for ($try = 1; $try -le 5 -and -not $ok; $try++) {
    $conc = if ($try -le 2) { $Concurrency } else { [math]::Max(1, $Concurrency - 1) }      # fewer workers after a failure = less memory
    $tmp = "$dir/tmp$a.mp4"; Remove-Item $tmp -ErrorAction SilentlyContinue
    L "frames $a-$b try $try (concurrency $conc)"
    $p = Start-Process cmd -ArgumentList "/c npx remotion render src/index.ts $Comp $tmp --frames=$a-$b --muted --concurrency=$conc --timeout=180000 > `"$dir/try-$a-$try.txt`" 2>&1" -PassThru -WindowStyle Hidden
    if (-not $p.WaitForExit($MaxMinutes * 60000)) { taskkill /PID $p.Id /T /F | Out-Null; L 'timed out, killed' }
    if ($p.HasExited -and $p.ExitCode -eq 0 -and (Test-Path $tmp)) { Move-Item -Force $tmp $f; $ok = $true }
    else { L "failed, see try-$a-$try.txt"; Get-Process chrome-headless-shell -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep 15 }
  }
  if (-not $ok) { L "GAVE UP at frame $a"; exit 1 }
}
if (-not (Test-Path "$dir/audio.aac")) {
  L 'rendering audio (scale 0.1)'
  cmd /c "npx remotion render src/index.ts $Comp $dir/audio.aac --codec=aac --scale=0.1 --concurrency=$Concurrency --timeout=180000 > `"$dir/audio.txt`" 2>&1"
  if ($LASTEXITCODE -ne 0) { L 'AUDIO FAILED'; exit 1 }
}
$list = Get-ChildItem $dir -Filter 'f*.mp4' | Sort-Object { [int]($_.BaseName.Substring(1)) } | ForEach-Object { "file '$($_.Name)'" }
Set-Content -Path "$dir/list.txt" -Value $list -Encoding ascii
L 'stitching'
cmd /c "npx remotion ffmpeg -y -f concat -safe 0 -i $dir/list.txt -i $dir/audio.aac -c:v copy -c:a copy -shortest out/$Comp.mp4 > `"$dir/stitch.txt`" 2>&1"
if ($LASTEXITCODE -ne 0) { L 'STITCH FAILED'; exit 1 }
L "ALL DONE -> out/$Comp.mp4"
