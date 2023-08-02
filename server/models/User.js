import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const BeerSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  alchool: { type: String, required: true },
  description: { type: String, required: true },
  country: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  beers: [BeerSchema],
});

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
export default User;