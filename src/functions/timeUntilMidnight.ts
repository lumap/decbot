export function timeUntilMidnight(): string {
    let midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    const totalMinutes = (midnight.getTime() - new Date().getTime()) / 1000 / 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? "${hours} hours and " : ""}${minutes} minutes`
}