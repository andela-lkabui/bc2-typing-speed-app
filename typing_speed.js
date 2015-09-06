var enabler = function(selector) {
	$(selector).removeAttr('disabled');
};

var changeCssProperties = function(selector, property, value) {
	$(selector).css(property, value);
};

var disabler = function(selector) {
	$(selector).attr('disabled', 'disabled');
};

var setText = function(selector, text) {
	$(selector).text(text);
};

var isDisabled = function(selector) {
	var disabled = $(selector).attr('disabled');

	if (disabled) {
		return true;
	}
	else {
		return false;
	}
};

var firebaseHome = new Firebase('https://torrid-torch-3503.firebaseio.com');

var testText,
		count = 64,
		interval,
		scores;

var mistakes = {
	count:0
};

var correct = {
	count:0
};

$(document).ready(function() {

	$('#load_button').click(function() {

		var paragraphArray = new Array();

		paragraphArray.push("Try the default text. It's a poem. I dig, you dig, we dig, he digs, she digs, they dig. It's not a beautiful poem, but it's very deep!");

		if (paragraphArray.length < 5) {
			firebaseHome.child('paragraphs').orderByValue().on('value', function(snapshot) {
				var childData;
					
				snapshot.forEach(function(childSnapshot) {
					childData = childSnapshot.val();
					paragraphArray.push(childData['text']);
				});

			});
		}
		if (paragraphArray.length < 5) {
			setText("#feedback_title", "Not enough paragraphs to choose from");
			setText("#feedback_paragraph", "The app needs at least five paragraphs to choose from. Please use the Create Paragraph button to create more paragraphs. If you're seeing this message in error, please try again: intermittent network connections can cause this.");
			$("#save_username_div").hide();

			$("#feedback_dialog").modal("show");
		}
		else if (paragraphArray.length > 5) {
			var randomIndex = parseInt(Math.random() * paragraphArray.length);
			testText = paragraphArray[randomIndex];
			setText("#loading_area", testText);

			if (isDisabled("#start_button")) {
				enabler("#start_button");
			}
		}

		setText("load_button","Load another paragraph");
		
	});

	$("#start_button").click(function() {
		function counter() {
				count -= 1;

				if (count < 15) {
					changeCssProperties('#counter_paragraph', 'color', 'orange');
					if (count < 7) {
						changeCssProperties('#counter_paragraph', 'color', 'red');
					}
					if (count < 0) {
						$('#counter_paragraph').text("TIME'S UP!");	
						clearInterval(interval);
						//disable text field when time is up
						disabler('#typing_area');
						return;
					}
				}

				if (count > 60) {
					switch(count) {
						case 63:{
							$('#counter_paragraph').text("READY...");	
							break;	
						}
						case 62:{
							$('#counter_paragraph').text("SET...");	
							break;	
						}
						case 61:{
							$('#counter_paragraph').text("GO!");	
							break;	
						}
					}
				}
				else {
					if (isDisabled("#typing_area")) {
						setText("#typing_area","");
						enabler("#typing_area");
					}
					$('#counter_paragraph').text(count);
				}
			}
			interval = setInterval(counter, 1000);
			enabler("#submit_button");
			
			//prevent start button from being used again (and reset the counter in the process)
			disabler("#start_button");
	});

	$("#submit_button").click(function() {

		clearInterval(interval);

		var currentCount = $('#counter_paragraph').val();

		var	testTextArr = testText.split(/\s/),
				userText = $('#typing_area').val(),
				userTextArr = userText.split(/\s+/);

		var	userTextArrLen = userTextArr.length,
				testTextArrLen = testTextArr.length;

		var	testWord,
				userWord,
				testWordLen,
				userWordLen;
			
		//for usertext that exceeds testtext, count each of those words as mistakes
		if (userTextArrLen > testTextArrLen) {
			for (var y = testTextArrLen; y < userTextArrLen; y += 1) {
				mistakes.count += userTextArr[y].length;
			}
		}
				
		for (var z = 0; z < userTextArrLen; z += 1) {
			if (userTextArr[z] === testTextArr[z]) {
				correct.count += userTextArr[z].length;
			}
			else {
				testWord = testTextArr[z];
				userWord = userTextArr[z];

				testWordLen = testWord.length,
				userWordLen = userWord.length;

				//if the user types a word that's longer than the test word
				//e.g. user types "they" instead of "the"
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
				//e.g user types doesnt instead of doesn't
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
				//e.g user types fxx instead of fox
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

		var charsTyped = (mistakes.count + correct.count);

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

		var username = prompt("Please give us your name so that we can immortalize you");

		scores = {
					name: username,
					accuracy: accuracy,
					mistakes: mistakes.count,
					total_key_strokes: charsTyped,
					gwpm: gwpm,
					nwpm: nwpm
		};

		if (username) {
			
			firebaseHome.child('scores').push(scores);

			setText("#feedback_title", "Entry Successful");
			$("#feedback_save").hide();

			$("#save_username_div").hide();
			$("#feedback_paragraph").show();

			setText("#feedback_paragraph", "Your have been immortalized " + username + ". You may now click on the Leaderboard tab to see how you fare against others.");

			$("#feedback_dialog").modal("show");
		}
		else {
			username = "Anonymous";

			setText("#feedback_title", "Scores not saved");
			
			$("#save_username_div").hide();
			$("#feedback_save").hide();
			$("#feedback_paragraph").show();

			setText("#feedback_paragraph", "Your scores have not been saved. As a result, you cannot appear on the Leaderboard.");
			$("#feedback_dialog").modal("show");
		}
		
		setText("#results_salutation", "Hi " + username + ". This is what we measured from your typing test.");
		$("#your_scores").tab("show");
	});

	$("#leaderboard").click(function() {
		firebaseHome.child('scores').orderByValue().on('value', function(snapshot) {
				var childData,
						inc = 1,
						rankTD,
						nameTD,
						scoreTD;
						
				snapshot.forEach(function(childSnapshot) {
					childData = childSnapshot.val();

					rankTD = "<td>" + inc + ".</td>";
					nameTD = "<td>" + childData['name'] + "</td>",
					scoreTD = "<td>" + childData['nwpm'] + "</td>";

					$('#stats_table_tbody').append("<tr>" + rankTD + nameTD + scoreTD + "</tr>");
					console.log(inc);

					inc += 1;

				});

			});		
	});

});