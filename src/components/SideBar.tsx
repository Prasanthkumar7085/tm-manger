import Logo from "./Logo";
import SideMenu from "./SideMenu";

function SideBar() {
  return (
    <div className="w-[18%] m-4 rounded-xl bg-white">
      <Logo />
      <SideMenu />
    </div>
  );
}

export default SideBar;
