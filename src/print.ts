import * as IPP from "@sealsystems/ipp";
import { promisify } from "util";

const printer = new IPP.Printer("https://drucker.d7.whka.de/printers/domus7-color");

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
   
    const { id: jobId, statusCode, "job-attributes-tag": jobAttributes }: IPP.PrintJobResponse = await promisify(printer.execute)("Print-Job" as any, printMessage) as any;
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
        const { "job-attributes-tag": jobAttributes } = await promisify(printer.execute)("Get-Job-Attributes" as any, getAttributesMessage as any) as IPP.GetJobAttributesResponse;
        console.log("print status", jobAttributes);

        await new Promise(res => setTimeout(res, 10_000));
    }
}

