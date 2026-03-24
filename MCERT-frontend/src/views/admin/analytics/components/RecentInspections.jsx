import Card from "components/card";
import { MdHistory } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const RecentInspections = ({ inspections = [], isLoading }) => {
  const navigate = useNavigate();

  const formTypeRoute = {
    "Form 1": "/admin/forms",
    "Form 2": "/admin/forms2",
    "Form 3": "/admin/forms3",
  };

  const formTypeBadge = {
    "Form 1": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Form 2": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Form 3": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  const statusStyles = {
    submitted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  const handleRowClick = (item) => {
    navigate(formTypeRoute[item.formType] || "/admin/forms");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card extra="w-full p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Recent Inspections
        </h2>
        <div className="flex items-center rounded-lg bg-lightPrimary p-2 dark:bg-navy-700">
          <MdHistory className="h-5 w-5 text-brand-500 dark:text-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-700"
            />
          ))}
        </div>
      ) : inspections.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No inspections yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Site Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Form
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Inspector
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Inspection Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(item)}
                  className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-navy-700"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {item.siteName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-navy-700 dark:text-white">
                        {item.siteName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        formTypeBadge[item.formType] || formTypeBadge["Form 1"]
                      }`}
                    >
                      {item.formType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item.inspector || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || statusStyles.pending
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(item.dateOfInspection)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default RecentInspections;
