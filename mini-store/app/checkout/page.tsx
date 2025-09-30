"use client";
import { useCheckout } from "@/features/checkout/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { mutateAsync, isPending } = useCheckout();
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <p className="text-muted-foreground mb-6">Mock payment flow. Click pay to create a paid order.</p>
      <Button
        disabled={isPending}
        onClick={async () => {
          const res = await mutateAsync({});
          toast.success(`Order #${res.orderId} ${res.status}`);
        }}
      >
        {isPending ? "Processing..." : "Pay now"}
      </Button>
    </div>
  );
}

