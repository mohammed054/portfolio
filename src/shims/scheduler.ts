type SchedulerCallback = (options: {
  didTimeout: boolean;
  timeRemaining: () => number;
}) => unknown;

type SchedulerHandle = {
  id: number;
};

const unstable_ImmediatePriority = 1;
const unstable_UserBlockingPriority = 2;
const unstable_NormalPriority = 3;
const unstable_LowPriority = 4;
const unstable_IdlePriority = 5;
const unstable_Profiling = null;

const unstable_now = () =>
  typeof performance !== 'undefined' ? performance.now() : Date.now();

const unstable_scheduleCallback = (
  _priority: number,
  callback: SchedulerCallback,
): SchedulerHandle => {
  const id = window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Infinity,
    });
  }, 0);

  return { id };
};

const unstable_cancelCallback = (handle?: SchedulerHandle | null) => {
  if (handle) {
    window.clearTimeout(handle.id);
  }
};

const unstable_shouldYield = () => false;
const unstable_requestPaint = () => {};
const unstable_forceFrameRate = () => {};
const unstable_getCurrentPriorityLevel = () => unstable_NormalPriority;
const unstable_runWithPriority = <T,>(_: number, callback: () => T) => callback();
const unstable_next = <T,>(callback: () => T) => callback();
const unstable_wrapCallback = <T extends (...args: never[]) => unknown>(callback: T) =>
  callback;

const scheduler = {
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_LowPriority,
  unstable_NormalPriority,
  unstable_Profiling,
  unstable_UserBlockingPriority,
  unstable_cancelCallback,
  unstable_forceFrameRate,
  unstable_getCurrentPriorityLevel,
  unstable_next,
  unstable_now,
  unstable_requestPaint,
  unstable_runWithPriority,
  unstable_scheduleCallback,
  unstable_shouldYield,
  unstable_wrapCallback,
};

export {
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_LowPriority,
  unstable_NormalPriority,
  unstable_Profiling,
  unstable_UserBlockingPriority,
  unstable_cancelCallback,
  unstable_forceFrameRate,
  unstable_getCurrentPriorityLevel,
  unstable_next,
  unstable_now,
  unstable_requestPaint,
  unstable_runWithPriority,
  unstable_scheduleCallback,
  unstable_shouldYield,
  unstable_wrapCallback,
};

export default scheduler;
