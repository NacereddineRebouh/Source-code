"use client";
import SceneInit from "@/lib/SceneInit";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
type Props = {};

export default function Test({}: Props) {
  const [scene, setscene] = useState<SceneInit>();
  const [button, setbutton] = useState<string>("Focus on Earth");
  useEffect(() => {
    const test = new SceneInit("myThreeCanvas");
    setscene(test);
    test.Initialize();
    const progress = document.getElementById("progress-bar");
    const lmm = new THREE.LoadingManager();
    lmm.onLoad = () => {
      //url: string, loaded: number, total: number
      console.log("loaded");
      // progress!.value = (loaded / total) * 100;
    };
    test.animate();

    test.onWindowResize = () => {
      test.width = window.innerWidth;
      test.height = window.innerHeight;

      test.camera!.aspect = test.width / test.height;
      test.camera!.updateProjectionMatrix();
      test.renderer!.setSize(test.width, test.height);
    };
  }, []);

  return (
    <div className="z-10 w-full">
      <canvas id="myThreeCanvas" className="absolute top-0 left-0 z-0"></canvas>
      <header className="relative z-20 flex w-full flex-row items-center justify-between px-28 py-10 text-slate-200">
        <p className="text-2xl font-semibold">Mearth</p>
        <div className="flex flex-row items-center gap-x-5 text-xl font-medium">
          <div className="cursor-pointer">Random</div>
          <div className="cursor-pointer">Random</div>
        </div>
      </header>
      <div className="absolute top-3/4 left-0 right-0 z-20 mx-auto flex items-center justify-center text-slate-200">
        <button
          onClick={() => {
            console.log("Scene set");

            if (button === "Focus on Earth") {
              setbutton("Focus on Moon");
              // scene?.controls?.target.set(5, 0, -45);
              gsap.to(scene!.controls!.target, {
                x: 5,
                y: 0,
                z: -45,
                duration: 1.5,
                ease: "easeInOut",
              });
            } else {
              setbutton("Focus on Earth");
              // scene?.controls?.target.set(0, 0, 0);
              gsap.to(scene!.controls!.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: "easeOut",
              });
            }
          }}
          className="transtion-all cursor-pointer rounded-full border-[1.3px] border-slate-100 py-4 px-14 text-lg duration-300 hover:bg-slate-600/30 active:bg-slate-600/50"
        >
          {button}
        </button>
      </div>
      <div className="absolute top-0 left-0 z-30 hidden  h-full w-full items-center justify-center bg-black/70  ">
        <div className="flex h-full flex-col items-center justify-center">
          <label htmlFor="progress-bart" className=" text-white">
            Loading...
          </label>
          <progress
            id="progress-bar"
            className="w-96 rounded-full "
            value={0}
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  );
}
