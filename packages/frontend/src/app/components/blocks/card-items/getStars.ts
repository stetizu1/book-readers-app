import { getRatingFormItem } from 'app/components/blocks/card-items/items-form/rating/getRatingFormItem';

export const getStars = (stars: number | undefined | null): JSX.Element => (
  getRatingFormItem({ readOnly: true, value: stars, label: null })
);