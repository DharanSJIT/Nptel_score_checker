import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalculationResult,
  formatScore,
  getScoreStatusText,
  getScoreStatusColor,
} from "@/lib/scoreCalculator";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult;
  courseName?: string;
}

/**
 * Component for displaying calculation results
 * Design: Minimalist Academic Excellence
 * - Large, prominent score display
 * - Clear pass/fail status indicator
 * - Detailed breakdown of calculation
 * - Smooth entrance animation
 */
export default function ResultCard({ result, courseName }: ResultCardProps) {
  const statusText = getScoreStatusText(result.assignmentScore, result.passThreshold);
  const statusColor = getScoreStatusColor(result.assignmentScore, result.passThreshold);
  const isPassing = result.isPassing;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const scoreVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5 },
    },
  };

  const statusVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.4 },
    },
  };

  const detailVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4, duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border pb-4">
          <div className="space-y-2">
            {courseName && (
              <p className="text-sm text-muted-foreground font-medium">
                {courseName}
              </p>
            )}
            <CardTitle className="text-2xl font-display text-foreground">
              Your Assignment Score
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          {/* Main Score Display */}
          <motion.div
            className="flex items-center justify-between"
            variants={scoreVariants}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                Assignment Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold text-foreground">
                  {formatScore(result.assignmentScore)}
                </span>
                <span className="text-xl text-muted-foreground">/25</span>
              </div>
            </div>

            {/* Status Badge */}
            <motion.div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isPassing
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
              variants={statusVariants}
            >
              {isPassing ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p
                  className={`text-sm font-semibold-sora ${
                    isPassing ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {statusText}
                </p>
                <p
                  className={`text-xs ${
                    isPassing ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPassing
                    ? `Exceeds ${result.passThreshold}/25`
                    : `Below ${result.passThreshold}/25`}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Calculation Breakdown */}
          <motion.div
            className="space-y-4 pt-6 border-t border-border"
            variants={detailVariants}
          >
            <h4 className="text-sm font-semibold-sora text-foreground uppercase tracking-wide">
              Calculation Breakdown
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Course Duration</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.duration} weeks
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Best Scores Counted</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.bestScoresCount} / {result.totalScoresCount}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Sum of Best Scores</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.sumOfBestScores} / {result.maxPossibleScore}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Percentage</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatScore(
                    (result.sumOfBestScores / result.maxPossibleScore) * 100
                  )}
                  %
                </p>
              </div>
            </div>

            {/* Selected Scores */}
            <div className="space-y-2 pt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Best Scores Selected
              </p>
              <div className="flex flex-wrap gap-2">
                {result.selectedScores.map((score, index) => (
                  <motion.div
                    key={index}
                    className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-sm font-medium text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    {formatScore(score)}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            className="p-4 bg-secondary/50 border border-border rounded-lg space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-semibold-sora text-foreground uppercase tracking-wide">
              📋 NPTEL Certification Requirements
            </p>
            <p className="text-sm text-muted-foreground">
              Assignment score ≥ {result.passThreshold}/25 AND Exam score ≥ 40/100
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
