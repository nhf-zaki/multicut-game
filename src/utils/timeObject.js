function getTimeObj(timeMillis) {
  let ms = ('0' + ((timeMillis / 10) % 100)).slice(-2);
  let seconds = ('0' + Math.floor((timeMillis / 1000) % 60)).slice(-2);
  let minutes = ('0' + Math.floor((timeMillis / 60000) % 60)).slice(-2);

  const timeObj = {
    minutes: minutes,
    seconds: seconds,
    millis: ms,
  };

  return timeObj;
}

export default getTimeObj;
