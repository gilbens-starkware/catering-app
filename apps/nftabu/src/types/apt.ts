export type Apt = {
    id: string;
    info: {
      address: { town: string, street: string, number: number };
      owner: string;
      area: number;
      floor: number;
    };
  };
  