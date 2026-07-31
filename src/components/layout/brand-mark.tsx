import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Deyvid Infotech"
        width={500}
        height={500}
        priority
        className={cn(
          "h-auto object-contain",
          compact ? "w-12" : "w-28 sm:w-32",
        )}
      />
    </div>
  );
}
