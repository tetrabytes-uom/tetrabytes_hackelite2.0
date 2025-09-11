"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: Toast["type"], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastIcon = ({ type }: { type: Toast["type"] }) => {
  const iconProps = { className: "h-5 w-5" };

  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="h-5 w-5" />;
    case "error":
      return <XCircle {...iconProps} className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle {...iconProps} className="h-5 w-5" />;
    case "info":
      return <Info {...iconProps} className="h-5 w-5" />;
    default:
      return <Info {...iconProps} className="h-5 w-5" />;
  }
};

const ToastComponent = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white",
          border: "border-green-200",
          icon: "text-green-600 bg-green-100",
          accent: "bg-green-500",
          glow: "shadow-green-500/20",
        };
      case "error":
        return {
          bg: "bg-white",
          border: "border-red-200",
          icon: "text-red-600 bg-red-100",
          accent: "bg-red-500",
          glow: "shadow-red-500/20",
        };
      case "warning":
        return {
          bg: "bg-white",
          border: "border-yellow-200",
          icon: "text-yellow-600 bg-yellow-100",
          accent: "bg-yellow-500",
          glow: "shadow-yellow-500/20",
        };
      case "info":
        return {
          bg: "bg-white",
          border: "border-blue-200",
          icon: "text-blue-600 bg-blue-100",
          accent: "bg-blue-500",
          glow: "shadow-blue-500/20",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-gray-200",
          icon: "text-gray-600 bg-gray-100",
          accent: "bg-gray-500",
          glow: "shadow-gray-500/20",
        };
    }
  };

  const styles = getToastStyles(toast.type);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`
        w-full max-w-md mx-auto shadow-2xl rounded-2xl border-2 p-6
        transform transition-all duration-300 ease-in-out
        animate-slide-in-center hover:scale-[1.02]
        ${styles.bg} ${styles.border} ${styles.glow}
        relative overflow-hidden backdrop-blur-sm
      `}
    >
      {/* Background overlay with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

      <div className="flex items-center relative z-10">
        <div className={`flex-shrink-0 p-3 rounded-full ${styles.icon}`}>
          <ToastIcon type={toast.type} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-base font-semibold leading-6 text-gray-800">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(toast.id)}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-200 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced progress bar */}
      <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${styles.accent} shadow-lg transition-all duration-300`}
          style={{
            animation: `shrink ${toast.duration || 4000}ms ease-out forwards`,
          }}
        />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"], duration = 4000) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container with backdrop */}
      {toasts.length > 0 && (
        <>
          {/* Semi-transparent backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

          {/* Toast Container - Centered */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 space-y-4 max-w-md w-full px-4">
            {toasts.map((toast) => (
              <ToastComponent
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
              />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in-center {
          from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-center {
          animation: slide-in-center 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
