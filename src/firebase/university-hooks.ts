/**
 * S24 Innovation Academy Firebase Integration
 * Hooks and utilities for managing academy progress, submissions, and code saves
 */

'use client';

import { useFirebase } from '@/firebase/provider';
import { useCallback } from 'react';
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
import { StudentProgress, ProjectSubmission, CodeFile, SubmissionStatus, CertificateRecord } from '@/types/university';
import type { UniversityProgram } from '@/types/university';

// ============================================================================
// Student Progress Management
// ============================================================================

export function useUniversityProgress() {
  const { user, firestore } = useFirebase();

  const getProgress = useCallback(async (programId: string, courseId: string): Promise<StudentProgress | null> => {
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
  }, [user, firestore]);

  const updateProgress = useCallback(async (
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
  }, [user, firestore]);

  const markLessonComplete = useCallback(async (
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
  }, [user, firestore]);

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

  const submitProject = useCallback(async (
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
  }, [user, firestore]);

  const getSubmission = useCallback(async (submissionId: string): Promise<ProjectSubmission | null> => {
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
  }, [firestore]);

  const getStudentSubmissions = useCallback(async (projectId: string): Promise<ProjectSubmission[]> => {
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
  }, [user, firestore]);

  // Admin-only: requires the admins/{email} Firestore doc (enforced by firestore.rules)
  const getAllSubmissions = useCallback(async (status?: SubmissionStatus): Promise<ProjectSubmission[]> => {
    if (!firestore) return [];

    try {
      const q = status
        ? query(collection(firestore, 'university-submissions'), where('status', '==', status))
        : collection(firestore, 'university-submissions');

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectSubmission[];
    } catch (error) {
      console.error('Error fetching submissions for review:', error);
      return [];
    }
  }, [firestore]);

  // Admin-only: writes a grade and flips status to 'graded' (enforced by firestore.rules)
  const gradeSubmission = useCallback(async (
    submissionId: string,
    grade: NonNullable<ProjectSubmission['grade']>
  ): Promise<boolean> => {
    if (!firestore) return false;

    try {
      await updateDoc(doc(firestore, 'university-submissions', submissionId), {
        grade,
        status: 'graded'
      });
      return true;
    } catch (error) {
      console.error('Error grading submission:', error);
      return false;
    }
  }, [firestore]);

  return {
    submitProject,
    getSubmission,
    getStudentSubmissions,
    getAllSubmissions,
    gradeSubmission
  };
}

// ============================================================================
// Code Save Management (Auto-save functionality)
// ============================================================================

export function useCodeSaves() {
  const { user, firestore } = useFirebase();

  const saveCode = useCallback(async (
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
  }, [user, firestore]);

  const loadCode = useCallback(async (lessonId: string): Promise<CodeFile[] | null> => {
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
  }, [user, firestore]);

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

// ============================================================================
// Certificates
// ============================================================================

export interface ProgramCompletionStatus {
  eligible: boolean;
  totalLessons: number;
  completedLessons: number;
  totalProjects: number;
  passedProjects: number;
}

export function useCertificates() {
  const { user, firestore } = useFirebase();

  // Checks lesson completion + passing project grades across every course in the program
  const checkProgramCompletion = useCallback(async (program: UniversityProgram): Promise<ProgramCompletionStatus> => {
    if (!user || !firestore) {
      return { eligible: false, totalLessons: 0, completedLessons: 0, totalProjects: 0, passedProjects: 0 };
    }

    let totalLessons = 0;
    let completedLessons = 0;
    let totalProjects = 0;
    let passedProjects = 0;

    for (const course of program.courses) {
      const progressDoc = await getDoc(
        doc(firestore, 'university-progress', `${user.uid}_${program.id}_${course.id}`)
      );
      const progress = progressDoc.exists() ? (progressDoc.data() as StudentProgress) : null;

      for (const module of course.modules) {
        totalLessons += module.lessons.length;
        completedLessons += module.lessons.filter(l => progress?.completedLessons?.includes(l.id)).length;

        for (const project of module.projects) {
          totalProjects += 1;
          const q = query(
            collection(firestore, 'university-submissions'),
            where('studentId', '==', user.uid),
            where('projectId', '==', project.id)
          );
          const submissions = (await getDocs(q)).docs.map(d => d.data() as ProjectSubmission);
          const passed = submissions.some(s => s.grade && s.grade.score >= project.rubric.passingScore);
          if (passed) passedProjects += 1;
        }
      }
    }

    const eligible = totalLessons > 0 && completedLessons === totalLessons && passedProjects === totalProjects;
    return { eligible, totalLessons, completedLessons, totalProjects, passedProjects };
  }, [user, firestore]);

  const getCertificate = useCallback(async (programId: string): Promise<CertificateRecord | null> => {
    if (!user || !firestore) return null;

    try {
      const q = query(
        collection(firestore, 'university-certificates'),
        where('studentId', '==', user.uid),
        where('programId', '==', programId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as CertificateRecord;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }
  }, [user, firestore]);

  const issueCertificate = useCallback(async (
    program: UniversityProgram,
    studentName: string
  ): Promise<CertificateRecord | null> => {
    if (!user || !firestore) return null;

    const existing = await getCertificate(program.id);
    if (existing) return existing;

    try {
      const verificationCode = `${program.id}-${user.uid.slice(0, 6)}-${Date.now().toString(36)}`.toUpperCase();
      const record: Omit<CertificateRecord, 'id'> = {
        studentId: user.uid,
        studentName,
        programId: program.id,
        programTitle: program.certificate.title,
        issuer: program.certificate.issuer,
        verificationCode,
        issuedAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(firestore, 'university-certificates'), record);
      return { id: docRef.id, ...record };
    } catch (error) {
      console.error('Error issuing certificate:', error);
      return null;
    }
  }, [user, firestore, getCertificate]);

  const verifyCertificate = useCallback(async (certificateId: string): Promise<CertificateRecord | null> => {
    if (!firestore) return null;
    try {
      const docSnap = await getDoc(doc(firestore, 'university-certificates', certificateId));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as CertificateRecord;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }
  }, [firestore]);

  return {
    checkProgramCompletion,
    getCertificate,
    issueCertificate,
    verifyCertificate
  };
}
