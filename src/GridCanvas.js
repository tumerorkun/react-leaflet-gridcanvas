import { GridLayer } from 'leaflet'
import { GridLayer as RLGridLayer } from 'react-leaflet'

export default class GridCanvas extends RLGridLayer {

    constructor(props) {
        super(props);
        this.updateVariables = this.updateVariables.bind(this);
        this.updateVariables(props);
    }

    updateVariables(p) {
        this.color = (p && p.color) || "white";
        this.centerText = (p && p.centerText) || `zoom: #z`;
        this.options = (p && p.options) || { noWrap: true, bounds: [[-90, -180], [90, 180]] }
    }

    createLeafletElement() {
        const _ = this;
        const Grid = GridLayer.extend({
        createTile: function (coords) {
            // create a <canvas> element for drawing
            const tile = document.createElement('canvas');
            tile.className = 'leaflet-tile';
            // setup tile width and height according to the options
            const size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            // get a canvas context and draw something on it using coords.x, coords.y and coords.z
            const ctx = tile.getContext('2d');
            ctx.translate(0.5, 0.5)
            ctx.setLineDash([3]);
            ctx.lineWidth = 0.4;
            ctx.strokeStyle = ctx.fillStyle = _.color;
            ctx.rect(0, 0, tile.width, tile.height);
            ctx.stroke();
            const replacer = (match, p1, p2, p3, offset, string) => {
            return  match === '#y' ? coords.y :
                    match === '#x' ? coords.x :
                    match === '#z' ? coords.z : null;
            }
            ctx.fillText(`( x: #x, y: #y )`.replace(/(#x)|(#y)|(#z)/gi, replacer), 5, 20);
            ctx.textAlign = "center";
            let center = _.centerText
            if (typeof _.centerText === 'function') { center = _.centerText(coords) }
            ctx.fillText(center.replace(/(#x)|(#y)|(#z)/gi, replacer), size.x / 2, (size.y / 2) + 3)
            // return the tile so it can be rendered on screen
            return tile;
        }
        });
        return new Grid(this.options);
    }

    updateLeafletElement(fromProps, toProps) {
        this.updateVariables(toProps)
        this.leafletElement.redraw();
    }
}
