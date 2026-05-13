import AdminSidebar from '../../components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
    </ProtectedRoute>
  );
}
