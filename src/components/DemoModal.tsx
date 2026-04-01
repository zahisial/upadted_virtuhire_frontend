import { useEffect } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') e.preventDefault();
      };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="bg-[var(--navy-card)] border border-[var(--border-soft)] rounded-xl shadow-2xl max-w-md w-full mx-auto p-6 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl md:text-3xl font-light text-[var(--gold)] mb-4 text-center">
          Contact for Hiring
        </h2>
        <div className="text-center mb-6">
          <p className="text-[var(--white)] text-base mb-2">
            <strong>Email:</strong> zahidshersial@gmail.com
          </p>
          <p className="text-[var(--white-dim)] text-sm">
            This is demo front for your reference.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold-light)] transition-colors font-medium text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
}