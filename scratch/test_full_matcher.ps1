$d = Get-Content 'js/data.js' -Raw
$b = Get-Content 'js/basic-dsa-data.js' -Raw

$testFull = @"
// Full Verification of 19 Orbital Topics Mapping
const orbitalTopics = [
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
];

function getTopicProgress(topicName, activeDataset, allProblems, userCompletedSet) {
    const norm = (topicName || '').toLowerCase().trim();
    const completedSet = userCompletedSet || new Set();

    function matchProblem(p) {
        const sec = (p.a2zSection || '').toLowerCase();
        const top = (p.topic || '').toLowerCase();
        const sub = (p.subtopic || '').toLowerCase();
        const title = (p.title || '').toLowerCase();

        switch (norm) {
            case 'arrays':
                return sec.includes('04 - arrays') || sec.includes('arrays') || top.includes('arrays') || top.includes('matrix') || (sub.includes('array') && !sub.includes('search'));
            case 'strings':
                return sec.includes('06 - strings') || sec.includes('strings') || top.includes('strings') || top.includes('string frequency');
            case 'linked list':
                return sec.includes('08 - linked list') || sec.includes('linked list') || top.includes('linked list');
            case 'stack':
                return sec.includes('09 - stacks') || (sec.includes('stack') && !sec.includes('queue')) || (top.includes('stack') && !top.includes('queue'));
            case 'queue':
                return (sec.includes('10 - queues') || sec.includes('queue') || top.includes('queue')) && !sec.includes('heaps') && !sec.includes('priority');
            case 'recursion':
                return sec.includes('11 - recursion') || sec.includes('recursion') || top.includes('recursion');
            case 'sorting':
                return sec.includes('sort') || top.includes('sorting') || top.includes('sort') || sub.includes('sort');
            case 'binary search':
                return sec.includes('07 - binary search') || sec.includes('binary search') || top.includes('searching') || top.includes('binary search') || sub.includes('binary search');
            case 'bit manipulation':
                return sec.includes('03 - bit manipulation') || sec.includes('bit') || top.includes('bit');
            case 'greedy':
                return sec.includes('13 - greedy') || sec.includes('greedy') || top.includes('greedy');
            case 'sliding window':
                return sub.includes('sliding window') || top.includes('sliding window') || title.includes('sliding window');
            case 'two pointer':
            case 'two pointers':
                return sub.includes('two pointer') || top.includes('two pointer') || title.includes('two pointer');
            case 'heaps':
            case 'heap':
                return sec.includes('14 - heaps') || sec.includes('heap') || top.includes('heap');
            case 'trees':
            case 'tree':
                return sec.includes('15 - binary trees') || sec.includes('tree') || top.includes('tree');
            case 'graphs':
                return sec.includes('17 - graphs') || sec.includes('graph') || top.includes('graph');
            case 'backtracking':
                return sec.includes('12 - backtracking') || sec.includes('backtracking') || top.includes('backtracking') || sub.includes('backtracking');
            case 'dynamic programming':
            case 'dp':
                return sec.includes('18 - dynamic programming') || sec.includes('dynamic') || top.includes('dynamic') || sec.includes('dp') || top.includes('dp');
            case 'tries':
            case 'trie':
                return sec.includes('16 - trie') || sec.includes('trie') || top.includes('trie');
            case 'additional practice':
                return sec.includes('learn the basics') || sec.includes('mathematics') || sec.includes('hashing') ||
                       top.includes('logical building') || top.includes('conditional') || top.includes('loops') || top.includes('functions');
            default:
                return sec.includes(norm) || top.includes(norm) || sub.includes(norm);
        }
    }

    let matching = (activeDataset || []).filter(matchProblem);
    if (matching.length === 0 && allProblems && Array.isArray(allProblems)) {
        matching = allProblems.filter(matchProblem);
    }

    const total = matching.length;
    const completed = matching.filter(p => completedSet.has(p.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
        topic: topicName,
        total,
        completed,
        percentage,
        problemIds: matching.map(p => p.id)
    };
}
"@

Set-Content -Path 'scratch/test_full_matcher.ps1' -Value $testFull
