'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export function useUnsavedChanges(when: boolean, message = 'Есть несохранённые изменения. Выйти со страницы?') {
    const router = useRouter();

    useEffect(() => {
        if (!when) return;

        // 1) Закрытие вкладки / перезагрузка
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // нужно для отображения системного диалога
            return '';
        };
        window.addEventListener('beforeunload', onBeforeUnload);

        // 2) Навигация по ссылкам внутри SPA
        const onDocumentClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement)?.closest('a[href]') as HTMLAnchorElement | null;
            if (!anchor) return;
            // игнорируем внешние/новую вкладку/якоря на той же странице
            const sameOrigin = anchor.origin === window.location.origin;
            if (!sameOrigin || anchor.target === '_blank' || anchor.href === window.location.href) return;

            e.preventDefault();
            if (window.confirm(message)) {
                router.push(anchor.getAttribute('href')!);
            }
        };
        document.addEventListener('click', onDocumentClick);

        // 3) Кнопка “Назад/Вперёд”
        // Ставим фиктивное состояние, чтобы перехватывать popstate
        const push = () => { try { history.pushState(null, '', window.location.href); } catch {} };
        push();
        const onPopState = (e: PopStateEvent) => {
            if (!window.confirm(message)) {
                // отменяем уход: возвращаем текущее состояние
                push();
            }
        };
        window.addEventListener('popstate', onPopState);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            document.removeEventListener('click', onDocumentClick);
            window.removeEventListener('popstate', onPopState);
        };
    }, [when, message, router]);
}