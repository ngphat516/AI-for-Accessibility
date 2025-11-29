import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex-1 ">{children}</div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
}
