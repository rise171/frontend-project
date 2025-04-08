import { useEffect, useState } from "react";
import { List, Loader, Notification, Modal, Button } from "rsuite";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import "./Interest.css";

const LiteratureInterests = ({ show, onHide, interestId }) => {
    const [literature, setLiterature] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiterature = async () => {
            try {
                const response = await api.get(`/interest/literature/${interestId}`);
                setLiterature(response.data);
            } catch (err) {
                setError("Ошибка загрузки литературы");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLiterature();
    }, [interestId]);

    if (loading) return <Loader center content="Загрузка..." />;
    if (error) return <Notification type="error" className="alert-style">{error}</Notification>;
    if (!literature.length) return <Notification type="info">Нет любимых книг</Notification>;

    return (
        <Modal open={show} onClose={onHide} className="modal-intrest">
            <Modal.Header>
                <Modal.Title>Моя литература</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Loader center content="Загрузка..." />
                ) : error ? (
                    <Notification type="error" showIcon>{error}</Notification>
                ) : literature.length ? (
                    <List>
                        {literature.map((book) => (
                            <List.Item key={book.id}>{book.name} - {book.author}</List.Item>
                        ))}
                    </List>
                ) : (
                    <Notification type="info" showIcon>Нет добавленных книг</Notification>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="subtle" onClick={onHide}>
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
}

export default LiteratureInterests;