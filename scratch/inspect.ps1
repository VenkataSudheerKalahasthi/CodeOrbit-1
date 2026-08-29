$d = Get-Content 'js/data.js' -Raw
# Extract all objects in PROBLEMS
$problemMatches = [regex]::Matches($d, '\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"platform":\s*"([^"]+)",\s*"url":\s*"([^"]+)",\s*"a2zSection":\s*"([^"]+)"')

Write-Host "Total extracted from data.js: $($problemMatches.Count)"

$sectionCounts = @{}
$subtopicCounts = @{}
foreach ($m in $problemMatches) {
    $sec = $m.Groups[8].Value
    $sub = $m.Groups[4].Value
    $sectionCounts[$sec] = [int]$sectionCounts[$sec] + 1
    $key = "$sec -> $sub"
    $subtopicCounts[$key] = [int]$subtopicCounts[$key] + 1
}

Write-Host "`n=== DATA.JS SECTIONS ==="
$sectionCounts.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key): $($_.Value)" }

Write-Host "`n=== DATA.JS SECTIONS & SUBTOPICS ==="
$subtopicCounts.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key): $($_.Value)" }
