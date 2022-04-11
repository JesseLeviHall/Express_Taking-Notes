const router = require("express").Router();
const NoteModel = require("./model");
const passport = require("../auth");

//get all the notes
router.get("/", (req, res, next) => {
  NoteModel.find()
    .then((notes) => {
      if (!notes) {
        res.status(404).send("No notes are saved yet!");
      } else {
        res.json(notes);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
});

//get one note
router.get("/:id", (req, res, next) => {
  NoteModel.findById(req.params.id)
    .then((note) => {
      if (!note) {
        res.status(404).send("sorry, no note found");
      } else {
        res.json(note);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
});

//create a new note
router.post(
  "/",
  passport.authenticate("bearer", { session: false }),
  inputValidation,
  (req, res, next) => {
    const newNote = new NoteModel({
      title: req.body.title,
      body: req.body.body,
      authorId: req.user._id,
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
        res.send("there was an error");
      });
  }
);

//update a note
router.put(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  updateValidation,
  findNote,
  isAuthor,
  (req, res, next) => {
    NoteModel.findOneAndUpdate({ _id: req.params.id }, req.updateNote, {
      new: true,
    })
      .then((note) => {
        if (!note) {
          res.status(404).send("sorry, no note found");
        } else {
          res.send(note);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error Happened");
      });
  }
);

//erase a note
router.delete(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  findNote,
  isAuthor,
  (req, res, next) => {
    NoteModel.findOneAndRemove({ _id: req.params.id })
      .then((note) => {
        if (!note) {
          res.status(404).send("sorry, no note found");
        } else {
          res.send("successfully deleted");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("there was an error");
      });
  }
);

function inputValidation(req, res, next) {
  const { title, body } = req.body;
  const missingFileds = [];
  if (!title) {
    missingFileds.push("title");
  }
  if (!body) {
    missingFileds.push("body");
  }
  if (missingFileds.length) {
    res
      .status(400)
      .send(`we're missing something: ${missingFileds.join(", ")}`);
  } else {
    next();
  }
}

function updateValidation(req, res, next) {
  const { title, body } = req.body;
  const updateNote = {};

  if (title) {
    updateNote.title = title;
  }
  if (body) {
    updateNote.body = body;
  }
  req.updateNote = updateNote;
  next();
}

function findNote(req, res, next) {
  NoteModel.findById(req.params.id)
    .then((note) => {
      if (!note) {
        res.satus(404).send("note not found");
      } else {
        req.note = note;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
}

function isAuthor(req, res, next) {
  if (req.user._id.equals(req.note.authorId)) {
    next();
  } else {
    res.status(401).send("action not authorized unless logged in");
  }
}

module.exports = router;
