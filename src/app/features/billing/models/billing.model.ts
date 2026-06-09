export interface BillingConfiguration {
  id?: number;
  societyId?: number;
  configurationName: string;
  billingCycle: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  billingAmount: number;
  dueDayOfMonth: number;
  lateFeeApplicable: boolean;
  lateFeeType?: string;
  lateFeeValue?: number;
  applicability: string;
  targetWing?: string;
  targetUnitType?: string;
  targetFlatId?: number;
  active: boolean;
  createdAt?: string;
}

export interface BillingRecord {
  id: number;
  societyId: number;
  ownerId: number;
  unitId: number;
  invoiceNumber: string;
  billType: string;
  amount: number;
  penaltyAmount: number;
  totalAmount: number;
  billDate: string;
  dueDate: string;
  status: string;
  configurationId?: number;
  remarks?: string;
  systemGenerated: boolean;
  paidAmount: number;
  paymentDate?: string;
  createdAt?: string;
  ownerName?: string;
  flatDisplay?: string;
  societyRegNo?: string;
  paymentMode?: string;
  transactionRef?: string;
}

export interface AddonBill {
  id?: number;
  societyId?: number;
  ownerId: number;
  unitId?: number;
  title: string;
  category: string;
  description?: string;
  amount: number;
  dueDate: string;
  status: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  paid: boolean;
  createdAt?: string;
}
