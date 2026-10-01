package com.sunushop.model.enums;

public enum MovementType {
    RECEPTION("Reception de marchandises"),
    SORTIE("Sortie de stock"),
    AJUSTEMENT("Ajustement de stock"),
    RESERVATION("Reservation pour client"),
    ANNULATION_RESERVATION("Annulation de reservation"),
    TRANSFERT("Transfert entre entrepots"),
    INVENTAIRE("Correction d inventaire");

    private final String label;

    MovementType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
