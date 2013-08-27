/* Google DFP Code - DO NOT EDIT - Current version as of August 2013 */
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() { var gads = document.createElement('script'); gads.async = true; gads.type = 'text/javascript'; var useSSL = 'https:' == document.location.protocol; gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js'; var node = document.getElementsByTagName('script')[0]; node.parentNode.insertBefore(gads, node); })();

/*
    Responsive DFP Delivery
    Loads DFP ads based on screen width defintions
    https://github.com/morningtoast/rdfp
    August 2013, Brian Vaughn - @morningtoast

    Public methods:
        Rdfp.register(slotName, widthMax, googleAdId, adSize);
        Rdfp.deliver(dfpNetworkId, className);

    See readme for syntax
*/
(function() {
    var self = this;
    var Rdfp;

    // Export gluten if exports are available
    if(typeof exports !== 'undefined') {
        Rdfp = exports;
    } else {
        Rdfp = self.Rdfp = {};
    }

    Rdfp.version = "1.0";


    // Module settings, to be configured by user init
    var settings = Rdfp.settings = {
        "debug": false,
        "selector": ".dfp",
        "dfpId":false
    };

    // Module cache variables used for logging and state tracking; not user-defineable
    var cache = {
        "ads": {},
        "c": 1,
        "slots":[],
        "stamp": new Date(),
        "size": window.innerWidth,
        "loaderCss": "",
        "tags": []
    };    

    cache.stamp = "rdfp-"+cache.stamp.getTime()+"-";


    // Generic debug function, dependent on settings
    var debug = function(s) {
        if (settings.debug) { console.log(s); }
    };    



    // Init function; kicks off module
    // Rdfp.init()
    var init = function(dfpId, regionClass, loaderGif) {
        debug("> deliver()");

        settings.selector = regionClass;
        settings.dfpId    = dfpId;
        cache.size        = window.innerWidth; // Get browser window size

        debug(". Looking for tags with class: "+regionClass);
        debug(". Current window size: "+cache.size);
        

        if (loaderGif) {
            cache.loaderCss = "background:url("+loaderGif+") center center no-repeat;";
        }

        if (settings.dfpId) {
            local.prep();
            local.initGoogle();
            
        } else {
            debug("You must provide your Google DFP ID number");
        }
    }

    var local = {

        // Parses through page elements to find matching class name
        getAdElements: function() {
            var valid = document.getElementsByClassName(settings.selector); // IE9+

            debug("> getAdElements()");

            /*
            // IE8 and below support; slower
            var elems = document.getElementsByTagName('*'), i;
            var valid = [];
            for (i in elems) {
                if((' '+elems[i].className+' ').indexOf(' '+settings.selector+' ') > -1) {
                    valid.push(elems[i]);
                }
            }
            */
            

            debug(". Found "+valid.length+" matching elements");

            return(valid);
        },

        initGoogle: function() {
            debug("> initGoogle()");

            // Defining slots within Google
            googletag.cmd.push(function() {
                for (a=0; a < cache.slots.length; a+=1) {
                    var obj = cache.slots[a];
                    googletag.defineSlot("/"+settings.dfpId+"/"+obj.gid, obj.gwh, obj.dom).addService(googletag.pubads());
                }

                googletag.pubads().enableSingleRequest();
                googletag.enableServices();

                // Do render
                googletag.cmd.push(function() { googletag.display(obj.dom); });
            });
        },

        register: function(id, minWidth, googleId, googleSize) {
            cache.ads[id] = {
                "id": id,
                "min": minWidth,
                "gid": googleId,
                "gwh": googleSize,
                "dom": cache.stamp+cache.c
            }

            cache.c += 1;
        },

        // Adds container elements for ads
        // Determines which slots are needed based on screen size definitions
        prep: function() {
            debug("> prep()");

            cache.size = window.innerWidth; // Get browser window size
            cache.tags = local.getAdElements();
        
            // Find out which slot should be used for each element
            for (i=0; i < cache.tags.length; i+=1) {
                var adEl    = cache.tags[i];
                var adlist  = adEl.getAttribute("data-ads").split(",");
                var active  = false;
                
                adEl.innerHTML = ""; // Clears out any existing markup

                debug(". Element "+i+" has "+adlist.length+" slots defined");
                debug(adlist);

                // Loop through element slots; whichever is last and matches is used
                for (a=0; a < adlist.length; a+=1) {
                    var thisAd = cache.ads[adlist[a]];

                    if (typeof thisAd != "undefined") {

                        if (cache.size > thisAd.min) {
                            active = thisAd;
                        }
                    }
                }

                // Add container inside matching element
                if (active) {
                    debug(". Using slot "+active.id);
                    cache.slots.push(active);
                    adEl.innerHTML = '<div id="'+active.dom+'" class="rdfp" style="width:'+active.gwh[0]+'px;height:'+active.gwh[1]+'px;'+cache.loaderCss+'" data-slot="'+active.id+'"></div>';
                }
            }

        }
    }

    // Define public
    Rdfp.register = local.register;
    Rdfp.deliver  = init;

}).call(this);    
