enum StatusType {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failure = 'Failure',
}

interface WithStatus {
  type: StatusType;
}

interface Idle extends WithStatus {
  type: StatusType.Idle;
}

interface Loading extends WithStatus {
  type: StatusType.Loading;
}

interface Success<TData> extends WithStatus {
  type: StatusType.Success;
  data: TData;
}

interface Failure extends WithStatus {
  type: StatusType.Failure;
}

export type Status<TData> = Idle | Loading | Success<TData> | Failure;

export type PlainStatus = Status<unknown>;

export const createStatus = {
  idle: (): Idle => ({
    type: StatusType.Idle,
  }),

  loading: (): Loading => ({
    type: StatusType.Loading,
  }),

  success: <TData>(data: TData): Success<TData> => ({
    type: StatusType.Success,
    data,
  }),

  failure: (): Failure => ({
    type: StatusType.Failure,
  }),
};

export const isStatus = {
  idle: <TData>(status: Status<TData>): status is Idle => status.type === StatusType.Idle,

  loading: <TData>(status: Status<TData>): status is Loading => status.type === StatusType.Loading,

  success: <TData>(status: Status<TData>): status is Success<TData> => status.type === StatusType.Success,

  failure: <TData>(status: Status<TData>): status is Failure => status.type === StatusType.Failure,
};

export const getData = <TData>(status: Status<TData>): TData | undefined => (
  isStatus.success(status) ? status.data : undefined
);
