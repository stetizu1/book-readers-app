export type WithSuccessMessage = {
  successMessage: string;
};

interface WithIdAndData<T extends {}> {
  id: string | number;
  data: T;
}

export const withSuccessMessage = <T extends {}>() => (data: T, successMessage: string): T & WithSuccessMessage => (
  { ...data, successMessage }
);

export const withIdAndData = <T>() => (id: string | number, data: T): WithIdAndData<T> => (
  { id, data }
);
