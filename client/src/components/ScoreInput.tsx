import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseDuration, getTotalAssignmentCount } from "@/lib/scoreCalculator";
import { motion } from "framer-motion";

interface ScoreInputProps {
  duration: CourseDuration;
  scores: number[];
  onScoresChange: (scores: number[]) => void;
}

/**
 * Component for entering individual assignment scores
 * Design: Minimalist Academic Excellence
 * - Clean input fields with clear labels
 * - Responsive grid layout
 * - Smooth animations on input changes
 */
export default function ScoreInput({
  duration,
  scores,
  onScoresChange,
}: ScoreInputProps) {
  const totalCount = getTotalAssignmentCount(duration);

  const handleScoreChange = (index: number, value: string) => {
    const numValue = value === "" ? 0 : Math.min(100, Math.max(0, parseFloat(value) || 0));
    const newScores = [...scores];
    newScores[index] = numValue;
    onScoresChange(newScores);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold-sora text-foreground">
          Enter Assignment Scores
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your score for each week (0-100). Best scores will be automatically selected.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {Array.from({ length: totalCount }).map((_, index) => (
          <motion.div key={index} variants={itemVariants} className="space-y-2">
            <Label
              htmlFor={`score-${index}`}
              className="text-sm font-medium text-foreground"
            >
              Week {index + 1}
            </Label>
            <div className="relative">
              <Input
                id={`score-${index}`}
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={scores[index] || ""}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                placeholder="0"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                /100
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="pt-4 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Scores entered:</span>
          <span className="font-medium text-foreground">
            {scores.filter((s) => s > 0).length} / {totalCount}
          </span>
        </div>
        <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${((scores.filter((s) => s > 0).length) / totalCount) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
