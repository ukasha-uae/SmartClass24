/**
 * WASSCE Integrated Science Past Questions
 * Based on WAEC syllabus and past examination patterns
 * Topics: Biology, Chemistry, Physics
 * Difficulty: Senior High School (SHS) Level
 */

export interface WASSCEQuestion {
  id: string;
  type: 'mcq';
  question: string;
  options: string[];
  answer: string;
  subject: 'Integrated Science';
  topic: string;
  difficulty: 'medium' | 'hard';
  year?: string;
  explanation?: string;
}

export const WASSCEIntegratedScienceQuestions: WASSCEQuestion[] = [
  // BIOLOGY SECTION
  {
    id: 'wassce-is-001',
    type: 'mcq',
    question: 'Which of the following is NOT a function of the skin?',
    options: [
      'Regulation of body temperature',
      'Protection against mechanical injury',
      'Production of red blood cells',
      'Reception of stimuli'
    ],
    answer: 'Production of red blood cells',
    subject: 'Integrated Science',
    topic: 'Human Biology - Skin',
    difficulty: 'medium',
    explanation: 'Red blood cells are produced in the bone marrow, not in the skin. The skin regulates temperature through sweating, protects against injury, and contains sensory receptors.'
  },
  {
    id: 'wassce-is-002',
    type: 'mcq',
    question: 'The process by which green plants manufacture their own food is called',
    options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'],
    answer: 'Photosynthesis',
    subject: 'Integrated Science',
    topic: 'Plant Biology - Photosynthesis',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-003',
    type: 'mcq',
    question: 'Which blood vessel carries oxygenated blood from the lungs to the heart?',
    options: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'],
    answer: 'Pulmonary vein',
    subject: 'Integrated Science',
    topic: 'Circulatory System',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-004',
    type: 'mcq',
    question: 'The part of the flower that develops into a fruit after fertilization is the',
    options: ['Ovary', 'Ovule', 'Style', 'Stigma'],
    answer: 'Ovary',
    subject: 'Integrated Science',
    topic: 'Plant Reproduction',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-005',
    type: 'mcq',
    question: 'Which of the following diseases is caused by a virus?',
    options: ['Malaria', 'Cholera', 'Tuberculosis', 'Measles'],
    answer: 'Measles',
    subject: 'Integrated Science',
    topic: 'Disease and Health',
    difficulty: 'medium',
    explanation: 'Measles is caused by a virus. Malaria is caused by a protozoan, while cholera and tuberculosis are caused by bacteria.'
  },
  {
    id: 'wassce-is-006',
    type: 'mcq',
    question: 'The smallest unit of life that can function independently is the',
    options: ['Tissue', 'Organ', 'Cell', 'Organism'],
    answer: 'Cell',
    subject: 'Integrated Science',
    topic: 'Cell Biology',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-007',
    type: 'mcq',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Chloroplast'],
    answer: 'Mitochondrion',
    subject: 'Integrated Science',
    topic: 'Cell Biology',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-008',
    type: 'mcq',
    question: 'The enzyme in saliva that digests starch is',
    options: ['Pepsin', 'Ptyalin', 'Lipase', 'Trypsin'],
    answer: 'Ptyalin',
    subject: 'Integrated Science',
    topic: 'Digestive System',
    difficulty: 'hard'
  },
  {
    id: 'wassce-is-009',
    type: 'mcq',
    question: 'Which of the following is an example of a reflex action?',
    options: ['Walking', 'Blinking when an object approaches the eye', 'Swimming', 'Reading'],
    answer: 'Blinking when an object approaches the eye',
    subject: 'Integrated Science',
    topic: 'Nervous System',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-010',
    type: 'mcq',
    question: 'The liquid part of blood is called',
    options: ['Serum', 'Plasma', 'Lymph', 'Hemoglobin'],
    answer: 'Plasma',
    subject: 'Integrated Science',
    topic: 'Circulatory System',
    difficulty: 'medium'
  },

  // CHEMISTRY SECTION
  {
    id: 'wassce-is-011',
    type: 'mcq',
    question: 'What is the chemical symbol for sodium?',
    options: ['S', 'So', 'Na', 'N'],
    answer: 'Na',
    subject: 'Integrated Science',
    topic: 'Chemical Symbols',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-012',
    type: 'mcq',
    question: 'The pH value of a neutral solution is',
    options: ['0', '7', '14', '10'],
    answer: '7',
    subject: 'Integrated Science',
    topic: 'Acids and Bases',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-013',
    type: 'mcq',
    question: 'Which of the following is an example of a chemical change?',
    options: ['Melting of ice', 'Boiling of water', 'Burning of wood', 'Dissolving sugar in water'],
    answer: 'Burning of wood',
    subject: 'Integrated Science',
    topic: 'Chemical Changes',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-014',
    type: 'mcq',
    question: 'The process of converting a solid directly to gas is called',
    options: ['Evaporation', 'Sublimation', 'Condensation', 'Melting'],
    answer: 'Sublimation',
    subject: 'Integrated Science',
    topic: 'States of Matter',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-015',
    type: 'mcq',
    question: 'The atomic number of an element is determined by the number of',
    options: ['Protons', 'Neutrons', 'Electrons', 'Nucleons'],
    answer: 'Protons',
    subject: 'Integrated Science',
    topic: 'Atomic Structure',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-016',
    type: 'mcq',
    question: 'Which gas is produced when an acid reacts with a metal?',
    options: ['Oxygen', 'Hydrogen', 'Carbon dioxide', 'Nitrogen'],
    answer: 'Hydrogen',
    subject: 'Integrated Science',
    topic: 'Chemical Reactions',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-017',
    type: 'mcq',
    question: 'The chemical formula for common salt is',
    options: ['NaCl', 'KCl', 'CaCl₂', 'MgCl₂'],
    answer: 'NaCl',
    subject: 'Integrated Science',
    topic: 'Chemical Compounds',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-018',
    type: 'mcq',
    question: 'Which of the following is a noble gas?',
    options: ['Oxygen', 'Nitrogen', 'Argon', 'Hydrogen'],
    answer: 'Argon',
    subject: 'Integrated Science',
    topic: 'Periodic Table',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-019',
    type: 'mcq',
    question: 'The process of separating a mixture of liquids with different boiling points is called',
    options: ['Filtration', 'Evaporation', 'Distillation', 'Crystallization'],
    answer: 'Distillation',
    subject: 'Integrated Science',
    topic: 'Separation Techniques',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-020',
    type: 'mcq',
    question: 'Which of the following is an example of an exothermic reaction?',
    options: ['Melting of ice', 'Photosynthesis', 'Burning of fuel', 'Evaporation of water'],
    answer: 'Burning of fuel',
    subject: 'Integrated Science',
    topic: 'Energy Changes in Reactions',
    difficulty: 'hard'
  },

  // PHYSICS SECTION
  {
    id: 'wassce-is-021',
    type: 'mcq',
    question: 'The S.I. unit of force is',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    answer: 'Newton',
    subject: 'Integrated Science',
    topic: 'Force and Motion',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-022',
    type: 'mcq',
    question: 'Which of the following is a vector quantity?',
    options: ['Speed', 'Distance', 'Velocity', 'Time'],
    answer: 'Velocity',
    subject: 'Integrated Science',
    topic: 'Scalars and Vectors',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-023',
    type: 'mcq',
    question: 'The ability of a body to do work is called',
    options: ['Power', 'Energy', 'Force', 'Momentum'],
    answer: 'Energy',
    subject: 'Integrated Science',
    topic: 'Work and Energy',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-024',
    type: 'mcq',
    question: 'The bending of light as it passes from one medium to another is called',
    options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'],
    answer: 'Refraction',
    subject: 'Integrated Science',
    topic: 'Light',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-025',
    type: 'mcq',
    question: 'Which type of energy is stored in a stretched spring?',
    options: ['Kinetic energy', 'Potential energy', 'Heat energy', 'Chemical energy'],
    answer: 'Potential energy',
    subject: 'Integrated Science',
    topic: 'Energy',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-026',
    type: 'mcq',
    question: 'The S.I. unit of electric current is',
    options: ['Volt', 'Ampere', 'Ohm', 'Coulomb'],
    answer: 'Ampere',
    subject: 'Integrated Science',
    topic: 'Electricity',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-027',
    type: 'mcq',
    question: 'Which of the following is a good conductor of electricity?',
    options: ['Wood', 'Plastic', 'Copper', 'Rubber'],
    answer: 'Copper',
    subject: 'Integrated Science',
    topic: 'Electricity',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-028',
    type: 'mcq',
    question: 'The distance traveled per unit time is called',
    options: ['Velocity', 'Speed', 'Acceleration', 'Momentum'],
    answer: 'Speed',
    subject: 'Integrated Science',
    topic: 'Motion',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-029',
    type: 'mcq',
    question: 'Which of the following statements about the image formed by a plane mirror is correct?',
    options: [
      'It is real and inverted',
      'It is virtual and upright',
      'It is real and upright',
      'It is virtual and inverted'
    ],
    answer: 'It is virtual and upright',
    subject: 'Integrated Science',
    topic: 'Reflection of Light',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-030',
    type: 'mcq',
    question: 'The product of mass and velocity of a body is called',
    options: ['Force', 'Energy', 'Momentum', 'Power'],
    answer: 'Momentum',
    subject: 'Integrated Science',
    topic: 'Force and Motion',
    difficulty: 'medium'
  },

  // ENVIRONMENTAL SCIENCE
  {
    id: 'wassce-is-031',
    type: 'mcq',
    question: 'Which of the following is a renewable source of energy?',
    options: ['Coal', 'Natural gas', 'Solar energy', 'Petroleum'],
    answer: 'Solar energy',
    subject: 'Integrated Science',
    topic: 'Energy Resources',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-032',
    type: 'mcq',
    question: 'The gradual increase in the Earth\'s temperature is called',
    options: ['Climate change', 'Global warming', 'Ozone depletion', 'Greenhouse effect'],
    answer: 'Global warming',
    subject: 'Integrated Science',
    topic: 'Environmental Issues',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-033',
    type: 'mcq',
    question: 'Which gas is responsible for the depletion of the ozone layer?',
    options: ['Carbon dioxide', 'Methane', 'Chlorofluorocarbons (CFCs)', 'Nitrogen oxide'],
    answer: 'Chlorofluorocarbons (CFCs)',
    subject: 'Integrated Science',
    topic: 'Environmental Issues',
    difficulty: 'hard'
  },
  {
    id: 'wassce-is-034',
    type: 'mcq',
    question: 'The breaking down of rocks into smaller particles is called',
    options: ['Erosion', 'Weathering', 'Sedimentation', 'Deposition'],
    answer: 'Weathering',
    subject: 'Integrated Science',
    topic: 'Earth Science',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-035',
    type: 'mcq',
    question: 'Which of the following is a biodegradable waste?',
    options: ['Plastic bottles', 'Glass', 'Food scraps', 'Metal cans'],
    answer: 'Food scraps',
    subject: 'Integrated Science',
    topic: 'Waste Management',
    difficulty: 'medium'
  },

  // ADDITIONAL TOPICS
  {
    id: 'wassce-is-036',
    type: 'mcq',
    question: 'The change of state from liquid to gas is called',
    options: ['Melting', 'Freezing', 'Evaporation', 'Condensation'],
    answer: 'Evaporation',
    subject: 'Integrated Science',
    topic: 'States of Matter',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-037',
    type: 'mcq',
    question: 'Which vitamin is produced when the skin is exposed to sunlight?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    answer: 'Vitamin D',
    subject: 'Integrated Science',
    topic: 'Nutrition',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-038',
    type: 'mcq',
    question: 'The instrument used to measure atmospheric pressure is',
    options: ['Thermometer', 'Barometer', 'Hygrometer', 'Anemometer'],
    answer: 'Barometer',
    subject: 'Integrated Science',
    topic: 'Measurement',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-039',
    type: 'mcq',
    question: 'Which of the following is an example of a lever?',
    options: ['Wheel and axle', 'Crowbar', 'Inclined plane', 'Screw'],
    answer: 'Crowbar',
    subject: 'Integrated Science',
    topic: 'Simple Machines',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-040',
    type: 'mcq',
    question: 'The transfer of heat through a fluid (liquid or gas) is called',
    options: ['Conduction', 'Convection', 'Radiation', 'Evaporation'],
    answer: 'Convection',
    subject: 'Integrated Science',
    topic: 'Heat Transfer',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-041',
    type: 'mcq',
    question: 'Which of the following is the correct order of organization in living organisms from simplest to most complex?',
    options: [
      'Cell → Tissue → Organ → System → Organism',
      'Tissue → Cell → Organ → System → Organism',
      'Cell → Organ → Tissue → System → Organism',
      'Organ → Tissue → Cell → System → Organism'
    ],
    answer: 'Cell → Tissue → Organ → System → Organism',
    subject: 'Integrated Science',
    topic: 'Organization of Life',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-042',
    type: 'mcq',
    question: 'The process by which water vapor changes to liquid water is called',
    options: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'],
    answer: 'Condensation',
    subject: 'Integrated Science',
    topic: 'Water Cycle',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-043',
    type: 'mcq',
    question: 'Which of the following metals is liquid at room temperature?',
    options: ['Iron', 'Mercury', 'Copper', 'Gold'],
    answer: 'Mercury',
    subject: 'Integrated Science',
    topic: 'Properties of Metals',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-044',
    type: 'mcq',
    question: 'The phenomenon where light bounces off a surface is called',
    options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'],
    answer: 'Reflection',
    subject: 'Integrated Science',
    topic: 'Light',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-045',
    type: 'mcq',
    question: 'Which organ is responsible for filtering blood in the human body?',
    options: ['Liver', 'Kidney', 'Heart', 'Lungs'],
    answer: 'Kidney',
    subject: 'Integrated Science',
    topic: 'Excretory System',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-046',
    type: 'mcq',
    question: 'The formula for calculating density is',
    options: [
      'Density = Mass × Volume',
      'Density = Mass / Volume',
      'Density = Volume / Mass',
      'Density = Mass + Volume'
    ],
    answer: 'Density = Mass / Volume',
    subject: 'Integrated Science',
    topic: 'Density',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-047',
    type: 'mcq',
    question: 'Which of the following is an insulator of heat?',
    options: ['Copper', 'Aluminum', 'Wood', 'Iron'],
    answer: 'Wood',
    subject: 'Integrated Science',
    topic: 'Heat Transfer',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-048',
    type: 'mcq',
    question: 'The gas needed for burning to take place is',
    options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Hydrogen'],
    answer: 'Oxygen',
    subject: 'Integrated Science',
    topic: 'Combustion',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-049',
    type: 'mcq',
    question: 'Which part of the eye controls the amount of light entering it?',
    options: ['Lens', 'Pupil', 'Cornea', 'Retina'],
    answer: 'Pupil',
    subject: 'Integrated Science',
    topic: 'Human Eye',
    difficulty: 'medium'
  },
  {
    id: 'wassce-is-050',
    type: 'mcq',
    question: 'The component of air that supports combustion is',
    options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Noble gases'],
    answer: 'Oxygen',
    subject: 'Integrated Science',
    topic: 'Air Composition',
    difficulty: 'medium'
  }
];

export default WASSCEIntegratedScienceQuestions;
