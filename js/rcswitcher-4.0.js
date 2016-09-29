/**
 * JQuery rcSwitcher plugin
 *
 * rcSwitcher plugin referes to 'Radio Checkbox Switcher'
 * it let you transform radio and checkbox inputs into a nice switch button
 * without requirement of a specific html syntax, it simply takes your existed basic input 
 * and do the magic with many customizations and supports 4 themes
 *
 *
 * @package 	rcSwitcher
 * @name 		rcSwitcher
 * @version 	4.0	< 29 Sep 2016 >	
 * @author  	ahmed saad <a7mad.sa3d.2014@gmail.com><ahmedfadlshaker@gmail.com>
 * @copyright  	ahmed saad april 2015
 * @link 		http://plus.google.com/+AhmedSaadGmail
 * @license 	http://choosealicense.com/licenses/gpl-3.0/ 	GNU GPL V3.0
 * 
 */

(function($){



	/**
	 * Defining Static variables
	 */

	var templates = {
		
		$switcher : $( '<span>', {'class': 'swraper'} ).hide(),
		$toggler: $( '<span>', {'class': 'stoggler' } ),
		$on: $( '<span>', {'class': 'slabel-on'} ),
		$off: $( '<span>', {'class': 'slabel-off'} ),
		$blob: $( '<span>', {'class': 'sblob'} ),

		// Allowed Themes
		themes: [ 'light', 'modern', 'dark', 'flat' ],

	};


	
	/**
	 * All Switcher methods goes here
	 *
	 * here all logic of switcher plugin
	 */
	var switcherM = {


		/**
		 * Prepare Switches
		 * 
		 * @param  {Object} switcherP switcher plugin properties
		 * @param  {Object} options   switcher plugin options object
		 * @return void
		 */
		start: function( switcherP, options )
		{			
			// Set Templates and one runtime calculations
			this.setTemplateStyle( options, switcherP );
			
			// prepare and create switches
			switcherP.$this.each( function( i, input )
			{
				// console.log( $input.type );
				this.makeSwitcher( $( input ), switcherP, options );
			}.bind( this ) );

			// ADD EVENT BEHAVIOUR
			this.behaviour( switcherP );

		},

		/**
		 * Make a switch
		 * 
		 * @param  {jQ Obj} $input    input object to make switch for
		 * @param  {Object} switcherP switcher plugin propertirs
		 * @param  {Object} options   switcher plugin options
		 * @return void         
		 */
		makeSwitcher: function( $input, switcherP, options )
		{
			// console.log( $input.attr('name') )
			var inputName = $input.attr( 'name' ).replace( /(\[\])+$/, '' ), // remove input name array signs

				inputValue = $input.attr('value') || '',

				type = $input.attr('type'),

				cat = ( type == 'checkbox' ) ? switcherP.checkboxs : switcherP.radios ,

				data = { components: {}, '$input': $input };

			data.$switcher = templates.$switcher.clone().attr( { 'input-name': inputName, 'input-value': inputValue, 'input-type': type } );

			if( switcherP.cssValues.dir == 'rtl' )	data.$switcher.addClass( 'rtl' );
			
			data.components.$toggler = templates.$toggler.clone();
			
			data.components.$on = templates.$on.clone().html( $input.attr('data-ontext') || options.onText );
			data.components.$off = templates.$off.clone().html( $input.attr('data-offtext') || options.offText );
			data.components.$blob = templates.$blob.clone();

			
			// Build switch according to direction order
			if( options.reverse )
				data.components.$toggler.append( data.components.$off, data.components.$blob, data.components.$on )
				.appendTo( data.$switcher );
				
			else
				data.components.$toggler.append( data.components.$on, data.components.$blob, data.components.$off )
				.appendTo( data.$switcher );
				
			
			// Insert to DOM
			$input.before( data.$switcher );						

			// Set On Off Style
			if( $input[ 0 ].checked )
			{
				data.switcherChecked = true;
												//|-> outside change
												//|	  //|-> style only
												//|   //|
				this.turnOn( data, switcherP, false, true );
			}
			else
			{
				data.switcherChecked = false;
				this.turnOff( data, switcherP, false, true );
			}

			// Set Disabled Style
			inputDisabled = $input[ 0 ].disabled;
			
			if( inputDisabled )
			{
				data.switcherDisabled = true;
				data.$switcher.addClass( 'disabled' ).attr( 'title', 'switch is disabled!' );
			}
			else
			{
				data.switcherDisabled = false;
			}
			

			// Use family to be aliase for current radio name family
			// all radios with the same name has the same family
			
			// Check if family already exists
			if( family = cat.group[ inputName ] )
			{
				family.group[ inputValue ] = data;

				// update length.
				// represents how many input for the same radio name
				family.length++;
			}
			else
			{
				// create new family with radio name
				cat.group[ inputName ] = family = { group: {}, length: 1 }//, enabled: 0, disabled: 0, switchable: false };
				
				family.group[ inputValue ] = data;

				// Update groupLength property
				cat.groupLength++;

				// add radio specific properties
				if( type == 'radio' )
				{
					family.enabled = 0;
					family.disabled = 0;
					family.switchable = false;
				}

			}
			
			// Specifiuc radio properties
			if( type == 'radio' )
			{
				// Status
				if( inputDisabled )
					family.disabled++;
				else
					family.enabled++;

				// set current checked radio input
				if( $input[ 0 ].checked )
					family.checkedKey = inputValue;

				// Set switchable property
				family.switchable = ( family.enabled >= 2 ) ? true : false;
			}
			
			// Add to switchers collections
			switcherP.$switchers = switcherP.$switchers.add( data.$switcher );

			// Update input type length
			cat.length++;

			// show
			data.$switcher.show();

			
			// attach Outside Change Event
			$input.on( 'change', function(e)
			{
				this.trackChanges({
					type: type,
					name: inputName,
					value: inputValue,
				}, switcherP );

			}.bind(this));

		},

		/**
		 * set plugin templates according to current set options
		 *
		 * @param  {Object} options   switcher plugin options object
		 * @param  {Object} switcherP switcher plugin properties
		 * @return void
		 */
		setTemplateStyle: function( options, switcherP ){

			// Switcher
			templates.$switcher.css( { 'width': [ options.width, 'px' ].join(''), 'line-height': [ options.height, 'px' ].join('') } )
			.removeClass( templates.themes.join(' ') ).addClass( options.theme );
			
			switcherP.cssValues.switcherWidth = options.width;
			switcherP.cssValues.switcherHeight = options.height;
			
			// Blob
			switcherP.cssValues.blobOffset = options.blobOffset;
			switcherP.cssValues.blobWidth = switcherP.cssValues.blobHeight = switcherP.cssValues.switcherHeight - options.blobOffset * 2;

			templates.$blob.css( { 'width': switcherP.cssValues.blobWidth, 'height': switcherP.cssValues.blobHeight } );


				// Set Transform Property EX, translateX( 10px )
				if( options.reverse )
				{
					switcherP.transformOff = ['translateX(', switcherP.transformDir , switcherP.cssValues.blobWidth / 2 + switcherP.cssValues.blobOffset, 'px)' ].join('');
				
					switcherP.transformOn = ['translateX(', switcherP.transformDir , switcherP.cssValues.switcherWidth - switcherP.cssValues.blobWidth / 2 - switcherP.cssValues.blobOffset, 'px)' ].join('');

				}
				else
				{
					switcherP.transformOn = ['translateX(', switcherP.transformDir , switcherP.cssValues.blobWidth / 2 + switcherP.cssValues.blobOffset, 'px)' ].join('');
				
					switcherP.transformOff = ['translateX(', switcherP.transformDir , switcherP.cssValues.switcherWidth - switcherP.cssValues.blobWidth / 2 - switcherP.cssValues.blobOffset, 'px)' ].join('');

				}

				switcherP.transformOn = {
					'-webkit-transform': switcherP.transformOn,
					'-moz-transform': switcherP.transformOn,
					'-o-transform': switcherP.transformOn,
					'-ms-transform': switcherP.transformOn,
					'transform': switcherP.transformOn
				}

				switcherP.transformOff = {
					'-webkit-transform': switcherP.transformOff,
					'-moz-transform': switcherP.transformOff,
					'-o-transform': switcherP.transformOff,
					'-ms-transform': switcherP.transformOff,
					'transform': switcherP.transformOff
				}

			// console.log( switcherP.transformOn )
			
			// Remove any applied font-size from previous initializaing
			templates.$toggler.css( 'font-size', '' );

			//  Automatic fit font size in low heights or on autoFontSize
			if( options.height < 20 || options.autoFontSize )	templates.$toggler.css( { 'font-size': [ options.height / 2, 'px' ].join('') } );

			// console.log( 'calculated once' )
			
			
			// Auto Stick
			templates.$switcher.css( 'margin', '' );

			if( options.autoStick )
			{
				var $fInput = switcherP.$this.first(),
					$label = $fInput.prev('label'),
					parentAW;
					

				if( $label )
				{
					parentAW = $fInput.parent().width();

					// subtract input width if visible
					parentAW -= ( options.inputs ) ? $fInput.outerWidth( true ) : 0;

					// subtract label width
					parentAW -= $label.outerWidth( true );

					// subtract switch width
					var margin = parentAW - options.width;

					// remove border width if exists
					margin -= ( options.theme == 'dark' ) ? 0 : 2;

					// Left OR Right margin
					if( switcherP.cssValues.dir == 'rtl' )
						
						templates.$switcher.css( 'margin-right', margin );
					else

						templates.$switcher.css( 'margin-left', margin );

				}

			}

		},


		/**
		 * Toggle switch status
		 * 
		 * @param  {Object}  info       	switcher information object
		 * @param  {Object}  switcherP 		switcher plugin properties
		 * @param  {Boolean} outsideChange 	if toggle according to outside check change or not
		 * @return void
		 */
		toggle: function( info, switcherP, outsideChange ){

			// Aliases
			var family, data;

			if( info.type == 'checkbox' )
			{
				// Checkbox
				family = switcherP.checkboxs.group[ info.name ];

				data = family.group[ info.value ];

				if( !data.$input[ 0 ].disabled )
				{
					// console.log( 'clicked checkbox' )
					if( outsideChange )
						status = data.$input[ 0 ].checked  ? 'turnOn' : 'turnOff';
					else
						status = data.$input[ 0 ].checked  ? 'turnOff' : 'turnOn';

					this[ status ]( data, switcherP, outsideChange );	
				}
			}
			else
			{
				// Radio
				family = switcherP.radios.group[ info.name ];

				// console.log( family );
				data = family.group[ info.value ] ;

				if( outsideChange && data.$input[0].checked == data.switcherChecked )
					return;
				// console.log( data );

				// if Outside request is to turnoff ( uncheck ), then don't do any thing and recheck radio
				if( outsideChange && !data.$input[ 0 ].checked )
				{
					// canot disable
					console.log( 'can not disable radio button, try to activate another sibiling one to deactivate current.' );

					data.$input.prop( 'checked', true );

					return;
				}

				if( !data.$input[ 0 ].disabled && family.switchable )
				{
					// change only if it is not currently selected
					if( family.checkedKey != info.name )
					{
						// turnon			
						this.turnOff( family.group[ family.checkedKey ], switcherP, outsideChange );

						this.turnOn( data, switcherP, outsideChange );

						family.checkedKey = info.value;
					}
				}
			}

		},

		/**
		 * Track Input Changes
		 *
		 * This Method Will Check And Apply Any Changes Happens To Original Input
		 * Those Changes Are Checked And Disabled Status
		 *
		 * This Method Also Handles Disabled Changes Mechanism
		 *
		 * Fires : enable.rcSwitcher AND disable.rcSwitcher according To Change Status
		 * 
		 * @param  {Object Literal} info      Input Name, Value, Type
		 * @param  {Switcher Properties Object} switcherP All Switchers Properties Object
		 * @return {undefined}           Doesnot Return Any Thing
		 */
		trackChanges: function( info, switcherP )
		{
			// On Input Change Event
			var family, data;
			
			if( info.type == 'checkbox' )
				family = switcherP.checkboxs.group[ info.name ];
			else
				family = switcherP.radios.group[ info.name ];

			data = family.group[ info.value ];

			// Track Checked Status Changes
			if( data.$input[0].checked != data.switcherChecked )
			{
				if( data.switcherDisabled )
				{
					// Revert Changes
					data.$input.prop( 'checked', data.switcherChecked );
					
					if( info.type == 'radio' )
						family.group[ family.checkedKey ].$input.prop( 'checked', true );
				}
				else
					this.toggle( info, switcherP, true );
			}

			// Track Disabled Status Changes	
			if( data.$input[0].disabled != data.switcherDisabled )
			{
				if( data.$input[0].disabled )
				{
					if( !data.$switcher.hasClass( 'disabled' ) )
						data.$switcher.addClass( 'disabled' );

					if( info.type == 'radio'  )
					{
						family.disabled++;
						family.enabled--;
						// If Checked, Disable All Group
						if( data.$input[0].checked == true )
							family.switchable = false;

						// console.log( family );
					}

					data.switcherDisabled = true;

					// Fire Event and pass data object to event handler
					data.$input.trigger( 'disable.rcSwitcher', data );
				}
				else
				{
					data.$switcher.removeClass( 'disabled' );
					
					data.$input.trigger( 'enable.rcSwitcher', data );

					if( info.type == 'radio'  )
					{
						--family.disabled;
						++family.enabled;
						// If Checked, Disable All Group
						if( family.enabled - family.disabled >= 2 )
							family.switchable = true;

						// console.log( family );
					}

					data.switcherDisabled = false;
				}
			}

		},

		
		/**
		 * Turn Off switch
		 *
		 * it also fire 'switcher.turnoff' custom event
		 * 
		 * @param  {Object} data      data object represents switch entry in switcher properties
		 * @param  {Object} switcherP switcher plugin properties
		 * @param  {Boolean} styleOnly turnoff style only
		 * @return void           
		 */
		turnOff: function( data, switcherP, outsideChange, styleOnly ){

			// console.log( 'calculated on eventOFF' )
			data.components.$toggler.css( switcherP.transformOff ).removeClass( 'on' ).addClass('off');

			data.switcherChecked = false;

			if( styleOnly ) return;
			
			// Set Input To Off
			if( !outsideChange )
				data.$input.prop( 'checked', false );

			// Fire Event and pass data object to event handler
			data.$input.trigger( 'turnoff.rcSwitcher', data );
			data.$input.trigger( 'toggle.rcSwitcher', [ data, 'turnoff' ] );

		},


		/**
		 * Turn On switch
		 *
		 * it also fire 'switcher.turnon' custom event
		 * 
		 * @param  {Object} data      data object represents switch entry in switcher properties
		 * @param  {Object} switcherP switcher plugin properties
		 * @param  {Boolean} styleOnly turnon style only
		 * @return void           
		 */
		turnOn: function( data, switcherP, outsideChange, styleOnly ){

			// console.log( 'calculated on eventOn' )
			
			data.components.$toggler.css( switcherP.transformOn ).addClass( 'on' ).removeClass('off');
			
			data.switcherChecked = true;

			if( styleOnly ) return;
			
			// Set To ON and trigger original change event
			// auto set checked property doesnot fire toggle event, so we need to trigger event manually
			if( !outsideChange )
				data.$input.prop( 'checked', true );

			data.$input.trigger( 'turnon.rcSwitcher', data );
			data.$input.trigger( 'toggle.rcSwitcher', [ data, 'turnon' ] );

		},



		/**
		 * Set Switcher Plugin Events
		 * 
		 * @param  {Object} switcherP plugin properties
		 * @return void           
		 */
		behaviour: function( switcherP ){
		// behaviour: function( switcherP, $switcher ){

			// Disable click for input
			switcherP.$this.on( 'click', function( e )
			{
				e.preventDefault();
				e.stopPropagation();				
			}.bind( this ) );


			// On Click on switchers
			switcherP.$switchers.on( 'click', function( e ){
			// $switcher.on( 'click', function( e ){

				// console.log( e.currentTarget );
				var obj = {};

				obj.type = e.currentTarget.getAttribute( 'input-type' );
				obj.name = e.currentTarget.getAttribute( 'input-name' );
				obj.value = e.currentTarget.getAttribute( 'input-value' );

				// obj.type = $switcher.attr( 'input-type' );
				// obj.name = $switcher.attr( 'input-name' );
				// obj.value = $switcher.attr( 'input-value' );

				// Toggle
				this.toggle( obj, switcherP );

				e.preventDefault();
				e.stopPropagation();

			}.bind( this ) );

		},

	};

	
	
	
	
	/**
	 * SWITCHER PLUGIN
	 * @param  {Object} options switcher options
	 * @return {jQ Obj}         this
	 */
	$.fn.rcSwitcher = function( options ){


		// Defining Properties
		var switcherP = {

			checkboxs: {
				group:{},
				groupLength: 0,
				length: 0,
			},

			radios: {
				group:{},
				groupLength: 0,
				length: 0,
			},

			// $this: this,
			$switchers: $([]),
			cssValues:{},

		};


		// Filter this
		// Get Only Checkbox and Radio inputs only

		switcherP.$this = this.filter( 'input[type=checkbox], input[type=radio]' );

		// Stop if we havenot any checkboxs or radios
		if( switcherP.$this.length == 0 )
			return;

		switcherP.cssValues.dir = window.getComputedStyle( switcherP.$this[0], null ).direction || 'ltr';

		// Detect Transform direction
		switcherP.transformDir = ( switcherP.cssValues.dir == 'rtl' ) ? '' : '-';
		

		// Set Options
		options = $.extend(
			{
				onText: 'ON',
				offText: 'OFF',
				reverse: false,
				inputs: false,

				width: 56,
				height: 20,
				blobOffset: 1,

				autoFontSize: false,

				theme: 'light',

				autoStick: false,
			},
			options || {} );



		// Hide Them ( selected inputs ) All
		if( !options.inputs )  switcherP.$this.css( 'display', 'none' );

		// Make Sure that Theme is Supported
		if( templates.themes.indexOf( options.theme ) == -1 ) options.theme = 'light';
		
		
		// Start
		switcherM.start( switcherP, options );

		
		// Return selected jquery object to allow chaining
		return this;

	};


})(jQuery);

// الحمد لله