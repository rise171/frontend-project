import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav } from 'rsuite';
import "./Navbar.css";
import {MdOutlineExitToApp} from "react-icons/md";
import {IoHome} from "react-icons/io5";
import {FaPeopleGroup} from "react-icons/fa6";

export default function Navigation() {
    const navigate = useNavigate();

    return (
        <Navbar className="navbar-style">
            <Navbar.Brand onClick={() => navigate("/")} className="navigate-title">ROOMIE</Navbar.Brand>
            <Nav>
                <Nav.Item onClick={() => navigate("/main")} className="navigate-text" icon={<IoHome />}>Моя комната</Nav.Item>
                <Nav.Item onClick={() => navigate("/users")} className="navigate-text" icon={<FaPeopleGroup />}>Другие пользователи</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item onClick={() => navigate("/login")} className="navigate-text" icon={<MdOutlineExitToApp />}>Выйти</Nav.Item>
            </Nav>
        </Navbar>
    )
}
/*<Nav.Item onClick={handleAi}>AI-chat</Nav.Item>*/
/*<img src={image1} alt="" className="side-image"/>
<div onClick={transistToMain}>
    <GoHome/>
    <p>Моя комната</p>
</div>
<div onClick={transistToMain}>
    <GoHome/>
    <p>Моя комната</p>
</div>*/