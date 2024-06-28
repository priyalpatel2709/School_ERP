const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

//file imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRouters = require("./routes/userRoute");
const roleRouters = require("./routes/roleRoute");
const schoolDetailRouters = require("./routes/schoolDetailRoute");
const studentRouters = require("./routes/studentRoute");

//env file connect
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, resp) => {
  const htmlContent = "<h1>Hello, Srever is Running 😁</h1>";
  resp.send(htmlContent);
});

app.use("/user", userRouters);
app.use("/role", roleRouters);
app.use("/schoolInfo", schoolDetailRouters);
app.use("/student", studentRouters);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`server is running on PORT http://localhost:${PORT}`);
});
