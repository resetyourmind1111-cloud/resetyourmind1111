import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
}

export function AuthFormField({ id, type, placeholder, value, onChange, error, icon }: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F9F6F0]/40">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#F9F6F0]/5 border-[#C9A84C]/20 text-[#F9F6F0] placeholder:text-[#F9F6F0]/30 h-14 rounded-xl ${icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} focus:border-[#C9A84C]/60 focus:ring-[#C9A84C]/20 ${error ? "border-red-400/60" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F9F6F0]/40 hover:text-[#F9F6F0]/70 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
