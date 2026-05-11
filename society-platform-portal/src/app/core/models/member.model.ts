export type MemberRole = 'SOCIETY_ADMIN' | 'UNIT_ADMIN' | 'RESIDENT' | 'STAFF' | 'SECURITY';
export type MemberType = 'OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'VENDOR' | 'STAFF';
export type MemberStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';

export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    type: MemberType;
    role: MemberRole;
    status: MemberStatus;
    joinedDate: string;
    profileImageUrl?: string;
    unitMapping?: {
        wing: string;
        flatNumber: string;
    }[];
    staffCategory?: string; // Only for STAFF type
}
