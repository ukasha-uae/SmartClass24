/**
 * S24 Innovation Academy Technology Programs - Initial Curriculum Data
 * Comprehensive tech-focused courses with hands-on projects
 */

import { UniversityProgram, CodeFile } from '@/types/university';

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
