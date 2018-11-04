export default class ModuleState{
    public state: "READY" | "WAITING" | "AUTHORIZED" | "FAILED";
    public message: string;
}