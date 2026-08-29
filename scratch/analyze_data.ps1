$raw = Get-Content 'js/data.js' -Raw
$matches = [regex]::Matches($raw, '"topic":\s*"([^"]+)"')
$topics = @{}
foreach ($m in $matches) {
    $t = $m.Groups[1].Value
    $topics[$t] = [int]$topics[$t] + 1
}
Write-Output "Total matches: $($matches.Count)"
$topics.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Output "$($_.Name): $($_.Value)"
}
