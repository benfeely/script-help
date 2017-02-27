export class MockOutputStream {
    private _messages: string[] = [];

    constructor(private outputStream: NodeJS.WritableStream) { }

    public get messages(): string[] {
        return this._messages;
    }

    public write(message: string) {
        this._messages.push(message);
    }

    public reset() {
        this._messages = [];
    }

    public dump() {
        this._messages.map(message => this.outputStream.write(message));
        return "Mock stream dumped to real stream...";
    }
}