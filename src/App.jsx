import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/index";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    setInterval(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      });

      const elements = document.querySelectorAll(".left , .right , .hidden , .top")
  
      elements.forEach((el)=>{observer.observe(el)})

      return () => {
        elements.forEach((el) =>{observer.unobserve(el)})
      };
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/dictionary/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
