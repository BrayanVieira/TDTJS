import * as THREE from "three";
import { TreeGenerator } from "./Objects.js"; // Importe a classe TreeGenerator

export class Player {
  constructor(scene, treeGenerator) {
    this.scene = scene;
    this.treeGenerator = treeGenerator;
    this.moveSpeed = 0.05; // Reduced base speed
    this.sprintSpeed = 0.15; // Sprint speed
    this.rotationSpeed = 0.03;
    this.currentRotation = 0;
    this.moveDirection = new THREE.Vector3();

    // Updated stamina system
    this.maxStamina = 200; // Increased max stamina
    this.currentStamina = this.maxStamina;
    this.staminaRegenRate = 0.3; // Slower regeneration
    this.staminaDrainRate = 1.5; // Faster drain
    this.isRegeneratingStamina = false;
    this.minStaminaToSprint = 15;
    this.canSprint = true;

    this.radius = 0.5; // Player collision radius
    this.playerSize = { width: 1, height: 2, depth: 1 };
    this.lastValidPosition = new THREE.Vector3();
    this.playerBox = new THREE.Box3(); // Add this for collision detection
    this.collisionBox = new THREE.Box3();
    this.playerSize = new THREE.Vector3(1, 2, 1);

    this.createPlayer();
    this.setupControls();
    this.collider = this.createPlayerCollider();
  }

  createPlayer() {
    // Temporary player model (cube)
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 1;
    this.scene.add(this.mesh);
  }

  createPlayerCollider() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      visible: false, // Set to true for debugging
    });
    const collider = new THREE.Mesh(geometry, material);
    this.scene.add(collider);
    return collider;
  }

  setupControls() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false,
    };

    document.addEventListener("keydown", (e) => this.onKeyDown(e));
    document.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  onKeyDown(event) {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = true;
        break;
      case "KeyS":
        this.keys.backward = true;
        break;
      case "KeyA":
        this.keys.left = true;
        break;
      case "KeyD":
        this.keys.right = true;
        break;
      case "ShiftLeft":
        this.keys.sprint = true;
        break;
      case "Space":
        this.keys.jump = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = false;
        break;
      case "KeyS":
        this.keys.backward = false;
        break;
      case "KeyA":
        this.keys.left = false;
        break;
      case "KeyD":
        this.keys.right = false;
        break;
      case "ShiftLeft":
        this.keys.sprint = false;
        break;
      case "Space":
        this.keys.jump = false;
        break;
    }
  }

  update() {
    // Store current position before movement
    this.lastValidPosition.copy(this.mesh.position);

    // Handle rotation
    if (this.keys.left) {
      this.currentRotation += this.rotationSpeed;
      this.mesh.rotation.y = this.currentRotation;
    }
    if (this.keys.right) {
      this.currentRotation -= this.rotationSpeed;
      this.mesh.rotation.y = this.currentRotation;
    }

    // Calculate movement
    const moveVector = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.currentRotation);

    // Handle stamina and sprint
    this.updateStamina();

    // Calculate speed
    let currentSpeed = this.moveSpeed;
    if (this.keys.sprint && this.canSprint && this.currentStamina > 0) {
      currentSpeed = this.sprintSpeed;
      this.currentStamina -= this.staminaDrainRate;
    }

    // Apply movement
    if (this.keys.forward) {
      moveVector.add(forward.multiplyScalar(currentSpeed));
    }
    if (this.keys.backward) {
      moveVector.add(forward.multiplyScalar(-currentSpeed * 0.7));
    }

    // Test new position
    const newPosition = this.mesh.position.clone().add(moveVector);

    // Check collision and update position
    if (!this.checkCollision(newPosition)) {
      this.mesh.position.copy(newPosition);
    } else {
      // On collision, revert to last valid position
      this.mesh.position.copy(this.lastValidPosition);
    }

    // Update collider position to match player
    if (this.collider) {
      this.collider.position.copy(this.mesh.position);
    }
  }

  updateStamina() {
    if (this.isRegeneratingStamina && !this.keys.sprint) {
      this.currentStamina = Math.min(
        this.maxStamina,
        this.currentStamina + this.staminaRegenRate
      );

      // Re-enable sprint when stamina is above minimum
      if (this.currentStamina >= this.minStaminaToSprint) {
        this.canSprint = true;
      }
    }
    this.isRegeneratingStamina = !this.keys.sprint;
  }

  // Add method to get stamina percentage
  getStaminaPercentage() {
    return (this.currentStamina / this.maxStamina) * 100;
  }

  getPosition() {
    return this.mesh.position;
  }

  getRotation() {
    return this.currentRotation;
  }

  setRotation(rotation) {
    this.mesh.rotation.y = rotation;

    // Update movement direction based on rotation
    this.moveDirection = new THREE.Vector3(
      Math.sin(rotation),
      0,
      Math.cos(rotation)
    );
  }

  checkCollision(position) {
    const margin = 0.1; // Small margin to prevent getting too close to trees
    const playerSize = new THREE.Vector3(
      this.playerSize.x + margin,
      this.playerSize.y,
      this.playerSize.z + margin
    );

    // Update player collision box with margin
    this.collisionBox.setFromCenterAndSize(position, playerSize);

    // Check against all tree colliders
    const colliders = this.treeGenerator.getColliders();
    for (const collider of colliders) {
      if (this.collisionBox.intersectsBox(collider.box)) {
        return true;
      }
    }
    return false;
  }

  boxesIntersect(min1, max1, min2, max2) {
    return (
      min1.x <= max2.x &&
      max1.x >= min2.x &&
      min1.y <= max2.y &&
      max1.y >= min2.y &&
      min1.z <= max2.z &&
      max1.z >= min2.z
    );
  }
}

function animate() {
  requestAnimationFrame(animate);

  // ...existing code...

  // Detecção de colisão
  detectCollision();

  renderer.render(scene, camera);
}

// Função para detectar a colisão entre o player e as árvores
function detectCollision() {
  const playerBox = new THREE.Box3().setFromObject(player); // Supondo que 'player' é o seu objeto 3D do player
  const treeColliders = treeGenerator.getColliders();

  treeColliders.forEach((collider) => {
    const treeBox = new THREE.Box3().setFromObject(collider);

    if (playerBox.intersectsBox(treeBox)) {
      // Colisão detectada!
      console.log("Colisão com árvore!");

      // Lógica para lidar com a colisão (ex: impedir o movimento do player)
      // Por exemplo, você pode resetar a posição do player para antes da colisão
      // player.position.copy(previousPlayerPosition);
    }
  });
}
