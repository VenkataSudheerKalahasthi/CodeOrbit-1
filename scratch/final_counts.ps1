# Test the refined matching logic
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

$b = Get-Content 'js/basic-dsa-data.js' -Raw
$bRegex = [regex]::Matches($b, '\{\s*id:\s*(\d+),\s*title:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*subtopic:\s*"([^"]+)"')
$bList = @()
foreach ($m in $bRegex) {
    $bList += [PSCustomObject]@{
        id = [int]$m.Groups[1].Value
        title = $m.Groups[2].Value
        topic = $m.Groups[3].Value
        subtopic = $m.Groups[4].Value
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

function Match-Problems($topicName, $list) {
    $norm = $topicName.ToLower().Trim()
    return $list | Where-Object {
        $sec = ($_.a2zSection + '').ToLower()
        $top = ($_.topic + '').ToLower()
        $sub = ($_.subtopic + '').ToLower()
        $title = ($_.title + '').ToLower()

        switch ($norm) {
            'arrays' { return $sec.Contains('04 - arrays') -or ($sec.Contains('array') -and -not $sec.Contains('01')) -or $top -eq 'arrays' -or $top -eq 'matrix' }
            'strings' { return $sec.Contains('06 - strings') -or ($sec.Contains('string') -and -not $sec.Contains('01')) -or $top -eq 'strings' -or $top -eq 'string frequency counting' }
            'linked list' { return $sec.Contains('08 - linked list') -or $sec.Contains('linked list') -or $top.Contains('linked list') }
            'stack' { return $sec.Contains('09 - stacks') -or ($sec.Contains('stack') -and -not $sec.Contains('queue')) -or ($top.Contains('stack') -and -not $top.Contains('queue')) }
            'queue' { return ($sec.Contains('10 - queues') -or $sec.Contains('queue') -or $top.Contains('queue')) -and -not $sec.Contains('heaps') -and -not $sec.Contains('priority') }
            'recursion' { return $sec.Contains('11 - recursion') -or $sec.Contains('recursion') -or $top.Contains('recursion') }
            'sorting' { return $sec.Contains('sort') -or $top -eq 'sorting' -or $top.Contains('sort') -or $sub.Contains('sort') }
            'binary search' { return $sec.Contains('07 - binary search') -or $sec.Contains('binary search') -or $top.Contains('searching') -or $top.Contains('binary search') -or $sub.Contains('binary search') }
            'bit manipulation' { return $sec.Contains('03 - bit manipulation') -or ($sec.Contains('bit') -and -not $sec.Contains('01')) -or $top.Contains('bit') -or $top -eq 'logical building' }
            'greedy' { return $sec.Contains('13 - greedy') -or $sec.Contains('greedy') -or $top.Contains('greedy') }
            'sliding window' { return $sub.Contains('sliding window') -or $top.Contains('sliding window') -or $title.Contains('sliding window') }
            'two pointer' { return $sub.Contains('two pointer') -or $top.Contains('two pointer') -or $title.Contains('two pointer') }
            'heaps' { return $sec.Contains('14 - heaps') -or $sec.Contains('heap') -or $top.Contains('heap') }
            'trees' { return $sec.Contains('15 - binary trees') -or $sec.Contains('tree') -or $top.Contains('tree') }
            'graphs' { return $sec.Contains('17 - graphs') -or $sec.Contains('graph') -or $top.Contains('graph') }
            'backtracking' { return $sec.Contains('12 - backtracking') -or $sec.Contains('backtracking') -or $top.Contains('backtracking') -or $sub.Contains('backtracking') }
            'dynamic programming' { return $sec.Contains('18 - dynamic programming') -or $sec.Contains('dynamic') -or $top.Contains('dynamic') -or $sec.Contains('dp') -or $top.Contains('dp') }
            'tries' { return $sec.Contains('16 - trie') -or $sec.Contains('trie') -or $top.Contains('trie') }
            'additional practice' {
                return $sec.Contains('learn the basics') -or $sec.Contains('mathematics') -or $sec.Contains('hashing') -or
                       $top.Contains('logical building') -or $top.Contains('conditional') -or $top.Contains('loops') -or $top.Contains('functions')
            }
            default { return $sec.Contains($norm) -or $top.Contains($norm) -or $sub.Contains($norm) }
        }
    }
}

Write-Host "=== FINAL COUNTS TEST FOR ALL 19 TOPICS (Medium-Advanced Dataset) ==="
foreach ($t in $orbital19) {
    $res = Match-Problems $t $pList
    if ($res.Count -eq 0) {
        $res = Match-Problems $t $bList
    }
    Write-Host "$t : $($res.Count) problems"
}
