import { useEffect, useState } from "react";
import { ListGroup, Spinner, Alert, Modal, Button } from "react-bootstrap";
import api from "../../../axios.jsx";
import PropTypes from "prop-types";

const SportsInterests = ({ show, onHide, interestId }) => {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await api.get(`/interest/sports/${interestId}`);
                setSports(response.data);
            } catch (error) {
                setError("Ошибка загрузки спортивных интересов");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSports();
    }, [interestId]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!sports.length) return <Alert variant="info">Нет добавленных видов спорта</Alert>;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Мои спортивные интересы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : sports.length ? (
                    <ListGroup>
                        {sports.map((sport) => (
                            <ListGroup.Item key={sport.id}>{sport.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info">Нет добавленных видов спорта</Alert>
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

SportsInterests.propTypes = {
    interestId: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default SportsInterests;

