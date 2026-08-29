$content = Get-Content "js/basic-dsa-data.js" -Raw

# Check that BASIC_DSA_PROBLEMS array is defined
$regex = '\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*subtopic:\s*"([^"]+)",\s*difficulty:\s*"([^"]+)",\s*platform:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*level:\s*"([^"]+)",\s*mode:\s*"([^"]+)"\s*\}'
$matches = [regex]::Matches($content, $regex)

Write-Host "Total extracted problems:" $matches.Count

$ids = @()
$topics = @{}
$difficulties = @{}
$platforms = @{}

foreach ($m in $matches) {
    $id = [int]$m.Groups[1].Value
    $title = $m.Groups[2].Value
    $topic = $m.Groups[3].Value
    $subtopic = $m.Groups[4].Value
    $diff = $m.Groups[5].Value
    $plat = $m.Groups[6].Value
    $url = $m.Groups[7].Value
    $level = $m.Groups[8].Value
    $mode = $m.Groups[9].Value

    $ids += $id

    if (-not $topics.ContainsKey($topic)) { $topics[$topic] = 0 }
    $topics[$topic]++

    if (-not $difficulties.ContainsKey($diff)) { $difficulties[$diff] = 0 }
    $difficulties[$diff]++

    if (-not $platforms.ContainsKey($plat)) { $platforms[$plat] = 0 }
    $platforms[$plat]++
}

Write-Host "`n--- TOPICS BREAKDOWN ---"
$topicIndex = 1
foreach ($k in $topics.Keys) {
    Write-Host "$topicIndex. $k : $($topics[$k]) problems"
    $topicIndex++
}
Write-Host "Total Topics:" $topics.Count

Write-Host "`n--- DIFFICULTY BREAKDOWN ---"
foreach ($k in $difficulties.Keys) {
    Write-Host "$k : $($difficulties[$k]) problems"
}

Write-Host "`n--- PLATFORM BREAKDOWN ---"
foreach ($k in $platforms.Keys) {
    Write-Host "$k : $($platforms[$k]) problems"
}

Write-Host "`n--- ID RANGE ---"
Write-Host "Min ID:" ($ids | Measure-Object -Minimum).Minimum
Write-Host "Max ID:" ($ids | Measure-Object -Maximum).Maximum
$uniqueIds = $ids | Select-Object -Unique
Write-Host "Unique IDs count:" $uniqueIds.Count

if ($uniqueIds.Count -eq $matches.Count) {
    Write-Host "SUCCESS: All IDs are unique!"
} else {
    Write-Host "ERROR: Duplicate IDs found!"
}
