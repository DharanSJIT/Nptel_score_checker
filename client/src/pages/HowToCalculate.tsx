import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function HowToCalculate() {
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
              <CardTitle className="text-2xl font-display">How to Calculate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm sm:text-base text-muted-foreground">
              <p>
                Your assignment component is calculated out of <strong className="text-foreground">25</strong>.
                The app picks only the best assignment scores based on your course duration.
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Selection Rules</p>
                <p>4-week course: best 3 out of 4 assignments</p>
                <p>8-week course: best 6 out of 8 assignments</p>
                <p>12-week course: best 8 out of 12 assignments</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Formula</p>
                <p>
                  Assignment Score = (Sum of selected best scores / Maximum possible for selected scores) × 25
                </p>
                <p>Example (8-week): if best 6 sum to 510, then score = (510 / 600) × 25 = 21.25</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Quick Steps</p>
                <p>1. Select course duration.</p>
                <p>2. Enter weekly assignment scores (0 to 100).</p>
                <p>3. Read calculated assignment score and pass/fail hint.</p>
                <p>4. Save to history to revisit later.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
