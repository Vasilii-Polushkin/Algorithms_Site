import {ants, colony, rows, cols} from "./main.js"

export class View {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    draw() {
        this.ctx.fillStyle = '#047344';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        /*for (let wall of walls)
            wall.draw(this.ctx);

        for (let food of model.listFood)
            food.draw(this.ctx);*/

        for (let ant of ants)
            ant.draw(this.ctx, this.fw);

        colony.draw(this.ctx);
    }

    onResize() {
        this.canvas.height = rows;
        this.canvas.width = cols;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.shadowColor = 'Black';
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.fw = new Flyweight();
    }
}

export class Flyweight {
    static Pi05 = Math.PI / 2;
    static Pi2 = Math.PI * 2;

    // Статичные данные
    constructor() {
        this.size = 2;
        this.line = this.size * 0.2;
        this.size025 = this.size * 0.25;
        this.size05 = this.size * 0.5;
        this.size125 = this.size * 1.25;
        this.size15 = this.size * 1.5;
        this.size2 = this.size * 2;
        this.size22 = this.size * 2.2;
        this.size25 = this.size * 2.5;
        this.size28 = this.size * 2.8;
        this.size3 = this.size * 3;
        this.size35 = this.size * 3.5;
        this.size4 = this.size * 4;
        this.size45 = this.size * 4.5;
        this.size6 = this.size * 6;
        this.size8 = this.size * 8;
    }
}