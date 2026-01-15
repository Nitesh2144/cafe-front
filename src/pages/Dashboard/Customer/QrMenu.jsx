import { io } from "socket.io-client";
const socket = io("https://cafe-backend-28q0.onrender.com");
  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import "./qrMenu.css";
  import { API_URLS } from "../../../services/api.js";

  const QrMenu = () => {
    const { businessCode, unitCode } = useParams();

    const [menu, setMenu] = useState([]);
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
const [orderStatus, setOrderStatus] = useState(null);
const [orderId, setOrderId] = useState(null);
const [paymentStatus, setPaymentStatus] = useState("UNPAID");

useEffect(() => {
  if (!businessCode) return;

  socket.emit("join-business", businessCode);

socket.on(
  "order-status-update",
  ({ orderId: id, status, paymentStatus }) => {
    if (id === orderId) {
      setOrderStatus(status);
      if (paymentStatus) {
        setPaymentStatus(paymentStatus);
      }
    }
  }
);


  return () => {
    socket.off("order-status-update");
  };
}, [businessCode, orderId]);


    // 🛒 CART STATE
    const [cart, setCart] = useState([]);
console.log(businessCode);

    useEffect(() => {
      axios
        .get(`${API_URLS.MENU}/by-business/${businessCode}`)
        .then((res) => {
          setMenu(res.data.menu || res.data);
          setBusinessName(res.data.businessName || "");
          setLoading(false);
        });
    }, [businessCode]);

    /* ================= CATEGORY ================= */
  useEffect(() => {
    axios
      .get(`${API_URLS.MENU}/categories/${businessCode}`)
      .then((res) => {
        setCategories(["All", ...res.data.map((c) => c.name)]);
      })
      .catch((err) => console.error(err));
  }, [businessCode]);


    const filteredMenu =
      selectedCategory === "All"
        ? menu
        : menu.filter((item) => item.category === selectedCategory);

    /* ================= CART LOGIC ================= */

    const addToCart = (item) => {
      setCart((prev) => {
        const found = prev.find((i) => i._id === item._id);
        if (found) {
          return prev.map((i) =>
            i._id === item._id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [...prev, { ...item, qty: 1 }];
      });
    };

    const increaseQty = (id) => {
      setCart((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    };

    const decreaseQty = (id) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i._id === id ? { ...i, qty: i.qty - 1 } : i
          )
          .filter((i) => i.qty > 0)
      );
    };

    const getQty = (id) => {
      const item = cart.find((i) => i._id === id);
      return item ? item.qty : 0;
    };

    /* ================= TOTAL ================= */
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    /* ================= PLACE ORDER ================= */
const placeOrder = async () => {
  if (cart.length === 0) return alert("Cart is empty");

  try {
    const res = await axios.post(`${API_URLS.ORDER}/place`, {
      businessCode,
      unitCode,
      items: cart.map((i) => ({
        itemId: i._id,
        quantity: i.qty,
      })),
    });

    // ✅ NOW res EXISTS
    setOrderId(res.data.order._id);
    setOrderStatus(res.data.order.orderStatus || "PENDING");

    alert("✅ Order Placed Successfully");
    setCart([]);
  } catch (err) {
    console.error("Order error:", err);
    alert("❌ Order failed");
  }
};

useEffect(() => {
  if (orderStatus === "COMPLETED" && paymentStatus === "PAID") {
    setTimeout(() => {
      alert("✅ Order Completed. Thank you!");
      window.location.reload(); // OR redirect
    }, 4000);
  }
}, [orderStatus, paymentStatus]);


    if (loading) return <div className="loading">🍽 Loading Menu...</div>;

    return (
      <div className="qr-container">
        <h2 className="business-title">{businessName}</h2>

        {/* 🧭 CATEGORY BAR */}
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🍽 MENU GRID */}
                            {orderStatus && (
  <div className={`order-status ${orderStatus.toLowerCase()}`}>
    🧾 Order Status: <b>{orderStatus}</b>
  </div>
)}
        <div className="menu-grid">
          {filteredMenu.map((item) => {
            const qty = getQty(item._id);

            return (
              <div key={item._id} className="menu-card">

                <img src={item.image} alt={item.name} />

                <div className="menu-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  </div>

                {qty === 0 ? (
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    ➕ Add
                  </button>
                ) : (
                  <div className="qty-box">
                    <button style={{backgroundColor:"#b19c9cff"}} onClick={() => decreaseQty(item._id)}>➖</button>
                    <span>{qty}</span>
                    <button style={{backgroundColor:"#7a8f43ff"}} onClick={() => increaseQty(item._id)}>➕</button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredMenu.length === 0 && (
            <p style={{ textAlign: "center", width: "100%" }}>
              No items in this category
            </p>
          )}
        </div>

        {/* 🧾 CART FOOTER */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div>
              <strong>Total:</strong> ₹{totalAmount}
            </div>
            <button className="place-order-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    );
  };

  export default QrMenu;
