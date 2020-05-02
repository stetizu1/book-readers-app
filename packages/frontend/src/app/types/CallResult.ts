// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Call = (...args: any[]) => any;

type PromiseResult<T> = T extends Promise<infer U> ? U : T;

export type CallResult<T extends Call> = PromiseResult<ReturnType<T>>;
