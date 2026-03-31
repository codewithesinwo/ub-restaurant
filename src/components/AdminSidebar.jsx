import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-lg h-screen sticky top-0 z-40"
    >
      <div className="p-6 border-b border-gray-100">
        {!isCollapsed ? (
          <>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
              UB Admin
            </h1>
            <p className="text-sm text-gray-500">Restaurant Dashboard</p>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-4 rounded-2xl transition-all group ${
                active
                  ? 'bg-amber-50 border-2 border-amber-200 text-amber-800 shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
              } ${isCollapsed ? 'justify-center space-x-0' : ''}`}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 ${active ? 'text-amber-600' : 'group-hover:text-amber-600'}`} />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all group"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
