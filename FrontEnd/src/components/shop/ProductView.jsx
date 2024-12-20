import axios from 'axios';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import { FaStar } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const ProductView = () => {

    const [productName, setProductName] = useState('');
    const [harga, setHarga] = useState(0);
    const [lokasi, setLokasi] = useState('');
    const [terjual, setTerjual] = useState(0);
    const [rating, setRating] = useState(0);
    const [jumlahRating, setJumlahRating] = useState(0);
    const [stok, setStok] = useState(0);
    const [kondisi, setKondisi] = useState('');
    const [minPembelian, setMinPembelian] = useState(0);
    const [spesifikasi, setSpesifikasi] = useState('');
    const [jumlah, setJumlah] = useState(1);
    const [isLocked, setIsLocked] = useState(false);
    const currentJumlah = jumlah;
    const { id } = useParams();

    useEffect(() => {
        getProductById();
    }, []);

    const getProductById = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/shop/${id}`);
            setProductName(response.data.nama);
            setHarga(response.data.harga);
            setLokasi(response.data.lokasi);
            setTerjual(response.data.terjual);
            setRating(response.data.rating);
            setJumlahRating(response.data.jumlah_rating);
            setStok(response.data.stok);
            setKondisi(response.data.kondisi);
            setMinPembelian(response.data.min_pembelian);
            setSpesifikasi(response.data.spesifikasi);
        } catch (err) {
            console.log(err)
        }
    }

    const insertCartItems = async (e) => {
        setIsLocked(true);

        if(isLocked == true){
            return
        }
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/cart', {
                id,
                productName,
                harga,
                lokasi,
                terjual,
                rating,
                stok,
                jumlah
            })
        } catch (err) {
            if(err.response && err.response.status === 400) {
                const cartCountFailed = document.getElementById('cartCountFailed')
                cartCountFailed.classList.replace('hidden', 'flex');
                setTimeout(() => {
                    cartCountFailed.classList.replace('-bottom-10', 'bottom-0')
                    cartCountFailed.classList.add('addedCartStart');
                }, 100)
                setTimeout(() => {
                    cartCountFailed.classList.replace('bottom-0' ,'-bottom-10')
                    cartCountFailed.classList.remove('addedCartStart');
                    cartCountFailed.classList.replace('flex' ,'hidden');
                }, 3100)
            }
        }
        const cartCount = document.getElementById('cartCount')
        cartCount.classList.replace('hidden', 'flex');
        setTimeout(() => {
            cartCount.classList.replace('-bottom-10', 'bottom-0')
            cartCount.classList.add('addedCartStart');
        }, 100)
        setTimeout(() => {
            cartCount.classList.replace('bottom-0', '-bottom-10' )
            cartCount.classList.remove('addedCartStart');
            cartCount.classList.replace('flex' ,'hidden');
            setIsLocked(false);
        }, 3100)
    }

    const handleClickDetail = () => {
        const navDetail = document.getElementById('navDetail');
        const navSpesifikasi = document.getElementById('navSpesifikasi');
        const detailContainer = document.getElementById('detailContainer');
        const spesifikasiContainer = document.getElementById('spesifikasiContainer');

        navDetail.classList.replace('text-[#FFFFFF]','text-[#FF4081]');
        navSpesifikasi.classList.replace('text-[#FF4081]','text-[#FFFFFF]');
        navDetail.classList.add('clicked');
        navSpesifikasi.classList.remove('clicked');
        detailContainer.classList.replace('hidden', 'flex');
        spesifikasiContainer.classList.replace('flex', 'hidden');
    }
    
    const handleClickSpesifikasi = () => {
        const navDetail = document.getElementById('navDetail');
        const navSpesifikasi = document.getElementById('navSpesifikasi');
        const detailContainer = document.getElementById('detailContainer');
        const spesifikasiContainer = document.getElementById('spesifikasiContainer');

        navDetail.classList.replace('text-[#FF4081]','text-[#FFFFFF]');
        navSpesifikasi.classList.replace('text-[#FFFFFF]','text-[#FF4081]');
        navDetail.classList.remove('clicked');
        navSpesifikasi.classList.add('clicked');
        detailContainer.classList.replace('flex', 'hidden');
        spesifikasiContainer.classList.replace('hidden', 'flex');

    }

    const handleLihatSelengkapnya = () => {
        const keteranganProduk = document.getElementById('keteranganProduk');
        const btnLihatSelengkapnya = document.getElementById('btnLihatSelengkapnya');
        const btnSembunyikan = document.getElementById('btnSembunyikan');
        
        keteranganProduk.classList.remove('line-clamp-5');
        btnLihatSelengkapnya.classList.replace('block', 'hidden');
        btnSembunyikan.classList.replace('hidden', 'flex');
    }

    const handleSembunyikan = () => {
        const keteranganProduk = document.getElementById('keteranganProduk');
        const btnLihatSelengkapnya = document.getElementById('btnLihatSelengkapnya');
        const btnSembunyikan = document.getElementById('btnSembunyikan');

        keteranganProduk.classList.add('line-clamp-5');
        btnLihatSelengkapnya.classList.replace('hidden', 'block');
        btnSembunyikan.classList.replace('flex', 'hidden');
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

    const today = new Date();
    const formattedDate = today.getDate();
    const estimasiDate1 = formattedDate + 4; 
    const estimasiDate2 = formattedDate + 6;
    
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const getMonthName = monthNames[today.getMonth()];

    const subtotal = harga * jumlah;

    return (
        <div className='w-full h-full relative'>
            <div className='w-full flex items-start justify-center pt-20 gap-5 relative'>
                <div className="img flex-1 m-5 h-full bg-white sticky top-24">
                    <img src={`/imgProduct/img${id}.jpeg`} alt={productName} className='w-full aspect-square object-contain'/>
                </div>
                <div className="keteranganProduk flex-[2] flex flex-col justify-start items-center p-5">
                    <div className="w-full flex flex-col items-start justify-center">
                        <h1 className='text-2xl font-Poppins text-[#FFFFFF] font-semibold'>{productName}</h1>
                        <div className="w-full flex items-center justify-start gap-2 font-Poppins">
                            <div className="w-auto flex justify-center items-center gap-1">
                                <p className="text-[#FFFFFF]">terjual</p>
                                <p className="text-[#FF4081]">{formatNumber(terjual)}</p>
                            </div>
                            <div className="w-auto flex justify-center items-center gap-1">
                                <p className="text-yellow-400"><FaStar/></p>
                                <p className="text-[#FFFFFF]">{rating}</p>
                                <p className="text-[#ffffff74]">({jumlahRating} rating)</p>
                            </div>
                            <div className="w-auto flex justify-center items-center gap-1">
                                <p className="text-[#FFFFFF]">stok :</p>
                                <p className="text-[#ffffff74]">{stok}</p>
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 mt-2">
                            <h1 className='text-3xl text-[#FFFFFF] font-Poppins font-semibold'>Rp{formatCurrency(harga)}</h1>
                        </div>
                        <div className="w-full h-auto flex flex-col items-center justify-start relative">    
                            <nav className="w-full h-auto py-1 flex justify-start items-center font-Poppins">
                                <button id='navDetail' onClick={handleClickDetail} className="clicked text-base text-[#FF4081] font-semibold p-1 px-2 transition-all ease-in duration-100 relative flex justify-center items-center">Detail</button>
                                <button id='navSpesifikasi' onClick={handleClickSpesifikasi} className="text-base text-[#FFFFFF] font-semibold p-1 px-2 transition-all ease-in duration-100 relative flex justify-center items-center">Spesifikasi</button>
                            </nav>
                            <div className="w-full h-auto flex justify-start items-start relative">
                                <div id='detailContainer' className="detailContainer flex flex-col items-start justify-start font-Poppins">
                                    <div className="flex gap-1">
                                        <h1 className='text-[#ffffff3a] text-base'>Kondisi :</h1>
                                        <h1 className='text-[#FFFFFF] text-base'>{kondisi}</h1>
                                    </div>
                                    <div className="flex gap-1">
                                        <h1 className='text-[#ffffff3a] text-base'>Min. Pembelian :</h1>
                                        <h1 className='text-[#FFFFFF] text-base'>{minPembelian}</h1>
                                    </div>
                                    <br />
                                    <br />
                                    <h1 className="text-[#FFFFFF] text-base">Keterangan Produk :</h1>
                                    <div className="w-full h-auto flex flex-col" >
                                        <p id='keteranganProduk' className="text-[#FFFFFF] text-base line-clamp-5">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste temporibus corporis animi, fugit eos porro. At ut, dolores, tempora modi consequatur rerum quos molestias aspernatur similique eveniet unde saepe quidem!
                                        Necessitatibus recusandae blanditiis quasi aliquid nulla. Asperiores deleniti officiis dolorum quaerat nobis nihil quo. Tempora porro quas illo odio nulla deleniti harum, facilis culpa alias iusto eos. Laboriosam, facere vero!
                                        Hic ipsum voluptas repellat error earum minus consequatur nihil unde sed voluptatum? Reiciendis amet iusto delectus enim, ullam vero ab illo, soluta tempore sit assumenda. Maxime nostrum accusantium numquam nulla!
                                        Distinctio earum ratione ducimus, accusantium eum, nam fuga voluptatum dolores mollitia ad beatae? Tenetur quia quis rerum distinctio explicabo accusamus aperiam consectetur commodi adipisci. Earum dignissimos tempore sequi blanditiis molestias!
                                        Accusantium ipsam voluptas possimus eligendi doloremque alias aperiam suscipit laudantium optio nam! In sit saepe optio, delectus molestiae praesentium ratione odit? Fugit tempora assumenda sit officiis accusantium quos laborum nulla?</p>
                                        <button id='btnLihatSelengkapnya' onClick={handleLihatSelengkapnya} className="absolute bottom-0 right-0 text-[#FF4081] bg-[#121212] block">...lihat selengkapnya</button>
                                        <button id='btnSembunyikan' onClick={handleSembunyikan} className="bottom-0 right-0 text-[#FF4081] bg-[#121212] hidden items-center self-end">sembunyikan<IoIosArrowUp/> </button>
                                    </div>
                                </div>
                                <div id='spesifikasiContainer' className="spesifikasiContainer hidden flex-col items-start justify-center font-Poppins">
                                    <h1 className='text-[#FFFFFF]'>{productName}</h1>
                                    <div className="w-full flex flex-col items-start justify-center">
                                        <br />
                                        <div className="flex flex-col justify-center items-start">
                                            <h1 className='text-[#FF4081]'>Spesifikasi lengkap :</h1>
                                            <h1 className='text-[#FFFFFF]'>{spesifikasi}</h1>
                                        </div>
                                        <br />
                                        <h1 className='text-[#ffffff3a]'>Keterangan lainnya :</h1>
                                        <h1 className="text-[#FFFFFF]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil, impedit obcaecati sit eum debitis id. Odio enim deserunt qui consequatur laborum vero nobis cupiditate ipsam, iusto asperiores perferendis, quod eaque!</h1>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="profilToko w-full flex items-center justify-center gap-2 font-Poppins py-8">
                        <div className="w-1/6 aspect-square rounded-full bg-[#FFFFFF] text-[#FF4081] font-semibold flex justify-center items-center">logo</div>
                        <div className="w-4/5 flex flex-col justify-center items-start">
                            <h1 className="h-1/2 text-[#FFFFFF]">DodoGadget</h1>
                            <div className="h-1/2 flex justify-start items-center">
                                <div className="flex justify-center items-center gap-1">
                                    <FaStar className='text-yellow-400'/>
                                    <h1 className="text-[#FFFFFF] ">5.0 </h1>
                                    <h1 className="text-[#ffffff3a] ">(999k+ Ulasan)</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-center gap-1">
                        <div className="flex items-center gap-1">
                            <CiLocationOn size={25} className='text-[#FF4081]'/>
                            <h1 className="text-[#ffffff3a] ">Pengirim :</h1>
                            <h1 className="text-[#FFFFFF]">{lokasi}</h1>
                        </div>
                        <div className="flex flex-col justify-center gap-1 ">
                            <div className="flex items-center gap-1">
                                <CiDeliveryTruck size={25} className='text-[#FF4081]'/>
                                <h1 className="text-[#FFFFFF]">Gratis Ongkir</h1>
                            </div>
                            <h1 className="text-[#ffffff3a] ">Estimasi sampai pada {estimasiDate1} - {estimasiDate2} {getMonthName}</h1>
                        </div>
                    </div>
                </div>
                <div className="purchase flex-1 p-5 gap-5 sticky top-24">
                    <div className="border border-[#FF4081] rounded-2xl p-5 flex flex-col items-start justify-center font-Poppins gap-5">
                        <h1 className='text-white'>Atur jumlah</h1>
                        <div className="w-full flex items-center justify-start gap-3">
                            <div className="w-1/5 aspect-square rounded-lg overflow-hidden bg-white no-drag">
                                <img src={`/imgProduct/img${id}.jpeg`} alt={productName} className='w-full h-full object-contain'/>
                            </div>
                            <h1 className="text-[#FFFFFF] text-sm">{productName}</h1>
                        </div>
                        <div className="w-full flex justify-start items-center gap-3 no-drag">
                            <div className="w-1/2 flex items-center justify-start outline-none border-[#ffffff3a] border rounded-lg p-2">
                                <button className=""
                                onClick={() => setJumlah(currentJumlah - 1)}
                                disabled={jumlah <= 1}
                                >
                                    <FaMinus className='flex-1 text-white cursor-pointer'/>
                                </button>
                                <div className="flex-1">
                                    <input type="text" className="w-full h-full outline-none bg-[#121212] text-white text-center" maxLength={3}
                                    min={1}
                                    value={jumlah}
                                    onChange={(e) => setJumlah(e.target.value)}
                                    />
                                </div>
                                <button className=""
                                onClick={() => setJumlah(currentJumlah + 1)}
                                >
                                <FaPlus className='flex-1 text-white cursor-pointer'/>
                                </button>
                            </div>
                            <div className="flex gap-1 no-drag">
                                <h1 className="text-white">Stok :</h1>
                                <h1 className='text-[#ffffff3a]'>{stok}</h1>
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-1">
                            <h1 className="font-Poppins text-base text-white">Subtotal : Rp</h1>
                            <h1 className="font-Poppins text-base text-white">{formatCurrency(subtotal)}</h1>
                        </div>
                        <div className="w-full flex items-center gap-3">
                            <button className="flex-1 p-2 bg-[#FF4081] text-center text-white text-sm font-Poppins rounded-lg transition-all ease duration-200 hover:bg-[#d02e64]">
                                Beli Sekarang
                            </button>
                            <button className="flex items-center flex-1 p-2 border border-[#FF4081] text-center text-white text-base font-Poppins"
                            onClick={insertCartItems}
                            >
                                <IoIosCart size={30} className="text-[#FF4081]"/>
                                <h1 className='text-whte text-sm font-Poppins'>Masukan Keranjang</h1>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='cartCount' className="addedCart w-full fixed -bottom-10 z-30 p-2 hidden justify-center items-center bg-white text-center gap-1 transition-all ease duration-300">
                <FaCircleCheck size={20} className='text-[#FF4081]'/>
                <h1 className='font-Poppins text-[#121212] text-base'>item ditambahkan ke keranjang </h1>
            </div>
            <div id='cartCountFailed' className="addedCartFailed w-full fixed -bottom-10 z-30 p-2 hidden justify-center items-center bg-white text-center gap-1 transition-all ease duration-300">
                <MdCancel size={20} className='text-[#ff1818]'/>
                <h1 className='font-Poppins text-[#121212] text-base'>item sudah ada di keranjang </h1>
            </div>
        </div>
    )
}

export default ProductView