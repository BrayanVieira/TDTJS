class ThirdPersonControls {
    constructor(camera, player) {
        this.camera = camera;
        this.player = player;
        this.enabled = true;

        // Bind event listeners
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.init();
    }

    init() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (!this.enabled) return;

        switch (event.code) {
            case 'KeyW':
                this.player.move('forward');
                break;
            case 'KeyS':
                this.player.move('backward');
                break;
            case 'KeyA':
                this.player.move('left');
                break;
            case 'KeyD':
                this.player.move('right');
                break;
            case 'Space':
                this.player.attack();
                break;
            case 'E':
                this.player.interact();
                break;
        }
    }

    handleKeyUp(event) {
        // Handle key release if necessary
    }

    update() {
        // Update camera position based on player position
        this.camera.position.set(this.player.position.x, this.player.position.y + 2, this.player.position.z - 5);
        this.camera.lookAt(this.player.position);
    }

    dispose() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.enabled = false;
    }
}

export default ThirdPersonControls;