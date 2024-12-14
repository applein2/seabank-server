const router = require("express").Router();
const path = require("path")

router.get("/", async (req, res) => {
    try { 
      const filename = req.query.filename
      res.download(
        path.dirname(__dirname) + "/public/assets/" + filename,
        filename
      );
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
