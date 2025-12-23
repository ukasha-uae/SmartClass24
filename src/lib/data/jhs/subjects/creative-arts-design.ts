import { Palette } from 'lucide-react';
import type { Subject } from '@/lib/types';

/**
 * Creative Arts & Design Curriculum Data
 * Extracted from jhs-data.ts lines 8003-8185
 * 
 * This file is part of the JHS data architecture refactoring.
 * See: DATA_ARCHITECTURE_MIGRATION.md
 */

export const creativeArtsSubject: Subject = {
    id: '6',
    slug: 'creative-arts-design',
    name: 'Creative Arts & Design',
    icon: Palette,
    description: 'Unleash your creativity through visual arts and design.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'cad101',
            slug: 'visual-arts-1',
            title: 'Visual Arts',
            lessons: [
              { id: 'cad101-1', slug: 'intro-drawing', title: 'Introduction to drawing (lines, shapes, shading)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad101-2', slug: 'elements-design', title: 'Elements of design (colour, texture, balance, proportion, rhythm)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad101-3', slug: 'simple-painting', title: 'Simple painting (watercolour, poster colour)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad101-4', slug: 'basic-crafts', title: 'Basic crafts (weaving, collage, paper crafts)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'cad102',
            slug: 'music-1',
            title: 'Music',
            lessons: [
              { id: 'cad102-1', slug: 'singing-folk-songs', title: 'Singing Ghanaian folk songs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad102-2', slug: 'traditional-instruments', title: 'Introduction to traditional musical instruments (drums, flutes, rattles)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad102-3', slug: 'rhythm-pitch-tempo', title: 'Rhythm, pitch, and tempo basics', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'cad102-4', slug: 'call-response-singing', title: 'Call-and-response singing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'cad103',
            slug: 'dance-drama-1',
            title: 'Dance & Drama',
            lessons: [
                { id: 'cad103-1', slug: 'intro-traditional-dance', title: 'Introduction to traditional Ghanaian dances', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad103-2', slug: 'roleplay-storytelling', title: 'Roleplay and storytelling', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad103-3', slug: 'drama-games', title: 'Drama games and improvisation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad103-4', slug: 'movement-expression', title: 'Movement and expression', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'cad104',
            slug: 'cultural-creative-expression-1',
            title: 'Cultural & Creative Expression',
            lessons: [
                { id: 'cad104-1', slug: 'art-daily-life', title: 'Art in daily life (costumes, hairstyles, body adornment)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad104-2', slug: 'traditional-symbols', title: 'Traditional Ghanaian symbols (Adinkra symbols, kente patterns)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad104-3', slug: 'art-festivals', title: 'Art and festivals in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'cad105',
            slug: 'art-appreciation-criticism-1',
            title: 'Art Appreciation & Criticism',
            lessons: [
                { id: 'cad105-1', slug: 'observing-artworks', title: 'Observing and describing artworks', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad105-2', slug: 'talking-about-art', title: 'Talking about music and performances', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                { id: 'cad105-3', slug: 'respecting-cultural-differences', title: 'Respecting cultural differences in art', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
            {
                id: 'cad201',
                slug: 'visual-arts-2',
                title: 'Visual Arts',
                lessons: [
                    { id: 'cad201-1', slug: 'perspective-drawing', title: 'Perspective drawing (objects in 3D)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad201-2', slug: 'intermediate-painting', title: 'Intermediate painting techniques (mixing colours, tones, backgrounds)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad201-3', slug: 'sculpture-modelling', title: 'Sculpture and modelling (clay, papier-mâché, wood carving basics)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad201-4', slug: 'textile-design', title: 'Textile design (tie-and-dye, batik, stamping)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad202',
                slug: 'music-2',
                title: 'Music',
                lessons: [
                    { id: 'cad202-1', slug: 'singing-harmony', title: 'Singing in harmony', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad202-2', slug: 'music-notation', title: 'Reading and writing basic music notation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad202-3', slug: 'song-composition', title: 'Composition of simple songs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad202-4', slug: 'instrument-ensembles', title: 'Playing traditional instruments in ensembles', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad203',
                slug: 'dance-drama-2',
                title: 'Dance & Drama',
                lessons: [
                    { id: 'cad203-1', slug: 'choreography-basics', title: 'Choreography basics (group dance, timing, patterns)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad203-2', slug: 'acting-techniques', title: 'Acting techniques (dialogues, stage performance)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad203-3', slug: 'drama-for-education', title: 'Drama for education (roleplay on social issues like honesty, cleanliness)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad204',
                slug: 'cultural-creative-expression-2',
                title: 'Cultural & Creative Expression',
                lessons: [
                    { id: 'cad204-1', slug: 'ghanaian-architecture', title: 'Ghanaian architecture (compounds, shrines, modern influences)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad204-2', slug: 'art-in-ceremonies', title: 'The role of art in Ghanaian festivals and ceremonies', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad204-3', slug: 'african-masks-costumes', title: 'African masks and costumes', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad205',
                slug: 'art-appreciation-criticism-2',
                title: 'Art Appreciation & Criticism',
                lessons: [
                    { id: 'cad205-1', slug: 'comparing-artworks', title: 'Comparing artworks from different cultures', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad205-2', slug: 'critiquing-performances', title: 'Critiquing performances positively', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad205-3', slug: 'identifying-themes', title: 'Identifying themes in music, dance, and drama', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' }
                ]
            }
        ]
      },
      {
        level: 'JHS 3',
        topics: [
            {
                id: 'cad301',
                slug: 'visual-arts-3',
                title: 'Visual Arts',
                lessons: [
                    { id: 'cad301-1', slug: 'advanced-drawing', title: 'Advanced drawing (shading, texture, portraits)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad301-2', slug: 'painting-compositions', title: 'Painting compositions (themes, abstract vs realistic)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad301-3', slug: 'sculpture-advanced', title: 'Sculpture (carving, casting, assembling)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad301-4', slug: 'design-projects', title: 'Design projects (posters, logos, textiles, crafts for business)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad302',
                slug: 'music-3',
                title: 'Music',
                lessons: [
                    { id: 'cad302-1', slug: 'composing-meaningful-songs', title: 'Composing songs with meaning (social, moral, cultural themes)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad302-2', slug: 'performance-instruments', title: 'Performance with traditional and modern instruments', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad302-3', slug: 'music-for-ceremonies', title: 'Music for ceremonies (weddings, festivals, funerals)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad302-4', slug: 'music-fusion', title: 'Fusion of Ghanaian and contemporary music', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad303',
                slug: 'dance-drama-3',
                title: 'Dance & Drama',
                lessons: [
                    { id: 'cad303-1', slug: 'advanced-choreography', title: 'Advanced choreography (storytelling through dance)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad303-2', slug: 'stagecraft', title: 'Stagecraft (props, costumes, lighting basics)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad303-3', slug: 'dramatic-performance', title: 'Dramatic performance of Ghanaian folktales', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad303-4', slug: 'theatre-for-social-change', title: 'Theatre for social change (drama about corruption, unity, or peace)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad304',
                slug: 'cultural-creative-expression-3',
                title: 'Cultural & Creative Expression',
                lessons: [
                    { id: 'cad304-1', slug: 'ghanaian-art-global', title: 'Ghanaian art in global context', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad304-2', slug: 'creative-industries', title: 'Creative industries (fashion, film, music, crafts, design)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad304-3', slug: 'careers-in-arts', title: 'Careers in creative arts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad304-4', slug: 'business-of-art', title: 'The business of art (selling crafts, performances, and designs)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                ]
            },
            {
                id: 'cad305',
                slug: 'art-appreciation-criticism-3',
                title: 'Art Appreciation & Criticism',
                lessons: [
                    { id: 'cad305-1', slug: 'analyzing-artworks', title: 'Analyzing Ghanaian and African artworks', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad305-2', slug: 'art-national-identity', title: 'Art as a tool for national identity', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
                    { id: 'cad305-3', slug: 'judging-performances', title: 'Judging performances fairly (criteria, technique, creativity)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' }
                ]
            }
        ]
      },
    ],
  },;
