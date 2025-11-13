import React, { useEffect, useState } from "react";
import axios from "axios";

function PowerUnitList({ onEdit }) {
    const [powerUnits, setPowerUnits] = useState([]);

    const fetchPowerUnits = () => {
        axios.get("http://localhost:8080/api/powerunits")
            .then(res => setPowerUnits(res.data))
            .catch(err => console.error("Error fetching power units:", err));
    };

    useEffect(() => {
        fetchPowerUnits();
    }, []);

    const deleteUnit = (id) => {
        axios.delete(`http://localhost:8080/api/powerunits/${id}`)
            .then(() => fetchPowerUnits())
            .catch(err => console.error("Error deleting power unit:", err));
    };

    

    return (
    <div>
      <h2>Power Units</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>VIN</th><th>Make</th><th>Year</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {powerUnits.map(pu => (
            <tr key={pu.id}>
              <td>{pu.id}</td>
              <td>{pu.vin}</td>
              <td>{pu.make}</td>
              <td>{pu.year}</td>
              <td>{pu.status}</td>
              <td>
                <button onClick={() => onEdit(pu)}>Edit</button>
                <button onClick={() => deleteUnit(pu.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PowerUnitList;