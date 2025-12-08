import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MessageNotification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const checkForNewMessages = async () => {
      try {
        // Get unread count
        const { data } = await axios.get(`${API_URL}/chat/unread-count`);
        
        if (data.unreadCount > 0) {
          // Get the latest unread message
          const bookingsRes = await axios.get(
            user.role === 'customer'
              ? `${API_URL}/bookings/user/${user._id}`
              : `${API_URL}/bookings/merchant/${user._id}`
          );

          // Find booking with unread messages
          for (const booking of bookingsRes.data) {
            try {
              const messagesRes = await axios.get(
                `${API_URL}/chat/booking/${booking._id}`
              );
              const unreadMessages = messagesRes.data.filter(
                (msg) => msg.receiverId._id === user._id && !msg.read
              );

              if (unreadMessages.length > 0) {
                const latestMessage = unreadMessages[unreadMessages.length - 1];
                
                // Only show notification if it's a new message
                if (latestMessage._id !== lastMessageId) {
                  setLastMessageId(latestMessage._id);
                  setNotification({
                    bookingId: booking._id,
                    message: latestMessage.message,
                    senderName: latestMessage.senderId.name,
                    booking: booking,
                  });
                  
                  // Show toast notification
                  toast(
                    `💬 New message from ${latestMessage.senderId.name}`,
                    {
                      duration: 5000,
                      icon: '💬',
                      style: {
                        background: '#3B82F6',
                        color: '#fff',
                      },
                    }
                  );
                }
                break;
              }
            } catch (err) {
              // Continue to next booking
            }
          }
        }
      } catch (error) {
        // Silently fail - don't spam errors
      }
    };

    // Check immediately
    checkForNewMessages();

    // Check every 3 seconds for new messages
    const interval = setInterval(checkForNewMessages, 3000);

    return () => clearInterval(interval);
  }, [user, lastMessageId]);

  const handleViewMessage = () => {
    if (notification) {
      navigate(`/booking/${notification.bookingId}`);
      setNotification(null);
    }
  };

  const handleDismiss = () => {
    setNotification(null);
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                💬
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                  New Message from {notification.senderName}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Booking: {notification.booking.serviceType}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleViewMessage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all"
                  >
                    View Chat
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-300 active:scale-95 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageNotification;

