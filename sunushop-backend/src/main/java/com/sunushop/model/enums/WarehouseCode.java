package com.sunushop.model.enums;

public enum WarehouseCode {
    DAK("Dakar", "Senegal"),
    CAS("Casablanca", "Maroc"),
    ABI("Abidjan", "Cote d Ivoire");

    private final String city;
    private final String country;

    WarehouseCode(String city, String country) {
        this.city = city;
        this.country = country;
    }

    public String getCity() { return city; }
    public String getCountry() { return country; }
}
