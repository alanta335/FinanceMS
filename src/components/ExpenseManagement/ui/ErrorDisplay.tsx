// ExpenseManagement UI: ErrorDisplay
import React from "react";

type Props = {
  error: string | null;
  onDismiss: () => void;
};

const ErrorDisplay: React.FC<Props> = ({ error, onDismiss }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
