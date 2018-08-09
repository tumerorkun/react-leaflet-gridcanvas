import { GridLayer } from 'leaflet'
import { GridLayer as RLGridLayer } from 'react-leaflet'

export default class GridCanvas extends RLGridLayer {

    createLeafletElement() {
        const color = (this.props && this.props.color) || "white";
        const centerText = (this.props && this.props.centerText) || `zoom: #z`;
        const options = (this.props && this.props.options) || { noWrap: true, bounds: [[-90, -180], [90, 180]] }

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
            ctx.strokeStyle = ctx.fillStyle = color;
            ctx.rect(0, 0, tile.width, tile.height);
            ctx.stroke();
            const replacer = (match, p1, p2, p3, offset, string) => {
            return  match === '#y' ? coords.y :
                    match === '#x' ? coords.x :
                    match === '#z' ? coords.z : null;
            }
            ctx.fillText(`( x: #x, y: #y )`.replace(/(#x)|(#y)|(#z)/gi, replacer), 5, 20);
            ctx.textAlign = "center";
            let center = centerText
            if (typeof centerText === 'function') { center = centerText(coords) }
            ctx.fillText(center.replace(/(#x)|(#y)|(#z)/gi, replacer), size.x / 2, (size.y / 2) + 3)
            // return the tile so it can be rendered on screen
            return tile;
        }
        });
        return new Grid(options);
    }
}
