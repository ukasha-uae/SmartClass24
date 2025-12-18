// {{level:shs:1}} Computer Programming (ICT) Lessons - NaCCA Standards-Based Curriculum
// Comprehensive lesson content for Introduction to Programming and Web Development

import type { Lesson } from '@/lib/types';

export const computerProgrammingSHS1Lessons: Lesson[] = [
  // Lesson 1: Introduction to Programming
  {
    id: 'ict-shs1-prog-1',
    slug: 'ict-intro-programming',
    title: 'Introduction to Programming',
    objectives: [
      'Define programming and explain its importance in the modern digital world',
      'Identify and describe popular programming languages and their applications',
      'Understand and create algorithms using step-by-step logical thinking',
      'Draw and interpret flowcharts using standard symbols',
      'Explain variables and data types (integer, float, string, boolean)',
      'Use input and output statements in simple programs',
      'Apply control structures (sequence, selection, iteration) in programming logic',
      'Write and debug simple Python programs',
      'Demonstrate problem-solving skills through programming exercises'
    ],
    introduction: "Welcome to the exciting world of programming! Programming is like teaching a computer to think and solve problems step by step. Just as you follow a recipe to cook {{food:rice}} or instructions to assemble furniture, computers follow programs we create. In this comprehensive lesson, you'll learn not just WHAT programming is, but HOW to think like a programmer and create your own solutions to real-world problems. Get ready for an interactive journey into the digital world!",
    keyConcepts: [
      {
        title: 'What is Programming?',
        content: `Programming is the art and science of giving instructions to computers. Imagine you're explaining to a friend who has never been to {{city:capital}} how to get from Circle to Osu. You'd give step-by-step directions: 'Walk to the main road, board a trotro heading to Osu, tell the mate to drop you at Oxford Street...' Programming is similar—you're giving computers detailed, logical instructions to accomplish tasks.

**Key Concepts:**
- Programming is writing instructions in a special language computers understand
- A program is like a recipe—a sequence of steps that must be followed in order
- Computers are very literal—they do exactly what you tell them, nothing more, nothing less
- Programming languages bridge the gap between human thinking and computer processing
- Popular languages include Python (beginner-friendly), JavaScript (for websites), Java (for apps), Scratch (visual programming)
- Every app on your phone, every website you visit, and every video game was created through programming

**🎯 Think About It**: List 5 apps or programs you use daily (WhatsApp, TikTok, Calculator, etc.). What instructions do you think programmers gave computers to make these work?`
      },
      {
        title: 'Why Should You Learn Programming?',
        content: `In {{country}}'s growing digital economy, programming skills are becoming as essential as reading and writing. Whether you want to start a tech business, work for companies like MTN or Jumia, or create solutions for your community, programming opens countless doors.

**Benefits of Learning Programming:**
- 💡 **Problem-Solving Superpower**: Learn to break down complex problems into manageable steps—a skill useful in every field
- 💰 **Career Opportunities**: {{country}}'s tech industry is booming! Programmers are needed in banking, telecommunications, agriculture, health, education, and startups
- 🚀 **Create, Don't Just Consume**: Build your own apps, games, or websites instead of just using others'
- 🤖 **Automation Magic**: Write programs to do repetitive tasks for you—like automatically sorting files, sending messages, or analyzing data
- 🌍 **Solve Local Problems**: Create solutions for {{country:adjective}} challenges—mobile money apps, agricultural monitoring systems, educational platforms
- 🎮 **Express Creativity**: Programming is creative! You can build games, animations, music apps, or digital art
- 💪 **Build Confidence**: Successfully running your first program gives an amazing feeling of accomplishment

**{{country:adjective}} Success Story**: Fred Swaniker (founder of African Leadership Academy) uses technology and programming to revolutionize education. Farmerline, a {{country:adjective}} startup, uses programming to help farmers with weather information via SMS. You could be next!`
      },
      {
        title: 'Understanding Algorithms',
        content: `Before you can write code, you need to think algorithmically. An algorithm is simply a step-by-step plan to solve a problem. You use algorithms every day without realizing it!

**What is an Algorithm?**
- 📋 **Definition**: A precise sequence of instructions that solves a specific problem
- 🎯 **Must Have**: A clear start, definite steps, and an end
- ✅ **Characteristics**: Finite (must end eventually), Definite (each step is clear), Effective (actually solves the problem)
- 🍲 **Everyday Example**: Making waakye—boil rice and beans separately, add millet leaves, cook until done, serve with gari and shito
- 📱 **Tech Example**: Sending a WhatsApp message—open app, select contact, type message, press send, wait for double tick
- 🔄 **Can Include**: Sequences (one after another), Decisions (if this, then that), Repetition (do this many times)

**✏️ Your Turn - Write an Algorithm**: Write step-by-step instructions for making a phone call. Start with 'Pick up phone' and end with 'End call'. Be very specific—remember, computers need exact instructions!

**Example: Algorithm to Find the Largest of Three Numbers**
1. START
2. Get three numbers: A, B, and C
3. Assume A is the largest
4. IF B is greater than A, then B becomes the largest
5. IF C is greater than the current largest, then C becomes the largest
6. Display the largest number
7. END

Notice how we check each number systematically. This logical approach is the foundation of programming!`
      },
      {
        title: 'Flowcharts: Visualizing Your Logic',
        content: `A flowchart is like a map of your program. Before you start coding, drawing a flowchart helps you see the entire solution visually. It's especially helpful when explaining your ideas to others or debugging problems.

**Flowchart Symbols:**
- 🔵 **Oval/Terminal (⬭)**: Marks the START and END of your program
- 📦 **Rectangle (▭)**: Represents a PROCESS or ACTION (e.g., 'Add 5 to total', 'Calculate average')
- 💎 **Diamond (◇)**: Shows a DECISION point—always asks a Yes/No question (e.g., 'Is age > 18?')
- 📥📤 **Parallelogram (▱)**: Indicates INPUT (getting data) or OUTPUT (showing results)
- ➡️ **Arrows**: Show the flow direction—which step comes next
- 📝 **Annotation (----)**: Add notes or comments to explain tricky parts

**Flowchart Example: Checking if a Student Passed**
\`\`\`
START (oval)
  ↓
INPUT: Get student's score (parallelogram)
  ↓
DECISION: Is score ≥ 50? (diamond)
  ↓ Yes → OUTPUT: 'You Passed!' (parallelogram) → END
  ↓ No → OUTPUT: 'You Failed' (parallelogram) → END
\`\`\`

**🎨 Draw It Yourself**: Create a flowchart for withdrawing money from a mobile money account. Include: START, Enter PIN, Check if PIN is correct, Check if balance is sufficient, Dispense money or Show error, END`
      },
      {
        title: 'Variables and Data Types',
        content: `Think of variables as labeled boxes where you store information. Just like you might have a box labeled 'School Books' or 'Clothes', variables have names and hold specific types of data. The computer remembers what's in each box and can use it when needed.

**Understanding Variables:**
- 📦 **What is a Variable?**: A named storage location that holds a value that can change
- 🏷️ **Variable Names**: Should be meaningful—use 'studentAge' not 'x', 'totalPrice' not 'tp'

**Data Types:**
- 🔢 **Integer**: Whole numbers (no decimals) → Examples: 18, -5, 1000, 0
- 💯 **Float/Decimal**: Numbers with decimal points → Examples: 3.14, 98.6, -0.5, 2.0
- 📝 **String**: Text or characters (always in quotes) → Examples: 'Kwame', '{{city:capital}}', 'GH¢50.00'
- ✅❌ **Boolean**: Only two values—True or False → Examples: isPassed = True, hasInternet = False
- 📊 **Why Data Types Matter**: Different types work differently—you can't add text to numbers!

**Real-World Analogy**: Think of it like Mobile Money—Your account (variable name) stores your balance (value). The balance is a number (data type) that changes when you send or receive money.

**Python Example:**
\`\`\`python
# Integer (whole number)
studentAge = 16

# Float (decimal)
average_score = 78.5

# String (text)
studentName = 'Ama Serwaa'
school = '{{country}} {{level:shs}}'

# Boolean (True/False)
isPassed = True
hasScholarship = False

# Using variables
print('Name:', studentName)
print('Age:', studentAge)
print('Average:', average_score)
print('Passed?', isPassed)
\`\`\`

**Variable Naming Rules:**
- ✅ Can contain letters, numbers, and underscores
- ✅ MUST start with a letter or underscore (not a number)
- ✅ Case-sensitive: 'Name' and 'name' are different!
- ❌ Cannot use spaces—use underscores instead: 'student_name' not 'student name'
- ❌ Cannot use reserved words (like if, else, for, print)
- 💡 Use camelCase (firstName) or snake_case (first_name)—be consistent!

**🎯 Challenge**: Declare variables for a student record system: Student's name (string), Age (integer), Height in meters (float), Is {{level:shs}} student? (boolean), Hometown (string)`
      },
      {
        title: 'Input and Output',
        content: `Every useful program needs to communicate with users. Input is how users give information to the program, and output is how the program responds. It's like a conversation between you and the computer!

**Understanding I/O:**
- 📥 **INPUT**: Getting information FROM the user into the program
- 📤 **OUTPUT**: Displaying information FROM the program TO the user
- ⌨️ **Input Methods**: Keyboard typing, mouse clicks, touchscreen, microphone, camera, sensors
- 🖥️ **Output Methods**: Screen display, speakers, printers, messages, files
- 🔄 **Flow**: Input → Process → Output (the basic cycle of most programs)

**Real-World Examples:**
1. **WhatsApp**: You type a message (input) → App formats and sends → Message appears in chat (output)
2. **Calculator**: You enter 5 + 3 (input) → Calculator adds → Shows 8 (output)
3. **Mobile Money**: Dial *170#, enter PIN (input) → System verifies → Confirmation message (output)

**Python Input/Output:**
\`\`\`python
# Getting input (always returns text/string)
name = input('Enter your name: ')
age = int(input('Enter your age: '))  # Convert to integer

# Showing output
print('Hello,', name)
print('You are', age, 'years old')
\`\`\`

**⚠️ Important**: \`input()\` always returns text (string). To get numbers, convert using \`int()\` or \`float()\`

**Common Mistakes:**
- ❌ Forgetting to convert input to numbers
- ❌ Not giving clear prompts
- ✅ Good: 'Enter your age in years: '
- ❌ Bad: 'Enter: '

**💻 Try This Simple Program:**
\`\`\`python
# Greeting Program
name = input('What is your name? ')
age = int(input('How old are you? '))

print('Hello', name + '!')
print('You are', age, 'years old.')

if age >= 12:
    print('You can attend {{level:shs}}!')
\`\`\``
      },
      {
        title: 'Control Structures',
        content: `Control structures are the decision-making and repeating mechanisms in programs. They make programs dynamic and intelligent instead of just following a straight line of instructions.

**Three Types of Control Structures:**

**1️⃣ Sequential Structure** - The simplest form: do step 1, then step 2, then step 3...

Example: Making instant noodles
1. Boil water
2. Add noodles
3. Wait 3 minutes
4. Drain water
5. Eat

\`\`\`python
print('Step 1')
print('Step 2')
print('Step 3')
# Each line runs one after another
\`\`\`

**2️⃣ Selection (If-Else)** - Make decisions based on conditions

Real-world: Boarding a trotro
\`\`\`
IF there's space:
  Board the trotro
ELSE:
  Wait for the next one
\`\`\`

Python example:
\`\`\`python
age = int(input('Enter your age: '))

if age >= 18:
    print('You can vote!')
    print('Register now')
else:
    print('You cannot vote yet')
    years_left = 18 - age
    print('Wait', years_left, 'more years')
\`\`\`

**Key Points:**
- Condition must be True or False
- If True: run the IF block
- If False: run the ELSE block
- You can have multiple conditions with ELIF (else-if)

**3️⃣ Iteration (Loops)** - Repeat actions automatically

**FOR Loop** - When you know HOW MANY times to repeat
\`\`\`python
for i in range(5):
    print('{{country}}!')
# Prints '{{country}}!' 5 times
\`\`\`

**WHILE Loop** - Repeat UNTIL a condition becomes false
\`\`\`python
correct_pin = '1234'
pin = ''
while pin != correct_pin:
    pin = input('Enter PIN: ')
    if pin == correct_pin:
        print('Access granted!')
    else:
        print('Wrong PIN, try again')
\`\`\`

**Real-World Loop - Selling {{food:popular}}:**
\`\`\`
WHILE there are customers in line:
  - Take order
  - Serve waakye
  - Collect payment
  - Move to next customer
\`\`\`

**🎮 Fun Challenge - Guess the Number Game:**
\`\`\`python
import random

# Computer picks random number 1-10
secret = random.randint(1, 10)
attempts = 0

print('Guess my number (1-10)!')

while True:
    guess = int(input('Your guess: '))
    attempts = attempts + 1
    
    if guess == secret:
        print('🎉 Correct! You won!')
        print('Attempts:', attempts)
        break
    elif guess < secret:
        print('📈 Too low, try higher!')
    else:
        print('📉 Too high, try lower!')
\`\`\``
      },
      {
        title: 'Programming Best Practices',
        content: `Writing good code isn't just about making it work—it's about making it readable, maintainable, and efficient.

**Best Practices:**
- 📝 **Comments**: Explain what your code does (use # in Python)
- 🎯 **Meaningful Names**: Use descriptive variable names (total_price, not x)
- 📐 **Indentation**: Proper spacing makes code readable and prevents errors
- 🧪 **Testing**: Always test your code with different inputs
- 🐛 **Debugging**: When errors occur, read error messages carefully—they tell you what's wrong!
- ♻️ **DRY Principle**: Don't Repeat Yourself—use functions and loops instead of copying code
- 💬 **Ask for Help**: Stuck? Search online, ask teachers, or discuss with classmates

**Debugging Tips:**
- Print statements are your friend: Use print() to see what's happening
- Check spelling: 'Print' vs 'print' matters!
- Check indentation: Python is strict about spacing
- Read error messages: They usually tell you the line number and what's wrong
- Test small parts: Don't write everything at once—test as you go`
      }
    ],
    activities: {
      type: 'shortanswer',
      questions: [
        {
          question: 'Write an algorithm (step-by-step instructions) for brushing your teeth in the morning. Be as specific as possible, remembering that computers need very detailed instructions.',
          sampleAnswer: '1. START\n2. Pick up toothbrush\n3. Open toothpaste tube\n4. Squeeze small amount of toothpaste onto toothbrush\n5. Close toothpaste tube\n6. Turn on water tap\n7. Wet toothbrush with water\n8. Turn off water tap\n9. Brush teeth in circular motion for 2 minutes\n10. Turn on water tap\n11. Rinse mouth with water\n12. Rinse toothbrush with water\n13. Turn off water tap\n14. Dry mouth with towel\n15. END'
        },
        {
          question: 'Draw a flowchart (describe the symbols and flow) for a program that checks if a student passed or failed based on their exam score. Pass mark is 50.',
          sampleAnswer: '[START (Oval)] → [INPUT: Get exam score (Parallelogram)] → [DECISION: Is score >= 50? (Diamond)]\n- If YES → [OUTPUT: "You Passed!" (Parallelogram)] → [END (Oval)]\n- If NO → [OUTPUT: "You Failed" (Parallelogram)] → [END (Oval)]'
        },
        {
          question: 'Write a Python program that asks the user for their name and age, then prints a greeting message and tells them how many years until they turn 18 (if under 18) or congratulates them for being an adult (if 18 or over).',
          sampleAnswer: 'name = input("Enter your name: ")\nage = int(input("Enter your age: "))\n\nprint("Hello,", name + "!")\n\nif age >= 18:\n    print("Congratulations! You are an adult.")\nelse:\n    years_left = 18 - age\n    print("You will be an adult in", years_left, "years.")'
        },
        {
          question: 'Explain the difference between a FOR loop and a WHILE loop. Give a real-world {{country:adjective}} example for when you would use each type.',
          sampleAnswer: 'FOR loop: Used when you know exactly how many times to repeat. Example: Serving {{food:rice}} to 50 wedding guests—you know you need to serve exactly 50 plates.\n\nWHILE loop: Used when you repeat until a condition is met. Example: Selling waakye at the market—you keep selling while there are customers, but you don\'t know how many will come.'
        }
      ]
    },
    pastQuestions: [
      {
        year: '2023',
        question: 'Define the term "algorithm" and provide a real-world example from everyday {{country:adjective}} life.',
        answer: 'An algorithm is a step-by-step procedure or set of instructions designed to solve a specific problem or accomplish a task. It must be finite (have an end), definite (each step is clear), and effective (actually solves the problem).\n\nReal-world example: Preparing banku\n1. Mix corn dough with cassava dough\n2. Add water to pot and heat\n3. Add mixed dough to hot water\n4. Stir continuously for 30 minutes until smooth\n5. Shape into balls and serve\n\nThis algorithm is finite (it ends), definite (each step is clear), and effective (produces banku).'
      },
      {
        year: '2022',
        question: 'Draw a flowchart for a program that calculates the total cost of items purchased in a shop, including 15% VAT.',
        answer: '[START] → [INPUT: Get item price] → [PROCESS: Calculate VAT = price × 0.15] → [PROCESS: Calculate total = price + VAT] → [OUTPUT: Display total cost] → [END]\n\nSymbols used:\n- Oval for START/END\n- Parallelogram for INPUT/OUTPUT\n- Rectangle for PROCESS steps\n- Arrows showing flow direction'
      },
      {
        year: '2021',
        question: 'State THREE data types used in programming and give an example of each.',
        answer: '1. Integer: Whole numbers without decimal points. Example: age = 16\n\n2. Float: Numbers with decimal points. Example: price = 25.50\n\n3. String: Text or characters enclosed in quotes. Example: name = "Kwame"\n\n4. Boolean: True or False values. Example: isPassed = True'
      }
    ],
    summary: `**Key Takeaways:**

🖥️ **Programming Defined**: Programming is writing step-by-step instructions (code) in a language computers understand to accomplish tasks and solve problems.

📝 **Algorithms Are Everywhere**: Algorithms are precise, step-by-step procedures used in everyday life and computing. They must be finite, definite, and effective.

📊 **Flowcharts Visualize Logic**: Flowcharts use standard symbols (oval for start/end, rectangle for process, diamond for decision, parallelogram for I/O) to visually represent program logic.

📦 **Variables Store Data**: Variables are named containers that hold information. They can store different types of data.

🔢 **Four Main Data Types**: Integer (whole numbers), Float (decimals), String (text), Boolean (True/False).

📥📤 **Input & Output**: Programs receive data through input() and display results through print() in Python.

🎛️ **Control Structures**: Sequential (one after another), Selection (if-else decisions), Iteration (loops for repetition).

🔁 **Loops Save Time**: FOR loops for known repetitions, WHILE loops for condition-based repetition.

💻 **Python is Beginner-Friendly**: Simple syntax with clear structure makes it perfect for learning programming concepts.

🇬🇭 **Tech Careers in {{country}}**: Programming skills open doors to careers in telecommunications, banking, startups, and tech companies across {{country}}.

🐛 **Debugging is Learning**: Errors are normal—they help you learn. Read error messages, test incrementally, and practice problem-solving.

🧪 **Practice Makes Perfect**: The more you code, the better you become. Start with simple programs and gradually increase complexity.`,

    endOfLessonQuiz: [
      {
        id: '1',
        type: 'mcq',
        question: 'What is programming?',
        options: [
          'Using computer programs like Microsoft Word',
          'Playing video games on a computer',
          'Writing step-by-step instructions in a language computers understand',
          'Repairing broken computers'
        ],
        answer: 'Writing step-by-step instructions in a language computers understand',
        explanation: 'Programming is the process of writing instructions (code) in a special language that computers can understand and execute to accomplish specific tasks.'
      },
      {
        id: '2',
        type: 'mcq',
        question: 'Which of the following is NOT a characteristic of a good algorithm?',
        options: [
          'Finite - must eventually end',
          'Definite - each step is clear and unambiguous',
          'Infinite - keeps running forever',
          'Effective - actually solves the problem'
        ],
        answer: 'Infinite - keeps running forever',
        explanation: 'An algorithm must be finite, meaning it must end after a certain number of steps. An infinite loop is usually a programming error, not a desired feature.'
      },
      {
        id: '3',
        type: 'mcq',
        question: 'In a flowchart, which symbol represents a decision point?',
        options: [
          'Rectangle',
          'Diamond',
          'Oval',
          'Parallelogram'
        ],
        answer: 'Diamond',
        explanation: 'A diamond symbol represents a decision point in a flowchart, where the flow can go in different directions based on a Yes/No or True/False condition.'
      },
      {
        id: '4',
        type: 'mcq',
        question: 'What data type would you use to store a student\'s name?',
        options: [
          'Integer',
          'Float',
          'String',
          'Boolean'
        ],
        answer: 'String',
        explanation: 'A string data type is used to store text and characters, making it perfect for storing names, addresses, or any textual information.'
      },
      {
        id: '5',
        type: 'mcq',
        question: 'What does the Python input() function return?',
        options: [
          'Always returns an integer',
          'Always returns a float',
          'Always returns a string (text)',
          'Returns whatever type the user enters'
        ],
        answer: 'Always returns a string (text)',
        explanation: 'The input() function in Python always returns a string, even if the user types numbers. You must convert it using int() or float() if you need numeric values.'
      },
      {
        id: '6',
        type: 'mcq',
        question: 'Which control structure would you use when you know exactly how many times to repeat an action?',
        options: [
          'IF statement',
          'WHILE loop',
          'FOR loop',
          'SWITCH statement'
        ],
        answer: 'FOR loop',
        explanation: 'A FOR loop is used when you know the exact number of repetitions needed. Use WHILE loops when the number of repetitions depends on a condition.'
      },
      {
        id: '7',
        type: 'mcq',
        question: 'What is the purpose of comments in programming?',
        options: [
          'To make the program run faster',
          'To explain what the code does for humans reading it',
          'To store data in variables',
          'To create errors in the program'
        ],
        answer: 'To explain what the code does for humans reading it',
        explanation: 'Comments (# in Python) are used to explain code to humans. They are ignored by the computer and do not affect how the program runs.'
      },
      {
        id: '8',
        type: 'mcq',
        question: 'Which of these is a valid variable name in Python?',
        options: [
          '1student',
          'student-name',
          'student_name',
          'student name'
        ],
        answer: 'student_name',
        explanation: 'Variable names in Python cannot start with a number, cannot contain spaces or hyphens. They can contain letters, numbers, and underscores, so student_name is valid.'
      },
      {
        id: '9',
        type: 'mcq',
        question: 'What type of loop should you use when you want to keep asking for a PIN until the user enters the correct one?',
        options: [
          'FOR loop',
          'WHILE loop',
          'IF statement',
          'No loop is needed'
        ],
        answer: 'WHILE loop',
        explanation: 'A WHILE loop is perfect for this scenario because you don\'t know how many attempts the user will need - you just keep looping until the condition (correct PIN) is met.'
      },
      {
        id: '10',
        type: 'mcq',
        question: 'In Python, which of these correctly checks if a student passed (score >= 50)?',
        options: [
          'if score = 50:',
          'if score >= 50:',
          'if (score more than 50):',
          'if score => 50:'
        ],
        answer: 'if score >= 50:',
        explanation: 'In Python, we use >= to check "greater than or equal to". The single = is for assignment, not comparison. The colon at the end is required Python syntax.'
      }
    ]
  },

  // Lesson 2: Web Development Basics
  {
    id: 'ict-shs1-web-1',
    slug: 'ict-web-dev-basics',
    title: 'Web Development Basics',
    objectives: [
      'Explain how the World Wide Web works and the client-server model',
      'Understand the structure of HTML and create basic web pages',
      'Use common HTML tags to format text, create lists, and insert images',
      'Apply CSS to style web pages with colors, fonts, and layouts',
      'Differentiate between inline, internal, and external CSS',
      'Understand CSS selectors (element, class, ID, descendant)',
      'Explain the role of JavaScript in making web pages interactive',
      'Create a simple interactive web page combining HTML, CSS, and JavaScript',
      'Follow web development best practices for clean, organized code'
    ],
    introduction: "Welcome to the exciting world of web development! Every website you visit—from Google to Facebook to your school's website—was built using the technologies you're about to learn. Web development is the skill of creating web pages and applications that run in your browser. In this lesson, you'll discover how the internet works and learn the fundamental building blocks of the web: HTML, CSS, and an introduction to JavaScript.",
    keyConcepts: [
      {
        title: 'Understanding the Web',
        content: `Before we start building websites, let's understand what the web actually is and how it works.

**What is the World Wide Web?**
- 🌐 The web is a system of interconnected documents and resources accessed via the internet
- 📡 It uses the internet (the infrastructure) to transfer data between computers
- 🔗 Web pages are linked together using hyperlinks, creating a 'web' of information
- 🌍 Invented by Tim Berners-Lee in 1989, it revolutionized how we share information

**How Does the Web Work?**

1. **Client-Server Model**: Your browser (client) requests web pages from web servers
2. **URLs**: Web addresses like \`https://www.example.com\` tell your browser where to find pages
3. **HTTP/HTTPS**: Protocols that define how data is transferred (HTTPS is secure)
4. **Browsers**: Software like Chrome, Firefox, or Edge that displays web pages
5. **Web Servers**: Powerful computers that store and deliver websites to users

**🇬🇭 Real-World Example**: When you visit \`www.mtn.com.gh\`, your browser sends a request to MTN's web server in {{country}}. The server sends back HTML, CSS, and JavaScript files, which your browser displays as the MTN website.`
      },
      {
        title: 'HTML: The Structure of Web Pages',
        content: `HTML (HyperText Markup Language) is the skeleton of every web page. It defines the structure and content—what appears on the page.

**What is HTML?**
- 📄 HTML is a markup language (not a programming language)
- 🏗️ It uses 'tags' to structure content into headings, paragraphs, images, links, etc.
- 📋 Tags are written in angle brackets: \`<tag>content</tag>\`
- 🌳 HTML creates a tree-like structure called the DOM (Document Object Model)

**Basic HTML Structure:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to Web Development!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>
\`\`\`

**Common HTML Tags:**
- \`<h1>\` to \`<h6>\`: Headings (h1 is largest, h6 is smallest)
- \`<p>\`: Paragraph
- \`<a href="url">\`: Link (anchor tag)
- \`<img src="image.jpg" alt="description">\`: Image
- \`<ul>\` and \`<li>\`: Unordered list (bullet points)
- \`<ol>\` and \`<li>\`: Ordered list (numbered)
- \`<div>\`: Container for grouping elements
- \`<span>\`: Inline container for text
- \`<br>\`: Line break
- \`<strong>\`: Bold text
- \`<em>\`: Italic text

**🎯 Try It Yourself**: Create a simple HTML page about yourself with a heading, paragraph about your hobbies, and a list of your favorite foods.`
      },
      {
        title: 'CSS: Styling Your Web Pages',
        content: `CSS (Cascading Style Sheets) makes web pages beautiful. While HTML provides structure, CSS provides style—colors, fonts, layouts, and animations.

**What is CSS?**
- 🎨 CSS controls the visual appearance of HTML elements
- 💄 You can change colors, fonts, spacing, positioning, and more
- 📱 CSS makes websites responsive (adapt to different screen sizes)
- 🔄 One CSS file can style multiple HTML pages

**How to Add CSS:**

1. **Inline CSS** (inside HTML tags):
\`\`\`html
<p style="color: blue; font-size: 18px;">Blue text</p>
\`\`\`

2. **Internal CSS** (in \`<head>\` section):
\`\`\`html
<head>
    <style>
        p {
            color: blue;
            font-size: 18px;
        }
    </style>
</head>
\`\`\`

3. **External CSS** (separate .css file - BEST PRACTICE):
\`\`\`html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

**CSS Syntax:**
\`\`\`css
selector {
    property: value;
    property: value;
}
\`\`\`

**Common CSS Properties:**
- \`color\`: Text color (\`color: red;\` or \`color: #FF0000;\`)
- \`background-color\`: Background color
- \`font-size\`: Text size (\`font-size: 16px;\`)
- \`font-family\`: Font type (\`font-family: Arial, sans-serif;\`)
- \`font-weight\`: Bold text (\`font-weight: bold;\`)
- \`text-align\`: Alignment (\`text-align: center;\`)
- \`margin\`: Space outside element
- \`padding\`: Space inside element
- \`border\`: Element border (\`border: 1px solid black;\`)
- \`width\` and \`height\`: Element dimensions

**🎨 Example - Styling a Button:**
\`\`\`css
.btn {
    background-color: #4CAF50; /* Green */
    color: white;
    padding: 15px 32px;
    text-align: center;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #45a049; /* Darker green on hover */
}
\`\`\``
      },
      {
        title: 'CSS Selectors and Layout',
        content: `CSS selectors target which HTML elements to style. Understanding selectors and layout is key to creating professional websites.

**Types of CSS Selectors:**

1. **Element Selector** (targets all elements of a type):
\`\`\`css
p { color: blue; } /* All paragraphs */
h1 { font-size: 32px; } /* All h1 headings */
\`\`\`

2. **Class Selector** (targets elements with a specific class):
\`\`\`css
.highlight { background-color: yellow; }
.card { border: 1px solid gray; padding: 20px; }
\`\`\`
\`\`\`html
<p class="highlight">This paragraph is highlighted</p>
\`\`\`

3. **ID Selector** (targets a unique element):
\`\`\`css
#header { background-color: navy; color: white; }
#footer { text-align: center; }
\`\`\`
\`\`\`html
<div id="header">Site Header</div>
\`\`\`

4. **Descendant Selector** (targets nested elements):
\`\`\`css
div p { color: green; } /* Paragraphs inside divs */
.card h2 { font-size: 24px; } /* h2 inside cards */
\`\`\`

**🇬🇭 {{country}}-Themed Website Example:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Discover {{country}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        
        .header {
            background-color: #006B3F; /* {{country}} green */
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
        }
        
        .card {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .flag-colors {
            display: flex;
            height: 50px;
        }
        
        .red { background-color: #CE1126; flex: 1; }
        .{{resource:mineral}} { background-color: #FCD116; flex: 1; }
        .green { background-color: #006B3F; flex: 1; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🇬🇭 Welcome to {{country}}</h1>
        <p>The Gateway to Africa</p>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>About {{country}}</h2>
            <p>{{country}} is a beautiful country in West Africa, known for its rich culture, history, and friendly people.</p>
        </div>
        
        <div class="card">
            <h3>Our Flag</h3>
            <div class="flag-colors">
                <div class="red"></div>
                <div class="{{resource:mineral}}"></div>
                <div class="green"></div>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\``
      },
      {
        title: 'Introduction to JavaScript',
        content: `JavaScript makes websites interactive! While HTML structures and CSS styles, JavaScript adds behavior—responding to clicks, validating forms, creating animations, and much more.

**What is JavaScript?**
- 💻 JavaScript is a programming language that runs in web browsers
- ⚡ It makes web pages interactive and dynamic
- 🎮 Used for games, animations, form validation, and web applications
- 🌟 One of the most popular programming languages in the world

**Adding JavaScript to HTML:**

1. **Inline** (not recommended):
\`\`\`html
<button onclick="alert('Hello!')">Click Me</button>
\`\`\`

2. **Internal** (in \`<script>\` tags):
\`\`\`html
<script>
    console.log('Hello, {{country}}!');
</script>
\`\`\`

3. **External** (separate .js file - BEST PRACTICE):
\`\`\`html
<script src="script.js"></script>
\`\`\`

**Basic JavaScript Concepts:**

**Variables:**
\`\`\`javascript
let studentName = 'Kwame';
let age = 16;
const schoolName = '{{country}} {{level:shs}}'; // const = constant (can't change)
\`\`\`

**Functions:**
\`\`\`javascript
function greetUser(name) {
    return 'Hello, ' + name + '!';
}

console.log(greetUser('Ama')); // Output: Hello, Ama!
\`\`\`

**Events:**
\`\`\`javascript
// Respond to button click
button.addEventListener('click', function() {
    alert('Button was clicked!');
});
\`\`\`

**DOM Manipulation** (changing HTML with JavaScript):
\`\`\`html
<p id="demo">Original text</p>
<button onclick="changeText()">Change Text</button>

<script>
function changeText() {
    document.getElementById('demo').innerHTML = 'Text changed!';
    document.getElementById('demo').style.color = 'red';
}
</script>
\`\`\`

**🎯 Interactive Example - Simple Calculator:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Calculator</title>
    <style>
        .calculator {
            max-width: 300px;
            margin: 50px auto;
            padding: 20px;
            background: #f0f0f0;
            border-radius: 10px;
        }
        input, button {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            font-size: 16px;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        #result {
            background: white;
            padding: 15px;
            margin-top: 10px;
            font-size: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h2>Simple Calculator</h2>
        <input type="number" id="num1" placeholder="Enter first number">
        <input type="number" id="num2" placeholder="Enter second number">
        <button onclick="calculate()">Add Numbers</button>
        <div id="result"></div>
    </div>
    
    <script>
        function calculate() {
            let num1 = document.getElementById('num1').value;
            let num2 = document.getElementById('num2').value;
            
            // Convert strings to numbers
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
            
            let sum = num1 + num2;
            
            document.getElementById('result').innerHTML = 
                'Result: ' + sum;
        }
    </script>
</body>
</html>
\`\`\``
      }
    ],
    activities: {
      type: 'shortanswer',
      questions: [
        {
          question: 'Create a basic HTML page structure with a title "My School Website", a main heading with your school name, and two paragraphs describing your school.',
          sampleAnswer: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My School Website</title>\n</head>\n<body>\n    <h1>{{country}} {{level:shs:full}}</h1>\n    <p>Welcome to {{country}} {{level:shs:full}}, one of the premier educational institutions in the region. We provide quality education to students preparing for their future.</p>\n    <p>Our school offers excellent facilities including modern science labs, a well-stocked library, computer labs, and sports facilities for all students.</p>\n</body>\n</html>'
        },
        {
          question: 'Write CSS code to style all paragraphs with blue text, 16px font size, and 20px of padding. Then create a class called "highlight" that adds a yellow background color.',
          sampleAnswer: 'p {\n    color: blue;\n    font-size: 16px;\n    padding: 20px;\n}\n\n.highlight {\n    background-color: yellow;\n}\n\n/* To use the highlight class: */\n/* <p class="highlight">This paragraph is highlighted</p> */'
        },
        {
          question: 'Write a simple JavaScript function called "greetStudent" that takes a student name as a parameter and displays an alert saying "Welcome, [name]!" when called.',
          sampleAnswer: 'function greetStudent(name) {\n    alert("Welcome, " + name + "!");\n}\n\n// To call the function:\n// greetStudent("Kwame"); // Shows: "Welcome, Kwame!"'
        },
        {
          question: 'Explain the difference between inline CSS, internal CSS, and external CSS. Which method is considered best practice and why?',
          sampleAnswer: 'Inline CSS: Styles are written directly in HTML tags using the style attribute. Example: <p style="color: red;">Text</p>\n\nInternal CSS: Styles are written in a <style> tag in the <head> section of the HTML file.\n\nExternal CSS: Styles are written in a separate .css file and linked to HTML using <link rel="stylesheet" href="styles.css">.\n\nBest Practice: External CSS is best because:\n1. One CSS file can style multiple HTML pages\n2. Easier to maintain and update\n3. Keeps HTML clean and organized\n4. Allows for better code reusability\n5. Faster loading when CSS is cached by browser'
        }
      ]
    },
    pastQuestions: [
      {
        year: '2023',
        question: 'Explain the client-server model as it relates to how web pages are displayed in a browser.',
        answer: 'The client-server model describes how web content is delivered:\n\n1. CLIENT: The user\'s web browser (like Chrome or Firefox) acts as the client that requests web pages.\n\n2. REQUEST: When you type a URL or click a link, the browser sends an HTTP/HTTPS request to the web server asking for specific content.\n\n3. SERVER: The web server is a powerful computer that stores website files (HTML, CSS, JavaScript, images). It receives the request and processes it.\n\n4. RESPONSE: The server sends back the requested files to the client browser.\n\n5. RENDERING: The browser receives the files and displays (renders) the web page for the user to see and interact with.\n\nThis process happens very quickly, often in less than a second for most websites.'
      },
      {
        year: '2022',
        question: 'Write HTML code to create an unordered list of three {{country:adjective}} foods with a heading "Popular {{country:adjective}} Dishes".',
        answer: '<!DOCTYPE html>\n<html>\n<head>\n    <title>{{country:adjective}} Foods</title>\n</head>\n<body>\n    <h2>Popular {{country:adjective}} Dishes</h2>\n    <ul>\n        <li>{{food:rice}}</li>\n        <li>{{food:staple}} and Okro</li>\n        <li>{{food:popular}}</li>\n    </ul>\n</body>\n</html>'
      },
      {
        year: '2021',
        question: 'State FOUR common CSS properties and explain what each one does.',
        answer: '1. color: Changes the text color of an element. Example: color: blue; makes text blue.\n\n2. font-size: Sets the size of the text. Example: font-size: 18px; makes text 18 pixels tall.\n\n3. background-color: Changes the background color of an element. Example: background-color: yellow; makes the background yellow.\n\n4. padding: Creates space inside an element between the content and the border. Example: padding: 20px; adds 20 pixels of space on all sides.\n\n5. margin: Creates space outside an element, separating it from other elements. Example: margin: 10px; adds 10 pixels of space around the element.\n\n6. text-align: Controls horizontal text alignment. Example: text-align: center; centers the text.'
      }
    ],
    summary: `**Key Takeaways:**

🌐 **The Web Explained**: The World Wide Web is a system of interconnected documents accessed via the internet using the client-server model.

📄 **HTML is Structure**: HTML (HyperText Markup Language) provides the skeleton and content of web pages using tags like <h1>, <p>, <div>, <img>, etc.

🎨 **CSS is Style**: CSS (Cascading Style Sheets) controls the visual appearance—colors, fonts, layouts, spacing—making websites beautiful.

💄 **Three Ways to Add CSS**: Inline (in tags), Internal (in <head>), External (separate file—best practice).

🎯 **CSS Selectors**: Element selectors (p), Class selectors (.classname), ID selectors (#idname), Descendant selectors (div p).

⚡ **JavaScript is Behavior**: JavaScript makes web pages interactive by responding to user actions, manipulating the DOM, and adding dynamic features.

📦 **DOM Manipulation**: JavaScript can change HTML content and CSS styles dynamically using document.getElementById() and similar methods.

🔗 **Best Practice**: Use external CSS and JavaScript files to keep code organized, maintainable, and reusable across multiple pages.

📱 **Responsive Design**: Modern websites adapt to different screen sizes (phones, tablets, desktops) using responsive CSS techniques.

🛠️ **Development Tools**: Use code editors (VS Code), browser DevTools (F12), and online resources to build and debug websites.

🇬🇭 **Local Applications**: Web development skills enable you to create websites for {{country:adjective}} businesses, schools, organizations, and personal portfolios.

🚀 **Career Path**: Web development is a highly sought-after skill in {{country}}\'s growing tech industry, offering freelance and full-time opportunities.`,

    endOfLessonQuiz: [
      {
        id: '1',
        type: 'mcq',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        answer: 'Hyper Text Markup Language',
        explanation: 'HTML stands for HyperText Markup Language. It is the standard markup language used to create web pages, defining structure and content.'
      },
      {
        id: '2',
        type: 'mcq',
        question: 'In the client-server model for web browsing, what role does your web browser play?',
        options: [
          'Server - it stores all website files',
          'Client - it requests and displays web pages',
          'Database - it stores user information',
          'Router - it directs internet traffic'
        ],
        answer: 'Client - it requests and displays web pages',
        explanation: 'Your web browser acts as the client, sending requests to web servers and displaying the web pages it receives in response.'
      },
      {
        id: '3',
        type: 'mcq',
        question: 'Which HTML tag is used to create a hyperlink?',
        options: [
          '<link>',
          '<a>',
          '<href>',
          '<url>'
        ],
        answer: '<a>',
        explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML. The href attribute specifies the destination URL: <a href="url">Link Text</a>'
      },
      {
        id: '4',
        type: 'mcq',
        question: 'What is the BEST practice for adding CSS to your web pages?',
        options: [
          'Use inline styles in every HTML tag',
          'Write all CSS in the HTML <head> section',
          'Use an external CSS file linked to your HTML',
          'CSS is not important for web development'
        ],
        answer: 'Use an external CSS file linked to your HTML',
        explanation: 'Using an external CSS file is best practice because it keeps code organized, allows one CSS file to style multiple pages, improves maintainability, and enables browser caching for faster loading.'
      },
      {
        id: '5',
        type: 'mcq',
        question: 'Which CSS selector is used to target elements with a specific class?',
        options: [
          '#classname',
          '.classname',
          '*classname',
          'classname'
        ],
        answer: '.classname',
        explanation: 'The dot (.) followed by the class name targets elements with that class. For example, .highlight targets all elements with class="highlight".'
      },
      {
        id: '6',
        type: 'mcq',
        question: 'What will this CSS code do: p { color: red; font-size: 20px; }',
        options: [
          'Make all paragraphs red with 20-pixel font size',
          'Make only one paragraph red',
          'Create a new paragraph element',
          'Delete all paragraphs'
        ],
        answer: 'Make all paragraphs red with 20-pixel font size',
        explanation: 'This CSS code targets all <p> elements (paragraphs) and styles them with red text color and a font size of 20 pixels.'
      },
      {
        id: '7',
        type: 'mcq',
        question: 'What is the primary purpose of JavaScript in web development?',
        options: [
          'To structure web page content',
          'To style web pages with colors and fonts',
          'To make web pages interactive and dynamic',
          'To store web pages on servers'
        ],
        answer: 'To make web pages interactive and dynamic',
        explanation: 'JavaScript adds interactivity and dynamic behavior to web pages, allowing them to respond to user actions, validate forms, create animations, and update content without reloading.'
      },
      {
        id: '8',
        type: 'mcq',
        question: 'Which HTML tag is used to define the largest heading?',
        options: [
          '<head>',
          '<h6>',
          '<h1>',
          '<header>'
        ],
        answer: '<h1>',
        explanation: '<h1> defines the largest heading in HTML. Headings range from <h1> (largest) to <h6> (smallest).'
      },
      {
        id: '9',
        type: 'mcq',
        question: 'In CSS, what property is used to change the background color of an element?',
        options: [
          'color',
          'bg-color',
          'background-color',
          'bgcolor'
        ],
        answer: 'background-color',
        explanation: 'The background-color property sets the background color of an element. For example: background-color: yellow;'
      },
      {
        id: '10',
        type: 'mcq',
        question: 'What does DOM stand for in web development?',
        options: [
          'Data Object Model',
          'Document Object Model',
          'Digital Online Method',
          'Dynamic Output Management'
        ],
        answer: 'Document Object Model',
        explanation: 'DOM stands for Document Object Model. It is a tree-like structure representing the HTML document, which JavaScript can manipulate to dynamically change content and styling.'
      }
    ]
  }
];
