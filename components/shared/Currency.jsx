// react
import React from 'react';
import { connect } from 'react-redux';

function Currency(props) {
    let { value } = props;


    if (value) {
        value = value + '';
        if (value?.indexOf('.00') != -1) {
            value = value.replace('.00', ' ')
        } else if (value?.indexOf(',00') != -1) {
            value = value.replace(',00', ' ')
        }
    }

    return <React.Fragment>{value}</React.Fragment>;
}

const mapStateToProps = (state) => ({
    currentCurrency: state.currency,
});

export default connect(mapStateToProps)(Currency);
