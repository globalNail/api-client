import { useNavigate } from 'react-router';
import { Button } from '@heroui/button';
import { authService } from '../services/auth.service';
import routePath from '../constants/route.constants';
import role from '../constants/role.constants';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isAdmin = user?.accountRole === role.ADMIN;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Welcome, {user?.accountname || 'User'}
                </h1>
                <Button color="danger" variant="flat" onPress={handleLogout}>
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isAdmin ? (
                    <>
                        {/* Admin Menu */}
                        <div 
                            className="p-6 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition"
                            onClick={() => navigate(routePath.ADMIN_ACCOUNTS)}
                        >
                            <h2 className="text-xl font-semibold mb-2">Account Management</h2>
                            <p className="text-gray-600">Manage user accounts (CRUD operations)</p>
                        </div>
                        <div 
                            className="p-6 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition"
                            onClick={() => navigate(routePath.ADMIN_REPORTS)}
                        >
                            <h2 className="text-xl font-semibold mb-2">Reports & Statistics</h2>
                            <p className="text-gray-600">View news article statistics by period</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Staff Menu */}
                        <div 
                            className="p-6 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition"
                            onClick={() => navigate(routePath.STAFF_CATEGORIES)}
                        >
                            <h2 className="text-xl font-semibold mb-2">Category Management</h2>
                            <p className="text-gray-600">Manage news categories</p>
                        </div>
                        <div 
                            className="p-6 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200 transition"
                            onClick={() => navigate(routePath.STAFF_NEWS)}
                        >
                            <h2 className="text-xl font-semibold mb-2">News Management</h2>
                            <p className="text-gray-600">Create and manage news articles</p>
                        </div>
                        <div 
                            className="p-6 bg-pink-100 rounded-lg cursor-pointer hover:bg-pink-200 transition"
                            onClick={() => navigate(routePath.STAFF_NEWS_HISTORY)}
                        >
                            <h2 className="text-xl font-semibold mb-2">My News History</h2>
                            <p className="text-gray-600">View articles you've created</p>
                        </div>
                        <div 
                            className="p-6 bg-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-200 transition"
                            onClick={() => navigate(routePath.STAFF_PROFILE)}
                        >
                            <h2 className="text-xl font-semibold mb-2">My Profile</h2>
                            <p className="text-gray-600">Manage your profile information</p>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">System Information</h3>
                <p className="text-sm text-gray-600">
                    Role: {isAdmin ? 'Administrator' : 'Staff Member'}
                </p>
                <p className="text-sm text-gray-600">
                    Email: {user?.accountEmail}
                </p>
            </div>
        </div>
    );
};
