import React, { useContext, useState } from "react";
import PowermangeUser from "../../assets/undraw_personal-info_yzls.svg";
import PowermangeAdmin from "../../assets/undraw_proud-self_j8xv.svg";
import { DContext } from "../../context/Datacontext";


export const Login = () => {
  const apiurl = process.env.REACT_APP_API_URL;
  const { setAuth,Auth } = useContext(DContext);
  const [display, setDisplay] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const userType = isAdmin ? "Admin-Login" : "Login-User";
    fetch(`${apiurl}/${userType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDisplay(data.message);
          setAuth(data.user);
          window.location.reload()
         
        } else {
          alert(data.message)
          setDisplay(data.message);
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        alert("Server is busy please try agian later");
      });
  };


  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="row w-100 shadow-lg rounded p-4 bg-white">
        {/* Image Section */}
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <img
            src={isAdmin ? PowermangeAdmin : PowermangeUser}
            alt="Login Illustration"
            className="img-fluid"
            style={{ height: "180px" , objectFit : "contain" }}
          />
        </div>

        {/* Form Section */}
        <div className="col-md-6">
          <h2 className="text-center mb-4">{isAdmin ? "Admin Login" : "User Login"}</h2>
          <form onSubmit={handleLogin}>
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

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>

            <div className="d-flex justify-content-between">
              {/* <a href="#forgot-password" className="text-decoration-none">
                Forgot Password?
              </a> */}
              <a href="/create-account" className="text-decoration-none">
                Create Account
              </a>
            </div>

            <div className="d-flex justify-content-center mt-3">
              {display && (
                display === "Login successfully" ? (
                  <p className="text-success">{display}</p>
                ) : (
                  <p className="text-danger">{display}</p>
                )
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="d-flex justify-content-center mt-3 gap-3">
        <button className={`btn ${!isAdmin ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setIsAdmin(false)}>
          User
        </button>
        <button className={`btn ${isAdmin ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setIsAdmin(true)}>
          Admin
        </button>
      </div>
    </div>
  );
};
