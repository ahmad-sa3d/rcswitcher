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
 * @version 	2.1.0
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
		start: function( switcherP, options ){
			
			
			// Set Templates and one runtime calculations
			this.setTemplateStyle( options, switcherP );
			
			
			// prepare and create switches
			switcherP.$this.each( function( i, input ){

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
		makeSwitcher: function( $input, switcherP, options ){

			// console.log( $input.attr('name') )
			

			var inputName = $input.attr( 'name' ).replace( /(\[\])+$/, '' ); // remove input name array signs

			var inputValue = $input.attr('value');

			var type = $input.attr('type');

			var cat = ( type == 'checkbox' ) ? switcherP.checkboxs : switcherP.radios ;

			
			var data = { components: {}, $input: $input };

			data.$switcher = templates.$switcher.clone().attr( { 'input-name': inputName, 'input-value': $input.attr( 'value' ), 'input-type': type } );

			if( switcherP.cssValues.dir == 'rtl' )	data.$switcher.addClass( 'rtl' );
			
			data.components.$toggler = templates.$toggler.clone();
			
			data.components.$on = templates.$on.clone().html( $input.attr('data-ontext') || options.onText );
			data.components.$off = templates.$off.clone().html( $input.attr('data-offtext') || options.offText );
			data.components.$blob = templates.$blob.clone();

			
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
			
				this.turnOn( data, switcherP, true );
			else
			
				this.turnOff( data, switcherP, true );


			// Set Disabled Style
			if( $input.prop( 'disabled' ) )  data.$switcher.addClass( 'disabled' ).attr( 'title', 'switch is disabled!' );
		

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
				if( $input[ 0 ].disabled )

					family.disabled++;
				else

					family.enabled++;


				
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
		 * @param  {Object} info       switcher information object
		 * @param  {Object} switcherP switcher plugin properties
		 * @return void
		 */
		toggle: function( info, switcherP ){

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
					
					if( data.$input[ 0 ].checked )
						// Turn Off
						this.turnOff( data, switcherP );
					
					else					
						// Turn On
						this.turnOn( data, switcherP );
					
				}

			}
			else
			{
				// Radio
				family = switcherP.radios.group[ info.name ];

				// console.log( family );

				data = family.group[ info.value] ;

				if( !data.$input[ 0 ].disabled && family.switchable && !data.$input[ 0 ].checked )
				{
					// console.log( 'clicked radio' )
										
					this.turnOff( family.group[ family.checkedKey ], switcherP );

					this.turnOn( data, switcherP );

					family.checkedKey = info.value;

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
		turnOff: function( data, switcherP, styleOnly ){

			// console.log( 'calculated on eventOFF' )
			data.components.$toggler.css( switcherP.transformOff ).removeClass( 'on' ).addClass('off');

			if( styleOnly ) return;
			
			// Set Input To Off
			data.$input.prop( 'checked', false );

			// Fire Event and pass data object to event handler
			data.$input.trigger( 'turnoff.rcSwitcher', data );
			data.$input.trigger( 'change.rcSwitcher', data, 'turnoff' );



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
		turnOn: function( data, switcherP, styleOnly ){

			// console.log( 'calculated on eventOn' )
			
			data.components.$toggler.css( switcherP.transformOn ).addClass( 'on' ).removeClass('off');

			if( styleOnly ) return;
			
			// Set To ON
			data.$input.prop( 'checked', true );

			// Fire Event and pass data object to event handler
			data.$input.trigger( 'turnon.rcSwitcher', data );
			data.$input.trigger( 'change.rcSwitcher', data, 'turnon' );


		},



		/**
		 * Set Switcher Plugin Events
		 * 
		 * @param  {Object} switcherP plugin properties
		 * @return void           
		 */
		behaviour: function( switcherP ){

			// Disable click for input

			// console.log( 'behaviour' );
			
			switcherP.$this.on( 'click', function( e ){

				e.preventDefault();
				e.stopPropagation();				

			}.bind( this ) );



			// On Click on switchers
			
			switcherP.$switchers.on( 'click', function( e ){

				// console.log( e.currentTarget );
				var obj = {};

				obj.type = e.currentTarget.getAttribute( 'input-type' );
				obj.name = e.currentTarget.getAttribute( 'input-name' );
				obj.value = e.currentTarget.getAttribute( 'input-value' );

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