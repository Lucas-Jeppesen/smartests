import React from 'react';

interface SubmitResetButtonProps {
  isPending: boolean;
  isSubmitted: boolean;
  onReset: () => void;
  onSubmit: () => void;
  className: string;
}

export default function SubmitResetButton({
  isPending,
  isSubmitted,
  onReset,
  onSubmit,
  className,
}: SubmitResetButtonProps) {
  if (isSubmitted) {
    return (
      <button type="button" onClick={onReset} className={className}>
        Reset
      </button>
    );
  }
  return (
    <button type="submit" onClick={onSubmit} disabled={isPending} className={className}>
      {isPending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
