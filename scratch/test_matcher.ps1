$d = Get-Content 'js/data.js' -Raw
$b = Get-Content 'js/basic-dsa-data.js' -Raw

$script = @"
// Test topic matching logic
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

function getMatchingProblems(topicName, dataset) {
    const norm = (topicName || '').toLowerCase().trim();
    return dataset.filter(p => {
        const sec = (p.a2zSection || '').toLowerCase();
        const top = (p.topic || '').toLowerCase();
        const sub = (p.subtopic || '').toLowerCase();
        const title = (p.title || '').toLowerCase();

        switch (norm) {
            case 'arrays':
                // In data.js, 04 - Arrays has Arrays-Easy (10), Sliding Window (20), Two Pointers (5).
                // Or full 04 - Arrays section / Array topics
                return sec.includes('array') || top.includes('array') || (sub.includes('array') && !sub.includes('search'));
            case 'strings':
                return sec.includes('string') || top.includes('string');
            case 'linked list':
                return sec.includes('linked list') || top.includes('linked list');
            case 'stack':
                return sec.includes('stack') || top.includes('stack');
            case 'queue':
                return sec.includes('queue') || top.includes('queue');
            case 'recursion':
                return sec.includes('recursion') || top.includes('recursion');
            case 'sorting':
                return sec.includes('sort') || top.includes('sort') || sub.includes('sort');
            case 'binary search':
                return sec.includes('binary search') || top.includes('searching') || top.includes('binary search') || sub.includes('binary search');
            case 'bit manipulation':
                return sec.includes('bit') || top.includes('bit') || sub.includes('bit');
            case 'greedy':
                return sec.includes('greedy') || top.includes('greedy');
            case 'sliding window':
                return sub.includes('sliding window') || top.includes('sliding window') || title.includes('sliding window');
            case 'two pointer':
            case 'two pointers':
                return sub.includes('two pointer') || top.includes('two pointer') || title.includes('two pointer');
            case 'heaps':
            case 'heap':
                return sec.includes('heap') || top.includes('heap');
            case 'trees':
            case 'tree':
                return sec.includes('tree') || top.includes('tree');
            case 'graphs':
            case 'graph':
                return sec.includes('graph') || top.includes('graph');
            case 'backtracking':
                return sec.includes('backtracking') || top.includes('backtracking') || sub.includes('backtracking');
            case 'dynamic programming':
            case 'dp':
                return sec.includes('dynamic') || top.includes('dynamic') || sec.includes('dp') || top.includes('dp');
            case 'tries':
            case 'trie':
                return sec.includes('trie') || top.includes('trie');
            case 'additional practice':
                return sec.includes('learn the basics') || sec.includes('mathematics') || sec.includes('hashing') ||
                       top.includes('logical building') || top.includes('conditional') || top.includes('loops') || top.includes('functions');
            default:
                return sec.includes(norm) || top.includes(norm) || sub.includes(norm);
        }
    });
}

console.log('Testing completed.');
"@

Set-Content -Path 'scratch/test_matcher.js' -Value $script
