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
  const [seenMessageIds, setSeenMessageIds] = useState(new Set());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkForNewMessages = async () => {
      try {
        // Try to get latest unread message directly (more efficient)
        try {
          const { data: latestData } = await axios.get(`${API_URL}/chat/latest-unread`);
          
          if (latestData.message) {
            const message = latestData.message;
            const messageId = message._id;
            
            // Only show notification if it's a truly new message we haven't seen
            if (!seenMessageIds.has(messageId)) {
              setSeenMessageIds(prev => new Set([...prev, messageId]));
              
              setNotification({
                bookingId: message.bookingId._id || message.bookingId,
                message: message.message,
                senderName: message.senderId?.name || 'Someone',
                booking: latestData.booking || message.bookingId,
                timestamp: message.createdAt,
              });
              
              setIsVisible(true);
              
              // Auto-dismiss after 8 seconds
              setTimeout(() => {
                setIsVisible(false);
              }, 8000);
              
              // Show toast notification
              toast(
                `💬 New message from ${message.senderId?.name || 'Someone'}`,
                {
                  duration: 4000,
                  icon: '💬',
                  style: {
                    background: '#3B82F6',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                }
              );
              
              // Play notification sound if browser supports it
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi7792PPw==');
                audio.volume = 0.3;
                audio.play().catch(() => {});
              } catch (e) {
                // Ignore audio errors
              }
            }
            return;
          }
        } catch (latestError) {
          // Fallback to old method if new endpoint fails
          if (latestError.response?.status === 404 || latestError.response?.status >= 500) {
            console.warn('Latest unread endpoint not available, using fallback');
          } else {
            throw latestError;
          }
        }
        
        // Fallback: Get unread count and check bookings
        const { data: unreadData } = await axios.get(`${API_URL}/chat/unread-count`);
        
        if (unreadData.unreadCount > 0) {
          // Get bookings for this user
          const bookingsRes = await axios.get(
            user.role === 'customer' || user.roles?.includes('customer')
              ? `${API_URL}/bookings/user/${user._id}`
              : `${API_URL}/bookings/merchant/${user._id}`
          );

          // Find booking with unread messages
          for (const booking of bookingsRes.data || []) {
            try {
              const messagesRes = await axios.get(
                `${API_URL}/chat/booking/${booking._id}`
              );
              
              // Get unread messages for this user
              const unreadMessages = (messagesRes.data || []).filter(
                (msg) => {
                  const receiverId = msg.receiverId?._id || msg.receiverId;
                  const userId = user._id;
                  return receiverId.toString() === userId.toString() && !msg.read;
                }
              );

              if (unreadMessages.length > 0) {
                // Get the latest unread message
                const latestMessage = unreadMessages[unreadMessages.length - 1];
                const messageId = latestMessage._id;
                
                // Only show notification if it's a truly new message we haven't seen
                if (!seenMessageIds.has(messageId)) {
                  setSeenMessageIds(prev => new Set([...prev, messageId]));
                  
                  setNotification({
                    bookingId: booking._id,
                    message: latestMessage.message,
                    senderName: latestMessage.senderId?.name || 'Someone',
                    booking: booking,
                    timestamp: latestMessage.createdAt,
                  });
                  
                  setIsVisible(true);
                  
                  // Auto-dismiss after 8 seconds
                  setTimeout(() => {
                    setIsVisible(false);
                  }, 8000);
                  
                  // Show toast notification
                  toast(
                    `💬 New message from ${latestMessage.senderId?.name || 'Someone'}`,
                    {
                      duration: 4000,
                      icon: '💬',
                      style: {
                        background: '#3B82F6',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                    }
                  );
                  
                  // Play notification sound if browser supports it
                  try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi7792PPw==');
                    audio.volume = 0.3;
                    audio.play().catch(() => {});
                  } catch (e) {
                    // Ignore audio errors
                  }
                }
                break;
              }
            } catch (err) {
              // Continue to next booking
              if (err.response?.status !== 401 && err.response?.status !== 403) {
                console.error('Error checking messages for booking:', err);
              }
            }
          }
        }
      } catch (error) {
        // Only log non-401 errors
        if (error.response?.status !== 401) {
          console.error('Error checking for new messages:', error);
        }
      }
    };

    // Check immediately
    checkForNewMessages();

    // Check every 2 seconds for new messages (more responsive)
    const interval = setInterval(checkForNewMessages, 2000);

    return () => clearInterval(interval);
  }, [user, seenMessageIds]);

  const handleViewMessage = () => {
    if (notification) {
      navigate(`/booking/${notification.bookingId}`);
      setNotification(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setNotification(null);
    setIsVisible(false);
  };

  // Clear notification when visibility changes
  useEffect(() => {
    if (!isVisible && notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, notification]);

  return (
    <AnimatePresence>
      {notification && isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[9999]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-4 relative overflow-hidden">
            {/* Animated background pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-50"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg">
                💬
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                    New Message from {notification.senderName}
                  </h4>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2 font-medium">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  📋 {notification.booking?.serviceType || 'Service'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleViewMessage}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-md"
                  >
                    View Chat
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    Later
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

