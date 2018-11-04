import * as React from 'react'
import {Component, Fragment} from 'react'
import {serverUrl} from '../../../config'
import Module from '../../../Models/Module'
import ModuleState from '../../../Models/ModuleState'

interface IModuleState {
    htmlUi: any,
    moduleState: ModuleState | null
}

export default class extends Component<Module, IModuleState> {
    public state : IModuleState = {
        htmlUi: null,
        moduleState: null
    };

    public componentDidMount() {
        console.log("componentDidMount");
        this.fetchModuleState();
        this.fetchModuleUi();
    }

    public render() {
        const {moduleState, htmlUi} = this.state;
        const {id, name, description} = this.props;

        return (
            <Fragment>
                <h1>{name}</h1>
                <h3>{id}</h3>
                <p>{description}</p>

                <h3>{moduleState && <span>{moduleState.state}</span>} {moduleState && moduleState.message &&
                <span>{moduleState.message}</span>}</h3>

                {htmlUi != null &&
                <div dangerouslySetInnerHTML={{__html: htmlUi}}/>
                }

            </Fragment>
        )
    }

    private async fetchModuleState() {
        console.log("fetchModuleState");
        const response = await fetch(`${serverUrl}/api/moduleState/${this.props.id}`);
        const moduleState = await response.json();
        this.setState({moduleState});
    }

    private async fetchModuleUi() {
        console.log("fetchModuleUi");
        const response = await fetch(`${serverUrl}/api/moduleHtmlUi/${this.props.id}`);
        console.log(response);
        const htmlUi = await response.text();
        console.log(htmlUi);
        this.setState({htmlUi});
    }
}
