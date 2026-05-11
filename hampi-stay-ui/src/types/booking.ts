export interface Booking {
  id: string;
  resortId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  referenceNumber: string;
  createdAt: string;
  resort?: {
    name: string;
    locationArea: string;
    slug: string;
    images: string[];
    type?: string;
  };
  room?: {
    id: string;
    name: string;
  };
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  bookingId: string;
  createdAt: string;
}
