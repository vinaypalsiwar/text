import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ sender: "", receiver: "", message: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8081/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/transactions", form);
      setTransactions([...transactions, res.data]);
      setForm({ sender: "", receiver: "", message: "" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Transaction Tracker</h1>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="sender"
            value={form.sender}
            onChange={handleChange}
            placeholder="Sender"
            className="border border-gray-600 bg-gray-700 p-3 rounded-lg w-full text-white focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="receiver"
            value={form.receiver}
            onChange={handleChange}
            placeholder="Receiver"
            className="border border-gray-600 bg-gray-700 p-3 rounded-lg w-full text-white focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="border border-gray-600 bg-gray-700 p-3 rounded-lg w-full text-white focus:outline-none focus:ring focus:ring-blue-500 h-24"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300"
          >
            Add Transaction
          </button>
        </form>
      </div>
      <div className="mt-8 w-full max-w-lg">
        <ul className="space-y-4">
          {transactions.map((t) => (
            <li key={t._id} className="bg-gray-800 p-5 rounded-2xl shadow-md flex justify-between items-center border border-gray-700">
              <span className="text-lg">
                <span className="font-semibold text-blue-400">{t.sender}</span> ➝ <span className="font-semibold text-green-400">{t.receiver}</span>: {t.message}
              </span>
              <button
                onClick={() => handleDelete(t._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
