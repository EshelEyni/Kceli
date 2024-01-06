let intervalId: number | undefined;

self.addEventListener("message", function (e) {
  const { action, interval } = e.data;

  if (action === "start") {
    intervalId = setInterval(() => {
      self.postMessage("tick");
    }, interval) as unknown as number;
  } else if (action === "stop") {
    clearInterval(intervalId);
  }
});
