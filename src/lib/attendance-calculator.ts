export interface AttendanceMetrics {
  attended: number;
  total: number;
  percentage: number;
  target: number;
  status: 'safe' | 'warning' | 'danger';
  canMiss: number;
  mustAttend: number;
  headline: string;
}

/**
 * Calculates student attendance statistics and provides actionable bunk buffer or recovery targets.
 */
export function calculateAttendanceMetrics(
  attended: number,
  total: number,
  target: number = 75
): AttendanceMetrics {
  if (total <= 0) {
    return {
      attended: 0,
      total: 0,
      percentage: 100,
      target,
      status: 'safe',
      canMiss: 0,
      mustAttend: 0,
      headline: 'No classes held yet. You are at 100%.',
    };
  }

  const percentage = Math.round((attended / total) * 1000) / 10;
  const targetRatio = target / 100;

  if (percentage >= target) {
    // How many future classes can be missed before falling below target:
    // attended / (total + X) >= targetRatio => total + X <= attended / targetRatio => X <= attended / targetRatio - total
    const canMiss = Math.max(0, Math.floor(attended / targetRatio - total));
    return {
      attended,
      total,
      percentage,
      target,
      status: percentage >= target + 5 ? 'safe' : 'warning',
      canMiss,
      mustAttend: 0,
      headline:
        canMiss === 0
          ? 'On edge! You cannot afford to miss the next class.'
          : canMiss === 1
          ? 'You can miss 1 more class while maintaining your target.'
          : `You can safely miss ${canMiss} more classes.`,
    };
  } else {
    // How many consecutive classes must be attended to reach target:
    // (attended + Y) / (total + Y) >= targetRatio => Y * (1 - targetRatio) >= targetRatio * total - attended
    const mustAttend = Math.max(
      1,
      Math.ceil((targetRatio * total - attended) / (1 - targetRatio))
    );
    return {
      attended,
      total,
      percentage,
      target,
      status: 'danger',
      canMiss: 0,
      mustAttend,
      headline: `Attendance below target! You must attend the next ${mustAttend} class${
        mustAttend > 1 ? 'es' : ''
      } consecutively.`,
    };
  }
}

/**
 * Predicts attendance given planned future skips and attendances.
 */
export function predictAttendance(
  currentAttended: number,
  currentTotal: number,
  upcomingAttend: number,
  upcomingSkip: number,
  target: number = 75
): {
  projectedAttended: number;
  projectedTotal: number;
  projectedPercentage: number;
  meetsTarget: boolean;
  delta: number;
} {
  const projectedAttended = currentAttended + Math.max(0, upcomingAttend);
  const projectedTotal = currentTotal + Math.max(0, upcomingAttend) + Math.max(0, upcomingSkip);

  if (projectedTotal === 0) {
    return {
      projectedAttended: 0,
      projectedTotal: 0,
      projectedPercentage: 100,
      meetsTarget: true,
      delta: 0,
    };
  }

  const currentPct = currentTotal > 0 ? (currentAttended / currentTotal) * 100 : 100;
  const projectedPercentage = Math.round((projectedAttended / projectedTotal) * 1000) / 10;
  const delta = Math.round((projectedPercentage - currentPct) * 10) / 10;

  return {
    projectedAttended,
    projectedTotal,
    projectedPercentage,
    meetsTarget: projectedPercentage >= target,
    delta,
  };
}
