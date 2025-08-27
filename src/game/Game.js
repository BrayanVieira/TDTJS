import * as THREE from "three";
import { Player } from "./Player.js";
import { World } from "./World.js";
import { ThirdPersonCamera } from "./Camera.js";
import { UI } from "./UI.js";

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this.world = new World(this.scene);
    this.player = new Player(this.scene, this.world);
    this.camera = new ThirdPersonCamera(this.player);
    this.ui = new UI(this.player);

    this.setupLights();
    this.setupEventListeners();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 500, 300);
    this.scene.add(directionalLight);
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  start() {
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta() * 1000;

    this.player.update(deltaTime);
    this.camera.update();
    this.world.update();
    this.ui.update();

    this.renderer.render(this.scene, this.camera);
  }
}
