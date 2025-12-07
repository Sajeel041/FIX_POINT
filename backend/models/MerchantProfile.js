import mongoose from 'mongoose';

const merchantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skillCategory: {
      type: String,
      enum: ['Electrician', 'Plumber', 'AC Technician', 'Carpenter', 'Painter'],
      required: [true, 'Skill category is required'],
    },
    yearsExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, 'About section cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    previousWorkImages: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    availability: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    cnic: {
      type: String,
      trim: true,
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const MerchantProfile = mongoose.model('MerchantProfile', merchantProfileSchema);

export default MerchantProfile;
