import { Book } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * English Language Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 21-6353 from original file
 */

export const englishLanguageSubject: Subject = {
    id: '1',
    slug: 'english-language',
    name: 'English Language',
    icon: Book,
    description: 'Master grammar, comprehension, and literature.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'eng101',
            slug: 'listening-speaking-1',
            title: 'Listening & Speaking',
            lessons: [
               {
                id: 'eng101-1',
                slug: 'listening-comprehension',
                title: 'Listening Comprehension',
                objectives: [
                  'Define listening comprehension and explain its importance in daily life and examinations.',
                  'Identify the main idea and supporting details from spoken passages.',
                  'Apply effective listening strategies to improve focus, memory, and understanding.',
                  'Distinguish between literal, inferential, and critical comprehension questions.',
                  'Answer who, what, where, when, why, and how questions accurately.',
                  'Understand vocabulary in context from listening passages.',
                  'Make inferences and draw conclusions from spoken information.',
                  'Practice active listening skills through various exercises and real-world scenarios.',
                  'Answer WAEC BECE-style listening comprehension questions with confidence.',
                ],
                introduction: 'Listening comprehension is the ability to hear, process, understand, and remember spoken information. It is one of the four fundamental language skills alongside reading, writing, and speaking. In Ghana, listening comprehension is essential not only for academic success but also for daily communication, following instructions, understanding news broadcasts, and participating in conversations. In the WAEC BECE English Language examination, students are tested on their ability to listen to passages, stories, or conversations and answer questions accurately. This lesson will equip you with proven strategies to become an active, effective listener. You will learn how to identify main ideas, pick out important details, understand vocabulary in context, make inferences, and answer different types of comprehension questions. These skills are crucial for exam success and will serve you throughout your education and professional life. Whether listening to your teacher in class, following instructions at home, or watching the news, strong listening comprehension skills will help you understand, remember, and respond appropriately to spoken information.',
                keyConcepts: [
                  { 
                    title: '1. What is Listening Comprehension?', 
                    content: 'Listening comprehension is the process of understanding and interpreting spoken language. It involves more than just hearing words-it requires active engagement with the message.\n\nKey Components:\n- Hearing: The physical ability to perceive sound\n- Attention: Focusing on the speaker and blocking distractions\n- Understanding: Processing the meaning of words and sentences\n- Remembering: Retaining important information\n- Responding: Answering questions or taking action based on what you heard\n\nExample: When your teacher reads a story about Kwame going to the market, listening comprehension means you can tell what Kwame bought, who he met, and what happened during his trip.\n\nIn BECE Exams: You will hear a passage once or twice and must answer questions testing your understanding.' 
                  },
                  { 
                    title: '2. Why is Listening Comprehension Important?', 
                    content: 'Listening comprehension is essential for success in school, work, and daily life.\n\nAcademic Benefits:\n- Helps you follow teacher instructions correctly\n- Improves note-taking skills during lessons\n- Essential for BECE English Language exam (10-15% of total marks)\n- Builds vocabulary through exposure to new words\n- Improves speaking and writing by learning sentence structures\n\nReal-Life Benefits:\n- Understanding radio and TV news broadcasts\n- Following directions when traveling (e.g., tro-tro routes)\n- Participating effectively in conversations\n- Understanding announcements at school, church, or public events\n- Building relationships through active listening\n\nCareer Benefits:\n- Essential skill for all professions\n- Required for job interviews and workplace communication\n- Helps in customer service and teamwork\n\nCultural Importance: In Ghana, listening respectfully to elders and authority figures is a sign of good upbringing and education.' 
                  },
                  {
                    title: '3. Types of Listening',
                    content: 'There are different types of listening for different purposes:\n\n1. Intensive Listening (for details):\n   - Listen for specific information (names, numbers, dates)\n   - Example: Listening for bus departure times\n   - Used in: Instructions, announcements, exam passages\n\n2. Extensive Listening (for general understanding):\n   - Listen for main ideas and overall meaning\n   - Example: Listening to a story to understand the plot\n   - Used in: News, speeches, conversations\n\n3. Critical Listening (for evaluation):\n   - Listen to form opinions or make judgments\n   - Example: Deciding if an argument is logical\n   - Used in: Debates, advertisements, persuasive speeches\n\n4. Empathetic Listening (for emotions):\n   - Listen to understand feelings and emotions\n   - Example: Listening to a friend who is upset\n   - Used in: Personal conversations, counseling\n\nFor BECE Exams: You need intensive and extensive listening skills to answer both detail and main idea questions.'
                  },
                  {
                    title: '4. Effective Listening Strategies',
                    content: 'To become a better listener, follow these proven strategies:\n\nBefore Listening:\n1. Prepare Your Mind: Clear distractions and focus\n2. Get Comfortable: Sit properly with good posture\n3. Have Materials Ready: Pen and paper for notes (if allowed)\n\nDuring Listening:\n1. Pay Full Attention: Look at the speaker, avoid daydreaming\n2. Identify the Main Idea: Ask: What is this mostly about?\n3. Listen for Key Words: Names, numbers, places, times, actions\n4. Note the Sequence: What happened first, next, last?\n5. Visualize: Create mental pictures of what you hear\n6. Use the 5 Ws and H: Who? What? Where? When? Why? How?\n7. Listen for Signal Words: First, then, next, finally, because, however\n\nAfter Listening:\n1. Recall: Mentally review what you heard\n2. Summarize: State the main idea in one sentence\n3. Check Understanding: Can you answer the questions?\n\nMemory Tip: Create acronyms or mental images to remember key points. Example: To remember three items (book, pen, bag), visualize them together in a scene.'
                  },
                  {
                    title: '5. Types of Comprehension Questions',
                    content: 'BECE listening passages are followed by different types of questions:\n\n1. Literal Questions (Direct/Factual):\n   - Answers are stated directly in the passage\n   - Question words: Who? What? Where? When?\n   - Example: Who helped Ama? Answer: Kojo (stated in passage)\n\n2. Inferential Questions (Implied):\n   - Answers require reading between the lines\n   - You must make logical conclusions\n   - Example: Why do you think Ama was tired? (Not directly stated, but you infer from context)\n\n3. Vocabulary Questions:\n   - Ask the meaning of a word as used in the passage\n   - Example: What does "exhausted" mean in the story?\n   - Answer: Very tired\n\n4. Main Idea Questions:\n   - Ask about the central theme or topic\n   - Example: What is the passage mainly about?\n   - Answer: A summary of the entire story\n\n5. Sequencing Questions:\n   - Ask about the order of events\n   - Example: What happened after Kwame left the market?\n\n6. True/False or Yes/No Questions:\n   - Check understanding of specific details\n   - Example: Did the teacher arrive before the students? (Yes/No)\n\n7. Opinion/Critical Questions:\n   - Ask for your judgment or evaluation\n   - Example: What lesson can we learn from this story?'
                  },
                  {
                    title: '6. Common Listening Barriers and Solutions',
                    content: 'Barriers to Effective Listening:\n\n1. Physical Distractions:\n   - Problem: Noise, uncomfortable seating, hunger\n   - Solution: Sit in a quiet spot, eat before exams, focus on the speaker\n\n2. Mental Distractions:\n   - Problem: Thinking about other things, worrying\n   - Solution: Clear your mind before listening, practice mindfulness\n\n3. Unfamiliar Vocabulary:\n   - Problem: Not understanding some words\n   - Solution: Use context clues, focus on overall meaning\n\n4. Fast Speaking Speed:\n   - Problem: Speaker talks too quickly\n   - Solution: Focus on key words, not every single word\n\n5. Prejudgment:\n   - Problem: Deciding the topic is boring before listening\n   - Solution: Stay open-minded, look for interesting points\n\n6. Poor Memory:\n   - Problem: Forgetting what was said\n   - Solution: Use memory techniques (visualization, grouping)\n\n7. Language Barriers:\n   - Problem: Unfamiliar accents or expressions\n   - Solution: Practice with different speakers, ask for clarification\n\nBECE Tip: In exams, the passage is usually read twice. Use the first reading for general understanding and the second for specific details.'
                  },
                  {
                    title: '7. Note-Taking for Listening',
                    content: 'Good notes improve comprehension and memory.\n\nNote-Taking Rules:\n1. Listen First: Do not write everything-focus on key points\n2. Use Abbreviations: e.g., = for example, w/ = with, b/c = because\n3. Note Names and Numbers: Write down proper nouns and figures\n4. Use Symbols: → (leads to), + (and), ≠ (not equal)\n5. Write Key Words Only: Not full sentences\n\nWhat to Note:\n- Main idea (one sentence)\n- Names of people and places\n- Numbers (dates, times, amounts)\n- Important actions or events\n- Cause and effect relationships\n- Sequence words (first, then, finally)\n\nExample Passage: "Kofi, a 14-year-old student from Kumasi, won first prize in the 2023 National Science Fair by inventing a water filter."\n\nGood Notes:\n- Kofi, 14, Kumasi\n- Won 1st prize\n- 2023 Science Fair\n- Invented water filter\n\nFrom these notes, you can answer most questions about the passage.\n\nBECE Note: Some exams allow note-taking during the first reading. Check instructions carefully.'
                  },
                ],
                activities: { 
                  type: 'exercises', 
                  questions: [
                      { 
                        type: 'listening_practice', 
                        question: '**Exercise 1: Main Idea Identification**\n\nYour teacher or a partner will read this passage aloud ONCE. Listen carefully and answer the questions WITHOUT looking at the text.\n\nPassage:\n"Abena is a Form 1 student at Cape Coast Secondary School. Every morning, she wakes up at 5:00 a.m. to help her mother prepare breakfast. After eating, she walks 30 minutes to school. Her favorite subject is Mathematics because she wants to become an engineer. Last week, she scored 95% in her math test. Her teacher, Mr. Mensah, praised her hard work."\n\nQuestions:\n1. What is the main idea of the passage?\n2. What time does Abena wake up?\n3. How long does it take her to walk to school?\n4. What is her favorite subject and why?\n5. Who is her teacher?\n\n**Answers:**\n1. Abena is a hardworking student who excels in mathematics.\n2. 5:00 a.m.\n3. 30 minutes\n4. Mathematics, because she wants to become an engineer.\n5. Mr. Mensah' 
                      },
                      { 
                        type: 'inference_practice', 
                        question: '**Exercise 2: Making Inferences**\n\nListen to this passage and answer the inferential questions:\n\n"Yaw rushed into the classroom, his uniform wet and his shoes muddy. He was breathing heavily and his books were damp. The teacher looked at him and said, It is the rainy season, Yaw. You should leave home earlier."\n\nInferential Questions:\n1. What probably happened to Yaw on his way to school?\n2. Why were his books damp?\n3. Was Yaw late or on time? How do you know?\n4. What season is it?\n5. What should Yaw do tomorrow?\n\n**Answers:**\n1. He got caught in the rain while walking to school.\n2. Because he was in the rain and they got wet.\n3. He was probably late because the teacher advised him to leave earlier.\n4. Rainy season (the teacher said so).\n5. Leave home earlier to avoid being late and getting wet.' 
                      },
                      { 
                        type: 'vocabulary_context', 
                        question: '**Exercise 3: Vocabulary in Context**\n\nListen to these sentences and determine the meaning of the underlined words based on context:\n\n1. "The market was crowded with vendors selling yams, plantains, and tomatoes."\n   What does vendors mean? (a) Buyers (b) Sellers (c) Farmers (d) Customers\n\n2. "Akua was exhausted after walking 10 kilometers."\n   What does exhausted mean? (a) Happy (b) Excited (c) Very tired (d) Angry\n\n3. "The headmaster announced that classes would resume next Monday."\n   What does resume mean? (a) Stop (b) Start again (c) Cancel (d) Change\n\n4. "Kwame\'s explanation was so clear that everyone understood immediately."\n   What does explanation mean? (a) Question (b) Story (c) Clarification (d) Confusion\n\n**Answers:** 1. (b) Sellers, 2. (c) Very tired, 3. (b) Start again, 4. (c) Clarification' 
                      },
                      { 
                        type: 'sequencing', 
                        question: '**Exercise 4: Sequencing Events**\n\nListen to this passage and arrange the events in the correct order:\n\nPassage:\n"Last Saturday, Ama prepared jollof rice for her family. First, she washed the rice and vegetables. Then, she boiled water and added tomato paste. Next, she added the rice and covered the pot. After 30 minutes, she added chicken and vegetables. Finally, the delicious meal was ready, and everyone enjoyed it."\n\nArrange in order (1-5):\n___ She boiled water and added tomato paste\n___ She washed rice and vegetables\n___ She added chicken and vegetables\n___ She added rice and covered the pot\n___ The meal was ready\n\n**Answers:**\n2 She boiled water and added tomato paste\n1 She washed rice and vegetables\n4 She added chicken and vegetables\n3 She added rice and covered the pot\n5 The meal was ready' 
                      },
                      { 
                        type: 'true_false_listening', 
                        question: '**Exercise 5: True or False Listening**\n\nListen to the passage and decide if each statement is TRUE or FALSE:\n\nPassage:\n"Ghana gained independence on March 6, 1957. Dr. Kwame Nkrumah became the first president. The capital city is Accra. Ghana is located in West Africa and is known for producing cocoa, gold, and oil."\n\nStatements:\n1. Ghana became independent in 1960. (T/F)\n2. Dr. Kwame Nkrumah was the first president. (T/F)\n3. The capital of Ghana is Kumasi. (T/F)\n4. Ghana produces cocoa, gold, and oil. (T/F)\n5. Ghana is in East Africa. (T/F)\n\n**Answers:** 1. False (1957), 2. True, 3. False (Accra), 4. True, 5. False (West Africa)' 
                      },
                      { 
                        type: 'note_taking_practice', 
                        question: '**Exercise 6: Note-Taking Practice**\n\nListen to this passage and take brief notes. Then use your notes to answer the questions:\n\nPassage:\n"The Kakum National Park is located in the Central Region of Ghana, about 30 kilometers from Cape Coast. It covers an area of 375 square kilometers and is famous for its canopy walkway, which is 350 meters long and 40 meters above the ground. The park is home to over 40 species of mammals, including elephants, monkeys, and antelopes. It attracts thousands of tourists every year."\n\nQuestions:\n1. Where is Kakum National Park located?\n2. How far is it from Cape Coast?\n3. What is the park famous for?\n4. Name two animals found in the park.\n5. What is the length of the canopy walkway?\n\n**Sample Notes:**\n- Kakum Nat. Park\n- Central Region, 30km from C. Coast\n- 375 sq km\n- Canopy walkway: 350m long, 40m high\n- 40+ mammals: elephants, monkeys, antelopes\n- Many tourists\n\n**Answers:**\n1. Central Region of Ghana\n2. About 30 kilometers\n3. Its canopy walkway\n4. Elephants, monkeys, antelopes (any two)\n5. 350 meters' 
                      },
                      { 
                        type: 'critical_listening', 
                        question: '**Exercise 7: Critical Listening and Opinion**\n\nListen to this passage and answer the critical thinking questions:\n\nPassage:\n"Many students prefer to study while listening to music. Some say music helps them concentrate, while others find it distracting. Research shows that soft background music can improve focus for some people, but loud or lyrical music can interfere with reading and memorization. Students should experiment to find what works best for them."\n\nQuestions:\n1. What is the passage mainly about?\n2. What do some students believe about music and studying?\n3. According to research, what type of music might help concentration?\n4. What type of music can be distracting?\n5. What is your opinion? Should students study with music? Why or why not?\n\n**Answers:**\n1. Whether students should listen to music while studying.\n2. Some believe it helps concentration; others find it distracting.\n3. Soft background music.\n4. Loud or lyrical music.\n5. [Personal opinion with reasoning. Example: I think students should study without music because silence helps me focus better on difficult subjects.]' 
                      },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'Passage (BECE-Style): "Ama woke up late on Monday morning. She missed the school bus, so she had to walk to school. On the way, she met her friend Kojo, who helped her carry her bag. When they arrived, the teacher was already in class. Ama promised never to wake up late again."\n\nQuestions:\n1. Why did Ama walk to school?\n2. Who helped Ama carry her bag?\n3. What did Ama promise?\n4. Was the teacher in class when Ama arrived? (Yes/No)\n5. What lesson can we learn from Ama\'s story?', 
                    solution: '1. Because she missed the school bus. → Literal question: answer stated in the passage.\n2. Her friend Kojo. → Literal question: name mentioned directly.\n3. Never to wake up late again. → Literal question: exact words from passage.\n4. Yes. → True/False question: passage says "teacher was already in class."\n5. We should wake up early to avoid being late. → Inferential/Critical question: lesson drawn from the story.' 
                  },
                  {
                    question: 'Vocabulary Question (BECE 2019): "In the passage, what does the word promised mean?"\n(A) Said goodbye\n(B) Made a vow\n(C) Felt sorry\n(D) Went away',
                    solution: 'Correct Answer: (B) Made a vow. → To promise means to make a commitment or vow to do something. In the context, Ama made a commitment never to wake up late again.'
                  },
                  {
                    question: 'Main Idea Question (BECE 2020): Listen to this passage: "Kwasi is a farmer from Techiman. Every day, he wakes up at 4 a.m. to work on his farm. He grows maize, yams, and cassava. Kwasi sells his crops at the market every Friday. With the money he earns, he pays for his children\'s school fees."\n\nWhat is the main idea of this passage?\n(A) Kwasi wakes up very early\n(B) Kwasi is a hardworking farmer who provides for his family\n(C) Kwasi sells crops on Friday\n(D) Kwasi grows three types of crops',
                    solution: 'Correct Answer: (B) Kwasi is a hardworking farmer who provides for his family. → The main idea summarizes the entire passage, not just one detail. Options A, C, and D are supporting details, not the main idea.'
                  },
                  {
                    question: 'Inference Question (BECE 2021): "The classroom was empty and quiet. Books were scattered on the desks, and the chalkboard still had yesterday\'s lesson written on it."\n\nBased on this passage, we can infer that:\n(A) The students just finished class\n(B) The students have not yet arrived\n(C) The teacher is absent\n(D) It is the weekend',
                    solution: 'Correct Answer: (B) The students have not yet arrived. → The room is empty with yesterday\'s lesson still on the board, suggesting the new school day has not started. This requires inference (reading between the lines).'
                  },
                  {
                    question: 'Sequencing Question (BECE 2018): "First, Adwoa bought tomatoes and onions at the market. Next, she went to the butcher to buy meat. Then, she stopped at the pharmacy for medicine. Finally, she returned home."\n\nWhat did Adwoa do second?\n(A) Bought medicine\n(B) Went to the butcher\n(C) Bought tomatoes\n(D) Returned home',
                    solution: 'Correct Answer: (B) Went to the butcher. → Sequence: 1st - bought tomatoes/onions, 2nd - went to butcher, 3rd - stopped at pharmacy, 4th - returned home. "Next" indicates the second action.'
                  },
                  {
                    question: 'Detail Question (BECE 2022): "The Independence Day parade will start at 8:00 a.m. at Independence Square in Accra. Students should wear white shirts and black skirts or trousers. The parade will end at 12 noon."\n\nWhat time will the parade end?\n(A) 8:00 a.m.\n(B) 10:00 a.m.\n(C) 12:00 noon\n(D) Not mentioned',
                    solution: 'Correct Answer: (C) 12:00 noon. → Literal detail question. The answer is directly stated in the last sentence of the passage.'
                  },
                  {
                    question: 'True/False Question: "Lake Volta is the largest man-made lake in the world by surface area. It was created in 1965 when the Akosombo Dam was built."\n\nStatement: Lake Volta was created in 1960. (True/False)',
                    solution: 'Answer: False. → The passage states Lake Volta was created in 1965, not 1960. Always check dates and numbers carefully.'
                  },
                  {
                    question: 'Vocabulary in Context (BECE 2023): "The accident occurred at the busy intersection near the lorry station."\n\nWhat does the word intersection mean?\n(A) A bus stop\n(B) A place where roads cross\n(C) A market\n(D) A bridge',
                    solution: 'Correct Answer: (B) A place where roads cross. → Context clues: "busy" and "near the lorry station" suggest a place where roads meet. An intersection is where two or more roads cross each other.'
                  },
                  {
                    question: 'Cause and Effect: "Esi forgot to study for her English test. As a result, she scored only 40% and had to retake the exam."\n\nWhy did Esi score only 40%?\n(A) The test was too difficult\n(B) She forgot to study\n(C) She was absent\n(D) The teacher gave her a low grade',
                    solution: 'Correct Answer: (B) She forgot to study. → Cause and effect relationship. The cause (forgetting to study) led to the effect (low score). Signal phrase "As a result" shows the connection.'
                  },
                  {
                    question: 'Opinion/Critical Question: "Littering on the streets causes floods during the rainy season because drains get blocked. The government has started a campaign called Keep Ghana Clean to encourage people to dispose of waste properly."\n\nWhat lesson can we learn from this passage?\n(A) The government should clean the streets\n(B) We should all be responsible for keeping our environment clean\n(C) Floods are natural and cannot be prevented\n(D) Rainy season is dangerous',
                    solution: 'Best Answer: (B) We should all be responsible for keeping our environment clean. → Critical thinking question requiring judgment. The passage implies that individual actions (not littering) can prevent larger problems (floods). Option B shows understanding of civic responsibility.'
                  },
                  {
                    question: 'Comparison Question: "Kofi scored 85% in Mathematics and 78% in Science. His best subject is English, where he scored 92%."\n\nWhich subject did Kofi perform best in?\n(A) Mathematics\n(B) Science\n(C) English\n(D) All subjects equally',
                    solution: 'Correct Answer: (C) English. → Comparison question requiring you to identify the highest score: English 92% > Mathematics 85% > Science 78%. Also, the passage explicitly states "His best subject is English."'
                  },
                  {
                    question: 'Pronoun Reference: "Akua and Ama went to the market. She bought mangoes and oranges."\n\nWho bought the fruits?\n(A) Akua\n(B) Ama\n(C) Both of them\n(D) Cannot be determined',
                    solution: 'Correct Answer: (D) Cannot be determined. → The pronoun "She" is ambiguous-it could refer to either Akua or Ama. Good listening passages avoid this confusion, but this question tests your awareness of unclear pronoun references.'
                  },
                  {
                    question: 'Multiple Details: "The Ghana Black Stars football team plays in yellow jerseys. Their home stadium is in Accra. They have qualified for the World Cup four times."\n\nWhich of the following is NOT mentioned in the passage?\n(A) The jersey color\n(B) The location of their stadium\n(C) The name of their coach\n(D) Their World Cup record',
                    solution: 'Correct Answer: (C) The name of their coach. → This type of question tests whether you noticed what was NOT said. Options A, B, and D are all mentioned. The coach\'s name is not mentioned anywhere in the passage.'
                  },
                  {
                    question: 'Prediction Question: "Dark clouds gathered in the sky. The wind began to blow strongly. People rushed to find shelter."\n\nWhat will most likely happen next?\n(A) The sun will come out\n(B) It will rain\n(C) People will go to the beach\n(D) A rainbow will appear',
                    solution: 'Best Answer: (B) It will rain. → Prediction/inference question. The clues (dark clouds, strong wind, people seeking shelter) all suggest an approaching rainstorm. This requires using context to make a logical prediction.'
                  },
                  {
                    question: 'Summary Question (BECE 2017): "Yaw is a 13-year-old boy who lives in Kumasi. He attends Prempeh College and wants to become a doctor. Every evening, he studies for three hours. His parents are very proud of his dedication to education."\n\nWhich sentence best summarizes this passage?\n(A) Yaw lives in Kumasi\n(B) Yaw is a dedicated student with dreams of becoming a doctor\n(C) Yaw studies every evening\n(D) Yaw\'s parents are proud',
                    solution: 'Correct Answer: (B) Yaw is a dedicated student with dreams of becoming a doctor. → A good summary captures the main point without including too many details. Options A, C, and D are specific details, but B summarizes the overall message about Yaw\'s character and ambitions.'
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'What is listening comprehension?',
                    options: [
                      'The ability to speak clearly',
                      'The ability to understand spoken information',
                      'The ability to write correctly',
                      'The ability to read fast'
                    ],
                    answer: 'The ability to understand spoken information',
                    explanation: 'Listening comprehension is the process of hearing, processing, understanding, and remembering spoken language. It is one of the four language skills (listening, speaking, reading, writing).'
                  },
                  {
                    type: 'mcq',
                    question: 'Which of these is the BEST strategy for effective listening?',
                    options: [
                      'Listen while doing homework',
                      'Focus on the speaker and block distractions',
                      'Think about what to say next',
                      'Only listen to the interesting parts'
                    ],
                    answer: 'Focus on the speaker and block distractions',
                    explanation: 'Active listening requires full attention. Multitasking, planning your response, or selective listening reduce comprehension. Focusing completely on the speaker is the most effective strategy.'
                  },
                  {
                    type: 'mcq',
                    question: 'A question that asks "Who helped Kwame?" is an example of:',
                    options: [
                      'An inferential question',
                      'A literal question',
                      'A vocabulary question',
                      'A main idea question'
                    ],
                    answer: 'A literal question',
                    explanation: 'Literal questions ask for information directly stated in the passage. The answer to "Who helped Kwame?" would be explicitly mentioned in the text.'
                  },
                  {
                    type: 'mcq',
                    question: 'What does it mean to "make an inference" while listening?',
                    options: [
                      'To write down everything you hear',
                      'To repeat what the speaker said',
                      'To draw conclusions based on clues in the passage',
                      'To memorize the passage word for word'
                    ],
                    answer: 'To draw conclusions based on clues in the passage',
                    explanation: 'Making inferences means reading between the lines-using context clues and logic to understand information that is implied but not directly stated.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which signal word indicates a sequence or order of events?',
                    options: [
                      'However',
                      'Because',
                      'Finally',
                      'Although'
                    ],
                    answer: 'Finally',
                    explanation: 'Sequence signal words include: first, then, next, after, finally, last. These words help listeners follow the order of events. "However" shows contrast, "because" shows cause, and "although" shows concession.'
                  },
                  {
                    type: 'mcq',
                    question: 'If a passage says "The market was crowded," what type of question would ask "What does crowded mean?"',
                    options: [
                      'Literal question',
                      'Vocabulary question',
                      'Main idea question',
                      'Sequencing question'
                    ],
                    answer: 'Vocabulary question',
                    explanation: 'Vocabulary questions test your understanding of word meanings in context. They usually ask "What does [word] mean as used in the passage?"'
                  },
                  {
                    type: 'mcq',
                    question: 'What should you do FIRST when listening to a passage?',
                    options: [
                      'Write detailed notes',
                      'Focus on identifying the main idea',
                      'Memorize every word',
                      'Answer the questions immediately'
                    ],
                    answer: 'Focus on identifying the main idea',
                    explanation: 'On first listening, identify the main idea (what the passage is mostly about). On second listening (if available), focus on specific details. Understanding the big picture first helps you make sense of details.'
                  },
                  {
                    type: 'mcq',
                    question: 'In BECE exams, listening passages are usually read:',
                    options: [
                      'Once only',
                      'Twice',
                      'Three times',
                      'As many times as you want'
                    ],
                    answer: 'Twice',
                    explanation: 'WAEC BECE listening passages are typically read twice. Use the first reading for general understanding and main ideas, and the second reading to catch specific details and verify your answers.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which of the following is a barrier to effective listening?',
                    options: [
                      'Taking brief notes',
                      'Making eye contact with the speaker',
                      'Daydreaming or thinking about other things',
                      'Asking questions for clarification'
                    ],
                    answer: 'Daydreaming or thinking about other things',
                    explanation: 'Mental distractions like daydreaming prevent you from processing spoken information. Effective listening requires mental focus. The other options (note-taking, eye contact, asking questions) are good listening practices.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the main idea of a passage?',
                    options: [
                      'The first sentence',
                      'The most interesting detail',
                      'The central theme or topic that the passage is mostly about',
                      'The last sentence'
                    ],
                    answer: 'The central theme or topic that the passage is mostly about',
                    explanation: 'The main idea is the central message or theme-what the entire passage is about. It is often a general statement that summarizes the passage, not a specific detail.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Listening comprehension only involves hearing the words that are spoken.',
                    answer: 'false',
                    reason: 'FALSE. Listening comprehension involves more than just hearing-it requires attention, understanding, processing meaning, remembering information, and responding appropriately. Active listening engages your mind, not just your ears.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Taking brief notes with key words can help improve your listening comprehension and memory.',
                    answer: 'true',
                    reason: 'TRUE. Note-taking helps you focus, remember important details, and organize information. Writing down names, numbers, and key points while listening improves both comprehension and recall. However, notes should be brief-do not try to write everything.'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'The five Ws used in listening comprehension are Who, What, When, Where, and _____.',
                    answer: 'Why',
                    alternatives: ['why', 'WHY'],
                    explanation: 'The 5 Ws (and H) are: Who, What, When, Where, Why, and How. These questions help you identify and remember key information from spoken passages.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which of the following are effective listening strategies? (Select all that apply)',
                    options: [
                      'Maintaining eye contact with the speaker',
                      'Checking your phone while listening',
                      'Taking brief notes on key points',
                      'Interrupting the speaker frequently',
                      'Asking yourself questions about what you hear'
                    ],
                    correctAnswers: [
                      'Maintaining eye contact with the speaker',
                      'Taking brief notes on key points',
                      'Asking yourself questions about what you hear'
                    ],
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which types of questions are commonly asked in BECE listening comprehension? (Select all that apply)',
                    options: [
                      'Literal questions (directly stated facts)',
                      'Math calculation questions',
                      'Vocabulary in context questions',
                      'Inferential questions (implied meaning)',
                      'Questions about the examiner'
                    ],
                    correctAnswers: [
                      'Literal questions (directly stated facts)',
                      'Vocabulary in context questions',
                      'Inferential questions (implied meaning)'
                    ],
                  },
                  {
                    type: 'matching',
                    question: 'Match each question type with its example:',
                    pairs: [
                      { left: 'Literal Question', right: 'Who went to the market?' },
                      { left: 'Inferential Question', right: 'Why do you think Ama was upset?' },
                      { left: 'Vocabulary Question', right: 'What does exhausted mean?' },
                    ],
                    explanation: 'Literal questions ask for facts stated directly. Inferential questions require you to read between the lines. Vocabulary questions test word meanings in context.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'You listen to a story about a student who studied hard and passed all exams. What is one lesson you can learn from this story?',
                    answer: 'Hard work and dedication lead to success.',
                    alternatives: [
                      'Studying is important for success',
                      'If you study hard, you will pass your exams',
                      'Hard work pays off',
                      'Dedication and effort bring good results'
                    ],
                    explanation: 'Critical/opinion questions ask you to draw lessons or make judgments. Acceptable answers should show understanding of the moral or message. The lesson is about the value of hard work, dedication, or the connection between effort and success.'
                  },
                ],
                summary: 'Lesson Summary: Listening Comprehension\n\nListening comprehension is the ability to hear, understand, process, and remember spoken information. It is a fundamental language skill essential for academic success, daily communication, and professional life. In the WAEC BECE English Language examination, listening comprehension accounts for a significant portion of marks and tests your ability to understand passages read aloud and answer various types of questions accurately.\n\nKey Points Recap:\n\n1. What is Listening Comprehension?\n   - More than just hearing-involves attention, understanding, and memory\n   - One of four language skills (listening, speaking, reading, writing)\n   - Critical for academic success and real-world communication\n\n2. Types of Listening:\n   - Intensive (for specific details)\n   - Extensive (for general understanding)\n   - Critical (for evaluation)\n   - Empathetic (for emotions)\n\n3. Effective Listening Strategies:\n   - Pay full attention and eliminate distractions\n   - Identify the main idea first\n   - Listen for key words (names, numbers, places, actions)\n   - Use the 5 Ws and H (Who, What, When, Where, Why, How)\n   - Take brief notes on important points\n   - Visualize what you hear\n   - Listen for signal words (first, then, next, finally)\n\n4. Types of Comprehension Questions:\n   - Literal (facts directly stated)\n   - Inferential (implied meaning-read between lines)\n   - Vocabulary (word meanings in context)\n   - Main Idea (central theme)\n   - Sequencing (order of events)\n   - True/False or Yes/No\n   - Opinion/Critical (lessons learned)\n\n5. Common Listening Barriers:\n   - Physical distractions (noise, discomfort)\n   - Mental distractions (daydreaming, worry)\n   - Unfamiliar vocabulary\n   - Fast speaking speed\n   - Poor memory\n   - Solution: Focus, use context clues, practice regularly\n\n6. Note-Taking Tips:\n   - Write key words, not full sentences\n   - Use abbreviations and symbols\n   - Note names, numbers, and important actions\n   - Listen first, write second (do not miss spoken words while writing)\n\n7. BECE Exam Tips:\n   - Passages are usually read twice-use wisely\n   - First reading: Get main idea and general understanding\n   - Second reading: Focus on specific details and verify answers\n   - Stay calm and focused throughout\n\nCommon Mistakes to Avoid:\n- Trying to write everything you hear\n- Not paying attention to signal words\n- Forgetting to identify the main idea\n- Panicking when you miss a detail (stay calm and listen for context)\n- Daydreaming or thinking about other things\n- Not using the 5 Ws and H framework\n- Ignoring context clues for vocabulary\n\nBECE Success Strategies:\n1. Practice regularly with different types of passages (stories, news, speeches)\n2. Listen to Ghana Broadcasting Corporation (GBC) radio news daily\n3. Practice note-taking while listening\n4. Review past BECE listening passages and questions\n5. Work with classmates-take turns reading passages and answering questions\n6. Build vocabulary to understand more words in context\n7. Improve concentration through mindfulness and focus exercises\n\nReal-World Applications:\n- Following teacher instructions in class\n- Understanding announcements at school, church, or public events\n- Participating in conversations effectively\n- Following directions when traveling\n- Understanding news and current affairs\n- Succeeding in job interviews and workplace communication\n- Building strong relationships through active listening\n\nCultural Context:\nIn Ghanaian culture, listening respectfully to elders, teachers, and authority figures is a sign of good upbringing and education. Active listening shows respect, demonstrates maturity, and helps you learn from the wisdom and experiences of others. These cultural values align perfectly with the academic skill of listening comprehension.\n\nFinal Advice:\nListening comprehension is a skill that improves with practice. The more you practice active listening-whether in class, at home, or in daily life-the better you will become at understanding and remembering spoken information. Start today: listen carefully to your teachers, pay attention during conversations, and practice with radio programs and stories. With consistent effort, you will master this essential skill and excel in your BECE exams and beyond.\n\nRemember: Good listeners are good learners. Listen actively, think critically, and answer confidently!',
              },
               {
                id: 'eng101-2',
                slug: 'alphabet-pronunciation',
                title: 'The Alphabet and Pronunciation',
                objectives: [
                  'Recognize and recite all 26 letters of the English alphabet in the correct order.',
                  'Distinguish clearly between vowels and consonants and explain their roles.',
                  'Pronounce each letter correctly using its standard name and sound.',
                  'Identify and differentiate confusing letter pairs (B/D, M/N, P/F, etc.).',
                  'Understand uppercase (capital) and lowercase (small) letter forms.',
                  'Apply phonetic knowledge to spell simple words accurately.',
                  'Recognize that every English word must contain at least one vowel.',
                  'Answer BECE-style questions on alphabet knowledge and pronunciation.'
                ],
                introduction: 'The English alphabet is the foundation of reading, writing, and spelling. It consists of 26 letters, each with its own name, shape, and sound. Mastering the alphabet is the FIRST and most important step in learning English. Without knowing your ABCs, you cannot read words, spell correctly, or communicate in writing. In this lesson, you will learn to recite the alphabet fluently, distinguish between vowels and consonants, pronounce letters clearly (especially confusing pairs like B and D), recognize both capital and small letters, and understand how letters combine to form words. This lesson follows the Ghana Education Service (GES) curriculum for JHS 1 and prepares you for the oral and written components of the WAEC BECE examination.',
                keyConcepts: [
                  { title: 'The Alphabet', content: '26 letters (A-Z).\n5 vowels: A, E, I, O, U.\n21 consonants: All other letters.' },
                  { title: 'Pronunciation', content: 'Each letter has a name (A = /ay/, B = /bee/, etc.).\nSome letters sound alike, so practice carefully (e.g., B and D, P and F).' },
                  { title: 'Spelling Words', content: 'To spell: Say each letter in order. Example: "cat" → C-A-T.'},
                  { title: 'Importance of Vowels', content: 'Every English word must have at least one vowel. Example: dog, egg, cup.'},
                ],
                activities: { 
                  type: 'exercises', 
                  questions: [
                    { type: 'recitation', question: 'EXERCISE 1: Recite the Alphabet\n\nPractice saying A-Z aloud slowly and clearly. Then try it faster! Challenge: Can you say it backwards?' },
                    { type: 'classification', question: 'EXERCISE 2: Identify Vowels and Consonants\n\nWrite out the full alphabet. Circle the 5 vowels in RED. Underline the 21 consonants in BLUE.' },
                    { type: 'pronunciation_drill', question: 'EXERCISE 3: Pronunciation Practice\n\nPractice these confusing pairs:\n1. B - D\n2. M - N\n3. P - B\n4. F - V\n5. S - Z\n\nThen pronounce: Boy-Day, Man-Name, Pen-Ben, Fan-Van, Sun-Zoo' },
                    { type: 'spelling_practice', question: 'EXERCISE 4: Spelling Aloud\n\nSpell these words aloud (say each letter\'s name):\n1. bag 2. pen 3. cup 4. sun 5. book 6. fish 7. tree 8. school 9. Ghana 10. teacher' },
                    { type: 'vowel_identification', question: 'EXERCISE 5: Find the Vowels\n\nIdentify ALL vowels in: apple, education, beautiful, computer, orange, umbrella, elephant, question, university, aeroplane' },
                    { type: 'alphabetical_order', question: 'EXERCISE 6: Alphabetical Order\n\nArrange:\nSet 1: dog, ant, cat, egg, boy\nSet 2: mango, banana, orange, apple, grape\nSet 3: Monday, Friday, Tuesday, Sunday, Wednesday' },
                    { type: 'missing_letters', question: 'EXERCISE 7: Fill Missing Letters\n\n1. A B C D __ F G H\n2. M N O __ Q R S\n3. T U __ W X Y Z\n4. H I J K __ M N\n5. __ __ C D E F __' },
                  ],
                },
                pastQuestions: [
                  { question: 'How many vowels are in the English alphabet?\na) 5\nb) 6\nc) 21', solution: '(a) 5 → The vowels are A, E, I, O, U.' },
                  { question: 'Which of the following words has only one vowel?\na) Book\nb) Sun\nc) Read', solution: '(b) Sun → Only "u" is the vowel.' },
                  { question: 'Spell the word "dog" aloud.', solution: 'D-O-G.'},
                ],
                endOfLessonQuiz: [
                  { id: 'alphabet-q1', type: 'mcq', question: 'How many letters are in the English alphabet?', options: ['24', '25', '26', '27'], answer: '26', explanation: 'The English alphabet has exactly 26 letters from A to Z.' },
                  { id: 'alphabet-q2', type: 'mcq', question: 'Which are vowels?', options: ['A, B, C, D, E', 'A, E, I, O, U', 'B, C, D, F, G', 'V, W, X, Y, Z'], answer: 'A, E, I, O, U', explanation: 'The five vowels are A, E, I, O, U. All others are consonants.' },
                  { id: 'alphabet-q3', type: 'mcq', question: 'How many consonants in the alphabet?', options: ['5', '15', '21', '26'], answer: '21', explanation: '26 total - 5 vowels = 21 consonants.' },
                  { id: 'alphabet-q4', type: 'mcq', question: 'Which word has only ONE vowel?', options: ['book', 'cat', 'tree', 'eat'], answer: 'cat', explanation: 'Cat has only "a". Others have 2 vowels.' },
                  { id: 'alphabet-q5', type: 'mcq', question: 'Why are vowels important?', options: ['They are first', 'Every word needs one', 'Always capitals', 'Longest letters'], answer: 'Every word needs one', explanation: 'Every English word must contain at least one vowel.' },
                  { id: 'alphabet-q6', type: 'mcq', question: 'Which pair sounds most similar?', options: ['A and E', 'B and D', 'F and L', 'K and S'], answer: 'B and D', explanation: 'B (bee) and D (dee) sound very similar.' },
                  { id: 'alphabet-q7', type: 'mcq', question: 'Arrange: dog, ant, cat', options: ['dog, ant, cat', 'ant, cat, dog', 'cat, dog, ant', 'ant, dog, cat'], answer: 'ant, cat, dog', explanation: 'Alphabetical order: A, C, D.' },
                  { id: 'alphabet-q8', type: 'mcq', question: 'Which uses capitals correctly?', options: ['my name is ama.', 'My name is ama.', 'My name is Ama.', 'my Name is Ama.'], answer: 'My name is Ama.', explanation: 'Capitals at start and for names.' },
                  { id: 'alphabet-q9', type: 'mcq', question: 'What comes after M?', options: ['L', 'N', 'O', 'K'], answer: 'N', explanation: 'K-L-M-N-O-P sequence.' },
                  { id: 'alphabet-q10', type: 'mcq', question: 'How many vowels in "education"?', options: ['3', '4', '5', '6'], answer: '5', explanation: 'Contains all 5 vowels: e-u-a-i-o.' },
                  { id: 'alphabet-q11', type: 'truefalse', statement: 'Every English word must have at least one vowel.', answer: 'true', reason: 'TRUE. This is fundamental - words need vowels to be pronounceable.' },
                  { id: 'alphabet-q12', type: 'truefalse', statement: 'Y is officially one of the five vowels.', answer: 'false', reason: 'FALSE. The five official vowels are A, E, I, O, U.' },
                  { id: 'alphabet-q13', type: 'fillblank', sentence: 'The five vowels are A, E, I, O, and _____.', answer: 'U', explanation: 'A, E, I, O, U - remember all five!' },
                  { id: 'alphabet-q14', type: 'multiple_select', question: 'Which are consonants?', options: ['B', 'A', 'D', 'E', 'M', 'O'], correctAnswers: ['B', 'D', 'M'], explanation: 'Consonants: B, D, M. Vowels: A, E, O.' },
                  { id: 'alphabet-q15', type: 'multiple_select', question: 'Which have TWO vowels?', options: ['sun', 'book', 'eat', 'pen', 'tree'], correctAnswers: ['book', 'eat', 'tree'], explanation: 'book (o,o), eat (e,a), tree (e,e) have 2 vowels.' },
                  { id: 'alphabet-q16', type: 'matching', question: 'Match letter types:', pairs: [{ left: 'Vowels', right: 'A, E, I, O, U' }, { left: 'Consonants', right: 'B, C, D, F, G' }, { left: 'Capitals', right: 'For names/starts' }, { left: 'Small letters', right: 'For most words' }], explanation: 'Understanding categories helps with reading and writing.' },
                  { id: 'alphabet-q17', type: 'shortanswer', question: 'Write the alphabet from A to Z.', answer: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', explanation: 'Practice until you can write it from memory!' },
                ],
                summary: 'The English alphabet is the foundation of all reading, writing, and spelling. It has 26 letters: FIVE VOWELS (A, E, I, O, U) and TWENTY-ONE CONSONANTS (all others). Every English word MUST contain at least one vowel. Each letter has a NAME (for spelling aloud) and a SOUND (for reading). Capitals are used for sentence starts, names of people/places, days/months, pronoun "I", and titles. Some letters sound similar (B/D, M/N, P/B, F/V, S/Z) and require careful pronunciation. When spelling aloud, say each letter\'s name (cat = C-A-T). Alphabetical order (A-Z) is used in dictionaries, registers, and indexes. With 15 BECE past questions and 17 quiz questions covering all alphabet skills, you are now prepared for the WAEC BECE examination. Practice daily: recite the alphabet, identify vowels/consonants, spell words aloud, and use proper capitalization. Master the alphabet - your first step to English fluency!',
              },
              {
                id: 'eng101-3',
                slug: 'greetings-introductions',
                title: 'Greetings and Introductions',
                objectives: [
                  'Identify and use appropriate greetings for different times of the day (morning, afternoon, evening, night).',
                  'Distinguish between formal and informal greetings and know when to use each.',
                  'Introduce oneself clearly and politely in various social contexts.',
                  'Ask and respond to questions about names, ages, and personal information.',
                  'Use correct grammar in introductions (subject pronouns, verb "to be").',
                  'Apply appropriate body language and etiquette during greetings and introductions.',
                  'Practice polite conversational skills through role-play and real-life scenarios.',
                  'Answer BECE-style questions on greetings, introductions, and basic conversation.',
                ],
                introduction: 'Greetings and introductions are the foundation of effective communication in English. They establish rapport, show respect, and create positive first impressions. In Ghana and across the world, how you greet someone reflects your upbringing, education, and cultural awareness. This lesson will teach you the formal and informal ways to greet people at different times of the day, how to introduce yourself confidently, how to ask and answer questions about names and ages, and the correct grammar and etiquette for polite conversation. These skills are essential for the WAEC BECE examinations and for real-life social interactions in school, at home, and in the community.',
                keyConcepts: [
                  { title: '1. Types of Greetings', content: 'Greetings can be formal or informal depending on the context and the person you are addressing.\n\nFormal Greetings (used with teachers, elders, strangers, officials, or in exams):\n- Good morning (used before 12:00 noon)\n- Good afternoon (used from 12:00 noon to 6:00 p.m.)\n- Good evening (used from 6:00 p.m. onwards)\n- Good night (used when leaving or going to bed, NOT as a greeting when arriving)\n- How do you do? (very formal introduction)\n\nInformal Greetings (used with friends, classmates, siblings):\n- Hi!\n- Hello!\n- Hey!\n- What\'s up? / Sup?\n- How are you doing?\n\nImportant: In exams and formal situations, always use formal greetings. In Ghana, addressing elders informally is considered disrespectful.' },
                  { title: '2. Time-Based Greetings', content: 'English greetings change based on the time of day. This shows awareness and proper communication skills.\n\n- Good morning: From sunrise to 11:59 a.m.\n- Good afternoon: From 12:00 noon to 5:59 p.m.\n- Good evening: From 6:00 p.m. until you go to bed\n- Good night: Used when leaving someone or going to sleep (NOT when you arrive)\n\nCommon Mistake: Students often say "Good night" when they meet someone in the evening. This is wrong. Use "Good evening" when you arrive, and "Good night" when you leave.\n\nExample Dialogue:\nStudent (arriving at 7:00 p.m.): Good evening, Sir.\nTeacher: Good evening, Kofi. How are you?\nStudent (leaving): Good night, Sir.\nTeacher: Good night.' },
                  { title: '3. Introducing Yourself', content: 'Self-introduction means telling someone your name and basic information about yourself.\n\nCommon Ways to Introduce Yourself:\n1. My name is [full name]. (formal)\n2. I am [first name]. (less formal)\n3. I\'m called [name]. (informal)\n4. You can call me [nickname]. (very informal)\n\nFull Introduction Example:\n"Good morning. My name is Akosua Mensah. I am 13 years old. I am a student at Mfantsipim School. I live in Cape Coast. Nice to meet you."\n\nIn exams, you may be asked to write a self-introduction including:\n- Your name\n- Your age\n- Your school\n- Your town/village\n- Your hobbies or interests' },
                  { title: '4. Asking About Names', content: 'To have a conversation, you need to know how to ask for someone\'s name politely.\n\nQuestions:\n- What is your name? (formal)\n- What\'s your name? (informal)\n- May I know your name? (very polite/formal)\n- Who are you? (direct, can sound rude-use carefully)\n\nAnswers:\n- My name is Kofi.\n- I am Ama.\n- I\'m called Yaw.\n- You can call me Abena.\n\nAsking About Others:\n- What is his/her name?\n- Who is that boy/girl?\n\nExample Dialogue:\nA: Good afternoon. What is your name?\nB: My name is Kwame. What\'s your name?\nA: I\'m Ama. Nice to meet you.\nB: Nice to meet you too.' },
                  { title: '5. Asking and Telling Age', content: 'Age is a common topic in introductions, especially among students.\n\nQuestions:\n- How old are you?\n- What is your age?\n\nAnswers:\n- I am 12 years old.\n- I\'m 13.\n- My age is 14.\n\nNote: Use "years old" after the number for complete sentences. In conversation, you can drop it.\n\nExample:\nQ: How old are you?\nA: I am 13 years old.\n\nAsking About Others:\n- How old is he/she?\n- What is his/her age?\n\nAnswers:\n- He is 12 years old.\n- She\'s 14.' },
                  { title: '6. Grammar Rules for Greetings and Introductions', content: 'Subject Pronouns and the Verb "to be":\n- I am (I\'m)\n- You are (You\'re)\n- He is (He\'s)\n- She is (She\'s)\n- It is (It\'s)\n- We are (We\'re)\n- They are (They\'re)\n\nCapitalization Rules:\n1. Always begin a sentence with a capital letter.\n2. Always capitalize names of people (Ama, Kofi, Mensah).\n3. Always capitalize names of places (Ghana, Accra, Kumasi).\n4. Always capitalize the pronoun "I".\n5. Capitalize titles (Mr., Mrs., Dr., Sir, Madam).\n\nExamples:\n- Correct: My name is Kwame. I am from Ghana.\n- Wrong: my name is kwame. i am from ghana.\n\nCommon Errors:\n- My name are Ama. (Wrong - Correct: My name is Ama.)\n- I is 12 years old. (Wrong - Correct: I am 12 years old.)\n- He are my friend. (Wrong - Correct: He is my friend.)' },
                  { title: '7. Polite Expressions and Etiquette', content: 'Politeness makes your greetings and introductions more effective.\n\nPolite Phrases:\n- Please (when making requests)\n- Thank you / Thanks (after receiving help)\n- You\'re welcome (response to thanks)\n- Excuse me (to get attention or apologize)\n- I\'m sorry (to apologize)\n- Nice to meet you (when meeting someone new)\n- Pleased to meet you (formal)\n\nBody Language:\n- Smile when greeting\n- Make eye contact (not staring)\n- Shake hands (formal settings)\n- Bow slightly or nod (to elders in Ghana)\n- Stand up when greeting elders\n\nCultural Note: In Ghana, showing respect to elders is very important. Always use formal greetings, stand when they enter, and respond promptly.' },
                  { title: '8. Common Mistakes to Avoid', content: '1. Good night as a greeting: "Good night" is NOT used when you arrive. Use "Good evening" instead.\n   - Wrong: (Arriving at 8 p.m.) Good night, Madam.\n   - Correct: Good evening, Madam.\n\n2. Using "am" with "he/she":\n   - Wrong: He am my friend.\n   - Correct: He is my friend.\n\n3. Forgetting capital letters:\n   - Wrong: my name is ama.\n   - Correct: My name is Ama.\n\n4. Using informal greetings with elders:\n   - Wrong: (To teacher) Hey! What\'s up?\n   - Correct: Good morning, Sir.\n\n5. Not responding to greetings:\n   - When someone says "Good morning," always respond with "Good morning" back.\n\n6. Using "I is" or "My name are":\n   - Wrong: I is Kofi. My name are Ama.\n   - Correct: I am Kofi. My name is Ama.' },
                ],
                activities: { 
                    type: 'exercises', 
                    questions: [
                        { type: 'fill_in_blanks', question: '**Exercise 1: Fill in the Blanks**\nComplete the sentences with the correct words (morning, afternoon, evening, am, is, are, old):\n1. Good ______, Madam. (It is 10:00 a.m.)\n2. I ______ Kwame.\n3. My name ______ Abena.\n4. How ______ are you?\n5. I am 13 years ______.\n6. Good ______, Sir. (It is 7:00 p.m.)\n7. He ______ my friend.\n8. They ______ from Accra.\n\n**Answers:** 1. morning, 2. am, 3. is, 4. old, 5. old, 6. evening, 7. is, 8. are' },
                        { type: 'match_columns', question: '**Exercise 2: Match the Greetings with the Correct Time**\nMatch each greeting to the appropriate time of day:\n\nGreetings:\n1. Good morning\n2. Good afternoon\n3. Good evening\n4. Good night\n\nTimes:\n(a) 2:00 p.m.\n(b) 8:00 a.m.\n(c) 10:00 p.m. (when leaving)\n(d) 7:00 p.m.\n\n**Answers:** 1-b, 2-a, 3-d, 4-c'},
                        { type: 'error_correction', question: '**Exercise 3: Correct the Errors**\nRewrite these sentences correctly with proper capitalization and grammar:\n1. good morning sir.\n2. my name are ama.\n3. i is from ghana.\n4. he am 12 years old.\n5. what is you name?\n6. good night, madam. (Person is arriving at 8 p.m.)\n\n**Answers:**\n1. Good morning, Sir.\n2. My name is Ama.\n3. I am from Ghana.\n4. He is 12 years old.\n5. What is your name?\n6. Good evening, Madam.'},
                        { type: 'dialogue_writing', question: '**Exercise 4: Write a Dialogue**\nWrite a short dialogue (at least 6 lines) between two students meeting for the first time. Include:\n- Appropriate greeting for morning\n- Self-introduction with names\n- Questions and answers about age\n- Polite closing\n\n**Sample Answer:**\nKofi: Good morning.\nAma: Good morning. My name is Ama. What is your name?\nKofi: I am Kofi. How old are you, Ama?\nAma: I am 13 years old. How old are you?\nKofi: I\'m 12. Nice to meet you.\nAma: Nice to meet you too.'},
                        { type: 'oral_practice', question: '**Exercise 5: Role-Play Practice**\nPair up with a classmate and practice these scenarios:\n\n**Scenario 1:** You meet your teacher in the morning. Greet her and introduce yourself.\n\n**Scenario 2:** You meet a new friend at a party in the evening. Introduce yourself, ask their name and age.\n\n**Scenario 3:** You are leaving your friend\'s house at night. Say goodbye properly.\n\nPractice proper pronunciation, body language, and polite expressions.'},
                        { type: 'formal_vs_informal', question: '**Exercise 6: Formal or Informal?**\nDecide whether to use a FORMAL or INFORMAL greeting in each situation:\n1. Meeting your headmaster in the morning\n2. Seeing your best friend at school\n3. Arriving at a job interview\n4. Chatting with your younger brother\n5. Speaking to a stranger on the street\n6. Greeting your pastor at church\n7. Meeting your classmate at the playground\n8. Talking to a shop attendant\n\n**Answers:** 1. Formal, 2. Informal, 3. Formal, 4. Informal, 5. Formal, 6. Formal, 7. Informal, 8. Formal'},
                        { type: 'self_introduction_writing', question: '**Exercise 7: Write Your Self-Introduction**\nWrite a complete self-introduction paragraph (5-7 sentences) including:\n- Greeting (choose appropriate time)\n- Your full name\n- Your age\n- Your school\n- Your town or village\n- One hobby or interest\n- Polite closing\n\n**Sample Answer:**\nGood afternoon. My name is Akosua Mensah. I am 13 years old. I attend Wesley Girls\' High School in Cape Coast. I live in Cape Coast with my family. I enjoy reading books and playing netball. It is nice to meet you.'},
                    ],
                },
                pastQuestions: [
                  { question: 'When you meet your teacher in the morning, the correct greeting is:\na) Hi!\nb) Good morning.\nc) What\'s up?', solution: '(b) Good morning. → Formal greetings must be used with teachers and elders.' },
                  { question: 'Rewrite correctly: my name is yaw.', solution: 'My name is Yaw. → Always begin sentences and names with capital letters.' },
                  { question: 'Write a short dialogue (4 lines) where you introduce yourself and ask your friend\'s name.', solution: 'A: Good afternoon.\nB: Good afternoon.\nA: My name is Ama. What is your name?\nB: My name is Kofi.'},
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'What is the correct greeting to use when you arrive at school at 8:00 a.m.?',
                    options: ['Good night', 'Good evening', 'Good morning', 'Good afternoon'],
                    answer: 'Good morning',
                    explanation: 'Good morning is used from sunrise until 11:59 a.m. At 8:00 a.m., this is the appropriate formal greeting for school.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which greeting should you use when LEAVING someone at 9:00 p.m.?',
                    options: ['Good evening', 'Good night', 'Good afternoon', 'Hello'],
                    answer: 'Good night',
                    explanation: 'Good night is used when leaving someone or going to bed, NOT when arriving. Since you are leaving at 9:00 p.m., Good night is correct.'
                  },
                  {
                    type: 'mcq',
                    question: 'Complete the sentence: My name _____ Kwame.',
                    options: ['am', 'is', 'are', 'be'],
                    answer: 'is',
                    explanation: 'My name is singular (third person), so we use is. The correct form is My name is.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which of these is a FORMAL greeting?',
                    options: ['Hey!', 'What\'s up?', 'Good afternoon, Sir', 'Sup?'],
                    answer: 'Good afternoon, Sir',
                    explanation: 'Good afternoon, Sir is a formal greeting appropriate for teachers, elders, and officials. The others are informal greetings used with friends.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the correct response to How old are you?',
                    options: ['I have 13 years', 'I am 13 years old', 'My age have 13', 'I be 13 years'],
                    answer: 'I am 13 years old',
                    explanation: 'The correct structure is: I am + number + years old. This follows proper subject-verb agreement with am for I.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which sentence is written correctly?',
                    options: ['my name is ama.', 'My name is Ama.', 'my Name is ama.', 'My Name Is Ama.'],
                    answer: 'My name is Ama.',
                    explanation: 'Correct capitalization requires: capital letter at the start (My), capital letter for the person\'s name (Ama), and a period at the end.'
                  },
                  {
                    type: 'mcq',
                    question: 'It is 3:00 p.m. and you meet your headmaster. What should you say?',
                    options: ['Good morning, Sir', 'Good afternoon, Sir', 'Good evening, Sir', 'Good night, Sir'],
                    answer: 'Good afternoon, Sir',
                    explanation: 'Good afternoon is used from 12:00 noon to 5:59 p.m. At 3:00 p.m., this is the correct time-based greeting.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which is the correct way to ask someone\'s name politely?',
                    options: ['Who you?', 'What is your name?', 'You name what?', 'Tell your name'],
                    answer: 'What is your name?',
                    explanation: 'What is your name? is a polite, grammatically correct question. The other options are incorrect or impolite.'
                  },
                  {
                    type: 'mcq',
                    question: 'Choose the sentence with correct grammar:',
                    options: ['He am my brother', 'He are my brother', 'He is my brother', 'He be my brother'],
                    answer: 'He is my brother',
                    explanation: 'With he/she/it, we use is. The correct form is: He is my brother.'
                  },
                  {
                    type: 'mcq',
                    question: 'You meet a new student at 7:30 p.m. What greeting do you use when you ARRIVE?',
                    options: ['Good night', 'Good afternoon', 'Good evening', 'Good morning'],
                    answer: 'Good evening',
                    explanation: 'Good evening is used from 6:00 p.m. onwards when ARRIVING. Good night is only for leaving. Since you are arriving at 7:30 p.m., use Good evening.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Good night is used when you arrive in the evening.',
                    answer: 'false',
                    reason: 'FALSE. Good night is used when LEAVING or going to bed, NOT when arriving. Use Good evening when you arrive in the evening.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'In Ghana, it is respectful to use formal greetings with teachers and elders.',
                    answer: 'true',
                    reason: 'TRUE. In Ghanaian culture and proper English communication, formal greetings (Good morning, Sir/Madam) show respect to teachers, elders, and officials.'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'I _____ from Accra.',
                    answer: 'am',
                    alternatives: ['Am'],
                    explanation: 'With the pronoun I, we always use am. Correct sentence: I am from Accra.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which of the following should be capitalized in English? (Select all that apply)',
                    options: ['Names of people', 'Names of places', 'The pronoun I', 'Every word in a sentence'],
                    correctAnswers: ['Names of people', 'Names of places', 'The pronoun I'],
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which of these are polite expressions to use in greetings? (Select all that apply)',
                    options: ['Nice to meet you', 'Thank you', 'Excuse me', 'Shut up'],
                    correctAnswers: ['Nice to meet you', 'Thank you', 'Excuse me'],
                  },
                  {
                    type: 'matching',
                    question: 'Match the pronouns with the correct form of to be:',
                    pairs: [
                      { left: 'I', right: 'am' },
                      { left: 'He', right: 'is' },
                      { left: 'They', right: 'are' },
                    ],
                    explanation: 'Subject-verb agreement: I takes am, he/she/it takes is, you/we/they take are.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'Write a complete sentence introducing yourself. Include your name and age.',
                    answer: 'My name is [Name]. I am [age] years old.',
                    alternatives: ['I am [Name]. I am [age] years old.', 'My name is [Name] and I am [age] years old.'],
                    explanation: 'A complete self-introduction should include: My name is + your name + I am + age + years old. Example: My name is Akua. I am 13 years old. Remember proper capitalization and punctuation.'
                  },
                ],
                summary: 'Lesson Summary: Greetings and Introductions\n\nGreetings and introductions are the foundation of effective communication in English. They show respect, create positive impressions, and establish social connections. This lesson has covered essential skills for the WAEC BECE examinations and real-life interactions.\n\nKey Points Recap:\n\n1. Time-Based Greetings:\n   - Good morning (sunrise to 11:59 a.m.)\n   - Good afternoon (12:00 noon to 5:59 p.m.)\n   - Good evening (6:00 p.m. onwards when arriving)\n   - Good night (when leaving or going to bed, NOT when arriving)\n\n2. Formal vs. Informal:\n   - Formal greetings for teachers, elders, officials (Good morning, Sir/Madam)\n   - Informal greetings for friends (Hi, Hey, What\'s up?)\n   - In Ghana, always show respect to elders with formal greetings\n\n3. Self-Introduction Format:\n   - Greeting + Name + Age + School/Location + Polite closing\n   - Example: Good afternoon. My name is Kwame. I am 13 years old. I attend Achimota School. Nice to meet you.\n\n4. Grammar Essentials:\n   - I am, You are, He/She is, We/They are\n   - My name is (never are)\n   - Always capitalize: first word, names, places, pronoun I\n\n5. Polite Expressions:\n   - Nice to meet you / Pleased to meet you\n   - Thank you / You\'re welcome\n   - Excuse me / I\'m sorry\n\n6. Body Language and Etiquette:\n   - Stand when elders enter\n   - Make respectful eye contact\n   - Smile and be friendly\n   - Shake hands in formal settings\n\nCommon Mistakes to Avoid:\n- Using Good night when arriving (use Good evening)\n- Using am with he/she/it (use is)\n- Forgetting capital letters for names and places\n- Using informal greetings with teachers and elders\n- Wrong verb forms (My name are, I is)\n\nBECE Exam Tips:\n- Questions often test formal vs. informal greetings\n- Capitalization and punctuation errors are common test items\n- Subject-verb agreement with to be is frequently tested\n- Dialogue writing requires complete, correct sentences\n- Time-appropriate greetings are critical\n\nStudy Advice:\nPractice introducing yourself daily. Greet people appropriately at different times. Pay attention to how educated people greet and introduce themselves. Master the grammar rules for to be (am, is, are). Always check your writing for capital letters and punctuation. These skills will serve you not only in exams but throughout your life in school, work, and social situations.\n\nRemember: The way you greet and introduce yourself tells people who you are before you say anything else. Make it count!',
              },
            ],
          },
          {
            id: 'eng102',
            slug: 'reading-1',
            title: 'Reading',
            lessons: [
              {
                id: 'eng102-1',
                slug: 'reading-comprehension-basics',
                title: 'Reading Comprehension Basics',
                objectives: [
                  'Define reading comprehension and explain its importance for academic success and daily life.',
                  'Identify topic sentences, main ideas, and supporting details in different types of passages.',
                  'Distinguish between literal, inferential, vocabulary, and critical comprehension questions.',
                  'Apply pre-reading, during-reading, and post-reading strategies to improve understanding.',
                  'Use context clues, prefixes, suffixes, and synonyms to determine word meanings.',
                  'Analyze common text structures such as narrative, descriptive, expository, and persuasive.',
                  'Differentiate facts from opinions and evaluate an author\'s purpose and tone.',
                  'Summarize passages accurately and state lessons, themes, or moral messages.',
                  'Answer WAEC BECE-style reading comprehension questions with confidence and speed.'
                ],
                introduction: 'Reading comprehension is the ability to construct meaning from written language by decoding words, connecting them to prior knowledge, and forming new ideas. Every time you open a textbook, read a story from the Daily Graphic newspaper, or check an announcement on the school notice board, you are practicing reading comprehension. The better you understand what you read, the easier it becomes to learn new concepts, follow instructions, and express yourself clearly in writing and speaking.\n\nIn the Junior High School classroom, strong reading comprehension skills help you succeed in English Language, Social Studies, Integrated Science, and even Mathematics, because nearly every subject uses written explanations, questions, and instructions. The WAEC Basic Education Certificate Examination (BECE) tests your ability to read passages carefully, identify the main idea, understand detailed information, interpret vocabulary, and draw logical conclusions. Students who master comprehension strategies gain valuable marks in Paper 2 and Paper 3, where passages and questions often determine the difference between achieving grade 1 and grade 4.\n\nReading comprehension also matters beyond examinations. When you follow instructions for a practical assignment, read a WhatsApp message from your parents, interpret signs at the lorry station, or understand health information on a poster, you depend on your ability to process written information accurately. Ghanaian society values responsible citizens who can read policies, understand official forms, and make informed decisions about community issues. Employers look for graduates who can read reports, summarize key points, and evaluate facts before taking action. Therefore, strengthening your comprehension skills now prepares you for senior secondary school, university, professional life, and active citizenship.\n\nThis comprehensive lesson will guide you through proven strategies that successful readers use before, during, and after reading. You will learn how to preview titles, subtitles, and pictures to create a reading purpose; how to ask questions while reading to stay alert and engaged; and how to pause and clarify unfamiliar words using context clues, word parts, or a dictionary. You will discover how to mark important details, track the sequence of events, and note signal words such as however, therefore, and as a result that show relationships within the text.\n\nWe will also explore the different types of passages you will encounter in JHS and the BECE, including narratives about everyday Ghanaian life, expository passages that explain scientific or social concepts, descriptive texts that paint vivid images with words, and persuasive writing that tries to convince you to take action. Each type has a structure and style that can guide you to the correct answers when you know what to look for. You will practice distinguishing facts from opinions, identifying tone and mood, and evaluating an author\'s purpose.\n\nMany students struggle because they rush through passages, ignore instructions, or rely on memory instead of evidence from the text. Others copy entire sentences without checking whether the answer truly matches the question. This lesson will help you avoid those mistakes by teaching you to read questions carefully, locate the relevant lines in the passage, paraphrase ideas in your own words, and provide complete, accurate responses. You will also learn how to summarize long passages into concise statements and cite textual evidence to support your explanations.\n\nBy the end of this lesson, you will feel more confident reading comprehension passages from textbooks, newspapers, online articles, and BECE past questions. Practice, patience, and the strategies taught here will turn reading into an active, purposeful process rather than a passive guessing game. Remember, comprehension grows every time you engage with quality text, discuss ideas with classmates, and review new vocabulary. Approach each passage with curiosity and determination, and you will build the critical thinking skills that Ghana and the wider world urgently need.',
                keyConcepts: [
                  { 
                    title: '1. What Is Reading Comprehension?', 
                    content: 'Reading comprehension is the process of making sense of written language by combining decoding, vocabulary knowledge, and background information to form meaning.\n\nCore Components:\n- Decoding: Recognizing words quickly and accurately on the page.\n- Vocabulary: Knowing the meaning of key words and phrases in context.\n- Background Knowledge: Connecting the text to what you already know from experience and prior learning.\n- Monitoring: Checking continuously that each sentence and paragraph makes sense.\n- Responding: Answering questions, drawing conclusions, making predictions, and applying ideas.\n\nSuccessful readers engage actively with the text instead of reading passively from start to finish without thinking.' 
                  },
                  { 
                    title: '2. Why Reading Comprehension Matters for JHS and BECE', 
                    content: 'In JHS, comprehension affects performance in every subject because instructions, questions, and explanations appear in written form.\n\nBECE Relevance:\n- English Language Paper 2 includes a comprehension passage with multiple questions worth significant marks.\n- Social Studies and Integrated Science require you to interpret case studies, tables, diagrams, and data.\n- Strong comprehension boosts composition writing because you understand model texts, essay prompts, and story themes.\n\nLong-Term Benefits:\n- Improves communication skills for debates, presentations, reports, and discussions.\n- Builds confidence when reading newspapers, community notices, government circulars, and online information.\n- Develops critical thinking for national issues such as sanitation, elections, health campaigns, and environmental protection.' 
                  },
                  { 
                    title: '3. Before-, During-, and After-Reading Strategies', 
                    content: 'Effective readers follow a strategic process before, during, and after reading.\n\nBefore Reading:\n1. Preview the title, pictures, captions, and first sentences to predict the topic.\n2. Set a purpose: decide whether you are looking for main ideas, specific details, vocabulary meanings, or the author\'s opinion.\n3. Activate prior knowledge by recalling similar experiences, lessons, or texts.\n\nDuring Reading:\n1. Read in manageable chunks (paragraphs or sections) and pause to paraphrase what you understand.\n2. Underline or note key words, signal phrases, dates, names, and important facts.\n3. Ask questions such as Who, What, Where, When, Why, and How while you read.\n4. Use context clues or word parts (prefixes, suffixes, roots) to work out difficult vocabulary.\n\nAfter Reading:\n1. Summarize the passage in one or two complete sentences.\n2. Review the questions and locate evidence in the text to support your answers.\n3. Evaluate whether your responses match the instructions and are properly supported by the passage.' 
                  },
                  { 
                    title: '4. Types of Comprehension Questions', 
                    content: 'BECE passages combine several question types. Knowing the difference helps you choose the right reading strategy.\n\n- Literal/Factual: Answers are directly stated in clear words (e.g., What time did Ama arrive?).\n- Detail: Focus on specific names, numbers, dates, places, or reasons.\n- Vocabulary in Context: Ask what a word means as used in the passage, not the dictionary definition.\n- Inferential: Require you to read between the lines and combine clues with logic to draw conclusions.\n- Main Idea: Summarize what the entire passage or paragraph is mostly about in one sentence.\n- Sequencing/Cause and Effect: Look for the order of events or reasons and results using signal words.\n- Critical/Evaluative: Judge the author\'s opinion, tone, purpose, or ask for your reasoned view.\n- Fact vs Opinion: Decide whether a statement can be proven with evidence or is a personal belief.' 
                  },
                  { 
                    title: '5. Using Context Clues and Word-Attack Skills', 
                    content: 'Unknown words do not have to stop you. Context clues and word-attack strategies can reveal meanings without a dictionary.\n\nTypes of Context Clues:\n- Definition Clue: The word is explained directly in the sentence or nearby.\n- Synonym Clue: A similar word appears close by that gives the same meaning.\n- Antonym Clue: An opposite word provides contrast and helps you figure out the meaning.\n- Example Clue: Specific examples illustrate what the term means.\n- Inference Clue: You use logic and surrounding ideas to guess the meaning.\n\nWord-Attack Skills:\n- Prefixes: re- (again), un- (not), mis- (wrongly), pre- (before), dis- (not/opposite)\n- Suffixes: -ful (full of), -less (without), -ment (state of), -tion (action), -able (can be)\n- Root Words: form, port (carry), graph (write), tele (far), struct (build).\n\nCombining clues and word parts helps you unlock vocabulary during timed exams when you cannot check a dictionary.' 
                  },
                  { 
                    title: '6. Text Structures and Organizational Patterns', 
                    content: 'Different passages follow different structures. Recognizing the structure guides where to find answers.\n\nCommon Structures:\n- Narrative: Tells a story with characters, setting, problem, events, climax, and resolution.\n- Descriptive: Uses sensory details (sight, sound, smell, taste, touch) to create a vivid picture.\n- Expository: Explains ideas using headings, subheadings, definitions, and logical order.\n- Compare and Contrast: Shows similarities and differences using words such as however, similarly, while, whereas, but, both.\n- Cause and Effect: Explains reasons and results using words like because, therefore, as a result, consequently, so, since.\n- Problem and Solution: Presents an issue or challenge and explains how it can be solved.\n- Persuasive: Attempts to convince the reader using arguments, evidence, emotional appeals, and calls to action.\n\nTip: Notice signal words and paragraph organization to understand how ideas are connected and where key information appears.' 
                  },
                  { 
                    title: '7. Evaluating Author\'s Purpose, Tone, and Fact vs Opinion', 
                    content: 'Authors write with a purpose: to inform, entertain, describe, persuade, or express feelings. Tone reveals the writer\'s attitude, such as serious, humorous, hopeful, angry, respectful, sarcastic, or warning.\n\nEvaluating Purpose and Tone:\n- Look at verbs and adjectives to see whether the writer praises, criticizes, explains, or simply informs.\n- Identify emotional words that show approval, disapproval, excitement, or concern.\n- Decide whether the passage urges the reader to take action, learn something, or enjoy a story.\n\nFact vs Opinion:\n- Facts can be proven with evidence, data, dates, measurements, or observation (e.g., Ghana gained independence on March 6, 1957).\n- Opinions express beliefs, judgments, preferences, or feelings that cannot be proven (e.g., The parade was exciting and beautiful).\n\nUnderstanding purpose, tone, and the difference between fact and opinion helps you answer critical questions accurately and fairly.' 
                  },
                  { 
                    title: '8. Summarizing, Paraphrasing, and Note-Making', 
                    content: 'Summaries capture the main idea and essential details in fewer words, while paraphrasing restates information in your own language without changing the original meaning.\n\nSteps to Summarize:\n1. Identify the topic sentence and the most important supporting points.\n2. Remove examples, anecdotes, quotations, repeated ideas, and minor details.\n3. Combine key points into 2-3 clear, complete sentences.\n\nEffective Paraphrasing:\n- Change the sentence structure and word order.\n- Replace vocabulary with appropriate synonyms where possible.\n- Keep the original meaning intact without adding your own opinion.\n\nNote-Making Tips:\n- Use bullet points, numbered lists, tables, or Cornell notes to organize information.\n- Highlight dates, names, technical terms, and definitions for quick revision.\n- Add personal reminders such as check question 4 again or compare with last lesson to stay focused and connected.' 
                  },
                ],
                activities: { 
                  type: 'exercises', 
                  questions: [
                    { 
                      type: 'pre_reading_planner', 
                      question: '**Exercise 1: Pre-Reading Planner**\n\nSelect an article from the Junior Graphic newspaper or your English textbook. Without reading the full passage, complete the following steps:\n1. Write the title and any subheading you notice.\n2. Predict what the passage might discuss in two sentences.\n3. List three questions you hope the passage will answer.\n\n**Purpose:** This prepares your brain with a clear purpose and activates prior knowledge, making comprehension easier and faster.' 
                    },
                    { 
                      type: 'main_idea_map', 
                      question: '**Exercise 2: Main Idea and Supporting Details**\n\nRead the passage:\n"Every Wednesday, the students of Adabraka JHS visit the community library. The librarian, Madam Owusu, trains them to choose books that match their interests and reading levels. After selecting books, the students spend 30 minutes in silent reading before discussing the main ideas with partners. Madam Owusu keeps a reading chart that tracks each student\'s progress over the term."\n\nTasks:\n1. Identify the topic sentence of the passage.\n2. State the main idea in one complete sentence.\n3. List two supporting details that explain or prove the main idea.\n\n**Answers:**\n1. "Every Wednesday, the students of Adabraka JHS visit the community library." (topic sentence).\n2. The passage explains how Adabraka JHS students use the community library to develop consistent reading habits and skills.\n3. Supporting details: The librarian guides book selection; students read for 30 minutes; there is a reading chart to track progress over time (any two acceptable).' 
                    },
                    { 
                      type: 'detail_scavenger', 
                      question: '**Exercise 3: Detail Scavenger Hunt**\n\nStudy the short article:\n"In 2024, the Parent-Teacher Association of Domeabra JHS organised a special reading clinic to help struggling students. Fifty students attended the first session, and trained facilitators divided them into five small groups. Each group read a science passage together and answered comprehension questions as a team. At the end of the clinic, the PTA donated 120 new storybooks to the school library to encourage more reading practice."\n\nTasks:\n1. How many students attended the reading clinic?\n2. Into how many groups were the students divided?\n3. What gift did the PTA donate to the school?\n\n**Answers:** 1. Fifty (50) students. 2. Five (5) groups. 3. One hundred and twenty (120) storybooks for the school library.' 
                    },
                    { 
                      type: 'inference_challenge', 
                      question: '**Exercise 4: Inference Challenge**\n\nRead the passage carefully:\n"Kweku closed his exercise book with a sigh when the lights suddenly went off. He felt around in the darkness for his rechargeable lamp but realized it was not charged. He walked slowly to the veranda and waved to his neighbor, Mr. Mensah, who was starting a generator. Minutes later, Kweku heard the familiar hum of the generator, and his room lit up again."\n\nQuestions:\n1. What caused the lights to go off in Kweku\'s house?\n2. Why could Kweku not use his rechargeable lamp immediately?\n3. Who helped Kweku continue his studies, and how?\n\n**Suggested Answers:**\n1. There was a power outage (electricity cut). This is inferred because the lights went off suddenly.\n2. The rechargeable lamp was not charged, so it had no stored power.\n3. Mr. Mensah, the neighbor, helped by starting a generator that provided electricity to Kweku\'s room.' 
                    },
                    { 
                      type: 'vocabulary_context', 
                      question: '**Exercise 5: Vocabulary in Context**\n\nRead each sentence carefully and choose the meaning of the underlined word based on context clues.\n1. "The headteacher commended the class for their outstanding performance in the inter-school reading competition."\n2. "Ama scrutinised the timetable carefully to ensure she would not miss any revision session before the exams."\n3. "The school organizer urged all parents to cultivate the habit of reading with their children at home every evening."\n\nPossible meanings:\n(a) praised / examined carefully / develop\n(b) shouted at / ignored / punish\n(c) delayed / memorized / cancel\n(d) congratulated / simplified / entertain\n\n**Answers:** 1. commended = praised (a); 2. scrutinised = examined carefully (a); 3. cultivate = develop (a). All three words match option (a) for the complete set.' 
                    },
                    { 
                      type: 'sequencing_table', 
                      question: '**Exercise 6: Sequencing and Cause-Effect Table**\n\nPassage:\n"During the Harmattan season, the school prefect noticed that many classmates were coughing frequently. She wrote a detailed report to the headteacher explaining the health situation. The headteacher immediately contacted the Ghana Health Service, which sent a nurse to educate the students about preventing respiratory infections. After the health talk, the school administration provided clean drinking water at the assembly grounds so students could stay hydrated and healthy."\n\nTasks:\n1. List the events in chronological order using a table with columns: First, Next, Then, Finally.\n2. Identify one clear cause-and-effect relationship from the passage.\n\n**Sample Response:**\nFirst: The prefect observed many students coughing.\nNext: She wrote a report to the headteacher.\nThen: The headteacher invited a nurse from Ghana Health Service.\nFinally: The school provided clean drinking water at the assembly grounds.\n\nCause and Effect: Because students were coughing (cause), the prefect reported to the headteacher (effect). As a result of the report (cause), a nurse came to educate students (effect).' 
                    },
                    { 
                      type: 'summary_exit_ticket', 
                      question: '**Exercise 7: Summary Exit Ticket**\n\nRead the paragraph:\n"The Sunyani Municipal Assembly launched an innovative mobile library van that visits ten different communities each week. The van carries a variety of textbooks, storybooks, novels, and tablets loaded with past examination questions. Trained librarians organize interactive reading circles under large trees, while dedicated volunteers teach pupils how to take short, effective notes. Parents in the communities reported that children now read together in the evenings and enthusiastically discuss new words they discover."\n\nTasks:\n1. Write a two-sentence summary that captures the main idea and most important details.\n2. Identify one significant benefit of the mobile library program for learners.\n\n**Model Summary:** The Sunyani Municipal Assembly introduced a mobile library van that brings diverse books, digital resources, and interactive reading circles to ten communities weekly. The program helps pupils practice note-taking skills and encourages families to read together, significantly improving vocabulary and study habits.\n\n**Benefit:** Children are reading more regularly at home and actively sharing new vocabulary with family members, which strengthens literacy skills.' 
                    },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'BECE-Style Passage 1 (Literal and Main Idea Questions):\n\n"Adjoa joined the Keta Reading Club at the beginning of the first term. Every Friday afternoon, the club meets in the School Assembly Hall to read short passages about famous Ghanaian heroes and historical events. The club leader, a Form 3 student, assigns different roles to members: one student reads the passage aloud with expression, another explains new vocabulary words to the group, and a third member summarizes the main points. After each session, all members write down one important lesson they learned and share it on the club\'s colorful notice board for other students to read."\n\nQuestions:\n1. Where does the Keta Reading Club meet for their sessions?\n2. How many different roles are mentioned in the passage?\n3. Why do club members write lessons on the notice board?\n4. What is the main idea of the passage?\n5. Identify one supporting detail that proves the club is well organized.', 
                    solution: '1. The club meets in the School Assembly Hall. (Literal detail question)\n2. Three different roles are mentioned: reading aloud, explaining vocabulary, and summarizing. (Detail counting question)\n3. To share the lessons they learned with other students in the school. (Purpose/detail question)\n4. The passage describes how the Keta Reading Club organizes its weekly Friday sessions to help students build reading comprehension skills and learn about Ghanaian history. (Main idea question)\n5. Supporting detail: The club leader assigns specific roles to different members, which shows clear organization and structure. Another acceptable answer: Members share lessons on a notice board, showing thoughtful planning. (Supporting evidence question)' 
                  },
                  { 
                    question: 'Vocabulary Focus (BECE 2018 Adapted): In the passage about the Keta Reading Club, the word "assigns" is used. What does "assigns" mean in this context?\n(A) Confuses people by giving unclear instructions\n(B) Distributes specific tasks or responsibilities to different people\n(C) Interrupts the meeting with announcements\n(D) Ignores the requests of club members', 
                    solution: 'Correct Answer: (B) Distributes specific tasks or responsibilities to different people.\n\nExplanation: The word "assigns" means giving out specific duties, roles, or tasks to each club member. The context shows the club leader giving different jobs (reading, explaining, summarizing) to different students, which matches option B perfectly. Options A, C, and D describe negative actions that do not fit the positive, organized context of the passage.' 
                  },
                  { 
                    question: 'Sequencing Practice (BECE 2019 Style):\n\n"First, the school librarian announced the upcoming inter-house reading competition during morning assembly. Next, interested students registered their names according to their houses and forms. Then, each registered participant selected a practice passage and worked with a mentor teacher to improve fluency and expression. Finally, the exciting competition took place on the last Saturday of the month in the school auditorium."\n\nWhich event happened third in the sequence?', 
                    solution: 'The third event was: Each registered participant selected a practice passage and worked with a mentor teacher.\n\nExplanation: Sequencing question testing chronological order. The correct sequence is: 1st - announcement during assembly, 2nd - student registration, 3rd - passage selection and mentoring, 4th - competition day. Signal words (First, Next, Then, Finally) help identify the order clearly.' 
                  },
                  { 
                    question: 'Inference Challenge (BECE 2020 Style):\n\n"Yaw carefully folded the corner of the page to mark his place and tucked the book securely in his school bag. When he reached home after the long walk, he rushed through supper without his usual conversation. His mother smiled knowingly because she understood that Yaw would discuss the exciting story with her before bedtime, just as he always did."\n\nWhat can be inferred about Yaw from this passage?', 
                    solution: 'Yaw is an enthusiastic and responsible reader who loves books and enjoys sharing stories with his mother.\n\nExplanation: This is an inference question requiring you to read between the lines. Evidence: Yaw marks his place carefully (responsible), rushes through supper (eager to continue), and has a bedtime routine of discussing stories with his mother (enthusiastic about reading and enjoys sharing). The mother\'s knowing smile confirms this is his regular behavior, not a one-time event.' 
                  },
                  { 
                    question: 'Fact vs Opinion (BECE 2021 Style):\n\nStatement: "Reading on the school bus every morning is absolutely the best way to use the travel time productively," Kofi confidently told his friends during break time.\n\nIs Kofi\'s statement a fact or an opinion? Give a clear reason for your answer.', 
                    solution: 'Kofi\'s statement is an opinion, not a fact.\n\nReason: The phrase "absolutely the best way" reflects Kofi\'s personal belief and preference, which cannot be proven true for everyone. Some students might prefer using bus time to review notes, practice mental math, socialize with friends, or simply rest. A fact must be provable with evidence and true for all cases, but Kofi\'s statement is his subjective judgment about the ideal use of time.' 
                  },
                  { 
                    question: 'Data Interpretation (BECE 2022 Inspired):\n\nThe table below shows the number of comprehension passages successfully solved by Form 1A students over four weeks:\n\nWeek 1: 3 passages\nWeek 2: 5 passages\nWeek 3: 4 passages\nWeek 4: 6 passages\n\nQuestions:\n1. In which week did the class solve the highest number of passages?\n2. What is the total number of passages the class solved over the four weeks?', 
                    solution: '1. Week 4 had the highest number with 6 passages solved.\n\nExplanation: Compare all numbers: 3, 5, 4, 6. The largest is 6 in Week 4.\n\n2. Total passages solved = 3 + 5 + 4 + 6 = 18 passages.\n\nExplanation: Add all weekly totals together: 3 + 5 = 8, then 8 + 4 = 12, finally 12 + 6 = 18. (Data interpretation and calculation question)' 
                  },
                  { 
                    question: 'Text Structure Analysis:\n\n"Plastic waste blocks drainage systems during the rainy season, which leads to serious flooding problems in many Ghanaian towns and cities. To solve this growing environmental problem, municipal assemblies must strictly enforce proper waste collection schedules and regulations. Additionally, citizens should actively recycle plastic bottles and bags instead of throwing them away carelessly. Furthermore, education campaigns in schools and communities can successfully change attitudes and behaviors toward waste management."\n\nWhich text structure or organizational pattern is used in this passage?', 
                    solution: 'The passage uses a Problem and Solution structure.\n\nExplanation: The first sentence clearly states the problem (plastic waste blocks drains and causes flooding). The remaining sentences present multiple solutions: enforcement by assemblies, citizen recycling, and education campaigns. Signal words like "to solve" directly indicate the problem-solution pattern. This structure is common in persuasive and expository writing about social or environmental issues.' 
                  },
                  { 
                    question: 'Author\'s Purpose Question:\n\n"The newspaper article strongly encouraged all parents and guardians to read bedtime stories to their children every night because research shows it strengthens family bonds, builds vocabulary faster, and significantly improves listening comprehension skills for academic success."\n\nWhat is the author\'s main purpose in writing this sentence?', 
                    solution: 'The author\'s purpose is to persuade parents to read bedtime stories by highlighting the multiple benefits.\n\nExplanation: The verb "encouraged" and the detailed list of positive outcomes (family bonds, vocabulary, comprehension) show the author wants to convince parents to take action. This is persuasive writing, not simply informative, because the author advocates for a specific behavior change. The word "strongly" emphasizes the persuasive intent.' 
                  },
                  { 
                    question: 'Context Clue Question (BECE 2017 Inspired):\n\n"After the extremely long and tiring journey from Tamale to Accra, the hungry students were absolutely famished. They rushed eagerly to the school dining hall as soon as the bus arrived at the campus."\n\nWhat does the word "famished" mean in this passage?', 
                    solution: 'The word "famished" means extremely hungry or starving.\n\nExplanation: Context clues help us understand the meaning. The passage mentions "hungry students" directly before "famished," giving us a synonym clue. Additionally, the phrase "rushed eagerly to the dining hall" shows their urgent need for food. The word "absolutely" before "famished" intensifies the meaning, suggesting not just regular hunger but extreme hunger after a long, tiring journey.' 
                  },
                  { 
                    question: 'Compare and Contrast:\n\n"Unlike the old school library that had only dusty shelves with outdated books, the new modern resource centre features functional computers with internet access, recently published textbooks in excellent condition, and a dedicated quiet study area with comfortable seating. However, both the old library and the new centre serve the important purpose of providing students with a safe space to read, learn, and develop their knowledge."\n\nTask: List one clear difference and one important similarity between the two library facilities.', 
                    solution: 'Difference: The old library had only dusty shelves with old books, while the new resource centre has modern computers, updated textbooks, and comfortable study areas.\n\nSimilarity: Both facilities provide students with a dedicated space for reading, learning, and knowledge development.\n\nExplanation: The signal word "Unlike" introduces the contrasting features (differences), while "However, both" introduces the common feature (similarity). Good readers notice these signal words to understand compare-contrast structure.' 
                  },
                  { 
                    question: 'Critical Thinking Question:\n\n"The experienced headteacher insists that every JHS student should read at least one newspaper article each week throughout the academic year. She firmly believes this consistent practice will significantly improve reading comprehension skills and increase civic awareness about current national and international events."\n\nDo you agree with the headteacher\'s reading plan? Give one strong reason linked to comprehension skills to support your answer.', 
                    solution: 'Sample answer: Yes, I agree with the headteacher\'s plan because reading newspaper articles regularly exposes students to current vocabulary, diverse writing styles, and real-life issues, which strengthens comprehension skills and connects classroom learning to the wider world. Newspaper texts also contain various question types (facts, opinions, causes, effects) that mirror BECE comprehension passages.\n\n(Note: Any reasonable, well-supported response with clear reasoning earns full marks. Students may also disagree if they provide logical reasons such as time constraints or alternative reading strategies.)' 
                  },
                  { 
                    question: 'Summary Skills (BECE 2016 Style):\n\n"Kojo volunteered at the community reading centre during the long vacation. He spent his mornings carefully arranging donated books by subject and age level, repairing torn book covers with tape and glue, and recording all the titles accurately in the centre\'s register. At the end of each working day, he enthusiastically organized fun reading games and storytelling sessions for the younger children who visited the centre."\n\nTask: Write a clear two-sentence summary of the passage.', 
                    solution: 'Summary: Kojo spent his school vacation volunteering at the community reading centre by organizing donated books, repairing damaged materials, and maintaining accurate records. He also led enjoyable reading games and storytelling sessions for younger children each day.\n\nExplanation: A good summary includes the main idea (Kojo\'s volunteer work) and the most important supporting details (his specific tasks) without minor examples or unnecessary adjectives. The summary is written in the student\'s own words while preserving the original meaning.' 
                  },
                  { 
                    question: 'Pronoun Reference:\n\n"When Abena visited the annual Cape Coast book fair last Saturday, she met Madam Mensima, the district education director. She told her about an exciting new scholarship program for avid readers in the Central Region."\n\nWho does the second "she" refer to in the last sentence?', 
                    solution: 'The second "she" is grammatically ambiguous, but context suggests Madam Mensima told Abena about the scholarship.\n\nExplanation: This question tests pronoun clarity. The sentence contains a pronoun reference problem because "she" could refer to either Abena or Madam Mensima. However, it makes more logical sense that the education director (Madam Mensima) would inform a student (Abena) about scholarships, not the reverse. Good writers avoid such ambiguous pronouns. This could be rewritten as: "Madam Mensima told her about..." or "The director told Abena about..." for absolute clarity.' 
                  },
                  { 
                    question: 'Tone Identification:\n\n"The editorial writer described the volunteer teachers as tireless champions of education who selflessly transformed a dusty, neglected classroom into a vibrant, welcoming reading hub that now serves hundreds of eager learners every week."\n\nWhat is the tone of this sentence?', 
                    solution: 'The tone is appreciative, admiring, and celebratory.\n\nExplanation: The writer uses very positive, emotional language: "tireless champions" (heroic), "selflessly" (admiring their sacrifice), "vibrant, welcoming" (positive transformation), "eager learners" (enthusiastic outcome). These word choices show the writer respects and praises the volunteers\' efforts. The tone is not neutral or critical but clearly appreciative of their contribution to education.' 
                  },
                  { 
                    question: 'BECE 2023 Style Extended Passage:\n\n"During the annual Reading Clinic organized in Kumasi, experienced facilitators carefully paired older, confident students with younger primary pupils who struggled with reading. The older students modelled fluent reading by reading passages aloud with clear expression and appropriate pacing, while the younger ones followed along by pointing to each word with their fingers. Afterwards, the pairs discussed the moral lesson of each story and worked together to write new vocabulary words on colorful flashcards for future practice. At the closing ceremony, proud parents observed the final presentations and promised to continue the supportive reading partnership at home every evening."\n\nQuestions:\n1. Who were paired together during the Reading Clinic?\n2. What specific activity helped younger pupils follow the reading more closely?\n3. Why were flashcards created by the pairs?\n4. Which sentence provides evidence of parents\' commitment to continued support?\n5. State one important moral lesson or value demonstrated in this passage.', 
                    solution: '1. Older, confident students were paired with younger primary pupils who struggled with reading. (Literal detail)\n\n2. Younger pupils followed the text by pointing to each word with their fingers while listening to the older students read. (Specific activity detail)\n\n3. Flashcards were created to record new vocabulary words for future practice and learning. (Purpose/vocabulary detail)\n\n4. Evidence of commitment: "Proud parents observed the final presentations and promised to continue the supportive reading partnership at home every evening." This sentence directly states parents\' promise. (Textual evidence question)\n\n5. Sample moral lesson: Peer support and cooperation improve learning outcomes. Older students helping younger ones demonstrates the value of mentorship, patience, and community responsibility. (Critical thinking/lesson question - multiple acceptable answers)' 
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'Which statement best defines reading comprehension?',
                    options: [
                      'Understanding spoken information during a face-to-face conversation',
                      'Constructing meaning from written language by using vocabulary, background knowledge, and active thinking skills',
                      'Memorizing every single sentence in a passage without any analysis or understanding',
                      'Reading as quickly as possible without stopping to think about meaning'
                    ],
                    answer: 'Constructing meaning from written language by using vocabulary, background knowledge, and active thinking skills',
                    explanation: 'Reading comprehension focuses on actively making meaning from text by combining language knowledge, prior experience, and thinking strategies. It is not about speed, memorization, or spoken language, but about understanding written words deeply.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which pre-reading strategy is most helpful before tackling a BECE comprehension passage?',
                    options: [
                      'Skip the title completely and go straight to reading the questions first',
                      'Preview the title, headings, and pictures to predict what the passage will discuss',
                      'Read only the last sentence of the passage to save time',
                      'Memorize unrelated vocabulary lists before looking at the passage'
                    ],
                    answer: 'Preview the title, headings, and pictures to predict what the passage will discuss',
                    explanation: 'Previewing titles, headings, and visual elements gives you a clear purpose for reading and activates background knowledge, which significantly improves comprehension speed and accuracy. Skipping these elements or reading randomly wastes time and reduces understanding.'
                  },
                  {
                    type: 'mcq',
                    question: 'A question that asks "Why did Ama close her shop early today?" is most likely which type of question?',
                    options: [
                      'Literal or factual question',
                      'Inferential question requiring reasoning',
                      'Vocabulary in context question',
                      'Matching question'
                    ],
                    answer: 'Inferential question requiring reasoning',
                    explanation: 'The question asks "Why," which requires understanding the reason or cause. If the reason is not directly stated in the passage, you must infer (figure out) the answer by combining clues from the text with logical thinking, making it an inferential question.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which of the following sentences is a supporting detail for the main idea "The mobile library program improves reading habits in rural communities"?',
                    options: [
                      'The mobile library visits ten different communities each month with free books.',
                      'Reading comprehension is very important for passing examinations successfully.',
                      'Students should always wake up early in the morning for school.',
                      'The rainy season in Ghana usually starts in April each year.'
                    ],
                    answer: 'The mobile library visits ten different communities each month with free books.',
                    explanation: 'This sentence directly supports the main idea by providing specific evidence about how the mobile library serves communities, which logically improves reading habits. The other options discuss unrelated topics (exams, waking up, rain) that do not support the stated main idea.'
                  },
                  {
                    type: 'mcq',
                    question: 'When a passage compares two schools using signal words such as however, similarly, and both, which text structure is being used?',
                    options: [
                      'Cause and effect structure',
                      'Compare and contrast structure',
                      'Problem and solution structure',
                      'Chronological or time order structure'
                    ],
                    answer: 'Compare and contrast structure',
                    explanation: 'Signal words like however (showing difference), similarly and both (showing similarity) are clear indicators of compare and contrast structure. This pattern shows how two or more things are alike and different.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which strategy would BEST help you determine the meaning of an unfamiliar word in a reading passage?',
                    options: [
                      'Ignore the unfamiliar word completely and skip that sentence',
                      'Look for examples, synonyms, or definition clues near the word in the surrounding sentences',
                      'Count how many times the word appears in the entire passage',
                      'Write the word repeatedly in your notebook without understanding it'
                    ],
                    answer: 'Look for examples, synonyms, or definition clues near the word in the surrounding sentences',
                    explanation: 'Context clues such as examples, definitions, synonyms, or antonyms in nearby sentences provide strong hints to word meaning without needing a dictionary. This is a key skill for timed exams where dictionaries are not allowed.'
                  },
                  {
                    type: 'mcq',
                    question: 'If a passage includes characters, setting, conflict, rising action, and resolution, it is most likely which type of text?',
                    options: [
                      'Narrative text or story',
                      'Expository article explaining facts',
                      'Persuasive speech or advertisement',
                      'Procedural text with step-by-step instructions'
                    ],
                    answer: 'Narrative text or story',
                    explanation: 'Narratives tell stories with characters, setting (time and place), and a plot structure that includes conflict (problem), rising action (events), climax (turning point), and resolution (solution). These elements are the key features of narrative text structure.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which sentence expresses an opinion rather than a fact?',
                    options: [
                      'Ghana gained political independence from Britain on March 6, 1957.',
                      'The school library opens at exactly 8:00 a.m. every weekday morning.',
                      'Reading storybooks is absolutely the most exciting and enjoyable subject in school.',
                      'The Parent-Teacher Association donated fifty brand new dictionaries to our school last month.'
                    ],
                    answer: 'Reading storybooks is absolutely the most exciting and enjoyable subject in school.',
                    explanation: 'This statement expresses a personal belief or preference that cannot be proven true for everyone. Words like "most exciting and enjoyable" reveal subjective judgment (opinion). The other sentences state verifiable facts with specific dates, times, or numbers that can be proven.'
                  },
                  {
                    type: 'mcq',
                    question: 'During the BECE examination, what should you do immediately after reading a comprehension question?',
                    options: [
                      'Write any random answer quickly to save precious time',
                      'Search the passage carefully for evidence that clearly supports your answer',
                      'Skip all difficult questions completely until the very end of the exam',
                      'Try to memorize the exact question word-for-word without looking at the passage'
                    ],
                    answer: 'Search the passage carefully for evidence that clearly supports your answer',
                    explanation: 'Good comprehension requires returning to the passage to find specific evidence that supports your response. Guessing randomly, skipping questions prematurely, or relying only on memory leads to errors. Always cite textual evidence for your answers.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which strategy helps you monitor your understanding DURING the reading process?',
                    options: [
                      'Previewing the passage title and headings before starting',
                      'Self-questioning and paraphrasing each paragraph in your own words as you read',
                      'Writing a complete summary after finishing the entire passage',
                      'Checking your final answers with a friend during the examination'
                    ],
                    answer: 'Self-questioning and paraphrasing each paragraph in your own words as you read',
                    explanation: 'Asking yourself questions (Do I understand this? What is the main point?) and restating information in your own words are active monitoring strategies used WHILE reading. These techniques help you check comprehension in real-time and identify confusing parts that need re-reading.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Good summaries should include every single example, quotation, and minor detail from the original passage to avoid missing any information.',
                    reason: 'A well-written summary keeps only the most important main ideas and essential supporting details while removing examples, quotations, anecdotes, repeated information, and minor facts.',
                    answer: 'false'
                  },
                  {
                    type: 'truefalse',
                    statement: 'The topic sentence of a paragraph always appears at the very beginning and can never be placed in the middle or end of the paragraph.',
                    reason: 'While topic sentences commonly appear at the beginning, skilled writers sometimes place them in the middle or end of paragraphs for emphasis, variety, or stylistic effect. Careful readers must search the entire paragraph to find the main idea.',
                    answer: 'false'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'Signal words such as "first", "next", "then", and "finally" help readers recognise the __________ or order of events in a passage.',
                    answer: 'sequence',
                    explanation: 'These transition words indicate chronological order and help readers follow the sequence (order) of events from beginning to end. They are essential in narrative and procedural texts.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which actions are important parts of effective pre-reading preparation? (Select all correct answers)',
                    options: [
                      'Skimming the introduction and conclusion to predict the main content',
                      'Highlighting every unfamiliar word before reading the passage',
                      'Setting a clear purpose for what you want to learn from the text',
                      'Covering the entire passage so you cannot see any words before starting'
                    ],
                    correctAnswers: [
                      'Skimming the introduction and conclusion to predict the main content',
                      'Setting a clear purpose for what you want to learn from the text'
                    ],
                    explanation: 'Effective pre-reading includes previewing key sections (intro, conclusion, headings) to predict content and setting a clear reading purpose (looking for main ideas vs. specific details). Highlighting before reading or hiding the text completely are not helpful pre-reading strategies.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Select the statements that accurately describe inferential comprehension questions. (Choose all that apply)',
                    options: [
                      'They require you to combine information from the text with your prior knowledge and logic.',
                      'They can always be answered by copying a complete sentence word-for-word from the passage.',
                      'They often begin with question words like "Why do you think..." or "What can you conclude..."',
                      'They ask you to define a vocabulary word exactly as it appears in the dictionary.'
                    ],
                    correctAnswers: [
                      'They require you to combine information from the text with your prior knowledge and logic.',
                      'They often begin with question words like "Why do you think..." or "What can you conclude..."'
                    ],
                    explanation: 'Inferential questions require "reading between the lines" by combining textual clues with reasoning to draw conclusions. They often use prompts like "Why do you think," "What can you conclude," or "What does this suggest." They cannot be answered by direct copying (that would be literal questions) or simple dictionary definitions (that would be vocabulary questions).'
                  },
                  {
                    type: 'matching',
                    question: 'Match each comprehension question type to its correct description.',
                    pairs: [
                      { left: 'Literal question', right: 'Answer is directly stated in clear words in the passage' },
                      { left: 'Vocabulary in context', right: 'Asks what a word means based on how it is used in the sentence' },
                      { left: 'Critical or evaluative', right: 'Requires judging the author\'s opinion or giving your own reasoned view' },
                      { left: 'Sequencing', right: 'Focuses on the specific order in which events happened' },
                    ],
                    explanation: 'Each question type has a unique focus and requires different reading strategies. Knowing these categories helps you choose the right approach: scanning for literal questions, using context for vocabulary, analyzing for critical questions, and noting signal words for sequencing.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'Explain in your own words why reading the comprehension questions before or after reading the passage can help you answer more accurately in the BECE examination.',
                    answer: 'Previewing the questions before reading shows you exactly what information to look for, which allows you to read with a clear purpose and mark relevant sections as you go. This saves time during the exam because you can return directly to the marked evidence instead of searching the entire passage again for answers.',
                    explanation: 'Reading questions first or immediately after gives you a focused reading purpose and helps you collect evidence efficiently. This strategy reduces random guessing and ensures your answers are supported by specific textual evidence, which improves accuracy and exam performance.'
                  },
                ],
                summary: 'Reading comprehension is the active process of constructing meaning from written text by combining vocabulary knowledge, background experience, and critical thinking strategies. Successful readers use systematic before-reading (previewing, predicting, setting purpose), during-reading (questioning, paraphrasing, monitoring, noting key details), and after-reading (summarizing, reviewing evidence, evaluating) strategies. Remember to identify text structures (narrative, expository, compare-contrast, cause-effect, problem-solution, persuasive), use context clues for unknown words (definition, synonym, antonym, example, inference), and recognize different question types (literal, inferential, vocabulary, main idea, sequencing, critical, fact vs. opinion). Always return to the passage to find specific textual evidence that supports your answers instead of relying on memory or guessing. Practice regularly with BECE past questions, newspaper articles, textbook passages, and library books to build confidence, speed, and accuracy. With consistent effort and strategic reading, you will approach every comprehension passage with the skills needed for academic excellence and lifelong learning.',
              },
              {
                id: 'eng102-2',
                slug: 'silent-oral-reading-skills',
                title: 'Silent and Oral Reading Skills',
                objectives: [
                  'Define silent reading and oral reading, explaining their distinct purposes and applications in academic and social contexts.',
                  'Demonstrate effective silent reading strategies including speed adjustment, comprehension monitoring, and focus techniques.',
                  'Apply oral reading skills with proper pronunciation, expression, pacing, and voice modulation for different audiences.',
                  'Analyze the relationship between reading fluency, comprehension, and academic performance in various subjects.',
                  'Compare and contrast the benefits and appropriate uses of silent versus oral reading in different situations.',
                  'Develop confidence in public reading through practice, preparation, and performance strategies.',
                  'Use appropriate reading techniques for different text types including narratives, poetry, speeches, and informational texts.',
                  'Evaluate personal reading strengths and areas for improvement in both silent and oral reading skills.',
                  'Apply reading skills effectively in BECE examination contexts and real-world communication scenarios.'
                ],
                introduction: 'Reading is a fundamental skill that takes two primary forms: silent reading and oral reading. Every day, Ghanaian Junior High School students engage in both types of reading, whether silently studying textbooks in the library, quietly reviewing notes before an examination, reading aloud during English class participation, or presenting research findings to classmates. Understanding when, why, and how to use each reading mode effectively can significantly improve your academic performance, communication skills, and confidence in both classroom and community settings.\n\nSilent reading, also called "reading to yourself," involves processing written text mentally without vocalizing the words. This is the reading mode you use when studying alone, answering comprehension questions during the BECE examination, reading newspapers at home, or following instructions on worksheets. Silent reading allows you to read faster, concentrate deeply, and adjust your speed based on the difficulty of the material. When you read silently, you can pause to think about complex ideas, reread confusing sections, and make mental connections without disturbing others around you.\n\nOral reading, on the other hand, involves speaking the written words aloud so that others can hear and understand the content. This skill is essential when reading passages during English Language classes, presenting project findings to your Social Studies group, participating in school debates, reading announcements during morning assembly, or sharing stories with younger siblings at home. Effective oral reading requires clear pronunciation, appropriate pacing, expressive intonation, and confident voice projection that engages listeners and communicates meaning accurately.\n\nBoth reading modes are crucial for success in the WAEC Basic Education Certificate Examination. Silent reading skills help you quickly process comprehension passages, understand essay prompts, and review your written responses efficiently within the time limits. Oral reading confidence supports your performance in oral examinations, classroom discussions, and any presentation components of your coursework. Students who master both skills often achieve better grades because they can adapt their reading approach to match the specific demands of each academic task.\n\nIn Ghanaian society, strong reading skills connect you to your community and culture. Silent reading enables you to stay informed about local and national news by reading the Daily Graphic or Ghanaian Times independently. It helps you understand government policies, health information, agricultural notices, and educational opportunities that affect your family and community. Oral reading skills allow you to participate actively in church services, traditional ceremonies, community meetings, and family gatherings where reading scriptures, announcements, or cultural texts aloud is expected and valued.\n\nMany students struggle with reading because they have not learned specific strategies for each mode. Some read everything slowly and silently, missing opportunities to develop oral fluency and confidence. Others rush through oral reading without attention to expression or comprehension, focusing only on pronunciation rather than meaning. Some students feel anxious about reading aloud, which affects their participation in class and their willingness to engage in discussions or presentations.\n\nThis comprehensive lesson will teach you proven techniques for both silent and oral reading that successful students use throughout Ghana and beyond. You will learn how to adjust your silent reading speed based on your purpose - skimming for general ideas, scanning for specific information, or reading carefully for deep understanding. You will discover strategies for improving comprehension while reading silently, including visualization, summarization, questioning, and connection-making techniques that keep your mind actively engaged with the text.\n\nFor oral reading, you will practice techniques for planning your delivery, marking text for emphasis and pacing, projecting your voice clearly, using appropriate facial expressions and gestures, and handling difficult words or pronunciation challenges gracefully. You will learn how to match your reading style to different types of texts - reading narrative stories with character voices and emotional expression, presenting factual information with clarity and authority, or delivering poetry with rhythm and feeling.\n\nThe lesson includes extensive practice opportunities with passages drawn from Ghanaian literature, current events, BECE past questions, and everyday texts that reflect your real-world reading experiences. You will work individually to build silent reading stamina and speed, practice with partners to develop oral reading confidence, and participate in group activities that combine both skills. Regular self-assessment tools will help you track your progress and identify areas where you need additional practice or support.\n\nBy mastering both silent and oral reading skills, you will become a more versatile, confident, and effective communicator. These skills will serve you well in senior secondary school, university, professional careers, and community leadership roles. Whether you aspire to become a teacher, nurse, engineer, journalist, politician, or entrepreneur, strong reading abilities will help you learn continuously, communicate persuasively, and contribute meaningfully to Ghana\'s development and progress.',
                keyConcepts: [
                  { 
                    title: '1. Understanding Silent Reading', 
                    content: 'Silent reading is the process of reading text mentally without speaking the words aloud, allowing for faster processing, deeper concentration, and flexible pace adjustment.\n\nKey Characteristics:\n- No vocalization or lip movement\n- Faster processing speed than oral reading\n- Private comprehension process\n- Ability to pause, reread, and reflect without disturbing others\n- Mental engagement with text through visualization and connection-making\n\nWhen to Use Silent Reading:\n- Studying textbooks and notes for examinations\n- Answering comprehension questions during tests\n- Reading for pleasure during free time\n- Research and information gathering\n- Reviewing written work before submission\n- Reading instructions, forms, and personal correspondence' 
                  },
                  { 
                    title: '2. Silent Reading Strategies for Academic Success', 
                    content: 'Effective silent reading requires specific techniques that improve both speed and comprehension for different academic purposes.\n\nSpeed Adjustment Techniques:\n- Skimming: Reading quickly for general ideas and main points\n- Scanning: Searching rapidly for specific information, dates, names, or facts\n- Intensive Reading: Reading slowly and carefully for complete understanding\n- Extensive Reading: Reading for pleasure and general comprehension\n\nComprehension Strategies:\n- Preview titles, headings, and pictures before reading\n- Ask questions about the content as you read\n- Visualize scenes, characters, and concepts in your mind\n- Make connections to prior knowledge and personal experience\n- Pause periodically to summarize what you have learned\n- Identify and clarify confusing sections through rereading' 
                  },
                  { 
                    title: '3. Understanding Oral Reading and Fluency', 
                    content: 'Oral reading involves speaking written text aloud with clarity, expression, and appropriate pacing to communicate meaning effectively to listeners.\n\nComponents of Reading Fluency:\n- Accuracy: Pronouncing words correctly and recognizing them quickly\n- Rate: Reading at an appropriate speed that maintains comprehension\n- Expression: Using intonation, emphasis, and emotion to convey meaning\n- Volume: Speaking loudly enough for all listeners to hear clearly\n- Pacing: Adjusting speed for punctuation, dialogue, and text difficulty\n\nBenefits of Oral Reading:\n- Improves pronunciation and speaking confidence\n- Develops listening skills in audience members\n- Enhances comprehension through auditory processing\n- Builds public speaking and presentation abilities\n- Strengthens memory through multi-sensory engagement' 
                  },
                  { 
                    title: '4. Oral Reading Techniques and Performance Skills', 
                    content: 'Successful oral reading requires preparation, technique, and practice to engage listeners and communicate meaning effectively.\n\nPreparation Strategies:\n- Preview the text silently before reading aloud\n- Identify difficult words and practice pronunciation\n- Mark the text for pauses, emphasis, and expression\n- Understand the meaning and purpose of the passage\n- Consider your audience and adjust your delivery accordingly\n\nDelivery Techniques:\n- Stand or sit with good posture for clear voice projection\n- Make eye contact with listeners when possible\n- Use appropriate facial expressions and gestures\n- Vary your tone and pace to match the content\n- Pause at punctuation marks and for emphasis\n- Speak clearly and articulate consonants and vowels\n- Project your voice to reach all listeners without shouting' 
                  },
                  { 
                    title: '5. Reading Different Text Types Effectively', 
                    content: 'Different types of texts require specific reading approaches and techniques for optimal comprehension and delivery.\n\nNarrative Texts (Stories, Novels, Folk Tales):\n- Silent: Read for plot, character development, and theme\n- Oral: Use different voices for characters and emotional expression\n\nInformational Texts (Textbooks, Articles, Reports):\n- Silent: Focus on main ideas, supporting details, and factual accuracy\n- Oral: Read with authority and clarity, emphasizing key points\n\nPoetry and Literary Texts:\n- Silent: Pay attention to rhythm, imagery, and figurative language\n- Oral: Emphasize meter, rhyme, and emotional content\n\nProcedural Texts (Instructions, Directions):\n- Silent: Read step-by-step for complete understanding\n- Oral: Read slowly and clearly with emphasis on sequence\n\nPersuasive Texts (Speeches, Editorials, Arguments):\n- Silent: Analyze reasoning, evidence, and bias\n- Oral: Use conviction and emphasis to convey the author\'s intent' 
                  },
                  { 
                    title: '6. Developing Reading Speed and Stamina', 
                    content: 'Reading efficiency improves with practice, proper technique, and gradual increase in both speed and endurance.\n\nBuilding Silent Reading Speed:\n- Avoid subvocalization (saying words in your head)\n- Use peripheral vision to read word groups rather than individual words\n- Minimize regression (going back to reread unnecessarily)\n- Practice with gradually increasing time limits\n- Read regularly to build vocabulary and pattern recognition\n\nBuilding Reading Stamina:\n- Start with shorter texts and gradually increase length\n- Take brief breaks during long reading sessions\n- Maintain good posture and proper lighting\n- Set realistic goals for daily reading practice\n- Track progress to stay motivated\n\nBalancing Speed and Comprehension:\n- Adjust reading rate based on text difficulty and purpose\n- Slow down for complex or important information\n- Speed up for familiar topics or review material\n- Use comprehension checks to ensure understanding' 
                  },
                  { 
                    title: '7. Overcoming Reading Anxiety and Building Confidence', 
                    content: 'Many students experience nervousness about reading aloud, but specific strategies can build confidence and reduce anxiety.\n\nCommon Reading Anxieties:\n- Fear of mispronouncing words in front of classmates\n- Worry about reading too slowly or quickly\n- Concern about understanding the meaning correctly\n- Nervousness about voice quality or volume\n- Anxiety about making mistakes or forgetting words\n\nConfidence-Building Strategies:\n- Practice reading aloud privately before performing publicly\n- Start with familiar, shorter texts and gradually progress\n- Focus on meaning and expression rather than perfection\n- Use positive self-talk and visualization techniques\n- Request constructive feedback from teachers and peers\n- Record yourself reading to identify strengths and areas for improvement\n\nRecovery Techniques for Mistakes:\n- Stay calm and continue reading without drawing attention to errors\n- Self-correct naturally if you notice a mistake\n- Ask for help with pronunciation if genuinely confused\n- Remember that making mistakes is part of the learning process' 
                  },
                  { 
                    title: '8. Technology and Modern Reading Applications', 
                    content: 'Modern technology offers tools and resources that can enhance both silent and oral reading skills when used appropriately.\n\nDigital Reading Tools:\n- Audio books for modeling fluent oral reading\n- Text-to-speech software for pronunciation practice\n- Speed reading applications for building silent reading efficiency\n- Online dictionaries for immediate vocabulary support\n- Reading comprehension apps with immediate feedback\n\nBenefits of Technology Integration:\n- Immediate access to pronunciation guides and definitions\n- Ability to adjust text size and spacing for comfort\n- Recording capabilities for self-assessment and practice\n- Access to diverse texts from around the world\n- Interactive features that engage multiple senses\n\nBalancing Digital and Traditional Reading:\n- Use print texts for focused, deep reading sessions\n- Employ digital tools for skill practice and reinforcement\n- Maintain regular practice with both formats\n- Be aware of potential distractions in digital environments\n- Develop skills that transfer across all reading platforms' 
                  },
                ],
                activities: { 
                  type: 'exercises', 
                  questions: [
                    { 
                      type: 'silent_reading_speed_test', 
                      question: '**Exercise 1: Silent Reading Speed and Comprehension Assessment**\n\nRead this passage silently and time yourself:\n\n"The annual Damba Festival in Northern Ghana celebrates the birth of Prophet Mohammed and brings together communities from across the three northern regions. During the festival, traditional drummers perform complex rhythms on talking drums called "lunga," while horsemen in colorful regalia demonstrate their riding skills through elaborate displays. Community members wear traditional smocks and kente cloth, and elders share oral histories that connect younger generations to their ancestral heritage. The festival also features communal meals where families prepare traditional foods like tuo zaafi, dawadawa, and shea butter dishes that have been passed down through centuries of cultural practice."\n\nTasks:\n1. Record your reading time in seconds.\n2. Without looking back, write down the main idea in one sentence.\n3. List three specific cultural elements mentioned in the passage.\n4. Calculate your reading speed: (Number of words ÷ time in seconds) × 60 = words per minute.\n\n**Assessment Criteria:** Good silent reading speed for JHS students is 120-180 words per minute with 80% comprehension accuracy.' 
                    },
                    { 
                      type: 'oral_reading_preparation', 
                      question: '**Exercise 2: Oral Reading Preparation and Marking**\n\nPrepare this passage for oral reading by marking it appropriately:\n\n"The headteacher stood before the assembled students. His voice was firm but kind as he announced the new library rules. \'From today,\' he said slowly, \'every student must return books within two weeks. Late returns will result in a fine of fifty pesewas per day. However, students who return books early will receive extra library privileges.\' The students listened carefully, understanding that these changes would help everyone access books more fairly."\n\nMarking Instructions:\n1. Use / for short pauses and // for longer pauses.\n2. Underline words that need emphasis.\n3. Mark dialogue with different voice indicators.\n4. Note where to change pace or volume.\n\nThen practice reading aloud with expression, paying attention to your marked cues.' 
                    },
                    { 
                      type: 'fluency_building_ladder', 
                      question: '**Exercise 3: Fluency Building with Repeated Readings**\n\nPractice this tongue-twister and proverb sequence to improve pronunciation and fluency:\n\n1. "Six sick slick slim sycamore saplings" (repeat 3 times, increasing speed)\n2. "The wise spider spun a spectacular web" (focus on clear consonants)\n3. Akan Proverb: "Obi nkyere abofra Nyame" (practice pronunciation if familiar)\n4. "Knowledge without practice is like a tree without fruit" (emphasize meaning)\n\nProcess:\n- First reading: Focus only on accuracy\n- Second reading: Add appropriate pace\n- Third reading: Include expression and emphasis\n- Fourth reading: Combine accuracy, pace, and expression fluently\n\nSelf-Assessment: Rate yourself 1-5 on accuracy, pace, and expression for each reading.' 
                    },
                    { 
                      type: 'comprehension_monitoring', 
                      question: '**Exercise 4: Active Silent Reading with Monitoring**\n\nRead this passage and practice active comprehension monitoring:\n\n"The Ghana Education Service recently introduced new guidelines for school feeding programs across all public basic schools. The initiative aims to provide nutritious local meals that support both student health and local agriculture. Schools must now source at least 60% of their food ingredients from local farmers within a 50-kilometer radius. This policy creates employment for rural farmers while ensuring students receive fresh, culturally appropriate meals like rice and beans, plantain and kontomire stew, or gari and groundnut soup."\n\nActive Reading Tasks:\n1. After each sentence, ask yourself: "What did I just learn?"\n2. Identify any confusing words and try to determine meaning from context.\n3. Make connections: How does this relate to your school\'s feeding program?\n4. Predict: What challenges might schools face implementing this policy?\n5. Summarize the entire passage in exactly 25 words.\n\n**Purpose:** This exercise teaches you to read actively rather than passively, improving both comprehension and retention.' 
                    },
                    { 
                      type: 'paired_reading_collaboration', 
                      question: '**Exercise 5: Partner Reading and Feedback**\n\nWork with a classmate for this collaborative exercise:\n\nPassage: "The Kakum National Park canopy walkway stretches 350 meters through the forest, offering visitors a unique perspective of Ghana\'s rainforest ecosystem. Suspended 30 meters above the ground, the walkway provides access to the upper forest layers where different plants and animals live. Tourists from around the world visit this conservation area to learn about biodiversity protection and sustainable tourism practices that benefit local communities."\n\nPartner Activity Steps:\n1. Partner A reads the passage aloud while Partner B listens and takes notes.\n2. Partner B provides feedback on pace, clarity, and expression.\n3. Partner A reads the same passage silently while Partner B times the reading.\n4. Switch roles and repeat with a different passage.\n5. Discuss which reading mode felt more comfortable and why.\n\nFeedback Focus: Volume, pace, expression, accuracy, and audience engagement.' 
                    },
                    { 
                      type: 'text_type_adaptation', 
                      question: '**Exercise 6: Reading Different Text Types**\n\nPractice adapting your reading style for different text types:\n\n**Text A (Narrative):** "Ama rushed through the rain, clutching her school bag tightly. \'I cannot be late again!\' she whispered to herself as thunder rumbled overhead."\n\n**Text B (Informational):** "The water cycle consists of three main processes: evaporation, condensation, and precipitation. These processes work together to distribute water throughout the Earth\'s systems."\n\n**Text C (Poetry):** "The palm tree dances in the breeze, / Its fronds whisper ancient stories, / Of ancestors who once found peace / Beneath its shade through seasons\' glories."\n\nTasks:\n1. Read each text silently first, noting the different purposes and styles.\n2. Practice reading each aloud with appropriate expression for its type.\n3. Explain how your reading approach differed for each text.\n4. Identify which text type you find most challenging and why.\n\n**Learning Goal:** Develop flexibility in reading approach based on text characteristics and purpose.' 
                    },
                    { 
                      type: 'performance_showcase', 
                      question: '**Exercise 7: Reading Performance and Self-Evaluation**\n\nPrepare and perform a 2-minute oral reading presentation:\n\n**Choose one option:**\nA) A folk tale or traditional story from your region\nB) A news article about a positive development in Ghana\nC) A poem by a Ghanaian author\nD) An inspirational speech or quote\n\nPreparation Steps:\n1. Select your text and practice reading it silently multiple times.\n2. Research any unfamiliar words or cultural references.\n3. Mark your text for pauses, emphasis, and expression.\n4. Practice with timing to stay within the 2-minute limit.\n5. Rehearse in front of a mirror or family member.\n\nPerformance Elements:\n- Clear introduction of your chosen text and why you selected it\n- Confident oral reading with appropriate expression\n- Eye contact and engagement with your audience\n- Brief conclusion explaining what the text means to you\n\nSelf-Evaluation Questions:\n- Did I prepare thoroughly and practice adequately?\n- Was my voice clear and loud enough for all listeners?\n- Did I convey the meaning and emotion of the text effectively?\n- How did I handle any mistakes or difficult words?\n- What would I do differently in my next oral reading performance?' 
                    },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'BECE-Style Question 1 (Silent vs. Oral Reading Benefits):\n\nExplain two advantages of silent reading and two advantages of oral reading. Give a specific example of when you would use each type of reading in your daily school life.\n\n[4 marks]', 
                    solution: 'Silent Reading Advantages:\n1. Faster processing speed allows you to read more content in less time, which is essential during examinations when time is limited.\n2. Better concentration because there are no distractions from speaking or listening to others, helping you understand complex passages more deeply.\n\nOral Reading Advantages:\n1. Improves pronunciation and speaking confidence, which is important for class participation and oral examinations.\n2. Helps others learn by sharing information aloud, making it useful for group study and presentations.\n\nExamples:\n- Silent Reading: Reading comprehension passages during the BECE English examination to answer questions quickly and accurately.\n- Oral Reading: Reading a Social Studies report aloud to your project group so everyone can hear and discuss the findings together.\n\n[4 marks: 1 mark each for advantages, examples must be specific and realistic]' 
                  },
                  { 
                    question: 'Reading Fluency Assessment (BECE 2019 Adapted):\n\nWhat does "reading fluency" mean, and why is it important for academic success? Name two specific techniques that can help a student improve their oral reading fluency.\n\n[4 marks]', 
                    solution: 'Reading Fluency Definition:\nReading fluency is the ability to read text accurately, at an appropriate pace, and with proper expression that conveys the meaning to listeners. It combines correct pronunciation, good speed, and expressive delivery.\n\nImportance for Academic Success:\nFluent reading improves comprehension because students can focus on understanding meaning rather than struggling with individual words. It also builds confidence for class participation, presentations, and oral examinations.\n\nTwo Techniques for Improvement:\n1. Repeated reading practice: Reading the same passage multiple times until it becomes smooth and natural, focusing first on accuracy, then speed, then expression.\n2. Modeling and echo reading: Listening to fluent readers (teachers, audio recordings) and then practicing the same passage to copy their pace, expression, and pronunciation.\n\n[1 mark for definition, 1 mark for importance, 2 marks for techniques with clear explanations]' 
                  },
                  { 
                    question: 'Practical Application (BECE 2020 Style):\n\nYour English teacher has asked you to read a poem aloud during the next class. You are nervous about making mistakes. Describe three specific steps you would take to prepare for this oral reading task.\n\n[6 marks]', 
                    solution: 'Three Preparation Steps:\n\n1. Silent Practice and Understanding:\nFirst, I would read the poem silently several times to understand its meaning, identify the theme, and note any difficult words. I would look up unfamiliar words in a dictionary and practice pronouncing them correctly. Understanding the poem\'s message helps me read with appropriate emotion and expression.\n\n2. Text Marking and Planning:\nNext, I would mark my copy of the poem with reading cues: slash marks (/) for short pauses, double slashes (//) for longer pauses, underlining for words that need emphasis, and notes about where to change my tone or pace. I would also plan where to make eye contact with the audience and where to use gestures.\n\n3. Rehearsal and Timing:\nFinally, I would practice reading the poem aloud multiple times, first focusing on accuracy, then adding appropriate pace, and finally including expression and emotion. I would time my reading to ensure it fits within any time limits and practice in front of a mirror or family member to build confidence and receive feedback.\n\n[2 marks each for detailed, practical steps that demonstrate understanding of effective preparation strategies]' 
                  },
                  { 
                    question: 'Reading Speed and Comprehension (BECE 2021 Inspired):\n\nExplain why reading speed should change depending on your purpose for reading. Give three different reading purposes and the appropriate speed for each.\n\n[6 marks]', 
                    solution: 'Why Reading Speed Should Change:\nReading speed should adjust to match your purpose because different goals require different levels of attention and detail. Reading too fast may cause you to miss important information, while reading too slowly wastes time when you only need general ideas.\n\nThree Reading Purposes and Appropriate Speeds:\n\n1. Skimming for Main Ideas (Fast Speed):\nPurpose: Getting a general overview of a newspaper article or textbook chapter to decide if it\'s relevant.\nSpeed: Very fast, focusing only on headings, first sentences, and key words to understand the basic topic and main points.\n\n2. Studying for Examinations (Slow Speed):\nPurpose: Learning and memorizing detailed information from notes or textbooks for a test.\nSpeed: Slow and careful, pausing to think about each concept, taking notes, and rereading difficult sections to ensure complete understanding.\n\n3. Scanning for Specific Information (Variable Speed):\nPurpose: Finding a particular fact, date, name, or answer in a text.\nSpeed: Very fast while looking for the target information, then slow when you find the relevant section to read it carefully.\n\n[2 marks each: 1 for purpose identification, 1 for appropriate speed explanation with reasoning]' 
                  },
                  { 
                    question: 'Text Type Reading (BECE 2022 Style):\n\nCompare how you would read a folk tale aloud versus how you would read a set of science experiment instructions aloud. Explain two specific differences in your reading approach.\n\n[4 marks]', 
                    solution: 'Two Specific Differences in Reading Approach:\n\n1. Expression and Voice Variation:\n- Folk Tale: Use different character voices, vary tone to show emotions (excitement, fear, joy), and include dramatic pauses to build suspense and keep listeners engaged. The goal is entertainment and emotional connection.\n- Science Instructions: Use a clear, steady, authoritative voice without dramatic variation. Maintain consistent pace and volume to ensure all listeners can follow the steps accurately. The goal is clarity and precision.\n\n2. Pace and Emphasis:\n- Folk Tale: Vary the pace throughout the story—slow for mysterious parts, fast for exciting action, pause for dramatic effect at key moments. Emphasize descriptive words and dialogue to bring the story to life.\n- Science Instructions: Read slowly and deliberately, emphasizing safety warnings, measurements, and sequential order words (first, next, then, finally). Pause between steps to allow listeners to process and prepare for the next instruction.\n\n[2 marks each for clearly explained differences that show understanding of how text purpose affects oral reading approach]' 
                  },
                  { 
                    question: 'Self-Assessment and Improvement (BECE 2018 Adapted):\n\nAfter reading a passage aloud in class, your teacher says you need to work on "reading with expression." What does this feedback mean, and suggest two practical ways you could improve this skill.\n\n[4 marks]', 
                    solution: 'What "Reading with Expression" Means:\n"Reading with expression" means using your voice, tone, pace, and emphasis to convey the meaning and emotion of the text to your listeners. It involves varying your voice to match the content instead of reading in a flat, monotone manner that sounds robotic or disinterested.\n\nTwo Practical Ways to Improve:\n\n1. Practice with Different Emotions:\nRead the same sentence or paragraph multiple times, each time imagining different emotions (happy, sad, excited, serious, angry). Notice how your voice naturally changes pitch, speed, and volume when you feel different emotions. Then apply this awareness when reading texts that contain emotional content.\n\n2. Listen to and Copy Good Models:\nListen to skilled readers such as radio presenters, audiobook narrators, or your teacher reading aloud. Pay attention to how they use pauses, emphasis, and voice changes to make the text interesting. Practice reading the same passages they read, trying to copy their expressive techniques.\n\n[2 marks for accurate explanation of expression, 2 marks for practical, actionable improvement strategies]' 
                  },
                  { 
                    question: 'Technology and Reading (BECE 2023 Style):\n\nMany students now use smartphones and tablets for reading. Compare one advantage and one disadvantage of digital reading compared to reading printed books.\n\n[4 marks]', 
                    solution: 'One Advantage of Digital Reading:\nImmediate access to word definitions and pronunciation guides through built-in dictionaries and text-to-speech features. When you encounter an unfamiliar word while reading digitally, you can tap it to see the definition instantly without interrupting your reading flow to find a physical dictionary.\n\nOne Disadvantage of Digital Reading:\nIncreased distractions from notifications, advertisements, and the temptation to switch to other apps or websites. These interruptions can break your concentration and reduce comprehension compared to reading a printed book where your attention remains focused solely on the text.\n\nExplanation:\nWhile digital tools can enhance learning through immediate support features, they require strong self-discipline to avoid distractions. Successful readers learn to use both digital and print formats appropriately based on their reading goals and environment.\n\n[2 marks for clear advantage with explanation, 2 marks for clear disadvantage with explanation]' 
                  },
                  { 
                    question: 'Reading Anxiety Management (BECE 2017 Inspired):\n\nMany students feel nervous when asked to read aloud in class. Explain two reasons why students might feel this anxiety and suggest one strategy to help overcome it.\n\n[4 marks]', 
                    solution: 'Two Reasons for Reading Anxiety:\n\n1. Fear of Making Pronunciation Mistakes:\nStudents worry about mispronouncing words in front of classmates, especially unfamiliar names, technical terms, or English words with complex spelling patterns. They fear that mistakes will cause embarrassment or laughter from peers.\n\n2. Lack of Confidence in Reading Speed or Fluency:\nSome students feel their reading is too slow, too fast, or lacks smoothness compared to their classmates. They worry that their performance will be judged negatively by the teacher and other students, affecting their self-esteem.\n\nOne Strategy to Overcome Anxiety:\nPractice reading aloud privately before performing publicly. Students can rehearse the same passage multiple times at home, record themselves to identify areas for improvement, and gradually build confidence through repeated practice. This preparation reduces anxiety because students feel more prepared and familiar with the text.\n\n[2 marks for realistic reasons, 2 marks for practical, helpful strategy with explanation]' 
                  },
                  { 
                    question: 'Cultural Connection (Ghana-Specific):\n\nExplain how both silent and oral reading skills connect to traditional Ghanaian cultural practices. Give one example for each reading type.\n\n[4 marks]', 
                    solution: 'Silent Reading Connection to Ghanaian Culture:\nSilent reading skills help Ghanaians stay informed about community developments, government policies, and cultural events through newspapers like the Daily Graphic or Ghanaian Times. Reading these publications silently allows individuals to learn about national issues, traditional festival announcements, and local news that affect their families and communities.\n\nExample: A father reading the newspaper silently to learn about new educational policies that might affect his children\'s schooling, or checking announcements about upcoming traditional festivals in his region.\n\nOral Reading Connection to Ghanaian Culture:\nOral reading skills are essential for participating in religious services, traditional ceremonies, and community meetings where reading scriptures, proverbs, or official announcements aloud is expected. These skills help preserve and share cultural knowledge across generations.\n\nExample: An elder reading traditional Akan proverbs aloud during a family gathering to teach younger members about cultural wisdom, or a church member reading Bible verses during Sunday service to share spiritual messages with the congregation.\n\n[2 marks each for accurate cultural connections with realistic, specific examples that demonstrate understanding of how reading skills serve cultural participation]' 
                  },
                  { 
                    question: 'BECE Examination Strategy:\n\nDuring the BECE English Language examination, you have 45 minutes to read a comprehension passage and answer questions. Explain how you would use both silent reading skills and time management to maximize your performance.\n\n[6 marks]', 
                    solution: 'Silent Reading Strategy for BECE Success:\n\n1. Initial Skim Reading (3-5 minutes):\nFirst, I would quickly skim the passage to identify the topic, main idea, and general structure without worrying about details. This gives me a mental framework for understanding the content and helps me predict what types of questions might be asked.\n\n2. Question Preview (2-3 minutes):\nNext, I would read all the comprehension questions carefully before returning to the passage. This tells me exactly what information to look for during my detailed reading, making my reading more focused and efficient.\n\n3. Targeted Intensive Reading (15-20 minutes):\nThen I would read the passage slowly and carefully, paying special attention to sections that relate to the questions I previewed. I would underline or mark key information, names, dates, and main points that are likely to be tested.\n\n4. Answer Location and Verification (15-20 minutes):\nFinally, I would answer each question by returning to the relevant sections of the passage to find specific evidence. I would read those sections again if necessary to ensure my answers are accurate and complete.\n\nTime Management Benefits:\nThis approach ensures I use my silent reading skills strategically rather than randomly, saving time by avoiding unnecessary rereading while maintaining high accuracy through careful verification.\n\n[6 marks: 2 for strategy explanation, 2 for time allocation, 2 for clear reasoning about effectiveness]' 
                  },
                  { 
                    question: 'Reading Improvement Plan:\n\nCreate a personal reading improvement plan. Identify one area where you need to improve (either silent or oral reading) and describe three specific actions you will take over the next month to develop this skill.\n\n[6 marks]', 
                    solution: 'Personal Reading Improvement Plan:\n\nArea for Improvement: Oral Reading Confidence and Expression\nI need to improve my confidence when reading aloud in class and develop better expression to make my reading more engaging for listeners.\n\nThree Specific Actions:\n\n1. Daily Practice Routine (Week 1-4):\nI will spend 15 minutes every evening reading aloud to my family members, starting with familiar stories and gradually progressing to more challenging texts. I will ask for feedback on my pace, volume, and expression, and practice incorporating their suggestions.\n\n2. Recording and Self-Assessment (Week 2-4):\nI will use my phone to record myself reading different types of texts (stories, poems, news articles) and listen to these recordings to identify areas for improvement. I will compare my later recordings to earlier ones to track my progress and celebrate improvements.\n\n3. Peer Practice Partnership (Week 3-4):\nI will partner with a classmate for weekly oral reading practice sessions where we take turns reading to each other and providing constructive feedback. We will practice with BECE past question passages to prepare for examinations while building confidence.\n\nExpected Outcome:\nBy the end of the month, I should feel more comfortable reading aloud in class and be able to use appropriate expression that helps listeners understand and enjoy the text.\n\n[6 marks: 1 for realistic area identification, 2 marks each for specific, actionable improvement strategies, 1 for realistic outcome expectation]' 
                  },
                  { 
                    question: 'Advanced Application Question:\n\nYou are chosen to represent your school in an inter-school reading competition. The competition has two parts: silent reading comprehension and oral reading performance. How would you prepare for both parts to maximize your chances of success?\n\n[8 marks]', 
                    solution: 'Preparation for Inter-School Reading Competition:\n\nSilent Reading Comprehension Preparation:\n\n1. Speed and Accuracy Training:\nI would practice daily with timed reading exercises, starting with familiar passages and gradually increasing difficulty. I would track my reading speed and comprehension accuracy to identify my optimal pace that balances speed with understanding.\n\n2. Question Type Mastery:\nI would study different types of comprehension questions (literal, inferential, vocabulary, critical) using BECE past papers and practice identifying what each question type requires. I would learn to preview questions before reading to focus my attention on relevant information.\n\n3. Strategy Practice:\nI would master techniques like skimming for main ideas, scanning for specific details, and intensive reading for complete understanding. I would practice switching between these strategies based on question requirements.\n\nOral Reading Performance Preparation:\n\n1. Text Selection and Analysis:\nI would choose a compelling passage (story, poem, or speech) and analyze its meaning, themes, and emotional content thoroughly. I would research any cultural references or difficult words to ensure complete understanding.\n\n2. Performance Technique Development:\nI would practice voice projection, pace variation, and expressive delivery. I would mark my text for pauses, emphasis, and tone changes, then rehearse extensively to make these techniques natural and confident.\n\n3. Audience Engagement:\nI would practice maintaining eye contact, using appropriate gestures, and connecting with listeners emotionally. I would perform for family and friends to build confidence and receive feedback on my delivery.\n\nFinal Preparation:\nI would combine both skills by practicing reading passages silently for comprehension and then performing sections orally to demonstrate complete mastery of the text.\n\n[8 marks: 4 for silent reading preparation strategies, 4 for oral reading preparation strategies, with clear, practical steps for each]' 
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'Which statement best describes the main difference between silent and oral reading?',
                    options: [
                      'Silent reading is always faster while oral reading is always more accurate',
                      'Silent reading involves processing text mentally without vocalization while oral reading involves speaking words aloud for others to hear',
                      'Silent reading is only for entertainment while oral reading is only for academic purposes',
                      'Silent reading requires no comprehension while oral reading requires perfect understanding'
                    ],
                    answer: 'Silent reading involves processing text mentally without vocalization while oral reading involves speaking words aloud for others to hear',
                    explanation: 'The fundamental difference is the presence or absence of vocalization. Silent reading is mental processing without speaking, while oral reading involves speaking the words aloud. Both can be used for various purposes and both require comprehension, though they serve different functions.'
                  },
                  {
                    type: 'mcq',
                    question: 'When would skimming be the most appropriate silent reading strategy?',
                    options: [
                      'When studying detailed notes before an important examination',
                      'When reading a newspaper to get a general overview of the day\'s main stories',
                      'When following step-by-step science experiment instructions',
                      'When reading a BECE comprehension passage to answer specific questions'
                    ],
                    answer: 'When reading a newspaper to get a general overview of the day\'s main stories',
                    explanation: 'Skimming is used to quickly get the main ideas and general overview of content. Reading a newspaper for general awareness is perfect for skimming, while the other options require careful, detailed reading for specific information or complete understanding.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which component is most essential for effective oral reading fluency?',
                    options: [
                      'Reading as quickly as possible without any pauses',
                      'Memorizing the entire text before attempting to read it aloud',
                      'Combining accurate pronunciation, appropriate pace, and meaningful expression',
                      'Using the same tone and volume throughout the entire reading'
                    ],
                    answer: 'Combining accurate pronunciation, appropriate pace, and meaningful expression',
                    explanation: 'Reading fluency requires the integration of accuracy (correct pronunciation), appropriate rate (suitable speed), and prosody (meaningful expression). It\'s not about speed alone, memorization, or monotone delivery, but about smooth, expressive reading that conveys meaning.'
                  },
                  {
                    type: 'mcq',
                    question: 'What should you do first when preparing to read a text aloud in class?',
                    options: [
                      'Start reading immediately without any preparation to appear confident',
                      'Read the text silently to understand its meaning and identify difficult words',
                      'Ask the teacher to explain every word in the passage before reading',
                      'Copy the entire passage into your notebook word for word'
                    ],
                    answer: 'Read the text silently to understand its meaning and identify difficult words',
                    explanation: 'Preparation is crucial for effective oral reading. Silent prereading helps you understand the content, identify challenging words, and plan your delivery. This preparation leads to more confident and fluent oral reading performance.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which reading approach would be most effective for a BECE comprehension examination?',
                    options: [
                      'Read the passage once very quickly and then answer all questions from memory',
                      'Preview the questions, read the passage carefully, then locate specific evidence for each answer',
                      'Answer the questions first, then read the passage to check if your guesses were correct',
                      'Read only the first and last paragraphs, then guess the answers to save time'
                    ],
                    answer: 'Preview the questions, read the passage carefully, then locate specific evidence for each answer',
                    explanation: 'This systematic approach maximizes both efficiency and accuracy. Previewing questions gives you a reading purpose, careful reading ensures comprehension, and locating evidence ensures accurate answers based on the text rather than memory or guessing.'
                  },
                  {
                    type: 'mcq',
                    question: 'How should your oral reading style change when reading different types of texts?',
                    options: [
                      'Use exactly the same pace and expression for all texts to maintain consistency',
                      'Always read as loudly as possible regardless of the text content',
                      'Adapt your pace, tone, and expression to match the purpose and style of each text type',
                      'Only focus on pronunciation and ignore the meaning of different text types'
                    ],
                    answer: 'Adapt your pace, tone, and expression to match the purpose and style of each text type',
                    explanation: 'Effective oral readers adjust their delivery based on text characteristics. Stories need character voices and emotion, informational texts need clear authority, poems need rhythm and feeling, and instructions need slow clarity. Adaptation shows comprehension and engages listeners appropriately.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the most effective way to build silent reading speed while maintaining comprehension?',
                    options: [
                      'Skip every other word to increase speed and guess the meaning',
                      'Read everything as fast as possible without stopping to think about meaning',
                      'Practice regularly with gradually increasing difficulty and time goals while checking understanding',
                      'Only read very short passages to avoid getting tired'
                    ],
                    answer: 'Practice regularly with gradually increasing difficulty and time goals while checking understanding',
                    explanation: 'Effective speed building requires systematic practice that balances speed gains with comprehension maintenance. Gradual increases, regular practice, and comprehension checks ensure that speed improvements don\'t sacrifice understanding, which is the ultimate goal of reading.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which strategy best helps overcome nervousness when reading aloud?',
                    options: [
                      'Avoid eye contact with listeners and read as quickly as possible to finish sooner',
                      'Practice the text multiple times privately before performing publicly',
                      'Ask someone else to read instead of attempting it yourself',
                      'Focus only on perfect pronunciation and ignore expression completely'
                    ],
                    answer: 'Practice the text multiple times privately before performing publicly',
                    explanation: 'Preparation builds confidence and reduces anxiety. Private practice allows you to become familiar with the text, work through difficult parts, and develop fluency before public performance. This preparation makes the actual reading feel more natural and confident.'
                  },
                  {
                    type: 'mcq',
                    question: 'Why is it important to adjust reading speed based on your reading purpose?',
                    options: [
                      'Because all texts are written at different difficulty levels that require different speeds',
                      'Because different purposes require different levels of attention and detail processing',
                      'Because teachers always require students to read at specific predetermined speeds',
                      'Because fast reading always leads to better comprehension than slow reading'
                    ],
                    answer: 'Because different purposes require different levels of attention and detail processing',
                    explanation: 'Reading purposes determine how much detail and attention you need to pay. Skimming for overview requires less detail than studying for exams. Scanning for specific information needs rapid searching, while analytical reading requires slow, careful thought. Matching speed to purpose optimizes efficiency and comprehension.'
                  },
                  {
                    type: 'mcq',
                    question: 'What does "reading with expression" mean in oral reading?',
                    options: [
                      'Reading very loudly so everyone can hear clearly',
                      'Using voice tone, pace, and emphasis to convey the meaning and emotion of the text',
                      'Making up your own words when you encounter difficult vocabulary',
                      'Reading very slowly to ensure perfect pronunciation of every word'
                    ],
                    answer: 'Using voice tone, pace, and emphasis to convey the meaning and emotion of the text',
                    explanation: 'Expression in oral reading means using your voice as a tool to communicate meaning beyond just words. This includes varying tone for different characters or moods, adjusting pace for excitement or suspense, and emphasizing important words or ideas to help listeners understand and engage with the content.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Silent reading is always faster than oral reading because you do not need to pronounce each word aloud.',
                    reason: 'While silent reading typically allows for faster processing than oral reading, the speed difference depends on individual skill levels, text difficulty, and reading purpose. Some beginning readers may actually comprehend better when reading aloud, and complex texts may require slow, careful reading regardless of mode.',
                    answer: 'true'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Good oral readers should never make any mistakes or ask for help with difficult words during public reading.',
                    reason: 'Making mistakes is a natural part of learning, and skilled readers know how to handle errors gracefully. Asking for help with genuinely difficult words shows good judgment and helps everyone learn. The goal is effective communication, not perfection.',
                    answer: 'false'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'When preparing for oral reading, you should mark your text with __________ to indicate where to pause and which words to emphasize.',
                    answer: 'cues',
                    explanation: 'Reading cues such as slash marks for pauses, underlines for emphasis, and voice notes help you plan your delivery and read more expressively. These markings guide your performance and help you remember where to add expression.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which activities help improve silent reading comprehension? (Select all correct answers)',
                    options: [
                      'Asking questions about the content while reading',
                      'Reading every word aloud, even during silent reading practice',
                      'Making connections between the text and your personal experience',
                      'Skipping all difficult words to maintain reading speed',
                      'Pausing periodically to summarize what you have learned'
                    ],
                    correctAnswers: [
                      'Asking questions about the content while reading',
                      'Making connections between the text and your personal experience',
                      'Pausing periodically to summarize what you have learned'
                    ],
                    explanation: 'Active reading strategies that engage your mind improve comprehension. Self-questioning keeps you alert, making personal connections helps you understand and remember content, and periodic summarizing checks your understanding. Reading aloud defeats the purpose of silent reading, and skipping difficult words reduces comprehension.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which factors contribute to effective oral reading performance? (Choose all that apply)',
                    options: [
                      'Clear pronunciation of words',
                      'Monotone delivery without any voice variation',
                      'Appropriate pacing with pauses for punctuation',
                      'Eye contact with listeners when possible',
                      'Reading as quickly as possible to save time'
                    ],
                    correctAnswers: [
                      'Clear pronunciation of words',
                      'Appropriate pacing with pauses for punctuation',
                      'Eye contact with listeners when possible'
                    ],
                    explanation: 'Effective oral reading combines clear articulation, appropriate pacing that follows punctuation and meaning, and audience engagement through eye contact. Monotone delivery fails to convey meaning and engage listeners, while excessive speed sacrifices clarity and comprehension.'
                  },
                  {
                    type: 'matching',
                    question: 'Match each reading situation to the most appropriate reading approach.',
                    pairs: [
                      { left: 'BECE comprehension examination', right: 'Careful silent reading with evidence location' },
                      { left: 'Reading a folk tale to younger children', right: 'Expressive oral reading with character voices' },
                      { left: 'Checking newspaper headlines for interesting stories', right: 'Quick skimming for main ideas' },
                      { left: 'Studying notes before a science test', right: 'Slow, intensive silent reading with note-taking' },
                    ],
                    explanation: 'Different reading situations require different approaches based on purpose and audience. Examinations need careful analysis, storytelling needs entertainment and engagement, news browsing needs efficiency, and study requires deep processing and retention.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'Explain how developing both silent and oral reading skills will help you succeed in your future education and career in Ghana. Give specific examples.',
                    answer: 'Strong silent reading skills will help me process information quickly during university studies, research projects, and professional reading of reports, policies, or technical documents. I will be able to study efficiently, understand complex texts, and stay informed about developments in my field. Effective oral reading skills will enable me to present research findings confidently, participate actively in meetings and discussions, read important information aloud to colleagues or community members, and communicate effectively in leadership roles. In Ghana specifically, these skills will help me contribute to community development through informed participation in local governance, effective communication during public meetings, and the ability to share information with others who may need assistance with reading.',
                    explanation: 'This question assesses understanding of the long-term, practical applications of reading skills. Strong answers should connect specific reading abilities to realistic future scenarios and demonstrate awareness of how literacy serves both personal advancement and community contribution in the Ghanaian context.'
                  },
                ],
                summary: 'Silent and oral reading are complementary skills that serve different purposes in academic and social contexts. Silent reading enables fast, private processing for study, examination, and personal learning, while oral reading builds communication confidence and allows sharing of information with others. Effective readers master both modes by developing appropriate strategies: speed adjustment, comprehension monitoring, and focus techniques for silent reading; preparation, expression, pacing, and audience engagement for oral reading. Regular practice with diverse text types, systematic skill-building exercises, and attention to reading fluency components (accuracy, rate, expression) lead to improved performance in both areas. Success in BECE examinations and future academic pursuits requires the flexible application of both reading modes based on specific tasks and goals. Remember that reading proficiency develops through consistent practice, constructive feedback, and gradual challenge increases rather than through rushing or avoiding difficult texts. With dedication and proper technique, both silent and oral reading become powerful tools for learning, communication, and active participation in Ghanaian society.',
              },
               {
                id: 'eng102-3',
                slug: 'summary-writing-note-taking',
                title: 'Summary Writing & Note-Taking (JHS Basics)',
                objectives: [
                  'Define summary writing and note-taking as essential academic skills for information processing and retention.',
                  'Identify the main idea, supporting details, and key concepts in various types of texts including passages, lessons, and media.',
                  'Apply systematic steps for writing concise, accurate summaries that capture essential information in your own words.',
                  'Create organized notes using different formats such as bullet points, mind maps, tables, and outlines for effective study.',
                  'Distinguish between important information and unnecessary details when processing academic content and real-world texts.',
                  'Demonstrate paraphrasing skills that maintain original meaning while using different vocabulary and sentence structures.',
                  'Use summary and note-taking skills effectively during BECE examination preparation and classroom learning.',
                  'Organize and review notes systematically to improve memory retention and academic performance across subjects.',
                  'Apply information synthesis techniques to combine ideas from multiple sources into coherent summaries and study materials.'
                ],
                introduction: 'Summary writing and note-taking are fundamental academic skills that every Ghanaian Junior High School student must master to succeed in examinations, understand complex lessons, and prepare for Senior High School challenges. Every day, you encounter large amounts of information through textbook readings, teacher explanations, educational radio programs, classroom discussions, and research activities. Without effective strategies to process, condense, and organize this information, you can quickly become overwhelmed and struggle to remember key concepts during examinations or practical applications.\n\nSummary writing is the skill of condensing longer texts into shorter versions that retain all the essential information while eliminating unnecessary details. When you write a good summary, you demonstrate that you understand the main ideas, can identify supporting evidence, and can express complex information clearly and concisely. This skill is directly tested in WAEC BECE English Language examinations, where you must summarize passages accurately within specific word limits. Beyond examinations, summary writing helps you understand newspaper articles, government policies, health information, agricultural guidelines, and community announcements that affect your daily life in Ghana.\n\nNote-taking, on the other hand, involves recording important information in a shortened, organized format that allows for quick review and efficient studying. Effective notes serve as your personal study guide, helping you review lessons before tests, prepare for oral presentations, and retain information across different subjects. Whether you are listening to a Social Studies lesson about Ghana\'s independence, following a science experiment procedure, or recording key points from a mathematics solution, good note-taking skills help you focus on essential information and avoid getting lost in unnecessary details.\n\nIn the Ghanaian education system, students who excel in summary writing and note-taking consistently perform better across all subjects because these skills support comprehension, memory, and critical thinking. During English Language lessons, summary skills help you understand literary texts, analyze characters and themes, and respond to essay questions effectively. In Social Studies, note-taking helps you organize historical facts, geographic information, and cultural knowledge that frequently appear in examination questions. For Integrated Science, these skills help you record experimental procedures, understand scientific concepts, and prepare for practical assessments.\n\nMany students struggle with these skills because they try to copy everything word-for-word instead of processing information actively. Others fail to distinguish between main ideas and supporting details, resulting in summaries that are either too long or missing essential information. Some students create disorganized notes that are difficult to review later, defeating the purpose of note-taking as a study strategy. Additionally, students often struggle with paraphrasing - expressing ideas in their own words while maintaining the original meaning - which is essential for both summary writing and effective note-taking.\n\nThe WAEC BECE consistently tests summary writing skills through specific summary questions worth significant marks. These questions typically provide a passage about relevant topics such as environmental protection, education, health, agriculture, or technology, and ask you to write a summary of specified length that captures the main points in your own words. Success in these questions requires systematic approach: careful reading, identification of key points, elimination of examples and repetitions, and clear expression in grammatically correct sentences.\n\nThis comprehensive lesson will teach you proven strategies that successful students use to master summary writing and note-taking. You will learn different reading techniques - skimming for general ideas, scanning for specific information, and intensive reading for complete understanding. You will practice identifying main ideas using topic sentences, keyword recognition, and structural analysis. You will master various note-taking formats including linear notes, mind maps, tables, charts, and the Cornell note-taking system that many universities recommend.\n\nWe will also focus extensively on paraphrasing techniques that help you express ideas in your own words without changing the original meaning. This includes using synonyms appropriately, changing sentence structures, combining or separating ideas, and maintaining logical flow. You will learn to avoid common mistakes such as changing the meaning while paraphrasing, copying text word-for-word, or including personal opinions in objective summaries.\n\nThe lesson includes practical applications with texts drawn from Ghanaian contexts - newspaper articles about local development projects, excerpts from government speeches, passages about traditional practices, and educational content that reflects your lived experiences. You will practice summarizing different types of texts including narrative stories, informational articles, persuasive essays, and procedural instructions, each requiring slightly different approaches and emphasis.\n\nYou will also learn advanced techniques such as synthesis - combining information from multiple sources into coherent summaries - which is increasingly important for research projects and higher-level academic work. This skill will prepare you for Senior High School and university studies where you must integrate information from various textbooks, articles, and lectures into comprehensive understanding.\n\nBy the end of this lesson, you will have practical strategies for taking effective notes during lessons, creating useful study materials, writing accurate summaries under time pressure, and organizing information for long-term retention. These skills will serve you well beyond school, helping you stay informed about community issues, understand official documents, participate effectively in workplace training, and continue learning throughout your life. Remember that summary writing and note-taking are skills that improve with practice and application across different subjects and contexts.',
                keyConcepts: [
                  { 
                    title: '1. Understanding Summary Writing', 
                    content: 'Summary writing is the process of condensing longer texts into shorter versions that preserve all essential information while eliminating unnecessary details, examples, and repetitions.\n\nKey Principles of Summary Writing:\n- Capture the main idea and most important supporting points\n- Use your own words rather than copying directly from the source\n- Maintain the original meaning and author\'s intent\n- Follow specified word or sentence limits\n- Organize information logically and coherently\n- Avoid adding personal opinions or interpretations\n\nTypes of Information to Include:\n- Main idea or central argument\n- Key supporting evidence or reasons\n- Important facts, dates, or statistics\n- Cause and effect relationships\n- Conclusions or recommendations\n\nTypes of Information to Exclude:\n- Specific examples and illustrations\n- Repetitive statements\n- Minor details and tangential information\n- Direct quotations and dialogue\n- Personal anecdotes or stories' 
                  },
                  { 
                    title: '2. Systematic Steps for Effective Summary Writing', 
                    content: 'Following a systematic approach ensures that your summaries are accurate, complete, and well-organized.\n\nStep 1: Initial Reading\n- Read the entire passage carefully to understand the overall topic and purpose\n- Identify the general subject matter and author\'s main argument\n- Note the text type (narrative, informational, persuasive, descriptive)\n\nStep 2: Active Analysis\n- Reread the passage, marking or underlining key sentences\n- Identify the main idea in each paragraph\n- Distinguish between main points and supporting details\n- Note connecting words that show relationships between ideas\n\nStep 3: Information Selection\n- List the most important points in order of significance\n- Group related ideas together\n- Eliminate redundant information and minor examples\n- Ensure you have captured the complete message\n\nStep 4: Drafting and Organization\n- Write the main idea in your own words as the opening sentence\n- Add supporting points in logical order\n- Use appropriate connecting words to show relationships\n- Check that your summary flows smoothly from one idea to the next\n\nStep 5: Review and Refinement\n- Ensure accuracy by comparing your summary to the original\n- Check word count and adjust if necessary\n- Verify grammar, spelling, and punctuation\n- Confirm that you have used your own words throughout' 
                  },
                  { 
                    title: '3. Note-Taking Systems and Formats', 
                    content: 'Effective note-taking requires choosing appropriate formats that match your learning style, the type of content, and your intended use for the notes.\n\nLinear Notes (Traditional Format):\n- Use headings, subheadings, and bullet points\n- Organize information hierarchically from general to specific\n- Leave white space for later additions and clarifications\n- Use numbering systems (1, 2, 3 or A, B, C) for clear organization\n\nMind Maps (Visual Format):\n- Place the main topic in the center\n- Branch out with related subtopics\n- Use colors, symbols, and images to enhance memory\n- Show connections between different concepts clearly\n\nCornell Note-Taking System:\n- Divide your page into three sections: notes, cues, and summary\n- Record main content in the largest section\n- Write key words and questions in the cue column\n- Summarize the entire page at the bottom\n\nTable/Chart Format:\n- Organize information in rows and columns\n- Compare and contrast different concepts effectively\n- Useful for categorizing information or showing relationships\n- Excellent for revision and quick reference\n\nOutline Format:\n- Use Roman numerals, letters, and numbers for hierarchy\n- Show clear relationships between main ideas and details\n- Helpful for organizing complex topics with multiple subtopics\n- Useful for planning essays and presentations' 
                  },
                  { 
                    title: '4. Paraphrasing Techniques and Strategies', 
                    content: 'Paraphrasing involves expressing the same ideas using different words and sentence structures while maintaining the original meaning.\n\nVocabulary Strategies:\n- Replace key words with appropriate synonyms\n- Use more familiar words when the original uses technical terms\n- Maintain the same level of formality as the original\n- Avoid changing specialized terms that have no suitable synonyms\n\nSentence Structure Changes:\n- Convert active voice to passive voice or vice versa\n- Combine short sentences into longer, more complex ones\n- Break long sentences into shorter, clearer statements\n- Change the order of clauses while maintaining logical flow\n\nGrammatical Transformations:\n- Change word forms (noun to verb, adjective to adverb)\n- Use different grammatical constructions to express the same ideas\n- Replace phrases with single words or vice versa\n- Use reported speech instead of direct quotations\n\nCommon Paraphrasing Mistakes to Avoid:\n- Changing only one or two words in a sentence\n- Altering the original meaning or author\'s intent\n- Adding personal opinions or interpretations\n- Using inappropriate synonyms that change the meaning\n- Creating grammatically incorrect sentences while paraphrasing' 
                  },
                  { 
                    title: '5. Identifying Main Ideas and Supporting Details', 
                    content: 'Distinguishing between main ideas and supporting details is crucial for both summary writing and effective note-taking.\n\nLocating Main Ideas:\n- Look for topic sentences, usually at the beginning or end of paragraphs\n- Identify statements that other sentences explain or support\n- Find ideas that are repeated or emphasized throughout the text\n- Notice concepts that connect different parts of the passage\n- Pay attention to concluding statements that synthesize information\n\nRecognizing Supporting Details:\n- Examples that illustrate main points\n- Statistics, facts, and data that provide evidence\n- Explanations that clarify complex concepts\n- Descriptions that add specific information\n- Anecdotes and stories that support arguments\n\nHierarchy of Information:\n- Primary ideas: The most important concepts that could stand alone\n- Secondary ideas: Important points that support primary ideas\n- Tertiary details: Specific examples, illustrations, and minor facts\n- Transition elements: Words and phrases that connect ideas\n\nSignal Words for Main Ideas:\n- "The main point is...", "Most importantly...", "The key issue..."  \n- "In conclusion...", "Therefore...", "As a result..."\n- "The central argument...", "Fundamentally...", "Essentially..."' 
                  },
                  { 
                    title: '6. Information Processing for Different Subjects', 
                    content: 'Different academic subjects require adapted approaches to summary writing and note-taking based on their unique characteristics and requirements.\n\nEnglish Language and Literature:\n- Focus on themes, character development, and literary devices\n- Include plot summaries but emphasize analysis over narrative\n- Note important quotations and their significance\n- Record connections between different texts or authors\n\nSocial Studies:\n- Organize information chronologically for historical topics\n- Include dates, names, places, and cause-effect relationships\n- Create comparison charts for different periods or regions\n- Note the significance and impact of events or policies\n\nIntegrated Science:\n- Record procedures, materials, and observations clearly\n- Include diagrams and labeled illustrations\n- Note hypotheses, results, and conclusions\n- Organize information by scientific processes or categories\n\nMathematics:\n- Focus on problem-solving steps and methods\n- Include formulas, theorems, and definitions\n- Note worked examples with clear explanations\n- Organize information by topic or difficulty level\n\nPractical Applications:\n- Record step-by-step procedures clearly\n- Include safety guidelines and important warnings\n- Note materials, tools, and time requirements\n- Organize information in logical sequence for easy reference' 
                  },
                  { 
                    title: '7. Memory and Retention Strategies', 
                    content: 'Effective summary writing and note-taking should enhance memory and support long-term retention of information.\n\nActive Processing Techniques:\n- Ask questions about the content while reading or listening\n- Make connections between new information and prior knowledge\n- Visualize concepts and create mental images\n- Discuss ideas with classmates to reinforce understanding\n\nOrganization for Memory:\n- Group related information together\n- Use consistent formatting and abbreviation systems\n- Create logical hierarchies and clear relationships\n- Include mnemonics and memory aids where appropriate\n\nReview and Reinforcement:\n- Review notes within 24 hours of taking them\n- Add clarifications and additional information as needed\n- Create summary sheets from detailed notes for quick review\n- Use notes actively for self-testing and practice questions\n\nMulti-Sensory Engagement:\n- Include visual elements such as diagrams and charts\n- Use colors and highlighting strategically\n- Read notes aloud during review sessions\n- Create physical movements or gestures for key concepts' 
                  },
                  { 
                    title: '8. Synthesis and Information Integration', 
                    content: 'Advanced summary and note-taking skills involve combining information from multiple sources to create comprehensive understanding.\n\nCombining Multiple Sources:\n- Identify common themes and ideas across different texts\n- Note areas of agreement and disagreement between sources\n- Organize information by topic rather than by source\n- Create comprehensive summaries that integrate all perspectives\n\nCritical Analysis Skills:\n- Evaluate the credibility and reliability of different sources\n- Identify bias, assumptions, and limitations in texts\n- Distinguish between facts and opinions across sources\n- Note gaps in information that require additional research\n\nSynthesis Techniques:\n- Create comparison charts that show different viewpoints\n- Write integrated summaries that combine key points from all sources\n- Develop your own conclusions based on multiple perspectives\n- Organize information to answer specific research questions\n\nApplications for Academic Success:\n- Research projects that require multiple sources\n- Exam preparation that covers material from different lessons\n- Essay writing that integrates course content with external readings\n- Problem-solving that requires knowledge from various subjects' 
                  },
                ],
                activities: { 
                  type: 'exercises',
                  questions: [
                    { 
                      type: 'summary_skills_assessment', 
                      question: '**Exercise 1: Summary Skills Assessment**\n\nRead this passage about education in Ghana:\n\n"The government of Ghana has launched the Free Senior High School (Free SHS) policy to ensure that every qualified student can access secondary education regardless of their family\'s financial situation. Under this policy, students do not pay tuition fees, and the government provides textbooks, meals, and accommodation for boarding students. The program has significantly increased enrollment numbers, with over 400,000 additional students joining SHS since the policy began. However, challenges remain, including overcrowded classrooms, shortage of qualified teachers in some regions, and the need for more infrastructure development. Despite these challenges, education experts agree that Free SHS represents a major step toward achieving universal secondary education in Ghana and improving the country\'s human resource development."\n\nTasks:\n1. Identify the main idea of the passage in one sentence.\n2. List four key supporting details.\n3. Write a 40-50 word summary in your own words.\n4. Explain what information you chose to exclude and why.\n\n**Learning Goal:** Assess your current ability to identify main ideas, select important details, and write concise summaries.' 
                    },
                    { 
                      type: 'note_taking_comparison', 
                      question: '**Exercise 2: Note-Taking Format Comparison**\n\nListen to or read a 5-minute lesson excerpt about "Traditional Ghanaian Festivals" (choose any festival you know well). Take the same information using three different formats:\n\nFormat 1: Linear bullet-point notes\nFormat 2: Mind map with the festival name in the center\nFormat 3: Table with columns for: Festival Name, Region, Purpose, Activities, Significance\n\nAfter completing all three formats:\n1. Which format took the longest time to create?\n2. Which format would be easiest to review before an exam?\n3. Which format helped you understand connections between ideas best?\n4. In what situations would you choose each format?\n\n**Learning Goal:** Experience different note-taking systems and understand when to use each format effectively.' 
                    },
                    { 
                      type: 'paraphrasing_practice', 
                      question: '**Exercise 3: Paraphrasing Challenge**\n\nPractice paraphrasing these sentences without changing the meaning:\n\nOriginal 1: "The rapid growth of technology in Ghana has transformed the way young people communicate, learn, and access information in both urban and rural communities."\n\nOriginal 2: "Traditional healers in many Ghanaian communities possess extensive knowledge about medicinal plants and continue to play important roles in healthcare delivery alongside modern medical practitioners."\n\nOriginal 3: "Climate change poses serious threats to Ghana\'s agricultural sector, particularly for small-scale farmers who depend on rainfall patterns that are becoming increasingly unpredictable."\n\nFor each sentence:\n1. Identify the main idea and key components.\n2. Write your paraphrased version using different vocabulary and sentence structure.\n3. Check that your version maintains the original meaning.\n4. Compare your paraphrases with classmates and discuss different approaches.\n\n**Learning Goal:** Develop skill in expressing ideas using your own words while preserving original meaning.' 
                    },
                    { 
                      type: 'information_hierarchy', 
                      question: '**Exercise 4: Information Hierarchy Practice**\n\nRead this passage and organize the information into a clear hierarchy:\n\n"Water pollution in Ghana affects both urban and rural communities through various sources. Industrial waste from mining and manufacturing contaminates rivers and groundwater. In cities, inadequate sewage treatment systems allow untreated waste to pollute water sources. Agricultural runoff containing fertilizers and pesticides enters streams and rivers. Plastic waste clogs waterways and creates breeding grounds for disease vectors. The consequences include increased rates of waterborne diseases such as cholera and typhoid, reduced fish populations that affect livelihoods, and higher costs for water treatment. Solutions require government action, community participation, and individual responsibility. The government must enforce environmental regulations and invest in proper waste treatment facilities. Communities can organize clean-up activities and establish waste management systems. Individuals can reduce plastic use, properly dispose of chemicals, and participate in water conservation efforts."\n\nTasks:\n1. Identify the main topic.\n2. List the major categories of information.\n3. Organize details under each major category.\n4. Create a visual outline showing the hierarchy.\n5. Explain how this organization helps with understanding and memory.\n\n**Learning Goal:** Learn to identify and organize information hierarchically for better comprehension and note-taking.' 
                    },
                    { 
                      type: 'subject_specific_notes', 
                      question: '**Exercise 5: Subject-Specific Note-Taking**\n\nPractice taking notes for different subjects using appropriate techniques:\n\n**Science Experiment:** "Investigating the Effect of Light on Plant Growth"\nMaterials: 2 identical plants, dark box, ruler, water\nProcedure: Place one plant in normal light, one in dark box. Water equally. Measure height daily for one week.\nObservations: Light plant grew 3cm, remained green. Dark plant grew 1cm, turned yellow.\nConclusion: Plants need light for healthy growth and color.\n\n**Historical Event:** "Ghana\'s Independence Day - March 6, 1957"\nBackground: British colonial rule since 1874. Growing nationalism in 1940s-1950s.\nKey Figure: Dr. Kwame Nkrumah led independence movement.\nEvents: Negotiations with Britain, elections, transfer of power ceremony.\nSignificance: First African colony to gain independence, inspired other nations.\n\nTasks:\n1. Create appropriate notes for the science content (focus on procedure and results).\n2. Create appropriate notes for the history content (focus on chronology and significance).\n3. Explain how your note-taking approach differed for each subject.\n4. Identify which format works best for each type of information.\n\n**Learning Goal:** Adapt note-taking strategies to match different subject requirements and information types.' 
                    },
                    { 
                      type: 'synthesis_challenge', 
                      question: '**Exercise 6: Information Synthesis from Multiple Sources**\n\nCombine information from these three short sources about "Benefits of Reading":\n\nSource A: "Reading improves vocabulary, enhances critical thinking skills, and increases general knowledge across many subjects."\n\nSource B: "Regular reading reduces stress, improves focus and concentration, and provides entertainment and relaxation."\n\nSource C: "Reading develops empathy by exposing readers to different perspectives and life experiences, and strengthens memory and cognitive function."\n\nTasks:\n1. Identify all the benefits mentioned across the three sources.\n2. Group the benefits into logical categories (e.g., academic, personal, cognitive).\n3. Write a comprehensive summary that integrates information from all three sources.\n4. Create a mind map showing the relationships between different benefits.\n5. Add one benefit from your personal experience that isn\'t mentioned in the sources.\n\n**Learning Goal:** Practice combining information from multiple sources into coherent, organized summaries.' 
                    },
                    { 
                      type: 'exam_application', 
                      question: '**Exercise 7: BECE Summary Exam Practice**\n\nComplete this exam-style summary task under time pressure:\n\n**Time Limit: 15 minutes**\n\nPassage: "Mobile money services have revolutionized financial transactions in Ghana, particularly in rural areas where traditional banking services were limited. Services like MTN MoMo and AirtelTigo Money allow people to send and receive money using their mobile phones without needing a bank account. Users can pay for goods and services, transfer money to family members, and even save money through mobile wallets. The system has reduced the need to travel long distances to banks, decreased the risks associated with carrying cash, and enabled small business owners to receive payments more efficiently. However, challenges include network connectivity issues in remote areas, concerns about security and fraud, and the need for better financial literacy among users. Despite these challenges, mobile money has increased financial inclusion and economic participation among previously underserved populations."\n\n**Instructions: Write a summary of the passage in exactly 60 words. Your summary must:**\n- Include the main idea and key points\n- Be written in your own words\n- Be grammatically correct\n- Stay within the word limit\n\nSelf-Assessment:\n1. Did you complete the summary within the time limit?\n2. Does your summary include the main benefits and challenges?\n3. Did you use your own words throughout?\n4. Is your summary exactly 60 words?\n\n**Learning Goal:** Practice summary writing under exam conditions with specific requirements and time constraints.' 
                    },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'BECE-Style Summary Question 1:\n\n"The cocoa industry plays a vital role in Ghana\'s economy, employing over 800,000 farmers and contributing significantly to export revenue. Ghanaian cocoa is renowned worldwide for its high quality and distinctive flavor, making it highly sought after by international chocolate manufacturers. The government supports farmers through programs that provide improved seedlings, training in modern farming techniques, and better pricing mechanisms. However, the industry faces challenges including climate change effects, aging cocoa trees, and competition from other cocoa-producing countries. Additionally, many farmers struggle with limited access to credit, inadequate storage facilities, and fluctuating international prices that affect their income stability. To address these issues, stakeholders are promoting sustainable farming practices, developing disease-resistant cocoa varieties, and establishing farmer cooperatives that can negotiate better prices and access resources collectively. The Ghana Cocoa Board continues to regulate quality standards and marketing to maintain the country\'s reputation for premium cocoa production."\n\nWrite a summary of the passage in not more than 80 words. [10 marks]', 
                    solution: 'Sample Answer (78 words):\n\nGhana\'s cocoa industry employs over 800,000 farmers and produces high-quality cocoa that is globally recognized. The government supports farmers through training programs and improved pricing, while the Ghana Cocoa Board maintains quality standards. However, farmers face challenges including climate change, aging trees, limited credit access, and unstable international prices. Solutions being implemented include sustainable farming practices, disease-resistant varieties, and farmer cooperatives to improve negotiating power and resource access.\n\nMarking Criteria:\n- Main idea clearly stated (2 marks)\n- Key supporting points included (4 marks)\n- Written in own words (2 marks)\n- Within word limit (1 mark)\n- Grammar and coherence (1 mark)' 
                  },
                  { 
                    question: 'Note-Taking Application (BECE 2019 Adapted):\n\nYour teacher is explaining the water cycle during an Integrated Science lesson. She mentions evaporation from oceans and lakes, condensation in clouds, precipitation as rain or snow, and collection in rivers and groundwater. She also explains how human activities like deforestation and pollution can disrupt the cycle.\n\nTask: Demonstrate how you would take notes during this lesson using bullet points. Show the main topic, subtopics, and important details. [8 marks]', 
                    solution: 'Sample Notes Format:\n\n**THE WATER CYCLE**\n\nA. Natural Processes:\n   • Evaporation - water from oceans/lakes becomes vapor\n   • Condensation - water vapor forms clouds in atmosphere  \n   • Precipitation - water falls as rain/snow\n   • Collection - water gathers in rivers/underground\n\nB. Human Impact:\n   • Deforestation - reduces natural water absorption\n   • Pollution - contaminates water sources\n   • Result: disruption of natural cycle\n\nMarking Criteria:\n- Clear main topic heading (1 mark)\n- Logical organization with subtopics (2 marks)\n- Accurate content with key processes (3 marks)\n- Appropriate bullet point format (1 mark)\n- Neat, readable presentation (1 mark)' 
                  },
                  { 
                    question: 'Paraphrasing Skills (BECE 2020 Style):\n\nOriginal sentence: "Traditional Ghanaian festivals serve multiple purposes, including honoring ancestors, celebrating harvests, strengthening community bonds, and preserving cultural heritage for future generations."\n\nRewrite this sentence in your own words without changing the meaning. [6 marks]', 
                    solution: 'Sample Paraphrased Versions:\n\nAcceptable Answer 1: "Ghanaian cultural celebrations have various functions such as paying respect to forefathers, marking successful crop seasons, building unity among community members, and maintaining customs for young people to learn."\n\nAcceptable Answer 2: "Traditional ceremonies in Ghana fulfill several roles: they respect deceased elders, mark agricultural success, unite people in communities, and keep cultural practices alive for the next generation."\n\nAcceptable Answer 3: "Cultural festivals in Ghana serve many functions, including showing reverence to ancestors, commemorating good harvests, fostering community relationships, and ensuring cultural traditions continue."\n\nMarking Criteria:\n- Maintains original meaning (2 marks)\n- Uses different vocabulary appropriately (2 marks)\n- Changes sentence structure effectively (1 mark)\n- Grammar and clarity (1 mark)\n\nUnacceptable: Copying key phrases directly, changing meaning, or adding personal opinions.' 
                  },
                  { 
                    question: 'Information Hierarchy (BECE 2021 Style):\n\nRead this information about malaria prevention and organize it into main ideas and supporting details:\n\n"Malaria prevention in Ghana involves several strategies. People should sleep under insecticide-treated nets every night. Homes should eliminate standing water where mosquitoes breed, such as in containers, gutters, and ponds. The government conducts indoor residual spraying programs in high-risk areas. Health education campaigns teach communities about prevention methods. Early diagnosis and treatment at health facilities prevent severe complications. Pregnant women should attend antenatal clinics for preventive treatment."\n\nOrganize this information showing main ideas and supporting details. [10 marks]', 
                    solution: 'Information Hierarchy:\n\n**MAIN TOPIC: Malaria Prevention in Ghana**\n\nI. Individual Protection Methods\n   A. Sleep under insecticide-treated nets nightly\n   B. Eliminate standing water breeding sites\n      1. Empty containers regularly\n      2. Clean gutters\n      3. Manage ponds properly\n\nII. Government/Community Programs  \n   A. Indoor residual spraying in high-risk areas\n   B. Health education campaigns\n   C. Early diagnosis and treatment services\n\nIII. Special Populations\n   A. Pregnant women\n      1. Attend antenatal clinics\n      2. Receive preventive treatment\n\nMarking Criteria:\n- Clear main topic identification (2 marks)\n- Logical categorization of information (3 marks)\n- Appropriate hierarchy structure (2 marks)\n- Complete inclusion of all details (2 marks)\n- Clear formatting and organization (1 mark)' 
                  },
                  { 
                    question: 'Summary Comparison (BECE 2018 Adapted):\n\nTwo students wrote summaries of the same passage about renewable energy in Ghana. Compare their work and identify strengths and weaknesses:\n\nStudent A: "Ghana is using solar and wind power now. It helps reduce electricity problems. The government supports these projects with money and policies. Some challenges exist but renewable energy is good for Ghana\'s future development and environmental protection."\n\nStudent B: "Ghana has implemented renewable energy initiatives, particularly solar and wind power projects, to address electricity supply challenges. Government support through funding and favorable policies has facilitated these developments. Despite implementation challenges, renewable energy contributes to sustainable development and environmental conservation in Ghana."\n\nEvaluate both summaries. [8 marks]', 
                    solution: 'Evaluation:\n\n**Student A Strengths:**\n- Includes main points (renewable energy types, government support)\n- Simple, clear language\n- Mentions benefits (future development, environment)\n\n**Student A Weaknesses:**\n- Very basic vocabulary and sentence structure\n- Lacks sophistication expected at JHS level\n- Too informal for academic writing\n- Missing some detail about implementation\n\n**Student B Strengths:**\n- More sophisticated vocabulary and sentence structure\n- Comprehensive coverage of main points\n- Appropriate academic tone\n- Better organization and flow\n- More precise language ("initiatives," "facilitated," "sustainable development")\n\n**Student B Weaknesses:**\n- Slightly longer than necessary\n- Could be more specific about types of challenges\n\n**Overall Assessment:**\nStudent B demonstrates better summary writing skills with more appropriate academic language, comprehensive content coverage, and superior organization, while Student A shows basic understanding but needs improvement in expression and sophistication.\n\nMarking focuses on analysis quality, specific examples, and understanding of effective summary characteristics.' 
                  },
                  { 
                    question: 'Practical Note-Taking (BECE 2022 Style):\n\nYour Social Studies teacher is teaching about the three northern regions of Ghana. She mentions that the Upper East Region has Bolgatanga as its capital and is known for basket weaving and millet farming. The Upper West Region\'s capital is Wa, famous for Hippo Sanctuary and shea butter production. The Northern Region, with Tamale as capital, is known for yam cultivation and traditional smocks. All three regions celebrate the Damba festival and face challenges with dry season water shortage.\n\nCreate organized notes from this information using a table format. [6 marks]', 
                    solution: 'Sample Table Format:\n\n| Region | Capital | Known For | Common Features |\n|--------|---------|-----------|----------------|\n| Upper East | Bolgatanga | • Basket weaving<br>• Millet farming | • Damba festival<br>• Dry season water shortage |\n| Upper West | Wa | • Hippo Sanctuary<br>• Shea butter production | • Damba festival<br>• Dry season water shortage |\n| Northern | Tamale | • Yam cultivation<br>• Traditional smocks | • Damba festival<br>• Dry season water shortage |\n\nAlternative Linear Format:\n\n**NORTHERN REGIONS OF GHANA**\n\nA. Upper East Region\n   • Capital: Bolgatanga\n   • Specialties: Basket weaving, millet farming\n\nB. Upper West Region  \n   • Capital: Wa\n   • Specialties: Hippo Sanctuary, shea butter\n\nC. Northern Region\n   • Capital: Tamale\n   • Specialties: Yam cultivation, traditional smocks\n\nD. Common Features (All Regions)\n   • Celebrate Damba festival\n   • Face dry season water shortages\n\nMarking Criteria:\n- Complete information included (3 marks)\n- Logical organization/clear format (2 marks)\n- Neat presentation (1 mark)' 
                  },
                  { 
                    question: 'Summary Error Analysis (BECE 2020 Adapted):\n\nA student was asked to summarize a passage about mobile phone usage among Ghanaian youth. Here is their summary:\n\n"I think mobile phones are very popular among young people in Ghana because everyone I know has one. They use them for many things like calling, texting, and social media. According to the passage, 85% of youth own smartphones. This is good because it helps them stay connected with friends and family. However, some parents worry about excessive screen time affecting studies. The government should maybe consider regulations about youth phone usage to protect them."\n\nIdentify and explain the errors in this summary. [8 marks]', 
                    solution: 'Summary Errors Identified:\n\n1. **Personal Opinion Inclusion (Major Error)**\n   - "I think..." and "everyone I know has one"\n   - Summaries should be objective, not include personal views\n\n2. **Addition of Personal Recommendations (Major Error)**\n   - "The government should maybe consider regulations..."\n   - Summaries should not add suggestions not in the original\n\n3. **Inappropriate First-Person Perspective**\n   - Using "I think" and personal experience\n   - Should maintain third-person objective voice\n\n4. **Evaluation Language (Minor Error)**\n   - "This is good because..." adds judgment\n   - Should present information neutrally\n\n5. **Informal Tone**\n   - "maybe consider" is too casual\n   - Should use formal academic language\n\n**What the Student Did Well:**\n- Included specific statistic (85%)\n- Mentioned main points (phone usage, parental concerns)\n- Reasonable length and organization\n\n**Corrected Approach:**\nSummaries should present only information from the original passage, use objective language, avoid personal opinions or recommendations, and maintain formal academic tone throughout.\n\nMarking Criteria:\n- Identification of major errors (4 marks)\n- Clear explanations of problems (3 marks)\n- Understanding of summary principles (1 mark)' 
                  },
                  { 
                    question: 'Advanced Synthesis (BECE 2023 Style):\n\nYou are researching "Food Security in Ghana" using three sources:\n\nSource 1: Government report stating that 5% of Ghanaians face food insecurity, mainly in northern regions during dry seasons.\n\nSource 2: NGO study indicating that small-scale farmers struggle with access to improved seeds, fertilizers, and credit facilities.\n\nSource 3: Academic research showing that climate change is increasing rainfall variability, affecting crop yields nationwide.\n\nWrite a comprehensive summary that integrates information from all three sources. [12 marks]', 
                    solution: 'Sample Integrated Summary:\n\nFood security in Ghana faces multiple interconnected challenges affecting different populations and regions. Government data indicates that 5% of the population experiences food insecurity, with northern regions being particularly vulnerable during dry seasons when agricultural production decreases. The underlying causes include structural problems in the agricultural sector, where small-scale farmers lack access to essential resources such as improved seeds, fertilizers, and credit facilities, limiting their productivity and income stability. These challenges are intensified by climate change impacts, which have increased rainfall variability across the country, making crop yields less predictable and reliable. The convergence of these factors - regional vulnerability, resource constraints for farmers, and climate unpredictability - creates a complex food security challenge that requires coordinated interventions addressing both immediate needs and long-term agricultural sustainability.\n\nMarking Criteria:\n- Clear integration of all three sources (4 marks)\n- Logical organization showing relationships (3 marks)\n- Comprehensive coverage without redundancy (2 marks)\n- Appropriate academic language and tone (2 marks)\n- Coherent flow and transitions (1 mark)\n\nNote: Answer demonstrates advanced synthesis skills by showing connections between different aspects rather than simply listing information from each source separately.' 
                  },
                  { 
                    question: 'Memory and Review Strategies (BECE 2017 Style):\n\nExplain how effective note-taking can improve your performance in examinations. Give specific examples of note-taking techniques that help with memory and revision. [10 marks]', 
                    solution: 'How Note-Taking Improves Examination Performance:\n\n**1. Active Learning Process**\n- Taking notes requires active listening and thinking, improving initial understanding\n- Helps identify main ideas while learning, not just during revision\n- Forces students to process information rather than passively receive it\n\n**2. Organized Information for Revision**\n- Well-organized notes provide clear structure for review\n- Eliminates need to reread entire textbooks before exams\n- Allows for efficient, focused study sessions\n\n**3. Specific Memory-Enhancing Techniques:**\n\n*Visual Organization:*\n- Mind maps help visualize connections between concepts\n- Tables and charts organize comparative information clearly\n- Color coding distinguishes different topics or importance levels\n\n*Hierarchy and Structure:*\n- Outline format shows relationships between main ideas and details\n- Numbered lists help remember sequences and processes\n- Headings and subheadings create logical organization\n\n*Active Review Methods:*\n- Cornell notes with cue column enable self-testing\n- Summary sections reinforce main points\n- Question annotations promote active thinking during review\n\n**4. Practical Examples:**\n- History: Timeline notes help remember chronological order\n- Science: Process diagrams aid understanding of experiments\n- Mathematics: Formula sheets with worked examples support problem-solving\n- English: Character analysis charts organize literary understanding\n\n**5. Long-term Benefits:**\n- Regular note-taking builds cumulative knowledge base\n- Reduces exam anxiety through thorough preparation\n- Develops skills useful for continued education\n\nMarking Criteria:\n- Clear explanation of benefits (3 marks)\n- Specific techniques with examples (4 marks)\n- Understanding of memory processes (2 marks)\n- Organization and clarity (1 mark)' 
                  },
                  { 
                    question: 'Real-World Application (BECE 2021 Style):\n\nBeyond school examinations, how can summary writing and note-taking skills help you in your future career and community involvement in Ghana? Provide specific examples. [8 marks]', 
                    solution: 'Real-World Applications of Summary and Note-Taking Skills:\n\n**Professional/Career Benefits:**\n\n1. **Workplace Communication**\n   - Summarizing reports for supervisors and colleagues\n   - Taking meeting notes to track decisions and action items\n   - Creating brief project updates and progress reports\n\n2. **Continued Learning**\n   - Note-taking during job training and professional development\n   - Summarizing new policies, procedures, or technical information\n   - Processing information from workshops and conferences\n\n3. **Career-Specific Examples**\n   - *Teaching:* Summarizing curriculum content, taking notes during educational workshops\n   - *Healthcare:* Recording patient information, summarizing medical training\n   - *Business:* Creating executive summaries, noting client requirements\n   - *Agriculture:* Recording training on new farming techniques, summarizing market information\n\n**Community Involvement:**\n\n1. **Civic Participation**\n   - Taking notes during community meetings and town halls\n   - Summarizing government policies affecting local communities\n   - Recording information about development projects and initiatives\n\n2. **Leadership Roles**\n   - Documenting decisions in community organizations\n   - Summarizing discussions for absent members\n   - Creating clear communications about community events and issues\n\n**Personal Development:**\n\n1. **Information Processing**\n   - Summarizing news articles and current events\n   - Taking notes while learning new skills or hobbies\n   - Processing information about health, finance, or family matters\n\n2. **Decision Making**\n   - Organizing information when making important life decisions\n   - Comparing options for education, career, or major purchases\n   - Planning and tracking personal goals and progress\n\n**Digital Age Applications:**\n   - Processing information from online sources and digital media\n   - Creating social media content that summarizes complex issues\n   - Participating effectively in online discussions and forums\n\nMarking Criteria:\n- Specific, realistic career examples (3 marks)\n- Community involvement applications (2 marks)\n- Understanding of transferable skills (2 marks)\n- Clear organization and expression (1 mark)' 
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'What is the primary purpose of summary writing?',
                    options: [
                      'To copy the original text using exactly the same words',
                      'To condense longer texts while preserving essential information in your own words',
                      'To add personal opinions and interpretations to the original text',
                      'To include as many specific examples and details as possible'
                    ],
                    answer: 'To condense longer texts while preserving essential information in your own words',
                    explanation: 'Summary writing involves condensing information while maintaining the core meaning, using your own words rather than copying directly. It should be objective without personal opinions and should exclude unnecessary details and examples.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which step should come first when writing a summary?',
                    options: [
                      'Write the summary immediately after reading the passage once',
                      'Look up the meaning of every unfamiliar word in a dictionary',
                      'Read the entire passage carefully to understand the overall topic and purpose',
                      'Count the words in the original passage to determine summary length'
                    ],
                    answer: 'Read the entire passage carefully to understand the overall topic and purpose',
                    explanation: 'The first step in summary writing is always to read and understand the entire passage to grasp the main topic and author\'s purpose. This provides the foundation for identifying key points and organizing your summary effectively.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which information should be excluded from a good summary?',
                    options: [
                      'Main ideas and central arguments',
                      'Important facts and key statistics',
                      'Specific examples, anecdotes, and detailed illustrations',
                      'Cause and effect relationships'
                    ],
                    answer: 'Specific examples, anecdotes, and detailed illustrations',
                    explanation: 'Summaries should focus on main ideas and essential information while excluding specific examples, detailed illustrations, anecdotes, and repetitive information. These details support the main points but are not essential for understanding the core message.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the main advantage of the Cornell note-taking system?',
                    options: [
                      'It requires no preparation or special formatting',
                      'It combines note-taking, review cues, and summary sections on one page',
                      'It works only for mathematics and science subjects',
                      'It eliminates the need to review notes before examinations'
                    ],
                    answer: 'It combines note-taking, review cues, and summary sections on one page',
                    explanation: 'The Cornell system divides the page into three sections: main notes, cue column for keywords and questions, and summary area. This format supports both initial note-taking and later review, making it highly effective for studying.'
                  },
                  {
                    type: 'mcq',
                    question: 'When paraphrasing, which approach is most effective?',
                    options: [
                      'Change only one or two words in each sentence',
                      'Use a thesaurus to replace every word with synonyms',
                      'Change vocabulary, sentence structure, and word order while maintaining the original meaning',
                      'Add your own opinions and interpretations to make the text more interesting'
                    ],
                    answer: 'Change vocabulary, sentence structure, and word order while maintaining the original meaning',
                    explanation: 'Effective paraphrasing involves comprehensive changes to vocabulary and sentence structure while preserving the original meaning. Simply changing a few words or replacing every word with synonyms often results in awkward or inaccurate paraphrases.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which note-taking format would be most appropriate for comparing different historical periods?',
                    options: [
                      'Mind map with the main topic in the center',
                      'Linear bullet points with numbered sub-topics',
                      'Table with columns for different time periods and rows for comparison categories',
                      'Outline format with Roman numerals and letters'
                    ],
                    answer: 'Table with columns for different time periods and rows for comparison categories',
                    explanation: 'Tables are ideal for comparative information because they allow easy side-by-side comparison of different periods, showing similarities and differences clearly. This format makes patterns and contrasts immediately visible.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the most important characteristic of effective academic notes?',
                    options: [
                      'They contain every word the teacher spoke during the lesson',
                      'They are written in complete sentences with perfect grammar',
                      'They are organized clearly and capture essential information for later review',
                      'They include detailed personal reflections and opinions about the content'
                    ],
                    answer: 'They are organized clearly and capture essential information for later review',
                    explanation: 'Effective notes prioritize clear organization and essential information over complete transcription. The goal is to create useful study material that can be quickly reviewed and understood later, not to record every detail.'
                  },
                  {
                    type: 'mcq',
                    question: 'How should you handle technical terms or specialized vocabulary when summarizing?',
                    options: [
                      'Always replace them with simpler words, even if the meaning changes',
                      'Skip any sentences containing technical terms to avoid confusion',
                      'Keep specialized terms that have no suitable alternatives, but explain them if necessary',
                      'Look up every technical term and include the dictionary definition'
                    ],
                    answer: 'Keep specialized terms that have no suitable alternatives, but explain them if necessary',
                    explanation: 'Some technical terms are essential to the meaning and have no appropriate substitutes. These should be retained in summaries, with brief explanations if the audience might not understand them. Changing specialized terms often distorts the meaning.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which strategy best improves long-term retention of information from notes?',
                    options: [
                      'Reading notes once immediately after writing them',
                      'Copying notes multiple times in exactly the same format',
                      'Reviewing notes regularly and creating connections between different concepts',
                      'Highlighting every important word and phrase in different colors'
                    ],
                    answer: 'Reviewing notes regularly and creating connections between different concepts',
                    explanation: 'Regular review combined with active connection-making significantly improves retention. This approach engages multiple memory processes and helps build integrated understanding rather than isolated facts.'
                  },
                  {
                    type: 'mcq',
                    question: 'In BECE summary questions, what happens if your summary exceeds the specified word limit?',
                    options: [
                      'You receive extra marks for providing more information',
                      'Only the content within the word limit is marked, potentially missing key points',
                      'The examiner will automatically reduce your word count without penalty',
                      'Word limits are suggestions and not strictly enforced'
                    ],
                    answer: 'Only the content within the word limit is marked, potentially missing key points',
                    explanation: 'BECE summary questions have strict word limits, and examiners typically only read and mark content within the specified limit. Exceeding the limit may result in important concluding points being unmarked, reducing your overall score.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Mind maps are suitable for all types of academic content and are always the best note-taking format for every subject.',
                    reason: 'While mind maps are excellent for showing relationships between concepts and work well for many learners, different subjects and types of information may be better suited to other formats. Linear notes work well for sequential information, tables for comparisons, and outlines for hierarchical content.',
                    answer: 'false'
                  },
                  {
                    type: 'truefalse',
                    statement: 'Good summaries should always include specific examples and detailed illustrations from the original text to support the main points.',
                    reason: 'Summaries should focus on main ideas and essential information while excluding specific examples, detailed illustrations, anecdotes, and minor supporting details. These elements support understanding in the original text but are not necessary in a condensed summary.',
                    answer: 'false'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'When paraphrasing, you should change the __________ and sentence structure while maintaining the original meaning.',
                    answer: 'vocabulary',
                    explanation: 'Effective paraphrasing requires changing vocabulary (using appropriate synonyms) and sentence structure (altering word order, combining or separating sentences) while preserving the original meaning and intent of the text.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which elements should be included in effective academic notes? (Select all correct answers)',
                    options: [
                      'Clear headings and subheadings for organization',
                      'Every word spoken by the teacher during the lesson',
                      'Key concepts and important supporting details',
                      'Personal opinions about whether the information is interesting',
                      'Connections between new information and previous learning'
                    ],
                    correctAnswers: [
                      'Clear headings and subheadings for organization',
                      'Key concepts and important supporting details',
                      'Connections between new information and previous learning'
                    ],
                    explanation: 'Effective notes should be well-organized with clear headings, focus on essential information rather than transcribing everything, and include connections that aid understanding and memory. Personal opinions about interest are not necessary for academic notes.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which strategies improve the quality of summary writing? (Choose all that apply)',
                    options: [
                      'Reading the passage multiple times before writing',
                      'Including personal opinions about the topic',
                      'Using your own words rather than copying phrases',
                      'Adding examples from your personal experience',
                      'Checking that all main points are included'
                    ],
                    correctAnswers: [
                      'Reading the passage multiple times before writing',
                      'Using your own words rather than copying phrases',
                      'Checking that all main points are included'
                    ],
                    explanation: 'Good summary writing requires thorough understanding through multiple readings, original expression through paraphrasing, and comprehensive coverage of main points. Personal opinions and experiences should not be added to objective summaries.'
                  },
                  {
                    type: 'matching',
                    question: 'Match each note-taking format to its most appropriate use.',
                    pairs: [
                      { left: 'Linear bullet points', right: 'Sequential information and step-by-step procedures' },
                      { left: 'Mind map', right: 'Showing relationships and connections between concepts' },
                      { left: 'Table format', right: 'Comparing and contrasting different items or categories' },
                      { left: 'Cornell system', right: 'Combining main notes with review cues and summaries' },
                    ],
                    explanation: 'Different note-taking formats serve different purposes: linear notes for sequences, mind maps for relationships, tables for comparisons, and Cornell notes for comprehensive study support. Choosing the right format enhances both note-taking effectiveness and review efficiency.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'Explain how mastering summary writing and note-taking skills will help you succeed in your BECE examinations and prepare you for Senior High School. Give specific examples.',
                    answer: 'Summary writing and note-taking skills directly support BECE success and SHS preparation in several ways. For BECE, summary questions worth significant marks test your ability to identify main ideas, eliminate unnecessary details, and express ideas clearly within word limits - skills developed through regular practice. Effective note-taking during lessons creates organized study materials for all subjects, improving revision efficiency and information retention. These skills also support comprehension across subjects: in Social Studies, summarizing historical events and taking organized notes about different periods; in Integrated Science, recording experimental procedures and summarizing scientific concepts; in English, analyzing literary texts and organizing essay ideas. For SHS preparation, these skills provide the foundation for more advanced academic work requiring independent reading, research, and critical analysis. Students with strong summary and note-taking abilities adapt more easily to increased academic demands, longer texts, and complex information processing required at higher levels.',
                    explanation: 'This question assesses understanding of how these skills transfer to academic success and future learning. Strong answers should connect specific skill components to examination requirements and demonstrate awareness of progressive academic demands.'
                  },
                ],
                summary: 'Summary writing and note-taking are fundamental academic skills that support learning, memory, and examination success across all subjects. Effective summary writing requires systematic reading, main idea identification, paraphrasing, and concise organization within specified limits. Quality note-taking involves choosing appropriate formats (linear, mind maps, tables, Cornell system) based on content type and learning goals, focusing on essential information while maintaining clear organization. Both skills require active information processing, distinguishing between main ideas and supporting details, and regular review for retention. Paraphrasing techniques - changing vocabulary and sentence structure while preserving meaning - are essential for both summary writing and note-taking. These skills directly support BECE examination performance through summary questions and organized study materials, while also preparing students for advanced academic work in Senior High School and beyond. Success develops through consistent practice with diverse texts, systematic application of proven strategies, and regular review that reinforces learning and builds long-term academic capabilities.',
              },
            ],
          },
          {
            id: 'eng103',
            slug: 'writing-1',
            title: 'Writing',
            lessons: [
                 {
                id: 'eng103-1',
                slug: 'sentence-construction',
                title: 'Sentence Construction & Paragraphs',
                objectives: [
                  'Define sentences and paragraphs, explaining their roles as fundamental units of written communication.',
                  'Identify and construct the four basic sentence types: simple, compound, complex, and compound-complex sentences.',
                  'Apply proper sentence structure including subject-verb agreement, word order, and punctuation rules.',
                  'Develop well-organized paragraphs with clear topic sentences, supporting details, and concluding statements.',
                  'Use transitional words and phrases to create coherence and logical flow within and between paragraphs.',
                  'Demonstrate unity in paragraph writing by ensuring all sentences relate to the main topic.',
                  'Vary sentence length and structure to create engaging, readable prose that maintains reader interest.',
                  'Apply editing and proofreading skills to identify and correct sentence-level and paragraph-level errors.',
                  'Use effective sentence construction and paragraph development in BECE essay writing and creative compositions.'
                ],
                introduction: 'Effective writing is the cornerstone of academic success, professional communication, and personal expression in Ghanaian society and beyond. Whether you are answering WAEC BECE essay questions, writing letters to family members living abroad, composing school reports, or participating in community discussions through written communication, your ability to construct clear sentences and organize coherent paragraphs determines how effectively others understand your ideas and respond to your messages.\n\nEvery piece of successful writing, from simple text messages to complex government policies, is built from two fundamental elements: well-constructed sentences and well-organized paragraphs. Sentences are the basic units that express complete thoughts, while paragraphs group related sentences together to develop ideas thoroughly and logically. When you master these building blocks, you gain the power to express complex ideas clearly, persuade others effectively, and communicate with confidence in any situation.\n\nIn the Ghanaian education system, strong sentence and paragraph skills directly impact your performance across all subjects. In English Language, these skills determine your success in composition writing, comprehension responses, and literature analysis. In Social Studies, clear writing helps you explain historical events, analyze government policies, and discuss cultural practices effectively. In Integrated Science, proper sentence structure enables you to describe experiments, explain scientific processes, and present research findings accurately. Even in Mathematics, word problems require careful reading of well-constructed sentences, and written explanations demand clear paragraph organization.\n\nThe WAEC Basic Education Certificate Examination places significant emphasis on writing skills through essay questions that test your ability to organize ideas logically, express thoughts clearly, and maintain grammatical accuracy throughout extended passages. Students who master sentence construction and paragraph development consistently achieve higher grades because they can present their knowledge in ways that examiners can easily understand and appreciate. Poor sentence structure and disorganized paragraphs often obscure good ideas and lead to lower marks, even when students possess solid understanding of the subject matter.\n\nBeyond academic success, effective writing skills prepare you for active participation in Ghana\'s developing economy and democratic society. In professional settings, clear written communication helps you prepare reports, correspond with colleagues, document procedures, and advance in your career. When applying for Senior High School, university admission, scholarships, or employment opportunities, your ability to write compelling personal statements and application essays can determine your future prospects. In community leadership roles, effective writing enables you to draft proposals, communicate with government officials, organize community projects, and advocate for important causes.\n\nMany students struggle with writing because they have not learned systematic approaches to sentence construction and paragraph development. Some write only simple sentences, creating choppy, monotonous prose that fails to engage readers. Others attempt complex sentences without understanding proper grammar rules, resulting in confusing run-on sentences or fragments that obscure their intended meaning. In paragraph writing, many students fail to organize their ideas logically, jumping from topic to topic without clear transitions, or they repeat the same ideas without developing them sufficiently.\n\nAdditionally, students often struggle with maintaining unity and coherence in their writing. Unity means that all sentences in a paragraph relate to one main idea, while coherence means that ideas flow logically from one sentence to the next and from one paragraph to the next. Without these qualities, even grammatically correct writing can be difficult to follow and understand. Many students also lack variety in their sentence structures, making their writing boring and repetitive rather than engaging and dynamic.\n\nThis comprehensive lesson will teach you proven strategies for constructing effective sentences and developing strong paragraphs that serve you well in examinations, academic assignments, and real-world communication. You will learn about the four basic sentence types - simple, compound, complex, and compound-complex - and how to use each type appropriately to express different kinds of ideas and relationships. You will master the essential components of sentence structure, including proper subject-verb agreement, appropriate word order, and correct punctuation that helps readers understand your meaning clearly.\n\nFor paragraph development, you will learn how to write effective topic sentences that clearly state your main idea, develop supporting sentences that provide evidence and explanation, and create concluding sentences that reinforce your main point or transition smoothly to the next paragraph. You will practice using transitional words and phrases that show relationships between ideas and help readers follow your reasoning from beginning to end.\n\nThe lesson includes extensive practice with various types of writing tasks, from simple descriptive paragraphs about familiar Ghanaian settings to complex analytical essays that require multiple paragraphs working together to support a central argument. You will work with both formal academic writing suitable for examinations and informal personal writing appropriate for letters, journals, and creative expression.\n\nYou will also learn editing and proofreading strategies that help you identify and correct common errors in sentence structure, grammar, punctuation, and paragraph organization. These skills enable you to revise your first drafts into polished final versions that accurately represent your best thinking and communicate your ideas effectively to any audience.\n\nBy mastering sentence construction and paragraph development, you will build the foundation for all advanced writing skills, including essay composition, creative writing, technical writing, and professional communication. These abilities will serve you throughout your education and career, helping you express your ideas with clarity, precision, and confidence in any context where effective written communication matters.',
                keyConcepts: [
                  { 
                    title: '1. Understanding Sentence Structure and Types', 
                    content: 'A sentence is a group of words that expresses a complete thought and contains at least one subject and one predicate (verb). Understanding different sentence types helps you create variety and express complex ideas effectively.\n\nFour Basic Sentence Types:\n\n1. Simple Sentence: Contains one independent clause (complete thought)\n   Examples: "The students study hard." / "Ghana achieved independence in 1957."\n\n2. Compound Sentence: Contains two or more independent clauses joined by coordinating conjunctions (and, but, or, nor, for, yet, so)\n   Examples: "The rain started, so we went inside." / "I studied mathematics, but my friend studied science."\n\n3. Complex Sentence: Contains one independent clause and one or more dependent clauses\n   Examples: "Because it was raining, we stayed indoors." / "The book that I borrowed is very interesting."\n\n4. Compound-Complex Sentence: Contains two or more independent clauses and one or more dependent clauses\n   Example: "When the bell rang, the students rushed outside, and the teacher locked the classroom."\n\nSentence Components:\n- Subject: Who or what the sentence is about\n- Predicate: What the subject does or is\n- Object: Receives the action of the verb\n- Modifiers: Words that describe or limit other words' 
                  },
                  { 
                    title: '2. Essential Grammar Rules for Sentence Construction', 
                    content: 'Proper sentence construction requires understanding and applying fundamental grammar rules that ensure clarity and correctness.\n\nSubject-Verb Agreement:\n- Singular subjects take singular verbs: "The student writes carefully."\n- Plural subjects take plural verbs: "The students write carefully."\n- Compound subjects joined by "and" take plural verbs: "John and Mary are studying."\n- Compound subjects joined by "or/nor" agree with the nearest subject: "Neither the teacher nor the students were present."\n\nWord Order in English:\n- Basic pattern: Subject + Verb + Object (SVO)\n- Example: "The children (S) played (V) football (O)."\n- Questions: Auxiliary verb + Subject + Main verb + Object\n- Example: "Did the children play football?"\n\nCommon Sentence Errors to Avoid:\n- Sentence Fragments: Incomplete thoughts missing subject or verb\n- Run-on Sentences: Two or more complete thoughts incorrectly joined\n- Comma Splices: Independent clauses joined only by a comma\n- Subject-Verb Disagreement: Mismatched singular/plural forms\n- Dangling Modifiers: Descriptive phrases that don\'t clearly relate to the intended word\n\nPunctuation Rules:\n- Use periods to end declarative sentences\n- Use question marks for interrogative sentences\n- Use exclamation points for strong emotions or emphasis\n- Use commas to separate items in series, join independent clauses with conjunctions, and set off introductory elements' 
                  },
                  { 
                    title: '3. Paragraph Structure and Organization', 
                    content: 'A paragraph is a group of related sentences that develop one main idea. Effective paragraphs have clear structure and logical organization that guides readers through your thinking.\n\nBasic Paragraph Structure:\n\n1. Topic Sentence: States the main idea of the paragraph\n   - Usually appears at the beginning\n   - Should be clear and specific\n   - Example: "Secondary education in Ghana has undergone significant changes in recent years."\n\n2. Supporting Sentences: Develop the main idea with details, examples, evidence, or explanation\n   - Provide specific information that proves or explains the topic sentence\n   - Use facts, statistics, examples, anecdotes, or expert opinions\n   - Each supporting sentence should clearly relate to the main idea\n\n3. Concluding Sentence: Reinforces the main idea or provides transition to the next paragraph\n   - May summarize key points\n   - May suggest implications or consequences\n   - May connect to the next paragraph\'s topic\n\nParagraph Development Methods:\n- Examples and Illustrations: Provide specific instances\n- Comparison and Contrast: Show similarities and differences\n- Cause and Effect: Explain relationships between events\n- Process Description: Explain how something works or happens\n- Definition: Explain the meaning of concepts\n- Classification: Group items into categories' 
                  },
                  { 
                    title: '4. Unity and Coherence in Writing', 
                    content: 'Unity and coherence are essential qualities that make writing clear, logical, and easy to follow.\n\nUnity: All sentences in a paragraph support one main idea\n- Every sentence should relate directly to the topic sentence\n- Eliminate sentences that introduce new or unrelated topics\n- Stay focused on developing one central concept thoroughly\n- Example of Unity Problem: A paragraph about "Benefits of Reading" should not include sentences about "How to Choose Books" unless they directly support the main benefits theme\n\nCoherence: Ideas flow logically and smoothly from one sentence to the next\n- Use transitional words and phrases to show relationships\n- Arrange sentences in logical order (chronological, spatial, order of importance)\n- Repeat key words and use pronouns to connect ideas\n- Use parallel structure for related ideas\n\nTransitional Words and Phrases:\n- Addition: also, furthermore, in addition, moreover, besides\n- Contrast: however, but, nevertheless, on the other hand, although\n- Cause and Effect: therefore, consequently, as a result, because, since\n- Time Order: first, next, then, finally, meanwhile, afterward\n- Examples: for instance, for example, specifically, to illustrate\n- Emphasis: indeed, certainly, in fact, above all, most importantly\n\nCreating Flow:\n- Begin new sentences with information from previous sentences\n- Use pronouns to refer back to earlier concepts\n- Repeat important key words throughout the paragraph\n- Vary sentence beginnings while maintaining logical connections' 
                  },
                  { 
                    title: '5. Sentence Variety and Style', 
                    content: 'Effective writing uses variety in sentence length, structure, and beginnings to create engaging, readable prose that maintains reader interest.\n\nSentence Length Variation:\n- Short sentences (5-10 words): Create emphasis, show action, provide clarity\n  Example: "The results were surprising. Nobody expected this outcome."\n- Medium sentences (10-20 words): Provide detailed information while remaining clear\n  Example: "The government announced new educational policies that will affect all public schools."\n- Long sentences (20+ words): Show complex relationships and provide comprehensive information\n  Example: "Although the new policies were controversial, most educators agreed that the changes would ultimately benefit students by providing better resources and improved teaching methods."\n\nSentence Beginning Variation:\n- Start with subjects: "Students across Ghana celebrated the announcement."\n- Start with adverbs: "Surprisingly, the results exceeded all expectations."\n- Start with prepositional phrases: "In the northern regions, farmers faced different challenges."\n- Start with dependent clauses: "Because the weather was favorable, crops grew exceptionally well."\n- Start with participial phrases: "Working together, the community solved the problem."\n\nStyle Techniques:\n- Use active voice for clarity and directness: "The teacher explained the lesson" (not "The lesson was explained by the teacher")\n- Combine short, choppy sentences into more sophisticated structures\n- Vary sentence types throughout paragraphs\n- Use specific, concrete details rather than vague generalizations\n- Choose precise verbs and descriptive adjectives' 
                  },
                  { 
                    title: '6. Common Writing Problems and Solutions', 
                    content: 'Understanding and avoiding common writing problems helps you produce clear, effective prose that communicates your ideas successfully.\n\nFragment Problems:\n- Problem: Incomplete thoughts missing subject or verb\n- Example: "Because it was raining." (dependent clause without main clause)\n- Solution: Complete the thought: "Because it was raining, we stayed inside."\n\nRun-on Sentence Problems:\n- Problem: Multiple complete thoughts incorrectly joined\n- Example: "I went to the market I bought some rice I came home."\n- Solutions: Use periods, semicolons, or coordinating conjunctions\n- Corrected: "I went to the market, bought some rice, and came home."\n\nComma Splice Problems:\n- Problem: Independent clauses joined only by comma\n- Example: "The exam was difficult, many students failed."\n- Solutions: Use semicolon, add conjunction, or separate sentences\n- Corrected: "The exam was difficult; many students failed."\n\nParallelism Problems:\n- Problem: Unequal grammatical structures in series\n- Example: "I like reading, writing, and to study."\n- Solution: Make all items parallel: "I like reading, writing, and studying."\n\nModifier Problems:\n- Problem: Unclear what the modifier describes\n- Example: "Walking to school, the rain started."\n- Solution: Clarify the subject: "As I was walking to school, the rain started."\n\nWordiness Problems:\n- Problem: Using more words than necessary\n- Example: "In my personal opinion, I think that..."\n- Solution: Be concise: "I believe that..." or simply state the opinion directly' 
                  },
                  { 
                    title: '7. Writing Process: Planning, Drafting, and Revising', 
                    content: 'Effective writing follows a systematic process that helps you organize ideas, express them clearly, and refine your work to achieve your communication goals.\n\nPlanning Stage:\n- Brainstorm ideas related to your topic\n- Organize main points in logical order\n- Consider your audience and purpose\n- Create an outline or rough plan\n- Gather supporting details and examples\n\nDrafting Stage:\n- Write continuously without worrying about perfection\n- Focus on getting ideas down on paper\n- Follow your outline but remain flexible\n- Don\'t stop to edit or correct mistakes\n- Aim to complete a full first draft\n\nRevising Stage (Content and Organization):\n- Check that main ideas are clear and well-supported\n- Ensure paragraphs have unity and coherence\n- Verify logical order of ideas\n- Add, delete, or reorganize content as needed\n- Strengthen topic sentences and conclusions\n\nEditing Stage (Sentence-Level Issues):\n- Check sentence structure and variety\n- Verify subject-verb agreement\n- Correct run-on sentences and fragments\n- Improve word choice and clarity\n- Ensure proper transitions between ideas\n\nProofreading Stage (Surface Errors):\n- Check spelling, punctuation, and capitalization\n- Verify grammar rules and usage\n- Read aloud to catch awkward phrasing\n- Use spell-check tools but don\'t rely on them completely\n- Review formatting and presentation\n\nSelf-Assessment Questions:\n- Do my sentences express complete thoughts?\n- Do my paragraphs develop one main idea?\n- Are my ideas arranged logically?\n- Have I used appropriate transitions?\n- Is my writing clear and easy to understand?' 
                  },
                  { 
                    title: '8. Application to Academic and Personal Writing', 
                    content: 'Strong sentence and paragraph skills apply to various types of writing you will encounter in school, examinations, and personal communication.\n\nBECE Essay Writing:\n- Use clear topic sentences for each paragraph\n- Develop ideas with specific examples and details\n- Maintain unity by staying focused on the essay topic\n- Use transitions to connect paragraphs logically\n- Vary sentence structure to demonstrate language skills\n\nFormal Letter Writing:\n- Structure paragraphs around specific purposes (introduction, body, conclusion)\n- Use formal language and complete sentences\n- Maintain professional tone throughout\n- Organize ideas clearly and concisely\n\nCreative Writing:\n- Use sentence variety to create rhythm and flow\n- Employ descriptive details in well-organized paragraphs\n- Build suspense through sentence structure\n- Develop characters and settings through focused paragraphs\n\nInformational Writing:\n- Present information in logical, well-structured paragraphs\n- Use clear topic sentences to introduce new concepts\n- Support main ideas with facts, statistics, and examples\n- Conclude paragraphs with synthesis or transition statements\n\nPersonal Narrative:\n- Organize events chronologically in clear paragraphs\n- Use sentence variety to maintain reader interest\n- Include descriptive details and dialogue\n- Reflect on experiences in concluding paragraphs\n\nArgumentative Writing:\n- State claims clearly in topic sentences\n- Support arguments with evidence in body sentences\n- Address counterarguments in balanced paragraphs\n- Use logical transitions between points\n- Conclude with reinforcement of main argument' 
                  },
                ],
                activities: { 
                  type: 'exercises',
                  questions: [
                    { 
                      type: 'sentence_construction_practice', 
                      question: '**Exercise 1: Sentence Type Construction**\n\nTransform the following simple sentences into the requested types:\n\nBase Sentence: "The students prepared for the examination."\n\nTasks:\n1. Create a compound sentence by adding another independent clause.\n2. Create a complex sentence by adding a dependent clause.\n3. Create a compound-complex sentence combining both techniques.\n\nBase Sentence: "Ghana exports cocoa to many countries."\n\nTasks:\n4. Transform into a question (interrogative sentence).\n5. Transform into an exclamatory sentence.\n6. Add descriptive details while maintaining proper sentence structure.\n\n**Sample Answers:**\n1. Compound: "The students prepared for the examination, and they felt confident about their performance."\n2. Complex: "Because the examination was approaching, the students prepared thoroughly."\n3. Compound-Complex: "Because the examination was important, the students prepared carefully, and their teachers provided extra support."\n\n**Learning Goal:** Practice constructing different sentence types to add variety and express complex relationships between ideas.' 
                    },
                    { 
                      type: 'paragraph_structure_building', 
                      question: '**Exercise 2: Topic Sentence and Supporting Details**\n\nRead this information about mobile money services in Ghana:\n\n"Mobile money has revolutionized financial services in Ghana. People can send money instantly without visiting banks. Small business owners receive payments easily. Rural communities access financial services for the first time. Transaction fees are generally affordable. Users need basic mobile phones, not smartphones. The system works even in areas with limited internet. However, some people worry about security. Network problems sometimes cause delays. Users need education about proper usage."\n\nTasks:\n1. Write a strong topic sentence that introduces the main idea.\n2. Organize the information into two paragraphs: Benefits (Paragraph 1) and Challenges (Paragraph 2).\n3. Write appropriate supporting sentences for each paragraph.\n4. Add concluding sentences that reinforce the main ideas.\n5. Include transitional words to show relationships between ideas.\n\n**Assessment Focus:** Creating unified, coherent paragraphs with clear structure and logical development.' 
                    },
                    { 
                      type: 'sentence_combining_challenge', 
                      question: '**Exercise 3: Sentence Combining for Variety**\n\nCombine these short, choppy sentences into more sophisticated versions:\n\nSet A: "It was market day. Many people came to town. They brought products to sell. The market was very busy. Traffic was heavy."\n\nSet B: "The school organized a reading competition. Students from all classes participated. The competition was held in the assembly hall. Parents came to watch. The winners received prizes."\n\nSet C: "Climate change affects farming in Ghana. Rainfall patterns are changing. Some areas receive too much rain. Other areas experience drought. Farmers need new strategies."\n\nFor each set:\n1. Combine sentences using coordinating conjunctions (and, but, or, so).\n2. Combine sentences using subordinating conjunctions (because, although, when, since).\n3. Create one version that uses sentence variety (mix of simple, compound, and complex sentences).\n\n**Learning Goal:** Develop skills in creating sentence variety and eliminating choppy, monotonous writing.' 
                    },
                    { 
                      type: 'unity_and_coherence_practice', 
                      question: '**Exercise 4: Improving Unity and Coherence**\n\nRevise this poorly organized paragraph to improve unity and coherence:\n\n"Education is important in Ghana. Many students walk long distances to school. The government has built new schools. Teachers need better training. My cousin is studying at the University of Ghana. Free Senior High School policy helps families. Some schools lack computers. Education improves job opportunities. The library in my town needs more books. Students should study hard."\n\nTasks:\n1. Identify the main topic this paragraph should focus on.\n2. Remove sentences that don\'t belong (lack unity).\n3. Reorganize remaining sentences in logical order.\n4. Add transitional words to improve flow.\n5. Write a clear topic sentence and concluding sentence.\n6. Explain your revision choices.\n\n**Assessment Criteria:** Demonstrates understanding of paragraph unity, logical organization, and coherent transitions.' 
                    },
                    { 
                      type: 'error_correction_workshop', 
                      question: '**Exercise 5: Grammar and Structure Error Correction**\n\nIdentify and correct the errors in these sentences:\n\n1. "The students who studied hard and prepared well for the examination they passed with excellent grades."\n\n2. "Each of the teachers have their own teaching methods."\n\n3. "Walking to the market, the heavy rain started falling."\n\n4. "The school has many facilities like a library, computer lab, and having a science laboratory."\n\n5. "Because the government is investing in education, therefore more students can attend Senior High School."\n\n6. "The examination was difficult, many students found it challenging, some failed."\n\nFor each sentence:\n1. Identify the type of error (fragment, run-on, agreement, etc.).\n2. Explain why it is incorrect.\n3. Provide a corrected version.\n4. Suggest an alternative correct version using different sentence structure.\n\n**Learning Goal:** Develop editing skills to identify and correct common sentence-level problems.' 
                    },
                    { 
                      type: 'descriptive_paragraph_writing', 
                      question: '**Exercise 6: Descriptive Paragraph Composition**\n\nWrite a well-structured descriptive paragraph (8-10 sentences) about ONE of these Ghanaian settings:\n\nOption A: Your local market on a busy Saturday morning\nOption B: A traditional festival in your community\nOption C: Your school compound during break time\nOption D: A typical evening in your neighborhood\n\nRequirements:\n- Start with a clear topic sentence that introduces the setting\n- Use specific sensory details (what you see, hear, smell, feel)\n- Organize details in logical spatial order (near to far, left to right, etc.)\n- Include at least three different sentence types\n- Use descriptive adjectives and specific nouns\n- End with a concluding sentence that reinforces the overall impression\n- Use transitional words to show spatial relationships (near, behind, across, etc.)\n\nSelf-Assessment Checklist:\n□ Topic sentence clearly introduces the setting\n□ Supporting sentences provide vivid, specific details\n□ Ideas are organized in logical order\n□ Sentence variety maintains reader interest\n□ Concluding sentence provides effective closure\n□ Grammar and mechanics are correct\n\n**Learning Goal:** Apply paragraph structure principles to create engaging descriptive writing with clear organization.' 
                    },
                    { 
                      type: 'formal_paragraph_analysis', 
                      question: '**Exercise 7: Academic Paragraph Analysis and Creation**\n\nAnalyze this model academic paragraph, then create your own:\n\nModel: "Technology has significantly transformed education in Ghana over the past decade. The introduction of digital learning platforms has enabled students in rural areas to access quality educational resources previously available only in urban schools. Government initiatives such as the distribution of laptops to schools have improved students\' computer literacy skills and prepared them for modern workplace demands. Furthermore, online learning during the COVID-19 pandemic demonstrated both the potential and challenges of technology-based education. While connectivity issues and power outages remain obstacles, the overall impact of educational technology has been positive, creating new opportunities for teaching and learning across the country."\n\nAnalysis Tasks:\n1. Identify the topic sentence and explain how it introduces the main idea.\n2. List the supporting details and explain how each one develops the main idea.\n3. Find transitional words/phrases and explain their function.\n4. Analyze the concluding sentence and its effectiveness.\n\nCreation Task:\nWrite your own academic paragraph (6-8 sentences) about ONE of these topics:\n- The importance of learning local languages in Ghanaian schools\n- Benefits and challenges of the Free SHS policy\n- The role of sports in student development\n- Environmental conservation in Ghanaian communities\n\nYour paragraph must include:\n- A clear topic sentence\n- At least three supporting details\n- Appropriate transitions\n- A strong concluding sentence\n- Formal academic tone throughout\n\n**Learning Goal:** Master academic paragraph structure and develop skills for formal educational writing.' 
                    },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'BECE-Style Question 1 (Sentence Construction):\n\nConstruct sentences using the following groups of words. Ensure that your sentences are grammatically correct and meaningful.\n\na) students / examination / prepared / diligently / the / for / their\nb) Ghana / independence / achieved / 1957 / in / March / on / 6th\nc) mobile phones / communication / have / revolutionized / modern\n\n[6 marks - 2 marks each]', 
                    solution: 'Sample Answers:\n\na) The students prepared diligently for their examination.\nAlternative: Students prepared diligently for their examination.\n\nb) Ghana achieved independence on March 6th, 1957.\nAlternative: On March 6th, 1957, Ghana achieved independence.\n\nc) Mobile phones have revolutionized modern communication.\nAlternative: Modern communication has been revolutionized by mobile phones.\n\nMarking Criteria:\n- Correct word order and sentence structure (1 mark each)\n- Proper grammar and punctuation (0.5 marks each)\n- Clear meaning and appropriate vocabulary use (0.5 marks each)\n\nNote: Alternative arrangements are acceptable as long as they maintain grammatical correctness and clear meaning.' 
                  },
                  { 
                    question: 'Sentence Types Identification (BECE 2019 Adapted):\n\nIdentify the sentence type for each of the following sentences:\n\na) "Because the weather was favorable, farmers had a good harvest."\nb) "The students studied hard, and they passed their examinations."\nc) "Education is the key to success."\nd) "Although the road was rough, the driver continued the journey, and passengers remained calm."\n\n[8 marks - 2 marks each]', 
                    solution: 'Answers with Explanations:\n\na) Complex Sentence\nExplanation: Contains one independent clause ("farmers had a good harvest") and one dependent clause ("Because the weather was favorable") connected by a subordinating conjunction.\n\nb) Compound Sentence\nExplanation: Contains two independent clauses ("The students studied hard" and "they passed their examinations") joined by the coordinating conjunction "and."\n\nc) Simple Sentence\nExplanation: Contains only one independent clause with a subject ("Education") and predicate ("is the key to success").\n\nd) Compound-Complex Sentence\nExplanation: Contains two independent clauses ("the driver continued the journey" and "passengers remained calm") and one dependent clause ("Although the road was rough").\n\nMarking Criteria:\n- Correct identification (1 mark each)\n- Accurate explanation of structure (1 mark each)' 
                  },
                  { 
                    question: 'Paragraph Organization (BECE 2020 Style):\n\nRead the following jumbled sentences and reorganize them into a coherent paragraph. Write your answer by indicating the correct order using the letters provided.\n\nA. As a result, many students can now afford to complete their secondary education.\nB. The Free Senior High School policy has had significant impact on education in Ghana.\nC. Previously, many talented students dropped out due to financial constraints.\nD. This policy eliminates tuition fees, provides textbooks, and covers boarding costs.\nE. Consequently, enrollment in Senior High Schools has increased dramatically across all regions.\n\n[5 marks]', 
                    solution: 'Correct Order: B, C, D, A, E\n\nLogical Paragraph Organization:\n\nB. The Free Senior High School policy has had significant impact on education in Ghana. (Topic sentence introducing the main idea)\n\nC. Previously, many talented students dropped out due to financial constraints. (Background/problem context)\n\nD. This policy eliminates tuition fees, provides textbooks, and covers boarding costs. (Explanation of the solution)\n\nA. As a result, many students can now afford to complete their secondary education. (Immediate result)\n\nE. Consequently, enrollment in Senior High Schools has increased dramatically across all regions. (Broader impact/conclusion)\n\nExplanation of Organization:\n- Topic sentence states the main idea\n- Background explains the previous problem\n- Policy details provide specific information\n- Results show cause-and-effect relationships\n- Conclusion demonstrates broader impact\n\nMarking: 1 mark for each sentence placed in correct position.' 
                  },
                  { 
                    question: 'Error Correction (BECE 2018 Adapted):\n\nCorrect the errors in the following sentences:\n\na) "The group of students were discussing about their project."\nb) "Each teacher have their own teaching methods."\nc) "Running to catch the bus, my books fell down."\nd) "The examination was very difficult, most students found it challenging."\n\n[8 marks - 2 marks each]', 
                    solution: 'Corrected Sentences with Explanations:\n\na) Corrected: "The group of students was discussing their project."\nErrors Fixed:\n- Subject-verb disagreement: "group" (singular) requires "was" not "were"\n- Redundant preposition: "discuss" doesn\'t need "about"\n\nb) Corrected: "Each teacher has his or her own teaching methods." OR "Teachers have their own teaching methods."\nError Fixed:\n- Subject-verb disagreement: "Each" (singular) requires "has" not "have"\n- Alternative: Change to plural subject for plural pronoun agreement\n\nc) Corrected: "While I was running to catch the bus, my books fell down." OR "As I ran to catch the bus, my books fell down."\nError Fixed:\n- Dangling modifier: Original doesn\'t clearly show who was running\n- Added clear subject to eliminate confusion\n\nd) Corrected: "The examination was very difficult; most students found it challenging." OR "The examination was very difficult, so most students found it challenging."\nError Fixed:\n- Comma splice: Two independent clauses can\'t be joined by comma alone\n- Solutions: Use semicolon or add coordinating conjunction\n\nMarking Criteria:\n- Identification of error type (1 mark each)\n- Correct solution (1 mark each)' 
                  },
                  { 
                    question: 'Topic Sentence Writing (BECE 2021 Style):\n\nWrite appropriate topic sentences for paragraphs that would discuss the following subjects:\n\na) The benefits of reading for Junior High School students\nb) Challenges facing small-scale farmers in Ghana\nc) The importance of environmental conservation in communities\nd) How technology has changed communication in Ghana\n\n[8 marks - 2 marks each]', 
                    solution: 'Sample Topic Sentences:\n\na) "Regular reading provides Junior High School students with multiple academic and personal benefits that contribute to their overall success."\n\nAlternative: "Reading extensively helps JHS students improve their vocabulary, comprehension skills, and academic performance across all subjects."\n\nb) "Small-scale farmers in Ghana face several interconnected challenges that threaten their productivity and livelihoods."\n\nAlternative: "Despite their crucial role in food production, small-scale farmers in Ghana encounter numerous obstacles that limit their agricultural success."\n\nc) "Environmental conservation requires active community participation and commitment to sustainable practices that protect natural resources for future generations."\n\nAlternative: "Effective environmental conservation in Ghanaian communities depends on education, cooperation, and practical actions by all residents."\n\nd) "Technology has fundamentally transformed the way Ghanaians communicate, creating new opportunities and challenges in personal and professional interactions."\n\nAlternative: "The rapid advancement of communication technology has revolutionized how people in Ghana connect, share information, and conduct business."\n\nMarking Criteria for Each Topic Sentence:\n- Clearly states main idea (1 mark)\n- Is specific and focused enough to guide paragraph development (0.5 marks)\n- Uses appropriate vocabulary and grammar (0.5 marks)\n\nNote: Alternative phrasings are acceptable if they meet these criteria.' 
                  },
                  { 
                    question: 'Paragraph Unity (BECE 2017 Style):\n\nRead the paragraph below and identify which sentences destroy the unity. Explain why these sentences should be removed.\n\n"The school feeding program has greatly benefited students in rural Ghana. ¹Students now receive nutritious meals during school hours, which improves their concentration and academic performance. ²My sister studies at the University of Cape Coast. ³The program also encourages regular school attendance, as children know they will receive a meal at school. ⁴Malaria is a serious problem in rural areas. ⁵Additionally, the program supports local farmers by purchasing ingredients from nearby communities. ⁶This creates employment opportunities and stimulates local economic development."\n\n[6 marks]', 
                    solution: 'Sentences That Destroy Unity:\n\nSentence 2: "My sister studies at the University of Cape Coast."\nReason for Removal: This sentence introduces a completely unrelated topic about the writer\'s sister\'s education, which has no connection to the school feeding program. It breaks the focus on the main topic.\n\nSentence 4: "Malaria is a serious problem in rural areas."\nReason for Removal: While this statement is true and relates to rural areas, it doesn\'t connect to the school feeding program\'s benefits. It introduces a different health topic that distracts from the main discussion.\n\nExplanation of Unity Concept:\nParagraph unity means all sentences must support and develop the main idea stated or implied in the topic sentence. The main idea here is "The school feeding program has greatly benefited students in rural Ghana." Every sentence should explain or provide evidence for these benefits.\n\nSentences That Maintain Unity:\n- Sentence 1: Topic sentence establishing main idea\n- Sentence 3: Explains attendance benefits\n- Sentence 5: Discusses economic benefits to farmers\n- Sentence 6: Elaborates on economic impact\n\nRevised Paragraph:\n"The school feeding program has greatly benefited students in rural Ghana. Students now receive nutritious meals during school hours, which improves their concentration and academic performance. The program also encourages regular school attendance, as children know they will receive a meal at school. Additionally, the program supports local farmers by purchasing ingredients from nearby communities. This creates employment opportunities and stimulates local economic development."\n\nMarking Criteria:\n- Correct identification of unity-breaking sentences (3 marks)\n- Clear explanation of why they should be removed (3 marks)' 
                  },
                  { 
                    question: 'Sentence Variety (BECE 2022 Style):\n\nRewrite the following passage to improve sentence variety and flow. The current version uses too many simple sentences and lacks smooth transitions.\n\n"Ghana is located in West Africa. It has a population of about 30 million people. The country exports cocoa. It also exports gold and oil. The capital city is Accra. Accra is a busy commercial center. Many people live in rural areas. They engage in farming. The climate is tropical. There are two main seasons."\n\n[10 marks]', 
                    solution: 'Improved Version with Sentence Variety:\n\n"Ghana, located in West Africa, has a population of approximately 30 million people. The country\'s economy relies heavily on exports, particularly cocoa, gold, and oil, which contribute significantly to national revenue. While Accra serves as both the capital city and a busy commercial center, many Ghanaians live in rural areas where they primarily engage in farming activities. Due to its tropical climate, the country experiences two distinct main seasons that influence both agricultural practices and daily life."\n\nImprovements Made:\n\n1. **Sentence Combining:**\n   - Combined location and population information in opening sentence\n   - Merged export information into one complex sentence\n   - Connected capital city information with rural living contrast\n\n2. **Sentence Type Variety:**\n   - Complex sentences with dependent clauses\n   - Compound sentences with coordinating conjunctions\n   - Use of participial phrases and appositives\n\n3. **Transitional Elements:**\n   - "While" to show contrast\n   - "Due to" to show cause-effect relationship\n   - "Both...and" to show parallel ideas\n\n4. **Improved Flow:**\n   - Logical progression from location/population → economy → geography/lifestyle → climate\n   - Smoother connections between related ideas\n   - Elimination of choppy, repetitive structure\n\nMarking Criteria:\n- Effective sentence combining (3 marks)\n- Appropriate use of different sentence types (3 marks)\n- Smooth transitions and coherence (2 marks)\n- Grammar and mechanics (2 marks)' 
                  },
                  { 
                    question: 'Paragraph Development (BECE 2016 Adapted):\n\nDevelop a complete paragraph (6-8 sentences) on the topic: "The importance of studying local languages in Ghanaian schools."\n\nYour paragraph must include:\n- A clear topic sentence\n- At least three supporting ideas with specific details\n- Appropriate transitions\n- A concluding sentence\n\n[12 marks]', 
                    solution: 'Sample Paragraph:\n\n"Learning local languages in Ghanaian schools is essential for preserving cultural heritage and promoting national unity. First, studying indigenous languages such as Twi, Ewe, or Dagbani helps students maintain strong connections to their ancestral traditions, proverbs, and cultural wisdom that might otherwise be lost to younger generations. Additionally, local language education enables students to communicate effectively with elders in their communities, facilitating the transmission of traditional knowledge about farming, crafts, and social customs. Furthermore, when students from different ethnic groups learn each other\'s languages, it promotes mutual understanding and reduces ethnic tensions that can divide communities. Most importantly, local language proficiency allows students to serve as cultural ambassadors who can bridge the gap between traditional and modern Ghana. Therefore, incorporating local language study into school curricula strengthens both individual cultural identity and national cohesion."\n\nAnalysis of Paragraph Structure:\n\n**Topic Sentence:** Clearly states the main argument about importance of local language study\n\n**Supporting Ideas:**\n1. Preserving cultural heritage and traditions\n2. Improving communication with elders\n3. Promoting inter-ethnic understanding\n4. Creating cultural ambassadors\n\n**Transitions Used:**\n- "First" (introduces first point)\n- "Additionally" (adds second point)\n- "Furthermore" (adds third point)\n- "Most importantly" (emphasizes key point)\n- "Therefore" (introduces conclusion)\n\n**Concluding Sentence:** Reinforces main idea and broader significance\n\n**Specific Details:**\n- Names specific languages (Twi, Ewe, Dagbani)\n- Mentions specific cultural elements (proverbs, farming, crafts)\n- Explains concrete benefits (reducing tensions, bridging gaps)\n\nMarking Criteria:\n- Clear topic sentence (2 marks)\n- Three well-developed supporting ideas (6 marks)\n- Effective use of transitions (2 marks)\n- Strong concluding sentence (1 mark)\n- Grammar and mechanics (1 mark)' 
                  },
                  { 
                    question: 'Writing Process Application (BECE 2023 Style):\n\nYou have been asked to write a paragraph about "How mobile money has changed life in Ghana." Explain the steps you would follow in the writing process, from planning to final proofreading.\n\n[10 marks]', 
                    solution: 'Writing Process for Mobile Money Paragraph:\n\n**1. Planning Stage (Brainstorming and Organization):**\n- Brainstorm ideas about mobile money\'s impact: convenience, financial inclusion, business growth, security, rural access\n- Consider specific examples: MTN MoMo, AirtelTigo Money, market vendors, rural farmers\n- Organize main points in logical order: introduction of technology → benefits → challenges → overall impact\n- Decide on paragraph focus: positive transformation with acknowledgment of limitations\n\n**2. Drafting Stage:**\n- Write topic sentence establishing main argument: "Mobile money services have fundamentally transformed daily life in Ghana..."\n- Develop supporting sentences with specific examples: rural farmers receiving payments, market vendors avoiding cash handling, families sending money across regions\n- Include transitional phrases to connect ideas smoothly\n- Draft concluding sentence that reinforces the transformation theme\n- Focus on getting complete ideas down without worrying about perfect grammar\n\n**3. Revising Stage (Content and Organization):**\n- Check topic sentence clarity and strength\n- Ensure all supporting sentences relate directly to main idea (unity)\n- Verify logical flow of ideas (coherence)\n- Add specific examples if needed: "For instance, a farmer in Tamale can now receive payment from a buyer in Accra instantly"\n- Strengthen connections between sentences with better transitions\n- Ensure concluding sentence effectively reinforces main point\n\n**4. Editing Stage (Sentence Structure and Grammar):**\n- Check for sentence variety (mix of simple, compound, complex sentences)\n- Verify subject-verb agreement: "Mobile money services have..." (not "has")\n- Correct any run-on sentences or fragments\n- Improve word choice for precision and clarity\n- Ensure proper punctuation throughout\n\n**5. Proofreading Stage (Final Polish):**\n- Check spelling of technical terms: "Ghana," proper names of mobile money services\n- Verify capitalization of proper nouns\n- Read aloud to catch awkward phrasing\n- Double-check punctuation marks\n- Ensure neat, legible presentation\n\n**Self-Assessment Questions:**\n- Does my topic sentence clearly state the main idea?\n- Do all supporting sentences develop that main idea?\n- Are my examples specific and relevant?\n- Does the paragraph flow logically from beginning to end?\n- Is my language clear and appropriate for the audience?\n\nMarking Criteria:\n- Understanding of planning process (2 marks)\n- Clear explanation of drafting approach (2 marks)\n- Comprehensive revision strategies (2 marks)\n- Appropriate editing focus (2 marks)\n- Thorough proofreading checklist (2 marks)' 
                  },
                  { 
                    question: 'Advanced Application (BECE 2020 Extended):\n\nWrite two paragraphs about "The role of education in Ghana\'s development." The first paragraph should focus on individual benefits, and the second should focus on national benefits. Ensure that your paragraphs demonstrate:\n- Clear topic sentences\n- Unity and coherence\n- Sentence variety\n- Appropriate transitions between and within paragraphs\n\n[15 marks]', 
                    solution: 'Sample Two-Paragraph Response:\n\n**Paragraph 1 (Individual Benefits):**\n"Education provides numerous personal benefits that transform individual lives and create opportunities for social mobility in Ghana. When students acquire knowledge and skills through formal schooling, they develop critical thinking abilities that help them make informed decisions about health, finances, and career choices. Moreover, educated individuals typically earn higher incomes than those without formal education, enabling them to support their families, build better homes, and access quality healthcare services. Education also builds confidence and communication skills that allow people to participate effectively in community discussions, advocate for their rights, and contribute meaningfully to local development projects. Additionally, educated parents are more likely to prioritize their children\'s schooling, creating a positive cycle that benefits future generations. Through these cumulative effects, education empowers individuals to break free from poverty and achieve their personal aspirations."\n\n**Paragraph 2 (National Benefits):**\n"Beyond individual advantages, education serves as the foundation for Ghana\'s broader economic development and social progress. A well-educated population attracts foreign investment because companies seek skilled workers who can adapt to modern technology and global business practices. Furthermore, educated citizens are better equipped to start innovative businesses, develop new technologies, and create employment opportunities that stimulate economic growth across various sectors. Education also strengthens democratic institutions by producing informed voters who can evaluate political policies critically and hold leaders accountable for their promises and performance. Additionally, when more Ghanaians receive quality education, the country reduces its dependence on foreign expertise and develops the human resources necessary for sustainable development in agriculture, healthcare, engineering, and other critical fields. Consequently, investing in education today ensures that Ghana will have the knowledge-based economy needed to compete successfully in the twenty-first century."\n\n**Analysis of Writing Techniques:**\n\n**Topic Sentences:**\n- Paragraph 1: Clearly focuses on individual/personal benefits\n- Paragraph 2: Explicitly shifts to national/broader benefits\n\n**Unity:**\n- All sentences in each paragraph support the respective main ideas\n- No unrelated information included\n\n**Coherence and Transitions:**\n- Within paragraphs: "When," "Moreover," "Additionally," "Furthermore"\n- Between paragraphs: "Beyond individual advantages" creates clear transition\n\n**Sentence Variety:**\n- Complex sentences with dependent clauses\n- Compound sentences with coordinating conjunctions\n- Varied sentence beginnings and lengths\n- Mix of simple and sophisticated structures\n\n**Specific Examples:**\n- Individual level: higher incomes, better homes, healthcare access\n- National level: foreign investment, business development, democratic participation\n\n**Concluding Elements:**\n- Paragraph 1 ends with cycle concept and empowerment theme\n- Paragraph 2 ends with future-oriented vision\n\nMarking Criteria:\n- Clear topic sentences (3 marks)\n- Unity in both paragraphs (3 marks)\n- Coherence and transitions (3 marks)\n- Sentence variety and structure (3 marks)\n- Content development and examples (3 marks)' 
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: 'mcq',
                    question: 'What is the most essential characteristic of a well-constructed sentence?',
                    options: [
                      'It must be at least ten words long to provide sufficient detail',
                      'It must express a complete thought with proper grammar and punctuation',
                      'It must include multiple adjectives and adverbs for description',
                      'It must always follow the pattern of subject + verb + object + modifier'
                    ],
                    answer: 'It must express a complete thought with proper grammar and punctuation',
                    explanation: 'A sentence must express a complete thought and be grammatically correct to communicate effectively. Length, descriptive words, and specific patterns are less important than clarity and completeness of meaning.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which sentence type contains one independent clause and at least one dependent clause?',
                    options: [
                      'Simple sentence',
                      'Compound sentence', 
                      'Complex sentence',
                      'Compound-complex sentence'
                    ],
                    answer: 'Complex sentence',
                    explanation: 'A complex sentence has one independent clause (complete thought) and one or more dependent clauses (incomplete thoughts that rely on the main clause). Compound sentences have multiple independent clauses, while simple sentences have only one independent clause.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the primary function of a topic sentence in a paragraph?',
                    options: [
                      'To provide the most interesting detail in the paragraph',
                      'To introduce the main idea that all other sentences will support and develop',
                      'To conclude the paragraph with a summary of all points',
                      'To create a transition between the current and previous paragraphs'
                    ],
                    answer: 'To introduce the main idea that all other sentences will support and develop',
                    explanation: 'The topic sentence states the main idea or central point of the paragraph. All supporting sentences should relate to and develop this main idea to maintain paragraph unity.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which error is demonstrated in this sentence: "The students studied hard, they passed their examinations"?',
                    options: [
                      'Sentence fragment',
                      'Run-on sentence',
                      'Comma splice',
                      'Subject-verb disagreement'
                    ],
                    answer: 'Comma splice',
                    explanation: 'A comma splice occurs when two independent clauses are joined only by a comma. This should be corrected by using a semicolon, adding a coordinating conjunction, or separating into two sentences.'
                  },
                  {
                    type: 'mcq',
                    question: 'What does "paragraph unity" mean?',
                    options: [
                      'All paragraphs in an essay should be exactly the same length',
                      'All sentences in a paragraph should relate to one main idea or topic',
                      'Every paragraph must contain exactly five to seven sentences',
                      'All paragraphs should use the same sentence structures and patterns'
                    ],
                    answer: 'All sentences in a paragraph should relate to one main idea or topic',
                    explanation: 'Unity means that every sentence in a paragraph supports, explains, or develops the main idea presented in the topic sentence. Sentences that introduce unrelated topics destroy unity.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which transitional phrase best shows a cause-and-effect relationship?',
                    options: [
                      'In addition to this important point',
                      'On the other hand, we must consider',
                      'As a result of these changes',
                      'For example, let us examine'
                    ],
                    answer: 'As a result of these changes',
                    explanation: 'Cause-and-effect transitions include "as a result," "consequently," "therefore," and "because." These show how one event or idea leads to another, helping readers understand relationships between ideas.'
                  },
                  {
                    type: 'mcq',
                    question: 'Why is sentence variety important in effective writing?',
                    options: [
                      'It demonstrates that the writer knows complicated vocabulary words',
                      'It maintains reader interest and creates natural rhythm and flow',
                      'It ensures that every paragraph contains the same number of words',
                      'It proves that the writer can memorize complex grammar rules'
                    ],
                    answer: 'It maintains reader interest and creates natural rhythm and flow',
                    explanation: 'Sentence variety prevents monotonous writing by mixing different sentence lengths and structures. This creates engaging prose that holds the reader\'s attention and sounds natural when read aloud.'
                  },
                  {
                    type: 'mcq',
                    question: 'What is the most effective way to correct a sentence fragment?',
                    options: [
                      'Add more adjectives and adverbs to make it longer',
                      'Combine it with a complete sentence or add missing elements to make it complete',
                      'Change all the nouns to pronouns for variety',
                      'Move the fragment to the end of the paragraph'
                    ],
                    answer: 'Combine it with a complete sentence or add missing elements to make it complete',
                    explanation: 'Fragments lack either a subject, verb, or complete thought. They can be corrected by adding missing elements or combining with nearby complete sentences to form a grammatically correct statement.'
                  },
                  {
                    type: 'mcq',
                    question: 'In the writing process, what should you focus on during the drafting stage?',
                    options: [
                      'Getting complete ideas down on paper without worrying about perfection',
                      'Correcting every spelling and grammar error as you write',
                      'Making sure every sentence follows exactly the same structure',
                      'Consulting a dictionary for every word you are unsure about'
                    ],
                    answer: 'Getting complete ideas down on paper without worrying about perfection',
                    explanation: 'During drafting, the goal is to develop your ideas fully without stopping to edit. Focusing on perfection during drafting can interrupt the flow of ideas and prevent you from developing content effectively.'
                  },
                  {
                    type: 'mcq',
                    question: 'Which technique best improves coherence in paragraph writing?',
                    options: [
                      'Using the same sentence pattern throughout the paragraph',
                      'Including personal opinions in every supporting sentence',
                      'Using transitional words and repeating key terms to connect ideas',
                      'Making every sentence exactly the same length'
                    ],
                    answer: 'Using transitional words and repeating key terms to connect ideas',
                    explanation: 'Coherence is achieved through logical connections between sentences. Transitions show relationships between ideas, while repeated key terms and pronouns create links that help readers follow the progression of thought.'
                  },
                  {
                    type: 'truefalse',
                    statement: 'A compound sentence must always contain exactly two independent clauses joined by a coordinating conjunction.',
                    reason: 'While compound sentences commonly contain two independent clauses, they can contain more than two, as long as they are joined by coordinating conjunctions or semicolons. The key requirement is multiple independent clauses, not specifically two.',
                    answer: 'false'
                  },
                  {
                    type: 'truefalse',
                    statement: 'The topic sentence of a paragraph should always be the first sentence and can never appear in the middle or end.',
                    reason: 'While topic sentences commonly appear at the beginning of paragraphs, skilled writers sometimes place them in the middle or end for emphasis or stylistic effect. The important thing is that the main idea is clearly stated somewhere in the paragraph.',
                    answer: 'false'
                  },
                  {
                    type: 'fillblank',
                    sentence: 'A __________ sentence contains two or more independent clauses joined by coordinating conjunctions such as "and," "but," or "so."',
                    answer: 'compound',
                    explanation: 'Compound sentences combine multiple complete thoughts (independent clauses) using coordinating conjunctions (and, but, or, nor, for, yet, so) or semicolons to show relationships between equal ideas.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which elements are essential for paragraph unity? (Select all correct answers)',
                    options: [
                      'All sentences must relate to the main topic or idea',
                      'Every paragraph must contain exactly the same number of sentences',
                      'Supporting sentences must develop or explain the topic sentence',
                      'Personal opinions should be included in every paragraph',
                      'Irrelevant information should be removed during revision'
                    ],
                    correctAnswers: [
                      'All sentences must relate to the main topic or idea',
                      'Supporting sentences must develop or explain the topic sentence',
                      'Irrelevant information should be removed during revision'
                    ],
                    explanation: 'Paragraph unity requires that all content supports the main idea. Supporting sentences should develop the topic sentence, and unrelated information destroys unity. Paragraph length and personal opinions are not requirements for unity.'
                  },
                  {
                    type: 'multiple_select',
                    question: 'Which strategies effectively create sentence variety in writing? (Choose all that apply)',
                    options: [
                      'Mixing simple, compound, and complex sentence structures',
                      'Using exactly the same sentence length throughout the essay',
                      'Varying sentence beginnings with different types of phrases',
                      'Starting every sentence with the subject followed by the verb',
                      'Combining short, choppy sentences into more sophisticated structures'
                    ],
                    correctAnswers: [
                      'Mixing simple, compound, and complex sentence structures',
                      'Varying sentence beginnings with different types of phrases',
                      'Combining short, choppy sentences into more sophisticated structures'
                    ],
                    explanation: 'Sentence variety involves mixing different structures, varying beginnings, and combining related ideas. Using the same length or pattern throughout creates monotonous writing rather than variety.'
                  },
                  {
                    type: 'matching',
                    question: 'Match each writing problem to its appropriate solution.',
                    pairs: [
                      { left: 'Sentence fragment', right: 'Add missing subject, verb, or combine with complete sentence' },
                      { left: 'Run-on sentence', right: 'Use periods, semicolons, or coordinating conjunctions to separate ideas' },
                      { left: 'Comma splice', right: 'Replace comma with semicolon or add coordinating conjunction' },
                      { left: 'Lack of unity', right: 'Remove sentences that don\'t support the main topic' },
                    ],
                    explanation: 'Each writing problem requires a specific solution: fragments need completion, run-ons need separation, comma splices need proper connection, and unity problems need irrelevant content removal. Understanding these solutions helps in effective revision.'
                  },
                  {
                    type: 'shortanswer',
                    question: 'Explain how mastering sentence construction and paragraph development will help you succeed in BECE examinations and prepare you for future academic writing. Give specific examples.',
                    answer: 'Strong sentence and paragraph skills are essential for BECE success and future academic achievement. In BECE English Language examinations, essay questions require clear topic sentences, well-developed supporting paragraphs, and varied sentence structures that demonstrate language proficiency. Students who can construct complex sentences and organize coherent paragraphs score higher because they communicate ideas clearly and maintain examiner interest. For example, in argumentative essays about education or environment, effective paragraphs with strong topic sentences and logical support help students present convincing arguments within time limits. These skills also support comprehension answers, where clear sentence construction helps students explain their understanding accurately. Beyond BECE, these foundational skills prepare students for Senior High School and university writing demands, including research papers, analytical essays, and professional communication that require sophisticated paragraph development and sentence variety. In future careers, whether in education, business, healthcare, or government, the ability to write clear, well-organized documents determines professional success and advancement opportunities.',
                    explanation: 'This question assesses understanding of how basic writing skills transfer to academic success and professional applications. Strong answers should connect specific techniques to examination performance and demonstrate awareness of progressive skill development.'
                  },
                ],
                summary: 'Effective sentence construction and paragraph development form the foundation of all successful writing, from BECE examinations to professional communication. Mastering the four sentence types (simple, compound, complex, compound-complex) and understanding proper grammar rules enables clear expression of increasingly sophisticated ideas. Well-structured paragraphs with strong topic sentences, unified supporting details, and logical organization help readers follow your reasoning and appreciate your knowledge. Unity ensures all sentences support the main idea, while coherence creates smooth flow through appropriate transitions and connections between ideas. Sentence variety maintains reader interest and demonstrates language proficiency through varied structures and beginnings. The writing process - planning, drafting, revising, editing, and proofreading - provides systematic approaches for developing ideas and refining expression. Regular practice with error correction builds editing skills that improve all written work. These fundamental skills support success across academic subjects, enhance BECE performance, and prepare students for advanced writing demands in higher education and professional careers. Remember that effective writing develops through consistent practice, careful revision, and attention to both content development and mechanical accuracy.',
              },
            ];
          },
          {
            id: 'eng104',
            slug: 'grammar-usage-1',
            title: 'Grammar & Usage',
            lessons: [
               {
                id: 'eng104-1',
                slug: 'parts-of-speech',
                title: 'Parts of Speech',
                objectives: [
                  'Define what parts of speech are and explain their importance in English grammar.',
                  'Identify and classify all eight parts of speech in sentences: nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.',
                  'Understand the specific function of each part of speech in sentence construction.',
                  'Distinguish between different types within each part of speech (e.g., common vs proper nouns, action vs linking verbs).',
                  'Recognize that some words can function as different parts of speech depending on context.',
                  'Use all eight parts of speech correctly and appropriately in writing and speaking.',
                  'Analyze sentences to determine the grammatical role of each word.',
                  'Apply knowledge of parts of speech to improve sentence structure and variety.',
                  'Answer BECE-style examination questions on parts of speech accurately.',
                ],
                introduction: 'Parts of speech are the building blocks of the English language. Every word in a sentence belongs to one of eight categories, and understanding these categories is essential for mastering grammar. Just as a builder needs different materials (bricks, cement, wood, nails) to construct a house, we need different parts of speech to build clear, correct, and meaningful sentences. In the BECE English Language examination, questions on parts of speech test your ability to identify and use words correctly. This comprehensive lesson will give you complete mastery of all eight parts of speech, preparing you for excellence in your exams and effective communication in everyday life.',
                keyConcepts: [
                  { 
                    title: '1. What Are Parts of Speech?', 
                    content: 'Parts of speech are categories that words belong to based on their function and meaning in a sentence. There are EIGHT parts of speech in English:\n\n1. NOUN - naming words\n2. PRONOUN - words that replace nouns\n3. VERB - action or state words\n4. ADJECTIVE - describing words for nouns\n5. ADVERB - words that describe verbs, adjectives, or other adverbs\n6. PREPOSITION - words showing relationships\n7. CONJUNCTION - joining words\n8. INTERJECTION - exclamatory words\n\nIMPORTANT: The same word can be different parts of speech depending on how it is used in a sentence.\n\nExample:\n• "I will run tomorrow." (run = verb)\n• "I went for a run." (run = noun)\n• "The water is cold." (water = noun)\n• "Please water the plants." (water = verb)' 
                  },
                  { 
                    title: '2. NOUNS - Naming Words', 
                    content: 'A NOUN is a word that names a person, place, animal, thing, or idea.\n\nTYPES OF NOUNS:\n• Proper Nouns: Specific names (Kofi, Ghana, Monday) - Always CAPITALIZED\n• Common Nouns: General names (boy, country, day)\n• Concrete Nouns: Things we can see/touch (book, mango, desk)\n• Abstract Nouns: Ideas and feelings (love, freedom, happiness)\n• Collective Nouns: Groups (team, flock, family)\n\nEXAMPLES IN SENTENCES:\n• Kwame lives in Accra. (Kwame = proper noun, Accra = proper noun)\n• The students showed courage. (students = common noun, courage = abstract noun)\n• A flock of birds flew over the school. (flock = collective noun, birds = common noun, school = common noun)\n\nFUNCTIONS:\n• Subject: The teacher teaches. (who teaches?)\n• Object: I saw the teacher. (saw whom?)\n• Complement: She is a teacher. (completes the meaning)' 
                  },
                  { 
                    title: '3. PRONOUNS - Replacement Words', 
                    content: 'A PRONOUN is a word that replaces a noun to avoid repetition.\n\nTYPES OF PRONOUNS:\n• Personal: I, you, he, she, it, we, they, me, him, her, us, them\n• Possessive: mine, yours, his, hers, ours, theirs\n• Reflexive: myself, yourself, himself, herself, itself, ourselves, themselves\n• Demonstrative: this, that, these, those\n• Interrogative: who, whom, whose, which, what\n• Relative: who, whom, whose, which, that\n• Indefinite: someone, anyone, everyone, nobody, something, all, some, many\n• Reciprocal: each other, one another\n\nEXAMPLES:\n• WITHOUT PRONOUNS: Ama went to Ama\'s house because Ama was tired.\n• WITH PRONOUNS: Ama went to her house because she was tired.\n• The students helped each other with the homework. (reciprocal pronoun)\n• Who broke the window? (interrogative pronoun)\n• The book which I borrowed is interesting. (relative pronoun)' 
                  },
                  { 
                    title: '4. VERBS - Action and State Words', 
                    content: 'A VERB is a word that expresses an action, occurrence, or state of being.\n\nTYPES OF VERBS:\n\n1. ACTION VERBS (show what someone/something does):\n• Physical actions: run, jump, eat, write, swim, dance\n• Mental actions: think, believe, know, understand, imagine\nExample: The boy runs fast. (runs = action verb)\n\n2. LINKING VERBS (connect subject to description):\n• Forms of "be": am, is, are, was, were, been, being\n• Sense verbs: look, feel, taste, smell, sound\n• Others: seem, appear, become, remain\nExample: She is happy. (is = linking verb, connects "she" to "happy")\n\n3. HELPING/AUXILIARY VERBS (help main verbs):\n• Primary: be, have, do\n• Modal: can, could, may, might, shall, should, will, would, must\nExample: He has finished his work. (has = helping verb, finished = main verb)\nExample: You should study hard. (should = modal verb, study = main verb)\n\nVERB FORMS:\n• Present: I walk, He walks\n• Past: I walked, He walked\n• Future: I will walk, He will walk\n• Present Continuous: I am walking\n• Past Continuous: I was walking\n• Present Perfect: I have walked\n• Past Perfect: I had walked' 
                  },
                  { 
                    title: '5. ADJECTIVES - Describing Words', 
                    content: 'An ADJECTIVE is a word that describes or modifies a noun or pronoun.\n\nTYPES OF ADJECTIVES:\n\n1. DESCRIPTIVE: Describe qualities\n• Color: red, blue, green\n• Size: big, small, huge, tiny\n• Shape: round, square, flat\n• Quality: beautiful, ugly, good, bad\n• Age: old, young, new, ancient\n\n2. QUANTITATIVE: Show quantity\n• Definite: one, two, three, first, second\n• Indefinite: some, many, few, several, all\n\n3. DEMONSTRATIVE: Point out specific things\n• This, that, these, those\n\n4. POSSESSIVE: Show ownership\n• My, your, his, her, its, our, their\n\n5. INTERROGATIVE: Ask questions\n• Which, what, whose\n\nEXAMPLES:\n• The beautiful girl wore a red dress. (beautiful, red = adjectives)\n• Give me that big book. (that, big = adjectives)\n• Many students passed the difficult exam. (many, difficult = adjectives)\n\nPOSITION:\n• Before noun: a tall tree\n• After linking verb: The tree is tall.\n\nCOMPARISON:\n• Positive: tall, beautiful\n• Comparative: taller, more beautiful (comparing two)\n• Superlative: tallest, most beautiful (comparing three or more)' 
                  },
                  { 
                    title: '6. ADVERBS - Modifying Words', 
                    content: 'An ADVERB is a word that describes/modifies a verb, adjective, or another adverb. Most adverbs end in -ly.\n\nTYPES OF ADVERBS:\n\n1. MANNER (how?): quickly, slowly, carefully, happily, well, badly\n• She speaks fluently.\n• He drives carefully.\n\n2. TIME (when?): now, then, today, yesterday, tomorrow, soon, always, never\n• I will go tomorrow.\n• She always studies hard.\n\n3. PLACE (where?): here, there, everywhere, inside, outside, up, down\n• Come here.\n• The children played outside.\n\n4. FREQUENCY (how often?): always, usually, often, sometimes, rarely, never, daily\n• He usually arrives early.\n• We seldom see her.\n\n5. DEGREE (to what extent?): very, quite, too, extremely, almost, nearly, just\n• She is very intelligent. (modifies adjective "intelligent")\n• He runs extremely fast. (modifies adverb "fast")\n\nEXAMPLES:\n• The students worked diligently. (describes verb "worked" - how?)\n• She is extremely beautiful. (describes adjective "beautiful" - to what extent?)\n• He speaks very clearly. (describes adverb "clearly" - to what extent?)\n• They went inside. (describes verb "went" - where?)\n\nNOTE: Not all adverbs end in -ly:\n• Good examples: well, fast, hard, late, early, far' 
                  },
                  { 
                    title: '7. PREPOSITIONS - Relationship Words', 
                    content: 'A PREPOSITION is a word that shows the relationship between a noun/pronoun and other words in a sentence.\n\nCOMMON PREPOSITIONS:\n\n• PLACE/POSITION: in, on, at, under, over, above, below, beside, between, among, behind, in front of, inside, outside, near, by\n• TIME: at, on, in, before, after, during, since, for, until, by\n• DIRECTION/MOVEMENT: to, from, into, onto, through, across, along, up, down, towards\n• OTHER: with, without, about, of, for, against, by, from\n\nEXAMPLES WITH PLACE:\n• The book is on the table. (position)\n• The cat is under the chair. (position)\n• She sat between Kofi and Ama. (position)\n\nEXAMPLES WITH TIME:\n• I wake up at 6 o\'clock. (specific time)\n• My birthday is on Monday. (specific day)\n• School starts in September. (month)\n• I have lived here for five years. (duration)\n\nEXAMPLES WITH DIRECTION:\n• He walked to the market. (destination)\n• She came from Kumasi. (origin)\n• The bird flew through the window. (movement)\n\nPREPOSITIONAL PHRASES:\nPreposition + noun/pronoun = prepositional phrase\n• in the house\n• under the tree\n• with my friends\n• during the holidays\n\nExample in sentence:\n"The students in the classroom studied for their exams."\n• "in the classroom" = prepositional phrase\n• "for their exams" = prepositional phrase' 
                  },
                  { 
                    title: '8. CONJUNCTIONS - Joining Words', 
                    content: 'A CONJUNCTION is a word that joins words, phrases, or clauses together.\n\nTYPES OF CONJUNCTIONS:\n\n1. COORDINATING CONJUNCTIONS (join equal parts):\nRemember: FANBOYS\n• For - reason\n• And - addition\n• Nor - negative alternative\n• But - contrast\n• Or - choice\n• Yet - contrast\n• So - result\n\nEXAMPLES:\n• Kofi and Ama are friends. (joins two nouns)\n• I wanted to go, but it was raining. (joins two clauses)\n• Study hard, or you will fail. (shows choice)\n• He was tired, so he went to bed. (shows result)\n\n2. SUBORDINATING CONJUNCTIONS (join dependent clause to main clause):\n• Time: when, while, before, after, since, until, as\n• Reason: because, since, as\n• Condition: if, unless, provided that\n• Contrast: although, though, even though, whereas, while\n• Purpose: so that, in order that\n\nEXAMPLES:\n• I will wait until you return. (time)\n• She passed because she studied hard. (reason)\n• If it rains, we will stay home. (condition)\n• Although he is rich, he is humble. (contrast)\n\n3. CORRELATIVE CONJUNCTIONS (work in pairs):\n• either...or\n• neither...nor\n• both...and\n• not only...but also\n\nEXAMPLES:\n• Either you study or you fail.\n• Both Kofi and Ama passed the exam.\n• She is not only intelligent but also hardworking.' 
                  },
                  { 
                    title: '9. INTERJECTIONS - Exclamatory Words', 
                    content: 'An INTERJECTION is a word or phrase that expresses strong emotion or sudden feeling. Interjections are usually followed by an exclamation mark (!) or comma.\n\nCOMMON INTERJECTIONS:\n\nJOY/HAPPINESS:\n• Hurray! We won the match!\n• Wow! That\'s amazing!\n• Yay! School is over!\n• Bravo! Well done!\n\nSURPRISE:\n• Oh! I didn\'t know that.\n• Ah! There you are!\n• What! You\'re leaving?\n• Gosh! That was unexpected!\n\nPAIN/DISAPPOINTMENT:\n• Ouch! That hurts!\n• Alas! We lost the game.\n• Oh no! I forgot my book.\n\nGREETING:\n• Hello! How are you?\n• Hi! Good morning!\n\nATTENTION:\n• Hey! Listen to this!\n• Look! A beautiful bird!\n• Psst! Come here!\n\nDISGUST:\n• Ugh! This tastes terrible.\n• Yuck! I don\'t like it.\n\nAPPROVAL:\n• Yes! I agree!\n• Indeed! That\'s correct.\n\nEXAMPLES IN SENTENCES:\n• Wow! What a beautiful dress!\n• Ouch! I hit my toe.\n• Alas! The hero died.\n• Hurray! We are going on a trip.\n\nNOTE: Interjections stand alone and are not grammatically connected to the rest of the sentence. They express emotion, not meaning.' 
                  },
                  { 
                    title: '10. Words That Change Parts of Speech', 
                    content: 'Many words in English can function as different parts of speech depending on how they are used in a sentence. Understanding context is key.\n\nEXAMPLE 1: WATER\n• The water is cold. (NOUN - names a thing)\n• Please water the plants. (VERB - action)\n\nEXAMPLE 2: LIGHT\n• Turn on the light. (NOUN)\n• Light the candle. (VERB)\n• She wore a light dress. (ADJECTIVE - describing weight or color)\n\nEXAMPLE 3: FAST\n• He runs fast. (ADVERB - describes how he runs)\n• The car is fast. (ADJECTIVE - describes the car)\n• Muslims fast during Ramadan. (VERB - action)\n• He broke his fast. (NOUN)\n\nEXAMPLE 4: WELL\n• She sings well. (ADVERB - describes how she sings)\n• The well is deep. (NOUN - names a thing)\n• I am well. (ADJECTIVE - describes health)\n\nEXAMPLE 5: BEFORE\n• Come before noon. (PREPOSITION - shows time relationship)\n• I saw him before. (ADVERB - tells when)\n• Pray before you eat. (CONJUNCTION - joins clauses)\n\nEXAMPLE 6: ROUND\n• The ball is round. (ADJECTIVE - describes shape)\n• He ran round the field. (PREPOSITION)\n• The earth goes round. (ADVERB)\n• We played three rounds. (NOUN)\n\nHOW TO IDENTIFY:\n1. Look at the FUNCTION in the sentence\n2. Ask: What job is this word doing?\n   • Naming? → Noun\n   • Replacing a noun? → Pronoun\n   • Showing action/state? → Verb\n   • Describing a noun? → Adjective\n   • Describing a verb/adjective/adverb? → Adverb\n   • Showing relationship? → Preposition\n   • Joining? → Conjunction\n   • Expressing emotion? → Interjection' 
                  },
                ],
                activities: {
                  type: 'exercises',
                  questions: [
                    // SECTION 1: NOUNS (10 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the PROPER noun in this sentence: "Kwame visited Cape Coast Castle during the holidays."',
                      options: ['holidays', 'Cape Coast Castle', 'visited', 'during'],
                      answer: 'Cape Coast Castle',
                      explanation: 'Cape Coast Castle is a proper noun (specific place name) and must be capitalized. "Holidays" is a common noun.'
                    },
                    {
                      type: 'mcq',
                      question: 'Which word is an ABSTRACT noun?',
                      options: ['teacher', 'happiness', 'mango', 'Accra'],
                      answer: 'happiness',
                      explanation: 'Happiness is an abstract noun (an idea/feeling you cannot touch). Teacher, mango are concrete; Accra is proper.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the COLLECTIVE noun: "A flock of birds flew over the school."',
                      options: ['birds', 'flock', 'school', 'flew'],
                      answer: 'flock',
                      explanation: 'Flock is a collective noun (names a group). Other examples: team, family, class, herd.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'The ______ of students won the competition. (Use a collective noun)',
                      answer: 'team',
                      alternatives: ['group', 'class'],
                      explanation: 'Collective nouns name groups: team, group, class, etc.'
                    },
                    {
                      type: 'mcq',
                      question: 'In "My mother teaches at the university," identify ALL the nouns.',
                      options: ['mother only', 'mother, university', 'teaches, university', 'my, mother'],
                      answer: 'mother, university',
                      explanation: 'Both "mother" (person) and "university" (place) are nouns. "My" is a possessive adjective, "teaches" is a verb.'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the abstract nouns from this list:',
                      options: ['freedom', 'book', 'courage', 'happiness', 'table'],
                      answers: ['freedom', 'courage', 'happiness'],
                      explanation: 'Abstract nouns are ideas/feelings we cannot see or touch. Book and table are concrete nouns.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of noun is "water" in this sentence: "The water is cold."?',
                      options: ['Proper noun', 'Abstract noun', 'Collective noun', 'Common noun'],
                      answer: 'Common noun',
                      explanation: 'Water is a common noun (general name for a thing). It can be concrete (you can see/touch it).'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'Ghana gained ______ in 1957. (Use an abstract noun)',
                      answer: 'independence',
                      alternatives: ['freedom'],
                      explanation: 'Independence/freedom are abstract nouns (ideas you cannot touch).'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the noun functioning as the SUBJECT: "The teacher praised the student."',
                      options: ['teacher', 'praised', 'student', 'the'],
                      answer: 'teacher',
                      explanation: 'The subject is who/what performs the action. The teacher (subject) praised (verb) the student (object).'
                    },
                    {
                      type: 'matching',
                      question: 'Match each noun to its correct type:',
                      pairs: [
                        { left: 'Monday', right: 'Proper Noun' },
                        { left: 'love', right: 'Abstract Noun' },
                        { left: 'crowd', right: 'Collective Noun' },
                        { left: 'desk', right: 'Concrete Noun' },
                      ],
                      explanation: 'Monday (specific name), love (feeling), crowd (group), desk (thing you can touch).'
                    },

                    // SECTION 2: PRONOUNS (8 questions)
                    {
                      type: 'mcq',
                      question: 'Choose the correct pronoun: "Ama and ____ went to the market."',
                      options: ['me', 'I', 'myself', 'mine'],
                      answer: 'I',
                      explanation: 'Use subject pronoun "I" before the verb. Test: "I went" (not "me went"). Remember: put yourself last.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of pronoun is "myself" in: "I taught myself to play guitar."?',
                      options: ['Personal pronoun', 'Reflexive pronoun', 'Possessive pronoun', 'Demonstrative pronoun'],
                      answer: 'Reflexive pronoun',
                      explanation: 'Reflexive pronouns end in -self/-selves and refer back to the subject: myself, yourself, himself, herself, itself, ourselves, themselves.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the possessive pronoun: "This book is mine, and that one is yours."',
                      options: ['This', 'book', 'mine', 'that'],
                      answer: 'mine',
                      explanation: 'Mine is a possessive pronoun (stands alone). "Yours" is also possessive. Others: his, hers, ours, theirs.'
                    },
                    {
                      type: 'mcq',
                      question: 'Choose the correct pronoun: "The teacher gave the book to Kofi and ____."',
                      options: ['I', 'me', 'myself', 'my'],
                      answer: 'me',
                      explanation: 'Use object pronoun "me" after preposition "to". Test: "gave to me" (not "gave to I").'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the demonstrative pronouns:',
                      options: ['this', 'he', 'those', 'mine', 'that', 'we'],
                      answers: ['this', 'those', 'that'],
                      explanation: 'Demonstrative pronouns point to things: this, that (singular), these, those (plural).'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of pronoun is "who" in: "Who broke the window?"?',
                      options: ['Relative pronoun', 'Interrogative pronoun', 'Personal pronoun', 'Reflexive pronoun'],
                      answer: 'Interrogative pronoun',
                      explanation: 'Interrogative pronouns ask questions: who, whom, whose, which, what.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'The students helped ______ ______ with homework. (Use a reciprocal pronoun)',
                      answer: 'each other',
                      alternatives: ['one another'],
                      explanation: 'Reciprocal pronouns show mutual action: each other (two people), one another (more than two).'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the indefinite pronoun: "Everyone passed the test."',
                      options: ['Everyone', 'passed', 'the', 'test'],
                      answer: 'Everyone',
                      explanation: 'Indefinite pronouns refer to non-specific people/things: someone, anyone, everyone, nobody, something, nothing, etc.'
                    },

                    // SECTION 3: VERBS (10 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the ACTION verb: "The students study hard every day."',
                      options: ['students', 'study', 'hard', 'every'],
                      answer: 'study',
                      explanation: 'Study is an action verb (mental action). Other action verbs: run, eat, write, think, believe.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the LINKING verb: "The soup tastes delicious."',
                      options: ['soup', 'tastes', 'delicious', 'The'],
                      answer: 'tastes',
                      explanation: 'Tastes is a linking verb connecting "soup" to "delicious". Linking verbs: be, seem, appear, feel, taste, smell, sound, look.'
                    },
                    {
                      type: 'mcq',
                      question: 'In "She has finished her work," identify the helping verb.',
                      options: ['She', 'has', 'finished', 'work'],
                      answer: 'has',
                      explanation: 'Has is a helping/auxiliary verb. Finished is the main verb. Helping verbs: be, have, do, can, will, should, must, etc.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the modal verb: "You should study harder."',
                      options: ['You', 'should', 'study', 'harder'],
                      answer: 'should',
                      explanation: 'Should is a modal verb (expresses necessity/advice). Modal verbs: can, could, may, might, shall, should, will, would, must.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of verb is "is" in: "She is happy."?',
                      options: ['Action verb', 'Linking verb', 'Modal verb', 'Main verb'],
                      answer: 'Linking verb',
                      explanation: 'Is connects the subject "she" to the description "happy". It does not show action.'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the linking verbs:',
                      options: ['run', 'seem', 'eat', 'appear', 'look', 'jump'],
                      answers: ['seem', 'appear', 'look'],
                      explanation: 'Linking verbs connect subject to description: be, seem, appear, become, feel, taste, smell, sound, look.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'The children ______ playing outside. (Use a helping verb + verb)',
                      answer: 'are',
                      alternatives: ['were'],
                      explanation: 'Are/were are helping verbs in continuous tenses: are playing, were playing.'
                    },
                    {
                      type: 'mcq',
                      question: 'In "They can swim very well," what is the main verb?',
                      options: ['They', 'can', 'swim', 'well'],
                      answer: 'swim',
                      explanation: 'Swim is the main verb (the action). Can is a modal helping verb.'
                    },
                    {
                      type: 'mcq',
                      question: 'Choose the sentence with an action verb:',
                      options: ['The boy is tall.', 'She seems tired.', 'They write letters.', 'The food smells good.'],
                      answer: 'They write letters.',
                      explanation: 'Write is an action verb. The others use linking verbs: is, seems, smells.'
                    },
                    {
                      type: 'mcq',
                      question: 'What is "being" in: "She is being difficult."?',
                      options: ['Action verb', 'Linking verb', 'Helping verb', 'Main verb'],
                      answer: 'Main verb',
                      explanation: 'Here, "is" is the helping verb and "being" is the main verb in present continuous form.'
                    },

                    // SECTION 4: ADJECTIVES & ADVERBS (12 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the adjective: "The beautiful girl sang sweetly."',
                      options: ['beautiful', 'girl', 'sang', 'sweetly'],
                      answer: 'beautiful',
                      explanation: 'Beautiful is an adjective describing "girl". Sweetly is an adverb describing "sang".'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the adverb: "The beautiful girl sang sweetly."',
                      options: ['beautiful', 'girl', 'sang', 'sweetly'],
                      answer: 'sweetly',
                      explanation: 'Sweetly is an adverb (ends in -ly) describing how she sang. Beautiful is an adjective describing "girl".'
                    },
                    {
                      type: 'mcq',
                      question: 'What does the adjective describe in: "The old man walked slowly."?',
                      options: ['man', 'walked', 'slowly', 'The'],
                      answer: 'man',
                      explanation: 'Old is an adjective describing the noun "man". Slowly is an adverb describing "walked".'
                    },
                    {
                      type: 'mcq',
                      question: 'What does the adverb describe in: "The old man walked slowly."?',
                      options: ['man', 'walked', 'old', 'The'],
                      answer: 'walked',
                      explanation: 'Slowly is an adverb describing how he walked (modifies the verb).'
                    },
                    {
                      type: 'mcq',
                      question: 'Which sentence uses "fast" as an ADVERB?',
                      options: ['The car is fast.', 'He runs fast.', 'A fast runner won.', 'That was fast.'],
                      answer: 'He runs fast.',
                      explanation: 'In "He runs fast," fast describes how he runs (modifies verb). In the others, fast is an adjective.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the demonstrative adjective: "Give me that book."',
                      options: ['Give', 'me', 'that', 'book'],
                      answer: 'that',
                      explanation: 'That is a demonstrative adjective pointing to a specific book. Demonstrative adjectives: this, that, these, those.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of adverb is "yesterday" in: "I saw him yesterday."?',
                      options: ['Manner', 'Time', 'Place', 'Frequency'],
                      answer: 'Time',
                      explanation: 'Yesterday is an adverb of time (answers "when?"). Other time adverbs: today, tomorrow, now, then, soon.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of adverb is "here" in: "Come here."?',
                      options: ['Manner', 'Time', 'Place', 'Degree'],
                      answer: 'Place',
                      explanation: 'Here is an adverb of place (answers "where?"). Other place adverbs: there, everywhere, inside, outside, up, down.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'She is ______ intelligent. (Use an adverb of degree)',
                      answer: 'very',
                      alternatives: ['extremely', 'quite', 'too'],
                      explanation: 'Adverbs of degree show extent: very, extremely, quite, too, almost, nearly, just.'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the adjectives: "The tall, handsome boy wore a new blue shirt."',
                      options: ['tall', 'handsome', 'boy', 'new', 'blue', 'shirt'],
                      answers: ['tall', 'handsome', 'new', 'blue'],
                      explanation: 'Tall and handsome describe "boy". New and blue describe "shirt". Boy and shirt are nouns.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of adverb is "always" in: "He always arrives early."?',
                      options: ['Manner', 'Time', 'Place', 'Frequency'],
                      answer: 'Frequency',
                      explanation: 'Always is an adverb of frequency (how often). Others: usually, often, sometimes, rarely, never, daily.'
                    },
                    {
                      type: 'mcq',
                      question: 'In "The food is very hot," what does "very" modify?',
                      options: ['food', 'is', 'hot', 'The'],
                      answer: 'hot',
                      explanation: 'Very is an adverb modifying the adjective "hot" (shows degree - how hot).'
                    },

                    // SECTION 5: PREPOSITIONS (8 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the preposition: "The cat is under the table."',
                      options: ['cat', 'is', 'under', 'table'],
                      answer: 'under',
                      explanation: 'Under is a preposition showing position/relationship between "cat" and "table".'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the preposition of time: "School starts at 8 o\'clock."',
                      options: ['School', 'starts', 'at', 'o\'clock'],
                      answer: 'at',
                      explanation: 'At is a preposition of time used for specific times. Use "at" for times, "on" for days, "in" for months/years.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'The book is ______ the table. (Preposition of place)',
                      answer: 'on',
                      alternatives: ['under', 'beside', 'near', 'above'],
                      explanation: 'On, under, beside, near, above are all prepositions of place showing position.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'My birthday is ______ Monday. (Preposition of time)',
                      answer: 'on',
                      explanation: 'Use "on" for specific days: on Monday, on Christmas Day, on December 6th.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'School starts ______ September. (Preposition of time)',
                      answer: 'in',
                      explanation: 'Use "in" for months, years, seasons: in September, in 2025, in summer.'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the prepositions: "The students in the classroom studied for their exams."',
                      options: ['students', 'in', 'classroom', 'studied', 'for', 'exams'],
                      answers: ['in', 'for'],
                      explanation: 'In (shows location) and for (shows purpose) are prepositions. Students, classroom, exams are nouns. Studied is a verb.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of preposition is "through" in: "He walked through the forest."?',
                      options: ['Time', 'Place', 'Direction/Movement', 'Possession'],
                      answer: 'Direction/Movement',
                      explanation: 'Through shows movement. Other movement prepositions: to, from, into, across, along, towards.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the prepositional phrase: "She lives in Accra with her family."',
                      options: ['She lives', 'in Accra', 'her family', 'lives in'],
                      answer: 'in Accra',
                      explanation: 'A prepositional phrase = preposition + noun/pronoun. "In Accra" and "with her family" are both prepositional phrases.'
                    },

                    // SECTION 6: CONJUNCTIONS (8 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the coordinating conjunction: "I wanted to go, but it was raining."',
                      options: ['I', 'wanted', 'but', 'raining'],
                      answer: 'but',
                      explanation: 'But is a coordinating conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So) joining two independent clauses.'
                    },
                    {
                      type: 'mcq',
                      question: 'Choose the correct conjunction: "I wanted to go out, ______ it was raining."',
                      options: ['and', 'but', 'because', 'or'],
                      answer: 'but',
                      explanation: 'But shows contrast between wanting to go out and the rain preventing it.'
                    },
                    {
                      type: 'mcq',
                      question: 'Choose the correct conjunction: "She passed the exam ______ she studied hard."',
                      options: ['although', 'unless', 'because', 'but'],
                      answer: 'because',
                      explanation: 'Because is a subordinating conjunction showing reason/cause.'
                    },
                    {
                      type: 'mcq',
                      question: 'Identify the subordinating conjunction: "Although he was tired, he continued working."',
                      options: ['he', 'Although', 'tired', 'continued'],
                      answer: 'Although',
                      explanation: 'Although is a subordinating conjunction showing contrast. It introduces a dependent clause.'
                    },
                    {
                      type: 'fillblank',
                      sentence: 'Study hard, ______ you will fail. (Use a conjunction)',
                      answer: 'or',
                      alternatives: ['otherwise'],
                      explanation: 'Or shows choice/alternative. "Otherwise" is also acceptable as a conjunctive adverb.'
                    },
                    {
                      type: 'mcq',
                      question: 'What type of conjunction is "either...or"?',
                      options: ['Coordinating', 'Subordinating', 'Correlative', 'Conjunctive'],
                      answer: 'Correlative',
                      explanation: 'Either...or is a correlative conjunction (works in pairs). Others: neither...nor, both...and, not only...but also.'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the coordinating conjunctions (FANBOYS):',
                      options: ['for', 'although', 'and', 'because', 'but', 'when', 'or'],
                      answers: ['for', 'and', 'but', 'or'],
                      explanation: 'FANBOYS: For, And, Nor, But, Or, Yet, So. Although, because, when are subordinating conjunctions.'
                    },
                    {
                      type: 'mcq',
                      question: 'Choose the correct conjunction: "If it rains, we ______ stay home."',
                      options: ['and', 'will', 'or', 'because'],
                      answer: 'will',
                      explanation: 'Will is not a conjunction; it is a modal verb. The sentence already has "if" as the subordinating conjunction.'
                    },

                    // SECTION 7: INTERJECTIONS & MIXED (6 questions)
                    {
                      type: 'mcq',
                      question: 'Identify the interjection: "Wow! That was an amazing performance."',
                      options: ['Wow', 'That', 'amazing', 'performance'],
                      answer: 'Wow',
                      explanation: 'Wow is an interjection expressing surprise/emotion. Interjections: Wow!, Ouch!, Hurray!, Alas!, Hello!'
                    },
                    {
                      type: 'mcq',
                      question: 'What emotion does "Alas!" express?',
                      options: ['Joy', 'Surprise', 'Sadness/Disappointment', 'Anger'],
                      answer: 'Sadness/Disappointment',
                      explanation: 'Alas expresses sadness or disappointment. Example: "Alas! We lost the match."'
                    },
                    {
                      type: 'multiselect',
                      question: 'Select ALL the interjections:',
                      options: ['Hurray', 'beautiful', 'Ouch', 'run', 'Hello', 'quickly'],
                      answers: ['Hurray', 'Ouch', 'Hello'],
                      explanation: 'Interjections express emotion: Hurray (joy), Ouch (pain), Hello (greeting). Beautiful is adjective, run is verb, quickly is adverb.'
                    },
                    {
                      type: 'mcq',
                      question: 'In the sentence "Water the plants," what part of speech is "water"?',
                      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
                      answer: 'Verb',
                      explanation: 'Water is a verb here (command/action). In "The water is cold," it would be a noun.'
                    },
                    {
                      type: 'mcq',
                      question: 'In the sentence "He runs fast," what part of speech is "fast"?',
                      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
                      answer: 'Adverb',
                      explanation: 'Fast describes how he runs (modifies verb). In "The car is fast," it would be an adjective.'
                    },
                    {
                      type: 'matching',
                      question: 'Match each sentence to the part of speech of the word "light":',
                      pairs: [
                        { left: 'Turn on the light.', right: 'Noun' },
                        { left: 'Light the candle.', right: 'Verb' },
                        { left: 'She wore a light dress.', right: 'Adjective' },
                        { left: 'He travels light.', right: 'Adverb' },
                      ],
                      explanation: 'Words can function differently based on context: light (noun=thing, verb=action, adjective=describes weight/color, adverb=how).'
                    },
                  ],
                },
                pastQuestions: [
                  { 
                    question: 'Identify the part of speech of the underlined word: "The boy ran *quickly* to school." (BECE 2018)', 
                    solution: 'Adverb. "Quickly" describes how the boy ran (it modifies the verb "ran"). Adverbs often end in -ly and tell us how, when, where, or to what extent an action happens.' 
                  },
                  { 
                    question: 'Which word in this sentence is a conjunction? "I wanted to go, but it was raining." (BECE 2019)', 
                    solution: 'But. It is a coordinating conjunction that joins two independent clauses and shows contrast between wanting to go and the obstacle of rain.' 
                  },
                  { 
                    question: 'In the sentence \"She is *happy*\", what part of speech is the word \"happy\"? (BECE 2017)', 
                    solution: 'Adjective. \"Happy\" describes the noun/pronoun \"she\". Even though it comes after the linking verb \"is\", it still functions as an adjective describing the subject.' 
                  },
                  { 
                    question: 'Identify the preposition in this sentence: \"The cat is under the table.\" (BECE 2020)', 
                    solution: 'Under. It shows the relationship between "cat" and "table", specifically the position of the cat relative to the table.' 
                  },
                  { 
                    question: 'What part of speech is the word "water" in this sentence: "Please water the plants." (BECE 2016)', 
                    solution: 'Verb. In this sentence, "water" expresses an action (the act of watering/giving water to plants). The same word can be a noun in a different context (e.g., "The water is cold").' 
                  },
                  { 
                    question: 'Choose the sentence where "fast" is used as an adjective: (a) He runs fast. (b) The car is fast. (BECE 2021)', 
                    solution: 'Sentence (b). In "The car is fast," the word "fast" describes the noun "car", making it an adjective. In sentence (a), "fast" describes how he runs (modifies the verb), making it an adverb.' 
                  },
                  { 
                    question: 'Identify the interjection: "Wow! That was an amazing performance." (BECE 2019)', 
                    solution: 'Wow. It expresses surprise and emotion. Interjections are exclamatory words that stand alone and express strong feeling. They are usually followed by an exclamation mark.' 
                  },
                  { 
                    question: 'In the sentence "They helped each other," what part of speech is "each other"? (BECE 2018)', 
                    solution: 'Pronoun (specifically, a reciprocal pronoun). "Each other" replaces nouns and shows a mutual action between two people or things.' 
                  },
                  { 
                    question: 'Which word is the linking verb in this sentence: "The food tastes delicious"? (BECE 2020)', 
                    solution: 'Tastes. It is a linking verb that connects the subject "food" to the adjective "delicious". Linking verbs (be, seem, appear, taste, smell, feel, look, sound) connect the subject to a description rather than showing action.' 
                  },
                  { 
                    question: 'Identify all the adjectives in this sentence: "The tall, handsome boy wore a new blue shirt." (BECE 2017)', 
                    solution: 'The adjectives are: tall, handsome, new, and blue. All four words describe nouns - "tall" and "handsome" describe "boy", while "new" and "blue" describe "shirt".' 
                  },
                  { 
                    question: 'What is the difference between "good" and "well" in these sentences? (a) She is a good singer. (b) She sings well. (BECE 2021)', 
                    solution: 'In sentence (a), "good" is an adjective describing the noun "singer". In sentence (b), "well" is an adverb describing how she sings (modifies the verb "sings"). Remember: good = adjective, well = adverb.' 
                  },
                  { 
                    question: 'In "Although he was tired, he continued working," identify: (i) the subordinating conjunction (ii) the verb (BECE 2019)', 
                    solution: '(i) The subordinating conjunction is "Although". It joins the dependent clause "Although he was tired" to the main clause "he continued working". (ii) The verbs are "was" (linking verb) and "continued" (action verb) or if looking for the main verb: "continued".' 
                  },
                  { 
                    question: 'Classify these pronouns: (a) mine (b) myself (c) who (d) someone (BECE 2020)', 
                    solution: '(a) mine = possessive pronoun, (b) myself = reflexive pronoun, (c) who = interrogative or relative pronoun (depending on usage), (d) someone = indefinite pronoun.' 
                  },
                  { 
                    question: 'In "The students in the classroom studied hard for their exams," identify all the prepositions and what they show. (BECE 2018)', 
                    solution: 'There are two prepositions: (1) "in" - shows location/position (where the students are), (2) "for" - shows purpose (why they studied). The prepositional phrases are "in the classroom" and "for their exams".' 
                  },
                  { 
                    question: 'Complete this sentence with the appropriate part of speech and name it: "She speaks _____ than her brother." (BECE 2022)', 
                    solution: 'Any comparative adverb works, such as "better", "louder", "faster", "more clearly", etc. These are adverbs in their comparative form, describing how she speaks compared to her brother. Adverbs modify verbs (in this case, "speaks").' 
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: "mcq",
                    question: "A word that names a person, place, thing, or idea is called a ___________.",
                    options: ["noun", "pronoun", "verb", "adjective"],
                    answer: "noun",
                    explanation: "A noun is a naming word. Examples: boy (person), Accra (place), book (thing), love (idea)."
                  },
                  {
                    type: "mcq",
                    question: 'In the sentence "She runs quickly," what part of speech is "quickly"?',
                    options: ["adverb", "adjective", "verb", "noun"],
                    answer: "adverb",
                    explanation: '"Quickly" is an adverb because it describes how she runs (modifies the verb "runs"). Most adverbs end in -ly.'
                  },
                  {
                    type: "mcq",
                    question: "Which of the following is a conjunction?",
                    options: ["and", "under", "quickly", "beautiful"],
                    answer: "and",
                    explanation: '"And" is a coordinating conjunction that joins words, phrases, or clauses. "Under" is a preposition, "quickly" is an adverb, and "beautiful" is an adjective.'
                  },
                  {
                    type: "mcq",
                    question: 'In "The cat is under the table," what is "under"?',
                    options: ["preposition", "conjunction", "adverb", "verb"],
                    answer: "preposition",
                    explanation: '"Under" is a preposition showing the relationship (position) between "cat" and "table".'
                  },
                  {
                    type: "mcq",
                    question: "What part of speech expresses strong emotion?",
                    options: ["interjection", "conjunction", "preposition", "pronoun"],
                    answer: "interjection",
                    explanation: "Interjections express strong emotion or sudden feeling. Examples: Wow! Ouch! Hurray! Alas!"
                  },
                  {
                    type: "mcq",
                    question: 'In "The beautiful girl sang," what part of speech is "beautiful"?',
                    options: ["adjective", "adverb", "noun", "verb"],
                    answer: "adjective",
                    explanation: '"Beautiful" is an adjective because it describes the noun "girl".'
                  },
                  {
                    type: "mcq",
                    question: "Which word is a pronoun: she, run, happy, quickly?",
                    options: ["she", "run", "happy", "quickly"],
                    answer: "she",
                    explanation: '"She" is a pronoun (personal pronoun) that replaces a noun. "Run" is a verb, "happy" is an adjective, and "quickly" is an adverb.'
                  },
                  {
                    type: "mcq",
                    question: 'In "They work hard," what is "work"?',
                    options: ["verb", "noun", "adjective", "adverb"],
                    answer: "verb",
                    explanation: 'In this sentence, "work" is a verb showing action (what they do). Note: the same word can be a noun in a different context.'
                  },
                  {
                    type: "truefalse",
                    statement: "An adjective can come after a linking verb.",
                    answer: "true",
                    reason: 'True. Adjectives can appear after linking verbs (be, seem, appear, feel, taste, etc.). Example: "She is happy." "Happy" is an adjective describing "she".'
                  },
                  {
                    type: "truefalse",
                    statement: "All adverbs end in -ly.",
                    answer: "false",
                    reason: "False. While many adverbs end in -ly (quickly, slowly), some do not. Examples: fast, hard, well, late, early, far, never, always."
                  },
                  {
                    type: "multiselect",
                    question: "Select all the parts of speech that can describe or modify other words:",
                    options: ["adjective", "adverb", "noun", "pronoun", "verb"],
                    answers: ["adjective", "adverb"],
                    explanation: "Adjectives describe/modify nouns and pronouns. Adverbs describe/modify verbs, adjectives, and other adverbs. Nouns, pronouns, and verbs do not describe other words."
                  },
                  {
                    type: "multiselect",
                    question: "Which of these are coordinating conjunctions? (Select all)",
                    options: ["and", "but", "although", "or", "because", "so"],
                    answers: ["and", "but", "or", "so"],
                    explanation: 'The coordinating conjunctions are: for, and, nor, but, or, yet, so (FANBOYS). "Although" and "because" are subordinating conjunctions.'
                  },
                  {
                    type: "fillblank",
                    sentence: "The boy _______ to school every day.",
                    answer: "walks",
                    alternatives: ["goes", "runs", "travels"],
                    explanation: "Any action verb that makes sense works here: walks, goes, runs, travels, etc. The verb shows what the boy does."
                  },
                  {
                    type: "matching",
                    question: "Match each word to its part of speech by clicking on a word in the LEFT column, then clicking on its matching part of speech in the RIGHT column:",
                    pairs: [
                      { left: "happiness", right: "noun" },
                      { left: "quickly", right: "adverb" },
                      { left: "beautiful", right: "adjective" },
                      { left: "under", right: "preposition" },
                    ],
                    explanation: "happiness (noun - names an idea), quickly (adverb - describes how), beautiful (adjective - describes noun), under (preposition - shows position)"
                  },
                  {
                    type: "shortanswer",
                    question: 'In the sentence "Wow! The students worked hard and passed their exams," identify: (a) the interjection, (b) one adverb, (c) the conjunction.',
                    answer: "(a) Wow (b) hard (c) and",
                    explanation: '(a) Wow - interjection expressing surprise, (b) hard - adverb describing how they worked, (c) and - coordinating conjunction joining two verbs/clauses. Note: "their" is a possessive adjective, not asked for.'
                  },
                  {
                    type: "shortanswer",
                    question: "Arrange these parts of speech in the order they typically appear in a simple sentence: verb, adjective, noun",
                    answer: "adjective, noun, verb",
                    explanation: 'In a simple sentence like "The beautiful girl runs," the typical order is: adjective (beautiful) + noun (girl) + verb (runs). This is the common subject-verb pattern with an adjective modifying the subject noun.'
                  },
                  {
                    type: "shortanswer",
                    question: 'Explain why the word "light" can be different parts of speech. Give two examples.',
                    answer: "Light can be a noun (Turn on the light), verb (Light the candle), or adjective (a light dress)",
                    explanation: 'Words can function as different parts of speech depending on context. "Light" as noun names a thing, as verb shows action, as adjective describes a noun. Context determines function.'
                  },
                ],
                summary: 'In this comprehensive lesson, we have explored all eight parts of speech that form the foundation of English grammar. We learned that NOUNS name things, PRONOUNS replace nouns, VERBS show action or state, ADJECTIVES describe nouns, ADVERBS modify verbs/adjectives/adverbs, PREPOSITIONS show relationships, CONJUNCTIONS join words or clauses, and INTERJECTIONS express emotion. Remember that the same word can function as different parts of speech depending on its role in the sentence. Mastering parts of speech is essential for constructing clear, correct sentences and excelling in your BECE examinations. Always identify parts of speech by analyzing what job each word is doing in the sentence, not just by memorizing the word itself. Keep practicing with the exercises and past questions to build your confidence and skill.',
              },
              {
                id: 'eng104-2',
                slug: 'nouns',
                title: 'Nouns',
                objectives: [
                  'Define what nouns are and explain their functions in sentences.',
                  'Identify and classify the five main types of nouns (proper, common, concrete, abstract, collective).',
                  'Understand gender of nouns (masculine, feminine, neuter, common) and form correct gender pairs.',
                  'Form regular and irregular plurals correctly, and distinguish between countable and uncountable nouns.',
                  'Recognize and use compound nouns in writing and speaking.',
                  'Understand the case of nouns (subjective, objective, possessive) and use apostrophes correctly.',
                  'Identify noun phrases and the functions of nouns in sentences (subject, object, complement).',
                  'Apply knowledge of nouns to answer BECE-style examination questions accurately.',
                ],
                introduction: 'A noun is the name of a person, place, animal, thing, or idea. Nouns are the foundation of every sentence-without them, we cannot communicate effectively. In the BECE English Language examination, questions on nouns frequently test your understanding of types, gender, number (singular/plural), and functions. This comprehensive lesson will equip you with all the knowledge you need to master nouns and excel in your exams and everyday communication.',
                keyConcepts: [
                  { 
                    title: 'Definition of a Noun', 
                    content: 'A noun is a naming word. It names people, animals, places, things, and ideas.\n\nExamples:\n• Person: teacher, Kofi, girl, doctor\n• Animal: dog, cat, elephant\n• Place: Accra, school, market, Ghana\n• Thing: book, pen, car, table\n• Idea: love, freedom, happiness, courage' 
                  },
                  { 
                    title: '1. Types of Nouns', 
                    content: 'There are five main types of nouns that you must know for BECE:\n\n1. PROPER NOUNS\n→ Names of specific people, places, days, months, or organizations.\n→ Always begin with a CAPITAL LETTER.\n→ Examples: Kwame Nkrumah, Accra, Monday, December, United Nations, Achimota School\n\n2. COMMON NOUNS\n→ General names for people, places, animals, or things.\n→ Not capitalized unless at the beginning of a sentence.\n→ Examples: boy, city, dog, table, school, market\n\n3. CONCRETE NOUNS\n→ Things we can see, touch, smell, hear, or taste.\n→ They have physical form.\n→ Examples: mango, chair, water, music, perfume\n\n4. ABSTRACT NOUNS\n→ Ideas, qualities, emotions, or states that we cannot see or touch.\n→ Examples: honesty, love, freedom, anger, childhood, beauty, knowledge\n\n5. COLLECTIVE NOUNS\n→ Names for groups of people, animals, or things.\n→ Examples:\n  • People: team, class, family, committee, crowd, audience\n  • Animals: herd (cattle), flock (birds/sheep), swarm (bees), pride (lions)\n  • Things: bunch (keys/bananas), stack (books), fleet (ships/cars)' 
                  },
                  { 
                    title: '2. Gender of Nouns', 
                    content: 'Nouns can be classified by gender into four categories:\n\n1. MASCULINE GENDER → Male persons or animals\nExamples: man, boy, father, king, bull, cock, lion, actor, prince\n\n2. FEMININE GENDER → Female persons or animals\nExamples: woman, girl, mother, queen, cow, hen, lioness, actress, princess\n\n3. NEUTER GENDER → Things without gender (objects, ideas, places)\nExamples: book, table, pen, school, love, happiness, Accra\n\n4. COMMON GENDER → Can be used for both male and female\nExamples: teacher, student, doctor, child, parent, friend, cousin\n\nGENDER PAIRS (BECE frequently tests these):\n• boy → girl\n• man → woman\n• father → mother\n• uncle → aunt\n• nephew → niece\n• king → queen\n• prince → princess\n• actor → actress\n• hero → heroine\n• bachelor → spinster\n• husband → wife\n• son → daughter\n• brother → sister\n• monk → nun\n• wizard → witch\n• host → hostess\n• waiter → waitress\n• sir → madam' 
                  },
                  { 
                    title: '3. Number: Singular and Plural Nouns', 
                    content: 'Number tells us whether we are talking about one thing (singular) or more than one (plural).\n\nREGULAR PLURALS:\nMost nouns form plurals by adding -s or -es:\n• book → books\n• pen → pens\n• box → boxes (add -es after s, x, z, ch, sh)\n• church → churches\n• dish → dishes\n• bus → buses\n\nNouns ending in consonant + y → change y to ies:\n• baby → babies\n• city → cities\n• lady → ladies\n\nNouns ending in vowel + y → just add s:\n• boy → boys\n• day → days\n• key → keys\n\nNouns ending in f or fe → change to ves:\n• knife → knives\n• life → lives\n• leaf → leaves\n• shelf → shelves\nExceptions: roof → roofs, chief → chiefs, cliff → cliffs\n\nNouns ending in consonant + o → add es:\n• tomato → tomatoes\n• potato → potatoes\n• hero → heroes\nExceptions: photo → photos, piano → pianos\n\nIRREGULAR PLURALS (memorize these!):\n• man → men\n• woman → women\n• child → children\n• tooth → teeth\n• foot → feet\n• mouse → mice\n• ox → oxen\n• person → people\n• goose → geese\n\nSAME FORM FOR SINGULAR AND PLURAL:\n• sheep → sheep\n• deer → deer\n• fish → fish\n• series → series\n• species → species\n\nCOUNTABLE vs UNCOUNTABLE NOUNS:\nCountable: Can be counted (one book, two books, three books)\nExamples: pen, student, mango, chair\n\nUncountable: Cannot be counted, no plural form\nExamples: water, sugar, rice, milk, air, information, advice, furniture, luggage\nNote: We use "some," "much," "little" with uncountable nouns.' 
                  },
                  { 
                    title: '4. Compound Nouns', 
                    content: 'A compound noun is formed when two or more words are combined to create a new noun with a specific meaning.\n\nTYPES OF COMPOUND NOUNS:\n\n1. WRITTEN AS ONE WORD:\n• classroom, blackboard, notebook, toothbrush, bedroom, football, sunlight, grandmother\n\n2. WRITTEN AS SEPARATE WORDS:\n• bus stop, post office, police officer, ice cream, swimming pool, high school\n\n3. WRITTEN WITH HYPHENS:\n• mother-in-law, passer-by, six-year-old, well-being, check-in\n\nFORMING PLURALS OF COMPOUND NOUNS:\n• Usually add -s to the main noun:\n  - mother-in-law → mothers-in-law\n  - passer-by → passers-by\n  - toothbrush → toothbrushes\n  - bus stop → bus stops' 
                  },
                  { 
                    title: '5. Case of Nouns', 
                    content: "Case shows the function of a noun in a sentence. There are three cases:\n\n1. SUBJECTIVE CASE (Nominative)\n→ The noun is the subject doing the action.\n→ Example: Ama reads a book. (Ama is the subject)\n\n2. OBJECTIVE CASE\n→ The noun is the object receiving the action.\n→ Example: Kofi kicked the ball. (ball is the object)\n\n3. POSSESSIVE CASE (Genitive)\n→ Shows ownership or relationship.\n→ Formed by adding apostrophe (') and s.\n\nRULES FOR FORMING POSSESSIVE:\n\nSingular noun → add 's:\n• the girl\'s book\n• Ama\'s pen\n• the teacher\'s desk\n• James\'s bag (or James\' bag)\n\nPlural noun ending in s → add only \':\n• the girls\' books (more than one girl)\n• the teachers\' room\n• the students\' uniforms\n\nPlural noun not ending in s → add \'s:\n• the children\'s toys\n• the men\'s room\n• the people\'s choice\n\nJoint possession (one thing owned by two people) → add \'s to the last noun:\n• Kofi and Ama\'s house (they share one house)\n\nSeparate possession → add \'s to both nouns:\n• Kofi\'s and Ama\'s books (each has different books)" 
                  },
                  { 
                    title: '6. Noun Phrases', 
                    content: 'A noun phrase is a group of words that functions as a noun in a sentence. It consists of a noun (the head) plus other words that describe or modify it.\n\nStructure: Determiner + Adjective(s) + NOUN + Prepositional Phrase\n\nExamples:\n• the big brown dog in the yard\n  - "dog" is the main noun (head)\n  - "the" is a determiner\n  - "big" and "brown" are adjectives\n  - "in the yard" is a prepositional phrase\n\n• my younger sister\n• a very tall building\n• the girl with the red dress\n• three ripe mangoes from the farm' 
                  },
                  { 
                    title: '7. Functions of Nouns in Sentences', 
                    content: 'Nouns perform different roles (functions) in sentences:\n\n1. SUBJECT → The doer of the action\nExample: Kofi plays football.\n(Kofi is the subject)\n\n2. DIRECT OBJECT → Receives the action of the verb\nExample: Ama reads a book.\n(book is the direct object)\n\n3. INDIRECT OBJECT → The person/thing for whom the action is done\nExample: The teacher gave the students homework.\n(students is the indirect object)\n\n4. SUBJECT COMPLEMENT → Renames or describes the subject after a linking verb (is, am, are, was, were, become)\nExample: My father is a doctor.\n(doctor renames father)\n\n5. OBJECT COMPLEMENT → Describes the direct object\nExample: They elected him president.\n(president describes him)\n\n6. OBJECT OF PREPOSITION → Follows a preposition (in, on, at, by, for, with, etc.)\nExample: The book is on the table.\n(table is the object of the preposition "on")\n\n7. APPOSITIVE → A noun placed beside another noun to explain or identify it\nExample: My friend, the doctor, lives in Accra.\n("the doctor" is in apposition to "friend")' 
                  },
                ],
                activities: { 
                    type: 'exercises', 
                    questions: [
                        { 
                          type: 'identification', 
                          question: 'EXERCISE 1: Identify and Classify Nouns\nRead the passage below and:\n(a) Underline ALL nouns\n(b) Classify them as proper, common, concrete, abstract, or collective\n\nPassage: "Kwame Nkrumah was the first president of Ghana. He had great wisdom and courage. The people of Accra celebrated his freedom with joy. A large crowd gathered at Independence Square to witness the historic event."\n\nAnswers:\n• Proper nouns: Kwame Nkrumah, Ghana, Accra, Independence Square\n• Common nouns: president, people, event\n• Abstract nouns: wisdom, courage, freedom, joy\n• Collective noun: crowd' 
                        },
                        { 
                          type: 'gender_exercise', 
                          question: 'EXERCISE 2: Gender of Nouns\nGive the opposite gender for each noun:\n1. king → _______\n2. nephew → _______\n3. actor → _______\n4. hero → _______\n5. waiter → _______\n6. monk → _______\n7. bachelor → _______\n8. wizard → _______\n\nAnswers: 1. queen  2. niece  3. actress  4. heroine  5. waitress  6. nun  7. spinster  8. witch' 
                        },
                        { 
                          type: 'plural_forms', 
                          question: 'EXERCISE 3: Form the Plurals\nWrite the plural form of these nouns:\n1. baby → _______\n2. knife → _______\n3. tomato → _______\n4. child → _______\n5. tooth → _______\n6. city → _______\n7. sheep → _______\n8. woman → _______\n9. photo → _______\n10. leaf → _______\n\nAnswers: 1. babies  2. knives  3. tomatoes  4. children  5. teeth  6. cities  7. sheep  8. women  9. photos  10. leaves' 
                        },
                        { 
                          type: 'possessive_case', 
                          question: "EXERCISE 4: Possessive Case\nRewrite using the possessive form:\n1. The bag belonging to Mary → _______\n2. The toys belonging to the children → _______\n3. The office belonging to the teachers → _______\n4. The house that belongs to my parents → _______\n5. The book belonging to James → _______\n\nAnswers: 1. Mary's bag  2. the children's toys  3. the teachers' office  4. my parents' house  5. James's bag (or James' bag)" 
                        },
                        { 
                          type: 'compound_nouns', 
                          question: 'EXERCISE 5: Identify Compound Nouns\nCircle the compound nouns in these sentences:\n1. My grandmother lives near the bus stop.\n2. We played football in the classroom.\n3. The police officer directed traffic at the roundabout.\n4. My mother-in-law bought a new toothbrush.\n\nAnswers: grandmother, bus stop, football, classroom, police officer, mother-in-law, toothbrush' 
                        },
                        { 
                          type: 'countable_uncountable', 
                          question: 'EXERCISE 6: Countable or Uncountable?\nClassify these nouns as countable (C) or uncountable (U):\n1. water _____\n2. book _____\n3. rice _____\n4. student _____\n5. information _____\n6. chair _____\n7. sugar _____\n8. advice _____\n\nAnswers: 1. U  2. C  3. U  4. C  5. U  6. C  7. U  8. U' 
                        },
                        { 
                          type: 'functions_in_sentences', 
                          question: 'EXERCISE 7: Functions of Nouns\nIdentify the function of the underlined noun in each sentence:\n1. Ama plays netball. (Subject/Object?)\n2. The teacher gave the students homework. (What is "students"?)\n3. My sister is a nurse. (What is "nurse"?)\n4. The book is on the table. (What is "table"?)\n\nAnswers: 1. Subject  2. Indirect object  3. Subject complement  4. Object of preposition' 
                        },
                    ],
                },
                pastQuestions: [
                  { question: 'Which of these is a proper noun?\na) boy\nb) Kumasi\nc) teacher', solution: '(b) Kumasi → It is the specific name of a place.' },
                  { question: 'Choose the collective noun:\na) pen\nb) class\nc) girl', solution: '(b) class → It refers to a group of students.' },
                  { question: 'Form the plural of the noun "child."', solution: 'Children.' },
                ],
                summary: 'Nouns are the foundation of English communication-they name people, places, animals, things, and ideas. In this comprehensive lesson, you have learned:\n\n• The FIVE TYPES of nouns: proper, common, concrete, abstract, and collective\n• GENDER of nouns: masculine, feminine, neuter, and common gender\n• NUMBER: how to form regular and irregular plurals, and the difference between countable and uncountable nouns\n• CASE: subjective, objective, and possessive (using apostrophes correctly)\n• COMPOUND NOUNS: words formed by combining two or more nouns\n• FUNCTIONS of nouns in sentences: subject, object, complement, etc.\n\nMastering nouns is essential for BECE success. Practice identifying types, forming plurals, using possessives, and understanding gender pairs. Remember: proper nouns always start with capital letters, irregular plurals must be memorized, and apostrophe placement matters in possessive case!\n\nWith this knowledge, you are well-equipped to tackle any noun-related question in your WAEC BECE examination and communicate effectively in English.',
                defaultQuizStyle: 'card',
                endOfLessonQuiz: [
                  {
                    type: "mcq",
                    question: "Which of the following is a proper noun?",
                    options: ["city", "Kumasi", "boy", "school"],
                    answer: "Kumasi",
                    explanation: "Kumasi is a proper noun because it is the specific name of a city. Proper nouns always begin with capital letters."
                  },
                  {
                    type: "mcq",
                    question: "What type of noun is 'happiness\'?",
                    options: ["Concrete noun", "Abstract noun", "Collective noun", "Proper noun"],
                    answer: "Abstract noun",
                    explanation: "Happiness is an abstract noun because it names an idea or feeling that we cannot see or touch."
                  },
                  {
                    type: "mcq",
                    question: "Choose the collective noun:",
                    options: ["student", "class", "desk", "teacher"],
                    answer: "class",
                    explanation: "Class is a collective noun because it refers to a group of students as one unit."
                  },
                  {
                    type: "mcq",
                    question: "What is the plural of 'child\'?",
                    options: ["childs", "childes", "children", "child\'s"],
                    answer: "children",
                    explanation: "Children is the irregular plural form of 'child.\' This must be memorized as it doesn\'t follow the regular plural rules."
                  },
                  {
                    type: "mcq",
                    question: "Which is the correct possessive form?",
                    options: ["the boys ball", "the boy\'s ball", "the boys\' ball", "the boys\'s ball"],
                    answer: "the boy\'s ball",
                    explanation: "For a singular noun, add apostrophe + s (\'s). 'The boy\'s ball\' means one boy owns the ball."
                  },
                  {
                    type: "truefalse",
                    statement: "Proper nouns always start with capital letters.",
                    answer: "true",
                    reason: "Proper nouns are specific names (people, places, days, months) and must always begin with capital letters. Examples: Kwame, Ghana, Monday."
                  },
                  {
                    type: "truefalse",
                    statement: "\'Information\' is a countable noun.",
                    answer: "false",
                    reason: "\'Information\' is an uncountable noun. We say 'some information\' or \'much information,\' never \'an information\' or \'two informations.\'"
                  },
                  {
                    type: "mcq",
                    question: "What is the feminine gender of 'king\'?",
                    options: ["princess", "queen", "duchess", "lady"],
                    answer: "queen",
                    explanation: "Queen is the feminine form of king. Gender pairs like king-queen are common in BECE examinations."
                  },
                  {
                    type: "multiselect",
                    question: "Which of these are abstract nouns?",
                    options: ["love", "table", "courage", "freedom", "mango", "wisdom"],
                    answers: ["love", "courage", "freedom", "wisdom"],
                    explanation: "Abstract nouns name ideas, qualities, or feelings that cannot be seen or touched. Love, courage, freedom, and wisdom are all abstract. Table and mango are concrete nouns."
                  },
                  {
                    type: "multiselect",
                    question: "Which plurals are formed correctly?",
                    options: ["knifes", "knives", "tomatos", "tomatoes", "childs", "children"],
                    answers: ["knives", "tomatoes", "children"],
                    explanation: "Knives (knife→knives), tomatoes (tomato→tomatoes), and children (child→children) are all correct. Nouns ending in 'fe\' change to \'ves,\' nouns ending in consonant+o add \'es,\' and child has an irregular plural."
                  },
                  {
                    type: "fillblank",
                    sentence: "The _____ books are on the table. (possessive form of 'students\')",
                    answer: "students\'",
                    alternatives: ["students\'"],
                    explanation: "For plural nouns ending in 's,\' add only an apostrophe after the \'s.\' Students\' means belonging to more than one student."
                  },
                  {
                    type: "matching",
                    question: "Match each noun to its type by clicking on a noun in the LEFT column, then clicking on its matching type in the RIGHT column:",
                    pairs: [
                      { left: "Ghana", right: "Proper Noun" },
                      { left: "happiness", right: "Abstract Noun" },
                      { left: "team", right: "Collective Noun" },
                      { left: "mango", right: "Concrete Noun" },
                    ],
                    explanation: "Ghana is a proper noun (specific name), happiness is abstract (feeling), team is collective (group), and mango is concrete (can be seen/touched)."
                  },
                  {
                    type: "mcq",
                    question: "Which sentence uses the possessive case correctly?",
                    options: [
                      "The girls\'s dresses are beautiful.",
                      "The girl\'s dresses are beautiful.",
                      "The girls dresses are beautiful.",
                      "The girls dress\'s are beautiful."
                    ],
                    answer: "The girl\'s dresses are beautiful.",
                    explanation: "For singular nouns, add apostrophe + s (\'s). 'The girl\'s dresses\' means one girl owns multiple dresses."
                  },
                  {
                    type: "shortanswer",
                    question: "Give the plural forms of: (a) man, (b) mouse, (c) sheep",
                    answer: "(a) men (b) mice (c) sheep",
                    explanation: "These are irregular plurals: man→men, mouse→mice, sheep→sheep (same form). Irregular plurals must be memorized as they don\'t follow standard rules."
                  },
                  {
                    type: "mcq",
                    question: "What is the masculine gender of 'actress\'?",
                    options: ["act", "actor", "acting", "acts"],
                    answer: "actor",
                    explanation: "Actor is the masculine form of actress. This is a common gender pair tested in BECE exams."
                  },
                  {
                    type: "multiselect",
                    question: "Which are compound nouns?",
                    options: ["classroom", "beautiful", "toothbrush", "quickly", "bus stop", "happy"],
                    answers: ["classroom", "toothbrush", "bus stop"],
                    explanation: "Compound nouns are formed by joining two or more words: classroom (class+room), toothbrush (tooth+brush), bus stop (bus+stop). Beautiful, quickly, and happy are not nouns."
                  },
                  {
                    type: "shortanswer",
                    question: "Identify the function of the underlined noun: 'My father is a doctor.\' (What is the function of \'doctor\'?)",
                    answer: "Subject complement",
                    explanation: "\'Doctor\' is a subject complement because it renames or describes the subject 'father\' after the linking verb \'is.\'"
                  },
                ],
              },
              {
                id: 'eng104-3',
                slug: 'pronouns',
                title: 'Pronouns',
                objectives: [
                  "Define what a pronoun is and explain its function in sentences.",
                  "Identify and classify the eight main types of pronouns (personal, possessive, reflexive, demonstrative, interrogative, relative, indefinite, reciprocal).",
                  "Understand subject pronouns vs object pronouns and use them correctly in sentences.",
                  "Recognize and use possessive pronouns and possessive adjectives correctly.",
                  "Form and use reflexive and intensive pronouns appropriately.",
                  "Distinguish between demonstrative pronouns (this, that, these, those) and their uses.",
                  "Apply interrogative pronouns (who, whom, whose, which, what) in questions.",
                  "Understand pronoun-antecedent agreement in number, gender, and person.",
                  "Answer BECE-style examination questions on pronouns accurately."
                ],
                introduction: "Pronouns are essential words that replace nouns to make our speech and writing smoother and less repetitive. Instead of saying 'Kwame went to Kwame\'s house because Kwame forgot Kwame\'s book,\' we say \'Kwame went to his house because he forgot his book.\' In BECE examinations, questions on pronouns test your understanding of types, agreement, and correct usage. This comprehensive lesson will equip you with all the knowledge needed to master pronouns and excel in your exams.",
                keyConcepts: [
                  {
                    title: "1. What Are Pronouns?",
                    content: "A pronoun is a word that takes the place of a noun (or noun phrase) in a sentence. Pronouns help us avoid unnecessary repetition and make communication more efficient.\n\nExample WITHOUT pronouns (repetitive):\nAma loves books. Ama reads books every day. Books make Ama happy.\n\nExample WITH pronouns (smooth):\nAma loves books. She reads them every day. They make her happy.\n\nKey Terms:\n• ANTECEDENT: The noun that the pronoun replaces or refers to.\n  Example: Kofi is my brother. He is tall.\n  (Kofi is the antecedent; 'he\' is the pronoun)\n\n• PRONOUN-ANTECEDENT AGREEMENT: The pronoun must match its antecedent in:\n  - Number (singular/plural)\n  - Gender (masculine/feminine/neuter)\n  - Person (first/second/third)"
                  },
                  {
                    title: "2. Personal Pronouns",
                    content: "Personal pronouns refer to specific people or things. They change form based on:\n• Person (1st, 2nd, 3rd)\n• Number (singular, plural)\n• Case (subject, object)\n\nSUBJECT PRONOUNS (used as the subject doing the action):\nSingular:\n• 1st person: I (I am happy)\n• 2nd person: you (You are smart)\n• 3rd person: he, she, it (He runs fast / She sings / It works)\n\nPlural:\n• 1st person: we (We study hard)\n• 2nd person: you (You all passed)\n• 3rd person: they (They play football)\n\nOBJECT PRONOUNS (used as the object receiving the action):\nSingular:\n• 1st person: me (Help me)\n• 2nd person: you (I see you)\n• 3rd person: him, her, it (I like him / I know her / I found it)\n\nPlural:\n• 1st person: us (Join us)\n• 2nd person: you (I\'ll call you)\n• 3rd person: them (I saw them)\n\nIMPORTANT RULES:\n1. Subject pronouns come BEFORE the verb:\n   ✓ She loves music. | ✗ Her loves music.\n\n2. Object pronouns come AFTER the verb or preposition:\n   ✓ The teacher helped me. | ✗ The teacher helped I.\n   ✓ Come with us. | ✗ Come with we.\n\n3. After 'to be\' (is, am, are, was, were), use subject pronouns formally:\n   ✓ It is I. (formal) | It\'s me. (informal - commonly accepted)\n   ✓ This is she. (formal) | This is her. (informal)"
                  },
                  {
                    title: "3. Possessive Pronouns and Possessive Adjectives",
                    content: "These show ownership, but they work differently:\n\nPOSSESSIVE ADJECTIVES (come BEFORE a noun):\n• my book, your pen, his bag, her dress, its tail, our school, their house\n\nPOSSESSIVE PRONOUNS (stand ALONE, replace noun + possessive adjective):\n• mine, yours, his, hers, its, ours, theirs\n\nExamples:\n• This is my book → This book is mine.\n• That is your pen → That pen is yours.\n• This is our school → This school is ours.\n• Those are their bags → Those bags are theirs.\n\nCOMMON MISTAKES TO AVOID:\n1. ✗ The book is my. | ✓ The book is mine.\n2. ✗ This is me book. | ✓ This is my book.\n3. ✗ That car is their\'s. | ✓ That car is theirs. (no apostrophe!)\n4. ✗ The cat wagged it\'s tail. | ✓ The cat wagged its tail. (its = possessive, it\'s = it is)\n\nNote: 'his\' can be both possessive adjective AND possessive pronoun:\n• his book (adjective) / The book is his (pronoun)"
                  },
                  {
                    title: "4. Reflexive and Intensive Pronouns",
                    content: "These pronouns end in -self (singular) or -selves (plural):\n\nREFLEXIVE PRONOUNS (the subject does something to/for itself):\n• Singular: myself, yourself, himself, herself, itself\n• Plural: ourselves, yourselves, themselves\n\nExamples:\n• I hurt myself. (I hurt me - myself receives the action)\n• She taught herself to play guitar.\n• They enjoyed themselves at the party.\n• The cat cleaned itself.\n\nINTENSIVE PRONOUNS (emphasize the subject, can be removed without changing meaning):\n• I myself saw the accident. (emphasis: I personally saw it)\n• The president himself attended the meeting.\n• We ourselves will solve the problem.\n\nCOMMON ERRORS:\n✗ I bought me a book. | ✓ I bought myself a book.\n✗ Themself is not a word. | ✓ Use themselves (plural) or himself/herself (singular)\n✗ Hisself, theirselves | ✓ himself, themselves"
                  },
                  {
                    title: "5. Demonstrative Pronouns",
                    content: "These pronouns point to specific things and show whether they are near or far, singular or plural.\n\nNear:\n• this (singular) - This is my book.\n• these (plural) - These are my books.\n\nFar:\n• that (singular) - That is your house.\n• those (plural) - Those are your shoes.\n\nDemonstrative Adjectives vs Pronouns:\n• PRONOUN (stands alone): This is beautiful. / Those are mine.\n• ADJECTIVE (before noun): This book is beautiful. / Those shoes are mine.\n\nRULES:\n1. Use 'this/these\' for things close in space or time:\n   • This morning, I woke up early.\n   • These days, students study hard.\n\n2. Use \'that/those\' for things far in space or time:\n   • Remember that day we met?\n   • Those were the good old days.\n\n3. Match singular/plural:\n   ✗ This books | ✓ These books\n   ✗ Those boy | ✓ That boy"
                  },
                  {
                    title: "6. Interrogative Pronouns",
                    content: "These pronouns are used to ask questions:\n\n• WHO - asks about people (subject)\n  - Who is coming to the party?\n  - Who made this mess?\n\n• WHOM - asks about people (object) - formal\n  - Whom did you meet? (formal)\n  - Who did you meet? (informal - commonly used)\n\n• WHOSE - asks about possession\n  - Whose book is this?\n  - Whose turn is it?\n\n• WHICH - asks about choice between limited options\n  - Which dress do you prefer - the red one or the blue one?\n  - Which is your favorite subject?\n\n• WHAT - asks about things (unlimited options)\n  - What is your name?\n  - What happened yesterday?\n\nWHO vs WHOM:\nSimple test: Replace with he/him:\n• If 'he\' fits → use WHO\n  - Who is calling? (He is calling) ✓\n• If \'him\' fits → use WHOM\n  - Whom did you call? (You called him) ✓\n\nWHICH vs WHAT:\n• WHICH - limited, specific choices\n  - Which color: red, blue, or green?\n• WHAT - open-ended, unlimited\n  - What is your favorite color? (any color)"
                  },
                  {
                    title: "7. Relative Pronouns",
                    content: "These pronouns connect a clause (group of words) to a noun. They introduce relative clauses that give more information about something.\n\nMain Relative Pronouns:\n• WHO - for people (subject)\n• WHOM - for people (object)\n• WHOSE - for possession\n• WHICH - for animals/things\n• THAT - for people/animals/things\n\nExamples:\n• The girl who sits next to me is my friend.\n  (who connects 'sits next to me\' to \'girl\')\n• The book which I bought is interesting.\n  (which connects \'I bought\' to \'book\')\n• The teacher whose class I attend is very kind.\n  (whose shows possession - the teacher\'s class)\n• The house that we visited was beautiful.\n  (that connects \'we visited\' to \'house\')\n\nWHO vs WHICH vs THAT:\n• WHO - people only\n  - The man who called you is here.\n• WHICH - animals/things (can use \'that\' instead)\n  - The car which/that I bought is fast.\n• THAT - people/animals/things (more common in everyday speech)\n  - The student that won is my friend.\n  - The dog that barked is friendly."
                  },
                  {
                    title: "8. Indefinite Pronouns",
                    content: "These pronouns refer to non-specific people or things. They do not point to a particular person or object.\n\nSINGULAR (take singular verbs):\n• someone, somebody, something\n• anyone, anybody, anything\n• no one, nobody, nothing\n• everyone, everybody, everything\n• each, either, neither\n• one, another\n\nPLURAL (take plural verbs):\n• both, few, many, several, others\n\nSINGULAR OR PLURAL (depends on context):\n• all, any, most, none, some\n\nExamples:\n• Someone is at the door. (singular verb 'is\')\n• Everyone loves a good story. (singular verb \'loves\')\n• Many are called, but few are chosen. (plural verb \'are\')\n• Both of them are my friends. (plural verb \'are\')\n• Some of the cake is left. (singular - refers to cake)\n• Some of the students are absent. (plural - refers to students)\n\nCOMMON ERRORS:\n✗ Everyone are happy. | ✓ Everyone is happy.\n✗ Somebody have called. | ✓ Somebody has called.\n✗ Each of the boys have a pen. | ✓ Each of the boys has a pen."
                  },
                  {
                    title: "9. Reciprocal Pronouns",
                    content: "These pronouns show a mutual relationship between two or more people.\n\n• EACH OTHER - for two people\n  - Ama and Kofi help each other. (Ama helps Kofi, Kofi helps Ama)\n\n• ONE ANOTHER - for more than two people\n  - The students help one another. (many students helping each other)\n\nNote: In modern English, 'each other\' and \'one another\' are often used interchangeably.\n\nExamples:\n• The two friends respect each other.\n• The team members support one another.\n• My parents love each other deeply."
                  },
                  {
                    title: "10. Pronoun-Antecedent Agreement",
                    content: "A pronoun must agree with its antecedent (the noun it replaces) in three ways:\n\n1. NUMBER (singular/plural):\n   ✗ The student forgot their book. | ✓ The student forgot his/her book.\n   ✓ The students forgot their books.\n\n2. GENDER (masculine/feminine/neuter):\n   ✗ Mary said he is coming. | ✓ Mary said she is coming.\n   ✓ The dog wagged its tail. (not 'his\' or \'her\')\n\n3. PERSON (1st/2nd/3rd):\n   ✗ When one studies, you should concentrate. | ✓ When you study, you should concentrate.\n   ✓ When one studies, one should concentrate.\n\nSPECIAL CASES:\n• Compound subjects joined by \'and\' → plural pronoun:\n  - Kofi and Ama brought their books.\n\n• Compound subjects joined by \'or/nor\' → pronoun agrees with nearest noun:\n  - Either John or the boys will bring their ball.\n  - Neither the boys nor John will bring his ball.\n\n• Collective nouns (team, class, family) → usually singular:\n  - The team won its match. (team as one unit)\n  - The team are arguing among themselves. (members as individuals)\n\n• Indefinite pronouns (everyone, somebody) → traditionally singular:\n  - Everyone should bring his or her book.\n  - Modern usage: Everyone should bring their book. (increasingly accepted)"
                  },
                ],

                activities: {
                  type: "exercises",
                  exercises: [
                    {
                      title: "Exercise 1: Identify and Classify Pronouns",
                      instructions: "Read each sentence carefully. Identify all the pronouns and state what type each pronoun is (personal, possessive, reflexive, demonstrative, interrogative, relative, indefinite, or reciprocal).",
                      questions: [
                        { question: "She bought herself a new dress for the party.", answer: "She (personal - subject), herself (reflexive)" },
                        { question: "These are the books which I borrowed from the library.", answer: "These (demonstrative), which (relative), I (personal - subject)" },
                        { question: "Everyone should do their homework before class.", answer: "Everyone (indefinite), their (possessive adjective)" },
                        { question: "Whose pen is this? Is it yours or mine?", answer: "Whose (interrogative), this (demonstrative), it (personal - subject), yours (possessive pronoun), mine (possessive pronoun)" },
                        { question: "The children enjoyed themselves and helped one another.", answer: "themselves (reflexive), one another (reciprocal)" },
                        { question: "He told us that somebody had taken his book.", answer: "He (personal - subject), us (personal - object), that (relative), somebody (indefinite), his (possessive adjective)" },
                        { question: "Which of you saw what happened to them?", answer: "Which (interrogative), you (personal), what (interrogative), them (personal - object)" },
                      ],
                    },
                    {
                      title: "Exercise 2: Subject vs Object Pronouns",
                      instructions: "Choose the correct pronoun (subject or object form) to complete each sentence.",
                      questions: [
                        { question: "Ama and _____ went to the market. (I/me)", answer: "I (subject pronoun - Ama and I went)" },
                        { question: "The teacher gave _____ some homework. (we/us)", answer: "us (object pronoun - gave to us)" },
                        { question: "Between you and _____, I think he is wrong. (I/me)", answer: "me (object pronoun - after preposition 'between\')" },
                        { question: "_____ and John are best friends. (He/Him)", answer: "He (subject pronoun)" },
                        { question: "My mother took my sister and _____ to the zoo. (I/me)", answer: "me (object pronoun)" },
                        { question: "Was it _____ who called? (she/her)", answer: "she (after 'to be\' verb - formal usage)" },
                        { question: "The ball hit both _____ and John. (he/him)", answer: "him (object pronoun)" },
                      ],
                    },
                    {
                      title: "Exercise 3: Possessive Pronouns vs Possessive Adjectives",
                      instructions: "Fill in the blanks with the correct possessive pronoun or possessive adjective.",
                      questions: [
                        { question: "This is _____ book. The book is _____. (my/mine)", answer: "my (adjective before noun), mine (pronoun standing alone)" },
                        { question: "Is this _____ pen or is it _____? (your/yours, her/hers)", answer: "your (adjective), hers (pronoun)" },
                        { question: "The dog wagged _____ tail happily. (its/it\'s)", answer: "its (possessive - NOT it\'s which means 'it is\')" },
                        { question: "_____ house is bigger than _____. (Our/Ours, their/theirs)", answer: "Our (adjective before noun), theirs (pronoun)" },
                        { question: "That bag is not _____; it\'s _____. (my/mine, his/him)", answer: "mine (pronoun after 'is\'), his (can be both adjective and pronoun)" },
                        { question: "_____ car broke down, so we took _____. (Their/Theirs, our/ours)", answer: "Their (adjective before noun), ours (pronoun)" },
                      ],
                    },
                    {
                      title: "Exercise 4: Reflexive Pronouns",
                      instructions: "Complete each sentence with the correct reflexive pronoun.",
                      questions: [
                        { question: "I taught _____ to play the guitar.", answer: "myself" },
                        { question: "She looked at _____ in the mirror.", answer: "herself" },
                        { question: "The children enjoyed _____ at the party.", answer: "themselves" },
                        { question: "We should be proud of _____.", answer: "ourselves" },
                        { question: "Did you hurt _____ when you fell?", answer: "yourself" },
                        { question: "The cat can clean _____ very well.", answer: "itself" },
                        { question: "They blamed _____ for the mistake.", answer: "themselves" },
                      ],
                    },
                    {
                      title: "Exercise 5: Demonstrative Pronouns",
                      instructions: "Choose the correct demonstrative pronoun: this, that, these, or those.",
                      questions: [
                        { question: "_____ is my school bag. (near/singular)", answer: "This" },
                        { question: "_____ are my books on the table. (near/plural)", answer: "These" },
                        { question: "_____ is your house over there. (far/singular)", answer: "That" },
                        { question: "_____ were the days! (far/plural - referring to past)", answer: "Those" },
                        { question: "_____ shoes I\'m wearing are new. (near/plural)", answer: "These" },
                        { question: "Is _____ your brother standing by the gate? (far/singular)", answer: "that" },
                      ],
                    },
                    {
                      title: "Exercise 6: Relative Pronouns",
                      instructions: "Complete each sentence with the correct relative pronoun: who, whom, whose, which, or that.",
                      questions: [
                        { question: "The girl _____ sits next to me is very intelligent.", answer: "who/that (refers to person, subject of 'sits\')" },
                        { question: "The book _____ I read was very interesting.", answer: "which/that (refers to thing, object of 'read\')" },
                        { question: "The teacher _____ bag was stolen reported to the police.", answer: "whose (shows possession)" },
                        { question: "The man to _____ I spoke was very helpful.", answer: "whom (formal, object of 'spoke to\')" },
                        { question: "The house _____ we visited belongs to my uncle.", answer: "which/that (refers to thing, object of 'visited\')" },
                        { question: "Students _____ study hard will succeed.", answer: "who/that (refers to people, subject of 'study\')" },
                      ],
                    },
                    {
                      title: "Exercise 7: Pronoun-Antecedent Agreement and Error Correction",
                      instructions: "Correct any pronoun errors in these sentences. If the sentence is correct, write 'Correct.\'",
                      questions: [
                        { question: "Every student must bring their own book.", answer: "Every student must bring his or her own book. (singular antecedent needs singular pronoun) OR 'All students must bring their own books.\' (make both plural)" },
                        { question: "The team won their match yesterday.", answer: "The team won its match yesterday. (team is singular collective noun)" },
                        { question: "Either Mary or the boys will bring their ball.", answer: "Correct (pronoun agrees with nearest antecedent 'boys\')" },
                        { question: "Me and John went to the cinema.", answer: "John and I went to the cinema. (use subject pronoun 'I', and put yourself last)" },
                        { question: "The cat hurt it's paw.", answer: "The cat hurt its paw. (its = possessive, it's = it is)" },
                        { question: "Between you and I, he is wrong.", answer: "Between you and me, he is wrong. (object pronoun after preposition)" },
                        { question: "Nobody have finished their work.", answer: "Nobody has finished his or her work. (nobody is singular)" },
                        { question: "The book is her's.", answer: "The book is hers. (no apostrophe in possessive pronouns)" },
                      ],
                    },
                  ],
                },
                pastQuestions: [
                  {
                    year: "BECE 2023",
                    question: "Choose the correct pronoun to complete the sentence:\nKofi and _____ went to the library.\nA. me\nB. I\nC. myself\nD. mine",
                    answer: "B",
                    explanation: "The correct answer is 'I\' because it is a subject pronoun. The sentence structure is \'Kofi and I went,\' where \'I\' is part of the compound subject performing the action \'went.\' \'Me\' is an object pronoun and would be incorrect here. To test: remove 'Kofi and\' - you would say \'I went\' not \'Me went.\' \'Myself\' is reflexive and \'mine\' is possessive, neither fits this context."
                  },
                  {
                    year: "BECE 2023",
                    question: "Identify the possessive pronoun in the sentence:\nThis book is yours, and that one is mine.\nA. This\nB. yours\nC. that\nD. one",
                    answer: "B",
                    explanation: "The correct answer is 'yours\' because it is a possessive pronoun showing ownership without needing a following noun. \'Mine\' is also a possessive pronoun, but it\'s not among the options. \'This\' and \'that\' are demonstrative pronouns/adjectives, and \'one\' is an indefinite pronoun. Possessive pronouns (mine, yours, his, hers, ours, theirs) stand alone, unlike possessive adjectives (my, your, his, her, our, their) which come before nouns."
                  },
                  {
                    year: "BECE 2022",
                    question: "Which sentence uses a reflexive pronoun correctly?\nA. I bought me a new pen.\nB. She taught herself to dance.\nC. They enjoyed theirselves at the party.\nD. He hurt hisself playing football.",
                    answer: "B",
                    explanation: "The correct answer is B. 'Herself\' is the correct reflexive pronoun for third person singular feminine. Reflexive pronouns are: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. Option A should be 'I bought myself a pen.\' Options C and D contain non-existent words: 'theirselves\' should be \'themselves,\' and \'hisself\' should be \'himself.\'"
                  },
                  {
                    year: "BECE 2022",
                    question: "Complete the sentence with the correct pronoun:\nThe teacher gave the books to my friend and _____.\nA. I\nB. me\nC. myself\nD. mine",
                    answer: "B",
                    explanation: "The correct answer is 'me\' because an object pronoun is needed after the preposition \'to.\' The full phrase is \'to my friend and me,\' where \'me\' is the object receiving the books. To test: remove 'my friend and\' - you would say \'gave the books to me\' not \'gave the books to I.\' Subject pronouns (I, he, she) come before verbs, object pronouns (me, him, her) come after verbs or prepositions."
                  },
                  {
                    year: "BECE 2021",
                    question: "What type of pronoun is 'who\' in this sentence?\nThe boy who won the race is my brother.\nA. Personal pronoun\nB. Interrogative pronoun\nC. Relative pronoun\nD. Demonstrative pronoun",
                    answer: "C",
                    explanation: "The correct answer is C - 'who\' is a relative pronoun here. Relative pronouns (who, whom, whose, which, that) connect a clause to a noun and provide more information about it. In this sentence, \'who won the race\' is a relative clause giving information about \'the boy.\' If \'who\' were asking a question (\'Who won the race?\'), it would be an interrogative pronoun. The context determines the pronoun type."
                  },
                  {
                    year: "BECE 2021",
                    question: "Choose the sentence with correct pronoun usage:\nA. Everyone have finished their work.\nB. Everyone has finished his or her work.\nC. Everyone have finished his work.\nD. Everyone are finished their work.",
                    answer: "B",
                    explanation: "The correct answer is B. 'Everyone\' is a singular indefinite pronoun and requires a singular verb (\'has\' not \'have\') and singular possessive pronoun (\'his or her\' not \'their\'). Although modern English increasingly accepts \'everyone...their\' to avoid gender-specific language, traditional grammar (tested in BECE) requires singular agreement. Option A has wrong verb and pronoun, C has wrong verb, and D has double wrong verb forms."
                  },
                  {
                    year: "BECE 2020",
                    question: "Identify the demonstrative pronoun in the sentence:\nThose are my favorite shoes.\nA. Those\nB. are\nC. my\nD. shoes",
                    answer: "A",
                    explanation: "The correct answer is A. 'Those\' is a demonstrative pronoun pointing to specific items (shoes) that are far from the speaker. Demonstrative pronouns are: this (near/singular), that (far/singular), these (near/plural), those (far/plural). When 'those\' stands alone (as here) it\'s a pronoun; when it comes before a noun (\'those shoes\'), it\'s a demonstrative adjective. \'My\' is a possessive adjective, not a pronoun."
                  },
                  {
                    year: "BECE 2020",
                    question: "Which is the correct possessive form?\nA. The cat wagged it\'s tail.\nB. The cat wagged its tail.\nC. The cat wagged its\' tail.\nD. The cat wagged it tail.",
                    answer: "B",
                    explanation: "The correct answer is B - 'its\' (without apostrophe) is the possessive form. This is a common mistake area: 'its\' = possessive (like his, hers), \'it\'s\' = it is (contraction). Possessive pronouns (mine, yours, his, hers, its, ours, theirs) NEVER use apostrophes. Only possessive nouns use apostrophes (the cat\'s tail). Option A confuses it\'s (it is) with its (possessive), C incorrectly adds apostrophe after \'s,\' and D is incomplete."
                  },
                  {
                    year: "BECE 2019",
                    question: "Choose the interrogative pronoun:\nA. He is my friend.\nB. These are my books.\nC. What did you say?\nD. She taught herself.",
                    answer: "C",
                    explanation: "The correct answer is C. 'What\' is an interrogative pronoun used to ask questions. The five interrogative pronouns are: who (asks about people), whom (formal, asks about people as objects), whose (asks about possession), which (asks for choice), what (asks about things). Option A uses personal pronoun 'he,\' option B uses demonstrative pronoun \'these,\' and option D uses reflexive pronoun \'herself.\'"
                  },
                  {
                    year: "BECE 2019",
                    question: "Complete with the correct pronoun:\nEither the boys or John will bring _____ ball.\nA. their\nB. his\nC. its\nD. our",
                    answer: "B",
                    explanation: "The correct answer is B - 'his.\' When subjects are joined by \'or\' or \'nor,\' the pronoun agrees with the nearest subject. Here, \'John\' (singular masculine) is nearest, so we use \'his.\' If the sentence were \'Either John or the boys will bring their ball,\' we\'d use \'their\' because \'boys\' (plural) is nearest. This rule applies to either...or, neither...nor constructions. Note: 'its\' is for animals/things, not people."
                  },
                  {
                    year: "BECE 2018",
                    question: "Identify the type of pronoun 'themselves\' in this sentence:\nThey prepared themselves for the exam.\nA. Personal pronoun\nB. Reflexive pronoun\nC. Intensive pronoun\nD. Reciprocal pronoun",
                    answer: "B",
                    explanation: "The correct answer is B - reflexive pronoun. 'Themselves\' is reflexive here because the subject (they) performs an action on itself - they prepared themselves. Reflexive pronouns end in -self/-selves (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves). If the sentence were \'They themselves prepared for the exam,\' it would be intensive (for emphasis). Intensive pronouns can be removed without changing meaning; reflexive cannot."
                  },
                  {
                    year: "BECE 2018",
                    question: "Which sentence shows correct pronoun-antecedent agreement?\nA. The team celebrated their victory.\nB. The team celebrated its victory.\nC. Each student must submit their assignment.\nD. Somebody have left their bag.",
                    answer: "B",
                    explanation: "The correct answer is B. 'Team\' is a singular collective noun when acting as one unit, so it takes the singular pronoun \'its.\' Option A would be correct only if referring to team members as individuals (\'The team members celebrated their victory\'). Option C is incorrect in formal grammar - \'each\' is singular and needs \'his or her\' (though modern usage increasingly accepts \'their\'). Option D has double error: 'somebody\' is singular, needs \'has\' not \'have\' and \'his or her\' not \'their.\'"
                  },
                  {
                    year: "BECE 2017",
                    question: "What is the function of 'which\' in this sentence?\nThe car which I bought is very fast.\nA. Interrogative pronoun asking a question\nB. Relative pronoun connecting a clause\nC. Demonstrative pronoun pointing\nD. Indefinite pronoun",
                    answer: "B",
                    explanation: "The correct answer is B - relative pronoun. 'Which\' connects the clause \'I bought\' to the noun \'car,\' providing additional information about it. Relative pronouns (who, whom, whose, which, that) introduce relative clauses. If this were a question (\'Which car did I buy?\'), \'which\' would be interrogative. The context tells us the type: connecting clause = relative, asking question = interrogative."
                  },
                  {
                    year: "BECE 2017",
                    question: "Choose the sentence with incorrect pronoun usage:\nA. Between you and me, she is very talented.\nB. John and I are going to the cinema.\nC. The gift is for my sister and I.\nD. They helped us finish the work.",
                    answer: "C",
                    explanation: "The correct answer is C - this sentence is INCORRECT. It should be 'for my sister and me\' because an object pronoun is needed after the preposition \'for.\' Test: remove 'my sister and\' - you\'d say \'the gift is for me\' not \'for I.\' Option A is correct (object pronoun \'me\' after preposition \'between\'), B is correct (subject pronoun \'I\'), and D is correct (object pronoun \'us\' after verb \'helped\')."
                  },
                  {
                    year: "BECE 2016",
                    question: "Complete the sentence:\nNeither of the girls brought _____ lunch today.\nA. her\nB. their\nC. its\nD. his",
                    answer: "A",
                    explanation: "The correct answer is A - 'her.\' \'Neither\' is a singular pronoun, so it takes a singular verb and singular possessive pronoun. Since \'girls\' tells us they\'re female, we use \'her.\' Formal: 'Neither of the girls brought her lunch.\' The phrase \'of the girls\' is a prepositional phrase; the subject is still \'neither\' (singular). Common error: using 'their\' because \'girls\' is plural, but \'neither\' (not \'girls\') is the subject and it\'s singular."
                  },
                ],
                endOfLessonQuiz: [
                  {
                    type: "mcq",
                    question: "Which of the following is a personal pronoun used as a subject?",
                    options: ["me", "them", "her", "she"],
                    answer: "she",
                    explanation: "\'She\' is a subject pronoun used before the verb. 'Me,\' \'them,\' and \'her\' are object pronouns used after verbs or prepositions."
                  },
                  {
                    type: "truefalse",
                    statement: "Pronouns must agree with their antecedent in number, gender, and person.",
                    answer: "true",
                    reason: "Pronoun-antecedent agreement requires the pronoun to match the noun it replaces in all three aspects."
                  },
                  {
                    type: "mcq",
                    question: "Choose the correct pronoun: 'Between you and _____, I think she is right.\'",
                    options: ["I", "me", "myself", "mine"],
                    answer: "me",
                    explanation: "After the preposition 'between,\' we use the object pronoun \'me.\' Never say \'between you and I.\'"
                  },
                  {
                    type: "fillblank",
                    sentence: "The book is not _____ (my/mine); it belongs to Sarah.",
                    answer: "mine",
                    explanation: "\'Mine\' is the possessive pronoun that stands alone. 'My\' is a possessive adjective that comes before a noun."
                  },
                  {
                    type: "mcq",
                    question: "Identify the reflexive pronoun: 'She taught _____ to play the piano.\'",
                    options: ["her", "herself", "hers", "she"],
                    answer: "herself",
                    explanation: "\'Herself\' is a reflexive pronoun showing that she taught herself. Reflexive pronouns end in -self or -selves."
                  },
                  {
                    type: "truefalse",
                    statement: "The possessive pronoun 'its\' always has an apostrophe (it\'s).",
                    answer: "false",
                    reason: "\'Its\' (no apostrophe) is the possessive form. 'It\'s\' (with apostrophe) means \'it is.\'"
                  },
                  {
                    type: "multiselect",
                    question: "Which of these are demonstrative pronouns?",
                    options: ["this", "who", "those", "what", "that", "which"],
                    answers: ["this", "those", "that"],
                    explanation: "Demonstrative pronouns are: this, that, these, those. They point to specific things. 'Who,\' \'what,\' and \'which\' are interrogative pronouns."
                  },
                  {
                    type: "mcq",
                    question: "What type of pronoun is 'who\' in the sentence: 'The girl who won is my sister\'?",
                    options: ["Personal pronoun", "Interrogative pronoun", "Relative pronoun", "Demonstrative pronoun"],
                    answer: "Relative pronoun",
                    explanation: "\'Who\' is a relative pronoun here because it connects the clause 'won\' to the noun \'girl.\' It\'s not asking a question."
                  },
                  {
                    type: "fillblank",
                    sentence: "The teacher gave the prize to Ama and _____ (I/me).",
                    answer: "me",
                    explanation: "After the preposition 'to,\' we use the object pronoun \'me.\' Test: 'The teacher gave the prize to me\' (not \'to I\')."
                  },
                  {
                    type: "truefalse",
                    statement: "\'Everyone\' is a plural pronoun and takes a plural verb.",
                    answer: "false",
                    reason: "\'Everyone\' is a singular indefinite pronoun and takes a singular verb: 'Everyone is here\' (not \'Everyone are here\')."
                  },
                  {
                    type: "mcq",
                    question: "Choose the sentence with correct pronoun usage:",
                    options: [
                      "Me and John are friends.",
                      "John and I are friends.",
                      "John and me are friends.",
                      "Myself and John are friends."
                    ],
                    answer: "John and I are friends.",
                    explanation: "Use the subject pronoun 'I\' before the verb, and always put the other person\'s name first. Test: 'I am friends\' (not \'Me am friends\')."
                  },
                  {
                    type: "matching",
                    question: "Match each pronoun to its type by clicking on a pronoun in the LEFT column, then clicking on its matching type in the RIGHT column:",
                    pairs: [
                      { left: "myself", right: "Reflexive" },
                      { left: "those", right: "Demonstrative" },
                      { left: "whom", right: "Interrogative" },
                      { left: "everyone", right: "Indefinite" },
                    ],
                    explanation: "Reflexive pronouns end in -self/-selves. Demonstrative pronouns point (this/that/these/those). Interrogative pronouns ask questions. Indefinite pronouns refer to non-specific people/things."
                  },
                  {
                    type: "mcq",
                    question: "Complete: 'Either the boys or John will bring _____ ball.\'",
                    options: ["his", "their", "its", "our"],
                    answer: "his",
                    explanation: "With 'either...or,\' the pronoun agrees with the nearest subject. \'John\' is nearest, so we use \'his.\' If it were \'Either John or the boys,\' we\'d use \'their.\'"
                  },
                  {
                    type: "shortanswer",
                    question: "Correct this error: 'The team won their match.\' (Explain why it\'s wrong and provide the correct version.)",
                    answer: "The team won its match",
                    explanation: "When 'team\' acts as a single unit, it\'s singular and takes the singular pronoun \'its.\' Only use \'their\' when referring to team members as individuals."
                  },
                  {
                    type: "truefalse",
                    statement: "Possessive pronouns (mine, yours, hers, theirs) never use apostrophes.",
                    answer: "true",
                    reason: "Possessive pronouns never have apostrophes. Only possessive nouns use apostrophes (e.g., 'the cat\'s tail\'). Never write \'her\'s\' or \'their\'s.\'"
                  },
                  {
                    type: "multiselect",
                    question: "Which sentences use reflexive pronouns correctly?",
                    options: [
                      "I hurt myself playing football.",
                      "She bought her a new dress.",
                      "They enjoyed themselves at the party.",
                      "He taught hisself to swim."
                    ],
                    answers: ["I hurt myself playing football.", "They enjoyed themselves at the party."],
                    explanation: "Options 1 and 3 are correct. Option 2 should be 'herself\' (not \'her\'). Option 4 should be \'himself\' (not \'hisself\')."
                  },
                  {
                    type: "mcq",
                    question: "Which word is the antecedent in this sentence: 'Mary lost her book\'?",
                    options: ["Mary", "lost", "her", "book"],
                    answer: "Mary",
                    explanation: "The antecedent is the noun that the pronoun refers to. 'Her\' refers to \'Mary,\' so \'Mary\' is the antecedent."
                  },
                ],
                summary: 'Pronouns are essential tools in English that replace nouns to avoid repetition and make our communication more efficient. In this comprehensive lesson, you have mastered all eight types of pronouns: PERSONAL pronouns (subject and object forms), POSSESSIVE pronouns and adjectives, REFLEXIVE and intensive pronouns, DEMONSTRATIVE pronouns, INTERROGATIVE pronouns, RELATIVE pronouns, INDEFINITE pronouns, and RECIPROCAL pronouns. You learned the critical rules of pronoun-antecedent agreement, proper case usage (subject vs object), and common error patterns that appear frequently in BECE examinations. Remember the key distinctions: use subject pronouns (I, he, she, we, they) before verbs, object pronouns (me, him, her, us, them) after verbs and prepositions, never write "between you and I" (always "between you and me"), possessive pronouns never use apostrophes (its, not it\'s for possession), and reflexive pronouns must match their subject. With 15 BECE-style past questions and 7 comprehensive exercises, you are fully equipped to handle any pronoun question in your examination and use pronouns correctly in all your writing and speaking.',
              },
              {
                id: 'eng104-4',
                slug: 'tenses-1',
                title: 'Tenses (Simple Present, Past, Future)',
                objectives: [
                  'Define what tenses are and explain their importance in communication.',
                  'Identify and use the Simple Present Tense correctly for habits, general truths, and regular actions.',
                  'Form and use the Simple Past Tense to describe completed actions.',
                  'Construct sentences in the Simple Future Tense using "will" and "shall".',
                  'Recognize time expressions associated with each tense.',
                  'Convert sentences from one tense to another accurately.',
                  'Distinguish between regular and irregular verb forms in past tense.',
                  'Apply tense rules to answer BECE-style examination questions.'
                ],
                introduction: 'Tenses are verb forms that show WHEN an action happens-in the past, present, or future. Understanding tenses is crucial for clear communication and correct sentence construction. In WAEC BECE examinations, tense questions are common and test your ability to use the right verb form for the right time. This lesson focuses on the three simple tenses: Simple Present, Simple Past, and Simple Future. By mastering these foundational tenses, you will be able to express actions happening now, actions that already happened, and actions that will happen later.',
                keyConcepts: [
                  { 
                    title: 'What Are Tenses?', 
                    content: 'Tenses are forms of verbs that indicate the TIME when an action takes place.\n\nTHREE MAIN TIME FRAMES:\n• PRESENT: Actions happening now or regularly\n• PAST: Actions that already happened\n• FUTURE: Actions that will happen later\n\nExample with the verb "play":\n• Present: I play football every day.\n• Past: I played football yesterday.\n• Future: I will play football tomorrow.' 
                  },
                  { 
                    title: 'Simple Present Tense', 
                    content: 'USES:\n1. Habitual or repeated actions (things we do regularly)\n   Example: She wakes up at 6 a.m. every day.\n\n2. General truths and facts\n   Example: The sun rises in the east.\n\n3. Permanent situations\n   Example: My father works in a bank.\n\n4. Timetabled future events\n   Example: The train leaves at 8 p.m.\n\nFORMATION:\nSubject + Base Verb (+ s/es for he, she, it)\n\nRULES FOR ADDING -S/-ES:\n• Most verbs: add -s (play → plays, eat → eats)\n• Verbs ending in -s, -sh, -ch, -x, -z, -o: add -es (wash → washes, go → goes)\n• Verbs ending in consonant + y: change y to -ies (study → studies, cry → cries)\n\nEXAMPLES:\n✓ I study English every day.\n✓ He studies English every day.\n✓ They go to school.\n✓ She goes to school.\n\nCOMMON TIME EXPRESSIONS:\nalways, usually, often, sometimes, rarely, never, every day/week/year, on Mondays, in the morning' 
                  },
                  { 
                    title: 'Simple Past Tense', 
                    content: 'USES:\n1. Actions completed in the past\n   Example: I visited my uncle last week.\n\n2. Past habits (things we used to do)\n   Example: We played football every evening.\n\n3. Series of completed actions in the past\n   Example: He woke up, brushed his teeth, and ate breakfast.\n\nFORMATION:\nSubject + Past form of verb\n\nREGULAR VERBS: Add -ed to base form\n• play → played\n• walk → walked\n• want → wanted\n\nSPECIAL SPELLING RULES:\n• Verbs ending in -e: add -d only (live → lived)\n• Verbs ending in consonant + y: change y to -ied (cry → cried)\n• One-syllable verbs ending in consonant-vowel-consonant: double final consonant (stop → stopped)\n\nIRREGULAR VERBS: Memorize these common forms\n• go → went\n• eat → ate\n• see → saw\n• come → came\n• write → wrote\n• take → took\n• speak → spoke\n• buy → bought\n• teach → taught\n• think → thought\n• run → ran\n• drink → drank\n• sing → sang\n• begin → began\n• break → broke\n• bring → brought\n• build → built\n• catch → caught\n• feel → felt\n• find → found\n• get → got\n• give → gave\n• have → had\n• hear → heard\n• keep → kept\n• know → knew\n• leave → left\n• make → made\n• meet → met\n• pay → paid\n• read → read (pronunciation changes)\n• say → said\n• sell → sold\n• send → sent\n• sit → sat\n• sleep → slept\n• stand → stood\n• tell → told\n• understand → understood\n• win → won\n\nEXAMPLES:\n✓ I played football yesterday. (regular)\n✓ She went to Accra last month. (irregular)\n✓ They bought new books. (irregular)\n\nCOMMON TIME EXPRESSIONS:\nyesterday, last week/month/year, ago, in 2010, when I was young' 
                  },
                  { 
                    title: 'Simple Future Tense', 
                    content: 'USES:\n1. Actions that will happen in the future\n   Example: I will travel to Kumasi next week.\n\n2. Predictions\n   Example: It will rain tomorrow.\n\n3. Spontaneous decisions\n   Example: I will help you with that.\n\n4. Promises\n   Example: I will call you later.\n\nFORMATION:\nSubject + will/shall + base verb\n\nWILL vs SHALL:\n• "WILL" is used with all persons (I, you, he, she, it, we, they) - MOST COMMON\n• "SHALL" is traditionally used with I and we (formal/British style)\n  Modern English prefers "will" for all subjects.\n\nEXAMPLES:\n✓ I will/shall visit my grandmother.\n✓ He will come tomorrow.\n✓ They will write the exam next month.\n\nNEGATIVE FORM:\nSubject + will not (won\'t) + base verb\n✓ I will not go. / I won\'t go.\n✓ She will not come. / She won\'t come.\n\nQUESTION FORM:\nWill + subject + base verb?\n✓ Will you help me?\n✓ Will she attend the meeting?\n\nCOMMON TIME EXPRESSIONS:\ntomorrow, next week/month/year, soon, later, in the future, in two days\n\nOTHER FUTURE FORMS (Preview):\n• BE GOING TO: I am going to travel tomorrow. (planned future)\n• PRESENT CONTINUOUS: I am traveling tomorrow. (arranged future)\nThese will be covered in advanced tenses lessons.' 
                  },
                  { 
                    title: 'Forming Negative Sentences', 
                    content: 'SIMPLE PRESENT:\nUse "do not" (don\'t) or "does not" (doesn\'t) + base verb\n✓ I do not like pizza. / I don\'t like pizza.\n✓ She does not play tennis. / She doesn\'t play tennis.\n\nSIMPLE PAST:\nUse "did not" (didn\'t) + base verb\n✓ I did not go. / I didn\'t go.\n✓ He did not eat. / He didn\'t eat.\n\nSIMPLE FUTURE:\nUse "will not" (won\'t) + base verb\n✓ I will not come. / I won\'t come.\n✓ They will not attend. / They won\'t attend.' 
                  },
                  { 
                    title: 'Forming Questions', 
                    content: 'SIMPLE PRESENT:\nDo/Does + subject + base verb?\n✓ Do you study English?\n✓ Does she live here?\n\nSIMPLE PAST:\nDid + subject + base verb?\n✓ Did you go to school?\n✓ Did he finish his homework?\n\nSIMPLE FUTURE:\nWill + subject + base verb?\n✓ Will you come tomorrow?\n✓ Will they write the exam?' 
                  },
                  { 
                    title: 'Common Errors to Avoid', 
                    content: '❌ He go to school. (Wrong - missing -s)\n✓ He goes to school.\n\n❌ She goed to town. (Wrong - "go" is irregular)\n✓ She went to town.\n\n❌ I will goes tomorrow. (Wrong - base verb after "will")\n✓ I will go tomorrow.\n\n❌ They doesn\'t know. (Wrong - use "don\'t" with plural)\n✓ They don\'t know.\n\n❌ Did you went? (Wrong - use base verb after "did")\n✓ Did you go?\n\n❌ Yesterday, I go to market. (Wrong tense)\n✓ Yesterday, I went to market.' 
                  },
                ],
                activities: { 
                  type: 'exercises', 
                  questions: [
                    { 
                      type: 'identification', 
                      question: 'EXERCISE 1: Identify the Tense\n\nIdentify whether each sentence is in Simple Present, Simple Past, or Simple Future tense:\n\n1. She reads books every evening.\n2. They will travel to Cape Coast tomorrow.\n3. I met my friend at the market yesterday.\n4. The earth revolves around the sun.\n5. We visited the zoo last Saturday.\n6. He will celebrate his birthday next week.\n7. My mother cooks jollof rice on Sundays.\n8. Did you complete your homework?\n9. The students will write the exam next month.\n10. She bought a new dress.' 
                    },
                    { 
                      type: 'fill_in_the_blank', 
                      question: 'EXERCISE 2: Fill in the Correct Verb Form\n\nComplete each sentence with the correct form of the verb in brackets:\n\n1. She _______ (go) to church every Sunday.\n2. I _______ (visit) my grandmother last holiday.\n3. They _______ (write) the test next week.\n4. He _______ (play) football yesterday.\n5. We _______ (study) Mathematics now.\n6. The teacher _______ (teach) us grammar every day.\n7. My father _______ (travel) to Accra tomorrow.\n8. The children _______ (watch) television last night.\n9. I _______ (help) you with your homework later.\n10. She _______ (cook) rice yesterday evening.' 
                    },
                    { 
                      type: 'conversion', 
                      question: 'EXERCISE 3: Convert the Tenses\n\nChange each sentence to the tense indicated in brackets:\n\n1. I eat rice. (Simple Past)\n2. She went to school. (Simple Present)\n3. They will play football. (Simple Past)\n4. He studies every day. (Simple Future)\n5. We visited the museum. (Simple Future)\n6. The boy runs fast. (Simple Past)\n7. I will buy a book. (Simple Present)\n8. She writes a letter. (Simple Past)\n9. They played volleyball. (Simple Future)\n10. He will come tomorrow. (Simple Past)' 
                    },
                    { 
                      type: 'negative_and_question', 
                      question: 'EXERCISE 4: Form Negatives and Questions\n\nFor each sentence, write:\n(a) The negative form\n(b) The question form\n\n1. She likes ice cream.\n2. He went to the party.\n3. They will attend the meeting.\n4. I study French.\n5. We played football yesterday.' 
                    },
                    { 
                      type: 'error_correction', 
                      question: 'EXERCISE 5: Correct the Errors\n\nEach sentence has one error. Rewrite the sentence correctly:\n\n1. She go to school every day.\n2. I will went to town tomorrow.\n3. They plays football yesterday.\n4. He don\'t like vegetables.\n5. Did you saw the movie?\n6. We goes to church on Sundays.\n7. She will studying later.\n8. Yesterday, I eat jollof rice.\n9. Does they know the answer?\n10. He didn\'t came to school.' 
                    },
                    { 
                      type: 'time_expressions', 
                      question: 'EXERCISE 6: Match Time Expressions\n\nMatch each time expression with the correct tense:\n\nTime Expressions: yesterday, every day, tomorrow, last week, soon, always, next month, ago, often, will\n\nSimple Present: _______\nSimple Past: _______\nSimple Future: _______' 
                    },
                    { 
                      type: 'composition', 
                      question: 'EXERCISE 7: Write Sentences\n\nWrite THREE sentences using each tense:\n\n1. Three sentences in Simple Present\n2. Three sentences in Simple Past\n3. Three sentences in Simple Future\n\nMake sure your sentences are about your daily life, school, or family.' 
                    },
                  ],
                },
                pastQuestions: [
                  {
                    question: 'BECE 2018: Fill in the blank with the correct form of the verb in brackets:\n"My sister _______ (go) to the market every Saturday."\n\n(A) go\n(B) goes\n(C) gone\n(D) going',
                    solution: 'Correct Answer: (B) goes\n\nExplanation: The sentence uses "every Saturday," which indicates a habitual action in the Simple Present Tense. The subject "my sister" is third person singular (she), so we add -s to the base verb "go." Therefore, "goes" is correct.'
                  },
                  {
                    question: 'BECE 2019: Choose the sentence written in the Simple Past Tense:\n\n(A) He will travel to Kumasi tomorrow.\n(B) She eats breakfast every morning.\n(C) They played football yesterday.\n(D) I am reading a book now.',
                    solution: 'Correct Answer: (C) They played football yesterday.\n\nExplanation:\n(A) "will travel" is Simple Future\n(B) "eats" is Simple Present\n(C) "played" is Simple Past - shows completed action with "yesterday"\n(D) "am reading" is Present Continuous\n\nOption C is the only sentence in Simple Past Tense.'
                  },
                  {
                    question: 'BECE 2020: Rewrite this sentence in the Simple Future Tense:\n"I wrote a letter to my friend."',
                    solution: 'Correct Answer: I will write a letter to my friend.\n\nExplanation: To convert from Simple Past ("wrote") to Simple Future, use "will" + base form of the verb ("write"). The rest of the sentence remains the same.'
                  },
                  {
                    question: 'BECE 2017: Which of the following sentences is CORRECT?\n\n(A) She don\'t like mangoes.\n(B) He didn\'t went to school.\n(C) They will comes tomorrow.\n(D) I study Mathematics every day.',
                    solution: 'Correct Answer: (D) I study Mathematics every day.\n\nExplanation:\n(A) Wrong - should be "doesn\'t" (She doesn\'t like mangoes)\n(B) Wrong - should be "didn\'t go" (He didn\'t go to school)\n(C) Wrong - should be "will come" (They will come tomorrow)\n(D) Correct - proper Simple Present form with first person "I"'
                  },
                  {
                    question: 'BECE 2021: Fill in the blank:\n"We _______ (visit) our grandparents last Christmas."\n\n(A) visit\n(B) visits\n(C) visited\n(D) will visit',
                    solution: 'Correct Answer: (C) visited\n\nExplanation: "Last Christmas" indicates past time, so we need Simple Past Tense. The past form of "visit" is "visited" (regular verb - add -ed).'
                  },
                  {
                    question: 'BECE 2016: Change this sentence to a question:\n"She will attend the party tomorrow."',
                    solution: 'Correct Answer: Will she attend the party tomorrow?\n\nExplanation: To form a question in Simple Future Tense, move "will" to the beginning, followed by the subject "she," then the base verb "attend." Don\'t forget the question mark.'
                  },
                  {
                    question: 'BECE 2022: Identify the sentence with an error:\n\n(A) My father works in a hospital.\n(B) I will helped you tomorrow.\n(C) They came to school early.\n(D) She studies hard for her exams.',
                    solution: 'Correct Answer: (B) I will helped you tomorrow.\n\nExplanation: This sentence has an error. After "will," we must use the BASE FORM of the verb, not the past form. The correct sentence should be: "I will help you tomorrow."'
                  },
                  {
                    question: 'BECE 2019: Complete the sentence with the correct verb:\n"The sun _______ in the east."\n\n(A) rise\n(B) rises\n(C) rose\n(D) will rise',
                    solution: 'Correct Answer: (B) rises\n\nExplanation: This sentence states a general truth or fact, which requires the Simple Present Tense. The subject "sun" is third person singular (it), so we add -s to "rise," making it "rises."'
                  },
                  {
                    question: 'BECE 2020: Which time expression is used with Simple Past Tense?\n\n(A) tomorrow\n(B) every day\n(C) yesterday\n(D) soon',
                    solution: 'Correct Answer: (C) yesterday\n\nExplanation:\n(A) "tomorrow" - used with Simple Future\n(B) "every day" - used with Simple Present\n(C) "yesterday" - used with Simple Past ✓\n(D) "soon" - used with Simple Future'
                  },
                  {
                    question: 'BECE 2018: Form the negative of this sentence:\n"He goes to the gym regularly."',
                    solution: 'Correct Answer: He does not go to the gym regularly. (or He doesn\'t go to the gym regularly.)\n\nExplanation: To make a Simple Present sentence negative with third person singular (he), use "does not" (doesn\'t) + base verb. Change "goes" back to "go."'
                  },
                  {
                    question: 'BECE 2017: Fill in the blank with the correct irregular past form:\n"They _______ (bring) gifts to the party."\n\n(A) bringed\n(B) brought\n(C) brang\n(D) brung',
                    solution: 'Correct Answer: (B) brought\n\nExplanation: "Bring" is an irregular verb. Its past form is "brought" (NOT "bringed"). Memorize irregular verb forms to avoid errors.'
                  },
                  {
                    question: 'BECE 2021: Convert to Simple Present:\n"I will eat rice for dinner."',
                    solution: 'Correct Answer: I eat rice for dinner.\n\nExplanation: Remove "will" and use the base form "eat." Since the subject is "I" (first person), no -s is added.'
                  },
                  {
                    question: 'BECE 2016: Choose the sentence in Simple Future Tense:\n\n(A) We are playing football now.\n(B) She played the piano yesterday.\n(C) They will write the exam next week.\n(D) He studies every evening.',
                    solution: 'Correct Answer: (C) They will write the exam next week.\n\nExplanation:\n(A) Present Continuous\n(B) Simple Past\n(C) Simple Future ✓ (will + base verb)\n(D) Simple Present'
                  },
                  {
                    question: 'BECE 2022: Correct the error in this sentence:\n"Does she went to school yesterday?"',
                    solution: 'Correct Answer: Did she go to school yesterday?\n\nExplanation: Two errors here:\n1. Use "Did" (not "Does") for Simple Past questions\n2. Use base verb "go" (not "went") after "Did"\n\nRule: Did + subject + base verb + ?'
                  },
                  {
                    question: 'BECE 2023: Read the passage and answer:\n\n"Kwame wakes up at 5 a.m. every morning. Yesterday, he woke up late and missed the bus. Tomorrow, he will set his alarm earlier."\n\nIdentify the tenses used for:\n(a) "wakes up"\n(b) "woke up"\n(c) "will set"',
                    solution: 'Correct Answers:\n(a) "wakes up" - Simple Present Tense (habitual action with "every morning")\n(b) "woke up" - Simple Past Tense (completed action with "yesterday")\n(c) "will set" - Simple Future Tense (future action with "tomorrow")\n\nExplanation: This passage demonstrates all three simple tenses with appropriate time expressions.'
                  },
                ],
                endOfLessonQuiz: [
                  {
                    id: 'tenses1-q1',
                    type: 'mcq',
                    question: 'Which tense is used for actions happening regularly or habitually?',
                    options: ['Simple Past', 'Simple Present', 'Simple Future', 'Present Perfect'],
                    answer: 'Simple Present',
                    explanation: 'Simple Present Tense is used for habits, repeated actions, and general truths. Example: "I study English every day."'
                  },
                  {
                    id: 'tenses1-q2',
                    type: 'mcq',
                    question: 'Choose the correct form: "She _______ to school every day."',
                    options: ['go', 'goes', 'went', 'will go'],
                    answer: 'goes',
                    explanation: 'With third person singular (she), add -s to the base verb in Simple Present. "Go" becomes "goes."'
                  },
                  {
                    id: 'tenses1-q3',
                    type: 'mcq',
                    question: 'What is the past form of the irregular verb "buy"?',
                    options: ['buyed', 'bought', 'buying', 'buys'],
                    answer: 'bought',
                    explanation: '"Buy" is irregular. Its past form is "bought," not "buyed."'
                  },
                  {
                    id: 'tenses1-q4',
                    type: 'mcq',
                    question: 'Which sentence is in Simple Future Tense?',
                    options: [
                      'I am eating rice.',
                      'I eat rice every day.',
                      'I will eat rice tomorrow.',
                      'I ate rice yesterday.'
                    ],
                    answer: 'I will eat rice tomorrow.',
                    explanation: 'Simple Future uses "will" or "shall" + base verb. "I will eat rice tomorrow" shows future action.'
                  },
                  {
                    id: 'tenses1-q5',
                    type: 'mcq',
                    question: 'Identify the tense: "They visited the museum last week."',
                    options: ['Simple Present', 'Simple Past', 'Simple Future', 'Present Continuous'],
                    answer: 'Simple Past',
                    explanation: '"Visited" is the past form, and "last week" indicates past time. This is Simple Past Tense.'
                  },
                  {
                    id: 'tenses1-q6',
                    type: 'mcq',
                    question: 'Form the negative: "He plays football." becomes "_______"',
                    options: [
                      'He don\'t play football.',
                      'He doesn\'t plays football.',
                      'He doesn\'t play football.',
                      'He not play football.'
                    ],
                    answer: 'He doesn\'t play football.',
                    explanation: 'Use "doesn\'t" with third person singular, followed by the BASE VERB "play" (remove -s).'
                  },
                  {
                    id: 'tenses1-q7',
                    type: 'mcq',
                    question: 'Which time expression is used with Simple Past?',
                    options: ['tomorrow', 'yesterday', 'every day', 'always'],
                    answer: 'yesterday',
                    explanation: '"Yesterday" indicates past time and is used with Simple Past Tense.'
                  },
                  {
                    id: 'tenses1-q8',
                    type: 'mcq',
                    question: 'Convert to Simple Present: "I will go to town."',
                    options: ['I go to town.', 'I goes to town.', 'I went to town.', 'I going to town.'],
                    answer: 'I go to town.',
                    explanation: 'Remove "will" and use the base form. With "I," no -s is added.'
                  },
                  {
                    id: 'tenses1-q9',
                    type: 'mcq',
                    question: 'Which sentence has an ERROR?',
                    options: [
                      'She studied hard yesterday.',
                      'They will comes tomorrow.',
                      'I eat breakfast every morning.',
                      'He went to the market.'
                    ],
                    answer: 'They will comes tomorrow.',
                    explanation: 'After "will," use the BASE FORM. It should be "They will come tomorrow."'
                  },
                  {
                    id: 'tenses1-q10',
                    type: 'mcq',
                    question: 'Form a question: "You like pizza." becomes "_______"',
                    options: ['You like pizza?', 'Do you like pizza?', 'Does you like pizza?', 'Like you pizza?'],
                    answer: 'Do you like pizza?',
                    explanation: 'Use "Do" with you/we/they + base verb to form Simple Present questions.'
                  },
                  {
                    id: 'tenses1-q11',
                    type: 'truefalse',
                    statement: 'In Simple Present, we add -s or -es to verbs with he, she, or it.',
                    answer: 'true',
                    reason: 'TRUE. Third person singular subjects (he, she, it) require -s or -es in Simple Present. Example: "He plays," "She watches."'
                  },
                  {
                    id: 'tenses1-q12',
                    type: 'truefalse',
                    statement: 'The past form of "go" is "goed."',
                    answer: 'false',
                    reason: 'FALSE. "Go" is an irregular verb. Its past form is "went," not "goed."'
                  },
                  {
                    id: 'tenses1-q13',
                    type: 'fillblank',
                    sentence: 'The sun _______ (rise) in the east.',
                    answer: 'rises',
                    explanation: 'This is a general truth, so use Simple Present. The subject "sun" is third person singular (it), so add -s: "rises."'
                  },
                  {
                    id: 'tenses1-q14',
                    type: 'multiple_select',
                    question: 'Which of the following are irregular past verbs? (Select all that apply)',
                    options: ['wrote', 'played', 'bought', 'walked', 'taught', 'talked'],
                    correctAnswers: ['wrote', 'bought', 'taught'],
                    explanation: 'Irregular verbs: write→wrote, buy→bought, teach→taught. Regular verbs: play→played, walk→walked, talk→talked.'
                  },
                  {
                    id: 'tenses1-q15',
                    type: 'multiple_select',
                    question: 'Which time expressions are used with Simple Future? (Select all that apply)',
                    options: ['tomorrow', 'yesterday', 'next week', 'last year', 'soon', 'ago'],
                    correctAnswers: ['tomorrow', 'next week', 'soon'],
                    explanation: 'Simple Future time expressions: tomorrow, next week/month/year, soon, later. Past expressions: yesterday, last week, ago.'
                  },
                  {
                    id: 'tenses1-q16',
                    type: 'matching',
                    question: 'Match each sentence with its tense:',
                    pairs: [
                      { left: 'I study every day.', right: 'Simple Present' },
                      { left: 'She visited Accra.', right: 'Simple Past' },
                      { left: 'They will come tomorrow.', right: 'Simple Future' },
                      { left: 'He goes to church on Sundays.', right: 'Simple Present' },
                    ],
                    explanation: 'Simple Present: habits/general truths. Simple Past: completed actions. Simple Future: future actions with "will."'
                  },
                  {
                    id: 'tenses1-q17',
                    type: 'shortanswer',
                    question: 'Write three sentences about your day: one in Simple Present, one in Simple Past, and one in Simple Future.',
                    answer: 'Sample answers:\nSimple Present: I wake up at 6 a.m. every day.\nSimple Past: I ate jollof rice for lunch yesterday.\nSimple Future: I will study Mathematics tonight.',
                    explanation: 'Your sentences should correctly demonstrate all three tenses with appropriate time expressions and verb forms.'
                  },
                ],
                summary: 'Tenses are verb forms that show WHEN an action happens. In this comprehensive lesson, you mastered the three simple tenses that form the foundation of English grammar: SIMPLE PRESENT TENSE for habits, general truths, and repeated actions (remember to add -s/-es with he/she/it); SIMPLE PAST TENSE for completed actions in the past (use -ed for regular verbs like "played," but memorize irregular forms like "went," "ate," "bought"); and SIMPLE FUTURE TENSE for actions that will happen later (use "will" + base verb for all subjects). You learned critical rules: in Simple Present, third person singular requires -s/-es (she goes, he watches); in Simple Past, use "did not" + base verb for negatives (didn\'t go, not didn\'t went); in Simple Future, always use the base form after "will" (will come, not will comes). Common errors to avoid include mixing tenses incorrectly, forgetting -s with he/she/it, using wrong irregular forms, and adding -s after "will." Time expressions are your clues: "every day, always, usually" signal Present; "yesterday, last week, ago" signal Past; "tomorrow, next week, soon" signal Future. With 15 BECE-style past questions and 7 comprehensive exercises covering identification, conversion, negatives, questions, and error correction, you are now fully equipped to handle any tense question in your WAEC BECE examination. Master these three simple tenses, and you will have a solid foundation for learning more advanced tenses like Present Perfect, Past Continuous, and Future Perfect in JHS 2.',
              },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
           {
            id: 'eng201',
            slug: 'grammar-usage-2',
            title: 'Grammar & Usage',
            lessons: [
                { 
                  id: 'eng201-1', 
                  slug: 'advanced-tenses', 
                  title: 'Tenses (Perfect, Progressive)', 
                  objectives: [
                    'Define and differentiate between perfect and progressive (continuous) tenses.',
                    'Construct sentences using the present perfect and present perfect progressive tenses correctly.',
                    'Formulate sentences using the past perfect and past perfect progressive tenses to show sequence of past events.',
                    'Construct sentences using the future perfect and future perfect progressive tenses to describe future actions.',
                    'Identify the correct tense usage in various contexts, including formal and informal communication.',
                    'Apply knowledge of perfect and progressive tenses to improve clarity and precision in writing.',
                    'Analyze and correct errors in tense usage in given sentences and paragraphs.',
                    'Use a variety of tenses, including perfect and progressive forms, in BECE-style composition writing.',
                    'Differentiate between stative and dynamic verbs and their use with progressive tenses.'
                  ],
                  introduction: 'Mastering verb tenses is crucial for expressing ideas with precision and clarity. While basic tenses (simple present, past, future) help us locate events in time, perfect and progressive tenses allow us to describe complex relationships between actions and their duration. In Ghanaian society, effective communication in English is vital for academic success, professional advancement, and social interaction. Whether you are narrating a story, writing a report for school, or explaining a sequence of events in a BECE English essay, using advanced tenses correctly makes your communication more sophisticated and your meaning clearer.\n\nMany JHS students in Ghana struggle with perfect and progressive tenses. A common error is confusing the simple past with the present perfect (e.g., saying "I ate yesterday" vs. "I have eaten today"). Another challenge is knowing when to use the progressive form. For instance, students might incorrectly say "I am knowing the answer" instead of "I know the answer," because they haven\'t learned about stative verbs which do not typically take the progressive form. These errors can lead to confusion and may negatively impact your grades in examinations where grammatical accuracy is essential.\n\nThis lesson will demystify the perfect and progressive tenses. We will explore the six key advanced tenses: present perfect, past perfect, future perfect, and their progressive counterparts. You will learn the specific formula for each tense—combining auxiliary verbs like \'have\', \'has\', \'had\', and the correct verb participles. Through Ghana-specific examples, such as "The Black Stars have won the match" (present perfect) or "By 2025, the new road will have been completed" (future perfect), you will see how these tenses function in real-world contexts. We will also cover the important distinction between actions completed at an unspecified time (perfect tenses) and actions that are ongoing (progressive tenses). By the end of this lesson, you will be able to use these tenses confidently to express complex ideas about time, duration, and the sequence of events, significantly improving your writing and speaking skills.',
                  keyConcepts: [
                    {
                      title: 'Introduction to Perfect Tenses',
                      content: 'Perfect tenses are used to describe actions that have a relationship to another point in time. They indicate that an action was completed before another moment. They are formed using the auxiliary verb "to have" (have, has, had) followed by the past participle of the main verb.\n\n- **Present Perfect (have/has + past participle):** Connects a past action to the present. Used for actions that happened at an unspecified time in the past or actions that started in the past and continue to the present. Example: "I have visited the Cape Coast Castle." (The experience is part of my life now).\n\n- **Past Perfect (had + past participle):** Describes a past action that was completed before another past action. It clarifies the sequence of events. Example: "By the time the teacher arrived, the students had already finished the test." (Finishing the test happened before the teacher arrived).\n\n- **Future Perfect (will have + past participle):** Indicates an action that will be completed before a specific time in the future. Example: "By next year, she will have graduated from JHS."'
                    },
                    {
                      title: 'Introduction to Progressive (Continuous) Tenses',
                      content: 'Progressive tenses describe actions that are, were, or will be ongoing or in progress at a certain point in time. They emphasize the duration of an action. They are formed using the auxiliary verb "to be" (am, is, are, was, were, will be) followed by the present participle of the main verb (the -ing form).\n\n- **Present Progressive (am/is/are + -ing):** An action happening right now. Example: "The students are learning about tenses."\n\n- **Past Progressive (was/were + -ing):** An action that was in progress at a specific time in the past. Example: "I was watching the news when the lights went out."\n\n- **Future Progressive (will be + -ing):** An action that will be in progress at a specific time in the future. Example: "This time tomorrow, we will be writing our English exam."'
                    },
                    {
                      title: 'The Present Perfect Progressive Tense',
                      content: 'This tense describes an action that started in the past, has been continuing up to the present, and may still be ongoing. It emphasizes the duration of the action.\n\n**Form:** `have/has + been + present participle (-ing)`\n\n**Usage:**\n1.  **Duration of a past action up to now:** To show how long an action has been happening. Signal words: "for," "since."\n    - Example: "She has been studying English for three years."\n    - Example: "They have been waiting for the bus since 4 PM."\n2.  **Recent action with present results:** To describe an action that has just finished but has results in the present.\n    - Example: "Why are you so tired?" "I have been jogging." (The jogging is over, but the tiredness is present).'
                    },
                    {
                      title: 'The Past Perfect Progressive Tense',
                      content: 'This tense is used to describe a continuous action in the past that was in progress before another past action occurred. It highlights the duration of the first past action.\n\n**Form:** `had + been + present participle (-ing)`\n\n**Usage:**\n1.  **Duration before another past event:** To show how long an action was happening before something else happened in the past.\n    - Example: "He had been working at the bank for five years before he decided to start his own business."\n2.  **Cause of a past action:** To show the cause of a past state or action.\n    - Example: "The ground was wet because it had been raining all night."'
                    },
                    {
                      title: 'The Future Perfect Progressive Tense',
                      content: 'This tense describes a continuous action that will be in progress for a period of time before a specific moment in the future. It is used to project ourselves forward in time and look back at the duration of an activity.\n\n**Form:** `will have + been + present participle (-ing)`\n\n**Usage:**\n1.  **Duration of an action up to a future point:** To show how long an action will have been happening by a certain time in the future.\n    - Example: "By December, I will have been living in Accra for ten years."\n2.  **Cause of a future state:** To explain the cause of a future situation.\n    - Example: "When you arrive, we will be tired because we will have been studying for hours."'
                    },
                    {
                      title: 'Stative vs. Dynamic Verbs',
                      content: 'Understanding the difference between stative and dynamic verbs is key to using progressive tenses correctly.\n\n- **Dynamic Verbs:** Describe actions or processes. These verbs can be used in all tenses, including progressive forms. Examples: `run`, `eat`, `study`, `write`, `play`.\n    - Correct: "He is running a race."\n\n- **Stative Verbs:** Describe a state, condition, or feeling rather than an action. They are generally **not** used in progressive tenses. \n    - **Possession:** `have`, `own`, `belong`\n    - **Senses:** `see`, `hear`, `smell`, `taste`\n    - **Emotion:** `love`, `hate`, `prefer`, `want`\n    - **Mental State:** `know`, `believe`, `understand`, `remember`\n\n    - **Incorrect:** "I am knowing the answer."\n    - **Correct:** "I know the answer."\n    - **Incorrect:** "She is wanting a new phone."\n    - **Correct:** "She wants a new phone."'
                    },
                    {
                        title: 'Signal Words for Perfect and Progressive Tenses',
                        content: 'Certain words and phrases often signal the use of specific tenses. Recognizing them can help you choose the correct tense.\n\n- **Present Perfect:** `for`, `since`, `already`, `yet`, `just`, `ever`, `never`, `recently`.\n  - Example: "Have you ever been to Kumasi?"\n\n- **Past Perfect:** `before`, `after`, `by the time`, `already`, `until`.\n  - Example: "The movie had already started by the time we arrived."\n\n- **Future Perfect:** `by...`, `by the time`, `in...time`.\n  - Example: "In two years\' time, I will have completed my JHS education."\n\n- **Present Perfect Progressive:** `for`, `since`, `all day`, `the whole week`.\n  - Example: "He has been playing football all day."\n\n- **Past Perfect Progressive:** `for`, `since`, `before`, `when`.\n  - Example: "She had been waiting for two hours when the bus finally came."'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'fill_in_the_blanks',
                            question: 'Complete the sentences with the correct form of the verb in brackets (Present Perfect or Present Perfect Progressive).\n1. She _______________ (work) here for five years.\n2. I _______________ (just/finish) my homework.\n3. They _______________ (play) football since morning; that\'s why they are tired.\n4. We _______________ (not see) that movie yet.\n5. How long _______________ (you/wait) for the bus?',
                            solution: '1. has been working\n2. have just finished\n3. have been playing\n4. have not seen\n5. have you been waiting'
                        },
                        {
                            type: 'sentence_correction',
                            question: 'Find and correct the errors in the following sentences.\n1. I am knowing the answer to this question.\n2. They have went to the market already.\n3. She was reading a book when the phone was ringing.\n4. By the time I arrived, he already left.\n5. He is having a new bicycle.',
                            solution: '1. I know the answer to this question. (Stative verb error)\n2. They have gone to the market already. (Incorrect past participle)\n3. She was reading a book when the phone rang. (Incorrect tense sequence)\n4. By the time I arrived, he had already left. (Past perfect needed)\n5. He has a new bicycle. (Stative verb error)'
                        },
                        {
                            type: 'sentence_transformation',
                            question: 'Rewrite the following sentences using the tense indicated in brackets.\n1. I finished my work. (Present Perfect)\n2. The rain started before our match began. (Past Perfect)\n3. They are building a new school. (Future Perfect - "By next year...")\n4. She waited for two hours. (Present Perfect Progressive)\n5. He was driving for hours before he reached the village. (Past Perfect Progressive)',
                            solution: '1. I have finished my work.\n2. The rain had started before our match began.\n3. By next year, they will have built a new school.\n4. She has been waiting for two hours.\n5. He had been driving for hours before he reached the village.'
                        },
                        {
                            type: 'contextual_tense_choice',
                            question: 'Choose the correct tense to complete the story.\n\nYesterday, I decided to visit my grandmother. When I arrived at her house, she was not there. My uncle told me she (go / had gone) to the market. I was disappointed because I (look / had been looking) forward to seeing her all week. I decided to wait. While I was waiting, I noticed how much the garden (change / had changed) since my last visit. My grandmother (plant / had been planting) new flowers, and they were beautiful.',
                            solution: '...she had gone to the market. I was disappointed because I had been looking forward to seeing her all week. ...how much the garden had changed since my last visit. My grandmother had been planting new flowers...'
                        },
                        {
                            type: 'creative_writing_prompt',
                            question: 'Write a short paragraph (4-5 sentences) describing what you will have accomplished by the end of this school year. Use the Future Perfect and Future Perfect Progressive tenses at least once each.',
                            solution: 'By the end of this school year, I will have completed all my JHS 2 courses. I will have learned many new things in subjects like Integrated Science and Social Studies. For months, I will have been preparing for the final examinations, so I hope to pass with good grades. I will also have participated in the school\'s debate club for a full year.'
                        },
                        {
                            type: 'stative_dynamic_verb_sort',
                            question: 'Categorize the following verbs as either Stative or Dynamic: `run`, `believe`, `own`, `eat`, `see`, `write`, `love`, `remember`, `play`, `smell`.',
                            solution: 'Stative: believe, own, see, love, remember, smell (in the sense of having a scent). \nDynamic: run, eat, write, play, smell (in the sense of the action of sniffing).'
                        },
                        {
                            type: 'dialogue_completion',
                            question: 'Complete the dialogue with the correct perfect or progressive tense.\n\nKofi: Hi Ama! I haven\'t seen you for ages! What (you/do) lately?\nAma: Hi Kofi! I (be) really busy. I (prepare) for my BECE for the last few months.\nKofi: Wow! By the time you finish, you (study) for almost a year!\nAma: I know! I hope it pays off. What about you?\nKofi: I (just/get) a new job at the library.',
                            solution: 'Kofi: ...What have you been doing lately?\nAma: ...I have been really busy. I have been preparing for my BECE for the last few months.\nKofi: ...you will have been studying for almost a year!\nAma: ...I have just gotten a new job at the library.'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'Choose from the alternatives A to D the one which is nearest in meaning to the underlined word in the sentence: The students have been studying since morning.',
                        options: ['A. will study', 'B. were studying', 'C. started studying and are still studying', 'D. studied and stopped'],
                        solution: 'C. started studying and are still studying'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: By the time the police arrived, the thieves _______.',
                        options: ['A. escaped', 'B. have escaped', 'C. had escaped', 'D. were escaping'],
                        solution: 'C. had escaped'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes thesentence: My father _______ in this company for ten years by next month.',
                        options: ['A. will work', 'B. will be working', 'C. will have been working', 'D. has worked'],
                        solution: 'C. will have been working'
                    },
                    {
                        question: 'Choose the correct sentence from the following alternatives.',
                        options: ['A. I am not hearing you well.', 'B. I do not hear you well.', 'C. I have not been hearing you well.', 'D. I was not hearing you well.'],
                        solution: 'B. I do not hear you well.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: She was tired because she _______ all day.',
                        options: ['A. has been working', 'B. had been working', 'C. was working', 'D. is working'],
                        solution: 'B. had been working'
                    },
                    {
                        question: 'Which of the following sentences is in the Present Perfect Tense?',
                        options: ['A. I am writing a letter.', 'B. I have written a letter.', 'C. I had written a letter.', 'D. I will write a letter.'],
                        solution: 'B. I have written a letter.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: We _______ for the bus for an hour before it finally arrived.',
                        options: ['A. waited', 'B. were waiting', 'C. have been waiting', 'D. had been waiting'],
                        solution: 'D. had been waiting'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: "I can\'t find my keys." "Don\'t worry, I _______ them."',
                        options: ['A. have just seen', 'B. just saw', 'C. had just seen', 'D. am just seeing'],
                        solution: 'A. have just seen'
                    },
                    {
                        question: 'Choose the correct sentence from the following alternatives.',
                        options: ['A. He is owning three cars.', 'B. He owns three cars.', 'C. He has been owning three cars.', 'D. He owned three cars last year.'],
                        solution: 'B. He owns three cars.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: By 2030, Ghana _______ significant progress in renewable energy.',
                        options: ['A. will make', 'B. will be making', 'C. will have made', 'D. has made'],
                        solution: 'C. will have made'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: The students were quiet because they _______ their assignment.',
                        options: ['A. finished', 'B. have finished', 'C. had finished', 'D. were finishing'],
                        solution: 'C. had finished'
                    },
                    {
                        question: 'Choose from the alternatives A to D the one which is nearest in meaning to the underlined word in the sentence: I was watching television when the lights went out.',
                        options: ['A. I watched television and then the lights went out.', 'B. The lights went out and then I watched television.', 'C. I was in the middle of watching television when the lights went out.', 'D. I had finished watching television when the lights went out.'],
                        solution: 'C. I was in the middle of watching television when the lights went out.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: He _______ ill for a week and cannot go to school.',
                        options: ['A. was', 'B. has been', 'C. had been', 'D. is being'],
                        solution: 'B. has been'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: This time next week, we _______ our BECE.',
                        options: ['A. will write', 'B. will be writing', 'C. will have written', 'D. have written'],
                        solution: 'B. will be writing'
                    },
                    {
                        question: 'Identify the error in the sentence: "She has been knowing him since they were children."',
                        options: ['A. has been', 'B. knowing', 'C. since', 'D. No error'],
                        solution: 'B. knowing'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'Which tense is used to describe an action completed before another past action?',
                        options: ['Present Perfect', 'Past Perfect', 'Future Perfect', 'Simple Past'],
                        answer: 'Past Perfect',
                        explanation: 'The Past Perfect tense (had + past participle) is used to clarify that one past event happened before another past event.'
                    },
                    {
                        type: 'mcq',
                        question: 'The sentence "They have been playing since morning" is in which tense?',
                        options: ['Present Progressive', 'Present Perfect', 'Past Perfect Progressive', 'Present Perfect Progressive'],
                        answer: 'Present Perfect Progressive',
                        explanation: 'This tense (have/has + been + -ing) is used to show an action that started in the past and has continued up to the present moment.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which of the following is a stative verb?',
                        options: ['run', 'eat', 'believe', 'talk'],
                        answer: 'believe',
                        explanation: 'Stative verbs describe states or conditions (like believing), not actions, and are generally not used in progressive tenses.'
                    },
                    {
                        type: 'mcq',
                        question: 'Choose the grammatically correct sentence.',
                        options: ['I am wanting a new book.', 'She is having a headache.', 'He knows the way to the stadium.', 'They are seeing the bird in the tree.'],
                        answer: 'He knows the way to the stadium.',
                        explanation: '`Know` is a stative verb and is correctly used in the simple present. `Want`, `have` (for possession), and `see` are also stative and should not be in the progressive form here.'
                    },
                    {
                        type: 'mcq',
                        question: '`By next year, I will have finished my JHS education.` This sentence is in the...',
                        options: ['Future Progressive', 'Simple Future', 'Future Perfect', 'Future Perfect Progressive'],
                        answer: 'Future Perfect',
                        explanation: 'The Future Perfect tense (will have + past participle) describes an action that will be completed before a specific point in the future.'
                    },
                    {
                        type: 'mcq',
                        question: 'What is the correct form of the verb in this sentence: "She was tired because she _______ all night"?',
                        options: ['studied', 'has been studying', 'had been studying', 'was studying'],
                        answer: 'had been studying',
                        explanation: 'The Past Perfect Progressive is used to show the duration of a past action that caused a later past result (being tired).'
                    },
                    {
                        type: 'mcq',
                        question: 'Which tense describes an action that will be in progress at a specific time in the future?',
                        options: ['Future Perfect', 'Future Progressive', 'Simple Future', 'Present Progressive'],
                        answer: 'Future Progressive',
                        explanation: 'The Future Progressive (will be + -ing) is used for an ongoing action at a future point in time, like "This time tomorrow, I will be travelling."'
                    },
                    {
                        type: 'mcq',
                        question: 'The signal word `since` is commonly used with which tenses?',
                        options: ['Simple Past and Past Progressive', 'Present Perfect and Present Perfect Progressive', 'Future Perfect and Future Progressive', 'Simple Present and Present Progressive'],
                        answer: 'Present Perfect and Present Perfect Progressive',
                        explanation: '`Since` is used to indicate the starting point of an action that continues to the present, a key function of the present perfect tenses.'
                    },
                    {
                        type: 'mcq',
                        question: '`When I arrived, the party had already started.` Why is the past perfect tense used here?',
                        options: ['To show the party was in progress.', 'To show the party started at the exact moment I arrived.', 'To show the party started before I arrived.', 'To show the party would start later.'],
                        answer: 'To show the party started before I arrived.',
                        explanation: 'The past perfect clarifies the sequence of past events. The starting of the party happened before the arrival.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sentence is incorrect?',
                        options: ['He has been a teacher for ten years.', 'He has been teaching for ten years.', 'He is being a teacher for ten years.', 'He was a teacher for ten years.'],
                        answer: 'He is being a teacher for ten years.',
                        explanation: 'The verb `to be` when describing a state or profession is stative and cannot be used in the progressive form in this context.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'You can use the present progressive tense for actions that are planned for the near future.',
                        answer: 'true',
                        reason: 'The present progressive can be used for future arrangements, such as "I am meeting my friend tomorrow."'
                    },
                    {
                        type: 'truefalse',
                        statement: 'The past perfect tense is always required when you have two past actions in a sentence.',
                        answer: 'false',
                        reason: 'If the sequence of events is clear from context or conjunctions like `before` or `after`, the simple past can sometimes be used for both actions. However, the past perfect provides greater clarity.'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'The tense used to describe an ongoing action that was interrupted by another action in the past is the __________ tense.',
                        answer: 'Past Progressive',
                        explanation: 'For example, in "I was reading when the phone rang," the ongoing action of reading was interrupted by the phone ringing.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Which of the following sentences use a perfect tense correctly? (Select all that apply)',
                        options: [
                            'She has finished her meal.',
                            'They had left before I called.',
                            'By tomorrow, he will finish the project.',
                            'I have been to the museum last year.'
                        ],
                        correctAnswers: ['She has finished her meal.', 'They had left before I called.'],
                        explanation: '`She has finished her meal` (Present Perfect) and `They had left before I called` (Past Perfect) are correct. `By tomorrow, he will have finished...` is the correct Future Perfect. `I have been...` cannot be used with a specific past time marker like `last year`.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Which situations correctly describe a use for the Present Perfect tense? (Select all that apply)',
                        options: [
                            'An action that happened at a specific time in the past (e.g., yesterday).',
                            'An action that started in the past and continues to the present.',
                            'A past action with a result in the present.',
                            'An action that was happening when another past action interrupted it.'
                        ],
                        correctAnswers: ['An action that started in the past and continues to the present.', 'A past action with a result in the present.'],
                        explanation: 'The Present Perfect connects the past to the present. It is used for continuing actions ("I have lived here for years") or past actions with present results ("I have lost my keys"). It is not used for specific past times, and the past progressive is used for interrupted actions.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the tense to its primary function.',
                        pairs: [
                            { left: 'Present Perfect', right: 'Connects a past action to the present' },
                            { left: 'Past Perfect', right: 'Shows an action completed before another past action' },
                            { left: 'Future Perfect', right: 'Indicates an action will be completed by a future time' },
                            { left: 'Present Perfect Progressive', right: 'Emphasizes the duration of an action from past to present' },
                        ],
                        explanation: 'Each perfect tense has a unique function related to how it connects different points in time. Understanding these functions is key to using them correctly.'
                    },
                    {
                        type: 'shortanswer',
                        question: 'Explain the difference between "I read the book" and "I have read the book."',
                        answer: '"I read the book" is in the simple past tense. It refers to a specific, completed action in the past (e.g., I read the book yesterday). "I have read the book" is in the present perfect tense. It refers to an action that happened at an unspecified time in the past, and the experience of reading it is still relevant now. It implies that the speaker has the knowledge or experience of that book.',
                        explanation: 'This question tests the core difference between the simple past (specific, finished past events) and the present perfect (unspecific past events with present relevance).'
                    },
                  ],
                  summary: 'This lesson covered the perfect and progressive (continuous) tenses, which are essential for expressing complex relationships in time. Perfect tenses (present, past, future) are formed with "have/has/had" + past participle and are used to connect actions to other points in time. Progressive tenses (present, past, future) are formed with "to be" + -ing and describe ongoing actions. The perfect progressive tenses combine both, emphasizing the duration of an action up to a certain point. A key rule is that stative verbs (verbs of state, thought, or feeling like `know`, `love`, `own`) are generally not used in progressive forms. By mastering these advanced tenses, you can communicate with greater precision, clarity, and sophistication in both your speech and writing, which is a critical skill for success in the BECE and beyond.'
                },
                { 
                  id: 'eng201-2', 
                  slug: 'sentence-structures', 
                  title: 'Sentence Types & Structures', 
                  objectives: [
                    'Define and differentiate between phrases and clauses (independent and dependent).',
                    'Identify and construct simple sentences, recognizing their basic subject-verb structure.',
                    'Identify and construct compound sentences using coordinating conjunctions and appropriate punctuation.',
                    'Identify and construct complex sentences using subordinating conjunctions to connect clauses.',
                    'Identify and construct compound-complex sentences, combining multiple independent and dependent clauses.',
                    'Analyze the structure of sentences to improve reading comprehension and interpretation.',
                    'Use a variety of sentence structures to create more engaging, sophisticated, and effective writing.',
                    'Identify and correct common sentence structure errors such as fragments, run-on sentences, and comma splices.',
                    'Apply knowledge of sentence types and structures to answer BECE questions and write effective compositions.'
                  ],
                  introduction: 'Just as a master builder uses different types of bricks and blocks to construct a strong and beautiful house, a skilled writer uses different types of sentences to build clear, engaging, and powerful texts. Writing with only one type of sentence, like using only simple sentences, can make your work sound childish and monotonous. To express complex ideas and capture your reader\'s interest, you must master the art of sentence structure. In Ghana, from writing formal letters and academic essays for the BECE to communicating effectively in the professional world, your ability to construct varied and grammatically correct sentences is a measure of your proficiency in English.\n\nMany JHS students find it challenging to move beyond simple sentences. They may write, "The boy kicked the ball. The ball flew into the net. The crowd cheered." While grammatically correct, this series of short, choppy sentences lacks flow and sophistication. Other students may try to write longer sentences but end up creating run-on sentences or comma splices—errors that confuse the reader and obscure meaning. For example, "The market was busy I wanted to buy some yams my mother was waiting for me." This is a run-on sentence that incorrectly joins three separate ideas.\n\nThis lesson provides a comprehensive guide to the building blocks of English sentences: phrases and clauses. You will learn to distinguish between an independent clause, which can stand alone as a complete thought, and a dependent clause, which cannot. Understanding this distinction is the key to mastering the four main sentence types: simple, compound, complex, and compound-complex. We will explore each type with clear definitions and Ghana-specific examples, such as "The Black Stars played well" (simple), "The Black Stars played well, but they did not win the match" (compound), and "Although the Black Stars played well, they did not win the match" (complex). By learning how to combine clauses correctly using conjunctions and punctuation, you will gain the power to express nuanced relationships between ideas and elevate the quality of your writing. This knowledge is directly applicable to the BECE, where examiners look for competence in sentence construction as a key indicator of language mastery.',
                  keyConcepts: [
                    {
                      title: 'The Building Blocks: Phrases and Clauses',
                      content: 'To understand sentence structure, you must first know the difference between phrases and clauses.\n\n- **Phrase:** A group of related words that does **not** contain both a subject and a verb. A phrase acts as a single part of speech (e.g., noun phrase, verb phrase, prepositional phrase). It cannot stand alone as a complete thought.\n  - Examples: "the tall boy" (noun phrase), "was running quickly" (verb phrase), "in the morning" (prepositional phrase).\n\n- **Clause:** A group of words that **does** contain a subject and a verb.\n  - **Independent Clause:** Expresses a complete thought and can stand alone as a sentence. Example: "The students passed the exam."\n  - **Dependent (or Subordinate) Clause:** Contains a subject and a verb but does not express a complete thought. It cannot stand alone as a sentence and must be attached to an independent clause. It often begins with a subordinating conjunction (e.g., `although`, `because`, `when`, `if`). Example: "because they studied hard."'
                    },
                    {
                      title: 'Sentence Type 1: The Simple Sentence',
                      content: 'A simple sentence consists of **one independent clause**. It has one subject-verb combination and expresses a single complete thought. It is the most basic sentence structure.\n\n**Structure:** `Independent Clause`\n\n**Examples:**\n- "The dog barked." (Subject: dog, Verb: barked)\n- "The students of Presec and the teachers of Mfantsipim attended the conference." (Compound Subject: students and teachers, Verb: attended)\n- "The player dribbled the ball and scored a goal." (Subject: player, Compound Verb: dribbled and scored)\n\nSimple sentences are clear and direct, but using too many of them can make your writing sound choppy.'
                    },
                    {
                      title: 'Sentence Type 2: The Compound Sentence',
                      content: 'A compound sentence consists of **two or more independent clauses** joined together. These clauses are of equal importance. They can be joined in two ways:\n\n1.  **With a coordinating conjunction (FANBOYS):** For, And, Nor, But, Or, Yet, So. A comma is placed **before** the conjunction.\n    - **Structure:** `Independent Clause, + coordinating conjunction + Independent Clause`\n    - Example: "The rain fell heavily, so the match was cancelled."\n\n2.  **With a semicolon (;):** A semicolon can join two closely related independent clauses.\n    - **Structure:** `Independent Clause; + Independent Clause`\n    - Example: "The students were excited; the exams were finally over."\n\nCompound sentences allow you to connect two related ideas in a single sentence.'
                    },
                    {
                      title: 'Sentence Type 3: The Complex Sentence',
                      content: 'A complex sentence consists of **one independent clause** and **at least one dependent clause**. The dependent clause relies on the independent clause to form a complete thought.\n\n**Structure:** The dependent clause can come before or after the independent clause.\n- `Dependent Clause, + Independent Clause` (Use a comma if the dependent clause comes first)\n  - Example: "Although he was tired, he continued to study."\n- `Independent Clause + Dependent Clause` (No comma is usually needed)\n  - Example: "He continued to study although he was tired."\n\nSubordinating conjunctions like `because`, `since`, `while`, `if`, `when`, `although`, and `unless` are used to introduce the dependent clause. Complex sentences are excellent for showing relationships between ideas, such as cause-and-effect or contrast.'
                    },
                    {
                      title: 'Sentence Type 4: The Compound-Complex Sentence',
                      content: 'A compound-complex sentence is a combination of a compound sentence and a complex sentence. It consists of **at least two independent clauses** and **at least one dependent clause**.\n\n**Structure:** It combines the rules for compound and complex sentences.\n\n**Examples:**\n- "When the power went out, my father lit a candle, and we all sat together in the living room."\n  - Dependent Clause: "When the power went out"\n  - Independent Clause 1: "my father lit a candle"\n  - Independent Clause 2: "we all sat together in the living room"\n\n- "The teacher, who was very patient, explained the problem again, but some students still did not understand."\n  - Independent Clause 1: "The teacher explained the problem again"\n  - Dependent Clause: "who was very patient"\n  - Independent Clause 2: "some students still did not understand"\n\nThese sentences are useful for expressing multiple, complex ideas in a single, flowing statement.'
                    },
                    {
                      title: 'Common Sentence Structure Errors',
                      content: 'Understanding sentence structures helps you avoid common writing errors.\n\n- **Sentence Fragment:** An incomplete sentence punctuated as if it were a complete sentence. It may be a dependent clause or a phrase standing alone.\n  - **Error:** "Because it was raining."\n  - **Correction:** "We stayed indoors because it was raining."\n\n- **Run-on Sentence (Fused Sentence):** Two or more independent clauses joined with no punctuation or conjunction.\n  - **Error:** "The school bell rang the students rushed out of the classroom."\n  - **Correction:** "The school bell rang, and the students rushed out of the classroom." OR "The school bell rang. The students rushed out of the classroom."\n\n- **Comma Splice:** Two or more independent clauses incorrectly joined only by a comma.\n  - **Error:** "The exam was difficult, many students failed."\n  - **Correction:** "The exam was difficult; many students failed." OR "The exam was difficult, so many students failed."'
                    },
                    {
                        title: 'The Function of Conjunctions',
                        content: 'Conjunctions are the glue that holds clauses together. Different types of conjunctions create different sentence structures.\n\n- **Coordinating Conjunctions (FANBOYS):** For, And, Nor, But, Or, Yet, So. They join elements of equal grammatical rank, including two independent clauses to form a **compound sentence**.\n  - Example: "I want to go to the party, **but** I have to study."\n\n- **Subordinating Conjunctions:** `after`, `although`, `as`, `because`, `before`, `if`, `since`, `unless`, `until`, `when`, `while`. They introduce a dependent clause and connect it to an independent clause, forming a **complex sentence**.\n  - Example: "**Although** the team played well, they lost the game."\n\n- **Conjunctive Adverbs:** `however`, `therefore`, `moreover`, `consequently`. They are used to join two independent clauses, but they require a semicolon before them and a comma after.\n  - Example: "The traffic was terrible; **however,** we arrived on time."'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'identification',
                            question: 'Identify each of the following as a Phrase, Independent Clause, or Dependent Clause.\n1. After the school assembly ended.\n2. The students went to their classes.\n3. In the middle of the night.\n4. Because he forgot his homework.\n5. The market was very crowded.',
                            solution: '1. Dependent Clause\n2. Independent Clause\n3. Phrase\n4. Dependent Clause\n5. Independent Clause'
                        },
                        {
                            type: 'sentence_type_identification',
                            question: 'Identify the type of each sentence (Simple, Compound, Complex, or Compound-Complex).\n1. The hardworking student passed the examination with distinction.\n2. I wanted to buy the new shoes, but I did not have enough money.\n3. When the rain stops, we will play football.\n4. Although she was sick, she came to school, and she participated in the debate.\n5. The journey was long; we were all tired.',
                            solution: '1. Simple\n2. Compound\n3. Complex\n4. Compound-Complex\n5. Compound'
                        },
                        {
                            type: 'sentence_combining',
                            question: 'Combine the following simple sentences to create the sentence type indicated in brackets.\n1. The sun was shining. The birds were singing. (Compound)\n2. He missed the bus. He was late for school. (Complex)\n3. The team won the trophy. The fans celebrated. The coach was proud. (Compound-Complex)',
                            solution: '1. The sun was shining, and the birds were singing.\n2. Because he missed the bus, he was late for school. (or He was late for school because he missed the bus.)\n3. When the team won the trophy, the fans celebrated, and the coach was proud.'
                        },
                        {
                            type: 'error_correction',
                            question: 'Identify and correct the error in each sentence (Fragment, Run-on, or Comma Splice).\n1. The teacher explaining the lesson to the students.\n2. I like reading, my sister prefers watching movies.\n3. We went to the beach it was a beautiful day.\n4. Since I have finished all my chores.\n5. The game was exciting, everyone was on their feet.',
                            solution: '1. Fragment. Correction: The teacher was explaining the lesson to the students.\n2. Comma Splice. Correction: I like reading, but my sister prefers watching movies.\n3. Run-on. Correction: We went to the beach. It was a beautiful day.\n4. Fragment. Correction: Since I have finished all my chores, I can go out to play.\n5. Comma Splice. Correction: The game was exciting; everyone was on their feet.'
                        },
                        {
                            type: 'creative_construction',
                            question: 'Write one sentence for each of the four types (Simple, Compound, Complex, Compound-Complex) about a memorable event in your life (e.g., a birthday, a festival, a school event).',
                            solution: 'Answers will vary. Example:\nSimple: My last birthday was a wonderful day.\nCompound: My friends came to my house, and we played games all afternoon.\nComplex: Although it rained a little, we still had a lot of fun.\nCompound-Complex: When my mother brought out the cake, everyone sang loudly, and I made a wish before I blew out the candles.'
                        },
                        {
                            type: 'clause_analysis',
                            question: 'Underline the independent clause(s) and circle the dependent clause(s) in the following sentences.\n1. Before you leave, make sure you lock the door.\n2. The book that I borrowed from the library is very interesting.\n3. He failed the test because he did not study, so he has to retake it next week.',
                            solution: '1. Dependent: "Before you leave". Independent: "make sure you lock the door".\n2. Independent: "The book is very interesting". Dependent: "that I borrowed from the library".\n3. Independent: "He failed the test", "so he has to retake it next week". Dependent: "because he did not study".'
                        },
                        {
                            type: 'paragraph_revision',
                            question: 'Rewrite the following paragraph to include at least one compound, one complex, and one compound-complex sentence. The original paragraph only uses simple sentences.\n\n"The students arrived at the museum. They were very excited. A guide showed them around. The guide explained the history of the artifacts. The students learned many new things. They returned to school in the evening. They were tired. They were happy."',
                            solution: 'Answers will vary. Example:\nThe students arrived at the museum, and they were very excited. A guide, who was very knowledgeable, showed them around and explained the history of the artifacts. The students learned many new things because the exhibits were so interesting. When they returned to school in the evening, they were tired, but they were also very happy.'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'Which of the following is a simple sentence?',
                        options: ['A. He came, and he saw.', 'B. Although he was late, he joined the class.', 'C. The hardworking students of Accra Academy won the prize.', 'D. I will go when I am ready.'],
                        solution: 'C. The hardworking students of Accra Academy won the prize.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence to form a compound sentence: The team played well, _______.',
                        options: ['A. because they practiced hard', 'B. but they lost the match', 'C. winning the trophy', 'D. after a long struggle'],
                        solution: 'B. but they lost the match'
                    },
                    {
                        question: 'Identify the sentence type: "When the bell rang, the students rushed out of the classroom."',
                        options: ['A. Simple', 'B. Compound', 'C. Complex', 'D. Compound-Complex'],
                        solution: 'C. Complex'
                    },
                    {
                        question: 'Which of the following is a sentence fragment?',
                        options: ['A. Go away.', 'B. After the long and tiring journey.', 'C. The rain fell.', 'D. He is a teacher, and she is a doctor.'],
                        solution: 'B. After the long and tiring journey.'
                    },
                    {
                        question: 'Choose the correctly punctuated sentence.',
                        options: ['A. The book is interesting it has many pictures.', 'B. The book is interesting, it has many pictures.', 'C. The book is interesting; it has many pictures.', 'D. The book is interesting, and, it has many pictures.'],
                        solution: 'C. The book is interesting; it has many pictures.'
                    },
                    {
                        question: 'Identify the sentence type: "The man who came here yesterday is my uncle, and he lives in Kumasi."',
                        options: ['A. Simple', 'B. Compound', 'C. Complex', 'D. Compound-Complex'],
                        solution: 'D. Compound-Complex'
                    },
                    {
                        question: 'A dependent clause is a group of words that...',
                        options: ['A. contains a subject and a verb and expresses a complete thought.', 'B. does not contain a subject or a verb.', 'C. contains a subject and a verb but does not express a complete thought.', 'D. is another name for a simple sentence.'],
                        solution: 'C. contains a subject and a verb but does not express a complete thought.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: _______ he was not invited, he attended the party.',
                        options: ['A. Because', 'B. So', 'C. Although', 'D. And'],
                        solution: 'C. Although'
                    },
                    {
                        question: 'Which of the following sentences contains a comma splice?',
                        options: ['A. I came, I saw, I conquered.', 'B. The weather was bad, so we stayed home.', 'C. He is very intelligent, he always gets good grades.', 'D. She studied hard; therefore, she passed.'],
                        solution: 'C. He is very intelligent, he always gets good grades.'
                    },
                    {
                        question: 'What are the two main types of clauses?',
                        options: ['A. Simple and Compound', 'B. Noun and Verb', 'C. Phrase and Sentence', 'D. Independent and Dependent'],
                        solution: 'D. Independent and Dependent'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence to form a complex sentence: The students will pass the exam _______.',
                        options: ['A. and they will celebrate', 'B. but it will be difficult', 'C. if they study hard', 'D. or they will fail'],
                        solution: 'C. if they study hard'
                    },
                    {
                        question: 'Identify the run-on (fused) sentence.',
                        options: ['A. The sun set it became dark.', 'B. The sun set, and it became dark.', 'C. When the sun set, it became dark.', 'D. The sun set; it became dark.'],
                        solution: 'A. The sun set it became dark.'
                    },
                    {
                        question: 'A compound sentence is made up of two or more _______.',
                        options: ['A. phrases', 'B. dependent clauses', 'C. simple sentences', 'D. independent clauses'],
                        solution: 'D. independent clauses'
                    },
                    {
                        question: 'The words "for, and, nor, but, or, yet, so" are examples of...',
                        options: ['A. subordinating conjunctions', 'B. prepositions', 'C. coordinating conjunctions', 'D. adverbs'],
                        solution: 'C. coordinating conjunctions'
                    },
                    {
                        question: 'Which sentence correctly uses a semicolon?',
                        options: ['A. I like tea; but my brother likes coffee.', 'B. The journey was long; we were tired.', 'C. Because the road was bad; the car broke down.', 'D. He took his bag; and left.'],
                        solution: 'B. The journey was long; we were tired.'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'What is the defining feature of an independent clause?',
                        options: ['It begins with a subordinating conjunction.', 'It acts as a single part of speech.', 'It expresses a complete thought and can stand alone.', 'It does not have a subject or a verb.'],
                        answer: 'It expresses a complete thought and can stand alone.',
                        explanation: 'An independent clause is essentially a simple sentence. It has a subject and a verb and conveys a complete idea.'
                    },
                    {
                        type: 'mcq',
                        question: 'A sentence containing two independent clauses and one dependent clause is called...',
                        options: ['Simple', 'Compound', 'Complex', 'Compound-Complex'],
                        answer: 'Compound-Complex',
                        explanation: 'This structure combines the features of both compound (two or more independent clauses) and complex (at least one dependent clause) sentences.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which conjunction is used to form a complex sentence?',
                        options: ['for', 'and', 'but', 'because'],
                        answer: 'because',
                        explanation: 'Subordinating conjunctions like "because," "although," and "when" introduce dependent clauses, creating complex sentences.'
                    },
                    {
                        type: 'mcq',
                        question: 'Identify the sentence fragment.',
                        options: ['The girl in the red dress.', 'She smiled.', 'The dog barked, and the cat ran away.', 'Wait for me.'],
                        answer: 'The girl in the red dress.',
                        explanation: 'This is a noun phrase. It has no verb, so it does not express a complete thought and is therefore a fragment.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sentence is a compound sentence?',
                        options: ['The rain fell heavily.', 'Although the rain fell, we went out.', 'The rain fell, and the wind blew.', 'The rain that fell yesterday was heavy.'],
                        answer: 'The rain fell, and the wind blew.',
                        explanation: 'This sentence contains two independent clauses ("The rain fell" and "the wind blew") joined by the coordinating conjunction "and".'
                    },
                    {
                        type: 'mcq',
                        question: 'What error is present in the sentence: "I enjoy playing football, my brother enjoys playing basketball."?',
                        options: ['Run-on sentence', 'Sentence fragment', 'Comma splice', 'No error'],
                        answer: 'Comma splice',
                        explanation: 'Two independent clauses are incorrectly joined with only a comma. They should be joined with a comma and a conjunction, a semicolon, or separated into two sentences.'
                    },
                    {
                        type: 'mcq',
                        question: 'A simple sentence can have...',
                        options: ['one independent clause and one dependent clause.', 'two or more independent clauses.', 'only one subject and one verb.', 'a compound subject or a compound verb.'],
                        answer: 'a compound subject or a compound verb.',
                        explanation: 'A simple sentence has only one independent clause, but that clause can contain compound elements like "The boy and the girl (compound subject) ran and jumped (compound verb)."'
                    },
                    {
                        type: 'mcq',
                        question: 'In the sentence, "If you finish your work, you can watch television," which part is the dependent clause?',
                        options: ['If you finish your work', 'you can watch television', 'you can watch', 'finish your work'],
                        answer: 'If you finish your work',
                        explanation: 'This clause begins with the subordinating conjunction "If" and cannot stand alone as a complete thought.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which of the following is NOT a coordinating conjunction (FANBOYS)?',
                        options: ['But', 'Or', 'Yet', 'While'],
                        answer: 'While',
                        explanation: '"While" is a subordinating conjunction, used to create complex sentences.'
                    },
                    {
                        type: 'mcq',
                        question: 'How should you correct a run-on sentence?',
                        options: ['Add more commas.', 'Add a period or a semicolon between the independent clauses.', 'Remove the subject from one of the clauses.', 'Add more adjectives.'],
                        answer: 'Add a period or a semicolon between the independent clauses.',
                        explanation: 'A run-on sentence incorrectly fuses two independent clauses. The best way to fix it is to separate them properly with appropriate punctuation.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'A complex sentence must always have a comma.',
                        answer: 'false',
                        reason: 'A comma is only required in a complex sentence if the dependent clause comes before the independent clause. If the independent clause comes first, no comma is needed.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'The group of words "on the table" is an example of a clause.',
                        answer: 'false',
                        reason: '"On the table" is a prepositional phrase. It lacks a subject and a verb, so it cannot be a clause.'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'A sentence that consists of only one independent clause is called a __________ sentence.',
                        answer: 'simple',
                        explanation: 'A simple sentence is the most basic type, containing one subject-verb unit and expressing a single complete thought.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Which of the following are characteristics of a compound sentence? (Select all that apply)',
                        options: [
                            'It contains at least one dependent clause.',
                            'It contains two or more independent clauses.',
                            'The clauses can be joined by a coordinating conjunction.',
                            'The clauses can be joined by a semicolon.'
                        ],
                        correctAnswers: ['It contains two or more independent clauses.', 'The clauses can be joined by a coordinating conjunction.', 'The clauses can be joined by a semicolon.'],
                        explanation: 'Compound sentences are all about joining two or more complete thoughts (independent clauses) of equal importance. A dependent clause would make it complex or compound-complex.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Which of the following sentences are complex sentences? (Select all that apply)',
                        options: [
                            'The dog barked when the stranger arrived.',
                            'The dog barked, and the stranger stopped.',
                            'Because the dog barked, the stranger was frightened.',
                            'The dog, a large Alsatian, barked loudly.'
                        ],
                        correctAnswers: ['The dog barked when the stranger arrived.', 'Because the dog barked, the stranger was frightened.'],
                        explanation: 'These two sentences each contain one independent clause and one dependent clause (starting with "when" and "because"). The other options are compound and simple, respectively.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the sentence structure error to its definition.',
                        pairs: [
                            { left: 'Fragment', right: 'An incomplete thought punctuated as a sentence.' },
                            { left: 'Run-on Sentence', right: 'Two independent clauses joined with no punctuation.' },
                            { left: 'Comma Splice', right: 'Two independent clauses joined only by a comma.' },
                        ],
                        explanation: 'Knowing the specific definition of each error is the first step to identifying and correcting it in your own writing.'
                    },
                    {
                        type: 'mcq',
                        question: 'Why is sentence variety important in writing?',
                        options: [
                            'It ensures all sentences are the same length.',
                            'It makes writing more engaging, sophisticated, and improves flow.',
                            'It allows the writer to use more difficult words.',
                            'It is required to make a sentence grammatically correct.'
                        ],
                        answer: 'It makes writing more engaging, sophisticated, and improves flow.',
                        explanation: 'Using a mix of simple, compound, and complex sentences creates a rhythm and flow that prevents monotony and keeps the reader interested.'
                    },
                  ],
                  summary: 'This lesson explored the essential building blocks of English sentences: phrases and clauses. We learned that a clause has a subject and a verb, while a phrase does not. Clauses can be independent (a complete thought) or dependent (an incomplete thought). By combining these clauses in different ways, we form the four basic sentence types: Simple (one independent clause), Compound (two or more independent clauses), Complex (one independent and at least one dependent clause), and Compound-Complex (two or more independent and at least one dependent clause). Mastering these structures allows you to create sentence variety, making your writing more sophisticated and engaging. It also helps you avoid common errors like fragments, run-on sentences, and comma splices. This knowledge is fundamental to achieving clarity and precision in your writing for the BECE and beyond.'
                },
                { 
                  id: 'eng201-3', 
                  slug: 'speech', 
                  title: 'Direct and Indirect Speech', 
                  objectives: [
                    'Define Direct and Indirect (Reported) Speech and distinguish between them.',
                    'Use correct punctuation for Direct Speech, including inverted commas and commas.',
                    'Apply rules for changing pronouns when converting from Direct to Indirect Speech.',
                    'Apply rules for "backshifting" tenses (e.g., Present Simple to Past Simple) in Indirect Speech.',
                    'Change time and place expressions (e.g., "now" to "then", "here" to "there") appropriately.',
                    'Convert questions (Yes/No and Wh- questions) from Direct to Indirect Speech correctly.',
                    'Convert commands and requests from Direct to Indirect Speech using infinitives.',
                    'Use appropriate reporting verbs (e.g., said, told, asked, ordered, suggested) to convey meaning.',
                    'Convert passages of dialogue into coherent reported speech paragraphs for composition writing.'
                  ],
                  introduction: 'Imagine you are telling your friend about an exciting announcement the headmaster made at assembly. You wouldn\'t just repeat his exact words like a robot; you would report the main message. You might say, "The headmaster said that we would close early today." This is Indirect Speech. However, if you were writing a story or a news report, you might want to quote him exactly: "The headmaster said, \'We will close early today.\'" This is Direct Speech.\n\nMastering the skill of switching between these two modes of speech is essential for effective communication. In Ghana, whether you are writing a formal report for your Student Representative Council (SRC), answering comprehension questions in the BECE, or simply gossiping with friends, you are constantly reporting what others have said. Direct Speech allows you to capture the exact personality and emotion of the speaker. It brings stories to life. Indirect Speech, on the other hand, helps you summarize information efficiently and integrate it into your own writing flow. It is crucial for academic writing, minutes of meetings, and journalism.\n\nMany students struggle with the rules of Reported Speech—changing "I" to "he," "is" to "was," or "tomorrow" to "the next day." This lesson will break down these rules into simple, manageable steps. We will look at how to handle statements, questions, and commands, and how to choose the right "reporting verb" (like *asked*, *warned*, or *promised*) to make your writing more precise. By the end of this lesson, you will be able to report any conversation with confidence and accuracy.',
                  keyConcepts: [
                    {
                      title: '1. Direct vs. Indirect Speech: The Basics',
                      content: 'Understanding the difference is the first step.\n\n- **Direct Speech:** Repeats the exact words spoken. The words are enclosed in quotation marks (inverted commas). It is used in stories, plays, and when exact quotes are needed.\n  - Example: Kofi said, "I am hungry."\n\n- **Indirect (Reported) Speech:** Reports the meaning of what was said without using the exact words. No quotation marks are used. It is used in reports, summaries, and everyday conversation.\n  - Example: Kofi said that he was hungry.'
                    },
                    {
                      title: '2. Punctuation Rules for Direct Speech',
                      content: 'Correct punctuation is vital for Direct Speech.\n\n1.  **The Comma:** Place a comma after the reporting clause (e.g., He said,) before the opening quotation mark.\n2.  **Quotation Marks:** Use inverted commas (" " or \' \') to enclose the actual words spoken.\n3.  **Capital Letter:** The first word of the spoken sentence must start with a capital letter.\n4.  **End Punctuation:** The full stop, question mark, or exclamation mark goes **inside** the closing quotation mark.\n\n- Correct: The teacher asked, "Who is absent today?"\n- Incorrect: The teacher asked "who is absent today"?\n- Incorrect: The teacher asked, "Who is absent today".'
                    },
                    {
                      title: '3. Changing Pronouns',
                      content: 'When reporting speech, you must change the pronouns to match the perspective of the reporter. You are no longer the speaker; you are talking *about* the speaker.\n\n- **First Person (I, we, my, our)** changes to **Third Person (he, she, they, his, her, their)**.\n  - Direct: Ama said, "**I** like **my** dress."\n  - Indirect: Ama said that **she** liked **her** dress.\n\n- **Second Person (you, your)** changes depending on who is being addressed (often **I, me, my, we, us, our**).\n  - Direct: He told me, "**You** look smart."\n  - Indirect: He told me that **I** looked smart.'
                    },
                    {
                      title: '4. Changing Tenses (Backshifting)',
                      content: 'Usually, if the reporting verb is in the past tense (e.g., said, told), the verb in the reported speech moves one step back in time. This is called "backshifting."\n\n- **Present Simple \u2192 Past Simple:** "I **eat** rice." \u2192 He said he **ate** rice.\n- **Present Continuous \u2192 Past Continuous:** "I **am playing**." \u2192 He said he **was playing**.\n- **Present Perfect \u2192 Past Perfect:** "I **have finished**." \u2192 He said he **had finished**.\n- **Past Simple \u2192 Past Perfect:** "I **bought** a book." \u2192 He said he **had bought** a book.\n- **Will \u2192 Would:** "I **will** go." \u2192 He said he **would** go.\n- **Can \u2192 Could:** "I **can** swim." \u2192 He said he **could** swim.\n\n**Exception:** If the reporting verb is in the present (e.g., "He says") or the statement is a general truth (e.g., "The sun rises in the east"), the tense does **not** change.'
                    },
                    {
                      title: '5. Changing Time and Place Expressions',
                      content: 'Words indicating nearness in time or place must be changed to words indicating distance.\n\n- **Time:**\n  - Now \u2192 Then / At that time\n  - Today \u2192 That day\n  - Yesterday \u2192 The day before / The previous day\n  - Tomorrow \u2192 The next day / The following day\n  - Last week \u2192 The previous week\n  - Next month \u2192 The following month\n\n- **Place/Demonstratives:**\n  - Here \u2192 There\n  - This \u2192 That\n  - These \u2192 Those\n\n- Example: "I am leaving **here tomorrow**," he said.\n- Indirect: He said that he was leaving **there the next day**.'
                    },
                    {
                      title: '6. Reporting Questions',
                      content: 'Reporting questions requires changing the word order and removing the question mark.\n\n- **Yes/No Questions:** Use **if** or **whether**. Change the word order to Subject + Verb.\n  - Direct: "Are you sick?" he asked.\n  - Indirect: He asked **if I was** sick. (Not: He asked if was I sick.)\n\n- **Wh- Questions:** Keep the question word (Who, What, Where, When, Why, How). Change the word order to Subject + Verb.\n  - Direct: "Where is the school?" she asked.\n  - Indirect: She asked **where the school was**. (Not: She asked where was the school.)'
                    },
                    {
                      title: '7. Reporting Commands and Requests',
                      content: 'For commands, requests, and advice, use the structure: **Reporting Verb + Object + To + Infinitive**.\n\n- **Positive Command:**\n  - Direct: "Sit down," the teacher said.\n  - Indirect: The teacher ordered us **to sit** down.\n\n- **Negative Command:**\n  - Direct: "Don\'t talk," he said.\n  - Indirect: He told us **not to talk**.\n\n- **Request:**\n  - Direct: "Please help me," she said.\n  - Indirect: She asked me **to help** her.'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'punctuation_practice',
                            question: 'Rewrite the following sentences adding the correct punctuation (commas, inverted commas, capital letters, full stops/question marks).\n1. the teacher said open your books\n2. kofi asked where are we going\n3. i am very tired said ama\n4. stop making noise the prefect shouted\n5. he asked do you like football',
                            solution: '1. The teacher said, "Open your books."\n2. Kofi asked, "Where are we going?"\n3. "I am very tired," said Ama.\n4. "Stop making noise!" the prefect shouted.\n5. He asked, "Do you like football?"'
                        },
                        {
                            type: 'pronoun_swap',
                            question: 'Rewrite the sentences in reported speech, changing ONLY the pronouns correctly.\n1. Kwesi said, "I have lost my pen." (Start: Kwesi said that...)\n2. The girls said, "We are washing our clothes." (Start: The girls said that...)\n3. My mother told me, "You must clean your room." (Start: My mother told me that...)\n4. The boys said, "This is our ball." (Start: The boys said that...)\n5. She said to him, "I will help you." (Start: She told him that...)',
                            solution: '1. Kwesi said that **he** had lost **his** pen.\n2. The girls said that **they** were washing **their** clothes.\n3. My mother told me that **I** must clean **my** room.\n4. The boys said that this was **their** ball.\n5. She told him that **she** would help **him**.'
                        },
                        {
                            type: 'tense_transformation',
                            question: 'Convert the following sentences to Indirect Speech, paying attention to the TENSE change.\n1. "I **am** happy," he said.\n2. "We **play** football every day," they said.\n3. "She **has gone** to the market," he said.\n4. "I **will visit** you," she promised.\n5. "I **saw** the thief," the witness stated.',
                            solution: '1. He said that he **was** happy.\n2. They said that they **played** football every day.\n3. He said that she **had gone** to the market.\n4. She promised that she **would visit** me.\n5. The witness stated that he/she **had seen** the thief.'
                        },
                        {
                            type: 'time_place_change',
                            question: 'Rewrite the sentences in Indirect Speech, changing the time and place expressions.\n1. "I am leaving **now**," he said.\n2. "We went to the zoo **yesterday**," they said.\n3. "I will see you **tomorrow**," she said.\n4. "Put the box **here**," he ordered.\n5. "I bought **this** book **last week**," he said.',
                            solution: '1. He said that he was leaving **then** (or at that time).\n2. They said that they had gone to the zoo **the day before** (or the previous day).\n3. She said that she would see me **the next day** (or the following day).\n4. He ordered me to put the box **there**.\n5. He said that he had bought **that** book **the previous week**.'
                        },
                        {
                            type: 'question_conversion',
                            question: 'Convert the following QUESTIONS into Indirect Speech.\n1. "Are you hungry?" Mum asked.\n2. "Where do you live?" the stranger asked.\n3. "Have you finished your homework?" Dad asked.\n4. "When will the bus arrive?" the passenger asked.\n5. "Can you swim?" he asked me.',
                            solution: '1. Mum asked **if I was** hungry.\n2. The stranger asked **where I lived**.\n3. Dad asked **if I had finished** my homework.\n4. The passenger asked **when the bus would arrive**.\n5. He asked me **if I could** swim.'
                        },
                        {
                            type: 'command_conversion',
                            question: 'Convert the following COMMANDS and REQUESTS into Indirect Speech.\n1. "Close the door," the teacher said.\n2. "Please give me some water," the old man said.\n3. "Don\'t run in the corridor," the headmaster said.\n4. "Be quiet!" the librarian said.\n5. "Please don\'t tell anyone," she begged.',
                            solution: '1. The teacher ordered/told us **to close** the door.\n2. The old man asked/requested me **to give** him some water.\n3. The headmaster warned/told us **not to run** in the corridor.\n4. The librarian ordered us **to be** quiet.\n5. She begged me **not to tell** anyone.'
                        },
                        {
                            type: 'dialogue_to_report',
                            question: 'Read the dialogue and rewrite it as a paragraph of reported speech.\n\nKwame: "I am going to the library."\nAbena: "Can I come with you?"\nKwame: "Yes, but you must be quiet."\nAbena: "I promise I will not make any noise."',
                            solution: 'Kwame said that he was going to the library. Abena asked if she could go with him. Kwame agreed (said yes) but told her that she must be quiet. Abena promised that she would not make any noise.'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: He asked me where _______.',
                        options: ['A. was I going', 'B. I was going', 'C. am I going', 'D. I am going'],
                        solution: 'B. I was going'
                    },
                    {
                        question: 'Change the following sentence into Indirect Speech: The teacher said, "The sun rises in the east."',
                        options: ['A. The teacher said that the sun rose in the east.', 'B. The teacher said that the sun rises in the east.', 'C. The teacher said that the sun had risen in the east.', 'D. The teacher said that the sun was rising in the east.'],
                        solution: 'B. The teacher said that the sun rises in the east.'
                    },
                    {
                        question: 'Choose the correct reported form of: "I will come tomorrow," he said.',
                        options: ['A. He said that he will come tomorrow.', 'B. He said that he would come tomorrow.', 'C. He said that he would come the next day.', 'D. He said that he will come the next day.'],
                        solution: 'C. He said that he would come the next day.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: The policeman ordered the driver _______.',
                        options: ['A. stop', 'B. to stop', 'C. that he should stop', 'D. stopping'],
                        solution: 'B. to stop'
                    },
                    {
                        question: 'Change into Indirect Speech: "Did you see the accident?" he asked.',
                        options: ['A. He asked if I saw the accident.', 'B. He asked did I see the accident.', 'C. He asked if I had seen the accident.', 'D. He asked whether I see the accident.'],
                        solution: 'C. He asked if I had seen the accident.'
                    },
                    {
                        question: 'Which of the following sentences is punctuated correctly?',
                        options: ['A. "Come here" he said.', 'B. "Come here," he said.', 'C. "Come here", he said.', 'D. Come here, "he said."'],
                        solution: 'B. "Come here," he said.'
                    },
                    {
                        question: 'Report the following: "Don\'t touch that!" she shouted.',
                        options: ['A. She shouted that I shouldn\'t touch that.', 'B. She shouted to not touch that.', 'C. She warned me not to touch that.', 'D. She said I don\'t touch that.'],
                        solution: 'C. She warned me not to touch that.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: She told us that she _______ the movie already.',
                        options: ['A. has seen', 'B. saw', 'C. had seen', 'D. sees'],
                        solution: 'C. had seen'
                    },
                    {
                        question: 'Change into Indirect Speech: "I am busy now," said Father.',
                        options: ['A. Father said that he was busy now.', 'B. Father said that he is busy then.', 'C. Father said that he was busy then.', 'D. Father said that I was busy then.'],
                        solution: 'C. Father said that he was busy then.'
                    },
                    {
                        question: 'Choose the correct reported form: "Who broke the window?" the teacher asked.',
                        options: ['A. The teacher asked who broke the window.', 'B. The teacher asked who had broken the window.', 'C. The teacher asked who breaks the window.', 'D. The teacher asked who did break the window.'],
                        solution: 'B. The teacher asked who had broken the window.'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: He promised that he _______ the money the following week.',
                        options: ['A. will pay', 'B. would pay', 'C. pays', 'D. can pay'],
                        solution: 'B. would pay'
                    },
                    {
                        question: 'Change into Indirect Speech: "We have been waiting for an hour," they complained.',
                        options: ['A. They complained that they have been waiting for an hour.', 'B. They complained that they had been waiting for an hour.', 'C. They complained that we had been waiting for an hour.', 'D. They complained that they were waiting for an hour.'],
                        solution: 'B. They complained that they had been waiting for an hour.'
                    },
                    {
                        question: 'Which reporting verb is best for: "I will definitely help you," said Kofi.',
                        options: ['A. asked', 'B. ordered', 'C. promised', 'D. inquired'],
                        solution: 'C. promised'
                    },
                    {
                        question: 'From the alternatives lettered A to D, choose the one which most suitably completes the sentence: The doctor asked the patient how he _______.',
                        options: ['A. is feeling', 'B. was feeling', 'C. feels', 'D. does feel'],
                        solution: 'B. was feeling'
                    },
                    {
                        question: 'Change into Indirect Speech: "Please open the window," she said to him.',
                        options: ['A. She said to him please open the window.', 'B. She asked him to open the window.', 'C. She told him that he opens the window.', 'D. She ordered him opening the window.'],
                        solution: 'B. She asked him to open the window.'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'Which punctuation mark is used to enclose the exact words of a speaker?',
                        options: ['Comma', 'Full stop', 'Inverted commas (Quotation marks)', 'Colon'],
                        answer: 'Inverted commas (Quotation marks)',
                        explanation: 'Inverted commas (" " or \' \') are used to mark the beginning and end of Direct Speech.'
                    },
                    {
                        type: 'mcq',
                        question: 'When changing "I am hungry" to reported speech, "am" changes to...',
                        options: ['is', 'was', 'were', 'been'],
                        answer: 'was',
                        explanation: 'The present simple "am" backshifts to the past simple "was" to match the reporting verb "said".'
                    },
                    {
                        type: 'mcq',
                        question: 'In reported speech, "tomorrow" changes to...',
                        options: ['yesterday', 'that day', 'the next day', 'today'],
                        answer: 'the next day',
                        explanation: 'Time expressions change to reflect the distance in time. "Tomorrow" becomes "the next day" or "the following day".'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sentence is correct Indirect Speech for: He asked, "Where are you going?"',
                        options: ['He asked where was I going.', 'He asked where I was going.', 'He asked where am I going.', 'He asked where I am going.'],
                        answer: 'He asked where I was going.',
                        explanation: 'In reported questions, the word order changes to Subject + Verb (I was), and the tense backshifts.'
                    },
                    {
                        type: 'mcq',
                        question: 'If the reporting verb is in the present tense (e.g., "He says"), what happens to the tense of the speech?',
                        options: ['It changes to the past.', 'It changes to the future.', 'It does not change.', 'It changes to the past perfect.'],
                        answer: 'It does not change.',
                        explanation: 'When the reporting verb is present, the time reference remains the same, so no backshifting is needed.'
                    },
                    {
                        type: 'mcq',
                        question: 'What is the correct reported form of a negative command like "Don\'t talk"?',
                        options: ['He said that I don\'t talk.', 'He told me not to talk.', 'He told me to not talk.', 'He said no talking.'],
                        answer: 'He told me not to talk.',
                        explanation: 'Negative commands are reported using "not to" + infinitive.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which pronoun replaces "we" in reported speech if the speakers are others?',
                        options: ['they', 'them', 'us', 'you'],
                        answer: 'they',
                        explanation: '"We" (first person plural) changes to "they" (third person plural) when reported by someone outside the group.'
                    },
                    {
                        type: 'mcq',
                        question: 'The sentence "The teacher said that water boils at 100 degrees Celsius" is an example of...',
                        options: ['Backshifting', 'A general truth exception', 'Incorrect grammar', 'Future tense'],
                        answer: 'A general truth exception',
                        explanation: 'General truths or scientific facts do not need to be backshifted, even if the reporting verb is in the past.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which word is often used to link the reporting clause and the reported speech in statements?',
                        options: ['if', 'whether', 'that', 'because'],
                        answer: 'that',
                        explanation: '"That" is the standard conjunction for reported statements (e.g., He said *that*...), though it is often optional.'
                    },
                    {
                        type: 'mcq',
                        question: 'Change "here" to reported speech.',
                        options: ['where', 'there', 'their', 'near'],
                        answer: 'there',
                        explanation: 'Place expressions change from "here" (near) to "there" (distant).'
                    },
                    {
                        type: 'truefalse',
                        statement: 'You must always use a question mark at the end of a reported question.',
                        answer: 'false',
                        reason: 'Reported questions become statements (e.g., He asked where I was.) and end with a full stop, not a question mark.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'In Direct Speech, the comma goes outside the quotation marks.',
                        answer: 'false',
                        reason: 'In standard punctuation, the comma (or other end punctuation) goes *inside* the closing quotation marks.'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'To report a Yes/No question, we use the words "if" or "__________".',
                        answer: 'whether',
                        explanation: 'Both "if" and "whether" are used to introduce reported Yes/No questions.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Which of the following are correct reporting verbs? (Select all that apply)',
                        options: ['said', 'asked', 'told', 'spoke'],
                        correctAnswers: ['said', 'asked', 'told'],
                        explanation: '"Said," "asked," and "told" are common reporting verbs. "Spoke" is usually intransitive and not used to introduce reported speech directly (e.g., we don\'t say "He spoke that...").'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Select the sentences that are correctly punctuated Direct Speech. (Select all that apply)',
                        options: [
                            'He said, "I am tired."',
                            '"I am tired," he said.',
                            'He said "I am tired."',
                            '"I am tired" he said.'
                        ],
                        correctAnswers: ['He said, "I am tired."', '"I am tired," he said.'],
                        explanation: 'Correct punctuation requires a comma to separate the reporting clause and the speech, and quotation marks around the speech.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the Direct Speech tense to its Indirect Speech equivalent.',
                        pairs: [
                            { left: 'Present Simple', right: 'Past Simple' },
                            { left: 'Present Continuous', right: 'Past Continuous' },
                            { left: 'Past Simple', right: 'Past Perfect' },
                            { left: 'Will', right: 'Would' },
                        ],
                        explanation: 'This matching exercise reinforces the standard backshifting rules.'
                    },
                    {
                        type: 'shortanswer',
                        question: 'Explain why we change "now" to "then" in reported speech.',
                        answer: 'We change "now" to "then" because the time when the speech is reported is usually different from the time when the words were originally spoken. "Now" refers to the moment of speaking, while "then" refers to that past moment from the reporter\'s perspective.',
                        explanation: 'This tests the understanding of the concept of "distance" in time that underlies reported speech changes.'
                    },
                  ],
                  summary: 'In this lesson, we explored the two ways of reporting what someone has said: Direct Speech and Indirect (Reported) Speech. Direct Speech uses the speaker\'s exact words and requires quotation marks. Indirect Speech reports the meaning and requires changes to pronouns, tenses (backshifting), and time/place expressions to match the reporter\'s perspective. We learned that present tenses usually change to past tenses, and "here/now" change to "there/then." We also covered the special rules for reporting questions (changing word order and using if/whether) and commands (using infinitives). Mastering these rules allows you to communicate information accurately and write more effective stories and reports.'
                },
                { 
                  id: 'eng201-4', 
                  slug: 'voice', 
                  title: 'Active and Passive Voice', 
                  objectives: [
                    'Define Active and Passive Voice and distinguish between them.',
                    'Identify the Subject, Verb, and Object in a sentence.',
                    'Form the Passive Voice using the correct form of "to be" + Past Participle.',
                    'Convert sentences from Active to Passive Voice in various tenses (Simple Present, Simple Past, Present Continuous, etc.).',
                    'Convert sentences from Passive to Active Voice.',
                    'Understand when and why to use the Passive Voice (e.g., when the doer is unknown or less important).',
                    'Handle sentences with two objects (Direct and Indirect) in the Passive Voice.'
                  ],
                  introduction: 'Imagine you are reporting a football match. You could say, "Kudus scored a goal." This is direct and energetic. But what if the goal was scored, but you didn\'t see who did it? You might say, "A goal was scored." This shift in focus is what Active and Passive Voice is all about.\n\nIn English, the "Voice" of a verb tells us whether the subject is performing the action or receiving the action. In the **Active Voice**, the subject is the "doer" (e.g., "The cat chased the mouse"). In the **Passive Voice**, the subject is the "receiver" (e.g., "The mouse was chased by the cat").\n\nWhile we use the Active Voice most of the time because it is clearer and more direct, the Passive Voice is a powerful tool for scientific writing, formal reports, or when we want to emphasize *what* happened rather than *who* did it. This lesson will teach you the mechanics of switching between these voices, a skill that is frequently tested in the BECE and is essential for mature writing.',
                  keyConcepts: [
                    {
                      title: '1. The Core Difference: S-V-O vs. O-V-S',
                      content: 'To understand voice, you must identify the Subject (S), Verb (V), and Object (O).\n\n- **Active Voice:** Subject + Verb + Object.\n  - *The teacher (S) punished (V) the student (O).*\n  - The focus is on the teacher.\n\n- **Passive Voice:** Object + "Be" Verb + Past Participle + (by Subject).\n  - *The student (S) was punished (V) by the teacher (O).*\n  - The object of the active sentence becomes the subject of the passive sentence. The focus shifts to the student.'
                    },
                    {
                      title: '2. Forming the Passive Voice',
                      content: 'The formula for Passive Voice is always: **Form of "to be" + Past Participle (V3)**.\n\nThe form of "to be" changes depending on the tense of the original active sentence.\n\n- **Present Simple:** am/is/are + V3\n  - Active: Kofi **eats** rice.\n  - Passive: Rice **is eaten** by Kofi.\n\n- **Past Simple:** was/were + V3\n  - Active: Kofi **ate** rice.\n  - Passive: Rice **was eaten** by Kofi.\n\n- **Future Simple:** will be + V3\n  - Active: Kofi **will eat** rice.\n  - Passive: Rice **will be eaten** by Kofi.'
                    },
                    {
                      title: '3. Continuous and Perfect Tenses',
                      content: 'The rule applies to more complex tenses as well.\n\n- **Present Continuous:** am/is/are + **being** + V3\n  - Active: They **are building** a house.\n  - Passive: A house **is being built** by them.\n\n- **Past Continuous:** was/were + **being** + V3\n  - Active: They **were building** a house.\n  - Passive: A house **was being built** by them.\n\n- **Present Perfect:** has/have + **been** + V3\n  - Active: She **has written** a letter.\n  - Passive: A letter **has been written** by her.\n\n- **Past Perfect:** had + **been** + V3\n  - Active: She **had written** a letter.\n  - Passive: A letter **had been written** by her.'
                    },
                    {
                      title: '4. When to Use the Passive Voice',
                      content: 'Use the Passive Voice when:\n\n1.  **The doer is unknown:** "My wallet **was stolen**." (I don\'t know who stole it.)\n2.  **The doer is obvious:** "The thief **was arrested**." (Obviously by the police.)\n3.  **The action is more important than the doer:** "The bridge **was completed** in 1990."\n4.  **In scientific/formal writing:** "The mixture **was heated**." (It doesn\'t matter who heated it.)'
                    },
                    {
                      title: '5. Sentences with Two Objects',
                      content: 'Some verbs (give, send, show, lend) take two objects: a Direct Object (the thing) and an Indirect Object (the person).\n\n- Active: He gave **me** (Indirect) **a book** (Direct).\n\nYou can form two different passive sentences:\n1.  **Indirect Object as Subject (More common):** **I** was given a book by him.\n2.  **Direct Object as Subject:** **A book** was given **to me** by him.'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'voice_identification',
                            question: 'Identify whether the following sentences are Active or Passive.\n1. The dog bit the man.\n2. The man was bitten by the dog.\n3. The cake is being baked.\n4. We will visit the zoo.\n5. The letter has been sent.',
                            solution: '1. Active\n2. Passive\n3. Passive\n4. Active\n5. Passive'
                        },
                        {
                            type: 'active_to_passive',
                            question: 'Change the following sentences from Active to Passive Voice.\n1. The hunter killed the lion.\n2. Ama is cooking dinner.\n3. They have built a new school.\n4. The teacher will punish the latecomers.\n5. People speak English all over the world.',
                            solution: '1. The lion was killed by the hunter.\n2. Dinner is being cooked by Ama.\n3. A new school has been built by them.\n4. The latecomers will be punished by the teacher.\n5. English is spoken all over the world (by people).'
                        },
                        {
                            type: 'passive_to_active',
                            question: 'Change the following sentences from Passive to Active Voice.\n1. The car was repaired by the mechanic.\n2. The song is being sung by the choir.\n3. The work had been finished by the students.\n4. A story was told to us by the grandmother.\n5. The match will be played on Sunday.',
                            solution: '1. The mechanic repaired the car.\n2. The choir is singing the song.\n3. The students had finished the work.\n4. The grandmother told us a story.\n5. They (or We) will play the match on Sunday.'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'Change the sentence into the passive voice: "The boys are playing football."',
                        options: ['A. Football is played by the boys.', 'B. Football was played by the boys.', 'C. Football is being played by the boys.', 'D. Football was being played by the boys.'],
                        solution: 'C. Football is being played by the boys.'
                    },
                    {
                        question: 'Which of the following sentences is in the Passive Voice?',
                        options: ['A. He broke the glass.', 'B. The glass was broken.', 'C. He has broken the glass.', 'D. The glass broke.'],
                        solution: 'B. The glass was broken.'
                    },
                    {
                        question: 'Change the sentence into the active voice: "The letter was written by Abena."',
                        options: ['A. Abena is writing the letter.', 'B. Abena wrote the letter.', 'C. Abena writes the letter.', 'D. Abena has written the letter.'],
                        solution: 'B. Abena wrote the letter.'
                    },
                    {
                        question: 'The passive form of "They have done the work" is...',
                        options: ['A. The work is done.', 'B. The work was done.', 'C. The work has been done.', 'D. The work had been done.'],
                        solution: 'C. The work has been done.'
                    },
                    {
                        question: 'Choose the correct passive sentence for: "Who wrote this book?"',
                        options: ['A. Who was written this book?', 'B. By whom was this book written?', 'C. This book was written by who?', 'D. Who had written this book?'],
                        solution: 'B. By whom was this book written?'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'In the sentence "The cake was eaten by the dog," what is the subject?',
                        options: ['The cake', 'was eaten', 'by', 'the dog'],
                        answer: 'The cake',
                        explanation: 'In a passive sentence, the receiver of the action (the cake) becomes the grammatical subject, even though the dog is the one doing the eating.'
                    },
                    {
                        type: 'mcq',
                        question: 'What is the passive form of "She writes a letter"?',
                        options: ['A letter is written by her.', 'A letter was written by her.', 'A letter is being written by her.', 'A letter has been written by her.'],
                        answer: 'A letter is written by her.',
                        explanation: '"Writes" is Present Simple. The passive formula is am/is/are + Past Participle. So, "is written".'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sentence is in the Active Voice?',
                        options: ['The house was painted.', 'The car was driven by John.', 'John drove the car.', 'The money was stolen.'],
                        answer: 'John drove the car.',
                        explanation: 'Here, the subject (John) is performing the action (drove). The other sentences are passive.'
                    },
                    {
                        type: 'mcq',
                        question: 'The passive form of "They are watching a movie" is...',
                        options: ['A movie is watched by them.', 'A movie was being watched by them.', 'A movie is being watched by them.', 'A movie has been watched by them.'],
                        answer: 'A movie is being watched by them.',
                        explanation: 'Present Continuous (are watching) changes to "is being watched".'
                    },
                    {
                        type: 'mcq',
                        question: 'When is the Passive Voice typically used?',
                        options: ['When we want to be very direct.', 'When the doer of the action is unknown or unimportant.', 'When we want to use fewer words.', 'When we are speaking informally.'],
                        answer: 'When the doer of the action is unknown or unimportant.',
                        explanation: 'Passive voice shifts focus to the object or action itself, which is useful when the actor is unknown (e.g., "My car was stolen").'
                    },
                    {
                        type: 'truefalse',
                        statement: 'We can form the passive voice for all verbs.',
                        answer: 'false',
                        reason: 'Only transitive verbs (verbs that take an object) can be made passive. Intransitive verbs like "sleep," "arrive," or "die" cannot be passive.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'The sentence "He was happy" is in the Passive Voice.',
                        answer: 'false',
                        reason: 'This is a common confusion. "Was" is a "be" verb, but "happy" is an adjective, not a past participle. This is a simple active sentence describing a state.'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'To form the passive voice, we always use a form of the verb "to be" and the __________ participle of the main verb.',
                        answer: 'past',
                        explanation: 'The structure is always Be + Past Participle (V3).'
                    },
                    {
                        type: 'matching',
                        question: 'Match the Active Tense to its Passive Helper Verb form.',
                        pairs: [
                            { left: 'Present Simple', right: 'am / is / are' },
                            { left: 'Past Simple', right: 'was / were' },
                            { left: 'Present Continuous', right: 'am / is / are + being' },
                            { left: 'Present Perfect', right: 'has / have + been' },
                        ],
                        explanation: 'Knowing these helper verb patterns is the key to forming passive sentences correctly.'
                    },
                    {
                        type: 'mcq',
                        question: 'Change to passive: "Someone has stolen my pen."',
                        options: [
                            'My pen is stolen.',
                            'My pen was stolen.',
                            'My pen has been stolen.',
                            'My pen had been stolen.'
                        ],
                        answer: 'My pen has been stolen.',
                        explanation: '"Has stolen" is Present Perfect. The passive form is "has been stolen". We often omit "by someone" because it is vague.'
                    },
                  ],
                  summary: 'In this lesson, we learned that the "Voice" of a verb indicates whether the subject is the doer (Active) or the receiver (Passive) of the action. We discovered that the Passive Voice is formed using "to be" + Past Participle. We practiced converting sentences across various tenses, noting how "is" becomes "was," "is doing" becomes "is being done," and "has done" becomes "has been done." We also discussed that the Passive Voice is useful when the doer is unknown or when we want to emphasize the action itself. Mastering this skill adds variety and formality to your writing.'
                },
            ];
          },
          {
            id: 'eng202',
            slug: 'writing-2',
            title: 'Writing',
            lessons: [
                {
                  id: 'eng202-1',
                  slug: 'guided-composition',
                  title: 'Guided Composition',
                  objectives: [
                    "Understand the nature and purpose of guided composition.",
                    "Analyze prompts and outlines provided in examination questions.",
                    "Expand points into full, coherent sentences and paragraphs.",
                    "Use appropriate linking words to connect ideas.",
                    "Maintain a consistent tense and point of view.",
                    "Write a composition of the required length based on given guidelines."
                  ],
                  introduction: "Guided composition is a writing task where you are given a topic and some points or an outline to help you write. It's like building a house where the architect has already drawn the plan and given you the materials—your job is to put them together beautifully! In the BECE, this is a common section. The examiners want to see if you can take a skeleton of ideas and flesh it out into a full, interesting, and grammatically correct story or essay. This lesson will teach you how to expand points, link ideas, and write a flowing composition that earns high marks.",
                  keyConcepts: [
                    {
                      title: "1. Understanding the Prompt",
                      content: "Before you start writing, read the instructions carefully.\n\n*   **Identify the Topic:** What are you writing about? (e.g., A festival, a journey, a person).\n*   **Identify the Audience:** Who will read it? (e.g., Your teacher, a friend, the general public).\n*   **Check the Points:** Read through the provided points or outline. You **MUST** use all the points given. You can add your own relevant points, but do not omit the required ones."
                    },
                    {
                      title: "2. Expanding Points",
                      content: "The points given are usually short phrases. Your job is to turn them into full, descriptive sentences.\n\n*   **Point:** *went to market*\n*   **Poor Expansion:** I went to the market.\n*   **Good Expansion:** *Early on Saturday morning, my mother and I went to the bustling Makola market to buy food for the week.*\n\n**Tip:** Add adjectives (describing words) and adverbs (how things are done) to make your sentences interesting."
                    },
                    {
                      title: "3. Structure and Paragraphing",
                      content: "Organize your composition logically.\n\n*   **Introduction:** Introduce the topic. Hook the reader.\n*   **Body Paragraphs:** Group related points together. Usually, you will have 2-3 body paragraphs. Each paragraph should have a main idea.\n*   **Conclusion:** Summarize your writing or give a concluding thought. How did the event end? What did you learn?"
                    },
                    {
                      title: "4. Linking Words",
                      content: "Use transition words to connect your sentences and paragraphs smoothly.\n\n*   **Time:** First, Next, Then, After that, Finally, Suddenly, Meanwhile.\n*   **Addition:** Also, Furthermore, In addition, Moreover.\n*   **Contrast:** However, But, Although, On the other hand.\n*   **Result:** Therefore, Consequently, As a result, So."
                    },
                    {
                      title: "5. Tense Consistency",
                      content: "Choose the correct tense and stick to it.\n\n*   **Past Tense:** Use this for stories about the past (e.g., 'A day I will never forget', 'My last birthday').\n    *   *Example:* I **walked** to school. I **saw** a snake.\n*   **Present Tense:** Use this for descriptive essays or factual topics (e.g., 'My School', 'How to prepare fufu').\n    *   *Example:* My school **is** big. The teachers **are** kind."
                    },
                  ],
                  activities: {
                    type: "exercises",
                    exercises: [
                      {
                        title: "Exercise 1: Expanding Points",
                        instructions: "Expand the following points into full, interesting sentences.",
                        questions: [
                          { question: "Point: woke up late", answer: "I woke up late because my alarm clock did not ring." },
                          { question: "Point: missed the bus", answer: "Unfortunately, I missed the school bus and had to walk." },
                          { question: "Point: teacher was angry", answer: "My teacher was very angry when I arrived late to class." },
                        ],
                      },
                      {
                        title: "Exercise 2: Using Linking Words",
                        instructions: "Choose the best linking word to complete the sentence.",
                        questions: [
                          { question: "I wanted to play football, _____ it was raining. (so / but)", answer: "but" },
                          { question: "_____, we went to the zoo. Then, we went to the park. (Finally / First)", answer: "First" },
                          { question: "He studied hard; _____, he passed the exam. (however / therefore)", answer: "therefore" },
                        ],
                      },
                    ],
                  },
                  pastQuestions: [
                    {
                      year: "2020",
                      question: "Write a story that ends with the words: '...and I learnt a bitter lesson.'",
                      options: ["N/A"],
                      answer: "N/A",
                      explanation: "This is a guided composition task. You would need to write a narrative essay about an event where you made a mistake and learned from it."
                    },
                    {
                      year: "2018",
                      question: "Write a letter to your friend telling him/her about your plans for the holidays.",
                      options: ["N/A"],
                      answer: "N/A",
                      explanation: "This requires an informal letter format. You would use points like: where you will go, who you will visit, what activities you will do, and when you will return."
                    },
                  ],
                  summary: "Guided composition tests your ability to write clearly and coherently using provided points. Remember to expand on the points, use good paragraphing, and connect your ideas with linking words. Always check your tenses and spelling."
                },
                {
                  id: 'eng202-2',
                  slug: 'functional-writing',
                  title: 'Functional Writing',
                  objectives: [
                    "Define functional writing and identify its key purposes.",
                    "Write formal and informal letters following proper format and structure.",
                    "Compose effective notices, memos, and circulars.",
                    "Write clear and concise emails for different purposes.",
                    "Create reports, speeches, and minutes of meetings.",
                    "Apply appropriate tone, language, and format for different functional writing tasks.",
                    "Answer BECE-style questions on functional writing formats and conventions."
                  ],
                  introduction: "Have you ever needed to write a letter to your school principal, send an email to a teacher, or create a notice for your club? Welcome to **Functional Writing**—the practical writing you use in everyday life! Unlike creative stories or essays, functional writing has a specific purpose: to inform, request, complain, invite, or report. In this lesson, you'll master the formats and skills needed for letters, emails, notices, reports, and more—essential for both BECE examinations and real-world communication.",
                  keyConcepts: [
                    {
                      title: "1. What is Functional Writing?",
                      content: "**Functional writing** is practical writing done for a specific purpose in everyday life or work situations.\n\n**Characteristics:**\n*   Has a clear purpose (inform, request, complain, etc.)\n*   Follows specific formats and conventions\n*   Uses appropriate tone (formal or informal)\n*   Is concise and direct\n*   Contains necessary details\n\n**Types of Functional Writing:**\n*   **Letters** (formal and informal)\n*   **Emails**\n*   **Notices and Circulars**\n*   **Memos**\n*   **Reports**\n*   **Speeches**\n*   **Minutes of Meetings**\n*   **Applications and CVs**"
                    },
                    {
                      title: "2. Formal Letters",
                      content: "**FORMAT:**\n\n**1. Your Address** (top right corner):\n```\n15 Mango Street,\nAccra,\nGhana.\n```\n\n**2. Date** (below your address):\n```\n4th December, 2025\n```\n\n**3. Recipient's Address** (left side):\n```\nThe Headmaster,\nAchimota Secondary School,\nAccra.\n```\n\n**4. Salutation:**\n*   Formal: *Dear Sir,* or *Dear Madam,*\n*   If you know the name: *Dear Mr. Mensah,*\n\n**5. Subject/Title** (optional but recommended):\n```\nApplication for Position of School Prefect\n```\n\n**6. Body** (usually 3 paragraphs):\n*   **Introduction:** State your purpose\n*   **Body:** Provide details and explanations\n*   **Conclusion:** Summarize and request action\n\n**7. Closing:**\n*   *Yours faithfully,* (if you started with Dear Sir/Madam)\n*   *Yours sincerely,* (if you used a name)\n\n**8. Signature and Name:**\n```\nKwame Mensah\n```\n\n**TYPES OF FORMAL LETTERS:**\n*   Application letters\n*   Complaint letters\n*   Request letters\n*   Business letters\n*   Letters to authorities"
                    },
                    {
                      title: "3. Informal Letters",
                      content: "**FORMAT:**\n\n**1. Your Address** (top right):\n```\n10 University Road,\nKumasi.\n```\n\n**2. Date:**\n```\n4th December, 2025\n```\n\n**3. Salutation:**\n*   *Dear [Friend's Name],*\n*   *My dear [Name],*\n*   *Dearest [Name],*\n\n**4. Body:**\n*   More personal and conversational\n*   Can include greetings to family\n*   Share news, experiences, feelings\n\n**5. Closing:**\n*   *Yours lovingly,*\n*   *With love,*\n*   *Your friend,*\n*   *Best wishes,*\n\n**DIFFERENCE FROM FORMAL:**\n*   ✓ No recipient's address\n*   ✓ More casual language\n*   ✓ Can use contractions (I'm, you're)\n*   ✓ More personal expressions\n*   ✓ Warm, friendly closing"
                    },
                    {
                      title: "4. Notices and Circulars",
                      content: "**NOTICE FORMAT:**\n\n```\n              [NAME OF ORGANIZATION]\n                    NOTICE\n\nDate: 4th December, 2025\n\nTitle: SCIENCE CLUB MEETING\n\nAll members of the Science Club are informed that our next meeting will be held on Friday, 10th December, 2025, at 3:00 PM in the Science Laboratory.\n\nAgenda:\n1. Election of new executives\n2. Planning for Science Fair\n3. Any other business\n\nAll members are expected to attend.\n\n[Signature]\nKofi Asante\nSecretary, Science Club\n```\n\n**KEY FEATURES:**\n*   ✓ Centered heading\n*   ✓ Date clearly stated\n*   ✓ Clear, concise information (What, When, Where, Why)\n*   ✓ Formal language\n*   ✓ Signature and designation\n*   ✓ Can be boxed for emphasis\n\n**CIRCULAR:** Similar to notice but sent to specific people, often more detailed."
                    },
                    {
                      title: "5. Email Writing",
                      content: "**EMAIL FORMAT:**\n\n**To:** recipient@email.com\n**From:** your@email.com\n**Subject:** Clear, brief description\n**Date:** [Automatic]\n\n**Salutation:**\n*   Formal: *Dear Sir/Madam,* or *Dear Mr./Ms. [Name],*\n*   Semi-formal: *Hello [Name],* or *Hi [Name],*\n\n**Body:**\n*   Keep it brief and to the point\n*   Use short paragraphs\n*   Be polite and professional\n\n**Closing:**\n*   Formal: *Best regards,* *Sincerely,*\n*   Informal: *Cheers,* *Thanks,*\n\n**Signature:**\n```\nKwame Mensah\nForm 2A\nAchimota Secondary School\n```\n\n**EMAIL TIPS:**\n*   ✓ Write clear subject lines\n*   ✓ Avoid text language (use proper English)\n*   ✓ Check for errors before sending\n*   ✓ Reply promptly\n*   ✓ Use professional email address"
                    },
                    {
                      title: "6. Memo (Memorandum)",
                      content: "**MEMO FORMAT:**\n\n```\nMEMORANDUM\n\nTO:       All Staff Members\nFROM:     The Headmaster\nDATE:     4th December, 2025\nSUBJECT:  Staff Meeting\n\nThis is to inform all teaching staff that there will be a compulsory staff meeting on Friday, 10th December, 2025, at 2:00 PM in the Conference Room.\n\nAgenda:\n1. Review of second term performance\n2. Preparation for final examinations\n3. Upcoming school events\n\nAll staff members are expected to attend punctually.\n\nThank you.\n\n[Signature]\nDr. K. Mensah\nHeadmaster\n```\n\n**KEY FEATURES:**\n*   ✓ Internal communication (within organization)\n*   ✓ No addresses needed\n*   ✓ Clear TO, FROM, DATE, SUBJECT\n*   ✓ Direct and brief\n*   ✓ Professional tone"
                    },
                    {
                      title: "7. Report Writing",
                      content: "**REPORT FORMAT:**\n\n**TITLE:** Report on [Subject]\n**Prepared by:** [Your Name]\n**Date:** 4th December, 2025\n\n**1. INTRODUCTION:**\n*   Purpose of the report\n*   Background information\n\n**2. FINDINGS/BODY:**\n*   Organized in logical sections\n*   Use headings and subheadings\n*   Present facts and observations\n*   May include data, statistics\n\n**3. CONCLUSION:**\n*   Summary of findings\n\n**4. RECOMMENDATIONS:** (if required)\n*   Suggestions for action\n*   Proposals for improvement\n\n**TYPES OF REPORTS:**\n*   Accident reports\n*   Event reports (excursions, meetings)\n*   Progress reports\n*   Investigation reports\n\n**REPORT TIPS:**\n*   ✓ Be objective and factual\n*   ✓ Use past tense for events\n*   ✓ Be clear and organized\n*   ✓ Include relevant details only"
                    },
                    {
                      title: "8. Speech Writing",
                      content: "**SPEECH FORMAT:**\n\n**Opening:**\n```\nThe Chairman, Distinguished Guests, Teachers, and Fellow Students,\n\nGood morning!\n```\n\n**Introduction:**\n*   Greet the audience\n*   Introduce yourself (if necessary)\n*   State your topic clearly\n\n**Body:**\n*   Develop your points logically\n*   Use examples and illustrations\n*   Engage the audience\n\n**Conclusion:**\n*   Summarize main points\n*   Call to action (if appropriate)\n*   Thank the audience\n\n**Closing:**\n```\nThank you for your attention.\n```\n\n**SPEECH TIPS:**\n*   ✓ Know your audience\n*   ✓ Use appropriate tone and language\n*   ✓ Be confident and clear\n*   ✓ Use rhetorical questions\n*   ✓ Include relevant quotes or proverbs\n*   ✓ Practice beforehand"
                    },
                  ],
                  activities: {
                    type: "exercises",
                    exercises: [
                      {
                        title: "Exercise 1: Identify the Letter Type",
                        instructions: "State whether each scenario requires a FORMAL or INFORMAL letter.",
                        questions: [
                          { question: "Writing to your uncle to thank him for a gift", answer: "Informal" },
                          { question: "Applying for a school prefect position", answer: "Formal" },
                          { question: "Complaining to the manager of a shop about poor service", answer: "Formal" },
                          { question: "Writing to a friend about your holiday experience", answer: "Informal" },
                          { question: "Requesting permission from the principal to organize an event", answer: "Formal" },
                          { question: "Inviting your cousin to visit you during vacation", answer: "Informal" },
                        ],
                      },
                      {
                        title: "Exercise 2: Correct the Format Errors",
                        instructions: "Identify what is wrong with each statement about functional writing format.",
                        questions: [
                          { question: "In a formal letter, you should use 'Yours lovingly' as the closing.", answer: "Wrong. Use 'Yours faithfully' or 'Yours sincerely' in formal letters." },
                          { question: "An email does not need a subject line.", answer: "Wrong. A clear subject line is essential in emails." },
                          { question: "A notice should include the recipient's full address.", answer: "Wrong. Notices don't include individual addresses; they're for general information." },
                          { question: "In a memo, you need to write the full address of the sender.", answer: "Wrong. Memos only need TO, FROM, DATE, and SUBJECT fields." },
                        ],
                      },
                      {
                        title: "Exercise 3: Match the Closing to the Letter Type",
                        instructions: "Match each closing phrase to its appropriate letter type.",
                        questions: [
                          { question: "Yours faithfully", answer: "Formal letter (when you don't know the person's name)" },
                          { question: "With love", answer: "Informal letter" },
                          { question: "Best regards", answer: "Email (formal)" },
                          { question: "Yours sincerely", answer: "Formal letter (when you know the person's name)" },
                          { question: "Your friend", answer: "Informal letter" },
                        ],
                      },
                    ],
                  },
                  pastQuestions: [
                    {
                      year: "2020",
                      question: "In a formal letter, if you begin with 'Dear Sir,' you should end with:",
                      options: ["Yours sincerely", "Yours faithfully", "With love", "Best wishes"],
                      answer: "Yours faithfully",
                      explanation: "When you start a formal letter with 'Dear Sir' or 'Dear Madam' (not using a specific name), you must end with 'Yours faithfully'."
                    },
                    {
                      year: "2019",
                      question: "Which of the following is NOT included in a notice?",
                      options: ["Date", "Title", "Recipient's address", "Signature"],
                      answer: "Recipient's address",
                      explanation: "Notices are for general information and don't include individual recipients' addresses."
                    },
                    {
                      year: "2018",
                      question: "The closing 'Yours sincerely' is used when:",
                      options: [
                        "You don't know the recipient",
                        "You know the recipient's name",
                        "Writing to a friend",
                        "Writing a notice"
                      ],
                      answer: "You know the recipient's name",
                      explanation: "'Yours sincerely' is used in formal letters when you've addressed the person by name (e.g., 'Dear Mr. Smith')."
                    },
                    {
                      year: "2017",
                      question: "A memo is used for:",
                      options: [
                        "Communication between organizations",
                        "Internal communication within an organization",
                        "Personal messages",
                        "Public announcements"
                      ],
                      answer: "Internal communication within an organization",
                      explanation: "Memos are brief messages used for internal communication within the same organization."
                    },
                    {
                      year: "2016",
                      question: "In an informal letter, which of these closings is appropriate?",
                      options: ["Yours faithfully", "Yours lovingly", "Yours sincerely", "Best regards"],
                      answer: "Yours lovingly",
                      explanation: "Informal letters use warm, personal closings like 'Yours lovingly', 'With love', or 'Your friend'."
                    },
                    {
                      year: "2015",
                      question: "Which part comes immediately after the salutation in a formal letter?",
                      options: ["Your address", "Subject/Title", "Date", "Closing"],
                      answer: "Subject/Title",
                      explanation: "After 'Dear Sir/Madam', you typically write the subject or title of the letter before starting the body."
                    },
                    {
                      year: "2014",
                      question: "The main purpose of a report is to:",
                      options: [
                        "Entertain readers",
                        "Present factual information",
                        "Express personal opinions",
                        "Tell a story"
                      ],
                      answer: "Present factual information",
                      explanation: "Reports are objective documents that present facts, findings, and information about a particular topic or event."
                    },
                    {
                      year: "2013",
                      question: "In email writing, what goes in the 'Subject' line?",
                      options: [
                        "Your full name",
                        "The recipient's address",
                        "A brief description of the email's content",
                        "The date"
                      ],
                      answer: "A brief description of the email's content",
                      explanation: "The subject line should clearly and briefly indicate what the email is about."
                    },
                  ],
                  summary: "In this lesson, you learned the essential formats and conventions for practical, real-world writing. You mastered **formal letters** (with proper structure and closings like 'Yours faithfully'), **informal letters** (more personal with closings like 'With love'), **notices and circulars** (for announcements), **emails** (brief and professional), **memos** (internal communication), **reports** (factual presentation), and **speeches** (engaging audience communication). Each type has specific formats, appropriate tone, and conventions. Mastering functional writing is crucial for BECE success and for effective communication in school, work, and everyday life.",
                  endOfLessonQuiz: [
                    {
                      type: "mcq",
                      question: "If you start a formal letter with 'Dear Sir,' you should end with:",
                      options: ["Yours sincerely", "Yours faithfully", "With love", "Best regards"],
                      answer: "Yours faithfully",
                      explanation: "Use 'Yours faithfully' when you address someone as 'Dear Sir/Madam' without using their name."
                    },
                    {
                      type: "matching",
                      question: "Match each document type to its primary purpose:",
                      pairs: [
                        { left: "Notice", right: "General announcement" },
                        { left: "Memo", right: "Internal communication" },
                        { left: "Report", right: "Present facts and findings" },
                        { left: "Formal letter", right: "Official communication" },
                      ],
                      explanation: "Each functional writing type serves a specific purpose in communication."
                    },
                    {
                      type: "fillblank",
                      sentence: "In a formal letter, if you address someone as 'Dear Mr. Mensah,' you should close with 'Yours _____.'",
                      answer: "sincerely",
                      explanation: "Use 'Yours sincerely' when you've used the recipient's name in the salutation."
                    },
                    {
                      type: "truefalse",
                      statement: "An informal letter requires the recipient's address to be written.",
                      answer: "false",
                      reason: "False. Informal letters only need your address and the date. The recipient's address is not included."
                    },
                    {
                      type: "multiselect",
                      question: "Which of these are appropriate closings for an informal letter?",
                      options: [
                        "Yours faithfully",
                        "With love",
                        "Your friend",
                        "Best wishes"
                      ],
                      answers: ["With love", "Your friend", "Best wishes"],
                      explanation: "Informal letters use warm, personal closings. 'Yours faithfully' is only for formal letters."
                    },
                    {
                      type: "fillblank",
                      sentence: "A _____ is used for brief internal communication within an organization.",
                      answer: "memo",
                      alternatives: ["memorandum"],
                      explanation: "A memo (memorandum) is for internal communication and doesn't require addresses."
                    },
                    {
                      type: "mcq",
                      question: "Which of these is NOT typically included in a notice?",
                      options: ["Date", "Title", "Individual recipient's address", "Signature"],
                      answer: "Individual recipient's address",
                      explanation: "Notices are for general information and don't include individual addresses."
                    },
                    {
                      type: "matching",
                      question: "Match the letter type to the appropriate closing:",
                      pairs: [
                        { left: "Formal (name unknown)", right: "Yours faithfully" },
                        { left: "Formal (name known)", right: "Yours sincerely" },
                        { left: "Informal", right: "With love" },
                        { left: "Email (formal)", right: "Best regards" },
                      ],
                      explanation: "Different types of correspondence require different closing phrases."
                    },
                    {
                      type: "truefalse",
                      statement: "Reports should include personal opinions and feelings about the topic.",
                      answer: "false",
                      reason: "False. Reports should be objective and factual, presenting information without personal bias."
                    },
                    {
                      type: "fillblank",
                      sentence: "The _____ line in an email should clearly indicate what the email is about.",
                      answer: "subject",
                      explanation: "The subject line gives a brief, clear description of the email's content."
                    },
                    {
                      type: "multiselect",
                      question: "Which elements are required in a formal letter?",
                      options: [
                        "Your address",
                        "Recipient's address",
                        "Date",
                        "Funny jokes"
                      ],
                      answers: ["Your address", "Recipient's address", "Date"],
                      explanation: "Formal letters must include both addresses and the date. Jokes are not appropriate in formal letters."
                    },
                    {
                      type: "mcq",
                      question: "A speech should typically end with:",
                      options: [
                        "A complaint",
                        "Thanking the audience",
                        "Your address",
                        "A new topic"
                      ],
                      answer: "Thanking the audience",
                      explanation: "Speeches should end politely by thanking the audience for their attention."
                    },
                    {
                      type: "truefalse",
                      statement: "You can use text language and abbreviations like 'u' and 'btw' in formal emails.",
                      answer: "false",
                      reason: "False. Formal emails require proper English. Text language is only acceptable in very informal personal messages."
                    },
                    {
                      type: "fillblank",
                      sentence: "In a formal letter, your _____ should be written in the top right corner.",
                      answer: "address",
                      explanation: "Your address goes at the top right of a formal letter, followed by the date."
                    },
                    {
                      type: "mcq",
                      question: "What is the main difference between a notice and a circular?",
                      options: [
                        "Notices are longer",
                        "Circulars are sent to specific people",
                        "Notices require signatures",
                        "Circulars don't need dates"
                      ],
                      answer: "Circulars are sent to specific people",
                      explanation: "While both inform, circulars are typically sent to specific individuals or groups, while notices are general public announcements."
                    },
                  ],
                },
            ];
          },
          {
            id: 'eng203',
            slug: 'literature-2',
            title: 'Literature',
            lessons: [
                { 
                  id: 'eng203-1', 
                  slug: 'prose', 
                  title: 'Prose (Short Stories)', 
                  objectives: [
                    'Define Prose and distinguish it from Poetry and Drama.',
                    'Differentiate between Fiction (made-up) and Non-Fiction (real).',
                    'Identify the key elements of a story: Plot, Character, Setting, Theme, and Point of View.',
                    'Analyze the stages of a Plot: Exposition, Rising Action, Climax, Falling Action, and Resolution.',
                    'Distinguish between First Person and Third Person Point of View.',
                    'Read and understand a short story to answer comprehension questions.'
                  ],
                  introduction: 'Everyone loves a good story. Whether it is a Ananse story told by a grandparent, a novel like "The Cockcrow," or a true account of Ghana\'s independence, these are all examples of **Prose**.\n\nProse is the ordinary form of written language. It is not poetry (which uses verses and stanzas) and it is not drama (which uses a script). Prose is written in **sentences** and **paragraphs**. It is the language we use in textbooks, newspapers, emails, and novels.\n\nIn this lesson, we will focus on **Fiction Prose**, specifically the Short Story. We will learn how authors build worlds using characters, settings, and plots. Understanding these elements will not only help you pass your literature exams but also help you understand the stories of the people around you in real life.',
                  keyConcepts: [
                    {
                      title: '1. Fiction vs. Non-Fiction',
                      content: 'Prose is divided into two main families:\n\n- **Fiction:** Stories that are made up by the author. They may be realistic, but they did not actually happen.\n  - *Examples:* Novels, Short Stories, Myths, Legends (e.g., *Oliver Twist*, *Ananse and the Pot of Wisdom*).\n\n- **Non-Fiction:** Writing that is based on real facts, real people, and real events.\n  - *Examples:* Biographies, Autobiographies, History books, Newspaper articles.'
                    },
                    {
                      title: '2. The Elements of a Story',
                      content: 'Every good story has five key ingredients:\n\n1.  **Plot:** The series of events that make up the story. (What happens?)\n2.  **Characters:** The people, animals, or creatures in the story. (Who is it about?)\n3.  **Setting:** The time and place where the story happens. (Where and when?)\n4.  **Theme:** The main idea or moral lesson of the story. (What does it mean?)\n5.  **Point of View:** The perspective from which the story is told. (Who is telling it?)'
                    },
                    {
                      title: '3. The Plot Diagram',
                      content: 'Most stories follow a mountain-shaped pattern called the Plot Diagram:\n\n1.  **Exposition (Introduction):** Introduces the characters and setting.\n2.  **Rising Action:** The conflict (problem) begins and gets worse. Tension builds.\n3.  **Climax:** The turning point. The most exciting part where the character faces the problem.\n4.  **Falling Action:** The events after the climax. Things start to calm down.\n5.  **Resolution (Conclusion):** The problem is solved (happily or sadly), and the story ends.'
                    },
                    {
                      title: '4. Point of View (POV)',
                      content: 'Who is telling the story?\n\n- **First Person POV:** The narrator is a character *in* the story. Uses "I," "me," "we."\n  - *Example:* "I walked down the dusty road and saw my friend."\n\n- **Third Person POV:** The narrator is an outsider looking in. Uses "he," "she," "they," or names.\n  - *Example:* "Kofi walked down the dusty road and saw his friend."'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'reading_comprehension',
                            question: 'Read the short passage and answer the questions:\n\n"Kwame looked at the broken vase on the floor. His heart beat faster. He knew his mother loved that vase. It was a gift from her grandmother. He quickly grabbed a broom and started sweeping the pieces, hoping to hide them before she came home from the market. Suddenly, the front door creaked open."\n\n1. What is the **Setting** (Place)?\n2. Who is the main **Character**?\n3. What is the **Conflict**?\n4. What **Point of View** is used?',
                            solution: '1. Kwame\'s house (specifically the room with the vase).\n2. Kwame.\n3. Kwame has broken a valuable vase and is trying to hide it before his mother returns.\n4. Third Person Point of View (uses "Kwame," "He," "His").'
                        },
                        {
                            type: 'creative_writing',
                            question: 'Write a short paragraph (3-5 sentences) continuing the story above. Describe the **Climax** (what happens when the mother walks in).',
                            solution: '*Example Answer:*\nKwame froze as his mother walked into the room. Her eyes went straight to the pile of broken glass. "My grandmother\'s vase!" she gasped, dropping her bag. Kwame looked down, tears filling his eyes, and whispered, "I\'m so sorry, Mama."'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'The sequence of events in a story is called the...',
                        options: ['A. Theme', 'B. Plot', 'C. Setting', 'D. Climax'],
                        solution: 'B. Plot'
                    },
                    {
                        question: 'A story told by a character using the pronoun "I" is written in the...',
                        options: ['A. Third person', 'B. Second person', 'C. First person', 'D. Omniscient view'],
                        solution: 'C. First person'
                    },
                    {
                        question: 'The time and place of the action in a story is the...',
                        options: ['A. Atmosphere', 'B. Setting', 'C. Plot', 'D. Mood'],
                        solution: 'B. Setting'
                    },
                    {
                        question: 'The main character in a story is often referred to as the...',
                        options: ['A. Antagonist', 'B. Villain', 'C. Protagonist', 'D. Narrator'],
                        solution: 'C. Protagonist'
                    },
                    {
                        question: 'Which of the following is NOT an example of prose fiction?',
                        options: ['A. Novel', 'B. Short Story', 'C. History Textbook', 'D. Legend'],
                        solution: 'C. History Textbook'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'What is the "Climax" of a story?',
                        options: [
                            'The beginning where characters are introduced.',
                            'The end where the problem is solved.',
                            'The turning point or most exciting moment.',
                            'The moral lesson of the story.'
                        ],
                        answer: 'The turning point or most exciting moment.',
                        explanation: 'The climax is the peak of the "story mountain" where the main conflict is faced.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'A biography (the story of a real person\'s life) is an example of Fiction.',
                        answer: 'false',
                        reason: 'A biography is based on facts and real events, so it is Non-Fiction.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the Story Element to its question.',
                        pairs: [
                            { left: 'Setting', right: 'Where and When?' },
                            { left: 'Character', right: 'Who?' },
                            { left: 'Plot', right: 'What happens?' },
                            { left: 'Theme', right: 'What does it mean?' },
                        ],
                        explanation: 'These are the four Ws (and one H) of storytelling.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sentence is written in the First Person Point of View?',
                        options: [
                            'She ran to the store.',
                            'They were happy to see the dog.',
                            'I felt nervous as I walked on stage.',
                            'Kwame ate his fufu quickly.'
                        ],
                        answer: 'I felt nervous as I walked on stage.',
                        explanation: 'First person uses "I", "me", "my", or "we".'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'The struggle or problem that the main character faces in a story is called the __________.',
                        answer: 'conflict',
                        explanation: 'Without conflict, there is no story. It drives the plot forward.'
                    },
                    {
                        type: 'mcq',
                        question: 'What is the "Resolution" of a story?',
                        options: [
                            'The introduction of the setting.',
                            'The highest point of tension.',
                            'The conclusion where loose ends are tied up.',
                            'The conversation between characters.'
                        ],
                        answer: 'The conclusion where loose ends are tied up.',
                        explanation: 'The resolution comes at the very end, after the falling action.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Select all the examples of Fiction.',
                        options: [
                            'A science textbook',
                            'A novel about space travel',
                            'A newspaper report on the election',
                            'A traditional folktale about Ananse'
                        ],
                        correctAnswers: ['A novel about space travel', 'A traditional folktale about Ananse'],
                        explanation: 'Fiction is imagined or made-up. Textbooks and newspapers are Non-Fiction (factual).'
                    },
                  ],
                  summary: 'In this lesson, we explored Prose, the ordinary language of storytelling. We distinguished between Fiction (imagined) and Non-Fiction (real). We broke down the essential elements of a story: Plot, Character, Setting, Theme, and Point of View. We also learned to map a story using the Plot Diagram, from Exposition to Resolution. These tools give us a roadmap to understand any story we read, helping us appreciate the writer\'s craft and the lessons embedded in the narrative.'
                },
                { 
                  id: 'eng203-2', 
                  slug: 'poetry', 
                  title: 'Poetry Appreciation', 
                  objectives: [
                    'Define Poetry and distinguish it from Prose and Drama.',
                    'Identify the structural elements of poetry: Verse (Line) and Stanza.',
                    'Understand and identify sound devices: Rhyme, Rhythm, and Alliteration.',
                    'Identify and explain the use of Imagery (sensory details).',
                    'Identify and interpret common Figures of Speech: Simile, Metaphor, and Personification.',
                    'Analyze a simple poem to determine its theme and mood.'
                  ],
                  introduction: 'Poetry is often described as "painting with words." While a novelist might take a whole page to describe a sunset, a poet might capture its beauty in just three powerful lines. Poetry is a form of literature that uses aesthetic and rhythmic qualities of language to evoke meanings.\n\nUnlike prose, which is written in sentences and paragraphs, poetry is written in **verses** (lines) and **stanzas**. It often uses sound (like rhyme and rhythm) and pictures (imagery) to make you *feel* something rather than just telling you facts. In this lesson, we will learn the "tools" poets use to build their masterpieces, so you can not only understand poems but enjoy them too.',
                  keyConcepts: [
                    {
                      title: '1. Structure: Verse and Stanza',
                      content: 'The way a poem looks on the page is unique.\n\n- **Verse (or Line):** A single line of words in a poem. It is like a sentence in prose, but it doesn\'t always follow grammar rules.\n- **Stanza:** A group of verses. It is like a paragraph in prose. Stanzas separate ideas or feelings in the poem.\n  - A 2-line stanza is a *Couplet*.\n  - A 4-line stanza is a *Quatrain*.'
                    },
                    {
                      title: '2. Sound Devices',
                      content: 'Poetry is meant to be heard. Poets use sound to create music with words.\n\n- **Rhyme:** When words have the same ending sound (e.g., c**at** / h**at**, sk**y** / fl**y**). Rhyme usually happens at the end of lines.\n- **Rhythm:** The "beat" or flow of the poem. It is the pattern of stressed and unstressed syllables (da-DUM, da-DUM).\n- **Alliteration:** The repetition of the same consonant sound at the beginning of words near each other.\n  - *Example:* **S**illy **s**nakes **s**lither **s**lowly.'
                    },
                    {
                      title: '3. Imagery',
                      content: 'Imagery is language that appeals to the five senses (sight, sound, smell, taste, touch). It helps the reader create a vivid picture in their mind.\n\n- *Sight:* The golden sun sank into the blue sea.\n- *Sound:* The bees buzzed busily.\n- *Touch:* The rough bark scratched my skin.'
                    },
                    {
                      title: '4. Figures of Speech',
                      content: 'Poets use figurative language to make comparisons and create deeper meaning.\n\n- **Simile:** Comparing two things using "like" or "as".\n  - *He is as brave as a lion.*\n- **Metaphor:** Comparing two things directly (saying one thing *is* another).\n  - *He is a lion in battle.*\n- **Personification:** Giving human qualities to non-human things.\n  - *The wind whispered my name.*'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'identification',
                            question: 'Identify the figure of speech in each sentence (Simile, Metaphor, Personification, or Alliteration).\n1. The stars danced in the night sky.\n2. Her smile is like sunshine.\n3. Peter Piper picked a peck of pickled peppers.\n4. The classroom was a zoo today.\n5. He ran as fast as a cheetah.',
                            solution: '1. Personification (Stars cannot dance)\n2. Simile (Uses "like")\n3. Alliteration (Repetition of "p")\n4. Metaphor (Direct comparison)\n5. Simile (Uses "as")'
                        },
                        {
                            type: 'creative_writing',
                            question: 'Write a short "Quatrain" (4-line stanza) about a rainy day. Try to use an AABB rhyme scheme (the first two lines rhyme, and the last two lines rhyme).',
                            solution: '*Example Answer:*\nThe rain falls down on the ground, (A)\nMaking a soft and splashing sound. (A)\nI stay inside and read my book, (B)\nWhile sitting in my cozy nook. (B)'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'The repetition of the same sound at the beginning of words in a line of poetry is called...',
                        options: ['A. Rhyme', 'B. Rhythm', 'C. Alliteration', 'D. Assonance'],
                        solution: 'C. Alliteration'
                    },
                    {
                        question: '"The moon played hide and seek with the clouds" is an example of...',
                        options: ['A. Simile', 'B. Metaphor', 'C. Personification', 'D. Irony'],
                        solution: 'C. Personification'
                    },
                    {
                        question: 'A group of lines in a poem is known as a...',
                        options: ['A. Paragraph', 'B. Stanza', 'C. Chapter', 'D. Phrase'],
                        solution: 'B. Stanza'
                    },
                    {
                        question: 'Which of the following contains a simile?',
                        options: ['A. Life is a dream.', 'B. He is a giant.', 'C. She sings like an angel.', 'D. The sun smiled at us.'],
                        solution: 'C. She sings like an angel.'
                    },
                    {
                        question: 'The main message or central idea of a poem is its...',
                        options: ['A. Subject matter', 'B. Theme', 'C. Mood', 'D. Tone'],
                        solution: 'B. Theme'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'What is the difference between a verse and a stanza?',
                        options: [
                            'A verse is a group of lines; a stanza is a single line.',
                            'A verse is a single line; a stanza is a group of lines.',
                            'There is no difference.',
                            'A verse rhymes, but a stanza does not.'
                        ],
                        answer: 'A verse is a single line; a stanza is a group of lines.',
                        explanation: 'Think of a verse as a sentence and a stanza as a paragraph.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the Figure of Speech to its example.',
                        pairs: [
                            { left: 'Simile', right: 'As cool as a cucumber' },
                            { left: 'Metaphor', right: 'Time is money' },
                            { left: 'Personification', right: 'The flowers nodded their heads' },
                            { left: 'Alliteration', right: 'Big bad bear' },
                        ],
                        explanation: 'Similes use "like/as", Metaphors say "is", Personification gives life, Alliteration repeats sounds.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which sense is appealed to in the line: "The aroma of fresh bread filled the air"?',
                        options: ['Sight', 'Sound', 'Smell', 'Touch'],
                        answer: 'Smell',
                        explanation: 'Aroma refers to a smell or scent.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'A poem must always rhyme.',
                        answer: 'false',
                        reason: 'Many modern poems do not rhyme. This is called "Free Verse".'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'Comparing two things using the words "like" or "as" is called a __________.',
                        answer: 'simile',
                        explanation: 'This is the defining feature of a simile.'
                    },
                    {
                        type: 'mcq',
                        question: 'What is "Imagery"?',
                        options: [
                            'Pictures in a book.',
                            'Language that appeals to the five senses.',
                            'The rhythm of the poem.',
                            'The title of the poem.'
                        ],
                        answer: 'Language that appeals to the five senses.',
                        explanation: 'Imagery uses words to create pictures (and sounds, smells, etc.) in the reader\'s mind.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Select all the examples of Alliteration.',
                        options: [
                            'Seven silver swans swam silently.',
                            'The cat sat on the mat.',
                            'Busy bees buzz.',
                            'Red roses are beautiful.'
                        ],
                        correctAnswers: ['Seven silver swans swam silently.', 'Busy bees buzz.'],
                        explanation: 'Alliteration requires the repetition of the *initial* consonant sound (S... s... s... / B... b... b...).'
                    },
                  ],
                  summary: 'In this lesson, we learned to appreciate Poetry as a unique form of literature. We explored its structure (verses and stanzas) and the tools poets use to create beauty and meaning. We learned about sound devices like Rhyme, Rhythm, and Alliteration, and how Imagery appeals to our senses. Finally, we mastered the three most common figures of speech: Simile, Metaphor, and Personification. Understanding these elements unlocks the deeper meaning of poems and makes reading them a richer experience.'
                },
                { 
                  id: 'eng203-3', 
                  slug: 'drama', 
                  title: 'Drama (Dialogues & Roleplay)', 
                  objectives: [
                    'Define Drama and distinguish it from Prose and Poetry.',
                    'Identify the key elements of drama: Plot, Character, Setting, Dialogue, and Theme.',
                    'Understand the function and importance of Stage Directions.',
                    'Analyze how Dialogue reveals character traits and advances the plot.',
                    'Format a script correctly (character names, colons, stage directions).',
                    'Write a short dramatic scene based on a prompt.'
                  ],
                  introduction: 'Have you ever watched a movie, a TV show, or a play at the National Theatre? If so, you have experienced **Drama**. Unlike a novel (Prose) where a narrator tells you the story, or a poem (Poetry) which focuses on feelings and imagery, Drama is literature written to be **performed**.\n\nIn Drama, the story is told entirely through the **actions** and **speech** (dialogue) of the characters. The writer, called a **playwright**, creates a script that actors bring to life on a stage. This makes Drama unique because it is meant to be seen and heard, not just read silently.\n\nIn this lesson, we will look behind the curtain to see how drama works. We will learn how to read a script, understand the instructions given to actors (stage directions), and even write our own short scenes. Whether you want to be an actor, a director, or just a better student of literature, understanding drama is essential.',
                  keyConcepts: [
                    {
                      title: '1. The Elements of Drama',
                      content: 'Just like a building has bricks and cement, a play has specific elements that hold it together:\n\n- **Plot:** The sequence of events. What happens first, next, and last?\n- **Characters:** The people (or animals/creatures) in the play. The main character is the *Protagonist*, and the one opposing them is the *Antagonist*.\n- **Setting:** The time and place where the action occurs (e.g., "A classroom in Accra, 1957").\n- **Theme:** The central idea or message of the play (e.g., "Honesty is the best policy").\n- **Audience:** The people watching the performance. Drama needs an audience to be complete.'
                    },
                    {
                      title: '2. Dialogue: The Heart of Drama',
                      content: '**Dialogue** is the conversation between characters. In a novel, you might read: *"He was an angry man."* In a play, you have to *hear* his anger through his words.\n\nDialogue serves two main purposes:\n1.  **Reveals Character:** What a character says (and how they say it) tells us if they are kind, cruel, smart, or foolish.\n2.  **Advances the Plot:** Dialogue moves the story forward. Characters make plans, argue, or reveal secrets through talking.'
                    },
                    {
                      title: '3. Stage Directions',
                      content: 'Since there is no narrator to describe the action, the playwright uses **Stage Directions**. These are instructions for the actors and the director.\n\n- They are usually written in **italics** or inside **(brackets)**.\n- They tell actors:\n  - **Movement:** *[He walks to the window]*\n  - **Emotion:** *[She speaks tearfully]*\n  - **Sound effects:** *[A loud crash is heard]*\n\n*Example:*\n**KOFI:** [Angrily] Give me my book!\n**AMA:** [Laughing] Come and get it.'
                    },
                    {
                      title: '4. Script Format',
                      content: 'Writing a play is different from writing a story. You must follow a specific format:\n\n1.  **Character Names:** Written on the left side (or centered), followed by a colon (:).\n2.  **No Quotation Marks:** You do NOT use " " for speech in a script.\n3.  **Present Tense:** Stage directions are always written in the present tense (e.g., *He opens the door*, not *He opened the door*).'
                    },
                  ],
                  activities: {
                    type: 'exercises',
                    questions: [
                        {
                            type: 'script_writing',
                            question: 'Write a short script (4-6 lines) between a student and a teacher. The student is apologizing for coming to school late. Include at least one stage direction for each character.',
                            solution: '**TEACHER:** [Looking at his watch] You are thirty minutes late, Kwame. What is your excuse?\n\n**KWAME:** [Panting heavily] I am sorry, Sir. The trotro had a flat tire.\n\n**TEACHER:** [Sighs and points to a seat] Very well. Sit down quietly.\n\n**KWAME:** [Relieved] Thank you, Sir.'
                        },
                        {
                            type: 'identification',
                            question: 'Identify the element of drama described below:\n1. The instructions telling actors what to do.\n2. The person who writes the play.\n3. The conversation between characters.\n4. The main idea or message of the play.\n5. The place where the play is performed.',
                            solution: '1. Stage Directions\n2. Playwright\n3. Dialogue\n4. Theme\n5. Stage (or Theatre)'
                        },
                    ],
                  },
                  pastQuestions: [
                    {
                        question: 'The instructions given by a playwright to the actors in a script are called...',
                        options: ['A. Dialogue', 'B. Prologue', 'C. Stage Directions', 'D. Epilogue'],
                        solution: 'C. Stage Directions'
                    },
                    {
                        question: 'A speech made by a character when he is alone on stage to reveal his thoughts is a...',
                        options: ['A. Monologue', 'B. Soliloquy', 'C. Dialogue', 'D. Prologue'],
                        solution: 'B. Soliloquy'
                    },
                    {
                        question: 'The person who writes a play is called a...',
                        options: ['A. Poet', 'B. Novelist', 'C. Playwright', 'D. Director'],
                        solution: 'C. Playwright'
                    },
                    {
                        question: 'Which of the following is NOT a feature of drama?',
                        options: ['A. Acts and Scenes', 'B. Chapters', 'C. Cast', 'D. Costumes'],
                        solution: 'B. Chapters'
                    },
                    {
                        question: 'The conversation between two or more people in a play is known as...',
                        options: ['A. Soliloquy', 'B. Aside', 'C. Dialogue', 'D. Chorus'],
                        solution: 'C. Dialogue'
                    },
                  ],
                  endOfLessonQuiz: [
                    {
                        type: 'mcq',
                        question: 'What distinguishes Drama from Prose?',
                        options: [
                            'Drama uses chapters and paragraphs.',
                            'Drama is written primarily to be performed.',
                            'Drama has a narrator who explains everything.',
                            'Drama does not have a plot.'
                        ],
                        answer: 'Drama is written primarily to be performed.',
                        explanation: 'While prose is meant to be read, drama is meant to be seen and heard on a stage.'
                    },
                    {
                        type: 'mcq',
                        question: 'What are "Stage Directions"?',
                        options: [
                            'The lines the actors speak.',
                            'The list of characters in the play.',
                            'Instructions for actors on movement and expression.',
                            'The title of the play.'
                        ],
                        answer: 'Instructions for actors on movement and expression.',
                        explanation: 'Stage directions (often in italics or brackets) tell the actors what to do, not what to say.'
                    },
                    {
                        type: 'truefalse',
                        statement: 'In a script, you must use quotation marks (" ") around the words the characters speak.',
                        answer: 'false',
                        reason: 'Scripts do not use quotation marks. The character\'s name followed by a colon indicates who is speaking.'
                    },
                    {
                        type: 'matching',
                        question: 'Match the Drama term to its definition.',
                        pairs: [
                            { left: 'Playwright', right: 'The author of a play' },
                            { left: 'Cast', right: 'The group of actors performing' },
                            { left: 'Scene', right: 'A small division of a play' },
                            { left: 'Costume', right: 'Clothes worn by actors' },
                        ],
                        explanation: 'Understanding these terms helps you navigate the world of theatre.'
                    },
                    {
                        type: 'fillblank',
                        sentence: 'The main character in a play is called the __________, while the character who opposes them is the Antagonist.',
                        answer: 'protagonist',
                        explanation: 'The protagonist is the "hero" or central figure of the story.'
                    },
                    {
                        type: 'mcq',
                        question: 'Which of the following is an example of a Stage Direction?',
                        options: [
                            'KOFI: I am hungry.',
                            '[He walks slowly to the door]',
                            'The End',
                            'Act 1, Scene 2'
                        ],
                        answer: '[He walks slowly to the door]',
                        explanation: 'This describes an action, not speech, and is typically enclosed in brackets.'
                    },
                    {
                        type: 'shortanswer',
                        question: 'Why is dialogue important in a play?',
                        answer: 'Dialogue is important because it reveals the personality of the characters and moves the plot forward without the need for a narrator.',
                        explanation: 'Dialogue does the heavy lifting in drama—it tells the story and defines the people in it.'
                    },
                    {
                        type: 'multiple_select',
                        question: 'Select all the elements that are unique to Drama (compared to a novel).',
                        options: [
                            'Stage Directions',
                            'Cast List',
                            'Plot',
                            'Acts and Scenes'
                        ],
                        correctAnswers: ['Stage Directions', 'Cast List', 'Acts and Scenes'],
                        explanation: 'Novels also have plots, but Stage Directions, Cast Lists, and the division into Acts/Scenes are specific to the format of a play script.'
                    },
                  ],
                  summary: 'In this lesson, we explored the exciting world of Drama. We learned that drama is literature in action, driven by **Dialogue** and brought to life by actors. We identified the key elements: **Plot, Character, Setting, and Theme**. We also discovered the importance of **Stage Directions** in guiding the performance and learned the specific rules for formatting a script. Whether reading a play by Shakespeare or writing a skit for school, these tools will help you appreciate the art of storytelling on stage.'
                },
            ];
          },
           {
            id: 'eng204',
            slug: 'vocabulary-development-2',
            title: 'Vocabulary Development',
            lessons: [
                {
                  id: 'eng204-1',
                  slug: 'synonyms-antonyms',
                  title: 'Synonyms, Antonyms, Homonyms',
                  objectives: [
                    "Define and differentiate between synonyms, antonyms, and homonyms.",
                    "Identify synonyms and use them to improve vocabulary and avoid repetition.",
                    "Recognize and apply antonyms to show contrast in writing.",
                    "Distinguish between homophones, homographs, and homonyms with correct usage.",
                    "Apply knowledge of word relationships to answer BECE-style questions.",
                    "Enhance writing skills by using varied vocabulary through synonyms and antonyms."
                  ],
                  introduction: "Why use the same word over and over when English offers you hundreds of alternatives? Welcome to the world of **Synonyms, Antonyms, and Homonyms**—the building blocks of a rich vocabulary! In this lesson, you'll discover how words can be similar, opposite, or sound alike but mean different things. Whether you're writing an essay, reading a poem, or taking the BECE exam, understanding these word relationships will make you a more confident and skilled communicator.",
                  keyConcepts: [
                    {
                      title: "1. What are Synonyms?",
                      content: "**Synonyms** are words that have the same or nearly the same meaning.\n\n**Examples:**\n*   **Happy** = joyful, glad, cheerful, delighted, pleased\n*   **Big** = large, huge, enormous, gigantic, massive\n*   **Smart** = intelligent, clever, bright, brilliant, wise\n*   **Fast** = quick, rapid, swift, speedy\n*   **Beautiful** = pretty, lovely, attractive, gorgeous\n\n**Why Use Synonyms?**\n*   To avoid repetition in writing\n*   To make your language more interesting\n*   To express subtle differences in meaning\n*   To expand your vocabulary\n\n**Example in Context:**\n❌ *The house was big. The garden was big. The rooms were big.*\n✓ *The house was **large**. The garden was **spacious**. The rooms were **enormous**.*"
                    },
                    {
                      title: "2. What are Antonyms?",
                      content: "**Antonyms** are words that have opposite meanings.\n\n**Examples:**\n*   **Hot** ↔ cold\n*   **Happy** ↔ sad\n*   **Big** ↔ small\n*   **Fast** ↔ slow\n*   **Strong** ↔ weak\n*   **Day** ↔ night\n*   **Love** ↔ hate\n*   **Enter** ↔ exit\n\n**Types of Antonyms:**\n\n**1. Gradable Antonyms** (degrees between opposites):\n*   Hot → warm → cool → cold\n*   Huge → big → small → tiny\n\n**2. Complementary Antonyms** (no middle ground):\n*   Alive ↔ dead\n*   True ↔ false\n*   Male ↔ female\n\n**3. Relational Antonyms** (pairs that need each other):\n*   Teacher ↔ student\n*   Buy ↔ sell\n*   Parent ↔ child"
                    },
                    {
                      title: "3. What are Homonyms?",
                      content: "**Homonyms** are words that sound the same or are spelled the same but have different meanings.\n\n**Types of Homonyms:**\n\n**A. HOMOPHONES** (same sound, different spelling and meaning):\n*   **their** (belonging to them) / **there** (in that place) / **they're** (they are)\n*   **two** (number) / **to** (preposition) / **too** (also/excessive)\n*   **hear** (listen) / **here** (this place)\n*   **sea** (ocean) / **see** (look)\n*   **flour** (for baking) / **flower** (plant)\n*   **brake** (stop) / **break** (shatter)\n\n**B. HOMOGRAPHS** (same spelling, different meaning, sometimes different pronunciation):\n*   **lead** (to guide) / **lead** (a metal) [pronounced differently]\n*   **tear** (rip) / **tear** (from crying) [pronounced differently]\n*   **bow** (ribbon) / **bow** (bend forward) [pronounced differently]\n*   **bat** (animal) / **bat** (sports equipment) [same pronunciation]\n*   **bank** (financial institution) / **bank** (river edge) [same pronunciation]"
                    },
                    {
                      title: "4. Common Synonym Pairs",
                      content: "**VERBS:**\n*   **Begin** = start, commence, initiate\n*   **End** = finish, conclude, terminate, complete\n*   **Help** = assist, aid, support\n*   **Show** = display, demonstrate, exhibit\n*   **Build** = construct, create, erect\n\n**ADJECTIVES:**\n*   **Angry** = furious, mad, enraged, irritated\n*   **Brave** = courageous, bold, fearless, valiant\n*   **Difficult** = hard, challenging, tough, complex\n*   **Important** = significant, crucial, vital, essential\n*   **Rich** = wealthy, affluent, prosperous\n\n**NOUNS:**\n*   **Job** = work, occupation, profession, career\n*   **Friend** = companion, pal, buddy, mate\n*   **House** = home, residence, dwelling, abode"
                    },
                    {
                      title: "5. Common Antonym Pairs",
                      content: "**ADJECTIVES:**\n*   **Ancient** ↔ modern\n*   **Brave** ↔ cowardly\n*   **Careful** ↔ careless\n*   **Deep** ↔ shallow\n*   **Easy** ↔ difficult\n*   **Generous** ↔ selfish\n*   **Innocent** ↔ guilty\n*   **Polite** ↔ rude\n\n**VERBS:**\n*   **Accept** ↔ reject\n*   **Arrive** ↔ depart\n*   **Borrow** ↔ lend\n*   **Expand** ↔ contract\n*   **Remember** ↔ forget\n*   **Succeed** ↔ fail\n\n**NOUNS:**\n*   **Beginning** ↔ end\n*   **Friend** ↔ enemy\n*   **Victory** ↔ defeat\n*   **Question** ↔ answer"
                    },
                    {
                      title: "6. Tricky Homophones to Master",
                      content: "**COMMONLY CONFUSED:**\n\n1. **Their / There / They're**\n   *   Their = belonging to them (*Their house is big*)\n   *   There = in that place (*Put it there*)\n   *   They're = they are (*They're coming*)\n\n2. **Your / You're**\n   *   Your = belonging to you (*Your book*)\n   *   You're = you are (*You're smart*)\n\n3. **Its / It's**\n   *   Its = belonging to it (*The dog wagged its tail*)\n   *   It's = it is (*It's raining*)\n\n4. **Accept / Except**\n   *   Accept = to receive (*I accept your offer*)\n   *   Except = excluding (*Everyone except John*)\n\n5. **Affect / Effect**\n   *   Affect = to influence (verb) (*The rain will affect the game*)\n   *   Effect = result (noun) (*The effect was positive*)"
                    },
                    {
                      title: "7. Using Word Relationships in Writing",
                      content: "**Using SYNONYMS for Variety:**\n❌ *The man was happy. His wife was happy. Their children were happy.*\n✓ *The man was **delighted**. His wife was **joyful**. Their children were **cheerful**.*\n\n**Using ANTONYMS for Contrast:**\n✓ *The city was **noisy** and crowded, unlike the **quiet** and peaceful countryside.*\n✓ *She was **brave** in public but **timid** in private.*\n\n**Avoiding HOMOPHONE Errors:**\n❌ *I want to go their.*\n✓ *I want to go **there**.*\n\n❌ *Your going to pass the exam.*\n✓ ***You're** going to pass the exam.*\n\n**BECE Tip:** Always check your spelling of homophones—they're a common source of marks deduction!"
                    },
                  ],
                  activities: {
                    type: "exercises",
                    exercises: [
                      {
                        title: "Exercise 1: Find the Synonyms",
                        instructions: "Choose the word that is closest in meaning to the word in capitals.",
                        questions: [
                          { question: "HAPPY: (joyful, sad, angry, tired)", answer: "joyful" },
                          { question: "DIFFICULT: (easy, hard, simple, clear)", answer: "hard" },
                          { question: "BEGIN: (end, start, stop, finish)", answer: "start" },
                          { question: "BRAVE: (fearful, cowardly, courageous, weak)", answer: "courageous" },
                          { question: "FAST: (slow, quick, lazy, careful)", answer: "quick" },
                          { question: "SMART: (foolish, intelligent, dull, silly)", answer: "intelligent" },
                          { question: "BEAUTIFUL: (ugly, lovely, plain, ordinary)", answer: "lovely" },
                        ],
                      },
                      {
                        title: "Exercise 2: Identify Antonyms",
                        instructions: "Write the antonym (opposite) of each word.",
                        questions: [
                          { question: "Hot", answer: "Cold" },
                          { question: "Day", answer: "Night" },
                          { question: "Strong", answer: "Weak" },
                          { question: "Enter", answer: "Exit" },
                          { question: "Ancient", answer: "Modern" },
                          { question: "Accept", answer: "Reject" },
                          { question: "Generous", answer: "Selfish" },
                          { question: "Remember", answer: "Forget" },
                        ],
                      },
                      {
                        title: "Exercise 3: Correct the Homophone Errors",
                        instructions: "Identify and correct the homophone errors in these sentences.",
                        questions: [
                          { question: "I want to go their tomorrow.", answer: "I want to go there tomorrow." },
                          { question: "Your going to love this book.", answer: "You're going to love this book." },
                          { question: "The dog wagged it's tail.", answer: "The dog wagged its tail." },
                          { question: "I can here the music.", answer: "I can hear the music." },
                          { question: "Buy me too oranges.", answer: "Buy me two oranges." },
                          { question: "She has a knew dress.", answer: "She has a new dress." },
                        ],
                      },
                    ],
                  },
                  pastQuestions: [
                    {
                      year: "2020",
                      question: "Choose the word that is nearest in meaning to 'ENORMOUS':",
                      options: ["tiny", "huge", "small", "average"],
                      answer: "huge",
                      explanation: "'Enormous' means extremely large, so the nearest synonym is 'huge'."
                    },
                    {
                      year: "2019",
                      question: "The antonym of 'ANCIENT' is:",
                      options: ["old", "modern", "historic", "traditional"],
                      answer: "modern",
                      explanation: "'Ancient' means very old, so its opposite (antonym) is 'modern' which means current or recent."
                    },
                    {
                      year: "2018",
                      question: "Which pair contains homophones?",
                      options: ["big/large", "their/there", "happy/glad", "hot/cold"],
                      answer: "their/there",
                      explanation: "Homophones are words that sound the same but have different meanings and spellings. 'Their' and 'there' sound identical but mean different things."
                    },
                    {
                      year: "2017",
                      question: "A synonym for 'BRAVE' is:",
                      options: ["cowardly", "fearful", "courageous", "timid"],
                      answer: "courageous",
                      explanation: "'Brave' and 'courageous' both mean showing courage or fearlessness."
                    },
                    {
                      year: "2016",
                      question: "Choose the correct word: 'I can ___ the birds singing.' (hear/here)",
                      options: ["hear", "here", "heir", "hare"],
                      answer: "hear",
                      explanation: "'Hear' means to perceive sound with your ears. 'Here' refers to a place."
                    },
                    {
                      year: "2015",
                      question: "The opposite of 'ACCEPT' is:",
                      options: ["receive", "take", "reject", "welcome"],
                      answer: "reject",
                      explanation: "'Accept' means to agree to take something, while 'reject' means to refuse it."
                    },
                    {
                      year: "2014",
                      question: "Which word means the same as 'DIFFICULT'?",
                      options: ["easy", "hard", "simple", "clear"],
                      answer: "hard",
                      explanation: "'Difficult' and 'hard' are synonyms, both meaning not easy or requiring effort."
                    },
                    {
                      year: "2013",
                      question: "Fill in the blank: '_____ going to the market.' (Their/There/They're)",
                      options: ["Their", "There", "They're", "Thair"],
                      answer: "They're",
                      explanation: "'They're' is the contraction of 'they are', which fits this sentence. 'Their' shows possession, and 'there' indicates a place."
                    },
                  ],
                  summary: "In this lesson, you mastered three key word relationships: **Synonyms** (words with similar meanings like happy/joyful), **Antonyms** (words with opposite meanings like hot/cold), and **Homonyms** (words that sound or look alike but have different meanings, like their/there/they're). Understanding these relationships helps you write with variety, express contrasts clearly, and avoid common spelling errors—all essential for BECE success. Remember: synonyms add richness, antonyms create contrast, and mastering homophones shows attention to detail.",
                  endOfLessonQuiz: [
                    {
                      type: "fillblank",
                      sentence: "A synonym for 'happy' is _____.",
                      answer: "joyful",
                      alternatives: ["glad", "cheerful", "delighted", "pleased"],
                      explanation: "Synonyms are words with similar meanings. 'Joyful', 'glad', 'cheerful', etc. all mean happy."
                    },
                    {
                      type: "matching",
                      question: "Match each word to its antonym:",
                      pairs: [
                        { left: "hot", right: "cold" },
                        { left: "fast", right: "slow" },
                        { left: "strong", right: "weak" },
                        { left: "enter", right: "exit" },
                      ],
                      explanation: "Antonyms are words with opposite meanings."
                    },
                    {
                      type: "mcq",
                      question: "Which sentence uses 'their' correctly?",
                      options: [
                        "Their going to the park.",
                        "Put the book over their.",
                        "Their house is beautiful.",
                        "I saw them their yesterday."
                      ],
                      answer: "Their house is beautiful.",
                      explanation: "'Their' shows possession (belonging to them). The correct sentence is 'Their house is beautiful.'"
                    },
                    {
                      type: "fillblank",
                      sentence: "The antonym of 'day' is _____.",
                      answer: "night",
                      explanation: "Antonyms are opposites. Day and night are opposite times."
                    },
                    {
                      type: "truefalse",
                      statement: "Homophones are words that sound the same but have different meanings.",
                      answer: "true",
                      reason: "True. Homophones like 'hear/here' or 'two/to/too' sound identical but have different meanings and spellings."
                    },
                    {
                      type: "multiselect",
                      question: "Which of these are synonyms for 'big'?",
                      options: ["large", "small", "huge", "tiny", "enormous"],
                      answers: ["large", "huge", "enormous"],
                      explanation: "Synonyms have similar meanings. 'Large', 'huge', and 'enormous' all mean big. 'Small' and 'tiny' are antonyms."
                    },
                    {
                      type: "fillblank",
                      sentence: "I can _____ the music playing. (hear/here)",
                      answer: "hear",
                      explanation: "'Hear' means to perceive sound. 'Here' refers to a place."
                    },
                    {
                      type: "mcq",
                      question: "What is the antonym of 'brave'?",
                      options: ["courageous", "fearless", "cowardly", "bold"],
                      answer: "cowardly",
                      explanation: "'Brave' means courageous, so its opposite is 'cowardly' (lacking courage)."
                    },
                    {
                      type: "matching",
                      question: "Match each word to its synonym:",
                      pairs: [
                        { left: "smart", right: "intelligent" },
                        { left: "begin", right: "start" },
                        { left: "help", right: "assist" },
                        { left: "beautiful", right: "lovely" },
                      ],
                      explanation: "These word pairs have similar meanings and can often be used interchangeably."
                    },
                    {
                      type: "truefalse",
                      statement: "The words 'accept' and 'except' are homophones.",
                      answer: "true",
                      reason: "True. They sound similar (though not exactly the same in careful pronunciation) and are often confused, but have different meanings."
                    },
                    {
                      type: "fillblank",
                      sentence: "_____ coming to the party tonight. (Your/You're)",
                      answer: "You're",
                      explanation: "'You're' is the contraction of 'you are'. 'Your' shows possession."
                    },
                    {
                      type: "multiselect",
                      question: "Which pairs are antonyms?",
                      options: [
                        "hot/cold",
                        "happy/joyful",
                        "strong/weak",
                        "fast/quick"
                      ],
                      answers: ["hot/cold", "strong/weak"],
                      explanation: "Antonyms are opposites. 'Hot/cold' and 'strong/weak' are opposite pairs. 'Happy/joyful' and 'fast/quick' are synonyms."
                    },
                    {
                      type: "mcq",
                      question: "Which word is a synonym for 'difficult'?",
                      options: ["easy", "challenging", "simple", "clear"],
                      answer: "challenging",
                      explanation: "'Difficult' and 'challenging' both mean hard or requiring effort."
                    },
                    {
                      type: "fillblank",
                      sentence: "The dog wagged _____ tail happily. (its/it's)",
                      answer: "its",
                      explanation: "'Its' (without apostrophe) shows possession. 'It's' means 'it is'."
                    },
                    {
                      type: "truefalse",
                      statement: "Synonyms always have exactly the same meaning in every context.",
                      answer: "false",
                      reason: "False. While synonyms have similar meanings, they often have subtle differences. For example, 'happy' and 'ecstatic' are both positive emotions, but 'ecstatic' is much stronger."
                    },
                  ],
                },
                {
                  id: 'eng204-2',
                  slug: 'idioms-proverbs',
                  title: 'Idiomatic Expressions & Proverbs',
                  objectives: [
                    "Define idioms and proverbs and explain their functions in language.",
                    "Identify and interpret common English idioms in context.",
                    "Understand and explain African and Ghanaian proverbs.",
                    "Distinguish between idioms, proverbs, and literal language.",
                    "Apply idioms and proverbs appropriately in writing and speaking.",
                    "Analyze BECE examination questions on idiomatic expressions."
                  ],
                  introduction: "Have you ever heard someone say 'It's raining cats and dogs' and wondered where all the animals are? Or been told that 'A rolling stone gathers no moss'? Welcome to the fascinating world of **Idioms and Proverbs**! These colorful expressions add flavor to our language and carry the wisdom of generations. In this lesson, we'll explore how idioms paint pictures with words and how proverbs teach us life lessons—skills that will enrich your English and help you excel in BECE examinations.",
                  keyConcepts: [
                    {
                      title: "1. What are Idioms?",
                      content: "An **idiom** is a phrase or expression whose meaning cannot be understood from the individual words alone. The meaning is figurative, not literal.\n\n**Examples:**\n*   **Break a leg** = Good luck (not literally breaking your leg!)\n*   **Kick the bucket** = To die\n*   **Piece of cake** = Very easy\n*   **Cost an arm and a leg** = Very expensive\n*   **Spill the beans** = Reveal a secret\n\n**Key Point:** If you try to translate an idiom word-by-word, it won't make sense!"
                    },
                    {
                      title: "2. Common Idioms by Category",
                      content: "**IDIOMS ABOUT TIME:**\n*   **Once in a blue moon** = Very rarely\n*   **In the nick of time** = Just in time\n*   **Better late than never** = It's better to arrive/do something late than not at all\n*   **Kill time** = To spend time doing nothing important\n\n**IDIOMS ABOUT MONEY:**\n*   **Break the bank** = Cost too much money\n*   **Penny for your thoughts** = Asking what someone is thinking\n*   **On a shoestring budget** = With very little money\n\n**IDIOMS ABOUT SUCCESS/EFFORT:**\n*   **Go the extra mile** = Do more than required\n*   **Hit the nail on the head** = Be exactly right\n*   **Miss the boat** = Miss an opportunity\n*   **Back to square one** = Start over from the beginning"
                    },
                    {
                      title: "3. What are Proverbs?",
                      content: "A **proverb** is a short, traditional saying that expresses a general truth or piece of advice based on common sense or experience.\n\n**Characteristics:**\n*   Short and memorable\n*   Contains wisdom or advice\n*   Passed down through generations\n*   Often uses metaphor or comparison\n\n**Examples:**\n*   **A stitch in time saves nine** = Fix problems early before they get worse\n*   **Don't count your chickens before they hatch** = Don't assume success before it happens\n*   **Actions speak louder than words** = What you do is more important than what you say\n*   **The early bird catches the worm** = Those who act first get the best results"
                    },
                    {
                      title: "4. African and Ghanaian Proverbs",
                      content: "African proverbs are rich in wisdom and cultural heritage:\n\n**GHANAIAN/AKAN PROVERBS:**\n*   **\"If you want to speak to God, tell it to the wind\"** = Share your concerns openly\n*   **\"The ruin of a nation begins in the homes of its people\"** = Strong families build strong nations\n*   **\"One tree cannot make a forest\"** = Unity and teamwork are essential\n*   **\"The lizard that jumped from the high iroko tree said he would praise himself if no one else did\"** = Have confidence in your achievements\n\n**OTHER AFRICAN PROVERBS:**\n*   **\"A bird that flies off the earth and lands on an anthill is still on the ground\"** = Small changes don't mean progress\n*   **\"When the moon is shining, the cripple becomes hungry for a walk\"** = Opportunity motivates action\n*   **\"Smooth seas do not make skillful sailors\"** = Challenges build character"
                    },
                    {
                      title: "5. Idioms vs. Proverbs: Key Differences",
                      content: "| Feature | Idiom | Proverb |\n|---------|-------|----------|\n| **Purpose** | Add color to language | Give advice/wisdom |\n| **Meaning** | Figurative expression | Life lesson or truth |\n| **Form** | Phrase or short expression | Complete sentence |\n| **Example** | \"It's raining cats and dogs\" | \"Too many cooks spoil the broth\" |\n| **Usage** | Casual/descriptive | Teaching/advisory |\n\n**Remember:** Both are figurative, but proverbs teach while idioms describe!"
                    },
                    {
                      title: "6. More Common Idioms You Should Know",
                      content: "**ABOUT PROBLEMS/DIFFICULTIES:**\n*   **A blessing in disguise** = Something that seems bad but turns out good\n*   **Get out of hand** = Become uncontrollable\n*   **Add fuel to the fire** = Make a bad situation worse\n\n**ABOUT COMMUNICATION:**\n*   **Beat around the bush** = Avoid saying something directly\n*   **Get straight to the point** = Speak directly\n*   **Let the cat out of the bag** = Reveal a secret accidentally\n\n**ABOUT SITUATIONS:**\n*   **A drop in the ocean** = A very small amount compared to what's needed\n*   **Barking up the wrong tree** = Pursuing the wrong course\n*   **Bite off more than you can chew** = Take on more than you can handle"
                    },
                    {
                      title: "7. Using Idioms and Proverbs Effectively",
                      content: "**DO:**\n*   ✓ Use them to make your writing more interesting\n*   ✓ Make sure the context is appropriate\n*   ✓ Explain unfamiliar ones to your audience\n*   ✓ Use them in essays, speeches, and creative writing\n\n**DON'T:**\n*   ✗ Overuse them (1-2 per composition is enough)\n*   ✗ Mix up the words (it's 'piece of cake,' not 'slice of cake')\n*   ✗ Use idioms in formal academic writing\n*   ✗ Create your own idioms—use established ones\n\n**Example in an Essay:**\n\"My grandmother always said, 'The early bird catches the worm,' and she was right. By starting my revision early, I had **a head start** over my classmates and achieved excellent results.\""
                    },
                  ],
                  activities: {
                    type: "exercises",
                    exercises: [
                      {
                        title: "Exercise 1: Match the Idiom to Its Meaning",
                        instructions: "Match each idiom with its correct meaning.",
                        questions: [
                          { question: "A piece of cake", answer: "Very easy to do" },
                          { question: "Cost an arm and a leg", answer: "Very expensive" },
                          { question: "Break the ice", answer: "Start a conversation in a social setting" },
                          { question: "Hit the books", answer: "Study hard" },
                          { question: "Spill the beans", answer: "Reveal a secret" },
                          { question: "Under the weather", answer: "Feeling sick" },
                          { question: "Once in a blue moon", answer: "Very rarely" },
                        ],
                      },
                      {
                        title: "Exercise 2: Complete with the Correct Proverb",
                        instructions: "Choose the appropriate proverb to complete each situation.",
                        questions: [
                          { question: "John started studying one day before the exam and failed. His teacher reminded him: '___________'", answer: "The early bird catches the worm" },
                          { question: "Mary talks about helping the poor but never does anything. Remember: '___________'", answer: "Actions speak louder than words" },
                          { question: "The students were celebrating before receiving their results. The teacher warned: '___________'", answer: "Don't count your chickens before they hatch" },
                          { question: "When Kofi noticed a small crack in the roof, his father said: '___________'", answer: "A stitch in time saves nine" },
                          { question: "Ama tried to do all her homework, chores, and club activities alone. Her mother advised: '___________'", answer: "Many hands make light work" },
                        ],
                      },
                      {
                        title: "Exercise 3: Explain the Meaning",
                        instructions: "Explain what each expression means in your own words.",
                        questions: [
                          { question: "What does 'beating around the bush' mean?", answer: "Avoiding the main topic or not speaking directly about something" },
                          { question: "Explain: 'Don't put all your eggs in one basket'", answer: "Don't risk everything on a single plan or option; diversify your efforts" },
                          { question: "What does the proverb 'Too many cooks spoil the broth' teach us?", answer: "Having too many people involved in a task can lead to confusion and poor results" },
                          { question: "What does 'let sleeping dogs lie' mean?", answer: "Don't disturb a situation that is currently causing no problems" },
                        ],
                      },
                    ],
                  },
                  pastQuestions: [
                    {
                      year: "2020",
                      question: "The expression 'to beat about the bush' means to",
                      options: [
                        "destroy the bushes",
                        "avoid the main issue",
                        "be aggressive",
                        "search for something"
                      ],
                      answer: "avoid the main issue",
                      explanation: "'Beat about the bush' means to avoid talking directly about something or to avoid the main point."
                    },
                    {
                      year: "2019",
                      question: "Which of the following best explains the proverb 'A stitch in time saves nine'?",
                      options: [
                        "Time is precious",
                        "Early action prevents bigger problems",
                        "Sewing is important",
                        "Nine is better than one"
                      ],
                      answer: "Early action prevents bigger problems",
                      explanation: "This proverb means that fixing a small problem early prevents it from becoming a much bigger problem later."
                    },
                    {
                      year: "2018",
                      question: "The idiom 'to let the cat out of the bag' means to",
                      options: [
                        "free an animal",
                        "reveal a secret",
                        "create confusion",
                        "make a mistake"
                      ],
                      answer: "reveal a secret",
                      explanation: "'Let the cat out of the bag' means to accidentally reveal information that was supposed to be kept secret."
                    },
                    {
                      year: "2017",
                      question: "When we say someone is 'under the weather,' we mean they are",
                      options: [
                        "standing in the rain",
                        "feeling sick",
                        "feeling cold",
                        "outdoors"
                      ],
                      answer: "feeling sick",
                      explanation: "'Under the weather' is an idiom meaning to feel ill or unwell."
                    },
                    {
                      year: "2016",
                      question: "The proverb 'Actions speak louder than words' means",
                      options: [
                        "Shouting is more effective than speaking",
                        "What people do is more important than what they say",
                        "Silence is golden",
                        "Words are meaningless"
                      ],
                      answer: "What people do is more important than what they say",
                      explanation: "This proverb emphasizes that a person's actions are a better indication of their character than their promises or statements."
                    },
                    {
                      year: "2015",
                      question: "'Once in a blue moon' means",
                      options: [
                        "every night",
                        "very rarely",
                        "during full moon",
                        "every month"
                      ],
                      answer: "very rarely",
                      explanation: "'Once in a blue moon' is an idiom meaning something that happens very infrequently or almost never."
                    },
                    {
                      year: "2014",
                      question: "The expression 'to add fuel to the fire' means to",
                      options: [
                        "cook food",
                        "make a situation worse",
                        "help someone",
                        "start a fire"
                      ],
                      answer: "make a situation worse",
                      explanation: "This idiom means to do or say something that makes a bad situation even worse."
                    },
                    {
                      year: "2013",
                      question: "What does the proverb 'Too many cooks spoil the broth' mean?",
                      options: [
                        "Chefs should work alone",
                        "Too much food is wasteful",
                        "Too many people managing something leads to poor results",
                        "Cooking requires many people"
                      ],
                      answer: "Too many people managing something leads to poor results",
                      explanation: "This proverb warns that when too many people try to control or direct something, the result is often confusion and failure."
                    },
                  ],
                  summary: "In this lesson, you learned that **idioms** are figurative expressions that add color to language (like 'piece of cake' for something easy), while **proverbs** are wise sayings that teach life lessons (like 'Actions speak louder than words'). We explored common English idioms, African and Ghanaian proverbs, and how to use these expressions appropriately in your writing and speaking. Mastering idioms and proverbs will help you understand English literature better and express yourself more naturally—essential skills for BECE success.",
                  endOfLessonQuiz: [
                    {
                      type: "fillblank",
                      sentence: "The test was a _____ of cake for Mary because she studied hard.",
                      answer: "piece",
                      explanation: "'Piece of cake' is an idiom meaning something is very easy to do."
                    },
                    {
                      type: "matching",
                      question: "Match each idiom to its correct meaning:",
                      pairs: [
                        { left: "cost an arm and a leg", right: "very expensive" },
                        { left: "break the ice", right: "start a conversation" },
                        { left: "spill the beans", right: "reveal a secret" },
                        { left: "under the weather", right: "feeling sick" },
                      ],
                      explanation: "These are common idioms used in everyday English conversation."
                    },
                    {
                      type: "mcq",
                      question: "What does 'beat around the bush' mean?",
                      options: ["cut down trees", "avoid the main topic", "run in circles", "make noise"],
                      answer: "avoid the main topic",
                      explanation: "'Beat around the bush' means to avoid talking directly about something or to avoid the main point."
                    },
                    {
                      type: "truefalse",
                      statement: "Idioms have literal meanings that can be understood from the individual words.",
                      answer: "false",
                      reason: "False. Idioms have figurative meanings that cannot be understood from the individual words alone. For example, 'kick the bucket' doesn't mean literally kicking a bucket."
                    },
                    {
                      type: "fillblank",
                      sentence: "The proverb says: 'The early bird _____ the worm.'",
                      answer: "catches",
                      explanation: "This proverb means that people who act early or arrive first get the best opportunities."
                    },
                    {
                      type: "multiselect",
                      question: "Which of these are proverbs (not idioms)?",
                      options: [
                        "Actions speak louder than words",
                        "It's raining cats and dogs",
                        "A stitch in time saves nine",
                        "Piece of cake"
                      ],
                      answers: ["Actions speak louder than words", "A stitch in time saves nine"],
                      explanation: "Proverbs give advice or teach lessons, while idioms are figurative expressions. Options 2 and 4 are idioms."
                    },
                    {
                      type: "mcq",
                      question: "The African proverb 'One tree cannot make a forest' teaches us about:",
                      options: ["forestry", "the importance of unity", "planting trees", "nature conservation"],
                      answer: "the importance of unity",
                      explanation: "This proverb emphasizes that cooperation and working together are essential for success."
                    },
                    {
                      type: "fillblank",
                      sentence: "Don't count your chickens before they _____.",
                      answer: "hatch",
                      explanation: "This proverb warns against assuming success before it actually happens."
                    },
                    {
                      type: "truefalse",
                      statement: "Proverbs and idioms are the same thing.",
                      answer: "false",
                      reason: "False. While both are figurative, proverbs teach lessons and give advice (e.g., 'Actions speak louder than words'), while idioms are expressions with figurative meanings (e.g., 'piece of cake')."
                    },
                    {
                      type: "matching",
                      question: "Match the proverb to what it teaches:",
                      pairs: [
                        { left: "Too many cooks spoil the broth", right: "Too many managers cause problems" },
                        { left: "Don't put all eggs in one basket", right: "Diversify your efforts" },
                        { left: "Let sleeping dogs lie", right: "Don't disturb peaceful situations" },
                        { left: "Many hands make light work", right: "Teamwork makes tasks easier" },
                      ],
                      explanation: "Each proverb contains wisdom about how to approach different situations in life."
                    },
                    {
                      type: "mcq",
                      question: "What does 'once in a blue moon' mean?",
                      options: ["every full moon", "very rarely", "at night", "monthly"],
                      answer: "very rarely",
                      explanation: "'Once in a blue moon' means something happens very infrequently or almost never."
                    },
                    {
                      type: "fillblank",
                      sentence: "Let the cat out of the _____ means to reveal a secret.",
                      answer: "bag",
                      explanation: "'Let the cat out of the bag' is an idiom meaning to accidentally reveal information that was supposed to be kept secret."
                    },
                    {
                      type: "multiselect",
                      question: "Which expressions are about time?",
                      options: [
                        "once in a blue moon",
                        "cost an arm and a leg",
                        "in the nick of time",
                        "spill the beans"
                      ],
                      answers: ["once in a blue moon", "in the nick of time"],
                      explanation: "'Once in a blue moon' means rarely, and 'in the nick of time' means just in time. The others relate to money and secrets."
                    },
                    {
                      type: "mcq",
                      question: "The proverb 'A stitch in time saves nine' advises us to:",
                      options: ["sew carefully", "fix problems early", "save money", "work slowly"],
                      answer: "fix problems early",
                      explanation: "This proverb teaches that addressing small problems immediately prevents them from becoming much bigger problems later."
                    },
                    {
                      type: "truefalse",
                      statement: "It's appropriate to use idioms and proverbs frequently in formal academic essays.",
                      answer: "false",
                      reason: "False. While idioms and proverbs can enhance creative writing and speeches, they should be used sparingly (1-2 maximum) in formal essays, as academic writing typically requires more straightforward language."
                    },
                  ],
                },
                {
                  id: 'eng204-3',
                  slug: 'collocations-phrasal-verbs',
                  title: 'Collocations & Phrasal Verbs',
                  objectives: [
                    "Define and identify collocations and phrasal verbs in sentences.",
                    "Distinguish between different types of collocations (e.g., verb+noun, adjective+noun).",
                    "Understand the structure and meaning of common phrasal verbs.",
                    "Differentiate between transitive/intransitive and separable/inseparable phrasal verbs.",
                    "Apply collocations and phrasal verbs correctly to improve fluency and accuracy."
                  ],
                  introduction: "Have you ever wondered why we say 'fast food' but not 'quick food', or why we 'make a bed' but 'do homework'? Welcome to the world of **Collocations and Phrasal Verbs**! These are the secret ingredients that make your English sound natural and fluent. In this lesson, we will explore how words team up to create specific meanings and how changing a small preposition can completely change what a verb means.",
                  keyConcepts: [
                    {
                      title: "1. What are Collocations?",
                      content: "A **collocation** is a pair or group of words that are often used together. They sound 'right' to native English speakers, while other combinations sound unnatural.\n\n*   **Example:** We say **'heavy rain'** (Correct) vs. **'thick rain'** (Incorrect).\n*   **Example:** We say **'make a mistake'** (Correct) vs. **'do a mistake'** (Incorrect)."
                    },
                    {
                      title: "2. Common Types of Collocations",
                      content: "Collocations can be formed by different parts of speech:\n\n*   **Adverb + Adjective:** \n    *   *completely satisfied*, *happily married*.\n*   **Adjective + Noun:** \n    *   *excruciating pain*, *strong coffee* (not 'powerful coffee').\n*   **Noun + Noun:** \n    *   *a surge of anger*, *a round of applause*.\n*   **Verb + Noun:** \n    *   *commit suicide*, *do homework*, *make a wish*."
                    },
                    {
                      title: "3. Understanding Phrasal Verbs",
                      content: "A **phrasal verb** is a verb combined with a particle (a preposition or adverb) that creates a completely new meaning different from the original verb.\n\n**Formula:** `Verb + Particle (Preposition/Adverb)`\n\n*   **Look:** to see with eyes.\n*   **Look after:** to take care of someone.\n*   **Look for:** to try to find something."
                    },
                    {
                      title: "4. Types of Phrasal Verbs",
                      content: "Phrasal verbs behave differently in sentences:\n\n*   **Transitive vs. Intransitive:**\n    *   **Transitive:** Needs an object (e.g., 'I *ran into* **an old friend**').\n    *   **Intransitive:** No object needed (e.g., 'The car *broke down*').\n\n*   **Separable vs. Inseparable:**\n    *   **Separable:** The object can go between the verb and particle (e.g., 'Turn **it** on' or 'Turn on **the light**').\n    *   **Inseparable:** The object must follow the particle (e.g., 'Look after **the baby**' - NOT 'Look the baby after')."
                    },
                    {
                      title: "5. Essential Phrasal Verbs List",
                      content: "Here are some very common phrasal verbs you should know:\n\n*   **Call off:** To cancel (The game was *called off*).\n*   **Carry on:** To continue (Please *carry on* with your work).\n*   **Give up:** To stop trying (Never *give up* on your dreams).\n*   **Put off:** To postpone (Don't *put off* until tomorrow what you can do today).\n*   **Run out of:** To have none left (We *ran out of* sugar).\n*   **Put up with:** To tolerate (I cannot *put up with* this noise)."
                    },
                  ],
                  activities: {
                    type: "exercises",
                    exercises: [
                      {
                        title: "Exercise 1: Collocation Challenge",
                        instructions: "Choose the correct word to complete the collocation.",
                        questions: [
                          {
                            question: "I need to ______ a phone call immediately.",
                            answer: "make"
                          },
                          {
                            question: "Please ______ attention to what the teacher is saying.",
                            answer: "pay"
                          },
                          {
                            question: "It was a ______ disappointment when our team lost.",
                            answer: "bitter"
                          },
                          {
                            question: "Can you ______ me a favor?",
                            answer: "do"
                          },
                          {
                            question: "He ______ a crime and was arrested.",
                            answer: "committed"
                          },
                        ],
                      },
                      {
                        title: "Exercise 2: Phrasal Verb Swap",
                        instructions: "Replace the word in brackets with the correct phrasal verb.",
                        questions: [
                          {
                            question: "The meeting was [cancelled] due to the storm.",
                            answer: "called off"
                          },
                          {
                            question: "I need to [discover] where he lives.",
                            answer: "find out"
                          },
                          {
                            question: "Please [remove] your shoes before entering.",
                            answer: "take off"
                          },
                          {
                            question: "The firemen managed to [extinguish] the fire quickly.",
                            answer: "put out"
                          },
                          {
                            question: "She [resembles] her mother very much.",
                            answer: "takes after"
                          },
                        ],
                      },
                    ],
                  },
                  pastQuestions: [
                    {
                      year: "2020",
                      question: "The soldiers managed to ______ the rebellion within a few days.",
                      options: [
                        "put off",
                        "put down",
                        "put out",
                        "put up"
                      ],
                      answer: "put down",
                      explanation: "'Put down' means to suppress or stop a rebellion or riot by force. 'Put off' means postpone, 'put out' means extinguish, and 'put up' can mean to build or accommodate."
                    },
                    {
                      year: "2019",
                      question: "We have ______ sugar; please buy some on your way home.",
                      options: [
                        "run away with",
                        "run into",
                        "run out of",
                        "run over"
                      ],
                      answer: "run out of",
                      explanation: "'Run out of' means to use up a supply of something so there is none left."
                    },
                    {
                      year: "2018",
                      question: "Kwame ______ his father in everything he does.",
                      options: [
                        "looks after",
                        "takes after",
                        "runs after",
                        "keeps after"
                      ],
                      answer: "takes after",
                      explanation: "'Takes after' means to resemble a parent or ancestor in character or appearance."
                    },
                    {
                      year: "2016",
                      question: "The student was asked to ______ the board after the lesson.",
                      options: [
                        "clean up",
                        "clean out",
                        "clean off",
                        "clean over"
                      ],
                      answer: "clean off",
                      explanation: "'Clean off' is the most appropriate phrasal verb for removing marks or dirt from a surface like a blackboard."
                    },
                    {
                      year: "2015",
                      question: "I cannot ______ his bad behavior anymore.",
                      options: [
                        "put up with",
                        "put in for",
                        "put out with",
                        "put away with"
                      ],
                      answer: "put up with",
                      explanation: "'Put up with' means to tolerate or endure someone or something unpleasant."
                    },
                  ],
                  summary: "In this lesson, we learned that **collocations** are words that naturally go together (like 'make a mistake'), while **phrasal verbs** are verbs combined with particles that create new meanings (like 'give up'). Mastering these combinations is crucial for JHS students to speak and write English naturally and to succeed in exams like the BECE.",
                  endOfLessonQuiz: [
                    {
                      type: "fillblank",
                      sentence: "I need to _____ a phone call to my mother.",
                      answer: "make",
                      explanation: "The correct collocation is 'make a phone call'. We 'make' calls, not 'do' or 'have' them."
                    },
                    {
                      type: "matching",
                      question: "Match each phrasal verb to its correct meaning:",
                      pairs: [
                        { left: "give up", right: "to stop trying" },
                        { left: "look after", right: "to take care of" },
                        { left: "run out of", right: "to have none left" },
                        { left: "put off", right: "to postpone" },
                      ],
                      explanation: "These are common phrasal verbs that change the meaning of the base verb completely."
                    },
                    {
                      type: "mcq",
                      question: "Which is a correct collocation?",
                      options: ["heavy traffic", "thick traffic", "fat traffic", "big traffic"],
                      answer: "heavy traffic",
                      explanation: "We say 'heavy traffic', not 'thick' or 'big' traffic. This is a standard collocation."
                    },
                    {
                      type: "fillblank",
                      sentence: "Please _____ attention to what the teacher is saying.",
                      answer: "pay",
                      explanation: "The correct collocation is 'pay attention'. We 'pay' attention, not 'give' or 'make' attention."
                    },
                    {
                      type: "truefalse",
                      statement: "The collocation 'strong coffee' is correct, but 'powerful coffee' is not.",
                      answer: "true",
                      reason: "True. We say 'strong coffee', not 'powerful coffee'. Collocations are fixed word combinations."
                    },
                    {
                      type: "multiselect",
                      question: "Which of these are correct collocations?",
                      options: [
                        "do homework",
                        "make homework",
                        "take a photo",
                        "have a photo"
                      ],
                      answers: ["do homework", "take a photo"],
                      explanation: "We 'do' homework and 'take' photos. These are fixed collocations in English."
                    },
                    {
                      type: "fillblank",
                      sentence: "The meeting was _____ off because of the storm.",
                      answer: "called",
                      explanation: "'Called off' means cancelled. This phrasal verb is commonly used for events and plans."
                    },
                    {
                      type: "matching",
                      question: "Match each collocation type to its example:",
                      pairs: [
                        { left: "Verb + Noun", right: "make a decision" },
                        { left: "Adjective + Noun", right: "heavy rain" },
                        { left: "Adverb + Adjective", right: "completely satisfied" },
                        { left: "Noun + Noun", right: "round of applause" },
                      ],
                      explanation: "Different types of collocations combine different parts of speech."
                    },
                    {
                      type: "truefalse",
                      statement: "Phrasal verbs always keep the same meaning as the main verb.",
                      answer: "false",
                      reason: "False. Phrasal verbs often have completely different meanings from the main verb. For example, 'look' means to see, but 'look after' means to take care of."
                    },
                    {
                      type: "fillblank",
                      sentence: "We have _____ out of sugar; please buy some.",
                      answer: "run",
                      explanation: "'Run out of' means to use up all of something. This phrasal verb is commonly used with supplies."
                    },
                    {
                      type: "mcq",
                      question: "What does 'take after' mean?",
                      options: ["to photograph", "to remove", "to resemble", "to chase"],
                      answer: "to resemble",
                      explanation: "'Take after' means to resemble or be similar to a family member in appearance or character."
                    },
                    {
                      type: "multiselect",
                      question: "Which sentences use phrasal verbs correctly?",
                      options: [
                        "I need to find out the answer.",
                        "Please take off your shoes.",
                        "She looks her mother after.",
                        "They gave up smoking."
                      ],
                      answers: ["I need to find out the answer.", "Please take off your shoes.", "They gave up smoking."],
                      explanation: "Options 1, 2, and 4 are correct. Option 3 should be 'She looks after her mother' because 'look after' is inseparable."
                    },
                    {
                      type: "fillblank",
                      sentence: "Kwame _____ after his father in everything he does.",
                      answer: "takes",
                      explanation: "'Takes after' means to resemble a parent or family member. This is a common phrasal verb for family resemblance."
                    },
                    {
                      type: "truefalse",
                      statement: "In separable phrasal verbs, the object can go between the verb and the particle.",
                      answer: "true",
                      reason: "True. For example, 'turn on the light' can be 'turn the light on', or 'turn it on'."
                    },
                    {
                      type: "mcq",
                      question: "Choose the correct collocation: It was a _____ disappointment.",
                      options: ["angry", "bitter", "sour", "sharp"],
                      answer: "bitter",
                      explanation: "The correct collocation is 'bitter disappointment'. We use 'bitter' with disappointment, not 'angry' or 'sour'."
                    },
                  ],
                },
            ];
          },
        ],
      },
       {
        level: 'JHS 3',
        topics: [
            {
                id: 'eng301',
                slug: 'writing-3',
                title: 'Writing (BECE Focus)',
                lessons: [
                    {
                      id: 'eng301-1',
                      slug: 'free-composition',
                      title: 'Free Composition (Essays)',
                      objectives: [
                        "Understand the structure of an essay (Introduction, Body, Conclusion).",
                        "Write different types of essays: Narrative, Descriptive, Argumentative, Expository.",
                        "Develop a thesis statement and topic sentences.",
                        "Use appropriate vocabulary and transitional devices.",
                        "Edit and proofread for grammar, spelling, and punctuation errors."
                      ],
                      introduction: "Free composition is your chance to shine! Unlike guided composition where you are given points, here you are given a topic and you must generate your own ideas. Whether you are telling a story (Narrative), describing a scene (Descriptive), or arguing a point (Argumentative), the key is structure and creativity. In the BECE, this section carries a lot of marks, so mastering it is essential.",
                      keyConcepts: [
                        {
                          title: "1. Types of Essays",
                          content: "**Narrative:** Telling a story.\n*   *Example:* 'The most frightening day of my life.'\n*   *Tip:* Use past tense and chronological order.\n\n**Descriptive:** Painting a picture with words.\n*   *Example:* 'A market day in my village.'\n*   *Tip:* Use sensory details (sight, sound, smell, taste, touch).\n\n**Argumentative:** Persuading the reader.\n*   *Example:* 'Corporal punishment should be banned in schools.'\n*   *Tip:* State your position clearly and give strong reasons.\n\n**Expository:** Explaining a process or idea.\n*   *Example:* 'How to prepare your favorite dish.'\n*   *Tip:* Be clear, logical, and use step-by-step explanations."
                        },
                        {
                          title: "2. The Essay Structure",
                          content: "**Introduction:**\n*   Hook the reader (a question, a quote, a shocking statement).\n*   Introduce the topic.\n\n**Body Paragraphs (3-4):**\n*   Each paragraph must have **one** main idea.\n*   Start with a **Topic Sentence**.\n*   Add supporting details and examples.\n\n**Conclusion:**\n*   Summarize your main points.\n*   Give a final thought or recommendation.\n*   Do NOT introduce new ideas here."
                        },
                        {
                          title: "3. The Writing Process",
                          content: "Don't just start writing! Follow these steps:\n\n1.  **Plan (5 mins):** Brainstorm ideas. Select the best ones. Organize them.\n2.  **Draft (25 mins):** Write your essay. Focus on getting ideas down.\n3.  **Edit (10 mins):** Read through. Check for spelling, grammar, and punctuation errors. Check your word count."
                        },
                      ],
                      activities: {
                        type: "quiz",
                        questions: [
                          {
                            question: "Which part of an essay introduces the topic and hooks the reader?",
                            options: ["Body", "Conclusion", "Introduction", "Title"],
                            answer: "Introduction",
                            explanation: "The introduction sets the stage for the essay."
                          },
                          {
                            question: "A story about a personal experience is a __________ essay.",
                            options: ["Descriptive", "Narrative", "Argumentative", "Expository"],
                            answer: "Narrative",
                            explanation: "Narrative essays tell a story."
                          },
                          {
                            question: "Which sentence states the main idea of a paragraph?",
                            options: ["Thesis statement", "Topic sentence", "Concluding sentence", "Hook"],
                            answer: "Topic sentence",
                            explanation: "The topic sentence introduces the main idea of a paragraph."
                          },
                        ],
                      },
                      pastQuestions: [
                        {
                          year: "2020",
                          question: "Write a letter to your friend describing how you spent your last vacation.",
                          options: ["N/A"],
                          answer: "N/A",
                          explanation: "This is a Narrative essay in the form of an Informal Letter."
                        },
                        {
                          year: "2019",
                          question: "Write an article for publication in a national newspaper on the topic: 'The causes of road accidents in Ghana.'",
                          options: ["N/A"],
                          answer: "N/A",
                          explanation: "This is an Expository/Argumentative essay."
                        },
                      ],
                      summary: "Free composition requires planning, structure, and creativity. Choose the topic you can write best about. Plan your points. Write clearly. Check your work."
                    },
                    { id: 'eng301-2', slug: 'summary-writing', title: 'Summary Writing Techniques', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng301-3', slug: 'creative-writing', title: 'Creative Writing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ];
            },
            {
                id: 'eng302',
                slug: 'grammar-3',
                title: 'Grammar (BECE Focus)',
                lessons: [
                    { id: 'eng302-1', slug: 'concord', title: 'Concord (Subject-Verb Agreement)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng302-2', slug: 'punctuation', title: 'Punctuation & Capitalization', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng302-3', slug: 'word-formation', title: 'Word Formation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ];
            },
            {
                id: 'eng303',
                slug: 'literature-3',
                title: 'Literature (BECE Focus)',
                lessons: [
                    { id: 'eng303-1', slug: 'literary-analysis', title: 'Themes, Characters, Setting, Plot Analysis', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng303-2', slug: 'african-literature', title: 'African & Global Literature', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ];
            },
            {
                id: 'eng304',
                slug: 'bece-preparation',
                title: 'BECE Preparation',
                lessons: [
                    { id: 'eng304-1', slug: 'comprehension-practice', title: 'Practice Comprehension Passages', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng304-2', slug: 'oral-english', title: 'Oral English Drills', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'eng304-3', slug: 'mock-exams', title: 'Timed Practice & Mock Exams', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ];
            },
        ],
      },
    ],
  },
