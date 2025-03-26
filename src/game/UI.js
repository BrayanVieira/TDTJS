export class UI {
  constructor(player) {
    this.player = player;
    this.createStaminaBar();
  }

  createStaminaBar() {
    this.staminaBar = document.createElement("div");
    this.staminaBar.style.position = "fixed";
    this.staminaBar.style.bottom = "20px";
    this.staminaBar.style.left = "20px";
    this.staminaBar.style.width = "200px";
    this.staminaBar.style.height = "10px";
    this.staminaBar.style.backgroundColor = "#333";
    this.staminaBar.style.border = "2px solid #fff";

    this.staminaFill = document.createElement("div");
    this.staminaFill.style.width = "100%";
    this.staminaFill.style.height = "100%";
    this.staminaFill.style.backgroundColor = "#00ff00";
    this.staminaFill.style.transition = "width 0.1s";

    this.staminaBar.appendChild(this.staminaFill);
    document.body.appendChild(this.staminaBar);

    // Add stamina text display
    this.staminaText = document.createElement("div");
    this.staminaText.style.position = "fixed";
    this.staminaText.style.bottom = "35px";
    this.staminaText.style.left = "20px";
    this.staminaText.style.color = "#fff";
    this.staminaText.style.fontFamily = "Arial";
    this.staminaText.style.fontSize = "12px";

    document.body.appendChild(this.staminaText);
  }

  update() {
    const staminaPercentage = this.player.getStaminaPercentage();
    this.staminaFill.style.width = `${staminaPercentage}%`;

    // Update stamina text
    this.staminaText.textContent = `Stamina: ${Math.floor(
      this.player.currentStamina
    )}/${this.player.maxStamina}`;

    // Update color based on stamina level and sprint availability
    if (!this.player.canSprint) {
      this.staminaFill.style.backgroundColor = "#ff0000";
    } else if (staminaPercentage < 30) {
      this.staminaFill.style.backgroundColor = "#ff6600";
    } else if (staminaPercentage < 60) {
      this.staminaFill.style.backgroundColor = "#ffff00";
    } else {
      this.staminaFill.style.backgroundColor = "#00ff00";
    }
  }
}
