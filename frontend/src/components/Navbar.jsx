import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-black">FixPoint</span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Dashboard Links for Multiple Roles */}
            {(user?.roles || [user?.role]).includes('customer') && (
              <Link
                to="/customer/dashboard"
                className="hidden sm:block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Customer
              </Link>
            )}
            {(user?.roles || [user?.role]).includes('merchant') && (
              <Link
                to="/merchant/dashboard"
                className="hidden sm:block px-3 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Merchant
              </Link>
            )}
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
