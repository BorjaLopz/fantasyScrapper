export type User = {
  id: string;
  username: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string | null;
    avatarUrl: string | null;
  } | null;
  role: {
    name: string;
    id: number;
  };
};
