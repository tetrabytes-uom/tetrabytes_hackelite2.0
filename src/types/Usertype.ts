export interface UserType {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: "User" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}
