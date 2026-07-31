import { PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { purchaseCategoryLabels } from "@/lib/constants";
import type { BusinessPurchaseView } from "@/types/domain";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function BusinessPurchaseList({
  purchases,
}: {
  purchases: BusinessPurchaseView[];
}) {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200/80 py-0 shadow-[0_10px_36px_rgb(15_23_42/0.05)]">
      <CardHeader className="border-b border-slate-100 px-4 py-5 sm:px-6">
        <CardTitle className="text-lg font-extrabold text-slate-900">
          Histórico de compras
        </CardTitle>
        <p className="text-sm text-slate-500">
          {purchases.length} {purchases.length === 1 ? "compra registrada" : "compras registradas"}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {purchases.length === 0 ? (
          <div className="grid min-h-64 place-items-center px-6 text-center">
            <div>
              <PackageOpen aria-hidden="true" className="mx-auto size-9 text-slate-300" />
              <h2 className="mt-3 text-sm font-bold text-slate-700">
                Nenhuma compra registrada
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Use o formulário para lançar o primeiro gasto.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead>Compra</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-center">Qtd.</TableHead>
                    <TableHead className="text-right">Valor gasto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <span className="block font-semibold text-slate-800">
                          {purchase.description}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {purchase.supplier || "Fornecedor não informado"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {purchaseCategoryLabels[purchase.category] ?? purchase.category}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(purchase.purchasedAt)}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {purchase.quantity}
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-red-600">
                        {formatCurrency(purchase.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {purchases.map((purchase) => (
                <article key={purchase.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-slate-800">
                        {purchase.description}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {purchaseCategoryLabels[purchase.category] ?? purchase.category}
                        {" · "}
                        {formatDate(purchase.purchasedAt)}
                      </p>
                    </div>
                    <strong className="shrink-0 text-sm tabular-nums text-red-600">
                      {formatCurrency(purchase.totalValue)}
                    </strong>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Quantidade: {purchase.quantity}
                    {purchase.supplier ? ` · ${purchase.supplier}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
