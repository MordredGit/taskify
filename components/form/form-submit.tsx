"use client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

interface FormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export const FormSubmit = (props: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={props.variant || "primary"}
      disabled={pending || props.disabled}
      {...props}
    >
      {pending ? (
        <span>
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        <span>{props.children}</span>
      )}
    </Button>
  );
};
