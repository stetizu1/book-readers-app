import {
  call, select, SelectEffect, CallEffect,
} from '@redux-saga/core/effects';

import { Call, CallResult } from 'app/types/CallResult';
import { AppState } from 'app/types/AppState';

type Selector<TRet> = (s: AppState) => TRet;

export function* selectTyped<T>(selector: Selector<T>): Generator<SelectEffect, T, T> {
  return yield select(selector);
}

export function* callTyped<TFn extends Call>(fn: TFn, ...args: Parameters<TFn>): Generator<CallEffect, CallResult<TFn>, CallResult<TFn>> {
  return yield call(fn, ...args);
}
