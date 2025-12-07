import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    roles: {
      type: [String],
      enum: ['customer', 'merchant'],
      default: ['customer'],
      required: true,
    },
    // Keep role for backward compatibility (will be the first role in roles array)
    role: {
      type: String,
      enum: ['customer', 'merchant'],
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isNew) return next();
  
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  // Sync role field with first role in roles array for backward compatibility
  if (this.roles && this.roles.length > 0) {
    this.role = this.roles[0];
  } else if (!this.roles || this.roles.length === 0) {
    this.roles = ['customer'];
    this.role = 'customer';
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

