/**
 * Code for handling file access through Microsoft OneDrive.
 */

if (window.kthoom === undefined) {
    window.kthoom = {};
}

kthoom.ipfs = {

    ipfsInstanceInitated: false,
    ipfsInstance:null,
    ipfsInit: function () {
        this.ipfsInstance = window.IpfsApi();
        this.ipfsInstanceInitated =true;
    },
    LoadHash: function (ipfshash) {
        if(!kthoom.ipfs.ipfsInstance)
        {
            kthoom.ipfs.ipfsInit();
        }
        kthoom.ipfs.ipfsInstance.cat(ipfshash, function (err, ComicStream) {
            var buffers = [];
            ComicStream.on('data', function (buffer) {
                buffers.push(buffer);
            });
            ComicStream.on('end', function () {
                var buffer = kthoom.ipfs.ipfsInstance.Buffer.concat(buffers).buffer;
                loadFromArrayBuffer(buffer)
            });
            if (err) throw err;

        });
    }, ipfsHashWindow: function () {
        var ipfshash = window.prompt("Please Enter The IPFS hash of the book","QmUnxk13vHYDLytanzzNopdtKiVwURTd7TXqmzGgESyvZA");
        this.LoadHash(ipfshash);
    }
};