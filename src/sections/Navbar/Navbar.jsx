import './Navbar.css'
import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { GrServices } from "react-icons/gr";
import { FaPhoneAlt } from "react-icons/fa";
import Logo from '../../assets/Logo/OIG2 (1).jpg'
export default function Navbar() {
  return (
    <>
    
    <div className="container">
        <div className="title container">
          <ul>
      
    
          </ul>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light mb-3">
          <div className="container-fluid">
          <li className='navbar-brand Mobile hidden'>
                  <a href="">

            <img src={Logo} alt="" />
                  </a>
            </li>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarNavDropdown"
              // ref={navbarCollapseRef} 
            >
              <ul className="navbar-nav">
                <li className="nav-item active item1 left">
                  <a className="nav-link" href="#">
                    <FaHome />
                    الصفحة الرئيسية
                    <span className="sr-only"></span>
                  </a>
                </li>
                <li className="nav-item item2 left">
                  <a className="nav-link" href="#about">
                    <IoPerson /> من نحن
                  </a>
                </li>
                <li className='navbar-brand Pc hidden'>
                  <a href="">

            <img src={Logo} alt="" />
                  </a>
            </li>
                <li className="nav-item item3 right">
                  <a className="nav-link" href="#Services">
                    <GrServices /> خدماتنا
                  </a>
                </li>
                <li className="nav-item item4 right">
                  <a className="nav-link" href="#Contact">
                    <FaPhoneAlt /> تواصل معنا
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    
    </>
  )
}
