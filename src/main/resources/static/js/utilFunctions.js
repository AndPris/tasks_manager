export function getDateWithShift(initialTime, shiftInDays) {
    const date = new Date(initialTime);
    date.setDate(date.getDate() + shiftInDays);
    return date;
}