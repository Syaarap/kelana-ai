"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const API_URL = "http://127.0.0.1:8000";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Ambil riwayat chat saat halaman dibuka
  useEffect(() => {
    fetchHistory();
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  async function fetchHistory() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/v1/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil riwayat chat");
      }

      const data = await response.json();

      const history: Message[] = data.map(
        (message: {
          id: number;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        }) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          createdAt: message.created_at,
        })
      );

      setMessages(history);
    } catch (error) {
      console.error(error);
    }
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleSend() {
    const text = input.trim();

    if (!text || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim pesan");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message,
        createdAt: data.created_at,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat menghubungi KelanaAI.",
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [...previous, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            KelanaAI
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Travel Planning Conversation
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Diskusi perjalanan bersama KelanaAI
          </p>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400">
              Belum ada percakapan. Mulai chat dengan KelanaAI!
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-900"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>

                <p
                  className={`mt-2 text-xs ${
                    message.role === "user"
                      ? "text-blue-100"
                      : "text-slate-400"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-500">
                    KelanaAI sedang mengetik
                  </span>

                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:150ms]">
                    .
                  </span>
                  <span className="animate-bounce [animation-delay:300ms]">
                    .
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </section>

      <footer className="border-t bg-white px-4 py-4">
        <div className="mx-auto flex max-w-4xl gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan..."
            rows={1}
            disabled={isTyping}
            className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Kirim
          </button>
        </div>

        <p className="mx-auto mt-2 max-w-4xl text-xs text-slate-400">
          Tekan Enter untuk mengirim • Shift + Enter untuk baris baru
        </p>
      </footer>
    </main>
  );
}