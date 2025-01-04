import axios from "axios";
import { emitter } from "./eventEmitter";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
// import { MdLogout } from "react-icons/md";
// import { CiLogin } from "react-icons/ci";
import { useSidebar, useUser } from "./ManageContext";

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [currentPlaceholders, setCurrentPlaceholders] = useState('Apa yang kamu cari?');
  const [height, setHeight] = useState('0rem');
  const [isClick, setIsClick] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchSuggest, setSearchSuggest] = useState([]);
  const [isSearch, setIsSearch] = useState(true);

  const {handleSidebar} = useSidebar();
  const {username} = useUser();

  const navigate = useNavigate();
  const burgerNavRef = useRef(null);
  const overlayRef = useRef(null)
  const searchSuggestRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const mobileSearchSuggestRef = useRef(null)
  const historiSpanRef = useRef(null)

  const fetchData = async () => {
    const response = await axios.get('http://cawop.h.filess.io:3307/api/product');
    const names = response.data.map((item) => item.nama);
    setPlaceholders(names);
  }  

  const fetchDataCart = async () => {
    const response = await axios.get(`http://cawop.h.filess.io:3307/api/cartByUser/${username}`);
    setCartItems(response.data);
  };

  const getSearchSuggest = async () => {
    try {
      const response = await axios.get(`http://cawop.h.filess.io:3307/api/search/${keyword}`)
      setSearchSuggest(response.data);
    } catch (err) {
      console.log(err.message)
    }
  }

  // useState(() => {
  //   getSearchSuggest()
  //   console.log('rendered')
  // }, [keyword])

  const dynamicPlaceholders = () => {
    if (placeholders.length > 0) {
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      setCurrentPlaceholders(placeholders[randomIndex]);
    }
  };

  useEffect(() => {
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

  const handleSearchFocus = () => {
    const overlay = overlayRef.current;
    overlay.style.display = "block";
    searchSuggestRef.current.style.display = "flex";
  }

  function handleBlur() {
    const searchLabel = document.getElementById('searchLabel');
    const overlay = overlayRef.current;
    overlay.style.display = "none";
    searchSuggestRef.current.style.display = "none"
    if(keyword.length !== 0){
      searchLabel.classList.replace('hidden', 'hidden');
    } else {
      searchLabel.classList.replace('hidden', 'block');
    }
    dynamicPlaceholders();
  }

  function handleSearch() {
    handleBlur();
    setKeyword('')
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

  const handleMobileSearch = () => {
    setIsSearch(!isSearch);
    if(isSearch === true) {
      mobileSearchRef.current.style.display = "block";
    } else {
      mobileSearchRef.current.style.display = "none";
    }
  }

  const handleMobileSearchFocus = () => {
    const overlay = overlayRef.current;
    overlay.style.display = "block";
    mobileSearchSuggestRef.current.style.display = "flex";
  }

  const handleMobileSearchBlur = () => {
    setIsSearch(!isSearch)
    const overlay = overlayRef.current;
    overlay.style.display = "none";
    mobileSearchRef.current.style.display = "none"
    mobileSearchSuggestRef.current.style.display = "none"
  } 

  const highlightMatch = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi"); // Create a case-insensitive regex
    const parts = text.split(regex); // Split text into matched and unmatched parts
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="text-[#FF4081] font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  

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

  // const handleClickBurger = () => {
  //   setIsClick(!isClick)
  //   const burger = burgerNavRef.current;
  //   if(isClick === true){
  //     burger.classList.replace('flex' ,'hidden');
  //   } else {
  //     burger.classList.replace('hidden', 'flex');
  //   }
  // }

  // const handleScrollTo = () => {
  //   if (fileRef.current) {
  //     fileRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }

  const historiHover = () => {
    const historiSpan = historiSpanRef.current;
    historiSpan.classList.replace('opacity-0', 'opacity-100');
  }

  const historiLeaveHover = () => {
    const historiSpan = historiSpanRef.current;
    historiSpan.classList.replace( 'opacity-100', 'opacity-0');
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
      <div ref={overlayRef} style={{display: 'none'}} className="overlay z-40"></div>
      <div className="w-full fixed z-50 top-0">
          <nav className="w-full xl:h-20 sm:w-h-20 h-16 p-4 bg-[#212121] flex justify-between items-center gap-5 relative">
            <div className="leftNav w-1/5">
              <div className="logo flex">
                <h1 className="xl:text-3xl sm:text-lg text-base text-[#FFFFFF] tracking-wide font-Parkinsans font-medium">Gadget</h1>
                <h1 className="xl:text-3xl sm:text-lg text-base text-[#FF4081] tracking-wide font-Parkinsans font-medium italic">.kuy</h1>
              </div>
            </div>
            <div className="searchBar flex-1 xl:flex sm:flex hidden z-50">
              <div className="w-full relative flex justify-center items-center z-50">
                <input id="searchInput" className="w-full outline-none xl:p-2 p-1 xl:px-4 px-3 rounded-full border-[#FFFFFF] xl:border-2 border bg-[#424242] text-[#FFFFFF] appearance-none z-50"
                type="text"
                value={keyword}
                onBlur={handleBlur}
                onFocus={handleSearchFocus}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  getSearchSuggest()
                }}
                onKeyDown={handleKeyDown}/>
                <label id="searchLabel" className={`absolute xl:left-5 left-3 text-[#ffffffa7] pointer-events-none ${keyword.trim() ? 'hidden' : 'block'} z-50`}>{currentPlaceholders}</label>
                <button
                onClick={handleSearch} 
                className="absolute xl:right-5 right-3 text-[#FFFFFF] xl:text-2xl text-xl z-50"><IoIosSearch /></button>
                <div ref={searchSuggestRef} style={{display: 'none'}} className="w-full flex flex-col items-center justify-start bg-[#121212] absolute top-full z-50">
                  {keyword.length === 0 ? (
                    <div className=""></div>
                  ) : (
                    searchSuggest.map((item) => (
                      <button 
                      onClick={() => {
                        navigate(`/product/${item.id}`)
                        handleBlur();
                        setKeyword('');
                      }}
                      key={item.id} 
                      className="w-full p-2 flex items-center justify-start border-b-[1px] border-b-white gap-2">
                        <div className="w-10 aspect-square overflow-hidden bg-white">
                          <img 
                            src={`/imgProduct/img${item.id}.jpeg`}
                            alt={item.nama} 
                            className="w-full h-full object-contain"
                            />
                        </div>
                        <h1 className="font-Poppins text-base font-medium text-[#FFFFFF]">{highlightMatch(item.nama, keyword)}</h1>
                      </button>
                    ))
                  )} 
                </div>
              </div>
            </div>
            <div className="rightNav xl:w-1/5 sm:w-1/5 w-1/2 flex justify-end items-center text-[#FFFFFF] gap-3 sm:gap-5 text-nowrap text-base font-Poppins">
              <div className="flex items-center gap-3">
                <button 
                onClick={handleMobileSearch}
                className="sm:hidden block">
                  <IoIosSearch className="text-2xl text-[#FF4081]"/>
                </button>
                <div className="w-auto flex items-center justify-center relative">
                  <button className="sm:text-3xl text-2xl text-[#FF4081]"
                  onMouseOver={historiHover}
                  onMouseOut={historiLeaveHover}
                  onClick={() => navigate('/checkout')}
                  >
                    <MdHistory />
                  </button>
                  <div ref={historiSpanRef} className="sm:p-2 p-1 absolute top-full rounded-lg bg-[#12121289] border border-[#ffffffb3] text-[#ffffffb3] sm:text-sm text-[0.7rem] pointer-events-none opacity-0 transition-all ease duration-200">Histori Pembelian</div>
                </div>
                <button
                  id="cart" 
                  className="flex items-center justify-center aspect-square rounded-lg relative"
                  onMouseOver={handleCartOver}
                  onMouseOut={handleCartOut}
                  onClick={() => {
                    navigate('/cart')
                    handleCartOut();
                  }}
                >
                  <div className="w-auto h-auto relative cursor-pointer">
                    <IoCartOutline className="text-[#FF4081] xl:text-3xl sm:w-text-3xl text-2xl" />
                    {cartItems.length > 0 && (
                      <div className="w-auto h-auto bg-[white] rounded-full absolute px-0.5 bottom-0 right-0 z-20 xl:block hidden">
                        <h1 className="text-xs font-Poppins font-semibold text-[#121212]">{cartItems.length}</h1>
                      </div>
                    )}
                  </div>
                  <div 
                    id="cartContainer" 
                    className="styledScroll keranjang w-[28rem] xl:hidden hidden overflow-auto bg-white rounded-xl absolute top-full right-0 flex-col items-center shadow-lg z-[100]"
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
                                src={`/imgProduct/img${items.product_id}.jpeg`} 
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
                <button
                onClick={handleSidebar}
                className="xl:w-6 sm:w-w-6 w-5 p-[2px] aspect-square flex flex-col items-end justify-between">
                  <div className="w-full h-[2px] bg-[#FF4081]"></div>
                  <div className="w-2/3 h-[2px] bg-[#FF4081]"></div>
                  <div className="w-1/3 h-[2px] bg-[#FF4081]"></div>
                </button>
              </div>
            </div>
            <div ref={mobileSearchRef} style={{display: 'none'}} className="searchBar w-full sm:hidden z-50 absolute top-[105%] left-0">
              <div className="w-full relative flex justify-center items-center z-50">
                <input id="searchInput" className="w-full outline-none sm:p-2 p-2 sm:px-4 px-3 rounded-full border-[#FFFFFF] xl:border-2 border bg-[#424242] text-[#FFFFFF] sm:text-base text-sm appearance-none z-50"
                type="text"
                value={keyword}
                onBlur={handleMobileSearchBlur}
                onFocus={handleMobileSearchFocus}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  getSearchSuggest()
                }}
                onKeyDown={handleKeyDown}/>
                <label id="searchLabel" className={`absolute xl:left-5 left-3 text-[#ffffffa7] pointer-events-none ${keyword.trim() ? 'hidden' : 'block'} z-50 sm:text-base text-sm`}>{currentPlaceholders}</label>
                <button
                onClick={handleSearch} 
                className="absolute xl:right-5 right-3 text-[#FFFFFF] xl:text-2xl text-xl z-50"><IoIosSearch /></button>
                <div ref={mobileSearchSuggestRef} style={{display: "none"}} className="w-full flex flex-col items-center justify-start bg-[#121212] absolute top-full z-50">
                  {keyword.length === 0 ? (
                    <div className=""></div>
                  ) : (
                    searchSuggest.map((item) => (
                      <button 
                      onClick={() => {
                        navigate(`/product/${item.id}`)
                        handleBlur();
                        setKeyword('');
                      }}
                      key={item.id} 
                      className="w-full p-2 flex items-center justify-start border-b-[1px] border-b-white gap-2">
                        <div className="sm:w-10 w-8 aspect-square overflow-hidden bg-white">
                          <img 
                            src={`/imgProduct/img${item.id}.jpeg`}
                            alt={item.nama} 
                            className="w-full h-full object-contain"
                            />
                        </div>
                        <h1 className="font-Poppins sm:text-base text-sm font-medium text-[#FFFFFF]">{highlightMatch(item.nama, keyword)}</h1>
                      </button>
                    ))
                  )} 
                </div>
              </div>
            </div>
          </nav>
      </div>
    </>
  )
}

// Navbar.propTypes = {
//   fileRef: PropTypes.object.isRequired,
//   setIsBarClick: PropTypes.bool.isRequired
// }

export default Navbar