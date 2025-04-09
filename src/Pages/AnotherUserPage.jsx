import Navigation from "./Navigation/Navbar.jsx";
import { useEffect, useState } from "react";
import api from "../axios.jsx";
import { useUser } from "../../UserContext.jsx";
import { Card, List, Message, useToaster } from "rsuite";
import { IoPersonCircle } from "react-icons/io5";
import "./AnotherUserPage.css"

export default function AnotherUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useUser();
    const toaster = useToaster();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get("/user/get_users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toaster.push(
                    <Message type="error" duration={5000}>
                        Ошибка при загрузке пользователей: {error.message}
                    </Message>
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <Navigation />
            <div style={{ padding: "20px" }}>
                <h1 className="users-page-title">Список других пользователей</h1>

                {loading ? (
                    <Message showIcon type="info">
                        Загрузка пользователей...
                    </Message>
                ) : users.length > 0 ? (
                    <List>
                        {users
                            .filter(user => user.id !== userId)
                            .map((user) => (
                                <List.Item key={user.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                                    <Card bordered style={{ width: "30%" }}>
                                        <Card.Header>
                                            <div className="card-body-style">
                                                <IoPersonCircle size={50} style={{ marginRight: "10px" }} />
                                                <span style={{ fontWeight: "bold" }}>{user.username}</span>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                        </Card.Body>
                                    </Card>
                                </List.Item>
                            ))}
                    </List>
                ) : (
                    <Message showIcon type="info">
                        Пользователей не найдено
                    </Message>
                )}
            </div>
        </>
    );
}