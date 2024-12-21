import axios from "axios";
import { emitter } from "./eventEmitter";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { CiLogin } from "react-icons/ci";

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [currentPlaceholders, setCurrentPlaceholders] = useState('Apa yang kamu cari?');
  const [height, setHeight] = useState('0rem');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [initialUsername, setInitialUsername] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const burgerNavRef = useRef(null);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3001/shop');
    const names = response.data.map((item) => item.nama);
    setPlaceholders(names);
  }  

  const fetchDataCart = async () => {
    const response = await axios.get('http://localhost:3001/cart');
    setCartItems(response.data);
  };

  const dynamicPlaceholders = () => {
    if (placeholders.length > 0) {
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      setCurrentPlaceholders(placeholders[randomIndex]);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.user) {
        setLoggedInUser(user.user);
        setInitialUsername(user.user.username[0]);
      } 
    } else {
      setLoggedInUser(null);
    }

    const searchLabel = document.getElementById('searchLabel');
    searchLabel.classList.replace('hidden', 'hidden');
    fetchData();
    fetchDataCart();
    const handleCartUpdate = () => {
      fetchDataCart();
    };

    emitter.on('cartUpdated', handleCartUpdate);

    return () => {
      emitter.off('cartUpdated', handleCartUpdate);
    };
  }, [])

  const handleClickProfile = () => {
    const profile = profileRef.current;
    setIsClick(!isClick);
    if (isClick === true) {
      profile.style.display = "none";
    } else {
      profile.style.display = "block";
    }
  }

  const handleBlurProfile = () => {
    const profile = profileRef.current;
    profile.style.display = "none";
  }

  const handleLogOut = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    navigate('/'); 
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
      burgerNavRef.current.classList.replace('flex', 'hidden');
      setIsClick(!isClick)
    }
  }

  function handleCartOver(){
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.classList.replace('xl:hidden', 'xl:flex')
    setHeight('30rem');
  }

  function handleCartOut(){
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.classList.replace('xl:flex', 'xl:hidden')    
    setHeight('0rem');
  }

  const handleClickBurger = () => {
    setIsClick(!isClick)
    const burger = burgerNavRef.current;
    if(isClick === true){
      burger.classList.replace('flex' ,'hidden');
    } else {
      burger.classList.replace('hidden', 'flex');
    }
  }

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  return (
    <>
      <div className="w-full fixed z-20 top-0">
          <nav className="w-full xl:h-20 md:h-20 h-16 p-4 bg-[#212121] flex justify-between items-center gap-5 relative">
            <div className="leftNav w-1/4">
              <div className="logo flex">
                <h1 className="xl:text-3xl sm:text-lg text-base text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
                <h1 className="xl:text-3xl sm:text-lg text-base text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
              </div>
            </div>
            <div className="searchBar w-1/2 xl:block hidden">
              <div className="w-full relative flex justify-center items-center">
                <input id="searchInput" onBlur={handleBlur} type="text" className="w-full outline-none xl:p-2 p-1 xl:px-4 px-3 rounded-full border-[#FFFFFF] xl:border-2 border bg-[#424242] text-[#FFFFFF]"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}/>
                <label id="searchLabel" className={`absolute xl:left-5 left-3 text-[#ffffffa7] pointer-events-none ${keyword.trim() ? 'hidden' : 'block'}`}>{currentPlaceholders}</label>
                <button
                onClick={handleSearch} 
                className="absolute xl:right-5 right-3 text-[#FFFFFF] text-xl"><IoIosSearch /></button>
              </div>
            </div>
            <div className="rightNav xl:w-1/4 w-1/2 flex justify-end items-center text-[#FFFFFF] gap-3 md:gap-5 text-nowrap text-base font-Poppins">
              <div className="flex items-center gap-3">
                <button
                  id="cart" 
                  className="flex-1 flex items-center justify-center aspect-square rounded-lg relative"
                  onMouseOver={handleCartOver}
                  onMouseOut={handleCartOut}
                  onClick={() => {
                    navigate('cart');
                    handleCartOut();
                  }}
                >
                  <div className="w-auto h-auto relative cursor-pointer">
                    <IoCartOutline className="text-[#FF4081] xl:text-3xl md:text-3xl text-2xl" />
                    {cartItems.length > 0 && (
                      <div className="w-auto h-auto bg-[white] rounded-full absolute px-0.5 bottom-0 right-0 z-20 xl:block hidden">
                        <h1 className="text-xs font-Poppins font-semibold text-[#121212]">{cartItems.length}</h1>
                      </div>
                    )}
                  </div>
                  <div 
                    id="cartContainer" 
                    className="keranjang w-[28rem] xl:hidden hidden overflow-y-scroll bg-white rounded-xl absolute top-full left-1/2 -translate-x-1/2 flex-col items-center shadow-lg"
                    style={{
                      maxHeight: height,
                      padding: '1rem',
                    }}
                  >
                    <header className="w-full flex items-center text-[#212121] text-base font-Poppins font-semibold p-1 border-b border-[#212121]">
                      Keranjang
                    </header>
                    <main className="w-full flex flex-col m-auto p-2 gap-2">
                      {cartItems.length === 0 ? (
                        <div className="w-full h-full flex flex-col justify-center items-center text-center m-auto gap-2">
                          <h1 className="font-Poppins text-base text-[#212121]">Belum ada barang nih...</h1>
                          <div className="px-3 py-1 rounded-lg border-2 border-[#FF4081] text-[#FF4081] font-Poppins cursor-pointer">
                            Yuk Belanja
                          </div>
                        </div>
                      ) : (
                        cartItems.map((items) => (
                          <div 
                            key={items.id} 
                            className="w-full h-auto flex justify-start items-start p-3 rounded-lg bg-[#212121] mt-2 gap-3 relative"
                          >
                            <div className="aspect-square overflow-hidden rounded-md bg-white w-1/5">
                              <img 
                                src={`/imgProduct/img${items.id}.jpeg`} 
                                alt={items.nama} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="w-4/5 flex flex-col items-start justify-start gap-1">
                              <h1 className="font-Poppins text-sm font-semibold text-[white]">{items.nama}</h1>
                              <h1 className="font-Poppins text-sm font-medium text-[white]">
                                Rp.{formatCurrency(items.harga)}
                              </h1>
                              <div className="flex gap-1">
                                <h1 className="font-Poppins text-sm font-medium text-[#FF4081]">jumlah :</h1>
                                <h1 className="font-Poppins text-sm font-medium text-[white]">{items.jumlah}</h1>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </main>
                  </div>
                </button>
                <Link to={'/'} className="flex-1 p-2 xl:block hidden">
                  Home
                </Link>
                <Link to={'/'} className="flex-1 p-2 xl:block hidden">
                  Tentang Kami
                </Link>
              </div>
              <div className="xl:flex-1 flex justify-center items-center">
                {loggedInUser === null ? ( 
                  <>
                  <Link
                  to={'/masuk'}
                  >
                    <CiLogin className="text-2xl text-[#FF4081] xl:text-3xl md:text-3xl"/>
                  </Link>
                  </>
                ) : (
                  <button className="xl:w-[100%] w-8 px-1 aspect-square bg-[#FF4081] rounded-full relative"
                  onClick={handleClickProfile}
                  >
                    <h1 className="text-[#FFFFFF] xl:text-2xl text-xl font-semibold pointer-events-none">
                      {initialUsername.toUpperCase()}
                    </h1>
                    <div ref={profileRef} className="p-5 rounded-lg bg-[#121212] border border-[#424242] absolute top-[110%] right-0 flex flex-col items-start justify-center"
                    onBlur={handleBlurProfile}
                    style={{display: 'none'}}
                    >
                      <div className="w-full flex items-center justify-between gap-3">
                        <div className="xl:px-4 px-2 aspect-square bg-[#FF4081] rounded-full font-Poppins font-semibold xl:text-3xl text-lg flex items-center justify-center">{initialUsername.toUpperCase()}</div>
                        <div className="flex flex-col items-start">
                          <h1 className="xl:text-base text-sm">Halo, {loggedInUser.username}</h1>
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-end mt-2 gap-1"
                      onClick={handleLogOut}
                      >
                        <MdLogout size={20}/>
                        <h1 className="xl:text-sm text-xs">Log Out</h1>
                      </button>
                    </div>
                  </button>
                )}            
              </div> 
              <button
              onClick={handleClickBurger}
              className="xl:hidden md:w-6 w-5 p-[2px] aspect-square flex flex-col items-end justify-between">
                <div className="w-full h-[2px] bg-[#FF4081]"></div>
                <div className="w-2/3 h-[2px] bg-[#FF4081]"></div>
                <div className="w-1/3 h-[2px] bg-[#FF4081]"></div>
              </button>
            </div>
            <div ref={burgerNavRef} className="xl:hidden w-full p-3 pb-20 absolute top-full left-1/2 -translate-x-1/2 bg-[#212121] hidden flex-col items-center justify-start gap-1">
              <div className="searchBar w-full xl:hidden">
                <div className="w-full relative flex justify-center items-center">
                  <input id="searchInput" onBlur={handleBlur} type="text" className="w-full outline-none xl:p-2 p-2 xl:px-4 px-3 rounded-full border-[#FFFFFF] xl:border-2 border bg-[#424242] text-[#FFFFFF]"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}/>
                  <label id="searchLabel" className={`absolute xl:left-5 left-3 text-[#ffffffa7] pointer-events-none ${keyword.trim() ? 'hidden' : 'block'}`}>{currentPlaceholders}</label>
                  <button
                  onClick={() => {
                    burgerNavRef.current.classList.replace('flex', 'hidden');
                    setIsClick(!isClick)
                    handleSearch()
                  }} 
                  className="absolute xl:right-5 right-3 text-[#FFFFFF] text-xl"><IoIosSearch /></button>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-start">
                <Link 
                to={'/'}
                onClick={() => {
                  burgerNavRef.current.classList.replace('flex', 'hidden');
                  setIsClick(!isClick)
                }}
                className="w-full p-1 text-[white] font-Poppins font-semibold text-base text-center border-y border-[#FFFFFF]">Home</Link>
                <Link 
                to={'/about'}
                onClick={() => {
                  burgerNavRef.current.classList.replace('flex', 'hidden');
                  setIsClick(!isClick)
                }}
                className="w-full p-1 text-[white] font-Poppins font-semibold text-base text-center border-y border-[#FFFFFF]">Tentang Kami</Link>
              </div>
            </div>
          </nav>
      </div>
    </>
  )
}

export default Navbar