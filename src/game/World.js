import * as THREE from "three";
import { TreeGenerator } from "./Objects.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.treeGenerator = new TreeGenerator(this.scene);
    this.loadTextures();
    this.createTrees();
  }

  // Add method to get tree generator
  getTreeGenerator() {
    return this.treeGenerator;
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
    const treeGenerator = new TreeGenerator(this.scene);

    // Reduced numbers for trees
    const worldSize = 50;
    const numberOfLargeTrees = 12; // Reduced from 20
    const numberOfMediumTrees = 18; // Reduced from 30
    const minDistance = 4; // Increased minimum distance
    const numberOfClusters = 3; // Reduced from 5

    const treePositions = [];

    const isTooClose = (x, z) => {
      return treePositions.some((pos) => {
        const dx = pos.x - x;
        const dz = pos.z - z;
        return Math.sqrt(dx * dx + dz * dz) < minDistance;
      });
    };

    // Generate large trees
    for (let i = 0; i < numberOfLargeTrees; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (isTooClose(x, z));

      treePositions.push({ x, z });
      treeGenerator.createLargeTree(x, z);
    }

    // Generate medium trees
    for (let i = 0; i < numberOfMediumTrees; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * worldSize;
        z = (Math.random() - 0.5) * worldSize;
      } while (isTooClose(x, z));

      treePositions.push({ x, z });
      treeGenerator.createMediumTree(x, z);
    }

    // Create smaller number of clusters
    for (let i = 0; i < numberOfClusters; i++) {
      const clusterX = (Math.random() - 0.5) * worldSize;
      const clusterZ = (Math.random() - 0.5) * worldSize;

      // Reduced trees per cluster (2-3 instead of 3-5)
      const treesInCluster = Math.floor(Math.random() * 2) + 2;

      for (let j = 0; j < treesInCluster; j++) {
        const offset = 2.5;
        const x = clusterX + (Math.random() - 0.5) * offset;
        const z = clusterZ + (Math.random() - 0.5) * offset;

        if (!isTooClose(x, z)) {
          treePositions.push({ x, z });
          if (Math.random() > 0.5) {
            treeGenerator.createLargeTree(x, z);
          } else {
            treeGenerator.createMediumTree(x, z);
          }
        }
      }
    }
  }

  update() {
    // World update logic here
  }
}
