import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  actionPath,
}: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="card-xl flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Coffee className="w-8 h-8 text-white/40" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-white/60 text-sm mb-4 max-w-[200px]">
        {description}
      </p>
      {actionLabel && actionPath && (
        <button
          onClick={() => navigate(actionPath)}
          className="btn-gold px-6 py-3 rounded-full text-sm font-semibold min-h-[48px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
