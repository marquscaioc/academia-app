import { toast, useToastStore } from "../stores/useToastStore";

describe("toast store", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });
  afterEach(() => jest.useRealTimers());

  it("shows a toast and auto-dismisses it", () => {
    toast.error("Erro", "Não foi possível salvar.");
    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({ tone: "error", title: "Erro", message: "Não foi possível salvar." }),
    ]);
    jest.advanceTimersByTime(4500);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("keeps at most three toasts, newest last", () => {
    ["a", "b", "c", "d"].forEach((t) => toast.info(t));
    expect(useToastStore.getState().toasts.map((t) => t.title)).toEqual(["b", "c", "d"]);
  });

  it("dismisses on demand", () => {
    toast.success("Salvo");
    const [t] = useToastStore.getState().toasts;
    useToastStore.getState().dismiss(t.id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
