import "./Room.css";
import Bookshelf from "../../assets/room/literature.png";
import SportImage from "../../assets/room/sport.png";
import MusicImage from "../../assets/room/music.png";
import HobbyImage from "../../assets/room/hobby.png";
import GameImage from "../../assets/room/game.png";
import Cinema from "../../assets/room/cinema.png";
import {useState} from "react";
import SportsInterests from "./interest/SportForm.jsx";
import LiteratureInterests from "./interest/LiteratureForm.jsx";
import GamesInterests from "./interest/GameForm.jsx";
import HobbyInterests from "./interest/HobbyForm.jsx";
import CinemaInterests from "./interest/CinemaForm.jsx";
import MusicInterests from "./interest/MusicForm.jsx";
import PropTypes from "prop-types";


export default function Room( {interesedId}) {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (type) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    return (
        <div>
            <div className="back-room">
                <img src={Bookshelf} className="bookshelf" onClick={() => openModal("literature")}/>
                <img src={GameImage} className="game-image" onClick={() => openModal("game")}/>
                <img src={HobbyImage} className="hobby-image" onClick={() => openModal("hobby")}/>
                <img src={Cinema} className="cinema-image" onClick={() => openModal("cinema")}/>
                <img src={MusicImage} className="music-image" onClick={() => openModal("music")}/>
                <img src={SportImage} className="sport-image" onClick={() => openModal("sport")}/>
            </div>

            {activeModal === "literature" &&
                <LiteratureInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "sports" && <SportsInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "game" && <GamesInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "hobby" && <HobbyInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "cinema" && <CinemaInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "music" && <MusicInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}


        </div>

    );

}

Room.propTypes = {
    interesedId: PropTypes.number.isRequired,
}