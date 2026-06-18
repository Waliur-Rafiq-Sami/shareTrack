"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToastProps {
  title: string;
  description?: string;
  duration?: number;
}

type ToastVariant = "success" | "error" | "warning" | "info";

const variants = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    border: "border-emerald-500/20",
  },

  error: {
    icon: AlertCircle,
    iconClass: "text-red-500",
    border: "border-red-500/20",
  },

  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    border: "border-amber-500/20",
  },

  info: {
    icon: Info,
    iconClass: "text-blue-500",
    border: "border-blue-500/20",
  },
};

const showCustomToast = (variant: ToastVariant, { title, description, duration = 4000 }: ToastProps) => {
  const config = variants[variant];

  return sonnerToast.custom(
    (t) => {
      const Icon = config.icon;

      return (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-auto",
            "flex items-start gap-3",
            "w-[400px] max-w-[calc(100vw-24px)]",
            "rounded-xl",
            "border",
            "px-4 py-3",
            "shadow-xl",
            "transition-all duration-200",
            "bg-background",
            "text-foreground",
            "backdrop-blur-sm",
            config.border,
          )}>
          {/* Icon */}
          <div className="mt-0.5 shrink-0">
            <Icon className={cn("h-5 w-5", config.iconClass)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-5">{title}</p>

            {description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>}
          </div>

          {/* Close */}
          <button
            onClick={() => sonnerToast.dismiss(t)}
            className="
              shrink-0
              rounded-md
              p-1
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            ">
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    },
    {
      duration,
    },
  );
};

export const toast = {
  success: (props: ToastProps) => showCustomToast("success", props),
  error: (props: ToastProps) => showCustomToast("error", props),
  warning: (props: ToastProps) => showCustomToast("warning", props),
  info: (props: ToastProps) => showCustomToast("info", props),
};
