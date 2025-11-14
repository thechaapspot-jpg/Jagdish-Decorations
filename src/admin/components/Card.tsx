import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-[#1a1f2e]/80 backdrop-blur-sm border border-white/10 rounded-lg ${
        hover ? "hover:border-white/20 hover:bg-[#1a1f2e]/90 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
}

export function StatCard({ icon, label, value, iconBg }: StatCardProps) {
  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-white font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  iconBg: string;
}

export function ActionCard({ icon, title, description, onClick, iconBg }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-5 bg-[#1a1f2e]/80 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 hover:bg-[#1a1f2e]/90 transition-all text-left w-full"
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-base mb-1">{title}</h4>
          <p className="text-sm text-white/90">{description}</p>
        </div>
      </div>
    </button>
  );
}

interface ImageCardProps {
  imageUrl: string;
  imageName: string;
  onDelete: () => void;
  deleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  deleting?: boolean;
}

export function ImageCard({
  imageUrl,
  imageName,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  deleting = false,
}: ImageCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img
          src={imageUrl}
          alt={imageName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-3">
        <p className="text-xs font-semibold text-white truncate mb-3" title={imageName}>
          {imageName}
        </p>

        {deleteConfirm ? (
          <div className="space-y-2">
            <p className="text-xs text-red-100 text-center font-semibold">Delete this image?</p>
            <div className="flex gap-2">
              <button
                onClick={onConfirmDelete}
                disabled={deleting}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={onCancelDelete}
                disabled={deleting}
                className="flex-1 px-3 py-2 bg-white/20 text-white text-xs font-bold rounded-lg hover:bg-white/30 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 border border-red-400/30 text-red-100 hover:bg-red-500/30 hover:text-white rounded-lg text-xs font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </Card>
  );
}
