import './App.css';
import logo from './fleetfixr_logo.png';
import React, { useState, useEffect } from "react";
import PowerUnitList from "./components/PowerUnitList";
import PowerUnitForm from "./components/PowerUnitForm";
import CvipForm from './components/cvipForm';
import axios from "axios";


function App() {

  const [editUnit, setEditUnit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(false);
  const [showCvipForm, setShowCvipForm] = useState(false);

useEffect(() => {
  console.log("showCvipForm changed:", showCvipForm);
  }, [showCvipForm]);


  const handleCloseCvip = () => {
    setShowCvipForm(false);
    setRefresh(!refresh);
  }

  const handleSaved = () => {
    setEditUnit(null);
    setRefresh(!refresh);
  };

  const handleEdit = (unit) => {
    setEditUnit(unit);
  };

  const handleViewCvip = (unit) => {
    setSelectedUnit(unit);
    setShowCvipForm(true);
    console.log(setShowCvipForm);
    console.log(unit);
  }


  const handleUpdate = () => {
    if (!editUnit) return;
    axios.put(`http://localhost:8080/api/powerunits/${editUnit.id}`, editUnit)
      .then(() => {
        alert("Power unit updated successfully");
        setEditUnit(null);
        setRefresh(!refresh);
      })
      .catch(err => {
        console.error("Error updating power unit:", err);
        alert("Failed to update power unit");
      });
  };
  return (
    
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="FleetFixr Logo" className="App-logo" />
        <h1 className="app-title">
        <span className="highlight">FleetFixr</span>
        Dashboard
      </h1>
      </div>
      <div className="dashboard">
        <div className="left-col">
        <PowerUnitForm 
        selectedUnit={editUnit} 
        onSaved={handleSaved} 
        onCancel={() => setEditUnit(null)}
        onUpdate={handleUpdate} />
        
          <CvipForm
          selectedUnit={selectedUnit}
          onClose={handleCloseCvip} />
        
        </div>
       
        <PowerUnitList key={refresh} 
        onEdit={handleEdit}
        onViewCvip={handleViewCvip} />
         
        </div>
      
    </div>
  );
}

export default App;
