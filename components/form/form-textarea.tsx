"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-errors";

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[]>;
}
export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (props, ref) => {
    const { pending } = useFormStatus();
    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {props.label ? (
            <Label
              htmlFor={props.id}
              className="text-xs font-semibold text-neutral-700"
            >
              {props.label}
            </Label>
          ) : null}
          <Textarea
            {...props}
            ref={ref}
            name={props.id}
            disabled={pending || props.disabled}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm text-sm",
              props.className,
            )}
            aria-describedby={`${props.id}-error`}
          />{" "}
        </div>
        <FormErrors id={props.id} errors={props.errors} />
      </div>
    );
  },
);

FormTextArea.displayName = "FormTextArea";
