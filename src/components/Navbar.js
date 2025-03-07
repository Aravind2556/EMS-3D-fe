import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DContext } from '../context/Datacontext';



const Navbar = () => {
  const navigate = useNavigate()
  const apiurl = process.env.REACT_APP_API_URL
  const {Auth}= useContext(DContext)


  function isLogout() {
    fetch(`${apiurl}/logout`, {
      method: "GET",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          navigate('/')
          window.location.reload('/')
        }
        else {
          console.log(data.message)
        }
      })
      .catch(err => {
        console.log("Logout deFetching error", err)
      })
  }
  return (
    <nav className=" bg-primary bg-gradient navbar navbar-expand-lg navbar-light  sticky-top">
      <div className="container">
        {/* Logo / Brand */}

        <h1 className="fs-1 text-white fw-bolder">EMS</h1>

      

       

        
        <button className="btn btn-outline-dark" onClick={isLogout}>{Auth === null  ? 'Login' : 'Logout' }</button>
       
        

      </div>
    </nav>
  );
};

export default Navbar;
