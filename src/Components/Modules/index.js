import React, {Component, Fragment} from 'react'
import {Link, Redirect, Route, Switch} from "react-router-dom";
import Module from './Module/index'
import {Button, Card, CardActions, CardContent, Typography, withStyles} from "@material-ui/core";
import {serverUrl} from "../../config";

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

class Modules extends Component {
    state = {
        moduleStates: {},
        inputResponse: {}
    };

    constructor(props) {
        super(props);
        this.moduleInputs = {};

        if (props.modules) {
            props.modules.forEach(module => this.fetchModuleState(module.id));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modules)
            nextProps.modules.forEach(module => {
                this.fetchModuleState(module.id);
            })
    }

    async fetchModuleState(id) {
        const response = await fetch(`${serverUrl}/api/moduleState/${id}`);
        const moduleState = await response.json();
        this.setState(state => state.moduleStates[id] = moduleState);
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
        let {match: {url}, modules, classes} = this.props;
        return (
            <Fragment>
                <Switch>
                    <Route exact path={url} render={
                        () => {
                            if (!modules) return <h3>No modules found</h3>;

                            {
                                return modules.map(module => {
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

                                                <form>
                                                    <div ref={element => this.moduleInputs[module.id] = element}
                                                         dangerouslySetInnerHTML={{__html: module.htmlUi}}/>

                                                    <Button onClick={() => {
                                                        let inputs = {};
                                                        this.moduleInputs[module.id].childNodes
                                                            .forEach((node) => inputs[node.name] = node.value);
                                                        this.submitModuleInput(module.id, inputs)
                                                    }}>Submit</Button>

                                                </form>

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
                                )
                            }


                        }
                    }/>

                    <Route path={`${url}/:moduleId`} render={
                        ({match}) => {
                            if (!modules)
                                return <h3>No module found</h3>;

                            const module = modules.find(module => module.id === match.params.moduleId)

                            if (!module) return <h3>No module found for id {match.params.moduleId}</h3>;


                            return <Module {...module}/>

                        }
                    }/>
                    <Route render={() => <Redirect to="/404"/>}/>
                </Switch>
            </Fragment>
        );
    }
}

export default withStyles(styles)(Modules)