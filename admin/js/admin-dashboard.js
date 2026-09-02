/**
 * CodeOrbit Control Center UI Controller
 * 
 * Unifies and powers all Admin Control Center modules:
 * 1. Overview & KPIs
 * 2. Content Control (Problems, Topics/Sections, Roadmap, Daily Problems, Contests, Announcements)
 * 3. User Control (Learner telemetry, search, filters, inspect, Active/Suspended status)
 * 4. Competition Control (Weekly, Monthly, All-time Leaderboards, Top Performers)
 * 5. Platform Analytics (Real database KPIs, real Popular Topics completions)
 * 6. Platform Settings (Daily problem count, star rules, scoring weights with confirmation)
 */

const AdminController = (function () {
    'use strict';

    let _currentTab = 'overview';
    let _currentContentSubtab = 'problems';
    let _currentLbTimeframe = 'all-time';

    // Problem Management State
    let _currentPage = 1;
    const _pageSize = 20;
    let _activeFilters = {
        search: '',
        difficulty: 'All',
        platform: 'All',
        status: 'All',
        topic: 'All',
        sortBy: 'problem_order',
        sortOrder: 'asc'
    };

    // User Management State
    let _userSearchQuery = '';
    let _userStatusFilter = 'All';

    // Pending Action State for Modals
    let _pendingStatusChange = null;
    let _pendingSettingChange = null;
    let _currentEditingContestId = null;
    let _currentEditingAnnouncementId = null;

    // Canonical CodeOrbit Taxonomy Hierarchy
    const TAXONOMY = {
        "Foundation": {
            "01 - Learn the Basics": {
                "01 - Learn the Basics": ["1. Codeforces - Basic to Medium", "2. Data Types", "3. User Input / Output", "4. Conditional Statements", "5. Loops", "6. Functions", "7. Time Complexity"],
                "Logical Building": ["Number Logic & Digit Manipulation", "Mathematical Reasoning", "Simulation & Game Logic"],
                "Conditional Logic": ["Decision Making", "Geometry & Math Conditions", "Nested Conditions"],
                "Loops & Patterns": ["Iteration & Factors", "Mathematical Loops & Streaks", "Pattern Printing"]
            },
            "02 - Learn Important Sorting Techniques": {
                "Sorting-I": ["Selection Sort", "Bubble Sort", "Insertion Sort"],
                "Sorting-II": ["Merge Sort", "Recursive Bubble Sort", "Recursive Insertion Sort", "Quick Sort"]
            },
            "08 - Bit Manipulation": {
                "Learn Bit Manipulation": ["Basic Operations", "XOR Properties", "Bit Masking", "Power Set"],
                "Interview Problems": ["Single Number", "Subsets", "Counting Bits"]
            }
        },
        "Core Data Structures": {
            "03 - Solve Problems on Arrays": {
                "Easy": ["Largest Element", "Second Largest", "Check Sorted", "Remove Duplicates", "Left Rotate", "Linear Search", "Union of Two Arrays", "Missing Number", "Max Consecutive Ones", "Single Number"],
                "Medium": ["2Sum Problem", "Sort an array of 0s, 1s and 2s", "Majority Element", "Maximum Subarray Sum", "Print Subarray with Maximum Subarray Sum", "Stock Buy and Sell", "Rearrange Array Elements by Sign", "Next Permutation", "Leaders in an Array", "Longest Consecutive Sequence", "Set Matrix Zeroes", "Rotate Matrix by 90 degrees", "Print the matrix in spiral manner", "Count subarrays with given sum"],
                "Hard": ["Pascal's Triangle", "Majority Element (n/3 times)", "3-Sum Problem", "4-Sum Problem", "Largest Subarray with 0 Sum", "Count number of subarrays with given XOR", "Merge Overlapping Subintervals", "Merge two sorted arrays without extra space", "Find the repeating and missing number", "Count Inversions", "Reverse Pairs", "Maximum Product Subarray"]
            },
            "05 - Strings": {
                "Basic and Easy String Problems": ["Remove outermost Parenthesis", "Reverse Words in a Given String", "Largest Odd Number in a String", "Longest Common Prefix", "Isomorphic String", "Check whether one string is a rotation of another", "Check if two Strings are anagrams of each other"],
                "Medium String Problems": ["Sort Characters by frequency", "Maximum Nesting Depth of Parenthesis", "Roman Number to Integer", "Implement Atoi", "Count Number of Substrings", "Longest Palindromic Substring", "Sum of Beauty of all Substrings", "Reverse Every Word in a String"]
            },
            "06 - Learn LinkedList": {
                "Learn 1D LinkedList": ["Introduction to LinkedList", "Insert a Node in LinkedList", "Delete a Node in LinkedList", "Find the length of the linkedlist", "Search an element in the LL"],
                "Learn Doubly LinkedList": ["Introduction to DLL", "Insert a node in DLL", "Delete a node in DLL", "Reverse a DLL"],
                "Medium Problems of LL": ["Middle of a LinkedList", "Reverse a LinkedList", "Detect a loop in LL", "Find the starting point of loop in LL", "Length of Loop in LL", "Check if LL is palindrome or not", "Segrregate odd and even nodes in LL", "Remove Nth node from the back of the LL", "Delete the middle node of LL", "Sort LL", "Sort a LL of 0s 1s and 2s", "Find the intersection point of Y LL", "Add 1 to a number represented by LL", "Add 2 numbers in LL"],
                "Hard Problems of LL": ["Reverse LL in group of given size K", "Rotate a LL", "Flattening of LL", "Clone a Linked List with random and next pointer"]
            },
            "09 - Stack and Queues": {
                "Learning": ["Implement Stack using Arrays", "Implement Queue using Arrays", "Implement Stack using Queue", "Implement Queue using Stack", "Implement stack using linked list", "Implement queue using linked list", "Check for balanced paranthesis"],
                "Prefix, Infix, Postfix": ["Infix to Postfix", "Infix to Prefix", "Postfix to Infix", "Prefix to Infix"],
                "Monotonic Stack/Queue Problems": ["Next Greater Element", "Next Greater Element 2", "Next Smaller Element", "Number of NGEs to the right", "Trapping Rainwater", "Asteroid Collision", "Sum of Subarray Minimums", "Sum of Subarray Ranges", "Remove K Digits", "Largest Rectangle in Histogram", "Maximal Rectangles"],
                "Implementation Problems": ["Sliding Window Maximum", "Min Stack", "Online Stock Span", "LRU Cache", "LFU Cache"]
            }
        },
        "Algorithms": {
            "04 - Binary Search": {
                "BS on 1D Arrays": ["Binary Search to find X in sorted array", "Lower Bound", "Upper Bound", "Search Insert Position", "Floor/Ceil in Sorted Array", "First and Last Occurrence", "Count Occurrences in Sorted Array", "Search in Rotated Sorted Array I", "Search in Rotated Sorted Array II", "Find Minimum in Rotated Sorted Array", "Single Element in Sorted Array", "Find Peak Element"],
                "BS on Answers": ["Square Root of an integer", "Nth Root of an Integer", "Koko Eating Bananas", "Minimum days to make M bouquets", "Find the smallest Divisor", "Capacity to Ship Packages within D Days", "Kth Missing Positive Number", "Aggressive Cows", "Book Allocation Problem", "Split array - Largest Sum", "Painter's Partition", "Minimize Max Distance to Gas Station", "Median of 2 Sorted Arrays", "Kth Element of two sorted arrays"],
                "BS on 2D Arrays": ["Find the row with maximum number of 1's", "Search in a 2D matrix", "Search in a row and column wise sorted matrix", "Find Peak Element (2D Matrix)", "Matrix Median"]
            },
            "07 - Recursion": {
                "Get a Strong Hold": ["Recursive Implementation of atoi()", "Pow(x, n)", "Count Good numbers", "Sort a stack using recursion", "Reverse a stack using recursion"],
                "Subsequences Pattern": ["Generate all binary strings", "Generate Paranthesis", "Print all subsequences", "Combination Sum", "Combination Sum II", "Subset Sum I", "Subset Sum II", "Combination Sum III", "Letter Combinations of a Phone number"],
                "Hard / Backtracking": ["Palindrome Partitioning", "Word Search", "N Queen", "Rat in a Maze", "Word Break", "M Coloring Problem", "Sudoku Solver", "Expression Add Operators"]
            },
            "12 - Greedy Algorithms": {
                "Easy Problems": ["Assign Cookies", "Fractional Knapsack Problem", "Find minimum number of coins", "Lemonade Change"],
                "Medium/Hard": ["N meetings in one room", "Jump Game", "Jump Game 2", "Minimum platforms required", "Job Sequencing Problem", "Candy", "Insert Interval", "Merge Intervals", "Non-overlapping Intervals"]
            },
            "16 - Dynamic Programming": {
                "Introduction to DP": ["Climbing Stairs", "Frog Jump", "Frog Jump with k distances", "Maximum sum of non-adjacent elements", "House Robber", "Ninja's Training"],
                "2D/3D DP and DP on Grids": ["Grid Unique Paths", "Grid Unique Paths 2", "Minimum Path Sum", "Triangle", "Minimum/Maximum Falling Path Sum", "Chocolates Pickup"],
                "DP on Subsequences": ["Subset Sum equal to target", "Partition Equal Subset Sum", "Partition Set Into 2 Subsets With Min Absolute Sum Diff", "Count Subsets with Sum K", "Count Partitions with Given Difference", "0/1 Knapsack", "Target Sum", "Coin Change", "Unbounded Knapsack", "Rod Cutting Problem"],
                "DP on Strings": ["Longest Common Subsequence", "Print Longest Common Subsequence", "Longest Common Substring", "Longest Palindromic Subsequence", "Minimum Insertions to Make String Palindrome", "Minimum Insertions/Deletions to Convert String", "Shortest Common Supersequence", "Distinct Subsequences", "Edit Distance", "Wildcard Matching"],
                "DP on Stocks": ["Best Time to Buy and Sell Stock", "Best Time to Buy and Sell Stock II", "Best Time to Buy and Sell Stock III", "Best Time to Buy and Sell Stock IV", "Best Time to Buy and Sell Stock with Cooldown", "Best Time to Buy and Sell Stock with Transaction Fee"],
                "DP on LIS": ["Longest Increasing Subsequence", "Printing Longest Increasing Subsequence", "Longest Increasing Subsequence (Binary Search)", "Largest Divisible Subset", "Longest String Chain", "Longest Bitonic Subsequence", "Number of Longest Increasing Subsequences"],
                "MCM DP / Partition DP": ["Matrix Chain Multiplication", "Minimum Cost to Cut a Stick", "Burst Balloons", "Evaluate Boolean Expression to True", "Palindrome Partitioning II", "Partition Array for Maximum Sum"]
            }
        },
        "Advanced Data Structures": {
            "11 - Heaps": {
                "Learning": ["Introduction to Priority Queues using Binary Heaps", "Min Heap and Max Heap Implementation", "Check if an array represents a min-heap or not", "Convert Min Heap to Max Heap", "Kth largest element in an array", "Kth smallest element in an array"],
                "Medium Problems": ["Kth Largest Element in a Stream", "Maximum Sum Combination", "Find Median from Data Stream", "Merge K Sorted Arrays", "Merge K Sorted Lists", "Replace each element by its rank in the array", "Task Scheduler", "Hands of Straights"]
            },
            "13 - Binary Trees": {
                "Traversals": ["Introduction to Trees", "Binary Tree Representation", "Binary Tree Traversals in Binary Tree", "Preorder Traversal", "Inorder Traversal", "Post-order Traversal", "Level order Traversal", "Iterative Preorder Traversal", "Iterative Inorder Traversal", "Post-order Traversal using 2 Stacks", "Post-order Traversal using 1 Stack", "Preorder, Inorder, and Postorder in one traversal"],
                "Medium Problems": ["Height of a Binary Tree", "Check if the Binary tree is height-balanced", "Diameter of Binary Tree", "Maximum Path Sum", "Check if two trees are identical or not", "Zig Zag Traversal", "Boundary Traversal", "Vertical Order Traversal", "Top View of Binary Tree", "Bottom View of Binary Tree", "Right/Left View of Binary Tree", "Symmetric Binary Tree"],
                "Hard Problems": ["Root to Node Path in Binary Tree", "LCA in Binary Tree", "Maximum Width of Binary Tree", "Children Sum Property", "Nodes at distance K in binary tree", "Burning Tree", "Count total Nodes in a COMPLETE Binary Tree", "Requirements needed to construct a Unique Binary Tree", "Construct Binary Tree from Preorder and Inorder", "Construct Binary Tree from Inorder and Postorder", "Serialize and deserialize Binary Tree", "Morris Preorder Traversal", "Morris Inorder Traversal", "Flatten Binary Tree to LinkedList"]
            },
            "14 - Binary Search Trees": {
                "Concepts": ["Introduction to BST", "Search in a Binary Search Tree", "Find Min/Max in BST", "Ceil in a BST", "Floor in a BST"],
                "Practice Problems": ["Insert a given Node in BST", "Delete a Node in BST", "Find K-th smallest/largest element in BST", "Check if a tree is a BST or BT", "LCA in BST", "Construct a BST from a preorder traversal", "Inorder Successor/Predecessor in BST", "BST Iterator", "Two Sum In BST", "Recover BST", "Largest BST in Binary Tree"]
            },
            "15 - Graphs": {
                "Learning": ["Introduction to Graph", "Graph Representation", "Connected Components"],
                "Problems on BFS/DFS": ["Number of Provinces", "Connected Components in Graph", "Rotten Oranges", "Flood Fill", "Cycle Detection in Undirected Graph (BFS)", "Cycle Detection in Undirected Graph (DFS)", "0/1 Matrix", "Surrounded Regions", "Number of Enclaves", "Word Ladder I", "Word Ladder II", "Number of Distinct Islands", "Bipartite Graph", "Detect cycle in a directed graph"],
                "Topo Sort and Problems": ["Topological Sort", "Kahn's Algorithm", "Detect a Cycle in Directed Graph", "Course Schedule I", "Course Schedule II", "Find Eventual Safe States", "Alien Dictionary"],
                "Shortest Path Algorithms": ["Shortest Path in Undirected Graph with unit weights", "Shortest Path in DAG", "Dijkstra's Algorithm", "Shortest Path in Binary Maze", "Path with Minimum Effort", "Cheapest Flights Within K Stops", "Network Delay Time", "Number of Ways to Arrive at Destination", "Minimum Multiplications to Reach End", "Bellman Ford Algorithm", "Floyd Warshall Algorithm", "Find the City With the Smallest Number of Neighbors at a Threshold Distance"],
                "Minimum Spanning Tree / Disjoint Set": ["Prim's Algorithm", "Disjoint Set (Union by Rank / Size)", "Kruskal's Algorithm", "Number of Operations to Make Network Connected", "Most Stones Removed with Same Row or Column", "Accounts Merge", "Number of Island II", "Making a Large Island", "Swim in Rising Water"]
            },
            "17 - Tries": {
                "Theory & Implementation": ["Implement TRIE | INSERT | SEARCH | STARTSWITH", "Implement Trie - II (Prefix Tree)", "Complete String", "Count Distinct Substrings", "Bit Prerequisites for TRIE Problems", "Maximum XOR of Two Numbers in an Array", "Maximum XOR With an Element From Array"]
            }
        },
        "Patterns": {
            "10 - Sliding Window & Two Pointer": {
                "Medium Problems": ["Longest Substring Without Repeating Characters", "Max Consecutive Ones III", "Fruit Into Baskets", "Longest Repeating Character Replacement", "Binary Subarrays With Sum", "Count number of nice subarrays", "Number of substrings containing all three characters", "Maximum Points You Can Obtain from Cards"],
                "Hard Problems": ["Longest Substring with At Most K Distinct Characters", "Subarrays with K Different Integers", "Minimum Window Substring", "Minimum Window Subsequence"]
            }
        }
    };

    return {
        TAXONOMY,

        get currentLbTimeframe() {
            return _currentLbTimeframe;
        },

        async init() {
            const loadingEl = document.getElementById('admin-gate-loading');
            const loginEl = document.getElementById('admin-gate-login');
            const deniedEl = document.getElementById('admin-gate-denied');
            const contentEl = document.getElementById('admin-content');
            const deniedReason = document.getElementById('admin-denied-reason');
            const deniedAccount = document.getElementById('admin-denied-account');
            const switchAccountBtn = document.getElementById('admin-switch-account-btn');

            if (switchAccountBtn) {
                switchAccountBtn.addEventListener('click', async () => {
                    await AuthService.signOut();
                    if (deniedEl) deniedEl.style.display = 'none';
                    if (loginEl) loginEl.style.display = 'flex';
                });
            }

            this.bindLoginForm();

            try {
                // 1. Hydrate session
                let session = await AuthService.getSession();
                if (!session?.user && window.SupabaseConfig && window.SupabaseConfig.getClient()) {
                    const client = window.SupabaseConfig.getClient();
                    await new Promise(resolve => {
                        const timer = setTimeout(resolve, 1000);
                        const { data: { subscription } } = client.auth.onAuthStateChange((event, newSession) => {
                            if (newSession?.user) {
                                session = newSession;
                                clearTimeout(timer);
                                if (subscription && subscription.unsubscribe) subscription.unsubscribe();
                                resolve();
                            }
                        });
                    });
                }

                if (!session?.user) {
                    window.location.href = 'index.html';
                    return;
                }

                // 2. Perform authoritative admin check
                const isAdmin = await AdminService.checkIsAdmin();
                if (!isAdmin) {
                    if (loadingEl) loadingEl.style.display = 'none';
                    if (loginEl) loginEl.style.display = 'none';
                    if (deniedReason) {
                        deniedReason.innerHTML = 'You do not have administrative privileges to access this control center.<br>This account is authenticated, but is not provisioned with the <code>admin</code> role in <code>public.user_roles</code>.';
                    }
                    if (deniedAccount) {
                        deniedAccount.style.display = 'block';
                        deniedAccount.innerHTML = `
                            <strong>Authenticated Account:</strong><br>
                            Email: <code>${session.user.email || 'N/A'}</code><br>
                            User UUID: <code>${session.user.id}</code>
                        `;
                    }
                    if (deniedEl) deniedEl.style.display = 'flex';
                    return;
                }

                // 3. Authorized Admin
                if (loadingEl) loadingEl.style.display = 'none';
                if (loginEl) loginEl.style.display = 'none';
                if (deniedEl) deniedEl.style.display = 'none';
                if (contentEl) contentEl.style.display = 'block';

                const adminDisplay = document.getElementById('admin-user-display');
                if (adminDisplay) {
                    adminDisplay.textContent = `Logged in as: ${session.user.email || session.user.id}`;
                }

                this.bindEvents();
                this.populateFilterTopics();
                await this.loadMetrics();
                await this.loadProblems(1);
                await this.loadUsers();
            } catch (e) {
                console.error('Admin init error:', e);
                if (loadingEl) loadingEl.style.display = 'none';
                if (deniedEl) deniedEl.style.display = 'flex';
            }
        },

        bindLoginForm() {
            const form = document.getElementById('admin-direct-login-form');
            const toggleBtn = document.getElementById('toggle-admin-password');
            const passInput = document.getElementById('admin-login-password');

            // 1. Password Visibility Toggle
            if (toggleBtn && passInput) {
                const eyeOpenSvg = `
                    <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>`;
                const eyeSlashSvg = `
                    <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>`;

                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const isPassword = passInput.type === 'password';
                    passInput.type = isPassword ? 'text' : 'password';
                    toggleBtn.innerHTML = isPassword ? eyeSlashSvg : eyeOpenSvg;
                    const label = isPassword ? 'Hide password' : 'Show password';
                    toggleBtn.setAttribute('aria-label', label);
                    toggleBtn.setAttribute('title', label);
                });
            }

            // 2. Direct Admin Sign In Submit
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('admin-login-email');
                    const errBox = document.getElementById('admin-login-error');
                    const submitBtn = document.getElementById('admin-login-submit');

                    const identifier = emailInput ? emailInput.value.trim() : '';
                    const password = passInput ? passInput.value : '';

                    if (!identifier || !password) return;

                    errBox.style.display = 'none';
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Verifying Admin Credentials...';

                    try {
                        await AuthService.signIn(identifier, password);
                        const isAdmin = await AdminService.checkIsAdmin();
                        if (!isAdmin) {
                            await AuthService.signOut();
                            throw new Error('You are not authorized to access the Admin Portal.');
                        }
                        window.location.reload();
                    } catch (err) {
                        errBox.textContent = err.message || 'Authentication failed.';
                        errBox.style.display = 'block';
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Sign In to Admin Portal';
                    }
                });
            }

            // 3. Admin Forgot Password Flow
            const forgotLink = document.getElementById('admin-forgot-link');
            const backToLoginLink = document.getElementById('admin-back-to-login');
            const resetForm = document.getElementById('admin-direct-reset-form');
            const resetEmailInput = document.getElementById('admin-reset-email');
            const resetStatus = document.getElementById('admin-reset-status');
            const resetSubmitBtn = document.getElementById('admin-reset-submit');

            if (forgotLink && form && resetForm) {
                forgotLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const loginEmail = document.getElementById('admin-login-email');
                    if (loginEmail && resetEmailInput) {
                        resetEmailInput.value = loginEmail.value.trim();
                    }
                    form.style.display = 'none';
                    resetForm.style.display = 'block';
                    if (resetStatus) resetStatus.style.display = 'none';
                });
            }

            if (backToLoginLink && form && resetForm) {
                backToLoginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    resetForm.style.display = 'none';
                    form.style.display = 'block';
                    const errBox = document.getElementById('admin-login-error');
                    if (errBox) errBox.style.display = 'none';
                });
            }

            if (resetForm) {
                resetForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const identifier = resetEmailInput ? resetEmailInput.value.trim() : '';
                    if (!identifier) return;

                    if (resetStatus) {
                        resetStatus.style.display = 'none';
                    }
                    if (resetSubmitBtn) {
                        resetSubmitBtn.disabled = true;
                        resetSubmitBtn.textContent = 'Sending Reset Link...';
                    }

                    try {
                        await AuthService.resetPassword(identifier);
                        if (resetStatus) {
                            resetStatus.style.display = 'block';
                            resetStatus.style.background = 'rgba(34, 197, 94, 0.12)';
                            resetStatus.style.border = '1px solid rgba(34, 197, 94, 0.35)';
                            resetStatus.style.color = '#86efac';
                            resetStatus.textContent = 'Password reset email sent. Check your inbox.';
                        }
                    } catch (err) {
                        if (resetStatus) {
                            resetStatus.style.display = 'block';
                            resetStatus.style.background = 'rgba(239, 68, 68, 0.12)';
                            resetStatus.style.border = '1px solid rgba(239, 68, 68, 0.35)';
                            resetStatus.style.color = '#fca5a5';
                            resetStatus.textContent = err.message || 'Failed to send password reset email.';
                        }
                    } finally {
                        if (resetSubmitBtn) {
                            resetSubmitBtn.disabled = false;
                            resetSubmitBtn.textContent = 'Send Password Reset Link';
                        }
                    }
                });
            }
        },

        switchTab(tabKey) {
            _currentTab = tabKey;
            document.querySelectorAll('.admin-nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));

            const tabMap = {
                'overview': 0,
                'content': 1,
                'users': 2,
                'competition': 3,
                'analytics': 4,
                'settings': 5
            };

            const tabs = document.querySelectorAll('.admin-nav-tab');
            if (tabMap[tabKey] !== undefined && tabs[tabMap[tabKey]]) {
                tabs[tabMap[tabKey]].classList.add('active');
            }

            const panel = document.getElementById(`admin-panel-${tabKey}`);
            if (panel) panel.classList.add('active');

            if (tabKey === 'overview') {
                this.loadMetrics();
            } else if (tabKey === 'content') {
                this.switchContentSubtab(_currentContentSubtab);
            } else if (tabKey === 'users') {
                this.loadUsers(_userSearchQuery, _userStatusFilter);
            } else if (tabKey === 'competition') {
                this.loadCompetitiveStandings(_currentLbTimeframe);
            } else if (tabKey === 'analytics') {
                this.loadDeepAnalytics();
            } else if (tabKey === 'settings') {
                this.loadSettingsView();
            }
        },

        switchContentSubtab(subtabKey) {
            _currentContentSubtab = subtabKey;
            document.querySelectorAll('.admin-subnav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-content-subpanel').forEach(p => p.classList.remove('active'));

            const subtabBtnMap = {
                'problems': 0,
                'topics': 1,
                'roadmap': 2,
                'daily': 3,
                'contests': 4,
                'announcements': 5
            };

            const subtabs = document.querySelectorAll('.admin-subnav-tab');
            if (subtabBtnMap[subtabKey] !== undefined && subtabs[subtabBtnMap[subtabKey]]) {
                subtabs[subtabBtnMap[subtabKey]].classList.add('active');
            }

            const subpanel = document.getElementById(`content-subpanel-${subtabKey}`);
            if (subpanel) subpanel.classList.add('active');

            if (subtabKey === 'problems') {
                this.loadProblemStats();
                this.loadProblems(_currentPage);
            } else if (subtabKey === 'topics') {
                this.renderTopicsView();
            } else if (subtabKey === 'roadmap') {
                this.renderRoadmapView();
            } else if (subtabKey === 'daily') {
                this.renderDailyProblemsView();
            } else if (subtabKey === 'contests') {
                this.loadContestsAdmin();
            } else if (subtabKey === 'announcements') {
                this.loadAnnouncementsAdmin();
            }
        },

        bindEvents() {
            // Logout Button
            const logoutBtn = document.getElementById('admin-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async () => {
                    await AuthService.signOut();
                    window.location.href = 'index.html';
                });
            }

            // User Search with Debounce
            const userSearch = document.getElementById('admin-user-search');
            if (userSearch) {
                let debounce;
                userSearch.addEventListener('input', (e) => {
                    clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        _userSearchQuery = e.target.value;
                        this.loadUsers(_userSearchQuery, _userStatusFilter);
                    }, 300);
                });
            }

            // User Status Filter
            const userStatusFilter = document.getElementById('admin-user-status-filter');
            if (userStatusFilter) {
                userStatusFilter.addEventListener('change', (e) => {
                    _userStatusFilter = e.target.value;
                    this.loadUsers(_userSearchQuery, _userStatusFilter);
                });
            }

            // User Status Confirm Button in Modal
            const confirmStatusBtn = document.getElementById('btn-confirm-status');
            if (confirmStatusBtn) {
                confirmStatusBtn.addEventListener('click', async () => {
                    if (_pendingStatusChange) {
                        confirmStatusBtn.disabled = true;
                        confirmStatusBtn.textContent = 'Updating...';
                        try {
                            await AdminService.updateUserStatus(_pendingStatusChange.userId, _pendingStatusChange.newStatus);
                            document.getElementById('admin-status-modal').classList.remove('active');
                            await this.loadUsers(_userSearchQuery, _userStatusFilter);
                        } catch (err) {
                            alert('Failed to update status: ' + err.message);
                        } finally {
                            confirmStatusBtn.disabled = false;
                            confirmStatusBtn.textContent = 'Confirm Change';
                            _pendingStatusChange = null;
                        }
                    }
                });
            }

            // Setting Confirm Save Button in Modal
            const confirmSaveSettingBtn = document.getElementById('btn-confirm-save-setting');
            if (confirmSaveSettingBtn) {
                confirmSaveSettingBtn.addEventListener('click', async () => {
                    if (_pendingSettingChange) {
                        confirmSaveSettingBtn.disabled = true;
                        confirmSaveSettingBtn.textContent = 'Saving...';
                        try {
                            await SettingsService.saveSetting(_pendingSettingChange.key, _pendingSettingChange.value);
                            document.getElementById('admin-setting-confirm-modal').classList.remove('active');
                            alert('Setting updated successfully.');
                            this.loadSettingsView();
                        } catch (err) {
                            alert('Failed to save setting: ' + err.message);
                        } finally {
                            confirmSaveSettingBtn.disabled = false;
                            confirmSaveSettingBtn.textContent = 'Apply Update';
                            _pendingSettingChange = null;
                        }
                    }
                });
            }

            // Problem Search Input
            const probSearch = document.getElementById('admin-problem-search');
            if (probSearch) {
                let debounce;
                probSearch.addEventListener('input', (e) => {
                    clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        _activeFilters.search = e.target.value;
                        _currentPage = 1;
                        this.loadProblems(1);
                    }, 300);
                });
            }

            // Problem Filter Listeners
            const filterIds = [
                { id: 'admin-filter-difficulty', key: 'difficulty' },
                { id: 'admin-filter-platform', key: 'platform' },
                { id: 'admin-filter-status', key: 'status' },
                { id: 'admin-filter-topic', key: 'topic' },
                { id: 'admin-filter-sort', key: 'sortBy' }
            ];

            filterIds.forEach(({ id, key }) => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('change', (e) => {
                        _activeFilters[key] = e.target.value;
                        _currentPage = 1;
                        this.loadProblems(1);
                    });
                }
            });

            // Problem Add Button & Form
            const addProbBtn = document.getElementById('btn-open-add-problem');
            if (addProbBtn) addProbBtn.addEventListener('click', () => this.openAddProblemModal());

            const seedProbBtn = document.getElementById('btn-sync-master-problems');
            if (seedProbBtn) seedProbBtn.addEventListener('click', () => this.seedMasterProblems());

            const probForm = document.getElementById('admin-problem-form');
            if (probForm) {
                probForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveProblemForm();
                });
            }

            // Cascading Taxonomy inside Problem Form
            const phaseSel = document.getElementById('modal-prob-phase');
            const sectionSel = document.getElementById('modal-prob-section');
            const topicSel = document.getElementById('modal-prob-topic');

            if (phaseSel) {
                phaseSel.addEventListener('change', () => this.cascadePhaseChange(phaseSel.value));
            }
            if (sectionSel) {
                sectionSel.addEventListener('change', () => this.cascadeSectionChange(phaseSel ? phaseSel.value : '', sectionSel.value));
            }
            if (topicSel) {
                topicSel.addEventListener('change', () => this.cascadeTopicChange(phaseSel ? phaseSel.value : '', sectionSel ? sectionSel.value : '', topicSel.value));
            }

            // Announcement Form
            const annForm = document.getElementById('admin-announcement-form');
            if (annForm) {
                annForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveAnnouncementForm();
                });
            }

            // Contest Form
            const contForm = document.getElementById('admin-contest-form');
            if (contForm) {
                contForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveContestForm();
                });
            }
        },

        // =========================================================================
        // OVERVIEW & METRICS
        // =========================================================================
        async loadMetrics() {
            try {
                const m = await AdminService.getPlatformMetrics();
                const elTotal = document.getElementById('kpi-total-users');
                const elToday = document.getElementById('kpi-users-today');
                const elActive = document.getElementById('kpi-active-users');
                const elSolved = document.getElementById('kpi-total-solved');
                const elStars = document.getElementById('kpi-total-stars');
                const elCont = document.getElementById('kpi-contest-regs');

                if (elTotal) elTotal.textContent = m.totalUsers;
                if (elToday) elToday.textContent = `+${m.newUsersToday} today`;
                if (elActive) elActive.textContent = m.activeUsers;
                if (elSolved) elSolved.textContent = m.totalProblemsCompleted;
                if (elStars) elStars.textContent = m.totalStars;
                if (elCont) elCont.textContent = m.totalContestRegs;
            } catch (e) {
                console.error('Failed to load metrics:', e);
            }
        },

        // =========================================================================
        // USER CONTROL
        // =========================================================================
        async loadUsers(query = '', statusFilter = 'All') {
            const tbody = document.getElementById('admin-users-table-body');
            if (!tbody) return;

            try {
                const users = await AdminService.getUsersList(query, statusFilter);
                if (users.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No users found.</td></tr>`;
                    return;
                }

                tbody.innerHTML = users.map(u => {
                    const avatar = (u.username || 'U').charAt(0).toUpperCase();
                    const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—';
                    const lastActive = u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : '—';
                    const isSuspended = u.status === 'suspended';

                    return `
                        <tr>
                            <td>
                                <div class="admin-user-cell">
                                    <div class="admin-user-avatar">${avatar}</div>
                                    <div>
                                        <div style="font-weight: 700;">${u.username}</div>
                                        <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${u.id.substring(0, 8)}...</div>
                                    </div>
                                </div>
                            </td>
                            <td style="font-size: 0.82rem; color: var(--text-muted); font-family: monospace;">${u.email}</td>
                            <td>${joined}</td>
                            <td>${lastActive}</td>
                            <td style="font-weight: 700; color: #38bdf8;">✓ ${u.totalCompleted}</td>
                            <td style="font-weight: 700; color: #fbbf24;">⭐ ${u.stars}</td>
                            <td style="font-weight: 700; color: #f97316;">🔥 ${u.currentStreak}d</td>
                            <td>
                                <span class="status-badge ${u.status}">${isSuspended ? '🔴 Suspended' : '🟢 Active'}</span>
                            </td>
                            <td>
                                <div style="display: flex; gap: 6px;">
                                    <button class="btn-inspect" onclick="AdminController.inspectUser('${u.id}')">Inspect 🔍</button>
                                    <button class="${isSuspended ? 'btn-inspect' : 'btn-danger-outline'}" onclick="AdminController.openUserStatusModal('${u.id}', '${u.username}', '${u.status}')">
                                        ${isSuspended ? 'Activate ⚡' : 'Suspend ⛔'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            } catch (e) {
                tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #f87171; padding: 24px;">Failed to load users: ${e.message}</td></tr>`;
            }
        },

        async inspectUser(userId) {
            const modal = document.getElementById('admin-user-modal');
            const title = document.getElementById('modal-user-title');
            const content = document.getElementById('modal-user-content');

            if (modal) modal.classList.add('active');
            if (content) content.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">Loading user telemetry from Supabase...</div>';

            try {
                const d = await AdminService.getUserDetail(userId);
                if (title) title.textContent = `Telemetry: ${d.profile?.username || userId}`;

                const completedCount = (d.progress || []).filter(p => p.completed).length;

                content.innerHTML = `
                    <div class="detail-grid">
                        <div class="detail-card">
                            <div class="detail-card-label">User ID</div>
                            <div class="detail-card-val" style="font-size: 0.85rem; font-family: monospace;">${d.profile?.id}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-card-label">Email</div>
                            <div class="detail-card-val" style="font-size: 0.85rem;">${d.profile?.email || '—'}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-card-label">Account Status</div>
                            <div class="detail-card-val" style="color: ${d.profile?.status === 'suspended' ? '#f87171' : '#4ade80'};">${d.profile?.status || 'active'}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-card-label">Problems Solved</div>
                            <div class="detail-card-val" style="color: #38bdf8;">${completedCount}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-card-label">Practice Stars</div>
                            <div class="detail-card-val" style="color: #fbbf24;">⭐ ${d.stats?.stars || 0}</div>
                        </div>
                        <div class="detail-card">
                            <div class="detail-card-label">Current Streak</div>
                            <div class="detail-card-val" style="color: #f97316;">🔥 ${d.stats?.current_streak || 0} days</div>
                        </div>
                    </div>

                    <div style="margin-top: 20px;">
                        <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 8px;">Problem Solve Records (${(d.progress || []).length} items)</h4>
                        <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 12px; max-height: 180px; overflow-y: auto;">
                            ${(d.progress || []).length === 0 ? '<div style="color: var(--text-muted); font-size: 0.8rem;">No solves recorded yet.</div>' : 
                              d.progress.map(p => `
                                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                                    <span>Problem #${p.problem_id}</span>
                                    <span style="color: ${p.completed ? '#4ade80' : '#f59e0b'}; font-weight: 700;">${p.completed ? '✓ Completed' : 'In Progress'}</span>
                                </div>
                              `).join('')}
                        </div>
                    </div>
                `;
            } catch (e) {
                if (content) content.innerHTML = `<div style="padding: 24px; text-align: center; color: #f87171;">Failed to load user telemetry: ${e.message}</div>`;
            }
        },

        openUserStatusModal(userId, username, currentStatus) {
            const modal = document.getElementById('admin-status-modal');
            const title = document.getElementById('modal-status-title');
            const desc = document.getElementById('modal-status-desc');

            const isSuspended = currentStatus === 'suspended';
            const newStatus = isSuspended ? 'active' : 'suspended';

            _pendingStatusChange = { userId, newStatus };

            if (title) title.textContent = isSuspended ? `Reactivate Account: ${username}` : `Suspend Account: ${username}`;
            if (desc) {
                desc.innerHTML = isSuspended 
                    ? `Are you sure you want to <strong>reactivate</strong> <code>${username}</code>? The user will immediately be able to sign in and continue practice.`
                    : `Are you sure you want to <strong>suspend</strong> <code>${username}</code>? The account will be temporarily blocked from platform access.`;
            }

            if (modal) modal.classList.add('active');
        },

        // =========================================================================
        // COMPETITION CONTROL
        // =========================================================================
        async loadCompetitiveStandings(timeframe = 'all-time') {
            _currentLbTimeframe = timeframe;
            const tbody = document.getElementById('admin-lb-table-body');
            if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">Loading ${timeframe} leaderboard from Supabase...</td></tr>`;

            try {
                // 1. Top Performers Highlights
                const performers = await AdminService.getTopPerformers();
                const elScore = document.getElementById('top-performer-score');
                const elStars = document.getElementById('top-performer-stars');
                const elStreaks = document.getElementById('top-performer-streaks');
                const elSolved = document.getElementById('top-performer-solved');

                if (elScore && performers.topScore[0]) {
                    elScore.innerHTML = `<strong>${performers.topScore[0].displayName || performers.topScore[0].username}</strong> · <span style="color:#ef4444; font-weight:700;">${performers.topScore[0].competitiveScore} pts</span>`;
                }
                if (elStars && performers.topStars[0]) {
                    elStars.innerHTML = `<strong>${performers.topStars[0].displayName || performers.topStars[0].username}</strong> · <span style="color:#fbbf24; font-weight:700;">⭐ ${performers.topStars[0].stars}</span>`;
                }
                if (elStreaks && performers.topStreaks[0]) {
                    elStreaks.innerHTML = `<strong>${performers.topStreaks[0].displayName || performers.topStreaks[0].username}</strong> · <span style="color:#f97316; font-weight:700;">🔥 ${performers.topStreaks[0].currentStreak}d</span>`;
                }
                if (elSolved && performers.topCompleted[0]) {
                    elSolved.innerHTML = `<strong>${performers.topCompleted[0].displayName || performers.topCompleted[0].username}</strong> · <span style="color:#38bdf8; font-weight:700;">✓ ${performers.topCompleted[0].completedProblems}</span>`;
                }

                // 2. Competitive Leaderboard Table
                const res = window.LeaderboardService ? await window.LeaderboardService.getLeaderboard(timeframe, 50) : { users: [] };
                const users = res.users || [];

                const kpiTotal = document.getElementById('kpi-lb-total-users');
                const kpiActive = document.getElementById('kpi-lb-active-users');
                const kpiAvg = document.getElementById('kpi-lb-avg-score');
                const kpiStars = document.getElementById('kpi-lb-total-stars');

                const totalStars = users.reduce((sum, u) => sum + (u.stars || 0), 0);
                const totalScore = users.reduce((sum, u) => sum + (u.competitiveScore || 0), 0);
                const avgScore = users.length > 0 ? Math.round(totalScore / users.length) : 0;
                const activeCount = users.filter(u => u.completedProblems > 0 || u.currentStreak > 0 || u.stars > 0).length;

                if (kpiTotal) kpiTotal.textContent = users.length;
                if (kpiActive) kpiActive.textContent = activeCount;
                if (kpiAvg) kpiAvg.textContent = avgScore;
                if (kpiStars) kpiStars.textContent = totalStars;

                if (!tbody) return;

                if (users.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No contestants recorded for ${timeframe} timeframe.</td></tr>`;
                    return;
                }

                tbody.innerHTML = users.map((u, idx) => {
                    const rankNum = idx + 1;
                    const rankMedal = rankNum === 1 ? '🥇 #1' : (rankNum === 2 ? '🥈 #2' : (rankNum === 3 ? '🥉 #3' : `#${rankNum}`));
                    const avatar = (u.username || 'U').charAt(0).toUpperCase();

                    return `
                        <tr>
                            <td style="font-weight: 800; color: ${rankNum <= 3 ? '#ef4444' : 'var(--text-muted)'};">${rankMedal}</td>
                            <td>
                                <div class="admin-user-cell">
                                    <div class="admin-user-avatar">${avatar}</div>
                                    <div>
                                        <div style="font-weight: 700;">${u.displayName || u.username}</div>
                                        <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${u.userId?.substring(0, 8) || ''}...</div>
                                    </div>
                                </div>
                            </td>
                            <td style="font-weight: 800; color: #ef4444; font-family: 'JetBrains Mono', monospace; font-size: 1rem;">${u.competitiveScore} pts</td>
                            <td style="font-weight: 700; color: #fbbf24;">⭐ ${u.stars}</td>
                            <td style="font-weight: 700; color: #f97316;">🔥 ${u.currentStreak}d</td>
                            <td style="font-weight: 700; color: #38bdf8;">✓ ${u.completedProblems}</td>
                        </tr>
                    `;
                }).join('');
            } catch (err) {
                if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #f87171; padding: 24px;">Failed to load leaderboard: ${err.message}</td></tr>`;
            }
        },

        // =========================================================================
        // PLATFORM ANALYTICS
        // =========================================================================
        async loadDeepAnalytics() {
            try {
                const a = await AdminService.getDeepPlatformAnalytics();

                const elTotal = document.getElementById('analytics-total-users');
                const elToday = document.getElementById('analytics-today-users');
                const elActive = document.getElementById('analytics-active-users');
                const elProbs = document.getElementById('analytics-total-probs');
                const elSolves = document.getElementById('analytics-total-solves');
                const elStars = document.getElementById('analytics-total-stars');
                const elStreaks = document.getElementById('analytics-active-streaks');
                const elAvg = document.getElementById('analytics-avg-solves');

                if (elTotal) elTotal.textContent = a.totalUsers;
                if (elToday) elToday.textContent = `+${a.newUsersToday}`;
                if (elActive) elActive.textContent = a.activeUsers;
                if (elProbs) elProbs.textContent = a.totalProblemsCatalog;
                if (elSolves) elSolves.textContent = a.totalProblemsCompleted;
                if (elStars) elStars.textContent = a.totalStars;
                if (elStreaks) elStreaks.textContent = a.activeStreaks;
                if (elAvg) elAvg.textContent = a.avgProblemsPerUser;

                // Render Popular Topics
                const topicsTbody = document.getElementById('admin-popular-topics-body');
                if (topicsTbody) {
                    if (!a.popularTopics || a.popularTopics.length === 0) {
                        topicsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">No problem completion activity recorded yet.</td></tr>`;
                    } else {
                        const totalCompletions = a.totalProblemsCompleted || 1;
                        topicsTbody.innerHTML = a.popularTopics.slice(0, 15).map((t, idx) => {
                            const pct = Math.round((t.completions / totalCompletions) * 100);
                            return `
                                <tr>
                                    <td style="font-weight: 800; color: ${idx < 3 ? '#fbbf24' : 'var(--text-muted)'};">#${idx + 1}</td>
                                    <td style="font-weight: 700;">${t.topic}</td>
                                    <td style="color: #38bdf8; font-weight: 800; font-family: 'JetBrains Mono', monospace;">${t.completions} solves</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="background: rgba(255,255,255,0.06); width: 100px; height: 8px; border-radius: 4px; overflow: hidden;">
                                                <div style="background: linear-gradient(90deg, #6366f1, #38bdf8); height: 100%; width: ${pct}%;"></div>
                                            </div>
                                            <span style="font-size: 0.75rem; color: var(--text-muted);">${pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('');
                    }
                }
            } catch (e) {
                console.error('Failed to load deep analytics:', e);
            }
        },

        // =========================================================================
        // TOPICS & SECTIONS VIEW
        // =========================================================================
        renderTopicsView() {
            const container = document.getElementById('topics-hierarchy-container');
            if (!container) return;

            const html = Object.keys(TAXONOMY).map(phase => {
                const sections = TAXONOMY[phase];
                return `
                    <div class="detail-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 style="font-size: 1.1rem; font-weight: 800; color: #a5b4fc;">Phase: ${phase}</h3>
                            <span class="status-badge published">${Object.keys(sections).length} Sections</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${Object.keys(sections).map(sec => {
                                const topics = sections[sec];
                                return `
                                    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">
                                        <div style="font-weight: 700; font-size: 0.92rem; color: #fff; margin-bottom: 6px;">📂 ${sec}</div>
                                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                            ${Object.keys(topics).map(top => `
                                                <span style="font-size: 0.75rem; background: rgba(99,102,241,0.15); color: #c7d2fe; border: 1px solid rgba(99,102,241,0.25); padding: 3px 8px; border-radius: 4px;">
                                                    ${top} (${topics[top].length} cards)
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = html;
        },

        // =========================================================================
        // ROADMAP VIEW
        // =========================================================================
        renderRoadmapView() {
            const container = document.getElementById('roadmap-phases-container');
            if (!container) return;

            const phases = (typeof window !== 'undefined' && (window.ROADMAP_PHASES || (window.RoadmapUI && window.RoadmapUI.ROADMAP_PHASES))) 
                || (typeof ROADMAP_PHASES !== 'undefined' ? ROADMAP_PHASES : []);

            if (!phases || phases.length === 0) {
                container.innerHTML = '<div style="color: var(--text-muted); padding: 20px;">Roadmap curriculum loading...</div>';
                return;
            }

            container.innerHTML = phases.map(p => `
                <div class="detail-card" style="border-left: 3px solid ${p.accentColor || '#6366f1'}; background: rgba(0,0,0,0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.3rem;">${p.icon || '📘'}</span>
                            <h4 style="font-size: 0.95rem; font-weight: 800; color: #fff;">${p.phaseNum || ''} · ${p.title}</h4>
                        </div>
                        <span class="status-badge published">${p.tier || 'Phase'}</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px;">${p.description || ''}</p>
                    <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 0.72rem; color: #a5b4fc; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
                            ${(p.concepts || []).length} Concepts:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${(p.concepts || []).map(c => `
                                <span style="font-size: 0.72rem; background: rgba(99,102,241,0.12); color: #c7d2fe; padding: 2px 6px; border-radius: 4px;">
                                    ${c.name}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        },

        // =========================================================================
        // DAILY PROBLEMS VIEW
        // =========================================================================
        async renderDailyProblemsView() {
            const previewContainer = document.getElementById('today-daily-preview-list');
            const dailyInput = document.getElementById('daily-count-input');

            if (typeof SettingsService !== 'undefined') {
                const s = await SettingsService.getSetting('daily_problems_count');
                if (s && s.count && dailyInput) {
                    dailyInput.value = s.count;
                }
            }

            if (!previewContainer || typeof DailyMissionManager === 'undefined') return;

            const mission = DailyMissionManager.getTodayMission();
            if (!mission || !mission.problems || mission.problems.length === 0) {
                previewContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.82rem;">No daily mission generated for today.</div>';
                return;
            }

            previewContainer.innerHTML = mission.problems.map((p, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,0,0,0.2); border-radius: 6px; font-size: 0.82rem;">
                    <div>
                        <span style="font-weight: 800; color: #6366f1; margin-right: 8px;">#${idx + 1}</span>
                        <strong>${p.title}</strong>
                        <span style="color: var(--text-muted); margin-left: 8px; font-size: 0.75rem;">(${p.topic || 'General'})</span>
                    </div>
                    <span class="status-badge ${p.difficulty.toLowerCase() === 'easy' ? 'active' : (p.difficulty.toLowerCase() === 'hard' ? 'suspended' : 'draft')}">
                        ${p.difficulty}
                    </span>
                </div>
            `).join('');
        },

        async saveDailyCountSetting() {
            const input = document.getElementById('daily-count-input');
            const count = parseInt(input?.value, 10) || 3;
            this.confirmSaveSetting('daily_problems_count', { count });
        },

        // =========================================================================
        // CONTESTS MANAGEMENT
        // =========================================================================
        async loadContestsAdmin() {
            const tbody = document.getElementById('admin-contests-table-body');
            if (!tbody) return;

            try {
                const contests = await ContestService.getAllContestsAdmin();
                if (contests.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No database contests created yet. Click "+ Add Contest" to create one.</td></tr>`;
                    return;
                }

                tbody.innerHTML = contests.map(c => `
                    <tr>
                        <td>
                            <strong>${c.title}</strong>
                            <div style="font-size: 0.72rem; color: var(--text-muted);"><a href="${c.contest_url}" target="_blank" style="color:#818cf8; text-decoration:none;">${c.contest_url}</a></div>
                        </td>
                        <td><span style="font-weight: 700;">${c.platform}</span></td>
                        <td style="font-size: 0.8rem; font-family: monospace;">
                            ${new Date(c.start_time).toLocaleString()}<br>
                            to ${new Date(c.end_time).toLocaleTimeString()}
                        </td>
                        <td><span style="font-size: 0.75rem; font-weight:700; color: #a5b4fc;">${c.category || 'MEDIUM'}</span></td>
                        <td><span class="status-badge ${c.status}">${c.status}</span></td>
                        <td>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn-inspect" onclick="AdminController.openEditContestModal('${c.id}')">Edit ✏️</button>
                                <button class="btn-danger-outline" onclick="AdminController.archiveContest('${c.id}')">Archive 📦</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            } catch (e) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #f87171; padding: 24px;">Failed to load contests: ${e.message}</td></tr>`;
            }
        },

        openAddContestModal() {
            _currentEditingContestId = null;
            document.getElementById('modal-contest-title').textContent = 'Add Multi-Platform Contest';
            document.getElementById('modal-contest-id').value = '';
            document.getElementById('modal-contest-heading').value = '';
            document.getElementById('modal-contest-platform').value = 'LeetCode';
            document.getElementById('modal-contest-category').value = 'MEDIUM';
            document.getElementById('modal-contest-url').value = '';
            document.getElementById('modal-contest-start').value = '';
            document.getElementById('modal-contest-end').value = '';
            document.getElementById('modal-contest-status').value = 'published';
            document.getElementById('admin-contest-modal').classList.add('active');
        },

        async openEditContestModal(contestId) {
            _currentEditingContestId = contestId;
            const contests = await ContestService.getAllContestsAdmin();
            const c = contests.find(item => item.id === contestId);
            if (!c) return;

            document.getElementById('modal-contest-title').textContent = 'Edit Contest';
            document.getElementById('modal-contest-id').value = c.id;
            document.getElementById('modal-contest-heading').value = c.title;
            document.getElementById('modal-contest-platform').value = c.platform;
            document.getElementById('modal-contest-category').value = c.category || 'MEDIUM';
            document.getElementById('modal-contest-url').value = c.contest_url;
            document.getElementById('modal-contest-start').value = c.start_time ? new Date(c.start_time).toISOString().slice(0, 16) : '';
            document.getElementById('modal-contest-end').value = c.end_time ? new Date(c.end_time).toISOString().slice(0, 16) : '';
            document.getElementById('modal-contest-status').value = c.status || 'published';
            document.getElementById('admin-contest-modal').classList.add('active');
        },

        async saveContestForm() {
            const id = document.getElementById('modal-contest-id').value;
            const title = document.getElementById('modal-contest-heading').value;
            const platform = document.getElementById('modal-contest-platform').value;
            const category = document.getElementById('modal-contest-category').value;
            const contest_url = document.getElementById('modal-contest-url').value;
            const start_time = document.getElementById('modal-contest-start').value;
            const end_time = document.getElementById('modal-contest-end').value;
            const status = document.getElementById('modal-contest-status').value;

            try {
                if (id) {
                    await ContestService.updateContest(id, { title, platform, category, contest_url, start_time, end_time, status });
                } else {
                    await ContestService.addContest({ title, platform, category, contest_url, start_time, end_time, status });
                }
                document.getElementById('admin-contest-modal').classList.remove('active');
                await this.loadContestsAdmin();
            } catch (err) {
                alert('Failed to save contest: ' + err.message);
            }
        },

        async archiveContest(contestId) {
            if (confirm('Archive this contest? It will be hidden from active user listings.')) {
                await ContestService.archiveContest(contestId);
                await this.loadContestsAdmin();
            }
        },

        // =========================================================================
        // ANNOUNCEMENTS MANAGEMENT
        // =========================================================================
        async loadAnnouncementsAdmin() {
            const tbody = document.getElementById('admin-announcements-table-body');
            if (!tbody) return;

            try {
                const announcements = await AnnouncementService.getAllAnnouncements();
                if (announcements.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No announcements created yet. Click "+ Create Announcement" to create one.</td></tr>`;
                    return;
                }

                tbody.innerHTML = announcements.map(a => `
                    <tr>
                        <td>
                            <strong>${a.title}</strong>
                            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${a.message}</div>
                        </td>
                        <td><span style="font-size: 0.75rem; font-weight:700;">${a.category || 'General'}</span></td>
                        <td style="font-size: 0.8rem;">
                            ${a.link_url ? `<a href="${a.link_url}" target="_blank" style="color: #818cf8;">${a.link_text || 'Link'} ↗</a>` : '—'}
                        </td>
                        <td style="font-size: 0.78rem; color: var(--text-muted);">
                            ${a.start_time ? new Date(a.start_time).toLocaleDateString() : 'Immediate'} 
                            ${a.end_time ? `to ${new Date(a.end_time).toLocaleDateString()}` : '(Permanent)'}
                        </td>
                        <td><span class="status-badge ${a.status}">${a.status}</span></td>
                        <td>
                            <div style="display: flex; gap: 6px;">
                                <button class="btn-inspect" onclick="AdminController.openEditAnnouncementModal('${a.id}')">Edit ✏️</button>
                                <button class="${a.status === 'published' ? 'btn-danger-outline' : 'btn-inspect'}" onclick="AdminController.toggleAnnouncementPublish('${a.id}', '${a.status}')">
                                    ${a.status === 'published' ? 'Unpublish' : 'Publish'}
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            } catch (e) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #f87171; padding: 24px;">Failed to load announcements: ${e.message}</td></tr>`;
            }
        },

        openAddAnnouncementModal() {
            _currentEditingAnnouncementId = null;
            document.getElementById('modal-announcement-title').textContent = 'Create Live Announcement';
            document.getElementById('modal-announcement-id').value = '';
            document.getElementById('modal-announcement-heading').value = '';
            document.getElementById('modal-announcement-message').value = '';
            document.getElementById('modal-announcement-category').value = 'Challenge';
            document.getElementById('modal-announcement-status').value = 'published';
            document.getElementById('modal-announcement-link').value = '';
            document.getElementById('modal-announcement-btntext').value = 'View Challenge';
            document.getElementById('admin-announcement-modal').classList.add('active');
        },

        async openEditAnnouncementModal(announcementId) {
            _currentEditingAnnouncementId = announcementId;
            const list = await AnnouncementService.getAllAnnouncements();
            const a = list.find(item => item.id === announcementId);
            if (!a) return;

            document.getElementById('modal-announcement-title').textContent = 'Edit Announcement';
            document.getElementById('modal-announcement-id').value = a.id;
            document.getElementById('modal-announcement-heading').value = a.title;
            document.getElementById('modal-announcement-message').value = a.message;
            document.getElementById('modal-announcement-category').value = a.category || 'General';
            document.getElementById('modal-announcement-status').value = a.status || 'published';
            document.getElementById('modal-announcement-link').value = a.link_url || '';
            document.getElementById('modal-announcement-btntext').value = a.link_text || 'View Challenge';
            document.getElementById('admin-announcement-modal').classList.add('active');
        },

        async saveAnnouncementForm() {
            const id = document.getElementById('modal-announcement-id').value;
            const title = document.getElementById('modal-announcement-heading').value;
            const message = document.getElementById('modal-announcement-message').value;
            const category = document.getElementById('modal-announcement-category').value;
            const status = document.getElementById('modal-announcement-status').value;
            const link_url = document.getElementById('modal-announcement-link').value;
            const link_text = document.getElementById('modal-announcement-btntext').value;

            try {
                if (id) {
                    await AnnouncementService.updateAnnouncement(id, { title, message, category, status, link_url, link_text });
                } else {
                    await AnnouncementService.addAnnouncement({ title, message, category, status, link_url, link_text });
                }
                document.getElementById('admin-announcement-modal').classList.remove('active');
                await this.loadAnnouncementsAdmin();
            } catch (err) {
                alert('Failed to save announcement: ' + err.message);
            }
        },

        async toggleAnnouncementPublish(id, currentStatus) {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published';
            try {
                await AnnouncementService.updateAnnouncement(id, { status: newStatus });
                await this.loadAnnouncementsAdmin();
            } catch (err) {
                alert('Failed to toggle status: ' + err.message);
            }
        },

        // =========================================================================
        // PLATFORM SETTINGS
        // =========================================================================
        async loadSettingsView() {
            if (typeof SettingsService === 'undefined') return;

            try {
                const s = await SettingsService.getAllSettings();
                const elDaily = document.getElementById('setting-daily-count');
                const elStar = document.getElementById('setting-star-reward');

                if (elDaily && s.daily_problems_count) {
                    elDaily.value = s.daily_problems_count.count || 3;
                }
                if (elStar && s.star_rules) {
                    elStar.value = s.star_rules.daily_problem_stars || 1;
                }
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        },

        confirmSaveSetting(key, value) {
            _pendingSettingChange = { key, value };
            const modal = document.getElementById('admin-setting-confirm-modal');
            const summary = document.getElementById('modal-setting-summary');

            if (summary) {
                summary.innerHTML = `Are you sure you want to update <strong>${key}</strong> to:<br><code>${JSON.stringify(value, null, 2)}</code>?`;
            }

            if (modal) modal.classList.add('active');
        },

        // =========================================================================
        // PROBLEM MANAGEMENT
        // =========================================================================
        populateFilterTopics() {
            const topicSelect = document.getElementById('admin-filter-topic');
            if (!topicSelect) return;

            const existingTopics = new Set();
            Object.values(TAXONOMY).forEach(phaseObj => {
                Object.keys(phaseObj).forEach(sec => existingTopics.add(sec));
            });

            if (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) {
                PROBLEMS.forEach(p => {
                    if (p.a2zSection) existingTopics.add(p.a2zSection);
                    else if (p.topic) existingTopics.add(p.topic);
                });
            }

            const sorted = Array.from(existingTopics).sort((a, b) => 
                a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
            );

            topicSelect.innerHTML = '<option value="All">All Sections / Topics</option>' +
                sorted.map(t => `<option value="${t}">${t}</option>`).join('');
        },

        async loadProblemStats() {
            try {
                const stats = await ProblemService.getProblemStats();
                const elTotal = document.getElementById('kpi-prob-total');
                const elPub = document.getElementById('kpi-prob-published');
                const elDraft = document.getElementById('kpi-prob-draft');
                const elArch = document.getElementById('kpi-prob-archived');
                const elDiff = document.getElementById('kpi-prob-diff-breakdown');

                if (elTotal) elTotal.textContent = stats.total;
                if (elPub) elPub.textContent = stats.published;
                if (elDraft) elDraft.textContent = stats.draft;
                if (elArch) elArch.textContent = stats.archived;
                if (elDiff) elDiff.textContent = `🟢 ${stats.easy} · 🟡 ${stats.medium} · 🔴 ${stats.hard}`;
            } catch (e) {
                console.warn('Problem stats warning:', e);
            }
        },

        async loadProblems(page = 1) {
            _currentPage = page;
            const tbody = document.getElementById('admin-problems-table-body');
            if (!tbody) return;

            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">Loading problem catalog...</td></tr>`;

            try {
                const result = await ProblemService.getProblems({
                    search: _activeFilters.search,
                    difficulty: _activeFilters.difficulty,
                    platform: _activeFilters.platform,
                    status: _activeFilters.status,
                    topic: _activeFilters.topic,
                    sortBy: _activeFilters.sortBy,
                    sortOrder: _activeFilters.sortOrder || 'asc',
                    page,
                    limit: _pageSize
                });

                const problems = result.problems || [];
                if (problems.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No problems match the current search / filter criteria.</td></tr>`;
                    this.renderPagination(result);
                    return;
                }

                // If Numerical Order is active, guarantee strict numeric ordering on displayed problems
                if (!_activeFilters.sortBy || _activeFilters.sortBy === 'problem_order') {
                    const isAsc = _activeFilters.sortOrder !== 'desc';
                    problems.sort((a, b) => {
                        const numA = Number(a.problem_order) > 0 ? Number(a.problem_order) : (Number(a.id) || 0);
                        const numB = Number(b.problem_order) > 0 ? Number(b.problem_order) : (Number(b.id) || 0);
                        if (numA !== numB) {
                            return isAsc ? (numA - numB) : (numB - numA);
                        }
                        const idA = Number(a.id) || 0;
                        const idB = Number(b.id) || 0;
                        return isAsc ? (idA - idB) : (idB - idA);
                    });
                }

                tbody.innerHTML = problems.map(p => {
                    const diffBadge = p.difficulty.toLowerCase() === 'easy' ? '🟢 Easy' : (p.difficulty.toLowerCase() === 'hard' ? '🔴 Hard' : '🟡 Medium');
                    const statusClass = p.status === 'published' ? 'published' : (p.status === 'draft' ? 'draft' : 'archived');
                    const statusLabel = p.status === 'published' ? '🟢 Published' : (p.status === 'draft' ? '🟡 Draft' : '⚪ Archived');

                    return `
                        <tr>
                            <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">#${p.id}</td>
                            <td>
                                <div style="font-weight: 700; font-size: 0.92rem;">${p.title}</div>
                                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                                    <a href="${p.url || '#'}" target="_blank" rel="noopener noreferrer" style="color: #818cf8; text-decoration: none;">${p.url || 'No URL'} ↗</a>
                                </div>
                            </td>
                            <td><span style="font-size: 0.8rem; font-weight: 600;">${p.platform || 'LeetCode'}</span></td>
                            <td><span style="font-size: 0.8rem; font-weight: 700;">${diffBadge}</span></td>
                            <td>
                                <div style="font-size: 0.8rem; font-weight: 600;">${p.section || p.topic || 'General'}</div>
                                <div style="font-size: 0.72rem; color: var(--text-muted);">${p.category || p.subtopic || 'General'}</div>
                            </td>
                            <td style="text-align: center; font-family: monospace; font-size: 0.82rem;">${p.problem_order || 0}</td>
                            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                            <td>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                    <button class="btn-inspect" onclick="AdminController.openEditProblemModal('${p.id}')">Edit ✏️</button>
                                    <button class="${p.status === 'published' ? 'btn-danger-outline' : 'btn-inspect'}" onclick="AdminController.toggleProblemStatus('${p.id}', '${p.status}')">
                                        ${p.status === 'published' ? 'Draft' : 'Publish'}
                                    </button>
                                    <button class="btn-danger-outline" onclick="AdminController.openArchiveProblemModal('${p.id}')">Archive 📦</button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');

                this.renderPagination(result);
            } catch (err) {
                tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #f87171; padding: 32px;">Failed to load problem catalog: ${err.message}</td></tr>`;
            }
        },

        renderPagination(result) {
            const container = document.getElementById('admin-problems-pagination');
            if (!container) return;

            const total = result.totalCount || 0;
            const totalPages = result.totalPages || 1;
            const page = result.page || 1;

            container.innerHTML = `
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                    Showing <strong>${total > 0 ? (page - 1) * _pageSize + 1 : 0}</strong> - <strong>${Math.min(page * _pageSize, total)}</strong> of <strong>${total}</strong> problems
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="AdminController.loadProblems(${page - 1})" ${page <= 1 ? 'disabled' : ''}>← Previous</button>
                    <span style="font-size: 0.85rem; font-weight: 700; color: #fff; padding: 6px 12px;">Page ${page} / ${totalPages}</span>
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="AdminController.loadProblems(${page + 1})" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
                </div>
            `;
        },

        openAddProblemModal() {
            document.getElementById('modal-problem-form-title').textContent = 'Add New DSA Problem';
            document.getElementById('admin-problem-form').reset();
            document.getElementById('modal-prob-order').value = 1;
            document.getElementById('modal-prob-status').value = 'published';
            document.getElementById('modal-prob-level').value = 'INTERMEDIATE';
            this.cascadePhaseChange('Foundation');
            document.getElementById('admin-problem-modal').classList.add('active');
        },

        async openEditProblemModal(problemId) {
            try {
                const res = await ProblemService.getProblems({ search: problemId, limit: 1 });
                const p = (res.problems || []).find(item => String(item.id) === String(problemId));
                if (!p) return;

                document.getElementById('modal-problem-form-title').textContent = `Edit Problem #${p.id}`;
                document.getElementById('modal-prob-title').value = p.title || '';
                document.getElementById('modal-prob-url').value = p.url || '';
                document.getElementById('modal-prob-platform').value = p.platform || 'LeetCode';
                document.getElementById('modal-prob-difficulty').value = p.difficulty || 'Medium';
                document.getElementById('modal-prob-order').value = p.problem_order || 1;
                document.getElementById('modal-prob-status').value = p.status || 'published';
                document.getElementById('modal-prob-level').value = p.level || 'INTERMEDIATE';
                document.getElementById('modal-prob-tags').value = Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '');

                const phase = p.phase || 'Foundation';
                document.getElementById('modal-prob-phase').value = phase;
                this.cascadePhaseChange(phase, p.section, p.topic, p.category || p.subtopic);

                document.getElementById('admin-problem-modal').classList.add('active');
            } catch (err) {
                alert('Failed to load problem: ' + err.message);
            }
        },

        cascadePhaseChange(selectedPhase, selectedSection = null, selectedTopic = null, selectedCategory = null) {
            const sectionSel = document.getElementById('modal-prob-section');
            if (!sectionSel) return;

            const sections = TAXONOMY[selectedPhase] ? Object.keys(TAXONOMY[selectedPhase]) : [];
            sectionSel.innerHTML = sections.map(s => `<option value="${s}" ${s === selectedSection ? 'selected' : ''}>${s}</option>`).join('');

            const activeSec = selectedSection || (sections.length > 0 ? sections[0] : '');
            this.cascadeSectionChange(selectedPhase, activeSec, selectedTopic, selectedCategory);
        },

        cascadeSectionChange(selectedPhase, selectedSection, selectedTopic = null, selectedCategory = null) {
            const topicSel = document.getElementById('modal-prob-topic');
            if (!topicSel) return;

            const secObj = TAXONOMY[selectedPhase] && TAXONOMY[selectedPhase][selectedSection] ? TAXONOMY[selectedPhase][selectedSection] : {};
            const topics = Object.keys(secObj);

            topicSel.innerHTML = topics.map(t => `<option value="${t}" ${t === selectedTopic ? 'selected' : ''}>${t}</option>`).join('');

            const activeTop = selectedTopic || (topics.length > 0 ? topics[0] : '');
            this.cascadeTopicChange(selectedPhase, selectedSection, activeTop, selectedCategory);
        },

        cascadeTopicChange(selectedPhase, selectedSection, selectedTopic, selectedCategory = null) {
            const catSel = document.getElementById('modal-prob-category');
            if (!catSel) return;

            const cards = (TAXONOMY[selectedPhase] && TAXONOMY[selectedPhase][selectedSection] && TAXONOMY[selectedPhase][selectedSection][selectedTopic])
                ? TAXONOMY[selectedPhase][selectedSection][selectedTopic]
                : ['General'];

            catSel.innerHTML = cards.map(c => `<option value="${c}" ${c === selectedCategory ? 'selected' : ''}>${c}</option>`).join('');
        },

        async saveProblemForm() {
            const title = document.getElementById('modal-prob-title').value;
            const url = document.getElementById('modal-prob-url').value;
            const platform = document.getElementById('modal-prob-platform').value;
            const difficulty = document.getElementById('modal-prob-difficulty').value;
            const phase = document.getElementById('modal-prob-phase').value;
            const section = document.getElementById('modal-prob-section').value;
            const topic = document.getElementById('modal-prob-topic').value;
            const category = document.getElementById('modal-prob-category').value;
            const problem_order = document.getElementById('modal-prob-order').value;
            const status = document.getElementById('modal-prob-status').value;
            const level = document.getElementById('modal-prob-level').value;
            const tags = document.getElementById('modal-prob-tags').value;

            const payload = {
                title,
                url,
                platform,
                difficulty,
                phase,
                section,
                topic,
                category,
                subtopic: category,
                problem_order: parseInt(problem_order, 10) || 0,
                status,
                level,
                tags
            };

            const modalTitle = document.getElementById('modal-problem-form-title').textContent;
            const isEdit = modalTitle.includes('Edit Problem #');
            const problemId = isEdit ? modalTitle.split('#')[1].trim() : null;

            try {
                if (isEdit && problemId) {
                    await ProblemService.updateProblem(problemId, payload);
                } else {
                    await ProblemService.addProblem(payload);
                }
                document.getElementById('admin-problem-modal').classList.remove('active');
                await this.loadProblemStats();
                await this.loadProblems(_currentPage);
            } catch (err) {
                const errBox = document.getElementById('modal-problem-error');
                if (errBox) {
                    errBox.textContent = err.message || 'Failed to save problem.';
                    errBox.style.display = 'block';
                }
            }
        },

        async toggleProblemStatus(problemId, currentStatus) {
            const newStatus = currentStatus === 'published' ? 'draft' : 'published';
            try {
                await ProblemService.updateProblem(problemId, { status: newStatus });
                await this.loadProblemStats();
                await this.loadProblems(_currentPage);
            } catch (err) {
                alert('Failed to update status: ' + err.message);
            }
        },

        async openArchiveProblemModal(problemId) {
            const modal = document.getElementById('admin-archive-modal');
            const infoEl = document.getElementById('archive-modal-dependency-info');
            const confirmBtn = document.getElementById('btn-confirm-archive');

            if (infoEl) infoEl.innerHTML = '<div style="font-size: 0.85rem; color: var(--text-muted);">Checking student solve dependencies...</div>';
            if (modal) modal.classList.add('active');

            try {
                const deps = await ProblemService.checkProblemDependencies(problemId);
                if (infoEl) {
                    infoEl.innerHTML = `
                        <div style="font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
                            Are you sure you want to archive <strong>Problem #${problemId}</strong>?<br><br>
                            <strong>Dependencies Checked:</strong><br>
                            • Solved by: <strong style="color: #38bdf8;">${deps.solves}</strong> students<br>
                            • Notes attached: <strong style="color: #fbbf24;">${deps.notes}</strong><br>
                            • Favorited: <strong style="color: #f87171;">${deps.favorites}</strong> times<br><br>
                            <span style="color: #4ade80;">🛡️ Archiving safely preserves all student completion records while hiding the problem from active catalog listings.</span>
                        </div>
                    `;
                }

                if (confirmBtn) {
                    confirmBtn.onclick = async () => {
                        confirmBtn.disabled = true;
                        confirmBtn.textContent = 'Archiving...';
                        try {
                            await ProblemService.updateProblem(problemId, { status: 'archived' });
                            modal.classList.remove('active');
                            await this.loadProblemStats();
                            await this.loadProblems(_currentPage);
                        } catch (err) {
                            alert('Failed to archive: ' + err.message);
                        } finally {
                            confirmBtn.disabled = false;
                            confirmBtn.textContent = 'Confirm Archive 📦';
                        }
                    };
                }
            } catch (e) {
                if (infoEl) infoEl.textContent = 'Failed to inspect dependencies.';
            }
        },

        async seedMasterProblems() {
            if (!confirm('Sync canonical 375 problems to Supabase? Existing database records and user progress will be preserved.')) return;

            const seedBtn = document.getElementById('btn-sync-master-problems');
            if (seedBtn) {
                seedBtn.disabled = true;
                seedBtn.textContent = 'Syncing... ⏳';
            }

            try {
                const dataset = typeof PROBLEMS !== 'undefined' ? PROBLEMS : [];
                let count = 0;
                for (const p of dataset) {
                    try {
                        await ProblemService.addProblem({
                            id: String(p.id),
                            title: p.title,
                            url: p.url,
                            platform: p.platform || 'LeetCode',
                            difficulty: p.difficulty || 'Medium',
                            section: p.a2zSection || p.topic,
                            topic: p.topic,
                            category: p.subtopic || 'General',
                            subtopic: p.subtopic || 'General',
                            problem_order: Number(p.id) || p.a2zSectionOrder || 0,
                            status: 'published',
                            level: p.level || 'INTERMEDIATE'
                        });
                        count++;
                    } catch (_) {
                        // Ignore duplicate errors during seed
                    }
                }
                alert(`Sync completed! ${count} canonical problems synced to Supabase.`);
                await this.loadProblemStats();
                await this.loadProblems(1);
            } catch (e) {
                alert('Sync notice: ' + e.message);
            } finally {
                if (seedBtn) {
                    seedBtn.disabled = false;
                    seedBtn.textContent = '🔄 Sync 375 to Cloud';
                }
            }
        }
    };
})();

// Alias for backward compatibility
const AdminProblemUI = AdminController;
window.AdminProblemUI = AdminProblemUI;
window.AdminController = AdminController;

document.addEventListener('DOMContentLoaded', () => {
    AdminController.init();
});
