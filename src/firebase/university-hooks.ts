/**
 * S24 Innovation Academy Firebase Integration
 * Hooks and utilities for managing academy progress, submissions, and code saves
 */

'use client';

import { useFirebase } from '@/firebase/provider';
import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { StudentProgress, ProjectSubmission, CodeFile } from '@/types/university';

// ============================================================================
// Student Progress Management
// ============================================================================

export function useUniversityProgress() {
  const { user, firestore } = useFirebase();

  const getProgress = async (programId: string, courseId: string): Promise<StudentProgress | null> => {
    if (!user || !firestore) return null;

    try {
      const progressDoc = await getDoc(
        doc(firestore, 'university-progress', `${user.uid}_${programId}_${courseId}`)
      );

      if (progressDoc.exists()) {
        return progressDoc.data() as StudentProgress;
      }
      return null;
    } catch (error) {
      console.error('Error fetching university progress:', error);
      return null;
    }
  };

  const updateProgress = async (
    programId: string,
    courseId: string,
    updates: Partial<StudentProgress>
  ): Promise<void> => {
    if (!user || !firestore) return;

    try {
      const progressRef = doc(firestore, 'university-progress', `${user.uid}_${programId}_${courseId}`);
      await updateDoc(progressRef, {
        ...updates,
        lastAccessedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating university progress:', error);
    }
  };

  const markLessonComplete = async (
    programId: string,
    courseId: string,
    lessonId: string
  ): Promise<void> => {
    if (!user || !firestore) return;

    try {
      const progressRef = doc(firestore, 'university-progress', `${user.uid}_${programId}_${courseId}`);
      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        const data = progressDoc.data() as StudentProgress;
        const completedLessons = [...(data.completedLessons || [])];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }

        await updateDoc(progressRef, {
          completedLessons,
          lastAccessedAt: new Date().toISOString()
        });
      } else {
        // Create new progress document
        await setDoc(progressRef, {
          studentId: user.uid,
          programId,
          courseId,
          completedLessons: [lessonId],
          completedCheckpoints: [],
          completedProjects: [],
          currentModule: '',
          overallProgress: 0,
          lastAccessedAt: new Date().toISOString(),
          timeSpent: 0
        });
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  return {
    getProgress,
    updateProgress,
    markLessonComplete
  };
}

// ============================================================================
// Project Submission Management
// ============================================================================

export function useProjectSubmissions() {
  const { user, firestore } = useFirebase();

  const submitProject = async (
    projectId: string,
    files: CodeFile[]
  ): Promise<string | null> => {
    if (!user || !firestore) return null;

    try {
      const submission: Omit<ProjectSubmission, 'id'> = {
        studentId: user.uid,
        projectId,
        files,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        revisions: []
      };

      const docRef = await addDoc(collection(firestore, 'university-submissions'), submission);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting project:', error);
      return null;
    }
  };

  const getSubmission = async (submissionId: string): Promise<ProjectSubmission | null> => {
    if (!firestore) return null;

    try {
      const submissionDoc = await getDoc(doc(firestore, 'university-submissions', submissionId));
      if (submissionDoc.exists()) {
        return { id: submissionDoc.id, ...submissionDoc.data() } as ProjectSubmission;
      }
      return null;
    } catch (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
  };

  const getStudentSubmissions = async (projectId: string): Promise<ProjectSubmission[]> => {
    if (!user || !firestore) return [];

    try {
      const q = query(
        collection(firestore, 'university-submissions'),
        where('studentId', '==', user.uid),
        where('projectId', '==', projectId)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectSubmission[];
    } catch (error) {
      console.error('Error fetching student submissions:', error);
      return [];
    }
  };

  return {
    submitProject,
    getSubmission,
    getStudentSubmissions
  };
}

// ============================================================================
// Code Save Management (Auto-save functionality)
// ============================================================================

export function useCodeSaves() {
  const { user, firestore } = useFirebase();

  const saveCode = async (
    lessonId: string,
    files: CodeFile[]
  ): Promise<void> => {
    if (!user || !firestore) {
      // Fallback to localStorage for non-authenticated users
      localStorage.setItem(`code-save-${lessonId}`, JSON.stringify(files));
      return;
    }

    try {
      const saveRef = doc(firestore, 'university-code-saves', `${user.uid}_${lessonId}`);
      await setDoc(saveRef, {
        studentId: user.uid,
        lessonId,
        files,
        savedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving code:', error);
      // Fallback to localStorage
      localStorage.setItem(`code-save-${lessonId}`, JSON.stringify(files));
    }
  };

  const loadCode = async (lessonId: string): Promise<CodeFile[] | null> => {
    if (!user || !firestore) {
      // Try localStorage first
      const saved = localStorage.getItem(`code-save-${lessonId}`);
      return saved ? JSON.parse(saved) : null;
    }

    try {
      const saveDoc = await getDoc(
        doc(firestore, 'university-code-saves', `${user.uid}_${lessonId}`)
      );

      if (saveDoc.exists()) {
        return saveDoc.data().files as CodeFile[];
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(`code-save-${lessonId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading code:', error);
      const saved = localStorage.getItem(`code-save-${lessonId}`);
      return saved ? JSON.parse(saved) : null;
    }
  };

  return {
    saveCode,
    loadCode
  };
}

// ============================================================================
// Analytics & Time Tracking
// ============================================================================

export function useUniversityAnalytics() {
  const { user, firestore } = useFirebase();

  const trackLessonTime = async (
    programId: string,
    courseId: string,
    lessonId: string,
    timeSpentMinutes: number
  ): Promise<void> => {
    if (!user || !firestore) return;

    try {
      const progressRef = doc(firestore, 'university-progress', `${user.uid}_${programId}_${courseId}`);
      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        const data = progressDoc.data() as StudentProgress;
        await updateDoc(progressRef, {
          timeSpent: (data.timeSpent || 0) + timeSpentMinutes,
          lastAccessedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error tracking lesson time:', error);
    }
  };

  return {
    trackLessonTime
  };
}
