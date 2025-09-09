export const getLastThreeMonths = ({date}) => {
    const months = [];
    const now = date || new Date();
    for (let i = 0; i < 3; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(month);
    }
    return months;
};

export const sameYearMonth = (dateStr, year, month) => {
    const date = new Date(dateStr);
    return date.getFullYear() === year && (date.getMonth() + 1) === month;
};