import React, { useEffect, useState } from "react";
import {List, Loader, Modal, Button, Message, useToaster, IconButton, Input, InputGroup} from "rsuite";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const SportsInterests = ({ show, onHide, interestId }) => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const toaster = useToaster();

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await api.get(`/interest/sports/${interestId}`);
                setSports(response.data);
                setError(null);
            } catch (error) {
                setError("Ошибка загрузки спортивных интересов");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (show && interestId) {
            fetchSports();
        }
    }, [show, interestId]);

    const deleteSports = async (sportId) => {
        try {
            await api.delete(`/interest/sports/${sportId}`);
            toaster.push(
                <Message showIcon type="success">Вид спорта удалён</Message>
            );
            setSports(sports.filter(s => s.id !== sportId));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при удалении</Message>
            );
        }
    };

    const startEditing = (sport) => {
        setEditingId(sport.id);
        setEditName(sport.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName("");
    };

    const updateSport = async (sportId) => {
        try {
            await api.put(`/interest/sports/${sportId}`, { name: editName });
            toaster.push(
                <Message showIcon type="success">Интерес обновлён</Message>
            );
            setSports(sports.map(s => s.id === sportId ? { ...s, name: editName } : s));
            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при обновлении</Message>
            );
        }
    };

    if (loading) return <Loader center content="Загрузка..." />;
    if (error) return <Message showIcon type="error">{error}</Message>;
    if (!sports.length) return <Message showIcon type="info">Нет добавленных видов спорта</Message>;

    return (
        <Modal open={show} onClose={onHide}>
            <Modal.Header>
                <Modal.Title className="font-text">Мои спортивные интересы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <List bordered>
                    {sports.map((sport) => (
                        <List.Item key={sport.id}>
                            {editingId === sport.id ? (
                                <div>
                                    <InputGroup style={{ marginBottom: 10 }} className="font-text">
                                        <Input
                                            value={editName}
                                            onChange={value => setEditName(value)}
                                            placeholder="Название спорта"
                                        />
                                    </InputGroup>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <Button appearance="primary" onClick={() => updateSport(sport.id)}
                                                className="font-text" color="orange">Сохранить</Button>
                                        <Button appearance="subtle" onClick={cancelEditing} className="font-text">Отмена</Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h5 className="font-text">{sport.name}</h5>
                                    <div>
                                        <IconButton
                                            icon={<FaEdit />}
                                            appearance="subtle"
                                            onClick={() => startEditing(sport)}
                                            style={{ marginRight: 8 }}
                                        />
                                        <IconButton
                                            circle
                                            icon={<FaRegTrashAlt />}
                                            color="red"
                                            appearance="subtle"
                                            onClick={() => deleteSports(sport.id)}
                                        />
                                    </div>
                                </div>
                            )}
                        </List.Item>
                    ))}
                </List>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" onClick={onHide} className="font-text" color="orange">
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

SportsInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default SportsInterests;