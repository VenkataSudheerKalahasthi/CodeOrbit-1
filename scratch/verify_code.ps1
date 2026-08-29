# Verification script for pause on hover
$css = Get-Content 'css/style.css' -Raw
$circles = Get-Content 'js/Circles.js' -Raw

if ($css -match 'animation-play-state:\s*paused\s*!important;') {
    Write-Host "[PASS] animation-play-state: paused rule exists in style.css"
} else {
    Write-Host "[FAIL] animation-play-state: paused rule missing in style.css"
}

if ($circles -match "container\.classList\.add\('orbit-paused'\)" -and $circles -match "container\.classList\.remove\('orbit-paused'\)") {
    Write-Host "[PASS] orbit-paused class toggle exists in Circles.js"
} else {
    Write-Host "[FAIL] orbit-paused class toggle missing in Circles.js"
}
