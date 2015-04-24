Switcher Jquery Plugin
-----------------------

switcher plugin let you transform your input checkbox and radios into a nice switch buttons with a nice interfaces.
	
	Requirements:
	=============
		browser supports css3 transition and transform, latest versions of modern browsers support css3
		NOTE: plugin uses jquery 2+ library

	Features:
	=========
		
		- auto generated markup, so no need for extra or specific html
		- uses css3 transform and transition properties with full browsers vendor prefix
		- support array checkbox inputs
		- multiple themes
		- you can manipulate switch style:
			- control switch width and height
			- control switch blob offset
			- control switch on off direction automatically and manually
			- control switch on state text and off state text
			- ability to automatic fit font size
			- show its input for functionality testing
			- fire custom events on turnon, turnoff and change. so you can perform your tasks depends on switch status

	Usage:
	======

		// convert all checkboxs to switchs
		$('input[type=checkbox]').switcher();

		
		// Options
		$('input[type=checkbox]').switcher({
									// Default value			// info

			theme: 'modern', 		// light					select theme between 'light, dark, modern, iphone, flat'	
			width: 80, 				// 56  in 'px'			
			height: 26, 			// 22
			blobOffset: 0,			// 2
			dir: 'rtl',				// html dir || 'ltr'		set switch direction 'important for transform'
			reverse: true,			// false					reverse on off order
			onText: 'YES',			// 'ON'						text displayed on ON state
			offText: 'NO',			// 'OFF'					text displayed on OFF state
			inputs: true,			// false					show corresponding  inputs
			autoFontSize: true,		// false					auto fit text size with respect to switch height
		});

		
		// assign event handler
		$(':radio').switcher().on({

			'turnon.switcher': function( e, dataObj ){

				// to do on turning on a switch
			},

			'turnoff.switcher': function( e, dataObj ){

				// to do on turning off a switch
			},

			'change.switcher': function( e, dataObj ){

				// to do on turning on or off a switch
			}

		});
