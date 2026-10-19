// Pemindahan setProgress dari Loading.tsx: file komponen hanya boleh
// mengekspor komponen agar fast-refresh tidak dimatikan (react-refresh
// only-export-components). Isi fungsi tetap persis seperti semula —
// Scene.tsx memakainya untuk meneruskan progres pemuatan model 3D ke
// loading curtain.
export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    // Stop the interval without forcing the counter to 100: callers use
    // this on unmount, where pushing more state would be pointless.
    clearInterval(interval);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
