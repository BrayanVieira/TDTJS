export class Enemy {
    position: { x: number; y: number; z: number };
    health: number;

    constructor(position: { x: number; y: number; z: number }, health: number) {
        this.position = position;
        this.health = health;
    }

    move(newPosition: { x: number; y: number; z: number }) {
        this.position = newPosition;
    }

    attack() {
        // Implement attack logic here
    }
}