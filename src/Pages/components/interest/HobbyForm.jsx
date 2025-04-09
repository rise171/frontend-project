import React, { useEffect, useState } from "react";
import {
    List,
    Loader,
    Modal,
    Button,
    Message,
    useToaster,
    IconButton,
    Input,
    InputGroup
} from "rsuite";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const HobbyInterests = ({ show, onHide, interestId }) => {
    const [hobbies, setHobbies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: ''
    });

    const toaster = useToaster();

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                setLoading(true);
                const response = await api.get( `/interest/hobby/${interestId}`);
                setHobbies(response.data);
                setError(null);
            } catch (err) {
                setError("Ошибка загрузки хобби");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (show && interestId) {
            fetchHobbies();
        }
    }, [show, interestId]);

    const deleteHobby = async (hobby_id) => {
        try {
            await api.delete(`/interest/hobby/${hobby_id}`);
            toaster.push(
                <Message showIcon type="success">Хобби успешно удалено</Message>
            );
            setHobbies(hobbies.filter(hobby => hobby.id !== hobby_id));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при удалении хобби</Message>
            );
        }
    };

    const startEditing = (hobby) => {
        setEditingId(hobby.id);
        setEditForm({ name: hobby.name });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '' });
    };

    const handleEditChange = (value) => {
        setEditForm({ name: value });
    };

    const updateHobby = async (hobby_id) => {
        try {
            const response = await api.put(`/interest/hobby/${hobby_id}`, editForm);
            toaster.push(
                <Message showIcon type="success">Хобби успешно обновлено</Message>
            );
            setHobbies(hobbies.map(hobby =>
                hobby.id === hobby_id ? { ...hobby, name: editForm.name } : hobby
            ));
            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при обновлении хобби</Message>
            );
        }
    };

    if (loading) return <Loader center content="Загрузка..." />;
    if (error) return <Message showIcon type="error">{error}</Message>;
    if (!hobbies.length) return <Message showIcon type="info">Нет добавленных хобби</Message>;

    return (
        <Modal open={show} onClose={onHide}>
            <Modal.Header>
                <Modal.Title className="font-text">Мои хобби</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <List bordered>
                    {hobbies.map((hobby) => (
                        <List.Item key={hobby.id}>
                            {editingId === hobby.id ? (
                                <div style={{ padding: '10px' }}>
                                    <InputGroup>
                                        <Input
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            placeholder="Название хобби"
                                            className="font-text"
                                        />
                                    </InputGroup>
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                        <Button appearance="primary" onClick={() => updateHobby(hobby.id)}
                                                color="orange" className="font-text">
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
                                        <h5 className="font-text">{hobby.name}</h5>
                                    </div>
                                    <div>
                                        <IconButton
                                            circle
                                            icon={<FaEdit />}
                                            appearance="subtle"
                                            onClick={() => startEditing(hobby)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <IconButton
                                            circle
                                            icon={<FaRegTrashAlt />}
                                            color="red"
                                            appearance="subtle"
                                            onClick={() => deleteHobby(hobby.id)}
                                        />
                                    </div>
                                </div>
                            )}
                        </List.Item>
                    ))}
                </List>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" onClick={onHide} color="orange" className="font-text">
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

HobbyInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default HobbyInterests;