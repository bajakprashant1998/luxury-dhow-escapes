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
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isProcessing}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Actions"}
                <ChevronDown className="w-4 h-4 ml-1" />
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.label.toLowerCase()} {selectedCount}{" "}
              item{selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
