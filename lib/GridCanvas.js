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

    function GridCanvas(props) {
        _classCallCheck(this, GridCanvas);

        var _this = _possibleConstructorReturn(this, (GridCanvas.__proto__ || Object.getPrototypeOf(GridCanvas)).call(this, props));

        _this.updateVariables = _this.updateVariables.bind(_this);
        _this.updateVariables(props);
        return _this;
    }

    _createClass(GridCanvas, [{
        key: 'updateVariables',
        value: function updateVariables(p) {
            this.color = p && p.color || "white";
            this.centerText = p && p.centerText || 'zoom: #z';
            this.options = p && p.options || { noWrap: true, bounds: [[-90, -180], [90, 180]] };
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
                    var size = this.getTileSize();
                    tile.width = size.x;
                    tile.height = size.y;
                    // get a canvas context and draw something on it using coords.x, coords.y and coords.z
                    var ctx = tile.getContext('2d');
                    ctx.translate(0.5, 0.5);
                    ctx.setLineDash([3]);
                    ctx.lineWidth = 0.4;
                    ctx.strokeStyle = ctx.fillStyle = _.color;
                    ctx.rect(0, 0, tile.width, tile.height);
                    ctx.stroke();
                    var replacer = function replacer(match, p1, p2, p3, offset, string) {
                        return match === '#y' ? coords.y : match === '#x' ? coords.x : match === '#z' ? coords.z : null;
                    };
                    ctx.fillText('( x: #x, y: #y )'.replace(/(#x)|(#y)|(#z)/gi, replacer), 5, 20);
                    ctx.textAlign = "center";
                    var center = _.centerText;
                    if (typeof _.centerText === 'function') {
                        center = _.centerText(coords);
                    }
                    ctx.fillText(center.replace(/(#x)|(#y)|(#z)/gi, replacer), size.x / 2, size.y / 2 + 3);
                    // return the tile so it can be rendered on screen
                    return tile;
                }
            });
            return new Grid(this.options);
        }
    }, {
        key: 'updateLeafletElement',
        value: function updateLeafletElement(fromProps, toProps) {
            this.updateVariables(toProps);
            this.leafletElement.redraw();
        }
    }]);

    return GridCanvas;
}(_reactLeaflet.GridLayer);

exports.default = GridCanvas;