import { useEffect, useState } from "react";
import api from "../axios.jsx";
import Room from "./components/Room.jsx";
import VoidPage from "./components/VoidPage.jsx";
import { useUser } from "../../UserContext.jsx";
import "./MainPage.css";

export default function ContentSite() {
    const [roomId, setRoomId] = useState(null);
    const { userId } = useUser();

    useEffect(() => {
        const checkRoom = async () => {
            if (!userId) return; // Ждём загрузки userId

            try {
                const response = await api.get(`/rooms/${userId}`);
                if (response.data && Number.isInteger(response.data.id)) {
                    setRoomId(response.data.id);
                } else {
                    setRoomId(null);
                }
            } catch (error) {
                console.error("Ошибка при проверке комнаты", error);
                setRoomId(null);
            }
        };

        checkRoom();
    }, [userId]);

    return (
        <div className="main-content">
            {roomId ? <Room/> : <VoidPage />}
        </div>
    );
}