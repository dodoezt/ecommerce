import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "./ManageContext";
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { username } = useUser();
    const [checkoutItems, setCheckoutItems] = useState([]);
    const navigate = useNavigate()
    const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });
    };
    
    const groupItemsByDate = (items) => {
        return items.reduce((grouped, item) => {
            const date = new Date(item.tanggal).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });             
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
            return grouped;
        }, {});
    };

    useEffect(() => {
        getCheckoutItems();
        console.log(currentDate)
    }, []);

    const getCheckoutItems = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/checkoutByUser/${username}`);
            setCheckoutItems(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch checkout items:', error);
        }
    };

    const groupedItems = groupItemsByDate(checkoutItems);

    const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('id-ID', {
          style: 'decimal',
          minimumFractionDigits: 0,
        });
        return formatter.format(amount);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center xl:pt-20 sm:pt-16 pt-14">
            {checkoutItems.length === 0 ? (
                <div className="w-full h-dvh p-5 flex flex-col items-center justify-center gap-3 -translate-y-20">
                    <h1 className="text-xl text-white font-Poppins font-semibold">Keliatannya kamu belum checkout apa-apa...</h1>
                    <h1 className="font-Poppins text-[#FF4081] text-xl font-semibold">Cari barang yang kamu pengin yuk!!</h1>
                    <button className="aspect-[5/1] py-3 border border-[#FF4081] gap-2 flex items-center justify-center transition-all ease duration-200 hover:border-[#ff40809e]"
                    onClick={() => navigate('/')}
                    >
                        <IoCartOutline className="text-2xl text-[#FFFFFF]"/>
                        <h1 className="font-Poppins text-base text-[#FFFFFF] font-medium">Belanja Sekarang</h1>
                    </button>
                </div>
            ) : (
                Object.entries(groupedItems)
                .sort(([dateA], [dateB]) => {
                    if (dateA === currentDate) return -1; // Ensure the current date is on top
                    if (dateB === currentDate) return 1;  // Push other dates down
                    return new Date(dateB) - new Date(dateA); // Sort remaining dates in descending order
                })
                .map(([date, items]) => {
                    const totalHarga = items.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
            
                    return (
                        <div key={date} className="w-full flex flex-col justify-start gap-1 p-5">
                            <header className="w-full flex items-center justify-start">
                                {date === currentDate ? (
                                    <h1 className="text-lg font-semibold font-Poppins text-white">Hari ini</h1>
                                ) : (
                                    <h1 className="text-lg font-semibold font-Poppins text-white">Tanggal {formatDate(date)}</h1>
                                )}
                            </header>
                            <div className="w-full sm:hidden flex flex-col items-start justify-start font-Poppins">
                                    <header className="w-full flex gap-1 text-nowrap">
                                        <h1 className="text-white text-base font-semibold">Total biaya checkout</h1>
                                        {date === currentDate ? (
                                            <h1 className="text-base font-semibold font-Poppins text-white">hari ini</h1>
                                        ) : (
                                            <h1 className="text-base font-semibold font-Poppins text-white">tanggal {formatDate(date)}</h1>
                                        )}
                                    </header>
                                    <main className="w-full flex flex-col items-start">
                                        {items.map(item => (
                                            <div key={item.product_id} className="w-full flex flex-col items-start">
                                                <div className="w-full flex gap-1">
                                                    <p className="text-sm text-white">{item.nama}</p>
                                                    <p className="text-sm text-white">{item.jumlah}</p>
                                                    <p className="text-sm text-[#ff4081]">buah</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex gap-1">
                                            <h1 className="text-[#ff4081] text-base">Total :</h1>
                                            <h1 className="text-[#ffffff] text-base">Rp {formatCurrency(totalHarga)}</h1>
                                        </div>
                                    </main>
                                </div>
                            <div className="w-full flex items-start justify-start">
                                <div className="sm:w-2/3 w-full flex flex-col justify-start items-center gap-2">
                                    <div className="w-full sm:max-h-none max-h-[23rem] overflow-y-scroll flex flex-col gap-3 styledScroll">
                                        {items.map(item => (
                                            <div key={item.product_id} className="w-full bg-[#212121] p-3 rounded-lg flex items-start justify-start gap-3">
                                                <div className="sm:w-[15%] w-[40%] aspect-square overflow-hidden bg-white">
                                                    <img src={`imgProduct/img${item.product_id}.jpeg`} alt={item.product_name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="w-full h-full flex flex-col items-start justify-start">
                                                    <h1 className="sm:text-base text-sm font-Poppins font-semibold text-white line-clamp-1">{item.nama}</h1>
                                                    <div className="flex gap-1">
                                                        <h1 className="text-sm font-Poppins font-semibold text-[#ff4081]">Rp</h1>
                                                        <h1 className="text-sm font-Poppins font-normal text-white">{formatCurrency(item.harga)}</h1>
                                                    </div>
                                                    <div className="w-full flex items-center justify-between">
                                                        <h1 className="text-sm font-Poppins font-semibold text-white line-clamp-1">{item.jumlah} buah</h1>
                                                        <div className="sm:flex gap-1 hidden">
                                                            <h1 className="text-lg font-Poppins font-normal text-[white]">Total:</h1>
                                                            <h1 className="text-lg font-Poppins font-semibold text-[#ff4081]">Rp</h1>
                                                            <h1 className="text-lg font-Poppins font-normal text-white">{formatCurrency(item.harga * item.jumlah)}</h1>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 sm:hidden">
                                                        <h1 className="text-sm font-Poppins font-normal text-[white]">Total:</h1>
                                                        <h1 className="text-sm font-Poppins font-semibold text-[#ff4081]">Rp</h1>
                                                        <h1 className="text-sm font-Poppins font-normal text-white">{formatCurrency(item.harga * item.jumlah)}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-1/3 p-5 hidden sm:flex flex-col items-start justify-start font-Poppins">
                                    <header className="w-full flex xl:flex-row sm:flex-col xl:gap-1 sm:gap-0 gap-1 xl:text-nowrap sm:text-wrap border-b border-b-white">
                                        <h1 className="text-white xl:text-xl sm:text-lg">Total biaya checkout</h1>
                                        {date === currentDate ? (
                                            <h1 className="xl:text-xl sm:text-lg font-lg font-Poppins text-white">hari ini</h1>
                                        ) : (
                                            <h1 className="xl:text-xl sm:text-lg font-lg font-Poppins text-white">tanggal {formatDate(date)}</h1>
                                        )}
                                    </header>
                                    <main className="w-full flex flex-col items-start sm:mt-2">
                                        {items.map(item => (
                                            <div key={item.product_id} className="w-full flex flex-col items-start">
                                                <div className="w-full flex justify-start gap-1">
                                                    <p className="text-sm text-white line-clamp-1">{item.nama}</p>
                                                    <p className="text-sm text-white">{item.jumlah}</p>
                                                    <p className="text-sm text-[#ff4081]">buah</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex gap-1">
                                            <h1 className="text-[#ff4081] text-base">Total :</h1>
                                            <h1 className="text-[#ffffff] text-base">Rp {formatCurrency(totalHarga)}</h1>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
};

export default Checkout;
