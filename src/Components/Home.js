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
        ping: null
    };

    constructor(props){
        super(props)
        if (props.modules)
            props.modules.forEach(module => this.fetchModuleState(module.id))
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.modules)
            nextProps.modules.forEach(module => this.fetchModuleState(module.id))
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
        console.log(`fetching stateForModule ${id}`);
        const response = await fetch(`${serverUrl}/api/moduleState/${id}`);
        const moduleState = await response.json();
        console.log(`fetched moduleState ${JSON.stringify(moduleState)}`);
        this.setState(props => props[id] = moduleState);
    }

    render() {
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
                                    {this.state[module.id] && this.state[module.id].state} {this.state[module.id] && this.state[module.id].message}
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button size="small" color="secondary">Details</Button>
                                <Button size="small" onClick={() => this.fetchModuleState(module.id)}>Refresh</Button>
                            </CardActions>
                        </Card>
                    }
                )}

            </Fragment>
        )
    }
}

export default withStyles(styles)(App)