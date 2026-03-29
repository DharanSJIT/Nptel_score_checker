import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
}

/**
 * Toast Notification Component
 * Design: Minimalist Academic Excellence
 * - Clean, unobtrusive notifications
 * - Smooth animations
 * - Auto-dismiss after 4 seconds
 */
export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { title, description, type = "success" } = customEvent.detail;

      const id = `toast_${Date.now()}_${Math.random()}`;
      const toast: ToastMessage = { id, title, description, type };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-900";
      case "error":
        return "text-red-900";
      default:
        return "text-blue-900";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 p-4 rounded-lg border ${getBackgroundColor(
              toast.type || "info"
            )} pointer-events-auto shadow-sm`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type || "info")}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold-sora ${getTextColor(
                  toast.type || "info"
                )}`}
              >
                {toast.title}
              </p>
              {toast.description && (
                <p
                  className={`text-sm mt-1 ${getTextColor(
                    toast.type || "info"
                  )} opacity-90`}
                >
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 ${getTextColor(
                toast.type || "info"
              )} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
