import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";

const ProductSearched = () => {

    const [product, setProducts] = useState([]);
    const { keyword } = useParams();
    const [visibleCount, setVisibleCount] = useState(15); 

    useEffect(() => {
        getProductsSearched();
    }, [keyword]);

    const getProductsSearched = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/search/${keyword}`)
            setProducts(response.data)
            console.log(response.data)
        } catch(err){
            console.log(err.message)
        }   
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

    return (
        <div className='w-full flex flex-col justify-center items-end px-5 mt-24'>
            <header className="w-full flex justify-start items-center mb-4 relative">
                <h1 className="text-[#FFFFFF] text-3xl font-Montserrat font-semibold bg-[#121212] z-10">Hasil Dari &quot;{keyword}&quot;</h1>
            </header>
            <main className="w-full flex flex-col justify-start items-start">
                <div className="w-auto grid grid-cols-7 gap-7">
                    {product.slice(0, visibleCount).map((product) => {
                        return (
                        <Link to={`/product/${product.id}`} key={product.id} className="w-44 aspect-[3/5] flex flex-col justify-start items-center rounded-xl shadow-[rgba(255, 255, 255, 0.24) 0px 3px 8px;] bg-[#212121] overflow-hidden gap-1">
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
                    })};
                    </div>
                    {visibleCount < product.length && (
                    <button
                        onClick={showMoreProducts}
                        className="flex flex-col justify-center items-center seeMore p-4 text-white"
                    >
                        <p className="font-Montserrat text-base">see more</p>
                        <IoIosArrowDown size={15}/>
                    </button>
                    )}
            </main>
        </div>
    )
}

export default ProductSearched