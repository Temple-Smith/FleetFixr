import './App.css';
import React, { useState } from "react";
import PowerUnitList from "./components/PowerUnitList";
import PowerUnitForm from "./components/PowerUnitForm";
import axios from "axios";


function App() {
  const [editUnit, setEditUnit] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleSaved = () => {
    setEditUnit(null);
    setRefresh(!refresh);
  };

  const handleEdit = (unit) => {
    setEditUnit(unit);
  };

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
    <div>
      <h1>FleetFixr Power Units</h1>
      <PowerUnitForm 
      selectedUnit={editUnit} 
      onSaved={handleSaved} 
      onCancel={() => setEditUnit(null)}
      onUpdate={handleUpdate} />
      <PowerUnitList key={refresh} onEdit={handleEdit} />
      
    </div>
  );
}

export default App;
