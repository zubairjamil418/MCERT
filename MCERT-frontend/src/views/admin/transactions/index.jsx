import React, { useState } from "react";
import {
  MdFilterList,
  MdSearch,
  MdDownload,
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
} from "react-icons/md";
import Card from "components/card";

const Transactions = () => {
  const [transactions] = useState([
    {
      id: "TXN001",
      date: "2024-01-15",
      description: "Payment from Client ABC",
      amount: 2500.0,
      type: "credit",
      status: "completed",
      category: "Invoice Payment",
    },
    {
      id: "TXN002",
      date: "2024-01-14",
      description: "Office Supplies Purchase",
      amount: -150.75,
      type: "debit",
      status: "completed",
      category: "Office Expenses",
    },
    {
      id: "TXN003",
      date: "2024-01-13",
      description: "Software Subscription",
      amount: -99.99,
      type: "debit",
      status: "completed",
      category: "Software",
    },
    {
      id: "TXN004",
      date: "2024-01-12",
      description: "Freelance Project Payment",
      amount: 1200.0,
      type: "credit",
      status: "pending",
      category: "Project Income",
    },
    {
      id: "TXN005",
      date: "2024-01-11",
      description: "Marketing Campaign",
      amount: -500.0,
      type: "debit",
      status: "completed",
      category: "Marketing",
    },
    {
      id: "TXN006",
      date: "2024-01-10",
      description: "Client Refund",
      amount: -300.0,
      type: "debit",
      status: "failed",
      category: "Refunds",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const exportTransactions = () => {
    // Simulate CSV export
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Date,Description,Amount,Type,Status,Category\n" +
      filteredTransactions
        .map(
          (t) =>
            `${t.id},${t.date},"${t.description}",${t.amount},${t.type},${t.status},${t.category}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-3 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Balance
              </p>
              <p
                className={`text-2xl font-bold ${
                  totalBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatAmount(totalBalance)}
              </p>
            </div>
            <div
              className={`rounded-full p-3 ${
                totalBalance >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <MdAttachMoney
                className={`h-6 w-6 ${
                  totalBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Income
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(totalIncome)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <MdTrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(-totalExpenses)}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <MdTrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="p-6">
        <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Transaction History
          </h2>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
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
              <option value="all">All Transactions</option>
              <option value="credit">Income Only</option>
              <option value="debit">Expenses Only</option>
            </select>

            {/* Export */}
            <button
              onClick={exportTransactions}
              className="flex items-center space-x-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600"
            >
              <MdDownload className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                  >
                    <td className="px-4 py-4">
                      <span className="font-medium text-navy-700 dark:text-white">
                        {transaction.id}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          transaction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
