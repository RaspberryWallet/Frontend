import React, {Fragment, Component} from 'react'
import {serverUrl} from '../../../config'

export default class extends Component {
    state = {
        moduleState: null,
        __html: null
    };

    componentDidMount() {
        console.log("componentDidMount");
        this.fetchModuleState();
        this.fetchModuleUi();
    }

    async fetchModuleState() {
        console.log("fetchModuleState");
        const response = await fetch(`${serverUrl}/api/moduleState/${this.props.id}`);
        const moduleState = await response.json();
        this.setState({moduleState});
    }

    async fetchModuleUi() {
        console.log("fetchModuleUi");
        const response = await fetch(`${serverUrl}/api/moduleHtmlUi/${this.props.id}`);
        console.log(response);
        const htmlUi = await response.text();
        console.log(htmlUi);
        this.setState({htmlUi});
    }

    render() {
        const {moduleState, htmlUi} = this.state;
        const {id, name, description} = this.props;

        return (
            <Fragment>
                <h1>{name}</h1>
                <h3>{id}</h3>
                <p>{description}</p>

                <h3>{moduleState && <span>{moduleState.state}</span>} {moduleState && moduleState.message &&
                <span>{moduleState.message}</span>}</h3>
                <div dangerouslySetInnerHTML={{__html: htmlUi}}/>

            </Fragment>
        )
    }
}
