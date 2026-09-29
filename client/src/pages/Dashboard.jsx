function Dashboard() {
  return (
    <main className="dashboard">
      <p className="eyebrow">OVERVIEW <span> / </span> 2026</p>
      <h1>Student records</h1>
      <p className="dashboard-copy">Your workspace is ready.</p>
      <section className="empty-state" aria-label="Student records">
        <span className="empty-index">01</span>
        <div>
          <h2>No records yet</h2>
          <p>Student records will appear here when connected to your data source.</p>
        </div>
        <span className="empty-arrow" aria-hidden="true">↘</span>
      </section>
    </main>
  );
}

export default Dashboard;
