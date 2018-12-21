import {Button, Card, CardActions, CardContent, Typography, WithStyles, withStyles} from "@material-ui/core";
import * as React from 'react'
import {Component, Fragment} from 'react'
// @ts-ignore
import {Redirect, Route, Switch} from "react-router-dom";
import {serverHttpUrl} from "../../config";
import Module from '../../Models/Module'
import ModuleView from './ModuleView/index'
import Api from "../../Api";

const styles = {
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    card: {
        minWidth: 275,
    },
    pos: {
        marginBottom: 12,
    },
};

interface IModulesProps extends WithStyles<typeof styles> {
    modules: Module[]
    match: any;
}

interface IModulesState {
    inputResponse: any;
    moduleStates: any;
}

class Modules extends Component<IModulesProps, IModulesState> {
    private moduleInputs: { [name: string]: HTMLDivElement | null } = {};

    constructor(props: IModulesProps) {
        super(props);
        this.state = {
            inputResponse: {},
            moduleStates: {}
        };

        if (props.modules) {
            props.modules.forEach(module => this.fetchModuleState(module.id));
        }
    }

    public componentWillReceiveProps(nextProps: IModulesProps) {
        if (nextProps.modules) {
            nextProps.modules.forEach(module => {
                this.fetchModuleState(module.id);
            })
        }
    }


    public render() {
        const {match: {url}} = this.props;
        return (
            <Fragment>
                <Switch>
                    <Route exact={true} path={url} render={this.renderExactPath}/>

                    <Route path={`${url}/:moduleId`} render={this.renderModulePath}/>
                    <Route render={this.renderRedirect}/>
                </Switch>
            </Fragment>
        );
    }

    private renderExactPath = () => {
        const {modules, classes} = this.props;

        if (!modules) {
            return <h3>No modules found</h3>;
        } else {
            return modules.map((module: Module) => {
                    return <Card key={module.id} className={classes.card}>
                        <CardContent>
                            <Typography variant="h5">
                                {module.name}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                {module.id}
                            </Typography>
                            <Typography>
                                {module.description}
                            </Typography>
                            <Typography color="textSecondary">
                                {this.state.moduleStates[module.id] && this.state.moduleStates[module.id].state} {this.state.moduleStates[module.id] && this.state.moduleStates[module.id].message}
                            </Typography>

                            <form>
                                <div ref={element => this.moduleInputs[module.id] = element}
                                     dangerouslySetInnerHTML={{__html: module.htmlUi}}/>

                                <Button onClick={this.handleSubmitClick}>Submit</Button>

                            </form>

                            {this.state.inputResponse[module.id] &&
                            <Typography>
                                {`Response: ${this.state.inputResponse[module.id].response}`}
                            </Typography>}

                        </CardContent>

                        <CardActions>
                            <Button size="small" color="secondary">Details</Button>
                            <Button size="small" onClick={this.fetchModuleState(module.id)}>Refresh</Button>
                        </CardActions>
                    </Card>
                }
            )
        }
    };
    private renderModulePath = (route: any) => {
        const match = route.match;

        const modules: Module[] = this.props.modules;

        if (!modules) {
            return <h3>No module found</h3>;
        }

        const foundModule = modules.find((module: Module) => module.id === match.params.moduleId);

        if (!foundModule) {
            return <h3>No module found for id {match.params.moduleId}</h3>;
        }
        return <ModuleView module={foundModule}/>
    };

    private renderRedirect = () => {
        return <Redirect to="/404"/>
    };

    private handleSubmitClick = () => {
        const inputs: any = {};

        const theModuleInputs = this.moduleInputs[module.id];
        if (theModuleInputs != null) {
            theModuleInputs.childNodes
                .forEach((node: ChildNode) => inputs[node.nodeName] = node.nodeValue);
        }
        this.submitModuleInput(module.id, inputs)
    };

    private fetchModuleState = (id: string) => async () => {
        const moduleState = await Api.fetchModuleState(id);
        this.setState(state => state.moduleStates[id] = moduleState);
    };

    private async submitModuleInput(id: string, inputs: any) {
        console.log(`id: ${id} inputs: ${JSON.stringify(inputs)}`);
        const response = await fetch(`${serverHttpUrl}/api/nextStep/${id}`, {
            body: JSON.stringify(inputs),
            method: 'POST'
        });
        const responseJson = await response.json();
        this.setState(state => state.inputResponse[id] = responseJson);
        this.fetchModuleState(id);
    }
}

export default withStyles(styles)(Modules)