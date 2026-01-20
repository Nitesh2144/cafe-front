import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URLS } from "../../../../../services/api.js";
import "./manualOrderForm.css";

const ManualOrderForm = ({ businessCode, onSuccess }) => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [unitCode, setUnitCode] = useState("");
  const [loading, setLoading] = useState(false);
const [orders, setOrders] = useState([]);
const [categories, setCategories] = useState([]);
const [units, setUnits] = useState([]);


  // ✅ NEW
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
useEffect(() => {
  if (!businessCode) return;

  axios
    .get(`${API_URLS.UNIT}?businessCode=${businessCode}`)
    .then(res => setUnits(res.data || []))
    .catch(() => console.error("Failed to load units"));
}, [businessCode]);

  useEffect(() => {
    axios
      .get(`${API_URLS.MENU}/by-business/${businessCode}`)
      .then(res => setMenu(res.data.menu || []));
  }, [businessCode]);

useEffect(() => {
  axios
    .get(`${API_URLS.ORDER}/${businessCode}`)
    .then(res => setOrders(res.data || []))
    .catch(() => console.error("Failed to load orders"));
}, [businessCode]);

useEffect(() => {
  if (!businessCode) return;

  axios
    .get(`${API_URLS.MENU}/categories/${businessCode}`)
    .then(res => {
      // sirf name chahiye
      const cats = res.data.map(c => c.name);
      setCategories(["All", ...cats]);
    })
    .catch(() => console.error("Failed to load categories"));
}, [businessCode]);

const getItemQty = (itemId) => {
  const found = cart.find(i => i.itemId === itemId);
  return found ? found.quantity : 0;
};

  /* ================= FILTERED MENU ================= */
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [menu, selectedCategory, search]);

  /* ================= CART ================= */
const addItem = (item) => {
  setCart(prev => {
    const exist = prev.find(i => i.itemId === item._id);

    if (exist) {
      return prev.map(i =>
        i.itemId === item._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    }

    return [
      ...prev,
      {
        itemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      },
    ];
  });
};

const increaseQty = (itemId) => {
  setCart(prev =>
    prev.map(i =>
      i.itemId === itemId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )
  );
};

const decreaseQty = (itemId) => {
  setCart(prev =>
    prev
      .map(i =>
        i.itemId === itemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      .filter(i => i.quantity > 0)
  );
};

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const submitOrder = async () => {
    if (!unitCode || cart.length === 0) {
      alert("Select table & add items");
      return;
    }

    setLoading(true);
    await axios.post(`${API_URLS.ORDER}/place`, {
      businessCode,
      unitCode,
      items: cart.map(i => ({
        itemId: i.itemId,
        quantity: i.quantity
      }))
    });
    setCart([]);
    setUnitCode("");
    onSuccess();
    setLoading(false);
  };

  return (
    <div className="fk-layout">

      {/* LEFT MENU */}
      <div className="fk-menu">
<div className="fk-menu-header">
        {/* 🔍 SEARCH (NO CSS CHANGE) */}
        <input
          placeholder="Search item..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* 🏷 CATEGORY FILTER (NO CSS CHANGE) */}
        <div className="fk-categories">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
        className={selectedCategory === cat ? "active" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
</div>
<div className="menu-conatiner">
        {/* ITEMS */}
        {filteredMenu.map(item => (
          <div key={item._id} className="fk-menu-item">
            <img src={item.image || "/no-img.png"} />
            <div className="fk-info">
              <p className="name">{item.name}</p>
              <p className="price">₹{item.price}</p>
            </div>
        {getItemQty(item._id) === 0 ? (
  <button onClick={() => addItem(item)}>ADD</button>
) : (
<div className="menu-qty">
  <button
    className="qty-decrease"
    onClick={() => decreaseQty(item._id)}
  >
    −
  </button>

  <span className="qty-count">{getItemQty(item._id)}</span>

  <button
    className="qty-increase"
    onClick={() => increaseQty(item._id)}
  >
    +
  </button>
</div>

)}

          </div>
        ))}
</div>
      </div>
      {/* RIGHT CART */}
      <div className="fk-cart">
<select
  className="fk-table"
  value={unitCode}
  onChange={e => setUnitCode(e.target.value)}
>
  <option value="">Select Table</option>

  {units.map(u => (
    <option key={u._id} value={u.unitCode}>
      {u.unitName}
    </option>
  ))}
</select>







        <div className="fk-cart-list">
          {cart.map(i => (
            <div key={i.itemId} className="fk-cart-item">
              <img src={i.image || "/no-img.png"} />
              <div className="fk-cart-info">
                <p>{i.name}</p>
                <span>₹{i.price}</span>
              </div>
              <div className="fk-qty">
        <button onClick={() => decreaseQty(i.itemId)}>−</button>
<span>{i.quantity}</span>
<button onClick={() => increaseQty(i.itemId)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="fk-footer">
          <div className="fk-total">Total: ₹{total}</div>
          <button onClick={submitOrder} disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualOrderForm;
