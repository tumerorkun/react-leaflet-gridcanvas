'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leaflet = require('leaflet');

var _reactLeaflet = require('react-leaflet');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridCanvas = function (_RLGridLayer) {
    _inherits(GridCanvas, _RLGridLayer);

    function GridCanvas(props, context) {
        _classCallCheck(this, GridCanvas);

        var _this = _possibleConstructorReturn(this, (GridCanvas.__proto__ || Object.getPrototypeOf(GridCanvas)).call(this, props));

        _this.updateVariables = _this.updateVariables.bind(_this);
        _this.replacer = _this.replacer.bind(_this);
        _this.drawTile = _this.drawTile.bind(_this);
        _this.topLeftTextFunction = _this.topLeftTextFunction.bind(_this);
        _this.centerTextFunction = _this.centerTextFunction.bind(_this);

        _this.updateVariables(props);
        _this.REG_XYZ = /(#x)|(#y)|(#z)/gi;
        _this.map = context.map || props.leaflet.map;
        return _this;
    }

    _createClass(GridCanvas, [{
        key: 'updateVariables',
        value: function updateVariables(props) {
            this.color = props && props.color || "white";
            this.centerText = props && props.centerText || 'zoom: #z';
            this.bottomLeftText = props && props.bottomLeftText || '';
            this.options = props && props.options || { noWrap: true, bounds: [[-90, -180], [90, 180]] };
        }
    }, {
        key: 'replacer',
        value: function replacer(match, p1, p2, p3, offset, string) {
            return match === '#y' ? this.coords.y : match === '#x' ? this.coords.x : match === '#z' ? this.coords.z : null;
        }
    }, {
        key: 'setColor',
        value: function setColor(ctx) {
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
        }
    }, {
        key: 'topLeftTextFunction',
        value: function topLeftTextFunction(ctx) {
            ctx.textAlign = "start";
            ctx.fillText('( x: #x, y: #y )'.replace(this.REG_XYZ, this.replacer), 5, 20);
        }
    }, {
        key: 'centerTextFunction',
        value: function centerTextFunction(ctx) {
            if (this.centerText) {
                ctx.textAlign = "center";
                var center = this.centerText;
                if (typeof this.centerText === 'function') {
                    center = this.centerText(this.coords);
                }
                ctx.fillText(center.toString().replace(this.REG_XYZ, this.replacer), this.size.x / 2, this.size.y / 2 + 3);
            }
        }
    }, {
        key: 'bottomLeftTextFunction',
        value: function bottomLeftTextFunction(ctx) {
            if (this.bottomLeftText) {
                ctx.textAlign = "start";
                var bottomLeft = this.bottomLeftText;
                if (typeof this.bottomLeftText === 'function') {
                    bottomLeft = this.bottomLeftText(this.coords);
                }
                ctx.fillText(bottomLeft.toString().replace(this.REG_XYZ, this.replacer), 5, this.size.y - 12);
            }
        }
    }, {
        key: 'createLeafletElement',
        value: function createLeafletElement() {
            var _ = this;
            var Grid = _leaflet.GridLayer.extend({
                createTile: function createTile(coords) {
                    // create a <canvas> element for drawing
                    var tile = document.createElement('canvas');
                    tile.className = 'leaflet-tile';
                    // setup tile width and height according to the options
                    _.size = this.getTileSize();
                    tile.width = _.size.x;
                    tile.height = _.size.y;
                    // get a canvas context and draw something on it using coords.x, coords.y and coords.z

                    _.drawTile(tile, coords);

                    // return the tile so it can be rendered on screen
                    return tile;
                }
            });
            return new Grid(this.options);
        }
    }, {
        key: 'updateLeafletElement',
        value: function updateLeafletElement(fromProps, toProps) {
            var _this2 = this;

            this.updateVariables(toProps);
            this.leafletElement._resetGrid();
            this.leafletElement._update();
            Object.keys(this.leafletElement._tiles).forEach(function (key) {
                var canvas = _this2.leafletElement._tiles[key];
                var ctx = canvas.el.getContext("2d");
                //smooth rendering
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;

                _this2.drawTile(canvas.el, canvas.coords);
            });
        }
    }, {
        key: 'drawTile',
        value: function drawTile(tile, coords) {
            this.coords = coords;
            var ctx = tile.getContext('2d');
            tile.width = tile.width;
            ctx.translate(0.5, 0.5);
            ctx.setLineDash([3]);
            ctx.lineWidth = 0.4;
            this.setColor(ctx);
            ctx.rect(0, 0, tile.width, tile.height);
            ctx.stroke();

            this.topLeftTextFunction(ctx);
            this.centerTextFunction(ctx);
            this.bottomLeftTextFunction(ctx);
        }
    }]);

    return GridCanvas;
}(_reactLeaflet.GridLayer);

exports.default = GridCanvas;