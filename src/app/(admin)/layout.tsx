import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell min-h-screen bg-[#f5f7fb] md:grid md:grid-cols-[264px_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <Topbar />
        <main
          id="conteudo-principal"
          className="app-content mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
