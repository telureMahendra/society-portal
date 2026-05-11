export interface Notice {
    id: number;
    title: string;
    content: string;
    publishDate: string;
    expiryDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: 'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'SECURITY' | 'GOVERNMENT';
    author: string;
    attachmentUrl?: string;
    isPinned?: boolean;
}
