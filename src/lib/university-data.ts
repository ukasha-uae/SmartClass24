/**
 * University Technology Programs - Initial Curriculum Data
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
  description: 'Master the core technologies of web development: HTML, CSS, and JavaScript. Build responsive, interactive websites from scratch.',
  duration: '3 months',
  difficulty: 'beginner',
  prerequisites: ['Basic computer literacy', 'No prior coding experience required'],
  learningOutcomes: [
    'Build responsive websites using HTML5 and CSS3',
    'Create interactive web applications with JavaScript',
    'Understand web development best practices',
    'Deploy websites to production',
    'Work with modern development tools and workflows'
  ],
  courses: [
    {
      id: 'html-css-basics',
      slug: 'html-css-basics',
      title: 'HTML & CSS Basics',
      description: 'Learn the building blocks of the web',
      instructor: {
        name: 'SmartClass Teacher',
        title: 'Senior Web Developer',
        bio: 'Experienced web developer with 10+ years in the industry'
      },
      duration: '4 weeks',
      modules: [
        {
          id: 'module-1-html-intro',
          slug: 'html-introduction',
          title: 'Introduction to HTML',
          description: 'Learn HTML structure, tags, and semantic markup',
          estimatedTime: '3 hours',
          order: 1,
          lessons: [
            {
              id: 'lesson-1-1',
              slug: 'what-is-html',
              title: 'What is HTML?',
              type: 'theory',
              order: 1,
              estimatedTime: '30 minutes',
              content: {
                introduction: 'HTML (HyperText Markup Language) is the standard language for creating web pages. It provides the structure and content of websites.',
                sections: [
                  {
                    id: 'section-1',
                    title: 'Understanding HTML',
                    content: `HTML uses "markup" to annotate text, images, and other content for display in a web browser. HTML markup includes special "elements" such as:
                    
- \`<head>\`, \`<title>\`, \`<body>\`, \`<header>\`, \`<footer>\`, \`<article>\`, \`<section>\`, \`<p>\`, \`<div>\`, \`<span>\`, \`<img>\`, \`<aside>\`, \`<audio>\`, \`<canvas>\`, \`<datalist>\`, \`<details>\`, \`<embed>\`, \`<nav>\`, \`<output>\`, \`<progress>\`, \`<video>\`, \`<ul>\`, \`<ol>\`, \`<li>\` and many others.

An HTML element is set off from other text in a document by "tags", which consist of the element name surrounded by "<" and ">".`,
                    order: 1,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Welcome to Web Development!</h1>
    <p>This is my first HTML page.</p>
  </body>
</html>`,
                        explanation: 'A basic HTML document structure',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  },
                  {
                    id: 'section-2',
                    title: 'HTML Document Structure',
                    content: `Every HTML document follows a basic structure:

1. **DOCTYPE declaration**: Tells the browser this is an HTML5 document
2. **html element**: Root element containing all other elements
3. **head element**: Contains metadata about the document
4. **body element**: Contains the visible content`,
                    order: 2,
                    codeExamples: []
                  }
                ],
                summary: 'HTML is the foundation of web development. It provides structure and meaning to web content through a system of tags and elements.',
                keyTakeaways: [
                  'HTML stands for HyperText Markup Language',
                  'HTML uses tags to structure content',
                  'Every HTML document has a standard structure',
                  'HTML is not a programming language - it\'s a markup language'
                ]
              },
              checkpoints: [
                {
                  id: 'checkpoint-1',
                  title: 'Understanding HTML Basics',
                  description: 'Test your knowledge of HTML fundamentals',
                  type: 'quiz',
                  required: true,
                  order: 1,
                  content: {
                    id: 'quiz-1',
                    type: 'multiple-choice',
                    question: 'What does HTML stand for?',
                    options: [
                      'HyperText Markup Language',
                      'HighText Machine Language',
                      'HyperText Making Language',
                      'HyperTech Markup Language'
                    ],
                    correctAnswer: 'HyperText Markup Language',
                    points: 10,
                    explanation: 'HTML stands for HyperText Markup Language. It is used to structure content on the web.'
                  }
                }
              ],
              resources: [
                {
                  id: 'resource-1',
                  title: 'MDN HTML Guide',
                  type: 'documentation',
                  url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                  description: 'Comprehensive HTML reference from Mozilla'
                },
                {
                  id: 'resource-2',
                  title: 'HTML Cheat Sheet',
                  type: 'cheatsheet',
                  description: 'Quick reference for common HTML tags'
                }
              ]
            },
            {
              id: 'lesson-1-2',
              slug: 'html-tags-elements',
              title: 'HTML Tags and Elements',
              type: 'practical',
              order: 2,
              estimatedTime: '1 hour',
              content: {
                introduction: 'Learn how to use HTML tags to create structured content including headings, paragraphs, lists, links, and images.',
                sections: [
                  {
                    id: 'section-1',
                    title: 'Common HTML Tags',
                    content: 'HTML provides various tags for different types of content. Let\'s explore the most commonly used ones.',
                    order: 1,
                    codeExamples: [
                      {
                        id: 'example-1',
                        language: 'html',
                        code: `<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>

<!-- Paragraphs -->
<p>This is a paragraph of text.</p>

<!-- Lists -->
<ul>
  <li>Unordered list item 1</li>
  <li>Unordered list item 2</li>
</ul>

<ol>
  <li>Ordered list item 1</li>
  <li>Ordered list item 2</li>
</ol>

<!-- Links -->
<a href="https://example.com">Visit Example</a>

<!-- Images -->
<img src="image.jpg" alt="Description of image">`,
                        explanation: 'Common HTML tags for structuring content',
                        editable: true,
                        showLineNumbers: true
                      }
                    ]
                  }
                ],
                summary: 'HTML tags are the building blocks of web pages. Each tag serves a specific purpose in structuring and presenting content.',
                keyTakeaways: [
                  'Use semantic tags for better structure',
                  'Always close your tags',
                  'Use headings in hierarchical order',
                  'Add alt text to images for accessibility'
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
  <title>My Profile</title>
</head>
<body>
  <!-- Create your profile page here -->
  <h1>Your Name</h1>
  <p>Write a short bio about yourself</p>
  
  <!-- Add more content: -->
  <!-- - A list of your hobbies -->
  <!-- - A list of your skills -->
  <!-- - Links to your social media -->
</body>
</html>`
                    }
                  ],
                  instructions: 'Create a personal profile page using HTML tags. Include headings, paragraphs, lists, and at least one link.',
                  hints: [
                    'Use <h1> for your name',
                    'Use <p> for your bio',
                    'Use <ul> or <ol> for lists',
                    'Use <a> for links'
                  ],
                  allowFileCreation: false,
                  allowInstallPackages: false,
                  maxFileSize: 100,
                  timeout: 5,
                  validation: [
                    {
                      type: 'code-pattern',
                      description: 'Page includes at least one heading',
                      validate: '<h[1-6]>',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: 'Page includes at least one paragraph',
                      validate: '<p>',
                      points: 20
                    },
                    {
                      type: 'code-pattern',
                      description: 'Page includes a list',
                      validate: '(<ul>|<ol>)',
                      points: 30
                    },
                    {
                      type: 'code-pattern',
                      description: 'Page includes a link',
                      validate: '<a\\s+href',
                      points: 30
                    }
                  ]
                }
              },
              checkpoints: [],
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
    issuer: 'SmartClass24 University',
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
