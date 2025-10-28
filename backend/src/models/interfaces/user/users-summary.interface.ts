import { BaseSummary } from '@shared/models';

export type UsersSummary = BaseSummary<'works' | 'vacation' | 'sick' | 'dayOff' | 'total'>;
