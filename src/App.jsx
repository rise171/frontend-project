
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Authorization from "./authentification_system/Authorization.jsx";
//import {Route, Router, Routes} from "react-router-dom";
import Register from "./authentification_system/Register.jsx";
import MainPage from "./Pages/MainPage.jsx";
import {UserProvider} from "../UserContext.jsx";
import AnotherUserPage from "./Pages/AnotherUserPage.jsx";
//import AIChat from "./Pages/AIChat.jsx"; <Route path="/aichat" element={<AIChat/>}/>
function App() {

  return (
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/main" element={<MainPage />}/>
                  <Route path="/login" element={<Authorization />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/users" element={<AnotherUserPage/>}/>
              </Routes>
          </Router>
      </UserProvider>

  )
}

export default App
