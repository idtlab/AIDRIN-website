import { test, expect } from 'vitest';
import { dimensions } from '../../src/data/dimensions';
import { accessModes } from '../../src/data/access-modes';
import { formats } from '../../src/data/formats';
import { workflowSteps } from '../../src/data/workflow';
import { site } from '../../src/data/site';

test('six dimensions', () => expect(dimensions).toHaveLength(6));
test('six access modes', () => expect(accessModes).toHaveLength(6));
test('three workflow steps', () => expect(workflowSteps.map(w => w.step)).toEqual(['Inspect','Remediate','Transform']));
test('formats include Parquet and exclude ROOT', () => {
  expect(formats).toHaveLength(6);
  const names = formats.map(f => f.name).join();
  expect(names).toMatch(/Parquet/);
  expect(names).not.toMatch(/ROOT/i);
});
test('external links present', () => { for (const k of ['inspector','docs','github'] as const) expect(site[k as keyof typeof site]).toMatch(/^https:\/\//); });
