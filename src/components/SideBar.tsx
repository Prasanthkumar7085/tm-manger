import Logo from "./Logo";
import SideMenu from "./SideMenu";

function SideBar() {
  return (
    <div className="w-[15%] p-4 border bg-white border-box">
      <Logo />
      <SideMenu />
    </div>
  );
}

export default SideBar;
