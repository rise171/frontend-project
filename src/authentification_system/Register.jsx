import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import image1 from "../assets/img_1.png";
import image2 from "../assets/img_2.png";
import MyImage from "../assets/img.png";
import api from "../axios.jsx";
import {useUser} from "../../UserContext.jsx";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Стейт для ошибки
    const navigate = useNavigate();
    const { setUserId } = useUser();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        if (!username || !email || !password) {
            setError("Все поля должны быть заполнены");
            return;
        }
        try {
            const response = await api.post("/user/register", { username, email, password });
            setUserId(response.data.id);
            navigate("/main");
        } catch (err) {
            setError(err.response?.data?.detail || "Произошла ошибка при регистрации");
        }

        // Очистка формы
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="register-block">
            <img src={image1} alt="" className="side-image"/>
            <form className="roomie-form-registration" onSubmit={handleRegister}>
                <img src={MyImage} alt="" className="logo-auth"/>
                <h2 className="form-title">Регистрация</h2>
                <input
                    type="text"
                    placeholder="Введите имя"
                    className="input-form"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <p className="form-text-p">Уже зарегистрировались?</p>
                <p className="transist-to-autorize" onClick={() => navigate("/login")}>Войти в аккаунт</p>
                <button type="submit">Продолжить</button>
            </form>
            <img src={image2} alt="" className="side-image"/>
        </div>
    );
}