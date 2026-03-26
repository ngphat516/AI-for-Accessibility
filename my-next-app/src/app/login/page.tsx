"use client";

import { signIn } from "next-auth/react";

function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <section className="login-box w-full max-w-[480px] flex flex-col items-center">
        <h1 className="login-title text-[25px] sm:text-[24px] font-extrabold text-black mb-6 text-center">
          {" "}
          NÓI ĐỂ ĐĂNG NHẬP HOẶC ĐĂNG KÝ{" "}
        </h1>

        <button
          className="login-btn w-full bg-gray-300 hover:bg-[#d1d1d1] text-black font-bold text-[18px] py-4 rounded-xl transition-colors duration-200 cursor-pointer "
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Tiếp tục với Google
        </button>

        <p className="login-hint mt-4 text-gray-500 text-[14px] font-medium text-center">
          Hoặc nhấn Ctrl + ? để đăng nhập hoặc đăng ký
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
