import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NptelGuidelines() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container py-4 sm:py-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/")}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img
              src={logo}
              alt="NPTEL Score Calculator"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>
      </motion.header>

      <main className="container py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-display">NPTEL Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm sm:text-base text-muted-foreground">
              <p>
                This calculator follows the common NPTEL assignment-score pattern used in many courses.
                Final certification generally depends on both assignments and proctored exam.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Common Requirements</p>
                <p>Assignment score is computed out of 25 using top assignments only.</p>
                <p>Exam score is typically out of 75 (or converted as per course policy).</p>
                <p>A common passing requirement is minimum threshold in both components.</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Important Note</p>
                <p>
                  Course-specific rules can vary. Always verify the exact formula, pass criteria,
                  and eligibility conditions from your official NPTEL course page.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">How to Use This Safely</p>
                <p>1. Use this result as a planning/reference estimate.</p>
                <p>2. Compare with official announcements before final decisions.</p>
                <p>3. Keep assignment and exam targets above the minimum thresholds.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
