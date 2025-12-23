import { Globe } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Social Studies Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 7625-7827 from original file
 */

export const socialStudiesSubject: Subject = {
    id: '4',
    slug: 'social-studies',
    name: 'Social Studies',
    icon: Globe,
    description: 'Understand {{country}} culture, history, and governance.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'soc101',
            slug: 'the-environment-1',
            title: 'The Environment',
            lessons: [
              { id: 'soc101-1', slug: 'environment-components', title: 'The environment and its components', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc101-2', slug: 'physical-environment', title: 'Our physical environment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc101-3', slug: 'responsible-use-environment', title: 'Responsible use of the environment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc101-4', slug: 'map-reading-basics', title: 'Map reading basics', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc102',
            slug: 'governance-politics-stability-1',
            title: 'Governance, Politics & Stability',
            lessons: [
              { id: 'soc102-1', slug: 'what-is-society', title: 'What is society? Rules and regulations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc102-2', slug: 'family-unit', title: 'The family as the basic unit of society', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc102-3', slug: 'leadership-authority', title: 'Leadership and authority in the community', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc102-4', slug: 'law-and-order', title: 'Importance of law and order', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc103',
            slug: 'social-economic-development-1',
            title: 'Social & Economic Development',
            lessons: [
              { id: 'soc103-1', slug: 'needs-and-wants', title: 'Human needs and wants', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc103-2', slug: 'production', title: 'Production (farming, fishing, trading, services)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc103-3', slug: 'occupations', title: 'Occupations in our community', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc103-4', slug: 'basic-economic-problems', title: 'Basic economic problems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc104',
            slug: 'culture-national-identity-1',
            title: 'Our Culture & National Identity',
            lessons: [
              { id: 'soc104-1', slug: 'what-is-culture', title: 'What is culture? Elements of culture', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc104-2', slug: 'ghanaian-values', title: 'Ghanaian values and practices', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc104-3', slug: 'festivals-customs', title: 'Festivals, customs, and traditions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc104-4', slug: 'national-symbols', title: 'The importance of national symbols', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc105',
            slug: 'globalisation-international-relations-1',
            title: 'Globalisation & International Relations',
            lessons: [
              { id: 'soc105-1', slug: 'ghana-in-the-world', title: 'Ghana in the world', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc105-2', slug: 'communication-transportation', title: 'Communication and transportation systems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc105-3', slug: 'international-cooperation', title: 'The importance of international cooperation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ];
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'soc201',
            slug: 'the-environment-2',
            title: 'The Environment',
            lessons: [
              { id: 'soc201-1', slug: 'land-use-ghana', title: 'Land use in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc201-2', slug: 'population-distribution', title: 'Population distribution in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc201-3', slug: 'population-growth-problems', title: 'Problems of population growth', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc201-4', slug: 'environmental-challenges', title: 'Environmental challenges', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc202',
            slug: 'governance-politics-stability-2',
            title: 'Governance, Politics & Stability',
            lessons: [
              { id: 'soc202-1', slug: 'pre-colonial-governance', title: 'Pre-colonial systems of governance in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc202-2', slug: 'colonialism-independence', title: 'Colonialism and independence struggle', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc202-3', slug: 'democratic-governance', title: 'Democratic governance in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc202-4', slug: 'human-rights-responsibilities', title: 'Human rights and responsibilities of citizens', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc203',
            slug: 'social-economic-development-2',
            title: 'Social & Economic Development',
            lessons: [
              {
                id: 'soc203-1',
                slug: 'social-economic-development-lesson',
                title: 'Social and Economic Development',
                objectives: ['Define development.', 'Identify indicators of development.', 'Explain factors that promote development.'],
                introduction: 'Development is the process of improving the quality of life for all citizens. It includes social, economic, and political progress.',
                keyConcepts: [
                    { title: 'Economic Development', content: 'Refers to the growth of a country\'s economy, often measured by GDP, industrialization, and employment rates.' },
                    { title: 'Social Development', content: 'Focuses on improving social well-being, including education, healthcare, and access to basic amenities.' },
                ],
                activities: { type: 'quiz', questions: [] },
                pastQuestions: [
                    { question: 'Name one indicator of social development.', solution: 'An indicator of social development is the literacy rate of a country.' },
                ],
                summary: 'Development involves both economic growth and social well-being. It is measured by indicators like GDP, literacy rate, and life expectancy.'
              },
              { id: 'soc203-2', slug: 'forms-of-production', title: 'Forms of production', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc203-3', slug: 'factors-of-production', title: 'Factors of production', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc203-4', slug: 'money-and-banking', title: 'Money and banking in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc203-5', slug: 'savings-investments', title: 'Importance of savings and investments', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc204',
            slug: 'culture-national-identity-2',
            title: 'Our Culture & National Identity',
            lessons: [
              { id: 'soc204-1', slug: 'ethnic-groups-diversity', title: 'Ghana\'s ethnic groups and cultural diversity', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc204-2', slug: 'unity-in-diversity', title: 'Unity in diversity', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc204-3', slug: 'civic-responsibility-patriotism', title: 'Civic responsibility and patriotism', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc204-4', slug: 'role-of-religion', title: 'The role of religion in promoting national identity', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc205',
            slug: 'globalisation-international-relations-2',
            title: 'Globalisation & International Relations',
            lessons: [
              { id: 'soc205-1', slug: 'international-trade', title: 'International trade', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc205-2', slug: 'ghana-international-organisations', title: 'Ghana and international organisations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc205-3', slug: 'globalisation-effects', title: 'Globalisation and its effects on Ghanaian society', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ];
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'soc301',
            slug: 'the-environment-3',
            title: 'The Environment',
            lessons: [
              { id: 'soc301-1', slug: 'natural-resources-ghana', title: 'Natural resources of Ghana and their uses', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc301-2', slug: 'resource-management', title: 'Resource management and sustainable development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc301-3', slug: 'climate-change-global-warming', title: 'Climate change and global warming', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc301-4', slug: 'disaster-management', title: 'Disaster management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc302',
            slug: 'governance-politics-stability-3',
            title: 'Governance, Politics & Stability',
            lessons: [
              { id: 'soc302-1', slug: 'constitution-of-ghana', title: 'The Constitution of Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc302-2', slug: 'structure-of-government', title: 'Structure of government', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc302-3', slug: 'decentralisation-local-governance', title: 'Decentralisation and local governance', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc302-4', slug: 'national-security-stability', title: 'National security and stability', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc303',
            slug: 'social-economic-development-3',
            title: 'Social & Economic Development',
            lessons: [
              { id: 'soc303-1', slug: 'entrepreneurship-job-creation', title: 'Entrepreneurship and job creation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc303-2', slug: 'national-development', title: 'National development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc303-3', slug: 'problems-of-development', title: 'Problems of development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc303-4', slug: 'science-technology-development', title: 'The role of science and technology in development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc304',
            slug: 'culture-national-identity-3',
            title: 'Our Culture & National Identity',
            lessons: [
              { id: 'soc304-1', slug: 'cultural-change-modernization', title: 'Cultural change and modernization', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc304-2', slug: 'cultural-heritage-tourism', title: 'Cultural heritage and tourism in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc304-3', slug: 'education-cultural-development', title: 'The role of education in cultural development', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc304-4', slug: 'national-integration-unity', title: 'National integration and unity', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'soc305',
            slug: 'globalisation-international-relations-3',
            title: 'Globalisation & International Relations',
            lessons: [
              { id: 'soc305-1', slug: 'global-citizenship', title: 'Global citizenship and responsibilities', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc305-2', slug: 'international-conflicts-peacekeeping', title: 'International conflicts and Ghana\'s role in peacekeeping', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc305-3', slug: 'global-issues', title: 'Global issues', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'soc305-4', slug: 'preparing-for-globalised-world', title: 'Preparing for life in a globalised world', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ];
      },
    ],
  },
