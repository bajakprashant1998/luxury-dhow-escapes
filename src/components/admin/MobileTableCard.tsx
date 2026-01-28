import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileTableCardProps {
  id: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
  title: string;
  subtitle?: string;
  avatar?: ReactNode;
  badge?: ReactNode;
  details?: Array<{ label: string; value: ReactNode }>;
  actions?: Array<{
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  highlight?: boolean;
}

const MobileTableCard = ({
  id,
  selected,
  onSelect,
  title,
  subtitle,
  avatar,
  badge,
  details,
  actions,
  primaryAction,
  className,
  highlight,
}: MobileTableCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-4 space-y-3 transition-all",
        highlight && "ring-2 ring-secondary/20 bg-secondary/5",
        selected && "ring-2 ring-primary",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {onSelect && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(id)}
            className="mt-1"
          />
        )}

        {avatar && (
          <div className="shrink-0">{avatar}</div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-foreground truncate">
              {title}
            </h4>
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Details Grid */}
      {details && details.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          {details.map((detail, index) => (
            <div key={index} className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {detail.label}
              </p>
              <div className="text-sm font-medium text-foreground truncate">
                {detail.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {(primaryAction || (actions && actions.length > 0)) && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {primaryAction && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 h-9"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}

          {actions && actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={action.onClick}
                    className={cn(
                      action.variant === "destructive" && "text-destructive"
                    )}
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileTableCard;
