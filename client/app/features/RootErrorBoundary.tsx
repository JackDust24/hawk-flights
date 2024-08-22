'use client';
import { PropsWithChildren, useCallback } from 'react';
import { ErrorBoundaryFallback } from './errorBoundariesFallback';
import { ErrorBoundary } from 'react-error-boundary';

export function RootErrorBoundary(props: PropsWithChildren) {
  const handleReloadClick = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <ErrorBoundary
      fallback={<ErrorBoundaryFallback onClick={handleReloadClick} />}
    >
      {props.children}
    </ErrorBoundary>
  );
}
