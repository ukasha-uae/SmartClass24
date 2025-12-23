import { Briefcase } from 'lucide-react';
import type { Subject } from '@/lib/types';

/**
 * Career Technology Curriculum Data
 * Extracted from jhs-data.ts lines 8186-8345
 * 
 * This file is part of the JHS data architecture refactoring.
 * See: DATA_ARCHITECTURE_MIGRATION.md
 */

export const careerTechnologySubject: Subject = {
    id: '7',
    slug: 'career-technology',
    name: 'Career Technology',
    icon: Briefcase,
    description: 'Gain practical skills in design, construction, and technology.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'ct101',
            slug: 'home-economics-1',
            title: 'Home Economics',
            lessons: [
              { id: 'ct101-1', slug: 'intro-food-nutrition', title: 'Introduction to food and nutrition', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct101-2', slug: 'personal-hygiene-kitchen-safety', title: 'Personal hygiene and kitchen safety', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct101-3', slug: 'local-food-groups-balanced-diet', title: 'Local food groups & balanced diet', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct101-4', slug: 'simple-food-preparation', title: 'Simple food preparation (boiling, frying, steaming)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct101-5', slug: 'intro-clothing-textiles', title: 'Introduction to clothing and textiles', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct102',
            slug: 'basic-agriculture-1',
            title: 'Basic Agriculture',
            lessons: [
              { id: 'ct102-1', slug: 'importance-of-agriculture', title: 'Importance of agriculture in Ghana', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct102-2', slug: 'types-of-crops', title: 'Types of crops (food vs cash crops)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct102-3', slug: 'preparing-land', title: 'Preparing land for planting', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct102-4', slug: 'tools-farm-implements', title: 'Tools and farm implements', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct102-5', slug: 'care-of-farm-animals', title: 'Care of farm animals (poultry basics)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct103',
            slug: 'pre-technical-skills-1',
            title: 'Pre-Technical Skills',
            lessons: [
              { id: 'ct103-1', slug: 'safety-in-workshop', title: 'Safety in the workshop', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct103-2', slug: 'intro-to-tools', title: 'Introduction to tools and equipment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct103-3', slug: 'drawing-simple-objects', title: 'Drawing simple objects', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct103-4', slug: 'simple-repairs', title: 'Simple repairs at home', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct104',
            slug: 'entrepreneurship-1',
            title: 'Entrepreneurship & Career Guidance',
            lessons: [
              { id: 'ct104-1', slug: 'intro-to-work', title: 'Introduction to work and careers', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct104-2', slug: 'good-work-habits', title: 'Good work habits and time management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct104-3', slug: 'savings-responsibility', title: 'Savings and personal responsibility', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'ct201',
            slug: 'home-economics-2',
            title: 'Home Economics',
            lessons: [
              { id: 'ct201-1', slug: 'meal-planning', title: 'Meal planning for families', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct201-2', slug: 'food-preservation', title: 'Food preservation methods', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct201-3', slug: 'cooking-local-ingredients', title: 'Cooking with local ingredients', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct201-4', slug: 'clothing-textiles-2', title: 'Clothing and textiles (sewing, repairing)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct201-5', slug: 'home-management', title: 'Home management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct202',
            slug: 'basic-agriculture-2',
            title: 'Basic Agriculture',
            lessons: [
              { id: 'ct202-1', slug: 'soil-types-improvement', title: 'Soil types and soil improvement', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct202-2', slug: 'crop-production', title: 'Crop production', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct202-3', slug: 'pest-disease-control', title: 'Pest and disease control methods', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct202-4', slug: 'animal-farming', title: 'Animal farming', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct202-5', slug: 'irrigation-water-management', title: 'Importance of irrigation and water management', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct203',
            slug: 'pre-technical-skills-2',
            title: 'Pre-Technical Skills',
            lessons: [
              { id: 'ct203-1', slug: 'technical-drawing-2', title: 'Technical drawing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct203-2', slug: 'simple-joints-woodwork', title: 'Simple joints in woodwork', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct203-3', slug: 'basic-metalwork', title: 'Basic metalwork', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct203-4', slug: 'intro-simple-machines', title: 'Introduction to simple machines', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct204',
            slug: 'entrepreneurship-2',
            title: 'Entrepreneurship & Career Guidance',
            lessons: [
              { id: 'ct204-1', slug: 'identifying-business-opportunities', title: 'Identifying business opportunities', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct204-2', slug: 'producing-selling-products', title: 'Producing and selling small products', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct204-3', slug: 'customer-service-honesty', title: 'Customer service and honesty in business', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'ct301',
            slug: 'home-economics-3',
            title: 'Home Economics',
            lessons: [
              { id: 'ct301-1', slug: 'nutritional-needs', title: 'Nutritional needs of different age groups', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct301-2', slug: 'advanced-cooking-methods', title: 'Advanced cooking methods', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct301-3', slug: 'food-hygiene-safety', title: 'Food hygiene and safety regulations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct301-4', slug: 'clothing-textiles-3', title: 'Clothing and textiles (pattern drafting)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct301-5', slug: 'entrepreneurship-home-economics', title: 'Entrepreneurship in Home Economics', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct302',
            slug: 'basic-agriculture-3',
            title: 'Basic Agriculture',
            lessons: [
              { id: 'ct302-1', slug: 'mixed-farming-crop-rotation', title: 'Mixed farming and crop rotation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct302-2', slug: 'livestock-farming', title: 'Livestock farming', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct302-3', slug: 'modern-farming-methods', title: 'Modern methods of farming', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct302-4', slug: 'harvesting-storage-processing', title: 'Harvesting, storage, and processing crops', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct302-5', slug: 'agribusiness', title: 'Agricultural marketing and agribusiness', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct303',
            slug: 'pre-technical-skills-3',
            title: 'Pre-Technical Skills',
            lessons: [
              { id: 'ct303-1', slug: 'technical-drawing-3', title: 'Technical drawing (building plans, furniture)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct303-2', slug: 'woodwork-projects', title: 'Woodwork projects', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct303-3', slug: 'metalwork-projects', title: 'Metalwork projects', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct303-4', slug: 'application-simple-machines', title: 'Application of simple machines in real life', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ct304',
            slug: 'entrepreneurship-3',
            title: 'Entrepreneurship & Career Guidance',
            lessons: [
              { id: 'ct304-1', slug: 'starting-small-business', title: 'Starting a small business', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct304-2', slug: 'skills-for-self-employment', title: 'Skills for self-employment', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct304-3', slug: 'preparing-future-careers', title: 'Preparing for future careers', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ct304-4', slug: 'integrity-lifelong-learning', title: 'Integrity, discipline, and lifelong learning', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
    ],
  },;
