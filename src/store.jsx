import PropTypes from 'prop-types';
import { createContext, useState, useContext } from 'react';
// Создаем контекст для состояния пользователя
const UserContext = createContext();

// Провайдер для управления состоянием пользователя
/*export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserData = (userData) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};*/

// Хук для доступа к состоянию пользователя
export const useUser = () => {
    return useContext(UserContext);
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}