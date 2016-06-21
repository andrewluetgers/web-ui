"use strict";
var path = require('path');
var SUPPORTS_TYPED_ARRAYS = typeof (ArrayBuffer) !== 'undefined';
exports.isIE = typeof navigator !== "undefined" && (/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) != null || navigator.userAgent.indexOf('Trident') !== -1);
exports.isWebWorker = typeof window === "undefined";
function mkdirpSync(p, mode, fs) {
    if (!fs.existsSync(p)) {
        mkdirpSync(path.dirname(p), mode, fs);
        fs.mkdirSync(p, mode);
    }
}
exports.mkdirpSync = mkdirpSync;
function buffer2ArrayBuffer(buff) {
    var u8 = buffer2Uint8array(buff), u8offset = u8.byteOffset, u8Len = u8.byteLength;
    if (u8offset === 0 && u8Len === u8.buffer.byteLength) {
        return u8.buffer;
    }
    else {
        return u8.buffer.slice(u8offset, u8offset + u8Len);
    }
}
exports.buffer2ArrayBuffer = buffer2ArrayBuffer;
function buffer2Uint8array(buff) {
    if (buff['toUint8Array']) {
        return buff.toUint8Array();
    }
    else if (buff instanceof Uint8Array) {
        return buff;
    }
    else {
        return new Uint8Array(buff);
    }
}
exports.buffer2Uint8array = buffer2Uint8array;
function buffer2Arrayish(buff) {
    if (typeof (buff[0]) === 'number') {
        return buff;
    }
    else if (SUPPORTS_TYPED_ARRAYS) {
        return buffer2Uint8array(buff);
    }
    else {
        return buff.toJSON().data;
    }
}
exports.buffer2Arrayish = buffer2Arrayish;
function arrayish2Buffer(arr) {
    if (SUPPORTS_TYPED_ARRAYS && arr instanceof Uint8Array) {
        return uint8Array2Buffer(arr);
    }
    else if (arr instanceof Buffer) {
        return arr;
    }
    else {
        return new Buffer(arr);
    }
}
exports.arrayish2Buffer = arrayish2Buffer;
function uint8Array2Buffer(u8) {
    if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
        return arrayBuffer2Buffer(u8);
    }
    else {
        return new Buffer(u8);
    }
}
exports.uint8Array2Buffer = uint8Array2Buffer;
function arrayBuffer2Buffer(ab) {
    try {
        return new Buffer(ab);
    }
    catch (e) {
        return new Buffer(new Uint8Array(ab));
    }
}
exports.arrayBuffer2Buffer = arrayBuffer2Buffer;
if (typeof (ArrayBuffer) !== 'undefined' && typeof (Uint8Array) !== 'undefined') {
    if (!Uint8Array.prototype['slice']) {
        Uint8Array.prototype.slice = function (start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = this.length; }
            var self = this;
            if (start < 0) {
                start = this.length + start;
                if (start < 0) {
                    start = 0;
                }
            }
            if (end < 0) {
                end = this.length + end;
                if (end < 0) {
                    end = 0;
                }
            }
            if (end < start) {
                end = start;
            }
            return new Uint8Array(self.buffer, self.byteOffset + start, end - start);
        };
    }
}
function copyingSlice(buff, start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = buff.length; }
    if (start < 0 || end < 0 || end > buff.length || start > end) {
        throw new TypeError("Invalid slice bounds on buffer of length " + buff.length + ": [" + start + ", " + end + "]");
    }
    if (buff.length === 0) {
        return new Buffer(0);
    }
    else if (SUPPORTS_TYPED_ARRAYS) {
        var u8 = buffer2Uint8array(buff), s0 = buff.readUInt8(0), newS0 = (s0 + 1) % 0xFF;
        buff.writeUInt8(newS0, 0);
        if (u8[0] === newS0) {
            u8[0] = s0;
            return uint8Array2Buffer(u8.slice(start, end));
        }
        else {
            buff.writeUInt8(s0, 0);
            return uint8Array2Buffer(u8.subarray(start, end));
        }
    }
    else {
        var buffSlice = new Buffer(end - start);
        buff.copy(buffSlice, 0, start, end);
        return buffSlice;
    }
}
exports.copyingSlice = copyingSlice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlBLElBQU8sSUFBSSxXQUFXLE1BQU0sQ0FBQyxDQUFDO0FBRTlCLElBQU0scUJBQXFCLEdBQUcsT0FBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFdBQVcsQ0FBQztBQU12RCxZQUFJLEdBQVksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUt6SyxtQkFBVyxHQUFZLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQztBQVVoRSxvQkFBMkIsQ0FBUyxFQUFFLElBQVksRUFBRSxFQUFjO0lBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7QUFDSCxDQUFDO0FBTGUsa0JBQVUsYUFLekIsQ0FBQTtBQU1ELDRCQUFtQyxJQUFZO0lBQzdDLElBQUksRUFBRSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUM5QixRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFDeEIsS0FBSyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDeEIsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRSxDQUFDLE1BQU0s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QUksQ0FBQyxDQUFDO1lBRU4sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUM7QUEzQmUsb0JBQVksZUEyQjNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogR3JhYiBiYWcgb2YgdXRpbGl0eSBmdW5jdGlvbnMgdXNlZCBhY3Jvc3MgdGhlIGNvZGUuXHJcbiAqL1xyXG5pbXBvcnQge0ZpbGVTeXN0ZW19IGZyb20gJy4vZmlsZV9zeXN0ZW0nO1xyXG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuXHJcbmNvbnN0IFNVUFBPUlRTX1RZUEVEX0FSUkFZUyA9IHR5cGVvZihBcnJheUJ1ZmZlcikgIT09ICd1bmRlZmluZWQnO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBmb3IgYW55IElFIHZlcnNpb24sIGluY2x1ZGluZyBJRTExIHdoaWNoIHJlbW92ZWQgTVNJRSBmcm9tIHRoZVxyXG4gKiB1c2VyQWdlbnQgc3RyaW5nLlxyXG4gKi9cclxuZXhwb3J0IHZhciBpc0lFOiBib29sZWFuID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiAoLyhtc2llKSAoW1xcdy5dKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAhPSBudWxsIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpICE9PSAtMSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLlxyXG4gKi9cclxuZXhwb3J0IHZhciBpc1dlYldvcmtlcjogYm9vbGVhbiA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5aXNoPFQ+IHtcclxuICBbaWR4OiBudW1iZXJdOiBUO1xyXG4gIGxlbmd0aDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogU3luY2hyb25vdXMgcmVjdXJzaXZlIG1ha2VkaXIuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWtkaXJwU3luYyhwOiBzdHJpbmcsIG1vZGU6IG51bWJlciwgZnM6IEZpbGVTeXN0ZW0pOiB2b2lkIHtcclxuICBpZiAoIWZzLmV4aXN0c1N5bmMocCkpIHtcclxuICAgIG1rZGlycFN5bmMocGF0aC5kaXJuYW1lKHApLCBtb2RlLCBmcyk7XHJcbiAgICBmcy5ta2RpclN5bmMocCwgbW9kZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYSBidWZmZXIgaW50byBhbiBhcnJheSBidWZmZXIuIEF0dGVtcHRzIHRvIGRvIHNvIGluIGFcclxuICogemVyby1jb3B5IG1hbm5lciwgZS5nLiB0aGUgYXJyYXkgcmVmZXJlbmNlcyB0aGUgc2FtZSBtZW1vcnkuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyMkFycmF5QnVmZmVyKGJ1ZmY6IEJ1ZmZlcik6IEFycmF5QnVmZmVyIHtcclxuICB2YXIgdTggPSBidWZmZXIyVWludDhhcnJheShidWZmKSxcclxuICAgIHU4b2Zmc2V0ID0gdTguYnl0ZU9mZnNldCxcclxuICAgIHU4TGVuID0gdTguYnl0ZUxlbmd0aDtcclxuICBpZiAodThvZmZzZXQgPT09IDAgJiYgdThMZW4gPT09IHU4LmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gdTguYnVmZmVyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gdTguYnVmZmVyLnNsaWNlKHU4b2Zmc2V0LCB1OG9mZnNldCArIHU4TGVuKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgYnVmZmVyIGludG8gYSBVaW50OEFycmF5LiBBdHRlbXB0cyB0byBkbyBzbyBpbiBhXHJcbiAqIHplcm8tY29weSBtYW5uZXIsIGUuZy4gdGhlIGFycmF5IHJlZmVyZW5jZXMgdGhlIHNhbWUgbWVtb3J5LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcjJVaW50OGFycmF5KGJ1ZmY6IEJ1ZmZlcik6IFVpbnQ4QXJyYXkge1xyXG4gIGlmIChidWZmWyd0b1VpbnQ4QXJyYXknXSkge1xyXG4gICAgcmV0dXJuICg8YW55PiBidWZmKS50b1VpbnQ4QXJyYXkoKTtcclxuICB9IGVsc2UgaWYgKGJ1ZmYgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XHJcbiAgICAvLyBOb2RlIHY0LjAgYnVmZmVycyAqYXJlKiBVaW50OEFycmF5cy5cclxuICAgIHJldHVybiA8YW55PiBidWZmO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBVaW50OEFycmF5cyBjYW4gYmUgY29uc3RydWN0ZWQgZnJvbSBhcnJheWlzaCBudW1iZXJzLlxyXG4gICAgLy8gQXQgdGhpcyBwb2ludCwgd2UgYXNzdW1lIHRoaXMgaXNuJ3QgYSBCRlMgYXJyYXkuXHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYnVmZik7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIGdpdmVuIGJ1ZmZlciBpbnRvIGEgVWludDggYXJyYXlpc2ggZm9ybS4gQXR0ZW1wdHNcclxuICogdG8gYmUgemVyby1jb3B5LlxyXG4gKlxyXG4gKiBSZXF1aXJlZCBmb3IgQnJvd3NlckZTIGJ1ZmZlcnMsIHdoaWNoIGRvIG5vdCBzdXBwb3J0IGluZGV4aW5nLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcjJBcnJheWlzaChidWZmOiBCdWZmZXIpOiBBcnJheWlzaDxudW1iZXI+IHtcclxuICBpZiAodHlwZW9mKGJ1ZmZbMF0pID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIGJ1ZmY7XHJcbiAgfSBlbHNlIGlmIChTVVBQT1JUU19UWVBFRF9BUlJBWVMpIHtcclxuICAgIHJldHVybiBidWZmZXIyVWludDhhcnJheShidWZmKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGJ1ZmYudG9KU09OKCkuZGF0YTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gYXJyYXlpc2ggb2JqZWN0IGludG8gYSBCdWZmZXIuIEF0dGVtcHRzIHRvXHJcbiAqIGJlIHplcm8tY29weS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcnJheWlzaDJCdWZmZXIoYXJyOiBBcnJheWlzaDxudW1iZXI+KTogQnVmZmVyIHtcclxuICBpZiAoU1VQUE9SVFNfVFlQRURfQVJSQVlTICYmIGFyciBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcclxuICAgIHJldHVybiB1aW50OEFycmF5MkJ1ZmZlcihhcnIpO1xyXG4gIH0gZWxzZSBpZiAoYXJyIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcig8bnVtYmVyW10+IGFycik7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIGdpdmVuIFVpbnQ4QXJyYXkgaW50byBhIEJ1ZmZlci4gQXR0ZW1wdHMgdG8gYmUgemVyby1jb3B5LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4QXJyYXkyQnVmZmVyKHU4OiBVaW50OEFycmF5KTogQnVmZmVyIHtcclxuICBpZiAodTguYnl0ZU9mZnNldCA9PT0gMCAmJiB1OC5ieXRlTGVuZ3RoID09PSB1OC5idWZmZXIuYnl0ZUxlbmd0aCkge1xyXG4gICAgcmV0dXJuIGFycmF5QnVmZmVyMkJ1ZmZlcih1OCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBuZXcgQnVmZmVyKHU4KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gYXJyYXkgYnVmZmVyIGludG8gYSBCdWZmZXIuIEF0dGVtcHRzIHRvIGJlXHJcbiAqIHplcm8tY29weS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJ1ZmZlcjJCdWZmZXIoYWI6IEFycmF5QnVmZmVyKTogQnVmZmVyIHtcclxuICB0cnkge1xyXG4gICAgLy8gV29ya3MgaW4gQkZTIGFuZCBOb2RlIHY0LjIuXHJcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcig8YW55PiBhYik7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gSSBiZWxpZXZlIHRoaXMgY29waWVzLCBidXQgdGhlcmUncyBubyBhdm9pZGluZyBpdCBpbiBOb2RlIDwgdjQuMlxyXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIobmV3IFVpbnQ4QXJyYXkoYWIpKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFBvbHlmaWxsIGZvciBVaW50OEFycmF5LnByb3RvdHlwZS5zbGljZS5cclxuLy8gU2FmYXJpIGFuZCBzb21lIG90aGVyIGJyb3dzZXJzIGRvIG5vdCBkZWZpbmUgaXQuXHJcbmlmICh0eXBlb2YoQXJyYXlCdWZmZXIpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YoVWludDhBcnJheSkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgaWYgKCFVaW50OEFycmF5LnByb3RvdHlwZVsnc2xpY2UnXSkge1xyXG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihzdGFydDogbnVtYmVyID0gMCwgZW5kOiBudW1iZXIgPSB0aGlzLmxlbmd0aCk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICBsZXQgc2VsZjogVWludDhBcnJheSA9IHRoaXM7XHJcbiAgICAgIGlmIChzdGFydCA8IDApIHtcclxuICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQ7XHJcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xyXG4gICAgICAgICAgc3RhcnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoZW5kIDwgMCkge1xyXG4gICAgICAgIGVuZCA9IHRoaXMubGVuZ3RoICsgZW5kO1xyXG4gICAgICAgIGlmIChlbmQgPCAwKSB7XHJcbiAgICAgICAgICBlbmQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoZW5kIDwgc3RhcnQpIHtcclxuICAgICAgICBlbmQgPSBzdGFydDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoc2VsZi5idWZmZXIsIHNlbGYuYnl0ZU9mZnNldCArIHN0YXJ0LCBlbmQgLSBzdGFydCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvcGllcyBhIHNsaWNlIG9mIHRoZSBnaXZlbiBidWZmZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3B5aW5nU2xpY2UoYnVmZjogQnVmZmVyLCBzdGFydDogbnVtYmVyID0gMCwgZW5kID0gYnVmZi5sZW5ndGgpOiBCdWZmZXIge1xyXG4gIGlmIChzdGFydCA8IDAgfHwgZW5kIDwgMCB8fCBlbmQgPiBidWZmLmxlbmd0aCB8fCBzdGFydCA+IGVuZCkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCBzbGljZSBib3VuZHMgb24gYnVmZmVyIG9mIGxlbmd0aCAke2J1ZmYubGVuZ3RofTogWyR7c3RhcnR9LCAke2VuZH1dYCk7XHJcbiAgfVxyXG4gIGlmIChidWZmLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgLy8gQXZvaWQgczAgY29ybmVyIGNhc2UgaW4gQXJyYXlCdWZmZXIgY2FzZS5cclxuICAgIHJldHVybiBuZXcgQnVmZmVyKDApO1xyXG4gIH0gZWxzZSBpZiAoU1VQUE9SVFNfVFlQRURfQVJSQVlTKSB7XHJcbiAgICB2YXIgdTggPSBidWZmZXIyVWludDhhcnJheShidWZmKSxcclxuICAgICAgczAgPSBidWZmLnJlYWRVSW50OCgwKSxcclxuICAgICAgbmV3UzAgPSAoczAgKyAxKSAlIDB4RkY7XHJcblxyXG4gICAgYnVmZi53cml0ZVVJbnQ4KG5ld1MwLCAwKTtcclxuICAgIGlmICh1OFswXSA9PT0gbmV3UzApIHtcclxuICAgICAgLy8gU2FtZSBtZW1vcnkuIFJldmVydCAmIGNvcHkuXHJcbiAgICAgIHU4WzBdID0gczA7XHJcbiAgICAgIHJldHVybiB1aW50OEFycmF5MkJ1ZmZlcih1OC5zbGljZShzdGFydCwgZW5kKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBSZXZlcnQuXHJcbiAgICAgIGJ1ZmYud3JpdGVVSW50OChzMCwgMCk7XHJcbiAgICAgIHJldHVybiB1aW50OEFycmF5MkJ1ZmZlcih1OC5zdWJhcnJheShzdGFydCwgZW5kKSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBidWZmU2xpY2UgPSBuZXcgQnVmZmVyKGVuZCAtIHN0YXJ0KTtcclxuICAgIGJ1ZmYuY29weShidWZmU2xpY2UsIDAsIHN0YXJ0LCBlbmQpO1xyXG4gICAgcmV0dXJuIGJ1ZmZTbGljZTtcclxuICB9XHJcbn1cclxuIl19