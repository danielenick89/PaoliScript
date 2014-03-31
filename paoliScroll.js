var container = document.getElementById('container');

var layers = document.getElementsByClassName('layer');

var layerObjs = []

//class LayerObject
function LayerObject(layer) {
    this.layer = layer

    this.zIndex = 0

    this.top = 0

    this.current = 0

    this.scroll = function(percent) {
        var ret = 0

        if(this.top == -100 && percent < 0) {
            return 0
        }
        else if(this.top == 0 && percent > 0 ) {
            return 0
        }

        this.top += percent
        if(this.top <= -100) {
            this.top = -100
            ret = 1
            this.invertZIndex(-1)
        }
        else if(this.top >= 0) {
            this.top = 0
            ret = -1
            this.invertZIndex(1)
        }

        this.refreshLayerTop()

        return ret;
    }

    this.setCurrent = function(bool) {
        this.current = bool
        if(bool) {
            this.showOver()
        } else {
            this.restore()
        }
    }

    this.refreshLayerTop = function() {
        this.layer.style.top = this.top + '%';
    }

    this.showOver = function() {
        this.zIndex += 100
        this.refreshLayerZIndex()
    }

    this.restore = function() {
        this.zIndex -= 100
        this.refreshLayerZIndex()
    }

    this.setZIndex = function(rel) {
        if(this.zIndex >= 0) {
            this.zIndex += rel
        } else {
            this.zIndex -= rel
        }
        this.refreshLayerZIndex()
    }

    this.invertZIndex = function(sign) {
        if(this.current) this.zIndex = vass(this.zIndex) - 100

        if(sign > 0) this.zIndex = vass(this.zIndex)
        else this.zIndex = -vass(this.zIndex)

        if(this.current) this.zIndex += 100


        this.refreshLayerZIndex()
        
    }

    this.refreshLayerZIndex = function() {
        this.layer.style.zIndex = this.zIndex
    }

    this.setBackgroundColor = function(color) {
        this.layer.style.backgroundColor = color    
    }

    this.setBackgroundColor(randomColor())
}

//creating the layers objects
for(var i=0; i<layers.length; i++) {
    layerObjs.push(new LayerObject(layers[i]))
    layerObjs[i].setZIndex(layers.length - i - 1)
}

var current = 0
layerObjs[current].setCurrent(true)

var deltaScroll = 15/120 // % of scroll per mouse wheel delta

container.onmousewheel = function(e) {
    var delta = e.wheelDelta

    if(current < 0) current = 0
    if(current >= layers.length) current = layers.length - 1 

    var ret = layerObjs[current].scroll(delta*deltaScroll)

    if(ret != 0 && layerObjs[current+ret] != undefined) {
        layerObjs[current].setCurrent(false)
        current += ret
        layerObjs[current].setCurrent(true)
    }

}

function vass(val) { return val >= 0 ? val : -val; }
function randomColor() { var v = Math.random(); v *= 255*255*255; r = Math.floor(v) % 255; g = Math.floor((v/255)) % 255; b = Math.floor(v/255/255) % 255; return "rgb("+r+","+g+","+b+")" }