import React, {Fragment, Component} from 'react'

export default class extends Component {
    state = {
        moduleState: null
    };

    componentDidMount() {
        this.fetchModuleState();
    }

    async fetchModuleState() {
        const response = await fetch(`http://localhost:9090/moduleState/${this.props.id}`);
        const moduleState = await response.json();
        this.setState({moduleState});
    }

    render() {
        const {moduleState} = this.state;
        const {id, name, description} = this.props;

        return (
            <Fragment>
                <h1>{name}</h1>
                <h3>{id}</h3>
                <h3>{moduleState && <span>{moduleState.state}</span>} {moduleState && moduleState.message && <span>{moduleState.message}</span>}</h3>
                <p>{description}</p>


            </Fragment>
        )
    }
}
