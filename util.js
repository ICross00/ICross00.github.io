

function download(text, fname) {
    const a = document.createElement('a');
    const file = new Blob([text], { type: "text/plain" });

    a.href = URL.createObjectURL(file);
    a.download = fname;
    a.click();


    URL.revokeObjectURL(a.href);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function grayscaleToHex(v) {
    return rgbToHex(v, v, v);
}

function promptEnterInt(text) {
    let x = prompt(text);

    while(true) {
        xi = parseInt(x);

        if(!isNaN(xi)) {
            return xi;
        }

        x = prompt("Invalid input. " + text);
    }
}

function distance(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}