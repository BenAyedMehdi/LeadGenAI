export interface FreshnessInfo {
  level: 'green' | 'amber' | 'red';
  text: string;
  monthsDiff: number;
}

const DEMO_REFERENCE_DATE = new Date(2026, 9, 1); // 2026-10-01 (Month index 9 is October)

export function calculateFreshness(dateString: string): FreshnessInfo {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return { level: 'amber', text: dateString, monthsDiff: 4 };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const targetDate = new Date(year, month, day);

  // Exact difference in days
  const diffTime = DEMO_REFERENCE_DATE.getTime() - targetDate.getTime();
  const diffDays = Math.max(0, diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30.4375; // average month length
  const roundedMonths = Math.max(1, Math.round(diffMonths));

  if (diffMonths <= 3.0) {
    return {
      level: 'green',
      text: roundedMonths <= 1 ? 'Fresh (<1 mo)' : `Fresh (${roundedMonths} mo)`,
      monthsDiff: roundedMonths
    };
  } else if (diffMonths <= 6.0) {
    return {
      level: 'amber',
      text: `${roundedMonths} months old`,
      monthsDiff: roundedMonths
    };
  } else {
    return {
      level: 'red',
      text: `Outdated (${roundedMonths} months)`,
      monthsDiff: roundedMonths
    };
  }
}
