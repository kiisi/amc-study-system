import { useId, useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeSlashIcon } from "../svgs";
import { cn } from "~/utils";

export interface PasswordInputProperties
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string | boolean;
  touched?: boolean;
  className?: string;
}

export default function PasswordInput({
  label,
  id,
  error,
  className = "",
  ...props
}: PasswordInputProperties) {
  const [showPassword, setShowPassword] = useState(false);

  const _id = useId();

  return (
    <div>
      {label && (
        <label
          htmlFor={id ?? _id}
          className="text-[14px] lg:text-[16px] text-[#333333] leading-[100%] mb-[8px] inline-block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id ?? _id}
          type={showPassword ? "text" : "password"}
          className={cn("px-[16px] block w-full h-[44px] border-[1px] rounded-[6px] placeholder-[#BBBBBB] border-[#0D72ED33]", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute cursor-pointer  right-[16px] top-[50%] translate-y-[-50%]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {!showPassword ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
    </div>
  );
};
