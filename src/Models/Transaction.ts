class Transaction{
    public txHash: string;
    public creationTimestamp : Date;
    public inputAddresses : string[];
    public outputAddresses : string[];
    public amountFromMe : string;
    public amountToMe : string;
    public fee : string;
    public confirmations : number;
}