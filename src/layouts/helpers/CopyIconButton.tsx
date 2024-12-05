import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyIconButtonProps {
  textToCopy: string;
  className?: string;
  children?: React.ReactNode;
}

const CopyIconButton: React.FC<CopyIconButtonProps> = ({ textToCopy, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-start justify-start text-left py-0.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Copy" 
      title="Copy"
    >
      <span className="flex items-start justify-start w-full">
        {children ? children : ''} 
        {isCopied ? 
          <Check className="h-4 w-4" /> : 
          <Copy className="h-4 w-4" />
        }
      </span>
    </button>
  );
};

export default CopyIconButton;
