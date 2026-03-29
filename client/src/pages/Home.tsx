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
import {
  CourseDuration,
  calculateAssignmentScore,
  CalculationResult,
} from "@/lib/scoreCalculator";
import {
  clearPendingCalculation,
  downloadCalculationsCSV,
  getPendingCalculation,
  getCalculations,
  SavedCalculation,
  saveCalculation,
} from "@/lib/storage";
import { Download, History, Menu, RotateCcw, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link, useLocation } from "wouter";

/**
 * Home Page - NPTEL Assignment Score Checker
 * Design: Minimalist Academic Excellence
 * 
 * Layout:
 * - Header with title and description
 * - Two-column layout: Input section (left) and Results section (right)
 * - History available on dedicated page
 * - Smooth animations and transitions throughout
 */
export default function Home() {
  const [duration, setDuration] = useState<CourseDuration>(4);
  const [courseName, setCourseName] = useState("");
  const [scores, setScores] = useState<number[]>(Array(4).fill(0));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Load calculations from storage on mount
  useEffect(() => {
    const saved = getCalculations();
    setCalculations(saved);

    const pendingId = getPendingCalculation();
    if (!pendingId) {
      return;
    }

    const selected = saved.find((calc) => calc.id === pendingId);
    clearPendingCalculation();

    if (!selected) {
      return;
    }

    setDuration(selected.result.duration);
    setCourseName(selected.courseName);
    setScores(selected.result.allScores);
    setResult(selected.result);
  }, []);

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

  const handleDurationChange = (value: string) => {
    const nextDuration = parseInt(value) as CourseDuration;
    setDuration(nextDuration);
    setScores(Array(nextDuration).fill(0));
    setResult(null);
  };

  const handleExportCalculations = () => {
    const exported = downloadCalculationsCSV(calculations);
    
    const event = new CustomEvent("toast", {
      detail: exported
        ? {
            title: "Exported",
            description: "Calculations exported as CSV",
            type: "success",
          }
        : {
            title: "No Data",
            description: "No calculations to export",
            type: "info",
          },
    });
    window.dispatchEvent(event);
  };

  const handleGoToHistory = () => {
    setIsMobileMenuOpen(false);
    setLocation("/history");
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
          <div className="w-full md:w-[85vw] md:mx-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <img
                  src={logo}
                  alt="NPTEL Score Calculator"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Calculate your weighted assignment score accurately
                </p>
              </div>
              <div className="relative flex items-center gap-2 flex-shrink-0 ml-auto">
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCalculations}
                    disabled={calculations.length === 0}
                    className="gap-2 text-sm px-3"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoToHistory}
                    className="gap-2 text-sm px-3"
                  >
                    <History className="w-4 h-4" />
                    History ({calculations.length})
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  aria-label="Open menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>

                {isMobileMenuOpen && (
                  <div className="sm:hidden absolute right-0 top-12 w-44 rounded-lg border border-border bg-background shadow-lg p-2 z-50">
                    <button
                      type="button"
                      onClick={() => {
                        handleExportCalculations();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={calculations.length === 0}
                      className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-secondary/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToHistory}
                      className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-secondary/60"
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
                  </div>
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
                        onValueChange={handleDurationChange}
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
                    <Link href="/how-to-calculate" className="hover:text-foreground transition-colors">
                      How to Calculate
                    </Link>
                  </li>
                  <li>
                    <Link href="/nptel-guidelines" className="hover:text-foreground transition-colors">
                      NPTEL Guidelines
                    </Link>
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
              <p>© 2026 NPTEL Score Calculator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
