import { Link, useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"


const LupaPassword = () => {
    const [username, setUsername] = useState('')
    const [kataKunci, setKataKunci] = useState('')
    const [logError, setLogError] = useState('')

    const usernameRef = useRef(null);
    const kataKunciRef = useRef(null);
    
    const navigate = useNavigate();

    const handlePulihkanAkun = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/api/retriveaccount`, {
                username,
                kataKunci
            });
            navigate(`/passwordbaru/${response.data.userId}`)
            setLogError('')
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setLogError('*username tidak ditemukan.')
            } else if (err.response && err.response.status === 401) {
                setLogError('*username atau kata kunci salah.')
            } else if (err.response && err.response.status === 403) {
                setLogError('*username daan kata kunci tidak boleh kosong.')
            } else {
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
    <div className="h-lvh w-full container flex xl:flex-row md:flex-row flex-col justify-center items-center">
        <aside className="left h-full flex-1 bg-white flex justify-center items-center">
            <form className="w-full p-10 flex flex-col items-center justify-center font-Poppins gap-3">
                <h1 className="font-Poppins text-[#FF4081] font-semibold xl:text-3xl md:text-2xl text-xl">Lupa Password</h1>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Username text-[#121212] text-lg font-semibold">Username</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Usernamemu"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    ref={usernameRef}
                    onKeyDown={(e) => handleKeyDown(e, kataKunciRef)}
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="kataKunci text-[#121212] text-lg font-semibold">Kata Kunci</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Kata kuncimu"
                    value={kataKunci}
                    onChange={(e) => setKataKunci(e.target.value)}
                    autoComplete="current-kataKunci"
                    ref={kataKunciRef}
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-1">
                    <h1 className="text-[#FF0000] font-Poppins text-base italic">{logError}</h1>
                </div>
                <div className="w-full flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                        <h1 className="text-[#121212]">Udah ingat nih?</h1>
                        <Link to={'/masuk'} className="text-[#FF4081] cursor-pointer underline hover:text-[#121212] transition-all ease duration-100">Masuk</Link>
                    </div>
                    <button className="w-1/3 p-2 bg-[#FF4081] text-[#FFFFFF] font-Poppins font-semibold hover:bg-[#c2265a] transition-all ease duration-100"
                    type="submit"
                    onClick={handlePulihkanAkun}
                    >Pulihkan akun</button>
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
        <aside className="xl:h-full md:h-full h-auto right flex-1 flex flex-col justify-center items-center gap-2">
            <div className="logo flex">
              <h1 className="text-3xl text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
              <h1 className="text-3xl text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
            </div>
            <div className="flex">
                <h1 className="text-[#FFFFFF] font-Poppins text-xl font-semibold text-center">
                    Waduh kamu lupa passwordmu ya?
                </h1>
            </div>
        </aside>
    </div>
  )
}

export default LupaPassword