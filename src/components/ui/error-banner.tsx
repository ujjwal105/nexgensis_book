import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border-l-4 border-rose-500 bg-rose-50 px-5 py-4 text-rose-700 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-6">{message}</p>
      </div>
      {onRetry ? (
        <Button
          variant="ghost"
          className="rounded-2xl text-rose-700 hover:bg-rose-100 hover:text-rose-800"
          onClick={onRetry}
        >
          <RotateCcw className="size-4" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
