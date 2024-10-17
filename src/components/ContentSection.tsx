import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className="mb-4 mr-4 bg-white h-full p-5 overflow-scroll rounded-xl">
      <Outlet />
    </div>
  )
}

export default ContentSection