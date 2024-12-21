import { useNavigate, useParams } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"

const PasswordBaru = () => {
    const [passwordBaru, setPasswordBaru] = useState('')
    const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('')
    const [logError, setLogError] = useState('')
    const {id} = useParams();

    const passwordBaruRef = useRef(null);
    const konfirmasiPasswordBaruRef = useRef(null);
    
    const navigate = useNavigate();

    const handlePulihkanAkun = async (event) => {
        event.preventDefault();
        try {
            await axios.patch(`http://localhost:3001/users/${id}`, {
                passwordBaru,
                konfirmasiPasswordBaru
            });
            navigate('/masuk');
            setLogError('')
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setLogError('*tidak ada yang boleh kosong.')
            } else if (err.response && err.response.status === 400) {
                setLogError('*Pasword Baru dan Konfirmasi Password Baru harus sama.')
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
        <aside className="left w-full xl:h-full md:h-full xl:flex-1 md:flex-1 flex-1 bg-white flex justify-center items-center">
            <form className="w-full p-10 flex flex-col items-center justify-center font-Poppins gap-3">
                <h1 className="font-Poppins text-[#FF4081] font-semibold xl:text-3xl md:text-2xl text-xl">Buat Password Barumu</h1>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="Username text-[#121212] text-lg font-semibold">Password Baru</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Password barumu"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    autoComplete="username"
                    ref={passwordBaruRef}
                    onKeyDown={(e) => handleKeyDown(e, konfirmasiPasswordBaruRef)}
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-1">
                    <h1 className="kataKunci text-[#121212] text-lg font-semibold">Konfirmasi Password Baru</h1>
                    <input type="text" className="w-full p-3 border border-[#121212] text-[#121212] outline-none"
                    placeholder="Konfirmasi Password barumu"
                    value={konfirmasiPasswordBaru}
                    onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
                    autoComplete="current-kataKunci"
                    ref={konfirmasiPasswordBaruRef}
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-1">
                    <h1 className="text-[#FF0000] font-Poppins text-base italic">{logError}</h1>
                </div>
                <div className="w-full flex items-center justify-end gap-1">
                    <button className="w-1/3 p-2 bg-[#FF4081] text-[#FFFFFF] font-Poppins font-semibold hover:bg-[#c2265a] transition-all ease duration-100"
                    type="submit"
                    onClick={handlePulihkanAkun}
                    >Lanjut</button>
                </div>
            </form>
        </aside>
        <aside className="xl:h-full md:h-full right xl:flex-1 md:flex-1 flex-[2] flex flex-col justify-center items-center gap-2">
            <div className="logo flex">
              <h1 className="text-3xl text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
              <h1 className="text-3xl text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
            </div>
            <div className="flex">
                <h1 className="text-[#FFFFFF] font-Poppins text-xl font-semibold">
                    Ayo buat pssword barumu!
                </h1>
            </div>
        </aside>
    </div>
  )
}

export default PasswordBaru