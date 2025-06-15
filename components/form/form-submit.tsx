"use client";
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
      {props.children}
    </Button>
  );
};
