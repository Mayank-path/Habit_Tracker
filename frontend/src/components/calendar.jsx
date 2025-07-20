
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const Calendar = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [habits, setHabits] = useState([]);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day();
  const totalDays = endOfMonth.date();

  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= totalDays; i++) daysArray.push(i);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${userId}/stats`);
      const data = await response.json();
      if (data.stats) setHabits(data.stats);
    } catch (error) {
      console.error('Error fetching habits', error);
    }
  };

  const markComplete = async (habitName, date) => {
    try {
      await fetch(`http://localhost:5000/api/auth/${userId}/completeHabit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitName, date: date.toISOString() })
      });
      fetchHabits();
    } catch (error) {
      console.error('Error marking habit complete', error);
    }
  };

  useEffect(() => {
    if (userId) fetchHabits();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between px-4 py-2">
        <button 
          onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          className="text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold text-center">
          {currentDate.format('MMMM YYYY')}
        </h2>
        <button 
          onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
          className="text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-gray-600 border-t border-b py-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center text-sm mt-2">
        {daysArray.map((day, index) => {
          const fullDate = day ? currentDate.date(day) : null;
          const dateKey = fullDate?.format('YYYY-MM-DD');
          const isToday = fullDate?.isSame(dayjs(), 'day');
          const completedCount = habits.reduce((count, habit) => 
            count + (habit.dates?.includes(dateKey) ? 1 : 0), 0);

          return (
            <div
              key={index}
              className={`h-24 border cursor-pointer p-1 text-left relative
                ${!day ? 'bg-gray-100 text-gray-400 cursor-default' : ''} 
                ${isToday ? 'border-2 border-blue-500' : ''}
                hover:bg-blue-50 transition`}
            >
              <div className="font-semibold flex justify-between">
                <span>{day || ''}</span>
                {completedCount > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                    {completedCount}/{habits.length}
                  </span>
                )}
              </div>

              <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                {habits.map((habit) => {
                  const isDone = habit.dates?.includes(dateKey);
                  return (
                    <div 
                      key={habit.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (day) markComplete(habit.name, fullDate);
                      }}
                      className={`w-2 h-2 rounded-full cursor-pointer 
                        ${isDone ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                      title={`${habit.name}: ${isDone ? 'Completed' : 'Mark complete'}`}


/>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;