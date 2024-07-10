import React from 'react';
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from 'next/image';
import { useMediaQuery } from "@uidotdev/usehooks";

interface LabelWithTooltipProps {
  label?: string;
  tooltipText: string;
  tooltipImage?: string;
}

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, tooltipText, tooltipImage }) => {
  const isExtraLargeDevice = useMediaQuery("(min-width: 1201px)");

  const handleTooltipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const ContentComponent = () => (
    <div className="flex flex-col items-center">
      <p className='text-semibold'>{tooltipText}</p>
      {tooltipImage && (
        <Image src={tooltipImage} height={500} width={500} alt="Tooltip" />
      )}
    </div>
  );

  return (
    <div className="flex items-center space-x-2">
      <span>{label}</span>
      {isExtraLargeDevice ? (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button onClick={handleTooltipClick} className="focus:outline-none">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs sm:max-w-md">
              <ContentComponent />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button className="focus:outline-none">
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ContentComponent />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LabelWithTooltip;