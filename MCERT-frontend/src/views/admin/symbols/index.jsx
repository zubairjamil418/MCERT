import React, { useState } from "react";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdShowChart,
  MdSearch,
  MdRefresh,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import Card from "components/card";

const Symbols = () => {
  const [symbols] = useState([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 185.92,
      change: 2.34,
      changePercent: 1.28,
      volume: "45.2M",
      marketCap: "2.85T",
      isFavorite: true,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: -1.87,
      changePercent: -1.29,
      volume: "28.1M",
      marketCap: "1.78T",
      isFavorite: true,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.85,
      change: 5.23,
      changePercent: 1.4,
      volume: "32.7M",
      marketCap: "2.81T",
      isFavorite: false,
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 248.42,
      change: -8.91,
      changePercent: -3.46,
      volume: "67.3M",
      marketCap: "789B",
      isFavorite: true,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 151.94,
      change: 0.78,
      changePercent: 0.52,
      volume: "41.8M",
      marketCap: "1.58T",
      isFavorite: false,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 722.48,
      change: 15.67,
      changePercent: 2.22,
      volume: "52.1M",
      marketCap: "1.78T",
      isFavorite: true,
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredSymbols = symbols
    .filter((symbol) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" && symbol.isFavorite) ||
        (filter === "gainers" && symbol.change > 0) ||
        (filter === "losers" && symbol.change < 0);
      const matchesSearch =
        symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        sortBy === "price" ||
        sortBy === "change" ||
        sortBy === "changePercent"
      ) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const topGainers = symbols
    .filter((s) => s.change > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);
  const topLosers = symbols
    .filter((s) => s.change < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <MdTrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <MdTrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-3 space-y-5">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-navy-700 dark:text-white">
            Top Gainers
          </h3>
          <div className="space-y-3">
            {topGainers.map((symbol) => (
              <div
                key={symbol.symbol}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    {symbol.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(symbol.price)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <MdTrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      +{symbol.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-navy-700 dark:text-white">
            Top Losers
          </h3>
          <div className="space-y-3">
            {topLosers.map((symbol) => (
              <div
                key={symbol.symbol}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    {symbol.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(symbol.price)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-red-600">
                    <MdTrendingDown className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {symbol.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-navy-700 dark:text-white">
            Market Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Total Symbols
              </span>
              <span className="font-medium text-navy-700 dark:text-white">
                {symbols.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gainers</span>
              <span className="font-medium text-green-600">
                {symbols.filter((s) => s.change > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Losers</span>
              <span className="font-medium text-red-600">
                {symbols.filter((s) => s.change < 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Favorites
              </span>
              <span className="font-medium text-yellow-600">
                {symbols.filter((s) => s.isFavorite).length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Symbols Table */}
      <Card className="p-6">
        <div className="mb-6 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Market Symbols
          </h2>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search symbols..."
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
              <option value="all">All Symbols</option>
              <option value="favorites">Favorites</option>
              <option value="gainers">Gainers</option>
              <option value="losers">Losers</option>
            </select>

            {/* Refresh */}
            <button className="flex items-center space-x-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600">
              <MdRefresh className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort("symbol")}
                    className="flex items-center space-x-1 hover:text-brand-500"
                  >
                    <span>Symbol</span>
                    <MdShowChart className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Company
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort("price")}
                    className="ml-auto flex items-center space-x-1 hover:text-brand-500"
                  >
                    <span>Price</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort("change")}
                    className="ml-auto flex items-center space-x-1 hover:text-brand-500"
                  >
                    <span>Change</span>
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Volume
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  Favorite
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSymbols.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No symbols found
                  </td>
                </tr>
              ) : (
                filteredSymbols.map((symbol) => (
                  <tr
                    key={symbol.symbol}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                  >
                    <td className="px-4 py-4">
                      <span className="text-lg font-bold text-navy-700 dark:text-white">
                        {symbol.symbol}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-700 dark:text-gray-300">
                        {symbol.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-semibold text-navy-700 dark:text-white">
                        {formatPrice(symbol.price)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {getChangeIcon(symbol.change)}
                        <span
                          className={`font-medium ${getChangeColor(
                            symbol.change
                          )}`}
                        >
                          {formatChange(symbol.change, symbol.changePercent)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-300">
                      {symbol.volume}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-300">
                      {symbol.marketCap}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="rounded p-1 transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-900/30">
                        {symbol.isFavorite ? (
                          <MdStar className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <MdStarBorder className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {filteredSymbols.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredSymbols.length} of {symbols.length} symbols
          </div>
        )}
      </Card>
    </div>
  );
};

export default Symbols;
