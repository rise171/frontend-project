
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Authorization from "./authentification_system/Authorization.jsx";
//import {Route, Router, Routes} from "react-router-dom";
import Register from "./authentification_system/Register.jsx";
import MainPage from "./Pages/MainPage.jsx";
import {UserProvider} from "../UserContext.jsx";
function App() {

  return (
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/main" element={<MainPage />}/>
                  <Route path="/login" element={<Authorization />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </Router>
      </UserProvider>

  )
}

export default App
