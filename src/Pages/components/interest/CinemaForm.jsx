import { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Modal, Button } from "react-bootstrap";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";
import "./Interest.css";
import {Message, Notification} from 'rsuite';

const CinemaInterests = ({ show, onHide, interestId }) => {
    const [cinema, setCinema] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCinema = async () => {
            try {
                const response = await api.get(`/interest/cinema/${interestId}`);
                setCinema(response.data);
            } catch (err) {
                setError("Ошибка загрузки интересов в кино");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCinema();
    }, [interestId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Message type="error">{error}</Message>;
    if (!cinema.length) return <Alert variant="info">Нет любимых фильмов</Alert>;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Мои фильмы и сериалы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : cinema.length ? (
                    <ListGroup>
                        {cinema.map((film) => (
                            <ListGroup.Item key={film.id}>
                                {film.name} ({film.year}) - {film.type}, {film.country}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Message type="error">Нет добавленных фильмов и сериалов</Message>
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

CinemaInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
}

export default CinemaInterests;