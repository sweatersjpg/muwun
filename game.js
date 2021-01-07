// Muwun Miner
// Kitty and Sweaters

var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true;
}

function init_() {
  setSpriteSheet("spriteSheet");
  setNumberOfLayers(7);
  lset(1);

  disableScroll();

  pause_Button_.paused = false;
  drawFN = new Title();

  cls(0);
}

let totalload = 2;
let loadleft = totalload;

// ------- main loops -------

function Game(tutorial) {
  this.background = new Background(this);
  this.pal = 0; // 0,16,32

  this.frameRate = FRAMERATE;
  frameRate(this.frameRate);

  this.pos = new Vector();
  this.vel = new Vector(-3.5, 0);

  this.cat = new Cat(this, tutorial);

  this.spikies = [];
  this.particles = [];
  this.ore0s = [];

  this.lastSpikey = 0;
  this.lastOre = 0;

  this.mult = 1;
  this.displayMult = 1;
  this.score = 0;
  this.displayScore = 0;

  this.shake = new Vector(5, 0);

  this.timer = new Date();

  CORRUPTION = 0;

  this.draw = () => {

    cls(this.pal + 11);

    if (this.frameRate < FRAMERATE) {
      this.frameRate = FRAMERATE;
      frameRate(FRAMERATE);
    }

    if (this.shake.mag() > 0.1) {
      if (this.gameover || !this.cat.started) this.shake.setMag(this.shake.mag() * 0.9);
      else this.shake.setMag(this.shake.mag() * 0.5);
      this.shake.rotate(this.shake.heading() + TWO_PI / 3);
    }
    setCamera(-this.shake.x, -this.shake.y);

    if (this.gameover) {
      this.vel.x *= 0.85;
    } else this.vel.x -= 0.001;

    this.pos.add(this.vel);

    this.background.draw();

    if (this.cat.started) {
      if (random() < 0.05 && (-this.pos.x) - this.lastSpikey > D.W / 3) {
        this.lastSpikey = -this.pos.x;
        new spikey(this);
        if (random() < 0.3) new spikey(this);
      }

      if (random() < 0.05 && (-this.pos.x) - this.lastOre > D.W / 3) {
        this.lastOre = -this.pos.x;
        new Ore(this);
        if (random() < 0.1) new Ore(this, true);
      }
    }

    for (const s of this.spikies) s.update();
    // for (const o of this.ore0s) o.update();
    for (let i = this.ore0s.length - 1; i >= 0; i--) this.ore0s[i].update();
    this.cat.update();
    for (const s of this.spikies) s.draw();
    for (const o of this.ore0s) o.draw();

    setCamera(0, 0);

    this.cat.draw();

    for (const p of this.particles) p.draw();

    this.drawScore();

    if (isMobile) {
      put("--------", 0.1, 120 - 4, this.pal);
      put("--------", 400 - 64, 120 - 4, this.pal);
    }

    if (mouseIsPressed || touches[0]) {
      if (mouseY / D.S > 120 && this.cat.dir < 0) {
        gamepadbtns[0][0] = false;
        gamepadbtns[0][1] = true;
      } else if (mouseY / D.S < 120 && this.cat.dir > 0) {
        gamepadbtns[0][0] = true;
        gamepadbtns[0][1] = false;
      }
    }

    // put(this.particles.length, 0, 0, 32);

  }

  this.drawScore = () => {
    let c = 0;
    if (this.score - this.displayScore > 0.1) {
      c = 15;
      this.displayScore += (this.score - this.displayScore) / 2;
    }
    else this.displayScore = this.score;

    lset(5);

    let w = (floor(this.displayScore) + "").length * 8;
    let x = 56 + 8 - w;
    let y = 58;

    put(floor(this.displayScore), x - 1, y, this.pal + c);
    put(floor(this.displayScore), x + 1, y, this.pal + c);
    put(floor(this.displayScore), x, y - 1, this.pal + c);
    put(floor(this.displayScore), x, y + 1, this.pal + c);

    put(floor(this.displayScore), x, y, this.pal + 14);

    c = 0;
    if (this.displayMult < this.mult) {
      c = 15;
      this.displayMult += 0.25;
    }

    x = 32 + 16;
    y = 48;
    let t = "x" + floor(this.displayMult);

    put(t, x - 1, y, this.pal + c);
    put(t, x + 1, y, this.pal + c);
    put(t, x, y - 1, this.pal + c);
    put(t, x, y + 1, this.pal + c);

    put(t, x, y, this.pal + 10);

    let beeschurger = this.pal + 10;

    palset([beeschurger, this.pal + c, 64, 64, 64, 64]);
    spr(160, x - 32, y - 12, 3, 2);

    palset([this.pal + 15, this.pal + 14, this.pal + 13, this.pal, 64, 64]);
    spr(31, 56 - w - 8, 58 - 4);

  }

  this.addPoints = (points) => {
    this.score += points * this.mult;

    if (this.score > 300 && this.score < 1000) this.pal = 16;
    if (this.score > 1000 && this.score < 2000) {
      this.pal = 32;
      this.timer = new Date();
      this.palt = 3;
    } else if (this.score > 2000 && (new Date()) - this.timer > 45000) {
      this.timer = new Date();

      let pals = [0, 16, 32, 16];
      this.pal = pals[this.palt++ % pals.length];

    }

  }

  this.addShake = (amount) => {
    this.shake.setMag(this.shake.mag() + amount);
  }

  this.addPause = (amount) => {
    this.frameRate = amount;
    frameRate(amount);
  }

  this.doTouch = (b, y) => {
    if (y / D.S < 120) gamepadbtns[0][0] = b;
    if (y / D.S > 120) gamepadbtns[0][1] = b;
  }

  this.touchstart = (e) => {
    this.doTouch(true, e.touches[0].clientY);
  }

  this.touchend = (e) => {
    this.doTouch(false, e.touches[0].clientY);
  }

  this.mousedown = (e) => {
    this.doTouch(true, e.y);
  }

  this.mouseup = (e) => {
    this.doTouch(false, e.y);
  }

}

function Animation(game, frames, pals, ...rest) {
  this.t = 0;
  game.particles.push(this);

  this.type = "animation";

  this.frames = frames;
  this.pals = pals;

  this.draw = () => {
    this.t++;
    if (this.t == frames.length) this.kill();

    this.setPal();

    spr(frames[floor(this.t)], ...rest);
  }

  this.setPal = () => {
    if (!this.pals[0].length) palset(this.pals);
    else palset(this.pals[floor(this.t < this.pals.length ? this.t : this.pals.length - 1)]);
  }

  this.kill = () => {
    game.particles.splice(game.particles.indexOf(this), 1);
  }
}

function ExplosionP(game, frame, pal, x, y, w, h) {
  Animation.call(this, game);

  this.type = "explosion";

  this.pos = new Vector(x, y);
  this.vel = new Vector();

  let dir = game.cat.pos.copy().sub(this.pos);
  this.vel.set(dir.setMag(-1));

  this.draw = () => {
    // this.vel.add(0, 1);
    this.vel.setMag(this.vel.mag() + 0.8);
    this.pos.add(this.vel);

    if (this.pos.y > 240 || this.pos.y < -16 * h || this.pos.x + game.pos.x < -16 * w || this.pos.x + game.pos.x > 400) this.kill();

    palset(pal);
    lset(5);
    spr(frame, this.pos.x + game.pos.x, this.pos.y, w, h);
  }
}
