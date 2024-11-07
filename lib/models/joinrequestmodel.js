const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyRoom", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const JoinRequest =mongoose.models.JoinRequest ||  mongoose.model("JoinRequest", joinRequestSchema);
module.exports = JoinRequest;
