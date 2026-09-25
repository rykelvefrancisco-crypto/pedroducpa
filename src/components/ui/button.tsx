import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "gold" | "outline" | "ghost" | "danger" };

export function Button({ className, variant = "gold", ...props }: Props) {
  const variants = {
    gold: "bg-primary text-primary-foreground shadow-gold hover:bg-primary-bright hover:-translate-y-0.5",
    outline: "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary",
    danger: "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
  };
  return <button className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-body text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", variants[variant], className)} {...props} />;
}
