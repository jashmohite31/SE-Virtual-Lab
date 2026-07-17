/**
 * COCOMO I (Basic) and COCOMO II cost estimation calculations.
 */

const COCOMO_I_PARAMETERS = {
  organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  semidetached: { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
};

/**
 * Basic COCOMO I effort and timeline calculation.
 */
export const calculateBasicCocomo = (mode, kloc) => {
  const params = COCOMO_I_PARAMETERS[mode.toLowerCase()] || COCOMO_I_PARAMETERS.organic;
  
  // Effort = a * (KLOC) ^ b (Person-Months)
  const effort = params.a * Math.pow(kloc, params.b);
  
  // Development Time = c * (Effort) ^ d (Months)
  const devTime = params.c * Math.pow(effort, params.d);
  
  // Average Staffing = Effort / DevTime (People)
  const averageStaff = effort / devTime;

  return {
    effort: parseFloat(effort.toFixed(2)),
    developmentTime: parseFloat(devTime.toFixed(2)),
    averageStaffing: parseFloat(averageStaff.toFixed(2))
  };
};

/**
 * Detailed COCOMO II effort and timeline calculation.
 * Size is in KLOC. Scale Factors (SF) and Effort Multipliers (EM) are keys and values.
 */
export const calculateCocomoII = (kloc, scaleFactors = {}, effortMultipliers = {}) => {
  const A = 2.94; // Base constant
  const B = 0.91; // Scale exponent constant
  
  // Scale Factors sum
  const sumSF = Object.values(scaleFactors).reduce((a, b) => a + Number(b), 0);
  const E = B + 0.01 * sumSF;
  
  // Product of Effort Multipliers
  const productEM = Object.values(effortMultipliers).reduce((a, b) => a * Number(b), 1);
  
  // Effort = A * (Size)^E * (product of EMs)
  const effort = A * Math.pow(kloc, E) * productEM;
  
  // Development Time = 3.67 * (Effort) ^ (0.28 + 0.2 * (E - 0.91))
  const F = 0.28 + 0.2 * (E - 0.91);
  const devTime = 3.67 * Math.pow(effort, F);
  
  const averageStaff = effort / devTime;

  return {
    effort: parseFloat(effort.toFixed(2)),
    developmentTime: parseFloat(devTime.toFixed(2)),
    averageStaffing: parseFloat(averageStaff.toFixed(2))
  };
};
