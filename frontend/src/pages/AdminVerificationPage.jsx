import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/auth";
import Layout from "../components/common/Layout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const getBackendRoot = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

function AdminVerificationPage() {
  const { user } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const res = await authService.getPendingVerifications();
        setPending(res?.users || res?.data?.users || []);
      } catch (err) {
        setError(err.message || "Failed to load pending verifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleReview = async (userId, action) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await authService.reviewVerification(userId, action);
      setPending((prev) => prev.filter((entry) => entry._id !== userId));
    } catch (err) {
      setError(err.message || `Failed to ${action} verification.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto p-6">
          <Card className="p-6 text-center">
            <p className="font-semibold">Loading user data...</p>
          </Card>
        </div>
      </Layout>
    );
  }

  if (user.role?.toLowerCase() !== "admin") {
    return (
      <Layout>
        <div className="max-w-xl mx-auto p-6">
          <Card className="p-6 text-center">
            <h1 className="text-xl font-bold mb-3">Access Denied</h1>
            <p className="text-sm text-slate-600 mb-4">
              This page is only visible to admin users.
            </p>
            <Button to="/" variant="primary">
              Go Home
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pending ID Verifications</h1>
            <p className="text-sm text-slate-600 mt-1">
              Review uploaded college IDs and approve or reject each submission.
            </p>
          </div>
          <Button to="/profile" variant="outline">
            Back to Profile
          </Button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <Card className="p-6 bg-rose-50 border border-rose-200 text-rose-800">
            <p>{error}</p>
          </Card>
        ) : pending.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="font-semibold">No pending verifications at the moment.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.map((entry) => {
              const imageUrl = entry.idCardImage
                ? `${getBackendRoot()}/${entry.idCardImage.replace(/^\/*/, "")}`
                : null;

              return (
                <Card key={entry._id} className="p-6">
                  <div className="flex flex-col gap-4 sm:gap-6">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-start">
                      <div>
                        <p className="text-sm text-slate-500">Name</p>
                        <p className="text-lg font-semibold">{entry.name}</p>
                        <p className="text-sm text-slate-500 mt-2">Email</p>
                        <p className="text-sm text-slate-700">{entry.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReview(entry._id, "approve")}
                          disabled={actionLoading[entry._id]}
                        >
                          {actionLoading[entry._id] ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReview(entry._id, "reject")}
                          disabled={actionLoading[entry._id]}
                        >
                          {actionLoading[entry._id] ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </div>

                    {imageUrl ? (
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Uploaded ID card</p>
                        <img
                          src={imageUrl}
                          alt={`ID for ${entry.name}`}
                          className="w-full max-h-96 object-contain rounded border border-slate-200"
                        />
                      </div>
                    ) : (
                      <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                        No uploaded ID image found.
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminVerificationPage;
