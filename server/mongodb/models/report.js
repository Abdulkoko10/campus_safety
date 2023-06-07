import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reportType: { type: String, required: true },
  location: { type: String, required: true },
  photo: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isReviewed: { type: Boolean, default: false }
});

const reportModel = mongoose.model("Report", ReportSchema);

export default reportModel;
