# react-leaflet-gridcanvas
React leaflet component to display grid and some info in the grid.

Supports react-leaflet v1 and v2

You can see an example project on [react-leaflet-components-examples repository](https://github.com/tumerorkun/react-leaflet-components-examples.git)

[working demo page](https://tumerorkun.github.io/react-leaflet-components-examples/)


# Usage

### install package
```javascript
npm i react-leaflet-gridcanvas
```

### import to project
```javascript
import { GridCanvas } from 'react-leaflet-gridcanvas'
```

### use it in the map
```javascript
<GridCanvas />
```
#### default props
```javascript
color = 'white'
centerText = 'zoom: #z' // #z will replace with zoom value
options = {
  noWrap: true,
  bounds: [[-90, -180], [90, 180]]
}
```
centerText can be function :
```javascript
<GridCanvas centerText={
  ({x, y, z}) => {
    // do what ever you want
    return `x: ${x}, y: ${y}, z: ${z}`;
    // or
    // return 'x: #x, y: #y, z: #z'
  }
}/>
```
