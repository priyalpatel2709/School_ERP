const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

//file imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const {
  userRouters,
  roleRoutes,
  schoolDetailRoutes,
  studentRoutes,
  classRoutes,
  homeWorkRoutes,
  teacherRoutes,
  subjectRoutes,
  timeTableRoutes,
  notificationRoutes
} = require("./routes");

//env file connect
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, resp) => {
  const htmlContent = "<h1>Hello, Server is Running 😁</h1>";
  resp.send(htmlContent);
});

app.use("/api/v1/user", userRouters);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/schoolInfo", schoolDetailRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/class", classRoutes);
app.use("/api/v1/homeWork", homeWorkRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/timeTable", timeTableRoutes);
app.use("/api/v1/notification", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`server is running on PORT http://localhost:${PORT}`);
});
