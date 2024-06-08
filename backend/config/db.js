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
  if (!connections[schoolId]) {
    const uri = getDatabaseUri(schoolId);
    connections[schoolId] = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to DB for school ${schoolId}` .underline.bgGreen);
  }
  return connections[schoolId];
};

module.exports = connectToDatabase;
