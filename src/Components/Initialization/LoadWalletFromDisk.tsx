import {Button, Typography, WithStyles, withStyles} from "@material-ui/core";
import {Component} from "react";
import * as React from "react";
import {serverUrl} from "../../config";
import Module from "../../Models/Module";
import handleError from "../Errors/HandleError";
import './LoadWalletFromDisk.css'

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

interface IRestoreDialogProps extends WithStyles<typeof styles> {
    onSuccess: () => any;
    modules: Module[]
}

class LoadWalletFromDisk extends Component<IRestoreDialogProps, {}> {

    public moduleInputs = [];


    public render() {
        const {modules} = this.props;
        return (
            <div className="root">

                <Typography>
                    Unlock your security modules
                </Typography>

                {modules && modules.map(module => {
                    return <div key={module.id} className="module">
                        <Typography variant="headline" component="h3">{module.name}</Typography>
                        <form>
                            <div ref={element => this.moduleInputs[module.id] = element}
                                 dangerouslySetInnerHTML={{__html: module.htmlUi}}/>
                        </form>
                    </div>
                })}

                <Button onClick={this.onUnlockClick} color="primary">
                    Unlock
                </Button>

            </div>
        )
    }

    private onUnlockClick = async () => {
        const moduleToInputsMap: { [moduleId: string]: any } = {};

        this.props.modules.forEach((module: Module) => {
            const inputs = {};
            const theModuleInputs = this.moduleInputs[module.id];
            if (theModuleInputs) {
                theModuleInputs.childNodes
                    .forEach((node: any) => inputs[node.name] = node.value);
            }

            moduleToInputsMap[module.id] = inputs;
        });

        console.log(JSON.stringify({moduleToInputsMap}));
        const response = await fetch(`${serverUrl}/api/loadWalletFromDisk`, {
            body: JSON.stringify(moduleToInputsMap),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        if (response.ok) {
            this.props.onSuccess()
        } else {
            handleError(response);
        }
    }

}

export default withStyles(styles)(LoadWalletFromDisk)