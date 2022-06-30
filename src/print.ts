import * as IPP from "./ipp";
import { promisify } from "util";

const PRINTER_URL = `${process.env.PUBLIC_URL}/printers/${process.env.REACT_APP_PRINTER_NAME}`;
console.log(PRINTER_URL);
const printer: IPP.Printer = new IPP.Printer(PRINTER_URL);

interface PrintOptions {
    color: boolean;
    duplex: boolean;
    size: "A4" | "A3";
}

export async function print(file: Buffer, options: PrintOptions) {
    const printMessage: IPP.PrintJobRequest = {
        "operation-attributes-tag": {
            "requesting-user-name": "web",
            "document-format": "application/pdf",
        },
        "job-attributes-tag": {
            "print-color-mode": options.color ? "color" : "monochrome",
            "sides": options.duplex ? "two-sided-long-edge" : "one-sided"
        },
        data: file
    };
   
    const { id: jobId, statusCode, "job-attributes-tag": jobAttributes }: IPP.PrintJobResponse = await promisify(printer.execute).bind(printer)("Print-Job" as any, printMessage) as any;
    console.log(`placed printing job ${jobId} with status '${statusCode}'`, jobAttributes);

    if (statusCode !== "successful-ok") {
        throw new Error(`Unexpected status code '${statusCode}'`);
    }

    while(true) {
        const getAttributesMessage: IPP.GetJobAttributesRequest = {
            "operation-attributes-tag": {
                "job-id": jobId
            }
        };
        const { "job-attributes-tag": jobAttributes } = await promisify(printer.execute).bind(printer)("Get-Job-Attributes" as any, getAttributesMessage as any) as IPP.GetJobAttributesResponse;
        console.log("print status", jobAttributes);

        await new Promise(res => setTimeout(res, 10_000));
    }
}

