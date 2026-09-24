export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: "รอดำเนินการ",
  [BOOKING_STATUS.CONFIRMED]: "ยืนยันแล้ว",
  [BOOKING_STATUS.CANCELLED]: "ยกเลิก",
  [BOOKING_STATUS.COMPLETED]: "เสร็จสิ้น",
};
