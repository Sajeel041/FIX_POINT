import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [priceData, setPriceData] = useState({ price: '', negotiable: false });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    skillCategory: '',
    yearsExperience: '',
    about: '',
    price: '',
    availability: 'offline',
    certifications: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes, requestsRes] = await Promise.all([
          axios.get(`${API_URL}/auth/me`),
          axios.get(`${API_URL}/bookings/merchant/${user._id}`),
          axios.get(`${API_URL}/service-requests/available`).catch(() => ({ data: [] })),
        ]);
        setProfile(profileRes.data.profile);
        setBookings(bookingsRes.data);
        setAvailableRequests(requestsRes.data || []);
        if (profileRes.data.profile) {
          setFormData({
            skillCategory: profileRes.data.profile.skillCategory || '',
            yearsExperience: profileRes.data.profile.yearsExperience || '',
            about: profileRes.data.profile.about || '',
            availability: profileRes.data.profile.availability || 'offline',
            certifications: profileRes.data.profile.certifications?.join(', ') || '',
          });
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setPriceData({ price: '', negotiable: false });
    setShowPriceModal(true);
  };

  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    if (!priceData.price || parseFloat(priceData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      if (!selectedRequest || !selectedRequest._id) {
        toast.error('Invalid request. Please try again.');
        return;
      }

      await axios.post(`${API_URL}/service-requests/accept`, {
        requestId: selectedRequest._id,
        price: parseFloat(priceData.price),
        negotiable: priceData.negotiable,
      });
      toast.success('Request accepted! Customer will see you in their list.');
      setShowPriceModal(false);
      setSelectedRequest(null);
      setPriceData({ price: '', negotiable: false });
      window.location.reload();
    } catch (error) {
      console.error('Accept request error:', error);
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        certifications: formData.certifications
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c),
      };
      await axios.post(`${API_URL}/merchants/update`, updateData);
      toast.success('Profile updated successfully');
      setEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = profile.availability === 'online' ? 'offline' : 'online';
      await axios.post(`${API_URL}/merchants/update`, {
        availability: newStatus,
      });
      toast.success(`Status changed to ${newStatus}`);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Merchant Dashboard 📊
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your profile and bookings</p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-md ${profile?.availability === 'online'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gray-300 text-gray-700'
                }`}
            >
              {profile?.availability === 'online' ? '🟢 Online' : '⚫ Offline'}
            </button>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Profile</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-semibold text-sm sm:text-base"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skill Category
                  </label>
                  <select
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="Certification 1, Certification 2"
                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all text-base shadow-lg"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-3xl sm:text-4xl mr-4 sm:mr-6 shadow-inner">
                    {profile?.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">{profile?.skillCategory}</p>
                    <p className="text-sm text-gray-500">
                      ⭐ {profile?.rating?.toFixed(1) || '4.5'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">
                    {profile?.yearsExperience} years
                  </p>
                </div>
                {profile?.about && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">About</p>
                    <p className="text-gray-900">{profile.about}</p>
                  </div>
                )}
                {profile?.certifications?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Available Service Requests */}
          {profile?.availability === 'online' && (
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Available Service Requests
              </h2>
              {availableRequests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <p className="text-gray-600 text-sm sm:text-base">No available requests at the moment</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 mb-6">
                  {availableRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-md p-4 sm:p-6 active:scale-[0.98] transition-transform"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                              {request.serviceType}
                            </h3>
                            <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold ml-2">
                              Pending
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              <span className="font-semibold text-gray-900">Issue:</span> {request.issue}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">📍 Location:</span> {request.location}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              👤 Customer: {request.customerId?.name}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAcceptRequest(request)}
                          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all font-semibold text-base shadow-md whitespace-nowrap"
                        >
                          Accept
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Jobs Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Your Active Jobs
            </h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-gray-600 text-sm sm:text-base">No active jobs</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {booking.serviceType}
                          </h3>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ml-2 ${booking.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {booking.status === 'active' ? 'Active' : booking.status}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                          👤 Customer: {booking.customerId?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          📅 {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-col-reverse items-start sm:items-end gap-3">
                        <p className="font-bold text-xl sm:text-2xl text-gray-900">
                          PKR {booking.price}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          {(booking.status === 'active' || booking.status === 'accepted') && (
                            <Link
                              to={`/booking/${booking._id}`}
                              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all font-semibold shadow-md text-center"
                            >
                              💬 Chat
                            </Link>
                          )}
                          {booking.status === 'active' && (
                            <button
                              onClick={async () => {
                                try {
                                  await axios.patch(`${API_URL}/bookings/status`, {
                                    bookingId: booking._id,
                                    status: 'completed',
                                  });
                                  toast.success('Job marked as completed');
                                  window.location.reload();
                                } catch (error) {
                                  toast.error('Failed to update booking');
                                }
                              }}
                              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm sm:text-base hover:from-green-600 hover:to-green-700 active:scale-95 transition-all font-semibold shadow-md"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Price Input Modal - Mobile Optimized */}
      {showPriceModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Set Your Price
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Service:</span> {selectedRequest.serviceType}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Issue:</span> {selectedRequest.issue}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">📍 Location:</span> {selectedRequest.location}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitPrice} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Price (PKR) *
                </label>
                <input
                  type="number"
                  value={priceData.price}
                  onChange={(e) =>
                    setPriceData({ ...priceData, price: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  placeholder="Enter your price"
                />
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={priceData.negotiable}
                  onChange={(e) =>
                    setPriceData({ ...priceData, negotiable: e.target.checked })
                  }
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <label
                  htmlFor="negotiable"
                  className="ml-3 text-sm sm:text-base font-medium text-gray-700"
                >
                  Price is negotiable
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceModal(false);
                    setSelectedRequest(null);
                    setPriceData({ price: '', negotiable: false });
                  }}
                  className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all text-base shadow-lg"
                >
                  Accept Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;

