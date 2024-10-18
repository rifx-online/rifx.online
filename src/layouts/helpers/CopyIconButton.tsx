import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyIconButtonProps {
  textToCopy: string;
  className?: string;
}

const CopyIconButton: React.FC<CopyIconButtonProps> = ({ textToCopy, className }) => {
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
    <span 
      onClick={handleCopy} 
      className={`cursor-pointer ${className}`} 
      title="Copy"
    >
      {isCopied ? 
        <Check className="h-4 w-4" /> : 
        <Copy className="h-4 w-4" />
      }
    </span>
  );
};

export default CopyIconButton;
