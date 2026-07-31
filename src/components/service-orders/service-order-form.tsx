"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Laptop,
  LoaderCircle,
  Save,
  Signature,
  UserRound,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FieldPath } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CustomerForm } from "@/components/customers/customer-form";
import {
  CustomerStep,
  EquipmentStep,
  ProblemStep,
  ScheduleStep,
  SignaturesStep,
  ValuesStep,
} from "@/components/service-orders/order-form-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  serviceOrderSchema,
  type ServiceOrderInput,
} from "@/schemas/service-order";
import type { CustomerView } from "@/types/domain";

const steps = [
  {
    title: "Cliente",
    description: "Responsável pelo atendimento",
    icon: UserRound,
  },
  {
    title: "Equipamento",
    description: "Item recebido na assistência",
    icon: Laptop,
  },
  {
    title: "Serviço",
    description: "Problema, diagnóstico e execução",
    icon: Wrench,
  },
  {
    title: "Valores",
    description: "Custos e pagamento",
    icon: CircleDollarSign,
  },
  {
    title: "Prazos",
    description: "Datas, status e prioridade",
    icon: ClipboardCheck,
  },
  {
    title: "Assinaturas",
    description: "Confirmação das partes",
    icon: Signature,
  },
] as const;

const stepFields: Array<Array<FieldPath<ServiceOrderInput>>> = [
  ["customerId"],
  ["equipmentName", "equipmentDescription"],
  ["reportedDefect", "requestedService"],
  ["serviceValue", "partsValue", "discount", "surcharge", "paidValue"],
  ["entryDate", "status", "priority"],
  ["clientSignature", "technicianSignature"],
];

export function ServiceOrderForm({
  initialCustomers,
  initialCustomerId,
  today,
  expectedDate,
}: {
  initialCustomers: CustomerView[];
  initialCustomerId?: string;
  today: string;
  expectedDate: string;
}) {
  const router = useRouter();
  const validInitialCustomerId = initialCustomers.some(
    (customer) => customer.id === initialCustomerId,
  )
    ? initialCustomerId
    : undefined;
  const [currentStep, setCurrentStep] = useState(
    validInitialCustomerId ? 1 : 0,
  );
  const [customers, setCustomers] = useState(initialCustomers);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ServiceOrderInput>({
    resolver: zodResolver(serviceOrderSchema),
    mode: "onTouched",
    defaultValues: {
      customerId: validInitialCustomerId ?? "",
      equipmentName: "",
      equipmentDescription: "",
      reportedDefect: "",
      technicalDiagnosis: "",
      requestedService: "",
      performedService: "",
      partsUsed: "",
      internalNotes: "",
      customerNotes: "",
      serviceValue: 0,
      partsValue: 0,
      discount: 0,
      surcharge: 0,
      paidValue: 0,
      paymentMethod: "",
      entryDate: today,
      expectedDeliveryDate: expectedDate,
      completedAt: "",
      pickedUpAt: "",
      technicianName: "",
      status: "RECEIVED",
      priority: "NORMAL",
      clientSignature: "",
      technicianSignature: "",
    },
  });
  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!form.formState.isDirty) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [form.formState.isDirty]);

  async function nextStep() {
    const isValid = await form.trigger(stepFields[currentStep], {
      shouldFocus: true,
    });
    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }
  }

  async function submit(input: ServiceOrderInput) {
    setServerError(null);
    try {
      const response = await fetch("/api/service-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as {
        id?: string;
        number?: string;
        message?: string;
      };

      if (!response.ok || !result.id) {
        throw new Error(
          result.message ?? "Não foi possível criar a ordem de serviço.",
        );
      }

      toast.success(`${result.number ?? "Ordem"} criada com sucesso.`);
      form.reset(input);
      router.push(`/ordens-servico/${result.id}`);
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a ordem de serviço.",
      );
    }
  }

  function addCustomer(customer: { id: string; name: string }) {
    const newCustomer: CustomerView = {
      id: customer.id,
      name: customer.name,
      document: null,
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      city: null,
      state: null,
      notes: null,
      equipmentCount: 0,
      orderCount: 0,
      latestOrderId: null,
      latestOrderNumber: null,
      createdAt: new Date().toISOString(),
    };
    setCustomers((items) => [...items, newCustomer]);
    form.setValue("customerId", customer.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("equipmentName", "");
    form.setValue("equipmentDescription", "");
    setCustomerDialogOpen(false);
    setCurrentStep(1);
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <>
      <Card className="overflow-hidden border-slate-200/80 py-0 shadow-[0_12px_40px_rgb(15_23_42/0.05)]">
        <CardHeader className="border-b border-slate-100 bg-white px-4 py-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between text-xs">
            <span className="font-bold text-blue-700">
              Etapa {currentStep + 1} de {steps.length}
            </span>
            <span className="text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% preenchido
            </span>
          </div>
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-1.5"
          />
          <ol
            aria-label="Etapas da ordem de serviço"
            className="mt-5 grid grid-cols-6 gap-1 sm:gap-2"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === currentStep;
              const completed = index < currentStep;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index <= currentStep) setCurrentStep(index);
                    }}
                    disabled={index > currentStep}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 text-left transition-colors sm:justify-start",
                      active && "bg-blue-50 text-blue-700",
                      completed && "text-emerald-700 hover:bg-emerald-50",
                      !active && !completed && "text-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-lg",
                        active && "bg-blue-600 text-white",
                        completed && "bg-emerald-100 text-emerald-700",
                        !active && !completed && "bg-slate-100",
                      )}
                    >
                      {completed ? (
                        <Check aria-hidden="true" className="size-3.5" />
                      ) : (
                        <Icon aria-hidden="true" className="size-3.5" />
                      )}
                    </span>
                    <span className="hidden 2xl:block">
                      <span className="block text-[11px] font-bold">
                        {step.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={form.handleSubmit(submit)} noValidate>
            <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white">
                  <StepIcon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-[360px] px-4 py-6 sm:px-6">
              {serverError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {serverError}
                </div>
              )}

              {currentStep === 0 && (
                <CustomerStep
                  form={form}
                  customers={customers}
                  onAdd={() => setCustomerDialogOpen(true)}
                />
              )}
              {currentStep === 1 && <EquipmentStep form={form} />}
              {currentStep === 2 && <ProblemStep form={form} />}
              {currentStep === 3 && <ValuesStep form={form} />}
              {currentStep === 4 && <ScheduleStep form={form} />}
              {currentStep === 5 && <SignaturesStep form={form} />}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setCurrentStep((step) => Math.max(step - 1, 0))
                }
                disabled={currentStep === 0}
                className="min-h-10"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Etapa anterior
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="min-h-10 px-4"
                >
                  Continuar
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="min-h-10 px-4"
                >
                  {form.formState.isSubmitting ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <Save aria-hidden="true" className="size-4" />
                  )}
                  {form.formState.isSubmitting
                    ? "Criando ordem…"
                    : "Salvar e abrir ordem"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cadastrar cliente</DialogTitle>
            <DialogDescription>
              O novo cliente será selecionado automaticamente nesta ordem.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            compact
            onCreated={addCustomer}
            onCancel={() => setCustomerDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
