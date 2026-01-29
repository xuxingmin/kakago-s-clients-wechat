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
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Coffee className="w-10 h-10 text-white/40" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-6 max-w-[240px]">
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
