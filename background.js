function Background(game) {
    this.stars = [];
    for (let i = 0; i < 200; i++) this.stars.push(new Star(game));

    this.draw = () => {
        lset(0);
        this.sky();

        lset(1);
        this.ground();

    }

    this.ground = () => {
        let x = game.pos.x;

        //buttox

        palset([game.pal + 9, game.pal + 9, 64, 64, 64]);
        spr(0, 0, 240 - 56 + 16, 1, 1, false, 0, 400, 64);
        let bx = 256 - (abs(x * 0.25) % 256);
        spr(208, bx + 256, 240 - 56, 16, 1);
        spr(208, bx, 240 - 56, 16, 1);
        spr(208, bx - 256, 240 - 56, 16, 1);

        palset([game.pal + 8, game.pal + 7, 64, 64, 64]);
        let mx = 256 - (abs(x * 0.5) % 256);
        spr(224, mx + 256, 240 - 56, 16, 2);
        spr(224, mx, 240 - 56, 16, 2);
        spr(224, mx - 256, 240 - 56, 16, 2);

        palset([game.pal + 5, game.pal + 4, game.pal + 3, game.pal + 2, game.pal + 0, 64]);
        let fx = 256 - (abs(x) % 256);
        spr(256, fx + 256, 240 - 32, 16, 2);
        spr(256, fx, 240 - 32, 16, 2);
        spr(256, fx - 256, 240 - 32, 16, 2);

        //top

        palset([game.pal + 7, game.pal + 7, 64, 64, 64]);
        spr(0, 0, - 16, 1, 1, false, 0, 400, 64);
        spr(208, bx + 256, 56 - 16, 16, 1, true, 180);
        spr(208, bx, 56 - 16, 16, 1, true, 180);
        spr(208, bx - 256, 56 - 16, 16, 1, true, 180);

        palset([game.pal + 12, game.pal + 11, 64, 64, 64]);
        spr(224, mx + 256, 56 - 32, 16, 2, true, 180);
        spr(224, mx, 56 - 32, 16, 2, true, 180);
        spr(224, mx - 256, 56 - 32, 16, 2, true, 180);

        palset([game.pal + 5, game.pal + 4, game.pal + 3, game.pal + 2, game.pal + 0, 64]);
        spr(256, fx + 256, 0, 16, 2, true, 180);
        spr(256, fx, 0, 16, 2, true, 180);
        spr(256, fx - 256, 0, 16, 2, true, 180);

        //foreground
        lset(6);
        bx = 256 - (abs(x * 1.5) % 256);

        let c = 0;
        if (game.pal >= 32) c = 32;
        palset([c, c, c, c, c, 64]);

        // palset([0, 0, 0, 0, 0, 64])
        spr(256, bx + 256, 240 - 12, 16, 1, true);
        spr(256, bx, 240 - 12, 16, 1, true);
        spr(256, bx - 256, 240 - 12, 16, 1, true);
        spr(256, bx + 256, -4, 16, 1, false, 180);
        spr(256, bx, -4, 16, 1, false, 180);
        spr(256, bx - 256, -4, 16, 1, false, 180);

    }

    this.sky = () => {
        if (random() < 0.03) new Sparkle(game, random(400), random(240), false, 0);

        let y = 50;
        for (let i = 0; i < 25; i++) {
            let x = i * 16;
            palset([game.pal + 11, game.pal + 7, 64, 64, 64]);
            spr(38, x, y, 1, 4);
            palset([game.pal + 7, game.pal + 12, 64, 64, 64]);
            spr(38, x, y + 64, 1, 4);
        }
        palset([game.pal + 12, 64, 64, 64, 64]);
        spr(0, 0, y + 128, 1, 1, false, 0, 400, 64);

        for (const s of this.stars) s.draw();

        // planets
        if (game.pal == 0) {
            palset([game.pal + 10, game.pal + 11, 64, 64, 64]);
            spr(170, 128, 50, 3, 3);
        } else if (game.pal == 16) {
            palset([game.pal + 2, game.pal + 10, game.pal + 11, 64, 64, 64]);
            spr(167, 128, 50, 3, 3);
        } else if (game.pal == 32) {
            palset([game.pal + 2, game.pal + 10, game.pal + 12, game.pal + 11, 64, 64]);
            spr(173, 128, 50, 3, 3);
        }
    }
}

function Star(game) {
    this.pos = new Vector(floor(random(400) / 8) * 8, floor(random(240) / 8) * 8);
    this.frame = 135;
    let r = random();
    if (r < 0.2) this.frame = 151;
    if (r < 0.1) this.frame = 31;

    this.color = random([15, 12, 8]);

    this.draw = () => {
        palset([64, 64, 64, 64, game.pal + this.color, 64]);
        spr(this.frame, this.pos.x, this.pos.y);
    }
}

function Sparkle(game, x, y, moves, layer) {
    Animation.call(this, game);

    this.pals = [
        [game.pal + 15, 64, 64, 64, 64, 64],
        [game.pal + 15, game.pal + 15, 64, 64, 64, 64],
        [game.pal + 15, game.pal + 15, game.pal + 15, 64, 64, 64],
        [game.pal + 15, 64, 64, game.pal + 15, 64, 64],
    ]

    this.draw = () => {
        let old = currentLayer;
        lset(layer);

        this.t += 0.5;
        if (this.t == this.pals.length - 1) this.kill();

        this.setPal();

        if (moves) spr(16, x + game.pos.x, y, 1, 1);
        else spr(16, x, y, 1, 1);

        lset(old);
    }
}