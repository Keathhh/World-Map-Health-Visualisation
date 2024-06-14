////////////////////////////////////// MATH //////////////////////////////////////

// modulo function, because theres no native operator for this
var mod = function (n, m) {
        var remain = n % m;
        return Math.floor(remain >= 0 ? remain : remain + m);
    };

////////////////////////////////////// MOUSEPOS //////////////////////////////////////

// axis: bool
// true for x, false for y
// operates on a single coordinate value at a time
function scalefromCenter_proportional(axis, coord, bound){
        //x acis adjustment
        if (axis) {
                // multiplier that decreases the closer the cursopr is to center
                xCenter = bound/2;
                if (coord<xCenter) {
                        // mouse pos is left
                        ratio_toCenter = 1-(coord/xCenter)
                        return coord + (110*ratio_toCenter)
                } else if (coord>xCenter) {
                        // mouse pos is right
                        ratio_toCenter = (coord/xCenter) - 1
                        return coord - (110*ratio_toCenter)
                }
                return coord

        } 
        //y acis adjustment
        else {
                yCenter = bound/2;
                // coord = coord - 130
                if (coord<yCenter) {
                        // mouse pos is up
                        ratio_toCenter = 1-(coord/yCenter)
                        return coord + (90*ratio_toCenter) + 30
                } else if (coord>yCenter) {
                        // mouse pos is down
                        ratio_toCenter = (coord/yCenter)-1
                        return coord - (90*ratio_toCenter)
                }  
                return coord
        }
}

// axis: bool
// true for x, false for y
function mouseQuart(axis, coord, bound){
        if (axis) {
                xCenter = bound/2;
                if (coord<xCenter) {/* mouse pos is left */ return true}
                // mouse pos is right
                return false
        } 
        //y acis adjustment
        else {
                yCenter = bound/2;
                // coord = coord - 130
                if (coord<yCenter) {/* mouse pos is up */return true}
                return false
        }
}
