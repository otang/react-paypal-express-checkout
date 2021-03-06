import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import PropTypes from 'prop-types';

class PaypalButton extends React.Component {
    constructor(props) {
        super(props);
        window.React = React;
        window.ReactDOM = ReactDOM;
        this.state = {
            showButton: false
        }
    }

    componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
        if (!this.state.show) {
            if (isScriptLoaded && !this.props.isScriptLoaded) {
                if (isScriptLoadSucceed) {
                    this.setState({ showButton: true });
                } else {
                    console.log('Cannot load Paypal script!');
                    this.props.onError(new Error('Failed to initialize PayPal'));
                }
            }
        }
    }

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;
        if (isScriptLoaded && isScriptLoadSucceed) {
            this.setState({ showButton: true });
        }
    }

    render() {
        let payment = () => {
            return paypal.rest.payment.create(this.props.env, this.props.client, {
                transactions: [
                    { amount: { total: this.props.total, currency: this.props.currency } }
                ]
            });
        }

        const onAuthorize = (data, actions) => {
            return actions.payment.execute().then((payment) => {
                this.props.onSuccess(payment)
                // const payment = Object.assign({}, this.props.payment);
                // payment.paid = true;
                // payment.cancelled = false;
                // payment.payerID = data.payerID;
                // payment.paymentID = data.paymentID;
                // payment.paymentToken = data.paymentToken;
                // payment.returnUrl = data.returnUrl;
                // this.props.onSuccess(payment);
            })
        }

        let ppbtn = '';
        if (this.state.showButton) {
            ppbtn = <paypal.Button.react
                env={this.props.env}
                client={this.props.client}
                style={this.props.style}
                payment={payment}
                commit={true}
                onAuthorize={onAuthorize}
                onCancel={this.props.onCancel}
                onError={this.props.onError}
            />
        }
        return <div>{ppbtn}</div>;
    }
}

PaypalButton.propTypes = {
    currency: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    client: PropTypes.object.isRequired,
    style: PropTypes.object,

    label: PropTypes.oneOf(['checkout', 'credit', 'pay']),
    size: PropTypes.oneOf(['small', 'medium', 'responsive']),
}

PaypalButton.defaultProps = {
    env: 'sandbox',
    label: 'checkout',
    size: 'responsive',

    onSuccess: (payment) => {
        console.log('The payment was succeeded!', payment);
    },
    onCancel: (data) => {
        console.log('The payment was cancelled!', data)
    },
    onError: (err) => {
        console.log('Error loading Paypal script!', err)
    }
};

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
