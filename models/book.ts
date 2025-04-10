import mongoose from "mongoose"

// Define the schema
const BookSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  genre: { type: String, required: true },
  publicationYear: { type: Number },
  coverImage: { type: String },
  status: {
    type: String,
    enum: ["unread", "in-progress", "completed"],
    default: "unread",
  },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  completedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create the model
let Book;

// Check if the model already exists to prevent OverwriteModelError
if (mongoose.models && mongoose.models.Book) {
  Book = mongoose.models.Book;
} else {
  Book = mongoose.model("Book", BookSchema);
}

export default Book;
