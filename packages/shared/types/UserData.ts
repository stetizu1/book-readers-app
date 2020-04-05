export interface UserData {
  readonly id: number;
  readonly email: string;
  readonly publicProfile: boolean;
  readonly password?: string;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}

export interface UserDataCreate {
  readonly email: string;
  readonly publicProfile: boolean;
  readonly password?: string;
  readonly name?: string;
  readonly description?: string;
  readonly image?: string;
}
