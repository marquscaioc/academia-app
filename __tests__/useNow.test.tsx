import React from "react";
import { useNow } from "../lib/hooks/useNow";

const { act, create } = require("react-test-renderer");

it("uses the current clock on the first render after a timer restarts", async () => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers({ now: 10_000 });
  const observed: number[] = [];
  function Probe({ active }: { active: boolean }) { observed.push(useNow(active, 250)); return null; }
  let renderer: ReturnType<typeof create>;
  try {
    await act(async () => { renderer = create(<Probe active={false} />); });
    jest.setSystemTime(12_000);
    observed.length = 0;
    await act(async () => { renderer.update(<Probe active />); });
    expect(observed[0]).toBe(12_000);
  } finally {
    await act(async () => { renderer?.unmount(); });
    jest.useRealTimers();
  }
});
