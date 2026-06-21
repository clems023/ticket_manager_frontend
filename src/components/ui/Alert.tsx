import type { ReactNode } from "react";

type AlertVariant = "error" | "success" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export function Alert({
  variant = "error",
  title,
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <p className="text-sm">{children}</p>
    </div>
  );
}
