INSTRUCTIONS
------------
Users can go the application to test their typing speed.

They click on a button, then they are given a paragraph which they type. once they submit, the application calculates their typing speed.

Users can see a leaderboard.

HOW IT WORKS
------------
The application allows to choose one of several paragraphs to type.

Click the start button to start typing (and to start the counter: which counts down from 60).

Click the submit button when you're done typing.

Check to see the metrics measured on the table below the leaderboard button.

To save your score for ranking at the leaderboard, choose to "immortalize" your score. Provide your name as asked.
Click on the leaderboard button to confirm your presence! If your name isn't on the list ... err ... try typing faster next time.

Cheers! :)

LOGIC
-----
The word count is measured against the number of entries you've put in.

The application will check for all the correct keystrokes against the typos.

Accuracy can then be calculated from this.

To calculate words per minute, the application assumes a word is made up of five characters (which makes a lot of sense considering "dinosaur" and "in" would have otherwise counted as one word each)

To get the GROSS WORDS PER MINUTE;
	gwpm = ( (characters typed/ 5) / time in minutes )

To get the NET WORDS PER MINUTE;
	nwpm = gwpm - ( mistakes / time in minutes )
	
