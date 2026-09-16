"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IoChatbubblesOutline,
  IoClose,
  IoSend,
  IoStop,
  IoRefreshOutline,
  IoArrowDown,
  IoCheckmarkCircle,
  IoBriefcaseOutline,
  IoDownloadOutline,
  IoMailOutline,
} from "react-icons/io5";

const KEYFRAMES = `
  @keyframes cwBlink { 50% { opacity: 0; } }
  @keyframes cwTyping {
    0%, 60%, 100% { opacity: .25; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-2px); }
  }
  @keyframes cwUnread {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.25); opacity: .7; }
  }
  @keyframes cwPop {
    0% { opacity: 0; transform: translateY(4px) scale(.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

const AVATAR_GRADIENT = "linear-gradient(135deg, #286efa, #2d78ff)";
const MAX_TEXTAREA_H = 120;
const REQUEST_TIMEOUT_MS = 30_000;
const SCROLL_NEAR_BOTTOM_PX = 60;

/* ── invisible tag protocol emitted by the model, stripped before display ── */
const TAG_SUGGEST = "<<<SUGGEST>>>";
const TAG_LEAD = "<<<LEAD>>>";
const TAG_CLOSE = "<<<END>>>";

function stripTrailingPartialTag(s: string): string {
  for (const marker of [TAG_SUGGEST, TAG_LEAD]) {
    for (let len = marker.length - 1; len > 0; len--) {
      if (s.endsWith(marker.slice(0, len))) return s.slice(0, s.length - len);
    }
  }
  return s;
}

// What to show WHILE tokens are still streaming in — cuts off at the
// first tag opener so raw markup never flashes on screen.
function liveDisplay(raw: string): string {
  const candidates = [raw.indexOf(TAG_SUGGEST), raw.indexOf(TAG_LEAD)].filter((i) => i !== -1);
  const cut = candidates.length ? raw.slice(0, Math.min(...candidates)) : raw;
  return stripTrailingPartialTag(cut);
}

interface LeadInfo {
  name: string;
  email: string;
  message?: string;
}

// Final pass once the stream has finished — extracts suggestions/lead
// and returns the clean display text.
function parseFinal(raw: string): { display: string; suggestions?: string[]; lead?: LeadInfo } {
  let display = raw;
  let suggestions: string[] | undefined;
  let lead: LeadInfo | undefined;

  const sIdx = display.indexOf(TAG_SUGGEST);
  if (sIdx !== -1) {
    const closeIdx = display.indexOf(TAG_CLOSE, sIdx);
    if (closeIdx !== -1) {
      const body = display.slice(sIdx + TAG_SUGGEST.length, closeIdx);
      suggestions = body.split("||").map((s) => s.trim()).filter(Boolean).slice(0, 4);
      display = display.slice(0, sIdx) + display.slice(closeIdx + TAG_CLOSE.length);
    } else {
      display = display.slice(0, sIdx);
    }
  }

  const lIdx = display.indexOf(TAG_LEAD);
  if (lIdx !== -1) {
    const closeIdx = display.indexOf(TAG_CLOSE, lIdx);
    if (closeIdx !== -1) {
      const body = display.slice(lIdx + TAG_LEAD.length, closeIdx);
      try {
        const parsed = JSON.parse(body);
        if (parsed?.name && parsed?.email) lead = parsed;
      } catch {
        /* malformed — ignore, just strip it */
      }
      display = display.slice(0, lIdx) + display.slice(closeIdx + TAG_CLOSE.length);
    } else {
      display = display.slice(0, lIdx);
    }
  }

  return { display: display.trim(), suggestions, lead };
}

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
  streaming?: boolean;
  suggestions?: string[];
  lead?: LeadInfo;
  leadSubmitted?: boolean;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Hi, I'm Aniket's assistant 👋 Ask me anything about his work, or tell me what you need built.",
};

const STARTER_CHIPS = [
  "What services do you offer?",
  "Show me your tech stack",
  "I want to hire you",
  "How do I reach Aniket?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [waitingFirstToken, setWaitingFirstToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [showJumpDown, setShowJumpDown] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUserMsgRef = useRef<string | null>(null);
  const nearBottomRef = useRef(true);

  const isNearBottom = () => {
    const el = bodyRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_NEAR_BOTTOM_PX;
  };

  const scrollToBottom = useCallback((smooth = true) => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    setShowJumpDown(false);
  }, []);

  const onBodyScroll = () => {
    nearBottomRef.current = isNearBottom();
    if (nearBottomRef.current) setShowJumpDown(false);
  };

  useEffect(() => {
    if (nearBottomRef.current) scrollToBottom(true);
    else if (messages.length > 1) setShowJumpDown(true);
  }, [messages, waitingFirstToken, scrollToBottom]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant" && !last.streaming) setHasUnread(true);
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      nearBottomRef.current = true;
      requestAnimationFrame(() => {
        scrollToBottom(false);
        textareaRef.current?.focus();
      });
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const launcher = document.getElementById("cw-launcher-btn");
        if (launcher?.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_H)}px`;
  };

  const stopStreaming = () => abortRef.current?.abort();

  const submitLead = useCallback(async (lead: LeadInfo, msgIndex: number) => {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch {
      /* best-effort — the visible confirmation already reassures the user */
    } finally {
      setMessages((prev) => {
        const next = [...prev];
        if (next[msgIndex]) next[msgIndex] = { ...next[msgIndex], leadSubmitted: true };
        return next;
      });
    }
  }, []);

  const send = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isStreaming) return;

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError("You look offline — check your connection and try again.");
        return;
      }

      setError(null);
      lastUserMsgRef.current = text;
      if (!overrideText) setInput("");
      requestAnimationFrame(autoResize);

      const history = overrideText ? messages : [...messages, { role: "user" as Role, content: text }];
      setMessages([...history, { role: "assistant", content: "", streaming: true }]);
      setIsStreaming(true);
      setWaitingFirstToken(true);

      const controller = new AbortController();
      abortRef.current = controller;
      timeoutRef.current = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let rawAccum = "";

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let detail = "";
          try {
            detail = await res.text();
          } catch {}
          throw new Error(detail || `Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let gotAnyToken = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const token = decoder.decode(value, { stream: true });
          if (!token) continue;

          gotAnyToken = true;
          rawAccum += token;
          setWaitingFirstToken(false);
          const shown = liveDisplay(rawAccum);
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: shown };
            return next;
          });
        }

        if (!gotAnyToken) throw new Error("The assistant didn't respond — please try again.");

        // Final pass: pull out chips + lead payload, clean the text.
        const { display, suggestions, lead } = parseFinal(rawAccum);
        setMessages((prev) => {
          const next = [...prev];
          const idx = next.length - 1;
          next[idx] = { ...next[idx], content: display, suggestions, lead, streaming: false };
          if (lead) submitLead(lead, idx);
          return next;
        });
      } catch (err) {
        const e = err as Error;
        if (e.name === "AbortError") {
          if (timeoutRef.current !== null) setError("That took too long — please try again.");
        } else {
          setError(e.message || "Couldn't reach the assistant — please try again.");
        }
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && last.streaming && !last.content) next.pop();
          return next;
        });
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
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
    },
    [input, isStreaming, messages, submitLead]
  );

  const retry = () => {
    if (!lastUserMsgRef.current) return;
    setMessages((prev) => {
      const idx = prev.map((m) => m.role).lastIndexOf("user");
      return idx === -1 ? prev : prev.slice(0, idx);
    });
    setError(null);
    send(lastUserMsgRef.current);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showStarterChips = messages.length === 1 && !isStreaming;
  const lastMsg = messages[messages.length - 1];
  const showLatestChips =
    !isStreaming && lastMsg?.role === "assistant" && !!lastMsg.suggestions?.length && !lastMsg.lead;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <button
        id="cw-launcher-btn"
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className={`theme-surface fixed bottom-[clamp(1rem,3vw,1.75rem)] right-[clamp(1rem,3vw,1.75rem)] z-[60] flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/15 bg-white/[.06] text-white backdrop-blur-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/30 hover:bg-white/[.1] hover:shadow-[0_8px_28px_rgba(255,255,255,.15)] ${
          open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
        }`}
      >
        <IoChatbubblesOutline size={24} />
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute right-[6px] top-[6px] h-[9px] w-[9px] rounded-full bg-white [animation:cwUnread_1.4s_ease-in-out_infinite]"
          />
        )}
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with Aniket's assistant"
        className={`theme-surface fixed bottom-[clamp(4.75rem,10vh,6.25rem)] right-[clamp(.75rem,3vw,1.75rem)] z-[60] flex h-[min(600px,74vh)] w-[min(390px,92vw)] flex-col overflow-hidden rounded-[14px] border border-white/[.1] bg-black/90 shadow-[0_24px_60px_rgba(0,0,0,.6)] backdrop-blur-xl transition-all duration-300 ease-out ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-[.97] opacity-0"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-white/[.07] bg-white/[.025] px-4 py-[.7rem]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-[.8rem] font-bold text-white"
              style={{ background: AVATAR_GRADIENT }}
            >
              A
            </div>
            <div>
              <div className="font-body text-[.9rem] font-medium text-white/90">Aniket&apos;s Assistant</div>
              <div className="flex items-center gap-1.5 font-body text-[.68rem] text-white/40">
                <span className="h-[5px] w-[5px] rounded-full bg-[#28c840]" aria-hidden="true" />
                AI Powered
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors duration-200 hover:bg-white/[.08] hover:text-white"
          >
            <IoClose size={17} />
          </button>
        </div>

        <div
          ref={bodyRef}
          onScroll={onBodyScroll}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        >
          {messages.map((m, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div
                    className="mb-[1px] flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-[.62rem] font-bold text-white"
                    style={{ background: AVATAR_GRADIENT }}
                    aria-hidden="true"
                  >
                    A
                  </div>
                )}
                <div
                  className={`max-w-[84%] whitespace-pre-wrap break-words rounded-[10px] px-[.85rem] py-[.6rem] font-body text-[.86rem] leading-[1.55] ${
                    m.role === "user" ? "bg-white text-black" : "border border-white/[.1] bg-white/[.05] text-white/75"
                  }`}
                >
                  {m.content}
                  {m.streaming && m.content && (
                    <span
                      aria-hidden="true"
                      className="ml-[2px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-white/60 [animation:cwBlink_1s_step-end_infinite]"
                    />
                  )}
                </div>
              </div>

              {/* Lead confirmation card */}
              {m.lead && (
                <div className="ml-[34px] flex items-start gap-2 rounded-[10px] border border-emerald-400/25 bg-emerald-400/[.06] px-3 py-2.5 [animation:cwPop_.25s_ease-out]">
                  <IoCheckmarkCircle className="mt-[1px] flex-shrink-0 text-emerald-400" size={16} />
                  <div className="font-body text-[.76rem] leading-[1.5] text-emerald-200/90">
                    <span className="font-medium text-emerald-100">Details sent to Aniket.</span>{" "}
                    {m.leadSubmitted === false ? "Sending…" : `He'll reach out to ${m.lead.email} soon.`}
                  </div>
                </div>
              )}

              {/* Contextual quick-reply chips — only on the most recent assistant message */}
              {i === messages.length - 1 && showLatestChips && (
                <div className="ml-[34px] flex flex-wrap gap-1.5 [animation:cwPop_.25s_ease-out]">
                  {m.suggestions!.map((s, ci) => (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-white/15 bg-white/[.04] px-2.5 py-1 font-body text-[.72rem] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/[.09] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Starter suggestions before the first user message */}
          {showStarterChips && (
            <div className="ml-[34px] flex flex-wrap gap-1.5">
              {STARTER_CHIPS.map((s, ci) => (
                <button
                  key={ci}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-white/15 bg-white/[.04] px-2.5 py-1 font-body text-[.72rem] text-white/70 transition-colors duration-200 hover:border-white/30 hover:bg-white/[.09] hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {waitingFirstToken && (
            <div className="flex items-end gap-2">
              <div
                className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-[.62rem] font-bold text-white"
                style={{ background: AVATAR_GRADIENT }}
                aria-hidden="true"
              >
                A
              </div>
              <div className="flex gap-[4px] rounded-[10px] border border-white/[.1] bg-white/[.05] px-[.85rem] py-[.7rem]">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-[5px] w-[5px] rounded-full bg-white/40 [animation:cwTyping_1.1s_ease-in-out_infinite]"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {showJumpDown && (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-[104px] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3 py-1.5 font-body text-[.7rem] font-medium text-white/80 shadow-[0_8px_20px_rgba(0,0,0,.4)] backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            <IoArrowDown size={12} /> New message
          </button>
        )}

        {error && (
          <div className="flex items-center justify-between gap-2 border-t border-white/[.07] bg-red-500/[.06] px-4 py-2">
            <span className="font-body text-[.75rem] leading-[1.4] text-red-300/90">{error}</span>
            {lastUserMsgRef.current && (
              <button
                type="button"
                onClick={retry}
                className="flex flex-shrink-0 items-center gap-1 rounded-md border border-white/15 px-2 py-1 font-body text-[.7rem] font-medium text-white/70 transition-colors duration-200 hover:border-white/30 hover:text-white"
              >
                <IoRefreshOutline size={12} /> Retry
              </button>
            )}
          </div>
        )}

        {/* Static quick actions — real links, always available regardless of AI */}
        <div className="flex flex-shrink-0 items-center gap-1.5 border-t border-white/[.07] px-3 pt-2">
          <a
            href="#projects"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 font-body text-[.68rem] text-white/50 transition-colors duration-200 hover:border-white/25 hover:text-white/85"
          >
            <IoBriefcaseOutline size={11} /> Work
          </a>
          <a
            href="/cv.pdf"
            download
            className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 font-body text-[.68rem] text-white/50 transition-colors duration-200 hover:border-white/25 hover:text-white/85"
          >
            <IoDownloadOutline size={11} /> CV
          </a>
          <a
            href="mailto:hello@aniketwebdev.in"
            className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 font-body text-[.68rem] text-white/50 transition-colors duration-200 hover:border-white/25 hover:text-white/85"
          >
            <IoMailOutline size={11} /> Email
          </a>
        </div>

        <div className="flex flex-shrink-0 items-end gap-2 px-3 pb-3 pt-2">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask about skills, projects, hiring…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={onKeyDown}
            disabled={isStreaming}
            className="max-h-[120px] flex-1 resize-none rounded-xl border border-white/[.1] bg-white/[.03] px-3 py-[.6rem] font-body text-[.85rem] text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-white/25 disabled:opacity-60"
          />
          <button
            type="button"
            aria-label={isStreaming ? "Stop response" : "Send message"}
            onClick={isStreaming ? stopStreaming : () => send()}
            disabled={!isStreaming && !input.trim()}
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,.25)] disabled:pointer-events-none disabled:opacity-30"
          >
            {isStreaming ? <IoStop size={15} /> : <IoSend size={14} />}
          </button>
        </div>
      </div>
    </>
  );
}