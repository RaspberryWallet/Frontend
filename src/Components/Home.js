import React, {Component, Fragment} from 'react'
import {serverUrl} from '../config'
import {Card, CardContent, Typography, CardActions, Button} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';

const styles = {
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
};

class App extends Component {
    state = {
        ping: null,
        moduleStates: {},
        moduleUis: {},
        inputResponse: {}
    };

    constructor(props) {
        super(props);
        this.moduleInputs = {};

        if (props.modules) {
            props.modules.forEach(module => this.fetchModuleState(module.id));
            props.modules.forEach(module => this.fetchModuleUi(module.id));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modules)
            nextProps.modules.forEach(module => {
                this.fetchModuleState(module.id);
                this.fetchModuleUi(module.id);
            })
    }

    componentDidMount() {
        this.fetchPing();
    }

    async fetchPing() {
        console.log(`fetching pings`);
        const response = await fetch(serverUrl + '/api/ping');
        const ping = await response.json();
        console.log(`fetched ping ${JSON.stringify(ping)}`);
    }

    async fetchModuleState(id) {
        const response = await fetch(`${serverUrl}/api/moduleState/${id}`);
        const moduleState = await response.json();
        this.setState(state => state.moduleStates[id] = moduleState);
    }

    async fetchModuleUi(id) {
        const response = await fetch(`${serverUrl}/api/moduleHtmlUi/${id}`);
        const htmlUi = await response.text();
        this.setState(state => state.moduleUis[id] = htmlUi);
    }

    async submitModuleInput(id, inputs) {
        console.log(`id: ${id} inputs: ${JSON.stringify(inputs)}`);
        const response = await fetch(`${serverUrl}/api/nextStep/${id}`, {
            method: 'POST',
            body: JSON.stringify(inputs)
        });
        const responseJson = await response.json();
        this.setState(state => state.inputResponse[id] = responseJson);
        this.fetchModuleState(id);
    }


    render() {
        console.log("render");
        const {modules, classes} = this.props;

        return (
            <Fragment>
                {modules && modules.map(module => {

                        return <Card key={module.id} className={classes.card}>
                            <CardContent>
                                <Typography variant="headline" component="h2">
                                    {module.name}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    {module.id}
                                </Typography>
                                <Typography component="p">
                                    {module.description}
                                </Typography>
                                <Typography color="textSecondary">
                                    {this.state.moduleStates[module.id] && this.state.moduleStates[module.id].state} {this.state.moduleStates[module.id] && this.state.moduleStates[module.id].message}
                                </Typography>
                                {this.state.moduleUis[module.id] &&
                                <form>
                                    <div ref={element => this.moduleInputs[module.id] = element}
                                         dangerouslySetInnerHTML={{__html: this.state.moduleUis[module.id]}}/>

                                    <Button onClick={() => {
                                        let inputs = {};
                                        this.moduleInputs[module.id].childNodes
                                            .forEach((node) => inputs[node.name] = node.value);
                                        this.submitModuleInput(module.id, inputs)
                                    }}>Submit</Button>
                                </form>}

                                {this.state.inputResponse[module.id] &&
                                <Typography component="p">
                                    {`Response: ${this.state.inputResponse[module.id].response}`}
                                </Typography>}

                            </CardContent>

                            <CardActions>
                                <Button size="small" color="secondary">Details</Button>
                                <Button size="small" onClick={() => {
                                    this.fetchModuleState(module.id)
                                }}>Refresh</Button>
                            </CardActions>
                        </Card>
                    }
                )}

            </Fragment>
        )
    }

}

export default withStyles(styles)(App)