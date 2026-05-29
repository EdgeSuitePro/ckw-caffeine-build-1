import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Reservation {
    id: string;
    customerName: string;
    status: string;
    contactInfo: string;
    date: string;
    createdAt: bigint;
    notes: string;
    assignedStaff?: Principal;
    timeSlot: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactFormSubmission {
    id: string;
    subject: string;
    handled: boolean;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    category: string;
}
export interface DropOffRecord {
    customerName: string;
    verified: boolean;
    contactInfo: string;
    timestamp: bigint;
    quantity: bigint;
    photo?: ExternalBlob;
    reservationId: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ServicePricing {
    premium: bigint;
    volumeDiscounts: Array<[bigint, bigint]>;
    specialty: bigint;
    addOns: Array<[string, bigint]>;
    standard: bigint;
}
export interface PickupStatus {
    paymentStatus: string;
    timestamp: bigint;
    pickupConfirmed: boolean;
    reservationId: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDropOffRecord(record: DropOffRecord): Promise<void>;
    createReservation(reservation: Reservation): Promise<void>;
    getAllContactForms(): Promise<Array<ContactFormSubmission>>;
    getAllDropOffRecords(): Promise<Array<DropOffRecord>>;
    getAllPickupStatuses(): Promise<Array<PickupStatus>>;
    getAllReservations(): Promise<Array<Reservation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDropOffRecord(reservationId: string): Promise<DropOffRecord | null>;
    getPickupStatus(reservationId: string): Promise<PickupStatus | null>;
    getReservation(id: string): Promise<Reservation | null>;
    getServicePricing(): Promise<ServicePricing | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerStaff(): Promise<boolean>;
    markContactFormHandled(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(form: ContactFormSubmission): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updatePickupStatus(status: PickupStatus): Promise<void>;
    updateReservationStatus(id: string, status: string, notes: string): Promise<void>;
    updateServicePricing(pricing: ServicePricing): Promise<void>;
    verifyDropOff(reservationId: string, verified: boolean): Promise<void>;
}
