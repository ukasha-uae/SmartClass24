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
          estimatedTime: '15 minutes',
          order: 3,
          lessons: [
            {
              id: 'lesson-3-1',
              slug: 'semantic-html-links-images',
              title: 'Semantic HTML, Links & Images 🔗',
              type: 'practical',
              order: 1,
              estimatedTime: '10 minutes',
              content: {
                introduction: '🔗 Real websites have more than one page — and they use special tags so browsers (and screen readers!) understand what each part of the page means. Let\'s learn the tags your final project needs.',
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
                  },
                  {
                    id: 'section-2',
                    title: '🔗 Linking Between Pages',
                    order: 2,
                    content: `The \`<a>\` (anchor) tag is how you link to other pages — or other websites:

\`\`\`html
<a href="about.html">About Me</a>
\`\`\`

- \`href\` = where the link goes
- The text between the tags = what visitors click

**This is exactly what your final project needs**: an \`index.html\` and \`about.html\` that link to EACH OTHER using \`<a>\` tags in a shared \`<nav>\`.`,
                    codeExamples: [
                      {
                        id: 'example-2',
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
                  },
                  {
                    id: 'section-3',
                    title: '🖼️ Images & Lists',
                    order: 3,
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
                        id: 'example-3',
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
                  '🏷️ header/nav/main/footer describe what each part of the page IS',
                  '🔗 <a href="page.html">Text</a> links to another page',
                  '🖼️ <img src="..." alt="..."> always needs a real alt description',
                  '📋 <ul><li> makes a bullet list'
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
  2. Add a <nav> with a link to about.html
  3. Wrap the intro paragraph in <main>
  4. Add a <footer> with a copyright line
  5. Add a photo of yourself with <img> (any src) and a real alt
  6. Add a <ul> with 3 things you like
  -->
  <h1>My Site</h1>
  <p>Welcome! This is my homepage.</p>
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
  <!-- 🎯 Add a <nav> here too, linking back to index.html -->
  <h1>About Me</h1>
  <p>Tell visitors about yourself here.</p>
</body>
</html>`
                    }
                  ],
                  instructions: '🎯 Turn index.html into a real semantic page with navigation to about.html, an image, and a list.',
                  hints: [
                    '💡 <nav> can hold one or more <a> tags',
                    '🔥 alt text should describe the image, not just say "photo"',
                    '⚡ Don\'t forget the closing </header>, </nav>, </main>, </footer> tags'
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
                      points: 15
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added <nav> with a link to about.html',
                      validate: '<nav>[\\s\\S]*?href=["\']about\\.html["\'][\\s\\S]*?</nav>',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Wrapped content in <main>',
                      validate: '<main>',
                      points: 15
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added a <footer>',
                      validate: '<footer>',
                      points: 10
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added an image with real alt text',
                      validate: '<img[^>]*alt=["\'][^"\']{4,}["\']',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: '✅ Added a bullet list with <ul><li>',
                      validate: '<ul>[\\s\\S]*?<li>[\\s\\S]*?</ul>',
                      points: 20
                    }
                  ],
                  successMessage: '🎉 That looks like a REAL website now!',
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
              resources: [
                {
                  id: 'resource-1',
                  title: '📚 Semantic HTML Cheat Sheet',
                  type: 'cheatsheet',
                  description: 'header, nav, main, section, article, footer at a glance'
                }
              ]
            }
          ],
          projects: []
        },
        {
          id: 'module-4-coding-with-ai',
          slug: 'coding-with-ai',
          title: 'Coding With AI: Work Smarter, Not Copy-Paste',
          description: 'Use AI tools like a professional developer, not a shortcut',
          estimatedTime: '12 minutes',
          order: 4,
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
              title: 'Build Your Personal Website',
              type: 'code',
              description: 'Create a multi-page personal website showcasing your profile, interests, and portfolio.',
              order: 1,
              points: 100,
              requirements: [
                {
                  id: 'req-1',
                  title: 'Homepage',
                  description: 'Create an index.html file with a welcoming homepage including your name, photo, and brief introduction',
                  required: true,
                  points: 25,
                  order: 1
                },
                {
                  id: 'req-2',
                  title: 'About Page',
                  description: 'Create an about.html page with detailed information about yourself, education, and experience',
                  required: true,
                  points: 25,
                  order: 2
                },
                {
                  id: 'req-3',
                  title: 'Navigation',
                  description: 'Add navigation links between pages',
                  required: true,
                  points: 20,
                  order: 3
                },
                {
                  id: 'req-4',
                  title: 'Semantic HTML',
                  description: 'Use semantic HTML5 tags (header, nav, main, footer, article, section)',
                  required: true,
                  points: 30,
                  order: 4
                }
              ],
              rubric: {
                totalPoints: 100,
                passingScore: 70,
                criteria: [
                  {
                    id: 'criterion-1',
                    name: 'HTML Structure',
                    description: 'Proper HTML5 structure with semantic tags',
                    maxPoints: 30,
                    levels: [
                      { score: 30, description: 'Perfect HTML5 structure with all semantic tags' },
                      { score: 20, description: 'Good structure with most semantic tags' },
                      { score: 10, description: 'Basic structure, missing semantic tags' },
                      { score: 0, description: 'Poor or incorrect structure' }
                    ]
                  },
                  {
                    id: 'criterion-2',
                    name: 'Content Quality',
                    description: 'Meaningful and well-organized content',
                    maxPoints: 30,
                    levels: [
                      { score: 30, description: 'Excellent, detailed content' },
                      { score: 20, description: 'Good content with minor gaps' },
                      { score: 10, description: 'Basic content, needs improvement' },
                      { score: 0, description: 'Insufficient or placeholder content' }
                    ]
                  },
                  {
                    id: 'criterion-3',
                    name: 'Navigation',
                    description: 'Functional navigation between pages',
                    maxPoints: 20,
                    levels: [
                      { score: 20, description: 'Full navigation working perfectly' },
                      { score: 10, description: 'Partial navigation with some issues' },
                      { score: 0, description: 'Navigation not working' }
                    ]
                  },
                  {
                    id: 'criterion-4',
                    name: 'Code Quality',
                    description: 'Clean, well-formatted, valid HTML',
                    maxPoints: 20,
                    levels: [
                      { score: 20, description: 'Clean, well-formatted code' },
                      { score: 10, description: 'Acceptable code with minor issues' },
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
  <title>Your Name - Personal Website</title>
</head>
<body>
  <!-- Your code here -->
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
</head>
<body>
  <!-- Your about page here -->
</body>
</html>`
                  }
                ],
                instructions: 'Build a personal website with at least 2 pages. Use semantic HTML5 tags and create navigation between pages.',
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

