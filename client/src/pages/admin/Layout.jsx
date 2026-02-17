import React from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/adminComp/Sidebar";
import { useAppContext } from "../../context/AppContext";

function Layout() {
  // const navigate = useNavigate();

  const { axios, setToken, navigate } = useAppContext;

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 h-[70px] px:4 sm:px-12 border-b border-gray-200">
        <img
          src={assets.logo}
          alt=""
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          className="text-sm px-8 py-2 bg-red-500 text-white rounded-full cursor-pointer"
          onClick={() => navigate("/")}
        >
          Logout
        </button>
      </div>
      <div className="flex h-cal[calc(100vh-70px)]">
        {/* Sidebar */}
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
