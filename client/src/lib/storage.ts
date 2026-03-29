/**
 * Local Storage Utilities for NPTEL Score Checker
 * Persists calculation history and user preferences
 */

import { CalculationResult } from "./scoreCalculator";

export interface SavedCalculation {
  id: string;
  timestamp: number;
  courseName: string;
  result: CalculationResult;
}

const STORAGE_KEY = "nptel_calculations";
const PREFERENCES_KEY = "nptel_preferences";

/**
 * Save a calculation to local storage
 */
export function saveCalculation(
  courseName: string,
  result: CalculationResult
): SavedCalculation {
  const calculations = getCalculations();
  
  const newCalculation: SavedCalculation = {
    id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    courseName,
    result,
  };

  calculations.push(newCalculation);
  
  // Keep only last 50 calculations
  if (calculations.length > 50) {
    calculations.shift();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
  } catch (error) {
    console.error("Failed to save calculation:", error);
  }

  return newCalculation;
}

/**
 * Get all saved calculations
 */
export function getCalculations(): SavedCalculation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to retrieve calculations:", error);
    return [];
  }
}

/**
 * Delete a calculation by ID
 */
export function deleteCalculation(id: string): void {
  try {
    const calculations = getCalculations();
    const filtered = calculations.filter((calc) => calc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete calculation:", error);
  }
}

/**
 * Clear all calculations
 */
export function clearAllCalculations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear calculations:", error);
  }
}

/**
 * Export calculations as JSON
 */
export function exportCalculations(): string {
  const calculations = getCalculations();
  return JSON.stringify(calculations, null, 2);
}

/**
 * Import calculations from JSON
 */
export function importCalculations(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to import calculations:", error);
    return false;
  }
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Record<string, any>): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

/**
 * Get user preferences
 */
export function getPreferences(): Record<string, any> {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to retrieve preferences:", error);
    return {};
  }
}
