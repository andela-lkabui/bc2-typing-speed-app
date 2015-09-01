$(document).ready(function() {

	var mistakes = {
			count:0,
			words:""
		};

	var correct = {
			count:0
		};

	var charsTyped = 0,
			count = 13,
			interval,
			username;

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

	});


	$('#submit_button').click(function() {
		//stop the count 
		clearInterval(interval);

		if (charsTyped === 0) {
			alert("Please type the paragraph (and don't copy - paste)!!");

		}
		else {

			$('#submit_button').css('background-color', 'turquoise');

			//check differences between the two texts
			var userText = $('#typing_area').val(),
					testText = $('#loading_area').text(),
					currentCount = $('#counter_paragraph').val(),
					testLength = testText.length,
					userLength = userText.length;

			for (var z = 0; z < testLength; z += 1) {

				if ( (typeof userText[z]) === 'undefined') {
					mistakes.count += 1;
				}
				else if (userText[z] != testText[z]) {
					mistakes.count += 1;
				}
				else if (userText[z] != testText[z]) {
					correct.count += 1;
				}
			}
		
			correct.count = charsTyped - mistakes.count;

			var accuracy = ((correct.count / charsTyped) * 100).toFixed(2),
					elapsed = 120 - currentCount,
					gwpm = ( (charsTyped / 5) / (elapsed/60) ),
					nwpm = gwpm - (mistakes.count / (elapsed/60) );

			$('#accuracy_score').text(accuracy + ' %');
			$('#mistakes').text(mistakes.count);
			$('#total_key_strokes').text(charsTyped);
			$('#gwpm').text(gwpm);
			$('#nwpm').text(nwpm);

			username = prompt('Please give us your name so that we can immortalize you');

			if (username.length < 3) {
				username = prompt("C'mon ... is that your real name? Don't be shy, go ahead");
			}
			else {
				var scores = {
					name: username,
					accuracy: accuracy,
					mistakes: mistakes.count,
					total_key_strokes: charsTyped,
					gwpm: gwpm,
					nwpm: nwpm
				}

				var myDataRef = new Firebase('https://torrid-torch-3503.firebaseio.com/');
				myDataRef.push(scores);

				alert('You have been immortalized ' + username + '!!')
			}
			


		}

		
		
	});


	$('#typing_area').keypress(function() {
		charsTyped += 1;
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

});

