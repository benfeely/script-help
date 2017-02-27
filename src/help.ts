import { Package } from "./package";

export class Help {
    constructor(private pkg: Package,
                private outputStream: NodeJS.WritableStream) { }

    public write() {
        this.outputStream.write('test 123');
        this.outputStream.write(this.pkg.name);
    }

}