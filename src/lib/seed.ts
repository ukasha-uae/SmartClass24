'use client';

import {
  collection,
  writeBatch,
  doc,
  Firestore,
} from 'firebase/firestore';
import { subjects as staticSubjects } from './jhs-data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Quiz } from './types';

export const seedDatabase = async (db: Firestore) => {
  const batch = writeBatch(db);

  for (const subject of staticSubjects) {
    const subjectSlug = subject.slug.toLowerCase();
    const subjectRef = doc(collection(db, 'subjects'), subjectSlug);
    batch.set(subjectRef, {
      id: subject.id,
      slug: subjectSlug,
      name: subject.name,
      description: subject.description,
    });

    for (const yearGroup of subject.curriculum) {
      for (const topic of yearGroup.topics) {
        const topicSlug = topic.slug.toLowerCase();
        const topicRef = doc(collection(db, `subjects/${subjectSlug}/topics`), topicSlug);
        batch.set(topicRef, {
          id: topic.id,
          slug: topicSlug,
          title: topic.title,
          jhsLevel: yearGroup.level,
        });

        for (const lesson of topic.lessons) {
          const lessonSlug = lesson.slug.toLowerCase();
          const lessonRef = doc(collection(db, `subjects/${subjectSlug}/topics/${topicSlug}/lessons`), lessonSlug);
          
            const firestoreLesson = {
              id: lesson.id,
              slug: lessonSlug,
              title: lesson.title,
              objectives: lesson.objectives,
              introduction: lesson.introduction,
              keyConcepts: lesson.keyConcepts,
              summary: lesson.summary,
              ...(lesson.pastQuestions && { pastQuestions: lesson.pastQuestions }),
              ...(lesson.defaultQuizStyle && { defaultQuizStyle: lesson.defaultQuizStyle }),
          };
          batch.set(lessonRef, firestoreLesson);

          // Seed quizzes if they exist for the lesson
          if (lesson.endOfLessonQuiz) {
            lesson.endOfLessonQuiz.forEach((quizData, index) => {
              const quizRef = doc(collection(db, `subjects/${subjectSlug}/topics/${topicSlug}/lessons/${lessonSlug}/quizzes`), `quiz-${index + 1}`);
              batch.set(quizRef, quizData);
            });
          }
        }
      }
    }
  }

  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Seed] Permission denied - batch write skipped');
      return;
    }
    const permissionError = new FirestorePermissionError({
        path: 'batch write to multiple collections',
        operation: 'write',
        requestResourceData: { note: 'This was a batch write operation for seeding.' }
    });
    errorEmitter.emit('permission-error', permissionError);
    throw error;
  }
};
