import { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Modal, Button } from "react-bootstrap";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";

const GamesInterests = ({ show, onHide, interestId }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get(`/interest/game/${interestId}`);
                setGames(response.data);
            } catch (err) {
                setError("Ошибка загрузки игровых интересов");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [interestId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!games.length) return <Alert variant="info">Нет любимых игр</Alert>;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Мои игры</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : games.length ? (
                    <ListGroup>
                        {games.map((game) => (
                            <ListGroup.Item key={game.id}>{game.name} - {game.genre}</ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info">Нет добавленных игр</Alert>
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

GamesInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
}

export default GamesInterests;