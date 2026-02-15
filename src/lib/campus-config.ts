/**
 * Centralized Campus Configuration
 * Add new campuses here without touching routing code
 */

import { SHSSchools } from './shs-schools';
import { BookOpen, GraduationCap, Building2 } from 'lucide-react';

export interface CampusConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: any; // Lucide icon component
  color: string; // Tailwind color class
  schools: string[];
  levels: string[];
  features: {
    hasSubjects: boolean;
    hasLessons: boolean;
    hasQuiz: boolean;
    hasGame: boolean;
    hasLeaderboard: boolean;
    hasChallengeArena: boolean;
    hasVirtualLab?: boolean; // Future feature
  };
  questionBank: string; // Reference to question file
  dataSource: string; // Reference to curriculum data
  active: boolean; // Enable/disable campus
}

export const CAMPUSES: Record<string, CampusConfig> = {
  jhs: {
    id: 'jhs',
    name: 'jhs',
    displayName: 'Junior High School',
    description: 'Complete BECE preparation with comprehensive lessons, quizzes, and practice materials.',
    icon: BookOpen,
    color: 'blue',
    schools: [
      'Accra Academy JHS',
      'Achimota School JHS',
      'Wesley Grammar School',
      'Presbyterian Boys JHS',
      'St. Thomas Aquinas School',
      'Ridge Church School',
      'Others'
    ],
    levels: ['JHS 1', 'JHS 2', 'JHS 3'],
    features: {
      hasSubjects: true,
      hasLessons: true,
      hasQuiz: true,
      hasGame: true,
      hasLeaderboard: true,
      hasChallengeArena: true,
    },
    questionBank: 'jhs-questions',
    dataSource: 'jhs-data',
    active: true,
  },
  
  shs: {
    id: 'shs',
    name: 'shs',
    displayName: 'Senior High School',
    description: 'Advanced courses, virtual lab experiments, and WASSCE preparation for all programmes.',
    icon: GraduationCap,
    color: 'purple',
    schools: SHSSchools,
    levels: ['SHS 1', 'SHS 2', 'SHS 3'],
    features: {
      hasSubjects: true,
      hasLessons: false, // Not yet implemented
      hasQuiz: true,
      hasGame: true,
      hasLeaderboard: true,
      hasChallengeArena: true,
      hasVirtualLab: true, // Future: Chemistry, Physics, Biology labs
    },
    questionBank: 'shs-questions',
    dataSource: 'shs-data', // To be created
    active: true,
  },

  university: {
    id: 'university',
    name: 'university',
    displayName: 'Wisdom Warehouse Innovation Academy',
    description: 'Empowering beginners to become tech builders and founders using AI-driven learning and real-world project-based training.',
    icon: Building2,
    color: 'green',
    schools: ['Technology', 'Engineering', 'Business', 'Science', 'Arts', 'Health'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    features: {
      hasSubjects: true,
      hasLessons: true,
      hasQuiz: true,
      hasGame: false,
      hasLeaderboard: false,
      hasChallengeArena: false,
      hasVirtualLab: false,
    },
    questionBank: 'university-questions',
    dataSource: 'university-data',
    active: true,
  },
};

/**
 * Get all active campuses
 */
export function getActiveCampuses(): CampusConfig[] {
  return Object.values(CAMPUSES).filter(campus => campus.active);
}

/**
 * Get campus configuration by ID
 */
export function getCampusConfig(campusId: string): CampusConfig | null {
  return CAMPUSES[campusId] || null;
}

/**
 * Validate if campus exists and is active
 */
export function isValidCampus(campusId: string): boolean {
  const campus = CAMPUSES[campusId];
  return campus !== undefined && campus.active;
}

/**
 * Get campus color classes for UI
 */
export function getCampusColorClasses(campusId: string) {
  const campus = CAMPUSES[campusId];
  if (!campus) return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-300' };
  
  const colorMap: Record<string, any> = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-300', gradient: 'from-blue-500 to-blue-600' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-300', gradient: 'from-purple-500 to-purple-600' },
    green: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300', gradient: 'from-green-500 to-green-600' },
  };
  
  return colorMap[campus.color] || colorMap.blue;
}
