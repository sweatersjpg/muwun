

function Title(cat, pal, pos, vel, gameover) {

    this.vel = new Vector(vel, 0);
    this.pos = new Vector(pos, 0);

    this.background = new Background(this);
    this.splashText = new SplashText(this);

    this.cat = cat;

    this.gameover = gameover;
    this.score = gameover;

    if (typeof pal === 'undefined') this.pal = 0;
    else this.pal = pal;

    this.pal = random([0, 16]);
    if (gameover) this.pal = 48;

    this.particles = [];

    this.frameRate = FRAMERATE;
    this.shake = new Vector();

    this.anyKeyPressed = false;
    // this.anyKeyJustPressed = false;
    this.timer = new Date();

    this.selected = 0;

    this.draw = () => {

        if (loadleft) {
            this.addPause(2);

            cls(32);
            lset(5);

            setSpriteSheet("nenesLogo");

            palset([11, 64, 11]);
            spr(0, 200 - 8 * 8, D.H / 2 - 32, 8, 1);
            palset([11, 11, 64]);
            spr(0, 200 - 8 * 8, D.H / 2 - 16, 8, 1);
            put("by sweatersjpg", 200 - 14 * 4, D.H / 2, 0);

            put("LOADING", 200 - 4 * 7, D.H / 2 + 10, 11);

            setSpriteSheet("spriteSheet");

            if (loadleft == 1) {
                this.pal = 16;
                this.background.draw();
                this.pal = 32;
                this.background.draw();
                this.pal = 48;
                this.background.draw();
                this.pal = 0;
                this.background.draw();
                this.pal = random([0, 16]);
            }
            loadleft--;
            return;
        }

        if (gameover) this.pal = 48;

        cls(this.pal + 11);

        // if (btn('a') && !pbtn('a')) {
        //     drawFN = new Game();
        //     return;
        // }

        // title logo
        let x = 200 - 8 * 7;
        let y = 64;

        setCamera(0, 0);
        setCamera(-this.shake.x, -this.shake.y);

        palset([this.pal + 15, this.pal + 4, this.pal + 13, this.pal + 12, this.pal, 64]);
        spr(96, x, y, 6, 4);
        spr(102, x + 6 * 16, y, 1, 4);

        palset([this.pal + 15, this.pal + 14, this.pal + 13, this.pal, 64, 64]);
        spr(163, x + 84, y + 32, 2, 2);

        spr(31, x + 25, y + 25);

        palset([this.pal + 14, this.pal + 13, this.pal, this.gameover ? this.pal : this.pal + 5, 64, 64]);
        spr(64, 200 + 8 * 2, 120 + 10, 2, 2, true);

        let tailFs = [50, 51, 52, 52, 51, 50, 53, 15, 15, 53];

        spr(tailFs[floor(frameCount / 4) % tailFs.length], 200 + 8 * 2 + 30, 120 + 8 + 18, 1, 1, true);

        this.splashText.draw(200 + 8 * 5, 122);

        if (this.gameover) {
            this.drawScore(200 - 7 * 8, 120 + 12);
            let t = "press any key";
            if (isMobile) t = "tap to start";
            if (frameCount % 40 > 20) put(t, 200 - t.length * 4, 133 + 64, this.pal);
        } else {
            this.menu(200 - 7 * 8, 120 + 12);
        }

        if (this.frameRate < FRAMERATE) {
            this.frameRate = FRAMERATE;
            frameRate(FRAMERATE);
        }

        if (this.shake.mag() > 0.1) {
            if (gameover) this.shake.setMag(this.shake.mag() * 0.9);
            else this.shake.setMag(this.shake.mag() * 0.5);
            this.shake.rotate(this.shake.heading() + TWO_PI / 3);
        }

        let v = 1;
        if (abs(this.vel.x) > v + 0.1) this.vel.x += (abs(this.vel.x) - v) * 0.1;
        else this.vel.x = -v;

        this.pos.add(this.vel);

        this.background.draw();

        for (const p of this.particles) p.draw();

    }

    this.menu = (x, y) => {
        let mouse = new Vector(mouseX, mouseY).div(D.S);

        if (btn('up') && !pbtn('up')) {
            this.selected--;
            this.addShake(3);
        }
        if (btn('down') && !pbtn('down')) {
            this.selected++;
            this.addShake(3);
        }

        if (this.selected < 0) this.selected = 0;
        if (this.selected > 1) this.selected = 1;

        let sx = x; let sy = y - 1; let sw = 58 + 32; let sh = 14;
        if (mouse.x > sx && mouse.x < sx + sw && mouse.y > sy && mouse.y < sy + sh) this.selected = 0;

        sx = x; sy = y + 3 + 10; sw = 58 + 32; sh = 14;
        if (mouse.x > sx && mouse.x < sx + sw && mouse.y > sy && mouse.y < sy + sh) this.selected = 1;

        palset([this.pal + 15, this.pal + 14, this.pal + 13, this.pal, 64, 64]);
        spr(31, x, y + this.selected * 10);

        x += 16;
        y += 4;

        put("START", x - 1, y, this.pal);
        put("START", x + 1, y, this.pal);
        put("START", x, y - 1, this.pal);
        put("START", x, y + 1, this.pal);

        if (this.selected == 0) put("START", x, y, this.pal + 14);
        else put("START", x, y, this.pal + 13);

        y += 10;

        put("CREDITS", x - 1, y, this.pal);
        put("CREDITS", x + 1, y, this.pal);
        put("CREDITS", x, y - 1, this.pal);
        put("CREDITS", x, y + 1, this.pal);

        if (this.selected == 1) put("CREDITS", x, y, this.pal + 14);
        else put("CREDITS", x, y, this.pal + 13);

        if (this.selected == 1) {
            let sel = "";

            let sx = 200 - 12 * 4; let sy = y + 24 + 11; let sw = 12 * 8; let sh = 10;
            if (mouse.x > sx && mouse.x < sx + sw && mouse.y > sy && mouse.y < sy + sh) sel = "s";

            sx = 200 - 12 * 4; sy = y + 24 + 20; sw = 12 * 8; sh = 10;
            if (mouse.x > sx && mouse.x < sx + sw && mouse.y > sy && mouse.y < sy + sh) sel = "b";

            put("CREATED BY", 200 - 10 * 4, y + 24, this.pal);
            if (sel == "s") put("sweatersjpg", 200 - 11 * 4, y + 24 + 12, this.pal + 14);
            else put("sweatersjpg", 200 - 11 * 4, y + 24 + 12, this.pal);

            put("and ", 200 - 10 * 4, y + 24 + 21, this.pal);
            if (sel == "b") put("_bittr", 0, 0, this.pal + 14);
            else put("_bittr", 0, 0, this.pal);

            if (mouseIsPressed || touches[0]) {
                if (sel == "s") window.location.href = "https://twitter.com/SweatersJPG";
                if (sel == "b") window.location.href = "https://twitter.com/_bittr";
            }
        }

        if (btn('a') && !pbtn('a') && this.selected == 0) drawFN = new Game(true);
        if ((mouseIsPressed || touches[0]) && this.selected == 0) drawFN = new Game(true);
    }

    this.drawScore = (x, y) => {

        palset([this.pal + 15, this.pal + 14, this.pal + 13, this.pal, 64, 64]);
        spr(31, x, y + 9);

        x += 16;
        y += 4;

        put("SCORE:", x - 1, y, this.pal);
        put("SCORE:", x + 1, y, this.pal);
        put("SCORE:", x, y - 1, this.pal);
        put("SCORE:", x, y + 1, this.pal);

        put("SCORE:", x, y, this.pal + 14);

        y += 9;

        put(floor(this.score), x - 1, y, this.pal);
        put(floor(this.score), x + 1, y, this.pal);
        put(floor(this.score), x, y - 1, this.pal);
        put(floor(this.score), x, y + 1, this.pal);

        put(floor(this.score), x, y, this.pal + 15);

    }

    this.addPause = (amount) => {
        this.frameRate = amount;
        frameRate(amount);
    }

    this.addShake = (amount) => {
        this.shake.setMag(this.shake.mag() + amount);
    }

    this.keydown = () => {
        // this.anyKeyPressed = true;
        // this.anyKeyJustPressed = true;
        if (new Date() - this.timer > 2000 && this.gameover)
            drawFN = new Game();
    }

    this.mouseup = () => {
        if (new Date() - this.timer > 2000 && this.gameover)
            drawFN = new Game();
    }

    this.touchend = () => {
        if (new Date() - this.timer > 2000 && this.gameover)
            drawFN = new Game();
    }

}

let splashText = [
    "mew",
    "rytupwytjhsdfgkhkdfgshfgjetshdhgkshduerywuteryouphfjshfwgfew",
    ":3",
    "feed me, mortal",
    "slam me harder",
    "visit kett.ca",
    "owo",
    "uwu",
    "Uwu",
    "wafflez",
    "i'm a cat",
    "=^w^="
]

function SplashText(game, text) {
    this.t = 0;
    this.text = random(splashText);
    while (this.text == text) this.text = random(splashText);

    this.draw = (x, y) => {
        this.t += 0.25;

        if (game.gameover) {
            if (this.t > this.text.length + 30) this.t = this.text.length + 30;
            this.text = "GAME OVER";
        }

        let s = "";

        if (this.t < this.text.length) {
            for (let i = 0; i < floor(this.t); i++) {
                s += this.text.charAt(i);
            }
        } else s = this.text;

        if (this.text == "feed me, mortal" || game.gameover) {
            CORRUPTION = 0.002;

            if (random() < 0.1) {
                let temp = s.split("");
                temp[floor(random(temp.length))] = String.fromCharCode(floor(random(32, 100)));
                s = temp.join("");
            }
        } else {
            CORRUPTION = 0;
        }

        if (this.t > this.text.length + 30) drawFN.splashText = new SplashText(game, this.text);

        if (game.gameover) {
            x = x - s.length * 8 + 12;

            put(s, x + 1, y, drawFN.pal + 0);
            put(s, x - 1, y, drawFN.pal + 0);
            put(s, x, y + 1, drawFN.pal + 0);
            put(s, x, y - 1, drawFN.pal + 0);
            // palset([game.pal + 0, 64, 64, 64, 64, 64]);
            // spr(0, x - 1.5, y - 1.5, 1, 1, false, 0, s.length * 8 + 3, 11);

            put(s, x, y, drawFN.pal + 10);
        }
        else put(s, x - s.length * 4, y, drawFN.pal + 5);

    }
}