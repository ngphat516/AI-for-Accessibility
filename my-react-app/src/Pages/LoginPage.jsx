import LoginLayout from 'LoginLayout.jsx'


function LoginPage(){

    return(
        <LoginLayout className="login-container">
        
        <section className="login-box">

            <h1 id ="login-title" > NÓI ĐỂ ĐĂNG NHẬP HOẶC ĐĂNG KÝ </h1>

            <button className = "login-btn"> Tiếp tục với Google </button>

            <p className = "login-hint">Hoặc nhấn Ctrl + ? để đăng nhập hoặc đăng ký</p>
        </section>
    
        </LoginLayout>
        
    )

}

export default LoginPage;