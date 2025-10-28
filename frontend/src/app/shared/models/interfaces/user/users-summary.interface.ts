import { BaseSummary } from 'src/app/shared/models';

export type UsersSummary = BaseSummary<'works' | 'vacation' | 'sick' | 'dayOff' | 'total'>;
