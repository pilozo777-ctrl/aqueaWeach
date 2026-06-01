export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  colorClass: string;
  duration: string;
  category: 'auto' | 'moto' | 'all';
  imageUrl?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  plate: string;
  vehicleType: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  status: 'En Espera' | 'Lavando' | 'Listo' | 'Entregado';
  pointsEarned: number;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  avatarClass: string;
  stars: number;
  text: string;
  vehicle: string;
  membershipPlan?: string;
  date: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  icon: string;
  price: number;
  period: string;
  benefits: string[];
  discountPercent: number;
}
