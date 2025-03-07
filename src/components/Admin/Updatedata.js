import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DContext } from "../../context/Datacontext";

export const Updatedata = () => {
  const apiurl = process.env.REACT_APP_API_URL;
  const { Device } = useContext(DContext);
  const { rangeid } = useParams();

  // ✅ Initial formData state
  const [formData, setFormData] = useState({
    deviceId: "",
    userId: "",
    voltage: { value: "", low: "", high: "" },
    current: { value: "", low: "", high: "" },
    power: { value: "", low: "", high: "" },
    powerfactor: { value: "", low: "", high: "" },
    tempeature: { value: "", low: "", high: "" },
    // vibration: { value: "", low: "", high: "" },
    energy: {value : "" , low : "" , high : ""},
    frequency : {value :"" , low : "", high : ""},
    
  });

  console.log("upadte formadata",formData)

  // ✅ Find the selected device
  useEffect(() => {
    const selectedDevice = Device?.find((item) => item.deviceId === rangeid);
    if (selectedDevice) {
      setFormData({ ...selectedDevice });
    }
  }, [rangeid, Device]);

  // ✅ Handle input change (nested fields supported)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [key, subKey] = name.split(".");

    setFormData((prevData) => ({
      ...prevData,
      [key]: subKey ? { ...prevData[key], [subKey]: value } : value,
    }));
  };

  // ✅ Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData){
      fetch(`${apiurl}/Update-device-data/${rangeid}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({formData}),
      })
        .then(res => res.json())
        .then(data => {
          console.log("update res:",data)
          if (data.success === true) {
            alert(data.message)
            window.location.href='/'
  
          } else {
            alert(data.message)
          }
        })
        .catch(err => {
          console.log("Error", err);
          alert("Catch error");
        });
    }
    else{
      console.log("Error")
    }

  };

  // ✅ Loading or not found state
  if (!Device) return <p>Loading...</p>;
  if (!formData.deviceId) return <p>Device not found</p>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center text-primary mb-4">Device Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Device ID (Read Only) */}
          <div className="mb-2">
            <label className="form-label">Device ID</label>
            <input
              type="text"
              className="form-control"
              value={formData.deviceId}
              readOnly
            />
          </div>

          {/* User ID (Read Only) */}
          <div className="mb-2">
            <label className="form-label">User ID</label>
            <input
              type="text"
              className="form-control"
              value={formData.userId}
              readOnly
            />
          </div>

          {/* Dynamic Fields (Voltage, Current, etc.) */}
          {[
            { label: "Voltage", key: "voltage" },
            { label: "Current", key: "current" },
            { label: "Power", key: "power" },
            { label: "Power Factor", key: "powerfactor" },
            { label: "Tempeature", key: "tempeature" },
            // { label: "Vibration", key: "vibration" },
            { label: "Energy", key:"energy"  },
            { label: "Frequency", key:"frequency" },

          ].map((item, index) => (
            <div className="mb-2" key={index}>
              <label className="form-label">{item.label}</label>
              <div className="d-flex gap-3">
                <input
                  readOnly
                  type='text'
                  className="form-control"
                  name={`${item.key}.value`}
                  placeholder="Value"
                  value={formData[item.key]?.value}
                  onChange={handleChange}
                  required
                />
                <input
                  readOnly
                  type='text'
                  className="form-control"
                  name={`${item.key}.low`}
                  placeholder="Low"
                  value={formData[item.key]?.low }
                  onChange={handleChange}
                  required
                />
                <input
                  readOnly
                  type='text'
                  className="form-control"
                  name={`${item.key}.high`}
                  placeholder="High"
                  value={formData[item.key]?.high}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          ))}

          {/* <button type="submit" className="btn btn-primary w-100">
            Update Device
          </button> */}
        </form>
      </div>
    </div>
  );
};

