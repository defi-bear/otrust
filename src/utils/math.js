export function chopFloat(value, precision) {
    return Math.round(value*10**precision)/10**precision
}