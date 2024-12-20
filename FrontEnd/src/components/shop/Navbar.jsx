import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const [keyword, setKeyword] = useState(localStorage.getItem('searchKeyword') || '');
  const [placeholders, setPlaceholders] = useState([]);
  const [currentPlaceholders, setCurrentPlaceholders] = useState('Apa yang kamu cari?');
  const [cartItems, setCartItems] = useState([]);
  const [display, setDisplay] = useState('none');
  const [height, setHeight] = useState('0rem');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [initialUsername, setInitialUsername] = useState('');
  const [isClick, setIsClick] = useState(true);
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3001/shop');
    const names = response.data.map((item) => item.nama);

    setPlaceholders(names);
  }  

  const fetchDataCart = async () => {
    const response = await axios.get('http://localhost:3001/cart')
    setCartItems(response.data);
    console.log(response.data);
  }

  const dynamicPlaceholders = () => {
    if (placeholders.length > 0) {
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      setCurrentPlaceholders(placeholders[randomIndex]);
    }
  };

  useEffect(() => {
    localStorage.setItem('searchKeyword', keyword); // Store value in localStorage whenever it changes
  }, [keyword]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.user) {
            setLoggedInUser(user.user);
            setInitialUsername(user.user.username[0]);
        }
    } else {
        setLoggedInUser(null); // Fallback for logged out state
    }

    const searchLabel = document.getElementById('searchLabel');
    searchLabel.classList.replace('hidden', 'hidden');
    fetchData();
    fetchDataCart();
  }, [])

  const handleClickProfile = () => {
    const profile = profileRef.current;
    setIsClick(!isClick);
    if (isClick === true) {
      profile.style.display = "block";
    } else {
      profile.style.display = "none";
    }
  }

  const handleBlurProfile = () => {
    const profile = profileRef.current;
    profile.style.display = "none";
  }

  const handleLogOut = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    navigate('/'); // Redirect to login
  };

  function handleBlur() {
    const searchLabel = document.getElementById('searchLabel');
    if(keyword.length !== 0){
      searchLabel.classList.replace('hidden', 'hidden');
    } else {
      searchLabel.classList.replace('hidden', 'block');
    }
    dynamicPlaceholders();
  }

  function handleSearch() {
    if (keyword.trim() !== '') {
      navigate(`/search/${keyword}`);
    } else {
      navigate(`/search/${currentPlaceholders}`)
    }
  }
  
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
  }

  function handleCartOver(){
    setDisplay('flex');
    setHeight('30rem');
  }

  function handleCartOut(){
    setDisplay('none');
    setHeight('0rem');
  }

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  // const formatNumber = (num) => {
  //   if (num >= 1000) {
  //     return `${(num / 1000).toFixed(1)}k`;
  //   }
  //     return num.toString();
  //   };

  return (
    <>
      <div className="w-full fixed z-20 top-0">
          <nav className="w-full h-20 p-4 bg-[#212121] flex justify-between items-center gap-5">
            <div className="leftNav flex-1">
              <div className="logo flex">
                <h1 className="text-3xl text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
                <h1 className="text-3xl text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
              </div>
            </div>
            <div className="searchBar flex-[3]">
              <div className="w-full relative flex justify-center items-center">
                <input id="searchInput" onBlur={handleBlur} type="text" className="w-full outline-none p-2 px-4 rounded-full border-[#FFFFFF] border-2 bg-[#424242] text-[#FFFFFF]"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}/>
                <label id="searchLabel" className={`absolute left-5 text-[#ffffffa7] pointer-events-none ${keyword.trim() ? 'hidden' : 'block'}`}>{currentPlaceholders}</label>
                <button
                onClick={handleSearch} 
                className="absolute right-5 text-[#FFFFFF]"><IoIosSearch size={30}/></button>
              </div>
            </div>
            <div className="rightNav flex-1 flex justify-center items-center text-[#FFFFFF] gap-5 text-nowrap text-base font-Poppins ">
              <div className="flex-[3] flex items-center gap-5 px-5">
                <button id="cart" className="flex-1 flex items-center justify-center aspect-square rounded-lg relative"
                onMouseOver={handleCartOver} onMouseOut={handleCartOut}
                onClick={() => {
                  navigate('cart') 
                  handleCartOut()
                }}
                >
                  <div className="w-auto h-auto relative">
                    <IoCartOutline size={30} className="text-[#FF4081]"/>
                    <div className="w-auto h-auto bg-[white] rounded-full absolute px-0.5 bottom-0 right-0 z-20">
                      {cartItems.length === 0 ? (
                        <h1 className="text-xs font-Poppins font-semibold text-[#121212] aspect-square"></h1>
                      ) : (
                        <h1 className="text-xs font-Poppins font-semibold text-[#121212] aspect-square">{cartItems.length}</h1>
                      )}
                    </div>
                  </div>
                  <span id="cartContainer" className="keranjang w-[28rem] overflow-y-scroll bg-white rounded-xl absolute top-full left-1/2 -translate-x-1/2 flex-col items-center"
                  style={{
                    maxHeight: `${height}`,
                    padding: '1rem',
                    display: `${display}`,
                  }}
                  >
                    <header className="w-full flex items-center text-[#212121] text-base font-Poppins font-semibold p-1 border-b border-[#212121]">Keranjang</header>
                    <main className="w-full flex flex-col m-auto p-2 gap-2">
                      {cartItems.length === 0 
                        ? (
                          <div className="w-full h-full flex flex-col justify-center items-center text-center m-auto gap-2">
                            <h1 className="font-Poppins text-base text-[#212121]">Belum ada barang nih...</h1>
                            <Link className="px-3 py-1 rounded-lg border-2 border-[#FF4081] text-[#FF4081] font-Poppins"
                            onClick={() => {
                              navigate('/')
                              handleCartOut();
                            }}
                            >Yuk Belanja</Link>
                          </div>
                        ) : (
                          cartItems.map((items) => (
                          <Link to={'cart'} onClick={() => handleCartOut()} key={items.id} className="w-full h-auto flex justify-start items-start p-3 rounded-lg bg-[#212121] mt-2 gap-3 relative" >
                            <div className="aspect-square overflow-hidden rounded-md bg-white w-1/5">
                              <img src={`/imgProduct/img${items.id}.jpeg`} alt={items.nama} className="w-full h-full object-contain"/>
                            </div>
                            <div className="w-4/5 flex flex-col items-start justify-start gap-1">
                              <h1 className="font-Poppins text-sm font-semibold text-[white]">{items.nama}</h1>
                              <h1 className="font-Poppins text-sm font-medium text-[white]">Rp.{formatCurrency(items.harga)}</h1>
                              <div className="flex gap-1">
                                <h1 className="font-Poppins text-sm font-medium text-[#FF4081]">jumlah :</h1>
                                <h1 className="font-Poppins text-sm font-medium text-[white]">{items.jumlah}</h1>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </main>
                  </span>
                </button>
                <Link to={'/'} className="flex-1 p-2">
                  Home
                </Link>
              </div>
              <div className="flex-1 flex justify-start items-center">
                {loggedInUser === null ? ( 
                  <Link to={'/masuk'} className="flex-[2] p-2 bg-[#FF4081] text-center font-semibold hover:bg-[#ff4080c4]">
                    Masuk/Daftar
                  </Link>
                ) : (
                  <button className="w-[80%] aspect-square bg-[#FF4081] rounded-full relative"
                  onClick={handleClickProfile}
                  >
                  <h1 className="text-[#FFFFFF] text-2xl font-semibold pointer-events-none">
                    {initialUsername.toUpperCase()}
                  </h1>
                  <div ref={profileRef} className="p-5 rounded-lg bg-[#121212] border border-[#424242] absolute top-[110%] right-0 flex flex-col items-start justify-center"
                  onBlur={handleBlurProfile}
                  style={{display: 'none'}}
                  >
                    <div className="w-full flex items-center justify-between gap-3">
                      <div className="px-4 aspect-square bg-[#FF4081] rounded-full font-Poppins font-semibold text-3xl flex items-center justify-center">{initialUsername.toUpperCase()}</div>
                      <div className="flex flex-col items-start">
                        <h1 className="">Halo, {loggedInUser.username}</h1>
                        <h1 className="">{loggedInUser.email}</h1>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-end mt-2 gap-1"
                    onClick={handleLogOut}
                    >
                      <MdLogout size={20}/>
                      <h1 className="text-sm">Log Out</h1>
                    </button>
                  </div>
                  </button>
                )}            
              </div> 
            </div>
          </nav>
      </div>
    </>
  )
}

export default Navbar