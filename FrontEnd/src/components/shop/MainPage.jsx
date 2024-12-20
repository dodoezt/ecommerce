import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
// import img1 from "../../public/imgproduct/img1.jpeg"
import { FaStar } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { SiFireship } from "react-icons/si";



const MainPage = () => {
    
    const [product, setProduct] = useState([]);
    const [trendingProduct, setTrendingProduct] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(15); 
    const [visibleCountTrending, setVisibleCountTrending] = useState(5); 
    const [selectedCategories, setSelectedCategories] = useState([]);
    const categories = ["Handphone", "Laptop", "Tablet", "Kamera", "Earbuds"];
    
    useEffect(() => {
        fetchProduct();
        getTrendingProduct();
    }, []);
    
    const getTrendingProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/trending');
            setTrendingProduct(response.data);
            console.log(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                selectedCategories.length > 0
                ? `http://localhost:3001/filter/${selectedCategories.join(',')}`
                : 'http://localhost:3001/shop'
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
    }, 5000); // Slide every 3 seconds

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
                    <p className="text-white">loading....</p>
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
        const increment = 10;
        setVisibleCount((prevCount) => prevCount + increment);
    };

    const showMoreTrendingProducts = () => {
        const increment = 5;
        setVisibleCountTrending((prevCount) => prevCount + increment);
    };


    return (
        <div className="w-full px-5 h-auto flex flex-col justify-center items-center mt-5">
            <div className="w-full h-auto flex justify-center items-center mt-24">
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
                        className="prev absolute text-white p-2 -left-5 opacity-0 pointer-events-none transition-all ease-in duration-200"><IoIosArrowDropleftCircle size={35}/></button>
                    <button
                        id='nextBtn'
                        onClick={goToNext}
                        className="next absolute text-white p-2 -right-5 opacity-0 pointer-events-none transition-all ease-in duration-200"><IoIosArrowDroprightCircle size={35}/></button>
                </div>
            </div>
            <div className="w-[95%] flex flex-col justify-center items-end p-5 mt-10 m-auto rounded-xl bg-[#424242]">
                <header className="w-full mb-4 flex justify-start items-center relative ">
                    <div className="relative h-auto w-auto flex justify-center items-center bg-[#424242] z-10">
                        <SiFireship className="text-[#FF4081] z-10" size={25}/>
                        <h1 className="text-[#FFFFFF] text-3xl font-Montserrat font-semibold relative">Yang Lagi Trending Nih</h1> 
                    </div> 
                </header>
                <main className="w-full flex flex-col justify-start items-center ">
                    <div className="w-auto grid grid-cols-5 gap-7">
                        {trendingProduct.slice(0, visibleCountTrending).map((product) => {
                            return (
                                <Link to={`product/${product.id}`}
                                    key={product.id}
                                    className="flex-1 aspect-video flex justify-start items-center rounded-xl shadow-[rgba(255, 255, 255, 0.24) 0px 3px 8px;] bg-[#212121] overflow-hidden gap-1 relative"
                                >
                                    <div className="h-full aspect-square overflow-hidden bg-white">
                                        <img
                                            src={`/imgProduct/img${product.id}.jpeg`}
                                            alt={product.nama}
                                            className="w-full h-full object-contain object-center"
                                        />
                                    </div>
                                    <div className="w-full h-auto px-2 text-start no-wrap overflow-hidden flex flex-col items-start justify-start gap-[2px]">
                                        <h1 className="text-[#FFFFFF] text-[0.8rem] line-clamp-1">{product.nama}</h1>
                                        <div className="w-full flex items-center justify-start gap-[3px]">
                                            <h1 className="text-[0.9rem] font-semibold text-[#FF4081]">Rp</h1>
                                            <h1 className="text-[0.9rem] font-semibold text-[#FFFFFF]">{formatCurrency(product.harga)}</h1>
                                        </div>
                                        <div className="w-auto flex items-center justify-start gap-1">
                                            <FaStar size={10} className="text-yellow-400" />
                                            <h1 className="flex items-center gap-1 text-sm text-[#FFFFFF]">{product.rating}</h1>
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <div className="w-auto flex justify-start items-center gap-1">
                                                <GrMapLocation className="text-[#FF4081]" size={15} />
                                                <h1 className="text-white text-xs">{product.lokasi}</h1>
                                            </div>
                                            <div className="w-auto flex justify-end items-center gap-1">
                                                <h1 className="text-[#FFFFFF] text-[0.775rem] italic">{formatNumber(product.terjual)}</h1>
                                                <h1 className="text-[#FF4081] text-[0.775rem]">terjual</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <SiFireship className="absolute right-1 top-1 text-[#FF4081]" size={20}/>
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
            <div className="w-full px-5 h-auto flex flex-col justify-center items-center mt-5">

                <header className="w-full flex justify-start items-center mb-4 relative border-b-2 border-[#FF4081]">
                    <h1 className="headerProduct p-2 flex justify-center items-center text-[#FFFFFF] text-3xl font-Montserrat font-semibold z-10 relative">Produk Kami</h1>
                </header>
                <main className="w-full flex justify-between items-start relative">
                    <div className="w-1/5 flex flex-col justify-center items-center p-3 rounded-xl bg-[#212121] sticky top-24">
                        <header className="w-full flex justify-start items-center border-b-2 border-white">
                            <h1 className="filterHeader font-Poppins text-xl text-white relative">Filter Produk</h1>
                        </header>
                        <main className="w-full flex flex-col justify-center items-start mt-2 gap-3">
                            <h1 className="font-Poppins text-base text-[#FF4081]">Kategori</h1>
                        {categories.map((category) => (
                                <div key={category} className="w-full flex items-center justify-start gap-2">
                                    <input type="checkbox" name="kategori" className="appearance-none h-5 w-5 bg-[#212121] border-2 border-[#FF4081] checked:bg-[#FF4081] rounded-md" 
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCheckboxChange(category)}
                                    />
                                    <span className="text-white text-sm font-Poppins">{category}</span>
                                </div>
                        ))}
                        <button className="p-2 px-5 bg-[#FF4081] font-Poppins font-meidum text-[#FFFFFF] transition-all ease duration-200 rounded-lg hover:bg-[#ff4080b1]"
                        onClick={() => fetchProduct()}
                        >Terapkan</button>
                        </main>
                    </div>
                    <div className="w-4/5 flex flex-col justify-start items-center">
                        <div className="w-auto grid grid-cols-5 gap-7">
                            {product.slice(0, visibleCount).map((product) => {
                                return (
                                <Link to={`product/${product.id}`} key={product.id} className="w-44 aspect-[3/5] flex flex-col justify-start items-center rounded-xl shadow-[rgba(255, 255, 255, 0.24) 0px 3px 8px;] bg-[#212121] overflow-hidden gap-1">
                                    <div className="w-full aspect-square overflow-hidden bg-white">
                                        <img src={`/imgProduct/img${product.id}.jpeg`} alt={product.nama} className="w-full h-full object-contain object-center"/>
                                    </div>
                                    <div className="w-full h-auto px-2 text-start no-wrap overflow-hidden flex flex-col itmes-start justify-start gap-[2px]">
                                        <h1 className="text-[#FFFFFF] text-[0.8rem] line-clamp-1">{product.nama}</h1>
                                        <div className="w-full flex items-center justify-start gap-[3px]">
                                            <h1 className="text-[0.9rem] font-semibold text-[#FF4081]">Rp</h1>
                                            <h1 className="text-[0.9rem] font-semibold text-[#FFFFFF]">{formatCurrency(product.harga )}</h1>
                                        </div>
                                        <div className="w-auto flex items-center justify-start gap-1">
                                            <FaStar size={10} className="text-yellow-400"/>
                                            <h1 className="flex items-center gap-1 text-sm text-[#FFFFFF]">{product.rating}</h1>
                                        </div>
                                        <div className="w-full flex items-center justify-between">
                                            <div className="w-auto flex justify-start items-center gap-1">
                                                <GrMapLocation className="text-[#FF4081]" size={15}/>
                                                <h1 className="text-white text-sm">{product.lokasi}</h1>
                                            </div>
                                            <div className="w-auto flex justify-end items-center gap-1">
                                                <h1 className="text-[#FFFFFF] text-[0.775rem] italic">{formatNumber(product.terjual)}</h1>
                                                <h1 className="text-[#FF4081] text-[0.775rem]">terjual</h1>
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
    )
}

export default MainPage