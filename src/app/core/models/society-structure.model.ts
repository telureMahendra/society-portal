export interface Flat {
    id: number;
    flatNumber: string;
    floor: number;
    ownerName: string;
    residentType: 'OWNER' | 'TENANT' | 'VACANT';
    occupancyStatus: 'OCCUPIED' | 'VACANT';
    areaSqFt: number;
    wingId: number;
}

export interface Wing {
    id: number;
    name: string; // e.g., 'A', 'B', 'C'
    totalFloors: number;
    flatsPerFloor: number;
    totalFlats: number;
    flats?: Flat[];
}
