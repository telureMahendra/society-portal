export interface ApiResponse<T> {
    status: string; // "00" for success, "01" for failure
    message: string;
    data: T;
}
