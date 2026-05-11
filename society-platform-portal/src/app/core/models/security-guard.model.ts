export interface SecurityGuard {
    membershipId: number;
    name: string;
    mobile: string;
    active: boolean;
}

export interface AddGuardRequest {
    societyId: number;
    name: string;
    mobile: string;
}
