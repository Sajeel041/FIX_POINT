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

      toast.success('Service request created successfully!');
      // Redirect to customer dashboard after successful submission
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Progress Steps - Only 2 Steps */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
          {[1, 2].map((s) => (
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
              {s < 2 && (
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
      </div>
    </div>
  );
};

export default BookingFlow;
