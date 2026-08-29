$b = Get-Content 'js/basic-dsa-data.js' -Raw
$matchesB = [regex]::Matches($b, '\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*subtopic:\s*"([^"]+)"')
Write-Host "Total in basic-dsa-data.js: $($matchesB.Count)"
$bSecCounts = @{}
$bSubCounts = @{}
foreach ($m in $matchesB) {
    $top = $m.Groups[3].Value
    $sub = $m.Groups[4].Value
    $bSecCounts[$top] = [int]$bSecCounts[$top] + 1
    $key = "$top -> $sub"
    $bSubCounts[$key] = [int]$bSubCounts[$key] + 1
}

Write-Host "`n=== BASIC DSA TOPICS ==="
$bSecCounts.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key): $($_.Value)" }

Write-Host "`n=== BASIC DSA TOPICS & SUBTOPICS ==="
$bSubCounts.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key): $($_.Value)" }
