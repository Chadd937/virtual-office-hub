export type TaskStatus = 'awaiting_approval' | 'queued' | 'running' | 'verification' | 'completed' | 'failed' | 'cancelled' | 'blocked';
export function canTransition(from: string, to: TaskStatus) {
  const transitions: Record<TaskStatus, TaskStatus[]> = {
    awaiting_approval: ['queued', 'cancelled'], queued: ['running', 'cancelled'],
    running: ['verification', 'failed', 'blocked'], verification: ['completed', 'cancelled'],
    failed: ['queued', 'cancelled'], blocked: ['queued', 'cancelled'], completed: [], cancelled: [],
  };
  return Object.entries(transitions).some(([status, next]) => status === from && next.includes(to));
}
export function canRun(paused: boolean, blocked: string | null, approvedAt: string | null, status: string) {
  return !paused && !blocked && Boolean(approvedAt) && status === 'queued';
}