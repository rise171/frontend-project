import React from 'react';
import Navigation from "./Navigation/Navbar.jsx";
import ContentSite from "./Content.jsx";
import "./MainPage.css"
import PropTypes from "prop-types";
import {useUser} from "../../UserContext.jsx";

export default function MainPage() {

    return (
        <div className="allpage">
            <Navigation/>
            <ContentSite className="content-size"/>
        </div>
    )
}

MainPage.propTypes = {
    userID: PropTypes.number.isRequired,
}
