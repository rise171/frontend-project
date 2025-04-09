import React, { useEffect, useState } from "react";
import { List, Loader, Modal, Button, Message, useToaster, IconButton, Input, InputGroup } from "rsuite";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const GamesInterests = ({ show, onHide, interestId }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        game_type: ''
    });
    const toaster = useToaster();

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/interest/games/${interestId}`);
            setGames(response.data);
            setError(null);
        } catch (err) {
            setError("Ошибка загрузки игровых интересов");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && interestId) {
            fetchGames();
        }
    }, [show, interestId]);

    const deleteGame = async (game_id) => {
        try {
            await api.delete(`/interest/games/${game_id}`);
            toaster.push(
                <Message showIcon type="success">
                    Игра успешно удалена
                </Message>
            );
            setGames(games.filter(game => game.id !== game_id));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">
                    Ошибка при удалении игры
                </Message>
            );
        }
    };

    const startEditing = (game) => {
        setEditingId(game.id);
        setEditForm({
            name: game.name,
            game_type: game.game_type || game.type // Поддержка обоих вариантов названия поля
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({
            name: '',
            game_type: ''
        });
    };

    const handleEditChange = (value, field) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateGame = async (game_id) => {
        try {
            // Отправляем данные на сервер
            const response = await api.put(`/interest/games/${game_id}`, editForm);

            toaster.push(
                <Message showIcon type="success">
                    Игра успешно обновлена
                </Message>
            );

            // Обновляем локальное состояние
            setGames(games.map(game =>
                game.id === game_id ? {
                    ...game,
                    name: editForm.name,
                    type: editForm.game_type,
                    game_type: editForm.game_type // Для совместимости
                } : game
            ));

            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">
                    Ошибка при обновлении игры
                </Message>
            );
        }
    };

    if (!games.length) return <Message showIcon type="info">Нет добавленных игр</Message>;

    return (
        <Modal open={show} onClose={onHide} size="md">
            <Modal.Header>
                <Modal.Title className="font-text">Мои игры</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Loader center content="Загрузка..." />
                ) : error ? (
                    <Message showIcon type="error">{error}</Message>
                ) : (
                    <List bordered>
                        {games.map((game) => (
                            <List.Item key={game.id}>
                                {editingId === game.id ? (
                                    <div style={{ padding: '10px' }}>
                                        <InputGroup>
                                            <Input
                                                value={editForm.name}
                                                onChange={(value) => handleEditChange(value, 'name')}
                                                placeholder="Название игры"
                                            />
                                        </InputGroup>
                                        <InputGroup style={{ marginTop: '10px' }}>
                                            <Input
                                                value={editForm.game_type}
                                                onChange={(value) => handleEditChange(value, 'game_type')}
                                                placeholder="Тип игры (настольная/компьютерная/мобильная)"
                                            />
                                        </InputGroup>
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                            <Button appearance="primary" onClick={() => updateGame(game.id)} className="font-text" color="orange">
                                                Сохранить
                                            </Button>
                                            <Button appearance="subtle" onClick={cancelEditing} className="font-text">
                                                Отмена
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h5 className="font-text">Название: {game.name}</h5>
                                            <p className="font-text">Тип: {game.game_type || game.type}</p>
                                        </div>
                                        <div>
                                            <IconButton
                                                circle
                                                icon={<FaEdit />}
                                                appearance="subtle"
                                                onClick={() => startEditing(game)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <IconButton
                                                circle
                                                icon={<FaRegTrashAlt />}
                                                color="red"
                                                appearance="subtle"
                                                onClick={() => deleteGame(game.id)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </List.Item>
                        ))}
                    </List>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" onClick={onHide} className="font-text" color="orange">
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

GamesInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default GamesInterests;