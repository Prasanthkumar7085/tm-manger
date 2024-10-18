import Logo from "./Logo";
import SideMenu from "./SideMenu";

function SideBar() {
  return (
    <div className="w-[15%]  p-4 border-r bg-white box-border">
      <Logo />
      <SideMenu />
    </div>
  );
}

export default SideBar;
