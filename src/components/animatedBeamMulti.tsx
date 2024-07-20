import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animatedBeam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-full bg-white p-3 shadow-[0_0_20px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutput({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-2xl flex-row items-stretch justify-between">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="size-20">
            <Image src="/blogger.png" alt="Blogger" width={64} height={64} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-20">
            <Image src="/letter-f.png" alt="FindPro" width={80} height={80} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-8">
          <Circle ref={div1Ref} className="size-20">
            <Image src="/actor.png" alt="Actor" width={48} height={48} />
          </Circle>
          <Circle ref={div2Ref} className="size-20">
            <Image src="/composer.png" alt="Composer" width={48} height={48} />
          </Circle>
          <Circle ref={div3Ref} className="size-20">
            <Image src="/film-editing.png" alt="Film Editor" width={48} height={48} />
          </Circle>
          <Circle ref={div4Ref} className="size-20">
            <Image src="/graphic-designer.png" alt="Graphic Designer" width={48} height={48} />
          </Circle>
          <Circle ref={div5Ref} className="size-20">
            <Image src="/photographer.png" alt="Photographer" width={48} height={48} />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
}