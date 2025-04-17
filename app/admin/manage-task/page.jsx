'use client'
import Navbar from "@/app/components/navbar"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal } from 'antd';
import 'react-toastify/dist/ReactToastify.css';

const ManageTask = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/task/delete-task/${selectedTaskId}`);
      toast.success('🗑️ Task deleted!');
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete task.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar title={'Manage Task'} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500 flex items-center justify-center ">No tasks have been created yet.</p>
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

                {task.weather ? (
  <div className="text-sm text-gray-700 space-y-1">
    <p>🌥 <strong>Cloud:</strong> {task.weather.cloudCondition}</p>
    <p>🌡 <strong>Temp:</strong> {task.weather.temperature}°C</p>
    <p>💧 <strong>Humidity:</strong> {task.weather.humidity}%</p>
    <p>💨 <strong>Wind:</strong> {task.weather.windSpeed} m/s</p>
  </div>
) : (
  <p className="text-sm text-red-600">No weather data available</p>
)}

                {task.suggestion && (
                  <div className="mt-3 text-yellow-700 text-sm font-medium">
                    ⚠️ {task.suggestion}
                  </div>
                )}

                <button
                  onClick={() => showDeleteModal(task._id)}
                  className="mt-4 bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                >
                  <RiDeleteBin6Line size={25} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Yes, delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default ManageTask;
