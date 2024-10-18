import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  label?: string;
  copy_lable?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className, label, copy_lable }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button onClick={handleCopy} className={className}>
      <span className="inline-block">
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </span>
      <span className="ml-2">{isCopied ? copy_lable : label}</span>
    </Button>
  );
};

export default CopyButton;
