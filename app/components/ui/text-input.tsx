import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../utils";

export interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  touched?: boolean;
  className?: string;
}

export default function TextInput({
  label,
  id,
  error,
  touched,
  className = "",
  ...props
}: TextInputProps){

  const _id = useId();

  return (
    <fieldset>
      {label && (
        <label
          htmlFor={id ?? _id}
          className="text-[14px] lg:text-[16px] text-[#333333] leading-[100%] mb-[8px] inline-block"
        >
          {label}
        </label>
      )}
      <input
        id={id ?? _id}
        className={cn("px-[16px] block w-full h-[44px] border-[1px] border-[#0D72ED33] rounded-[6px] placeholder-[#BBBBBB]")}
        {...props}
      />
    </fieldset>
  );
};

