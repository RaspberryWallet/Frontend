import {Button} from "@material-ui/core";
import TextField from "@material-ui/core/es/TextField/TextField";
import * as React from 'react'
import {Component, Fragment} from "react";
import {ChangeEvent} from "react";
import {Redirect} from "react-router";
import {toast} from "react-toastify";
import {serverHttpUrl} from "../../config";
import Module from "../../Models/Module";
import handleError from "../Errors/HandleError";
import LoadWalletFromDisk from "./LoadWalletFromDisk";
import RestoreFromSeed from "./RestoreFromSeed";



interface IInitProps {
    modules: Module[];
}

interface IInitState {
    password: string;
    phase: "DATABASE_PASSWORD" | "UNLOCK_OR_RESTORE";
    toHome: boolean;
    walletStatus: "FIRST_TIME" | "UNLOADED" | "ENCRYPTED" | "DECRYPTED" | null;
}


class Initialization extends Component<IInitProps, IInitState> {
    public state: IInitState = {
        phase: "DATABASE_PASSWORD",
        password: "",
        toHome: false,
        walletStatus: null
    };

    public render() {
        const {phase, walletStatus} = this.state;

        if (this.state.toHome) {
            return <Redirect to='/home'/>
        }
        return (
            <Fragment>
                {phase === "DATABASE_PASSWORD" &&
                <Fragment>
                    <TextField
                        id="standard-password-input"
                        label="Database Password"
                        onChange={this.onPasswordChange}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                    />
                    <Button onClick={this.setDatabasePassword} variant="contained" color="primary">
                        Next
                    </Button>
                </Fragment>
                }
                {phase === "UNLOCK_OR_RESTORE" && walletStatus === "FIRST_TIME" &&
                <RestoreFromSeed modules={this.props.modules} onSuccess={this.onSuccess}/>
                }
                {phase === "UNLOCK_OR_RESTORE" && (walletStatus === "UNLOADED" || walletStatus === "ENCRYPTED") &&
                <LoadWalletFromDisk modules={this.props.modules} onSuccess={this.onSuccess}/>
                }
                {phase === "UNLOCK_OR_RESTORE" && (walletStatus === "DECRYPTED") &&
                this.onSuccess()
                }
            </Fragment>
        )
    }

    private setDatabasePassword = async () => {
        const response = await fetch(`${serverHttpUrl}/api/setDatabasePassword`, {
            body: JSON.stringify({password: this.state.password}),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        if (response.ok) {
            toast.success("Database password set properly");
            this.fetchWalletStatus();
            this.setState({phase: "UNLOCK_OR_RESTORE"});
        } else {
            handleError(response);
        }
    };

    private fetchWalletStatus = async () => {
        console.log(`fetching walletStatus`);
        const response = await fetch(serverHttpUrl + '/api/walletStatus');
        if (response.ok) {
            let walletStatus = await response.json();
            walletStatus = walletStatus.walletStatus;
            console.log(`walletStatus ${JSON.stringify(walletStatus)}`);
            this.setState({walletStatus})
        } else {
            handleError(response)
        }
    };

    private onPasswordChange =
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const password = event.target.value;
            this.setState({password})
        };

    private onSuccess = () => {
        this.setState({toHome: true})
    }
}

export default Initialization