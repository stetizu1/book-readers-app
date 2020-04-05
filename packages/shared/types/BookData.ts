import { Format } from './Format';

export interface BookData {
  readonly id: number;
  readonly bookId: number;
  readonly userId: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: string;
  readonly format?: Format;
  readonly genre?: string;
  readonly labels?: string[];
}

export interface BookDataCreate {
  readonly bookId: number;
  readonly userId: number;
  readonly publisher?: string;
  readonly yearPublished?: string;
  readonly isbn?: string;
  readonly image?: ImageData;
  readonly format?: string;
}
