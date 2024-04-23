import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/home/Home";
import Login from "./pages/user-auth/Login";
import Register from "./pages/user-auth/Register";
import NoPage from "./components/NoPage";
import Layout from "./components/Layout";
import YourList from "./pages/YourList";
import Movies from "./pages/Movies";
import Help from "./pages/Help";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/your-list" element={<YourList />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/help" element={<Help />} />
          </Route>

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
