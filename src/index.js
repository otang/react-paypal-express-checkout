import React from 'react';
import ReactDOM from 'react-dom';
// import scriptLoader from 'react-async-script-loader';
import PropTypes from 'prop-types';

console.log('loading react-paypal-express-checkout...')

class PaypalButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        paypalLoaded: this.paypalIsLoaded(),
      }

      console.log('constructor()')

      this.waitForPaypal().then(() => {
        console.log('promise resolved!!')
        console.log('window.paypal.Button.react: ')
        console.log(window.paypal.Button.react)
        this.setState({paypalLoaded: true})
      })
    }

    waitForPaypal() {
        console.log('waitForPaypal()')
        const _this = this;
        return new Promise((resolve, reject) => {
            console.log('promise')
            if(this.paypalIsLoaded()) return resolve();

            //#todo - timeout: this.props.onError(new Error('Failed to initialize PayPal'));

            _this.waitForPaypalInterval = setInterval(() => {
                console.log('Waiting for paypal...')
                if(this.paypalIsLoaded()) {
                    clearInterval(_this.waitForPaypalInterval);
                    resolve();
                  }
            }, 200)
        })
    }

    paypalIsLoaded() {
      if(window.paypal && window.paypal.Button && window.paypal.Button.react) {
        return true;
      } else {
        return false;
      }
    }

    render() {
        if( !this.state.paypalLoaded) {
            return <p>loading...</p>;
            return null;
            // #todo - loader

        }


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

export default PaypalButton;
