import React, { useState, useContext} from "react";
import { DContext } from "../../context/Datacontext";
import { Navigate } from "react-router-dom";

export const Createdevice = () => {
  const apiurl = process.env.REACT_APP_API_URL;
  const { User ,Device } = useContext(DContext)
  const [Devicedata, setDevicedata] = useState('')
  console.log("device id",Device)
  console.log("Device data", Devicedata)
  console.log("users data", User)
  const [formData, setFormData] = useState({
    deviceId: "",
    userId: "",
    voltageValue: "",
    voltageLow: "",
    voltageHigh: "",
    currentValue: "",
    currentLow: "",
    currentHigh: "",
    powerValue: "",
    powerLow: "",
    powerHigh: "",
    powerFactorValue: "",
    powerFactorLow: "",
    powerFactorHigh: "",
    temperatureValue: "",
    temperatureLow: "",
    temperatureHigh: "",
    // vibrationValue: "",
    // vibrationLow: "",
    // vibrationHigh: "",
    energyValue: "",
    energyLow : "",
    energyHigh:"",
    frequencyValue:"",
    frequencyLow:"",
    frequencyHigh:"",
  });




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    if (formData) {
      console.log("formData:", formData)
      fetch(`${apiurl}/Device_data`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),

      })
        .then(res => res.json())
        .then(data => {
          if (data.success === true) {
            setDevicedata(data.message)
            alert(data.message)
            window.location.href='/'
          }
          else {
            setDevicedata(data.message)
            alert(data.message)
          }
        })
        .catch(err => {
          console.log("Error", err)
          alert("Catch error")
        })
    }
    else {
      alert("data value dont decleared")
    }


  };






  return (
    <div className="create_device container mt-4">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Create Device</h2>
        <form onSubmit={handleSubmit}>
          




          {/* User ID (Dropdown) */}
          <div className="mb-3">
            <label className="form-label">User ID</label>
            <select
              className="form-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">Select a User</option>
              {User !== null && Array.isArray(User) && User.filter(user => user.Role === 'User').map((user) => (
                <option key={user.userid} value={user.userid}>
                  {user.Name}-({user.Email})-({user.userid})
                </option>
              ))}
            </select>
          </div>

          {/* Reusable Field Structure */}
          {[
            { label: "Voltage", value: "voltageValue", low: "voltageLow", high: "voltageHigh" },
            { label: "Current", value: "currentValue", low: "currentLow", high: "currentHigh" },
            { label: "Power", value: "powerValue", low: "powerLow", high: "powerHigh" },
            { label: "Power Factor", value: "powerFactorValue", low: "powerFactorLow", high: "powerFactorHigh" },
            { label: "Temperature", value: "temperatureValue", low: "temperatureLow", high: "temperatureHigh" },
            // { label: "Vibration", value: "vibrationValue", low: "vibrationLow", high: "vibrationHigh" },
           
           
            { label: "Energy", value: "energyValue", low: "energyLow", high: "energyHigh" },
            { label: "Frequency", value: "frequencyValue", low: "frequencyLow", high: "frequencyHigh" },
          ].map((item, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">{item.label}</label>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control"
                  name={item.value}
                  placeholder="device value"
                  value={formData[item.value]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  name={item.low}
                  placeholder="minimum range"
                  value={formData[item.low]}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  name={item.high}
                  placeholder="maximum range"
                  value={formData[item.high]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
