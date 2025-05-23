export default function Leaderboard({ data, title }) {
  return (
    <div>
      <h2>{title}</h2>
      <ol>
        {data.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.total_points}
          </li>
        ))}
      </ol>
    </div>
  );
}
