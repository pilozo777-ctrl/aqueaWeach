import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Gem,
  Bike,
  Check,
  Phone,
  Plus,
  Award,
  RefreshCw,
  Star,
  Users,
  Calendar,
  Clock,
  Car,
  Droplets,
  MapPin,
  X,
  ChevronRight,
  User,
  Hash,
  Info,
  Smartphone,
  Gift,
  CheckCircle2,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { SERVICES, PLANS, REVIEWS } from './data';
import { Service, Booking, Review, MembershipPlan } from './types';

export default function App() {
  // Navigation states
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isWhatsappWidgetOpen, setIsWhatsappWidgetOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  // Interactive booking states
  const [userPoints, setUserPoints] = useState(340);
  const [activeMembership, setActiveMembership] = useState<string>('plata'); // Default selected tier
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'AQ-9273',
      customerName: 'Carlos Mendoza',
      phone: '+593 098 901 2515',
      plate: 'PDH-8321',
      vehicleType: 'Camioneta',
      serviceName: 'Lavado Full',
      servicePrice: 18,
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      status: 'En Espera',
      pointsEarned: 18,
      createdAt: new Date().toISOString()
    }
  ]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customerName, setCustomerName] = useState('Pilozo');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('Auto');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('09:00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBookingId, setLastBookingId] = useState('');

  // Review Form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewStars, setNewReviewStars] = useState(5);
  const [newReviewVehicle, setNewReviewVehicle] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Referral State
  const [referFriendPhone, setReferFriendPhone] = useState('');
  const [referSuccess, setReferSuccess] = useState(false);

  // Monitor scroll for navbar change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set selected plan or trigger modal
  const handleSelectPlan = (planId: string) => {
    setActiveMembership(planId);
  };

  // Preselect service and open booking modal
  const handleOpenBooking = (service: Service | null = null) => {
    setSelectedService(service || SERVICES[1]); // Default to Lavado Full
    setIsModalOpen(true);
    setShowSuccess(false);
  };

  // Close modal and reset fields
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowSuccess(false);
  };

  // Generate WhatsApp dynamic booking URL
  const getWhatsAppBookingUrl = (booking: Booking | null) => {
    if (!booking) return 'https://api.whatsapp.com/send?phone=5930989012515';
    
    const text = `¡Hola AquaWash! 👋 Acabo de agendar un turno desde la web. Aquí están mis detalles:

📝 *Ticket:* ${booking.id}
👤 *Cliente:* ${booking.customerName}
📞 *Teléfono/WhatsApp:* ${booking.phone}
🚘 *Vehículo:* ${booking.vehicleType}
🔢 *Placa:* ${booking.plate}
✨ *Servicio:* ${booking.serviceName}
💵 *Valor:* $${booking.servicePrice}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.time} HS

Por favor confirmen mi reserva. ¡Muchas gracias!`;

    return `https://api.whatsapp.com/send?phone=5930989012515&text=${encodeURIComponent(text)}`;
  };

  // Process Booking submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !vehiclePlate || !selectedService) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const plan = PLANS.find(p => p.id === activeMembership);
    const discountFactor = plan ? (100 - plan.discountPercent) / 100 : 1;
    const finalPrice = Math.round(selectedService.price * discountFactor * 100) / 100;
    const pointsEarned = Math.floor(finalPrice);

    const bookingId = `AQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      customerName,
      phone: customerPhone,
      plate: vehiclePlate.toUpperCase(),
      vehicleType,
      serviceName: selectedService.name,
      servicePrice: finalPrice,
      date: bookingDate,
      time: bookingTime,
      status: 'En Espera',
      pointsEarned,
      createdAt: new Date().toISOString()
    };

    setBookings([newBooking, ...bookings]);
    setUserPoints(prev => prev + pointsEarned);
    setLastBookingId(bookingId);
    setShowSuccess(true);

    // Reset phone and plate
    setCustomerPhone('');
    setVehiclePlate('');

    // Open WhatsApp directly with the booking details
    try {
      const waUrl = getWhatsAppBookingUrl(newBooking);
      window.open(waUrl, '_blank');
    } catch (e) {
      console.error("Popup blocked or failed to redirect:", e);
    }
  };

  // Progress status of a booking (Simulation purpose)
  const handleProgressStatus = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          let nextStatus: Booking['status'] = b.status;
          if (b.status === 'En Espera') nextStatus = 'Lavando';
          else if (b.status === 'Lavando') nextStatus = 'Listo';
          else if (b.status === 'Listo') nextStatus = 'Entregado';
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  // Delete/Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // Submit beautiful custom Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText || !newReviewVehicle) {
      alert('Por favor complete los campos obligatorios para su opinión.');
      return;
    }

    setIsSubmittingReview(true);

    setTimeout(() => {
      const planName = activeMembership ? `Plan ${activeMembership.charAt(0).toUpperCase() + activeMembership.slice(1)}` : undefined;
      const avatarClasses = ['av1', 'av2', 'av3', 'av4', 'av5', 'av6'];
      const randomAvatar = avatarClasses[Math.floor(Math.random() * avatarClasses.length)];

      const freshReview: Review = {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor,
        avatarClass: randomAvatar,
        stars: newReviewStars,
        text: newReviewText,
        vehicle: newReviewVehicle,
        membershipPlan: planName,
        date: 'Reciente'
      };

      setReviews([freshReview, ...reviews]);
      setIsSubmittingReview(false);
      setReviewSuccessMsg('¡Muchas gracias! Tu opinión ha sido publicada exitosamente.');
      setNewReviewAuthor('');
      setNewReviewText('');
      setNewReviewVehicle('');

      setTimeout(() => {
        setReviewSuccessMsg('');
      }, 5000);
    }, 1000);
  };

  // Referral submission
  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referFriendPhone) return;
    setReferSuccess(true);
    setUserPoints(prev => prev + 20); // Get 20 loyalty points instantly for referral
    setTimeout(() => {
      setReferSuccess(false);
      setReferFriendPhone('');
    }, 5000);
  };

  // Get active booking details for the decorative phone mockup
  const primaryBooking = bookings[0];

  return (
    <div className="relative min-h-screen bg-bg-dark text-[#E8EDF2] font-sans selection:bg-accent-cyan selection:text-bg-dark bg-noise overflow-x-hidden">
      
      {/* ── BACKGROUND GLOW DECORATIONS ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-radial from-accent-cyan/10 to-transparent pointer-events-none blur-3xl z-0" />
      <div className="absolute top-[40%] left-[-200px] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-radial from-accent-blue/5 to-transparent pointer-events-none blur-3xl z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-radial from-accent-gold/5 to-transparent pointer-events-none blur-3xl z-0" />

      {/* ── NAVBAR ── */}
      <nav 
        id="app-navbar"
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-dark/90 backdrop-blur-md border-[rgba(255,255,255,0.08)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <a id="nav-logo-link" href="#" className="flex items-center gap-3 text-lg md:text-xl font-syne font-extrabold tracking-tight hover:opacity-90 transition-opacity">
          <div id="nav-logo-icon" className="w-9 h-9 bg-accent-cyan rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.3)]">
            <Droplets id="nav-logo-svg" className="w-5 h-5 text-bg-dark" fill="currentColor" />
          </div>
          <span id="nav-logo-text">AquaWash</span>
        </a>

        <ul id="nav-desktop-links" className="hidden md:flex items-center gap-8 list-none">
          <li>
            <a 
              id="link-nav-como"
              href="#como-funciona" 
              className="text-xs font-semibold tracking-wider uppercase text-[#8A9BAD] hover:text-[#E8EDF2] transition-colors"
            >
              Cómo funciona
            </a>
          </li>
          <li>
            <a 
              id="link-nav-servicios"
              href="#servicios" 
              className="text-xs font-semibold tracking-wider uppercase text-[#8A9BAD] hover:text-[#E8EDF2] transition-colors"
            >
              Servicios
            </a>
          </li>
          <li>
            <a 
              id="link-nav-membresias"
              href="#fidelizacion" 
              className="text-xs font-semibold tracking-wider uppercase text-[#8A9BAD] hover:text-[#E8EDF2] transition-colors"
            >
              Membresías
            </a>
          </li>
          <li>
            <a 
              id="link-nav-opiniones"
              href="#opiniones" 
              className="text-xs font-semibold tracking-wider uppercase text-[#8A9BAD] hover:text-[#E8EDF2] transition-colors"
            >
              Opiniones
            </a>
          </li>
        </ul>

        <div id="nav-actions-container" className="flex items-center gap-3">
          <div id="live-points-pill" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold/10 border border-accent-gold/20 rounded-full text-accent-gold text-xs font-bold font-syne">
            <Star className="w-3.5 h-3.5 fill-accent-gold" />
            <span>{userPoints} PTS</span>
          </div>
          <button 
            id="nav-cta-btn"
            onClick={() => handleOpenBooking(null)}
            className="px-4 py-2 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark text-xs md:text-sm font-semibold rounded-lg font-syne shadow-[0_4px_14px_rgba(0,212,255,0.25)] transition-all transform active:scale-95 cursor-pointer"
          >
            Reservar ahora
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 md:px-12 z-10 overflow-hidden">
        <div id="hero-layout-grid" className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div id="hero-text-content" className="lg:col-span-7 flex flex-col items-start text-left">
            <div 
              id="hero-badge-tag" 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-medium text-accent-cyan font-syne mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span>Quito, EC · Sistema de Fidelización Activo</span>
            </div>
            
            <h1 id="hero-main-title" className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-none tracking-tight text-white mb-6">
              Tu vehículo <br />
              merece lo <br />
              <span className="text-accent-cyan italic shadow-accent-cyan-glow">mejor.</span>
            </h1>

            <p id="hero-subdescription" className="text-sm sm:text-base md:text-lg text-[#8A9BAD] font-light max-w-lg leading-relaxed mb-8">
              Reserva tu cita en segundos, acumula puntos de fidelización de vuelta con cada visita y disfruta de descuentos premium directamente desde tu smartphone.
            </p>

            <div id="hero-buttons-container" className="flex flex-wrap items-center gap-4 mb-12">
              <button
                id="hero-primary-booking-btn"
                onClick={() => handleOpenBooking(null)}
                className="px-6 py-3.5 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark font-syne font-bold text-sm sm:text-base rounded-xl flex items-center gap-2 shadow-[0_5px_15px_rgba(0,212,255,0.3)] transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Reservar Turno</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a 
                id="hero-secondary-services-link"
                href="#servicios"
                className="px-6 py-3.5 border border-[rgba(255,255,255,0.12)] hover:border-accent-cyan hover:text-accent-cyan bg-transparent text-[#8A9BAD] font-syne font-semibold text-sm sm:text-base rounded-xl transition-all cursor-pointer"
              >
                Ver servicios
              </a>
            </div>

            {/* Live Stats */}
            <div id="hero-stats-panel" className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-[rgba(255,255,255,0.06)] pt-8 w-full max-w-xl">
              <div id="stat-[2k+]" className="flex flex-col">
                <span className="font-syne font-bold text-2xl sm:text-3xl text-white">2.4k<span className="text-accent-cyan">+</span></span>
                <span className="text-xs text-[#4D6070] mt-1">Autos Limpios</span>
              </div>
              <div id="stat-[98%]" className="flex flex-col">
                <span className="font-syne font-bold text-2xl sm:text-3xl text-white">98%</span>
                <span className="text-xs text-[#4D6070] mt-1">Satisfacción</span>
              </div>
              <div id="stat-[4.9]" className="flex flex-col">
                <span className="font-syne font-bold text-2xl sm:text-3xl text-white">4.9<span className="text-accent-cyan">★</span></span>
                <span className="text-xs text-[#4D6070] mt-1">Calificación</span>
              </div>
            </div>
          </div>

          {/* Interactive Phone Mockup column */}
          <div id="hero-phone-column" className="lg:col-span-5 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
            <div id="phone-visual-container" className="relative">
              
              {/* Dynamic Notification badge 1 */}
              <motion.div 
                id="floating-badge-booking-confirmed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-6 md:-left-12 top-6 bg-surface-dark border border-[rgba(255,255,255,0.1)] rounded-2xl p-3 md:p-4 flex items-center gap-3.5 shadow-[0_20px_45px_rgba(0,0,0,0.6)] z-20 max-w-[240px] md:max-w-[280px]"
              >
                <div id="badge-icon-confirmed" className="w-9 h-9 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div id="badge-text-confirmed" className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-white leading-tight">Turno Confirmado</span>
                  <span className="block text-[10px] text-[#8A9BAD] truncate">
                    {primaryBooking ? `${primaryBooking.serviceName} · ${primaryBooking.time}` : 'Lavado Full · Hoy 14:30'}
                  </span>
                </div>
              </motion.div>

              {/* Central Phone mock frame */}
              <div id="phone-frame-device" className="w-[280px] md:w-[310px] bg-surface-dark border-2 border-[rgba(255,255,255,0.12)] rounded-[40px] p-3.5 shadow-[0_45px_100px_rgba(0,0,0,0.8),_0_0_80px_rgba(0,212,255,0.06)] relative z-10 select-none">
                <div id="phone-camera-notch" className="w-24 h-6 bg-bg-dark rounded-full mx-auto mb-3" />
                
                {/* Phone screen inner content */}
                <div id="phone-screen-inner" className="bg-bg-dark-2 rounded-[28px] overflow-hidden border border-[rgba(255,255,255,0.05)] flex flex-col">
                  
                  {/* Phone App header */}
                  <div id="phone-app-head" className="bg-surface-dark px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                    <div id="phone-[carlos-m]" className="text-left">
                      <span className="block text-xs font-semibold text-white truncate max-w-[120px]">
                        ¡Hola, {primaryBooking ? primaryBooking.customerName.split(' ')[0] : 'Carlos'}!
                      </span>
                      <span className="block text-[9px] text-[#4D6070] font-medium leading-none mt-0.5">Nivel Plata</span>
                    </div>
                    <div id="phone-points-badge" className="px-2.5 py-1 bg-accent-gold/10 border border-accent-gold/20 rounded-full text-[9px] font-bold text-accent-gold font-syne flex items-center gap-1">
                      <span>⭐ {userPoints} PTS</span>
                    </div>
                  </div>

                  {/* Phone Screen body */}
                  <div id="phone-screen-body" className="p-3 flex-1 flex flex-col gap-3">
                    
                    {/* VIP Coupon Promo inside phone mockup */}
                    <div id="phone-promo-[bday]" className="bg-gradient-to-br from-[#0D2B38] to-[#0A1F2A] border border-accent-cyan/15 rounded-xl p-3 text-left">
                      <div id="promo-meta-[coupon]" className="text-[8px] font-bold text-accent-cyan tracking-wider font-syne mb-1 uppercase">RECOMPENSA DE REGISTRO</div>
                      <div id="promo-title-[bday]" className="text-[11px] font-bold text-white tracking-tight leading-tight mb-0.5">50 Puntos de Bienvenida</div>
                      <p id="promo-[bday]-sub" className="text-[9px] text-[#8A9BAD] leading-normal font-light">Canjéalos por descuentos en tu lavado express o full.</p>
                      
                      <div id="promo-btn-mock" className="mt-2 text-[9px] font-bold bg-accent-cyan text-bg-dark transition-all px-2 py-1 rounded inline-block">
                        ¡Canje activo!
                      </div>
                    </div>

                    {/* Real-time Cinematic Studio Preview inside Phone Mockup */}
                    <div id="phone-camera-preview-box" className="rounded-xl overflow-hidden relative h-16 border border-[rgba(255,255,255,0.08)] select-none">
                      <img 
                        src="/src/assets/images/aquawash_hero_1780287558702.png" 
                        alt="AquaWash Camara Real-time" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 bg-black/65 px-2 py-0.5 rounded text-[8px] text-accent-green font-bold font-mono tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                        ESTUDIO EN VIVO
                      </div>
                    </div>

                    <div id="phone-[top-services-title]" className="text-[9px] font-bold text-[#8A9BAD] uppercase tracking-widest text-left">Nuestros Servicios</div>

                    {/* Small services list inside mockup screen */}
                    <div id="phone-services-mini" className="flex flex-col gap-1.5">
                      <div id="mini-[express]" className="bg-surface-dark-2 border border-[rgba(255,255,255,0.04)] rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-accent-cyan/15 w-6 h-6 rounded flex items-center justify-center">🚿</span>
                          <div className="text-left">
                            <span className="block text-[10px] font-bold text-white leading-tight">Express</span>
                            <span className="block text-[8px] text-[#4D6070] leading-none mt-0.5">25 min · Exterior</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-accent-cyan font-syne">$8</span>
                      </div>

                      <div id="mini-[full]" className="bg-surface-dark-2 border border-accent-gold/20 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-accent-gold/15 w-6 h-6 rounded flex items-center justify-center">✨</span>
                          <div className="text-left">
                            <span className="block text-[10px] font-bold text-white leading-tight">Lavado Full</span>
                            <span className="block text-[8px] text-accent-gold leading-none mt-0.5">50 min · Completo</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-accent-gold font-syne">$18</span>
                      </div>

                      <div id="mini-[detailing]" className="bg-surface-dark-2 border border-[rgba(255,255,255,0.04)] rounded-lg p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-accent-green/15 w-6 h-6 rounded flex items-center justify-center">💎</span>
                          <div className="text-left">
                            <span className="block text-[10px] font-bold text-white leading-tight">Detailing</span>
                            <span className="block text-[8px] text-[#4D6070] leading-none mt-0.5">3h · Profesional</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#22D87A] font-syne">$65</span>
                      </div>
                    </div>

                    {/* Progress feedback block */}
                    {bookings.length > 0 && (
                      <div id="phone-my-bookings-mini" className="mt-1 p-2.5 bg-[#14231E]/30 border border-accent-green/20 rounded-xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold text-accent-green uppercase tracking-wide">Estado de tu Turno</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent-green/10 text-accent-green font-bold uppercase">{bookings[0].status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping" />
                          <span className="text-[10px] block font-semibold text-white">{bookings[0].serviceName}</span>
                        </div>
                        <span className="text-[8px] text-[#8A9BAD] mt-0.5 block">Matrícula: {bookings[0].plate} · {bookings[0].time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Notification badge 2 */}
              <motion.div 
                id="floating-badge-car-ready"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-6 md:-right-12 bottom-6 bg-surface-dark border border-[rgba(255,255,255,0.1)] rounded-2xl p-3 md:p-4 flex items-center gap-3 shadow-[0_25px_50px_rgba(0,0,0,0.6)] z-20 max-w-[230px] md:max-w-[260px]"
              >
                <div id="badge-icon-ready" className="w-9 h-9 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <Car className="w-5 h-5" />
                </div>
                <div id="badge-text-ready" className="flex-1 min-w-0 text-left">
                  <span className="block text-xs font-bold text-white leading-tight">¡Tu Auto está Listo!</span>
                  <span className="block text-[10px] text-[#8A9BAD] leading-tight">Retíralo en recepción</span>
                </div>
              </motion.div>

              {/* Glowing cyan bottom blur circle behind device */}
              <div id="glowing-circle-phone" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-accent-cyan/25 rounded-full blur-[80px] -z-10 animate-pulse" />
            </div>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN: CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="py-24 bg-bg-dark-2 border-y border-[rgba(255,255,255,0.06)] relative z-10">
        <div id="como-[container]" className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div id="como-info-header" className="max-w-xl text-left mb-16">
            <div id="como-badge" className="inline-flex items-center gap-2 text-xs font-bold font-syne uppercase tracking-wider text-accent-cyan mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span>Proceso Simple</span>
            </div>
            <h2 id="como-section-title" className="font-syne font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
              Simple como <span className="text-accent-cyan italic">debe ser</span>
            </h2>
            <p id="como-section-sub" className="text-sm md:text-base text-[#8A9BAD] mt-3 font-light leading-relaxed">
              De la reserva digital hasta la entrega reluciente, todo bajo tu control absoluto y sin esperas presenciales absurdas.
            </p>
          </div>

          <div id="como-grid-steps" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            
            {/* Step 1 */}
            <div id="step-card-1" className="bg-surface-dark border border-[rgba(255,255,255,0.05)] p-8 relative flex flex-col justify-between group hover:border-accent-cyan/35 transition-all">
              <div className="flex flex-col">
                <span className="font-syne font-extrabold text-5xl text-[#1A2530] group-hover:text-accent-cyan/20 transition-colors leading-none mb-6">01</span>
                <span className="w-10 h-10 rounded-xl bg-accent-cyan/5 border border-accent-cyan/15 flex items-center justify-center text-xl mb-4">📱</span>
                <h3 className="font-syne font-bold text-lg text-white mb-2">Regístrate</h3>
                <p className="text-xs text-[#8A9BAD] leading-relaxed font-light">Crea tu cuenta con tu número, introduce los datos de tu vehículo y accede a los cupones de bienvenida de inmediato.</p>
              </div>
              <div className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-bg-dark-2 border border-[rgba(255,255,255,0.08)] rounded-full items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[#4D6070]" />
              </div>
            </div>

            {/* Step 2 */}
            <div id="step-card-2" className="bg-surface-dark border border-[rgba(255,255,255,0.05)] p-8 relative flex flex-col justify-between group hover:border-accent-cyan/35 transition-all">
              <div className="flex flex-col">
                <span className="font-syne font-extrabold text-5xl text-[#1A2530] group-hover:text-accent-cyan/20 transition-colors leading-none mb-6">02</span>
                <span className="w-10 h-10 rounded-xl bg-accent-cyan/5 border border-accent-cyan/15 flex items-center justify-center text-xl mb-4">📅</span>
                <h3 className="font-syne font-bold text-lg text-white mb-2">Reserva tu turno</h3>
                <p className="text-xs text-[#8A9BAD] leading-relaxed font-light">Elige el tipo de lavado, selecciona cualquiera de los horarios disponibles y confirma tu reserva en solo unos clicks.</p>
              </div>
              <div className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-bg-dark-2 border border-[rgba(255,255,255,0.08)] rounded-full items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[#4D6070]" />
              </div>
            </div>

            {/* Step 3 */}
            <div id="step-card-3" className="bg-surface-dark border border-[rgba(255,255,255,0.05)] p-8 relative flex flex-col justify-between group hover:border-accent-cyan/35 transition-all">
              <div className="flex flex-col">
                <span className="font-syne font-extrabold text-5xl text-[#1A2530] group-hover:text-accent-cyan/20 transition-colors leading-none mb-6">03</span>
                <span className="w-10 h-10 rounded-xl bg-accent-cyan/5 border border-accent-cyan/15 flex items-center justify-center text-xl mb-4">🚗</span>
                <h3 className="font-syne font-bold text-lg text-white mb-2">Relájate y Sigue</h3>
                <p className="text-xs text-[#8A9BAD] leading-relaxed font-light">Trae tu auto a la hora agendada y monitorea remotamente la limpieza en vivo. Te avisaremos cuando finalice.</p>
              </div>
              <div className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-bg-dark-2 border border-[rgba(255,255,255,0.08)] rounded-full items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[#4D6070]" />
              </div>
            </div>

            {/* Step 4 */}
            <div id="step-card-4" className="bg-surface-dark border border-[rgba(255,255,255,0.05)] p-8 relative flex flex-col justify-between group hover:border-accent-cyan/35 transition-all">
              <div className="flex flex-col">
                <span className="font-syne font-extrabold text-5xl text-[#1A2530] group-hover:text-accent-cyan/20 transition-colors leading-none mb-6">04</span>
                <span className="w-10 h-10 rounded-xl bg-accent-gold/5 border border-accent-gold/15 flex items-center justify-center text-xl mb-4">🏆</span>
                <h3 className="font-syne font-bold text-lg text-white mb-2">Acumula y Gana</h3>
                <p className="text-xs text-[#8A9BAD] leading-relaxed font-light">Retira tu auto resplandeciente. Tus puntos de fidelidad se sumarán inmediatamente a tu billetera virtual.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── CLIENT ACTIVE BOOKINGS (DASHBOARD) ── */}
      {bookings.length > 0 && (
        <section id="tus-turnos" className="py-12 bg-bg-dark relative z-10 border-b border-[rgba(255,255,255,0.04)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="text-left">
                <h3 className="font-syne font-extrabold text-2xl text-white flex items-center gap-2">
                  <span>Tus Reservas Activas</span>
                  <span className="text-xs px-2.5 py-1 bg-accent-cyan/15 text-accent-cyan font-semibold rounded-full font-sans">{bookings.length}</span>
                </h3>
                <p className="text-xs text-[#8A9BAD] mt-1">Sigue el estado en tiempo real. Puedes simular el proceso para ver cómo progresa.</p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-xs text-[#4D6070] bg-surface-dark px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-accent-cyan" />
                  Haz clic en "Siguiente Estado" para simular el lavado en vivo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {bookings.map((b) => (
                  <motion.div
                    key={b.id}
                    id={`active-booking-card-${b.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface-dark border border-[rgba(255,255,255,0.08)] hover:border-accent-cyan/30 rounded-2xl p-6 text-left relative overflow-hidden"
                  >
                    {/* Status accent top line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      b.status === 'En Espera' ? 'bg-[#55697F]' :
                      b.status === 'Lavando' ? 'bg-accent-gold' :
                      'bg-accent-green'
                    }`} />

                    <div className="flex items-center justify-between mb-4">
                      <span className="font-syne font-bold text-xs text-[#4D6070]">TICKET: {b.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          b.status === 'Lavando' ? 'bg-accent-gold animate-ping' :
                          b.status === 'Listo' ? 'bg-accent-green animate-pulse' :
                          'bg-[#a3b2c2]'
                        }`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          b.status === 'En Espera' ? 'bg-[#1C2C3A] text-[#8A9BAD]' :
                          b.status === 'Lavando' ? 'bg-accent-gold/10 text-accent-gold' :
                          b.status === 'Listo' ? 'bg-accent-green/10 text-[#22D87A]' :
                          'bg-accent-cyan/10 text-accent-cyan'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-syne font-bold text-lg text-white mb-1">{b.serviceName}</h4>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-[#8A9BAD] border-t border-[rgba(255,255,255,0.06)] pt-3 mt-3">
                      <div>
                        <span className="block text-[10px] text-[#4D6070] uppercase">Vehículo</span>
                        <span className="font-medium text-white">{b.vehicleType} ({b.plate})</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4D6070] uppercase">Cliente</span>
                        <span className="font-medium text-white">{b.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent-cyan" />
                        <span>{b.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-3.5 mt-4">
                      <div>
                        <span className="block text-[10px] text-[#4D6070] uppercase">Total</span>
                        <span className="font-syne font-extrabold text-base text-accent-cyan">${b.servicePrice}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-accent-gold uppercase font-bold">✨ Ganas</span>
                        <span className="text-xs text-accent-gold font-bold">+{b.pointsEarned} PTS</span>
                      </div>
                    </div>

                    {/* Interactive controls */}
                    <div className="grid grid-cols-3 gap-1.5 mt-5">
                      <button
                        id={`btn-prog-${b.id}`}
                        onClick={() => handleProgressStatus(b.id)}
                        disabled={b.status === 'Listo' || b.status === 'Entregado'}
                        className="px-1 py-1.5 bg-surface-dark-2 text-[#8A9BAD] border border-[rgba(255,255,255,0.07)] hover:border-accent-cyan hover:text-white disabled:pointer-events-none disabled:opacity-40 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Siguiente Estado</span>
                      </button>
                      
                      <a
                        id={`btn-wa-${b.id}`}
                        href={getWhatsAppBookingUrl(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1 py-1.5 bg-[#22D87A]/10 text-accent-green hover:bg-[#22D87A]/20 border border-accent-green/20 hover:border-accent-green/45 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all no-underline text-center cursor-pointer"
                      >
                        <span className="text-[11px] shrink-0">💬</span>
                        <span className="truncate">WhatsApp</span>
                      </a>

                      <button
                        id={`btn-cancel-${b.id}`}
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-1 py-1.5 bg-[#4B1E27]/20 text-[#FF5072] border border-[#FF5072]/20 hover:bg-[#4B1E27]/40 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Cancelar</span>
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </section>
      )}

      {/* ── SECCIÓN: SERVICIOS ── */}
      <section id="servicios" className="py-24 relative z-10 transition-all">
        <div id="servicios-[container]" className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          
          <div id="servicios-head" className="max-w-xl text-left mb-16">
            <div id="servicios-badge" className="inline-flex items-center gap-2 text-xs font-bold font-syne uppercase tracking-wider text-accent-cyan mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span>Nuestros Servicios</span>
            </div>
            <h2 id="servicios-title-text" className="font-syne font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
              Precios justos para <br />
              cada <span className="text-accent-cyan italic">necesidad</span>
            </h2>
            <p id="servicios-sub-text" className="text-sm md:text-base text-[#8A9BAD] mt-3 font-light leading-relaxed">
              Desde un enjuague rápido diario hasta tratamientos profundos de renovación estética. Haz clic en cualquier tarjeta para agendar.
            </p>
          </div>

          <div id="servicios-grid-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const plan = PLANS.find(p => p.id === activeMembership);
              const discountPercent = plan ? plan.discountPercent : 0;
              const hasDiscount = discountPercent > 0;
              const discountedPrice = Math.round(s.price * (100 - discountPercent)) / 100;

              return (
                <div
                  key={s.id}
                  id={`service-card-${s.id}`}
                  onClick={() => handleOpenBooking(s)}
                  className={`bg-surface-dark border p-5 rounded-3xl text-left transition-all duration-300 relative group overflow-hidden cursor-pointer flex flex-col justify-between ${
                    s.id === 'full' 
                      ? 'border-accent-cyan shadow-[0_15px_30px_rgba(0,212,255,0.06)]' 
                      : 'border-[rgba(255,255,255,0.06)] hover:border-accent-cyan/40 hover:translate-y-[-5px]'
                  }`}
                >
                  {/* Top glowing bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 z-10 ${
                    s.id === 'full' ? 'bg-accent-cyan' : 'bg-transparent group-hover:bg-accent-cyan'
                  }`} />

                  <div>
                    {/* Service Image Header Thumbnail */}
                    {s.imageUrl && (
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 z-0">
                        <img 
                          src={s.imageUrl} 
                          alt={s.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />
                        
                        {s.id === 'full' && (
                          <div id="promo-featured-pill" className="absolute top-3 right-3 text-[9px] font-bold bg-accent-cyan text-bg-dark rounded-full px-2.5 py-1 tracking-wider uppercase font-syne">
                            Más Popular
                          </div>
                        )}
                      </div>
                    )}

                    {/* Icon and Category pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
                        s.colorClass === 'blue' ? 'bg-accent-cyan/15 text-accent-cyan' :
                        s.colorClass === 'gold' ? 'bg-accent-gold/15 text-accent-gold' :
                        s.colorClass === 'green' ? 'bg-[#22D87A]/15 text-[#22D87A]' :
                        s.colorClass === 'coral' ? 'bg-[#FF6450]/15 text-[#FF6450]' :
                        s.colorClass === 'purple' ? 'bg-[#9966FF]/15 text-[#9966FF]' :
                        'bg-[#FF5096]/15 text-[#FF5096]'
                      }`}>
                        <span>{s.icon}</span>
                      </div>
                      
                      <span className="text-[9px] px-2.5 py-1 rounded-full bg-surface-dark-2 text-[#8A9BAD] border border-[rgba(255,255,255,0.06)] font-bold uppercase tracking-wider font-syne">
                        {s.category === 'all' ? 'Auto & Moto' : s.category === 'moto' ? 'Solo Moto' : 'Solo Auto'}
                      </span>
                    </div>

                    <h3 id={`service-title-${s.id}`} className="font-syne font-bold text-xl text-white mb-2 group-hover:text-accent-cyan transition-colors">{s.name}</h3>
                    <p id={`service-desc-${s.id}`} className="text-xs text-[#8A9BAD] font-light leading-relaxed mb-6">
                      {s.description}
                    </p>
                  </div>

                  <div>
                    <div id={`service-foot-panel-${s.id}`} className="flex items-center justify-between mt-auto border-t border-[rgba(255,255,255,0.06)] pt-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#4D6070] uppercase font-bold tracking-wider">PRECIO</span>
                        <div className="flex items-baseline gap-1.5">
                          {hasDiscount ? (
                            <>
                              <span className="font-syne font-extrabold text-2xl text-white">${discountedPrice}</span>
                              <span className="text-xs text-[#4D6070] line-through">${s.price}</span>
                            </>
                          ) : (
                            <span className="font-syne font-extrabold text-2xl text-white">${s.price}</span>
                          )}
                          <span className="text-[10px] text-[#4D6070]">/ {s.id === 'moto' ? 'moto' : 'auto'}</span>
                        </div>
                      </div>

                      <div id={`service-btn-box-${s.id}`} className="flex flex-col items-end text-right">
                        <span className="text-[10px] text-[#4D6070] uppercase tracking-wide">DURACIÓN</span>
                        <span className="text-xs text-white font-semibold">{s.duration}</span>
                      </div>
                    </div>

                    {/* Preselected loyalty info tag */}
                    <div className="mt-3 flex items-center justify-between pointer-events-none text-[10px] text-accent-gold font-bold">
                      <span className="text-[#8A9BAD] font-light font-sans">Acumula puntos con esta reserva:</span>
                      <span>+ {Math.floor(discountedPrice)} PTS ⭐</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECCIÓN: PROGRAMA DE FIDELIZACIÓN (MEMBRESÍAS) ── */}
      <section id="fidelizacion" className="py-24 bg-bg-dark-2 border-y border-[rgba(255,255,255,0.06)] relative z-10">
        <div id="loyalty-container-grid" className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div id="loyalty-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div id="loyalty-text-side" className="lg:col-span-6 text-left">
              <div id="loyalty-badge" className="inline-flex items-center gap-2 text-xs font-bold font-syne uppercase tracking-wider text-accent-cyan mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span>Club AquaWash</span>
              </div>
              <h2 id="loyalty-title" className="font-syne font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-none mb-6">
                Cada lavado te <br />
                devuelve <span className="text-accent-cyan italic">más.</span>
              </h2>
              <p id="loyalty-description" className="text-sm md:text-base text-[#8A9BAD] font-light leading-relaxed mb-8">
                Diseñado para recompensar tu preferencia en cada servicio. Acumula puntos canjeables por upgrades, invita a amigos o adhiérete a un plan mensual recurrente para una experiencia premium y sin fricciones.
              </p>

              {/* Club perks lists */}
              <div id="club-perks-list" className="flex flex-col gap-4">
                
                <div id="club-perk-1" className="bg-surface-dark border border-[rgba(255,255,255,0.04)] rounded-2xl p-5 flex items-start gap-4 hover:border-accent-cyan/15 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-accent-cyan/5 border border-accent-cyan/15 flex items-center justify-center text-xl shrink-0 text-accent-cyan">⭐</div>
                  <div>
                    <h4 className="font-syne font-bold text-base text-white mb-1">Puntos por Consumo</h4>
                    <p className="text-xs text-[#8A9BAD] font-light leading-relaxed">Suma 1 punto por cada dólar real consumido. Canjéalos desde la app por lavados secos, ceras protectoras o servicios express gratis.</p>
                  </div>
                </div>

                <div id="club-perk-2" className="bg-surface-dark border border-[rgba(255,255,255,0.04)] rounded-2xl p-5 flex items-start gap-4 hover:border-accent-cyan/15 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-accent-gold/5 border border-accent-gold/15 flex items-center justify-center text-xl shrink-0 text-accent-gold">🎂</div>
                  <div>
                    <h4 className="font-syne font-bold text-base text-white mb-1">Regalo de Cumpleaños</h4>
                    <p className="text-xs text-[#8A9BAD] font-light leading-relaxed">Recibe automáticamente un cupón especial y descuento directo del 15% en cualquier Lavado Full durante tu semana festiva.</p>
                  </div>
                </div>

                <div id="club-perk-3" className="bg-surface-dark border border-[rgba(255,255,255,0.04)] rounded-2xl p-5 flex items-start gap-4 hover:border-accent-cyan/15 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-accent-green/5 border border-accent-green/15 flex items-center justify-center text-xl shrink-0 text-accent-green">🤝</div>
                  <div>
                    <h4 className="font-syne font-bold text-base text-white mb-1">Programa de Referidos</h4>
                    <p className="text-xs text-[#8A9BAD] font-light leading-relaxed">Comparte tu placa de invitación. Cuando tu referido complete su primer lavado, ambos obtienen 20 puntos de recompensa en su saldo.</p>
                  </div>
                </div>

              </div>
            </div>

            <div id="loyalty-plans-side" className="lg:col-span-6">
              
              {/* Premium Plan Card Container */}
              <div id="membership-pricing-card" className="bg-gradient-to-br from-surface-dark to-bg-dark border border-[rgba(255,255,255,0.1)] rounded-[32px] p-8 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <div id="pricing-blur-glow" className="absolute top-[-80px] right-[-80px] w-48 h-48 bg-radial from-accent-gold/10 to-transparent pointer-events-none blur-2xl rounded-full" />
                
                <span id="membership-plan-section-badge" className="text-[10px] font-bold tracking-widest text-[#8A9BAD] uppercase mb-1 block">Suscripciones Mensuales</span>
                <h3 id="membership-plan-section-title" className="font-syne font-extrabold text-2xl text-white mb-2">Membresías Activas</h3>
                <p id="membership-plan-section-subtitle" className="text-xs text-[#8A9BAD] mb-6">Optimiza tu cuidado vial. Selecciona un plan mensual y obtén descuentos de hasta el 15% automático en cada servicio.</p>

                {/* Simulated billing switch with interactive plans list */}
                <div id="pricing-[tiers-grid]" className="flex flex-col gap-3.5">
                  {PLANS.map((plan) => {
                    const isSelected = activeMembership === plan.id;
                    return (
                      <div
                        key={plan.id}
                        id={`pricing-option-${plan.id}`}
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 cursor-pointer relative ${
                          isSelected 
                            ? 'bg-accent-gold/10 border-accent-gold/45 shadow-[0_4px_20px_rgba(245,200,66,0.1)]' 
                            : 'bg-surface-dark-2 border-[rgba(255,255,255,0.06)] hover:border-accent-gold/25'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-3 px-1.5 py-0.5 bg-accent-gold text-bg-dark text-[8px] font-bold uppercase rounded font-syne">
                            Seleccionada
                          </div>
                        )}
                        <span className="text-2xl bg-[#080C10]/40 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">{plan.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <h4 className="font-syne font-bold text-sm text-white mb-1">Membresía {plan.name}</h4>
                            <span className="font-syne font-extrabold text-base text-accent-gold">${plan.price}<span className="text-[9px] text-[#4d6070] font-normal font-sans">/mes</span></span>
                          </div>
                          <p className="text-[10px] text-[#8A9BAD] leading-tight flex flex-wrap gap-x-2">
                            {plan.benefits.slice(0, 2).map((b, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-accent-gold" />
                                {b}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div id="referral-bonus-panel" className="mt-8 border-t border-[rgba(255,255,255,0.06)] pt-6 text-left">
                  <h4 className="font-syne font-bold text-xs text-white uppercase tracking-wider mb-3">Recomienda y Gana</h4>
                  
                  <form id="referral-form" onSubmit={handleReferral} className="flex gap-2">
                    <input
                      id="input-refer-phone"
                      type="tel"
                      required
                      placeholder="WhatsApp Amigo (Ej: 0998881234)"
                      value={referFriendPhone}
                      onChange={(e) => setReferFriendPhone(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none"
                    />
                    <button
                      id="btn-refer-submit"
                      type="submit"
                      className="px-4 py-2 bg-accent-cyan font-semibold text-xs text-bg-dark font-syne rounded-xl hover:bg-[#33DCFF] transition-all transform active:scale-95 cursor-pointer"
                    >
                      Enviar
                    </button>
                  </form>

                  <AnimatePresence>
                    {referSuccess && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="block text-accent-green text-[10px] font-bold mt-2"
                      >
                        ¡Invitación enviada! Tu saldo subió +20 PTS ⭐
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  id="checkout-plan-btn"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-6 py-3.5 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark font-syne font-bold text-xs sm:text-sm rounded-xl tracking-wide uppercase transition-all transform active:scale-95 cursor-pointer"
                >
                  Confirmar Plan Seleccionado & Agendar
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECCIÓN: OPINIONES Y ENTRADA DE REVIEWS ── */}
      <section id="opiniones" className="py-24 relative z-10 transition-all">
        <div id="opiniones-[container]" className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between text-left mb-16 gap-8">
            <div id="test-intro-text" className="max-w-xl">
              <div id="test-badge" className="inline-flex items-center gap-2 text-xs font-bold font-syne uppercase tracking-wider text-accent-cyan mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span>Testimonios Reales</span>
              </div>
              <h2 id="test-main-title" className="font-syne font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                Voces de nuestra <span className="text-accent-cyan italic">comunidad</span>
              </h2>
              <p id="test-main-sub" className="text-sm text-[#8A9BAD] mt-3 font-light">
                Descubre por qué cientos de clientes confían en nuestro servicio premium. Tu opiniones y comentarios siempre nos ayudan a mejorar la experiencia de lavado.
              </p>
            </div>

            {/* Micro review aggregate */}
            <div id="stars-recap-box" className="p-6 bg-surface-dark border border-[rgba(255,255,255,0.06)] rounded-2xl flex items-center gap-4 shrink-0">
              <div className="text-center">
                <span className="block text-3xl font-syne font-bold text-white leading-none">4.9</span>
                <span className="text-[10px] text-[#4D6070] uppercase font-semibold">de 5 estrellas</span>
              </div>
              <div className="h-10 w-px bg-[rgba(255,255,255,0.1)]" />
              <div className="text-left">
                <div className="text-accent-gold tracking-wider font-semibold text-sm mb-1">★★★★★</div>
                <span className="text-xs text-[#8A9BAD] font-light">Basado en 2,400+ reseñas de pilotos locales</span>
              </div>
            </div>
          </div>

          {/* Interactive grid showing reviews + form */}
          <div id="reviews-interactive-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Real reviews listing list */}
            <div id="listed-reviews-list" className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left max-h-[800px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {reviews.map((r) => (
                  <motion.div
                    key={r.id}
                    id={`review-card-${r.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface-dark border border-[rgba(255,255,255,0.06)] p-6 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="text-accent-gold text-xs leading-none">
                          {'★'.repeat(r.stars)}
                          {'☆'.repeat(5 - r.stars)}
                        </div>
                        <span className="text-[10px] text-[#4D6070]">{r.date}</span>
                      </div>
                      
                      <p className="text-xs text-[#8A9BAD] font-light leading-relaxed italic mb-5">
                       "{r.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 border-t border-[rgba(255,255,255,0.04)] pt-3.5 mt-2">
                      <div className={`w-9 h-9 rounded-full font-bold font-syne text-xs flex items-center justify-center ${r.avatarClass}`}>
                        {r.author.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-white leading-snug">{r.author}</span>
                        <span className="block text-[10px] text-[#4D6070] truncate">
                          {r.vehicle} {r.membershipPlan ? `· ${r.membershipPlan}` : ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right side form block for leaving dynamic Reviews */}
            <div id="leave-review-panel" className="lg:col-span-4 self-start">
              <div id="review-submission-box" className="bg-gradient-to-br from-surface-dark to-bg-dark border border-[rgba(255,255,255,0.06)] rounded-3xl p-6 md:p-8 text-left">
                <span className="text-[10px] font-bold tracking-widest text-[#8A9BAD] uppercase mb-1 block">Tu opinión importa</span>
                <h3 className="font-syne font-bold text-lg text-white mb-4">Escribe tu Reseña</h3>
                
                <form id="submission-review-form" onSubmit={handleAddReview} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase mb-1.5">Tu Nombre</label>
                    <input
                      id="rev-input-author"
                      type="text"
                      required
                      placeholder="Ej: Marcelo Cabrera"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase mb-1.5">Modelo de Tu Vehículo</label>
                    <input
                      id="rev-input-vehicle"
                      type="text"
                      required
                      placeholder="Ej: Chevrolet Vitara"
                      value={newReviewVehicle}
                      onChange={(e) => setNewReviewVehicle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase mb-1.5">Calificación</label>
                    <div className="flex gap-1.5 items-center mt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          id={`star-btn-${val}`}
                          type="button"
                          onClick={() => setNewReviewStars(val)}
                          className="text-lg p-0.5 focus:outline-none transition-transform active:scale-125"
                        >
                          <Star className={`w-5 h-5 ${val <= newReviewStars ? 'text-accent-gold fill-accent-gold' : 'text-[#2e3e4e]'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase mb-1.5">Tu Opinión</label>
                    <textarea
                      id="rev-input-text"
                      required
                      rows={3}
                      placeholder="Cuéntanos qué tal fue tu experiencia con el lavado y la atención..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none resize-none"
                    />
                  </div>

                  <button
                    id="submit-review-card-btn"
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-3 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark text-xs font-bold font-syne tracking-wider uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReview ? 'Publicando...' : 'Publicar Comentario ✓'}
                  </button>

                  <AnimatePresence>
                    {reviewSuccessMsg && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-accent-green text-[11px] font-semibold text-center mt-2 leading-tight"
                      >
                        {reviewSuccessMsg}
                      </motion.span>
                    )}
                  </AnimatePresence>

                </form>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── CTA SECCIÓN FINAL ── */}
      <section id="banner-registro-fidelizacion" className="py-24 bg-bg-dark-2 text-center relative overflow-hidden border-t border-[rgba(255,255,255,0.06)]">
        <div id="cta-glow-decor" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-cyan/15 rounded-full blur-[90px] -z-10" />
        
        <div id="cta-body-container" className="max-w-2xl mx-auto px-6">
          <div id="cta-badge-element" className="inline-flex items-center justify-center gap-2 text-xs font-bold font-syne uppercase tracking-wider text-accent-cyan mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            <span>Comienza Hoy</span>
          </div>
          
          <h2 id="cta-header-title" className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Tu primer lavado <br className="hidden sm:inline" />
            te está <span className="text-accent-cyan italic">esperando</span>
          </h2>
          
          <p id="cta-secondary-desc" className="text-sm md:text-base text-[#8A9BAD] font-light leading-relaxed mb-8">
            Haz tu primera reserva digital en menos de 2 minutos. Registramos automáticamente 50 puntos de fidelidad de bienvenida directo en tu perfil.
          </p>

          <button
            id="footer-registration-cta"
            onClick={() => handleOpenBooking(null)}
            className="px-8 py-4 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark font-syne font-extrabold text-sm sm:text-base rounded-xl shadow-[0_5px_20px_rgba(0,212,255,0.25)] transition-all transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Crear cuenta gratis & Reservar</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          <div id="cta-meta-perks" className="flex flex-wrap gap-x-6 gap-y-3 justify-center mt-10 text-xs text-[#8A9BAD]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>Sin tarjeta requerida</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>Cancela cuando gustes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>+50 Puntos Gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer-main" className="bg-[#080C10] border-t border-[rgba(255,255,255,0.06)] pt-20 pb-10 relative z-10">
        <div id="footer-inner-wrapper" className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div id="footer-cols-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <a id="footer-logo" href="#" className="flex items-center gap-3 text-xl font-syne font-extrabold tracking-tight mb-4">
                <div id="footer-logo-box" className="w-9 h-9 bg-accent-cyan rounded-lg flex items-center justify-center">
                  <Droplets id="footer-logo-svg" className="w-5 h-5 text-bg-dark" fill="currentColor" />
                </div>
                <span>AquaWash</span>
              </a>
              <p id="footer-brand-p" className="text-xs md:text-sm text-[#4D6070] font-light leading-relaxed max-w-sm">
                Plataforma integrada de gestión de turnos, lavado ecológico inteligente y billetera de fidelización. Tecnología premium para el cuidado automotriz.
              </p>
            </div>

            <div className="lg:col-span-2 text-left">
              <h4 className="font-syne font-bold text-xs text-white uppercase tracking-wider mb-4">Servicios</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4D6070] list-none">
                <li><a id="footer-link-express" href="#servicios" className="hover:text-white transition-colors">Lavado Express</a></li>
                <li><a id="footer-link-full" href="#servicios" className="hover:text-[#22D87A] transition-colors font-semibold">Lavado Full ✨</a></li>
                <li><a id="footer-link-brillo" href="#servicios" className="hover:text-white transition-colors">Encerado y Brillo</a></li>
                <li><a id="footer-link-desengrase" href="#servicios" className="hover:text-white transition-colors">Desengrase Motor</a></li>
                <li><a id="footer-link-detailing" href="#servicios" className="hover:text-white transition-colors font-semibold text-accent-cyan">Detailing Premium 💎</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 text-left">
              <h4 className="font-syne font-bold text-xs text-[#a3b2c2] uppercase tracking-wider mb-4">Membresías</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4D6070] list-none">
                <li><a id="footer-plan-bronce" href="#fidelizacion" className="hover:text-white transition-colors">Plan Bronce</a></li>
                <li><a id="footer-plan-plata" href="#fidelizacion" className="hover:text-white transition-colors font-semibold">Plan Plata</a></li>
                <li><a id="footer-plan-oro" href="#fidelizacion" className="hover:text-accent-gold transition-colors font-semibold">Plan Oro 🥇</a></li>
                <li><a id="footer-plan-points" href="#fidelizacion" className="hover:text-white transition-colors">Historial de Puntos</a></li>
                <li><a id="footer-plan-corporate" href="#fidelizacion" className="hover:text-white transition-colors">Planes Corporativos</a></li>
              </ul>
            </div>

            <div className="lg:col-span-3 text-left">
              <h4 className="font-syne font-bold text-xs text-white uppercase tracking-wider mb-4">AquaWash local</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#4D6070] list-none">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                  <span>Av. Francisco de Orellana 241, Quito, Ecuador</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-cyan shrink-0" />
                  <span>Lunes a Sábado: 08:00 - 18:00</span>
                </li>
                <li className="flex items-center gap-2">
                   <Phone className="w-4 h-4 text-accent-cyan shrink-0" />
                  <a href="https://api.whatsapp.com/send?phone=5930989012515" target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan transition-colors">
                    +593 098 901 2515
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div id="footer-sub-bar" className="border-t border-[rgba(255,255,255,0.06)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span id="footer-copy-text" className="text-xs text-[#4D6070]">
              &copy; 2026 AquaWash · Quito, Ecuador · Todos los derechos reservados.
            </span>
            <div id="author-tribute-line" className="text-xs text-[#4D6070] flex items-center gap-1.5">
              <span>Hecho con</span>
              <Droplets className="w-3.5 h-3.5 text-accent-cyan" fill="currentColor" />
              <span>para el cuidado de tu vehículo</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ── ACTIVE RESERVATION MODAL (INTERACTIVE PORTAL) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div id="modal-portal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Glass backdrop */}
            <motion.div
              id="modal-backdrop-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Body Card */}
            <motion.div
              id="modal-panel-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-surface-dark border border-[rgba(255,255,255,0.12)] rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                id="modal-top-close-btn"
                onClick={handleCloseModal}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-dark-2 hover:bg-[rgba(255,255,255,0.08)] text-[#8A9BAD] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!showSuccess ? (
                <div id="modal-form-view">
                  <h3 id="modal-form-title" className="font-syne font-extrabold text-2xl text-white tracking-tight leading-snug">Reservar Turno</h3>
                  <p id="modal-form-desc" className="text-xs text-[#8A9BAD] mt-1 mb-6">Completa los datos de tu placa, tipo de vehículo y hora conveniente para asegurar tu servicio.</p>
                  
                  {/* Selected service quick summary */}
                  <div id="modal-selected-service-banner" className="mb-5 p-4 bg-bg-dark-2 rounded-2xl flex items-center justify-between border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedService?.icon || '✨'}</span>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-white leading-snug">{selectedService?.name || 'Lavado Full'}</span>
                        <span className="block text-[10px] text-[#4D6070]">Tiempo estimado: {selectedService?.duration || '50 min'}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {/* Active subscription discount display */}
                      {activeMembership ? (
                        <>
                          <div className="text-[10px] text-accent-gold font-bold">Membresía {activeMembership.toUpperCase()} Activa</div>
                          <span className="font-syne font-bold text-xs text-[#4D6070] line-through block">${selectedService?.price || 18}</span>
                          <span className="font-syne font-extrabold text-base text-accent-cyan">
                            ${Math.round((selectedService?.price || 18) * ((100 - (PLANS.find(p => p.id === activeMembership)?.discountPercent || 0)) / 100) * 100) / 100}
                          </span>
                        </>
                      ) : (
                        <span className="font-syne font-extrabold text-lg text-accent-cyan">${selectedService?.price || 18}</span>
                      )}
                    </div>
                  </div>

                  <form id="booking-modal-form" onSubmit={handleSubmitBooking} className="flex flex-col gap-4 text-left">
                    
                    <div>
                      <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Tu Nombre Completo</label>
                      <input
                        id="booking-input-name"
                        type="text"
                        required
                        placeholder="Ej: Marcelo Cabrera"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">WhatsApp de Contacto</label>
                        <input
                          id="booking-input-phone"
                          type="tel"
                          required
                          placeholder="Ej: +593 99 876 5432"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Placa del Vehículo</label>
                        <input
                          id="booking-input-plate"
                          type="text"
                          required
                          placeholder="Ej: PDH-8321"
                          maxLength={8}
                          value={vehiclePlate}
                          onChange={(e) => setVehiclePlate(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans font-bold placeholder:font-normal uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Tipo de Vehículo</label>
                        <select
                          id="booking-select-type"
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                        >
                          <option>Auto</option>
                          <option>Camioneta</option>
                          <option>SUV / 4x4</option>
                          <option>Moto</option>
                          <option>Van / Furgoneta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Servicio a Realizar</label>
                        <select
                          id="booking-select-service"
                          value={selectedService?.id || ''}
                          onChange={(e) => {
                            const found = SERVICES.find(sv => sv.id === e.target.value);
                            if (found) setSelectedService(found);
                          }}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                        >
                          {SERVICES.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} (desde ${s.price})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Seleccionar Fecha</label>
                        <input
                          id="booking-input-date"
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8A9BAD] uppercase tracking-wide mb-1.5">Horas Disponibles</label>
                        <select
                          id="booking-select-time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full px-4 py-3 text-xs bg-bg-dark-2 text-white border border-[rgba(255,255,255,0.08)] rounded-xl focus:border-accent-cyan outline-none font-sans"
                        >
                          <option>08:00</option>
                          <option>08:30</option>
                          <option>09:00</option>
                          <option>09:30</option>
                          <option>10:00</option>
                          <option>10:30</option>
                          <option>11:00</option>
                          <option>11:30</option>
                          <option>14:00</option>
                          <option>14:30</option>
                          <option>15:00</option>
                          <option>15:30</option>
                          <option>16:00</option>
                          <option>16:30</option>
                          <option>17:00</option>
                        </select>
                      </div>
                    </div>

                    {/* Value-added loyalty points helper view */}
                    <div id="points-loyalty-help" className="p-3 bg-accent-gold/5 border border-accent-gold/15 rounded-xl flex items-center gap-2.5 text-left text-xs mb-2">
                      <Gift className="w-4 h-4 text-accent-gold shrink-0" />
                      <div>
                        <span className="block text-accent-gold font-bold">¡Multiplicador de puntos de fidelidad activo!</span>
                        <span className="block text-[10px] text-[#8A9BAD] mt-0.5">Esta reserva te sumará un total de <span className="text-white font-bold">+{selectedService ? Math.floor(selectedService.price * (activeMembership ? (100 - (PLANS.find(p => p.id === activeMembership)?.discountPercent || 0)) / 100 : 1)) : 0} PTS</span> canjeables.</span>
                      </div>
                    </div>

                    <button
                      id="modal-submit-reserve-btn"
                      type="submit"
                      className="w-full py-4 bg-accent-cyan hover:bg-[#33DCFF] text-bg-dark font-syne font-bold text-sm rounded-xl tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(0,212,255,0.25)] transform active:scale-95 cursor-pointer"
                    >
                      Confirmar Reserva ✓
                    </button>

                  </form>
                </div>
              ) : (
                <div id="modal-success-view" className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 text-accent-green flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <h3 className="font-syne font-extrabold text-2xl text-white tracking-tight mb-2">¡Reserva Exitosa!</h3>
                  <p className="text-xs text-[#8A9BAD] max-w-sm mx-auto mb-6">Tu turno ha sido registrado correctamente en nuestro car wash. Hemos guardado tu ticket de consulta y sumado tus puntos.</p>

                  {/* Summary receipt box */}
                  <div className="p-5 bg-bg-dark-2 rounded-2xl text-left border border-[rgba(255,255,255,0.06)] mb-6 max-w-sm mx-auto">
                    <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3 mb-3">
                      <span className="text-[10px] text-[#4D6070] uppercase font-bold">CÓDIGO TURNOS</span>
                      <span className="font-syne font-extrabold text-sm text-accent-cyan">{lastBookingId}</span>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#8A9BAD]">Servicio:</span>
                        <span className="text-white font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A9BAD]">Vehículo:</span>
                        <span className="text-white font-medium">{vehicleType} (Placa: {vehiclePlate.toUpperCase()})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A9BAD]">Fecha:</span>
                        <span className="text-white font-medium">{bookingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A9BAD]">Hora asignada:</span>
                        <span className="text-white font-medium">{bookingTime} HS</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-accent-gold font-bold mb-6">⭐ Se agregaron los puntos ganados a tu saldo de fidelidad.</p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      id="success-whatsapp-send-btn"
                      href={getWhatsAppBookingUrl(bookings.find(b => b.id === lastBookingId) || bookings[0] || null)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#22D87A] hover:bg-[#32e88a] text-[#080C10] font-syne font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(34,216,122,0.25)] transform active:scale-95 cursor-pointer text-center no-underline"
                    >
                      <span>Enviar a WhatsApp 💬</span>
                    </a>
                    
                    <button
                      id="success-close-modal-btn"
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Cerrar Ventana
                    </button>
                  </div>
                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING DIRECT WHATSAPP BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2 group">
        <div className="bg-bg-dark border border-[rgba(255,255,255,0.12)] px-3.5 py-2 rounded-2xl text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-1.5 font-semibold font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          ¿Dudas? Chatea con nosotros en WhatsApp 💬
        </div>
        <a
          href="https://api.whatsapp.com/send?phone=5930989012515&text=¡Hola%20AquaWash!%20Quisiera%20solicitar%20información%20o%20reservar%20un%20turno%20de%20lavado.%20🚗"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#21d366] hover:bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(33,211,102,0.45)] hover:shadow-[0_15px_40px_rgba(33,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 relative cursor-pointer"
        >
          {/* Pulsing light ring animation */}
          <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-[#21d366]/30 opacity-75 animate-duration-1000" />
          <svg className="w-7 h-7 relative z-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.453 4.819 1.454 5.48.002 9.932-4.45 9.935-9.93.001-2.654-1.03-5.149-2.905-7.025C16.619 1.776 14.12 1.74 11.998 1.74c-5.485 0-9.939 4.455-9.942 9.934-.001 1.834.488 3.626 1.417 5.176l-.953 3.483 3.527-.925c.01.008.01.008.02.016zM16.145 13.067c-.244-.122-1.442-.712-1.666-.793-.223-.081-.385-.122-.547.122-.162.244-.63.793-.772.956-.142.163-.284.183-.528.061-.244-.122-1.03-.38-1.96-1.21-.724-.646-1.213-1.445-1.355-1.688-.142-.243-.015-.375.107-.496.11-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.163.04-.305-.02-.427-.06-.122-.547-1.32-.75-1.81-.197-.478-.396-.412-.547-.412-.142-.01-.305-.01-.467-.01-.162 0-.427.061-.65.305-.224.244-.853.833-.853 2.031 0 1.198.873 2.356.995 2.518.122.163 1.717 2.622 4.16 3.673.58.25 1.034.4 1.387.513.583.186 1.113.16 1.532.097.467-.071 1.442-.589 1.645-1.157.203-.569.203-1.057.142-1.158-.06-.102-.223-.163-.467-.285z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
