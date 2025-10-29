import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

const Stats = () => {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Fetch all habits
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const { data } = await axios.get("/habits/showHabit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(data);
      } catch (err) {
        console.error("Error fetching habits:", err);
      }
    };

    if (token) fetchHabits();
  }, [token]);

  // Calculate habit statistics
  const calculateStats = (habit) => {
    if (!habit?.dates_completed?.length) {
      return { total: 0, weekly: 0, monthly: 0 };
    }

    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const startOfMonth = today.startOf("month");

    const completedDates = habit.dates_completed.map((d) => dayjs(d));
    const total = completedDates.length;
    const weekly = completedDates.filter((d) => d.isSameOrAfter(startOfWeek)).length;
    const monthly = completedDates.filter((d) => d.isSameOrAfter(startOfMonth)).length;

    return { total, weekly, monthly };
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Habit Statistics</h2>

      {/* Habit List */}
      {!selectedHabit ? (
        <div className="grid gap-3">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <div
                key={habit._id}
                onClick={() => setSelectedHabit(habit)}
                className="border rounded p-3 shadow-sm bg-gray-50 hover:bg-blue-100 cursor-pointer"
              >
                <span className="text-lg font-medium">{habit.habit_name}</span>
                <p className="text-sm text-gray-500">
                  {habit.dates_completed.length} days completed
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              No habits found. Add some habits first!
            </p>
          )}
        </div>
      ) : (
        // Detailed stats view
        <div>
          <button
            onClick={() => setSelectedHabit(null)}
            className="text-blue-600 mb-4 underline"
          >
            ← Back to all habits
          </button>

          <h3 className="text-2xl font-semibold mb-3">
            {selectedHabit.habit_name}
          </h3>

          {(() => {
            const { total, weekly, monthly } = calculateStats(selectedHabit);
            return (
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded">
                  <p className="text-lg">✅ Total days completed: <b>{total}</b></p>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                  <p className="text-lg">
                    📅 This week: <b>{weekly}</b> days
                  </p>
                  <div className="w-full bg-gray-300 h-2 rounded mt-2">
                    <div
                      className="bg-green-600 h-2 rounded"
                      style={{ width: `${(weekly / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                  <p className="text-lg">
                    🗓️ This month: <b>{monthly}</b> days
                  </p>
                  <div className="w-full bg-gray-300 h-2 rounded mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{
                        width: `${Math.min((monthly / 30) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Stats;
