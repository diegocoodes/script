import type { Prisma } from "@prisma/client";
import { demoAppData } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import type {
  AppData,
  CompanyView,
  CustomerView,
  DashboardData,
  EquipmentView,
  ServiceCatalogView,
  ServiceOrderView,
} from "@/types/domain";

type CustomerWithCount = Prisma.CustomerGetPayload<{
  include: {
    _count: { select: { equipment: true; serviceOrders: true } };
    serviceOrders: {
      select: { id: true; number: true };
      orderBy: { createdAt: "desc" };
      take: 1;
    };
  };
}>;

type EquipmentWithRelations = Prisma.EquipmentGetPayload<{
  include: {
    customer: { select: { name: true } };
    _count: { select: { serviceOrders: true } };
  };
}>;

type OrderWithRelations = Prisma.ServiceOrderGetPayload<{
  include: {
    customer: true;
    equipment: true;
    technician: { select: { name: true } };
  };
}>;

function reportFallback(area: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[dados de demonstração] ${area}:`,
      error instanceof Error ? error.message : error,
    );
  }
}

function toCustomerView(customer: CustomerWithCount): CustomerView {
  return {
    id: customer.id,
    name: customer.name,
    document: customer.document,
    phone: customer.phone,
    whatsapp: customer.whatsapp,
    email: customer.email,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    notes: customer.notes,
    equipmentCount: customer._count.equipment,
    orderCount: customer._count.serviceOrders,
    latestOrderId: customer.serviceOrders[0]?.id ?? null,
    latestOrderNumber: customer.serviceOrders[0]?.number ?? null,
    createdAt: customer.createdAt.toISOString(),
  };
}

function toEquipmentView(equipment: EquipmentWithRelations): EquipmentView {
  return {
    id: equipment.id,
    customerId: equipment.customerId,
    customerName: equipment.customer.name,
    type: equipment.type,
    brand: equipment.brand,
    model: equipment.model,
    serialNumber: equipment.serialNumber,
    color: equipment.color,
    deliveredAccessories: equipment.deliveredAccessories,
    physicalCondition: equipment.physicalCondition,
    reportedDefect: equipment.reportedDefect,
    notes: equipment.notes,
    orderCount: equipment._count.serviceOrders,
    createdAt: equipment.createdAt.toISOString(),
  };
}

function toOrderView(order: OrderWithRelations): ServiceOrderView {
  return {
    id: order.id,
    number: order.number,
    customerId: order.customerId,
    customerName: order.customer.name,
    customerDocument: order.customer.document,
    customerPhone: order.customer.phone,
    customerWhatsapp: order.customer.whatsapp,
    customerAddress: order.customer.address,
    customerCity: order.customer.city,
    customerState: order.customer.state,
    equipmentId: order.equipmentId,
    equipmentType: order.equipment.type,
    equipmentLabel:
      `${order.equipment.brand} ${order.equipment.model}`.trim(),
    equipmentBrand: order.equipment.brand,
    equipmentModel: order.equipment.model,
    equipmentSerialNumber: order.equipment.serialNumber,
    equipmentColor: order.equipment.color,
    deliveredAccessories: order.equipment.deliveredAccessories,
    physicalCondition: order.equipment.physicalCondition,
    equipmentDescription: order.equipment.notes,
    status: order.status,
    priority: order.priority,
    reportedDefect: order.reportedDefect,
    technicalDiagnosis: order.technicalDiagnosis,
    requestedService: order.requestedService,
    performedService: order.performedService,
    partsUsed: order.partsUsed,
    internalNotes: order.internalNotes,
    customerNotes: order.customerNotes,
    serviceValue: Number(order.serviceValue),
    partsValue: Number(order.partsValue),
    discount: Number(order.discount),
    surcharge: Number(order.surcharge),
    totalValue: Number(order.totalValue),
    paidValue: Number(order.paidValue),
    pendingValue: Number(order.pendingValue),
    paymentMethod: order.paymentMethod,
    entryDate: order.entryDate.toISOString(),
    expectedDeliveryDate: order.expectedDeliveryDate?.toISOString() ?? null,
    completedAt: order.completedAt?.toISOString() ?? null,
    pickedUpAt: order.pickedUpAt?.toISOString() ?? null,
    technicianName:
      order.technician?.name ?? order.technicianDisplayName ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

async function queryCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { equipment: true, serviceOrders: true } },
      serviceOrders: {
        select: { id: true, number: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });
  return customers.map(toCustomerView);
}

async function queryEquipment() {
  const equipment = await prisma.equipment.findMany({
    include: {
      customer: { select: { name: true } },
      _count: { select: { serviceOrders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return equipment.map(toEquipmentView);
}

async function queryServices() {
  const services = await prisma.service.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
  return services.map<ServiceCatalogView>((service) => ({
    id: service.id,
    name: service.name,
    category: service.category,
    description: service.description,
    minimumValue: Number(service.minimumValue),
    maximumValue: Number(service.maximumValue),
    estimatedTime: service.estimatedTime,
    active: service.active,
  }));
}

async function queryOrders() {
  const orders = await prisma.serviceOrder.findMany({
    include: {
      customer: true,
      equipment: true,
      technician: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrderView);
}

async function queryCompany(): Promise<CompanyView> {
  const company = await prisma.companySettings.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!company) {
    throw new Error("Configurações da empresa ainda não foram criadas.");
  }

  return {
    companyName: company.companyName,
    document: company.document,
    phone: company.phone,
    whatsapp: company.whatsapp,
    instagram: company.instagram,
    email: company.email,
    address: company.address,
    city: company.city,
    state: company.state,
    logoUrl: company.logoUrl,
    primaryColor: company.primaryColor,
  };
}

export async function getAppData(): Promise<AppData> {
  try {
    const [company, customers, equipment, services, orders] =
      await Promise.all([
        queryCompany(),
        queryCustomers(),
        queryEquipment(),
        queryServices(),
        queryOrders(),
      ]);
    return { company, customers, equipment, services, orders };
  } catch (error) {
    reportFallback("aplicação", error);
    return demoAppData;
  }
}

export async function getCustomers(): Promise<CustomerView[]> {
  try {
    return await queryCustomers();
  } catch (error) {
    reportFallback("clientes", error);
    return demoAppData.customers;
  }
}

export async function getEquipment(): Promise<EquipmentView[]> {
  try {
    return await queryEquipment();
  } catch (error) {
    reportFallback("equipamentos", error);
    return demoAppData.equipment;
  }
}

export async function getServices(): Promise<ServiceCatalogView[]> {
  try {
    return await queryServices();
  } catch (error) {
    reportFallback("serviços", error);
    return demoAppData.services;
  }
}

export async function getOrders(): Promise<ServiceOrderView[]> {
  try {
    return await queryOrders();
  } catch (error) {
    reportFallback("ordens de serviço", error);
    return demoAppData.orders;
  }
}

export async function getCompany(): Promise<CompanyView> {
  try {
    return await queryCompany();
  } catch (error) {
    reportFallback("empresa", error);
    return demoAppData.company;
  }
}

export async function getOrderById(
  idOrNumber: string,
): Promise<ServiceOrderView | null> {
  try {
    const order = await prisma.serviceOrder.findFirst({
      where: { OR: [{ id: idOrNumber }, { number: idOrNumber }] },
      include: {
        customer: true,
        equipment: true,
        technician: { select: { name: true } },
      },
    });
    return order ? toOrderView(order) : null;
  } catch (error) {
    reportFallback("detalhe da ordem", error);
    return (
      demoAppData.orders.find(
        (order) => order.id === idOrNumber || order.number === idOrNumber,
      ) ?? null
    );
  }
}

export async function getDashboardData(filters?: {
  period?: string;
  from?: string;
  to?: string;
}): Promise<DashboardData> {
  const { orders } = await getAppData();
  const now = new Date();
  const start = new Date(now);
  const period = filters?.period ?? "7days";

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "30days") {
    start.setDate(start.getDate() - 30);
  } else if (period === "custom" && filters?.from) {
    start.setTime(new Date(`${filters.from}T00:00:00`).getTime());
  } else {
    start.setDate(start.getDate() - 7);
  }

  const end =
    period === "custom" && filters?.to
      ? new Date(`${filters.to}T23:59:59`)
      : now;
  const periodOrders = orders.filter((order) => {
    const date = new Date(order.entryDate);
    return date >= start && date <= end;
  });
  const openStatuses = new Set([
    "RECEIVED",
    "IN_ANALYSIS",
    "AWAITING_APPROVAL",
    "AWAITING_PART",
    "IN_MAINTENANCE",
  ]);

  return {
    openOrders: periodOrders.filter((order) => openStatuses.has(order.status))
      .length,
    inAnalysis: periodOrders.filter((order) => order.status === "IN_ANALYSIS")
      .length,
    inMaintenance: periodOrders.filter(
      (order) => order.status === "IN_MAINTENANCE",
    ).length,
    readyForPickup: periodOrders.filter(
      (order) => order.status === "READY_FOR_PICKUP",
    ).length,
    completed: periodOrders.filter((order) =>
      ["COMPLETED", "READY_FOR_PICKUP", "DELIVERED"].includes(order.status),
    ).length,
    receivedThisMonth: periodOrders.reduce(
      (total, order) => total + order.paidValue,
      0,
    ),
    recentOrders: periodOrders.slice(0, 5),
    popularServices: [
      { name: "Limpeza interna", total: 12 },
      { name: "Formatação", total: 9 },
      { name: "Troca de peças", total: 7 },
      { name: "Pasta térmica", total: 5 },
    ],
    weeklyFlow: [
      { day: "Seg", entradas: 4, concluidas: 2 },
      { day: "Ter", entradas: 6, concluidas: 4 },
      { day: "Qua", entradas: 5, concluidas: 3 },
      { day: "Qui", entradas: 8, concluidas: 6 },
      { day: "Sex", entradas: 7, concluidas: 5 },
      { day: "Sáb", entradas: 3, concluidas: 4 },
    ],
  };
}
