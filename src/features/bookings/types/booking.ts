export interface CreateBookingPayload {
  item_id: number;
  start_date: string;
  stop_date: string;
  start_time: string;
  stop_time: string;
  priority: string;
  description: string;
  roomName: string;
  meetingTitle: string;
  departmentCreator: string;
  departmentUser: string;
  participantsCount: number;
  tel: string;
  username: string;
}

export type Booking = CreateBookingPayload;
