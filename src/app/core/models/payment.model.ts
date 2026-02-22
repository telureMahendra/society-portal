export interface Payment {
    id: number;
    transactionId: string;
    invoiceId: string;
    residentName: string;
    unitNumber: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH' | 'CHEQUE';
    status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
    receiptUrl?: string;
}
