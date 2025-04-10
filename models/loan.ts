import mongoose from "mongoose"

const LoanSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowerName: { type: String, required: true },
  borrowerEmail: { type: String },
  loanDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create the model
let Loan;

// Check if the model already exists to prevent OverwriteModelError
if (mongoose.models && mongoose.models.Loan) {
  Loan = mongoose.models.Loan;
} else {
  Loan = mongoose.model("Loan", LoanSchema);
}

export default Loan;
