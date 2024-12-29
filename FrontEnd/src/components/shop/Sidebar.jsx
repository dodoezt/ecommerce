import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar, useUser } from './ManageContext.jsx';
import PropTypes from 'prop-types';
import { IoHomeOutline } from "react-icons/io5";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";

const Sidebar = ( {fileRef, trendingProductRef, allProductRef} ) => {
    const { username } = useUser(); 
    const navigate = useNavigate();
    const { isBarClick, sidebarRef, handleSidebar } = useSidebar();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                if (isBarClick === false) {
                    handleSidebar();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarRef, isBarClick, handleSidebar]);

    const handleHome = () => {
        navigate('/');
        handleSidebar();
    }

    const handleTentangKami = () => {
        try {
            navigate('/');
        }catch {
            console.log('error')
        } finally {
            setTimeout(() => {
                handleScrollToFoot();
                handleSidebar();    
            }, 100)
        }
    }

    const handleTrending = () => {
        try {
            navigate('/');
        }catch {
            console.log('error')
        } finally {
            setTimeout(() => {
                handleScrollToTrending();
                handleSidebar();    
            }, 100)
        }
    }

    const handleProduct = () => {
        try {
            navigate('/');
        }catch {
            console.log('error')
        } finally {
            setTimeout(() => {
                handleScrollToProduct();
                handleSidebar();    
            }, 100)
        }
    }
    
    const initialUsername = (username) => {
        const firstCharacter = username?.[0]?.toUpperCase(); // Safely get first character
        return firstCharacter || ""; // Return empty string if username is null or undefined
    };

    const handleScrollToFoot = () => {
        if (fileRef.current) {
            fileRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }
    const handleScrollToTrending = () => {
        if (trendingProductRef.current) {
            trendingProductRef.current.scrollIntoView({ behavior: "smooth"});
        }
    }
    const handleScrollToProduct = () => {
        if (allProductRef.current) {
            allProductRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const handleLogout = () => {
        try {
            localStorage.removeItem("loggedInUser")
        } catch {
            console.log('failed to logout')
        } finally {
            window.location.reload();
        }
    }

    return (
        <>
        {!isBarClick && (
            <div className="overlay z-[60]" onClick={handleSidebar}></div>
        )}
        <div className='xl:w-1/4 md:w-1/3 w-1/2 h-dvh fixed top-0 right-0 bg-[#121212] z-[70] translate-all ease duration-300'
        ref={sidebarRef}
        style={{
            transform: "translateX(100%)",
            display:"none"
        }}
        >
            <div className="inside w-full h-full p-3 flex flex-col items-center justify-start relative">
                <header className='w-full flex sm:flex-row flex-col sm:items-center items-start border-b border-b-white p-3 font-Poppins gap-3'>
                    {username === null ? (
                    <>
                        <div className="w-1/4 aspect-square rounded-full bg-[#424242] hidden sm:flex items-center justify-center font-semibold xl:text-4xl md:text-3xl text-xl text-[#949494]"><FaRegUser/></div> 
                        <div className="w-full sm:hidden flex items-center gap-1">
                            <div className="w-1/3 aspect-square rounded-full bg-[#424242] flex items-center justify-center font-semibold xl:text-4xl md:text-3xl text-xl text-[#949494]"><FaRegUser/></div>
                            <h1 className="text-white font-Poppins xl:text-base text-[0.7rem]">Anda Belum Masuk</h1>
                        </div>
                        <div className="w-1/2 flex flex-col items-start justify-start gap-1">
                            <h1 className="text-white font-Poppins xl:text-base text-[0.7rem]">Anda Belum Masuk</h1>
                            <button onClick={() => {
                                navigate('/masuk')
                                handleSidebar()
                            }}
                            className="flex items-center p-1 gap-1 border border-[#FF4081]">
                                <CiLogin className='sm:text-2xl text-xl text-[#FF4081]'/>
                                <h1 className="sm:text-sm text-[0.7rem] font-Poppins text-white">Masuk/Daftar</h1>
                            </button>
                        </div>
                    </>
                    ) : (
                    <>
                        <div className="w-1/4 aspect-square rounded-full bg-[#FF4081] flex items-center justify-center font-semibold xl:text-4xl md:text-3xl text-xl text-white">{initialUsername(username)}</div>
                        <div className="w-3/4 flex flex-col items-start justify-start">
                            <h1 className="text-white xl:text-xl md:text-xl text-base">Halo, {username}</h1>
                            <button className="flex items-center justify-center p-1 gap-1"
                            onClick={() => {
                                handleLogout()
                            }}
                            >
                                <CiLogout className="sm:text-2xl text-[#FF4081]"/>
                                <h1 className="text-white">Keluar</h1>
                            </button>
                        </div>
                    </>

                    )}
                </header>
                <nav className="w-full flex flex-col items-center justify-start mt-2">
                    <button onClick={handleHome} className="w-full p-2 flex items-center justify-start gap-1">
                        <IoHomeOutline className='text-[#FF4081] xl:text-xl md:text-xl text-base'/>
                        <h1 className="text-white xl:text-lg md:text-lg text-sm font-medium">Home</h1>
                    </button>
                    <button
                    className="w-full p-2 flex items-center justify-start gap-1"
                    onClick={handleProduct}
                    >
                        <MdOutlineProductionQuantityLimits className='text-[#FF4081] xl:text-xl md:text-xl text-base'/>
                        <h1 className="text-white xl:text-lg md:text-lg text-sm font-medium">Semua Produk</h1>
                    </button>
                    <button
                    className="w-full p-2 flex items-center justify-start gap-1"
                    onClick={handleTrending}
                    >
                        <FaArrowTrendUp className='text-[#FF4081] xl:text-xl md:text-xl text-base'/>
                        <h1 className="text-white xl:text-lg md:text-lg text-sm font-medium">Produk Trending</h1>
                    </button>
                    <button
                    className="w-full p-2 flex items-center justify-start gap-1"
                    onClick={handleTentangKami}
                    >
                        <FaRegCircleQuestion className='text-[#FF4081] xl:text-xl md:text-xl text-base'/>
                        <h1 className="text-white xl:text-lg md:text-lg text-sm font-medium">Tentang Kami</h1>
                    </button>
                </nav>
                <footer className="w-full h-full flex flex-col items-center justify-end gap-1 p-5">
                    <h1 className="font-Poppins font-medium text-base text-white">Our Socials</h1>
                    <div className="flex gap-1">
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
                    </div>
                </footer>
            </div>
        </div>
        </>
    )
}

Sidebar.propTypes = {
  fileRef: PropTypes.object.isRequired,
  trendingProductRef: PropTypes.object.isRequired,
  allProductRef: PropTypes.object.isRequired,
}

export default Sidebar