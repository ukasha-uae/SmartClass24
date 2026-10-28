/**
 * S24 Innovation Academy Technology Programs - Initial Curriculum Data
 * Comprehensive tech-focused courses with hands-on projects
 */

import { UniversityProgram, UniversityCourse, Project, CodeFile } from '@/types/university';

// ============================================================================
// Web Development Fundamentals Program
// ============================================================================

export const webDevelopmentProgram: UniversityProgram = {
  id: 'web-dev-fundamentals',
  slug: 'web-development-fundamentals',
  title: 'Web Development Fundamentals',
  discipline: 'technology',
  description: 'Learn web development through bite-sized, interactive lessons. Build real projects from day one using HTML, CSS, and JavaScript.',
  duration: '8 weeks',
  difficulty: 'beginner',
  prerequisites: ['Access to a computer or smartphone', 'Internet connection', 'Curiosity and willingness to learn'],
  learningOutcomes: [
    'Build and deploy your first website in Week 1',
    'Create responsive layouts that work on all devices',
    'Add interactivity with JavaScript',
    'Use AI tools to boost your productivity',
    'Launch real projects to showcase your skills'
  ],
  courses: [
    {
      id: 'html-css-basics',
      slug: 'html-css-basics',
      title: 'HTML & CSS Essentials',
      description: 'Start coding today! Learn by doing with interactive exercises and instant feedback.',
      instructor: {
        name: 'AI Learning Assistant',
        title: 'Your Personal Coding Mentor',
        bio: 'I adapt to your pace and provide instant feedback on every lesson'
      },
      duration: '3 weeks',
      modules: [
        {
          id: 'module-1-html-intro',
          slug: 'html-introduction',
          title: 'Your First Webpage',
          description: 'Create your first webpage in the next 5 minutes',
          estimatedTime: '15 minutes',
          order: 1,
          lessons: [
            {
              id: 'lesson-1-1',
              slug: 'what-is-html',
              title: 'Hello, Web! 👋',
              type: 'theory',
              order: 1,
              estimatedTime: '3 minutes',
              content: {
                introduction: '🎉 Welcome to web development! In just 3 minutes, you\'ll understand what HTML is and write your first line of code.',
                sections: [
                  {
                    id: 'section-1',
                    title: '💡 What is HTML?',
                    content: `HTML (HyperText Markup Language) is like the skeleton of a website. Just like your body has bones that give it structure, HTML gives structure to web pages.

**Think of it this way:**
- 🏗️ HTML = The building blocks
- 🎨 CSS = The paint and decoration (coming soon!)
- ⚡ JavaScript = The electricity that makes things move

**Key Point:** You don't need to be a "techie" to learn HTML. If you can use a smartphone, you can learn HTML!`,
                    order: 1,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<h1>Hello, World!</h1>
<p>I just wrote my first HTML!</p>`,
                        explanation: '👆 This is HTML! The <h1> tag creates a big heading, and <p> creates a paragraph. Try it!',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  },
                  {
                    id: 'section-2',
                    title: '🔖 Tags: The Building Blocks',
                    content: `HTML uses **tags** - think of them as labels that tell the browser "this is a heading" or "this is a paragraph".

**The Pattern:**
\`\`\`
<tagname>Your content here</tagname>
\`\`\`

- Opening tag: \`<tagname>\`
- Content: What you want to show
- Closing tag: \`</tagname>\` (notice the /)

**Real Example:**
\`\`\`html
<h1>My Amazing Website</h1>
\`\`\`

This tells the browser: "Hey! This text is super important - make it BIG!"`,
                    order: 2,
                    codeExamples: [
                      {
                        id: 'example-2',
                        language: 'html',
                        code: `<h1>I'm a Big Heading</h1>
<h2>I'm a smaller heading</h2>
<p>I'm a regular paragraph</p>`,
                        explanation: 'See the difference? h1 is biggest, h2 is smaller, p is normal text. Each tag has a purpose!',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎯 You just learned the foundation of web development! HTML uses tags to structure content, just like labels organize items in a store.',
                keyTakeaways: [
                  '🏗️ HTML is the structure of websites',
                  '🔖 Tags are like labels: <tag>content</tag>',
                  '✅ Opening and closing tags work together',
                  '🚀 You can start building websites RIGHT NOW'
                ]
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Let\'s see what you learned (30 seconds)',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-1',
                    type: 'multiple-choice',
                    question: '🤔 Which one creates a heading in HTML?',
                    options: [
                      '<h1>My Heading</h1>',
                      '<heading>My Heading</heading>',
                      '<title>My Heading</title>',
                      'My Heading (h1)'
                    ],
                    correctAnswer: '<h1>My Heading</h1>',
                    points: 10,
                    explanation: '🎉 Correct! <h1> is the tag for the biggest heading. h1-h6 are the heading tags, with h1 being the largest!'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💪 Practice Challenge',
                  description: 'Write your first HTML',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-1',
                    type: 'fill-in-blank',
                    instruction: 'Complete the code to create a heading that says "I Love Coding"',
                    code: '<_1_>I Love Coding</_2_>',
                    blanks: {
                      1: { answer: 'h1', alternatives: ['h2', 'h3'], hint: 'Use a heading tag!' },
                      2: { answer: 'h1', alternatives: ['h2', 'h3'], hint: 'Don\'t forget the closing tag!' }
                    },
                    points: 15,
                    explanation: '🌟 Awesome! You just wrote your first HTML code!'
                  }
                }
              ],
              resources: [
                {
                  id: 'resource-1',
                  title: '📚 HTML Cheat Sheet',
                  type: 'cheatsheet',
                  description: 'Quick reference for your first 10 HTML tags'
                },
                {
                  id: 'resource-2',
                  title: '🎮 Practice Playground',
                  type: 'practice',
                  description: 'Interactive sandbox to experiment with HTML'
                },
                {
                  id: 'resource-3',
                  title: '💡 Pro Tips',
                  type: 'tips',
                  description: 'How professional developers write clean HTML'
                }
              ]
            },
            {
              id: 'lesson-1-2',
              slug: 'your-first-webpage',
              title: 'Build Your First Page 🎨',
              type: 'practical',
              order: 2,
              estimatedTime: '5 minutes',
              content: {
                introduction: '🚀 Let\'s build something REAL! In 5 minutes, you\'ll have your first working webpage.',
                sections: [
                  {
                    id: 'section-1',
                    title: '🏗️ The Basic Structure',
                    content: `Every webpage has the same basic structure. Think of it like a house:

🏠 **The House (HTML Document):**
- 📋 DOCTYPE: The blueprint
- 🏛️ <html>: The entire house
- 🧠 <head>: The attic (hidden info)
- 🏡 <body>: The rooms (what you see)

**Here's the template:**`,
                    order: 1,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<!DOCTYPE html>
<html>
<head>
  <title>My Cool Page</title>
</head>
<body>
  <h1>Welcome! 👋</h1>
  <p>This is my first webpage!</p>
</body>
</html>`,
                        explanation: '👆 Copy this! It\'s your starter template for EVERY webpage you\'ll ever make.',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  },
                  {
                    id: 'section-2',
                    title: '✨ Add Some Content',
                    content: `Now let's make it YOUR page! Add:
- 📝 A heading with your name
- 📖 A paragraph about yourself
- 🎯 Your goals for learning web development`,
                    order: 2,
                    codeExamples: [
                      {
                        id: 'example-2',
                        language: 'html',
                        code: `<body>
  <h1>Hi, I'm Sarah! 🌟</h1>
  <p>I'm learning web development at S24 Innovation Academy.</p>
  <p>My goal: Build my own startup website in 30 days!</p>
</body>`,
                        explanation: '✏️ Change the name and goals to match YOUR story!',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎉 Congratulations! You just built a real webpage. It might be simple, but EVERY website starts exactly like this.',
                keyTakeaways: [
                  '📋 Every page needs <!DOCTYPE html>',
                  '🏠 <html> wraps everything',
                  '🧠 <head> has the title (shows in browser tab)',
                  '🏡 <body> has what visitors see'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <!-- 👇 Replace this with YOUR info -->
  <h1>Your Name Here</h1>
  <p>Tell us about yourself...</p>
  
  <!-- 🎯 Your challenge:
  1. Add your real name
  2. Write 2 paragraphs about yourself
  3. Add a heading that says "My Goals"
  4. List 3 goals using <p> tags
  -->
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 Make this page about YOU! Add your name, write about yourself, and list your goals.',
                  hints: [
                    '💡 Stuck? Just type <p> then your text, then </p>',
                    '🔥 Pro tip: Click "Run" to see your page live!',
                    '⚡ Each goal should be in its own <p> tag'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Used <h1> for your name',
                      validate: '<h1>(?!Your Name Here)',
                      points: 25
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added at least 2 paragraphs',
                      validate: '(<p>.*?</p>.*?){2,}',
                      points: 25
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Created a goals section',
                      validate: '<h[2-3]>.*?[Gg]oals?.*?</h[2-3]>',
                      points: 25
                    },
                    {
                      type: 'word-count',
                      description: '✅ Wrote at least 30 words total',
                      minWords: 30,
                      points: 25
                    }
                  ],
                  successMessage: '🎉 Amazing! You just built your first personalized webpage!',
                  celebrationEmoji: '🚀'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Quiz',
                  description: 'Test what you just learned!',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-2',
                    type: 'multiple-choice',
                    question: '🤔 What does <body> contain?',
                    options: [
                      'Everything visible on the webpage',
                      'The page title',
                      'Hidden metadata',
                      'CSS styles'
                    ],
                    correctAnswer: 'Everything visible on the webpage',
                    points: 10,
                    explanation: '✨ Perfect! The <body> tag contains everything visitors see on your page.'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '🏆 Code Challenge',
                  description: 'Write the complete structure',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-2',
                    type: 'code-completion',
                    instruction: 'Create a complete HTML page with a heading and paragraph',
                    template: `<!DOCTYPE html>
<html>
<head>
  <title>_____</title>
</head>
<body>
  _____
  _____
</body>
</html>`,
                    expectedElements: ['h1', 'p'],
                    points: 20,
                    explanation: '🌟 You\'re getting the hang of this! Every webpage follows this structure.'
                  }
                }
              ],
              resources: []
            }
          ],
          projects: []
        },
        {
          id: 'module-2-css-basics',
          slug: 'css-basics',
          title: 'Making It Pretty: CSS Basics',
          description: 'Give your webpage color, style, and layout',
          estimatedTime: '20 minutes',
          order: 2,
          lessons: [
            {
              id: 'lesson-2-1',
              slug: 'css-selectors-and-styling',
              title: 'CSS 101: Selectors & Styling 🎨',
              type: 'theory',
              order: 1,
              estimatedTime: '6 minutes',
              content: {
                introduction: '🎨 Time to add some style! In this lesson you\'ll learn how CSS talks to HTML and how to change colors, fonts, and spacing.',
                sections: [
                  {
                    id: 'section-1',
                    title: '🧩 How CSS Works',
                    order: 1,
                    content: `CSS (Cascading Style Sheets) tells the browser HOW your HTML should look.

**The Pattern:**
\`\`\`
selector {
  property: value;
}
\`\`\`

- **Selector**: which element to style (e.g. \`h1\`, \`p\`, \`.card\`)
- **Property**: what you're changing (e.g. \`color\`, \`font-size\`)
- **Value**: the setting (e.g. \`red\`, \`20px\`)

**Key Point:** CSS lives in a \`<style>\` tag, a separate \`.css\` file, or inline — but a separate file is the professional way.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'css',
                        code: `h1 {
  color: blue;
  font-size: 32px;
}

p {
  color: gray;
  font-family: Arial, sans-serif;
}`,
                        explanation: '👆 This turns every <h1> blue and every <p> gray with a clean font. One rule, every matching tag!',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  },
                  {
                    id: 'section-2',
                    title: '🔗 Linking Your CSS File',
                    order: 2,
                    content: `Keep HTML and CSS separate by linking a \`styles.css\` file inside \`<head>\`:

\`\`\`html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

Now anything you write in \`styles.css\` automatically styles \`index.html\`. This is exactly how the code editor's Preview works — try switching between the \`index.html\` and \`styles.css\` tabs above!`,
                    codeExamples: [
                      {
                        id: 'example-2',
                        language: 'css',
                        code: `.highlight {
  background-color: yellow;
  padding: 8px;
}`,
                        explanation: 'Class selectors (the dot `.`) let you style specific elements without affecting every tag of that type.',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎯 CSS rules follow selector → property → value. Link a separate .css file to keep your code clean, and use classes to style specific elements.',
                keyTakeaways: [
                  '🧩 CSS rule = selector { property: value; }',
                  '🔗 Link CSS with <link rel="stylesheet" href="styles.css">',
                  '🎯 Classes (.name) style specific elements, tags style everything of that type',
                  '🎨 Common properties: color, background-color, font-size, font-family'
                ]
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your CSS selector knowledge',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-css-1',
                    type: 'multiple-choice',
                    question: '🤔 Which CSS rule makes ALL paragraphs blue?',
                    options: [
                      'p { color: blue; }',
                      'blue { color: p; }',
                      '<p color="blue">',
                      '.blue { p: color; }'
                    ],
                    correctAnswer: 'p { color: blue; }',
                    points: 10,
                    explanation: '✨ Right! `p { color: blue; }` targets every <p> tag on the page.'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💪 Practice Challenge',
                  description: 'Complete the CSS rule',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-css-1',
                    type: 'fill-in-blank',
                    instruction: 'Complete the CSS rule to make headings green',
                    code: 'h1 {\n  _1_: _2_;\n}',
                    blanks: {
                      '1': { answer: 'color', hint: 'Which property changes text color?' },
                      '2': { answer: 'green', alternatives: ['darkgreen', 'forestgreen'], hint: 'Any shade of green works!' }
                    },
                    points: 15,
                    explanation: '🌟 `color: green;` changes the text color. Great job!'
                  }
                }
              ],
              resources: [
                {
                  id: 'resource-1',
                  title: '📚 CSS Selectors Cheat Sheet',
                  type: 'cheatsheet',
                  description: 'Quick reference for common CSS selectors'
                },
                {
                  id: 'resource-2',
                  title: '🎮 CSS Playground',
                  type: 'practice',
                  description: 'Experiment with colors and fonts live'
                }
              ]
            },
            {
              id: 'lesson-2-2',
              slug: 'box-model-and-layout',
              title: 'The Box Model & Flexbox Layout 📦',
              type: 'practical',
              order: 2,
              estimatedTime: '9 minutes',
              content: {
                introduction: '📦 Every HTML element is secretly a box! Once you understand the box model, spacing and layout finally make sense.',
                sections: [
                  {
                    id: 'section-1',
                    title: '📦 The Box Model',
                    order: 1,
                    content: `Every element has 4 layers, from inside out:

1. **Content** – the text/image itself
2. **Padding** – space INSIDE the border
3. **Border** – the edge/outline
4. **Margin** – space OUTSIDE the border, between elements

**Think of it like a picture frame:** the photo is content, the mat around it is padding, the frame itself is the border, and the gap to the next frame on the wall is margin.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'css',
                        code: `.card {
  padding: 16px;
  border: 2px solid #ccc;
  margin: 12px;
}`,
                        explanation: '👆 This gives a box 16px of breathing room inside, a visible border, and 12px of space around it.',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  },
                  {
                    id: 'section-2',
                    title: '↔️ Flexbox: Arranging Boxes',
                    order: 2,
                    content: `Want boxes side-by-side instead of stacked? Add \`display: flex\` to their PARENT:

\`\`\`css
.container {
  display: flex;
  gap: 16px;
}
\`\`\`

That's it — every direct child of \`.container\` now lines up in a row automatically, with a 16px gap between each one.`,
                    codeExamples: [
                      {
                        id: 'example-2',
                        language: 'css',
                        code: `.row {
  display: flex;
  gap: 20px;
}`,
                        explanation: 'flex turns a stack into a row. Try removing it in the editor below and watch the boxes stack again!',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎉 You now understand the box model (content → padding → border → margin) and how `display: flex` arranges elements in a row.',
                keyTakeaways: [
                  '📦 Box model order: content → padding → border → margin',
                  '🖼️ padding = inside space, margin = outside space',
                  '↔️ display: flex on a parent arranges children in a row',
                  '📏 gap adds space between flex items'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>Box Model Practice</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="row">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
  </div>
</body>
</html>`
                    },
                    {
                      path: 'styles.css',
                      language: 'css',
                      content: `/* 🎯 Your challenge:
1. Give .box some padding, a border, and a margin
2. Make .row a flex container so the boxes sit in a row
3. Add a gap between the boxes
*/

.box {

}

.row {

}
`
                    }
                  ],
                  instructions: '🎯 Style the boxes! Add padding + border + margin to .box, then make .row a flex container with a gap.',
                  hints: [
                    '💡 padding goes inside .box, margin goes outside',
                    '🔥 display: flex goes on .row, not .box',
                    '⚡ Add gap: 16px to .row for spacing between boxes'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Added padding to .box',
                      validate: '\\.box\\s*\\{[^}]*padding\\s*:',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added a border to .box',
                      validate: '\\.box\\s*\\{[^}]*border\\s*:',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added margin to .box',
                      validate: '\\.box\\s*\\{[^}]*margin\\s*:',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Made .row a flex container',
                      validate: '\\.row\\s*\\{[^}]*display\\s*:\\s*flex',
                      points: 40
                    }
                  ],
                  successMessage: '🎉 Your boxes are perfectly laid out!',
                  celebrationEmoji: '📦'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your box model knowledge',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-css-2',
                    type: 'multiple-choice',
                    question: '🤔 What\'s the correct box model order from inside to outside?',
                    options: [
                      'Content → Padding → Border → Margin',
                      'Content → Border → Padding → Margin',
                      'Margin → Border → Padding → Content',
                      'Padding → Content → Border → Margin'
                    ],
                    correctAnswer: 'Content → Padding → Border → Margin',
                    points: 10,
                    explanation: '✨ Correct! Content is innermost, margin is outermost.'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '🏆 Code Challenge',
                  description: 'Turn a container into a flex row',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-css-2',
                    type: 'code-completion',
                    instruction: 'Complete the rule so .container becomes a flex row',
                    template: '.container {\n  _____\n}',
                    expectedElements: ['display', 'flex'],
                    points: 15,
                    explanation: '🌟 display: flex is the key property for flexbox layouts!'
                  }
                }
              ],
              resources: []
            }
          ],
          projects: []
        },
        {
          id: 'module-3-semantic-navigation',
          slug: 'semantic-html-navigation',
          title: 'Real Websites: Structure & Navigation',
          description: 'Learn the tags that make multi-page websites possible',
          estimatedTime: '14 minutes',
          order: 3,
          lessons: [
            {
              id: 'lesson-3-1',
              slug: 'semantic-html-sections',
              title: 'Semantic HTML: Naming Your Sections 🏷️',
              type: 'theory',
              order: 1,
              estimatedTime: '4 minutes',
              content: {
                introduction: '🏷️ Real websites don\'t stuff everything into generic boxes. Browsers (and screen readers!) understand your page way better when each part has a name.',
                sections: [
                  {
                    id: 'section-1',
                    title: '🏷️ Semantic Tags: Naming Your Sections',
                    order: 1,
                    content: `Instead of wrapping everything in generic \`<div>\`s, use tags that describe their PURPOSE:

- \`<header>\` – top of the page (logo, title)
- \`<nav>\` – navigation links
- \`<main>\` – the main content of the page
- \`<section>\` / \`<article>\` – a chunk of related content
- \`<footer>\` – bottom of the page (copyright, links)

**Why bother?** Semantic tags help search engines and screen readers understand your page — and they make your code way easier to read.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<header>
  <h1>My Site</h1>
</header>
<nav>
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
</nav>
<main>
  <p>Welcome to my website!</p>
</main>
<footer>
  <p>&copy; 2026 My Site</p>
</footer>`,
                        explanation: '👆 Notice each section has a name that describes what\'s inside — that\'s semantic HTML!',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: '🎯 Semantic tags like header, nav, main, and footer describe what each part of a page IS — not just how it looks.',
                keyTakeaways: [
                  '🏷️ header/nav/main/footer describe what each part of the page IS',
                  '🔍 Semantic tags help search engines and screen readers understand your page',
                  '📖 They also make your own code way easier to read later'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <!-- 🎯 Your challenge:
  1. Wrap the title in a <header>
  2. Wrap the intro paragraph in <main>
  3. Add a <footer> with a copyright line
  -->
  <h1>My Site</h1>
  <p>Welcome! This is my homepage.</p>
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 Turn this plain page into semantic HTML using header, main, and footer.',
                  hints: [
                    '💡 <header> wraps the top of the page, like your <h1>',
                    '🔥 <main> wraps the main content, like your <p>',
                    '⚡ Don\'t forget the closing </header>, </main>, </footer> tags'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 80,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Used <header>',
                      validate: '<header>',
                      points: 30
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Wrapped content in <main>',
                      validate: '<main>',
                      points: 35
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added a <footer>',
                      validate: '<footer>',
                      points: 35
                    }
                  ],
                  successMessage: '🎉 That page now describes its own structure!',
                  celebrationEmoji: '🏷️'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your semantic tag knowledge',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-semantic-1',
                    type: 'multiple-choice',
                    question: '🤔 Which tag should wrap the MAIN content of a page?',
                    options: ['<main>', '<div>', '<header>', '<footer>'],
                    correctAnswer: '<main>',
                    points: 10,
                    explanation: '✨ <main> tells browsers "this is the primary content of the page".'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💪 Practice Challenge',
                  description: 'Complete the footer tag',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-semantic-1',
                    type: 'fill-in-blank',
                    instruction: 'Complete the tags to mark the bottom of the page as a footer',
                    code: '<_1_>\n  <p>&copy; 2026 My Site</p>\n</_1_>',
                    blanks: {
                      '1': { answer: 'footer', hint: 'The tag for the bottom of a page' }
                    },
                    points: 15,
                    explanation: '🌟 <footer> marks the bottom section, like copyright info and links.'
                  }
                }
              ],
              resources: [
                {
                  id: 'resource-1',
                  title: '📚 Semantic HTML Cheat Sheet',
                  type: 'cheatsheet',
                  description: 'header, nav, main, section, article, footer at a glance'
                }
              ]
            },
            {
              id: 'lesson-3-2',
              slug: 'linking-between-pages',
              title: 'Linking Between Pages 🔗',
              type: 'practical',
              order: 2,
              estimatedTime: '5 minutes',
              content: {
                introduction: '🔗 A website isn\'t a website with just one page. Let\'s connect pages together so visitors can click their way around your site.',
                sections: [
                  {
                    id: 'section-1',
                    title: '🔗 Linking Between Pages',
                    order: 1,
                    content: `The \`<a>\` (anchor) tag is how you link to other pages — or other websites:

\`\`\`html
<a href="about.html">About Me</a>
\`\`\`

- \`href\` = where the link goes
- The text between the tags = what visitors click

**This is exactly what your final project needs**: an \`index.html\` and \`about.html\` that link to EACH OTHER using \`<a>\` tags in a shared \`<nav>\`.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<!-- On index.html -->
<a href="about.html">About</a>

<!-- On about.html -->
<a href="index.html">Home</a>`,
                        explanation: 'Each page links to the other — that\'s how visitors move around your site.',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎉 Wrapping your links in a <nav> gives every page the same navigation, so visitors can move freely between pages.',
                keyTakeaways: [
                  '🔗 <a href="page.html">Text</a> links to another page',
                  '🧭 <nav> is the semantic tag that should hold your links',
                  '↔️ Pages should link to EACH OTHER so visitors can navigate both ways'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <header>
    <h1>My Site</h1>
  </header>
  <!-- 🎯 Add a <nav> here with a link to about.html -->
  <main>
    <p>Welcome! This is my homepage.</p>
  </main>
</body>
</html>`
                    },
                    {
                      path: 'about.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <header>
    <h1>About Me</h1>
  </header>
  <!-- 🎯 Add a <nav> here too, linking back to index.html -->
  <main>
    <p>Tell visitors about yourself here.</p>
  </main>
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 Add a <nav> with a link to about.html, and link back to index.html from about.html.',
                  hints: [
                    '💡 <nav> can hold one or more <a> tags',
                    '🔥 href="about.html" points to the about page from index.html',
                    '⚡ Don\'t forget the closing </nav> tag'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 80,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Added <nav> with a link to about.html',
                      validate: '<nav>[\\s\\S]*?href=["\']about\\.html["\'][\\s\\S]*?</nav>',
                      points: 50
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Linked back to index.html from about.html',
                      validate: 'href=["\']index\\.html["\']',
                      points: 50
                    }
                  ],
                  successMessage: '🎉 Your pages are now connected!',
                  celebrationEmoji: '🔗'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your navigation knowledge',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-nav-1',
                    type: 'multiple-choice',
                    question: '🤔 Which tag should you use for your site\'s navigation links?',
                    options: ['<nav>', '<div>', '<link>', '<header>'],
                    correctAnswer: '<nav>',
                    points: 10,
                    explanation: '✨ <nav> tells browsers (and screen readers) "these are navigation links".'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💪 Practice Challenge',
                  description: 'Complete the link to about.html',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-nav-1',
                    type: 'fill-in-blank',
                    instruction: 'Complete the link to about.html',
                    code: '<_1_ _2_="about.html">About</_1_>',
                    blanks: {
                      '1': { answer: 'a', hint: 'The anchor tag' },
                      '2': { answer: 'href', hint: 'The attribute that sets the destination' }
                    },
                    points: 15,
                    explanation: '🌟 <a href="about.html">About</a> — that\'s a working link!'
                  }
                }
              ],
              resources: []
            },
            {
              id: 'lesson-3-3',
              slug: 'images-and-lists',
              title: 'Images & Lists 🖼️',
              type: 'practical',
              order: 3,
              estimatedTime: '5 minutes',
              content: {
                introduction: '🖼️ Two more must-know tags and your Personal Website project is fully within reach: images and lists.',
                sections: [
                  {
                    id: 'section-1',
                    title: '🖼️ Images & Lists',
                    order: 1,
                    content: `Two more must-know tags:

\`\`\`html
<img src="photo.jpg" alt="A photo of me">
\`\`\`
- \`src\` = the image file
- \`alt\` = description (shown if the image fails, and read aloud by screen readers)

\`\`\`html
<ul>
  <li>Reading</li>
  <li>Coding</li>
  <li>Football</li>
</ul>
\`\`\`
\`<ul>\` = unordered (bullet) list, \`<li>\` = each list item. Use \`<ol>\` instead of \`<ul>\` for numbered lists.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<img src="me.jpg" alt="Portrait of me smiling">
<ul>
  <li>Coding</li>
  <li>Music</li>
</ul>`,
                        explanation: 'Always fill in `alt` — never leave it empty on a meaningful image!',
                        editable: true,
                        showLineNumbers: false
                      }
                    ]
                  }
                ],
                summary: '🎉 You can now build a REAL multi-page site: semantic tags for structure, <a href> to link pages, <img> for photos, and <ul>/<li> for lists. This is everything your final project needs!',
                keyTakeaways: [
                  '🖼️ <img src="..." alt="..."> always needs a real alt description',
                  '📋 <ul><li> makes a bullet list, <ol><li> makes a numbered list',
                  '♿ alt text is read aloud by screen readers, so make it descriptive'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <header>
    <h1>My Site</h1>
  </header>
  <main>
    <p>Welcome! This is my homepage.</p>
    <!-- 🎯 Your challenge:
    1. Add a photo of yourself with <img> (any src) and a real alt
    2. Add a <ul> with 3 things you like
    -->
  </main>
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 Add an image with a real alt description and a bullet list of 3 things you like.',
                  hints: [
                    '💡 alt text should describe the image, not just say "photo"',
                    '🔥 Each list item goes inside its own <li>',
                    '⚡ Don\'t forget the closing </ul> tag'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 80,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Added an image with real alt text',
                      validate: '<img[^>]*alt=["\'][^"\']{4,}["\']',
                      points: 50
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added a bullet list with <ul><li>',
                      validate: '<ul>[\\s\\S]*?<li>[\\s\\S]*?</ul>',
                      points: 50
                    }
                  ],
                  successMessage: '🎉 That looks like a REAL website now!',
                  celebrationEmoji: '🖼️'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your image knowledge',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-img-1',
                    type: 'multiple-choice',
                    question: '🤔 What is the \`alt\` attribute on an \`<img>\` tag for?',
                    options: [
                      'A text description of the image for accessibility and fallback',
                      'The image file size',
                      'An alternative image to show on hover',
                      'The image\'s alignment (left/right/center)'
                    ],
                    correctAnswer: 'A text description of the image for accessibility and fallback',
                    points: 10,
                    explanation: '✨ alt describes the image for screen readers and shows if the image fails to load.'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💪 Practice Challenge',
                  description: 'Complete the list',
                  type: 'code',
                  required: true,
                  order: 2,
                  content: {
                    id: 'practice-img-1',
                    type: 'fill-in-blank',
                    instruction: 'Complete the tags to make a bullet list with one item',
                    code: '<_1_>\n  <_2_>Coding</_2_>\n</_1_>',
                    blanks: {
                      '1': { answer: 'ul', hint: 'Unordered (bullet) list tag' },
                      '2': { answer: 'li', hint: 'List item tag' }
                    },
                    points: 15,
                    explanation: '🌟 <ul><li>Coding</li></ul> — a working bullet list!'
                  }
                }
              ],
              resources: []
            }
          ],
          projects: []
        },
        {
          id: 'module-4-javascript-basics',
          slug: 'javascript-basics',
          title: 'JavaScript: Make Your Website Interactive',
          description: 'Use JavaScript to update a page, respond to clicks, and check a form before it is sent.',
          estimatedTime: '35 minutes',
          order: 4,
          lessons: [
            {
              id: 'lesson-js-1',
              slug: 'javascript-values-and-page-content',
              title: 'JavaScript: Change What a Page Says',
              type: 'hybrid',
              order: 1,
              estimatedTime: '10 minutes',
              content: {
                introduction: 'JavaScript lets a page react to information and actions. Start by finding an HTML element and changing its text.',
                sections: [
                  {
                    id: 'section-1',
                    title: 'Values, variables, and the page',
                    order: 1,
                    content: `A **value** is information such as a name or number. A variable gives that information a useful name. Use \`const\` when you do not plan to replace the value.

\`document.querySelector('#message')\` finds the element with the matching id. Its \`textContent\` is the text visitors see.

\`const learnerName = 'Ama';
const message = document.querySelector('#message');
message.textContent = 'Welcome, ' + learnerName + '!';\`

The selector must match an element in the HTML. The script is loaded after the page content so that the element is ready to find.`,
                    codeExamples: [
                      {
                        id: 'js-example-1',
                        language: 'javascript',
                        code: `const learnerName = 'Ama';
const message = document.querySelector('#message');
message.textContent = 'Welcome, ' + learnerName + '!';`,
                        explanation: 'A named value is placed into the message element using its id.',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: 'Use const to name a value, querySelector to find a page element, and textContent to update its visible text.',
                keyTakeaways: [
                  'Use const to give a value a clear name',
                  'querySelector finds an element using a CSS selector',
                  'textContent changes the text inside an element',
                  'The selector must match an element that exists in the HTML'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Friendly Welcome</title>
</head>
<body>
  <h1 id="message">Your welcome message will appear here.</h1>
  <script src="script.js"></script>
</body>
</html>`
                    },
                    { path: 'script.js', language: 'javascript', content: `// Create a name, find #message, and update its text.\n` }
                  ],
                  instructions: 'Create a const variable for a first name, select the element with id message, then set its textContent to a welcome message that includes the name.',
                  hints: [
                    'Use document.querySelector to find #message.',
                    'Join text and a variable with +, or use a template literal.',
                    'Use textContent to change the heading text.'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    { type: 'code-pattern', description: 'Created a named value with const', validate: 'const\\s+\\w+\\s*=', points: 25 },
                    { type: 'code-pattern', description: 'Selected the message element', validate: 'querySelector\\(', points: 35 },
                    { type: 'code-pattern', description: 'Updated visible text', validate: 'textContent\\s*=', points: 40 }
                  ],
                  successMessage: 'Your page now personalizes its welcome message with JavaScript.'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-js-1',
                  title: 'Check the idea',
                  description: 'Choose the property that changes an element\'s text',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-js-1',
                    type: 'multiple-choice',
                    question: 'Which property changes the text inside an element you selected?',
                    options: ['textContent', 'fontSize', 'href', 'querySelector'],
                    correctAnswer: 'textContent',
                    points: 10,
                    explanation: 'textContent sets or reads the text inside an element.'
                  }
                }
              ],
              resources: []
            },
            {
              id: 'lesson-js-2',
              slug: 'javascript-click-events',
              title: 'Respond to a Button Click',
              type: 'practical',
              order: 2,
              estimatedTime: '12 minutes',
              content: {
                introduction: 'A useful website responds when someone does something. In this lesson, a button click updates a counter on the page.',
                sections: [
                  {
                    id: 'section-1',
                    title: 'Events and event listeners',
                    order: 1,
                    content: `An **event** is an action such as a click. \`addEventListener('click', ... )\` tells JavaScript what to do when that action happens.

Keep the current count in a variable. Each click adds one, then \`textContent\` displays the updated number. The listener is attached to the button, while the number is displayed in a separate element.

Try clicking the button several times and check that the displayed total stays in step with your clicks.`,
                    codeExamples: [
                      {
                        id: 'js-example-2',
                        language: 'javascript',
                        code: `let count = 0;
const button = document.querySelector('#add-one');
const total = document.querySelector('#total');

button.addEventListener('click', () => {
  count = count + 1;
  total.textContent = count;
});`,
                        explanation: 'The click handler runs once each time the button is pressed.',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: 'Attach a click event listener to a button, update a value inside its handler, and display the result in the page.',
                keyTakeaways: [
                  'An event represents an action such as a click',
                  'addEventListener connects an element to an action handler',
                  'Code inside the handler runs when the event happens',
                  'Update the page after changing the value'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Click Counter</title>
</head>
<body>
  <h1>Practice Counter</h1>
  <p>Clicks: <span id="total">0</span></p>
  <button id="add-one" type="button">Add one</button>
  <script src="script.js"></script>
</body>
</html>`
                    },
                    { path: 'script.js', language: 'javascript', content: `// Track the count and update it when #add-one is clicked.\n` }
                  ],
                  instructions: 'Make the button increase the count by one each time it is clicked, then show the new count inside #total.',
                  hints: [
                    'Start with let count = 0 because the value will change.',
                    'Select #add-one and #total separately.',
                    'Place the update inside an addEventListener click handler.'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    { type: 'code-pattern', description: 'Added a click event listener', validate: 'addEventListener\\(\\s*[\'\"]click', points: 35 },
                    { type: 'code-pattern', description: 'Changed the count inside the handler', validate: 'count\\s*=\\s*count\\s*\\+\\s*1', points: 30 },
                    { type: 'code-pattern', description: 'Displayed the updated count', validate: 'textContent\\s*=', points: 35 }
                  ],
                  successMessage: 'The counter now responds to every button click.'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-js-2',
                  title: 'Check the idea',
                  description: 'Choose what connects a button to its click action',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-js-2',
                    type: 'multiple-choice',
                    question: 'Which method runs a function in response to a button click?',
                    options: ['addEventListener', 'textContent', 'querySelector', 'toUpperCase'],
                    correctAnswer: 'addEventListener',
                    points: 10,
                    explanation: 'addEventListener connects an event, such as click, to the function that should respond.'
                  }
                }
              ],
              resources: []
            },
            {
              id: 'lesson-js-3',
              slug: 'javascript-form-validation',
              title: 'Check a Form Before Showing Success',
              type: 'hybrid',
              order: 3,
              estimatedTime: '13 minutes',
              content: {
                introduction: 'Forms collect useful information, but a page should respond clearly when a required answer is missing. Build a small name form with friendly feedback.',
                sections: [
                  {
                    id: 'section-1',
                    title: 'Handle and check a form',
                    order: 1,
                    content: `Listen for the form's \`submit\` event, not just a click on its button. Call \`event.preventDefault()\` so the browser does not reload the page while you check the answer.

The input's \`value\` contains what the learner typed. \`trim()\` removes extra spaces at the beginning and end. If the result is empty, display a helpful message; otherwise, greet the learner.

Use the page message to explain the result. A clear message is more useful than silently doing nothing.`,
                    codeExamples: [
                      {
                        id: 'js-example-3',
                        language: 'javascript',
                        code: `const form = document.querySelector('#signup-form');
const nameInput = document.querySelector('#learner-name');
const feedback = document.querySelector('#feedback');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  feedback.textContent = name ? 'Welcome, ' + name + '!' : 'Please enter your name.';
});`,
                        explanation: 'The form checks the trimmed answer and provides feedback without reloading.',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: 'Handle the submit event, prevent an unwanted reload, trim the input, and show feedback that matches the answer.',
                keyTakeaways: [
                  'Listen for the form submit event',
                  'preventDefault keeps the browser from reloading the page',
                  'input.value reads what the learner typed',
                  'trim helps detect an empty answer even when it contains spaces',
                  'Give clear feedback for both empty and valid answers'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join the Club</title>
</head>
<body>
  <h1>Join the Coding Club</h1>
  <form id="signup-form">
    <label for="learner-name">Your name</label>
    <input id="learner-name" name="name" type="text">
    <button type="submit">Join</button>
  </form>
  <p id="feedback" aria-live="polite"></p>
  <script src="script.js"></script>
</body>
</html>`
                    },
                    { path: 'script.js', language: 'javascript', content: `// Check the form and display a helpful message in #feedback.\n` }
                  ],
                  instructions: 'Handle form submission without a page reload. Trim the entered name, show a prompt if it is empty, and greet the learner when a name is provided.',
                  hints: [
                    'Listen for submit on #signup-form.',
                    'Call event.preventDefault() inside the handler.',
                    'Read #learner-name.value and use trim() before checking it.',
                    'Write both outcomes into #feedback using textContent.'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    { type: 'code-pattern', description: 'Handled form submission', validate: 'addEventListener\\(\\s*[\'\"]submit', points: 25 },
                    { type: 'code-pattern', description: 'Prevented the browser reload', validate: 'preventDefault\\(', points: 25 },
                    { type: 'code-pattern', description: 'Trimmed the entered name', validate: '\\.trim\\(', points: 25 },
                    { type: 'code-pattern', description: 'Displayed a feedback message', validate: 'textContent\\s*=', points: 25 }
                  ],
                  successMessage: 'The form now responds clearly to both empty and completed answers.'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-js-3',
                  title: 'Check the idea',
                  description: 'Choose why a form handler prevents the default action',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-js-3',
                    type: 'multiple-choice',
                    question: 'Why call event.preventDefault() in this form handler?',
                    options: [
                      'To stop the page reloading before feedback is shown',
                      'To erase the learner\'s name',
                      'To create a new HTML element',
                      'To change the button color'
                    ],
                    correctAnswer: 'To stop the page reloading before feedback is shown',
                    points: 10,
                    explanation: 'Preventing the default form submission lets this page display its own feedback without a reload.'
                  }
                }
              ],
              resources: []
            }
          ],
          projects: []
        },
        {
          id: 'module-5-coding-with-ai',
          slug: 'coding-with-ai',
          title: 'Coding With AI: Work Smarter, Not Copy-Paste',
          description: 'Use AI tools like a professional developer, not a shortcut',
          estimatedTime: '12 minutes',
          order: 5,
          lessons: [
            {
              id: 'lesson-4-1',
              slug: 'coding-with-ai-responsibly',
              title: 'Using AI as Your Coding Partner 🤖',
              type: 'hybrid',
              order: 1,
              estimatedTime: '10 minutes',
              content: {
                introduction: '🤖 Tools like ChatGPT and GitHub Copilot can write HTML and CSS for you in seconds. That\'s amazing — but only if YOU still understand and control the code. This lesson teaches you how to use AI the way professional developers do.',
                sections: [
                  {
                    id: 'section-1',
                    title: '✍️ Ask Better Questions',
                    order: 1,
                    content: `AI gives better answers when your prompt is specific. Compare these:

❌ **Vague:** "make my website good"
✅ **Specific:** "I have an <h1> and two <p> tags in index.html. Suggest a CSS rule to center them and add spacing, using what I learned about the box model."

**The pattern for a good prompt:**
1. What you already have
2. What you want to change
3. Any constraint (e.g., "using only what I've learned so far")`
                  },
                  {
                    id: 'section-2',
                    title: '🔍 Read Before You Run',
                    order: 2,
                    content: `Never paste code you don't understand into your project — especially for a project that's graded on **Code Quality**. Before using AI-generated code, ask yourself:

1. Do I recognize every tag/property here?
2. Could I explain this line-by-line to a classmate?
3. Does it match what this course actually taught (no unfamiliar tools)?

If the answer to any of these is "no" — ask the AI to explain it, or simplify it, before you use it.`
                  },
                  {
                    id: 'section-3',
                    title: '🐛 Debug It Yourself First',
                    order: 3,
                    content: `AI-generated code isn't always correct. Below is some HTML an AI assistant "wrote" — but it has a bug. Can you spot and fix it before running it in the editor below?

**Hint:** look closely at the closing tag.`,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<header>
  <h1>My Portfolio<h1>
</header>`,
                        explanation: 'This looks right at a glance, but the closing tag should be </h1>, not another opening <h1>. Always proofread AI output like this before trusting it!',
                        editable: false,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: '🎯 AI is a powerful coding partner — but you\'re still the developer. Write specific prompts, read every line before using it, and always be able to debug and explain the code as if you wrote it yourself.',
                keyTakeaways: [
                  '✍️ Specific prompts (what you have + what you want + constraints) get better AI answers',
                  '🔍 Never paste AI code you can\'t explain line-by-line',
                  '🐛 Always proofread AI output for small mistakes like mismatched tags',
                  '🏆 Your project is graded on Code Quality — AI can\'t take that test for you'
                ]
              },
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [
                    {
                      path: 'index.html',
                      language: 'html',
                      content: `<!DOCTYPE html>
<html>
<head>
  <title>Fix the AI's Code</title>
</head>
<body>
  <!-- 🎯 An AI assistant wrote this, but made a mistake.
       Find and fix the bug before it will pass! -->
  <header>
    <h1>My Portfolio<h1>
  </header>
  <main>
    <p>I build websites and I'm learning fast!</p>
  </main>
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 This code has a bug an AI assistant introduced. Find the mismatched tag and fix it.',
                  hints: [
                    '💡 Check every opening tag has a matching closing tag with a /',
                    '🔥 Look very closely at the two <h1> tags'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 50,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: '✅ Fixed the closing </h1> tag',
                      validate: '<h1>[^<]*</h1>',
                      points: 60
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Kept the semantic <header> and <main> structure',
                      validate: '<header>[\\s\\S]*</header>[\\s\\S]*<main>',
                      points: 40
                    }
                  ],
                  successMessage: '🎉 You just did what every professional developer does — caught an AI\'s mistake before shipping it!',
                  celebrationEmoji: '🤖'
                }
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: '⚡ Quick Check!',
                  description: 'Test your AI habits',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-ai-1',
                    type: 'multiple-choice',
                    question: '🤔 Before using AI-generated code in your project, you should ALWAYS:',
                    options: [
                      'Read it and make sure you understand every line',
                      'Paste it immediately to save time',
                      'Delete your own code first',
                      'Ask the AI to grade it for you'
                    ],
                    correctAnswer: 'Read it and make sure you understand every line',
                    points: 10,
                    explanation: '✨ Exactly — if you can\'t explain it, you can\'t defend it (or debug it later).'
                  }
                },
                {
                  id: 'checkpoint-2',
                  title: '💭 Quick Reflection',
                  description: 'Think about how you\'ll use AI on your final project',
                  type: 'reflection',
                  required: true,
                  order: 2,
                  content: {
                    prompt: 'Name one specific way you plan to use an AI tool while building your Personal Website project — and one thing you will personally check before using its suggestion.'
                  }
                }
              ],
              resources: [
                {
                  id: 'resource-1',
                  title: '💡 Prompting Cheat Sheet',
                  type: 'tips',
                  description: 'Templates for asking AI tools for coding help'
                }
              ]
            }
          ],
          projects: [
            {
              id: 'project-1',
              slug: 'personal-website',
              title: 'Build Your Personal Portfolio Website',
              type: 'code',
              description: 'Build a two-page portfolio that introduces your skills, interests, and projects, with responsive styling and one working JavaScript interaction. Do not include private contact details or your home address.',
              order: 1,
              points: 100,
              requirements: [
                {
                  id: 'req-1',
                  title: 'Useful Homepage',
                  description: 'Create an index.html homepage introducing your learning goals, skills, and one project or community activity.',
                  required: true,
                  points: 20,
                  order: 1
                },
                {
                  id: 'req-2',
                  title: 'About Page',
                  description: 'Create an about.html page with a short learning story, interests, and the skills you are developing. Avoid private personal information.',
                  required: true,
                  points: 15,
                  order: 2
                },
                {
                  id: 'req-3',
                  title: 'Navigation',
                  description: 'Add working navigation links between index.html and about.html.',
                  required: true,
                  points: 15,
                  order: 3
                },
                {
                  id: 'req-4',
                  title: 'Responsive CSS Design',
                  description: 'Use styles.css to create a readable layout that adapts to a narrow phone screen and a wider screen.',
                  required: true,
                  points: 25,
                  order: 4
                },
                {
                  id: 'req-5',
                  title: 'JavaScript Interaction',
                  description: 'Use script.js to add one useful interaction, such as a welcome-message button or a form that gives clear feedback.',
                  required: true,
                  points: 25,
                  order: 5
                }
              ],
              rubric: {
                totalPoints: 100,
                passingScore: 70,
                criteria: [
                  {
                    id: 'criterion-1',
                    name: 'HTML Structure',
                    description: 'Valid page structure, meaningful sections, and clear navigation across both pages',
                    maxPoints: 25,
                    levels: [
                      { score: 25, description: 'Both pages use clear semantic structure and navigation works throughout' },
                      { score: 18, description: 'Both pages are structured and most navigation works' },
                      { score: 10, description: 'Pages exist but structure or navigation has notable gaps' },
                      { score: 0, description: 'Poor or incorrect structure' }
                    ]
                  },
                  {
                    id: 'criterion-2',
                    name: 'Responsive Design',
                    description: 'Readable visual hierarchy, spacing, and layout across phone and desktop widths',
                    maxPoints: 25,
                    levels: [
                      { score: 25, description: 'Consistent, polished layout that adapts well to narrow and wide screens' },
                      { score: 18, description: 'Readable styling with minor responsive or layout issues' },
                      { score: 10, description: 'Some styling is present but layout is difficult to use on one screen size' },
                      { score: 0, description: 'Little or no working CSS styling' }
                    ]
                  },
                  {
                    id: 'criterion-3',
                    name: 'JavaScript Interaction',
                    description: 'A useful interaction responds correctly and communicates its result to the visitor',
                    maxPoints: 25,
                    levels: [
                      { score: 25, description: 'Interaction works reliably and gives clear feedback' },
                      { score: 18, description: 'Interaction works with a minor issue or incomplete feedback' },
                      { score: 10, description: 'JavaScript is present but the interaction is incomplete' },
                      { score: 0, description: 'No working JavaScript interaction' }
                    ]
                  },
                  {
                    id: 'criterion-4',
                    name: 'Useful, Accessible Content',
                    description: 'Specific, well-organized portfolio content with helpful labels and text alternatives where needed',
                    maxPoints: 15,
                    levels: [
                      { score: 15, description: 'Specific content is easy to understand and interactive controls are clearly labeled' },
                      { score: 10, description: 'Content is understandable with a few missing details or labels' },
                      { score: 5, description: 'Content is sparse or some controls are unclear' },
                      { score: 0, description: 'Content is missing or difficult to understand' }
                    ]
                  },
                  {
                    id: 'criterion-5',
                    name: 'Code Quality',
                    description: 'Readable, organized HTML, CSS, and JavaScript with no avoidable duplication',
                    maxPoints: 10,
                    levels: [
                      { score: 10, description: 'Files are organized, readable, and consistently formatted' },
                      { score: 7, description: 'Code is understandable with a few formatting issues' },
                      { score: 3, description: 'Code is difficult to follow or has repeated sections' },
                      { score: 0, description: 'Poorly formatted or invalid code' }
                    ]
                  }
                ]
              },
              startingTemplate: {
                environment: 'html-css-js',
                startingFiles: [
                  {
                    path: 'index.html',
                    language: 'html',
                    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>My Learning Portfolio</h1>
    <nav aria-label="Main navigation">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>What I am learning</h2>
      <p>Write a short introduction to your skills, goals, and interests.</p>
      <button id="show-message" type="button">Show my next goal</button>
      <p id="message" aria-live="polite"></p>
    </section>
    <section>
      <h2>A project I am proud of</h2>
      <p>Describe a project, school activity, or community idea you worked on.</p>
    </section>
  </main>
  <footer><p>Learning, building, and improving.</p></footer>
  <script src="script.js"></script>
</body>
</html>`
                  },
                  {
                    path: 'about.html',
                    language: 'html',
                    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Me</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>About My Learning</h1>
    <nav aria-label="Main navigation">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>My story</h2>
      <p>Share what you enjoy learning and what you hope to build next.</p>
    </section>
    <section>
      <h2>Skills I am practicing</h2>
      <p>List skills, tools, or activities you have tried.</p>
    </section>
  </main>
  <footer><p><a href="index.html">Back to the home page</a></p></footer>
</body>
 </html>`
                  },
                  {
                    path: 'styles.css',
                    language: 'css',
                    content: `:root {
  color-scheme: light;
  font-family: system-ui, sans-serif;
  color: #17352b;
  background: #f3f7f4;
}

body {
  margin: 0;
  line-height: 1.6;
}

header, main, footer {
  width: min(100% - 2rem, 54rem);
  margin-inline: auto;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

main {
  padding-block: 2rem;
}

section {
  padding-block: 1rem;
}

button, a {
  color: #075e49;
}

button {
  padding: 0.6rem 0.9rem;
  font: inherit;
}

@media (min-width: 40rem) {
  main {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
}`
                  },
                  {
                    path: 'script.js',
                    language: 'javascript',
                    content: `const button = document.querySelector('#show-message');
const message = document.querySelector('#message');

button.addEventListener('click', () => {
  message.textContent = 'My next goal is to keep learning and building.';
});`
                  }
                ],
                instructions: 'Complete both pages, link them with working navigation, style them in styles.css for phone and desktop screens, and add one useful interaction in script.js. Use sample or public-facing information only; do not include a home address or private phone number.',
                allowFileCreation: true,
                allowInstallPackages: false,
                maxFileSize: 200,
                timeout: 10
              }
            }
          ]
        }
      ],
      assessments: [],
      order: 1,
      tags: ['html', 'css', 'web-development', 'beginner']
    }
  ],
  certificate: {
    title: 'Web Development Fundamentals Certificate',
    issuer: 'SmartClass24 Innovation Academy',
    verifiable: true
  },
  tags: ['web-development', 'html', 'css', 'javascript', 'beginner-friendly'],
  active: true
};

// ============================================================================
// All Available Programs
// ============================================================================

export const UNIVERSITY_PROGRAMS: UniversityProgram[] = [
  webDevelopmentProgram,
  // Future programs:
  // - React Development
  // - Python Programming
  // - Data Structures & Algorithms
  // - Full Stack Development
  // - Mobile App Development
  // - Cloud Computing
];

export function getUniversityProgram(slug: string): UniversityProgram | undefined {
  return UNIVERSITY_PROGRAMS.find(program => program.slug === slug);
}

export function getUniversityProgramsByDiscipline(discipline: string): UniversityProgram[] {
  return UNIVERSITY_PROGRAMS.filter(program => program.discipline === discipline && program.active);
}

export function getAllActivePrograms(): UniversityProgram[] {
  return UNIVERSITY_PROGRAMS.filter(program => program.active);
}

/**
 * Locate a project by id across all programs/courses/modules (used by admin grading tools).
 */
export function findProjectById(projectId: string): {
  program: UniversityProgram;
  course: UniversityCourse;
  project: Project;
} | null {
  for (const program of UNIVERSITY_PROGRAMS) {
    for (const course of program.courses) {
      for (const module of course.modules) {
        const project = module.projects.find(p => p.id === projectId);
        if (project) return { program, course, project };
      }
    }
  }
  return null;
}

