import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";
import { useAuth } from "../auth/AuthContext";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [habits, setHabits] = useState([]);
  const { token } = useAuth();

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const totalDays = endOfMonth.date();

  const today = dayjs().startOf("day");

  // Build calendar days
  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= totalDays; i++) daysArray.push(i);

  // Fetch habits from backend
  const fetchHabits = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/habits/showHabit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(Array.isArray(data) ? data : data.habits || []);
    } catch (err) {
      console.error("Error fetching habits:", err);
    }
  };

  // Toggle completion for today
  const toggleHabitCompletion = async (habitId) => {
    const date = today.toDate(); // send Date object

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit._id !== habitId) return habit;
        const isDone = habit.dates_completed?.some((d) =>
          dayjs(d).isSame(today, "day")
        );
        let newDates;
        if (isDone) {
          newDates = habit.dates_completed.filter(
            (d) => !dayjs(d).isSame(today, "day")
          );
        } else {
          newDates = [...habit.dates_completed, date];
        }
        return { ...habit, dates_completed: newDates };
      })
    );

    // Send to backend
    try {
      await axios.put(
        `/habits/markHbait/${habitId}`,
        { date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating habit:", err);
      fetchHabits(); // revert if API fails
    }
  };

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-4 py-2 mb-2">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold text-center">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          &gt;
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center font-medium text-gray-600 border-t border-b py-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-sm mt-2 gap-1">
        {daysArray.map((day, idx) => {
          const fullDate = day ? dayjs(startOfMonth).date(day) : null;
          const dateKey = fullDate?.format("YYYY-MM-DD");
          const isToday = fullDate?.isSame(today, "day");

          return (
            <div
              key={idx}
              className={`min-h-[140px] border p-2 relative overflow-y-auto rounded ${
                !day ? "bg-gray-100 text-gray-400" : "bg-white"
              } ${isToday ? "border-2 border-blue-500" : ""}`}
            >
              {/* Day header */}
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{day || ""}</span>
              </div>

              {day && (
                <div className="space-y-1">
                  {habits.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No habits found
                    </p>
                  ) : (
                    habits.map((habit) => {
                      const formattedDates = habit.dates_completed?.map((d) =>
                        dayjs(d).format("YYYY-MM-DD")
                      );
                      const isDone = formattedDates?.includes(dateKey);

                      return (
                        <div
                          key={habit._id}
                          className="flex items-center justify-between bg-gray-50 rounded px-1 py-0.5 hover:bg-blue-50 transition"
                        >
                          <span className="truncate text-xs font-medium">
                            {habit.habit_name}
                          </span>
                          <input
                            type="checkbox"
                            checked={isDone || false}
                            disabled={!isToday} // only today clickable
                            onChange={() => toggleHabitCompletion(habit._id)}
                            className={`cursor-pointer accent-green-600 ${
                              !isToday
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              !isToday
                                ? "You can only mark today's habits"
                                : isDone
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
