"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var cannon_1 = require("cannon");
var diceconsts_1 = require("./diceconsts");
var dicenotation_1 = require("./dicenotation");
var die_1 = require("./die");
var dicelib_1 = require("./dicelib");
var DiceBox = /** @class */ (function () {
    function DiceBox(diceFactory, container, dimensions) {
        this.diceFactory = diceFactory;
        this.animateSelector = true;
        this.barrierBodyMaterial = new cannon_1.Material('barrier');
        this.deskBodyMaterial = new cannon_1.Material('desk');
        this.dice = [];
        this.rolling = false;
        this.scene = new three_1.Scene();
        this.useAdaptiveTimestamp = true;
        this.world = new cannon_1.World();
        this.ambientLightColor = 0xf0f5fb;
        this.clientSize = new three_1.Vector2(0, 0);
        this.iteration = 0;
        this.lastTime = 0;
        this.running = 0;
        this.size = new three_1.Vector2(0, 0);
        this.windowSize = new three_1.Vector2(0, 0);
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl');
        this.renderer = gl
            ? new three_1.WebGLRenderer({ antialias: true })
            : new three_1.CanvasRenderer /*{ antialias: true }*/();
        container.appendChild(this.renderer.domElement);
        if (gl) {
            var glRenderer = new three_1.WebGLRenderer({ antialias: true });
            glRenderer.shadowMap.enabled = true;
            glRenderer.shadowMap.type = three_1.PCFShadowMap;
            glRenderer.setClearColor(0xffffff, 1);
            this.renderer = glRenderer;
        }
        this.reinit(container, dimensions);
        this.world.gravity.set(0, 0, -9.8 * 800);
        this.world.broadphase = new cannon_1.NaiveBroadphase();
        this.world.solver.iterations = 16;
        var ambientLight = new three_1.AmbientLight(this.ambientLightColor);
        this.scene.add(ambientLight);
        this.world.addContactMaterial(new cannon_1.ContactMaterial(this.deskBodyMaterial, die_1.Die.diceBodyMaterial, {
            friction: 0.01,
            restitution: 0.5
        }));
        this.world.addContactMaterial(new cannon_1.ContactMaterial(this.barrierBodyMaterial, die_1.Die.diceBodyMaterial, {
            friction: 0,
            restitution: 1.0
        }));
        this.world.addContactMaterial(new CANNON.ContactMaterial(die_1.Die.diceBodyMaterial, die_1.Die.diceBodyMaterial, {
            friction: 0,
            restitution: 0.5
        }));
        var body = new cannon_1.Body({ mass: 0, material: this.deskBodyMaterial });
        body.addShape(new cannon_1.Plane());
        this.world.addBody(body);
        this.world.addBody(this.createBarrier(new cannon_1.Vec3(0, this.size.y * 0.93, 0), new cannon_1.Vec3(1, 0, 0), Math.PI / 2));
        this.world.addBody(this.createBarrier(new cannon_1.Vec3(0, -this.size.y * 0.93, 0), new cannon_1.Vec3(1, 0, 0), -Math.PI / 2));
        this.world.addBody(this.createBarrier(new cannon_1.Vec3(this.size.x * 0.93, 0, 0), new cannon_1.Vec3(0, 1, 0), -Math.PI / 2));
        this.world.addBody(this.createBarrier(new cannon_1.Vec3(-this.size.x * 0.93, 0, 0), new cannon_1.Vec3(0, 1, 0), Math.PI / 2));
        this.renderer.render(this.scene, this.camera);
    }
    DiceBox.prototype.bindMouse = function (container, notationGetter, beforeRoll, afterRoll) {
        var _this = this;
        var box = this;
        dicelib_1.bind(container, ['mousedown', 'touchstart'], function (ev) {
            ev.preventDefault();
            box.mouseTime = new Date().getTime();
            box.mouseStart = _this.getMousePosition(ev);
        });
        dicelib_1.bind(container, ['mouseup', 'touchend'], function (ev) {
            if (box.rolling || box.mouseStart === undefined) {
                return;
            }
            ev.stopPropagation();
            var m = _this.getMousePosition(ev);
            var vector = new three_1.Vector2(m.x - box.mouseStart.x, -(m.y - box.mouseStart.y));
            // reset mouseStart
            box.mouseStart = undefined;
            var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            if (dist >= Math.sqrt(box.size.x * box.size.y * 0.01)) {
                var interval = new Date().getTime() - box.mouseTime;
                if (interval > 2000) {
                    interval = 2000;
                }
                var boost_1 = Math.sqrt((2500 - interval) / 2500) * dist * 2;
                dicelib_1.initRng(function () {
                    _this.throwDice(vector, boost_1, dist, notationGetter, beforeRoll, afterRoll);
                });
            }
        });
    };
    DiceBox.prototype.bindThrow = function (button, notationGetter, beforeRoll, afterRoll) {
        var box = this;
        dicelib_1.bind(button, ['mouseup', 'touchend'], function (ev) {
            ev.stopPropagation();
            box.startThrow(notationGetter, beforeRoll, afterRoll);
        });
    };
    DiceBox.prototype.clear = function () {
        var _this = this;
        this.running = false;
        var dice;
        while ((dice = this.dice.pop())) {
            this.scene.remove(dice);
            if (dice.body)
                this.world.remove(dice.body);
        }
        if (this.pane)
            this.scene.remove(this.pane);
        this.renderer.render(this.scene, this.camera);
        setTimeout(function () { return _this.renderer.render(_this.scene, _this.camera); }, 100);
    };
    DiceBox.prototype.drawSelector = function () {
        this.clear();
        var step = this.size.x / 4.5;
        this.pane = new three_1.Mesh(new three_1.PlaneGeometry(this.size.x * 6, this.size.y * 6, 1, 1), new three_1.MeshPhongMaterial(diceconsts_1.DiceConsts.selectorBackColors));
        this.pane.receiveShadow = true;
        this.pane.position.set(0, 0, 1);
        this.scene.add(this.pane);
        var mouseCaptured = false;
        for (var i = 0, pos = -3; i < diceconsts_1.DiceConsts.KNOWN_DICE.length; ++i, ++pos) {
            var sides = diceconsts_1.DiceConsts.KNOWN_DICE[i];
            var die = this.diceFactory.createDie(sides);
            die.position.set(pos * step, 0, step * 0.5);
            die.castShadow = true;
            die.userData = "d" + sides;
            this.dice.push(die);
            this.scene.add(die);
        }
        this.running = new Date().getTime();
        this.lastTime = 0;
        if (this.animateSelector)
            this.__selectorAnimate(this.running);
        else
            this.renderer.render(this.scene, this.camera);
    };
    DiceBox.prototype.findDieAtMousePosition = function (ev) {
        var m = this.getMousePosition(ev);
        var intersects = new three_1.Raycaster(this.camera.position, new three_1.Vector3((m.x - this.clientSize.x) / this.aspect, (m.y - this.clientSize.y) / this.aspect, this.size.x / 9)
            .sub(this.camera.position)
            .normalize()).intersectObjects(this.dice);
        if (intersects.length)
            return intersects[0].object.userData;
    };
    DiceBox.prototype.reinit = function (container, dimensions) {
        this.clientSize.set(container.clientWidth / 2, container.clientHeight / 2);
        if (dimensions) {
            this.size.x = dimensions.width;
            this.size.y = dimensions.height;
        }
        else {
            this.size.copy(this.clientSize);
        }
        this.aspect = Math.min(this.clientSize.x / this.size.x, this.clientSize.y / this.size.y);
        this.scale =
            Math.sqrt(this.size.x * this.size.x + this.size.y * this.size.y) / 13;
        this.renderer.setSize(this.clientSize.x * 2, this.clientSize.y * 2);
        this.windowSize.y =
            this.clientSize.y / this.aspect / Math.tan(10 * Math.PI / 180);
        if (this.camera)
            this.scene.remove(this.camera);
        this.camera = new three_1.PerspectiveCamera(20, this.clientSize.x / this.clientSize.y, 1, this.windowSize.y * 1.3);
        this.camera.position.z = this.windowSize.y;
        var mw = Math.max(this.size.x, this.size.y);
        if (this.light) {
            this.scene.remove(this.light);
        }
        var light = new three_1.SpotLight(diceconsts_1.DiceConsts.spotlightColor, 2.0);
        light.position.set(-mw / 2, mw / 2, mw * 2);
        light.target.position.set(0, 0, 0);
        light.distance = mw * 5;
        light.castShadow = true;
        light.shadowCameraNear = mw / 10;
        light.shadowCameraFar = mw * 5;
        light.shadowCameraFov = 50;
        light.shadowBias = 0.001;
        light.shadowDarkness = 1.1;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        this.light = light;
        this.scene.add(this.light);
        if (this.desk) {
            this.scene.remove(this.desk);
        }
        this.desk = new three_1.Mesh(new three_1.PlaneGeometry(this.size.x * 2, this.size.y * 2, 1, 1), new three_1.MeshPhongMaterial({ color: diceconsts_1.DiceConsts.deskColor }));
        this.desk.receiveShadow = true;
        this.scene.add(this.desk);
        this.renderer.render(this.scene, this.camera);
    };
    DiceBox.prototype.roll = function (vectors, values, callback) {
        this.initRoll(vectors);
        if (values != undefined && values.length) {
            this.useAdaptiveTimestamp = false;
            var res = this.emulateThrow();
            this.initRoll(vectors);
            for (var i in res) {
                this.shiftDieFaces(this.dice[i], values[i], res[i]);
            }
        }
        this.callback = callback;
        this.running = new Date().getTime();
        this.lastTime = 0;
        this.__animate(this.running);
    };
    DiceBox.prototype.throwDice = function (vector, boost, dist, notationGetter, beforeRoll, afterRoll) {
        var _this = this;
        var uat = this.useAdaptiveTimestamp;
        var roll = function (requestResults) {
            if (requestResults === void 0) { requestResults = false; }
            if (afterRoll) {
                _this.clear();
                _this.roll(vectors, requestResults || notation.result, function (result) {
                    if (afterRoll) {
                        afterRoll(_this, notation, result);
                    }
                    _this.rolling = false;
                    _this.useAdaptiveTimestamp = uat;
                });
            }
        };
        vector.x /= dist;
        vector.y /= dist;
        var notation = dicenotation_1.DiceNotation.parse(notationGetter());
        if (notation.set.length == 0)
            return;
        var vectors = this.generateVectors(notation, vector, boost);
        this.rolling = true;
        if (beforeRoll) {
            beforeRoll(this, vectors, notation, roll);
        }
        else {
            roll();
        }
    };
    DiceBox.prototype.emulateThrow = function () {
        while (!this.isThrowFinished()) {
            ++this.iteration;
            this.world.step(diceconsts_1.DiceConsts.frameRate);
        }
        return this.dice.map(function (x) { return x.value; });
    };
    DiceBox.prototype.createBarrier = function (pos, axis, angle) {
        var barrier;
        barrier = new cannon_1.Body({ mass: 0, material: this.barrierBodyMaterial });
        barrier.addShape(new cannon_1.Plane());
        barrier.quaternion.setFromAxisAngle(axis, Math.PI / 2);
        barrier.position.set(pos.x, pos.y, pos.z);
        this.world.addBody(barrier);
        return barrier;
    };
    DiceBox.prototype.generateVectors = function (notation, vector, boost) {
        var vectors = [];
        for (var _i = 0, _a = notation.set; _i < _a.length; _i++) {
            var sides = _a[_i];
            var vec = dicelib_1.randomizeVector(vector);
            var pos = new three_1.Vector3(this.size.x * (vec.x > 0 ? -1 : 1) * 0.9, this.size.y * (vec.y > 0 ? -1 : 1) * 0.9, dicelib_1.rng() * 200 + 200);
            var projector = Math.abs(vec.x / vec.y);
            if (projector > 1.0) {
                pos.setY(pos.y / projector);
            }
            else {
                pos.setX(pos.x * projector);
            }
            var velvec = dicelib_1.randomizeVector(vector);
            var velocity = new three_1.Vector3(velvec.x * boost, velvec.y * boost, -10);
            var inertia = this.diceFactory.getStatic(sides).inertia;
            var angle = new three_1.Vector3(-(dicelib_1.rng() * vec.y * 5 + inertia * vec.y), dicelib_1.rng() * vec.x * 5 + inertia * vec.x, 0);
            var axis = new three_1.Vector4(dicelib_1.rng(), dicelib_1.rng(), dicelib_1.rng(), dicelib_1.rng());
            vectors.push({
                sides: sides,
                pos: pos,
                velocity: velocity,
                angle: angle,
                axis: axis
            });
        }
        return vectors;
    };
    DiceBox.prototype.addDice = function (sides, pos, velocity, angle, axis) {
        var die = this.diceFactory.createDie(sides);
        die.castShadow = true;
        die.body.position.set(pos.x, pos.y, pos.z);
        die.body.quaternion.setFromAxisAngle(new cannon_1.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
        die.body.angularVelocity.set(angle.x, angle.y, angle.z);
        die.body.velocity.set(velocity.x, velocity.y, velocity.z);
        die.body.linearDamping = 0.1;
        die.body.angularDamping = 0.1;
        this.scene.add(die);
        this.dice.push(die);
        this.world.addBody(die.body);
    };
    DiceBox.prototype.isThrowFinished = function () {
        var result = true;
        var e = 6;
        if (this.iteration < 10 / diceconsts_1.DiceConsts.frameRate) {
            for (var i = 0; i < this.dice.length; ++i) {
                var die = this.dice[i];
                if (die.stopped === true)
                    continue;
                var a = die.body.angularVelocity, v = die.body.velocity;
                if (Math.abs(a.x) < e &&
                    Math.abs(a.y) < e &&
                    Math.abs(a.z) < e &&
                    Math.abs(v.x) < e &&
                    Math.abs(v.y) < e &&
                    Math.abs(v.z) < e) {
                    if (!!die.stopped) {
                        if (this.iteration - die.stopped > 3) {
                            die.stopped = true;
                            continue;
                        }
                    }
                    else
                        die.stopped = this.iteration;
                    result = false;
                }
                else {
                    die.stopped = undefined;
                    result = false;
                }
            }
        }
        return result;
    };
    DiceBox.prototype.__animate = function (threadid) {
        var time = new Date().getTime();
        var timeDiff = (time - this.lastTime) / 1000;
        if (timeDiff > 3) {
            timeDiff = diceconsts_1.DiceConsts.frameRate;
        }
        ++this.iteration;
        if (this.useAdaptiveTimestamp) {
            while (timeDiff > diceconsts_1.DiceConsts.frameRate * 1.1) {
                this.world.step(diceconsts_1.DiceConsts.frameRate);
                timeDiff -= diceconsts_1.DiceConsts.frameRate;
            }
            this.world.step(timeDiff);
        }
        else {
            this.world.step(diceconsts_1.DiceConsts.frameRate);
        }
        for (var i in this.scene.children) {
            var interact = this.scene.children[i];
            if (interact.body !== undefined) {
                var p = interact.body.position;
                var q = interact.body.quaternion;
                interact.position.set(p.x, p.y, p.z);
                interact.quaternion.set(q.x, q.y, q.z, q.w);
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.lastTime = this.lastTime ? time : new Date().getTime();
        if (this.running == threadid && this.isThrowFinished()) {
            this.running = false;
            if (this.callback) {
                this.callback(this.dice.map(function (x) { return x.value; }));
            }
        }
        if (this.running == threadid) {
            (function (t, tid, uat) {
                if (!uat && timeDiff < diceconsts_1.DiceConsts.frameRate) {
                    setTimeout(function () {
                        requestAnimationFrame(function () {
                            t.__animate(tid);
                        });
                    }, (diceconsts_1.DiceConsts.frameRate - timeDiff) * 1000);
                }
                else
                    requestAnimationFrame(function () {
                        t.__animate(tid);
                    });
            })(this, threadid, this.useAdaptiveTimestamp);
        }
    };
    DiceBox.prototype.initRoll = function (vectors) {
        this.clear();
        this.iteration = 0;
        for (var i in vectors) {
            this.addDice(vectors[i].sides, vectors[i].pos, vectors[i].velocity, vectors[i].angle, vectors[i].axis);
        }
    };
    DiceBox.prototype.shiftDieFaces = function (die, value, res) {
        var r = die.range;
        if (!(value >= r[0] && value <= r[1]))
            return;
        var num = value - res;
        var geom = die.geometry.clone();
        for (var i = 0, l = geom.faces.length; i < l; ++i) {
            var matindex = geom.faces[i].materialIndex;
            if (matindex == 0)
                continue;
            matindex += num - 1;
            while (matindex > r[1])
                matindex -= r[1];
            while (matindex < r[0])
                matindex += r[1];
            geom.faces[i].materialIndex = matindex + 1;
        }
        die.geometry = geom;
    };
    DiceBox.prototype.__selectorAnimate = function (threadid) {
        var time = new Date().getTime();
        var timeDiff = (time - this.lastTime) / 1000;
        if (timeDiff > 3)
            timeDiff = diceconsts_1.DiceConsts.frameRate;
        var dAngle = 0.3 * timeDiff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
        if (dAngle < 0)
            this.running = false;
        for (var i in this.dice) {
            this.dice[i].rotation.y += dAngle;
            this.dice[i].rotation.x += dAngle / 4;
            this.dice[i].rotation.z += dAngle / 10;
        }
        this.lastTime = time;
        this.renderer.render(this.scene, this.camera);
        if (this.running == threadid) {
            (function (t, tid) {
                requestAnimationFrame(function () {
                    t.__selectorAnimate(tid);
                });
            })(this, threadid);
        }
    };
    DiceBox.prototype.startThrow = function (notationGetter, beforeRoll, afterRoll) {
        var _this = this;
        if (this.rolling)
            return;
        dicelib_1.initRng(function () {
            var vector = new three_1.Vector2((dicelib_1.rng() * 2 - 1) * _this.size.x, -(dicelib_1.rng() * 2 - 1) * _this.size.y);
            var dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            var boost = (dicelib_1.rng() + 3) * dist;
            _this.throwDice(vector, boost, dist, notationGetter, beforeRoll, afterRoll);
        });
    };
    DiceBox.prototype.getMousePosition = function (ev) {
        var touchEvent = ev;
        if (touchEvent.changedTouches !== undefined) {
            return new three_1.Vector2(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY);
        }
        return new three_1.Vector2(ev.clientX, ev.clientY);
    };
    return DiceBox;
}());
exports.DiceBox = DiceBox;
//# sourceMappingURL=dicebox.js.map