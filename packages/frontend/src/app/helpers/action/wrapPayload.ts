export type WithSuccessMessage = {
  successMessage: string;
};

interface SuccessMessage<T extends {}> extends WithSuccessMessage {
  data: T;
}

interface IdAndData<T extends {}> {
  id: string | number;
  data: T;
}

export const dataAndSuccessMessage = <T extends {}>() => (data: T, successMessage: string): SuccessMessage<T> => (
  { data, successMessage }
);

export const dataAndId = <T>() => (id: string | number, data: T): IdAndData<T> => (
  { data, id }
);
