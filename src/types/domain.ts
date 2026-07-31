export type CustomerView = {
  id: string;
  name: string;
  document: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  equipmentCount: number;
  orderCount: number;
  latestOrderId: string | null;
  latestOrderNumber: string | null;
  createdAt: string;
};

export type EquipmentView = {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string | null;
  color: string | null;
  deliveredAccessories: string | null;
  physicalCondition: string | null;
  reportedDefect: string;
  notes: string | null;
  orderCount: number;
  createdAt: string;
};

export type ServiceCatalogView = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  minimumValue: number;
  maximumValue: number;
  estimatedTime: string | null;
  active: boolean;
};

export type CompanyView = {
  companyName: string;
  document: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  logoUrl: string | null;
  primaryColor: string;
};

export type ServiceOrderView = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerDocument: string | null;
  customerPhone: string | null;
  customerWhatsapp: string | null;
  equipmentId: string;
  equipmentType: string;
  equipmentLabel: string;
  equipmentBrand: string;
  equipmentModel: string;
  equipmentSerialNumber: string | null;
  equipmentColor: string | null;
  deliveredAccessories: string | null;
  physicalCondition: string | null;
  equipmentDescription: string | null;
  status: string;
  priority: string;
  reportedDefect: string;
  technicalDiagnosis: string | null;
  requestedService: string;
  performedService: string | null;
  partsUsed: string | null;
  internalNotes: string | null;
  customerNotes: string | null;
  serviceValue: number;
  partsValue: number;
  discount: number;
  surcharge: number;
  totalValue: number;
  paidValue: number;
  pendingValue: number;
  paymentMethod: string | null;
  entryDate: string;
  expectedDeliveryDate: string | null;
  completedAt: string | null;
  pickedUpAt: string | null;
  technicianName: string | null;
  clientSignature: string | null;
  technicianSignature: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  openOrders: number;
  inAnalysis: number;
  inMaintenance: number;
  readyForPickup: number;
  completed: number;
  receivedThisMonth: number;
  recentOrders: ServiceOrderView[];
  popularServices: Array<{ name: string; total: number }>;
  weeklyFlow: Array<{ day: string; entradas: number; concluidas: number }>;
};

export type AppData = {
  company: CompanyView;
  customers: CustomerView[];
  equipment: EquipmentView[];
  services: ServiceCatalogView[];
  orders: ServiceOrderView[];
};
