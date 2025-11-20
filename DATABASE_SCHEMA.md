# Database Schema Documentation

## Email Requirement
**Strict Validation**: All users MUST use `@gre.ac.uk` email addresses

---

## Collections Structure

### 1. `users` Collection

Base document for all users (students and staff):

```typescript
{
  // Common Fields (All Users)
  uid: string;                    // Firebase Auth UID (document ID)
  name: string;                   // Full name
  email: string;                  // Must end with @gre.ac.uk
  role: 'student' | 'staff';      // User role
  department: string;             // Faculty/Department name
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  isActive: boolean;              // Account status
  
  // Student-Specific Fields (when role === 'student')
  studentId?: string;             // Student ID (e.g., 001234567)
  yearOfStudy?: number;           // 1, 2, 3, or 4
  program?: string;               // Degree program (e.g., "Computer Science BSc")
  enrollmentDate?: string;        // ISO timestamp
  
  // Staff-Specific Fields (when role === 'staff')
  staffId?: string;               // Staff ID
  position?: string;              // Job title (e.g., "Lecturer", "Professor")
  officeLocation?: string;        // Building and room number
}
```

---

### 2. `attendance` Collection

Track student attendance for classes:

```typescript
{
  id: string;                     // Auto-generated document ID
  studentId: string;              // Reference to user UID
  studentName: string;            // Student name (denormalized)
  studentNumber: string;          // Student ID number
  classId: string;                // Reference to classes collection
  className: string;              // Class name (denormalized)
  date: string;                   // ISO timestamp
  status: 'present' | 'absent' | 'late' | 'excused';
  scannedAt?: string;             // ISO timestamp when QR was scanned
  scannedBy?: string;             // Staff UID who recorded attendance
  notes?: string;                 // Optional notes
}
```

---

### 3. `classes` Collection

Course/class information:

```typescript
{
  id: string;                     // Auto-generated document ID
  code: string;                   // Course code (e.g., "COMP1001")
  name: string;                   // Course name
  department: string;             // Department offering the course
  instructorId: string;           // Staff UID
  instructorName: string;         // Instructor name (denormalized)
  semester: string;               // e.g., "Fall 2024", "Spring 2025"
  yearOfStudy: number;            // 1, 2, 3, or 4
  credits: number;                // Course credits
  schedule: {
    day: string;                  // e.g., "Monday", "Wednesday"
    startTime: string;            // e.g., "09:00"
    endTime: string;              // e.g., "11:00"
    location: string;             // Building and room
  }[];
  enrolledStudents: string[];     // Array of student UIDs
  maxCapacity: number;            // Maximum students
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
}
```

---

### 4. `grades` Collection

Student grades and assessments:

```typescript
{
  id: string;                     // Auto-generated document ID
  studentId: string;              // Reference to user UID
  studentName: string;            // Student name (denormalized)
  classId: string;                // Reference to classes collection
  className: string;              // Class name (denormalized)
  courseCode: string;             // Course code
  assessmentType: 'exam' | 'assignment' | 'quiz' | 'project' | 'participation';
  assessmentName: string;         // e.g., "Midterm Exam", "Final Project"
  score: number;                  // Points earned
  maxScore: number;               // Total possible points
  percentage: number;             // Calculated percentage
  grade: string;                  // Letter grade (A, B, C, etc.)
  weight: number;                 // Weight in final grade (e.g., 0.3 for 30%)
  dueDate?: string;               // ISO timestamp
  submittedAt?: string;           // ISO timestamp
  gradedBy: string;               // Staff UID
  gradedAt: string;               // ISO timestamp
  feedback?: string;              // Instructor feedback
  semester: string;               // e.g., "Fall 2024"
}
```

---

### 5. `announcements` Collection

Staff announcements to students:

```typescript
{
  id: string;                     // Auto-generated document ID
  title: string;                  // Announcement title
  content: string;                // Main message
  authorId: string;               // Staff UID
  authorName: string;             // Staff name (denormalized)
  department: string;             // Department or "All"
  targetAudience: 'all' | 'students' | 'staff' | 'specific';
  targetClasses?: string[];       // Array of class IDs (if specific)
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string;             // ISO timestamp (optional)
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  isActive: boolean;              // Show/hide announcement
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}
```

---

### 6. `timetable` Collection

Personal timetables (merged view of enrolled classes):

```typescript
{
  id: string;                     // Auto-generated document ID
  userId: string;                 // Student or Staff UID
  userRole: 'student' | 'staff';
  classId: string;                // Reference to classes collection
  className: string;              // Class name (denormalized)
  courseCode: string;             // Course code
  instructor: string;             // Instructor name
  day: string;                    // "Monday", "Tuesday", etc.
  startTime: string;              // "09:00"
  endTime: string;                // "11:00"
  location: string;               // Building and room
  color?: string;                 // UI color code
  semester: string;               // Active semester
}
```

---

### 7. `library` Collection

Library resources and borrowing records:

```typescript
{
  id: string;                     // Auto-generated document ID
  type: 'book' | 'journal' | 'media' | 'equipment';
  title: string;                  // Resource title
  author?: string;                // For books/journals
  isbn?: string;                  // For books
  category: string;               // Subject category
  location: string;               // Shelf location
  totalCopies: number;            // Total available
  availableCopies: number;        // Currently available
  borrowedBy?: {
    userId: string;               // Student UID
    userName: string;             // Student name
    borrowedAt: string;           // ISO timestamp
    dueDate: string;              // ISO timestamp
  }[];
  isAvailable: boolean;           // Quick check
  addedAt: string;                // ISO timestamp
}
```

---

### 8. `health` Collection

Student health records (basic):

```typescript
{
  id: string;                     // Auto-generated document ID
  studentId: string;              // Reference to user UID
  studentName: string;            // Student name (denormalized)
  bloodType?: string;             // A+, B-, O+, etc.
  allergies?: string[];           // List of allergies
  medications?: string[];         // Current medications
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  medicalHistory?: string;        // Brief history
  lastCheckup?: string;           // ISO timestamp
  updatedAt: string;              // ISO timestamp
}
```

---

### 9. `finance` Collection

Student financial records:

```typescript
{
  id: string;                     // Auto-generated document ID
  studentId: string;              // Reference to user UID
  studentName: string;            // Student name (denormalized)
  semester: string;               // e.g., "Fall 2024"
  tuitionFee: number;             // Total tuition
  otherFees: {
    name: string;                 // Fee name
    amount: number;               // Fee amount
  }[];
  totalAmount: number;            // Total owed
  paidAmount: number;             // Total paid
  balance: number;                // Remaining balance
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: string;                // ISO timestamp
  transactions?: {
    id: string;
    amount: number;
    method: string;               // "Card", "Bank Transfer", etc.
    date: string;                 // ISO timestamp
    reference: string;            // Transaction reference
  }[];
  updatedAt: string;              // ISO timestamp
}
```

---

### 10. `notifications` Collection

User notifications:

```typescript
{
  id: string;                     // Auto-generated document ID
  userId: string;                 // Recipient UID
  title: string;                  // Notification title
  message: string;                // Notification body
  type: 'announcement' | 'grade' | 'attendance' | 'finance' | 'library' | 'general';
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;                // Read status
  actionUrl?: string;             // Deep link to relevant screen
  createdAt: string;              // ISO timestamp
  readAt?: string;                // ISO timestamp when read
}
```

---

### 11. `meal_plans` Collection

Student meal plan information:

```typescript
{
  id: string;                     // Auto-generated document ID
  studentId: string;              // Reference to user UID
  studentName: string;            // Student name (denormalized)
  planType: 'unlimited' | 'weekly' | 'daily' | 'pay-as-you-go';
  mealsPerWeek?: number;          // For weekly plans
  balance?: number;               // For pay-as-you-go
  startDate: string;              // ISO timestamp
  endDate: string;                // ISO timestamp
  isActive: boolean;              // Plan status
  transactions?: {
    id: string;
    cafeteria: string;            // Location
    items: string[];              // Food items
    amount: number;               // Cost
    date: string;                 // ISO timestamp
  }[];
  updatedAt: string;              // ISO timestamp
}
```

---

## Security Rules

### Firestore Rules Template:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if email is @gre.ac.uk
    function hasValidEmail() {
      return request.auth.token.email.matches('.*@gre[.]ac[.]uk$');
    }
    
    // Helper function to check user role
    function isStudent() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }
    
    function isStaff() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'staff';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && hasValidEmail();
      allow create: if isAuthenticated() && hasValidEmail() && request.auth.uid == userId;
      allow update: if isAuthenticated() && hasValidEmail() && request.auth.uid == userId;
      allow delete: if false; // Prevent deletion
    }
    
    // Classes collection
    match /classes/{classId} {
      allow read: if isAuthenticated() && hasValidEmail();
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated() && hasValidEmail();
      allow create, update: if isAuthenticated() && hasValidEmail() && isStaff();
      allow delete: if false;
    }
    
    // Grades collection
    match /grades/{gradeId} {
      allow read: if isAuthenticated() && hasValidEmail() && 
                  (isStaff() || resource.data.studentId == request.auth.uid);
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Announcements collection
    match /announcements/{announcementId} {
      allow read: if isAuthenticated() && hasValidEmail();
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Library collection
    match /library/{libraryId} {
      allow read: if isAuthenticated() && hasValidEmail();
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Health collection
    match /health/{healthId} {
      allow read: if isAuthenticated() && hasValidEmail() && 
                  (isStaff() || resource.data.studentId == request.auth.uid);
      allow write: if isAuthenticated() && hasValidEmail() && 
                   resource.data.studentId == request.auth.uid;
    }
    
    // Finance collection
    match /finance/{financeId} {
      allow read: if isAuthenticated() && hasValidEmail() && 
                  (isStaff() || resource.data.studentId == request.auth.uid);
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, update: if isAuthenticated() && hasValidEmail() && 
                          resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && hasValidEmail();
      allow delete: if isAuthenticated() && hasValidEmail() && 
                    resource.data.userId == request.auth.uid;
    }
    
    // Meal plans collection
    match /meal_plans/{mealPlanId} {
      allow read: if isAuthenticated() && hasValidEmail() && 
                  (isStaff() || resource.data.studentId == request.auth.uid);
      allow write: if isAuthenticated() && hasValidEmail() && isStaff();
    }
    
    // Timetable collection
    match /timetable/{timetableId} {
      allow read: if isAuthenticated() && hasValidEmail() && 
                  resource.data.userId == request.auth.uid;
      allow write: if isAuthenticated() && hasValidEmail();
    }
  }
}
```

---

## Indexes Required

Create these composite indexes in Firebase Console:

1. **Attendance**: `studentId` (Ascending) + `date` (Descending)
2. **Grades**: `studentId` (Ascending) + `semester` (Ascending) + `gradedAt` (Descending)
3. **Classes**: `department` (Ascending) + `semester` (Ascending)
4. **Announcements**: `targetAudience` (Ascending) + `createdAt` (Descending) + `isActive` (Ascending)
5. **Notifications**: `userId` (Ascending) + `isRead` (Ascending) + `createdAt` (Descending)

---

## Sample Data Examples

### Student User:
```json
{
  "uid": "abc123xyz",
  "name": "John Smith",
  "email": "j.smith@gre.ac.uk",
  "role": "student",
  "studentId": "001234567",
  "department": "Faculty of Engineering & Science",
  "yearOfStudy": 2,
  "program": "Computer Science BSc (Hons)",
  "enrollmentDate": "2023-09-01T00:00:00.000Z",
  "createdAt": "2024-09-15T10:30:00.000Z",
  "updatedAt": "2024-11-20T08:15:00.000Z",
  "isActive": true
}
```

### Staff User:
```json
{
  "uid": "def456uvw",
  "name": "Dr. Sarah Johnson",
  "email": "s.johnson@gre.ac.uk",
  "role": "staff",
  "staffId": "STF789",
  "department": "Faculty of Engineering & Science",
  "position": "Senior Lecturer",
  "officeLocation": "Stockwell Street, Room 301",
  "createdAt": "2020-01-10T09:00:00.000Z",
  "updatedAt": "2024-11-20T08:15:00.000Z",
  "isActive": true
}
```
