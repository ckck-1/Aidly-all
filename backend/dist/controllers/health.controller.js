"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthSummary = exports.getHealthMetrics = exports.logHealthMetric = exports.getHealthRecommendations = void 0;
const user_model_1 = require("../models/user.model");
const healthMetric_model_1 = require("../models/healthMetric.model");
const errorHandler_1 = require("../middleware/errorHandler");
const getHealthRecommendations = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user) {
            return next(new errorHandler_1.AppError('User not found', 404));
        }
        const recommendations = generateHealthRecommendations(user);
        res.status(200).json({
            status: 'success',
            data: { recommendations },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getHealthRecommendations = getHealthRecommendations;
const logHealthMetric = async (req, res, next) => {
    try {
        const { type, value, unit, timestamp } = req.body;
        const metric = await healthMetric_model_1.HealthMetric.create({
            userId: req.user.id,
            type,
            value,
            unit,
            timestamp: timestamp || new Date(),
        });
        res.status(201).json({
            status: 'success',
            data: { metric },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logHealthMetric = logHealthMetric;
const getHealthMetrics = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { from, to } = req.query;
        const query = {
            userId: req.user.id,
            type,
        };
        if (from || to) {
            query.timestamp = {};
            if (from)
                query.timestamp.$gte = new Date(from);
            if (to)
                query.timestamp.$lte = new Date(to);
        }
        const metrics = await healthMetric_model_1.HealthMetric.find(query).sort({ timestamp: -1 });
        res.status(200).json({
            status: 'success',
            results: metrics.length,
            data: { metrics },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getHealthMetrics = getHealthMetrics;
const getHealthSummary = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user) {
            return next(new errorHandler_1.AppError('User not found', 404));
        }
        const latestMetrics = await getLatestMetrics(req.user.id);
        const healthScore = calculateHealthScore(user, latestMetrics);
        const insights = generateHealthInsights(user, latestMetrics);
        res.status(200).json({
            status: 'success',
            data: {
                healthScore,
                insights,
                latestMetrics,
                healthData: user.healthData,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getHealthSummary = getHealthSummary;
const generateHealthRecommendations = (user) => {
    const recommendations = [];
    if (user.healthData.weight && user.healthData.height) {
        const bmi = calculateBMI(user.healthData.weight, user.healthData.height);
        if (bmi > 25) {
            recommendations.push({
                type: 'weight',
                message: 'Consider incorporating more physical activity into your daily routine.',
            });
        }
    }
    if (user.healthData.medications && user.healthData.medications.length > 0) {
        recommendations.push({
            type: 'medication',
            message: 'Remember to take your prescribed medications regularly.',
        });
    }
    recommendations.push({
        type: 'general',
        message: 'Stay hydrated by drinking at least 8 glasses of water daily.',
    });
    return recommendations;
};
const getLatestMetrics = async (userId) => {
    const metricTypes = ['weight', 'blood_pressure', 'heart_rate', 'blood_sugar'];
    const latestMetrics = {};
    for (const type of metricTypes) {
        const metric = await healthMetric_model_1.HealthMetric.findOne({ userId, type })
            .sort({ timestamp: -1 })
            .limit(1);
        if (metric) {
            latestMetrics[type] = metric;
        }
    }
    return latestMetrics;
};
const calculateHealthScore = (user, metrics) => {
    let score = 70;
    if (user.healthData.weight && user.healthData.height) {
        const bmi = calculateBMI(user.healthData.weight, user.healthData.height);
        if (bmi >= 18.5 && bmi <= 24.9)
            score += 10;
        else if (bmi < 18.5 || bmi > 30)
            score -= 10;
        else
            score -= 5;
    }
    if (metrics.blood_pressure) {
        const [systolic, diastolic] = metrics.blood_pressure.value.toString().split('/').map(Number);
        if (systolic <= 120 && diastolic <= 80)
            score += 10;
        else if (systolic >= 140 || diastolic >= 90)
            score -= 10;
    }
    return Math.min(100, Math.max(0, score));
};
const generateHealthInsights = (user, metrics) => {
    const insights = [];
    if (user.healthData.weight && user.healthData.height) {
        const bmi = calculateBMI(user.healthData.weight, user.healthData.height);
        insights.push({
            type: 'bmi',
            value: bmi.toFixed(1),
            message: getBMIMessage(bmi),
        });
    }
    if (metrics.blood_pressure) {
        const [systolic, diastolic] = metrics.blood_pressure.value.toString().split('/').map(Number);
        insights.push({
            type: 'blood_pressure',
            value: `${systolic}/${diastolic}`,
            message: getBloodPressureMessage(systolic, diastolic),
        });
    }
    return insights;
};
const calculateBMI = (weight, height) => {
    return weight / ((height / 100) * (height / 100));
};
const getBMIMessage = (bmi) => {
    if (bmi < 18.5)
        return 'You are underweight. Consider consulting a nutritionist.';
    if (bmi <= 24.9)
        return 'Your BMI is within the healthy range.';
    if (bmi <= 29.9)
        return 'You are overweight. Consider increasing physical activity.';
    return 'You are in the obese range. Please consult a healthcare provider.';
};
const getBloodPressureMessage = (systolic, diastolic) => {
    if (systolic <= 120 && diastolic <= 80)
        return 'Your blood pressure is within the normal range.';
    if (systolic <= 129 && diastolic <= 80)
        return 'Your blood pressure is elevated. Monitor it regularly.';
    return 'Your blood pressure is high. Consider consulting a healthcare provider.';
};
//# sourceMappingURL=health.controller.js.map