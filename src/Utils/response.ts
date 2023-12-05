export class ResponsePacket {
    code: number;
    status: boolean;
    message: string;
    data: any;
    constructor(
        code: number,
        status: boolean,
        message: string,
        data: any = null,
    ) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
        return this;
    }
}