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

app.use("/user", userRouters);
app.use("/role", roleRoutes);
app.use("/schoolInfo", schoolDetailRoutes);
app.use("/student", studentRoutes);
app.use("/class", classRoutes);
app.use("/homeWork", homeWorkRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`server is running on PORT http://localhost:${PORT}`);
});
