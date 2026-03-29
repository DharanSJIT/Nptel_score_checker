/**
 * NPTEL Score Calculator Utilities
 * 
 * Calculation Rules:
 * - 4 week course: Best 3 out of 4 assignments
 * - 8 week course: Best 6 out of 8 assignments
 * - 12 week course: Best 8 out of 12 assignments
 * 
 * Assignment score = (Sum of best scores / Total possible score) * 25
 */

export type CourseDuration = 4 | 8 | 12;

export interface ScoreInput {
  duration: CourseDuration;
  scores: number[];
}

export interface CalculationResult {
  duration: CourseDuration;
  allScores: number[];
  selectedScores: number[];
  bestScoresCount: number;
  totalScoresCount: number;
  sumOfBestScores: number;
  maxPossibleScore: number;
  assignmentScore: number;
  passThreshold: number;
  isPassing: boolean;
}

/**
 * Get the number of best assignments to count based on course duration
 */
export function getBestAssignmentCount(duration: CourseDuration): number {
  switch (duration) {
    case 4:
      return 3;
    case 8:
      return 6;
    case 12:
      return 8;
    default:
      return 0;
  }
}

/**
 * Get the total number of assignments for a course duration
 */
export function getTotalAssignmentCount(duration: CourseDuration): number {
  return duration;
}

/**
 * Calculate NPTEL assignment score
 */
export function calculateAssignmentScore(input: ScoreInput): CalculationResult {
  const bestCount = getBestAssignmentCount(input.duration);
  const totalCount = getTotalAssignmentCount(input.duration);
  
  // Validate and filter scores
  const validScores = input.scores
    .filter((score) => score >= 0 && score <= 100)
    .slice(0, totalCount);

  // Sort scores in descending order to get best scores
  const sortedScores = [...validScores].sort((a, b) => b - a);
  const selectedScores = sortedScores.slice(0, bestCount);

  // Calculate sum of best scores
  const sumOfBestScores = selectedScores.reduce((sum, score) => sum + score, 0);

  // Maximum possible score is best count * 100
  const maxPossibleScore = bestCount * 100;

  // Assignment score is (sum of best scores / max possible) * 25
  const assignmentScore = (sumOfBestScores / maxPossibleScore) * 25;

  // NPTEL passing threshold is 40% of 25 = 10
  const passThreshold = 10;
  const isPassing = assignmentScore >= passThreshold;

  return {
    duration: input.duration,
    allScores: validScores,
    selectedScores,
    bestScoresCount: bestCount,
    totalScoresCount: totalCount,
    sumOfBestScores,
    maxPossibleScore,
    assignmentScore: Math.round(assignmentScore * 100) / 100,
    passThreshold,
    isPassing,
  };
}

/**
 * Get statistics about the scores
 */
export function getScoreStatistics(scores: number[]) {
  if (scores.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      median: 0,
    };
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const sum = scores.reduce((acc, val) => acc + val, 0);
  const average = sum / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const median =
    scores.length % 2 === 0
      ? (sorted[scores.length / 2 - 1] + sorted[scores.length / 2]) / 2
      : sorted[Math.floor(scores.length / 2)];

  return {
    average: Math.round(average * 100) / 100,
    highest,
    lowest,
    median: Math.round(median * 100) / 100,
  };
}

/**
 * Format score for display
 */
export function formatScore(score: number, decimals: number = 2): string {
  return score.toFixed(decimals);
}

/**
 * Get score status badge color
 */
export function getScoreStatusColor(
  score: number,
  threshold: number = 10
): "success" | "warning" | "danger" {
  if (score >= threshold) {
    return "success";
  } else if (score >= threshold * 0.7) {
    return "warning";
  } else {
    return "danger";
  }
}

/**
 * Get score status text
 */
export function getScoreStatusText(
  score: number,
  threshold: number = 10
): string {
  if (score >= threshold) {
    return "Pass";
  } else {
    return "Fail";
  }
}
