import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Current</Link>
        </li>
        <li>
          <Link to="/all-time">All-Time</Link>
        </li>
        <li>
          <Link to="/historic/2025-04">April 2025</Link>
        </li>
      </ul>
    </nav>
  );
}
