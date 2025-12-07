import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Uber-inspired */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920)',
            opacity: 0.3,
          }}
        ></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            FixPoint
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Book trusted technicians for your home services
          </p>

          {!user ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
              >
                Sign In
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to={user.role === 'customer' ? '/customer/dashboard' : '/merchant/dashboard'}
                className="inline-block px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Service Categories - Uber-style cards */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Electrician', icon: '⚡', color: 'bg-yellow-100' },
              { name: 'Plumber', icon: '🔧', color: 'bg-blue-100' },
              { name: 'AC Technician', icon: '❄️', color: 'bg-cyan-100' },
              { name: 'Carpenter', icon: '🪚', color: 'bg-amber-100' },
              { name: 'Painter', icon: '🎨', color: 'bg-pink-100' },
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition"
              >
                <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto`}>
                  {service.icon}
                </div>
                <h3 className="text-center font-semibold text-gray-900">
                  {service.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose FixPoint?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Technicians',
                description: 'All our technicians are verified and background checked',
                icon: '✅',
              },
              {
                title: 'Quick Booking',
                description: 'Book a service in minutes with our easy-to-use platform',
                icon: '⚡',
              },
              {
                title: 'Fair Pricing',
                description: 'Transparent pricing with no hidden charges',
                icon: '💰',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
