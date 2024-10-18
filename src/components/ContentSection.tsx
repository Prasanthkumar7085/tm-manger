import { Outlet } from "@tanstack/react-router";

function ContentSection() {
  return (
    <div className=" bg-white h-full p-5 rounded-xl bg-#8080801f ">
      <Outlet />
    </div>
  );
}

export default ContentSection;
