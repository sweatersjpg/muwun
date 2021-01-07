let MIN_GRAV = 0.5
let GRAV = MIN_GRAV;
let ground = 240 - 32;

let jumpHeight = 150 - 32;
let jumpDist = 200;

let startX = 100;

function Cat(game, tutorial) {
    this.pos = new Vector(-32, ground);
    this.vel = new Vector(0, 0);

    this.dir = 1;

    GRAV = this.dir * (8 * jumpHeight * game.vel.x * game.vel.x) / (jumpDist * jumpDist);

    this.t = 0;
    this.rt = 0;

    this.runFs = [1, 4, 7, 10];
    this.upF = 66;
    this.downF = 68;
    this.tailFs = [32, 34, 36, 48];

    this.w = 8;
    this.h = 8;

    this.dashT = 0;
    this.canDash = false;

    this.started;

    this.airborn = true;
    this.wasAirborn = false;

    this.up = tutorial || false;
    this.down = tutorial || false;

    this.update = () => {

        MIN_GRAV = this.dir * (8 * jumpHeight * game.vel.x * game.vel.x) / (jumpDist * jumpDist);

        this.vel.y += GRAV;
        this.vel.x = -game.vel.x;

        let x1 = this.pos.x + game.pos.x;
        let x2 = startX;

        this.vel.x = -game.vel.x * (1 + (x2 - x1) / x2 * 2);

        this.started = x1 >= x2 - 5;

        let oldVel = this.vel.copy();
        this.pos.add(this.vel);

        this.wasAirborn = false;

        if (!this.started) {
            this.vel.y = 0;
            this.pos.y = ground;
            return;
        }

        if (this.dir > 0) {
            if (this.pos.y >= ground) {

                GRAV = MIN_GRAV;
                this.pos.y = ground;

                if (this.airborn) {
                    this.wasAirborn = true;
                    this.airborn = false;
                    this.pound();
                }

                if (btn('down') && this.dashT) {
                    this.dashT--;
                    this.vel.y = 0;
                } else {
                    this.airborn = true;
                    this.vel.y = -this.dir * sqrt(2 * abs(GRAV) * jumpHeight);
                }
            } else {
                if (this.dashT < floor(64 / abs(game.vel.x)) && frameCount % 2) this.dashT++;
            }
            if (this.pos.y <= 32) {
                this.pos.y = 32;
                this.vel.y = 0;
            }
        } else {
            if (this.pos.y <= 32) {
                GRAV = MIN_GRAV;
                this.pos.y = 32;

                if (this.airborn) {
                    this.wasAirborn = true;
                    this.airborn = false;
                    this.pound();
                }

                if (btn('up') && this.dashT) {
                    this.dashT--;
                    this.vel.y = 0;
                } else {
                    this.airborn = true;
                    this.vel.y = -this.dir * sqrt(2 * abs(GRAV) * jumpHeight);
                }
            } else {
                if (this.dashT < floor(64 / abs(game.vel.x)) && frameCount % 2) this.dashT++;
            }
            if (this.pos.y >= ground) {
                this.pos.y = ground;
                this.vel.y = 0;
            }
        }

        if (btn('down') && !pbtn('down')) {
            if (this.dir == -1) this.dashT = floor(64 / abs(game.vel.x));
            this.dir = 1;
            GRAV = this.dir * (8 * jumpHeight * game.vel.x * game.vel.x) / (jumpDist / 6 * jumpDist / 6);
            if (this.vel < 0) this.vel.y = 0;
        }
        if (btn('up') && !pbtn('up')) {
            if (this.dir == 1) this.dashT = floor(64 / abs(game.vel.x));
            this.dir = -1;
            GRAV = this.dir * (8 * jumpHeight * game.vel.x * game.vel.x) / (jumpDist / 6 * jumpDist / 6);
            if (this.vel < 0) this.vel.y = 0;
        }

        if (!btn('up') && pbtn('up')) this.up = false;
        if (!btn('down') && pbtn('down')) this.down = false;

        this.checkHit();

        let pos = this.pos.copy();
        pos.sub(oldVel);

        let itt = 4;
        for (let i = 0; i < itt; i++) {
            pos.add(oldVel.copy().div(itt));
            if (abs(GRAV) > abs(MIN_GRAV)) new Sparkle(game, pos.x + random(-16, 16), pos.y + random(-8, 8), true, 3);
        }
    }

    this.pound = () => {
        let max = this.dir * sqrt(2 * abs(GRAV) * jumpHeight);
        let percent = abs(this.vel.mag()) / abs(max);

        let shake = percent * 2 + 2;

        game.addShake(shake);
    }

    this.checkHit = () => {
        let hit = false;

        let oldPos = this.pos.copy();
        this.pos.sub(this.vel);
        for (let i = 0; i < 8; i++) {
            for (const s of game.spikies) {
                if (s.pos.dist(this.pos) < 32 && !s.missed) {
                    s.missed = true;
                    s.mt = 3;
                    new NearMiss(game, s.pos.x, s.pos.y);
                    // console.log("near miss");
                    game.mult++;
                }

                if (s.hit(this)) {
                    s.kill();
                    hit = s;
                    break;
                }
            }
            this.pos.add(this.vel.copy().div(8));
        }
        if (!hit) this.pos.set(oldPos);

        if (hit) this.kill(hit);
    }

    this.kill = (spikey) => {
        game.cat = { update: () => { }, draw: () => { }, pos: this.pos.copy() };
        game.gameover = true;

        // game.addShake(20);

        cls(game.pal + 15);
        // game.addPause(8);

        let title = new Title(game.cat, game.pal, game.pos.x, game.vel.x, game.score + 0.1);

        title.addPause(8);
        title.addShake(20);

        for (let i = game.ore0s.length - 1; i >= 0; i--) {
            let o = game.ore0s[i];
            // o.kill();
            new ExplosionP(title, 13, [game.pal + 15, game.pal + 15, game.pal + 15, game.pal + 15, 64, 64], o.pos.x - 16, o.pos.y - 16, 2, 2);
        }

        for (let i = game.spikies.length - 1; i >= 0; i--) {
            let s = game.spikies[i];
            // s.kill();
            new ExplosionP(title, 39, [game.pal + 15, game.pal + 15, 64, 64, 64, 64], s.pos.x - 24, s.pos.y - 24, 3, 3);
        }

        let nPs = 8;
        for (let i = 0; i < nPs; i++) {
            new PExplosion(title, spikey, TWO_PI / nPs * i, [64, game.pal + 15, game.pal + 15, 64, 64, 64]);
        }

        // for (let index = game.particles.length - 1; index >= 0; index--) {
        //     if (game.particles[index].type != "explosion") game.particles[index].kill();
        // }

        // game.pal = 48;
        drawFN = title;
    }

    this.draw = () => {
        this.arrows('up');
        this.arrows('down', 120 + 16);

        palset([game.pal + 14, game.pal + 13, game.pal, 64, 64, 64]);
        if (this.wasAirborn) palset([game.pal + 14, game.pal + 13, game.pal + 15, 64, 64, 64]);

        lset(5);

        if (this.pos.y == 32 || this.pos.y == ground || !this.started) {
            this.rt += 0.5;
            this.rt %= this.runFs.length;

            let frame = this.runFs[floor(this.rt)];

            if (this.dir < 0) {
                spr(frame, this.pos.x - 32 + game.pos.x, this.pos.y - 16, 3, 2, true, 180);

                if (!this.started) return;
                if (this.vel.y == 0) {
                    palset([game.pal, 64, 64, 64, 64, 64]);
                    spr(0, this.pos.x + game.pos.x + 16, this.pos.y, 1, 1, false, 0, 6, 12);
                    palset([game.pal + 14, 64, 64, 64, 64, 64]);
                    spr(0, this.pos.x + game.pos.x + 17, this.pos.y + 1, 1, 1, false, 0, 4, floor((this.dashT / floor(64 / abs(game.vel.x)) * 10)) + 1);
                }
            } else {
                spr(frame, this.pos.x - 32 + game.pos.x, this.pos.y - 16, 3, 2);

                if (!this.started) return;
                if (this.vel.y == 0) {
                    palset([game.pal, 64, 64, 64, 64, 64]);
                    spr(0, this.pos.x + game.pos.x + 16, this.pos.y - 12, 1, 1, false, 0, 6, 12);
                    palset([game.pal + 14, 64, 64, 64, 64, 64]);
                    spr(0, this.pos.x + game.pos.x + 17, this.pos.y - (floor((this.dashT / floor(64 / abs(game.vel.x)) * 10)) + 1) - 1, 1, 1, false, 0, 4, floor((this.dashT / floor(64 / abs(game.vel.x)) * 10)) + 1);
                }
            }

            return;
        } else this.rt = 2;

        let r = 0;
        let d = false;

        if (this.dir > 0) {
            if (ground - this.pos.y < 64) {
                let frame = 0;
                if (this.vel.y > 0) {
                    frame = 0;
                    if (ground - this.pos.y < 16) {
                        palset([game.pal + 14, game.pal + 13, game.pal + 15, 64, 64, 64]);
                        frame = 1;
                    }
                } else if (this.vel.y < 0) {
                    frame = 3;
                    if (ground - this.pos.y < 16) {
                        frame = 1;
                    } else if (ground - this.pos.y < 32) {
                        frame = 2;
                    }
                }
                spr(this.runFs[floor(frame)], this.pos.x - 32 + game.pos.x, this.pos.y - 16, 3, 2, d, r);
            } else {
                if (this.vel.y > 2) {
                    this.t += 0.5;
                    this.t %= this.tailFs.length;
                    spr(68, this.pos.x - 16 + game.pos.x, this.pos.y - 16, 2, 2, d, r);
                    spr(this.tailFs[floor(this.t)], this.pos.x - 32 + game.pos.x, this.pos.y - 7, 2, 1, d, r);
                } else {
                    this.t += 0.5;
                    this.t %= this.tailFs.length;
                    spr(66, this.pos.x - 16 + game.pos.x, this.pos.y - 16, 2, 2, d, r);
                    spr(this.tailFs[floor(this.t)], this.pos.x - 32 + game.pos.x, this.pos.y - 8, 2, 1, d, r);
                }
            }
            return;
        }

        r = 180;
        d = true;
        if (this.pos.y < 96) {
            let frame = 0;
            if (this.vel.y < 0) {
                frame = 0;
                if (this.pos.y < 48) {
                    palset([game.pal + 14, game.pal + 13, game.pal + 15, 64, 64, 64]);
                    frame = 1;
                }
            } else if (this.vel.y > 0) {
                frame = 3;
                if (this.pos.y < 48) {
                    frame = 1;
                } else if (this.pos.y < 64) {
                    frame = 2;
                }
            }
            spr(this.runFs[floor(frame)], this.pos.x - 32 + game.pos.x, this.pos.y - 16, 3, 2, d, r);
        } else {
            if (this.vel.y < -2) {
                this.t += 0.5;
                this.t %= this.tailFs.length;
                spr(68, this.pos.x - 16 + game.pos.x, this.pos.y - 16, 2, 2, d, r);
                spr(this.tailFs[floor(this.t)], this.pos.x - 32 + game.pos.x, this.pos.y - 9, 2, 1, d, r);
            } else {
                this.t += 0.5;
                this.t %= this.tailFs.length;
                spr(66, this.pos.x - 16 + game.pos.x, this.pos.y - 16, 2, 2, d, r);
                spr(this.tailFs[floor(this.t)], this.pos.x - 32 + game.pos.x, this.pos.y - 8, 2, 1, d, r);
            }
        }
    }

    this.arrows = (dir, y) => {
        y = y || 120 - 32;
        let x = 30;

        if (!this[dir]) return;

        if (btn(dir)) y += 2;

        if (!btn(dir)) palset([game.pal + 15, game.pal + 15, 64, 64, 64, 64]);
        else palset([game.pal + 15, 64, 64, 64, 64, 64]);

        spr(192, x, y);
        spr(192, x + 18, y);

        if (dir == 'up') {
            palset([game.pal + 15, game.pal + 15, 64, 64, 64, 64]);
            spr(193, x, y);

            palset([64, game.pal + 15, game.pal + 15, 64, 64, 64]);
            spr(193, x + 18, y);
        } else {
            palset([game.pal + 15, game.pal + 15, 64, 64, 64, 64]);
            spr(194, x, y);

            palset([64, game.pal + 15, game.pal + 15, 64, 64, 64]);
            spr(194, x + 18, y);
        }
    }

}

function PExplosion(game, cat, rotation, pal) {
    Animation.call(this, game, [213, 214, 215, 216], pal);

    this.type = "explosion";

    this.pos = new Vector().set(cat.pos);
    this.vel = new Vector(1, 0).rotate(rotation);

    this.draw = () => {
        this.pos.add(this.vel.setMag(this.vel.mag() + 1));

        new Sparkle(game, this.pos.x, this.pos.y, true, 5);

        this.t += 0.1;
        if (this.t >= this.frames.length) {
            this.kill();
            return;
        }

        this.setPal();
        spr(this.frames[floor(this.t)], this.pos.x + game.pos.x - 8, this.pos.y - 8);
    }
}