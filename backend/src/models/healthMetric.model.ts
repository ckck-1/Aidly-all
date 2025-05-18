import mongoose from 'mongoose';

export interface IHealthMetric extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  value: string | number;
  unit: string;
  timestamp: Date;
}

const healthMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['weight', 'blood_pressure', 'heart_rate', 'blood_sugar'],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
healthMetricSchema.index({ userId: 1, type: 1, timestamp: -1 });

export const HealthMetric = mongoose.model<IHealthMetric>(
  'HealthMetric',
  healthMetricSchema
); 