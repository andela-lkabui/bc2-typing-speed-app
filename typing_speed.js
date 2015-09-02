$(document).ready(function() {

	$('#stats_div').toggle();

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
			myDataRef = new Firebase('https://torrid-torch-3503.firebaseio.com/');

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

	});


	$('#load_button').click(function() {

		var loadValue = $('#load_button').attr('value');

		if (loadValue === 'Load a paragraph') {
			$('#load_button').attr('value', 'Try alternative paragraph?');
		}

		$('#load_button').css('background-color', 'green');

		var startDisabled = $('#start_button').attr('disabled');

		if (startDisabled === 'disabled') {
			$('#start_button').removeAttr('disabled');
		}

		var paragraph1 = "The quick brown fox jumped over the lazy dog.";

		$('#loading_area').text(paragraph1);

		 testText = $('#loading_area').text();

	});


	$('#submit_button').click(function() {
		//stop the count 
		clearInterval(interval);
	
		$('#submit_button').css('background-color', 'turquoise');

			
		var currentCount = $('#counter_paragraph').val(),
				testTextArr = testText.split(/\s/),
				userText = $('#typing_area').val(),
				userTextArr = userText.split(/\s+/),
				testTextArrLen = testTextArr.length,
				testWord,
				userWord,
				testWordLen,
				userWordLen;
				
				console.log('userArray is '+userTextArr);
				console.log('testArray is '+testTextArr);

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

		console.log('charsTyped: ' + charsTyped + ' correct: ' + correct.count);

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

				myDataRef.push(scores);

				alert('You have been immortalized ' + username + '!!')
			}
		
	});

	
	$('#results_table').mouseenter(function() {
		$('#results_table').css('backdround-color', 'magenta');
		$('#results_table').css('width', '+=50em');
		$('#results_table').css('height', '+=30em');
		//$('#results_table').css('margin-top', '-=30em');
	});

	$('#results_table').mouseleave(function() {
		$('#results_table').css('backdround-color', 'none');
		$('#results_table').css('width', '-=50em');
		$('#results_table').css('height', '-=30em');
		//$('#results_table').css('margin-top', '+=30em');
	});

	$('#stats_button').click(function() {
		$('#stats_button').css('background-color','turquoise');
		$('#stats_table').css('background-color', 'turquoise');

		$('#table_div').toggle();
		//$('#table_div').toggleClass('big_toggler');
		
		$('#stats_div').toggle();
		//$('#stats_div').toggleClass('big_toggler');

		$('#stats_table_tbody tr').remove();


		myDataRef.orderByChildKey('nwpm').on('value', function(snapshot) {
			var childData,
					inc = 1,
					rankTD,
					nameTD,
					scoreTD;
					
			snapshot.forEach(function(childSnapshot) {

				// key will be "fred" the first time and "barney" the second time
	  	  key = childSnapshot.key();
  	  	// childData will be the actual contents of the child
    		childData = childSnapshot.val();

    		rankTD = "<td>" + inc + ".</td>";
				nameTD = "<td>" + childData['name'] + "</td>",
				scoreTD = "<td>" + childData['nwpm'] + "</td>";

    		//console.log(childData['name']);
    		$('#stats_table_tbody').append("<tr>" + rankTD + nameTD + scoreTD + "</tr>");

    		inc += 1;

			});



			
		});
	});

});

