import { FormEvent, useState } from "react";
import { useAuth } from "../../context/useAuth";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    console.log("logging in", username);
    await login({ username, password }).catch((error: Error) => {
      setError(() => error.message);
    });
  };
  return (
    <div className="flex flex-col justify-start items-center p-10 h-screen">
      <img className="w-1/4 sm:w-24 mb-10" src="/logo.png" alt="logo" />
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center p-5 bg-gray-100 border-2 border-gray-200 rounded-lg"
      >
        <div className="m-2">
          <label htmlFor="username" className="mr-2 mb-2">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="m-2">
          <label htmlFor="password" className="mr-2 mb-2">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-outline m-2">
          Login
        </button>
        <span className="m-2 text-red-900">{error}</span>
      </form>
    </div>
  );
};

export default Login;
