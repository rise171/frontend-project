import { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Button, Modal } from "react-bootstrap";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import {Notification} from "rsuite";
import "./Interest.css";

const MusicInterests = ({ show, onHide, interestId }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await api.get('/interest/songs/${interestId}');
                setSongs(response.data);
            } catch (err) {
                setError("Ошибка загрузки музыкальных интересов");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [interestId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Notification type="danger" className="alert-style">{error}</Notification>;
    if (!songs.length) return <Alert variant="info">Нет любимых песен</Alert>;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Моя музыка</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : songs.length ? (
                    <ListGroup>
                        {songs.map((song) => (
                            <ListGroup.Item key={song.id}>
                                {song.name} - {song.author} ({song.genre})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info">Нет добавленных песен</Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
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
}

export default MusicInterests;