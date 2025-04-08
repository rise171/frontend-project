import { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Modal, Button } from "react-bootstrap";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";

const HobbyInterests = ({ show, onHide, interestId }) => {
    const [hobbies, setHobbies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                const response = await api.get(`/interest/hobby/${interestId}`);
                setHobbies(response.data);
            } catch (err) {
                setError("Ошибка загрузки хобби");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHobbies();
    }, [interestId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!hobbies.length) return <Alert variant="info">Нет добавленных хобби</Alert>;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Мои хобби</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : hobbies.length ? (
                    <ListGroup>
                        {hobbies.map((hobby) => (
                            <ListGroup.Item key={hobby.id}>{hobby.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info">Нет добавленных хобби</Alert>
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

HobbyInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
}

export default HobbyInterests;