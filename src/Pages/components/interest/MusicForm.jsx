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
import "./Interest.css";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

const MusicInterests = ({ show, onHide, interestId }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', author: '' });

    const toaster = useToaster();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/interest/songs/${interestId}`);
                setSongs(response.data);
                setError(null);
            } catch (err) {
                setError("Ошибка загрузки музыкальных интересов");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (show && interestId) {
            fetchSongs();
        }
    }, [show, interestId]);

    const deleteMusic = async (song_id) => {
        try {
            await api.delete(`/interest/songs/${song_id}`);
            toaster.push(
                <Message showIcon type="success">Песня успешно удалена</Message>
            );
            setSongs(songs.filter(song => song.id !== song_id));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при удалении песни</Message>
            );
        }
    };

    const startEditing = (song) => {
        setEditingId(song.id);
        setEditForm({ name: song.name, author: song.author });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '', author: '' });
    };

    const handleEditChange = (value, field) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const updateSong = async (song_id) => {
        try {
            await api.put(`/interest/songs/${song_id}`, editForm);
            toaster.push(
                <Message showIcon type="success">Песня успешно обновлена</Message>
            );
            setSongs(songs.map(song =>
                song.id === song_id ? { ...song, ...editForm } : song
            ));
            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при обновлении песни</Message>
            );
        }
    };

    if (loading) return <Loader center size="lg" />;
    if (error) return <Message showIcon type="error">{error}</Message>;
    if (!songs.length) return <Message showIcon type="info">Нет любимых песен</Message>;

    return (
        <Modal open={show} onClose={onHide} size="md">
            <Modal.Header>
                <Modal.Title className="font-text">Моя музыка</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <List bordered>
                    {songs.map((song) => (
                        <List.Item key={song.id}>
                            {editingId === song.id ? (
                                <div style={{ padding: '10px' }}>
                                    <InputGroup style={{ marginBottom: '10px' }} className="font-text">
                                        <Input
                                            value={editForm.name}
                                            onChange={(val) => handleEditChange(val, 'name')}
                                            placeholder="Название песни"
                                        />
                                    </InputGroup>
                                    <InputGroup style={{ marginBottom: '10px' }} className="font-text">
                                        <Input
                                            value={editForm.author}
                                            onChange={(val) => handleEditChange(val, 'author')}
                                            placeholder="Исполнитель"
                                        />
                                    </InputGroup>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button appearance="primary" onClick={() => updateSong(song.id)}
                                                className="font-text" color="orange">Сохранить</Button>
                                        <Button appearance="subtle" onClick={cancelEditing} className="font-text">Отмена</Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 className="font-text">Название: {song.name}</h4>
                                        <p className="font-text">Исполнитель: {song.author}</p>
                                    </div>
                                    <div>
                                        <IconButton
                                            circle
                                            icon={<FaEdit />}
                                            appearance="subtle"
                                            onClick={() => startEditing(song)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <IconButton
                                            circle
                                            icon={<FaRegTrashAlt />}
                                            color="red"
                                            appearance="subtle"
                                            onClick={() => deleteMusic(song.id)}
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

MusicInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

export default MusicInterests;