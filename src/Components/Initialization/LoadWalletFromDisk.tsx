import {Button, createStyles, Typography, WithStyles, withStyles} from "@material-ui/core";
import {Component} from "react";
import * as React from "react";
import {serverUrl} from "../../config";
import Module from "../../Models/Module";
import handleError from "../Errors/HandleError";
import ModuleView from "../Modules/ModuleView"

const styles = createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    }
});

interface IRestoreDialogProps extends WithStyles<typeof styles> {
    onSuccess: () => any;
    modules: Module[]
}

class LoadWalletFromDisk extends Component<IRestoreDialogProps, {}> {

    public moduleInputs = [];


    public render() {
        const {modules, classes} = this.props;
        return (
            <div className={classes.root}>

                <Typography>
                    Unlock your security modules
                </Typography>

                {modules && modules.map(module => {
                    return <ModuleView key={module.id} innerRef={this.setInnerRef(module)}
                                       module={module}/>
                })}

                <Button onClick={this.onUnlockClick} color="primary">
                    Unlock
                </Button>

            </div>
        )
    }

    private setInnerRef = (module: Module) => (element: any) => {
        this.moduleInputs[module.id] = element
    };

    private onUnlockClick = async () => {
        const moduleToInputsMap: { [moduleId: string]: any } = {};

        this.props.modules.forEach((module: Module) => {
            console.log(`onUnlockClick:getUserInputs = ${this.moduleInputs[module.id].getUserInputs()}`);
            moduleToInputsMap[module.id] = this.moduleInputs[module.id].getUserInputs();
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