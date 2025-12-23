import { Computer } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Computing Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 8346-8537 from original file
 */

export const computingSubject: Subject = {
    id: '8',
    slug: 'computing',
    name: '{{country:ghana=Computing|nigeria=Computer Studies|default=Computer Studies}}',
    icon: Computer,
    description: 'Learn the fundamentals of computers and ICT.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'comp101',
            slug: 'introduction-to-ict-1',
            title: 'Introduction to ICT & Digital Literacy',
            lessons: [
              {
                id: 'comp101-1',
                slug: 'introduction-to-ict',
                title: 'Introduction to ICT',
                objectives: ['Define ICT and explain its importance in daily life.', 'Identify various ICT tools and devices.', 'Differentiate between hardware and software.'],
                introduction: 'Information and Communication Technology (ICT) has become an essential part of our modern world. In this lesson, we will explore what ICT is and why it is important.',
                keyConcepts: [
                    { title: 'What is ICT?', content: 'ICT refers to technologies that provide access to information through telecommunications. It includes the Internet, wireless networks, cell phones, and other communication mediums.' },
                    { title: 'Hardware vs. Software', content: 'Hardware refers to the physical components of a computer system, like the monitor and keyboard. Software is a set of instructions or programs that tells the hardware what to do.' },
                ],
                activities: { type: 'quiz', questions: [] },
                pastQuestions: [
                    { question: 'Which of the following is an example of hardware? a) Microsoft Word b) Mouse c) Internet', solution: 'The correct answer is b) Mouse, as it is a physical device you can touch.' },
                ],
                summary: 'We learned that ICT is the technology used to handle and communicate information, and we distinguished between the physical hardware and the instructional software of a computer system.'
              },
              { id: 'comp101-2', slug: 'types-of-ict-devices', title: 'Types of ICT devices', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp101-3', slug: 'hardware-vs-software', title: 'Differences between hardware and software', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp102',
            slug: 'parts-functions-computer-1',
            title: 'Parts & Functions of a Computer',
            lessons: [
              { id: 'comp102-1', slug: 'input-output-processing-storage', title: 'Input, Output, Processing, and Storage devices', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp102-2', slug: 'setting-up-computer', title: 'Setting up a computer', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp102-3', slug: 'booting-shutting-down', title: 'Booting and shutting down safely', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp103',
            slug: 'word-processing-1',
            title: 'Word Processing & Office Tools',
            lessons: [
              { id: 'comp103-1', slug: 'intro-typing', title: 'Introduction to typing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp103-2', slug: 'formatting-text', title: 'Formatting text', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp103-3', slug: 'saving-opening-printing', title: 'Saving, opening, and printing documents', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp104',
            slug: 'internet-communication-1',
            title: 'Internet & Communication',
            lessons: [
              { id: 'comp104-1', slug: 'intro-internet', title: 'Introduction to the Internet', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp104-2', slug: 'uses-of-internet', title: 'Uses of the Internet', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp104-3', slug: 'intro-email', title: 'Introduction to email', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp105',
            slug: 'safety-ethics-1',
            title: 'Safety, Ethics & Emerging Technologies',
            lessons: [
              { id: 'comp105-1', slug: 'responsible-use-ict', title: 'Responsible use of ICT devices', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp105-2', slug: 'caring-for-computers', title: 'Caring for computers', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp105-3', slug: 'dangers-of-misuse', title: 'Dangers of misuse', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'comp201',
            slug: 'computer-systems-os-2',
            title: 'Parts & Functions of a Computer',
            lessons: [
              { id: 'comp201-1', slug: 'components-computer-system', title: 'Components of a computer system', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp201-2', slug: 'functions-operating-system', title: 'Functions of the operating system', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp201-3', slug: 'file-management', title: 'File management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp202',
            slug: 'word-processing-spreadsheets-2',
            title: 'Word Processing & Office Tools',
            lessons: [
              { id: 'comp202-1', slug: 'advanced-word-processing', title: 'Advanced word processing (tables, lists, pictures)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp202-2', slug: 'intro-spreadsheets', title: 'Introduction to spreadsheets', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp202-3', slug: 'simple-formulas', title: 'Entering data and simple formulas', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp203',
            slug: 'internet-communication-2',
            title: 'Internet & Communication',
            lessons: [
              { id: 'comp203-1', slug: 'web-browsers-search-engines', title: 'Web browsers and search engines', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp203-2', slug: 'safe-searching', title: 'Safe searching and evaluating websites', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp203-3', slug: 'social-media-platforms', title: 'Social media and communication platforms', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp204',
            slug: 'presentation-software-2',
            title: 'Programming Basics & Problem Solving',
            lessons: [
              { id: 'comp204-1', slug: 'basics-slide-preparation', title: 'Basics of slide preparation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp204-2', slug: 'adding-text-pictures-transitions', title: 'Adding text, pictures, and slide transitions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp204-3', slug: 'simple-presentations', title: 'Simple class/group presentations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp205',
            slug: 'safety-ethics-cybersecurity-2',
            title: 'Safety, Ethics & Emerging Technologies',
            lessons: [
              { id: 'comp205-1', slug: 'cyber-threats', title: 'Cyber threats (viruses, malware, phishing)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp205-2', slug: 'cyber-safety-rules', title: 'Cyber safety rules', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp205-3', slug: 'digital-citizenship', title: 'Digital citizenship', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'comp301',
            slug: 'advanced-office-tools-3',
            title: 'Word Processing & Office Tools',
            lessons: [
              { id: 'comp301-1', slug: 'mail-merge', title: 'Mail merge and document automation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp301-2', slug: 'charts-graphs-spreadsheets', title: 'Charts and graphs in spreadsheets', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp301-3', slug: 'advanced-formulas', title: 'Applying advanced formulas', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp302',
            slug: 'presentation-database-3',
            title: 'Internet & Communication',
            lessons: [
              { id: 'comp302-1', slug: 'advanced-slide-design', title: 'Advanced slide design', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp302-2', slug: 'intro-databases', title: 'Introduction to databases', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp302-3', slug: 'practical-database-examples', title: 'Practical examples of databases', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp303',
            slug: 'programming-basics-3',
            title: 'Programming Basics & Problem Solving',
            lessons: [
              { id: 'comp303-1', slug: 'algorithms-flowcharts', title: 'Concept of algorithms and flowcharts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp303-2', slug: 'intro-basic-coding', title: 'Introduction to basic coding', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp303-3', slug: 'writing-simple-programs', title: 'Writing simple programs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp304',
            slug: 'internet-elearning-3',
            title: 'Internet & Communication',
            lessons: [
              { id: 'comp304-1', slug: 'advanced-internet-use', title: 'Advanced use of the Internet', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp304-2', slug: 'creating-managing-email', title: 'Creating and managing email accounts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp304-3', slug: 'elearning-platforms', title: 'E-learning platforms', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'comp305',
            slug: 'ict-society-emerging-tech-3',
            title: 'Safety, Ethics & Emerging Technologies',
            lessons: [
              { id: 'comp305-1', slug: 'ict-in-society', title: 'ICT in banking, health, education, and governance', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp305-2', slug: 'emerging-technologies', title: 'Emerging technologies', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp305-3', slug: 'ict-careers', title: 'Preparing for ICT-related careers', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp305-4', slug: 'intellectual-property', title: 'Intellectual property and plagiarism', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp305-5', slug: 'data-privacy', title: 'Data privacy and protection laws in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'comp305-6', slug: 'responsible-social-media-use', title: 'Responsible use of social media', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
    ],
  },
