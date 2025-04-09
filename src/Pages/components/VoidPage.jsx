import { useState } from "react";
import ModalWindow from "./ModalWindow.jsx";
import { useUser } from "../../../UserContext.jsx";
import api from "../../axios.jsx";
import {useToaster, Message, Button} from "rsuite";
import PropTypes from "prop-types";
import "./VoidPage.css";

export default function VoidPage({ onRoomCreated }) {
    const [openModal, setOpenModal] = useState(false);
    const [interestId, setInterestId] = useState(null);
    const { userId } = useUser();

    const toaster = useToaster();

    const handleOpenModal = async () => {
        try {
            const numUserId = parseInt(userId);
            const interestResponse = await api.post("/interest/", { user_id: numUserId });
            const createInterestId = interestResponse.data.id || interestResponse.data;
            setInterestId(createInterestId);
            setOpenModal(true);
        } catch (error) {
            console.error("Ошибка при создании комнаты", error);
            toaster.push(<Message type="error">Ошибка создания комнаты</Message>);
        }
    };

    const handleSave = async () => {
        try {
            // После сохранения проверяем, создалась ли комната
            const response = await api.get(`/interest/${userId}`);
            if (response.data?.id) {
                onRoomCreated(response.data.id);
                setOpenModal(false);
            } else {
                toaster.push(<Message type="error">Не удалось создать комнату</Message>);
            }
        } catch (error) {
            console.error("Ошибка при сохранении", error);
            toaster.push(<Message type="error">Ошибка при сохранении</Message>);
        }
    };

    return (
        <div className="voidpage-st">
            {!openModal ? (
                <>
                    <h2 className="voidpage-font">У вас еще пока нет комнаты =(</h2>
                    <Button onClick={handleOpenModal} className="voidpage-font" color="orange" appearance="primary">Создать</Button>
                </>
            ) : (
                <ModalWindow
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                    onSave={handleSave}
                    interestId={interestId}
                />
            )}
        </div>
    );
}

VoidPage.propTypes = {
    onRoomCreated: PropTypes.func.isRequired,
};