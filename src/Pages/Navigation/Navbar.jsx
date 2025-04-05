//import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Navbar, Nav } from 'rsuite';
import "./Navbar.css";

export default function Navigation() {
    //const [roomExist, setRoomExist] = useState(false)
    //const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const transistToMain = navigate('/main');

    const handleLogout = () => {
        console.log("Logout");
        navigate('/login');
    }

    const handleMain = () => {
        console.log("main");
        transistToMain;
    }

    const anotherUsers = navigate('/users'); /**/

    return (
        <Navbar className="navbar-style">
            <Navbar.Brand href="/" >ROOMIE</Navbar.Brand>
            <Nav>
                <Nav.Item onClick={handleMain}>Моя комната</Nav.Item>
                <Nav.Item>Другие пользователи</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item onClick={handleLogout}>Выйти</Nav.Item>
            </Nav>
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