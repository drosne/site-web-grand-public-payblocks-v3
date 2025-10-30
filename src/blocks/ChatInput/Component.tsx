"use client";

import { AudioLines, Mic, Plus, Settings2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";

import { cn } from "@/utilities/cn";

export type ChatInputProps = {
  title?: string
  subtitle?: string
  placeholder?: string
  buttonText?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({
  title = "Comment puis-je vous aider ?",
  subtitle = "L'intelligence artificielle de Justice.cool est là pour vous aider à trouver votre chemin afin de résoudre vos contentieux",
  placeholder = "Posez votre question...",
  buttonText = "Envoyer"
}) => {
  const [value, setValue] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-left">
            {subtitle}
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-100 rounded-4xl w-full space-y-2 px-6 py-4">
              <PlaceholdersAndVanishInput
                placeholder={placeholder}
                className="mb-4 h-12 w-full max-w-full bg-transparent shadow-none"
                onChange={handleChange}
                onSubmit={onSubmit}
                value={value}
                setValue={setValue}
              />

              <div className="flex h-10 w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <Plus className="size-4 cursor-pointer" />
                  <span className="flex cursor-pointer items-center gap-2 text-sm">
                    <Settings2 className="size-4 cursor-pointer" />
                    Outils
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Mic className="size-4 cursor-pointer" />
                  <span className="bg-foreground/10 hover:bg-foreground/20 flex size-8 cursor-pointer items-center justify-center gap-2 rounded-full text-sm">
                    <AudioLines className="size-4" />
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                "Créer un contrat",
                "Résoudre un litige",
                "Faire un plan",
                "Créer une application",
                "Rédiger un document",
              ].map((item, index) => (
                <span
                  key={index}
                  onClick={() => setValue(item)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 inline-block cursor-pointer rounded-full px-4 py-1 text-xs tracking-tight"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Below is the modified component from Aceternity UI
// Original source: npx shadcn@latest add https://ui.aceternity.com/registry/placeholders-and-vanish-input.json
// Modified to follow our coding standards and design system
// We respect copyright and attribution to the original creators

function PlaceholdersAndVanishInput({
  className,
  placeholder,
  onChange,
  onSubmit,
  value,
  setValue,
}: {
  className?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  setValue: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<
    {
      x: number;
      y: number;
      r: number;
      color: string;
    }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: {
      x: number;
      y: number;
      color: number[];
    }[] = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit(e);
  };
  
  return (
    <form
      className={cn(
        "relative mx-auto h-12 w-full max-w-xl overflow-hidden bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 dark:bg-zinc-800",
        value && "bg-gray-50",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "pointer-events-none absolute -left-2 top-2 origin-top-left scale-50 transform pr-20 text-base invert filter dark:invert-0",
          !animating ? "opacity-0" : "opacity-100",
        )}
        ref={canvasRef}
      />
      <input
        placeholder={placeholder}
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "relative z-50 h-full w-full border-none bg-transparent pr-20 text-sm text-black focus:outline-none focus:ring-0 sm:text-base dark:text-white",
          animating && "text-transparent dark:text-transparent",
        )}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute right-0 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black transition duration-200 disabled:bg-gray-100 dark:bg-zinc-900 dark:disabled:bg-zinc-800"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-gray-300"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>
    </form>
  );
}