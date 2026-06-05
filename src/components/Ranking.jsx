function Ranking({ leaderboard }) {
  return (
    <section className="card">
      <h2>Topplista</h2>
      <div className="ranking">
        {leaderboard.map((row, index) => (
          <div className="rank-row" key={row.username}>
            <span className="place">#{index + 1}</span>
            <span>{row.username}</span>
            <strong>{row.count} räddningar</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ranking;