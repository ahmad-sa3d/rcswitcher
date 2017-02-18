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
> 4.1

### Updated
> 18 Feb 2017

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
7. ####_fire custom events :_

	> __*`turnon.rcSwitcher`*__
	on turning on a Switch
	
	> __*`turnoff.rcSwitcher`*__
	on turning off a Switch
	
	> __*`toggle.rcSwitcher`*__
	on turning on / off a Switch
	
	>**New For V4 :**
	
	> __*`enable.rcSwitcher`*__
	on enable a Switch
	
	> __*`disable.rcSwitcher`*__
	on disable a Switch
	
	>> *on firing events an information plain object is passed to event handler function as the second argument. it contains jquery objects of each switch piece and also input jquery object, also on toggle event a third argument will passed its value will be current toggled value as 'turnon' OR 'turnoff'*
	
8. Respond For Input Status Changes ( `disabled`, `checked` ) 
> To Respond after changing input you must trigger change By call `change` method on changed input.
> 
>> $input.prop( 'checked', 'false' ).change();

----
### Changelog:

> __V 4.1__

1. Add feature that input should only have on switcher
		
		$(':checkbox').rcSwitcher(); // create switcher
		$(':checkbox').rcSwitcher(); // will not create switcher as it has already creatred
		
		
2. Add rcSwitcher Object on input as property
		
		// We now can access rcSwitcher Object from element itself
		$('#input').rcSwitcher(); // Create Switcher
		
		$('#input').[0].rcSwitcher; // Access its rcSwitcher Object
		
3. Add attribute 'data-has-rcswitcher="1"' on input to mark that input has rcswitcher
4. Enhance Auto Stick

> __V 4.0.1__

1. add support for control switch by changing input _`check`_ status
	
		$input = $('input[type=checkbox]').first().rcSwitcher();
		
		// swithcer will turn on
		$input.prop( 'checked', 'true' ).change(); 
		
		// switcher will turn off 
		$input.prop( 'checked', 'false' ).change();
		
		
	> __Notice :__
	
	> *changing checkbox or radio checked status with javascript will not trigger --*change*-- event, so you must use _`change()`_ method*
		
2. change `change.rcSwitcher` Event to `toggle.rcSwitcher` to avoid built-in javascript `change` event
3. enhance __*Demo*__ example to adapt with screen sizes and mobile phones
4. some other tweaks.

> __V 4.0__

5. Add Support For Track Disable And Enable Status on changing _`disable`_ status on Input'
	
		$input = $('input[type=checkbox]').first().rcSwitcher();
		
		// swithcer will be disabled
		$input.prop( 'disabled', 'true' ).change(); 
		
		// switcher will be Enabled 
		$input.prop( 'disabled', 'false' ).change();
		
		
	> __Notice :__
	
	> **changing checkbox or radio checked status with javascript will not trigger *`change`* event, so you must use _`change()`_ method**
	
	>**Disabling Radio Button Will Have A Special Treatment as
	> If radio button disabled while it was checked then every sibiling radio buttons *`have the same name`* Will Be Paused  and *`canot be checked`* as this should be The Right Behaviour.**
    
6. Fix Compitability with Bootstrap Framework

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

	'toggle.rcSwitcher': function( e, dataObj, changeType ){

		// to do on turning on or off a switch
        // changeType is 'turnon' || 'turnoff'
	},
	
	'enable.rcSwitcher': function( e, dataObj ){

		// to do on enabling a switch

	},
	
	'disable.rcSwitcher': function( e, dataObj ){

		// to do on disabling a switch

	},
	
	

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