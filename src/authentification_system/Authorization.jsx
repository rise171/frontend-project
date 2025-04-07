import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import image1 from "../assets/img_1.png";
import image2 from "../assets/img_2.png";
import MyImage from "../assets/img.png";
import api from "../axios.jsx";
import { useUser } from "../../UserContext.jsx";

export default function Authorization() {
    const navigate = useNavigate();
    const { setUserId } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/user/login", {
                email,
                password
            });

            console.log("Full response:", response.data);

            // Получаем данные из ответа
            const { access_token } = response.data;

            // Проверяем наличие нужных данных
            if (!access_token || !access_token.user_id) {
                throw new Error("Неожиданный формат ответа от сервера");
            }

            // Сохраняем user_id в контекст
            setUserId(access_token.user_id);

            // Можно также сохранить сам токен в localStorage
            localStorage.setItem('authToken', access_token.access_token);

            // Переходим на защищенную страницу
            navigate("/main");

        } catch (err) {
            console.error("Login error:", err);
            const message = err.response?.data?.detail ||
                err.message ||
                "Ошибка входа. Проверьте данные.";
            setError(typeof message === "string" ? message : message.join("\n"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-block">
            <img src={image1} alt="" className="side-image" />
            <form className="roomie-form-registration" onSubmit={handleLogin}>
                <img src={MyImage} alt="" className="logo-auth" />
                <h2 className="form-title">Вход</h2>
                <input
                    type="email"
                    placeholder="Введите почту"
                    className="input-form"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    className="input-form"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                {error && (
                    <div className="error-message">
                        {error.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                )}
                <p className="form-text-p">Ещё нет аккаунта?</p>
                <p
                    className="transist-to-autorize"
                    onClick={() => !isLoading && navigate("/register")}
                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                    Зарегистрироваться
                </p>
                <button type="submit" disabled={isLoading}>
                    Войти
                </button>
            </form>
            <img src={image2} alt="" className="side-image" />
        </div>
    );
}