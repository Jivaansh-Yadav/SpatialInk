"use client";

import { useEffect } from "react";
import { ErrorFallbackPage } from "@/components/errors/error-fallback-page";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const isDevtoolsSimulatedError = error.message === "NEXT_DEVTOOLS_SIMULATED_ERROR";

  useEffect(() => {
    if (isDevtoolsSimulatedError) reset();
  }, [isDevtoolsSimulatedError, reset]);

  if (isDevtoolsSimulatedError) return null;

  return <ErrorFallbackPage error={error} reset={reset} />;
}
