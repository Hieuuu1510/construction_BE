export function buildDateFilter({ from, to }: { from: string; to: string }) {
  if (!from || !to) return {};

  const dateFilter = {
    $gte: new Date(from),
    $lte: new Date(to),
  };

  return dateFilter;
}
