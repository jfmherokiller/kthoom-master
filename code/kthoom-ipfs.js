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
        kthoom.ipfs.ipfsInstance.ping().id(function(err,identity){
            if(err !== null)
            {
                IpfsNodeNotRunning();
            } else {
                IpfsNodeRunning();
            }
        });
        function IpfsNodeRunning() {
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
            function IpfsNodeNotRunning() {
                var url_withHash = window.location.origin + "/ipfs/" + ipfshash;
                var httpRequest = new XMLHttpRequest();
                function RunRequest() {
                    httpRequest.onreadystatechange = GetContents();
                    httpRequest.open('GET', url_withHash);
                    httpRequest.responseType = "arraybuffer";
                    httpRequest.send();
                }
                function GetContents() {
                    if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === 200) {
                            loadFromArrayBuffer(httpRequest.response);
                        } else {
                            alert('There was a problem with the request.');
                        }
                    }
                }
                RunRequest();
            }
        }
    }, ipfsHashWindow: function () {
        var ipfshash = window.prompt("Please Enter The IPFS hash of the book","QmUnxk13vHYDLytanzzNopdtKiVwURTd7TXqmzGgESyvZA");
        this.LoadHash(ipfshash);
    }
};