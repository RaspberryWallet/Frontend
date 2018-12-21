import {serverHttpUrl} from "./config";
import handleError from "./Components/Errors/HandleError";

export default {
    async fetchPing() {
        console.log(`fetching pings from ` + serverHttpUrl);

        const response = await fetch(serverHttpUrl + '/api/ping');
        if (response.ok) {
            let ping = await response.json();
            ping = ping.ping;
            console.log(`fetched ping ${JSON.stringify(ping)}`);
            return ping;
        } else {
            throw await handleError(response)
        }
    },
    async fetchModules() {
        console.log(`fetching modules`);
        const response = await fetch(serverHttpUrl + '/api/modules');
        if (response.ok) {
            return await response.json();
        } else {
            throw await handleError(response)
        }
    },
    async fetchCurrentAddress() {
        console.log(`fetching current address`);
        const response = await fetch(serverHttpUrl + '/api/currentAddress');
        if (response.ok) {
            let currentAddress = await response.json();
            currentAddress = currentAddress.currentAddress;
            console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
            return currentAddress
        } else {
            throw await handleError(response)
        }
    },
    async walletStatus() {
        console.log(`fetching walletStatus`);
        const response = await fetch(serverHttpUrl + '/api/walletStatus');
        if (response.ok) {
            let walletStatus = await response.json();
            walletStatus = walletStatus.walletStatus;
            console.log(`walletStatus ${JSON.stringify(walletStatus)}`);
            return walletStatus;
        } else {
            throw await handleError(response)
        }
    },
    async fetchCpuTemp() {
        console.log(`fetching cpu temp`);
        const response = await fetch(serverHttpUrl + '/api/cpuTemp');
        if (response.ok) {
            let cpuTemp = await response.json();
            cpuTemp = cpuTemp.cpuTemp;
            console.log(`cpuTemp ${JSON.stringify(cpuTemp)}`);
            return cpuTemp;
        } else {
            throw await handleError(response)
        }
    },
    async lockWallet() {
        console.log(`fetching lockWallet`);
        const response = await fetch(serverHttpUrl + '/api/lockWallet');
        if (response.ok) {
            const responseText = await response.text();
            console.log(`lockWallet ${responseText}`);
            return responseText;
        } else {
            throw await handleError(response)
        }
    },
    async fetchTransactions() {
        console.log(`fetching transactions`);
        const response = await fetch(serverHttpUrl + '/api/allTransactions');
        if (response.ok) {
            let transactions = await response.json();
            transactions = transactions.allTransactions;
            return transactions;
        } else {
            throw await handleError(response)
        }
    },
    async fetchAvailableBalance() {
        console.log(`fetching available balance`);
        const response = await fetch(serverHttpUrl + '/api/availableBalance');
        if (response.ok) {
            let availableBalance = await response.json();
            availableBalance = availableBalance.availableBalance;
            console.log(`available balance ${JSON.stringify(availableBalance)}`);
            return availableBalance;
        } else {
            throw await handleError(response)
        }
    },
    async fetchFreshAddress() {
        console.log(`fetching fresh address`);
        const response = await fetch(serverHttpUrl + '/api/freshAddress');
        if (response.ok) {
            let currentAddress = await response.json();
            currentAddress = currentAddress.freshAddress;
            console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
            return currentAddress;
        } else {
            throw await handleError(response)
        }
    },
    async fetchEstimatedBalance() {
        console.log(`fetching estimated balance`);
        const response = await fetch(serverHttpUrl + '/api/estimatedBalance');
        if (response.ok) {
            let estimatedBalance = await response.json();
            estimatedBalance = estimatedBalance.estimatedBalance;
            console.log(`estimatedBalance ${JSON.stringify(estimatedBalance)}`);
            return estimatedBalance
        } else {
            throw await handleError(response)
        }
    },
    async fetchModuleState(id: string) {
        const response = await fetch(`${serverHttpUrl}/api/moduleState/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            throw await handleError(response)
        }
    },
    async postRestoreFromBackupPhrase(mnemonicWords: string, modules: any, required: string) {
        const response = await fetch(serverHttpUrl + "/api/restoreFromBackupPhrase", {
            body: JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required}),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        if (response.ok) {
            return response;
        } else {
            throw await handleError(response);
        }
    },
    async unlockWallet(moduleToInputsMap: { [moduleId: string]: any }) {
        const response = await fetch(`${serverHttpUrl}/api/unlockWallet`, {
            body: JSON.stringify(moduleToInputsMap),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        if (response.ok) {
            return response;
        } else {
            throw await handleError(response);
        }
    }

};

