import { Link } from "react-router-dom";

interface AuthErrorProps {
  message: string;
  linkText?: string;
  linkTo?: string;
}

export function AuthError({ message, linkText, linkTo }: AuthErrorProps) {
  return (
    <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mt-4">
      <p className="text-sm text-red-300">
        {message}
        {linkText && linkTo && (
          <>
            {" "}
            <Link to={linkTo} className="text-[#C9A84C] hover:underline font-medium">
              {linkText}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
