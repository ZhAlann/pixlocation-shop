export type UserRole = "user" | "admin";

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    role: UserRole;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
}

export interface UserProfileInput {
    email?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
}