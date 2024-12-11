export type Meal = {
  id: string;
  info: {
    time: { seconds: number };
    number_of_participants: number;
    registered?: boolean;
    canceled?: boolean;
    description?: string;
  };
};
