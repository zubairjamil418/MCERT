import { useEffect, useState, useCallback, useMemo } from "react";
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
  const [allRecentForms, setAllRecentForms] = useState([]);
  const [recentPage, setRecentPage] = useState(1);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const recentLimit = 10;

  const isAdmin = user?.role === "admin";
  const userId = isAdmin ? null : (user?.id || localStorage.getItem("userResposne"));

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsLoadingRecent(true);

      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (formType && formType !== "all") params.append("formType", formType);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const url = `${import.meta.env.VITE_BACKEND_URL}dashboard/stats?${params.toString()}`;
      const response = await authFetch(url);
      const result = await response.json();

      // Frontend manual override to bypass the backend bugs and map by dateOfInspection
      try {
        let draftCount = 0;
        let completedCount = 0;
        const trendMap = {}; 
        
        const cDate = new Date();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(cDate.getFullYear(), cDate.getMonth() - i, 1);
          const m = d.getMonth() + 1;
          const y = d.getFullYear();
          const monthKey = `${y}-${m < 10 ? "0" + m : m}`;
          trendMap[monthKey] = { month: monthKey, form1: 0, form2: 0, form3: 0, total: 0 };
        }

        const validations = [];
        const recentForms = [];

        const countStatuses = async (endpoint, typeKey, typeLabel) => {
          const res = await authFetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`);
          if (!res.ok) return;
          const items = await res.json();
          items.forEach((f) => {
            const fUserId = typeof f.userId === "object" ? f.userId?._id : f.userId;
            if (userId && fUserId !== userId) return;
            
            const targetDateStr = f.formData?.dateOfInspection || f.createdAt;
            const targetDate = new Date(targetDateStr);
            if (isNaN(targetDate)) return;

            if (startDate && targetDate < new Date(startDate)) return;
            if (endDate && targetDate > new Date(endDate)) return;

            const s = (f.status || "").toLowerCase();
            if (s === "draft") {
              draftCount++;
            } else if (s === "completed" || s === "reviewed" || s === "submitted" || s === "pending") {
              completedCount++;
            }

            const m = targetDate.getMonth() + 1;
            const y = targetDate.getFullYear();
            const monthKey = `${y}-${m < 10 ? "0" + m : m}`;
            
            if (trendMap[monthKey]) {
              trendMap[monthKey][typeKey]++;
              trendMap[monthKey].total++;
            }

            const validationDue = new Date(targetDate);
            validationDue.setFullYear(validationDue.getFullYear() + 1);
            const now = new Date();
            const diffTime = validationDue.getTime() - now.getTime();
            const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysUntil <= 90 && s !== "draft") {
              let urgency = "upcoming";
              if (daysUntil < 0) urgency = "overdue";
              else if (daysUntil < 30) urgency = "urgent";

              validations.push({
                formId: f._id,
                formType: typeLabel,
                siteName: f.formData?.siteName || "Unknown Site",
                lastInspection: targetDate.toISOString().split("T")[0],
                validationDue: validationDue.toISOString(),
                daysUntil,
                urgency,
                status: f.status
              });
            }

            let inspectorName = "Not specified";
            if (f.formData && f.formData.inspector && f.formData.inspector.trim() && f.formData.inspector.trim().toLowerCase() !== "muhammad shuraim khan") {
              inspectorName = f.formData.inspector;
            } else if (f.userId && typeof f.userId === "object") {
              const fullName = [f.userId.firstName, f.userId.lastName].filter(Boolean).join(" ") || f.userId.name || "";
              if (fullName.trim() && fullName.trim().toLowerCase() !== "muhammad shuraim khan") {
                inspectorName = fullName;
              }
            } else if (f.inspectorName && f.inspectorName.trim().toLowerCase() !== "muhammad shuraim khan") {
              inspectorName = f.inspectorName;
            } // else remains "Not specified"

            recentForms.push({
              _id: f._id,
              siteName: f.formData?.siteName || "Unknown Site",
              formType: typeLabel,
              inspector: inspectorName,
              status: f.status || "pending",
              dateOfInspection: targetDateStr,
              createdAt: f.createdAt,
            });
          });
        };

        const promises = [];
        if (formType === "all" || formType === "form1") promises.push(countStatuses("forms", "form1", "Form 1"));
        if (formType === "all" || formType === "form2") promises.push(countStatuses("second-forms", "form2", "Form 2"));
        if (formType === "all" || formType === "form3") promises.push(countStatuses("third-forms", "form3", "Form 3"));
        
        await Promise.all(promises);
        result.draft = draftCount;
        result.completed = completedCount;
        
        result.monthlyTrend = Object.values(trendMap).sort((a, b) => a.month.localeCompare(b.month));
        result.upcomingValidations = validations.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 6);
        
        recentForms.sort((a, b) => new Date(b.dateOfInspection).getTime() - new Date(a.dateOfInspection).getTime());
        setAllRecentForms(recentForms);
      } catch (e) {
        console.error("Failed to correct analytics stats on frontend:", e);
      }

      setData(result);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingRecent(false);
    }
  }, [authFetch, userId, formType, startDate, endDate]);

  const fetchRecentInspections = useCallback((page = 1) => {
    setRecentPage(page);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleClearFilters = () => {
    setFormType("all");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = formType !== "all" || startDate || endDate;

  // Manual pagination
  const paginatedForms = useMemo(() => {
    const startIndex = (recentPage - 1) * recentLimit;
    return allRecentForms.slice(startIndex, startIndex + recentLimit);
  }, [allRecentForms, recentPage, recentLimit]);

  const totalPages = Math.ceil(allRecentForms.length / recentLimit) || 1;

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
            <option value="form1">Electromagnetic Flow Meters</option>
            <option value="form2">V-Notch Weirs</option>
            <option value="form3">Flumes</option>
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
        inspections={paginatedForms}
        isLoading={isLoadingRecent}
        pagination={{
          page: recentPage,
          limit: recentLimit,
          total: allRecentForms.length,
          pages: totalPages
        }}
        onPageChange={(page) => fetchRecentInspections(page)}
      />
    </div>
  );
};

export default Analytics;
