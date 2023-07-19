
const monthNames = ['unknown', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dateTimeRegex = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}:\\d{2}).+$", '');
const trimSlashRegEx = new RegExp("[/]+$", 'g');

const doubleDigit = (digit: number) => {
    return (digit < 10) ? '0' + digit : digit;
};

export const getDateTimeNow = () => {
    var now = new Date();
    var year = now.getFullYear();
    var month = doubleDigit(now.getMonth() + 1); //indexed from 0-11 =)
    var day = doubleDigit(now.getDate());
    var hours = doubleDigit(now.getHours());
    var mins = doubleDigit(now.getMinutes());
    var secs = doubleDigit(now.getSeconds());
    var tz = doubleDigit(-now.getTimezoneOffset() / 60); //offset in negative minutes

    return year + '-' + month + '-' + day + 'T' + hours + ':' + mins + ':' + secs + '+' + tz + ':00';
};

export const getMonthName = (monthIndex: string) => {
    return monthNames[Number(monthIndex) + 1];
}

export const getDayName = (dateTime: Date) => {
    return dayNames[dateTime.getDay()];
}

export const prettyDate = (dateTime: string) => {
    var parsedDateTime = dateTimeRegex.exec(dateTime) || [2000, 1, 1, "12:00"];

    var year = parsedDateTime[1];
    var month = Number(parsedDateTime[2]);
    var day = Number(parsedDateTime[3]);
    var time = parsedDateTime[4];

    return monthNames[month] + " " + day + ", " + year + " at " + time;
};

export const dbPath = "http://host.containers.internal:5984/";
