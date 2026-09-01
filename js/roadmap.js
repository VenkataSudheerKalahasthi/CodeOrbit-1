/**
 * CodeOrbit — True Graphical Mind-Map DSA Roadmap
 * Interactive Pan & Zoom Canvas, Curved SVG Branch Connectors,
 * 18 Balanced Left/Right Outward Branching Phases.
 * Completely decoupled from the DSA Mastery problem dataset.
 */

(function () {
    "use strict";

    const ROADMAP_PHASES = [
        {
            id: 1,
            phaseNum: "01",
            title: "Learn the Basics",
            icon: "📘",
            tier: "Foundation",
            tierClass: "tier-foundation",
            accentColor: "#38bdf8",
            glowColor: "rgba(56, 189, 248, 0.4)",
            bgColor: "rgba(56, 189, 248, 0.08)",
            description: "Core syntax, logic, loops, functions, and complexity analysis.",
            concepts: [
                {
                    name: "Programming Fundamentals",
                    subconcepts: ["Variables", "Data Types", "Input / Output", "Operators", "Type Conversion"]
                },
                {
                    name: "Conditional Logic",
                    subconcepts: ["if", "else", "else-if", "Nested Conditions"]
                },
                {
                    name: "Loops",
                    subconcepts: ["for", "while", "do-while", "Nested Loops", "Loop Control"]
                },
                {
                    name: "Functions",
                    subconcepts: ["Parameters", "Return Values", "Scope", "Recursion Introduction"]
                },
                {
                    name: "Arrays & Strings Fundamentals",
                    subconcepts: ["Array Traversal", "Array Operations", "String Operations", "Basic Complexity"]
                },
                {
                    name: "Time & Space Complexity",
                    subconcepts: ["Big-O", "Big-Theta", "Big-Omega", "Best / Average / Worst Case", "Auxiliary Space"]
                }
            ]
        },
        {
            id: 2,
            phaseNum: "02",
            title: "Mathematics",
            icon: "🔢",
            tier: "Foundation",
            tierClass: "tier-foundation",
            accentColor: "#10b981",
            glowColor: "rgba(16, 185, 129, 0.4)",
            bgColor: "rgba(16, 185, 129, 0.08)",
            description: "Number theory, modular arithmetic, bases, and combinatorics.",
            concepts: [
                {
                    name: "Number Theory",
                    subconcepts: ["Divisibility", "Factors", "Prime Numbers", "GCD", "LCM"]
                },
                {
                    name: "Modular Arithmetic",
                    subconcepts: ["Modulo Properties", "Modular Addition", "Modular Multiplication", "Modular Exponentiation"]
                },
                {
                    name: "Number Representation",
                    subconcepts: ["Decimal", "Binary", "Hexadecimal", "Base Conversion"]
                },
                {
                    name: "Mathematical Algorithms",
                    subconcepts: ["Sieve of Eratosthenes", "Fast Power", "Euclidean Algorithm", "Factorization"]
                },
                {
                    name: "Combinatorics",
                    subconcepts: ["Permutations", "Combinations", "Pascal's Triangle", "Counting Principles"]
                }
            ]
        },
        {
            id: 3,
            phaseNum: "03",
            title: "Bit Manipulation",
            icon: "⚙️",
            tier: "Foundation",
            tierClass: "tier-foundation",
            accentColor: "#a855f7",
            glowColor: "rgba(168, 85, 247, 0.4)",
            bgColor: "rgba(168, 85, 247, 0.08)",
            description: "Binary operations, bit tricks, XOR properties, and bitmasking.",
            concepts: [
                {
                    name: "Bitwise Operators",
                    subconcepts: ["AND", "OR", "XOR", "NOT", "Bit Shifts"]
                },
                {
                    name: "Bit Tricks",
                    subconcepts: ["Check Odd / Even", "Check / Set Bit", "Clear Bit", "Toggle Bit", "Lowest Set Bit"]
                },
                {
                    name: "XOR Techniques",
                    subconcepts: ["Single Number", "XOR Properties", "XOR Prefix"]
                },
                {
                    name: "Bit Counting",
                    subconcepts: ["Brian Kernighan's Algorithm", "Population Count"]
                },
                {
                    name: "Advanced Bit Techniques",
                    subconcepts: ["Bitmasking", "Subset Enumeration", "Bitwise Optimization"]
                }
            ]
        },
        {
            id: 4,
            phaseNum: "04",
            title: "Arrays",
            icon: "📊",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#f59e0b",
            glowColor: "rgba(245, 158, 11, 0.4)",
            bgColor: "rgba(245, 158, 11, 0.08)",
            description: "Prefix sums, two pointers, sliding window, and matrix patterns.",
            concepts: [
                {
                    name: "Array Fundamentals",
                    subconcepts: ["Traversal", "Insertion / Deletion", "In-place Operations"]
                },
                {
                    name: "Prefix Techniques",
                    subconcepts: ["Prefix Sum", "Difference Array", "Prefix XOR"]
                },
                {
                    name: "Two Pointers",
                    subconcepts: ["Opposite Direction", "Same Direction", "Fast / Slow Pointer"]
                },
                {
                    name: "Sliding Window",
                    subconcepts: ["Fixed Window", "Variable Window", "Frequency Window"]
                },
                {
                    name: "Matrix",
                    subconcepts: ["Matrix Traversal", "Rotation", "Spiral Traversal", "In-place Matrix Operations"]
                },
                {
                    name: "Array Optimization",
                    subconcepts: ["Kadane's Algorithm", "Dutch National Flag", "In-place Rearrangement"]
                }
            ]
        },
        {
            id: 5,
            phaseNum: "05",
            title: "Hashing",
            icon: "🔑",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#06b6d4",
            glowColor: "rgba(6, 182, 212, 0.4)",
            bgColor: "rgba(6, 182, 212, 0.08)",
            description: "Hash tables, frequency mapping, subarray sum patterns, and custom keys.",
            concepts: [
                {
                    name: "Hash Tables",
                    subconcepts: ["Hash Functions", "Hash Map", "Hash Set"]
                },
                {
                    name: "Frequency Mapping",
                    subconcepts: ["Frequency Counting", "Duplicate Detection", "Character Frequency"]
                },
                {
                    name: "Prefix Hashing",
                    subconcepts: ["Prefix Frequency", "Prefix Sum + Hashing"]
                },
                {
                    name: "Hashing Patterns",
                    subconcepts: ["Two Sum Pattern", "Subarray Sum Pattern", "Grouping", "Lookup Optimization"]
                },
                {
                    name: "Advanced Hashing",
                    subconcepts: ["Custom Keys", "Ordered vs Unordered Maps", "Collision Concepts"]
                }
            ]
        },
        {
            id: 6,
            phaseNum: "06",
            title: "Strings",
            icon: "🔤",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#f43f5e",
            glowColor: "rgba(244, 63, 94, 0.4)",
            bgColor: "rgba(244, 63, 94, 0.08)",
            description: "Pattern matching, palindromes, sliding window, KMP, and rolling hash.",
            concepts: [
                {
                    name: "String Fundamentals",
                    subconcepts: ["Traversal", "Character Operations", "String Construction"]
                },
                {
                    name: "String Matching",
                    subconcepts: ["Brute Force", "Pattern Matching", "Prefix Concepts"]
                },
                {
                    name: "Palindromes",
                    subconcepts: ["Palindrome Check", "Expand Around Center", "Palindromic Substrings"]
                },
                {
                    name: "String Sliding Window",
                    subconcepts: ["Frequency Window", "Anagram Window", "Longest Substring"]
                },
                {
                    name: "String Algorithms",
                    subconcepts: ["KMP", "Z Algorithm", "Rolling Hash"]
                }
            ]
        },
        {
            id: 7,
            phaseNum: "07",
            title: "Binary Search",
            icon: "🔍",
            tier: "Core Algorithms",
            tierClass: "tier-algorithms",
            accentColor: "#6366f1",
            glowColor: "rgba(99, 102, 241, 0.4)",
            bgColor: "rgba(99, 102, 241, 0.08)",
            description: "Bounds, rotated searches, binary search on answers, and peak finding.",
            concepts: [
                {
                    name: "Binary Search Fundamentals",
                    subconcepts: ["Standard Binary Search", "Lower Bound", "Upper Bound"]
                },
                {
                    name: "Search Variations",
                    subconcepts: ["First / Last Occurrence", "Rotated Arrays", "Duplicate Elements"]
                },
                {
                    name: "Binary Search on Answer",
                    subconcepts: ["Feasibility Function", "Minimum Possible Answer", "Maximum Possible Answer"]
                },
                {
                    name: "Advanced Search",
                    subconcepts: ["Search on Monotonic Functions", "Matrix Search", "Peak Finding"]
                }
            ]
        },
        {
            id: 8,
            phaseNum: "08",
            title: "Linked List",
            icon: "🔗",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#84cc16",
            glowColor: "rgba(132, 204, 22, 0.4)",
            bgColor: "rgba(132, 204, 22, 0.08)",
            description: "Singly/doubly lists, fast & slow pointers, reversal, and cycle detection.",
            concepts: [
                {
                    name: "Linked List Fundamentals",
                    subconcepts: ["Singly Linked List", "Doubly Linked List", "Circular Linked List"]
                },
                {
                    name: "Pointer Techniques",
                    subconcepts: ["Fast / Slow Pointer", "Multiple Pointers", "Reversal"]
                },
                {
                    name: "List Operations",
                    subconcepts: ["Insert", "Delete", "Reverse", "Merge"]
                },
                {
                    name: "Advanced Linked Lists",
                    subconcepts: ["Cycle Detection", "Intersection", "Random Pointer", "Reordering"]
                }
            ]
        },
        {
            id: 9,
            phaseNum: "09",
            title: "Stacks",
            icon: "🥞",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#d946ef",
            glowColor: "rgba(217, 70, 239, 0.4)",
            bgColor: "rgba(217, 70, 239, 0.08)",
            description: "LIFO operations, monotonic stacks, expression parsing, and min stacks.",
            concepts: [
                {
                    name: "Stack Fundamentals",
                    subconcepts: ["Push", "Pop", "Peek", "Applications"]
                },
                {
                    name: "Monotonic Stack",
                    subconcepts: ["Next Greater Element", "Next Smaller Element", "Previous Greater / Smaller"]
                },
                {
                    name: "Expression Processing",
                    subconcepts: ["Parentheses", "Infix", "Prefix", "Postfix"]
                },
                {
                    name: "Stack-Based Problems",
                    subconcepts: ["Histogram", "Min Stack", "Expression Evaluation"]
                }
            ]
        },
        {
            id: 10,
            phaseNum: "10",
            title: "Queues",
            icon: "🚶‍♂️",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#fb923c",
            glowColor: "rgba(251, 146, 60, 0.4)",
            bgColor: "rgba(251, 146, 60, 0.08)",
            description: "FIFO structures, deques, BFS layer traversals, and buffer scheduling.",
            concepts: [
                {
                    name: "Queue Fundamentals",
                    subconcepts: ["FIFO", "Enqueue", "Dequeue"]
                },
                {
                    name: "Queue Variations",
                    subconcepts: ["Circular Queue", "Deque", "Priority Queue Introduction"]
                },
                {
                    name: "BFS Foundation",
                    subconcepts: ["Level Processing", "Layer Traversal", "Shortest Unweighted Path"]
                },
                {
                    name: "Queue Applications",
                    subconcepts: ["Scheduling", "Sliding Window", "Simulation"]
                }
            ]
        },
        {
            id: 11,
            phaseNum: "11",
            title: "Recursion",
            icon: "🔄",
            tier: "Core Algorithms",
            tierClass: "tier-algorithms",
            accentColor: "#0284c7",
            glowColor: "rgba(2, 132, 199, 0.4)",
            bgColor: "rgba(2, 132, 199, 0.08)",
            description: "Call stack unwinding, tree recursion, divide & conquer, and memoization.",
            concepts: [
                {
                    name: "Recursion Fundamentals",
                    subconcepts: ["Base Case", "Recursive Case", "Call Stack"]
                },
                {
                    name: "Recursion Patterns",
                    subconcepts: ["Linear Recursion", "Tree Recursion", "Divide and Conquer"]
                },
                {
                    name: "Recursive Data Structures",
                    subconcepts: ["Trees", "Linked Lists"]
                },
                {
                    name: "Recursion Optimization",
                    subconcepts: ["Memoization", "Tail Recursion Concepts"]
                }
            ]
        },
        {
            id: 12,
            phaseNum: "12",
            title: "Backtracking",
            icon: "♟️",
            tier: "Core Algorithms",
            tierClass: "tier-algorithms",
            accentColor: "#e11d48",
            glowColor: "rgba(225, 29, 72, 0.4)",
            bgColor: "rgba(225, 29, 72, 0.08)",
            description: "Decision trees, choose-explore-undo, permutations, and constraint searches.",
            concepts: [
                {
                    name: "Backtracking Fundamentals",
                    subconcepts: ["Decision Tree", "Choose", "Explore", "Undo"]
                },
                {
                    name: "Subsets",
                    subconcepts: ["Generate Subsets", "Duplicate Handling"]
                },
                {
                    name: "Permutations",
                    subconcepts: ["Basic Permutations", "Duplicate Permutations"]
                },
                {
                    name: "Combinations",
                    subconcepts: ["Combination Generation", "Combination Constraints"]
                },
                {
                    name: "Constraint Search",
                    subconcepts: ["N-Queens", "Sudoku", "Word Search"]
                }
            ]
        },
        {
            id: 13,
            phaseNum: "13",
            title: "Greedy",
            icon: "💎",
            tier: "Core Algorithms",
            tierClass: "tier-algorithms",
            accentColor: "#9333ea",
            glowColor: "rgba(147, 51, 234, 0.4)",
            bgColor: "rgba(147, 51, 234, 0.08)",
            description: "Locally optimal choices, interval scheduling, sorting + greedy proofs.",
            concepts: [
                {
                    name: "Greedy Fundamentals",
                    subconcepts: ["Local Optimal Choice", "Global Optimality", "Greedy Proof"]
                },
                {
                    name: "Interval Problems",
                    subconcepts: ["Activity Selection", "Interval Scheduling", "Interval Merging"]
                },
                {
                    name: "Greedy Optimization",
                    subconcepts: ["Sorting + Greedy", "Two Pointers + Greedy", "Heap + Greedy"]
                },
                {
                    name: "Advanced Greedy",
                    subconcepts: ["Fractional Optimization", "Resource Allocation", "Scheduling"]
                }
            ]
        },
        {
            id: 14,
            phaseNum: "14",
            title: "Heaps & Priority Queues",
            icon: "⛰️",
            tier: "Core Data Structures",
            tierClass: "tier-structures",
            accentColor: "#eab308",
            glowColor: "rgba(234, 179, 8, 0.4)",
            bgColor: "rgba(234, 179, 8, 0.08)",
            description: "Min/max heaps, heapify, Top-K patterns, and two-heap median tracking.",
            concepts: [
                {
                    name: "Heap Fundamentals",
                    subconcepts: ["Min Heap", "Max Heap", "Heapify", "Build Heap"]
                },
                {
                    name: "Priority Queue",
                    subconcepts: ["Insert", "Extract", "Priority Processing"]
                },
                {
                    name: "Top-K Patterns",
                    subconcepts: ["K Largest", "K Smallest", "Frequency + Heap"]
                },
                {
                    name: "Two Heap Technique",
                    subconcepts: ["Median", "Running Median", "Dynamic Partitioning"]
                }
            ]
        },
        {
            id: 15,
            phaseNum: "15",
            title: "Binary Trees",
            icon: "🌲",
            tier: "Advanced DSA",
            tierClass: "tier-advanced",
            accentColor: "#14b8a6",
            glowColor: "rgba(20, 184, 166, 0.4)",
            bgColor: "rgba(20, 184, 166, 0.08)",
            description: "DFS/BFS traversals, BST operations, LCA, tree diameter, and tree DP.",
            concepts: [
                {
                    name: "Tree Fundamentals",
                    subconcepts: ["Nodes", "Height", "Depth", "Tree Properties"]
                },
                {
                    name: "Traversals",
                    subconcepts: ["Preorder", "Inorder", "Postorder", "Level Order"]
                },
                {
                    name: "Binary Search Trees",
                    subconcepts: ["Search", "Insert", "Delete", "BST Properties"]
                },
                {
                    name: "Tree Techniques",
                    subconcepts: ["Lowest Common Ancestor", "Diameter", "Path Sum", "Tree Construction"]
                },
                {
                    name: "Advanced Trees",
                    subconcepts: ["Balanced Trees Concepts", "Tree DP", "Serialization"]
                }
            ]
        },
        {
            id: 16,
            phaseNum: "16",
            title: "Trie",
            icon: "🌿",
            tier: "Advanced DSA",
            tierClass: "tier-advanced",
            accentColor: "#ec4899",
            glowColor: "rgba(236, 72, 153, 0.4)",
            bgColor: "rgba(236, 72, 153, 0.08)",
            description: "Prefix trees, autocomplete, dictionary trees, and bitwise binary trie.",
            concepts: [
                {
                    name: "Trie Fundamentals",
                    subconcepts: ["Trie Node", "Insert", "Search", "Prefix Search"]
                },
                {
                    name: "Prefix Processing",
                    subconcepts: ["Prefix Matching", "Prefix Counting", "Autocomplete"]
                },
                {
                    name: "Advanced Trie",
                    subconcepts: ["Word Dictionary", "Word Break Concepts", "Trie + DFS"]
                },
                {
                    name: "Binary Trie",
                    subconcepts: ["Bitwise Trie", "Maximum XOR", "XOR Queries"]
                }
            ]
        },
        {
            id: 17,
            phaseNum: "17",
            title: "Graphs",
            icon: "🕸️",
            tier: "Advanced DSA",
            tierClass: "tier-advanced",
            accentColor: "#0ea5e9",
            glowColor: "rgba(14, 165, 233, 0.4)",
            bgColor: "rgba(14, 165, 233, 0.08)",
            description: "BFS/DFS, Topological Sort, Dijkstra/Bellman-Ford, MST, and DSU.",
            concepts: [
                {
                    name: "Graph Fundamentals",
                    subconcepts: ["Vertices", "Edges", "Directed Graph", "Undirected Graph"]
                },
                {
                    name: "Graph Representation",
                    subconcepts: ["Adjacency Matrix", "Adjacency List", "Edge List"]
                },
                {
                    name: "Traversals",
                    subconcepts: ["BFS", "DFS"]
                },
                {
                    name: "Connectivity",
                    subconcepts: ["Connected Components", "Cycle Detection", "Bipartite Graph"]
                },
                {
                    name: "Topological Algorithms",
                    subconcepts: ["Topological Sort", "Kahn's Algorithm", "Course Scheduling"]
                },
                {
                    name: "Shortest Paths",
                    subconcepts: ["BFS Shortest Path", "Dijkstra", "Bellman-Ford", "Floyd-Warshall"]
                },
                {
                    name: "Minimum Spanning Tree",
                    subconcepts: ["Kruskal", "Prim"]
                },
                {
                    name: "Advanced Graph Concepts",
                    subconcepts: ["Union Find / DSU", "Bridges", "Articulation Points"]
                }
            ]
        },
        {
            id: 18,
            phaseNum: "18",
            title: "Dynamic Programming",
            icon: "⚡",
            tier: "Advanced DSA",
            tierClass: "tier-advanced",
            accentColor: "#ef4444",
            glowColor: "rgba(239, 68, 68, 0.4)",
            bgColor: "rgba(239, 68, 68, 0.08)",
            description: "State transitions, 1D/2D DP, Knapsack, LCS/LIS, interval & bitmask DP.",
            concepts: [
                {
                    name: "DP Fundamentals",
                    subconcepts: ["Overlapping Subproblems", "Optimal Substructure", "State", "Transition"]
                },
                {
                    name: "1D DP",
                    subconcepts: ["Climbing Stairs", "House Robber Pattern", "Linear State DP"]
                },
                {
                    name: "2D DP",
                    subconcepts: ["Grid DP", "Path Problems", "Matrix State"]
                },
                {
                    name: "Knapsack Patterns",
                    subconcepts: ["0/1 Knapsack", "Unbounded Knapsack", "Subset Sum"]
                },
                {
                    name: "String DP",
                    subconcepts: ["LCS", "LIS", "Edit Distance", "Palindromic DP"]
                },
                {
                    name: "Interval DP",
                    subconcepts: ["Range States", "Partition DP", "Matrix Chain Concepts"]
                },
                {
                    name: "Advanced DP",
                    subconcepts: ["State Compression", "Bitmask DP", "Tree DP", "DP Optimization"]
                }
            ]
        }
    ];

    const TOPIC_EXPLORER_DATA = {
        structures: {
            title: "DATA STRUCTURES",
            subtitle: "Data structures covered across the 372 DSA problems",
            icon: "🧱",
            accent: "#38bdf8",
            glow: "rgba(56, 189, 248, 0.25)",
            primaryTitle: "INCLUDED IN 372 PROBLEMS",
            primaryDesc: "Data structures directly practiced and evaluated in the canonical problem database.",
            items: [
                {
                    name: "Arrays & 2D Matrices",
                    count: "35+ Problems",
                    badge: "Core Linear Structure",
                    desc: "Contiguous memory structures supporting O(1) random access, prefix arrays, sliding subarrays, and in-place matrix rotations.",
                    tags: ["Static & Dynamic Arrays", "2D Grids", "Prefix Sums"]
                },
                {
                    name: "Strings",
                    count: "20+ Problems",
                    badge: "Character Sequences",
                    desc: "Character sequence structures with frequency arrays, anagram checks, palindrome transformations, and substring algorithms.",
                    tags: ["Substring Windows", "Palindromes", "Character Hashing"]
                },
                {
                    name: "Linked Lists",
                    count: "20 Problems",
                    badge: "Pointer Linked",
                    desc: "Node-pointer chains with O(1) insertion/deletion given pointer. Singly, doubly, and circular linked lists with pointer reversals.",
                    tags: ["Singly / Doubly Linked", "Fast & Slow Pointers", "Reversals"]
                },
                {
                    name: "Stacks",
                    count: "20 Problems",
                    badge: "LIFO Collection",
                    desc: "Last-In-First-Out linear structure. Monotonic stacks for next-greater elements, parenthesis validation, and expression parsing.",
                    tags: ["Monotonic Stack", "LIFO", "Expression Parsing"]
                },
                {
                    name: "Queues & Deques",
                    count: "20 Problems",
                    badge: "FIFO Collection",
                    desc: "First-In-First-Out queues, circular buffers, and double-ended queues (deque) for sliding window maximum and level-order traversals.",
                    tags: ["FIFO Queue", "Double-ended Deque", "Circular Buffer"]
                },
                {
                    name: "Hash Tables & Sets",
                    count: "20 Problems",
                    badge: "Direct Key Indexing",
                    desc: "Average O(1) key-value lookup and frequency tracking using hash functions with collision resolution strategies.",
                    tags: ["Hash Maps", "Frequency Counting", "Hash Sets"]
                },
                {
                    name: "Heaps & Priority Queues",
                    count: "20 Problems",
                    badge: "Tree-based Heap",
                    desc: "Complete binary trees satisfying heap order. Min-heaps and Max-heaps for top-K extraction and k-way merging in O(log N) time.",
                    tags: ["Min / Max Heap", "Top-K Queries", "K-Way Merging"]
                },
                {
                    name: "Binary Trees & BSTs",
                    count: "20 Problems",
                    badge: "Hierarchical Tree",
                    desc: "Hierarchical 2-child node structures. Binary Search Trees maintaining sorted order with O(log N) average search, insert, and LCA.",
                    tags: ["In/Pre/Post Order", "BST Search & LCA", "Tree DP"]
                },
                {
                    name: "Tries (Prefix Trees)",
                    count: "20 Problems",
                    badge: "Prefix Search Tree",
                    desc: "Multiway tree structure for fast string prefix searching, auto-completion, and bitwise XOR tries for maximum XOR subarray problems.",
                    tags: ["Prefix Lookup", "Word Dictionary", "Bitwise XOR Trie"]
                },
                {
                    name: "Graphs & Disjoint Sets",
                    count: "20 Problems",
                    badge: "Network Structure",
                    desc: "Non-linear nodes connected by edges. Adjacency lists/matrices, Directed Acyclic Graphs (DAGs), and Union-Find (DSU) sets.",
                    tags: ["Adjacency Lists", "DAGs", "Disjoint Set (Union-Find)"]
                },
                {
                    name: "Bitsets & Binary Masks",
                    count: "20 Problems",
                    badge: "Low-level Bits",
                    desc: "Compact bit-level arrays allowing parallel boolean operations, fast set representations, and 32/64-bit integer masks.",
                    tags: ["Bit Manipulation", "State Masks", "Low-level Ops"]
                },
                {
                    name: "Recursion Call Stack",
                    count: "20 Problems",
                    badge: "Implicit Stack",
                    desc: "Call-stack frame management for recursive divide-and-conquer, backtracking branches, and subtree state returns.",
                    tags: ["Call Stack", "Divide & Conquer", "State Trees"]
                }
            ],
            extraTitle: "⭐ EXTRA DATA STRUCTURES TO EXPLORE",
            extraDesc: "Advanced data structures valuable for higher-tier technical rounds and competitive programming beyond the standard sheet.",
            extraItems: [
                {
                    name: "B-Trees & B+ Trees",
                    badge: "Database Storage",
                    desc: "Self-balancing multiway search trees optimized for disk systems, database indexing, and large-scale block storage engines."
                },
                {
                    name: "AVL Trees",
                    badge: "Self-Balancing BST",
                    desc: "Strictly height-balanced BSTs with height factor difference ≤ 1, ensuring guaranteed O(log N) lookup in worst case."
                },
                {
                    name: "Red-Black Trees",
                    badge: "Standard Library BST",
                    desc: "Balanced binary search trees with color invariants and fewer rebalancing rotations; foundation of C++ std::map and Java TreeMap."
                },
                {
                    name: "Segment Trees",
                    badge: "Range Queries",
                    desc: "Binary tree supporting O(log N) arbitrary range queries (sum, min, gcd) with lazy propagation for efficient range updates."
                },
                {
                    name: "Fenwick Trees (Binary Indexed Tree)",
                    badge: "Prefix Queries",
                    desc: "Compact array-based bitwise tree providing O(log N) dynamic prefix sum queries and point updates with minimal memory overhead."
                },
                {
                    name: "Disjoint-Set Forest (Path Compression + Rank)",
                    badge: "Advanced DSU",
                    desc: "Optimized Union-Find supporting dynamic connectivity queries in nearly linear O(α(N)) time using Inverse Ackermann complexity."
                },
                {
                    name: "Suffix Trees & Suffix Arrays",
                    badge: "String Indexing",
                    desc: "Compressed trie containing all suffixes of a text, enabling linear-time multi-pattern matching and longest repeated substrings."
                },
                {
                    name: "Treap (Cartesian Tree)",
                    badge: "Randomized BST",
                    desc: "Hybrid data structure maintaining BST keys and Heap priorities randomly to achieve optimal O(log N) expected depth."
                },
                {
                    name: "Skip Lists",
                    badge: "Probabilistic List",
                    desc: "Hierarchical multi-level linked list providing probabilistic O(log N) search, insertion, and deletion without complex tree rotations."
                },
                {
                    name: "K-D Trees & Quad Trees",
                    badge: "Spatial Partitioning",
                    desc: "Multi-dimensional space-partitioning trees used for 2D/3D spatial indexing, range searches, and nearest neighbor lookups."
                }
            ]
        },
        algorithms: {
            title: "ALGORITHMS",
            subtitle: "Algorithms used across the 372 DSA problems",
            icon: "⚙️",
            accent: "#818cf8",
            glow: "rgba(129, 140, 248, 0.25)",
            primaryTitle: "USED IN 372 PROBLEMS",
            primaryDesc: "Algorithmic strategies, search methods, and graph traversals implemented across the dataset.",
            items: [
                {
                    name: "Binary Search & Monotonic Optimization",
                    count: "20 Problems",
                    badge: "Search Strategy",
                    desc: "Logarithmic O(log N) search over sorted arrays, lower/upper bound lookups, and monotonic predicate search on answer spaces.",
                    tags: ["Binary Search on Answer", "Lower / Upper Bound", "Rotated Sorted Array"]
                },
                {
                    name: "Two Pointers & Sliding Window",
                    count: "25 Problems",
                    badge: "Linear Scan",
                    desc: "Simultaneous pointer movements and dynamic window boundaries reducing O(N²) brute-force subsegment checks down to O(N).",
                    tags: ["Opposite Pointers", "Dynamic Sliding Window", "Fast & Slow"]
                },
                {
                    name: "Breadth-First Search (BFS)",
                    count: "20 Problems",
                    badge: "Level Traversal",
                    desc: "Queue-driven level-by-level exploration for shortest paths in unweighted graphs, multi-source wave propagations, and tree views.",
                    tags: ["Shortest Path (Unweighted)", "Multi-source BFS", "Level Order"]
                },
                {
                    name: "Depth-First Search (DFS)",
                    count: "20 Problems",
                    badge: "Recursive Traversal",
                    desc: "Stack/recursive state exploration for connected components, graph cycle detection (3-color state), pathfinding, and subtree returns.",
                    tags: ["Cycle Detection", "Connected Components", "Tree DFS"]
                },
                {
                    name: "Dijkstra's Shortest Path",
                    count: "Core Graph Topic",
                    badge: "Greedy Graph Path",
                    desc: "Single-source shortest path algorithm on non-negative weighted graphs utilizing Min-Priority Queues with O((V+E) log V) complexity.",
                    tags: ["Weighted Graphs", "Min-Heap", "Shortest Path"]
                },
                {
                    name: "Topological Sort (Kahn's & DFS)",
                    count: "DAG Algorithms",
                    badge: "Linear Ordering",
                    desc: "Linear ordering of vertices in Directed Acyclic Graphs (DAGs) using in-degree reduction (Kahn's) and post-order DFS stack.",
                    tags: ["Course Scheduling", "Dependency Resolution", "In-degree Queue"]
                },
                {
                    name: "Minimum Spanning Tree (Kruskal & Prim)",
                    count: "Graph Algorithms",
                    badge: "Greedy Tree",
                    desc: "Greedy edge selection algorithms finding minimum weight spanning subgraphs using Union-Find (Kruskal) and Priority Queue (Prim).",
                    tags: ["Kruskal + DSU", "Prim's Algorithm", "Cut Property"]
                },
                {
                    name: "Backtracking & Branch Pruning",
                    count: "40 Problems",
                    badge: "Search Exploration",
                    desc: "Systematic state-space search with Choose-Explore-Unchoose template, constraint pruning, combinations, permutations, and Sudoku.",
                    tags: ["Permutations", "Subsets", "Pruning"]
                },
                {
                    name: "Dynamic Programming (1D, 2D, Grid, Tree)",
                    count: "20 Problems",
                    badge: "Optimal Substructure",
                    desc: "Overlapping subproblem memoization and bottom-up tabulation: 0/1 Knapsack, Longest Common Subsequence (LCS), LIS, and Grid Paths.",
                    tags: ["Memoization", "Tabulation", "State Transitions"]
                },
                {
                    name: "Greedy Algorithms",
                    count: "20 Problems",
                    badge: "Local Optimization",
                    desc: "Making locally optimal choices that guarantee global optimality: Interval scheduling, Jump Game, Gas Station, and Huffman coding.",
                    tags: ["Interval Scheduling", "Greedy Choice", "Jump Game"]
                },
                {
                    name: "Sorting: Merge Sort, Quick Sort & Dutch Flag",
                    count: "Foundations",
                    badge: "Divide & Conquer",
                    desc: "O(N log N) divide-and-conquer sorting, Quickselect for O(N) Kth elements, and 3-way partitioning for Dutch National Flag.",
                    tags: ["Merge Sort", "Quickselect", "Dutch National Flag"]
                },
                {
                    name: "Number Theory & Bitwise Algorithms",
                    count: "40 Problems",
                    badge: "Mathematical Logic",
                    desc: "Sieve of Eratosthenes (O(N log log N)), Euclidean GCD, Modular Exponentiation, Brian Kernighan's set-bit count, and XOR tricks.",
                    tags: ["Sieve of Eratosthenes", "Fast Power", "XOR Properties"]
                }
            ],
            extraTitle: "⭐ MORE ALGORITHMS TO LEARN",
            extraDesc: "Advanced algorithmic paradigms for competitive programming and elite technical interview problem solving.",
            extraItems: [
                {
                    name: "KMP (Knuth-Morris-Pratt) Algorithm",
                    badge: "String Matching",
                    desc: "Linear-time O(N + M) string pattern search utilizing the Longest Prefix Suffix (LPS) array to prevent redundant backtrack comparisons."
                },
                {
                    name: "Z-Algorithm",
                    badge: "String Matching",
                    desc: "Linear-time O(N) string algorithm computing longest common prefix values between the string and its suffixes starting at each index."
                },
                {
                    name: "Tarjan's & Kosaraju's Algorithms",
                    badge: "Graph Components",
                    desc: "Linear-time algorithms for identifying Strongly Connected Components (SCCs), articulation points, and critical bridges in graphs."
                },
                {
                    name: "Floyd-Warshall Algorithm",
                    badge: "All-Pairs Shortest Path",
                    desc: "O(V³) dynamic programming algorithm computing all-pairs shortest distances on dense graphs with negative weight detection."
                },
                {
                    name: "Bellman-Ford Algorithm",
                    badge: "Shortest Path",
                    desc: "Single-source shortest path algorithm handling negative edge weights and detecting negative weight cycles in O(V · E) time."
                },
                {
                    name: "Manacher's Algorithm",
                    badge: "Palindrome Search",
                    desc: "Optimal O(N) linear-time algorithm to find the longest palindromic substring by mirroring palindrome radius boundaries."
                },
                {
                    name: "A* Search Algorithm",
                    badge: "Heuristic Search",
                    desc: "Informed graph search evaluating f(n) = g(n) + h(n) with admissible heuristics for accelerated pathfinding in grid maps."
                },
                {
                    name: "Mo's Algorithm & Sqrt Decomposition",
                    badge: "Offline Queries",
                    desc: "Query-reordering algorithm processing offline array range queries in O((N + Q)√N) by sorting query blocks."
                },
                {
                    name: "Graham Scan & Monotone Chain",
                    badge: "Computational Geometry",
                    desc: "O(N log N) algorithms constructing the minimum 2D Convex Hull enclosing a set of planar points."
                },
                {
                    name: "Ford-Fulkerson & Edmonds-Karp",
                    badge: "Network Flow",
                    desc: "Algorithms for computing the Maximum Flow and Minimum Cut in capacitated flow networks using BFS augmenting paths."
                }
            ]
        },
        patterns: {
            title: "PATTERNS",
            subtitle: "Problem-solving patterns found across the 372 DSA problems",
            icon: "🧩",
            accent: "#f43f5e",
            glow: "rgba(244, 63, 94, 0.25)",
            primaryTitle: "RECURRING PATTERNS ACROSS 372 PROBLEMS",
            primaryDesc: "High-frequency problem archetypes and structural templates derived from the problem dataset.",
            items: [
                {
                    name: "Two Pointers (Converging / Parallel)",
                    count: "High Frequency",
                    badge: "Array / String",
                    desc: "Pointers moving toward each other on sorted arrays or in parallel at differing speeds (e.g. 2Sum II, 3Sum, Valid Palindrome, Container With Most Water).",
                    tags: ["2Sum II / 3Sum", "Container Water", "Valid Palindrome"]
                },
                {
                    name: "Sliding Window (Fixed / Dynamic)",
                    count: "High Frequency",
                    badge: "Array / String",
                    desc: "Expanding right boundary and contracting left boundary to maintain valid substring/subarray constraints in O(N) time.",
                    tags: ["Min Window Substring", "Longest Substring", "Max Sum Subarray"]
                },
                {
                    name: "Prefix Sum & Difference Arrays",
                    count: "Core Pattern",
                    badge: "Range Computation",
                    desc: "Precomputing cumulative sums for O(1) range sum evaluations and difference arrays for O(1) range increment updates.",
                    tags: ["Subarray Sum = K", "Range Sum Queries", "Difference Array"]
                },
                {
                    name: "Fast & Slow Pointers (Tortoise & Hare)",
                    count: "Core Pattern",
                    badge: "Linked List / Cycle",
                    desc: "Pointers moving at 1x and 2x velocities to detect linked list cycles, locate list midpoints, and solve cycle detection in O(1) space.",
                    tags: ["Detect Cycle", "Find Midpoint", "Happy Number"]
                },
                {
                    name: "Kadane's Dynamic Subarray",
                    count: "Core Pattern",
                    badge: "Subarray Optimization",
                    desc: "Maintaining current running maximum subarray sum vs restarting from current element, executing in single O(N) pass.",
                    tags: ["Max Subarray Sum", "Max Product Subarray", "Circular Subarray"]
                },
                {
                    name: "Merge & Overlapping Intervals",
                    count: "High Frequency",
                    badge: "Interval Scheduling",
                    desc: "Sorting intervals by start time and merging when curr.start <= prev.end (e.g. Merge Intervals, Insert Interval, Meeting Rooms).",
                    tags: ["Merge Intervals", "Insert Interval", "Meeting Rooms"]
                },
                {
                    name: "Monotonic Stack & Queue",
                    count: "High Frequency",
                    badge: "Ordered Stack",
                    desc: "Maintaining strictly increasing/decreasing order in stack to discover Next Greater/Smaller element in O(N) amortized time.",
                    tags: ["Next Greater Element", "Daily Temps", "Histogram Area"]
                },
                {
                    name: "Top-K Elements with Min/Max Heap",
                    count: "High Frequency",
                    badge: "Heap Pattern",
                    desc: "Maintaining a fixed size-K heap to find Kth largest, Top K Frequent elements, and stream medians in O(N log K) time.",
                    tags: ["Kth Largest", "Top K Frequent", "Median from Stream"]
                },
                {
                    name: "Binary Search on Answer Space",
                    count: "High Frequency",
                    badge: "Monotonic Function",
                    desc: "When validation function isValid(mid) is monotonic (TTT...FFF), binary search over potential solution domain [L, R].",
                    tags: ["Koko Eating Bananas", "Capacity to Ship", "Aggressive Cows"]
                },
                {
                    name: "Backtracking (Choose-Explore-Unchoose)",
                    count: "High Frequency",
                    badge: "Combinatorial Search",
                    desc: "Recursively generating decision trees with pruning: Subsets, Combinations, Permutations, Sudoku Solver, and N-Queens.",
                    tags: ["Subsets & Permutations", "Combination Sum", "N-Queens"]
                },
                {
                    name: "Tree DFS: Bottom-Up Subtree Aggregation",
                    count: "High Frequency",
                    badge: "Tree Pattern",
                    desc: "Post-order recursive aggregation computing subtree height, diameter, maximum path sum, and Lowest Common Ancestor (LCA).",
                    tags: ["Tree Diameter", "Max Path Sum", "LCA of Tree"]
                },
                {
                    name: "Tree / Graph BFS: Multi-Source Waves",
                    count: "High Frequency",
                    badge: "Grid / Graph",
                    desc: "Simultaneous multi-source queue initialization to calculate shortest step distance in unweighted matrices and graphs.",
                    tags: ["Rotting Oranges", "01 Matrix", "Shortest Path Grid"]
                },
                {
                    name: "Topological Dependency Sorting",
                    count: "Core Graph",
                    badge: "Graph DAG",
                    desc: "In-degree array + queue (Kahn's) or DFS post-order stack for dependency compilation, build systems, and course planning.",
                    tags: ["Course Schedule I & II", "Alien Dictionary", "Task Ordering"]
                },
                {
                    name: "Union-Find Dynamic Connectivity",
                    count: "Core Graph",
                    badge: "Disjoint Set",
                    desc: "Maintaining connected components and cycle detection in undirected graphs via find() with path compression and union().",
                    tags: ["Redundant Connection", "Number of Provinces", "Graph Cycles"]
                },
                {
                    name: "DP: 0/1 Inclusion & Exclusion",
                    count: "High Frequency",
                    badge: "Dynamic Programming",
                    desc: "For each item i, decide whether to include item or exclude item: dp[i][w] = max(dp[i-1][w], val + dp[i-1][w - wt]).",
                    tags: ["0/1 Knapsack", "Partition Equal Subset", "Target Sum"]
                },
                {
                    name: "DP: 2D String Matching & Alignment",
                    count: "High Frequency",
                    badge: "String DP",
                    desc: "Comparing prefixes S[0...i] with T[0...j] to compute Edit Distance, Longest Common Subsequence, and Wildcard Regex.",
                    tags: ["Edit Distance", "LCS Table", "Distinct Subsequences"]
                }
            ],
            extraTitle: "⭐ ADVANCED PROBLEM-SOLVING ARCHETYPES",
            extraDesc: "Supplementary high-level algorithmic patterns found in Hard & Grandmaster-level technical interviews.",
            extraItems: [
                {
                    name: "DP with Bitmasking & Hamiltonian Paths",
                    badge: "Bitmask DP",
                    desc: "Using integer bitmasks 2^N to represent visited subsets in Traveling Salesperson, shortest Hamiltonian paths, and matching problems."
                },
                {
                    name: "State Machine & Decision DP",
                    badge: "State Transitions",
                    desc: "Explicit multi-state transitions (Hold, Sold, Cooldown) for complex stock trading, turn-based games, and regex matching."
                },
                {
                    name: "Digit DP for Range Counting",
                    badge: "Digit DP",
                    desc: "Constructing numbers digit-by-digit with tight/leading-zero boolean flags to count numbers satisfying properties in range [L, R]."
                },
                {
                    name: "Divide & Conquer Optimization",
                    badge: "Advanced DP",
                    desc: "Speeding up 2D DP transitions from O(N²) to O(N log N) when optimal split point opt[i][j] is monotonic."
                }
            ]
        }
    };

    const ALGORITHMS_REFERENCE_DATA = [
        {
            category: "SEARCHING ALGORITHMS",
            icon: "🔍",
            accent: "#38bdf8",
            algorithms: [
                "Linear Search",
                "Binary Search",
                "Binary Search on Answer",
                "Search in Rotated Sorted Array",
                "Lower Bound / Upper Bound"
            ]
        },
        {
            category: "SORTING ALGORITHMS",
            icon: "📶",
            accent: "#a855f7",
            algorithms: [
                "Bubble Sort",
                "Selection Sort",
                "Insertion Sort",
                "Merge Sort",
                "Quick Sort",
                "Counting Sort",
                "Radix Sort"
            ]
        },
        {
            category: "ARRAY & STRING ALGORITHMS",
            icon: "🔤",
            accent: "#ec4899",
            algorithms: [
                "Kadane's Algorithm",
                "Dutch National Flag Algorithm",
                "Boyer–Moore Majority Vote",
                "Prefix Sum",
                "Difference Array",
                "Sliding Window",
                "Two Pointer Technique",
                "String Matching / Pattern Matching"
            ]
        },
        {
            category: "HASHING-BASED ALGORITHMS",
            icon: "🗝️",
            accent: "#f59e0b",
            algorithms: [
                "Frequency Counting",
                "Hash Map Lookup",
                "Hash Set Based Search",
                "Prefix Sum + Hashing"
            ]
        },
        {
            category: "RECURSION & BACKTRACKING",
            icon: "🔄",
            accent: "#10b981",
            algorithms: [
                "Recursive Traversal",
                "Divide and Conquer",
                "Backtracking",
                "Permutation Generation",
                "Combination Generation",
                "Subset Generation",
                "N-Queens"
            ]
        },
        {
            category: "GREEDY ALGORITHMS",
            icon: "⚡",
            accent: "#6366f1",
            algorithms: [
                "Activity Selection",
                "Fractional Knapsack",
                "Interval Scheduling",
                "Job Sequencing",
                "Greedy Selection",
                "Minimum/Maximum Optimization"
            ]
        },
        {
            category: "TREE ALGORITHMS",
            icon: "🌳",
            accent: "#22c55e",
            algorithms: [
                "DFS Traversal",
                "BFS / Level Order Traversal",
                "Inorder Traversal",
                "Preorder Traversal",
                "Postorder Traversal",
                "BST Search",
                "BST Insertion",
                "BST Deletion",
                "Tree Height / Depth",
                "Lowest Common Ancestor"
            ]
        },
        {
            category: "HEAP / PRIORITY QUEUE ALGORITHMS",
            icon: "⛰️",
            accent: "#eab308",
            algorithms: [
                "Heapify",
                "Heap Sort",
                "Top-K Elements",
                "Kth Largest / Smallest",
                "Priority Queue Based Selection",
                "Merge K Sorted Structures"
            ]
        },
        {
            category: "GRAPH ALGORITHMS",
            icon: "🕸️",
            accent: "#06b6d4",
            algorithms: [
                "BFS",
                "DFS",
                "Connected Components",
                "Cycle Detection",
                "Topological Sort",
                "Shortest Path",
                "Dijkstra's Algorithm",
                "Bellman–Ford Algorithm",
                "Floyd–Warshall Algorithm",
                "Minimum Spanning Tree",
                "Prim's Algorithm",
                "Kruskal's Algorithm",
                "Union-Find / DSU"
            ]
        },
        {
            category: "DYNAMIC PROGRAMMING",
            icon: "📊",
            accent: "#8b5cf6",
            algorithms: [
                "Memoization",
                "Tabulation",
                "0/1 Knapsack",
                "Unbounded Knapsack",
                "Longest Common Subsequence (LCS)",
                "Longest Increasing Subsequence (LIS)",
                "Subset Sum",
                "Coin Change",
                "Grid DP",
                "1D DP",
                "2D DP",
                "State Transition DP"
            ]
        },
        {
            category: "BIT MANIPULATION ALGORITHMS",
            icon: "⚙️",
            accent: "#f43f5e",
            algorithms: [
                "Bit Masking",
                "Set / Clear / Toggle Bit",
                "XOR Based Algorithms",
                "Bit Counting",
                "Power of Two Check",
                "Subset Generation Using Bits"
            ]
        },
        {
            category: "LINKED LIST ALGORITHMS",
            icon: "🔗",
            accent: "#14b8a6",
            algorithms: [
                "Fast & Slow Pointer",
                "Cycle Detection — Floyd's Algorithm",
                "List Reversal",
                "Merge Sorted Lists",
                "Merge Sort on Linked List",
                "Finding Middle Node"
            ]
        },
        {
            category: "STACK / QUEUE ALGORITHMS",
            icon: "📥",
            accent: "#84cc16",
            algorithms: [
                "Monotonic Stack",
                "Monotonic Queue",
                "Next Greater Element",
                "Next Smaller Element",
                "Previous Greater / Smaller Element",
                "BFS using Queue"
            ]
        },
        {
            category: "TRIE ALGORITHMS",
            icon: "🌿",
            accent: "#d946ef",
            algorithms: [
                "Trie Insertion",
                "Trie Search",
                "Prefix Search",
                "Trie-based Word Search"
            ]
        }
    ];

    const PATTERNS_REFERENCE_DATA = [
        {
            category: "ARRAY / SEARCHING PATTERNS",
            icon: "🔍",
            accent: "#38bdf8",
            patterns: [
                "Two Pointers",
                "Sliding Window",
                "Prefix Sum",
                "Suffix Sum",
                "Difference Array",
                "Cyclic Sort / Index Placement",
                "In-place Array Manipulation",
                "Kadane's Algorithm",
                "Matrix Traversal",
                "Spiral Matrix",
                "Binary Search",
                "Binary Search on Answer"
            ]
        },
        {
            category: "HASHING PATTERNS",
            icon: "🗝️",
            accent: "#f59e0b",
            patterns: [
                "Hash Map",
                "Hash Set",
                "Frequency Counting",
                "Prefix Sum + Hash Map",
                "Character Frequency"
            ]
        },
        {
            category: "RECURSION / BACKTRACKING",
            icon: "🔄",
            accent: "#10b981",
            patterns: [
                "Recursion",
                "Divide and Conquer",
                "Backtracking",
                "Permutation Generation",
                "Combination Generation",
                "Subset Generation",
                "Pruning"
            ]
        },
        {
            category: "INTERVAL / GREEDY PATTERNS",
            icon: "⚡",
            accent: "#6366f1",
            patterns: [
                "Sorting + Greedy",
                "Greedy Choice",
                "Merge Intervals",
                "Interval Scheduling",
                "Interval Optimization",
                "Resource Allocation",
                "Deadline Scheduling"
            ]
        },
        {
            category: "STACK / QUEUE PATTERNS",
            icon: "📥",
            accent: "#84cc16",
            patterns: [
                "Monotonic Stack",
                "Next Greater Element",
                "Next Smaller Element",
                "Previous Greater / Smaller Element",
                "Largest Rectangle / Histogram",
                "Subarray Contribution",
                "Stack-based Expression Parsing",
                "BFS",
                "Multi-source BFS",
                "Level-order Traversal"
            ]
        },
        {
            category: "HEAP PATTERNS",
            icon: "⛰️",
            accent: "#eab308",
            patterns: [
                "Heap / Priority Queue",
                "Top K Elements",
                "K-way Merge",
                "Two Heaps",
                "Heap + Greedy"
            ]
        },
        {
            category: "TREE PATTERNS",
            icon: "🌳",
            accent: "#22c55e",
            patterns: [
                "Tree DFS",
                "Tree BFS",
                "Preorder Traversal",
                "Inorder Traversal",
                "Postorder Traversal",
                "Level-order Traversal",
                "Path-based Tree DFS",
                "Subtree Processing",
                "Tree Height / Depth",
                "Tree Diameter"
            ]
        },
        {
            category: "GRAPH PATTERNS",
            icon: "🕸️",
            accent: "#06b6d4",
            patterns: [
                "Graph DFS",
                "Graph BFS",
                "Connected Components",
                "Cycle Detection",
                "Bipartite Graph",
                "Topological Sort",
                "Shortest Path",
                "Dijkstra's Algorithm",
                "Bellman-Ford",
                "Floyd-Warshall",
                "Minimum Spanning Tree",
                "Prim's Algorithm",
                "Kruskal's Algorithm",
                "Union-Find / DSU"
            ]
        },
        {
            category: "BIT MANIPULATION PATTERNS",
            icon: "⚙️",
            accent: "#f43f5e",
            patterns: [
                "Bit Masking",
                "Bit Manipulation",
                "XOR",
                "Bit Counting",
                "Maximum XOR",
                "Power of Two"
            ]
        },
        {
            category: "STRING PATTERNS",
            icon: "🔤",
            accent: "#ec4899",
            patterns: [
                "Two Pointers",
                "Sliding Window",
                "Palindrome",
                "Anagram",
                "String Matching",
                "String Parsing",
                "Character Frequency",
                "Subsequence"
            ]
        },
        {
            category: "TRIE PATTERNS",
            icon: "🌿",
            accent: "#d946ef",
            patterns: [
                "Trie / Prefix Tree",
                "Prefix Search",
                "Prefix Matching",
                "Word Search",
                "String Segmentation"
            ]
        },
        {
            category: "DYNAMIC PROGRAMMING PATTERNS",
            icon: "📊",
            accent: "#8b5cf6",
            patterns: [
                "Memoization",
                "Tabulation",
                "1D Dynamic Programming",
                "2D Dynamic Programming",
                "Knapsack",
                "Subset Sum",
                "Partition DP",
                "Coin Change",
                "Grid DP",
                "String DP",
                "Stock DP",
                "State Transition DP",
                "State Compression"
            ]
        }
    ];

    const DS_ROADMAP_TREE = {
        id: "ds_node_root",
        name: "DATA STRUCTURES",
        tag: "DSA ROADMAP",
        icon: "🗺️",
        stats: "4 Categories · 25 Structures",
        categories: [
            {
                id: "ds_cat_linear",
                name: "LINEAR DATA STRUCTURES",
                icon: "📏",
                accent: "#38bdf8",
                glow: "rgba(56, 189, 248, 0.25)",
                badge: "10 Structures · 135+ Problems",
                structures: [
                    {
                        id: "ds_node_arrays",
                        name: "Arrays",
                        count: "35+ Problems",
                        badge: "Core Structure",
                        desc: "Contiguous memory with O(1) random access, prefix sums, subarrays, and matrix rotations.",
                        subtypes: ["Static Array", "Dynamic Array", "2D Grid / Matrix", "Prefix Array"]
                    },
                    {
                        id: "ds_node_strings",
                        name: "Strings",
                        count: "20+ Problems",
                        badge: "Char Sequence",
                        desc: "Character sequence structures with frequency arrays, anagram checks, and sliding substring windows.",
                        subtypes: ["Char Frequency Array", "Anagram Hashing", "Substrings"]
                    },
                    {
                        id: "ds_node_linked_list",
                        name: "Linked List",
                        count: "20 Problems",
                        badge: "Pointer Linked",
                        desc: "Sequential nodes linked by pointers with O(1) insertion/deletion given pointer.",
                        subtypes: ["Singly Linked List", "Doubly Linked List", "Circular Linked List"]
                    },
                    {
                        id: "ds_node_stack",
                        name: "Stack",
                        count: "20 Problems",
                        badge: "LIFO Collection",
                        desc: "Last-In-First-Out linear structure for expression parsing and monotonic stack queries.",
                        subtypes: ["LIFO Array/List", "Monotonic Stack"]
                    },
                    {
                        id: "ds_node_queue",
                        name: "Queue & Deque",
                        count: "20 Problems",
                        badge: "FIFO Collection",
                        desc: "First-In-First-Out queues, circular buffers, and double-ended queues for sliding window max.",
                        subtypes: ["FIFO Queue", "Circular Queue", "Double-Ended Deque"]
                    },
                    {
                        id: "ds_node_hash_table",
                        name: "Hash Table / Map",
                        count: "20 Problems",
                        badge: "Direct Key Index",
                        desc: "Average O(1) key-value lookup and frequency tracking using hash functions with collision resolution.",
                        subtypes: ["Hash Map (O(1) Lookup)", "Hash Set", "Frequency Map"]
                    }
                ]
            },
            {
                id: "ds_cat_nonlinear",
                name: "NON-LINEAR DATA STRUCTURES",
                icon: "🌳",
                accent: "#a855f7",
                glow: "rgba(168, 85, 247, 0.25)",
                badge: "7 Structures · 80+ Problems",
                structures: [
                    {
                        id: "ds_node_trees",
                        name: "Trees & BST",
                        count: "20 Problems",
                        badge: "Hierarchical",
                        desc: "Hierarchical node structure. BST maintains sorted keys for O(log N) search, insert, and LCA.",
                        subtypes: ["Binary Tree", "Binary Search Tree (BST)"]
                    },
                    {
                        id: "ds_node_heap",
                        name: "Heap / Priority Queue",
                        count: "20 Problems",
                        badge: "Tree-based Heap",
                        desc: "Complete binary trees satisfying heap invariant for O(1) peak access and O(log N) extraction.",
                        subtypes: ["Min Heap", "Max Heap"]
                    },
                    {
                        id: "ds_node_graph",
                        name: "Graph",
                        count: "20 Problems",
                        badge: "Network Structure",
                        desc: "Set of vertices connected by edges representing networks, dependencies, and grids.",
                        subtypes: ["Directed Graph", "Undirected Graph", "Weighted Graph"]
                    },
                    {
                        id: "ds_node_trie",
                        name: "Trie / Prefix Tree",
                        count: "20 Problems",
                        badge: "Prefix Search",
                        desc: "Multiway tree structure for fast string prefix lookups, dictionary search, and bitwise XOR tries.",
                        subtypes: ["Prefix Tree (26-Way)", "Bitwise XOR Trie"]
                    }
                ]
            },
            {
                id: "ds_cat_advanced",
                name: "ADVANCED DATA STRUCTURES",
                icon: "⚡",
                accent: "#10b981",
                glow: "rgba(16, 185, 129, 0.25)",
                badge: "3 Structures · Sheet & Contests",
                structures: [
                    {
                        id: "ds_node_dsu",
                        name: "Disjoint Set Union",
                        count: "Graph Topic",
                        badge: "Dynamic Set",
                        desc: "Union-Find tracking partition of elements with near-O(1) find and union via path compression & rank.",
                        subtypes: ["Path Compression", "Union by Rank"]
                    },
                    {
                        id: "ds_node_seg_tree",
                        name: "Segment Tree",
                        count: "Advanced Queries",
                        badge: "Range Queries",
                        desc: "Binary tree supporting O(log N) arbitrary range queries (sum, min, gcd) and lazy propagation updates.",
                        subtypes: ["Range Queries (Sum/Min)", "Lazy Propagation"]
                    },
                    {
                        id: "ds_node_fenwick",
                        name: "Fenwick Tree (BIT)",
                        count: "Prefix Queries",
                        badge: "Binary Indexed",
                        desc: "Array-based bitwise tree providing O(log N) prefix sums and point updates with minimal space.",
                        subtypes: ["Prefix Sum Queries", "Point Updates"]
                    }
                ]
            },
            {
                id: "ds_cat_extra",
                name: "⭐ EXTRA DATA STRUCTURES TO EXPLORE",
                icon: "⭐",
                accent: "#fbbf24",
                glow: "rgba(251, 191, 36, 0.25)",
                badge: "Beyond 372 Sheet · Advanced & CP",
                isExtra: true,
                structures: [
                    { id: "ds_extra_avl", name: "AVL Tree", badge: "Self-Balancing BST", desc: "Strictly height-balanced BST with height difference ≤ 1, guaranteeing O(log N) lookup." },
                    { id: "ds_extra_rb", name: "Red-Black Tree", badge: "Standard Lib BST", desc: "Balanced BST using color properties; foundation of C++ std::map and Java TreeMap." },
                    { id: "ds_extra_btree", name: "B-Tree & B+ Tree", badge: "Database Indexing", desc: "Self-balancing multiway search trees optimized for disk blocks and DB indexing." },
                    { id: "ds_extra_splay", name: "Splay Tree", badge: "Self-Adjusting BST", desc: "BST performing splay rotations to move recently accessed nodes to root for cache locality." },
                    { id: "ds_extra_skip", name: "Skip List", badge: "Probabilistic List", desc: "Multi-level linked list with probabilistic O(log N) search without tree rebalancing." },
                    { id: "ds_extra_suffix", name: "Suffix Array & Tree", badge: "String Indexing", desc: "Linear-time string indexing for complex multi-pattern matching and longest common substrings." },
                    { id: "ds_extra_sparse", name: "Sparse Table", badge: "Static Range RMQ", desc: "Static array power-of-2 table answering Range Minimum Queries (RMQ) in O(1) time." },
                    { id: "ds_extra_bloom", name: "Bloom Filter", badge: "Probabilistic Set", desc: "Space-efficient bit array testing element membership with zero false negatives." },
                    { id: "ds_extra_lru", name: "LRU Cache", badge: "Eviction Cache", desc: "Fast O(1) eviction cache combining Hash Map with Doubly Linked List." },
                    { id: "ds_extra_ordered", name: "Ordered Set / Map", badge: "Policy-Based Tree", desc: "Tree structure supporting order statistics (find_by_order & order_of_key) in O(log N)." },
                    { id: "ds_extra_interval", name: "Interval Tree", badge: "Geometric Query", desc: "Augmented tree data structure holding intervals to find all intervals overlapping a query." },
                    { id: "ds_extra_kdtree", name: "KD-Tree", badge: "Spatial Search", desc: "K-dimensional space-partitioning tree for 2D/3D range searches and nearest neighbor lookup." }
                ]
            }
        ]
    };

    const DataStructuresRoadmap = {
        initialized: false,
        scale: 0.85,
        panX: 0,
        panY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        startPanX: 0,
        startPanY: 0,
        expandedCategories: new Set(["ds_cat_linear", "ds_cat_nonlinear", "ds_cat_advanced", "ds_cat_extra"]),

        init() {
            this.bindEvents();
            requestAnimationFrame(() => {
                this.fitToScreen();
                this.drawConnectors();
            });
            this.initialized = true;
        },

        bindEvents() {
            const viewport = document.getElementById("ds-roadmap-viewport");
            if (!viewport) return;

            // Mouse wheel zoom with cursor anchoring
            viewport.addEventListener("wheel", (e) => {
                e.preventDefault();
                const rect = viewport.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const minZoom = this.getFitScale();
                const maxZoom = 1.25;
                const delta = e.deltaY < 0 ? 0.05 : -0.05;
                const newScale = Math.max(minZoom, Math.min(maxZoom, Math.round((this.scale + delta) * 100) / 100));

                if (Math.abs(newScale - this.scale) < 0.001) return;

                const worldX = (mouseX - this.panX) / this.scale;
                const worldY = (mouseY - this.panY) / this.scale;

                this.panX = mouseX - worldX * newScale;
                this.panY = mouseY - worldY * newScale;
                this.scale = newScale;

                this.applyTransform();
                this.updateZoomIndicator();
                this.drawConnectors();
            }, { passive: false });

            // Pan Dragging
            viewport.addEventListener("mousedown", (e) => {
                if (e.target.closest("button") || e.target.closest(".ds-subtype-chip")) return;
                this.isDragging = true;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startPanX = this.panX;
                this.startPanY = this.panY;
                viewport.style.cursor = "grabbing";
            });

            window.addEventListener("mousemove", (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - this.startX;
                const dy = e.clientY - this.startY;
                this.panX = this.startPanX + dx;
                this.panY = this.startPanY + dy;
                this.applyTransform();
                this.drawConnectors();
            });

            window.addEventListener("mouseup", () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    if (viewport) viewport.style.cursor = "grab";
                }
            });

            // Touch events for mobile/tablet
            viewport.addEventListener("touchstart", (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.startX = e.touches[0].clientX;
                    this.startY = e.touches[0].clientY;
                    this.startPanX = this.panX;
                    this.startPanY = this.panY;
                }
            }, { passive: true });

            viewport.addEventListener("touchmove", (e) => {
                if (this.isDragging && e.touches.length === 1) {
                    const dx = e.touches[0].clientX - this.startX;
                    const dy = e.touches[0].clientY - this.startY;
                    this.panX = this.startPanX + dx;
                    this.panY = this.startPanY + dy;
                    this.applyTransform();
                    this.drawConnectors();
                }
            }, { passive: true });

            viewport.addEventListener("touchend", () => {
                this.isDragging = false;
            });

            // Toolbar Controls
            const zoomInBtn = document.getElementById("ds-zoom-in-btn");
            if (zoomInBtn) {
                zoomInBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.zoomByStep(0.05);
                };
            }

            const zoomOutBtn = document.getElementById("ds-zoom-out-btn");
            if (zoomOutBtn) {
                zoomOutBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.zoomByStep(-0.05);
                };
            }

            const zoomFitBtn = document.getElementById("ds-zoom-fit-btn");
            if (zoomFitBtn) {
                zoomFitBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.fitToScreen();
                };
            }

            const zoomResetBtn = document.getElementById("ds-zoom-reset-btn");
            if (zoomResetBtn) {
                zoomResetBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.fitToScreen();
                };
            }

            // Category Expand / Collapse
            viewport.onclick = (e) => {
                const catCard = e.target.closest(".ds-category-card");
                if (catCard) {
                    const catId = catCard.dataset.catId;
                    const targetGrid = document.querySelector(`[data-cat-content="${catId}"]`);
                    if (targetGrid) {
                        const isHidden = targetGrid.style.display === "none";
                        targetGrid.style.display = isHidden ? "" : "none";
                        const toggleIcon = catCard.querySelector(".ds-cat-toggle-icon");
                        if (toggleIcon) toggleIcon.textContent = isHidden ? "▼" : "▶";
                        this.drawConnectors();
                    }
                }
            };

            // Floating Tooltip setup
            this.setupTooltip(viewport);

            // Window Resize listener
            window.addEventListener("resize", () => {
                if (document.getElementById("ds-roadmap-viewport")) {
                    this.drawConnectors();
                }
            });
        },

        setupTooltip(viewport) {
            let tooltip = document.getElementById("ds-floating-tooltip");
            if (!tooltip) {
                tooltip = document.createElement("div");
                tooltip.id = "ds-floating-tooltip";
                tooltip.className = "ds-floating-tooltip";
                document.body.appendChild(tooltip);
            }

            viewport.addEventListener("mouseover", (e) => {
                const node = e.target.closest(".ds-struct-node, .ds-extra-struct-card");
                if (node && tooltip) {
                    const title = node.dataset.name || "";
                    const count = node.dataset.count || "";
                    const desc = node.dataset.desc || "";
                    tooltip.innerHTML = `
                        <div class="ds-tooltip-title">${RoadmapUI.escapeHTML(title)}</div>
                        ${count ? `<div class="ds-tooltip-count">${RoadmapUI.escapeHTML(count)}</div>` : ''}
                        <div class="ds-tooltip-desc">${RoadmapUI.escapeHTML(desc)}</div>
                    `;
                    tooltip.classList.add("visible");
                    tooltip.style.opacity = "1";
                    tooltip.style.left = `${e.clientX + 14}px`;
                    tooltip.style.top = `${e.clientY + 14}px`;
                }
            });

            viewport.addEventListener("mousemove", (e) => {
                if (tooltip && tooltip.classList.contains("visible")) {
                    tooltip.style.left = `${e.clientX + 14}px`;
                    tooltip.style.top = `${e.clientY + 14}px`;
                }
            });

            viewport.addEventListener("mouseout", (e) => {
                const node = e.target.closest(".ds-struct-node, .ds-extra-struct-card");
                if (node && tooltip) {
                    tooltip.classList.remove("visible");
                    tooltip.style.opacity = "0";
                }
            });
        },

        getContentBounds() {
            const stage = document.getElementById("ds-roadmap-stage");
            if (!stage) return { minX: 0, maxX: 1200, minY: 0, maxY: 800, width: 1200, height: 800, centerX: 600, centerY: 400 };

            const stageRect = stage.getBoundingClientRect();
            const nodes = stage.querySelectorAll("#ds-node-root, .ds-category-card, .ds-struct-node, .ds-extra-struct-card");

            if (!nodes.length) {
                return { minX: 0, maxX: 1200, minY: 0, maxY: 800, width: 1200, height: 800, centerX: 600, centerY: 400 };
            }

            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;

            nodes.forEach(node => {
                if (node.offsetParent === null) return;
                const rect = node.getBoundingClientRect();
                const left = (rect.left - stageRect.left) / this.scale;
                const top = (rect.top - stageRect.top) / this.scale;
                const right = left + (rect.width / this.scale);
                const bottom = top + (rect.height / this.scale);

                minX = Math.min(minX, left);
                maxX = Math.max(maxX, right);
                minY = Math.min(minY, top);
                maxY = Math.max(maxY, bottom);
            });

            if (minX === Infinity) {
                return { minX: 0, maxX: 1200, minY: 0, maxY: 800, width: 1200, height: 800, centerX: 600, centerY: 400 };
            }

            const width = maxX - minX;
            const height = maxY - minY;
            return {
                minX, maxX, minY, maxY,
                width, height,
                centerX: minX + width / 2,
                centerY: minY + height / 2
            };
        },

        getFitScale() {
            const viewport = document.getElementById("ds-roadmap-viewport");
            if (!viewport) return 0.85;

            const vWidth = viewport.clientWidth || 1200;
            const vHeight = viewport.clientHeight || 680;

            const bounds = this.getContentBounds();
            if (bounds.width <= 0 || bounds.height <= 0) return 0.85;

            const padRatio = 0.90;
            const scaleX = (vWidth * padRatio) / bounds.width;
            const scaleY = (vHeight * padRatio) / bounds.height;

            const fitScale = Math.min(scaleX, scaleY);
            return Math.max(0.30, Math.min(1.15, Math.round(fitScale * 100) / 100));
        },

        fitToScreen() {
            const viewport = document.getElementById("ds-roadmap-viewport");
            if (!viewport) return;

            const vWidth = viewport.clientWidth || 1200;
            const vHeight = viewport.clientHeight || 680;

            const bounds = this.getContentBounds();
            const fitScale = this.getFitScale();

            this.scale = fitScale;
            this.panX = (vWidth / 2) - (bounds.centerX * this.scale);
            this.panY = (vHeight / 2) - (bounds.centerY * this.scale);

            this.applyTransform();
            this.updateZoomIndicator();
            this.drawConnectors();
        },

        zoomByStep(delta) {
            const viewport = document.getElementById("ds-roadmap-viewport");
            if (!viewport) return;

            const rect = viewport.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const minZoom = this.getFitScale();
            const maxZoom = 1.25;
            const newScale = Math.max(minZoom, Math.min(maxZoom, Math.round((this.scale + delta) * 100) / 100));

            if (Math.abs(newScale - this.scale) < 0.001) return;

            const worldX = (centerX - this.panX) / this.scale;
            const worldY = (centerY - this.panY) / this.scale;

            this.panX = centerX - worldX * newScale;
            this.panY = centerY - worldY * newScale;
            this.scale = newScale;

            this.applyTransform();
            this.updateZoomIndicator();
            this.drawConnectors();
        },

        applyTransform() {
            const stage = document.getElementById("ds-roadmap-stage");
            if (stage) {
                stage.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.scale})`;
            }
        },

        updateZoomIndicator() {
            const indicator = document.getElementById("ds-zoom-level");
            if (indicator) {
                indicator.textContent = `${Math.round(this.scale * 100)}%`;
            }
        },

        drawConnectors() {
            const svg = document.getElementById("ds-roadmap-svg-canvas");
            const stage = document.getElementById("ds-roadmap-stage");
            const rootNode = document.getElementById("ds-node-root");
            const linearCat = document.getElementById("ds_cat_linear");
            const nonlinearCat = document.getElementById("ds_cat_nonlinear");
            const advancedCat = document.getElementById("ds_cat_advanced");
            const extraCat = document.getElementById("ds_cat_extra");

            if (!svg || !stage || !rootNode) return;

            const stageRect = stage.getBoundingClientRect();
            if (stageRect.width === 0 || stageRect.height === 0) return;

            svg.innerHTML = "";
            const currentScale = this.scale || 1.0;

            const getNodeCenter = (el) => {
                if (!el || el.offsetParent === null) return null;
                const rect = el.getBoundingClientRect();
                return {
                    x: (rect.left + rect.width / 2 - stageRect.left) / currentScale,
                    y: (rect.top + rect.height / 2 - stageRect.top) / currentScale,
                    left: (rect.left - stageRect.left) / currentScale,
                    right: (rect.right - stageRect.left) / currentScale,
                    top: (rect.top - stageRect.top) / currentScale,
                    bottom: (rect.bottom - stageRect.top) / currentScale
                };
            };

            const root = getNodeCenter(rootNode);
            if (!root) return;

            const lin = getNodeCenter(linearCat);
            const nonlin = getNodeCenter(nonlinearCat);
            const adv = getNodeCenter(advancedCat);
            const extra = getNodeCenter(extraCat);

            const addPath = (d, stroke, width = 2, dashed = false, opacity = "0.75") => {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", d);
                path.setAttribute("class", "ds-connector-path");
                path.setAttribute("stroke", stroke);
                path.setAttribute("stroke-width", String(width));
                path.setAttribute("stroke-opacity", opacity);
                if (dashed) {
                    path.setAttribute("stroke-dasharray", "6 4");
                }
                svg.appendChild(path);
                return path;
            };

            // 1. Root to Linear & Non-Linear Branches (Symmetrical bus tree)
            if (lin && nonlin) {
                const yTrunk = root.bottom + 16;
                // Vertical trunk from Root
                addPath(`M ${root.x} ${root.bottom} L ${root.x} ${yTrunk}`, "#a855f7", 2.5, false, "0.85");
                // Horizontal bus
                addPath(`M ${lin.x} ${yTrunk} L ${nonlin.x} ${yTrunk}`, "#a855f7", 2, false, "0.6");
                // Drop to Linear Category Header
                addPath(`M ${lin.x} ${yTrunk} L ${lin.x} ${lin.top}`, "#38bdf8", 2.5, false, "0.85");
                // Drop to Non-Linear Category Header
                addPath(`M ${nonlin.x} ${yTrunk} L ${nonlin.x} ${nonlin.top}`, "#a855f7", 2.5, false, "0.85");
            } else if (lin) {
                addPath(`M ${root.x} ${root.bottom} L ${lin.x} ${lin.top}`, "#38bdf8", 2.5, false, "0.85");
            } else if (nonlin) {
                addPath(`M ${root.x} ${root.bottom} L ${nonlin.x} ${nonlin.top}`, "#a855f7", 2.5, false, "0.85");
            }

            // 2. Linear Category to its Grid
            const linearGrid = document.querySelector('[data-cat-content="ds_cat_linear"]');
            if (lin && linearGrid && linearGrid.offsetParent !== null) {
                addPath(`M ${lin.x} ${lin.bottom} L ${lin.x} ${lin.bottom + 12}`, "#38bdf8", 2, false, "0.5");
            }

            // 3. Non-Linear Category to its Grid
            const nonlinGrid = document.querySelector('[data-cat-content="ds_cat_nonlinear"]');
            if (nonlin && nonlinGrid && nonlinGrid.offsetParent !== null) {
                addPath(`M ${nonlin.x} ${nonlin.bottom} L ${nonlin.x} ${nonlin.bottom + 12}`, "#a855f7", 2, false, "0.5");
            }

            // 4. Central Spine down to Advanced Section
            if (adv) {
                const primaryTier = document.getElementById("ds_primary_tier");
                const pPt = getNodeCenter(primaryTier);
                const yFrom = pPt ? pPt.bottom : (root.bottom + 180);
                addPath(`M ${root.x} ${yFrom} L ${root.x} ${adv.top}`, "#10b981", 2.5, false, "0.85");

                // Advanced Category to its Grid
                const advGrid = document.querySelector('[data-cat-content="ds_cat_advanced"]');
                if (advGrid && advGrid.offsetParent !== null) {
                    addPath(`M ${adv.x} ${adv.bottom} L ${adv.x} ${adv.bottom + 12}`, "#10b981", 2, false, "0.5");
                }
            }

            // 5. Advanced Section to Extra Data Structures Section
            if (adv && extra) {
                const advSec = document.getElementById("ds_sec_advanced");
                const aPt = getNodeCenter(advSec);
                const yAdvBottom = aPt ? aPt.bottom : (adv.bottom + 120);
                addPath(`M ${root.x} ${yAdvBottom} L ${root.x} ${extra.top}`, "#fbbf24", 2, true, "0.75");

                // Extra Category to its Grid
                const extraGrid = document.querySelector('[data-cat-content="ds_cat_extra"]');
                if (extraGrid && extraGrid.offsetParent !== null) {
                    addPath(`M ${extra.x} ${extra.bottom} L ${extra.x} ${extra.bottom + 12}`, "#fbbf24", 2, true, "0.5");
                }
            }
        },

        buildHTML() {
            const linearCat = DS_ROADMAP_TREE.categories.find(c => c.id === "ds_cat_linear");
            const nonlinearCat = DS_ROADMAP_TREE.categories.find(c => c.id === "ds_cat_nonlinear");
            const advancedCat = DS_ROADMAP_TREE.categories.find(c => c.id === "ds_cat_advanced");
            const extraCat = DS_ROADMAP_TREE.categories.find(c => c.id === "ds_cat_extra");

            const renderStructNodes = (cat) => {
                return cat.structures.map(s => `
                    <div class="ds-struct-node" id="${s.id}" data-name="${RoadmapUI.escapeHTML(s.name)}" data-count="${RoadmapUI.escapeHTML(s.count)}" data-desc="${RoadmapUI.escapeHTML(s.desc)}" style="border-top: 2px solid ${cat.accent};">
                        <div class="ds-struct-header">
                            <h4 class="ds-struct-name">${RoadmapUI.escapeHTML(s.name)}</h4>
                            <span class="ds-struct-count" style="color: ${cat.accent}; border-color: ${cat.accent}66; background: ${cat.glow};">${RoadmapUI.escapeHTML(s.count)}</span>
                        </div>
                        <p class="ds-struct-desc">${RoadmapUI.escapeHTML(s.desc)}</p>
                        ${s.subtypes ? `
                            <div class="ds-subtypes-wrap">
                                ${s.subtypes.map(sub => `
                                    <span class="ds-subtype-chip">
                                        <span class="ds-subtype-dot" style="background: ${cat.accent};"></span>
                                        ${RoadmapUI.escapeHTML(sub)}
                                    </span>
                                `).join("")}
                            </div>
                        ` : ''}
                    </div>
                `).join("");
            };

            const renderExtraNodes = (cat) => {
                return cat.structures.map(s => `
                    <div class="ds-extra-struct-card" id="${s.id}" data-name="${RoadmapUI.escapeHTML(s.name)}" data-count="${RoadmapUI.escapeHTML(s.badge)}" data-desc="${RoadmapUI.escapeHTML(s.desc)}">
                        <div class="ds-extra-header">
                            <h5 class="ds-extra-name">${RoadmapUI.escapeHTML(s.name)}</h5>
                            <span class="ds-extra-badge">${RoadmapUI.escapeHTML(s.badge)}</span>
                        </div>
                        <p class="ds-extra-desc">${RoadmapUI.escapeHTML(s.desc)}</p>
                    </div>
                `).join("");
            };

            return `
                <div class="ds-roadmap-container">
                    <!-- Top Control & Switcher Bar -->
                    <div class="ds-roadmap-header-row">
                        <div class="ds-roadmap-title-group">
                            <span class="ds-roadmap-badge-icon">🧱</span>
                            <div>
                                <h3 class="ds-roadmap-title">DATA STRUCTURES ROADMAP</h3>
                                <p class="ds-roadmap-subtitle">Interactive mind-map tree & topology of Core, Advanced & Extra Data Structures in 372 DSA Problems</p>
                            </div>
                        </div>

                        <div class="ds-roadmap-controls-group">
                            <!-- Category Switcher Tabs -->
                            <div class="explorer-header-tabs">
                                <button class="explorer-header-tab active" data-category="structures">
                                    <span>🧱</span> Data Structures
                                </button>
                                <button class="explorer-header-tab" data-category="algorithms">
                                    <span>⚙️</span> Algorithms
                                </button>
                                <button class="explorer-header-tab" data-category="patterns">
                                    <span>🧩</span> Patterns
                                </button>
                            </div>

                            <!-- Zoom & Fit Toolbar -->
                            <div class="ds-roadmap-toolbar">
                                <button class="ds-tool-btn" id="ds-zoom-in-btn" title="Zoom In (+)">➕</button>
                                <button class="ds-tool-btn" id="ds-zoom-out-btn" title="Zoom Out (−)">➖</button>
                                <button class="ds-tool-btn" id="ds-zoom-fit-btn" title="Fit to View (⛶)">⛶</button>
                                <button class="ds-tool-btn" id="ds-zoom-reset-btn" title="Reset View (↻)">↻</button>
                                <span class="ds-zoom-level" id="ds-zoom-level">85%</span>
                            </div>

                            <!-- Close Button -->
                            <button class="explorer-close-btn" title="Close Data Structures Roadmap">
                                <span>✕</span> Close
                            </button>
                        </div>
                    </div>

                    <!-- Infinite Mind-Map Canvas Viewport -->
                    <div class="ds-roadmap-viewport" id="ds-roadmap-viewport">
                        <div class="ds-roadmap-stage" id="ds-roadmap-stage">
                            <!-- SVG Connector Layer -->
                            <svg class="ds-roadmap-svg-canvas" id="ds-roadmap-svg-canvas"></svg>

                            <!-- Mind-Map Symmetrical Hierarchical Layout -->
                            <div class="ds-roadmap-mindmap-layout" id="ds-roadmap-mindmap-layout">
                                <!-- Central Hub Node (Level 1) -->
                                <div class="ds-mindmap-center-card" id="ds-node-root">
                                    <div class="ds-center-icon">🗺️</div>
                                    <div class="ds-center-tag">DSA ROADMAP</div>
                                    <h2 class="ds-center-title">DATA STRUCTURES</h2>
                                    <div class="ds-center-stats">4 Categories · 25 Structures</div>
                                </div>

                                <!-- Primary Tier: Linear on Left, Non-Linear on Right (Level 2 & 3) -->
                                <div class="ds-primary-tier-row" id="ds_primary_tier">
                                    <!-- Linear Data Structures Section -->
                                    <div class="ds-category-section" id="ds_sec_linear">
                                        <div class="ds-category-card" id="${linearCat.id}" data-cat-id="${linearCat.id}" style="border-color: ${linearCat.accent};">
                                            <div class="ds-cat-left">
                                                <span class="ds-cat-icon">${linearCat.icon}</span>
                                                <h3 class="ds-cat-title">${linearCat.name}</h3>
                                            </div>
                                            <span class="ds-cat-badge" style="background: ${linearCat.glow}; color: ${linearCat.accent}; border: 1px solid ${linearCat.accent}66;">${linearCat.badge}</span>
                                            <span class="ds-cat-toggle-icon">▼</span>
                                        </div>

                                        <div class="ds-structures-grid ds-grid-2col" data-cat-content="${linearCat.id}">
                                            ${renderStructNodes(linearCat)}
                                        </div>
                                    </div>

                                    <!-- Non-Linear Data Structures Section -->
                                    <div class="ds-category-section" id="ds_sec_nonlinear">
                                        <div class="ds-category-card" id="${nonlinearCat.id}" data-cat-id="${nonlinearCat.id}" style="border-color: ${nonlinearCat.accent};">
                                            <div class="ds-cat-left">
                                                <span class="ds-cat-icon">${nonlinearCat.icon}</span>
                                                <h3 class="ds-cat-title">${nonlinearCat.name}</h3>
                                            </div>
                                            <span class="ds-cat-badge" style="background: ${nonlinearCat.glow}; color: ${nonlinearCat.accent}; border: 1px solid ${nonlinearCat.accent}66;">${nonlinearCat.badge}</span>
                                            <span class="ds-cat-toggle-icon">▼</span>
                                        </div>

                                        <div class="ds-structures-grid ds-grid-2col" data-cat-content="${nonlinearCat.id}">
                                            ${renderStructNodes(nonlinearCat)}
                                        </div>
                                    </div>
                                </div>

                                <!-- Advanced Data Structures Section (Level 2 & 3) -->
                                <div class="ds-category-section ds-section-full" id="ds_sec_advanced">
                                    <div class="ds-category-card" id="${advancedCat.id}" data-cat-id="${advancedCat.id}" style="border-color: ${advancedCat.accent};">
                                        <div class="ds-cat-left">
                                            <span class="ds-cat-icon">${advancedCat.icon}</span>
                                            <h3 class="ds-cat-title">${advancedCat.name}</h3>
                                        </div>
                                        <span class="ds-cat-badge" style="background: ${advancedCat.glow}; color: ${advancedCat.accent}; border: 1px solid ${advancedCat.accent}66;">${advancedCat.badge}</span>
                                        <span class="ds-cat-toggle-icon">▼</span>
                                    </div>

                                    <div class="ds-structures-grid ds-grid-3col" data-cat-content="${advancedCat.id}">
                                        ${renderStructNodes(advancedCat)}
                                    </div>
                                </div>

                                <!-- Extra Data Structures to Explore Section (Level 2 & 3) -->
                                <div class="ds-category-section ds-section-full ds-extra-section" id="ds_sec_extra">
                                    <div class="ds-category-card ds-extra-category-card" id="${extraCat.id}" data-cat-id="${extraCat.id}">
                                        <div class="ds-cat-left">
                                            <span class="ds-cat-icon">${extraCat.icon}</span>
                                            <h3 class="ds-cat-title">${extraCat.name}</h3>
                                        </div>
                                        <span class="ds-cat-badge">${extraCat.badge}</span>
                                        <span class="ds-cat-toggle-icon">▼</span>
                                    </div>

                                    <div class="ds-extra-grid ds-grid-4col" data-cat-content="${extraCat.id}">
                                        ${renderExtraNodes(extraCat)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    const RoadmapUI = {
        initialized: false,
        searchQuery: "",
        selectedTier: "All",
        activeExplorerCategory: null,
        
        // Pan & Zoom Engine State
        scale: 1.00,
        panX: 0,
        panY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        startPanX: 0,
        startPanY: 0,

        // Interactive Tree Expansion State
        expandedPhases: new Set([1, 2, 3, 4]), // Default open first 4 phases for immediate visual mind-map fullness
        expandedConcepts: new Set(["1_0", "1_1", "2_0", "3_0", "4_0", "4_1"]), // Key: `${phaseId}_${conceptIdx}`

        init() {
            if (this.initialized) return;
            this.bindEvents();
            this.initPanZoom();
            this.initialized = true;
        },

        bindEvents() {
            // Search Input
            const searchInput = document.getElementById("roadmap-search-input");
            if (searchInput) {
                searchInput.addEventListener("input", (e) => {
                    this.searchQuery = e.target.value.trim().toLowerCase();
                    this.renderRoadmap();
                });
            }

            // Tier / Category Filter Pills
            const tierFilter = document.getElementById("roadmap-diff-filter");
            if (tierFilter) {
                tierFilter.addEventListener("click", (e) => {
                    const pill = e.target.closest(".roadmap-filter-pill");
                    if (!pill) return;
                    tierFilter.querySelectorAll(".roadmap-filter-pill").forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    this.selectedTier = pill.dataset.tier || "All";
                    this.renderRoadmap();
                });
            }

            // Topic Explorer Circular Button & Dropdown Trigger
            const explorerCircleBtn = document.getElementById("roadmap-explorer-circle-btn");
            const explorerDropdownWrap = document.getElementById("roadmap-explorer-dropdown-wrap");
            if (explorerCircleBtn && explorerDropdownWrap) {
                explorerCircleBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    explorerDropdownWrap.classList.toggle("open");
                });
            }

            // Topic Explorer Dropdown Menu Items
            const explorerMenu = document.getElementById("roadmap-explorer-menu");
            if (explorerMenu) {
                explorerMenu.addEventListener("click", (e) => {
                    const item = e.target.closest(".explorer-menu-item");
                    if (!item) return;
                    e.stopPropagation();
                    const category = item.dataset.category;
                    if (this.activeExplorerCategory === category) {
                        this.closeExplorerPanel();
                    } else {
                        this.openExplorerCategory(category);
                    }
                    if (explorerDropdownWrap) {
                        explorerDropdownWrap.classList.remove("open");
                    }
                });
            }

            // Close dropdown menu when clicking outside
            document.addEventListener("click", (e) => {
                if (!e.target.closest("#roadmap-explorer-dropdown-wrap")) {
                    if (explorerDropdownWrap) {
                        explorerDropdownWrap.classList.remove("open");
                    }
                }
            });

            // Topic Explorer Information Panel Event Delegation
            const panelContainer = document.getElementById("roadmap-explorer-panel-container");
            if (panelContainer) {
                panelContainer.addEventListener("click", (e) => {
                    const closeBtn = e.target.closest(".explorer-close-btn");
                    if (closeBtn) {
                        e.stopPropagation();
                        this.closeExplorerPanel();
                        return;
                    }

                    const tabBtn = e.target.closest(".explorer-header-tab");
                    if (tabBtn) {
                        e.stopPropagation();
                        const category = tabBtn.dataset.category;
                        this.openExplorerCategory(category);
                        return;
                    }
                });
            }

            // Expand / Collapse All
            const expandAllBtn = document.getElementById("roadmap-expand-all-btn");
            if (expandAllBtn) {
                expandAllBtn.addEventListener("click", () => {
                    if (this.expandedPhases.size >= ROADMAP_PHASES.length) {
                        this.expandedPhases.clear();
                        this.expandedConcepts.clear();
                        expandAllBtn.innerHTML = "<span>⊞ Expand All</span>";
                    } else {
                        ROADMAP_PHASES.forEach(p => {
                            this.expandedPhases.add(p.id);
                            p.concepts.forEach((_, cIdx) => {
                                this.expandedConcepts.add(`${p.id}_${cIdx}`);
                            });
                        });
                        expandAllBtn.innerHTML = "<span>⊟ Collapse All</span>";
                    }
                    this.renderRoadmap();
                });
            }

            // Floating Controls
            const zoomInBtn = document.getElementById("roadmap-zoom-in-btn");
            if (zoomInBtn) {
                zoomInBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.zoomByStep(0.05);
                });
            }

            const zoomOutBtn = document.getElementById("roadmap-zoom-out-btn");
            if (zoomOutBtn) {
                zoomOutBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.zoomByStep(-0.05);
                });
            }

            const zoomFitBtn = document.getElementById("roadmap-zoom-fit-btn");
            if (zoomFitBtn) {
                zoomFitBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.fitToScreen();
                });
            }

            const zoomResetBtn = document.getElementById("roadmap-zoom-reset-btn");
            if (zoomResetBtn) {
                zoomResetBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.resetView();
                });
            }

            // Interactive Node Click Event Delegation
            const viewport = document.getElementById("roadmap-viewport");
            if (viewport) {
                viewport.addEventListener("click", (e) => {
                    // Check Phase Node Toggle
                    const phaseNode = e.target.closest(".mindmap-phase-node");
                    if (phaseNode) {
                        const phaseId = parseInt(phaseNode.dataset.phaseId, 10);
                        if (this.expandedPhases.has(phaseId)) {
                            this.expandedPhases.delete(phaseId);
                        } else {
                            this.expandedPhases.add(phaseId);
                        }
                        this.renderRoadmap();
                        return;
                    }

                    // Check Concept Node Toggle
                    const conceptCard = e.target.closest(".mindmap-concept-card");
                    if (conceptCard && !e.target.closest(".subconcept-chip")) {
                        const conceptKey = conceptCard.dataset.conceptKey;
                        if (this.expandedConcepts.has(conceptKey)) {
                            this.expandedConcepts.delete(conceptKey);
                        } else {
                            this.expandedConcepts.add(conceptKey);
                        }
                        this.renderRoadmap();
                        return;
                    }
                });
            }

            // Resize listener
            window.addEventListener("resize", () => {
                if (document.getElementById("view-roadmap")?.classList.contains("active")) {
                    this.drawConnectors();
                }
            });
        },

        initPanZoom() {
            const viewport = document.getElementById("roadmap-viewport");
            if (!viewport) return;

            // Mouse Drag Pan
            viewport.addEventListener("mousedown", (e) => {
                if (e.target.closest(".roadmap-canvas-toolbar") || e.target.closest("button") || e.target.closest("input")) return;
                this.isDragging = true;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startPanX = this.panX;
                this.startPanY = this.panY;
                viewport.classList.add("dragging");
            });

            window.addEventListener("mousemove", (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - this.startX;
                const dy = e.clientY - this.startY;
                this.panX = this.startPanX + dx;
                this.panY = this.startPanY + dy;
                this.applyTransform();
            });

            window.addEventListener("mouseup", () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    viewport.classList.remove("dragging");
                    this.drawConnectors();
                }
            });

            // Wheel Zoom (cursor-anchored, dynamic minimum fitScale, max 1.15)
            viewport.addEventListener("wheel", (e) => {
                e.preventDefault();
                const rect = viewport.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const minZoom = this.getFitScale();
                const maxZoom = 1.15;
                const delta = e.deltaY < 0 ? 0.05 : -0.05;

                let newScale = Math.round((this.scale + delta) * 100) / 100;
                newScale = Math.max(minZoom, Math.min(maxZoom, newScale));

                if (Math.abs(newScale - this.scale) >= 0.001) {
                    // Exact world coordinates under mouse cursor before zoom
                    const worldX = (mouseX - this.panX) / this.scale;
                    const worldY = (mouseY - this.panY) / this.scale;

                    // Reposition pan so the exact same world coordinate stays anchored under mouse cursor
                    this.panX = mouseX - worldX * newScale;
                    this.panY = mouseY - worldY * newScale;
                    this.scale = newScale;

                    this.applyTransform();
                    this.updateZoomIndicator();
                    this.drawConnectors();
                }
            }, { passive: false });

            // Touch Gestures (Mobile/Tablet pan & cursor-anchored pinch)
            let initialDistance = 0;
            let initialScale = 1;

            viewport.addEventListener("touchstart", (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.startX = e.touches[0].clientX;
                    this.startY = e.touches[0].clientY;
                    this.startPanX = this.panX;
                    this.startPanY = this.panY;
                } else if (e.touches.length === 2) {
                    this.isDragging = false;
                    initialDistance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    initialScale = this.scale;
                }
            }, { passive: true });

            viewport.addEventListener("touchmove", (e) => {
                if (e.touches.length === 1 && this.isDragging) {
                    const dx = e.touches[0].clientX - this.startX;
                    const dy = e.touches[0].clientY - this.startY;
                    this.panX = this.startPanX + dx;
                    this.panY = this.startPanY + dy;
                    this.applyTransform();
                } else if (e.touches.length === 2) {
                    const distance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    if (initialDistance > 0) {
                        const factor = distance / initialDistance;
                        const targetScale = initialScale * factor;
                        const minZoom = this.getFitScale();
                        const maxZoom = 1.15;
                        const newScale = Math.max(minZoom, Math.min(maxZoom, Math.round(targetScale * 100) / 100));

                        if (Math.abs(newScale - this.scale) >= 0.001) {
                            const rect = viewport.getBoundingClientRect();
                            const pinchMidX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
                            const pinchMidY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;

                            const worldX = (pinchMidX - this.panX) / this.scale;
                            const worldY = (pinchMidY - this.panY) / this.scale;

                            this.panX = pinchMidX - worldX * newScale;
                            this.panY = pinchMidY - worldY * newScale;
                            this.scale = newScale;

                            this.applyTransform();
                            this.updateZoomIndicator();
                            this.drawConnectors();
                        }
                    }
                }
            }, { passive: true });

            viewport.addEventListener("touchend", () => {
                this.isDragging = false;
                initialDistance = 0;
                this.drawConnectors();
            });
        },

        getContentBounds() {
            const stage = document.getElementById("roadmap-stage");
            const layout = document.getElementById("roadmap-mindmap-layout");
            if (!stage || !layout) {
                return { minX: 0, minY: 0, maxX: 2000, maxY: 1200, width: 2000, height: 1200, centerX: 1000, centerY: 600 };
            }

            const stageRect = stage.getBoundingClientRect();
            const currentScale = this.scale || 1;

            const elements = layout.querySelectorAll(".mindmap-center-card, .mindmap-phase-node, .concept-card-body, .subconcept-chip");
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            elements.forEach(el => {
                if (el.offsetParent !== null) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        const left = (rect.left - stageRect.left) / currentScale;
                        const top = (rect.top - stageRect.top) / currentScale;
                        const right = (rect.right - stageRect.left) / currentScale;
                        const bottom = (rect.bottom - stageRect.top) / currentScale;

                        if (left < minX) minX = left;
                        if (top < minY) minY = top;
                        if (right > maxX) maxX = right;
                        if (bottom > maxY) maxY = bottom;
                    }
                }
            });

            if (minX === Infinity || maxX === -Infinity || minY === Infinity || maxY === -Infinity) {
                minX = 0;
                minY = 0;
                maxX = layout.offsetWidth || 2000;
                maxY = layout.offsetHeight || 1200;
            }

            const width = maxX - minX;
            const height = maxY - minY;
            const centerX = minX + width / 2;
            const centerY = minY + height / 2;

            return { minX, minY, maxX, maxY, width, height, centerX, centerY };
        },

        getFitScale() {
            const viewport = document.getElementById("roadmap-viewport");
            if (!viewport) return 0.5;

            const vWidth = viewport.clientWidth || window.innerWidth;
            const vHeight = viewport.clientHeight || 800;

            const bounds = this.getContentBounds();
            if (!bounds || bounds.width <= 0 || bounds.height <= 0) return 0.5;

            // Viewport padding (8% to 10% on each side)
            const paddingX = Math.max(32, vWidth * 0.08);
            const paddingY = Math.max(32, vHeight * 0.08);

            const availableW = Math.max(100, vWidth - paddingX * 2);
            const availableH = Math.max(100, vHeight - paddingY * 2);

            const scaleX = availableW / bounds.width;
            const scaleY = availableH / bounds.height;
            let fitScale = Math.min(scaleX, scaleY);

            // Round to 2 decimals for clean UI
            fitScale = Math.round(fitScale * 100) / 100;

            // Clamped dynamically between 0.20 and 1.15
            fitScale = Math.max(0.20, Math.min(1.15, fitScale));

            return fitScale;
        },

        zoomByStep(delta) {
            const viewport = document.getElementById("roadmap-viewport");
            if (!viewport) return;
            const rect = viewport.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const minZoom = this.getFitScale();
            const maxZoom = 1.15;

            let newScale = Math.round((this.scale + delta) * 100) / 100;
            newScale = Math.max(minZoom, Math.min(maxZoom, newScale));

            if (Math.abs(newScale - this.scale) >= 0.001) {
                // Viewport center anchoring for + / − buttons
                const worldX = (centerX - this.panX) / this.scale;
                const worldY = (centerY - this.panY) / this.scale;

                this.panX = centerX - worldX * newScale;
                this.panY = centerY - worldY * newScale;
                this.scale = newScale;

                this.applyTransform();
                this.updateZoomIndicator();
                this.drawConnectors();
            }
        },

        setZoom(newScale) {
            const viewport = document.getElementById("roadmap-viewport");
            if (!viewport) return;
            const rect = viewport.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const minZoom = this.getFitScale();
            const maxZoom = 1.15;
            newScale = Math.max(minZoom, Math.min(maxZoom, Math.round(newScale * 100) / 100));

            if (Math.abs(newScale - this.scale) < 0.001) return;
            const worldX = (centerX - this.panX) / this.scale;
            const worldY = (centerY - this.panY) / this.scale;

            this.panX = centerX - worldX * newScale;
            this.panY = centerY - worldY * newScale;
            this.scale = newScale;

            this.applyTransform();
            this.updateZoomIndicator();
            this.drawConnectors();
        },

        resetView() {
            this.fitToScreen();
        },

        fitToScreen() {
            const viewport = document.getElementById("roadmap-viewport");
            if (!viewport) return;

            const vWidth = viewport.clientWidth || window.innerWidth;
            const vHeight = viewport.clientHeight || 800;

            const bounds = this.getContentBounds();
            const fitScale = this.getFitScale();

            this.scale = fitScale;
            this.panX = (vWidth / 2) - (bounds.centerX * this.scale);
            this.panY = (vHeight / 2) - (bounds.centerY * this.scale);

            this.applyTransform();
            this.updateZoomIndicator();
            this.drawConnectors();
        },

        centerMindmap() {
            this.fitToScreen();
        },

        openExplorerCategory(category) {
            if (!TOPIC_EXPLORER_DATA[category]) return;
            this.activeExplorerCategory = category;

            const circleBtn = document.getElementById("roadmap-explorer-circle-btn");
            if (circleBtn) circleBtn.classList.add("active");

            const menuItems = document.querySelectorAll(".explorer-menu-item");
            menuItems.forEach(item => {
                item.classList.toggle("active", item.dataset.category === category);
            });

            const panelContainer = document.getElementById("roadmap-explorer-panel-container");
            if (panelContainer) {
                if (category === "structures") {
                    panelContainer.innerHTML = DataStructuresRoadmap.buildHTML();
                    panelContainer.style.display = "block";
                    DataStructuresRoadmap.init();
                } else {
                    panelContainer.innerHTML = this.buildExplorerPanelHTML(category);
                    panelContainer.style.display = "block";
                }
            }

            // Re-anchor connectors after panel expansion
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
        },

        closeExplorerPanel() {
            this.activeExplorerCategory = null;

            const circleBtn = document.getElementById("roadmap-explorer-circle-btn");
            if (circleBtn) circleBtn.classList.remove("active");

            const menuItems = document.querySelectorAll(".explorer-menu-item");
            menuItems.forEach(item => item.classList.remove("active"));

            const panelContainer = document.getElementById("roadmap-explorer-panel-container");
            if (panelContainer) {
                panelContainer.style.display = "none";
                panelContainer.innerHTML = "";
            }

            // Re-anchor connectors after panel collapses
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
        },

        buildExplorerPanelHTML(category) {
            if (category === "algorithms") {
                return `
                    <div class="explorer-panel-header">
                        <div class="explorer-header-left">
                            <span class="explorer-category-badge-icon">⚙️</span>
                            <div>
                                <h3 class="explorer-panel-title">ALGORITHMS</h3>
                                <p class="explorer-panel-subtitle">Comprehensive reference of Core, Graph, Dynamic Programming & Advanced Algorithms</p>
                            </div>
                        </div>

                        <div class="explorer-header-tabs">
                            <button class="explorer-header-tab" data-category="structures">
                                <span>🧱</span> Data Structures
                            </button>
                            <button class="explorer-header-tab active" data-category="algorithms">
                                <span>⚙️</span> Algorithms
                            </button>
                            <button class="explorer-header-tab" data-category="patterns">
                                <span>🧩</span> Patterns
                            </button>
                        </div>

                        <button class="explorer-close-btn" title="Close Explorer Panel">
                            <span>✕</span> Close
                        </button>
                    </div>

                    <div class="algo-reference-container">
                        <div class="algo-reference-grid">
                            ${ALGORITHMS_REFERENCE_DATA.map(cat => `
                                <div class="algo-cat-group" style="border-top: 2px solid ${cat.accent};">
                                    <div class="algo-cat-header">
                                        <span class="algo-cat-icon">${cat.icon}</span>
                                        <h4 class="algo-cat-title">${this.escapeHTML(cat.category)}</h4>
                                    </div>
                                    <ul class="algo-items-list">
                                        ${cat.algorithms.map(algo => `
                                            <li class="algo-item">
                                                <span class="algo-item-bullet" style="color: ${cat.accent};">•</span>
                                                <span class="algo-item-name">${this.escapeHTML(algo)}</span>
                                            </li>
                                        `).join("")}
                                    </ul>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }

            if (category === "patterns") {
                return `
                    <div class="explorer-panel-header">
                        <div class="explorer-header-left">
                            <span class="explorer-category-badge-icon">🧩</span>
                            <div>
                                <h3 class="explorer-panel-title">PATTERNS</h3>
                                <p class="explorer-panel-subtitle">Comprehensive reference of Problem-Solving Patterns in 372 DSA Problems</p>
                            </div>
                        </div>

                        <div class="explorer-header-tabs">
                            <button class="explorer-header-tab" data-category="structures">
                                <span>🧱</span> Data Structures
                            </button>
                            <button class="explorer-header-tab" data-category="algorithms">
                                <span>⚙️</span> Algorithms
                            </button>
                            <button class="explorer-header-tab active" data-category="patterns">
                                <span>🧩</span> Patterns
                            </button>
                        </div>

                        <button class="explorer-close-btn" title="Close Explorer Panel">
                            <span>✕</span> Close
                        </button>
                    </div>

                    <div class="algo-reference-container">
                        <div class="algo-reference-grid">
                            ${PATTERNS_REFERENCE_DATA.map(cat => `
                                <div class="algo-cat-group" style="border-top: 2px solid ${cat.accent};">
                                    <div class="algo-cat-header">
                                        <span class="algo-cat-icon">${cat.icon}</span>
                                        <h4 class="algo-cat-title">${this.escapeHTML(cat.category)}</h4>
                                    </div>
                                    <ul class="algo-items-list">
                                        ${cat.patterns.map(pat => `
                                            <li class="algo-item">
                                                <span class="algo-item-bullet" style="color: ${cat.accent};">•</span>
                                                <span class="algo-item-name">${this.escapeHTML(pat)}</span>
                                            </li>
                                        `).join("")}
                                    </ul>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }

            const data = TOPIC_EXPLORER_DATA[category];
            if (!data) return "";

            const primaryItemsHTML = data.items.map(item => `
                <div class="explorer-item-card" style="border-top: 2px solid ${data.accent};">
                    <div class="explorer-card-header">
                        <h4 class="explorer-card-name">${this.escapeHTML(item.name)}</h4>
                        <span class="explorer-count-pill" style="color: ${data.accent}; border-color: ${data.accent}66; background: ${data.glow};">${this.escapeHTML(item.count)}</span>
                    </div>
                    <span class="explorer-card-badge">${this.escapeHTML(item.badge)}</span>
                    <p class="explorer-card-desc">${this.escapeHTML(item.desc)}</p>
                    ${item.tags ? `
                        <div class="explorer-card-tags">
                            ${item.tags.map(tag => `<span class="explorer-card-tag">${this.escapeHTML(tag)}</span>`).join("")}
                        </div>
                    ` : ''}
                </div>
            `).join("");

            const extraItemsHTML = data.extraItems.map(item => `
                <div class="explorer-extra-card">
                    <div class="explorer-extra-name">
                        <span>${this.escapeHTML(item.name)}</span>
                        <span class="explorer-extra-badge">${this.escapeHTML(item.badge)}</span>
                    </div>
                    <p class="explorer-extra-desc">${this.escapeHTML(item.desc)}</p>
                </div>
            `).join("");

            return `
                <div class="explorer-panel-header">
                    <div class="explorer-header-left">
                        <span class="explorer-category-badge-icon">${data.icon}</span>
                        <div>
                            <h3 class="explorer-panel-title">${this.escapeHTML(data.title)}</h3>
                            <p class="explorer-panel-subtitle">${this.escapeHTML(data.subtitle)}</p>
                        </div>
                    </div>

                    <div class="explorer-header-tabs">
                        <button class="explorer-header-tab ${category === 'structures' ? 'active' : ''}" data-category="structures">
                            <span>🧱</span> Data Structures
                        </button>
                        <button class="explorer-header-tab ${category === 'algorithms' ? 'active' : ''}" data-category="algorithms">
                            <span>⚙️</span> Algorithms
                        </button>
                        <button class="explorer-header-tab ${category === 'patterns' ? 'active' : ''}" data-category="patterns">
                            <span>🧩</span> Patterns
                        </button>
                    </div>

                    <button class="explorer-close-btn" title="Close Explorer Panel">
                        <span>✕</span> Close
                    </button>
                </div>

                <div class="explorer-section-heading">
                    <span class="explorer-section-title">
                        <span>📊</span> ${this.escapeHTML(data.primaryTitle)}
                    </span>
                    <span class="explorer-section-desc">${this.escapeHTML(data.primaryDesc)}</span>
                </div>

                <div class="explorer-items-grid">
                    ${primaryItemsHTML}
                </div>

                <div class="explorer-extra-divider">
                    <div class="explorer-extra-header">
                        <span class="explorer-extra-title">
                            ${this.escapeHTML(data.extraTitle)}
                        </span>
                        <span class="explorer-section-desc">${this.escapeHTML(data.extraDesc)}</span>
                    </div>

                    <div class="explorer-extra-grid">
                        ${extraItemsHTML}
                    </div>
                </div>
            `;
        },

        applyTransform() {
            const stage = document.getElementById("roadmap-stage");
            if (stage) {
                stage.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.scale})`;
            }
        },

        updateZoomIndicator() {
            const indicator = document.getElementById("roadmap-zoom-level");
            if (indicator) {
                indicator.textContent = `${Math.round(this.scale * 100)}%`;
            }
        },

        isPhaseMatch(phase) {
            // Stage/Tier filter
            if (this.selectedTier !== "All") {
                const tier = phase.tier.toLowerCase();
                const sel = this.selectedTier.toLowerCase();
                if (sel === "foundation" && !tier.includes("foundation")) return false;
            }

            // Search query filter
            if (this.searchQuery) {
                const q = this.searchQuery;
                const matchTitle = phase.title.toLowerCase().includes(q);
                const matchNum = phase.phaseNum.includes(q);
                const matchTier = phase.tier.toLowerCase().includes(q);
                const matchDesc = phase.description.toLowerCase().includes(q);
                const matchConcept = phase.concepts.some(c => 
                    c.name.toLowerCase().includes(q) || 
                    c.subconcepts.some(sc => sc.toLowerCase().includes(q))
                );

                if (!matchTitle && !matchNum && !matchTier && !matchDesc && !matchConcept) {
                    return false;
                }
            }

            return true;
        },

        renderRoadmap() {
            this.init();

            const leftWingContainer = document.getElementById("mindmap-left-wing");
            const rightWingContainer = document.getElementById("mindmap-right-wing");

            if (!leftWingContainer || !rightWingContainer) return;

            // Total concept stats
            let totalConcepts = 0;
            let totalSubconcepts = 0;
            ROADMAP_PHASES.forEach(p => {
                totalConcepts += p.concepts.length;
                p.concepts.forEach(c => totalSubconcepts += c.subconcepts.length);
            });

            // Update stats badge in header
            const statTotalPill = document.getElementById("roadmap-stat-total-pill");
            if (statTotalPill) {
                statTotalPill.textContent = `18 Phases · ${totalConcepts} Concepts · ${totalSubconcepts} Sub-topics`;
            }

            const isSearching = !!this.searchQuery || this.selectedTier !== "All";

            // Left (Odd IDs: 1, 3, 5, 7, 9, 11, 13, 15, 17)
            // Right (Even IDs: 2, 4, 6, 8, 10, 12, 14, 16, 18)
            const leftPhases = ROADMAP_PHASES.filter(p => p.id % 2 !== 0);
            const rightPhases = ROADMAP_PHASES.filter(p => p.id % 2 === 0);

            leftWingContainer.innerHTML = leftPhases.map(p => this.buildPhaseClusterHTML(p, "left", isSearching)).join("");
            rightWingContainer.innerHTML = rightPhases.map(p => this.buildPhaseClusterHTML(p, "right", isSearching)).join("");

            // Apply initial centering if first load
            if (this.panX === 0 && this.panY === 0) {
                setTimeout(() => {
                    this.fitToScreen();
                }, 50);
            } else {
                this.applyTransform();
                this.updateZoomIndicator();
            }

            // Draw real SVG connector curves after DOM settles
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
        },

        buildPhaseClusterHTML(phase, side, isSearching) {
            const isMatch = this.isPhaseMatch(phase);
            if (!isMatch && isSearching) {
                return "";
            }

            // When searching and matches, auto expand
            const isExpanded = isSearching ? true : this.expandedPhases.has(phase.id);

            const conceptsHTML = `
                <div class="mindmap-concepts-column ${isExpanded ? 'active' : 'collapsed'}" id="concepts-col-${phase.id}">
                    ${phase.concepts.map((concept, cIdx) => {
                        const conceptKey = `${phase.id}_${cIdx}`;
                        const isConceptExpanded = isSearching ? true : this.expandedConcepts.has(conceptKey);
                        const isConceptMatch = this.searchQuery && (
                            concept.name.toLowerCase().includes(this.searchQuery) ||
                            concept.subconcepts.some(sc => sc.toLowerCase().includes(this.searchQuery))
                        );

                        // Subconcepts leaf chips
                        const subconceptsHTML = `
                            <div class="concept-subconcepts-branch ${isConceptExpanded ? 'active' : 'collapsed'}" id="subconcepts-branch-${conceptKey}">
                                ${concept.subconcepts.map(sc => {
                                    const isSubMatch = this.searchQuery && sc.toLowerCase().includes(this.searchQuery);
                                    return `
                                        <div class="subconcept-chip ${isSubMatch ? 'highlighted-sub' : ''}">
                                            <span class="subconcept-dot" style="background: ${phase.accentColor};"></span>
                                            <span class="subconcept-text">${this.escapeHTML(sc)}</span>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                        `;

                        const conceptCardBody = `
                            <div class="concept-card-body ${isConceptMatch ? 'highlighted-concept' : ''}" 
                                 title="Click to ${isConceptExpanded ? 'collapse' : 'expand'} sub-concepts">
                                <span class="concept-branch-dot" style="background: ${phase.accentColor};"></span>
                                <span class="concept-name-text">${this.escapeHTML(concept.name)}</span>
                                <span class="concept-count-pill">${concept.subconcepts.length}</span>
                                <span class="concept-chevron">${isConceptExpanded ? '▼' : (side === 'left' ? '◀' : '▶')}</span>
                            </div>
                        `;

                        // On Left Wing: Subconcepts are to the LEFT of Concept card body
                        // On Right Wing: Subconcepts are to the RIGHT of Concept card body
                        return `
                            <div class="mindmap-concept-card ${isConceptExpanded ? 'expanded' : ''}" 
                                 id="concept-node-${conceptKey}"
                                 data-concept-key="${conceptKey}">
                                ${side === 'left' ? (subconceptsHTML + conceptCardBody) : (conceptCardBody + subconceptsHTML)}
                            </div>
                        `;
                    }).join("")}
                </div>
            `;

            const phaseNodeHTML = `
                <div class="mindmap-phase-node ${side}-node ${isExpanded ? 'expanded' : 'collapsed'}" 
                     id="phase-node-${phase.id}" 
                     data-phase-id="${phase.id}"
                     style="--phase-accent: ${phase.accentColor}; --phase-glow: ${phase.glowColor}; --phase-bg: ${phase.bgColor};"
                     title="Click to ${isExpanded ? 'collapse' : 'expand'} Phase ${phase.phaseNum}">
                    
                    <div class="phase-node-glow-bar" style="background: ${phase.accentColor};"></div>
                    
                    <div class="phase-node-header">
                        <span class="phase-num-tag">${phase.phaseNum}</span>
                        <span class="phase-tier-pill ${phase.tierClass}">${phase.tier}</span>
                    </div>

                    <div class="phase-node-title-row">
                        <span class="phase-node-icon">${phase.icon}</span>
                        <h3 class="phase-node-title">${this.escapeHTML(phase.title)}</h3>
                    </div>

                    <div class="phase-node-footer">
                        <span class="phase-concept-count">${phase.concepts.length} Concepts</span>
                        <span class="phase-expand-badge">${isExpanded ? '−' : '+'}</span>
                    </div>
                </div>
            `;

            // On Left Wing: Concepts are to the LEFT of Phase Node
            // On Right Wing: Concepts are to the RIGHT of Phase Node
            return `
                <div class="mindmap-phase-cluster ${side}-cluster" id="phase-cluster-${phase.id}">
                    ${side === 'left' ? (conceptsHTML + phaseNodeHTML) : (phaseNodeHTML + conceptsHTML)}
                </div>
            `;
        },

        drawConnectors() {
            const svg = document.getElementById("roadmap-svg-canvas");
            const stage = document.getElementById("roadmap-stage");
            const centerNode = document.getElementById("mindmap-center-node");

            const layout = document.getElementById("roadmap-mindmap-layout");
            const stageRect = stage.getBoundingClientRect();
            // Dimensions inside unscaled stage coordinates
            const stageWidth = layout ? Math.max(layout.offsetWidth + 200, 2600) : 2600;
            const stageHeight = layout ? Math.max(layout.offsetHeight + 200, 2000) : 2000;

            svg.setAttribute("width", stageWidth);
            svg.setAttribute("height", stageHeight);
            svg.setAttribute("viewBox", `0 0 ${stageWidth} ${stageHeight}`);

            const centerRect = centerNode.getBoundingClientRect();
            const currentScale = this.scale || 1;

            // Coordinates inside stage unscaled space
            const hubLeftX = (centerRect.left - stageRect.left) / currentScale;
            const hubRightX = (centerRect.right - stageRect.left) / currentScale;
            const hubCenterY = (centerRect.top + centerRect.height / 2 - stageRect.top) / currentScale;

            let pathsHTML = `
                <defs>
                    <filter id="branch-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="hub-left-grad" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8" />
                        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.8" />
                    </linearGradient>
                    <linearGradient id="hub-right-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8" />
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0.8" />
                    </linearGradient>
                </defs>
            `;

            ROADMAP_PHASES.forEach((phase) => {
                const phaseNodeEl = document.getElementById(`phase-node-${phase.id}`);
                if (!phaseNodeEl) return;

                const isLeft = phase.id % 2 !== 0;
                const pRect = phaseNodeEl.getBoundingClientRect();

                // Phase Node connector points
                const phaseLeftX = (pRect.left - stageRect.left) / currentScale;
                const phaseRightX = (pRect.right - stageRect.left) / currentScale;
                const phaseCenterY = (pRect.top + pRect.height / 2 - stageRect.top) / currentScale;

                // 1. CENTER HUB -> PHASE NODE BEZIER CURVE
                let startX, startY, endX, endY;
                if (isLeft) {
                    startX = hubLeftX + 10;
                    startY = hubCenterY;
                    endX = phaseRightX;
                    endY = phaseCenterY;
                } else {
                    startX = hubRightX - 10;
                    startY = hubCenterY;
                    endX = phaseLeftX;
                    endY = phaseCenterY;
                }

                const dx1 = endX - startX;
                const cp1X = startX + dx1 * 0.45;
                const cp1Y = startY;
                const cp2X = startX + dx1 * 0.55;
                const cp2Y = endY;

                const path1 = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
                const color = phase.accentColor;

                pathsHTML += `
                    <path d="${path1}" 
                          fill="none" 
                          stroke="${color}" 
                          stroke-width="2.5" 
                          stroke-opacity="0.45" 
                          filter="url(#branch-glow)" 
                          stroke-linecap="round" />
                    <circle cx="${endX}" cy="${endY}" r="4" fill="${color}" opacity="0.9" />
                `;

                // 2. PHASE NODE -> CONCEPTS (If Phase Expanded)
                if (this.expandedPhases.has(phase.id) || this.searchQuery) {
                    phase.concepts.forEach((concept, cIdx) => {
                        const conceptKey = `${phase.id}_${cIdx}`;
                        const conceptEl = document.querySelector(`#concept-node-${conceptKey} .concept-card-body`);
                        if (!conceptEl) return;

                        const cRect = conceptEl.getBoundingClientRect();
                        const cLeftX = (cRect.left - stageRect.left) / currentScale;
                        const cRightX = (cRect.right - stageRect.left) / currentScale;
                        const cCenterY = (cRect.top + cRect.height / 2 - stageRect.top) / currentScale;

                        let cStartPointX, cStartPointY, cEndPointX, cEndPointY;
                        if (isLeft) {
                            cStartPointX = phaseLeftX;
                            cStartPointY = phaseCenterY;
                            cEndPointX = cRightX;
                            cEndPointY = cCenterY;
                        } else {
                            cStartPointX = phaseRightX;
                            cStartPointY = phaseCenterY;
                            cEndPointX = cLeftX;
                            cEndPointY = cCenterY;
                        }

                        const dx2 = cEndPointX - cStartPointX;
                        const cp21X = cStartPointX + dx2 * 0.4;
                        const cp21Y = cStartPointY;
                        const cp22X = cStartPointX + dx2 * 0.6;
                        const cp22Y = cEndPointY;

                        const path2 = `M ${cStartPointX} ${cStartPointY} C ${cp21X} ${cp21Y}, ${cp22X} ${cp22Y}, ${cEndPointX} ${cEndPointY}`;

                        pathsHTML += `
                            <path d="${path2}" 
                                  fill="none" 
                                  stroke="${color}" 
                                  stroke-width="1.8" 
                                  stroke-opacity="0.5" 
                                  stroke-dasharray="none"
                                  stroke-linecap="round" />
                            <circle cx="${cEndPointX}" cy="${cEndPointY}" r="3" fill="${color}" opacity="0.85" />
                        `;

                        // 3. CONCEPT -> SUBCONCEPTS (If Concept Expanded)
                        if (this.expandedConcepts.has(conceptKey) || this.searchQuery) {
                            const subChips = document.querySelectorAll(`#subconcepts-branch-${conceptKey} .subconcept-chip`);
                            subChips.forEach((chip) => {
                                const chipRect = chip.getBoundingClientRect();
                                const chipLeftX = (chipRect.left - stageRect.left) / currentScale;
                                const chipRightX = (chipRect.right - stageRect.left) / currentScale;
                                const chipCenterY = (chipRect.top + chipRect.height / 2 - stageRect.top) / currentScale;

                                let subStartX, subStartY, subEndX, subEndY;
                                if (isLeft) {
                                    subStartX = cLeftX;
                                    subStartY = cCenterY;
                                    subEndX = chipRightX;
                                    subEndY = chipCenterY;
                                } else {
                                    subStartX = cRightX;
                                    subStartY = cCenterY;
                                    subEndX = chipLeftX;
                                    subEndY = chipCenterY;
                                }

                                const dx3 = subEndX - subStartX;
                                const cp31X = subStartX + dx3 * 0.4;
                                const cp31Y = subStartY;
                                const cp32X = subStartX + dx3 * 0.6;
                                const cp32Y = subEndY;

                                const path3 = `M ${subStartX} ${subStartY} C ${cp31X} ${cp31Y}, ${cp32X} ${cp32Y}, ${subEndX} ${subEndY}`;

                                pathsHTML += `
                                    <path d="${path3}" 
                                          fill="none" 
                                          stroke="${color}" 
                                          stroke-width="1.2" 
                                          stroke-opacity="0.35" 
                                          stroke-linecap="round" />
                                    <circle cx="${subEndX}" cy="${subEndY}" r="2" fill="${color}" opacity="0.75" />
                                `;
                            });
                        }
                    });
                }
            });

            svg.innerHTML = pathsHTML;
        },

        escapeHTML(str) {
            if (!str) return "";
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    };

    RoadmapUI.ROADMAP_PHASES = ROADMAP_PHASES;

    if (typeof window !== "undefined") {
        window.RoadmapUI = RoadmapUI;
        window.ROADMAP_PHASES = ROADMAP_PHASES;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = { RoadmapUI, ROADMAP_PHASES };
    }
})();
