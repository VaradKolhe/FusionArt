import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { motion } from "framer-motion";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf5] p-5 md:p-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-[#5a3c28] text-3xl font-bold mb-6 font-serif">Transaction History</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-[#e5e7eb] border-t-[#a17b5d] rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-[#888] text-center text-lg py-10">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-[#5a3c28]">
                  <th className="p-4 border-b-2 border-[#e5e7eb]">Date</th>
                  <th className="p-4 border-b-2 border-[#e5e7eb]">Type</th>
                  <th className="p-4 border-b-2 border-[#e5e7eb]">Amount</th>
                  <th className="p-4 border-b-2 border-[#e5e7eb]">Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <motion.tr 
                    key={txn.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="border-b border-[#f3f4f6] hover:bg-[#fafafa]"
                  >
                    <td className="p-4 text-[#6b4c35]">
                      {new Date(txn.timeStamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-[#8c6448]">
                      {txn.type.replace("_", " ")}
                    </td>
                    <td className={`p-4 font-bold ${txn.type === 'ADD_FUNDS' || txn.type === 'SOLD' ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.type === 'ADD_FUNDS' || txn.type === 'SOLD' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-[#888]">
                      {txn.painting ? txn.painting.title : "Wallet Top-up / Withdrawal"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
