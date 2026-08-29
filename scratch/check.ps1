$d = Get-Content 'js/data.js' -Raw
$matchesSub = [regex]::Matches($d, '"subtopic":\s*"([^"]+)"')
$subtopics = $matchesSub | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "=== DATA.JS SUBTOPICS ==="
$subtopics

$b = Get-Content 'js/basic-dsa-data.js' -Raw
$matchesSubB = [regex]::Matches($b, 'subtopic:\s*"([^"]+)"')
$subtopicsB = $matchesSubB | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "`n=== BASIC-DSA-DATA.JS SUBTOPICS ==="
$subtopicsB
