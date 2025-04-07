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
    SelectPicker, useToaster
} from "rsuite";
import api from "./../../axios.jsx";
import PropTypes from "prop-types";
import Room from "./Room.jsx";

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
    cinema_type: { "Фильм": "Фильм", "Сериал": "Сериал", "Аниме": "Аниме", "Мультипликация": "Мультипликация" },
    game_type: { "Компьютерная": "Компьютерная", "Настольная": "Настольная", "Мобильная": "Мобильная" },
    book_type: { "Книга": "Книга", "Цикл": "Цикл", "Новелла": "Новелла", "Комикс": "Комикс" }
};

const enumTypesMap = {
    cinema: 'cinema_type',
    games: 'game_type',
    literature: 'book_type'
};

export default function ModalWindow({ show, onClose, interestId }) {
    const [showRoom, setShowRoom] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [formData, setFormData] = useState({});

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

            await api.post(endpoint, requestData);

            toaster.push(
                <Notification type="success" header="Успех" closable>
                    {categoryDisplayNames[category]} успешно добавлен!
                </Notification>,
                { placement: "topCenter" }
            );

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
        if (selectedCategories.length === 0) {
            toaster.push(
                <Notification type="error" header="Ошибка" closable>
                    Выберите хотя бы одну категорию
                </Notification>,
                { placement: "topCenter" }
            );
            return;
        }

        let successCount = 0;

        for (const category of selectedCategories) {
            try {
                const endpoint = `/interest/${categoryEndpoints[category]}`;
                const requestData = { interest_id: interestId };

                Object.entries(fieldMappings[category]).forEach(([backendField, frontendField]) => {
                    if (frontendField !== "interest_id") {
                        requestData[backendField] = formData[frontendField] || "";
                    }
                });

                await api.post(endpoint, requestData);
                successCount++;
            } catch (err) {
                toaster.push(
                    <Notification type="error" header="Ошибка" closable>
                        {err?.response?.data?.detail || `Ошибка при сохранении ${categoryDisplayNames[category]}`}
                    </Notification>,
                    { placement: "topCenter" }
                );
            }
        }

        if (successCount) {
            toaster.push(
                <Notification type="success" header="Успех" closable>
                    Сохранено {successCount} из {selectedCategories.length} интересов
                </Notification>,
                { placement: "topCenter" }
            );
            setShowRoom(true);
            onClose();
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

    if (showRoom) return <Room interesedId={interestId}/>

    return (
        <Modal open={show} onClose={onClose} size="md" backdrop="static">
            <Modal.Header>
                <Modal.Title>Ваши интересы</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <Form fluid>
                    <Form.Group>
                        <Form.ControlLabel>Выберите категории</Form.ControlLabel>
                        <CheckboxGroup value={selectedCategories} onChange={setSelectedCategories}>
                            {Object.keys(categoryDisplayNames).map(category => (
                                <Checkbox key={category} value={category}>
                                    {categoryDisplayNames[category]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </Form.Group>

                    {selectedCategories.map(category => (
                        <Panel key={category} header={categoryDisplayNames[category]} bordered style={{ marginBottom: 15 }}>
                            {renderCategoryFields(category)}
                            <Button appearance="primary" onClick={() => handleAddCategory(category) } style={{ marginTop: 10 }}>
                                Добавить
                            </Button>
                        </Panel>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="primary" onClick={() => handleSubmit()}>
                    Сохранить
                </Button>
                <Button onClick={onClose}>Отмена</Button>
            </Modal.Footer>
        </Modal>
    );
}

ModalWindow.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    interestId: PropTypes.number.isRequired
};