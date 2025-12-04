import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  label: string;
  color: string;
}

const calculateStrength = (password: string): StrengthResult => {
  let score = 0;

  if (!password) {
    return { level: "weak", score: 0, label: "Enter a password", color: "bg-muted" };
  }

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Bonus for mixing character types
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const typesUsed = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (typesUsed >= 3) score += 1;
  if (typesUsed === 4) score += 1;

  // Determine strength level
  if (score <= 3) {
    return { level: "weak", score, label: "Weak", color: "bg-destructive" };
  } else if (score <= 6) {
    return { level: "medium", score, label: "Medium", color: "bg-yellow-500" };
  } else {
    return { level: "strong", score, label: "Strong", color: "bg-primary" };
  }
};

const PasswordStrengthIndicator = ({ password, className }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex gap-1">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              password.length > 0 && bar === 1 ? strength.color : "bg-muted",
              strength.level !== "weak" && bar === 2 ? strength.color : bar === 2 ? "bg-muted" : "",
              strength.level === "strong" && bar === 3 ? strength.color : bar === 3 ? "bg-muted" : ""
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-xs transition-colors",
        strength.level === "weak" && "text-destructive",
        strength.level === "medium" && "text-yellow-600 dark:text-yellow-500",
        strength.level === "strong" && "text-primary"
      )}>
        Password strength: {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
