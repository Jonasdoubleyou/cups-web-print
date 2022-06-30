import http from 'http';
import https from 'https';
import url from 'url';
import { Buffer } from "buffer";

import isReadableStream from './isReadableStream';
import parse from './parser';

const readResponse = (res, cb) => {
  const chunks = [];
  let length = 0;

  res.on('data', (chunk) => {
    length += chunk.length;
    chunks.push(chunk);
  });
  res.on('end', () => {
    try {
      const response = parse(Buffer.concat(chunks, length));
      delete response.operation;
      cb(null, response);
    } catch (e) {
      cb(e);
    }
  });
};

const pipeResponse = (res, writeableStream, cb) => {
  res.on('end', () => {
    cb(null, null);
  });
  res.pipe(writeableStream);
};

const request = (opts, buffer, writeableStream, cb) => {
  if (!cb) {
    cb = writeableStream;
    writeableStream = null;
  }
  const isStream = isReadableStream(buffer);

  // All IPP requires are POSTs- so we must have some data.
  //  10 is just a number I picked- this probably should have something more meaningful

  if (!isStream && (!Buffer.isBuffer(buffer) || buffer.length < 10)) {
    return cb(new Error('Data required'));
  }
  if (typeof opts === 'string') {
    opts = url.parse(opts);
  }
  if (!opts.port) {
    opts.port = 631;
  }

  if (!opts.headers) {
    opts.headers = {};
  }
  opts.headers['Content-Type'] = 'application/ipp';
  opts.method = 'POST';

  if (opts.protocol === 'ipp:') {
    opts.protocol = 'http:';
  }

  if (opts.protocol === 'ipps:') {
    opts.protocol = 'https:';
  }

  const req = (opts.protocol === 'https:' ? https : http).request(opts, (res) => {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    switch (res.statusCode) {
      case 100:
        if (opts.headers.Expect !== '100-Continue' || typeof opts.continue !== 'function') {
          cb(new Error(`Received unexpected response status ${res.statusCode} from the printer.`));
        }

        // console.log('100 Continue');
        return;
      case 200:
        if (writeableStream) {
          return pipeResponse(res, writeableStream, cb);
        }
        return readResponse(res, cb);
      default:
        // console.log(res.statusCode, 'response');
        cb(new Error(`Received unexpected response status ${res.statusCode} from the printer.`));
    }
  });

  /* if (opts.timeout) {
    req.setTimeout(opts.timeout, () => {
      const err = new Error(`connect ETIMEDOUT ${opts.host}`);
      err.code = 'ETIMEDOUT';
      req.destroy(err);
    });
  } */

  req.on('error', (err) => {
    cb(err);
  });

  if (opts.headers.Expect === '100-Continue' && typeof opts.continue === 'function') {
    req.on('continue', () => {
      opts.continue(req);
    });
  }

  if (isStream) {
    buffer.pipe(req);
  } else {
    req.write(buffer);
    req.end();
  }
};

export default request;
