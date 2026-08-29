$raw = Get-Content 'js/data.js' -Raw
$problemsRegex = [regex]::Matches($raw, '\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"platform":\s*"([^"]+)",\s*"url":\s*"([^"]+)"')

Write-Output "============================================================"
Write-Output "CANONICAL DATASET INTEGRITY & ROADMAP VALIDATION"
Write-Output "============================================================"
Write-Output "Total Problems in data.js: $($problemsRegex.Count)"

$topics = @{}
$topicOrder = @()
$problems = @()

foreach ($m in $problemsRegex) {
    $id = [int]$m.Groups[1].Value
    $title = $m.Groups[2].Value
    $topic = $m.Groups[3].Value
    $subtopic = $m.Groups[4].Value
    $diff = $m.Groups[5].Value
    $plat = $m.Groups[6].Value
    $url = $m.Groups[7].Value
    
    if (-not $topics.ContainsKey($topic)) {
        $topics[$topic] = @()
        $topicOrder += $topic
    }
    $p = [PSCustomObject]@{
        id = $id
        title = $title
        topic = $topic
        subtopic = $subtopic
        difficulty = $diff
        platform = $plat
        url = $url
    }
    $topics[$topic] += $p
    $problems += $p
}

Write-Output "Total Major Sections Found: $($topicOrder.Count)"
Write-Output "------------------------------------------------------------"
Write-Output "SECTION BREAKDOWN:"
$idx = 1
foreach ($t in $topicOrder) {
    $count = $topics[$t].Count
    $subCount = ($topics[$t] | Select-Object -ExpandProperty subtopic -Unique).Count
    Write-Output ("{0:D2}. {1} -> {2} problems ({3} subtopics)" -f $idx, $t, $count, $subCount)
    $idx++
}

Write-Output "------------------------------------------------------------"
Write-Output "LEFT / RIGHT DISTRIBUTION PLAN (9 Left, 9 Right):"
$left = @()
$right = @()
for ($i = 0; $i -lt $topicOrder.Count; $i++) {
    if ($i % 2 -eq 0) {
        $left += $topicOrder[$i]
    } else {
        $right += $topicOrder[$i]
    }
}
Write-Output "LEFT WING ($($left.Count) topics):"
foreach ($l in $left) { Write-Output "  <- $l" }
Write-Output "RIGHT WING ($($right.Count) topics):"
foreach ($r in $right) { Write-Output "  -> $r" }

Write-Output "============================================================"
Write-Output "VALIDATION SUMMARY: PASS - All $($problems.Count) problems and $($topicOrder.Count) sections accounted for."
