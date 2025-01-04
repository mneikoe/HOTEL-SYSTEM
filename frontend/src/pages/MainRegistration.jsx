/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const MainRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name: name,
      email: email,
      password: password,
      role: "admin",
    };

    /* try {
      await axios.post("/api/users/register", { role: "admin" });
      navigate("/home");
    } catch (error) {
      alert("Registration failed:", error);
    }*/
    const apiUrl = "http://localhost:7001/api/users/register";
    console.log("apiUrl: ", apiUrl);
    const response = await axios.post(apiUrl, newUser, { role: "admin" });
    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="relative h-screen w-full">
      <div
        className="bg-cover bg-center h-full w-full flex items-center justify-center py-8"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1731432247825-a6630d4ea538?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <form
          className="bg-white bg-opacity-70 p-8 rounded-md shadow-md w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-center">
            <img src="your-logo-url.png" alt="Logo" className="h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Register as Admin
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainRegistration;
