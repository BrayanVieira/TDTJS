class Physics {
    static gravity = -9.81;

    static applyGravity(object) {
        if (!object.isGrounded) {
            object.velocity.y += this.gravity * object.mass * 0.01; // Adjust the multiplier for frame rate
        }
    }

    static move(object, deltaTime) {
        object.position.x += object.velocity.x * deltaTime;
        object.position.y += object.velocity.y * deltaTime;
        object.position.z += object.velocity.z * deltaTime;
    }

    static resetVelocity(object) {
        object.velocity.x = 0;
        object.velocity.y = 0;
        object.velocity.z = 0;
    }
}

export default Physics;