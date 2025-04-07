import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import image1 from "../assets/img_1.png";
import image2 from "../assets/img_2.png";
import MyImage from "../assets/img.png";
import api from "../axios.jsx";
import { useUser } from "../../UserContext.jsx";

export default function Authorization() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserId } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        console.log("data: ", {email, password});
        // Валидация полей перед отправкой
        if (!email.trim()) {
            setError("Email обязателен для заполнения");
            return;
        }

        if (!password.trim()) {
            setError("Пароль обязателен для заполнения");
            return;
        }

        setIsLoading(true);
        try {
            // Отправляем данные в формате, который ожидает сервер
            const response = await api.post("/user/login", {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Обработка успешного ответа
            if (response.data.id) {
                setUserId(response.data.id);
            }

            if (response.data.access) {
                // Сохраняем токен в headers и localStorage
                api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
                localStorage.setItem('accessToken', response.data.access);
            }

            navigate("/main");
        } catch (err) {
            // Улучшенная обработка ошибок
            if (err.response) {
                if (err.response.status === 422) {
                    // Обработка ошибок валидации
                    const errorData = err.response.data;
                    if (errorData.detail) {
                        if (Array.isArray(errorData.detail)) {
                            // Если ошибки в формате массива
                            const errorMessages = errorData.detail.map(e => e.msg);
                            setError(errorMessages.join('\n'));
                        } else if (typeof errorData.detail === 'string') {
                            // Если ошибка в виде строки
                            setError(errorData.detail);
                        }
                    } else {
                        setError("Ошибка валидации данных");
                    }
                } else {
                    // Другие ошибки сервера
                    setError(err.response.data?.message || "Неверный email или пароль");
                }
            } else {
                setError("Ошибка соединения с сервером");
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
                        {error.split('\n').map((line, i) => (
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
                    {isLoading ? "Вход..." : "Войти"}
                </button>
            </form>
            <img src={image2} alt="" className="side-image"/>
        </div>
    );
}