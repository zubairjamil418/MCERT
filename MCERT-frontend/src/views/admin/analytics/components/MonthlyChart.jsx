import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";

const MonthlyChart = ({ monthlyTrend = [], isLoading }) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const categories = monthlyTrend.map((m) => {
    const parts = m.month.split("-");
    return monthNames[parseInt(parts[1], 10) - 1] || m.month;
  });

  const chartData = [
    {
      name: "Electromagnetic Flow Meters",
      data: monthlyTrend.map((m) => m.form1),
    },
    {
      name: "V-Notch Weirs",
      data: monthlyTrend.map((m) => m.form2),
    },
    {
      name: "Flumes",
      data: monthlyTrend.map((m) => m.form3),
    },
  ];

  const chartOptions = {
    chart: {
      stacked: true,
      toolbar: { show: false },
    },
    tooltip: {
      style: { fontSize: "12px" },
      theme: "dark",
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "13px",
          fontWeight: "500",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "13px",
          fontWeight: "500",
        },
      },
    },
    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
      show: true,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    colors: ["#4318FF", "#39B8FF", "#01B574"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40px",
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "top",
      labels: { colors: "#A3AED0" },
    },
  };

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Inspections by Month
        </h2>
        <div className="flex items-center rounded-lg bg-lightPrimary p-2 dark:bg-navy-700">
          <MdBarChart className="h-5 w-5 text-brand-500 dark:text-white" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[250px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
        </div>
      ) : (
        <div className="md:mt-6 lg:mt-0">
          <div className="h-[250px] w-full xl:h-[350px]">
            <BarChart chartData={chartData} chartOptions={chartOptions} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default MonthlyChart;
