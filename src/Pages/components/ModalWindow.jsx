import { useState } from "react";
import {
    Modal,
    Form,
    Button,
    Checkbox,
    CheckboxGroup,
    Input,
    Notification,
    Panel,
    SelectPicker,
    useToaster
} from "rsuite";
import api from "./../../axios.jsx";
import PropTypes from "prop-types";
import "./ModalWindow.css";

const categoryEndpoints = {
    music: 'songs',
    cinema: 'cinema',
    games: 'games',
    sport: 'sports',
    literature: 'literature',
    hobby: 'hobby'
};

const fieldMappings = {
    music: { name: 'music_name', author: 'music_author', interest_id: 'interest_id' },
    cinema: { name: 'cinema_name', type: 'cinema_type', year: 'cinema_year', country: 'cinema_country', interest_id: 'interest_id' },
    games: { name: 'game_name', type: 'game_type', interest_id: 'interest_id' },
    sport: { name: 'sport_name', interest_id: 'interest_id' },
    literature: { title: 'book_name', author: 'book_author', type: 'book_type', interest_id: 'interest_id' },
    hobby: { name: 'hobby_name', interest_id: 'interest_id' }
};

const enumValues = {
    cinema_type: { "фильм": "фильм", "сериал": "сериал", "аниме": "аниме", "мультипликация": "мультипликация" },
    game_type: { "Компьютерная": "Компьютерная", "Настольная": "Настольная", "Мобильная": "Мобильная" },
    book_type: { "Книга": "Книга", "Цикл": "Цикл", "Новелла": "Новелла", "Комикс": "Комикс" }
};

const enumTypesMap = {
    cinema: 'cinema_type',
    games: 'game_type',
    literature: 'book_type'
};

export default function ModalWindow({ show, onClose, onSave, interestId }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successfulRequests, setSuccessfulRequests] = useState([]);

    const toaster = useToaster();

    const categoryDisplayNames = {
        music: "Музыка",
        cinema: "Кино",
        games: "Игры",
        sport: "Спорт",
        literature: "Литература",
        hobby: "Хобби"
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = async (category) => {
        if (!interestId) {
            toaster.push(
                <Notification type="error" header="Ошибка" closable>
                    Сначала создайте интересы
                </Notification>,
                { placement: "topCenter" }
            );
            return;
        }

        try {
            const endpoint = `/interest/${categoryEndpoints[category]}`;
            const requestData = { interest_id: interestId };

            Object.entries(fieldMappings[category]).forEach(([backendField, frontendField]) => {
                if (frontendField === 'interest_id') return;

                const value = formData[frontendField] || "";
                if (backendField === 'type') {
                    const enumType = enumTypesMap[category];
                    if (!enumValues[enumType]?.[value]) {
                        throw new Error(`Недопустимое значение для типа: ${value}`);
                    }
                }

                requestData[backendField] = value;
            });

            const response = await api.post(endpoint, requestData);

            if (response.status === 200) {
                toaster.push(
                    <Notification type="success" header="Успех" closable>
                        {categoryDisplayNames[category]} успешно добавлен!
                    </Notification>,
                    { placement: "topCenter" }
                );

                // Добавляем категорию в список успешных запросов
                if (!successfulRequests.includes(category)) {
                    setSuccessfulRequests(prev => [...prev, category]);
                }
            }

            setFormData({});
        } catch (err) {
            toaster.push(
                <Notification type="error" header="Ошибка" closable>
                    {err?.response?.data?.detail || err.message || "Ошибка при добавлении интереса"}
                </Notification>,
                { placement: "topCenter" }
            );
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Вызываем функцию сохранения из родительского компонента
            if (onSave) {
                await onSave();
            }

            toaster.push(
                <Notification type="success" header="Успех" closable>
                    Ваши интересы успешно сохранены!
                </Notification>,
                { placement: "topCenter" }
            );

            onClose();
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            toaster.push(
                <Notification type="error" header="Ошибка" closable>
                    {error?.response?.data?.detail || "Произошла ошибка при сохранении"}
                </Notification>,
                { placement: "topCenter" }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCategoryFields = (category) => {
        return Object.entries(fieldMappings[category])
            .filter(([_, frontendField]) => frontendField !== 'interest_id')
            .map(([backendField, frontendField]) => {
                const isEnum = backendField === 'type';
                const enumType = enumTypesMap[category];
                const options = isEnum && enumType ? Object.keys(enumValues[enumType]) : [];

                return (
                    <Form.Group key={frontendField}>
                        <Form.ControlLabel>
                            {{
                                title: "Название",
                                author: "Автор",
                                type: "Тип",
                                country: "Страна",
                                year: "Год",
                                name: "Название"
                            }[backendField] || backendField}
                        </Form.ControlLabel>

                        {isEnum && options.length ? (
                            <SelectPicker
                                data={options.map(opt => ({ label: opt, value: opt }))}
                                value={formData[frontendField] || ""}
                                onChange={(val) => handleChange(frontendField, val)}
                                style={{ width: '100%' }}
                            />
                        ) : (
                            <Input
                                value={formData[frontendField] || ""}
                                onChange={(val) => handleChange(frontendField, val)}
                            />
                        )}
                    </Form.Group>
                );
            });
    };

    const isSaveEnabled = successfulRequests.length > 0;

    return (
        <Modal open={show} onClose={onClose} size="md" backdrop="static">
            <Modal.Header>
                <Modal.Title className="modal-window-font">Ваши интересы</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <Form fluid>
                    <Form.Group>
                        <Form.ControlLabel className="modal-window-font">Выберите категории</Form.ControlLabel>
                        <CheckboxGroup
                            value={selectedCategories}
                            onChange={setSelectedCategories}
                        >
                            {Object.keys(categoryDisplayNames).map(category => (
                                <Checkbox key={category} value={category} className="modal-window-font">
                                    {categoryDisplayNames[category]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </Form.Group>

                    {selectedCategories.map(category => (
                        <Panel
                            key={category}
                            header={categoryDisplayNames[category]}
                            bordered
                            style={{ marginBottom: 15 }}
                            className="modal-window-font"
                        >
                            {renderCategoryFields(category)}
                            <Button
                                appearance="primary"
                                onClick={() => handleAddCategory(category)}
                                style={{ marginTop: 10 }} color="orange"
                            >
                                Добавить
                            </Button>
                            {successfulRequests.includes(category) && (
                                <span style={{ color: 'green', marginLeft: 10 }}>
                                    ✓ Успешно добавлено
                                </span>
                            )}
                        </Panel>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    appearance="primary"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!isSaveEnabled || isSubmitting}
                    color="orange"
                >
                    Сохранить
                </Button>
                <Button onClick={onClose} disabled={isSubmitting}>
                    Отмена
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ModalWindow.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    interestId: PropTypes.number.isRequired
};