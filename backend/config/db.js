const mongoose = require("mongoose");
const colors = require("colors");
const { logger } = require("../helper/logger");

const connections = {};

const getDatabaseUri = (schoolId) => {
  const template = process.env.MONGO_URI;
  return template.replace("{schoolId}", schoolId);
};
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     //   useCreateIndex: true,
//     });

//     console.log(`MongoDB Connected:`.underline.bgGreen);
//   } catch (error) {
//     logger.error(`Error Connect To MongoDb: ${error.message}`);
//     process.exit();
//   }
// };

const connectToDatabase = async (schoolId) => {
  if (connections[schoolId]) {
    return connections[schoolId];
  }

  const uri = `mongodb://localhost:27017/school_${schoolId}`;
  // const connection = mongoose.createConnection(getDatabaseUri(schoolId));
  const connection = mongoose.createConnection(uri);
  console.log(`Connected to DB for school ${schoolId}`.underline.bgGreen);
  connections[schoolId] = connection;
  return connection;
};

module.exports = connectToDatabase;
