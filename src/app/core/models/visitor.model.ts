export type VisitorPurpose = 'DELIVERY' | 'GUEST' | 'SERVICE' | 'REPAIR' | 'OTHER';
export type VisitorStatus = 'CHECKED_IN' | 'CHECKED_OUT' | 'DENIED' | 'OVERSTAYED';

export interface Visitor {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    purpose: VisitorPurpose;
    status: VisitorStatus;
    checkInTime: string;
    checkOutTime?: string;
    unitMapping: {
        wing: string;
        flatNumber: string;
    };
    vehicleNumber?: string;
    notes?: string;
}
