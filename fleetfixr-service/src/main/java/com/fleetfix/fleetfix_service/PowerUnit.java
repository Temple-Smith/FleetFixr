package com.fleetfix.fleetfix_service;

import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
@Table(name = "POWERUNIT")

public class PowerUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer odometer; //kilometers because we're Canadian over here, K?
    private Integer year;
    private String status;
    private String zone;
    private String vin;
    private String make;
    private LocalDate cvip;
    private Double maxWeight;
    private String fuelType;
    private String plate;

    //GETTERS AND SETTERS
    public Long getId() {return id;}
    public void setId(Long id) {this.id =id;}

    public Integer getOdometer() {return odometer;}
    public void setOdometer(Integer odometer) {this.odometer = odometer;}

    public Integer getYear() {return year;}
    public void setYear(Integer year) {this.year = year;}

    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}

    public String getZone() {return zone;}
    public void setZone(String zone) {this.zone = zone;}

    public String getVin() {return vin;}
    public void setVin(String vin) {this.vin = vin;}

    public String getMake() {return make;}
    public void setMake(String make) {this.make = make;}

    public LocalDate getCvip() {return cvip;}
    public void setCvip(LocalDate cvip) {this.cvip = cvip;}

    public Double getMaxWeight() {return maxWeight;}
    public void setMaxWeight(Double maxWeight) {this.maxWeight = maxWeight;}

    public String getFuelType() {return fuelType;}
    public void setFuelType(String fuelType) {this.fuelType = fuelType;}

    public String getPlate() {return plate;}
    public void setPlate(String plate) {this.plate = plate;}

}
