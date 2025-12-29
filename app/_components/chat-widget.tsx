'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {Home, Loader2, MapPin, MessageSquareText, Send, X} from 'lucide-react';
import {fmtPrice, getOrCreateSessionId} from '@/services/chat/helpers';
import {ChatHistoryResponse, ChatMessage, ChatPostResponse, PropertyCard} from '@/services/chat/types';
import {usePathname} from "next/navigation";

type Props = {
    apiBase: string;
    title?: string;
    subtitle?: string;
};

const SCROLL_DELTA = 8;
const SHOW_TOP_OFFSET = 48;

export default function ChatWidget({
                                       apiBase,
                                       title = 'Чат с поддержкой',
                                       subtitle = 'На связи 24/7',
                                   }: Props) {
    const [open, setOpen] = useState(false);

    // ---- печаталка: одна фраза за загрузку страницы ----
    const buttonPhrases = [
        'Поможем с выбором…',
        'Мы онлайн',
        'Подберём за минуту',
        'Есть вопросы по квартире?',
    ];
    const TYPE_SPEED = 65;
    const LS_PHRASE_IDX = 'aura_chat_btn_phrase_idx';
    const pathname = usePathname();

    const [hidden, setHidden] = useState(false);
    const lastYRef = useRef(0);


    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || 0;
            const diff = y - lastYRef.current;
            if (y <= SHOW_TOP_OFFSET) setHidden(false);
            else if (diff > SCROLL_DELTA) setHidden(true);
            else if (diff < -SCROLL_DELTA) setHidden(false);
            lastYRef.current = y;
        };
        lastYRef.current = window.scrollY || 0;
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setHidden(false);
    }, [pathname]);

    // const HIDE_DELTA = 20;       // чувствительность скрытия при прокрутке вниз
    // const SHOW_DELTA = -12;      // чувствительность показа при прокрутке вверх (гистерезис)
    // const SHOW_TOP_OFFSET = 48;  // показываем возле верха страницы
    // const UNHIDE_AFTER_IDLE = 150; // мс после остановки скролла показываем FAB
    //
    // // const [fabHidden, setFabHidden] = useState(false);
    // const lastYRef = useRef(0);

    const [phrase, setPhrase] = useState<string>(buttonPhrases[0]);
    const [typed, setTyped] = useState<string>('');

    // useEffect(() => {
    //     let rafId: number | null = null;
    //     let idleTimer: number | null = null;
    //
    //     const onScroll = () => {
    //         const y = window.scrollY || 0;
    //         const diff = y - lastYRef.current;
    //
    //         if (rafId) cancelAnimationFrame(rafId);
    //         rafId = requestAnimationFrame(() => {
    //             if (y <= SHOW_TOP_OFFSET) {
    //                 setFabHidden(false);
    //             } else if (diff > HIDE_DELTA) {
    //                 // активное движение вниз — спрятать
    //                 setFabHidden(true);
    //             } else if (diff < SHOW_DELTA) {
    //                 // движение вверх — показать
    //                 setFabHidden(false);
    //             }
    //             lastYRef.current = y;
    //
    //             // после остановки прокрутки — через небольшую паузу показать
    //             if (idleTimer) clearTimeout(idleTimer);
    //             idleTimer = window.setTimeout(() => setFabHidden(false), UNHIDE_AFTER_IDLE);
    //         });
    //     };
    //
    //     lastYRef.current = window.scrollY || 0;
    //     window.addEventListener('scroll', onScroll, { passive: true });
    //
    //     return () => {
    //         window.removeEventListener('scroll', onScroll);
    //         if (rafId) cancelAnimationFrame(rafId);
    //         if (idleTimer) clearTimeout(idleTimer);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (open) setFabHidden(false);
    // }, [open]);

    // выбираем случайную фразу (не равную прошлой, если возможно)
    useEffect(() => {
        let idx = Math.floor(Math.random() * buttonPhrases.length);

        if (typeof window !== 'undefined') {
            const lastIdxRaw = localStorage.getItem(LS_PHRASE_IDX);
            const lastIdx = lastIdxRaw != null ? parseInt(lastIdxRaw, 10) : NaN;
            if (!Number.isNaN(lastIdx) && buttonPhrases.length > 1) {
                // избегаем повтора прошлой фразы
                if (idx === lastIdx) {
                    idx = (idx + 1) % buttonPhrases.length;
                }
            }
            localStorage.setItem(LS_PHRASE_IDX, String(idx));
        }

        setPhrase(buttonPhrases[idx]);
        setTyped(''); // сброс печати на старте
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // когда окно открыто — сразу показываем полную фразу, без анимации
    useEffect(() => {
        if (open) setTyped(phrase);
    }, [open, phrase]);

    // печать одной фразы без удаления и циклов
    useEffect(() => {
        if (open) return; // анимацию не крутим при открытом чате
        if (typed.length >= phrase.length) return;

        const timer = window.setTimeout(() => {
            setTyped(phrase.slice(0, typed.length + 1));
        }, TYPE_SPEED);

        return () => window.clearTimeout(timer);
    }, [typed, phrase, open]);

    // ---- состояние чата ----
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string>('');
    const listRef = useRef<HTMLDivElement>(null);

    // фразы ожидания
    const loadingPhrases = [
        'Думаю над ответом…',
        'Подбираю лучшие варианты…',
        'Сверяю детали, секунду…',
        'Формулирую рекомендацию…',
        'Проверяю информацию…',
    ];
    const [loadingPhrase, setLoadingPhrase] = useState<string>(loadingPhrases[0]);

    useEffect(() => {
        setSessionId(getOrCreateSessionId());
    }, []);

    // история при открытии
    useEffect(() => {
        const load = async () => {
            if (!open || !sessionId) return;
            try {
                const res = await fetch(`${apiBase}/chat/history?session_id=${encodeURIComponent(sessionId)}`, {
                    method: 'GET',
                    headers: {Accept: 'application/json'},
                });
                if (!res.ok) throw new Error(await res.text());
                const json: ChatHistoryResponse = await res.json();

                const mapped: ChatMessage[] = (json.messages ?? []).map((m) => {
                    const srcItems = (m as { items?: unknown }).items;
                    const items: PropertyCard[] | null = Array.isArray(srcItems) ? (srcItems as PropertyCard[]) : null;
                    return {
                        id: m.id,
                        role: m.role,
                        content: m.content ?? '',
                        items,
                        created_at: m.created_at,
                    };
                });

                setMessages(mapped);
                setTimeout(() => listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: 'auto'}), 50);
            } catch (e) {
                console.error('load history failed', e);
            }
        };
        load();
    }, [open, sessionId, apiBase]);

    // автоскролл вниз
    useEffect(() => {
        listRef.current?.scrollTo({top: listRef.current.scrollHeight, behavior: 'smooth'});
    }, [messages]);

    // «живая» фраза при ожидании
    useEffect(() => {
        if (loading) {
            setLoadingPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const send = async () => {
        const text = input.trim();
        if (!text || !sessionId) return;
        setInput('');

        const localUserMsg: ChatMessage = {role: 'user', content: text, created_at: new Date().toISOString()};
        setMessages((prev) => [...prev, localUserMsg]);
        setLoading(true);

        try {
            const res = await fetch(`${apiBase}/chat`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
                body: JSON.stringify({message: text, session_id: sessionId}),
            });

            const json: ChatPostResponse = await res.json();

            const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: json.answer ?? '',
                items: Array.isArray(json.items) ? (json.items as PropertyCard[]) : [],
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (e) {
            console.error(e);
            const err: ChatMessage = {
                role: 'assistant',
                content: 'Что-то пошло не так. Давайте попробуем ещё раз.',
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, err]);
        } finally {
            setLoading(false);
        }
    };

    const PropertyCardView = ({it}: { it: PropertyCard }) => (
        <a href={it.url} target="_blank" rel="noreferrer"
           className="block rounded-xl p-3 hover:shadow-md transition bg-white">
            <div className="flex gap-3 items-start">
                <div
                    className="relative w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {it.image ? (
                        <Image alt={it.title} src={it.image} fill className="object-cover" sizes="64px"/>
                    ) : (
                        <Home className="w-5 h-5 text-gray-400"/>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{fmtPrice(it.price, it.currency)}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5"/>
                        <span className="truncate">{it.city || it.district || it.address || 'Город не указан'}</span>
                    </div>
                    {typeof it.type === 'object' && it.type?.name && (
                        <div className="text-xs text-gray-500 mt-1">Тип: {it.type.name}</div>
                    )}
                </div>
            </div>
        </a>
    );

    const Bubble = ({m}: { m: ChatMessage }) => {
        const isUser = m.role === 'user';
        const isAssistant = m.role === 'assistant';
        return (
            <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}>
                    {m.content && <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.content}</div>}
                    {isAssistant && Array.isArray(m.items) && m.items.length > 0 && (
                        <div className="mt-3 grid gap-3">
                            {m.items.map((it) => (
                                <PropertyCardView key={it.id} it={it}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Floating button with waves & single-phrase typing */}
            <button
                onPointerUp={() => setOpen(true)}
                style={{
                    willChange: 'transform, opacity',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                }}
                className={`
                        fixed z-[70] group w-14 h-14 rounded-full right-6
                         bottom-[calc(100px+max(env(safe-area-inset-bottom),0px))] sm:bottom-4
                        transition-transform duration-200 cursor-pointer
                        ${hidden ? 'translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
                      `}
                aria-label="Открыть чат Aura Assistant"
            >
                {/* волны */}
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/70 blur-md animate-ping"/>
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/60 blur-md animate-pulse"/>
                <span className="absolute inset-0 -z-10 rounded-full w-14 h-14 bg-blue-500/30"/>
                {/* ядро кнопки */}
                <span
                    className="flex items-center justify-center gap-2 rounded-full  shadow-lg text-white hover:bg-blue-900 transition bg-[#0036A5] w-full h-full">
                        <MessageSquareText className="w-5 h-5"/>
                        {/*<span className="relative">*/}
                          {/*<span>{typed}</span>*/}
                          {/*  {!open && typed.length < phrase.length && (*/}
                          {/*      <span*/}
                          {/*          className="ml-0.5 inline-block w-[1px] h-[1em] bg-white align-[-0.18em] animate-pulse"/>*/}
                          {/*  )}*/}
                        {/*</span>*/}
                      </span>
            </button>

            {/* Backdrop */}
            {open && <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)}/>}

            {/* Chat window */}
            <div
                className={`fixed z-50 bottom-40 sm:bottom-20 right-6 w-[92vw] max-w-md rounded-2xl bg-gray-50 shadow-xl overflow-hidden ${
                    open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                } transition`}
            >
                {/* Header */}
                <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-5 h-5">
                            <Image src="/favicon.ico" alt="Aura" fill sizes="20px" className="object-contain"/>
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold leading-tight truncate">{title}</div>
                            <div className="text-[11px] mt-1 text-gray-500 leading-tight truncate">{subtitle}</div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100 ml-2">
                        <X className="w-5 h-5 text-gray-500"/>
                    </button>
                </div>

                {/* Messages list */}
                <div ref={listRef} className="h-[58vh] overflow-y-auto p-3 space-y-3">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center text-center text-sm text-gray-500 mt-6 gap-3">
                            {/* Анимированный оператор (Lottie через iframe) */}
                            <div className="flex justify-center">
                                <iframe
                                    title="Aura operator"
                                    className="w-28 h-28"
                                    src="https://lottie.host/embed/de0a7611-411e-4a9c-9838-5eb958c014dd/3qYVkw53db.lottie"
                                />
                            </div>
                            {/* текст приветствия */}
                            <div>
                                <div className="font-medium text-gray-700">Поддержка Aura на связи!</div>
                                <div className="mt-1 w-80">Привет! Помогу с выбором квартиры, дома или офиса на
                                    Aura.tj.
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((m, idx) => (
                        <Bubble key={(m as { id?: string | number }).id ?? idx} m={m}/>
                    ))}

                    {loading && (
                        <div className="w-full flex justify-start">
                            <div
                                className="bg-white rounded-2xl px-4 py-3 shadow text-gray-700 text-sm inline-flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin"/> {loadingPhrase}
                            </div>
                        </div>
                    )}
                </div>

                {/* Composer */}
                <div className="bg-white p-2 drop-shadow-[0_-2px_4px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    send();
                                }
                            }}
                            placeholder="Напишите, что ищете..."
                            className="flex-1 rounded-xl px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className="rounded-xl bg-[#0036A5] text-white px-3 py-2 disabled:opacity-50 hover:bg-blue-900"
                        >
                            <Send className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}