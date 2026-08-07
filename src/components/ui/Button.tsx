"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/25 hover:brightness-110",
        secondary: "bg-white/10 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/20 border border-black/5 dark:border-white/10",
        glass: "bg-white/40 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white border border-black/10 dark:border-white/10 hover:border-indigo-500/40 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm",
        ghost: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5",
        outline: "border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5",
        destructive: "bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20",
        emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30",
      },
      size: {
        sm: "px-3 py-1.5 text-[11px]",
        md: "px-4 py-2 text-xs",
        lg: "px-5 py-2.5 text-sm rounded-2xl",
        icon: "p-2 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "variant">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.01 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
