import React, { useState, useEffect } from "react";

const VoltagePredictor = () => {
  const [voltageData, setVoltageData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [avgVoltage, setAvgVoltage] = useState("No data");
  const [avgCurrent, setAvgCurrent] = useState("No data");
  const [avgPower, setAvgPower] = useState("No data");
  const [avgEnergy, setAvgEnergy] = useState("No data");
  const [avgFrequency, setAvgFrequency] = useState("No data");
  const [powerFactor, setPowerFactor] = useState("No data");
  const [voltageVariation, setVoltageVariation] = useState("No data");
  const [avgTemperature, setAvgTemperature] = useState("No data");
  const [amount, setAmount] = useState("No data");

  const unitPrice = 100.5; // Electricity price per kWh (Rs.)

  // Fetch API Data from ThingSpeak
  useEffect(() => {
    fetch("https://api.thingspeak.com/channels/2834537/feeds.json?api_key=KXM3US7B3WCO8JKS&results=500")
      .then(response => response.json())
      .then(data => {
        if (data.feeds) {
          setVoltageData(data.feeds);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Calculate Values
  const calculateValues = () => {
    let totalVoltage = 0, voltageCount = 0;
    let totalCurrent = 0, currentCount = 0;
    let totalFrequency = 0, freqCount = 0;
    let totalPowerFactor = 0, powerFactorCount = 0;
    let totalTemperature = 0, tempCount = 0;

    let minVoltage = Infinity;
    let maxVoltage = -Infinity;

    voltageData.forEach(feed => {
      let date = new Date(feed.created_at);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      if (month === parseInt(selectedMonth) && year === parseInt(selectedYear)) {
        if (feed.field1) {
          let voltage = parseFloat(feed.field1);
          if (!isNaN(voltage)) {
            totalVoltage += voltage;
            voltageCount++;
            minVoltage = Math.min(minVoltage, voltage);
            maxVoltage = Math.max(maxVoltage, voltage);
          }
        }
        if (feed.field2) {
          let current = parseFloat(feed.field2);
          if (!isNaN(current)) {
            totalCurrent += current;
            currentCount++;
          }
        }
        if (feed.field3) {
          let frequency = parseFloat(feed.field3);
          if (!isNaN(frequency)) {
            totalFrequency += frequency;
            freqCount++;
          }
        }
        if (feed.field4) {
          let pf = parseFloat(feed.field4);
          if (!isNaN(pf)) {
            totalPowerFactor += pf;
            powerFactorCount++;
          }
        }
        if (feed.field5) {
          let temp = parseFloat(feed.field5);
          if (!isNaN(temp)) {
            totalTemperature += temp;
            tempCount++;
          }
        }
      }
    });

    if (voltageCount === 0) {
      setAvgVoltage("No data");
      setAvgCurrent("No data");
      setAvgPower("No data");
      setAvgEnergy("No data");
      setAvgFrequency("No data");
      setPowerFactor("No data");
      setVoltageVariation("No data");
      setAvgTemperature("No data");
      setAmount("No data");
      return;
    }

    let avgVoltage = (voltageCount > 0) ? (totalVoltage / voltageCount).toFixed(2) + " V" : "No data";
    let avgCurrent = (currentCount > 0) ? (totalCurrent / currentCount).toFixed(2) + " A" : "No data";
    let avgFrequency = (freqCount > 0) ? (totalFrequency / freqCount).toFixed(2) + " Hz" : "No data";
    let avgPowerFactor = (powerFactorCount > 0) ? (totalPowerFactor / powerFactorCount).toFixed(2) : "No data";
    let avgTemperature = (tempCount > 0) ? (totalTemperature / tempCount).toFixed(2) + " °C" : "No data";

    let avgPower = (voltageCount > 0 && currentCount > 0) ? (parseFloat(avgVoltage) * parseFloat(avgCurrent)).toFixed(2) + " W" : "No data";
    let avgEnergy = (voltageCount > 0 && currentCount > 0) ? ((parseFloat(avgPower) * 24 * 30) / 1000).toFixed(2) + " kWh" : "No data";
    let voltageVariation = (minVoltage !== Infinity && maxVoltage !== -Infinity) ? (maxVoltage - minVoltage).toFixed(2) + " V" : "No data";
    let amount = (avgEnergy !== "No data") ? (parseFloat(avgEnergy) * unitPrice).toFixed(2) + " ₹" : "No data";

    setAvgVoltage(avgVoltage);
    setAvgCurrent(avgCurrent);
    setAvgPower(avgPower);
    setAvgEnergy(avgEnergy);
    setAvgFrequency(avgFrequency);
    setPowerFactor(avgPowerFactor);
    setVoltageVariation(voltageVariation);
    setAvgTemperature(avgTemperature);
    setAmount(amount);
  };

  return (
    <div className="chart_device container py-4">
      <h1 className="text-center mb-4">Electrical & Environmental Analysis</h1>

      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <label htmlFor="monthSelect" className="form-label">Select Month:</label>
          <select
            id="monthSelect"
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <label htmlFor="yearSelect" className="form-label">Select Year:</label>
          <select
            id="yearSelect"
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2025 - i}>
                {2025 - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={calculateValues}>
          Predict Parameters
        </button>
      </div>

      {avgVoltage && (
        <div className="alert alert-info text-center">
          <p><b>Average Voltage:</b> {avgVoltage}</p>
          <p><b>Average Current:</b> {avgCurrent}</p>
          <p><b>Average Power:</b> {avgPower}</p>
          <p><b>Total Energy Consumption:</b> {avgEnergy}</p>
          <p><b>Electricity Cost:</b> {amount}</p>
          <p><b>Average Frequency:</b> {avgFrequency}</p>
          <p><b>Power Factor:</b> {powerFactor}</p>
          <p><b>Voltage Variation:</b> {voltageVariation}</p>
          <p><b>Average Temperature:</b> {avgTemperature}</p>
        </div>
      )}
    </div>
  );
};

export default VoltagePredictor;
