export function chopFloat(value, precision) {
    return Math.round(value*10**precision)/10**precision
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function truncate(str, maxDecimalDigits) {
    if (str.includes('.')) {
        const parts = str.split('.');
        return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
    }
    return str;
}