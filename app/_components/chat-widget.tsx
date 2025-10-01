'use client';

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Home, Loader2, MapPin, MessageSquare, Send, X} from "lucide-react";
import {fmtPrice, getOrCreateSessionId} from "@/services/chat/helpers";
import {ChatHistoryResponse, ChatMessage, ChatPostResponse, PropertyCard} from "@/services/chat/types";

export default function ChatWidget({
                                       apiBase,
                                       title = "Aura Assistant",
                                       subtitle = "ИИ-помощник от Aura Online"
                                   }: {
    apiBase: string;
    title?: string;
    brandUrl?: string;
    subtitle?: string;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState<string>("");
    const listRef = useRef<HTMLDivElement>(null);

    // create/persist session id
    useEffect(() => {
        setSessionId(getOrCreateSessionId());
    }, []);

    // load history on open
    useEffect(() => {
        const load = async () => {
            if (!open || !sessionId) return;
            try {
                const res = await fetch(`${apiBase}/chat/history?session_id=${encodeURIComponent(sessionId)}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                });
                if (!res.ok) throw new Error(await res.text());
                const json: ChatHistoryResponse = await res.json();

                // Без any: аккуратно приводим тип items
                const mapped: ChatMessage[] = (json.messages || []).map((m) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content ?? "",
                    items: Array.isArray((m as {items?: unknown}).items)
                        ? ((m as {items?: PropertyCard[]}).items as PropertyCard[])
                        : null,
                    created_at: m.created_at,
                }));

                setMessages(mapped);
                // scroll down after history loaded
                setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "auto" }), 50);
            } catch (e) {
                console.error("load history failed", e);
            }
        };
        load();
    }, [open, sessionId, apiBase]);

    // auto-scroll on new msg
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const send = async () => {
        const text = input.trim();
        if (!text || !sessionId) return;
        setInput("");

        const localUserMsg: ChatMessage = { role: "user", content: text, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, localUserMsg]);
        setLoading(true);

        try {
            const res = await fetch(`${apiBase}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ message: text, session_id: sessionId }),
            });
            const json: ChatPostResponse = await res.json();

            const assistantMsg: ChatMessage = {
                role: "assistant",
                content: json.answer ?? "",
                items: Array.isArray(json.items) ? json.items : [],
                created_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (e) {
            console.error(e);
            const err: ChatMessage = { role: "assistant", content: "Упс… не удалось получить ответ. Попробуйте ещё раз.", created_at: new Date().toISOString() };
            setMessages(prev => [...prev, err]);
        } finally {
            setLoading(false);
        }
    };

    const PropertyCardView = ({ it }: { it: PropertyCard }) => (
        <a href={it.url} target="_blank" rel="noreferrer" className="block rounded-xl p-3 hover:shadow-md transition bg-white">
            <div className="flex gap-3 items-start">
                <div className="relative w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {it.image ? (
                        <Image alt={it.title} src={it.image} fill className="object-cover" sizes="64px" />
                    ) : (
                        <Home className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{fmtPrice(it.price, it.currency)}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{it.city || it.district || it.address || "Город не указан"}</span>
                    </div>
                    {typeof it.type === 'object' && it.type?.name && (
                        <div className="text-xs text-gray-500 mt-1">Тип: {it.type.name}</div>
                    )}
                </div>
            </div>
        </a>
    );

    const Bubble = ({ m }: { m: ChatMessage }) => {
        const isUser = m.role === "user";
        const isAssistant = m.role === "assistant";
        return (
            <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow ${isUser ? "bg-blue-600 text-white" : "bg-white text-gray-900"}`}>
                    {m.content && <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.content}</div>}
                    {isAssistant && Array.isArray(m.items) && m.items.length > 0 && (
                        <div className="mt-3 grid gap-3">
                            {m.items.map((it) => (
                                <PropertyCardView key={it.id} it={it} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Floating button with waves */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-40 group"
                aria-label="Открыть чат Aura Assistant"
            >
                {/* waves */}
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/30 blur-md animate-ping" />
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/20 blur-md animate-pulse" />
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/10" />
                {/* button core */}
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-3 shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          <MessageSquare className="w-5 h-5" />
          <span className="whitespace-nowrap">Подобрать недвижимость</span>
        </span>
            </button>

            {/* Backdrop */}
            {open && (
                <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />
            )}

            {/* Chat window */}
            <div className={`fixed z-50 bottom-24 right-6 w-[92vw] max-w-md rounded-2xl bg-gray-50 shadow-xl overflow-hidden ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} transition`}>
                {/* Header */}
                <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-5 h-5">
                            <Image src="/favicon.ico" alt="Aura" fill sizes="20px" className="object-contain" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold leading-tight truncate">{title}</div>
                            <div className="text-[11px] text-gray-500 leading-tight truncate">{subtitle}</div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100 ml-2">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Messages list */}
                <div ref={listRef} className="h-[58vh] overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 && (
                        <div className="text-center text-sm text-gray-500 mt-6">
                            Привет! Я помогу найти квартиру, дом или офис на Aura.tj.
                        </div>
                    )}
                    {messages.map((m, idx) => (
                        <Bubble key={(m as {id?: string | number}).id ?? idx} m={m} />
                    ))}
                    {loading && (
                        <div className="w-full flex justify-start">
                            <div className="bg-white rounded-2xl px-4 py-3 shadow text-gray-600 text-sm inline-flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Идёт поиск по Aura Estate…
                            </div>
                        </div>
                    )}
                </div>

                {/* Composer */}
                <div className="bg-white drop-shadow-[0_-2px_4px_rgba(0,0,0,0.06)] p-2">
                    <div className="flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                            placeholder="Опишите запрос: город, комнаты, бюджет…"
                            className="flex-1 rounded-xl px-3 py-2 border-gray-300 border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <button onClick={send} disabled={loading || !input.trim()} className="rounded-xl bg-blue-600 text-white px-3 py-2 disabled:opacity-50 hover:bg-blue-700">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}