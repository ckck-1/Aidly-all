import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user.model';
import { HealthMetric, IHealthMetric } from '../models/healthMetric.model';
import { AppError } from '../middleware/errorHandler';

interface HealthRecommendation {
  type: string;
  message: string;
}


interface HealthInsight {
  type: string;
  value: string;
  message: string;
}

interface MetricsByType {
  [key: string]: IHealthMetric;
}

export const getHealthRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id) as IUser | null;
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const recommendations = generateHealthRecommendations(user);

    res.status(200).json({
      status: 'success',
      data: { recommendations },
    });
  } catch (error) {
    next(error);
  }
};

export const logHealthMetric = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, value, unit, timestamp } = req.body;

    const metric = await HealthMetric.create({
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
  } catch (error) {
    next(error);
  }
};

export const getHealthMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.params;
    const { from, to } = req.query;

    const query: Record<string, any> = {
      userId: req.user.id,
      type,
    };

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from as string);
      if (to) query.timestamp.$lte = new Date(to as string);
    }

    const metrics = await HealthMetric.find(query).sort({ timestamp: -1 });

    res.status(200).json({
      status: 'success',
      results: metrics.length,
      data: { metrics },
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id) as IUser | null;
    if (!user) {
      return next(new AppError('User not found', 404));
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
  } catch (error) {
    next(error);
  }
};

const generateHealthRecommendations = (user: IUser): HealthRecommendation[] => {
  const recommendations: HealthRecommendation[] = [];

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

const getLatestMetrics = async (userId: string): Promise<MetricsByType> => {
  const metricTypes = ['weight', 'blood_pressure', 'heart_rate', 'blood_sugar'];
  const latestMetrics: MetricsByType = {};

  for (const type of metricTypes) {
    const metric = await HealthMetric.findOne({ userId, type })
      .sort({ timestamp: -1 })
      .limit(1);
    if (metric) {
      latestMetrics[type] = metric;
    }
  }

  return latestMetrics;
};

const calculateHealthScore = (user: IUser, metrics: MetricsByType): number => {
  let score = 70;

  if (user.healthData.weight && user.healthData.height) {
    const bmi = calculateBMI(user.healthData.weight, user.healthData.height);
    if (bmi >= 18.5 && bmi <= 24.9) score += 10;
    else if (bmi < 18.5 || bmi > 30) score -= 10;
    else score -= 5;
  }

  if (metrics.blood_pressure) {
    const [systolic, diastolic] = metrics.blood_pressure.value.toString().split('/').map(Number);
    if (systolic <= 120 && diastolic <= 80) score += 10;
    else if (systolic >= 140 || diastolic >= 90) score -= 10;
  }

  return Math.min(100, Math.max(0, score));
};

const generateHealthInsights = (user: IUser, metrics: MetricsByType): HealthInsight[] => {
  const insights: HealthInsight[] = [];

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

const calculateBMI = (weight: number, height: number): number => {
  return weight / ((height / 100) * (height / 100));
};

const getBMIMessage = (bmi: number): string => {
  if (bmi < 18.5) return 'You are underweight. Consider consulting a nutritionist.';
  if (bmi <= 24.9) return 'Your BMI is within the healthy range.';
  if (bmi <= 29.9) return 'You are overweight. Consider increasing physical activity.';
  return 'You are in the obese range. Please consult a healthcare provider.';
};

const getBloodPressureMessage = (systolic: number, diastolic: number): string => {
  if (systolic <= 120 && diastolic <= 80)
    return 'Your blood pressure is within the normal range.';
  if (systolic <= 129 && diastolic <= 80)
    return 'Your blood pressure is elevated. Monitor it regularly.';
  return 'Your blood pressure is high. Consider consulting a healthcare provider.';
}; 
