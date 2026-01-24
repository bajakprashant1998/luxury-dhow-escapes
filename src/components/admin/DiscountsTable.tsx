import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Discount } from "@/hooks/useDiscounts";
import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface DiscountsTableProps {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, is_active: boolean) => void;
  isDeleting?: boolean;
}

export default function DiscountsTable({
  discounts,
  onEdit,
  onDelete,
  onToggleStatus,
  isDeleting = false,
}: DiscountsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const getStatusBadge = (discount: Discount) => {
    const now = new Date();
    const isExpired = discount.expires_at && new Date(discount.expires_at) < now;
    const isNotStarted = discount.starts_at && new Date(discount.starts_at) > now;
    const isMaxedOut =
      discount.max_uses !== null && discount.used_count >= discount.max_uses;

    if (!discount.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isNotStarted) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
          Scheduled
        </Badge>
      );
    }
    if (isMaxedOut) {
      return (
        <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20">
          Maxed Out
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
        Active
      </Badge>
    );
  };

  const formatValue = (discount: Discount) => {
    if (discount.type === "percentage") {
      return `${discount.value}%`;
    }
    return `AED ${discount.value.toFixed(2)}`;
  };

  const formatDateRange = (discount: Discount) => {
    const parts: string[] = [];
    if (discount.starts_at) {
      parts.push(`From ${format(new Date(discount.starts_at), "MMM d, yyyy")}`);
    }
    if (discount.expires_at) {
      parts.push(`Until ${format(new Date(discount.expires_at), "MMM d, yyyy")}`);
    }
    return parts.length > 0 ? parts.join(" • ") : "No date limit";
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No discounts found
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {discount.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyCode(discount.code)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">
                      {formatValue(discount)}
                    </span>
                    {discount.min_order_amount && (
                      <span className="text-xs text-muted-foreground block">
                        Min: AED {discount.min_order_amount}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{discount.used_count}</span>
                    {discount.max_uses && (
                      <span className="text-muted-foreground">
                        /{discount.max_uses}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateRange(discount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(discount)}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={discount.is_active}
                      onCheckedChange={(checked) =>
                        onToggleStatus(discount.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(discount)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(discount.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discount</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this discount code? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
