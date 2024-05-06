export const getActualDate = () => {
    const dateObj = new Date();
    const actualDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    return actualDate;
}

export const getActualTime = () => {
    const dateObj = new Date();
    const actualTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
    return actualTime;
}