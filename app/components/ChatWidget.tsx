"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";

/* Uses the same design tokens as the rest of the site
   (--bg-2, --border, --border-2, --blue, --text-*, --shadow-glow,
   --r-lg, --r-full, --font-body, --ease-spring) — no new palette. */
const css = `
  .cw-launcher{
    position:fixed;right:clamp(1rem,3vw,1.75rem);bottom:clamp(1rem,3vw,1.75rem);
    z-index:60;width:58px;height:58px;border-radius:var(--r-full);padding:0;overflow:hidden;
    display:flex;align-items:center;justify-content:center;
    background:linear-gradient(180deg,rgba(7,18,40,0.75) 0%,rgba(3,8,19,0.55) 100%);
    border:1px solid var(--border-2);cursor:pointer;color:#fff;
    box-shadow:var(--shadow-md);
    transition:transform .35s var(--ease-spring),box-shadow .35s ease,opacity .25s ease;
  }
  .cw-launcher:hover{transform:translateY(-3px) scale(1.05);box-shadow:var(--shadow-glow)}
  .cw-launcher.hidden{opacity:0;pointer-events:none;transform:scale(.85)}
  .cw-launcher svg{width:24px;height:24px}
  .cw-launcher-icon{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}

  .cw-avatar{
    width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0;
    border:1px solid var(--border-2);
  }

  .cw-panel{
    position:fixed;right:clamp(0.75rem,3vw,1.75rem);bottom:clamp(4.75rem,10vh,6.25rem);
    z-index:60;width:min(370px,92vw);height:min(520px,72vh);
    display:flex;flex-direction:column;overflow:hidden;
    background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-lg);
    box-shadow:var(--shadow-lg);
    opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;
    transition:opacity .28s var(--ease-spring),transform .28s var(--ease-spring);
  }
  .cw-panel.open{opacity:1;transform:none;pointer-events:auto}

  .cw-head{
    display:flex;align-items:center;justify-content:space-between;gap:.5rem;
    padding:.9rem 1.1rem;border-bottom:1px solid var(--border);flex-shrink:0;
  }
  .cw-head-left{display:flex;align-items:center;gap:.65rem}
  .cw-head-title{font-size:.92rem;font-weight:500;color:var(--text-primary)}
  .cw-head-sub{font-size:.72rem;color:var(--text-muted);margin-top:2px}
  .cw-close{width:30px;height:30px;border-radius:var(--r-sm);display:flex;align-items:center;
    justify-content:center;color:var(--text-secondary);transition:background .2s ease,color .2s ease}
  .cw-close:hover{background:var(--surface-2);color:#fff}
  .cw-close svg{width:16px;height:16px}

  .cw-body{flex:1;overflow-y:auto;padding:1rem 1rem .5rem;display:flex;flex-direction:column;gap:.7rem}

  .cw-row{display:flex;gap:.5rem;align-items:flex-end}
  .cw-row.user{justify-content:flex-end}
  .cw-row.bot .cw-avatar{margin-bottom:1px}
  .cw-bubble{
    max-width:84%;padding:.62rem .85rem;border-radius:var(--r-md);
    font-size:.86rem;line-height:1.55;white-space:pre-wrap;word-break:break-word;
  }
  .cw-row.bot .cw-bubble{background:var(--surface);border:1px solid var(--border);color:var(--text-secondary)}
  .cw-row.user .cw-bubble{background:var(--blue);color:#fff}

  .cw-caret{display:inline-block;width:2px;height:1em;background:var(--blue-soft);
    margin-left:2px;vertical-align:text-bottom;animation:cwBlink 1s step-end infinite}
  @keyframes cwBlink{50%{opacity:0}}

  .cw-typing{display:flex;gap:4px;padding:.4rem .2rem}
  .cw-typing span{width:5px;height:5px;border-radius:50%;background:var(--text-muted);
    animation:cwTyping 1.1s ease-in-out infinite}
  .cw-typing span:nth-child(2){animation-delay:.15s}
  .cw-typing span:nth-child(3){animation-delay:.3s}
  @keyframes cwTyping{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)}}

  .cw-inputbar{display:flex;gap:.5rem;padding:.75rem;border-top:1px solid var(--border);flex-shrink:0}
  .cw-input{
    flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);
    padding:.6rem .75rem;color:#fff;font-size:.85rem;font-family:var(--font-body);resize:none;
    max-height:90px;
  }
  .cw-input:focus{outline:none;border-color:var(--border-2)}
  .cw-input::placeholder{color:var(--text-hint)}
  .cw-send{
    width:38px;height:38px;flex-shrink:0;border-radius:var(--r-md);display:flex;align-items:center;
    justify-content:center;background:var(--blue);color:#fff;transition:opacity .2s ease,transform .2s ease;
  }
  .cw-send:disabled{opacity:.4;cursor:not-allowed}
  .cw-send:not(:disabled):hover{transform:translateY(-1px)}
  .cw-send svg{width:16px;height:16px}

  .cw-error{font-size:.76rem;color:#ff8a8a;padding:0 1rem .6rem}
`;

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
  streaming?: boolean;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi, I'm Aniket's assistant 👋 How can I help you today?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [waitingFirstToken, setWaitingFirstToken] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, waitingFirstToken]);

  // Cancel any in-flight stream if the widget unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return; // guards the classic "stuck loading / double request" bug

    setError(null);
    setInput("");

    const history = [...messages, { role: "user" as Role, content: text }];
    setMessages([...history, { role: "assistant", content: "", streaming: true }]);
    setIsStreaming(true);
    setWaitingFirstToken(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Read chunks as they arrive and push each into the last (bot)
      // message — this is what makes it type token-by-token instead
      // of dumping the whole paragraph in at once.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const token = decoder.decode(value, { stream: true });
        if (!token) continue;

        setWaitingFirstToken(false);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + token };
          return next;
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Couldn't reach the assistant — please try again.");
      }
    } finally {
      // Always clear both flags, even on error/abort — this is the
      // fix for the widget getting stuck on a permanent loading state.
      setIsStreaming(false);
      setWaitingFirstToken(false);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.streaming) next[next.length - 1] = { ...last, streaming: false };
        return next;
      });
      abortRef.current = null;
    }
  }, [input, isStreaming, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <button
  type="button"
  aria-label={open ? "Close chat" : "Open chat"}
  className={`cw-launcher${open ? " hidden" : ""}`}
  onClick={() => setOpen(true)}
>
  <IoChatbubblesOutline className="cw-launcher-icon" />
</button>

      <div className={`cw-panel${open ? " open" : ""}`} role="dialog" aria-label="Chat with Aniket's assistant">
       <div className="cw-head">
  <div className="cw-head-left">
    <div className="cw-icon">
      <IoChatbubblesOutline size={18} />
    </div>

    <div>
      <div className="cw-head-title">Aniket's Assistant</div>
      <div className="cw-head-sub">AI Powered</div>
    </div>
  </div>

  <button
    type="button"
    className="cw-close"
    aria-label="Close chat"
    onClick={() => setOpen(false)}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M6 6l12 12M18 6L6 18"
        strokeLinecap="round"
      />
    </svg>
  </button>
</div>

        <div className="cw-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`cw-row ${m.role === "user" ? "user" : "bot"}`}>
              {m.role === "assistant" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/icon.png" alt="" className="cw-avatar" />
              )}
              <div className="cw-bubble">
                {m.content}
                {m.streaming && m.content && <span className="cw-caret" aria-hidden="true" />}
              </div>
            </div>
          ))}
          {waitingFirstToken && (
            <div className="cw-row bot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="" className="cw-avatar" />
              <div className="cw-bubble cw-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {error && <div className="cw-error">{error}</div>}

        <div className="cw-inputbar">
          <textarea
            className="cw-input"
            placeholder="Ask about skills, projects, hiring…"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isStreaming}
          />
          <button
            type="button"
            className="cw-send"
            onClick={send}
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12l16-8-6 8 6 8-16-8z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}