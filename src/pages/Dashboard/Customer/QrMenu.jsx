import { io } from "socket.io-client";
  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import "./qrMenu.css";
  import { SOCKET_URL } from "../../../services/api.js";
  import { API_URLS } from "../../../services/api";
import { useRef } from "react";

const QrMenu = () => {
  const socketRef = useRef(null);

    const { businessCode, unitCode } = useParams();
const [enableItemNote, setEnableItemNote] = useState(false);
    const [menu, setMenu] = useState([]);
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [allowEarlyFeedback, setAllowEarlyFeedback] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  // 🛒 CART STATE
  const [cart, setCart] = useState([]);
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (!businessCode || !socketRef.current) return;
    
    socketRef.current.emit("join-business", businessCode);
    
    const orderHandler = ({ orderId: id, status }) => {
      setOrderStatus(status);
    };
    
    const paymentHandler = ({ orderId: id, paymentStatus }) => {
      setPaymentStatus(paymentStatus);
    };
    
    socketRef.current.on("order-status-update", orderHandler);
    socketRef.current.on("payment-updated", paymentHandler);
    
    return () => {
      socketRef.current.off("order-status-update", orderHandler);
      socketRef.current.off("payment-updated", paymentHandler);
    };
  }, [businessCode, orderId]);
  
  
  useEffect(() => {
    axios
    .get(`${API_URLS.MENU}/by-business/${businessCode}`)
    .then((res) => {
      setMenu(res.data.menu || []);
      setBusinessName(res.data.businessName || "");
      setEnableItemNote(res.data.enableItemNote || false);
      
      setFeedbackEnabled(
        res.data.enableFeedback || false
      );
      setAllowEarlyFeedback(
        res.data.allowBeforeCompletion || false
      );
    })
    .catch((err) => {
      console.error("Menu API failed:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [businessCode]);
  
useEffect(() => {
  const uniqueCategories = [
    { _id: "all", name: "All" },
  ];

  if (menu.length) {
    const map = new Map();

    menu.forEach((item) => {
      if (item.categoryId?._id) {
        map.set(item.categoryId._id, {
          _id: item.categoryId._id,
          name: item.categoryId.name,
        });
      }
    });

    uniqueCategories.push(...map.values());
  }

  setCategories(uniqueCategories);
}, [menu]);



    /* ================= CATEGORY ================= */

const fetchCategories = async () => {
  if (!businessCode) return;

  try {
    const res = await axios.get(
      `${API_URLS.MENU}/used-categories/${businessCode}`
    );
  setCategories([
  { _id: "all", name: "All" },
  ...(res.data || []),
]);

  } catch {
    Alert.alert("Error", "Failed to load categories");
  }
};



useEffect(() => {
  if (orderStatus === "COMPLETED" && paymentStatus === "PAID") {
    setShowOrderSummary(false);
    setPlacedOrders([]);
    setCart([]);

    // setTimeout(() => {
    //   alert("✅ Order Completed. Thank you!");
    //   window.location.reload(); // ❌ yahin problem
    // }, 4000);
  }
}, [orderStatus, paymentStatus]);


useEffect(() => {
  const handleBeforeUnload = (e) => {
    // 🔒 Lock only when order is active
    if (orderId && orderStatus !== "COMPLETED") {
      e.preventDefault();
      e.returnValue = ""; // required for browser
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [orderId, orderStatus]);
useEffect(() => {
  if (
    feedbackEnabled &&
    orderId &&
    ["COMPLETED", "READY"].includes(orderStatus) &&
    ["PAID", "SUCCESS"].includes(paymentStatus)
  ) {
    setShowFeedbackModal(true);
  }
}, [orderStatus, paymentStatus, feedbackEnabled, orderId]);

    if (loading) return <div className="loading">🍽 Loading Menu...</div>;
const grandTotal = placedOrders.reduce(
  (sum, order) => sum + order.totalAmount,
  0
);

const filteredMenu =
  selectedCategory === "All"
    ? menu
    : menu.filter(
        (item) =>
          item.categoryId?.name === selectedCategory
      );


useEffect(() => {
  console.log("UPDATED CATEGORIES:", categories);
}, [categories]);



    /* ================= CART LOGIC ================= */
const submitFeedback = async () => {
  try {
    await axios.post(`${API_URLS.FEEDBACK}`, {
      businessCode: businessCode.toUpperCase(),
      orderId,
      rating,
      message: feedbackMsg,
    });

    alert("🙏 Thanks for your feedback!");
    setShowFeedbackModal(false);
    setFeedbackMsg("");
    setRating(5);

    // 🔥 ONLY refresh after final completion
    if (
      orderStatus === "COMPLETED" &&
      paymentStatus === "PAID"
    ) {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }

  } catch (err) {
    alert(err.response?.data?.message || "Feedback failed");
  }
};


const addToCart = (item) => {
  setCart((prev) => {
    const found = prev.find((i) => i._id === item._id);
    if (found) {
      return prev.map((i) =>
        i._id === item._id ? { ...i, qty: i.qty + 1 } : i
      );
    }
    return [...prev, { ...item, qty: 1, note: "" }];
  });
};

const updateItemNote = (id, value) => {
  setCart((prev) =>
    prev.map((i) =>
      i._id === id ? { ...i, note: value } : i
    )
  );
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
         note: i.note,
      })),
    });

    // ✅ NOW res EXISTS
setPlacedOrders((prev) => [
  ...prev,
  {
    items: cart.map((i) => ({
      _id: i._id,
      name: i.name,
      price: i.price,
      quantity: i.qty,
    })),
    totalAmount,
  },
]);

    setShowOrderSummary(true);
setCart([]); // bottom cart clear
    setOrderId(res.data.order._id);
    setOrderStatus(res.data.order.orderStatus || "PENDING");

    alert("✅ Order Placed Successfully");
    setCart([]);
  } catch (err) {
    console.error("Order error:", err);
    alert("❌ Order failed");
  }
};


const getOrderStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "APPROVED":
      return "Preparing";
    case "COMPLETED":
      return "Ready";
    default:
      return status;
  }
};

    return (
      <div className="qr-container">
{placedOrders.length > 0 &&
  orderStatus !== "COMPLETED" &&
  paymentStatus !== "PAID" && (
  <div
    className="top-cart-icon"
    onClick={() => setShowOrderSummary((p) => !p)}
  >
    🛒
  </div>
)}




        {/* 🧭 CATEGORY BAR */}
   <div className="category-bar">
{categories.map((cat) => (
  <button
    key={cat._id}
    className={selectedCategory === cat.name ? "active" : ""}
    onClick={() => setSelectedCategory(cat.name)}
  >
    {cat.name}
  </button>
))}

            <div style={{width:"30px", height:"10px", marginLeft:"50px"}}></div>
</div>


{orderStatus && (
  <div className={`order-status ${orderStatus.toLowerCase()}`}>
    🧾 Order Status: <b>{getOrderStatusLabel(orderStatus)}</b>
  </div>
)}

        <div className="menu-grid">
          {filteredMenu.map((item) => {
            const qty = getQty(item._id);

            return (
              <div key={item._id} className="menu-card">

             <img
  src={item.image || "/no-image.png"}
  alt={item.name}
/>


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
{enableItemNote && qty > 0 && (
  <textarea
    className="item-note"
    placeholder="📝 Spicy / No onion / Less oil"
    value={cart.find((i) => i._id === item._id)?.note || ""}
    onChange={(e) =>
      updateItemNote(item._id, e.target.value)
    }
  />
)}


              </div>
            );
          })}
{showFeedbackModal && (
  <div className="feedback-overlay">
    <div className="feedback-box">
      <h3>⭐ Rate Your Experience</h3>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>
     

      <textarea
        placeholder="Write your feedback..."
        value={feedbackMsg}
        onChange={(e) => setFeedbackMsg(e.target.value)}
      />

      <button onClick={submitFeedback}>
        Submit Feedback
      </button>
    </div>
  </div>
)}

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
{showOrderSummary &&
  orderStatus !== "COMPLETED" &&
  paymentStatus !== "PAID" && (
  <div
    className="order-overlay"
    onClick={() => setShowOrderSummary(false)}
  >
    <div
      className="order-summary"
      onClick={(e) => e.stopPropagation()}
    >
      <h4>🧾 Your Orders</h4>

      {placedOrders.map((order, index) => (
        <div key={index} className="placed-order">
          <h5>Order #{index + 1}</h5>

          {order.items.map((item) => (
            <div key={item._id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

         <div style={{display:"flex",justifyContent:"end"}}>
           <div className="summary-total">
            Total: ₹{order.totalAmount}
          </div>
         </div>
        </div>
      ))}


      {/* GRAND TOTAL */}
      <div className="grand-total">
        <span>Grand Total</span>
        <span>
          ₹{grandTotal}
        </span>
      </div>
{feedbackEnabled &&
  allowEarlyFeedback &&
  orderStatus !== "COMPLETED" && (
    <div
      className="early-feedback"
      onClick={() => setShowFeedbackModal(true)}
    >
      💬 Give Feedback
    </div>
)}

      <button
  className="close-summary-btn"
  onClick={(e) => {
    e.stopPropagation();
    setShowOrderSummary(false);
  }}
>
  Close
</button>

    </div>
  </div>
)}



      </div>
    );
  };

  export default QrMenu;
