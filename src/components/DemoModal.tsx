import { useEffect } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Disable ESC key
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-[var(--navy-card)] border border-[var(--border-soft)] rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="font-display text-2xl font-light text-[var(--gold)] mb-4">
          Contact for Hiring
        </h2>
        <p className="mb-2 text-[var(--white)]">
          <strong>Email:</strong> zahidshersial@gmail.com
        </p>
        <p className="mb-6 text-[var(--white-dim)]">
          This is demo front for your reference.
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-[var(--gold)] text-[var(--navy)] rounded hover:bg-[var(--gold-light)] transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}