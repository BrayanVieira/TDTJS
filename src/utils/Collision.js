function detectCollision(objectA, objectB) {
    const boxA = objectA.getBoundingBox();
    const boxB = objectB.getBoundingBox();

    return (
        boxA.min.x <= boxB.max.x &&
        boxA.max.x >= boxB.min.x &&
        boxA.min.y <= boxB.max.y &&
        boxA.max.y >= boxB.min.y &&
        boxA.min.z <= boxB.max.z &&
        boxA.max.z >= boxB.min.z
    );
}

function handleCollision(objectA, objectB) {
    if (detectCollision(objectA, objectB)) {
        // Handle collision response
        const collisionNormal = objectB.position.clone().sub(objectA.position).normalize();
        objectA.position.add(collisionNormal.multiplyScalar(0.1)); // Push objectA out of objectB
    }
}

export { detectCollision, handleCollision };