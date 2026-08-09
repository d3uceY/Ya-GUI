import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent-strong text-white [a&]:hover:bg-accent",
        secondary:
          "border-accent-deep/70 bg-accent-tint text-accent-soft [a&]:hover:bg-accent-tint/70",
        destructive:
          "border-transparent bg-danger-strong text-white [a&]:hover:bg-danger",
        outline:
          "border-edge-strong bg-surface text-fg-muted [a&]:hover:bg-surface-3 [a&]:hover:text-fg-strong",
        success:
          "border-transparent bg-success-tint text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
