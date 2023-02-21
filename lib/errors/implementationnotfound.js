function ImplementationNotFoundError(message, iface) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = message;
  this.code = 'IMPLEMENTATION_NOT_FOUND';
  this.interface = iface;
}

ImplementationNotFoundError.prototype.__proto__ = Error.prototype;


module.exports = ImplementationNotFoundError;
