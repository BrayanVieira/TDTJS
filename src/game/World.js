import * as THREE from "three";
import { TreeGenerator, RockGenerator } from "./Objects.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.treeGenerator = new TreeGenerator(this.scene);
    this.rockGenerator = new RockGenerator(this.scene);
    this.colliders = [];
    this.objectPositions = [];

    // Reserve player spawn area
    this.objectPositions.push({ x: 0, z: 0, radius: 5 });

    this.loadTextures();
    this.createTrees();
    this.createRocksAndOres();

    this.colliders = [
      ...this.treeGenerator.getColliders(),
      ...this.rockGenerator.getColliders(),
    ];
  }

  getColliders() {
    return this.colliders;
  }

  removeObject(object) {
    if (!object) return;

    this.scene.remove(object.mesh);
    const index = this.colliders.indexOf(object);
    if (index > -1) {
      this.colliders.splice(index, 1);
    }
  }

  isTooClose(x, z, minDistance) {
    return this.objectPositions.some((pos) => {
      const dx = pos.x - x;
      const dz = pos.z - z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      return distance < (pos.radius + minDistance);
    });
  }

  loadTextures() {
    const textureLoader = new THREE.TextureLoader();

    // Using absolute path for debugging
    const texturePath = "/src/textures/ground.jpg";

    textureLoader.load(
      texturePath,
      (texture) => {
        console.log("Texture loaded successfully");
        this.createGround(texture);
      },
      (progress) => {
        console.log(
          "Loading texture...",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading texture:", error);
        // Create ground with default material if texture fails
        this.createGround();
      }
    );
  }

  createGround(texture = null) {
    const geometry = new THREE.PlaneGeometry(100, 100);
    let material;

    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20);
      texture.anisotropy = 16;

      material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2,
      });
    } else {
      // Fallback material if texture loading fails
      material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2,
      });
    }

    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  createTrees() {
    const worldSize = 50;
    const numberOfLargeTrees = 12;
    const numberOfMediumTrees = 18;
    const minDistance = 4;
    const treeRadius = 2.5;
    const numberOfClusters = 3;

    // Generate large trees
    for (let i = 0; i < numberOfLargeTrees; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (this.isTooClose(x, z, minDistance));

      this.objectPositions.push({ x, z, radius: treeRadius });
      this.treeGenerator.createLargeTree(new THREE.Vector3(x, 0, z));
    }

    // Generate medium trees
    for (let i = 0; i < numberOfMediumTrees; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (this.isTooClose(x, z, minDistance));

      this.objectPositions.push({ x, z, radius: treeRadius });
      this.treeGenerator.createTree(new THREE.Vector3(x, 0, z));
    }

    // Create smaller number of clusters
    for (let i = 0; i < numberOfClusters; i++) {
      const clusterX = (Math.random() - 0.5) * worldSize;
      const clusterZ = (Math.random() - 0.5) * worldSize;

      const treesInCluster = Math.floor(Math.random() * 2) + 2;

      for (let j = 0; j < treesInCluster; j++) {
        const offset = 2.5;
        const x = clusterX + (Math.random() - 0.5) * offset;
        const z = clusterZ + (Math.random() - 0.5) * offset;

        if (!this.isTooClose(x, z, minDistance)) {
          this.objectPositions.push({ x, z, radius: treeRadius });
          if (Math.random() > 0.5) {
            this.treeGenerator.createLargeTree(new THREE.Vector3(x, 0, z));
          } else {
            this.treeGenerator.createTree(new THREE.Vector3(x, 0, z));
          }
        }
      }
    }
  }

  createRocksAndOres() {
    const worldSize = 50;
    const numberOfRocks = 15;
    const numberOfIron = 8;
    const numberOfGold = 4;
    const minDistance = 3;
    const rockRadius = 1.5;

    // Generate Rocks
    for (let i = 0; i < numberOfRocks; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (this.isTooClose(x, z, minDistance));

      this.objectPositions.push({ x, z, radius: rockRadius });
      this.rockGenerator.createRock(new THREE.Vector3(x, 0, z));
    }

    // Generate Iron
    for (let i = 0; i < numberOfIron; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (this.isTooClose(x, z, minDistance));

      this.objectPositions.push({ x, z, radius: rockRadius });
      this.rockGenerator.createIronVein(new THREE.Vector3(x, 0, z));
    }

    // Generate Gold
    for (let i = 0; i < numberOfGold; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (this.isTooClose(x, z, minDistance));

      this.objectPositions.push({ x, z, radius: rockRadius });
      this.rockGenerator.createGoldVein(new THREE.Vector3(x, 0, z));
    }
  }

  update() {
    // World update logic here
  }
}
