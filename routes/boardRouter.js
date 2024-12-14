const router = require("express").Router();
const Board = require("../models/boardModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

router.get("/:page", async (req, res) => {
  try {
    const page = req.params.page;
    const board = await Board.find()
      .skip((page - 1) * 5)
      .limit(5)
      .sort("-created");
    const count = await Board.countDocuments();
    res.json({ board: board, count: count });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, mode, title, author, contents, deletedFiles, files } = req.body;
    console.log(req.body)
    if (mode === "edit") {
      await Board.findByIdAndDelete(id);
      for (let i = 0; i < deletedFiles?.length; i++) {
        if (fs.existsSync("public/assets/" + deletedFiles[i])) {
          fs.unlinkSync("public/assets/" + deletedFiles[i]);
        }
      }
    }
    const data = {
      title,
      author,
      contents,
      attachmentFiles: files,
    };
    const newBoard = new Board(data);

    const savedBoard = await newBoard.save();

    res.json(savedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { title, author, contents, attachmentOrigin, attachmentSaved } =
      req.body;

    const newBoard = {
      title,
      author,
      contents,
      attachmentOrigin,
      attachmentSaved,
    };

    const savedBoard = await Board.findByIdAndUpdate(id, newBoard, {
      new: true,
    });

    res.json(savedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const editedBoard = await Board.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(editedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findBoard = await Board.find({ _id: id });
    findBoard[0].attachmentFiles.forEach((file) => {
      if (fs.existsSync(path.dirname(__dirname) + "/public/assets/" + file)) {
        fs.unlinkSync(path.dirname(__dirname) + "/public/assets/" + file);
      }
    });

    const deletedBoard = await Board.findByIdAndDelete(id);
    res.json(deletedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
