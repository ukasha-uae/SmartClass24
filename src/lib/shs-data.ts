
import type { ReactNode } from 'react';
import React from 'react'; // Import React
import { coreMathSHS1Lessons } from './shs-lessons-data';
import { coreMathSHS2Lessons } from './shs2-lessons-data';
import { coreMathSHS3Lessons } from './shs3-lessons-data';
import { integratedScienceSHS1Lessons } from './integrated-science-shs1-lessons-data';
import { integratedScienceSHS2Lessons } from './integrated-science-shs2-lessons-data';
import { integratedScienceSHS3Lessons } from './integrated-science-shs3-lessons-data';
import type { Lesson } from './types';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  progressValue?: number;
  gradeLevel?: string; // Optional: e.g., "SHS 1", "SHS 2", "Language Skills", "Literature", "Diversity of Matter", "SHS 1 - Algebra"
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description?: string; // Optional description for the subject
  topics: Topic[];
}

export interface Programme {
  id: string;
  name: string;
  slug: string;
  description: string;
  electiveSubjects: Subject[];
  // Placeholder for an icon or image for the programme card
  icon?: React.ComponentType<{ className?: string }>;
  imageHint?: string;
}

// --- VIRTUAL LAB DATA ---
export interface VirtualLabExperiment {
    id: string;
    slug: string;
    title: string;
    subject: 'Biology' | 'Chemistry' | 'Physics' | 'Science'; // Renamed from Integrated Science
    description: string;
    component: React.ComponentType; // The component that renders the lab interface
}

// --- Helper function to get full Core Mathematics topics from existing data (to merge)
const getFullCoreMathematicsTopics = (): Topic[] => {
  const coursesData: Topic[] = [
    // SHS 1
    { id: "cm_shs1_num_1", name: "Types of Numbers", slug: "shs1-types-of-numbers", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },
    { id: "cm_shs1_num_2", name: "Fractions, Decimals, and Percentages", slug: "shs1-fractions-decimals-percentages", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },
    { id: "cm_shs1_num_3", name: "Directed Numbers and Number Line", slug: "shs1-directed-numbers", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },
    { id: "cm_shs1_num_4", name: "Approximation and Estimation", slug: "shs1-approximation-estimation", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },
    { id: "cm_shs1_num_5", name: "Factors, Multiples, and Divisibility", slug: "shs1-factors-multiples", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },

    { id: "cm_shs1_alg_1", name: "Sets and Venn Diagrams", slug: "sets-venn-diagrams", progressValue: 30, gradeLevel: "SHS 1 - Strand 2: Algebra" },
    { id: "cm_shs1_alg_2", name: "Algebraic Expressions", slug: "cm-algebraic-expressions", progressValue: 10, gradeLevel: "SHS 1 - Strand 2: Algebra" },
    { id: "cm_shs1_alg_3", name: "Linear Equations and Inequalities", slug: "shs1-linear-equations-inequalities", gradeLevel: "SHS 1 - Strand 2: Algebra" },
    
    { id: "cm_shs1_geo_1", name: "Lines and Angles", slug: "shs1-geometry-lines-angles", gradeLevel: "SHS 1 - Strand 3: Geometry and Measurement" },
    { id: "cm_shs1_geo_2", name: "Triangles and Quadrilaterals", slug: "shs1-geometry-triangles-quadrilaterals", gradeLevel: "SHS 1 - Strand 3: Geometry and Measurement" },
    { id: "cm_shs1_geo_3", name: "Geometrical Constructions and Loci", slug: "shs1-geometry-constructions-loci", gradeLevel: "SHS 1 - Strand 3: Geometry and Measurement" },
    
    { id: "cm_shs1_data_1", name: "Data Collection and Presentation", slug: "shs1-data-collection-presentation", gradeLevel: "SHS 1 - Strand 4: Data Handling and Probability" },
    { id: "cm_shs1_data_2", name: "Introduction to Probability", slug: "shs1-introduction-to-probability", gradeLevel: "SHS 1 - Strand 4: Data Handling and Probability" },
    { id: "cm_shs1_logic_1", name: "Logical Reasoning", slug: "shs1-logical-reasoning", gradeLevel: "SHS 1 - Strand 5: Logical Reasoning" },
    { id: "cm_shs1_biz_1", name: "Business Mathematics (Ratio & Rates)", slug: "shs1-business-mathematics", gradeLevel: "SHS 1 - Strand 1: Number and Numeration" },

    // SHS 2
    { id: "cm_shs2_num_1", name: "Number Bases", slug: "shs2-number-bases", gradeLevel: "SHS 2 - Strand 1: Number and Numeration" },
    { id: "cm_shs2_num_2", name: "Binary Operations", slug: "shs2-binary-operations", gradeLevel: "SHS 2 - Strand 1: Number and Numeration" },

    { id: "cm_shs2_alg_1", name: "Algebraic Factorization", slug: "shs2-algebraic-factorization", gradeLevel: "SHS 2 - Strand 2: Algebra" },
    { id: "cm_shs2_alg_2", name: "Simultaneous Linear Equations", slug: "shs2-simultaneous-linear-equations", gradeLevel: "SHS 2 - Strand 2: Algebra" },
    { id: "cm_shs2_alg_3", name: "Variation (Direct, Inverse, Joint)", slug: "shs2-variation", gradeLevel: "SHS 2 - Strand 2: Algebra" },
    
    { id: "cm_shs2_geo_1", name: "Mensuration (Perimeter, Area, Volume)", slug: "shs2-mensuration", gradeLevel: "SHS 2 - Strand 3: Geometry and Measurement" },
    { id: "cm_shs2_geo_2", name: "Trigonometry: Ratios and Applications", slug: "shs2-trigonometry-ratios", gradeLevel: "SHS 2 - Strand 3: Geometry and Measurement" },
    { id: "cm_shs2_geo_3", name: "Circle Geometry", slug: "shs2-circle-geometry", gradeLevel: "SHS 2 - Strand 3: Geometry and Measurement" },
    { id: "cm_shs2_geo_4", name: "Transformation Geometry", slug: "shs2-transformation-geometry", gradeLevel: "SHS 2 - Strand 3: Geometry and Measurement" },
    
    { id: "cm_shs2_data_1", name: "Statistics (Mean, Median, Mode, Range)", slug: "shs2-statistics-measures", gradeLevel: "SHS 2 - Strand 4: Data Handling and Probability" },
    { id: "cm_shs2_data_2", name: "Probability (Combined Events)", slug: "shs2-probability-combined", gradeLevel: "SHS 2 - Strand 4: Data Handling and Probability" },
    
    // SHS 3
    { id: "cm_shs3_alg_1", name: "Quadratic Equations", slug: "shs3-quadratic-equations", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_2", name: "Factorization", slug: "shs3-factorization", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_3", name: "Completing the Square", slug: "shs3-completing-the-square", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_4", name: "Quadratic Formula", slug: "shs3-quadratic-formula", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_5", name: "Sequences and Series", slug: "shs3-sequences-series", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_6", name: "Functions and Relations", slug: "shs3-functions-relations", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_7", name: "Linear Programming", slug: "shs3-linear-programming", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    { id: "cm_shs3_alg_8", name: "Matrices and Determinants", slug: "shs3-matrices-determinants", gradeLevel: "SHS 3 - Strand 2: Algebra" },
    
    { id: "cm_shs3_geo_1", name: "Circle Theorems I", slug: "shs3-circle-theorems-1", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    { id: "cm_shs3_geo_2", name: "Circle Theorems II", slug: "shs3-circle-theorems-2", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    { id: "cm_shs3_geo_3", name: "Polygons and Angles", slug: "shs3-polygons-angles", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    { id: "cm_shs3_geo_4", name: "Similarity and Congruence", slug: "shs3-similarity-congruence", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    { id: "cm_shs3_geo_5", name: "Geometric Constructions", slug: "shs3-geometric-constructions", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    { id: "cm_shs3_geo_6", name: "Coordinate Geometry", slug: "shs3-coordinate-geometry", gradeLevel: "SHS 3 - Strand 3: Geometry" },
    
    // Strand 4: Trigonometry (Phase 4 - Carousel Mode)
    { id: "cm_shs3_trig_1", name: "Trigonometric Ratios", slug: "shs3-trigonometric-ratios", gradeLevel: "SHS 3 - Strand 4: Trigonometry" },
    { id: "cm_shs3_trig_2", name: "Trigonometric Identities", slug: "shs3-trigonometric-identities", gradeLevel: "SHS 3 - Strand 4: Trigonometry" },
    { id: "cm_shs3_trig_3", name: "Graphs of Trigonometric Functions", slug: "shs3-trig-graphs", gradeLevel: "SHS 3 - Strand 4: Trigonometry" },
    { id: "cm_shs3_trig_4", name: "Trigonometric Equations", slug: "shs3-trigonometric-equations", gradeLevel: "SHS 3 - Strand 4: Trigonometry" },
    { id: "cm_shs3_trig_5", name: "Applications of Trigonometry", slug: "shs3-applications-of-trigonometry", gradeLevel: "SHS 3 - Strand 4: Trigonometry" },
    
    // Strand 5: Statistics & Probability (Phase 5 - Carousel Mode)
    { id: "cm_shs3_stats_1", name: "Measures of Central Tendency", slug: "shs3-measures-of-central-tendency", gradeLevel: "SHS 3 - Strand 5: Statistics & Probability" },
    { id: "cm_shs3_stats_2", name: "Measures of Dispersion", slug: "shs3-measures-of-dispersion", gradeLevel: "SHS 3 - Strand 5: Statistics & Probability" },
    { id: "cm_shs3_stats_3", name: "Probability Fundamentals", slug: "shs3-probability-fundamentals", gradeLevel: "SHS 3 - Strand 5: Statistics & Probability" },
    { id: "cm_shs3_stats_4", name: "Probability Distributions", slug: "shs3-probability-distributions", gradeLevel: "SHS 3 - Strand 5: Statistics & Probability" },
    
    { id: "cm_shs3_geo_7", name: "Bearings and Scale Drawing", slug: "shs3-bearings-scale-drawing", gradeLevel: "SHS 3 - Strand 6: Geometry II" },
    { id: "cm_shs3_geo_8", name: "Sine and Cosine Rules", slug: "shs3-sine-cosine-rules", gradeLevel: "SHS 3 - Strand 5: Geometry II" },
    
    { id: "cm_shs3_data_1", name: "Cumulative Frequency & Box Plots", slug: "shs3-cumulative-frequency-box-plots", gradeLevel: "SHS 3 - Strand 6: Data Handling" },
    
    { id: "cm_shs3_prob_1", name: "Structured Problem-Solving", slug: "shs3-problem-solving-strategies", gradeLevel: "SHS 3 - Strand 7: Problem Solving" },
    { id: "cm_shs3_prob_2", name: "Integrated WASSCE Revision", slug: "shs3-wassce-revision", gradeLevel: "SHS 3 - Strand 7: Problem Solving" },
  ];
  return coursesData;
};

const getFullCoreEnglishTopics = (): Topic[] => [
  // Strand 1: Listening & Speaking
  { id: "eng_ls_1_1", name: "Effective Listening Strategies", slug: "eng-ls-effective-listening", progressValue: 0, gradeLevel: "STRAND 1: Listening & Speaking" },
  { id: "eng_ls_1_2", name: "Oral Presentations and Discussions", slug: "eng-ls-oral-presentations", progressValue: 0, gradeLevel: "STRAND 1: Listening & Speaking" },
  { id: "eng_ls_1_3", name: "Pronunciation, Stress, and Intonation", slug: "eng-ls-pronunciation-intonation", progressValue: 0, gradeLevel: "STRAND 1: Listening & Speaking" },

  // Strand 2: Reading & Writing
  { id: "eng_rw_2_1", name: "Reading Comprehension", slug: "eng-rw-reading-comprehension", progressValue: 0, gradeLevel: "STRAND 2: Reading & Writing" },
  { id: "eng_rw_2_2", name: "Identifying Author’s Purpose and Tone", slug: "eng-rw-author-purpose-tone", progressValue: 0, gradeLevel: "STRAND 2: Reading & Writing" },
  { id: "eng_rw_2_4", name: "Functional Writing (Letters, Reports, CVs, Emails)", slug: "eng-rw-functional-writing", progressValue: 0, gradeLevel: "STRAND 2: Reading & Writing" },
  { id: "eng_rw_2_5", name: "Essay Writing (Narrative, Descriptive, Expository, Argumentative)", slug: "eng-rw-essay-writing", progressValue: 0, gradeLevel: "STRAND 2: Reading & Writing" },
  { id: "eng_rw_2_7", name: "Study and Research Skills (Summarizing, Note-taking)", slug: "eng-rw-study-research-skills", progressValue: 0, gradeLevel: "STRAND 2: Reading & Writing" },

  // Strand 3: Language and Literature
  { id: "eng_ll_3_1", name: "Grammar (Parts of Speech, Sentences, Tenses, Concord)", slug: "eng-ll-grammar", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
  { id: "eng_ll_3_2", name: "Vocabulary (Synonyms, Antonyms, Idioms)", slug: "eng-ll-vocabulary", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
  { id: "eng_ll_3_3", name: "Punctuation & Mechanics", slug: "eng-ll-punctuation-mechanics", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
  { id: "eng_ll_3_4", name: "Literature – Prose (Setting, Plot, Theme)", slug: "eng-ll-prose", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
  { id: "eng_ll_3_5", name: "Literature – Poetry (Devices, Rhythm, Themes)", slug: "eng-ll-poetry", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
  { id: "eng_ll_3_6", name: "Literature – Drama (Structure, Techniques)", slug: "eng-ll-drama", progressValue: 0, gradeLevel: "STRAND 3: Language and Literature" },
];


const getFullIntegratedScienceTopics = (): Topic[] => [
  // --- SHS 1 ---
  // Unit 1: Diversity of Matter
  { id: "chem_shs1_intro_1", name: "Nature and Scope of Chemistry", slug: "chem-shs1-intro-nature-scope", gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "chem_shs1_intro_2", name: "Scientific Methods & Safety", slug: "chem-shs1-intro-scientific-methods-safety", gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-dm-matter-states-properties", name: "States & Changes of Matter", slug: "is-dm-matter-states-properties", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-dm-cells-structure-function", name: "Cell Structure and Function", slug: "is-dm-cells-structure-function", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-dm-cells-cell-division", name: "Cell Division (Mitosis and Meiosis)", slug: "is-dm-cells-cell-division", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-dm-rocks-soil-types-formation", name: "Types and Formation of Rocks and Soil", slug: "is-dm-rocks-soil-types-formation", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-dm-rocks-soil-composition", name: "Soil Composition and Importance", slug: "is-dm-rocks-soil-composition", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },
  { id: "is-diversity-matter-shs1", name: "Elements, Compounds & Mixtures", slug: "is-diversity-matter-shs1", progressValue: 0, gradeLevel: "SHS 1 - Unit 1: Diversity of Matter" },

  // Unit 2: Life Processes
  { id: "is-dm-nutrition-balanced-diet", name: "Nutrition and Balanced Diet", slug: "is-dm-nutrition-balanced-diet", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Life Processes" },
  { id: "is-dm-digestion-process", name: "Digestion and the Human Digestive System", slug: "is-dm-digestion-process", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Life Processes" },
  { id: "is-dm-respiration-aerobic-anaerobic", name: "Respiration: Aerobic and Anaerobic", slug: "is-dm-respiration-aerobic-anaerobic", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Life Processes" },
  { id: "is-dm-photosynthesis-process", name: "Photosynthesis: Making Food from Sunlight", slug: "is-dm-photosynthesis-process", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Life Processes" },
  { id: "is-dm-genetics-inheritance", name: "Genetics and Inheritance", slug: "is-dm-genetics-inheritance", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Life Processes" },

  // Unit 3: Measurement
  { id: "is-measurement-units-instruments", name: "Units and Instruments", slug: "is-measurement-units-instruments", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Measurement" },
  { id: "is-accuracy-precision-measurement", name: "Accuracy and Precision in Measurement", slug: "is-accuracy-precision-measurement", progressValue: 0, gradeLevel: "SHS 1 - Unit 2: Measurement" },

  // Unit 3: Energy
  { id: "is-en-forms-of-energy-types", name: "Forms of Energy", slug: "is-en-forms-of-energy-types", progressValue: 0, gradeLevel: "SHS 1 - Unit 3: Energy" },
  { id: "is-en-forms-of-energy-transformation-conservation", name: "Energy Transformation and Conservation", slug: "is-en-forms-of-energy-transformation-conservation", progressValue: 0, gradeLevel: "SHS 1 - Unit 3: Energy" },
  { id: "is-en-heat-energy-temperature", name: "Heat Energy and Temperature", slug: "is-en-heat-energy-temperature", progressValue: 0, gradeLevel: "SHS 1 - Unit 3: Energy" },

  // Unit 4: Interactions of Matter
  { id: "is-im-acids-bases-salts-properties-reactions", name: "Acids, Bases, and Salts: Properties and Reactions", slug: "is-im-acids-bases-salts-properties-reactions", progressValue: 0, gradeLevel: "SHS 1 - Unit 4: Interactions of Matter" },
  { id: "is-im-acids-bases-salts-ph-scale", name: "Acids, Bases, and Salts: The pH Scale", slug: "is-im-acids-bases-salts-ph-scale", progressValue: 0, gradeLevel: "SHS 1 - Unit 4: Interactions of Matter" },

  // Unit 5: Agricultural Science (Basics)
  { id: "is-im-agricultural-science-crop-animal-production", name: "Crop and Animal Production (Basics)", slug: "is-im-agricultural-science-crop-animal-production", progressValue: 0, gradeLevel: "SHS 1 - Unit 5: Agricultural Science" },
  { id: "is-im-agricultural-science-soil-fertility-conservation", name: "Soil Fertility and Conservation", slug: "is-im-agricultural-science-soil-fertility-conservation", progressValue: 0, gradeLevel: "SHS 1 - Unit 5: Agricultural Science" },

  // --- SHS 2 ---
  // Unit 6: Cycles
  { id: "is-cy-life-cycles-plants-animals", name: "Life Cycles: Plants and Animals", slug: "is-cy-life-cycles-plants-animals", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },
  { id: "is-cy-life-cycles-human-development", name: "Life Cycles: Human Development", slug: "is-cy-life-cycles-human-development", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },
  { id: "is-cy-nutrient-cycles-nitrogen-carbon", name: "Nutrient Cycles: Nitrogen and Carbon", slug: "is-cy-nutrient-cycles-nitrogen-carbon", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },
  { id: "is-cy-nutrient-cycles-water", name: "Nutrient Cycles: Water Cycle", slug: "is-cy-nutrient-cycles-water", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },
  { id: "is-cy-reproduction-asexual-sexual", name: "Reproduction: Asexual and Sexual", slug: "is-cy-reproduction-asexual-sexual", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },
  { id: "is-cy-reproduction-fertilization-development", name: "Reproduction: Fertilization and Development", slug: "is-cy-reproduction-fertilization-development", progressValue: 0, gradeLevel: "SHS 2 - Unit 6: Cycles" },

  // Unit 7: Energy (Continued)
  { id: "is-em-electricity-magnetism-concepts", name: "Electricity and Magnetism: Concepts", slug: "is-em-electricity-magnetism-concepts", progressValue: 0, gradeLevel: "SHS 2 - Unit 7: Energy (Continued)" },
  { id: "is-en-electricity-magnetism-simple-circuits", name: "Electricity and Magnetism: Simple Circuits", slug: "is-en-electricity-magnetism-simple-circuits", progressValue: 0, gradeLevel: "SHS 2 - Unit 7: Energy (Continued)" },
  { id: "is-en-work-machines-force-work-power", name: "Work and Machines: Force, Work, Power", slug: "is-en-work-machines-force-work-power", progressValue: 0, gradeLevel: "SHS 2 - Unit 7: Energy (Continued)" },
  { id: "is-en-work-machines-simple-machines-uses", name: "Work and Machines: Simple Machines & Uses", slug: "is-en-work-machines-simple-machines-uses", progressValue: 0, gradeLevel: "SHS 2 - Unit 7: Energy (Continued)" },

  // --- SHS 3 ---
  // Unit 8: Systems
  { id: "is-sy-human-body-systems-overview", name: "Human Body Systems: Overview", slug: "is-sy-human-body-systems-overview", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },
  { id: "is-sy-human-body-systems-functions-interactions", name: "Human Body Systems: Functions & Interactions", slug: "is-sy-human-body-systems-functions-interactions", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },
  { id: "is-sy-plant-systems-photosynthesis", name: "Plant Systems: Photosynthesis", slug: "is-sy-plant-systems-photosynthesis", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },
  { id: "is-sy-plant-systems-transport", name: "Plant Systems: Transport Systems", slug: "is-sy-plant-systems-transport", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },
  { id: "is-sy-ecosystems-components-relationships", name: "Ecosystems: Components & Relationships", slug: "is-sy-ecosystems-components-relationships", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },
  { id: "is-sy-ecosystems-energy-flow-food-chains", name: "Ecosystems: Energy Flow & Food Chains", slug: "is-sy-ecosystems-energy-flow-food-chains", progressValue: 0, gradeLevel: "SHS 3 - Unit 8: Systems" },

  // Unit 9: Environmental Chemistry
  { id: "is-im-environmental-chemistry-pollution-effects", name: "Environmental Chemistry: Pollution & Effects", slug: "is-im-environmental-chemistry-pollution-effects", progressValue: 0, gradeLevel: "SHS 3 - Unit 9: Environmental Chemistry" },
  { id: "is-im-environmental-chemistry-waste-management", name: "Environmental Chemistry: Waste Management", slug: "is-im-environmental-chemistry-waste-management", progressValue: 0, gradeLevel: "SHS 3 - Unit 9: Environmental Chemistry" },
];


const getFullSocialStudiesTopics = (): Topic[] => [
  // Theme 1: Environment and Society
  { id: "sst_es_env1", name: "Meaning and components of the environment", slug: "sst-es-env-meaning-components", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_env2", name: "Human activities and their effects on the environment", slug: "sst-es-env-human-activities-effects", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_env3", name: "Environmental degradation and conservation", slug: "sst-es-env-degradation-conservation", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_pop1", name: "Population growth and its implications", slug: "sst-es-pop-growth-implications", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_pop2", name: "Urbanization and rural-urban migration", slug: "sst-es-pop-urbanization-migration", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_pop3", name: "Settlement patterns and their effects on development", slug: "sst-es-pop-settlement-patterns-effects", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_soc1", name: "Agents of socialization", slug: "sst-es-soc-agents", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_soc2", name: "Functions of social institutions (family, education, religion)", slug: "sst-es-soc-institutions-functions", progressValue: 0, gradeLevel: "Environment and Society" },
  { id: "sst_es_soc3", name: "Social norms and values", slug: "sst-es-soc-norms-values", progressValue: 0, gradeLevel: "Environment and Society" },

  // Theme 2: Governance, Politics, and Stability
  { id: "sst_gps_gov1", name: "Concept of governance and democracy", slug: "sst-gps-gov-concept-democracy", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_gov2", name: "Principles and pillars of democracy", slug: "sst-gps-gov-principles-pillars-democracy", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_gov3", name: "Role of citizens in a democratic society", slug: "sst-gps-gov-citizens-role", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_hr1", name: "Fundamental human rights", slug: "sst-gps-hr-fundamental-rights", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_hr2", name: "Responsibilities of individuals and the state", slug: "sst-gps-hr-responsibilities-individual-state", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_hr3", name: "Mechanisms for protecting human rights", slug: "sst-gps-hr-mechanisms-protection", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_pcr1", name: "Causes and effects of conflicts", slug: "sst-gps-pcr-causes-effects-conflicts", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_pcr2", name: "Methods of conflict resolution", slug: "sst-gps-pcr-methods-resolution", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  { id: "sst_gps_pcr3", name: "Importance of peace for national development", slug: "sst-gps-pcr-importance-peace", progressValue: 0, gradeLevel: "Governance, Politics, and Stability" },
  
  // Theme 3: Social and Economic Development
  { id: "sst-sed-ed-concepts-dev-underdev", name: "Concepts of Development and Underdevelopment", slug: "sst-sed-ed-concepts-dev-underdev", progressValue: 0, gradeLevel: "Social and Economic Development" },
  { id: "sst-sed-ed-indicators-development", name: "Indicators of Development", slug: "sst-sed-ed-indicators-development", progressValue: 0, gradeLevel: "Social and Economic Development" },
  { id: "sst-sed-ed-strategies-national-dev", name: "Strategies for National Development", slug: "sst-sed-ed-strategies-national-dev", progressValue: 0, gradeLevel: "Social and Economic Development" },
  { id: "sst-sed-wp-importance-work", name: "Importance of work in society", slug: "sst-sed-wp-importance-work", progressValue: 0, gradeLevel: "Work and Productivity" },
  { id: "sst-sed-wp-factors-productivity", name: "Factors affecting productivity", slug: "sst-sed-wp-factors-productivity", progressValue: 0, gradeLevel: "Work and Productivity" },
  { id: "sst-sed-wp-work-ethics-attitudes", name: "Work ethics and attitudes", slug: "sst-sed-wp-work-ethics-attitudes", progressValue: 0, gradeLevel: "Work and Productivity" },
  { id: "sst-sed-gd-meaning-dimensions-globalization", name: "Meaning and dimensions of globalization", slug: "sst-sed-gd-meaning-dimensions-globalization", progressValue: 0, gradeLevel: "Globalization and Development" },
  { id: "sst-sed-gd-effects-globalization-ghana", name: "Effects of globalization on Ghana's development", slug: "sst-sed-gd-effects-globalization-ghana", progressValue: 0, gradeLevel: "Globalization and Development" },
  { id: "sst-sed-gd-ghana-role-global-community", name: "Ghana's Role in the Global Community", slug: "sst-sed-gd-ghana-role-global-community", progressValue: 0, gradeLevel: "Globalization and Development" },
];


export const coreSubjects: Subject[] = [
  {
    id: "core-eng",
    name: "English Language",
    slug: "english-language",
    description: "NaCCA SBC English v1.0 – SmartSHS. Essential communication, literary skills, and language usage.",
    topics: getFullCoreEnglishTopics(),
  },
  {
    id: "core-math",
    name: "Core Mathematics",
    slug: "core-mathematics",
    description: "Fundamental mathematical concepts and problem-solving.",
    topics: getFullCoreMathematicsTopics(),
  },
  {
    id: "core-sci",
    name: "Integrated Science",
    slug: "integrated-science",
    description: "Basic principles of physics, chemistry, and biology, covering diversity of matter, cycles, systems, energy, and interactions.",
    topics: getFullIntegratedScienceTopics(),
  },
  {
    id: "core-sst",
    name: "Social Studies",
    slug: "social-studies",
    description: "Understanding society, culture, governance, and economic development.",
    topics: getFullSocialStudiesTopics(),
  },
];

// Elective Subjects Topics
const physicsTopics_SHS1_Intro: Topic[] = [
  { id: "phy_shs1_intro_1", name: "Nature of science and scientific methods", slug: "phy-shs1-intro-nature-science", progressValue: 0, gradeLevel: "SHS 1 - Introductory Physics" },
  { id: "phy_shs1_intro_2", name: "Units and dimensions", slug: "phy-shs1-intro-units-dimensions", progressValue: 0, gradeLevel: "SHS 1 - Introductory Physics" },
  { id: "phy_shs1_intro_3", name: "Measurement and errors", slug: "phy-shs1-intro-measurement-errors", progressValue: 0, gradeLevel: "SHS 1 - Introductory Physics" },
  { id: "phy_shs1_intro_4", name: "Properties of matter: elasticity, density, surface tension", slug: "phy-shs1-intro-properties-matter", progressValue: 0, gradeLevel: "SHS 1 - Properties of Matter" },
];
const physicsTopics_SHS1_Mechanics: Topic[] = [
  { id: "phy_shs1_mech_1", name: "Kinematics: motion in one and two dimensions", slug: "phy-shs1-mech-kinematics", progressValue: 0, gradeLevel: "SHS 1 - Mechanics" },
  { id: "phy_shs1_mech_2", name: "Dynamics: Newton's laws of motion", slug: "phy-shs1-mech-dynamics-newton", progressValue: 0, gradeLevel: "SHS 1 - Mechanics" },
  { id: "phy_shs1_mech_3", name: "Work, energy, and power", slug: "phy-shs1-mech-work-energy-power", progressValue: 0, gradeLevel: "SHS 1 - Mechanics" },
  { id: "phy_shs1_mech_4", name: "Momentum and collisions", slug: "phy-shs1-mech-momentum-collisions", progressValue: 0, gradeLevel: "SHS 1 - Mechanics" },
];
const physicsTopics_SHS1_Thermal: Topic[] = [
  { id: "phy_shs1_therm_1", name: "Temperature and heat", slug: "phy-shs1-therm-temperature-heat", progressValue: 0, gradeLevel: "SHS 1 - Thermal Physics" },
  { id: "phy_shs1_therm_2", name: "Thermal expansion", slug: "phy-shs1-therm-thermal-expansion", progressValue: 0, gradeLevel: "SHS 1 - Thermal Physics" },
  { id: "phy_shs1_therm_3", name: "Calorimetry", slug: "phy-shs1-therm-calorimetry", progressValue: 0, gradeLevel: "SHS 1 - Thermal Physics" },
  { id: "phy_shs1_therm_4", name: "Change of state", slug: "phy-shs1-therm-change-state", progressValue: 0, gradeLevel: "SHS 1 - Thermal Physics" },
];
const physicsTopics_SHS2_Waves: Topic[] = [
  { id: "phy_shs2_waves_1", name: "Types and properties of waves", slug: "phy-shs2-waves-types-properties", progressValue: 0, gradeLevel: "SHS 2 - Waves" },
  { id: "phy_shs2_waves_2", name: "Sound waves", slug: "phy-shs2-waves-sound", progressValue: 0, gradeLevel: "SHS 2 - Waves" },
  { id: "phy_shs2_waves_3", name: "Light waves: reflection, refraction, diffraction", slug: "phy-shs2-waves-light-reflection-refraction-diffraction", progressValue: 0, gradeLevel: "SHS 2 - Waves" },
  { id: "phy_shs2_waves_4", name: "Interference and polarization", slug: "phy-shs2-waves-interference-polarization", progressValue: 0, gradeLevel: "SHS 2 - Waves" },
];
const physicsTopics_SHS2_ElecMag: Topic[] = [
  { id: "phy_shs2_elecmag_1", name: "Electrostatics: charges, electric fields, potential", slug: "phy-shs2-elecmag-electrostatics", progressValue: 0, gradeLevel: "SHS 2 - Electricity and Magnetism" },
  { id: "phy_shs2_elecmag_2", name: "Current electricity: Ohm's law, circuits", slug: "phy-shs2-elecmag-current-electricity", progressValue: 0, gradeLevel: "SHS 2 - Electricity and Magnetism" },
  { id: "phy_shs2_elecmag_3", name: "Magnetism: magnetic fields, electromagnetic induction", slug: "phy-shs2-elecmag-magnetism", progressValue: 0, gradeLevel: "SHS 2 - Electricity and Magnetism" },
  { id: "phy_shs2_elecmag_4", name: "Alternating current (AC) circuits", slug: "phy-shs2-elecmag-ac-circuits", progressValue: 0, gradeLevel: "SHS 2 - Electricity and Magnetism" },
];
const physicsTopics_SHS2_AtomicNuc: Topic[] = [
  { id: "phy_shs2_atomnuc_1", name: "Structure of the atom", slug: "phy-shs2-atomnuc-structure-atom", progressValue: 0, gradeLevel: "SHS 2 - Atomic and Nuclear Physics" },
  { id: "phy_shs2_atomnuc_2", name: "Radioactivity", slug: "phy-shs2-atomnuc-radioactivity", progressValue: 0, gradeLevel: "SHS 2 - Atomic and Nuclear Physics" },
  { id: "phy_shs2_atomnuc_3", name: "Nuclear reactions", slug: "phy-shs2-atomnuc-nuclear-reactions", progressValue: 0, gradeLevel: "SHS 2 - Atomic and Nuclear Physics" },
  { id: "phy_shs2_atomnuc_4", name: "Applications of nuclear physics", slug: "phy-shs2-atomnuc-applications", progressValue: 0, gradeLevel: "SHS 2 - Atomic and Nuclear Physics" },
];
const physicsTopics_SHS3_Electronics: Topic[] = [
  { id: "phy_shs3_elec_1", name: "Semiconductors", slug: "phy-shs3-elec-semiconductors", progressValue: 0, gradeLevel: "SHS 3 - Electronics" },
  { id: "phy_shs3_elec_2", name: "Diodes and transistors", slug: "phy-shs3-elec-diodes-transistors", progressValue: 0, gradeLevel: "SHS 3 - Electronics" },
  { id: "phy_shs3_elec_3", name: "Logic gates", slug: "phy-shs3-elec-logic-gates", progressValue: 0, gradeLevel: "SHS 3 - Electronics" },
  { id: "phy_shs3_elec_4", name: "Electronic circuits and applications", slug: "phy-shs3-elec-circuits-applications", progressValue: 0, gradeLevel: "SHS 3 - Electronics" },
];
const physicsTopics_SHS3_Advanced: Topic[] = [
  { id: "phy_shs3_adv_1", name: "Quantum physics basics", slug: "phy-shs3-adv-quantum-basics", progressValue: 0, gradeLevel: "SHS 3 - Advanced Topics" },
  { id: "phy_shs3_adv_2", name: "Relativity principles", slug: "phy-shs3-adv-relativity-principles", progressValue: 0, gradeLevel: "SHS 3 - Advanced Topics" },
  { id: "phy_shs3_adv_3", name: "Modern physics applications", slug: "phy-shs3-adv-modern-physics-apps", progressValue: 0, gradeLevel: "SHS 3 - Advanced Topics" },
];
const fullPhysicsTopics: Topic[] = [
  ...physicsTopics_SHS1_Intro,
  ...physicsTopics_SHS1_Mechanics,
  ...physicsTopics_SHS1_Thermal,
  ...physicsTopics_SHS2_Waves,
  ...physicsTopics_SHS2_ElecMag,
  ...physicsTopics_SHS2_AtomicNuc,
  ...physicsTopics_SHS3_Electronics,
  ...physicsTopics_SHS3_Advanced,
];

// --- Revised Chemistry Topics ---

const chemistryTopics_SHS1_Fundamentals: Topic[] = [
  { id: "chem_shs1_intro_1", name: "Nature and Scope of Chemistry", slug: "chem-shs1-intro-nature-scope", gradeLevel: "SHS 1 - Introduction to Chemistry" },
  { id: "chem_shs1_intro_2", name: "Scientific Methods & Safety", slug: "chem-shs1-intro-scientific-methods-safety", gradeLevel: "SHS 1 - Introduction to Chemistry" },
  { id: "chem_shs1_atomic_1", name: "Atomic Structure & Periodicity", slug: "chem-shs1-atomic-structure-periodicity", gradeLevel: "SHS 1 - Atomic Structure" },
  { id: "chem_shs1_bonding_1", name: "Chemical Bonding", slug: "chem-shs1-bonding-chemical-bonds", gradeLevel: "SHS 1 - Chemical Bonding" },
  { id: "chem_shs1_matter_1", name: "States of Matter & Gas Laws", slug: "chem-shs1-matter-states-gas-laws", gradeLevel: "SHS 1 - States of Matter" },
  { id: "chem_shs1_solutions_1", name: "Solutions and Concentrations", slug: "chem-shs1-solutions-concentrations", gradeLevel: "SHS 1 - Solutions" },
  { id: "chem_shs1_stoich_1", name: "Stoichiometry & Mole Concept", slug: "chem-shs1-stoichiometry-mole-concept", gradeLevel: "SHS 1 - Stoichiometry" },
];

const chemistryTopics_SHS2_Reactions: Topic[] = [
  { id: "chem_shs2_thermo_1", name: "Thermochemistry & Energetics", slug: "chem-shs2-thermo-energetics", gradeLevel: "SHS 2 - Chemical Reactions" },
  { id: "chem_shs2_kinetics_1", name: "Chemical Kinetics & Equilibrium", slug: "chem-shs2-kinetics-equilibrium", gradeLevel: "SHS 2 - Chemical Reactions" },
  { id: "chem_shs2_acids_1", name: "Acids, Bases, and Salts", slug: "chem-shs2-acids-bases-salts", gradeLevel: "SHS 2 - Chemical Reactions" },
  { id: "chem_shs2_electrochem_1", name: "Redox Reactions & Electrochemistry", slug: "chem-shs2-electrochem-redox", gradeLevel: "SHS 2 - Chemical Reactions" },
];

const chemistryTopics_SHS3_Applied: Topic[] = [
  { id: "chem_shs3_organic_1", name: "Organic Chemistry: Hydrocarbons & Functional Groups", slug: "chem-shs3-organic-hydrocarbons-functional-groups", gradeLevel: "SHS 3 - Applied Chemistry" },
  { id: "chem_shs3_organic_2", name: "Isomerism and Organic Reactions", slug: "chem-shs3-organic-isomerism-reactions", gradeLevel: "SHS 3 - Applied Chemistry" },
  { id: "chem_shs3_env_1", name: "Environmental and Industrial Chemistry", slug: "chem-shs3-environmental-industrial", gradeLevel: "SHS 3 - Applied Chemistry" },
  { id: "chem_shs3_analytical_1", name: "Analytical Chemistry Techniques", slug: "chem-shs3-analytical-techniques", gradeLevel: "SHS 3 - Applied Chemistry" },
];

const fullChemistryTopics: Topic[] = [
  ...chemistryTopics_SHS1_Fundamentals,
  ...chemistryTopics_SHS2_Reactions,
  ...chemistryTopics_SHS3_Applied,
];


const biologyTopics_SHS1_CellGen: Topic[] = [
  { id: "bio_shs1_cbg_intro", name: "Introduction to Biology and scientific methods", slug: "bio-shs1-cbg-intro-methods", progressValue: 0, gradeLevel: "SHS 1 - Cell Biology and Genetics" },
  { id: "bio_shs1_cbg_cell_structure", name: "Cell structure and function", slug: "bio-shs1-cbg-cell-structure-function", progressValue: 0, gradeLevel: "SHS 1 - Cell Biology and Genetics" },
  { id: "bio_shs1_cbg_cell_division", name: "Cell division: mitosis and meiosis", slug: "bio-shs1-cbg-cell-division", progressValue: 0, gradeLevel: "SHS 1 - Cell Biology and Genetics" },
  { id: "bio_shs1_cbg_genetics_mendelian", name: "Basic genetics: Mendelian inheritance", slug: "bio-shs1-cbg-mendelian-inheritance", progressValue: 0, gradeLevel: "SHS 1 - Cell Biology and Genetics" },
];
const biologyTopics_SHS1_PlantAnimalPhys: Topic[] = [
  { id: "bio_shs1_pap_nutrition", name: "Nutrition in plants and animals", slug: "bio-shs1-pap-nutrition", progressValue: 0, gradeLevel: "SHS 1 - Plant and Animal Physiology" },
  { id: "bio_shs1_pap_transport", name: "Transport systems in plants and animals", slug: "bio-shs1-pap-transport-systems", progressValue: 0, gradeLevel: "SHS 1 - Plant and Animal Physiology" },
  { id: "bio_shs1_pap_respiration", name: "Respiration and energy production", slug: "bio-shs1-pap-respiration-energy", progressValue: 0, gradeLevel: "SHS 1 - Plant and Animal Physiology" },
  { id: "bio_shs1_pap_excretion", name: "Excretion and osmoregulation", slug: "bio-shs1-pap-excretion-osmoregulation", progressValue: 0, gradeLevel: "SHS 1 - Plant and Animal Physiology" },
];
const biologyTopics_SHS2_EcologyEnv: Topic[] = [
  { id: "bio_shs2_eeb_ecosystems", name: "Ecosystems and energy flow", slug: "bio-shs2-eeb-ecosystems-energy-flow", progressValue: 0, gradeLevel: "SHS 2 - Ecology and Environmental Biology" },
  { id: "bio_shs2_eeb_population", name: "Population dynamics", slug: "bio-shs2-eeb-population-dynamics", progressValue: 0, gradeLevel: "SHS 2 - Ecology and Environmental Biology" },
  { id: "bio_shs2_eeb_biogeochemical_cycles", name: "Biogeochemical cycles", slug: "bio-shs2-eeb-biogeochemical-cycles", progressValue: 0, gradeLevel: "SHS 2 - Ecology and Environmental Biology" },
  { id: "bio_shs2_eeb_conservation", name: "Conservation and biodiversity", slug: "bio-shs2-eeb-conservation-biodiversity", progressValue: 0, gradeLevel: "SHS 2 - Ecology and Environmental Biology" },
];
const biologyTopics_SHS2_EvolutionDiversity: Topic[] = [
  { id: "bio_shs2_edl_evolution_evidence", name: "Evidence of evolution", slug: "bio-shs2-edl-evidence-evolution", progressValue: 0, gradeLevel: "SHS 2 - Evolution and Diversity of Life" },
  { id: "bio_shs2_edl_natural_selection", name: "Natural selection", slug: "bio-shs2-edl-natural-selection", progressValue: 0, gradeLevel: "SHS 2 - Evolution and Diversity of Life" },
  { id: "bio_shs2_edl_classification", name: "Classification of living organisms", slug: "bio-shs2-edl-classification-organisms", progressValue: 0, gradeLevel: "SHS 2 - Evolution and Diversity of Life" },
  { id: "bio_shs2_edl_adaptations", name: "Adaptations to environments", slug: "bio-shs2-edl-adaptations", progressValue: 0, gradeLevel: "SHS 2 - Evolution and Diversity of Life" },
];
const biologyTopics_SHS3_HumanBioHealth: Topic[] = [
  { id: "bio_shs3_hbh_anatomy_physiology", name: "Human anatomy and physiology", slug: "bio-shs3-hbh-human-anatomy-physiology", progressValue: 0, gradeLevel: "SHS 3 - Human Biology and Health" },
  { id: "bio_shs3_hbh_reproductive_systems", name: "Reproductive systems and development", slug: "bio-shs3-hbh-reproductive-systems-development", progressValue: 0, gradeLevel: "SHS 3 - Human Biology and Health" },
  { id: "bio_shs3_hbh_diseases_immunity", name: "Diseases and immunity", slug: "bio-shs3-hbh-diseases-immunity", progressValue: 0, gradeLevel: "SHS 3 - Human Biology and Health" },
  { id: "bio_shs3_hbh_public_health", name: "Public health and hygiene", slug: "bio-shs3-hbh-public-health-hygiene", progressValue: 0, gradeLevel: "SHS 3 - Human Biology and Health" },
];
const fullBiologyTopics: Topic[] = [
  ...biologyTopics_SHS1_CellGen,
  ...biologyTopics_SHS1_PlantAnimalPhys,
  ...biologyTopics_SHS2_EcologyEnv,
  ...biologyTopics_SHS2_EvolutionDiversity,
  ...biologyTopics_SHS3_HumanBioHealth,
];


const electiveMathTopics_SHS1_Algebra: Topic[] = [
  { id: "em_shs1_alg_1", name: "Sets and operations", slug: "em-shs1-algebra-sets-operations", progressValue: 0, gradeLevel: "SHS 1 - Algebra" },
  { id: "em_shs1_alg_2", name: "Binary operations", slug: "em-shs1-algebra-binary-operations", progressValue: 0, gradeLevel: "SHS 1 - Algebra" },
  { id: "em_shs1_alg_3", name: "Functions and relations", slug: "em-shs1-algebra-functions-relations", progressValue: 0, gradeLevel: "SHS 1 - Algebra" },
  { id: "em_shs1_alg_4", name: "Linear and quadratic equations", slug: "em-shs1-algebra-linear-quadratic-equations", progressValue: 0, gradeLevel: "SHS 1 - Algebra" },
  { id: "em_shs1_alg_5", name: "Polynomials and factorization", slug: "em-shs1-algebra-polynomials-factorization", progressValue: 0, gradeLevel: "SHS 1 - Algebra" },
];
const electiveMathTopics_SHS1_Trigonometry: Topic[] = [
  { id: "em_shs1_trig_1", name: "Trigonometric ratios and identities", slug: "em-shs1-trig-ratios-identities", progressValue: 0, gradeLevel: "SHS 1 - Trigonometry" },
  { id: "em_shs1_trig_2", name: "Graphs of trigonometric functions", slug: "em-shs1-trig-graphs-functions", progressValue: 0, gradeLevel: "SHS 1 - Trigonometry" },
  { id: "em_shs1_trig_3", name: "Applications in solving triangles", slug: "em-shs1-trig-solving-triangles", progressValue: 0, gradeLevel: "SHS 1 - Trigonometry" },
];
const electiveMathTopics_SHS1_CoordinateGeo: Topic[] = [
  { id: "em_shs1_coord_1", name: "Straight lines: gradient, distance, and midpoint", slug: "em-shs1-coord-straight-lines", progressValue: 0, gradeLevel: "SHS 1 - Coordinate Geometry" },
  { id: "em_shs1_coord_2", name: "Equations of lines and circles", slug: "em-shs1-coord-equations-lines-circles", progressValue: 0, gradeLevel: "SHS 1 - Coordinate Geometry" },
];
const electiveMathTopics_SHS1_VectorsMechanics: Topic[] = [
  { id: "em_shs1_vecmech_1", name: "Vector representation and operations", slug: "em-shs1-vecmech-vector-representation", progressValue: 0, gradeLevel: "SHS 1 - Vectors and Mechanics" },
  { id: "em_shs1_vecmech_2", name: "Forces and equilibrium", slug: "em-shs1-vecmech-forces-equilibrium", progressValue: 0, gradeLevel: "SHS 1 - Vectors and Mechanics" },
];
const electiveMathTopics_SHS1_Logic: Topic[] = [
  { id: "em_shs1_logic_1", name: "Statements and truth tables", slug: "em-shs1-logic-statements-truth-tables", progressValue: 0, gradeLevel: "SHS 1 - Logic" },
  { id: "em_shs1_logic_2", name: "Logical connectives and implications", slug: "em-shs1-logic-connectives-implications", progressValue: 0, gradeLevel: "SHS 1 - Logic" },
];
const electiveMathTopics_SHS2_Algebra: Topic[] = [
  { id: "em_shs2_alg_1", name: "Sequences and series", slug: "em-shs2-algebra-sequences-series", progressValue: 0, gradeLevel: "SHS 2 - Algebra" },
  { id: "em_shs2_alg_2", name: "Exponential and logarithmic functions", slug: "em-shs2-algebra-exp-log-functions", progressValue: 0, gradeLevel: "SHS 2 - Algebra" },
  { id: "em_shs2_alg_3", name: "Inequalities and linear programming", slug: "em-shs2-algebra-inequalities-linear-programming", progressValue: 0, gradeLevel: "SHS 2 - Algebra" },
];
const electiveMathTopics_SHS2_Trigonometry: Topic[] = [
  { id: "em_shs2_trig_1", name: "Compound and multiple angles", slug: "em-shs2-trig-compound-multiple-angles", progressValue: 0, gradeLevel: "SHS 2 - Trigonometry" },
  { id: "em_shs2_trig_2", name: "Inverse trigonometric functions", slug: "em-shs2-trig-inverse-functions", progressValue: 0, gradeLevel: "SHS 2 - Trigonometry" },
  { id: "em_shs2_trig_3", name: "Solutions of trigonometric equations", slug: "em-shs2-trig-solutions-equations", progressValue: 0, gradeLevel: "SHS 2 - Trigonometry" },
];
const electiveMathTopics_SHS2_CoordinateGeo: Topic[] = [
  { id: "em_shs2_coord_1", name: "Conic sections: parabola, ellipse, and hyperbola", slug: "em-shs2-coord-conic-sections", progressValue: 0, gradeLevel: "SHS 2 - Coordinate Geometry" },
  { id: "em_shs2_coord_2", name: "Loci and their equations", slug: "em-shs2-coord-loci-equations", progressValue: 0, gradeLevel: "SHS 2 - Coordinate Geometry" },
];
const electiveMathTopics_SHS2_VectorsMechanics: Topic[] = [
  { id: "em_shs2_vecmech_1", name: "Relative velocity", slug: "em-shs2-vecmech-relative-velocity", progressValue: 0, gradeLevel: "SHS 2 - Vectors and Mechanics" },
  { id: "em_shs2_vecmech_2", name: "Projectile motion", slug: "em-shs2-vecmech-projectile-motion", progressValue: 0, gradeLevel: "SHS 2 - Vectors and Mechanics" },
  { id: "em_shs2_vecmech_3", name: "Moments and center of mass", slug: "em-shs2-vecmech-moments-center-mass", progressValue: 0, gradeLevel: "SHS 2 - Vectors and Mechanics" },
];
const electiveMathTopics_SHS2_MatricesTransformations: Topic[] = [
  { id: "em_shs2_mattrans_1", name: "Matrix operations", slug: "em-shs2-mattrans-matrix-operations", progressValue: 0, gradeLevel: "SHS 2 - Matrices and Transformations" },
  { id: "em_shs2_mattrans_2", name: "Determinants and inverses", slug: "em-shs2-mattrans-determinants-inverses", progressValue: 0, gradeLevel: "SHS 2 - Matrices and Transformations" },
  { id: "em_shs2_mattrans_3", name: "Linear transformations in 2D", slug: "em-shs2-mattrans-linear-transformations-2d", progressValue: 0, gradeLevel: "SHS 2 - Matrices and Transformations" },
];
const electiveMathTopics_SHS3_Calculus: Topic[] = [
  { id: "em_shs3_calc_1", name: "Limits and continuity", slug: "em-shs3-calculus-limits-continuity", progressValue: 0, gradeLevel: "SHS 3 - Calculus" },
  { id: "em_shs3_calc_2", name: "Differentiation and applications", slug: "em-shs3-calculus-differentiation-apps", progressValue: 0, gradeLevel: "SHS 3 - Calculus" },
  { id: "em_shs3_calc_3", name: "Integration and applications", slug: "em-shs3-calculus-integration-apps", progressValue: 0, gradeLevel: "SHS 3 - Calculus" },
];
const electiveMathTopics_SHS3_StatsProbability: Topic[] = [
  { id: "em_shs3_statprob_1", name: "Measures of central tendency and dispersion", slug: "em-shs3-statprob-central-tendency-dispersion", progressValue: 0, gradeLevel: "SHS 3 - Statistics and Probability" },
  { id: "em_shs3_statprob_2", name: "Probability distributions", slug: "em-shs3-statprob-probability-distributions", progressValue: 0, gradeLevel: "SHS 3 - Statistics and Probability" },
  { id: "em_shs3_statprob_3", name: "Correlation and regression analysis", slug: "em-shs3-statprob-correlation-regression", progressValue: 0, gradeLevel: "SHS 3 - Statistics and Probability" },
];
const electiveMathTopics_SHS3_VectorsMechanics: Topic[] = [
  { id: "em_shs3_vecmech_1", name: "Work, energy, and power", slug: "em-shs3-vecmech-work-energy-power", progressValue: 0, gradeLevel: "SHS 3 - Vectors and Mechanics" },
  { id: "em_shs3_vecmech_2", name: "Simple harmonic motion", slug: "em-shs3-vecmech-simple-harmonic-motion", progressValue: 0, gradeLevel: "SHS 3 - Vectors and Mechanics" },
  { id: "em_shs3_vecmech_3", name: "Circular motion", slug: "em-shs3-vecmech-circular-motion", progressValue: 0, gradeLevel: "SHS 3 - Vectors and Mechanics" },
];
const electiveMathTopics_SHS3_MatricesTransformations: Topic[] = [
  { id: "em_shs3_mattrans_1", name: "Eigenvalues and eigenvectors", slug: "em-shs3-mattrans-eigenvalues-eigenvectors", progressValue: 0, gradeLevel: "SHS 3 - Matrices and Transformations" },
  { id: "em_shs3_mattrans_2", name: "Diagonalization of matrices", slug: "em-shs3-mattrans-diagonalization-matrices", progressValue: 0, gradeLevel: "SHS 3 - Matrices and Transformations" },
  { id: "em_shs3_mattrans_3", name: "Transformations in 3D", slug: "em-shs3-mattrans-transformations-3d", progressValue: 0, gradeLevel: "SHS 3 - Matrices and Transformations" },
];
const fullElectiveMathTopics: Topic[] = [
  ...electiveMathTopics_SHS1_Algebra,
  ...electiveMathTopics_SHS1_Trigonometry,
  ...electiveMathTopics_SHS1_CoordinateGeo,
  ...electiveMathTopics_SHS1_VectorsMechanics,
  ...electiveMathTopics_SHS1_Logic,
  ...electiveMathTopics_SHS2_Algebra,
  ...electiveMathTopics_SHS2_Trigonometry,
  ...electiveMathTopics_SHS2_CoordinateGeo,
  ...electiveMathTopics_SHS2_VectorsMechanics,
  ...electiveMathTopics_SHS2_MatricesTransformations,
  ...electiveMathTopics_SHS3_Calculus,
  ...electiveMathTopics_SHS3_StatsProbability,
  ...electiveMathTopics_SHS3_VectorsMechanics,
  ...electiveMathTopics_SHS3_MatricesTransformations,
];

const literatureTopics_SHS1_Prose: Topic[] = [
  { id: "lit_shs1_prose_1", name: "Definition and types of prose", slug: "lit-shs1-prose-definition-types", progressValue: 0, gradeLevel: "SHS 1 - Prose" },
  { id: "lit_shs1_prose_2", name: "Elements of prose: plot, setting, character, theme, style", slug: "lit-shs1-prose-elements", progressValue: 0, gradeLevel: "SHS 1 - Prose" },
  { id: "lit_shs1_prose_3", name: "Narrative techniques", slug: "lit-shs1-prose-narrative-techniques", progressValue: 0, gradeLevel: "SHS 1 - Prose" },
  { id: "lit_shs1_prose_4", name: "Analysis of selected short stories and novels", slug: "lit-shs1-prose-analysis-selected-works", progressValue: 0, gradeLevel: "SHS 1 - Prose" },
];
const literatureTopics_SHS1_Drama: Topic[] = [
  { id: "lit_shs1_drama_1", name: "Definition and types of drama", slug: "lit-shs1-drama-definition-types", progressValue: 0, gradeLevel: "SHS 1 - Drama" },
  { id: "lit_shs1_drama_2", name: "Elements of drama: plot, character, dialogue, stage directions, theme", slug: "lit-shs1-drama-elements", progressValue: 0, gradeLevel: "SHS 1 - Drama" },
  { id: "lit_shs1_drama_3", name: "Dramatic techniques and devices", slug: "lit-shs1-drama-techniques-devices", progressValue: 0, gradeLevel: "SHS 1 - Drama" },
  { id: "lit_shs1_drama_4", name: "Study of selected plays", slug: "lit-shs1-drama-study-selected-plays", progressValue: 0, gradeLevel: "SHS 1 - Drama" },
];
const literatureTopics_SHS1_Poetry: Topic[] = [
  { id: "lit_shs1_poetry_1", name: "Definition and types of poetry", slug: "lit-shs1-poetry-definition-types", progressValue: 0, gradeLevel: "SHS 1 - Poetry" },
  { id: "lit_shs1_poetry_2", name: "Elements of poetry: rhyme, rhythm, imagery, diction, tone", slug: "lit-shs1-poetry-elements", progressValue: 0, gradeLevel: "SHS 1 - Poetry" },
  { id: "lit_shs1_poetry_3", name: "Poetic devices: metaphor, simile, personification, alliteration", slug: "lit-shs1-poetry-poetic-devices", progressValue: 0, gradeLevel: "SHS 1 - Poetry" },
  { id: "lit_shs1_poetry_4", name: "Analysis of selected poems", slug: "lit-shs1-poetry-analysis-selected-poems", progressValue: 0, gradeLevel: "SHS 1 - Poetry" },
];
const literatureTopics_SHS2_Prose: Topic[] = [
  { id: "lit_shs2_prose_1", name: "In-depth study of selected novels", slug: "lit-shs2-prose-in-depth-novels", progressValue: 0, gradeLevel: "SHS 2 - Prose" },
  { id: "lit_shs2_prose_2", name: "Characterization and thematic exploration", slug: "lit-shs2-prose-characterization-themes", progressValue: 0, gradeLevel: "SHS 2 - Prose" },
  { id: "lit_shs2_prose_3", name: "Narrative perspective and style", slug: "lit-shs2-prose-narrative-perspective-style", progressValue: 0, gradeLevel: "SHS 2 - Prose" },
];
const literatureTopics_SHS2_Drama: Topic[] = [
  { id: "lit_shs2_drama_1", name: "Detailed analysis of selected plays", slug: "lit-shs2-drama-detailed-analysis-plays", progressValue: 0, gradeLevel: "SHS 2 - Drama" },
  { id: "lit_shs2_drama_2", name: "Examination of dramatic structure and techniques", slug: "lit-shs2-drama-structure-techniques", progressValue: 0, gradeLevel: "SHS 2 - Drama" },
  { id: "lit_shs2_drama_3", name: "Themes and character development", slug: "lit-shs2-drama-themes-character-development", progressValue: 0, gradeLevel: "SHS 2 - Drama" },
];
const literatureTopics_SHS2_Poetry: Topic[] = [
  { id: "lit_shs2_poetry_1", name: "Critical appreciation of selected poems", slug: "lit-shs2-poetry-critical-appreciation", progressValue: 0, gradeLevel: "SHS 2 - Poetry" },
  { id: "lit_shs2_poetry_2", name: "Exploration of poetic forms and structures", slug: "lit-shs2-poetry-forms-structures", progressValue: 0, gradeLevel: "SHS 2 - Poetry" },
  { id: "lit_shs2_poetry_3", name: "Thematic and stylistic analysis", slug: "lit-shs2-poetry-thematic-stylistic-analysis", progressValue: 0, gradeLevel: "SHS 2 - Poetry" },
];
const literatureTopics_SHS3_Prose: Topic[] = [
  { id: "lit_shs3_prose_1", name: "Comparative analysis of prose texts", slug: "lit-shs3-prose-comparative-analysis", progressValue: 0, gradeLevel: "SHS 3 - Prose" },
  { id: "lit_shs3_prose_2", name: "Evaluation of authors' styles and themes", slug: "lit-shs3-prose-evaluation-styles-themes", progressValue: 0, gradeLevel: "SHS 3 - Prose" },
  { id: "lit_shs3_prose_3", name: "Preparation for examination questions on prose", slug: "lit-shs3-prose-exam-prep", progressValue: 0, gradeLevel: "SHS 3 - Prose" },
];
const literatureTopics_SHS3_Drama: Topic[] = [
  { id: "lit_shs3_drama_1", name: "Comparative study of plays", slug: "lit-shs3-drama-comparative-study", progressValue: 0, gradeLevel: "SHS 3 - Drama" },
  { id: "lit_shs3_drama_2", name: "Analysis of dramatic techniques across texts", slug: "lit-shs3-drama-analysis-techniques", progressValue: 0, gradeLevel: "SHS 3 - Drama" },
  { id: "lit_shs3_drama_3", name: "Examination preparation and practice", slug: "lit-shs3-drama-exam-practice", progressValue: 0, gradeLevel: "SHS 3 - Drama" },
];
const literatureTopics_SHS3_Poetry: Topic[] = [
  { id: "lit_shs3_poetry_1", name: "Comparative analysis of poems", slug: "lit-shs3-poetry-comparative-analysis", progressValue: 0, gradeLevel: "SHS 3 - Poetry" },
  { id: "lit_shs3_poetry_2", name: "Exploration of poets' styles and thematic concerns", slug: "lit-shs3-poetry-styles-thematic-concerns", progressValue: 0, gradeLevel: "SHS 3 - Poetry" },
  { id: "lit_shs3_poetry_3", name: "Examination preparation and practice", slug: "lit-shs3-poetry-exam-prep", progressValue: 0, gradeLevel: "SHS 3 - Poetry" },
];
const fullLiteratureTopics: Topic[] = [
  ...literatureTopics_SHS1_Prose,
  ...literatureTopics_SHS1_Drama,
  ...literatureTopics_SHS1_Poetry,
  ...literatureTopics_SHS2_Prose,
  ...literatureTopics_SHS2_Drama,
  ...literatureTopics_SHS2_Poetry,
  ...literatureTopics_SHS3_Prose,
  ...literatureTopics_SHS3_Drama,
  ...literatureTopics_SHS3_Poetry,
];

// SHS 1 - History Topics
const historyTopics_SHS1_AncientCiv: Topic[] = [
  { id: "hist_shs1_anc_1", name: "Origins and characteristics of ancient civilizations", slug: "hist-shs1-anc-origins-characteristics", progressValue: 0, gradeLevel: "SHS 1 - Ancient Civilizations" },
  { id: "hist_shs1_anc_2", name: "Egyptian, Mesopotamian, Indus Valley, and Chinese civilizations", slug: "hist-shs1-anc-egypt-meso-indus-china", progressValue: 0, gradeLevel: "SHS 1 - Ancient Civilizations" },
  { id: "hist_shs1_anc_3", name: "Contributions of ancient civilizations to modern society", slug: "hist-shs1-anc-contributions", progressValue: 0, gradeLevel: "SHS 1 - Ancient Civilizations" },
];
const historyTopics_SHS1_PreColonialAfrica: Topic[] = [
  { id: "hist_shs1_precol_1", name: "Early human societies in Africa", slug: "hist-shs1-precol-early-societies", progressValue: 0, gradeLevel: "SHS 1 - Pre-Colonial African Societies" },
  { id: "hist_shs1_precol_2", name: "Kingdoms and empires: Ghana, Mali, Songhai", slug: "hist-shs1-precol-kingdoms-empires", progressValue: 0, gradeLevel: "SHS 1 - Pre-Colonial African Societies" },
  { id: "hist_shs1_precol_3", name: "Social, political, and economic structures", slug: "hist-shs1-precol-structures", progressValue: 0, gradeLevel: "SHS 1 - Pre-Colonial African Societies" },
];
const historyTopics_SHS1_ColonialismImpact: Topic[] = [
  { id: "hist_shs1_col_1", name: "European exploration and the scramble for Africa", slug: "hist-shs1-col-exploration-scramble", progressValue: 0, gradeLevel: "SHS 1 - Colonialism and Its Impact" },
  { id: "hist_shs1_col_2", name: "Colonial administration and policies", slug: "hist-shs1-col-admin-policies", progressValue: 0, gradeLevel: "SHS 1 - Colonialism and Its Impact" },
  { id: "hist_shs1_col_3", name: "Resistance movements and their leaders", slug: "hist-shs1-col-resistance-movements", progressValue: 0, gradeLevel: "SHS 1 - Colonialism and Its Impact" },
];
const historyTopics_SHS2_NationalismIndependence: Topic[] = [
  { id: "hist_shs2_nat_1", name: "Factors leading to nationalism in Africa", slug: "hist-shs2-nat-factors-nationalism", progressValue: 0, gradeLevel: "SHS 2 - Nationalism and Independence Movements" },
  { id: "hist_shs2_nat_2", name: "Key figures and organizations in independence movements", slug: "hist-shs2-nat-key-figures-orgs", progressValue: 0, gradeLevel: "SHS 2 - Nationalism and Independence Movements" },
  { id: "hist_shs2_nat_3", name: "Processes of decolonization", slug: "hist-shs2-nat-decolonization-processes", progressValue: 0, gradeLevel: "SHS 2 - Nationalism and Independence Movements" },
];
const historyTopics_SHS2_PostIndependenceAfrica: Topic[] = [
  { id: "hist_shs2_postind_1", name: "Challenges faced by newly independent states", slug: "hist-shs2-postind-challenges", progressValue: 0, gradeLevel: "SHS 2 - Post-Independence Africa" },
  { id: "hist_shs2_postind_2", name: "Political developments and governance", slug: "hist-shs2-postind-political-dev-governance", progressValue: 0, gradeLevel: "SHS 2 - Post-Independence Africa" },
  { id: "hist_shs2_postind_3", name: "Economic policies and development strategies", slug: "hist-shs2-postind-economic-policies-dev", progressValue: 0, gradeLevel: "SHS 2 - Post-Independence Africa" },
];
const historyTopics_SHS2_GhanaianHistory: Topic[] = [
  { id: "hist_shs2_gh_1", name: "Pre-colonial Ghana: societies and cultures", slug: "hist-shs2-gh-precolonial", progressValue: 0, gradeLevel: "SHS 2 - Ghanaian History" },
  { id: "hist_shs2_gh_2", name: "Colonial rule and the path to independence", slug: "hist-shs2-gh-colonial-rule-independence", progressValue: 0, gradeLevel: "SHS 2 - Ghanaian History" },
  { id: "hist_shs2_gh_3", name: "Post-independence Ghana: political and economic developments", slug: "hist-shs2-gh-postindependence-dev", progressValue: 0, gradeLevel: "SHS 2 - Ghanaian History" },
];
const historyTopics_SHS3_ContemporaryWorld: Topic[] = [
  { id: "hist_shs3_contworld_1", name: "World Wars I and II: causes, events, and consequences", slug: "hist-shs3-contworld-world-wars", progressValue: 0, gradeLevel: "SHS 3 - Contemporary World Events" },
  { id: "hist_shs3_contworld_2", name: "The Cold War and its global impact", slug: "hist-shs3-contworld-cold-war", progressValue: 0, gradeLevel: "SHS 3 - Contemporary World Events" },
  { id: "hist_shs3_contworld_3", name: "Globalization and international relations", slug: "hist-shs3-contworld-globalization-ir", progressValue: 0, gradeLevel: "SHS 3 - Contemporary World Events" },
];
const historyTopics_SHS3_GhanaIntlAffairs: Topic[] = [
  { id: "hist_shs3_ghintl_1", name: "Ghana's role in international organizations", slug: "hist-shs3-ghintl-role-orgs", progressValue: 0, gradeLevel: "SHS 3 - Ghana in International Affairs" },
  { id: "hist_shs3_ghintl_2", name: "Foreign policy and diplomatic relations", slug: "hist-shs3-ghintl-foreign-policy", progressValue: 0, gradeLevel: "SHS 3 - Ghana in International Affairs" },
  { id: "hist_shs3_ghintl_3", name: "Contributions to peacekeeping and global initiatives", slug: "hist-shs3-ghintl-peacekeeping-contributions", progressValue: 0, gradeLevel: "SHS 3 - Ghana in International Affairs" },
];
const fullHistoryTopics: Topic[] = [
    ...historyTopics_SHS1_AncientCiv,
    ...historyTopics_SHS1_PreColonialAfrica,
    ...historyTopics_SHS1_ColonialismImpact,
    ...historyTopics_SHS2_NationalismIndependence,
    ...historyTopics_SHS2_PostIndependenceAfrica,
    ...historyTopics_SHS2_GhanaianHistory,
    ...historyTopics_SHS3_ContemporaryWorld,
    ...historyTopics_SHS3_GhanaIntlAffairs,
];

// Geography Topics
const geographyTopics_SHS1_NatureScope: Topic[] = [
    { id: "geo_shs1_ns_1", name: "Definition, scope, and branches of geography", slug: "geo-shs1-ns-definition-scope-branches", progressValue: 0, gradeLevel: "SHS 1 - The Nature and Scope of Geography" },
    { id: "geo_shs1_ns_2", name: "Importance and relevance of geography in everyday life", slug: "geo-shs1-ns-importance-relevance", progressValue: 0, gradeLevel: "SHS 1 - The Nature and Scope of Geography" },
];
const geographyTopics_SHS1_SolarSystemEarth: Topic[] = [
    { id: "geo_shs1_sse_1", name: "Components of the solar system", slug: "geo-shs1-sse-components-solar-system", progressValue: 0, gradeLevel: "SHS 1 - The Solar System and Earth" },
    { id: "geo_shs1_sse_2", name: "Earth as a planet", slug: "geo-shs1-sse-earth-planet", progressValue: 0, gradeLevel: "SHS 1 - The Solar System and Earth" },
    { id: "geo_shs1_sse_3", name: "Effects of earth’s movement (rotation and revolution)", slug: "geo-shs1-sse-earth-movement-effects", progressValue: 0, gradeLevel: "SHS 1 - The Solar System and Earth" },
];
const geographyTopics_SHS1_LocationPositioning: Topic[] = [
    { id: "geo_shs1_lp_1", name: "Latitude and longitude", slug: "geo-shs1-lp-latitude-longitude", progressValue: 0, gradeLevel: "SHS 1 - Location and Positioning" },
    { id: "geo_shs1_lp_2", name: "Great circles, time zones, and international date line", slug: "geo-shs1-lp-great-circles-timezones-idl", progressValue: 0, gradeLevel: "SHS 1 - Location and Positioning" },
];
const geographyTopics_SHS1_WeatherClimate: Topic[] = [
    { id: "geo_shs1_wc_1", name: "Elements and instruments of weather", slug: "geo-shs1-wc-elements-instruments-weather", progressValue: 0, gradeLevel: "SHS 1 - Weather and Climate" },
    { id: "geo_shs1_wc_2", name: "Factors affecting climate", slug: "geo-shs1-wc-factors-affecting-climate", progressValue: 0, gradeLevel: "SHS 1 - Weather and Climate" },
    { id: "geo_shs1_wc_3", name: "Types of climate and their distribution", slug: "geo-shs1-wc-types-climate-distribution", progressValue: 0, gradeLevel: "SHS 1 - Weather and Climate" },
];
const geographyTopics_SHS1_MapReading: Topic[] = [
    { id: "geo_shs1_mr_1", name: "Topographical maps", slug: "geo-shs1-mr-topographical-maps", progressValue: 0, gradeLevel: "SHS 1 - Map Reading and Interpretation" },
    { id: "geo_shs1_mr_2", name: "Contours and relief representation", slug: "geo-shs1-mr-contours-relief", progressValue: 0, gradeLevel: "SHS 1 - Map Reading and Interpretation" },
    { id: "geo_shs1_mr_3", name: "Direction, scale, and distance", slug: "geo-shs1-mr-direction-scale-distance", progressValue: 0, gradeLevel: "SHS 1 - Map Reading and Interpretation" },
];
const geographyTopics_SHS2_LandformsProcesses: Topic[] = [
    { id: "geo_shs2_lp_1", name: "Internal and external land-forming processes", slug: "geo-shs2-lp-internal-external-processes", progressValue: 0, gradeLevel: "SHS 2 - Landforms and Processes" },
    { id: "geo_shs2_lp_2", name: "Major landforms: mountains, valleys, plateaus, plains", slug: "geo-shs2-lp-major-landforms", progressValue: 0, gradeLevel: "SHS 2 - Landforms and Processes" },
    { id: "geo_shs2_lp_3", name: "Features of fluvial, coastal, glacial, and desert landscapes", slug: "geo-shs2-lp-landscape-features", progressValue: 0, gradeLevel: "SHS 2 - Landforms and Processes" },
];
const geographyTopics_SHS2_VegetationSoils: Topic[] = [
    { id: "geo_shs2_vs_1", name: "Types of natural vegetation", slug: "geo-shs2-vs-natural-vegetation-types", progressValue: 0, gradeLevel: "SHS 2 - Vegetation and Soils" },
    { id: "geo_shs2_vs_2", name: "Soil formation, profile, and types", slug: "geo-shs2-vs-soil-formation-profile-types", progressValue: 0, gradeLevel: "SHS 2 - Vegetation and Soils" },
    { id: "geo_shs2_vs_3", name: "Importance of vegetation and soils to humans", slug: "geo-shs2-vs-importance-vegetation-soils", progressValue: 0, gradeLevel: "SHS 2 - Vegetation and Soils" },
];
const geographyTopics_SHS2_PopulationSettlement: Topic[] = [
    { id: "geo_shs2_ps_1", name: "Factors influencing population distribution", slug: "geo-shs2-ps-population-distribution-factors", progressValue: 0, gradeLevel: "SHS 2 - Population and Settlement" },
    { id: "geo_shs2_ps_2", name: "Types of settlement and patterns", slug: "geo-shs2-ps-settlement-types-patterns", progressValue: 0, gradeLevel: "SHS 2 - Population and Settlement" },
    { id: "geo_shs2_ps_3", name: "Rural-urban migration and its effects", slug: "geo-shs2-ps-rural-urban-migration-effects", progressValue: 0, gradeLevel: "SHS 2 - Population and Settlement" },
];
const geographyTopics_SHS2_ResourcesEconomic: Topic[] = [
    { id: "geo_shs2_rea_1", name: "Types of natural resources and their uses", slug: "geo-shs2-rea-natural-resources-types-uses", progressValue: 0, gradeLevel: "SHS 2 - Resources and Economic Activities" },
    { id: "geo_shs2_rea_2", name: "Agriculture: types, systems, and challenges", slug: "geo-shs2-rea-agriculture-types-systems-challenges", progressValue: 0, gradeLevel: "SHS 2 - Resources and Economic Activities" },
    { id: "geo_shs2_rea_3", name: "Fishing, forestry, and mining in Ghana", slug: "geo-shs2-rea-fishing-forestry-mining-ghana", progressValue: 0, gradeLevel: "SHS 2 - Resources and Economic Activities" },
];
const geographyTopics_SHS3_RegionalGhanaWestAfrica: Topic[] = [
    { id: "geo_shs3_rgwa_1", name: "Relief, climate, and vegetation of Ghana and West Africa", slug: "geo-shs3-rgwa-relief-climate-vegetation", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Ghana and West Africa)" },
    { id: "geo_shs3_rgwa_2", name: "Economic activities and resource distribution", slug: "geo-shs3-rgwa-economic-activities-resources", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Ghana and West Africa)" },
    { id: "geo_shs3_rgwa_3", name: "Transport and communication systems", slug: "geo-shs3-rgwa-transport-communication", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Ghana and West Africa)" },
];
const geographyTopics_SHS3_RegionalAfricaWorld: Topic[] = [
    { id: "geo_shs3_rgaw_1", name: "Comparative studies of selected African countries", slug: "geo-shs3-rgaw-comparative-african-countries", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Africa and the World)" },
    { id: "geo_shs3_rgaw_2", name: "Characteristics of developed and developing countries", slug: "geo-shs3-rgaw-developed-developing-countries", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Africa and the World)" },
    { id: "geo_shs3_rgaw_3", name: "Global interdependence and trade", slug: "geo-shs3-rgaw-global-interdependence-trade", progressValue: 0, gradeLevel: "SHS 3 - Regional Geography (Africa and the World)" },
];
const geographyTopics_SHS3_Environmental: Topic[] = [
    { id: "geo_shs3_env_1", name: "Environmental problems (e.g., deforestation, erosion, pollution)", slug: "geo-shs3-env-problems-deforestation-erosion-pollution", progressValue: 0, gradeLevel: "SHS 3 - Environmental Geography" },
    { id: "geo_shs3_env_2", name: "Climate change and its effects", slug: "geo-shs3-env-climate-change-effects", progressValue: 0, gradeLevel: "SHS 3 - Environmental Geography" },
    { id: "geo_shs3_env_3", name: "Sustainable management of natural resources", slug: "geo-shs3-env-sustainable-management-resources", progressValue: 0, gradeLevel: "SHS 3 - Environmental Geography" },
];
const geographyTopics_SHS3_FieldWork: Topic[] = [
    { id: "geo_shs3_fw_1", name: "Importance of fieldwork in geography", slug: "geo-shs3-fw-importance-fieldwork", progressValue: 0, gradeLevel: "SHS 3 - Field Work" },
    { id: "geo_shs3_fw_2", name: "Data collection methods and tools", slug: "geo-shs3-fw-data-collection-methods-tools", progressValue: 0, gradeLevel: "SHS 3 - Field Work" },
    { id: "geo_shs3_fw_3", name: "Presentation and analysis of findings", slug: "geo-shs3-fw-presentation-analysis-findings", progressValue: 0, gradeLevel: "SHS 3 - Field Work" },
];
const fullGeographyTopics: Topic[] = [
    ...geographyTopics_SHS1_NatureScope,
    ...geographyTopics_SHS1_SolarSystemEarth,
    ...geographyTopics_SHS1_LocationPositioning,
    ...geographyTopics_SHS1_WeatherClimate,
    ...geographyTopics_SHS1_MapReading,
    ...geographyTopics_SHS2_LandformsProcesses,
    ...geographyTopics_SHS2_VegetationSoils,
    ...geographyTopics_SHS2_PopulationSettlement,
    ...geographyTopics_SHS2_ResourcesEconomic,
    ...geographyTopics_SHS3_RegionalGhanaWestAfrica,
    ...geographyTopics_SHS3_RegionalAfricaWorld,
    ...geographyTopics_SHS3_Environmental,
    ...geographyTopics_SHS3_FieldWork,
];

// Elective Government Topics
const governmentTopics_SHS1_MeaningScope: Topic[] = [
    { id: "gov_shs1_ms_1", name: "Definition of government", slug: "gov-shs1-ms-definition", progressValue: 0, gradeLevel: "SHS 1 - Meaning and Scope of Government" },
    { id: "gov_shs1_ms_2", name: "Types of government (unitary, federal, confederation, etc.)", slug: "gov-shs1-ms-types", progressValue: 0, gradeLevel: "SHS 1 - Meaning and Scope of Government" },
    { id: "gov_shs1_ms_3", name: "Functions of government", slug: "gov-shs1-ms-functions", progressValue: 0, gradeLevel: "SHS 1 - Meaning and Scope of Government" },
    { id: "gov_shs1_ms_4", name: "Importance of studying government", slug: "gov-shs1-ms-importance-study", progressValue: 0, gradeLevel: "SHS 1 - Meaning and Scope of Government" },
];
const governmentTopics_SHS1_BasicConcepts: Topic[] = [
    { id: "gov_shs1_bc_1", name: "Power, authority, and legitimacy", slug: "gov-shs1-bc-power-authority-legitimacy", progressValue: 0, gradeLevel: "SHS 1 - Basic Concepts in Government" },
    { id: "gov_shs1_bc_2", name: "Sovereignty and the state", slug: "gov-shs1-bc-sovereignty-state", progressValue: 0, gradeLevel: "SHS 1 - Basic Concepts in Government" },
    { id: "gov_shs1_bc_3", name: "Nation, nation-state and society", slug: "gov-shs1-bc-nation-state-society", progressValue: 0, gradeLevel: "SHS 1 - Basic Concepts in Government" },
    { id: "gov_shs1_bc_4", name: "Political institutions and structures", slug: "gov-shs1-bc-political-institutions", progressValue: 0, gradeLevel: "SHS 1 - Basic Concepts in Government" },
];
const governmentTopics_SHS1_Constitution: Topic[] = [
    { id: "gov_shs1_cc_1", name: "Definition and types of constitutions", slug: "gov-shs1-cc-definition-types", progressValue: 0, gradeLevel: "SHS 1 - Constitution and Constitutionalism" },
    { id: "gov_shs1_cc_2", name: "Features and importance of a constitution", slug: "gov-shs1-cc-features-importance", progressValue: 0, gradeLevel: "SHS 1 - Constitution and Constitutionalism" },
    { id: "gov_shs1_cc_3", name: "Processes of constitutional development", slug: "gov-shs1-cc-processes-development", progressValue: 0, gradeLevel: "SHS 1 - Constitution and Constitutionalism" },
    { id: "gov_shs1_cc_4", name: "Constitutionalism and rule of law", slug: "gov-shs1-cc-constitutionalism-rule-law", progressValue: 0, gradeLevel: "SHS 1 - Constitution and Constitutionalism" },
];
const governmentTopics_SHS1_Organs: Topic[] = [
    { id: "gov_shs1_og_1", name: "Legislature: types, functions, and structure", slug: "gov-shs1-og-legislature", progressValue: 0, gradeLevel: "SHS 1 - The Organs of Government" },
    { id: "gov_shs1_og_2", name: "Executive: structure, functions, and limitations", slug: "gov-shs1-og-executive", progressValue: 0, gradeLevel: "SHS 1 - The Organs of Government" },
    { id: "gov_shs1_og_3", name: "Judiciary: independence, structure, and functions", slug: "gov-shs1-og-judiciary", progressValue: 0, gradeLevel: "SHS 1 - The Organs of Government" },
];
const governmentTopics_SHS1_Ideologies: Topic[] = [
  { id: "gov_shs1_pi_1", name: "Capitalism, socialism, communism, and fascism", slug: "gov-shs1-pi-capitalism-socialism-etc", progressValue: 0, gradeLevel: "SHS 1 - Political Ideologies" },
  { id: "gov_shs1_pi_2", name: "Characteristics and examples", slug: "gov-shs1-pi-characteristics-examples", progressValue: 0, gradeLevel: "SHS 1 - Political Ideologies" },
];
const governmentTopics_SHS2_PartiesPressure: Topic[] = [
    { id: "gov_shs2_ppg_1", name: "Definition and functions of political parties", slug: "gov-shs2-ppg-definition-functions-parties", progressValue: 0, gradeLevel: "SHS 2 - Political Parties and Pressure Groups" },
    { id: "gov_shs2_ppg_2", name: "Types and structures of political parties", slug: "gov-shs2-ppg-types-structures-parties", progressValue: 0, gradeLevel: "SHS 2 - Political Parties and Pressure Groups" },
    { id: "gov_shs2_ppg_3", name: "Electoral systems and voting", slug: "gov-shs2-ppg-electoral-systems-voting", progressValue: 0, gradeLevel: "SHS 2 - Political Parties and Pressure Groups" },
    { id: "gov_shs2_ppg_4", name: "Pressure groups: types, roles, and influence", slug: "gov-shs2-ppg-pressure-groups", progressValue: 0, gradeLevel: "SHS 2 - Political Parties and Pressure Groups" },
];
const governmentTopics_SHS2_PublicOpinionMedia: Topic[] = [
    { id: "gov_shs2_pom_1", name: "Meaning and formation of public opinion", slug: "gov-shs2-pom-meaning-formation-opinion", progressValue: 0, gradeLevel: "SHS 2 - Public Opinion and the Media" },
    { id: "gov_shs2_pom_2", name: "Factors influencing public opinion", slug: "gov-shs2-pom-factors-influencing-opinion", progressValue: 0, gradeLevel: "SHS 2 - Public Opinion and the Media" },
    { id: "gov_shs2_pom_3", name: "Role of the media in governance", slug: "gov-shs2-pom-role-media", progressValue: 0, gradeLevel: "SHS 2 - Public Opinion and the Media" },
];
const governmentTopics_SHS2_Citizenship: Topic[] = [
    { id: "gov_shs2_cit_1", name: "Definition and acquisition of citizenship", slug: "gov-shs2-cit-definition-acquisition", progressValue: 0, gradeLevel: "SHS 2 - Citizenship" },
    { id: "gov_shs2_cit_2", name: "Rights and responsibilities of citizens", slug: "gov-shs2-cit-rights-responsibilities", progressValue: 0, gradeLevel: "SHS 2 - Citizenship" },
    { id: "gov_shs2_cit_3", name: "Duties of a good citizen", slug: "gov-shs2-cit-duties-good-citizen", progressValue: 0, gradeLevel: "SHS 2 - Citizenship" },
];
const governmentTopics_SHS2_DemocracyParticipation: Topic[] = [
    { id: "gov_shs2_dp_1", name: "Meaning and types of democracy", slug: "gov-shs2-dp-meaning-types-democracy", progressValue: 0, gradeLevel: "SHS 2 - Democracy and Political Participation" },
    { id: "gov_shs2_dp_2", name: "Features of democratic governance", slug: "gov-shs2-dp-features-democratic-governance", progressValue: 0, gradeLevel: "SHS 2 - Democracy and Political Participation" },
    { id: "gov_shs2_dp_3", name: "Political participation and civic responsibility", slug: "gov-shs2-dp-political-participation-civic-resp", progressValue: 0, gradeLevel: "SHS 2 - Democracy and Political Participation" },
];
const governmentTopics_SHS3_LocalGov: Topic[] = [
  { id: "gov_shs3_lg_1", name: "Meaning and importance", slug: "gov-shs3-lg-meaning-importance", progressValue: 0, gradeLevel: "SHS 3 - Local Government" },
  { id: "gov_shs3_lg_2", name: "Structure and functions of local government in Ghana", slug: "gov-shs3-lg-structure-functions-ghana", progressValue: 0, gradeLevel: "SHS 3 - Local Government" },
  { id: "gov_shs3_lg_3", name: "Decentralization and challenges", slug: "gov-shs3-lg-decentralization-challenges", progressValue: 0, gradeLevel: "SHS 3 - Local Government" },
];
const governmentTopics_SHS3_GhanaianLegal: Topic[] = [
  { id: "gov_shs3_gls_1", name: "Sources of Ghanaian law", slug: "gov-shs3-gls-sources-law", progressValue: 0, gradeLevel: "SHS 3 - The Ghanaian Legal System" },
  { id: "gov_shs3_gls_2", name: "Court structure and administration of justice", slug: "gov-shs3-gls-court-structure-admin-justice", progressValue: 0, gradeLevel: "SHS 3 - The Ghanaian Legal System" },
  { id: "gov_shs3_gls_3", name: "Rights and freedoms of the individual", slug: "gov-shs3-gls-rights-freedoms-individual", progressValue: 0, gradeLevel: "SHS 3 - The Ghanaian Legal System" },
];
const governmentTopics_SHS3_GovernanceGhana: Topic[] = [
  { id: "gov_shs3_gg_1", name: "Historical overview of constitutional developments (1957-present)", slug: "gov-shs3-gg-historical-overview-constitution", progressValue: 0, gradeLevel: "SHS 3 - Governance in Ghana" },
  { id: "gov_shs3_gg_2", name: "Structures of government under the 1992 Constitution", slug: "gov-shs3-gg-structures-1992-constitution", progressValue: 0, gradeLevel: "SHS 3 - Governance in Ghana" },
  { id: "gov_shs3_gg_3", name: "Institutions promoting good governance (CHRAJ, EC, NCCE)", slug: "gov-shs3-gg-institutions-good-governance", progressValue: 0, gradeLevel: "SHS 3 - Governance in Ghana" },
];
const governmentTopics_SHS3_IntlRelations: Topic[] = [
  { id: "gov_shs3_iro_1", name: "Meaning and importance of international relations", slug: "gov-shs3-iro-meaning-importance-ir", progressValue: 0, gradeLevel: "SHS 3 - International Relations and Organizations" },
  { id: "gov_shs3_iro_2", name: "Ghana’s foreign policy", slug: "gov-shs3-iro-ghana-foreign-policy", progressValue: 0, gradeLevel: "SHS 3 - International Relations and Organizations" },
  { id: "gov_shs3_iro_3", name: "International organizations (UN, AU, ECOWAS, Commonwealth)", slug: "gov-shs3-iro-intl-orgs", progressValue: 0, gradeLevel: "SHS 3 - International Relations and Organizations" },
];

const fullGovernmentTopics: Topic[] = [
    ...governmentTopics_SHS1_MeaningScope,
    ...governmentTopics_SHS1_BasicConcepts,
    ...governmentTopics_SHS1_Constitution,
    ...governmentTopics_SHS1_Organs,
    ...governmentTopics_SHS1_Ideologies,
    ...governmentTopics_SHS2_PartiesPressure,
    ...governmentTopics_SHS2_PublicOpinionMedia,
    ...governmentTopics_SHS2_Citizenship,
    ...governmentTopics_SHS2_DemocracyParticipation,
    ...governmentTopics_SHS3_LocalGov,
    ...governmentTopics_SHS3_GhanaianLegal,
    ...governmentTopics_SHS3_GovernanceGhana,
    ...governmentTopics_SHS3_IntlRelations,
];


const economicsTopics_SHS1_Fundamental: Topic[] = [
  { id: "econ_shs1_fc_1", name: "Definition and scope of economics", slug: "econ-shs1-def-scope", progressValue: 0, gradeLevel: "SHS 1 - Fundamental Concepts in Economics" },
  { id: "econ_shs1_fc_2", name: "Scarcity, choice, and opportunity cost", slug: "econ-shs1-scarcity-choice-opportunity", progressValue: 0, gradeLevel: "SHS 1 - Fundamental Concepts in Economics" },
  { id: "econ_shs1_fc_3", name: "Scale of preference", slug: "econ-shs1-scale-preference", progressValue: 0, gradeLevel: "SHS 1 - Fundamental Concepts in Economics" },
  { id: "econ_shs1_fc_4", name: "Basic economic problems and solutions", slug: "econ-shs1-basic-problems-solutions", progressValue: 0, gradeLevel: "SHS 1 - Fundamental Concepts in Economics" },
];
const economicsTopics_SHS1_FactorsProd: Topic[] = [
  { id: "econ_shs1_fp_1", name: "Land, labour, capital, and entrepreneurship", slug: "econ-shs1-factors-production-types", progressValue: 0, gradeLevel: "SHS 1 - Factors of Production" },
  { id: "econ_shs1_fp_2", name: "Mobility and efficiency of factors", slug: "econ-shs1-factors-mobility-efficiency", progressValue: 0, gradeLevel: "SHS 1 - Factors of Production" },
  { id: "econ_shs1_fp_3", name: "Division of labour and specialization", slug: "econ-shs1-division-labour-specialization", progressValue: 0, gradeLevel: "SHS 1 - Factors of Production" },
];
const economicsTopics_SHS1_EconSystems: Topic[] = [
  { id: "econ_shs1_es_1", name: "Traditional, command, market, and mixed economies", slug: "econ-shs1-economic-systems-types", progressValue: 0, gradeLevel: "SHS 1 - Economic Systems" },
  { id: "econ_shs1_es_2", name: "Features, merits, and demerits of each system", slug: "econ-shs1-economic-systems-features", progressValue: 0, gradeLevel: "SHS 1 - Economic Systems" },
];
const economicsTopics_SHS1_BasicTools: Topic[] = [
  { id: "econ_shs1_btea_1", name: "Tables, graphs, and charts", slug: "econ-shs1-tools-tables-graphs-charts", progressValue: 0, gradeLevel: "SHS 1 - Basic Tools for Economic Analysis" },
  { id: "econ_shs1_btea_2", name: "Interpretation of economic data", slug: "econ-shs1-tools-interpretation-data", progressValue: 0, gradeLevel: "SHS 1 - Basic Tools for Economic Analysis" },
  { id: "econ_shs1_btea_3", name: "Use of indices and percentages", slug: "econ-shs1-tools-indices-percentages", progressValue: 0, gradeLevel: "SHS 1 - Basic Tools for Economic Analysis" },
];
const economicsTopics_SHS2_DemandSupply: Topic[] = [
  { id: "econ_shs2_ds_1", name: "Law of demand and supply", slug: "econ-shs2-demand-supply-law", progressValue: 0, gradeLevel: "SHS 2 - Demand and Supply" },
  { id: "econ_shs2_ds_2", name: "Determinants and shifts in demand and supply", slug: "econ-shs2-demand-supply-determinants-shifts", progressValue: 0, gradeLevel: "SHS 2 - Demand and Supply" },
  { id: "econ_shs2_ds_3", name: "Price elasticity of demand and supply", slug: "econ-shs2-demand-supply-elasticity", progressValue: 0, gradeLevel: "SHS 2 - Demand and Supply" },
];
const economicsTopics_SHS2_ProdCost: Topic[] = [
  { id: "econ_shs2_pc_1", name: "Types and stages of production", slug: "econ-shs2-production-cost-types-stages", progressValue: 0, gradeLevel: "SHS 2 - Production and Cost" },
  { id: "econ_shs2_pc_2", name: "Short-run and long-run production functions", slug: "econ-shs2-production-cost-functions", progressValue: 0, gradeLevel: "SHS 2 - Production and Cost" },
  { id: "econ_shs2_pc_3", name: "Cost concepts and cost curves", slug: "econ-shs2-production-cost-concepts-curves", progressValue: 0, gradeLevel: "SHS 2 - Production and Cost" },
];
const economicsTopics_SHS2_MarketStructures: Topic[] = [
  { id: "econ_shs2_ms_1", name: "Perfect competition, monopoly, monopolistic competition, and oligopoly", slug: "econ-shs2-market-structures-types", progressValue: 0, gradeLevel: "SHS 2 - Market Structures" },
  { id: "econ_shs2_ms_2", name: "Characteristics and pricing strategies", slug: "econ-shs2-market-structures-characteristics-pricing", progressValue: 0, gradeLevel: "SHS 2 - Market Structures" },
  { id: "econ_shs2_ms_3", name: "Comparison of market structures", slug: "econ-shs2-market-structures-comparison", progressValue: 0, gradeLevel: "SHS 2 - Market Structures" },
];
const economicsTopics_SHS2_NationalIncome: Topic[] = [
  { id: "econ_shs2_nia_1", name: "Concepts of GDP, GNP, NNP, and per capita income", slug: "econ-shs2-national-income-concepts", progressValue: 0, gradeLevel: "SHS 2 - National Income Accounting" },
  { id: "econ_shs2_nia_2", name: "Methods of measuring national income", slug: "econ-shs2-national-income-methods", progressValue: 0, gradeLevel: "SHS 2 - National Income Accounting" },
  { id: "econ_shs2_nia_3", name: "Uses and limitations of national income data", slug: "econ-shs2-national-income-uses-limitations", progressValue: 0, gradeLevel: "SHS 2 - National Income Accounting" },
];
const economicsTopics_SHS3_MoneyBanking: Topic[] = [
  { id: "econ_shs3_mb_1", name: "Functions and characteristics of money", slug: "econ-shs3-money-banking-functions-money", progressValue: 0, gradeLevel: "SHS 3 - Money and Banking" },
  { id: "econ_shs3_mb_2", name: "Types of money and monetary systems", slug: "econ-shs3-money-banking-types-systems", progressValue: 0, gradeLevel: "SHS 3 - Money and Banking" },
  { id: "econ_shs3_mb_3", name: "Role of central and commercial banks", slug: "econ-shs3-money-banking-role-banks", progressValue: 0, gradeLevel: "SHS 3 - Money and Banking" },
];
const economicsTopics_SHS3_PublicFinance: Topic[] = [
  { id: "econ_shs3_pf_1", name: "Government revenue and expenditure", slug: "econ-shs3-public-finance-revenue-expenditure", progressValue: 0, gradeLevel: "SHS 3 - Public Finance" },
  { id: "econ_shs3_pf_2", name: "Taxation: types, principles, and effects", slug: "econ-shs3-public-finance-taxation", progressValue: 0, gradeLevel: "SHS 3 - Public Finance" },
  { id: "econ_shs3_pf_3", name: "Budgeting and fiscal policy", slug: "econ-shs3-public-finance-budgeting-fiscal-policy", progressValue: 0, gradeLevel: "SHS 3 - Public Finance" },
];
const economicsTopics_SHS3_IntlTrade: Topic[] = [
  { id: "econ_shs3_itbp_1", name: "Reasons for international trade", slug: "econ-shs3-trade-balance-reasons", progressValue: 0, gradeLevel: "SHS 3 - International Trade and Balance of Payments" },
  { id: "econ_shs3_itbp_2", name: "Terms of trade and trade restrictions", slug: "econ-shs3-trade-balance-terms-restrictions", progressValue: 0, gradeLevel: "SHS 3 - International Trade and Balance of Payments" },
  { id: "econ_shs3_itbp_3", name: "Components and disequilibrium of balance of payments", slug: "econ-shs3-trade-balance-components-disequilibrium", progressValue: 0, gradeLevel: "SHS 3 - International Trade and Balance of Payments" },
];
const economicsTopics_SHS3_EconGrowthDev: Topic[] = [
  { id: "econ_shs3_egd_1", name: "Differences between growth and development", slug: "econ-shs3-growth-dev-differences", progressValue: 0, gradeLevel: "SHS 3 - Economic Growth and Development" },
  { id: "econ_shs3_egd_2", name: "Indicators and factors affecting economic development", slug: "econ-shs3-growth-dev-indicators-factors", progressValue: 0, gradeLevel: "SHS 3 - Economic Growth and Development" },
  { id: "econ_shs3_egd_3", name: "Strategies for promoting development", slug: "econ-shs3-growth-dev-strategies", progressValue: 0, gradeLevel: "SHS 3 - Economic Growth and Development" },
];
const economicsTopics_SHS3_PopulationLabour: Topic[] = [
  { id: "econ_shs3_plm_1", name: "Population theories and census", slug: "econ-shs3-population-labour-theories-census", progressValue: 0, gradeLevel: "SHS 3 - Population and Labour Market" },
  { id: "econ_shs3_plm_2", name: "Labour force and employment", slug: "econ-shs3-population-labour-force-employment", progressValue: 0, gradeLevel: "SHS 3 - Population and Labour Market" },
  { id: "econ_shs3_plm_3", name: "Unemployment: types, causes, and solutions", slug: "econ-shs3-population-labour-unemployment", progressValue: 0, gradeLevel: "SHS 3 - Population and Labour Market" },
];
const economicsTopics_SHS3_AgricIndustry: Topic[] = [
  { id: "econ_shs3_ai_1", name: "Role of agriculture in the economy", slug: "econ-shs3-agric-industry-role-agric", progressValue: 0, gradeLevel: "SHS 3 - Agriculture and Industry" },
  { id: "econ_shs3_ai_2", name: "Industrialization and its impact", slug: "econ-shs3-agric-industry-industrialization-impact", progressValue: 0, gradeLevel: "SHS 3 - Agriculture and Industry" },
  { id: "econ_shs3_ai_3", name: "Challenges facing agriculture and industry", slug: "econ-shs3-agric-industry-challenges", progressValue: 0, gradeLevel: "SHS 3 - Agriculture and Industry" },
];
const economicsTopics_SHS3_EconPlanning: Topic[] = [
  { id: "econ_shs3_epp_1", name: "Objectives and types of economic planning", slug: "econ-shs3-planning-policy-objectives-types", progressValue: 0, gradeLevel: "SHS 3 - Economic Planning and Policy" },
  { id: "econ_shs3_epp_2", name: "Policy instruments and implementation", slug: "econ-shs3-planning-policy-instruments-implementation", progressValue: 0, gradeLevel: "SHS 3 - Economic Planning and Policy" },
  { id: "econ_shs3_epp_3", name: "Challenges in economic planning", slug: "econ-shs3-planning-policy-challenges", progressValue: 0, gradeLevel: "SHS 3 - Economic Planning and Policy" },
];
const fullEconomicsTopics: Topic[] = [
  ...economicsTopics_SHS1_Fundamental,
  ...economicsTopics_SHS1_FactorsProd,
  ...economicsTopics_SHS1_EconSystems,
  ...economicsTopics_SHS1_BasicTools,
  ...economicsTopics_SHS2_DemandSupply,
  ...economicsTopics_SHS2_ProdCost,
  ...economicsTopics_SHS2_MarketStructures,
  ...economicsTopics_SHS2_NationalIncome,
  ...economicsTopics_SHS3_MoneyBanking,
  ...economicsTopics_SHS3_PublicFinance,
  ...economicsTopics_SHS3_IntlTrade,
  ...economicsTopics_SHS3_EconGrowthDev,
  ...economicsTopics_SHS3_PopulationLabour,
  ...economicsTopics_SHS3_AgricIndustry,
  ...economicsTopics_SHS3_EconPlanning,
];


const financialAccountingTopics_SHS1_Intro: Topic[] = [
  { id: "facc_shs1_intro_1", name: "Definition and objectives of accounting", slug: "facc-shs1-intro-definition-objectives", progressValue: 0, gradeLevel: "SHS 1 - Introduction to Accounting" },
  { id: "facc_shs1_intro_2", name: "Users of accounting information", slug: "facc-shs1-intro-users-information", progressValue: 0, gradeLevel: "SHS 1 - Introduction to Accounting" },
  { id: "facc_shs1_intro_3", name: "Branches of accounting", slug: "facc-shs1-intro-branches", progressValue: 0, gradeLevel: "SHS 1 - Introduction to Accounting" },
];
const financialAccountingTopics_SHS1_Concepts: Topic[] = [
  { id: "facc_shs1_concepts_1", name: "Business entity concept", slug: "facc-shs1-concepts-business-entity", progressValue: 0, gradeLevel: "SHS 1 - Accounting Concepts and Principles" },
  { id: "facc_shs1_concepts_2", name: "Going concern concept", slug: "facc-shs1-concepts-going-concern", progressValue: 0, gradeLevel: "SHS 1 - Accounting Concepts and Principles" },
  { id: "facc_shs1_concepts_3", name: "Accrual concept", slug: "facc-shs1-concepts-accrual", progressValue: 0, gradeLevel: "SHS 1 - Accounting Concepts and Principles" },
  { id: "facc_shs1_concepts_4", name: "Consistency and prudence", slug: "facc-shs1-concepts-consistency-prudence", progressValue: 0, gradeLevel: "SHS 1 - Accounting Concepts and Principles" },
];
const financialAccountingTopics_SHS1_BOE: Topic[] = [
  { id: "facc_shs1_boe_1", name: "Sales and purchases journals", slug: "facc-shs1-boe-sales-purchases-journals", progressValue: 0, gradeLevel: "SHS 1 - Books of Original Entry" },
  { id: "facc_shs1_boe_2", name: "Cash book and petty cash book", slug: "facc-shs1-boe-cash-petty-cash-book", progressValue: 0, gradeLevel: "SHS 1 - Books of Original Entry" },
  { id: "facc_shs1_boe_3", name: "General journal", slug: "facc-shs1-boe-general-journal", progressValue: 0, gradeLevel: "SHS 1 - Books of Original Entry" },
];
const financialAccountingTopics_SHS1_Ledger: Topic[] = [
  { id: "facc_shs1_ledger_1", name: "Double-entry principles", slug: "facc-shs1-ledger-double-entry", progressValue: 0, gradeLevel: "SHS 1 - Ledger Accounts" },
  { id: "facc_shs1_ledger_2", name: "Posting from books of original entry", slug: "facc-shs1-ledger-posting", progressValue: 0, gradeLevel: "SHS 1 - Ledger Accounts" },
  { id: "facc_shs1_ledger_3", name: "Balancing ledger accounts", slug: "facc-shs1-ledger-balancing", progressValue: 0, gradeLevel: "SHS 1 - Ledger Accounts" },
];
const financialAccountingTopics_SHS1_TrialBalance: Topic[] = [
  { id: "facc_shs1_tb_1", name: "Preparation of trial balance", slug: "facc-shs1-tb-preparation", progressValue: 0, gradeLevel: "SHS 1 - Trial Balance and Correction of Errors" },
  { id: "facc_shs1_tb_2", name: "Types of errors and their corrections", slug: "facc-shs1-tb-errors-corrections", progressValue: 0, gradeLevel: "SHS 1 - Trial Balance and Correction of Errors" },
  { id: "facc_shs1_tb_3", name: "Suspense accounts", slug: "facc-shs1-tb-suspense-accounts", progressValue: 0, gradeLevel: "SHS 1 - Trial Balance and Correction of Errors" },
];
const financialAccountingTopics_SHS2_FinalSole: Topic[] = [
  { id: "facc_shs2_finalsole_1", name: "Trading, profit and loss accounts", slug: "facc-shs2-finalsole-trading-pl", progressValue: 0, gradeLevel: "SHS 2 - Final Accounts of Sole Traders" },
  { id: "facc_shs2_finalsole_2", name: "Balance sheet preparation", slug: "facc-shs2-finalsole-balance-sheet", progressValue: 0, gradeLevel: "SHS 2 - Final Accounts of Sole Traders" },
  { id: "facc_shs2_finalsole_3", name: "Adjustments for accruals and prepayments", slug: "facc-shs2-finalsole-adjustments", progressValue: 0, gradeLevel: "SHS 2 - Final Accounts of Sole Traders" },
];
const financialAccountingTopics_SHS2_ControlBank: Topic[] = [
  { id: "facc_shs2_controlbank_1", name: "Purpose and preparation of control accounts", slug: "facc-shs2-controlbank-control-accounts", progressValue: 0, gradeLevel: "SHS 2 - Control Accounts and Bank Reconciliation" },
  { id: "facc_shs2_controlbank_2", name: "Bank reconciliation statements", slug: "facc-shs2-controlbank-bank-reconciliation", progressValue: 0, gradeLevel: "SHS 2 - Control Accounts and Bank Reconciliation" },
  { id: "facc_shs2_controlbank_3", name: "Causes of differences between cash book and bank statement", slug: "facc-shs2-controlbank-differences", progressValue: 0, gradeLevel: "SHS 2 - Control Accounts and Bank Reconciliation" },
];
const financialAccountingTopics_SHS2_NonProfit: Topic[] = [
  { id: "facc_shs2_nonprofit_1", name: "Receipts and payments account", slug: "facc-shs2-nonprofit-receipts-payments", progressValue: 0, gradeLevel: "SHS 2 - Accounting for Non-Profit Organizations" },
  { id: "facc_shs2_nonprofit_2", name: "Income and expenditure account", slug: "facc-shs2-nonprofit-income-expenditure", progressValue: 0, gradeLevel: "SHS 2 - Accounting for Non-Profit Organizations" },
  { id: "facc_shs2_nonprofit_3", name: "Balance sheet for non-profit entities", slug: "facc-shs2-nonprofit-balance-sheet", progressValue: 0, gradeLevel: "SHS 2 - Accounting for Non-Profit Organizations" },
];
const financialAccountingTopics_SHS2_Partnership: Topic[] = [
  { id: "facc_shs2_partner_1", name: "Formation and partnership agreements", slug: "facc-shs2-partner-formation-agreements", progressValue: 0, gradeLevel: "SHS 2 - Partnership Accounts" },
  { id: "facc_shs2_partner_2", name: "Profit and loss appropriation account", slug: "facc-shs2-partner-pl-appropriation", progressValue: 0, gradeLevel: "SHS 2 - Partnership Accounts" },
  { id: "facc_shs2_partner_3", name: "Partners’ capital and current accounts", slug: "facc-shs2-partner-capital-current-accounts", progressValue: 0, gradeLevel: "SHS 2 - Partnership Accounts" },
  { id: "facc_shs2_partner_4", name: "Admission, retirement, and dissolution of partnership", slug: "facc-shs2-partner-admission-retirement-dissolution", progressValue: 0, gradeLevel: "SHS 2 - Partnership Accounts" },
];
const financialAccountingTopics_SHS3_Company: Topic[] = [
  { id: "facc_shs3_company_1", name: "Types of companies", slug: "facc-shs3-company-types", progressValue: 0, gradeLevel: "SHS 3 - Company Accounts" },
  { id: "facc_shs3_company_2", name: "Issue of shares and debentures", slug: "facc-shs3-company-issue-shares-debentures", progressValue: 0, gradeLevel: "SHS 3 - Company Accounts" },
  { id: "facc_shs3_company_3", name: "Preparation of final accounts for companies", slug: "facc-shs3-company-final-accounts", progressValue: 0, gradeLevel: "SHS 3 - Company Accounts" },
  { id: "facc_shs3_company_4", name: "Appropriation of profits and reserves", slug: "facc-shs3-company-appropriation-profits", progressValue: 0, gradeLevel: "SHS 3 - Company Accounts" },
];
const financialAccountingTopics_SHS3_Manufacturing: Topic[] = [
  { id: "facc_shs3_manuf_1", name: "Cost of production calculation", slug: "facc-shs3-manuf-cost-production", progressValue: 0, gradeLevel: "SHS 3 - Manufacturing Accounts" },
  { id: "facc_shs3_manuf_2", name: "Preparation of manufacturing account", slug: "facc-shs3-manuf-preparation", progressValue: 0, gradeLevel: "SHS 3 - Manufacturing Accounts" },
  { id: "facc_shs3_manuf_3", name: "Integration with trading account", slug: "facc-shs3-manuf-integration-trading", progressValue: 0, gradeLevel: "SHS 3 - Manufacturing Accounts" },
];
const financialAccountingTopics_SHS3_PublicSector: Topic[] = [
  { id: "facc_shs3_public_1", name: "Features of public sector accounting", slug: "facc-shs3-public-features", progressValue: 0, gradeLevel: "SHS 3 - Public Sector Accounting" },
  { id: "facc_shs3_public_2", name: "Sources of public revenue and expenditure", slug: "facc-shs3-public-sources-revenue-expenditure", progressValue: 0, gradeLevel: "SHS 3 - Public Sector Accounting" },
  { id: "facc_shs3_public_3", name: "Preparation of public sector accounts", slug: "facc-shs3-public-preparation", progressValue: 0, gradeLevel: "SHS 3 - Public Sector Accounting" },
];
const financialAccountingTopics_SHS3_BranchDept: Topic[] = [
  { id: "facc_shs3_branchdept_1", name: "Accounting for branches", slug: "facc-shs3-branchdept-branch-accounting", progressValue: 0, gradeLevel: "SHS 3 - Branch and Departmental Accounts" },
  { id: "facc_shs3_branchdept_2", name: "Departmental accounts preparation", slug: "facc-shs3-branchdept-departmental-preparation", progressValue: 0, gradeLevel: "SHS 3 - Branch and Departmental Accounts" },
  { id: "facc_shs3_branchdept_3", name: "Inter-branch and inter-departmental transfers", slug: "facc-shs3-branchdept-inter-transfers", progressValue: 0, gradeLevel: "SHS 3 - Branch and Departmental Accounts" },
];
const financialAccountingTopics_SHS3_Incomplete: Topic[] = [
  { id: "facc_shs3_incomplete_1", name: "Single entry system", slug: "facc-shs3-incomplete-single-entry", progressValue: 0, gradeLevel: "SHS 3 - Incomplete Records" },
  { id: "facc_shs3_incomplete_2", name: "Conversion to double entry", slug: "facc-shs3-incomplete-conversion-double-entry", progressValue: 0, gradeLevel: "SHS 3 - Incomplete Records" },
  { id: "facc_shs3_incomplete_3", name: "Preparation of final accounts from incomplete records", slug: "facc-shs3-incomplete-final-accounts", progressValue: 0, gradeLevel: "SHS 3 - Incomplete Records" },
];
const financialAccountingTopics_SHS3_Ratios: Topic[] = [
  { id: "facc_shs3_ratios_1", name: "Liquidity, profitability, and efficiency ratios", slug: "facc-shs3-ratios-types", progressValue: 0, gradeLevel: "SHS 3 - Accounting Ratios and Interpretation" },
  { id: "facc_shs3_ratios_2", name: "Interpretation of financial statements", slug: "facc-shs3-ratios-interpretation", progressValue: 0, gradeLevel: "SHS 3 - Accounting Ratios and Interpretation" },
  { id: "facc_shs3_ratios_3", name: "Limitations of ratio analysis", slug: "facc-shs3-ratios-limitations", progressValue: 0, gradeLevel: "SHS 3 - Accounting Ratios and Interpretation" },
];
const financialAccountingTopics_SHS3_Cashflow: Topic[] = [
  { id: "facc_shs3_cashflow_1", name: "Importance of cash flow statements", slug: "facc-shs3-cashflow-importance", progressValue: 0, gradeLevel: "SHS 3 - Cash Flow Statements" },
  { id: "facc_shs3_cashflow_2", name: "Preparation using direct and indirect methods", slug: "facc-shs3-cashflow-preparation-methods", progressValue: 0, gradeLevel: "SHS 3 - Cash Flow Statements" },
  { id: "facc_shs3_cashflow_3", name: "Analysis of cash flows", slug: "facc-shs3-cashflow-analysis", progressValue: 0, gradeLevel: "SHS 3 - Cash Flow Statements" },
];
const financialAccountingTopics_SHS3_Computerized: Topic[] = [
  { id: "facc_shs3_computer_1", name: "Introduction to accounting software", slug: "facc-shs3-computer-intro-software", progressValue: 0, gradeLevel: "SHS 3 - Computerized Accounting Systems" },
  { id: "facc_shs3_computer_2", name: "Advantages and limitations of computerized systems", slug: "facc-shs3-computer-advantages-limitations", progressValue: 0, gradeLevel: "SHS 3 - Computerized Accounting Systems" },
  { id: "facc_shs3_computer_3", name: "Basic features of accounting packages", slug: "facc-shs3-computer-basic-features", progressValue: 0, gradeLevel: "SHS 3 - Computerized Accounting Systems" },
];
const fullFinancialAccountingTopics: Topic[] = [
  ...financialAccountingTopics_SHS1_Intro,
  ...financialAccountingTopics_SHS1_Concepts,
  ...financialAccountingTopics_SHS1_BOE,
  ...financialAccountingTopics_SHS1_Ledger,
  ...financialAccountingTopics_SHS1_TrialBalance,
  ...financialAccountingTopics_SHS2_FinalSole,
  ...financialAccountingTopics_SHS2_ControlBank,
  ...financialAccountingTopics_SHS2_NonProfit,
  ...financialAccountingTopics_SHS2_Partnership,
  ...financialAccountingTopics_SHS3_Company,
  ...financialAccountingTopics_SHS3_Manufacturing,
  ...financialAccountingTopics_SHS3_PublicSector,
  ...financialAccountingTopics_SHS3_BranchDept,
  ...financialAccountingTopics_SHS3_Incomplete,
  ...financialAccountingTopics_SHS3_Ratios,
  ...financialAccountingTopics_SHS3_Cashflow,
  ...financialAccountingTopics_SHS3_Computerized,
];


const businessManagementTopics_SHS1_Nature: Topic[] = [
  { id: "bman_shs1_nm_1", name: "The World of Business", slug: "bman-shs1-nm-world-business", progressValue: 0, gradeLevel: "SHS 1 - Nature of Management" },
  { id: "bman_shs1_nm_2", name: "Forms of Business Organizations", slug: "bman-shs1-nm-forms-organizations", progressValue: 0, gradeLevel: "SHS 1 - Nature of Management" },
  { id: "bman_shs1_nm_3", name: "Business Objectives and Resources", slug: "bman-shs1-nm-objectives-resources", progressValue: 0, gradeLevel: "SHS 1 - Nature of Management" },
];
const businessManagementTopics_SHS1_Functions: Topic[] = [
  { id: "bman_shs1_mf_1", name: "Planning", slug: "bman-shs1-mf-planning", progressValue: 0, gradeLevel: "SHS 1 - Management Functions" },
  { id: "bman_shs1_mf_2", name: "Organizing", slug: "bman-shs1-mf-organizing", progressValue: 0, gradeLevel: "SHS 1 - Management Functions" },
  { id: "bman_shs1_mf_3", name: "Staffing", slug: "bman-shs1-mf-staffing", progressValue: 0, gradeLevel: "SHS 1 - Management Functions" },
  { id: "bman_shs1_mf_4", name: "Directing", slug: "bman-shs1-mf-directing", progressValue: 0, gradeLevel: "SHS 1 - Management Functions" },
  { id: "bman_shs1_mf_5", name: "Controlling", slug: "bman-shs1-mf-controlling", progressValue: 0, gradeLevel: "SHS 1 - Management Functions" },
];
const businessManagementTopics_SHS2_Environment: Topic[] = [
  { id: "bman_shs2_be_1", name: "Internal and External Business Environment", slug: "bman-shs2-be-internal-external-env", progressValue: 0, gradeLevel: "SHS 2 - Business Environment" },
  { id: "bman_shs2_be_2", name: "Legal Environment of Business", slug: "bman-shs2-be-legal-env", progressValue: 0, gradeLevel: "SHS 2 - Business Environment" },
  { id: "bman_shs2_be_3", name: "Ethical Issues in Business", slug: "bman-shs2-be-ethical-issues", progressValue: 0, gradeLevel: "SHS 2 - Business Environment" },
];
const businessManagementTopics_SHS2_FunctionalAreas: Topic[] = [
  { id: "bman_shs2_fa_1", name: "Production Management", slug: "bman-shs2-fa-production-mgmt", progressValue: 0, gradeLevel: "SHS 2 - Functional Areas of Management" },
  { id: "bman_shs2_fa_2", name: "Marketing Management", slug: "bman-shs2-fa-marketing-mgmt", progressValue: 0, gradeLevel: "SHS 2 - Functional Areas of Management" },
  { id: "bman_shs2_fa_3", name: "Financial Management", slug: "bman-shs2-fa-financial-mgmt", progressValue: 0, gradeLevel: "SHS 2 - Functional Areas of Management" },
  { id: "bman_shs2_fa_4", name: "Human Resource Management", slug: "bman-shs2-fa-human-resource-mgmt", progressValue: 0, gradeLevel: "SHS 2 - Functional Areas of Management" },
];
const businessManagementTopics_SHS3_Entrepreneurship: Topic[] = [
  { id: "bman_shs3_esbm_1", name: "Concept of Entrepreneurship", slug: "bman-shs3-esbm-concept-entrepreneurship", progressValue: 0, gradeLevel: "SHS 3 - Entrepreneurship and Small Business Management" },
  { id: "bman_shs3_esbm_2", name: "Characteristics of Entrepreneurs", slug: "bman-shs3-esbm-characteristics-entrepreneurs", progressValue: 0, gradeLevel: "SHS 3 - Entrepreneurship and Small Business Management" },
  { id: "bman_shs3_esbm_3", name: "Starting and Managing Small Businesses", slug: "bman-shs3-esbm-starting-managing-small-biz", progressValue: 0, gradeLevel: "SHS 3 - Entrepreneurship and Small Business Management" },
];
const businessManagementTopics_SHS3_Globalization: Topic[] = [
  { id: "bman_shs3_gei_1", name: "Concept of Globalization", slug: "bman-shs3-gei-concept-globalization", progressValue: 0, gradeLevel: "SHS 3 - Globalization and Economic Integration" },
  { id: "bman_shs3_gei_2", name: "Impact of Globalization on Business", slug: "bman-shs3-gei-impact-globalization-biz", progressValue: 0, gradeLevel: "SHS 3 - Globalization and Economic Integration" },
  { id: "bman_shs3_gei_3", name: "Economic Integration and Regional Cooperation", slug: "bman-shs3-gei-economic-integration-cooperation", progressValue: 0, gradeLevel: "SHS 3 - Globalization and Economic Integration" },
];
const fullBusinessManagementTopics: Topic[] = [
  ...businessManagementTopics_SHS1_Nature,
  ...businessManagementTopics_SHS1_Functions,
  ...businessManagementTopics_SHS2_Environment,
  ...businessManagementTopics_SHS2_FunctionalAreas,
  ...businessManagementTopics_SHS3_Entrepreneurship,
  ...businessManagementTopics_SHS3_Globalization,
];


const generalAgricultureTopics: Topic[] = [
  { id: "agric-t1", name: "Introduction to Agriculture", slug: "agric-intro", progressValue: 0, gradeLevel: "Elective" },
  { id: "agric-t2", name: "Soil Science", slug: "agric-soil-science", progressValue: 0, gradeLevel: "Elective" },
  { id: "agric-t3", name: "Farm Management", slug: "agric-farm-management", progressValue: 0, gradeLevel: "Elective" },
];
const animalHusbandryTopics: Topic[] = [
  { id: "animal-t1", name: "Livestock Breeds", slug: "animal-livestock-breeds", progressValue: 0, gradeLevel: "Elective" },
  { id: "animal-t2", name: "Animal Nutrition", slug: "animal-nutrition", progressValue: 0, gradeLevel: "Elective" },
];
const cropHusbandryTopics: Topic[] = [
  { id: "crop-t1", name: "Planting Techniques", slug: "crop-planting", progressValue: 0, gradeLevel: "Elective" },
  { id: "crop-t2", name: "Pest and Disease Control", slug: "crop-pest-control", progressValue: 0, gradeLevel: "Elective" },
];

const cateringTopics: Topic[] = [
  { id: "cat-t1", name: "Food Preparation Techniques", slug: "catering-food-prep", progressValue: 0, gradeLevel: "Elective" },
  { id: "cat-t2", name: "Menu Planning", slug: "catering-menu-planning", progressValue: 0, gradeLevel: "Elective" },
];
const fashionDesignTopics: Topic[] = [
  { id: "fash-t1", name: "Garment Construction", slug: "fashion-garment-construction", progressValue: 0, gradeLevel: "Elective" },
  { id: "fash-t2", name: "Fashion Illustration", slug: "fashion-illustration", progressValue: 0, gradeLevel: "Elective" },
];
const cosmetologyTopics: Topic[] = [
  { id: "cosm-t1", name: "Hair Care and Styling", slug: "cosmetology-hair-care", progressValue: 0, gradeLevel: "Elective" },
  { id: "cosm-t2", name: "Skincare and Makeup", slug: "cosmetology-skincare", progressValue: 0, gradeLevel: "Elective" },
];
const clothingTextilesTopics: Topic[] = [ 
  { id: "cloth-t1", name: "Pattern Drafting", slug: "cloth-pattern-drafting", progressValue: 0, gradeLevel: "Elective"},
  { id: "cloth-t2", name: "Textile Science", slug: "cloth-textile-science", progressValue: 0, gradeLevel: "Elective"},
];
const interiorDecorationTopics: Topic[] = [
  { id: "intdec-t1", name: "Principles of Design", slug: "interior-principles-design", progressValue: 0, gradeLevel: "Elective" },
  { id: "intdec-t2", name: "Space Planning", slug: "interior-space-planning", progressValue: 0, gradeLevel: "Elective" },
];

const computerProgrammingTopics: Topic[] = [
  { id: "prog-t1", name: "Introduction to Programming", slug: "ict-intro-programming", progressValue: 0, gradeLevel: "Elective" },
  { id: "prog-t2", name: "Web Development Basics", slug: "ict-web-dev-basics", progressValue: 0, gradeLevel: "Elective" },
];
const hardwareNetworkingTopics: Topic[] = [
  { id: "hw-net-t1", name: "Computer Hardware Components", slug: "ict-hardware-components", progressValue: 0, gradeLevel: "Elective" },
  { id: "hw-net-t2", name: "Networking Fundamentals", slug: "ict-networking-fundamentals", progressValue: 0, gradeLevel: "Elective" },
];
const dataProcessingTopics: Topic[] = [
  { id: "dp-t1", name: "Database Concepts", slug: "ict-database-concepts", progressValue: 0, gradeLevel: "Elective" },
  { id: "dp-t2", name: "Spreadsheet Management", slug: "ict-spreadsheet-management", progressValue: 0, gradeLevel: "Elective" },
];
const appliedICTTopics: Topic[] = [
    { id: "appict-t1", name: "Productivity Software", slug: "ict-productivity-software", progressValue: 0, gradeLevel: "Elective" },
    { id: "appict-t2", name: "Digital Citizenship", slug: "ict-digital-citizenship", progressValue: 0, gradeLevel: "Elective" },
];

export const shsProgrammes: Programme[] = [
  {
    id: "prog-gensci",
    name: "General Science",
    slug: "general-science",
    description: "Focuses on advanced sciences and mathematics, preparing students for STEM fields.",
    imageHint: "science laboratory",
    electiveSubjects: [
      { id: "esub-emath-sci", name: "Elective Mathematics", slug: "elective-mathematics", description: "Advanced mathematical concepts for science.", topics: fullElectiveMathTopics },
      { id: "esub-phy", name: "Physics", slug: "physics", description: "Study of matter, energy, and their interactions.", topics: fullPhysicsTopics },
      { id: "esub-chem", name: "Chemistry", slug: "chemistry", description: "Study of the composition, structure, properties and change of matter.", topics: fullChemistryTopics },
      { id: "esub-bio", name: "Biology", slug: "biology", description: "The science of life and living organisms.", topics: fullBiologyTopics },
    ],
  },
  {
    id: "prog-genarts",
    name: "General Arts",
    slug: "general-arts",
    description: "Covers humanities, languages, and social sciences for diverse career paths.",
    imageHint: "library books",
    electiveSubjects: [
      { id: "esub-emath-arts", name: "Elective Mathematics", slug: "elective-mathematics", description: "Advanced mathematical concepts for arts and humanities.", topics: fullElectiveMathTopics },
      { id: "esub-lit", name: "Literature in English", slug: "literature-in-english", description: "Study of literary works and criticism.", topics: fullLiteratureTopics },
      { id: "esub-hist", name: "History", slug: "history", description: "Exploration of past events and their significance.", topics: fullHistoryTopics },
      { id: "esub-geo", name: "Geography", slug: "geography", description: "Study of Earth's landscapes, environments, and peoples.", topics: fullGeographyTopics },
      { id: "esub-gov", name: "Government", slug: "government", description: "Understanding political systems and civic responsibilities.", topics: fullGovernmentTopics },
      { id: "esub-econ-arts", name: "Economics", slug: "economics", description: "Principles of production, distribution, and consumption.", topics: fullEconomicsTopics },
      // Add more like French, Ghanaian Language if needed
    ],
  },
  {
    id: "prog-biz",
    name: "Business",
    slug: "business",
    description: "Prepares students for careers in commerce, finance, and administration.",
    imageHint: "office building",
    electiveSubjects: [
      { id: "esub-acc", name: "Financial Accounting", slug: "financial-accounting", description: "Recording and reporting financial transactions, covering topics from basics to company accounts and computerized systems.", topics: fullFinancialAccountingTopics },
      { id: "esub-bman", name: "Business Management", slug: "business-management", description: "Principles of organizing and running a business.", topics: fullBusinessManagementTopics },
      { id: "esub-econ-biz", name: "Economics", slug: "economics", description: "Economic theories and their business applications.", topics: fullEconomicsTopics },
      { id: "esub-emath-biz", name: "Elective Mathematics", slug: "elective-mathematics", description: "Mathematical tools for business analysis.", topics: fullElectiveMathTopics },
    ],
  },
  {
    id: "prog-agricsci",
    name: "Agricultural Science",
    slug: "agricultural-science",
    description: "Studies principles of farming, crop production, and animal husbandry.",
    imageHint: "farm tractor",
    electiveSubjects: [
        {id: "esub-genagric", name: "General Agriculture", slug: "general-agriculture", description: "Fundamentals of agricultural practices.", topics: generalAgricultureTopics},
        {id: "esub-animalhus", name: "Animal Husbandry", slug: "animal-husbandry", description: "Care and breeding of domestic animals.", topics: animalHusbandryTopics},
        {id: "esub-crophus", name: "Crop Husbandry", slug: "crop-husbandry", description: "Cultivation and management of crops.", topics: cropHusbandryTopics},
        { id: "esub-emath-agric", name: "Elective Mathematics", slug: "elective-mathematics", description: "Mathematical applications in agriculture.", topics: fullElectiveMathTopics }, 
        { id: "esub-chem-agric", name: "Chemistry", slug: "chemistry", description: "Chemical principles relevant to agriculture.", topics: fullChemistryTopics }, 
        { id: "esub-phy-agric", name: "Physics", slug: "physics", description: "Physical principles in agricultural systems.", topics: fullPhysicsTopics },
    ],
  },
  {
    id: "prog-visualarts",
    name: "Visual Arts",
    slug: "visual-arts",
    description: "Develops creative skills in various art forms and design.",
    imageHint: "art studio paint",
    electiveSubjects: [
        {id: "esub-gka", name: "General Knowledge in Art", slug: "general-knowledge-art", description: "Theory and history of art.", topics: [{id: "gka-t1", name: "Art History", slug: "gka-art-history", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-graph", name: "Graphic Design", slug: "graphic-design", description: "Visual communication using typography, imagery, and layout.", topics: [{id: "graph-t1", name: "Logo Design", slug: "graph-logo-design", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-text-va", name: "Textiles (Visual Arts)", slug: "textiles-visual-arts", description: "Design and creation of fabrics and textile products for art.", topics: [{id: "text-va-t1", name: "Artistic Weaving", slug: "text-va-weaving", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-sculpt", name: "Sculpture", slug: "sculpture", description: "Creating three-dimensional art forms.", topics: [{id: "sculpt-t1", name: "Clay Modeling", slug: "sculpt-clay", progressValue: 0, gradeLevel: "Elective"}]},
    ],
  },
   {
    id: "prog-homeecon",
    name: "Home Economics",
    slug: "home-economics",
    description: "Focuses on family life, nutrition, textiles, and resource management.",
    imageHint: "kitchen cooking",
    electiveSubjects: [
        {id: "esub-mgmtliv", name: "Management in Living", slug: "management-living", description: "Home and resource management skills.", topics: [{id: "mgmt-t1", name: "Family Budgeting", slug: "mgmt-budgeting", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-foodnut", name: "Food and Nutrition", slug: "food-nutrition", description: "Principles of diet, food preparation, and health.", topics: [{id: "food-t1", name: "Balanced Diets", slug: "food-balanced-diets", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-cloth-he", name: "Clothing and Textiles (Home Econ)", slug: "clothing-textiles-home-econ", description: "Garment construction and textile science for home use.", topics: clothingTextilesTopics},
    ],
  },
  {
    id: "prog-tech",
    name: "Technical Studies",
    slug: "technical-studies",
    description: "Provides skills in technical drawing, woodwork, metalwork, and electronics.",
    imageHint: "tools workshop",
    electiveSubjects: [
        {id: "esub-techdraw", name: "Technical Drawing", slug: "technical-drawing", description: "Graphical communication for technical fields.", topics: [{id: "td-t1", name: "Isometric Projection", slug: "td-isometric", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-woodwork", name: "Woodwork", slug: "woodwork", description: "Skills in designing and creating wooden items.", topics: [{id: "wood-t1", name: "Joinery Techniques", slug: "wood-joinery", progressValue: 0, gradeLevel: "Elective"}]},
        {id: "esub-metalwork", name: "Metalwork", slug: "metalwork", description: "Techniques for shaping and joining metals.", topics: [{id: "metal-t1", name: "Welding Basics", slug: "metal-welding", progressValue: 0, gradeLevel: "Elective"}]},
        // Consider adding Basic Electronics if part of standard Technical Studies
    ],
  },
  {
    id: "prog-ict-computing",
    name: "ICT / Computing",
    slug: "ict-computing",
    description: "Specialized training in computer programming, hardware, networking, and data processing.",
    imageHint: "computer circuit board",
    electiveSubjects: [
        {id: "esub-compprog", name: "Computer Programming", slug: "computer-programming", description: "Fundamentals of software development.", topics: computerProgrammingTopics},
        {id: "esub-hardwarenet", name: "Hardware & Networking", slug: "hardware-networking", description: "Understanding computer systems and networks.", topics: hardwareNetworkingTopics},
        {id: "esub-dataproc", name: "Data Processing", slug: "data-processing", description: "Managing and analyzing digital information.", topics: dataProcessingTopics},
        {id: "esub-appliedict", name: "Applied ICT", slug: "applied-ict", description: "Practical application of ICT tools and techniques.", topics: appliedICTTopics},
    ],
  },
];

// Helper function to get programme by slug
export const getProgrammeBySlug = (slug: string): Programme | undefined => {
  return shsProgrammes.find(p => p.slug === slug);
};

// Helper function to get subject by slug (from core or a programme's electives for a specific programme context)
export const getSubjectDetails = (programmeSlug: string, subjectSlug: string): Subject | undefined => {
  // Check core subjects first
  const coreMatch = coreSubjects.find(s => s.slug === subjectSlug);
  if (coreMatch) {
    return coreMatch;
  }

  // Then check elective subjects for the given programme
  const programme = getProgrammeBySlug(programmeSlug);
  if (programme) {
    const electiveMatch = programme.electiveSubjects.find(s => s.slug === subjectSlug);
    if (electiveMatch) {
      return electiveMatch;
    }
  }
  return undefined;
};

// Helper function to get all topics for a specific subject slug (globally unique subject slugs assumed for this helper)
export const getTopicsForSubjectBySlug = (subjectSlug: string): Topic[] => {
  const allSubjects = [...coreSubjects, ...shsProgrammes.flatMap(p => p.electiveSubjects)];
  // This might find multiple subjects if slugs are not unique across all programmes (e.g. Elective Maths)
  // For the purpose of fetching topics, we pick the first one found.
  // A more robust solution would require unique subject IDs or pass programme context.
  const subject = allSubjects.find(s => s.slug === subjectSlug);
  return subject?.topics || [];
};

export interface ResolvedLessonContext {
  topic: Topic;
  subject: Subject;
  programme: Programme; // Programme context is now mandatory
}

export const getResolvedLessonContext = (
  topicSlug: string,
  programmeSlugContext: string,
  subjectSlugContext: string
): ResolvedLessonContext | null => {
  const programme = getProgrammeBySlug(programmeSlugContext);
  if (!programme) {
    console.warn(`[getResolvedLessonContext] Programme not found for slug: ${programmeSlugContext}`);
    return null;
  }

  let subject: Subject | undefined = coreSubjects.find(cs => cs.slug === subjectSlugContext);
  if (!subject) {
    subject = programme.electiveSubjects.find(es => es.slug === subjectSlugContext);
  }

  if (!subject) {
    console.warn(`[getResolvedLessonContext] Subject not found for slug: ${subjectSlugContext} in programme: ${programmeSlugContext}`);
    return null;
  }

  const topic = subject.topics.find(t => t.slug === topicSlug);
  if (!topic) {
    // If topic is not found, it might be because the slug was changed (e.g., deprecated page)
    // Check for known redirects/merges
    if (topicSlug === 'eng-ls-understanding-spoken-texts' || topicSlug === 'eng-rw-inferences-conclusions') {
      const newTopic = subject.topics.find(t => t.slug === 'eng-rw-reading-comprehension');
      if (newTopic) {
        return { topic: newTopic, subject, programme };
      }
    }
     if (topicSlug === 'is-dm-matter-changes') {
      const newTopic = subject.topics.find(t => t.slug === 'is-dm-matter-states-properties');
      if (newTopic) {
        return { topic: newTopic, subject, programme };
      }
    }
     if (topicSlug === 'sst-es-ed-concepts-dev-underdev') {
        const newTopic = subject.topics.find(t => t.slug === 'sst-sed-ed-concepts-dev-underdev');
        if (newTopic) {
            return { topic: newTopic, subject, programme };
        }
    }


    console.warn(`[getResolvedLessonContext] Topic with slug "${topicSlug}" not found in subject: ${subjectSlugContext}`);
    return null;
  }

  return { topic, subject, programme };
};


export interface TopicWithAncestors {
  topic: Topic;
  subject: Subject;
  programme?: Programme; // Undefined if subject is core and no specific programme context is needed
}

export const getTopicWithAncestors = (topicSlug: string): TopicWithAncestors | null => {
  // Search in core subjects first
  for (const coreSub of coreSubjects) {
    const topic = coreSub.topics.find(t => t.slug === topicSlug);
    if (topic) {
      // For core subjects, we might not have a single specific programme.
      // We can either leave programme undefined, or pick a default/common one.
      // For linking from homepage or general contexts, picking a default is okay if URLs need it.
      const defaultProgramme = shsProgrammes.find(p => p.slug === "general-arts") || (shsProgrammes.length > 0 ? shsProgrammes[0] : undefined);
      return { topic, subject: coreSub, programme: defaultProgramme };
    }
  }

  // Search in elective subjects within programmes
  for (const prog of shsProgrammes) {
    for (const electiveSub of prog.electiveSubjects) {
      const topic = electiveSub.topics.find(t => t.slug === topicSlug);
      if (topic) {
        return { topic, subject: electiveSub, programme: prog };
      }
    }
  }
  console.warn(`[getTopicWithAncestors] Topic with slug "${topicSlug}" not found in any core or elective subject.`);
  return null;
};

// Helper function to get SHS subject by slug
export const getSHSSubjectBySlug = (slug: string): Subject | null => {
  // Search in core subjects
  const coreSubject = coreSubjects.find(s => s.slug === slug);
  if (coreSubject) return coreSubject;

  // Search in elective subjects within programmes
  for (const prog of shsProgrammes) {
    const electiveSubject = prog.electiveSubjects.find(s => s.slug === slug);
    if (electiveSubject) return electiveSubject;
  }
  
  return null;
};

// Helper function to get SHS lesson by subject, topic, and lesson slug
export const getSHSLesson = (subjectSlug: string, topicSlug: string, lessonSlug: string): Lesson | null => {
  // Core Mathematics lessons
  if (subjectSlug === 'core-mathematics') {
    const allLessons = [...coreMathSHS1Lessons, ...coreMathSHS2Lessons, ...coreMathSHS3Lessons];

    // Helper to strip shs1-, shs2-, shs3- prefix
    const stripPrefix = (slug: string) => slug.replace(/^shs[123]-/, '');
    const strippedTopicSlug = stripPrefix(topicSlug);
    const strippedLessonSlug = stripPrefix(lessonSlug);

    // 1. Try exact match first
    let match = allLessons.find(lesson => 
      lesson.slug === lessonSlug || 
      lesson.slug === topicSlug
    );
    if (match) return match;

    // 2. Try with shs3- prefix (for lessons like 'shs3-quadratic-equations')
    match = allLessons.find(lesson =>
      lesson.slug === `shs3-${lessonSlug}` ||
      lesson.slug === `shs3-${topicSlug}` ||
      lesson.slug === `shs2-${lessonSlug}` ||
      lesson.slug === `shs2-${topicSlug}` ||
      lesson.slug === `shs1-${lessonSlug}` ||
      lesson.slug === `shs1-${topicSlug}`
    );
    if (match) return match;

    // 3. Try stripped versions (for topics like 'shs3-factorization' matching lesson 'factorization')
    match = allLessons.find(lesson =>
      lesson.slug === strippedLessonSlug ||
      lesson.slug === strippedTopicSlug
    );
    if (match) return match;

    return null;
  }
  
  // Integrated Science lessons
  if (subjectSlug === 'integrated-science') {
    const allLessons = [...integratedScienceSHS1Lessons, ...integratedScienceSHS2Lessons, ...integratedScienceSHS3Lessons];

    // Helper to strip shs1-, shs2-, shs3- prefix
    const stripPrefix = (slug: string) => slug.replace(/^shs[123]-/, '');
    const strippedTopicSlug = stripPrefix(topicSlug);
    const strippedLessonSlug = stripPrefix(lessonSlug);

    // 1. Try exact match first
    let match = allLessons.find(lesson => 
      lesson.slug === lessonSlug || 
      lesson.slug === topicSlug
    );
    if (match) return match;

    // 2. Try with shs prefix (for lessons like 'is-shs1-chem-1')
    match = allLessons.find(lesson =>
      lesson.slug === `is-shs1-${lessonSlug}` ||
      lesson.slug === `is-shs1-${topicSlug}` ||
      lesson.slug === `is-shs2-${lessonSlug}` ||
      lesson.slug === `is-shs2-${topicSlug}` ||
      lesson.slug === `is-shs3-${lessonSlug}` ||
      lesson.slug === `is-shs3-${topicSlug}`
    );
    if (match) return match;

    // 3. Try stripped versions
    match = allLessons.find(lesson =>
      lesson.slug === strippedLessonSlug ||
      lesson.slug === strippedTopicSlug
    );
    if (match) return match;

    return null;
  }
  
  return null;
};
