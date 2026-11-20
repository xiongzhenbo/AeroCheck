import React, { useCallback, useEffect, useRef, useState } from 'react';

export function usePointerDragReorder(
  itemCount: number,
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const lastSwapYRef = useRef<number>(0);
  const rowRefs = useRef<Map<number, HTMLElement>>(new Map());
  const onReorderRef = useRef(onReorder);
  const itemCountRef = useRef(itemCount);

  useEffect(() => {
    onReorderRef.current = onReorder;
  }, [onReorder]);

  useEffect(() => {
    itemCountRef.current = itemCount;
  }, [itemCount]);

  const registerRow = useCallback((index: number, el: HTMLElement | null) => {
    if (el) {
      rowRefs.current.set(index, el);
    } else {
      rowRefs.current.delete(index);
    }
  }, []);

  const stopDrag = useCallback(() => {
    dragIndexRef.current = null;
    setDraggingIndex(null);
  }, []);

  useEffect(() => {
    if (draggingIndex === null) return;

    const handlePointerMove = (ev: PointerEvent) => {
      const currentIdx = dragIndexRef.current;
      if (currentIdx === null) return;

      const count = itemCountRef.current;
      const currentEl = rowRefs.current.get(currentIdx);
      const currentHeight = currentEl ? currentEl.getBoundingClientRect().height : 60;

      // Prevent jitter immediately after a swap
      if (Math.abs(ev.clientY - lastSwapYRef.current) < 8) {
        return;
      }

      for (let i = 0; i < count; i++) {
        if (i === currentIdx) continue;
        const el = rowRefs.current.get(i);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const effectiveSpan = Math.min(rect.height, currentHeight);

        if (i < currentIdx) {
          const threshold = rect.top + effectiveSpan * 0.55;
          if (ev.clientY <= threshold && (i === 0 || ev.clientY >= rect.top - 16)) {
            lastSwapYRef.current = ev.clientY;
            dragIndexRef.current = i;
            setDraggingIndex(i);
            onReorderRef.current(currentIdx, i);
            break;
          }
        } else {
          const threshold = rect.bottom - effectiveSpan * 0.55;
          if (ev.clientY >= threshold && (i === count - 1 || ev.clientY <= rect.bottom + 16)) {
            lastSwapYRef.current = ev.clientY;
            dragIndexRef.current = i;
            setDraggingIndex(i);
            onReorderRef.current(currentIdx, i);
            break;
          }
        }
      }
    };

    const handlePointerUp = () => {
      stopDrag();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggingIndex, stopDrag]);

  const startDrag = useCallback((index: number, e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    lastSwapYRef.current = e.clientY;
    dragIndexRef.current = index;
    setDraggingIndex(index);
  }, []);

  return {
    draggingIndex,
    registerRow,
    startDrag,
  };
}
