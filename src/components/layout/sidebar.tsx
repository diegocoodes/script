import { BrandMark } from "@/components/layout/brand-mark";
import { Navigation } from "@/components/layout/navigation";

export function Sidebar() {
  return (
    <aside className="app-sidebar sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-[#020817] px-4 py-5 md:flex">
      <BrandMark className="px-2 pb-7" />
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <Navigation />
      </div>
    </aside>
  );
}
