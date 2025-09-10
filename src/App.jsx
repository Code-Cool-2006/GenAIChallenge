import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleAuth from "./components/GoogleAuth";
import HomePage from "./components/HomePage"; // create this component
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
