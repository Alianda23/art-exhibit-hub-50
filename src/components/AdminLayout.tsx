
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAdmin, logout } from '@/services/api';
import { Calendar, MessageSquare, Image, Ticket, ShoppingBag, LogOut, Users } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Check if user is an admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const isActive = (path: string) => {
    return currentPath === path ? 'bg-gray-800' : '';
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Single Sidebar */}
      <div className="bg-gray-900 text-white w-64 flex-shrink-0 fixed h-full z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="mt-8">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin')}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/artworks" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/artworks')} flex items-center`}
              >
                <Image className="mr-2 h-4 w-4" /> Artworks
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/exhibitions" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/exhibitions')} flex items-center`}
              >
                <Calendar className="mr-2 h-4 w-4" /> Exhibitions
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/messages" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/messages')} flex items-center`}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Messages
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/tickets" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/tickets')} flex items-center`}
              >
                <Ticket className="mr-2 h-4 w-4" /> Tickets
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/orders')} flex items-center`}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/artists" 
                className={`block px-4 py-2 hover:bg-gray-800 ${isActive('/admin/artists')} flex items-center`}
              >
                <Users className="mr-2 h-4 w-4" /> Artists
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      </div>
      
      {/* Main content with proper left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
