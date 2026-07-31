import { redirect } from "next/navigation";

export default function WarrantiesPage() {
  redirect("/clientes?documento=garantia");
}
