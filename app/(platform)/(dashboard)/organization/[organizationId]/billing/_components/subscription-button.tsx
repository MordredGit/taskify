"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
}
export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => toast.error(error),
  });

  const { onOpen } = useProModal();
  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };
  return (
    <Button variant="primary" disabled={isLoading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
