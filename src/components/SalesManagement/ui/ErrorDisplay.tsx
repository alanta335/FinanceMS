import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      <p className="text-red-700">{error}</p>
      <button
        onClick={onDismiss}
        className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorDisplay;
