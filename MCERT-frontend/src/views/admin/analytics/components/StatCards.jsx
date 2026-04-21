import Widget from "components/widget/Widget";
import { MdFileCopy, MdPending, MdCheckCircle, MdToday } from "react-icons/md";

const StatCards = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[90px] animate-pulse rounded-[20px] bg-gray-200 dark:bg-navy-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Widget
        icon={<MdFileCopy className="h-7 w-7" />}
        title="Total Inspections"
        subtitle={String(stats?.totalForms ?? 0)}
      />
      <Widget
        icon={<MdPending className="h-7 w-7" />}
        title="Draft"
        subtitle={String(stats?.draft ?? stats?.pending ?? 0)}
      />
      <Widget
        icon={<MdCheckCircle className="h-7 w-7" />}
        title="Completed"
        subtitle={String(stats?.completed ?? stats?.submitted ?? 0)}
      />
      <Widget
        icon={<MdToday className="h-7 w-7" />}
        title="This Month"
        subtitle={String(stats?.thisMonth ?? 0)}
      />
    </div>
  );
};

export default StatCards;
