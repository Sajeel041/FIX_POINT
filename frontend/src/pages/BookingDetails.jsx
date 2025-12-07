import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Chat from '../components/Chat';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const endpoint =
          user?.role === 'customer'
            ? `${API_URL}/bookings/user/${user._id}`
            : `${API_URL}/bookings/merchant/${user._id}`;
        const { data } = await axios.get(endpoint);
        const foundBooking = data.find((b) => b._id === id);
        if (!foundBooking) {
          toast.error('Booking not found');
          navigate('/');
          return;
        }
        setBooking(foundBooking);
      } catch (error) {
        toast.error('Failed to load booking');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooking();
    }
  }, [id, user, navigate]);

  const updateStatus = async (status) => {
    try {
      await axios.patch(`${API_URL}/bookings/status`, {
        bookingId: booking._id,
        status,
      });
      toast.success('Status updated');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!booking) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    active: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Details</h1>
            <span
              className={`px-4 py-2 rounded-full font-semibold text-sm sm:text-base ${statusColors[booking.status] || statusColors.pending
                }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Service Information
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 space-y-3 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Service Type:</span>
                  <span className="font-bold text-sm sm:text-base text-gray-900">{booking.serviceType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Price:</span>
                  <span className="font-bold text-lg sm:text-xl text-gray-900">
                    PKR {booking.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 font-medium">Booked on:</span>
                  <span className="font-semibold text-xs sm:text-sm text-gray-700">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {user?.role === 'customer' && booking.merchantId && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Technician
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200">
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                    {booking.merchantId.name}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">{booking.merchantId.email}</p>
                  {booking.merchantId.phone && (
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      📞 {booking.merchantId.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {user?.role === 'merchant' && booking.customerId && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Customer
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200">
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                    {booking.customerId.name}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">{booking.customerId.email}</p>
                  {booking.customerId.phone && (
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      📞 {booking.customerId.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {booking.address && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Address
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">📍 {booking.address}</p>
                </div>
              </div>
            )}

            {booking.notes && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Notes
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            )}

            {/* Chat Button - Always visible for active bookings */}
            {(booking.status === 'active' || booking.status === 'accepted') && (
              <div>
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all text-base sm:text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💬</span>
                  Chat with {user?.role === 'customer' ? booking.merchantId?.name : booking.customerId?.name}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {user?.role === 'merchant' && booking.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => updateStatus('accepted')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-md"
                >
                  Accept Booking
                </button>
                <button
                  onClick={() => updateStatus('cancelled')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 active:scale-95 transition-all shadow-md"
                >
                  Cancel
                </button>
              </div>
            )}

            {user?.role === 'merchant' &&
              booking.status === 'active' && (
                <button
                  onClick={() => updateStatus('completed')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-95 transition-all shadow-lg"
                >
                  Mark for Completion
                </button>
              )}

            {user?.role === 'customer' && booking.status === 'pending' && (
              <button
                onClick={() => updateStatus('cancelled')}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 active:scale-95 transition-all shadow-lg"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Chat Modal - Mobile Optimized */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:w-full sm:max-w-2xl h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Chat
                bookingId={booking._id}
                onClose={() => setShowChat(false)}
                otherUser={
                  user?.role === 'customer'
                    ? booking.merchantId
                    : booking.customerId
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingDetails;

