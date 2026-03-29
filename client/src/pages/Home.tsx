import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ScoreInput from "@/components/ScoreInput";
import ResultCard from "@/components/ResultCard";
import HistoryPanel from "@/components/HistoryPanel";
import {
  CourseDuration,
  calculateAssignmentScore,
  CalculationResult,
} from "@/lib/scoreCalculator";
import {
  saveCalculation,
  getCalculations,
  SavedCalculation,
} from "@/lib/storage";
import { RotateCcw, Download } from "lucide-react";

/**
 * Home Page - NPTEL Assignment Score Checker
 * Design: Minimalist Academic Excellence
 * 
 * Layout:
 * - Header with title and description
 * - Two-column layout: Input section (left) and Results section (right)
 * - History panel below
 * - Smooth animations and transitions throughout
 */
export default function Home() {
  const [duration, setDuration] = useState<CourseDuration>(4);
  const [courseName, setCourseName] = useState("");
  const [scores, setScores] = useState<number[]>(Array(4).fill(0));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load calculations from storage on mount
  useEffect(() => {
    const saved = getCalculations();
    setCalculations(saved);
  }, []);

  // Update scores array when duration changes
  useEffect(() => {
    setScores(Array(duration).fill(0));
    setResult(null);
  }, [duration]);

  // Calculate score whenever scores change
  useEffect(() => {
    if (scores.some((s) => s > 0)) {
      const calculationResult = calculateAssignmentScore({
        duration,
        scores,
      });
      setResult(calculationResult);
    }
  }, [scores, duration]);

  const handleSaveCalculation = () => {
    if (result) {
      const saved = saveCalculation(courseName || "Unnamed Course", result);
      setCalculations([...calculations, saved]);
      // Show success toast
      const event = new CustomEvent("toast", {
        detail: {
          title: "Saved",
          description: "Calculation saved to history",
          type: "success",
        },
      });
      window.dispatchEvent(event);
    }
  };

  const handleReset = () => {
    setScores(Array(duration).fill(0));
    setCourseName("");
    setResult(null);
  };

  const handleSelectCalculation = (calc: SavedCalculation) => {
    setDuration(calc.result.duration);
    setCourseName(calc.courseName);
    setScores(calc.result.allScores);
    setResult(calc.result);
    setShowHistory(false);
  };

  const handleDeleteCalculation = (id: string) => {
    setCalculations(calculations.filter((c) => c.id !== id));
  };

  const handleExportCalculations = () => {
    const data = calculations.map((c) => ({
      courseName: c.courseName,
      date: new Date(c.timestamp).toLocaleDateString(),
      score: c.result.assignmentScore,
      status: c.result.isPassing ? "Pass" : "Fail",
      scores: c.result.allScores,
    }));

    const csv = [
      ["Course Name", "Date", "Assignment Score", "Status", "Individual Scores"],
      ...data.map((d) => [
        d.courseName,
        d.date,
        d.score,
        d.status,
        d.scores.join(";"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nptel-calculations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Show success toast
    const event = new CustomEvent("toast", {
      detail: {
        title: "Exported",
        description: "Calculations exported as CSV",
        type: "success",
      },
    });
    window.dispatchEvent(event);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground truncate">
                  NPTEL Score Calculator
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Calculate your weighted assignment score accurately
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {calculations.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCalculations}
                      className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      History ({calculations.length})
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Input Section */}
            <motion.div className="lg:col-span-2 space-y-4 sm:space-y-6" variants={itemVariants}>
              {/* Course Info Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg font-display">
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Course Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="course-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Course Name (Optional)
                      </Label>
                      <Input
                        id="course-name"
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="e.g., Data Structures"
                        className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Course Duration */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="text-sm font-medium text-foreground"
                      >
                        Course Duration
                      </Label>
                      <Select
                        value={duration.toString()}
                        onValueChange={(val) =>
                          setDuration(parseInt(val) as CourseDuration)
                        }
                      >
                        <SelectTrigger
                          id="duration"
                          className="border-border bg-background text-foreground"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 Weeks</SelectItem>
                          <SelectItem value="8">8 Weeks</SelectItem>
                          <SelectItem value="12">12 Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Info Box */}
                  <motion.div
                    className="p-4 bg-secondary/50 border border-border rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs font-semibold-sora text-foreground uppercase tracking-wide mb-2">
                      📌 How it works
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {duration === 4 &&
                        "Your best 3 out of 4 assignments will be counted. Assignment score = (Sum of best 3 / 300) × 25"}
                      {duration === 8 &&
                        "Your best 6 out of 8 assignments will be counted. Assignment score = (Sum of best 6 / 600) × 25"}
                      {duration === 12 &&
                        "Your best 8 out of 12 assignments will be counted. Assignment score = (Sum of best 8 / 800) × 25"}
                    </p>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Score Input Card */}
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-lg font-display">
                    Assignment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScoreInput
                    duration={duration}
                    scores={scores}
                    onScoresChange={setScores}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2 flex-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                {result && (
                  <Button
                    onClick={handleSaveCalculation}
                    className="flex-1"
                  >
                    Save to History
                  </Button>
                )}
              </motion.div>
            </motion.div>

            {/* Right Column - Results Section */}
            <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
              {/* Results Card */}
              {result ? (
                <ResultCard result={result} courseName={courseName} />
              ) : (
                <Card className="border-border shadow-sm">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/50 mx-auto flex items-center justify-center">
                        <span className="text-xl">📊</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enter your assignment scores to see your calculated score
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* History Panel */}
              {showHistory && calculations.length > 0 && (
                <HistoryPanel
                  calculations={calculations}
                  onSelectCalculation={handleSelectCalculation}
                  onDeleteCalculation={handleDeleteCalculation}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t border-border mt-8 sm:mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="container py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h3 className="text-sm font-semibold-sora text-foreground mb-3">
                  About
                </h3>
                <p className="text-sm text-muted-foreground">
                  NPTEL Score Calculator helps you compute your weighted assignment
                  score accurately based on NPTEL's official calculation rules.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold-sora text-foreground mb-3">
                  Information
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      How to Calculate
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      NPTEL Guidelines
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold-sora text-foreground mb-3">
                  Note
                </h3>
                <p className="text-sm text-muted-foreground">
                  This calculator is for reference only. Always verify with official
                  NPTEL guidelines for accurate certification requirements.
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs text-muted-foreground">
              <p>© 2024 NPTEL Score Calculator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
