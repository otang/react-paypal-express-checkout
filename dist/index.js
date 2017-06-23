(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'react-dom', 'prop-types'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-dom'), require('prop-types'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactDom, global.propTypes);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _reactDom, _propTypes) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _propTypes2 = _interopRequireDefault(_propTypes);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    console.log('loading react-paypal-express-checkout...');

    var PaypalButton = function (_React$Component) {
        _inherits(PaypalButton, _React$Component);

        function PaypalButton(props) {
            _classCallCheck(this, PaypalButton);

            var _this2 = _possibleConstructorReturn(this, (PaypalButton.__proto__ || Object.getPrototypeOf(PaypalButton)).call(this, props));

            _this2.state = {
                paypalLoaded: _this2.paypalIsLoaded()
            };

            console.log('constructor()');

            _this2.waitForPaypal().then(function () {
                console.log('promise resolved!!');
                console.log('window.paypal.Button.react: ');
                console.log(window.paypal.Button.react);
                _this2.setState({ paypalLoaded: true });
            });
            return _this2;
        }

        _createClass(PaypalButton, [{
            key: 'waitForPaypal',
            value: function waitForPaypal() {
                var _this3 = this;

                console.log('waitForPaypal()');
                var _this = this;
                return new Promise(function (resolve, reject) {
                    console.log('promise');
                    if (_this3.paypalIsLoaded()) return resolve();

                    //#todo - timeout: this.props.onError(new Error('Failed to initialize PayPal'));

                    _this.waitForPaypalInterval = setInterval(function () {
                        console.log('Waiting for paypal...');
                        if (_this3.paypalIsLoaded()) {
                            clearInterval(_this.waitForPaypalInterval);
                            resolve();
                        }
                    }, 200);
                });
            }
        }, {
            key: 'paypalIsLoaded',
            value: function paypalIsLoaded() {
                if (window.paypal && window.paypal.Button && window.paypal.Button.react) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this4 = this;

                if (!this.state.paypalLoaded) {
                    return _react2.default.createElement(
                        'p',
                        null,
                        'loading...'
                    );
                    return null;
                    // #todo - loader
                }

                var payment = function payment() {
                    return paypal.rest.payment.create(_this4.props.env, _this4.props.client, {
                        transactions: [{ amount: { total: _this4.props.total, currency: _this4.props.currency } }]
                    });
                };

                var onAuthorize = function onAuthorize(data, actions) {
                    return actions.payment.execute().then(function (payment) {
                        _this4.props.onSuccess(payment);
                        // const payment = Object.assign({}, this.props.payment);
                        // payment.paid = true;
                        // payment.cancelled = false;
                        // payment.payerID = data.payerID;
                        // payment.paymentID = data.paymentID;
                        // payment.paymentToken = data.paymentToken;
                        // payment.returnUrl = data.returnUrl;
                        // this.props.onSuccess(payment);
                    });
                };

                var ppbtn = '';
                ppbtn = _react2.default.createElement(paypal.Button.react, {
                    env: this.props.env,
                    client: this.props.client,
                    style: this.props.style,
                    payment: payment,
                    commit: true,
                    onAuthorize: onAuthorize,
                    onCancel: this.props.onCancel,
                    onError: this.props.onError
                });
                return _react2.default.createElement(
                    'div',
                    null,
                    ppbtn
                );
            }
        }]);

        return PaypalButton;
    }(_react2.default.Component);

    PaypalButton.propTypes = {
        currency: _propTypes2.default.string.isRequired,
        total: _propTypes2.default.number.isRequired,
        client: _propTypes2.default.object.isRequired,
        style: _propTypes2.default.object,

        label: _propTypes2.default.oneOf(['checkout', 'credit', 'pay']),
        size: _propTypes2.default.oneOf(['small', 'medium', 'responsive'])
    };

    PaypalButton.defaultProps = {
        env: 'sandbox',
        label: 'checkout',
        size: 'responsive',

        onSuccess: function onSuccess(payment) {
            console.log('The payment was succeeded!', payment);
        },
        onCancel: function onCancel(data) {
            console.log('The payment was cancelled!', data);
        },
        onError: function onError(err) {
            console.log('Error loading Paypal script!', err);
        }
    };

    exports.default = PaypalButton;
});