import { RoleType, User } from "@/types/user";
export function getUser(): Promise<User> {
    return Promise.resolve({ id: 1,
        firstName: "John",
        lastName: "Doe",
        username: "john",
        role: RoleType.USER,
        email: "john@email.com",
        isActive: true
    });
}

export async function login(
  username: string,
  password: string
): Promise<{
  success: boolean;
  user?: User;
  authToken?: string;
  message?: string;
}> {
  if (username === "user" && password === "pass") {
    const user = await getUser();
    return Promise.resolve({ success: true, user, authToken: "1234" });
  }
  return Promise.resolve({ success: false, message: "Invalid credentials" });
}

export function logout(): Promise<{ success: boolean; message: string }> {
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
}