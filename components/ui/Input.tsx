import * as React from "react";
import { cn } from "@/lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 'type'> {
  type?: "text" | "email" | "password" | "number" | "file" | "date" | "checkbox" | "radio" | "textarea" | "select";
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[]; // For select type
  registration?: Partial<UseFormRegisterReturn>;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      icon,
      options = [],
      registration,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

    // Common classes for text-like inputs
    const baseInputClasses = cn(
      "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      error ? "border-destructive focus-visible:ring-destructive" : "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
      icon && "pl-10",
      className
    );

    const renderInput = () => {
      if (type === "textarea") {
        return (
          <textarea
            id={inputId}
            className={cn(baseInputClasses, "min-h-[80px] py-3")}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(registration as any)}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );
      }

      if (type === "select") {
        return (
          <select
            id={inputId}
            className={baseInputClasses}
            ref={ref as React.Ref<HTMLSelectElement>}
            {...(registration as any)}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      if (type === "checkbox" || type === "radio") {
        return (
          <input
            type={type}
            id={inputId}
            className={cn(
              "h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary",
              type === "radio" && "rounded-full",
              className
            )}
            ref={ref as React.Ref<HTMLInputElement>}
            {...registration}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        );
      }

      return (
        <input
          type={type}
          id={inputId}
          className={cn(baseInputClasses, type === "file" && "file:border-0 file:bg-transparent file:text-sm file:font-medium p-0")}
          ref={ref as React.Ref<HTMLInputElement>}
          {...registration}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      );
    };

    return (
      <div className={cn("w-full", (type === "checkbox" || type === "radio") && "flex items-center gap-2 flex-row-reverse justify-end")}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none text-neutral-700",
              (type !== "checkbox" && type !== "radio") && "mb-2 block"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          {renderInput()}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-destructive font-medium" : "text-neutral-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
