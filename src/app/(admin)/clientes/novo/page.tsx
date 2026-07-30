import type { Metadata } from "next";
import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Novo cliente" };

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clientes"
        title="Cadastrar cliente"
        description="Preencha os dados de identificação e contato. Os campos com asterisco são obrigatórios."
      />
      <CustomerForm />
    </>
  );
}
