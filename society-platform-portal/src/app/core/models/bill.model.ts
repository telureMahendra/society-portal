export interface Bill {
    id: number;
    invoiceId: string;
    residentName: string;
    unitNumber: string;
    amount: number;
    dueDate: string;
    billingDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
    description?: string;
    penalty?: number;
}
