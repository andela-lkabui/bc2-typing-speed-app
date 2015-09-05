$(document).ready(function() {

	//$('#stats_table').toggle();
	//$('#results_table').toggle();
	//$('#messenger').toggle();

	var displayInput;
	var mistakes = {
			count:0,
			words:""
		};

	var correct = {
			count:0
		};

	var spaces = {
		testSpaces: 0,
		userSpaces: 0
	};

	var controlV = false;

	var charsTyped = -1,
			count = 60,
			interval,
			username;

	var testText,
			myDataRef = new Firebase('https://torrid-torch-3503.firebaseio.com');

	$('#start_button').click(function() {
		
		if (displayInput === 1) {

			count = 60;

			changeCssProperties('#start_button', 'background-color', 'orange');
		
			//remove default text upon clicking start button
			var typingTextDefault = $('#typing_area').text();

			if (typingTextDefault === 'Enter paragraph text here.') {
				$('#typing_area').text('');
			}

			//enable text area so that user can start typin
			var typingDisabled = $('#typing_area').attr('disabled');

			if (typingDisabled === 'disabled') {
				enabler('#typing_area');
			}

			//enable submit button on start is pressed so user can submit
			var submitDisabled = $('#submit_button').attr('disabled');

			if (submitDisabled === 'disabled') {
				enabler('#submit_button');
			}

			function counter() {
				count -= 1;

				if (count < 15) {
					changeCssProperties('#counter_paragraph', 'color', 'orange');

					if (count < 7) {
						changeCssProperties('#counter_paragraph', 'color', 'red');
					}

					if (count < 0) {
						clearInterval(interval);
						//disable text field when time is up
						disabler('#typing_area');
						return;
					}
				}
			

				$('#counter_paragraph').text(count);

			}

			interval = setInterval(counter, 1000);

			//enable reset button on start is pressed
			var resetDisabled = $('#reset_button').attr('disabled');

			if (resetDisabled === 'disabled') {
				enabler('#reset_button');
			}

		}

	});


	$('#load_button').click(function() {
		displayInput = 1;

		clearInterval(interval);

		$('#typing_area').text('');

		hideIfVisible('#stats_table');
		hideIfVisible('#results_table');
		showIfHidden('#typing_table');
		
		var loadValue = $('#load_button').attr('value');

		if (loadValue === 'Load a paragraph') {
			$('#load_button').attr('value', 'Try alternative paragraph?');
		}

		changeCssProperties('#load_button', 'background-color', 'turquoise');
		
		var startDisabled = $('#start_button').attr('disabled');

		if (startDisabled === 'disabled') {
			enabler('#start_button');
		}


		var texts = new Array();
		texts.push("Try the default text. It's a poem. I dig, you dig, we dig, he digs, she digs, they dig. It's not a beautiful poem, but it's very deep!");

		if (texts.length < 5) {
			myDataRef.child('paragraphs').orderByValue().on('value', function(snapshot) {
				var childData,
						grandChildData;
					
				snapshot.forEach(function(childSnapshot) {
					childData = childSnapshot.val();

					texts.push(childData['text']);

				});

			});
		}
		


		var randomIndex = parseInt( (Math.random() * texts.length) );

		$('#loading_area').text(texts[randomIndex]);

		testText = $('#loading_area').text();

	});


	$('#submit_button').click(function() {
		//stop the count 
		clearInterval(interval);

		if ( displayInput === 0) {
			showIfHidden('#typing_table');
			hideIfVisible('#stats_table');
			hideIfVisible('#results_table');
		}
		else {
			if (controlV) {
				$('#typing_area').text('');
				alert('Please type in a some text. (And dont copy - paste)');
				
				console.log('Apparently, typing area is empty');

			}
			else {
				changeCssProperties('#submit_button', 'background-color', 'turquoise');
			
				$('#typing_table').toggle();

				//accounting for words	
				var currentCount = $('#counter_paragraph').text(),
						testTextArr = testText.split(/\s/),
						userText = $('#typing_area').val(),
						userTextArr = userText.split(/\s+/),
						userTextArrLen = userTextArr.length,
						testTextArrLen = testTextArr.length;

				var	testWord,
						userWord,
						testWordLen,
						userWordLen;
			
				//for text that exceeds test, count each of those words as mistakes
				if (userTextArrLen > testTextArrLen) {
					for (var y = testTextArrLen; y < userTextArrLen; y += 1) {
						mistakes.count += userTextArr[y].length;
					}
				}
				

				for (var z = 0; z < userTextArrLen; z += 1) {
					//if (typeof userTextArr[z] === 'undefined') {
						//mistakes.count += 1;
					//} 
					if (userTextArr[z] === testTextArr[z]) {
						correct.count += userTextArr[z].length;
								
					}
					else {
						testWord = testTextArr[z];
						userWord = userTextArr[z];

						testWordLen = testWord.length,
						userWordLen = userWord.length;

						if (testWordLen < userWordLen) {
							for (var k = 0; k < userWordLen; k += 1) {
								if (typeof testWord[k] === 'undefined') {
									mistakes.count += 1;
								}
								else if (testWord[k] === userWord[k]) {
									correct.count += 1;
								}
								else {
									mistakes.count += 1;
								}
							}
						}
						else if (testWordLen > userWordLen) {
							for(var m = 0; m < testWordLen; m += 1) {
								if (typeof userWord[m] === 'undefined') {
									mistakes.count += 1;
								}
								else if (testWord[k] === userWord[k]) {
									correct.count += 1;
								}
								else {
									mistakes.count += 1;
								}
							}
						}
						else if (testWordLen === userWordLen) {
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

				}

				charsTyped = (mistakes.count + correct.count);

				var accuracy = ((correct.count / charsTyped) * 100).toFixed(2),
						elapsed = ( (60 - currentCount) / 60),
						gwpm = ( (charsTyped / 5) / elapsed ),
						nwpm = gwpm - (mistakes.count / elapsed );

				gwpm = gwpm.toFixed(3);
				nwpm = nwpm.toFixed(3);

				$('#accuracy_score').text(accuracy + ' %');
				$('#corrects').text(correct.count);
				$('#mistakes').text(mistakes.count);
				$('#total_key_strokes').text(charsTyped);
				$('#gwpm').text(gwpm);
				$('#nwpm').text(nwpm);

				displayInput = 0;

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
					};

					myDataRef.child('scores').push(scores);

					alert('You have been immortalized ' + username + '!!')

				}

		}

	}

});

	$('#hotspot').mouseenter(function() {

		if ( isVisible('#results_table') ) {
			changeCssProperties('#results_table', 'font-size', '+=2em');
			changeCssProperties('#results_table', 'max-width', '50em');
		}
	
		if ( isVisible('#stats_table') ) {
			changeCssProperties('#stats_table', 'font-size', '+=2em');
			changeCssProperties('#stats_table', 'max-width', '50em');
		}
	});

	$('#hotspot').mouseleave(function() {

		if ( isVisible('#results_table') ) {
			changeCssProperties('#results_table', 'font-size', '-=2em');
		}
	
		if ( isVisible('#stats_table') ) {
			changeCssProperties('#stats_table', 'font-size', '-=2em');
		}
	});
	
	
	$('#stats_button').click(function() {
		changeCssProperties('#stats_button', 'background-color', 'turquoise');
		//$('#stats_button').css('background-color','turquoise');
		
		hideIfVisible('#typing_table');
		hideIfVisible('#results_table');

		if ( isVisible('#stats_table') ) {
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
		$('#bootstrap_alert').modal('show');
		//var newPara = prompt('Proceed and type in test paragraph');

	});

	$('#save_paragraph').click(function() {
		var newPara = $("#new_paragraph_area").val();

		console.log("Are we there yet!? " + $("#new_paragraph_area").text());
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

		$('#bootstrap_alert').modal('hide');
	});

	$('#typing_area').keypress(function(e) {
		charsTyped += 1;
		//keyB =  String.fromCharCode(e.keyCode);

		//$('#loading_area').html($('#loading_area').html().replace(keyB, ''));

		//$('#colour_man').append('Austin');
	
		if (e.keyCode === 32) {
			spaces.userSpaces += 1;
		}
	});

	$('#typing_area').bind('paste', function() {
		controlV = true;
	});


	$('#messenger').click(function() {
		hideIfVisible('#messenger');
	});
	
});

var hideIfVisible = function(selector) {
	if ( $(selector).is(':visible')) {
		$(selector).toggle();
	}
};

var showIfHidden = function(selector) {
	if ( !( $(selector).is(':visible') ) ) {
		$(selector).toggle();
	}
};

var isVisible = function(selector){
	if ( $(selector).is(':visible') ) {
		return true;
	}
	else {
		return false;
	}

};

var changeCssProperties = function(selector, property, value) {
	$(selector).css(property, value);
};

var disabler = function(selector) {
	$(selector).attr('disabled', 'disabled');
};

var enabler = function(selector) {
	$(selector).removeAttr('disabled');
};