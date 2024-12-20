import { useEffect, useState } from "react";
import axios from "axios";
import { IoCartOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const Cart = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState({})
  const [checkAll, setCheckAll] = useState(true);
  const [check, setCheck] = useState({});

  useEffect(() => {
    getCartItems();
  }, [])

  const getCartItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/cart');
      const fetchedItems = response.data;
      console.log(response.data);

      const initialCounts = fetchedItems.reduce(
        (acc, item) => ({...acc, [item.id]: item.jumlah}),
        {}
      );

      const initialCheck = fetchedItems.reduce(
        (acc, item) => ({...acc, [item.id]: true}),
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

  const updateCartItems = async (id, value) => {
    try {
      await axios.patch(`http://localhost:3001/cart/${id}`, {
        jumlah: value,
      });
      console.log(`Updated item ${id} with jumlah: ${count[id]}`);
    } catch (error) {
      console.log(error.message);
    }
  }

  const deleteCartItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${id}`)
      console.log(`Deleted Item ${id}`);
    } catch (error) {
      console.log(error.message);
    }
    getCartItems();
  }

  // const updateCheck = async (id, value) => {
  //   try {
  //     await axios.patch(`http://localhost:3001/cart/${id}`, {
  //       check: value,
  //     });
  //     console.log(`Updated item ${id} with jumlah: ${count[id]}`);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  const handleChange = (id, value) => {
    setCount((prevCount) => ({
      ...prevCount,
      [id]: parseInt(value) || 1, // Update specific item's count
    }));
  };
  
  const increment = (id) => {
    setCount((prevCount) => {
      const updatedCount = { ...prevCount, [id]: prevCount[id] + 1 };
      updateCartItems(id, updatedCount[id]); // Update database with the new count
      return updatedCount;
    });
  };

  const decrement = (id) => {
    setCount((prevCount) => {
      const updatedCount = { ...prevCount, [id]: Math.max(prevCount[id] - 1, 1) };
      updateCartItems(id, updatedCount[id]); // Update database with the new count
      return updatedCount;
    });
  };

  const handlePilihSemua = () => {
    setCheckAll(!checkAll); // Toggle "Check All"
    setCheck(() => {
      const newCheck = {};
      cartItems.forEach((item) => {
        newCheck[item.id] = !checkAll;
      });
      return newCheck;
    });
  };

  const handleItemChange = (id) => {
    setCheck((prevCheck) => {
      const updatedCheck = { ...prevCheck, [id]: !prevCheck[id] };
      const allChecked = cartItems.every((item) => updatedCheck[item.id]); 
      setCheckAll(allChecked);
      return updatedCheck;
    });
  };

  const countIndividualSub = (harga, count) => { 
    const counting = harga * count;
    return counting;
  }

  const countCheckedSubtotal = () => {
    return cartItems
    .filter(item => check[item.id])
    .reduce((total, item) => total + item.harga * count[item.id], 0)
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
    <div className="w-full h-auto flex items-center justify-between pt-20">
      <div className="w-3/5 flex flex-col items-start justify-start px-3">
        <header className="w-full p-3 flex items-center gap-2 ">
          <IoCartOutline size={25} className="text-[#FF4081]" />
          <h1 className="font-Poppins font-semibold text-[white] text-xl">Keranjang anda</h1>
        </header>
        <main className="-webkit-scroll-hidden w-full max-h-[30rem] overflow-y-scroll p-3 flex flex-col justify-start items-center gap-5">
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
          {cartItems.map((item) => (
            <div key={item.id} className="w-full p-5 flex items-center justify-start gap-3 bg-[#212121] rounded-lg relative">
              <input type="checkbox" className="appearance-none cursor-pointer w-6 h-6 border-2 border-[#FF4081] checked:bg-[#FF4081] transition-all ease duration-200 absolute top-3 right-3"
              checked={check[item.id]}
              onChange={() => handleItemChange(item.id)}
              />
              <div className="w-[10%] aspect-square overflow-hidden bg-white rounded-lg self-start">
                <img src={`/imgProduct/img${item.id}.jpeg`} alt={item.nama} className="w-full h-full object-contain" />
              </div>
              <div className="flex-col flex items-start flex-1 gap-1">
                <h1 className="text-white font-Poppins text-xl font-semibold">{item.nama}</h1>
                <div className="w-auto flex items-center justify-center gap-1">
                  <FaStar size={15} className="text-yellow-400" />
                  <h1 className="flex items-center gap-1 text-base font-semibold text-[#FFFFFF]">{item.rating}</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-3 no-drag">
                  <div className="w-full flex items-center justify-start gap-3">
                    <div className="w-1/3 flex items-center justify-start outline-none border-[#ffffff3a] border rounded-full p-2 gap-1">
                      <button
                        onClick={() => decrement(item.id)}
                        disabled={count[item.id] < 1}
                      >
                        <FaMinus className='flex-1 text-white cursor-pointer' />
                      </button>
                      <input
                        type="number"
                        className="w-full h-full outline-none bg-[#212121] text-white text-center font-Poppins font-semibold"
                        value={count[item.id]}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                      />
                      <button
                        onClick={() => increment(item.id)}
                      >
                        <FaPlus className='flex-1 text-white cursor-pointer' />
                      </button>
                    </div>
                    <button className="p-1"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      <FaRegTrashAlt size={25} className="text-[#FF4081]" />
                    </button>
                  </div>
                  <div className="flex gap-1 text-nowrap">
                    <h1 className="text-[#ffffff79] font-Poppins text-xl font-medium">sub :</h1>
                    <h1 className="text-[#FF4081] font-Poppins text-xl font-medium">Rp.</h1>
                    <h1 className="text-white font-Poppins text-xl font-medium">{formatCurrency(countIndividualSub(item.harga, count[item.id]))}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
      <div className="w-2/5 flex flex-col justify-start p-5 gap-1">
          <header className="font-Poppins text-white text-xl font-semibold">Yuk Checkout Sekarang!</header>
          <main className="w-full flex flex-col font-Poppins gap-1">
            <div className="flex items-center gap-1 ">
              <h1 className="text-[#ffffff80] text-lg">subtotal :</h1>
              <h1 className="text-white font-semibold">Rp {formatCurrency(countCheckedSubtotal())}</h1>
            </div>
            <div className="w-full flex items-center justify-start">
              <button className="bg-[#FF4081] p-2 px-10 text-[#FFFFFF] font-Poppins font-semibold">Checkout</button>
            </div>
          </main>
      </div>
    </div>
  )
}

export default Cart