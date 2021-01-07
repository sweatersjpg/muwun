


function Ore(game, second) {
    this.pos = new Vector(-game.pos.x + (!second ? 400 + 16 : random(400 + 32, 400 + 64)), floor(random(2)) ? 16 : 240 - 16);
    game.ore0s.push(this);

    this.w = 24;
    this.h = 16;

    this.update = () => {
        if (this.pos.x < -game.pos.x - 64) this.kill();

        if (random() < 0.3) new Sparkle(game, random(this.pos.x - 16, this.pos.x + 8), random(this.pos.y - 16, this.pos.y + 8), true, 5);

        if (game.cat.wasAirborn && this.hit(game.cat)) this.kill(true);
    }

    this.draw = () => {

        let r = 0;
        let d = false;
        if (this.pos.y < 120) {
            r = 180;
            d = true;
        }

        lset(4);
        palset([game.pal + 15, game.pal + 14, game.pal + 13, game.pal, 64, 64]);
        spr(13, this.pos.x + game.pos.x - 16, this.pos.y - 16, 2, 2, d, r);

    }

    this.hit = (cat) => {
        let x = (this.pos.x - this.w < cat.pos.x + cat.w && this.pos.x + this.w > cat.pos.x - cat.w);
        let y = (this.pos.y - this.h < cat.pos.y + cat.h && this.pos.y + this.h > cat.pos.y - cat.h);
        return x && y;
    }

    this.kill = (hit) => {
        game.ore0s.splice(game.ore0s.indexOf(this), 1);

        if (hit) for (let index = 0; index < 3; index++) {
            new Jem(game, this.pos.x + game.pos.x, this.pos.y);
        }
    }

}

function Jem(game, x, y) {
    Animation.call(this, game);
    if (y < 140) this.vel = new Vector(random(2, 4), 0).rotate(random(0, PI));
    else this.vel = new Vector(random(2, 4), 0).rotate(random(-PI, 0));
    this.pos = new Vector(x, y);

    this.speed = 0;

    this.frames = [136, 138, 140, 142];

    this.ft = random([0, 1, 2, 3]);

    this.pals = [
        [game.pal + 15, 64, 64, 64, 64, 64],
        [game.pal + 15, game.pal + 15, 64, 64, 64, 64],
        [game.pal + 15, game.pal + 15, game.pal + 15, 64, 64, 64],
        [game.pal + 15, 64, 64, game.pal + 15, 64, 64],
        [game.pal + 15, game.pal + 14, game.pal + 13, game.pal, 64, 64]
    ]

    this.draw = () => {
        let w = (floor(game.displayScore) + "").length * 8;
        let dest = new Vector(56 + 8 - w, 56);

        if (this.t < 5) {
            this.vel.setMag(this.vel.mag() * 0.95);
        } else {

            let dir = this.pos.copy().sub(dest);

            this.speed += 1;

            dir.setMag(-this.speed);

            this.vel.set(dir);
        }

        this.pos.add(this.vel);

        // if (this.pos.x > dest.x) this.kill();
        let killed = false;
        let oldPos = this.pos.copy();
        this.pos.sub(this.vel);
        for (let i = 0; i < 8; i++) {
            if (this.pos.dist(dest) < 16) {
                this.kill();
                killed = true;
                break;
            }
            this.pos.add(this.vel.copy().div(8));
        }
        if (!killed) this.pos.set(oldPos);

        this.t += 0.5;

        this.ft += 0.5;
        this.ft %= this.frames.length;

        this.setPal();

        spr(this.frames[floor(this.ft)], this.pos.x - 16, this.pos.y - 16, 2, 2);
    }

    this.defaultKill = this.kill;
    this.kill = () => {
        this.defaultKill();
        game.addPoints(1);

        new Animation(game, [208, 208, 209, 209, 210, 210, 211, 211, 212, 212], [64, game.pal + 15, game.pal + 15, 64, 64, 64], this.pos.x - 8, this.pos.y - 8);
    }
}