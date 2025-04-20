'use client';
import Navbar from "@/app/components/navbar";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

const ManageTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    taskType: '',
    location: '',
    date: '',
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/task/get-task');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showDeleteModal = (id) => {
    setSelectedTaskId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTaskId) return;
    try {
      await axios.delete(`http://localhost:5000/api/task/delete-task/${selectedTaskId}`);
      toast.success('🗑️ Task deleted!');
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete task.');
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedTaskId(null);
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditTaskData({
      title: task.title,
      taskType: task.taskType,
      location: task.location,
      date: task.date,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditTaskData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/task/update-task/${selectedTask._id}`,
        editTaskData
      );
      toast.success('✅ Task updated!');
      fetchTasks();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update task.');
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar title={'Manage Task'} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500 flex items-center justify-center">
            No tasks have been created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-gray-200 p-5 rounded-2xl shadow hover:shadow-lg transition duration-300"
              >
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-blue-700">{task.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'Warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {task.taskType}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Date:</strong> {task.date}</p>
                <p className="text-sm text-gray-600 mb-3"><strong>Location:</strong> {task.location}</p>

                {task.suggestion && (
                  <div className="mt-3 text-yellow-700 text-sm font-medium">
                    ⚠️ {task.suggestion}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsWeatherModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                  >
                    Check Weather
                  </button>

                  <button
                    onClick={() => openEditModal(task)}
                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => showDeleteModal(task._id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weather Modal */}
      <Modal
        title={
          selectedTask
            ? `Weather Info for ${selectedTask.location} on ${selectedTask.date}`
            : 'Weather Info'
        }
        open={isWeatherModalOpen}
        onCancel={() => setIsWeatherModalOpen(false)}
        footer={null}
      >
        {selectedTask?.weather ? (
          <div className="text-sm text-gray-700 space-y-2">
            <div className="grid grid-cols-2 text-2xl">
              <p>🌥 <strong>Cloud:</strong> {selectedTask.weather.cloudCondition}</p>
              <p>🌡 <strong>Temp:</strong> {selectedTask.weather.temperature}°C</p>
              <p>💧 <strong>Humidity:</strong> {selectedTask.weather.humidity}%</p>
              <p>💨 <strong>Wind:</strong> {selectedTask.weather.windSpeed} m/s</p>
            </div>
            <div className="mt-4 text-[20px]">
              {selectedTask.weather.windSpeed > 10 ||
              selectedTask.weather.humidity > 90 ||
              selectedTask.weather.cloudCondition.toLowerCase().includes("rain") ? (
                <p className="text-yellow-700 font-semibold">⚠️ The weather may not be ideal for this task.</p>
              ) : (
                <p className="text-green-700 font-semibold">✅ This task is suitable for the current weather.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-red-600">No weather data available</p>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedTaskId(null);
        }}
        okText="Yes, delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Task"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={editTaskData.title}
              onChange={handleEditChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Task Type</label>
            <input
              type="text"
              name="taskType"
              value={editTaskData.taskType}
              onChange={handleEditChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={editTaskData.location}
              onChange={handleEditChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={editTaskData.date}
              onChange={handleEditChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTask;
