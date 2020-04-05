export interface Label {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export interface LabelCreate {
  readonly name: string;
  readonly description: string;
}
