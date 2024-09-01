export enum RoleType {
    USER = "USER",
    ADMIN = "ADMIN"
}

export type User = {
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  role: RoleType;
  email?: string | null;
  avatar?: string | null;
  isActive: boolean;
};
