## rcSwitcher Jquery Plugin

![rcSwitcher](http://i707.photobucket.com/albums/ww71/ashekfadl/Screen%20Shot%202015-04-26%20at%208.30.33%20PM.png)


>rcSwitcher plugin *'Radio Checkbox Switcher'* let you transform your input checkboxs and radios into a nice switch buttons with a nice interfaces.
>
>see __[_Demo_](http://ahmad-sa3d.github.io/rcswitcher/)__ here
	

### Requirements
>browser supports css3 transition and transform, latest versions of *__modern browsers support css3 transform and transitions__*

>built with jquery 2.1.3
>>*__requires  jquery >= 1.7.0__*


### License

>This Plugin is distributed under [GNU GPL V3 License](http://choosealicense.com/licenses/gpl-3.0/)


### Copyright
>@author	Ahmed Saad <a7mad.sa3d.2014@gmail.com>

### Version
> 2.1.0


----

### Features:


1. no need for extra or specific html.
2. _`smooth`_ as uses css3 transform and transition properties with full vendor prefixs.
3. support `rtl`.
4. support checkbox of type array _ex: `<input name="delete_users[]">`_.
5. multiple themes
6. you can manipulate switch style as:
   * control switch width and height.
   * control switch blob offset.
   * control switch on off direction.
   * control switch on state text and off state text.
   * ability to automatic fit font size.
   * ability to automatic stick switch to its parent side.
   * show switch corresponding input for functionality testing.
   * fire custom events on turnon, turnoff and change. so you can perform your tasks depends on switch status.
   		* on firing events an information plain object is passed to event handler function as the second argument. it contains jquery objects of each switch piece and also input jquery object 
   
    
---
### Usage:

This example explains:
 * Basic usage
 * Available options with its defaults
 * Using Custom Event

```javascript

// convert all checkboxs to switchs
$('input[type=checkbox]').rcSwitcher();


// Options
$('input[type=checkbox]').rcSwitcher({
							// Default value			// info

	theme: 'flat', 			// light					select theme between 'flat, light, dark, modern'	
	width: 80, 				// 56  in 'px'			
	height: 26, 			// 22
	blobOffset: 0,			// 2
	reverse: true,			// false					reverse on off order
	onText: 'YES',			// 'ON'						text displayed on ON state
	offText: 'NO',			// 'OFF'					text displayed on OFF state
	inputs: true,			// false					show corresponding  inputs
	autoFontSize: true,		// false					auto fit text size with respect to switch height
    autoStick: true			// false					auto stick switch to its parent side
});


// assign event handler
$(':radio').rcSwitcher().on({

	'turnon.rcSwitcher': function( e, dataObj ){

		// to do on turning on a switch
        
        // dataObj.$input  				current input jq object
        // dataObj.$switcher			current switch jq object
        // dataObj.components.$toggler	swich toggler jq object
        // dataObj.components.$on		switch on jq object
        // dataObj.components.$off		switch off jq object
        // dataObj.components.$blob		switch blob jq object
        
	},

	'turnoff.rcSwitcher': function( e, dataObj ){

		// to do on turning off a switch
	},

	'change.rcSwitcher': function( e, dataObj, changeType ){

		// to do on turning on or off a switch
        // changeType is 'turnon' || 'turnoff'
	}

});

```

__Options that could be set inside html input as attributes__

>_`data-ontext=""`_		
>_`data-offtext=""`_	
>>those attributes are equivalent to onText, offText options	
>>__*but they have more priority and if set they will override options values*__

```html
<!-- Set OnText and offText inside input element itself -->
<input type="checkbox" name="" value="" data-ontext="YES" data-offtext="NO" />

```