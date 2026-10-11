export function formatRWF(amount: number): string {
  return amount.toLocaleString('en-US') + ' RWF';
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function isOverdue(lastActiveDate: string, balance: number): boolean {
  if (balance <= 0) return false;
  try {
    const lastDate = new Date(lastActiveDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  } catch {
    return false;
  }
}
