import React, { useState } from "react";
import Calendar from "react-calendar";
import { MdAdd, MdEvent, MdDelete, MdEdit } from "react-icons/md";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(2024, 0, 15),
      time: "10:00 AM",
      description: "Weekly team standup meeting",
      type: "meeting",
    },
    {
      id: 2,
      title: "Project Deadline",
      date: new Date(2024, 0, 20),
      time: "5:00 PM",
      description: "Submit final project deliverables",
      type: "deadline",
    },
    {
      id: 3,
      title: "Client Presentation",
      date: new Date(2024, 0, 25),
      time: "2:00 PM",
      description: "Present quarterly results to client",
      type: "presentation",
    },
  ]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    description: "",
    type: "meeting",
  });

  const getEventsForDate = (date) => {
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const hasEventsOnDate = (date) => {
    return getEventsForDate(date).length > 0;
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time) {
      const event = {
        id: Date.now(),
        title: newEvent.title,
        date: selectedDate,
        time: newEvent.time,
        description: newEvent.description,
        type: newEvent.type,
      };

      setEvents([...events, event]);
      setNewEvent({ title: "", time: "", description: "", type: "meeting" });
      setShowEventForm(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-brand-100 text-brand-800 border-brand-200";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200";
      case "presentation":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month" && hasEventsOnDate(date)) {
      return (
        <div className="flex justify-center">
          <div className="h-2 w-2 rounded-full bg-brand-500"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
              Calendar
            </h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center space-x-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full border-none shadow-none"
            />
          </div>
        </Card>
      </div>

      {/* Events Panel */}
      <div className="space-y-5">
        {/* Selected Date Events */}
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-navy-700 dark:text-white">
            Events for {selectedDate.toDateString()}
          </h3>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="py-8 text-center">
              <MdEvent className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                No events scheduled
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className={`rounded-lg border p-4 ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="mt-1 text-sm opacity-75">{event.time}</p>
                      {event.description && (
                        <p className="mt-2 text-sm">{event.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="rounded p-1 transition-colors hover:bg-red-100"
                    >
                      <MdDelete className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-navy-700 dark:text-white">
            Upcoming Events
          </h3>

          <div className="space-y-3">
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date - b.date)
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-navy-700"
                >
                  <div
                    className={`h-3 w-3 rounded-full ${
                      event.type === "meeting"
                        ? "bg-brand-500"
                        : event.type === "deadline"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-700 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.date.toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Add Event Modal */}
      {showEventForm && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-navy-800">
            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
              Add New Event
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
                  rows="3"
                  placeholder="Enter event description"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEventForm(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-container .react-calendar {
          border: none !important;
          background: transparent !important;
        }
        .react-calendar__tile {
          border-radius: 8px !important;
          margin: 2px !important;
        }
        .react-calendar__tile:hover {
          background-color: #f3f4f6 !important;
        }
        .react-calendar__tile--active {
          background-color: #2196f3 !important;
          color: white !important;
        }
        .react-calendar__tile--now {
          background-color: #fef3c7 !important;
          color: #92400e !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
