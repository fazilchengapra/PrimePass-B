const isValidDate = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = Date.now();

  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    return [false, "Invalid date"];
  if (start >= end) return [false, "Start time must be before end time"];
  if (now >= start) return [false, "Date must be in the future"];

  return [true, null];
};

module.exports = isValidDate