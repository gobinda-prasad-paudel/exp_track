// src/hooks/useToast.tsx
import toast from "react-hot-toast";
import React from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast(data: ToastOptions) {
  const { title, description, variant = "default" } = data;
  toast.custom((t) => (
    <div
      className={`${t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 ${variant === "destructive" ? "bg-red-600 text-white" : ""
        } ${variant === "success" ? "bg-green-600 text-white" : ""}`}
    >
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        {description && <p className="text-sm">{description}</p>}
      </div>
    </div>
  ));
}
