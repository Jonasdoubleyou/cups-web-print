import * as React from "react";
import { print } from "./print";

export function PrintDialog({ file }: { file: File }) {
    const [state, setState] = React.useState<"configure" | "print" | "done">("configure");
    
    const [duplex, setDuplex] = React.useState(false);
    const [pageSize, setPageSize] = React.useState<"A4" | "A3">("A4");
    const [color, setColor] = React.useState<"color" | "nocolor">("color");

    async function doPrint() {
        setState("print");

        await print((await file.arrayBuffer()), {

        })
    }

    if (state === "configure") {
    return <div>
        <h1>{file.name} drucken</h1>
        <fieldset>
            <legend>Papiergröße</legend>

            <label htmlFor="A4">A4</label>
            <input type="radio" checked={pageSize === "A4"} onClick={() => setPageSize("A4")} name="paper-size" id="A4" />
            <label htmlFor="A3">A3</label>
            <input type="radio" checked={pageSize === "A3"} onClick={() => setPageSize("A3")} name="paper-size" id="A3" />
        </fieldset>
        
        <fieldset>
            <legend>Farbe</legend>

            <label htmlFor="color">Farbe</label>
            <input type="radio" checked={color === "color"} onClick={() => setColor("color")} name="colored" id="color" />
            <label htmlFor="nocolor">Schwarz-Weiß</label>
            <input type="radio"checked={color === "nocolor"} onClick={() => setColor("nocolor")} name="colored" id="nocolor" />
        </fieldset>

        <fieldset>
            <legend>Duplex?</legend>
            <input type="checkbox" checked={duplex} onClick={() => setDuplex(!duplex)} />
        </fieldset>

        <button onClick={doPrint}>Kostenpflichtig drucken</button>

    </div>;
    }

    return <div>Lädt...</div>
}