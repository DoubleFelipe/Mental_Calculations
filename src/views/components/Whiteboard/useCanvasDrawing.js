import { useCallback, useEffect, useRef, useState } from 'react';

const makeSnapshot = (items) => items.map((item) => ({
  ...item,
  points: item.points?.map((point) => ({ ...point })),
}));

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const ratio = lengthSquared ? Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)) : 0;
  return Math.hypot(point.x - (start.x + ratio * dx), point.y - (start.y + ratio * dy));
}

function hitTest(item, point) {
  if (item.type === 'text') {
    return Math.abs(item.x - point.x) < Math.max(20, item.text.length * 4) && Math.abs(item.y - point.y) < 24;
  }
  return item.points.some((strokePoint, index) => index === 0
    ? Math.hypot(strokePoint.x - point.x, strokePoint.y - point.y) < 12
    : distanceToSegment(point, item.points[index - 1], strokePoint) < 12);
}

function renderLayer(canvas, items, layer, selectedId) {
  if (!canvas) return;
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const ratio = window.devicePixelRatio || 1;
  const width = Math.round(bounds.width * ratio);
  const height = Math.round(bounds.height * ratio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);
  items.filter((item) => item.layer === layer).forEach((item) => {
    context.save();
    if (item.id === selectedId) {
      context.shadowColor = '#2f80ed';
      context.shadowBlur = 8;
    }
    context.strokeStyle = item.color;
    context.fillStyle = item.color;
    context.lineWidth = item.width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (item.type === 'text') {
      context.font = '20px "Comic Sans MS", cursive';
      context.fillText(item.text, item.x, item.y);
    } else if (item.points.length === 1) {
      context.beginPath();
      context.arc(item.points[0].x, item.points[0].y, item.width / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.moveTo(item.points[0].x, item.points[0].y);
      item.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.stroke();
    }
    context.restore();
  });
}

export default function useCanvasDrawing() {
  const mainCanvasRef = useRef(null);
  const draftCanvasRef = useRef(null);
  const drawingRef = useRef(null);
  const movingRef = useRef(null);
  const frameRef = useRef(null);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [selectedId, setSelectedId] = useState(null);
  const [textPosition, setTextPosition] = useState(null);

  const commit = useCallback((nextItems) => {
    setHistory((state) => ({ past: [...state.past.slice(-49), makeSnapshot(items)], future: [] }));
    setItems(nextItems);
  }, [items]);

  const scheduleRender = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      renderLayer(mainCanvasRef.current, items, 'main', selectedId);
      renderLayer(draftCanvasRef.current, items, 'draft', selectedId);
      frameRef.current = null;
    });
  }, [items, selectedId]);

  useEffect(() => {
    scheduleRender();
    const observer = new ResizeObserver(scheduleRender);
    [mainCanvasRef.current, draftCanvasRef.current].forEach((canvas) => canvas && observer.observe(canvas));
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [scheduleRender]);

  const pointFromEvent = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, pressure: event.pressure || 0.5 };
  };

  const onPointerDown = (event, layer, tool, color, size) => {
    if (event.button !== 0) return;
    const canvas = event.currentTarget;
    const point = pointFromEvent(event, canvas);
    canvas.setPointerCapture(event.pointerId);
    if (tool === 'text') {
      setTextPosition({ ...point, layer });
      return;
    }
    if (tool === 'select') {
      const match = [...items].reverse().find((item) => item.layer === layer && hitTest(item, point));
      setSelectedId(match?.id ?? null);
      movingRef.current = match ? { pointerId: event.pointerId, id: match.id, start: point, originalItems: makeSnapshot(items) } : null;
      return;
    }
    drawingRef.current = { pointerId: event.pointerId, layer, tool, erasePoints: tool === 'erase' ? [point] : null, item: tool === 'erase' ? null : { id: crypto.randomUUID(), type: 'stroke', layer, color, width: size * (event.pointerType === 'pen' ? Math.max(0.45, point.pressure * 1.5) : 1), points: [{ x: point.x, y: point.y }] } };
    if (drawingRef.current.item) setItems([...items, drawingRef.current.item]);
  };

  const onPointerMove = (event) => {
    const drawing = drawingRef.current;
    const moving = movingRef.current;
    if (moving?.pointerId === event.pointerId) {
      const point = pointFromEvent(event, event.currentTarget);
      const dx = point.x - moving.start.x;
      const dy = point.y - moving.start.y;
      setItems((current) => current.map((item) => item.id !== moving.id ? item : item.type === 'text'
        ? { ...item, x: item.x + dx, y: item.y + dy }
        : { ...item, points: item.points.map((strokePoint) => ({ x: strokePoint.x + dx, y: strokePoint.y + dy })) }));
      moving.start = point;
      return;
    }
    if (!drawing || drawing.pointerId !== event.pointerId) return;
    const canvas = event.currentTarget;
    const coalesced = event.nativeEvent.getCoalescedEvents?.() || [event];
    const points = coalesced.map((sample) => pointFromEvent(sample, canvas));
    if (drawing.tool === 'erase') {
      drawing.erasePoints.push(...points);
      return;
    }
    drawing.item = { ...drawing.item, points: [...drawing.item.points, ...points.map(({ x, y }) => ({ x, y }))] };
    setItems((current) => [...current.slice(0, -1), drawing.item]);
  };

  const onPointerUp = (event) => {
    const moving = movingRef.current;
    if (moving?.pointerId === event.pointerId) {
      setHistory((state) => ({ past: [...state.past.slice(-49), moving.originalItems], future: [] }));
      movingRef.current = null;
      return;
    }
    const drawing = drawingRef.current;
    if (!drawing || drawing.pointerId !== event.pointerId) return;
    if (drawing.tool === 'erase') {
      drawing.erasePoints.push(pointFromEvent(event, event.currentTarget));
      const affected = items.filter((item) => item.layer === drawing.layer && drawing.erasePoints.some((point) => hitTest(item, point)));
      if (affected.length) commit(items.filter((item) => !affected.includes(item)));
    } else if (drawing.item) {
      // Add exactly one undo step per completed stroke instead of per pointer sample.
      setHistory((state) => ({ past: [...state.past.slice(-49), makeSnapshot(items.filter((item) => item.id !== drawing.item.id))], future: [] }));
    }
    drawingRef.current = null;
  };

  const addText = (text) => {
    if (!text.trim() || !textPosition) { setTextPosition(null); return; }
    commit([...items, { id: crypto.randomUUID(), type: 'text', text: text.trim(), x: textPosition.x, y: textPosition.y, layer: textPosition.layer, color: '#1c4b36', width: 2 }]);
    setTextPosition(null);
  };

  const clearLayer = (layer) => {
    const nextItems = items.filter((item) => item.layer !== layer);
    if (nextItems.length !== items.length) commit(nextItems);
    setSelectedId(null);
  };

  const transferDraft = () => {
    const selectionIsDraft = items.some((item) => item.id === selectedId && item.layer === 'draft');
    const selected = items.filter((item) => item.layer === 'draft' && (selectionIsDraft ? item.id === selectedId : true));
    if (!selected.length) return 0;
    const ids = new Set(selected.map((item) => item.id));
    commit([...items.filter((item) => !ids.has(item.id)), ...selected.map((item) => ({ ...item, layer: 'main' }))]);
    setSelectedId(null);
    return selected.length;
  };

  const undo = () => {
    if (!history.past.length) return;
    const previous = history.past.at(-1);
    setHistory({ past: history.past.slice(0, -1), future: [makeSnapshot(items), ...history.future] });
    setItems(makeSnapshot(previous));
  };
  const redo = () => {
    if (!history.future.length) return;
    const next = history.future[0];
    setHistory({ past: [...history.past, makeSnapshot(items)], future: history.future.slice(1) });
    setItems(makeSnapshot(next));
  };

  return {
    mainCanvasRef, draftCanvasRef, items, history, selectedId, textPosition, setTextPosition,
    onPointerDown, onPointerMove, onPointerUp, addText, clearLayer, transferDraft, undo, redo,
  };
}
