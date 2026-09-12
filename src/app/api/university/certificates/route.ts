import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAllActivePrograms } from '@/lib/university-data';
import { BearerTokenSchema } from '@/lib/security/validation-schemas';

function getAdminApp() {
  return getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  const result = BearerTokenSchema.safeParse(token);
  return result.success ? result.data : null;
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const adminApp = getAdminApp();
    const decodedToken = await getAuth(adminApp).verifyIdToken(token);
    const body = (await request.json()) as { programId?: unknown; studentName?: unknown };
    const programId = typeof body.programId === 'string' ? body.programId : '';
    const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : '';
    const program = getAllActivePrograms().find(candidate =>
      candidate.id === programId || candidate.slug === programId
    );

    if (!program || !studentName || studentName.length > 120) {
      return NextResponse.json({ error: 'Invalid certificate request' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    let totalLessons = 0;
    let completedLessons = 0;
    let totalProjects = 0;
    let passedProjects = 0;

    for (const course of program.courses) {
      const progressSnapshot = await db
        .collection('university-progress')
        .doc(`${decodedToken.uid}_${program.id}_${course.id}`)
        .get();
      const completedLessonsForCourse = progressSnapshot.exists
        ? ((progressSnapshot.data()?.completedLessons as string[] | undefined) ?? [])
        : [];

      for (const module of course.modules) {
        totalLessons += module.lessons.length;
        completedLessons += module.lessons.filter(lesson =>
          completedLessonsForCourse.includes(lesson.id)
        ).length;

        for (const project of module.projects) {
          totalProjects += 1;
          const submissions = await db
            .collection('university-submissions')
            .where('studentId', '==', decodedToken.uid)
            .get();
          const passed = submissions.docs.some(submission => {
            const submissionData = submission.data();
            const score = submissionData.projectId === project.id
              ? submissionData.grade?.score
              : undefined;
            return typeof score === 'number' && score >= project.rubric.passingScore;
          });
          if (passed) passedProjects += 1;
        }
      }
    }

    if (totalLessons === 0 || completedLessons !== totalLessons || passedProjects !== totalProjects) {
      return NextResponse.json({ error: 'Program requirements are not complete' }, { status: 403 });
    }

    const certificateRef = db
      .collection('university-certificates')
      .doc(`${decodedToken.uid}_${program.id}`);
    const existing = await certificateRef.get();
    if (existing.exists) return NextResponse.json({ id: existing.id, ...existing.data() });

    const record = {
      studentId: decodedToken.uid,
      studentName,
      programId: program.id,
      programTitle: program.certificate.title,
      issuer: program.certificate.issuer,
      verificationCode: `${program.id}-${decodedToken.uid.slice(0, 6)}-${Date.now().toString(36)}`.toUpperCase(),
      issuedAt: new Date().toISOString(),
    };
    await certificateRef.create(record);

    return NextResponse.json({ id: certificateRef.id, ...record });
  } catch (error) {
    console.error('Error issuing university certificate:', error);
    return NextResponse.json({ error: 'Unable to issue certificate' }, { status: 500 });
  }
}
