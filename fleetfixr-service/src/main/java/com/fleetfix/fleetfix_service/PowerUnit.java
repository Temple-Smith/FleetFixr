package com.fleetfix.fleetfix_service;

import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
@Table(name = "POWERUNIT")

public class PowerUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Lob
    @Column(name = "cvipPdf", columnDefinition = "MEDIUMBLOB")
    private byte[] cvipPdf;
    private Integer odometer; //kilometers because we're Canadian over here, K?
    private Integer year;
    private String status;
    private String zone;
    @Column(unique = true, nullable = false)
    private String vin;
    private String make;
    private LocalDate cvipExpiry;
    private String cvipPath;
    private Double maxWeight;
    private String fuelType;
    private String plate;

    //GETTERS AND SETTERS
    public byte[] getCvipPdf() {return cvipPdf;}
    public void setCvipPdf(byte[] cvipPdf) {this.cvipPdf = cvipPdf;}

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

    public LocalDate getCvipExpiry() {return cvipExpiry;}
    public void setCvipExpiry(LocalDate cvipExpiry) {this.cvipExpiry = cvipExpiry;}

    public String getCvipPath() {return cvipPath;}
    public void setCvipPath(String cvipPath) {this.cvipPath = cvipPath;}

    public Double getMaxWeight() {return maxWeight;}
    public void setMaxWeight(Double maxWeight) {this.maxWeight = maxWeight;}

    public String getFuelType() {return fuelType;}
    public void setFuelType(String fuelType) {this.fuelType = fuelType;}

    public String getPlate() {return plate;}
    public void setPlate(String plate) {this.plate = plate;}

}
