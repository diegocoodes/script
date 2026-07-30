import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const config =
    statusConfig[status as keyof typeof statusConfig] ??
    statusConfig.RECEIVED;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-semibold shadow-none",
        config.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {!compact && config.label}
    </Badge>
  );
}
