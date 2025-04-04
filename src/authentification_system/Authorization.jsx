import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import image1 from "../assets/img_1.png";
import image2 from "../assets/img_2.png";
import MyImage from "../assets/img.png";

export default function Authorization() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Стейт для ошибки
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Сбрасываем ошибку перед новым запросом

        // Проверка на пустые значения
        if (!email || !password) {
            setError("Все поля должны быть заполнены");
            return;
        }

        // Проверка, существует ли такой пользователь
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = existingUsers.find(user => user.email === email);

        if (!user) {
            setError("Пользователь не найден");
            return;
        }

        // Проверка пароля
        if (user.password !== password) {
            setError("Неверный пароль");
            return;
        }

        // Очистка полей
        setEmail('');
        setPassword('');

        navigate("/");
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
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    className="input-form"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>} {/* Отображаем ошибку, если она есть */}
                <p className="form-text-p">Не зарегистрированы?</p>
                <p className="transist-to-autorize" onClick={() => navigate("/register")}>Создать аккаунт</p>
                <button type="submit">Войти</button>
            </form>
            <img src={image2} alt="" className="side-image"/>
        </div>
    );
}