import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, default: 'Student' },
  phoneNumber: { type: String },
  avatar: { type: String },
  deviceToken: { type: String },
  allReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
