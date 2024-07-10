const mongoose = require("mongoose");

const getUserModel = require("../models/userModel");
const getTeacherModel = require("../models/teacherModel");
const getStudentModel = require("../models/studentModel");
const getClassModel = require("../models/classModel");
const getSubjectModel = require("../models/subjectModel");
const getSchoolDetailModel = require("../models/schoolDetailModel");
const getTimeTableModel = require("../models/timeTableModel");

const connectToDatabase = require("../config/db");
let userDB, schoolDB;

const connectDB = async () => {
  try {
    userDB = await connectToDatabase("Users");
    schoolDB = await connectToDatabase("ABC");
    console.log("Connected to databases successfully");
  } catch (error) {
    console.error("Failed to connect to databases:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    const User = getUserModel(userDB);
    const Teacher = getTeacherModel(schoolDB);
    const Student = getStudentModel(schoolDB);
    const Class = getClassModel(schoolDB);
    const Subject = getSubjectModel(schoolDB);
    const SchoolDetail = getSchoolDetailModel(schoolDB);
    const TimeTable = getTimeTableModel(schoolDB);

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
          bloodGroup: "O+",
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
          bloodGroup: "A+",
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
          bloodGroup: "B+",
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
          bloodGroup: "AB+",
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
          bloodGroup: "O-",
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
          bloodGroup: "A-",
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
          bloodGroup: "B-",
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
          bloodGroup: "O+",
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
          bloodGroup: "AB-",
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
          bloodGroup: "B+",
          height: 158,
          weight: 52,
        },
        roleName: "Student",
        metaData: [{ key: "hobby", value: "Writing" }],
      },
    ]);

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
        roleNumber: 1,
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
        roleNumber: 2,
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
        roleNumber: 3,
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
        roleNumber: 4,
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
        roleNumber: 5,
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

    // create time table
    const timeTable = await TimeTable.create([
      {
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

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close database connections
    if (userDB) await userDB.connection;
    if (schoolDB) await schoolDB.connection;
    console.log("Database connections closed");
  }
};
const dropDatabases = async () => {
  try {
    if (userDB) {
      await userDB.connection.db.dropDatabase();
      console.log("Dropped Users database");
    }
    if (schoolDB) {
      await schoolDB.connection.db.dropDatabase();
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
    // Close database connections after dropping
    if (userDB) await userDB.connection.close();
    if (schoolDB) await schoolDB.connection.close();
    console.log("Database connections closed");
  }
};

add();
// drop();
