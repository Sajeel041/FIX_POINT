import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Chat = ({ bookingId, onClose, otherUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/chat/booking/${bookingId}`);
        setMessages(data);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    if (!bookingId) {
      toast.error('Booking ID is missing');
      return;
    }

    setSending(true);
    try {
      const { data } = await axios.post(`${API_URL}/chat/send`, {
        bookingId,
        message: newMessage,
      });
      setMessages([...messages, data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      
      if (error.response?.status === 403) {
        toast.error('You are not authorized to send messages for this booking');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl mr-3">
            {otherUser?.name?.charAt(0) || '👤'}
          </div>
          <div>
            <h3 className="font-bold text-base">{otherUser?.name || 'User'}</h3>
            <p className="text-xs text-gray-300">{otherUser?.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 active:scale-95 transition-transform p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId._id === user._id;
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 ${
                    isOwn
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed break-words">
                    {message.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;


