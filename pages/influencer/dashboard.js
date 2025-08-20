import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import { withAuth } from "../../lib/withAuth";
import { 
  Target, 
  Users, 
  DollarSign, 
  Link, 
  Copy, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Check,
  X
} from "lucide-react";

function InfluencerDashboardPage() {
  const [influencerData, setInfluencerData] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [copyStatus, setCopyStatus] = useState({ show: false, success: false, message: "" });

  useEffect(() => {
    fetchInfluencerData();
  }, []);

  const fetchInfluencerData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const [profileResponse, usersResponse] = await Promise.all([
        api.get("/influencer/me"),
        api.get("/influencer/referred-users")
      ]);
      
      setInfluencerData(profileResponse || {});
      setReferredUsers(usersResponse || []);
    } catch (error) {
      console.error("Error fetching influencer data:", error);
      setErrorMessage(error.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({
        show: true,
        success: true,
        message: "Referral link copied to clipboard!"
      });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopyStatus({
        show: true,
        success: false,
        message: "Failed to copy link. Please try again."
      });
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const closeCopyNotification = () => {
    setCopyStatus(prev => ({ ...prev, show: false }));
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = referredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(referredUsers.length / usersPerPage);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-8 transition-all duration-300 ease-out hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-2 group">
            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Influencer Dashboard</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Track your performance and manage your referrals.</p>
        </div>

        {/* Copy Notification */}
        {copyStatus.show && (
          <div className={`rounded-xl border px-4 py-3 transition-all duration-300 ease-out animate-fade-in ${
            copyStatus.success 
              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30' 
              : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {copyStatus.success ? (
                  <Check className="h-5 w-5 text-green-500 dark:text-green-400 transition-all duration-200 ease-out" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 transition-all duration-200 ease-out" />
                )}
                <p className={`text-sm font-medium transition-colors duration-200 ${
                  copyStatus.success 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {copyStatus.message}
                </p>
              </div>
              <button
                onClick={closeCopyNotification}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-out hover:scale-110"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}

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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Referrals</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {influencerData?.referralCount || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <Users className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 transition-all duration-200 ease-out group-hover:scale-110" />
              <span>+15% from last month</span>
            </div>
          </Card>
          
          <Card className="card-hover group">
            <div className="flex items-center justify-between transition-all duration-200 ease-out">
              <div className="transition-all duration-200 ease-out">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Earnings</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    ${influencerData?.totalEarnings || 0}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <DollarSign className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Conversion Rate</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 skeleton rounded"></div>
                ) : (
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {influencerData?.conversionRate || 0}%
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg">
                <Star className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-3" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 transition-all duration-200 ease-out group-hover:scale-110" />
              <span>+3% from last month</span>
            </div>
          </Card>
        </div>

        {/* Referral Link */}
        <Card title="Your Referral Link" subtitle="Share this link to earn rewards" className="card-hover">
          {isLoading ? (
            <div className="h-16 w-full skeleton rounded-xl"></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700 transition-all duration-200 ease-out hover:scale-[1.02] group">
                <Link className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-all duration-200 ease-out group-hover:scale-110" />
                <span className="flex-1 text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200 break-all font-mono">
                  {influencerData?.referralLink || "https://travy.com/ref/your-unique-code"}
                </span>
                <button
                  onClick={() => copyToClipboard(influencerData?.referralLink || "https://travy.com/ref/your-unique-code")}
                  className="btn-primary text-xs py-2 px-3 transition-all duration-200 ease-out hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3 transition-all duration-200 ease-out" />
                  Copy Link
                </button>
              </div>
              
              {/* Quick Share Tips */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">💡 Quick Share Tips:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Share on social media platforms</li>
                  <li>• Send to friends and family via messaging apps</li>
                  <li>• Include in your email signature</li>
                  <li>• Add to your website or blog</li>
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* Referred Users */}
        <Card title={`Referred Users (${referredUsers.length})`} subtitle="People who signed up using your referral link">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full skeleton rounded-xl"></div>
              ))}
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Sign Up Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Reward</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="table-row-hover group">
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                              <Users className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                            </div>
                            <div className="ml-4 transition-all duration-200 ease-out">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          {user.signUpDate ? new Date(user.signUpDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ease-out hover:scale-105 ${
                            user.status === 'active' ? 'status-active' : 'status-warning'
                          }`}>
                            {user.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          ${user.reward || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {currentUsers.map((user) => (
                  <div key={user.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md group">
                    <div className="flex items-center gap-3 mb-3 transition-all duration-200 ease-out">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                        <Users className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                      </div>
                      <div className="flex-1 transition-all duration-200 ease-out">
                        <div className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ease-out hover:scale-105 ${
                        user.status === 'active' ? 'status-active' : 'status-warning'
                      }`}>
                        {user.status || 'pending'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm transition-all duration-200 ease-out">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Sign Up:</span>
                        <div className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          {user.signUpDate ? new Date(user.signUpDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Reward:</span>
                        <div className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          ${user.reward || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out">
                  <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, referredUsers.length)} of {referredUsers.length} results
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-200 ease-out">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="h-4 w-4 transition-all duration-200 ease-out" />
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="h-4 w-4 transition-all duration-200 ease-out" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 transition-all duration-200 ease-out">
              <Users className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-all duration-200 ease-out" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">No referrals yet</h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Start sharing your referral link to see your first referrals here!
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default withAuth(InfluencerDashboardPage, "influencer");
