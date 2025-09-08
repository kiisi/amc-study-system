import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CircularProgressIcon } from "../svgs";
import { cn } from "~/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonVariants = cva(
    "grid place-items-center whitespace-nowrap rounded-[8px] text-[14px] lg:text-[16px] focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-80",
    {
        variants: {
            variant: {
                default: "bg-primary text-white",
                secondary:
                    "bg-white border-[1px] text-primary",
                outline:
                    "bg-white border-[1px] text-primary",
            },
            size: {
                default: "h-[42px] lg:h-[48px] px-[16px] lg:px-[24px] rounded-[8px]",
                small: "h-[37px] px-[24px] rounded-[5px] text-[14px]",
                lg: "h-[36px] py-[9.5px] px-[18px] lg:text-[14px] leading-[100%] tracking-[0%] text-white rounded-[8px]",
                smallest: "h-[33px] px-[14px] rounded-[8px] text-[14px] lg:text-[14px]",
                medium: "h-[40px] px-[24px] rounded-[5px] text-[14px]",
                icon: "px-[14px] h-[40px] text-[14px] rounded-[8px] gap-[3px]"
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  iconGap?: number;
}

const Button = ({ className, variant, size, asChild = false, children, isLoading, disabled, leading, trailing, iconGap, ...properties }: ButtonProperties) => {
    const Element = asChild ? Slot : "button";
    return (
        <Element
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={isLoading || disabled}
            {...properties}
        >
            {isLoading ? (
                <CircularProgressIcon />
            ) : (
                children
            )}
        </Element>
    );
}

Button.displayName = "Button";

export { Button };