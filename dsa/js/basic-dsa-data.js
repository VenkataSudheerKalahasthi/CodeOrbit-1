/**
 * Ctrl+Alt+Career - BASIC DSA Curriculum
 * Basic to Medium Mode Only
 * 14 Topics | IDs 6001-6146
 * Verified LeetCode / GeeksforGeeks / CodeChef / HackerRank URLs
 * Custom Practice compiler: https://www.jdoodle.com/online-java-compiler
 */

const BASIC_DSA_PROBLEMS = [
  // ============================================================
  // 1. LOGICAL BUILDING — MEDIUM (10 problems)
  // Concepts: Number Logic, Digit Manipulation, Mathematical Reasoning, Simulation
  // ============================================================
  { id: 6001, title: "Armstrong Number", topic: "Logical Building", subtopic: "Number Logic & Digit Manipulation", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6002, title: "Palindrome Number", topic: "Logical Building", subtopic: "Number Logic & Digit Manipulation", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/palindrome0447/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6003, title: "K-th Digit in a^b", topic: "Logical Building", subtopic: "Number Logic & Digit Manipulation", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/k-th-digit0737/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6004, title: "Digit Root", topic: "Logical Building", subtopic: "Number Logic & Digit Manipulation", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/digital-root/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6005, title: "N-th Term of 1, 3, 6, 10, 15...", topic: "Logical Building", subtopic: "Mathematical Reasoning", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/nth-term-of-series-1-3-6-10-151842/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6006, title: "Pair Cube Count", topic: "Logical Building", subtopic: "Mathematical Reasoning", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/pair-cube-count4132/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6007, title: "Running Comparison", topic: "Logical Building", subtopic: "Simulation & Game Logic", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/RUNCOMPARE", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6008, title: "Blobby Volley Scores", topic: "Logical Building", subtopic: "Simulation & Game Logic", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/BLOBBYVOLLEY", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6009, title: "Non-Negative Product", topic: "Logical Building", subtopic: "Simulation & Game Logic", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/NONNEGPROD", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6010, title: "Chef and Battery", topic: "Logical Building", subtopic: "Simulation & Game Logic", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/FIFTYPE", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 2. CONDITIONAL STATEMENTS — MEDIUM (10 problems)
  // Concepts: If-Else, Nested Conditions, Multiple Conditions, Decision Making
  // ============================================================
  { id: 6011, title: "Overlapping Rectangles", topic: "Conditional Statements", subtopic: "Geometry & Math Conditions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/overlapping-rectangles1905/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6012, title: "Day of the Week", topic: "Conditional Statements", subtopic: "Geometry & Math Conditions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/day-of-the-week1637/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6013, title: "Add Two Fractions", topic: "Conditional Statements", subtopic: "Geometry & Math Conditions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/add-two-fractions/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6014, title: "Car or Bike", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/CARBIKE", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6015, title: "Elections in Chefland", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/ELECTN", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6016, title: "Chef and NextGen", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/HELIUM3", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6017, title: "Is the Score Consistent", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/TRUESCORE", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6018, title: "The Three Topics", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/THREETOPICS", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6019, title: "Sale Season", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/SALESEASON", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6020, title: "Chefland Games", topic: "Conditional Statements", subtopic: "Decision Making & Comparison", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/CHEFGAMES", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 3. LOOPS — MEDIUM (11 problems)
  // Concepts: Iteration, Nested Loops, Number Iteration, Mathematical Loops
  // ============================================================
  { id: 6021, title: "Nth Fibonacci Number", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/nth-fibonacci-number1345/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6022, title: "Perfect Number", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/perfect-numbers3207/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6023, title: "All Factors / Divisors", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/all-factors-or-divisors-of-a-number/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6024, title: "Prime Factorization", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/prime-factorization/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6025, title: "Largest Prime Factor", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/largest-prime-factor2555/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6026, title: "Compute nPr", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/npr4253/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6027, title: "Compute nCr", topic: "Loops", subtopic: "Number Iteration & Factors", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/ncr1019/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6028, title: "Small Factorial", topic: "Loops", subtopic: "Mathematical Loops & Streaks", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/FCTRL2", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6029, title: "Puppy and Sum", topic: "Loops", subtopic: "Mathematical Loops & Streaks", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/PPSUM", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6030, title: "CodeChef Streak", topic: "Loops", subtopic: "Mathematical Loops & Streaks", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/CS2023_STK", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6031, title: "Kitchen Timetable", topic: "Loops", subtopic: "Mathematical Loops & Streaks", difficulty: "Medium", platform: "CodeChef", url: "https://www.codechef.com/problems/KTTABLE", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 4. MATHEMATICS + LOGIC BUILDING — MEDIUM (10 problems)
  // Concepts: Number Theory, Mathematical Formulae, Modular Arithmetic, Combinatorics
  // ============================================================
  { id: 6032, title: "Power of a Number", topic: "Mathematics + Logic Building", subtopic: "Arithmetic & Geometric Progressions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6033, title: "Find Missing Number in AP", topic: "Mathematics + Logic Building", subtopic: "Arithmetic & Geometric Progressions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/missing-element-of-ap0500/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6034, title: "N-th Term of an Arithmetic Progression", topic: "Mathematics + Logic Building", subtopic: "Arithmetic & Geometric Progressions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/series-ap5310/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6035, title: "Sum of Arithmetic Progression", topic: "Mathematics + Logic Building", subtopic: "Arithmetic & Geometric Progressions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/sum-of-an-ap1025/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6036, title: "Sum of Geometric Progression", topic: "Mathematics + Logic Building", subtopic: "Arithmetic & Geometric Progressions", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/sum-of-gp2120/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6037, title: "Euler's Totient Function", topic: "Mathematics + Logic Building", subtopic: "Number Theory & Modular Arithmetic", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/euler-totient4434/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6038, title: "Count Primes in a Range", topic: "Mathematics + Logic Building", subtopic: "Number Theory & Modular Arithmetic", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/count-primes-in-range1604/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6039, title: "Josephus Problem", topic: "Mathematics + Logic Building", subtopic: "Number Theory & Modular Arithmetic", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/josephus-problem/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6040, title: "Chinese Remainder Theorem", topic: "Mathematics + Logic Building", subtopic: "Number Theory & Modular Arithmetic", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/chinese-remainder-theorem/0", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6041, title: "Fermat's Little Theorem", topic: "Mathematics + Logic Building", subtopic: "Number Theory & Modular Arithmetic", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/fermats-little-theorem/0", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 5. FUNCTIONS — EASY → MEDIUM (10 problems)
  // Concepts: Function Declaration, Parameters, Arguments, Return Values, Function Composition
  // ============================================================
  { id: 6042, title: "Print All Prime Numbers in a Range", topic: "Functions", subtopic: "No Arguments + No Return Value", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/program-to-print-all-prime-numbers-in-a-given-range/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6043, title: "Print Pascal's Triangle", topic: "Functions", subtopic: "No Arguments + No Return Value", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/pascal-triangle0652/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6044, title: "Sort an Array Using a Function", topic: "Functions", subtopic: "Arguments + No Return Value", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/sort-an-array-using-functions/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6045, title: "Print All Permutations of a String", topic: "Functions", subtopic: "Arguments + No Return Value", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6046, title: "Generate a Random Number", topic: "Functions", subtopic: "No Arguments + Return Value", difficulty: "Easy", platform: "Practice", url: "https://www.jdoodle.com/online-java-compiler", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6047, title: "Find the Largest Element in an Array", topic: "Functions", subtopic: "No Arguments + Return Value", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6048, title: "Find the Median of an Array", topic: "Functions", subtopic: "Arguments + Return Value", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/find-the-median0527/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6049, title: "Find the Second Largest Element in an Array", topic: "Functions", subtopic: "Arguments + Return Value", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/second-largest3735/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6050, title: "Count Frequency of Each Element", topic: "Functions", subtopic: "Arguments + Return Value", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/frequency-of-array-elements-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6051, title: "Find Intersection of Two Arrays", topic: "Functions", subtopic: "Arguments + Return Value", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/intersection-of-two-arrays2404/1", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 6. STRINGS — EASY (15 problems)
  // Concepts: String Traversal, Character Manipulation, String Comparison, Word Processing
  // ============================================================
  { id: 6052, title: "Remove Vowels from a String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/remove-vowels-from-string1446/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6053, title: "Remove Characters from the First String Which Are Present in the Second String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/remove-character3815/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6054, title: "Check if a String is Subsequence of Another String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/check-for-subsequence4930/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6055, title: "Check if Two Strings are Rotations of Each Other", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/check-if-strings-are-rotations-of-each-other-or-not-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6056, title: "Find the First Repeated Character in a String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/repeated-character2058/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6057, title: "Find the First Non-Repeating Character in a String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6058, title: "Replace Spaces with %20", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/urlify-given-string-replace-spaces-20/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6059, title: "Move All Spaces to Front of String", topic: "Strings", subtopic: "String Traversal & Manipulation", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/move-spaces-front-string-single-traversal/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6060, title: "Check if a String Contains Only Digits", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/how-to-check-if-string-contains-only-digits-in-java/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6061, title: "Find the Most Frequent Character in a String", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/maximum-occuring-character-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6062, title: "Print Characters at Odd Positions", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/print-characters-at-odd-position-in-a-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6063, title: "Check Whether a String is Pangram", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/pangram-checking-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6064, title: "Find Smallest and Largest Word in a String", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/smallest-and-largest-word-in-a-given-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6065, title: "Count Words in a Given String", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/count-words-in-a-given-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6066, title: "Reverse Words in a Given String", topic: "Strings", subtopic: "String Checking & Word Processing", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/reverse-words-in-a-given-string5459/1", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 7. STRING FREQUENCY COUNTING — EASY (10 problems)
  // Concepts: Frequency Array, Hashing, Character Counting, Duplicate Detection, Uniqueness
  // ============================================================
  { id: 6067, title: "Count Frequency of Each Character in a String", topic: "String Frequency Counting", subtopic: "Character Frequency & Extremes", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/frequency-of-each-character-in-a-string-using-unordered_map-in-c/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6068, title: "Find the Most Frequent Character in a String", topic: "String Frequency Counting", subtopic: "Character Frequency & Extremes", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/maximum-occuring-character-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6069, title: "Find the Least Frequent Character in a String", topic: "String Frequency Counting", subtopic: "Character Frequency & Extremes", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/minimum-occurring-character-in-a-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6070, title: "Find the First Non-Repeating Character", topic: "String Frequency Counting", subtopic: "Character Frequency & Extremes", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6071, title: "Find the First Repeating Character", topic: "String Frequency Counting", subtopic: "Character Frequency & Extremes", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/repeated-character2058/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6072, title: "Print All Duplicate Characters in a String", topic: "String Frequency Counting", subtopic: "Duplicates & Anagram Frequencies", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/print-all-the-duplicates-in-the-input-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6073, title: "Print Characters with Frequency Greater Than One", topic: "String Frequency Counting", subtopic: "Duplicates & Anagram Frequencies", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/print-characters-with-frequency-greater-than-one-in-a-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6074, title: "Check Whether Two Strings Have the Same Character Frequencies", topic: "String Frequency Counting", subtopic: "Duplicates & Anagram Frequencies", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/check-whether-two-strings-have-same-character-frequencies/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6075, title: "Find the Character with Maximum Frequency", topic: "String Frequency Counting", subtopic: "Duplicates & Anagram Frequencies", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/maximum-occuring-character-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6076, title: "Count Frequency of Each Word in a String", topic: "String Frequency Counting", subtopic: "Duplicates & Anagram Frequencies", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/count-occurrences-of-each-word-in-a-given-string/", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 8. SEARCHING — EASY → EASY-MEDIUM (10 problems)
  // Concepts: Linear Search, Binary Search, Sorted Data, Search Boundaries, Search Optimization
  // ============================================================
  { id: 6077, title: "Linear Search", topic: "Searching", subtopic: "Linear & Binary Search Basics", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/linear-search/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6078, title: "Binary Search", topic: "Searching", subtopic: "Linear & Binary Search Basics", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6079, title: "Search Insert Position", topic: "Searching", subtopic: "Linear & Binary Search Basics", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/search-insert-position/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6080, title: "First Bad Version", topic: "Searching", subtopic: "Linear & Binary Search Basics", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/first-bad-version/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6081, title: "Find Smallest Letter Greater Than Target", topic: "Searching", subtopic: "Linear & Binary Search Basics", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/find-smallest-letter-greater-than-target/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6082, title: "Search in a Sorted Array", topic: "Searching", subtopic: "Search Boundaries & Rotated Arrays", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/search-in-a-sorted-array/0", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6083, title: "Count Occurrences in a Sorted Array", topic: "Searching", subtopic: "Search Boundaries & Rotated Arrays", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6084, title: "Find Floor and Ceil in a Sorted Array", topic: "Searching", subtopic: "Search Boundaries & Rotated Arrays", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/ceil-the-floor2824/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6085, title: "Find Peak Element", topic: "Searching", subtopic: "Search Boundaries & Rotated Arrays", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-peak-element/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6086, title: "Find Minimum in Rotated Sorted Array", topic: "Searching", subtopic: "Search Boundaries & Rotated Arrays", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 9. SORTING — EASY → EASY-MEDIUM (10 problems)
  // Concepts: Comparison Sorting, Insertion, Selection, Swapping, Array Ordering
  // ============================================================
  { id: 6087, title: "Bubble Sort", topic: "Sorting", subtopic: "Elementary Sorts & Transformations", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/bubble-sort/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6088, title: "Selection Sort", topic: "Sorting", subtopic: "Elementary Sorts & Transformations", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/selection-sort/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6089, title: "Insertion Sort", topic: "Sorting", subtopic: "Elementary Sorts & Transformations", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/insertion-sort/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6090, title: "Sort an Array of 0s, 1s and 2s", topic: "Sorting", subtopic: "Elementary Sorts & Transformations", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4242/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6091, title: "Sort Colors", topic: "Sorting", subtopic: "Elementary Sorts & Transformations", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/sort-colors/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6092, title: "Merge Sorted Array", topic: "Sorting", subtopic: "Array Ordering & Custom Sorting", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/merge-sorted-array/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6093, title: "Squares of a Sorted Array", topic: "Sorting", subtopic: "Array Ordering & Custom Sorting", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/squares-of-a-sorted-array/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6094, title: "Sort by Parity", topic: "Sorting", subtopic: "Array Ordering & Custom Sorting", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/sort-array-by-parity/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6095, title: "Height Checker", topic: "Sorting", subtopic: "Array Ordering & Custom Sorting", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/height-checker/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6096, title: "Relative Sort Array", topic: "Sorting", subtopic: "Array Ordering & Custom Sorting", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/relative-sorting4323/1", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 10. STACK — EASY → EASY-MEDIUM (10 problems)
  // Concepts: LIFO, Stack Operations, Parentheses, Monotonic Stack, Expression Evaluation
  // ============================================================
  { id: 6097, title: "Implement Stack Using Array", topic: "Stack", subtopic: "Stack Operations & Parentheses", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/implement-stack-using-array/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6098, title: "Valid Parentheses", topic: "Stack", subtopic: "Stack Operations & Parentheses", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-parentheses/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6099, title: "Remove All Adjacent Duplicates In String", topic: "Stack", subtopic: "Stack Operations & Parentheses", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6100, title: "Backspace String Compare", topic: "Stack", subtopic: "Stack Operations & Parentheses", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/backspace-string-compare/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6101, title: "Min Stack", topic: "Stack", subtopic: "Stack Operations & Parentheses", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/min-stack/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6102, title: "Next Greater Element I", topic: "Stack", subtopic: "Monotonic Stack & Expressions", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/next-greater-element-i/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6103, title: "Baseball Game", topic: "Stack", subtopic: "Monotonic Stack & Expressions", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/baseball-game/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6104, title: "Evaluate Reverse Polish Notation", topic: "Stack", subtopic: "Monotonic Stack & Expressions", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6105, title: "Make The String Great", topic: "Stack", subtopic: "Monotonic Stack & Expressions", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/make-the-string-great/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6106, title: "Daily Temperatures", topic: "Stack", subtopic: "Monotonic Stack & Expressions", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/daily-temperatures/", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 11. HASHING — EASY → EASY-MEDIUM (10 problems)
  // Concepts: HashMap, HashSet, Frequency Counting, Duplicate Detection, Lookup Optimization
  // ============================================================
  { id: 6107, title: "Two Sum", topic: "Hashing", subtopic: "Lookup Optimization & Duplicates", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/two-sum/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6108, title: "Contains Duplicate", topic: "Hashing", subtopic: "Lookup Optimization & Duplicates", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/contains-duplicate/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6109, title: "Contains Duplicate II", topic: "Hashing", subtopic: "Lookup Optimization & Duplicates", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/contains-duplicate-ii/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6110, title: "Valid Anagram", topic: "Hashing", subtopic: "Lookup Optimization & Duplicates", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-anagram/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6111, title: "Intersection of Two Arrays", topic: "Hashing", subtopic: "Lookup Optimization & Duplicates", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/intersection-of-two-arrays/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6112, title: "Intersection of Two Arrays II", topic: "Hashing", subtopic: "Sets & Grouping", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6113, title: "Happy Number", topic: "Hashing", subtopic: "Sets & Grouping", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/happy-number/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6114, title: "First Letter to Appear Twice", topic: "Hashing", subtopic: "Sets & Grouping", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/first-letter-to-appear-twice/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6115, title: "Majority Element", topic: "Hashing", subtopic: "Sets & Grouping", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/majority-element/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6116, title: "Group Anagrams", topic: "Hashing", subtopic: "Sets & Grouping", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/group-anagrams/", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 12. QUEUE — EASY → EASY-MEDIUM (10 problems)
  // Concepts: FIFO, Queue Operations, Circular Queue, Queue Simulation, Queue + Stack
  // ============================================================
  { id: 6117, title: "Implement Queue Using Array", topic: "Queue", subtopic: "Queue Implementation & Stacks", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6118, title: "Implement Queue Using Two Stacks", topic: "Queue", subtopic: "Queue Implementation & Stacks", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6119, title: "Implement Stack Using Two Queues", topic: "Queue", subtopic: "Queue Implementation & Stacks", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/stack-using-two-queues/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6120, title: "Number of Recent Calls", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-recent-calls/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6121, title: "Time Needed to Buy Tickets", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/time-needed-to-buy-tickets/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6122, title: "First Unique Character in a String", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6123, title: "Number of Students Unable to Eat Lunch", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6124, title: "Moving Average from Data Stream", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/moving-average-from-data-stream/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6125, title: "Design Circular Queue", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/design-circular-queue/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6126, title: "Dota2 Senate", topic: "Queue", subtopic: "Queue Simulation & Circular Queues", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/dota2-senate/", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 13. RECURSION — EASY → EASY-MEDIUM (10 problems)
  // Concepts: Base Case, Recursive Calls, Backtracking Basics, Divide & Conquer Thinking
  // ============================================================
  { id: 6127, title: "Sum of Natural Numbers Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/sum-of-first-n-terms5843/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6128, title: "Print 1 to N Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/print-1-to-n-without-using-loops/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6129, title: "Print N to 1 Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/print-n-to-1-without-loop/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6130, title: "Fibonacci Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/nth-fibonacci-number1345/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6131, title: "Factorial Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/factorial5739/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6132, title: "Power Using Recursion", topic: "Recursion", subtopic: "Basic Recursive Sequences", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6133, title: "Reverse a String Using Recursion", topic: "Recursion", subtopic: "String Recursion & Backtracking Basics", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/reverse-a-string-using-recursion/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6134, title: "Check Palindrome Using Recursion", topic: "Recursion", subtopic: "String Recursion & Backtracking Basics", difficulty: "Easy", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/palindrome-string0817/1", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6135, title: "Recursive Digit Sum", topic: "Recursion", subtopic: "String Recursion & Backtracking Basics", difficulty: "Medium", platform: "HackerRank", url: "https://www.hackerrank.com/challenges/recursive-digit-sum/problem", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6136, title: "Tower of Hanoi", topic: "Recursion", subtopic: "String Recursion & Backtracking Basics", difficulty: "Medium", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1", level: "BEGINNER", mode: "basic-to-medium" },

  // ============================================================
  // 14. MATRIX — EASY → EASY-MEDIUM (10 problems)
  // Concepts: 2D Arrays, Matrix Traversal, Row/Column Operations, Transformation, 2D Searching
  // ============================================================
  { id: 6137, title: "Print Matrix in Spiral Order", topic: "Matrix", subtopic: "Matrix Traversal & Operations", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/spiral-matrix/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6138, title: "Transpose Matrix", topic: "Matrix", subtopic: "Matrix Traversal & Operations", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/transpose-matrix/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6139, title: "Reshape the Matrix", topic: "Matrix", subtopic: "Matrix Traversal & Operations", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/reshape-the-matrix/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6140, title: "Matrix Diagonal Sum", topic: "Matrix", subtopic: "Matrix Traversal & Operations", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/matrix-diagonal-sum/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6141, title: "Richest Customer Wealth", topic: "Matrix", subtopic: "Matrix Traversal & Operations", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/richest-customer-wealth/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6142, title: "Toeplitz Matrix", topic: "Matrix", subtopic: "Matrix Transformation & Search", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/toeplitz-matrix/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6143, title: "Set Matrix Zeroes", topic: "Matrix", subtopic: "Matrix Transformation & Search", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/set-matrix-zeroes/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6144, title: "Search a 2D Matrix", topic: "Matrix", subtopic: "Matrix Transformation & Search", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/search-a-2d-matrix/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6145, title: "Rotate Image", topic: "Matrix", subtopic: "Matrix Transformation & Search", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/rotate-image/", level: "BEGINNER", mode: "basic-to-medium" },
  { id: 6146, title: "Lucky Numbers in a Matrix", topic: "Matrix", subtopic: "Matrix Transformation & Search", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/lucky-numbers-in-a-matrix/", level: "BEGINNER", mode: "basic-to-medium" }
];

if (typeof window !== "undefined") { window.BASIC_DSA_PROBLEMS = BASIC_DSA_PROBLEMS; }
if (typeof module !== "undefined" && module.exports) { module.exports = BASIC_DSA_PROBLEMS; }
