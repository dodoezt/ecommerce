import { Link, useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Masuk = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [logError, setLogError] = useState('')
    const [inputType, setInputType] = useState('password');

    const eyeRef = useRef(null);
    const eyeSlashRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    
    const navigate = useNavigate();

    const handleMasuk = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/login`, {
                username,
                password
            });
            const user = response.data;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            console.log(response.data)
            navigate('/');
            setLogError('')
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log('User not found');
                setLogError('*username atau password salah.')
            } else if (err.response && err.response.status === 401) {
                console.log('Invalid password');
                setLogError('*username atau password salah.')
            } else if (err.response && err.response.status === 403) {
                console.log('Invalid password');
                setLogError('*username dan password tidak boleh kosong.')
            } else {
                console.log('Server error (500)');
                setLogError('*ada masalah dengan server, coba lagi nanti.')
            }
        }
    }
 
    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
          e.preventDefault();
          nextRef.current.focus(); 
        }
    };

    return (
    <div className="h-lvh w-full container flex justify-center items-center">
        <aside className="left h-full flex-1 bg-white flex justify-center items-center">
            <form className="w-full p-10 flex flex-col items-center justify-center font-Poppins gap-3">
                <h1 className="font-Poppins text-[#FF4081] font-semibold text-3xl">Masuk</h1>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Username text-[#121212] text-lg font-semibold">Username</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Usernamemu"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    ref={usernameRef}
                    onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Password text-[#121212] text-lg font-semibold">Password</h1>
                    <div className="relative flex items-center justify-center">
                        <input type={inputType} className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                        placeholder="Passwordmu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        ref={passwordRef}
                        />
                        <button ref={eyeRef} className="absolute right-3 p-1"
                        onClick={(e)=> {
                            e.preventDefault()
                            eyeRef.current.classList.add("hidden");
                            eyeSlashRef.current.classList.remove("hidden");
                            setInputType('text');
                        }}
                        >
                            <FaRegEye size={20} className="text-[#FF4081]"/>
                        </button>
                        <button ref={eyeSlashRef} className="absolute right-3 hidden p-1"
                        onClick={(e)=> {
                            e.preventDefault()
                            eyeSlashRef.current.classList.add("hidden");
                            eyeRef.current.classList.remove("hidden");
                            setInputType('password')
                        }}
                        >
                            <FaRegEyeSlash size={20} className="text-[#FF4081]"/>
                        </button>
                    </div>
                </div>
                <div className="w-full flex justify-start items-center gap-1">
                    <h1 className="text-[#FF0000] font-Poppins text-base italic">{logError}</h1>
                </div>
                <div className="w-full flex items-center justify-between gap-1">
                    <Link to={'/lupapassword'} className="text-[#FF4081] cursor-pointer underline hover:text-[#121212] transition-all ease duration-100">Lupa password?</Link>
                    <button className="w-1/3 p-2 bg-[#FF4081] text-[#FFFFFF] font-Poppins font-semibold hover:bg-[#c2265a] transition-all ease duration-100"
                    type="submit"
                    onClick={handleMasuk}
                    >Masuk</button>
                </div>
                <div className="w-full flex items-center justify-center gap-1 relative">
                    <h1 className="text-[#121212] bg-[#FFFFFF] z-10">atau</h1>
                    <span className="w-full absolute pt-[1px] bg-[#121212] z-0"></span>
                </div>
                <div className="w-full flex items-center justify-start gap-1">
                    <Link className="flex gap-1"
                    to={'/daftar'}
                    >
                        <h1 className="text-[#121212] no-underline">Belum punya akun?</h1>
                        <h1 className="cursor-pointer underline text-[#FF4081] hover:text-[#121212] transition-all ease duration-100">Daftar</h1>
                    </Link>
                </div>
            </form>
        </aside>
        <aside className="h-full right flex-1 flex flex-col justify-center items-center gap-2">
            <div className="logo flex">
              <h1 className="text-3xl text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
              <h1 className="text-3xl text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
            </div>
            <div className="flex">
                <h1 className="text-[#FFFFFF] font-Poppins text-xl font-semibold">
                    Masuk/Daftar Sekarang Juga!
                </h1>
            </div>
        </aside>
    </div>
  )
}

export default Masuk