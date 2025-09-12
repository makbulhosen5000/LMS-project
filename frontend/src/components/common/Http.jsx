export const apiUrl = "http://127.0.0.1:8000/api";

export const adminToken = () => {

    // This function retrieves the admin token from local storage
    // and returns it for use in API requests.
    const data = JSON.parse(localStorage.getItem("adminInfo"));
    return data?.token;
}
export const userToken = () => {

    // This function retrieves the user token from local storage
    // and returns it for use in API requests.
    const data = JSON.parse(localStorage.getItem("userInfo"));
    return data?.token;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51S4N6QBQLvwWDnauj7x3MxufMh9LfonX5OlA0IWD87zdKsChck8SIAKbD2sveKPILiGMxEJaOmky8K6CTErhq4dI00XTFRAfLY';
