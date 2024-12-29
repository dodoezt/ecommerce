import { createContext, useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();
const SidebarContext = createContext();

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBarClick, setIsBarClick] = useState(true);

    const sidebarRef = useRef();

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user && user.user) {
                    setUsername(user.user.username);
                }
            } else {
                setUsername(null);
            }
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        handleStorageChange();
        setLoading(false)
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    

    const handleSidebar = () => {
        setIsBarClick(!isBarClick);
        const sidebar = sidebarRef.current;

        if (isBarClick === true) {
            sidebar.style.display = "flex";
            setTimeout(() => (sidebar.style.transform = "translateX(0)"), 100);
        } else {
            sidebar.style.transform = "translateX(100%)";
            setTimeout(() => (sidebar.style.display = "none"), 300);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ username }}>
            <SidebarContext.Provider value={{ isBarClick, setIsBarClick, sidebarRef, handleSidebar }}>
                {children}
            </SidebarContext.Provider>
        </UserContext.Provider>
    );
};


export const useUser = () => {
    return useContext(UserContext);
};

export const useSidebar = () => {
    return useContext(SidebarContext);
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
