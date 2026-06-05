export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface StandardResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface Notice {
    id: number;
    title: string;
    content: string;
    category: string;
    priority: string;
    visibility: string;
    targetWing?: string;
    targetFlatNumber?: string;
    targetUserId?: number;
    isPublic?: boolean;
    isPinned?: boolean;
    publishDate?: string;
    createdAt: string;
    expiryDate?: string;
    active: boolean;
    deleted: boolean;
    createdBy?: number;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
    fileSize?: number;
}

export interface NoticeListRequest {
    societyId?: number;
    page: number;
    size: number;
    search?: string;
    category?: string;
    priority?: string;
    visibility?: string;
    sortBy?: string;
    sortDirection?: string;
}

export interface NoticeRequest {
    title: string;
    content: string;
    category: string;
    priority: string;
    visibility: string;
    isPublic?: boolean;
    isPinned?: boolean;
    targetWing?: string;
    targetFlatNumber?: string;
    targetUserId?: number;
    expiryDate?: string;
    active?: boolean;
    societyId?: number;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
    fileSize?: number;
}

export interface NoticeUpdateRequest extends NoticeRequest {
    noticeId: number;
}

