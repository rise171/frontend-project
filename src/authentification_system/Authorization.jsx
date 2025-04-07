import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios.jsx";  // Импортируем настроенный axios-клиент
import "./AuthForm.css";
import image1 from "../assets/img_1.png";
import image2 from "../assets/img_2.png";
import MyImage from "../assets/img.png";

export default function Authorization() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Все поля должны быть заполнены");
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.post("/user/login/", { email, password });

            // Сохраняем токен в axios для автоматической подстановки в заголовки
            api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

            // Перенаправляем на главную
            navigate("/main");
        } catch (err) {
            // Обрабатываем разные типы ошибок
            if (err.response) {
                // Ошибка от сервера (4xx, 5xx)
                setError(err.response.data.detail || "Неверный email или пароль");
            } else if (err.request) {
                // Запрос был отправлен, но ответа не получено
                setError("Сервер не отвечает");
            } else {
                // Ошибка при настройке запроса
                setError("Ошибка при отправке запроса");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-block">
            <img src={image1} alt="" className="side-image"/>
            <form className="roomie-form-registration" onSubmit={handleLogin}>
                <img src={MyImage} alt="" className="logo-auth"/>
                <h2 className="form-title">Авторизация</h2>
                <input
                    type="email"
                    placeholder="Введите почту"
                    className="input-form"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    className="input-form"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                {error && <p className="error-message">{error}</p>}
                <p className="form-text-p">Не зарегистрированы?</p>
                <p
                    className="transist-to-autorize"
                    onClick={() => !isLoading && navigate("/register")}
                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                    Создать аккаунт
                </p>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Вход..." : "Войти"}
                </button>
            </form>
            <img src={image2} alt="" className="side-image"/>
        </div>
    );
}