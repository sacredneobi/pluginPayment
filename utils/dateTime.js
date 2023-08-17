const fix = (value) => {
  return String(value).padStart(2, "0");
};

const getDateTime = (value, separator = " ") => {
  const dataValue = new Date(value);
  try {
    const data = fix(dataValue.getDate());
    const month = fix(dataValue.getMonth() + 1);
    const year = fix(dataValue.getFullYear());

    const hour = fix(dataValue.getHours());
    const minute = fix(dataValue.getMinutes());
    const second = fix(dataValue.getSeconds());

    return `${data}.${month}.${year}${separator}${hour}:${minute}:${second}`;
  } catch (err) {
    console.error("GET DATE", err);
    return `00.00.0000${separator}00:00:00`;
  }
};

module.exports = { getDateTime };
