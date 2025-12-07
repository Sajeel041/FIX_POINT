import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
    },
    issue: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'offerSubmitted', 'accepted', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    acceptedMerchants: [
      {
        merchantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        negotiable: {
          type: Boolean,
          default: false,
        },
        acceptedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    selectedMerchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;

