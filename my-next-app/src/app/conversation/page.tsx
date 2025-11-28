import "./conversation.css";

export default function ConversationPage(){
    return(
        <div className="conversation-wrapper">

            <div className="conversation-bar">
                <h2>TIÊU ĐỀ CHAT</h2>
            </div>

            <div className="conversation-main">
                {/* Nội dung chat */}
            </div>

            <div className="conversation-input-row">
                <div className="input-wrapper">
                    <input 
                        type="text"
                        className="conversation-text"
                        placeholder="NHẬP"
                    />

                    <button className="conversation-btn">
                        TỔ HỢP PHÍM RUN
                    </button>
                </div>
            </div>

        </div>
    )
}
