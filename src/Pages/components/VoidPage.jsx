import { useState, useEffect } from "react";
import ModalWindow from "./ModalWindow.jsx";
import { useUser } from "../../../UserContext.jsx";
import api from "../../axios.jsx";
import { toaster, Message } from "rsuite";
import Room from "./Room.jsx";

export default function VoidPage() {
    const [openModal, setOpenModal] = useState(false);
    const [interestId, setInterestId] = useState(null);
    const [showRoom, setShowRoom] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const {userId} = useUser();

    // Проверяем наличие интересов при загрузке
    useEffect(() => {
        const checkInterests = async () => {
            if (!userId || isChecking) return;

            setIsChecking(true);

            try {
                // 1. Получаем основной интерес пользователя
                const interestResponse = await api.get(`/interest/${userId}`);
                if (!interestResponse.data) {
                    setIsChecking(false);
                    return;
                }

                const currentInterestId = interestResponse.data.id;
                setInterestId(currentInterestId);

                // 2. Последовательно проверяем таблицы интересов
                const endpoints = [
                    `/interest/songs/${currentInterestId}`,
                    `/interest/cinema/${currentInterestId}`,
                    `/interest/games/${currentInterestId}`,
                    `/interest/sports/${currentInterestId}`,
                    `/interest/literature/${currentInterestId}`,
                    `/interest/hobby/${currentInterestId}`,
                    `/interest/persons/${currentInterestId}`,
                    `/interest/genres/${currentInterestId}`
                ];

                for (const endpoint of endpoints) {
                    try {
                        const response = await api.get(endpoint);
                        if (response.data?.length > 0) {
                            setShowRoom(true);
                            break; // Прерываем цикл при нахождении первого интереса
                        }
                    } catch (error) {
                        console.error(`Ошибка при проверке ${endpoint}`, error);
                        // Продолжаем проверку других таблиц при ошибке
                        continue;
                    }
                }
            } catch (error) {
                console.error("Ошибка при проверке интересов", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkInterests();
    }, [userId]);

    const handleOpenModal = async () => {
        try {
            const numUserId = parseInt(userId);
            const interestResponse = await api.post("/interest/", { user_id: numUserId });
            const createInterestId = interestResponse.data.id || interestResponse.data;
            setInterestId(createInterestId);
            setOpenModal(true);
        } catch (error) {
            console.error("Ошибка при создании комнаты или интересов", error);
            toaster.push(<Message type="error">Ошибка создания комнаты или интересов</Message>);
        }
    };

    if (isChecking) {
        return <div>Проверяем ваши интересы...</div>;
    }

    if (showRoom) {
        return <Room interestId={interestId} />;
    }

    return (
        <div className="voidpage-st">
            <h2>У вас еще пока нет комнаты =(</h2>
            {!openModal ? (
                <button onClick={handleOpenModal}>Создать</button>
            ) : (
                <ModalWindow
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                    interestId={interestId}
                    onInterestsAdded={() => setShowRoom(true)}
                />
            )}
        </div>
    );
}