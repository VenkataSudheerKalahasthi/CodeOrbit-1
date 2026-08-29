# Parse data.js and basic-dsa-data.js in powershell to test counts for each of 19 topics
$d = Get-Content 'js/data.js' -Raw
$problemsRegex = [regex]::Matches($d, '\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"topic":\s*"([^"]+)",\s*"subtopic":\s*"([^"]+)",\s*"difficulty":\s*"([^"]+)",\s*"platform":\s*"([^"]+)",\s*"url":\s*"([^"]+)",\s*"a2zSection":\s*"([^"]+)"')
$pList = @()
foreach ($m in $problemsRegex) {
    $pList += [PSCustomObject]@{
        id = [int]$m.Groups[1].Value
        title = $m.Groups[2].Value
        topic = $m.Groups[3].Value
        subtopic = $m.Groups[4].Value
        difficulty = $m.Groups[5].Value
        platform = $m.Groups[6].Value
        url = $m.Groups[7].Value
        a2zSection = $m.Groups[8].Value
    }
}

$orbital19 = @(
    'Arrays',
    'Strings',
    'Linked List',
    'Stack',
    'Queue',
    'Recursion',
    'Sorting',
    'Binary Search',
    'Bit Manipulation',
    'Greedy',
    'Sliding Window',
    'Two Pointer',
    'Heaps',
    'Trees',
    'Graphs',
    'Backtracking',
    'Dynamic Programming',
    'Tries',
    'Additional Practice'
)

function Get-MatchingCount($topicName, $list) {
    $norm = $topicName.ToLower().Trim()
    $matches = $list | Where-Object {
        $sec = ($_.a2zSection + '').ToLower()
        $top = ($_.topic + '').ToLower()
        $sub = ($_.subtopic + '').ToLower()
        $title = ($_.title + '').ToLower()

        switch ($norm) {
            'arrays' { return $sec.Contains('array') -or $top.Contains('array') }
            'strings' { return $sec.Contains('string') -or $top.Contains('string') }
            'linked list' { return $sec.Contains('linked list') -or $top.Contains('linked list') }
            'stack' { return $sec.Contains('stack') -or $top.Contains('stack') }
            'queue' { return $sec.Contains('queue') -or $top.Contains('queue') }
            'recursion' { return $sec.Contains('recursion') -or $top.Contains('recursion') }
            'sorting' { return $sec.Contains('sort') -or $top.Contains('sort') -or $sub.Contains('sort') }
            'binary search' { return $sec.Contains('binary search') -or $top.Contains('searching') -or $top.Contains('binary search') -or $sub.Contains('binary search') }
            'bit manipulation' { return $sec.Contains('bit') -or $top.Contains('bit') -or $sub.Contains('bit') }
            'greedy' { return $sec.Contains('greedy') -or $top.Contains('greedy') }
            'sliding window' { return $sub.Contains('sliding window') -or $top.Contains('sliding window') -or $title.Contains('sliding window') }
            'two pointer' { return $sub.Contains('two pointer') -or $top.Contains('two pointer') -or $title.Contains('two pointer') }
            'heaps' { return $sec.Contains('heap') -or $top.Contains('heap') }
            'trees' { return $sec.Contains('tree') -or $top.Contains('tree') }
            'graphs' { return $sec.Contains('graph') -or $top.Contains('graph') }
            'backtracking' { return $sec.Contains('backtracking') -or $top.Contains('backtracking') -or $sub.Contains('backtracking') }
            'dynamic programming' { return $sec.Contains('dynamic') -or $top.Contains('dynamic') -or $sec.Contains('dp') -or $top.Contains('dp') }
            'tries' { return $sec.Contains('trie') -or $top.Contains('trie') }
            'additional practice' {
                return $sec.Contains('learn the basics') -or $sec.Contains('mathematics') -or $sec.Contains('hashing') -or
                       $top.Contains('logical building') -or $top.Contains('conditional') -or $top.Contains('loops') -or $top.Contains('functions')
            }
            default { return $sec.Contains($norm) -or $top.Contains($norm) }
        }
    }
    return $matches.Count
}

Write-Host "=== COUNTS FOR 19 ORBITAL TOPICS (Medium-Advanced) ==="
foreach ($t in $orbital19) {
    $count = Get-MatchingCount $t $pList
    Write-Host "$t : $count problems"
}
