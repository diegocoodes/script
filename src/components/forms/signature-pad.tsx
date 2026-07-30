"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignaturePad({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [typedName, setTypedName] = useState(
    value?.startsWith("typed:") ? value.slice(6) : "",
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rectangle = canvas.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(rectangle.width * ratio);
      canvas.height = Math.floor(rectangle.height * ratio);
      const context = canvas.getContext("2d");
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = 2;
        context.strokeStyle = "#0f172a";
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  function position(event: React.PointerEvent<HTMLCanvasElement>) {
    const rectangle = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rectangle.left,
      y: event.clientY - rectangle.top,
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = event.currentTarget.getContext("2d");
    const point = position(event);
    context?.beginPath();
    context?.moveTo(point.x, point.y);
    drawingRef.current = true;
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const context = event.currentTarget.getContext("2d");
    const point = position(event);
    context?.lineTo(point.x, point.y);
    context?.stroke();
  }

  function finishDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onChange(event.currentTarget.toDataURL("image/png"));
    setTypedName("");
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTypedName("");
    onChange("");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="flex items-center gap-2 font-semibold">
          <PenLine aria-hidden="true" className="size-4 text-blue-600" />
          {label}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={!value && !typedName}
        >
          <Eraser aria-hidden="true" className="size-3.5" />
          Limpar
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id={id}
        className="mt-3 h-40 w-full touch-none rounded-lg border border-dashed border-slate-300 bg-white"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={finishDrawing}
        aria-label={`Área para desenhar ${label.toLocaleLowerCase("pt-BR")}`}
      />
      <div className="mt-3">
        <Label htmlFor={`${id}-typed`} className="text-xs text-slate-500">
          Alternativa acessível: digite o nome do signatário
        </Label>
        <Input
          id={`${id}-typed`}
          value={typedName}
          onChange={(event) => {
            const name = event.target.value;
            setTypedName(name);
            onChange(name ? `typed:${name}` : "");
          }}
          placeholder="Nome completo"
          className="mt-1.5 bg-white"
        />
      </div>
    </div>
  );
}
