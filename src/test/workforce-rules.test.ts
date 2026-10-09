import { describe, it, expect } from 'vitest';
import { canTransition, canRun } from '../lib/workforce-rules';
describe('owner-controlled AI work', () => {
  it('cannot complete from running without verification', () => { expect(canTransition('running','completed')).toBe(false); expect(canTransition('running','verification')).toBe(true); });
  it('requires explicit approval before execution', () => { expect(canRun(false,null,null,'queued')).toBe(false); expect(canRun(false,null,'2026-10-09','queued')).toBe(true); });
  it('pause prevents new work', () => { expect(canRun(true,null,'2026-10-09','queued')).toBe(false); });
  it('provider blocks prevent execution', () => { expect(canRun(false,'Provider denied','2026-10-09','queued')).toBe(false); });
  it('cannot rerun completed work', () => { expect(canTransition('completed','running')).toBe(false); });
});