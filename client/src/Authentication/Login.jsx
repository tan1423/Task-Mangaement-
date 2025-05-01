import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setIsAdmin, setIsLogin, setUser } from "../Slices/AuthSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const { email, password, error, loading } = file;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFile({ ...file, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFile({ ...file, loading: true });

    if (!email || !password) {
      setFile({ ...file, loading: false, error: "All fields are required" });
      toast.warning("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password,
      });

      const data = res.data;

      if (data.success === false) {
        setFile({
          ...file,
          error: data.message,
          loading: false,
        });
        toast.error(data.message);
        return;
      }

      setFile({
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Login successful");

      if (data.user.isAdmin === true) {
        navigate("/admin");
        dispatch(setIsAdmin(true));
      } else {
        navigate("/user");
        dispatch(setIsAdmin(false));
      }

      dispatch(setIsLogin(true));
      dispatch(setUser(data.user));
    } catch (error) {
      setFile({
        ...file,
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-white border-opacity-20">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-white font-medium">Email</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 text-white font-medium">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
