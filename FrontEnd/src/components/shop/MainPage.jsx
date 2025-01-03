import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
// import img1 from "../../public/imgproduct/img1.jpeg"
import { FaStar } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { SiFireship } from "react-icons/si";
import PropTypes from "prop-types";

const MainPage = ( {trendingProductRef, allProductRef} ) => {
    const [product, setProduct] = useState([]);
    const [trendingProduct, setTrendingProduct] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(15); 
    const [visibleCountTrending, setVisibleCountTrending] = useState(5); 
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [increment, setIncrement] = useState(0);
    const [trendingIncrement, setTrendingIncrement] = useState(0);
    
    const categories = ["Handphone", "Laptop", "Tablet", "Kamera", "Earbuds"];

    useEffect(() => {
        fetchProduct();
        getTrendingProduct();
        const updateVisibleCount = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1280) {
                setVisibleCount(15); // For large screens (e.g., desktops)
                setVisibleCountTrending(5);
                setIncrement(10);
                setTrendingIncrement(5);
            } else if (screenWidth >= 768) {
                setVisibleCount(12); // For medium screens (e.g., tablets)
                setVisibleCountTrending(4);
                setIncrement(6);
                setTrendingIncrement(4);
            } else {
                setVisibleCount(8); // For small screens (e.g., phones)
                setVisibleCountTrending(4);
                setIncrement(8);
                setTrendingIncrement(4);
            }
        };
    
        // Set initial counts
        updateVisibleCount();
    
        // Add event listener for resize
        window.addEventListener("resize", updateVisibleCount);
    
        // Clean up the event listener
        return () => {
            window.removeEventListener("resize", updateVisibleCount);
        };
    }, []);

    useEffect(() => {
        const refreshFlag = localStorage.getItem('refreshMainPage');
        if (refreshFlag === 'true') {
            localStorage.removeItem('refreshMainPage'); // Clear the flag
            window.location.reload();
        }
    }, []);
    
    const getTrendingProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/trending');
            setTrendingProduct(response.data);
            console.log(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false)
        }
    }

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                selectedCategories.length > 0
                ? `http://localhost:3001/api/filter/${selectedCategories.join(',')}`
                : 'http://localhost:3001/api/product'
            )
            setProduct(response.data);
            console.log(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    

    const handleCheckboxChange = (category) => {
        setSelectedCategories((prev) =>
          prev.includes(category)
            ? prev.filter((item) => item !== category) // Remove category if unchecked
            : [...prev, category] // Add category if checked
        );
      };
      
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
      
    const images = [
    '/imgSlider/slider1.png',
    '/imgSlider/slider2.png',
    '/imgSlider/slider3.png',
    ];  
    
    useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        slider.scrollTo({
        left: nextIndex * slider.offsetWidth,
        behavior: "smooth",
        });
    }, 3000);

    return () => clearInterval(interval);
    }, [currentIndex, images.length]);

    const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const newIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
    setCurrentIndex(newIndex);
    };
    
    const goToNext = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    slider.scrollTo({
        left: nextIndex * slider.offsetWidth,
        behavior: "smooth",
    });
    };

    const goToPrev = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    slider.scrollTo({
        left: prevIndex * slider.offsetWidth,
        behavior: "smooth",
    });
    };
    
    const handleMouseOver = () => {
        const prevBtn = document.getElementById('prevBtn')
        const nextBtn = document.getElementById('nextBtn')
    
        prevBtn.classList.replace('-left-5', 'left-0')
        prevBtn.classList.replace('opacity-0', 'opacity-100')
        prevBtn.classList.replace('pointer-events-none', 'pointer-events-auto')
      
        nextBtn.classList.replace('-right-5', 'right-0')
        nextBtn.classList.replace('opacity-0', 'opacity-100')
        nextBtn.classList.replace('pointer-events-none', 'pointer-events-auto')
      }
      
      const handleMouseOut = () => {
        const prevBtn = document.getElementById('prevBtn')
        const nextBtn = document.getElementById('nextBtn')
        
        prevBtn.classList.replace('left-0', '-left-5')
        prevBtn.classList.replace('opacity-100', 'opacity-0')
        prevBtn.classList.replace('pointer-events-auto', 'pointer-events-none')
      
        nextBtn.classList.replace('right-0', '-right-5')
        nextBtn.classList.replace('opacity-100', 'opacity-0')
        nextBtn.classList.replace('pointer-events-auto', 'pointer-events-none')
      }
    

    if (loading) {
        return (
            <div className="w-full p-5 h-auto flex justify-endi tems-center">
                <main className="w-full flex justify-center items-center">
                    <p className="text-white text-3xl">loading....</p>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full p-5 h-auto flex justify-end items-center">
                <main className="w-auto flex justify-center items-center">
                    <h1 className="text-[#FFFFFF] text-[1rem]">Error: {error}</h1>
                </main>
            </div>
        )
    }

    const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('id-ID', {
          style: 'decimal',
          minimumFractionDigits: 0,
        });
        return formatter.format(amount);
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
          return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
      };
    
      
    const showMoreProducts = () => {
        setVisibleCount((prevCount) => prevCount + increment);
    };

    const showMoreTrendingProducts = () => {
        setVisibleCountTrending((prevCount) => prevCount + trendingIncrement);
    };


    return (
        <>
        <div className="w-full px-5 h-auto flex flex-col justify-center items-center mt-5">
            <div className="w-full h-auto flex justify-center items-center xl:mt-24 mt-16">
                <div className="w-[90%] relative flex justify-center items-center" 
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                >
                    <div className="sliderCon w-full aspect-[3/1] flex items-center overflow-x-scroll" 
                        ref={sliderRef}
                        onScroll={handleScroll}
                        style={{scrollSnapType: "x mandatory"}}
                    >
                    {images.map((src, index) => (
                    <div key={index} className="w-full h-full shrink-0">
                        <img         
                            src={src}
                            alt={`slide${index + 1}`} 
                            className='w-full h-full snap-start' 
                            draggable={false}
                        />
                    </div>
                    ))}
                    </div>
                    <button 
                        id='prevBtn'
                        onClick={goToPrev}
                        className="prev absolute text-white p-2 -left-5 opacity-0 pointer-events-none transition-all ease-in duration-200 xl:text-3xl text-xl"><IoIosArrowDropleftCircle/></button>
                    <button
                        id='nextBtn'
                        onClick={goToNext}
                        className="next absolute text-white p-2 -right-5 opacity-0 pointer-events-none transition-all ease-in duration-200 xl:text-3xl text-xl"><IoIosArrowDroprightCircle
                        /></button>
                </div>
            </div>
            <div className="w-[95%] flex flex-col justify-center items-end p-5 mt-10 m-auto rounded-xl bg-[#424242]"
            ref={trendingProductRef}
            >
                <header className="w-full mb-4 flex justify-start items-center relative ">
                    <div className="relative h-auto w-auto flex justify-center items-center bg-[#424242] z-10 gap-1">
                        <SiFireship className="text-[#FF4081] z-10 xl:text-2xl text-lg"/>
                        <h1 className="text-[#FFFFFF] xl:text-3xl text-lg font-Montserrat font-semibold relative">Yang Lagi Trending Nih</h1> 
                    </div> 
                </header>
                <main className="w-full flex flex-col justify-start items-center ">
                    <div className="w-auto grid xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-7 ">
                        {trendingProduct.slice(0, visibleCountTrending).map((product) => {
                            return (
                                <Link to={`product/${product.id}`}
                                    key={product.id}
                                    className="aspect-video flex justify-start items-center rounded-xl shadow-[rgba(255, 255, 255, 0.24) 0px 3px 8px;] bg-[#212121] overflow-hidden xl:gap-1 relative"
                                >
                                    <div className="h-full aspect-square overflow-hidden bg-white">
                                        <img
                                            src={`/imgProduct/img${product.id}.jpeg`}
                                            alt={product.nama}
                                            className="w-full h-full object-contain object-center"
                                        />
                                    </div>
                                    <div className="w-full h-auto xl:px-2 px-1 text-start no-wrap overflow-hidden flex flex-col items-start justify-start gap-[2px]">
                                        <h1 className="text-[#FFFFFF] xl:text-[0.8rem] lg:text-[0.7rem] text-[0.5rem] line-clamp-1">{product.nama}</h1>
                                        <div className="w-full flex items-center justify-start gap-[3px]">
                                            <h1 className="xl:text-[0.9rem] lg:text-[0.75rem] text-[0.6rem] font-semibold text-[#FF4081]">Rp</h1>
                                            <h1 className="xl:text-[0.9rem] lg:text-[0.75rem] text-[0.6rem] font-semibold text-[#FFFFFF]">{formatCurrency(product.harga)}</h1>
                                        </div>
                                        <div className="w-auto flex items-center justify-start gap-1">
                                            <FaStar className="text-yellow-400 xl:text-base text-[0.6rem]" />
                                            <h1 className="flex items-center gap-1 xl:text-sm text-[0.6rem] text-[#FFFFFF]">{product.rating}</h1>
                                        </div>
                                        <div className="w-full xl:flex lg:flex items-center justify-start hidden">
                                            <div className="w-auto flex justify-start items-center gap-1">
                                                <GrMapLocation className="text-[#FF4081] xl:text-base text-[0.7rem]"/>
                                                <h1 className="text-white xl:text-xs text-[0.5rem]">{product.lokasi}</h1>
                                            </div>
                                        </div>
                                        <div className="w-auto flex justify-end items-center gap-1">
                                            <h1 className="text-[#FFFFFF] xl:text-[0.775rem] text-[0.5rem] italic">{formatNumber(product.terjual)}</h1>
                                            <h1 className="text-[#FF4081] xl:text-[0.775rem] text-[0.5rem]">terjual</h1>
                                        </div>
                                    </div>
                                    <SiFireship className="absolute right-1 top-1 text-[#FF4081] xl:text-xl text-xs"/>
                                </Link>
                            );
                        })}
                    </div>
                    {visibleCountTrending < trendingProduct.length && (
                        <button
                            onClick={showMoreTrendingProducts}
                            className="flex flex-col justify-center items-center seeMore px-4 py-2 text-white"
                        >
                            <p className="font-Montserrat text-base">see more</p>
                            <IoIosArrowDown size={15}/>
                        </button>
                    )}
                </main>
            </div>
            <div className="w-full px-5 h-auto flex flex-col justify-center items-center mt-5"
            ref={allProductRef}
            >
                <header className="w-full flex justify-start items-center mb-4 relative border-b-2 border-[#FF4081]">
                    <h1 className="headerProduct p-2 flex justify-center items-center text-[#FFFFFF] xl:text-3xl text-xl font-Montserrat font-semibold z-10 relative">Produk Kami</h1>
                </header>
                <main className="w-full flex flex-col xl:flex-row sm:flex-row justify-between items-start relative">
                    <div className="xl:w-1/5 sm:w-1/4 w-full flex flex-col justify-center items-center p-3 rounded-xl bg-[#212121] xl:sticky sm:sticky xl:top-24 sm:top-20">
                        <header className="w-full flex justify-start items-center border-b-2 border-white">
                            <h1 className="filterHeader font-Poppins xl:text-xl text-base text-white relative">Filter Produk</h1>
                        </header>
                        <main className="w-full flex flex-col justify-center items-start mt-2 xl:gap-3 gap-1">
                            <h1 className="font-Poppins xl:text-base sm:text-base text-sm text-[#FF4081]">Kategori</h1>
                            <div className="w-full xl:gap-3 xl:flex xl:flex-col xl:justify-center xl:items-start sm:gap-1 sm:flex sm:flex-col sm:justify-center sm:items-start grid grid-cols-2 gap-[1px]">
                                {categories.map((category) => (
                                    <div key={category} className="xl:w-full sm:w-full w-auto flex items-center justify-start gap-2">
                                        <input type="checkbox" name="kategori" className="appearance-none xl:h-5 xl:w-5 sm:h-4 sm:w-4 h-3 w-3 bg-[#212121] border-2 border-[#FF4081] checked:bg-[#FF4081] xl:rounded-md rounded-full" 
                                        value={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCheckboxChange(category)}
                                        />
                                        <span className="text-white xl:text-sm sm:text-base text-[0.7rem] font-Poppins">{category}</span>
                                    </div>
                                ))}
                            </div>
                        <button className="p-2 px-5 bg-[#FF4081] font-Poppins font-meidum text-[#FFFFFF] transition-all ease duration-200 rounded-lg hover:bg-[#ff4080b1]"
                        onClick={() => fetchProduct()}
                        >Terapkan</button>
                        </main>
                    </div>
                    <div className="w-full flex flex-col justify-start items-center xl:mt-0 mt-3">
                        <div className="w-auto grid xl:grid-cols-5 lg:grid-cols-4 gap-7 sm:grid-cols-3 grid-cols-2">
                            {product.slice(0, visibleCount).map((product) => {
                                return (
                                <Link to={`product/${product.id}`} key={product.id} className="xl:w-44 w-36 xl:aspect-[3/5] aspect-[3/5] flex flex-col justify-start items-center rounded-xl shadow-[rgba(255, 255, 255, 0.24) 0px 3px 8px;] bg-[#212121] overflow-hidden gap-1">
                                    <div className="w-full aspect-square overflow-hidden bg-white">
                                        <img src={`/imgProduct/img${product.id}.jpeg`} alt={product.nama} className="w-full h-full object-contain object-center"/>
                                    </div>
                                    <div className="w-full h-auto xl:px-2 px-2 text-start no-wrap overflow-hidden flex flex-col itmes-start justify-start xl:gap-[2px] gap-[1px]">
                                        <h1 className="text-[#FFFFFF] xl:text-[0.8rem] text-[0.7rem] line-clamp-1">{product.nama}</h1>
                                        <div className="w-full flex items-center justify-start gap-[3px]">
                                            <h1 className="xl:text-[0.9rem] text-[0.7rem] font-semibold text-[#FF4081]">Rp</h1>
                                            <h1 className="xl:text-[0.9rem] text-[0.7rem] font-semibold text-[#FFFFFF]">{formatCurrency(product.harga )}</h1>
                                        </div>
                                        <div className="w-auto flex items-center justify-start xl:gap-1 gap-[2px]">
                                            <FaStar className="text-yellow-400 xl:text-base text-[0.7rem]"/>
                                            <h1 className="flex items-center gap-1 xl:text-sm text-[0.7rem] text-[#FFFFFF]">{product.rating}</h1>
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <div className="w-auto flex justify-start items-center xl:gap-1 gap-[2px]">
                                                <GrMapLocation className="text-[#FF4081] xl:text-lg text-[0.7rem]"/>
                                                <h1 className="text-white xl:text-sm text-[0.7rem]">{product.lokasi}</h1>
                                            </div>
                                        </div>
                                        <div className="w-full flex items-center justify-start">
                                            <div className="w-auto flex justify-start items-center xl:gap-1 gap-[2px]">
                                                <h1 className="text-[#FFFFFF] xl:text-[0.775rem] text-[0.7rem] italic">{formatNumber(product.terjual)}</h1>
                                                <h1 className="text-[#FF4081] xl:text-[0.775rem] text-[0.7rem]">terjual</h1>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                );
                            })}
                        </div>
                        {visibleCount < product.length && (
                        <button
                            onClick={showMoreProducts}
                            className="flex flex-col justify-center items-center seeMore px-4 py-2 text-white"
                        >
                            <p className="font-Montserrat text-base">see more</p>
                            <IoIosArrowDown size={15}/>
                        </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
        </>
    )
}

MainPage.propTypes = {
    trendingProductRef: PropTypes.object.isRequired,
    allProductRef: PropTypes.object.isRequired
}

export default MainPage