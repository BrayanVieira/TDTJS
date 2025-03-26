export class Item {
    name: string;
    type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    use(): void {
        console.log(`Using item: ${this.name}`);
        // Implement item usage logic here
    }
}