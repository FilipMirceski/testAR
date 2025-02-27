/*
 * Copyright (c) 2020 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

import * as THREE from "three";
import Scene from "./Scene";
import Camera from "./camera/Camera";

/**
 * Renderer that renders View3D's Scene
 * @category Core
 */
class Renderer {
  private _renderer: THREE.WebGLRenderer;
  private _canvas: HTMLCanvasElement;
  private _clock: THREE.Clock;

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement HTMLCanvasElement} given when creating View3D instance
   * @type HTMLCanvasElement
   * @readonly
   */
  public get canvas() { return this._canvas; }
  /**
   * Current {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext WebGLRenderingContext}
   * @type WebGLRenderingContext
   * @readonly
   */
  public get context() { return this._renderer.context; }
  /**
   * The width and height of the renderer's output canvas
   * @see https://threejs.org/docs/#api/en/math/Vector2
   * @type THREE.Vector2
   */
  public get size() { return this._renderer.getSize(new THREE.Vector2()); }
  /**
   * Three.js {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer WebGLRenderer} instance
   * @type THREE.WebGLRenderer
   * @readonly
   */
  public get threeRenderer() { return this._renderer; }

  public set size(val: THREE.Vector2) {
    this._renderer.setSize(val.x, val.y, false);
  }

  /**
   * Create new Renderer instance
   * @param canvas \<canvas\> element to render 3d model
   */
  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    this._renderer.xr.enabled = true;

    this._renderer.outputEncoding = THREE.sRGBEncoding;

    this._clock = new THREE.Clock(false);
    this.enableShadow();
  }

  /**
   * Resize the renderer based on current canvas width / height
   * @returns {void} Nothing
   */
  public resize(): void {
    const renderer = this._renderer;
    const canvas = this._canvas;

    if (renderer.xr.isPresenting) return;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);
  }

  /**
   * Render a scene using a camera.
   * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.render
   * @param scene {@link Scene} to render
   * @param camera {@link Camera} to render
   */
  public render(scene: Scene, camera: Camera): void {
    this._renderer.render(scene.root, camera.threeCamera);
  }

  public setAnimationLoop(callback: (delta: number, frame?: any) => void): void {
    this._clock.start();
    this._renderer.setAnimationLoop((timestamp: number, frame: any) => {
      const delta = this._clock.getDelta();
      callback(delta, frame);
    });
  }

  public stopAnimationLoop(): void {
    this._clock.stop();
    // See https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop
    this._renderer.setAnimationLoop(null);
  }

  /**
   * Enable shadow map
   */
  public enableShadow() {
    const threeRenderer = this._renderer;

    threeRenderer.shadowMap.enabled = true;
    threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  /**
   * Disable shadow map
   */
  public disableShadow() {
    const threeRenderer = this._renderer;

    threeRenderer.shadowMap.enabled = false;
  }
}

export default Renderer;
