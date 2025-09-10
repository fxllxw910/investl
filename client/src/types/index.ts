export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

export interface PropertyData {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaseData {
  id: number;
  propertyId: number;
  propertyName?: string;
  unitNumber: string;
  tenantId: number;
  tenantName?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
}

export interface TenantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  paymentStatus: string;
}

export interface MaintenanceRequestData {
  id: number;
  propertyId: number;
  propertyName?: string;
  unitNumber: string;
  description: string;
  status: string;
  priority: string;
  requestedBy: number;
  requestedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionData {
  id: number;
  leaseId: number;
  propertyName?: string;
  unitNumber?: string;
  amount: number;
  date: string;
  type: string;
  description: string;
  status: string;
}

export interface ActivityData {
  id: number;
  userId: number;
  userName?: string;
  activityType: string;
  entityType: string;
  entityId: number;
  entityName?: string;
  description: string;
  createdAt: string;
  timeAgo?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface OccupancyChartData {
  occupied: number;
  vacant: number;
  occupancyRate: number;
}

export interface DashboardStats {
  totalProperties: number;
  activeLeases: number;
  monthlyRevenue: number;
  occupancyRate: number;
  propertyTrend: string;
  leaseTrend: string;
  revenueTrend: string;
  occupancyTrend: string;
}
