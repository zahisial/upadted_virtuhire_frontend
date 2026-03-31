'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DemoModal from './DemoModal';

interface AutoDemoModalProps {
  onModalClose?: () => void;   // optional callback for when modal is closed
}

export default function AutoDemoModal({ onModalClose }: AutoDemoModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.get('demo') === 'true') {
      setIsOpen(true);
      // Remove the query param from the URL without refreshing
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setIsOpen(false);
    // Call the optional callback (provided by the page)
    if (onModalClose) onModalClose();
  };

  return <DemoModal isOpen={isOpen} onClose={handleClose} />;
}