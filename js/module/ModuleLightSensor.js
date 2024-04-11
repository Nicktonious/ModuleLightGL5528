const proportion = (x, in_low, in_high, out_low, out_high) => {
    return (x - in_low) * (out_high - out_low) / (in_high - in_low) + out_low;
}
let u1 = 3.3;
let r1 = 10000; // Ом
let mult = 32017200;
let pow = 1.5832;
/**
 * @class
 * Класс для работы с датчиком освещенности GL5528
 */
class ClassLightGL5528 extends ClassSensor {
    constructor(_opts) {
        ClassSensor.call(this, _opts);
        if (this._Pins.length < 1) throw new Error();
    }
    Start(_chNum, _period) {
        this._ChStatus[0] = 1;
        this._ChStatus[1] = 1;
        let period = _period ? E.clip(_period, 20, 1000) : 50;
        
        this._Interval = setInterval(() => {
            
            let u2 = proportion(analogRead(this._Pins[0]), 0, 1, 0, 3.3);
            
            let rensor = (u2/u1) * r1 / (1 - u2/u1); //сопротивление
            // rensor = r1*u1 / u2 - r1;

            this.Ch1_Value = rensor;

            this.Ch0_Value = mult / Math.pow(rensor, pow);    //lux
        }, period);
    }
    Stop() {
        this._ChStatus[0] = 0;
        this._ChStatus[1] = 0;
        clearInterval(this._Interval);
        this._Interval = null;
    }
}

exports = ClassLightGL5528;