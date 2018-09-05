import { GridLayer } from 'leaflet'
import { GridLayer as RLGridLayer } from 'react-leaflet'

export default class GridCanvas extends RLGridLayer {

    constructor(props, context) {
        super(props);
        this.updateVariables = this.updateVariables.bind(this);
        this.replacer = this.replacer.bind(this);
        this.drawTile = this.drawTile.bind(this);
        this.topLeftTextFunction = this.topLeftTextFunction.bind(this);
        this.centerTextFunction = this.centerTextFunction.bind(this);

        this.updateVariables(props);
        this.REG_XYZ = /(#x)|(#y)|(#z)/gi;
        this.map = context.map || props.leaflet.map;
    }

    updateVariables(props) {
        this.color = (props && props.color) || "white";
        this.centerText = (props && props.centerText) || `zoom: #z`;
        this.bottomLeftText = (props && props.bottomLeftText) || ``;
        this.options = (props && props.options) || { noWrap: true, bounds: [[-90, -180], [90, 180]] }
    }

    replacer(match, p1, p2, p3, offset, string) {
        return match === '#y' ? this.coords.y :
            match === '#x' ? this.coords.x :
            match === '#z' ? this.coords.z : null;
    }

    setColor(ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
    }

    topLeftTextFunction(ctx) {
        ctx.textAlign = "start";
        ctx.fillText(`( x: #x, y: #y )`.replace(this.REG_XYZ, this.replacer), 5, 20);
    }

    centerTextFunction(ctx) {
        if (this.centerText) {
            ctx.textAlign = "center";
            let center = this.centerText;
            if (typeof this.centerText === 'function') {
                center = this.centerText(this.coords)
            }
            ctx.fillText(center.toString().replace(this.REG_XYZ, this.replacer), this.size.x / 2, (this.size.y / 2) + 3)
        }
    }

    bottomLeftTextFunction(ctx) {
        if (this.bottomLeftText) {
            ctx.textAlign = "start";
            let bottomLeft = this.bottomLeftText
            if (typeof this.bottomLeftText === 'function') {
                bottomLeft = this.bottomLeftText(this.coords)
            }
            ctx.fillText(bottomLeft.toString().replace(this.REG_XYZ, this.replacer), 5, this.size.y - 12);
        }
    }

    createLeafletElement() {
        const _ = this;
        const Grid = GridLayer.extend({
            createTile: function (coords) {
                // create a <canvas> element for drawing
                const tile = document.createElement('canvas');
                tile.className = 'leaflet-tile';
                // setup tile width and height according to the options
                _.size = this.getTileSize();
                tile.width = _.size.x;
                tile.height = _.size.y;
                // get a canvas context and draw something on it using coords.x, coords.y and coords.z

                _.drawTile(tile, coords)

                // return the tile so it can be rendered on screen
                return tile;
            }
        });
        return new Grid(this.options);
    }

    updateLeafletElement(fromProps, toProps) {
        this.updateVariables(toProps);
        this.leafletElement._resetGrid();
        this.leafletElement._update();
        Object.keys(this.leafletElement._tiles).forEach(key => {
            const canvas = this.leafletElement._tiles[key];
            const ctx = canvas.el.getContext("2d");
            //smooth rendering
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;

            this.drawTile(canvas.el, canvas.coords);
        });
    }

    drawTile(tile, coords) {
        this.coords = coords;
        const ctx = tile.getContext('2d');
        tile.width = tile.width;
        ctx.translate(0.5, 0.5)
        ctx.setLineDash([3]);
        ctx.lineWidth = 0.4;
        this.setColor(ctx)
        ctx.rect(0, 0, tile.width, tile.height);
        ctx.stroke();

        this.topLeftTextFunction(ctx);
        this.centerTextFunction(ctx);
        this.bottomLeftTextFunction(ctx);
    }

}
