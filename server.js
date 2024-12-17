const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

dotenv.config();

// set up server

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString('utf8')
    cb(null, file.originalname);
  },
  limits: {fileSize: 1024 * 1024 * 30} // 30mb 파일 크기 제한
});
const upload = multer({storage})

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.use("/board", upload.array("file"), require("./routes/boardRouter"))
app.use("/auth", require("./routes/authRouter"))
app.use("/email", require("./routes/mailRouter"))
app.use("/download", require("./routes/download"))


app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

mongoose
  .connect(process.env.MONGODB_CONNECT, {
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB Connected..."))
  .catch((error) => console.log(error));
