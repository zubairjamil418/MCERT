import { useEffect, useState, useCallback } from "react";
import { useAuth } from "contexts/AuthContext";
import StatCards from "./components/StatCards";
import UpcomingValidations from "./components/UpcomingValidations";
import MonthlyChart from "./components/MonthlyChart";
import RecentInspections from "./components/RecentInspections";

const Analytics = () => {
  const { authFetch, user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [formType, setFormType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Recent inspections pagination
  const [recentData, setRecentData] = useState(null);
  const [recentPage, setRecentPage] = useState(1);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const recentLimit = 10;

  const userId = user?.id || localStorage.getItem("userResposne");

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (formType && formType !== "all") params.append("formType", formType);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const url = `${import.meta.env.VITE_BACKEND_URL}dashboard/stats?${params.toString()}`;
      const response = await authFetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, userId, formType, startDate, endDate]);

  const fetchRecentInspections = useCallback(async (page = 1) => {
    try {
      setIsLoadingRecent(true);
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (formType && formType !== "all") params.append("formType", formType);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", String(page));
      params.append("limit", String(recentLimit));

      const url = `${import.meta.env.VITE_BACKEND_URL}dashboard/recent-inspections?${params.toString()}`;
      const response = await authFetch(url);
      const result = await response.json();
      setRecentData(result);
      setRecentPage(page);
    } catch (err) {
      console.error("Failed to fetch recent inspections:", err);
    } finally {
      setIsLoadingRecent(false);
    }
  }, [authFetch, userId, formType, startDate, endDate, recentLimit]);

  useEffect(() => {
    fetchStats();
    fetchRecentInspections(1);
  }, [fetchStats, fetchRecentInspections]);

  const handleClearFilters = () => {
    setFormType("all");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = formType !== "all" || startDate || endDate;

  return (
    <div className="mt-3 flex flex-col gap-5">
      {/* Filters Row */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-navy-800">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Form Type
          </label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-700 dark:text-white"
          >
            <option value="all">All Forms</option>
            <option value="form1">Form 1</option>
            <option value="form2">Form 2</option>
            <option value="form3">Form 3</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-700 dark:text-white"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Clear Filters
          </button>
        )}
      </div>

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

      {/* Row 3 — Recent Inspections with Pagination */}
      <RecentInspections
        inspections={recentData?.data || []}
        isLoading={isLoadingRecent}
        pagination={recentData?.pagination}
        onPageChange={(page) => fetchRecentInspections(page)}
      />
    </div>
  );
};

export default Analytics;
