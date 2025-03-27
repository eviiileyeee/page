"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "../../context/ThemeContext/ThemeContext";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}) {
  const { darkMode } = useTheme();

  return (
    <Tag
      className={cn(
        "relative flex items-center justify-center px-6 py-3 rounded-full transition-all duration-300",
        "hover:scale-105",
        containerClassName
      )}
      {...props}
    >
      {/* Button Content */}
      <div className={cn(
        "z-10 px-4 py-2 rounded-full",
        "text-gray-900 dark:text-white",
        className
      )}>
        {children}
      </div>

      {/* Gradient Border Effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r from-primary to-secondary",
          "opacity-75 dark:opacity-90"
        )}
        style={{ 
          filter: "blur(6px)",
        }}
      />

      {/* Inner Background Layer */}
      <div
        className={cn(
          "absolute inset-[2px] rounded-full",
          "bg-white dark:bg-gray-900",
          "transition-colors duration-300"
        )}
      />
    </Tag>
  );
}
