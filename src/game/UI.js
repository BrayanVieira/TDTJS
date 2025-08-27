export class UI {
  constructor(player) {
    this.player = player;
    this.createStaminaBar();
    this.createCollectionProgressBar();
    this.createInventoryDisplay();
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

    this.staminaText = document.createElement("div");
    this.staminaText.style.position = "fixed";
    this.staminaText.style.bottom = "35px";
    this.staminaText.style.left = "20px";
    this.staminaText.style.color = "#fff";
    this.staminaText.style.fontFamily = "Arial";
    this.staminaText.style.fontSize = "12px";

    document.body.appendChild(this.staminaText);
  }

  createCollectionProgressBar() {
    this.collectionProgressBar = document.createElement("div");
    this.collectionProgressBar.style.position = "fixed";
    this.collectionProgressBar.style.bottom = "50px";
    this.collectionProgressBar.style.left = "50%";
    this.collectionProgressBar.style.transform = "translateX(-50%)";
    this.collectionProgressBar.style.width = "300px";
    this.collectionProgressBar.style.height = "20px";
    this.collectionProgressBar.style.backgroundColor = "#333";
    this.collectionProgressBar.style.border = "2px solid #fff";
    this.collectionProgressBar.style.display = "none";

    this.collectionProgressFill = document.createElement("div");
    this.collectionProgressFill.style.width = "0%";
    this.collectionProgressFill.style.height = "100%";
    this.collectionProgressFill.style.backgroundColor = "#ffc107";

    this.collectionProgressBar.appendChild(this.collectionProgressFill);
    document.body.appendChild(this.collectionProgressBar);
  }

  createInventoryDisplay() {
    this.inventoryDisplay = document.createElement("div");
    this.inventoryDisplay.style.position = "fixed";
    this.inventoryDisplay.style.top = "20px";
    this.inventoryDisplay.style.right = "20px";
    this.inventoryDisplay.style.padding = "10px";
    this.inventoryDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.inventoryDisplay.style.color = "#fff";
    this.inventoryDisplay.style.fontFamily = "Arial";
    this.inventoryDisplay.style.fontSize = "14px";
    this.inventoryDisplay.style.border = "1px solid #fff";

    document.body.appendChild(this.inventoryDisplay);
  }

  update() {
    this.updateStamina();
    this.updateCollectionUI();
    this.updateInventoryUI();
  }

  updateStamina() {
    const staminaPercentage = this.player.getStaminaPercentage();
    this.staminaFill.style.width = `${staminaPercentage}%`;

    this.staminaText.textContent = `Stamina: ${Math.floor(
      this.player.currentStamina
    )}/${this.player.maxStamina}`;

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

  updateCollectionUI() {
    if (this.player.isCollecting) {
      this.collectionProgressBar.style.display = "block";
      const progress = (this.player.collectionProgress / this.player.collectionTime) * 100;
      this.collectionProgressFill.style.width = `${progress}%`;
    } else {
      this.collectionProgressBar.style.display = "none";
    }
  }

  updateInventoryUI() {
    const inventory = this.player.inventory;
    let inventoryHTML = "<strong>Inventory</strong><br>";
    for (const item in inventory) {
      inventoryHTML += `${item}: ${inventory[item]}<br>`;
    }
    this.inventoryDisplay.innerHTML = inventoryHTML;
  }
}
