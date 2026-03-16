const SHIPPING_KEY = "pixlocation_shipping";

export function saveShippingData(data: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(data));
}

export function getShippingData() {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(SHIPPING_KEY);
    return data ? JSON.parse(data) : null;
}

export function clearShippingData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SHIPPING_KEY);
}