import MainSection from "@/components/MainSection";
import SideBar from "@/components/SideBar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex bg-[#F7F8FA]">
      <SideBar />
      <MainSection />
    </div>
  );
}
