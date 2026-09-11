import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none text-white [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]",
        className
      )}
      {...props}
    />
  );
}

export default Label;
