"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var three_1 = require("three");
var cannon_1 = require("cannon");
var randomOrgApiKey = 'f6e74d7b-070e-4f85-865d-d859fc0d078b';
var _randomStorage = [];
var _useTrueRandom = true;
function useTrueRandom(value) {
    _useTrueRandom = value;
}
exports.useTrueRandom = useTrueRandom;
function initRng(callback) {
    if (!_randomStorage.length && _useTrueRandom) {
        var body = {
            jsonrpc: '2.0',
            method: 'generateDecimalFractions',
            params: {
                apiKey: randomOrgApiKey,
                n: 512,
                decimalPlaces: 2,
                id: 1
            }
        };
        this.http
            .post('https://api.random.org/json-rpc/1/invoke', body, {
            headers: {
                'Content-Type': 'application/json-rpc'
            }
        })
            .subscribe(function (response) {
            if (response.ok) {
                response
                    .json()
                    .then(function (x) { return (_randomStorage = x.random.data); })
                    .catch(function () { return useTrueRandom(false); });
            }
            else {
                useTrueRandom(false);
            }
        });
        if (callback)
            callback();
    }
}
exports.initRng = initRng;
function removeCssClass(el, className) {
    var c = el.getAttribute('class');
    if (c) {
        var index = c.search('\\b' + className + '\\b');
        if (index !== -1) {
            var c2 = c.substr(0, index) +
                c.substr(index + className.length).replace(/\s+/g, ' ');
            if (c !== c2) {
                el.setAttribute('class', c2);
            }
        }
    }
}
exports.removeCssClass = removeCssClass;
function addCssClass(el, className) {
    var c = el.getAttribute('class');
    var value;
    if (!c || !c.trim()) {
        value = className;
    }
    else {
        var index = c.search('\\b' + className + '\\b');
        if (index === -1) {
            value = c.trim() + ' ' + className;
        }
    }
    if (value) {
        el.setAttribute('class', value);
    }
}
exports.addCssClass = addCssClass;
function bind(sel, eventName, func, bubble) {
    if (eventName.constructor === Array) {
        eventName.forEach(function (x) {
            sel.addEventListener(x, func, bubble ? bubble : false);
        });
    }
    else {
        sel.addEventListener(eventName, func, bubble ? bubble : false);
    }
}
exports.bind = bind;
function unbind(sel, eventName, func, bubble) {
    if (eventName.constructor === Array) {
        eventName.forEach(function (x) {
            sel.removeEventListener(x, func, bubble ? bubble : false);
        });
    }
    else {
        sel.removeEventListener(eventName, func, bubble ? bubble : false);
    }
}
exports.unbind = unbind;
function rng() {
    if (_randomStorage.length === 1) {
        initRng();
    }
    return _randomStorage.length ? _randomStorage.pop() : Math.random();
}
exports.rng = rng;
function copy(obj) {
    if (!obj)
        return obj;
    return copyto(obj, new obj.constructor());
}
function copyto(obj, res) {
    if (obj == null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Array) {
        for (var i = obj.length - 1; i >= 0; --i)
            res[i] = copy(obj[i]);
    }
    else {
        for (var i in obj) {
            if (obj.hasOwnProperty(i))
                res[i] = copy(obj[i]);
        }
    }
    return res;
}
exports.copyto = copyto;
function createShape(vertices, faces, radius) {
    var cv = vertices.map(function (v) { return new cannon_1.Vec3(v.x * radius, v.y * radius, v.z * radius); });
    var cf = faces.map(function (x, i) { return faces[i].slice(0, faces[i].length); });
    // BUG: @types/cannon incorrectly declares 2nd param as number[]
    return new cannon_1.ConvexPolyhedron(cv, cf);
}
function createGeometry(vertices, faces, radius, tab, af) {
    var geom = new three_1.Geometry();
    for (var i = 0; i < vertices.length; ++i) {
        var vertex = vertices[i].multiplyScalar(radius);
        /*vertex.index = */ geom.vertices.push(vertex) /* - 1 */;
    }
    for (var i = 0; i < faces.length; ++i) {
        var ii = faces[i];
        var fl = ii.length - 1;
        var aa = Math.PI * 2 / fl;
        for (var j = 0; j < fl - 2; ++j) {
            geom.faces.push(new three_1.Face3(ii[0], ii[j + 1], ii[j + 2], [
                geom.vertices[ii[0]],
                geom.vertices[ii[j + 1]],
                geom.vertices[ii[j + 2]]
            ], new three_1.Color(0), ii[fl] + 1));
            geom.faceVertexUvs[0].push([
                new three_1.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab), (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                new three_1.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                new three_1.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab), (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))
            ]);
        }
    }
    geom.computeFaceNormals();
    geom.boundingSphere = new three_1.Sphere(new three_1.Vector3(), radius);
    return geom;
}
function chamferGeometry(vectors, faces, chamfer) {
    var chamferVectors = [];
    var chamferFaces = [];
    var cornerFaces = vectors.map(function (x) { return []; });
    for (var i = 0; i < faces.length; ++i) {
        var ii = faces[i];
        var fl = ii.length - 1;
        var centerPoint = new three_1.Vector3();
        var face = new Array(fl);
        for (var j = 0; j < fl; ++j) {
            var vv = vectors[ii[j]].clone();
            centerPoint.add(vv);
            cornerFaces[ii[j]].push((face[j] = chamferVectors.push(vv) - 1));
        }
        centerPoint.divideScalar(fl);
        for (var j = 0; j < fl; ++j) {
            var vv = chamferVectors[face[j]];
            vv
                .subVectors(vv, centerPoint)
                .multiplyScalar(chamfer)
                .addVectors(vv, centerPoint);
        }
        face.push(ii[fl]);
        chamferFaces.push(face);
    }
    for (var i = 0; i < faces.length - 1; ++i) {
        for (var j = i + 1; j < faces.length; ++j) {
            var pairs = [], lastm = -1;
            for (var m = 0; m < faces[i].length - 1; ++m) {
                var n = faces[j].indexOf(faces[i][m]);
                if (n >= 0 && n < faces[j].length - 1) {
                    if (lastm >= 0 && m != lastm + 1)
                        pairs.unshift([i, m], [j, n]);
                    else
                        pairs.push([i, m], [j, n]);
                    lastm = m;
                }
            }
            if (pairs.length != 4)
                continue;
            chamferFaces.push([
                chamferFaces[pairs[0][0]][pairs[0][1]],
                chamferFaces[pairs[1][0]][pairs[1][1]],
                chamferFaces[pairs[3][0]][pairs[3][1]],
                chamferFaces[pairs[2][0]][pairs[2][1]],
                -1
            ]);
        }
    }
    for (var i = 0; i < cornerFaces.length; ++i) {
        var cf = cornerFaces[i];
        var face = [cf[0]];
        var count = cf.length - 1;
        while (count) {
            for (var m = faces.length; m < chamferFaces.length; ++m) {
                var index = chamferFaces[m].indexOf(face[face.length - 1]);
                if (index >= 0 && index < 4) {
                    if (--index == -1) {
                        index = 3;
                    }
                    var nextVertex = chamferFaces[m][index];
                    if (cf.indexOf(nextVertex) >= 0) {
                        face.push(nextVertex);
                        break;
                    }
                }
            }
            --count;
        }
        face.push(-1);
        chamferFaces.push(face);
    }
    return { vectors: chamferVectors, faces: chamferFaces };
}
function createDiceGeometry(vertices, faces, radius, tab, af, chamfer) {
    var vectors = new Array(vertices.length);
    for (var i = 0; i < vertices.length; ++i) {
        vectors[i] = new three_1.Vector3().fromArray(vertices[i]).normalize();
    }
    var cg = chamferGeometry(vectors, faces, chamfer);
    var geom = createGeometry(cg.vectors, cg.faces, radius, tab, af);
    //const geom = createGeometry(vectors, faces, radius, tab, af); // Without chamfer
    geom.cannonShape = createShape(vectors, faces, radius);
    return geom;
}
exports.createDiceGeometry = createDiceGeometry;
function calculateTextureSize(approx) {
    return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
}
exports.calculateTextureSize = calculateTextureSize;
function randomizeVector(vector) {
    var randomAngle = rng() * Math.PI / 5 - Math.PI / 5 / 2;
    var vec = new three_1.Vector2(vector.x * Math.cos(randomAngle) - vector.y * Math.sin(randomAngle), vector.x * Math.sin(randomAngle) + vector.y * Math.cos(randomAngle));
    if (vec.x == 0)
        vec.x = 0.01;
    if (vec.y == 0)
        vec.y = 0.01;
    return vec;
}
exports.randomizeVector = randomizeVector;
//# sourceMappingURL=dicelib.js.map