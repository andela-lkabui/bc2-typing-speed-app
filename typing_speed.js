$(document).ready(function() {

	$('#stats_table').toggle();
	$('#results_table').toggle();
	$('#messenger').toggle();

	var mistakes = {
			count:0,
			words:""
		};

	var correct = {
			count:0
		};

	var charsTyped = -1,
			count = 13,
			interval,
			username;

	var testText,
			myDataRef = new Firebase('https://torrid-torch-3503.firebaseio.com');

	$('#start_button').click(function() {

		$('#start_button').css('background-color', 'orange');

		//remove default text upon clicking start button
		var typingTextDefault = $('#typing_area').text();

		if (typingTextDefault === 'Enter paragraph text here.') {
			$('#typing_area').text('');
		}

		//enable text area so that user can start typin
		var typingDisabled = $('#typing_area').attr('disabled');

		if (typingDisabled === 'disabled') {
			$('#typing_area').removeAttr('disabled');
		}

		//enable submit button on start is pressed so user can submit
		var submitDisabled = $('#submit_button').attr('disabled');

		if (submitDisabled === 'disabled') {
			$('#submit_button').removeAttr('disabled');
		}

		function counter() {
			count -= 1;
			if (count < 0) {
				clearInterval(interval);
				//disable text field when time is up
				$('#typing_area').attr('disabled', 'disabled');
				return;
			}

			$('#counter_paragraph').text(count + ' s');

		}

		interval = setInterval(counter, 1000);

		//enable reset button on start is pressed
		var resetDisabled = $('#reset_button').attr('disabled');

		if (resetDisabled === 'disabled') {
			$('#reset_button').removeAttr('disabled');
		}

	});


	$('#load_button').click(function() {

		hideIfVisible( $('#stats_table') );
		hideIfVisible( $('#results_table') );
		showIfHidden( $('#typing_table') );
		
		var texts = new Array();

		myDataRef.orderByValue().on('value', function(snapshot) {
			var childData,
					grandChildData;
					
			snapshot.forEach(function(childSnapshot) {

				key = childSnapshot.key();
  	  	
    		if (key === 'paragraphs') {
    			childSnapshot.forEach(function(grandChildSnapShot) {

    				grandChildData = grandChildSnapShot.val();

    				texts.push(grandChildData['text']);

    			});
    		}
    		else {
    			return;
    		}

			});

		});
	
		var loadValue = $('#load_button').attr('value');

		if (loadValue === 'Load a paragraph') {
			$('#load_button').attr('value', 'Try alternative paragraph?');
		}

		$('#load_button').css('background-color', 'green');

		var startDisabled = $('#start_button').attr('disabled');

		if (startDisabled === 'disabled') {
			$('#start_button').removeAttr('disabled');
		}

		var randomIndex = parseInt( (Math.random() * texts.length) );

		$('#loading_area').text(texts[randomIndex]);

		testText = $('#loading_area').text();

	});


	$('#submit_button').click(function() {
		//stop the count 
		clearInterval(interval);

		if (charsTyped < 0) {

			alert('Please type in a paragraph. (And dont copy - paste)');

		}
		else {

			$('#submit_button').css('background-color', 'turquoise');

			$('#typing_table').toggle();

			
			var currentCount = $('#counter_paragraph').val(),
					testTextArr = testText.split(/\s/),
					userText = $('#typing_area').val(),
					userTextArr = userText.split(/\s+/),
					testTextArrLen = testTextArr.length,
					testWord,
					userWord,
					testWordLen,
					userWordLen;
				
				//console.log('userArray is '+userTextArr);
				//console.log('testArray is '+testTextArr);

			for (var z = 0; z < testTextArrLen; z +=1) {
				if (typeof userTextArr[z] === 'undefined') {
					mistakes.count += 1;
				} 
				else if (userTextArr[z] === testTextArr[z]) {
						correct.count += userTextArr[z].length;
							
				}
				else {
					testWord = testTextArr[z];
					userWord = userTextArr[z];

					//console.log('Test word is '+ testWord +' while user word is ' + userWord);
					testWordLen = testWord.length,
					userWordLen = userWord.length;

					if (testWordLen < userWordLen) {
						mistakes.count += (userWordLen - testWordLen);
					}

					for (var g = 0; g < testWordLen; g += 1) {
						if (testWord[g] === userWord[g]) {
							correct.count += 1;
						}
						else {
							mistakes.count += 1;
						}
					}
				}

			}

		charsTyped = (mistakes.count + correct.count);

		//console.log('charsTyped: ' + charsTyped + ' correct: ' + correct.count);

		var accuracy = ((correct.count / charsTyped) * 100).toFixed(2),
				elapsed = 13 - currentCount,
				gwpm = ( (charsTyped / 5) / (elapsed/60) ),
				nwpm = gwpm - (mistakes.count / (elapsed/60) );

		if (nwpm < 0) {
			nwpm = 0;
		}

		gwpm = Math.round(gwpm);
		nwpm = Math.round(nwpm);

		$('#accuracy_score').text(accuracy + ' %');
		$('#corrects').text(correct.count);
		$('#mistakes').text(mistakes.count);
		$('#total_key_strokes').text(charsTyped);
		$('#gwpm').text(gwpm);
		$('#nwpm').text(nwpm);

		$('#results_table').toggle();

			username = prompt('Please give us your name so that we can immortalize you');

			if (username.length < 3) {
				username = prompt("C'mon ... is that your real name? Don't be shy, go ahead");
			}
			else {

				//create object, then save it to firebase
				var scores = {
					name: username,
					accuracy: accuracy,
					mistakes: mistakes.count,
					total_key_strokes: charsTyped,
					gwpm: gwpm,
					nwpm: nwpm
				}

				myDataRef.child('scores').push(scores);

				alert('You have been immortalized ' + username + '!!')
			}

		}

	});

	$('#hotspot').mouseenter(function() {

		if ( $('#results_table').is(':visible') ) {
			$('#results_table').css('backdround-color', 'magenta');
			$('#results_table').css('font-size', '+=2em');
			$('#results_table').css('max-width', '50em');
		}
	
		if ( $('#stats_table').is(':visible') ) {
			$('#stats_table').css('backdround-color', 'magenta');
			$('#stats_table').css('font-size', '+=2em');
			$('#stats_table').css('max-width', '50em');
		}
	});

	$('#hotspot').mouseleave(function() {

		if ( $('#results_table').is(':visible') ) {
			$('#results_table').css('backdround-color', 'magenta');
			$('#results_table').css('font-size', '-=2em');
		}
	
		if ( $('#stats_table').is(':visible') ) {
			$('#stats_table').css('backdround-color', 'magenta');
			$('#stats_table').css('font-size', '-=2em');
		}
	});
	
	
	$('#stats_button').click(function() {
		$('#stats_button').css('background-color','turquoise');
		
		hideIfVisible( $('#typing_table') );
		hideIfVisible( $('#results_table') );

		if ( $('#stats_table').is(':visible') ) {
			$('#results_table').toggle();
		}

		$('#stats_table_tbody tr').remove();


		myDataRef.orderByValue().on('value', function(snapshot) {
			var childData,
					grandChildData,
					inc = 1,
					rankTD,
					nameTD,
					scoreTD;
					
			snapshot.forEach(function(childSnapshot) {

				// key will be "fred" the first time and "barney" the second time
	  	  key = childSnapshot.key();
  	  	// childData will be the actual contents of the child
    		//childData = childSnapshot.val();

    		if (key === 'scores') {
    			childSnapshot.forEach(function(grandChildSnapShot) {

    				grandChildData = grandChildSnapShot.val();

	    			rankTD = "<td>" + inc + ".</td>";
						nameTD = "<td>" + grandChildData['name'] + "</td>",
						scoreTD = "<td>" + grandChildData['nwpm'] + "</td>";

						$('#stats_table_tbody').append("<tr>" + rankTD + nameTD + scoreTD + "</tr>");
						inc += 1;
    			});
    		}
    		else {
    			return;
    		}

    		

			});

			$('#stats_table').toggle();

		});
	});

	$('#reset_button').click(function() {
		location.reload();
	});

	$('#create_button').click(function() {
		var newPara = prompt('Proceed and type in test paragraph');

		if (newPara) {

			if (newPara.length > 45) {
				myDataRef.child('paragraphs').push({text:newPara});

				$('#messenger').addClass('alert alert-success');
				$('#messenger').text('New paragraph created. You can now use it to determine your typing speed.');
				$('#messenger').toggle();
			}
			else {
				$('#messenger').addClass('alert alert-warning');
				$('#messenger').text("The app needs a paragraph that's at least 45 characters long. Come up with something else. :)" );
				$('#messenger').toggle();
			}
			
		}
		else {
			//message: para dodn't contain anything
			$('#messenger').addClass('alert alert-danger');
			$('#messenger').text("You didn't type anything. New paragraph not created!");
			$('#messenger').toggle();
			
		}
	});

	$('#typing_area').keypress(function() {
		charsTyped += 1;
	});

	$(document).dblclick(function() {
		hideIfVisible( $('#messenger') );
	});
	
});

var hideIfVisible = function(selector) {
	if (selector.is(':visible')) {
		selector.toggle();
	}
}

var showIfHidden = function(selector) {
	if ( !(selector.is(':visible')) ){
		selector.toggle();
	}
}