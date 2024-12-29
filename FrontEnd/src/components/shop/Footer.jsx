import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Footer = ({ fileRef }) => {
    return (
        <div className="w-full p-2 flex flex-col-reverse items-center justify-start bg-[#121212] font-Poppins mt-5 gap-2"
        ref={fileRef}
        >
            <header className="text-white text-sm md:text-base">&copy; 2024 Alldo Firmansyah. All Rights Reserved.</header>
            <main className="w-full flex justify-center items-center gap-1">
                <Link className=""
                to={'https://www.instagram.com/dodo.gtw'}
                >
                    <FaInstagramSquare className="text-3xl xl:text-4xl text-[#424242] transition-all ease durtaion-200 hover:text-white hover:-translate-y-1"/>
                </Link>
                <Link className=""
                to={'https://wa.me/6285712615685?text=Hello'}
                >
                    <FaWhatsappSquare className="text-3xl xl:text-4xl text-[#424242] transition-all ease durtaion-200 hover:text-white hover:-translate-y-1"/>
                </Link>
                <Link className=""
                to={'https://wa.me/6285712615685?text=Hello'}
                >
                    <AiFillTikTok className="text-3xl xl:text-4xl text-[#424242] transition-all ease durtaion-200 hover:text-white hover:-translate-y-1"/>
                </Link>
                <Link className=""
                to={'https://github.com/dodoezt'}
                >
                    <FaGithubSquare className="text-3xl xl:text-4xl text-[#424242] transition-all ease durtaion-200 hover:text-white hover:-translate-y-1"/>
                </Link>
                <Link className=""
                to={'https://wa.me/6285712615685?text=Hello'}
                >
                    <FaLinkedin className="text-3xl xl:text-4xl text-[#424242] transition-all ease durtaion-200 hover:text-white hover:-translate-y-1"/>
                </Link>
            </main>
            <footer className="w-full flex justify-center items-center text-white text-lg md:text-xl font-semibold">Sosial Media Kami</footer>
        </div>
    )
}
Footer.propTypes = {
    fileRef: PropTypes.object.isRequired,
}

export default Footer