import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className=" bg-white p-5 rounded-xl bg-[#8080801f] overflow-y-auto">
      <Outlet />
    </div>
  );
}

export default ContentSection;
