const router = require("express").Router();
const NoteModel = require("./model");

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
  const newNote = new NoteModel({
    title: "Welcome note",
    body: "Note Body",
  });
  newNote
    .save()
    .then((document) => {
      if (document) {
        res.json(document);
      } else {
        res.send("unable to save document");
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("error occured");
    });
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
