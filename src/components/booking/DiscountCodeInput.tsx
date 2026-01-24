import { useState } from "react";
import { Tag, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useValidateDiscount, Discount } from "@/hooks/useDiscounts";

interface DiscountCodeInputProps {
  orderAmount: number;
  tourId?: string;
  onDiscountApplied: (discount: Discount | null) => void;
  appliedDiscount: Discount | null;
}

const DiscountCodeInput = ({
  orderAmount,
  tourId,
  onDiscountApplied,
  appliedDiscount,
}: DiscountCodeInputProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const validateDiscount = useValidateDiscount();

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Please enter a discount code");
      return;
    }

    setError(null);
    try {
      const discount = await validateDiscount.mutateAsync({
        code: code.trim(),
        orderAmount,
        tourId,
      });

      if (discount) {
        onDiscountApplied(discount);
        setCode("");
      } else {
        setError("Invalid discount code");
      }
    } catch (err: any) {
      setError(err.message || "Invalid discount code");
    }
  };

  const handleRemove = () => {
    onDiscountApplied(null);
    setCode("");
    setError(null);
  };

  const calculateDiscount = (discount: Discount, amount: number) => {
    if (discount.type === "percentage") {
      return (amount * discount.value) / 100;
    }
    return Math.min(discount.value, amount);
  };

  if (appliedDiscount) {
    const discountAmount = calculateDiscount(appliedDiscount, orderAmount);
    return (
      <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <div>
              <p className="font-medium text-sm text-secondary">
                {appliedDiscount.code}
              </p>
              <p className="text-xs text-muted-foreground">
                {appliedDiscount.type === "percentage"
                  ? `${appliedDiscount.value}% off`
                  : `AED ${appliedDiscount.value} off`}
                {" • "}Saving AED {discountAmount.toFixed(0)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">
        Discount Code
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            className="pl-10 h-11"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={validateDiscount.isPending || !code.trim()}
          className="h-11 px-4"
        >
          {validateDiscount.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default DiscountCodeInput;
