// src/components/SideNav.jsx
import { FaClipboardList, FaChartLine, FaCog, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // ← Add this

const SideNav = () => {
  const navigate = useNavigate(); // ← Initialize the navigate function

  return (
    <div className="w-64 min-h-screen bg-[#f9f9f9] rounded-xl p-6 shadow-sm">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <FaUserCircle className="text-indigo-700 text-5xl mb-2" />
        <h2 className="text-lg font-bold text-indigo-700">Lithara Bambarendage</h2>
        <p className="text-sm text-gray-500">litharabambarendage@gmail.com</p>
        <hr className="w-full mt-4 border-gray-300" />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-2">
        <NavItem icon={<FaClipboardList />} label="My Learning Plans" path="/" navigate={navigate} />
        <NavItem icon={<FaChartLine />} label="My Learning Progress" path="/progress" navigate={navigate} />
        <NavItem icon={<FaCog />} label="My Badges" path="/skillbadges" navigate={navigate} />
      </nav>
    </div>
  );
};

// Updated NavItem to use path and navigate
const NavItem = ({ icon, label, active, path, navigate }) => (
  <div
    onClick={() => navigate(path)}
    className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer ${
      active
        ? 'bg-indigo-100 text-indigo-800 font-medium'
        : 'text-indigo-700 hover:bg-indigo-50'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </div>
);

export default SideNav;
