import {Button, Typography, WithStyles} from "@material-ui/core";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {withStyles} from '@material-ui/core/styles';
import * as React from 'react'
import {Component, Fragment} from "react";
import {toast} from "react-toastify";
import {serverUrl} from '../config'
import Module from "../Models/Module";
import RestoreDialog from './Dialog/RestoreDialog'
import SendCoinsDialog from './Dialog/SendCoinsDialog'
import UnlockDialog from "./Dialog/UnlockDialog";
import handleError from "./Errors/HandleError";

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

interface IAppProps extends WithStyles<typeof styles> {
    modules: Module[];
}

interface IAppState {
    currentAddress: string | null;
    cpuTemp: string | null;
    availableBalance: string | null;
    estimatedBalance: string | null;
    walletStatus: "FIRST_TIME" | "UNLOADED" | "ENCRYPTED" | "DECRYPTED";
    openRestoreDialog: boolean;
    openSendDialog: boolean;
    openUnlockDialog: boolean;
    syncProgress: number;
}

class Home extends Component<IAppProps, IAppState> {

    public state: IAppState = {
        availableBalance: null,
        cpuTemp: null,
        currentAddress: null,
        estimatedBalance: null,
        openRestoreDialog: false,
        openSendDialog: false,
        openUnlockDialog: false,
        walletStatus: "FIRST_TIME",
        syncProgress: 100,
    };


    public componentDidMount() {
        this.fetchPing();
        this.walletStatus();
        if (this.isLoaded()) {
            this.fetchCurrentAddress();
            this.fetchEstimatedBalance();
            this.fetchAvailableBalance();
        }
        const socketBlockChainSync = new WebSocket('ws://localhost:9090/blockChainSyncProgress');
        socketBlockChainSync.addEventListener('message', (event) => {
            const progress = parseInt(event.data, 10);
            console.log(`Sync progress ${progress}`);
            this.setState({syncProgress: progress});
            if(progress === 100){
                this.walletStatus()
            }
        });

        const autoLockSocket = new WebSocket('ws://localhost:9090/autolock');
        autoLockSocket.addEventListener('message', (event) => {
            const value = event.data;
            if (value === "0") {
                toast.info(`Wallet locked`);
                this.walletStatus()
            } else {
                toast.info(`Auto wallet will trigger in ${value}`)
            }
        });
    }


    public render() {
        console.log("render");
        const {modules} = this.props;

        const {walletStatus, currentAddress, estimatedBalance, availableBalance, cpuTemp} = this.state;

        return (
            <Fragment>
                <LinearProgress variant="determinate" value={this.state.syncProgress}/>
                <Typography variant="headline" component="h2">
                    {`Status: ${walletStatus}`}
                </Typography>

                <Typography variant="headline" component="h2">
                    {`CpuTemp: ${cpuTemp}`}
                </Typography>
                <Button size="small" onClick={this.fetchCpuTemp}>Refresh Temp</Button>

                <Typography variant="headline" component="h2">
                    {`Receive Address: ${currentAddress}`}
                </Typography>


                <Button size="small" onClick={this.fetchFreshAddress}>Refresh Address</Button>

                <Typography variant="headline" component="h2">
                    {`Balance: ${availableBalance}(${estimatedBalance})`}
                </Typography>

                <Button size="small" onClick={this.refreshBalances}>Refresh Balances</Button>

                <Button size="small" onClick={this.unlockWallet}>Unlock Wallet</Button>
                <Button size="small" onClick={this.lockWallet}>Lock Wallet</Button>
                <Button size="small" onClick={this.walletStatus}>Refresh Status</Button>
                <Button size="small" onClick={this.handleClickRestore}>Init/Restore</Button>
                <Button size="small" onClick={this.handleClickSend}>Send</Button>

                <RestoreDialog
                    open={this.state.openRestoreDialog}
                    onClose={this.handleCloseRestoreDialog}
                    modules={modules}
                    aria-labelledby="form-dialog-title"/>
                <UnlockDialog
                    walletStatus={this.walletStatus}
                    open={this.state.openUnlockDialog}
                    onClose={this.handleCloseUnlockDialog}
                    modules={modules}
                    aria-labelledby="form-dialog-title"/>
                <SendCoinsDialog
                    open={this.state.openSendDialog}
                    onClose={this.handleCloseSendDialog}
                />


            </Fragment>
        )
    }

    private isDecrypted() {
        return this.state.walletStatus === "DECRYPTED";
    }

    private isEncrypted() {
        return this.state.walletStatus === "ENCRYPTED";
    }

    private isLoaded() {
        return this.isDecrypted() || this.isEncrypted();
    }

    private fetchPing = async () => {
        console.log(`fetching pings`);
        const response = await fetch(serverUrl + '/api/ping');
        const ping = await response.json();
        console.log(`fetched ping ${JSON.stringify(ping)}`);
    };

    private fetchCurrentAddress = async () => {
        console.log(`fetching current address`);
        const response = await fetch(serverUrl + '/api/currentAddress');
        if (response.ok) {
            let currentAddress = await response.json();
            currentAddress = currentAddress.currentAddress;
            console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
            this.setState({currentAddress})
        } else {
            handleError(response)
        }
    };

    private fetchFreshAddress = async () => {
        console.log(`fetching fresh address`);
        const response = await fetch(serverUrl + '/api/freshAddress');
        if (response.ok) {
            let currentAddress = await response.json();
            currentAddress = currentAddress.freshAddress;
            console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
            this.setState({currentAddress})
        } else {
            handleError(response)
        }
    };


    private fetchEstimatedBalance = async () => {
        console.log(`fetching estimated balance`);
        const response = await fetch(serverUrl + '/api/estimatedBalance');
        if (response.ok) {
            let estimatedBalance = await response.json();
            estimatedBalance = estimatedBalance.estimatedBalance;
            console.log(`estimatedBalance ${JSON.stringify(estimatedBalance)}`);
            this.setState({estimatedBalance})
        } else {
            handleError(response)
        }
    };

    private fetchAvailableBalance = async () => {
        console.log(`fetching available balance`);
        const response = await fetch(serverUrl + '/api/availableBalance');
        if (response.ok) {
            let availableBalance = await response.json();
            availableBalance = availableBalance.availableBalance;
            console.log(`available balance ${JSON.stringify(availableBalance)}`);
            this.setState({availableBalance})
        } else {
            handleError(response)
        }
    };

    private fetchCpuTemp = async () => {
        console.log(`fetching cpu temp`);
        const response = await fetch(serverUrl + '/api/cpuTemp');
        let cpuTemp = await response.json();
        cpuTemp = cpuTemp.cpuTemp;
        console.log(`available balance ${JSON.stringify(cpuTemp)}`);
        this.setState({cpuTemp})
    };


    private lockWallet = async () => {
        console.log(`fetching lockWallet`);
        const response = await fetch(serverUrl + '/api/lockWallet');
        if (response.ok) {
            const responseText = await response.text();
            console.log(`lockWallet ${responseText}`);
            toast.success("Successfully locked wallet")
            this.walletStatus()
        } else {
            handleError(response)
        }
    };

    private walletStatus = async () => {
        console.log(`fetching walletStatus`);
        const response = await fetch(serverUrl + '/api/walletStatus');
        if (response.ok) {
            let walletStatus = await response.json();
            walletStatus = walletStatus.walletStatus;
            console.log(`walletStatus ${JSON.stringify(walletStatus)}`);
            this.setState({walletStatus});
            this.fetchCurrentAddress();
            this.refreshBalances();
        } else {
            handleError(response)
        }
    };

    private refreshBalances = () => {
        this.fetchEstimatedBalance();
        this.fetchAvailableBalance();
    };


    private handleClickRestore = () => {
        this.setState({openRestoreDialog: true});
    };

    private handleCloseRestoreDialog = () => {
        this.setState({openRestoreDialog: false});
    };

    private unlockWallet = async () => {
        this.setState({openUnlockDialog: true});
    };
    private handleCloseUnlockDialog = () => {
        this.setState({openUnlockDialog: false});
    };

    private handleClickSend = () => {
        this.setState({openSendDialog: true});
    };

    private handleCloseSendDialog = () => {
        this.setState({openSendDialog: false});
    }

}

export default withStyles(styles)(Home)