import React from 'react';

/*
    Section Title
*/
export class SectionTitle extends React.Component {
    /*constructor( props ){

    }*/
    render(){

        let title = null;
        if( typeof this.props.color !== "undefined" ){
            title = (
                <h3 className={ `sectionTitle dash-below dash-center dash-medium dash-${ this.props.color } uppercase ${ typeof this.props.classes !== "undefined" ? this.props.classes : "" }` }>
                    { this.props.children }
                </h3>
            );
        }else{
            title = (
                <h3 className={ `sectionTitle uppercase ${ typeof this.props.classes !== "undefined" ? this.props.classes : "" }` }>
                    { this.props.children }
                </h3>
            );
        }

        return title;
    }
}



/*
    CardTitle
*/
export class CardTitle extends React.Component {
    /*constructor( props ){

    }*/
    render(){
        return(
            <h4 className={ `cardTitle uppercase ${ typeof this.props.classes !== "undefined" ? this.props.classes : "" }` }>
                { this.props.children }
            </h4>
        );
    }
}



/*
    ElementTitle
*/
export class ElementTitle extends React.Component {
    /*constructor( props ){

    }*/
    render(){
        return(
            <h5 className={ `elementTitle uppercase ${ typeof this.props.classes !== "undefined" ? this.props.classes : "" }` }>
                { this.props.children }
            </h5>
        );
    }
}


/*
    Body Text
*/
export class BodyCopy extends React.Component {
    /*constructor( props ){

    }*/
    render(){
        return(
            <p className={ `body-copy font-helvetica ${ typeof this.props.classes !== "undefined" ? this.props.classes : "" }` }>
                { this.props.children }
            </p>
        );
    }
}
