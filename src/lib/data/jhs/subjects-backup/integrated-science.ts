import { FlaskConical } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Integrated Science Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 7426-7624 from original file
 */

export const integratedScienceSubject: Subject = {
    id: '3',
    slug: 'integrated-science',
    name: 'Science ({{country:ghana=Integrated Science|nigeria=Basic Science|default=Basic Science}})',
    icon: FlaskConical,
    description: 'Explore biology, chemistry, and physics concepts.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'sci101',
            slug: 'diversity-of-matter-1',
            title: 'Diversity of Matter',
            lessons: [
              { id: 'sci101-1', slug: 'nature-of-science', title: 'Nature of Science', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci101-2', slug: 'matter-states', title: 'Matter and Its States', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci101-3', slug: 'physical-chemical-changes', title: 'Physical and Chemical Changes', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci101-4', slug: 'elements-compounds-mixtures', title: 'Elements, Compounds, and Mixtures', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci102',
            slug: 'cycles-1',
            title: 'Cycles',
            lessons: [
              { id: 'sci102-1', slug: 'water-cycle', title: 'The Water Cycle', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci102-2', slug: 'life-cycles', title: 'Life Cycles of Living Things', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci102-3', slug: 'day-night-seasons', title: 'Day and Night; Seasons', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci103',
            slug: 'systems-1',
            title: 'Systems',
            lessons: [
              { id: 'sci103-1', slug: 'human-body-systems', title: 'The Human Body: Organs and Systems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci103-2', slug: 'plants-functions', title: 'Plants: Parts and Functions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci103-3', slug: 'soil-composition', title: 'Soil Composition and Importance', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci103-4', slug: 'ecosystems', title: 'Ecosystems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci104',
            slug: 'forces-energy-1',
            title: 'Forces & Energy',
            lessons: [
              { id: 'sci104-1', slug: 'types-of-forces', title: 'Types of Forces', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci104-2', slug: 'work-energy-power', title: 'Work, Energy, and Power', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci104-3', slug: 'light-shadows', title: 'Light and Shadows', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci104-4', slug: 'heat-temperature', title: 'Heat and Temperature', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci105',
            slug: 'human-env-sustainability-1',
            title: 'Human & Environmental Sustainability',
            lessons: [
              { id: 'sci105-1', slug: 'sanitation-hygiene', title: 'Sanitation and Personal Hygiene', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci105-2', slug: 'waste-management', title: 'Environmental Cleanliness and Waste Management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci105-3', slug: 'resources', title: 'Renewable and Non-renewable Resources', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'sci201',
            slug: 'diversity-of-matter-2',
            title: 'Diversity of Matter',
            lessons: [
              { id: 'sci201-1', slug: 'atoms-molecules', title: 'Atoms, Molecules, and Particles', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci201-2', slug: 'separation-of-mixtures', title: 'Separation of Mixtures', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci201-3', slug: 'acids-bases-salts', title: 'Acids, Bases, and Salts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci202',
            slug: 'cycles-2',
            title: 'Cycles',
            lessons: [
              { id: 'sci202-1', slug: 'carbon-cycle', title: 'Carbon Cycle', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci202-2', slug: 'nitrogen-cycle', title: 'Nitrogen Cycle', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              {
                id: 'sci202-3',
                slug: 'photosynthesis-respiration',
                title: 'Photosynthesis and Respiration',
                objectives: ['Define photosynthesis.', 'List the requirements for photosynthesis.', 'Write the chemical equation for photosynthesis.'],
                introduction: 'Photosynthesis is the amazing process that allows plants to make their own food using sunlight. It is essential for life on Earth.',
                keyConcepts: [
                    { title: 'Definition', content: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment.' },
                    { title: 'Requirements', content: 'The main requirements are sunlight, water, carbon dioxide, and chlorophyll.' },
                ],
                activities: { type: 'quiz', questions: [] },
                pastQuestions: [
                    { question: 'What gas is released during photosynthesis?', solution: 'Oxygen is released as a byproduct of photosynthesis.' },
                ],
                summary: 'Plants use sunlight, water, and carbon dioxide to create their food (glucose) and release oxygen through a process called photosynthesis.'
              },
            ],
          },
          {
            id: 'sci203',
            slug: 'systems-2',
            title: 'Systems',
            lessons: [
              { id: 'sci203-1', slug: 'circulatory-respiratory', title: 'Circulatory and Respiratory Systems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci203-2', slug: 'excretory-system', title: 'Excretory System', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci203-3', slug: 'reproduction', title: 'Reproduction in Plants and Animals', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci203-4', slug: 'food-chains-webs', title: 'Food Chains and Food Webs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci203-5', slug: 'soil-fertility', title: 'Soil Fertility and Conservation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci204',
            slug: 'forces-energy-2',
            title: 'Forces & Energy',
            lessons: [
              { id: 'sci204-1', slug: 'simple-machines', title: 'Simple Machines', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci204-2', slug: 'pressure', title: 'Pressure in Liquids and Gases', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci204-3', slug: 'heat-transfer', title: 'Heat Transfer', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci204-4', slug: 'electricity-magnetism', title: 'Electricity and Magnetism', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci205',
            slug: 'human-env-sustainability-2',
            title: 'Human & Environmental Sustainability',
            lessons: [
              { id: 'sci205-1', slug: 'conservation', title: 'Conservation of Natural Resources', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci205-2', slug: 'pollution', title: 'Pollution', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci205-3', slug: 'climate-change', title: 'Climate Change', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'sci301',
            slug: 'diversity-of-matter-3',
            title: 'Diversity of Matter',
            lessons: [
              { id: 'sci301-1', slug: 'atomic-structure', title: 'Atomic Structure', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci301-2', slug: 'periodic-table', title: 'Periodic Table', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci301-3', slug: 'chemical-reactions', title: 'Chemical Reactions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci302',
            slug: 'cycles-3',
            title: 'Cycles',
            lessons: [
              { id: 'sci302-1', slug: 'water-purification', title: 'Water Purification Methods', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci302-2', slug: 'reproduction-humans', title: 'Reproduction and Growth in Humans', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci302-3', slug: 'heredity-variation', title: 'Heredity and Variation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci303',
            slug: 'systems-3',
            title: 'Systems',
            lessons: [
              { id: 'sci303-1', slug: 'skeletal-muscular', title: 'Skeletal and Muscular Systems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci03-2', slug: 'nervous-system', title: 'Nervous System', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci303-3', slug: 'circulatory-advanced', title: 'Circulatory System (Advanced)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci303-4', slug: 'plant-nutrition-transport', title: 'Plant Nutrition and Transport System', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci304',
            slug: 'forces-energy-3',
            title: 'Forces & Energy',
            lessons: [
              { id: 'sci304-1', slug: 'work-energy-machines-advanced', title: 'Work, Energy, and Machines (Advanced)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci304-2', slug: 'waves-sound', title: 'Waves and Sound', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci304-3', slug: 'light-advanced', title: 'Light (Reflection, Refraction, Lenses)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci304-4', slug: 'electricity-advanced', title: 'Electricity (Ohm\'s Law, Circuits)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci304-5', slug: 'solar-energy', title: 'Solar Energy and Renewable Technologies', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'sci305',
            slug: 'human-env-sustainability-3',
            title: 'Human & Environmental Sustainability',
            lessons: [
              { id: 'sci305-1', slug: 'health-diseases', title: 'Health and Diseases', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci305-2', slug: 'first-aid-drug-abuse', title: 'First Aid and Drug Use/Abuse', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci305-3', slug: 'population-environment', title: 'Population and Its Effect on the Environment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'sci305-4', slug: 'sustainable-development', title: 'Sustainable Development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
    ],
  },
