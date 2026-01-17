const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4 style={{textAlign:"center"}}>{title}</h4>
      <h2 style={{textAlign:"center", paddingTop:"10px"}}>{value}</h2>
    </div>
  );
};

export default StatCard;
