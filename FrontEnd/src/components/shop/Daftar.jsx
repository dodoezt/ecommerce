import { Link } from "react-router-dom"
import { useRef, useState } from 'react'
import axios from "axios"
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Daftar = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [konfirmasiPassword, setKonfirmasiPassword] = useState('')
    const [kataKunci, setKataKunci] = useState('')
    const [signError, setSignError] = useState('');
    const [inputType, setInputType] = useState('password');
    const [konfirmasiInputType, setKonfirmasiInputType] = useState('password');

    const signNotificationRef = useRef(null);
    const eyeRef = useRef(null);
    const eyeSlashRef = useRef(null);
    const eyeRefKonfirmasi = useRef(null);
    const eyeSlashRefKonfirmasi = useRef(null);

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const konfirmasiPasswordRef = useRef(null);
    const kataKunciRef = useRef(null);

    const handleDaftar = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/users', {
                username,
                email,
                password,
                konfirmasiPassword,
                kataKunci
            });
            handleSignNotification();
            setSignError('');
        } catch (err) {
            if(err.response && err.response.status === 400){
                setSignError('*password dan konfirmasi password tidak sama.')
            } else if (err.response && err.response.status === 401) {
                setSignError('*password minimal 8 karakter.')
            } else if (err.response && err.response.status === 402) {
                setSignError('*username tidak lebih dari 20 karakter.')
            } else if (err.response && err.response.status === 403) {
                setSignError('*tidak boleh ada yang kosong.')
            } else {
                setSignError('*username atau email sudah terdaftar.');
            }
        }
    }

    const handleSignNotification = () => {
        const signNotification = signNotificationRef.current;
        signNotification.style.display = "flex";
        setTimeout(() => {
            signNotification.style.transform = "translateY(10%)";
        }, 200)
        setTimeout(() => {
            signNotification.style.transform = "translateY(-100%)";
        }, 3000)
        setTimeout(() => {
            signNotification.style.display = "none";
        }, 3300)
    }

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
          e.preventDefault();
          nextRef.current.focus(); 
        }
    };

    return (
    <div className="h-lvh w-full container flex justify-center items-center relative">
        <aside className="left h-full flex-1 bg-white flex justify-ce nter items-center">
            <form className="w-full p-10 flex flex-col items-center justify-center font-Poppins gap-3">
                <h1 className="font-Poppins text-[#FF4081] font-semibold text-3xl">Daftar</h1>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Username text-[#121212] text-lg font-semibold">Username</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Usernamemu"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    ref={usernameRef}
                    onKeyDown={(e) => handleKeyDown(e, emailRef)}
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Email text-[#121212] text-lg font-semibold">Email</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Emailmu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="current-email"
                    ref={emailRef}
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
                        onKeyDown={(e) => handleKeyDown(e, konfirmasiPasswordRef)}
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
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="konsifmasiPassword text-[#121212] text-lg font-semibold">Konfirmasi Password</h1>
                    <div className="relative flex items-center justify-center">
                        <input type={konfirmasiInputType} className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                        placeholder="Konfirmasi Passwordmu"
                        value={konfirmasiPassword}
                        onChange={(e) => setKonfirmasiPassword(e.target.value)}
                        autoComplete="current-password"
                        ref={konfirmasiPasswordRef}
                        onKeyDown={(e) => handleKeyDown(e, kataKunciRef)}
                    />
                        <button ref={eyeRefKonfirmasi} className="absolute right-3 p-1"
                        onClick={(e)=> {
                            e.preventDefault()
                            eyeRefKonfirmasi.current.classList.add("hidden");
                            eyeSlashRefKonfirmasi.current.classList.remove("hidden");
                            setKonfirmasiInputType('text');
                        }}
                        >
                            <FaRegEye size={20} className="text-[#FF4081]"/>
                        </button>
                        <button ref={eyeSlashRefKonfirmasi} className="absolute right-3 hidden p-1"
                        onClick={(e)=> {
                            e.preventDefault()
                            eyeSlashRefKonfirmasi.current.classList.add("hidden");
                            eyeRefKonfirmasi.current.classList.remove("hidden");
                            setKonfirmasiInputType('password')
                        }}
                        >
                            <FaRegEyeSlash size={20} className="text-[#FF4081]"/>
                        </button>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="kataKunci text-[#121212] text-lg font-semibold">Kata Kunci</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Kata kunci untuk memulihkan akun"
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    autoComplete="current-kataKunci"
                    ref={kataKunciRef}
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-1">
                    <h1 className="text-[#FF0000] font-Poppins text-base italic">{signError}</h1>
                </div>
                <div className="w-full flex items-center justify-between gap-1">
                    <Link className="flex gap-1"
                    to={'/masuk'}
                    >
                        <h1 className="text-[#121212] no-underline">Sudah punya akun?</h1>
                        <h1 className="cursor-pointer underline text-[#FF4081] hover:text-[#121212] transition-all ease duration-100">Masuk</h1>
                    </Link>
                    <button className="w-1/3 p-2 bg-[#FF4081] text-[#FFFFFF] font-Poppins font-semibold hover:bg-[#c2265a] transition-a;;"
                    onClick={handleDaftar}
                    >Daftar</button>
                </div>
            </form>
        </aside>
        <aside className="right flex-1 flex flex-col justify-center items-center gap-2">
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
        <span className="w-1/4 p-3 py-5 bg-[#212121] rounded-xl font-semibold font-Poppins items-center justify-center gap-1 fixed top-0 transition-all ease duration-200"
        ref={signNotificationRef}
        style={{ 
            display: "flex",
            transform: "translateY(-100%)",
        }}
        >
            <h1 className="text-[#FF4081]"><IoIosCheckmarkCircle size={30}/></h1>
            <h1 className="text-xl text-[#FFFFFF]">Registrasi Berhasil</h1>
        </span>
    </div>
  )
}

export default Daftar