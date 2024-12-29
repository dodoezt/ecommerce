import { CiLogin } from "react-icons/ci";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Alert = ({ alertRef }) => {
    const navigate = useNavigate();

    const handleClickAlert = () => {
        const alertContainer = alertRef.current;
        navigate('/masuk');
        setTimeout(() => {
            alertContainer.classList.add('-translate-y-full')
            setTimeout(() => {
                alertContainer.style.display = 'none'
            }, 300)
        },100)
    }

    return (
        <button
        onClick={handleClickAlert} 
        ref={alertRef}
        style={{
            display: 'none',
        }} 
        className="w-1/3 fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full p-5 bg-[#121212] border border-[#ff4081] rounded-lg flex items-center justify-center gap-2 z-[100] transition-all ease duration-200 hover:scale-90">
            <CiLogin className="text-2xl text-[#ffffff]"/>
            <p className="text-white text-lg">Silahkan Masuk Terlebih Dahulu!</p>
        </button>
    )
}

Alert.propTypes = {
    alertRef: PropTypes.object.isRequired,
}

export default Alert