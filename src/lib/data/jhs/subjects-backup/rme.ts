import { Users } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Religious and Moral Education Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 7828-8002 from original file
 */

export const rmeSubject: Subject = {
    id: '5',
    slug: 'rme',
    name: 'Religious and Moral Education (RME)',
    icon: Users,
    description: 'Learn about different religions and moral principles.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'rme101',
            slug: 'god-creation-attributes-1',
            title: 'God, His Creation and Attributes',
            lessons: [
              { id: 'rme101-1', slug: 'concept-of-god', title: 'The concept of God in Christianity, Islam, and ATR', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme101-2', slug: 'god-as-creator', title: 'God as Creator and Sustainer of life', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme101-3', slug: 'attributes-of-god', title: 'Attributes of God (love, mercy, power, wisdom, holiness)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme102',
            slug: 'family-community-nation-1',
            title: 'The Family, Community & Nation',
            lessons: [
              { id: 'rme102-1', slug: 'family-moral-upbringing', title: 'The role of the family in moral upbringing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme102-2', slug: 'roles-responsibilities', title: 'Roles and responsibilities of children and parents', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme102-3', slug: 'respect-obedience-discipline', title: 'Respect, obedience, and discipline', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme103',
            slug: 'religious-practices-worship-1',
            title: 'Religious Practices & Worship',
            lessons: [
              { id: 'rme103-1', slug: 'types-of-prayer', title: 'Types of prayer (Christian, Islamic, Traditional)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme103-2', slug: 'fasting', title: 'Fasting in Christianity and Islam', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme103-3', slug: 'atr-festivals', title: 'Festivals in ATR (Homowo, Aboakyir, Hogbetsotso, etc.)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme104',
            slug: 'leaders-role-models-1',
            title: 'Leaders and Role Models',
            lessons: [
              { id: 'rme104-1', slug: 'jesus-early-life', title: 'Jesus Christ\'s early life and ministry', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme104-2', slug: 'muhammad-early-life', title: 'Prophet Muhammad\'s early life and call to prophethood', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme104-3', slug: 'atr-heroes', title: 'Heroes in African Traditional Religion (Okomfo Anokye, Yaa Asantewaa, etc.)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme105',
            slug: 'moral-lessons-values-1',
            title: 'Moral Lessons & Values',
            lessons: [
              { id: 'rme105-1', slug: 'honesty-truthfulness-hard-work', title: 'Honesty, truthfulness, hard work', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme105-2', slug: 'respect-for-elders', title: 'Respect for elders and authority', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme105-3', slug: 'friendship-forgiveness', title: 'Friendship and forgiveness', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'rme201',
            slug: 'god-creation-attributes-2',
            title: 'God, His Creation and Attributes',
            lessons: [
              { id: 'rme201-1', slug: 'god-humankind-relationship', title: 'God\'s relationship with humankind', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme201-2', slug: 'stewardship-of-environment', title: 'Stewardship of the environment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme201-3', slug: 'sin-consequences', title: 'Sin and its consequences (Christian, Islamic, ATR perspectives)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme202',
            slug: 'family-community-nation-2',
            title: 'The Family, Community & Nation',
            lessons: [
              { id: 'rme202-1', slug: 'extended-family-system', title: 'Extended family system in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme202-2', slug: 'communal-living', title: 'Communal living and responsibility', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme202-3', slug: 'respect-cultural-values', title: 'Respect for cultural values and traditions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme203',
            slug: 'religious-practices-worship-2',
            title: 'Religious Practices & Worship',
            lessons: [
              { id: 'rme203-1', slug: 'christian-worship', title: 'Worship in Christianity (church service, sacraments)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme203-2', slug: 'islamic-worship', title: 'Worship in Islam (Salat, Zakat, Sawm, Hajj)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme203-3', slug: 'atr-worship', title: 'Worship in ATR (libation, sacrifices, festivals)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme204',
            slug: 'leaders-role-models-2',
            title: 'Leaders and Role Models',
            lessons: [
              { id: 'rme204-1', slug: 'jesus-parables-miracles', title: 'Parables and miracles of Jesus', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme204-2', slug: 'muhammad-teachings', title: 'Teachings of Prophet Muhammad (Hadith)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme204-3', slug: 'african-moral-teachers', title: 'African moral teachers and traditional leaders', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme205',
            slug: 'moral-lessons-values-2',
            title: 'Moral Lessons & Values',
            lessons: [
              { id: 'rme205-1', slug: 'tolerance-peaceful-coexistence', title: 'Tolerance and peaceful coexistence', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme205-2', slug: 'patriotism-nation-building', title: 'Patriotism and nation building', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme205-3', slug: 'courage-humility-self-control', title: 'Courage, humility, self-control', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'rme301',
            slug: 'god-creation-attributes-3',
            title: 'God, His Creation and Attributes',
            lessons: [
              { id: 'rme301-1', slug: 'sovereignty-of-god', title: 'The sovereignty of God', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme301-2', slug: 'god-judgment-reward', title: 'God\'s judgment and reward (Christian, Islamic, ATR beliefs)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme301-3', slug: 'life-after-death', title: 'Life after death and resurrection', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme302',
            slug: 'family-community-nation-3',
            title: 'The Family, Community & Nation',
            lessons: [
              { id: 'rme302-1', slug: 'marriage-family-life', title: 'Marriage and family life (Christian, Islamic, Traditional views)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme302-2', slug: 'social-vices', title: 'Social vices (corruption, greed, dishonesty, drug abuse, occultism)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme302-3', slug: 'conflict-resolution', title: 'Conflict resolution and reconciliation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme303',
            slug: 'religious-practices-worship-3',
            title: 'Religious Practices & Worship',
            lessons: [
              { id: 'rme303-1', slug: 'christian-sacraments', title: 'Christian sacraments and ordinances (baptism, communion, confirmation)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme303-2', slug: 'islamic-pillars', title: 'Islamic pillars in practice (detailed study of Hajj, Zakat, Sawm, Hajj)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme303-3', slug: 'atr-rites-of-passage', title: 'ATR rites of passage (naming, puberty, marriage, death)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme304',
            slug: 'leaders-role-models-3',
            title: 'Leaders and Role Models',
            lessons: [
              { id: 'rme304-1', slug: 'jesus-death-resurrection', title: 'The death and resurrection of Jesus Christ', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme304-2', slug: 'muhammad-last-sermon', title: 'The last sermon of Prophet Muhammad', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme304-3', slug: 'atr-leaders-custodians', title: 'ATR leaders as custodians of morality and culture', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'rme305',
            slug: 'moral-lessons-values-3',
            title: 'Moral Lessons & Values',
            lessons: [
              { id: 'rme305-1', slug: 'human-rights-responsibilities', title: 'Human rights and responsibilities', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme305-2', slug: 'justice-fairness', title: 'Justice and fairness in society', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme305-3', slug: 'leadership-service', title: 'Leadership and service to the community', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'rme305-4', slug: 'preparing-for-adult-life', title: 'Preparing for adult life (integrity, accountability)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
    ],
  },
