import './conversation.css';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
export default function ConversationLayout(
    {
    children,}:{
        children: React.ReactNode
    }
)
{
    return(
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar/>
                <div className="flex-1 min-h-0 flex flex-col">
                     {children}
                </div>
            <Footer/>
        </div>
    )
}