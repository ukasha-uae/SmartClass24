/**
 * Example Country-Specific Lessons
 * These demonstrate how to create content that only appears for specific countries
 * 
 * To integrate these into your curriculum:
 * 1. Import these lessons into your main lessons array
 * 2. They will automatically be filtered based on the user's country
 * 3. Students will only see lessons relevant to their country
 */

import type { Lesson } from '@/lib/types';
import { 
  createCountrySpecificContent, 
  createMultiCountryContent 
} from '@/lib/localization/content-availability';

export const countrySpecificLessonsExamples: Lesson[] = [
  // ============================================
  // GHANA-SPECIFIC LESSONS
  // ============================================
  
  {
    id: 'ghana-cocoa-industry',
    slug: 'ghana-cocoa-industry',
    title: "Ghana's Cocoa Industry and Export Economics",
    availability: createCountrySpecificContent('ghana'),
    objectives: [
      "Understand Ghana's position as the world's second-largest cocoa producer",
      "Explain the role of COCOBOD in regulating the cocoa industry",
      "Analyze the economic impact of cocoa exports on Ghana's GDP",
      "Identify challenges facing Ghana's cocoa farmers",
      "Discuss sustainable cocoa farming practices in Ghana"
    ],
    introduction: "Ghana is the world's second-largest cocoa producer, contributing about 20% of global cocoa supply. The cocoa industry is the backbone of Ghana's economy, providing livelihoods for over 800,000 smallholder farmers. In this lesson, we'll explore how Ghana's cocoa industry works, from the farms in Ashanti and Western regions to the international chocolate markets. This lesson is specifically designed for Ghanaian students as it covers Ghana-specific regulations, institutions, and economic policies.",
    keyConcepts: [
      {
        title: "🇬🇭 COCOBOD: Ghana Cocoa Board",
        content: `**The Ghana Cocoa Board (COCOBOD)** is the government institution responsible for regulating Ghana's cocoa industry.

**Key Functions:**
- **Price Setting**: Determines the producer price paid to farmers each season
- **Quality Control**: Ensures Ghanaian cocoa meets international standards
- **Marketing**: Sells Ghana's cocoa on the international market
- **Research**: COCOBOD Research Institute develops disease-resistant cocoa varieties
- **Extension Services**: Provides training and support to cocoa farmers

**Economic Impact:**
- Cocoa exports contribute approximately 30% of Ghana's foreign exchange earnings
- The industry employs over 800,000 farming families
- Ghana's premium cocoa commands higher prices due to superior quality

**Recent Developments:**
- Introduction of the Cocoa Management System (CMS) for traceability
- Living Income Differential (LID) to ensure fair farmer incomes
- Partnership with World Cocoa Foundation for sustainable farming`
      },
      {
        title: "📊 Ghana's Cocoa Export Statistics",
        content: `**Production Data (2023/2024 Season):**
- Annual Production: Approximately 700,000 metric tons
- Global Market Share: 20%
- Major Producing Regions: Western, Ashanti, Eastern, Central, Brong-Ahafo

**Export Destinations:**
- Netherlands: 40% of exports
- United States: 20%
- Germany: 15%
- Belgium: 10%
- Others: 15%

**Economic Contribution:**
- Export Value: Over $2 billion annually
- GDP Contribution: 7-8% of national GDP
- Employment: Direct and indirect jobs for over 2 million people

**Price Trends:**
- Farmer Price 2023/24: GH₵800 per 64kg bag (approximately)
- International Price: $2,500-3,000 per metric ton (varies by season)
- Premium: Ghana cocoa commands 5-10% premium over standard cocoa`
      },
      {
        title: "🌱 Challenges in Ghana's Cocoa Sector",
        content: `**1. Environmental Challenges:**
- Deforestation due to expansion of cocoa farms
- Climate change affecting rainfall patterns
- Soil degradation from intensive farming

**2. Economic Challenges:**
- Fluctuating international cocoa prices
- Rising cost of inputs (fertilizers, pesticides)
- Limited access to credit for smallholder farmers

**3. Social Challenges:**
- Aging farmer population (average age 55+ years)
- Youth migration from cocoa farming to cities
- Child labor concerns in some farming communities

**4. Disease and Pests:**
- Cocoa Swollen Shoot Virus Disease (CSSVD)
- Black pod disease
- Capsid bugs

**Government Interventions:**
- Free cocoa seedling distribution program
- Cocoa Rehabilitation Programme
- Hand Pollination Programme to increase yields
- Mass spraying of cocoa farms to combat diseases`
      }
    ],
    activities: {
      type: 'questions',
      questions: [
        {
          type: 'mcq',
          question: "What percentage of global cocoa supply does Ghana produce?",
          options: [
            "10%",
            "20%",
            "30%",
            "40%"
          ],
          answer: "20%",
          explanation: "Ghana is the world's second-largest cocoa producer, contributing approximately 20% of global cocoa supply, after Côte d'Ivoire which produces about 40%."
        },
        {
          type: 'mcq',
          question: "Which government body regulates Ghana's cocoa industry?",
          options: [
            "Ministry of Agriculture",
            "Ghana Cocoa Board (COCOBOD)",
            "Bank of Ghana",
            "Ghana Standards Authority"
          ],
          answer: "Ghana Cocoa Board (COCOBOD)",
          explanation: "COCOBOD is the government institution responsible for regulating all aspects of Ghana's cocoa industry, from production to export."
        }
      ]
    },
    pastQuestions: [
      {
        question: "Explain THREE economic benefits of Ghana's cocoa industry.",
        solution: "1) Foreign Exchange Earnings: Cocoa exports contribute about 30% of Ghana's foreign exchange, bringing in over $2 billion annually. 2) Employment: The industry provides direct and indirect employment for over 2 million people, including 800,000 farming families. 3) GDP Contribution: Cocoa contributes 7-8% to Ghana's national GDP, making it a significant sector for economic growth.",
        year: "2023"
      }
    ],
    summary: "Ghana's cocoa industry is a cornerstone of the national economy, with the country being the world's second-largest producer. COCOBOD plays a crucial role in maintaining quality standards and supporting farmers. While the industry faces challenges like climate change and aging farmer demographics, government interventions and sustainable practices are helping to secure its future. Understanding Ghana's cocoa sector is essential for appreciating the country's economic structure and agricultural heritage.",
    endOfLessonQuiz: [
      {
        type: 'truefalse',
        statement: "Ghana is the world's largest cocoa producer.",
        answer: 'false',
        reason: "Ghana is the second-largest producer (20% market share). Côte d'Ivoire is the largest, producing about 40% of global cocoa supply."
      },
      {
        type: 'mcq',
        question: "Which of the following is NOT a function of COCOBOD?",
        options: [
          "Setting producer prices for cocoa farmers",
          "Regulating Ghana's oil exports",
          "Ensuring cocoa quality standards",
          "Marketing Ghana's cocoa internationally"
        ],
        answer: "Regulating Ghana's oil exports",
        explanation: "COCOBOD is specifically responsible for the cocoa industry. Oil exports are regulated by different government bodies."
      }
    ]
  },

  // ============================================
  // NIGERIA-SPECIFIC LESSONS
  // ============================================
  
  {
    id: 'nigeria-oil-economy',
    slug: 'nigeria-oil-economy',
    title: "Nigeria's Oil Industry and Petroleum Economics",
    availability: createCountrySpecificContent('nigeria'),
    objectives: [
      "Understand Nigeria's position as Africa's largest oil producer",
      "Explain the role of NNPC in Nigeria's oil sector",
      "Analyze the economic impact of oil exports on Nigeria's GDP",
      "Identify challenges facing Nigeria's oil industry",
      "Discuss economic diversification efforts beyond oil"
    ],
    introduction: "Nigeria is Africa's largest oil producer and holds the continent's largest natural gas reserves. Oil accounts for over 90% of Nigeria's export earnings and about 50% of government revenue. In this lesson specifically for Nigerian students, we'll explore how the petroleum industry shapes Nigeria's economy, from the Niger Delta oil fields to international markets, and examine why diversification is crucial for Nigeria's economic future.",
    keyConcepts: [
      {
        title: "🇳🇬 NNPC: Nigerian National Petroleum Company",
        content: `**The Nigerian National Petroleum Company Limited (NNPC Ltd)** is Nigeria's state oil company, transformed from NNPC into a commercial entity under the Petroleum Industry Act (PIA) 2021.

**Key Functions:**
- **Exploration & Production**: Exploring and extracting crude oil and natural gas
- **Refining**: Operating Nigeria's four refineries (though currently importing refined products)
- **Distribution**: Managing petroleum product distribution nationwide
- **Joint Ventures**: Partnering with international oil companies (Shell, ExxonMobil, Chevron, Total)

**Economic Role:**
- Contributes over ₦1 trillion annually to federal government revenue
- Manages Nigeria's oil production quota under OPEC
- Employs thousands of Nigerians directly and indirectly

**Recent Reforms (PIA 2021):**
- Commercialization: NNPC now operates as a profit-driven company
- Transparency: Improved financial reporting requirements
- Host Community Development: 3% of project costs allocated to host communities
- Gas Development: Greater focus on Nigeria's vast gas reserves`
      },
      {
        title: "📊 Nigeria's Oil Production Statistics",
        content: `**Production Data (2024):**
- Daily Production: Approximately 1.5 million barrels per day
- Proven Reserves: 37 billion barrels of crude oil
- Gas Reserves: 206 trillion cubic feet (largest in Africa)
- Major Producing States: Rivers, Delta, Bayelsa, Akwa Ibom

**Export Statistics:**
- Annual Oil Exports: $40-50 billion (depending on prices)
- Export Percentage: 90% of total export earnings
- GDP Contribution: Oil sector accounts for 10% of GDP
- Government Revenue: Oil provides 50% of federal government revenue

**Major Export Destinations:**
- India: 20%
- Spain: 11%
- Netherlands: 10%
- France: 8%
- United States: 7%
- China: 6%

**Oil Grades:**
- Bonny Light: Premium grade, low sulfur content
- Brass River: High quality export crude
- Forcados: Nigeria's largest export stream`
      },
      {
        title: "⚠️ Challenges in Nigeria's Oil Sector",
        content: `**1. Oil Theft and Pipeline Vandalism:**
- Estimated loss: $1-2 billion annually
- Production disruptions from pipeline attacks
- Environmental damage from illegal refineries

**2. Under-Investment:**
- Aging infrastructure (refineries built 40+ years ago)
- Insufficient investment in new oil fields
- Delayed maintenance causing production shutdowns

**3. Over-Dependence on Oil:**
- Economic vulnerability to global oil price fluctuations
- Neglect of other sectors (agriculture, manufacturing)
- "Dutch Disease" effect on non-oil exports

**4. Environmental Issues:**
- Gas flaring (though reduced significantly)
- Oil spills affecting Niger Delta communities
- Environmental degradation of oil-producing areas

**5. OPEC Production Quotas:**
- Restrictions on how much Nigeria can produce
- Challenges meeting quota due to underinvestment

**Government Responses:**
- Petroleum Industry Act 2021 for sector reform
- Increased security for oil installations
- Push for economic diversification (agriculture, tech, manufacturing)
- Dangote Refinery to reduce fuel import dependency`
      },
      {
        title: "🔄 Economic Diversification Efforts",
        content: `**Why Diversification is Critical:**
- Reduce dependence on volatile oil revenues
- Create sustainable employment for growing population
- Build resilience against oil price shocks
- Develop other sectors with competitive advantages

**Key Diversification Sectors:**

**1. Agriculture:**
- Potential to employ 70% of population
- Nigeria can feed itself and export (rice, cassava, yams)
- Government programs: Anchor Borrowers Programme

**2. Technology & Innovation:**
- Lagos emerging as African tech hub
- Successful startups: Flutterwave, Paystack, Andela
- Growing digital economy worth over $100 billion

**3. Manufacturing:**
- Dangote Industries (cement, sugar, fertilizer)
- Potential for import substitution
- Creation of industrial parks and special economic zones

**4. Services:**
- Banking and finance sector already strong
- Entertainment industry (Nollywood, music)
- Tourism potential (cultural heritage, natural attractions)

**Challenges to Diversification:**
- Infrastructure deficits (power, roads, rail)
- Policy inconsistency
- Security concerns in some regions
- Need for improved business environment`
      }
    ],
    activities: {
      type: 'questions',
      questions: [
        {
          type: 'mcq',
          question: "What percentage of Nigeria's export earnings comes from oil?",
          options: [
            "50%",
            "70%",
            "90%",
            "100%"
          ],
          answer: "90%",
          explanation: "Oil accounts for over 90% of Nigeria's export earnings, highlighting the economy's heavy dependence on petroleum exports."
        },
        {
          type: 'mcq',
          question: "Under which legislation was NNPC transformed into a commercial entity?",
          options: [
            "CAMA 2020",
            "Petroleum Industry Act 2021",
            "Companies Act 2019",
            "Finance Act 2020"
          ],
          answer: "Petroleum Industry Act 2021",
          explanation: "The Petroleum Industry Act (PIA) 2021 transformed NNPC from a corporation into a commercial company (NNPC Limited), aimed at improving efficiency and transparency."
        }
      ]
    },
    pastQuestions: [
      {
        question: "Explain FOUR challenges facing Nigeria's oil industry.",
        solution: "1) Oil Theft: Nigeria loses $1-2 billion annually from oil theft and pipeline vandalism. 2) Aging Infrastructure: Refineries built over 40 years ago are non-functional, forcing Nigeria to import refined petroleum. 3) Under-Investment: Insufficient investment in exploration and production has led to declining output. 4) Environmental Damage: Oil spills and gas flaring continue to harm Niger Delta communities despite mitigation efforts.",
        year: "2023"
      }
    ],
    summary: "Nigeria's oil industry is the backbone of the economy, with petroleum accounting for 90% of export earnings and 50% of government revenue. While NNPC plays a central role, the sector faces challenges including oil theft, underinvestment, and environmental concerns. The Petroleum Industry Act 2021 aims to reform the sector, but economic diversification into agriculture, technology, and manufacturing is crucial for Nigeria's sustainable future. Understanding these dynamics is essential for any Nigerian student of economics or business.",
    endOfLessonQuiz: [
      {
        type: 'truefalse',
        statement: "Nigeria is the world's largest oil producer.",
        answer: 'false',
        reason: "Nigeria is Africa's largest oil producer but globally ranks around 6th-8th, well behind countries like the United States, Saudi Arabia, and Russia."
      },
      {
        type: 'mcq',
        question: "Which of the following is a premium grade Nigerian crude oil?",
        options: [
          "Brent Crude",
          "West Texas Intermediate",
          "Bonny Light",
          "Dubai Crude"
        ],
        answer: "Bonny Light",
        explanation: "Bonny Light is Nigeria's premium grade crude oil, known for its low sulfur content and high quality, making it highly desirable in international markets."
      }
    ]
  },

  // ============================================
  // MULTI-COUNTRY LESSON (GHANA + NIGERIA)
  // ============================================
  
  {
    id: 'west-african-trade-ecowas',
    slug: 'west-african-trade-ecowas',
    title: "ECOWAS and West African Economic Integration",
    availability: createMultiCountryContent(['ghana', 'nigeria']),
    objectives: [
      "Understand the objectives and structure of ECOWAS",
      "Explain the benefits of regional economic integration",
      "Analyze trade flows between Ghana and Nigeria",
      "Discuss challenges to West African economic integration",
      "Identify opportunities for increased regional cooperation"
    ],
    introduction: "The Economic Community of West African States (ECOWAS) is one of Africa's most important regional blocs, comprising 15 member states including Ghana and Nigeria. This lesson explores how ECOWAS facilitates trade, promotes economic cooperation, and works toward deeper integration among West African nations. As citizens of two of ECOWAS's largest economies, understanding regional integration is crucial for your economic literacy.",
    keyConcepts: [
      {
        title: "🌍 What is ECOWAS?",
        content: `**ECOWAS (Economic Community of West African States)** was established on May 28, 1975, through the Treaty of Lagos.

**Member Countries (15):**
- **Anglophone**: Ghana, Nigeria, Sierra Leone, Liberia, Gambia
- **Francophone**: Senegal, Côte d'Ivoire, Mali, Burkina Faso, Niger, Benin, Togo, Guinea
- **Lusophone**: Guinea-Bissau, Cape Verde

**Key Objectives:**
1. **Economic Integration**: Creating a single market and customs union
2. **Free Movement**: Enabling citizens to move and work across borders
3. **Regional Security**: Maintaining peace and stability
4. **Infrastructure Development**: Connecting the region through roads, railways, and energy networks
5. **Monetary Union**: Working toward a common currency (ECO)

**Institutional Structure:**
- Authority of Heads of State and Government (highest decision-making body)
- Council of Ministers
- ECOWAS Commission (administrative arm, based in Abuja, Nigeria)
- ECOWAS Parliament (based in Accra, Ghana)
- ECOWAS Court of Justice`
      },
      {
        title: "💰 Ghana-Nigeria Economic Relations",
        content: `**Trade Statistics:**
- Nigeria is Ghana's largest trading partner in West Africa
- Annual bilateral trade: Over $1 billion
- Ghana exports to Nigeria: Cocoa products, processed foods, manufactured goods
- Nigeria exports to Ghana: Petroleum products, cement, manufactured goods

**Key Sectors:**

**1. Energy:**
- West African Gas Pipeline connects Nigerian gas to Ghana
- Nigeria supplies gas for Ghana's power generation
- Ongoing discussions for increased energy cooperation

**2. Manufacturing:**
- Dangote Cement operates in both countries
- Growing cross-border investments
- Industrial cooperation agreements

**3. Services:**
- Banking: Nigerian banks (GTBank, Zenith) operate in Ghana; Ghanaian banks (Ecobank) in Nigeria
- Telecommunications: MTN, Airtel operate regionally
- Entertainment: Nollywood and Ghallywood collaborations

**Investment Flows:**
- Nigerian companies investing in Ghana: Dangote, Honeywell
- Ghanaian companies in Nigeria: Ecobank, PZ Cussons
- Growing startup ecosystem connecting both countries`
      }
    ],
    activities: {
      type: 'questions',
      questions: [
        {
          type: 'mcq',
          question: "How many member states does ECOWAS have?",
          options: [
            "10",
            "12",
            "15",
            "20"
          ],
          answer: "15",
          explanation: "ECOWAS has 15 member states across West Africa, including both Ghana and Nigeria."
        },
        {
          type: 'mcq',
          question: "Where is the ECOWAS Parliament located?",
          options: [
            "Abuja, Nigeria",
            "Accra, Ghana",
            "Dakar, Senegal",
            "Lagos, Nigeria"
          ],
          answer: "Accra, Ghana",
          explanation: "The ECOWAS Parliament is based in Accra, Ghana, while the ECOWAS Commission is headquartered in Abuja, Nigeria."
        }
      ]
    },
    pastQuestions: [],
    summary: "ECOWAS represents West Africa's commitment to regional integration and cooperation. For Ghana and Nigeria, as two of the bloc's largest economies, ECOWAS provides opportunities for expanded trade, investment, and cultural exchange. Despite challenges like currency differences and infrastructure gaps, the potential for deeper integration remains strong. Understanding ECOWAS is essential for anyone interested in West African economics and business.",
    endOfLessonQuiz: [
      {
        type: 'truefalse',
        statement: "ECOWAS was established in 1975 through the Treaty of Lagos.",
        answer: 'true',
        reason: "Correct! ECOWAS was founded on May 28, 1975, when the Treaty of Lagos was signed by 15 West African countries."
      }
    ]
  }
];
