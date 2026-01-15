import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menuAdmin.css";
import { API_URLS } from "../../../../../services/api.js";

const MenuAdmin = ({ businessId, businessCode }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    category: null,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
const [showItemForm, setShowItemForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  /* ================= FETCH MENU ================= */
  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `${API_URLS.MENU}/admin?businessId=${businessId}`
      );
      setMenu(res.data);
    } catch {
      alert("Failed to load menu");
    }
  };

  useEffect(() => {
    if (businessId) fetchMenu();
  }, [businessId]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    if (!businessCode) return;

    axios
      .get(`${API_URLS.MENU}/categories/${businessCode}`)
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"));
  }, [businessCode]);

  /* ================= CLOSE RIGHT CLICK MENU ================= */
  useEffect(() => {
    const closeMenu = () =>
      setContextMenu({ visible: false, x: 0, y: 0, category: null });

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* ================= FILTER MENU ================= */
  const filteredMenu =
    selectedCategory === "All"
      ? menu
      : menu.filter(
          (item) =>
            item.category &&
            item.category.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
        );

  /* ================= HANDLE FORM ================= */
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Name and price required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price));
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    try {
      if (editId) {
        formData.append("menuId", editId);
        await axios.put(`${API_URLS.MENU}/update`, formData);
        alert("Item updated");
      } else {
        formData.append("businessId", businessId);
        await axios.post(`${API_URLS.MENU}/add`, formData);
        alert("Item added");
      }

      setForm({ name: "", price: "", category: "", image: null });
      setEditId(null);
      fetchMenu();
      setShowItemForm(false);

    } catch {
      alert("Error saving item");
    }
  };

  /* ================= EDIT / DELETE ITEM ================= */
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category || "",
      image: null,
    });
    setShowItemForm(true); 
  };

  const handleDeleteItem = async (menuId) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(`${API_URLS.MENU}/delete`, {
        data: { menuId },
      });
      fetchMenu();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="menu-admin">
     
{showItemForm && (
  <div className="item-form-overlay">
    <form onSubmit={handleSubmit} className="menu-form">
      <h1 style={{textAlign:"center"}}>Add New Item</h1>
      <input
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input type="file" accept="image/*" onChange={handleChange} />

      <div className="form-actions">
        <button type="submit">
          {editId ? "Update Item" : "Save Item"}
        </button>

        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
            setShowItemForm(false);
            setEditId(null);
            setForm({ name: "", price: "", category: "", image: null });
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
<div className={showItemForm ? "blur-bg" : ""}>
  <div className="heading">
 <h2 style={{fontSize:"30px",}}>Menu Management</h2>
 {!showItemForm && (
  <div className="add-item-top">
    <button
      className="add-item-btn"
      onClick={() => {
        setEditId(null);
        setForm({ name: "", price: "", category: "", image: null });
        setShowItemForm(true);
      }}
    >
      ➕ Add Item
    </button>
  </div>
)}
</div>
      {/* ================= CATEGORY BAR ================= */}
  {/* ================= CATEGORY BAR ================= */}
<div className="category-bar-admin">
  <span
    className={selectedCategory === "All" ? "active" : ""}
    onClick={() => setSelectedCategory("All")}
  >
    All
  </span>

  {categories.map((cat) => (
    <span
      key={cat._id}
      className={selectedCategory === cat.name ? "active" : ""}
      onClick={() => setSelectedCategory(cat.name)}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          visible: true,
          x: e.pageX,
          y: e.pageY,
          category: cat,
        });
      }}
    >
      {cat.name}
    </span>
  ))}

  {/* ➕ ADD CATEGORY BUTTON */}
  <span
    className="add-category-chip"
    onClick={() => setShowCategoryModal(true)}
  >
    ➕ Add
  </span>
</div>

{/* ================= ADD ITEM BUTTON ================= */}


      {/* ================= MENU TABLE ================= */}
      <table className="menu-table">
        <thead>
          <tr className="menudata">
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredMenu.map((item) => (
            <tr className="menudata" key={item._id}>
              <td>
                {item.image ? (
                  <img src={item.image} alt="" className="menu-img" />
                ) : (
                  "-"
                )}
              </td>
              <td>{item.name}</td>
              <td>₹ {item.price}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button
                  className="danger"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredMenu.length === 0 && (
            <tr>
              <td colSpan="5">No items</td>
            </tr>
          )}
        </tbody>
      </table>
</div>
      {/* ================= RIGHT CLICK DELETE CATEGORY ================= */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div
            className="context-item danger"
            onClick={async () => {
              if (!window.confirm("Delete this category?")) return;

              try {
                await axios.delete(
                  `${API_URLS.MENU}/category/${businessCode}/${contextMenu.category._id}`
                );

                setCategories((prev) =>
                  prev.filter((c) => c._id !== contextMenu.category._id)
                );

                if (selectedCategory === contextMenu.category.name) {
                  setSelectedCategory("All");
                }
              } catch {
                alert("Category delete failed");
              } finally {
                setContextMenu({ visible: false });
              }
            }}
          >
            🗑 Delete Category
          </div>
        </div>
      )}
      {/* ================= ADD CATEGORY MODAL ================= */}
{showCategoryModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Add Category</h3>

      <input
        type="text"
        placeholder="Category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setShowCategoryModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn-save"
          disabled={categoryLoading}
          onClick={async () => {
            if (!newCategory.trim()) return;

            try {
              setCategoryLoading(true);

              const res = await axios.post(
                `${API_URLS.MENU}/add/categorie`,
                {
                  businessId,
                  name: newCategory,
                }
              );

              // 🔥 LIVE UPDATE
              setCategories((prev) => [...prev, res.data]);
              setSelectedCategory(res.data.name);

              setNewCategory("");
              setShowCategoryModal(false);
            } catch {
              alert("Failed to add category");
            } finally {
              setCategoryLoading(false);
            }
          }}
        >
          {categoryLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  
  );
};

export default MenuAdmin;
