import React, { useState } from "react";
import {
  MdAttachMoney,
  MdAccountBalance,
  MdPending,
  MdCheck,
  MdClose,
  MdAdd,
  MdSearch,
} from "react-icons/md";
import Card from "components/card";

const Payout = () => {
  const [payouts] = useState([
    {
      id: "PAY001",
      recipient: "John Doe",
      email: "john.doe@example.com",
      amount: 1250.0,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-01-15",
      description: "Freelance project payment",
    },
    {
      id: "PAY002",
      recipient: "Alice Smith",
      email: "alice.smith@example.com",
      amount: 750.5,
      method: "PayPal",
      status: "pending",
      date: "2024-01-14",
      description: "Consulting services",
    },
    {
      id: "PAY003",
      recipient: "Bob Johnson",
      email: "bob.johnson@example.com",
      amount: 2000.0,
      method: "Wire Transfer",
      status: "processing",
      date: "2024-01-13",
      description: "Contract work completion",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayouts = payouts.filter((payout) => {
    const matchesFilter = filter === "all" || payout.status === filter;
    const matchesSearch =
      payout.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPaidOut = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payouts
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="mt-3 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Paid Out
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(totalPaidOut)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <MdCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Payouts
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatAmount(totalPending)}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <MdPending className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Payouts
              </p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {payouts.length}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <MdAccountBalance className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card className="p-6">
        <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Payout Management
          </h2>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
            >
              <option value="all">All Payouts</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
            </select>

            {/* New Payout */}
            <button className="flex items-center space-x-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600">
              <MdAdd className="h-5 w-5" />
              <span>New Payout</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Payout ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Recipient
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Method
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payouts found
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                  >
                    <td className="px-4 py-4">
                      <span className="font-medium text-navy-700 dark:text-white">
                        {payout.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-navy-700 dark:text-white">
                          {payout.recipient}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payout.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {payout.method}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-semibold text-navy-700 dark:text-white">
                        {formatAmount(payout.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(
                          payout.status
                        )}`}
                      >
                        {payout.status.charAt(0).toUpperCase() +
                          payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(payout.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {filteredPayouts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPayouts.length} of {payouts.length} payouts
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payout;
