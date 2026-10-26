import React from "react";
import { CommentThread } from "../components/social/CommentThread";

const { act, create } = require("react-test-renderer");
let renderer: ReturnType<typeof create>;
beforeEach(() => { (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });
afterEach(async () => { await act(async () => { renderer?.unmount(); }); });

it("preserves the comment on a rejected send and clears it only after a successful retry", async () => {
  const send = jest.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ id: "saved" });
  await act(async () => { renderer = create(<CommentThread comments={[]} postId="p" currentUserId="u" onReply={send} />); });
  const input = () => renderer.root.findAllByProps({ accessibilityLabel: "Novo comentário" })[0];
  const button = () => renderer.root.findAllByProps({ accessibilityLabel: "Enviar comentário" })[0];
  await act(async () => { input().props.onChangeText("Meu comentário"); });
  await act(async () => { await button().props.onPress(); });
  expect(input().props.value).toBe("Meu comentário");
  await act(async () => { await button().props.onPress(); });
  expect(input().props.value).toBe("");
  expect(send.mock.calls).toEqual([["Meu comentário", undefined], ["Meu comentário", undefined]]);
});

it("does not send a second request while the first is unresolved", async () => {
  let resolve!: () => void;
  const send = jest.fn(() => new Promise<void>((done) => { resolve = done; }));
  await act(async () => { renderer = create(<CommentThread comments={[]} postId="p" currentUserId="u" onReply={send} />); });
  await act(async () => { renderer.root.findAllByProps({ accessibilityLabel: "Novo comentário" })[0].props.onChangeText("Oi"); });
  const onPress = renderer.root.findAllByProps({ accessibilityLabel: "Enviar comentário" })[0].props.onPress;
  await act(async () => { void onPress(); void onPress(); });
  expect(send).toHaveBeenCalledTimes(1);
  await act(async () => { resolve(); });
});
