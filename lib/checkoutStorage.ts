import { ShippingData } from "@/types/checkout";

const SHIPPING_KEY = "pixlocation_shipping";

export function saveShippingData(data: ShippingData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(data));
}

export function getShippingData(): ShippingData | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(SHIPPING_KEY);
        return raw ? (JSON.parse(raw) as ShippingData) : null;
    } catch {
        return null;
    }
}

export function clearShippingData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SHIPPING_KEY);
}
