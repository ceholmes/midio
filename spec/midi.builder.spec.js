describe('Midi.Builder', function () {

    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";    
    var _binary = window.atob(_b64);   
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);  

    it('should build Detail', function () {

        var builder = new Midi.Builder();
        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var track = input.tracks[0];

        var details = [];

        track.forEach(function (message) {
            var detail = builder.buildDetail(message);
            details.push(detail);
           //console.log(detail); 
        });

        details.forEach(function (detail) {
           var message = builder.buildMessage(detail);
           //console.log(message); 
        });

        expect(typeof builder).toBe('object');
    });

    it('should build Message', function(){ 

        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var builder = new Midi.Builder();

        var detail = builder.buildMidiDetails(input);
        //console.log(detail);

        expect(detail.tracks.length).toBe(1);

        var messages = builder.buildMidiMessages(detail);
        //console.log(messages);

        var timeSigDetail = findMessage(detail.tracks[0], 'time-signature')[0];
        //console.log(timeSigDetail);

        var timeSigMessage = findMessage(messages.tracks[0], 0x58)[0];
        //console.log(timeSigMessage);

        var output = builder.buildDetail(timeSigMessage);
        //console.log(output);
    });
    
    
    it('should build Pitch Bend', function (){

        var builder = new Midi.Builder();

        var minValue = 0;
        var maxValue = 16383;
        var midValue = 8192;

        var result = builder.buildMessage({type: 'pitch-bend', value: maxValue});
        expect(result.param1).toBe(127);
        expect(result.param2).toBe(127);
        
        
        var param1In = 127;
        var param2In = 127;
        
        var maxResult = param1In + (param2In << 7);
        //expect(maxResult).toBe(16383);

        //param2Out = Math.round(maxResult / 128);
        //param2Out = (param2Out < 128) ? param2Out : 127;
        
        param2Out = Math.floor(maxResult / 128);
        param1Out = maxResult % 128;
        
        expect(param1Out).toBe(param1In);
        expect(param2Out).toBe(param2In);
        
               
        /*
        http://www.midikits.net/midi_analyser/pitch_bend.htm
        
        127 + (127 << 7)
        16383
        126 + (127 << 7)
        16382
        */ 
    });
    
    function findMessage(messages, type) {
        return  messages.filter(function (msg) {
           return msg.type === type; 
        });
    }

});