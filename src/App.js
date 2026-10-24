import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Products from "./components/products/products";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;