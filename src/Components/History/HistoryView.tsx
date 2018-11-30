import {WithStyles, withStyles} from "@material-ui/core";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import createStyles from "@material-ui/core/es/styles/createStyles";
import {Component} from "react";
import * as React from "react";
import SvgIcon from "@material-ui/core/es/SvgIcon/SvgIcon";
import Card from "@material-ui/core/es/Card/Card";
import * as moment from "moment"

const styles = createStyles({
    transactionDetails: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center"
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
    },
    outputs: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        margin: "10px 20px 30px 10px",
        maxWidth: "60%"
    }
});


interface ITransactionProps extends WithStyles<typeof styles> {
    transaction: Transaction;
}

function ArrowIcon(props: any) {
    return (
        <SvgIcon {...props}>
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
        </SvgIcon>
    );
}

class TransactionView extends Component<ITransactionProps, {}> {

    public render() {
        const {transaction, classes} = this.props;
        return (
            <Card className={classes.item}>
                <ListItem className={classes.inputs}>
                    <ListItemText primary={transaction.txHash}
                                  secondary={this.formatDate(transaction.creationTimestamp)}/>
                    <ListItemText primary={this.balanceChange(transaction)}
                                  secondary={`confirmations: ${transaction.confirmations}`}/>
                    <div className={classes.transactionDetails}>
                        <List>
                            {transaction.inputAddresses.map((address) =>
                                <ListItem key={address}>
                                    <ListItemText primary={address}/>
                                </ListItem>
                            )}
                        </List>
                        <ArrowIcon/>
                        <List>
                            {transaction.outputAddresses.map((address) =>
                                <ListItem key={address}>
                                    <ListItemText primary={address}/>
                                </ListItem>
                            )}
                        </List>
                    </div>
                </ListItem>
            </Card>
        )
    }

    private formatDate(date: Date): string {
        return `${moment(date).calendar()} (${moment(date).fromNow()})`
    }

    private balanceChange(transaction: Transaction) {
        const fromMe = parseFloat(transaction.amountFromMe);
        const toMe = parseFloat(transaction.amountToMe);

        if (fromMe > toMe) {
            return `-${fromMe - toMe}`;
        } else {
            return `+${toMe - fromMe}`;
        }
    }
}

export default withStyles(styles)(TransactionView)