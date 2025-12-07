import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceType: '',
    issue: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [acceptedMerchants, setAcceptedMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/services`);
        setServices(data);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Poll for accepted merchants if request is created
  useEffect(() => {
    if (requestId && step === 3) {
      const interval = setInterval(async () => {
        try {
          const { data } = await axios.get(
            `${API_URL}/service-requests/${requestId}`
          );
          setAcceptedMerchants(data.acceptedMerchants || []);
        } catch (error) {
          console.error('Error fetching merchants:', error);
        }
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [requestId, step]);

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, serviceType: service.name });
    setStep(2);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(`${API_URL}/service-requests/create`, {
        serviceType: formData.serviceType,
        issue: formData.issue,
        location: formData.location,
      });

      setRequestId(data._id);
      toast.success('Service request created! Waiting for merchants...');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectMerchant = async (merchant) => {
    setSelectedMerchant(merchant);
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/service-requests/select-merchant`,
        {
          requestId: requestId,
          merchantId: merchant.merchantId._id,
        }
      );

      toast.success('Merchant selected! Booking confirmed.');
      navigate(`/booking/${data.booking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to select merchant');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Progress Steps - Mobile Optimized */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                  step >= s
                    ? 'bg-black text-white shadow-lg scale-110'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 sm:w-20 h-1.5 mx-1 sm:mx-2 rounded-full transition-all ${
                    step > s ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Select a Service Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleServiceSelect(service)}
                  className="p-5 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 active:scale-95 transition-all text-left border-2 border-transparent hover:border-gray-200 shadow-sm"
                >
                  <div className="text-4xl sm:text-5xl mb-3">{service.icon}</div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{service.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Enter Issue and Location */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Describe Your Issue
              </h2>
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-black active:scale-95 transition-transform px-2 py-1 text-base sm:text-lg font-semibold"
              >
                ← Back
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type
                </label>
                <input
                  type="text"
                  value={formData.serviceType}
                  disabled
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Describe the Issue *
                </label>
                <textarea
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                  required
                  rows="5"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base resize-none"
                  placeholder="e.g., My heater is not working, water is leaking from the pipe, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none text-base"
                  placeholder="Enter your address or location"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-4 sm:py-5 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {submitting ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Wait for Merchants / Show Accepted Merchants */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Available Technicians
            </h2>

            {acceptedMerchants.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-t-3 border-b-3 border-black mx-auto mb-4"></div>
                <p className="text-gray-700 mb-2 font-medium text-base sm:text-lg">
                  Waiting for technicians to accept your request...
                </p>
                <p className="text-sm sm:text-base text-gray-500 px-4">
                  Your request has been sent. Technicians will see it and can accept.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 mb-4 font-semibold text-sm sm:text-base">
                  {acceptedMerchants.length} technician{acceptedMerchants.length > 1 ? 's' : ''} have accepted your request. Select one:
                </p>
                {acceptedMerchants.map((item, index) => {
                  const merchant = item.merchantId || item;
                  const price = item.price;
                  const negotiable = item.negotiable;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                        selectedMerchant?.merchantId?._id === merchant._id ||
                        selectedMerchant?._id === merchant._id
                          ? 'border-black bg-gray-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                      onClick={() => !submitting && handleSelectMerchant(item)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">
                            👤
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                              {merchant.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {merchant.email}
                            </p>
                            {merchant.phone && (
                              <p className="text-xs text-gray-500 mt-1">
                                📞 {merchant.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          {price && (
                            <div className="text-left sm:text-right">
                              <p className="font-bold text-lg sm:text-xl text-gray-900">
                                PKR {price}
                              </p>
                              {negotiable && (
                                <p className="text-xs text-green-600 font-semibold">
                                  Negotiable
                                </p>
                              )}
                            </div>
                          )}
                          <div>
                            {submitting &&
                            (selectedMerchant?.merchantId?._id === merchant._id ||
                              selectedMerchant?._id === merchant._id) ? (
                              <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-black"></div>
                            ) : (
                              <button className="px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-semibold text-sm sm:text-base shadow-md whitespace-nowrap">
                                Select
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
