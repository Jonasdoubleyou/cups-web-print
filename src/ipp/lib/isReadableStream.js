const isReadableStream = function (stream) {
  return stream && typeof stream === 'object' && typeof stream.pipe === 'function' && typeof stream.read === 'function';
};

export default isReadableStream;
