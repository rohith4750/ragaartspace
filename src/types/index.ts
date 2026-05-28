export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  dimensions: string;
  createdAt: string | Date;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierPartner: string;
  trackingId: string;
  trackingUrl?: string | null;
  shippedAt?: string | Date | null;
  deliveredAt?: string | Date | null;
  estimatedDate?: string | Date | null;
  currentStatus: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string | Date;
  artworkId: string;
  artwork?: Artwork;
  shipments?: Shipment[];
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  totalArtworks: number;
}

export interface Reel {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  views: string;
  createdAt: string | Date;
}
