export interface Command {
    name: string;
    desc: string;
    exec(): void;
}

export class CommandsRegister {
    public commands = new Array<Command>;

    public addCmd(cmd: Command): void {
        this.commands.push(cmd);
        console.log(cmd)
    }
}

export const commandsRegister = new CommandsRegister();
