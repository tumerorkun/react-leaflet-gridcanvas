import { GridLayer } from 'leaflet'
import { GridLayer as RLGridLayer } from 'react-leaflet'

export default class GridCanvas extends RLGridLayer {

    constructor(props, context) {
        super(props);
        this.updateVariables = this.updateVariables.bind(this);
        this.replacer = this.replacer.bind(this);
        this.topLeftTextFunction = this.topLeftTextFunction.bind(this);
        this.centerTextFunction = this.centerTextFunction.bind(this);
        this.recordTileForNextPropDiff = this.recordTileForNextPropDiff.bind(this);

        this.updateVariables(props);
        this.tiles = {};
        this.zoom = null;
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

    recordTileForNextPropDiff(tile, size) {
        let key = `${this.coords.x}:${this.coords.y}:${this.coords.z}`
        this.tiles[key] = {
            tile: tile,
            size: size
        }
    }

    setColor(ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
    }

    topLeftTextFunction(ctx, size) {
        ctx.fillText(`( x: #x, y: #y )`.replace(this.REG_XYZ, this.replacer), 5, 20);
    }

    centerTextFunction(ctx, size) {
        if (this.centerText) {
            ctx.textAlign = "center";
            let center = this.centerText;
            if (typeof this.centerText === 'function') {
                center = this.centerText(this.coords)
            }
            ctx.fillText(center.toString().replace(this.REG_XYZ, this.replacer), size.x / 2, (size.y / 2) + 3)
        }
    }

    bottomLeftTextFunction(ctx, size) {
        if (this.bottomLeftText) {
            ctx.textAlign = "start";
            let bottomLeft = this.bottomLeftText
            if (typeof this.bottomLeftText === 'function') {
                bottomLeft = this.bottomLeftText(this.coords)
            }
            ctx.fillText(bottomLeft.toString().replace(this.REG_XYZ, this.replacer), 5, size.y - 12);
        }
    }

    createLeafletElement() {
        const _ = this;
        this.zoom = this.map.getZoom();
        console.log(this.zoom)
        const Grid = GridLayer.extend({
            createTile: function (coords) {
                _.coords = coords;
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
                _.setColor(ctx)
                ctx.rect(0, 0, tile.width, tile.height);
                ctx.stroke();

                _.topLeftTextFunction(ctx, size);

                _.centerTextFunction(ctx, size);

                _.bottomLeftTextFunction(ctx, size);

                _.recordTileForNextPropDiff(tile, size);
                // return the tile so it can be rendered on screen
                return tile;
            }
        });
        return new Grid(this.options);
    }

    updateLeafletElement(fromProps, toProps) {
        this.updateVariables(toProps);
        this.zoom = this.map.getZoom();
        // if (this.props.options && this.props.options !== this.options) {
            this.leafletElement.redraw();
        // }
        // Object.keys(this.tiles).forEach((key) => {
        //     let coordsSplit = key.split(':')
        //     let coords = {
        //         x: Number(coordsSplit[0]),
        //         y: Number(coordsSplit[1]),
        //         z: Number(coordsSplit[2])
        //     }
        //     this.coords = coords;
        //     const ctx = this.tiles[key]['tile'].getContext('2d')
        //     ctx.clearRect(0, 0, this.tiles[key]['size'].x, this.tiles[key]['size'].y);

        //     this.setColor(ctx);
        //     this.topLeftTextFunction(ctx, this.tiles[key]['size']);
        //     this.centerTextFunction(ctx, this.tiles[key]['size']);
        //     this.bottomLeftTextFunction(ctx, this.tiles[key]['size']);
        // })
    }
}
