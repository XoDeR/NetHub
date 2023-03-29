import Link from "next/link";

const Nav = () => {
  return (
    <ul className="nav justify-content-center">
      <li className="nav-item">
        <Link href="/" className="nav-link active">
          <a>Home</a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/login" className="nav-link active">
          <a>Login</a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href="/register" className="nav-link active">
          <a>Register</a>
        </Link>
      </li>
    </ul>
  );
};

export default Nav;
