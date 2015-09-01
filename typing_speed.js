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
			interval;

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

		$('#submit_button').css('background-color', 'turquoise');

		//stop the count 
		clearInterval(interval);

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
		
		console.log(mistakes.count);

		correct.count = charsTyped - mistakes.count;

		//$('#score_paragraph').text('Accuracy: '+ ((correct.count / charsTyped) * 100).toFixed(2) + '%');
		$('#score_paragraph').text('Chars typed is ' + charsTyped + ', while total(correct+mistakes) is ' + (correct.count+mistakes.count));

	});


	$('#typing_area').keypress(function() {
		charsTyped += 1;
	});

});

