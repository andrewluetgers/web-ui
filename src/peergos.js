var Error           = require('./components/error');
var Feedback        = require('./components/feedback');
var Filesystem      = require('./components/filesystem');
var Gallery         = require('./components/gallery');
var Hex             = require('./components/viewers/hex');
var Login           = require('./components/login');
var Message         = require('./components/message');
var Modal           = require('./components/modal');
var Password        = require('./components/password');
var ProgressBar     = require('./components/progressbar');
var Prompt          = require('./components/prompt');
var Share           = require('./components/share');
var SharedWithModal = require('./components/shared-with-modal');
var Signup          = require('./components/signup');
var Social          = require('./components/social');
var Spinner         = require('./components/spinner');
var Text            = require('./components/viewers/text');
var Warning         = require('./components/warning');

var VueAsyncComputed = require('./plugins/vue-async-computed');
Vue.use(VueAsyncComputed);
var VueTouch = require('./plugins/vue-touch')
VueTouch.registerCustomEvent('doubletap', {
    type: 'tap',
    taps: 2
})
Vue.use(VueTouch)

Vue.mixin({
  methods: {
  	// This will only work up to a file size of 2^52 bytes (the biggest integer you can fit in a double)
  	// But who ever needed a filesize > 4 PB ? ;-)
  	getFileSize(props) {
  	    var low = props.sizeLow();
  	    if (low < 0) low = low + Math.pow(2, 32);
  	    return low + (props.sizeHigh() * Math.pow(2, 32));
  	},
    supportsStreaming() {
        try {
            return 'serviceWorker' in navigator && !!new ReadableStream() && !!new WritableStream()
        } catch(err) {
            return false;
        }
    },
    downloadFile(file) {
        console.log("downloading " + file.getFileProperties().name);
        var props = file.getFileProperties();
        var that = this;
        var resultingSize = this.getFileSize(props);
        var progress = {
            show:true,
            title:"Downloading " + props.name,
            done:0,
            max:resultingSize
        };
        var that = this;
        this.progressMonitors.push(progress);
        var context = this.getContext();
        file.getInputStream(context.network, context.crypto.random, props.sizeHigh(), props.sizeLow(), function(read) {
            progress.done += read.value_0;
            that.progressMonitors.sort(function(a, b) {
              return Math.floor(b.done / b.max) - Math.floor(a.done / a.max);
            });
            if (progress.done >= progress.max) {
                setTimeout(function(){
                    progress.show = false;
                    that.progressMonitors.pop(progress);
                }, 2000);
            }
        }).thenCompose(function(reader) {
            if (that.supportsStreaming()) {
                var size = that.getFileSize(props);
                var maxBlockSize = 1024 * 1024 * 5;
                var blockSize = size > maxBlockSize ? maxBlockSize : size;

                console.log("saving data of length " + size + " to " + props.name);
                let result = peergos.shared.util.Futures.incomplete();
                let fileStream = streamSaver.createWriteStream(props.name, props.mimeType,
                function(url) {
                    let link = document.createElement('a')
                    let click = new MouseEvent('click')
                    link.type = props.mimeType;
                    link.href = url
                    link.dispatchEvent(click)
                })
                let writer = fileStream.getWriter()
                let pump = () => {
                    if (blockSize == 0) {
                        writer.close()
                        result.complete(true);
                    } else {
                        var data = convertToByteArray(new Uint8Array(blockSize));
                        reader.readIntoArray(data, 0, blockSize)
                            .thenApply(function(read){
                                size = size - read;
                                blockSize = size > maxBlockSize ? maxBlockSize : size;
                                writer.write(data).then(()=>{setTimeout(pump)})
                            });
                    }
                }
                pump()
                return result;
            } else {
                var size = that.getFileSize(props);
                var data = convertToByteArray(new Int8Array(size));
                return reader.readIntoArray(data, 0, data.length)
                    .thenApply(function(read){that.openItem(props.name, data, props.mimeType)});
            }
        }).exceptionally(function(throwable) {
            progress.show = false;
            that.errorTitle = 'Error downloading file: ' + props.name;
            that.errorBody = throwable.getMessage();
            that.showError = true;
        });
    }
  }
})

    // Loading components
    Vue.component('error', Vue.extend(Error));
    Vue.component('feedback', Vue.extend(Feedback));
    Vue.component('filesystem', Vue.extend(Filesystem));
    Vue.component('gallery', Vue.extend(Gallery));
    Vue.component('hex', Vue.extend(Hex));
    Vue.component('login', Vue.extend(Login));
    Vue.component('message', Vue.extend(Message));
    Vue.component('modal', Vue.extend(Modal));
    Vue.component('password', Vue.extend(Password));
    Vue.component('progressbar', Vue.extend(ProgressBar));
    Vue.component('prompt', Vue.extend(Prompt));
    Vue.component('signup', Vue.extend(Signup));
    Vue.component('share-with', Vue.extend(Share));
    Vue.component('shared-with-modal', Vue.extend(SharedWithModal));
    Vue.component('social', Vue.extend(Social));
    Vue.component('spinner', Vue.extend(Spinner));
    Vue.component('text', Vue.extend(Text));
    Vue.component('warning', Vue.extend(Warning));

    // Initializing Vue after GWT has finished
    setTimeout(function() {
        var vueRoot = new Vue({
            el: 'body',
            data: {
                currentView: 'login',
                serverPort: 8000
            },
            events: {
                'child-msg': function (msg) {
                    // `this` in event callbacks are automatically bound
                    // to the instance that registered it
                    this.currentView = msg.view;

                    // this sends the received props to the new child component
                    this.$nextTick(function() {
                        this.$broadcast('parent-msg', msg.props);
                    });
                }
            }
        });
    }, 500);
