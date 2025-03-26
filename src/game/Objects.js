import * as THREE from "three";

export class TreeGenerator {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
  }

  createLargeTree(x, z) {
    const treeGroup = new THREE.Group();

    // Create trunk mesh
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4b3621 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    treeGroup.add(trunk);

    // Create leaves
    const leavesGeometry = new THREE.ConeGeometry(2, 6, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0d5c0d });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 4;
    treeGroup.add(leaves);

    // Create collision box
    const colliderGeometry = new THREE.BoxGeometry(1.4, 4, 1.4);
    const colliderMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      visible: true,
    });
    const collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
    collider.position.y = 2;

    // Position tree and collider
    treeGroup.position.set(x, 0, z);
    this.scene.add(treeGroup);

    // Create and store collision box
    const box = new THREE.Box3().setFromObject(collider);
    box.min.add(new THREE.Vector3(x, 0, z));
    box.max.add(new THREE.Vector3(x, 0, z));

    this.colliders.push({
      box: box,
      mesh: collider,
    });

    treeGroup.add(collider);
    return treeGroup;
  }

  createMediumTree(x, z) {
    const treeGroup = new THREE.Group();

    // Create trunk mesh
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2.5, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4b3621 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    treeGroup.add(trunk);

    // Create leaves
    const leavesGeometry = new THREE.ConeGeometry(1.5, 4, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0d5c0d });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5;
    treeGroup.add(leaves);

    // Create collision box
    const colliderGeometry = new THREE.BoxGeometry(0.8, 2.5, 0.8);
    const colliderMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      visible: true, // Set to true for debugging
    });
    const collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
    collider.position.y = 1.25;
    treeGroup.add(collider);

    // Position tree
    treeGroup.position.set(x, 0, z);
    this.scene.add(treeGroup);

    // Store collider with world position
    const worldCollider = {
      min: new THREE.Vector3(x - 0.4, 0, z - 0.4),
      max: new THREE.Vector3(x + 0.4, 2.5, z + 0.4),
    };
    this.colliders.push(worldCollider);

    return treeGroup;
  }

  getColliders() {
    return this.colliders;
  }
}
