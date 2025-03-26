import * as THREE from "three";

export class ThirdPersonCamera extends THREE.PerspectiveCamera {
  constructor(player) {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.player = player;
    this.distance = 5;
    this.height = 2;

    // Add smoothing parameters
    this.smoothSpeed = 0.1;
    this.targetPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();

    this.position.set(0, this.height, -this.distance);
  }

  update() {
    const playerPos = this.player.getPosition();
    const playerRotation = this.player.getRotation();

    // Calculate target camera position based on player rotation
    const x = Math.sin(playerRotation) * this.distance;
    const z = Math.cos(playerRotation) * this.distance;

    // Set target position
    this.targetPosition.set(
      playerPos.x - x,
      playerPos.y + this.height,
      playerPos.z - z
    );

    // Smoothly interpolate current position to target position
    this.position.lerp(this.targetPosition, this.smoothSpeed);

    // Make camera look at player with smooth rotation
    this.lookAt(playerPos);
  }

  // Optional: Add method to adjust smooth speed
  setSmoothSpeed(speed) {
    this.smoothSpeed = Math.max(0.001, Math.min(1, speed));
  }
}
