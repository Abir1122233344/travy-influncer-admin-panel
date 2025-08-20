import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import { withAuth } from "../../lib/withAuth";
import { 
  Users, 
  Star, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Trophy
} from "lucide-react";

function AdminDashboardPage() {
  const [usersCount, setUsersCount] = useState(0);
  const [influencersCount, setInfluencersCount] = useState(0);
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [usersResponse, influencersResponse, topResponse] = await Promise.all([
          api.get("/users"),
          api.get("/influencers"),
          api.get("/influencers/top")
        ]);

        setUsersCount(usersResponse?.length || 0);
        setInfluencersCount(influencersResponse?.length || 0);
        setTopInfluencers(topResponse || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setErrorMessage(error.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8 transition-all duration-300 ease-out hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-2 group">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Dashboard</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Welcome back! Here's what's happening with your system.</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 transition-all duration-300 ease-out animate-shake">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 transition-all duration-200 ease-out" />
              <p className="text-sm text-red-700 dark:text-red-300 transition-colors duration-200">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="card-hover group">
            <div className="flex items-center justify-between transition-all duration-200 ease-out">
              <div className="transition-all duration-200 ease-out">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Users</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">{usersCount.toLocaleString()}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <Users className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 transition-all duration-200 ease-out group-hover:scale-110" />
              <span>+12% from last month</span>
            </div>
          </Card>
          
          <Card className="card-hover group">
            <div className="flex items-center justify-between transition-all duration-200 ease-out">
              <div className="transition-all duration-200 ease-out">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Influencers</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">{influencersCount.toLocaleString()}</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <Star className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 transition-all duration-200 ease-out group-hover:scale-110" />
              <span>+8% from last month</span>
            </div>
          </Card>
          
          <Card className="card-hover group">
            <div className="flex items-center justify-between transition-all duration-200 ease-out">
              <div className="transition-all duration-200 ease-out">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Active Sessions</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">24</p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <Activity className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 transition-all duration-200 ease-out group-hover:scale-110" />
              <span>+5% from last hour</span>
            </div>
          </Card>
        </div>

        {/* Top Influencers */}
        <Card title="Top Influencers" subtitle="By referral count" className="card-hover">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-20 w-full skeleton rounded-xl"></div>
              <div className="h-20 w-full skeleton rounded-xl"></div>
              <div className="h-20 w-full skeleton rounded-xl"></div>
            </div>
          ) : topInfluencers.length > 0 ? (
            <div className="space-y-4">
              {topInfluencers.map((inf, i) => (
                <div key={inf.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                    {i === 0 ? (
                      <Trophy className="h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />
                    ) : (
                      <span className="font-bold text-sm transition-all duration-200 ease-out">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 transition-all duration-200 ease-out">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{inf.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{inf.email}</p>
                  </div>
                  <div className="text-right transition-all duration-200 ease-out">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">{inf.referralCount || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">referrals</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 transition-all duration-200 ease-out">
              <Star className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-all duration-200 ease-out" />
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No influencers found</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default withAuth(AdminDashboardPage, "admin");
