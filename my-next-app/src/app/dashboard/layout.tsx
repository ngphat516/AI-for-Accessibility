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
      
      <Navbar/>

        <header className ="chat-navbar">
            <h2 className="chat-tite">TIÊU ĐỀ CHAT</h2>
            <button className="btn-logout">THOÁT TÀI KHOẢN</button>
        </header>


      <div className="main-content-wrapper">

        <div className="left-content"> 

          {children} 

           <div className="left-input">
              <input className="input-style" placeholder="NHẬP"/>
           </div>


        </div>



        <div className="right-sidebar">

         <div className="note-wrapper">
        
                <div className="header-note">
                   <h4 className="right-note">GHI CHÚ</h4>
                   <input className="note-search" placeholder="TÌM KIẾM"/>
                   <button  className="note-filter">LỌC</button>
            
                </div>

                <div className="note-content">
                  <div className="note-content-header">
                      <h3 className="title">TIÊU ĐỀ</h3>
                      <button className="fix">CHỈNH SỬA</button>
                      <button className="delete">XÓA</button>
                  </div>
                  
                  <h4 className="belong-to">THUỘC VỀ ĐOẠN CHAT NÀO</h4>
                  <h4 className="start-date">NGÀY TẠO</h4>
                  <button className="note-link">LINK</button>
                </div>


         </div>


        </div>

       

      </div>

       


        <Footer/>
    </div>
  );
}

export default DashboardLayout;
