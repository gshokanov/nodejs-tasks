import { Buffer } from 'buffer';
import stream from 'stream';
import { EOL } from 'os';

class ReverseTransform extends stream.Transform {
    constructor(options) {
        super(options);
    }

    static EOLBuffer = Buffer.from(EOL, 'utf8');

    endsWithEOL(buffer) {
        const { EOLBuffer } = ReverseTransform;
        const possiblyEOL = buffer.slice(buffer.length - EOLBuffer.length, buffer.length);
        return possiblyEOL.equals(EOLBuffer);
    }

    reverseBuffer(buffer, start, end) {
        let i = start || 0;
        let j = end - 1 || buffer.length - 1;
        while (i < j) {
            const tmp = buffer[i];
            buffer[i] = buffer[j];
            buffer[j] = tmp;
            i++;
            j--;
        }
    }

    _transform(data, encoding, callback) {
        this.endsWithEOL
            ? this.reverseBuffer(data, 0, data.length - ReverseTransform.EOLBuffer.length)
            : this.reverseBuffer(data);
        this.push(data, encoding);
        callback();
    }
}

const reverse = new ReverseTransform();

stream.pipeline(
    process.stdin,
    reverse,
    process.stdout,
    err => { 
        if (err) {
            console.error(err);
        }
    }
);
