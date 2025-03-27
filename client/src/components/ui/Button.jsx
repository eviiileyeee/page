import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Button = ({
  onClick,
  children,
  className = "",
  variant = "primary", // primary, secondary, outline, ghost
  size = "md", // sm, md, lg
  fullWidth = false,
  disabled = false,
}) => {
  // Updated size mappings with improved responsive sizing
  const sizeClasses = {
    sm: "h-8 py-1 px-4 text-sm",
    md: "h-10 py-2 px-6 text-base",
    lg: "h-12 py-3 px-8 text-lg"
  };

  const variantClasses = {
    primary: "bg-primary hover:bg-primary-dark text-white dark:bg-primary-light dark:hover:bg-primary",
    secondary: "bg-secondary hover:bg-secondary-dark text-white dark:bg-secondary-light dark:hover:bg-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white dark:border-primary-light dark:text-primary-light dark:hover:bg-primary-light dark:hover:text-gray-900",
    ghost: "text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary-light/10"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center rounded-lg font-medium",
        "transition-all duration-200 ease-in-out",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? "w-full" : "w-auto",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={!disabled && { scale: 1.02 }}
      whileTap={!disabled && { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;