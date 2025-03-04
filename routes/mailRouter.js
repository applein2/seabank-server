const router = require("express").Router();
const Board = require("../models/boardModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const nodemailer = require("nodemailer");

dotenv.config();

router.post("/", async (req, res) => {
  // 필수 필드 검증 - meta lead 픽셀 데이터 전송 방지
  const { name, company, email, message } = req.body;
  if (!name || !company || !email || !message) {
    return res.status(400).json({ error: "필수 입력 필드가 누락되었습니다." });
  }

  try {
    const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = process.env;

    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    let mailContent = `
    보낸사람: ${req.body.name} 
    소속: ${req.body.company}  
    이메일: ${req.body.email}  
    연락처: ${req.body.phone}  
    제목: ${req.body.title}  
    문의내용: ${req.body.message}
    `

    const mailOptions = {
      from: EMAIL_USER,
      to: "seabank73@gmail.com",
      subject: "홈페이지를 통한 구매문의",
      text: mailContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent :", info);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;

// 노드메일러 사용 참고
// https://minu0807.tistory.com/155
