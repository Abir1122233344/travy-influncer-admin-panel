import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";
import { storeUserData } from "../../lib/withAuth";
import { Building2, Mail, Lock, Shield, AlertTriangle, Copy } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", { email, password, role });
      
      if (response && response.token) {
        storeUserData(response.token, role);
        
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/influencer/dashboard");
        }
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (error) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 ease-out">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center transition-all duration-300 ease-out hover:scale-105">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl group">
              <Building2 className="h-8 w-8 text-white transition-transform duration-300 ease-out group-hover:rotate-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Welcome back</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Sign in to your Travy account</p>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 transition-all duration-300 ease-out animate-shake">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 transition-all duration-200 ease-out" />
                    <p className="text-sm text-red-700 dark:text-red-300 transition-colors duration-200">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="transition-all duration-200 ease-out">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Email address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ease-out group-focus-within:text-blue-500 group-focus-within:scale-110" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 focus:scale-[1.02]"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="transition-all duration-200 ease-out">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ease-out group-focus-within:text-blue-500 group-focus-within:scale-110" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 focus:scale-[1.02]"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="transition-all duration-200 ease-out">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Role
                </label>
                <div className="relative group">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ease-out group-focus-within:text-blue-500 group-focus-within:scale-110" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 focus:scale-[1.02]"
                  >
                    <option value="admin">Admin</option>
                    <option value="influencer">Influencer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between transition-all duration-200 ease-out">
                <label className="flex items-center gap-2 group cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 transition-all duration-200 ease-out hover:scale-110" 
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300">Remember me</span>
                </label>
                <a 
                  href="#" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 ease-out hover:scale-105"
                >
                  Forgot password?
                </a>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-[1.02] active:scale-98"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner h-5 w-5"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in to Travy"
                )}
              </button>
            </form>
            
            {/* Footer */}
            <div className="mt-6 text-center transition-all duration-200 ease-out">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Don't have an account?{" "}
                <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 ease-out hover:scale-105">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
