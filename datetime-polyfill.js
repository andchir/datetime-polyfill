/**
 * datetime-polyfill
 * @version 1.0.0
 * @author Andchir<andchir@gmail.com>
 */

(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.DatetimePolyfill = factory();
    }

}(function( ) {

    'use strict';

    function DatetimePolyfill(initOptions) {

        const self = this;

        this.init = function() {
            this.onReady(this.replaceInputs.bind(this));
        };

        this.onReady = function(cb) {
            if (document.readyState !== 'loading') {
                cb();
            } else {
                document.addEventListener('DOMContentLoaded', cb);
            }
        };

        this.replaceInputs = function() {
            const replacedInputs = [];
            const inputs = document.querySelectorAll('input[type="datetime"],input[type="datetime-local"]');

            const onChangeFunc = function(input, inpDate, inpTime) {
                const valueDate = inpDate.value;
                const valueTime = inpTime.value;
                if (!valueDate || !valueTime) {
                    input.value = '';
                    return;
                }
                input.value = valueDate + 'T' + valueTime;
            };

            Array.from(inputs).forEach(function(input) {
                if (['datetime', 'datetime-local'].indexOf(input.type) > -1) {
                    return;
                }
                input.type = 'hidden';
                const values = self.parseValue(input.value);
                const inpDate = self.createInput('date', input.className, {
                    width: '60%',
                    boxSizing: 'border-box',
                    display: 'block',
                    float: 'left',
                    borderRight: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                }, function() {
                    onChangeFunc(input, inpDate, inpTime);
                });
                inpDate.setAttribute('name', 'polyfill_' + input.name);
                inpDate.setAttribute('form', 'fake');
                if (values.length === 2) {
                    inpDate.value = values[0];
                }

                const inpTime = self.createInput('time', input.className, {
                    width: '40%',
                    boxSizing: 'border-box',
                    display: 'block',
                    float: 'left',
                    borderLeft: 0,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                }, function() {
                    onChangeFunc(input, inpDate, inpTime);
                });
                inpTime.setAttribute('name', 'polyfill_' + input.name);
                inpTime.setAttribute('form', 'fake');
                if (values.length === 2) {
                    inpTime.value = values[1];
                }

                input.parentNode.appendChild(inpDate);
                input.parentNode.appendChild(inpTime);

                const divEl = document.createElement('div');
                divEl.style.clear = 'left';
                input.parentNode.appendChild(divEl);

                replacedInputs.push(input);
            });

            return replacedInputs;
        };

        this.createInput = function(type, className, styles, onChange) {
            const inp = document.createElement('input');
            inp.type = type;
            inp.className = className;
            if (styles) {
                this.css(inp, styles);
            }
            if (typeof onChange === 'function') {
                inp.onchange = onChange.bind(inp);
            }
            return inp;
        };

        this.parseValue = function(value) {
            return value && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
                ? value.split('T')
                : [];
        };

        this.css = function (el, styles) {
            this.forEachObj(styles, function (key, val) {
                el.style[key] = val;
            });
        };

        this.forEachObj = function (obj, callback) {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    callback(prop, obj[prop]);
                }
            }
            return obj;
        };

        this.init();
    }

    return DatetimePolyfill;
}));

const datetimePolyfill = new DatetimePolyfill();
