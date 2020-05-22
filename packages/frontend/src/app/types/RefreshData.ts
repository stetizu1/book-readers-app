import { AllEffect, PutEffect } from '@redux-saga/core/effects';
import { AppActions } from 'app/types/AppActions';

export interface RefreshData {
  actions: string[];
  saga?: () => Generator<AllEffect<PutEffect<AppActions>>>;
}
