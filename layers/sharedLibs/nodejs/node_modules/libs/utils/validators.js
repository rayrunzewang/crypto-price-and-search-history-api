const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isValidSymbol = (symbol) => {
    return typeof symbol === 'string' && symbol.length > 1;
};

export { isValidEmail, isValidSymbol };
