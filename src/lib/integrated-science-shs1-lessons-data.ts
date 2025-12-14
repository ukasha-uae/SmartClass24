// SHS 1 Integrated Science Lessons - NaCCA Standards-Based Curriculum
// Comprehensive lesson content aligned with GES/NaCCA curriculum

import type { Lesson, Quiz } from '@/lib/types';

export const integratedScienceSHS1Lessons: Lesson[] = [
  // Unit 1: Diversity of Matter - Chemistry Introduction
  {
    id: 'is-shs1-chem-1',
    slug: 'chem-shs1-intro-nature-scope',
    title: 'Nature and Scope of Chemistry',
    objectives: [
      'Define chemistry and explain its importance in everyday life',
      'Identify the main branches of chemistry',
      'Explain how chemistry relates to other sciences',
      'Recognize careers and applications of chemistry in Ghana',
      'Understand the role of chemistry in sustainable development',
      'Appreciate the contributions of famous chemists'
    ],
    introduction: `Chemistry is everywhere around us! From the food we eat to the clothes we wear, from the medicines that heal us to the fuels that power our vehicles - chemistry is at work. Chemistry is the branch of science that studies matter, its properties, composition, structure, and the changes it undergoes during chemical reactions.

In Ghana, chemistry plays crucial roles in:
 **Agriculture:** Fertilizers, pesticides, soil analysis
 **Industry:** Manufacturing soap, textiles, plastics, cement
 **Healthcare:** Drug development, medical diagnostics
 **Mining:** Gold extraction, mineral processing
 **Environment:** Water purification, waste treatment

Understanding chemistry helps you make informed decisions about products you use daily, understand environmental issues, and pursue careers in science, medicine, engineering, pharmacy, and technology. This lesson introduces you to the fascinating world of chemistry and its scope.`,

    keyConcepts: [
      {
        title: '1. What is Chemistry',
        content: `**Definition:** Chemistry is the scientific study of matter, its properties, composition, structure, and the changes it undergoes during chemical reactions.

**Matter** is anything that has mass and occupies space. Everything you can see, touch, smell, or taste is matter - water, air, food, rocks, even your own body!

**Key Focus Areas:**
 **Composition:** What substances are made of
 **Properties:** How substances behave and what characteristics they have
 **Structure:** How atoms and molecules are arranged
 **Changes:** How substances transform into new substances

**Why Study Chemistry**
 Understand the world around you scientifically
 Make informed decisions about health, environment, and products
 Develop problem-solving and analytical skills
 Prepare for careers in science, medicine, engineering, pharmacy
 Contribute to solving global challenges (energy, health, environment)

**Chemistry in Daily Life:**
 Cooking food involves chemical reactions (baking, frying, fermentation)
 Soap and detergents clean through chemical processes
 Batteries provide electricity through chemical reactions
 Photosynthesis in plants converts CO2 and water to food
 Rusting of iron is a chemical change`
      },
      {
        title: '2. Branches of Chemistry',
        content: `Chemistry is divided into main branches based on the types of matter studied and applications:

**1. Organic Chemistry**
 Studies carbon-containing compounds
 Focus: Hydrocarbons, plastics, drugs, dyes, fuels
 Applications: Petroleum industry, pharmaceuticals, textiles
 Example: Structure of glucose (C2H22O2), synthesis of medicines

**2. Inorganic Chemistry**
 Studies all elements and compounds except most carbon compounds
 Focus: Metals, minerals, salts, acids, bases
 Applications: Cement production, ceramics, mining, catalysts
 Example: Common salt (NaCl), sulfuric acid (H2SO2)

**3. Physical Chemistry**
 Studies the physical properties and behavior of matter
 Focus: Energy changes, reaction rates, equilibrium
 Applications: Battery technology, thermodynamics, spectroscopy
 Example: Why ice floats on water, how fast reactions occur

**4. Analytical Chemistry**
 Studies methods to identify and quantify substances
 Focus: Qualitative and quantitative analysis
 Applications: Drug testing, water quality analysis, forensic science
 Example: Testing gold purity, detecting contaminants in food

**5. Biochemistry**
 Studies chemical processes in living organisms
 Focus: Proteins, carbohydrates, lipids, DNA
 Applications: Medicine, nutrition, genetics, agriculture
 Example: How enzymes work, digestion of food

**Other Specialized Branches:**
 **Environmental Chemistry:** Pollution, waste management
 **Industrial Chemistry:** Large-scale chemical production
 **Agricultural Chemistry:** Fertilizers, pesticides, soil science
 **Medicinal Chemistry:** Drug design and development`
      },
      {
        title: '3. Chemistry and Other Sciences',
        content: `Chemistry is called the "central science" because it connects and supports other scientific disciplines:

**Chemistry and Physics:**
 Both study matter and energy
 Atomic structure combines chemistry and physics
 Spectroscopy uses physics principles to analyze chemical composition
 Example: Radioactivity involves both nuclear physics and chemistry

**Chemistry and Biology:**
 Life processes are chemical reactions
 Biochemistry bridges both sciences
 Photosynthesis and respiration are chemical processes
 Example: DNA structure, protein synthesis, enzyme action

**Chemistry and Geology:**
 Earth's composition studied through chemistry
 Mineral formation involves chemical processes
 Rock weathering is chemical change
 Example: Formation of limestone caves by acid erosion

**Chemistry and Agriculture:**
 Soil chemistry affects crop growth
 Fertilizers provide essential nutrients (N, P, K)
 Pesticides control pests through chemical action
 Example: pH testing of soil, nutrient management

**Chemistry and Medicine:**
 Drugs are chemical compounds
 Body functions involve biochemical reactions
 Medical diagnostics use chemical tests
 Example: Blood glucose testing, antibiotic action

**Chemistry and Environmental Science:**
 Air and water quality involve chemical analysis
 Pollution is often chemical contamination
 Climate change relates to greenhouse gases
 Example: Carbon dioxide levels, ozone layer depletion`
      },
      {
        title: '4. Careers and Applications in Ghana',
        content: `Chemistry knowledge opens doors to numerous career opportunities in Ghana:

**Healthcare Sector:**
 **Pharmacist:** Prepare and dispense medicines
 **Medical Laboratory Scientist:** Conduct diagnostic tests
 **Nurse:** Administer drugs, understand medication
 **Biomedical Scientist:** Research diseases and treatments

**Industry:**
 **Chemical Engineer:** Design chemical production processes
 **Quality Control Officer:** Test product quality and safety
 **Petroleum Engineer:** Oil and gas extraction and refining
 **Food Technologist:** Food processing and preservation

**Agriculture:**
 **Agronomist:** Soil and crop management
 **Fertilizer Specialist:** Nutrient management
 **Pest Control Officer:** Safe pesticide application
 **Agricultural Extension Officer:** Educate farmers

**Mining:**
 **Metallurgist:** Extract and purify metals
 **Assayer:** Test ore and metal purity
 **Mine Chemist:** Analyze minerals and ores
 **Environmental Officer:** Monitor mining impact

**Education:**
 **Science Teacher:** Teach chemistry at various levels
 **Lecturer:** University-level teaching and research
 **Curriculum Developer:** Design science programs

**Environmental Protection:**
 **Environmental Chemist:** Monitor pollution
 **Water Treatment Specialist:** Ensure water safety
 **Waste Management Officer:** Handle chemical waste

**Research and Development:**
 **Research Scientist:** Discover new compounds and processes
 **Forensic Scientist:** Analyze crime scene evidence
 **Cosmetic Chemist:** Develop beauty products

**Key Industries in Ghana Using Chemistry:**
 Cocoa processing (chocolate, cocoa butter)
 Gold mining and refining
 Pharmaceutical manufacturing
 Soap and detergent production
 Cement manufacturing
 Brewery and soft drink production
 Oil refining (Tema Oil Refinery)`
      },
      {
        title: '5. Famous Chemists and Their Contributions',
        content: `**International Contributors:**

**Antoine Lavoisier (1743-1794) - "Father of Modern Chemistry"**
 Discovered the law of conservation of mass
 Named oxygen and hydrogen
 Helped establish the metric system

**John Dalton (1766-1844)**
 Proposed atomic theory (1808)
 Elements are made of tiny indivisible atoms
 Atoms of same element are identical

**Dmitri Mendeleev (1834-1907)**
 Created the Periodic Table (1869)
 Predicted properties of undiscovered elements
 Organized elements by atomic mass and properties

**Marie Curie (1867-1934)**
 Discovered radioactive elements polonium and radium
 First woman to win Nobel Prize (twice!)
 Pioneer in radioactivity research

**Linus Pauling (1901-1994)**
 Nature of chemical bonds
 Molecular structure research
 Only person to win two unshared Nobel Prizes

**African and Ghanaian Contributors:**

**Prof. Francis Allotey (Ghana, 1932-2017)**
 Mathematical physicist and chemist
 Pioneered soft X-ray spectroscopy in Africa
 Established nuclear science programs in Ghana

**Prof. Samuel Agyei Kankam (Ghana)**
 Research in analytical chemistry
 Environmental chemistry contributions
 Trained many Ghanaian chemists

**Dr. Angelina Konadu (Ghana)**
 Pharmaceutical chemistry research
 Drug development and quality control
 Women in science advocacy

**Importance of Studying Chemistry in Ghana:**
 Support national development in mining, agriculture, healthcare
 Contribute to solving local challenges (water quality, sanitation)
 Reduce dependence on imported chemicals
 Create jobs and entrepreneurship opportunities
 Address environmental issues sustainably`
      }
    ],

    pastQuestions: [
      {
        year: '2019',
        question: 'State three importance of studying chemistry.',
        solution: `Three importance of studying chemistry:

1. **Understanding Daily Life:** Chemistry helps us understand everyday processes like cooking, cleaning, and how our bodies work. This knowledge helps us make informed decisions about products and health.

2. **Career Opportunities:** Chemistry opens doors to many careers in healthcare (pharmacy, medicine), industry (manufacturing, mining), agriculture (fertilizers, pesticides), and research.

3. **Solving Global Problems:** Chemistry is essential for addressing challenges like clean water, renewable energy, disease treatment, food security, and environmental protection.

**Alternative answers (any three are acceptable):**
 Develop analytical and problem-solving skills
 Understand and protect the environment
 Contribute to technological advancement
 Make informed consumer choices
 Support national development through industry and agriculture`
      },
      {
        year: '2021',
        question: 'Distinguish between organic chemistry and inorganic chemistry.',
        solution: `**Organic Chemistry:**
 Studies carbon-containing compounds (except CO2, carbonates)
 Focuses on compounds with C-H bonds
 Examples: Plastics, fuels, drugs, proteins, sugars
 Applications: Petroleum industry, pharmaceuticals, textiles

**Inorganic Chemistry:**
 Studies all other elements and their compounds
 Includes metals, minerals, salts, acids, bases
 Examples: Common salt (NaCl), sulfuric acid (H2SO2), iron oxide
 Applications: Cement, ceramics, mining, catalysts

**Key Differences:**
| Aspect | Organic Chemistry | Inorganic Chemistry |
|--------|------------------|---------------------|
| Main element | Carbon | All except most carbon |
| Bonding | Covalent bonds | Ionic and covalent |
| Reactions | Often slower | Often faster |
| Melting points | Generally lower | Often higher |`
      },
      {
        year: '2022',
        question: 'Explain why chemistry is called the "central science."',
        solution: `Chemistry is called the **"central science"** because it connects and bridges other scientific disciplines:

**1. Links Physical and Biological Sciences:**
 Chemistry studies matter at atomic/molecular level
 This understanding is essential for both physics and biology
 Biochemistry bridges chemistry and biology

**2. Supports Other Sciences:**
 **Physics:** Atomic structure, energy, spectroscopy
 **Biology:** Life processes are chemical reactions
 **Geology:** Rock and mineral composition and formation
 **Medicine:** Drugs are chemicals, body functions are biochemical
 **Agriculture:** Soil chemistry, fertilizers, photosynthesis

**3. Practical Applications:**
 Every science field uses chemistry principles
 Environmental science depends on chemical analysis
 Materials science combines chemistry with engineering

**Example:** Understanding photosynthesis requires:
 Chemistry: Chemical reactions, molecular structures
 Biology: Plant cell structure and function
 Physics: Light energy absorption
 Environmental science: CO2 cycles, oxygen production

Therefore, chemistry sits at the center, connecting all sciences together.`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'Which branch of chemistry studies carbon-containing compounds',
          options: ['Inorganic Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
          answer: 'Organic Chemistry',
          explanation: 'Organic chemistry focuses on carbon-containing compounds, including fuels, plastics, medicines, and food molecules like proteins and carbohydrates.'
        },
        {
          type: 'mcq',
          question: 'In Ghana, which industry heavily relies on chemistry for gold extraction',
          options: ['Textile industry', 'Mining industry', 'Tourism industry', 'Banking industry'],
          answer: 'Mining industry',
          explanation: 'Ghana\'s mining industry uses chemical processes like cyanide leaching to extract gold from ore. Chemistry is essential for efficient and safe mineral extraction.'
        },
        {
          type: 'mcq',
          question: 'Biochemistry is the study of:',
          options: ['Chemical reactions in living organisms', 'Composition of rocks', 'Properties of metals', 'Atmospheric gases'],
          answer: 'Chemical reactions in living organisms',
          explanation: 'Biochemistry examines chemical processes in living things, including metabolism, enzyme function, DNA structure, and protein synthesis.'
        },
        {
          type: 'mcq',
          question: 'Which famous chemist developed the periodic table',
          options: ['Marie Curie', 'Dmitri Mendeleev', 'Antoine Lavoisier', 'John Dalton'],
          answer: 'Dmitri Mendeleev',
          explanation: 'Dmitri Mendeleev organized elements by atomic weight in 1869, creating the periodic table that predicted undiscovered elements.'
        },
        {
          type: 'truefalse',
          statement: 'Chemistry is called the "central science" because it connects to other scientific disciplines.',
          answer: 'true',
          reason: 'Chemistry bridges physics, biology, geology, and environmental science. Understanding chemical principles is essential for all sciences.'
        },
        {
          type: 'mcq',
          question: 'Which area applies chemistry to solve crimes',
          options: ['Agricultural chemistry', 'Forensic chemistry', 'Industrial chemistry', 'Environmental chemistry'],
          answer: 'Forensic chemistry',
          explanation: 'Forensic chemistry analyzes physical evidence from crime scenes, including DNA, drugs, explosives, and trace materials.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'Which of the following best defines chemistry',
        options: [
          'The study of living organisms',
          'The study of matter, its properties and changes',
          'The study of energy and motion',
          'The study of earth and its formation'
        ],
        answer: 'The study of matter, its properties and changes',
        explanation: 'Chemistry is defined as the study of matter, its properties, composition, structure, and the changes it undergoes. Living organisms are studied in biology, energy and motion in physics, and earth in geology.'
      },
      {
        type: 'mcq',
        question: 'Which branch of chemistry studies carbon-containing compounds',
        options: [
          'Inorganic chemistry',
          'Physical chemistry',
          'Organic chemistry',
          'Analytical chemistry'
        ],
        answer: 'Organic chemistry',
        explanation: 'Organic chemistry is the branch that studies carbon-containing compounds, especially those with C-H bonds. This includes plastics, fuels, drugs, and biological molecules.'
      },
      {
        type: 'mcq',
        question: 'Why is chemistry called the "central science"',
        options: [
          'It is the most important science',
          'It was discovered before other sciences',
          'It connects and supports other scientific disciplines',
          'It only studies chemical reactions'
        ],
        answer: 'It connects and supports other scientific disciplines',
        explanation: 'Chemistry is called the central science because it bridges and connects other sciences like physics, biology, geology, and medicine. Understanding chemistry is essential for these fields.'
      },
      {
        type: 'mcq',
        question: 'Which of these is an application of analytical chemistry',
        options: [
          'Manufacturing plastics',
          'Testing water quality',
          'Studying protein structure',
          'Extracting gold from ore'
        ],
        answer: 'Testing water quality',
        explanation: 'Analytical chemistry focuses on identifying and quantifying substances. Testing water quality uses analytical techniques to detect contaminants and measure purity.'
      },
      {
        type: 'mcq',
        question: 'Which Ghanaian industry heavily relies on chemistry',
        options: [
          'Software development',
          'Gold mining and refining',
          'Tourism',
          'Graphic design'
        ],
        answer: 'Gold mining and refining',
        explanation: 'Gold mining and refining heavily relies on chemistry for extracting gold from ore, purifying it, and testing its quality. Ghana\'s gold industry is a major user of chemical processes.'
      },
      {
        type: 'mcq',
        question: 'Biochemistry is the study of:',
        options: [
          'Chemical reactions in living organisms',
          'Rocks and minerals',
          'Synthetic materials',
          'Energy and thermodynamics'
        ],
        answer: 'Chemical reactions in living organisms',
        explanation: 'Biochemistry studies chemical processes and substances in living organisms, including proteins, carbohydrates, lipids, and DNA. It bridges chemistry and biology.'
      },
      {
        type: 'mcq',
        question: 'Who is known as the "Father of Modern Chemistry"',
        options: [
          'John Dalton',
          'Antoine Lavoisier',
          'Dmitri Mendeleev',
          'Marie Curie'
        ],
        answer: 'Antoine Lavoisier',
        explanation: 'Antoine Lavoisier is called the "Father of Modern Chemistry" for discovering the law of conservation of mass, naming oxygen and hydrogen, and establishing systematic chemical nomenclature.'
      },
      {
        type: 'mcq',
        question: 'Which career requires knowledge of chemistry',
        options: [
          'Lawyer',
          'Architect',
          'Pharmacist',
          'Accountant'
        ],
        answer: 'Pharmacist',
        explanation: 'Pharmacists require extensive chemistry knowledge to understand drug composition, interactions, proper dosage, and medication effects. Chemistry is fundamental to pharmacy practice.'
      }
    ],
    summary: 'Chemistry is the study of matter, its properties, and changes. It includes branches like organic, inorganic, physical, analytical, and biochemistry. Chemistry connects with other sciences and is essential for careers in healthcare, industry, agriculture, mining, and research. Famous chemists like Lavoisier, Dalton, and Mendeleev made groundbreaking contributions. Understanding chemistry helps solve real-world problems in Ghana and globally.'
  },

  {
    id: 'is-shs1-chem-2',
    slug: 'chem-shs1-intro-scientific-methods-safety',
    title: 'Scientific Methods & Safety',
    objectives: [
      'Understand the steps of the scientific method',
      'Apply the scientific method to solve problems',
      'Identify laboratory apparatus and their uses',
      'Explain laboratory safety rules and their importance',
      'Recognize common hazard symbols',
      'Demonstrate safe handling of chemicals and equipment'
    ],
    introduction: `Science is not just about facts and formulas - it's a systematic way of investigating the world around us! The scientific method is the foundation of all scientific inquiry, helping us ask questions, make observations, form hypotheses, conduct experiments, and draw conclusions based on evidence.

In Ghana's science laboratories - from schools to research institutions, hospitals to industries - safety is paramount. Every year, accidents occur because of improper handling of chemicals or equipment. Understanding and following safety protocols protects you, your classmates, and the environment.

This lesson introduces you to:
 How scientists think and work systematically
 The steps of conducting a scientific investigation
 Essential laboratory equipment and their proper use
 Critical safety rules that must ALWAYS be followed
 How to recognize and respond to hazards

Whether you become a scientist, doctor, engineer, or farmer, the scientific method and safety awareness will serve you throughout life.`,

    keyConcepts: [
      {
        title: '1. The Scientific Method',
        content: `The scientific method is a systematic approach to investigating questions and solving problems. It ensures results are reliable and can be reproduced.

**The Six Steps:**

**Step 1: OBSERVATION**
 Notice something interesting or unusual
 Use your senses to gather information
 Example: "The mango tree in my compound produces more fruits than my neighbor's"

**Step 2: QUESTION**
 Form a clear, specific question about what you observed
 The question should be testable
 Example: "Does the type of fertilizer affect mango fruit production"

**Step 3: HYPOTHESIS**
 Make an educated guess to answer your question
 Based on prior knowledge or research
 Must be testable and falsifiable
 Example: "If organic fertilizer is used, then the mango tree will produce more fruits than with chemical fertilizer"

**Step 4: EXPERIMENT**
 Design a test to check if your hypothesis is correct
 Control variables (keep most things the same)
 Change only one variable (independent variable)
 Measure the result (dependent variable)
 Example: Apply organic fertilizer to one tree, chemical to another, none to a third; count fruits after harvest

**Step 5: ANALYSIS**
 Collect and organize your data (numbers, observations)
 Look for patterns or trends
 Use tables, graphs, or charts
 Calculate averages or percentages if needed
 Example: Tree with organic fertilizer produced 150 fruits, chemical fertilizer 120 fruits, no fertilizer 80 fruits

**Step 6: CONCLUSION**
 State whether your hypothesis was supported or not
 Explain what the data shows
 Suggest further experiments or improvements
 Example: "The hypothesis is supported - organic fertilizer led to highest fruit production"

**Important Concepts:**

**Variables:**
 **Independent variable:** What you change (type of fertilizer)
 **Dependent variable:** What you measure (number of fruits)
 **Controlled variables:** What you keep the same (water, sunlight, tree age, soil type)

**Control Group:**
 The standard for comparison (tree with no fertilizer)
 Helps determine if your treatment actually made a difference

**Reliability:**
 Repeat experiments multiple times
 Test on multiple trees or samples
 Get consistent results

**Validity:**
 Your experiment actually tests what you intended
 All variables properly controlled

**Example Investigation:**

**Question:** "Does the amount of sunlight affect plant growth"

**Hypothesis:** "If plants receive more sunlight, they will grow taller."

**Experiment:**
 Get 3 identical bean seedlings
 Plant A: Full sunlight (8 hours/day)
 Plant B: Partial sunlight (4 hours/day)
 Plant C: No direct sunlight (shade)
 Keep water, soil, pot size the same
 Measure height weekly for 4 weeks

**Variables:**
 Independent: Amount of sunlight
 Dependent: Plant height
 Controlled: Water, soil type, pot size, plant species, temperature

**Data Collection:**
Create a table tracking height weekly for all three plants

**Analysis:**
Graph the results - which plant grew tallest

**Conclusion:**
State whether more sunlight led to taller plants, explaining your evidence`
      },
      {
        title: '2. Laboratory Apparatus and Their Uses',
        content: `**Glassware for Measuring:**

**1. Beaker**
 Cylindrical container with spout
 Used for: Holding and mixing liquids, heating substances
 Sizes: 50mL, 100mL, 250mL, 500mL, 1000mL
 Not very accurate for measuring

**2. Measuring Cylinder (Graduated Cylinder)**
 Tall, narrow cylinder with graduations
 Used for: Accurately measuring volumes of liquids
 Read at eye level at the bottom of meniscus (curve)
 More accurate than beaker

**3. Volumetric Flask**
 Flask with flat bottom and long narrow neck
 Used for: Preparing solutions of exact concentration
 Has a single graduation mark on neck
 Very accurate

**4. Burette**
 Long tube with tap at bottom and graduations
 Used for: Delivering precise volumes in titrations
 Can measure to 0.05 mL accuracy
 Read from top (0) to bottom

**5. Pipette**
 Tube for transferring exact volumes
 Used for: Moving precise liquid amounts
 Graduated or volumetric types
 Use with pipette filler (never mouth!)

**Glassware for Reactions:**

**6. Test Tube**
 Small glass tube, rounded bottom
 Used for: Small-scale reactions, holding samples
 Heat gently, never point at anyone

**7. Conical Flask (Erlenmeyer Flask)**
 Cone-shaped with flat bottom
 Used for: Mixing, heating, titrations
 Can swirl without spilling

**8. Round-Bottom Flask**
 Spherical flask
 Used for: Distillation, heating with even temperature
 Must use in retort stand, not flat surface

**9. Flat-Bottom Flask**
 Flask with flat base
 Used for: Heating, reactions
 Can stand on bench

**Heating Equipment:**

**10. Bunsen Burner**
 Gas burner with adjustable flame
 Blue flame: Complete combustion (hotter)
 Yellow flame: Incomplete combustion (cooler, sootier)
 Control with air hole

**11. Tripod Stand**
 Three-legged metal stand
 Used for: Supporting beakers/flasks during heating
 Place wire gauze on top

**12. Wire Gauze**
 Metal mesh with ceramic center
 Used for: Distributing heat evenly
 Place between flame and glassware

**13. Spirit Lamp**
 Lamp burning methylated spirit
 Used for: Gentle heating
 Safer alternative to Bunsen burner

**Holding and Supporting:**

**14. Retort Stand (Clamp Stand)**
 Vertical rod with heavy base
 Used for: Holding apparatus in place
 Attach clamps or rings

**15. Clamp and Boss Head**
 Metal clamp on adjustable holder
 Used for: Gripping glassware securely
 Essential for distillation setups

**16. Test Tube Holder/Tongs**
 Spring-loaded metal grip
 Used for: Holding hot test tubes safely
 Prevents burns

**Weighing:**

**17. Electronic Balance**
 Digital weighing device
 Used for: Measuring mass accurately
 Zero before use

**18. Beam Balance**
 Mechanical balance with sliding weights
 Used for: Measuring mass
 More robust than electronic

**Filtering:**

**19. Filter Funnel**
 Cone-shaped funnel
 Used with: Filter paper for separating solids from liquids

**20. Filter Paper**
 Porous paper
 Used for: Trapping solids while liquid passes through
 Fold into cone shape

**Other Important Equipment:**

**21. Spatula**
 Small spoon-like tool
 Used for: Transferring solid chemicals

**22. Stirring Rod**
 Glass or plastic rod
 Used for: Mixing solutions, guiding liquid flow

**23. Dropper/Pipette Dropper**
 Rubber bulb with glass tube
 Used for: Adding small amounts of liquid

**24. Mortar and Pestle**
 Bowl and grinding tool
 Used for: Crushing solids into powder

**25. Thermometer**
 Temperature measuring device
 Types: Mercury or alcohol-filled, digital
 Handle carefully - fragile!

**26. Watch Glass**
 Shallow dish
 Used for: Evaporating small amounts, covering beakers

**27. Crucible and Lid**
 Small pot for high-temperature heating
 Used for: Heating solids to very high temperatures

**28. Evaporating Dish**
 Shallow dish
 Used for: Evaporating liquids to obtain solid

**29. Desiccator**
 Container with drying agent
 Used for: Storing moisture-sensitive substances

**30. Wash Bottle**
 Squeeze bottle with nozzle
 Used for: Rinsing equipment with distilled water`
      },
      {
        title: '3. Laboratory Safety Rules',
        content: `**GENERAL SAFETY RULES - MUST ALWAYS FOLLOW:**

**Before Entering the Lab:**
1. **Dress Code:**
    Wear lab coat or apron
    Closed-toe shoes (no sandals!)
    Tie back long hair
    Remove loose jewelry
    Roll up sleeves

2. **Know the Lab:**
    Location of fire extinguisher
    Location of first aid kit
    Location of fire blanket
    Location of eye wash station
    Location of safety shower
    Location of emergency exits

3. **Read Instructions:**
    Understand procedure before starting
    Ask questions if unsure
    Know hazards of chemicals you'll use

**During the Experiment:**

4. **Work Carefully:**
    Never rush or run in the lab
    Work at assigned station only
    Keep workspace clean and organized
    Report spills immediately
    Don't leave experiments unattended

5. **Handling Chemicals:**
    Never taste chemicals (even if they look like food!)
    Never smell directly - waft gently toward nose
    Never touch with bare hands unless instructed
    Use small amounts (don't waste)
    Return chemicals to proper place
    Never return excess to stock bottle (contamination risk)

6. **Using Equipment:**
    Check glassware for cracks before use
    Point test tubes away from yourself and others when heating
    Use test tube holder for hot test tubes
    Never use chipped or cracked glassware
    Heat gradually, not sudden high heat

7. **Eye and Face Protection:**
    Wear safety goggles when handling chemicals
    Keep goggles on until experiment complete
    If chemical splashes in eyes, wash immediately for 15 minutes

8. **Fire Safety:**
    Know how to use fire extinguisher
    If clothing catches fire: STOP, DROP, ROLL
    Never panic
    Use fire blanket to smother flames
    Turn off Bunsen burner when not in use

**After the Experiment:**

9. **Cleanup:**
    Wash all equipment used
    Wipe work surface clean
    Dispose of waste properly (not in sink unless told)
    Return chemicals and equipment to proper places
    Wash hands thoroughly with soap

10. **Waste Disposal:**
     Follow teacher's instructions
     Separate types of waste
     Never pour chemicals down sink without permission
     Use designated waste containers
     Don't mix incompatible waste

**WHAT NEVER TO DO IN THE LAB:**

❌ **Never eat or drink** in the laboratory
❌ **Never apply cosmetics** in the lab
❌ **Never put pens or fingers in mouth**
❌ **Never perform unauthorized experiments**
❌ **Never work alone** without supervision
❌ **Never pipette by mouth** - use pipette filler
❌ **Never heat closed containers** - may explode
❌ **Never add water to concentrated acid** - reverse it!
❌ **Never look directly into tube being heated**
❌ **Never leave Bunsen burner flame unattended**

**First Aid Basics:**

**Burns:**
 Immediately cool under running water for 10-15 minutes
 Don't apply ice directly
 Cover with sterile dressing
 Seek medical attention for serious burns

**Chemical Spills on Skin:**
 Rinse affected area with plenty of water (15 minutes)
 Remove contaminated clothing
 Inform teacher immediately
 Seek medical attention if irritation persists

**Chemical in Eyes:**
 Rinse immediately with eye wash for 15 minutes
 Keep eyes open while rinsing
 Don't rub eyes
 Seek medical attention immediately

**Cuts:**
 Rinse with water
 Apply pressure with clean cloth
 Bandage after bleeding stops
 Inform teacher

**Inhalation of Fumes:**
 Move to fresh air immediately
 Sit up for easier breathing
 Inform teacher
 Seek medical attention if breathing difficulty

**Swallowed Chemical:**
 Do NOT induce vomiting (may cause more harm)
 Rinse mouth with water
 Inform teacher IMMEDIATELY
 Seek emergency medical attention
 Bring chemical label/bottle if possible

**Remember:**
 Better safe than sorry!
 When in doubt, ASK
 Report ALL accidents, even small ones
 Your safety and your classmates' safety depend on following rules`
      },
      {
        title: '4. Chemical Hazard Symbols',
        content: `Chemicals have hazard symbols warning of dangers. Learn to recognize and understand these symbols:

**Common Hazard Symbols:**

**1. CORROSIVE** (Test tube dripping on hand and surface)
 Chemicals that burn or destroy living tissue and materials
 Examples: Concentrated acids (H2SO2, HCl), concentrated bases (NaOH)
 Safety: Wear gloves, goggles; handle with care; if spills occur, rinse immediately

**2. FLAMMABLE/HIGHLY FLAMMABLE** (Flame symbol)
 Catches fire easily
 Examples: Ethanol, acetone, petrol, methanol
 Safety: Keep away from flames, sparks, heat; use in well-ventilated area

**3. TOXIC/POISONOUS** (Skull and crossbones)
 Can cause death or serious illness if swallowed, inhaled, or absorbed
 Examples: Cyanides, mercury compounds, arsenic
 Safety: Avoid contact; use in fume hood; wash hands thoroughly after use

**4. HARMFUL/IRRITANT** (X symbol)
 Less dangerous than toxic but can cause health problems
 May irritate skin, eyes, or respiratory system
 Examples: Bleach, ammonia solution
 Safety: Avoid prolonged contact; wear gloves

**5. OXIDIZING** (Flame over circle)
 Provides oxygen, making other materials burn more fiercely
 Can cause or intensify fires
 Examples: Hydrogen peroxide (H2O2), potassium nitrate (KNO2)
 Safety: Keep away from flammable materials

**6. EXPLOSIVE** (Exploding bomb)
 Can explode from heat, friction, or shock
 Examples: TNT, some peroxides
 Safety: Handle with extreme care; avoid heat, friction, impact

**7. ENVIRONMENTAL HAZARD** (Dead tree and fish)
 Harmful to aquatic life and environment
 Examples: Heavy metal solutions, pesticides
 Safety: Dispose properly; don't pour down drain

**8. GAS UNDER PRESSURE** (Gas cylinder)
 Compressed, liquefied, or dissolved gases
 Examples: Oxygen cylinders, CO2 cylinders
 Safety: Secure properly; protect from heat; handle carefully

**Signal Words:**

**DANGER** - Severe hazard
**WARNING** - Less severe hazard
**CAUTION** - Least severe hazard

**Precautionary Statements (P-codes):**
 P264: Wash hands thoroughly after handling
 P280: Wear protective gloves/clothing/eye protection
 P301+P312: IF SWALLOWED: Call a POISON CENTER/doctor
 P305+P351+P338: IF IN EYES: Rinse cautiously with water for several minutes

**Storage Labels Should Include:**
 Chemical name
 Concentration (if solution)
 Hazard symbols
 Safety precautions
 Date opened
 Expiry date (if applicable)

**Color Coding (Some Labs Use):**
 Red: Flammable
 Yellow: Oxidizer
 Blue: Health hazard
 White: Corrosive
 Green: Safe/low hazard

**Reading Chemical Labels:**
Always read labels before using chemicals!
 Name and formula
 Concentration
 Hazards
 First aid measures
 Safe handling procedures
 Storage requirements

**Emergency Numbers (Ghana):**
 National Ambulance Service: 193
 Police Emergency: 191
 Fire Service: 192

**Remember: If you don't recognize a hazard symbol or are unsure about a chemical, ALWAYS ask your teacher before proceeding!**`
      },
      {
        title: '5. Good Laboratory Practices',
        content: `**Personal Protective Equipment (PPE):**

**1. Lab Coat or Apron:**
 Protects clothing and skin from spills
 Should be cotton or other non-synthetic material
 Button/zip up completely
 Remove before leaving lab

**2. Safety Goggles:**
 Protect eyes from splashes, particles, fumes
 Wear throughout entire experiment
 Even if you're not handling chemicals directly
 Regular glasses are NOT enough protection

**3. Gloves:**
 Latex or nitrile gloves for chemicals
 Heat-resistant gloves for hot objects
 Change if torn or contaminated
 Dispose properly after use

**4. Closed-toe Shoes:**
 Protect feet from spills and dropped equipment
 No sandals, slippers, or open-toed shoes
 Sturdy shoes preferred

**Laboratory Hygiene:**

 Wash hands before and after lab work
 Don't touch face, eyes, or mouth with lab hands
 Keep nails short and clean
 Don't use lab equipment for personal items

**Proper Handling Techniques:**

**Pouring Liquids:**
 Hold container with label facing palm (protect label from drips)
 Pour slowly and carefully
 Use stirring rod to guide liquid if needed
 Never pour into container you're holding - set it down

**Reading Meniscus:**
 Read at eye level
 Bottom of curve for most liquids
 Top of curve for mercury

**Diluting Concentrated Acids:**
 **ALWAYS add acid to water, NEVER water to acid**
 Remember: "Do as you ought-a, add acid to water"
 Water to acid can cause violent boiling and splattering
 Add slowly with stirring
 Solution heats up - use heat-resistant container

**Smelling Chemicals:**
 NEVER smell directly from container
 Use wafting motion - wave hand over container toward nose
 Take small sniff only
 Many chemicals should never be smelled

**Tasting Chemicals:**
 **NEVER TASTE** anything in the lab
 Even if it looks like sugar or salt
 This rule has NO exceptions

**Transferring Solids:**
 Use clean, dry spatula
 Take only what you need
 Don't return excess to stock bottle
 Close container immediately after use

**Heating Safely:**

**Test Tubes:**
 Hold at 45-degree angle, pointing away from everyone
 Use test tube holder
 Heat gently with Bunsen burner
 Move in and out of flame, don't hold continuously
 Heat liquid in upper third of tube

**Beakers/Flasks:**
 Use tripod and wire gauze
 Don't heat empty glassware
 Don't heat thick liquids rapidly (may bump/splatter)
 Remove from heat before contents boil over

**Proper Bunsen Burner Use:**
 Check connections before lighting
 Light match before turning on gas
 Adjust air hole for blue (hot) or yellow (cooler) flame
 Never leave flame unattended
 Turn off gas when finished

**Waste Disposal:**

 Follow teacher's specific instructions
 Separate organic and inorganic waste
 Broken glass in special container (not regular trash)
 Never mix incompatible chemicals in waste
 Acidic/basic waste neutralized before disposal
 Heavy metals collected separately

**Clean-up Procedures:**

1. Turn off all gas and water taps
2. Unplug electrical equipment
3. Clean glassware with brush and detergent
4. Rinse with tap water, then distilled water
5. Invert on rack to dry
6. Wipe bench with damp cloth
7. Return all equipment to proper storage
8. Dispose waste properly
9. Wash hands thoroughly

**Accident Response:**

**Small Spills:**
 Alert others nearby
 Wear gloves
 Use spill kit or absorbent material
 Dispose in appropriate waste container
 Clean area thoroughly

**Large Spills:**
 Alert teacher immediately
 Evacuate if dangerous fumes
 Don't try to clean yourself
 Block area to prevent spreading

**Fire:**
 Alert everyone - "Fire!"
 Turn off gas
 If small, use fire extinguisher or fire blanket
 If large, evacuate immediately
 Follow school fire drill procedures

**Electrical Hazards:**
 Don't touch electrical equipment with wet hands
 Report frayed cords or damaged plugs
 Unplug by pulling plug, not cord
 If someone is being shocked, turn off power first (don't touch them!)

**Working with Partners:**

 Communicate clearly
 Divide tasks fairly
 Watch each other for safety
 Help each other learn
 Don't distract or play around

**Golden Rules:**

1. **Prepare:** Read procedure before starting
2. **Protect:** Wear PPE always
3. **Focus:** Pay attention, no distractions
4. **Ask:** When in doubt, ask teacher
5. **Report:** All accidents, even minor ones
6. **Clean:** Leave workspace cleaner than you found it
7. **Learn:** From every experiment and mistake

**Safety is everyone's responsibility!**`
      }
    ],

    pastQuestions: [
      {
        year: '2020',
        question: 'State the steps of the scientific method in the correct order.',
        solution: `The steps of the scientific method in correct order are:

**1. OBSERVATION**
 Use senses to notice something interesting or unusual
 Gather information about the phenomenon

**2. QUESTION**
 Formulate a clear, specific question about what you observed
 The question should be testable

**3. HYPOTHESIS**
 Make an educated guess to answer the question
 Based on prior knowledge or research
 Must be testable and falsifiable

**4. EXPERIMENT**
 Design and conduct a test to check the hypothesis
 Control variables
 Change one variable (independent)
 Measure the effect (dependent)

**5. ANALYSIS**
 Collect and organize data
 Look for patterns using tables, graphs
 Calculate results if needed

**6. CONCLUSION**
 State whether hypothesis was supported or not supported
 Explain what the data shows
 Suggest further research if needed

**Mnemonic to remember:** **O**ur **Q**uiet **H**amster **E**ats **A**pples **C**onstantly
(Observation, Question, Hypothesis, Experiment, Analysis, Conclusion)`
      },
      {
        year: '2021',
        question: 'Explain the difference between independent, dependent, and controlled variables with an example.',
        solution: `**Variables in an Experiment:**

**1. Independent Variable:**
 The variable YOU CHANGE or manipulate
 The "cause" in cause-and-effect
 Plotted on x-axis of graph

**2. Dependent Variable:**
 The variable YOU MEASURE or observe
 The "effect" in cause-and-effect
 Changes in response to independent variable
 Plotted on y-axis of graph

**3. Controlled Variables:**
 Variables YOU KEEP CONSTANT/THE SAME
 Everything except independent variable
 Ensures fair test

**Example Experiment:**
**Question:** "Does the amount of water affect plant growth"

**Independent Variable:** Amount of water given
 This is what we deliberately change
 Plant A gets 50mL daily, Plant B gets 100mL daily, Plant C gets 150mL daily

**Dependent Variable:** Plant height (growth)
 This is what we measure
 We measure height weekly to see the effect of different water amounts

**Controlled Variables:** Everything we keep the same
 Same type of plant (e.g., all bean plants)
 Same soil type and amount
 Same size pots
 Same sunlight exposure
 Same temperature
 Same starting height of plants

**Why Control Variables**
If we didn't control these, we couldn't be sure whether growth differences were due to water amount or something else (like different sunlight or soil). Controlling variables ensures our test is FAIR and VALID.`
      },
      {
        year: '2022',
        question: 'List five laboratory safety rules and explain why each is important.',
        solution: `**Five Important Laboratory Safety Rules:**

**1. Always wear safety goggles when handling chemicals**
**Why:** Eyes are extremely sensitive and can be permanently damaged by chemical splashes, fumes, or particles. Goggles provide a protective barrier. Even if YOU are not handling chemicals, someone nearby might cause a splash.

**2. Never taste anything in the laboratory**
**Why:** Many chemicals look like common food or drinks but are extremely poisonous. Even small amounts can cause serious illness or death. Some chemicals have no warning taste or smell. This rule has NO exceptions.

**3. Always add acid to water, never water to acid**
**Why:** Adding water to concentrated acid causes violent reaction, extreme heat, and can cause the acid to splatter or even explode. The mixture can boil instantly and spray acid everywhere. Adding acid to water allows gradual dilution and is much safer.

**4. Point test tubes away from yourself and others when heating**
**Why:** Heating can cause liquids to boil and spray out suddenly. If the test tube is pointed at someone, they could be burned or hit with hot chemicals. Always point toward a safe direction (usually upward or toward the wall).

**5. Know the location of safety equipment (fire extinguisher, eye wash, first aid)**
**Why:** In an emergency, every second counts. If you don't know where safety equipment is located, you'll waste precious time searching. Knowing beforehand can prevent serious injury and save lives.

**Additional important rules (any could be used):**
 Wash hands before and after lab work (prevents contamination and chemical exposure)
 Tie back long hair (prevents catching fire or getting caught in equipment)
 Never work alone in laboratory (someone needs to be there to help in emergency)
 Report all accidents immediately (even small cuts or spills can become serious)
 Read all instructions before starting (prevents mistakes and accidents)`
      },
      {
        year: '2019',
        question: 'Draw and label five common laboratory apparatus and state their uses.',
        solution: `**Five Common Laboratory Apparatus:**

**1. BEAKER**
[Drawing: Cylindrical container with spout and volume markings]
**Labels:** Spout, Volume markings (mL), Flat bottom
**Uses:**
 Holding liquids
 Mixing solutions
 Heating substances on tripod with wire gauze
 General purpose container

**2. MEASURING CYLINDER (GRADUATED CYLINDER)**
[Drawing: Tall narrow cylinder with graduations]
**Labels:** Graduation marks, Meniscus, Spout
**Uses:**
 Measuring volumes of liquids accurately
 More accurate than beaker
 Available in different sizes (10mL to 1000mL)
 Read at eye level at bottom of meniscus

**3. BUNSEN BURNER**
[Drawing: Burner showing parts]
**Labels:** Barrel, Air hole, Gas inlet, Base
**Uses:**
 Heating substances
 Creating hot flames for reactions
 Blue flame (complete combustion) is hotter
 Yellow flame (incomplete combustion) is cooler

**4. TEST TUBE**
[Drawing: Glass tube with rounded bottom]
**Labels:** Rim, Body, Rounded bottom
**Uses:**
 Small-scale reactions
 Holding small samples
 Heating substances (use test tube holder)
 Mixing small amounts

**5. CONICAL FLASK (ERLENMEYER FLASK)**
[Drawing: Cone-shaped flask with flat bottom]
**Labels:** Narrow neck, Wide base, Flat bottom
**Uses:**
 Mixing solutions (can swirl without spilling)
 Titrations
 Heating liquids
 Culturing microorganisms

**Note for drawing:** Your drawings should be neat, labeled clearly, and large enough to see details. Use pencil and ruler where appropriate. Labels should point to specific parts using straight lines.`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'What is the first step in the scientific method',
          options: ['Forming a hypothesis', 'Observation', 'Conducting an experiment', 'Drawing conclusions'],
          answer: 'Observation',
          explanation: 'The scientific method begins with careful observation of a phenomenon or problem, which leads to asking questions.'
        },
        {
          type: 'mcq',
          question: 'A beaker is used for:',
          options: ['Precise volume measurement', 'Stirring and mixing liquids', 'Measuring temperature', 'Filtering solutions'],
          answer: 'Stirring and mixing liquids',
          explanation: 'Beakers are used for mixing, stirring, and heating liquids. For precise measurements, use volumetric flasks or pipettes.'
        },
        {
          type: 'mcq',
          question: 'Which variable is deliberately changed by the experimenter',
          options: ['Dependent variable', 'Independent variable', 'Control variable', 'Constant variable'],
          answer: 'Independent variable',
          explanation: 'The independent variable is what you change or manipulate in an experiment to test its effect on the dependent variable.'
        },
        {
          type: 'truefalse',
          statement: 'A hypothesis must always be proven correct for an experiment to be successful.',
          answer: 'false',
          reason: 'A hypothesis can be supported or rejected. Both outcomes provide valuable scientific information. Rejecting a hypothesis is still a successful experiment.'
        },
        {
          type: 'mcq',
          question: 'What should you do immediately if acid spills on your skin',
          options: ['Apply oil', 'Rinse with plenty of water', 'Cover with a bandage', 'Ignore if it doesn\'t hurt'],
          answer: 'Rinse with plenty of water',
          explanation: 'Immediately wash the affected area with large amounts of water for at least 15 minutes to dilute and remove the acid.'
        },
        {
          type: 'mcq',
          question: 'This hazard symbol indicates:',
          options: ['Flammable material', 'Toxic material', 'Corrosive material', 'Explosive material'],
          answer: 'Corrosive material',
          explanation: 'The corrosive symbol (liquid dropping on hand/surface) warns that the substance can cause severe burns to skin and damage materials.'
        },
        {
          type: 'mcq',
          question: 'Why should you never taste chemicals in the laboratory',
          options: ['They taste bad', 'They might be poisonous', 'It wastes chemicals', 'It\'s against tradition'],
          answer: 'They might be poisonous',
          explanation: 'Many chemicals are toxic and can cause serious harm or death if ingested. Never taste anything in the laboratory.'
        },
        {
          type: 'truefalse',
          statement: 'Safety goggles should be worn only when handling acids.',
          answer: 'false',
          reason: 'Safety goggles should be worn whenever you are in the laboratory to protect eyes from splashes, fumes, and flying particles from any substance.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'What is the first step in the scientific method',
        options: [
          'Experiment',
          'Observation',
          'Hypothesis',
          'Analysis'
        ],
        answer: 'Observation',
        explanation: 'Observation is the first step. You notice something interesting using your senses, which then leads to forming a question about what you observed.'
      },
      {
        type: 'mcq',
        question: 'In an experiment testing "Does fertilizer amount affect plant growth", what is the independent variable',
        options: [
          'Plant height',
          'Amount of fertilizer',
          'Type of soil',
          'Amount of water'
        ],
        answer: 'Amount of fertilizer',
        explanation: 'The independent variable is what you deliberately change - in this case, the amount of fertilizer. Plant height would be the dependent variable (what you measure).'
      },
      {
        type: 'mcq',
        question: 'Which piece of equipment is most accurate for measuring 25.0 mL of liquid',
        options: [
          'Beaker',
          'Test tube',
          'Measuring cylinder',
          'Conical flask'
        ],
        answer: 'Measuring cylinder',
        explanation: 'A measuring cylinder (graduated cylinder) is specifically designed for accurate volume measurement with clear graduation marks. Beakers and flasks are less accurate.'
      },
      {
        type: 'mcq',
        question: 'What safety rule must ALWAYS be followed when diluting concentrated acid',
        options: [
          'Add water to acid',
          'Add acid to water',
          'Mix them at the same time',
          'Use a plastic container'
        ],
        answer: 'Add acid to water',
        explanation: 'Always add acid to water, NEVER water to acid. Adding water to acid causes violent reaction and dangerous splattering. Remember: "Do as you ought-a, add acid to water."'
      },
      {
        type: 'mcq',
        question: 'What does the skull and crossbones hazard symbol indicate',
        options: [
          'Flammable',
          'Corrosive',
          'Toxic/Poisonous',
          'Explosive'
        ],
        answer: 'Toxic/Poisonous',
        explanation: 'The skull and crossbones symbol indicates toxic or poisonous substances that can cause death or serious illness if swallowed, inhaled, or absorbed through skin.'
      },
      {
        type: 'mcq',
        question: 'Why must you wear safety goggles in the laboratory',
        options: [
          'To look professional',
          'To protect eyes from chemical splashes and particles',
          'Because the teacher said so',
          'To see better'
        ],
        answer: 'To protect eyes from chemical splashes and particles',
        explanation: 'Safety goggles protect your eyes from chemical splashes, fumes, and particles that could cause serious eye damage or blindness. Eyes are extremely sensitive and vulnerable.'
      },
      {
        type: 'mcq',
        question: 'When heating a liquid in a test tube, you should:',
        options: [
          'Point it toward yourself to see better',
          'Point it toward a classmate',
          'Point it away from everyone',
          'Hold it horizontally'
        ],
        answer: 'Point it away from everyone',
        explanation: 'Always point the test tube away from yourself and others. Heating can cause sudden boiling and splattering of hot liquid, which could cause burns if pointed at someone.'
      },
      {
        type: 'mcq',
        question: 'What should you do IMMEDIATELY if you get a chemical splash in your eye',
        options: [
          'Rub your eye',
          'Close your eye tightly',
          'Rinse with water for 15 minutes',
          'Wait for the teacher'
        ],
        answer: 'Rinse with water for 15 minutes',
        explanation: 'Immediately rinse the affected eye with water (at eye wash station) for at least 15 minutes. Keep the eye open while rinsing. Every second counts in preventing serious damage. Then seek medical attention.'
      }
    ],
    summary: 'The scientific method is a systematic approach to investigating questions through observation, hypothesis formation, experimentation, data analysis, and conclusion. Proper use of laboratory equipment and following safety rules are essential for conducting successful experiments. Understanding variables, controls, and accurate data recording ensures reliable scientific results.'
  },

  // Lesson 3: States and Changes of Matter
  {
    id: 'is-shs1-matter-3',
    slug: 'is-dm-matter-states-properties',
    title: 'States and Changes of Matter',
    objectives: [
      'Describe the three main states of matter and their properties',
      'Explain the particle arrangement in solids, liquids, and gases',
      'Identify and explain physical changes of state',
      'Distinguish between physical and chemical changes',
      'Apply the kinetic theory of matter to explain state changes',
      'Relate states of matter to everyday Ghanaian contexts'
    ],
    introduction: `Everything around you - water, air, rocks, food, your own body - is made of matter. Matter is anything that has mass and occupies space. But have you noticed that water can exist as ice (solid), liquid water, or steam (gas) This is because matter exists in different states.

In Ghana, we see matter changing states every day:
 **Solid to Liquid:** Ice blocks melting in the sun, shea butter melting when heated
 **Liquid to Gas:** Water boiling for kenkey, clothes drying on the line
 **Gas to Liquid:** Dew forming on leaves in the morning, condensation on cold drink bottles

Understanding states of matter helps us:
 Preserve food properly (freezing, drying)
 Understand weather and climate (rain, fog, humidity)
 Use materials appropriately in construction, cooking, and industry
 Explain natural phenomena

This lesson explores the three main states of matter, their properties, and how matter changes from one state to another based on temperature and pressure.`,

    keyConcepts: [
      {
        title: '1. The Three States of Matter',
        content: `Matter exists in three main states (or phases): **solid, liquid, and gas**. Each state has distinct properties based on how particles are arranged and how they move.

\`\`\`animation
{
  "type": "particlearrangementanimation"
}
\`\`\`

**SOLID STATE**

**Properties:**
 **Fixed shape** - maintains its shape without a container
 **Fixed volume** - doesn't expand to fill space
 **Cannot be compressed** (or very slightly)
 **Particles vibrate** but don't move from place to place
 **High density** - particles packed tightly together

**Particle Arrangement:**
 Particles very close together in regular, ordered pattern
 Strong forces of attraction between particles
 Particles vibrate about fixed positions
 Very little space between particles

**Examples in Ghana:**
 Ice blocks, frozen fish
 Rocks, metals (iron, gold, aluminum)
 Wood, charcoal
 Salt, sugar crystals
 Shea butter at room temperature (in harmattan)

**LIQUID STATE**

**Properties:**
 **No fixed shape** - takes shape of container
 **Fixed volume** - doesn't expand to fill entire space
 **Cannot be compressed** (incompressible)
 **Particles can move past each other** (flow)
 **Medium density** - less dense than solid (usually)

**Particle Arrangement:**
 Particles close together but not in fixed pattern
 Moderate forces of attraction between particles
 Particles can slide past each other
 Small spaces between particles

**Examples in Ghana:**
 Water, palm oil, palm wine
 Milk, beverages
 Petrol, kerosene
 Honey, liquid soaps
 Molten shea butter when heated

**GAS STATE**

**Properties:**
 **No fixed shape** - spreads to fill entire container
 **No fixed volume** - expands to fill available space
 **Can be compressed** - particles have lots of space between them
 **Particles move freely and randomly** at high speed
 **Low density** - particles very far apart

**Particle Arrangement:**
 Particles very far apart
 Very weak forces of attraction (almost none)
 Particles move randomly in all directions at high speed
 Lots of empty space between particles

**Examples in Ghana:**
 Air we breathe (oxygen, nitrogen, carbon dioxide)
 LPG (cooking gas)
 Water vapor (steam, humidity)
 Natural gas
 Smoke from charcoal/wood fires

**COMPARING THE THREE STATES:**

| Property | Solid | Liquid | Gas |
|----------|-------|--------|-----|
| **Shape** | Fixed | Takes container shape | Fills entire container |
| **Volume** | Fixed | Fixed | Expands to fill space |
| **Compressibility** | Very difficult | Very difficult | Easy |
| **Particle arrangement** | Very close, ordered | Close, random | Very far apart |
| **Particle movement** | Vibrate in place | Slide past each other | Move freely, randomly |
| **Forces between particles** | Very strong | Moderate | Very weak |
| **Density** | High | Medium | Low |
| **Flow** | No | Yes | Yes |

**Kinetic Theory of Matter:**
All matter is made of tiny particles (atoms and molecules) that are constantly moving. The state of matter depends on:
1. **How much energy the particles have** (temperature)
2. **How strong the forces are between particles**`
      },
      {
        title: '2. Changes of State (Phase Changes)',
        content: `Matter can change from one state to another when energy is added or removed, usually by heating or cooling. These are called **phase changes** or **changes of state**.

**MAIN CHANGES OF STATE:**

**1. MELTING (Solid  Liquid)**
 **Definition:** Change from solid to liquid
 **Energy:** Heat energy is ABSORBED (added)
 **What happens:** Particles gain energy, vibrate faster, break free from fixed positions
 **Temperature:** Occurs at **melting point** (constant during melting)
 **Examples:**
  - Ice melting to water (0C)
  - Chocolate melting in your hand
  - Butter or shea butter melting when heated
  - Candle wax melting
  - Metal melting in foundry (gold refining in Ghana)

**2. FREEZING (Liquid  Solid)**
 **Definition:** Change from liquid to solid
 **Energy:** Heat energy is RELEASED (removed)
 **What happens:** Particles lose energy, move slower, settle into fixed positions
 **Temperature:** Occurs at **freezing point** (same as melting point)
 **Examples:**
  - Water freezing to ice (0C)
  - Making ice blocks
  - Palm oil solidifying in harmattan cold
  - Molten metal solidifying when cooled

**3. EVAPORATION (Liquid  Gas at surface)**
 **Definition:** Change from liquid to gas that occurs at the **surface** only
 **Energy:** Heat energy is ABSORBED
 **What happens:** Fastest-moving particles at surface escape into air
 **Temperature:** Occurs at **any temperature** (doesn't need boiling)
 **Rate depends on:**
  - Temperature (faster when hotter)
  - Surface area (larger surface = faster)
  - Air movement (wind speeds it up)
  - Humidity (dry air = faster)
 **Examples:**
  - Wet clothes drying on line
  - Puddles drying after rain
  - Sweat cooling your body
  - Palm wine reducing when left uncovered
  - Salt production in Ada (seawater evaporation)

**4. BOILING (Liquid  Gas throughout)**
 **Definition:** Rapid change from liquid to gas throughout the liquid
 **Energy:** Heat energy is ABSORBED
 **What happens:** Bubbles of gas form throughout liquid and rise to surface
 **Temperature:** Occurs at **boiling point** (constant during boiling)
 **Examples:**
  - Water boiling for tea (100C at sea level)
  - Soup boiling on fire
  - Steaming food
  - Traditional salt production

**Evaporation vs. Boiling:**
| Aspect | Evaporation | Boiling |
|--------|-------------|---------|
| **Location** | Surface only | Throughout liquid |
| **Temperature** | Any temperature | At boiling point only |
| **Speed** | Slow | Fast |
| **Bubbles** | No bubbles | Bubbles form |
| **Energy needed** | Less | More |

**5. CONDENSATION (Gas  Liquid)**
 **Definition:** Change from gas to liquid
 **Energy:** Heat energy is RELEASED
 **What happens:** Gas particles lose energy, come together to form liquid
 **Examples:**
  - Dew forming on grass in morning
  - Water droplets on outside of cold drink bottle
  - Fog and clouds forming
  - Steam from pot turning to water droplets on lid
  - Distillation of akpeteshie

**6. SUBLIMATION (Solid  Gas directly)**
 **Definition:** Change directly from solid to gas without becoming liquid first
 **Energy:** Heat energy is ABSORBED
 **Examples:**
  - Dry ice (solid CO2) turning to gas
  - Mothballs (camphor) disappearing over time
  - Air freshener blocks shrinking
  - Iodine crystals forming purple vapor when heated

**7. DEPOSITION (Gas  Solid directly)**
 **Definition:** Change directly from gas to solid without becoming liquid first
 **Energy:** Heat energy is RELEASED
 **Examples:**
  - Frost forming on very cold surfaces
  - Snow formation in clouds
  - Iodine vapor forming crystals when cooled

**DIAGRAM OF CHANGES OF STATE:**
\`\`\`
        MELTING 
    SOLID   LIQUID   GAS
         FREEZING
                 CONDENSATION
                 
    SUBLIMATION   EVAPORATION/BOILING
    (direct)      
\`\`\`

**Key Points:**
 Changes that require heat: Melting, evaporation, boiling, sublimation (endothermic)
 Changes that release heat: Freezing, condensation, deposition (exothermic)
 Temperature remains constant during a state change
 Adding more heat during state change doesn't increase temperature - it breaks/forms bonds`
      },
      {
        title: '3. Physical vs. Chemical Changes',
        content: `Understanding the difference between physical and chemical changes is crucial in science.

**PHYSICAL CHANGES**

**Definition:** Changes in which the **substance remains the same** but its physical properties (state, shape, size) change. No new substance is formed.

**Characteristics:**
 **Reversible** (usually can be undone)
 **No new substance** formed
 **Same chemical composition** before and after
 **Only physical properties** change (state, shape, size, texture)
 **No energy change** (or small energy change)

**Examples:**
 **Changes of state:** Ice melting, water boiling, steam condensing
 **Dissolving:** Salt dissolving in water (can recover salt by evaporation)
 **Breaking/crushing:** Crushing rock to powder, tearing paper
 **Mixing:** Mixing sand and salt (can be separated)
 **Bending/stretching:** Bending metal, stretching rubber band
 **Magnetizing:** Making iron magnetic

**Ghanaian Examples:**
 Melting shea butter for use
 Grating cassava for gari
 Dissolving sugar in tea
 Freezing water for ice blocks
 Drying fish (removing water)

**CHEMICAL CHANGES (Chemical Reactions)**

**Definition:** Changes in which **new substances are formed** with different properties. The chemical composition changes.

**Characteristics:**
 **Usually irreversible** (cannot easily undo)
 **New substance(s) formed** with different properties
 **Different chemical composition** after change
 **Energy change** (heat, light released or absorbed)
 Often accompanied by: color change, gas production, precipitate formation, temperature change

**Examples:**
 **Burning:** Wood burning to ash and smoke
 **Rusting:** Iron reacting with oxygen and water
 **Cooking:** Eggs becoming solid when boiled, dough rising
 **Digestion:** Food breaking down in body
 **Photosynthesis:** Plants making food from CO2 and water
 **Fermentation:** Palm wine production, bread rising

**Ghanaian Examples:**
 Burning charcoal or wood for cooking
 Rusting of zinc/aluminum roofing sheets
 Fermentation of palm wine or pito
 Cooking kenkey (chemical changes in corn dough)
 Ripening of fruits (plantain, mango)
 Souring of milk or palm wine

**Signs of Chemical Change:**
1. **Color change:** Green banana  yellow when ripe
2. **Gas production:** Bubbles when baking soda + vinegar
3. **Energy change:** Heat from fire, light from burning
4. **Precipitate:** Solid forming when mixing solutions
5. **Irreversible:** Cannot easily reverse (burned paper cannot become paper again)

**COMPARING PHYSICAL AND CHEMICAL CHANGES:**

| Aspect | Physical Change | Chemical Change |
|--------|----------------|-----------------|
| **New substance** | No | Yes |
| **Composition** | Same | Different |
| **Reversibility** | Usually reversible | Usually irreversible |
| **Energy change** | Small or none | Significant |
| **Examples** | Melting, dissolving, breaking | Burning, rusting, cooking |

**Mixed Examples:**
Some processes involve BOTH:
 **Burning candle:**
  - Physical: Wax melting (solid  liquid)
  - Chemical: Wax burning (producing CO2 and H2O)
 **Cooking gari:**
  - Physical: Water evaporating
  - Chemical: Starch changing structure

**Why This Matters:**
 Understanding what can be reversed vs. permanent
 Knowing when new materials are created
 Predicting outcomes of processes
 Safety (some chemical changes are dangerous)`
      },
      {
        title: '4. Factors Affecting State Changes',
        content: `The state of matter and changes between states depend on several factors:

**1. TEMPERATURE**

**Effect on State:**
 **Increasing temperature**  Particles gain kinetic energy  move faster  solid  liquid  gas
 **Decreasing temperature**  Particles lose kinetic energy  move slower  gas  liquid  solid

**Melting and Boiling Points:**
Different substances change state at different temperatures:

**Common Melting Points:**
 Ice (water): 0C
 Shea butter: ~37C (melts near body temperature)
 Chocolate: ~34C
 Wax: ~50-70C
 Butter: ~32C
 Aluminum: 660C
 Iron: 1538C
 Gold: 1064C

**Common Boiling Points (at sea level):**
 Water: 100C
 Ethanol (alcohol): 78C
 Palm oil: ~300C
 Mercury: 357C
 Iron: 2862C

**Application in Ghana:**
 Shea butter is solid in harmattan (cool, dry season) but melts in hot weather
 Palm oil solidifies in cold harmattan mornings
 Water boils faster at lower altitudes (Accra) than higher altitudes (Akuapem hills)

**2. PRESSURE**

**Effect on State:**
 **Increasing pressure**  Forces particles closer together  favors liquid and solid states
 **Decreasing pressure**  Allows particles to spread out  favors gas state

**Effect on Boiling Point:**
 **Higher pressure**  Higher boiling point
 **Lower pressure**  Lower boiling point

**Examples:**
 **Pressure cooker:** High pressure inside raises boiling point above 100C, cooks food faster
 **High altitude:** Lower atmospheric pressure, water boils below 100C (takes longer to cook)
 **LPG cylinder:** Gas kept as liquid under high pressure

**Why This Matters in Ghana:**
 At sea level (Accra, Takoradi): Water boils at ~100C
 In mountains (Aburi, Akuapem): Water boils at lower temperature
 Pressure cookers save fuel and time (important where fuel is expensive)

**3. PURITY OF SUBSTANCE**

**Effect:**
 **Pure substances:** Have fixed, sharp melting and boiling points
 **Impure substances/mixtures:** Melt and boil over a range of temperatures

**Examples:**
 Pure water boils exactly at 100C
 Salt water boils above 100C
 Pure ice melts at 0C
 Dirty ice melts over a range of temperatures

**Applications:**
 Adding salt to water raises boiling point (used in cooking)
 Adding salt to ice lowers freezing point (used for making ice cream)
 Testing purity of substances by measuring melting/boiling points

**4. SURFACE AREA (for evaporation)**

**Effect on Evaporation Rate:**
 **Larger surface area**  More molecules at surface  faster evaporation
 **Smaller surface area**  Fewer molecules at surface  slower evaporation

**Examples:**
 Clothes dry faster when spread out than when bunched up
 Water in shallow pan evaporates faster than in deep container
 Salt production uses large, shallow ponds to speed evaporation

**5. WIND/AIR MOVEMENT (for evaporation)**

**Effect:**
 **Moving air**  Removes evaporated molecules quickly  faster evaporation
 **Still air**  Evaporated molecules accumulate near surface  slower evaporation

**Examples:**
 Clothes dry faster on windy days
 Sweat cools you more effectively in breeze
 Fans speed up drying

**6. HUMIDITY (for evaporation)**

**Effect:**
 **Low humidity (dry air)**  Faster evaporation
 **High humidity (moist air)**  Slower evaporation

**Ghana Context:**
 **Harmattan season:** Very dry, low humidity  clothes dry very fast, skin dries out
 **Rainy season:** High humidity  clothes take longer to dry, mold grows easily

**PRACTICAL APPLICATIONS:**

**Food Preservation:**
 **Drying fish:** Use sun (heat), wind, and low humidity
 **Smoking meat:** Heat removes water, smoke adds preservatives
 **Freezing:** Keeps food solid at low temperature

**Cooking:**
 Boiling at higher temperature cooks faster
 Pressure cooker increases pressure and temperature
 Slow simmering (just below boiling) for tender meat

**Industry:**
 **Salt production (Ada):** Large, shallow ponds, sun, wind for evaporation
 **Gold refining:** Melting gold at high temperature (1064C)
 **Distillation:** Separating liquids by boiling points (akpeteshie production)`
      },
      {
        title: '5. The Water Cycle - States of Matter in Nature',
        content: `The **water cycle** (hydrological cycle) is a perfect example of matter changing states naturally in the environment. It's the continuous movement of water on, above, and below Earth's surface.

**STAGES OF THE WATER CYCLE:**

**1. EVAPORATION**
 **Process:** Liquid water  water vapor (gas)
 **Where:** Oceans, lakes, rivers, ponds, Volta Lake, lagoons
 **Energy source:** Sun provides heat
 **In Ghana:** 
  - Water evaporates from Volta Lake, rivers (Pra, Ankobra, Oti)
  - High evaporation during dry season and harmattan
  - Salt production at Ada uses evaporation

**2. TRANSPIRATION**
 **Process:** Water vapor released by plants through leaves
 **Where:** Forests, farms, vegetation
 **In Ghana:**
  - Kakum Forest, tropical rainforests
  - Cocoa farms, oil palm plantations
  - Plants release millions of liters of water into air

**Combined: Evapotranspiration** = Evaporation + Transpiration

**3. CONDENSATION**
 **Process:** Water vapor (gas)  liquid water droplets
 **Where:** High in atmosphere where it's cooler
 **Result:** Forms clouds, fog, mist
 **In Ghana:**
  - Clouds forming over Akwapim-Togo Ranges
  - Morning fog in Aburi and highlands
  - Mist in forest regions

**4. PRECIPITATION**
 **Process:** Water droplets in clouds grow larger and fall
 **Forms:** Rain, drizzle, (rarely hail or snow in Ghana)
 **In Ghana:**
  - **Rainy seasons:** April-June, September-October
  - **Highest rainfall:** Western Region, Axim area (~2000mm/year)
  - **Lowest rainfall:** Northern Region, Upper East (~1000mm/year)
  - Heavy rains can cause flooding (Accra floods)

**5. COLLECTION (Runoff and Infiltration)**
 **Process:** Water collects in water bodies or soaks into ground
 **Surface runoff:** Flows into streams, rivers, lakes
 **Infiltration:** Soaks into soil, becomes groundwater
 **In Ghana:**
  - Volta Lake (world's largest artificial lake)
  - Rivers: Volta, Pra, Ankobra, Tano, Oti, White Volta, Black Volta
  - Groundwater supplies many boreholes and wells

**THE CYCLE CONTINUES:**
Water evaporates again from these water bodies, starting the cycle over.

**STATE CHANGES IN WATER CYCLE:**

1. **Evaporation/Transpiration:** Liquid  Gas (requires heat energy from sun)
2. **Condensation:** Gas  Liquid (releases heat energy as air rises and cools)
3. **Precipitation:** Liquid falling from clouds
4. (Sometimes **Freezing:** Liquid  Solid forming hail - rare in Ghana)

**IMPORTANCE OF WATER CYCLE:**

**For Ghana:**
 **Water Supply:** Rivers, lakes provide drinking water
 **Agriculture:** Rain waters crops (cocoa, maize, yam, cassava)
 **Hydroelectric Power:** Akosombo Dam uses water cycle
 **Climate Regulation:** Affects temperature and rainfall patterns
 **Ecosystem Support:** Maintains wetlands, forests, wildlife

**For Life:**
 **Freshwater availability:** Makes water reusable
 **Nutrient distribution:** Moves minerals and nutrients
 **Temperature regulation:** Evaporation cools surfaces
 **Purification:** Evaporation leaves contaminants behind

**HUMAN IMPACT ON WATER CYCLE:**

**Negative:**
 **Deforestation:** Less transpiration, more runoff, soil erosion
 **Urbanization:** Concrete surfaces reduce infiltration, increase flooding
 **Pollution:** Contaminates water bodies
 **Climate change:** Alters rainfall patterns

**Positive:**
 **Dams:** Store water for dry season (Akosombo, Bui)
 **Reforestation:** Increases water retention
 **Rainwater harvesting:** Captures rain for later use

**GHANA-SPECIFIC ISSUES:**

**Challenges:**
 **Irregular rainfall:** Droughts in north, floods in south
 **Deforestation:** Affects local rainfall in former forest areas
 **Pollution:** Rivers polluted by illegal mining (galamsey)
 **Akosombo Dam levels:** Fluctuate with rainfall

**Solutions:**
 **Afforestation:** Plant trees to increase transpiration
 **Wetland conservation:** Maintain natural water storage
 **Rainwater harvesting:** Store water during rainy season
 **Sustainable farming:** Reduce soil erosion

**Climate Zones and Water Cycle:**

**1. Guinea/Forest Zone (South):**
 High rainfall, dense forests
 High evapotranspiration
 Many rivers and streams

**2. Savanna Zone (Middle):**
 Moderate rainfall
 Mix of trees and grassland
 Seasonal rivers

**3. Sudan Savanna (North):**
 Low rainfall
 Sparse vegetation
 Few permanent rivers
 Long dry season

Understanding the water cycle helps us:
 Predict weather and climate
 Manage water resources
 Understand flooding and droughts
 Appreciate interconnection of Earth's systems`
      }
    ],

    pastQuestions: [
      {
        year: '2020',
        question: 'Explain why a solid has a fixed shape while a gas does not.',
        solution: `**Why solids have fixed shape and gases do not:**

**SOLID:**

**Particle Arrangement:**
 Particles are **very close together** in a regular, fixed pattern
 **Strong forces of attraction** between particles hold them in fixed positions
 Particles can only **vibrate** about their fixed positions
 Cannot move from place to place

**Result:**
 Solid maintains its shape without needing a container
 Cannot be easily deformed (maintains structure)
 Shape is independent of container

**Example:** A block of wood maintains its rectangular shape whether placed in a bowl, on a table, or in a bag.

**GAS:**

**Particle Arrangement:**
 Particles are **very far apart** with lots of empty space
 **Very weak or no forces** of attraction between particles
 Particles **move freely and rapidly** in all directions
 Constantly colliding with each other and container walls

**Result:**
 Gas has no fixed shape - takes shape of its container
 Expands to fill entire available space
 If not contained, spreads out indefinitely

**Example:** When you open a perfume bottle, the perfume gas spreads throughout the room because gas particles move freely in all directions.

**COMPARISON:**

The key difference is:
 **Solids:** Strong forces hold particles in fixed positions  fixed shape
 **Gases:** Weak/no forces allow particles to move freely  no fixed shape

**Real-world application:** 
 You can stack solid bricks to build a house (they keep their shape)
 You must store cooking gas (LPG) in a container because it would spread everywhere otherwise`
      },
      {
        year: '2021',
        question: 'Describe three ways by which the rate of evaporation of water can be increased.',
        solution: `**Three ways to increase rate of evaporation:**

**1. INCREASE TEMPERATURE**

**How it works:**
 Heating water gives particles more kinetic energy
 Particles move faster
 More particles have enough energy to escape from surface
 Faster evaporation

**Example:**
 Wet clothes dry much faster in hot sun than in cool shade
 Water in pot on fire evaporates faster than cold water
 Salt producers use sun's heat to evaporate seawater

**Ghana context:** Clothes dry very fast during hot, dry harmattan season but slowly during cool, rainy season.

**2. INCREASE SURFACE AREA**

**How it works:**
 Larger surface area = more water molecules at the surface
 More molecules available to escape into air
 Faster evaporation

**Example:**
 Water in shallow, wide pan evaporates faster than same amount in tall, narrow container
 Spreading wet clothes on line (large area) dries them faster than leaving in pile
 Salt production uses large, shallow ponds (maximum surface area)

**Practical tip:** To dry gari faster, spread it thinly in large trays rather than heap it in small containers.

**3. INCREASE AIR MOVEMENT (WIND)**

**How it works:**
 Wind removes water vapor molecules from above the water surface
 Prevents buildup of humid air near surface
 Maintains concentration gradient
 Allows more molecules to evaporate

**Example:**
 Clothes dry much faster on windy days
 Using a fan speeds up drying of wet floors
 Traditional palm wine tapers place pots in breezy locations

**Ghana context:** During harmattan, strong dry winds from Sahara make evaporation very fast - clothes dry in minutes, causing dry skin and chapped lips.

**ADDITIONAL WAYS (bonus):**

**4. Decrease humidity:** 
 Dry air absorbs water vapor better than humid air
 Harmattan season (low humidity)  very fast evaporation
 Rainy season (high humidity)  slow evaporation

**5. Increase air pressure at surface:**
 Though less common, reducing pressure above liquid increases evaporation
 This is why water boils at lower temperature at high altitudes

**Summary:** The three main practical ways are:
1. Heat it (increase temperature)
2. Spread it out (increase surface area)  
3. Blow air over it (increase air movement)`
      },
      {
        year: '2019',
        question: 'Distinguish between evaporation and boiling.',
        solution: `**Evaporation vs. Boiling - Key Differences:**

**EVAPORATION**

**1. Location:**
 Occurs **only at the surface** of the liquid
 Only surface molecules escape

**2. Temperature:**
 Occurs at **any temperature** (even below boiling point)
 Can happen at room temperature
 Rate increases with temperature

**3. Speed:**
 **Slow process**
 Takes time (hours or days for clothes to dry)

**4. Energy:**
 Requires **less energy**
 Only fastest-moving surface molecules escape

**5. Bubbles:**
 **No bubbles** form
 No visible disturbance in liquid

**6. Temperature during process:**
 Liquid **cools down** as evaporation occurs
 Fastest molecules escape, leaving slower ones behind

**7. Examples:**
 Wet clothes drying
 Puddles drying after rain
 Sweat cooling your body
 Salt production (slow evaporation of seawater)

**BOILING**

**1. Location:**
 Occurs **throughout the entire liquid**
 Bubbles form everywhere inside the liquid

**2. Temperature:**
 Occurs **only at boiling point** (specific temperature)
 For water: 100C at sea level
 Cannot occur below boiling point

**3. Speed:**
 **Fast, rapid process**
 Violent change of state
 Water can boil away in minutes

**4. Energy:**
 Requires **more energy**
 Must heat entire liquid to boiling point

**5. Bubbles:**
 **Bubbles form** throughout liquid
 Bubbles rise to surface and burst
 Liquid is turbulent, churning

**6. Temperature during process:**
 Temperature **remains constant** at boiling point
 Adding more heat doesn't increase temperature
 All energy goes into changing state

**7. Examples:**
 Boiling water for tea
 Cooking kenkey (water boiling)
 Traditional salt production (final stage)
 Steaming food

**COMPARISON TABLE:**

| Feature | Evaporation | Boiling |
|---------|-------------|---------|
| **Where** | Surface only | Throughout liquid |
| **Temperature** | Any temperature | At boiling point only |
| **Speed** | Slow | Fast |
| **Energy needed** | Less | More |
| **Bubbles** | No | Yes |
| **Temp. change** | Liquid cools | Stays constant |
| **Visibility** | Not easily seen | Easily visible |

**PRACTICAL EXAMPLE IN GHANA:**

**Evaporation:**
When you hang wet clothes after washing, water evaporates slowly from the surface throughout the day.

**Boiling:**
When you boil water in a pot for tea, you see bubbles forming rapidly throughout the water, steam rises vigorously, and the water disappears quickly.

**Why Both Matter:**
 **Evaporation:** Used for drying (clothes, fish, gari), cooling (sweat), salt production
 **Boiling:** Used for cooking, sterilizing water, distillation

Both convert liquid water to water vapor (gas), but occur differently!`
      },
      {
        year: '2022',
        question: 'State three differences between physical changes and chemical changes, giving one example of each.',
        solution: `**Three Differences Between Physical and Chemical Changes:**

**DIFFERENCE 1: FORMATION OF NEW SUBSTANCE**

**Physical Change:**
 **No new substance** is formed
 The same substance remains, just in different form
 Chemical composition stays the same

**Example:** Ice melting to water
 Still H2O (water), just changed from solid to liquid
 Can refreeze to get ice back

**Chemical Change:**
 **New substance(s) formed** with different properties
 Original substance no longer exists in same form
 Chemical composition changes

**Example:** Wood burning to ash
 Wood (cellulose)  Ash (various compounds) + CO2 + H2O
 Completely different substances formed
 Cannot get original wood back from ash

**DIFFERENCE 2: REVERSIBILITY**

**Physical Change:**
 Usually **reversible**
 Can get back original substance easily
 No permanent alteration

**Example:** Dissolving salt in water
 Salt + Water  Saltwater (mixture)
 Can evaporate water to get salt crystals back
 Both salt and water unchanged

**Chemical Change:**
 Usually **irreversible** or very difficult to reverse
 Cannot easily get back original substance
 Permanent alteration occurred

**Example:** Rusting of iron
 Iron + Oxygen + Water  Rust (iron oxide)
 Very difficult to convert rust back to pure iron
 Requires complex industrial processes

**DIFFERENCE 3: ENERGY CHANGE**

**Physical Change:**
 **Small or no energy change**
 May absorb or release small amount of heat
 Usually no light produced

**Example:** Breaking chalk into powder
 Same amount of chalk, just smaller pieces
 No heat or light produced
 No significant energy change

**Chemical Change:**
 **Significant energy change**
 Usually releases or absorbs large amounts of energy
 May produce heat, light, sound
 Often noticeable temperature change

**Example:** Burning charcoal
 Produces large amounts of heat and light
 Temperature increases significantly
 Chemical bonds broken and formed (releases energy)

**SUMMARY TABLE:**

| Aspect | Physical Change | Chemical Change |
|--------|----------------|-----------------|
| **New substance** | No - same substance | Yes - different substance |
| **Example** | Ice melting | Wood burning |
| **Reversibility** | Usually reversible | Usually irreversible |
| **Example** | Dissolving salt | Rusting iron |
| **Energy** | Small/no change | Large energy change |
| **Example** | Breaking chalk | Burning charcoal |

**ADDITIONAL GHANAIAN EXAMPLES:**

**Physical Changes:**
1. Grating cassava for gari (still cassava)
2. Melting shea butter (still shea butter)
3. Freezing water for ice blocks (still water)

**Chemical Changes:**
1. Fermenting palm wine (sugar  alcohol)
2. Cooking kenkey (starch changes)
3. Ripening plantain (complex chemical changes)`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'Which state of matter has particles that are closely packed and vibrate in fixed positions',
          options: ['Gas', 'Liquid', 'Solid', 'Plasma'],
          answer: 'Solid',
          explanation: 'Solid particles are closely packed in a regular arrangement and can only vibrate in fixed positions. This gives solids their fixed shape and volume.'
        },
        {
          type: 'mcq',
          question: 'Shea butter melts when exposed to the Ghanaian sun. This is an example of:',
          options: ['Chemical change', 'Physical change', 'Nuclear change', 'Biological change'],
          answer: 'Physical change',
          explanation: 'Melting is a physical change because only the state changes (solid to liquid), but the chemical composition of shea butter remains the same.'
        },
        {
          type: 'mcq',
          question: 'Which process involves a change from liquid to gas at temperatures below the boiling point',
          options: ['Condensation', 'Freezing', 'Evaporation', 'Sublimation'],
          answer: 'Evaporation',
          explanation: 'Evaporation is the change from liquid to gas that occurs at the surface of a liquid at temperatures below its boiling point. This is how water dries from clothes on a line.'
        },
        {
          type: 'mcq',
          question: 'When cooking fufu, the cassava changes color, texture, and becomes edible. This is a:',
          options: ['Physical change', 'Chemical change', 'State change', 'Reversible change'],
          answer: 'Chemical change',
          explanation: 'Cooking cassava involves chemical changes. New substances are formed (starch breaks down), and the process is irreversible. The chemical composition changes.'
        },
        {
          type: 'mcq',
          question: 'In the water cycle, which process is responsible for water vapor in the atmosphere forming clouds',
          options: ['Evaporation', 'Transpiration', 'Condensation', 'Precipitation'],
          answer: 'Condensation',
          explanation: 'Condensation is the process where water vapor (gas) cools and changes into liquid water droplets, forming clouds. This is the reverse of evaporation.'
        },
        {
          type: 'mcq',
          question: 'Which property distinguishes gases from liquids and solids',
          options: ['Gases have fixed volume', 'Gases have fixed shape', 'Gases are highly compressible', 'Gas particles are closely packed'],
          answer: 'Gases are highly compressible',
          explanation: 'Gases are highly compressible because their particles are far apart with large spaces between them. Liquids and solids cannot be compressed significantly.'
        },
        {
          type: 'mcq',
          question: 'Dew forming on grass in the morning is an example of:',
          options: ['Evaporation', 'Sublimation', 'Condensation', 'Melting'],
          answer: 'Condensation',
          explanation: 'Dew forms when water vapor in the air condenses (gas to liquid) on cool surfaces like grass. This occurs when air temperature drops overnight.'
        },
        {
          type: 'mcq',
          question: 'Which of the following is a chemical change',
          options: ['Ice melting in a drink', 'Breaking a glass bottle', 'Rusting of an iron gate', 'Dissolving sugar in water'],
          answer: 'Rusting of an iron gate',
          explanation: 'Rusting is a chemical change where iron reacts with oxygen and water to form iron oxide (rust), a new substance. The other options are physical changes.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'Which of the following is NOT a property of gases',
        options: [
          'They have fixed volume',
          'They can be compressed',
          'They have no fixed shape',
          'Their particles move freely'
        ],
        answer: 'They have fixed volume',
        explanation: 'Gases do NOT have fixed volume - they expand to fill whatever space is available. Gases CAN be compressed, have no fixed shape, and their particles move freely. This is why you can pump more air into a tire - the gas compresses.'
      },
      {
        type: 'mcq',
        question: 'What happens to particles when a solid melts into a liquid',
        options: [
          'They move closer together',
          'They gain energy and move more freely',
          'They lose energy and slow down',
          'They stop moving completely'
        ],
        answer: 'They gain energy and move more freely',
        explanation: 'When a solid melts, heat energy is absorbed. This gives particles more kinetic energy, allowing them to vibrate more and break free from fixed positions to move around more freely as a liquid. This is why ice needs heat to melt.'
      },
      {
        type: 'mcq',
        question: 'Which process involves water changing from liquid to gas at the surface only',
        options: [
          'Boiling',
          'Melting',
          'Evaporation',
          'Condensation'
        ],
        answer: 'Evaporation',
        explanation: 'Evaporation is the process where water changes from liquid to gas at the surface only and can occur at any temperature. Boiling occurs throughout the liquid only at boiling point. Melting is solid to liquid, and condensation is gas to liquid.'
      },
      {
        type: 'mcq',
        question: 'Which of these is a chemical change',
        options: [
          'Ice melting',
          'Salt dissolving in water',
          'Wood burning',
          'Water boiling'
        ],
        answer: 'Wood burning',
        explanation: 'Wood burning is a chemical change because new substances (ash, carbon dioxide, water vapor) are formed and the change is irreversible. Ice melting, salt dissolving, and water boiling are all physical changes - no new substances are formed and they can be reversed.'
      },
      {
        type: 'mcq',
        question: 'What factor increases the rate of evaporation of water',
        options: [
          'Decreasing temperature',
          'Reducing surface area',
          'Increasing air movement',
          'Adding more water'
        ],
        answer: 'Increasing air movement',
        explanation: 'Increasing air movement (wind) speeds up evaporation by removing water vapor from the surface, allowing more water to evaporate. Decreasing temperature and reducing surface area slow down evaporation. Adding more water just increases the total amount, not the rate.'
      },
      {
        type: 'mcq',
        question: 'At what temperature does pure water boil at sea level',
        options: [
          '0C',
          '50C',
          '100C',
          '150C'
        ],
        answer: '100C',
        explanation: 'Pure water boils at exactly 100C at sea level (standard atmospheric pressure). At 0C water freezes. The boiling point can change with altitude - it\'s lower at higher altitudes where pressure is less.'
      },
      {
        type: 'mcq',
        question: 'In the water cycle, clouds form through which process',
        options: [
          'Evaporation',
          'Precipitation',
          'Condensation',
          'Transpiration'
        ],
        answer: 'Condensation',
        explanation: 'Clouds form through condensation - water vapor in the air cools and changes back to tiny liquid water droplets. Evaporation converts liquid to vapor, precipitation is rain falling, and transpiration is water release by plants.'
      },
      {
        type: 'mcq',
        question: 'Which state of matter has particles that are very far apart and move randomly at high speed',
        options: [
          'Solid',
          'Liquid',
          'Gas',
          'All of the above'
        ],
        answer: 'Gas',
        explanation: 'Gases have particles that are very far apart with lots of empty space between them, and the particles move randomly at high speeds in all directions. Solids have particles close together in fixed positions, and liquids have particles close but able to slide past each other.'
      }
    ],
    summary: 'Matter exists in three main states: solid (fixed shape and volume), liquid (fixed volume but no fixed shape), and gas (no fixed shape or volume). Matter changes state through processes like melting, freezing, evaporation, boiling, and condensation, which require adding or removing energy. Physical changes do not create new substances and are usually reversible, while chemical changes produce new substances and are usually irreversible. Understanding states of matter helps explain everyday phenomena and natural cycles like the water cycle.'
  },

  // Lesson 4: Cell Structure and Function
  {
    id: 'is-dm-cells-structure-function',
    slug: 'is-dm-cells-structure-function',
    title: 'Cell Structure and Function',
    objectives: [
      'Define a cell and explain why it is the basic unit of life',
      'Distinguish between plant and animal cells',
      'Identify the main organelles and their functions',
      'Explain the relationship between cell structure and function',
      'Describe specialized cells in plants and animals',
      'Understand the difference between prokaryotic and eukaryotic cells'
    ],
    introduction: `The cell is the smallest unit of life - the building block of all living things. Whether you're looking at a tiny bacterium or a massive elephant, all living organisms are made of cells.

Robert Hooke first observed cells in 1665 when he examined a thin slice of cork under a microscope. He saw tiny box-like structures that reminded him of small rooms (cells) in a monastery, so he named them "cells."

**Why Are Cells Important**

 **Basic Unit of Life:** All living things are made of one or more cells
 **Structure and Function:** Each cell part has a specific job
 **Growth and Reproduction:** Organisms grow by making more cells
 **Unity of Life:** All cells share common features (DNA, cell membrane, cytoplasm)

**In Ghana:**
Understanding cells helps us:
 **Agriculture:** Improve crop yields by understanding plant cells
 **Medicine:** Fight diseases by understanding how cells work and how pathogens attack cells
 **Food Processing:** Fermentation (palm wine, pito) involves yeast cells
 **Biotechnology:** Use cells to produce medicines, enzymes, and other products

This lesson explores the structure of cells, the functions of different cell parts (organelles), and how cells are specialized for different tasks in plants and animals.`,

    keyConcepts: [
      {
        title: '1. Cell Theory and Types of Cells',
        content: `**CELL THEORY**

The Cell Theory is one of the fundamental principles of biology. It states:

1. **All living things are made of one or more cells**
   - Single-celled organisms: Bacteria, Amoeba, Paramecium
   - Multi-cellular organisms: Plants, animals, fungi, humans

2. **The cell is the basic unit of life**
   - Smallest structure that can carry out all life processes
   - Can take in nutrients, produce energy, grow, reproduce, respond to environment

3. **All cells come from pre-existing cells**
   - Cells reproduce by cell division
   - New cells are not spontaneously generated
   - Continuity of life through reproduction

**TYPES OF CELLS**

**Based on Complexity:**

**1. PROKARYOTIC CELLS**

**Characteristics:**
 **No true nucleus** - DNA floats freely in cytoplasm
 **No membrane-bound organelles** - no mitochondria, chloroplasts, etc.
 **Smaller** - typically 1-10 micrometers (μm)
 **Simpler structure**
 **Single-celled organisms only**

**Examples:**
 **Bacteria** (E. coli, Salmonella, TB bacteria)
 **Cyanobacteria** (blue-green algae)

**Structure:**
 Cell wall (made of peptidoglycan)
 Cell membrane
 Cytoplasm
 Ribosomes (smaller, 70S type)
 Nucleoid region (where DNA is located)
 Sometimes: flagella (for movement), pili (for attachment)

**2. EUKARYOTIC CELLS**

**Characteristics:**
 **True nucleus** - DNA enclosed in nuclear membrane
 **Membrane-bound organelles** - mitochondria, ER, Golgi, etc.
 **Larger** - typically 10-100 μm
 **More complex structure**
 **Can be single-celled or multi-cellular**

**Examples:**
 **Protists** (Amoeba, Paramecium, Euglena)
 **Fungi** (yeast, mushrooms, molds)
 **Plants** (all plants - from moss to trees)
 **Animals** (all animals - from sponges to humans)

**COMPARISON TABLE:**

| Feature | Prokaryotic Cell | Eukaryotic Cell |
|---------|-----------------|-----------------|
| **Nucleus** | No true nucleus | True nucleus with membrane |
| **DNA** | Circular, in nucleoid | Linear, in chromosomes |
| **Organelles** | No membrane-bound | Many membrane-bound |
| **Size** | 1-10 μm (smaller) | 10-100 μm (larger) |
| **Ribosomes** | 70S (smaller) | 80S (larger) |
| **Cell division** | Binary fission | Mitosis/meiosis |
| **Examples** | Bacteria | Plants, animals, fungi |

**Based on Organism Type:**

Within eukaryotic cells, we have two main types:

**PLANT CELLS vs. ANIMAL CELLS**

Both are eukaryotic, but have key differences:

**Plant Cells Have:**
 **Cell wall** (made of cellulose) - provides rigid structure
 **Large central vacuole** - stores water, maintains turgor pressure
 **Chloroplasts** - for photosynthesis (making food)
 **Regular, fixed shape** - due to cell wall
 **Plasmodesmata** - channels connecting plant cells

**Animal Cells Have:**
 **No cell wall** - only cell membrane
 **Small vacuoles** (if any) - for storage
 **No chloroplasts** - cannot make own food
 **Irregular shape** - flexible membrane
 **Centrioles** - for cell division (most plants lack these)

**Why These Differences**

 **Plants are stationary**  need rigid cell wall for support
 **Plants make their own food**  need chloroplasts
 **Plants don't drink**  need large vacuole to store water
 **Animals move**  flexible cell membrane allows shape change
 **Animals eat food**  don't need chloroplasts`
      },
      {
        title: '2. Cell Structure - Animal Cell Organelles',
        content: `**ANIMAL CELL STRUCTURE**

An animal cell has several specialized structures called **organelles** (meaning "little organs"). Each organelle has a specific function.

**1. CELL MEMBRANE (PLASMA MEMBRANE)**

**Structure:**
 Thin, flexible boundary surrounding cell
 Made of phospholipid bilayer with embedded proteins
 Selectively permeable (controls what enters/exits)

**Function:**
 **Boundary:** Separates cell contents from external environment
 **Protection:** Protects internal structures
 **Transport:** Controls movement of substances in and out
 **Cell recognition:** Has markers (glycoproteins) for identification
 **Communication:** Receives signals from other cells

**Analogy:** Like a security guard at a gate - controls who enters and exits

**2. NUCLEUS**

**Structure:**
 Largest organelle (usually)
 Surrounded by double membrane (nuclear envelope) with pores
 Contains chromatin (DNA + proteins)
 Has nucleolus inside (makes ribosomes)

**Function:**
 **Control center:** Controls all cell activities
 **Stores genetic information:** Contains DNA with instructions for making proteins
 **Inheritance:** Passes genetic information to daughter cells
 **Makes ribosomes:** Nucleolus produces ribosomal RNA

**Analogy:** Like the principal's office - controls the whole school

**3. CYTOPLASM**

**Structure:**
 Jelly-like fluid filling cell
 Contains water, salts, enzymes, nutrients
 Cytosol (liquid part) + organelles = cytoplasm

**Function:**
 **Medium for chemical reactions:** Where many metabolic reactions occur
 **Holds organelles in place:** Suspends organelles
 **Transport:** Substances move through it

**Analogy:** Like a swimming pool where everything floats

**4. MITOCHONDRIA (singular: mitochondrion)**

**Structure:**
 Rod-shaped or oval organelles
 Double membrane (outer and inner)
 Inner membrane folded into cristae (increases surface area)
 Has its own DNA (inherited from mother)

**Function:**
 **Powerhouse of the cell:** Produces energy (ATP) through cellular respiration
 **Aerobic respiration:** Glucose + Oxygen  CO2 + H2O + Energy (ATP)
 More mitochondria in active cells (muscle cells, liver cells)

**Analogy:** Like a power plant generating electricity

**Why cells need ATP:** ATP (Adenosine Triphosphate) is the "energy currency" of cells - used for all energy-requiring activities (movement, growth, active transport, protein synthesis)

**5. RIBOSOMES**

**Structure:**
 Tiny organelles (not visible with light microscope)
 Made of ribosomal RNA (rRNA) and proteins
 Found free in cytoplasm or attached to endoplasmic reticulum
 Type: 80S in eukaryotes

**Function:**
 **Protein synthesis:** Makes proteins by linking amino acids
 Reads instructions from mRNA (messenger RNA)
 Free ribosomes make proteins for cell use
 Attached ribosomes make proteins for export

**Analogy:** Like a factory assembly line making products (proteins)

**6. ENDOPLASMIC RETICULUM (ER)**

**Structure:**
 Network of folded membranes forming channels
 Connected to nuclear envelope
 Two types: Rough ER and Smooth ER

**ROUGH ER:**
 Has ribosomes attached to surface (looks "rough")
 **Function:** Protein synthesis and transport - makes and modifies proteins

**SMOOTH ER:**
 No ribosomes (looks "smooth")
 **Function:** Lipid synthesis, detoxification, calcium storage

**Analogy:** Like a highway system transporting goods

**7. GOLGI APPARATUS (GOLGI BODY/COMPLEX)**

**Structure:**
 Stack of flattened membrane sacs (like pancakes)
 Has receiving face (cis) and shipping face (trans)

**Function:**
 **Packaging and modification:** Modifies, packages, and sorts proteins
 **Secretion:** Prepares proteins for export from cell
 **Makes lysosomes:** Produces lysosomes

**Analogy:** Like a post office - packages and ships items

**Pathway:** Ribosomes make protein  ER transports  Golgi modifies and packages  Vesicles transport to destination

**8. LYSOSOMES**

**Structure:**
 Small, round organelles
 Surrounded by membrane
 Contains digestive enzymes

**Function:**
 **Digestion:** Breaks down old organelles, bacteria, food particles
 **Waste disposal:** Digest worn-out cell parts
 **Cell death:** Can destroy entire cell when necessary (apoptosis)

**Analogy:** Like a recycling center or garbage disposal

**9. VACUOLES**

**Structure:**
 Membrane-bound sacs
 Small in animal cells (or absent)
 Larger in younger/plant cells

**Function:**
 **Storage:** Store water, nutrients, waste products
 **Digestion:** Food vacuoles digest food particles
 **Waste removal:** Contract to expel waste (in single-celled organisms)

**10. CENTRIOLES** (in most animal cells)

**Structure:**
 Pair of cylindrical structures
 Made of microtubules
 Located near nucleus

**Function:**
 **Cell division:** Help organize spindle fibers during cell division
 **Form cilia and flagella:** In cells that have these structures

**Absent in most plant cells**

**11. CYTOSKELETON**

**Structure:**
 Network of protein fibers throughout cytoplasm
 Three types: microfilaments, intermediate filaments, microtubules

**Function:**
 **Support:** Maintains cell shape
 **Movement:** Helps cell and organelles move
 **Transport:** Tracks for vesicle movement

**Analogy:** Like the skeleton and muscles of the cell

**SUMMARY - ANIMAL CELL ORGANELLES:**

| Organelle | Main Function | Memory Aid |
|-----------|--------------|------------|
| **Cell Membrane** | Controls entry/exit | Security guard |
| **Nucleus** | Control center, stores DNA | Principal's office |
| **Mitochondria** | Makes energy (ATP) | Power plant |
| **Ribosomes** | Makes proteins | Factory |
| **Rough ER** | Protein transport | Highway for proteins |
| **Smooth ER** | Makes lipids | Highway for fats |
| **Golgi** | Packages proteins | Post office |
| **Lysosomes** | Digests waste | Garbage disposal |
| **Vacuoles** | Storage | Warehouse |
| **Centrioles** | Cell division | Division organizers |`
      },
      {
        title: '3. Cell Structure - Plant Cell Organelles',
        content: `**PLANT CELL STRUCTURE**

Plant cells have all the organelles found in animal cells (except centrioles in most plants), PLUS three additional structures:

**ORGANELLES SHARED WITH ANIMAL CELLS:**
 Cell membrane
 Nucleus
 Cytoplasm
 Mitochondria
 Ribosomes
 Endoplasmic reticulum (rough and smooth)
 Golgi apparatus

**PLANT-SPECIFIC STRUCTURES:**

**1. CELL WALL**

**Structure:**
 Rigid, tough outer layer outside cell membrane
 Made primarily of **cellulose** (a carbohydrate)
 Primary wall: thin, flexible (in growing cells)
 Secondary wall: thick, rigid (in mature cells)
 Middle lamella: pectin layer between adjacent cells

**Function:**
 **Support:** Provides shape and structural support
 **Protection:** Protects against mechanical damage
 **Prevents overexpansion:** Stops cell from bursting when water enters
 **Maintains plant shape:** Allows plants to stand upright
 **Permeability:** Fully permeable (unlike cell membrane)

**Why plants need it:**
 Plants don't have skeleton
 Need rigid structure to stand upright
 Need protection from environment

**Examples in Ghana:**
 **Cocoa pods:** Thick cell walls give hard outer shell
 **Palm trees:** Strong cell walls in trunk for support
 **Vegetables (cabbage, lettuce):** Cell walls give crispy texture

**2. CHLOROPLASTS**

**Structure:**
 Oval or disc-shaped organelles
 Double membrane
 Contains thylakoids (stacks called grana)
 Contains chlorophyll (green pigment)
 Has its own DNA

**Function:**
 **Photosynthesis:** Makes food (glucose) from sunlight, CO2, and water
 **Equation:** 6CO2 + 6H2O + Light energy  C2H22O2 (glucose) + 6O2
 **Produces oxygen:** Released as by-product
 **Converts light energy to chemical energy**

**Where found:**
 Only in green parts of plants (leaves, green stems)
 Not in roots, flowers, or non-green parts
 More chloroplasts in palisade mesophyll cells (top of leaf)

**Why plants need it:**
 Plants are **autotrophs** (self-feeders)
 Make their own food through photosynthesis
 Animals are **heterotrophs** (other-feeders) - cannot make food

**Chlorophyll:** Green pigment that absorbs light energy (mainly red and blue light, reflects green - that's why plants look green)

**Ghana connection:**
 All green plants (cocoa, plantain, vegetables) use chloroplasts for photosynthesis
 More sunlight = more photosynthesis = better crop yields

**3. LARGE CENTRAL VACUOLE**

**Structure:**
 Large, membrane-bound sac
 Takes up 30-90% of plant cell volume
 Membrane called **tonoplast**
 Filled with **cell sap** (water + dissolved substances)

**Function:**
 **Storage:** Stores water, nutrients, pigments, waste products
 **Turgor pressure:** Filled with water, presses against cell wall, keeps plant rigid
 **Support:** Helps maintain plant shape when full
 **Pigments:** Contains anthocyanins (red, purple, blue colors in flowers/fruits)
 **Waste storage:** Stores toxic waste products safely

**Turgor pressure:**
 When vacuole is full of water  cell firm  plant stands upright
 When vacuole loses water  cell flaccid  plant wilts

**Example:**
 **Fresh vegetables:** High turgor pressure, crispy
 **Wilted vegetables:** Lost water, low turgor, soft

**Why plants need large vacuole:**
 Plants cannot drink like animals
 Need to store water for dry periods
 Helps maintain structure without skeleton

**4. PLASMODESMATA**

**Structure:**
 Tiny channels through cell walls
 Connect cytoplasm of adjacent plant cells
 Allow direct communication between cells

**Function:**
 **Transport:** Move substances between cells
 **Communication:** Allow cells to work together
 **Coordination:** Help coordinate plant activities

**COMPARISON: PLANT vs. ANIMAL CELLS**

| Structure | Plant Cell | Animal Cell |
|-----------|-----------|-------------|
| **Cell wall** | ✓ Present (cellulose) | ✗ Absent |
| **Cell membrane** | ✓ Present | ✓ Present |
| **Nucleus** | ✓ Present | ✓ Present |
| **Chloroplasts** | ✓ Present (in green parts) | ✗ Absent |
| **Large central vacuole** | ✓ Present (large) | Small or absent |
| **Mitochondria** | ✓ Present | ✓ Present |
| **Ribosomes** | ✓ Present | ✓ Present |
| **ER & Golgi** | ✓ Present | ✓ Present |
| **Lysosomes** | Rare | Common |
| **Centrioles** | ✗ Absent (in most) | ✓ Present |
| **Shape** | Regular (rectangular) | Irregular |
| **Energy source** | Photosynthesis + respiration | Respiration only |

**KEY POINTS:**

**Why these differences exist:**

| Feature | Plant | Animal |
|---------|-------|--------|
| **Nutrition** | Make own food (autotroph) | Eat food (heterotroph) |
| **Movement** | Stationary | Move around |
| **Support** | Cell wall + turgor | Skeleton |
| **Energy** | Sunlight + food | Food only |

**Plants have:**
 Cell wall  for support (no skeleton)
 Chloroplasts  to make food
 Large vacuole  to store water (can't drink)

**Animals have:**
 No cell wall  need flexibility to move
 No chloroplasts  eat food instead
 Centrioles  for cell division (most plants don't have)`
      },
      {
        title: '4. Specialized Cells',
        content: `**CELL SPECIALIZATION (DIFFERENTIATION)**

Not all cells are the same! Even though all cells in your body have the same DNA, they become **specialized** to perform specific functions. This process is called **differentiation**.

**Why cells specialize:**
 **Efficiency:** Specialized cells do specific jobs better
 **Division of labor:** Different cells handle different tasks
 **Complexity:** Allows multi-cellular organisms to function

**SPECIALIZED ANIMAL CELLS**

**1. RED BLOOD CELLS (ERYTHROCYTES)**

**Special Features:**
 **Biconcave disc shape** (dented in middle on both sides)
 **No nucleus** (in mammals) - more space for hemoglobin
 **Contains hemoglobin** (red protein)
 **Flexible membrane** - can squeeze through narrow capillaries
 **Small size** (7-8 μm diameter)

**Function:**
 **Transport oxygen** from lungs to body tissues
 **Transport CO2** from tissues to lungs
 Hemoglobin binds oxygen

**Structure-Function relationship:**
 Biconcave shape  large surface area for oxygen absorption
 No nucleus  more room for hemoglobin
 Flexible  can bend through narrow blood vessels

**Ghana connection:**
 **Sickle cell disease:** Common in Ghana, red blood cells become sickle-shaped
 **Anemia:** Low red blood cells - need iron-rich foods (beans, green leaves, meat)

**2. WHITE BLOOD CELLS (LEUKOCYTES)**

**Special Features:**
 **Has nucleus** (unlike red blood cells)
 **Irregular shape** - can change shape
 **Can move** (amoeboid movement)
 **Larger than red blood cells**

**Function:**
 **Defend against disease** (immune system)
 **Destroy pathogens** (bacteria, viruses)
 **Produce antibodies**

**Types:**
 Phagocytes: engulf and destroy pathogens
 Lymphocytes: produce antibodies

**3. NERVE CELLS (NEURONS)**

**Special Features:**
 **Long, thin extensions** (axon can be over 1 meter long!)
 **Branched dendrites** for receiving signals
 **Myelin sheath** - insulation around axon
 **Synapses** - connections with other neurons

**Function:**
 **Transmit electrical signals** rapidly
 **Carry information** from brain to body and vice versa
 **Enable quick responses**

**Structure-Function relationship:**
 Long axon  signals travel long distances
 Myelin sheath  insulation speeds up transmission
 Branched dendrites  connect to many neurons

**4. MUSCLE CELLS**

**Special Features:**
 **Long, thin, cylinder-shaped**
 **Many mitochondria** (need lots of energy)
 **Special proteins** (actin and myosin) for contraction
 **Multinucleated** (skeletal muscle cells have many nuclei)

**Function:**
 **Contract and relax** to produce movement
 **Generate force**

**Types:**
 Skeletal muscle: voluntary movement
 Cardiac muscle: heart contractions
 Smooth muscle: involuntary (digestive system)

**Structure-Function relationship:**
 Many mitochondria  produce ATP for contraction
 Protein filaments  slide past each other to contract

**5. SPERM CELLS**

**Special Features:**
 **Streamlined head** - contains nucleus with DNA
 **Long tail (flagellum)** for swimming
 **Midpiece with many mitochondria** for energy
 **Acrosome** (cap) with enzymes to penetrate egg

**Function:**
 **Deliver male DNA to egg** for fertilization
 **Swim to egg**

**Structure-Function relationship:**
 Streamlined  reduces resistance when swimming
 Tail  propels sperm forward
 Many mitochondria  energy for swimming
 Acrosome enzymes  digest egg membrane

**6. EGG CELL (OVUM)**

**Special Features:**
 **Large cell** - biggest human cell
 **Lots of cytoplasm** with nutrients (yolk)
 **Cell membrane** changes after fertilization to block other sperm

**Function:**
 **Provide female DNA** for fertilization
 **Nourish** early embryo

**Structure-Function relationship:**
 Large size  lots of nutrients for developing embryo
 Nutrients in cytoplasm  feed embryo until implantation

**SPECIALIZED PLANT CELLS**

**1. PALISADE MESOPHYLL CELLS** (in leaves)

**Special Features:**
 **Column-shaped** (tightly packed)
 **Many chloroplasts** (30-50 per cell)
 **Located at top of leaf** (near surface)
 **Thin cell walls**

**Function:**
 **Main site of photosynthesis**
 **Absorb sunlight**

**Structure-Function relationship:**
 Column shape, tightly packed  maximize light absorption
 Many chloroplasts  maximum photosynthesis
 Near leaf surface  receive most light

**2. ROOT HAIR CELLS**

**Special Features:**
 **Long, thin extension** (root hair) - increases surface area
 **Large vacuole**
 **Thin cell wall** for easy absorption
 **No chloroplasts** (underground, no light)

**Function:**
 **Absorb water and minerals** from soil
 **Anchor plant**

**Structure-Function relationship:**
 Long extension  huge surface area for absorption
 Thin wall  water enters easily
 No chloroplasts  not needed underground

**Ghana connection:**
 Plants need water to survive dry season
 Root hairs help cassava, yam, cocoa absorb water and nutrients

**3. XYLEM CELLS**

**Special Features:**
 **Dead at maturity** (hollow tubes)
 **Thick, lignified (woody) walls**
 **No end walls** between cells - form continuous tubes
 **Strong structure**

**Function:**
 **Transport water and minerals** from roots to leaves
 **Provide support** (strength)

**Structure-Function relationship:**
 Hollow tubes  easy flow of water
 No end walls  continuous pathway
 Thick walls  prevent collapse, provide support
 Dead cells  no obstruction to water flow

**4. PHLOEM CELLS** (sieve tube elements)

**Special Features:**
 **Living cells** (but no nucleus at maturity)
 **Sieve plates** - end walls with holes
 **Companion cells** attached - control activities

**Function:**
 **Transport sugars** (sucrose) from leaves to all parts
 **Translocate organic materials**

**Structure-Function relationship:**
 Sieve plates  allow sugar solution to flow
 Companion cells  provide energy and control
 Living cells  can actively transport sugars

**SUMMARY TABLE:**

| Cell Type | Special Feature | Function |
|-----------|----------------|----------|
| **Red blood cell** | No nucleus, biconcave | Transport O2 |
| **White blood cell** | Can change shape | Fight disease |
| **Nerve cell** | Long axon | Transmit signals |
| **Muscle cell** | Many mitochondria | Contract for movement |
| **Sperm cell** | Tail, streamlined | Swim to egg |
| **Palisade cell** | Many chloroplasts | Photosynthesis |
| **Root hair cell** | Long extension | Absorb water |
| **Xylem** | Dead, hollow tubes | Transport water |
| **Phloem** | Sieve plates | Transport sugars |

**Key Principle:**
**STRUCTURE FITS FUNCTION** - The structure of a cell is adapted to suit its particular function.`
      },
      {
        title: '5. Movement Across Cell Membranes',
        content: `The cell membrane is **selectively permeable** - it allows some substances to pass through but not others. There are three main ways substances move across cell membranes:

**1. DIFFUSION**

**Definition:**
The **net movement** of particles from an area of **higher concentration** to an area of **lower concentration** until evenly distributed (equilibrium reached).

**Characteristics:**
 **Passive process** - no energy (ATP) required
 **Down concentration gradient** (high  low)
 **Random particle movement**
 **Continues until equilibrium** reached

**Examples:**
 **Oxygen entering cells:** O2 higher in blood  diffuses into cells (lower O2)
 **CO2 leaving cells:** CO2 higher in cells  diffuses into blood (lower CO2)
 **Perfume spreading:** Smell spreads through room
 **Tea bag in water:** Color spreads throughout water

**Ghana examples:**
 Aroma of waakye spreading in kitchen
 Smoke from charcoal fire spreading through air
 Palm oil spreading through soup

**Factors Affecting Rate of Diffusion:**
 **Temperature:** Higher temperature  faster diffusion (particles move faster)
 **Concentration gradient:** Steeper gradient  faster diffusion
 **Surface area:** Larger area  faster diffusion
 **Distance:** Shorter distance  faster diffusion
 **Size of particles:** Smaller particles  faster diffusion

**2. OSMOSIS**

**Definition:**
The **net movement** of **water molecules** from a region of **higher water concentration** (dilute solution) to a region of **lower water concentration** (concentrated solution) through a **selectively permeable membrane**.

**Key Points:**
 **Special case of diffusion** - for water only
 **Passive process** - no energy needed
 **Requires selectively permeable membrane**
 **Water moves from dilute  concentrated solution**
 **Water moves down its concentration gradient**

**Important Terms:**

**Isotonic Solution:**
 Same concentration as cell contents
 **No net water movement**
 Cell stays same size
 Example: 0.9% salt solution for human cells

**Hypotonic Solution:**
 Lower concentration than cell (more dilute)
 **Water enters cell** by osmosis
 **Animal cell:** May burst (lysis)
 **Plant cell:** Becomes turgid (firm) - cell wall prevents bursting

**Hypertonic Solution:**
 Higher concentration than cell (more concentrated)
 **Water leaves cell** by osmosis
 **Animal cell:** Shrinks (crenation)
 **Plant cell:** Becomes plasmolyzed (shriveled, membrane pulls away from wall)

**Examples of Osmosis:**

**In Daily Life:**
 **Raisins in water:** Swell up (water enters by osmosis)
 **Salting meat/fish:** Preserves by removing water (water leaves bacteria)
 **Fresh vegetables in salt water:** Become limp (water leaves)
 **Soaking beans:** Beans swell (water enters)

**Ghana examples:**
 **Salting fish:** Water leaves fish cells  preservation
 **Wilting vegetables:** Lost water through osmosis
 **Soaking gari:** Swells as water enters
 **Pickling:** Salt draws water out, preserves food

**In Living Organisms:**
 **Plant cells:** Absorb water from soil by osmosis (through root hairs)
 **Turgor in plants:** Water enters vacuole  pushes against cell wall  plant stays upright
 **Wilting:** Plant loses water  cells lose turgor  plant droops

**Why Osmosis Matters:**

**For Plants:**
 Uptake of water from soil
 Maintain turgor (stay upright)
 Transport in xylem
 Wilting when water scarce

**For Animals:**
 Maintain cell volume
 Balance body fluids
 Kidney function (regulate water)

**For Food Preservation:**
 Salting and sugaring remove water from food
 Bacteria cannot survive without water
 Traditional preservation methods in Ghana

**3. ACTIVE TRANSPORT**

**Definition:**
The movement of particles from an area of **lower concentration** to an area of **higher concentration** (against concentration gradient) using **energy (ATP)**.

**Characteristics:**
 **Active process** - requires energy (ATP)
 **Against concentration gradient** (low  high)
 **Uses carrier proteins** in membrane
 **Selective** - specific substances transported

**Why Needed:**
Sometimes cells need to:
 **Accumulate substances** to higher concentration inside than outside
 **Remove waste** against concentration gradient
 **Maintain concentration differences**

**Examples:**

**In Animals:**
 **Sodium-potassium pump:** Maintains ion balance in nerve cells
  - Pumps Na⁺ OUT (against gradient)
  - Pumps K⁺ IN (against gradient)
  - Essential for nerve impulse transmission
 **Glucose absorption:** Intestine absorbs all glucose even when concentration inside is higher

**In Plants:**
 **Mineral uptake:** Root cells absorb minerals (nitrates, phosphates) from soil even when concentration in root is already higher than in soil
 **Ions in xylem:** Active loading of minerals into xylem

**Ghana example:**
 Crops in nutrient-poor soil actively transport whatever minerals are available
 Farmers add fertilizers to increase mineral availability

**COMPARISON OF TRANSPORT METHODS:**

| Feature | Diffusion | Osmosis | Active Transport |
|---------|-----------|---------|------------------|
| **What moves** | Any particles | Water only | Any particles |
| **Direction** | High  Low conc. | High  Low water conc. | Low  High conc. |
| **Energy** | No (passive) | No (passive) | Yes - ATP (active) |
| **Membrane** | Not always needed | Needs selectively permeable | Needs carrier proteins |
| **Examples** | O2, CO2 | Water into cells | Mineral uptake, Na⁺/K⁺ pump |

**Summary:**
 **Diffusion:** Particles spread out naturally
 **Osmosis:** Water moves to balance concentrations
 **Active transport:** Cells use energy to move substances where needed`
      }
    ],

    pastQuestions: [
      {
        year: '2021',
        question: 'State three differences between plant and animal cells.',
        solution: `**Three Differences Between Plant and Animal Cells:**

**DIFFERENCE 1: CELL WALL**

**Plant Cell:**
 **Has cell wall** made of cellulose
 Rigid outer layer outside cell membrane
 Provides structural support and shape

**Animal Cell:**
 **No cell wall** - only cell membrane
 More flexible structure
 Can change shape easily

**Why:** Plants need rigid structure for support (no skeleton), while animals need flexibility for movement.

**DIFFERENCE 2: CHLOROPLASTS**

**Plant Cell:**
 **Has chloroplasts** in green parts (leaves, stems)
 Contains chlorophyll (green pigment)
 Site of photosynthesis - makes food from sunlight

**Animal Cell:**
 **No chloroplasts**
 Cannot make own food
 Must eat food (heterotroph)

**Why:** Plants are autotrophs (make own food), while animals are heterotrophs (eat food).

**DIFFERENCE 3: VACUOLES**

**Plant Cell:**
 **Large central vacuole** takes up 30-90% of cell volume
 Stores water, maintains turgor pressure
 Helps maintain plant shape and rigidity
 Contains cell sap

**Animal Cell:**
 **Small vacuoles or none**
 If present, used for temporary storage
 Much smaller than plant vacuoles

**Why:** Plants need large water storage (can't drink like animals) and use turgor pressure for support.

**SUMMARY TABLE:**

| Feature | Plant Cell | Animal Cell |
|---------|-----------|-------------|
| **Cell wall** | Present (cellulose) | Absent |
| **Chloroplasts** | Present (in green parts) | Absent |
| **Vacuole** | Large, central | Small or absent |

**Additional Differences (bonus):**

**4. Shape:**
 Plant cells: Regular, rectangular shape (due to cell wall)
 Animal cells: Irregular, variable shape

**5. Centrioles:**
 Plant cells: Absent in most plants
 Animal cells: Present (help in cell division)

**6. Plasmodesmata:**
 Plant cells: Present (channels between cells)
 Animal cells: Absent`
      },
      {
        year: '2020',
        question: 'Explain the functions of the following cell organelles: (a) Nucleus (b) Mitochondria (c) Ribosomes',
        solution: `**Functions of Cell Organelles:**

**(a) NUCLEUS**

The nucleus is the **control center** of the cell.

**Main Functions:**

**1. Controls all cell activities:**
 Acts like the "brain" of the cell
 Regulates all chemical reactions and processes
 Determines what the cell does and when

**2. Stores genetic information:**
 Contains DNA (deoxyribonucleic acid)
 DNA has genes with instructions for making proteins
 All hereditary information stored here

**3. Transmits genetic information:**
 Passes genetic information to daughter cells during cell division
 Ensures offspring cells are identical to parent cell
 Inheritance through DNA

**4. Controls protein synthesis:**
 DNA in nucleus contains instructions for making proteins
 Controls which proteins are made and when
 RNA carries messages from nucleus to ribosomes

**5. Produces ribosomes:**
 Nucleolus (inside nucleus) makes ribosomal RNA
 Assembles ribosome subunits

**Analogy:** Like a principal's office controlling the whole school, or a control room running a factory.

**(b) MITOCHONDRIA**

Mitochondria are the **powerhouses** of the cell.

**Main Functions:**

**1. Produces energy (ATP):**
 Site of aerobic cellular respiration
 Breaks down glucose to release energy
 Energy stored in ATP (Adenosine Triphosphate) molecules

**Equation of cellular respiration:**
Glucose + Oxygen  Carbon dioxide + Water + Energy (ATP)
C2H22O2 + 6O2  6CO2 + 6H2O + ATP

**2. Converts chemical energy:**
 Converts energy in food (glucose) into usable form (ATP)
 ATP is the "energy currency" of cells
 Used for all energy-requiring activities

**3. Provides energy for cell activities:**
 Movement (muscle contraction)
 Active transport
 Protein synthesis
 Cell division
 Nerve impulse transmission

**Important Notes:**
 More mitochondria in very active cells (muscle cells, liver cells, sperm)
 Has its own DNA (inherited from mother only)
 Cristae (inner folds) provide large surface area for reactions

**Analogy:** Like a power plant or generator producing electricity for the cell.

**(c) RIBOSOMES**

Ribosomes are the **protein factories** of the cell.

**Main Functions:**

**1. Protein synthesis:**
 Site where proteins are made
 Links amino acids together to form proteins
 Reads instructions from mRNA (messenger RNA)

**2. Two types based on location:**

**Free ribosomes** (in cytoplasm):
 Make proteins for use within the cell
 Examples: enzymes, cytoplasm proteins

**Attached ribosomes** (on rough ER):
 Make proteins for export out of cell
 Examples: hormones, antibodies, digestive enzymes

**Process:**
1. DNA in nucleus  transcribes instructions to mRNA
2. mRNA leaves nucleus  goes to ribosome
3. Ribosome reads mRNA  links amino acids in correct order
4. Protein chain forms

**Why Important:**
 Proteins are essential for:
  - Structure (muscles, hair, skin)
  - Enzymes (speed up reactions)
  - Hormones (chemical messengers)
  - Antibodies (fight disease)
  - Transport (hemoglobin carries oxygen)

**Structure:**
 Very small (not visible with light microscope)
 Made of ribosomal RNA + proteins
 Type: 80S in eukaryotes, 70S in prokaryotes

**Analogy:** Like a factory assembly line manufacturing products (proteins).

**SUMMARY TABLE:**

| Organelle | Main Function | Analogy |
|-----------|--------------|---------|
| **Nucleus** | Control center, stores DNA | Principal's office |
| **Mitochondria** | Produces energy (ATP) | Power plant |
| **Ribosomes** | Makes proteins | Factory |

**Working Together:**
 Nucleus provides instructions (DNA)
 Ribosomes follow instructions to make proteins
 Mitochondria provide energy for all activities
 All three essential for cell survival`
      },
      {
        year: '2019',
        question: 'What is osmosis Describe what happens to a plant cell when placed in: (i) distilled water (ii) concentrated salt solution',
        solution: `**OSMOSIS - Definition:**

**Osmosis** is the **net movement of water molecules** from a region of **higher water concentration** (dilute solution) to a region of **lower water concentration** (concentrated solution) through a **selectively permeable membrane**.

**Key Points:**
 Special type of diffusion (for water only)
 Passive process (no energy required)
 Water moves down its concentration gradient
 Requires selectively permeable membrane

**(i) PLANT CELL IN DISTILLED WATER** (Hypotonic Solution)

**What Happens:**

**Step 1: Water concentration gradient**
 Distilled water has 100% water (very dilute)
 Cell sap in vacuole has lower water concentration (has dissolved salts, sugars)
 Water concentration **higher outside** than inside

**Step 2: Osmosis occurs**
 Water moves **INTO the cell** by osmosis
 Through selectively permeable cell membrane
 Down water concentration gradient (high  low)

**Step 3: Cell swells**
 Water enters vacuole
 Vacuole expands
 Cell membrane pushed against cell wall

**Step 4: Cell becomes TURGID**
 Cell is full of water
 Firm, swollen condition
 **Turgor pressure** - pressure of cell contents pushing against cell wall
 Cell wall prevents bursting (unlike animal cells)

**Result:**
 **TURGID CELL** - firm, rigid, fully swollen
 This is the normal, healthy state for plant cells
 Turgor in all cells  plant stands upright

**Diagram description:**
[Cell wall remains rigid, cell membrane pressed against wall, large vacuole full of water, cell fully swollen]

**Practical Example:**
 Wilted vegetables placed in water become crisp again
 Fresh cassava or yam feels firm
 Healthy plant stands upright

**(ii) PLANT CELL IN CONCENTRATED SALT SOLUTION** (Hypertonic Solution)

**What Happens:**

**Step 1: Water concentration gradient**
 Concentrated salt solution has low water concentration (lots of dissolved salt)
 Cell sap in vacuole has higher water concentration
 Water concentration **higher inside** than outside

**Step 2: Osmosis occurs**
 Water moves **OUT of the cell** by osmosis
 Through selectively permeable cell membrane
 Down water concentration gradient (high  low)

**Step 3: Cell shrinks**
 Water leaves vacuole
 Vacuole becomes smaller
 Cell contents shrink

**Step 4: Cell becomes PLASMOLYZED**
 **Plasmolysis** - cytoplasm and cell membrane pull away from cell wall
 Cell membrane shrinks and detaches from cell wall
 Gap forms between cell membrane and cell wall
 Cell becomes flaccid (limp, soft)

**Result:**
 **PLASMOLYZED CELL** - shrunken, membrane pulled away from wall
 Cell wall remains rigid (doesn't shrink)
 Cell membrane and cytoplasm shrink

**Diagram description:**
[Cell wall unchanged, cell membrane pulled away creating gap, small shrunken vacuole, cytoplasm shrunk]

**Practical Example:**
 Vegetables in salt water become limp
 Plant wilts in very dry soil
 Salted vegetables lose water and become soft

**COMPARISON TABLE:**

| Aspect | In Distilled Water (Hypotonic) | In Concentrated Salt (Hypertonic) |
|--------|-------------------------------|----------------------------------|
| **Water concentration** | Higher outside | Higher inside |
| **Direction of osmosis** | Water enters cell | Water leaves cell |
| **Vacuole** | Expands, gets bigger | Shrinks, gets smaller |
| **Cell membrane** | Pushed against cell wall | Pulls away from cell wall |
| **Condition** | Turgid (firm, swollen) | Plasmolyzed (shrunken) |
| **Feel** | Firm, crisp | Limp, soft |
| **Plant appearance** | Upright, healthy | Wilted, drooping |

**Why Cell Wall Matters:**

**Plant cell:**
 Cell wall prevents bursting in hypotonic solution
 Cell becomes turgid but doesn't burst
 Can recover from plasmolysis if returned to water

**Animal cell (no cell wall):**
 Would burst (lyse) in hypotonic solution
 Would shrink (crenate) in hypertonic solution
 More vulnerable to osmotic changes

**Applications in Ghana:**

**Food Preservation:**
 **Salting fish:** Salt draws water out of fish and bacterial cells  preservation
 **Sugaring fruits:** Sugar solution removes water  preserves jam

**Agriculture:**
 **Overuse of fertilizer:** Too much fertilizer in soil  plasmolysis  plants wilt
 **Proper watering:** Maintains turgor  healthy, upright plants
 **Dry season:** Soil water scarce  plants wilt (lose turgor)

**Reversibility:**
 Plasmolysis can be reversed by placing cell back in water
 Turgid cells can become plasmolyzed if water is removed
 Process is reversible until cell dies`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'Which organelle is known as the "powerhouse of the cell"',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
          answer: 'Mitochondria',
          explanation: 'Mitochondria produce ATP (energy) through cellular respiration, providing power for all cell activities.'
        },
        {
          type: 'mcq',
          question: 'What is the main difference between plant and animal cells',
          options: ['Animal cells have a nucleus', 'Plant cells have a cell wall', 'Animal cells have mitochondria', 'Plant cells have ribosomes'],
          answer: 'Plant cells have a cell wall',
          explanation: 'Plant cells have a rigid cell wall made of cellulose outside the cell membrane. Animal cells lack this structure.'
        },
        {
          type: 'mcq',
          question: 'Which process allows water to enter plant cells, making them turgid',
          options: ['Active transport', 'Osmosis', 'Diffusion', 'Phagocytosis'],
          answer: 'Osmosis',
          explanation: 'Osmosis is the movement of water from high to low concentration through a semi-permeable membrane, causing plant cells to swell and become turgid.'
        },
        {
          type: 'truefalse',
          statement: 'Chloroplasts are found in both plant and animal cells.',
          answer: 'false',
          reason: 'Chloroplasts are only found in plant cells (and some protists). They contain chlorophyll for photosynthesis. Animal cells cannot photosynthesize.'
        },
        {
          type: 'mcq',
          question: 'Red blood cells are specialized for:',
          options: ['Fighting infections', 'Transporting oxygen', 'Producing hormones', 'Storing fat'],
          answer: 'Transporting oxygen',
          explanation: 'Red blood cells have a biconcave shape and contain hemoglobin to efficiently carry oxygen from lungs to body tissues.'
        },
        {
          type: 'mcq',
          question: 'The cell membrane is described as "selectively permeable" because:',
          options: ['It blocks all substances', 'It allows only certain substances to pass', 'It has pores everywhere', 'It is completely solid'],
          answer: 'It allows only certain substances to pass',
          explanation: 'Selective permeability means the membrane controls what enters and leaves the cell, allowing some substances through while blocking others.'
        },
        {
          type: 'truefalse',
          statement: 'All living organisms are made of cells.',
          answer: 'true',
          reason: 'The cell theory states that all living things are composed of one or more cells. Cells are the basic unit of life.'
        },
        {
          type: 'mcq',
          question: 'When a plant cell is placed in a concentrated salt solution, it becomes:',
          options: ['Turgid', 'Plasmolyzed', 'Lysed', 'Hyperactive'],
          answer: 'Plasmolyzed',
          explanation: 'In hypertonic solution, water leaves the cell by osmosis. The cell membrane pulls away from the cell wall - this is plasmolysis.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'Which of the following is NOT a principle of cell theory',
        options: [
          'All living things are made of cells',
          'The cell is the basic unit of life',
          'All cells come from pre-existing cells',
          'All cells contain chloroplasts'
        ],
        answer: 'All cells contain chloroplasts',
        explanation: 'Only plant cells (in green parts) have chloroplasts. Animal cells, fungi, and many other organisms do not have chloroplasts. The three principles of cell theory are: all living things are made of cells, cells are the basic unit of life, and all cells come from pre-existing cells.'
      },
      {
        type: 'mcq',
        question: 'Which organelle is known as the "powerhouse of the cell"',
        options: [
          'Nucleus',
          'Mitochondria',
          'Chloroplast',
          'Ribosome'
        ],
        answer: 'Mitochondria',
        explanation: 'Mitochondria are called the "powerhouse of the cell" because they produce ATP (energy) through cellular respiration. They break down glucose using oxygen to release energy that the cell can use for all its activities.'
      },
      {
        type: 'mcq',
        question: 'Which structure is found in plant cells but NOT in animal cells',
        options: [
          'Cell membrane',
          'Mitochondria',
          'Cell wall',
          'Ribosomes'
        ],
        answer: 'Cell wall',
        explanation: 'Cell wall (made of cellulose) is present in plant cells but absent in animal cells. The cell wall provides rigid structure and support. Cell membrane, mitochondria, and ribosomes are found in both plant and animal cells.'
      },
      {
        type: 'mcq',
        question: 'What is the main function of ribosomes',
        options: [
          'Produce energy',
          'Make proteins',
          'Store DNA',
          'Digest waste'
        ],
        answer: 'Make proteins',
        explanation: 'Ribosomes are the sites of protein synthesis - they make proteins by linking amino acids together according to instructions from mRNA. Energy production occurs in mitochondria, DNA is stored in the nucleus, and waste digestion occurs in lysosomes.'
      },
      {
        type: 'mcq',
        question: 'What process do chloroplasts carry out',
        options: [
          'Respiration',
          'Protein synthesis',
          'Photosynthesis',
          'Cell division'
        ],
        answer: 'Photosynthesis',
        explanation: 'Chloroplasts are the site of photosynthesis - the process where plants make food (glucose) from carbon dioxide and water using light energy. Chlorophyll in chloroplasts absorbs light energy. Respiration occurs in mitochondria.'
      },
      {
        type: 'mcq',
        question: 'Osmosis is the movement of which substance across a membrane',
        options: [
          'Salt',
          'Sugar',
          'Water',
          'Oxygen'
        ],
        answer: 'Water',
        explanation: 'Osmosis is specifically the movement of water molecules from a region of higher water concentration to lower water concentration through a selectively permeable membrane. It is a special type of diffusion that applies only to water.'
      },
      {
        type: 'mcq',
        question: 'When a plant cell is placed in pure water, it becomes:',
        options: [
          'Plasmolyzed',
          'Turgid',
          'Shriveled',
          'Destroyed'
        ],
        answer: 'Turgid',
        explanation: 'In pure water (hypotonic solution), water enters the plant cell by osmosis. The cell swells and becomes turgid (firm) as the vacuole fills with water and pushes against the cell wall. The cell wall prevents bursting. Plasmolysis occurs in hypertonic (concentrated) solutions.'
      },
      {
        type: 'mcq',
        question: 'Which cell adaptation helps red blood cells transport oxygen efficiently',
        options: [
          'Presence of a nucleus',
          'Biconcave disc shape',
          'Presence of chloroplasts',
          'Having a thick cell wall'
        ],
        answer: 'Biconcave disc shape',
        explanation: 'The biconcave disc shape (dented in middle on both sides) gives red blood cells a large surface area for oxygen absorption. Also, mammalian red blood cells lack a nucleus, providing more space for hemoglobin (the protein that carries oxygen).'
      }
    ],
    summary: 'Cells are the basic units of life. All living things are made of cells that share common features but can be specialized for specific functions. Plant cells have cell walls, chloroplasts, and large vacuoles that animal cells lack. Cell organelles like the nucleus (control center), mitochondria (energy production), and ribosomes (protein synthesis) perform specific functions essential for life. The cell membrane controls what enters and exits through processes like diffusion, osmosis, and active transport. Specialized cells have structures adapted to their particular functions.'
  },

  // Lesson 5: Cell Division - Mitosis and Meiosis
  {
    id: 'is-dm-cells-cell-division',
    slug: 'is-dm-cells-cell-division',
    title: 'Cell Division: Mitosis and Meiosis',
    objectives: [
      'Explain why cells need to divide',
      'Describe the cell cycle and its phases',
      'Explain the stages of mitosis and their importance',
      'Distinguish between mitosis and meiosis',
      'Understand the importance of meiosis in sexual reproduction',
      'Relate cell division to growth, repair, and reproduction'
    ],
    introduction: `Life continues through cell division. Every living organism began as a single cell. Through countless cell divisions, that single cell became trillions of specialized cells working together.

**Why Do Cells Divide**

1. **Growth:** You grew from a single fertilized egg to a baby, child, and adult through cell division
2. **Repair and Replacement:** Your body replaces millions of cells daily - skin cells, blood cells, intestinal lining
3. **Reproduction:** 
   - Asexual reproduction: Single-celled organisms divide to produce offspring
   - Sexual reproduction: Special cell division (meiosis) produces sex cells (gametes)

**In Ghana:**
Understanding cell division helps us:
 **Agriculture:** Plant cuttings grow through cell division; understanding mitosis helps improve propagation
 **Medicine:** Cancer is uncontrolled cell division; understanding normal division helps fight cancer
 **Genetics:** Understanding meiosis explains inheritance patterns and genetic variation
 **Wound Healing:** Cell division repairs cuts and injuries

**Two Types of Cell Division:**

1. **Mitosis:** Produces two identical daughter cells - for growth and repair
2. **Meiosis:** Produces four non-identical sex cells with half the chromosomes - for sexual reproduction

This lesson explores both types of cell division, their stages, and their importance in life processes.`,

    keyConcepts: [
      {
        title: '1. Chromosomes and the Cell Cycle',
        content: `**CHROMOSOMES**

Before understanding cell division, we need to understand chromosomes.

**What are Chromosomes**
 **DNA packages:** Chromosomes are structures in the nucleus made of tightly coiled DNA wrapped around proteins
 **Genetic information:** Carry genes with instructions for making proteins and determining characteristics
 **Visible during cell division:** Normally DNA is spread out (chromatin), but condenses into visible chromosomes during division

**Chromosome Number:**
 Each species has a specific number of chromosomes
 **Humans:** 46 chromosomes (23 pairs)
 **Chimpanzee:** 48 chromosomes
 **Dog:** 78 chromosomes
 **Mosquito:** 6 chromosomes
 **Yam:** 60-70 chromosomes
 **Cocoa:** 20 chromosomes

**Diploid (2n) vs. Haploid (n):**

**Diploid (2n):**
 **Two sets of chromosomes** - one from each parent
 **Represented as 2n**
 Found in **body cells (somatic cells)**
 Humans: 2n = 46 (23 pairs)

**Haploid (n):**
 **One set of chromosomes**
 **Represented as n**
 Found in **sex cells (gametes)** - sperm and egg
 Humans: n = 23 (single set)

**Why this matters:**
 Gametes must be haploid (n)
 When sperm (n) fertilizes egg (n)  zygote is diploid (2n)
 This maintains constant chromosome number in species
 If gametes were diploid, chromosome number would double each generation!

**Homologous Chromosomes:**
 Pairs of chromosomes (one from mother, one from father)
 Similar in size, shape, and genes they carry
 May have different versions (alleles) of same genes
 Example: Both chromosomes 1 have gene for eye color, but one may code for brown, other for blue

**THE CELL CYCLE**

The cell cycle is the life cycle of a cell from its formation to its division into two daughter cells.

**Phases of Cell Cycle:**

**INTERPHASE** (90% of cell cycle - longest phase)
 Cell grows, carries out normal functions, prepares for division
 Subdivided into three phases:

**1. G1 Phase (Gap 1 / Growth 1):**
 **Cell grows** in size
 **Produces enzymes** and proteins needed for DNA replication
 **Carries out normal functions**
 **Makes organelles** (mitochondria, ribosomes, ER)
 Cell decides whether to divide or exit cycle

**2. S Phase (Synthesis):**
 **DNA REPLICATION** occurs - most important event
 Each chromosome is copied/duplicated
 After S phase, each chromosome consists of **two identical sister chromatids** joined at centromere
 Amount of DNA doubles
 Cell now has 92 chromatids (46 chromosomes  2) in humans

**3. G2 Phase (Gap 2 / Growth 2):**
 **Continued growth**
 **Makes proteins** needed for cell division
 **Checks DNA** for replication errors
 **Prepares for mitosis**
 Produces structures needed for division (spindle fibers)

**M PHASE (MITOSIS + CYTOKINESIS)**
 **Mitosis:** Nuclear division - nucleus divides
 **Cytokinesis:** Cytoplasmic division - cell splits into two

**CHECKPOINT CONTROL:**
The cell has checkpoints to ensure everything is ready:

**G1 Checkpoint:**
 Is cell large enough
 Are nutrients available
 Are growth signals present
 Is DNA damaged

**G2 Checkpoint:**
 Is DNA completely replicated
 Is DNA damaged
 Is cell large enough

**M Checkpoint:**
 Are chromosomes properly attached to spindle

**If checkpoints fail  cell division stops OR cell may become cancerous**

**Summary of Cell Cycle:**

| Phase | What Happens | Duration (approx) |
|-------|-------------|------------------|
| **G1** | Cell growth, normal activities | ~9 hours |
| **S** | DNA replication | ~10 hours |
| **G2** | Preparation for division | ~4 hours |
| **M (Mitosis)** | Nuclear division | ~1 hour |
| **Cytokinesis** | Cell splits | ~1 hour |
| **Total** | Complete cell cycle | ~24 hours (varies) |

**Note:** Times vary greatly depending on cell type. Some cells (like nerve cells) exit cell cycle and never divide again. Others (like intestinal cells) divide continuously.`
      },
      {
        title: '2. Mitosis - Cell Division for Growth and Repair',
        content: `**MITOSIS**

**Definition:** Nuclear division that produces **two genetically identical daughter cells** from one parent cell. Each daughter cell has the **same number** of chromosomes as the parent cell.

**Purpose:**
 **Growth:** Increase number of cells in organism
 **Repair:** Replace damaged or dead cells
 **Asexual reproduction:** Some organisms reproduce by mitosis (bacteria, plants from cuttings)
 **Maintenance:** Replace worn-out cells (skin, blood, intestinal lining)

**Where it occurs:**
 All **body cells (somatic cells)**
 NOT in sex cells (gametes use meiosis instead)

**Result:**
 **2 daughter cells**
 **Diploid (2n)** - same chromosome number as parent
 **Genetically identical** to parent and each other (clones)

**STAGES OF MITOSIS**

Mitosis is divided into **four stages:** Prophase, Metaphase, Anaphase, Telophase

**Remember using:** **PMAT** (Prophase, Metaphase, Anaphase, Telophase)

**1. PROPHASE** ("First phase")

**What Happens:**
 **Chromatin condenses** into visible chromosomes
 Each chromosome consists of **two sister chromatids** joined at centromere (from DNA replication in S phase)
 **Centrioles** move to opposite poles of cell (in animal cells)
 **Spindle fibers** begin to form from centrioles
 **Nuclear envelope** begins to break down
 **Nucleolus disappears**

**Key Event:** Chromosomes become visible

**Memory Aid:** **P**rophase = **P**reparation (everything preparing for division)

**2. METAPHASE** ("Middle phase")

**What Happens:**
 Chromosomes **line up at the center (equator)** of the cell
 Position called **metaphase plate** or equatorial plate
 **Spindle fibers** attach to centromere of each chromosome
 Each chromatid attached to spindle fiber from opposite pole
 **Nuclear envelope** completely gone

**Key Event:** Chromosomes aligned at center

**Memory Aid:** **M**etaphase = **M**iddle (chromosomes in middle)

**3. ANAPHASE** ("Away phase")

**What Happens:**
 **Sister chromatids separate** at centromere
 Individual chromatids (now called chromosomes) pulled **toward opposite poles**
 Spindle fibers shorten, pulling chromosomes apart
 Cell elongates
 Each pole receives **identical set** of chromosomes

**Key Event:** Chromatids pulled apart to opposite poles

**Memory Aid:** **A**naphase = **A**part (chromosomes move apart)

**4. TELOPHASE** ("End phase")

**What Happens:**
 Chromosomes reach opposite poles
 **Chromosomes uncoil** back into chromatin
 **Spindle fibers** break down/disappear
 **Nuclear envelope** reforms around each set of chromosomes
 **Nucleolus** reappears in each nucleus
 **Two nuclei** now present in one cell

**Key Event:** Two new nuclei form

**Memory Aid:** **T**elophase = **T**wo nuclei (two nuclei form)

**CYTOKINESIS** (Division of Cytoplasm)

**Occurs during or after telophase:**

**In Animal Cells:**
 **Cleavage furrow** forms (cell membrane pinches inward)
 Furrow deepens until cell splits into two
 Contractile ring of protein filaments tightens like a drawstring

**In Plant Cells:**
 Cannot pinch because of rigid cell wall
 **Cell plate** forms at center (middle of cell)
 Cell plate grows outward toward cell walls
 Becomes new cell wall separating two daughter cells
 Vesicles from Golgi fuse to form cell plate

**RESULT OF MITOSIS:**
 Started with: **1 diploid parent cell (2n)**
 End with: **2 diploid daughter cells (2n)**
 Daughter cells are **genetically identical** to each other and parent
 Example: Human cell 46 chromosomes  mitosis  two cells with 46 chromosomes each

**COMPARISON TABLE: ANIMAL vs PLANT MITOSIS**

| Aspect | Animal Cell | Plant Cell |
|--------|------------|-----------|
| **Centrioles** | Present | Absent (in most) |
| **Spindle formation** | From centrioles | Forms without centrioles |
| **Cytokinesis** | Cleavage furrow (pinching) | Cell plate formation |
| **Shape** | Round during division | Rectangular (cell wall) |

**IMPORTANCE OF MITOSIS:**

**1. Growth:**
 Baby  child  adult (trillions of cell divisions)
 Plant seedling  mature tree

**2. Repair and Regeneration:**
 Wound healing (skin cells divide to close cut)
 Bone healing after fracture
 Liver regeneration
 Lizard regrowing tail (in some species)

**3. Replacement:**
 Skin cells replaced every 2-4 weeks
 Red blood cells replaced every 120 days
 Intestinal lining replaced every 3-5 days

**4. Asexual Reproduction:**
 Bacteria divide by binary fission (similar to mitosis)
 Plant cuttings (cassava stem, sugar cane)
 Budding in yeast
 Regeneration in starfish

**Ghana Examples:**
 **Cassava cuttings:** Plant cassava stem  new plant grows through mitosis
 **Sugar cane propagation:** Plant stem sections  new plants
 **Wound healing:** Cut heals through mitotic cell division
 **Growth:** Children grow taller through bone cell mitosis`
      },
      {
        title: '3. Meiosis - Cell Division for Sexual Reproduction',
        content: `**MEIOSIS**

**Definition:** Nuclear division that produces **four genetically different daughter cells (gametes)** with **half the chromosome number** of the parent cell.

**Purpose:**
 **Produce sex cells (gametes)** - sperm in males, eggs in females
 **Reduce chromosome number** from diploid (2n) to haploid (n)
 **Create genetic variation** through crossing over and independent assortment

**Where it occurs:**
 **Only in sex organs (gonads)**
 Testes (males) - produces sperm
 Ovaries (females) - produces eggs

**Result:**
 **4 daughter cells (gametes)**
 **Haploid (n)** - half chromosome number of parent
 **Genetically different** from parent and each other
 Example: Human cell 46 chromosomes  meiosis  four cells with 23 chromosomes each

**WHY MEIOSIS IS NECESSARY:**

**Problem without meiosis:**
 Parent 1: 46 chromosomes
 Parent 2: 46 chromosomes
 If gametes were diploid (46): Baby would have 92 chromosomes!
 Next generation: 184 chromosomes!
 Chromosome number would double every generation

**Solution with meiosis:**
 Meiosis reduces chromosome number by half
 Sperm: 23 chromosomes (n)
 Egg: 23 chromosomes (n)
 Fertilization: 23 + 23 = 46 chromosomes (2n) ✓
 Maintains constant chromosome number in species

**TWO DIVISIONS IN MEIOSIS:**

Meiosis consists of **two successive divisions:** Meiosis I and Meiosis II

**MEIOSIS I** (Reduction Division)
 **Separates homologous pairs**
 Chromosome number **reduced by half** (2n  n)
 Produces **two haploid cells**

**MEIOSIS II** (Similar to Mitosis)
 **Separates sister chromatids**
 Chromosome number **stays same** (n  n)
 Produces **four haploid cells**

**STAGES OF MEIOSIS I:**

**1. PROPHASE I** (Longest and most complex)

**What Happens:**
 Chromatin condenses into visible chromosomes
 **Homologous chromosomes pair up** (synapsis)
 Paired homologous = **bivalent** or **tetrad** (4 chromatids)
 **CROSSING OVER** occurs - segments of DNA exchanged between homologous chromosomes
 Spindle fibers form
 Nuclear envelope breaks down

**Key Event:** **Crossing over** - creates genetic variation

**Crossing Over Explained:**
 Non-sister chromatids exchange DNA segments
 Produces **recombinant chromosomes** with new gene combinations
 Major source of genetic variation
 Why siblings (except identical twins) look different

**2. METAPHASE I**

**What Happens:**
 **Homologous pairs** (bivalents) line up at equator
 Each pair randomly oriented (**independent assortment**)
 Spindle fibers attach to centromeres

**Key Event:** Random arrangement of chromosome pairs (another source of variation)

**3. ANAPHASE I**

**What Happens:**
 **Homologous chromosomes** separate and move to opposite poles
 Sister chromatids **remain together** (unlike mitosis)
 Each pole receives **one chromosome from each pair**

**Key Event:** Separation of homologous pairs

**4. TELOPHASE I and CYTOKINESIS I**

**What Happens:**
 Chromosomes reach poles
 Nuclear envelope may reform (in some organisms)
 Cell divides into **two haploid cells**
 Each cell has **half the chromosome number** but still has sister chromatids

**Result of Meiosis I:**
 **2 haploid cells (n)**
 Each chromosome still consists of **two sister chromatids**
 Cells are **genetically different** from parent

**STAGES OF MEIOSIS II:** (Similar to Mitosis)

**No DNA replication between Meiosis I and II!**

**5. PROPHASE II**
 Chromosomes condense (if they had uncoiled)
 Spindle fibers form
 Nuclear envelope breaks down (if it had reformed)

**6. METAPHASE II**
 Chromosomes line up at equator **individually** (not in pairs)
 Spindle fibers attach to centromeres

**7. ANAPHASE II**
 **Sister chromatids separate** and move to opposite poles
 Now individual chromosomes

**8. TELOPHASE II and CYTOKINESIS II**
 Nuclear envelopes reform
 Chromosomes uncoil
 Cells divide

**FINAL RESULT OF MEIOSIS:**
 Started with: **1 diploid parent cell (2n = 46 in humans)**
 End with: **4 haploid gametes (n = 23 in humans)**
 All four cells are **genetically unique**

**GENETIC VARIATION IN MEIOSIS:**

Meiosis creates variation through:

**1. Crossing Over (Prophase I):**
 DNA segments exchanged between homologous chromosomes
 Creates new gene combinations
 Produces recombinant chromosomes

**2. Independent Assortment (Metaphase I):**
 Random orientation of homologous pairs at equator
 Each pair independently decides which chromosome goes to which pole
 With 23 pairs in humans: 2 = **8.4 million** different combinations possible!

**3. Random Fertilization:**
 Any sperm (from millions) can fertilize egg
 Further increases variation

**Result:** No two gametes (or individuals) are exactly alike (except identical twins)

**DIFFERENCES IN MALES vs FEMALES:**

**Spermatogenesis (in males):**
 Occurs in testes
 Produces **4 functional sperm** from one cell
 All 4 gametes are equal size
 Continuous from puberty throughout life
 Produces millions of sperm daily

**Oogenesis (in females):**
 Occurs in ovaries
 Produces **1 functional egg** + 3 polar bodies (degenerate)
 Egg much larger (contains nutrients)
 Begins before birth, completes after fertilization
 Produces one egg per month (typically)`
      },
      {
        title: '4. Comparing Mitosis and Meiosis',
        content: `**MITOSIS vs MEIOSIS - Key Differences**

Understanding the differences between these two types of cell division is crucial.

**COMPREHENSIVE COMPARISON TABLE:**

| Feature | **MITOSIS** | **MEIOSIS** |
|---------|------------|------------|
| **Purpose** | Growth, repair, asexual reproduction | Produce sex cells (gametes) |
| **Where** | All body cells (somatic) | Sex organs only (gonads) |
| **Number of divisions** | ONE division | TWO divisions (I and II) |
| **DNA replication** | Once (before mitosis) | Once (before Meiosis I) |
| **Starting cell** | Diploid (2n) | Diploid (2n) |
| **Daughter cells produced** | 2 cells | 4 cells |
| **Chromosome number in daughters** | Diploid (2n) - SAME as parent | Haploid (n) - HALF of parent |
| **Genetic identity** | Identical to parent | Different from parent |
| **Homologous pairing** | No pairing | Yes - synapsis in Prophase I |
| **Crossing over** | No | Yes - in Prophase I |
| **Separation in Anaphase** | Sister chromatids separate | Anaphase I: homologous pairs separate<br>Anaphase II: sister chromatids separate |
| **Genetic variation** | No variation (clones) | High variation |
| **Example in humans** | Skin cell: 46  two cells with 46 each | Sex cell: 46  four cells with 23 each |

**SUMMARY:**

**MITOSIS:**
 **Type:** One division
 **Result:** 2 identical diploid cells
 **Function:** Growth, repair, maintenance
 **Variation:** None (genetic clones)
 **Example:** Wound healing, growth

**MEIOSIS:**
 **Type:** Two divisions
 **Result:** 4 different haploid cells (gametes)
 **Function:** Sexual reproduction
 **Variation:** High (crossing over + independent assortment)
 **Example:** Sperm and egg production

**VISUAL SUMMARY:**

**Mitosis:**
\`\`\`
1 cell (2n = 46)  MITOSIS  2 cells (2n = 46)
All genetically IDENTICAL
\`\`\`

**Meiosis:**
\`\`\`
1 cell (2n = 46)  MEIOSIS I  2 cells (n = 23)  MEIOSIS II  4 cells (n = 23)
All genetically DIFFERENT
\`\`\`

**WHY BOTH ARE NEEDED:**

**Mitosis:**
 Maintains chromosome number during growth
 Replaces dead/damaged cells
 Allows asexual reproduction
 Essential for multicellular life

**Meiosis:**
 Maintains chromosome number across generations
 Creates genetic diversity
 Essential for sexual reproduction
 Allows evolution and adaptation

**EXAMPLE SCENARIO:**

**Human Life Cycle:**
1. **Fertilization:** Sperm (n = 23) + Egg (n = 23)  Zygote (2n = 46)
2. **Development:** Zygote divides by **MITOSIS**  embryo  baby (all cells 2n = 46)
3. **Growth:** Child grows by **MITOSIS**  more cells (all 2n = 46)
4. **Puberty:** Sex organs produce gametes by **MEIOSIS**  sperm/eggs (n = 23)
5. **Reproduction:** Gametes fuse  next generation

**Ghana Examples:**

**Mitosis:**
 **Cassava propagation:** Plant stem cutting  roots and shoots develop through mitosis
 **Wound healing:** Cut on skin heals as skin cells divide by mitosis
 **Child growth:** Baby grows into adult through mitotic cell division

**Meiosis:**
 **Crop breeding:** Plant sex cells (pollen, ovules) produced by meiosis
 **Animal breeding:** Cattle, goats, chickens produce sex cells by meiosis
 **Human reproduction:** Sperm and egg production for next generation`
      },
      {
        title: '5. Cell Division and Cancer',
        content: `**CANCER - Uncontrolled Cell Division**

Cancer occurs when cell division is not properly controlled.

**NORMAL CELL DIVISION CONTROL:**

**Checkpoints:**
 Cells have checkpoints in cell cycle (G1, G2, M checkpoints)
 Check DNA integrity, cell size, proper chromosome attachment
 If problems detected  cell division stops OR cell undergoes apoptosis (programmed death)

**Contact Inhibition:**
 Normal cells stop dividing when they touch neighboring cells
 Prevents overcrowding
 Maintains tissue organization

**Controlled Growth:**
 Cells respond to growth signals
 Divide only when needed
 Stop when sufficient cells produced

**CANCER CELLS - Loss of Control:**

**What Goes Wrong:**
 **Mutations in DNA** damage genes controlling cell division
 **Checkpoint failure** - cells ignore stop signals
 **No contact inhibition** - keep dividing even when crowded
 **Uncontrolled growth** - continuous division

**Characteristics of Cancer Cells:**

**1. Uncontrolled Division:**
 Divide continuously without stop signals
 Ignore contact inhibition
 Don't respond to normal growth controls

**2. Don't Undergo Apoptosis:**
 Normal cells self-destruct if damaged
 Cancer cells evade programmed death
 Continue living and dividing despite damage

**3. Immortal:**
 Normal cells have limited number of divisions (Hayflick limit)
 Cancer cells can divide indefinitely
 Don't age or die naturally

**4. Loss of Specialization:**
 Don't perform normal functions of tissue
 Revert to less specialized state
 Just divide and grow

**5. Form Tumors:**
 Accumulation of cancer cells forms mass (tumor)
 **Benign tumors:** Stay in one place, don't spread, usually not dangerous
 **Malignant tumors:** Invade nearby tissues, spread to other parts (metastasis), dangerous

**6. Metastasis:**
 Cancer cells break away from original tumor
 Travel through blood or lymph system
 Establish new tumors in other organs
 Makes cancer harder to treat

**7. Angiogenesis:**
 Tumors stimulate blood vessel growth
 Ensures tumor gets nutrients and oxygen
 Allows tumor to grow larger

**CAUSES OF CANCER:**

**Genetic Factors:**
 Inherited mutations increase risk
 Family history important
 Some people genetically predisposed

**Environmental Factors (Carcinogens):**

**1. Tobacco Smoke:**
 Leading cause of lung cancer
 Also causes throat, mouth, esophageal cancer
 Contains many carcinogens

**2. Radiation:**
 UV radiation from sun  skin cancer
 X-rays and gamma rays
 Radon gas

**3. Chemicals:**
 Asbestos  lung cancer
 Benzene  leukemia
 Aflatoxins (from moldy peanuts/grains)  liver cancer

**4. Viruses:**
 HPV (Human Papillomavirus)  cervical cancer
 Hepatitis B & C  liver cancer
 EBV (Epstein-Barr Virus)  some lymphomas

**5. Lifestyle Factors:**
 **Diet:** High-fat, low-fiber diet increases colorectal cancer risk
 **Alcohol:** Excessive consumption  liver, throat, breast cancer
 **Lack of exercise:** Increases several cancer risks
 **Obesity:** Linked to multiple cancers

**GHANA-SPECIFIC CONCERNS:**

**Common Cancers:**
 **Cervical cancer:** Leading cancer in Ghanaian women - HPV vaccine important
 **Breast cancer:** Second most common in women - early detection crucial
 **Liver cancer:** Hepatitis B common in Ghana - vaccination important
 **Prostate cancer:** Common in men - screening recommended

**Risk Factors in Ghana:**
 **Hepatitis B:** Endemic - get vaccinated
 **Aflatoxin contamination:** Store grains properly, avoid moldy food
 **Smoking:** Increasing among youth - avoid tobacco
 **Alcohol:** Excessive consumption of akpeteshie and other alcohol

**PREVENTION:**

**Lifestyle Modifications:**
 **Don't smoke** or use tobacco products
 **Limit alcohol** consumption
 **Eat healthy diet:** Lots of fruits, vegetables, whole grains
 **Exercise regularly:** At least 30 minutes daily
 **Maintain healthy weight**
 **Protect from sun:** Use sunscreen, avoid midday sun

**Vaccinations:**
 **HPV vaccine:** Prevents cervical cancer (available for girls 9-14 years)
 **Hepatitis B vaccine:** Prevents liver cancer (part of childhood vaccines in Ghana)

**Early Detection:**
 **Regular screening:** Cervical cancer screening (Pap smear), breast examination
 **Know warning signs:** Unusual lumps, persistent cough, unexplained weight loss, changes in moles
 **Seek medical attention early:** Early detection greatly improves survival

**TREATMENT:**

**Main Approaches:**
 **Surgery:** Remove tumor
 **Radiation therapy:** Kill cancer cells with radiation
 **Chemotherapy:** Drugs that kill rapidly dividing cells
 **Immunotherapy:** Help immune system fight cancer
 **Targeted therapy:** Drugs targeting specific cancer cell features

**Ghana Context:**
 Major cancer treatment centers: Korle Bu (Accra), Komfo Anokye (Kumasi)
 National Health Insurance covers some cancer treatments
 Early detection improves outcomes and reduces cost

**KEY MESSAGES:**

1. **Cancer is uncontrolled cell division** due to loss of normal growth controls
2. **Prevention is better than cure** - healthy lifestyle reduces risk
3. **Get vaccinated** - HPV and Hepatitis B vaccines prevent cancers
4. **Early detection saves lives** - regular screening important
5. **Avoid risk factors** - don't smoke, limit alcohol, eat healthy, exercise
6. **Seek medical help early** if you notice warning signs

Understanding normal cell division (mitosis) helps us understand what goes wrong in cancer and how to prevent and treat it.`
      }
    ],

    pastQuestions: [
      {
        year: '2021',
        question: 'Describe the stages of mitosis.',
        solution: `**Stages of Mitosis**

Mitosis is nuclear division that produces two genetically identical daughter cells. It consists of four main stages: **Prophase, Metaphase, Anaphase, and Telophase** (remember: **PMAT**)

**1. PROPHASE** ("First phase" - Preparation)

**Events:**
 **Chromatin condenses** into visible chromosomes
 Each chromosome consists of **two sister chromatids** joined at the centromere (from DNA replication in S phase)
 **Centrioles** move to opposite poles of the cell (in animal cells)
 **Spindle fibers** begin forming from the centrioles
 **Nuclear envelope** starts to break down and disappear
 **Nucleolus** disappears

**Key Event:** Chromosomes become visible for the first time

**Why Important:** Prepares chromosomes for separation; spindle apparatus forms

**2. METAPHASE** ("Middle phase")

**Events:**
 Chromosomes **line up at the center (equator)** of the cell
 This position is called the **metaphase plate** or equatorial plane
 **Spindle fibers** attach to the **centromere** of each chromosome
 Each sister chromatid is attached to a spindle fiber from opposite poles
 Nuclear envelope is completely gone

**Key Event:** Chromosomes aligned at the center in a straight line

**Why Important:** Ensures each daughter cell gets exactly one copy of each chromosome; spindle attachment checked before proceeding

**3. ANAPHASE** ("Away phase")

**Events:**
 **Sister chromatids separate** at the centromere
 Individual chromatids (now called chromosomes) are pulled **toward opposite poles**
 **Spindle fibers shorten**, pulling chromosomes apart
 Cell elongates (becomes longer)
 Each pole receives an **identical set** of chromosomes

**Key Event:** Chromatids pulled apart to opposite ends of the cell

**Why Important:** Separates genetic material into two identical sets; ensures each daughter cell gets complete genetic information

**4. TELOPHASE** ("End phase")

**Events:**
 Chromosomes reach opposite poles of the cell
 **Chromosomes begin to uncoil** back into chromatin (thin, spread-out form)
 **Spindle fibers** break down and disappear
 **Nuclear envelope** reforms around each set of chromosomes
 **Nucleolus** reappears in each nucleus
 **Two nuclei** are now present in one cell

**Key Event:** Two new nuclei form, one at each end

**Why Important:** Re-establishes nuclear structure; chromosomes return to working form (chromatin)

**CYTOKINESIS** (Division of Cytoplasm)

**Not technically part of mitosis, but follows telophase:**

**In Animal Cells:**
 **Cleavage furrow** forms (cell membrane pinches inward at center)
 Furrow deepens until cell completely splits into two
 Contractile ring of proteins tightens like a drawstring

**In Plant Cells:**
 **Cell plate** forms at center of cell
 Cell plate grows outward toward existing cell walls
 Becomes new cell wall dividing the two daughter cells
 Necessary because plant cells have rigid cell walls that cannot pinch

**OVERALL RESULT:**
 Started with: **1 diploid parent cell** (e.g., 46 chromosomes in humans)
 Ended with: **2 diploid daughter cells** (each with 46 chromosomes)
 Daughter cells are **genetically identical** to each other and to the parent cell

**SUMMARY DIAGRAM:**
\`\`\`
PROPHASE: Chromosomes condense, nuclear envelope breaks down
    
METAPHASE: Chromosomes line up at center
    
ANAPHASE: Sister chromatids separate and move to poles
    
TELOPHASE: Nuclear envelopes reform, chromosomes uncoil
    
CYTOKINESIS: Cell splits into two
\`\`\`

**Memory Aids:**
 **P**rophase = **P**reparation (getting ready)
 **M**etaphase = **M**iddle (chromosomes in middle)
 **A**naphase = **A**part (chromosomes move apart)
 **T**elophase = **T**wo nuclei (two nuclei form)`
      },
      {
        year: '2020',
        question: 'State four differences between mitosis and meiosis.',
        solution: `**Four Differences Between Mitosis and Meiosis**

**DIFFERENCE 1: PURPOSE/FUNCTION**

**Mitosis:**
 Purpose is **growth, repair, and replacement** of cells
 Used for asexual reproduction in some organisms
 Maintains tissues and organs throughout life

**Meiosis:**
 Purpose is **production of sex cells (gametes)** for sexual reproduction
 Produces sperm in males and eggs in females
 Essential for passing genetic information to next generation

**DIFFERENCE 2: NUMBER OF DIVISIONS**

**Mitosis:**
 **ONE division** only
 Cell divides once to produce daughter cells
 Goes through stages once: Prophase  Metaphase  Anaphase  Telophase

**Meiosis:**
 **TWO successive divisions**: Meiosis I and Meiosis II
 First division (Meiosis I) separates homologous pairs
 Second division (Meiosis II) separates sister chromatids
 Goes through stages twice

**DIFFERENCE 3: NUMBER AND TYPE OF DAUGHTER CELLS PRODUCED**

**Mitosis:**
 Produces **2 daughter cells**
 Daughter cells are **diploid (2n)** - same chromosome number as parent
 Example: Human parent cell with 46 chromosomes  2 daughter cells with 46 chromosomes each

**Meiosis:**
 Produces **4 daughter cells** (gametes)
 Daughter cells are **haploid (n)** - half the chromosome number of parent
 Example: Human parent cell with 46 chromosomes  4 daughter cells with 23 chromosomes each

**DIFFERENCE 4: GENETIC IDENTITY OF DAUGHTER CELLS**

**Mitosis:**
 Daughter cells are **genetically identical** to parent cell and each other
 Exact copies (clones) of parent cell
 **No genetic variation** produced
 No crossing over or independent assortment

**Meiosis:**
 Daughter cells are **genetically different** from parent cell and each other
 **High genetic variation** produced through:
  - **Crossing over** in Prophase I (exchange of DNA segments)
  - **Independent assortment** in Metaphase I (random orientation of chromosome pairs)
 Each gamete is unique

**ADDITIONAL DIFFERENCES (Bonus):**

**DIFFERENCE 5: WHERE IT OCCURS**

**Mitosis:**
 Occurs in all **body cells (somatic cells)**
 Throughout the body: skin, bone, muscle, liver, etc.

**Meiosis:**
 Occurs only in **sex organs (gonads)**
 Testes in males, ovaries in females

**DIFFERENCE 6: CHROMOSOME PAIRING**

**Mitosis:**
 **No pairing** of homologous chromosomes
 Chromosomes act independently

**Meiosis:**
 **Homologous chromosomes pair up** (synapsis) in Prophase I
 Forms bivalents/tetrads
 Essential for crossing over

**SUMMARY TABLE:**

| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| **Purpose** | Growth, repair | Produce gametes |
| **Number of divisions** | 1 | 2 |
| **Daughter cells** | 2 | 4 |
| **Chromosome number** | Diploid (2n) | Haploid (n) |
| **Genetic identity** | Identical (clones) | Different (variation) |
| **Where** | All body cells | Sex organs only |

**Practical Examples:**

**Mitosis:**
 Skin healing after a cut
 Child growing taller
 Red blood cell replacement

**Meiosis:**
 Sperm production in testes
 Egg production in ovaries
 Creating genetic diversity in offspring`
      },
      {
        year: '2022',
        question: 'Explain why meiosis is important for sexual reproduction.',
        solution: `**Importance of Meiosis for Sexual Reproduction**

Meiosis is essential for sexual reproduction for several critical reasons:

**1. MAINTAINS CONSTANT CHROMOSOME NUMBER ACROSS GENERATIONS**

**The Problem Without Meiosis:**
 All body cells are diploid (2n) - have two sets of chromosomes
 Humans have 46 chromosomes (2n = 46)
 If sex cells were also diploid:
  - Sperm: 46 chromosomes
  - Egg: 46 chromosomes
  - Baby (fertilization): 46 + 46 = **92 chromosomes**
  - Next generation: 92 + 92 = **184 chromosomes**
  - Chromosome number would **double every generation**!
  - Soon organisms would have too many chromosomes to function

**How Meiosis Solves This:**
 Meiosis **reduces chromosome number by half** (2n  n)
 Produces haploid gametes:
  - Sperm: 23 chromosomes (n)
  - Egg: 23 chromosomes (n)
 Fertilization restores diploid number:
  - Baby (zygote): 23 + 23 = **46 chromosomes (2n)** ✓
 **Maintains constant chromosome number** in species from generation to generation

**Example:**
 Parent generation: 2n = 46
 Meiosis  Gametes: n = 23
 Fertilization  Offspring: 2n = 46 ✓
 Pattern repeats indefinitely

**2. CREATES GENETIC VARIATION**

Meiosis produces gametes that are **genetically different** from each other. This variation is crucial for:

**a) Crossing Over (Prophase I):**
 Homologous chromosomes pair up
 Non-sister chromatids exchange DNA segments
 Creates **new combinations of genes** (recombinant chromosomes)
 Genes from maternal and paternal chromosomes mixed
 Ensures no two gametes are exactly alike

**Example:**
 Chromosome from mother has genes: A-B-C-D
 Chromosome from father has genes: a-b-c-d
 After crossing over: A-B-c-d or a-b-C-D (new combinations)

**b) Independent Assortment (Metaphase I):**
 Homologous pairs line up randomly at equator
 Each pair independently orients (maternal or paternal to each pole)
 With 23 chromosome pairs in humans:
  - 2 = **8.4 million different combinations** possible!
 Each person produces millions of genetically unique gametes

**c) Random Fertilization:**
 Any sperm (millions available) can fertilize egg
 Further multiplies variation
 8.4 million  8.4 million = **70 trillion** possible combinations in humans!

**Why Variation Matters:**
 **Adaptation:** Variation provides raw material for natural selection
 **Survival:** Different traits help some individuals survive environmental changes
 **Disease resistance:** Genetic diversity means some individuals may resist diseases
 **Evolution:** Variation allows species to evolve over time
 **Uniqueness:** Makes each individual unique (except identical twins)

**Ghana Example:**
 Different crop varieties resist different diseases
 Genetic variation in cocoa plants helps some survive diseases like black pod
 Why breeding programs are important - combine best traits

**3. ENSURES OFFSPRING ARE DIFFERENT FROM PARENTS**

**Why This Is Important:**
 **Avoids inbreeding depression:** Too much similarity causes problems
 **Combines beneficial traits:** Offspring may have advantages from both parents
 **Increases population diversity:** Healthier population overall
 **Better adaptation:** Population can adapt to changing environment

**Example:**
 Mother resistant to malaria (sickle cell trait)
 Father has normal blood cells
 Children may inherit best of both: some resistance without disease

**4. PRODUCES SPECIALIZED SEX CELLS**

**Characteristics of Gametes:**
 **Haploid (n):** Half chromosome number - ready to fuse with another gamete
 **Specialized structures:**
  - Sperm: Small, mobile (tail), lots of mitochondria for energy
  - Egg: Large, contains nutrients for early embryo
 **Differentiated:** Different from regular body cells

**Why Specialization Matters:**
 Sperm designed to travel and deliver DNA
 Egg designed to be fertilized and nourish embryo
 Both optimized for their roles in reproduction

**5. ALLOWS SEXUAL REPRODUCTION**

**Advantages of Sexual Reproduction (enabled by meiosis):**
 **Genetic variation:** Offspring different from parents
 **Combines traits:** Best traits from both parents possible
 **Masks harmful traits:** Two copies of each gene; good copy can mask bad one
 **Adaptation:** Population can evolve and adapt
 **Genetic recombination:** New combinations of genes

**Contrast with Asexual Reproduction (using mitosis):**
 Offspring are clones - identical to parent
 No variation (except mutations)
 Less adaptable to environmental changes
 One disease can wipe out entire population

**SUMMARY:**

Meiosis is important for sexual reproduction because it:

1. **Reduces chromosome number** (2n  n) so fertilization can restore it (n + n = 2n)
2. **Creates genetic variation** through crossing over and independent assortment
3. **Produces four different gametes** from each parent cell
4. **Maintains species chromosome number** constant across generations
5. **Enables offspring to be different** from parents and each other
6. **Allows evolution and adaptation** through genetic diversity

**Without meiosis:**
 Chromosome number would double each generation
 No genetic variation in offspring
 Sexual reproduction would be impossible
 Species could not evolve or adapt
 Population would be vulnerable to diseases and environmental changes

**Real-World Impact in Ghana:**
 Crop improvement through breeding
 Livestock breeding for better yields
 Understanding genetics and inheritance
 Appreciation of biological diversity`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'During which phase of mitosis do chromosomes align at the cell\'s equator',
          options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
          answer: 'Metaphase',
          explanation: 'In metaphase, chromosomes line up along the metaphase plate (cell\'s equator), attached to spindle fibers at their centromeres.'
        },
        {
          type: 'mcq',
          question: 'How many daughter cells are produced by meiosis',
          options: ['2 diploid cells', '4 diploid cells', '2 haploid cells', '4 haploid cells'],
          answer: '4 haploid cells',
          explanation: 'Meiosis produces four non-identical haploid daughter cells (gametes) through two consecutive divisions (meiosis I and II).'
        },
        {
          type: 'mcq',
          question: 'What is the main purpose of mitosis in the human body',
          options: ['Producing gametes', 'Growth and repair', 'Creating genetic variation', 'Reducing chromosome number'],
          answer: 'Growth and repair',
          explanation: 'Mitosis produces identical diploid cells for body growth, tissue repair, and cell replacement. Gametes are produced by meiosis.'
        },
        {
          type: 'truefalse',
          statement: 'Crossing over occurs during meiosis and increases genetic variation.',
          answer: 'true',
          reason: 'Crossing over happens during prophase I of meiosis when homologous chromosomes exchange genetic material, creating new gene combinations and genetic diversity.'
        },
        {
          type: 'mcq',
          question: 'If a human skin cell has 46 chromosomes, how many chromosomes will each daughter cell have after mitosis',
          options: ['23', '46', '92', '69'],
          answer: '46',
          explanation: 'Mitosis produces two identical daughter cells with the same chromosome number as the parent cell (46 in humans).'
        },
        {
          type: 'mcq',
          question: 'Cancer results from:',
          options: ['Too little cell division', 'Uncontrolled cell division', 'Normal cell division', 'Cell division stopping'],
          answer: 'Uncontrolled cell division',
          explanation: 'Cancer occurs when cells divide uncontrollably due to mutations in genes that regulate the cell cycle, forming tumors.'
        },
        {
          type: 'truefalse',
          statement: 'Mitosis and meiosis both produce genetically identical cells.',
          answer: 'false',
          reason: 'Mitosis produces identical diploid cells. Meiosis produces non-identical haploid cells with genetic variation due to crossing over and independent assortment.'
        },
        {
          type: 'mcq',
          question: 'In Ghana, taking cassava cuttings to grow new plants is an example of reproduction using:',
          options: ['Meiosis', 'Mitosis', 'Fertilization', 'Mutation'],
          answer: 'Mitosis',
          explanation: 'Vegetative propagation (like cassava cuttings) relies on mitosis to produce identical daughter cells that grow into new plants - asexual reproduction.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'What is the main purpose of mitosis',
        options: [
          'To produce sex cells',
          'To reduce chromosome number',
          'For growth and repair of tissues',
          'To create genetic variation'
        ],
        answer: 'For growth and repair of tissues',
        explanation: 'Mitosis is used for growth (increasing cell numbers), repair of damaged tissues, and replacement of worn-out cells. It produces two genetically identical diploid daughter cells. Meiosis produces sex cells and creates variation.'
      },
      {
        type: 'mcq',
        question: 'During which phase of mitosis do chromosomes line up at the center of the cell',
        options: [
          'Prophase',
          'Metaphase',
          'Anaphase',
          'Telophase'
        ],
        answer: 'Metaphase',
        explanation: 'In Metaphase, chromosomes line up at the equator (center) of the cell on the metaphase plate. Spindle fibers attach to their centromeres. This alignment ensures each daughter cell gets one copy of each chromosome when they separate in anaphase.'
      },
      {
        type: 'mcq',
        question: 'How many daughter cells are produced from one cell undergoing meiosis',
        options: [
          '1 cell',
          '2 cells',
          '4 cells',
          '8 cells'
        ],
        answer: '4 cells',
        explanation: 'Meiosis produces 4 haploid daughter cells (gametes) from one diploid parent cell through two successive divisions (Meiosis I and Meiosis II). Mitosis produces only 2 daughter cells.'
      },
      {
        type: 'mcq',
        question: 'What happens to chromosome number during meiosis',
        options: [
          'Stays the same',
          'Doubles',
          'Is reduced by half',
          'Increases by one'
        ],
        answer: 'Is reduced by half',
        explanation: 'Meiosis reduces chromosome number by half - from diploid (2n) to haploid (n). For example, human cells go from 46 chromosomes to 23. This is essential so that when sperm and egg fuse, the offspring has the correct diploid number (23 + 23 = 46).'
      },
      {
        type: 'mcq',
        question: 'Which process during meiosis creates genetic variation by exchanging DNA segments between chromosomes',
        options: [
          'Crossing over',
          'Cytokinesis',
          'DNA replication',
          'Spindle formation'
        ],
        answer: 'Crossing over',
        explanation: 'Crossing over occurs during Prophase I of meiosis when homologous chromosomes pair up and exchange DNA segments. This creates new combinations of genes (recombinant chromosomes) and is a major source of genetic variation. Independent assortment also creates variation.'
      },
      {
        type: 'mcq',
        question: 'Where in the body does meiosis occur',
        options: [
          'In all body cells',
          'Only in sex organs (gonads)',
          'In the brain',
          'In muscle cells'
        ],
        answer: 'Only in sex organs (gonads)',
        explanation: 'Meiosis occurs only in sex organs (gonads) - testes in males and ovaries in females - to produce gametes (sperm and eggs). Mitosis occurs in all other body cells for growth and repair.'
      },
      {
        type: 'mcq',
        question: 'If a cell has 20 chromosomes and undergoes mitosis, how many chromosomes will each daughter cell have',
        options: [
          '10 chromosomes',
          '20 chromosomes',
          '40 chromosomes',
          '5 chromosomes'
        ],
        answer: '20 chromosomes',
        explanation: 'Mitosis produces daughter cells with the SAME number of chromosomes as the parent cell. If parent has 20, each daughter has 20. The cells are diploid and genetically identical. In meiosis, daughter cells would have half (10 chromosomes).'
      },
      {
        type: 'mcq',
        question: 'What is cancer characterized by',
        options: [
          'Cells dividing too slowly',
          'Uncontrolled cell division',
          'Cells not dividing at all',
          'Normal cell division'
        ],
        answer: 'Uncontrolled cell division',
        explanation: 'Cancer is characterized by uncontrolled cell division. Cancer cells ignore normal stop signals, don\'t respond to contact inhibition, and divide continuously forming tumors. Understanding normal cell division (mitosis) helps us understand what goes wrong in cancer.'
      }
    ],
    summary: 'Cell division is essential for life. Mitosis produces two identical diploid daughter cells for growth, repair, and replacement, going through prophase, metaphase, anaphase, and telophase. Meiosis produces four different haploid gametes through two divisions, reducing chromosome number by half and creating genetic variation through crossing over and independent assortment. Meiosis is essential for sexual reproduction and maintaining constant chromosome numbers across generations. Cancer results from loss of normal cell division controls.'
  },

  // Lesson 6: Types and Formation of Rocks
  {
    id: 'is-dm-rocks-soil-types-formation',
    slug: 'is-dm-rocks-soil-types-formation',
    title: 'Types and Formation of Rocks',
    objectives: [
      'Define rocks and minerals',
      'Identify the three main types of rocks: igneous, sedimentary, and metamorphic',
      'Explain how each type of rock is formed',
      'Describe the rock cycle and how rocks transform',
      'Identify examples of rocks found in Ghana',
      'Understand the economic importance of rocks'
    ],
    introduction: `The ground beneath your feet tells a story millions of years old. Rocks are records of Earth's history, formed through different processes and containing valuable resources that shape Ghana's economy.

**What are Rocks**
 Rocks are naturally occurring solid materials made of one or more minerals
 They form the Earth's crust - the outer layer we live on
 Different processes create different types of rocks

**In Ghana:**
Understanding rocks is crucial for:
 **Mining Industry:** Gold, diamond, bauxite, manganese - Ghana's wealth comes from rocks
 **Construction:** Buildings use granite, sandstone, limestone
 **Agriculture:** Soil forms from weathered rocks
 **Infrastructure:** Roads and buildings need suitable rock foundations
 **Economic Development:** Mining contributes significantly to Ghana's GDP

**Three Main Rock Types:**
1. **Igneous Rocks:** Formed from cooling molten rock (magma/lava)
2. **Sedimentary Rocks:** Formed from compressed sediments
3. **Metamorphic Rocks:** Formed when existing rocks are changed by heat and pressure

This lesson explores how rocks form, their characteristics, and their importance to Ghana's development.`,

    keyConcepts: [
      {
        title: '1. Minerals and Rocks - The Building Blocks',
        content: `**MINERALS**

**Definition:** A mineral is a naturally occurring, inorganic solid with:
� **Definite chemical composition** (specific formula)
� **Crystalline structure** (atoms arranged in orderly pattern)
� **Natural formation** (not man-made)
� **Solid state** at room temperature
� **Inorganic** (not from living things, with few exceptions)

**Examples of Minerals:**
� **Quartz** (SiO2) - most common mineral
� **Feldspar** - most abundant mineral group
� **Mica** - shiny, flaky mineral
� **Calcite** (CaCO3) - forms limestone
� **Halite** (NaCl) - rock salt
� **Gold** (Au) - precious metal
� **Diamond** (C) - pure carbon, hardest natural substance

**Properties of Minerals:**

**1. Color:** 
� Can help identify minerals
� Not always reliable (impurities change color)

**2. Luster:** How mineral reflects light
� Metallic (shiny like metal) - gold, pyrite
� Non-metallic (glassy, pearly, dull) - quartz, mica

**3. Hardness:** Resistance to scratching
� Measured by **Mohs Scale** (1-10)
� 1 = softest (talc), 10 = hardest (diamond)
� Fingernail = 2.5, Copper coin = 3.5, Glass = 5.5, Steel = 6.5

**4. Streak:** Color of mineral powder
� Scratch mineral on unglazed porcelain
� More reliable than surface color

**5. Cleavage/Fracture:**
� **Cleavage:** Breaks along flat planes (mica)
� **Fracture:** Breaks irregularly (quartz)

**6. Crystal Shape:**
� Minerals form characteristic crystal shapes
� Depends on atomic arrangement

**ROCKS**

**Definition:** A rock is a naturally occurring solid mixture of one or more minerals.

**Key Differences: Minerals vs Rocks:**

| Minerals | Rocks |
|----------|-------|
| Pure substances with definite composition | Mixtures of minerals |
| Specific chemical formula | Variable composition |
| Crystalline structure | May or may not have crystals |
| Building blocks | Made of minerals |
| Example: Quartz (SiO2) | Example: Granite (contains quartz, feldspar, mica) |

**Rock Composition:**
� **Monomineralic:** Made of one mineral (limestone = all calcite)
� **Polymineralic:** Made of several minerals (granite = quartz + feldspar + mica)

**Why Study Rocks**
� **Economic value:** Mining, construction
� **Earth's history:** Rocks record geological events
� **Natural resources:** Metals, building materials
� **Soil formation:** Weathered rocks become soil
� **Environmental understanding:** Landscape formation

**Ghana's Mineral Wealth:**
� **Gold:** Found in rocks throughout southern Ghana (Obuasi, Tarkwa)
� **Diamonds:** Birim area (Eastern Region)
� **Bauxite:** Awaso, Kibi (aluminum ore)
� **Manganese:** Nsuta (Western Region)
� **Salt:** Ada, coastal areas
� **Limestone:** For cement production

**The Rock Cycle Preview:**
Rocks are not permanent - they constantly transform:
� Igneous ? (weathering) ? Sedimentary ? (heat/pressure) ? Metamorphic ? (melting) ? Igneous
� This continuous transformation is called the **Rock Cycle**`
      },
      {
        title: '2. Igneous Rocks - Born from Fire',
        content: `**IGNEOUS ROCKS**

**Definition:** Rocks formed from the **cooling and solidification of molten rock** (magma or lava).

**Name Origin:** "Igneous" comes from Latin "ignis" meaning "fire"

**Formation Process:**

**1. Molten Rock:**
� **Magma:** Molten rock beneath Earth's surface (underground)
� **Lava:** Molten rock that reaches Earth's surface (above ground)
� Temperature: 700-1300�C

**2. Cooling:**
� As molten rock cools, minerals crystallize
� Different minerals crystallize at different temperatures

**3. Solidification:**
� Completely solid rock forms
� Crystal size depends on cooling rate

**TWO TYPES OF IGNEOUS ROCKS:**

**A. INTRUSIVE (PLUTONIC) IGNEOUS ROCKS**

**Formation:**
� Form from **magma cooling slowly underground**
� Cooled deep within Earth's crust
� Takes thousands to millions of years to cool

**Characteristics:**
� **Large crystals** (coarse-grained/phaneritic texture)
� Crystals visible to naked eye
� Interlocking crystal structure
� Slow cooling allows large crystals to grow

**Examples:**

**GRANITE:**
� Most common intrusive igneous rock
� Light-colored (pink, gray, white)
� Contains: quartz (gray), feldspar (pink/white), mica (black flakes)
� Very hard and durable
� **Uses:** Construction (buildings, monuments), countertops, tiles
� **In Ghana:** Found in Eastern Region, used for construction

**DIORITE:**
� Medium-colored (gray, dark gray)
� Contains: feldspar, hornblende, biotite
� Coarse-grained

**GABBRO:**
� Dark-colored (dark green to black)
� Contains: pyroxene, olivine, calcium-rich feldspar
� Coarse-grained

**B. EXTRUSIVE (VOLCANIC) IGNEOUS ROCKS**

**Formation:**
� Form from **lava cooling quickly on Earth's surface**
� Exposed to air or water
� Cools in minutes to days

**Characteristics:**
� **Small crystals or no crystals** (fine-grained/aphanitic texture)
� Crystals too small to see without magnification
� Rapid cooling prevents large crystal growth
� May contain gas bubbles (vesicles)
� May have glassy texture

**Examples:**

**BASALT:**
� Most common extrusive igneous rock
� Dark-colored (black, dark gray)
� Fine-grained
� May have gas holes (vesicular)
� **Uses:** Road construction, building stone
� Forms most of ocean floor
� Volcanic islands made of basalt

**RHYOLITE:**
� Light-colored (pink, gray, white)
� Fine-grained
� Extrusive equivalent of granite (same composition)

**OBSIDIAN:**
� Volcanic glass
� Black, shiny, glassy appearance
� **No crystals** - cooled too fast for crystals to form
� Breaks with sharp edges
� Used for tools by ancient peoples

**PUMICE:**
� Very light-colored (white, gray)
� Full of **gas bubbles** (vesicles)
� So light it **floats on water**
� Forms when lava with lots of gas cools quickly
� **Uses:** Abrasive (smoothing rough skin), lightweight concrete

**SCORIA:**
� Dark-colored, vesicular (full of holes)
� Heavier than pumice
� Red, brown, or black

**COMPARISON: INTRUSIVE vs EXTRUSIVE**

| Feature | Intrusive | Extrusive |
|---------|-----------|-----------|
| **Cooling location** | Underground (in crust) | On surface |
| **Cooling rate** | Slow (1000s-millions years) | Fast (minutes-days) |
| **Crystal size** | Large (coarse) | Small (fine) or none |
| **Texture** | Coarse-grained | Fine-grained or glassy |
| **Example** | Granite | Basalt |

**CLASSIFICATION BY COMPOSITION:**

**Based on silica (SiO2) content:**

**1. Felsic (High Silica ~70%):**
� Light-colored (white, pink, light gray)
� Rich in silica, aluminum
� Contains: quartz, feldspar
� Less dense
� Examples: Granite (intrusive), Rhyolite (extrusive)

**2. Intermediate (Medium Silica ~60%):**
� Medium-colored (gray)
� Examples: Diorite (intrusive), Andesite (extrusive)

**3. Mafic (Low Silica ~50%):**
� Dark-colored (dark gray, black)
� Rich in magnesium, iron
� Contains: pyroxene, olivine
� More dense
� Examples: Gabbro (intrusive), Basalt (extrusive)

**4. Ultramafic (Very Low Silica <45%):**
� Very dark colored
� Very rich in iron, magnesium
� Example: Peridotite

**USES OF IGNEOUS ROCKS:**

**Construction:**
� Granite: Buildings, bridges, monuments (very durable)
� Basalt: Road construction, railroad ballast

**Decoration:**
� Granite: Countertops, floor tiles
� Obsidian: Jewelry

**Industry:**
� Pumice: Abrasive (exfoliation, polishing)
� Basalt: Crushed for aggregate

**Ghana Context:**
� Limited recent volcanic activity
� Igneous rocks found mainly as ancient formations
� Granite used in construction
� Understanding igneous rocks helps in mineral exploration (many mineral deposits associated with igneous intrusions)`
      },
      {
        title: '3. Sedimentary Rocks - Layers of History',
        content: `**SEDIMENTARY ROCKS**

**Definition:** Rocks formed from the **compaction and cementation of sediments** (particles of rock, minerals, or organic material).

**Formation Process - 5 Steps:**

**1. WEATHERING:**
� Existing rocks broken down into smaller pieces
� Physical weathering: Breaking without chemical change (freeze-thaw, abrasion)
� Chemical weathering: Chemical decomposition (rusting, dissolving)
� Biological weathering: By organisms (tree roots, burrowing animals)

**2. EROSION:**
� Sediments (weathered particles) transported by:
  - **Water:** Rivers, streams, ocean currents
  - **Wind:** Desert sands
  - **Ice:** Glaciers (less relevant in Ghana)
  - **Gravity:** Landslides, rockfalls

**3. DEPOSITION:**
� Sediments settle out when transport energy decreases
� Deposited in layers (strata) in:
  - Ocean floors, lake beds, river deltas, deserts

**4. COMPACTION:**
� Weight of overlying sediments squeezes out water
� Particles pressed closer together
� Reduces space between particles

**5. CEMENTATION:**
� Minerals dissolved in water act as "glue"
� Cement minerals (calcite, silica, iron oxide) precipitate between particles
� Binds particles into solid rock

**Time Required:** Thousands to millions of years

**CHARACTERISTICS OF SEDIMENTARY ROCKS:**

� **Layered (stratified):** Distinct layers visible
� **Contain fossils:** Preserved remains of ancient life
� **Relatively soft:** Easier to break than igneous/metamorphic
� **Porous:** Has spaces between particles
� **Formed at Earth's surface:** Low temperature and pressure

**THREE TYPES OF SEDIMENTARY ROCKS:**

**A. CLASTIC SEDIMENTARY ROCKS**

**Formation:** From **mechanical weathering** - pieces of rock cemented together

**Classification by Particle Size:**

**1. CONGLOMERATE:**
 **Particle size:** >2mm (gravel, pebbles, cobbles)
 Rounded particles
 Looks like concrete with pebbles
 **Uses:** Decorative stone

**2. BRECCIA:**
 **Particle size:** >2mm (angular fragments)
 Angular (not rounded) particles
 Forms from rockfalls, landslides

**3. SANDSTONE:**
 **Particle size:** 0.06-2mm (sand-sized)
 Can see and feel individual grains
 Colors: tan, brown, red, white (depends on cement)
 **Uses:** Building stone, paving
 **In Ghana:** Found in northern regions

**4. SILTSTONE:**
 **Particle size:** 0.004-0.06mm (silt-sized)
 Feels gritty but grains hard to see
 Intermediate between sandstone and shale

**5. SHALE:**
 **Particle size:** <0.004mm (clay-sized)
 Very fine-grained, smooth
 Splits into thin layers (fissile)
 Most abundant sedimentary rock
 Often contains fossils

**B. CHEMICAL SEDIMENTARY ROCKS**

**Formation:** From **chemical precipitation** - minerals dissolved in water crystallize

**Examples:**

**1. LIMESTONE:**
 Composed mainly of **calcite (CaCO2)**
 Usually light-colored (white, gray, tan)
 **Test:** Fizzes when acid (vinegar) applied
 Can contain fossils (shells, coral)
 **Formation:** Marine environments (coral reefs, shell accumulation)
 **Uses:** Cement production, building stone, agricultural lime
 **In Ghana:** Limestone deposits in several regions, used for cement

**2. ROCK SALT (HALITE):**
 Composed of **halite (NaCl)** - table salt
 Forms when salty water evaporates
 White, pink, or colorless
 Tastes salty
 **In Ghana:** Salt production at Ada (sea water evaporation)

**3. GYPSUM:**
 Composed of calcium sulfate (CaSO2·2H2O)
 Soft, white to gray
 **Uses:** Plaster of Paris, drywall

**4. CHERT:**
 Composed of silica (SiO2)
 Very hard
 Breaks with sharp edges
 White, gray, black

**C. ORGANIC SEDIMENTARY ROCKS**

**Formation:** From **accumulation of plant or animal remains**

**Examples:**

**1. COAL:**
 Formed from **compressed plant remains**
 Black, combustible
 Forms in swampy environments
 **Stages:** Peat  Lignite  Bituminous coal  Anthracite
 **Uses:** Fuel for electricity generation, industry
 **Not found in significant amounts in Ghana**

**2. FOSSILIFEROUS LIMESTONE:**
 Made largely of **shell fragments and coral**
 Biological origin
 Contains visible fossils

**3. COQUINA:**
 Made of **loosely cemented shell fragments**
 Can see individual shells

**SEDIMENTARY STRUCTURES:**

**Layering (Stratification):**
 Horizontal layers (beds or strata)
 Each layer represents period of deposition
 Different layers = different time periods

**Cross-bedding:**
 Tilted layers within main horizontal layers
 Indicates ancient water/wind direction

**Ripple Marks:**
 Wavy patterns on surface
 Formed by water or wind currents

**Mud Cracks:**
 Cracks in dried mud
 Indicates ancient wet-dry cycles

**FOSSILS:**
 Preserved remains or traces of ancient organisms
 Found mainly in sedimentary rocks
 Tell us about ancient life and environments
 **Not common in Ghana's sedimentary rocks** (high heat and weathering destroy fossils)

**IMPORTANCE OF SEDIMENTARY ROCKS:**

**Economic:**
 **Limestone:** Cement production (major industry in Ghana)
 **Sandstone:** Building stone
 **Salt:** Food preservation, chemical industry
 **Coal:** Energy (imported to Ghana)

**Scientific:**
 **Fossils:** Record of life history
 **Layers:** Record of Earth's history
 **Ancient environments:** Tell us about past climates

**Ghana Context:**
 **Sedimentary rocks** cover parts of Northern Ghana (Voltaian Basin)
 **Limestone deposits:** Used for cement industry
 **Sandstone:** Used in construction
 **Ancient sediments:** Tell us about ancient Ghana environments`
      },
      {
        title: '4. Metamorphic Rocks - Changed by Heat and Pressure',
        content: `**METAMORPHIC ROCKS**

**Definition:** Rocks formed by **transformation of existing rocks** (igneous, sedimentary, or other metamorphic) through **heat and/or pressure** without melting.

**Name Origin:** "Metamorphic" means "change in form" (Greek: meta = change, morph = form)

**Key Point:** Rock changes in **solid state** - does NOT melt
• If it melts → becomes magma → forms igneous rock instead
• Metamorphism occurs at high temperature but **below melting point**

**AGENTS OF METAMORPHISM:**

**1. HEAT (Temperature):**
• Source: Deep burial, nearby magma intrusions, friction
• High temperature (200-700°C) causes:
  - Mineral recrystallization (atoms rearrange)
  - New minerals form (more stable at high temp)
  - Increased crystal size

**2. PRESSURE:**
• **Confining pressure:** From weight of overlying rocks (increases with depth)
• **Directed pressure:** From tectonic forces (squeezing, pushing)
• High pressure causes:
  - Minerals align in layers (foliation)
  - Rock becomes denser
  - Recrystallization

**3. CHEMICALLY ACTIVE FLUIDS:**
• Hot water with dissolved minerals
• Can add or remove elements
• Helps atoms move and minerals recrystallize

**TYPES OF METAMORPHISM:**

**A. CONTACT METAMORPHISM**

**Cause:** **Heat** from nearby magma intrusion

**Characteristics:**
• Occurs in narrow zone (contact zone) around intrusion
• Mainly heat, less pressure
• No directional pressure → usually **non-foliated**
• Rock "baked" by heat

**Example Process:**
• Magma intrudes into limestone
• Heat from magma → limestone metamorphoses to **marble**

**B. REGIONAL METAMORPHISM**

**Cause:** **High pressure AND high temperature** over large areas

**Characteristics:**
• Occurs deep in Earth's crust during mountain building
• Affects large regions (hundreds of km²)
• Both heat and directed pressure
• Minerals align → **foliated** rocks

**Example Process:**
• Shale buried deep during mountain formation
• Heat + pressure → shale metamorphoses to **slate** → **schist** → **gneiss**

**METAMORPHIC TEXTURES:**

**1. FOLIATED:**
• **Minerals aligned in parallel layers/bands**
• Result of directed pressure
• Can split along foliation planes
• Examples: slate, schist, gneiss

**2. NON-FOLIATED:**
• **No layering or banding**
• Minerals not aligned
• Result of contact metamorphism or made of one mineral
• Examples: marble, quartzite

**COMMON METAMORPHIC ROCKS:**

**FOLIATED METAMORPHIC ROCKS:**

**1. SLATE:**
• **Parent rock:** Shale (sedimentary)
• **Metamorphic grade:** Low (lowest temperature/pressure)
• **Characteristics:**
  - Fine-grained (can't see crystals)
  - Dull appearance
  - **Splits easily into thin, flat sheets** (slaty cleavage)
  - Gray, black, green, red
• **Uses:** Roofing tiles, flooring, chalkboards, billiard tables
• **In Ghana:** Found in some areas, used for flooring

**2. PHYLLITE:**
• **Parent rock:** Slate
• **Metamorphic grade:** Low to medium
• **Characteristics:**
  - Fine-grained
  - **Shiny surface** (more lustrous than slate)
  - Wrinkled appearance
  - Splits into sheets

**3. SCHIST:**
• **Parent rock:** Phyllite or shale
• **Metamorphic grade:** Medium to high
• **Characteristics:**
  - **Medium to coarse-grained** (can see crystals)
  - Strong foliation (schistosity)
  - **Shiny, sparkly** appearance (mica flakes visible)
  - Named by dominant mineral (mica schist, garnet schist)
• **Uses:** Decorative stone, landscaping

**4. GNEISS** (pronounced "nice")
• **Parent rock:** Granite, schist, or sedimentary rocks
• **Metamorphic grade:** High (highest temperature/pressure)
• **Characteristics:**
  - **Coarse-grained** (large crystals visible)
  - **Banded appearance** (light and dark bands)
  - Light bands: quartz, feldspar
  - Dark bands: biotite, hornblende
  - Does not split easily (weak foliation)
• **Uses:** Building stone, decorative stone
• **In Ghana:** Gneiss common in Precambrian basement rocks

**PROGRESSION OF FOLIATED ROCKS:**
\`\`\`
Increasing Temperature and Pressure →
Shale → SLATE → PHYLLITE → SCHIST → GNEISS
(sedimentary) (low) (low-med) (medium) (high)
\`\`\`

**NON-FOLIATED METAMORPHIC ROCKS:**

**1. MARBLE:**
• **Parent rock:** Limestone or dolostone (sedimentary)
• **Metamorphic process:** Contact or regional metamorphism
• **Characteristics:**
  - Made of recrystallized **calcite** or dolomite
  - **Interlocking crystals** (no layers)
  - Colors: white, pink, gray, green (from impurities)
  - **Fizzes with acid** (like limestone)
  - Can be polished to smooth, shiny surface
• **Uses:** Sculpture, building stone, decorative tiles, countertops
• **Famous:** Italian Carrara marble for sculptures

**2. QUARTZITE:**
• **Parent rock:** Sandstone (sedimentary)
• **Metamorphic process:** Contact or regional metamorphism
• **Characteristics:**
  - Made of recrystallized **quartz**
  - **Very hard** (quartz is hard)
  - No layers
  - Colors: white, pink, red, gray
  - Breaks through grains (not around them like sandstone)
• **Uses:** Building stone, road aggregate

**3. HORNFELS:**
• **Parent rock:** Various rocks (shale, basalt)
• **Metamorphic process:** Contact metamorphism
• **Characteristics:**
  - Fine-grained
  - No foliation
  - Very hard, dense
  - Dull appearance

**COMPARISON: PARENT ROCK → METAMORPHIC ROCK**

| Parent Rock | Metamorphic Rock | Type |
|------------|------------------|------|
| **Shale** | Slate → Phyllite → Schist → Gneiss | Foliated |
| **Granite** | Gneiss | Foliated |
| **Limestone** | Marble | Non-foliated |
| **Sandstone** | Quartzite | Non-foliated |
| **Basalt** | Schist or Gneiss | Foliated |

**INDEX MINERALS:**

Certain minerals only form at specific temperatures/pressures:
• **Chlorite:** Low grade
• **Garnet:** Medium grade
• **Staurolite:** Medium to high grade
• **Sillimanite:** High grade

Geologists use these to determine metamorphic conditions.

**IMPORTANCE OF METAMORPHIC ROCKS:**

**Economic:**
• **Marble:** Sculpture, building, decoration
• **Slate:** Roofing, flooring
• **Gneiss:** Building stone
• **Schist:** Decorative stone

**Scientific:**
• Tell us about:
  - Mountain building events
  - Conditions deep in Earth's crust
  - Geological history

**Mineral Resources:**
• Many metal ores associated with metamorphic rocks
• Gold in Ghana often associated with metamorphosed rocks

**Ghana Context:**
• **Metamorphic rocks** form much of Ghana's Precambrian basement
• **Birimian System:** Ancient metamorphosed volcanic and sedimentary rocks
• **Gold deposits:** Often in quartz veins in metamorphic rocks (Obuasi, Tarkwa)
• **Understanding metamorphic rocks** crucial for mineral exploration`
      },
      {
        title: '5. The Rock Cycle - Rocks in Motion',
        content: `**THE ROCK CYCLE**

**Definition:** The **continuous process** by which rocks are created, destroyed, and reformed through geological processes.

**Key Concept:** Rocks are **NOT permanent** - they constantly transform from one type to another over millions of years.

**THE CYCLE:**

\`\`\`
    IGNEOUS ROCKS
    (from cooling magma/lava)
         ↓
    Weathering & Erosion
         ↓
    SEDIMENTS
         ↓
    Compaction & Cementation
         ↓
    SEDIMENTARY ROCKS
         ↓
    Heat & Pressure
         ↓
    METAMORPHIC ROCKS
         ↓
    Melting
         ↓
    MAGMA/LAVA
         ↓
    Cooling & Solidification
         ↓
    IGNEOUS ROCKS
    (cycle continues...)
\`\`\`

**PROCESSES IN THE ROCK CYCLE:**

**1. MELTING:**
 Any rock  Magma
 Very high temperature (700-1300C)
 Deep in Earth's crust or mantle
 **Result:** Rock becomes molten

**2. COOLING & SOLIDIFICATION:**
 Magma/Lava  Igneous Rock
 Temperature decreases
 **Result:** New igneous rock forms

**3. WEATHERING:**
 Any rock  Sediments
 Physical, chemical, or biological breakdown
 Occurs at Earth's surface
 **Result:** Rock breaks into fragments

**4. EROSION & TRANSPORTATION:**
 Sediments moved by water, wind, ice, gravity
 Transported to new location
 Usually to lower elevation

**5. DEPOSITION:**
 Sediments settle out
 Accumulate in layers
 In oceans, lakes, rivers, deserts

**6. COMPACTION & CEMENTATION:**
 Sediments  Sedimentary Rock
 Pressure and mineral cement
 **Result:** New sedimentary rock forms

**7. METAMORPHISM:**
 Any rock  Metamorphic Rock
 Heat and/or pressure (without melting)
 Deep burial or mountain building
 **Result:** Rock transformed in solid state

**ALTERNATIVE PATHWAYS:**

The rock cycle is **NOT one-way** - rocks can skip steps:

**Examples:**

**Igneous  Metamorphic (direct):**
 Granite buried deep  becomes gneiss
 Skips sedimentary stage

**Sedimentary  Igneous (direct):**
 Limestone melts  becomes magma  cools to igneous rock
 Skips metamorphic stage

**Metamorphic  Metamorphic:**
 Slate  schist  gneiss
 Progressive metamorphism with increasing temperature/pressure

**Sedimentary  Sedimentary:**
 Sandstone weathered  new sand  new sandstone
 Recycled sedimentary material

**Igneous  Igneous:**
 Granite weathered  melts  new granite
 Recycled igneous material

**Metamorphic  Sedimentary:**
 Gneiss weathered  sediments  sandstone

**DRIVING FORCES:**

**Internal (Endogenic) Forces:**
 From Earth's interior
 **Heat:** From radioactive decay, residual heat from formation
 **Plate tectonics:** Movement of crustal plates
 **Volcanism:** Brings magma to surface
 **Mountain building:** Creates pressure for metamorphism

**External (Exogenic) Forces:**
 From Earth's surface
 **Sun's energy:** Drives water cycle, wind
 **Water:** Weathering, erosion, transportation
 **Wind:** Erosion, transportation
 **Living organisms:** Weathering, soil formation
 **Gravity:** Mass movement

**TIME SCALE:**

The rock cycle operates over **millions of years**:
 One cycle: tens to hundreds of millions of years
 Some rocks billions of years old
 Earth continuously recycling material since formation (4.6 billion years ago)

**ROCK CYCLE IN GHANA:**

**Ancient History:**
 **Precambrian rocks** (>2 billion years old) form basement
 Igneous and metamorphic rocks (Birimian System)
 Underwent multiple transformations

**Current Processes:**
 **Weathering:** Tropical climate causes rapid weathering
 **Erosion:** Rivers (Volta, Pra, Ankobra) transport sediments
 **Deposition:** Sediments deposited in Volta Lake, coastal areas
 **Soil formation:** Weathered rock becomes soil

**Economic Significance:**
 **Gold formation:** Associated with ancient rock cycle processes
 **Understanding rock cycle** helps in:
  - Mineral exploration
  - Predicting where valuable minerals located
  - Understanding landscape formation
  - Soil management

**IMPORTANCE OF THE ROCK CYCLE:**

**1. Resource Formation:**
 Creates mineral deposits (gold, diamonds, bauxite)
 Forms fossil fuels (coal, oil, gas)
 Produces building materials

**2. Soil Formation:**
 Weathering of rocks  soil
 Basis for agriculture

**3. Landscape Shaping:**
 Explains formation of:
  - Mountains (metamorphism, uplift)
  - Valleys (erosion)
  - Deltas (deposition)

**4. Earth's Recycling System:**
 Recycles Earth's materials
 Nothing is permanent
 Materials continuously reused

**5. Geological History:**
 Rocks record Earth's history
 Each rock tells story of its formation

**HUMAN IMPACT:**

Humans affect rock cycle:
 **Mining:** Extracts minerals, alters landscape
 **Quarrying:** Removes rock for construction
 **Construction:** Uses rock materials
 **Deforestation:** Increases erosion rates
 **Dam building:** Changes sediment deposition patterns (Akosombo Dam)

**SUMMARY:**

The rock cycle demonstrates:
 **Change is constant:** All rocks eventually transform
 **Interconnection:** All rock types connected
 **Energy drives process:** Internal heat and external energy
 **Time required:** Millions of years for one cycle
 **Material recycling:** Earth's crust constantly recycled

Understanding the rock cycle helps us:
 Find mineral resources
 Predict geological processes
 Manage natural resources sustainably
 Appreciate Earth's dynamic nature

**Memory Aid:** **"Igneous  Sedimentary  Metamorphic  back to Igneous"**
(But remember: rocks can skip steps or take alternative paths!)`
      }
    ],

    pastQuestions: [
      {
        year: '2021',
        question: 'State three differences between igneous and sedimentary rocks.',
        solution: `**Three Differences Between Igneous and Sedimentary Rocks:**

**DIFFERENCE 1: FORMATION PROCESS**

**Igneous Rocks:**
 Formed from **cooling and solidification** of molten rock (magma or lava)
 Form through crystallization as temperature decreases
 Process involves melting and cooling

**Sedimentary Rocks:**
 Formed from **compaction and cementation** of sediments
 Sediments are weathered pieces of rock, minerals, or organic material
 Process involves weathering, erosion, deposition, then lithification

**Example:**
 Igneous: Granite forms when underground magma cools slowly
 Sedimentary: Sandstone forms when sand grains are cemented together

---

**DIFFERENCE 2: TEXTURE AND APPEARANCE**

**Igneous Rocks:**
 Have **interlocking crystals** (crystalline texture)
 Crystal size depends on cooling rate:
  - Large crystals (coarse) if cooled slowly underground (granite)
  - Small crystals (fine) if cooled quickly on surface (basalt)
 **No layers** - uniform throughout
 Usually hard and dense

**Sedimentary Rocks:**
 Have **distinct layers (stratification)**
 Made of particles cemented together
 Can see individual grains in many types (sandstone)
 Often contain **fossils**
 Relatively **softer** than igneous rocks
 May have different colored layers

**Example:**
 Igneous: Granite shows interlocking crystals, no layers
 Sedimentary: Sandstone shows layers and visible sand grains

---

**DIFFERENCE 3: WHERE THEY FORM**

**Igneous Rocks:**
 Form at **high temperatures** (700-1300C)
 **Intrusive igneous:** Deep underground (granite)
 **Extrusive igneous:** At Earth's surface from volcanoes (basalt)
 Associated with volcanic activity and deep burial

**Sedimentary Rocks:**
 Form at **Earth's surface** or near surface
 **Low temperatures and pressures**
 Form in bodies of water (oceans, lakes, rivers) or on land (deserts)
 Accumulate in layers over time

**Example:**
 Igneous: Basalt forms from lava cooling on Earth's surface
 Sedimentary: Limestone forms on ocean floor from shell accumulation

---

**SUMMARY TABLE:**

| Feature | Igneous Rocks | Sedimentary Rocks |
|---------|--------------|-------------------|
| **Formation** | Cooling molten rock | Compacting sediments |
| **Texture** | Crystalline, no layers | Layered, may show grains |
| **Temperature** | High (700-1300C) | Low (surface conditions) |
| **Location** | Underground or surface | Surface or shallow depths |
| **Fossils** | No fossils | Often contain fossils |
| **Hardness** | Usually hard | Relatively softer |

**Additional Differences (Bonus):**

**4. Fossils:**
 Igneous: **Never contain fossils** (high heat destroys organic remains)
 Sedimentary: **Often contain fossils** (preserved in layers)

**5. Age Determination:**
 Igneous: Can be dated using radioactive isotopes
 Sedimentary: Dated using fossils and relative dating

**Ghana Examples:**
 Igneous: Granite used in construction in Ghana
 Sedimentary: Limestone used for cement production in Ghana`
      },
      {
        year: '2020',
        question: 'Explain how sedimentary rocks are formed.',
        solution: `**Formation of Sedimentary Rocks - Step by Step Process**

Sedimentary rocks form through a process called **lithification** (turning sediments into rock). This occurs in **five main stages:**

---

**STAGE 1: WEATHERING**

**Definition:** Breaking down of existing rocks into smaller pieces (sediments)

**Types:**

**Physical Weathering:** Breaking without chemical change
 **Freeze-thaw:** Water freezes in cracks, expands, breaks rock apart
 **Abrasion:** Rocks rub against each other (sand blasting)
 **Root wedging:** Tree roots grow in cracks, split rock
 **Temperature changes:** Repeated heating and cooling

**Chemical Weathering:** Chemical decomposition
 **Oxidation:** Rusting of iron-containing rocks
 **Dissolution:** Rocks dissolve in water (limestone in acidic water)
 **Hydrolysis:** Minerals react with water

**Biological Weathering:**
 Burrowing animals break rocks
 Plant roots crack rocks
 Bacteria and lichens produce acids that dissolve minerals

**Result:** Large rocks broken into sediments (gravel, sand, silt, clay)

---

**STAGE 2: EROSION AND TRANSPORTATION**

**Definition:** Movement of weathered sediments from one place to another

**Agents of Transport:**

**1. Water (Most important):**
 **Rivers and streams:** Carry sediments downstream
 **Ocean waves and currents:** Move coastal sediments
 **Rain:** Washes sediments downhill
 Can transport particles of all sizes

**2. Wind:**
 Carries light particles (sand, dust)
 Important in deserts
 Forms sand dunes

**3. Ice (Glaciers):**
 Less relevant in Ghana (no glaciers)
 Can transport very large boulders

**4. Gravity:**
 **Mass movement:** Landslides, rockfalls
 Moves sediments downslope

**Ghana Example:** 
 Rivers like Volta, Pra, Ankobra transport sediments from highlands to sea
 Harmattan winds transport dust from Sahara

---

**STAGE 3: DEPOSITION (SEDIMENTATION)**

**Definition:** Sediments settle out and accumulate when transport energy decreases

**Where Deposition Occurs:**
 **Ocean floors:** Most sediments end up in oceans
 **Lake beds:** Calm water allows settling
 **River deltas:** Where rivers meet ocean (Volta River delta)
 **Deserts:** Wind-deposited sand
 **Floodplains:** When rivers overflow

**How Deposition Works:**
 Water slows down  loses energy  drops sediments
 Heaviest particles settle first (gravel)
 Lighter particles settle later (sand, then silt, then clay)
 **Sorting:** Particles separated by size

**Result:** Sediments accumulate in **horizontal layers (strata)**

**Ghana Example:**
 Sediments deposited in Volta Lake behind Akosombo Dam
 Coastal sediments along Gulf of Guinea

---

**STAGE 4: COMPACTION**

**Definition:** Squeezing sediments together under weight of overlying material

**Process:**
 More and more sediments accumulate on top
 **Weight of overlying layers** presses down on buried sediments
 Squeezes out **water and air** between particles
 Particles packed **closer together**
 Volume decreases
 Especially important for clay and silt

**Result:** Sediments become more dense and tightly packed

**Time:** Takes thousands to millions of years as layers accumulate

---

**STAGE 5: CEMENTATION**

**Definition:** Binding sediments together with natural mineral "cement"

**Process:**
 **Water flows** through spaces between sediment particles
 Water contains **dissolved minerals**:
  - **Calcite** (calcium carbonate) - most common
  - **Silica** (silicon dioxide)
  - **Iron oxide** (makes reddish color)
 Minerals **precipitate** (come out of solution)
 Act as **"glue"** or cement between particles
 Binds sediments into **solid rock**

**Result:** Loose sediments transformed into hard sedimentary rock

---

**COMPLETE PROCESS SUMMARY:**

1. **Weathering:** Rock breaks  sediments
2. **Erosion:** Sediments transported by water/wind/ice
3. **Deposition:** Sediments settle in layers
4. **Compaction:** Weight squeezes sediments together
5. **Cementation:** Minerals glue particles together
6. **Result:** SEDIMENTARY ROCK forms

**TIME REQUIRED:** Thousands to millions of years

---

**EXAMPLES OF SEDIMENTARY ROCK FORMATION:**

**SANDSTONE:**
 Sand grains (from weathered granite)
 Transported by river
 Deposited on beach or ocean floor
 Buried under more sediments
 Compacted and cemented together
 **Result:** Sandstone

**LIMESTONE:**
 Shells and coral fragments (calcium carbonate)
 Accumulate on ocean floor
 Buried under more sediments
 Compacted and cemented
 **Result:** Limestone

**SHALE:**
 Clay particles (very fine)
 Settle in calm water (deep ocean or lake)
 Compacted (clay compacts easily)
 **Result:** Shale

---

**KEY POINTS:**

 **Long process:** Takes millions of years
 **Surface conditions:** Low temperature and pressure
 **Layer by layer:** Forms in horizontal strata
 **Preserves fossils:** Organisms buried in sediments can fossilize
 **Most rocks on Earth's surface are sedimentary:** Cover 75% of land surface

**Ghana Context:**
 **Voltaian Basin** (Northern Ghana) contains ancient sedimentary rocks
 **Limestone deposits** formed from ancient marine environments
 Understanding formation helps locate limestone for cement industry`
      },
      {
        year: '2022',
        question: 'What is the rock cycle Explain with a diagram.',
        solution: `**THE ROCK CYCLE**

**Definition:**
The rock cycle is the **continuous process** by which rocks are formed, destroyed, and transformed from one type to another through various geological processes over millions of years.

**Key Concept:** 
Rocks are NOT permanent. They constantly change from one type to another. Any rock type can become any other type through the appropriate processes.

---

**THE ROCK CYCLE DIAGRAM:**

\`\`\`
                    MAGMA/LAVA
                    (molten rock)
                         |
                    Cooling &
                  Solidification
                         
                  IGNEOUS ROCKS ──────────────────┐
                  (granite, basalt)                 |
                         |                          |
                    Weathering                   Melting
                    & Erosion                  (very high
                                               temperature)
                    SEDIMENTS                       |
                  (sand, clay,                      |
                    gravel)                         |
                         |                          |
                    Compaction                      |
                    & Cementation                   |
                                                   |
                SEDIMENTARY ROCKS                   |
                (sandstone, limestone)              |
                         |                          |
                    Heat &                          |
                    Pressure                        |
                                                   |
                METAMORPHIC ROCKS ──────────────────┘
                (marble, slate, gneiss)
                         |
                         └───── Weathering & Erosion
                              (back to sediments)

        [Alternative pathways shown with arrows]
\`\`\`

---

**MAIN PROCESSES IN THE ROCK CYCLE:**

**1. COOLING & SOLIDIFICATION (Crystallization)**
 **Process:** Magma/lava cools and hardens
 **Result:** Forms **IGNEOUS ROCKS**
 **Examples:** 
  - Underground (slow cooling)  Granite
  - Surface (fast cooling)  Basalt

**2. WEATHERING & EROSION**
 **Process:** Rocks broken down and transported
 **Result:** Forms **SEDIMENTS** (sand, clay, gravel)
 **Can happen to any rock type**
 **Agents:** Water, wind, ice, temperature changes, organisms

**3. COMPACTION & CEMENTATION (Lithification)**
 **Process:** Sediments compressed and glued together
 **Result:** Forms **SEDIMENTARY ROCKS**
 **Examples:** Sandstone, limestone, shale

**4. METAMORPHISM**
 **Process:** Rocks changed by heat and/or pressure (without melting)
 **Result:** Forms **METAMORPHIC ROCKS**
 **Can happen to any rock type**
 **Examples:** 
  - Limestone  Marble
  - Shale  Slate
  - Granite  Gneiss

**5. MELTING**
 **Process:** Rock melts due to very high temperature
 **Result:** Forms **MAGMA**
 **Can happen to any rock type**
 Temperature: 700-1300C

---

**ALTERNATIVE PATHWAYS:**

The rock cycle is **NOT one-way**. Rocks can transform directly between types, skipping stages:

**Direct Transformations:**

**Igneous  Metamorphic:**
 Granite buried deep  heat & pressure  becomes gneiss
 Skips sedimentary stage

**Sedimentary  Igneous:**
 Limestone melts  becomes magma  cools to igneous rock
 Skips metamorphic stage

**Metamorphic  Sedimentary:**
 Gneiss weathered  sediments  sandstone
 Direct transformation

**Within Same Type:**
 **Igneous  Igneous:** Granite melts  new granite
 **Sedimentary  Sedimentary:** Sandstone weathered  new sandstone
 **Metamorphic  Metamorphic:** Slate  schist  gneiss (progressive)

---

**DRIVING FORCES:**

**Internal (Endogenic) Forces:**
 **Earth's internal heat:** From radioactive decay
 **Plate tectonics:** Movement of crustal plates
 **Volcanism:** Brings magma to surface
 **Mountain building:** Creates pressure for metamorphism

**External (Exogenic) Forces:**
 **Sun's energy:** Drives water cycle, wind
 **Water:** Main agent of weathering and erosion
 **Wind:** Erosion and transport
 **Gravity:** Mass movements
 **Living organisms:** Biological weathering

---

**TIME SCALE:**

 **Very slow process:** One complete cycle takes **millions of years**
 Earth has been recycling rocks for **4.6 billion years** since formation
 Some rocks in Ghana are over **2 billion years old** (Birimian rocks)

---

**IMPORTANCE OF THE ROCK CYCLE:**

**1. Resource Formation:**
 Creates mineral deposits (gold, diamonds)
 Forms fossil fuels (coal, oil, natural gas)
 Produces building materials

**2. Soil Formation:**
 Weathering creates soil
 Basis for agriculture

**3. Landscape Shaping:**
 Explains mountains, valleys, deltas
 Understanding helps predict geological hazards

**4. Earth's Recycling System:**
 Nothing is wasted
 Materials continuously reused
 Maintains Earth's crust composition

---

**GHANA CONTEXT:**

**Ancient Rocks:**
 **Birimian System:** Metamorphosed volcanic and sedimentary rocks (>2 billion years old)
 Show evidence of multiple rock cycle transformations

**Current Processes:**
 **Weathering:** Tropical climate causes rapid weathering
 **Erosion:** Rivers transport sediments
 **Deposition:** Sediments in Volta Lake, coastal areas
 **Economic:** Understanding rock cycle helps locate gold deposits

---

**SUMMARY:**

The rock cycle demonstrates that:
 **Change is constant:** All rocks eventually transform
 **Interconnected:** All three rock types connected
 **No starting point:** Cycle has no beginning or end
 **Energy required:** Internal heat and surface energy drive processes
 **Time:** Process occurs over geological time scales

**Memory Aid:** **"ICE, SEEMS MET"**
 **I**gneous  **C**ooling
 **S**ediments  **E**rosion
 **S**edimentary  **E**ntombed (buried)
 **M**etamorphic  **S**queezed
 **M**agma  **E**rupted
 **T**ransforms continuously`
      }
    ],

    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'Which type of rock forms from cooling magma or lava',
          options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Fossil'],
          answer: 'Igneous',
          explanation: 'Igneous rocks form when molten rock (magma underground or lava on surface) cools and solidifies. Examples include granite and basalt.'
        },
        {
          type: 'mcq',
          question: 'Granite has large visible crystals because it:',
          options: ['Cooled quickly on surface', 'Cooled slowly underground', 'Was compressed', 'Contains many minerals'],
          answer: 'Cooled slowly underground',
          explanation: 'Granite is an intrusive igneous rock that cooled slowly underground, allowing large crystals to form. Fast cooling produces small crystals.'
        },
        {
          type: 'mcq',
          question: 'Which rock type is most likely to contain fossils',
          options: ['Igneous', 'Sedimentary', 'Metamorphic', 'All types equally'],
          answer: 'Sedimentary',
          explanation: 'Sedimentary rocks form at low temperatures and pressures, preserving organisms. High heat in igneous and metamorphic rocks destroys fossils.'
        },
        {
          type: 'truefalse',
          statement: 'Metamorphic rocks form when existing rocks are changed by heat and pressure without melting.',
          answer: 'true',
          reason: 'Metamorphism transforms rocks through heat and pressure while remaining solid. If the rock melts, it becomes magma and forms igneous rock instead.'
        },
        {
          type: 'mcq',
          question: 'Limestone is used to make cement in Ghana. Limestone is a:',
          options: ['Igneous rock', 'Sedimentary rock', 'Metamorphic rock', 'Mineral'],
          answer: 'Sedimentary rock',
          explanation: 'Limestone is a sedimentary rock formed from compressed shells and coral. It\'s a key raw material for Ghana\'s cement industry.'
        },
        {
          type: 'mcq',
          question: 'In the rock cycle, which process turns sedimentary rock into metamorphic rock',
          options: ['Melting', 'Weathering and erosion', 'Heat and pressure', 'Cooling'],
          answer: 'Heat and pressure',
          explanation: 'When sedimentary rocks are subjected to intense heat and pressure deep underground, they metamorphose into metamorphic rocks without melting.'
        },
        {
          type: 'truefalse',
          statement: 'The rock cycle is a one-way process that cannot be reversed.',
          answer: 'false',
          reason: 'The rock cycle is continuous and multi-directional. Any rock type can transform into any other type through different geological processes.'
        },
        {
          type: 'mcq',
          question: 'Ghana is famous for mining which metallic mineral from rocks',
          options: ['Silver', 'Gold', 'Copper', 'Platinum'],
          answer: 'Gold',
          explanation: 'Ghana has been a major gold producer for centuries. Gold is extracted from quartz veins in metamorphosed rocks in areas like Obuasi and Tarkwa.'
        }
      ]
    },

    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'What are igneous rocks formed from',
        options: [
          'Compressed sediments',
          'Cooling molten rock',
          'Changed existing rocks under heat and pressure',
          'Weathered rock fragments'
        ],
        answer: 'Cooling molten rock',
        explanation: 'Igneous rocks form from the cooling and solidification of molten rock (magma underground or lava on the surface). "Igneous" comes from Latin "ignis" meaning fire. Examples include granite and basalt.'
      },
      {
        type: 'mcq',
        question: 'Which rock type typically contains fossils',
        options: [
          'Igneous rocks',
          'Sedimentary rocks',
          'Metamorphic rocks',
          'All rock types equally'
        ],
        answer: 'Sedimentary rocks',
        explanation: 'Sedimentary rocks typically contain fossils because they form from layers of sediment that can preserve organisms. The low temperatures and pressures during formation allow organic remains to be preserved. Igneous and metamorphic rocks form at high temperatures that would destroy fossils.'
      },
      {
        type: 'mcq',
        question: 'Granite has large visible crystals because it:',
        options: [
          "Cooled quickly on Earth's surface",
          'Cooled slowly underground',
          'Was compressed for millions of years',
          'Contains lots of different minerals'
        ],
        answer: 'Cooled slowly underground',
        explanation: 'Granite is an intrusive igneous rock that cooled slowly deep underground. Slow cooling allows large crystals to grow, producing coarse-grained texture. Rocks that cool quickly (like basalt) have small crystals or no visible crystals.'
      },
      {
        type: 'mcq',
        question: 'Which process transforms limestone into marble',
        options: [
          'Weathering and erosion',
          'Cooling and solidification',
          'Heat and pressure (metamorphism)',
          'Compaction and cementation'
        ],
        answer: 'Heat and pressure (metamorphism)',
        explanation: 'Metamorphism transforms limestone into marble through heat and pressure without melting. The calcite crystals in limestone recrystallize to form marble. This is an example of contact or regional metamorphism.'
      },
      {
        type: 'mcq',
        question: 'Sedimentary rocks are characterized by:',
        options: [
          'Interlocking crystals',
          'Distinct layers',
          'Glassy appearance',
          'Banded structure'
        ],
        answer: 'Distinct layers',
        explanation: 'Sedimentary rocks typically show distinct layers (stratification) because they form from sediments deposited in horizontal layers over time. Each layer represents a different period of deposition. Igneous rocks have interlocking crystals, and metamorphic rocks may have banding.'
      },
      {
        type: 'mcq',
        question: 'Which rock is metamorphic',
        options: [
          'Sandstone',
          'Granite',
          'Slate',
          'Basalt'
        ],
        answer: 'Slate',
        explanation: 'Slate is a metamorphic rock formed from shale (sedimentary rock) under low-grade metamorphism. It splits into thin sheets and is used for roofing. Sandstone is sedimentary, while granite and basalt are igneous rocks.'
      },
      {
        type: 'mcq',
        question: 'In the rock cycle, any rock can become which type of rock',
        options: [
          'Only sedimentary rocks',
          'Only igneous rocks',
          'Only metamorphic rocks',
          'Any of the three rock types'
        ],
        answer: 'Any of the three rock types',
        explanation: 'In the rock cycle, any rock type can become any other rock type given the right conditions. For example: igneous rocks can weather to form sedimentary rocks, be metamorphosed to form metamorphic rocks, or melt to form new igneous rocks. The cycle is continuous and interconnected.'
      },
      {
        type: 'mcq',
        question: 'Which mineral is Ghana most famous for mining',
        options: [
          'Silver',
          'Gold',
          'Copper',
          'Platinum'
        ],
        answer: 'Gold',
        explanation: "Ghana is famous for gold mining and has been a major gold producer for centuries. Major gold mining areas include Obuasi, Tarkwa, and other locations in southern Ghana. Gold is often found in quartz veins within metamorphosed rocks and contributes significantly to Ghana's economy."
      }
    ],
    summary: "Rocks are naturally occurring mixtures of minerals that form through different processes. Igneous rocks form from cooling molten rock (granite, basalt), sedimentary rocks form from compacted and cemented sediments (sandstone, limestone), and metamorphic rocks form when existing rocks are changed by heat and pressure (marble, slate). The rock cycle shows how rocks continuously transform from one type to another through weathering, erosion, melting, and metamorphism over millions of years. Understanding rocks is important for mining, construction, and understanding Earth's history."
  },

  // Unit 3: Life Processes - Nutrition
  {
    id: 'is-dm-nutrition-balanced-diet',
    slug: 'is-dm-nutrition-balanced-diet',
    title: 'Nutrition and Balanced Diet',
    objectives: [
      'Define nutrition and explain its importance in living organisms',
      'Identify the six classes of food nutrients and their functions',
      'Explain the concept of a balanced diet',
      'Describe the sources and functions of carbohydrates, proteins, and fats',
      'Explain the role of vitamins, minerals, and water in the body',
      'Identify deficiency diseases and their prevention',
      'Apply knowledge of nutrition to plan healthy meals using local Ghanaian foods'
    ],
    introduction: `Food is essential for life! Every living organism needs nutrients to grow, repair tissues, and obtain energy for daily activities. Nutrition is the process by which organisms obtain and use food substances for growth, repair, and energy.

In Ghana, we are blessed with a variety of nutritious foods - from our staple fufu and banku to delicious groundnut soup, kontomire stew, and fresh tropical fruits. Understanding nutrition helps us make wise food choices for healthy living.

This lesson explores the six classes of food nutrients, what makes a balanced diet, and how to prevent deficiency diseases. You will learn to identify nutrients in your favorite Ghanaian dishes and understand why eating a variety of foods is so important for your health!`,

    keyConcepts: [
      {
        title: '1. Introduction to Nutrition',
        content: `**WHAT IS NUTRITION?**

**Definition:** Nutrition is the process by which living organisms obtain and utilize food substances for:
• **Growth** - Building new cells and tissues
• **Repair** - Replacing damaged or worn-out cells
• **Energy** - Fueling all body activities
• **Maintenance** - Keeping body systems functioning properly

**NUTRIENTS**

**Definition:** Nutrients are chemical substances in food that the body needs to function properly.

**The Six Classes of Nutrients:**

| Class | Examples | Main Function |
|-------|----------|---------------|
| **Carbohydrates** | Rice, cassava, yam | Energy |
| **Proteins** | Fish, beans, eggs | Growth and Repair |
| **Fats/Lipids** | Palm oil, groundnuts | Energy storage, insulation |
| **Vitamins** | Fruits, vegetables | Regulate body processes |
| **Minerals** | Salt, iron, calcium | Build tissues, regulate processes |
| **Water** | Water, fruits, soups | Transport, temperature control |

**Types of Nutrients:**

**1. Macronutrients** (needed in large amounts):
• Carbohydrates
• Proteins
• Fats/Lipids
• Water

**2. Micronutrients** (needed in small amounts):
• Vitamins
• Minerals

**WHY IS NUTRITION IMPORTANT?**

• **For Children:** Proper growth and development
• **For Adults:** Energy for work and body maintenance
• **For Athletes:** Performance and recovery
• **For Everyone:** Disease prevention and overall health

**Ghana Context:**
• Many Ghanaian children suffer from malnutrition
• Understanding nutrition helps families make better food choices
• Local foods can provide all necessary nutrients when properly combined`
      },
      {
        title: '2. Carbohydrates - Energy Nutrients',
        content: `**CARBOHYDRATES**

**Definition:** Carbohydrates are organic compounds made of carbon, hydrogen, and oxygen that provide the body's main source of energy.

**TYPES OF CARBOHYDRATES:**

**1. Simple Carbohydrates (Sugars):**

**A. Monosaccharides** (single sugar units):
• **Glucose** - Blood sugar, main energy source
• **Fructose** - Fruit sugar, sweetest natural sugar
• **Galactose** - Found in milk

**B. Disaccharides** (two sugar units):
• **Sucrose** (glucose + fructose) - Table sugar, sugarcane
• **Maltose** (glucose + glucose) - Found in germinating seeds
• **Lactose** (glucose + galactose) - Milk sugar

**2. Complex Carbohydrates (Polysaccharides):**

• **Starch** - Storage form in plants (cassava, yam, rice)
• **Glycogen** - Storage form in animals (liver, muscles)
• **Cellulose** - Plant cell walls (dietary fiber)

**SOURCES OF CARBOHYDRATES:**

**Ghanaian Staples:**
• **Cassava** - Fufu, gari, kokonte, agbelima
• **Yam** - Ampesi, fried yam, yam fufu
• **Plantain** - Roasted, fried, tatale, fufu
• **Rice** - Jollof rice, waakye, rice balls
• **Maize** - Banku, kenkey, tuo zaafi, porridge
• **Millet/Sorghum** - Tuo zaafi, koko (porridge)

**FUNCTIONS OF CARBOHYDRATES:**

• **Primary energy source** - 1g provides 4 kcal (17 kJ)
• **Spare proteins** - Prevents protein from being used for energy
• **Essential for brain function** - Brain needs glucose constantly
• **Fiber aids digestion** - Prevents constipation

**DEFICIENCY and EXCESS:**

**Deficiency (not enough):**
• Weakness and fatigue
• Weight loss
• Kwashiorkor (protein-energy malnutrition)

**Excess (too much):**
• Weight gain and obesity
• Increased risk of diabetes
• Tooth decay (from sugars)`
      },
      {
        title: '3. Proteins - Building Blocks of Life',
        content: `**PROTEINS**

**Definition:** Proteins are complex organic compounds made of amino acids, essential for growth, repair, and maintenance of body tissues.

**Composition:** Carbon (C), Hydrogen (H), Oxygen (O), Nitrogen (N), and sometimes Sulfur (S)

**AMINO ACIDS - The Building Blocks**

**Types of Amino Acids:**

**1. Essential Amino Acids** (9 types):
• Cannot be made by the body
• Must be obtained from food
• Examples: Lysine, Tryptophan, Leucine, Valine

**2. Non-Essential Amino Acids** (11 types):
• Can be made by the body
• Examples: Alanine, Glycine, Glutamine

**TYPES OF PROTEINS:**

**1. Complete Proteins (First-Class):**
• Contain ALL essential amino acids
• Mainly from animal sources
• Examples: Fish, meat, eggs, milk, cheese

**2. Incomplete Proteins (Second-Class):**
• Missing one or more essential amino acids
• Mainly from plant sources
• Examples: Beans, groundnuts, soya, lentils

**Complementary Proteins:**
• Combining different plant proteins to get all essential amino acids
• Example: Waakye (rice + beans) provides complete protein!

**SOURCES OF PROTEINS:**

**Animal Sources (Complete):**
• **Fish** - Tilapia, mackerel, salmon, herrings
• **Meat** - Beef, chicken, goat, pork
• **Eggs** - Chicken eggs, guinea fowl eggs
• **Milk and Dairy** - Fresh milk, wagashi (local cheese), yogurt

**Plant Sources (Incomplete):**
• **Legumes** - Beans, cowpeas, groundnuts, bambara beans
• **Soya beans** - Tofu, soya milk, dawadawa
• **Seeds** - Egusi, pumpkin seeds, sesame
• **Nuts** - Cashew, coconut

**FUNCTIONS OF PROTEINS:**

• **Growth and repair** - Building new tissues, healing wounds
• **Enzyme production** - All enzymes are proteins
• **Hormone synthesis** - Insulin, growth hormone
• **Antibody formation** - Immune system defense
• **Transport** - Hemoglobin carries oxygen
• **Energy source** - 1g provides 4 kcal (if needed)

**DEFICIENCY DISEASES:**

**1. Kwashiorkor:**
• Occurs in children after weaning
• Symptoms: Swollen belly, thin limbs, reddish hair
• Cause: Diet high in carbs but low in protein

**2. Marasmus:**
• Severe protein-energy malnutrition
• Symptoms: Extreme thinness, wrinkled skin
• Cause: Overall food shortage

**Prevention:** Include protein in every meal - fish, beans, eggs, or meat`
      },
      {
        title: '4. Fats and Oils (Lipids)',
        content: `**FATS AND OILS (LIPIDS)**

**Definition:** Fats and oils are organic compounds made of fatty acids and glycerol that provide concentrated energy and other essential functions.

**Difference:**
• **Fats** - Solid at room temperature (animal sources)
• **Oils** - Liquid at room temperature (plant sources)

**TYPES OF FATS:**

**1. Saturated Fats:**
• No double bonds between carbon atoms
• Solid at room temperature
• Sources: Butter, lard, coconut oil, palm kernel oil
• Health: Excess raises cholesterol levels

**2. Unsaturated Fats:**
• Have double bonds between carbon atoms
• Liquid at room temperature (oils)
• Types:
  - **Monounsaturated** - Olive oil, groundnut oil
  - **Polyunsaturated** - Vegetable oils, fish oils
• Health: Generally healthier for the heart

**SOURCES OF FATS AND OILS:**

**Plant Sources (Ghanaian):**
• **Palm oil** - Red palm oil (kontomire stew, palm nut soup)
• **Groundnut oil** - Cooking oil, groundnut soup
• **Coconut oil** - Cooking, skin care
• **Shea butter** - Cooking in Northern Ghana, skin care

**Animal Sources:**
• Butter, lard (pig fat)
• Fish oil (rich in omega-3)
• Egg yolk, Meat fat

**FUNCTIONS OF FATS:**

• **Concentrated energy** - 1g provides 9 kcal (more than double carbs!)
• **Energy storage** - Stored under skin for future use
• **Insulation** - Keeps body warm (subcutaneous fat)
• **Protection** - Cushions vital organs (kidneys, heart)
• **Fat-soluble vitamins** - Helps absorb vitamins A, D, E, K
• **Essential fatty acids** - Omega-3, Omega-6 for brain function

**DEFICIENCY and EXCESS:**

**Deficiency:**
• Poor absorption of fat-soluble vitamins (A, D, E, K)
• Dry skin and hair
• Poor wound healing

**Excess:**
• **Obesity** - Excess fat storage
• **Heart disease** - Blocked arteries
• **High blood pressure**
• **Type 2 diabetes**

**Ghana Health Note:**
• Palm oil is rich in vitamin A (red color)
• Use oils in moderation
• Avoid reusing cooking oil multiple times`
      },
      {
        title: '5. Vitamins - Essential Regulators',
        content: `**VITAMINS**

**Definition:** Vitamins are organic compounds needed in small amounts for normal growth, development, and body functions.

**Key Points:**
• Cannot be made by the body (mostly)
• Must be obtained from food
• Needed in small amounts (micronutrients)
• Each vitamin has specific functions

<h4 style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1f2937; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">🧈 FAT-SOLUBLE VITAMINS (stored in body fat)</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #fffbeb; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #fef3c7;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Vitamin</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Sources</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Functions</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Deficiency</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #fcd34d;">
<td style="padding: 0.75rem; font-weight: 600;">A (Retinol)</td>
<td style="padding: 0.75rem;">Carrots, palm oil, liver, eggs</td>
<td style="padding: 0.75rem;">Vision, skin health, immunity</td>
<td style="padding: 0.75rem; color: #b45309;">Night blindness, dry skin</td>
</tr>
<tr style="border-bottom: 1px solid #fcd34d; background: #fef9e7;">
<td style="padding: 0.75rem; font-weight: 600;">D (Calciferol)</td>
<td style="padding: 0.75rem;">Sunlight, fish, eggs, milk</td>
<td style="padding: 0.75rem;">Calcium absorption, bone health</td>
<td style="padding: 0.75rem; color: #b45309;">Rickets, weak bones</td>
</tr>
<tr style="border-bottom: 1px solid #fcd34d;">
<td style="padding: 0.75rem; font-weight: 600;">E (Tocopherol)</td>
<td style="padding: 0.75rem;">Vegetable oils, nuts, seeds</td>
<td style="padding: 0.75rem;">Antioxidant, cell protection</td>
<td style="padding: 0.75rem; color: #b45309;">Rare - muscle weakness</td>
</tr>
<tr>
<td style="padding: 0.75rem; font-weight: 600;">K (Phylloquinone)</td>
<td style="padding: 0.75rem;">Green vegetables, liver</td>
<td style="padding: 0.75rem;">Blood clotting</td>
<td style="padding: 0.75rem; color: #b45309;">Excessive bleeding</td>
</tr>
</tbody>
</table>

<h4 style="background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: white; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">💧 WATER-SOLUBLE VITAMINS (not stored, excess excreted)</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #eff6ff; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #dbeafe;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #3b82f6; font-weight: 600;">Vitamin</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #3b82f6; font-weight: 600;">Sources</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #3b82f6; font-weight: 600;">Functions</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #3b82f6; font-weight: 600;">Deficiency</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #93c5fd;">
<td style="padding: 0.75rem; font-weight: 600;">B1 (Thiamine)</td>
<td style="padding: 0.75rem;">Whole grains, beans, pork</td>
<td style="padding: 0.75rem;">Energy release, nerve function</td>
<td style="padding: 0.75rem; color: #1d4ed8;">Beriberi</td>
</tr>
<tr style="border-bottom: 1px solid #93c5fd; background: #e0f2fe;">
<td style="padding: 0.75rem; font-weight: 600;">B2 (Riboflavin)</td>
<td style="padding: 0.75rem;">Milk, eggs, green vegetables</td>
<td style="padding: 0.75rem;">Energy release, healthy skin</td>
<td style="padding: 0.75rem; color: #1d4ed8;">Cracked lips, sore tongue</td>
</tr>
<tr style="border-bottom: 1px solid #93c5fd;">
<td style="padding: 0.75rem; font-weight: 600;">B3 (Niacin)</td>
<td style="padding: 0.75rem;">Meat, fish, groundnuts</td>
<td style="padding: 0.75rem;">Energy release, skin health</td>
<td style="padding: 0.75rem; color: #1d4ed8;">Pellagra</td>
</tr>
<tr>
<td style="padding: 0.75rem; font-weight: 600;">C (Ascorbic Acid)</td>
<td style="padding: 0.75rem;">Citrus fruits, peppers, tomatoes</td>
<td style="padding: 0.75rem;">Collagen formation, immunity</td>
<td style="padding: 0.75rem; color: #1d4ed8;">Scurvy (bleeding gums)</td>
</tr>
</tbody>
</table>

<div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #22c55e; margin: 1.5rem 0;">
<h4 style="color: #166534; margin: 0 0 1rem 0; font-weight: 600;">🇬🇭 GHANAIAN SOURCES OF VITAMINS</h4>
<div style="display: grid; gap: 0.75rem;">
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #ea580c;">Vitamin A:</strong> Red palm oil (excellent source!), Kontomire (cocoyam leaves), Carrots, pawpaw, mangoes
</div>
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #ea580c;">Vitamin C:</strong> Oranges, lemons, limes, Mangoes, pawpaw, pineapple, Tomatoes, peppers
</div>
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #ea580c;">Vitamin D:</strong> Sunlight (Ghana has plenty!), Fish (herrings, mackerel), Eggs, fortified milk
</div>
</div>
</div>

<div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #ef4444; margin: 1.5rem 0;">
<h4 style="color: #991b1b; margin: 0 0 1rem 0; font-weight: 600;">⚠️ IMPORTANT DEFICIENCY DISEASES</h4>
<div style="display: grid; gap: 0.75rem;">
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">1. Night Blindness (Vitamin A):</strong><br/>
Cannot see in dim light • <em>Prevention:</em> Eat palm oil, carrots, kontomire
</div>
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">2. Rickets (Vitamin D):</strong><br/>
Soft, bent bones in children • <em>Prevention:</em> Sunlight exposure, fish, eggs
</div>
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">3. Scurvy (Vitamin C):</strong><br/>
Bleeding gums, slow wound healing • <em>Prevention:</em> Fresh fruits and vegetables
</div>
</div>
</div>`
      },
      {
        title: '6. Minerals and Water',
        content: `**MINERALS**

**Definition:** Minerals are inorganic elements needed for various body functions including building tissues and regulating body processes.

<h4 style="background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); color: white; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">🔷 MAJOR MINERALS</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #f5f3ff; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #ede9fe;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #8b5cf6; font-weight: 600;">Mineral</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #8b5cf6; font-weight: 600;">Sources</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #8b5cf6; font-weight: 600;">Functions</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #8b5cf6; font-weight: 600;">Deficiency</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #c4b5fd;">
<td style="padding: 0.75rem; font-weight: 600;">Calcium (Ca)</td>
<td style="padding: 0.75rem;">Milk, fish bones, kontomire</td>
<td style="padding: 0.75rem;">Bones and teeth, muscle contraction</td>
<td style="padding: 0.75rem; color: #6d28d9;">Weak bones, rickets</td>
</tr>
<tr style="border-bottom: 1px solid #c4b5fd; background: #ede9fe;">
<td style="padding: 0.75rem; font-weight: 600;">Phosphorus (P)</td>
<td style="padding: 0.75rem;">Meat, fish, eggs, beans</td>
<td style="padding: 0.75rem;">Bones and teeth, energy transfer</td>
<td style="padding: 0.75rem; color: #6d28d9;">Weak bones, fatigue</td>
</tr>
<tr style="border-bottom: 1px solid #c4b5fd;">
<td style="padding: 0.75rem; font-weight: 600;">Potassium (K)</td>
<td style="padding: 0.75rem;">Bananas, plantain, beans</td>
<td style="padding: 0.75rem;">Nerve function, muscle contraction</td>
<td style="padding: 0.75rem; color: #6d28d9;">Muscle weakness</td>
</tr>
<tr>
<td style="padding: 0.75rem; font-weight: 600;">Sodium (Na)</td>
<td style="padding: 0.75rem;">Table salt, processed foods</td>
<td style="padding: 0.75rem;">Fluid balance, nerve impulses</td>
<td style="padding: 0.75rem; color: #6d28d9;">Rare - muscle cramps</td>
</tr>
</tbody>
</table>

<h4 style="background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); color: white; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">🔸 TRACE MINERALS</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #fff7ed; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #ffedd5;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; font-weight: 600;">Mineral</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; font-weight: 600;">Sources</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; font-weight: 600;">Functions</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f97316; font-weight: 600;">Deficiency</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #fdba74;">
<td style="padding: 0.75rem; font-weight: 600;">Iron (Fe)</td>
<td style="padding: 0.75rem;">Red meat, beans, kontomire</td>
<td style="padding: 0.75rem;">Hemoglobin formation</td>
<td style="padding: 0.75rem; color: #c2410c;">Anemia (tiredness, pale skin)</td>
</tr>
<tr style="border-bottom: 1px solid #fdba74; background: #fff1e6;">
<td style="padding: 0.75rem; font-weight: 600;">Iodine (I)</td>
<td style="padding: 0.75rem;">Seafood, iodized salt</td>
<td style="padding: 0.75rem;">Thyroid hormone production</td>
<td style="padding: 0.75rem; color: #c2410c;">Goitre (swollen neck)</td>
</tr>
<tr>
<td style="padding: 0.75rem; font-weight: 600;">Zinc (Zn)</td>
<td style="padding: 0.75rem;">Meat, shellfish, beans</td>
<td style="padding: 0.75rem;">Wound healing, immune function</td>
<td style="padding: 0.75rem; color: #c2410c;">Slow healing, weak immunity</td>
</tr>
</tbody>
</table>

<div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #ef4444; margin: 1.5rem 0;">
<h4 style="color: #991b1b; margin: 0 0 1rem 0; font-weight: 600;">⚠️ IMPORTANT DEFICIENCY DISEASES</h4>
<div style="display: grid; gap: 0.75rem;">
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">1. Anemia (Iron deficiency):</strong><br/>
Symptoms: Tiredness, weakness, pale skin, breathlessness<br/>
<em>Prevention:</em> Eat iron-rich foods (meat, beans, kontomire)<br/>
<span style="color: #16a34a;">💡 Tip: Vitamin C helps iron absorption!</span>
</div>
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">2. Goitre (Iodine deficiency):</strong><br/>
Symptoms: Swollen thyroid gland (neck swelling)<br/>
<em>Prevention:</em> Use iodized salt<br/>
<span style="color: #16a34a;">🇬🇭 Ghana's iodized salt program has reduced goitre cases!</span>
</div>
</div>
</div>

**💧 WATER**

<div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 12px; padding: 1.25rem; margin: 1rem 0; border-left: 4px solid #0ea5e9;">
<p style="margin: 0; font-size: 1.1rem;"><strong>Water is essential for life</strong> - you can survive weeks without food but only days without water!</p>
</div>

**Functions of Water:**
• **Transport medium** - Carries nutrients and waste in blood
• **Temperature regulation** - Sweating cools the body
• **Chemical reactions** - Medium for all body reactions
• **Digestion** - Needed for enzyme action
• **Excretion** - Removes waste in urine

<div style="background: #f0fdf4; border-radius: 8px; padding: 1rem; margin: 1rem 0; border-left: 4px solid #22c55e;">
<strong style="color: #166534;">Daily Water Needs:</strong><br/>
• Adults: 2-3 liters per day<br/>
• More needed in hot weather (Ghana!)<br/>
• More needed during exercise
</div>

**Dehydration (Water deficiency):**
• Symptoms: Thirst, dry mouth, dark urine, headache, dizziness
• Prevention: Drink water regularly throughout the day`
      },
      {
        title: '7. Balanced Diet',
        content: `**BALANCED DIET**

**Definition:** A balanced diet is a diet that contains all the six classes of nutrients in the correct proportions to meet the body's needs.

**Key Principles:**
• Contains ALL six nutrient classes
• In CORRECT PROPORTIONS
• Meets individual's specific needs
• Provides adequate ENERGY

**PROPORTIONS:**
• **Carbohydrates:** About one-third of plate (energy)
• **Proteins:** About one-quarter of plate (growth and repair)
• **Fruits and Vegetables:** About one-quarter of plate (vitamins, minerals, fiber)
• **Fats and Oils:** Small amounts (energy, fat-soluble vitamins)
• **Water:** 6-8 glasses daily

**FACTORS AFFECTING FOOD REQUIREMENTS:**

**1. Age:**
• Children: Need more protein for growth
• Adolescents: High energy and protein needs
• Adults: Maintenance needs
• Elderly: Less energy, but still need nutrients

**2. Sex:**
• Males generally need more calories (larger body size)
• Females need more iron (menstruation)
• Pregnant women need extra nutrients

**3. Occupation:**
• Farmers, laborers: More energy (carbs)
• Office workers: Less energy needed
• Athletes: High energy and protein

**4. Health Status:**
• Sick people may need special diets
• Diabetics: Control carbohydrate intake
• Hypertension: Reduce salt

**EXAMPLES OF BALANCED GHANAIAN MEALS:**

**Breakfast Options:**
• Koko (porridge) + koose (bean cakes) + fruit
• Tea/cocoa + bread + egg + banana
• Hausa koko + bread + groundnuts

**Lunch Options:**
• Jollof rice + chicken + salad + orange
• Banku + okro soup (with fish) + kontomire
• Waakye + fish + shito + boiled egg + salad

**Dinner Options:**
• Fufu + light soup (with meat/fish) + vegetables
• Ampesi + kontomire stew + fish
• Rice + groundnut soup + chicken + vegetables

**MEAL PLANNING TIPS:**
• **Variety:** Eat different foods each day
• **Color:** Include colorful fruits and vegetables
• **Local foods:** Use affordable local options
• **Moderation:** Do not overeat any one food
• **Hydration:** Drink water with meals`
      },
      {
        title: '8. Food Tests and Malnutrition',
        content: `**FOOD TESTS**

Simple tests to identify nutrients in food:

**1. TEST FOR STARCH (Carbohydrate):**
• **Reagent:** Iodine solution
• **Procedure:** Add iodine to food sample
• **Positive result:** Brown to Blue-black color
• **Example:** Rice, bread, cassava show positive

**2. TEST FOR REDUCING SUGARS (Glucose, Maltose):**
• **Reagent:** Benedict's solution
• **Procedure:** Add Benedict's to food, heat in water bath
• **Positive result:** Blue to Green to Yellow to Orange to Brick Red
• **The more sugar, the more red the color**

**3. TEST FOR PROTEINS (Biuret Test):**
• **Reagent:** Sodium hydroxide (NaOH) + Copper sulfate
• **Procedure:** Add NaOH, then copper sulfate drop by drop
• **Positive result:** Blue to Purple/Violet color
• **Example:** Egg white, milk show positive

**4. TEST FOR FATS/OILS:**
• **Method - Translucent spot test:**
  - Rub food on paper
  - Hold to light
  - Positive: Permanent translucent spot

**5. TEST FOR VITAMIN C:**
• **Reagent:** DCPIP (blue dye)
• **Positive result:** Blue to Colorless
• **Example:** Orange juice, lemon juice show positive

---

**MALNUTRITION**

**Definition:** Malnutrition is a condition resulting from eating a diet that lacks nutrients or has too much of certain nutrients.

**TYPES OF MALNUTRITION:**

**1. Undernutrition:**
• Not getting enough nutrients
• Leads to deficiency diseases

**2. Overnutrition:**
• Getting too many nutrients (especially energy)
• Leads to obesity and related diseases

**COMMON DEFICIENCY DISEASES IN GHANA:**

**1. Kwashiorkor:**
• **Cause:** Lack of protein (adequate calories)
• **Symptoms:** Swollen belly, thin limbs, reddish hair, skin lesions
• **Prevention:** Include protein at every meal

**2. Marasmus:**
• **Cause:** Lack of both protein AND energy
• **Symptoms:** Extreme thinness, wrinkled skin, old person appearance
• **Prevention:** Adequate feeding of infants

**PREVENTION OF MALNUTRITION:**
• **Breastfeeding:** Exclusive breastfeeding for 6 months
• **Dietary diversity:** Eat variety of foods
• **Education:** Teach families about nutrition
• **Fortification:** Support fortified foods (iodized salt, vitamin A oil)

**GHANA NUTRITION PROGRAMS:**
• School Feeding Programme
• Vitamin A supplementation
• Iodized salt program
• Growth monitoring for children`
      }
    ],
    activities: {
      type: 'exercises',
      questions: [
        {
          type: 'mcq',
          question: 'Which class of food provides the most energy per gram?',
          options: ['Carbohydrates', 'Proteins', 'Fats', 'Vitamins'],
          answer: 'Fats',
          explanation: 'Fats provide 9 kcal per gram, compared to 4 kcal per gram for carbohydrates and proteins. This is why fats are concentrated energy sources.'
        },
        {
          type: 'mcq',
          question: 'Which Ghanaian food is a good source of both carbohydrates and protein?',
          options: ['Fufu alone', 'Waakye', 'Palm oil', 'Orange juice'],
          answer: 'Waakye',
          explanation: 'Waakye contains rice (carbohydrate) and beans (protein), making it a well-balanced Ghanaian dish.'
        },
        {
          type: 'mcq',
          question: 'What happens when iodine solution is added to a food containing starch?',
          options: ['It turns red', 'It turns blue-black', 'It turns purple', 'No change'],
          answer: 'It turns blue-black',
          explanation: 'The iodine test for starch produces a blue-black color due to the formation of a starch-iodine complex.'
        },
        {
          type: 'mcq',
          question: 'Which mineral prevents goitre when included in salt?',
          options: ['Iron', 'Calcium', 'Iodine', 'Sodium'],
          answer: 'Iodine',
          explanation: 'Iodine is essential for thyroid hormone production. Deficiency causes goitre (enlarged thyroid). Ghana uses iodized salt to prevent this.'
        },
        {
          type: 'truefalse',
          statement: 'Kontomire is a good source of iron, which helps prevent anemia.',
          answer: 'true',
          reason: 'Kontomire (cocoyam leaves) is rich in iron, which is essential for hemoglobin production. Iron deficiency leads to anemia.'
        },
        {
          type: 'mcq',
          question: 'Which test is used to identify proteins in food?',
          options: ['Iodine test', 'Benedict\'s test', 'Biuret test', 'DCPIP test'],
          answer: 'Biuret test',
          explanation: 'The Biuret test turns purple in the presence of proteins. It uses sodium hydroxide and copper sulfate solutions.'
        }
      ]
    },
    pastQuestions: [
      {
        year: '2023',
        question: 'List the six classes of food and state one function of each.',
        solution: `**The Six Classes of Food:**

1. **Carbohydrates** - Provide energy for body activities
2. **Proteins** - Growth and repair of body tissues
3. **Fats and Oils** - Provide concentrated energy and insulation
4. **Vitamins** - Regulate body processes and prevent deficiency diseases
5. **Minerals** - Build body tissues and regulate body functions
6. **Water** - Transport nutrients, regulate body temperature`
      },
      {
        year: '2022',
        question: 'Describe Kwashiorkor. Include causes, symptoms, and prevention.',
        solution: `**Kwashiorkor:**

**Definition:** Kwashiorkor is a form of protein-energy malnutrition caused by severe protein deficiency.

**Causes:**
• Diet high in carbohydrates but low in protein
• Weaning from breast milk to starchy foods
• Limited access to protein-rich foods

**Symptoms:**
• Swollen belly (edema)
• Thin arms and legs
• Reddish or orange hair
• Scaly skin with lesions
• Apathy and irritability

**Prevention:**
• Include protein in every meal (eggs, fish, beans)
• Extend breastfeeding while introducing protein-rich foods
• Educate families about balanced nutrition`
      }
    ],
    endOfLessonQuiz: [
      {
        type: 'mcq',
        question: 'Which class of food is the main source of energy for the body?',
        options: [
          'Proteins',
          'Carbohydrates',
          'Vitamins',
          'Minerals'
        ],
        answer: 'Carbohydrates',
        explanation: 'Carbohydrates are the main source of energy for the body, providing 4 kcal per gram. They are found in staple foods like rice, cassava, yam, and banku.'
      },
      {
        type: 'mcq',
        question: 'Kwashiorkor is caused by a deficiency of:',
        options: [
          'Carbohydrates',
          'Proteins',
          'Vitamin A',
          'Iron'
        ],
        answer: 'Proteins',
        explanation: 'Kwashiorkor is caused by severe protein deficiency, typically in children after weaning. Symptoms include swollen belly, thin limbs, and reddish hair.'
      },
      {
        type: 'mcq',
        question: 'Which vitamin deficiency causes night blindness?',
        options: [
          'Vitamin A',
          'Vitamin B',
          'Vitamin C',
          'Vitamin D'
        ],
        answer: 'Vitamin A',
        explanation: 'Vitamin A deficiency causes night blindness. Good sources include palm oil (red), carrots, kontomire, and liver.'
      },
      {
        type: 'mcq',
        question: 'What is the reagent used to test for starch?',
        options: [
          'Benedict solution',
          'Iodine solution',
          'Biuret reagent',
          'Ethanol'
        ],
        answer: 'Iodine solution',
        explanation: 'Iodine solution is used to test for starch. A positive result shows a color change from brown to blue-black.'
      },
      {
        type: 'mcq',
        question: 'Which mineral deficiency causes goitre?',
        options: [
          'Iron',
          'Calcium',
          'Iodine',
          'Zinc'
        ],
        answer: 'Iodine',
        explanation: 'Iodine deficiency causes goitre - swelling of the thyroid gland. Prevention involves using iodized salt.'
      },
      {
        type: 'mcq',
        question: 'A balanced diet must contain:',
        options: [
          'Only carbohydrates and proteins',
          'All six classes of nutrients in correct proportions',
          'Vitamins and minerals only',
          'Large amounts of fats and oils'
        ],
        answer: 'All six classes of nutrients in correct proportions',
        explanation: 'A balanced diet contains all six classes of nutrients (carbohydrates, proteins, fats, vitamins, minerals, and water) in the correct proportions.'
      },
      {
        type: 'mcq',
        question: 'Which of the following is a complete protein source?',
        options: [
          'Beans only',
          'Rice only',
          'Fish',
          'Groundnuts only'
        ],
        answer: 'Fish',
        explanation: 'Fish is a complete (first-class) protein because it contains all essential amino acids. Plant sources are incomplete proteins.'
      },
      {
        type: 'mcq',
        question: 'The vitamin that prevents scurvy is:',
        options: [
          'Vitamin A',
          'Vitamin B1',
          'Vitamin C',
          'Vitamin D'
        ],
        answer: 'Vitamin C',
        explanation: 'Vitamin C prevents scurvy. Deficiency symptoms include bleeding gums and slow wound healing. Good sources include citrus fruits.'
      },
      {
        type: 'mcq',
        question: 'How much energy does 1 gram of fat provide?',
        options: [
          '4 kcal',
          '9 kcal',
          '2 kcal',
          '7 kcal'
        ],
        answer: '9 kcal',
        explanation: 'Fat provides 9 kcal per gram - more than double the energy from carbohydrates or proteins (4 kcal each).'
      },
      {
        type: 'mcq',
        question: 'Iron deficiency causes which condition?',
        options: [
          'Goitre',
          'Anemia',
          'Rickets',
          'Scurvy'
        ],
        answer: 'Anemia',
        explanation: 'Iron deficiency causes anemia. Symptoms include tiredness, weakness, and pale skin. Good sources include red meat, beans, and kontomire.'
      }
    ],
    summary: "Nutrition is the process by which organisms obtain and use food for growth, repair, and energy. The six classes of nutrients are carbohydrates (energy), proteins (growth and repair), fats (concentrated energy and insulation), vitamins (regulate body processes), minerals (build tissues and regulate functions), and water (transport and temperature control). A balanced diet contains all six nutrient classes in correct proportions. Common deficiency diseases include kwashiorkor (protein), anemia (iron), goitre (iodine), night blindness (vitamin A), and scurvy (vitamin C). Ghanaian foods like palm oil, kontomire, fish, beans, and fruits provide essential nutrients when combined properly in a balanced diet."
  }
];
