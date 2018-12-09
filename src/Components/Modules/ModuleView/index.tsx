import * as React from 'react'
import {Component} from 'react'
import {serverUrl} from '../../../config'
import Module from '../../../Models/Module'
import ModuleState from '../../../Models/ModuleState'
import {Button, Card, CardActions, CardContent, Typography, WithStyles, withStyles} from "@material-ui/core";
import {toast} from "react-toastify";

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

interface IModuleProps extends WithStyles<typeof styles> {
    module: Module;
}

interface IModuleState {
    moduleState: ModuleState | null
}

class ModuleView extends Component<IModuleProps, IModuleState> {
    public state: IModuleState = {
        moduleState: null
    };
    public moduleInput: HTMLDivElement | null;

    public componentDidMount() {
        console.log("componentDidMount");
        this.fetchModuleState(this.props.module.id);
    }

    public getUserInputs() {
        const inputs = {};
        if (this.moduleInput) {
            this.moduleInput.childNodes
                .forEach((node: any) => inputs[node.name] = node.value);
        }
        console.log(`getUserInputs() = ${JSON.stringify(inputs)}`);
        return inputs;
    }

    public render() {
        const {moduleState} = this.state;
        const {module, classes} = this.props;
        const {name, description, htmlUi} = module;
        return (
            <Card key={module.id} className={classes.card}>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        {name}
                    </Typography>
                    <Typography component="p">
                        {description}
                    </Typography>

                    <Typography color="textSecondary">
                        {moduleState && <span>{moduleState.state}</span>} {moduleState && moduleState.message &&
                    <span>{moduleState.message}</span>}
                    </Typography>


                    {htmlUi != null &&
                    <form>
                        <div ref={element => this.moduleInput = element}
                             dangerouslySetInnerHTML={{__html: htmlUi}}/>
                        <Button onClick={this.handleSubmitClick}>Submit</Button>
                    </form>
                    }
                </CardContent>
                <CardActions>
                    <Button size="small" color="secondary">Details</Button>
                    <Button size="small" color="primary" onClick={this.fetchModuleState(module.id)}>Refresh</Button>
                </CardActions>

            </Card>
        )
    }

    private handleSubmitClick = () => {
        this.submitModuleInput(this.props.module.id, this.getUserInputs())
    };

    private async submitModuleInput(id: string, inputs: any) {
        console.log(`id: ${id} inputs: ${JSON.stringify(inputs)}`);
        const response = await fetch(`${serverUrl}/api/nextStep/${id}`, {
            body: JSON.stringify(inputs),
            method: 'POST'
        });
        const responseJson: any = await response.json();
        console.log(JSON.stringify(responseJson));
        toast.info(responseJson.response);
        this.fetchModuleState(id)
    }

    private fetchModuleState = (moduleId: string) => async () => {
        console.log("fetchModuleState");
        const response = await fetch(`${serverUrl}/api/moduleState/${moduleId}`);
        const moduleState = await response.json();
        this.setState({moduleState});
    }

}

export default withStyles(styles)(ModuleView)