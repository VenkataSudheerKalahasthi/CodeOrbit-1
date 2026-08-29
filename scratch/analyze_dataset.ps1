$raw = Get-Content 'js/data.js' -Raw
$regex = [regex]'\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"platform":\s*"([^"]+)",\s*"url":\s*"([^"]+)"'
$matches = $regex.Matches($raw)

Write-Output "Total Problems: $($matches.Count)"

$topics = @{}
$subtopics = @{}

foreach ($m in $matches) {
    $t = $m.Groups[3].Value
    $st = $m.Groups[4].Value
    $title = $m.Groups[2].Value

    if (-not $topics.ContainsKey($t)) { $topics[$t] = @() }
    $topics[$t] += $title

    $key = "$t -> $st"
    if (-not $subtopics.ContainsKey($key)) { $subtopics[$key] = @() }
    $subtopics[$key] += $title
}

Write-Output "`n=== TOPICS BREAKDOWN ==="
foreach ($k in ($topics.Keys | Sort-Object)) {
    Write-Output "$k : $($topics[$k].Count) problems"
}

Write-Output "`n=== SUBTOPICS BREAKDOWN ==="
foreach ($k in ($subtopics.Keys | Sort-Object)) {
    Write-Output "$k : $($subtopics[$k].Count) problems"
}
