import React from 'react';
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';

interface LabelWithTooltipProps {
  label?: string;
  tooltipText: string;
  tooltipImage?: string;
}

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, tooltipText, tooltipImage }) => {
  const handleTooltipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
   // e.stopPropagation();
  };

  return (
    <div className="flex items-center space-x-2">
      <span>{label}</span>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button onClick={handleTooltipClick} className="focus:outline-none">
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs sm:max-w-md">
            <div className="flex flex-col items-center">
            <p className='text-semibold'>{tooltipText}</p>

              {tooltipImage && (
                <Image src={tooltipImage} height={500} width={500} alt="Tooltip"  />
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LabelWithTooltip;