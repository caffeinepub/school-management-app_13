import Nat "mo:core/Nat";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";



actor {
  // Data Models
  type Class = {
    id : Nat;
    name : Text;
  };

  type ClassAssignment = {
    classId : Nat;
    section : Text;
  };

  type Student = {
    id : Nat;
    name : Text;
    classId : Nat;
    section : Text;
  };

  type Subject = {
    id : Nat;
    name : Text;
    classId : Nat;
  };

  type Teacher = {
    id : Nat;
    name : Text;
    subject : Text;
    classAssignments : [ClassAssignment];
    periodStart : Text;
    periodEnd : Text;
  };

  type AttendanceRecord = {
    studentId : Nat;
    date : Text;
    present : Bool;
  };

  type Announcement = {
    id : Nat;
    title : Text;
    content : Text;
    date : Text;
  };

  // Stable storage (survives upgrades)
  stable var stableAnnouncements : [Announcement] = [];
  stable var stableClasses : [Class] = [];
  stable var stableStudents : [Student] = [];
  stable var stableSubjects : [Subject] = [];
  stable var stableTeachers : [Teacher] = [];
  stable var stableAttendance : [AttendanceRecord] = [];

  stable var announcementIdCounter = 1;
  stable var classIdCounter = 13;
  stable var studentIdCounter = 100;
  stable var subjectIdCounter = 200;
  stable var teacherIdCounter = 1;

  // In-memory working storage
  let announcements = Map.empty<Nat, Announcement>();
  let classes = Map.empty<Nat, Class>();
  let students = Map.empty<Nat, Student>();
  let subjects = Map.empty<Nat, Subject>();
  let teachers = Map.empty<Nat, Teacher>();
  let attendanceRecords = List.empty<AttendanceRecord>();

  // Restore from stable storage on upgrade
  do {
    for (a in stableAnnouncements.vals()) { announcements.add(a.id, a) };
    for (c in stableClasses.vals())       { classes.add(c.id, c) };
    for (s in stableStudents.vals())      { students.add(s.id, s) };
    for (s in stableSubjects.vals())      { subjects.add(s.id, s) };
    for (t in stableTeachers.vals())      { teachers.add(t.id, t) };
    for (r in stableAttendance.vals())    { attendanceRecords.add(r) };
  };

  // Seed: Classes 6 to 12 (only if fresh deploy)
  do {
    if (classes.size() == 0) {
      classes.add(6,  { id = 6;  name = "Class 6"  });
      classes.add(7,  { id = 7;  name = "Class 7"  });
      classes.add(8,  { id = 8;  name = "Class 8"  });
      classes.add(9,  { id = 9;  name = "Class 9"  });
      classes.add(10, { id = 10; name = "Class 10" });
      classes.add(11, { id = 11; name = "Class 11" });
      classes.add(12, { id = 12; name = "Class 12" });
    };
  };

  // Seed: UP Board Subjects per class (only if fresh deploy)
  do {
    if (subjects.size() == 0) {
      // Class 6 (UP Board)
      subjects.add(101, { id = 101; name = "Hindi";              classId = 6  });
      subjects.add(102, { id = 102; name = "English";            classId = 6  });
      subjects.add(103, { id = 103; name = "Mathematics";        classId = 6  });
      subjects.add(104, { id = 104; name = "Science";            classId = 6  });
      subjects.add(105, { id = 105; name = "Social Science";     classId = 6  });
      subjects.add(106, { id = 106; name = "Sanskrit";           classId = 6  });
      subjects.add(107, { id = 107; name = "Drawing";            classId = 6  });
      // Class 7 (UP Board)
      subjects.add(111, { id = 111; name = "Hindi";              classId = 7  });
      subjects.add(112, { id = 112; name = "English";            classId = 7  });
      subjects.add(113, { id = 113; name = "Mathematics";        classId = 7  });
      subjects.add(114, { id = 114; name = "Science";            classId = 7  });
      subjects.add(115, { id = 115; name = "Social Science";     classId = 7  });
      subjects.add(116, { id = 116; name = "Sanskrit";           classId = 7  });
      subjects.add(117, { id = 117; name = "Drawing";            classId = 7  });
      // Class 8 (UP Board)
      subjects.add(121, { id = 121; name = "Hindi";              classId = 8  });
      subjects.add(122, { id = 122; name = "English";            classId = 8  });
      subjects.add(123, { id = 123; name = "Mathematics";        classId = 8  });
      subjects.add(124, { id = 124; name = "Science";            classId = 8  });
      subjects.add(125, { id = 125; name = "Social Science";     classId = 8  });
      subjects.add(126, { id = 126; name = "Sanskrit";           classId = 8  });
      subjects.add(127, { id = 127; name = "Drawing";            classId = 8  });
      // Class 9 (UP Board High School)
      subjects.add(131, { id = 131; name = "Hindi";              classId = 9  });
      subjects.add(132, { id = 132; name = "English";            classId = 9  });
      subjects.add(133, { id = 133; name = "Mathematics";        classId = 9  });
      subjects.add(134, { id = 134; name = "Science";            classId = 9  });
      subjects.add(135, { id = 135; name = "Social Science";     classId = 9  });
      subjects.add(136, { id = 136; name = "Sanskrit";           classId = 9  });
      subjects.add(137, { id = 137; name = "Computer";           classId = 9  });
      subjects.add(138, { id = 138; name = "Drawing";            classId = 9  });
      // Class 10 (UP Board High School)
      subjects.add(141, { id = 141; name = "Hindi";              classId = 10 });
      subjects.add(142, { id = 142; name = "English";            classId = 10 });
      subjects.add(143, { id = 143; name = "Mathematics";        classId = 10 });
      subjects.add(144, { id = 144; name = "Science";            classId = 10 });
      subjects.add(145, { id = 145; name = "Social Science";     classId = 10 });
      subjects.add(146, { id = 146; name = "Sanskrit";           classId = 10 });
      subjects.add(147, { id = 147; name = "Computer";           classId = 10 });
      subjects.add(148, { id = 148; name = "Drawing";            classId = 10 });
      // Class 11 (UP Board Intermediate)
      subjects.add(151, { id = 151; name = "Hindi";              classId = 11 });
      subjects.add(152, { id = 152; name = "English";            classId = 11 });
      subjects.add(153, { id = 153; name = "Mathematics";        classId = 11 });
      subjects.add(154, { id = 154; name = "Physics";            classId = 11 });
      subjects.add(155, { id = 155; name = "Chemistry";          classId = 11 });
      subjects.add(156, { id = 156; name = "Biology";            classId = 11 });
      subjects.add(157, { id = 157; name = "History";            classId = 11 });
      subjects.add(158, { id = 158; name = "Geography";          classId = 11 });
      subjects.add(159, { id = 159; name = "Civics";             classId = 11 });
      subjects.add(160, { id = 160; name = "Economics";          classId = 11 });
      subjects.add(169, { id = 169; name = "Accountancy";        classId = 11 });
      subjects.add(170, { id = 170; name = "Business Studies";   classId = 11 });
      subjects.add(171, { id = 171; name = "Computer Science";   classId = 11 });
      // Class 12 (UP Board Intermediate)
      subjects.add(161, { id = 161; name = "Hindi";              classId = 12 });
      subjects.add(162, { id = 162; name = "English";            classId = 12 });
      subjects.add(163, { id = 163; name = "Mathematics";        classId = 12 });
      subjects.add(164, { id = 164; name = "Physics";            classId = 12 });
      subjects.add(165, { id = 165; name = "Chemistry";          classId = 12 });
      subjects.add(166, { id = 166; name = "Biology";            classId = 12 });
      subjects.add(167, { id = 167; name = "History";            classId = 12 });
      subjects.add(168, { id = 168; name = "Geography";          classId = 12 });
      subjects.add(172, { id = 172; name = "Civics";             classId = 12 });
      subjects.add(173, { id = 173; name = "Economics";          classId = 12 });
      subjects.add(174, { id = 174; name = "Accountancy";        classId = 12 });
      subjects.add(175, { id = 175; name = "Business Studies";   classId = 12 });
      subjects.add(176, { id = 176; name = "Computer Science";   classId = 12 });
    };
  };

  // Save data to stable storage before upgrade
  system func preupgrade() {
    stableAnnouncements := announcements.values().toArray();
    stableClasses       := classes.values().toArray();
    stableStudents      := students.values().toArray();
    stableSubjects      := subjects.values().toArray();
    stableTeachers      := teachers.values().toArray();
    stableAttendance    := attendanceRecords.toArray();
  };

  // Clear stable arrays after upgrade (data is now in Maps)
  system func postupgrade() {
    stableAnnouncements := [];
    stableClasses       := [];
    stableStudents      := [];
    stableSubjects      := [];
    stableTeachers      := [];
    stableAttendance    := [];
  };

  // CRUD Operations for Announcements
  public shared ({ caller }) func createAnnouncement(title : Text, content : Text, date : Text) : async Announcement {
    let newAnnouncement = { id = announcementIdCounter; title; content; date };
    announcements.add(announcementIdCounter, newAnnouncement);
    announcementIdCounter += 1;
    newAnnouncement;
  };

  public query ({ caller }) func getAnnouncement(id : Nat) : async ?Announcement {
    announcements.get(id);
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  public shared ({ caller }) func updateAnnouncement(id : Nat, title : Text, content : Text, date : Text) : async () {
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?_) {
        announcements.add(id, { id; title; content; date });
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement not found");
    };
    announcements.remove(id);
  };

  // CRUD Operations for Classes
  public shared ({ caller }) func createClass(name : Text) : async Class {
    let newClass = { id = classIdCounter; name };
    classes.add(classIdCounter, newClass);
    classIdCounter += 1;
    newClass;
  };

  public query ({ caller }) func getClass(id : Nat) : async ?Class {
    classes.get(id);
  };

  public query ({ caller }) func getAllClasses() : async [Class] {
    classes.values().toArray();
  };

  public shared ({ caller }) func updateClass(id : Nat, name : Text) : async () {
    switch (classes.get(id)) {
      case (null) { Runtime.trap("Class not found") };
      case (?_) {
        classes.add(id, { id; name });
      };
    };
  };

  public shared ({ caller }) func deleteClass(id : Nat) : async () {
    if (not classes.containsKey(id)) {
      Runtime.trap("Class not found");
    };
    classes.remove(id);
  };

  // CRUD Operations for Students
  public shared ({ caller }) func createStudent(name : Text, classId : Nat, section : Text) : async Student {
    let newStudent = { id = studentIdCounter; name; classId; section };
    students.add(studentIdCounter, newStudent);
    studentIdCounter += 1;
    newStudent;
  };

  public query ({ caller }) func getStudent(id : Nat) : async ?Student {
    students.get(id);
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    students.values().toArray();
  };

  public shared ({ caller }) func updateStudent(id : Nat, name : Text, classId : Nat, section : Text) : async () {
    switch (students.get(id)) {
      case (null) { Runtime.trap("Student not found") };
      case (?_) {
        students.add(id, { id; name; classId; section });
      };
    };
  };

  public shared ({ caller }) func deleteStudent(id : Nat) : async () {
    if (not students.containsKey(id)) {
      Runtime.trap("Student not found");
    };
    students.remove(id);
  };

  // CRUD Operations for Subjects
  public shared ({ caller }) func createSubject(name : Text, classId : Nat) : async Subject {
    let newSubject = { id = subjectIdCounter; name; classId };
    subjects.add(subjectIdCounter, newSubject);
    subjectIdCounter += 1;
    newSubject;
  };

  public query ({ caller }) func getSubject(id : Nat) : async ?Subject {
    subjects.get(id);
  };

  public query ({ caller }) func getAllSubjects() : async [Subject] {
    subjects.values().toArray();
  };

  public shared ({ caller }) func updateSubject(id : Nat, name : Text, classId : Nat) : async () {
    switch (subjects.get(id)) {
      case (null) { Runtime.trap("Subject not found") };
      case (?_) {
        subjects.add(id, { id; name; classId });
      };
    };
  };

  public shared ({ caller }) func deleteSubject(id : Nat) : async () {
    if (not subjects.containsKey(id)) {
      Runtime.trap("Subject not found");
    };
    subjects.remove(id);
  };

  // CRUD Operations for Teachers
  public shared ({ caller }) func createTeacher(name : Text, subject : Text, classAssignments : [ClassAssignment], periodStart : Text, periodEnd : Text) : async Teacher {
    let newTeacher = { id = teacherIdCounter; name; subject; classAssignments; periodStart; periodEnd };
    teachers.add(teacherIdCounter, newTeacher);
    teacherIdCounter += 1;
    newTeacher;
  };

  public query ({ caller }) func getTeacher(id : Nat) : async ?Teacher {
    teachers.get(id);
  };

  public query ({ caller }) func getAllTeachers() : async [Teacher] {
    teachers.values().toArray();
  };

  public shared ({ caller }) func updateTeacher(id : Nat, name : Text, subject : Text, classAssignments : [ClassAssignment], periodStart : Text, periodEnd : Text) : async () {
    switch (teachers.get(id)) {
      case (null) { Runtime.trap("Teacher not found") };
      case (?_) {
        teachers.add(id, { id; name; subject; classAssignments; periodStart; periodEnd });
      };
    };
  };

  public shared ({ caller }) func deleteTeacher(id : Nat) : async () {
    if (not teachers.containsKey(id)) {
      Runtime.trap("Teacher not found");
    };
    teachers.remove(id);
  };

  // Attendance Operations
  public shared ({ caller }) func markAttendance(studentId : Nat, date : Text, present : Bool) : async () {
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?_) {
        let newRecord = {
          studentId;
          date;
          present;
        };
        attendanceRecords.add(newRecord);
      };
    };
  };

  public query ({ caller }) func getAttendanceRecords(studentId : Nat) : async [AttendanceRecord] {
    let filteredRecords = attendanceRecords.filter(
      func(record) { record.studentId == studentId }
    );
    filteredRecords.toArray();
  };

  // Query students by classId
  public query ({ caller }) func getStudentsByClass(classId : Nat) : async [Student] {
    let filteredStudents = students.filter(
      func(_, student) { student.classId == classId }
    );
    let valuesIter = filteredStudents.values();
    valuesIter.toArray();
  };

  // Query subjects by classId
  public query ({ caller }) func getSubjectsByClass(classId : Nat) : async [Subject] {
    let filteredSubjects = subjects.filter(
      func(_, subject) { subject.classId == classId }
    );
    let valuesIter = filteredSubjects.values();
    valuesIter.toArray();
  };
};
