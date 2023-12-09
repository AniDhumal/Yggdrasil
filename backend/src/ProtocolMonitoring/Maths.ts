/* eslint-disable @typescript-eslint/ban-ts-comment */
// =====================================================
// Mathematical Methods for Protocol Monitoring
// =====================================================

//@ts-ignore
import sqrt from 'bigint-isqrt';
import { CONFIG } from '../config';

const abs = (n: bigint) => (n === BigInt(-0) || n < BigInt(0) ? -n : n);

/**
 * @function CalcMean
 * @param data
 * @description Calculates the mean
 */
export const CalcMean = (data: bigint[]): bigint => {
  const n = BigInt(data.length);
  return data.reduce((sum: bigint, value) => sum + value, BigInt(0)) / n;
};

/**
 * @function CalcStandardDeviation
 * @param data
 * @description Calculates the standard deviation of the data
 */
export const CalcStandardDeviation = (data: bigint[]): bigint => {
  const n = BigInt(data.length);
  const mean = CalcMean(data);
  const sqrd_diff = data.map(value => (value - mean) ** BigInt(2));
  const variance = sqrd_diff.reduce((sum: bigint, value) => sum + value, BigInt(0)) / n;

  const standard_deviation = sqrt(variance);
  return standard_deviation;
};

/**
 * @function CalcDiff
 * @param data
 * @description Calculates the difference of the data between mean and S.D.
 */
export const CalcDiff = (data: bigint[]): bigint[] => {
  const res: bigint[] = [];

  const mean = CalcMean(data);

  data.map(d => {
    const diff = abs(d - mean);
    res.push(diff);
  });

  return res;
};

/**
 * @function CalcFluctuation
 * @param difference_data
 * @description Gives whether the fluctuation is there or not in the data
 */
export const CalcFluctuation = (difference_data: bigint[], standard_deviation: bigint) => {
  difference_data.map(d => {
    if (abs(d - standard_deviation) >= BigInt(CONFIG.PRICE_FLUCTUATION_FACTOR)) {
      return true;
    }
  });
  return false;
};
