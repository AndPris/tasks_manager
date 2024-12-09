export function getDateWithShift(initialTime, shiftInDays) {
    const date = new Date(initialTime);
    date.setDate(date.getDate() + shiftInDays);
    return date;
}

export function getColorByPriority(priority) {
    let color;
    switch (priority.name.toLowerCase()) {
        case 'high':
            color = 'red';
            break;
        case 'medium':
            color = 'blue'
            break;
        case 'low':
            color = 'green';
            break;
        default:
            color = 'yellow';
    }
    return color;
}