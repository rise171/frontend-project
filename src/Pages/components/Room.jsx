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
import { MdAdd } from "react-icons/md";
import {IconButton} from "rsuite";
import ModalWindow from "./ModalWindow.jsx";


export default function Room( {interesedId}) {
    const [activeModal, setActiveModal] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const openModal = (type) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    return (
        <>
            <div className="back-room">
                <img src={Bookshelf} className="bookshelf" onClick={() => openModal("literature")}/>
                <img src={GameImage} className="game-image" onClick={() => openModal("game")}/>
                <img src={HobbyImage} className="hobby-image" onClick={() => openModal("hobby")}/>
                <img src={Cinema} className="cinema-image" onClick={() => openModal("cinema")}/>
                <img src={MusicImage} className="music-image" onClick={() => openModal("music")}/>
                <img src={SportImage} className="sport-image" onClick={() => openModal("sports")}/>

            </div>
            <IconButton circle icon={<MdAdd className="icon-plus"/>} className="icon-add-interest" size="lg" onClick={handleOpenAddModal}/>

            <ModalWindow
                show={showAddModal}
                onClose={handleCloseAddModal}
                interestId={interesedId}
            />


            {activeModal === "literature" &&
                <LiteratureInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "sports" && <SportsInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "game" && <GamesInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "hobby" && <HobbyInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "cinema" && <CinemaInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}
            {activeModal === "music" && <MusicInterests show={true} onHide={() => setActiveModal(null)} interestId={interesedId}/>}


        </>

    );

}

Room.propTypes = {
    interesedId: PropTypes.number.isRequired,
}