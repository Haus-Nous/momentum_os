"use client";

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white shadow-sm hover:brightness-105",
        secondary: "bg-[#E2DACD]/50 dark:bg-[#332F2B]/60 text-gray-900 dark:text-white hover:bg-[#E2DACD] dark:hover:bg-[#332F2B] border border-[#E2DACD] dark:border-[#332F2B]",
        glass: "bg-[#F3EFE6]/80 dark:bg-[#1C1A18]/80 backdrop-blur-md text-gray-900 dark:text-white border border-[#E2DACD] dark:border-[#332F2B] hover:border-[#C85A32]/40 shadow-sm",
        ghost: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5",
        outline: "border border-[#E2DACD] dark:border-[#332F2B] text-gray-800 dark:text-gray-200 hover:bg-[#E2DACD]/30 dark:hover:bg-[#332F2B]/30",
        destructive: "bg-[#C85A32] hover:bg-[#B54E29] text-white shadow-sm",
        emerald: "bg-[#8A9A86] hover:bg-[#788874] dark:bg-[#9DB098] dark:hover:bg-[#8A9A86] text-white shadow-sm",
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
