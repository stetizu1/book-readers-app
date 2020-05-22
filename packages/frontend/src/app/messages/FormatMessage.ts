import { Format } from 'book-app-shared/types/enums/Format';

export const FormatMessage = {
  [Format.hardcover]: 'Pevná vazba',
  [Format.paperback]: 'Brožovaná',
  [Format.audioBook]: 'Audio kniha',
  [Format.eBook]: 'E-kniha',
  [Format.other]: 'Jiný',
};
