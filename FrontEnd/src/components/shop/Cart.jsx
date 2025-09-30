import { useEffect, useState } from "react";
import axios from "axios";
import { IoCartOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "./ManageContext.jsx";

const Cart = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState({})
  const [checkAll, setCheckAll] = useState(true);
  const [check, setCheck] = useState({});

  const { username } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    getCartItemsByUser();
  }, []);

  const getCartItemsByUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/cartByUser/${username}`);
      const fetchedItems = response.data;
      console.log(response.data );

      const initialCounts = fetchedItems.reduce(
        (acc, item) => ({...acc, [item.general_id]: item.jumlah}),
        {}
      );

      const initialCheck = fetchedItems.reduce(
        (acc, item) => ({...acc, [item.general_id]: true}),
        {}
      );

      setCartItems(fetchedItems);
      setCount(initialCounts);
      setCheck(initialCheck);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCheckout = async () => {
    try {
        const checkedItems = cartItems.filter(item => check[item.general_id]);

        if (checkedItems.length === 0) {
            alert('No items selected for checkout');
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
        console.log(currentDate)
        const payload = {
            username,
            cartItems: checkedItems.map(item => ({
                product_id: item.product_id,
                nama: item.nama,
                harga: item.harga,
                jumlah: count[item.general_id],
                tanggal: currentDate,
            })),
        };

        await axios.post('http://localhost:3001/api/checkout', payload);
        alert("checkout berhasil");
        getCartItemsByUser();
    } catch (error) {
        console.error('Error during checkout:', error.message);

        if (error.response && error.response.data) {
            alert(`Checkout failed: ${error.response.data.error}`);
        } else {
            alert('An error occurred during checkout');
        }
    } finally {
      window.location.reload();
    }
};

  const updateCartItems = async (id, value) => {
    try {
      await axios.patch(`http://localhost:3001/api/cart/${id}`, {
        jumlah: value,
      });
      console.log(`Updated item ${id} with jumlah: ${count[id]}`);
    } catch (error) {
      console.log(error.message);
    }
  }

  const deleteCartItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/cart/${id}`)
      console.log(`Deleted Item ${id}`);
    } catch (error) {
      console.log(error.message);
    }
    getCartItemsByUser();
  }
  
  const increment = (id) => {
    setCount((prevCount) => {
      const updatedCount = { ...prevCount, [id]: prevCount[id] + 1 };
      updateCartItems(id, updatedCount[id]);
      return updatedCount;
    });
  };

  const decrement = (id) => {
    setCount((prevCount) => {
      const updatedCount = { ...prevCount, [id]: Math.max(prevCount[id] - 1, 1) };
      updateCartItems(id, updatedCount[id]);
      return updatedCount;
    });
  };

  const handlePilihSemua = () => {
    setCheckAll(!checkAll); // Toggle "Check All"
    setCheck(() => {
      const newCheck = {};
      cartItems.forEach((item) => {
        newCheck[item.general_id] = !checkAll;
      });
      return newCheck;
    });
  };

  const handleItemChange = (id) => {
    setCheck((prevCheck) => {
      const updatedCheck = { ...prevCheck, [id]: !prevCheck[id] };
      const allChecked = cartItems.every((item) => updatedCheck[item.general_id]); 
      setCheckAll(allChecked);
      return updatedCheck;
    });
  };

  const countIndividualSub = (harga, count) => { 
    const counting = harga * count;
    return counting;
  }

  const countCheckedSubtotal = () => {
    const counting = cartItems
    .filter(item => check[item.general_id])
    .reduce((total, item) => total + item.harga * count[item.general_id], 0);
    return counting;
  } 
  
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };
  
  if (loading) {
    return (
      <div className="w-full p-5 h-auto flex justify-center items-center">
        <main className="w-full flex justify-center items-center">
          <p className="text-white">loading....</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-5 h-auto flex justify-center items-center">
        <main className="w-auto flex justify-center items-center">
          <h1 className="text-[#FFFFFF] text-[1rem]">Error: {error}</h1>
        </main>
      </div>
    )
  }



  return (
    <div className="w-full h-auto flex xl:flex-row flex-col items-start justify-between pt-20">
      <div className="xl:w-3/5 w-full flex flex-col items-start justify-start px-3">
        <header className="w-full p-3 flex flex-col justify-center items-start gap-2 ">
          <div className="flex gap-2">
            <IoCartOutline size={25} className="text-[#FF4081]" />
            <h1 className="font-Poppins font-semibold text-[white] text-xl">Keranjang anda</h1>
          </div>
          {cartItems.length !== 0 ? (
            <div className="w-full flex items-center gap-2">
              <div className="flex items-center justify-center relative">
                <input type="checkbox" className="appearance-none cursor-pointer w-5 h-5 border-2 border-[#FF4081] checked:bg-[#FF4081] transition-all ease duration-200"
                checked={checkAll}
                onChange={handlePilihSemua}
                />
                <FaCheck size={15} id="centang" className="text-[#121212] absolute pointer-events-none"/>
              </div>
              <h1 className="font-Poppins text-white font-semibold">Pilih Semua</h1>
            </div>
          ) : (
            <div className=""></div>
          )}
        </header>
        <main className="styledScroll w-full h-auto xl:max-h-[30rem] md:max-h-[40rem] max-h-[25rem] overflow-auto px-3 flex flex-col justify-start items-center gap-5">
            {cartItems && cartItems.length > 0 ? (
                <>              
                {cartItems.map((item) => (
                  <button onClick={() => navigate(`/product/${item.product_id}`)} key={item.general_id} className="w-full p-5 flex items-center justify-start gap-3 bg-[#212121] rounded-lg relative">
                    <input type="checkbox" className="appearance-none cursor-pointer w-6 h-6 border-2 border-[#FF4081] checked:bg-[#FF4081] transition-all ease duration-200 absolute top-3 right-3"
                    checked={check[item.general_id]}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      handleItemChange(item.general_id)
                    }}
                    />
                    <div className="xl:w-[10%] md:w-[20%] w-[30%] aspect-square overflow-hidden bg-white rounded-lg self-start">
                      <img src={`/imgProduct/img${item.product_id}.jpeg`} alt={item.nama} className="w-full h-full object-contain"/>
                    </div>
                    <div className="flex-col flex items-start flex-1 xl:gap-1 md:gap-1 gap-2">
                      <div className="flex  xl:w-full md:w-full w-[100%] xl:overflow-visible md:overflow-visible overflow-hidden">
                        <h1 className="text-white font-Poppins xl:text-xl md:text-xl text-sm font-semibold line-clamp-1">{item.nama}</h1>
                      </div>
                      <div className="w-auto flex items-center justify-center gap-1">
                        <FaStar size={15} className="text-yellow-400" />
                        <h1 className="flex items-center gap-1 text-base font-semibold text-[#FFFFFF]">{item.rating}</h1>
                      </div>
                      <div className="w-full flex justify-between items-center gap-3 no-drag">
                        <div className="sm:w-1/2 w-full flex items-center justify-start gap-3">
                          <div 
                          onClick={(e) => e.stopPropagation()}
                          className="xl:w-1/3 md:w-1/3 w-1/2 flex items-center justify-start outline-none border-[#ffffff3a] border rounded-full xl:p-2 md:p-2 p-1 gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                decrement(item.general_id);
                              }}
                              disabled={count[item.general_id] < 1}
                            >
                              <FaMinus className="flex-1 text-white cursor-pointer" />
                            </button>
                            <div
                              className="w-full h-full outline-none bg-[#212121] text-white text-center font-Poppins font-semibold"
                            >{count[item.general_id]}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                increment(item.general_id);
                              }}
                            >
                              <FaPlus className="flex-1 text-white cursor-pointer" />
                            </button>
                          </div>
                          <button
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCartItem(item.general_id);
                            }}
                          >
                            <FaRegTrashAlt className="text-[#FF4081] xl:text-2xl md:text-2xl text-xl" />
                          </button>
                        </div>
                        <div className="xl:flex md:flex hidden gap-1 text-nowrap">
                          <h1 className="text-[#FF4081] font-Poppins text-xl font-medium">Rp.</h1>
                          <h1 className="text-white font-Poppins text-xl font-medium">{formatCurrency(countIndividualSub(item.harga, count[item.general_id]))}</h1>
                        </div>
                      </div>
                      <div className="xl:hidden md:hidden flex gap-1 text-nowrap">
                        <h1 className="text-[#ffffff79] font-Poppins xl:text-xl md:text-xl text-base font-medium">sub :</h1>
                        <h1 className="text-[#FF4081] font-Poppins xl:text-xl md:text-xl text-base font-medium">Rp.</h1>
                        <h1 className="text-white font-Poppins xl:text-xl md:text-xl text-base font-medium">{formatCurrency(countIndividualSub(item.harga, count[item.general_id]))}</h1>
                      </div>
                    </div>
                  </button>
                ))}
                </>
              ) : (
              <div className="w-auto flex flex-col items-center justify-start gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 ">
                <h1 className="font-Poppins text-white text-xl">Yah keranjangmu kosong</h1>
                <h1 className="font-Poppins text-[#FF4081] text-xl font-semibold">Cari barang yang kamu pengin yuk!!</h1>
                <button className="aspect-[5/1] py-3 border border-[#FF4081] gap-2 flex items-center justify-center transition-all ease duration-200 hover:border-[#ff40809e]"
                onClick={() => navigate('/')}
                >
                  <IoCartOutline className="text-2xl text-[#FFFFFF]"/>
                  <h1 className="font-Poppins text-base text-[#FFFFFF] font-medium">Belanja Sekarang</h1>
                </button>
              </div>  
            )}
        </main>
      </div>
      <div className="xl:w-2/5 w-full h-auto flex flex-col xl:justify-center justify-start p-5 gap-1 xl:m-auto">
          {cartItems.length !== 0 ? (
            <>
            <header className="font-Poppins text-white xl:text-xl md:text-xl text-lg font-semibold">Yuk Checkout Sekarang!</header>
            <main className="w-full flex flex-col font-Poppins gap-1">
              <div className="w-full flex-col">
                {cartItems.filter(item => check[item.general_id]).map((items) => (
                  <div key={items.general_id} className="w-full flex items-center gap-2 overflow-auto">
                    <h1 className="text-white font-Poppins xl:text-base md:text-base text-sm font-light">- {items.nama}</h1>
                    <h1 className="text-[#FF4081] font-Poppins xl:text-base md:text-base text-sm font-semibold">{count[items.general_id]} buah</h1>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 ">
                <h1 className="text-[#ffffff80] text-lg">subtotal :</h1>
                <h1
                className="text-white font-semibold">Rp {formatCurrency(countCheckedSubtotal())}</h1>
              </div>
              <div className="w-full flex items-center justify-start">
                <button 
                onClick={handleCheckout}
                className="bg-[#FF4081] p-2 px-10 text-[#FFFFFF] font-Poppins font-semibold">Checkout</button>
              </div>
            </main>
            </>
          ) : (
            <div className=""></div>
          )}
      </div>
    </div>
  )
}

export default Cart