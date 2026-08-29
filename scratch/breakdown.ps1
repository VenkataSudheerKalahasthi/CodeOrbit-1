$raw = Get-Content 'js/data.js' -Raw
$problemsRegex = [regex]::Matches($raw, '\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"platform":\s*"([^"]+)",\s*"url":\s*"([^"]+)",\s*"a2zSection":\s*"([^"]+)"')

Write-Output "Parsed items from regex: $($problemsRegex.Count)"

$byTopic = @{}
$topicOrder = @()
$total = 0
foreach ($m in $problemsRegex) {
    $id = [int]$m.Groups[1].Value
    $title = $m.Groups[2].Value
    $topic = $m.Groups[3].Value
    $subtopic = $m.Groups[4].Value
    $diff = $m.Groups[5].Value
    
    if (-not $byTopic.ContainsKey($topic)) {
        $byTopic[$topic] = @()
        $topicOrder += $topic
    }
    $byTopic[$topic] += [PSCustomObject]@{
        id = $id
        title = $title
        subtopic = $subtopic
        diff = $diff
    }
    $total++
}

Write-Output "Total problems: $total in $($topicOrder.Count) topics"
foreach ($t in $topicOrder) {
    $items = $byTopic[$t]
    $subtopics = ($items | Select-Object -ExpandProperty subtopic -Unique)
    Write-Output "=== $t ($($items.Count) problems) ==="
    Write-Output "   Subtopics: $($subtopics -join ' | ')"
}
