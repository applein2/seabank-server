const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

// .env 파일 사용하기 위한 명령문 
dotenv.config();

// set up server

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// 파일 업로드를 위해 multer라는 라이브러리 활용 
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

// 원래 node와 react를 따로 서버를 구축하는데, 이 프로젝트는 node 안에 react의 build 폴더를 넣어놓음 
app.use('/', express.static(path.join(__dirname, "/build")));

// 브라우저에서 seabank.kr을 치면 build 안에 있는 index.html 파일을 클라이언트에 보내줌. 
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

// 게시판, 로그인, 이메일, 다운로드 각 라우터 경로 지정
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
