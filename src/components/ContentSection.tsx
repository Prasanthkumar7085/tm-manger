import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className="p-5 rounded-xl overflow-y-auto ">
      <Outlet />
    </div>
  );
}

export default ContentSection;
