let u1 = 3.3;
let r1 = 10000; // Ом
let mult = 32017200;
let pow = -1.5832;
/**
 * @class
 * Класс для работы с датчиком освещенности GL5528
 */
class ClassLightGL5528 extends ClassSensor {
    constructor(_opts) {
        ClassSensor.call(this, _opts);
        this._K = _opts.k || mult;
        this._P = _opts.p || pow;
        if (this._Pins.length < 1 || 
            typeof this._K !== 'number' ||
            typeof this._P !== 'number') throw new Error('Invalid args');
    }
    Start(_chNum, _period) {
        this._ChStatus[0] = 1;
        this._ChStatus[1] = 1;
        let period = _period ? E.clip(_period, 20, 1000) : 50;
        
        this._Interval = setInterval(() => {
            
            let u2 = analogRead(this._Pins[0]) * E.getAnalogVRef();
            
            let rensor = (u2/u1) * r1 / (1 - u2/u1); //сопротивление
            // rensor = r1*u1 / u2 - r1;

            this.Ch1_Value = rensor;

            this.Ch0_Value = this._K * Math.pow(rensor, this._P);
            // this.Ch0_Value = mult / Math.pow(rensor, pow);    //lux

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