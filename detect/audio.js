(function(define){
define(["has"], function(has){

    var CAN_PLAY_GUESSES = { "maybe": 1, "probably": 1 },
    	addtest = has.addtest,
        STR = "string",
        FN = "function"
    ;

    if(!has("dom")){ return; }

    var audio = document.createElement("audio");

    addtest("audio", function(){
        return has.isHostType(audio, "canPlayType");
    });

    // TODO: evaluate if these tests fit within the has.js scope because they don't
    // provide a definate yes or no answer
    addtest("audio-ogg", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/ogg; codecs='vorbis'")];
    });

    addtest("audio-mp3", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/mpeg;")];
    });

    addtest("audio-wav", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/wav; codecs='1'")];
    });

    addtest("audio-m4a", function(){
        return has("audio") && !!(CAN_PLAY_GUESSES[audio.canPlayType("audio/x-m4a;")] ||
            CAN_PLAY_GUESSES[audio.canPlayType("audio/aac;")]);
    });

});
})(typeof define != "undefined" ? define : function(deps, factory){
	factory(has); // the use global has() if a module system is not available 
});
