import React, { useState, useEffect } from "react";
import axios from "axios";

function PowerUnitForm({ selectedUnit, onSaved, onCancel }) {
  const [unit, setUnit] = useState({
    vin: "", make: "", year: "", status: ""
  });

  useEffect(() => {
    if (selectedUnit) {
        setUnit(selectedUnit);
    } else {
        setUnit({ vin: "", make: "", year: "", status: "" });
    }
  }, [selectedUnit]);

  const handleChange = (e) => {
    setUnit({ ...unit, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (unit.id) {
      // Update
      axios.put(`http://localhost:8080/api/powerunits/${unit.id}`, unit)
        .then(() => onSaved())
        .catch(err => console.error(err));
    } else {
      // Create
      axios.post("http://localhost:8080/api/powerunits", unit)
        .then(() => onSaved())
        .catch(err => console.error(err));
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input name="vin" placeholder="VIN" value={unit.vin} onChange={handleChange} />
      <input name="make" placeholder="Make" value={unit.make} onChange={handleChange} />
      <input name="year" placeholder="Year" value={unit.year} onChange={handleChange} />
      <input name="status" placeholder="Status" value={unit.status} onChange={handleChange} />
      <button type="submit">{unit.id ? "Update" : "Create"}</button>
      {unit.id && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default PowerUnitForm;
