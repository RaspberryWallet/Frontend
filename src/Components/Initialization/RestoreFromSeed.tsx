import {Button, createStyles, Typography, WithStyles, withStyles} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import TextField from "@material-ui/core/TextField/TextField";
import {ChangeEvent, Component} from "react";
import * as React from "react";
import {toast} from "react-toastify";
import Module from "../../Models/Module";
import Api from "../../Api";

const styles = createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    module: {
        display: 'flex',
        flexDirection: 'row',
    }
});

interface IRestoreFromSeedProps extends WithStyles<typeof styles> {
    onSuccess: () => any;
    modules: Module[]
}

interface IRestoreFromSeedState {
    moduleSelectionState: Map<string, boolean>;
    mnemonicWords: string;
    required: string;
}

class RestoreFromSeed extends Component<IRestoreFromSeedProps, IRestoreFromSeedState> {

    public moduleInputs = [];

    public state: IRestoreFromSeedState = {
        mnemonicWords: "",
        moduleSelectionState: new Map<string, boolean>(),
        required: "",
    };


    public render() {
        const {modules, classes} = this.props;
        return (
            <div className={classes.root}>
                <Typography variant="h5">
                    Enter 12 mnemonic words to restore your wallet
                </Typography>
                <TextField
                    onChange={this.onMnemonicWordsChange}
                    multiline={true}
                    autoFocus={true}
                    margin="dense"
                    id="name"
                    label="12 Mnemonic words"
                    fullWidth={true}
                />
                {modules && modules.map(module => {
                    return <div key={module.id} className={classes.module}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.moduleSelectionState.get(module.id)}
                                    onChange={this.handleSelectedModuleChange(module.id)}
                                    value={module.id}
                                />
                            }
                            label={module.name}
                        />
                        <form>
                            <div ref={element => this.moduleInputs[module.id] = element}
                                 dangerouslySetInnerHTML={{__html: module.htmlUi}}/>
                        </form>
                    </div>
                })}
                <TextField
                    id="standard-number"
                    label="no. modules required"
                    value={this.state.required}
                    onChange={this.onModulesNumberRequiredChange}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />

                <Button onClick={this.onRestoreClick} color="primary">
                    Restore
                </Button>
            </div>
        )
    }

    private onMnemonicWordsChange =
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const mnemonicWords = event.target.value;
            this.setState({mnemonicWords})
        };
    private onModulesNumberRequiredChange =
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const required = event.target.value;
            this.setState({required})
        };

    private handleSelectedModuleChange = (moduleId: string) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | any>) => {
            const checked = event.target.checked;
            this.setState(state => {
                state.moduleSelectionState.set(moduleId, checked)
            });
        };

    private onRestoreClick = async () => {
        const {mnemonicWords, moduleSelectionState, required} = this.state;
        const modules = {};

        moduleSelectionState.forEach((isSelected: boolean, moduleId: string) => {
            console.log(isSelected + " " + moduleId);
            const inputs = {};
            const theModuleInputs = this.moduleInputs[moduleId];
            if (theModuleInputs) {
                theModuleInputs.childNodes
                    .forEach((node: any) => inputs[node.name] = node.value);
            }

            if (isSelected) {
                modules[moduleId] = inputs;
            }
        });

        console.log(JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required}));

        await Api.postRestoreFromBackupPhrase(mnemonicWords, modules, required);
        toast.success("Restored successfully");
        this.props.onSuccess();
    }
}

export default withStyles(styles)(RestoreFromSeed)