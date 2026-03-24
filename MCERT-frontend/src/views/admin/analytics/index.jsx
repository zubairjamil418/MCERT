import { useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
import StatCards from "./components/StatCards";
import UpcomingValidations from "./components/UpcomingValidations";
import MonthlyChart from "./components/MonthlyChart";
import RecentInspections from "./components/RecentInspections";

const Analytics = () => {
  const { authFetch, user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userId = user?.id || localStorage.getItem("userResposne");
        const url = `${import.meta.env.VITE_BACKEND_URL}dashboard/stats${
          userId ? `?userId=${encodeURIComponent(userId)}` : ""
        }`;
        const response = await authFetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [authFetch, user]);

  return (
    <div className="mt-3 flex flex-col gap-5">
      {/* Row 1 — Stat Cards */}
      <StatCards
        stats={data}
        isLoading={isLoading}
      />

      {/* Row 2 — Upcoming Validations + Monthly Chart */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <UpcomingValidations
            validations={data?.upcomingValidations}
            isLoading={isLoading}
          />
        </div>
        <div className="xl:col-span-2">
          <MonthlyChart
            monthlyTrend={data?.monthlyTrend}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Row 3 — Recent Inspections */}
      <RecentInspections
        inspections={data?.recentInspections}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Analytics;
