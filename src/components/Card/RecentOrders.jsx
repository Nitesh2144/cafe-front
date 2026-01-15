const RecentOrders = ({ orders }) => {
  return (
    <div className="table-box">
      <h3>Recent Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Unit</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.unitName}</td>
              <td>₹{o.totalAmount}</td>
              <td>{new Date(o.createdAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
