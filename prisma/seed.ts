import { randomBytes, scryptSync } from "node:crypto";
import {
  EquipmentType,
  PrismaClient,
  ServiceOrderPriority,
  ServiceOrderStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD antes de executar o seed.",
    );
  }

  await prisma.companySettings.upsert({
    where: { id: "company-default" },
    update: {},
    create: {
      id: "company-default",
      companyName: "Deyvid Infotech",
      legalName: "Deyvid Infotech Assistência Técnica",
      document: "00.000.000/0001-00",
      phone: "(11) 3333-2026",
      whatsapp: "(11) 99999-2026",
      instagram: "@deyvidinfotech",
      email: "contato@deyvidinfotech.local",
      address: "Av. Tecnologia, 256",
      city: "São Paulo",
      state: "SP",
      defaultWarrantyDays: 90,
      warrantyTerms:
        "A garantia cobre somente o serviço realizado. Não cobre mau uso, quedas, líquidos ou perda de dados. Este documento deve ser apresentado para solicitar a garantia.",
      serviceOrderLegalText:
        "A empresa não se responsabiliza por acessórios que não estejam descritos nesta ordem de serviço.",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Administrador Deyvid Infotech",
      passwordHash: hashPassword(adminPassword),
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      name: "Administrador Deyvid Infotech",
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      role: UserRole.ADMIN,
    },
  });

  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { document: "123.456.789-10" },
      update: {},
      create: {
        id: "customer-marina",
        name: "Marina Costa",
        document: "123.456.789-10",
        phone: "(11) 98811-2200",
        whatsapp: "(11) 98811-2200",
        email: "marina@example.local",
        address: "Rua das Flores, 120",
        city: "São Paulo",
        state: "SP",
      },
    }),
    prisma.customer.upsert({
      where: { document: "987.654.321-00" },
      update: {},
      create: {
        id: "customer-rafael",
        name: "Rafael Mendes",
        document: "987.654.321-00",
        phone: "(11) 97742-1010",
        whatsapp: "(11) 97742-1010",
        email: "rafael@example.local",
        city: "Osasco",
        state: "SP",
      },
    }),
    prisma.customer.upsert({
      where: { document: "45.678.901/0001-22" },
      update: {},
      create: {
        id: "customer-nova",
        name: "Nova Arquitetura Ltda.",
        document: "45.678.901/0001-22",
        phone: "(11) 3222-8800",
        whatsapp: "(11) 98800-1188",
        email: "ti@novaarquitetura.example",
        city: "Barueri",
        state: "SP",
      },
    }),
  ]);

  const equipment = await Promise.all([
    prisma.equipment.upsert({
      where: { id: "equipment-dell" },
      update: {},
      create: {
        id: "equipment-dell",
        customerId: customers[0].id,
        type: EquipmentType.NOTEBOOK,
        brand: "Dell",
        model: "Inspiron 15 5510",
        serialNumber: "DL-5510-2481",
        color: "Prata",
        deliveredAccessories: "Fonte original 65W",
        physicalCondition: "Marcas leves de uso na tampa",
        reportedDefect: "Desliga sozinho após alguns minutos de uso.",
      },
    }),
    prisma.equipment.upsert({
      where: { id: "equipment-samsung" },
      update: {},
      create: {
        id: "equipment-samsung",
        customerId: customers[1].id,
        type: EquipmentType.SMARTPHONE,
        brand: "Samsung",
        model: "Galaxy S22",
        serialNumber: "SM-S901B-1188",
        color: "Preto",
        deliveredAccessories: "Capa protetora",
        physicalCondition: "Tela sem trincas, riscos na lateral",
        reportedDefect: "Não reconhece o cabo de carregamento.",
      },
    }),
    prisma.equipment.upsert({
      where: { id: "equipment-lenovo" },
      update: {},
      create: {
        id: "equipment-lenovo",
        customerId: customers[2].id,
        type: EquipmentType.NOTEBOOK,
        brand: "Lenovo",
        model: "ThinkPad E14",
        serialNumber: "PF-3JX9-782",
        color: "Preto",
        deliveredAccessories: "Fonte e mochila",
        physicalCondition: "Bom estado geral",
        reportedDefect: "Sistema lento e aquecimento acima do normal.",
      },
    }),
  ]);

  const services = [
    {
      id: "service-cleaning",
      name: "Limpeza interna completa",
      category: "Limpeza interna",
      description: "Limpeza de placa, coolers, dissipadores e carcaça.",
      minimumValue: 120,
      maximumValue: 180,
      estimatedTime: "2 a 3 horas",
    },
    {
      id: "service-thermal",
      name: "Troca de pasta térmica",
      category: "Troca de pasta térmica",
      description: "Substituição da interface térmica do processador.",
      minimumValue: 80,
      maximumValue: 140,
      estimatedTime: "1 a 2 horas",
    },
    {
      id: "service-format",
      name: "Formatação e otimização",
      category: "Formatação",
      description: "Instalação limpa, drivers e atualizações.",
      minimumValue: 150,
      maximumValue: 250,
      estimatedTime: "4 a 8 horas",
    },
    {
      id: "service-part",
      name: "Troca de componente",
      category: "Troca de peças",
      description: "Diagnóstico e substituição de componente com teste.",
      minimumValue: 100,
      maximumValue: 450,
      estimatedTime: "Sob diagnóstico",
    },
    {
      id: "service-recovery",
      name: "Recuperação de arquivos",
      category: "Recuperação de arquivos",
      description: "Tentativa de recuperação lógica de dados.",
      minimumValue: 250,
      maximumValue: 850,
      estimatedTime: "1 a 5 dias úteis",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }

  const orders = [
    {
      id: "order-001",
      number: "OS-2026-000001",
      customerId: customers[0].id,
      equipmentId: equipment[0].id,
      status: ServiceOrderStatus.IN_ANALYSIS,
      priority: ServiceOrderPriority.HIGH,
      reportedDefect: equipment[0].reportedDefect,
      requestedService: "Diagnóstico completo e orçamento.",
      technicalDiagnosis: "Possível superaquecimento; testes térmicos em andamento.",
      serviceValue: 180,
      totalValue: 180,
      paidValue: 0,
      pendingValue: 180,
      expectedDeliveryDate: new Date("2026-08-03T15:00:00-03:00"),
      technicianId: admin.id,
    },
    {
      id: "order-002",
      number: "OS-2026-000002",
      customerId: customers[1].id,
      equipmentId: equipment[1].id,
      status: ServiceOrderStatus.READY_FOR_PICKUP,
      priority: ServiceOrderPriority.NORMAL,
      reportedDefect: equipment[1].reportedDefect,
      requestedService: "Reparo do conector USB-C.",
      technicalDiagnosis: "Conector danificado por oxidação leve.",
      performedService: "Substituição do conector e limpeza da placa.",
      partsUsed: "1 conector USB-C compatível",
      serviceValue: 180,
      partsValue: 90,
      totalValue: 270,
      paidValue: 270,
      pendingValue: 0,
      technicianId: admin.id,
    },
    {
      id: "order-003",
      number: "OS-2026-000003",
      customerId: customers[2].id,
      equipmentId: equipment[2].id,
      status: ServiceOrderStatus.IN_MAINTENANCE,
      priority: ServiceOrderPriority.URGENT,
      reportedDefect: equipment[2].reportedDefect,
      requestedService: "Limpeza, troca de pasta térmica e otimização.",
      technicalDiagnosis: "Cooler obstruído e SSD com pouco espaço livre.",
      serviceValue: 320,
      totalValue: 320,
      paidValue: 160,
      pendingValue: 160,
      expectedDeliveryDate: new Date("2026-08-01T18:00:00-03:00"),
      technicianId: admin.id,
    },
  ];

  for (const order of orders) {
    await prisma.serviceOrder.upsert({
      where: { number: order.number },
      update: order,
      create: order,
    });
  }

  const templates = [
    {
      eventKey: "equipment_received",
      name: "Equipamento recebido",
      content:
        "Olá, {nomeCliente}! Seu equipamento {equipamento} foi recebido com sucesso. Ordem: {numeroOS}.",
    },
    {
      eventKey: "budget_available",
      name: "Orçamento disponível",
      content:
        "Olá, {nomeCliente}! O orçamento da ordem {numeroOS} está disponível. Podemos iniciar o serviço?",
    },
    {
      eventKey: "service_started",
      name: "Serviço iniciado",
      content:
        "Olá, {nomeCliente}! O serviço do seu {equipamento} foi iniciado. Acompanhe pela ordem {numeroOS}.",
    },
    {
      eventKey: "ready_for_pickup",
      name: "Pronto para retirada",
      content:
        "Boa notícia, {nomeCliente}! Seu {equipamento} está pronto para retirada. Ordem: {numeroOS}.",
    },
    {
      eventKey: "thank_you",
      name: "Agradecimento",
      content:
        "Obrigado pela preferência, {nomeCliente}! A Deyvid Infotech está à disposição.",
    },
  ];

  for (const template of templates) {
    await prisma.messageTemplate.upsert({
      where: { eventKey: template.eventKey },
      update: template,
      create: template,
    });
  }

  await prisma.companySettings.update({
    where: { id: "company-default" },
    data: { nextServiceOrderNumber: 4 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
