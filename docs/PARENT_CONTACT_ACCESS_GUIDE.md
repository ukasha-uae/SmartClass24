# 📞 Parent Contact Access Guide

## Overview

This guide explains how to access parent/guardian contact information for students in the SmartClass24 system.

---

## 📋 Current Data Structure

### Student Profile (Firestore: `students/{uid}`)

```typescript
interface StudentProfile {
  uid: string;
  studentName: string;
  studentClass: string;
  schoolName: string;
  schoolAddress?: string;
  parentPhoneNumber: string;  // ⭐ Parent contact stored here
  profilePictureUrl?: string;
  linkedParents?: string[];  // Array of parent UIDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Location:** `students/{studentUid}` document in Firestore

---

## 🔍 How to Access Parent Contacts

### Method 1: Direct Firestore Query (For Admins/Teachers)

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

// Get parent phone for a specific student
async function getParentContact(studentUid: string) {
  const { firestore } = useFirebase();
  
  if (!firestore) return null;
  
  const studentDoc = await getDoc(doc(firestore, `students/${studentUid}`));
  const studentData = studentDoc.data();
  
  return {
    phone: studentData?.parentPhoneNumber || null,
    studentName: studentData?.studentName || 'Unknown',
  };
}

// Get all students with parent contacts
async function getAllParentContacts() {
  const { firestore } = useFirebase();
  
  if (!firestore) return [];
  
  const studentsRef = collection(firestore, 'students');
  const snapshot = await getDocs(studentsRef);
  
  return snapshot.docs
    .map(doc => ({
      studentId: doc.id,
      studentName: doc.data().studentName,
      parentPhone: doc.data().parentPhoneNumber,
      studentClass: doc.data().studentClass,
      schoolName: doc.data().schoolName,
    }))
    .filter(student => student.parentPhone); // Only return students with parent contacts
}
```

### Method 2: Using React Hook (In Components)

```typescript
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

function StudentContactInfo({ studentUid }: { studentUid: string }) {
  const { firestore } = useFirebase();
  
  const studentRef = useMemo(
    () => firestore ? doc(firestore, `students/${studentUid}`) : null,
    [firestore, studentUid]
  );
  
  const { data: studentProfile } = useDoc<any>(studentRef as any);
  
  return (
    <div>
      <p>Student: {studentProfile?.studentName}</p>
      <p>Parent Phone: {studentProfile?.parentPhoneNumber || 'Not provided'}</p>
    </div>
  );
}
```

### Method 3: Query by School/Class

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

async function getParentContactsBySchool(schoolName: string) {
  const { firestore } = useFirebase();
  
  if (!firestore) return [];
  
  const studentsRef = collection(firestore, 'students');
  const q = query(
    studentsRef,
    where('schoolName', '==', schoolName)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    studentId: doc.id,
    studentName: doc.data().studentName,
    parentPhone: doc.data().parentPhoneNumber,
    studentClass: doc.data().studentClass,
  }));
}

async function getParentContactsByClass(studentClass: string) {
  const { firestore } = useFirebase();
  
  if (!firestore) return [];
  
  const studentsRef = collection(firestore, 'students');
  const q = query(
    studentsRef,
    where('studentClass', '==', studentClass)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    studentId: doc.id,
    studentName: doc.data().studentName,
    parentPhone: doc.data().parentPhoneNumber,
  }));
}
```

---

## 🔐 Security & Privacy Considerations

### Firestore Security Rules

**Current Rules (Check `firestore.rules`):**
```javascript
match /students/{studentId} {
  // Students can read/write their own profile
  allow read, write: if request.auth != null && request.auth.uid == studentId;
  
  // Parents can read their linked children's profiles
  allow read: if request.auth != null && 
    exists(/databases/$(database)/documents/parents/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/parents/$(request.auth.uid)).data().linkedStudents.hasAny([studentId]);
  
  // Teachers/Admins need special permissions
  // TODO: Add teacher/admin role check
}
```

### ⚠️ Important Privacy Notes

1. **Parent phone numbers are sensitive data** - Only accessible by:
   - The student themselves
   - Linked parents (via parent dashboard)
   - Authorized teachers/admins (if role-based access is implemented)

2. **GDPR/Privacy Compliance:**
   - Parent consent should be obtained before storing phone numbers
   - Students should be informed that parent contacts are stored
   - Provide option to remove/update parent contact information

3. **Access Control:**
   - Implement role-based access control for teachers/admins
   - Log access to parent contact information
   - Consider encryption for sensitive contact data

---

## 📱 Use Cases

### 1. Parent Dashboard Access

**Location:** `/parent/dashboard`

Parents who are linked to students can:
- View their child's progress
- See their own contact information (if stored in parent profile)
- Access linked students' profiles

**Implementation:**
```typescript
// In parent dashboard
const { data: parentData } = useDoc(parentRef);
const linkedStudentIds = parentData?.linkedStudents || [];

// For each linked student, fetch their profile
linkedStudentIds.forEach(async (studentId) => {
  const studentDoc = await getDoc(doc(firestore, `students/${studentId}`));
  const studentData = studentDoc.data();
  // Access parentPhoneNumber if needed
});
```

### 2. Teacher/Admin Access

**Current Status:** ⚠️ Not fully implemented

**Recommended Implementation:**
```typescript
// Check if user is a teacher/admin
async function isTeacherOrAdmin(userUid: string) {
  const teacherDoc = await getDoc(doc(firestore, `teachers/${userUid}`));
  const adminDoc = await getDoc(doc(firestore, `admins/${userUid}`));
  
  return teacherDoc.exists() || adminDoc.exists();
}

// Get parent contacts for teacher's class
async function getClassParentContacts(teacherUid: string) {
  if (!(await isTeacherOrAdmin(teacherUid))) {
    throw new Error('Unauthorized access');
  }
  
  // Get teacher's assigned classes
  const teacherDoc = await getDoc(doc(firestore, `teachers/${teacherUid}`));
  const assignedClasses = teacherDoc.data()?.assignedClasses || [];
  
  // Query students in those classes
  const studentsRef = collection(firestore, 'students');
  const q = query(studentsRef, where('studentClass', 'in', assignedClasses));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    studentName: doc.data().studentName,
    parentPhone: doc.data().parentPhoneNumber,
    studentClass: doc.data().studentClass,
  }));
}
```

### 3. Bulk Export (Admin Only)

```typescript
async function exportParentContacts(format: 'csv' | 'json' = 'json') {
  // Verify admin access
  if (!(await isAdmin())) {
    throw new Error('Admin access required');
  }
  
  const studentsRef = collection(firestore, 'students');
  const snapshot = await getDocs(studentsRef);
  
  const contacts = snapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        studentId: doc.id,
        studentName: data.studentName,
        studentClass: data.studentClass,
        schoolName: data.schoolName,
        parentPhone: data.parentPhoneNumber,
      };
    })
    .filter(contact => contact.parentPhone);
  
  if (format === 'csv') {
    // Convert to CSV format
    const headers = ['Student ID', 'Student Name', 'Class', 'School', 'Parent Phone'];
    const rows = contacts.map(c => [
      c.studentId,
      c.studentName,
      c.studentClass,
      c.schoolName,
      c.parentPhone,
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  return JSON.stringify(contacts, null, 2);
}
```

---

## 🛠️ Implementation Examples

### Example 1: Display Parent Contact in Student Profile

```typescript
// src/app/profile/page.tsx (already implemented)
const { data: profile } = useDoc(profileRef);

// Display parent phone (if user is viewing their own profile)
{profile?.parentPhoneNumber && (
  <div>
    <Label>Parent/Guardian Contact</Label>
    <p>{profile.parentPhoneNumber}</p>
  </div>
)}
```

### Example 2: Admin Dashboard - View All Parent Contacts

```typescript
// src/app/admin/students/page.tsx (to be created)
'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminStudentsPage() {
  const { firestore } = useFirebase();
  const [students, setStudents] = useState<any[]>([]);
  
  useEffect(() => {
    const loadStudents = async () => {
      if (!firestore) return;
      
      const snapshot = await getDocs(collection(firestore, 'students'));
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setStudents(studentsData);
    };
    
    loadStudents();
  }, [firestore]);
  
  return (
    <div>
      <h1>Student Directory</h1>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Class</th>
            <th>School</th>
            <th>Parent Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.studentClass}</td>
              <td>{student.schoolName}</td>
              <td>{student.parentPhoneNumber || 'Not provided'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Example 3: Send SMS Notification to Parents

```typescript
// Requires SMS service integration (e.g., Twilio, AWS SNS)
async function notifyParent(studentUid: string, message: string) {
  const { firestore } = useFirebase();
  
  // Get student profile
  const studentDoc = await getDoc(doc(firestore, `students/${studentUid}`));
  const parentPhone = studentDoc.data()?.parentPhoneNumber;
  
  if (!parentPhone) {
    throw new Error('Parent phone number not available');
  }
  
  // Send SMS via your SMS service
  // Example with Twilio:
  // await twilioClient.messages.create({
  //   body: message,
  //   to: parentPhone,
  //   from: YOUR_TWILIO_NUMBER,
  // });
  
  console.log(`SMS sent to ${parentPhone}: ${message}`);
}
```

---

## 📊 Current Access Points

### ✅ Implemented

1. **Student Profile Page** (`/profile`)
   - Students can view/edit their own parent contact
   - Stored in `students/{uid}` document

2. **Parent Dashboard** (`/parent/dashboard`)
   - Parents can view linked students' information
   - Access via parent-student linking system

3. **Profile Setup** (`StudentProfileSetup` component)
   - Students enter parent phone during profile setup
   - Saved to Firestore on profile save

### ⚠️ Not Yet Implemented

1. **Teacher Access**
   - Teachers cannot currently access parent contacts
   - Need role-based access control

2. **Admin Dashboard**
   - No admin interface for bulk parent contact access
   - Need admin role and dashboard

3. **Bulk Export**
   - No CSV/Excel export functionality
   - Need export feature for school administrators

4. **SMS/Email Integration**
   - No automated notification system
   - Parent contacts not used for communication yet

---

## 🚀 Recommended Next Steps

1. **Implement Role-Based Access Control**
   - Create `teachers` and `admins` collections
   - Update Firestore security rules
   - Add role checks in components

2. **Create Admin Dashboard**
   - Build `/admin/students` page
   - Add search/filter functionality
   - Implement bulk export feature

3. **Add Teacher Portal**
   - Create `/teacher/students` page
   - Show parent contacts for teacher's classes
   - Add communication tools

4. **Implement Notification System**
   - Integrate SMS service (Twilio, AWS SNS)
   - Add email notifications
   - Create notification templates

5. **Privacy & Compliance**
   - Add consent checkboxes
   - Implement data retention policies
   - Add audit logging for access

---

## 📝 Summary

**Where parent contacts are stored:**
- Firestore: `students/{studentUid}` → `parentPhoneNumber` field

**Who can access:**
- ✅ Students (their own profile)
- ✅ Linked parents (via parent dashboard)
- ⚠️ Teachers/Admins (needs implementation)

**How to access:**
- Direct Firestore query
- React hooks (`useDoc`)
- Query by school/class

**Security:**
- Firestore security rules control access
- Role-based access needed for teachers/admins
- Privacy compliance required

---

**Last Updated:** [Current Date]

