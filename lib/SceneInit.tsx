import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

import textureMoon from "@/public/textures/moon.jpg";
import textureearth from "@/public/textures/earth2.jpg";
import NormalMap from "@/public/textures/NormalMap.png";
import DisplacementMap from "@/public/textures/DisplacementMap.png";

import font from "node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json";

import { Orbitron } from "@next/font/google";
const pop = Orbitron({
  subsets: ["latin"],
});

export default class SceneInit {
  fov: number;
  canvasId: string;
  scene: THREE.Scene | undefined;
  stats: Stats | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  controls: OrbitControls | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  clock: any;
  onWindowResize: any;
  height: number;
  width: number;
  sphere: THREE.Mesh<THREE.SphereGeometry> | undefined;
  earth: THREE.Mesh<THREE.SphereGeometry> | undefined;
  loadingManager: THREE.LoadingManager | undefined;

  constructor(canvasId: string) {
    this.fov = 45;
    this.canvasId = canvasId;

    this.scene = undefined;
    this.stats = undefined;
    this.camera = undefined;
    this.controls = undefined;
    this.renderer = undefined;
    this.sphere = undefined;
    this.earth = undefined;
    this.loadingManager = undefined;
    this.height = 0;
    this.width = 0;
  }
  Initialize() {
    this.scene = new THREE.Scene();
    this.loadingManager = new THREE.LoadingManager();
    //environement

    const envtexture = new THREE.TextureLoader().load(textureMoon.src);
    const envMap = new THREE.CubeTextureLoader()
      .setPath("/textures/env4/")
      .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
    envMap.encoding = THREE.sRGBEncoding;
    const dark = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1,
    });
    this.scene.background = envMap;
    this.scene.environment = envMap;
    this.clock = new THREE.Clock();

    this.height = window.innerHeight;
    this.width = window.innerWidth;
    //-----------------Camera-----------------//
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight
    );
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight
    );

    this.camera.position.z = 0;
    this.camera.position.y = 20;
    this.camera.rotation.x = 0;

    //-----------------renderer-----------------//
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);

    //------------------adding lights-----------------//
    const sphereSize = 4;

    const spotLight = new THREE.PointLight(0xffffff, 1.4);
    const pointlighHelper = new THREE.PointLightHelper(spotLight, sphereSize);
    spotLight.castShadow = true;
    spotLight.position.set(0, 0, 60);
    this.scene.add(spotLight);
    this.scene.add(pointlighHelper);

    //-------------adding objects------------//
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const earth = new THREE.SphereGeometry(9, 64, 64);
    // load a texture, set wrap mode to repeat
    const texture = new THREE.TextureLoader().load(textureMoon.src);
    const textureEarth = new THREE.TextureLoader().load(textureearth.src);
    const normals = new THREE.TextureLoader().load(NormalMap.src);
    const Displacements = new THREE.TextureLoader().load(DisplacementMap.src);

    const uvMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      normalMap: normals,
      bumpMap: Displacements,
      roughness: 1,
    });
    const uvMaterialE = new THREE.MeshStandardMaterial({
      map: textureEarth,
      roughness: 0.8,
    });
    this.sphere = new THREE.Mesh(geometry, uvMaterial);
    this.earth = new THREE.Mesh(earth, uvMaterialE);
    this.scene.add(this.sphere);
    this.scene.add(this.earth);
    this.sphere.rotation.y = 5;
    this.earth.position.z = -45;
    this.earth.position.x = 5;

    //--------------stats and orbitcontrols------------//
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1;

    this.stats = Stats();
    document.body.appendChild(this.stats.domElement);

    //if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    //--------------text------------//
    // const fontl = new TTFLoader();
    // fontl.load("/public/font/Freedom.ttf", (droidfont: any) => {
    //   // const font = fontl.parse(json);
    //   const textGeometry = new TextGeometry("Hello werld", {
    //     height: 2,
    //     size: 10,
    //     font: droidfont,
    //   });
    //   const textMaterial = new THREE.MeshNormalMaterial();
    //   const textmesh = new THREE.Mesh(textGeometry, textMaterial);
    //   textmesh.position.x = -36;
    //   textmesh.position.y = 5;
    //   this.scene?.add(textmesh);
    // });
    // const loader = new TTFLoader();
    // const fontss = new FontLoader().parse(font);

    // loader.load(fontss, (json: any) => {
    //   const font = fontl.parse(json);
    // });
    // const textGeometry = new TextGeometry("Hello werld", {
    //   height: 0.2,
    //   size: 0.2,
    //   font: fontss,
    // });
    // const textMaterial = new THREE.MeshNormalMaterial();
    // const textmesh = new THREE.Mesh(textGeometry, textMaterial);
    // textmesh.position.x = -0.2;
    // this.scene?.add(textmesh);

    // animate();
    // loading manager
  }
  //------------------Loop-----------------//
  animate() {
    // this.sphere!.rotation.y += 0.01;
    // this.sphere!.rotation.x += 0.01;
    // this.sphere!.rotation.y += 0.01;
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    (this.controls as OrbitControls).update();
    // (this.stats as Stats).update();
    (this.renderer as THREE.WebGLRenderer).render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    );
  }
  render() {
    return <div></div>;
  }
}
