import logo from "@/assets/logo.png";
import HistoryPanel from "@/components/HistoryPanel";
import ResultCard from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import {
  SavedCalculation,
  deleteCalculation,
  downloadCalculationsCSV,
  getCalculations,
} from "@/lib/storage";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function History() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [selectedCalculation, setSelectedCalculation] =
    useState<SavedCalculation | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setCalculations(getCalculations());
  }, []);

  const handleBack = () => setLocation("/");

  const handleSelectCalculation = (calc: SavedCalculation) => {
    setSelectedCalculation(calc);
  };

  const handleDeleteCalculation = (id: string) => {
    deleteCalculation(id);
    setCalculations((prev) => prev.filter((calc) => calc.id !== id));
    setSelectedCalculation((prev) => (prev?.id === id ? null : prev));
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

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container py-4 sm:py-6">
          <div className="w-full md:w-[85vw] md:mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Button variant="outline" size="icon" onClick={handleBack} aria-label="Back to home">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img
                src={logo}
                alt="NPTEL Score Calculator"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCalculations}
              disabled={calculations.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <HistoryPanel
              calculations={calculations}
              onSelectCalculation={handleSelectCalculation}
              onDeleteCalculation={handleDeleteCalculation}
            />

            {selectedCalculation && (
              <ResultCard
                result={selectedCalculation.result}
                courseName={selectedCalculation.courseName}
              />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
