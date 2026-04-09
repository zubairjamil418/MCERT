import React, { useState } from "react";
import {
  MdTrophy,
  MdPerson,
  MdStar,
  MdTrendingUp,
  MdAdd,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import Card from "components/card";

const Competition = () => {
  const [competitions] = useState([
    {
      id: 1,
      title: "Q1 Sales Challenge",
      description: "Compete to achieve the highest sales numbers this quarter",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      status: "active",
      participants: 25,
      prize: "$5,000",
      category: "Sales",
    },
    {
      id: 2,
      title: "Innovation Contest",
      description: "Submit your most creative solution to improve workflow",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "completed",
      participants: 18,
      prize: "$3,000",
      category: "Innovation",
    },
    {
      id: 3,
      title: "Customer Service Excellence",
      description: "Achieve the highest customer satisfaction scores",
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      status: "upcoming",
      participants: 0,
      prize: "$2,500",
      category: "Service",
    },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Alice Johnson", score: 2450, change: "+12" },
    { rank: 2, name: "Bob Smith", score: 2380, change: "+5" },
    { rank: 3, name: "Carol Davis", score: 2290, change: "-2" },
    { rank: 4, name: "David Wilson", score: 2150, change: "+8" },
    { rank: 5, name: "Eva Brown", score: 2080, change: "+3" },
  ]);

  const [selectedTab, setSelectedTab] = useState("competitions");

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-brand-100 text-brand-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Sales":
        return "bg-purple-100 text-purple-800";
      case "Innovation":
        return "bg-orange-100 text-orange-800";
      case "Service":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "ðŸ¥‡";
    if (rank === 2) return "ðŸ¥ˆ";
    if (rank === 3) return "ðŸ¥‰";
    return rank;
  };

  return (
    <div className="mt-3 space-y-5">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Competitions
              </p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {competitions.filter((c) => c.status === "active").length}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <MdTrophy className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Participants
              </p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {competitions.reduce((sum, c) => sum + c.participants, 0)}
              </p>
            </div>
            <div className="rounded-full bg-brand-100 p-3">
              <MdPerson className="h-6 w-6 text-brand-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Prize Pool
              </p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                $10,500
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <MdStar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                87%
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <MdTrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab("competitions")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "competitions"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Competitions
          </button>
          <button
            onClick={() => setSelectedTab("leaderboard")}
            className={`ml-8 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "leaderboard"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Leaderboard
          </button>
        </div>

        {selectedTab === "competitions" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
                Competitions
              </h2>
              <button className="flex items-center space-x-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600">
                <MdAdd className="h-5 w-5" />
                <span>Create Competition</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-700"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-navy-700 dark:text-white">
                        {competition.title}
                      </h3>
                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                        {competition.description}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button className="rounded-lg p-2 text-brand-500 transition-colors hover:bg-brand-100 dark:hover:bg-brand-900/30">
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
                        <MdDelete className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(
                        competition.status
                      )}`}
                    >
                      {competition.status.charAt(0).toUpperCase() +
                        competition.status.slice(1)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(
                        competition.category
                      )}`}
                    >
                      {competition.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Duration:
                      </span>
                      <span className="text-navy-700 dark:text-white">
                        {new Date(competition.startDate).toLocaleDateString()} -{" "}
                        {new Date(competition.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Participants:
                      </span>
                      <span className="text-navy-700 dark:text-white">
                        {competition.participants}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Prize:
                      </span>
                      <span className="font-semibold text-green-600">
                        {competition.prize}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "leaderboard" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
                Leaderboard
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-4">
              {leaderboard.map((participant) => (
                <div
                  key={participant.rank}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    participant.rank <= 3
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                      <span className="text-lg font-bold">
                        {getRankIcon(participant.rank)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-700 dark:text-white">
                        {participant.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Rank #{participant.rank}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-navy-700 dark:text-white">
                        {participant.score.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span
                          className={`text-sm ${
                            participant.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {participant.change}
                        </span>
                        <MdTrendingUp
                          className={`h-4 w-4 ${
                            participant.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="rounded-lg bg-brand-500 px-6 py-2 text-white transition-colors hover:bg-brand-600">
                View Full Leaderboard
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Competition;
