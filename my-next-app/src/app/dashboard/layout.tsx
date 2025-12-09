// import "./Layout.css";

import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer"
import './dashboard.css'
interface DashboardLayout {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayout) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex-1 flex flex-col pb-[72px] min-h-0">{children}</div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer/>
      </div>
    </div>
  );
}

export default DashboardLayout;
