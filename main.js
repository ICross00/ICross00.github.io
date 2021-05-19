let state = "awaitstart";
let bcoll = new OrderedButtonCollection([]);
let result = {};

let starttime = 0.0;
let time = 0.0;

let cclick = 0;
let tclick = 0;
let aclick = 0;

let ntest = 0;
let dpi = 0;

let lastclickedX = 0;
let lastclickedY = 0;
let lastclicktime = 0;

function initContext() {
    let c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#333";
    ctx.font = "bold 20px Arial";

    c.onmousemove = function (e) {
        ctx.mouseX = e.clientX - ctx.canvas.offsetLeft;
        ctx.mouseY = e.clientY - ctx.canvas.offsetTop;
    };

    c.onmousedown = function (e) {
        ctx.mouseX = e.clientX - ctx.canvas.offsetLeft;
        ctx.mouseY = e.clientY - ctx.canvas.offsetTop;

        if (state == "awaitstart")
            return;

        aclick++;

        bcoll.forEach((b) => {
            if (b.hover) {
                if (b.position == 1) {
                    bcoll.clickTop();
                    bcoll.updateTopPositions();
                    cclick++;

                    //click time, distance, attempted clicks
                    let struct = [Date.now() - lastclicktime, distance(ctx.mouseX, ctx.mouseY, lastclickedX, lastclickedY), aclick];
                    result[dpi]["raw"].push(struct);

                    //update last click info
                    lastclicktime = Date.now();
                    lastclickedX = ctx.mouseX;
                    lastclickedY = ctx.mouseY;

                    aclick = 0;
                    if (state == "awaitclick") {
                        start();
                    } else if (state == "running") {
                        if (bcoll.getNumButtons() == 0) {
                            ntest++;
                            console.log("test");
                            cclick--;
                            finish();
                        }
                    }
                }
            }
        });
        tclick++;
        console.log(cclick, tclick);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bcoll.forEach(btn => btn.draw(ctx));

    switch (state) {
        case "awaitclick":
            ctx.fillText("Click the black square to begin", 640, 20);
            break;

        case "running":
            let time = Date.now() - starttime;
            let acc = cclick / tclick;
            ctx.fillText("Time: " + (time / 1000).toFixed(2) + " || Accuracy: " + acc.toFixed(2), 640, 20);
            break;

    }
}

function initLayout() {
    bcoll.generate(72, 1280, 720, 30);
    bcoll.updateTopPositions();
}

function requestStart() {
    if (state == "awaitstart") {
        //disable start button
        const sbutton = document.getElementById("startbutton");
        sbutton.disabled = true;

        //randomize array
        bcoll.shuffle();
        state = "awaitclick";

        dpi = promptEnterInt("Enter DPI value for test #" + ntest);
        result[dpi] = {};
        result[dpi]["raw"] = [];
    }
}

function start() {
    starttime = Date.now();
    lastclicktime = starttime;
    state = "running";
}

function finish() {
    state = "intermission";

    const time = (Date.now() - starttime) / 1000;
    const acc = cclick / tclick;

    //Aggregate score of time and accuracy
    //Squaring accuracy provides more weighting to the accuracy, as accuracy tended to be between 85-100%
    //We define a lower score as being "more precise" than a higher score
    const score = time / (acc * acc);

    result[dpi]["time"] = time;
    result[dpi]["acc"] = acc;
    result[dpi]["score"] = score;
    console.log(acc);
    let cont = window.confirm("Repeat test?");

    if (!cont) {
        //Save results table
        download(JSON.stringify(result), "experiment-" + Date.now().toString());
    } else {
        state = "awaitstart";
        initLayout();

        const sbutton = document.getElementById("startbutton");
        sbutton.disabled = false;
    }

    cclick = 0;
    tclick = 0;
}

function update() {
    draw();
}

function main() {
    initLayout();
    initContext();
    setInterval(update, 50);
}


main();