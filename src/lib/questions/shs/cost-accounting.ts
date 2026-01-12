import type { ChallengeQuestion } from '../types';

export const costAccountingQuestions: ChallengeQuestion[] = [
  // Cost Classification
  {
    id: 'ca-2023-001',
    type: 'mcq',
    question: 'Which of the following is a fixed cost?',
    options: ['Raw materials', 'Direct labor', 'Factory rent', 'Sales commission'],
    correctAnswer: 2,
    explanation: 'Fixed costs remain constant regardless of production levels. Factory rent stays the same whether you produce 100 or 1000 units.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Cost Classification',
    year: 2023,
  },
  {
    id: 'ca-2023-002',
    type: 'mcq',
    question: 'Variable costs are costs that:',
    options: [
      'Remain constant per unit',
      'Change in total with production levels',
      'Are paid monthly',
      'Cannot be controlled'
    ],
    correctAnswer: 1,
    explanation: 'Variable costs change in total as production increases or decreases, but remain constant per unit.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Cost Classification',
    year: 2023,
  },

  // Direct and Indirect Costs
  {
    id: 'ca-2022-003',
    type: 'mcq',
    question: 'Which is an example of a direct cost?',
    options: ['Factory supervisor salary', 'Raw materials for Product A', 'Factory electricity', 'Office supplies'],
    correctAnswer: 1,
    explanation: 'Direct costs can be directly traced to a specific product. Raw materials used for a specific product are direct costs.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Direct and Indirect Costs',
    year: 2022,
  },
  {
    id: 'ca-2023-004',
    type: 'mcq',
    question: 'Indirect costs are also known as:',
    options: ['Prime costs', 'Overheads', 'Direct expenses', 'Variable costs'],
    correctAnswer: 1,
    explanation: 'Indirect costs are called overheads - they cannot be directly traced to a specific product.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Direct and Indirect Costs',
    year: 2023,
  },

  // Cost Elements
  {
    id: 'ca-2022-005',
    type: 'mcq',
    question: 'Prime cost is the sum of:',
    options: [
      'Direct materials + Direct labor + Direct expenses',
      'Fixed costs + Variable costs',
      'Total costs - Overheads',
      'Direct materials + Overheads'
    ],
    correctAnswer: 0,
    explanation: 'Prime cost = Direct materials + Direct labor + Direct expenses. It represents all direct costs.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Cost Elements',
    year: 2022,
  },
  {
    id: 'ca-2023-006',
    type: 'mcq',
    question: 'Conversion cost consists of:',
    options: [
      'Direct materials + Direct labor',
      'Direct labor + Factory overheads',
      'All manufacturing costs',
      'Prime cost + Administrative expenses'
    ],
    correctAnswer: 1,
    explanation: 'Conversion cost = Direct labor + Factory overheads. It represents costs to convert raw materials into finished goods.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Cost Elements',
    year: 2023,
  },

  // Break-Even Analysis
  {
    id: 'ca-2022-007',
    type: 'mcq',
    question: 'Break-even point is where:',
    options: [
      'Total revenue equals total costs',
      'Profit is maximized',
      'Variable costs equal fixed costs',
      'Sales are highest'
    ],
    correctAnswer: 0,
    explanation: 'Break-even point occurs when total revenue equals total costs - no profit, no loss.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Break-Even Analysis',
    year: 2022,
  },
  {
    id: 'ca-2023-008',
    type: 'mcq',
    question: 'Contribution margin is:',
    options: [
      'Selling price minus variable cost per unit',
      'Total revenue minus total costs',
      'Fixed costs minus variable costs',
      'Gross profit minus expenses'
    ],
    correctAnswer: 0,
    explanation: 'Contribution margin = Selling price - Variable cost per unit. It contributes to covering fixed costs and profit.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 3',
    level: 'SHS',
    topic: 'Break-Even Analysis',
    year: 2023,
  },

  // Budgeting
  {
    id: 'ca-2022-009',
    type: 'mcq',
    question: 'A budget is:',
    options: [
      'A financial statement of past performance',
      'A financial plan for future operations',
      'An audit report',
      'A tax calculation'
    ],
    correctAnswer: 1,
    explanation: 'A budget is a financial plan that forecasts revenues and expenses for a future period.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Budgeting',
    year: 2022,
  },
  {
    id: 'ca-2023-010',
    type: 'mcq',
    question: 'Variance analysis compares:',
    options: [
      'Actual results with budgeted figures',
      'This year with last year',
      'Fixed costs with variable costs',
      'Revenue with expenses'
    ],
    correctAnswer: 0,
    explanation: 'Variance analysis compares actual performance against the budget to identify and explain differences.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 3',
    level: 'SHS',
    topic: 'Budgeting',
    year: 2023,
  },

  // Absorption Costing
  {
    id: 'ca-2022-011',
    type: 'mcq',
    question: 'Under absorption costing, product costs include:',
    options: [
      'Only variable manufacturing costs',
      'All manufacturing costs (fixed and variable)',
      'Only direct costs',
      'All business expenses'
    ],
    correctAnswer: 1,
    explanation: 'Absorption costing assigns all manufacturing costs (both fixed and variable) to products.',
    subject: 'Cost Accounting',
    difficulty: 'hard',
    classLevel: 'SHS 3',
    level: 'SHS',
    topic: 'Absorption Costing',
    year: 2022,
  },

  // Job Costing
  {
    id: 'ca-2023-012',
    type: 'mcq',
    question: 'Job costing is most suitable for:',
    options: [
      'Mass production of identical items',
      'Custom-made products or services',
      'Continuous processing',
      'Retail stores'
    ],
    correctAnswer: 1,
    explanation: 'Job costing tracks costs for each individual job or project, ideal for custom/unique products.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Job Costing',
    year: 2023,
  },

  // Standard Costing
  {
    id: 'ca-2022-013',
    type: 'mcq',
    question: 'Standard costs are:',
    options: [
      'Actual costs incurred',
      'Predetermined expected costs',
      'Historical average costs',
      'Market prices'
    ],
    correctAnswer: 1,
    explanation: 'Standard costs are predetermined benchmarks set based on expected efficient operations.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 3',
    level: 'SHS',
    topic: 'Standard Costing',
    year: 2022,
  },

  // Inventory Valuation
  {
    id: 'ca-2023-014',
    type: 'mcq',
    question: 'FIFO (First-In, First-Out) assumes:',
    options: [
      'Newest items are sold first',
      'Oldest items are sold first',
      'Average cost items are sold',
      'Most expensive items are sold first'
    ],
    correctAnswer: 1,
    explanation: 'FIFO assumes the oldest inventory items are sold first, leaving newer items in stock.',
    subject: 'Cost Accounting',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Inventory Valuation',
    year: 2023,
  },

  // Cost-Volume-Profit Analysis
  {
    id: 'ca-2023-015',
    type: 'mcq',
    question: 'Margin of safety indicates:',
    options: [
      'How much sales can drop before reaching break-even',
      'The profit percentage',
      'The fixed cost coverage',
      'The variable cost ratio'
    ],
    correctAnswer: 0,
    explanation: 'Margin of safety = Actual sales - Break-even sales. It shows the cushion before losses occur.',
    subject: 'Cost Accounting',
    difficulty: 'medium',
    classLevel: 'SHS 3',
    level: 'SHS',
    topic: 'Cost-Volume-Profit Analysis',
    year: 2023,
  },
];
