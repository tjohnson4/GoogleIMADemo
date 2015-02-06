window.onload = function () {

    var videos = ["horns.m4v", "bears.m4v", "american.m4v"],
        videoIndex = 0;

    window.onerror = function (message, url, lineNo) {
        Logger.log("Line_Number:" + lineNo + ',_Error:' + message);

        return true;
    };

    var content = document.querySelector("#content"),
        videoContent = document.createElement('video'),
        adContainer = document.getElementById('adContainer'),
        opera = isOpera();

    Logger.PLATFORM = (opera) ? "Opera" : "WebKit";

    videoContent.setAttribute("id", "contentElement");
    if (!opera) {
        videoContent.setAttribute("preload", "metadata");
    }

    videoContent.onloadedmetadata = function () {
        Logger.log("2.onLoadedMetaData");
    };

    videoContent.onplay = function () {
        Logger.log("Video.Play");
    };

    videoContent.onplaying = function () {
        Logger.log("Video.Playing");
    };

    videoContent.onerror = function () {
        Logger.log("Video.Error");
    };

    videoContent.onended = function() {
        Logger.log("7.contentEndedListener");

        adsLoader.contentComplete();

        fetchAd();
    };

    content.appendChild(videoContent);

    var adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoContent),
        adsManager = undefined,
        adsLoader = undefined;

    // Must be done as the result of a user action on mobile
    adDisplayContainer.initialize();

    function onAdError(adErrorEvent) {
        Logger.log("onAdError");
        // Handle the error logging and destroy the AdsManager
        Logger.log(adErrorEvent.getError());
        adsManager.destroy();
    }

    function fetchAd() {
        Logger.log("3.fetchAd");

        adsLoader = new google.ima.AdsLoader(adDisplayContainer);

        // Add event listeners
        adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
        adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

        // Request video ads.
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = 'http://pubads.g.doubleclick.net/gampad/ads?' +
            'sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&' +
            'impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&' +
            'url=[referrer_url]&correlator=[timestamp]';

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = 1280;
        adsRequest.linearAdSlotHeight = 720;
        adsRequest.nonLinearAdSlotWidth = 1280;
        adsRequest.nonLinearAdSlotHeight = 150;

        adsLoader.requestAds(adsRequest);
    }

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        Logger.log("4.onAdsManagerLoaded");
        // remove event bindings
        adsLoader.removeEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
        adsLoader.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.mimeTypes = ['video/mp4'];
        adsRenderingSettings.uiElements = [];

        // Get the ads manager.
        adsManager = adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);  // See API reference for contentPlayback

        // Add listeners to the required events.
        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);

        try {
            // Initialize the ads manager. Ad rules playlist will start at this time.
            adsManager.init(1280, 720, google.ima.ViewMode.FULLSCREEN);
            // Call start to show ads. Single video and overlay ads will
            // start at this time; this call will be ignored for ad rules, as ad rules
            // ads start when the adsManage ris initialized.
            adsManager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
        }
    }

    function onContentPauseRequested() {
        Logger.log("5.onContentPauseRequested, ads children count : "+adContainer.children.length);
        // This function is where you should setup UI for showing ads (e.g.
        // display ad timer countdown, disable seeking, etc.)
        adContainer.style.display = "inline";
    }

    function onContentResumeRequested() {
        Logger.log("6.onContentResumeRequested, ads children count : "+adContainer.children.length);
        // This function is where you should ensure that your UI is ready
        // to play content.
        adContainer.style.display = "none";

        playVideo()
    }

    function playVideo() {
        Logger.log("1.playVideo, ads children count : "+adContainer.children.length);

        videoContent.src = "videos/"+getVideo();
        videoContent.load();
        videoContent.play();
    }

    function isOpera() {
        return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    }

    function getVideo() {
        var vid = videos[videoIndex];
        videoIndex = (videoIndex < videos.length -1) ? videoIndex + 1 : 0;

        return vid;
    }

    fetchAd()
};