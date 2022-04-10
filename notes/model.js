const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = NoteModel;
