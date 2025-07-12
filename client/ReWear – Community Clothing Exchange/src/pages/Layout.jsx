import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="pt-20 px-4">
        {" "}
        {/* Push content below fixed navbar */}
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
