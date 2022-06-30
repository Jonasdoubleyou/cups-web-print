# CUPS Web Print

This patches a CUPS server to allow printing of PDFs directly from a Webpage. 

To install, run `npm ci` and adapt this repo to your needs.

Create a file `.env` (based on `.env.example`), where `PUBLIC_URL` 
 points to a subdirectory of the CUPS webpage (e.g. if your CUPS runs under `https://cups.example.com:631` take `https://cups.example.com:631/print-app`) and `PRINTER_NAME` names the printer that should be used.

Then run `npm run build` which emits a React app into the `./build/` folder.
 Copy that folder to `/usr/share/cups/doc-root/[print-app]`. 
CUPS will now serve this under the path chosen above, and print jobs will be sent via IPP directly from the browser of the users.

### Q & A

**Can I host this somewhere else outside of CUPS?**

No, CUPS [does not support setting CORS headers](https://github.com/apple/cups/issues/4850), and disabling CORS does not scale well (and is not a good idea generally). 

**Can I print something else than PDFs?**

Maybe, haven't tried.

### Acknowledgments

This is originally based on the [ipp](https://github.com/williamkapke/ipp) package, 
 which was [forked here](https://github.com/sealsystems/node-ipp). I combined both versions and ported them to the web:
 - Installed various Browserify packages
 - Moved to ESM modules
 - Removed the dependency on `Function.prototype.name` in `attributes.js` as that won't work well with bundlers

