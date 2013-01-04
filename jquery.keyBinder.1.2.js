/*
keyBinder jQuery Plugin
version 1.2
Developed by Trent Oswald
trentoswald@therebelrobot.com

This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.

You can use this for what you need (personal/commercial), but please
keep this attribution comment intact.

This work is currently under devlopment and may need additional work. 
Please send any debug reports to me via email.

I also love to hear what projects this comes in handy for. If desired,
shoot me an email with a link.

Usage:
     $(document).keyBinder("hotkey","a",function(){
         $('.output').append('POW!');
     });
     $(document).keyBinder("hotkey","leftSuper","a",function(){
         $('.output').append('POW!');
     });
     $(document).keyBinder("sequence", "t h i s space i s space a space
t e s t period", function(){
	$('.output').append('POW!');
     });
*/
console.log('jquery.keyBinder.js loaded');
$.fn.keyBinder= function(style, modifier, triggerOrDelay, functionToRun, functionToRunEnd) {
    var key = {
        'backspace':'8',
        'tab':'9',
        'enter':'13',
        'esc':'27',
        'space':'32',
        'shift':'16','ctrl':'17','alt':'18','leftSuper':'91','rightSuper':'92',
        'pause':'19',
        'capsLock':'20','numLock':'144','scrLock':'145',
        'pgup':'33','pgdown':'34','end':'35','home':'36','insert':'45','delete':'46',
        'left':'37','up':'38','right':'39','down':'40',
        '0':'48','1':'49','2':'50','3':'51','4':'52','5':'53','6':'54','7':'55','8':'56','9':'57',
        'a':'65','b':'66','c':'67','d':'68','e':'69','f':'70','g':'71','h':'72','i':'73','j':'74','k':'75','l':'76','m':'77','n':'78','o':'79','p':'80','q':'81','r':'82','s':'83','t':'84','u':'85','v':'86','w':'87','x':'88','y':'89','z':'90',
        'select':'93',
        'num0':'96','num1':'97','num2':'98','num3':'99','num4':'100','num5':'101','num6':'102','num7':'103','num8':'104','num9':'105',
        'add':'107','sub':'109','mult':'106','div':'111',
        'decPoint':'110',
        'f1':'112','f2':'113','f3':'114','f4':'115','f5':'116','f6':'117','f7':'118','f8':'119','f9':'120','f10':'121','f11':'122','f12':'123',
        'fSlash':'191','bSlash':'220',
        'openBracket':'219','closeBracket':'221',
        'backTick':'192','equal':'187','dash':'189',
        'comma':'188','period':'190','semiColon':'186','quote':'222'
    };
    switch (style){
        case "hotkey":

            if (modifier == triggerOrDelay){
            	var modifierPresent = false;
            }
            else if (modifier == '' || triggerOrDelay == '' || !functionToRun || !key[triggerOrDelay]){
               var modifierPresent = false;
               functionToRunEnd = functionToRun;
               functionToRun = triggerOrDelay;
            }
            else{
                var modifierPresent = true;
            }
            if (modifier.indexOf("+")>=0){
                var modifierArray = modifier.split("+");
            }


            if (modifierArray && modifierPresent){ /* "ctrl+alt" && "a" */
                modifier = modifier.split('+');
                var modPressed1 = false;
                var modPressed2 = false;
                $(this).keydown(function (e) {
                    if (e.keyCode == key[modifier[0]]){
                        modPressed1 = true;
                        console.log(modifier[0]+' has been pressed');
                    }
                    else if (e.keyCode == key[modifier[1]]){
                        modPressed2 = true;
                        console.log(modifier[1]+' has been pressed');
                    }
                    else if (modPressed1 == true && modPressed2 == true && e.keyCode == key[triggerOrDelay]){
                        functionToRun();
                    }
                });

                $(this).keyup(function (e) {
                    if (e.keyCode == key[modifier[0]]){
                        modPressed1 = false;
                    }
                    else if (e.keyCode == key[modifier[1]]){
                        modPressed2 = false;
                    }
                });
            }
            else if (modifierArray && !modifierPresent){ /* "ctrl+a" */
                modifier = modifier.split('+');
                triggerOrDelay = modifier[1];
                modifier = modifier[0];
                var modPressed = false;
                $(this).keydown(function (e) {
                    if (e.keyCode == key[modifier]){
                        modPressed = true;
                        console.log(modifier+' has been pressed');
                    }
                    else if (modPressed == true && e.keyCode == key[triggerOrDelay]){
                        functionToRun();
                    }
                });

                $(this).keyup(function (e) {
                    if (e.keyCode == key[modifier]){
                        modPressed = false;
                    }
                });
            }
            else if (modifierPresent){ /* "ctrl" && "a" */
                var modPressed = false;
                $(this).keydown(function (e) {
                    if (e.keyCode == key[modifier]){
                        modPressed = true;
                        console.log(modifier+' has been pressed');
                    }
                    else if (modPressed == true && e.keyCode == key[triggerOrDelay]){
                        functionToRun();
                    }
                });

                $(this).keyup(function (e) {
                    if (e.keyCode == key[modifier]){
                        modPressed = false;
                    }
                });
            }
            else{ /* "ctrl" */
               $(this).keydown(function (e) {
                    if (e.keyCode == key[triggerOrDelay] || e.keyCode == key[modifier]){
                        console.log(modifier+' has been pressed');
                       	functionToRun();
                   }
               });
               
               	$(this).keyup(function (e) {
              		if (e.keyCode == key[triggerOrDelay] || e.keyCode == key[modifier]){
               			functionToRunEnd();
               		}
       		});
               
            }
            break;
        case "sequence": /* "a b c d e f g h i j ctrl"*/
            
            functionToRun = triggerOrDelay;

            /*"sequence", "a b c d f e ctrl", function */
            var sequence = modifier;
            sequence = sequence.split(" ");
            var sequenceCodes = [];
            $.each(sequence, function(Hello, data){
                sequenceCodes.push(key[data]);
            });
            sequenceCodes = sequenceCodes.toString();
            
            var keyspressed = [];
            $(this).keydown(function (e) {
                if (sequenceCodes.indexOf(e.keyCode) <0){
                    
                    keyspressed = [];
                    
                }
                else{
                    keyspressed.push(e.keyCode);
                    
                    if (keyspressed.toString().length > sequenceCodes.length){
                        
                        keyspressed = [];
                        
                    }
                    else if (keyspressed.toString().indexOf(sequenceCodes) >=0){
                        keyspressed = [];
                        functionToRun();
                    };
                }
            });
            break;
    }
    return true;
};
