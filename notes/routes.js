const router = require("express").Router();

//get all the notes
router.get("/", (req, res, next) => {
  res.send("All the notes");
});

//get one note
router.get("/:id", (req, res, next) => {
  res.send("Get note by id");
});

//create a new note
router.post("/", (req, res, next) => {
  res.send("create note");
});

//update a note
router.put("/:id", (req, res, next) => {
  res.send("update");
});

//erase a note
router.delete("/", (req, res, next) => {
  res.send("erase notes");
});

module.exports = router;
