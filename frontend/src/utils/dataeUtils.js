export const isToday = (date) =>{
    const today = new Date();
    const d = new Date(date);
    return today.toDateString() === d.toDateString();

}

export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const d = new Date(date);
    return yesterday.toDateString() === d.toDateString();
    
}