import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../../../services/api.js";
import "./feedbackTable.css";

const FeedbackTable = ({ businessCode }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URLS.FEEDBACK}/business/${businessCode}`)
      .then((res) => setFeedbacks(res.data))
      .finally(() => setLoading(false));
  }, [businessCode]);

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="feedback-table">
      <h3>⭐ Customer Feedback</h3>

      <table>
        <thead>
          <tr>
            <th>Rating</th>
            <th>Message</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.map((f) => (
            <tr key={f._id}>
              <td>{"⭐".repeat(f.rating || 0)}</td>
              <td>{f.message || "-"}</td>
              <td>
                {f.isAfterCompletion
                  ? "After Order"
                  : "Early"}
              </td>
              <td>
                {new Date(f.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
