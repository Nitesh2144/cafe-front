import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../../services/api.js";

import StatCard from "../../../../components/Card/StatCard.jsx";
import IncomeChart from "../../../../components/Card/IncomeChart.jsx";
import RecentOrders from "../../../../components/Card/RecentOrders.jsx";
import "./Home.css";

const Home = ({ businessCode }) => {
  const [overview, setOverview] = useState({});
  const [today, setToday] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [weekly, setWeekly] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessCode) {
      loadData();
    }
  }, [businessCode]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        overviewRes,
        todayRes,
        monthlyRes,
        weeklyRes,
        recentOrdersRes,
      ] = await Promise.all([
        axios.get(`${API_URLS.DASHBOARD}/overview/${businessCode}`),
        axios.get(`${API_URLS.DASHBOARD}/today-income/${businessCode}`),
        axios.get(`${API_URLS.DASHBOARD}/monthly-income/${businessCode}`),
        axios.get(`${API_URLS.DASHBOARD}/weekly-income/${businessCode}`),
        axios.get(`${API_URLS.DASHBOARD}/recent-orders/${businessCode}`),
      ]);

      setOverview(overviewRes.data);
      setToday(todayRes.data.todayIncome);
      setMonthly(monthlyRes.data.monthlyIncome);
      setWeekly(weeklyRes.data);
      setOrders(recentOrdersRes.data);
    } catch (error) {
      console.error("❌ Dashboard load error:", error);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 style={{ padding: 20, textAlign:"center"}}>Loading dashboard...</h3>;
  }

  return (
    <div className="dashboard">

      {/* TOP CARDS */}
      <div className="stats-grid">
        <StatCard
          title="Total Income"
          value={`₹${overview.totalIncome || 0}`}
        />
        <StatCard title="Monthly Income" value={`₹${monthly}`} />
        <StatCard title="Today Income" value={`₹${today}`} />
        <StatCard title="Total Orders" value={overview.totalOrders || 0} />
 <StatCard title="Today Orders" value={overview.todayOrders || 0} />

      </div>

      {/* WEEKLY CHART */}
      <IncomeChart data={weekly} />

      {/* RECENT ORDERS */}
      <RecentOrders orders={orders} />
    </div>
  );
};

export default Home;
