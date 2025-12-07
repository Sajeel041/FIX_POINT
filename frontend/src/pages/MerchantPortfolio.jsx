import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MerchantPortfolio = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/merchants/${id}`);
        setMerchant(data);
      } catch (error) {
        toast.error('Merchant not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [id, navigate]);

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only customers can book services');
      return;
    }
    navigate(`/booking/flow?merchantId=${id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!merchant) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8">
            <div className="flex items-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl mr-6">
                {merchant.profilePicture ? (
                  <img
                    src={merchant.profilePicture}
                    alt={merchant.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {merchant.userId.name}
                </h1>
                <p className="text-xl text-gray-300 mb-2">
                  {merchant.skillCategory}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-lg">⭐ {merchant.rating.toFixed(1)}</span>
                  <span className="text-lg">
                    {merchant.yearsExperience} years experience
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      merchant.availability === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {merchant.availability === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pricing
              </h2>
              <p className="text-3xl font-bold text-black">
                PKR {merchant.price}
              </p>
              <p className="text-gray-600 mt-1">per service</p>
            </div>

            {/* About */}
            {merchant.about && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{merchant.about}</p>
              </div>
            )}

            {/* Certifications */}
            {merchant.certifications?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-3">
                  {merchant.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Work Gallery */}
            {merchant.previousWorkImages?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Previous Work
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {merchant.previousWorkImages.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Previous work ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            {user?.role === 'customer' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBook}
                disabled={merchant.availability === 'offline'}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {merchant.availability === 'online'
                  ? 'Book This Technician'
                  : 'Currently Offline'}
              </motion.button>
            )}

            {!user && (
              <Link
                to="/login"
                className="block w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition text-center"
              >
                Login to Book
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MerchantPortfolio;

