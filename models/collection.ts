import mongoose from "mongoose"

const CollectionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, default: "gray" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create the model
let Collection;

// Check if the model already exists to prevent OverwriteModelError
if (mongoose.models && mongoose.models.Collection) {
  Collection = mongoose.models.Collection;
} else {
  Collection = mongoose.model("Collection", CollectionSchema);
}

export default Collection;
