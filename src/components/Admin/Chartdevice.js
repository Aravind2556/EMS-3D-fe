import React, { useContext, useEffect, useState  } from "react";
import ApexCharts from "react-apexcharts";
import { useParams } from "react-router-dom";
import { DContext } from "../../context/Datacontext";
import waringbeep from "../../assets/warning-beep.mp3"; // Beep sound file path
import Loading from "../Loading";
import Livechart from '../Admin/AccGyroChart'
import ThreeDmodel from '../Admin/ThreeDmodel'


export const Chartdevice = () => {

  const {Device } = useContext(DContext);
  const {chartid } = useParams();
  const [Infrom, setInform] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [liveChartData, setLiveChartData] = useState(null);
  const [lastProcessedId, setLastProcessedId] = useState(null);
  const [lastFeedTimestamp, setLastFeedTimestamp] = useState(null)

  const [model, setModel] = useState(null)

  const [Ax, setAx] = useState(null);
  const [Ay, setAy] = useState(null);
  const [Az, setAz] = useState(null);
  const [Gx, setGx] = useState(null);
  const [Gy, setGy] = useState(null);
  const [Gz, setGz] = useState(null);

  const [voltage, setVoltage] = useState(null);
  const [current, setCurrent] = useState(null);
  const [power, setPower] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [powerfactor, setPowerfactor] = useState(null);
  const [temperature, setTemperature] = useState(null);

  const [currentVibration,setCurrentFrequnce]=useState(null)
  const [CurrentTemp,setCurrentTemp]=useState(null)
  const [currentPower,setCurrentPower]=useState(null)


  React.useEffect(()=>{
    if(frequency){
      const currentFrequence = frequency["y-axis"].slice(-1)[0]
      setCurrentFrequnce(currentFrequence)
    }

    if(temperature){
      const currentTemp = temperature["y-axis"].slice(-1)[0]
      setCurrentTemp(currentTemp)

    }

    if(current){
      const currentPower = current["y-axis"].slice(-1)[0]
      setCurrentPower(currentPower)

    }
  },[frequency , temperature, current])


const controls = {
    show: true,
    download: true,
    selection: false,
    zoom: false,
    zoomin: true,
    zoomout: true,
    pan: true,
    reset: true,
    zoomEnabled: true,
    autoSelected: 'zoom'
  };


  // Load warning beep sound
  const warningBeep = new Audio(waringbeep);

  useEffect(() => {
    const selectedDevice = Device?.find((item) => item.deviceId === chartid);
    if (selectedDevice) {
      setInform(selectedDevice);
      setModel(((selectedDevice.deviceId).toLowerCase()==="dev-2025-001")?"bulb":"scene")
    }
  }, [chartid, Device]);


  useEffect(() => {
    if (!Infrom) return;

    const channelId = "2866252";
    const apiKey = "HGKO9ARDWWYHKHLO";
    const thingspeakUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}`;

    const fetchData = () => {

      // Code to fetch Ax,y,z and Gx,y,z data from Thinkspeak
      fetch("https://api.thingspeak.com/channels/2866252/feeds.json?api_key=HGKO9ARDWWYHKHLO")
        .then(res => res.json())
        .then(data => {
          if (data && data.feeds && data.feeds.length > 0) {
            const feeds = data.feeds;
            const xAxisData = feeds.map(data => new Date(data.created_at).getTime())

            const Ax = feeds.map(data => data.field1)
            setAx({
              "x-axis": xAxisData,
              "y-axis": Ax,
              color: "#f24236",
              seriesName: 'Ax'
            })

            const Ay = feeds.map(data => data.field2)
            setAy({
              "x-axis": xAxisData,
              "y-axis": Ay,
              color: "#007FFF",
              seriesName: 'Ay'
            })

            const Az = feeds.map(data => data.field3)
            setAz({
              "x-axis": xAxisData,
              "y-axis": Az,
              color: "#98CE00",
              seriesName: 'Az'
            })

            const Gx = feeds.map(data => data.field4)
            setGx({
              "x-axis": xAxisData,
              "y-axis": Gx,
              color: "#f24236",
              seriesName: 'Gx'
            })

            const Gy = feeds.map(data => data.field5)
            setGy({
              "x-axis": xAxisData,
              "y-axis": Gy,
              color: "#007FFF",
              seriesName: 'Gy'
            })

            const Gz = feeds.map(data => data.field6)
            setGz({
              "x-axis": xAxisData,
              "y-axis": Gz,
              color: "#98CE00",
              seriesName: 'Gz'
            })

          }
        })
        .catch((err) => console.error("Error fetching ThingSpeak data:", err))


      fetch(thingspeakUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.feeds && data.feeds.length > 0) {
            const feeds = data.feeds;
            const latestFeed = feeds[feeds.length - 1]; // Get the latest feed
            setLastFeedTimestamp(latestFeed.created_at)
            const latestFeedId = latestFeed.entry_id; // Unique ID of the latest feed
            // If the last processed ID is the same, don't trigger alerts again
            if (lastProcessedId === latestFeedId) return;
            setLastProcessedId(latestFeedId); // Update the processed ID
            const timestamps = feeds.map((feed) =>
              new Date(feed.created_at).toLocaleTimeString()
            );
            const fields = [
              { key: "field1", name: "Voltage", color: "black", type: "line" },
              { key: "field2", name: "Current", color: "red", type: "bar" },
              { key: "field3", name: "Power", color: "#0000FF", type: "area" },
              { key: "field4", name: "Energy", color: "#FF4500", type: "scatter" },
              { key: "field5", name: "Frequency", color: "#1E90FF", type: "heatmap" },
              { key: "field6", name: "Power Factor", color: "#800080", type: "radar" },
              { key: "field7", name: "Temperature", color: "#FFA500", type: "line" },
              // { key: "field8", name: "Vibrati/on", color: "#008080", type: "bar" },
            ];
            let newAlerts = [];
            const chartData = fields
              .map((field) => {
                const values = feeds
                  .map((feed) => Number(feed[field.key]))
                  .filter((v) => !isNaN(v));
                if (values.length === 0) return null;
                const latestValue = values[values.length - 1];
                const deviceParam = Infrom[field.name.toLowerCase()];
                if (deviceParam) {
                  const { low, high } = deviceParam;
                  if (low !== undefined && high !== undefined) {
                    if (latestValue < low) {
                      newAlerts.push(`${field.name} is too LOW: ${latestValue}`);
                    } else if (latestValue > high) {
                      newAlerts.push(`${field.name} is too HIGH: ${latestValue}`);
                    }
                  }
                }
                return {
                  name: field.name,
                  data: values,
                  type: field.type,
                  options: {
                    chart: { type: field.type },
                    xaxis: { categories: timestamps },
                    colors: [field.color],
                  },
                };
              })
              .filter(Boolean);
            if (newAlerts) {
              setAlerts(newAlerts);
            }
            setLiveChartData(chartData);

            const xAxisData = feeds.map((feed) =>
              new Date(feed.created_at).getTime()
            )

            const voltageRecords = feeds.map(data => data.field1)
            setVoltage({
              "x-axis": xAxisData,
              "y-axis": voltageRecords,
              color: "black",
              seriesName: 'voltage'
            })
            const currentRecords = feeds.map(data => data.field2)
            setCurrent({
              "x-axis": xAxisData,
              "y-axis": currentRecords,
              color: "red",
              seriesName: 'current'
            })
            const powerRecords = feeds.map(data => data.field3)
            setPower({
              "x-axis": xAxisData,
              "y-axis": powerRecords,
              color: "#0000FF",
              seriesName: 'power'
            })
            const energyRecords = feeds.map(data => data.field4)
            setEnergy({
              "x-axis": xAxisData,
              "y-axis": energyRecords,
              color: "#FF4500",
              seriesName: 'energy'
            })
            const frequencyRecords = feeds.map(data => data.field5)
            setFrequency({
              "x-axis": xAxisData,
              "y-axis": frequencyRecords,
              color: "#1E90FF",
              seriesName: 'frequency'
            })
            const powerfactorRecords = feeds.map(data => data.field6)
            setPowerfactor({
              "x-axis": xAxisData,
              "y-axis": powerfactorRecords,
              color: "#800080",
              seriesName: 'power factor'
            })
            const temperatureRecords = feeds.map(data => data.field7)
            setTemperature({
              "x-axis": xAxisData,
              "y-axis": temperatureRecords,
              color: "#FFA500",
              seriesName: 'temperature'
            })




          }
        })
        .catch((err) => console.error("Error fetching ThingSpeak data:", err));
    }

    fetchData()

    setInterval(fetchData, 5000)


  }, [Infrom, lastProcessedId]); // Dependency updated to track latest processed ID

  if (alerts === null || liveChartData === null || lastFeedTimestamp === null || !Ax || !Ay || !Az || !Gx || !Gy || !Gz || !voltage || !current || !power || !energy || !frequency || !powerfactor || !temperature || CurrentTemp === null || currentPower === null || currentVibration === null || model===null || !Infrom) {
    return <Loading />
  }



  return (
    <div className="chart_device container">
      <h1>Device Details and Live Data</h1>

      {/* Top Section (Device Data + Alerts) */}
      <div className="row d-flex justify-content-between">
        {/* Device Data (Left) */}
        <div className="col-md-6 bg-primary rounded p-2 my-1 border-box">
          <h2 className="text-light fw-bold">Device Data</h2>
          {!Infrom ? (
            <p>Loading device data...</p>
          ) : (
            <table className="table table-bordered table-rounded m-0">
              <thead>
                <tr className="fw-bold">
                  <th className="text-primary" style={{width: '33%'}}>Parameter</th>
                  <th className="text-primary" style={{width: '33%'}}>Live record</th>
                  <th className="text-primary" style={{width: '33%'}}>Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "voltage",
                  "current",
                  "power",
                  "energy",
                  "frequency",
                  "powerfactor",
                  "tempeature"
                ].map((param, i) => (
                  <tr key={param}>
                    <td className="fw-bold" style={{width: '33%'}}>{(param==="tempeature"?"Temperature":param.charAt(0).toUpperCase() + param.slice(1))}</td>
                    <td style={{width: '33%'}}>{liveChartData[i].data.splice(-1)[0] || "N/A"}</td>
                    {/* <td>{Infrom[param]?.value || "N/A"}</td> */}
                    <td style={{width: '33%'}}>
                      {Infrom[param]?.low || "N/A"} -{" "}
                      {Infrom[param]?.high || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

     

        {/* Alerts (Right) */}
        <div className="col-md-5 bg-primary rounded p-2 my-1 border-box">
          <div>

            <h2 className="text-light fw-bold">Alerts</h2>
          </div>
          <div
            style={{
              padding: "20px",
              minHeight: "300px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            <p className="text-dark text-end">Last live Record at: <span className="fw-bold">{new Date(lastFeedTimestamp).toLocaleString()}</span></p>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} style={{ color: "black" }}>
                  <p className={`${alert.length > 0 && alert.includes("LOW") ? "text-danger" : "text-info"} fw-bold m-0 my-1 py-1 px-2 rounded`} style={{ backgroundColor: "#effef5" }}>{alert}</p>
                </div>
              ))
            ) : (
              <p>No alerts</p>
            )}
          </div>
        </div>
      </div>

    {/* Motor values */}

    <div className="bg-light d-flex justify-content-center rounded">

      <ThreeDmodel  isOn={currentPower||0.04} temperature={CurrentTemp||50} vibration={currentVibration||1.8} renderModel={model} currentMin={Infrom.current.low||0.05} vibrationMax={Infrom.frequency.high||2} tempMin={Infrom.tempeature.low||40} tempMax={Infrom.tempeature.high||60}/>

    </div>

      {/* Bottom Section (Charts) */}
      <div className="row mt-4 bg-primary rounded flex-wrap d-flex justify-content-center">
        <div className="col-12">
          <h2 className="text-center text-light mt-2 fw-bold">Live Data Charts</h2>
          <div className="d-flex flex-wrap justify-content-center">

            {
              [voltage, current, power, energy, frequency, powerfactor, temperature].map((chart, i) => (
                <div className='col-11 col-md-5 col-lg-4 m-2 rounded bg-white' key={i}>
                <Livechart data={[chart]} title={chart.seriesName} lineStyle={'smooth'} lineWidth={3} chartType={'line'} controls={controls} />
                </div>
              ))
            }
            
          </div>

          <div className='p-3 border rounded m-2 bg-primary'>
            <h3 className='text-center my-2 text-white fw-bolder p-3'>Acceleration & Gyroscope Sensor</h3>
            <div className='w-100 d-flex flex-wrap justify-content-center align-items-start gap-3'>
              <div className='col-11 col-md-8 col-lg-5 bg-white rounded'>
                <Livechart data={[Ax, Ay, Az]} title={'Acceleration data'} lineStyle={'smooth'} lineWidth={2} chartType={'line'} controls={controls} />
              </div>
              <div className='col-11 col-md-8 col-lg-5 bg-white rounded'>
                <Livechart data={[Gx, Gy, Gz]} title={'Gyroscope data'} lineStyle={'smooth'} lineWidth={2} chartType={'line'} controls={controls} />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Chartdevice;











