import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, requestsRes] = await Promise.all([
          axios.get(`${API_URL}/bookings/user/${user._id}`),
          axios.get(`${API_URL}/service-requests/customer/${user._id}`),
        ]);
        setBookings(bookingsRes.data);
        // Only show pending service requests (not accepted ones)
        const pendingRequests = requestsRes.data.filter(
          (req) => req.status === 'pending' || req.status === 'offerSubmitted'
        );
        setServiceRequests(pendingRequests);
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

  const handleSelectMerchant = async (requestId, merchantId) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/service-requests/select-merchant`,
        {
          requestId,
          merchantId,
        }
      );
      toast.success('Merchant selected! Booking confirmed.');
      // Remove the accepted request from the list and refresh
      setServiceRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
      // Refresh bookings to show the new booking
      const bookingsRes = await axios.get(`${API_URL}/bookings/user/${user._id}`);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to select merchant');
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
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Welcome, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Book a service or view your bookings</p>
          </div>

          {/* Quick Booking CTA - Mobile Optimized */}
          <Link
            to="/booking/flow"
            className="block w-full bg-gradient-to-r from-black to-gray-800 text-white text-center py-4 sm:py-5 rounded-2xl font-semibold mb-6 shadow-lg active:scale-95 transition-transform duration-150 text-base sm:text-lg"
          >
            <span className="text-2xl mr-2">🔧</span>
            Book a Service
          </Link>

          {/* Service Requests */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Your Service Requests
            </h2>
            {serviceRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-gray-600 text-sm sm:text-base">No service requests yet</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {serviceRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-6 active:scale-[0.98] transition-transform"
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                          {request.serviceType}
                        </h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ml-2 ${request.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {request.status === 'offerSubmitted' ? 'Offers Received' : request.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-900">Issue:</span> {request.issue}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-900">📍 Location:</span> {request.location}
                        </p>
                      </div>
                    </div>

                    {(request.status === 'pending' || request.status === 'offerSubmitted') &&
                      request.acceptedMerchants?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 mb-3">
                            {request.acceptedMerchants.length} technician{request.acceptedMerchants.length > 1 ? 's' : ''} accepted:
                          </p>
                          <div className="space-y-3">
                            {request.acceptedMerchants.map((item, index) => {
                              const merchant = item.merchantId;
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-gray-900 text-base truncate">
                                        {merchant.name}
                                      </p>
                                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                                        {merchant.email}
                                      </p>
                                      {merchant.phone && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          📞 {merchant.phone}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-3">
                                      <div className="text-right">
                                        <p className="font-bold text-lg sm:text-xl text-gray-900">
                                          PKR {item.price}
                                        </p>
                                        {item.negotiable && (
                                          <p className="text-xs text-green-600 font-semibold">
                                            Negotiable
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleSelectMerchant(
                                            request._id,
                                            merchant._id
                                          )
                                        }
                                        className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-semibold text-sm sm:text-base whitespace-nowrap shadow-md"
                                      >
                                        Select
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {(request.status === 'pending' || request.status === 'offerSubmitted') &&
                      (!request.acceptedMerchants ||
                        request.acceptedMerchants.length === 0) && (
                        <p className="text-sm text-gray-500 mt-2">
                          Waiting for technicians to accept...
                        </p>
                      )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Active Bookings */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Your Active Bookings
            </h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-gray-600 text-sm sm:text-base mb-3">No active bookings</p>
                <Link
                  to="/booking/flow"
                  className="text-black font-semibold hover:underline text-sm sm:text-base inline-block"
                >
                  Book your first service →
                </Link>
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <Link to={`/booking/${booking._id}`} className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {booking.serviceType}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ml-2 ${booking.status === 'completed'
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
                          👤 {booking.merchantId?.name}
                        </p>
                        {booking.merchantId?.phone && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            📞 {booking.merchantId.phone}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          📅 {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-bold text-xl sm:text-2xl text-gray-900">
                          PKR {booking.price}
                        </p>
                        {(booking.status === 'active' || booking.status === 'accepted') && (
                          <Link
                            to={`/booking/${booking._id}`}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all font-semibold shadow-md whitespace-nowrap"
                          >
                            💬 Chat
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

