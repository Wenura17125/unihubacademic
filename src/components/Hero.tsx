
"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { renderCanvas } from '@/components/ui/canvas';
import { Plus, ArrowRight, Shapes } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="animation-delay-8 animate-fade-in mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
            <Shapes className="h-5 p-1" /> Introducing Uni-Hub.
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary ml-1 flex items-center font-semibold"
            >
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Explore{" "}
              <span aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>

        <div className="mb-10 mt-4 md:mt-6">
          <div className="px-2">
            <div className="relative mx-auto h-full max-w-7xl border border-primary/20 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-4xl font-semibold leading-none tracking-tight md:flex-col md:text-6xl lg:flex-row lg:text-7xl xl:text-8xl">
                <Plus
                  strokeWidth={4}
                  className="text-primary absolute -left-3 -top-3 h-6 w-6 md:-left-5 md:-top-5 md:h-10 md:w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-primary absolute -bottom-3 -left-3 h-6 w-6 md:-bottom-5 md:-left-5 md:h-10 md:w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-primary absolute -right-3 -top-3 h-6 w-6 md:-right-5 md:-top-5 md:h-10 md:w-10"
                />
                <Plus
                  strokeWidth={4}
                  className="text-primary absolute -bottom-3 -right-3 h-6 w-6 md:-bottom-5 md:-right-5 md:h-10 md:w-10"
                />
                <span className="bg-gradient-to-r from-primary via-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Your complete platform for Academic Excellence.
                </span>
              </h1>
              <div className="flex items-center justify-center gap-1 mt-4">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available Now</p>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-xl md:text-2xl lg:text-3xl">
            Welcome to University of Vavuniya&apos;s digital hub!{" "}
            <span className="text-primary font-bold">Uni-Hub</span>
          </h2>

          <p className="mx-auto mb-16 mt-4 max-w-2xl px-6 text-sm text-muted-foreground sm:px-6 md:max-w-4xl md:px-20 md:text-base lg:text-lg">
            Streamline your academic journey with our comprehensive management system. 
            Built for the University of Vavuniya community to enhance your educational experience.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary-700 text-white px-8 py-3 text-base md:text-lg"
            >
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-base md:text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </section>
  );
}
