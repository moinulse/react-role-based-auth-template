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

export function login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    if (username === 'user' && password === 'pass') {
        return getUser().then(user => ({ success: true, user }));
    }
    return Promise.resolve({ success: false, message: 'Invalid credentials' });
}

export function logout(): Promise<{ success: boolean; message: string }> {
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
}