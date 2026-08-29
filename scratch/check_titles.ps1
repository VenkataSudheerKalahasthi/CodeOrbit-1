$raw = Get-Content 'js/data.js' -Raw
$problemsRegex = [regex]::Matches($raw, '\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)"')
Write-Output "Total problems in js/data.js: $($problemsRegex.Count)"

$titles = @{}
$dupTitles = @()
foreach ($m in $problemsRegex) {
    $t = $m.Groups[2].Value.ToLower().Trim()
    if ($titles.ContainsKey($t)) {
        $dupTitles += $m.Groups[2].Value
    }
    $titles[$t] = $true
}

Write-Output "Unique titles: $($titles.Count)"
Write-Output "Duplicate title count: $($dupTitles.Count)"
Write-Output "Duplicate titles: $($dupTitles -join ', ')"
