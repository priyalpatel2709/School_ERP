const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const getUserModel = require("../models/userModel");
const getTeacherModel = require("../models/teacherModel");
const getStudentModel = require("../models/studentModel");
const getClassModel = require("../models/classModel");
const getSubjectModel = require("../models/subjectModel");
const getSchoolDetailModel = require("../models/schoolDetailModel");
const getRoleModel = require("../models/roleModel");
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
    const Role = getRoleModel(schoolDB);

    const teacherRole = await Role.findOneAndUpdate(
      { roleName: "teacher" },
      { roleName: "teacher", access: ["teacher", "student"] },
      { upsert: true, new: true }
    );

    const studentRole = await Role.findOneAndUpdate(
      { roleName: "student" },
      { roleName: "student", access: ["student"] },
      { upsert: true, new: true }
    );

    // Create users with detailed fields
    const users = await User.create([
      {
        name: {
          firstName: "John",
          middleName: "A",
          lastName: "Doe",
        },
        gender: "male",
        dateOfBirth: new Date("1980-01-01"),
        cast: "General",
        religion: "Christianity",
        userImage: "john_image_url",
        email: "john@example.com",
        loginID: "john_doe",
        password: "123",
        role: teacherRole._id,
        deviceToken: "token123",
        schoolID: "school_ABC",
        isActive: true,
        age: 40,
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
        dateOfBirth: new Date("1985-05-05"),
        cast: "OBC",
        religion: "Hinduism",
        userImage: "jane_image_url",
        email: "jane@example.com",
        loginID: "jane_smith",
        password: "123",
        role: teacherRole._id,
        deviceToken: "token456",
        schoolID: "school_ABC",
        isActive: true,
        age: 35,
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
        metaData: [{ key: "hobby", value: "Cooking" }],
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
    ]);

    // Create students
    const students = await Student.create([
      {
        roleNumber: 1,
        user: users[0]._id,
        academicYear: new Date(),
        admissionDate: new Date(),
        admissionNumber: 12345,
        previousSchoolDetails: [{ Detail: "Previous School 1" }],
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
        metaData: [{ key: "extraCurricular", value: "Basketball" }],
      },
      {
        roleNumber: 2,
        user: users[1]._id,
        academicYear: new Date(),
        admissionDate: new Date(),
        admissionNumber: 12346,
        previousSchoolDetails: [{ Detail: "Previous School 2" }],
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
        metaData: [{ key: "extraCurricular", value: "Soccer" }],
      },
    ]);

    // Create subjects
    const subjects = await Subject.create([
      { name: "Mathematics", code: "MATH101", description: "Basic Math" },
      { name: "English", code: "ENG101", description: "Basic English" },
    ]);

    // Create classes
    const classes = await Class.create([
      {
        classNumber: "10",
        division: "A",
        classTeacher: teachers[0]._id,
        students: [students[0]._id],
        subjects: [subjects[0]._id],
        metaData: [{ key: "classInfo", value: "Top Class" }],
      },
      {
        classNumber: "10",
        division: "B",
        classTeacher: teachers[1]._id,
        students: [students[1]._id],
        subjects: [subjects[1]._id],
        metaData: [{ key: "classInfo", value: "Average Class" }],
      },
    ]);
    console.log("File: seedDatabase.js", "Line 241:", classes[0]._id);
    await Student.findByIdAndUpdate(students[0]._id, { class: classes[0]._id });
    await Student.findByIdAndUpdate(students[1]._id, { class: classes[1]._id });
    // Student.findByIdAndUpdate(students[1]._id, { class: classes[0]._id });

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
