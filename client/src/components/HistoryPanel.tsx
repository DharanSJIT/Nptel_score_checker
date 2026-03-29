import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedCalculation, deleteCalculation } from "@/lib/storage";
import { formatScore, getScoreStatusText } from "@/lib/scoreCalculator";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronRight } from "lucide-react";

interface HistoryPanelProps {
  calculations: SavedCalculation[];
  onSelectCalculation: (calc: SavedCalculation) => void;
  onDeleteCalculation: (id: string) => void;
}

/**
 * Component for displaying calculation history
 * Design: Minimalist Academic Excellence
 * - Clean list of past calculations
 * - Quick access to previous results
 * - Delete functionality with confirmation
 */
export default function HistoryPanel({
  calculations,
  onSelectCalculation,
  onDeleteCalculation,
}: HistoryPanelProps) {
  const handleDelete = (id: string) => {
    deleteCalculation(id);
    onDeleteCalculation(id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (calculations.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-display">History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No calculations yet. Start by entering your scores above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-display">
          Recent Calculations
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {calculations.length} calculation{calculations.length !== 1 ? "s" : ""}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {calculations
              .slice()
              .reverse()
              .map((calc, index) => (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => onSelectCalculation(calc)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {calc.courseName || "Unnamed Course"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(calc.timestamp)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {formatScore(calc.result.assignmentScore)}/25
                          </p>
                          <p
                            className={`text-xs font-medium ${
                              calc.result.isPassing
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {getScoreStatusText(
                              calc.result.assignmentScore,
                              calc.result.passThreshold
                            )}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </button>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    whileHover={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(calc.id)}
                      className="w-full mt-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
