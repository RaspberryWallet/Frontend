import {Button, Typography, WithStyles} from "@material-ui/core";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {withStyles} from '@material-ui/core/styles';
import * as React from 'react'
import {Component, Fragment} from "react";
import {toast} from "react-toastify";
import Module from "../Models/Module";
import RestoreDialog from './Dialog/RestoreDialog'
import SendCoinsDialog from './Dialog/SendCoinsDialog'
import UnlockDialog from "./Dialog/UnlockDialog";
import History from "./History/History";
import Api from "../Api";
import {serverWsUrl} from "../config";

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
    autoLockRemaining: number;
    transactions: Transaction[];
    isLoading: boolean;
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
        syncProgress: 0,
        autoLockRemaining: 300,
        transactions: new Array<Transaction>(),
        isLoading: false
    };
    private socketBlockChainSync: WebSocket;
    private autoLockSocket: WebSocket;

    public constructor(props: IAppProps) {
        super(props);

        this.socketBlockChainSync = new WebSocket(`${serverWsUrl}/blockChainSyncProgress`);
        this.autoLockSocket = new WebSocket(`${serverWsUrl}/autolock`);
    }

    public componentDidMount() {
        Api.fetchPing();
        this.walletStatus();
        this.socketBlockChainSync.addEventListener('message', (event: MessageEvent) => {
            const progress = parseInt(event.data, 10);
            console.log(`Sync progress ${progress}`);
            this.setState({syncProgress: progress});
            if (progress === 100) {
                this.walletStatus()
            }
        });
        this.autoLockSocket.addEventListener('message', (event: MessageEvent) => {
            const value = event.data;
            if (value === "0") {
                toast.info(`Wallet locked`);
                this.walletStatus()
            } else {
                this.setState({autoLockRemaining: parseInt(value, 10)});
            }
        });
    }

    public componentWillUnmount(): void {
        this.autoLockSocket.close();
        this.socketBlockChainSync.close();
    }


    public render() {
        const {modules} = this.props;

        const {walletStatus, currentAddress, estimatedBalance, availableBalance, cpuTemp, syncProgress, autoLockRemaining} = this.state;
        const {isLoading} = this.state;
        return (
            <Fragment>
                {isLoading &&
                <LinearProgress color="secondary" variant="query"/>
                }
                <Typography variant="h5">
                    {`AutoLock Remaining = ${autoLockRemaining} sec`}
                </Typography>
                <LinearProgress variant="determinate"
                                value={this.normaliseAutoLockProgress(this.state.autoLockRemaining)}/>
                <Typography variant="h5">
                    {`Synchronization = ${syncProgress} %`}
                </Typography>
                <LinearProgress variant="determinate" value={this.state.syncProgress}/>

                <Typography variant="h5">
                    {`Status: ${walletStatus}`}
                </Typography>

                <Typography variant="h5">
                    {`CpuTemp: ${cpuTemp}`}
                </Typography>
                <Button size="small" onClick={this.fetchCpuTemp}>Refresh Temp</Button>

                <Typography variant="h5">
                    {`Receive Address: ${currentAddress}`}
                </Typography>


                <Button size="small" onClick={this.fetchFreshAddress}>Refresh Address</Button>

                <Typography variant="h5">
                    {`Balance: ${availableBalance}(${estimatedBalance})`}
                </Typography>

                <Button size="small" onClick={this.refreshBalances}>Refresh Balances</Button>

                <Button size="small" onClick={this.unlockWallet}>Unlock Wallet</Button>
                <Button size="small" onClick={this.lockWallet}>Lock Wallet</Button>
                <Button size="small" onClick={this.walletStatus}>Refresh Status</Button>
                <Button size="small" onClick={this.fetchTransactions}>Refresh Transactions</Button>
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
                {this.state.transactions &&
                <History transactions={this.state.transactions}/>
                }
                {!this.state.transactions &&
                <Typography variant="h3">{`No operations found`}</Typography>
                }


            </Fragment>
        )
    }


    private normaliseAutoLockProgress = (value: number) => value * 100 / 300;


    private fetchCurrentAddress = () => {
        this.executeLoading(async () => {
            const currentAddress = await Api.fetchCurrentAddress();
            this.setState({currentAddress});
        });
    };

    private fetchFreshAddress = () => {
        this.executeLoading(async () => {
            const currentAddress = await Api.fetchFreshAddress();
            this.setState({currentAddress});
        });
    };

    private fetchEstimatedBalance = () => {
        this.executeLoading(async () => {
            const estimatedBalance = await Api.fetchEstimatedBalance();
            this.setState({estimatedBalance})
        });
    };

    private fetchAvailableBalance = () => {
        this.executeLoading(async () => {
            const availableBalance = await Api.fetchAvailableBalance();
            this.setState({availableBalance});
        });
    };

    private fetchTransactions = () => {
        this.executeLoading(async () => {
            const transactions = await Api.fetchTransactions();
            this.setState({transactions})
        });
    };

    private fetchCpuTemp = () => {
        this.executeLoading(async () => {
            const cpuTemp = await Api.fetchCpuTemp();
            this.setState({cpuTemp})
        });
    };

    private lockWallet = () => {
        this.executeLoading(async () => {
            await Api.lockWallet();
            toast.success("Successfully locked wallet");
            this.walletStatus();
        });
    };

    private walletStatus = () => {
        this.executeLoading(async () => {
            const walletStatus = await Api.walletStatus();
            this.setState({walletStatus});
            this.fetchCurrentAddress();
            this.refreshBalances();
            this.fetchTransactions();
        });
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
    };
    private startLoading = () => {
        this.setState({isLoading: true});
    };
    private stopLoading = () => {
        this.setState({isLoading: false});
    };

    private async executeLoading(param: () => void) {
        this.startLoading();
        try {
            await param();
        } catch (e) {
            console.error(e)
        }
        this.stopLoading();
    }
}

export default withStyles(styles)(Home)