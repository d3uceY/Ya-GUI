import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-edge bg-surface px-3 py-1 text-[13px] text-fg shadow-[inset_0_1px_0_rgba(0,0,0,0.3)] transition-[border-color,box-shadow] placeholder:text-fg-faint file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-accent-deep focus:ring-2 focus:ring-accent/25 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/25",
        className
      )}
      {...props}
    />
  )
}

export { Input }
