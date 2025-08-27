import * as THREE from "three";

export class Player {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.colliders = this.world.getColliders();
    this.moveSpeed = 0.05;
    this.sprintSpeed = 0.15;
    this.rotationSpeed = 0.03;
    this.currentRotation = 0;
    this.moveDirection = new THREE.Vector3();

    this.maxStamina = 200;
    this.currentStamina = this.maxStamina;
    this.staminaRegenRate = 0.3;
    this.staminaDrainRate = 1.5;
    this.isRegeneratingStamina = false;
    this.minStaminaToSprint = 15;
    this.canSprint = true;

    this.radius = 0.5;
    this.collisionBox = new THREE.Box3();
    this.playerSize = new THREE.Vector3(1, 2, 1);

    this.inventory = { wood: 0, stone: 0, iron: 0, gold: 0 };
    this.isCollecting = false;
    this.collectionTarget = null;
    this.collectionProgress = 0;
    this.collectionTime = 3000; // 3 seconds
    this.collectionRange = 3;

    this.createPlayer();
    this.setupControls();
  }

  createPlayer() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 1;
    this.scene.add(this.mesh);
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
    this.handleKeyEvent(event.code, true);
  }

  onKeyUp(event) {
    this.handleKeyEvent(event.code, false);
  }

  handleKeyEvent(code, isPressed) {
    const keyMap = {
      KeyW: "forward",
      KeyS: "backward",
      KeyA: "left",
      KeyD: "right",
      ShiftLeft: "sprint",
      Space: "jump",
    };

    const key = keyMap[code];
    if (key) {
      this.keys[key] = isPressed;
    }
  }

  update(deltaTime) {
    this.updateCollection(deltaTime);

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
    const moveDirection = new THREE.Vector3();
    if (this.keys.forward) {
      moveDirection.z += 1;
    }
    if (this.keys.backward) {
      moveDirection.z -= 1;
    }

    this.updateStamina();

    let currentSpeed = this.moveSpeed;
    if (this.keys.sprint && this.canSprint && this.currentStamina > 0) {
      currentSpeed = this.sprintSpeed;
      this.currentStamina -= this.staminaDrainRate;
    }

    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.currentRotation);
      const moveVector = moveDirection.multiplyScalar(currentSpeed);

      const proposedPosition = this.mesh.position.clone();

      proposedPosition.x += moveVector.x;
      if (!this.checkCollision(proposedPosition)) {
        this.mesh.position.x = proposedPosition.x;
      } else {
        proposedPosition.x = this.mesh.position.x;
      }

      proposedPosition.z += moveVector.z;
      if (!this.checkCollision(proposedPosition)) {
        this.mesh.position.z = proposedPosition.z;
      }
    }
  }

  updateCollection(deltaTime) {
    if (this.isCollecting) {
      const distance = this.mesh.position.distanceTo(this.collectionTarget.mesh.position);
      if (distance > this.collectionRange) {
        this.isCollecting = false;
        this.collectionTarget = null;
        this.collectionProgress = 0;
        return;
      }

      this.collectionProgress += deltaTime;
      if (this.collectionProgress >= this.collectionTime) {
        this.collect();
      }
    } else {
      for (const collider of this.colliders) {
        if (collider.mesh.userData.type) { // Check if it's a collectible resource
          const distance = this.mesh.position.distanceTo(collider.mesh.position);
          if (distance <= this.collectionRange) {
            this.isCollecting = true;
            this.collectionTarget = collider;
            this.collectionProgress = 0;
            break;
          }
        }
      }
    }
  }

  collect() {
    if (!this.collectionTarget) return;

    const resourceType = this.collectionTarget.mesh.userData.type;
    if (resourceType) {
      this.addToInventory(resourceType, 1);
    }

    this.world.removeObject(this.collectionTarget);

    this.isCollecting = false;
    this.collectionTarget = null;
    this.collectionProgress = 0;
  }

  addToInventory(resource, amount) {
    if (this.inventory.hasOwnProperty(resource)) {
      this.inventory[resource] += amount;
      console.log(`Collected ${amount} ${resource}. Total: ${this.inventory[resource]}`);
    }
  }

  updateStamina() {
    if (this.isRegeneratingStamina && !this.keys.sprint) {
      this.currentStamina = Math.min(
        this.maxStamina,
        this.currentStamina + this.staminaRegenRate
      );

      if (this.currentStamina >= this.minStaminaToSprint) {
        this.canSprint = true;
      }
    }
    this.isRegeneratingStamina = !this.keys.sprint;
  }

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

    this.moveDirection = new THREE.Vector3(
      Math.sin(rotation),
      0,
      Math.cos(rotation)
    );
  }

  checkCollision(position) {
    const margin = 0.1;
    const playerCollisionSize = new THREE.Vector3(
      this.playerSize.x + margin,
      this.playerSize.y,
      this.playerSize.z + margin
    );

    this.collisionBox.setFromCenterAndSize(position, playerCollisionSize);

    for (const collider of this.colliders) {
      if (this.collisionBox.intersectsBox(collider.box)) {
        return true;
      }
    }
    return false;
  }
}
