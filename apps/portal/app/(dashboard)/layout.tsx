import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get actual user data from auth context
  const userRole = 'admin' as const;
  const userName = 'Admin User';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} userName={userName} />

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6">
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              {/* Page title will be set by individual pages */}
            </h1>
            <div className="flex items-center space-x-4">
              {/* Notifications, etc. */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
