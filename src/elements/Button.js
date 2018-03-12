import React from 'react';

export class Button extends React.Component{
    render(){
        return (
            <button className={ `button primary ${ this.props.color }` } onClick={ this.props.clickHandler }>
                <div className="buttonInner">{ this.props.text }</div>
            </button>
        );
    }
}
