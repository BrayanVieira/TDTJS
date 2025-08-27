import * as THREE from "three";

export class TreeGenerator {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Array to store collision objects
  }

  /**
   * Creates a single standard tree (visual mesh) and its collision box.
   * @param {THREE.Vector3} position - The position to create the tree.
   */
  createTree(position) {
    // Create the visual mesh for the tree (e.g., a simple cylinder)
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 5, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 }); // Wood color
    const treeMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    treeMesh.userData.type = 'wood';

    // Position the tree (adjusting height so the base is on the ground)
    treeMesh.position.copy(position);
    treeMesh.position.y = 2.5; // Half the cylinder's height

    // --- CREATE THE COLLISION BOX (from trunk only) ---
    const treeBox = new THREE.Box3();
    treeBox.setFromObject(treeMesh);

    const leavesGeometry = new THREE.ConeGeometry(2, 5, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 }); // Forest green
    const leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leavesMesh.position.y = 5; // Position leaves on top of the trunk
    treeMesh.add(leavesMesh); // Add leaves as a child of the trunk

    this.scene.add(treeMesh);

    // Store the collision object
    this.colliders.push({ mesh: treeMesh, box: treeBox });
  }

  /**
   * Creates a single large tree (visual mesh) and its collision box.
   * @param {THREE.Vector3} position - The position to create the tree.
   */
  createLargeTree(position) {
    // Create a larger visual mesh for the tree
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 6, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 }); // Darker wood
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunkMesh.userData.type = 'wood';

    // Position the trunk
    trunkMesh.position.copy(position);
    trunkMesh.position.y = 3; // Half the trunk's height

    // --- CREATE THE COLLISION BOX (from trunk only) ---
    const treeBox = new THREE.Box3();
    treeBox.setFromObject(trunkMesh);

    // Create leaves (e.g., a sphere)
    const leavesGeometry = new THREE.ConeGeometry(2.5, 6, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 }); // Forest green
    const leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leavesMesh.position.y = 6; // Position leaves on top of the trunk
    trunkMesh.add(leavesMesh); // Add leaves as a child of the trunk

    this.scene.add(trunkMesh);

    // Store the collision object
    this.colliders.push({ mesh: trunkMesh, box: treeBox });
  }

  // Returns the list of colliders for the Player to check against
  getColliders() {
    return this.colliders;
  }
}

export class RockGenerator {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
  }

  createRock(position) {
    const geometry = new THREE.DodecahedronGeometry(0.8, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const rockMesh = new THREE.Mesh(geometry, material);
    rockMesh.userData.type = 'stone';
    rockMesh.position.copy(position);
    rockMesh.position.y = 0.5;
    this.scene.add(rockMesh);

    const rockBox = new THREE.Box3();
    rockBox.setFromObject(rockMesh);
    this.colliders.push({ mesh: rockMesh, box: rockBox });
  }

  createIronVein(position) {
    const rockGeometry = new THREE.DodecahedronGeometry(0.8, 0);
    const rockMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
    rockMesh.userData.type = 'iron';
    rockMesh.position.copy(position);
    rockMesh.position.y = 0.5;

    const ironGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const ironMaterial = new THREE.MeshPhongMaterial({ color: 0x43464B });
    const ironMesh = new THREE.Mesh(ironGeometry, ironMaterial);
    ironMesh.position.set(0.3, 0.3, 0.3);
    rockMesh.add(ironMesh);

    this.scene.add(rockMesh);

    const rockBox = new THREE.Box3();
    rockBox.setFromObject(rockMesh);
    this.colliders.push({ mesh: rockMesh, box: rockBox });
  }

  createGoldVein(position) {
    const rockGeometry = new THREE.DodecahedronGeometry(0.8, 0);
    const rockMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
    rockMesh.userData.type = 'gold';
    rockMesh.position.copy(position);
    rockMesh.position.y = 0.5;

    const goldGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const goldMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
    const goldMesh = new THREE.Mesh(goldGeometry, goldMaterial);
    goldMesh.position.set(-0.3, -0.3, -0.3);
    rockMesh.add(goldMesh);

    this.scene.add(rockMesh);

    const rockBox = new THREE.Box3();
    rockBox.setFromObject(rockMesh);
    this.colliders.push({ mesh: rockMesh, box: rockBox });
  }

  getColliders() {
    return this.colliders;
  }
}
