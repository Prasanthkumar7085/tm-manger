import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className="p-3">
      <Outlet />
    </div>
  );
}

export default ContentSection;
