import { ShippingData } from "@/types/checkout";

const SHIPPING_KEY = "pixlocation_shipping";

export function saveShippingData(data: ShippingData) {
    if (typeof window === "undefined") return;
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(data));
}

export function getShippingData(): ShippingData | null {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(SHIPPING_KEY);
    return data ? (JSON.parse(data) as ShippingData) : null;
}

export function clearShippingData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SHIPPING_KEY);
}