import { Call } from 'app/types/CallResult';

export type CssClassType<T extends Call> = ReturnType<T>[keyof ReturnType<T>];
