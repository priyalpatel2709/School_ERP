const mongoose = require("mongoose");

// Phase 1 Models
const getUserModel = require("../models/userModel");
const getTeacherModel = require("../models/teacherModel");
const getStudentModel = require("../models/studentModel");
const getClassModel = require("../models/classModel");
const getSubjectModel = require("../models/subjectModel");
const getSchoolDetailModel = require("../models/schoolDetailModel");
const getTimeTableModel = require("../models/timeTableModel");

// Phase 2 Models
const getRoleModel = require("../models/roleModel");
const getNotificationModel = require("../models/notificationModel");
const getHomeworkModel = require("../models/homeWorkModel");
const getFeeStructureModel = require("../models/feeStructureModel");
const getFeeInvoiceModel = require("../models/feeInvoiceModel");
const getFeePaymentModel = require("../models/feePaymentModel");
const getExaminationModel = require("../models/examinationModel");
const getExamResultModel = require("../models/examResultModel");
const getGradingSystemModel = require("../models/gradingSystemModel");
const getStudentAttendanceModel = require("../models/studentAttendanceModel");
const getStaffAttendanceModel = require("../models/staffAttendanceModel");
const getLeaveApplicationModel = require("../models/leaveApplicationModel");
const getAdmissionApplicationModel = require("../models/admissionApplicationModel");
const getPayrollRunModel = require("../models/payrollRunModel");
const getTransportRouteModel = require("../models/transportRouteModel");
const getTransportVehicleModel = require("../models/transportVehicleModel");
const getLibraryItemModel = require("../models/libraryItemModel");
const getLibraryBorrowingModel = require("../models/libraryBorrowingModel");
const getSubstitutionModel = require("../models/substitutionModel");
const getFeeAuditLogModel = require("../models/feeAuditLogModel");

const { connectToDatabase } = require("../config/db");
let userDB, schoolDB, schoolDBSecondary;

const connectDB = async () => {
  try {
    userDB = await connectToDatabase("Users");
    schoolDB = await connectToDatabase("ABC");
    schoolDBSecondary = await connectToDatabase("XYZ");
    console.log("Connected to databases successfully (Users, ABC, XYZ)");
  } catch (error) {
    console.error("Failed to connect to databases:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Initialize Phase 1 Models
    const User = getUserModel(userDB);
    const Teacher = getTeacherModel(schoolDB);
    const Student = getStudentModel(schoolDB);
    const Class = getClassModel(schoolDB);
    const Subject = getSubjectModel(schoolDB);
    const SchoolDetail = getSchoolDetailModel(schoolDB);
    const TimeTable = getTimeTableModel(schoolDB);

    // Initialize Phase 2 Models
    const Role = getRoleModel(userDB);
    const Notification = getNotificationModel(schoolDB);
    const Homework = getHomeworkModel(schoolDB);
    const FeeStructure = getFeeStructureModel(schoolDB);
    const FeeInvoice = getFeeInvoiceModel(schoolDB);
    const FeePayment = getFeePaymentModel(schoolDB);
    const FeeAuditLog = getFeeAuditLogModel(schoolDB);
    const Examination = getExaminationModel(schoolDB);
    const ExamResult = getExamResultModel(schoolDB);
    const GradingSystem = getGradingSystemModel(schoolDB);
    const StudentAttendance = getStudentAttendanceModel(schoolDB);
    const StaffAttendance = getStaffAttendanceModel(schoolDB);
    const LeaveApplication = getLeaveApplicationModel(schoolDB);
    const AdmissionApplication = getAdmissionApplicationModel(schoolDB);
    const PayrollRun = getPayrollRunModel(schoolDB);
    const TransportRoute = getTransportRouteModel(schoolDB);
    const TransportVehicle = getTransportVehicleModel(schoolDB);
    const LibraryItem = getLibraryItemModel(schoolDB);
    const LibraryBorrowing = getLibraryBorrowingModel(schoolDB);
    const Substitution = getSubstitutionModel(schoolDB);

    // Create users with detailed fields
    const users = await User.create([
      {
        name: {
          firstName: "John",
          middleName: "A",
          lastName: "Doe",
        },
        gender: "male",
        dateOfBirth: "1980-01-01",
        cast: "General",
        religion: "Christianity",
        userImage: "john_image_url",
        email: "john@example.com",
        loginID: "john_doe",
        password: "123",
        deviceToken: "token123",
        schoolID: "school_ABC",
        isActive: true,
        age: 44,
        address: {
          permanentAddress: {
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Teacher",
        medicalRecode: {
          bloodGoop: "O+",
          height: 180,
          weight: 75,
        },
        metaData: [{ key: "hobby", value: "Reading" }],
      },
      {
        name: {
          firstName: "Jane",
          middleName: "B",
          lastName: "Smith",
        },
        gender: "female",
        dateOfBirth: "1985-05-05",
        cast: "OBC",
        religion: "Hinduism",
        userImage: "jane_image_url",
        email: "jane@example.com",
        loginID: "jane_smith",
        password: "123",
        deviceToken: "token456",
        schoolID: "school_ABC",
        isActive: true,
        age: 39,
        address: {
          permanentAddress: {
            street: "456 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "456 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        medicalRecode: {
          bloodGoop: "A+",
          height: 165,
          weight: 60,
        },
        roleName: "Teacher",
        metaData: [{ key: "hobby", value: "Cooking" }],
      },
      {
        name: {
          firstName: "Alice",
          middleName: "C",
          lastName: "Johnson",
        },
        gender: "female",
        dateOfBirth: "1975-03-15",
        cast: "General",
        religion: "Christianity",
        userImage: "alice_image_url",
        email: "alice@example.com",
        loginID: "alice_johnson",
        password: "123",
        deviceToken: "token789",
        schoolID: "school_ABC",
        isActive: true,
        age: 49,
        address: {
          permanentAddress: {
            street: "789 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "789 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Teacher",
        medicalRecode: {
          bloodGoop: "B+",
          height: 170,
          weight: 65,
        },
        metaData: [{ key: "hobby", value: "Gardening" }],
      },
      {
        name: {
          firstName: "Bob",
          middleName: "D",
          lastName: "Brown",
        },
        gender: "male",
        dateOfBirth: "1990-10-20",
        cast: "SC",
        religion: "Islam",
        userImage: "bob_image_url",
        email: "bob@example.com",
        loginID: "bob_brown",
        password: "123",
        deviceToken: "token101",
        schoolID: "school_ABC",
        isActive: true,
        age: 33,
        address: {
          permanentAddress: {
            street: "101 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "101 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Teacher",
        medicalRecode: {
          bloodGoop: "AB+",
          height: 175,
          weight: 70,
        },
        metaData: [{ key: "hobby", value: "Music" }],
      },
      {
        name: {
          firstName: "Charlie",
          middleName: "E",
          lastName: "Davis",
        },
        gender: "male",
        dateOfBirth: "1982-07-07",
        cast: "General",
        religion: "Christianity",
        userImage: "charlie_image_url",
        email: "charlie@example.com",
        loginID: "charlie_davis",
        password: "123",
        deviceToken: "token202",
        schoolID: "school_ABC",
        isActive: true,
        age: 42,
        address: {
          permanentAddress: {
            street: "202 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "202 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Teacher",
        medicalRecode: {
          bloodGoop: "O-",
          height: 185,
          weight: 80,
        },
        metaData: [{ key: "hobby", value: "Sports" }],
      },
      {
        name: {
          firstName: "Diana",
          middleName: "F",
          lastName: "Evans",
        },
        gender: "female",
        dateOfBirth: "1987-02-12",
        cast: "ST",
        religion: "Buddhism",
        userImage: "diana_image_url",
        email: "diana@example.com",
        loginID: "diana_evans",
        password: "123",
        deviceToken: "token303",
        schoolID: "school_ABC",
        isActive: true,
        age: 37,
        address: {
          permanentAddress: {
            street: "303 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "303 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Student",
        medicalRecode: {
          bloodGoop: "A-",
          height: 160,
          weight: 55,
        },
        metaData: [{ key: "hobby", value: "Traveling" }],
      },
      {
        name: {
          firstName: "Emily",
          middleName: "G",
          lastName: "Frank",
        },
        gender: "female",
        dateOfBirth: "1998-08-30",
        cast: "OBC",
        religion: "Hinduism",
        userImage: "emily_image_url",
        email: "emily@example.com",
        loginID: "emily_frank",
        password: "123",
        deviceToken: "token404",
        schoolID: "school_ABC",
        isActive: true,
        age: 25,
        address: {
          permanentAddress: {
            street: "404 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "404 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        medicalRecode: {
          bloodGoop: "B-",
          height: 155,
          weight: 50,
        },
        roleName: "Student",
        metaData: [{ key: "hobby", value: "Photography" }],
      },
      {
        name: {
          firstName: "Frank",
          middleName: "H",
          lastName: "Green",
        },
        gender: "male",
        dateOfBirth: "1992-11-11",
        cast: "General",
        religion: "Christianity",
        userImage: "frank_image_url",
        email: "frank@example.com",
        loginID: "frank_green",
        password: "123",
        deviceToken: "token505",
        schoolID: "school_ABC",
        isActive: true,
        age: 31,
        address: {
          permanentAddress: {
            street: "505 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "505 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        medicalRecode: {
          bloodGoop: "O+",
          height: 178,
          weight: 72,
        },
        roleName: "Student",
        metaData: [{ key: "hobby", value: "Painting" }],
      },
      {
        name: {
          firstName: "George",
          middleName: "I",
          lastName: "Hill",
        },
        gender: "male",
        dateOfBirth: "1996-06-14",
        cast: "SC",
        religion: "Islam",
        userImage: "george_image_url",
        email: "george@example.com",
        loginID: "george_hill",
        password: "123",
        deviceToken: "token606",
        schoolID: "school_ABC",
        isActive: true,
        age: 28,
        address: {
          permanentAddress: {
            street: "606 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "606 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        medicalRecode: {
          bloodGoop: "AB-",
          height: 180,
          weight: 70,
        },
        roleName: "Student",
        metaData: [{ key: "hobby", value: "Dancing" }],
      },
      {
        name: {
          firstName: "Hannah",
          middleName: "J",
          lastName: "Irwin",
        },
        gender: "female",
        dateOfBirth: "2000-04-25",
        cast: "General",
        religion: "Christianity",
        userImage: "hannah_image_url",
        email: "hannah@example.com",
        loginID: "hannah_irwin",
        password: "123",
        deviceToken: "token707",
        schoolID: "school_ABC",
        isActive: true,
        age: 24,
        address: {
          permanentAddress: {
            street: "707 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "707 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        medicalRecode: {
          bloodGoop: "B+",
          height: 158,
          weight: 52,
        },
        roleName: "Student",
        metaData: [{ key: "hobby", value: "Writing" }],
      },
    ]);

    const librarianUsers = await User.create([
      {
        name: {
          firstName: "Laura",
          middleName: "K",
          lastName: "Bookman",
        },
        gender: "female",
        dateOfBirth: "1984-06-01",
        email: "librarian@springfieldhigh.edu",
        loginID: "librarian_abc",
        password: "123",
        deviceToken: "token_lib",
        schoolID: "school_ABC",
        isActive: true,
        age: 41,
        address: {
          permanentAddress: {
            street: "200 Library Ln",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
          currentAddress: {
            street: "200 Library Ln",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "USA",
          },
        },
        roleName: "Librarian",
        metaData: [{ key: "dept", value: "Library" }],
      },
    ]);
    const librarianUser = librarianUsers[0];

    // Create teachers
    const teachers = await Teacher.create([
      {
        user: users[0]._id,
        salary: { basic: 50000, allowances: 5000 },
      },
      {
        user: users[1]._id,
        salary: { basic: 55000, allowances: 4500 },
      },
      {
        user: users[2]._id,
        salary: { basic: 55000, allowances: 4500 },
      },
      {
        user: users[3]._id,
        salary: { basic: 55000, allowances: 4500 },
      },
      {
        user: users[4]._id,
        salary: { basic: 55000, allowances: 4500 },
      },
    ]);

    // Create students
    const students = await Student.create([
      {
        rollNumber: 1,
        user: users[5]._id,
        academicYear: "2024-07-10T00:00:00.000Z",
        admissionDate: "2024-07-10T00:00:00.000Z",
        admissionNumber: 12345,
        previousSchoolDetails: [
          {
            Detail: "Previous School 1",
          },
        ],
        guardianInfo: [
          {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            relation: "Mother",
            phone: "0987654321",
            photo: "photo_url",
            occupation: "Doctor",
            address: "456 Main St",
          },
        ],
        documentInfo: [
          {
            documentName: "Birth Certificate",
            documentLink: "link_to_birth_certificate",
          },
        ],
        bankInfo: [
          {
            bankName: "Bank B",
            bankAccountNumber: "987654321",
            IfscNumber: "IFSC002",
          },
        ],
        metaData: [
          {
            key: "extraCurricular",
            value: "Basketball",
          },
        ],
      },
      {
        rollNumber: 2,
        user: users[6]._id,
        academicYear: "2024-07-10T00:00:00.000Z",
        admissionDate: "2024-07-10T00:00:00.000Z",
        admissionNumber: 12346,
        previousSchoolDetails: [
          {
            Detail: "Previous School 2",
          },
        ],
        guardianInfo: [
          {
            name: "John Doe",
            email: "john.doe@example.com",
            relation: "Father",
            phone: "1234567890",
            photo: "photo_url",
            occupation: "Engineer",
            address: "123 Main St",
          },
        ],
        documentInfo: [
          {
            documentName: "Birth Certificate",
            documentLink: "link_to_birth_certificate",
          },
        ],
        bankInfo: [
          {
            bankName: "Bank A",
            bankAccountNumber: "123456789",
            IfscNumber: "IFSC001",
          },
        ],
        metaData: [
          {
            key: "extraCurricular",
            value: "Soccer",
          },
        ],
      },
      {
        rollNumber: 3,
        user: users[7]._id,
        academicYear: "2024-07-10T00:00:00.000Z",
        admissionDate: "2024-07-10T00:00:00.000Z",
        admissionNumber: 12347,
        previousSchoolDetails: [
          {
            Detail: "Previous School 3",
          },
        ],
        guardianInfo: [
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            relation: "Mother",
            phone: "1122334455",
            photo: "photo_url",
            occupation: "Nurse",
            address: "789 Main St",
          },
        ],
        documentInfo: [
          {
            documentName: "Birth Certificate",
            documentLink: "link_to_birth_certificate",
          },
        ],
        bankInfo: [
          {
            bankName: "Bank C",
            bankAccountNumber: "223344556",
            IfscNumber: "IFSC003",
          },
        ],
        metaData: [
          {
            key: "extraCurricular",
            value: "Music",
          },
        ],
      },
      {
        rollNumber: 4,
        user: users[8]._id,
        academicYear: "2024-07-10T00:00:00.000Z",
        admissionDate: "2024-07-10T00:00:00.000Z",
        admissionNumber: 12348,
        previousSchoolDetails: [
          {
            Detail: "Previous School 4",
          },
        ],
        guardianInfo: [
          {
            name: "Bob Brown",
            email: "bob.brown@example.com",
            relation: "Father",
            phone: "2233445566",
            photo: "photo_url",
            occupation: "Teacher",
            address: "101 Main St",
          },
        ],
        documentInfo: [
          {
            documentName: "Birth Certificate",
            documentLink: "link_to_birth_certificate",
          },
        ],
        bankInfo: [
          {
            bankName: "Bank D",
            bankAccountNumber: "334455667",
            IfscNumber: "IFSC004",
          },
        ],
        metaData: [
          {
            key: "extraCurricular",
            value: "Art",
          },
        ],
      },
      {
        rollNumber: 5,
        user: users[9]._id,
        academicYear: "2024-07-10T00:00:00.000Z",
        admissionDate: "2024-07-10T00:00:00.000Z",
        admissionNumber: 12349,
        previousSchoolDetails: [
          {
            Detail: "Previous School 5",
          },
        ],
        guardianInfo: [
          {
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            relation: "Guardian",
            phone: "3344556677",
            photo: "photo_url",
            occupation: "Lawyer",
            address: "202 Main St",
          },
        ],
        documentInfo: [
          {
            documentName: "Birth Certificate",
            documentLink: "link_to_birth_certificate",
          },
        ],
        bankInfo: [
          {
            bankName: "Bank E",
            bankAccountNumber: "445566778",
            IfscNumber: "IFSC005",
          },
        ],
        metaData: [
          {
            key: "extraCurricular",
            value: "Drama",
          },
        ],
      },
    ]);

    // Create subjects
    const subjects = await Subject.create([
      {
        name: "Mathematics",
        code: "MATH101",
        description: "Basic Math",
      },
      {
        name: "English",
        code: "ENG101",
        description: "Basic English",
      },
      {
        name: "Science",
        code: "SCI101",
        description: "Basic Science",
      },
      {
        name: "History",
        code: "HIST101",
        description: "World History",
      },
      {
        name: "Geography",
        code: "GEO101",
        description: "Physical Geography",
      },
      {
        name: "Physics",
        code: "PHY101",
        description: "Introduction to Physics",
      },
      {
        name: "Chemistry",
        code: "CHEM101",
        description: "Introduction to Chemistry",
      },
      {
        name: "Biology",
        code: "BIO101",
        description: "Introduction to Biology",
      },
      {
        name: "Computer Science",
        code: "CS101",
        description: "Introduction to Computer Science",
      },
      {
        name: "Physical Education",
        code: "PE101",
        description: "Basic Physical Education",
      },
    ]);

    // Create classes
    const classes = await Class.create([
      {
        classNumber: "10",
        division: "A",
        classTeacher: teachers[0]._id,
        academicYear: "2025-2026",
        students: [
          students[0]._id,
          students[1]._id,
          students[2]._id,
          students[3]._id,
          students[4]._id,
        ],
        subjects: [
          subjects[5]._id,
          subjects[6]._id,
          subjects[7]._id,
          subjects[8]._id,
          subjects[9]._id,
        ],
        metaData: [{ key: "classInfo", value: "Top Class" }],
      },
      {
        classNumber: "10",
        division: "B",
        classTeacher: teachers[1]._id,
        academicYear: "2025-2026",
        students: [
          students[0]._id,
          students[1]._id,
          students[2]._id,
          students[3]._id,
          students[4]._id,
        ],
        subjects: [
          subjects[0]._id,
          subjects[1]._id,
          subjects[2]._id,
          subjects[3]._id,
          subjects[4]._id,
        ],
        metaData: [{ key: "classInfo", value: "Average Class" }],
      },
    ]);

    // * update student add class info student data
    //class 1
    await Student.findByIdAndUpdate(students[0]._id, { class: classes[0]._id });
    await Student.findByIdAndUpdate(students[1]._id, { class: classes[0]._id });

    //class 2
    await Student.findByIdAndUpdate(students[2]._id, { class: classes[1]._id });
    await Student.findByIdAndUpdate(students[3]._id, { class: classes[1]._id });
    await Student.findByIdAndUpdate(students[4]._id, { class: classes[1]._id });

    // * update teacher
    await Teacher.findByIdAndUpdate(teachers[0]._id, {
      classes: [classes[0]._id],
      subjects: [
        subjects[0]._id,
        subjects[1]._id,
        subjects[2]._id,
        subjects[3]._id,
        subjects[4]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[1]._id, {
      classes: [classes[1]._id],
      subjects: [subjects[0]._id, subjects[1]._id, subjects[2]._id],
    });
    await Teacher.findByIdAndUpdate(teachers[2]._id, {
      classes: [classes[1]._id],
      subjects: [subjects[5]._id, subjects[7]._id, subjects[8]._id],
    });
    await Teacher.findByIdAndUpdate(teachers[2]._id, {
      classes: [classes[1]._id],
      subjects: [subjects[2]._id, subjects[5]._id, subjects[1]._id],
    });
    await Teacher.findByIdAndUpdate(teachers[2]._id, {
      classes: [classes[0]._id],
      subjects: [subjects[1]._id, subjects[7]._id, subjects[9]._id],
    });

    await Teacher.findByIdAndUpdate(teachers[3]._id, {
      classes: [classes[0]._id, classes[1]._id],
      subjects: [
        subjects[3]._id,
        subjects[4]._id,
        subjects[5]._id,
        subjects[6]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[4]._id, {
      classes: [classes[0]._id, classes[1]._id],
      subjects: [
        subjects[5]._id,
        subjects[6]._id,
        subjects[7]._id,
        subjects[8]._id,
        subjects[9]._id,
      ],
    });

    // Qualified subjects (must include assigned subjects when list is non-empty)
    await Teacher.findByIdAndUpdate(teachers[0]._id, {
      qualifiedSubjects: [
        subjects[0]._id,
        subjects[1]._id,
        subjects[2]._id,
        subjects[3]._id,
        subjects[4]._id,
        subjects[8]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[1]._id, {
      qualifiedSubjects: [
        subjects[0]._id,
        subjects[1]._id,
        subjects[2]._id,
        subjects[3]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[2]._id, {
      qualifiedSubjects: [
        subjects[0]._id,
        subjects[1]._id,
        subjects[2]._id,
        subjects[5]._id,
        subjects[7]._id,
        subjects[8]._id,
        subjects[9]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[3]._id, {
      qualifiedSubjects: [
        subjects[3]._id,
        subjects[4]._id,
        subjects[5]._id,
        subjects[6]._id,
        subjects[7]._id,
      ],
    });
    await Teacher.findByIdAndUpdate(teachers[4]._id, {
      qualifiedSubjects: [
        subjects[2]._id,
        subjects[5]._id,
        subjects[6]._id,
        subjects[7]._id,
        subjects[8]._id,
        subjects[9]._id,
      ],
    });

    await Student.findByIdAndUpdate(students[0]._id, {
      siblings: [students[1]._id],
    });
    await Student.findByIdAndUpdate(students[1]._id, {
      siblings: [students[0]._id],
    });

    // create time table
    const timeTable = await TimeTable.create([
      {
        class: classes[0]._id,
        academicYear: "2025-2026",
        week: {
          Monday: [
            {
              subject: subjects[0]._id,
              teacher: teachers[0]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 101,
            },
            {
              subject: subjects[1]._id,
              teacher: teachers[1]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 102,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[2]._id,
              teacher: teachers[2]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 103,
            },
            {
              subject: subjects[3]._id,
              teacher: teachers[3]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 104,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[4]._id,
              teacher: teachers[4]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 105,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 106,
            },
          ],
          Tuesday: [
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 107,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 108,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 109,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 110,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[3]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 101,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[2]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 102,
            },
          ],
          Wednesday: [
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 103,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 104,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 105,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 106,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 107,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 108,
            },
          ],
          Thursday: [
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 109,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 110,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[3]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 101,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[2]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 102,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 103,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 104,
            },
          ],
          Friday: [
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 105,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 106,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 107,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 108,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 109,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 110,
            },
          ],
          Saturday: [
            {
              subject: subjects[5]._id,
              teacher: teachers[3]._id,
              startTime: "09:00 AM",
              endTime: "10:00 AM",
              isBreak: false,
              classRoom: 101,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[2]._id,
              startTime: "10:00 AM",
              endTime: "11:00 AM",
              isBreak: false,
              classRoom: 102,
            },
            {
              isBreak: true,
              startTime: "11:00 AM",
              endTime: "11:15 AM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "11:15 AM",
              endTime: "12:15 PM",
              isBreak: false,
              classRoom: 103,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "12:15 PM",
              endTime: "01:15 PM",
              isBreak: false,
              classRoom: 104,
            },
            {
              isBreak: true,
              startTime: "01:15 PM",
              endTime: "01:45 PM",
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[4]._id,
              startTime: "01:45 PM",
              endTime: "02:45 PM",
              isBreak: false,
              classRoom: 105,
            },
            {
              subject: subjects[5]._id,
              teacher: teachers[0]._id,
              startTime: "02:45 PM",
              endTime: "03:45 PM",
              isBreak: false,
              classRoom: 106,
            },
          ],
        },
        metaData: [
          {
            key: "term",
            value: "Spring 2024",
          },
        ],
      },
    ]);

    // * update class add time table

    await Class.findByIdAndUpdate(classes[0]._id, {
      timeTable: timeTable[0]._id,
    });
    await Class.findByIdAndUpdate(classes[1]._id, {
      timeTable: timeTable[0]._id,
    });

    // Create school details
    const schoolDetail = await SchoolDetail.create({
      name: "Springfield High School",
      address: {
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62701",
        country: "USA",
      },
      phone: "123-456-7890",
      email: "info@springfieldhigh.edu",
      established: new Date("1990-09-01"),
      maxStudents: 1000,
      maxStaff: 100,
      schoolImage: "school_image_url",
      metaData: [{ key: "motto", value: "Knowledge is Power" }],
    });

    const SchoolDetailXYZ = getSchoolDetailModel(schoolDBSecondary);
    await SchoolDetailXYZ.create({
      name: "Westbrook Academy",
      address: {
        street: "500 West St",
        city: "Rivertown",
        state: "IL",
        zip: "62702",
        country: "USA",
      },
      phone: "555-0100",
      email: "info@westbrook.edu",
      established: new Date("2005-09-01"),
      maxStudents: 500,
      maxStaff: 50,
      schoolImage: "westbrook_school_image_url",
      metaData: [{ key: "motto", value: "Learning Together" }],
    });

    console.log("✓ Phase 1 data seeded successfully");
    console.log("Starting Phase 2 data seeding...");

    // ========================================
    // PHASE 2: ROLES
    // ========================================
    const roles = await Role.create([
      {
        roleName: "Admin",
        access: [
          "user:read",
          "user:write",
          "user:delete",
          "class:read",
          "class:write",
          "teacher:read",
          "teacher:write",
          "student:read",
          "student:write",
          "fee:read",
          "fee:write",
          "exam:read",
          "exam:write",
          "attendance:read",
          "attendance:write",
          "notification:read",
          "notification:write",
        ],
        metaData: [{ key: "description", value: "Full system access" }],
      },
      {
        roleName: "Teacher",
        access: [
          "class:read",
          "student:read",
          "homework:read",
          "homework:write",
          "attendance:read",
          "attendance:write",
          "exam:read",
          "notification:read",
        ],
        metaData: [{ key: "description", value: "Teacher access" }],
      },
      {
        roleName: "Student",
        access: [
          "homework:read",
          "attendance:read",
          "exam:read",
          "notification:read",
          "fee:read",
        ],
        metaData: [{ key: "description", value: "Student access" }],
      },
      {
        roleName: "Parent",
        access: [
          "student:read",
          "homework:read",
          "attendance:read",
          "exam:read",
          "notification:read",
          "fee:read",
          "fee:write",
        ],
        metaData: [{ key: "description", value: "Parent access" }],
      },
      {
        roleName: "Accountant",
        access: ["fee:read", "fee:write", "student:read", "user:read"],
        metaData: [{ key: "description", value: "Finance access" }],
      },
      {
        roleName: "Librarian",
        access: [
          "library:read",
          "library:write",
          "student:read",
          "notification:read",
        ],
        metaData: [{ key: "description", value: "Library circulation" }],
      },
    ]);

    console.log("✓ Roles created");

    const adminRoleDoc = roles.find((r) => r.roleName === "Admin") || roles[0];
    const adminUsers = await User.create([
      {
        name: {
          firstName: "Alex",
          middleName: "",
          lastName: "Administrator",
        },
        gender: "male",
        email: "admin@springfieldhigh.edu",
        loginID: "admin_abc",
        password: "123",
        schoolID: "school_ABC",
        isActive: true,
        roleName: "Admin",
        role: adminRoleDoc._id,
        access: [...(adminRoleDoc.access || [])],
        metaData: [{ key: "seed", value: "single-school-admin" }],
      },
      {
        name: {
          firstName: "Morgan",
          middleName: "",
          lastName: "DistrictAdmin",
        },
        gender: "female",
        email: "multi.admin@demo.edu",
        loginID: "admin_multi",
        password: "123",
        schoolID: "school_ABC",
        schoolIDs: ["school_ABC", "school_XYZ"],
        isActive: true,
        roleName: "Admin",
        role: adminRoleDoc._id,
        access: [...(adminRoleDoc.access || [])],
        metaData: [{ key: "seed", value: "multi-school-admin" }],
      },
    ]);
    console.log("✓ Admin users created (single-school + multi-school)");

    // ========================================
    // PHASE 2: GRADING SYSTEM
    // ========================================
    const gradingSystem = await GradingSystem.create({
      systemName: "Standard Grading System",
      academicYear: "2025-2026",
      gradingScale: [
        {
          grade: "A+",
          minPercentage: 90,
          maxPercentage: 100,
          gradePoint: 10,
          description: "Outstanding",
          isPassing: true,
        },
        {
          grade: "A",
          minPercentage: 80,
          maxPercentage: 89,
          gradePoint: 9,
          description: "Excellent",
          isPassing: true,
        },
        {
          grade: "B+",
          minPercentage: 70,
          maxPercentage: 79,
          gradePoint: 8,
          description: "Very Good",
          isPassing: true,
        },
        {
          grade: "B",
          minPercentage: 60,
          maxPercentage: 69,
          gradePoint: 7,
          description: "Good",
          isPassing: true,
        },
        {
          grade: "C",
          minPercentage: 50,
          maxPercentage: 59,
          gradePoint: 6,
          description: "Average",
          isPassing: true,
        },
        {
          grade: "D",
          minPercentage: 40,
          maxPercentage: 49,
          gradePoint: 5,
          description: "Pass",
          isPassing: true,
        },
        {
          grade: "F",
          minPercentage: 0,
          maxPercentage: 39,
          gradePoint: 0,
          description: "Fail",
          isPassing: false,
        },
      ],
      defaultPassingPercentage: 40,
      isActive: true,
      metaData: [{ key: "system", value: "CBSE" }],
    });

    console.log("✓ Grading system created");

    // ========================================
    // PHASE 2: FEE STRUCTURES
    // ========================================
    const feeStructures = await FeeStructure.create([
      {
        class: classes[0]._id,
        academicYear: "2025-2026",
        feeHeads: [
          {
            headName: "Tuition Fee",
            amount: 5000,
            frequency: "Monthly",
            isMandatory: true,
            description: "Monthly tuition fee",
          },
          {
            headName: "Lab Fee",
            amount: 2000,
            frequency: "Yearly",
            isMandatory: true,
            description: "Annual laboratory fee",
          },
          {
            headName: "Library Fee",
            amount: 1000,
            frequency: "Yearly",
            isMandatory: true,
            description: "Annual library fee",
          },
          {
            headName: "Sports Fee",
            amount: 1500,
            frequency: "Yearly",
            isMandatory: false,
            description: "Annual sports fee",
          },
          {
            headName: "Transport Fee",
            amount: 2000,
            frequency: "Monthly",
            isMandatory: false,
            description: "Monthly transport fee",
          },
        ],
        discounts: [
          {
            discountName: "Sibling Discount",
            discountType: "Percentage",
            discountValue: 10,
            applicableFor: "Siblings",
            description: "10% discount for siblings",
          },
          {
            discountName: "Merit Scholarship",
            discountType: "Percentage",
            discountValue: 25,
            applicableFor: "Merit",
            description: "25% discount for merit students",
          },
        ],
        lateFeeConfig: {
          enabled: true,
          gracePeriodDays: 5,
          lateFeeType: "Fixed",
          lateFeeValue: 100,
        },
        status: "Active",
        effectiveFrom: new Date("2025-04-01"),
        metaData: [{ key: "term", value: "Annual" }],
      },
      {
        class: classes[1]._id,
        academicYear: "2025-2026",
        feeHeads: [
          {
            headName: "Tuition Fee",
            amount: 4500,
            frequency: "Monthly",
            isMandatory: true,
            description: "Monthly tuition fee",
          },
          {
            headName: "Lab Fee",
            amount: 1800,
            frequency: "Yearly",
            isMandatory: true,
            description: "Annual laboratory fee",
          },
          {
            headName: "Library Fee",
            amount: 1000,
            frequency: "Yearly",
            isMandatory: true,
            description: "Annual library fee",
          },
        ],
        discounts: [
          {
            discountName: "Early Payment Discount",
            discountType: "Percentage",
            discountValue: 5,
            applicableFor: "Early Payment",
            description: "5% discount for early payment",
          },
        ],
        lateFeeConfig: {
          enabled: true,
          gracePeriodDays: 5,
          lateFeeType: "Fixed",
          lateFeeValue: 100,
        },
        status: "Active",
        effectiveFrom: new Date("2025-04-01"),
        metaData: [{ key: "term", value: "Annual" }],
      },
    ]);

    console.log("✓ Fee structures created");

    // ========================================
    // PHASE 2: FEE INVOICES
    // ========================================
    const feeInvoices = await FeeInvoice.create([
      {
        student: students[0]._id,
        class: classes[0]._id,
        academicYear: "2025-2026",
        invoiceNumber: "INV-2025-001",
        feeStructure: feeStructures[0]._id,
        invoicePeriod: "Monthly",
        periodMonth: 4,
        issueDate: new Date("2025-04-01"),
        dueDate: new Date("2025-04-10"),
        feeItems: [
          {
            headName: "Tuition Fee",
            amount: 5000,
            frequency: "Monthly",
            description: "Monthly tuition fee",
          },
          {
            headName: "Lab Fee",
            amount: 2000,
            frequency: "Yearly",
            description: "Annual laboratory fee",
          },
        ],
        subtotal: 7000,
        totalDiscount: 0,
        lateFee: 0,
        totalAmount: 7000,
        paidAmount: 7000,
        balanceAmount: 0,
        status: "Paid",
        paidDate: new Date("2025-04-05"),
        metaData: [{ key: "term", value: "Q1" }],
      },
      {
        student: students[1]._id,
        class: classes[0]._id,
        academicYear: "2025-2026",
        invoiceNumber: "INV-2025-002",
        feeStructure: feeStructures[0]._id,
        invoicePeriod: "Monthly",
        periodMonth: 4,
        issueDate: new Date("2025-04-01"),
        dueDate: new Date("2025-04-10"),
        feeItems: [
          {
            headName: "Tuition Fee",
            amount: 5000,
            frequency: "Monthly",
            description: "Monthly tuition fee",
          },
        ],
        subtotal: 5000,
        discounts: [
          {
            discountName: "Sibling Discount",
            discountType: "Percentage",
            discountValue: 10,
            discountAmount: 500,
            reason: "Second child in school",
          },
        ],
        totalDiscount: 500,
        lateFee: 0,
        totalAmount: 4500,
        paidAmount: 2000,
        balanceAmount: 2500,
        status: "Partially Paid",
        metaData: [{ key: "term", value: "Q1" }],
      },
      {
        student: students[2]._id,
        class: classes[1]._id,
        academicYear: "2025-2026",
        invoiceNumber: "INV-2025-003",
        feeStructure: feeStructures[1]._id,
        invoicePeriod: "Monthly",
        periodMonth: 4,
        issueDate: new Date("2025-04-01"),
        dueDate: new Date("2025-04-10"),
        feeItems: [
          {
            headName: "Tuition Fee",
            amount: 4500,
            frequency: "Monthly",
            description: "Monthly tuition fee",
          },
        ],
        subtotal: 4500,
        totalDiscount: 0,
        lateFee: 0,
        totalAmount: 4500,
        paidAmount: 0,
        balanceAmount: 4500,
        status: "Issued",
        metaData: [{ key: "term", value: "Q1" }],
      },
    ]);

    console.log("✓ Fee invoices created");

    // ========================================
    // PHASE 2: FEE PAYMENTS
    // ========================================
    const feePayments = await FeePayment.create([
      {
        invoice: feeInvoices[0]._id,
        student: students[0]._id,
        receiptNumber: "RCP-2025-001",
        paymentDate: new Date("2025-04-05"),
        amount: 7000,
        paymentMode: "Online Transfer",
        transactionDetails: {
          transactionId: "TXN123456789",
          bankName: "HDFC Bank",
        },
        status: "Success",
        collectedBy: users[0]._id,
        remarks: "Payment via Razorpay gateway",
        metaData: [{ key: "gateway", value: "Razorpay" }],
      },
      {
        invoice: feeInvoices[1]._id,
        student: students[1]._id,
        receiptNumber: "RCP-2025-002",
        paymentDate: new Date("2025-04-06"),
        amount: 2000,
        paymentMode: "Cash",
        status: "Success",
        collectedBy: users[0]._id,
        remarks: "Partial payment received in cash",
        metaData: [{ key: "note", value: "Partial payment" }],
      },
    ]);

    console.log("✓ Fee payments created");

    const feeAuditLogs = await FeeAuditLog.create([
      {
        action: "INVOICE_REMINDER_SENT",
        entityType: "FeeInvoice",
        entityId: feeInvoices[0]._id,
        actor: adminUsers[0]._id,
        details: { channel: "email", seed: true },
      },
      {
        action: "LATE_FEE_WAIVED",
        entityType: "FeeInvoice",
        entityId: feeInvoices[1]._id,
        actor: adminUsers[0]._id,
        details: { reason: "seed demo waiver", seed: true },
      },
    ]);

    // ========================================
    // PHASE 2: EXAMINATIONS
    // ========================================
    const examinations = await Examination.create([
      {
        examName: "Mid-Term Examination",
        examType: "Term Exam",
        academicYear: "2025-2026",
        classes: [classes[0]._id, classes[1]._id],
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-15"),
        subjects: [
          {
            subject: subjects[5]._id,
            examDate: new Date("2025-09-01"),
            startTime: "09:00 AM",
            duration: 180,
            maxMarks: 100,
            passingMarks: 40,
            weightage: 50,
            syllabus: "Chapters 1-5",
            instructions: "Bring calculator and graph paper",
          },
          {
            subject: subjects[6]._id,
            examDate: new Date("2025-09-03"),
            startTime: "09:00 AM",
            duration: 180,
            maxMarks: 100,
            passingMarks: 40,
            weightage: 50,
            syllabus: "Chapters 1-4",
          },
          {
            subject: subjects[7]._id,
            examDate: new Date("2025-09-05"),
            startTime: "09:00 AM",
            duration: 180,
            maxMarks: 100,
            passingMarks: 40,
            weightage: 50,
            syllabus: "Chapters 1-6",
          },
        ],
        gradingSystem: gradingSystem._id,
        status: "Scheduled",
        markEntryStartDate: new Date("2025-09-16"),
        markEntryEndDate: new Date("2025-09-25"),
        markEntryStatus: "Not Started",
        resultPublished: false,
        generalInstructions:
          "Students must arrive 30 minutes before exam time",
        metaData: [{ key: "term", value: "1" }],
      },
      {
        examName: "Final Examination",
        examType: "Final Exam",
        academicYear: "2025-2026",
        classes: [classes[0]._id],
        startDate: new Date("2026-03-01"),
        endDate: new Date("2026-03-20"),
        subjects: [
          {
            subject: subjects[5]._id,
            examDate: new Date("2026-03-01"),
            startTime: "09:00 AM",
            duration: 180,
            maxMarks: 100,
            passingMarks: 40,
            weightage: 100,
          },
        ],
        gradingSystem: gradingSystem._id,
        status: "Scheduled",
        resultPublished: false,
        metaData: [{ key: "term", value: "Final" }],
      },
    ]);

    console.log("✓ Examinations created");

    // ========================================
    // PHASE 2: EXAM RESULTS
    // ========================================
    const examResults = await ExamResult.create([
      {
        student: students[0]._id,
        examination: examinations[0]._id,
        class: classes[0]._id,
        academicYear: "2025-2026",
        subjectResults: [
          {
            subject: subjects[5]._id,
            marksObtained: 85,
            maxMarks: 100,
            percentage: 85,
            grade: "A",
            gradePoint: 9,
            remarks: "Excellent performance",
          },
          {
            subject: subjects[6]._id,
            marksObtained: 78,
            maxMarks: 100,
            percentage: 78,
            grade: "B+",
            gradePoint: 8,
            remarks: "Good work",
          },
          {
            subject: subjects[7]._id,
            marksObtained: 92,
            maxMarks: 100,
            percentage: 92,
            grade: "A+",
            gradePoint: 10,
            remarks: "Outstanding",
          },
        ],
        totalMarksObtained: 255,
        totalMaxMarks: 300,
        overallPercentage: 85,
        overallGrade: "A",
        overallGradePoint: 9,
        rank: 1,
        status: "Published",
        publishedDate: new Date("2025-09-30"),
        metaData: [{ key: "term", value: "Mid-Term" }],
      },
      {
        student: students[1]._id,
        examination: examinations[0]._id,
        class: classes[0]._id,
        academicYear: "2025-2026",
        subjectResults: [
          {
            subject: subjects[5]._id,
            marksObtained: 72,
            maxMarks: 100,
            percentage: 72,
            grade: "B+",
            gradePoint: 8,
          },
          {
            subject: subjects[6]._id,
            marksObtained: 68,
            maxMarks: 100,
            percentage: 68,
            grade: "B",
            gradePoint: 7,
          },
          {
            subject: subjects[7]._id,
            marksObtained: 75,
            maxMarks: 100,
            percentage: 75,
            grade: "B+",
            gradePoint: 8,
          },
        ],
        totalMarksObtained: 215,
        totalMaxMarks: 300,
        overallPercentage: 71.67,
        overallGrade: "B+",
        overallGradePoint: 8,
        rank: 2,
        status: "Published",
        publishedDate: new Date("2025-09-30"),
        metaData: [{ key: "term", value: "Mid-Term" }],
      },
    ]);

    console.log("✓ Exam results created");

    // ========================================
    // PHASE 2: HOMEWORK
    // ========================================
    const homework = await Homework.create([
      {
        title: "Physics Chapter 1 - Motion",
        description:
          "Solve all numerical problems from Chapter 1. Show all working steps.",
        dueDate: new Date("2026-02-01"),
        status: "Published",
        class: [classes[0]._id],
        subject: subjects[5]._id,
        assignedBy: teachers[0]._id,
        attachments: ["https://example.com/physics-ch1.pdf"],
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date("2026-01-30"),
            attachments: ["https://example.com/student1-submission.pdf"],
            grade: "A",
            feedback: "Excellent work! All problems solved correctly.",
            isLate: false,
          },
          {
            student: students[1]._id,
            submittedAt: new Date("2026-02-02"),
            attachments: ["https://example.com/student2-submission.pdf"],
            grade: "B",
            feedback: "Good attempt, but some calculation errors.",
            isLate: true,
          },
        ],
        metaData: [{ key: "difficulty", value: "Medium" }],
      },
      {
        title: "Chemistry Lab Report",
        description:
          "Write a detailed lab report on the titration experiment conducted in class.",
        dueDate: new Date("2026-02-10"),
        status: "Published",
        class: [classes[0]._id, classes[1]._id],
        subject: subjects[6]._id,
        assignedBy: teachers[1]._id,
        attachments: ["https://example.com/lab-report-template.pdf"],
        submissions: [],
        metaData: [{ key: "type", value: "Lab Report" }],
      },
      {
        title: "Biology Diagram Assignment",
        description: "Draw and label the human digestive system.",
        dueDate: new Date("2026-02-05"),
        status: "Draft",
        class: [classes[1]._id],
        subject: subjects[7]._id,
        assignedBy: teachers[2]._id,
        attachments: [],
        submissions: [],
        metaData: [{ key: "difficulty", value: "Easy" }],
      },
    ]);

    console.log("✓ Homework created");

    // ========================================
    // PHASE 2: STUDENT ATTENDANCE
    // ========================================
    const studentAttendance = await StudentAttendance.create([
      {
        student: students[0]._id,
        class: classes[0]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        attendanceMode: "Daily",
        dailyStatus: {
          morning: {
            status: "Present",
            markedAt: new Date("2026-01-20T09:00:00"),
            markedBy: users[0]._id,
          },
          evening: {
            status: "Present",
            markedAt: new Date("2026-01-20T15:00:00"),
            markedBy: users[0]._id,
          },
        },
        overallStatus: "Present",
        parentNotified: false,
        metaData: [{ key: "note", value: "Regular attendance" }],
      },
      {
        student: students[1]._id,
        class: classes[0]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        attendanceMode: "Daily",
        dailyStatus: {
          morning: {
            status: "Absent",
            markedAt: new Date("2026-01-20T09:00:00"),
            markedBy: users[0]._id,
          },
          evening: {
            status: "Absent",
            markedAt: new Date("2026-01-20T15:00:00"),
            markedBy: users[0]._id,
          },
        },
        overallStatus: "Absent",
        leaveInfo: {
          isOnLeave: false,
        },
        parentNotified: true,
        notifiedAt: new Date("2026-01-20T16:00:00"),
        remarks: "Absent without prior notice",
        metaData: [{ key: "alert", value: "true" }],
      },
      {
        student: students[2]._id,
        class: classes[1]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        attendanceMode: "Subject-Wise",
        subjectAttendance: [
          {
            subject: subjects[0]._id,
            period: 1,
            status: "Present",
            markedAt: new Date("2026-01-20T09:00:00"),
            markedBy: users[1]._id,
          },
          {
            subject: subjects[1]._id,
            period: 2,
            status: "Present",
            markedAt: new Date("2026-01-20T10:00:00"),
            markedBy: users[1]._id,
          },
          {
            subject: subjects[2]._id,
            period: 3,
            status: "Absent",
            markedAt: new Date("2026-01-20T11:00:00"),
            markedBy: users[2]._id,
          },
        ],
        overallStatus: "Partial",
        parentNotified: true,
        notifiedAt: new Date("2026-01-20T16:00:00"),
        metaData: [{ key: "mode", value: "subject-wise" }],
      },
    ]);

    console.log("✓ Student attendance created");

    // ========================================
    // PHASE 2: STAFF ATTENDANCE
    // ========================================
    const staffAttendance = await StaffAttendance.create([
      {
        staff: users[0]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        checkIn: {
          time: new Date("2026-01-20T08:45:00"),
          method: "Biometric",
        },
        checkOut: {
          time: new Date("2026-01-20T17:00:00"),
          method: "Biometric",
        },
        totalHours: 8.25,
        status: "Present",
        isLate: false,
        metaData: [{ key: "note", value: "On time" }],
      },
      {
        staff: users[1]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        checkIn: {
          time: new Date("2026-01-20T09:30:00"),
          method: "Biometric",
        },
        checkOut: {
          time: new Date("2026-01-20T17:00:00"),
          method: "Biometric",
        },
        totalHours: 7.5,
        status: "Late",
        isLate: true,
        lateByMinutes: 45,
        remarks: "Traffic delay",
        metaData: [{ key: "lateBy", value: "45 minutes" }],
      },
      {
        staff: users[2]._id,
        date: new Date("2026-01-20"),
        academicYear: "2025-2026",
        status: "On Leave",
        leaveInfo: {
          isOnLeave: true,
          leaveType: "Sick Leave",
        },
        metaData: [{ key: "approved", value: "true" }],
      },
    ]);

    console.log("✓ Staff attendance created");

    // ========================================
    // PHASE 2: LEAVE APPLICATIONS
    // ========================================
    const leaveApplications = await LeaveApplication.create([
      {
        applicantType: "Student",
        student: students[0]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2026-01-25"),
        toDate: new Date("2026-01-27"),
        totalDays: 3,
        reason: "Suffering from viral fever",
        attachments: [
          {
            fileName: "medical-certificate.pdf",
            fileUrl: "https://example.com/medical-cert.pdf",
            fileType: "application/pdf",
          },
        ],
        status: "Approved",
        appliedBy: users[5]._id,
        appliedAt: new Date("2026-01-24"),
        reviewedBy: users[0]._id,
        reviewedAt: new Date("2026-01-24T14:00:00"),
        reviewComments: "Approved. Get well soon.",
        notificationSent: true,
        metaData: [{ key: "parentApplied", value: "true" }],
      },
      {
        applicantType: "Student",
        student: students[1]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-02-01"),
        toDate: new Date("2026-02-01"),
        totalDays: 1,
        reason: "Family function",
        status: "Pending",
        appliedBy: users[6]._id,
        appliedAt: new Date("2026-01-30"),
        notificationSent: false,
        metaData: [{ key: "urgent", value: "false" }],
      },
      {
        applicantType: "Staff",
        staff: users[2]._id,
        leaveType: "Sick Leave",
        fromDate: new Date("2026-01-20"),
        toDate: new Date("2026-01-22"),
        totalDays: 3,
        reason: "Medical checkup and rest",
        attachments: [
          {
            fileName: "doctor-note.pdf",
            fileUrl: "https://example.com/doctor-note.pdf",
            fileType: "application/pdf",
          },
        ],
        status: "Approved",
        appliedBy: users[2]._id,
        appliedAt: new Date("2026-01-19"),
        reviewedBy: users[0]._id,
        reviewedAt: new Date("2026-01-19T16:00:00"),
        reviewComments: "Approved",
        notificationSent: true,
        metaData: [{ key: "type", value: "medical" }],
      },
      {
        applicantType: "Staff",
        staff: users[3]._id,
        leaveType: "Casual Leave",
        fromDate: new Date("2026-02-10"),
        toDate: new Date("2026-02-12"),
        totalDays: 3,
        reason: "Personal work",
        status: "Rejected",
        appliedBy: users[3]._id,
        appliedAt: new Date("2026-02-05"),
        reviewedBy: users[0]._id,
        reviewedAt: new Date("2026-02-06"),
        reviewComments: "Cannot approve due to staff shortage during exams",
        notificationSent: true,
        metaData: [{ key: "examPeriod", value: "true" }],
      },
    ]);

    console.log("✓ Leave applications created");

    // ========================================
    // PHASE 3: ADMISSIONS, TRANSPORT, LIBRARY, SUBSTITUTION, PAYROLL (seed)
    // ========================================
    const admissionSeeds = await AdmissionApplication.create([
      {
        academicYear: "2025-2026",
        applicantName: "Samuel Applicant",
        dateOfBirth: new Date("2014-03-10"),
        gradeApplying: "9",
        parentName: "Robert Applicant",
        phone: "555-0101",
        email: "robert.applicant@example.com",
        stage: "Enquiry",
      },
      {
        academicYear: "2025-2026",
        applicantName: "Taylor Candidate",
        dateOfBirth: new Date("2013-08-22"),
        gradeApplying: "10",
        parentName: "Pat Candidate",
        phone: "555-0102",
        email: "pat.candidate@example.com",
        stage: "Interview",
        testScore: 78,
        interviewNotes: "Strong communication skills",
      },
      {
        academicYear: "2025-2026",
        applicantName: "Jordan Merit",
        dateOfBirth: new Date("2013-11-05"),
        gradeApplying: "10",
        parentName: "Casey Merit",
        phone: "555-0103",
        email: "casey.merit@example.com",
        stage: "MeritList",
        testScore: 92,
        meritRank: 1,
      },
    ]);

    const transportVehicleSeed = await TransportVehicle.create({
      registrationNumber: "BUS-SHS-001",
      makeModel: "Mini Bus 32",
      capacity: 32,
      driverName: "Mike Driver",
      driverPhone: "555-0200",
      gpsDeviceId: "GPS-DEMO-001",
      isActive: true,
    });

    const transportRouteSeed = await TransportRoute.create({
      name: "North Springfield Loop",
      academicYear: "2025-2026",
      stops: [
        { name: "Main Gate", pickupTime: "07:15" },
        { name: "Oak Street", pickupTime: "07:25" },
        { name: "Maple Ave", pickupTime: "07:35" },
      ],
      assignedVehicle: transportVehicleSeed._id,
      isActive: true,
    });

    await TransportVehicle.findByIdAndUpdate(transportVehicleSeed._id, {
      route: transportRouteSeed._id,
    });

    const libraryItems = await LibraryItem.create([
      {
        title: "Introduction to Algorithms",
        author: "Cormen et al.",
        isbn: "978-0262033848",
        category: "Computer Science",
        shelfLocation: "CS-A1",
        totalCopies: 3,
        availableCopies: 3,
        finePerDay: 10,
        status: "Active",
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "978-0553380163",
        category: "Science",
        shelfLocation: "SCI-B2",
        totalCopies: 2,
        availableCopies: 2,
        finePerDay: 5,
        status: "Active",
      },
    ]);

    const dueLib = new Date();
    dueLib.setDate(dueLib.getDate() + 10);

    const libraryBorrowingSeed = await LibraryBorrowing.create({
      item: libraryItems[0]._id,
      borrowerType: "Student",
      borrowerUser: users[5]._id,
      student: students[0]._id,
      dueDate: dueLib,
      status: "CheckedOut",
      renewalsCount: 0,
    });

    await LibraryItem.findByIdAndUpdate(libraryItems[0]._id, {
      availableCopies: 2,
    });

    const substitutionsSeed = await Substitution.create([
      {
        academicYear: "2025-2026",
        date: new Date("2026-01-21"),
        dayName: "Tuesday",
        class: classes[0]._id,
        periodIndex: 2,
        subject: subjects[0]._id,
        absentTeacher: teachers[2]._id,
        substituteTeacher: teachers[0]._id,
        leaveApplication: leaveApplications[2]._id,
        status: "Scheduled",
        notes: "Seeded cover class from seed script",
      },
    ]);

    const payrollLines = teachers.map((t) => {
      const basic = t.salary?.basic ?? 50000;
      const allowances = t.salary?.allowances ?? 0;
      const deductions = Math.round(basic * 0.04);
      const net = basic + allowances - deductions;
      return {
        teacher: t._id,
        basic,
        allowances,
        deductions,
        net,
      };
    });

    const payrollDraftSeed = await PayrollRun.create({
      month: 3,
      year: 2026,
      academicYear: "2025-2026",
      status: "Draft",
      lines: payrollLines,
    });

    console.log(
      `✓ Phase 3 seed: ${admissionSeeds.length} admissions, transport route+vehicle, ${libraryItems.length} library items, 1 borrowing, ${substitutionsSeed.length} substitution, payroll draft (${payrollDraftSeed.lines.length} lines), librarian user`,
    );

    // ========================================
    // PHASE 2: NOTIFICATIONS
    // ========================================
    const notifications = await Notification.create([
      {
        type: "info",
        recipients: [
          {
            user: users[5]._id,
            status: "unread",
            time: new Date(),
          },
          {
            user: users[6]._id,
            status: "read",
            time: new Date(),
          },
        ],
        message: "Mid-term examinations will begin from September 1st, 2025.",
        expireDate: new Date("2025-09-01"),
        metaData: [{ key: "category", value: "Exam" }],
      },
      {
        type: "warning",
        recipients: [
          {
            user: users[6]._id,
            status: "unread",
            time: new Date(),
          },
        ],
        message:
          "Your child was absent today. Please contact the school if this is unexpected.",
        metaData: [{ key: "category", value: "Attendance" }],
      },
      {
        type: "success",
        recipients: [
          {
            user: users[5]._id,
            status: "read",
            time: new Date(),
          },
        ],
        message: "Fee payment of Rs. 7000 received successfully.",
        metaData: [{ key: "category", value: "Fee" }],
      },
      {
        type: "info",
        recipients: [
          {
            user: users[0]._id,
            status: "unread",
            time: new Date(),
          },
          {
            user: users[1]._id,
            status: "unread",
            time: new Date(),
          },
          {
            user: users[2]._id,
            status: "unread",
            time: new Date(),
          },
        ],
        message: "Staff meeting scheduled for tomorrow at 10:00 AM.",
        expireDate: new Date("2026-01-22"),
        metaData: [{ key: "category", value: "Meeting" }],
      },
      {
        type: "error",
        recipients: [
          {
            user: users[5]._id,
            status: "unread",
            time: new Date(),
          },
        ],
        message:
          "Fee payment overdue. Please clear the dues to avoid late fees.",
        metaData: [{ key: "category", value: "Fee" }],
      },
    ]);

    console.log("✓ Notifications created");

    console.log("\n========================================");
    console.log("✓ Database seeded successfully!");
    console.log("========================================");
    console.log(
      `✓ Users: ${users.length} (teachers/students) + librarian + ${adminUsers.length} admins`,
    );
    console.log(`✓ Teachers: ${teachers.length}`);
    console.log(`✓ Students: ${students.length}`);
    console.log(`✓ Classes: ${classes.length}`);
    console.log(`✓ Subjects: ${subjects.length}`);
    console.log(`✓ Timetables: 1`);
    console.log(`✓ School Details: 2 (ABC + XYZ tenant)`);
    console.log(`✓ Roles: ${roles.length}`);
    console.log(`✓ Grading Systems: 1`);
    console.log(`✓ Fee Structures: ${feeStructures.length}`);
    console.log(`✓ Fee Invoices: ${feeInvoices.length}`);
    console.log(`✓ Fee Payments: ${feePayments.length}`);
    console.log(`✓ Fee audit logs: ${feeAuditLogs.length}`);
    console.log(`✓ Examinations: ${examinations.length}`);
    console.log(`✓ Exam Results: ${examResults.length}`);
    console.log(`✓ Homework: ${homework.length}`);
    console.log(`✓ Student Attendance: ${studentAttendance.length}`);
    console.log(`✓ Staff Attendance: ${staffAttendance.length}`);
    console.log(`✓ Leave Applications: ${leaveApplications.length}`);
    console.log(`✓ Admissions: ${admissionSeeds.length}`);
    console.log(`✓ Transport: 1 route, 1 vehicle`);
    console.log(`✓ Library items: ${libraryItems.length} (+ 1 active borrowing)`);
    console.log(`✓ Substitutions: ${substitutionsSeed.length}`);
    console.log(`✓ Payroll drafts: 1 (${payrollDraftSeed.lines.length} lines)`);
    console.log(`✓ Librarian login: ${librarianUser.email} (${librarianUser.loginID})`);
    console.log(
      `✓ Admin (single school): ${adminUsers[0].email} / ${adminUsers[0].loginID} — password 123`,
    );
    console.log(
      `✓ Admin (multi school ABC+XYZ): ${adminUsers[1].email} / ${adminUsers[1].loginID} — password 123`,
    );
    console.log(`✓ Notifications: ${notifications.length}`);
    console.log("========================================\n");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    const closeConn = async (conn, label) => {
      if (!conn || typeof conn.close !== "function") return;
      try {
        await conn.close();
      } catch (e) {
        console.error(`Error closing ${label}:`, e.message);
      }
    };
    await closeConn(userDB, "Users");
    await closeConn(schoolDB, "ABC");
    await closeConn(schoolDBSecondary, "XYZ");
    console.log("Database connections closed");
  }
};
const dropDatabases = async () => {
  try {
    if (userDB) {
      await userDB.dropDatabase();
      console.log("Dropped Users database");
    }
    if (schoolDB) {
      await schoolDB.dropDatabase();
      console.log("Dropped ABC database");
    }
  } catch (error) {
    console.error("Error dropping databases:", error);
    process.exit(1); // Exit process if there's an error dropping databases
  }
};
const add = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

const drop = async () => {
  try {
    await connectDB(); // Assuming connectDB() establishes connections to userDB and schoolDB
    await dropDatabases();
  } catch (error) {
    console.error("Error in drop function:", error);
    process.exit(1); // Exit process if there's an error in the drop function
  } finally {
    if (userDB && typeof userDB.close === "function") await userDB.close();
    if (schoolDB && typeof schoolDB.close === "function") await schoolDB.close();
    if (schoolDBSecondary && typeof schoolDBSecondary.close === "function") {
      await schoolDBSecondary.close();
    }
    console.log("Database connections closed");
  }
};

add();
// drop();
