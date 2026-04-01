'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DemoModal from './DemoModal';

interface AutoDemoModalProps {
  onModalClose?: () => void;
}

export default function AutoDemoModal({ onModalClose }: AutoDemoModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.get('demo') === 'true') {
      setIsOpen(true);
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setIsOpen(false);
    if (onModalClose) onModalClose();
  };

  return <DemoModal isOpen={isOpen} onClose={handleClose} />;
}