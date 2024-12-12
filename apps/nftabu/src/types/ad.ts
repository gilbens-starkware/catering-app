import { Apt } from './apt';

export type Ad = {
  id: string;
  info: {
    apt: Apt;
    is_sale: boolean;
    price: number;
    description?: string;
    publication_date: { second: number };
    entry_date: { second: number };
    phone: string;
    picture_url: string;
  };
};
