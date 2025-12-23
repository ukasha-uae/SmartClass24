import { Calculator } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Mathematics Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 6354-7425 from original file
 */

export const mathematicsSubject: Subject = {
    id: '2',
    slug: 'core-mathematics',
    name: 'Mathematics',
    icon: Calculator,
    description: 'Develop problem-solving skills in algebra, geometry, and more.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
            {
                id: 'math101',
                slug: 'number-numerals-1',
                title: 'Number & Numerals',
                lessons: [
                    {
                        id: 'math101-1',
                        slug: 'place-value-and-number-types',
                        title: 'Place Value and Number Types',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math101-2',
                        slug: 'operations-on-whole-numbers',
                        title: 'Operations on Whole Numbers (BODMAS)',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                     {
                        id: 'math101-3',
                        slug: 'fractions-decimals-percentages',
                        title: 'Fractions, Decimals & Percentages',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math101-4',
                        slug: 'ratio-proportion-rate',
                        title: 'Ratio, Proportion, and Rate',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math101-5',
                        slug: 'directed-numbers',
                        title: 'Directed Numbers',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                ],
            },
            {
                id: 'math102',
                slug: 'algebra-1',
                title: 'Algebra',
                lessons: [
                     {
                        id: 'math102-1',
                        slug: 'intro-to-algebra',
                        title: 'Introduction to Algebra',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math102-2',
                        slug: 'simplifying-expressions',
                        title: 'Simplifying Algebraic Expressions',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math102-3',
                        slug: 'simple-equations',
                        title: 'Simple Equations in One Variable',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                ],
            },
            {
                id: 'math103',
                slug: 'geometry-mensuration-1',
                title: 'Geometry & Mensuration',
                lessons: [
                    {
                        id: 'math103-1',
                        slug: 'basic-geometric-figures',
                        title: 'Basic Geometric Figures',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math103-2',
                        slug: 'properties-of-shapes',
                        title: 'Properties of Triangles and Quadrilaterals',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math103-3',
                        slug: 'perimeter-and-area',
                        title: 'Perimeter and Area of Plane Figures',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                ],
            },
             {
                id: 'math104',
                slug: 'statistics-probability-1',
                title: 'Statistics & Probability',
                lessons: [
                     {
                        id: 'math104-1',
                        slug: 'data-presentation',
                        title: 'Data Collection and Presentation',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math104-2',
                        slug: 'mean-median-mode',
                        title: 'Mean, Median, Mode',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                    {
                        id: 'math104-3',
                        slug: 'intro-to-probability',
                        title: 'Introduction to Probability',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                ],
            },
            {
                id: 'math105',
                slug: 'everyday-maths-1',
                title: 'Everyday Maths',
                lessons: [
                    {
                        id: 'math105-1',
                        slug: 'real-life-applications',
                        title: 'Application of Ratio, Percentages, and Decimals',
                        objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: ''
                    },
                ],
            },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
            {
                id: 'math201',
                slug: 'number-numerals-2',
                title: 'Number & Numerals',
                lessons: [
                    { id: 'math201-1', slug: 'lcm-hcf', title: 'Properties of Numbers (LCM, HCF)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math201-2', slug: 'percentages-advanced', title: 'Percentages (Profit/Loss, Simple Interest)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math201-3', slug: 'ratio-proportion-advanced', title: 'Ratio and Proportion (Advanced)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math201-4', slug: 'standard-form-approximation', title: 'Standard Form and Approximation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math202',
                slug: 'algebra-2',
                title: 'Algebra',
                lessons: [
                    { id: 'math202-1', slug: 'expanding-brackets', title: 'Expanding Brackets and Simplifying', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math202-2', slug: 'factorization', title: 'Factorization of Simple Expressions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math202-3', slug: 'linear-equations-advanced', title: 'Solving Linear Equations (Word Problems)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math202-4', slug: 'graphs-linear-equations', title: 'Graphs of Simple Linear Equations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math203',
                slug: 'geometry-mensuration-2',
                title: 'Geometry & Mensuration',
                lessons: [
                    { id: 'math203-1', slug: 'angles-polygons-circles', title: 'Angles in Polygons and Circles', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math203-2', slug: 'congruent-similar-figures', title: 'Congruent and Similar Figures', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math203-3', slug: 'symmetry', title: 'Symmetry (Line and Rotational)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math203-4', slug: 'perimeter-area-volume', title: 'Perimeter, Area, and Volume of Solids', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math203-5', slug: 'pythagoras-theorem', title: 'Pythagoras Theorem', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math204',
                slug: 'statistics-probability-2',
                title: 'Statistics & Probability',
                lessons: [
                    { 
                        id: 'math204-1', 
                        slug: 'mean-median-mode-range', 
                        title: 'Statistics: Mean, Median, Mode, Range', 
                        objectives: [
                            'Understand what measures of central tendency and dispersion are',
                            'Calculate the mean (average) of a set of numbers',
                            'Find the median (middle value) of ordered data',
                            'Identify the mode (most frequent value) in a dataset',
                            'Calculate the range of a dataset',
                            'Compare and choose the appropriate measure for different situations',
                            'Solve real-world problems using statistical measures'
                        ], 
                        introduction: `**Statistics** is the branch of mathematics that deals with collecting, organizing, and analyzing data. In this lesson, we focus on **measures of central tendency** (mean, median, mode) and **measures of dispersion** (range).

**Why are these important?**

**In Real Life:**
• **Grades:** Your class average tells you how well the whole class performed
• **Market Prices:** The average price of tomatoes helps you know if you're getting a good deal
• **Sports:** A footballer's average goals per game shows their performance
• **Health:** Average height and weight help doctors monitor growth

**In Ghana:**
• The Ghana Statistical Service uses these measures to understand our population
• Schools use them to analyze BECE results
• Businesses use them to track sales and profits
• Weather forecasts use averages to predict rainfall

**The Four Key Measures:**

**1. Mean (Average):** The sum of all values divided by how many values there are. Best when data has no extreme values.

**2. Median (Middle):** The middle value when data is arranged in order. Best when there are extreme values (outliers).

**3. Mode (Most Common):** The value that appears most frequently. Best for categorical data like shoe sizes.

**4. Range (Spread):** The difference between the highest and lowest values. Shows how spread out the data is.

Let's explore each of these in detail!`, 
                        keyConcepts: [
                            {
                                title: '1. The Mean (Average)',
                                content: `**Definition:** The mean is the sum of all values divided by the number of values.

**Formula:**
$$\\text{Mean} = \\frac{\\text{Sum of all values}}{\\text{Number of values}}$$

Or using symbols:
$$\\bar{x} = \\frac{\\sum x}{n}$$

Where:
• $\\bar{x}$ (pronounced "x-bar") = mean
• $\\sum x$ (sigma x) = sum of all values
• $n$ = number of values

---

**Example 1: Simple Mean**

Find the mean of these test scores: **5, 7, 8, 6, 9**

\`\`\`animation
{
  "type": "number-line-mean",
  "data": [5, 7, 8, 6, 9],
  "showCalculation": true
}
\`\`\`

**Solution:**
Step 1: Add all values
$$\\sum x = 5 + 7 + 8 + 6 + 9 = 35$$

Step 2: Count how many values (n)
$$n = 5$$

Step 3: Divide sum by count
$$\\text{Mean} = \\frac{35}{5} = 7$$

**Answer: The mean score is 7 out of 10**

---

**Example 2: Mean with Larger Numbers**

A trader sold yams on 6 days. The number sold each day were: **12, 15, 10, 18, 14, 15**

Find the mean number of yams sold per day.

**Solution:**
$$\\text{Mean} = \\frac{12 + 15 + 10 + 18 + 14 + 15}{6} = \\frac{84}{6} = 14$$

**Answer: On average, the trader sold 14 yams per day**

---

**Example 3: Finding a Missing Value**

The mean of five numbers is 8. Four of the numbers are 6, 7, 9, and 10. Find the fifth number.

\`\`\`animation
{
  "type": "missing-value",
  "known": [6, 7, 9, 10],
  "mean": 8,
  "total": 5
}
\`\`\`

**Solution:**
Step 1: Use the mean formula
$$\\text{Mean} = \\frac{\\text{Sum}}{n}$$

Step 2: Substitute known values
$$8 = \\frac{\\text{Sum}}{5}$$

Step 3: Find the sum
$$\\text{Sum} = 8 \\times 5 = 40$$

Step 4: Add known numbers
$$6 + 7 + 9 + 10 = 32$$

Step 5: Find missing number
$$\\text{Missing number} = 40 - 32 = 8$$

**Answer: The fifth number is 8**

---

**When to Use Mean:**
✓ When data is evenly distributed
✓ When you want to share equally (e.g., sharing money)
✗ Not good when there are extreme values (outliers)

**Example of when NOT to use mean:**
Ages: 12, 13, 12, 14, 13, 50 (one adult in a group of children)
Mean = 19 years (misleading - most are around 12-13!)`
                            },
                            {
                                title: '2. The Median (Middle Value)',
                                content: `**Definition:** The median is the middle value when data is arranged in order from smallest to largest.

**Why it's useful:** Unlike the mean, the median is not affected by extreme values (outliers).

---

**Finding the Median:**

**For ODD number of values:** The median is the middle value

**For EVEN number of values:** The median is the mean of the two middle values

---

**Example 1: Odd Number of Values**

Find the median of: **15, 9, 22, 11, 18**

\`\`\`animation
{
  "type": "median-finder",
  "data": [15, 9, 22, 11, 18],
  "showSteps": true
}
\`\`\`

**Solution:**
Step 1: Arrange in order (smallest to largest)
$$9, 11, 15, 18, 22$$

Step 2: Count the values
$$n = 5 \\text{ (odd number)}$$

Step 3: Find the middle position
$$\\text{Position} = \\frac{n + 1}{2} = \\frac{5 + 1}{2} = \\frac{6}{2} = 3\\text{rd value}$$

Step 4: The 3rd value is 15

**Answer: Median = 15**

---

**Example 2: Even Number of Values**

Find the median of: **8, 12, 5, 15, 10, 9**

\`\`\`animation
{
  "type": "median-finder",
  "data": [8, 12, 5, 15, 10, 9],
  "showSteps": true
}
\`\`\`

**Solution:**
Step 1: Arrange in order
$$5, 8, 9, 10, 12, 15$$

Step 2: Count the values
$$n = 6 \\text{ (even number)}$$

Step 3: Find the two middle positions
$$\\text{Positions} = \\frac{n}{2} \\text{ and } \\frac{n}{2} + 1 = 3\\text{rd and } 4\\text{th values}$$

Step 4: The 3rd value is 9, the 4th value is 10

Step 5: Find the mean of the two middle values
$$\\text{Median} = \\frac{9 + 10}{2} = \\frac{19}{2} = 9.5$$

**Answer: Median = 9.5**

---

**Example 3: Real-Life Application**

Seven students scored these marks in a test: **45, 78, 62, 55, 90, 68, 58**

(a) Find the median mark
(b) If an 8th student who scored 48 joins, what is the new median?

**Solution (a):**
Step 1: Arrange in order
$$45, 55, 58, 62, 68, 78, 90$$

Step 2: Middle position (7 values - odd)
$$\\text{Position} = \\frac{7 + 1}{2} = 4\\text{th value}$$

**Median = 62 marks**

**Solution (b):**
Step 1: Add 48 and rearrange
$$45, 48, 55, 58, 62, 68, 78, 90$$

Step 2: Now 8 values (even)
Middle positions: 4th and 5th values = 58 and 62

Step 3: Mean of middle values
$$\\text{Median} = \\frac{58 + 62}{2} = \\frac{120}{2} = 60$$

**New Median = 60 marks**

---

**When to Use Median:**
✓ When there are extreme values (outliers)
✓ When you want to know the "typical" middle value
✓ With income data (a few very rich people don't skew it)

**Example:**
Salaries: GH₵500, GH₵600, GH₵550, GH₵10,000 (boss)
Mean = GH₵2,912.50 (misleading!)
Median = GH₵575 (more realistic for typical worker)`
                            },
                            {
                                title: '3. The Mode (Most Frequent Value)',
                                content: `**Definition:** The mode is the value that appears most frequently in a dataset.

**Key Points:**
• A dataset can have **one mode** (unimodal)
• A dataset can have **two modes** (bimodal)
• A dataset can have **more than two modes** (multimodal)
• A dataset can have **no mode** (if all values appear equally)

---

**Example 1: One Mode**

Find the mode of these shoe sizes: **5, 6, 5, 7, 8, 5, 6, 9**

\`\`\`animation
{
  "type": "mode-counter",
  "data": [5, 6, 5, 7, 8, 5, 6, 9],
  "showFrequency": true
}
\`\`\`

**Solution:**
Count how many times each value appears:
• 5 appears **3 times** ← Most frequent
• 6 appears 2 times
• 7 appears 1 time
• 8 appears 1 time
• 9 appears 1 time

**Answer: Mode = 5**

---

**Example 2: Two Modes (Bimodal)**

Find the mode of: **10, 12, 15, 12, 18, 15, 20**

**Solution:**
• 10 appears 1 time
• 12 appears **2 times** ← Most frequent
• 15 appears **2 times** ← Most frequent
• 18 appears 1 time
• 20 appears 1 time

Both 12 and 15 appear twice (most frequently)

**Answer: Modes = 12 and 15 (bimodal)**

---

**Example 3: No Mode**

Find the mode of: **3, 5, 7, 9, 11**

**Solution:**
Each value appears only once. No value is more frequent than others.

**Answer: No mode**

---

**Example 4: Real-Life Application**

A shoe shop recorded sales of different sizes in one week:

| Shoe Size | 5 | 6 | 7 | 8 | 9 |
|-----------|---|---|---|---|---|
| Frequency | 3 | 8 | 12| 7 | 2 |

What size should the shop stock the most?

**Solution:**
Size 7 was sold the most (12 times)

**Answer: Mode = Size 7**

**Conclusion: The shop should stock more size 7 shoes**

---

**Example 5: Mode in Grouped Data**

In a class, students chose their favorite sport:

\`\`\`animation
{
  "type": "bar-chart",
  "data": [
    {"label": "Football", "value": 12},
    {"label": "Basketball", "value": 5},
    {"label": "Athletics", "value": 8},
    {"label": "Swimming", "value": 3},
  ],
  "highlight": 0
}
\`\`\`

**Answer: Mode = Football (most popular sport)**

---

**When to Use Mode:**
✓ With categorical data (colors, names, types)
✓ To find what's most common or popular
✓ When planning inventory or stock
✓ With shoe sizes, shirt sizes, etc.

**Limitations:**
• Not useful for continuous numerical data
• May not exist or may not be unique`
                            },
                            {
                                title: '4. The Range (Measure of Spread)',
                                content: `**Definition:** The range is the difference between the highest and lowest values in a dataset.

**Formula:**
$$\\text{Range} = \\text{Highest Value} - \\text{Lowest Value}$$

**What it tells us:**
The range shows **how spread out** the data is. A larger range means more variation; a smaller range means data is more clustered.

---

**Example 1: Simple Range**

Find the range of these temperatures in °C: **25, 28, 22, 30, 26, 24**

\`\`\`animation
{
  "type": "range-visualizer",
  "data": [25, 28, 22, 30, 26, 24],
  "showMinMax": true
}
\`\`\`

**Solution:**
Step 1: Identify highest value
$$\\text{Highest} = 30°C$$

Step 2: Identify lowest value
$$\\text{Lowest} = 22°C$$

Step 3: Calculate range
$$\\text{Range} = 30 - 22 = 8°C$$

**Answer: Range = 8°C**

**Interpretation:** Temperature varied by 8 degrees during the period.

---

**Example 2: Comparing Two Datasets**

Two students took 5 tests each:

**Ama's scores:** 60, 62, 58, 61, 59
**Kofi's scores:** 40, 75, 55, 70, 50

(a) Find the range for each student
(b) What does this tell us about their consistency?

**Solution (a):**

**Ama:**
Range = 62 - 58 = 4 marks

**Kofi:**
Range = 75 - 40 = 35 marks

**Solution (b):**
**Ama** has a small range (4), meaning her scores are **consistent** - she performs similarly each time.

**Kofi** has a large range (35), meaning his scores **vary a lot** - sometimes high, sometimes low. He's inconsistent.

---

**Example 3: Range in Real Life**

Daily sales of plantain at Makola Market over 6 days:

**Week 1:** GH₵200, GH₵210, GH₵205, GH₵215, GH₵198, GH₵207
**Week 2:** GH₵150, GH₵280, GH₵160, GH₵290, GH₵170, GH₵250

Find the range for each week. Which week had more stable sales?

**Solution:**
**Week 1:**
Range = 215 - 198 = GH₵17

**Week 2:**
Range = 290 - 150 = GH₵140

**Answer: Week 1 had more stable (consistent) sales** because the range is much smaller.

---

**Using Range with Other Measures:**

Consider test scores: **50, 52, 51, 53, 52**
• Mean = 51.6
• Median = 52
• Mode = 52
• Range = 3

Small range + similar mean/median/mode = **very consistent data**

Compare to: **20, 50, 51, 80, 99**
• Mean = 60
• Median = 51
• Mode = None
• Range = 79

Large range + different measures = **data is spread out and inconsistent**

---

**Limitations of Range:**
• Affected by extreme values (outliers)
• Doesn't tell you about values in between
• Only uses two values (max and min)

**When to Use Range:**
✓ To quickly check how spread out data is
✓ To compare consistency between datasets
✓ With temperatures, scores, prices, etc.`
                            },
                            {
                                title: '5. Comparing Mean, Median, and Mode',
                                content: `**Which Measure Should You Use?**

Different situations call for different measures. Here's a guide:

---

**Comparison Table:**

\`\`\`geometry
{
  "type": "table",
  "height": 350,
  "tableData": {
    "headers": ["Measure", "Best For", "Affected by Outliers?", "Example Use"],
    "rows": [
      ["Mean", "Evenly distributed data", "Yes ✓", "Test scores, heights"],
      ["Median", "Data with outliers", "No ✗", "House prices, salaries"],
      ["Mode", "Categorical data", "No ✗", "Shoe sizes, colors"],
      ["Range", "Checking consistency", "Yes ✓", "Temperature variation"]
    ]
  }
}
\`\`\`

---

**Example: Choosing the Right Measure**

**Scenario:** Five friends earn these amounts per month:
**GH₵500, GH₵550, GH₵520, GH₵530, GH₵3,000** (one friend owns a shop)

Let's calculate all measures:

**Mean:**
$$\\frac{500 + 550 + 520 + 530 + 3000}{5} = \\frac{5100}{5} = GH₵1,020$$

**Median:**
Arrange: 500, 520, 530, 550, 3000
Middle value = GH₵530

**Mode:**
No mode (each value appears once)

**Range:**
3000 - 500 = GH₵2,500

\`\`\`animation
{
  "type": "comparison-chart",
  "measures": {
    "mean": 1020,
    "median": 530,
    "mode": null,
    "range": 2500
  },
  "data": [500, 550, 520, 530, 3000],
  "outlier": 3000
}
\`\`\`

**Analysis:**
• The **mean (GH₵1,020)** is misleading - most friends earn around GH₵500-550
• The **median (GH₵530)** better represents the "typical" income
• **No mode** - not useful here
• Large **range** shows big variation

**Conclusion: Use MEDIAN when there are extreme values**

---

**Practice Scenario:**

**Question:** A school wants to report student performance. Class scores are:
**45, 48, 50, 51, 52, 52, 52, 55, 58, 95**

The headmaster wants to use the mean (55.8) in the report. Is this fair?

**Answer:**
No! The mean is pulled up by the outlier (95). 

Better choice: **Median = 52** or **Mode = 52**

These better represent the typical student's performance.

---

**Summary:**

📊 **Mean** = Sum ÷ Count → Use for normal data
📊 **Median** = Middle value → Use when outliers present  
📊 **Mode** = Most frequent → Use for categories
📊 **Range** = Max - Min → Shows spread/consistency`
                            },
                            {
                                title: '6. Real-World Applications',
                                content: `**Statistics in Ghana - Practical Examples**

---

**1. Agriculture: Crop Yields**

A farmer harvested maize from 7 farms. Bags per farm: **15, 18, 16, 20, 17, 15, 19**

**Question:** What's the average yield? What's the most common yield?

**Solution:**
Mean = $\\frac{15+18+16+20+17+15+19}{7} = \\frac{120}{7} = 17.1$ bags

Mode = 15 bags (appears twice)

**Interpretation:** On average, each farm yields about 17 bags. The most common result is 15 bags.

---

**2. Market Trading: Daily Sales**

A kenkey seller tracked sales over one week (in portions):
**Monday: 50, Tuesday: 45, Wednesday: 48, Thursday: 52, Friday: 60, Saturday: 75, Sunday: 40**

\`\`\`animation
{
  "type": "line-graph",
  "data": [
    {"label": "Mon", "value": 50},
    {"label": "Tue", "value": 45},
    {"label": "Wed", "value": 48},
    {"label": "Thu", "value": 52},
    {"label": "Fri", "value": 60},
    {"label": "Sat", "value": 75},
    {"label": "Sun", "value": 40},
  ],
  "showMean": true
}
\`\`\`

**Calculate:**
• Mean = $\\frac{50+45+48+52+60+75+40}{7} = \\frac{370}{7} = 52.9$ portions
• Median: Arrange (40, 45, 48, **50**, 52, 60, 75) = 50 portions
• Range = 75 - 40 = 35 portions

**Business Decision:** Average about 53 portions per day. Saturday is the peak (75). Prepare more on weekends!

---

**3. Education: Class Performance**

A JHS 2 class's math test scores (out of 20):
**12, 15, 14, 16, 8, 15, 17, 13, 15, 18, 11, 15, 14, 16, 15**

**Calculate all measures:**

**Mean:**
Sum = 214, Count = 15
Mean = 214 ÷ 15 = 14.3

**Median:**
Arrange: 8, 11, 12, 13, 14, 14, 15, **15**, 15, 15, 15, 16, 16, 17, 18
Middle (8th value) = 15

**Mode:**
15 appears **5 times** (most frequent)
Mode = 15

**Range:**
18 - 8 = 10 marks

**Teacher's Report:**
"The class average is 14.3/20 (71.5%). The median and mode are both 15, showing most students scored around 15. The range of 10 shows moderate variation. One student (8 marks) may need extra support."

---

**4. Weather: Temperature Analysis**

Accra's daily high temperatures (°C) for one week:
**29, 31, 30, 32, 28, 30, 31**

**Statistics:**
• Mean = $\\frac{211}{7} = 30.1°C$
• Median = 30°C (middle of 28, 29, 30, 30, 31, 31, 32)
• Mode = 30°C and 31°C (bimodal)
• Range = 32 - 28 = 4°C

**Weather Report:** "Average temperature was 30°C with little variation (range of 4°C). Most days were around 30-31°C."

---

**5. Transport: Trotro Fares**

Passengers paid these fares on a trotro route (GH₵):
**5, 5, 5, 10, 10, 5, 15, 5, 10, 5**

**Calculate:**
• Mean = $\\frac{75}{10} = GH₵7.50$
• Median: Arrange (5,5,5,5,5,5,10,10,10,15), middle of 5 and 5 = GH₵5
• Mode = GH₵5 (appears 6 times)
• Range = 15 - 5 = GH₵10

**Interpretation:** Although average fare is GH₵7.50, the **most common fare is GH₵5** (mode). This is what most passengers pay for short distances.

---

**6. BECE Preparation: Setting Targets**

A student's mock test scores over 6 weeks: **55, 60, 62, 58, 65, 70**

\`\`\`animation
{
  "type": "progress-tracker",
  "data": [55, 60, 62, 58, 65, 70],
  "showTrend": true,
  "target": 75
}
\`\`\`

**Analysis:**
• Mean = 61.7 (current average)
• Median = 61
• Range = 15 (showing improvement from 55 to 70)
• Trend: Generally improving!

**Goal:** To reach target of 75, student needs to improve by about 13 marks from current average.

---

**Summary - Why This Matters:**

In Ghana, statistics help us:
✓ **Farmers** - plan planting and harvesting
✓ **Traders** - manage stock and pricing  
✓ **Students** - track academic progress
✓ **Weather** - predict rainfall and plan  
✓ **Healthcare** - monitor disease patterns
✓ **Government** - make policy decisions`
                            },
                        ], 
                        activities: { 
                            type: 'quiz', 
                            questions: [
                                {
                                    type: 'mcq',
                                    question: 'Find the mean of: 8, 12, 15, 10, 20',
                                    options: ['11', '12', '13', '15'],
                                    answer: '13',
                                    explanation: 'Mean = (8+12+15+10+20) ÷ 5 = 65 ÷ 5 = 13'
                                },
                                {
                                    type: 'mcq',
                                    question: 'Find the median of: 5, 9, 3, 7, 11',
                                    options: ['5', '7', '9', '11'],
                                    answer: '7',
                                    explanation: 'Arrange in order: 3, 5, 7, 9, 11. The middle value is 7'
                                },
                                {
                                    type: 'mcq',
                                    question: 'What is the mode of: 2, 5, 5, 7, 8, 5, 9?',
                                    options: ['2', '5', '7', '9'],
                                    answer: '5',
                                    explanation: '5 appears 3 times (most frequent)'
                                },
                                {
                                    type: 'mcq',
                                    question: 'Find the range of: 15, 22, 18, 30, 12',
                                    options: ['10', '15', '18', '18'],
                                    answer: '18',
                                    explanation: 'Range = Highest - Lowest = 30 - 12 = 18'
                                },
                                {
                                    type: 'mcq',
                                    question: 'The mean of 6, 8, x, 12 is 9. Find x.',
                                    options: ['8', '9', '10', '11'],
                                    answer: '10',
                                    explanation: 'Mean = 9, so (6+8+x+12)÷4 = 9. Therefore 26+x = 36, so x = 10'
                                },
                                {
                                    type: 'mcq',
                                    question: 'Which measure is most affected by outliers (extreme values)?',
                                    options: ['Mean', 'Median', 'Mode', 'None'],
                                    answer: 'Mean',
                                    explanation: 'The mean uses all values in its calculation, so extreme values significantly affect it. Median and mode are more resistant to outliers.'
                                },
                                {
                                    type: 'mcq',
                                    question: 'Find the median of: 4, 7, 9, 12, 15, 18',
                                    options: ['9', '10.5', '11', '12'],
                                    answer: '10.5',
                                    explanation: 'With 6 values (even), median = average of 3rd and 4th values = (9+12)÷2 = 10.5'
                                },
                                {
                                    type: 'mcq',
                                    question: 'What is the mode of: 10, 20, 30, 40, 50?',
                                    options: ['10', '30', 'No mode', '20'],
                                    answer: 'No mode',
                                    explanation: 'Each value appears only once, so there is no mode'
                                },
                                {
                                    type: 'mcq',
                                    question: 'Five students scored 60, 70, 65, 75, 80. What is their mean score?',
                                    options: ['68', '70', '72', '75'],
                                    answer: '70',
                                    explanation: 'Mean = (60+70+65+75+80)÷5 = 350÷5 = 70'
                                },
                                {
                                    type: 'mcq',
                                    question: 'For the data set: 500, 520, 540, 5000, which is the best measure of central tendency?',
                                    options: ['Mean', 'Median', 'Mode', 'Range'],
                                    answer: 'Median',
                                    explanation: 'The median (530) is best because 5000 is an outlier that would make the mean misleading'
                                },
                            ],
                        }, 
                        pastQuestions: [
                            {
                                question: 'The mean of 5 numbers is 12. Four of the numbers are 10, 11, 13, and 15. Find the fifth number.',
                                solution: 'Step 1: Mean = Sum ÷ n\n12 = Sum ÷ 5\nSum = 12 × 5 = 60\n\nStep 2: Add the four known numbers\n10 + 11 + 13 + 15 = 49\n\nStep 3: Fifth number\n60 - 49 = 11\n\nAnswer: The fifth number is 11'
                            },
                            {
                                question: 'The table shows the number of goals scored by a football team in 10 matches: 0, 1, 1, 2, 2, 2, 3, 3, 4, 5. Find (a) the mode (b) the median (c) the mean',
                                solution: '(a) Mode:\nGoals appearing most frequently:\n2 appears 3 times (most frequent)\nMode = 2 goals\n\n(b) Median:\nData already in order: 0,1,1,2,2,2,3,3,4,5\n10 values (even), so median = average of 5th and 6th\nMedian = (2+2)÷2 = 2 goals\n\n(c) Mean:\nSum = 0+1+1+2+2+2+3+3+4+5 = 23\nMean = 23÷10 = 2.3 goals\n\nAnswers: (a) Mode = 2, (b) Median = 2, (c) Mean = 2.3'
                            },
                            {
                                question: 'A shopkeeper recorded the number of customers each day for a week: 45, 52, 48, 50, 55, 60, 40. Find the range and explain what it tells us.',
                                solution: 'Step 1: Identify highest and lowest values\nHighest = 60 customers\nLowest = 40 customers\n\nStep 2: Calculate range\nRange = 60 - 40 = 20 customers\n\nExplanation:\nThe range of 20 tells us that customer numbers varied by 20 during the week. The difference between the busiest day (60) and the quietest day (40) was 20 customers.\n\nAnswer: Range = 20 customers'
                            },
                            {
                                question: 'The heights (in cm) of 7 students are: 145, 150, 148, 152, 150, 155, 150. Find the mode and explain why it is useful here.',
                                solution: 'Step 1: Count frequency of each height\n145 cm: 1 time\n148 cm: 1 time\n150 cm: 3 times ← Most frequent\n152 cm: 1 time\n155 cm: 1 time\n\nMode = 150 cm\n\nWhy it\'s useful:\nThe mode shows the most common height in the group. If making uniforms for this group, knowing that 150cm is most common helps with sizing decisions.\n\nAnswer: Mode = 150 cm'
                            },
                            {
                                question: 'Compare using mean and median: Data set A: 10, 12, 13, 11, 14. Data set B: 10, 12, 13, 11, 50. Which measure is better for each dataset and why?',
                                solution: 'Data Set A: 10, 12, 13, 11, 14\n\nMean = (10+12+13+11+14)÷5 = 60÷5 = 12\nMedian (arranged): 10,11,12,13,14 → Middle = 12\n\nMean = Median = 12 ✓\nBest measure: Either (data is balanced)\n\n---\n\nData Set B: 10, 12, 13, 11, 50\n\nMean = (10+12+13+11+50)÷5 = 96÷5 = 19.2\nMedian (arranged): 10,11,12,13,50 → Middle = 12\n\nMean (19.2) ≠ Median (12)\nBest measure: Median\n\nWhy? The value 50 is an outlier. It pulls the mean up to 19.2, which doesn\'t represent the typical value (most values are 10-13). The median of 12 better represents the "typical" value.\n\nAnswer: Set A - either measure; Set B - median is better'
                            },
                        ], 
                        summary: 'Statistics helps us make sense of data using measures of central tendency and dispersion. The **mean** (average) is the sum divided by count - best for balanced data. The **median** (middle value) is best when outliers are present. The **mode** (most frequent) is best for categorical data. The **range** (max-min) shows how spread out data is. Choose the right measure for your situation: mean for typical data, median for skewed data with outliers, mode for categories, and range to check consistency. These tools are essential in real life - from tracking your grades to helping businesses and government make decisions. Remember: Mean uses all values, Median resists outliers, Mode shows popularity, Range shows spread!'
                    },
                    { id: 'math204-2', slug: 'frequency-tables', title: 'Frequency Tables and Grouped Data', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math204-3', slug: 'histograms-pie-charts', title: 'Histograms and Pie Charts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math204-4', slug: 'probability-combined-events', title: 'Probability of Combined Events', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math205',
                slug: 'everyday-maths-2',
                title: 'Everyday Maths',
                lessons: [
                    { id: 'math205-1', slug: 'budgets-scale-drawing', title: 'Simple Household Budgets, Scale Drawing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math205-2', slug: 'time-speed-distance', title: 'Time, Speed, Distance Problems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
            {
                id: 'math301',
                slug: 'number-numerals-3',
                title: 'Number & Numerals',
                lessons: [
                    { id: 'math301-1', slug: 'sets', title: 'Sets and Operations on Sets', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math301-2', slug: 'indices-logarithms', title: 'Indices and Logarithms', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math301-3', slug: 'surds', title: 'Surds', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math302',
                slug: 'algebra-3',
                title: 'Algebra',
                lessons: [
                    { id: 'math302-1', slug: 'quadratic-equations', title: 'Quadratic Equations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math302-2', slug: 'simultaneous-linear-equations', title: 'Simultaneous Linear Equations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math302-3', slug: 'inequalities', title: 'Inequalities in One Variable', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math302-4', slug: 'graphs-quadratic-simultaneous', title: 'Graphs of Quadratic & Simultaneous Equations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math303',
                slug: 'geometry-mensuration-3',
                title: 'Geometry & Mensuration',
                lessons: [
                    { id: 'math303-1', slug: 'circle-theorems', title: 'Circle Theorems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math303-2', slug: 'trigonometry', title: 'Trigonometry', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math303-3', slug: 'mensuration-complex-solids', title: 'Mensuration of Complex Solids', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math303-4', slug: 'coordinate-geometry', title: 'Coordinate Geometry', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math304',
                slug: 'statistics-probability-3',
                title: 'Statistics & Probability',
                lessons: [
                    { id: 'math304-1', slug: 'measures-central-tendency-grouped', title: 'Measures of Central Tendency (Grouped Data)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math304-2', slug: 'measures-dispersion', title: 'Measures of Dispersion', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math304-3', slug: 'probability-independent-dependent', title: 'Probability (Independent/Dependent Events)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
            {
                id: 'math305',
                slug: 'everyday-maths-3',
                title: 'Everyday Maths',
                lessons: [
                    { id: 'math305-1', slug: 'financial-mathematics', title: 'Financial Mathematics (Compound Interest)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'math305-2', slug: 'advanced-word-problems', title: 'Advanced Word Problems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ],
            },
        ],
      },
    ],
  },
