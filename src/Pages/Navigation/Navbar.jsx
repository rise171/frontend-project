//import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import img from "../../assets/img.png";
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import { Navbar, Nav } from 'rsuite';
import {GoHome} from "react-icons/go";
import "./Navbar.css";
import {useState} from "react";

export default function Navigation() {
    //const [roomExist, setRoomExist] = useState(false)
    //const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const transistToMain = navigate('/')

    const handleLogout = () => {
        console.log("Logout");
        navigate('/login');
    }

    const handleMain = () => {
        console.log("Logout");
        transistToMain;
    }

    const anotherUsers = navigate('/users');

    /*const checkRoom = async (userId) => {
        try {
            const response = await api.get("/rooms/{owner_id}");
            setRoomExist(response.data.exists);
        }
        catch (error) {
            console.error("Ошибка при проверки комнаты");
        }
    }*/

    return (
        <Navbar expand="lg" style={{backgroundColor: '#eecb9a'}}>
            <Container>
                <img src={img} alt="" className="navigate-image"/>
                <Nav className="ml-auto">
                    <Nav.Link onClick={handleMain} className="navbar-elements" >
                        <p>Моя комната</p>
                    </Nav.Link>
                    <Nav.Link onClick={anotherUsers} className="navbar-elements">Другие пользователи</Nav.Link>
                    <Button variant={"outline-light"} onClick={handleLogout}>Выход</Button>
                </Nav>
            </Container>

        </Navbar>
    )
}

/*<img src={image1} alt="" className="side-image"/>
<div onClick={transistToMain}>
    <GoHome/>
    <p>Моя комната</p>
</div>
<div onClick={transistToMain}>
    <GoHome/>
    <p>Моя комната</p>
</div>*/