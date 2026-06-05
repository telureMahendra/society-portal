export interface ApiResponse<T> {
    status: string; // "00" for success, "01" for failure
    message: string;
    data: T;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

