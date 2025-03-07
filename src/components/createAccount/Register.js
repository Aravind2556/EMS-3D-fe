import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const apiurl = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const [display,setDisplay] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    userType: "user",
  });

  console.log("form data for create account",formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add form submission logic here

    if(formData){
      console.log("formData:",formData)
      fetch(`${apiurl}/Create-Account`,{
        method : 'POST',
        headers : {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.success === true){
          alert(data.message)
          setDisplay(data.message)
          navigate('/')   
        }
        else{
          setDisplay(data.message)
        }
      })
      .catch(err=>{
        console.log("Error",err)
        alert("Catch error")
      })
    }
    else{
      alert("data value dont decleared")
    }
  };

  return (
    <div className="Register container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingName"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingName">Name</label>
          </div>

          {/* Email Input */}
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingEmail">Email</label>
          </div>

          {/* Contact Input */}
          <div className="form-floating mb-3">
            <input
              type="tel"
              className="form-control"
              id="floatingContact"
              placeholder="1234567890"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingContact">Contact</label>
          </div>

          {/* Password Input */}
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          {/* Confirm Password Input */}
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingConfirmPassword"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingConfirmPassword">Confirm Password</label>
          </div>

          {/* Radio Button: User Type */}
          {/* <div className="mb-3">
            <label className="form-label">User Type</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userType"
                  id="userTypeUser"
                  value="user"
                  checked={formData.userType === "user"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="userTypeUser">
                  User
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="userType"
                  id="userTypeAdmin"
                  value="admin"
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="userTypeAdmin">
                  Admin
                </label>
              </div>
            </div>
          </div> */}

          {/* Register Button */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p>
              Already have an account?{" "}
              <a href="/" className="text-decoration-none">
                Go to login
              </a>
            </p>
          </div>
          <div className="d-flex justify-content-center">
        {
          display === false ? (
         <p></p>
              ) : (
            
                display === "User registered successfully." ? (  <p className="text-success">{display}</p>) : (<p className="text-danger">{display}</p>)
              
              )
        }
     
      </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


