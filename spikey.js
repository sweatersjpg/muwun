function spikey(game) {
    game.spikies.push(this);

    this.missed = false;
    this.mt = 0;

    this.w = 6;
    this.h = 6;
    this.pos = new Vector(-game.pos.x + 464 + random(128), random(32, 240 - 32));

    this.Fs = [39, 42, 45, 87, 90, 93];
    this.t = 0;

    this.r = random([0, 90, 180, 270]);
    this.d = random([true, false]);

    this.update = () => {

        if (this.pos.x < -game.pos.x - 64) this.kill();
    }

    this.draw = () => {

        lset(3);

        this.t += 0.5;
        this.t %= this.Fs.length;

        let frame = this.Fs[floor(this.t)];

        // lset(5);
        // palset([31, 64, 64, 64, 64, 64, 64])
        // spr(0, this.pos.x + game.pos.x - 8, this.pos.y - 8);
        // lset(2);

        palset([game.pal, game.pal + 10, 64, 64, 64, 64]);

        if (this.mt) {
            palset([game.pal + 15, game.pal + 10, 64, 64, 64, 64]);
            this.mt--;
        }
        spr(frame, this.pos.x + game.pos.x - 24, this.pos.y - 24, 3, 3, this.d, this.r);
    }

    this.hit = (cat) => {
        let x = (this.pos.x - this.w < cat.pos.x + cat.w && this.pos.x + this.w > cat.pos.x - cat.w);
        let y = (this.pos.y - this.h < cat.pos.y + cat.h && this.pos.y + this.h > cat.pos.y - cat.h);
        return x && y;
        // return this.pos.dist(cat.pos) < 16
    }

    this.kill = () => {
        game.spikies.splice(game.spikies.indexOf(this), 1);
    }
}

function NearMiss(game, sx, sy) {
    Animation.call(this, game);

    this.draw = () => {
        let x = sx + 24;
        let y = sy - 4;

        let c = game.pal;
        if (this.t > 2) c = game.pal + 10;
        if (this.t > 8 && frameCount % 2) return;
        if (this.t > 15) this.kill();
        this.t++;

        lset(5);
        put("near miss", x + game.pos.x, y, c);
    }
}