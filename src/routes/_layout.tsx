import MainSection from "@/components/MainSection";
import SideBar from "@/components/SideBar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <MainSection />
    </div>
  );
}
