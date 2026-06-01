import { Service, MembershipPlan, Review } from './types';

export const SERVICES: Service[] = [
  {
    id: 'express',
    name: 'Lavado Express',
    description: 'Exterior completo con shampoo de alta espuma, enjuague de alta presión y secado a mano sin marcas. Ideal para mantenimiento rápido.',
    price: 8,
    icon: '🚿',
    colorClass: 'blue',
    duration: '25 min',
    category: 'auto',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'full',
    name: 'Lavado Full',
    description: 'Limpieza interior y exterior profunda. Incluye aspirado completo de alfombras y asientos, limpieza de tablero, marcos de puertas, vidrios y aromatizante premium.',
    price: 18,
    icon: '✨',
    colorClass: 'gold',
    duration: '50 min',
    category: 'auto',
    imageUrl: '/src/assets/images/aquawash_hero_1780287558702.png'
  },
  {
    id: 'brillo',
    name: 'Encerado y Brillo',
    description: 'Tratamiento de protección física utilizando cera de carnauba de larga duración. Logra un acabado espejo húmedo que protege la pintura hasta por 3 meses.',
    price: 25,
    icon: '🛡️',
    colorClass: 'green',
    duration: '1h 15 min',
    category: 'auto',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'desengrase',
    name: 'Desengrase Total',
    description: 'Desengrase minucioso del vano del motor, chasis trasero y guardabarros inferiores usando agentes biodegradables de grado profesional.',
    price: 30,
    icon: '🧴',
    colorClass: 'coral',
    duration: '1h 30 min',
    category: 'auto',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'detailing',
    name: 'Detailing Premium',
    description: 'Renovación de color y eliminación de microrrayas. Descontaminado de carrocería, acondicionamiento de plásticos e hidratación profunda de tapizados de cuero.',
    price: 65,
    icon: '💎',
    colorClass: 'purple',
    duration: '3h',
    category: 'all',
    imageUrl: '/src/assets/images/aquawash_detail_1780287578081.png'
  },
  {
    id: 'moto',
    name: 'Lavado de Moto',
    description: 'Servicio detallado para motocicletas de toda cilindrada. Limpieza a vapor de cadena, desengrase, abrillantado de cromo y secado con soplador de aire.',
    price: 6,
    icon: '🏍️',
    colorClass: 'pink',
    duration: '35 min',
    category: 'moto',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'
  }
];

export const PLANS: MembershipPlan[] = [
  {
    id: 'bronce',
    name: 'Bronce',
    icon: '🥉',
    price: 35,
    period: 'mes',
    benefits: [
      '4 lavados básicos mensuales',
      '5% de descuento en servicios premium',
      'Prioridad estándar en reservas'
    ],
    discountPercent: 5
  },
  {
    id: 'plata',
    name: 'Plata',
    icon: '🥈',
    price: 60,
    period: 'mes',
    benefits: [
      '6 lavados completos mensuales',
      '10% de descuento en encerados',
      'Prioridad media y reprogramación flexible'
    ],
    discountPercent: 10
  },
  {
    id: 'oro',
    name: 'Oro',
    icon: '🥇',
    price: 95,
    period: 'mes',
    benefits: [
      'Lavados semanales ilimitados',
      '15% de descuento en detalling',
      'Acceso para todo el grupo familiar',
      'Prioridad VIP inmediata en cola'
    ],
    discountPercent: 15
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Carlos M.',
    avatarClass: 'av1',
    stars: 5,
    text: 'La app es súper intuitiva. Reservo mi turno en 30 segundos y me llega la notificación al celular cuando mi camioneta está lista. Se acabaron las largas esperas.',
    vehicle: 'Toyota Hilux',
    membershipPlan: 'Miembro Plata',
    date: 'Hace 2 días'
  },
  {
    id: 'r2',
    author: 'Andrea P.',
    avatarClass: 'av2',
    stars: 5,
    text: 'Los puntos acumulados realmente valen la pena, ya he canjeado dos lavados gratis este mes. Me encanta ver mi nivel de fidelidad subir con cada reserva.',
    vehicle: 'Kia Sportage',
    membershipPlan: 'Miembro Oro',
    date: 'Hace 4 días'
  },
  {
    id: 'r3',
    author: 'Roberto L.',
    avatarClass: 'av3',
    stars: 5,
    text: 'El servicio de Detailing Premium es insuperable. Dejaron mi vehículo impecable y la atención en recepción es de primera. Muy transparente todo.',
    vehicle: 'Chevrolet Equinox',
    membershipPlan: 'Miembro Bronce',
    date: 'Hace 1 semana'
  },
  {
    id: 'r4',
    author: 'Marcela T.',
    avatarClass: 'av4',
    stars: 5,
    text: '¡Hermoso el detalle del cupón de cumpleaños automático! Sin que yo pidiera nada, me lo incluyeron y me ahorré un buen porcentaje en el lavado full.',
    vehicle: 'Hyundai Tucson',
    date: 'Hace 2 semanas'
  },
  {
    id: 'r5',
    author: 'Juan V.',
    avatarClass: 'av5',
    stars: 4,
    text: 'Un sistema genial para referir y ganar. Invité a mis compañeros de trabajo y los puntos se cargaron al instante de su primer lavado. Recomendado 100%.',
    vehicle: 'Mazda CX-5',
    membershipPlan: 'Miembro Plata',
    date: 'Hace 3 semanas'
  },
  {
    id: 'r6',
    author: 'Sofía R.',
    avatarClass: 'av6',
    stars: 5,
    text: 'Tener guardada la ficha de lavado de mi moto me da mucha seguridad. Saben exactamente qué cuidados requiere y el secado por soplador protege las piezas.',
    vehicle: 'Yamaha MT-07',
    date: 'Hace 1 mes'
  }
];
