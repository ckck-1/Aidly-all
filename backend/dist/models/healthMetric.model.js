"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMetric = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const healthMetricSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['weight', 'blood_pressure', 'heart_rate', 'blood_sugar'],
    },
    value: {
        type: mongoose_1.default.Schema.Types.Mixed,
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
}, {
    timestamps: true,
});
healthMetricSchema.index({ userId: 1, type: 1, timestamp: -1 });
exports.HealthMetric = mongoose_1.default.model('HealthMetric', healthMetricSchema);
//# sourceMappingURL=healthMetric.model.js.map