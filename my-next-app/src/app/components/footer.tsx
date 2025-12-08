"use client";
import './footer.css'

function Footer() {

  const toggleRightPanel = () => {
    window.dispatchEvent(new Event("toggle-right-panel"));
  };

  const openHelp = () => {
    window.dispatchEvent(new Event("toggle-help-modal"))
  }

  return (
    <div className="footer-wrapper">
      <div className="left-buttons">
        <button className="btn" onClick={openHelp}>HƯỚNG DẪN</button>
        <button className="btn mic">MIC</button>

        <button className="btn" onClick={toggleRightPanel}>
          GHI CHÚ
        </button>
      </div>

      <button className="btn">BÁO CÁO TẠI ĐÂY</button>
    </div>
  );
}

export default Footer;
