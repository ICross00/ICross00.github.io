let buttons = [];
const pc = [0, 180, 245];

class OrderedButton {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.position = 3
        this.hover = false;
    }

    isInside(x, y) {
        const inside = (this.x <= x && x <= this.x + this.width) && (this.y <= y && y <= this.y + this.height);
        this.hover = inside;
        return inside;
    }

    draw(ctx) {
        //Colors were reverted to monochrome grayscale from grey/green due to peripheral vision color perception being variable
        let tv = pc[this.position - 1];
        ctx.fillStyle = grayscaleToHex(tv + (this.isInside(ctx.mouseX, ctx.mouseY) ? Math.floor((255 - tv) / 4) : 0));

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    //Indicates the order the button is to be clicked, 1 = next, 2 = second, 3=beyond
    setPosition(position) {
        this.position = position;
    }
}

class OrderedButtonCollection {
    constructor(buttonsr) {
        this.buttons = buttonsr;
    }

    generate(padding, xwidth, ywidth, sidelength) {
        const sx = padding;
        const ex = xwidth - sidelength - padding;
        const sy = padding;
        const ey = ywidth - sidelength - padding;

        const c = 5;
        const r = 4;

        for (let j = 0; j < r; j++) {
            for (let i = 0; i < c; i++) {
                let x = sx + (i * (ex - sx)) / (c - 1);
                let y = sy + (j * (ey - sy)) / (r - 1);

                let b = new OrderedButton(x, y, sidelength, sidelength);
                this.addButton(b);
            }
        }

    }

    forEach(f) {
        this.buttons.forEach((b) => { f(b) });
    }

    addButton(button) {
        this.buttons.push(button);
    }

    clickTop() {
        this.buttons.pop();
    }

    getNumButtons() {
        return this.buttons.length;
    }

    updateTopPositions() {
        const len = this.buttons.length;
        this.buttons.forEach((btn) => { btn.setPosition(3) });

        if (len > 0)
            this.buttons[len - 1].setPosition(1);
        if (len > 1)
            this.buttons[len - 2].setPosition(2);
    }
    //Randomizes the order of the buttons using Durstenfeld algorithm
    shuffle() {
        for (let i = this.buttons.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            var temp = this.buttons[i];
            this.buttons[i] = this.buttons[j];
            this.buttons[j] = temp;
        }

        this.updateTopPositions();
    }
}
