export interface SocietyEvent {
    id: number;
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    eventDate?: string;
    location: string;
    category: string;
    status: string;
    imageUrl?: string;
    organizer: string;
    maxAttendees?: number;
    currentAttendees?: number;
}

export interface StandardResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Page<T> {
    content: T[];
    pageable: any;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface EventListRequest {
    page: number;
    size: number;
    search?: string;
    category?: string;
    sortBy: string;
    sortDirection: string;
}
