// Primary School Data for Ghana Education Service Curriculum
import type { Lesson, Topic } from '@/lib/types';
import {
  Book,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
} from 'lucide-react';

interface PrimaryTopic extends Topic {
  gradeLevel: string;
}

interface PrimarySubject {
  id: string;
  slug: string;
  name: string;
  icon: any;
  description: string;
  topics: PrimaryTopic[];
}

export const primarySubjects: PrimarySubject[] = [
  {
    id: 'primary-english',
    slug: 'english',
    name: 'English Language',
    icon: Book,
    description: 'Reading, Writing, and Communication',
    topics: [
      {
        id: 'eng-p1-1',
        slug: 'alphabet',
        title: 'Alphabet & Phonics',
        gradeLevel: 'Class 1',
        lessons: [
          {
            id: 'eng-p1-1-1',
            slug: 'alphabets',
            title: 'Learning the Alphabets',
            objectives: ['Recognize letters A-Z', 'Write letters correctly', 'Know letter sounds'],
            introduction: 'The alphabet has 26 letters. Let us learn them!',
            keyConcepts: [
              { title: 'ABC Song', content: 'A-B-C-D-E-F-G, H-I-J-K-L-M-N-O-P, Q-R-S-T-U-V, W-X-Y-Z' },
              { title: 'Letter Sounds', content: 'A says /a/ as in apple, B says /b/ as in ball' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You learned all 26 letters!',
          },
        ],
      },
      {
        id: 'eng-p2-1',
        slug: 'reading',
        title: 'Reading Simple Words',
        gradeLevel: 'Class 2',
        lessons: [
          {
            id: 'eng-p2-1-1',
            slug: 'simple-words',
            title: 'Reading Simple Words',
            objectives: ['Read 3-letter words', 'Blend sounds together'],
            introduction: 'Let us learn to read simple words!',
            keyConcepts: [
              { title: 'CVC Words', content: 'cat, dog, mat, pen, sun' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can read simple words now!',
          },
        ],
      },
      {
        id: 'eng-p3-1',
        slug: 'grammar',
        title: 'Basic Grammar',
        gradeLevel: 'Class 3',
        lessons: [
          {
            id: 'eng-p3-1-1',
            slug: 'nouns',
            title: 'Nouns',
            objectives: ['Identify nouns', 'Use nouns in sentences'],
            introduction: 'Nouns are naming words!',
            keyConcepts: [
              { title: 'What are Nouns?', content: 'Nouns name people, places, animals, things. Examples: boy, school, cat, book' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Nouns are naming words!',
          },
        ],
      },
      {
        id: 'eng-p4-1',
        slug: 'writing',
        title: 'Writing Sentences',
        gradeLevel: 'Class 4',
        lessons: [
          {
            id: 'eng-p4-1-1',
            slug: 'sentences',
            title: 'Complete Sentences',
            objectives: ['Write complete sentences', 'Use capital letters and full stops', 'Join ideas with conjunctions'],
            introduction: 'A sentence expresses a complete thought!',
            keyConcepts: [
              { title: 'Sentence Structure', content: 'A sentence starts with a capital letter and ends with a full stop. Example: The girl plays football.' },
              { title: 'Conjunctions', content: 'Words like and, but, or join sentences. Example: I like rice and beans.' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can write complete sentences!',
          },
          {
            id: 'eng-p4-1-2',
            slug: 'verbs',
            title: 'Action Words (Verbs)',
            objectives: ['Identify verbs', 'Use verbs in sentences'],
            introduction: 'Verbs are action words!',
            keyConcepts: [
              { title: 'What are Verbs?', content: 'Verbs show action: run, jump, eat, sleep, play, write' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Verbs show what we do!',
          },
        ],
      },
      {
        id: 'eng-p5-1',
        slug: 'comprehension',
        title: 'Reading Comprehension',
        gradeLevel: 'Class 5',
        lessons: [
          {
            id: 'eng-p5-1-1',
            slug: 'reading-passages',
            title: 'Understanding Stories',
            objectives: ['Read and understand passages', 'Answer questions about text', 'Identify main ideas'],
            introduction: 'Let us read and understand stories!',
            keyConcepts: [
              { title: 'Main Idea', content: 'The main idea tells what the story is about' },
              { title: 'Details', content: 'Details give more information about the main idea' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can understand what you read!',
          },
          {
            id: 'eng-p5-1-2',
            slug: 'adjectives',
            title: 'Describing Words (Adjectives)',
            objectives: ['Identify adjectives', 'Use adjectives to describe'],
            introduction: 'Adjectives describe nouns!',
            keyConcepts: [
              { title: 'Adjectives', content: 'big, small, beautiful, red, happy, tall, short' },
              { title: 'Examples', content: 'The big dog. A red car. Happy children.' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Adjectives make sentences interesting!',
          },
        ],
      },
      {
        id: 'eng-p6-1',
        slug: 'composition',
        title: 'Essay Writing',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'eng-p6-1-1',
            slug: 'paragraphs',
            title: 'Writing Paragraphs',
            objectives: ['Write organized paragraphs', 'Use topic sentences', 'Develop ideas'],
            introduction: 'A paragraph is a group of sentences about one idea!',
            keyConcepts: [
              { title: 'Paragraph Structure', content: 'Topic sentence + Supporting sentences + Concluding sentence' },
              { title: 'Unity', content: 'All sentences in a paragraph should relate to one main idea' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can write good paragraphs!',
          },
          {
            id: 'eng-p6-1-2',
            slug: 'letter-writing',
            title: 'Formal and Informal Letters',
            objectives: ['Write formal letters', 'Write informal letters', 'Use proper letter format'],
            introduction: 'Letters help us communicate!',
            keyConcepts: [
              { title: 'Formal Letters', content: 'Business letters, letters to schools. Use: Dear Sir/Madam, Yours faithfully' },
              { title: 'Informal Letters', content: 'Letters to friends and family. Use: Dear Friend, Love from' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can write different types of letters!',
          },
        ],
      },
    ],
  },
  {
    id: 'primary-math',
    slug: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    description: 'Numbers and Problem Solving',
    topics: [
      {
        id: 'math-p1-1',
        slug: 'counting',
        title: 'Counting 1-10',
        gradeLevel: 'Class 1',
        lessons: [
          {
            id: 'math-p1-1-1',
            slug: 'numbers-1-10',
            title: 'Numbers 1 to 10',
            objectives: ['Count from 1 to 10', 'Write numbers 1-10'],
            introduction: 'Let us learn to count!',
            keyConcepts: [
              { title: 'Counting', content: 'One (1), Two (2), Three (3), Four (4), Five (5)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can count 1 to 10!',
          },
        ],
      },
      {
        id: 'math-p2-1',
        slug: 'addition',
        title: 'Simple Addition',
        gradeLevel: 'Class 2',
        lessons: [
          {
            id: 'math-p2-1-1',
            slug: 'adding',
            title: 'Adding Numbers',
            objectives: ['Add numbers up to 10', 'Use + symbol'],
            introduction: 'Addition means putting together!',
            keyConcepts: [
              { title: 'Addition', content: '2 + 3 = 5, 1 + 1 = 2, 4 + 2 = 6' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can add numbers!',
          },
        ],
      },
      {
        id: 'math-p3-1',
        slug: 'multiplication',
        title: 'Times Tables',
        gradeLevel: 'Class 3',
        lessons: [
          {
            id: 'math-p3-1-1',
            slug: 'times-2',
            title: '2 Times Table',
            objectives: ['Learn 2 times table', 'Multiply by 2'],
            introduction: 'Let us learn the 2 times table!',
            keyConcepts: [
              { title: '2 Times', content: '2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You know the 2 times table!',
          },
        ],
      },
      {
        id: 'math-p4-1',
        slug: 'division',
        title: 'Simple Division',
        gradeLevel: 'Class 4',
        lessons: [
          {
            id: 'math-p4-1-1',
            slug: 'sharing',
            title: 'Sharing Equally',
            objectives: ['Understand division', 'Divide numbers'],
            introduction: 'Division is sharing equally!',
            keyConcepts: [
              { title: 'Division', content: '6÷2=3, 10÷5=2, 8÷4=2' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can divide numbers!',
          },
          {
            id: 'math-p4-1-2',
            slug: 'fractions',
            title: 'Introduction to Fractions',
            objectives: ['Understand half and quarter', 'Identify fractions'],
            introduction: 'Fractions show parts of a whole!',
            keyConcepts: [
              { title: 'Fractions', content: '1/2 is one half, 1/4 is one quarter' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Fractions show parts!',
          },
        ],
      },
      {
        id: 'math-p5-1',
        slug: 'decimals',
        title: 'Decimals',
        gradeLevel: 'Class 5',
        lessons: [
          {
            id: 'math-p5-1-1',
            slug: 'decimal-numbers',
            title: 'Understanding Decimals',
            objectives: ['Read decimal numbers', 'Add and subtract decimals', 'Convert fractions to decimals'],
            introduction: 'Decimals are another way to show parts!',
            keyConcepts: [
              { title: 'Decimal Place Value', content: '0.5 = 5 tenths, 0.25 = 25 hundredths' },
              { title: 'Money', content: 'GH₵1.50 means 1 cedi and 50 pesewas' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Decimals help us with money!',
          },
          {
            id: 'math-p5-1-2',
            slug: 'measurement',
            title: 'Measurement',
            objectives: ['Measure length', 'Measure weight', 'Measure capacity'],
            introduction: 'We measure things every day!',
            keyConcepts: [
              { title: 'Units', content: 'Length: cm, m, km. Weight: g, kg. Capacity: ml, l' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Measurement helps us in daily life!',
          },
        ],
      },
      {
        id: 'math-p6-1',
        slug: 'geometry',
        title: 'Geometry & Angles',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'math-p6-1-1',
            slug: 'angles',
            title: 'Types of Angles',
            objectives: ['Identify angles', 'Measure angles', 'Name angle types'],
            introduction: 'Angles are everywhere!',
            keyConcepts: [
              { title: 'Angle Types', content: 'Acute (less than 90°), Right (90°), Obtuse (more than 90°)' },
              { title: 'Measuring', content: 'We use a protractor to measure angles' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can identify and measure angles!',
          },
          {
            id: 'math-p6-1-2',
            slug: 'percentages',
            title: 'Percentages',
            objectives: ['Understand percentages', 'Calculate percentages', 'Solve percentage problems'],
            introduction: 'Percentages show parts out of 100!',
            keyConcepts: [
              { title: 'Percentage', content: '50% = 50 out of 100 = half' },
              { title: 'Examples', content: '25% = quarter, 75% = three quarters, 100% = whole' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Percentages are useful in real life!',
          },
        ],
      },
      {
        id: 'math-p6-2',
        slug: 'algebra',
        title: 'Introduction to Algebra',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'math-p6-2-1',
            slug: 'simple-equations',
            title: 'Simple Equations',
            objectives: ['Solve simple equations', 'Find unknown numbers', 'Use letters in math'],
            introduction: 'Algebra uses letters to represent numbers!',
            keyConcepts: [
              { title: 'Equations', content: 'x + 5 = 10, so x = 5' },
              { title: 'Variables', content: 'Letters like x, y, a, b stand for unknown numbers' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can solve simple equations!',
          },
        ],
      },
    ],
  },
  {
    id: 'primary-science',
    slug: 'science',
    name: 'Science',
    icon: FlaskConical,
    description: 'Exploring Our World',
    topics: [
      {
        id: 'sci-p1-1',
        slug: 'senses',
        title: 'Our Five Senses',
        gradeLevel: 'Class 1',
        lessons: [
          {
            id: 'sci-p1-1-1',
            slug: 'five-senses',
            title: 'The Five Senses',
            objectives: ['Name the five senses', 'Identify body parts'],
            introduction: 'We use our senses to learn!',
            keyConcepts: [
              { title: 'Senses', content: 'Sight-Eyes, Hearing-Ears, Smell-Nose, Taste-Tongue, Touch-Skin' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'We have five senses!',
          },
        ],
      },
      {
        id: 'sci-p2-1',
        slug: 'living-things',
        title: 'Living Things',
        gradeLevel: 'Class 2',
        lessons: [
          {
            id: 'sci-p2-1-1',
            slug: 'living-non-living',
            title: 'Living and Non-Living',
            objectives: ['Identify living things', 'Know characteristics'],
            introduction: 'Living things grow and move!',
            keyConcepts: [
              { title: 'Living Things', content: 'They grow, need food, breathe, move. Examples: plants, animals, people' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Living things need food and water!',
          },
        ],
      },
      {
        id: 'sci-p3-1',
        slug: 'water',
        title: 'Water',
        gradeLevel: 'Class 3',
        lessons: [
          {
            id: 'sci-p3-1-1',
            slug: 'uses-water',
            title: 'Uses of Water',
            objectives: ['List uses of water', 'Save water'],
            introduction: 'Water is very important!',
            keyConcepts: [
              { title: 'Water Uses', content: 'Drinking, cooking, bathing, washing, watering plants' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'We need water every day!',
          },
          {
            id: 'sci-p3-1-2',
            slug: 'plants',
            title: 'Parts of a Plant',
            objectives: ['Name plant parts', 'Know their functions'],
            introduction: 'Plants have different parts!',
            keyConcepts: [
              { title: 'Plant Parts', content: 'Roots (absorb water), Stem (supports), Leaves (make food), Flowers (reproduce)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Each plant part has a job!',
          },
        ],
      },
      {
        id: 'sci-p4-1',
        slug: 'animals',
        title: 'Animals',
        gradeLevel: 'Class 4',
        lessons: [
          {
            id: 'sci-p4-1-1',
            slug: 'animal-groups',
            title: 'Groups of Animals',
            objectives: ['Classify animals', 'Know animal characteristics'],
            introduction: 'Animals can be grouped!',
            keyConcepts: [
              { title: 'Mammals', content: 'Have fur, feed milk to babies. Examples: cow, goat, human' },
              { title: 'Birds', content: 'Have feathers and wings, lay eggs. Examples: hen, eagle' },
              { title: 'Fish', content: 'Live in water, have scales. Examples: tilapia' },
              { title: 'Insects', content: 'Have 6 legs. Examples: butterfly, ant' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Animals belong to different groups!',
          },
          {
            id: 'sci-p4-1-2',
            slug: 'matter',
            title: 'States of Matter',
            objectives: ['Identify solid, liquid, gas', 'Give examples'],
            introduction: 'Everything is made of matter!',
            keyConcepts: [
              { title: 'States', content: 'Solid (ice, rock), Liquid (water, oil), Gas (air, steam)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Matter has three states!',
          },
        ],
      },
      {
        id: 'sci-p5-1',
        slug: 'energy',
        title: 'Energy',
        gradeLevel: 'Class 5',
        lessons: [
          {
            id: 'sci-p5-1-1',
            slug: 'forms-energy',
            title: 'Forms of Energy',
            objectives: ['Identify forms of energy', 'Know sources of energy'],
            introduction: 'Energy makes things work!',
            keyConcepts: [
              { title: 'Forms', content: 'Light, heat, sound, electrical, solar' },
              { title: 'Sources', content: 'Sun, food, batteries, fuels' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Energy comes in many forms!',
          },
          {
            id: 'sci-p5-1-2',
            slug: 'human-body',
            title: 'The Human Body',
            objectives: ['Name body systems', 'Understand their functions'],
            introduction: 'Our body is amazing!',
            keyConcepts: [
              { title: 'Systems', content: 'Digestive (breaks down food), Circulatory (pumps blood), Respiratory (breathing)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Body systems work together!',
          },
        ],
      },
      {
        id: 'sci-p6-1',
        slug: 'environment',
        title: 'The Environment',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'sci-p6-1-1',
            slug: 'ecosystems',
            title: 'Ecosystems',
            objectives: ['Understand ecosystems', 'Know food chains'],
            introduction: 'Living things depend on each other!',
            keyConcepts: [
              { title: 'Ecosystem', content: 'Living and non-living things interacting together' },
              { title: 'Food Chain', content: 'Grass → Grasshopper → Bird → Snake' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Everything in nature is connected!',
          },
          {
            id: 'sci-p6-1-2',
            slug: 'electricity',
            title: 'Electricity',
            objectives: ['Understand electricity', 'Use electricity safely'],
            introduction: 'Electricity powers many things!',
            keyConcepts: [
              { title: 'Circuit', content: 'A complete path for electricity to flow' },
              { title: 'Safety', content: 'Never touch wires, keep water away from sockets' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Use electricity safely!',
          },
        ],
      },
    ],
  },
  {
    id: 'primary-social',
    slug: 'social-studies',
    name: 'Social Studies',
    icon: Globe,
    description: 'Our Community and Country',
    topics: [
      {
        id: 'social-p1-1',
        slug: 'family',
        title: 'My Family',
        gradeLevel: 'Class 1',
        lessons: [
          {
            id: 'social-p1-1-1',
            slug: 'family-members',
            title: 'Family Members',
            objectives: ['Name family members', 'Show love'],
            introduction: 'Family members love us!',
            keyConcepts: [
              { title: 'Family', content: 'Father, Mother, Brother, Sister, Grandfather, Grandmother' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'We love our families!',
          },
        ],
      },
      {
        id: 'social-p2-1',
        slug: 'school',
        title: 'Our School',
        gradeLevel: 'Class 2',
        lessons: [
          {
            id: 'social-p2-1-1',
            slug: 'school-people',
            title: 'People in School',
            objectives: ['Name school workers', 'Respect them'],
            introduction: 'Many people help us in school!',
            keyConcepts: [
              { title: 'School Workers', content: 'Headteacher, Teachers, Cooks, Cleaners' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'School workers help us learn!',
          },
        ],
      },
      {
        id: 'social-p3-1',
        slug: 'community',
        title: 'Our Community',
        gradeLevel: 'Class 3',
        lessons: [
          {
            id: 'social-p3-1-1',
            slug: 'helpers',
            title: 'Community Helpers',
            objectives: ['Name helpers', 'Know their jobs'],
            introduction: 'Helpers make our community better!',
            keyConcepts: [
              { title: 'Helpers', content: 'Doctor, Police, Firefighter, Farmer, Teacher' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Community helpers keep us safe!',
          },
        ],
      },
      {
        id: 'social-p4-1',
        slug: 'ghana',
        title: 'Ghana Our Country',
        gradeLevel: 'Class 4',
        lessons: [
          {
            id: 'social-p4-1-1',
            slug: 'about-ghana',
            title: 'About Ghana',
            objectives: ['Know Ghana facts', 'Be proud'],
            introduction: 'Ghana is our country!',
            keyConcepts: [
              { title: 'Ghana', content: 'Capital: Accra. Independence: March 6, 1957. Colors: Red, Gold, Green' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'We are proud Ghanaians!',
          },
          {
            id: 'social-p4-1-2',
            slug: 'regions',
            title: 'Regions of Ghana',
            objectives: ['Name the 16 regions', 'Know regional capitals'],
            introduction: 'Ghana has 16 regions!',
            keyConcepts: [
              { title: 'Some Regions', content: 'Greater Accra (Accra), Ashanti (Kumasi), Northern (Tamale), Western (Sekondi-Takoradi)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Ghana has 16 beautiful regions!',
          },
        ],
      },
      {
        id: 'social-p5-1',
        slug: 'history',
        title: 'Ghana\'s History',
        gradeLevel: 'Class 5',
        lessons: [
          {
            id: 'social-p5-1-1',
            slug: 'independence',
            title: 'Ghana\'s Independence',
            objectives: ['Know independence story', 'Recognize national heroes'],
            introduction: 'Ghana was the first African country to gain independence!',
            keyConcepts: [
              { title: 'Independence Day', content: 'March 6, 1957. Dr. Kwame Nkrumah led Ghana to freedom' },
              { title: 'National Heroes', content: 'The Big Six: Kwame Nkrumah, J.B. Danquah, Edward Akufo-Addo, Ebenezer Ako-Adjei, Emmanuel Obetsebi-Lamptey, William Ofori Atta' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Ghana gained independence in 1957!',
          },
          {
            id: 'social-p5-1-2',
            slug: 'culture',
            title: 'Ghanaian Culture',
            objectives: ['Know traditional festivals', 'Understand cultural practices'],
            introduction: 'Ghana has rich culture!',
            keyConcepts: [
              { title: 'Festivals', content: 'Homowo (Ga), Aboakyir (Winneba), Odwira (Akuapem), Hogbetsotso (Anlo)' },
              { title: 'Cultural Values', content: 'Respect for elders, hospitality, communal living' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Ghanaian culture is beautiful!',
          },
        ],
      },
      {
        id: 'social-p6-1',
        slug: 'government',
        title: 'Government & Leadership',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'social-p6-1-1',
            slug: 'democracy',
            title: 'Democracy in Ghana',
            objectives: ['Understand democracy', 'Know government structure'],
            introduction: 'Ghana is a democratic country!',
            keyConcepts: [
              { title: 'Democracy', content: 'Government by the people. Citizens vote to choose leaders' },
              { title: 'Government Arms', content: 'Executive (President), Legislature (Parliament), Judiciary (Courts)' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Democracy gives people power!',
          },
          {
            id: 'social-p6-1-2',
            slug: 'rights',
            title: 'Rights and Responsibilities',
            objectives: ['Know children\'s rights', 'Understand responsibilities'],
            introduction: 'We all have rights and responsibilities!',
            keyConcepts: [
              { title: 'Children\'s Rights', content: 'Right to education, healthcare, protection, play' },
              { title: 'Responsibilities', content: 'Obey laws, respect others, study hard, help at home' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Rights come with responsibilities!',
          },
        ],
      },
      {
        id: 'social-p6-2',
        slug: 'economy',
        title: 'Ghana\'s Economy',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'social-p6-2-1',
            slug: 'economic-activities',
            title: 'Economic Activities',
            objectives: ['Know types of economic activities', 'Understand occupations'],
            introduction: 'People work to earn a living!',
            keyConcepts: [
              { title: 'Primary Activities', content: 'Farming, fishing, mining (cocoa, gold, oil)' },
              { title: 'Secondary Activities', content: 'Manufacturing, processing' },
              { title: 'Tertiary Activities', content: 'Trading, teaching, banking' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Ghana has a diverse economy!',
          },
        ],
      },
    ],
  },
  {
    id: 'primary-arts',
    slug: 'creative-arts',
    name: 'Creative Arts',
    icon: Palette,
    description: 'Drawing, Music, and Crafts',
    topics: [
      {
        id: 'arts-p1-1',
        slug: 'colors',
        title: 'Colors',
        gradeLevel: 'Class 1',
        lessons: [
          {
            id: 'arts-p1-1-1',
            slug: 'basic-colors',
            title: 'Basic Colors',
            objectives: ['Name colors', 'Identify colors'],
            introduction: 'Colors are beautiful!',
            keyConcepts: [
              { title: 'Colors', content: 'Red, Yellow, Blue, Green, Orange, Purple' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Colors make our world bright!',
          },
        ],
      },
      {
        id: 'arts-p2-1',
        slug: 'shapes',
        title: 'Shapes',
        gradeLevel: 'Class 2',
        lessons: [
          {
            id: 'arts-p2-1-1',
            slug: 'basic-shapes',
            title: 'Basic Shapes',
            objectives: ['Draw shapes', 'Name shapes'],
            introduction: 'Let us learn shapes!',
            keyConcepts: [
              { title: 'Shapes', content: 'Circle, Square, Triangle, Rectangle' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Shapes are everywhere!',
          },
          {
            id: 'arts-p2-1-2',
            slug: 'songs',
            title: 'Simple Songs',
            objectives: ['Sing simple songs', 'Learn rhythm'],
            introduction: 'Music is fun!',
            keyConcepts: [
              { title: 'Songs', content: 'Twinkle Twinkle Little Star, If You\'re Happy and You Know It' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Singing makes us happy!',
          },
        ],
      },
      {
        id: 'arts-p3-1',
        slug: 'drawing',
        title: 'Drawing',
        gradeLevel: 'Class 3',
        lessons: [
          {
            id: 'arts-p3-1-1',
            slug: 'nature-drawing',
            title: 'Drawing from Nature',
            objectives: ['Draw plants and animals', 'Observe nature'],
            introduction: 'Nature is beautiful to draw!',
            keyConcepts: [
              { title: 'Drawing', content: 'Draw trees, flowers, birds, butterflies' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can draw nature!',
          },
        ],
      },
      {
        id: 'arts-p4-1',
        slug: 'crafts',
        title: 'Arts and Crafts',
        gradeLevel: 'Class 4',
        lessons: [
          {
            id: 'arts-p4-1-1',
            slug: 'paper-crafts',
            title: 'Paper Crafts',
            objectives: ['Make paper crafts', 'Cut and fold paper'],
            introduction: 'Let us create with paper!',
            keyConcepts: [
              { title: 'Crafts', content: 'Paper folding, cutting, pasting. Make cards, flowers, animals' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Paper crafts are creative!',
          },
          {
            id: 'arts-p4-1-2',
            slug: 'drumming',
            title: 'Traditional Drumming',
            objectives: ['Know traditional drums', 'Learn simple beats'],
            introduction: 'Drums are important in Ghana!',
            keyConcepts: [
              { title: 'Drums', content: 'Talking drum, Fontomfrom, Atumpan, Kpanlogo' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Drumming is part of our culture!',
          },
        ],
      },
      {
        id: 'arts-p5-1',
        slug: 'painting',
        title: 'Painting',
        gradeLevel: 'Class 5',
        lessons: [
          {
            id: 'arts-p5-1-1',
            slug: 'color-mixing',
            title: 'Mixing Colors',
            objectives: ['Mix primary colors', 'Create secondary colors'],
            introduction: 'Let us mix colors!',
            keyConcepts: [
              { title: 'Primary Colors', content: 'Red, Yellow, Blue cannot be made by mixing' },
              { title: 'Secondary Colors', content: 'Red + Yellow = Orange, Blue + Yellow = Green, Red + Blue = Purple' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'You can create new colors!',
          },
          {
            id: 'arts-p5-1-2',
            slug: 'drama',
            title: 'Drama and Acting',
            objectives: ['Perform simple plays', 'Express emotions'],
            introduction: 'Drama tells stories!',
            keyConcepts: [
              { title: 'Drama', content: 'Use voice, body, and emotions to act out stories' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Drama is fun and expressive!',
          },
        ],
      },
      {
        id: 'arts-p6-1',
        slug: 'adinkra',
        title: 'Adinkra Symbols',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'arts-p6-1-1',
            slug: 'symbols',
            title: 'Adinkra Symbols',
            objectives: ['Know Adinkra symbols', 'Understand their meanings', 'Draw symbols'],
            introduction: 'Adinkra symbols tell our stories!',
            keyConcepts: [
              { title: 'Famous Symbols', content: 'Gye Nyame (except God), Sankofa (learn from the past), Dwennimmen (ram\'s horns - strength)' },
              { title: 'Uses', content: 'On cloth, pottery, architecture, jewelry' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Adinkra symbols are part of our heritage!',
          },
        ],
      },
      {
        id: 'arts-p6-2',
        slug: 'kente',
        title: 'Kente Weaving',
        gradeLevel: 'Class 6',
        lessons: [
          {
            id: 'arts-p6-2-1',
            slug: 'kente-patterns',
            title: 'Kente Cloth',
            objectives: ['Know about Kente', 'Understand patterns and colors'],
            introduction: 'Kente is Ghana\'s famous cloth!',
            keyConcepts: [
              { title: 'Kente', content: 'Hand-woven cloth from Ashanti region. Each pattern and color has meaning' },
              { title: 'Colors', content: 'Gold = royalty, Green = growth, Red = blood of ancestors' },
            ],
            activities: { type: 'exercises', questions: [] },
            pastQuestions: [],
            summary: 'Kente cloth tells our story!',
          },
        ],
      },
    ],
  },
];

export function getPrimarySubjectBySlug(slug: string): PrimarySubject | undefined {
  return primarySubjects.find(subject => subject.slug === slug);
}

export function getPrimarySubjectsByClass(className: string): PrimarySubject[] {
  if (className === 'All') {
    return primarySubjects;
  }
  
  return primarySubjects.map(subject => ({
    ...subject,
    topics: subject.topics.filter(topic => topic.gradeLevel === className),
  })).filter(subject => subject.topics.length > 0);
}
