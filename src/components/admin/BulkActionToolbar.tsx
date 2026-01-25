import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Trash2, ChevronDown, X, Download } from "lucide-react";

export interface BulkAction {
  label: string;
  value: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}

interface BulkActionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
  actions: BulkAction[];
  onExport?: () => void;
  isProcessing?: boolean;
}

export default function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onAction,
  actions,
  onExport,
  isProcessing = false,
}: BulkActionToolbarProps) {
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  const handleAction = (action: BulkAction) => {
    if (action.variant === "destructive") {
      setConfirmAction(action);
    } else {
      onAction(action.value);
    }
  };

  const confirmAndExecute = () => {
    if (confirmAction) {
      onAction(confirmAction.value);
      setConfirmAction(null);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 animate-in slide-in-from-top-2">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
            {selectedCount} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-7 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            <span className="hidden xs:inline">Clear</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isProcessing}
              className="h-8 text-xs sm:text-sm"
            >
              <Download className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={isProcessing} className="h-8 text-xs sm:text-sm">
                {isProcessing ? "..." : "Actions"}
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.value}
                  onClick={() => handleAction(action)}
                  className={
                    action.variant === "destructive" ? "text-destructive" : ""
                  }
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.label.toLowerCase()} {selectedCount}{" "}
              item{selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAndExecute}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {confirmAction?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Common bulk actions
export const BOOKING_BULK_ACTIONS: BulkAction[] = [
  { label: "Confirm Selected", value: "confirm" },
  { label: "Cancel Selected", value: "cancel" },
  {
    label: "Delete Selected",
    value: "delete",
    icon: <Trash2 className="w-4 h-4 mr-2" />,
    variant: "destructive",
  },
];

export const INQUIRY_BULK_ACTIONS: BulkAction[] = [
  { label: "Mark as Responded", value: "responded" },
  { label: "Mark as Closed", value: "closed" },
  {
    label: "Delete Selected",
    value: "delete",
    icon: <Trash2 className="w-4 h-4 mr-2" />,
    variant: "destructive",
  },
];

export const REVIEW_BULK_ACTIONS: BulkAction[] = [
  { label: "Approve Selected", value: "approved" },
  { label: "Reject Selected", value: "rejected" },
  {
    label: "Delete Selected",
    value: "delete",
    icon: <Trash2 className="w-4 h-4 mr-2" />,
    variant: "destructive",
  },
];
