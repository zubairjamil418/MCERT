import Card from "components/card";
import { MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const UpcomingValidations = ({ validations = [], isLoading }) => {
  const navigate = useNavigate();

  const urgencyStyles = {
    overdue: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      label: "Overdue",
    },
    urgent: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      label: "< 30 days",
    },
    upcoming: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      label: "30-90 days",
    },
  };

  const handleRowClick = (item) => {
    const route =
      item.formType === "Form 2"
        ? "/admin/forms2"
        : item.formType === "Form 3"
        ? "/admin/forms3"
        : "/admin/forms";
    navigate(route);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
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
          Upcoming Validations
        </h2>
        <div className="flex items-center rounded-lg bg-lightPrimary p-2 dark:bg-navy-700">
          <MdWarning className="h-5 w-5 text-brand-500 dark:text-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-700"
            />
          ))}
        </div>
      ) : validations.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No upcoming validations in the next 90 days.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Site
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Validation Due
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {validations.map((item, idx) => {
                const style =
                  urgencyStyles[item.urgency] || urgencyStyles.upcoming;
                return (
                  <tr
                    key={idx}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-navy-700"
                  >
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium text-navy-700 dark:text-white">
                        {item.siteName}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {({"Form 1": "Electromagnetic Flow Meters", "Form 2": "V-Notch Weirs", "Form 3": "Flumes"})[item.formType] || item.formType}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(item.validationDue)}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                      >
                        {item.daysUntil < 0
                          ? `${Math.abs(item.daysUntil)}d overdue`
                          : `${item.daysUntil}d left`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default UpcomingValidations;
