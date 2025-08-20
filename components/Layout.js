import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-out">
      <Navbar />
      <div className="flex flex-1 transition-all duration-300 ease-out">
        <Sidebar />
        <main className="flex-1 overflow-auto transition-all duration-300 ease-out">
          <div className="mx-auto max-w-7xl p-6 lg:p-8 transition-all duration-300 ease-out">
            <div className="page-enter page-enter-active">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
