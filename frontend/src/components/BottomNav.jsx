import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const userRoles = user?.roles || (user?.role ? [user.role] : []);
  const isCustomer = userRoles.includes('customer');
  const isMerchant = userRoles.includes('merchant');

  if (!isCustomer && !isMerchant) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden"
    >
      <div className="flex justify-around items-center h-16">
        {isCustomer && (
          <Link
            to="/customer/dashboard"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/customer/dashboard') ? 'text-black' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </Link>
        )}
        {isCustomer && (
          <Link
            to="/booking/flow"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/booking/flow') ? 'text-black' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🔧</span>
            <span className="text-xs mt-1">Book</span>
          </Link>
        )}
        {isMerchant && (
          <Link
            to="/merchant/dashboard"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/merchant/dashboard') ? 'text-black' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs mt-1">Merchant</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
