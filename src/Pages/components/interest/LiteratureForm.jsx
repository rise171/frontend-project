import React, { useEffect, useState } from "react";
import {
    List,
    Loader,
    Notification,
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

const LiteratureInterests = ({ show, onHide, interestId }) => {
    const [literature, setLiterature] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        author: '',
        type: ''
    });

    const toaster = useToaster();

    useEffect(() => {
        const fetchLiterature = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/interest/literature/${interestId}`);
                setLiterature(response.data);
                setError(null);
            } catch (err) {
                setError("Ошибка загрузки литературы");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (show && interestId) {
            fetchLiterature();
        }
    }, [show, interestId]);

    const deleteLiterature = async (literature_id) => {
        try {
            await api.delete(`/interest/literature/${literature_id}`);
            toaster.push(
                <Message showIcon type="success">Книга успешно удалена</Message>
            );
            setLiterature(literature.filter(lit => lit.id !== literature_id));
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при удалении книги</Message>
            );
        }
    };

    const startEditing = (book) => {
        setEditingId(book.id);
        setEditForm({
            name: book.name,
            author: book.author,
            type: book.type
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '', author: '', type: '' });
    };

    const handleEditChange = (value, field) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const updateLiterature = async (book_id) => {
        try {
            await api.put(`/interest/literature/${book_id}`, editForm);
            toaster.push(
                <Message showIcon type="success">Книга успешно обновлена</Message>
            );
            setLiterature(literature.map(book =>
                book.id === book_id ? { ...book, ...editForm } : book
            ));
            cancelEditing();
        } catch (error) {
            console.error(error);
            toaster.push(
                <Message showIcon type="error">Ошибка при обновлении книги</Message>
            );
        }
    };

    if (loading) return <Loader center content="Загрузка..." />;
    if (error) return <Notification type="error" className="alert-style">{error}</Notification>;
    if (!literature.length) return <Message showIcon type="info">Нет любимых книг</Message>;

    return (
        <Modal open={show} onClose={onHide} className="modal-intrest">
            <Modal.Header>
                <Modal.Title className="font-text">Моя литература</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <List bordered>
                    {literature.map((book) => (
                        <List.Item key={book.id}>
                            {editingId === book.id ? (
                                <div style={{ padding: '10px' }}>
                                    <InputGroup style={{ marginBottom: '10px' }} className="font-text">
                                        <Input
                                            value={editForm.name}
                                            onChange={(value) => handleEditChange(value, 'name')}
                                            placeholder="Название книги"
                                        />
                                    </InputGroup>
                                    <InputGroup style={{ marginBottom: '10px' }}>
                                        <Input
                                            value={editForm.author}
                                            onChange={(value) => handleEditChange(value, 'author')}
                                            placeholder="Автор"
                                        />
                                    </InputGroup>
                                    <InputGroup style={{ marginBottom: '10px' }}>
                                        <Input
                                            value={editForm.type}
                                            onChange={(value) => handleEditChange(value, 'type')}
                                            placeholder="Тип (роман, фантастика и т.д.)"
                                        />
                                    </InputGroup>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button appearance="primary" onClick={() => updateLiterature(book.id)}
                                                className="font-text" color="orange">
                                            Сохранить
                                        </Button>
                                        <Button appearance="subtle" onClick={cancelEditing} className="font-text" color="orange">
                                            Отмена
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h5 className="font-text">Название: {book.name}</h5>
                                        <p className="font-text">Автор: {book.author}</p>
                                        <p className="font-text">Тип: {book.type}</p>
                                    </div>
                                    <div>
                                        <IconButton
                                            circle
                                            icon={<FaEdit />}
                                            appearance="subtle"
                                            onClick={() => startEditing(book)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <IconButton
                                            circle
                                            icon={<FaRegTrashAlt />}
                                            color="red"
                                            appearance="subtle"
                                            onClick={() => deleteLiterature(book.id)}
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

LiteratureInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default LiteratureInterests;