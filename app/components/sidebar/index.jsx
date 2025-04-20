"use client";
import { PiSignOut } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdManageHistory } from "react-icons/md";
import axios from "axios";
import { useAuth } from "@/app/context/authContext";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { Modal, Button } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { TiWeatherDownpour } from "react-icons/ti";


const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = () => {
    setIsModalOpen(true); // Show the modal first
  };

  const confirmSignOut = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/sign-out");
      if (res.status === 200) {
        logout();
        router.push("/");
      } else {
        toast.error("Sign out failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Sign out failed");
    } finally {
      setIsModalOpen(false);
    }
  };

  const routes = [
    { id: 1, name: "overview", icon: <LuLayoutDashboard />, path: "/admin" },
    {
      id: 2,
      name: "create-task",
      icon: <MdOutlineCreateNewFolder />,
      path: "/admin/create-task",
    },
    {
      id: 3,
      name: "manage-task",
      icon: <MdManageHistory />,
      path: "/admin/manage-task",
    },
 ];

  return (
    <div className=" w-[250px] max-w-[250px] py-2 flex items-center justify-between gap-8 flex-col min-h-full fixed top-0 bg-[#192735]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="w-[200px] text-center"
      />
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3 ">
          <TiWeatherDownpour size={30} color="white" />
          <h1 className="text-white font-bold text-2xl">Weather forecast</h1>
        </div>
        <span className="h-1 bg-[#443227] w-full"></span>
        <ul className="space-y-4">
          {routes.map((route) => (
            <li
              key={route.id}
              onClick={() => router.push(route.path)}
              className={`${
                pathName === route.path
                  ? "bg-white text-[#443227]"
                  : "text-white bg-transparent"
              } flex gap-3 items-center capitalize cursor-pointer hover:bg-[#443227] hover:text-white px-4 p-2 rounded-md transition-all duration-300 delay-150`}
            >
              <span className="text-2xl">{route.icon}</span> {route.name}
            </li>
          ))}
        </ul>
      </div>
      <div
        onClick={handleSignOut}
        className="flex items-center gap-3 text-white capitalize cursor-pointer hover:bg-[#443227] hover:text-white px-4 p-2 rounded-md transition-all duration-300 delay-150"
      >
        <PiSignOut className="text-2xl" />
        <button>sign out</button>
      </div>

      {/* Ant Design Modal for Sign Out Confirmation */}
      <Modal
        title="Are you sure you want to sign out?"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={confirmSignOut}
        okText="Sign Out"
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: "#e57226", borderColor: "#e57226" },
        }}
      >
        <p>By signing out, you'll be logged out of your account.</p>
      </Modal>
    </div>
  );
};

export default Sidebar;