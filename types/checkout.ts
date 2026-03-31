export interface ShippingData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CheckoutItemPayload {
    productId: string;
    quantity: number;
}

export interface CheckoutRequestBody {
    items: CheckoutItemPayload[];
    shippingData?: ShippingData;
}