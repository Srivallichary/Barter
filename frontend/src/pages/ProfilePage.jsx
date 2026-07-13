import React, { useState, useContext } from "react";
import { User, ShieldCheck, Mail, Phone, MapPin, Calendar, Star, Edit3, FolderOpen, ArrowLeftRight, CheckCircle, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";

function ProfilePage() {
  const { user, updateProfile, setCurrentUser } = useContext(AuthContext);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [selectedIdFile, setSelectedIdFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(false);

  // Auth lock screen
  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 px-4">
          <Card className="p-8 text-center border border-slate-100 shadow-xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Login Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              To inspect your profile, monitor statistics, or update your major, please sign in.
            </p>
            <Button to="/login" variant="primary" className="w-full">
              Sign In Now
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Pre-fill fields on edit click
  const handleOpenEditModal = () => {
    setEditName(user.name);
    setEditPhone(user.phone || "");
    setEditDepartment(user.department || "");
    setEditAvatar(user.avatar || "");
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Submit edit profiles
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      setFormErrors({ name: "Name cannot be empty" });
      return;
    }

    if (!editDepartment.trim()) {
      setFormErrors({ department: "Department/Major cannot be empty" });
      return;
    }

    const updatedUser = await updateProfile({
      name: editName,
      phone: editPhone,
      department: editDepartment,
      avatar: editAvatar,
    });
    setCurrentUser(updatedUser);
    setIsEditModalOpen(false);
    toast.success("Profile updated successfully!", { icon: "👤" });
  };

  const handleIdFileChange = (e) => {
    setSelectedIdFile(e.target.files[0] || null);
  };

  const handleUploadIdCard = async () => {
    if (!selectedIdFile) {
      toast.error("Please select your college ID image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("idCard", selectedIdFile);

    try {
      setUploadingId(true);
      const res = await authService.uploadIdCard(formData);
      const updatedUser = res.data?.user || res.user || user;
      setCurrentUser(updatedUser);
      toast.success("ID uploaded successfully. Verification is now pending.");
      setSelectedIdFile(null);
    } catch (error) {
      toast.error(error.message || "Failed to upload ID card.");
    } finally {
      setUploadingId(false);
    }
  };

  const verificationReminder = user.verificationStatus !== "verified" && user.verificationStatus !== "pending";

  const statMetrics = [
    { value: user.completedTrades || 0, label: "Completed Swaps", icon: <CheckCircle size={18} className="text-emerald-500" /> },
    { value: user.listingCount || 0, label: "Active Listings", icon: <FolderOpen size={18} className="text-indigo-500" /> },
    { value: `${user.rating || 4.8} ★`, label: "Trust Score", icon: <Star size={18} className="text-amber-500 fill-amber-500" /> },
  ];

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Personal details widget (1 Col) */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white border border-slate-200/55 p-6 text-center shadow-sm" hoverable={false}>
              <div className="flex flex-col items-center">
                <Avatar name={user.name} src={user.avatar} size="xl" className="shadow-sm" />
                <h2 className="text-xl font-bold text-slate-900 mt-4 leading-tight m-0">
                  {user.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1.5 justify-center">
                  <ShieldCheck size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {user.verificationStatus === 'verified' ? 'Verified Student' : user.verificationStatus === 'pending' ? 'Verification Pending' : 'Student Verification Required'}
                  </span>
                </div>

                <Button
                  onClick={handleOpenEditModal}
                  variant="outline"
                  size="sm"
                  className="mt-6 w-full text-xs font-bold py-2"
                  icon={Edit3}
                >
                  Edit Profile
                </Button>
              </div>

              {/* Detail fields */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-left space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold leading-none">Location / Area</p>
                    <p className="text-slate-700 font-semibold mt-1">{user.department || "Undeclared"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold leading-none">Email Address</p>
                    <p className="text-slate-700 font-semibold mt-1 truncate max-w-xs">{user.email || `${user.name.toLowerCase()}@example.com`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold leading-none">Contact Phone</p>
                    <p className="text-slate-700 font-semibold mt-1">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold leading-none">Joined Platform</p>
                    <p className="text-slate-700 font-semibold mt-1">{user.joinDate || "Sept 2025"}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-slate-200/55 p-6 shadow-sm" hoverable={false}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">College ID Verification</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a clear image of your college ID card. Our admin team will review it and update your verification status.
                  </p>
                </div>

                {user.verificationStatus === 'verified' ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    Your student identity is verified.
                  </div>
                ) : user.verificationStatus === 'pending' ? (
                  <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                    Your college ID is under review. You can upload a new copy if needed.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Upload your college ID to verify your student status and gain full access to the platform.
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdFileChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                  />
                  <Button
                    onClick={handleUploadIdCard}
                    variant="primary"
                    size="sm"
                    disabled={uploadingId}
                  >
                    {uploadingId ? "Uploading..." : user.verificationStatus === 'verified' ? "Update ID" : "Upload College ID"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Statistics + Activity lists (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {verificationReminder && (
              <Card className="border border-emerald-200/70 bg-emerald-50/70 p-4 shadow-sm" hoverable={false}>
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Verification reminder</h3>
                    <p className="text-sm text-slate-600 mt-1">Upload your college ID to build trust and unlock the full Barter experience.</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              {statMetrics.map((metric, idx) => (
                <Card
                  key={idx}
                  className="glass-card p-5 flex flex-col items-center justify-center text-center shadow-sm border border-white/35"
                  hoverable={false}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/60 border border-white/40 flex items-center justify-center mb-3 shadow-sm">
                    {metric.icon}
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-indigo-650 leading-none">
                    {metric.value}
                  </p>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-450 mt-2 uppercase tracking-wider">
                    {metric.label}
                  </p>
                </Card>
              ))}
            </div>

            {/* Recents swap list ledger */}
            <Card className="glass-card p-6 shadow-sm border border-white/35 bg-white/20" hoverable={false}>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-indigo-655" />
                Recent Swap Activity
              </h3>

              <div className="py-10 text-center text-sm text-slate-500">
                Your recent swap activity will appear here once you start trading on Barter.
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Profile Details"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveProfile}
              className="bg-indigo-650 hover:bg-indigo-700"
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Sarah Jenkins"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            error={formErrors.name}
            required
          />

          <Input
            label="Location / Area"
            type="text"
            placeholder="e.g. Downtown Area"
            value={editDepartment}
            onChange={(e) => setEditDepartment(e.target.value)}
            error={formErrors.department}
            required
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="+1 (555) 012-3456"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
          />

          <Input
            label="Avatar Image URL (Optional)"
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
          />
        </form>
      </Modal>
    </Layout>
  );
}

export default ProfilePage;
