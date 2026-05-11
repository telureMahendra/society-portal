export interface SocietyEvent {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    category: 'CULTURAL' | 'SPORTS' | 'MEETING' | 'FESTIVAL' | 'CHARITY' | 'OTHER';
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    imageUrl?: string;
    organizer: string;
    maxAttendees?: number;
    currentAttendees?: number;
}
