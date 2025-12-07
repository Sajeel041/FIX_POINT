import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [roles, setRoles] = useState(['customer']); // Allow multiple roles
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Merchant specific
    cnic: '',
    skillCategory: '',
    yearsExperience: '',
    about: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleRole = (roleToToggle) => {
    setRoles((prev) => {
      if (prev.includes(roleToToggle)) {
        // If removing the last role, keep at least one
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== roleToToggle);
      } else {
        return [...prev, roleToToggle];
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      roles: roles, // Send roles array
      phone: formData.phone,
    };

    if (roles.includes('merchant')) {
      userData.merchantData = {
        cnic: formData.cnic,
        skillCategory: formData.skillCategory,
        yearsExperience: parseInt(formData.yearsExperience),
        about: formData.about,
      };
    }

    const result = await register(userData);

    if (result.success) {
      toast.success('Registration successful!');
      // Navigate based on primary role (first in array)
      if (roles.includes('customer')) {
        navigate('/customer/dashboard');
      } else if (roles.includes('merchant')) {
        navigate('/merchant/dashboard');
      }
    } else {
      toast.error(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FixPoint</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Role Selection - Allow Multiple */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role(s) - You can be both!
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={roles.includes('customer')}
                  onChange={() => toggleRole('customer')}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <div className="ml-3 flex-1">
                  <span className="text-base font-semibold text-gray-900">Customer</span>
                  <p className="text-sm text-gray-600">Book services from technicians</p>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={roles.includes('merchant')}
                  onChange={() => toggleRole('merchant')}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <div className="ml-3 flex-1">
                  <span className="text-base font-semibold text-gray-900">Merchant</span>
                  <p className="text-sm text-gray-600">Offer services as a technician</p>
                </div>
              </label>
            </div>
            {roles.length === 0 && (
              <p className="text-sm text-red-600 mt-2">Please select at least one role</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
            </div>

            {roles.includes('merchant') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNIC
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Category
                  </label>
                  <select
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About (Optional)
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || roles.length === 0}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

