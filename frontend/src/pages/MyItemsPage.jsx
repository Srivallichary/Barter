import React, { useState, useContext, useEffect } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Layers, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import { itemService } from "../services/itemService";
import api from "../services/api";

const categories = ["Textbooks", "Electronics", "Dorm Decor", "Clothing & Gear", "Games & Hobbies", "Bicycles & Sports"];

// Premium Horizontal Skeleton Card component
function SkeletonMyItemCard() {
  return (
    <div className="border border-slate-200/50 rounded-3xl p-4 bg-white/60 backdrop-blur-sm space-y-4 animate-pulse flex flex-col sm:flex-row gap-4 min-h-[180px]">
      <div className="sm:w-2/5 aspect-video sm:aspect-auto w-full bg-slate-200 rounded-2xl min-h-[140px]" />
      <div className="sm:w-3/5 p-2 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4.5 w-2/3 bg-slate-200 rounded-lg" />
          <div className="h-3 w-full bg-slate-200 rounded-lg" />
          <div className="h-3 w-4/5 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex gap-2.5 pt-3.5 border-t border-slate-100">
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

function MyItemsPage() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [image, setImage] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsSaving(true);
      const res = await api.post("/upload", formData);
      const apiHost = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
      const uploadedImageUrl = res.data?.path && /^https?:\/\//i.test(res.data.path)
        ? res.data.path
        : `${apiHost}${res.data.path}`;
      setImage(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image. Max file size is 5MB, format: jpg, png, webp.");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch Items statefully
  useEffect(() => {
    if (!user) return;

    const fetchMyItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const userItems = await itemService.getMyItems();
        setItems(userItems);
      } catch (err) {
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };


    fetchMyItems();
  }, [user]);

  // Auth lock screen
  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 px-4">
          <Card className="p-8 text-center border border-slate-200/60 shadow-xl flex flex-col items-center bg-white" hoverable={false}>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Login Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              To list your own textbooks, dorm gear, or electronics, you need to sign in with your credentials.
            </p>
            <Button to="/login" variant="primary" className="w-full bg-indigo-650 hover:bg-indigo-700">
              Sign In Now
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Open modal for creating a new item
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setCategory(categories[0]);
    setDescription("");
    setLookingFor("");
    setImage("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing an item
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setLookingFor(item.lookingFor);
    setImage(item.image);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Delete item handler
  const handleDeleteItem = async (itemId, itemTitle) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      try {
        setLoading(true);
        await itemService.deleteItem(itemId);
        setItems(items.filter((item) => item.id !== itemId));
        toast.error(`Removed listing: ${itemTitle}`, {
          icon: "🗑️",
        });
      } catch (err) {
        toast.error("Failed to delete item listing.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Validate item form
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!lookingFor.trim()) errors.lookingFor = "Please specify what you want in return";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes handler
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const categoryImages = {
      Textbooks: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      Electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "Dorm Decor": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80",
      "Clothing & Gear": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
      "Games & Hobbies": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80",
      "Bicycles & Sports": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    };

    const finalImage = image.trim() || categoryImages[category] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600";

    setIsSaving(true);
    try {
      if (editingItem) {
        const updated = await itemService.updateItem(editingItem.id, {
          title,
          category,
          description,
          lookingFor,
          image: finalImage
        });

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === editingItem.id ? updated : item
          )
        );
        toast.success(`Updated listing: ${title}`);
      } else {
        const newItem = await itemService.createItem({
          title,
          category,
          description,
          lookingFor,
          image: finalImage,
          condition: "Like New",
          location: user.department || "Madhapur, Hyderabad"
        });

        if (newItem) {
          setItems((currentItems) => [newItem, ...currentItems]);
          toast.success(`Listed item: ${title}`, { icon: "📦" });
        } else {
          throw new Error("Unexpected response from server when creating item.");
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* Floating Add Item Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-30 md:hidden">
        <button
          onClick={handleOpenAddModal}
          disabled={loading || isSaving}
          className="w-12 h-12 rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.3)] bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-white/35">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight m-0">
              My Exchange Items
            </h1>
            <p className="text-xs sm:text-sm font-extrabold text-slate-405 uppercase tracking-widest">
              List and manage items you're looking to swap with others in your community.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            variant="primary"
            icon={Plus}
            disabled={loading || isSaving}
            className="shadow-sm cursor-pointer bg-indigo-650 hover:bg-indigo-700 hidden sm:inline-flex"
          >
            Add New Item
          </Button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonMyItemCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-10">
            <Card className="p-8 border border-red-200/50 bg-red-50/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-650 flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Failed to Load Listings</h3>
              <p className="text-xs text-slate-500 mb-4">{error}</p>
            </Card>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(Array.isArray(items) ? items : []).map((item) => (
              <Card
                key={item.id}
                className="glass-card flex flex-col sm:flex-row overflow-hidden border border-white/35 transition-all duration-300 shadow-sm"
                hoverable={false}
              >
                {/* Image */}
                <div className="sm:w-2/5 aspect-video sm:aspect-auto w-full relative min-h-[160px] bg-slate-50/50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="slate">{item.category}</Badge>
                  </div>
                </div>

                {/* Info and action panel */}
                <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Seeking criteria */}
                    <div className="pt-2">
                      <div className="flex items-center gap-2.5 text-xs bg-white/40 border border-white/30 p-2.5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                        <RefreshCw size={14} className="text-indigo-500 animate-spin-slow shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block leading-none">Looking For</span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-750 truncate block mt-1 leading-none">
                            {item.lookingFor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete controls */}
                  <div className="flex gap-2.5 pt-3.5 border-t border-slate-200/50">
                    <Button
                      onClick={() => handleOpenEditModal(item)}
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      disabled={loading || isSaving}
                      className="flex-1 text-xs font-bold uppercase tracking-widest py-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      disabled={loading || isSaving}
                      className="flex-1 text-xs font-bold uppercase tracking-widest py-2 text-red-650 hover:text-red-750 hover:bg-red-50/50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Listed Items"
            description="You haven't listed any items for barter yet. Add some items now to start swap requests!"
            actionText="List First Item"
            onActionClick={handleOpenAddModal}
            actionIcon={Plus}
          />
        )}
      </div>

      {/* Add/Edit Listing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Swapping Listing" : "Add New Swapping Listing"}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveItem}
              isLoading={isSaving}
              icon={Plus}
              className="bg-indigo-650 hover:bg-indigo-700"
            >
              {editingItem ? "Update Listing" : "Publish Listing"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <Input
            label="Item Title"
            type="text"
            placeholder="e.g. Graphing Calculator TI-84 Plus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
            disabled={isSaving}
            required
          />

          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSaving}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-900 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:bg-slate-100/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seeking Item (Looking For)"
            type="text"
            placeholder="e.g. Dorm Floor Fan or Bio textbook"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            error={formErrors.lookingFor}
            disabled={isSaving}
            required
          />

          <Input
            label="Image URL (Optional)"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            helperText="Leave blank to use a default placeholder based on category."
            disabled={isSaving}
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Or Upload Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isSaving}
              className="block w-full text-xs text-slate-550 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer disabled:opacity-50"
            />
            {image && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 mb-2">Selected image preview</p>
                <div className="w-full h-48 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={image} alt="Selected item preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Provide a quick note on the condition, features, or size..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              className={`
                block w-full rounded-xl border bg-white py-2.5 px-4 text-sm text-slate-900 transition-all duration-200
                placeholder:text-slate-400
                focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none
                ${formErrors.description ? "border-red-300 text-red-900" : "border-slate-200 hover:border-slate-300"}
                disabled:bg-slate-100/50
              `}
              required
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-red-650 font-bold">{formErrors.description}</p>
            )}
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default MyItemsPage;
