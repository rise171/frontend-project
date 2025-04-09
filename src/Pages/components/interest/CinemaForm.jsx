import React, { useEffect, useState } from "react";
import { List, Loader, Modal, Button, Message, useToaster, IconButton, Input, InputGroup } from "rsuite";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const CinemaInterests = ({ show, onHide, interestId }) => {
    const [cinema, setCinema] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        country: '',
        year: '',
        type: ''
    });
    const toaster = useToaster();

    const fetchCinema = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/interest/cinema/${interestId}`);
            setCinema(response.data);
            setError(null);
        } catch (err) {
            setError("Ошибка загрузки интересов в кино");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && interestId) {
            fetchCinema();
        }
    }, [show, interestId]);

    const deleteCinema = async (cinema_id) => {
        try {
            await api.delete(`/interest/cinema/${cinema_id}`);
            toaster.push(
                <Message showIcon type="success">
                    Фильм успешно удалён
                </Message>
            );
            setCinema(cinema.filter(film => film.id !== cinema_id));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">
                    Ошибка при удалении фильма
                </Message>
            );
        }
    };

    const startEditing = (film) => {
        setEditingId(film.id);
        setEditForm({
            name: film.name,
            country: film.country,
            year: film.year,
            type: film.type
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({
            name: '',
            country: '',
            year: '',
            type: ''
        });
    };

    const handleEditChange = (value, field) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateCinema = async (cinema_id) => {
        try {
            const response = await api.put(`/interest/cinema/${cinema_id}`, editForm);
            toaster.push(
                <Message showIcon type="success">
                    Фильм успешно обновлён
                </Message>
            );

            setCinema(cinema.map(film =>
                film.id === cinema_id ? { ...film, ...editForm } : film
            ));

            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">
                    Ошибка при обновлении фильма
                </Message>
            );
        }
    };

    if (!cinema.length) return <Message showIcon type="info">Нет добавленных фильмов и сериалов</Message>;

    return (
        <Modal open={show} onClose={onHide} size="md">
            <Modal.Header>
                <Modal.Title>Мои фильмы и сериалы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Loader center content="Загрузка..." />
                ) : error ? (
                    <Message showIcon type="error">{error}</Message>
                ) : (
                    <List bordered>
                        {cinema.map((film) => (
                            <List.Item key={film.id}>
                                {editingId === film.id ? (
                                    <div style={{ padding: '10px' }}>
                                        <InputGroup>
                                            <Input
                                                value={editForm.name}
                                                onChange={(value) => handleEditChange(value, 'name')}
                                                placeholder="Название"
                                            />
                                        </InputGroup>
                                        <InputGroup style={{ marginTop: '10px' }}>
                                            <Input
                                                value={editForm.country}
                                                onChange={(value) => handleEditChange(value, 'country')}
                                                placeholder="Страна"
                                            />
                                        </InputGroup>
                                        <InputGroup style={{ marginTop: '10px' }}>
                                            <Input
                                                value={editForm.year}
                                                onChange={(value) => handleEditChange(value, 'year')}
                                                placeholder="Год"
                                            />
                                        </InputGroup>
                                        <InputGroup style={{ marginTop: '10px' }}>
                                            <Input
                                                value={editForm.type}
                                                onChange={(value) => handleEditChange(value, 'type')}
                                                placeholder="Тип"
                                            />
                                        </InputGroup>
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                            <Button
                                                appearance="primary"
                                                onClick={() => updateCinema(film.id)}
                                            >
                                                Сохранить
                                            </Button>
                                            <Button
                                                appearance="subtle"
                                                onClick={cancelEditing}
                                            >
                                                Отмена
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h5>Название: {film.name}</h5>
                                            <p>{film.country}, {film.year}</p>
                                            <p>Тип: {film.type}</p>
                                        </div>
                                        <div>
                                            <IconButton
                                                circle
                                                icon={<FaEdit />}
                                                appearance="subtle"
                                                onClick={() => startEditing(film)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <IconButton
                                                circle
                                                icon={<FaRegTrashAlt />}
                                                color="red"
                                                appearance="subtle"
                                                onClick={() => deleteCinema(film.id)}
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
                <Button appearance="primary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

CinemaInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default CinemaInterests;