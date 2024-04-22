import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NoPage from "./components/NoPage";
import Layout from "./components/Layout";
import YourList from "./components/YourList";
import Movies from "./components/Movies";
import Help from "./components/Help";

function App() {
  return (
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
  );
}

export default App;
