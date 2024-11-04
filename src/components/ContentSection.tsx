import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className="p-3 rounded-xl overflow-y-auto">
      <Outlet />
    </div>
  );
}

export default ContentSection;
