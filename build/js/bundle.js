(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jqueryCustom = require('./src/jquery.custom.js');
var jquery = require('./src/jquery.js');
var jqueryMouseWheel = require('./src/jquery.mousewheel.js');
var modenizrCustom = require('./src/modernizr.custom.js');
var parallax = require('./src/parallax.js');
var sample = require('./src/sample.js');

},{"./src/jquery.custom.js":2,"./src/jquery.js":3,"./src/jquery.mousewheel.js":4,"./src/modernizr.custom.js":5,"./src/parallax.js":6,"./src/sample.js":7}],2:[function(require,module,exports){
/*! jQuery UI - v1.9.1 - 2012-11-15
* http://jqueryui.com
* Includes: jquery.ui.effect.js
* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */

;(jQuery.effects || (function($, undefined) {

var backCompat = $.uiBackCompat !== false,
	// prefix used for storing data on .data()
	dataSpace = "ui-effects-";

$.effects = {
	effect: {}
};

/*!
 * jQuery Color Animations v2.0.0
 * http://jquery.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Mon Aug 13 13:41:02 2012 -0500
 */
(function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),

	// plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
	// a set of RE's that can match strings and generate color tuples.
	stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		}],

	// jQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// colors = jQuery.Color.names
	colors,

	// local aliases of functions called often
	each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
});

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return (allowEmpty || !prop.def) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {
		// we add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return (value + type.mod) % type.mod;
	}

	// for now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// if this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// exit each( stringParsers ) here because we matched
			return false;
		}
	});

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// if this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// more than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			});
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				});
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// if the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// if the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// this is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					});

					// everything defined but alpha?
					if ( inst[ cache ] && $.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
						// use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				});
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if (isCache) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				});
			}
			return same;
		});
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		});
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// if null, don't override start value
			if ( endValue === null ) {
				return;
			}
			// if null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		});
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {
		// if we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		}));
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			});

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		}).join("");
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + (q - p) * h * 6;
	}
	if ( h * 2 < 1) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function ( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	if ( l === 0 || l === 1 ) {
		s = l;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};


each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		});

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {
		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	});
});

// add .fx.step functions
each( stepHooks, function( i, hook ) {
	jQuery.cssHooks[ hook ] = {
		set: function( elem, value ) {
			var parsed, curElem,
				backgroundColor = "";

			if ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) {
				value = color( parsed || value );
				if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
					curElem = hook === "backgroundColor" ? elem.parentNode : elem;
					while (
						(backgroundColor === "" || backgroundColor === "transparent") &&
						curElem && curElem.style
					) {
						try {
							backgroundColor = jQuery.css( curElem, "backgroundColor" );
							curElem = curElem.parentNode;
						} catch ( e ) {
						}
					}

					value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
						backgroundColor :
						"_default" );
				}

				value = value.toRgbaString();
			}
			try {
				elem.style[ hook ] = value;
			} catch( error ) {
				// wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
			}
		}
	};
	jQuery.fx.step[ hook ] = function( fx ) {
		if ( !fx.colorInit ) {
			fx.start = color( fx.elem, hook );
			fx.end = color( fx.end );
			fx.colorInit = true;
		}
		jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
	};
});

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		});
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

})( jQuery );



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
(function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

$.each([ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ], function( _, prop ) {
	$.fx.step[ prop ] = function( fx ) {
		if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
			jQuery.style( fx.elem, prop, fx.end );
			fx.setAttr = true;
		}
	};
});

function getElementStyles() {
	var style = this.ownerDocument.defaultView ?
			this.ownerDocument.defaultView.getComputedStyle( this, null ) :
			this.currentStyle,
		newStyle = {},
		key,
		len;

	// webkit enumerates style porperties
	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				newStyle[ $.camelCase( key ) ] = style[ key ];
			}
		}
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				newStyle[ key ] = style[ key ];
			}
		}
	}

	return newStyle;
}


function styleDifference( oldStyle, newStyle ) {
	var diff = {},
		name, value;

	for ( name in newStyle ) {
		value = newStyle[ name ];
		if ( oldStyle[ name ] !== value ) {
			if ( !shorthandStyles[ name ] ) {
				if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

$.effects.animateClass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseClass = animated.attr( "class" ) || "",
			applyClassChange,
			allAnimations = o.children ? animated.find( "*" ).andSelf() : animated;

		// map the animated objects to store the original styles.
		allAnimations = allAnimations.map(function() {
			var el = $( this );
			return {
				el: el,
				start: getElementStyles.call( this )
			};
		});

		// apply class change
		applyClassChange = function() {
			$.each( classAnimationActions, function(i, action) {
				if ( value[ action ] ) {
					animated[ action + "Class" ]( value[ action ] );
				}
			});
		};
		applyClassChange();

		// map all animated objects again - calculate new styles and diff
		allAnimations = allAnimations.map(function() {
			this.end = getElementStyles.call( this.el[ 0 ] );
			this.diff = styleDifference( this.start, this.end );
			return this;
		});

		// apply original class
		animated.attr( "class", baseClass );

		// map all animated objects again - this time collecting a promise
		allAnimations = allAnimations.map(function() {
			var styleInfo = this,
				dfd = $.Deferred(),
				opts = jQuery.extend({}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleInfo );
					}
				});

			this.el.animate( this.diff, opts );
			return dfd.promise();
		});

		// once all animations have completed:
		$.when.apply( $, allAnimations.get() ).done(function() {

			// set the final class
			applyClassChange();

			// for each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function(key) {
					el.css( key, '' );
				});
			});

			// this is guarnteed to be there if you use jQuery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ add: classNames }, speed, easing, callback ) :
			this._addClass( classNames );
	},

	_removeClass: $.fn.removeClass,
	removeClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ remove: classNames }, speed, easing, callback ) :
			this._removeClass( classNames );
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function( classNames, force, speed, easing, callback ) {
		if ( typeof force === "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter
				return this._toggleClass( classNames, force );
			} else {
				return $.effects.animateClass.call( this,
					(force ? { add: classNames } : { remove: classNames }),
					speed, easing, callback );
			}
		} else {
			// without force parameter
			return $.effects.animateClass.call( this,
				{ toggle: classNames }, force, speed, easing );
		}
	},

	switchClass: function( remove, add, speed, easing, callback) {
		return $.effects.animateClass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
});

})();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

(function() {

$.extend( $.effects, {
	version: "1.9.1",

	// Saves a set of properties in a data storage
	save: function( element, set ) {
		for( var i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
			}
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function( element, set ) {
		var val, i;
		for( i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				val = element.data( dataSpace + set[ i ] );
				// support: jQuery 1.6.2
				// http://bugs.jquery.com/ticket/9917
				// jQuery 1.6.2 incorrectly returns undefined for any falsy value.
				// We can't differentiate between "" and 0 here, so we just assume
				// empty string since it's likely to be a more common value...
				if ( val === undefined ) {
					val = "";
				}
				element.css( set[ i ], val );
			}
		}
	},

	setMode: function( el, mode ) {
		if (mode === "toggle") {
			mode = el.is( ":hidden" ) ? "show" : "hide";
		}
		return mode;
	},

	// Translates a [top,left] array into a baseline value
	// this should be a little more flexible in the future to handle a string & hash
	getBaseline: function( origin, original ) {
		var y, x;
		switch ( origin[ 0 ] ) {
			case "top": y = 0; break;
			case "middle": y = 0.5; break;
			case "bottom": y = 1; break;
			default: y = origin[ 0 ] / original.height;
		}
		switch ( origin[ 1 ] ) {
			case "left": x = 0; break;
			case "center": x = 0.5; break;
			case "right": x = 1; break;
			default: x = origin[ 1 ] / original.width;
		}
		return {
			x: x,
			y: y
		};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function( element ) {

		// if the element is already wrapped, return it
		if ( element.parent().is( ".ui-effects-wrapper" )) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				"float": element.css( "float" )
			},
			wrapper = $( "<div></div>" )
				.addClass( "ui-effects-wrapper" )
				.css({
					fontSize: "100%",
					background: "transparent",
					border: "none",
					margin: 0,
					padding: 0
				}),
			// Store the size in case width/height are defined in % - Fixes #5245
			size = {
				width: element.width(),
				height: element.height()
			},
			active = document.activeElement;

		// support: Firefox
		// Firefox incorrectly exposes anonymous content
		// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
		try {
			active.id;
		} catch( e ) {
			active = document.body;
		}

		element.wrap( wrapper );

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}

		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually lose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if ( element.css( "position" ) === "static" ) {
			wrapper.css({ position: "relative" });
			element.css({ position: "relative" });
		} else {
			$.extend( props, {
				position: element.css( "position" ),
				zIndex: element.css( "z-index" )
			});
			$.each([ "top", "left", "bottom", "right" ], function(i, pos) {
				props[ pos ] = element.css( pos );
				if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
					props[ pos ] = "auto";
				}
			});
			element.css({
				position: "relative",
				top: 0,
				left: 0,
				right: "auto",
				bottom: "auto"
			});
		}
		element.css(size);

		return wrapper.css( props ).show();
	},

	removeWrapper: function( element ) {
		var active = document.activeElement;

		if ( element.parent().is( ".ui-effects-wrapper" ) ) {
			element.parent().replaceWith( element );

			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
		}


		return element;
	},

	setTransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssUnit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		});
		return value;
	}
});

// return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

	// allow passing all options as the first parameter
	if ( $.isPlainObject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// convert to an object
	effect = { effect: effect };

	// catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// catch (effect, callback)
	if ( $.isFunction( options ) ) {
		callback = options;
		speed = null;
		options = {};
	}

	// catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// catch (effect, options, callback)
	if ( $.isFunction( speed ) ) {
		callback = speed;
		speed = null;
	}

	// add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}

	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects.effect[ speed ] ) {
		// TODO: remove in 2.0 (#7115)
		if ( backCompat && $.effects[ speed ] ) {
			return false;
		}
		return true;
	}

	return false;
}

$.fn.extend({
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizeArguments.apply( this, arguments ),
			mode = args.mode,
			queue = args.queue,
			effectMethod = $.effects.effect[ args.effect ],

			// DEPRECATED: remove in 2.0 (#7115)
			oldEffectMethod = !effectMethod && backCompat && $.effects[ args.effect ];

		if ( $.fx.off || !( effectMethod || oldEffectMethod ) ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, args.complete );
			} else {
				return this.each( function() {
					if ( args.complete ) {
						args.complete.call( this );
					}
				});
			}
		}

		function run( next ) {
			var elem = $( this ),
				complete = args.complete,
				mode = args.mode;

			function done() {
				if ( $.isFunction( complete ) ) {
					complete.call( elem[0] );
				}
				if ( $.isFunction( next ) ) {
					next();
				}
			}

			// if the element is hiddden and mode is hide,
			// or element is visible and mode is show
			if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {
				done();
			} else {
				effectMethod.call( elem[0], args, done );
			}
		}

		// TODO: remove this check in 2.0, effectMethod will always be true
		if ( effectMethod ) {
			return queue === false ? this.each( run ) : this.queue( queue || "fx", run );
		} else {
			// DEPRECATED: remove in 2.0 (#7115)
			return oldEffectMethod.call(this, {
				options: args,
				duration: args.duration,
				callback: args.complete,
				mode: args.mode
			});
		}
	},

	_show: $.fn.show,
	show: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "show";
			return this.effect.call( this, args );
		}
	},

	_hide: $.fn.hide,
	hide: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "hide";
			return this.effect.call( this, args );
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function( speed ) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "toggle";
			return this.effect.call( this, args );
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexOf( unit ) > 0 ) {
				val = [ parseFloat( style ), unit ];
			}
		});
		return val;
	}
});

})();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

(function() {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
	baseEasings[ name ] = function( p ) {
		return Math.pow( p, i + 2 );
	};
});

$.extend( baseEasings, {
	Sine: function ( p ) {
		return 1 - Math.cos( p * Math.PI / 2 );
	},
	Circ: function ( p ) {
		return 1 - Math.sqrt( 1 - p * p );
	},
	Elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
	},
	Back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	Bounce: function ( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
});

$.each( baseEasings, function( name, easeIn ) {
	$.easing[ "easeIn" + name ] = easeIn;
	$.easing[ "easeOut" + name ] = function( p ) {
		return 1 - easeIn( 1 - p );
	};
	$.easing[ "easeInOut" + name ] = function( p ) {
		return p < 0.5 ?
			easeIn( p * 2 ) / 2 :
			1 - easeIn( p * -2 + 2 ) / 2;
	};
});

})();

})(jQuery));

},{}],3:[function(require,module,exports){
/*! jQuery v@1.8.0 jquery.com | jquery.org/license */
(function(a,b){function G(a){var b=F[a]={};return p.each(a.split(s),function(a,c){b[c]=!0}),b}function J(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(I,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:+d+""===d?+d:H.test(d)?p.parseJSON(d):d}catch(f){}p.data(a,c,d)}else d=b}return d}function K(a){var b;for(b in a){if(b==="data"&&p.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function ba(){return!1}function bb(){return!0}function bh(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function bi(a,b){do a=a[b];while(a&&a.nodeType!==1);return a}function bj(a,b,c){b=b||0;if(p.isFunction(b))return p.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return p.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=p.grep(a,function(a){return a.nodeType===1});if(be.test(b))return p.filter(b,d,!c);b=p.filter(b,d)}return p.grep(a,function(a,d){return p.inArray(a,b)>=0===c})}function bk(a){var b=bl.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function bC(a,b){return a.getElementsByTagName(b)[0]||a.appendChild(a.ownerDocument.createElement(b))}function bD(a,b){if(b.nodeType!==1||!p.hasData(a))return;var c,d,e,f=p._data(a),g=p._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;d<e;d++)p.event.add(b,c,h[c][d])}g.data&&(g.data=p.extend({},g.data))}function bE(a,b){var c;if(b.nodeType!==1)return;b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?(b.parentNode&&(b.outerHTML=a.outerHTML),p.support.html5Clone&&a.innerHTML&&!p.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):c==="input"&&bv.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text),b.removeAttribute(p.expando)}function bF(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bG(a){bv.test(a.type)&&(a.defaultChecked=a.checked)}function bX(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=bV.length;while(e--){b=bV[e]+c;if(b in a)return b}return d}function bY(a,b){return a=b||a,p.css(a,"display")==="none"||!p.contains(a.ownerDocument,a)}function bZ(a,b){var c,d,e=[],f=0,g=a.length;for(;f<g;f++){c=a[f];if(!c.style)continue;e[f]=p._data(c,"olddisplay"),b?(!e[f]&&c.style.display==="none"&&(c.style.display=""),c.style.display===""&&bY(c)&&(e[f]=p._data(c,"olddisplay",cb(c.nodeName)))):(d=bH(c,"display"),!e[f]&&d!=="none"&&p._data(c,"olddisplay",d))}for(f=0;f<g;f++){c=a[f];if(!c.style)continue;if(!b||c.style.display==="none"||c.style.display==="")c.style.display=b?e[f]||"":"none"}return a}function b$(a,b,c){var d=bO.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function b_(a,b,c,d){var e=c===(d?"border":"content")?4:b==="width"?1:0,f=0;for(;e<4;e+=2)c==="margin"&&(f+=p.css(a,c+bU[e],!0)),d?(c==="content"&&(f-=parseFloat(bH(a,"padding"+bU[e]))||0),c!=="margin"&&(f-=parseFloat(bH(a,"border"+bU[e]+"Width"))||0)):(f+=parseFloat(bH(a,"padding"+bU[e]))||0,c!=="padding"&&(f+=parseFloat(bH(a,"border"+bU[e]+"Width"))||0));return f}function ca(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=!0,f=p.support.boxSizing&&p.css(a,"boxSizing")==="border-box";if(d<=0){d=bH(a,b);if(d<0||d==null)d=a.style[b];if(bP.test(d))return d;e=f&&(p.support.boxSizingReliable||d===a.style[b]),d=parseFloat(d)||0}return d+b_(a,b,c||(f?"border":"content"),e)+"px"}function cb(a){if(bR[a])return bR[a];var b=p("<"+a+">").appendTo(e.body),c=b.css("display");b.remove();if(c==="none"||c===""){bI=e.body.appendChild(bI||p.extend(e.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!bJ||!bI.createElement)bJ=(bI.contentWindow||bI.contentDocument).document,bJ.write("<!doctype html><html><body>"),bJ.close();b=bJ.body.appendChild(bJ.createElement(a)),c=bH(b,"display"),e.body.removeChild(bI)}return bR[a]=c,c}function ch(a,b,c,d){var e;if(p.isArray(b))p.each(b,function(b,e){c||cd.test(a)?d(a,e):ch(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&p.type(b)==="object")for(e in b)ch(a+"["+e+"]",b[e],c,d);else d(a,b)}function cy(a){return function(b,c){typeof b!="string"&&(c=b,b="*");var d,e,f,g=b.toLowerCase().split(s),h=0,i=g.length;if(p.isFunction(c))for(;h<i;h++)d=g[h],f=/^\+/.test(d),f&&(d=d.substr(1)||"*"),e=a[d]=a[d]||[],e[f?"unshift":"push"](c)}}function cz(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h,i=a[f],j=0,k=i?i.length:0,l=a===cu;for(;j<k&&(l||!h);j++)h=i[j](c,d,e),typeof h=="string"&&(!l||g[h]?h=b:(c.dataTypes.unshift(h),h=cz(a,c,d,e,h,g)));return(l||!h)&&!g["*"]&&(h=cz(a,c,d,e,"*",g)),h}function cA(a,c){var d,e,f=p.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((f[d]?a:e||(e={}))[d]=c[d]);e&&p.extend(!0,a,e)}function cB(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(f in k)f in d&&(c[k[f]]=d[f]);while(j[0]==="*")j.shift(),e===b&&(e=a.mimeType||c.getResponseHeader("content-type"));if(e)for(f in i)if(i[f]&&i[f].test(e)){j.unshift(f);break}if(j[0]in d)g=j[0];else{for(f in d){if(!j[0]||a.converters[f+" "+j[0]]){g=f;break}h||(h=f)}g=g||h}if(g)return g!==j[0]&&j.unshift(g),d[g]}function cC(a,b){var c,d,e,f,g=a.dataTypes.slice(),h=g[0],i={},j=0;a.dataFilter&&(b=a.dataFilter(b,a.dataType));if(g[1])for(c in a.converters)i[c.toLowerCase()]=a.converters[c];for(;e=g[++j];)if(e!=="*"){if(h!=="*"&&h!==e){c=i[h+" "+e]||i["* "+e];if(!c)for(d in i){f=d.split(" ");if(f[1]===e){c=i[h+" "+f[0]]||i["* "+f[0]];if(c){c===!0?c=i[d]:i[d]!==!0&&(e=f[0],g.splice(j--,0,e));break}}}if(c!==!0)if(c&&a["throws"])b=c(b);else try{b=c(b)}catch(k){return{state:"parsererror",error:c?k:"No conversion from "+h+" to "+e}}}h=e}return{state:"success",data:b}}function cK(){try{return new a.XMLHttpRequest}catch(b){}}function cL(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function cT(){return setTimeout(function(){cM=b},0),cM=p.now()}function cU(a,b){p.each(b,function(b,c){var d=(cS[b]||[]).concat(cS["*"]),e=0,f=d.length;for(;e<f;e++)if(d[e].call(a,b,c))return})}function cV(a,b,c){var d,e=0,f=0,g=cR.length,h=p.Deferred().always(function(){delete i.elem}),i=function(){var b=cM||cT(),c=Math.max(0,j.startTime+j.duration-b),d=1-(c/j.duration||0),e=0,f=j.tweens.length;for(;e<f;e++)j.tweens[e].run(d);return h.notifyWith(a,[j,d,c]),d<1&&f?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:p.extend({},b),opts:p.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:cM||cT(),duration:c.duration,tweens:[],createTween:function(b,c,d){var e=p.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(e),e},stop:function(b){var c=0,d=b?j.tweens.length:0;for(;c<d;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;cW(k,j.opts.specialEasing);for(;e<g;e++){d=cR[e].call(j,a,k,j.opts);if(d)return d}return cU(j,k),p.isFunction(j.opts.start)&&j.opts.start.call(a,j),p.fx.timer(p.extend(i,{anim:j,queue:j.opts.queue,elem:a})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function cW(a,b){var c,d,e,f,g;for(c in a){d=p.camelCase(c),e=b[d],f=a[c],p.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=p.cssHooks[d];if(g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}}function cX(a,b,c){var d,e,f,g,h,i,j,k,l=this,m=a.style,n={},o=[],q=a.nodeType&&bY(a);c.queue||(j=p._queueHooks(a,"fx"),j.unqueued==null&&(j.unqueued=0,k=j.empty.fire,j.empty.fire=function(){j.unqueued||k()}),j.unqueued++,l.always(function(){l.always(function(){j.unqueued--,p.queue(a,"fx").length||j.empty.fire()})})),a.nodeType===1&&("height"in b||"width"in b)&&(c.overflow=[m.overflow,m.overflowX,m.overflowY],p.css(a,"display")==="inline"&&p.css(a,"float")==="none"&&(!p.support.inlineBlockNeedsLayout||cb(a.nodeName)==="inline"?m.display="inline-block":m.zoom=1)),c.overflow&&(m.overflow="hidden",p.support.shrinkWrapBlocks||l.done(function(){m.overflow=c.overflow[0],m.overflowX=c.overflow[1],m.overflowY=c.overflow[2]}));for(d in b){f=b[d];if(cO.exec(f)){delete b[d];if(f===(q?"hide":"show"))continue;o.push(d)}}g=o.length;if(g){h=p._data(a,"fxshow")||p._data(a,"fxshow",{}),q?p(a).show():l.done(function(){p(a).hide()}),l.done(function(){var b;p.removeData(a,"fxshow",!0);for(b in n)p.style(a,b,n[b])});for(d=0;d<g;d++)e=o[d],i=l.createTween(e,q?h[e]:0),n[e]=h[e]||p.style(a,e),e in h||(h[e]=i.start,q&&(i.end=i.start,i.start=e==="width"||e==="height"?1:0))}}function cY(a,b,c,d,e){return new cY.prototype.init(a,b,c,d,e)}function cZ(a,b){var c,d={height:a},e=0;for(;e<4;e+=2-b)c=bU[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function c_(a){return p.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}var c,d,e=a.document,f=a.location,g=a.navigator,h=a.jQuery,i=a.$,j=Array.prototype.push,k=Array.prototype.slice,l=Array.prototype.indexOf,m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=String.prototype.trim,p=function(a,b){return new p.fn.init(a,b,c)},q=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,r=/\S/,s=/\s+/,t=r.test(" ")?/^[\s\xA0]+|[\s\xA0]+$/g:/^\s+|\s+$/g,u=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,y=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,z=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,A=/^-ms-/,B=/-([\da-z])/gi,C=function(a,b){return(b+"").toUpperCase()},D=function(){e.addEventListener?(e.removeEventListener("DOMContentLoaded",D,!1),p.ready()):e.readyState==="complete"&&(e.detachEvent("onreadystatechange",D),p.ready())},E={};p.fn=p.prototype={constructor:p,init:function(a,c,d){var f,g,h,i;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if(typeof a=="string"){a.charAt(0)==="<"&&a.charAt(a.length-1)===">"&&a.length>=3?f=[null,a,null]:f=u.exec(a);if(f&&(f[1]||!c)){if(f[1])return c=c instanceof p?c[0]:c,i=c&&c.nodeType?c.ownerDocument||c:e,a=p.parseHTML(f[1],i,!0),v.test(f[1])&&p.isPlainObject(c)&&this.attr.call(a,c,!0),p.merge(this,a);g=e.getElementById(f[2]);if(g&&g.parentNode){if(g.id!==f[2])return d.find(a);this.length=1,this[0]=g}return this.context=e,this.selector=a,this}return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a)}return p.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),p.makeArray(a,this))},selector:"",jquery:"1.8.0",length:0,size:function(){return this.length},toArray:function(){return k.call(this)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=p.merge(this.constructor(),a);return d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")"),d},each:function(a,b){return p.each(this,a,b)},ready:function(a){return p.ready.promise().done(a),this},eq:function(a){return a=+a,a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(k.apply(this,arguments),"slice",k.call(arguments).join(","))},map:function(a){return this.pushStack(p.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:j,sort:[].sort,splice:[].splice},p.fn.init.prototype=p.fn,p.extend=p.fn.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;typeof h=="boolean"&&(k=h,h=arguments[1]||{},i=2),typeof h!="object"&&!p.isFunction(h)&&(h={}),j===i&&(h=this,--i);for(;i<j;i++)if((a=arguments[i])!=null)for(c in a){d=h[c],e=a[c];if(h===e)continue;k&&e&&(p.isPlainObject(e)||(f=p.isArray(e)))?(f?(f=!1,g=d&&p.isArray(d)?d:[]):g=d&&p.isPlainObject(d)?d:{},h[c]=p.extend(k,g,e)):e!==b&&(h[c]=e)}return h},p.extend({noConflict:function(b){return a.$===p&&(a.$=i),b&&a.jQuery===p&&(a.jQuery=h),p},isReady:!1,readyWait:1,holdReady:function(a){a?p.readyWait++:p.ready(!0)},ready:function(a){if(a===!0?--p.readyWait:p.isReady)return;if(!e.body)return setTimeout(p.ready,1);p.isReady=!0;if(a!==!0&&--p.readyWait>0)return;d.resolveWith(e,[p]),p.fn.trigger&&p(e).trigger("ready").off("ready")},isFunction:function(a){return p.type(a)==="function"},isArray:Array.isArray||function(a){return p.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):E[m.call(a)]||"object"},isPlainObject:function(a){if(!a||p.type(a)!=="object"||a.nodeType||p.isWindow(a))return!1;try{if(a.constructor&&!n.call(a,"constructor")&&!n.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||n.call(a,d)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},error:function(a){throw new Error(a)},parseHTML:function(a,b,c){var d;return!a||typeof a!="string"?null:(typeof b=="boolean"&&(c=b,b=0),b=b||e,(d=v.exec(a))?[b.createElement(d[1])]:(d=p.buildFragment([a],b,c?null:[]),p.merge([],(d.cacheable?p.clone(d.fragment):d.fragment).childNodes)))},parseJSON:function(b){if(!b||typeof b!="string")return null;b=p.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(w.test(b.replace(y,"@").replace(z,"]").replace(x,"")))return(new Function("return "+b))();p.error("Invalid JSON: "+b)},parseXML:function(c){var d,e;if(!c||typeof c!="string")return null;try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&p.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&r.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(A,"ms-").replace(B,C)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var e,f=0,g=a.length,h=g===b||p.isFunction(a);if(d){if(h){for(e in a)if(c.apply(a[e],d)===!1)break}else for(;f<g;)if(c.apply(a[f++],d)===!1)break}else if(h){for(e in a)if(c.call(a[e],e,a[e])===!1)break}else for(;f<g;)if(c.call(a[f],f,a[f++])===!1)break;return a},trim:o?function(a){return a==null?"":o.call(a)}:function(a){return a==null?"":a.toString().replace(t,"")},makeArray:function(a,b){var c,d=b||[];return a!=null&&(c=p.type(a),a.length==null||c==="string"||c==="function"||c==="regexp"||p.isWindow(a)?j.call(d,a):p.merge(d,a)),d},inArray:function(a,b,c){var d;if(b){if(l)return l.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=c.length,e=a.length,f=0;if(typeof d=="number")for(;f<d;f++)a[e++]=c[f];else while(c[f]!==b)a[e++]=c[f++];return a.length=e,a},grep:function(a,b,c){var d,e=[],f=0,g=a.length;c=!!c;for(;f<g;f++)d=!!b(a[f],f),c!==d&&e.push(a[f]);return e},map:function(a,c,d){var e,f,g=[],h=0,i=a.length,j=a instanceof p||i!==b&&typeof i=="number"&&(i>0&&a[0]&&a[i-1]||i===0||p.isArray(a));if(j)for(;h<i;h++)e=c(a[h],h,d),e!=null&&(g[g.length]=e);else for(f in a)e=c(a[f],f,d),e!=null&&(g[g.length]=e);return g.concat.apply([],g)},guid:1,proxy:function(a,c){var d,e,f;return typeof c=="string"&&(d=a[c],c=a,a=d),p.isFunction(a)?(e=k.call(arguments,2),f=function(){return a.apply(c,e.concat(k.call(arguments)))},f.guid=a.guid=a.guid||f.guid||p.guid++,f):b},access:function(a,c,d,e,f,g,h){var i,j=d==null,k=0,l=a.length;if(d&&typeof d=="object"){for(k in d)p.access(a,c,k,d[k],1,g,e);f=1}else if(e!==b){i=h===b&&p.isFunction(e),j&&(i?(i=c,c=function(a,b,c){return i.call(p(a),c)}):(c.call(a,e),c=null));if(c)for(;k<l;k++)c(a[k],d,i?e.call(a[k],k,c(a[k],d)):e,h);f=1}return f?a:j?c.call(a):l?c(a[0],d):g},now:function(){return(new Date).getTime()}}),p.ready.promise=function(b){if(!d){d=p.Deferred();if(e.readyState==="complete"||e.readyState!=="loading"&&e.addEventListener)setTimeout(p.ready,1);else if(e.addEventListener)e.addEventListener("DOMContentLoaded",D,!1),a.addEventListener("load",p.ready,!1);else{e.attachEvent("onreadystatechange",D),a.attachEvent("onload",p.ready);var c=!1;try{c=a.frameElement==null&&e.documentElement}catch(f){}c&&c.doScroll&&function g(){if(!p.isReady){try{c.doScroll("left")}catch(a){return setTimeout(g,50)}p.ready()}}()}}return d.promise(b)},p.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){E["[object "+b+"]"]=b.toLowerCase()}),c=p(e);var F={};p.Callbacks=function(a){a=typeof a=="string"?F[a]||G(a):p.extend({},a);var c,d,e,f,g,h,i=[],j=!a.once&&[],k=function(b){c=a.memory&&b,d=!0,h=f||0,f=0,g=i.length,e=!0;for(;i&&h<g;h++)if(i[h].apply(b[0],b[1])===!1&&a.stopOnFalse){c=!1;break}e=!1,i&&(j?j.length&&k(j.shift()):c?i=[]:l.disable())},l={add:function(){if(i){var b=i.length;(function d(b){p.each(b,function(b,c){p.isFunction(c)&&(!a.unique||!l.has(c))?i.push(c):c&&c.length&&d(c)})})(arguments),e?g=i.length:c&&(f=b,k(c))}return this},remove:function(){return i&&p.each(arguments,function(a,b){var c;while((c=p.inArray(b,i,c))>-1)i.splice(c,1),e&&(c<=g&&g--,c<=h&&h--)}),this},has:function(a){return p.inArray(a,i)>-1},empty:function(){return i=[],this},disable:function(){return i=j=c=b,this},disabled:function(){return!i},lock:function(){return j=b,c||l.disable(),this},locked:function(){return!j},fireWith:function(a,b){return b=b||[],b=[a,b.slice?b.slice():b],i&&(!d||j)&&(e?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!d}};return l},p.extend({Deferred:function(a){var b=[["resolve","done",p.Callbacks("once memory"),"resolved"],["reject","fail",p.Callbacks("once memory"),"rejected"],["notify","progress",p.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return p.Deferred(function(c){p.each(b,function(b,d){var f=d[0],g=a[b];e[d[1]](p.isFunction(g)?function(){var a=g.apply(this,arguments);a&&p.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f+"With"](this===e?c:this,[a])}:c[f])}),a=null}).promise()},promise:function(a){return typeof a=="object"?p.extend(a,d):d}},e={};return d.pipe=d.then,p.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[a^1][2].disable,b[2][2].lock),e[f[0]]=g.fire,e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=k.call(arguments),d=c.length,e=d!==1||a&&p.isFunction(a.promise)?d:0,f=e===1?a:p.Deferred(),g=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?k.call(arguments):d,c===h?f.notifyWith(b,c):--e||f.resolveWith(b,c)}},h,i,j;if(d>1){h=new Array(d),i=new Array(d),j=new Array(d);for(;b<d;b++)c[b]&&p.isFunction(c[b].promise)?c[b].promise().done(g(b,j,c)).fail(f.reject).progress(g(b,i,h)):--e}return e||f.resolveWith(j,c),f.promise()}}),p.support=function(){var b,c,d,f,g,h,i,j,k,l,m,n=e.createElement("div");n.setAttribute("className","t"),n.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",c=n.getElementsByTagName("*"),d=n.getElementsByTagName("a")[0],d.style.cssText="top:1px;float:left;opacity:.5";if(!c||!c.length||!d)return{};f=e.createElement("select"),g=f.appendChild(e.createElement("option")),h=n.getElementsByTagName("input")[0],b={leadingWhitespace:n.firstChild.nodeType===3,tbody:!n.getElementsByTagName("tbody").length,htmlSerialize:!!n.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:d.getAttribute("href")==="/a",opacity:/^0.5/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:h.value==="on",optSelected:g.selected,getSetAttribute:n.className!=="t",enctype:!!e.createElement("form").enctype,html5Clone:e.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:e.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},h.checked=!0,b.noCloneChecked=h.cloneNode(!0).checked,f.disabled=!0,b.optDisabled=!g.disabled;try{delete n.test}catch(o){b.deleteExpando=!1}!n.addEventListener&&n.attachEvent&&n.fireEvent&&(n.attachEvent("onclick",m=function(){b.noCloneEvent=!1}),n.cloneNode(!0).fireEvent("onclick"),n.detachEvent("onclick",m)),h=e.createElement("input"),h.value="t",h.setAttribute("type","radio"),b.radioValue=h.value==="t",h.setAttribute("checked","checked"),h.setAttribute("name","t"),n.appendChild(h),i=e.createDocumentFragment(),i.appendChild(n.lastChild),b.checkClone=i.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=h.checked,i.removeChild(h),i.appendChild(n);if(n.attachEvent)for(k in{submit:!0,change:!0,focusin:!0})j="on"+k,l=j in n,l||(n.setAttribute(j,"return;"),l=typeof n[j]=="function"),b[k+"Bubbles"]=l;return p(function(){var c,d,f,g,h="padding:0;margin:0;border:0;display:block;overflow:hidden;",i=e.getElementsByTagName("body")[0];if(!i)return;c=e.createElement("div"),c.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",i.insertBefore(c,i.firstChild),d=e.createElement("div"),c.appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",f=d.getElementsByTagName("td"),f[0].style.cssText="padding:0;margin:0;border:0;display:none",l=f[0].offsetHeight===0,f[0].style.display="",f[1].style.display="none",b.reliableHiddenOffsets=l&&f[0].offsetHeight===0,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",b.boxSizing=d.offsetWidth===4,b.doesNotIncludeMarginInBodyOffset=i.offsetTop!==1,a.getComputedStyle&&(b.pixelPosition=(a.getComputedStyle(d,null)||{}).top!=="1%",b.boxSizingReliable=(a.getComputedStyle(d,null)||{width:"4px"}).width==="4px",g=e.createElement("div"),g.style.cssText=d.style.cssText=h,g.style.marginRight=g.style.width="0",d.style.width="1px",d.appendChild(g),b.reliableMarginRight=!parseFloat((a.getComputedStyle(g,null)||{}).marginRight)),typeof d.style.zoom!="undefined"&&(d.innerHTML="",d.style.cssText=h+"width:1px;padding:1px;display:inline;zoom:1",b.inlineBlockNeedsLayout=d.offsetWidth===3,d.style.display="block",d.style.overflow="visible",d.innerHTML="<div></div>",d.firstChild.style.width="5px",b.shrinkWrapBlocks=d.offsetWidth!==3,c.style.zoom=1),i.removeChild(c),c=d=f=g=null}),i.removeChild(n),c=d=f=g=h=i=n=null,b}();var H=/^(?:\{.*\}|\[.*\])$/,I=/([A-Z])/g;p.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(p.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?p.cache[a[p.expando]]:a[p.expando],!!a&&!K(a)},data:function(a,c,d,e){if(!p.acceptData(a))return;var f,g,h=p.expando,i=typeof c=="string",j=a.nodeType,k=j?p.cache:a,l=j?a[h]:a[h]&&h;if((!l||!k[l]||!e&&!k[l].data)&&i&&d===b)return;l||(j?a[h]=l=p.deletedIds.pop()||++p.uuid:l=h),k[l]||(k[l]={},j||(k[l].toJSON=p.noop));if(typeof c=="object"||typeof c=="function")e?k[l]=p.extend(k[l],c):k[l].data=p.extend(k[l].data,c);return f=k[l],e||(f.data||(f.data={}),f=f.data),d!==b&&(f[p.camelCase(c)]=d),i?(g=f[c],g==null&&(g=f[p.camelCase(c)])):g=f,g},removeData:function(a,b,c){if(!p.acceptData(a))return;var d,e,f,g=a.nodeType,h=g?p.cache:a,i=g?a[p.expando]:p.expando;if(!h[i])return;if(b){d=c?h[i]:h[i].data;if(d){p.isArray(b)||(b in d?b=[b]:(b=p.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,f=b.length;e<f;e++)delete d[b[e]];if(!(c?K:p.isEmptyObject)(d))return}}if(!c){delete h[i].data;if(!K(h[i]))return}g?p.cleanData([a],!0):p.support.deleteExpando||h!=h.window?delete h[i]:h[i]=null},_data:function(a,b,c){return p.data(a,b,c,!0)},acceptData:function(a){var b=a.nodeName&&p.noData[a.nodeName.toLowerCase()];return!b||b!==!0&&a.getAttribute("classid")===b}}),p.fn.extend({data:function(a,c){var d,e,f,g,h,i=this[0],j=0,k=null;if(a===b){if(this.length){k=p.data(i);if(i.nodeType===1&&!p._data(i,"parsedAttrs")){f=i.attributes;for(h=f.length;j<h;j++)g=f[j].name,g.indexOf("data-")===0&&(g=p.camelCase(g.substring(5)),J(i,g,k[g]));p._data(i,"parsedAttrs",!0)}}return k}return typeof a=="object"?this.each(function(){p.data(this,a)}):(d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!",p.access(this,function(c){if(c===b)return k=this.triggerHandler("getData"+e,[d[0]]),k===b&&i&&(k=p.data(i,a),k=J(i,a,k)),k===b&&d[1]?this.data(d[0]):k;d[1]=c,this.each(function(){var b=p(this);b.triggerHandler("setData"+e,d),p.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1))},removeData:function(a){return this.each(function(){p.removeData(this,a)})}}),p.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=p._data(a,b),c&&(!d||p.isArray(c)?d=p._data(a,b,p.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=p.queue(a,b),d=c.shift(),e=p._queueHooks(a,b),f=function(){p.dequeue(a,b)};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),delete e.stop,d.call(a,f,e)),!c.length&&e&&e.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return p._data(a,c)||p._data(a,c,{empty:p.Callbacks("once memory").add(function(){p.removeData(a,b+"queue",!0),p.removeData(a,c,!0)})})}}),p.fn.extend({queue:function(a,c){var d=2;return typeof a!="string"&&(c=a,a="fx",d--),arguments.length<d?p.queue(this[0],a):c===b?this:this.each(function(){var b=p.queue(this,a,c);p._queueHooks(this,a),a==="fx"&&b[0]!=="inprogress"&&p.dequeue(this,a)})},dequeue:function(a){return this.each(function(){p.dequeue(this,a)})},delay:function(a,b){return a=p.fx?p.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){var d,e=1,f=p.Deferred(),g=this,h=this.length,i=function(){--e||f.resolveWith(g,[g])};typeof a!="string"&&(c=a,a=b),a=a||"fx";while(h--)(d=p._data(g[h],a+"queueHooks"))&&d.empty&&(e++,d.empty.add(i));return i(),f.promise(c)}});var L,M,N,O=/[\t\r\n]/g,P=/\r/g,Q=/^(?:button|input)$/i,R=/^(?:button|input|object|select|textarea)$/i,S=/^a(?:rea|)$/i,T=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,U=p.support.getSetAttribute;p.fn.extend({attr:function(a,b){return p.access(this,p.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){p.removeAttr(this,a)})},prop:function(a,b){return p.access(this,p.prop,a,b,arguments.length>1)},removeProp:function(a){return a=p.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g,h;if(p.isFunction(a))return this.each(function(b){p(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(s);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{f=" "+e.className+" ";for(g=0,h=b.length;g<h;g++)~f.indexOf(" "+b[g]+" ")||(f+=b[g]+" ");e.className=p.trim(f)}}}return this},removeClass:function(a){var c,d,e,f,g,h,i;if(p.isFunction(a))return this.each(function(b){p(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(s);for(h=0,i=this.length;h<i;h++){e=this[h];if(e.nodeType===1&&e.className){d=(" "+e.className+" ").replace(O," ");for(f=0,g=c.length;f<g;f++)while(d.indexOf(" "+c[f]+" ")>-1)d=d.replace(" "+c[f]+" "," ");e.className=a?p.trim(d):""}}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";return p.isFunction(a)?this.each(function(c){p(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if(c==="string"){var e,f=0,g=p(this),h=b,i=a.split(s);while(e=i[f++])h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&p._data(this,"__className__",this.className),this.className=this.className||a===!1?"":p._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(O," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,f=this[0];if(!arguments.length){if(f)return c=p.valHooks[f.type]||p.valHooks[f.nodeName.toLowerCase()],c&&"get"in c&&(d=c.get(f,"value"))!==b?d:(d=f.value,typeof d=="string"?d.replace(P,""):d==null?"":d);return}return e=p.isFunction(a),this.each(function(d){var f,g=p(this);if(this.nodeType!==1)return;e?f=a.call(this,d,g.val()):f=a,f==null?f="":typeof f=="number"?f+="":p.isArray(f)&&(f=p.map(f,function(a){return a==null?"":a+""})),c=p.valHooks[this.type]||p.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,f,"value")===b)this.value=f})}}),p.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,f=a.selectedIndex,g=[],h=a.options,i=a.type==="select-one";if(f<0)return null;c=i?f:0,d=i?f+1:h.length;for(;c<d;c++){e=h[c];if(e.selected&&(p.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!p.nodeName(e.parentNode,"optgroup"))){b=p(e).val();if(i)return b;g.push(b)}}return i&&!g.length&&h.length?p(h[f]).val():g},set:function(a,b){var c=p.makeArray(b);return p(a).find("option").each(function(){this.selected=p.inArray(p(this).val(),c)>=0}),c.length||(a.selectedIndex=-1),c}}},attrFn:{},attr:function(a,c,d,e){var f,g,h,i=a.nodeType;if(!a||i===3||i===8||i===2)return;if(e&&p.isFunction(p.fn[c]))return p(a)[c](d);if(typeof a.getAttribute=="undefined")return p.prop(a,c,d);h=i!==1||!p.isXMLDoc(a),h&&(c=c.toLowerCase(),g=p.attrHooks[c]||(T.test(c)?M:L));if(d!==b){if(d===null){p.removeAttr(a,c);return}return g&&"set"in g&&h&&(f=g.set(a,d,c))!==b?f:(a.setAttribute(c,""+d),d)}return g&&"get"in g&&h&&(f=g.get(a,c))!==null?f:(f=a.getAttribute(c),f===null?b:f)},removeAttr:function(a,b){var c,d,e,f,g=0;if(b&&a.nodeType===1){d=b.split(s);for(;g<d.length;g++)e=d[g],e&&(c=p.propFix[e]||e,f=T.test(e),f||p.attr(a,e,""),a.removeAttribute(U?e:c),f&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(Q.test(a.nodeName)&&a.parentNode)p.error("type property can't be changed");else if(!p.support.radioValue&&b==="radio"&&p.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}},value:{get:function(a,b){return L&&p.nodeName(a,"button")?L.get(a,b):b in a?a.value:null},set:function(a,b,c){if(L&&p.nodeName(a,"button"))return L.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;if(!a||h===3||h===8||h===2)return;return g=h!==1||!p.isXMLDoc(a),g&&(c=p.propFix[c]||c,f=p.propHooks[c]),d!==b?f&&"set"in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get"in f&&(e=f.get(a,c))!==null?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):R.test(a.nodeName)||S.test(a.nodeName)&&a.href?0:b}}}}),M={get:function(a,c){var d,e=p.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;return b===!1?p.removeAttr(a,c):(d=p.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase())),c}},U||(N={name:!0,id:!0,coords:!0},L=p.valHooks.button={get:function(a,c){var d;return d=a.getAttributeNode(c),d&&(N[c]?d.value!=="":d.specified)?d.value:b},set:function(a,b,c){var d=a.getAttributeNode(c);return d||(d=e.createAttribute(c),a.setAttributeNode(d)),d.value=b+""}},p.each(["width","height"],function(a,b){p.attrHooks[b]=p.extend(p.attrHooks[b],{set:function(a,c){if(c==="")return a.setAttribute(b,"auto"),c}})}),p.attrHooks.contenteditable={get:L.get,set:function(a,b,c){b===""&&(b="false"),L.set(a,b,c)}}),p.support.hrefNormalized||p.each(["href","src","width","height"],function(a,c){p.attrHooks[c]=p.extend(p.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),p.support.style||(p.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),p.support.optSelected||(p.propHooks.selected=p.extend(p.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),p.support.enctype||(p.propFix.enctype="encoding"),p.support.checkOn||p.each(["radio","checkbox"],function(){p.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),p.each(["radio","checkbox"],function(){p.valHooks[this]=p.extend(p.valHooks[this],{set:function(a,b){if(p.isArray(b))return a.checked=p.inArray(p(a).val(),b)>=0}})});var V=/^(?:textarea|input|select)$/i,W=/^([^\.]*|)(?:\.(.+)|)$/,X=/(?:^|\s)hover(\.\S+|)\b/,Y=/^key/,Z=/^(?:mouse|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=function(a){return p.event.special.hover?a:a.replace(X,"mouseenter$1 mouseleave$1")};p.event={add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,q,r;if(a.nodeType===3||a.nodeType===8||!c||!d||!(g=p._data(a)))return;d.handler&&(o=d,d=o.handler,f=o.selector),d.guid||(d.guid=p.guid++),i=g.events,i||(g.events=i={}),h=g.handle,h||(g.handle=h=function(a){return typeof p!="undefined"&&(!a||p.event.triggered!==a.type)?p.event.dispatch.apply(h.elem,arguments):b},h.elem=a),c=p.trim(_(c)).split(" ");for(j=0;j<c.length;j++){k=W.exec(c[j])||[],l=k[1],m=(k[2]||"").split(".").sort(),r=p.event.special[l]||{},l=(f?r.delegateType:r.bindType)||l,r=p.event.special[l]||{},n=p.extend({type:l,origType:k[1],data:e,handler:d,guid:d.guid,selector:f,namespace:m.join(".")},o),q=i[l];if(!q){q=i[l]=[],q.delegateCount=0;if(!r.setup||r.setup.call(a,e,m,h)===!1)a.addEventListener?a.addEventListener(l,h,!1):a.attachEvent&&a.attachEvent("on"+l,h)}r.add&&(r.add.call(a,n),n.handler.guid||(n.handler.guid=d.guid)),f?q.splice(q.delegateCount++,0,n):q.push(n),p.event.global[l]=!0}a=null},global:{},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,q,r=p.hasData(a)&&p._data(a);if(!r||!(m=r.events))return;b=p.trim(_(b||"")).split(" ");for(f=0;f<b.length;f++){g=W.exec(b[f])||[],h=i=g[1],j=g[2];if(!h){for(h in m)p.event.remove(a,h+b[f],c,d,!0);continue}n=p.event.special[h]||{},h=(d?n.delegateType:n.bindType)||h,o=m[h]||[],k=o.length,j=j?new RegExp("(^|\\.)"+j.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(l=0;l<o.length;l++)q=o[l],(e||i===q.origType)&&(!c||c.guid===q.guid)&&(!j||j.test(q.namespace))&&(!d||d===q.selector||d==="**"&&q.selector)&&(o.splice(l--,1),q.selector&&o.delegateCount--,n.remove&&n.remove.call(a,q));o.length===0&&k!==o.length&&((!n.teardown||n.teardown.call(a,j,r.handle)===!1)&&p.removeEvent(a,h,r.handle),delete m[h])}p.isEmptyObject(m)&&(delete r.handle,p.removeData(a,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,f,g){if(!f||f.nodeType!==3&&f.nodeType!==8){var h,i,j,k,l,m,n,o,q,r,s=c.type||c,t=[];if($.test(s+p.event.triggered))return;s.indexOf("!")>=0&&(s=s.slice(0,-1),i=!0),s.indexOf(".")>=0&&(t=s.split("."),s=t.shift(),t.sort());if((!f||p.event.customEvent[s])&&!p.event.global[s])return;c=typeof c=="object"?c[p.expando]?c:new p.Event(s,c):new p.Event(s),c.type=s,c.isTrigger=!0,c.exclusive=i,c.namespace=t.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+t.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,m=s.indexOf(":")<0?"on"+s:"";if(!f){h=p.cache;for(j in h)h[j].events&&h[j].events[s]&&p.event.trigger(c,d,h[j].handle.elem,!0);return}c.result=b,c.target||(c.target=f),d=d!=null?p.makeArray(d):[],d.unshift(c),n=p.event.special[s]||{};if(n.trigger&&n.trigger.apply(f,d)===!1)return;q=[[f,n.bindType||s]];if(!g&&!n.noBubble&&!p.isWindow(f)){r=n.delegateType||s,k=$.test(r+s)?f:f.parentNode;for(l=f;k;k=k.parentNode)q.push([k,r]),l=k;l===(f.ownerDocument||e)&&q.push([l.defaultView||l.parentWindow||a,r])}for(j=0;j<q.length&&!c.isPropagationStopped();j++)k=q[j][0],c.type=q[j][1],o=(p._data(k,"events")||{})[c.type]&&p._data(k,"handle"),o&&o.apply(k,d),o=m&&k[m],o&&p.acceptData(k)&&o.apply(k,d)===!1&&c.preventDefault();return c.type=s,!g&&!c.isDefaultPrevented()&&(!n._default||n._default.apply(f.ownerDocument,d)===!1)&&(s!=="click"||!p.nodeName(f,"a"))&&p.acceptData(f)&&m&&f[s]&&(s!=="focus"&&s!=="blur"||c.target.offsetWidth!==0)&&!p.isWindow(f)&&(l=f[m],l&&(f[m]=null),p.event.triggered=s,f[s](),p.event.triggered=b,l&&(f[m]=l)),c.result}return},dispatch:function(c){c=p.event.fix(c||a.event);var d,e,f,g,h,i,j,k,l,m,n,o=(p._data(this,"events")||{})[c.type]||[],q=o.delegateCount,r=[].slice.call(arguments),s=!c.exclusive&&!c.namespace,t=p.event.special[c.type]||{},u=[];r[0]=c,c.delegateTarget=this;if(t.preDispatch&&t.preDispatch.call(this,c)===!1)return;if(q&&(!c.button||c.type!=="click")){g=p(this),g.context=this;for(f=c.target;f!=this;f=f.parentNode||this)if(f.disabled!==!0||c.type!=="click"){i={},k=[],g[0]=f;for(d=0;d<q;d++)l=o[d],m=l.selector,i[m]===b&&(i[m]=g.is(m)),i[m]&&k.push(l);k.length&&u.push({elem:f,matches:k})}}o.length>q&&u.push({elem:this,matches:o.slice(q)});for(d=0;d<u.length&&!c.isPropagationStopped();d++){j=u[d],c.currentTarget=j.elem;for(e=0;e<j.matches.length&&!c.isImmediatePropagationStopped();e++){l=j.matches[e];if(s||!c.namespace&&!l.namespace||c.namespace_re&&c.namespace_re.test(l.namespace))c.data=l.data,c.handleObj=l,h=((p.event.special[l.origType]||{}).handle||l.handler).apply(j.elem,r),h!==b&&(c.result=h,h===!1&&(c.preventDefault(),c.stopPropagation()))}}return t.postDispatch&&t.postDispatch.call(this,c),c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,f,g,h=c.button,i=c.fromElement;return a.pageX==null&&c.clientX!=null&&(d=a.target.ownerDocument||e,f=d.documentElement,g=d.body,a.pageX=c.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=c.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?c.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0),a}},fix:function(a){if(a[p.expando])return a;var b,c,d=a,f=p.event.fixHooks[a.type]||{},g=f.props?this.props.concat(f.props):this.props;a=p.Event(d);for(b=g.length;b;)c=g[--b],a[c]=d[c];return a.target||(a.target=d.srcElement||e),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,f.filter?f.filter(a,d):a},special:{ready:{setup:p.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){p.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=p.extend(new p.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?p.event.trigger(e,null,b):p.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},p.event.handle=p.event.dispatch,p.removeEvent=e.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]=="undefined"&&(a[d]=null),a.detachEvent(d,c))},p.Event=function(a,b){if(this instanceof p.Event)a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?bb:ba):this.type=a,b&&p.extend(this,b),this.timeStamp=a&&a.timeStamp||p.now(),this[p.expando]=!0;else return new p.Event(a,b)},p.Event.prototype={preventDefault:function(){this.isDefaultPrevented=bb;var a=this.originalEvent;if(!a)return;a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=bb;var a=this.originalEvent;if(!a)return;a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()},isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba},p.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){p.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj,g=f.selector;if(!e||e!==d&&!p.contains(d,e))a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b;return c}}}),p.support.submitBubbles||(p.event.special.submit={setup:function(){if(p.nodeName(this,"form"))return!1;p.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=p.nodeName(c,"input")||p.nodeName(c,"button")?c.form:b;d&&!p._data(d,"_submit_attached")&&(p.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),p._data(d,"_submit_attached",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&p.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(p.nodeName(this,"form"))return!1;p.event.remove(this,"._submit")}}),p.support.changeBubbles||(p.event.special.change={setup:function(){if(V.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")p.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),p.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),p.event.simulate("change",this,a,!0)});return!1}p.event.add(this,"beforeactivate._change",function(a){var b=a.target;V.test(b.nodeName)&&!p._data(b,"_change_attached")&&(p.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&p.event.simulate("change",this.parentNode,a,!0)}),p._data(b,"_change_attached",!0))})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){return p.event.remove(this,"._change"),V.test(this.nodeName)}}),p.support.focusinBubbles||p.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){p.event.simulate(b,a.target,p.event.fix(a),!0)};p.event.special[b]={setup:function(){c++===0&&e.addEventListener(a,d,!0)},teardown:function(){--c===0&&e.removeEventListener(a,d,!0)}}}),p.fn.extend({on:function(a,c,d,e,f){var g,h;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(h in a)this.on(h,c,d,a[h],f);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=ba;else if(!e)return this;return f===1&&(g=e,e=function(a){return p().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=p.guid++)),this.each(function(){p.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){var e,f;if(a&&a.preventDefault&&a.handleObj)return e=a.handleObj,p(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this;if(typeof a=="object"){for(f in a)this.off(f,c,a[f]);return this}if(c===!1||typeof c=="function")d=c,c=b;return d===!1&&(d=ba),this.each(function(){p.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){return p(this.context).on(a,this.selector,b,c),this},die:function(a,b){return p(this.context).off(a,this.selector||"**",b),this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a||"**",c)},trigger:function(a,b){return this.each(function(){p.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return p.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||p.guid++,d=0,e=function(c){var e=(p._data(this,"lastToggle"+a.guid)||0)%d;return p._data(this,"lastToggle"+a.guid,e+1),c.preventDefault(),b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){p.fn[b]=function(a,c){return c==null&&(c=a,a=null),arguments.length>0?this.on(b,null,a,c):this.trigger(b)},Y.test(b)&&(p.event.fixHooks[b]=p.event.keyHooks),Z.test(b)&&(p.event.fixHooks[b]=p.event.mouseHooks)}),function(a,b){function bd(a,b,c,d){var e=0,f=b.length;for(;e<f;e++)Z(a,b[e],c,d)}function be(a,b,c,d,e,f){var g,h=$.setFilters[b.toLowerCase()];return h||Z.error(b),(a||!(g=e))&&bd(a||"*",d,g=[],e),g.length>0?h(g,c,f):[]}function bf(a,c,d,e,f){var g,h,i,j,k,l,m,n,p=0,q=f.length,s=L.POS,t=new RegExp("^"+s.source+"(?!"+r+")","i"),u=function(){var a=1,c=arguments.length-2;for(;a<c;a++)arguments[a]===b&&(g[a]=b)};for(;p<q;p++){s.exec(""),a=f[p],j=[],i=0,k=e;while(g=s.exec(a)){n=s.lastIndex=g.index+g[0].length;if(n>i){m=a.slice(i,g.index),i=n,l=[c],B.test(m)&&(k&&(l=k),k=e);if(h=H.test(m))m=m.slice(0,-5).replace(B,"$&*");g.length>1&&g[0].replace(t,u),k=be(m,g[1],g[2],l,k,h)}}k?(j=j.concat(k),(m=a.slice(i))&&m!==")"?B.test(m)?bd(m,j,d,e):Z(m,c,d,e?e.concat(k):k):o.apply(d,j)):Z(a,c,d,e)}return q===1?d:Z.uniqueSort(d)}function bg(a,b,c){var d,e,f,g=[],i=0,j=D.exec(a),k=!j.pop()&&!j.pop(),l=k&&a.match(C)||[""],m=$.preFilter,n=$.filter,o=!c&&b!==h;for(;(e=l[i])!=null&&k;i++){g.push(d=[]),o&&(e=" "+e);while(e){k=!1;if(j=B.exec(e))e=e.slice(j[0].length),k=d.push({part:j.pop().replace(A," "),captures:j});for(f in n)(j=L[f].exec(e))&&(!m[f]||(j=m[f](j,b,c)))&&(e=e.slice(j.shift().length),k=d.push({part:f,captures:j}));if(!k)break}}return k||Z.error(a),g}function bh(a,b,e){var f=b.dir,g=m++;return a||(a=function(a){return a===e}),b.first?function(b,c){while(b=b[f])if(b.nodeType===1)return a(b,c)&&b}:function(b,e){var h,i=g+"."+d,j=i+"."+c;while(b=b[f])if(b.nodeType===1){if((h=b[q])===j)return b.sizset;if(typeof h=="string"&&h.indexOf(i)===0){if(b.sizset)return b}else{b[q]=j;if(a(b,e))return b.sizset=!0,b;b.sizset=!1}}}}function bi(a,b){return a?function(c,d){var e=b(c,d);return e&&a(e===!0?c:e,d)}:b}function bj(a,b,c){var d,e,f=0;for(;d=a[f];f++)$.relative[d.part]?e=bh(e,$.relative[d.part],b):(d.captures.push(b,c),e=bi(e,$.filter[d.part].apply(null,d.captures)));return e}function bk(a){return function(b,c){var d,e=0;for(;d=a[e];e++)if(d(b,c))return!0;return!1}}var c,d,e,f,g,h=a.document,i=h.documentElement,j="undefined",k=!1,l=!0,m=0,n=[].slice,o=[].push,q=("sizcache"+Math.random()).replace(".",""),r="[\\x20\\t\\r\\n\\f]",s="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",t=s.replace("w","w#"),u="([*^$|!~]?=)",v="\\["+r+"*("+s+")"+r+"*(?:"+u+r+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+t+")|)|)"+r+"*\\]",w=":("+s+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)",x=":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)",y=r+"*([\\x20\\t\\r\\n\\f>+~])"+r+"*",z="(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|"+v+"|"+w.replace(2,7)+"|[^\\\\(),])+",A=new RegExp("^"+r+"+|((?:^|[^\\\\])(?:\\\\.)*)"+r+"+$","g"),B=new RegExp("^"+y),C=new RegExp(z+"?(?="+r+"*,|$)","g"),D=new RegExp("^(?:(?!,)(?:(?:^|,)"+r+"*"+z+")*?|"+r+"*(.*?))(\\)|$)"),E=new RegExp(z.slice(19,-6)+"\\x20\\t\\r\\n\\f>+~])+|"+y,"g"),F=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,G=/[\x20\t\r\n\f]*[+~]/,H=/:not\($/,I=/h\d/i,J=/input|select|textarea|button/i,K=/\\(?!\\)/g,L={ID:new RegExp("^#("+s+")"),CLASS:new RegExp("^\\.("+s+")"),NAME:new RegExp("^\\[name=['\"]?("+s+")['\"]?\\]"),TAG:new RegExp("^("+s.replace("[-","[-\\*")+")"),ATTR:new RegExp("^"+v),PSEUDO:new RegExp("^"+w),CHILD:new RegExp("^:(only|nth|last|first)-child(?:\\("+r+"*(even|odd|(([+-]|)(\\d*)n|)"+r+"*(?:([+-]|)"+r+"*(\\d+)|))"+r+"*\\)|)","i"),POS:new RegExp(x,"ig"),needsContext:new RegExp("^"+r+"*[>+~]|"+x,"i")},M={},N=[],O={},P=[],Q=function(a){return a.sizzleFilter=!0,a},R=function(a){return function(b){return b.nodeName.toLowerCase()==="input"&&b.type===a}},S=function(a){return function(b){var c=b.nodeName.toLowerCase();return(c==="input"||c==="button")&&b.type===a}},T=function(a){var b=!1,c=h.createElement("div");try{b=a(c)}catch(d){}return c=null,b},U=T(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return b!=="boolean"&&b!=="string"}),V=T(function(a){a.id=q+0,a.innerHTML="<a name='"+q+"'></a><div name='"+q+"'></div>",i.insertBefore(a,i.firstChild);var b=h.getElementsByName&&h.getElementsByName(q).length===2+h.getElementsByName(q+0).length;return g=!h.getElementById(q),i.removeChild(a),b}),W=T(function(a){return a.appendChild(h.createComment("")),a.getElementsByTagName("*").length===0}),X=T(function(a){return a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!==j&&a.firstChild.getAttribute("href")==="#"}),Y=T(function(a){return a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!a.getElementsByClassName||a.getElementsByClassName("e").length===0?!1:(a.lastChild.className="e",a.getElementsByClassName("e").length!==1)}),Z=function(a,b,c,d){c=c||[],b=b||h;var e,f,g,i,j=b.nodeType;if(j!==1&&j!==9)return[];if(!a||typeof a!="string")return c;g=ba(b);if(!g&&!d)if(e=F.exec(a))if(i=e[1]){if(j===9){f=b.getElementById(i);if(!f||!f.parentNode)return c;if(f.id===i)return c.push(f),c}else if(b.ownerDocument&&(f=b.ownerDocument.getElementById(i))&&bb(b,f)&&f.id===i)return c.push(f),c}else{if(e[2])return o.apply(c,n.call(b.getElementsByTagName(a),0)),c;if((i=e[3])&&Y&&b.getElementsByClassName)return o.apply(c,n.call(b.getElementsByClassName(i),0)),c}return bm(a,b,c,d,g)},$=Z.selectors={cacheLength:50,match:L,order:["ID","TAG"],attrHandle:{},createPseudo:Q,find:{ID:g?function(a,b,c){if(typeof b.getElementById!==j&&!c){var d=b.getElementById(a);return d&&d.parentNode?[d]:[]}}:function(a,c,d){if(typeof c.getElementById!==j&&!d){var e=c.getElementById(a);return e?e.id===a||typeof e.getAttributeNode!==j&&e.getAttributeNode("id").value===a?[e]:b:[]}},TAG:W?function(a,b){if(typeof b.getElementsByTagName!==j)return b.getElementsByTagName(a)}:function(a,b){var c=b.getElementsByTagName(a);if(a==="*"){var d,e=[],f=0;for(;d=c[f];f++)d.nodeType===1&&e.push(d);return e}return c}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(K,""),a[3]=(a[4]||a[5]||"").replace(K,""),a[2]==="~="&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),a[1]==="nth"?(a[2]||Z.error(a[0]),a[3]=+(a[3]?a[4]+(a[5]||1):2*(a[2]==="even"||a[2]==="odd")),a[4]=+(a[6]+a[7]||a[2]==="odd")):a[2]&&Z.error(a[0]),a},PSEUDO:function(a){var b,c=a[4];return L.CHILD.test(a[0])?null:(c&&(b=D.exec(c))&&b.pop()&&(a[0]=a[0].slice(0,b[0].length-c.length-1),c=b[0].slice(0,-1)),a.splice(2,3,c||a[3]),a)}},filter:{ID:g?function(a){return a=a.replace(K,""),function(b){return b.getAttribute("id")===a}}:function(a){return a=a.replace(K,""),function(b){var c=typeof b.getAttributeNode!==j&&b.getAttributeNode("id");return c&&c.value===a}},TAG:function(a){return a==="*"?function(){return!0}:(a=a.replace(K,"").toLowerCase(),function(b){return b.nodeName&&b.nodeName.toLowerCase()===a})},CLASS:function(a){var b=M[a];return b||(b=M[a]=new RegExp("(^|"+r+")"+a+"("+r+"|$)"),N.push(a),N.length>$.cacheLength&&delete M[N.shift()]),function(a){return b.test(a.className||typeof a.getAttribute!==j&&a.getAttribute("class")||"")}},ATTR:function(a,b,c){return b?function(d){var e=Z.attr(d,a),f=e+"";if(e==null)return b==="!=";switch(b){case"=":return f===c;case"!=":return f!==c;case"^=":return c&&f.indexOf(c)===0;case"*=":return c&&f.indexOf(c)>-1;case"$=":return c&&f.substr(f.length-c.length)===c;case"~=":return(" "+f+" ").indexOf(c)>-1;case"|=":return f===c||f.substr(0,c.length+1)===c+"-"}}:function(b){return Z.attr(b,a)!=null}},CHILD:function(a,b,c,d){if(a==="nth"){var e=m++;return function(a){var b,f,g=0,h=a;if(c===1&&d===0)return!0;b=a.parentNode;if(b&&(b[q]!==e||!a.sizset)){for(h=b.firstChild;h;h=h.nextSibling)if(h.nodeType===1){h.sizset=++g;if(h===a)break}b[q]=e}return f=a.sizset-d,c===0?f===0:f%c===0&&f/c>=0}}return function(b){var c=b;switch(a){case"only":case"first":while(c=c.previousSibling)if(c.nodeType===1)return!1;if(a==="first")return!0;c=b;case"last":while(c=c.nextSibling)if(c.nodeType===1)return!1;return!0}}},PSEUDO:function(a,b,c,d){var e=$.pseudos[a]||$.pseudos[a.toLowerCase()];return e||Z.error("unsupported pseudo: "+a),e.sizzleFilter?e(b,c,d):e}},pseudos:{not:Q(function(a,b,c){var d=bl(a.replace(A,"$1"),b,c);return function(a){return!d(a)}}),enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&!!a.checked||b==="option"&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!$.pseudos.empty(a)},empty:function(a){var b;a=a.firstChild;while(a){if(a.nodeName>"@"||(b=a.nodeType)===3||b===4)return!1;a=a.nextSibling}return!0},contains:Q(function(a){return function(b){return(b.textContent||b.innerText||bc(b)).indexOf(a)>-1}}),has:Q(function(a){return function(b){return Z(a,b).length>0}}),header:function(a){return I.test(a.nodeName)},text:function(a){var b,c;return a.nodeName.toLowerCase()==="input"&&(b=a.type)==="text"&&((c=a.getAttribute("type"))==null||c.toLowerCase()===b)},radio:R("radio"),checkbox:R("checkbox"),file:R("file"),password:R("password"),image:R("image"),submit:S("submit"),reset:S("reset"),button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&a.type==="button"||b==="button"},input:function(a){return J.test(a.nodeName)},focus:function(a){var b=a.ownerDocument;return a===b.activeElement&&(!b.hasFocus||b.hasFocus())&&(!!a.type||!!a.href)},active:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b,c){return c?a.slice(1):[a[0]]},last:function(a,b,c){var d=a.pop();return c?a:[d]},even:function(a,b,c){var d=[],e=c?1:0,f=a.length;for(;e<f;e=e+2)d.push(a[e]);return d},odd:function(a,b,c){var d=[],e=c?0:1,f=a.length;for(;e<f;e=e+2)d.push(a[e]);return d},lt:function(a,b,c){return c?a.slice(+b):a.slice(0,+b)},gt:function(a,b,c){return c?a.slice(0,+b+1):a.slice(+b+1)},eq:function(a,b,c){var d=a.splice(+b,1);return c?a:d}}};$.setFilters.nth=$.setFilters.eq,$.filters=$.pseudos,X||($.attrHandle={href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}}),V&&($.order.push("NAME"),$.find.NAME=function(a,b){if(typeof b.getElementsByName!==j)return b.getElementsByName(a)}),Y&&($.order.splice(1,0,"CLASS"),$.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!==j&&!c)return b.getElementsByClassName(a)});try{n.call(i.childNodes,0)[0].nodeType}catch(_){n=function(a){var b,c=[];for(;b=this[a];a++)c.push(b);return c}}var ba=Z.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?b.nodeName!=="HTML":!1},bb=Z.contains=i.compareDocumentPosition?function(a,b){return!!(a.compareDocumentPosition(b)&16)}:i.contains?function(a,b){var c=a.nodeType===9?a.documentElement:a,d=b.parentNode;return a===d||!!(d&&d.nodeType===1&&c.contains&&c.contains(d))}:function(a,b){while(b=b.parentNode)if(b===a)return!0;return!1},bc=Z.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(e===1||e===9||e===11){if(typeof a.textContent=="string")return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=bc(a)}else if(e===3||e===4)return a.nodeValue}else for(;b=a[d];d++)c+=bc(b);return c};Z.attr=function(a,b){var c,d=ba(a);return d||(b=b.toLowerCase()),$.attrHandle[b]?$.attrHandle[b](a):U||d?a.getAttribute(b):(c=a.getAttributeNode(b),c?typeof a[b]=="boolean"?a[b]?b:null:c.specified?c.value:null:null)},Z.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},[0,0].sort(function(){return l=0}),i.compareDocumentPosition?e=function(a,b){return a===b?(k=!0,0):(!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1}:(e=function(a,b){if(a===b)return k=!0,0;if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],g=[],h=a.parentNode,i=b.parentNode,j=h;if(h===i)return f(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)g.unshift(j),j=j.parentNode;c=e.length,d=g.length;for(var l=0;l<c&&l<d;l++)if(e[l]!==g[l])return f(e[l],g[l]);return l===c?f(a,g[l],-1):f(e[l],b,1)},f=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),Z.uniqueSort=function(a){var b,c=1;if(e){k=l,a.sort(e);if(k)for(;b=a[c];c++)b===a[c-1]&&a.splice(c--,1)}return a};var bl=Z.compile=function(a,b,c){var d,e,f,g=O[a];if(g&&g.context===b)return g;e=bg(a,b,c);for(f=0;d=e[f];f++)e[f]=bj(d,b,c);return g=O[a]=bk(e),g.context=b,g.runs=g.dirruns=0,P.push(a),P.length>$.cacheLength&&delete O[P.shift()],g};Z.matches=function(a,b){return Z(a,null,null,b)},Z.matchesSelector=function(a,b){return Z(b,null,null,[a]).length>0};var bm=function(a,b,e,f,g){a=a.replace(A,"$1");var h,i,j,k,l,m,p,q,r,s=a.match(C),t=a.match(E),u=b.nodeType;if(L.POS.test(a))return bf(a,b,e,f,s);if(f)h=n.call(f,0);else if(s&&s.length===1){if(t.length>1&&u===9&&!g&&(s=L.ID.exec(t[0]))){b=$.find.ID(s[1],b,g)[0];if(!b)return e;a=a.slice(t.shift().length)}q=(s=G.exec(t[0]))&&!s.index&&b.parentNode||b,r=t.pop(),m=r.split(":not")[0];for(j=0,k=$.order.length;j<k;j++){p=$.order[j];if(s=L[p].exec(m)){h=$.find[p]((s[1]||"").replace(K,""),q,g);if(h==null)continue;m===r&&(a=a.slice(0,a.length-r.length)+m.replace(L[p],""),a||o.apply(e,n.call(h,0)));break}}}if(a){i=bl(a,b,g),d=i.dirruns++,h==null&&(h=$.find.TAG("*",G.test(a)&&b.parentNode||b));for(j=0;l=h[j];j++)c=i.runs++,i(l,b)&&e.push(l)}return e};h.querySelectorAll&&function(){var a,b=bm,c=/'|\\/g,d=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,e=[],f=[":active"],g=i.matchesSelector||i.mozMatchesSelector||i.webkitMatchesSelector||i.oMatchesSelector||i.msMatchesSelector;T(function(a){a.innerHTML="<select><option selected></option></select>",a.querySelectorAll("[selected]").length||e.push("\\["+r+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),a.querySelectorAll(":checked").length||e.push(":checked")}),T(function(a){a.innerHTML="<p test=''></p>",a.querySelectorAll("[test^='']").length&&e.push("[*^$]="+r+"*(?:\"\"|'')"),a.innerHTML="<input type='hidden'>",a.querySelectorAll(":enabled").length||e.push(":enabled",":disabled")}),e=e.length&&new RegExp(e.join("|")),bm=function(a,d,f,g,h){if(!g&&!h&&(!e||!e.test(a)))if(d.nodeType===9)try{return o.apply(f,n.call(d.querySelectorAll(a),0)),f}catch(i){}else if(d.nodeType===1&&d.nodeName.toLowerCase()!=="object"){var j=d.getAttribute("id"),k=j||q,l=G.test(a)&&d.parentNode||d;j?k=k.replace(c,"\\$&"):d.setAttribute("id",k);try{return o.apply(f,n.call(l.querySelectorAll(a.replace(C,"[id='"+k+"'] $&")),0)),f}catch(i){}finally{j||d.removeAttribute("id")}}return b(a,d,f,g,h)},g&&(T(function(b){a=g.call(b,"div");try{g.call(b,"[test!='']:sizzle"),f.push($.match.PSEUDO)}catch(c){}}),f=new RegExp(f.join("|")),Z.matchesSelector=function(b,c){c=c.replace(d,"='$1']");if(!ba(b)&&!f.test(c)&&(!e||!e.test(c)))try{var h=g.call(b,c);if(h||a||b.document&&b.document.nodeType!==11)return h}catch(i){}return Z(c,null,null,[b]).length>0})}(),Z.attr=p.attr,p.find=Z,p.expr=Z.selectors,p.expr[":"]=p.expr.pseudos,p.unique=Z.uniqueSort,p.text=Z.getText,p.isXMLDoc=Z.isXML,p.contains=Z.contains}(a);var bc=/Until$/,bd=/^(?:parents|prev(?:Until|All))/,be=/^.[^:#\[\.,]*$/,bf=p.expr.match.needsContext,bg={children:!0,contents:!0,next:!0,prev:!0};p.fn.extend({find:function(a){var b,c,d,e,f,g,h=this;if(typeof a!="string")return p(a).filter(function(){for(b=0,c=h.length;b<c;b++)if(p.contains(h[b],this))return!0});g=this.pushStack("","find",a);for(b=0,c=this.length;b<c;b++){d=g.length,p.find(a,this[b],g);if(b>0)for(e=d;e<g.length;e++)for(f=0;f<d;f++)if(g[f]===g[e]){g.splice(e--,1);break}}return g},has:function(a){var b,c=p(a,this),d=c.length;return this.filter(function(){for(b=0;b<d;b++)if(p.contains(this,c[b]))return!0})},not:function(a){return this.pushStack(bj(this,a,!1),"not",a)},filter:function(a){return this.pushStack(bj(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?bf.test(a)?p(a,this.context).index(this[0])>=0:p.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c,d=0,e=this.length,f=[],g=bf.test(a)||typeof a!="string"?p(a,b||this.context):0;for(;d<e;d++){c=this[d];while(c&&c.ownerDocument&&c!==b&&c.nodeType!==11){if(g?g.index(c)>-1:p.find.matchesSelector(c,a)){f.push(c);break}c=c.parentNode}}return f=f.length>1?p.unique(f):f,this.pushStack(f,"closest",a)},index:function(a){return a?typeof a=="string"?p.inArray(this[0],p(a)):p.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(a,b){var c=typeof a=="string"?p(a,b):p.makeArray(a&&a.nodeType?[a]:a),d=p.merge(this.get(),c);return this.pushStack(bh(c[0])||bh(d[0])?d:p.unique(d))},addBack:function(a){return this.add(a==null?this.prevObject:this.prevObject.filter(a))}}),p.fn.andSelf=p.fn.addBack,p.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return p.dir(a,"parentNode")},parentsUntil:function(a,b,c){return p.dir(a,"parentNode",c)},next:function(a){return bi(a,"nextSibling")},prev:function(a){return bi(a,"previousSibling")},nextAll:function(a){return p.dir(a,"nextSibling")},prevAll:function(a){return p.dir(a,"previousSibling")},nextUntil:function(a,b,c){return p.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return p.dir(a,"previousSibling",c)},siblings:function(a){return p.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return p.sibling(a.firstChild)},contents:function(a){return p.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:p.merge([],a.childNodes)}},function(a,b){p.fn[a]=function(c,d){var e=p.map(this,b,c);return bc.test(a)||(d=c),d&&typeof d=="string"&&(e=p.filter(d,e)),e=this.length>1&&!bg[a]?p.unique(e):e,this.length>1&&bd.test(a)&&(e=e.reverse()),this.pushStack(e,a,k.call(arguments).join(","))}}),p.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),b.length===1?p.find.matchesSelector(b[0],a)?[b[0]]:[]:p.find.matches(a,b)},dir:function(a,c,d){var e=[],f=a[c];while(f&&f.nodeType!==9&&(d===b||f.nodeType!==1||!p(f).is(d)))f.nodeType===1&&e.push(f),f=f[c];return e},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var bl="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",bm=/ jQuery\d+="(?:null|\d+)"/g,bn=/^\s+/,bo=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bp=/<([\w:]+)/,bq=/<tbody/i,br=/<|&#?\w+;/,bs=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,bu=new RegExp("<(?:"+bl+")[\\s/>]","i"),bv=/^(?:checkbox|radio)$/,bw=/checked\s*(?:[^=]|=\s*.checked.)/i,bx=/\/(java|ecma)script/i,by=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,bz={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bA=bk(e),bB=bA.appendChild(e.createElement("div"));bz.optgroup=bz.option,bz.tbody=bz.tfoot=bz.colgroup=bz.caption=bz.thead,bz.th=bz.td,p.support.htmlSerialize||(bz._default=[1,"X<div>","</div>"]),p.fn.extend({text:function(a){return p.access(this,function(a){return a===b?p.text(this):this.empty().append((this[0]&&this[0].ownerDocument||e).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(p.isFunction(a))return this.each(function(b){p(this).wrapAll(a.call(this,b))});if(this[0]){var b=p(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return p.isFunction(a)?this.each(function(b){p(this).wrapInner(a.call(this,b))}):this.each(function(){var b=p(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=p.isFunction(a);return this.each(function(c){p(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){p.nodeName(this,"body")||p(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(a,this.firstChild)})},before:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(a,this),"before",this.selector)}},after:function(){if(!bh(this[0]))return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=p.clean(arguments);return this.pushStack(p.merge(this,a),"after",this.selector)}},remove:function(a,b){var c,d=0;for(;(c=this[d])!=null;d++)if(!a||p.filter(a,[c]).length)!b&&c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),p.cleanData([c])),c.parentNode&&c.parentNode.removeChild(c);return this},empty:function(){var a,b=0;for(;(a=this[b])!=null;b++){a.nodeType===1&&p.cleanData(a.getElementsByTagName("*"));while(a.firstChild)a.removeChild(a.firstChild)}return this},clone:function(a,b){return a=a==null?!1:a,b=b==null?a:b,this.map(function(){return p.clone(this,a,b)})},html:function(a){return p.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(bm,""):b;if(typeof a=="string"&&!bs.test(a)&&(p.support.htmlSerialize||!bu.test(a))&&(p.support.leadingWhitespace||!bn.test(a))&&!bz[(bp.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(bo,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(p.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){return bh(this[0])?this.length?this.pushStack(p(p.isFunction(a)?a():a),"replaceWith",a):this:p.isFunction(a)?this.each(function(b){var c=p(this),d=c.html();c.replaceWith(a.call(this,b,d))}):(typeof a!="string"&&(a=p(a).detach()),this.each(function(){var b=this.nextSibling,c=this.parentNode;p(this).remove(),b?p(b).before(a):p(c).append(a)}))},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){a=[].concat.apply([],a);var e,f,g,h,i=0,j=a[0],k=[],l=this.length;if(!p.support.checkClone&&l>1&&typeof j=="string"&&bw.test(j))return this.each(function(){p(this).domManip(a,c,d)});if(p.isFunction(j))return this.each(function(e){var f=p(this);a[0]=j.call(this,e,c?f.html():b),f.domManip(a,c,d)});if(this[0]){e=p.buildFragment(a,this,k),g=e.fragment,f=g.firstChild,g.childNodes.length===1&&(g=f);if(f){c=c&&p.nodeName(f,"tr");for(h=e.cacheable||l-1;i<l;i++)d.call(c&&p.nodeName(this[i],"table")?bC(this[i],"tbody"):this[i],i===h?g:p.clone(g,!0,!0))}g=f=null,k.length&&p.each(k,function(a,b){b.src?p.ajax?p.ajax({url:b.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):p.error("no ajax"):p.globalEval((b.text||b.textContent||b.innerHTML||"").replace(by,"")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),p.buildFragment=function(a,c,d){var f,g,h,i=a[0];return c=c||e,c=(c[0]||c).ownerDocument||c[0]||c,typeof c.createDocumentFragment=="undefined"&&(c=e),a.length===1&&typeof i=="string"&&i.length<512&&c===e&&i.charAt(0)==="<"&&!bt.test(i)&&(p.support.checkClone||!bw.test(i))&&(p.support.html5Clone||!bu.test(i))&&(g=!0,f=p.fragments[i],h=f!==b),f||(f=c.createDocumentFragment(),p.clean(a,c,f,d),g&&(p.fragments[i]=h&&f)),{fragment:f,cacheable:g}},p.fragments={},p.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){p.fn[a]=function(c){var d,e=0,f=[],g=p(c),h=g.length,i=this.length===1&&this[0].parentNode;if((i==null||i&&i.nodeType===11&&i.childNodes.length===1)&&h===1)return g[b](this[0]),this;for(;e<h;e++)d=(e>0?this.clone(!0):this).get(),p(g[e])[b](d),f=f.concat(d);return this.pushStack(f,a,g.selector)}}),p.extend({clone:function(a,b,c){var d,e,f,g;p.support.html5Clone||p.isXMLDoc(a)||!bu.test("<"+a.nodeName+">")?g=a.cloneNode(!0):(bB.innerHTML=a.outerHTML,bB.removeChild(g=bB.firstChild));if((!p.support.noCloneEvent||!p.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!p.isXMLDoc(a)){bE(a,g),d=bF(a),e=bF(g);for(f=0;d[f];++f)e[f]&&bE(d[f],e[f])}if(b){bD(a,g);if(c){d=bF(a),e=bF(g);for(f=0;d[f];++f)bD(d[f],e[f])}}return d=e=null,g},clean:function(a,b,c,d){var f,g,h,i,j,k,l,m,n,o,q,r,s=0,t=[];if(!b||typeof b.createDocumentFragment=="undefined")b=e;for(g=b===e&&bA;(h=a[s])!=null;s++){typeof h=="number"&&(h+="");if(!h)continue;if(typeof h=="string")if(!br.test(h))h=b.createTextNode(h);else{g=g||bk(b),l=l||g.appendChild(b.createElement("div")),h=h.replace(bo,"<$1></$2>"),i=(bp.exec(h)||["",""])[1].toLowerCase(),j=bz[i]||bz._default,k=j[0],l.innerHTML=j[1]+h+j[2];while(k--)l=l.lastChild;if(!p.support.tbody){m=bq.test(h),n=i==="table"&&!m?l.firstChild&&l.firstChild.childNodes:j[1]==="<table>"&&!m?l.childNodes:[];for(f=n.length-1;f>=0;--f)p.nodeName(n[f],"tbody")&&!n[f].childNodes.length&&n[f].parentNode.removeChild(n[f])}!p.support.leadingWhitespace&&bn.test(h)&&l.insertBefore(b.createTextNode(bn.exec(h)[0]),l.firstChild),h=l.childNodes,l=g.lastChild}h.nodeType?t.push(h):t=p.merge(t,h)}l&&(g.removeChild(l),h=l=g=null);if(!p.support.appendChecked)for(s=0;(h=t[s])!=null;s++)p.nodeName(h,"input")?bG(h):typeof h.getElementsByTagName!="undefined"&&p.grep(h.getElementsByTagName("input"),bG);if(c){q=function(a){if(!a.type||bx.test(a.type))return d?d.push(a.parentNode?a.parentNode.removeChild(a):a):c.appendChild(a)};for(s=0;(h=t[s])!=null;s++)if(!p.nodeName(h,"script")||!q(h))c.appendChild(h),typeof h.getElementsByTagName!="undefined"&&(r=p.grep(p.merge([],h.getElementsByTagName("script")),q),t.splice.apply(t,[s+1,0].concat(r)),s+=r.length)}return t},cleanData:function(a,b){var c,d,e,f,g=0,h=p.expando,i=p.cache,j=p.support.deleteExpando,k=p.event.special;for(;(e=a[g])!=null;g++)if(b||p.acceptData(e)){d=e[h],c=d&&i[d];if(c){if(c.events)for(f in c.events)k[f]?p.event.remove(e,f):p.removeEvent(e,f,c.handle);i[d]&&(delete i[d],j?delete e[h]:e.removeAttribute?e.removeAttribute(h):e[h]=null,p.deletedIds.push(d))}}}}),function(){var a,b;p.uaMatch=function(a){a=a.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},a=p.uaMatch(g.userAgent),b={},a.browser&&(b[a.browser]=!0,b.version=a.version),b.webkit&&(b.safari=!0),p.browser=b,p.sub=function(){function a(b,c){return new a.fn.init(b,c)}p.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function c(c,d){return d&&d instanceof p&&!(d instanceof a)&&(d=a(d)),p.fn.init.call(this,c,d,b)},a.fn.init.prototype=a.fn;var b=a(e);return a}}();var bH,bI,bJ,bK=/alpha\([^)]*\)/i,bL=/opacity=([^)]*)/,bM=/^(top|right|bottom|left)$/,bN=/^margin/,bO=new RegExp("^("+q+")(.*)$","i"),bP=new RegExp("^("+q+")(?!px)[a-z%]+$","i"),bQ=new RegExp("^([-+])=("+q+")","i"),bR={},bS={position:"absolute",visibility:"hidden",display:"block"},bT={letterSpacing:0,fontWeight:400,lineHeight:1},bU=["Top","Right","Bottom","Left"],bV=["Webkit","O","Moz","ms"],bW=p.fn.toggle;p.fn.extend({css:function(a,c){return p.access(this,function(a,c,d){return d!==b?p.style(a,c,d):p.css(a,c)},a,c,arguments.length>1)},show:function(){return bZ(this,!0)},hide:function(){return bZ(this)},toggle:function(a,b){var c=typeof a=="boolean";return p.isFunction(a)&&p.isFunction(b)?bW.apply(this,arguments):this.each(function(){(c?a:bY(this))?p(this).show():p(this).hide()})}}),p.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bH(a,"opacity");return c===""?"1":c}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":p.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!a||a.nodeType===3||a.nodeType===8||!a.style)return;var f,g,h,i=p.camelCase(c),j=a.style;c=p.cssProps[i]||(p.cssProps[i]=bX(j,i)),h=p.cssHooks[c]||p.cssHooks[i];if(d===b)return h&&"get"in h&&(f=h.get(a,!1,e))!==b?f:j[c];g=typeof d,g==="string"&&(f=bQ.exec(d))&&(d=(f[1]+1)*f[2]+parseFloat(p.css(a,c)),g="number");if(d==null||g==="number"&&isNaN(d))return;g==="number"&&!p.cssNumber[i]&&(d+="px");if(!h||!("set"in h)||(d=h.set(a,d,e))!==b)try{j[c]=d}catch(k){}},css:function(a,c,d,e){var f,g,h,i=p.camelCase(c);return c=p.cssProps[i]||(p.cssProps[i]=bX(a.style,i)),h=p.cssHooks[c]||p.cssHooks[i],h&&"get"in h&&(f=h.get(a,!0,e)),f===b&&(f=bH(a,c)),f==="normal"&&c in bT&&(f=bT[c]),d||e!==b?(g=parseFloat(f),d||p.isNumeric(g)?g||0:f):f},swap:function(a,b,c){var d,e,f={};for(e in b)f[e]=a.style[e],a.style[e]=b[e];d=c.call(a);for(e in b)a.style[e]=f[e];return d}}),a.getComputedStyle?bH=function(a,b){var c,d,e,f,g=getComputedStyle(a,null),h=a.style;return g&&(c=g[b],c===""&&!p.contains(a.ownerDocument.documentElement,a)&&(c=p.style(a,b)),bP.test(c)&&bN.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=c,c=g.width,h.width=d,h.minWidth=e,h.maxWidth=f)),c}:e.documentElement.currentStyle&&(bH=function(a,b){var c,d,e=a.currentStyle&&a.currentStyle[b],f=a.style;return e==null&&f&&f[b]&&(e=f[b]),bP.test(e)&&!bM.test(b)&&(c=f.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":e,e=f.pixelLeft+"px",f.left=c,d&&(a.runtimeStyle.left=d)),e===""?"auto":e}),p.each(["height","width"],function(a,b){p.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0||bH(a,"display")!=="none"?ca(a,b,d):p.swap(a,bS,function(){return ca(a,b,d)})},set:function(a,c,d){return b$(a,c,d?b_(a,b,d,p.support.boxSizing&&p.css(a,"boxSizing")==="border-box"):0)}}}),p.support.opacity||(p.cssHooks.opacity={get:function(a,b){return bL.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=p.isNumeric(b)?"alpha(opacity="+b*100+")":"",f=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&p.trim(f.replace(bK,""))===""&&c.removeAttribute){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bK.test(f)?f.replace(bK,e):f+" "+e}}),p(function(){p.support.reliableMarginRight||(p.cssHooks.marginRight={get:function(a,b){return p.swap(a,{display:"inline-block"},function(){if(b)return bH(a,"marginRight")})}}),!p.support.pixelPosition&&p.fn.position&&p.each(["top","left"],function(a,b){p.cssHooks[b]={get:function(a,c){if(c){var d=bH(a,b);return bP.test(d)?p(a).position()[b]+"px":d}}}})}),p.expr&&p.expr.filters&&(p.expr.filters.hidden=function(a){return a.offsetWidth===0&&a.offsetHeight===0||!p.support.reliableHiddenOffsets&&(a.style&&a.style.display||bH(a,"display"))==="none"},p.expr.filters.visible=function(a){return!p.expr.filters.hidden(a)}),p.each({margin:"",padding:"",border:"Width"},function(a,b){p.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bU[d]+b]=e[d]||e[d-2]||e[0];return f}},bN.test(a)||(p.cssHooks[a+b].set=b$)});var cc=/%20/g,cd=/\[\]$/,ce=/\r?\n/g,cf=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,cg=/^(?:select|textarea)/i;p.fn.extend({serialize:function(){return p.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?p.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||cg.test(this.nodeName)||cf.test(this.type))}).map(function(a,b){var c=p(this).val();return c==null?null:p.isArray(c)?p.map(c,function(a,c){return{name:b.name,value:a.replace(ce,"\r\n")}}):{name:b.name,value:c.replace(ce,"\r\n")}}).get()}}),p.param=function(a,c){var d,e=[],f=function(a,b){b=p.isFunction(b)?b():b==null?"":b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=p.ajaxSettings&&p.ajaxSettings.traditional);if(p.isArray(a)||a.jquery&&!p.isPlainObject(a))p.each(a,function(){f(this.name,this.value)});else for(d in a)ch(d,a[d],c,f);return e.join("&").replace(cc,"+")};var ci,cj,ck=/#.*$/,cl=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,cm=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,cn=/^(?:GET|HEAD)$/,co=/^\/\//,cp=/\?/,cq=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,cr=/([?&])_=[^&]*/,cs=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,ct=p.fn.load,cu={},cv={},cw=["*/"]+["*"];try{ci=f.href}catch(cx){ci=e.createElement("a"),ci.href="",ci=ci.href}cj=cs.exec(ci.toLowerCase())||[],p.fn.load=function(a,c,d){if(typeof a!="string"&&ct)return ct.apply(this,arguments);if(!this.length)return this;var e,f,g,h=this,i=a.indexOf(" ");return i>=0&&(e=a.slice(i,a.length),a=a.slice(0,i)),p.isFunction(c)?(d=c,c=b):typeof c=="object"&&(f="POST"),p.ajax({url:a,type:f,dataType:"html",data:c,complete:function(a,b){d&&h.each(d,g||[a.responseText,b,a])}}).done(function(a){g=arguments,h.html(e?p("<div>").append(a.replace(cq,"")).find(e):a)}),this},p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){p.fn[b]=function(a){return this.on(b,a)}}),p.each(["get","post"],function(a,c){p[c]=function(a,d,e,f){return p.isFunction(d)&&(f=f||e,e=d,d=b),p.ajax({type:c,url:a,data:d,success:e,dataType:f})}}),p.extend({getScript:function(a,c){return p.get(a,b,c,"script")},getJSON:function(a,b,c){return p.get(a,b,c,"json")},ajaxSetup:function(a,b){return b?cA(a,p.ajaxSettings):(b=a,a=p.ajaxSettings),cA(a,b),a},ajaxSettings:{url:ci,isLocal:cm.test(cj[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":cw},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":p.parseJSON,"text xml":p.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:cy(cu),ajaxTransport:cy(cv),ajax:function(a,c){function y(a,c,f,i){var k,s,t,u,w,y=c;if(v===2)return;v=2,h&&clearTimeout(h),g=b,e=i||"",x.readyState=a>0?4:0,f&&(u=cB(l,x,f));if(a>=200&&a<300||a===304)l.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(p.lastModified[d]=w),w=x.getResponseHeader("Etag"),w&&(p.etag[d]=w)),a===304?(y="notmodified",k=!0):(k=cC(l,u),y=k.state,s=k.data,t=k.error,k=!t);else{t=y;if(!y||a)y="error",a<0&&(a=0)}x.status=a,x.statusText=""+(c||y),k?o.resolveWith(m,[s,y,x]):o.rejectWith(m,[x,y,t]),x.statusCode(r),r=b,j&&n.trigger("ajax"+(k?"Success":"Error"),[x,l,k?s:t]),q.fireWith(m,[x,y]),j&&(n.trigger("ajaxComplete",[x,l]),--p.active||p.event.trigger("ajaxStop"))}typeof a=="object"&&(c=a,a=b),c=c||{};var d,e,f,g,h,i,j,k,l=p.ajaxSetup({},c),m=l.context||l,n=m!==l&&(m.nodeType||m instanceof p)?p(m):p.event,o=p.Deferred(),q=p.Callbacks("once memory"),r=l.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,setRequestHeader:function(a,b){if(!v){var c=a.toLowerCase();a=u[c]=u[c]||a,t[a]=b}return this},getAllResponseHeaders:function(){return v===2?e:null},getResponseHeader:function(a){var c;if(v===2){if(!f){f={};while(c=cl.exec(e))f[c[1].toLowerCase()]=c[2]}c=f[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){return v||(l.mimeType=a),this},abort:function(a){return a=a||w,g&&g.abort(a),y(0,a),this}};o.promise(x),x.success=x.done,x.error=x.fail,x.complete=q.add,x.statusCode=function(a){if(a){var b;if(v<2)for(b in a)r[b]=[r[b],a[b]];else b=a[x.status],x.always(b)}return this},l.url=((a||l.url)+"").replace(ck,"").replace(co,cj[1]+"//"),l.dataTypes=p.trim(l.dataType||"*").toLowerCase().split(s),l.crossDomain==null&&(i=cs.exec(l.url.toLowerCase()),l.crossDomain=!(!i||i[1]==cj[1]&&i[2]==cj[2]&&(i[3]||(i[1]==="http:"?80:443))==(cj[3]||(cj[1]==="http:"?80:443)))),l.data&&l.processData&&typeof l.data!="string"&&(l.data=p.param(l.data,l.traditional)),cz(cu,l,c,x);if(v===2)return x;j=l.global,l.type=l.type.toUpperCase(),l.hasContent=!cn.test(l.type),j&&p.active++===0&&p.event.trigger("ajaxStart");if(!l.hasContent){l.data&&(l.url+=(cp.test(l.url)?"&":"?")+l.data,delete l.data),d=l.url;if(l.cache===!1){var z=p.now(),A=l.url.replace(cr,"$1_="+z);l.url=A+(A===l.url?(cp.test(l.url)?"&":"?")+"_="+z:"")}}(l.data&&l.hasContent&&l.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",l.contentType),l.ifModified&&(d=d||l.url,p.lastModified[d]&&x.setRequestHeader("If-Modified-Since",p.lastModified[d]),p.etag[d]&&x.setRequestHeader("If-None-Match",p.etag[d])),x.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+(l.dataTypes[0]!=="*"?", "+cw+"; q=0.01":""):l.accepts["*"]);for(k in l.headers)x.setRequestHeader(k,l.headers[k]);if(!l.beforeSend||l.beforeSend.call(m,x,l)!==!1&&v!==2){w="abort";for(k in{success:1,error:1,complete:1})x[k](l[k]);g=cz(cv,l,c,x);if(!g)y(-1,"No Transport");else{x.readyState=1,j&&n.trigger("ajaxSend",[x,l]),l.async&&l.timeout>0&&(h=setTimeout(function(){x.abort("timeout")},l.timeout));try{v=1,g.send(t,y)}catch(B){if(v<2)y(-1,B);else throw B}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var cD=[],cE=/\?/,cF=/(=)\?(?=&|$)|\?\?/,cG=p.now();p.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=cD.pop()||p.expando+"_"+cG++;return this[a]=!0,a}}),p.ajaxPrefilter("json jsonp",function(c,d,e){var f,g,h,i=c.data,j=c.url,k=c.jsonp!==!1,l=k&&cF.test(j),m=k&&!l&&typeof i=="string"&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&cF.test(i);if(c.dataTypes[0]==="jsonp"||l||m)return f=c.jsonpCallback=p.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,g=a[f],l?c.url=j.replace(cF,"$1"+f):m?c.data=i.replace(cF,"$1"+f):k&&(c.url+=(cE.test(j)?"&":"?")+c.jsonp+"="+f),c.converters["script json"]=function(){return h||p.error(f+" was not called"),h[0]},c.dataTypes[0]="json",a[f]=function(){h=arguments},e.always(function(){a[f]=g,c[f]&&(c.jsonpCallback=d.jsonpCallback,cD.push(f)),h&&p.isFunction(g)&&g(h[0]),h=g=b}),"script"}),p.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){return p.globalEval(a),a}}}),p.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),p.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=e.head||e.getElementsByTagName("head")[0]||e.documentElement;return{send:function(f,g){c=e.createElement("script"),c.async="async",a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,e){if(e||!c.readyState||/loaded|complete/.test(c.readyState))c.onload=c.onreadystatechange=null,d&&c.parentNode&&d.removeChild(c),c=b,e||g(200,"success")},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(0,1)}}}});var cH,cI=a.ActiveXObject?function(){for(var a in cH)cH[a](0,1)}:!1,cJ=0;p.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&cK()||cL()}:cK,function(a){p.extend(p.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(p.ajaxSettings.xhr()),p.support.ajax&&p.ajaxTransport(function(c){if(!c.crossDomain||p.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async);if(c.xhrFields)for(h in c.xhrFields)i[h]=c.xhrFields[h];c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e)i.setRequestHeader(h,e[h])}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l,m;try{if(d&&(e||i.readyState===4)){d=b,g&&(i.onreadystatechange=p.noop,cI&&delete cH[g]);if(e)i.readyState!==4&&i.abort();else{h=i.status,k=i.getAllResponseHeaders(),l={},m=i.responseXML,m&&m.documentElement&&(l.xml=m);try{l.text=i.responseText}catch(a){}try{j=i.statusText}catch(n){j=""}!h&&c.isLocal&&!c.crossDomain?h=l.text?200:404:h===1223&&(h=204)}}}catch(o){e||f(-1,o)}l&&f(h,j,l,k)},c.async?i.readyState===4?setTimeout(d,0):(g=++cJ,cI&&(cH||(cH={},p(a).unload(cI)),cH[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(0,1)}}}});var cM,cN,cO=/^(?:toggle|show|hide)$/,cP=new RegExp("^(?:([-+])=|)("+q+")([a-z%]*)$","i"),cQ=/queueHooks$/,cR=[cX],cS={"*":[function(a,b){var c,d,e,f=this.createTween(a,b),g=cP.exec(b),h=f.cur(),i=+h||0,j=1;if(g){c=+g[2],d=g[3]||(p.cssNumber[a]?"":"px");if(d!=="px"&&i){i=p.css(f.elem,a,!0)||c||1;do e=j=j||".5",i=i/j,p.style(f.elem,a,i+d),j=f.cur()/h;while(j!==1&&j!==e)}f.unit=d,f.start=i,f.end=g[1]?i+(g[1]+1)*c:c}return f}]};p.Animation=p.extend(cV,{tweener:function(a,b){p.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");var c,d=0,e=a.length;for(;d<e;d++)c=a[d],cS[c]=cS[c]||[],cS[c].unshift(b)},prefilter:function(a,b){b?cR.unshift(a):cR.push(a)}}),p.Tween=cY,cY.prototype={constructor:cY,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(p.cssNumber[c]?"":"px")},cur:function(){var a=cY.propHooks[this.prop];return a&&a.get?a.get(this):cY.propHooks._default.get(this)},run:function(a){var b,c=cY.propHooks[this.prop];return this.pos=b=p.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration),this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):cY.propHooks._default.set(this),this}},cY.prototype.init.prototype=cY.prototype,cY.propHooks={_default:{get:function(a){var b;return a.elem[a.prop]==null||!!a.elem.style&&a.elem.style[a.prop]!=null?(b=p.css(a.elem,a.prop,!1,""),!b||b==="auto"?0:b):a.elem[a.prop]},set:function(a){p.fx.step[a.prop]?p.fx.step[a.prop](a):a.elem.style&&(a.elem.style[p.cssProps[a.prop]]!=null||p.cssHooks[a.prop])?p.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},cY.propHooks.scrollTop=cY.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},p.each(["toggle","show","hide"],function(a,b){var c=p.fn[b];p.fn[b]=function(d,e,f){return d==null||typeof d=="boolean"||!a&&p.isFunction(d)&&p.isFunction(e)?c.apply(this,arguments):this.animate(cZ(b,!0),d,e,f)}}),p.fn.extend({fadeTo:function(a,b,c,d){return this.filter(bY).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=p.isEmptyObject(a),f=p.speed(b,c,d),g=function(){var b=cV(this,p.extend({},a),f);e&&b.stop(!0)};return e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,c,d){var e=function(a){var b=a.stop;delete a.stop,b(d)};return typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,c=a!=null&&a+"queueHooks",f=p.timers,g=p._data(this);if(c)g[c]&&g[c].stop&&e(g[c]);else for(c in g)g[c]&&g[c].stop&&cQ.test(c)&&e(g[c]);for(c=f.length;c--;)f[c].elem===this&&(a==null||f[c].queue===a)&&(f[c].anim.stop(d),b=!1,f.splice(c,1));(b||!d)&&p.dequeue(this,a)})}}),p.each({slideDown:cZ("show"),slideUp:cZ("hide"),slideToggle:cZ("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){p.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),p.speed=function(a,b,c){var d=a&&typeof a=="object"?p.extend({},a):{complete:c||!c&&b||p.isFunction(a)&&a,duration:a,easing:c&&b||b&&!p.isFunction(b)&&b};d.duration=p.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in p.fx.speeds?p.fx.speeds[d.duration]:p.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";return d.old=d.complete,d.complete=function(){p.isFunction(d.old)&&d.old.call(this),d.queue&&p.dequeue(this,d.queue)},d},p.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},p.timers=[],p.fx=cY.prototype.init,p.fx.tick=function(){var a,b=p.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||p.fx.stop()},p.fx.timer=function(a){a()&&p.timers.push(a)&&!cN&&(cN=setInterval(p.fx.tick,p.fx.interval))},p.fx.interval=13,p.fx.stop=function(){clearInterval(cN),cN=null},p.fx.speeds={slow:600,fast:200,_default:400},p.fx.step={},p.expr&&p.expr.filters&&(p.expr.filters.animated=function(a){return p.grep(p.timers,function(b){return a===b.elem}).length});var c$=/^(?:body|html)$/i;p.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){p.offset.setOffset(this,a,b)});var c,d,e,f,g,h,i,j,k,l,m=this[0],n=m&&m.ownerDocument;if(!n)return;return(e=n.body)===m?p.offset.bodyOffset(m):(d=n.documentElement,p.contains(d,m)?(c=m.getBoundingClientRect(),f=c_(n),g=d.clientTop||e.clientTop||0,h=d.clientLeft||e.clientLeft||0,i=f.pageYOffset||d.scrollTop,j=f.pageXOffset||d.scrollLeft,k=c.top+i-g,l=c.left+j-h,{top:k,left:l}):{top:0,left:0})},p.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;return p.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(p.css(a,"marginTop"))||0,c+=parseFloat(p.css(a,"marginLeft"))||0),{top:b,left:c}},setOffset:function(a,b,c){var d=p.css(a,"position");d==="static"&&(a.style.position="relative");var e=p(a),f=e.offset(),g=p.css(a,"top"),h=p.css(a,"left"),i=(d==="absolute"||d==="fixed")&&p.inArray("auto",[g,h])>-1,j={},k={},l,m;i?(k=e.position(),l=k.top,m=k.left):(l=parseFloat(g)||0,m=parseFloat(h)||0),p.isFunction(b)&&(b=b.call(a,c,f)),b.top!=null&&(j.top=b.top-f.top+l),b.left!=null&&(j.left=b.left-f.left+m),"using"in b?b.using.call(a,j):e.css(j)}},p.fn.extend({position:function(){if(!this[0])return;var a=this[0],b=this.offsetParent(),c=this.offset(),d=c$.test(b[0].nodeName)?{top:0,left:0}:b.offset();return c.top-=parseFloat(p.css(a,"marginTop"))||0,c.left-=parseFloat(p.css(a,"marginLeft"))||0,d.top+=parseFloat(p.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(p.css(b[0],"borderLeftWidth"))||0,{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||e.body;while(a&&!c$.test(a.nodeName)&&p.css(a,"position")==="static")a=a.offsetParent;return a||e.body})}}),p.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);p.fn[a]=function(e){return p.access(this,function(a,e,f){var g=c_(a);if(f===b)return g?c in g?g[c]:g.document.documentElement[e]:a[e];g?g.scrollTo(d?p(g).scrollLeft():f,d?f:p(g).scrollTop()):a[e]=f},a,e,arguments.length,null)}}),p.each({Height:"height",Width:"width"},function(a,c){p.each({padding:"inner"+a,content:c,"":"outer"+a},function(d,e){p.fn[e]=function(e,f){var g=arguments.length&&(d||typeof e!="boolean"),h=d||(e===!0||f===!0?"margin":"border");return p.access(this,function(c,d,e){var f;return p.isWindow(c)?c.document.documentElement["client"+a]:c.nodeType===9?(f=c.documentElement,Math.max(c.body["scroll"+a],f["scroll"+a],c.body["offset"+a],f["offset"+a],f["client"+a])):e===b?p.css(c,d,e,h):p.style(c,d,e,h)},c,g?e:b,g)}})}),a.jQuery=a.$=p,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return p})})(window);
},{}],4:[function(require,module,exports){
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

},{}],5:[function(require,module,exports){
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function B(a){i.cssText=a}function C(a,b){return B(m.join(a+";")+(b||""))}function D(a,b){return typeof a===b}function E(a,b){return!!~(""+a).indexOf(b)}function F(a,b){for(var d in a){var e=a[d];if(!E(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function G(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:D(f,"function")?f.bind(d||b):f}return!1}function H(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return D(b,"string")||D(b,"undefined")?F(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),G(e,b,c))}function I(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)t[c[d]]=c[d]in j;return t.list&&(t.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),t}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,g,h,i=a.length;d<i;d++)j.setAttribute("type",g=a[d]),e=j.type!=="text",e&&(j.value=k,j.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(g)&&j.style.WebkitAppearance!==c?(f.appendChild(j),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(j,null).WebkitAppearance!=="textfield"&&j.offsetHeight!==0,f.removeChild(j)):/^(search|tel)$/.test(g)||(/^(url|email)$/.test(g)?e=j.checkValidity&&j.checkValidity()===!1:e=j.value!=k)),s[a[d]]=!!e;return s}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j=b.createElement("input"),k=":)",l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={svg:"http://www.w3.org/2000/svg"},r={},s={},t={},u=[],v=u.slice,w,x=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},y=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=D(e[d],"function"),D(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),z={}.hasOwnProperty,A;!D(z,"undefined")&&!D(z.call,"undefined")?A=function(a,b){return z.call(a,b)}:A=function(a,b){return b in a&&D(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=v.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(v.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(v.call(arguments)))};return e}),r.flexbox=function(){return H("flexWrap")},r.flexboxlegacy=function(){return H("boxDirection")},r.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},r.canvastext=function(){return!!e.canvas&&!!D(b.createElement("canvas").getContext("2d").fillText,"function")},r.webgl=function(){return!!a.WebGLRenderingContext},r.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:x(["@media (",m.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},r.geolocation=function(){return"geolocation"in navigator},r.postmessage=function(){return!!a.postMessage},r.websqldatabase=function(){return!!a.openDatabase},r.indexedDB=function(){return!!H("indexedDB",a)},r.hashchange=function(){return y("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},r.history=function(){return!!a.history&&!!history.pushState},r.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},r.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},r.rgba=function(){return B("background-color:rgba(150,255,150,.5)"),E(i.backgroundColor,"rgba")},r.hsla=function(){return B("background-color:hsla(120,40%,100%,.5)"),E(i.backgroundColor,"rgba")||E(i.backgroundColor,"hsla")},r.multiplebgs=function(){return B("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(i.background)},r.backgroundsize=function(){return H("backgroundSize")},r.borderimage=function(){return H("borderImage")},r.borderradius=function(){return H("borderRadius")},r.boxshadow=function(){return H("boxShadow")},r.textshadow=function(){return b.createElement("div").style.textShadow===""},r.opacity=function(){return C("opacity:.55"),/^0.55$/.test(i.opacity)},r.cssanimations=function(){return H("animationName")},r.csscolumns=function(){return H("columnCount")},r.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return B((a+"-webkit- ".split(" ").join(b+a)+m.join(c+a)).slice(0,-a.length)),E(i.backgroundImage,"gradient")},r.cssreflections=function(){return H("boxReflect")},r.csstransforms=function(){return!!H("transform")},r.csstransforms3d=function(){var a=!!H("perspective");return a&&"webkitPerspective"in f.style&&x("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},r.csstransitions=function(){return H("transition")},r.fontface=function(){var a;return x('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},r.generatedcontent=function(){var a;return x(["#",g,"{font:0/0 a}#",g,':after{content:"',k,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},r.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},r.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},r.localstorage=function(){try{return localStorage.setItem(g,g),localStorage.removeItem(g),!0}catch(a){return!1}},r.sessionstorage=function(){try{return sessionStorage.setItem(g,g),sessionStorage.removeItem(g),!0}catch(a){return!1}},r.webworkers=function(){return!!a.Worker},r.applicationcache=function(){return!!a.applicationCache},r.svg=function(){return!!b.createElementNS&&!!b.createElementNS(q.svg,"svg").createSVGRect},r.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==q.svg},r.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(l.call(b.createElementNS(q.svg,"animate")))},r.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(l.call(b.createElementNS(q.svg,"clipPath")))};for(var J in r)A(r,J)&&(w=J.toLowerCase(),e[w]=r[J](),u.push((e[w]?"":"no-")+w));return e.input||I(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)A(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},B(""),h=j=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.hasEvent=y,e.testProp=function(a){return F([a])},e.testAllProps=H,e.testStyles=x,e}(this,this.document);
},{}],6:[function(require,module,exports){
/*
 * Зависит от jquery, jquery.mousewheel и jquery.custom.
 *
 * Важное ограничение: пока что слои со скоростями меньше единицы
 * (передвигающиеся медленее, чем зритель)
 * работают только будучи размещены прямо внутри слайда,
 * а не в глубине верстки.
 *
 * Copyright (c) 2013 Hot Dot Licensed MIT
 * http://hotdot.pro/
 * */

var paraSample = {}, utilLib = {},

	windowWidth, 
	windowHeight, 
	windowAspect, 
	baseFontSize,
	para, 
	wheelstep,
	aRCDescript,
/*
 * Хранит картинки, которые хоть и не видны,
 * но будут загружены при загрузке страницы
 */
	hiddenImagesContainer,


	iPadMode = navigator.userAgent.match(/iP/i), 
	supportsTouchEvents = 
		('ontouchstart' in document.documentElement) || ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|ZuneWP7/i.test(navigator.userAgent) );

/* */

(function(nmspc) {

	var alertFallback = false;
	if ( typeof console === "undefined" || typeof console.log === "undefined") {
		alert('oh no');
		console = {};
		if (alertFallback) {
			console.log = function(msg) {
				alert(msg);
			};
		} else {
			console.log = function() {
			};
		}
	}

	/* */

	nmspc.DEVICE_TYPES = {
		iPad : 'iPad',
		iPhone: 'iPhone',
		android : 'android',
		desktop : 'desktop',
		wPhone : 'wPhone'
	}
	
	nmspc.BROWSERS = {
		safari: 'Safari',
		chrome: 'Chrome'
	}
	
	nmspc.OS_TYPES = {
		mac: 'Mac OS',
		win: 'Windows'
	}

	nmspc.deviceDescription = {
		type : undefined,
		browser : undefined,
		touchCapable : false
	}
	
	nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.desktop;

	if (navigator.userAgent.indexOf('iPad') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.iPad;
	} else if (navigator.userAgent.indexOf('iPhone') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.iPhone;
	} else if (navigator.userAgent.indexOf('Android') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.android;
	} else if (navigator.userAgent.indexOf('Windows Phone') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.wPhone;
	}

	if (navigator.userAgent.indexOf('Chrome') > -1 ){
		nmspc.deviceDescription.browser = nmspc.BROWSERS.chrome;
	} else if (navigator.userAgent.indexOf('Safari') > -1) {
		nmspc.deviceDescription.browser = nmspc.BROWSERS.safari;
	}
	
	nmspc.deviceDescription.os = undefined;
	
	if (navigator.userAgent.indexOf('Mac OS') > -1 ){
		nmspc.deviceDescription.os = nmspc.OS_TYPES.mac;
	} else if (navigator.userAgent.indexOf('Windows') > -1 ){
		nmspc.deviceDescription.os = nmspc.OS_TYPES.win;
	}
	
	if (( typeof Touch == "object") || ('ontouchstart' in document.documentElement)) {
		nmspc.deviceDescription.touchCapable = true;
	}

	/* */

	nmspc.debu = window.location.href.indexOf('?debug') > -1;
	var $debWindow;

	nmspc.debLog = function(str) {
		if (!$debWindow)
			return;
		$debWindow.prepend($('<p>' + str + '</p>'));
	}

	$(function() {

		if (nmspc.debu) {

			$debWindow = $('<div></div>').css({
				position : 'fixed',
				top : 0,
				right : 0,
				display : 'inline-block',
				width : 300,
				'min-height' : 100,
				font : '12px sans-serif',
				color : 'rgba(255,255,255,.8)',
				'background-color' : 'rgba(0,0,0,.5)',
				'z-index' : 999,
				'max-height' : '50%',
				'overflow-y' : 'scroll'
			});
			$('body').append($debWindow);

		}

		nmspc.debLog(nmspc.deviceDescription.type);
		nmspc.debLog('Standard-touch-capable: ' + nmspc.deviceDescription.touchCapable);

	})

})(utilLib);


(function(arg){
	
	if(!window.Modernizr) return;
	
	if(window.Modernizr.csstransforms3d){
		paraSample.bestTranslateType = 'translate3d';
	} else if(window.Modernizr.csstransforms){
		paraSample.bestTranslateType = 'translate';
	} else {
		paraSample.bestTranslateType = 'left';
	}
	
	// translate3d, left, translate
	
	var translateType,
		transformString;
	
	arg.applyHorizontalShift = function(value, $div, translateType){
		
		
		translateType = translateType || paraSample.bestTranslateType;
		
		if (value=='' || translateType != 'left') {

			if (value==''){
				transformString = '';
			} else if (translateType === 'translate3d') {
				transformString = 'translate3d(' + value + 'px, 0px, 0px)';
			} else if (translateType === 'translate') {
				transformString = 'translate(' + value + 'px, 0px)';
			} else if (translateType === 'translateX') {
				transformString = 'translateX(' + value + 'px)';
			} else 
				return;

			$div.css({

				WebkitTransform : transformString,
				MozTransform : transformString,
				Transform : transformString,
				msTransform : transformString,
				OTransform : transformString,
				transform : transformString

			});

		}
		
		if (value=='' || translateType == 'left') {

			$div.css('left', value);

		}
		
	}
	
})(paraSample);


/* */

paraSample.preloaderEnabled = true;

paraSample.settings = {
	
	removeScrollbar: 
		utilLib.deviceDescription.type != utilLib.DEVICE_TYPES.wPhone,
	
	disableAutoHashChange: utilLib.deviceDescription.type == utilLib.DEVICE_TYPES.android, 
		
	touchNotScrollMode: 
		(utilLib.deviceDescription.type != utilLib.DEVICE_TYPES.desktop) 
		&& utilLib.deviceDescription.touchCapable,

	mousewheelSlowness: {
		windows: 15,
		mac: 60
	},
	
	pauseSideAnimationsWhenMoving: true
	
}

function parallax(param) {

	/* Настройки */

	var parallaxID = "parallax", 
		overflowsParentClass = "overflowsSlide", 
		wrapsWindowWidthClass = 'wrapsWindowWidth', 
		paralaxBackgroundClass = 'parallaxBackground',

	/* Отключает скроллбар вовсе */
	scrollbarFullyRemoved = param.removeScrollbar;

	/*
	 * Можно задать тип анимации параллакса и слоев
	 * и анимируемое свойство.
	 *
	 * Далее следует оценка
	 * совместимости настроек
	 * в виде таблицы.
	 *
	 * Без анимации виртуального скролла:
	 *
	 *              X     JQuery     CSS3
	 * left      |	o  |    o    |    o    |
	 * translate |	o  |    ?    |    o    |
	 *
	 * С анимированным виртуальным скроллом:
	 *
	 *              X     JQuery     CSS3
	 * left      |	o  |    x    |    x    |
	 * translate |	o  |    x    |    x    |
	 *
	 *
	 *  */


	var animationTypes = {
		NONE : 0,
		JQ_EASED : 1,
		CSS3_EASED : 2,
		SUPER_EASED : 3,
		EASED : 4
	}, shiftPropertyTypes = {
		LEFT : 'left',
		TRANSLATEX : 'translateX',
		TRANSLATE : 'translate',
		TRANSLATE3D : 'translate3d'
	};

	var layerAnimationType = animationTypes.NONE, 
		scrollValueAnimationType = animationTypes.EASED, 
		parallaxLeftAnimationType = animationTypes.NONE;

	var layerShiftProperty = param.layerShiftProperty || 'left', 
		parallaxShiftProperty = param.parallaxShiftProperty ||  'left';

	//http://easings.net/ru
	var scrollEasing = 'easeOutExpo', scrollAnimationDuration = 1500;

	/* Конец настроек, начало рабочего кода */

	var para_cached = this;
	
	var windowWidth;

	var slides = {
		$src : undefined,
		array : [],
		singleSlideWidth : 0
	};

	
	var scroll = {
		add : function() {
		},
		get : function() {
		},
		delta : 0,
		cur : 0,
		previous : 0,
		maxLimit : 0,
		firstStep : 0,
		$src : undefined,
		startWindowWidth : 0,
		resizeModifier : 1,
		minimalStep : 0
	};
	
	para_cached.scroll = scroll;

	this.currentSlideI = 0;

	this.mouseWheelTarget = $('body');

	this.findLayerWrapper = function(src) {

		for (var i = 0, s = slides.array[0]; i < slides.array.length; i++, s = slides.array[i]) {

			for (var j = 0, l = s.layers[0]; j < s.layers.length; j++, l = s.layers[j]) {

				if (src == l.$src[0]) {
					return l;
				}

			}

		}
	}
	
	var slideChangeModel = 'onBorder';
	
	function layer($src, prnt) {

		//$src.parent().css('display','');

		var hasParalaxBackgroundClass = $src.hasClass(paralaxBackgroundClass);

		this.$src = $src;
		this.prnt = prnt;
		this.spd = +$src.attr('alt');

		if (hasParalaxBackgroundClass) {
			$src.css('min-height', '100%');
		}

		var slowness = 1 - this.spd, extraSpeed = this.spd - 1;

		var halfWindowWidth, halfParentWidth, preCalculatedPosition, halfWidth;

		var hasOverflowMarker = $src.hasClass(overflowsParentClass), isSmallAndSlow;

		var relLeftBorder = 0, relRightBorder;

		if (layerAnimationType == animationTypes.CSS3_EASED) {
			CSS3setupAdjust(layerShiftProperty, this.$src);
		}

		this.applyWindowSize = function() {

			if (!hasParalaxBackgroundClass) {
				$src.attr('style', '');
			} else {

				paraSample.applyHorizontalShift('', $src);
				$src.css({
					width : ''
				});
				// Opera:
				// переключение позиционирования
				// слоя с относительного на абсолютное
				// рушит верстку.
				var usingOpera = navigator.userAgent.indexOf('Opera') > -1;
				if (!usingOpera) {
					$src.css({
						position : ''
					});
				}
			}

			halfWindowWidth = windowWidth / 2;
			halfParentWidth = this.prnt.width / 2;

			/*var isTestSlide = false&&$src.parent().is('#intro');*/
			
			if (hasParalaxBackgroundClass) {

				this.width = $src.width();
				var minWidth = this.spd * (this.prnt.prnt.width - windowWidth) + windowWidth;

				if (this.width < minWidth) {
					this.width = minWidth;
					$src.width(this.width);
				}

			} else {
				
				// Баг в (sic!) Хроме.
				// Элемент <img alt="5.5" class='test-subject' src="/static/img/mainPage/intro/4.png" />
				// Имеет правила, меняющие его высоту.
				// В этот момент программы Хром меняет высоту в соответствии с правилом,
				// но оставляет ширину неизменной.
				// Попробуем вылечить небольшим встряхиванием состояния элемента.
				$src.css('position','absolute');
				/*(if(isTestSlide){
					console.log($src,$src.width());
				}*/
				this.width = $src.width();
				$src.css('position','');
				/*if(isTestSlide){
					console.log($src,$src.width());
				}*/
			}

			halfWidth = this.width / 2;
			relRightBorder = prnt.width - this.width;

			isSmallAndSlow = this.spd <= 1 && this.width < this.prnt.width;
			this.overflowsParent = hasOverflowMarker || hasParalaxBackgroundClass || !isSmallAndSlow;

			this.$src.css('left', '');

			// Moz:
			// Если позиционирование слоя на этот момент абсолютное,
			// то даже с учетом ресета css('left', '')
			// .css('left') будет выдавать числовое значение,
			// не содержащееся ни в одном из каскадных стилей.
			var cssLeft = $src.css('left');

			/*
			 * В Опере нельзя переключать позиционирование фонового слоя,
			 * но можно определить, что css-left = auto, при абсолютном.
			 * В FF можно переключать позиционирование этого слоя,
			 * но нельзя определить, что css-left = auto, при абсолютном.
			 * Решение: для Оперы всегда сохранять абсолютное позиционирование,
			 * для остальных браузеров -- отключать во время определения css-left = auto.
			 */
			$src.css({
				display : 'inline-block',
				overflow : 'visible',
				position : 'absolute'
			});

			// Moz:
			// Элементы с позиционированием не-static
			// выдают численное значение даже при отсутствии left в стиле.
			if (cssLeft == 'auto') {
				this.left = halfParentWidth - halfWidth;
			} else {
				this.left = parseInt(cssLeft, 10);
			}

			if (layerShiftProperty !== shiftPropertyTypes.LEFT) {
				this.$src.css('left', '0px');
			};

			if (this.spd == 0) {
				preCalculatedPosition = halfWindowWidth - halfWidth;
			} else if (this.spd > 0 && this.spd < 1) {
				preCalculatedPosition = (halfWindowWidth - halfWidth) * (1 - this.spd) + this.left * this.spd;
			} else {
				preCalculatedPosition = this.left;
			}

		}
		/*
		 Формулы подсчета в сыром виде:

		 spd = 0
		 halfWindowWidth-halfWidth+inScroll
		 spd: (0,1)
		 (halfWindowWidth-halfWidth+inScroll)*(1-this.spd)+this.left*this.spd
		 spd > 1
		 this.left-inScroll*(this.spd-1)
		 */

		this.parallaxLeft = function(inScroll) {

			if (this.spd == 0) {
				this.currentLeft = preCalculatedPosition + inScroll;
			} else if (this.spd > 0 && this.spd < 1) {
				this.currentLeft = preCalculatedPosition + inScroll * slowness;
			} else {
				this.currentLeft = preCalculatedPosition - inScroll * extraSpeed;
			}
			return this.currentLeft
		}

		this.adjust = function(inScroll) {

			var left = this.parallaxLeft(inScroll);

			/*
			 Слоям на переднем плане (очень быстрым)
			 позволяем выходить за границу слайда
			 */

			if (!this.overflowsParent) {

				var leftBorder = relLeftBorder, rightBorder = relRightBorder;

				if (left < leftBorder) {
					left = leftBorder;
				} else if (left > rightBorder) {
					left = rightBorder;
				}

			}

			if (layerAnimationType == animationTypes.CSS3_EASED || layerAnimationType == animationTypes.NONE) {

				paraSample.applyHorizontalShift(left, this.$src, layerShiftProperty);
			} else if (layerAnimationType == animationTypes.JQ_EASED) {
				jqueryAnimateShift(this.$src, left);
			}

		}

		return this;
	}

	function slide($src, masterSlide, prnt) {

		this.masterSlide = masterSlide;
		this.layers = [];
		this.$src = $src;
		this.initialLeft = 0;
		this.left = 0;
		this.width = 0;
		this.$axis = {};
		this.prnt = prnt;
		var children = this.$src.children();

		var windowWidth_cache;

		this.childrenVisible = true;

		this.adjust = function() {

			this.left = this.initialLeft - this.prnt.$src.scroll;

			var right = this.left + this.width;

			var toTheLeftOfScreen = this.left < 0 && right < 0, toTheRightOfScreen = this.left > windowWidth_cache && right > windowWidth_cache;

			if ((toTheLeftOfScreen || toTheRightOfScreen)
				&& !param.noSlideHideOptimization) {
				if (this.childrenVisible) {
					children.hide();
					this.childrenVisible = false;
				}
			} else {
				if (!this.childrenVisible) {

					children.show();
					this.childrenVisible = true;
				}

				/* Переход к дочерним слоям */

				var scrollPosition = -this.left;

				for (var i = 0, l = this.layers[0], len = this.layers.length; i < len; i++, l = this.layers[i]) {
					l.adjust(scrollPosition);
				}
			}

		}
		var slide = this;

		this.applyWindowSize = function() {

			windowWidth_cache = windowWidth;
			this.$src.css('display', '');
			if (masterSlide) {
				this.width = this.prnt.width;
				this.initialLeft = 0;

			} else {
				this.width = windowWidth;
				this.initialLeft = this.prnt.width;
				this.$src.css('width', this.width);

			}

		}
		this.applyWindowSize();

		this.applyWindowSizeToChildren = function() {

			children.show();

			for (var i = 0, j = slide.layers.length; i < j; i++) {
				slide.layers[i].applyWindowSize();
			};
		}

		this.initChildren = function() {

			var layerChildren;

			if (masterSlide) {
				layerChildren = this.$src.children('[alt]');
			} else {
				layerChildren = $('*[alt]', this.$src);
			}

			children.show();

			layerChildren.each(function() {

				var $layer = $(this)

				if ($layer.attr('alt') == '1') {
					$layer.css({
						position : 'absolute'
					});
					slide.$axis = $layer;

				} else {
					var wrapped = new layer($layer, slide);
					slide.layers.push(wrapped);
				}
			});
		}
		this.initChildren();

		return this;

	}


	this.init = init;
	function init() {

		slides.$src = $('#' + parallaxID);
		slides.$src.scroll = 0;

		if (scrollbarFullyRemoved) {
			$('html').css('overflow', 'hidden');
		} else {
			$('html').css({
				'overflow-x' : 'scroll',
				'overflow-y' : 'hidden'
			});
		}

		slides.$src.children('div').css({
			height : '100%',
			position : 'relative',
			float : 'left',
			overflow : 'hidden'
		});

		slides.$src.css({
			width : '100%',
			height : '100%',
			'overflow-x' : 'visible',
			position : 'fixed'
		});

		if (parallaxLeftAnimationType === animationTypes.CSS3_EASED) {
			CSS3setupAdjust(parallaxShiftProperty, slides.$src);
		}

		initSlides();

		applyWindowSize();
		
		applyWindowSizeToParallaxLayers();

		refreshSlides();
		
		//$('body').bind('mousewheel', onMouseWheel);

		$('.' + paralaxBackgroundClass).css('z-index', 'auto');

		slides.$src.trigger('init');

	}

	function initSlides() {

		/* Обычные слайды */

		slides.array = [];

		slides.$src.find('> div').each(function() {
			var $slide = $(this);
			if ($slide.attr('alt'))
				return;
			var p = new slide($slide, false, slides);

			slides.array.push(p);
		});

		para_cached.slidesCount = slides.array.length;

		/* Сам параллакс выступает в качестве слайда
		 * по отношению к фону параллакса */

		var p = new slide(slides.$src, true, slides);
		slides.array.push(p);

	}

	function applyWindowSize() {

		windowWidth = $(window).innerWidth();

		slides.singleSlideWidth = windowWidth;

		scroll.minimalStep = windowWidth / 1000 / 15;

		slides.width = 0;

		for (var i = 0, l = slides.array.length; i < l; i++) {
			var s = slides.array[i]
			s.applyWindowSize();
			if (!s.masterSlide) {
				slides.width += s.width;
			}
		}

		slides.$src.width(slides.width);
		scroll.maxLimit = slides.width - windowWidth;

		initScrollbar();

	}

	function applyWindowSizeToParallaxLayers() {
		for (var i = 0, s = slides.array[i]; i < slides.array.length; i++, s = slides.array[i]) {

			s.applyWindowSizeToChildren();
		}


		slides.$src.trigger('engineRebuild', slides.$src.scroll)
		//customEventEngine.call(para_cached, 'engineRebuild', slides.$src.scroll);
	}

	var intervalID, stepToBe;

	// Участник собственноручно сделанного сглаженного скролла
	function stepF() {

		stepToBe = (scroll.cur - slides.$src.scroll) / 15;

		if (Math.abs(stepToBe) > scroll.minimalStep) {
			slides.$src.scroll += stepToBe;

			refreshSlidesAndFireListeners();

		} else if (scroll.doingNextMove) {
			scroll.doingNextMove = false;

		
			slides.$src.trigger('finishedMove', slides.$src.scroll)
			slides.$src.removeClass('disable-hover');

		}

	};

	var straightScrollSwitch = false;

	function straightScroll() {

		slides.$src.scroll = scroll.cur;

		refreshSlidesAndFireListeners();

		straightScrollSwitch = false;
	}

	var lastSlideI = 0, currentSlideI = 0, rawScroll = 0;

	function trackSlideChange() {

		rawScroll = scroll.cur / slides.singleSlideWidth;

		if(slideChangeModel == 'onBorder'){
			
			// смена происходит
			// на границе слайдов
			while (rawScroll <= lastSlideI - .5) {
				para.currentSlideI--;
				lastSlideI = para.currentSlideI;
			}
	
			while (rawScroll >= lastSlideI + .5) {
				para.currentSlideI++;
				lastSlideI = para.currentSlideI;
			}
		
		} else {
			
			// смена происходит 
			// в центре соседнего слайда
			while (rawScroll <= lastSlideI - 1) {
				para.currentSlideI--;
				lastSlideI = para.currentSlideI;
			}
	
			while (rawScroll >= lastSlideI + 1) {
				para.currentSlideI++;
				lastSlideI = para.currentSlideI;
			}
		}
	}

	function getScrollPositionAndAnimateEverything() {

		scroll.cur = scroll.get();
		scroll.delta = Math.abs(slides.$src.scroll - scroll.cur);

		scroll.doingNextMove = true;

			slides.$src.trigger('startedMove', slides.$src.scroll)
			slides.$src.addClass('disable-hover');

		if (false)
			alert('getScrollPositionAndAnimateEverything : .cur: ' + scroll.cur + ', $src.scroll: ' + slides.$src.scroll);

		if (straightScrollSwitch) {

			straightScroll();

		} else if (scrollValueAnimationType == animationTypes.EASED) {

			if (!intervalID)
				intervalID = setInterval(stepF, 17);

		} else if (scrollValueAnimationType == animationTypes.SUPER_EASED) {
			if (scroll.delta > 70) {

				scroll.firstStep = true;

				slides.$src.stop(true, true).animate({
					scroll : scroll.cur
				}, {
					step : function(now, fx) {

						/* дикий хак */
						if (scroll.firstStep) {
							fx.start = slides.$src.scroll;
							scroll.firstStep = false;
							return;
						}

						refreshSlidesAndFireListeners();
						slides.$src.scroll = now;

					},
					duration : scrollAnimationDuration,
					easing : scrollEasing
				});

			} else {

				slides.$src.stop(true, true);
				slides.$src.scroll = scroll.cur;
				refreshSlidesAndFireListeners()
			}

		} else if (scrollValueAnimationType == animationTypes.JQ_EASED) {

			slides.$src.stop().animate({
				scroll : scroll.cur
			}, {
				step : function(now, fx) {
					slides.$src.scroll = now;
					refreshSlidesAndFireListeners();

				},
				duration : scrollAnimationDuration,
				easing : scrollEasing
			});

		} else {
			straightScroll();
		}

		trackSlideChange();

	}
	
	function refreshSlidesAndFireListeners(){
		
		refreshSlides();


		slides.$src.trigger('scrollChange', slides.$src.scroll)
		//customEventEngine.call(para_cached, 'scrollChange', slides.$src.scroll);
		
	}

	function refreshSlides() {

		if (parallaxLeftAnimationType == animationTypes.CSS3_EASED || parallaxLeftAnimationType == animationTypes.NONE) {
			paraSample.applyHorizontalShift(-slides.$src.scroll, slides.$src, parallaxShiftProperty);
		} else if (parallaxLeftAnimationType == animationTypes.JQ_EASED) {
			jqueryAnimateShift(slides.$src, -slides.$src.scroll);
		}

		
		for (var i = 0, s = slides.array[0], len = slides.array.length; i < len; i++, s = slides.array[i]) {
			s.adjust();
		}

		

		/*
		 for(var l in scrollListeners){

		 scrollListeners[l](slides.$src.scroll);
		 }*/

	}

	function initScrollbar() {

		var scrollListenerTarget;

		var firstInit = scroll.$src ? false : true;

		if (!firstInit) {
			scroll.$src.remove();
		} else {
			startWindowWidth = windowWidth;
		}

		if (param.touchNotScrollMode) {

			/*
			 $('html').css('overflow','hidden');
			 $('body').css('overflow','hidden');*/

			var dummy = $('<div/>').css({
				position : 'absolute',
				display : 'hidden'
			});

			if (firstInit)
				$('body').append(dummy);

			scroll.$src = $('<div/>').css({
				width : slides.width,
			});

			var touchStart = 0;
			time = {
				start : 0,
				end : 0
			};

			var delta, speed = {
				cur : 0,
				max : 15,
				min : .1
			};

			if (firstInit) {

				slides.$src[0].addEventListener("touchmove", function(e) {


					if (e.touches.length > 1)
						return;

					e.preventDefault();

					time.end = new Date().getTime();

					var deltaTime = time.end - time.start;

					delta = e.touches[0].screenX - touchStart;

					speed.cur = delta * delta / 15 * (delta < 0 ? -1 : 1);

					scroll.add(-speed.cur);

					touchStart = e.touches[0].screenX;

					time.start = time.end;

				});

				slides.$src[0].addEventListener("touchstart", function(e) {

					//e.preventDefault();


				time.start = new Date().getTime();

					touchStart = e.touches[0].screenX;

					scroll.stop();

				});

			}

			var maxScroll = slides.width - windowWidth, minScroll = 0;

			scroll.add = function(delta) {

				if (scroll.cur + delta > maxScroll) {
					scroll.cur = maxScroll
				} else if (scroll.cur + delta < minScroll) {
					scroll.cur = minScroll;
				} else {
					scroll.cur += delta;
				}

				getScrollPositionAndAnimateEverything();
			}

			scroll.stop = function() {
				scroll.cur = slides.$src.scroll;
			}

			scroll.get = function() {
				return scroll.cur;
			}
		} else {

			var scrollTarget;

			if (!scrollbarFullyRemoved) {

				scroll.$src = $('<div/>').css({
					width : slides.width,
					height : '1px'
				});

				$('body').append(scroll.$src);

				scrollTarget = window;
			}

			scroll.get = function() {

				if (scrollbarFullyRemoved) {
					return scroll.cur;
				}

				return $(scrollTarget).scrollLeft();
			}

			scroll.add = function(delta) {

				if (scrollbarFullyRemoved) {

					var newScroll = scroll.cur + delta;

					if (newScroll < 0) {
						newScroll = 0;
					} else if (newScroll > scroll.maxLimit) {
						newScroll = scroll.maxLimit;
					}

					scroll.cur = newScroll;
					getScrollPositionAndAnimateEverything();
					return;
				}
				$(scrollTarget).scrollLeft($(scrollTarget).scrollLeft() + delta);
			}
			if (firstInit && !scrollbarFullyRemoved) {

				$(scrollTarget).on('scroll', getScrollPositionAndAnimateEverything);
			}
		}

		para_cached.add = scroll.add;

		para_cached.width = slides.width;
	}


	this.toSlide = function(index) {
		if (index > -1 && index < slides.array.length) {
			this.to(windowWidth * index);
		}
	}

	this.to = function(value) {
		scroll.add(value - scroll.get());
	}
	function closerGeneric(left) {
		var cur = scroll.get(), roun = left ? Math.floor : Math.ceil, curIndex = cur / slides.singleSlideWidth, dest = roun(cur / slides.singleSlideWidth);

		if (cur % slides.singleSlideWidth == 0) {
			dest += left ? (-1) : 1;
		}
		dest *= slides.singleSlideWidth;
		
		para_cached.to(dest);
	}


	this.closerLeft = function() {
		closerGeneric(true);
	}

	this.closerRight = function() {
		closerGeneric(false);
	}
	function CSS3setupAdjust(shiftProperty, $div) {

		var transiTrailer = scrollAnimationDuration + 'ms ease-in-out 1ms';

		if (shiftProperty == shiftPropertyTypes.LEFT) {

			transi = 'left ' + transiTrailer;

		} else if (shiftProperty == shiftPropertyTypes.TRANSLATE || shiftProperty == shiftPropertyTypes.TRANSLATEX || shiftProperty == shiftPropertyTypes.TRANSLATE3D) {

			transi = '-webkit-transform ' + transiTrailer;

		}

		$div.css({
			WebkitTransition : transi,
			MozTransition : transi,
			OTransition : transi,
			msTransition : transi,
			transition : transi
		});

	}

	function jqueryAnimateShift($div, value) {

		$div.stop(false).animate({
			left : value + 'px',
		}, scrollAnimationDuration, scrollEasing);
	}
	

	/* Обратные связи */

	var absScroll, relativeScroll;

	this.onResizeSlides = function() {

		absScroll = scroll.get();
		relativeScroll = absScroll / windowWidth;

		applyWindowSize();

	}

	this.onResizeLayers = function() {

		applyWindowSizeToParallaxLayers();

		refreshSlidesAndFireListeners();

		var newScroll = relativeScroll * windowWidth;

		straightScrollSwitch = true;

		scroll.add(newScroll - scroll.get());
	}
}

/*
 * Загрузка
 */

var preloader = {
	disable : undefined,
	start : undefined,
	onLoad : function() {
	},
	$slide : undefined,
	visuals : undefined,
	fillVisuals : function() {
	},
	fillingTime : 1400,
	delayBeforeLoadCheck : 0,
	targetLogoWidth : 0
};

var loaderClass = 'loadBackground';

preloader.fillVisuals = function(fillAmount, callback) {

	if (!callback)
		callback = function() {
		};

	$(function() {
		preloader.visuals.loaded/*.stop(false, false)*/.animate({
			'width' : preloader.targetLogoWidth * fillAmount
		}, {
			duration : preloader.fillingTime,
			queue : false
		});
		preloader.visuals.unloaded/*.stop(false, false)*/.animate({
			'width' : (1 - fillAmount) * preloader.targetLogoWidth
		}, {
			duration : preloader.fillingTime,
			queue : false,
			complete : callback
		});
	});

}

preloader.disable = function(param) {

	if (param && param.rough) {

		$('.' + loaderClass).remove();
		preloader.$slide.remove();

	} else {

		$('.' + loaderClass).delay(300).animate({
			'opacity' : 0
		}, preloader.fillingTime, function() {
			$(this).remove();
		});

		preloader.$slide.animate({
			'opacity' : 0,
			/*left: "-"+preloader.$slide.width()+"px"*/
		}, preloader.fillingTime, function() {
			$(this).remove();
		});
	}

	$(document.body).removeClass('unloaded');

}
$(function() {
	return;
	var $media = $('html').find('img,video');

	var lc = 0;
	$media.on('load', function() {
		lc++;
		utilLib.debLog('loadEvent() fired. Total fired: ' + lc + '\n Still need to load ' + ($media.length - lc));
		console.log(this);
	});
	$media.on('error', function() {
		lc++;
		utilLib.debLog('errorEvent() fired.');
		console.log(this);
	});
});

preloader.init = function(){
	preloader.visuals = {
		loaded : $('.preloaderCont .ending'),
		unloaded : $('.preloaderCont .starting')
	};
	preloader.$slide = $('.preloaderCont');
	preloader.targetLogoWidth = .9 * $(window).innerWidth();
}

preloader.start = function() {
	
	preloader.init();
	
	var $media = $('html').find('img,video');

	var mediaCount = $media.length;

	var local_onContentLoad = this.onContentLoad;

	var loaded = 0;

	preloader.visuals.loaded
	.add(preloader.visuals.unloaded)
		.css('opacity', 0);

	var $subCont = $('.preloaderCont .subCont');

	var imageAspect = preloader.visuals.loaded.find('img').width() / preloader.visuals.loaded.find('img').height();

	preloader.visuals.loaded.find('img')
	.add(preloader.visuals.unloaded.find('img'))
	.add(preloader.visuals.unloaded)
		.css('width', preloader.targetLogoWidth);

	$subCont
	.add(preloader.visuals.loaded.find('img'))
	.add(preloader.visuals.unloaded.find('img'))
		.css('height', preloader.targetLogoWidth / imageAspect);

	

	function getFilesToLoadCount() {

		var a = $media.filter(function() {

			// причина: в одном из браузеров не обнаружил complete у svg-изображения
			if (this.src && this.src.indexOf('svg') > -1) {
				return false;
				// видео
				/*READY_STATE http://www.w3schools.com/tags/av_prop_readystate.asp*/
			} else if (this.readyState !== undefined && this.readyState >= 3) {
				return false;
			} else if (this.complete) {
				return false;
			}

			//console.log(this);
			return true;

		});

		return a.length;
	}

	setTimeout(earlyCachedDetection, preloader.delayBeforeLoadCheck);

	function earlyCachedDetection() {

		var alreadyLoaded = getFilesToLoadCount();

		if (alreadyLoaded == 0) {

			utilLib.debLog('No need to load.');

			preloader.onLoad();
			preloader.disable({
				'rough' : true
			});

			return;

		} else {

			preloader.visuals.loaded.add(preloader.visuals.unloaded).animate({
				'opacity' : 1
			}, 300);
			a();
		}
	}

	function a() {

		var notLoaded = getFilesToLoadCount();

		var loadedPart = (mediaCount - notLoaded ) / mediaCount;

		if (notLoaded == 0) {

			utilLib.debLog('Finished loading');

			preloader.fillVisuals(loadedPart, preloader.onLoad);

		} else {

			setTimeout(a, 1000);

			utilLib.debLog('Still need to load ' + notLoaded);

			preloader.fillVisuals(loadedPart);

		}
	}

}


/*

	resizeables.js 
	
 * Пожалуйста, предоставляйте 
 * релевантные глобальные переменные
 * windowWidth, windowHeight, windowAspect
 * перед вызовами resizeables.adjust()
 */

var resizeables = {

	engineCreator: undefined,
	
	engine: undefined,
	
	initFromDescript: function(d){
		resizeables.engine.getContainersFromDescript(d);
	},
	init: function(){
		resizeables.engine.findContainers();
	},
	adjust: function(){
		resizeables.engine.adjust();
	},
	fillModes: {
		FILL_PARENT : 'fillParent',
		FIT_PARENT : 'fitParent',
		FIT_PARENT_WIDTH : 'fitParentWidth',
		NONE: 'none'
	},
	orientations: {
		LANDSCAPE : 'landscape',
		PORTRAIT : 'portrait'
	},
	criticalReadabilityClass: 'criticalReadability',
	
	/* Минимально допускаемый движком 
	 * размер шрифта на .criticalReadability*/
	minimalReadableFontSize: 11
};


	
	/* window.innerWidth и window.innerHeight 
	 * на машине верстальщика при 100% зуме. */
	
resizeables.reference = {w:1280, h:923};

resizeables.engineCreator = function(){
			
	var list = [],
		l,
		obj = resizeables;

	this.findContainers = function(){
		
		for (var fm in obj.fillModes) {
			$('.' + obj.fillModes[fm]).each(function() {
				var a = new aRContainer($(this), obj.fillModes[fm]);
				list.push(a);
			});
		}
		l = list.length;
	}
	
	this.getContainersFromDescript = function(d){
		
		for (var aRCIndex in d) {
			var aRCData = d[aRCIndex];
			aRCData.$src = $(aRCData.srcString);
			var aRC = new aRContainerGeneric(aRCData);
			list.push(aRC);
		}
		l = list.length;
	}
	
	this.adjust = function() {
		for (var i = 0, arc = list[i]; i < l; i++, arc = list[i]) {
			arc.adjust();
		}
	}
	
	function aRContainer($src, fillMode) {
		return new aRContainerGeneric({
			$src : $src,
			fitting : fillMode
		});
	}

	function aRContainerGeneric(src) {

		var $src = src.$src, 
			fitting = src.fitting, 
			multiLayout = src.multiLayout, 
			initialDim, 
			initialDimRelative, 
			aspect, 
			baseFontSize,
			versionB;

		this.recollectMetrics = function() {

			if(fitting!=obj.fillModes.NONE){
				$src.css({
					width : '',
					height : '',
					'font-size' : ''
				});
			}

			initialDim = {
				w : $src.outerWidth(true),
				h : $src.outerHeight(true)
			};
			aspect = initialDim.w / initialDim.h;
			initialDimRelative = {
				w : initialDim.w / resizeables.reference.w,
				h : initialDim.h / resizeables.reference.h
			};
			baseFontSize = parseInt($src.css('font-size'), 10);

		};
		
		versionB = true;//src.versionB;

		if(versionB){
			$src.css('display','inline-block');
		}
		
		this.recollectMetrics();

		criticalElements = $src.find('.' + obj.criticalReadabilityClass);
		this.parent = $src.parent();

		var currentOrientation, lastOrientation = 'none';

		function updateOrientation() {
			currentOrientation = windowAspect > layoutSwitchThreshold ? obj.orientations.LANDSCAPE : obj.orientations.PORTRAIT;
		}

		var layoutSwitchThreshold = 1;
		if (src.layoutSwitchThreshold) {
			layoutSwitchThreshold = src.layoutSwitchThreshold;
		}

		this.adjust = function() {

			if (multiLayout) {

				updateOrientation();

				if (currentOrientation != lastOrientation) {

					$src.addClass(currentOrientation).removeClass(lastOrientation);

					this.recollectMetrics();

					lastOrientation = currentOrientation;
				}

			}

			if(fitting==obj.fillModes.NONE) return;
			
			var anchorDim = 'w', complementDim = 'h';

			if (fitting === obj.fillModes.FILL_PARENT) {
				if (aspect > windowAspect) {
					anchorDim = 'h';
				} 
			} else if (fitting === obj.fillModes.FIT_PARENT) {
				if (aspect < windowAspect) {
					anchorDim = 'h';
				}
			}
			
			if(anchorDim=='h'){
				complementDim = 'w';
			}
			
			var widthToBe, heightToBe, fontSizeToBe;
			
			var dimToBe = {
				h: 0,
				w: 0
			};
			
			var windowDim = {
				h: windowHeight,
				w: windowWidth
			};
			
			var marginNameTranslation = {
				h: 'margin-left',
				w: 'margin-top'
			};

			dimToBe[anchorDim] = 
				windowDim[anchorDim]*
				(fitting === obj.fillModes.FILL_PARENT || versionB ? 
					1 
					: initialDimRelative[anchorDim]
				);
			
			dimToBe[complementDim] = 
				dimToBe[anchorDim];
			
			if(complementDim=='h'){
				dimToBe[complementDim] /= aspect;
			} else {
				dimToBe[complementDim] *= aspect;
			}
			
			
			if(dimToBe[complementDim]>windowDim[complementDim]){
				
				var remargin = 
					-(dimToBe[complementDim] - windowDim[complementDim]) / 2;
				
				var complementMargin = marginNameTranslation[anchorDim],
					anchorMargin = marginNameTranslation[complementDim];
					
				$src.css(anchorMargin,'');
				$src.css(complementMargin,remargin);
			}
			
			fontSizeToBe = dimToBe.h/initialDim.h;
			
			
			

			$src.width(dimToBe.w);
			$src.height(dimToBe.h);
			
			fontSizeToBe *= baseFontSize;
			$src.css('font-size', fontSizeToBe);

			// Здесь следим за тем, чтобы у специально помеченных надписей
			// размер был не меньше порога [ obj.minimalReadableFontSize ]
			for (var i = 0, l = criticalElements.length; 
					 i < l;  
					 i++) {
						
				$ce = $(criticalElements[i]);

				$ce.css('font-size', '');

				var calculatedFontSize = parseInt($ce.css('font-size'), 10);

				if (calculatedFontSize < obj.minimalReadableFontSize) {
					$ce.css('font-size', obj.minimalReadableFontSize + 'px');
				}
			}
		}
	}

	return this;
};

resizeables.engine = new resizeables.engineCreator();




function adjustFontSize() {

	var diminishing = {
		w : window.innerWidth / resizeables.reference.w,
		h : window.innerHeight / resizeables.reference.h
	};

	$('body').css('font-size', baseFontSize * Math.min(diminishing.w, diminishing.h));
}

/* ex-sample.js */



/* * Вспомогательные органы управления
 */

function wheelStep(windowWidth) {
	var deno = paraSample.settings.mousewheelSlowness.windows;
	if(utilLib.deviceDescription.os == utilLib.OS_TYPES.mac){
		deno = paraSample.settings.mousewheelSlowness.mac;
	}  
	return windowWidth / deno;
}

function onMouseWheel(event, delta) {

	para.add(-delta * wheelstep);
	event.preventDefault();
	event.stopPropagation();

};

$(document).keydown(function(e) {

	if (e.keyCode == '37') {
		para.closerLeft();
		e.preventDefault();
	} else if (e.keyCode == '39' || e.keyCode == '32') {
		para.closerRight();
		e.preventDefault();
	}

});

function onResize() {

	para.onResizeSlides();

	// Расщепление onResize параллакса и такая последовательность функций
	// вызваны работой движка автомасштабируемых контейнеров.
	// onResizeLayers зависит от его результатов (утверждение требует проверки),
	// потому onResizeLayers следует после.

	nonParaResize();

	para.onResizeLayers();

}




function nonParaResize() {

	windowWidth = $(window).innerWidth();
	windowHeight = $(window).innerHeight();
	windowAspect = windowWidth / windowHeight;

	wheelstep = wheelStep(windowWidth);

	adjustFontSize();
	resizeables.adjust();

}


var hashProcessingSystem = {

	doNotApplyHashFromAddressLine : false,

	userLock : false,

	lastSlideI : 0,

	applyHashFromAddressLine : function() {

		var addr = self.location.toString(), selectedSlide = addr.slice(addr.indexOf('#') + 1);

		if (selectedSlide == undefined)
			return;

		for (var h in hashProcessingSystem.addrMap) {
			if (selectedSlide == hashProcessingSystem.addrMap[h] && h != hashProcessingSystem.lastSlideI) {
				hashProcessingSystem.userLock = true;
				para.toSlide((+h));
				return;
			}
		}
	},

	trackHashChange : function trackHashChange() {

		if (paraSample.settings.disableAutoHashChange) return;

		// Значение para.currentSlideI соответствует не текущему смещению,
		// а конечному. Значит, после того, как пользователь ввел хэш
		// и начал переход, значение поменяется только один раз.
		if (para.currentSlideI != hashProcessingSystem.lastSlideI) {

			hashProcessingSystem.lastSlideI = para.currentSlideI;

			if (hashProcessingSystem.userLock) {
				hashProcessingSystem.userLock = false;
				return;
			} else {
				hashProcessingSystem.doNotApplyHashFromAddressLine = true;
			}

			var infoString = 'trackHashChange : Changing hash. ';
			if (hashProcessingSystem.doNotApplyHashFromAddressLine) {
				infoString += ' Has doNotApplyHashFromAddressLine.';
			}
			if (hashProcessingSystem.userLock) {
				infoString += ' Has userHashLock.';
			}
			
			window.location.hash = hashProcessingSystem.addrMap[para.currentSlideI];

		}
	}
}

$(window).on('hashchange', function(e) {

	e.preventDefault();

	if (hashProcessingSystem.doNotApplyHashFromAddressLine) {
		//tdLib.debLog('jq.window.onhashchange : doNotApplyHashFromAddressLine, so returning.');
		hashProcessingSystem.doNotApplyHashFromAddressLine = false;
		return;
	}

	hashProcessingSystem.applyHashFromAddressLine();

	return false;

});


// Пользователь запускает эту функцию

function startAllParaSystems() {

	if(Modernizr.history 
		&& window.history.state 
		&& window.history.state.mediaIsLoaded){
			utilLib.debLog('All media is cached. Skipping preloader');
			paraSample.preloaderEnabled = false;
			
	}
	debugging = self.location.toString().indexOf('xe') > -1;
	var parallaxParams = {
		removeScrollbar : paraSample.settings.removeScrollbar,
		touchNotScrollMode : paraSample.settings.touchNotScrollMode
	}
	if (Modernizr.csstransforms3d) {
		parallaxParams.layerShiftProperty = 'translate3d';
		parallaxParams.parallaxShiftProperty = 'translate3d';
	} 
	para = new parallax(parallaxParams);
	baseFontSize = parseInt($('body').css('font-size'));
	hiddenImagesContainer = $('.preloadedImages');

	

	$('#parallax').on('init', function(){

		para.mouseWheelTarget.bind('mousewheel', onMouseWheel);
		$(window).on('resize', onResize);
		hashProcessingSystem.addrMap = 
		$('#parallax>div').map(function(i){return i==0?'':$(this).attr('id')});
		hashProcessingSystem.applyHashFromAddressLine();
		preloader.disable();
		
	});

	$('#parallax').on('scrollChange', function(amount) {

		hashProcessingSystem.trackHashChange();
	});

	function onPreloaderLoad(){
		
		if(Modernizr.history){
			
			$('a').on('click',function (args) {
				
				var href = $(this).attr('href');
				if(href=='' || href =='#') return;
		
				window.history.pushState({
					mediaIsLoaded: 'true'
				}, 'mediaIsLoaded');  
				
			});
			
		};

		resizeables.initFromDescript(aRCDescript);

		nonParaResize();

		if (parallax) {
			para.init();
		}

	}
	
	if(paraSample.preloaderEnabled){
		preloader.onLoad = onPreloaderLoad;	
	} else {
		preloader.init();
		onPreloaderLoad();
	}

	if(paraSample.preloaderEnabled){
		preloader.start();
	}

};
},{}],7:[function(require,module,exports){
aRCDescript = [ {
	srcString : '#layouts .story',
	fitting : resizeables.fillModes.NONE,
	multiLayout : true
},  {
	srcString : '#scaling .story',
	fitting : resizeables.fillModes.FIT_PARENT,
}];


/* */

var optimizationSlide = {
	pause : function() {
			$("#optimization .fastLayer").stop(true,false);
	},
	resume : function() {

		$("#optimization .fastLayer").animate({
			'margin-top' : '500px'
		}, 400, 'easeInOutCubic').animate({
			'margin-top' : '0px'
		}, 400, 'easeOutCubic', optimizationSlide.resume);
	}
}

function createLayers(){

	for(var i=0; i<30; i++){

		var layer = $("<div class='fastLayer'><div><div></div></div></div>");

		layer.css({
			left: Math.random()*1750-350,
			top: Math.random()*860-200
		});
		
		var q = Math.random();
		layer.find('>div').attr({
			alt: q*6+1
		});
		
		var size = q*270+30;
		layer.find('>div>div').css({
			width: size,
			height: size,
			'border-radius': size,
			'-webkit-filter': 'blur('+q*15+'px)',
			background: 'rgba(255, 255, 255, .5)'
		});

		$('#more .popularResolution').append(layer);

		var animatedCopy = layer.clone();

		$('#animated .popularResolution').append(animatedCopy);

		(function(animatedCopy){

			var paused = true,
				progress = 0,
				initialPosition = animatedCopy.position(),
				speedKoeff = Math.random(),
				initialPhase = Math.random()*Math.PI*2,
				amplitude = Math.random()*100+100;

			setInterval(function(){
				if(paused) return;

				var angle = progress*speedKoeff+initialPhase;
				animatedCopy.css('left',initialPosition.left+Math.sin(angle)*amplitude);
				animatedCopy.css('top',initialPosition.top+Math.cos(angle)*amplitude);

				progress+=.1;

			},17);

			animatedCopy.data({
				resume: function(){
					paused = false;
				},
				pause: function(){
					paused = true;
				}
			});

		})(animatedCopy);

	};
}


$(function(){

	createLayers();
	optimizationSlide.resume();

	$('#parallax').on('finishedMove', function(amount) {

		$('#animated .popularResolution .fastLayer').each(function(){
			$(this).data('resume')();
		});
		optimizationSlide.resume();
	});
	$('#parallax').on('startedMove', function() {

		$('#animated .popularResolution .fastLayer').each(function(){
			$(this).data('pause')();
		});

		optimizationSlide.pause();
	});

	// the only call to the parallax system you need to make
	startAllParaSystems();

});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvbWFpbi5qcyIsImFwcC9qcy9zcmMvanF1ZXJ5LmN1c3RvbS5qcyIsImFwcC9qcy9zcmMvanF1ZXJ5LmpzIiwiYXBwL2pzL3NyYy9qcXVlcnkubW91c2V3aGVlbC5qcyIsImFwcC9qcy9zcmMvbW9kZXJuaXpyLmN1c3RvbS5qcyIsImFwcC9qcy9zcmMvcGFyYWxsYXguanMiLCJhcHAvanMvc3JjL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2dkNBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ24xREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGpxdWVyeUN1c3RvbSA9IHJlcXVpcmUoJy4vc3JjL2pxdWVyeS5jdXN0b20uanMnKTtcbnZhciBqcXVlcnkgPSByZXF1aXJlKCcuL3NyYy9qcXVlcnkuanMnKTtcbnZhciBqcXVlcnlNb3VzZVdoZWVsID0gcmVxdWlyZSgnLi9zcmMvanF1ZXJ5Lm1vdXNld2hlZWwuanMnKTtcbnZhciBtb2Rlbml6ckN1c3RvbSA9IHJlcXVpcmUoJy4vc3JjL21vZGVybml6ci5jdXN0b20uanMnKTtcbnZhciBwYXJhbGxheCA9IHJlcXVpcmUoJy4vc3JjL3BhcmFsbGF4LmpzJyk7XG52YXIgc2FtcGxlID0gcmVxdWlyZSgnLi9zcmMvc2FtcGxlLmpzJyk7XG4iLCIvKiEgalF1ZXJ5IFVJIC0gdjEuOS4xIC0gMjAxMi0xMS0xNVxyXG4qIGh0dHA6Ly9qcXVlcnl1aS5jb21cclxuKiBJbmNsdWRlczoganF1ZXJ5LnVpLmVmZmVjdC5qc1xyXG4qIENvcHlyaWdodCAoYykgMjAxMiBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIExpY2Vuc2VkIE1JVCAqL1xyXG5cclxuOyhqUXVlcnkuZWZmZWN0cyB8fCAoZnVuY3Rpb24oJCwgdW5kZWZpbmVkKSB7XHJcblxyXG52YXIgYmFja0NvbXBhdCA9ICQudWlCYWNrQ29tcGF0ICE9PSBmYWxzZSxcclxuXHQvLyBwcmVmaXggdXNlZCBmb3Igc3RvcmluZyBkYXRhIG9uIC5kYXRhKClcclxuXHRkYXRhU3BhY2UgPSBcInVpLWVmZmVjdHMtXCI7XHJcblxyXG4kLmVmZmVjdHMgPSB7XHJcblx0ZWZmZWN0OiB7fVxyXG59O1xyXG5cclxuLyohXHJcbiAqIGpRdWVyeSBDb2xvciBBbmltYXRpb25zIHYyLjAuMFxyXG4gKiBodHRwOi8vanF1ZXJ5LmNvbS9cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTIgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcclxuICpcclxuICogRGF0ZTogTW9uIEF1ZyAxMyAxMzo0MTowMiAyMDEyIC0wNTAwXHJcbiAqL1xyXG4oZnVuY3Rpb24oIGpRdWVyeSwgdW5kZWZpbmVkICkge1xyXG5cclxuXHR2YXIgc3RlcEhvb2tzID0gXCJiYWNrZ3JvdW5kQ29sb3IgYm9yZGVyQm90dG9tQ29sb3IgYm9yZGVyTGVmdENvbG9yIGJvcmRlclJpZ2h0Q29sb3IgYm9yZGVyVG9wQ29sb3IgY29sb3IgY29sdW1uUnVsZUNvbG9yIG91dGxpbmVDb2xvciB0ZXh0RGVjb3JhdGlvbkNvbG9yIHRleHRFbXBoYXNpc0NvbG9yXCIuc3BsaXQoXCIgXCIpLFxyXG5cclxuXHQvLyBwbHVzZXF1YWxzIHRlc3QgZm9yICs9IDEwMCAtPSAxMDBcclxuXHRycGx1c2VxdWFscyA9IC9eKFtcXC0rXSk9XFxzKihcXGQrXFwuP1xcZCopLyxcclxuXHQvLyBhIHNldCBvZiBSRSdzIHRoYXQgY2FuIG1hdGNoIHN0cmluZ3MgYW5kIGdlbmVyYXRlIGNvbG9yIHR1cGxlcy5cclxuXHRzdHJpbmdQYXJzZXJzID0gW3tcclxuXHRcdFx0cmU6IC9yZ2JhP1xcKFxccyooXFxkezEsM30pXFxzKixcXHMqKFxcZHsxLDN9KVxccyosXFxzKihcXGR7MSwzfSlcXHMqKD86LFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqKT9cXCkvLFxyXG5cdFx0XHRwYXJzZTogZnVuY3Rpb24oIGV4ZWNSZXN1bHQgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDEgXSxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDIgXSxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDMgXSxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDQgXVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHRcdH0sIHtcclxuXHRcdFx0cmU6IC9yZ2JhP1xcKFxccyooXFxkKyg/OlxcLlxcZCspPylcXCVcXHMqLFxccyooXFxkKyg/OlxcLlxcZCspPylcXCVcXHMqLFxccyooXFxkKyg/OlxcLlxcZCspPylcXCVcXHMqKD86LFxccyooXFxkKyg/OlxcLlxcZCspPylcXHMqKT9cXCkvLFxyXG5cdFx0XHRwYXJzZTogZnVuY3Rpb24oIGV4ZWNSZXN1bHQgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDEgXSAqIDIuNTUsXHJcblx0XHRcdFx0XHRleGVjUmVzdWx0WyAyIF0gKiAyLjU1LFxyXG5cdFx0XHRcdFx0ZXhlY1Jlc3VsdFsgMyBdICogMi41NSxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDQgXVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHRcdH0sIHtcclxuXHRcdFx0Ly8gdGhpcyByZWdleCBpZ25vcmVzIEEtRiBiZWNhdXNlIGl0J3MgY29tcGFyZWQgYWdhaW5zdCBhbiBhbHJlYWR5IGxvd2VyY2FzZWQgc3RyaW5nXHJcblx0XHRcdHJlOiAvIyhbYS1mMC05XXsyfSkoW2EtZjAtOV17Mn0pKFthLWYwLTldezJ9KS8sXHJcblx0XHRcdHBhcnNlOiBmdW5jdGlvbiggZXhlY1Jlc3VsdCApIHtcclxuXHRcdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdFx0cGFyc2VJbnQoIGV4ZWNSZXN1bHRbIDEgXSwgMTYgKSxcclxuXHRcdFx0XHRcdHBhcnNlSW50KCBleGVjUmVzdWx0WyAyIF0sIDE2ICksXHJcblx0XHRcdFx0XHRwYXJzZUludCggZXhlY1Jlc3VsdFsgMyBdLCAxNiApXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fVxyXG5cdFx0fSwge1xyXG5cdFx0XHQvLyB0aGlzIHJlZ2V4IGlnbm9yZXMgQS1GIGJlY2F1c2UgaXQncyBjb21wYXJlZCBhZ2FpbnN0IGFuIGFscmVhZHkgbG93ZXJjYXNlZCBzdHJpbmdcclxuXHRcdFx0cmU6IC8jKFthLWYwLTldKShbYS1mMC05XSkoW2EtZjAtOV0pLyxcclxuXHRcdFx0cGFyc2U6IGZ1bmN0aW9uKCBleGVjUmVzdWx0ICkge1xyXG5cdFx0XHRcdHJldHVybiBbXHJcblx0XHRcdFx0XHRwYXJzZUludCggZXhlY1Jlc3VsdFsgMSBdICsgZXhlY1Jlc3VsdFsgMSBdLCAxNiApLFxyXG5cdFx0XHRcdFx0cGFyc2VJbnQoIGV4ZWNSZXN1bHRbIDIgXSArIGV4ZWNSZXN1bHRbIDIgXSwgMTYgKSxcclxuXHRcdFx0XHRcdHBhcnNlSW50KCBleGVjUmVzdWx0WyAzIF0gKyBleGVjUmVzdWx0WyAzIF0sIDE2IClcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHR9XHJcblx0XHR9LCB7XHJcblx0XHRcdHJlOiAvaHNsYT9cXChcXHMqKFxcZCsoPzpcXC5cXGQrKT8pXFxzKixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pXFwlXFxzKixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pXFwlXFxzKig/OixcXHMqKFxcZCsoPzpcXC5cXGQrKT8pXFxzKik/XFwpLyxcclxuXHRcdFx0c3BhY2U6IFwiaHNsYVwiLFxyXG5cdFx0XHRwYXJzZTogZnVuY3Rpb24oIGV4ZWNSZXN1bHQgKSB7XHJcblx0XHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDEgXSxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDIgXSAvIDEwMCxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDMgXSAvIDEwMCxcclxuXHRcdFx0XHRcdGV4ZWNSZXN1bHRbIDQgXVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHRcdH1dLFxyXG5cclxuXHQvLyBqUXVlcnkuQ29sb3IoIClcclxuXHRjb2xvciA9IGpRdWVyeS5Db2xvciA9IGZ1bmN0aW9uKCBjb2xvciwgZ3JlZW4sIGJsdWUsIGFscGhhICkge1xyXG5cdFx0cmV0dXJuIG5ldyBqUXVlcnkuQ29sb3IuZm4ucGFyc2UoIGNvbG9yLCBncmVlbiwgYmx1ZSwgYWxwaGEgKTtcclxuXHR9LFxyXG5cdHNwYWNlcyA9IHtcclxuXHRcdHJnYmE6IHtcclxuXHRcdFx0cHJvcHM6IHtcclxuXHRcdFx0XHRyZWQ6IHtcclxuXHRcdFx0XHRcdGlkeDogMCxcclxuXHRcdFx0XHRcdHR5cGU6IFwiYnl0ZVwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRncmVlbjoge1xyXG5cdFx0XHRcdFx0aWR4OiAxLFxyXG5cdFx0XHRcdFx0dHlwZTogXCJieXRlXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGJsdWU6IHtcclxuXHRcdFx0XHRcdGlkeDogMixcclxuXHRcdFx0XHRcdHR5cGU6IFwiYnl0ZVwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGhzbGE6IHtcclxuXHRcdFx0cHJvcHM6IHtcclxuXHRcdFx0XHRodWU6IHtcclxuXHRcdFx0XHRcdGlkeDogMCxcclxuXHRcdFx0XHRcdHR5cGU6IFwiZGVncmVlc1wiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRzYXR1cmF0aW9uOiB7XHJcblx0XHRcdFx0XHRpZHg6IDEsXHJcblx0XHRcdFx0XHR0eXBlOiBcInBlcmNlbnRcIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0bGlnaHRuZXNzOiB7XHJcblx0XHRcdFx0XHRpZHg6IDIsXHJcblx0XHRcdFx0XHR0eXBlOiBcInBlcmNlbnRcIlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJvcFR5cGVzID0ge1xyXG5cdFx0XCJieXRlXCI6IHtcclxuXHRcdFx0Zmxvb3I6IHRydWUsXHJcblx0XHRcdG1heDogMjU1XHJcblx0XHR9LFxyXG5cdFx0XCJwZXJjZW50XCI6IHtcclxuXHRcdFx0bWF4OiAxXHJcblx0XHR9LFxyXG5cdFx0XCJkZWdyZWVzXCI6IHtcclxuXHRcdFx0bW9kOiAzNjAsXHJcblx0XHRcdGZsb29yOiB0cnVlXHJcblx0XHR9XHJcblx0fSxcclxuXHRzdXBwb3J0ID0gY29sb3Iuc3VwcG9ydCA9IHt9LFxyXG5cclxuXHQvLyBlbGVtZW50IGZvciBzdXBwb3J0IHRlc3RzXHJcblx0c3VwcG9ydEVsZW0gPSBqUXVlcnkoIFwiPHA+XCIgKVsgMCBdLFxyXG5cclxuXHQvLyBjb2xvcnMgPSBqUXVlcnkuQ29sb3IubmFtZXNcclxuXHRjb2xvcnMsXHJcblxyXG5cdC8vIGxvY2FsIGFsaWFzZXMgb2YgZnVuY3Rpb25zIGNhbGxlZCBvZnRlblxyXG5cdGVhY2ggPSBqUXVlcnkuZWFjaDtcclxuXHJcbi8vIGRldGVybWluZSByZ2JhIHN1cHBvcnQgaW1tZWRpYXRlbHlcclxuc3VwcG9ydEVsZW0uc3R5bGUuY3NzVGV4dCA9IFwiYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDEsMSwxLC41KVwiO1xyXG5zdXBwb3J0LnJnYmEgPSBzdXBwb3J0RWxlbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IuaW5kZXhPZiggXCJyZ2JhXCIgKSA+IC0xO1xyXG5cclxuLy8gZGVmaW5lIGNhY2hlIG5hbWUgYW5kIGFscGhhIHByb3BlcnRpZXNcclxuLy8gZm9yIHJnYmEgYW5kIGhzbGEgc3BhY2VzXHJcbmVhY2goIHNwYWNlcywgZnVuY3Rpb24oIHNwYWNlTmFtZSwgc3BhY2UgKSB7XHJcblx0c3BhY2UuY2FjaGUgPSBcIl9cIiArIHNwYWNlTmFtZTtcclxuXHRzcGFjZS5wcm9wcy5hbHBoYSA9IHtcclxuXHRcdGlkeDogMyxcclxuXHRcdHR5cGU6IFwicGVyY2VudFwiLFxyXG5cdFx0ZGVmOiAxXHJcblx0fTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBjbGFtcCggdmFsdWUsIHByb3AsIGFsbG93RW1wdHkgKSB7XHJcblx0dmFyIHR5cGUgPSBwcm9wVHlwZXNbIHByb3AudHlwZSBdIHx8IHt9O1xyXG5cclxuXHRpZiAoIHZhbHVlID09IG51bGwgKSB7XHJcblx0XHRyZXR1cm4gKGFsbG93RW1wdHkgfHwgIXByb3AuZGVmKSA/IG51bGwgOiBwcm9wLmRlZjtcclxuXHR9XHJcblxyXG5cdC8vIH5+IGlzIGFuIHNob3J0IHdheSBvZiBkb2luZyBmbG9vciBmb3IgcG9zaXRpdmUgbnVtYmVyc1xyXG5cdHZhbHVlID0gdHlwZS5mbG9vciA/IH5+dmFsdWUgOiBwYXJzZUZsb2F0KCB2YWx1ZSApO1xyXG5cclxuXHQvLyBJRSB3aWxsIHBhc3MgaW4gZW1wdHkgc3RyaW5ncyBhcyB2YWx1ZSBmb3IgYWxwaGEsXHJcblx0Ly8gd2hpY2ggd2lsbCBoaXQgdGhpcyBjYXNlXHJcblx0aWYgKCBpc05hTiggdmFsdWUgKSApIHtcclxuXHRcdHJldHVybiBwcm9wLmRlZjtcclxuXHR9XHJcblxyXG5cdGlmICggdHlwZS5tb2QgKSB7XHJcblx0XHQvLyB3ZSBhZGQgbW9kIGJlZm9yZSBtb2RkaW5nIHRvIG1ha2Ugc3VyZSB0aGF0IG5lZ2F0aXZlcyB2YWx1ZXNcclxuXHRcdC8vIGdldCBjb252ZXJ0ZWQgcHJvcGVybHk6IC0xMCAtPiAzNTBcclxuXHRcdHJldHVybiAodmFsdWUgKyB0eXBlLm1vZCkgJSB0eXBlLm1vZDtcclxuXHR9XHJcblxyXG5cdC8vIGZvciBub3cgYWxsIHByb3BlcnR5IHR5cGVzIHdpdGhvdXQgbW9kIGhhdmUgbWluIGFuZCBtYXhcclxuXHRyZXR1cm4gMCA+IHZhbHVlID8gMCA6IHR5cGUubWF4IDwgdmFsdWUgPyB0eXBlLm1heCA6IHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdQYXJzZSggc3RyaW5nICkge1xyXG5cdHZhciBpbnN0ID0gY29sb3IoKSxcclxuXHRcdHJnYmEgPSBpbnN0Ll9yZ2JhID0gW107XHJcblxyXG5cdHN0cmluZyA9IHN0cmluZy50b0xvd2VyQ2FzZSgpO1xyXG5cclxuXHRlYWNoKCBzdHJpbmdQYXJzZXJzLCBmdW5jdGlvbiggaSwgcGFyc2VyICkge1xyXG5cdFx0dmFyIHBhcnNlZCxcclxuXHRcdFx0bWF0Y2ggPSBwYXJzZXIucmUuZXhlYyggc3RyaW5nICksXHJcblx0XHRcdHZhbHVlcyA9IG1hdGNoICYmIHBhcnNlci5wYXJzZSggbWF0Y2ggKSxcclxuXHRcdFx0c3BhY2VOYW1lID0gcGFyc2VyLnNwYWNlIHx8IFwicmdiYVwiO1xyXG5cclxuXHRcdGlmICggdmFsdWVzICkge1xyXG5cdFx0XHRwYXJzZWQgPSBpbnN0WyBzcGFjZU5hbWUgXSggdmFsdWVzICk7XHJcblxyXG5cdFx0XHQvLyBpZiB0aGlzIHdhcyBhbiByZ2JhIHBhcnNlIHRoZSBhc3NpZ25tZW50IG1pZ2h0IGhhcHBlbiB0d2ljZVxyXG5cdFx0XHQvLyBvaCB3ZWxsLi4uLlxyXG5cdFx0XHRpbnN0WyBzcGFjZXNbIHNwYWNlTmFtZSBdLmNhY2hlIF0gPSBwYXJzZWRbIHNwYWNlc1sgc3BhY2VOYW1lIF0uY2FjaGUgXTtcclxuXHRcdFx0cmdiYSA9IGluc3QuX3JnYmEgPSBwYXJzZWQuX3JnYmE7XHJcblxyXG5cdFx0XHQvLyBleGl0IGVhY2goIHN0cmluZ1BhcnNlcnMgKSBoZXJlIGJlY2F1c2Ugd2UgbWF0Y2hlZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIEZvdW5kIGEgc3RyaW5nUGFyc2VyIHRoYXQgaGFuZGxlZCBpdFxyXG5cdGlmICggcmdiYS5sZW5ndGggKSB7XHJcblxyXG5cdFx0Ly8gaWYgdGhpcyBjYW1lIGZyb20gYSBwYXJzZWQgc3RyaW5nLCBmb3JjZSBcInRyYW5zcGFyZW50XCIgd2hlbiBhbHBoYSBpcyAwXHJcblx0XHQvLyBjaHJvbWUsIChhbmQgbWF5YmUgb3RoZXJzKSByZXR1cm4gXCJ0cmFuc3BhcmVudFwiIGFzIHJnYmEoMCwwLDAsMClcclxuXHRcdGlmICggcmdiYS5qb2luKCkgPT09IFwiMCwwLDAsMFwiICkge1xyXG5cdFx0XHRqUXVlcnkuZXh0ZW5kKCByZ2JhLCBjb2xvcnMudHJhbnNwYXJlbnQgKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBpbnN0O1xyXG5cdH1cclxuXHJcblx0Ly8gbmFtZWQgY29sb3JzXHJcblx0cmV0dXJuIGNvbG9yc1sgc3RyaW5nIF07XHJcbn1cclxuXHJcbmNvbG9yLmZuID0galF1ZXJ5LmV4dGVuZCggY29sb3IucHJvdG90eXBlLCB7XHJcblx0cGFyc2U6IGZ1bmN0aW9uKCByZWQsIGdyZWVuLCBibHVlLCBhbHBoYSApIHtcclxuXHRcdGlmICggcmVkID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdHRoaXMuX3JnYmEgPSBbIG51bGwsIG51bGwsIG51bGwsIG51bGwgXTtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0XHRpZiAoIHJlZC5qcXVlcnkgfHwgcmVkLm5vZGVUeXBlICkge1xyXG5cdFx0XHRyZWQgPSBqUXVlcnkoIHJlZCApLmNzcyggZ3JlZW4gKTtcclxuXHRcdFx0Z3JlZW4gPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluc3QgPSB0aGlzLFxyXG5cdFx0XHR0eXBlID0galF1ZXJ5LnR5cGUoIHJlZCApLFxyXG5cdFx0XHRyZ2JhID0gdGhpcy5fcmdiYSA9IFtdO1xyXG5cclxuXHRcdC8vIG1vcmUgdGhhbiAxIGFyZ3VtZW50IHNwZWNpZmllZCAtIGFzc3VtZSAoIHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhIClcclxuXHRcdGlmICggZ3JlZW4gIT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0cmVkID0gWyByZWQsIGdyZWVuLCBibHVlLCBhbHBoYSBdO1xyXG5cdFx0XHR0eXBlID0gXCJhcnJheVwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PT0gXCJzdHJpbmdcIiApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2UoIHN0cmluZ1BhcnNlKCByZWQgKSB8fCBjb2xvcnMuX2RlZmF1bHQgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHR5cGUgPT09IFwiYXJyYXlcIiApIHtcclxuXHRcdFx0ZWFjaCggc3BhY2VzLnJnYmEucHJvcHMsIGZ1bmN0aW9uKCBrZXksIHByb3AgKSB7XHJcblx0XHRcdFx0cmdiYVsgcHJvcC5pZHggXSA9IGNsYW1wKCByZWRbIHByb3AuaWR4IF0sIHByb3AgKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggdHlwZSA9PT0gXCJvYmplY3RcIiApIHtcclxuXHRcdFx0aWYgKCByZWQgaW5zdGFuY2VvZiBjb2xvciApIHtcclxuXHRcdFx0XHRlYWNoKCBzcGFjZXMsIGZ1bmN0aW9uKCBzcGFjZU5hbWUsIHNwYWNlICkge1xyXG5cdFx0XHRcdFx0aWYgKCByZWRbIHNwYWNlLmNhY2hlIF0gKSB7XHJcblx0XHRcdFx0XHRcdGluc3RbIHNwYWNlLmNhY2hlIF0gPSByZWRbIHNwYWNlLmNhY2hlIF0uc2xpY2UoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRlYWNoKCBzcGFjZXMsIGZ1bmN0aW9uKCBzcGFjZU5hbWUsIHNwYWNlICkge1xyXG5cdFx0XHRcdFx0dmFyIGNhY2hlID0gc3BhY2UuY2FjaGU7XHJcblx0XHRcdFx0XHRlYWNoKCBzcGFjZS5wcm9wcywgZnVuY3Rpb24oIGtleSwgcHJvcCApIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGlmIHRoZSBjYWNoZSBkb2Vzbid0IGV4aXN0LCBhbmQgd2Uga25vdyBob3cgdG8gY29udmVydFxyXG5cdFx0XHRcdFx0XHRpZiAoICFpbnN0WyBjYWNoZSBdICYmIHNwYWNlLnRvICkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiB0aGUgdmFsdWUgd2FzIG51bGwsIHdlIGRvbid0IG5lZWQgdG8gY29weSBpdFxyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIHRoZSBrZXkgd2FzIGFscGhhLCB3ZSBkb24ndCBuZWVkIHRvIGNvcHkgaXQgZWl0aGVyXHJcblx0XHRcdFx0XHRcdFx0aWYgKCBrZXkgPT09IFwiYWxwaGFcIiB8fCByZWRbIGtleSBdID09IG51bGwgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGluc3RbIGNhY2hlIF0gPSBzcGFjZS50byggaW5zdC5fcmdiYSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyB0aGlzIGlzIHRoZSBvbmx5IGNhc2Ugd2hlcmUgd2UgYWxsb3cgbnVsbHMgZm9yIEFMTCBwcm9wZXJ0aWVzLlxyXG5cdFx0XHRcdFx0XHQvLyBjYWxsIGNsYW1wIHdpdGggYWx3YXlzQWxsb3dFbXB0eVxyXG5cdFx0XHRcdFx0XHRpbnN0WyBjYWNoZSBdWyBwcm9wLmlkeCBdID0gY2xhbXAoIHJlZFsga2V5IF0sIHByb3AsIHRydWUgKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIGV2ZXJ5dGhpbmcgZGVmaW5lZCBidXQgYWxwaGE/XHJcblx0XHRcdFx0XHRpZiAoIGluc3RbIGNhY2hlIF0gJiYgJC5pbkFycmF5KCBudWxsLCBpbnN0WyBjYWNoZSBdLnNsaWNlKCAwLCAzICkgKSA8IDAgKSB7XHJcblx0XHRcdFx0XHRcdC8vIHVzZSB0aGUgZGVmYXVsdCBvZiAxXHJcblx0XHRcdFx0XHRcdGluc3RbIGNhY2hlIF1bIDMgXSA9IDE7XHJcblx0XHRcdFx0XHRcdGlmICggc3BhY2UuZnJvbSApIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0Ll9yZ2JhID0gc3BhY2UuZnJvbSggaW5zdFsgY2FjaGUgXSApO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fSxcclxuXHRpczogZnVuY3Rpb24oIGNvbXBhcmUgKSB7XHJcblx0XHR2YXIgaXMgPSBjb2xvciggY29tcGFyZSApLFxyXG5cdFx0XHRzYW1lID0gdHJ1ZSxcclxuXHRcdFx0aW5zdCA9IHRoaXM7XHJcblxyXG5cdFx0ZWFjaCggc3BhY2VzLCBmdW5jdGlvbiggXywgc3BhY2UgKSB7XHJcblx0XHRcdHZhciBsb2NhbENhY2hlLFxyXG5cdFx0XHRcdGlzQ2FjaGUgPSBpc1sgc3BhY2UuY2FjaGUgXTtcclxuXHRcdFx0aWYgKGlzQ2FjaGUpIHtcclxuXHRcdFx0XHRsb2NhbENhY2hlID0gaW5zdFsgc3BhY2UuY2FjaGUgXSB8fCBzcGFjZS50byAmJiBzcGFjZS50byggaW5zdC5fcmdiYSApIHx8IFtdO1xyXG5cdFx0XHRcdGVhY2goIHNwYWNlLnByb3BzLCBmdW5jdGlvbiggXywgcHJvcCApIHtcclxuXHRcdFx0XHRcdGlmICggaXNDYWNoZVsgcHJvcC5pZHggXSAhPSBudWxsICkge1xyXG5cdFx0XHRcdFx0XHRzYW1lID0gKCBpc0NhY2hlWyBwcm9wLmlkeCBdID09PSBsb2NhbENhY2hlWyBwcm9wLmlkeCBdICk7XHJcblx0XHRcdFx0XHRcdHJldHVybiBzYW1lO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBzYW1lO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gc2FtZTtcclxuXHR9LFxyXG5cdF9zcGFjZTogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdXNlZCA9IFtdLFxyXG5cdFx0XHRpbnN0ID0gdGhpcztcclxuXHRcdGVhY2goIHNwYWNlcywgZnVuY3Rpb24oIHNwYWNlTmFtZSwgc3BhY2UgKSB7XHJcblx0XHRcdGlmICggaW5zdFsgc3BhY2UuY2FjaGUgXSApIHtcclxuXHRcdFx0XHR1c2VkLnB1c2goIHNwYWNlTmFtZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB1c2VkLnBvcCgpO1xyXG5cdH0sXHJcblx0dHJhbnNpdGlvbjogZnVuY3Rpb24oIG90aGVyLCBkaXN0YW5jZSApIHtcclxuXHRcdHZhciBlbmQgPSBjb2xvciggb3RoZXIgKSxcclxuXHRcdFx0c3BhY2VOYW1lID0gZW5kLl9zcGFjZSgpLFxyXG5cdFx0XHRzcGFjZSA9IHNwYWNlc1sgc3BhY2VOYW1lIF0sXHJcblx0XHRcdHN0YXJ0Q29sb3IgPSB0aGlzLmFscGhhKCkgPT09IDAgPyBjb2xvciggXCJ0cmFuc3BhcmVudFwiICkgOiB0aGlzLFxyXG5cdFx0XHRzdGFydCA9IHN0YXJ0Q29sb3JbIHNwYWNlLmNhY2hlIF0gfHwgc3BhY2UudG8oIHN0YXJ0Q29sb3IuX3JnYmEgKSxcclxuXHRcdFx0cmVzdWx0ID0gc3RhcnQuc2xpY2UoKTtcclxuXHJcblx0XHRlbmQgPSBlbmRbIHNwYWNlLmNhY2hlIF07XHJcblx0XHRlYWNoKCBzcGFjZS5wcm9wcywgZnVuY3Rpb24oIGtleSwgcHJvcCApIHtcclxuXHRcdFx0dmFyIGluZGV4ID0gcHJvcC5pZHgsXHJcblx0XHRcdFx0c3RhcnRWYWx1ZSA9IHN0YXJ0WyBpbmRleCBdLFxyXG5cdFx0XHRcdGVuZFZhbHVlID0gZW5kWyBpbmRleCBdLFxyXG5cdFx0XHRcdHR5cGUgPSBwcm9wVHlwZXNbIHByb3AudHlwZSBdIHx8IHt9O1xyXG5cclxuXHRcdFx0Ly8gaWYgbnVsbCwgZG9uJ3Qgb3ZlcnJpZGUgc3RhcnQgdmFsdWVcclxuXHRcdFx0aWYgKCBlbmRWYWx1ZSA9PT0gbnVsbCApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gaWYgbnVsbCAtIHVzZSBlbmRcclxuXHRcdFx0aWYgKCBzdGFydFZhbHVlID09PSBudWxsICkge1xyXG5cdFx0XHRcdHJlc3VsdFsgaW5kZXggXSA9IGVuZFZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICggdHlwZS5tb2QgKSB7XHJcblx0XHRcdFx0XHRpZiAoIGVuZFZhbHVlIC0gc3RhcnRWYWx1ZSA+IHR5cGUubW9kIC8gMiApIHtcclxuXHRcdFx0XHRcdFx0c3RhcnRWYWx1ZSArPSB0eXBlLm1vZDtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIHN0YXJ0VmFsdWUgLSBlbmRWYWx1ZSA+IHR5cGUubW9kIC8gMiApIHtcclxuXHRcdFx0XHRcdFx0c3RhcnRWYWx1ZSAtPSB0eXBlLm1vZDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzdWx0WyBpbmRleCBdID0gY2xhbXAoICggZW5kVmFsdWUgLSBzdGFydFZhbHVlICkgKiBkaXN0YW5jZSArIHN0YXJ0VmFsdWUsIHByb3AgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpc1sgc3BhY2VOYW1lIF0oIHJlc3VsdCApO1xyXG5cdH0sXHJcblx0YmxlbmQ6IGZ1bmN0aW9uKCBvcGFxdWUgKSB7XHJcblx0XHQvLyBpZiB3ZSBhcmUgYWxyZWFkeSBvcGFxdWUgLSByZXR1cm4gb3Vyc2VsZlxyXG5cdFx0aWYgKCB0aGlzLl9yZ2JhWyAzIF0gPT09IDEgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZ2IgPSB0aGlzLl9yZ2JhLnNsaWNlKCksXHJcblx0XHRcdGEgPSByZ2IucG9wKCksXHJcblx0XHRcdGJsZW5kID0gY29sb3IoIG9wYXF1ZSApLl9yZ2JhO1xyXG5cclxuXHRcdHJldHVybiBjb2xvciggalF1ZXJ5Lm1hcCggcmdiLCBmdW5jdGlvbiggdiwgaSApIHtcclxuXHRcdFx0cmV0dXJuICggMSAtIGEgKSAqIGJsZW5kWyBpIF0gKyBhICogdjtcclxuXHRcdH0pKTtcclxuXHR9LFxyXG5cdHRvUmdiYVN0cmluZzogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcHJlZml4ID0gXCJyZ2JhKFwiLFxyXG5cdFx0XHRyZ2JhID0galF1ZXJ5Lm1hcCggdGhpcy5fcmdiYSwgZnVuY3Rpb24oIHYsIGkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHYgPT0gbnVsbCA/ICggaSA+IDIgPyAxIDogMCApIDogdjtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0aWYgKCByZ2JhWyAzIF0gPT09IDEgKSB7XHJcblx0XHRcdHJnYmEucG9wKCk7XHJcblx0XHRcdHByZWZpeCA9IFwicmdiKFwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBwcmVmaXggKyByZ2JhLmpvaW4oKSArIFwiKVwiO1xyXG5cdH0sXHJcblx0dG9Ic2xhU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwcmVmaXggPSBcImhzbGEoXCIsXHJcblx0XHRcdGhzbGEgPSBqUXVlcnkubWFwKCB0aGlzLmhzbGEoKSwgZnVuY3Rpb24oIHYsIGkgKSB7XHJcblx0XHRcdFx0aWYgKCB2ID09IG51bGwgKSB7XHJcblx0XHRcdFx0XHR2ID0gaSA+IDIgPyAxIDogMDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIGNhdGNoIDEgYW5kIDJcclxuXHRcdFx0XHRpZiAoIGkgJiYgaSA8IDMgKSB7XHJcblx0XHRcdFx0XHR2ID0gTWF0aC5yb3VuZCggdiAqIDEwMCApICsgXCIlXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRpZiAoIGhzbGFbIDMgXSA9PT0gMSApIHtcclxuXHRcdFx0aHNsYS5wb3AoKTtcclxuXHRcdFx0cHJlZml4ID0gXCJoc2woXCI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcHJlZml4ICsgaHNsYS5qb2luKCkgKyBcIilcIjtcclxuXHR9LFxyXG5cdHRvSGV4U3RyaW5nOiBmdW5jdGlvbiggaW5jbHVkZUFscGhhICkge1xyXG5cdFx0dmFyIHJnYmEgPSB0aGlzLl9yZ2JhLnNsaWNlKCksXHJcblx0XHRcdGFscGhhID0gcmdiYS5wb3AoKTtcclxuXHJcblx0XHRpZiAoIGluY2x1ZGVBbHBoYSApIHtcclxuXHRcdFx0cmdiYS5wdXNoKCB+figgYWxwaGEgKiAyNTUgKSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBcIiNcIiArIGpRdWVyeS5tYXAoIHJnYmEsIGZ1bmN0aW9uKCB2ICkge1xyXG5cclxuXHRcdFx0Ly8gZGVmYXVsdCB0byAwIHdoZW4gbnVsbHMgZXhpc3RcclxuXHRcdFx0diA9ICggdiB8fCAwICkudG9TdHJpbmcoIDE2ICk7XHJcblx0XHRcdHJldHVybiB2Lmxlbmd0aCA9PT0gMSA/IFwiMFwiICsgdiA6IHY7XHJcblx0XHR9KS5qb2luKFwiXCIpO1xyXG5cdH0sXHJcblx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JnYmFbIDMgXSA9PT0gMCA/IFwidHJhbnNwYXJlbnRcIiA6IHRoaXMudG9SZ2JhU3RyaW5nKCk7XHJcblx0fVxyXG59KTtcclxuY29sb3IuZm4ucGFyc2UucHJvdG90eXBlID0gY29sb3IuZm47XHJcblxyXG4vLyBoc2xhIGNvbnZlcnNpb25zIGFkYXB0ZWQgZnJvbTpcclxuLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9tYWFzaGFhY2svc291cmNlL2Jyb3dzZS9wYWNrYWdlcy9ncmFwaGljcy90cnVuay9zcmMvZ3JhcGhpY3MvY29sb3JzL0hVRTJSR0IuYXM/cj01MDIxXHJcblxyXG5mdW5jdGlvbiBodWUycmdiKCBwLCBxLCBoICkge1xyXG5cdGggPSAoIGggKyAxICkgJSAxO1xyXG5cdGlmICggaCAqIDYgPCAxICkge1xyXG5cdFx0cmV0dXJuIHAgKyAocSAtIHApICogaCAqIDY7XHJcblx0fVxyXG5cdGlmICggaCAqIDIgPCAxKSB7XHJcblx0XHRyZXR1cm4gcTtcclxuXHR9XHJcblx0aWYgKCBoICogMyA8IDIgKSB7XHJcblx0XHRyZXR1cm4gcCArIChxIC0gcCkgKiAoKDIvMykgLSBoKSAqIDY7XHJcblx0fVxyXG5cdHJldHVybiBwO1xyXG59XHJcblxyXG5zcGFjZXMuaHNsYS50byA9IGZ1bmN0aW9uICggcmdiYSApIHtcclxuXHRpZiAoIHJnYmFbIDAgXSA9PSBudWxsIHx8IHJnYmFbIDEgXSA9PSBudWxsIHx8IHJnYmFbIDIgXSA9PSBudWxsICkge1xyXG5cdFx0cmV0dXJuIFsgbnVsbCwgbnVsbCwgbnVsbCwgcmdiYVsgMyBdIF07XHJcblx0fVxyXG5cdHZhciByID0gcmdiYVsgMCBdIC8gMjU1LFxyXG5cdFx0ZyA9IHJnYmFbIDEgXSAvIDI1NSxcclxuXHRcdGIgPSByZ2JhWyAyIF0gLyAyNTUsXHJcblx0XHRhID0gcmdiYVsgMyBdLFxyXG5cdFx0bWF4ID0gTWF0aC5tYXgoIHIsIGcsIGIgKSxcclxuXHRcdG1pbiA9IE1hdGgubWluKCByLCBnLCBiICksXHJcblx0XHRkaWZmID0gbWF4IC0gbWluLFxyXG5cdFx0YWRkID0gbWF4ICsgbWluLFxyXG5cdFx0bCA9IGFkZCAqIDAuNSxcclxuXHRcdGgsIHM7XHJcblxyXG5cdGlmICggbWluID09PSBtYXggKSB7XHJcblx0XHRoID0gMDtcclxuXHR9IGVsc2UgaWYgKCByID09PSBtYXggKSB7XHJcblx0XHRoID0gKCA2MCAqICggZyAtIGIgKSAvIGRpZmYgKSArIDM2MDtcclxuXHR9IGVsc2UgaWYgKCBnID09PSBtYXggKSB7XHJcblx0XHRoID0gKCA2MCAqICggYiAtIHIgKSAvIGRpZmYgKSArIDEyMDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0aCA9ICggNjAgKiAoIHIgLSBnICkgLyBkaWZmICkgKyAyNDA7XHJcblx0fVxyXG5cclxuXHRpZiAoIGwgPT09IDAgfHwgbCA9PT0gMSApIHtcclxuXHRcdHMgPSBsO1xyXG5cdH0gZWxzZSBpZiAoIGwgPD0gMC41ICkge1xyXG5cdFx0cyA9IGRpZmYgLyBhZGQ7XHJcblx0fSBlbHNlIHtcclxuXHRcdHMgPSBkaWZmIC8gKCAyIC0gYWRkICk7XHJcblx0fVxyXG5cdHJldHVybiBbIE1hdGgucm91bmQoaCkgJSAzNjAsIHMsIGwsIGEgPT0gbnVsbCA/IDEgOiBhIF07XHJcbn07XHJcblxyXG5zcGFjZXMuaHNsYS5mcm9tID0gZnVuY3Rpb24gKCBoc2xhICkge1xyXG5cdGlmICggaHNsYVsgMCBdID09IG51bGwgfHwgaHNsYVsgMSBdID09IG51bGwgfHwgaHNsYVsgMiBdID09IG51bGwgKSB7XHJcblx0XHRyZXR1cm4gWyBudWxsLCBudWxsLCBudWxsLCBoc2xhWyAzIF0gXTtcclxuXHR9XHJcblx0dmFyIGggPSBoc2xhWyAwIF0gLyAzNjAsXHJcblx0XHRzID0gaHNsYVsgMSBdLFxyXG5cdFx0bCA9IGhzbGFbIDIgXSxcclxuXHRcdGEgPSBoc2xhWyAzIF0sXHJcblx0XHRxID0gbCA8PSAwLjUgPyBsICogKCAxICsgcyApIDogbCArIHMgLSBsICogcyxcclxuXHRcdHAgPSAyICogbCAtIHE7XHJcblxyXG5cdHJldHVybiBbXHJcblx0XHRNYXRoLnJvdW5kKCBodWUycmdiKCBwLCBxLCBoICsgKCAxIC8gMyApICkgKiAyNTUgKSxcclxuXHRcdE1hdGgucm91bmQoIGh1ZTJyZ2IoIHAsIHEsIGggKSAqIDI1NSApLFxyXG5cdFx0TWF0aC5yb3VuZCggaHVlMnJnYiggcCwgcSwgaCAtICggMSAvIDMgKSApICogMjU1ICksXHJcblx0XHRhXHJcblx0XTtcclxufTtcclxuXHJcblxyXG5lYWNoKCBzcGFjZXMsIGZ1bmN0aW9uKCBzcGFjZU5hbWUsIHNwYWNlICkge1xyXG5cdHZhciBwcm9wcyA9IHNwYWNlLnByb3BzLFxyXG5cdFx0Y2FjaGUgPSBzcGFjZS5jYWNoZSxcclxuXHRcdHRvID0gc3BhY2UudG8sXHJcblx0XHRmcm9tID0gc3BhY2UuZnJvbTtcclxuXHJcblx0Ly8gbWFrZXMgcmdiYSgpIGFuZCBoc2xhKClcclxuXHRjb2xvci5mblsgc3BhY2VOYW1lIF0gPSBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblxyXG5cdFx0Ly8gZ2VuZXJhdGUgYSBjYWNoZSBmb3IgdGhpcyBzcGFjZSBpZiBpdCBkb2Vzbid0IGV4aXN0XHJcblx0XHRpZiAoIHRvICYmICF0aGlzWyBjYWNoZSBdICkge1xyXG5cdFx0XHR0aGlzWyBjYWNoZSBdID0gdG8oIHRoaXMuX3JnYmEgKTtcclxuXHRcdH1cclxuXHRcdGlmICggdmFsdWUgPT09IHVuZGVmaW5lZCApIHtcclxuXHRcdFx0cmV0dXJuIHRoaXNbIGNhY2hlIF0uc2xpY2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmV0LFxyXG5cdFx0XHR0eXBlID0galF1ZXJ5LnR5cGUoIHZhbHVlICksXHJcblx0XHRcdGFyciA9ICggdHlwZSA9PT0gXCJhcnJheVwiIHx8IHR5cGUgPT09IFwib2JqZWN0XCIgKSA/IHZhbHVlIDogYXJndW1lbnRzLFxyXG5cdFx0XHRsb2NhbCA9IHRoaXNbIGNhY2hlIF0uc2xpY2UoKTtcclxuXHJcblx0XHRlYWNoKCBwcm9wcywgZnVuY3Rpb24oIGtleSwgcHJvcCApIHtcclxuXHRcdFx0dmFyIHZhbCA9IGFyclsgdHlwZSA9PT0gXCJvYmplY3RcIiA/IGtleSA6IHByb3AuaWR4IF07XHJcblx0XHRcdGlmICggdmFsID09IG51bGwgKSB7XHJcblx0XHRcdFx0dmFsID0gbG9jYWxbIHByb3AuaWR4IF07XHJcblx0XHRcdH1cclxuXHRcdFx0bG9jYWxbIHByb3AuaWR4IF0gPSBjbGFtcCggdmFsLCBwcm9wICk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoIGZyb20gKSB7XHJcblx0XHRcdHJldCA9IGNvbG9yKCBmcm9tKCBsb2NhbCApICk7XHJcblx0XHRcdHJldFsgY2FjaGUgXSA9IGxvY2FsO1xyXG5cdFx0XHRyZXR1cm4gcmV0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGNvbG9yKCBsb2NhbCApO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIG1ha2VzIHJlZCgpIGdyZWVuKCkgYmx1ZSgpIGFscGhhKCkgaHVlKCkgc2F0dXJhdGlvbigpIGxpZ2h0bmVzcygpXHJcblx0ZWFjaCggcHJvcHMsIGZ1bmN0aW9uKCBrZXksIHByb3AgKSB7XHJcblx0XHQvLyBhbHBoYSBpcyBpbmNsdWRlZCBpbiBtb3JlIHRoYW4gb25lIHNwYWNlXHJcblx0XHRpZiAoIGNvbG9yLmZuWyBrZXkgXSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29sb3IuZm5bIGtleSBdID0gZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFx0XHR2YXIgdnR5cGUgPSBqUXVlcnkudHlwZSggdmFsdWUgKSxcclxuXHRcdFx0XHRmbiA9ICgga2V5ID09PSBcImFscGhhXCIgPyAoIHRoaXMuX2hzbGEgPyBcImhzbGFcIiA6IFwicmdiYVwiICkgOiBzcGFjZU5hbWUgKSxcclxuXHRcdFx0XHRsb2NhbCA9IHRoaXNbIGZuIF0oKSxcclxuXHRcdFx0XHRjdXIgPSBsb2NhbFsgcHJvcC5pZHggXSxcclxuXHRcdFx0XHRtYXRjaDtcclxuXHJcblx0XHRcdGlmICggdnR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGN1cjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCB2dHlwZSA9PT0gXCJmdW5jdGlvblwiICkge1xyXG5cdFx0XHRcdHZhbHVlID0gdmFsdWUuY2FsbCggdGhpcywgY3VyICk7XHJcblx0XHRcdFx0dnR5cGUgPSBqUXVlcnkudHlwZSggdmFsdWUgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHZhbHVlID09IG51bGwgJiYgcHJvcC5lbXB0eSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIHZ0eXBlID09PSBcInN0cmluZ1wiICkge1xyXG5cdFx0XHRcdG1hdGNoID0gcnBsdXNlcXVhbHMuZXhlYyggdmFsdWUgKTtcclxuXHRcdFx0XHRpZiAoIG1hdGNoICkge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBjdXIgKyBwYXJzZUZsb2F0KCBtYXRjaFsgMiBdICkgKiAoIG1hdGNoWyAxIF0gPT09IFwiK1wiID8gMSA6IC0xICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxvY2FsWyBwcm9wLmlkeCBdID0gdmFsdWU7XHJcblx0XHRcdHJldHVybiB0aGlzWyBmbiBdKCBsb2NhbCApO1xyXG5cdFx0fTtcclxuXHR9KTtcclxufSk7XHJcblxyXG4vLyBhZGQgLmZ4LnN0ZXAgZnVuY3Rpb25zXHJcbmVhY2goIHN0ZXBIb29rcywgZnVuY3Rpb24oIGksIGhvb2sgKSB7XHJcblx0alF1ZXJ5LmNzc0hvb2tzWyBob29rIF0gPSB7XHJcblx0XHRzZXQ6IGZ1bmN0aW9uKCBlbGVtLCB2YWx1ZSApIHtcclxuXHRcdFx0dmFyIHBhcnNlZCwgY3VyRWxlbSxcclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKCBqUXVlcnkudHlwZSggdmFsdWUgKSAhPT0gXCJzdHJpbmdcIiB8fCAoIHBhcnNlZCA9IHN0cmluZ1BhcnNlKCB2YWx1ZSApICkgKSB7XHJcblx0XHRcdFx0dmFsdWUgPSBjb2xvciggcGFyc2VkIHx8IHZhbHVlICk7XHJcblx0XHRcdFx0aWYgKCAhc3VwcG9ydC5yZ2JhICYmIHZhbHVlLl9yZ2JhWyAzIF0gIT09IDEgKSB7XHJcblx0XHRcdFx0XHRjdXJFbGVtID0gaG9vayA9PT0gXCJiYWNrZ3JvdW5kQ29sb3JcIiA/IGVsZW0ucGFyZW50Tm9kZSA6IGVsZW07XHJcblx0XHRcdFx0XHR3aGlsZSAoXHJcblx0XHRcdFx0XHRcdChiYWNrZ3JvdW5kQ29sb3IgPT09IFwiXCIgfHwgYmFja2dyb3VuZENvbG9yID09PSBcInRyYW5zcGFyZW50XCIpICYmXHJcblx0XHRcdFx0XHRcdGN1ckVsZW0gJiYgY3VyRWxlbS5zdHlsZVxyXG5cdFx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0galF1ZXJ5LmNzcyggY3VyRWxlbSwgXCJiYWNrZ3JvdW5kQ29sb3JcIiApO1xyXG5cdFx0XHRcdFx0XHRcdGN1ckVsZW0gPSBjdXJFbGVtLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZS5ibGVuZCggYmFja2dyb3VuZENvbG9yICYmIGJhY2tncm91bmRDb2xvciAhPT0gXCJ0cmFuc3BhcmVudFwiID9cclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yIDpcclxuXHRcdFx0XHRcdFx0XCJfZGVmYXVsdFwiICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnRvUmdiYVN0cmluZygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZWxlbS5zdHlsZVsgaG9vayBdID0gdmFsdWU7XHJcblx0XHRcdH0gY2F0Y2goIGVycm9yICkge1xyXG5cdFx0XHRcdC8vIHdyYXBwZWQgdG8gcHJldmVudCBJRSBmcm9tIHRocm93aW5nIGVycm9ycyBvbiBcImludmFsaWRcIiB2YWx1ZXMgbGlrZSAnYXV0bycgb3IgJ2luaGVyaXQnXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdGpRdWVyeS5meC5zdGVwWyBob29rIF0gPSBmdW5jdGlvbiggZnggKSB7XHJcblx0XHRpZiAoICFmeC5jb2xvckluaXQgKSB7XHJcblx0XHRcdGZ4LnN0YXJ0ID0gY29sb3IoIGZ4LmVsZW0sIGhvb2sgKTtcclxuXHRcdFx0ZnguZW5kID0gY29sb3IoIGZ4LmVuZCApO1xyXG5cdFx0XHRmeC5jb2xvckluaXQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0alF1ZXJ5LmNzc0hvb2tzWyBob29rIF0uc2V0KCBmeC5lbGVtLCBmeC5zdGFydC50cmFuc2l0aW9uKCBmeC5lbmQsIGZ4LnBvcyApICk7XHJcblx0fTtcclxufSk7XHJcblxyXG5qUXVlcnkuY3NzSG9va3MuYm9yZGVyQ29sb3IgPSB7XHJcblx0ZXhwYW5kOiBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHR2YXIgZXhwYW5kZWQgPSB7fTtcclxuXHJcblx0XHRlYWNoKCBbIFwiVG9wXCIsIFwiUmlnaHRcIiwgXCJCb3R0b21cIiwgXCJMZWZ0XCIgXSwgZnVuY3Rpb24oIGksIHBhcnQgKSB7XHJcblx0XHRcdGV4cGFuZGVkWyBcImJvcmRlclwiICsgcGFydCArIFwiQ29sb3JcIiBdID0gdmFsdWU7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBleHBhbmRlZDtcclxuXHR9XHJcbn07XHJcblxyXG4vLyBCYXNpYyBjb2xvciBuYW1lcyBvbmx5LlxyXG4vLyBVc2FnZSBvZiBhbnkgb2YgdGhlIG90aGVyIGNvbG9yIG5hbWVzIHJlcXVpcmVzIGFkZGluZyB5b3Vyc2VsZiBvciBpbmNsdWRpbmdcclxuLy8ganF1ZXJ5LmNvbG9yLnN2Zy1uYW1lcy5qcy5cclxuY29sb3JzID0galF1ZXJ5LkNvbG9yLm5hbWVzID0ge1xyXG5cdC8vIDQuMS4gQmFzaWMgY29sb3Iga2V5d29yZHNcclxuXHRhcXVhOiBcIiMwMGZmZmZcIixcclxuXHRibGFjazogXCIjMDAwMDAwXCIsXHJcblx0Ymx1ZTogXCIjMDAwMGZmXCIsXHJcblx0ZnVjaHNpYTogXCIjZmYwMGZmXCIsXHJcblx0Z3JheTogXCIjODA4MDgwXCIsXHJcblx0Z3JlZW46IFwiIzAwODAwMFwiLFxyXG5cdGxpbWU6IFwiIzAwZmYwMFwiLFxyXG5cdG1hcm9vbjogXCIjODAwMDAwXCIsXHJcblx0bmF2eTogXCIjMDAwMDgwXCIsXHJcblx0b2xpdmU6IFwiIzgwODAwMFwiLFxyXG5cdHB1cnBsZTogXCIjODAwMDgwXCIsXHJcblx0cmVkOiBcIiNmZjAwMDBcIixcclxuXHRzaWx2ZXI6IFwiI2MwYzBjMFwiLFxyXG5cdHRlYWw6IFwiIzAwODA4MFwiLFxyXG5cdHdoaXRlOiBcIiNmZmZmZmZcIixcclxuXHR5ZWxsb3c6IFwiI2ZmZmYwMFwiLFxyXG5cclxuXHQvLyA0LjIuMy4gXCJ0cmFuc3BhcmVudFwiIGNvbG9yIGtleXdvcmRcclxuXHR0cmFuc3BhcmVudDogWyBudWxsLCBudWxsLCBudWxsLCAwIF0sXHJcblxyXG5cdF9kZWZhdWx0OiBcIiNmZmZmZmZcIlxyXG59O1xyXG5cclxufSkoIGpRdWVyeSApO1xyXG5cclxuXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIENMQVNTIEFOSU1BVElPTlMgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4oZnVuY3Rpb24oKSB7XHJcblxyXG52YXIgY2xhc3NBbmltYXRpb25BY3Rpb25zID0gWyBcImFkZFwiLCBcInJlbW92ZVwiLCBcInRvZ2dsZVwiIF0sXHJcblx0c2hvcnRoYW5kU3R5bGVzID0ge1xyXG5cdFx0Ym9yZGVyOiAxLFxyXG5cdFx0Ym9yZGVyQm90dG9tOiAxLFxyXG5cdFx0Ym9yZGVyQ29sb3I6IDEsXHJcblx0XHRib3JkZXJMZWZ0OiAxLFxyXG5cdFx0Ym9yZGVyUmlnaHQ6IDEsXHJcblx0XHRib3JkZXJUb3A6IDEsXHJcblx0XHRib3JkZXJXaWR0aDogMSxcclxuXHRcdG1hcmdpbjogMSxcclxuXHRcdHBhZGRpbmc6IDFcclxuXHR9O1xyXG5cclxuJC5lYWNoKFsgXCJib3JkZXJMZWZ0U3R5bGVcIiwgXCJib3JkZXJSaWdodFN0eWxlXCIsIFwiYm9yZGVyQm90dG9tU3R5bGVcIiwgXCJib3JkZXJUb3BTdHlsZVwiIF0sIGZ1bmN0aW9uKCBfLCBwcm9wICkge1xyXG5cdCQuZnguc3RlcFsgcHJvcCBdID0gZnVuY3Rpb24oIGZ4ICkge1xyXG5cdFx0aWYgKCBmeC5lbmQgIT09IFwibm9uZVwiICYmICFmeC5zZXRBdHRyIHx8IGZ4LnBvcyA9PT0gMSAmJiAhZnguc2V0QXR0ciApIHtcclxuXHRcdFx0alF1ZXJ5LnN0eWxlKCBmeC5lbGVtLCBwcm9wLCBmeC5lbmQgKTtcclxuXHRcdFx0Znguc2V0QXR0ciA9IHRydWU7XHJcblx0XHR9XHJcblx0fTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBnZXRFbGVtZW50U3R5bGVzKCkge1xyXG5cdHZhciBzdHlsZSA9IHRoaXMub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA/XHJcblx0XHRcdHRoaXMub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKCB0aGlzLCBudWxsICkgOlxyXG5cdFx0XHR0aGlzLmN1cnJlbnRTdHlsZSxcclxuXHRcdG5ld1N0eWxlID0ge30sXHJcblx0XHRrZXksXHJcblx0XHRsZW47XHJcblxyXG5cdC8vIHdlYmtpdCBlbnVtZXJhdGVzIHN0eWxlIHBvcnBlcnRpZXNcclxuXHRpZiAoIHN0eWxlICYmIHN0eWxlLmxlbmd0aCAmJiBzdHlsZVsgMCBdICYmIHN0eWxlWyBzdHlsZVsgMCBdIF0gKSB7XHJcblx0XHRsZW4gPSBzdHlsZS5sZW5ndGg7XHJcblx0XHR3aGlsZSAoIGxlbi0tICkge1xyXG5cdFx0XHRrZXkgPSBzdHlsZVsgbGVuIF07XHJcblx0XHRcdGlmICggdHlwZW9mIHN0eWxlWyBrZXkgXSA9PT0gXCJzdHJpbmdcIiApIHtcclxuXHRcdFx0XHRuZXdTdHlsZVsgJC5jYW1lbENhc2UoIGtleSApIF0gPSBzdHlsZVsga2V5IF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0Zm9yICgga2V5IGluIHN0eWxlICkge1xyXG5cdFx0XHRpZiAoIHR5cGVvZiBzdHlsZVsga2V5IF0gPT09IFwic3RyaW5nXCIgKSB7XHJcblx0XHRcdFx0bmV3U3R5bGVbIGtleSBdID0gc3R5bGVbIGtleSBdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbmV3U3R5bGU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzdHlsZURpZmZlcmVuY2UoIG9sZFN0eWxlLCBuZXdTdHlsZSApIHtcclxuXHR2YXIgZGlmZiA9IHt9LFxyXG5cdFx0bmFtZSwgdmFsdWU7XHJcblxyXG5cdGZvciAoIG5hbWUgaW4gbmV3U3R5bGUgKSB7XHJcblx0XHR2YWx1ZSA9IG5ld1N0eWxlWyBuYW1lIF07XHJcblx0XHRpZiAoIG9sZFN0eWxlWyBuYW1lIF0gIT09IHZhbHVlICkge1xyXG5cdFx0XHRpZiAoICFzaG9ydGhhbmRTdHlsZXNbIG5hbWUgXSApIHtcclxuXHRcdFx0XHRpZiAoICQuZnguc3RlcFsgbmFtZSBdIHx8ICFpc05hTiggcGFyc2VGbG9hdCggdmFsdWUgKSApICkge1xyXG5cdFx0XHRcdFx0ZGlmZlsgbmFtZSBdID0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gZGlmZjtcclxufVxyXG5cclxuJC5lZmZlY3RzLmFuaW1hdGVDbGFzcyA9IGZ1bmN0aW9uKCB2YWx1ZSwgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2sgKSB7XHJcblx0dmFyIG8gPSAkLnNwZWVkKCBkdXJhdGlvbiwgZWFzaW5nLCBjYWxsYmFjayApO1xyXG5cclxuXHRyZXR1cm4gdGhpcy5xdWV1ZSggZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYW5pbWF0ZWQgPSAkKCB0aGlzICksXHJcblx0XHRcdGJhc2VDbGFzcyA9IGFuaW1hdGVkLmF0dHIoIFwiY2xhc3NcIiApIHx8IFwiXCIsXHJcblx0XHRcdGFwcGx5Q2xhc3NDaGFuZ2UsXHJcblx0XHRcdGFsbEFuaW1hdGlvbnMgPSBvLmNoaWxkcmVuID8gYW5pbWF0ZWQuZmluZCggXCIqXCIgKS5hbmRTZWxmKCkgOiBhbmltYXRlZDtcclxuXHJcblx0XHQvLyBtYXAgdGhlIGFuaW1hdGVkIG9iamVjdHMgdG8gc3RvcmUgdGhlIG9yaWdpbmFsIHN0eWxlcy5cclxuXHRcdGFsbEFuaW1hdGlvbnMgPSBhbGxBbmltYXRpb25zLm1hcChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGVsID0gJCggdGhpcyApO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGVsOiBlbCxcclxuXHRcdFx0XHRzdGFydDogZ2V0RWxlbWVudFN0eWxlcy5jYWxsKCB0aGlzIClcclxuXHRcdFx0fTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIGFwcGx5IGNsYXNzIGNoYW5nZVxyXG5cdFx0YXBwbHlDbGFzc0NoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkLmVhY2goIGNsYXNzQW5pbWF0aW9uQWN0aW9ucywgZnVuY3Rpb24oaSwgYWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKCB2YWx1ZVsgYWN0aW9uIF0gKSB7XHJcblx0XHRcdFx0XHRhbmltYXRlZFsgYWN0aW9uICsgXCJDbGFzc1wiIF0oIHZhbHVlWyBhY3Rpb24gXSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdFx0YXBwbHlDbGFzc0NoYW5nZSgpO1xyXG5cclxuXHRcdC8vIG1hcCBhbGwgYW5pbWF0ZWQgb2JqZWN0cyBhZ2FpbiAtIGNhbGN1bGF0ZSBuZXcgc3R5bGVzIGFuZCBkaWZmXHJcblx0XHRhbGxBbmltYXRpb25zID0gYWxsQW5pbWF0aW9ucy5tYXAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuZW5kID0gZ2V0RWxlbWVudFN0eWxlcy5jYWxsKCB0aGlzLmVsWyAwIF0gKTtcclxuXHRcdFx0dGhpcy5kaWZmID0gc3R5bGVEaWZmZXJlbmNlKCB0aGlzLnN0YXJ0LCB0aGlzLmVuZCApO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIGFwcGx5IG9yaWdpbmFsIGNsYXNzXHJcblx0XHRhbmltYXRlZC5hdHRyKCBcImNsYXNzXCIsIGJhc2VDbGFzcyApO1xyXG5cclxuXHRcdC8vIG1hcCBhbGwgYW5pbWF0ZWQgb2JqZWN0cyBhZ2FpbiAtIHRoaXMgdGltZSBjb2xsZWN0aW5nIGEgcHJvbWlzZVxyXG5cdFx0YWxsQW5pbWF0aW9ucyA9IGFsbEFuaW1hdGlvbnMubWFwKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc3R5bGVJbmZvID0gdGhpcyxcclxuXHRcdFx0XHRkZmQgPSAkLkRlZmVycmVkKCksXHJcblx0XHRcdFx0b3B0cyA9IGpRdWVyeS5leHRlbmQoe30sIG8sIHtcclxuXHRcdFx0XHRcdHF1ZXVlOiBmYWxzZSxcclxuXHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0ZGZkLnJlc29sdmUoIHN0eWxlSW5mbyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5lbC5hbmltYXRlKCB0aGlzLmRpZmYsIG9wdHMgKTtcclxuXHRcdFx0cmV0dXJuIGRmZC5wcm9taXNlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBvbmNlIGFsbCBhbmltYXRpb25zIGhhdmUgY29tcGxldGVkOlxyXG5cdFx0JC53aGVuLmFwcGx5KCAkLCBhbGxBbmltYXRpb25zLmdldCgpICkuZG9uZShmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdC8vIHNldCB0aGUgZmluYWwgY2xhc3NcclxuXHRcdFx0YXBwbHlDbGFzc0NoYW5nZSgpO1xyXG5cclxuXHRcdFx0Ly8gZm9yIGVhY2ggYW5pbWF0ZWQgZWxlbWVudCxcclxuXHRcdFx0Ly8gY2xlYXIgYWxsIGNzcyBwcm9wZXJ0aWVzIHRoYXQgd2VyZSBhbmltYXRlZFxyXG5cdFx0XHQkLmVhY2goIGFyZ3VtZW50cywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGVsID0gdGhpcy5lbDtcclxuXHRcdFx0XHQkLmVhY2goIHRoaXMuZGlmZiwgZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRcdFx0XHRlbC5jc3MoIGtleSwgJycgKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyB0aGlzIGlzIGd1YXJudGVlZCB0byBiZSB0aGVyZSBpZiB5b3UgdXNlIGpRdWVyeS5zcGVlZCgpXHJcblx0XHRcdC8vIGl0IGFsc28gaGFuZGxlcyBkZXF1ZXVpbmcgdGhlIG5leHQgYW5pbS4uLlxyXG5cdFx0XHRvLmNvbXBsZXRlLmNhbGwoIGFuaW1hdGVkWyAwIF0gKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuJC5mbi5leHRlbmQoe1xyXG5cdF9hZGRDbGFzczogJC5mbi5hZGRDbGFzcyxcclxuXHRhZGRDbGFzczogZnVuY3Rpb24oIGNsYXNzTmFtZXMsIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xyXG5cdFx0cmV0dXJuIHNwZWVkID9cclxuXHRcdFx0JC5lZmZlY3RzLmFuaW1hdGVDbGFzcy5jYWxsKCB0aGlzLFxyXG5cdFx0XHRcdHsgYWRkOiBjbGFzc05hbWVzIH0sIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkgOlxyXG5cdFx0XHR0aGlzLl9hZGRDbGFzcyggY2xhc3NOYW1lcyApO1xyXG5cdH0sXHJcblxyXG5cdF9yZW1vdmVDbGFzczogJC5mbi5yZW1vdmVDbGFzcyxcclxuXHRyZW1vdmVDbGFzczogZnVuY3Rpb24oIGNsYXNzTmFtZXMsIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkge1xyXG5cdFx0cmV0dXJuIHNwZWVkID9cclxuXHRcdFx0JC5lZmZlY3RzLmFuaW1hdGVDbGFzcy5jYWxsKCB0aGlzLFxyXG5cdFx0XHRcdHsgcmVtb3ZlOiBjbGFzc05hbWVzIH0sIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrICkgOlxyXG5cdFx0XHR0aGlzLl9yZW1vdmVDbGFzcyggY2xhc3NOYW1lcyApO1xyXG5cdH0sXHJcblxyXG5cdF90b2dnbGVDbGFzczogJC5mbi50b2dnbGVDbGFzcyxcclxuXHR0b2dnbGVDbGFzczogZnVuY3Rpb24oIGNsYXNzTmFtZXMsIGZvcmNlLCBzcGVlZCwgZWFzaW5nLCBjYWxsYmFjayApIHtcclxuXHRcdGlmICggdHlwZW9mIGZvcmNlID09PSBcImJvb2xlYW5cIiB8fCBmb3JjZSA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRpZiAoICFzcGVlZCApIHtcclxuXHRcdFx0XHQvLyB3aXRob3V0IHNwZWVkIHBhcmFtZXRlclxyXG5cdFx0XHRcdHJldHVybiB0aGlzLl90b2dnbGVDbGFzcyggY2xhc3NOYW1lcywgZm9yY2UgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJC5lZmZlY3RzLmFuaW1hdGVDbGFzcy5jYWxsKCB0aGlzLFxyXG5cdFx0XHRcdFx0KGZvcmNlID8geyBhZGQ6IGNsYXNzTmFtZXMgfSA6IHsgcmVtb3ZlOiBjbGFzc05hbWVzIH0pLFxyXG5cdFx0XHRcdFx0c3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gd2l0aG91dCBmb3JjZSBwYXJhbWV0ZXJcclxuXHRcdFx0cmV0dXJuICQuZWZmZWN0cy5hbmltYXRlQ2xhc3MuY2FsbCggdGhpcyxcclxuXHRcdFx0XHR7IHRvZ2dsZTogY2xhc3NOYW1lcyB9LCBmb3JjZSwgc3BlZWQsIGVhc2luZyApO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHN3aXRjaENsYXNzOiBmdW5jdGlvbiggcmVtb3ZlLCBhZGQsIHNwZWVkLCBlYXNpbmcsIGNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gJC5lZmZlY3RzLmFuaW1hdGVDbGFzcy5jYWxsKCB0aGlzLCB7XHJcblx0XHRcdGFkZDogYWRkLFxyXG5cdFx0XHRyZW1vdmU6IHJlbW92ZVxyXG5cdFx0fSwgc3BlZWQsIGVhc2luZywgY2FsbGJhY2sgKTtcclxuXHR9XHJcbn0pO1xyXG5cclxufSkoKTtcclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFRkZFQ1RTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4kLmV4dGVuZCggJC5lZmZlY3RzLCB7XHJcblx0dmVyc2lvbjogXCIxLjkuMVwiLFxyXG5cclxuXHQvLyBTYXZlcyBhIHNldCBvZiBwcm9wZXJ0aWVzIGluIGEgZGF0YSBzdG9yYWdlXHJcblx0c2F2ZTogZnVuY3Rpb24oIGVsZW1lbnQsIHNldCApIHtcclxuXHRcdGZvciggdmFyIGk9MDsgaSA8IHNldC5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0aWYgKCBzZXRbIGkgXSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRlbGVtZW50LmRhdGEoIGRhdGFTcGFjZSArIHNldFsgaSBdLCBlbGVtZW50WyAwIF0uc3R5bGVbIHNldFsgaSBdIF0gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8vIFJlc3RvcmVzIGEgc2V0IG9mIHByZXZpb3VzbHkgc2F2ZWQgcHJvcGVydGllcyBmcm9tIGEgZGF0YSBzdG9yYWdlXHJcblx0cmVzdG9yZTogZnVuY3Rpb24oIGVsZW1lbnQsIHNldCApIHtcclxuXHRcdHZhciB2YWwsIGk7XHJcblx0XHRmb3IoIGk9MDsgaSA8IHNldC5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0aWYgKCBzZXRbIGkgXSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHR2YWwgPSBlbGVtZW50LmRhdGEoIGRhdGFTcGFjZSArIHNldFsgaSBdICk7XHJcblx0XHRcdFx0Ly8gc3VwcG9ydDogalF1ZXJ5IDEuNi4yXHJcblx0XHRcdFx0Ly8gaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvOTkxN1xyXG5cdFx0XHRcdC8vIGpRdWVyeSAxLjYuMiBpbmNvcnJlY3RseSByZXR1cm5zIHVuZGVmaW5lZCBmb3IgYW55IGZhbHN5IHZhbHVlLlxyXG5cdFx0XHRcdC8vIFdlIGNhbid0IGRpZmZlcmVudGlhdGUgYmV0d2VlbiBcIlwiIGFuZCAwIGhlcmUsIHNvIHdlIGp1c3QgYXNzdW1lXHJcblx0XHRcdFx0Ly8gZW1wdHkgc3RyaW5nIHNpbmNlIGl0J3MgbGlrZWx5IHRvIGJlIGEgbW9yZSBjb21tb24gdmFsdWUuLi5cclxuXHRcdFx0XHRpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkge1xyXG5cdFx0XHRcdFx0dmFsID0gXCJcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxlbWVudC5jc3MoIHNldFsgaSBdLCB2YWwgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdHNldE1vZGU6IGZ1bmN0aW9uKCBlbCwgbW9kZSApIHtcclxuXHRcdGlmIChtb2RlID09PSBcInRvZ2dsZVwiKSB7XHJcblx0XHRcdG1vZGUgPSBlbC5pcyggXCI6aGlkZGVuXCIgKSA/IFwic2hvd1wiIDogXCJoaWRlXCI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbW9kZTtcclxuXHR9LFxyXG5cclxuXHQvLyBUcmFuc2xhdGVzIGEgW3RvcCxsZWZ0XSBhcnJheSBpbnRvIGEgYmFzZWxpbmUgdmFsdWVcclxuXHQvLyB0aGlzIHNob3VsZCBiZSBhIGxpdHRsZSBtb3JlIGZsZXhpYmxlIGluIHRoZSBmdXR1cmUgdG8gaGFuZGxlIGEgc3RyaW5nICYgaGFzaFxyXG5cdGdldEJhc2VsaW5lOiBmdW5jdGlvbiggb3JpZ2luLCBvcmlnaW5hbCApIHtcclxuXHRcdHZhciB5LCB4O1xyXG5cdFx0c3dpdGNoICggb3JpZ2luWyAwIF0gKSB7XHJcblx0XHRcdGNhc2UgXCJ0b3BcIjogeSA9IDA7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwibWlkZGxlXCI6IHkgPSAwLjU7IGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwiYm90dG9tXCI6IHkgPSAxOyBicmVhaztcclxuXHRcdFx0ZGVmYXVsdDogeSA9IG9yaWdpblsgMCBdIC8gb3JpZ2luYWwuaGVpZ2h0O1xyXG5cdFx0fVxyXG5cdFx0c3dpdGNoICggb3JpZ2luWyAxIF0gKSB7XHJcblx0XHRcdGNhc2UgXCJsZWZ0XCI6IHggPSAwOyBicmVhaztcclxuXHRcdFx0Y2FzZSBcImNlbnRlclwiOiB4ID0gMC41OyBicmVhaztcclxuXHRcdFx0Y2FzZSBcInJpZ2h0XCI6IHggPSAxOyBicmVhaztcclxuXHRcdFx0ZGVmYXVsdDogeCA9IG9yaWdpblsgMSBdIC8gb3JpZ2luYWwud2lkdGg7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR4OiB4LFxyXG5cdFx0XHR5OiB5XHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdC8vIFdyYXBzIHRoZSBlbGVtZW50IGFyb3VuZCBhIHdyYXBwZXIgdGhhdCBjb3BpZXMgcG9zaXRpb24gcHJvcGVydGllc1xyXG5cdGNyZWF0ZVdyYXBwZXI6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cclxuXHRcdC8vIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgd3JhcHBlZCwgcmV0dXJuIGl0XHJcblx0XHRpZiAoIGVsZW1lbnQucGFyZW50KCkuaXMoIFwiLnVpLWVmZmVjdHMtd3JhcHBlclwiICkpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnQucGFyZW50KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gd3JhcCB0aGUgZWxlbWVudFxyXG5cdFx0dmFyIHByb3BzID0ge1xyXG5cdFx0XHRcdHdpZHRoOiBlbGVtZW50Lm91dGVyV2lkdGgodHJ1ZSksXHJcblx0XHRcdFx0aGVpZ2h0OiBlbGVtZW50Lm91dGVySGVpZ2h0KHRydWUpLFxyXG5cdFx0XHRcdFwiZmxvYXRcIjogZWxlbWVudC5jc3MoIFwiZmxvYXRcIiApXHJcblx0XHRcdH0sXHJcblx0XHRcdHdyYXBwZXIgPSAkKCBcIjxkaXY+PC9kaXY+XCIgKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggXCJ1aS1lZmZlY3RzLXdyYXBwZXJcIiApXHJcblx0XHRcdFx0LmNzcyh7XHJcblx0XHRcdFx0XHRmb250U2l6ZTogXCIxMDAlXCIsXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXHJcblx0XHRcdFx0XHRib3JkZXI6IFwibm9uZVwiLFxyXG5cdFx0XHRcdFx0bWFyZ2luOiAwLFxyXG5cdFx0XHRcdFx0cGFkZGluZzogMFxyXG5cdFx0XHRcdH0pLFxyXG5cdFx0XHQvLyBTdG9yZSB0aGUgc2l6ZSBpbiBjYXNlIHdpZHRoL2hlaWdodCBhcmUgZGVmaW5lZCBpbiAlIC0gRml4ZXMgIzUyNDVcclxuXHRcdFx0c2l6ZSA9IHtcclxuXHRcdFx0XHR3aWR0aDogZWxlbWVudC53aWR0aCgpLFxyXG5cdFx0XHRcdGhlaWdodDogZWxlbWVudC5oZWlnaHQoKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuXHRcdC8vIHN1cHBvcnQ6IEZpcmVmb3hcclxuXHRcdC8vIEZpcmVmb3ggaW5jb3JyZWN0bHkgZXhwb3NlcyBhbm9ueW1vdXMgY29udGVudFxyXG5cdFx0Ly8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTYxNjY0XHJcblx0XHR0cnkge1xyXG5cdFx0XHRhY3RpdmUuaWQ7XHJcblx0XHR9IGNhdGNoKCBlICkge1xyXG5cdFx0XHRhY3RpdmUgPSBkb2N1bWVudC5ib2R5O1xyXG5cdFx0fVxyXG5cclxuXHRcdGVsZW1lbnQud3JhcCggd3JhcHBlciApO1xyXG5cclxuXHRcdC8vIEZpeGVzICM3NTk1IC0gRWxlbWVudHMgbG9zZSBmb2N1cyB3aGVuIHdyYXBwZWQuXHJcblx0XHRpZiAoIGVsZW1lbnRbIDAgXSA9PT0gYWN0aXZlIHx8ICQuY29udGFpbnMoIGVsZW1lbnRbIDAgXSwgYWN0aXZlICkgKSB7XHJcblx0XHRcdCQoIGFjdGl2ZSApLmZvY3VzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0d3JhcHBlciA9IGVsZW1lbnQucGFyZW50KCk7IC8vSG90Zml4IGZvciBqUXVlcnkgMS40IHNpbmNlIHNvbWUgY2hhbmdlIGluIHdyYXAoKSBzZWVtcyB0byBhY3R1YWxseSBsb3NlIHRoZSByZWZlcmVuY2UgdG8gdGhlIHdyYXBwZWQgZWxlbWVudFxyXG5cclxuXHRcdC8vIHRyYW5zZmVyIHBvc2l0aW9uaW5nIHByb3BlcnRpZXMgdG8gdGhlIHdyYXBwZXJcclxuXHRcdGlmICggZWxlbWVudC5jc3MoIFwicG9zaXRpb25cIiApID09PSBcInN0YXRpY1wiICkge1xyXG5cdFx0XHR3cmFwcGVyLmNzcyh7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIgfSk7XHJcblx0XHRcdGVsZW1lbnQuY3NzKHsgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQuZXh0ZW5kKCBwcm9wcywge1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBlbGVtZW50LmNzcyggXCJwb3NpdGlvblwiICksXHJcblx0XHRcdFx0ekluZGV4OiBlbGVtZW50LmNzcyggXCJ6LWluZGV4XCIgKVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JC5lYWNoKFsgXCJ0b3BcIiwgXCJsZWZ0XCIsIFwiYm90dG9tXCIsIFwicmlnaHRcIiBdLCBmdW5jdGlvbihpLCBwb3MpIHtcclxuXHRcdFx0XHRwcm9wc1sgcG9zIF0gPSBlbGVtZW50LmNzcyggcG9zICk7XHJcblx0XHRcdFx0aWYgKCBpc05hTiggcGFyc2VJbnQoIHByb3BzWyBwb3MgXSwgMTAgKSApICkge1xyXG5cdFx0XHRcdFx0cHJvcHNbIHBvcyBdID0gXCJhdXRvXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZWxlbWVudC5jc3Moe1xyXG5cdFx0XHRcdHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXHJcblx0XHRcdFx0dG9wOiAwLFxyXG5cdFx0XHRcdGxlZnQ6IDAsXHJcblx0XHRcdFx0cmlnaHQ6IFwiYXV0b1wiLFxyXG5cdFx0XHRcdGJvdHRvbTogXCJhdXRvXCJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRlbGVtZW50LmNzcyhzaXplKTtcclxuXHJcblx0XHRyZXR1cm4gd3JhcHBlci5jc3MoIHByb3BzICkuc2hvdygpO1xyXG5cdH0sXHJcblxyXG5cdHJlbW92ZVdyYXBwZXI6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0dmFyIGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblxyXG5cdFx0aWYgKCBlbGVtZW50LnBhcmVudCgpLmlzKCBcIi51aS1lZmZlY3RzLXdyYXBwZXJcIiApICkge1xyXG5cdFx0XHRlbGVtZW50LnBhcmVudCgpLnJlcGxhY2VXaXRoKCBlbGVtZW50ICk7XHJcblxyXG5cdFx0XHQvLyBGaXhlcyAjNzU5NSAtIEVsZW1lbnRzIGxvc2UgZm9jdXMgd2hlbiB3cmFwcGVkLlxyXG5cdFx0XHRpZiAoIGVsZW1lbnRbIDAgXSA9PT0gYWN0aXZlIHx8ICQuY29udGFpbnMoIGVsZW1lbnRbIDAgXSwgYWN0aXZlICkgKSB7XHJcblx0XHRcdFx0JCggYWN0aXZlICkuZm9jdXMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHR9LFxyXG5cclxuXHRzZXRUcmFuc2l0aW9uOiBmdW5jdGlvbiggZWxlbWVudCwgbGlzdCwgZmFjdG9yLCB2YWx1ZSApIHtcclxuXHRcdHZhbHVlID0gdmFsdWUgfHwge307XHJcblx0XHQkLmVhY2goIGxpc3QsIGZ1bmN0aW9uKCBpLCB4ICkge1xyXG5cdFx0XHR2YXIgdW5pdCA9IGVsZW1lbnQuY3NzVW5pdCggeCApO1xyXG5cdFx0XHRpZiAoIHVuaXRbIDAgXSA+IDAgKSB7XHJcblx0XHRcdFx0dmFsdWVbIHggXSA9IHVuaXRbIDAgXSAqIGZhY3RvciArIHVuaXRbIDEgXTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vIHJldHVybiBhbiBlZmZlY3Qgb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBnaXZlbiBwYXJhbWV0ZXJzOlxyXG5mdW5jdGlvbiBfbm9ybWFsaXplQXJndW1lbnRzKCBlZmZlY3QsIG9wdGlvbnMsIHNwZWVkLCBjYWxsYmFjayApIHtcclxuXHJcblx0Ly8gYWxsb3cgcGFzc2luZyBhbGwgb3B0aW9ucyBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyXHJcblx0aWYgKCAkLmlzUGxhaW5PYmplY3QoIGVmZmVjdCApICkge1xyXG5cdFx0b3B0aW9ucyA9IGVmZmVjdDtcclxuXHRcdGVmZmVjdCA9IGVmZmVjdC5lZmZlY3Q7XHJcblx0fVxyXG5cclxuXHQvLyBjb252ZXJ0IHRvIGFuIG9iamVjdFxyXG5cdGVmZmVjdCA9IHsgZWZmZWN0OiBlZmZlY3QgfTtcclxuXHJcblx0Ly8gY2F0Y2ggKGVmZmVjdCwgbnVsbCwgLi4uKVxyXG5cdGlmICggb3B0aW9ucyA9PSBudWxsICkge1xyXG5cdFx0b3B0aW9ucyA9IHt9O1xyXG5cdH1cclxuXHJcblx0Ly8gY2F0Y2ggKGVmZmVjdCwgY2FsbGJhY2spXHJcblx0aWYgKCAkLmlzRnVuY3Rpb24oIG9wdGlvbnMgKSApIHtcclxuXHRcdGNhbGxiYWNrID0gb3B0aW9ucztcclxuXHRcdHNwZWVkID0gbnVsbDtcclxuXHRcdG9wdGlvbnMgPSB7fTtcclxuXHR9XHJcblxyXG5cdC8vIGNhdGNoIChlZmZlY3QsIHNwZWVkLCA/KVxyXG5cdGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwibnVtYmVyXCIgfHwgJC5meC5zcGVlZHNbIG9wdGlvbnMgXSApIHtcclxuXHRcdGNhbGxiYWNrID0gc3BlZWQ7XHJcblx0XHRzcGVlZCA9IG9wdGlvbnM7XHJcblx0XHRvcHRpb25zID0ge307XHJcblx0fVxyXG5cclxuXHQvLyBjYXRjaCAoZWZmZWN0LCBvcHRpb25zLCBjYWxsYmFjaylcclxuXHRpZiAoICQuaXNGdW5jdGlvbiggc3BlZWQgKSApIHtcclxuXHRcdGNhbGxiYWNrID0gc3BlZWQ7XHJcblx0XHRzcGVlZCA9IG51bGw7XHJcblx0fVxyXG5cclxuXHQvLyBhZGQgb3B0aW9ucyB0byBlZmZlY3RcclxuXHRpZiAoIG9wdGlvbnMgKSB7XHJcblx0XHQkLmV4dGVuZCggZWZmZWN0LCBvcHRpb25zICk7XHJcblx0fVxyXG5cclxuXHRzcGVlZCA9IHNwZWVkIHx8IG9wdGlvbnMuZHVyYXRpb247XHJcblx0ZWZmZWN0LmR1cmF0aW9uID0gJC5meC5vZmYgPyAwIDpcclxuXHRcdHR5cGVvZiBzcGVlZCA9PT0gXCJudW1iZXJcIiA/IHNwZWVkIDpcclxuXHRcdHNwZWVkIGluICQuZnguc3BlZWRzID8gJC5meC5zcGVlZHNbIHNwZWVkIF0gOlxyXG5cdFx0JC5meC5zcGVlZHMuX2RlZmF1bHQ7XHJcblxyXG5cdGVmZmVjdC5jb21wbGV0ZSA9IGNhbGxiYWNrIHx8IG9wdGlvbnMuY29tcGxldGU7XHJcblxyXG5cdHJldHVybiBlZmZlY3Q7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YW5kYXJkU3BlZWQoIHNwZWVkICkge1xyXG5cdC8vIHZhbGlkIHN0YW5kYXJkIHNwZWVkc1xyXG5cdGlmICggIXNwZWVkIHx8IHR5cGVvZiBzcGVlZCA9PT0gXCJudW1iZXJcIiB8fCAkLmZ4LnNwZWVkc1sgc3BlZWQgXSApIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0Ly8gaW52YWxpZCBzdHJpbmdzIC0gdHJlYXQgYXMgXCJub3JtYWxcIiBzcGVlZFxyXG5cdGlmICggdHlwZW9mIHNwZWVkID09PSBcInN0cmluZ1wiICYmICEkLmVmZmVjdHMuZWZmZWN0WyBzcGVlZCBdICkge1xyXG5cdFx0Ly8gVE9ETzogcmVtb3ZlIGluIDIuMCAoIzcxMTUpXHJcblx0XHRpZiAoIGJhY2tDb21wYXQgJiYgJC5lZmZlY3RzWyBzcGVlZCBdICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuJC5mbi5leHRlbmQoe1xyXG5cdGVmZmVjdDogZnVuY3Rpb24oIC8qIGVmZmVjdCwgb3B0aW9ucywgc3BlZWQsIGNhbGxiYWNrICovICkge1xyXG5cdFx0dmFyIGFyZ3MgPSBfbm9ybWFsaXplQXJndW1lbnRzLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSxcclxuXHRcdFx0bW9kZSA9IGFyZ3MubW9kZSxcclxuXHRcdFx0cXVldWUgPSBhcmdzLnF1ZXVlLFxyXG5cdFx0XHRlZmZlY3RNZXRob2QgPSAkLmVmZmVjdHMuZWZmZWN0WyBhcmdzLmVmZmVjdCBdLFxyXG5cclxuXHRcdFx0Ly8gREVQUkVDQVRFRDogcmVtb3ZlIGluIDIuMCAoIzcxMTUpXHJcblx0XHRcdG9sZEVmZmVjdE1ldGhvZCA9ICFlZmZlY3RNZXRob2QgJiYgYmFja0NvbXBhdCAmJiAkLmVmZmVjdHNbIGFyZ3MuZWZmZWN0IF07XHJcblxyXG5cdFx0aWYgKCAkLmZ4Lm9mZiB8fCAhKCBlZmZlY3RNZXRob2QgfHwgb2xkRWZmZWN0TWV0aG9kICkgKSB7XHJcblx0XHRcdC8vIGRlbGVnYXRlIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QgKGUuZy4sIC5zaG93KCkpIGlmIHBvc3NpYmxlXHJcblx0XHRcdGlmICggbW9kZSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpc1sgbW9kZSBdKCBhcmdzLmR1cmF0aW9uLCBhcmdzLmNvbXBsZXRlICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoIGFyZ3MuY29tcGxldGUgKSB7XHJcblx0XHRcdFx0XHRcdGFyZ3MuY29tcGxldGUuY2FsbCggdGhpcyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gcnVuKCBuZXh0ICkge1xyXG5cdFx0XHR2YXIgZWxlbSA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRjb21wbGV0ZSA9IGFyZ3MuY29tcGxldGUsXHJcblx0XHRcdFx0bW9kZSA9IGFyZ3MubW9kZTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGRvbmUoKSB7XHJcblx0XHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oIGNvbXBsZXRlICkgKSB7XHJcblx0XHRcdFx0XHRjb21wbGV0ZS5jYWxsKCBlbGVtWzBdICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICggJC5pc0Z1bmN0aW9uKCBuZXh0ICkgKSB7XHJcblx0XHRcdFx0XHRuZXh0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiB0aGUgZWxlbWVudCBpcyBoaWRkZGVuIGFuZCBtb2RlIGlzIGhpZGUsXHJcblx0XHRcdC8vIG9yIGVsZW1lbnQgaXMgdmlzaWJsZSBhbmQgbW9kZSBpcyBzaG93XHJcblx0XHRcdGlmICggZWxlbS5pcyggXCI6aGlkZGVuXCIgKSA/IG1vZGUgPT09IFwiaGlkZVwiIDogbW9kZSA9PT0gXCJzaG93XCIgKSB7XHJcblx0XHRcdFx0ZG9uZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVmZmVjdE1ldGhvZC5jYWxsKCBlbGVtWzBdLCBhcmdzLCBkb25lICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiByZW1vdmUgdGhpcyBjaGVjayBpbiAyLjAsIGVmZmVjdE1ldGhvZCB3aWxsIGFsd2F5cyBiZSB0cnVlXHJcblx0XHRpZiAoIGVmZmVjdE1ldGhvZCApIHtcclxuXHRcdFx0cmV0dXJuIHF1ZXVlID09PSBmYWxzZSA/IHRoaXMuZWFjaCggcnVuICkgOiB0aGlzLnF1ZXVlKCBxdWV1ZSB8fCBcImZ4XCIsIHJ1biApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gREVQUkVDQVRFRDogcmVtb3ZlIGluIDIuMCAoIzcxMTUpXHJcblx0XHRcdHJldHVybiBvbGRFZmZlY3RNZXRob2QuY2FsbCh0aGlzLCB7XHJcblx0XHRcdFx0b3B0aW9uczogYXJncyxcclxuXHRcdFx0XHRkdXJhdGlvbjogYXJncy5kdXJhdGlvbixcclxuXHRcdFx0XHRjYWxsYmFjazogYXJncy5jb21wbGV0ZSxcclxuXHRcdFx0XHRtb2RlOiBhcmdzLm1vZGVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0X3Nob3c6ICQuZm4uc2hvdyxcclxuXHRzaG93OiBmdW5jdGlvbiggc3BlZWQgKSB7XHJcblx0XHRpZiAoIHN0YW5kYXJkU3BlZWQoIHNwZWVkICkgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9zaG93LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBhcmdzID0gX25vcm1hbGl6ZUFyZ3VtZW50cy5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0XHRcdGFyZ3MubW9kZSA9IFwic2hvd1wiO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lZmZlY3QuY2FsbCggdGhpcywgYXJncyApO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdF9oaWRlOiAkLmZuLmhpZGUsXHJcblx0aGlkZTogZnVuY3Rpb24oIHNwZWVkICkge1xyXG5cdFx0aWYgKCBzdGFuZGFyZFNwZWVkKCBzcGVlZCApICkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5faGlkZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgYXJncyA9IF9ub3JtYWxpemVBcmd1bWVudHMuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xyXG5cdFx0XHRhcmdzLm1vZGUgPSBcImhpZGVcIjtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZWZmZWN0LmNhbGwoIHRoaXMsIGFyZ3MgKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvLyBqUXVlcnkgY29yZSBvdmVybG9hZHMgdG9nZ2xlIGFuZCBjcmVhdGVzIF90b2dnbGVcclxuXHRfX3RvZ2dsZTogJC5mbi50b2dnbGUsXHJcblx0dG9nZ2xlOiBmdW5jdGlvbiggc3BlZWQgKSB7XHJcblx0XHRpZiAoIHN0YW5kYXJkU3BlZWQoIHNwZWVkICkgfHwgdHlwZW9mIHNwZWVkID09PSBcImJvb2xlYW5cIiB8fCAkLmlzRnVuY3Rpb24oIHNwZWVkICkgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLl9fdG9nZ2xlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBhcmdzID0gX25vcm1hbGl6ZUFyZ3VtZW50cy5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0XHRcdGFyZ3MubW9kZSA9IFwidG9nZ2xlXCI7XHJcblx0XHRcdHJldHVybiB0aGlzLmVmZmVjdC5jYWxsKCB0aGlzLCBhcmdzICk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0Ly8gaGVscGVyIGZ1bmN0aW9uc1xyXG5cdGNzc1VuaXQ6IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0dmFyIHN0eWxlID0gdGhpcy5jc3MoIGtleSApLFxyXG5cdFx0XHR2YWwgPSBbXTtcclxuXHJcblx0XHQkLmVhY2goIFsgXCJlbVwiLCBcInB4XCIsIFwiJVwiLCBcInB0XCIgXSwgZnVuY3Rpb24oIGksIHVuaXQgKSB7XHJcblx0XHRcdGlmICggc3R5bGUuaW5kZXhPZiggdW5pdCApID4gMCApIHtcclxuXHRcdFx0XHR2YWwgPSBbIHBhcnNlRmxvYXQoIHN0eWxlICksIHVuaXQgXTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdmFsO1xyXG5cdH1cclxufSk7XHJcblxyXG59KSgpO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVBU0lORyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbi8vIGJhc2VkIG9uIGVhc2luZyBlcXVhdGlvbnMgZnJvbSBSb2JlcnQgUGVubmVyIChodHRwOi8vd3d3LnJvYmVydHBlbm5lci5jb20vZWFzaW5nKVxyXG5cclxudmFyIGJhc2VFYXNpbmdzID0ge307XHJcblxyXG4kLmVhY2goIFsgXCJRdWFkXCIsIFwiQ3ViaWNcIiwgXCJRdWFydFwiLCBcIlF1aW50XCIsIFwiRXhwb1wiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xyXG5cdGJhc2VFYXNpbmdzWyBuYW1lIF0gPSBmdW5jdGlvbiggcCApIHtcclxuXHRcdHJldHVybiBNYXRoLnBvdyggcCwgaSArIDIgKTtcclxuXHR9O1xyXG59KTtcclxuXHJcbiQuZXh0ZW5kKCBiYXNlRWFzaW5ncywge1xyXG5cdFNpbmU6IGZ1bmN0aW9uICggcCApIHtcclxuXHRcdHJldHVybiAxIC0gTWF0aC5jb3MoIHAgKiBNYXRoLlBJIC8gMiApO1xyXG5cdH0sXHJcblx0Q2lyYzogZnVuY3Rpb24gKCBwICkge1xyXG5cdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoIDEgLSBwICogcCApO1xyXG5cdH0sXHJcblx0RWxhc3RpYzogZnVuY3Rpb24oIHAgKSB7XHJcblx0XHRyZXR1cm4gcCA9PT0gMCB8fCBwID09PSAxID8gcCA6XHJcblx0XHRcdC1NYXRoLnBvdyggMiwgOCAqIChwIC0gMSkgKSAqIE1hdGguc2luKCAoIChwIC0gMSkgKiA4MCAtIDcuNSApICogTWF0aC5QSSAvIDE1ICk7XHJcblx0fSxcclxuXHRCYWNrOiBmdW5jdGlvbiggcCApIHtcclxuXHRcdHJldHVybiBwICogcCAqICggMyAqIHAgLSAyICk7XHJcblx0fSxcclxuXHRCb3VuY2U6IGZ1bmN0aW9uICggcCApIHtcclxuXHRcdHZhciBwb3cyLFxyXG5cdFx0XHRib3VuY2UgPSA0O1xyXG5cclxuXHRcdHdoaWxlICggcCA8ICggKCBwb3cyID0gTWF0aC5wb3coIDIsIC0tYm91bmNlICkgKSAtIDEgKSAvIDExICkge31cclxuXHRcdHJldHVybiAxIC8gTWF0aC5wb3coIDQsIDMgLSBib3VuY2UgKSAtIDcuNTYyNSAqIE1hdGgucG93KCAoIHBvdzIgKiAzIC0gMiApIC8gMjIgLSBwLCAyICk7XHJcblx0fVxyXG59KTtcclxuXHJcbiQuZWFjaCggYmFzZUVhc2luZ3MsIGZ1bmN0aW9uKCBuYW1lLCBlYXNlSW4gKSB7XHJcblx0JC5lYXNpbmdbIFwiZWFzZUluXCIgKyBuYW1lIF0gPSBlYXNlSW47XHJcblx0JC5lYXNpbmdbIFwiZWFzZU91dFwiICsgbmFtZSBdID0gZnVuY3Rpb24oIHAgKSB7XHJcblx0XHRyZXR1cm4gMSAtIGVhc2VJbiggMSAtIHAgKTtcclxuXHR9O1xyXG5cdCQuZWFzaW5nWyBcImVhc2VJbk91dFwiICsgbmFtZSBdID0gZnVuY3Rpb24oIHAgKSB7XHJcblx0XHRyZXR1cm4gcCA8IDAuNSA/XHJcblx0XHRcdGVhc2VJbiggcCAqIDIgKSAvIDIgOlxyXG5cdFx0XHQxIC0gZWFzZUluKCBwICogLTIgKyAyICkgLyAyO1xyXG5cdH07XHJcbn0pO1xyXG5cclxufSkoKTtcclxuXHJcbn0pKGpRdWVyeSkpO1xyXG4iLCIvKiEgalF1ZXJ5IHZAMS44LjAganF1ZXJ5LmNvbSB8IGpxdWVyeS5vcmcvbGljZW5zZSAqL1xyXG4oZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBHKGEpe3ZhciBiPUZbYV09e307cmV0dXJuIHAuZWFjaChhLnNwbGl0KHMpLGZ1bmN0aW9uKGEsYyl7YltjXT0hMH0pLGJ9ZnVuY3Rpb24gSihhLGMsZCl7aWYoZD09PWImJmEubm9kZVR5cGU9PT0xKXt2YXIgZT1cImRhdGEtXCIrYy5yZXBsYWNlKEksXCItJDFcIikudG9Mb3dlckNhc2UoKTtkPWEuZ2V0QXR0cmlidXRlKGUpO2lmKHR5cGVvZiBkPT1cInN0cmluZ1wiKXt0cnl7ZD1kPT09XCJ0cnVlXCI/ITA6ZD09PVwiZmFsc2VcIj8hMTpkPT09XCJudWxsXCI/bnVsbDorZCtcIlwiPT09ZD8rZDpILnRlc3QoZCk/cC5wYXJzZUpTT04oZCk6ZH1jYXRjaChmKXt9cC5kYXRhKGEsYyxkKX1lbHNlIGQ9Yn1yZXR1cm4gZH1mdW5jdGlvbiBLKGEpe3ZhciBiO2ZvcihiIGluIGEpe2lmKGI9PT1cImRhdGFcIiYmcC5pc0VtcHR5T2JqZWN0KGFbYl0pKWNvbnRpbnVlO2lmKGIhPT1cInRvSlNPTlwiKXJldHVybiExfXJldHVybiEwfWZ1bmN0aW9uIGJhKCl7cmV0dXJuITF9ZnVuY3Rpb24gYmIoKXtyZXR1cm4hMH1mdW5jdGlvbiBiaChhKXtyZXR1cm4hYXx8IWEucGFyZW50Tm9kZXx8YS5wYXJlbnROb2RlLm5vZGVUeXBlPT09MTF9ZnVuY3Rpb24gYmkoYSxiKXtkbyBhPWFbYl07d2hpbGUoYSYmYS5ub2RlVHlwZSE9PTEpO3JldHVybiBhfWZ1bmN0aW9uIGJqKGEsYixjKXtiPWJ8fDA7aWYocC5pc0Z1bmN0aW9uKGIpKXJldHVybiBwLmdyZXAoYSxmdW5jdGlvbihhLGQpe3ZhciBlPSEhYi5jYWxsKGEsZCxhKTtyZXR1cm4gZT09PWN9KTtpZihiLm5vZGVUeXBlKXJldHVybiBwLmdyZXAoYSxmdW5jdGlvbihhLGQpe3JldHVybiBhPT09Yj09PWN9KTtpZih0eXBlb2YgYj09XCJzdHJpbmdcIil7dmFyIGQ9cC5ncmVwKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGEubm9kZVR5cGU9PT0xfSk7aWYoYmUudGVzdChiKSlyZXR1cm4gcC5maWx0ZXIoYixkLCFjKTtiPXAuZmlsdGVyKGIsZCl9cmV0dXJuIHAuZ3JlcChhLGZ1bmN0aW9uKGEsZCl7cmV0dXJuIHAuaW5BcnJheShhLGIpPj0wPT09Y30pfWZ1bmN0aW9uIGJrKGEpe3ZhciBiPWJsLnNwbGl0KFwifFwiKSxjPWEuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO2lmKGMuY3JlYXRlRWxlbWVudCl3aGlsZShiLmxlbmd0aCljLmNyZWF0ZUVsZW1lbnQoYi5wb3AoKSk7cmV0dXJuIGN9ZnVuY3Rpb24gYkMoYSxiKXtyZXR1cm4gYS5nZXRFbGVtZW50c0J5VGFnTmFtZShiKVswXXx8YS5hcHBlbmRDaGlsZChhLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChiKSl9ZnVuY3Rpb24gYkQoYSxiKXtpZihiLm5vZGVUeXBlIT09MXx8IXAuaGFzRGF0YShhKSlyZXR1cm47dmFyIGMsZCxlLGY9cC5fZGF0YShhKSxnPXAuX2RhdGEoYixmKSxoPWYuZXZlbnRzO2lmKGgpe2RlbGV0ZSBnLmhhbmRsZSxnLmV2ZW50cz17fTtmb3IoYyBpbiBoKWZvcihkPTAsZT1oW2NdLmxlbmd0aDtkPGU7ZCsrKXAuZXZlbnQuYWRkKGIsYyxoW2NdW2RdKX1nLmRhdGEmJihnLmRhdGE9cC5leHRlbmQoe30sZy5kYXRhKSl9ZnVuY3Rpb24gYkUoYSxiKXt2YXIgYztpZihiLm5vZGVUeXBlIT09MSlyZXR1cm47Yi5jbGVhckF0dHJpYnV0ZXMmJmIuY2xlYXJBdHRyaWJ1dGVzKCksYi5tZXJnZUF0dHJpYnV0ZXMmJmIubWVyZ2VBdHRyaWJ1dGVzKGEpLGM9Yi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLGM9PT1cIm9iamVjdFwiPyhiLnBhcmVudE5vZGUmJihiLm91dGVySFRNTD1hLm91dGVySFRNTCkscC5zdXBwb3J0Lmh0bWw1Q2xvbmUmJmEuaW5uZXJIVE1MJiYhcC50cmltKGIuaW5uZXJIVE1MKSYmKGIuaW5uZXJIVE1MPWEuaW5uZXJIVE1MKSk6Yz09PVwiaW5wdXRcIiYmYnYudGVzdChhLnR5cGUpPyhiLmRlZmF1bHRDaGVja2VkPWIuY2hlY2tlZD1hLmNoZWNrZWQsYi52YWx1ZSE9PWEudmFsdWUmJihiLnZhbHVlPWEudmFsdWUpKTpjPT09XCJvcHRpb25cIj9iLnNlbGVjdGVkPWEuZGVmYXVsdFNlbGVjdGVkOmM9PT1cImlucHV0XCJ8fGM9PT1cInRleHRhcmVhXCI/Yi5kZWZhdWx0VmFsdWU9YS5kZWZhdWx0VmFsdWU6Yz09PVwic2NyaXB0XCImJmIudGV4dCE9PWEudGV4dCYmKGIudGV4dD1hLnRleHQpLGIucmVtb3ZlQXR0cmlidXRlKHAuZXhwYW5kbyl9ZnVuY3Rpb24gYkYoYSl7cmV0dXJuIHR5cGVvZiBhLmdldEVsZW1lbnRzQnlUYWdOYW1lIT1cInVuZGVmaW5lZFwiP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpOnR5cGVvZiBhLnF1ZXJ5U2VsZWN0b3JBbGwhPVwidW5kZWZpbmVkXCI/YS5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKTpbXX1mdW5jdGlvbiBiRyhhKXtidi50ZXN0KGEudHlwZSkmJihhLmRlZmF1bHRDaGVja2VkPWEuY2hlY2tlZCl9ZnVuY3Rpb24gYlgoYSxiKXtpZihiIGluIGEpcmV0dXJuIGI7dmFyIGM9Yi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGQ9YixlPWJWLmxlbmd0aDt3aGlsZShlLS0pe2I9YlZbZV0rYztpZihiIGluIGEpcmV0dXJuIGJ9cmV0dXJuIGR9ZnVuY3Rpb24gYlkoYSxiKXtyZXR1cm4gYT1ifHxhLHAuY3NzKGEsXCJkaXNwbGF5XCIpPT09XCJub25lXCJ8fCFwLmNvbnRhaW5zKGEub3duZXJEb2N1bWVudCxhKX1mdW5jdGlvbiBiWihhLGIpe3ZhciBjLGQsZT1bXSxmPTAsZz1hLmxlbmd0aDtmb3IoO2Y8ZztmKyspe2M9YVtmXTtpZighYy5zdHlsZSljb250aW51ZTtlW2ZdPXAuX2RhdGEoYyxcIm9sZGRpc3BsYXlcIiksYj8oIWVbZl0mJmMuc3R5bGUuZGlzcGxheT09PVwibm9uZVwiJiYoYy5zdHlsZS5kaXNwbGF5PVwiXCIpLGMuc3R5bGUuZGlzcGxheT09PVwiXCImJmJZKGMpJiYoZVtmXT1wLl9kYXRhKGMsXCJvbGRkaXNwbGF5XCIsY2IoYy5ub2RlTmFtZSkpKSk6KGQ9YkgoYyxcImRpc3BsYXlcIiksIWVbZl0mJmQhPT1cIm5vbmVcIiYmcC5fZGF0YShjLFwib2xkZGlzcGxheVwiLGQpKX1mb3IoZj0wO2Y8ZztmKyspe2M9YVtmXTtpZighYy5zdHlsZSljb250aW51ZTtpZighYnx8Yy5zdHlsZS5kaXNwbGF5PT09XCJub25lXCJ8fGMuc3R5bGUuZGlzcGxheT09PVwiXCIpYy5zdHlsZS5kaXNwbGF5PWI/ZVtmXXx8XCJcIjpcIm5vbmVcIn1yZXR1cm4gYX1mdW5jdGlvbiBiJChhLGIsYyl7dmFyIGQ9Yk8uZXhlYyhiKTtyZXR1cm4gZD9NYXRoLm1heCgwLGRbMV0tKGN8fDApKSsoZFsyXXx8XCJweFwiKTpifWZ1bmN0aW9uIGJfKGEsYixjLGQpe3ZhciBlPWM9PT0oZD9cImJvcmRlclwiOlwiY29udGVudFwiKT80OmI9PT1cIndpZHRoXCI/MTowLGY9MDtmb3IoO2U8NDtlKz0yKWM9PT1cIm1hcmdpblwiJiYoZis9cC5jc3MoYSxjK2JVW2VdLCEwKSksZD8oYz09PVwiY29udGVudFwiJiYoZi09cGFyc2VGbG9hdChiSChhLFwicGFkZGluZ1wiK2JVW2VdKSl8fDApLGMhPT1cIm1hcmdpblwiJiYoZi09cGFyc2VGbG9hdChiSChhLFwiYm9yZGVyXCIrYlVbZV0rXCJXaWR0aFwiKSl8fDApKTooZis9cGFyc2VGbG9hdChiSChhLFwicGFkZGluZ1wiK2JVW2VdKSl8fDAsYyE9PVwicGFkZGluZ1wiJiYoZis9cGFyc2VGbG9hdChiSChhLFwiYm9yZGVyXCIrYlVbZV0rXCJXaWR0aFwiKSl8fDApKTtyZXR1cm4gZn1mdW5jdGlvbiBjYShhLGIsYyl7dmFyIGQ9Yj09PVwid2lkdGhcIj9hLm9mZnNldFdpZHRoOmEub2Zmc2V0SGVpZ2h0LGU9ITAsZj1wLnN1cHBvcnQuYm94U2l6aW5nJiZwLmNzcyhhLFwiYm94U2l6aW5nXCIpPT09XCJib3JkZXItYm94XCI7aWYoZDw9MCl7ZD1iSChhLGIpO2lmKGQ8MHx8ZD09bnVsbClkPWEuc3R5bGVbYl07aWYoYlAudGVzdChkKSlyZXR1cm4gZDtlPWYmJihwLnN1cHBvcnQuYm94U2l6aW5nUmVsaWFibGV8fGQ9PT1hLnN0eWxlW2JdKSxkPXBhcnNlRmxvYXQoZCl8fDB9cmV0dXJuIGQrYl8oYSxiLGN8fChmP1wiYm9yZGVyXCI6XCJjb250ZW50XCIpLGUpK1wicHhcIn1mdW5jdGlvbiBjYihhKXtpZihiUlthXSlyZXR1cm4gYlJbYV07dmFyIGI9cChcIjxcIithK1wiPlwiKS5hcHBlbmRUbyhlLmJvZHkpLGM9Yi5jc3MoXCJkaXNwbGF5XCIpO2IucmVtb3ZlKCk7aWYoYz09PVwibm9uZVwifHxjPT09XCJcIil7Ykk9ZS5ib2R5LmFwcGVuZENoaWxkKGJJfHxwLmV4dGVuZChlLmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIikse2ZyYW1lQm9yZGVyOjAsd2lkdGg6MCxoZWlnaHQ6MH0pKTtpZighYkp8fCFiSS5jcmVhdGVFbGVtZW50KWJKPShiSS5jb250ZW50V2luZG93fHxiSS5jb250ZW50RG9jdW1lbnQpLmRvY3VtZW50LGJKLndyaXRlKFwiPCFkb2N0eXBlIGh0bWw+PGh0bWw+PGJvZHk+XCIpLGJKLmNsb3NlKCk7Yj1iSi5ib2R5LmFwcGVuZENoaWxkKGJKLmNyZWF0ZUVsZW1lbnQoYSkpLGM9YkgoYixcImRpc3BsYXlcIiksZS5ib2R5LnJlbW92ZUNoaWxkKGJJKX1yZXR1cm4gYlJbYV09YyxjfWZ1bmN0aW9uIGNoKGEsYixjLGQpe3ZhciBlO2lmKHAuaXNBcnJheShiKSlwLmVhY2goYixmdW5jdGlvbihiLGUpe2N8fGNkLnRlc3QoYSk/ZChhLGUpOmNoKGErXCJbXCIrKHR5cGVvZiBlPT1cIm9iamVjdFwiP2I6XCJcIikrXCJdXCIsZSxjLGQpfSk7ZWxzZSBpZighYyYmcC50eXBlKGIpPT09XCJvYmplY3RcIilmb3IoZSBpbiBiKWNoKGErXCJbXCIrZStcIl1cIixiW2VdLGMsZCk7ZWxzZSBkKGEsYil9ZnVuY3Rpb24gY3koYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7dHlwZW9mIGIhPVwic3RyaW5nXCImJihjPWIsYj1cIipcIik7dmFyIGQsZSxmLGc9Yi50b0xvd2VyQ2FzZSgpLnNwbGl0KHMpLGg9MCxpPWcubGVuZ3RoO2lmKHAuaXNGdW5jdGlvbihjKSlmb3IoO2g8aTtoKyspZD1nW2hdLGY9L15cXCsvLnRlc3QoZCksZiYmKGQ9ZC5zdWJzdHIoMSl8fFwiKlwiKSxlPWFbZF09YVtkXXx8W10sZVtmP1widW5zaGlmdFwiOlwicHVzaFwiXShjKX19ZnVuY3Rpb24gY3ooYSxjLGQsZSxmLGcpe2Y9Znx8Yy5kYXRhVHlwZXNbMF0sZz1nfHx7fSxnW2ZdPSEwO3ZhciBoLGk9YVtmXSxqPTAsaz1pP2kubGVuZ3RoOjAsbD1hPT09Y3U7Zm9yKDtqPGsmJihsfHwhaCk7aisrKWg9aVtqXShjLGQsZSksdHlwZW9mIGg9PVwic3RyaW5nXCImJighbHx8Z1toXT9oPWI6KGMuZGF0YVR5cGVzLnVuc2hpZnQoaCksaD1jeihhLGMsZCxlLGgsZykpKTtyZXR1cm4obHx8IWgpJiYhZ1tcIipcIl0mJihoPWN6KGEsYyxkLGUsXCIqXCIsZykpLGh9ZnVuY3Rpb24gY0EoYSxjKXt2YXIgZCxlLGY9cC5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnN8fHt9O2ZvcihkIGluIGMpY1tkXSE9PWImJigoZltkXT9hOmV8fChlPXt9KSlbZF09Y1tkXSk7ZSYmcC5leHRlbmQoITAsYSxlKX1mdW5jdGlvbiBjQihhLGMsZCl7dmFyIGUsZixnLGgsaT1hLmNvbnRlbnRzLGo9YS5kYXRhVHlwZXMsaz1hLnJlc3BvbnNlRmllbGRzO2ZvcihmIGluIGspZiBpbiBkJiYoY1trW2ZdXT1kW2ZdKTt3aGlsZShqWzBdPT09XCIqXCIpai5zaGlmdCgpLGU9PT1iJiYoZT1hLm1pbWVUeXBlfHxjLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpKTtpZihlKWZvcihmIGluIGkpaWYoaVtmXSYmaVtmXS50ZXN0KGUpKXtqLnVuc2hpZnQoZik7YnJlYWt9aWYoalswXWluIGQpZz1qWzBdO2Vsc2V7Zm9yKGYgaW4gZCl7aWYoIWpbMF18fGEuY29udmVydGVyc1tmK1wiIFwiK2pbMF1dKXtnPWY7YnJlYWt9aHx8KGg9Zil9Zz1nfHxofWlmKGcpcmV0dXJuIGchPT1qWzBdJiZqLnVuc2hpZnQoZyksZFtnXX1mdW5jdGlvbiBjQyhhLGIpe3ZhciBjLGQsZSxmLGc9YS5kYXRhVHlwZXMuc2xpY2UoKSxoPWdbMF0saT17fSxqPTA7YS5kYXRhRmlsdGVyJiYoYj1hLmRhdGFGaWx0ZXIoYixhLmRhdGFUeXBlKSk7aWYoZ1sxXSlmb3IoYyBpbiBhLmNvbnZlcnRlcnMpaVtjLnRvTG93ZXJDYXNlKCldPWEuY29udmVydGVyc1tjXTtmb3IoO2U9Z1srK2pdOylpZihlIT09XCIqXCIpe2lmKGghPT1cIipcIiYmaCE9PWUpe2M9aVtoK1wiIFwiK2VdfHxpW1wiKiBcIitlXTtpZighYylmb3IoZCBpbiBpKXtmPWQuc3BsaXQoXCIgXCIpO2lmKGZbMV09PT1lKXtjPWlbaCtcIiBcIitmWzBdXXx8aVtcIiogXCIrZlswXV07aWYoYyl7Yz09PSEwP2M9aVtkXTppW2RdIT09ITAmJihlPWZbMF0sZy5zcGxpY2Uoai0tLDAsZSkpO2JyZWFrfX19aWYoYyE9PSEwKWlmKGMmJmFbXCJ0aHJvd3NcIl0pYj1jKGIpO2Vsc2UgdHJ5e2I9YyhiKX1jYXRjaChrKXtyZXR1cm57c3RhdGU6XCJwYXJzZXJlcnJvclwiLGVycm9yOmM/azpcIk5vIGNvbnZlcnNpb24gZnJvbSBcIitoK1wiIHRvIFwiK2V9fX1oPWV9cmV0dXJue3N0YXRlOlwic3VjY2Vzc1wiLGRhdGE6Yn19ZnVuY3Rpb24gY0soKXt0cnl7cmV0dXJuIG5ldyBhLlhNTEh0dHBSZXF1ZXN0fWNhdGNoKGIpe319ZnVuY3Rpb24gY0woKXt0cnl7cmV0dXJuIG5ldyBhLkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKX1jYXRjaChiKXt9fWZ1bmN0aW9uIGNUKCl7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtjTT1ifSwwKSxjTT1wLm5vdygpfWZ1bmN0aW9uIGNVKGEsYil7cC5lYWNoKGIsZnVuY3Rpb24oYixjKXt2YXIgZD0oY1NbYl18fFtdKS5jb25jYXQoY1NbXCIqXCJdKSxlPTAsZj1kLmxlbmd0aDtmb3IoO2U8ZjtlKyspaWYoZFtlXS5jYWxsKGEsYixjKSlyZXR1cm59KX1mdW5jdGlvbiBjVihhLGIsYyl7dmFyIGQsZT0wLGY9MCxnPWNSLmxlbmd0aCxoPXAuRGVmZXJyZWQoKS5hbHdheXMoZnVuY3Rpb24oKXtkZWxldGUgaS5lbGVtfSksaT1mdW5jdGlvbigpe3ZhciBiPWNNfHxjVCgpLGM9TWF0aC5tYXgoMCxqLnN0YXJ0VGltZStqLmR1cmF0aW9uLWIpLGQ9MS0oYy9qLmR1cmF0aW9ufHwwKSxlPTAsZj1qLnR3ZWVucy5sZW5ndGg7Zm9yKDtlPGY7ZSsrKWoudHdlZW5zW2VdLnJ1bihkKTtyZXR1cm4gaC5ub3RpZnlXaXRoKGEsW2osZCxjXSksZDwxJiZmP2M6KGgucmVzb2x2ZVdpdGgoYSxbal0pLCExKX0saj1oLnByb21pc2Uoe2VsZW06YSxwcm9wczpwLmV4dGVuZCh7fSxiKSxvcHRzOnAuZXh0ZW5kKCEwLHtzcGVjaWFsRWFzaW5nOnt9fSxjKSxvcmlnaW5hbFByb3BlcnRpZXM6YixvcmlnaW5hbE9wdGlvbnM6YyxzdGFydFRpbWU6Y018fGNUKCksZHVyYXRpb246Yy5kdXJhdGlvbix0d2VlbnM6W10sY3JlYXRlVHdlZW46ZnVuY3Rpb24oYixjLGQpe3ZhciBlPXAuVHdlZW4oYSxqLm9wdHMsYixjLGoub3B0cy5zcGVjaWFsRWFzaW5nW2JdfHxqLm9wdHMuZWFzaW5nKTtyZXR1cm4gai50d2VlbnMucHVzaChlKSxlfSxzdG9wOmZ1bmN0aW9uKGIpe3ZhciBjPTAsZD1iP2oudHdlZW5zLmxlbmd0aDowO2Zvcig7YzxkO2MrKylqLnR3ZWVuc1tjXS5ydW4oMSk7cmV0dXJuIGI/aC5yZXNvbHZlV2l0aChhLFtqLGJdKTpoLnJlamVjdFdpdGgoYSxbaixiXSksdGhpc319KSxrPWoucHJvcHM7Y1coayxqLm9wdHMuc3BlY2lhbEVhc2luZyk7Zm9yKDtlPGc7ZSsrKXtkPWNSW2VdLmNhbGwoaixhLGssai5vcHRzKTtpZihkKXJldHVybiBkfXJldHVybiBjVShqLGspLHAuaXNGdW5jdGlvbihqLm9wdHMuc3RhcnQpJiZqLm9wdHMuc3RhcnQuY2FsbChhLGopLHAuZngudGltZXIocC5leHRlbmQoaSx7YW5pbTpqLHF1ZXVlOmoub3B0cy5xdWV1ZSxlbGVtOmF9KSksai5wcm9ncmVzcyhqLm9wdHMucHJvZ3Jlc3MpLmRvbmUoai5vcHRzLmRvbmUsai5vcHRzLmNvbXBsZXRlKS5mYWlsKGoub3B0cy5mYWlsKS5hbHdheXMoai5vcHRzLmFsd2F5cyl9ZnVuY3Rpb24gY1coYSxiKXt2YXIgYyxkLGUsZixnO2ZvcihjIGluIGEpe2Q9cC5jYW1lbENhc2UoYyksZT1iW2RdLGY9YVtjXSxwLmlzQXJyYXkoZikmJihlPWZbMV0sZj1hW2NdPWZbMF0pLGMhPT1kJiYoYVtkXT1mLGRlbGV0ZSBhW2NdKSxnPXAuY3NzSG9va3NbZF07aWYoZyYmXCJleHBhbmRcImluIGcpe2Y9Zy5leHBhbmQoZiksZGVsZXRlIGFbZF07Zm9yKGMgaW4gZiljIGluIGF8fChhW2NdPWZbY10sYltjXT1lKX1lbHNlIGJbZF09ZX19ZnVuY3Rpb24gY1goYSxiLGMpe3ZhciBkLGUsZixnLGgsaSxqLGssbD10aGlzLG09YS5zdHlsZSxuPXt9LG89W10scT1hLm5vZGVUeXBlJiZiWShhKTtjLnF1ZXVlfHwoaj1wLl9xdWV1ZUhvb2tzKGEsXCJmeFwiKSxqLnVucXVldWVkPT1udWxsJiYoai51bnF1ZXVlZD0wLGs9ai5lbXB0eS5maXJlLGouZW1wdHkuZmlyZT1mdW5jdGlvbigpe2oudW5xdWV1ZWR8fGsoKX0pLGoudW5xdWV1ZWQrKyxsLmFsd2F5cyhmdW5jdGlvbigpe2wuYWx3YXlzKGZ1bmN0aW9uKCl7ai51bnF1ZXVlZC0tLHAucXVldWUoYSxcImZ4XCIpLmxlbmd0aHx8ai5lbXB0eS5maXJlKCl9KX0pKSxhLm5vZGVUeXBlPT09MSYmKFwiaGVpZ2h0XCJpbiBifHxcIndpZHRoXCJpbiBiKSYmKGMub3ZlcmZsb3c9W20ub3ZlcmZsb3csbS5vdmVyZmxvd1gsbS5vdmVyZmxvd1ldLHAuY3NzKGEsXCJkaXNwbGF5XCIpPT09XCJpbmxpbmVcIiYmcC5jc3MoYSxcImZsb2F0XCIpPT09XCJub25lXCImJighcC5zdXBwb3J0LmlubGluZUJsb2NrTmVlZHNMYXlvdXR8fGNiKGEubm9kZU5hbWUpPT09XCJpbmxpbmVcIj9tLmRpc3BsYXk9XCJpbmxpbmUtYmxvY2tcIjptLnpvb209MSkpLGMub3ZlcmZsb3cmJihtLm92ZXJmbG93PVwiaGlkZGVuXCIscC5zdXBwb3J0LnNocmlua1dyYXBCbG9ja3N8fGwuZG9uZShmdW5jdGlvbigpe20ub3ZlcmZsb3c9Yy5vdmVyZmxvd1swXSxtLm92ZXJmbG93WD1jLm92ZXJmbG93WzFdLG0ub3ZlcmZsb3dZPWMub3ZlcmZsb3dbMl19KSk7Zm9yKGQgaW4gYil7Zj1iW2RdO2lmKGNPLmV4ZWMoZikpe2RlbGV0ZSBiW2RdO2lmKGY9PT0ocT9cImhpZGVcIjpcInNob3dcIikpY29udGludWU7by5wdXNoKGQpfX1nPW8ubGVuZ3RoO2lmKGcpe2g9cC5fZGF0YShhLFwiZnhzaG93XCIpfHxwLl9kYXRhKGEsXCJmeHNob3dcIix7fSkscT9wKGEpLnNob3coKTpsLmRvbmUoZnVuY3Rpb24oKXtwKGEpLmhpZGUoKX0pLGwuZG9uZShmdW5jdGlvbigpe3ZhciBiO3AucmVtb3ZlRGF0YShhLFwiZnhzaG93XCIsITApO2ZvcihiIGluIG4pcC5zdHlsZShhLGIsbltiXSl9KTtmb3IoZD0wO2Q8ZztkKyspZT1vW2RdLGk9bC5jcmVhdGVUd2VlbihlLHE/aFtlXTowKSxuW2VdPWhbZV18fHAuc3R5bGUoYSxlKSxlIGluIGh8fChoW2VdPWkuc3RhcnQscSYmKGkuZW5kPWkuc3RhcnQsaS5zdGFydD1lPT09XCJ3aWR0aFwifHxlPT09XCJoZWlnaHRcIj8xOjApKX19ZnVuY3Rpb24gY1koYSxiLGMsZCxlKXtyZXR1cm4gbmV3IGNZLnByb3RvdHlwZS5pbml0KGEsYixjLGQsZSl9ZnVuY3Rpb24gY1ooYSxiKXt2YXIgYyxkPXtoZWlnaHQ6YX0sZT0wO2Zvcig7ZTw0O2UrPTItYiljPWJVW2VdLGRbXCJtYXJnaW5cIitjXT1kW1wicGFkZGluZ1wiK2NdPWE7cmV0dXJuIGImJihkLm9wYWNpdHk9ZC53aWR0aD1hKSxkfWZ1bmN0aW9uIGNfKGEpe3JldHVybiBwLmlzV2luZG93KGEpP2E6YS5ub2RlVHlwZT09PTk/YS5kZWZhdWx0Vmlld3x8YS5wYXJlbnRXaW5kb3c6ITF9dmFyIGMsZCxlPWEuZG9jdW1lbnQsZj1hLmxvY2F0aW9uLGc9YS5uYXZpZ2F0b3IsaD1hLmpRdWVyeSxpPWEuJCxqPUFycmF5LnByb3RvdHlwZS5wdXNoLGs9QXJyYXkucHJvdG90eXBlLnNsaWNlLGw9QXJyYXkucHJvdG90eXBlLmluZGV4T2YsbT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLG49T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxvPVN0cmluZy5wcm90b3R5cGUudHJpbSxwPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBwLmZuLmluaXQoYSxiLGMpfSxxPS9bXFwtK10/KD86XFxkKlxcLnwpXFxkKyg/OltlRV1bXFwtK10/XFxkK3wpLy5zb3VyY2Uscj0vXFxTLyxzPS9cXHMrLyx0PXIudGVzdChcIsKgXCIpPy9eW1xcc1xceEEwXSt8W1xcc1xceEEwXSskL2c6L15cXHMrfFxccyskL2csdT0vXig/OlteIzxdKig8W1xcd1xcV10rPilbXj5dKiR8IyhbXFx3XFwtXSopJCkvLHY9L148KFxcdyspXFxzKlxcLz8+KD86PFxcL1xcMT58KSQvLHc9L15bXFxdLDp7fVxcc10qJC8seD0vKD86Xnw6fCwpKD86XFxzKlxcWykrL2cseT0vXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVtcXGRhLWZBLUZdezR9KS9nLHo9L1wiW15cIlxcXFxcXHJcXG5dKlwifHRydWV8ZmFsc2V8bnVsbHwtPyg/OlxcZFxcZCpcXC58KVxcZCsoPzpbZUVdW1xcLStdP1xcZCt8KS9nLEE9L14tbXMtLyxCPS8tKFtcXGRhLXpdKS9naSxDPWZ1bmN0aW9uKGEsYil7cmV0dXJuKGIrXCJcIikudG9VcHBlckNhc2UoKX0sRD1mdW5jdGlvbigpe2UuYWRkRXZlbnRMaXN0ZW5lcj8oZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLEQsITEpLHAucmVhZHkoKSk6ZS5yZWFkeVN0YXRlPT09XCJjb21wbGV0ZVwiJiYoZS5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLEQpLHAucmVhZHkoKSl9LEU9e307cC5mbj1wLnByb3RvdHlwZT17Y29uc3RydWN0b3I6cCxpbml0OmZ1bmN0aW9uKGEsYyxkKXt2YXIgZixnLGgsaTtpZighYSlyZXR1cm4gdGhpcztpZihhLm5vZGVUeXBlKXJldHVybiB0aGlzLmNvbnRleHQ9dGhpc1swXT1hLHRoaXMubGVuZ3RoPTEsdGhpcztpZih0eXBlb2YgYT09XCJzdHJpbmdcIil7YS5jaGFyQXQoMCk9PT1cIjxcIiYmYS5jaGFyQXQoYS5sZW5ndGgtMSk9PT1cIj5cIiYmYS5sZW5ndGg+PTM/Zj1bbnVsbCxhLG51bGxdOmY9dS5leGVjKGEpO2lmKGYmJihmWzFdfHwhYykpe2lmKGZbMV0pcmV0dXJuIGM9YyBpbnN0YW5jZW9mIHA/Y1swXTpjLGk9YyYmYy5ub2RlVHlwZT9jLm93bmVyRG9jdW1lbnR8fGM6ZSxhPXAucGFyc2VIVE1MKGZbMV0saSwhMCksdi50ZXN0KGZbMV0pJiZwLmlzUGxhaW5PYmplY3QoYykmJnRoaXMuYXR0ci5jYWxsKGEsYywhMCkscC5tZXJnZSh0aGlzLGEpO2c9ZS5nZXRFbGVtZW50QnlJZChmWzJdKTtpZihnJiZnLnBhcmVudE5vZGUpe2lmKGcuaWQhPT1mWzJdKXJldHVybiBkLmZpbmQoYSk7dGhpcy5sZW5ndGg9MSx0aGlzWzBdPWd9cmV0dXJuIHRoaXMuY29udGV4dD1lLHRoaXMuc2VsZWN0b3I9YSx0aGlzfXJldHVybiFjfHxjLmpxdWVyeT8oY3x8ZCkuZmluZChhKTp0aGlzLmNvbnN0cnVjdG9yKGMpLmZpbmQoYSl9cmV0dXJuIHAuaXNGdW5jdGlvbihhKT9kLnJlYWR5KGEpOihhLnNlbGVjdG9yIT09YiYmKHRoaXMuc2VsZWN0b3I9YS5zZWxlY3Rvcix0aGlzLmNvbnRleHQ9YS5jb250ZXh0KSxwLm1ha2VBcnJheShhLHRoaXMpKX0sc2VsZWN0b3I6XCJcIixqcXVlcnk6XCIxLjguMFwiLGxlbmd0aDowLHNpemU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sZW5ndGh9LHRvQXJyYXk6ZnVuY3Rpb24oKXtyZXR1cm4gay5jYWxsKHRoaXMpfSxnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PW51bGw/dGhpcy50b0FycmF5KCk6YTwwP3RoaXNbdGhpcy5sZW5ndGgrYV06dGhpc1thXX0scHVzaFN0YWNrOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1wLm1lcmdlKHRoaXMuY29uc3RydWN0b3IoKSxhKTtyZXR1cm4gZC5wcmV2T2JqZWN0PXRoaXMsZC5jb250ZXh0PXRoaXMuY29udGV4dCxiPT09XCJmaW5kXCI/ZC5zZWxlY3Rvcj10aGlzLnNlbGVjdG9yKyh0aGlzLnNlbGVjdG9yP1wiIFwiOlwiXCIpK2M6YiYmKGQuc2VsZWN0b3I9dGhpcy5zZWxlY3RvcitcIi5cIitiK1wiKFwiK2MrXCIpXCIpLGR9LGVhY2g6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gcC5lYWNoKHRoaXMsYSxiKX0scmVhZHk6ZnVuY3Rpb24oYSl7cmV0dXJuIHAucmVhZHkucHJvbWlzZSgpLmRvbmUoYSksdGhpc30sZXE6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9K2EsYT09PS0xP3RoaXMuc2xpY2UoYSk6dGhpcy5zbGljZShhLGErMSl9LGZpcnN0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXEoMCl9LGxhc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgtMSl9LHNsaWNlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGsuYXBwbHkodGhpcyxhcmd1bWVudHMpLFwic2xpY2VcIixrLmNhbGwoYXJndW1lbnRzKS5qb2luKFwiLFwiKSl9LG1hcDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2socC5tYXAodGhpcyxmdW5jdGlvbihiLGMpe3JldHVybiBhLmNhbGwoYixjLGIpfSkpfSxlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcmV2T2JqZWN0fHx0aGlzLmNvbnN0cnVjdG9yKG51bGwpfSxwdXNoOmosc29ydDpbXS5zb3J0LHNwbGljZTpbXS5zcGxpY2V9LHAuZm4uaW5pdC5wcm90b3R5cGU9cC5mbixwLmV4dGVuZD1wLmZuLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGMsZCxlLGYsZyxoPWFyZ3VtZW50c1swXXx8e30saT0xLGo9YXJndW1lbnRzLmxlbmd0aCxrPSExO3R5cGVvZiBoPT1cImJvb2xlYW5cIiYmKGs9aCxoPWFyZ3VtZW50c1sxXXx8e30saT0yKSx0eXBlb2YgaCE9XCJvYmplY3RcIiYmIXAuaXNGdW5jdGlvbihoKSYmKGg9e30pLGo9PT1pJiYoaD10aGlzLC0taSk7Zm9yKDtpPGo7aSsrKWlmKChhPWFyZ3VtZW50c1tpXSkhPW51bGwpZm9yKGMgaW4gYSl7ZD1oW2NdLGU9YVtjXTtpZihoPT09ZSljb250aW51ZTtrJiZlJiYocC5pc1BsYWluT2JqZWN0KGUpfHwoZj1wLmlzQXJyYXkoZSkpKT8oZj8oZj0hMSxnPWQmJnAuaXNBcnJheShkKT9kOltdKTpnPWQmJnAuaXNQbGFpbk9iamVjdChkKT9kOnt9LGhbY109cC5leHRlbmQoayxnLGUpKTplIT09YiYmKGhbY109ZSl9cmV0dXJuIGh9LHAuZXh0ZW5kKHtub0NvbmZsaWN0OmZ1bmN0aW9uKGIpe3JldHVybiBhLiQ9PT1wJiYoYS4kPWkpLGImJmEualF1ZXJ5PT09cCYmKGEualF1ZXJ5PWgpLHB9LGlzUmVhZHk6ITEscmVhZHlXYWl0OjEsaG9sZFJlYWR5OmZ1bmN0aW9uKGEpe2E/cC5yZWFkeVdhaXQrKzpwLnJlYWR5KCEwKX0scmVhZHk6ZnVuY3Rpb24oYSl7aWYoYT09PSEwPy0tcC5yZWFkeVdhaXQ6cC5pc1JlYWR5KXJldHVybjtpZighZS5ib2R5KXJldHVybiBzZXRUaW1lb3V0KHAucmVhZHksMSk7cC5pc1JlYWR5PSEwO2lmKGEhPT0hMCYmLS1wLnJlYWR5V2FpdD4wKXJldHVybjtkLnJlc29sdmVXaXRoKGUsW3BdKSxwLmZuLnRyaWdnZXImJnAoZSkudHJpZ2dlcihcInJlYWR5XCIpLm9mZihcInJlYWR5XCIpfSxpc0Z1bmN0aW9uOmZ1bmN0aW9uKGEpe3JldHVybiBwLnR5cGUoYSk9PT1cImZ1bmN0aW9uXCJ9LGlzQXJyYXk6QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oYSl7cmV0dXJuIHAudHlwZShhKT09PVwiYXJyYXlcIn0saXNXaW5kb3c6ZnVuY3Rpb24oYSl7cmV0dXJuIGEhPW51bGwmJmE9PWEud2luZG93fSxpc051bWVyaWM6ZnVuY3Rpb24oYSl7cmV0dXJuIWlzTmFOKHBhcnNlRmxvYXQoYSkpJiZpc0Zpbml0ZShhKX0sdHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gYT09bnVsbD9TdHJpbmcoYSk6RVttLmNhbGwoYSldfHxcIm9iamVjdFwifSxpc1BsYWluT2JqZWN0OmZ1bmN0aW9uKGEpe2lmKCFhfHxwLnR5cGUoYSkhPT1cIm9iamVjdFwifHxhLm5vZGVUeXBlfHxwLmlzV2luZG93KGEpKXJldHVybiExO3RyeXtpZihhLmNvbnN0cnVjdG9yJiYhbi5jYWxsKGEsXCJjb25zdHJ1Y3RvclwiKSYmIW4uY2FsbChhLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxcImlzUHJvdG90eXBlT2ZcIikpcmV0dXJuITF9Y2F0Y2goYyl7cmV0dXJuITF9dmFyIGQ7Zm9yKGQgaW4gYSk7cmV0dXJuIGQ9PT1ifHxuLmNhbGwoYSxkKX0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihhKXt2YXIgYjtmb3IoYiBpbiBhKXJldHVybiExO3JldHVybiEwfSxlcnJvcjpmdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoYSl9LHBhcnNlSFRNTDpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIWF8fHR5cGVvZiBhIT1cInN0cmluZ1wiP251bGw6KHR5cGVvZiBiPT1cImJvb2xlYW5cIiYmKGM9YixiPTApLGI9Ynx8ZSwoZD12LmV4ZWMoYSkpP1tiLmNyZWF0ZUVsZW1lbnQoZFsxXSldOihkPXAuYnVpbGRGcmFnbWVudChbYV0sYixjP251bGw6W10pLHAubWVyZ2UoW10sKGQuY2FjaGVhYmxlP3AuY2xvbmUoZC5mcmFnbWVudCk6ZC5mcmFnbWVudCkuY2hpbGROb2RlcykpKX0scGFyc2VKU09OOmZ1bmN0aW9uKGIpe2lmKCFifHx0eXBlb2YgYiE9XCJzdHJpbmdcIilyZXR1cm4gbnVsbDtiPXAudHJpbShiKTtpZihhLkpTT04mJmEuSlNPTi5wYXJzZSlyZXR1cm4gYS5KU09OLnBhcnNlKGIpO2lmKHcudGVzdChiLnJlcGxhY2UoeSxcIkBcIikucmVwbGFjZSh6LFwiXVwiKS5yZXBsYWNlKHgsXCJcIikpKXJldHVybihuZXcgRnVuY3Rpb24oXCJyZXR1cm4gXCIrYikpKCk7cC5lcnJvcihcIkludmFsaWQgSlNPTjogXCIrYil9LHBhcnNlWE1MOmZ1bmN0aW9uKGMpe3ZhciBkLGU7aWYoIWN8fHR5cGVvZiBjIT1cInN0cmluZ1wiKXJldHVybiBudWxsO3RyeXthLkRPTVBhcnNlcj8oZT1uZXcgRE9NUGFyc2VyLGQ9ZS5wYXJzZUZyb21TdHJpbmcoYyxcInRleHQveG1sXCIpKTooZD1uZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxET01cIiksZC5hc3luYz1cImZhbHNlXCIsZC5sb2FkWE1MKGMpKX1jYXRjaChmKXtkPWJ9cmV0dXJuKCFkfHwhZC5kb2N1bWVudEVsZW1lbnR8fGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwYXJzZXJlcnJvclwiKS5sZW5ndGgpJiZwLmVycm9yKFwiSW52YWxpZCBYTUw6IFwiK2MpLGR9LG5vb3A6ZnVuY3Rpb24oKXt9LGdsb2JhbEV2YWw6ZnVuY3Rpb24oYil7YiYmci50ZXN0KGIpJiYoYS5leGVjU2NyaXB0fHxmdW5jdGlvbihiKXthLmV2YWwuY2FsbChhLGIpfSkoYil9LGNhbWVsQ2FzZTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKEEsXCJtcy1cIikucmVwbGFjZShCLEMpfSxub2RlTmFtZTpmdW5jdGlvbihhLGIpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk9PT1iLnRvVXBwZXJDYXNlKCl9LGVhY2g6ZnVuY3Rpb24oYSxjLGQpe3ZhciBlLGY9MCxnPWEubGVuZ3RoLGg9Zz09PWJ8fHAuaXNGdW5jdGlvbihhKTtpZihkKXtpZihoKXtmb3IoZSBpbiBhKWlmKGMuYXBwbHkoYVtlXSxkKT09PSExKWJyZWFrfWVsc2UgZm9yKDtmPGc7KWlmKGMuYXBwbHkoYVtmKytdLGQpPT09ITEpYnJlYWt9ZWxzZSBpZihoKXtmb3IoZSBpbiBhKWlmKGMuY2FsbChhW2VdLGUsYVtlXSk9PT0hMSlicmVha31lbHNlIGZvcig7ZjxnOylpZihjLmNhbGwoYVtmXSxmLGFbZisrXSk9PT0hMSlicmVhaztyZXR1cm4gYX0sdHJpbTpvP2Z1bmN0aW9uKGEpe3JldHVybiBhPT1udWxsP1wiXCI6by5jYWxsKGEpfTpmdW5jdGlvbihhKXtyZXR1cm4gYT09bnVsbD9cIlwiOmEudG9TdHJpbmcoKS5yZXBsYWNlKHQsXCJcIil9LG1ha2VBcnJheTpmdW5jdGlvbihhLGIpe3ZhciBjLGQ9Ynx8W107cmV0dXJuIGEhPW51bGwmJihjPXAudHlwZShhKSxhLmxlbmd0aD09bnVsbHx8Yz09PVwic3RyaW5nXCJ8fGM9PT1cImZ1bmN0aW9uXCJ8fGM9PT1cInJlZ2V4cFwifHxwLmlzV2luZG93KGEpP2ouY2FsbChkLGEpOnAubWVyZ2UoZCxhKSksZH0saW5BcnJheTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7aWYoYil7aWYobClyZXR1cm4gbC5jYWxsKGIsYSxjKTtkPWIubGVuZ3RoLGM9Yz9jPDA/TWF0aC5tYXgoMCxkK2MpOmM6MDtmb3IoO2M8ZDtjKyspaWYoYyBpbiBiJiZiW2NdPT09YSlyZXR1cm4gY31yZXR1cm4tMX0sbWVyZ2U6ZnVuY3Rpb24oYSxjKXt2YXIgZD1jLmxlbmd0aCxlPWEubGVuZ3RoLGY9MDtpZih0eXBlb2YgZD09XCJudW1iZXJcIilmb3IoO2Y8ZDtmKyspYVtlKytdPWNbZl07ZWxzZSB3aGlsZShjW2ZdIT09YilhW2UrK109Y1tmKytdO3JldHVybiBhLmxlbmd0aD1lLGF9LGdyZXA6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU9W10sZj0wLGc9YS5sZW5ndGg7Yz0hIWM7Zm9yKDtmPGc7ZisrKWQ9ISFiKGFbZl0sZiksYyE9PWQmJmUucHVzaChhW2ZdKTtyZXR1cm4gZX0sbWFwOmZ1bmN0aW9uKGEsYyxkKXt2YXIgZSxmLGc9W10saD0wLGk9YS5sZW5ndGgsaj1hIGluc3RhbmNlb2YgcHx8aSE9PWImJnR5cGVvZiBpPT1cIm51bWJlclwiJiYoaT4wJiZhWzBdJiZhW2ktMV18fGk9PT0wfHxwLmlzQXJyYXkoYSkpO2lmKGopZm9yKDtoPGk7aCsrKWU9YyhhW2hdLGgsZCksZSE9bnVsbCYmKGdbZy5sZW5ndGhdPWUpO2Vsc2UgZm9yKGYgaW4gYSllPWMoYVtmXSxmLGQpLGUhPW51bGwmJihnW2cubGVuZ3RoXT1lKTtyZXR1cm4gZy5jb25jYXQuYXBwbHkoW10sZyl9LGd1aWQ6MSxwcm94eTpmdW5jdGlvbihhLGMpe3ZhciBkLGUsZjtyZXR1cm4gdHlwZW9mIGM9PVwic3RyaW5nXCImJihkPWFbY10sYz1hLGE9ZCkscC5pc0Z1bmN0aW9uKGEpPyhlPWsuY2FsbChhcmd1bWVudHMsMiksZj1mdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGMsZS5jb25jYXQoay5jYWxsKGFyZ3VtZW50cykpKX0sZi5ndWlkPWEuZ3VpZD1hLmd1aWR8fGYuZ3VpZHx8cC5ndWlkKyssZik6Yn0sYWNjZXNzOmZ1bmN0aW9uKGEsYyxkLGUsZixnLGgpe3ZhciBpLGo9ZD09bnVsbCxrPTAsbD1hLmxlbmd0aDtpZihkJiZ0eXBlb2YgZD09XCJvYmplY3RcIil7Zm9yKGsgaW4gZClwLmFjY2VzcyhhLGMsayxkW2tdLDEsZyxlKTtmPTF9ZWxzZSBpZihlIT09Yil7aT1oPT09YiYmcC5pc0Z1bmN0aW9uKGUpLGomJihpPyhpPWMsYz1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGkuY2FsbChwKGEpLGMpfSk6KGMuY2FsbChhLGUpLGM9bnVsbCkpO2lmKGMpZm9yKDtrPGw7aysrKWMoYVtrXSxkLGk/ZS5jYWxsKGFba10sayxjKGFba10sZCkpOmUsaCk7Zj0xfXJldHVybiBmP2E6aj9jLmNhbGwoYSk6bD9jKGFbMF0sZCk6Z30sbm93OmZ1bmN0aW9uKCl7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCl9fSkscC5yZWFkeS5wcm9taXNlPWZ1bmN0aW9uKGIpe2lmKCFkKXtkPXAuRGVmZXJyZWQoKTtpZihlLnJlYWR5U3RhdGU9PT1cImNvbXBsZXRlXCJ8fGUucmVhZHlTdGF0ZSE9PVwibG9hZGluZ1wiJiZlLmFkZEV2ZW50TGlzdGVuZXIpc2V0VGltZW91dChwLnJlYWR5LDEpO2Vsc2UgaWYoZS5hZGRFdmVudExpc3RlbmVyKWUuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixELCExKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIscC5yZWFkeSwhMSk7ZWxzZXtlLmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsRCksYS5hdHRhY2hFdmVudChcIm9ubG9hZFwiLHAucmVhZHkpO3ZhciBjPSExO3RyeXtjPWEuZnJhbWVFbGVtZW50PT1udWxsJiZlLmRvY3VtZW50RWxlbWVudH1jYXRjaChmKXt9YyYmYy5kb1Njcm9sbCYmZnVuY3Rpb24gZygpe2lmKCFwLmlzUmVhZHkpe3RyeXtjLmRvU2Nyb2xsKFwibGVmdFwiKX1jYXRjaChhKXtyZXR1cm4gc2V0VGltZW91dChnLDUwKX1wLnJlYWR5KCl9fSgpfX1yZXR1cm4gZC5wcm9taXNlKGIpfSxwLmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0XCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEsYil7RVtcIltvYmplY3QgXCIrYitcIl1cIl09Yi50b0xvd2VyQ2FzZSgpfSksYz1wKGUpO3ZhciBGPXt9O3AuQ2FsbGJhY2tzPWZ1bmN0aW9uKGEpe2E9dHlwZW9mIGE9PVwic3RyaW5nXCI/RlthXXx8RyhhKTpwLmV4dGVuZCh7fSxhKTt2YXIgYyxkLGUsZixnLGgsaT1bXSxqPSFhLm9uY2UmJltdLGs9ZnVuY3Rpb24oYil7Yz1hLm1lbW9yeSYmYixkPSEwLGg9Znx8MCxmPTAsZz1pLmxlbmd0aCxlPSEwO2Zvcig7aSYmaDxnO2grKylpZihpW2hdLmFwcGx5KGJbMF0sYlsxXSk9PT0hMSYmYS5zdG9wT25GYWxzZSl7Yz0hMTticmVha31lPSExLGkmJihqP2oubGVuZ3RoJiZrKGouc2hpZnQoKSk6Yz9pPVtdOmwuZGlzYWJsZSgpKX0sbD17YWRkOmZ1bmN0aW9uKCl7aWYoaSl7dmFyIGI9aS5sZW5ndGg7KGZ1bmN0aW9uIGQoYil7cC5lYWNoKGIsZnVuY3Rpb24oYixjKXtwLmlzRnVuY3Rpb24oYykmJighYS51bmlxdWV8fCFsLmhhcyhjKSk/aS5wdXNoKGMpOmMmJmMubGVuZ3RoJiZkKGMpfSl9KShhcmd1bWVudHMpLGU/Zz1pLmxlbmd0aDpjJiYoZj1iLGsoYykpfXJldHVybiB0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oKXtyZXR1cm4gaSYmcC5lYWNoKGFyZ3VtZW50cyxmdW5jdGlvbihhLGIpe3ZhciBjO3doaWxlKChjPXAuaW5BcnJheShiLGksYykpPi0xKWkuc3BsaWNlKGMsMSksZSYmKGM8PWcmJmctLSxjPD1oJiZoLS0pfSksdGhpc30saGFzOmZ1bmN0aW9uKGEpe3JldHVybiBwLmluQXJyYXkoYSxpKT4tMX0sZW1wdHk6ZnVuY3Rpb24oKXtyZXR1cm4gaT1bXSx0aGlzfSxkaXNhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIGk9aj1jPWIsdGhpc30sZGlzYWJsZWQ6ZnVuY3Rpb24oKXtyZXR1cm4haX0sbG9jazpmdW5jdGlvbigpe3JldHVybiBqPWIsY3x8bC5kaXNhYmxlKCksdGhpc30sbG9ja2VkOmZ1bmN0aW9uKCl7cmV0dXJuIWp9LGZpcmVXaXRoOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9Ynx8W10sYj1bYSxiLnNsaWNlP2Iuc2xpY2UoKTpiXSxpJiYoIWR8fGopJiYoZT9qLnB1c2goYik6ayhiKSksdGhpc30sZmlyZTpmdW5jdGlvbigpe3JldHVybiBsLmZpcmVXaXRoKHRoaXMsYXJndW1lbnRzKSx0aGlzfSxmaXJlZDpmdW5jdGlvbigpe3JldHVybiEhZH19O3JldHVybiBsfSxwLmV4dGVuZCh7RGVmZXJyZWQ6ZnVuY3Rpb24oYSl7dmFyIGI9W1tcInJlc29sdmVcIixcImRvbmVcIixwLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLFwicmVzb2x2ZWRcIl0sW1wicmVqZWN0XCIsXCJmYWlsXCIscC5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxcInJlamVjdGVkXCJdLFtcIm5vdGlmeVwiLFwicHJvZ3Jlc3NcIixwLkNhbGxiYWNrcyhcIm1lbW9yeVwiKV1dLGM9XCJwZW5kaW5nXCIsZD17c3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gY30sYWx3YXlzOmZ1bmN0aW9uKCl7cmV0dXJuIGUuZG9uZShhcmd1bWVudHMpLmZhaWwoYXJndW1lbnRzKSx0aGlzfSx0aGVuOmZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzO3JldHVybiBwLkRlZmVycmVkKGZ1bmN0aW9uKGMpe3AuZWFjaChiLGZ1bmN0aW9uKGIsZCl7dmFyIGY9ZFswXSxnPWFbYl07ZVtkWzFdXShwLmlzRnVuY3Rpb24oZyk/ZnVuY3Rpb24oKXt2YXIgYT1nLmFwcGx5KHRoaXMsYXJndW1lbnRzKTthJiZwLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9hLnByb21pc2UoKS5kb25lKGMucmVzb2x2ZSkuZmFpbChjLnJlamVjdCkucHJvZ3Jlc3MoYy5ub3RpZnkpOmNbZitcIldpdGhcIl0odGhpcz09PWU/Yzp0aGlzLFthXSl9OmNbZl0pfSksYT1udWxsfSkucHJvbWlzZSgpfSxwcm9taXNlOmZ1bmN0aW9uKGEpe3JldHVybiB0eXBlb2YgYT09XCJvYmplY3RcIj9wLmV4dGVuZChhLGQpOmR9fSxlPXt9O3JldHVybiBkLnBpcGU9ZC50aGVuLHAuZWFjaChiLGZ1bmN0aW9uKGEsZil7dmFyIGc9ZlsyXSxoPWZbM107ZFtmWzFdXT1nLmFkZCxoJiZnLmFkZChmdW5jdGlvbigpe2M9aH0sYlthXjFdWzJdLmRpc2FibGUsYlsyXVsyXS5sb2NrKSxlW2ZbMF1dPWcuZmlyZSxlW2ZbMF0rXCJXaXRoXCJdPWcuZmlyZVdpdGh9KSxkLnByb21pc2UoZSksYSYmYS5jYWxsKGUsZSksZX0sd2hlbjpmdW5jdGlvbihhKXt2YXIgYj0wLGM9ay5jYWxsKGFyZ3VtZW50cyksZD1jLmxlbmd0aCxlPWQhPT0xfHxhJiZwLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9kOjAsZj1lPT09MT9hOnAuRGVmZXJyZWQoKSxnPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCl7YlthXT10aGlzLGNbYV09YXJndW1lbnRzLmxlbmd0aD4xP2suY2FsbChhcmd1bWVudHMpOmQsYz09PWg/Zi5ub3RpZnlXaXRoKGIsYyk6LS1lfHxmLnJlc29sdmVXaXRoKGIsYyl9fSxoLGksajtpZihkPjEpe2g9bmV3IEFycmF5KGQpLGk9bmV3IEFycmF5KGQpLGo9bmV3IEFycmF5KGQpO2Zvcig7YjxkO2IrKyljW2JdJiZwLmlzRnVuY3Rpb24oY1tiXS5wcm9taXNlKT9jW2JdLnByb21pc2UoKS5kb25lKGcoYixqLGMpKS5mYWlsKGYucmVqZWN0KS5wcm9ncmVzcyhnKGIsaSxoKSk6LS1lfXJldHVybiBlfHxmLnJlc29sdmVXaXRoKGosYyksZi5wcm9taXNlKCl9fSkscC5zdXBwb3J0PWZ1bmN0aW9uKCl7dmFyIGIsYyxkLGYsZyxoLGksaixrLGwsbSxuPWUuY3JlYXRlRWxlbWVudChcImRpdlwiKTtuLnNldEF0dHJpYnV0ZShcImNsYXNzTmFtZVwiLFwidFwiKSxuLmlubmVySFRNTD1cIiAgPGxpbmsvPjx0YWJsZT48L3RhYmxlPjxhIGhyZWY9Jy9hJz5hPC9hPjxpbnB1dCB0eXBlPSdjaGVja2JveCcvPlwiLGM9bi5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIiksZD1uLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSxkLnN0eWxlLmNzc1RleHQ9XCJ0b3A6MXB4O2Zsb2F0OmxlZnQ7b3BhY2l0eTouNVwiO2lmKCFjfHwhYy5sZW5ndGh8fCFkKXJldHVybnt9O2Y9ZS5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpLGc9Zi5hcHBlbmRDaGlsZChlLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikpLGg9bi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLGI9e2xlYWRpbmdXaGl0ZXNwYWNlOm4uZmlyc3RDaGlsZC5ub2RlVHlwZT09PTMsdGJvZHk6IW4uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKS5sZW5ndGgsaHRtbFNlcmlhbGl6ZTohIW4uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIpLmxlbmd0aCxzdHlsZTovdG9wLy50ZXN0KGQuZ2V0QXR0cmlidXRlKFwic3R5bGVcIikpLGhyZWZOb3JtYWxpemVkOmQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKT09PVwiL2FcIixvcGFjaXR5Oi9eMC41Ly50ZXN0KGQuc3R5bGUub3BhY2l0eSksY3NzRmxvYXQ6ISFkLnN0eWxlLmNzc0Zsb2F0LGNoZWNrT246aC52YWx1ZT09PVwib25cIixvcHRTZWxlY3RlZDpnLnNlbGVjdGVkLGdldFNldEF0dHJpYnV0ZTpuLmNsYXNzTmFtZSE9PVwidFwiLGVuY3R5cGU6ISFlLmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLmVuY3R5cGUsaHRtbDVDbG9uZTplLmNyZWF0ZUVsZW1lbnQoXCJuYXZcIikuY2xvbmVOb2RlKCEwKS5vdXRlckhUTUwhPT1cIjw6bmF2PjwvOm5hdj5cIixib3hNb2RlbDplLmNvbXBhdE1vZGU9PT1cIkNTUzFDb21wYXRcIixzdWJtaXRCdWJibGVzOiEwLGNoYW5nZUJ1YmJsZXM6ITAsZm9jdXNpbkJ1YmJsZXM6ITEsZGVsZXRlRXhwYW5kbzohMCxub0Nsb25lRXZlbnQ6ITAsaW5saW5lQmxvY2tOZWVkc0xheW91dDohMSxzaHJpbmtXcmFwQmxvY2tzOiExLHJlbGlhYmxlTWFyZ2luUmlnaHQ6ITAsYm94U2l6aW5nUmVsaWFibGU6ITAscGl4ZWxQb3NpdGlvbjohMX0saC5jaGVja2VkPSEwLGIubm9DbG9uZUNoZWNrZWQ9aC5jbG9uZU5vZGUoITApLmNoZWNrZWQsZi5kaXNhYmxlZD0hMCxiLm9wdERpc2FibGVkPSFnLmRpc2FibGVkO3RyeXtkZWxldGUgbi50ZXN0fWNhdGNoKG8pe2IuZGVsZXRlRXhwYW5kbz0hMX0hbi5hZGRFdmVudExpc3RlbmVyJiZuLmF0dGFjaEV2ZW50JiZuLmZpcmVFdmVudCYmKG4uYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsbT1mdW5jdGlvbigpe2Iubm9DbG9uZUV2ZW50PSExfSksbi5jbG9uZU5vZGUoITApLmZpcmVFdmVudChcIm9uY2xpY2tcIiksbi5kZXRhY2hFdmVudChcIm9uY2xpY2tcIixtKSksaD1lLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxoLnZhbHVlPVwidFwiLGguc2V0QXR0cmlidXRlKFwidHlwZVwiLFwicmFkaW9cIiksYi5yYWRpb1ZhbHVlPWgudmFsdWU9PT1cInRcIixoLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIixcImNoZWNrZWRcIiksaC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJ0XCIpLG4uYXBwZW5kQ2hpbGQoaCksaT1lLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxpLmFwcGVuZENoaWxkKG4ubGFzdENoaWxkKSxiLmNoZWNrQ2xvbmU9aS5jbG9uZU5vZGUoITApLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmNoZWNrZWQsYi5hcHBlbmRDaGVja2VkPWguY2hlY2tlZCxpLnJlbW92ZUNoaWxkKGgpLGkuYXBwZW5kQ2hpbGQobik7aWYobi5hdHRhY2hFdmVudClmb3IoayBpbntzdWJtaXQ6ITAsY2hhbmdlOiEwLGZvY3VzaW46ITB9KWo9XCJvblwiK2ssbD1qIGluIG4sbHx8KG4uc2V0QXR0cmlidXRlKGosXCJyZXR1cm47XCIpLGw9dHlwZW9mIG5bal09PVwiZnVuY3Rpb25cIiksYltrK1wiQnViYmxlc1wiXT1sO3JldHVybiBwKGZ1bmN0aW9uKCl7dmFyIGMsZCxmLGcsaD1cInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5OmJsb2NrO292ZXJmbG93OmhpZGRlbjtcIixpPWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO2lmKCFpKXJldHVybjtjPWUuY3JlYXRlRWxlbWVudChcImRpdlwiKSxjLnN0eWxlLmNzc1RleHQ9XCJ2aXNpYmlsaXR5OmhpZGRlbjtib3JkZXI6MDt3aWR0aDowO2hlaWdodDowO3Bvc2l0aW9uOnN0YXRpYzt0b3A6MDttYXJnaW4tdG9wOjFweFwiLGkuaW5zZXJ0QmVmb3JlKGMsaS5maXJzdENoaWxkKSxkPWUuY3JlYXRlRWxlbWVudChcImRpdlwiKSxjLmFwcGVuZENoaWxkKGQpLGQuaW5uZXJIVE1MPVwiPHRhYmxlPjx0cj48dGQ+PC90ZD48dGQ+dDwvdGQ+PC90cj48L3RhYmxlPlwiLGY9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpLGZbMF0uc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5Om5vbmVcIixsPWZbMF0ub2Zmc2V0SGVpZ2h0PT09MCxmWzBdLnN0eWxlLmRpc3BsYXk9XCJcIixmWzFdLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsYi5yZWxpYWJsZUhpZGRlbk9mZnNldHM9bCYmZlswXS5vZmZzZXRIZWlnaHQ9PT0wLGQuaW5uZXJIVE1MPVwiXCIsZC5zdHlsZS5jc3NUZXh0PVwiYm94LXNpemluZzpib3JkZXItYm94Oy1tb3otYm94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MXB4O2JvcmRlcjoxcHg7ZGlzcGxheTpibG9jazt3aWR0aDo0cHg7bWFyZ2luLXRvcDoxJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MSU7XCIsYi5ib3hTaXppbmc9ZC5vZmZzZXRXaWR0aD09PTQsYi5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldD1pLm9mZnNldFRvcCE9PTEsYS5nZXRDb21wdXRlZFN0eWxlJiYoYi5waXhlbFBvc2l0aW9uPShhLmdldENvbXB1dGVkU3R5bGUoZCxudWxsKXx8e30pLnRvcCE9PVwiMSVcIixiLmJveFNpemluZ1JlbGlhYmxlPShhLmdldENvbXB1dGVkU3R5bGUoZCxudWxsKXx8e3dpZHRoOlwiNHB4XCJ9KS53aWR0aD09PVwiNHB4XCIsZz1lLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksZy5zdHlsZS5jc3NUZXh0PWQuc3R5bGUuY3NzVGV4dD1oLGcuc3R5bGUubWFyZ2luUmlnaHQ9Zy5zdHlsZS53aWR0aD1cIjBcIixkLnN0eWxlLndpZHRoPVwiMXB4XCIsZC5hcHBlbmRDaGlsZChnKSxiLnJlbGlhYmxlTWFyZ2luUmlnaHQ9IXBhcnNlRmxvYXQoKGEuZ2V0Q29tcHV0ZWRTdHlsZShnLG51bGwpfHx7fSkubWFyZ2luUmlnaHQpKSx0eXBlb2YgZC5zdHlsZS56b29tIT1cInVuZGVmaW5lZFwiJiYoZC5pbm5lckhUTUw9XCJcIixkLnN0eWxlLmNzc1RleHQ9aCtcIndpZHRoOjFweDtwYWRkaW5nOjFweDtkaXNwbGF5OmlubGluZTt6b29tOjFcIixiLmlubGluZUJsb2NrTmVlZHNMYXlvdXQ9ZC5vZmZzZXRXaWR0aD09PTMsZC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIixkLnN0eWxlLm92ZXJmbG93PVwidmlzaWJsZVwiLGQuaW5uZXJIVE1MPVwiPGRpdj48L2Rpdj5cIixkLmZpcnN0Q2hpbGQuc3R5bGUud2lkdGg9XCI1cHhcIixiLnNocmlua1dyYXBCbG9ja3M9ZC5vZmZzZXRXaWR0aCE9PTMsYy5zdHlsZS56b29tPTEpLGkucmVtb3ZlQ2hpbGQoYyksYz1kPWY9Zz1udWxsfSksaS5yZW1vdmVDaGlsZChuKSxjPWQ9Zj1nPWg9aT1uPW51bGwsYn0oKTt2YXIgSD0vXig/Olxcey4qXFx9fFxcWy4qXFxdKSQvLEk9LyhbQS1aXSkvZztwLmV4dGVuZCh7Y2FjaGU6e30sZGVsZXRlZElkczpbXSx1dWlkOjAsZXhwYW5kbzpcImpRdWVyeVwiKyhwLmZuLmpxdWVyeStNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxub0RhdGE6e2VtYmVkOiEwLG9iamVjdDpcImNsc2lkOkQyN0NEQjZFLUFFNkQtMTFjZi05NkI4LTQ0NDU1MzU0MDAwMFwiLGFwcGxldDohMH0saGFzRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gYT1hLm5vZGVUeXBlP3AuY2FjaGVbYVtwLmV4cGFuZG9dXTphW3AuZXhwYW5kb10sISFhJiYhSyhhKX0sZGF0YTpmdW5jdGlvbihhLGMsZCxlKXtpZighcC5hY2NlcHREYXRhKGEpKXJldHVybjt2YXIgZixnLGg9cC5leHBhbmRvLGk9dHlwZW9mIGM9PVwic3RyaW5nXCIsaj1hLm5vZGVUeXBlLGs9aj9wLmNhY2hlOmEsbD1qP2FbaF06YVtoXSYmaDtpZigoIWx8fCFrW2xdfHwhZSYmIWtbbF0uZGF0YSkmJmkmJmQ9PT1iKXJldHVybjtsfHwoaj9hW2hdPWw9cC5kZWxldGVkSWRzLnBvcCgpfHwrK3AudXVpZDpsPWgpLGtbbF18fChrW2xdPXt9LGp8fChrW2xdLnRvSlNPTj1wLm5vb3ApKTtpZih0eXBlb2YgYz09XCJvYmplY3RcInx8dHlwZW9mIGM9PVwiZnVuY3Rpb25cIillP2tbbF09cC5leHRlbmQoa1tsXSxjKTprW2xdLmRhdGE9cC5leHRlbmQoa1tsXS5kYXRhLGMpO3JldHVybiBmPWtbbF0sZXx8KGYuZGF0YXx8KGYuZGF0YT17fSksZj1mLmRhdGEpLGQhPT1iJiYoZltwLmNhbWVsQ2FzZShjKV09ZCksaT8oZz1mW2NdLGc9PW51bGwmJihnPWZbcC5jYW1lbENhc2UoYyldKSk6Zz1mLGd9LHJlbW92ZURhdGE6ZnVuY3Rpb24oYSxiLGMpe2lmKCFwLmFjY2VwdERhdGEoYSkpcmV0dXJuO3ZhciBkLGUsZixnPWEubm9kZVR5cGUsaD1nP3AuY2FjaGU6YSxpPWc/YVtwLmV4cGFuZG9dOnAuZXhwYW5kbztpZighaFtpXSlyZXR1cm47aWYoYil7ZD1jP2hbaV06aFtpXS5kYXRhO2lmKGQpe3AuaXNBcnJheShiKXx8KGIgaW4gZD9iPVtiXTooYj1wLmNhbWVsQ2FzZShiKSxiIGluIGQ/Yj1bYl06Yj1iLnNwbGl0KFwiIFwiKSkpO2ZvcihlPTAsZj1iLmxlbmd0aDtlPGY7ZSsrKWRlbGV0ZSBkW2JbZV1dO2lmKCEoYz9LOnAuaXNFbXB0eU9iamVjdCkoZCkpcmV0dXJufX1pZighYyl7ZGVsZXRlIGhbaV0uZGF0YTtpZighSyhoW2ldKSlyZXR1cm59Zz9wLmNsZWFuRGF0YShbYV0sITApOnAuc3VwcG9ydC5kZWxldGVFeHBhbmRvfHxoIT1oLndpbmRvdz9kZWxldGUgaFtpXTpoW2ldPW51bGx9LF9kYXRhOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gcC5kYXRhKGEsYixjLCEwKX0sYWNjZXB0RGF0YTpmdW5jdGlvbihhKXt2YXIgYj1hLm5vZGVOYW1lJiZwLm5vRGF0YVthLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldO3JldHVybiFifHxiIT09ITAmJmEuZ2V0QXR0cmlidXRlKFwiY2xhc3NpZFwiKT09PWJ9fSkscC5mbi5leHRlbmQoe2RhdGE6ZnVuY3Rpb24oYSxjKXt2YXIgZCxlLGYsZyxoLGk9dGhpc1swXSxqPTAsaz1udWxsO2lmKGE9PT1iKXtpZih0aGlzLmxlbmd0aCl7az1wLmRhdGEoaSk7aWYoaS5ub2RlVHlwZT09PTEmJiFwLl9kYXRhKGksXCJwYXJzZWRBdHRyc1wiKSl7Zj1pLmF0dHJpYnV0ZXM7Zm9yKGg9Zi5sZW5ndGg7ajxoO2orKylnPWZbal0ubmFtZSxnLmluZGV4T2YoXCJkYXRhLVwiKT09PTAmJihnPXAuY2FtZWxDYXNlKGcuc3Vic3RyaW5nKDUpKSxKKGksZyxrW2ddKSk7cC5fZGF0YShpLFwicGFyc2VkQXR0cnNcIiwhMCl9fXJldHVybiBrfXJldHVybiB0eXBlb2YgYT09XCJvYmplY3RcIj90aGlzLmVhY2goZnVuY3Rpb24oKXtwLmRhdGEodGhpcyxhKX0pOihkPWEuc3BsaXQoXCIuXCIsMiksZFsxXT1kWzFdP1wiLlwiK2RbMV06XCJcIixlPWRbMV0rXCIhXCIscC5hY2Nlc3ModGhpcyxmdW5jdGlvbihjKXtpZihjPT09YilyZXR1cm4gaz10aGlzLnRyaWdnZXJIYW5kbGVyKFwiZ2V0RGF0YVwiK2UsW2RbMF1dKSxrPT09YiYmaSYmKGs9cC5kYXRhKGksYSksaz1KKGksYSxrKSksaz09PWImJmRbMV0/dGhpcy5kYXRhKGRbMF0pOms7ZFsxXT1jLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPXAodGhpcyk7Yi50cmlnZ2VySGFuZGxlcihcInNldERhdGFcIitlLGQpLHAuZGF0YSh0aGlzLGEsYyksYi50cmlnZ2VySGFuZGxlcihcImNoYW5nZURhdGFcIitlLGQpfSl9LG51bGwsYyxhcmd1bWVudHMubGVuZ3RoPjEsbnVsbCwhMSkpfSxyZW1vdmVEYXRhOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtwLnJlbW92ZURhdGEodGhpcyxhKX0pfX0pLHAuZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7aWYoYSlyZXR1cm4gYj0oYnx8XCJmeFwiKStcInF1ZXVlXCIsZD1wLl9kYXRhKGEsYiksYyYmKCFkfHxwLmlzQXJyYXkoYyk/ZD1wLl9kYXRhKGEsYixwLm1ha2VBcnJheShjKSk6ZC5wdXNoKGMpKSxkfHxbXX0sZGVxdWV1ZTpmdW5jdGlvbihhLGIpe2I9Ynx8XCJmeFwiO3ZhciBjPXAucXVldWUoYSxiKSxkPWMuc2hpZnQoKSxlPXAuX3F1ZXVlSG9va3MoYSxiKSxmPWZ1bmN0aW9uKCl7cC5kZXF1ZXVlKGEsYil9O2Q9PT1cImlucHJvZ3Jlc3NcIiYmKGQ9Yy5zaGlmdCgpKSxkJiYoYj09PVwiZnhcIiYmYy51bnNoaWZ0KFwiaW5wcm9ncmVzc1wiKSxkZWxldGUgZS5zdG9wLGQuY2FsbChhLGYsZSkpLCFjLmxlbmd0aCYmZSYmZS5lbXB0eS5maXJlKCl9LF9xdWV1ZUhvb2tzOmZ1bmN0aW9uKGEsYil7dmFyIGM9YitcInF1ZXVlSG9va3NcIjtyZXR1cm4gcC5fZGF0YShhLGMpfHxwLl9kYXRhKGEsYyx7ZW1wdHk6cC5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKS5hZGQoZnVuY3Rpb24oKXtwLnJlbW92ZURhdGEoYSxiK1wicXVldWVcIiwhMCkscC5yZW1vdmVEYXRhKGEsYywhMCl9KX0pfX0pLHAuZm4uZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihhLGMpe3ZhciBkPTI7cmV0dXJuIHR5cGVvZiBhIT1cInN0cmluZ1wiJiYoYz1hLGE9XCJmeFwiLGQtLSksYXJndW1lbnRzLmxlbmd0aDxkP3AucXVldWUodGhpc1swXSxhKTpjPT09Yj90aGlzOnRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPXAucXVldWUodGhpcyxhLGMpO3AuX3F1ZXVlSG9va3ModGhpcyxhKSxhPT09XCJmeFwiJiZiWzBdIT09XCJpbnByb2dyZXNzXCImJnAuZGVxdWV1ZSh0aGlzLGEpfSl9LGRlcXVldWU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3AuZGVxdWV1ZSh0aGlzLGEpfSl9LGRlbGF5OmZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9cC5meD9wLmZ4LnNwZWVkc1thXXx8YTphLGI9Ynx8XCJmeFwiLHRoaXMucXVldWUoYixmdW5jdGlvbihiLGMpe3ZhciBkPXNldFRpbWVvdXQoYixhKTtjLnN0b3A9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZCl9fSl9LGNsZWFyUXVldWU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucXVldWUoYXx8XCJmeFwiLFtdKX0scHJvbWlzZTpmdW5jdGlvbihhLGMpe3ZhciBkLGU9MSxmPXAuRGVmZXJyZWQoKSxnPXRoaXMsaD10aGlzLmxlbmd0aCxpPWZ1bmN0aW9uKCl7LS1lfHxmLnJlc29sdmVXaXRoKGcsW2ddKX07dHlwZW9mIGEhPVwic3RyaW5nXCImJihjPWEsYT1iKSxhPWF8fFwiZnhcIjt3aGlsZShoLS0pKGQ9cC5fZGF0YShnW2hdLGErXCJxdWV1ZUhvb2tzXCIpKSYmZC5lbXB0eSYmKGUrKyxkLmVtcHR5LmFkZChpKSk7cmV0dXJuIGkoKSxmLnByb21pc2UoYyl9fSk7dmFyIEwsTSxOLE89L1tcXHRcXHJcXG5dL2csUD0vXFxyL2csUT0vXig/OmJ1dHRvbnxpbnB1dCkkL2ksUj0vXig/OmJ1dHRvbnxpbnB1dHxvYmplY3R8c2VsZWN0fHRleHRhcmVhKSQvaSxTPS9eYSg/OnJlYXwpJC9pLFQ9L14oPzphdXRvZm9jdXN8YXV0b3BsYXl8YXN5bmN8Y2hlY2tlZHxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZHxzZWxlY3RlZCkkL2ksVT1wLnN1cHBvcnQuZ2V0U2V0QXR0cmlidXRlO3AuZm4uZXh0ZW5kKHthdHRyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHAuYWNjZXNzKHRoaXMscC5hdHRyLGEsYixhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtwLnJlbW92ZUF0dHIodGhpcyxhKX0pfSxwcm9wOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHAuYWNjZXNzKHRoaXMscC5wcm9wLGEsYixhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVQcm9wOmZ1bmN0aW9uKGEpe3JldHVybiBhPXAucHJvcEZpeFthXXx8YSx0aGlzLmVhY2goZnVuY3Rpb24oKXt0cnl7dGhpc1thXT1iLGRlbGV0ZSB0aGlzW2FdfWNhdGNoKGMpe319KX0sYWRkQ2xhc3M6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZixnLGg7aWYocC5pc0Z1bmN0aW9uKGEpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oYil7cCh0aGlzKS5hZGRDbGFzcyhhLmNhbGwodGhpcyxiLHRoaXMuY2xhc3NOYW1lKSl9KTtpZihhJiZ0eXBlb2YgYT09XCJzdHJpbmdcIil7Yj1hLnNwbGl0KHMpO2ZvcihjPTAsZD10aGlzLmxlbmd0aDtjPGQ7YysrKXtlPXRoaXNbY107aWYoZS5ub2RlVHlwZT09PTEpaWYoIWUuY2xhc3NOYW1lJiZiLmxlbmd0aD09PTEpZS5jbGFzc05hbWU9YTtlbHNle2Y9XCIgXCIrZS5jbGFzc05hbWUrXCIgXCI7Zm9yKGc9MCxoPWIubGVuZ3RoO2c8aDtnKyspfmYuaW5kZXhPZihcIiBcIitiW2ddK1wiIFwiKXx8KGYrPWJbZ10rXCIgXCIpO2UuY2xhc3NOYW1lPXAudHJpbShmKX19fXJldHVybiB0aGlzfSxyZW1vdmVDbGFzczpmdW5jdGlvbihhKXt2YXIgYyxkLGUsZixnLGgsaTtpZihwLmlzRnVuY3Rpb24oYSkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihiKXtwKHRoaXMpLnJlbW92ZUNsYXNzKGEuY2FsbCh0aGlzLGIsdGhpcy5jbGFzc05hbWUpKX0pO2lmKGEmJnR5cGVvZiBhPT1cInN0cmluZ1wifHxhPT09Yil7Yz0oYXx8XCJcIikuc3BsaXQocyk7Zm9yKGg9MCxpPXRoaXMubGVuZ3RoO2g8aTtoKyspe2U9dGhpc1toXTtpZihlLm5vZGVUeXBlPT09MSYmZS5jbGFzc05hbWUpe2Q9KFwiIFwiK2UuY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKE8sXCIgXCIpO2ZvcihmPTAsZz1jLmxlbmd0aDtmPGc7ZisrKXdoaWxlKGQuaW5kZXhPZihcIiBcIitjW2ZdK1wiIFwiKT4tMSlkPWQucmVwbGFjZShcIiBcIitjW2ZdK1wiIFwiLFwiIFwiKTtlLmNsYXNzTmFtZT1hP3AudHJpbShkKTpcIlwifX19cmV0dXJuIHRoaXN9LHRvZ2dsZUNsYXNzOmZ1bmN0aW9uKGEsYil7dmFyIGM9dHlwZW9mIGEsZD10eXBlb2YgYj09XCJib29sZWFuXCI7cmV0dXJuIHAuaXNGdW5jdGlvbihhKT90aGlzLmVhY2goZnVuY3Rpb24oYyl7cCh0aGlzKS50b2dnbGVDbGFzcyhhLmNhbGwodGhpcyxjLHRoaXMuY2xhc3NOYW1lLGIpLGIpfSk6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7aWYoYz09PVwic3RyaW5nXCIpe3ZhciBlLGY9MCxnPXAodGhpcyksaD1iLGk9YS5zcGxpdChzKTt3aGlsZShlPWlbZisrXSloPWQ/aDohZy5oYXNDbGFzcyhlKSxnW2g/XCJhZGRDbGFzc1wiOlwicmVtb3ZlQ2xhc3NcIl0oZSl9ZWxzZSBpZihjPT09XCJ1bmRlZmluZWRcInx8Yz09PVwiYm9vbGVhblwiKXRoaXMuY2xhc3NOYW1lJiZwLl9kYXRhKHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIsdGhpcy5jbGFzc05hbWUpLHRoaXMuY2xhc3NOYW1lPXRoaXMuY2xhc3NOYW1lfHxhPT09ITE/XCJcIjpwLl9kYXRhKHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIpfHxcIlwifSl9LGhhc0NsYXNzOmZ1bmN0aW9uKGEpe3ZhciBiPVwiIFwiK2ErXCIgXCIsYz0wLGQ9dGhpcy5sZW5ndGg7Zm9yKDtjPGQ7YysrKWlmKHRoaXNbY10ubm9kZVR5cGU9PT0xJiYoXCIgXCIrdGhpc1tjXS5jbGFzc05hbWUrXCIgXCIpLnJlcGxhY2UoTyxcIiBcIikuaW5kZXhPZihiKT4tMSlyZXR1cm4hMDtyZXR1cm4hMX0sdmFsOmZ1bmN0aW9uKGEpe3ZhciBjLGQsZSxmPXRoaXNbMF07aWYoIWFyZ3VtZW50cy5sZW5ndGgpe2lmKGYpcmV0dXJuIGM9cC52YWxIb29rc1tmLnR5cGVdfHxwLnZhbEhvb2tzW2Yubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0sYyYmXCJnZXRcImluIGMmJihkPWMuZ2V0KGYsXCJ2YWx1ZVwiKSkhPT1iP2Q6KGQ9Zi52YWx1ZSx0eXBlb2YgZD09XCJzdHJpbmdcIj9kLnJlcGxhY2UoUCxcIlwiKTpkPT1udWxsP1wiXCI6ZCk7cmV0dXJufXJldHVybiBlPXAuaXNGdW5jdGlvbihhKSx0aGlzLmVhY2goZnVuY3Rpb24oZCl7dmFyIGYsZz1wKHRoaXMpO2lmKHRoaXMubm9kZVR5cGUhPT0xKXJldHVybjtlP2Y9YS5jYWxsKHRoaXMsZCxnLnZhbCgpKTpmPWEsZj09bnVsbD9mPVwiXCI6dHlwZW9mIGY9PVwibnVtYmVyXCI/Zis9XCJcIjpwLmlzQXJyYXkoZikmJihmPXAubWFwKGYsZnVuY3Rpb24oYSl7cmV0dXJuIGE9PW51bGw/XCJcIjphK1wiXCJ9KSksYz1wLnZhbEhvb2tzW3RoaXMudHlwZV18fHAudmFsSG9va3NbdGhpcy5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXTtpZighY3x8IShcInNldFwiaW4gYyl8fGMuc2V0KHRoaXMsZixcInZhbHVlXCIpPT09Yil0aGlzLnZhbHVlPWZ9KX19KSxwLmV4dGVuZCh7dmFsSG9va3M6e29wdGlvbjp7Z2V0OmZ1bmN0aW9uKGEpe3ZhciBiPWEuYXR0cmlidXRlcy52YWx1ZTtyZXR1cm4hYnx8Yi5zcGVjaWZpZWQ/YS52YWx1ZTphLnRleHR9fSxzZWxlY3Q6e2dldDpmdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmPWEuc2VsZWN0ZWRJbmRleCxnPVtdLGg9YS5vcHRpb25zLGk9YS50eXBlPT09XCJzZWxlY3Qtb25lXCI7aWYoZjwwKXJldHVybiBudWxsO2M9aT9mOjAsZD1pP2YrMTpoLmxlbmd0aDtmb3IoO2M8ZDtjKyspe2U9aFtjXTtpZihlLnNlbGVjdGVkJiYocC5zdXBwb3J0Lm9wdERpc2FibGVkPyFlLmRpc2FibGVkOmUuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIik9PT1udWxsKSYmKCFlLnBhcmVudE5vZGUuZGlzYWJsZWR8fCFwLm5vZGVOYW1lKGUucGFyZW50Tm9kZSxcIm9wdGdyb3VwXCIpKSl7Yj1wKGUpLnZhbCgpO2lmKGkpcmV0dXJuIGI7Zy5wdXNoKGIpfX1yZXR1cm4gaSYmIWcubGVuZ3RoJiZoLmxlbmd0aD9wKGhbZl0pLnZhbCgpOmd9LHNldDpmdW5jdGlvbihhLGIpe3ZhciBjPXAubWFrZUFycmF5KGIpO3JldHVybiBwKGEpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbigpe3RoaXMuc2VsZWN0ZWQ9cC5pbkFycmF5KHAodGhpcykudmFsKCksYyk+PTB9KSxjLmxlbmd0aHx8KGEuc2VsZWN0ZWRJbmRleD0tMSksY319fSxhdHRyRm46e30sYXR0cjpmdW5jdGlvbihhLGMsZCxlKXt2YXIgZixnLGgsaT1hLm5vZGVUeXBlO2lmKCFhfHxpPT09M3x8aT09PTh8fGk9PT0yKXJldHVybjtpZihlJiZwLmlzRnVuY3Rpb24ocC5mbltjXSkpcmV0dXJuIHAoYSlbY10oZCk7aWYodHlwZW9mIGEuZ2V0QXR0cmlidXRlPT1cInVuZGVmaW5lZFwiKXJldHVybiBwLnByb3AoYSxjLGQpO2g9aSE9PTF8fCFwLmlzWE1MRG9jKGEpLGgmJihjPWMudG9Mb3dlckNhc2UoKSxnPXAuYXR0ckhvb2tzW2NdfHwoVC50ZXN0KGMpP006TCkpO2lmKGQhPT1iKXtpZihkPT09bnVsbCl7cC5yZW1vdmVBdHRyKGEsYyk7cmV0dXJufXJldHVybiBnJiZcInNldFwiaW4gZyYmaCYmKGY9Zy5zZXQoYSxkLGMpKSE9PWI/ZjooYS5zZXRBdHRyaWJ1dGUoYyxcIlwiK2QpLGQpfXJldHVybiBnJiZcImdldFwiaW4gZyYmaCYmKGY9Zy5nZXQoYSxjKSkhPT1udWxsP2Y6KGY9YS5nZXRBdHRyaWJ1dGUoYyksZj09PW51bGw/YjpmKX0scmVtb3ZlQXR0cjpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGc9MDtpZihiJiZhLm5vZGVUeXBlPT09MSl7ZD1iLnNwbGl0KHMpO2Zvcig7ZzxkLmxlbmd0aDtnKyspZT1kW2ddLGUmJihjPXAucHJvcEZpeFtlXXx8ZSxmPVQudGVzdChlKSxmfHxwLmF0dHIoYSxlLFwiXCIpLGEucmVtb3ZlQXR0cmlidXRlKFU/ZTpjKSxmJiZjIGluIGEmJihhW2NdPSExKSl9fSxhdHRySG9va3M6e3R5cGU6e3NldDpmdW5jdGlvbihhLGIpe2lmKFEudGVzdChhLm5vZGVOYW1lKSYmYS5wYXJlbnROb2RlKXAuZXJyb3IoXCJ0eXBlIHByb3BlcnR5IGNhbid0IGJlIGNoYW5nZWRcIik7ZWxzZSBpZighcC5zdXBwb3J0LnJhZGlvVmFsdWUmJmI9PT1cInJhZGlvXCImJnAubm9kZU5hbWUoYSxcImlucHV0XCIpKXt2YXIgYz1hLnZhbHVlO3JldHVybiBhLnNldEF0dHJpYnV0ZShcInR5cGVcIixiKSxjJiYoYS52YWx1ZT1jKSxifX19LHZhbHVlOntnZXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gTCYmcC5ub2RlTmFtZShhLFwiYnV0dG9uXCIpP0wuZ2V0KGEsYik6YiBpbiBhP2EudmFsdWU6bnVsbH0sc2V0OmZ1bmN0aW9uKGEsYixjKXtpZihMJiZwLm5vZGVOYW1lKGEsXCJidXR0b25cIikpcmV0dXJuIEwuc2V0KGEsYixjKTthLnZhbHVlPWJ9fX0scHJvcEZpeDp7dGFiaW5kZXg6XCJ0YWJJbmRleFwiLHJlYWRvbmx5OlwicmVhZE9ubHlcIixcImZvclwiOlwiaHRtbEZvclwiLFwiY2xhc3NcIjpcImNsYXNzTmFtZVwiLG1heGxlbmd0aDpcIm1heExlbmd0aFwiLGNlbGxzcGFjaW5nOlwiY2VsbFNwYWNpbmdcIixjZWxscGFkZGluZzpcImNlbGxQYWRkaW5nXCIscm93c3BhbjpcInJvd1NwYW5cIixjb2xzcGFuOlwiY29sU3BhblwiLHVzZW1hcDpcInVzZU1hcFwiLGZyYW1lYm9yZGVyOlwiZnJhbWVCb3JkZXJcIixjb250ZW50ZWRpdGFibGU6XCJjb250ZW50RWRpdGFibGVcIn0scHJvcDpmdW5jdGlvbihhLGMsZCl7dmFyIGUsZixnLGg9YS5ub2RlVHlwZTtpZighYXx8aD09PTN8fGg9PT04fHxoPT09MilyZXR1cm47cmV0dXJuIGc9aCE9PTF8fCFwLmlzWE1MRG9jKGEpLGcmJihjPXAucHJvcEZpeFtjXXx8YyxmPXAucHJvcEhvb2tzW2NdKSxkIT09Yj9mJiZcInNldFwiaW4gZiYmKGU9Zi5zZXQoYSxkLGMpKSE9PWI/ZTphW2NdPWQ6ZiYmXCJnZXRcImluIGYmJihlPWYuZ2V0KGEsYykpIT09bnVsbD9lOmFbY119LHByb3BIb29rczp7dGFiSW5kZXg6e2dldDpmdW5jdGlvbihhKXt2YXIgYz1hLmdldEF0dHJpYnV0ZU5vZGUoXCJ0YWJpbmRleFwiKTtyZXR1cm4gYyYmYy5zcGVjaWZpZWQ/cGFyc2VJbnQoYy52YWx1ZSwxMCk6Ui50ZXN0KGEubm9kZU5hbWUpfHxTLnRlc3QoYS5ub2RlTmFtZSkmJmEuaHJlZj8wOmJ9fX19KSxNPXtnZXQ6ZnVuY3Rpb24oYSxjKXt2YXIgZCxlPXAucHJvcChhLGMpO3JldHVybiBlPT09ITB8fHR5cGVvZiBlIT1cImJvb2xlYW5cIiYmKGQ9YS5nZXRBdHRyaWJ1dGVOb2RlKGMpKSYmZC5ub2RlVmFsdWUhPT0hMT9jLnRvTG93ZXJDYXNlKCk6Yn0sc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZDtyZXR1cm4gYj09PSExP3AucmVtb3ZlQXR0cihhLGMpOihkPXAucHJvcEZpeFtjXXx8YyxkIGluIGEmJihhW2RdPSEwKSxhLnNldEF0dHJpYnV0ZShjLGMudG9Mb3dlckNhc2UoKSkpLGN9fSxVfHwoTj17bmFtZTohMCxpZDohMCxjb29yZHM6ITB9LEw9cC52YWxIb29rcy5idXR0b249e2dldDpmdW5jdGlvbihhLGMpe3ZhciBkO3JldHVybiBkPWEuZ2V0QXR0cmlidXRlTm9kZShjKSxkJiYoTltjXT9kLnZhbHVlIT09XCJcIjpkLnNwZWNpZmllZCk/ZC52YWx1ZTpifSxzZXQ6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEuZ2V0QXR0cmlidXRlTm9kZShjKTtyZXR1cm4gZHx8KGQ9ZS5jcmVhdGVBdHRyaWJ1dGUoYyksYS5zZXRBdHRyaWJ1dGVOb2RlKGQpKSxkLnZhbHVlPWIrXCJcIn19LHAuZWFjaChbXCJ3aWR0aFwiLFwiaGVpZ2h0XCJdLGZ1bmN0aW9uKGEsYil7cC5hdHRySG9va3NbYl09cC5leHRlbmQocC5hdHRySG9va3NbYl0se3NldDpmdW5jdGlvbihhLGMpe2lmKGM9PT1cIlwiKXJldHVybiBhLnNldEF0dHJpYnV0ZShiLFwiYXV0b1wiKSxjfX0pfSkscC5hdHRySG9va3MuY29udGVudGVkaXRhYmxlPXtnZXQ6TC5nZXQsc2V0OmZ1bmN0aW9uKGEsYixjKXtiPT09XCJcIiYmKGI9XCJmYWxzZVwiKSxMLnNldChhLGIsYyl9fSkscC5zdXBwb3J0LmhyZWZOb3JtYWxpemVkfHxwLmVhY2goW1wiaHJlZlwiLFwic3JjXCIsXCJ3aWR0aFwiLFwiaGVpZ2h0XCJdLGZ1bmN0aW9uKGEsYyl7cC5hdHRySG9va3NbY109cC5leHRlbmQocC5hdHRySG9va3NbY10se2dldDpmdW5jdGlvbihhKXt2YXIgZD1hLmdldEF0dHJpYnV0ZShjLDIpO3JldHVybiBkPT09bnVsbD9iOmR9fSl9KSxwLnN1cHBvcnQuc3R5bGV8fChwLmF0dHJIb29rcy5zdHlsZT17Z2V0OmZ1bmN0aW9uKGEpe3JldHVybiBhLnN0eWxlLmNzc1RleHQudG9Mb3dlckNhc2UoKXx8Yn0sc2V0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc3R5bGUuY3NzVGV4dD1cIlwiK2J9fSkscC5zdXBwb3J0Lm9wdFNlbGVjdGVkfHwocC5wcm9wSG9va3Muc2VsZWN0ZWQ9cC5leHRlbmQocC5wcm9wSG9va3Muc2VsZWN0ZWQse2dldDpmdW5jdGlvbihhKXt2YXIgYj1hLnBhcmVudE5vZGU7cmV0dXJuIGImJihiLnNlbGVjdGVkSW5kZXgsYi5wYXJlbnROb2RlJiZiLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCksbnVsbH19KSkscC5zdXBwb3J0LmVuY3R5cGV8fChwLnByb3BGaXguZW5jdHlwZT1cImVuY29kaW5nXCIpLHAuc3VwcG9ydC5jaGVja09ufHxwLmVhY2goW1wicmFkaW9cIixcImNoZWNrYm94XCJdLGZ1bmN0aW9uKCl7cC52YWxIb29rc1t0aGlzXT17Z2V0OmZ1bmN0aW9uKGEpe3JldHVybiBhLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpPT09bnVsbD9cIm9uXCI6YS52YWx1ZX19fSkscC5lYWNoKFtcInJhZGlvXCIsXCJjaGVja2JveFwiXSxmdW5jdGlvbigpe3AudmFsSG9va3NbdGhpc109cC5leHRlbmQocC52YWxIb29rc1t0aGlzXSx7c2V0OmZ1bmN0aW9uKGEsYil7aWYocC5pc0FycmF5KGIpKXJldHVybiBhLmNoZWNrZWQ9cC5pbkFycmF5KHAoYSkudmFsKCksYik+PTB9fSl9KTt2YXIgVj0vXig/OnRleHRhcmVhfGlucHV0fHNlbGVjdCkkL2ksVz0vXihbXlxcLl0qfCkoPzpcXC4oLispfCkkLyxYPS8oPzpefFxccylob3ZlcihcXC5cXFMrfClcXGIvLFk9L15rZXkvLFo9L14oPzptb3VzZXxjb250ZXh0bWVudSl8Y2xpY2svLCQ9L14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvLF89ZnVuY3Rpb24oYSl7cmV0dXJuIHAuZXZlbnQuc3BlY2lhbC5ob3Zlcj9hOmEucmVwbGFjZShYLFwibW91c2VlbnRlciQxIG1vdXNlbGVhdmUkMVwiKX07cC5ldmVudD17YWRkOmZ1bmN0aW9uKGEsYyxkLGUsZil7dmFyIGcsaCxpLGosayxsLG0sbixvLHEscjtpZihhLm5vZGVUeXBlPT09M3x8YS5ub2RlVHlwZT09PTh8fCFjfHwhZHx8IShnPXAuX2RhdGEoYSkpKXJldHVybjtkLmhhbmRsZXImJihvPWQsZD1vLmhhbmRsZXIsZj1vLnNlbGVjdG9yKSxkLmd1aWR8fChkLmd1aWQ9cC5ndWlkKyspLGk9Zy5ldmVudHMsaXx8KGcuZXZlbnRzPWk9e30pLGg9Zy5oYW5kbGUsaHx8KGcuaGFuZGxlPWg9ZnVuY3Rpb24oYSl7cmV0dXJuIHR5cGVvZiBwIT1cInVuZGVmaW5lZFwiJiYoIWF8fHAuZXZlbnQudHJpZ2dlcmVkIT09YS50eXBlKT9wLmV2ZW50LmRpc3BhdGNoLmFwcGx5KGguZWxlbSxhcmd1bWVudHMpOmJ9LGguZWxlbT1hKSxjPXAudHJpbShfKGMpKS5zcGxpdChcIiBcIik7Zm9yKGo9MDtqPGMubGVuZ3RoO2orKyl7az1XLmV4ZWMoY1tqXSl8fFtdLGw9a1sxXSxtPShrWzJdfHxcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLHI9cC5ldmVudC5zcGVjaWFsW2xdfHx7fSxsPShmP3IuZGVsZWdhdGVUeXBlOnIuYmluZFR5cGUpfHxsLHI9cC5ldmVudC5zcGVjaWFsW2xdfHx7fSxuPXAuZXh0ZW5kKHt0eXBlOmwsb3JpZ1R5cGU6a1sxXSxkYXRhOmUsaGFuZGxlcjpkLGd1aWQ6ZC5ndWlkLHNlbGVjdG9yOmYsbmFtZXNwYWNlOm0uam9pbihcIi5cIil9LG8pLHE9aVtsXTtpZighcSl7cT1pW2xdPVtdLHEuZGVsZWdhdGVDb3VudD0wO2lmKCFyLnNldHVwfHxyLnNldHVwLmNhbGwoYSxlLG0saCk9PT0hMSlhLmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKGwsaCwhMSk6YS5hdHRhY2hFdmVudCYmYS5hdHRhY2hFdmVudChcIm9uXCIrbCxoKX1yLmFkZCYmKHIuYWRkLmNhbGwoYSxuKSxuLmhhbmRsZXIuZ3VpZHx8KG4uaGFuZGxlci5ndWlkPWQuZ3VpZCkpLGY/cS5zcGxpY2UocS5kZWxlZ2F0ZUNvdW50KyssMCxuKTpxLnB1c2gobikscC5ldmVudC5nbG9iYWxbbF09ITB9YT1udWxsfSxnbG9iYWw6e30scmVtb3ZlOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGYsZyxoLGksaixrLGwsbSxuLG8scSxyPXAuaGFzRGF0YShhKSYmcC5fZGF0YShhKTtpZighcnx8IShtPXIuZXZlbnRzKSlyZXR1cm47Yj1wLnRyaW0oXyhifHxcIlwiKSkuc3BsaXQoXCIgXCIpO2ZvcihmPTA7ZjxiLmxlbmd0aDtmKyspe2c9Vy5leGVjKGJbZl0pfHxbXSxoPWk9Z1sxXSxqPWdbMl07aWYoIWgpe2ZvcihoIGluIG0pcC5ldmVudC5yZW1vdmUoYSxoK2JbZl0sYyxkLCEwKTtjb250aW51ZX1uPXAuZXZlbnQuc3BlY2lhbFtoXXx8e30saD0oZD9uLmRlbGVnYXRlVHlwZTpuLmJpbmRUeXBlKXx8aCxvPW1baF18fFtdLGs9by5sZW5ndGgsaj1qP25ldyBSZWdFeHAoXCIoXnxcXFxcLilcIitqLnNwbGl0KFwiLlwiKS5zb3J0KCkuam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpK1wiKFxcXFwufCQpXCIpOm51bGw7Zm9yKGw9MDtsPG8ubGVuZ3RoO2wrKylxPW9bbF0sKGV8fGk9PT1xLm9yaWdUeXBlKSYmKCFjfHxjLmd1aWQ9PT1xLmd1aWQpJiYoIWp8fGoudGVzdChxLm5hbWVzcGFjZSkpJiYoIWR8fGQ9PT1xLnNlbGVjdG9yfHxkPT09XCIqKlwiJiZxLnNlbGVjdG9yKSYmKG8uc3BsaWNlKGwtLSwxKSxxLnNlbGVjdG9yJiZvLmRlbGVnYXRlQ291bnQtLSxuLnJlbW92ZSYmbi5yZW1vdmUuY2FsbChhLHEpKTtvLmxlbmd0aD09PTAmJmshPT1vLmxlbmd0aCYmKCghbi50ZWFyZG93bnx8bi50ZWFyZG93bi5jYWxsKGEsaixyLmhhbmRsZSk9PT0hMSkmJnAucmVtb3ZlRXZlbnQoYSxoLHIuaGFuZGxlKSxkZWxldGUgbVtoXSl9cC5pc0VtcHR5T2JqZWN0KG0pJiYoZGVsZXRlIHIuaGFuZGxlLHAucmVtb3ZlRGF0YShhLFwiZXZlbnRzXCIsITApKX0sY3VzdG9tRXZlbnQ6e2dldERhdGE6ITAsc2V0RGF0YTohMCxjaGFuZ2VEYXRhOiEwfSx0cmlnZ2VyOmZ1bmN0aW9uKGMsZCxmLGcpe2lmKCFmfHxmLm5vZGVUeXBlIT09MyYmZi5ub2RlVHlwZSE9PTgpe3ZhciBoLGksaixrLGwsbSxuLG8scSxyLHM9Yy50eXBlfHxjLHQ9W107aWYoJC50ZXN0KHMrcC5ldmVudC50cmlnZ2VyZWQpKXJldHVybjtzLmluZGV4T2YoXCIhXCIpPj0wJiYocz1zLnNsaWNlKDAsLTEpLGk9ITApLHMuaW5kZXhPZihcIi5cIik+PTAmJih0PXMuc3BsaXQoXCIuXCIpLHM9dC5zaGlmdCgpLHQuc29ydCgpKTtpZigoIWZ8fHAuZXZlbnQuY3VzdG9tRXZlbnRbc10pJiYhcC5ldmVudC5nbG9iYWxbc10pcmV0dXJuO2M9dHlwZW9mIGM9PVwib2JqZWN0XCI/Y1twLmV4cGFuZG9dP2M6bmV3IHAuRXZlbnQocyxjKTpuZXcgcC5FdmVudChzKSxjLnR5cGU9cyxjLmlzVHJpZ2dlcj0hMCxjLmV4Y2x1c2l2ZT1pLGMubmFtZXNwYWNlPXQuam9pbihcIi5cIiksYy5uYW1lc3BhY2VfcmU9Yy5uYW1lc3BhY2U/bmV3IFJlZ0V4cChcIihefFxcXFwuKVwiK3Quam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpK1wiKFxcXFwufCQpXCIpOm51bGwsbT1zLmluZGV4T2YoXCI6XCIpPDA/XCJvblwiK3M6XCJcIjtpZighZil7aD1wLmNhY2hlO2ZvcihqIGluIGgpaFtqXS5ldmVudHMmJmhbal0uZXZlbnRzW3NdJiZwLmV2ZW50LnRyaWdnZXIoYyxkLGhbal0uaGFuZGxlLmVsZW0sITApO3JldHVybn1jLnJlc3VsdD1iLGMudGFyZ2V0fHwoYy50YXJnZXQ9ZiksZD1kIT1udWxsP3AubWFrZUFycmF5KGQpOltdLGQudW5zaGlmdChjKSxuPXAuZXZlbnQuc3BlY2lhbFtzXXx8e307aWYobi50cmlnZ2VyJiZuLnRyaWdnZXIuYXBwbHkoZixkKT09PSExKXJldHVybjtxPVtbZixuLmJpbmRUeXBlfHxzXV07aWYoIWcmJiFuLm5vQnViYmxlJiYhcC5pc1dpbmRvdyhmKSl7cj1uLmRlbGVnYXRlVHlwZXx8cyxrPSQudGVzdChyK3MpP2Y6Zi5wYXJlbnROb2RlO2ZvcihsPWY7aztrPWsucGFyZW50Tm9kZSlxLnB1c2goW2sscl0pLGw9aztsPT09KGYub3duZXJEb2N1bWVudHx8ZSkmJnEucHVzaChbbC5kZWZhdWx0Vmlld3x8bC5wYXJlbnRXaW5kb3d8fGEscl0pfWZvcihqPTA7ajxxLmxlbmd0aCYmIWMuaXNQcm9wYWdhdGlvblN0b3BwZWQoKTtqKyspaz1xW2pdWzBdLGMudHlwZT1xW2pdWzFdLG89KHAuX2RhdGEoayxcImV2ZW50c1wiKXx8e30pW2MudHlwZV0mJnAuX2RhdGEoayxcImhhbmRsZVwiKSxvJiZvLmFwcGx5KGssZCksbz1tJiZrW21dLG8mJnAuYWNjZXB0RGF0YShrKSYmby5hcHBseShrLGQpPT09ITEmJmMucHJldmVudERlZmF1bHQoKTtyZXR1cm4gYy50eXBlPXMsIWcmJiFjLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYoIW4uX2RlZmF1bHR8fG4uX2RlZmF1bHQuYXBwbHkoZi5vd25lckRvY3VtZW50LGQpPT09ITEpJiYocyE9PVwiY2xpY2tcInx8IXAubm9kZU5hbWUoZixcImFcIikpJiZwLmFjY2VwdERhdGEoZikmJm0mJmZbc10mJihzIT09XCJmb2N1c1wiJiZzIT09XCJibHVyXCJ8fGMudGFyZ2V0Lm9mZnNldFdpZHRoIT09MCkmJiFwLmlzV2luZG93KGYpJiYobD1mW21dLGwmJihmW21dPW51bGwpLHAuZXZlbnQudHJpZ2dlcmVkPXMsZltzXSgpLHAuZXZlbnQudHJpZ2dlcmVkPWIsbCYmKGZbbV09bCkpLGMucmVzdWx0fXJldHVybn0sZGlzcGF0Y2g6ZnVuY3Rpb24oYyl7Yz1wLmV2ZW50LmZpeChjfHxhLmV2ZW50KTt2YXIgZCxlLGYsZyxoLGksaixrLGwsbSxuLG89KHAuX2RhdGEodGhpcyxcImV2ZW50c1wiKXx8e30pW2MudHlwZV18fFtdLHE9by5kZWxlZ2F0ZUNvdW50LHI9W10uc2xpY2UuY2FsbChhcmd1bWVudHMpLHM9IWMuZXhjbHVzaXZlJiYhYy5uYW1lc3BhY2UsdD1wLmV2ZW50LnNwZWNpYWxbYy50eXBlXXx8e30sdT1bXTtyWzBdPWMsYy5kZWxlZ2F0ZVRhcmdldD10aGlzO2lmKHQucHJlRGlzcGF0Y2gmJnQucHJlRGlzcGF0Y2guY2FsbCh0aGlzLGMpPT09ITEpcmV0dXJuO2lmKHEmJighYy5idXR0b258fGMudHlwZSE9PVwiY2xpY2tcIikpe2c9cCh0aGlzKSxnLmNvbnRleHQ9dGhpcztmb3IoZj1jLnRhcmdldDtmIT10aGlzO2Y9Zi5wYXJlbnROb2RlfHx0aGlzKWlmKGYuZGlzYWJsZWQhPT0hMHx8Yy50eXBlIT09XCJjbGlja1wiKXtpPXt9LGs9W10sZ1swXT1mO2ZvcihkPTA7ZDxxO2QrKylsPW9bZF0sbT1sLnNlbGVjdG9yLGlbbV09PT1iJiYoaVttXT1nLmlzKG0pKSxpW21dJiZrLnB1c2gobCk7ay5sZW5ndGgmJnUucHVzaCh7ZWxlbTpmLG1hdGNoZXM6a30pfX1vLmxlbmd0aD5xJiZ1LnB1c2goe2VsZW06dGhpcyxtYXRjaGVzOm8uc2xpY2UocSl9KTtmb3IoZD0wO2Q8dS5sZW5ndGgmJiFjLmlzUHJvcGFnYXRpb25TdG9wcGVkKCk7ZCsrKXtqPXVbZF0sYy5jdXJyZW50VGFyZ2V0PWouZWxlbTtmb3IoZT0wO2U8ai5tYXRjaGVzLmxlbmd0aCYmIWMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKTtlKyspe2w9ai5tYXRjaGVzW2VdO2lmKHN8fCFjLm5hbWVzcGFjZSYmIWwubmFtZXNwYWNlfHxjLm5hbWVzcGFjZV9yZSYmYy5uYW1lc3BhY2VfcmUudGVzdChsLm5hbWVzcGFjZSkpYy5kYXRhPWwuZGF0YSxjLmhhbmRsZU9iaj1sLGg9KChwLmV2ZW50LnNwZWNpYWxbbC5vcmlnVHlwZV18fHt9KS5oYW5kbGV8fGwuaGFuZGxlcikuYXBwbHkoai5lbGVtLHIpLGghPT1iJiYoYy5yZXN1bHQ9aCxoPT09ITEmJihjLnByZXZlbnREZWZhdWx0KCksYy5zdG9wUHJvcGFnYXRpb24oKSkpfX1yZXR1cm4gdC5wb3N0RGlzcGF0Y2gmJnQucG9zdERpc3BhdGNoLmNhbGwodGhpcyxjKSxjLnJlc3VsdH0scHJvcHM6XCJhdHRyQ2hhbmdlIGF0dHJOYW1lIHJlbGF0ZWROb2RlIHNyY0VsZW1lbnQgYWx0S2V5IGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgZXZlbnRQaGFzZSBtZXRhS2V5IHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgdGFyZ2V0IHRpbWVTdGFtcCB2aWV3IHdoaWNoXCIuc3BsaXQoXCIgXCIpLGZpeEhvb2tzOnt9LGtleUhvb2tzOntwcm9wczpcImNoYXIgY2hhckNvZGUga2V5IGtleUNvZGVcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2hpY2g9PW51bGwmJihhLndoaWNoPWIuY2hhckNvZGUhPW51bGw/Yi5jaGFyQ29kZTpiLmtleUNvZGUpLGF9fSxtb3VzZUhvb2tzOntwcm9wczpcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBmcm9tRWxlbWVudCBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiLnNwbGl0KFwiIFwiKSxmaWx0ZXI6ZnVuY3Rpb24oYSxjKXt2YXIgZCxmLGcsaD1jLmJ1dHRvbixpPWMuZnJvbUVsZW1lbnQ7cmV0dXJuIGEucGFnZVg9PW51bGwmJmMuY2xpZW50WCE9bnVsbCYmKGQ9YS50YXJnZXQub3duZXJEb2N1bWVudHx8ZSxmPWQuZG9jdW1lbnRFbGVtZW50LGc9ZC5ib2R5LGEucGFnZVg9Yy5jbGllbnRYKyhmJiZmLnNjcm9sbExlZnR8fGcmJmcuc2Nyb2xsTGVmdHx8MCktKGYmJmYuY2xpZW50TGVmdHx8ZyYmZy5jbGllbnRMZWZ0fHwwKSxhLnBhZ2VZPWMuY2xpZW50WSsoZiYmZi5zY3JvbGxUb3B8fGcmJmcuc2Nyb2xsVG9wfHwwKS0oZiYmZi5jbGllbnRUb3B8fGcmJmcuY2xpZW50VG9wfHwwKSksIWEucmVsYXRlZFRhcmdldCYmaSYmKGEucmVsYXRlZFRhcmdldD1pPT09YS50YXJnZXQ/Yy50b0VsZW1lbnQ6aSksIWEud2hpY2gmJmghPT1iJiYoYS53aGljaD1oJjE/MTpoJjI/MzpoJjQ/MjowKSxhfX0sZml4OmZ1bmN0aW9uKGEpe2lmKGFbcC5leHBhbmRvXSlyZXR1cm4gYTt2YXIgYixjLGQ9YSxmPXAuZXZlbnQuZml4SG9va3NbYS50eXBlXXx8e30sZz1mLnByb3BzP3RoaXMucHJvcHMuY29uY2F0KGYucHJvcHMpOnRoaXMucHJvcHM7YT1wLkV2ZW50KGQpO2ZvcihiPWcubGVuZ3RoO2I7KWM9Z1stLWJdLGFbY109ZFtjXTtyZXR1cm4gYS50YXJnZXR8fChhLnRhcmdldD1kLnNyY0VsZW1lbnR8fGUpLGEudGFyZ2V0Lm5vZGVUeXBlPT09MyYmKGEudGFyZ2V0PWEudGFyZ2V0LnBhcmVudE5vZGUpLGEubWV0YUtleT0hIWEubWV0YUtleSxmLmZpbHRlcj9mLmZpbHRlcihhLGQpOmF9LHNwZWNpYWw6e3JlYWR5OntzZXR1cDpwLmJpbmRSZWFkeX0sbG9hZDp7bm9CdWJibGU6ITB9LGZvY3VzOntkZWxlZ2F0ZVR5cGU6XCJmb2N1c2luXCJ9LGJsdXI6e2RlbGVnYXRlVHlwZTpcImZvY3Vzb3V0XCJ9LGJlZm9yZXVubG9hZDp7c2V0dXA6ZnVuY3Rpb24oYSxiLGMpe3AuaXNXaW5kb3codGhpcykmJih0aGlzLm9uYmVmb3JldW5sb2FkPWMpfSx0ZWFyZG93bjpmdW5jdGlvbihhLGIpe3RoaXMub25iZWZvcmV1bmxvYWQ9PT1iJiYodGhpcy5vbmJlZm9yZXVubG9hZD1udWxsKX19fSxzaW11bGF0ZTpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1wLmV4dGVuZChuZXcgcC5FdmVudCxjLHt0eXBlOmEsaXNTaW11bGF0ZWQ6ITAsb3JpZ2luYWxFdmVudDp7fX0pO2Q/cC5ldmVudC50cmlnZ2VyKGUsbnVsbCxiKTpwLmV2ZW50LmRpc3BhdGNoLmNhbGwoYixlKSxlLmlzRGVmYXVsdFByZXZlbnRlZCgpJiZjLnByZXZlbnREZWZhdWx0KCl9fSxwLmV2ZW50LmhhbmRsZT1wLmV2ZW50LmRpc3BhdGNoLHAucmVtb3ZlRXZlbnQ9ZS5yZW1vdmVFdmVudExpc3RlbmVyP2Z1bmN0aW9uKGEsYixjKXthLnJlbW92ZUV2ZW50TGlzdGVuZXImJmEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9XCJvblwiK2I7YS5kZXRhY2hFdmVudCYmKHR5cGVvZiBhW2RdPT1cInVuZGVmaW5lZFwiJiYoYVtkXT1udWxsKSxhLmRldGFjaEV2ZW50KGQsYykpfSxwLkV2ZW50PWZ1bmN0aW9uKGEsYil7aWYodGhpcyBpbnN0YW5jZW9mIHAuRXZlbnQpYSYmYS50eXBlPyh0aGlzLm9yaWdpbmFsRXZlbnQ9YSx0aGlzLnR5cGU9YS50eXBlLHRoaXMuaXNEZWZhdWx0UHJldmVudGVkPWEuZGVmYXVsdFByZXZlbnRlZHx8YS5yZXR1cm5WYWx1ZT09PSExfHxhLmdldFByZXZlbnREZWZhdWx0JiZhLmdldFByZXZlbnREZWZhdWx0KCk/YmI6YmEpOnRoaXMudHlwZT1hLGImJnAuZXh0ZW5kKHRoaXMsYiksdGhpcy50aW1lU3RhbXA9YSYmYS50aW1lU3RhbXB8fHAubm93KCksdGhpc1twLmV4cGFuZG9dPSEwO2Vsc2UgcmV0dXJuIG5ldyBwLkV2ZW50KGEsYil9LHAuRXZlbnQucHJvdG90eXBlPXtwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe3RoaXMuaXNEZWZhdWx0UHJldmVudGVkPWJiO3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDtpZighYSlyZXR1cm47YS5wcmV2ZW50RGVmYXVsdD9hLnByZXZlbnREZWZhdWx0KCk6YS5yZXR1cm5WYWx1ZT0hMX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZD1iYjt2YXIgYT10aGlzLm9yaWdpbmFsRXZlbnQ7aWYoIWEpcmV0dXJuO2Euc3RvcFByb3BhZ2F0aW9uJiZhLnN0b3BQcm9wYWdhdGlvbigpLGEuY2FuY2VsQnViYmxlPSEwfSxzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkPWJiLHRoaXMuc3RvcFByb3BhZ2F0aW9uKCl9LGlzRGVmYXVsdFByZXZlbnRlZDpiYSxpc1Byb3BhZ2F0aW9uU3RvcHBlZDpiYSxpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDpiYX0scC5lYWNoKHttb3VzZWVudGVyOlwibW91c2VvdmVyXCIsbW91c2VsZWF2ZTpcIm1vdXNlb3V0XCJ9LGZ1bmN0aW9uKGEsYil7cC5ldmVudC5zcGVjaWFsW2FdPXtkZWxlZ2F0ZVR5cGU6YixiaW5kVHlwZTpiLGhhbmRsZTpmdW5jdGlvbihhKXt2YXIgYyxkPXRoaXMsZT1hLnJlbGF0ZWRUYXJnZXQsZj1hLmhhbmRsZU9iaixnPWYuc2VsZWN0b3I7aWYoIWV8fGUhPT1kJiYhcC5jb250YWlucyhkLGUpKWEudHlwZT1mLm9yaWdUeXBlLGM9Zi5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxhLnR5cGU9YjtyZXR1cm4gY319fSkscC5zdXBwb3J0LnN1Ym1pdEJ1YmJsZXN8fChwLmV2ZW50LnNwZWNpYWwuc3VibWl0PXtzZXR1cDpmdW5jdGlvbigpe2lmKHAubm9kZU5hbWUodGhpcyxcImZvcm1cIikpcmV0dXJuITE7cC5ldmVudC5hZGQodGhpcyxcImNsaWNrLl9zdWJtaXQga2V5cHJlc3MuX3N1Ym1pdFwiLGZ1bmN0aW9uKGEpe3ZhciBjPWEudGFyZ2V0LGQ9cC5ub2RlTmFtZShjLFwiaW5wdXRcIil8fHAubm9kZU5hbWUoYyxcImJ1dHRvblwiKT9jLmZvcm06YjtkJiYhcC5fZGF0YShkLFwiX3N1Ym1pdF9hdHRhY2hlZFwiKSYmKHAuZXZlbnQuYWRkKGQsXCJzdWJtaXQuX3N1Ym1pdFwiLGZ1bmN0aW9uKGEpe2EuX3N1Ym1pdF9idWJibGU9ITB9KSxwLl9kYXRhKGQsXCJfc3VibWl0X2F0dGFjaGVkXCIsITApKX0pfSxwb3N0RGlzcGF0Y2g6ZnVuY3Rpb24oYSl7YS5fc3VibWl0X2J1YmJsZSYmKGRlbGV0ZSBhLl9zdWJtaXRfYnViYmxlLHRoaXMucGFyZW50Tm9kZSYmIWEuaXNUcmlnZ2VyJiZwLmV2ZW50LnNpbXVsYXRlKFwic3VibWl0XCIsdGhpcy5wYXJlbnROb2RlLGEsITApKX0sdGVhcmRvd246ZnVuY3Rpb24oKXtpZihwLm5vZGVOYW1lKHRoaXMsXCJmb3JtXCIpKXJldHVybiExO3AuZXZlbnQucmVtb3ZlKHRoaXMsXCIuX3N1Ym1pdFwiKX19KSxwLnN1cHBvcnQuY2hhbmdlQnViYmxlc3x8KHAuZXZlbnQuc3BlY2lhbC5jaGFuZ2U9e3NldHVwOmZ1bmN0aW9uKCl7aWYoVi50ZXN0KHRoaXMubm9kZU5hbWUpKXtpZih0aGlzLnR5cGU9PT1cImNoZWNrYm94XCJ8fHRoaXMudHlwZT09PVwicmFkaW9cIilwLmV2ZW50LmFkZCh0aGlzLFwicHJvcGVydHljaGFuZ2UuX2NoYW5nZVwiLGZ1bmN0aW9uKGEpe2Eub3JpZ2luYWxFdmVudC5wcm9wZXJ0eU5hbWU9PT1cImNoZWNrZWRcIiYmKHRoaXMuX2p1c3RfY2hhbmdlZD0hMCl9KSxwLmV2ZW50LmFkZCh0aGlzLFwiY2xpY2suX2NoYW5nZVwiLGZ1bmN0aW9uKGEpe3RoaXMuX2p1c3RfY2hhbmdlZCYmIWEuaXNUcmlnZ2VyJiYodGhpcy5fanVzdF9jaGFuZ2VkPSExKSxwLmV2ZW50LnNpbXVsYXRlKFwiY2hhbmdlXCIsdGhpcyxhLCEwKX0pO3JldHVybiExfXAuZXZlbnQuYWRkKHRoaXMsXCJiZWZvcmVhY3RpdmF0ZS5fY2hhbmdlXCIsZnVuY3Rpb24oYSl7dmFyIGI9YS50YXJnZXQ7Vi50ZXN0KGIubm9kZU5hbWUpJiYhcC5fZGF0YShiLFwiX2NoYW5nZV9hdHRhY2hlZFwiKSYmKHAuZXZlbnQuYWRkKGIsXCJjaGFuZ2UuX2NoYW5nZVwiLGZ1bmN0aW9uKGEpe3RoaXMucGFyZW50Tm9kZSYmIWEuaXNTaW11bGF0ZWQmJiFhLmlzVHJpZ2dlciYmcC5ldmVudC5zaW11bGF0ZShcImNoYW5nZVwiLHRoaXMucGFyZW50Tm9kZSxhLCEwKX0pLHAuX2RhdGEoYixcIl9jaGFuZ2VfYXR0YWNoZWRcIiwhMCkpfSl9LGhhbmRsZTpmdW5jdGlvbihhKXt2YXIgYj1hLnRhcmdldDtpZih0aGlzIT09Ynx8YS5pc1NpbXVsYXRlZHx8YS5pc1RyaWdnZXJ8fGIudHlwZSE9PVwicmFkaW9cIiYmYi50eXBlIT09XCJjaGVja2JveFwiKXJldHVybiBhLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sdGVhcmRvd246ZnVuY3Rpb24oKXtyZXR1cm4gcC5ldmVudC5yZW1vdmUodGhpcyxcIi5fY2hhbmdlXCIpLFYudGVzdCh0aGlzLm5vZGVOYW1lKX19KSxwLnN1cHBvcnQuZm9jdXNpbkJ1YmJsZXN8fHAuZWFjaCh7Zm9jdXM6XCJmb2N1c2luXCIsYmx1cjpcImZvY3Vzb3V0XCJ9LGZ1bmN0aW9uKGEsYil7dmFyIGM9MCxkPWZ1bmN0aW9uKGEpe3AuZXZlbnQuc2ltdWxhdGUoYixhLnRhcmdldCxwLmV2ZW50LmZpeChhKSwhMCl9O3AuZXZlbnQuc3BlY2lhbFtiXT17c2V0dXA6ZnVuY3Rpb24oKXtjKys9PT0wJiZlLmFkZEV2ZW50TGlzdGVuZXIoYSxkLCEwKX0sdGVhcmRvd246ZnVuY3Rpb24oKXstLWM9PT0wJiZlLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSxkLCEwKX19fSkscC5mbi5leHRlbmQoe29uOmZ1bmN0aW9uKGEsYyxkLGUsZil7dmFyIGcsaDtpZih0eXBlb2YgYT09XCJvYmplY3RcIil7dHlwZW9mIGMhPVwic3RyaW5nXCImJihkPWR8fGMsYz1iKTtmb3IoaCBpbiBhKXRoaXMub24oaCxjLGQsYVtoXSxmKTtyZXR1cm4gdGhpc31kPT1udWxsJiZlPT1udWxsPyhlPWMsZD1jPWIpOmU9PW51bGwmJih0eXBlb2YgYz09XCJzdHJpbmdcIj8oZT1kLGQ9Yik6KGU9ZCxkPWMsYz1iKSk7aWYoZT09PSExKWU9YmE7ZWxzZSBpZighZSlyZXR1cm4gdGhpcztyZXR1cm4gZj09PTEmJihnPWUsZT1mdW5jdGlvbihhKXtyZXR1cm4gcCgpLm9mZihhKSxnLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sZS5ndWlkPWcuZ3VpZHx8KGcuZ3VpZD1wLmd1aWQrKykpLHRoaXMuZWFjaChmdW5jdGlvbigpe3AuZXZlbnQuYWRkKHRoaXMsYSxlLGQsYyl9KX0sb25lOmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiB0aGlzLm9uKGEsYixjLGQsMSl9LG9mZjpmdW5jdGlvbihhLGMsZCl7dmFyIGUsZjtpZihhJiZhLnByZXZlbnREZWZhdWx0JiZhLmhhbmRsZU9iailyZXR1cm4gZT1hLmhhbmRsZU9iaixwKGEuZGVsZWdhdGVUYXJnZXQpLm9mZihlLm5hbWVzcGFjZT9lLm9yaWdUeXBlK1wiLlwiK2UubmFtZXNwYWNlOmUub3JpZ1R5cGUsZS5zZWxlY3RvcixlLmhhbmRsZXIpLHRoaXM7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpe2ZvcihmIGluIGEpdGhpcy5vZmYoZixjLGFbZl0pO3JldHVybiB0aGlzfWlmKGM9PT0hMXx8dHlwZW9mIGM9PVwiZnVuY3Rpb25cIilkPWMsYz1iO3JldHVybiBkPT09ITEmJihkPWJhKSx0aGlzLmVhY2goZnVuY3Rpb24oKXtwLmV2ZW50LnJlbW92ZSh0aGlzLGEsZCxjKX0pfSxiaW5kOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5vbihhLG51bGwsYixjKX0sdW5iaW5kOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMub2ZmKGEsbnVsbCxiKX0sbGl2ZTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIHAodGhpcy5jb250ZXh0KS5vbihhLHRoaXMuc2VsZWN0b3IsYixjKSx0aGlzfSxkaWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gcCh0aGlzLmNvbnRleHQpLm9mZihhLHRoaXMuc2VsZWN0b3J8fFwiKipcIixiKSx0aGlzfSxkZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gdGhpcy5vbihiLGEsYyxkKX0sdW5kZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg9PTE/dGhpcy5vZmYoYSxcIioqXCIpOnRoaXMub2ZmKGIsYXx8XCIqKlwiLGMpfSx0cmlnZ2VyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3AuZXZlbnQudHJpZ2dlcihhLGIsdGhpcyl9KX0sdHJpZ2dlckhhbmRsZXI6ZnVuY3Rpb24oYSxiKXtpZih0aGlzWzBdKXJldHVybiBwLmV2ZW50LnRyaWdnZXIoYSxiLHRoaXNbMF0sITApfSx0b2dnbGU6ZnVuY3Rpb24oYSl7dmFyIGI9YXJndW1lbnRzLGM9YS5ndWlkfHxwLmd1aWQrKyxkPTAsZT1mdW5jdGlvbihjKXt2YXIgZT0ocC5fZGF0YSh0aGlzLFwibGFzdFRvZ2dsZVwiK2EuZ3VpZCl8fDApJWQ7cmV0dXJuIHAuX2RhdGEodGhpcyxcImxhc3RUb2dnbGVcIithLmd1aWQsZSsxKSxjLnByZXZlbnREZWZhdWx0KCksYltlXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl8fCExfTtlLmd1aWQ9Yzt3aGlsZShkPGIubGVuZ3RoKWJbZCsrXS5ndWlkPWM7cmV0dXJuIHRoaXMuY2xpY2soZSl9LGhvdmVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMubW91c2VlbnRlcihhKS5tb3VzZWxlYXZlKGJ8fGEpfX0pLHAuZWFjaChcImJsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlIGNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSxiKXtwLmZuW2JdPWZ1bmN0aW9uKGEsYyl7cmV0dXJuIGM9PW51bGwmJihjPWEsYT1udWxsKSxhcmd1bWVudHMubGVuZ3RoPjA/dGhpcy5vbihiLG51bGwsYSxjKTp0aGlzLnRyaWdnZXIoYil9LFkudGVzdChiKSYmKHAuZXZlbnQuZml4SG9va3NbYl09cC5ldmVudC5rZXlIb29rcyksWi50ZXN0KGIpJiYocC5ldmVudC5maXhIb29rc1tiXT1wLmV2ZW50Lm1vdXNlSG9va3MpfSksZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBiZChhLGIsYyxkKXt2YXIgZT0wLGY9Yi5sZW5ndGg7Zm9yKDtlPGY7ZSsrKVooYSxiW2VdLGMsZCl9ZnVuY3Rpb24gYmUoYSxiLGMsZCxlLGYpe3ZhciBnLGg9JC5zZXRGaWx0ZXJzW2IudG9Mb3dlckNhc2UoKV07cmV0dXJuIGh8fFouZXJyb3IoYiksKGF8fCEoZz1lKSkmJmJkKGF8fFwiKlwiLGQsZz1bXSxlKSxnLmxlbmd0aD4wP2goZyxjLGYpOltdfWZ1bmN0aW9uIGJmKGEsYyxkLGUsZil7dmFyIGcsaCxpLGosayxsLG0sbixwPTAscT1mLmxlbmd0aCxzPUwuUE9TLHQ9bmV3IFJlZ0V4cChcIl5cIitzLnNvdXJjZStcIig/IVwiK3IrXCIpXCIsXCJpXCIpLHU9ZnVuY3Rpb24oKXt2YXIgYT0xLGM9YXJndW1lbnRzLmxlbmd0aC0yO2Zvcig7YTxjO2ErKylhcmd1bWVudHNbYV09PT1iJiYoZ1thXT1iKX07Zm9yKDtwPHE7cCsrKXtzLmV4ZWMoXCJcIiksYT1mW3BdLGo9W10saT0wLGs9ZTt3aGlsZShnPXMuZXhlYyhhKSl7bj1zLmxhc3RJbmRleD1nLmluZGV4K2dbMF0ubGVuZ3RoO2lmKG4+aSl7bT1hLnNsaWNlKGksZy5pbmRleCksaT1uLGw9W2NdLEIudGVzdChtKSYmKGsmJihsPWspLGs9ZSk7aWYoaD1ILnRlc3QobSkpbT1tLnNsaWNlKDAsLTUpLnJlcGxhY2UoQixcIiQmKlwiKTtnLmxlbmd0aD4xJiZnWzBdLnJlcGxhY2UodCx1KSxrPWJlKG0sZ1sxXSxnWzJdLGwsayxoKX19az8oaj1qLmNvbmNhdChrKSwobT1hLnNsaWNlKGkpKSYmbSE9PVwiKVwiP0IudGVzdChtKT9iZChtLGosZCxlKTpaKG0sYyxkLGU/ZS5jb25jYXQoayk6ayk6by5hcHBseShkLGopKTpaKGEsYyxkLGUpfXJldHVybiBxPT09MT9kOloudW5pcXVlU29ydChkKX1mdW5jdGlvbiBiZyhhLGIsYyl7dmFyIGQsZSxmLGc9W10saT0wLGo9RC5leGVjKGEpLGs9IWoucG9wKCkmJiFqLnBvcCgpLGw9ayYmYS5tYXRjaChDKXx8W1wiXCJdLG09JC5wcmVGaWx0ZXIsbj0kLmZpbHRlcixvPSFjJiZiIT09aDtmb3IoOyhlPWxbaV0pIT1udWxsJiZrO2krKyl7Zy5wdXNoKGQ9W10pLG8mJihlPVwiIFwiK2UpO3doaWxlKGUpe2s9ITE7aWYoaj1CLmV4ZWMoZSkpZT1lLnNsaWNlKGpbMF0ubGVuZ3RoKSxrPWQucHVzaCh7cGFydDpqLnBvcCgpLnJlcGxhY2UoQSxcIiBcIiksY2FwdHVyZXM6an0pO2ZvcihmIGluIG4pKGo9TFtmXS5leGVjKGUpKSYmKCFtW2ZdfHwoaj1tW2ZdKGosYixjKSkpJiYoZT1lLnNsaWNlKGouc2hpZnQoKS5sZW5ndGgpLGs9ZC5wdXNoKHtwYXJ0OmYsY2FwdHVyZXM6an0pKTtpZighaylicmVha319cmV0dXJuIGt8fFouZXJyb3IoYSksZ31mdW5jdGlvbiBiaChhLGIsZSl7dmFyIGY9Yi5kaXIsZz1tKys7cmV0dXJuIGF8fChhPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09ZX0pLGIuZmlyc3Q/ZnVuY3Rpb24oYixjKXt3aGlsZShiPWJbZl0paWYoYi5ub2RlVHlwZT09PTEpcmV0dXJuIGEoYixjKSYmYn06ZnVuY3Rpb24oYixlKXt2YXIgaCxpPWcrXCIuXCIrZCxqPWkrXCIuXCIrYzt3aGlsZShiPWJbZl0paWYoYi5ub2RlVHlwZT09PTEpe2lmKChoPWJbcV0pPT09ailyZXR1cm4gYi5zaXpzZXQ7aWYodHlwZW9mIGg9PVwic3RyaW5nXCImJmguaW5kZXhPZihpKT09PTApe2lmKGIuc2l6c2V0KXJldHVybiBifWVsc2V7YltxXT1qO2lmKGEoYixlKSlyZXR1cm4gYi5zaXpzZXQ9ITAsYjtiLnNpenNldD0hMX19fX1mdW5jdGlvbiBiaShhLGIpe3JldHVybiBhP2Z1bmN0aW9uKGMsZCl7dmFyIGU9YihjLGQpO3JldHVybiBlJiZhKGU9PT0hMD9jOmUsZCl9OmJ9ZnVuY3Rpb24gYmooYSxiLGMpe3ZhciBkLGUsZj0wO2Zvcig7ZD1hW2ZdO2YrKykkLnJlbGF0aXZlW2QucGFydF0/ZT1iaChlLCQucmVsYXRpdmVbZC5wYXJ0XSxiKTooZC5jYXB0dXJlcy5wdXNoKGIsYyksZT1iaShlLCQuZmlsdGVyW2QucGFydF0uYXBwbHkobnVsbCxkLmNhcHR1cmVzKSkpO3JldHVybiBlfWZ1bmN0aW9uIGJrKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe3ZhciBkLGU9MDtmb3IoO2Q9YVtlXTtlKyspaWYoZChiLGMpKXJldHVybiEwO3JldHVybiExfX12YXIgYyxkLGUsZixnLGg9YS5kb2N1bWVudCxpPWguZG9jdW1lbnRFbGVtZW50LGo9XCJ1bmRlZmluZWRcIixrPSExLGw9ITAsbT0wLG49W10uc2xpY2Usbz1bXS5wdXNoLHE9KFwic2l6Y2FjaGVcIitNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKFwiLlwiLFwiXCIpLHI9XCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLHM9XCIoPzpcXFxcXFxcXC58Wy1cXFxcd118W15cXFxceDAwLVxcXFx4YTBdKStcIix0PXMucmVwbGFjZShcIndcIixcIncjXCIpLHU9XCIoWypeJHwhfl0/PSlcIix2PVwiXFxcXFtcIityK1wiKihcIitzK1wiKVwiK3IrXCIqKD86XCIrdStyK1wiKig/OihbJ1xcXCJdKSgoPzpcXFxcXFxcXC58W15cXFxcXFxcXF0pKj8pXFxcXDN8KFwiK3QrXCIpfCl8KVwiK3IrXCIqXFxcXF1cIix3PVwiOihcIitzK1wiKSg/OlxcXFwoKD86KFsnXFxcIl0pKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXSkqPylcXFxcMnwoKD86W14sXXxcXFxcXFxcXCx8KD86LCg/PVteXFxcXFtdKlxcXFxdKSl8KD86LCg/PVteXFxcXChdKlxcXFwpKSkpKikpXFxcXCl8KVwiLHg9XCI6KG50aHxlcXxndHxsdHxmaXJzdHxsYXN0fGV2ZW58b2RkKSg/OlxcXFwoKFxcXFxkKilcXFxcKXwpKD89W14tXXwkKVwiLHk9citcIiooW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZj4rfl0pXCIrcitcIipcIix6PVwiKD89W15cXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdKSg/OlxcXFxcXFxcLnxcIit2K1wifFwiK3cucmVwbGFjZSgyLDcpK1wifFteXFxcXFxcXFwoKSxdKStcIixBPW5ldyBSZWdFeHAoXCJeXCIrcitcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIrcitcIiskXCIsXCJnXCIpLEI9bmV3IFJlZ0V4cChcIl5cIit5KSxDPW5ldyBSZWdFeHAoeitcIj8oPz1cIityK1wiKix8JClcIixcImdcIiksRD1uZXcgUmVnRXhwKFwiXig/Oig/ISwpKD86KD86XnwsKVwiK3IrXCIqXCIreitcIikqP3xcIityK1wiKiguKj8pKShcXFxcKXwkKVwiKSxFPW5ldyBSZWdFeHAoei5zbGljZSgxOSwtNikrXCJcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGY+K35dKSt8XCIreSxcImdcIiksRj0vXig/OiMoW1xcd1xcLV0rKXwoXFx3Kyl8XFwuKFtcXHdcXC1dKykpJC8sRz0vW1xceDIwXFx0XFxyXFxuXFxmXSpbK35dLyxIPS86bm90XFwoJC8sST0vaFxcZC9pLEo9L2lucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24vaSxLPS9cXFxcKD8hXFxcXCkvZyxMPXtJRDpuZXcgUmVnRXhwKFwiXiMoXCIrcytcIilcIiksQ0xBU1M6bmV3IFJlZ0V4cChcIl5cXFxcLihcIitzK1wiKVwiKSxOQU1FOm5ldyBSZWdFeHAoXCJeXFxcXFtuYW1lPVsnXFxcIl0/KFwiK3MrXCIpWydcXFwiXT9cXFxcXVwiKSxUQUc6bmV3IFJlZ0V4cChcIl4oXCIrcy5yZXBsYWNlKFwiWy1cIixcIlstXFxcXCpcIikrXCIpXCIpLEFUVFI6bmV3IFJlZ0V4cChcIl5cIit2KSxQU0VVRE86bmV3IFJlZ0V4cChcIl5cIit3KSxDSElMRDpuZXcgUmVnRXhwKFwiXjoob25seXxudGh8bGFzdHxmaXJzdCktY2hpbGQoPzpcXFxcKFwiK3IrXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIityK1wiKig/OihbKy1dfClcIityK1wiKihcXFxcZCspfCkpXCIrcitcIipcXFxcKXwpXCIsXCJpXCIpLFBPUzpuZXcgUmVnRXhwKHgsXCJpZ1wiKSxuZWVkc0NvbnRleHQ6bmV3IFJlZ0V4cChcIl5cIityK1wiKls+K35dfFwiK3gsXCJpXCIpfSxNPXt9LE49W10sTz17fSxQPVtdLFE9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2l6emxlRmlsdGVyPSEwLGF9LFI9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBiLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1cImlucHV0XCImJmIudHlwZT09PWF9fSxTPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuKGM9PT1cImlucHV0XCJ8fGM9PT1cImJ1dHRvblwiKSYmYi50eXBlPT09YX19LFQ9ZnVuY3Rpb24oYSl7dmFyIGI9ITEsYz1oLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2I9YShjKX1jYXRjaChkKXt9cmV0dXJuIGM9bnVsbCxifSxVPVQoZnVuY3Rpb24oYSl7YS5pbm5lckhUTUw9XCI8c2VsZWN0Pjwvc2VsZWN0PlwiO3ZhciBiPXR5cGVvZiBhLmxhc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKTtyZXR1cm4gYiE9PVwiYm9vbGVhblwiJiZiIT09XCJzdHJpbmdcIn0pLFY9VChmdW5jdGlvbihhKXthLmlkPXErMCxhLmlubmVySFRNTD1cIjxhIG5hbWU9J1wiK3ErXCInPjwvYT48ZGl2IG5hbWU9J1wiK3ErXCInPjwvZGl2PlwiLGkuaW5zZXJ0QmVmb3JlKGEsaS5maXJzdENoaWxkKTt2YXIgYj1oLmdldEVsZW1lbnRzQnlOYW1lJiZoLmdldEVsZW1lbnRzQnlOYW1lKHEpLmxlbmd0aD09PTIraC5nZXRFbGVtZW50c0J5TmFtZShxKzApLmxlbmd0aDtyZXR1cm4gZz0haC5nZXRFbGVtZW50QnlJZChxKSxpLnJlbW92ZUNoaWxkKGEpLGJ9KSxXPVQoZnVuY3Rpb24oYSl7cmV0dXJuIGEuYXBwZW5kQ2hpbGQoaC5jcmVhdGVDb21tZW50KFwiXCIpKSxhLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKS5sZW5ndGg9PT0wfSksWD1UKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlubmVySFRNTD1cIjxhIGhyZWY9JyMnPjwvYT5cIixhLmZpcnN0Q2hpbGQmJnR5cGVvZiBhLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlIT09aiYmYS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIik9PT1cIiNcIn0pLFk9VChmdW5jdGlvbihhKXtyZXR1cm4gYS5pbm5lckhUTUw9XCI8ZGl2IGNsYXNzPSdoaWRkZW4gZSc+PC9kaXY+PGRpdiBjbGFzcz0naGlkZGVuJz48L2Rpdj5cIiwhYS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lfHxhLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlXCIpLmxlbmd0aD09PTA/ITE6KGEubGFzdENoaWxkLmNsYXNzTmFtZT1cImVcIixhLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJlXCIpLmxlbmd0aCE9PTEpfSksWj1mdW5jdGlvbihhLGIsYyxkKXtjPWN8fFtdLGI9Ynx8aDt2YXIgZSxmLGcsaSxqPWIubm9kZVR5cGU7aWYoaiE9PTEmJmohPT05KXJldHVybltdO2lmKCFhfHx0eXBlb2YgYSE9XCJzdHJpbmdcIilyZXR1cm4gYztnPWJhKGIpO2lmKCFnJiYhZClpZihlPUYuZXhlYyhhKSlpZihpPWVbMV0pe2lmKGo9PT05KXtmPWIuZ2V0RWxlbWVudEJ5SWQoaSk7aWYoIWZ8fCFmLnBhcmVudE5vZGUpcmV0dXJuIGM7aWYoZi5pZD09PWkpcmV0dXJuIGMucHVzaChmKSxjfWVsc2UgaWYoYi5vd25lckRvY3VtZW50JiYoZj1iLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaSkpJiZiYihiLGYpJiZmLmlkPT09aSlyZXR1cm4gYy5wdXNoKGYpLGN9ZWxzZXtpZihlWzJdKXJldHVybiBvLmFwcGx5KGMsbi5jYWxsKGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSksMCkpLGM7aWYoKGk9ZVszXSkmJlkmJmIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSlyZXR1cm4gby5hcHBseShjLG4uY2FsbChiLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoaSksMCkpLGN9cmV0dXJuIGJtKGEsYixjLGQsZyl9LCQ9Wi5zZWxlY3RvcnM9e2NhY2hlTGVuZ3RoOjUwLG1hdGNoOkwsb3JkZXI6W1wiSURcIixcIlRBR1wiXSxhdHRySGFuZGxlOnt9LGNyZWF0ZVBzZXVkbzpRLGZpbmQ6e0lEOmc/ZnVuY3Rpb24oYSxiLGMpe2lmKHR5cGVvZiBiLmdldEVsZW1lbnRCeUlkIT09aiYmIWMpe3ZhciBkPWIuZ2V0RWxlbWVudEJ5SWQoYSk7cmV0dXJuIGQmJmQucGFyZW50Tm9kZT9bZF06W119fTpmdW5jdGlvbihhLGMsZCl7aWYodHlwZW9mIGMuZ2V0RWxlbWVudEJ5SWQhPT1qJiYhZCl7dmFyIGU9Yy5nZXRFbGVtZW50QnlJZChhKTtyZXR1cm4gZT9lLmlkPT09YXx8dHlwZW9mIGUuZ2V0QXR0cmlidXRlTm9kZSE9PWomJmUuZ2V0QXR0cmlidXRlTm9kZShcImlkXCIpLnZhbHVlPT09YT9bZV06YjpbXX19LFRBRzpXP2Z1bmN0aW9uKGEsYil7aWYodHlwZW9mIGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUhPT1qKXJldHVybiBiLmdldEVsZW1lbnRzQnlUYWdOYW1lKGEpfTpmdW5jdGlvbihhLGIpe3ZhciBjPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk7aWYoYT09PVwiKlwiKXt2YXIgZCxlPVtdLGY9MDtmb3IoO2Q9Y1tmXTtmKyspZC5ub2RlVHlwZT09PTEmJmUucHVzaChkKTtyZXR1cm4gZX1yZXR1cm4gY319LHJlbGF0aXZlOntcIj5cIjp7ZGlyOlwicGFyZW50Tm9kZVwiLGZpcnN0OiEwfSxcIiBcIjp7ZGlyOlwicGFyZW50Tm9kZVwifSxcIitcIjp7ZGlyOlwicHJldmlvdXNTaWJsaW5nXCIsZmlyc3Q6ITB9LFwiflwiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIn19LHByZUZpbHRlcjp7QVRUUjpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnJlcGxhY2UoSyxcIlwiKSxhWzNdPShhWzRdfHxhWzVdfHxcIlwiKS5yZXBsYWNlKEssXCJcIiksYVsyXT09PVwifj1cIiYmKGFbM109XCIgXCIrYVszXStcIiBcIiksYS5zbGljZSgwLDQpfSxDSElMRDpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnRvTG93ZXJDYXNlKCksYVsxXT09PVwibnRoXCI/KGFbMl18fFouZXJyb3IoYVswXSksYVszXT0rKGFbM10/YVs0XSsoYVs1XXx8MSk6MiooYVsyXT09PVwiZXZlblwifHxhWzJdPT09XCJvZGRcIikpLGFbNF09KyhhWzZdK2FbN118fGFbMl09PT1cIm9kZFwiKSk6YVsyXSYmWi5lcnJvcihhWzBdKSxhfSxQU0VVRE86ZnVuY3Rpb24oYSl7dmFyIGIsYz1hWzRdO3JldHVybiBMLkNISUxELnRlc3QoYVswXSk/bnVsbDooYyYmKGI9RC5leGVjKGMpKSYmYi5wb3AoKSYmKGFbMF09YVswXS5zbGljZSgwLGJbMF0ubGVuZ3RoLWMubGVuZ3RoLTEpLGM9YlswXS5zbGljZSgwLC0xKSksYS5zcGxpY2UoMiwzLGN8fGFbM10pLGEpfX0sZmlsdGVyOntJRDpnP2Z1bmN0aW9uKGEpe3JldHVybiBhPWEucmVwbGFjZShLLFwiXCIpLGZ1bmN0aW9uKGIpe3JldHVybiBiLmdldEF0dHJpYnV0ZShcImlkXCIpPT09YX19OmZ1bmN0aW9uKGEpe3JldHVybiBhPWEucmVwbGFjZShLLFwiXCIpLGZ1bmN0aW9uKGIpe3ZhciBjPXR5cGVvZiBiLmdldEF0dHJpYnV0ZU5vZGUhPT1qJiZiLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKTtyZXR1cm4gYyYmYy52YWx1ZT09PWF9fSxUQUc6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1cIipcIj9mdW5jdGlvbigpe3JldHVybiEwfTooYT1hLnJlcGxhY2UoSyxcIlwiKS50b0xvd2VyQ2FzZSgpLGZ1bmN0aW9uKGIpe3JldHVybiBiLm5vZGVOYW1lJiZiLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1hfSl9LENMQVNTOmZ1bmN0aW9uKGEpe3ZhciBiPU1bYV07cmV0dXJuIGJ8fChiPU1bYV09bmV3IFJlZ0V4cChcIihefFwiK3IrXCIpXCIrYStcIihcIityK1wifCQpXCIpLE4ucHVzaChhKSxOLmxlbmd0aD4kLmNhY2hlTGVuZ3RoJiZkZWxldGUgTVtOLnNoaWZ0KCldKSxmdW5jdGlvbihhKXtyZXR1cm4gYi50ZXN0KGEuY2xhc3NOYW1lfHx0eXBlb2YgYS5nZXRBdHRyaWJ1dGUhPT1qJiZhLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKX19LEFUVFI6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBiP2Z1bmN0aW9uKGQpe3ZhciBlPVouYXR0cihkLGEpLGY9ZStcIlwiO2lmKGU9PW51bGwpcmV0dXJuIGI9PT1cIiE9XCI7c3dpdGNoKGIpe2Nhc2VcIj1cIjpyZXR1cm4gZj09PWM7Y2FzZVwiIT1cIjpyZXR1cm4gZiE9PWM7Y2FzZVwiXj1cIjpyZXR1cm4gYyYmZi5pbmRleE9mKGMpPT09MDtjYXNlXCIqPVwiOnJldHVybiBjJiZmLmluZGV4T2YoYyk+LTE7Y2FzZVwiJD1cIjpyZXR1cm4gYyYmZi5zdWJzdHIoZi5sZW5ndGgtYy5sZW5ndGgpPT09YztjYXNlXCJ+PVwiOnJldHVybihcIiBcIitmK1wiIFwiKS5pbmRleE9mKGMpPi0xO2Nhc2VcInw9XCI6cmV0dXJuIGY9PT1jfHxmLnN1YnN0cigwLGMubGVuZ3RoKzEpPT09YytcIi1cIn19OmZ1bmN0aW9uKGIpe3JldHVybiBaLmF0dHIoYixhKSE9bnVsbH19LENISUxEOmZ1bmN0aW9uKGEsYixjLGQpe2lmKGE9PT1cIm50aFwiKXt2YXIgZT1tKys7cmV0dXJuIGZ1bmN0aW9uKGEpe3ZhciBiLGYsZz0wLGg9YTtpZihjPT09MSYmZD09PTApcmV0dXJuITA7Yj1hLnBhcmVudE5vZGU7aWYoYiYmKGJbcV0hPT1lfHwhYS5zaXpzZXQpKXtmb3IoaD1iLmZpcnN0Q2hpbGQ7aDtoPWgubmV4dFNpYmxpbmcpaWYoaC5ub2RlVHlwZT09PTEpe2guc2l6c2V0PSsrZztpZihoPT09YSlicmVha31iW3FdPWV9cmV0dXJuIGY9YS5zaXpzZXQtZCxjPT09MD9mPT09MDpmJWM9PT0wJiZmL2M+PTB9fXJldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iO3N3aXRjaChhKXtjYXNlXCJvbmx5XCI6Y2FzZVwiZmlyc3RcIjp3aGlsZShjPWMucHJldmlvdXNTaWJsaW5nKWlmKGMubm9kZVR5cGU9PT0xKXJldHVybiExO2lmKGE9PT1cImZpcnN0XCIpcmV0dXJuITA7Yz1iO2Nhc2VcImxhc3RcIjp3aGlsZShjPWMubmV4dFNpYmxpbmcpaWYoYy5ub2RlVHlwZT09PTEpcmV0dXJuITE7cmV0dXJuITB9fX0sUFNFVURPOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPSQucHNldWRvc1thXXx8JC5wc2V1ZG9zW2EudG9Mb3dlckNhc2UoKV07cmV0dXJuIGV8fFouZXJyb3IoXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiK2EpLGUuc2l6emxlRmlsdGVyP2UoYixjLGQpOmV9fSxwc2V1ZG9zOntub3Q6UShmdW5jdGlvbihhLGIsYyl7dmFyIGQ9YmwoYS5yZXBsYWNlKEEsXCIkMVwiKSxiLGMpO3JldHVybiBmdW5jdGlvbihhKXtyZXR1cm4hZChhKX19KSxlbmFibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITF9LGRpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITB9LGNoZWNrZWQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVybiBiPT09XCJpbnB1dFwiJiYhIWEuY2hlY2tlZHx8Yj09PVwib3B0aW9uXCImJiEhYS5zZWxlY3RlZH0sc2VsZWN0ZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucGFyZW50Tm9kZSYmYS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgsYS5zZWxlY3RlZD09PSEwfSxwYXJlbnQ6ZnVuY3Rpb24oYSl7cmV0dXJuISQucHNldWRvcy5lbXB0eShhKX0sZW1wdHk6ZnVuY3Rpb24oYSl7dmFyIGI7YT1hLmZpcnN0Q2hpbGQ7d2hpbGUoYSl7aWYoYS5ub2RlTmFtZT5cIkBcInx8KGI9YS5ub2RlVHlwZSk9PT0zfHxiPT09NClyZXR1cm4hMTthPWEubmV4dFNpYmxpbmd9cmV0dXJuITB9LGNvbnRhaW5zOlEoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybihiLnRleHRDb250ZW50fHxiLmlubmVyVGV4dHx8YmMoYikpLmluZGV4T2YoYSk+LTF9fSksaGFzOlEoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBaKGEsYikubGVuZ3RoPjB9fSksaGVhZGVyOmZ1bmN0aW9uKGEpe3JldHVybiBJLnRlc3QoYS5ub2RlTmFtZSl9LHRleHQ6ZnVuY3Rpb24oYSl7dmFyIGIsYztyZXR1cm4gYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09XCJpbnB1dFwiJiYoYj1hLnR5cGUpPT09XCJ0ZXh0XCImJigoYz1hLmdldEF0dHJpYnV0ZShcInR5cGVcIikpPT1udWxsfHxjLnRvTG93ZXJDYXNlKCk9PT1iKX0scmFkaW86UihcInJhZGlvXCIpLGNoZWNrYm94OlIoXCJjaGVja2JveFwiKSxmaWxlOlIoXCJmaWxlXCIpLHBhc3N3b3JkOlIoXCJwYXNzd29yZFwiKSxpbWFnZTpSKFwiaW1hZ2VcIiksc3VibWl0OlMoXCJzdWJtaXRcIikscmVzZXQ6UyhcInJlc2V0XCIpLGJ1dHRvbjpmdW5jdGlvbihhKXt2YXIgYj1hLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuIGI9PT1cImlucHV0XCImJmEudHlwZT09PVwiYnV0dG9uXCJ8fGI9PT1cImJ1dHRvblwifSxpbnB1dDpmdW5jdGlvbihhKXtyZXR1cm4gSi50ZXN0KGEubm9kZU5hbWUpfSxmb2N1czpmdW5jdGlvbihhKXt2YXIgYj1hLm93bmVyRG9jdW1lbnQ7cmV0dXJuIGE9PT1iLmFjdGl2ZUVsZW1lbnQmJighYi5oYXNGb2N1c3x8Yi5oYXNGb2N1cygpKSYmKCEhYS50eXBlfHwhIWEuaHJlZil9LGFjdGl2ZTpmdW5jdGlvbihhKXtyZXR1cm4gYT09PWEub3duZXJEb2N1bWVudC5hY3RpdmVFbGVtZW50fX0sc2V0RmlsdGVyczp7Zmlyc3Q6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBjP2Euc2xpY2UoMSk6W2FbMF1dfSxsYXN0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnBvcCgpO3JldHVybiBjP2E6W2RdfSxldmVuOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1bXSxlPWM/MTowLGY9YS5sZW5ndGg7Zm9yKDtlPGY7ZT1lKzIpZC5wdXNoKGFbZV0pO3JldHVybiBkfSxvZGQ6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPVtdLGU9Yz8wOjEsZj1hLmxlbmd0aDtmb3IoO2U8ZjtlPWUrMilkLnB1c2goYVtlXSk7cmV0dXJuIGR9LGx0OmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYz9hLnNsaWNlKCtiKTphLnNsaWNlKDAsK2IpfSxndDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGM/YS5zbGljZSgwLCtiKzEpOmEuc2xpY2UoK2IrMSl9LGVxOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnNwbGljZSgrYiwxKTtyZXR1cm4gYz9hOmR9fX07JC5zZXRGaWx0ZXJzLm50aD0kLnNldEZpbHRlcnMuZXEsJC5maWx0ZXJzPSQucHNldWRvcyxYfHwoJC5hdHRySGFuZGxlPXtocmVmOmZ1bmN0aW9uKGEpe3JldHVybiBhLmdldEF0dHJpYnV0ZShcImhyZWZcIiwyKX0sdHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gYS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpfX0pLFYmJigkLm9yZGVyLnB1c2goXCJOQU1FXCIpLCQuZmluZC5OQU1FPWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGIuZ2V0RWxlbWVudHNCeU5hbWUhPT1qKXJldHVybiBiLmdldEVsZW1lbnRzQnlOYW1lKGEpfSksWSYmKCQub3JkZXIuc3BsaWNlKDEsMCxcIkNMQVNTXCIpLCQuZmluZC5DTEFTUz1mdW5jdGlvbihhLGIsYyl7aWYodHlwZW9mIGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSE9PWomJiFjKXJldHVybiBiLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYSl9KTt0cnl7bi5jYWxsKGkuY2hpbGROb2RlcywwKVswXS5ub2RlVHlwZX1jYXRjaChfKXtuPWZ1bmN0aW9uKGEpe3ZhciBiLGM9W107Zm9yKDtiPXRoaXNbYV07YSsrKWMucHVzaChiKTtyZXR1cm4gY319dmFyIGJhPVouaXNYTUw9ZnVuY3Rpb24oYSl7dmFyIGI9YSYmKGEub3duZXJEb2N1bWVudHx8YSkuZG9jdW1lbnRFbGVtZW50O3JldHVybiBiP2Iubm9kZU5hbWUhPT1cIkhUTUxcIjohMX0sYmI9Wi5jb250YWlucz1pLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uP2Z1bmN0aW9uKGEsYil7cmV0dXJuISEoYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSYxNil9OmkuY29udGFpbnM/ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLm5vZGVUeXBlPT09OT9hLmRvY3VtZW50RWxlbWVudDphLGQ9Yi5wYXJlbnROb2RlO3JldHVybiBhPT09ZHx8ISEoZCYmZC5ub2RlVHlwZT09PTEmJmMuY29udGFpbnMmJmMuY29udGFpbnMoZCkpfTpmdW5jdGlvbihhLGIpe3doaWxlKGI9Yi5wYXJlbnROb2RlKWlmKGI9PT1hKXJldHVybiEwO3JldHVybiExfSxiYz1aLmdldFRleHQ9ZnVuY3Rpb24oYSl7dmFyIGIsYz1cIlwiLGQ9MCxlPWEubm9kZVR5cGU7aWYoZSl7aWYoZT09PTF8fGU9PT05fHxlPT09MTEpe2lmKHR5cGVvZiBhLnRleHRDb250ZW50PT1cInN0cmluZ1wiKXJldHVybiBhLnRleHRDb250ZW50O2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZyljKz1iYyhhKX1lbHNlIGlmKGU9PT0zfHxlPT09NClyZXR1cm4gYS5ub2RlVmFsdWV9ZWxzZSBmb3IoO2I9YVtkXTtkKyspYys9YmMoYik7cmV0dXJuIGN9O1ouYXR0cj1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9YmEoYSk7cmV0dXJuIGR8fChiPWIudG9Mb3dlckNhc2UoKSksJC5hdHRySGFuZGxlW2JdPyQuYXR0ckhhbmRsZVtiXShhKTpVfHxkP2EuZ2V0QXR0cmlidXRlKGIpOihjPWEuZ2V0QXR0cmlidXRlTm9kZShiKSxjP3R5cGVvZiBhW2JdPT1cImJvb2xlYW5cIj9hW2JdP2I6bnVsbDpjLnNwZWNpZmllZD9jLnZhbHVlOm51bGw6bnVsbCl9LFouZXJyb3I9ZnVuY3Rpb24oYSl7dGhyb3cgbmV3IEVycm9yKFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIrYSl9LFswLDBdLnNvcnQoZnVuY3Rpb24oKXtyZXR1cm4gbD0wfSksaS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbj9lPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1iPyhrPSEwLDApOighYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbnx8IWIuY29tcGFyZURvY3VtZW50UG9zaXRpb24/YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjphLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGIpJjQpPy0xOjF9OihlPWZ1bmN0aW9uKGEsYil7aWYoYT09PWIpcmV0dXJuIGs9ITAsMDtpZihhLnNvdXJjZUluZGV4JiZiLnNvdXJjZUluZGV4KXJldHVybiBhLnNvdXJjZUluZGV4LWIuc291cmNlSW5kZXg7dmFyIGMsZCxlPVtdLGc9W10saD1hLnBhcmVudE5vZGUsaT1iLnBhcmVudE5vZGUsaj1oO2lmKGg9PT1pKXJldHVybiBmKGEsYik7aWYoIWgpcmV0dXJuLTE7aWYoIWkpcmV0dXJuIDE7d2hpbGUoaillLnVuc2hpZnQoaiksaj1qLnBhcmVudE5vZGU7aj1pO3doaWxlKGopZy51bnNoaWZ0KGopLGo9ai5wYXJlbnROb2RlO2M9ZS5sZW5ndGgsZD1nLmxlbmd0aDtmb3IodmFyIGw9MDtsPGMmJmw8ZDtsKyspaWYoZVtsXSE9PWdbbF0pcmV0dXJuIGYoZVtsXSxnW2xdKTtyZXR1cm4gbD09PWM/ZihhLGdbbF0sLTEpOmYoZVtsXSxiLDEpfSxmPWZ1bmN0aW9uKGEsYixjKXtpZihhPT09YilyZXR1cm4gYzt2YXIgZD1hLm5leHRTaWJsaW5nO3doaWxlKGQpe2lmKGQ9PT1iKXJldHVybi0xO2Q9ZC5uZXh0U2libGluZ31yZXR1cm4gMX0pLFoudW5pcXVlU29ydD1mdW5jdGlvbihhKXt2YXIgYixjPTE7aWYoZSl7az1sLGEuc29ydChlKTtpZihrKWZvcig7Yj1hW2NdO2MrKyliPT09YVtjLTFdJiZhLnNwbGljZShjLS0sMSl9cmV0dXJuIGF9O3ZhciBibD1aLmNvbXBpbGU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnPU9bYV07aWYoZyYmZy5jb250ZXh0PT09YilyZXR1cm4gZztlPWJnKGEsYixjKTtmb3IoZj0wO2Q9ZVtmXTtmKyspZVtmXT1iaihkLGIsYyk7cmV0dXJuIGc9T1thXT1iayhlKSxnLmNvbnRleHQ9YixnLnJ1bnM9Zy5kaXJydW5zPTAsUC5wdXNoKGEpLFAubGVuZ3RoPiQuY2FjaGVMZW5ndGgmJmRlbGV0ZSBPW1Auc2hpZnQoKV0sZ307Wi5tYXRjaGVzPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFooYSxudWxsLG51bGwsYil9LFoubWF0Y2hlc1NlbGVjdG9yPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFooYixudWxsLG51bGwsW2FdKS5sZW5ndGg+MH07dmFyIGJtPWZ1bmN0aW9uKGEsYixlLGYsZyl7YT1hLnJlcGxhY2UoQSxcIiQxXCIpO3ZhciBoLGksaixrLGwsbSxwLHEscixzPWEubWF0Y2goQyksdD1hLm1hdGNoKEUpLHU9Yi5ub2RlVHlwZTtpZihMLlBPUy50ZXN0KGEpKXJldHVybiBiZihhLGIsZSxmLHMpO2lmKGYpaD1uLmNhbGwoZiwwKTtlbHNlIGlmKHMmJnMubGVuZ3RoPT09MSl7aWYodC5sZW5ndGg+MSYmdT09PTkmJiFnJiYocz1MLklELmV4ZWModFswXSkpKXtiPSQuZmluZC5JRChzWzFdLGIsZylbMF07aWYoIWIpcmV0dXJuIGU7YT1hLnNsaWNlKHQuc2hpZnQoKS5sZW5ndGgpfXE9KHM9Ry5leGVjKHRbMF0pKSYmIXMuaW5kZXgmJmIucGFyZW50Tm9kZXx8YixyPXQucG9wKCksbT1yLnNwbGl0KFwiOm5vdFwiKVswXTtmb3Ioaj0wLGs9JC5vcmRlci5sZW5ndGg7ajxrO2orKyl7cD0kLm9yZGVyW2pdO2lmKHM9TFtwXS5leGVjKG0pKXtoPSQuZmluZFtwXSgoc1sxXXx8XCJcIikucmVwbGFjZShLLFwiXCIpLHEsZyk7aWYoaD09bnVsbCljb250aW51ZTttPT09ciYmKGE9YS5zbGljZSgwLGEubGVuZ3RoLXIubGVuZ3RoKSttLnJlcGxhY2UoTFtwXSxcIlwiKSxhfHxvLmFwcGx5KGUsbi5jYWxsKGgsMCkpKTticmVha319fWlmKGEpe2k9YmwoYSxiLGcpLGQ9aS5kaXJydW5zKyssaD09bnVsbCYmKGg9JC5maW5kLlRBRyhcIipcIixHLnRlc3QoYSkmJmIucGFyZW50Tm9kZXx8YikpO2ZvcihqPTA7bD1oW2pdO2orKyljPWkucnVucysrLGkobCxiKSYmZS5wdXNoKGwpfXJldHVybiBlfTtoLnF1ZXJ5U2VsZWN0b3JBbGwmJmZ1bmN0aW9uKCl7dmFyIGEsYj1ibSxjPS8nfFxcXFwvZyxkPS9cXD1bXFx4MjBcXHRcXHJcXG5cXGZdKihbXidcIlxcXV0qKVtcXHgyMFxcdFxcclxcblxcZl0qXFxdL2csZT1bXSxmPVtcIjphY3RpdmVcIl0sZz1pLm1hdGNoZXNTZWxlY3Rvcnx8aS5tb3pNYXRjaGVzU2VsZWN0b3J8fGkud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxpLm9NYXRjaGVzU2VsZWN0b3J8fGkubXNNYXRjaGVzU2VsZWN0b3I7VChmdW5jdGlvbihhKXthLmlubmVySFRNTD1cIjxzZWxlY3Q+PG9wdGlvbiBzZWxlY3RlZD48L29wdGlvbj48L3NlbGVjdD5cIixhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc2VsZWN0ZWRdXCIpLmxlbmd0aHx8ZS5wdXNoKFwiXFxcXFtcIityK1wiKig/OmNoZWNrZWR8ZGlzYWJsZWR8aXNtYXB8bXVsdGlwbGV8cmVhZG9ubHl8c2VsZWN0ZWR8dmFsdWUpXCIpLGEucXVlcnlTZWxlY3RvckFsbChcIjpjaGVja2VkXCIpLmxlbmd0aHx8ZS5wdXNoKFwiOmNoZWNrZWRcIil9KSxUKGZ1bmN0aW9uKGEpe2EuaW5uZXJIVE1MPVwiPHAgdGVzdD0nJz48L3A+XCIsYS5xdWVyeVNlbGVjdG9yQWxsKFwiW3Rlc3RePScnXVwiKS5sZW5ndGgmJmUucHVzaChcIlsqXiRdPVwiK3IrXCIqKD86XFxcIlxcXCJ8JycpXCIpLGEuaW5uZXJIVE1MPVwiPGlucHV0IHR5cGU9J2hpZGRlbic+XCIsYS5xdWVyeVNlbGVjdG9yQWxsKFwiOmVuYWJsZWRcIikubGVuZ3RofHxlLnB1c2goXCI6ZW5hYmxlZFwiLFwiOmRpc2FibGVkXCIpfSksZT1lLmxlbmd0aCYmbmV3IFJlZ0V4cChlLmpvaW4oXCJ8XCIpKSxibT1mdW5jdGlvbihhLGQsZixnLGgpe2lmKCFnJiYhaCYmKCFlfHwhZS50ZXN0KGEpKSlpZihkLm5vZGVUeXBlPT09OSl0cnl7cmV0dXJuIG8uYXBwbHkoZixuLmNhbGwoZC5xdWVyeVNlbGVjdG9yQWxsKGEpLDApKSxmfWNhdGNoKGkpe31lbHNlIGlmKGQubm9kZVR5cGU9PT0xJiZkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkhPT1cIm9iamVjdFwiKXt2YXIgaj1kLmdldEF0dHJpYnV0ZShcImlkXCIpLGs9anx8cSxsPUcudGVzdChhKSYmZC5wYXJlbnROb2RlfHxkO2o/az1rLnJlcGxhY2UoYyxcIlxcXFwkJlwiKTpkLnNldEF0dHJpYnV0ZShcImlkXCIsayk7dHJ5e3JldHVybiBvLmFwcGx5KGYsbi5jYWxsKGwucXVlcnlTZWxlY3RvckFsbChhLnJlcGxhY2UoQyxcIltpZD0nXCIraytcIiddICQmXCIpKSwwKSksZn1jYXRjaChpKXt9ZmluYWxseXtqfHxkLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpfX1yZXR1cm4gYihhLGQsZixnLGgpfSxnJiYoVChmdW5jdGlvbihiKXthPWcuY2FsbChiLFwiZGl2XCIpO3RyeXtnLmNhbGwoYixcIlt0ZXN0IT0nJ106c2l6emxlXCIpLGYucHVzaCgkLm1hdGNoLlBTRVVETyl9Y2F0Y2goYyl7fX0pLGY9bmV3IFJlZ0V4cChmLmpvaW4oXCJ8XCIpKSxaLm1hdGNoZXNTZWxlY3Rvcj1mdW5jdGlvbihiLGMpe2M9Yy5yZXBsYWNlKGQsXCI9JyQxJ11cIik7aWYoIWJhKGIpJiYhZi50ZXN0KGMpJiYoIWV8fCFlLnRlc3QoYykpKXRyeXt2YXIgaD1nLmNhbGwoYixjKTtpZihofHxhfHxiLmRvY3VtZW50JiZiLmRvY3VtZW50Lm5vZGVUeXBlIT09MTEpcmV0dXJuIGh9Y2F0Y2goaSl7fXJldHVybiBaKGMsbnVsbCxudWxsLFtiXSkubGVuZ3RoPjB9KX0oKSxaLmF0dHI9cC5hdHRyLHAuZmluZD1aLHAuZXhwcj1aLnNlbGVjdG9ycyxwLmV4cHJbXCI6XCJdPXAuZXhwci5wc2V1ZG9zLHAudW5pcXVlPVoudW5pcXVlU29ydCxwLnRleHQ9Wi5nZXRUZXh0LHAuaXNYTUxEb2M9Wi5pc1hNTCxwLmNvbnRhaW5zPVouY29udGFpbnN9KGEpO3ZhciBiYz0vVW50aWwkLyxiZD0vXig/OnBhcmVudHN8cHJldig/OlVudGlsfEFsbCkpLyxiZT0vXi5bXjojXFxbXFwuLF0qJC8sYmY9cC5leHByLm1hdGNoLm5lZWRzQ29udGV4dCxiZz17Y2hpbGRyZW46ITAsY29udGVudHM6ITAsbmV4dDohMCxwcmV2OiEwfTtwLmZuLmV4dGVuZCh7ZmluZDpmdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmLGcsaD10aGlzO2lmKHR5cGVvZiBhIT1cInN0cmluZ1wiKXJldHVybiBwKGEpLmZpbHRlcihmdW5jdGlvbigpe2ZvcihiPTAsYz1oLmxlbmd0aDtiPGM7YisrKWlmKHAuY29udGFpbnMoaFtiXSx0aGlzKSlyZXR1cm4hMH0pO2c9dGhpcy5wdXNoU3RhY2soXCJcIixcImZpbmRcIixhKTtmb3IoYj0wLGM9dGhpcy5sZW5ndGg7YjxjO2IrKyl7ZD1nLmxlbmd0aCxwLmZpbmQoYSx0aGlzW2JdLGcpO2lmKGI+MClmb3IoZT1kO2U8Zy5sZW5ndGg7ZSsrKWZvcihmPTA7ZjxkO2YrKylpZihnW2ZdPT09Z1tlXSl7Zy5zcGxpY2UoZS0tLDEpO2JyZWFrfX1yZXR1cm4gZ30saGFzOmZ1bmN0aW9uKGEpe3ZhciBiLGM9cChhLHRoaXMpLGQ9Yy5sZW5ndGg7cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKGI9MDtiPGQ7YisrKWlmKHAuY29udGFpbnModGhpcyxjW2JdKSlyZXR1cm4hMH0pfSxub3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGJqKHRoaXMsYSwhMSksXCJub3RcIixhKX0sZmlsdGVyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayhiaih0aGlzLGEsITApLFwiZmlsdGVyXCIsYSl9LGlzOmZ1bmN0aW9uKGEpe3JldHVybiEhYSYmKHR5cGVvZiBhPT1cInN0cmluZ1wiP2JmLnRlc3QoYSk/cChhLHRoaXMuY29udGV4dCkuaW5kZXgodGhpc1swXSk+PTA6cC5maWx0ZXIoYSx0aGlzKS5sZW5ndGg+MDp0aGlzLmZpbHRlcihhKS5sZW5ndGg+MCl9LGNsb3Nlc3Q6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPTAsZT10aGlzLmxlbmd0aCxmPVtdLGc9YmYudGVzdChhKXx8dHlwZW9mIGEhPVwic3RyaW5nXCI/cChhLGJ8fHRoaXMuY29udGV4dCk6MDtmb3IoO2Q8ZTtkKyspe2M9dGhpc1tkXTt3aGlsZShjJiZjLm93bmVyRG9jdW1lbnQmJmMhPT1iJiZjLm5vZGVUeXBlIT09MTEpe2lmKGc/Zy5pbmRleChjKT4tMTpwLmZpbmQubWF0Y2hlc1NlbGVjdG9yKGMsYSkpe2YucHVzaChjKTticmVha31jPWMucGFyZW50Tm9kZX19cmV0dXJuIGY9Zi5sZW5ndGg+MT9wLnVuaXF1ZShmKTpmLHRoaXMucHVzaFN0YWNrKGYsXCJjbG9zZXN0XCIsYSl9LGluZGV4OmZ1bmN0aW9uKGEpe3JldHVybiBhP3R5cGVvZiBhPT1cInN0cmluZ1wiP3AuaW5BcnJheSh0aGlzWzBdLHAoYSkpOnAuaW5BcnJheShhLmpxdWVyeT9hWzBdOmEsdGhpcyk6dGhpc1swXSYmdGhpc1swXS5wYXJlbnROb2RlP3RoaXMucHJldkFsbCgpLmxlbmd0aDotMX0sYWRkOmZ1bmN0aW9uKGEsYil7dmFyIGM9dHlwZW9mIGE9PVwic3RyaW5nXCI/cChhLGIpOnAubWFrZUFycmF5KGEmJmEubm9kZVR5cGU/W2FdOmEpLGQ9cC5tZXJnZSh0aGlzLmdldCgpLGMpO3JldHVybiB0aGlzLnB1c2hTdGFjayhiaChjWzBdKXx8YmgoZFswXSk/ZDpwLnVuaXF1ZShkKSl9LGFkZEJhY2s6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYWRkKGE9PW51bGw/dGhpcy5wcmV2T2JqZWN0OnRoaXMucHJldk9iamVjdC5maWx0ZXIoYSkpfX0pLHAuZm4uYW5kU2VsZj1wLmZuLmFkZEJhY2sscC5lYWNoKHtwYXJlbnQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5wYXJlbnROb2RlO3JldHVybiBiJiZiLm5vZGVUeXBlIT09MTE/YjpudWxsfSxwYXJlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBwLmRpcihhLFwicGFyZW50Tm9kZVwiKX0scGFyZW50c1VudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gcC5kaXIoYSxcInBhcmVudE5vZGVcIixjKX0sbmV4dDpmdW5jdGlvbihhKXtyZXR1cm4gYmkoYSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2OmZ1bmN0aW9uKGEpe3JldHVybiBiaShhLFwicHJldmlvdXNTaWJsaW5nXCIpfSxuZXh0QWxsOmZ1bmN0aW9uKGEpe3JldHVybiBwLmRpcihhLFwibmV4dFNpYmxpbmdcIil9LHByZXZBbGw6ZnVuY3Rpb24oYSl7cmV0dXJuIHAuZGlyKGEsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRVbnRpbDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIHAuZGlyKGEsXCJuZXh0U2libGluZ1wiLGMpfSxwcmV2VW50aWw6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBwLmRpcihhLFwicHJldmlvdXNTaWJsaW5nXCIsYyl9LHNpYmxpbmdzOmZ1bmN0aW9uKGEpe3JldHVybiBwLnNpYmxpbmcoKGEucGFyZW50Tm9kZXx8e30pLmZpcnN0Q2hpbGQsYSl9LGNoaWxkcmVuOmZ1bmN0aW9uKGEpe3JldHVybiBwLnNpYmxpbmcoYS5maXJzdENoaWxkKX0sY29udGVudHM6ZnVuY3Rpb24oYSl7cmV0dXJuIHAubm9kZU5hbWUoYSxcImlmcmFtZVwiKT9hLmNvbnRlbnREb2N1bWVudHx8YS5jb250ZW50V2luZG93LmRvY3VtZW50OnAubWVyZ2UoW10sYS5jaGlsZE5vZGVzKX19LGZ1bmN0aW9uKGEsYil7cC5mblthXT1mdW5jdGlvbihjLGQpe3ZhciBlPXAubWFwKHRoaXMsYixjKTtyZXR1cm4gYmMudGVzdChhKXx8KGQ9YyksZCYmdHlwZW9mIGQ9PVwic3RyaW5nXCImJihlPXAuZmlsdGVyKGQsZSkpLGU9dGhpcy5sZW5ndGg+MSYmIWJnW2FdP3AudW5pcXVlKGUpOmUsdGhpcy5sZW5ndGg+MSYmYmQudGVzdChhKSYmKGU9ZS5yZXZlcnNlKCkpLHRoaXMucHVzaFN0YWNrKGUsYSxrLmNhbGwoYXJndW1lbnRzKS5qb2luKFwiLFwiKSl9fSkscC5leHRlbmQoe2ZpbHRlcjpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGMmJihhPVwiOm5vdChcIithK1wiKVwiKSxiLmxlbmd0aD09PTE/cC5maW5kLm1hdGNoZXNTZWxlY3RvcihiWzBdLGEpP1tiWzBdXTpbXTpwLmZpbmQubWF0Y2hlcyhhLGIpfSxkaXI6ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPVtdLGY9YVtjXTt3aGlsZShmJiZmLm5vZGVUeXBlIT09OSYmKGQ9PT1ifHxmLm5vZGVUeXBlIT09MXx8IXAoZikuaXMoZCkpKWYubm9kZVR5cGU9PT0xJiZlLnB1c2goZiksZj1mW2NdO3JldHVybiBlfSxzaWJsaW5nOmZ1bmN0aW9uKGEsYil7dmFyIGM9W107Zm9yKDthO2E9YS5uZXh0U2libGluZylhLm5vZGVUeXBlPT09MSYmYSE9PWImJmMucHVzaChhKTtyZXR1cm4gY319KTt2YXIgYmw9XCJhYmJyfGFydGljbGV8YXNpZGV8YXVkaW98YmRpfGNhbnZhc3xkYXRhfGRhdGFsaXN0fGRldGFpbHN8ZmlnY2FwdGlvbnxmaWd1cmV8Zm9vdGVyfGhlYWRlcnxoZ3JvdXB8bWFya3xtZXRlcnxuYXZ8b3V0cHV0fHByb2dyZXNzfHNlY3Rpb258c3VtbWFyeXx0aW1lfHZpZGVvXCIsYm09LyBqUXVlcnlcXGQrPVwiKD86bnVsbHxcXGQrKVwiL2csYm49L15cXHMrLyxibz0vPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vZ2ksYnA9LzwoW1xcdzpdKykvLGJxPS88dGJvZHkvaSxicj0vPHwmIz9cXHcrOy8sYnM9LzwoPzpzY3JpcHR8c3R5bGV8bGluaykvaSxidD0vPCg/OnNjcmlwdHxvYmplY3R8ZW1iZWR8b3B0aW9ufHN0eWxlKS9pLGJ1PW5ldyBSZWdFeHAoXCI8KD86XCIrYmwrXCIpW1xcXFxzLz5dXCIsXCJpXCIpLGJ2PS9eKD86Y2hlY2tib3h8cmFkaW8pJC8sYnc9L2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxieD0vXFwvKGphdmF8ZWNtYSlzY3JpcHQvaSxieT0vXlxccyo8ISg/OlxcW0NEQVRBXFxbfFxcLVxcLSl8W1xcXVxcLV17Mn0+XFxzKiQvZyxiej17b3B0aW9uOlsxLFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLFwiPC9zZWxlY3Q+XCJdLGxlZ2VuZDpbMSxcIjxmaWVsZHNldD5cIixcIjwvZmllbGRzZXQ+XCJdLHRoZWFkOlsxLFwiPHRhYmxlPlwiLFwiPC90YWJsZT5cIl0sdHI6WzIsXCI8dGFibGU+PHRib2R5PlwiLFwiPC90Ym9keT48L3RhYmxlPlwiXSx0ZDpbMyxcIjx0YWJsZT48dGJvZHk+PHRyPlwiLFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdLGNvbDpbMixcIjx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+XCIsXCI8L2NvbGdyb3VwPjwvdGFibGU+XCJdLGFyZWE6WzEsXCI8bWFwPlwiLFwiPC9tYXA+XCJdLF9kZWZhdWx0OlswLFwiXCIsXCJcIl19LGJBPWJrKGUpLGJCPWJBLmFwcGVuZENoaWxkKGUuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7Ynoub3B0Z3JvdXA9Ynoub3B0aW9uLGJ6LnRib2R5PWJ6LnRmb290PWJ6LmNvbGdyb3VwPWJ6LmNhcHRpb249YnoudGhlYWQsYnoudGg9YnoudGQscC5zdXBwb3J0Lmh0bWxTZXJpYWxpemV8fChiei5fZGVmYXVsdD1bMSxcIlg8ZGl2PlwiLFwiPC9kaXY+XCJdKSxwLmZuLmV4dGVuZCh7dGV4dDpmdW5jdGlvbihhKXtyZXR1cm4gcC5hY2Nlc3ModGhpcyxmdW5jdGlvbihhKXtyZXR1cm4gYT09PWI/cC50ZXh0KHRoaXMpOnRoaXMuZW1wdHkoKS5hcHBlbmQoKHRoaXNbMF0mJnRoaXNbMF0ub3duZXJEb2N1bWVudHx8ZSkuY3JlYXRlVGV4dE5vZGUoYSkpfSxudWxsLGEsYXJndW1lbnRzLmxlbmd0aCl9LHdyYXBBbGw6ZnVuY3Rpb24oYSl7aWYocC5pc0Z1bmN0aW9uKGEpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oYil7cCh0aGlzKS53cmFwQWxsKGEuY2FsbCh0aGlzLGIpKX0pO2lmKHRoaXNbMF0pe3ZhciBiPXAoYSx0aGlzWzBdLm93bmVyRG9jdW1lbnQpLmVxKDApLmNsb25lKCEwKTt0aGlzWzBdLnBhcmVudE5vZGUmJmIuaW5zZXJ0QmVmb3JlKHRoaXNbMF0pLGIubWFwKGZ1bmN0aW9uKCl7dmFyIGE9dGhpczt3aGlsZShhLmZpcnN0Q2hpbGQmJmEuZmlyc3RDaGlsZC5ub2RlVHlwZT09PTEpYT1hLmZpcnN0Q2hpbGQ7cmV0dXJuIGF9KS5hcHBlbmQodGhpcyl9cmV0dXJuIHRoaXN9LHdyYXBJbm5lcjpmdW5jdGlvbihhKXtyZXR1cm4gcC5pc0Z1bmN0aW9uKGEpP3RoaXMuZWFjaChmdW5jdGlvbihiKXtwKHRoaXMpLndyYXBJbm5lcihhLmNhbGwodGhpcyxiKSl9KTp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYj1wKHRoaXMpLGM9Yi5jb250ZW50cygpO2MubGVuZ3RoP2Mud3JhcEFsbChhKTpiLmFwcGVuZChhKX0pfSx3cmFwOmZ1bmN0aW9uKGEpe3ZhciBiPXAuaXNGdW5jdGlvbihhKTtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe3AodGhpcykud3JhcEFsbChiP2EuY2FsbCh0aGlzLGMpOmEpfSl9LHVud3JhcDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudCgpLmVhY2goZnVuY3Rpb24oKXtwLm5vZGVOYW1lKHRoaXMsXCJib2R5XCIpfHxwKHRoaXMpLnJlcGxhY2VXaXRoKHRoaXMuY2hpbGROb2Rlcyl9KS5lbmQoKX0sYXBwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCEwLGZ1bmN0aW9uKGEpeyh0aGlzLm5vZGVUeXBlPT09MXx8dGhpcy5ub2RlVHlwZT09PTExKSYmdGhpcy5hcHBlbmRDaGlsZChhKX0pfSxwcmVwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLCEwLGZ1bmN0aW9uKGEpeyh0aGlzLm5vZGVUeXBlPT09MXx8dGhpcy5ub2RlVHlwZT09PTExKSYmdGhpcy5pbnNlcnRCZWZvcmUoYSx0aGlzLmZpcnN0Q2hpbGQpfSl9LGJlZm9yZTpmdW5jdGlvbigpe2lmKCFiaCh0aGlzWzBdKSlyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsITEsZnVuY3Rpb24oYSl7dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShhLHRoaXMpfSk7aWYoYXJndW1lbnRzLmxlbmd0aCl7dmFyIGE9cC5jbGVhbihhcmd1bWVudHMpO3JldHVybiB0aGlzLnB1c2hTdGFjayhwLm1lcmdlKGEsdGhpcyksXCJiZWZvcmVcIix0aGlzLnNlbGVjdG9yKX19LGFmdGVyOmZ1bmN0aW9uKCl7aWYoIWJoKHRoaXNbMF0pKXJldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cywhMSxmdW5jdGlvbihhKXt0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsdGhpcy5uZXh0U2libGluZyl9KTtpZihhcmd1bWVudHMubGVuZ3RoKXt2YXIgYT1wLmNsZWFuKGFyZ3VtZW50cyk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKHAubWVyZ2UodGhpcyxhKSxcImFmdGVyXCIsdGhpcy5zZWxlY3Rvcil9fSxyZW1vdmU6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPTA7Zm9yKDsoYz10aGlzW2RdKSE9bnVsbDtkKyspaWYoIWF8fHAuZmlsdGVyKGEsW2NdKS5sZW5ndGgpIWImJmMubm9kZVR5cGU9PT0xJiYocC5jbGVhbkRhdGEoYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikpLHAuY2xlYW5EYXRhKFtjXSkpLGMucGFyZW50Tm9kZSYmYy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGMpO3JldHVybiB0aGlzfSxlbXB0eTpmdW5jdGlvbigpe3ZhciBhLGI9MDtmb3IoOyhhPXRoaXNbYl0pIT1udWxsO2IrKyl7YS5ub2RlVHlwZT09PTEmJnAuY2xlYW5EYXRhKGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpKTt3aGlsZShhLmZpcnN0Q2hpbGQpYS5yZW1vdmVDaGlsZChhLmZpcnN0Q2hpbGQpfXJldHVybiB0aGlzfSxjbG9uZTpmdW5jdGlvbihhLGIpe3JldHVybiBhPWE9PW51bGw/ITE6YSxiPWI9PW51bGw/YTpiLHRoaXMubWFwKGZ1bmN0aW9uKCl7cmV0dXJuIHAuY2xvbmUodGhpcyxhLGIpfSl9LGh0bWw6ZnVuY3Rpb24oYSl7cmV0dXJuIHAuYWNjZXNzKHRoaXMsZnVuY3Rpb24oYSl7dmFyIGM9dGhpc1swXXx8e30sZD0wLGU9dGhpcy5sZW5ndGg7aWYoYT09PWIpcmV0dXJuIGMubm9kZVR5cGU9PT0xP2MuaW5uZXJIVE1MLnJlcGxhY2UoYm0sXCJcIik6YjtpZih0eXBlb2YgYT09XCJzdHJpbmdcIiYmIWJzLnRlc3QoYSkmJihwLnN1cHBvcnQuaHRtbFNlcmlhbGl6ZXx8IWJ1LnRlc3QoYSkpJiYocC5zdXBwb3J0LmxlYWRpbmdXaGl0ZXNwYWNlfHwhYm4udGVzdChhKSkmJiFielsoYnAuZXhlYyhhKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCldKXthPWEucmVwbGFjZShibyxcIjwkMT48LyQyPlwiKTt0cnl7Zm9yKDtkPGU7ZCsrKWM9dGhpc1tkXXx8e30sYy5ub2RlVHlwZT09PTEmJihwLmNsZWFuRGF0YShjLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSksYy5pbm5lckhUTUw9YSk7Yz0wfWNhdGNoKGYpe319YyYmdGhpcy5lbXB0eSgpLmFwcGVuZChhKX0sbnVsbCxhLGFyZ3VtZW50cy5sZW5ndGgpfSxyZXBsYWNlV2l0aDpmdW5jdGlvbihhKXtyZXR1cm4gYmgodGhpc1swXSk/dGhpcy5sZW5ndGg/dGhpcy5wdXNoU3RhY2socChwLmlzRnVuY3Rpb24oYSk/YSgpOmEpLFwicmVwbGFjZVdpdGhcIixhKTp0aGlzOnAuaXNGdW5jdGlvbihhKT90aGlzLmVhY2goZnVuY3Rpb24oYil7dmFyIGM9cCh0aGlzKSxkPWMuaHRtbCgpO2MucmVwbGFjZVdpdGgoYS5jYWxsKHRoaXMsYixkKSl9KToodHlwZW9mIGEhPVwic3RyaW5nXCImJihhPXAoYSkuZGV0YWNoKCkpLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPXRoaXMubmV4dFNpYmxpbmcsYz10aGlzLnBhcmVudE5vZGU7cCh0aGlzKS5yZW1vdmUoKSxiP3AoYikuYmVmb3JlKGEpOnAoYykuYXBwZW5kKGEpfSkpfSxkZXRhY2g6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucmVtb3ZlKGEsITApfSxkb21NYW5pcDpmdW5jdGlvbihhLGMsZCl7YT1bXS5jb25jYXQuYXBwbHkoW10sYSk7dmFyIGUsZixnLGgsaT0wLGo9YVswXSxrPVtdLGw9dGhpcy5sZW5ndGg7aWYoIXAuc3VwcG9ydC5jaGVja0Nsb25lJiZsPjEmJnR5cGVvZiBqPT1cInN0cmluZ1wiJiZidy50ZXN0KGopKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtwKHRoaXMpLmRvbU1hbmlwKGEsYyxkKX0pO2lmKHAuaXNGdW5jdGlvbihqKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGUpe3ZhciBmPXAodGhpcyk7YVswXT1qLmNhbGwodGhpcyxlLGM/Zi5odG1sKCk6YiksZi5kb21NYW5pcChhLGMsZCl9KTtpZih0aGlzWzBdKXtlPXAuYnVpbGRGcmFnbWVudChhLHRoaXMsayksZz1lLmZyYWdtZW50LGY9Zy5maXJzdENoaWxkLGcuY2hpbGROb2Rlcy5sZW5ndGg9PT0xJiYoZz1mKTtpZihmKXtjPWMmJnAubm9kZU5hbWUoZixcInRyXCIpO2ZvcihoPWUuY2FjaGVhYmxlfHxsLTE7aTxsO2krKylkLmNhbGwoYyYmcC5ub2RlTmFtZSh0aGlzW2ldLFwidGFibGVcIik/YkModGhpc1tpXSxcInRib2R5XCIpOnRoaXNbaV0saT09PWg/ZzpwLmNsb25lKGcsITAsITApKX1nPWY9bnVsbCxrLmxlbmd0aCYmcC5lYWNoKGssZnVuY3Rpb24oYSxiKXtiLnNyYz9wLmFqYXg/cC5hamF4KHt1cmw6Yi5zcmMsdHlwZTpcIkdFVFwiLGRhdGFUeXBlOlwic2NyaXB0XCIsYXN5bmM6ITEsZ2xvYmFsOiExLFwidGhyb3dzXCI6ITB9KTpwLmVycm9yKFwibm8gYWpheFwiKTpwLmdsb2JhbEV2YWwoKGIudGV4dHx8Yi50ZXh0Q29udGVudHx8Yi5pbm5lckhUTUx8fFwiXCIpLnJlcGxhY2UoYnksXCJcIikpLGIucGFyZW50Tm9kZSYmYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpfSl9cmV0dXJuIHRoaXN9fSkscC5idWlsZEZyYWdtZW50PWZ1bmN0aW9uKGEsYyxkKXt2YXIgZixnLGgsaT1hWzBdO3JldHVybiBjPWN8fGUsYz0oY1swXXx8Yykub3duZXJEb2N1bWVudHx8Y1swXXx8Yyx0eXBlb2YgYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50PT1cInVuZGVmaW5lZFwiJiYoYz1lKSxhLmxlbmd0aD09PTEmJnR5cGVvZiBpPT1cInN0cmluZ1wiJiZpLmxlbmd0aDw1MTImJmM9PT1lJiZpLmNoYXJBdCgwKT09PVwiPFwiJiYhYnQudGVzdChpKSYmKHAuc3VwcG9ydC5jaGVja0Nsb25lfHwhYncudGVzdChpKSkmJihwLnN1cHBvcnQuaHRtbDVDbG9uZXx8IWJ1LnRlc3QoaSkpJiYoZz0hMCxmPXAuZnJhZ21lbnRzW2ldLGg9ZiE9PWIpLGZ8fChmPWMuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLHAuY2xlYW4oYSxjLGYsZCksZyYmKHAuZnJhZ21lbnRzW2ldPWgmJmYpKSx7ZnJhZ21lbnQ6ZixjYWNoZWFibGU6Z319LHAuZnJhZ21lbnRzPXt9LHAuZWFjaCh7YXBwZW5kVG86XCJhcHBlbmRcIixwcmVwZW5kVG86XCJwcmVwZW5kXCIsaW5zZXJ0QmVmb3JlOlwiYmVmb3JlXCIsaW5zZXJ0QWZ0ZXI6XCJhZnRlclwiLHJlcGxhY2VBbGw6XCJyZXBsYWNlV2l0aFwifSxmdW5jdGlvbihhLGIpe3AuZm5bYV09ZnVuY3Rpb24oYyl7dmFyIGQsZT0wLGY9W10sZz1wKGMpLGg9Zy5sZW5ndGgsaT10aGlzLmxlbmd0aD09PTEmJnRoaXNbMF0ucGFyZW50Tm9kZTtpZigoaT09bnVsbHx8aSYmaS5ub2RlVHlwZT09PTExJiZpLmNoaWxkTm9kZXMubGVuZ3RoPT09MSkmJmg9PT0xKXJldHVybiBnW2JdKHRoaXNbMF0pLHRoaXM7Zm9yKDtlPGg7ZSsrKWQ9KGU+MD90aGlzLmNsb25lKCEwKTp0aGlzKS5nZXQoKSxwKGdbZV0pW2JdKGQpLGY9Zi5jb25jYXQoZCk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGYsYSxnLnNlbGVjdG9yKX19KSxwLmV4dGVuZCh7Y2xvbmU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnO3Auc3VwcG9ydC5odG1sNUNsb25lfHxwLmlzWE1MRG9jKGEpfHwhYnUudGVzdChcIjxcIithLm5vZGVOYW1lK1wiPlwiKT9nPWEuY2xvbmVOb2RlKCEwKTooYkIuaW5uZXJIVE1MPWEub3V0ZXJIVE1MLGJCLnJlbW92ZUNoaWxkKGc9YkIuZmlyc3RDaGlsZCkpO2lmKCghcC5zdXBwb3J0Lm5vQ2xvbmVFdmVudHx8IXAuc3VwcG9ydC5ub0Nsb25lQ2hlY2tlZCkmJihhLm5vZGVUeXBlPT09MXx8YS5ub2RlVHlwZT09PTExKSYmIXAuaXNYTUxEb2MoYSkpe2JFKGEsZyksZD1iRihhKSxlPWJGKGcpO2ZvcihmPTA7ZFtmXTsrK2YpZVtmXSYmYkUoZFtmXSxlW2ZdKX1pZihiKXtiRChhLGcpO2lmKGMpe2Q9YkYoYSksZT1iRihnKTtmb3IoZj0wO2RbZl07KytmKWJEKGRbZl0sZVtmXSl9fXJldHVybiBkPWU9bnVsbCxnfSxjbGVhbjpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZixnLGgsaSxqLGssbCxtLG4sbyxxLHIscz0wLHQ9W107aWYoIWJ8fHR5cGVvZiBiLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQ9PVwidW5kZWZpbmVkXCIpYj1lO2ZvcihnPWI9PT1lJiZiQTsoaD1hW3NdKSE9bnVsbDtzKyspe3R5cGVvZiBoPT1cIm51bWJlclwiJiYoaCs9XCJcIik7aWYoIWgpY29udGludWU7aWYodHlwZW9mIGg9PVwic3RyaW5nXCIpaWYoIWJyLnRlc3QoaCkpaD1iLmNyZWF0ZVRleHROb2RlKGgpO2Vsc2V7Zz1nfHxiayhiKSxsPWx8fGcuYXBwZW5kQ2hpbGQoYi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxoPWgucmVwbGFjZShibyxcIjwkMT48LyQyPlwiKSxpPShicC5leGVjKGgpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKSxqPWJ6W2ldfHxiei5fZGVmYXVsdCxrPWpbMF0sbC5pbm5lckhUTUw9alsxXStoK2pbMl07d2hpbGUoay0tKWw9bC5sYXN0Q2hpbGQ7aWYoIXAuc3VwcG9ydC50Ym9keSl7bT1icS50ZXN0KGgpLG49aT09PVwidGFibGVcIiYmIW0/bC5maXJzdENoaWxkJiZsLmZpcnN0Q2hpbGQuY2hpbGROb2RlczpqWzFdPT09XCI8dGFibGU+XCImJiFtP2wuY2hpbGROb2RlczpbXTtmb3IoZj1uLmxlbmd0aC0xO2Y+PTA7LS1mKXAubm9kZU5hbWUobltmXSxcInRib2R5XCIpJiYhbltmXS5jaGlsZE5vZGVzLmxlbmd0aCYmbltmXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5bZl0pfSFwLnN1cHBvcnQubGVhZGluZ1doaXRlc3BhY2UmJmJuLnRlc3QoaCkmJmwuaW5zZXJ0QmVmb3JlKGIuY3JlYXRlVGV4dE5vZGUoYm4uZXhlYyhoKVswXSksbC5maXJzdENoaWxkKSxoPWwuY2hpbGROb2RlcyxsPWcubGFzdENoaWxkfWgubm9kZVR5cGU/dC5wdXNoKGgpOnQ9cC5tZXJnZSh0LGgpfWwmJihnLnJlbW92ZUNoaWxkKGwpLGg9bD1nPW51bGwpO2lmKCFwLnN1cHBvcnQuYXBwZW5kQ2hlY2tlZClmb3Iocz0wOyhoPXRbc10pIT1udWxsO3MrKylwLm5vZGVOYW1lKGgsXCJpbnB1dFwiKT9iRyhoKTp0eXBlb2YgaC5nZXRFbGVtZW50c0J5VGFnTmFtZSE9XCJ1bmRlZmluZWRcIiYmcC5ncmVwKGguZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSxiRyk7aWYoYyl7cT1mdW5jdGlvbihhKXtpZighYS50eXBlfHxieC50ZXN0KGEudHlwZSkpcmV0dXJuIGQ/ZC5wdXNoKGEucGFyZW50Tm9kZT9hLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSk6YSk6Yy5hcHBlbmRDaGlsZChhKX07Zm9yKHM9MDsoaD10W3NdKSE9bnVsbDtzKyspaWYoIXAubm9kZU5hbWUoaCxcInNjcmlwdFwiKXx8IXEoaCkpYy5hcHBlbmRDaGlsZChoKSx0eXBlb2YgaC5nZXRFbGVtZW50c0J5VGFnTmFtZSE9XCJ1bmRlZmluZWRcIiYmKHI9cC5ncmVwKHAubWVyZ2UoW10saC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSkscSksdC5zcGxpY2UuYXBwbHkodCxbcysxLDBdLmNvbmNhdChyKSkscys9ci5sZW5ndGgpfXJldHVybiB0fSxjbGVhbkRhdGE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnPTAsaD1wLmV4cGFuZG8saT1wLmNhY2hlLGo9cC5zdXBwb3J0LmRlbGV0ZUV4cGFuZG8saz1wLmV2ZW50LnNwZWNpYWw7Zm9yKDsoZT1hW2ddKSE9bnVsbDtnKyspaWYoYnx8cC5hY2NlcHREYXRhKGUpKXtkPWVbaF0sYz1kJiZpW2RdO2lmKGMpe2lmKGMuZXZlbnRzKWZvcihmIGluIGMuZXZlbnRzKWtbZl0/cC5ldmVudC5yZW1vdmUoZSxmKTpwLnJlbW92ZUV2ZW50KGUsZixjLmhhbmRsZSk7aVtkXSYmKGRlbGV0ZSBpW2RdLGo/ZGVsZXRlIGVbaF06ZS5yZW1vdmVBdHRyaWJ1dGU/ZS5yZW1vdmVBdHRyaWJ1dGUoaCk6ZVtoXT1udWxsLHAuZGVsZXRlZElkcy5wdXNoKGQpKX19fX0pLGZ1bmN0aW9uKCl7dmFyIGEsYjtwLnVhTWF0Y2g9ZnVuY3Rpb24oYSl7YT1hLnRvTG93ZXJDYXNlKCk7dmFyIGI9LyhjaHJvbWUpWyBcXC9dKFtcXHcuXSspLy5leGVjKGEpfHwvKHdlYmtpdClbIFxcL10oW1xcdy5dKykvLmV4ZWMoYSl8fC8ob3BlcmEpKD86Lip2ZXJzaW9ufClbIFxcL10oW1xcdy5dKykvLmV4ZWMoYSl8fC8obXNpZSkgKFtcXHcuXSspLy5leGVjKGEpfHxhLmluZGV4T2YoXCJjb21wYXRpYmxlXCIpPDAmJi8obW96aWxsYSkoPzouKj8gcnY6KFtcXHcuXSspfCkvLmV4ZWMoYSl8fFtdO3JldHVybnticm93c2VyOmJbMV18fFwiXCIsdmVyc2lvbjpiWzJdfHxcIjBcIn19LGE9cC51YU1hdGNoKGcudXNlckFnZW50KSxiPXt9LGEuYnJvd3NlciYmKGJbYS5icm93c2VyXT0hMCxiLnZlcnNpb249YS52ZXJzaW9uKSxiLndlYmtpdCYmKGIuc2FmYXJpPSEwKSxwLmJyb3dzZXI9YixwLnN1Yj1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoYixjKXtyZXR1cm4gbmV3IGEuZm4uaW5pdChiLGMpfXAuZXh0ZW5kKCEwLGEsdGhpcyksYS5zdXBlcmNsYXNzPXRoaXMsYS5mbj1hLnByb3RvdHlwZT10aGlzKCksYS5mbi5jb25zdHJ1Y3Rvcj1hLGEuc3ViPXRoaXMuc3ViLGEuZm4uaW5pdD1mdW5jdGlvbiBjKGMsZCl7cmV0dXJuIGQmJmQgaW5zdGFuY2VvZiBwJiYhKGQgaW5zdGFuY2VvZiBhKSYmKGQ9YShkKSkscC5mbi5pbml0LmNhbGwodGhpcyxjLGQsYil9LGEuZm4uaW5pdC5wcm90b3R5cGU9YS5mbjt2YXIgYj1hKGUpO3JldHVybiBhfX0oKTt2YXIgYkgsYkksYkosYks9L2FscGhhXFwoW14pXSpcXCkvaSxiTD0vb3BhY2l0eT0oW14pXSopLyxiTT0vXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC8sYk49L15tYXJnaW4vLGJPPW5ldyBSZWdFeHAoXCJeKFwiK3ErXCIpKC4qKSRcIixcImlcIiksYlA9bmV3IFJlZ0V4cChcIl4oXCIrcStcIikoPyFweClbYS16JV0rJFwiLFwiaVwiKSxiUT1uZXcgUmVnRXhwKFwiXihbLStdKT0oXCIrcStcIilcIixcImlcIiksYlI9e30sYlM9e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCIsZGlzcGxheTpcImJsb2NrXCJ9LGJUPXtsZXR0ZXJTcGFjaW5nOjAsZm9udFdlaWdodDo0MDAsbGluZUhlaWdodDoxfSxiVT1bXCJUb3BcIixcIlJpZ2h0XCIsXCJCb3R0b21cIixcIkxlZnRcIl0sYlY9W1wiV2Via2l0XCIsXCJPXCIsXCJNb3pcIixcIm1zXCJdLGJXPXAuZm4udG9nZ2xlO3AuZm4uZXh0ZW5kKHtjc3M6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gcC5hY2Nlc3ModGhpcyxmdW5jdGlvbihhLGMsZCl7cmV0dXJuIGQhPT1iP3Auc3R5bGUoYSxjLGQpOnAuY3NzKGEsYyl9LGEsYyxhcmd1bWVudHMubGVuZ3RoPjEpfSxzaG93OmZ1bmN0aW9uKCl7cmV0dXJuIGJaKHRoaXMsITApfSxoaWRlOmZ1bmN0aW9uKCl7cmV0dXJuIGJaKHRoaXMpfSx0b2dnbGU6ZnVuY3Rpb24oYSxiKXt2YXIgYz10eXBlb2YgYT09XCJib29sZWFuXCI7cmV0dXJuIHAuaXNGdW5jdGlvbihhKSYmcC5pc0Z1bmN0aW9uKGIpP2JXLmFwcGx5KHRoaXMsYXJndW1lbnRzKTp0aGlzLmVhY2goZnVuY3Rpb24oKXsoYz9hOmJZKHRoaXMpKT9wKHRoaXMpLnNob3coKTpwKHRoaXMpLmhpZGUoKX0pfX0pLHAuZXh0ZW5kKHtjc3NIb29rczp7b3BhY2l0eTp7Z2V0OmZ1bmN0aW9uKGEsYil7aWYoYil7dmFyIGM9YkgoYSxcIm9wYWNpdHlcIik7cmV0dXJuIGM9PT1cIlwiP1wiMVwiOmN9fX19LGNzc051bWJlcjp7ZmlsbE9wYWNpdHk6ITAsZm9udFdlaWdodDohMCxsaW5lSGVpZ2h0OiEwLG9wYWNpdHk6ITAsb3JwaGFuczohMCx3aWRvd3M6ITAsekluZGV4OiEwLHpvb206ITB9LGNzc1Byb3BzOntcImZsb2F0XCI6cC5zdXBwb3J0LmNzc0Zsb2F0P1wiY3NzRmxvYXRcIjpcInN0eWxlRmxvYXRcIn0sc3R5bGU6ZnVuY3Rpb24oYSxjLGQsZSl7aWYoIWF8fGEubm9kZVR5cGU9PT0zfHxhLm5vZGVUeXBlPT09OHx8IWEuc3R5bGUpcmV0dXJuO3ZhciBmLGcsaCxpPXAuY2FtZWxDYXNlKGMpLGo9YS5zdHlsZTtjPXAuY3NzUHJvcHNbaV18fChwLmNzc1Byb3BzW2ldPWJYKGosaSkpLGg9cC5jc3NIb29rc1tjXXx8cC5jc3NIb29rc1tpXTtpZihkPT09YilyZXR1cm4gaCYmXCJnZXRcImluIGgmJihmPWguZ2V0KGEsITEsZSkpIT09Yj9mOmpbY107Zz10eXBlb2YgZCxnPT09XCJzdHJpbmdcIiYmKGY9YlEuZXhlYyhkKSkmJihkPShmWzFdKzEpKmZbMl0rcGFyc2VGbG9hdChwLmNzcyhhLGMpKSxnPVwibnVtYmVyXCIpO2lmKGQ9PW51bGx8fGc9PT1cIm51bWJlclwiJiZpc05hTihkKSlyZXR1cm47Zz09PVwibnVtYmVyXCImJiFwLmNzc051bWJlcltpXSYmKGQrPVwicHhcIik7aWYoIWh8fCEoXCJzZXRcImluIGgpfHwoZD1oLnNldChhLGQsZSkpIT09Yil0cnl7altjXT1kfWNhdGNoKGspe319LGNzczpmdW5jdGlvbihhLGMsZCxlKXt2YXIgZixnLGgsaT1wLmNhbWVsQ2FzZShjKTtyZXR1cm4gYz1wLmNzc1Byb3BzW2ldfHwocC5jc3NQcm9wc1tpXT1iWChhLnN0eWxlLGkpKSxoPXAuY3NzSG9va3NbY118fHAuY3NzSG9va3NbaV0saCYmXCJnZXRcImluIGgmJihmPWguZ2V0KGEsITAsZSkpLGY9PT1iJiYoZj1iSChhLGMpKSxmPT09XCJub3JtYWxcIiYmYyBpbiBiVCYmKGY9YlRbY10pLGR8fGUhPT1iPyhnPXBhcnNlRmxvYXQoZiksZHx8cC5pc051bWVyaWMoZyk/Z3x8MDpmKTpmfSxzd2FwOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGY9e307Zm9yKGUgaW4gYilmW2VdPWEuc3R5bGVbZV0sYS5zdHlsZVtlXT1iW2VdO2Q9Yy5jYWxsKGEpO2ZvcihlIGluIGIpYS5zdHlsZVtlXT1mW2VdO3JldHVybiBkfX0pLGEuZ2V0Q29tcHV0ZWRTdHlsZT9iSD1mdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGc9Z2V0Q29tcHV0ZWRTdHlsZShhLG51bGwpLGg9YS5zdHlsZTtyZXR1cm4gZyYmKGM9Z1tiXSxjPT09XCJcIiYmIXAuY29udGFpbnMoYS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxhKSYmKGM9cC5zdHlsZShhLGIpKSxiUC50ZXN0KGMpJiZiTi50ZXN0KGIpJiYoZD1oLndpZHRoLGU9aC5taW5XaWR0aCxmPWgubWF4V2lkdGgsaC5taW5XaWR0aD1oLm1heFdpZHRoPWgud2lkdGg9YyxjPWcud2lkdGgsaC53aWR0aD1kLGgubWluV2lkdGg9ZSxoLm1heFdpZHRoPWYpKSxjfTplLmRvY3VtZW50RWxlbWVudC5jdXJyZW50U3R5bGUmJihiSD1mdW5jdGlvbihhLGIpe3ZhciBjLGQsZT1hLmN1cnJlbnRTdHlsZSYmYS5jdXJyZW50U3R5bGVbYl0sZj1hLnN0eWxlO3JldHVybiBlPT1udWxsJiZmJiZmW2JdJiYoZT1mW2JdKSxiUC50ZXN0KGUpJiYhYk0udGVzdChiKSYmKGM9Zi5sZWZ0LGQ9YS5ydW50aW1lU3R5bGUmJmEucnVudGltZVN0eWxlLmxlZnQsZCYmKGEucnVudGltZVN0eWxlLmxlZnQ9YS5jdXJyZW50U3R5bGUubGVmdCksZi5sZWZ0PWI9PT1cImZvbnRTaXplXCI/XCIxZW1cIjplLGU9Zi5waXhlbExlZnQrXCJweFwiLGYubGVmdD1jLGQmJihhLnJ1bnRpbWVTdHlsZS5sZWZ0PWQpKSxlPT09XCJcIj9cImF1dG9cIjplfSkscC5lYWNoKFtcImhlaWdodFwiLFwid2lkdGhcIl0sZnVuY3Rpb24oYSxiKXtwLmNzc0hvb2tzW2JdPXtnZXQ6ZnVuY3Rpb24oYSxjLGQpe2lmKGMpcmV0dXJuIGEub2Zmc2V0V2lkdGghPT0wfHxiSChhLFwiZGlzcGxheVwiKSE9PVwibm9uZVwiP2NhKGEsYixkKTpwLnN3YXAoYSxiUyxmdW5jdGlvbigpe3JldHVybiBjYShhLGIsZCl9KX0sc2V0OmZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gYiQoYSxjLGQ/Yl8oYSxiLGQscC5zdXBwb3J0LmJveFNpemluZyYmcC5jc3MoYSxcImJveFNpemluZ1wiKT09PVwiYm9yZGVyLWJveFwiKTowKX19fSkscC5zdXBwb3J0Lm9wYWNpdHl8fChwLmNzc0hvb2tzLm9wYWNpdHk9e2dldDpmdW5jdGlvbihhLGIpe3JldHVybiBiTC50ZXN0KChiJiZhLmN1cnJlbnRTdHlsZT9hLmN1cnJlbnRTdHlsZS5maWx0ZXI6YS5zdHlsZS5maWx0ZXIpfHxcIlwiKT8uMDEqcGFyc2VGbG9hdChSZWdFeHAuJDEpK1wiXCI6Yj9cIjFcIjpcIlwifSxzZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnN0eWxlLGQ9YS5jdXJyZW50U3R5bGUsZT1wLmlzTnVtZXJpYyhiKT9cImFscGhhKG9wYWNpdHk9XCIrYioxMDArXCIpXCI6XCJcIixmPWQmJmQuZmlsdGVyfHxjLmZpbHRlcnx8XCJcIjtjLnpvb209MTtpZihiPj0xJiZwLnRyaW0oZi5yZXBsYWNlKGJLLFwiXCIpKT09PVwiXCImJmMucmVtb3ZlQXR0cmlidXRlKXtjLnJlbW92ZUF0dHJpYnV0ZShcImZpbHRlclwiKTtpZihkJiYhZC5maWx0ZXIpcmV0dXJufWMuZmlsdGVyPWJLLnRlc3QoZik/Zi5yZXBsYWNlKGJLLGUpOmYrXCIgXCIrZX19KSxwKGZ1bmN0aW9uKCl7cC5zdXBwb3J0LnJlbGlhYmxlTWFyZ2luUmlnaHR8fChwLmNzc0hvb2tzLm1hcmdpblJpZ2h0PXtnZXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gcC5zd2FwKGEse2Rpc3BsYXk6XCJpbmxpbmUtYmxvY2tcIn0sZnVuY3Rpb24oKXtpZihiKXJldHVybiBiSChhLFwibWFyZ2luUmlnaHRcIil9KX19KSwhcC5zdXBwb3J0LnBpeGVsUG9zaXRpb24mJnAuZm4ucG9zaXRpb24mJnAuZWFjaChbXCJ0b3BcIixcImxlZnRcIl0sZnVuY3Rpb24oYSxiKXtwLmNzc0hvb2tzW2JdPXtnZXQ6ZnVuY3Rpb24oYSxjKXtpZihjKXt2YXIgZD1iSChhLGIpO3JldHVybiBiUC50ZXN0KGQpP3AoYSkucG9zaXRpb24oKVtiXStcInB4XCI6ZH19fX0pfSkscC5leHByJiZwLmV4cHIuZmlsdGVycyYmKHAuZXhwci5maWx0ZXJzLmhpZGRlbj1mdW5jdGlvbihhKXtyZXR1cm4gYS5vZmZzZXRXaWR0aD09PTAmJmEub2Zmc2V0SGVpZ2h0PT09MHx8IXAuc3VwcG9ydC5yZWxpYWJsZUhpZGRlbk9mZnNldHMmJihhLnN0eWxlJiZhLnN0eWxlLmRpc3BsYXl8fGJIKGEsXCJkaXNwbGF5XCIpKT09PVwibm9uZVwifSxwLmV4cHIuZmlsdGVycy52aXNpYmxlPWZ1bmN0aW9uKGEpe3JldHVybiFwLmV4cHIuZmlsdGVycy5oaWRkZW4oYSl9KSxwLmVhY2goe21hcmdpbjpcIlwiLHBhZGRpbmc6XCJcIixib3JkZXI6XCJXaWR0aFwifSxmdW5jdGlvbihhLGIpe3AuY3NzSG9va3NbYStiXT17ZXhwYW5kOmZ1bmN0aW9uKGMpe3ZhciBkLGU9dHlwZW9mIGM9PVwic3RyaW5nXCI/Yy5zcGxpdChcIiBcIik6W2NdLGY9e307Zm9yKGQ9MDtkPDQ7ZCsrKWZbYStiVVtkXStiXT1lW2RdfHxlW2QtMl18fGVbMF07cmV0dXJuIGZ9fSxiTi50ZXN0KGEpfHwocC5jc3NIb29rc1thK2JdLnNldD1iJCl9KTt2YXIgY2M9LyUyMC9nLGNkPS9cXFtcXF0kLyxjZT0vXFxyP1xcbi9nLGNmPS9eKD86Y29sb3J8ZGF0ZXxkYXRldGltZXxkYXRldGltZS1sb2NhbHxlbWFpbHxoaWRkZW58bW9udGh8bnVtYmVyfHBhc3N3b3JkfHJhbmdlfHNlYXJjaHx0ZWx8dGV4dHx0aW1lfHVybHx3ZWVrKSQvaSxjZz0vXig/OnNlbGVjdHx0ZXh0YXJlYSkvaTtwLmZuLmV4dGVuZCh7c2VyaWFsaXplOmZ1bmN0aW9uKCl7cmV0dXJuIHAucGFyYW0odGhpcy5zZXJpYWxpemVBcnJheSgpKX0sc2VyaWFsaXplQXJyYXk6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbGVtZW50cz9wLm1ha2VBcnJheSh0aGlzLmVsZW1lbnRzKTp0aGlzfSkuZmlsdGVyKGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmFtZSYmIXRoaXMuZGlzYWJsZWQmJih0aGlzLmNoZWNrZWR8fGNnLnRlc3QodGhpcy5ub2RlTmFtZSl8fGNmLnRlc3QodGhpcy50eXBlKSl9KS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz1wKHRoaXMpLnZhbCgpO3JldHVybiBjPT1udWxsP251bGw6cC5pc0FycmF5KGMpP3AubWFwKGMsZnVuY3Rpb24oYSxjKXtyZXR1cm57bmFtZTpiLm5hbWUsdmFsdWU6YS5yZXBsYWNlKGNlLFwiXFxyXFxuXCIpfX0pOntuYW1lOmIubmFtZSx2YWx1ZTpjLnJlcGxhY2UoY2UsXCJcXHJcXG5cIil9fSkuZ2V0KCl9fSkscC5wYXJhbT1mdW5jdGlvbihhLGMpe3ZhciBkLGU9W10sZj1mdW5jdGlvbihhLGIpe2I9cC5pc0Z1bmN0aW9uKGIpP2IoKTpiPT1udWxsP1wiXCI6YixlW2UubGVuZ3RoXT1lbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGIpfTtjPT09YiYmKGM9cC5hamF4U2V0dGluZ3MmJnAuYWpheFNldHRpbmdzLnRyYWRpdGlvbmFsKTtpZihwLmlzQXJyYXkoYSl8fGEuanF1ZXJ5JiYhcC5pc1BsYWluT2JqZWN0KGEpKXAuZWFjaChhLGZ1bmN0aW9uKCl7Zih0aGlzLm5hbWUsdGhpcy52YWx1ZSl9KTtlbHNlIGZvcihkIGluIGEpY2goZCxhW2RdLGMsZik7cmV0dXJuIGUuam9pbihcIiZcIikucmVwbGFjZShjYyxcIitcIil9O3ZhciBjaSxjaixjaz0vIy4qJC8sY2w9L14oLio/KTpbIFxcdF0qKFteXFxyXFxuXSopXFxyPyQvbWcsY209L14oPzphYm91dHxhcHB8YXBwXFwtc3RvcmFnZXwuK1xcLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLGNuPS9eKD86R0VUfEhFQUQpJC8sY289L15cXC9cXC8vLGNwPS9cXD8vLGNxPS88c2NyaXB0XFxiW148XSooPzooPyE8XFwvc2NyaXB0Pik8W148XSopKjxcXC9zY3JpcHQ+L2dpLGNyPS8oWz8mXSlfPVteJl0qLyxjcz0vXihbXFx3XFwrXFwuXFwtXSs6KSg/OlxcL1xcLyhbXlxcLz8jOl0qKSg/OjooXFxkKyl8KXwpLyxjdD1wLmZuLmxvYWQsY3U9e30sY3Y9e30sY3c9W1wiKi9cIl0rW1wiKlwiXTt0cnl7Y2k9Zi5ocmVmfWNhdGNoKGN4KXtjaT1lLmNyZWF0ZUVsZW1lbnQoXCJhXCIpLGNpLmhyZWY9XCJcIixjaT1jaS5ocmVmfWNqPWNzLmV4ZWMoY2kudG9Mb3dlckNhc2UoKSl8fFtdLHAuZm4ubG9hZD1mdW5jdGlvbihhLGMsZCl7aWYodHlwZW9mIGEhPVwic3RyaW5nXCImJmN0KXJldHVybiBjdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7aWYoIXRoaXMubGVuZ3RoKXJldHVybiB0aGlzO3ZhciBlLGYsZyxoPXRoaXMsaT1hLmluZGV4T2YoXCIgXCIpO3JldHVybiBpPj0wJiYoZT1hLnNsaWNlKGksYS5sZW5ndGgpLGE9YS5zbGljZSgwLGkpKSxwLmlzRnVuY3Rpb24oYyk/KGQ9YyxjPWIpOnR5cGVvZiBjPT1cIm9iamVjdFwiJiYoZj1cIlBPU1RcIikscC5hamF4KHt1cmw6YSx0eXBlOmYsZGF0YVR5cGU6XCJodG1sXCIsZGF0YTpjLGNvbXBsZXRlOmZ1bmN0aW9uKGEsYil7ZCYmaC5lYWNoKGQsZ3x8W2EucmVzcG9uc2VUZXh0LGIsYV0pfX0pLmRvbmUoZnVuY3Rpb24oYSl7Zz1hcmd1bWVudHMsaC5odG1sKGU/cChcIjxkaXY+XCIpLmFwcGVuZChhLnJlcGxhY2UoY3EsXCJcIikpLmZpbmQoZSk6YSl9KSx0aGlzfSxwLmVhY2goXCJhamF4U3RhcnQgYWpheFN0b3AgYWpheENvbXBsZXRlIGFqYXhFcnJvciBhamF4U3VjY2VzcyBhamF4U2VuZFwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihhLGIpe3AuZm5bYl09ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMub24oYixhKX19KSxwLmVhY2goW1wiZ2V0XCIsXCJwb3N0XCJdLGZ1bmN0aW9uKGEsYyl7cFtjXT1mdW5jdGlvbihhLGQsZSxmKXtyZXR1cm4gcC5pc0Z1bmN0aW9uKGQpJiYoZj1mfHxlLGU9ZCxkPWIpLHAuYWpheCh7dHlwZTpjLHVybDphLGRhdGE6ZCxzdWNjZXNzOmUsZGF0YVR5cGU6Zn0pfX0pLHAuZXh0ZW5kKHtnZXRTY3JpcHQ6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gcC5nZXQoYSxiLGMsXCJzY3JpcHRcIil9LGdldEpTT046ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBwLmdldChhLGIsYyxcImpzb25cIil9LGFqYXhTZXR1cDpmdW5jdGlvbihhLGIpe3JldHVybiBiP2NBKGEscC5hamF4U2V0dGluZ3MpOihiPWEsYT1wLmFqYXhTZXR0aW5ncyksY0EoYSxiKSxhfSxhamF4U2V0dGluZ3M6e3VybDpjaSxpc0xvY2FsOmNtLnRlc3QoY2pbMV0pLGdsb2JhbDohMCx0eXBlOlwiR0VUXCIsY29udGVudFR5cGU6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIixwcm9jZXNzRGF0YTohMCxhc3luYzohMCxhY2NlcHRzOnt4bWw6XCJhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sXCIsaHRtbDpcInRleHQvaHRtbFwiLHRleHQ6XCJ0ZXh0L3BsYWluXCIsanNvbjpcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdFwiLFwiKlwiOmN3fSxjb250ZW50czp7eG1sOi94bWwvLGh0bWw6L2h0bWwvLGpzb246L2pzb24vfSxyZXNwb25zZUZpZWxkczp7eG1sOlwicmVzcG9uc2VYTUxcIix0ZXh0OlwicmVzcG9uc2VUZXh0XCJ9LGNvbnZlcnRlcnM6e1wiKiB0ZXh0XCI6YS5TdHJpbmcsXCJ0ZXh0IGh0bWxcIjohMCxcInRleHQganNvblwiOnAucGFyc2VKU09OLFwidGV4dCB4bWxcIjpwLnBhcnNlWE1MfSxmbGF0T3B0aW9uczp7Y29udGV4dDohMCx1cmw6ITB9fSxhamF4UHJlZmlsdGVyOmN5KGN1KSxhamF4VHJhbnNwb3J0OmN5KGN2KSxhamF4OmZ1bmN0aW9uKGEsYyl7ZnVuY3Rpb24geShhLGMsZixpKXt2YXIgayxzLHQsdSx3LHk9YztpZih2PT09MilyZXR1cm47dj0yLGgmJmNsZWFyVGltZW91dChoKSxnPWIsZT1pfHxcIlwiLHgucmVhZHlTdGF0ZT1hPjA/NDowLGYmJih1PWNCKGwseCxmKSk7aWYoYT49MjAwJiZhPDMwMHx8YT09PTMwNClsLmlmTW9kaWZpZWQmJih3PXguZ2V0UmVzcG9uc2VIZWFkZXIoXCJMYXN0LU1vZGlmaWVkXCIpLHcmJihwLmxhc3RNb2RpZmllZFtkXT13KSx3PXguZ2V0UmVzcG9uc2VIZWFkZXIoXCJFdGFnXCIpLHcmJihwLmV0YWdbZF09dykpLGE9PT0zMDQ/KHk9XCJub3Rtb2RpZmllZFwiLGs9ITApOihrPWNDKGwsdSkseT1rLnN0YXRlLHM9ay5kYXRhLHQ9ay5lcnJvcixrPSF0KTtlbHNle3Q9eTtpZigheXx8YSl5PVwiZXJyb3JcIixhPDAmJihhPTApfXguc3RhdHVzPWEseC5zdGF0dXNUZXh0PVwiXCIrKGN8fHkpLGs/by5yZXNvbHZlV2l0aChtLFtzLHkseF0pOm8ucmVqZWN0V2l0aChtLFt4LHksdF0pLHguc3RhdHVzQ29kZShyKSxyPWIsaiYmbi50cmlnZ2VyKFwiYWpheFwiKyhrP1wiU3VjY2Vzc1wiOlwiRXJyb3JcIiksW3gsbCxrP3M6dF0pLHEuZmlyZVdpdGgobSxbeCx5XSksaiYmKG4udHJpZ2dlcihcImFqYXhDb21wbGV0ZVwiLFt4LGxdKSwtLXAuYWN0aXZlfHxwLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RvcFwiKSl9dHlwZW9mIGE9PVwib2JqZWN0XCImJihjPWEsYT1iKSxjPWN8fHt9O3ZhciBkLGUsZixnLGgsaSxqLGssbD1wLmFqYXhTZXR1cCh7fSxjKSxtPWwuY29udGV4dHx8bCxuPW0hPT1sJiYobS5ub2RlVHlwZXx8bSBpbnN0YW5jZW9mIHApP3AobSk6cC5ldmVudCxvPXAuRGVmZXJyZWQoKSxxPXAuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIikscj1sLnN0YXR1c0NvZGV8fHt9LHQ9e30sdT17fSx2PTAsdz1cImNhbmNlbGVkXCIseD17cmVhZHlTdGF0ZTowLHNldFJlcXVlc3RIZWFkZXI6ZnVuY3Rpb24oYSxiKXtpZighdil7dmFyIGM9YS50b0xvd2VyQ2FzZSgpO2E9dVtjXT11W2NdfHxhLHRbYV09Yn1yZXR1cm4gdGhpc30sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIHY9PT0yP2U6bnVsbH0sZ2V0UmVzcG9uc2VIZWFkZXI6ZnVuY3Rpb24oYSl7dmFyIGM7aWYodj09PTIpe2lmKCFmKXtmPXt9O3doaWxlKGM9Y2wuZXhlYyhlKSlmW2NbMV0udG9Mb3dlckNhc2UoKV09Y1syXX1jPWZbYS50b0xvd2VyQ2FzZSgpXX1yZXR1cm4gYz09PWI/bnVsbDpjfSxvdmVycmlkZU1pbWVUeXBlOmZ1bmN0aW9uKGEpe3JldHVybiB2fHwobC5taW1lVHlwZT1hKSx0aGlzfSxhYm9ydDpmdW5jdGlvbihhKXtyZXR1cm4gYT1hfHx3LGcmJmcuYWJvcnQoYSkseSgwLGEpLHRoaXN9fTtvLnByb21pc2UoeCkseC5zdWNjZXNzPXguZG9uZSx4LmVycm9yPXguZmFpbCx4LmNvbXBsZXRlPXEuYWRkLHguc3RhdHVzQ29kZT1mdW5jdGlvbihhKXtpZihhKXt2YXIgYjtpZih2PDIpZm9yKGIgaW4gYSlyW2JdPVtyW2JdLGFbYl1dO2Vsc2UgYj1hW3guc3RhdHVzXSx4LmFsd2F5cyhiKX1yZXR1cm4gdGhpc30sbC51cmw9KChhfHxsLnVybCkrXCJcIikucmVwbGFjZShjayxcIlwiKS5yZXBsYWNlKGNvLGNqWzFdK1wiLy9cIiksbC5kYXRhVHlwZXM9cC50cmltKGwuZGF0YVR5cGV8fFwiKlwiKS50b0xvd2VyQ2FzZSgpLnNwbGl0KHMpLGwuY3Jvc3NEb21haW49PW51bGwmJihpPWNzLmV4ZWMobC51cmwudG9Mb3dlckNhc2UoKSksbC5jcm9zc0RvbWFpbj0hKCFpfHxpWzFdPT1jalsxXSYmaVsyXT09Y2pbMl0mJihpWzNdfHwoaVsxXT09PVwiaHR0cDpcIj84MDo0NDMpKT09KGNqWzNdfHwoY2pbMV09PT1cImh0dHA6XCI/ODA6NDQzKSkpKSxsLmRhdGEmJmwucHJvY2Vzc0RhdGEmJnR5cGVvZiBsLmRhdGEhPVwic3RyaW5nXCImJihsLmRhdGE9cC5wYXJhbShsLmRhdGEsbC50cmFkaXRpb25hbCkpLGN6KGN1LGwsYyx4KTtpZih2PT09MilyZXR1cm4geDtqPWwuZ2xvYmFsLGwudHlwZT1sLnR5cGUudG9VcHBlckNhc2UoKSxsLmhhc0NvbnRlbnQ9IWNuLnRlc3QobC50eXBlKSxqJiZwLmFjdGl2ZSsrPT09MCYmcC5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpO2lmKCFsLmhhc0NvbnRlbnQpe2wuZGF0YSYmKGwudXJsKz0oY3AudGVzdChsLnVybCk/XCImXCI6XCI/XCIpK2wuZGF0YSxkZWxldGUgbC5kYXRhKSxkPWwudXJsO2lmKGwuY2FjaGU9PT0hMSl7dmFyIHo9cC5ub3coKSxBPWwudXJsLnJlcGxhY2UoY3IsXCIkMV89XCIreik7bC51cmw9QSsoQT09PWwudXJsPyhjcC50ZXN0KGwudXJsKT9cIiZcIjpcIj9cIikrXCJfPVwiK3o6XCJcIil9fShsLmRhdGEmJmwuaGFzQ29udGVudCYmbC5jb250ZW50VHlwZSE9PSExfHxjLmNvbnRlbnRUeXBlKSYmeC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsbC5jb250ZW50VHlwZSksbC5pZk1vZGlmaWVkJiYoZD1kfHxsLnVybCxwLmxhc3RNb2RpZmllZFtkXSYmeC5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIixwLmxhc3RNb2RpZmllZFtkXSkscC5ldGFnW2RdJiZ4LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIscC5ldGFnW2RdKSkseC5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsbC5kYXRhVHlwZXNbMF0mJmwuYWNjZXB0c1tsLmRhdGFUeXBlc1swXV0/bC5hY2NlcHRzW2wuZGF0YVR5cGVzWzBdXSsobC5kYXRhVHlwZXNbMF0hPT1cIipcIj9cIiwgXCIrY3crXCI7IHE9MC4wMVwiOlwiXCIpOmwuYWNjZXB0c1tcIipcIl0pO2ZvcihrIGluIGwuaGVhZGVycyl4LnNldFJlcXVlc3RIZWFkZXIoayxsLmhlYWRlcnNba10pO2lmKCFsLmJlZm9yZVNlbmR8fGwuYmVmb3JlU2VuZC5jYWxsKG0seCxsKSE9PSExJiZ2IT09Mil7dz1cImFib3J0XCI7Zm9yKGsgaW57c3VjY2VzczoxLGVycm9yOjEsY29tcGxldGU6MX0peFtrXShsW2tdKTtnPWN6KGN2LGwsYyx4KTtpZighZyl5KC0xLFwiTm8gVHJhbnNwb3J0XCIpO2Vsc2V7eC5yZWFkeVN0YXRlPTEsaiYmbi50cmlnZ2VyKFwiYWpheFNlbmRcIixbeCxsXSksbC5hc3luYyYmbC50aW1lb3V0PjAmJihoPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt4LmFib3J0KFwidGltZW91dFwiKX0sbC50aW1lb3V0KSk7dHJ5e3Y9MSxnLnNlbmQodCx5KX1jYXRjaChCKXtpZih2PDIpeSgtMSxCKTtlbHNlIHRocm93IEJ9fXJldHVybiB4fXJldHVybiB4LmFib3J0KCl9LGFjdGl2ZTowLGxhc3RNb2RpZmllZDp7fSxldGFnOnt9fSk7dmFyIGNEPVtdLGNFPS9cXD8vLGNGPS8oPSlcXD8oPz0mfCQpfFxcP1xcPy8sY0c9cC5ub3coKTtwLmFqYXhTZXR1cCh7anNvbnA6XCJjYWxsYmFja1wiLGpzb25wQ2FsbGJhY2s6ZnVuY3Rpb24oKXt2YXIgYT1jRC5wb3AoKXx8cC5leHBhbmRvK1wiX1wiK2NHKys7cmV0dXJuIHRoaXNbYV09ITAsYX19KSxwLmFqYXhQcmVmaWx0ZXIoXCJqc29uIGpzb25wXCIsZnVuY3Rpb24oYyxkLGUpe3ZhciBmLGcsaCxpPWMuZGF0YSxqPWMudXJsLGs9Yy5qc29ucCE9PSExLGw9ayYmY0YudGVzdChqKSxtPWsmJiFsJiZ0eXBlb2YgaT09XCJzdHJpbmdcIiYmIShjLmNvbnRlbnRUeXBlfHxcIlwiKS5pbmRleE9mKFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpJiZjRi50ZXN0KGkpO2lmKGMuZGF0YVR5cGVzWzBdPT09XCJqc29ucFwifHxsfHxtKXJldHVybiBmPWMuanNvbnBDYWxsYmFjaz1wLmlzRnVuY3Rpb24oYy5qc29ucENhbGxiYWNrKT9jLmpzb25wQ2FsbGJhY2soKTpjLmpzb25wQ2FsbGJhY2ssZz1hW2ZdLGw/Yy51cmw9ai5yZXBsYWNlKGNGLFwiJDFcIitmKTptP2MuZGF0YT1pLnJlcGxhY2UoY0YsXCIkMVwiK2YpOmsmJihjLnVybCs9KGNFLnRlc3Qoaik/XCImXCI6XCI/XCIpK2MuanNvbnArXCI9XCIrZiksYy5jb252ZXJ0ZXJzW1wic2NyaXB0IGpzb25cIl09ZnVuY3Rpb24oKXtyZXR1cm4gaHx8cC5lcnJvcihmK1wiIHdhcyBub3QgY2FsbGVkXCIpLGhbMF19LGMuZGF0YVR5cGVzWzBdPVwianNvblwiLGFbZl09ZnVuY3Rpb24oKXtoPWFyZ3VtZW50c30sZS5hbHdheXMoZnVuY3Rpb24oKXthW2ZdPWcsY1tmXSYmKGMuanNvbnBDYWxsYmFjaz1kLmpzb25wQ2FsbGJhY2ssY0QucHVzaChmKSksaCYmcC5pc0Z1bmN0aW9uKGcpJiZnKGhbMF0pLGg9Zz1ifSksXCJzY3JpcHRcIn0pLHAuYWpheFNldHVwKHthY2NlcHRzOntzY3JpcHQ6XCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2VjbWFzY3JpcHQsIGFwcGxpY2F0aW9uL3gtZWNtYXNjcmlwdFwifSxjb250ZW50czp7c2NyaXB0Oi9qYXZhc2NyaXB0fGVjbWFzY3JpcHQvfSxjb252ZXJ0ZXJzOntcInRleHQgc2NyaXB0XCI6ZnVuY3Rpb24oYSl7cmV0dXJuIHAuZ2xvYmFsRXZhbChhKSxhfX19KSxwLmFqYXhQcmVmaWx0ZXIoXCJzY3JpcHRcIixmdW5jdGlvbihhKXthLmNhY2hlPT09YiYmKGEuY2FjaGU9ITEpLGEuY3Jvc3NEb21haW4mJihhLnR5cGU9XCJHRVRcIixhLmdsb2JhbD0hMSl9KSxwLmFqYXhUcmFuc3BvcnQoXCJzY3JpcHRcIixmdW5jdGlvbihhKXtpZihhLmNyb3NzRG9tYWluKXt2YXIgYyxkPWUuaGVhZHx8ZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF18fGUuZG9jdW1lbnRFbGVtZW50O3JldHVybntzZW5kOmZ1bmN0aW9uKGYsZyl7Yz1lLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksYy5hc3luYz1cImFzeW5jXCIsYS5zY3JpcHRDaGFyc2V0JiYoYy5jaGFyc2V0PWEuc2NyaXB0Q2hhcnNldCksYy5zcmM9YS51cmwsYy5vbmxvYWQ9Yy5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oYSxlKXtpZihlfHwhYy5yZWFkeVN0YXRlfHwvbG9hZGVkfGNvbXBsZXRlLy50ZXN0KGMucmVhZHlTdGF0ZSkpYy5vbmxvYWQ9Yy5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxkJiZjLnBhcmVudE5vZGUmJmQucmVtb3ZlQ2hpbGQoYyksYz1iLGV8fGcoMjAwLFwic3VjY2Vzc1wiKX0sZC5pbnNlcnRCZWZvcmUoYyxkLmZpcnN0Q2hpbGQpfSxhYm9ydDpmdW5jdGlvbigpe2MmJmMub25sb2FkKDAsMSl9fX19KTt2YXIgY0gsY0k9YS5BY3RpdmVYT2JqZWN0P2Z1bmN0aW9uKCl7Zm9yKHZhciBhIGluIGNIKWNIW2FdKDAsMSl9OiExLGNKPTA7cC5hamF4U2V0dGluZ3MueGhyPWEuQWN0aXZlWE9iamVjdD9mdW5jdGlvbigpe3JldHVybiF0aGlzLmlzTG9jYWwmJmNLKCl8fGNMKCl9OmNLLGZ1bmN0aW9uKGEpe3AuZXh0ZW5kKHAuc3VwcG9ydCx7YWpheDohIWEsY29yczohIWEmJlwid2l0aENyZWRlbnRpYWxzXCJpbiBhfSl9KHAuYWpheFNldHRpbmdzLnhocigpKSxwLnN1cHBvcnQuYWpheCYmcC5hamF4VHJhbnNwb3J0KGZ1bmN0aW9uKGMpe2lmKCFjLmNyb3NzRG9tYWlufHxwLnN1cHBvcnQuY29ycyl7dmFyIGQ7cmV0dXJue3NlbmQ6ZnVuY3Rpb24oZSxmKXt2YXIgZyxoLGk9Yy54aHIoKTtjLnVzZXJuYW1lP2kub3BlbihjLnR5cGUsYy51cmwsYy5hc3luYyxjLnVzZXJuYW1lLGMucGFzc3dvcmQpOmkub3BlbihjLnR5cGUsYy51cmwsYy5hc3luYyk7aWYoYy54aHJGaWVsZHMpZm9yKGggaW4gYy54aHJGaWVsZHMpaVtoXT1jLnhockZpZWxkc1toXTtjLm1pbWVUeXBlJiZpLm92ZXJyaWRlTWltZVR5cGUmJmkub3ZlcnJpZGVNaW1lVHlwZShjLm1pbWVUeXBlKSwhYy5jcm9zc0RvbWFpbiYmIWVbXCJYLVJlcXVlc3RlZC1XaXRoXCJdJiYoZVtcIlgtUmVxdWVzdGVkLVdpdGhcIl09XCJYTUxIdHRwUmVxdWVzdFwiKTt0cnl7Zm9yKGggaW4gZSlpLnNldFJlcXVlc3RIZWFkZXIoaCxlW2hdKX1jYXRjaChqKXt9aS5zZW5kKGMuaGFzQ29udGVudCYmYy5kYXRhfHxudWxsKSxkPWZ1bmN0aW9uKGEsZSl7dmFyIGgsaixrLGwsbTt0cnl7aWYoZCYmKGV8fGkucmVhZHlTdGF0ZT09PTQpKXtkPWIsZyYmKGkub25yZWFkeXN0YXRlY2hhbmdlPXAubm9vcCxjSSYmZGVsZXRlIGNIW2ddKTtpZihlKWkucmVhZHlTdGF0ZSE9PTQmJmkuYWJvcnQoKTtlbHNle2g9aS5zdGF0dXMsaz1pLmdldEFsbFJlc3BvbnNlSGVhZGVycygpLGw9e30sbT1pLnJlc3BvbnNlWE1MLG0mJm0uZG9jdW1lbnRFbGVtZW50JiYobC54bWw9bSk7dHJ5e2wudGV4dD1pLnJlc3BvbnNlVGV4dH1jYXRjaChhKXt9dHJ5e2o9aS5zdGF0dXNUZXh0fWNhdGNoKG4pe2o9XCJcIn0haCYmYy5pc0xvY2FsJiYhYy5jcm9zc0RvbWFpbj9oPWwudGV4dD8yMDA6NDA0Omg9PT0xMjIzJiYoaD0yMDQpfX19Y2F0Y2gobyl7ZXx8ZigtMSxvKX1sJiZmKGgsaixsLGspfSxjLmFzeW5jP2kucmVhZHlTdGF0ZT09PTQ/c2V0VGltZW91dChkLDApOihnPSsrY0osY0kmJihjSHx8KGNIPXt9LHAoYSkudW5sb2FkKGNJKSksY0hbZ109ZCksaS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZCk6ZCgpfSxhYm9ydDpmdW5jdGlvbigpe2QmJmQoMCwxKX19fX0pO3ZhciBjTSxjTixjTz0vXig/OnRvZ2dsZXxzaG93fGhpZGUpJC8sY1A9bmV3IFJlZ0V4cChcIl4oPzooWy0rXSk9fCkoXCIrcStcIikoW2EteiVdKikkXCIsXCJpXCIpLGNRPS9xdWV1ZUhvb2tzJC8sY1I9W2NYXSxjUz17XCIqXCI6W2Z1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpcy5jcmVhdGVUd2VlbihhLGIpLGc9Y1AuZXhlYyhiKSxoPWYuY3VyKCksaT0raHx8MCxqPTE7aWYoZyl7Yz0rZ1syXSxkPWdbM118fChwLmNzc051bWJlclthXT9cIlwiOlwicHhcIik7aWYoZCE9PVwicHhcIiYmaSl7aT1wLmNzcyhmLmVsZW0sYSwhMCl8fGN8fDE7ZG8gZT1qPWp8fFwiLjVcIixpPWkvaixwLnN0eWxlKGYuZWxlbSxhLGkrZCksaj1mLmN1cigpL2g7d2hpbGUoaiE9PTEmJmohPT1lKX1mLnVuaXQ9ZCxmLnN0YXJ0PWksZi5lbmQ9Z1sxXT9pKyhnWzFdKzEpKmM6Y31yZXR1cm4gZn1dfTtwLkFuaW1hdGlvbj1wLmV4dGVuZChjVix7dHdlZW5lcjpmdW5jdGlvbihhLGIpe3AuaXNGdW5jdGlvbihhKT8oYj1hLGE9W1wiKlwiXSk6YT1hLnNwbGl0KFwiIFwiKTt2YXIgYyxkPTAsZT1hLmxlbmd0aDtmb3IoO2Q8ZTtkKyspYz1hW2RdLGNTW2NdPWNTW2NdfHxbXSxjU1tjXS51bnNoaWZ0KGIpfSxwcmVmaWx0ZXI6ZnVuY3Rpb24oYSxiKXtiP2NSLnVuc2hpZnQoYSk6Y1IucHVzaChhKX19KSxwLlR3ZWVuPWNZLGNZLnByb3RvdHlwZT17Y29uc3RydWN0b3I6Y1ksaW5pdDpmdW5jdGlvbihhLGIsYyxkLGUsZil7dGhpcy5lbGVtPWEsdGhpcy5wcm9wPWMsdGhpcy5lYXNpbmc9ZXx8XCJzd2luZ1wiLHRoaXMub3B0aW9ucz1iLHRoaXMuc3RhcnQ9dGhpcy5ub3c9dGhpcy5jdXIoKSx0aGlzLmVuZD1kLHRoaXMudW5pdD1mfHwocC5jc3NOdW1iZXJbY10/XCJcIjpcInB4XCIpfSxjdXI6ZnVuY3Rpb24oKXt2YXIgYT1jWS5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gYSYmYS5nZXQ/YS5nZXQodGhpcyk6Y1kucHJvcEhvb2tzLl9kZWZhdWx0LmdldCh0aGlzKX0scnVuOmZ1bmN0aW9uKGEpe3ZhciBiLGM9Y1kucHJvcEhvb2tzW3RoaXMucHJvcF07cmV0dXJuIHRoaXMucG9zPWI9cC5lYXNpbmdbdGhpcy5lYXNpbmddKGEsdGhpcy5vcHRpb25zLmR1cmF0aW9uKmEsMCwxLHRoaXMub3B0aW9ucy5kdXJhdGlvbiksdGhpcy5ub3c9KHRoaXMuZW5kLXRoaXMuc3RhcnQpKmIrdGhpcy5zdGFydCx0aGlzLm9wdGlvbnMuc3RlcCYmdGhpcy5vcHRpb25zLnN0ZXAuY2FsbCh0aGlzLmVsZW0sdGhpcy5ub3csdGhpcyksYyYmYy5zZXQ/Yy5zZXQodGhpcyk6Y1kucHJvcEhvb2tzLl9kZWZhdWx0LnNldCh0aGlzKSx0aGlzfX0sY1kucHJvdG90eXBlLmluaXQucHJvdG90eXBlPWNZLnByb3RvdHlwZSxjWS5wcm9wSG9va3M9e19kZWZhdWx0OntnZXQ6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIGEuZWxlbVthLnByb3BdPT1udWxsfHwhIWEuZWxlbS5zdHlsZSYmYS5lbGVtLnN0eWxlW2EucHJvcF0hPW51bGw/KGI9cC5jc3MoYS5lbGVtLGEucHJvcCwhMSxcIlwiKSwhYnx8Yj09PVwiYXV0b1wiPzA6Yik6YS5lbGVtW2EucHJvcF19LHNldDpmdW5jdGlvbihhKXtwLmZ4LnN0ZXBbYS5wcm9wXT9wLmZ4LnN0ZXBbYS5wcm9wXShhKTphLmVsZW0uc3R5bGUmJihhLmVsZW0uc3R5bGVbcC5jc3NQcm9wc1thLnByb3BdXSE9bnVsbHx8cC5jc3NIb29rc1thLnByb3BdKT9wLnN0eWxlKGEuZWxlbSxhLnByb3AsYS5ub3crYS51bml0KTphLmVsZW1bYS5wcm9wXT1hLm5vd319fSxjWS5wcm9wSG9va3Muc2Nyb2xsVG9wPWNZLnByb3BIb29rcy5zY3JvbGxMZWZ0PXtzZXQ6ZnVuY3Rpb24oYSl7YS5lbGVtLm5vZGVUeXBlJiZhLmVsZW0ucGFyZW50Tm9kZSYmKGEuZWxlbVthLnByb3BdPWEubm93KX19LHAuZWFjaChbXCJ0b2dnbGVcIixcInNob3dcIixcImhpZGVcIl0sZnVuY3Rpb24oYSxiKXt2YXIgYz1wLmZuW2JdO3AuZm5bYl09ZnVuY3Rpb24oZCxlLGYpe3JldHVybiBkPT1udWxsfHx0eXBlb2YgZD09XCJib29sZWFuXCJ8fCFhJiZwLmlzRnVuY3Rpb24oZCkmJnAuaXNGdW5jdGlvbihlKT9jLmFwcGx5KHRoaXMsYXJndW1lbnRzKTp0aGlzLmFuaW1hdGUoY1ooYiwhMCksZCxlLGYpfX0pLHAuZm4uZXh0ZW5kKHtmYWRlVG86ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIHRoaXMuZmlsdGVyKGJZKS5jc3MoXCJvcGFjaXR5XCIsMCkuc2hvdygpLmVuZCgpLmFuaW1hdGUoe29wYWNpdHk6Yn0sYSxjLGQpfSxhbmltYXRlOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPXAuaXNFbXB0eU9iamVjdChhKSxmPXAuc3BlZWQoYixjLGQpLGc9ZnVuY3Rpb24oKXt2YXIgYj1jVih0aGlzLHAuZXh0ZW5kKHt9LGEpLGYpO2UmJmIuc3RvcCghMCl9O3JldHVybiBlfHxmLnF1ZXVlPT09ITE/dGhpcy5lYWNoKGcpOnRoaXMucXVldWUoZi5xdWV1ZSxnKX0sc3RvcDpmdW5jdGlvbihhLGMsZCl7dmFyIGU9ZnVuY3Rpb24oYSl7dmFyIGI9YS5zdG9wO2RlbGV0ZSBhLnN0b3AsYihkKX07cmV0dXJuIHR5cGVvZiBhIT1cInN0cmluZ1wiJiYoZD1jLGM9YSxhPWIpLGMmJmEhPT0hMSYmdGhpcy5xdWV1ZShhfHxcImZ4XCIsW10pLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPSEwLGM9YSE9bnVsbCYmYStcInF1ZXVlSG9va3NcIixmPXAudGltZXJzLGc9cC5fZGF0YSh0aGlzKTtpZihjKWdbY10mJmdbY10uc3RvcCYmZShnW2NdKTtlbHNlIGZvcihjIGluIGcpZ1tjXSYmZ1tjXS5zdG9wJiZjUS50ZXN0KGMpJiZlKGdbY10pO2ZvcihjPWYubGVuZ3RoO2MtLTspZltjXS5lbGVtPT09dGhpcyYmKGE9PW51bGx8fGZbY10ucXVldWU9PT1hKSYmKGZbY10uYW5pbS5zdG9wKGQpLGI9ITEsZi5zcGxpY2UoYywxKSk7KGJ8fCFkKSYmcC5kZXF1ZXVlKHRoaXMsYSl9KX19KSxwLmVhY2goe3NsaWRlRG93bjpjWihcInNob3dcIiksc2xpZGVVcDpjWihcImhpZGVcIiksc2xpZGVUb2dnbGU6Y1ooXCJ0b2dnbGVcIiksZmFkZUluOntvcGFjaXR5Olwic2hvd1wifSxmYWRlT3V0OntvcGFjaXR5OlwiaGlkZVwifSxmYWRlVG9nZ2xlOntvcGFjaXR5OlwidG9nZ2xlXCJ9fSxmdW5jdGlvbihhLGIpe3AuZm5bYV09ZnVuY3Rpb24oYSxjLGQpe3JldHVybiB0aGlzLmFuaW1hdGUoYixhLGMsZCl9fSkscC5zcGVlZD1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YSYmdHlwZW9mIGE9PVwib2JqZWN0XCI/cC5leHRlbmQoe30sYSk6e2NvbXBsZXRlOmN8fCFjJiZifHxwLmlzRnVuY3Rpb24oYSkmJmEsZHVyYXRpb246YSxlYXNpbmc6YyYmYnx8YiYmIXAuaXNGdW5jdGlvbihiKSYmYn07ZC5kdXJhdGlvbj1wLmZ4Lm9mZj8wOnR5cGVvZiBkLmR1cmF0aW9uPT1cIm51bWJlclwiP2QuZHVyYXRpb246ZC5kdXJhdGlvbiBpbiBwLmZ4LnNwZWVkcz9wLmZ4LnNwZWVkc1tkLmR1cmF0aW9uXTpwLmZ4LnNwZWVkcy5fZGVmYXVsdDtpZihkLnF1ZXVlPT1udWxsfHxkLnF1ZXVlPT09ITApZC5xdWV1ZT1cImZ4XCI7cmV0dXJuIGQub2xkPWQuY29tcGxldGUsZC5jb21wbGV0ZT1mdW5jdGlvbigpe3AuaXNGdW5jdGlvbihkLm9sZCkmJmQub2xkLmNhbGwodGhpcyksZC5xdWV1ZSYmcC5kZXF1ZXVlKHRoaXMsZC5xdWV1ZSl9LGR9LHAuZWFzaW5nPXtsaW5lYXI6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LHN3aW5nOmZ1bmN0aW9uKGEpe3JldHVybi41LU1hdGguY29zKGEqTWF0aC5QSSkvMn19LHAudGltZXJzPVtdLHAuZng9Y1kucHJvdG90eXBlLmluaXQscC5meC50aWNrPWZ1bmN0aW9uKCl7dmFyIGEsYj1wLnRpbWVycyxjPTA7Zm9yKDtjPGIubGVuZ3RoO2MrKylhPWJbY10sIWEoKSYmYltjXT09PWEmJmIuc3BsaWNlKGMtLSwxKTtiLmxlbmd0aHx8cC5meC5zdG9wKCl9LHAuZngudGltZXI9ZnVuY3Rpb24oYSl7YSgpJiZwLnRpbWVycy5wdXNoKGEpJiYhY04mJihjTj1zZXRJbnRlcnZhbChwLmZ4LnRpY2sscC5meC5pbnRlcnZhbCkpfSxwLmZ4LmludGVydmFsPTEzLHAuZnguc3RvcD1mdW5jdGlvbigpe2NsZWFySW50ZXJ2YWwoY04pLGNOPW51bGx9LHAuZnguc3BlZWRzPXtzbG93OjYwMCxmYXN0OjIwMCxfZGVmYXVsdDo0MDB9LHAuZnguc3RlcD17fSxwLmV4cHImJnAuZXhwci5maWx0ZXJzJiYocC5leHByLmZpbHRlcnMuYW5pbWF0ZWQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHAuZ3JlcChwLnRpbWVycyxmdW5jdGlvbihiKXtyZXR1cm4gYT09PWIuZWxlbX0pLmxlbmd0aH0pO3ZhciBjJD0vXig/OmJvZHl8aHRtbCkkL2k7cC5mbi5vZmZzZXQ9ZnVuY3Rpb24oYSl7aWYoYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gYT09PWI/dGhpczp0aGlzLmVhY2goZnVuY3Rpb24oYil7cC5vZmZzZXQuc2V0T2Zmc2V0KHRoaXMsYSxiKX0pO3ZhciBjLGQsZSxmLGcsaCxpLGosayxsLG09dGhpc1swXSxuPW0mJm0ub3duZXJEb2N1bWVudDtpZighbilyZXR1cm47cmV0dXJuKGU9bi5ib2R5KT09PW0/cC5vZmZzZXQuYm9keU9mZnNldChtKTooZD1uLmRvY3VtZW50RWxlbWVudCxwLmNvbnRhaW5zKGQsbSk/KGM9bS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxmPWNfKG4pLGc9ZC5jbGllbnRUb3B8fGUuY2xpZW50VG9wfHwwLGg9ZC5jbGllbnRMZWZ0fHxlLmNsaWVudExlZnR8fDAsaT1mLnBhZ2VZT2Zmc2V0fHxkLnNjcm9sbFRvcCxqPWYucGFnZVhPZmZzZXR8fGQuc2Nyb2xsTGVmdCxrPWMudG9wK2ktZyxsPWMubGVmdCtqLWgse3RvcDprLGxlZnQ6bH0pOnt0b3A6MCxsZWZ0OjB9KX0scC5vZmZzZXQ9e2JvZHlPZmZzZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5vZmZzZXRUb3AsYz1hLm9mZnNldExlZnQ7cmV0dXJuIHAuc3VwcG9ydC5kb2VzTm90SW5jbHVkZU1hcmdpbkluQm9keU9mZnNldCYmKGIrPXBhcnNlRmxvYXQocC5jc3MoYSxcIm1hcmdpblRvcFwiKSl8fDAsYys9cGFyc2VGbG9hdChwLmNzcyhhLFwibWFyZ2luTGVmdFwiKSl8fDApLHt0b3A6YixsZWZ0OmN9fSxzZXRPZmZzZXQ6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPXAuY3NzKGEsXCJwb3NpdGlvblwiKTtkPT09XCJzdGF0aWNcIiYmKGEuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwiKTt2YXIgZT1wKGEpLGY9ZS5vZmZzZXQoKSxnPXAuY3NzKGEsXCJ0b3BcIiksaD1wLmNzcyhhLFwibGVmdFwiKSxpPShkPT09XCJhYnNvbHV0ZVwifHxkPT09XCJmaXhlZFwiKSYmcC5pbkFycmF5KFwiYXV0b1wiLFtnLGhdKT4tMSxqPXt9LGs9e30sbCxtO2k/KGs9ZS5wb3NpdGlvbigpLGw9ay50b3AsbT1rLmxlZnQpOihsPXBhcnNlRmxvYXQoZyl8fDAsbT1wYXJzZUZsb2F0KGgpfHwwKSxwLmlzRnVuY3Rpb24oYikmJihiPWIuY2FsbChhLGMsZikpLGIudG9wIT1udWxsJiYoai50b3A9Yi50b3AtZi50b3ArbCksYi5sZWZ0IT1udWxsJiYoai5sZWZ0PWIubGVmdC1mLmxlZnQrbSksXCJ1c2luZ1wiaW4gYj9iLnVzaW5nLmNhbGwoYSxqKTplLmNzcyhqKX19LHAuZm4uZXh0ZW5kKHtwb3NpdGlvbjpmdW5jdGlvbigpe2lmKCF0aGlzWzBdKXJldHVybjt2YXIgYT10aGlzWzBdLGI9dGhpcy5vZmZzZXRQYXJlbnQoKSxjPXRoaXMub2Zmc2V0KCksZD1jJC50ZXN0KGJbMF0ubm9kZU5hbWUpP3t0b3A6MCxsZWZ0OjB9OmIub2Zmc2V0KCk7cmV0dXJuIGMudG9wLT1wYXJzZUZsb2F0KHAuY3NzKGEsXCJtYXJnaW5Ub3BcIikpfHwwLGMubGVmdC09cGFyc2VGbG9hdChwLmNzcyhhLFwibWFyZ2luTGVmdFwiKSl8fDAsZC50b3ArPXBhcnNlRmxvYXQocC5jc3MoYlswXSxcImJvcmRlclRvcFdpZHRoXCIpKXx8MCxkLmxlZnQrPXBhcnNlRmxvYXQocC5jc3MoYlswXSxcImJvcmRlckxlZnRXaWR0aFwiKSl8fDAse3RvcDpjLnRvcC1kLnRvcCxsZWZ0OmMubGVmdC1kLmxlZnR9fSxvZmZzZXRQYXJlbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9mZnNldFBhcmVudHx8ZS5ib2R5O3doaWxlKGEmJiFjJC50ZXN0KGEubm9kZU5hbWUpJiZwLmNzcyhhLFwicG9zaXRpb25cIik9PT1cInN0YXRpY1wiKWE9YS5vZmZzZXRQYXJlbnQ7cmV0dXJuIGF8fGUuYm9keX0pfX0pLHAuZWFjaCh7c2Nyb2xsTGVmdDpcInBhZ2VYT2Zmc2V0XCIsc2Nyb2xsVG9wOlwicGFnZVlPZmZzZXRcIn0sZnVuY3Rpb24oYSxjKXt2YXIgZD0vWS8udGVzdChjKTtwLmZuW2FdPWZ1bmN0aW9uKGUpe3JldHVybiBwLmFjY2Vzcyh0aGlzLGZ1bmN0aW9uKGEsZSxmKXt2YXIgZz1jXyhhKTtpZihmPT09YilyZXR1cm4gZz9jIGluIGc/Z1tjXTpnLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtlXTphW2VdO2c/Zy5zY3JvbGxUbyhkP3AoZykuc2Nyb2xsTGVmdCgpOmYsZD9mOnAoZykuc2Nyb2xsVG9wKCkpOmFbZV09Zn0sYSxlLGFyZ3VtZW50cy5sZW5ndGgsbnVsbCl9fSkscC5lYWNoKHtIZWlnaHQ6XCJoZWlnaHRcIixXaWR0aDpcIndpZHRoXCJ9LGZ1bmN0aW9uKGEsYyl7cC5lYWNoKHtwYWRkaW5nOlwiaW5uZXJcIithLGNvbnRlbnQ6YyxcIlwiOlwib3V0ZXJcIithfSxmdW5jdGlvbihkLGUpe3AuZm5bZV09ZnVuY3Rpb24oZSxmKXt2YXIgZz1hcmd1bWVudHMubGVuZ3RoJiYoZHx8dHlwZW9mIGUhPVwiYm9vbGVhblwiKSxoPWR8fChlPT09ITB8fGY9PT0hMD9cIm1hcmdpblwiOlwiYm9yZGVyXCIpO3JldHVybiBwLmFjY2Vzcyh0aGlzLGZ1bmN0aW9uKGMsZCxlKXt2YXIgZjtyZXR1cm4gcC5pc1dpbmRvdyhjKT9jLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtcImNsaWVudFwiK2FdOmMubm9kZVR5cGU9PT05PyhmPWMuZG9jdW1lbnRFbGVtZW50LE1hdGgubWF4KGMuYm9keVtcInNjcm9sbFwiK2FdLGZbXCJzY3JvbGxcIithXSxjLmJvZHlbXCJvZmZzZXRcIithXSxmW1wib2Zmc2V0XCIrYV0sZltcImNsaWVudFwiK2FdKSk6ZT09PWI/cC5jc3MoYyxkLGUsaCk6cC5zdHlsZShjLGQsZSxoKX0sYyxnP2U6YixnKX19KX0pLGEualF1ZXJ5PWEuJD1wLHR5cGVvZiBkZWZpbmU9PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCYmZGVmaW5lLmFtZC5qUXVlcnkmJmRlZmluZShcImpxdWVyeVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIHB9KX0pKHdpbmRvdyk7IiwiLyohIENvcHlyaWdodCAoYykgMjAxMSBCcmFuZG9uIEFhcm9uIChodHRwOi8vYnJhbmRvbmFhcm9uLm5ldClcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChMSUNFTlNFLnR4dCkuXHJcbiAqXHJcbiAqIFRoYW5rcyB0bzogaHR0cDovL2Fkb21hcy5vcmcvamF2YXNjcmlwdC1tb3VzZS13aGVlbC8gZm9yIHNvbWUgcG9pbnRlcnMuXHJcbiAqIFRoYW5rcyB0bzogTWF0aGlhcyBCYW5rKGh0dHA6Ly93d3cubWF0aGlhcy1iYW5rLmRlKSBmb3IgYSBzY29wZSBidWcgZml4LlxyXG4gKiBUaGFua3MgdG86IFNlYW11cyBMZWFoeSBmb3IgYWRkaW5nIGRlbHRhWCBhbmQgZGVsdGFZXHJcbiAqXHJcbiAqIFZlcnNpb246IDMuMC42XHJcbiAqIFxyXG4gKiBSZXF1aXJlczogMS4yLjIrXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcbnZhciB0eXBlcyA9IFsnRE9NTW91c2VTY3JvbGwnLCAnbW91c2V3aGVlbCddO1xyXG5cclxuaWYgKCQuZXZlbnQuZml4SG9va3MpIHtcclxuICAgIGZvciAoIHZhciBpPXR5cGVzLmxlbmd0aDsgaTsgKSB7XHJcbiAgICAgICAgJC5ldmVudC5maXhIb29rc1sgdHlwZXNbLS1pXSBdID0gJC5ldmVudC5tb3VzZUhvb2tzO1xyXG4gICAgfVxyXG59XHJcblxyXG4kLmV2ZW50LnNwZWNpYWwubW91c2V3aGVlbCA9IHtcclxuICAgIHNldHVwOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciApIHtcclxuICAgICAgICAgICAgZm9yICggdmFyIGk9dHlwZXMubGVuZ3RoOyBpOyApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciggdHlwZXNbLS1pXSwgaGFuZGxlciwgZmFsc2UgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25tb3VzZXdoZWVsID0gaGFuZGxlcjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB0ZWFyZG93bjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgKSB7XHJcbiAgICAgICAgICAgIGZvciAoIHZhciBpPXR5cGVzLmxlbmd0aDsgaTsgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGVzWy0taV0sIGhhbmRsZXIsIGZhbHNlICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9ubW91c2V3aGVlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuJC5mbi5leHRlbmQoe1xyXG4gICAgbW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICByZXR1cm4gZm4gPyB0aGlzLmJpbmQoXCJtb3VzZXdoZWVsXCIsIGZuKSA6IHRoaXMudHJpZ2dlcihcIm1vdXNld2hlZWxcIik7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICB1bm1vdXNld2hlZWw6IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudW5iaW5kKFwibW91c2V3aGVlbFwiLCBmbik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcclxuICAgIHZhciBvcmdFdmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudCwgYXJncyA9IFtdLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLCBkZWx0YSA9IDAsIHJldHVyblZhbHVlID0gdHJ1ZSwgZGVsdGFYID0gMCwgZGVsdGFZID0gMDtcclxuICAgIGV2ZW50ID0gJC5ldmVudC5maXgob3JnRXZlbnQpO1xyXG4gICAgZXZlbnQudHlwZSA9IFwibW91c2V3aGVlbFwiO1xyXG4gICAgXHJcbiAgICAvLyBPbGQgc2Nob29sIHNjcm9sbHdoZWVsIGRlbHRhXHJcbiAgICBpZiAoIG9yZ0V2ZW50LndoZWVsRGVsdGEgKSB7IGRlbHRhID0gb3JnRXZlbnQud2hlZWxEZWx0YS8xMjA7IH1cclxuICAgIGlmICggb3JnRXZlbnQuZGV0YWlsICAgICApIHsgZGVsdGEgPSAtb3JnRXZlbnQuZGV0YWlsLzM7IH1cclxuICAgIFxyXG4gICAgLy8gTmV3IHNjaG9vbCBtdWx0aWRpbWVuc2lvbmFsIHNjcm9sbCAodG91Y2hwYWRzKSBkZWx0YXNcclxuICAgIGRlbHRhWSA9IGRlbHRhO1xyXG4gICAgXHJcbiAgICAvLyBHZWNrb1xyXG4gICAgaWYgKCBvcmdFdmVudC5heGlzICE9PSB1bmRlZmluZWQgJiYgb3JnRXZlbnQuYXhpcyA9PT0gb3JnRXZlbnQuSE9SSVpPTlRBTF9BWElTICkge1xyXG4gICAgICAgIGRlbHRhWSA9IDA7XHJcbiAgICAgICAgZGVsdGFYID0gLTEqZGVsdGE7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIFdlYmtpdFxyXG4gICAgaWYgKCBvcmdFdmVudC53aGVlbERlbHRhWSAhPT0gdW5kZWZpbmVkICkgeyBkZWx0YVkgPSBvcmdFdmVudC53aGVlbERlbHRhWS8xMjA7IH1cclxuICAgIGlmICggb3JnRXZlbnQud2hlZWxEZWx0YVggIT09IHVuZGVmaW5lZCApIHsgZGVsdGFYID0gLTEqb3JnRXZlbnQud2hlZWxEZWx0YVgvMTIwOyB9XHJcbiAgICBcclxuICAgIC8vIEFkZCBldmVudCBhbmQgZGVsdGEgdG8gdGhlIGZyb250IG9mIHRoZSBhcmd1bWVudHNcclxuICAgIGFyZ3MudW5zaGlmdChldmVudCwgZGVsdGEsIGRlbHRhWCwgZGVsdGFZKTtcclxuICAgIFxyXG4gICAgcmV0dXJuICgkLmV2ZW50LmRpc3BhdGNoIHx8ICQuZXZlbnQuaGFuZGxlKS5hcHBseSh0aGlzLCBhcmdzKTtcclxufVxyXG5cclxufSkoalF1ZXJ5KTtcclxuIiwiLyogTW9kZXJuaXpyIDIuNi4yIChDdXN0b20gQnVpbGQpIHwgTUlUICYgQlNEXG4gKiBCdWlsZDogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvIy1mb250ZmFjZS1iYWNrZ3JvdW5kc2l6ZS1ib3JkZXJpbWFnZS1ib3JkZXJyYWRpdXMtYm94c2hhZG93LWZsZXhib3gtZmxleGJveGxlZ2FjeS1oc2xhLW11bHRpcGxlYmdzLW9wYWNpdHktcmdiYS10ZXh0c2hhZG93LWNzc2FuaW1hdGlvbnMtY3NzY29sdW1ucy1nZW5lcmF0ZWRjb250ZW50LWNzc2dyYWRpZW50cy1jc3NyZWZsZWN0aW9ucy1jc3N0cmFuc2Zvcm1zLWNzc3RyYW5zZm9ybXMzZC1jc3N0cmFuc2l0aW9ucy1hcHBsaWNhdGlvbmNhY2hlLWNhbnZhcy1jYW52YXN0ZXh0LWRyYWdhbmRkcm9wLWhhc2hjaGFuZ2UtaGlzdG9yeS1hdWRpby12aWRlby1pbmRleGVkZGItaW5wdXQtaW5wdXR0eXBlcy1sb2NhbHN0b3JhZ2UtcG9zdG1lc3NhZ2Utc2Vzc2lvbnN0b3JhZ2Utd2Vic29ja2V0cy13ZWJzcWxkYXRhYmFzZS13ZWJ3b3JrZXJzLWdlb2xvY2F0aW9uLWlubGluZXN2Zy1zbWlsLXN2Zy1zdmdjbGlwcGF0aHMtdG91Y2gtd2ViZ2wtdGVzdHN0eWxlcy10ZXN0cHJvcC10ZXN0YWxscHJvcHMtaGFzZXZlbnQtcHJlZml4ZXMtZG9tcHJlZml4ZXNcbiAqL1xuO3dpbmRvdy5Nb2Rlcm5penI9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIEIoYSl7aS5jc3NUZXh0PWF9ZnVuY3Rpb24gQyhhLGIpe3JldHVybiBCKG0uam9pbihhK1wiO1wiKSsoYnx8XCJcIikpfWZ1bmN0aW9uIEQoYSxiKXtyZXR1cm4gdHlwZW9mIGE9PT1ifWZ1bmN0aW9uIEUoYSxiKXtyZXR1cm4hIX4oXCJcIithKS5pbmRleE9mKGIpfWZ1bmN0aW9uIEYoYSxiKXtmb3IodmFyIGQgaW4gYSl7dmFyIGU9YVtkXTtpZighRShlLFwiLVwiKSYmaVtlXSE9PWMpcmV0dXJuIGI9PVwicGZ4XCI/ZTohMH1yZXR1cm4hMX1mdW5jdGlvbiBHKGEsYixkKXtmb3IodmFyIGUgaW4gYSl7dmFyIGY9YlthW2VdXTtpZihmIT09YylyZXR1cm4gZD09PSExP2FbZV06RChmLFwiZnVuY3Rpb25cIik/Zi5iaW5kKGR8fGIpOmZ9cmV0dXJuITF9ZnVuY3Rpb24gSChhLGIsYyl7dmFyIGQ9YS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSthLnNsaWNlKDEpLGU9KGErXCIgXCIrby5qb2luKGQrXCIgXCIpK2QpLnNwbGl0KFwiIFwiKTtyZXR1cm4gRChiLFwic3RyaW5nXCIpfHxEKGIsXCJ1bmRlZmluZWRcIik/RihlLGIpOihlPShhK1wiIFwiK3Auam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIiksRyhlLGIsYykpfWZ1bmN0aW9uIEkoKXtlLmlucHV0PWZ1bmN0aW9uKGMpe2Zvcih2YXIgZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKyl0W2NbZF1dPWNbZF1pbiBqO3JldHVybiB0Lmxpc3QmJih0Lmxpc3Q9ISFiLmNyZWF0ZUVsZW1lbnQoXCJkYXRhbGlzdFwiKSYmISFhLkhUTUxEYXRhTGlzdEVsZW1lbnQpLHR9KFwiYXV0b2NvbXBsZXRlIGF1dG9mb2N1cyBsaXN0IHBsYWNlaG9sZGVyIG1heCBtaW4gbXVsdGlwbGUgcGF0dGVybiByZXF1aXJlZCBzdGVwXCIuc3BsaXQoXCIgXCIpKSxlLmlucHV0dHlwZXM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBkPTAsZSxnLGgsaT1hLmxlbmd0aDtkPGk7ZCsrKWouc2V0QXR0cmlidXRlKFwidHlwZVwiLGc9YVtkXSksZT1qLnR5cGUhPT1cInRleHRcIixlJiYoai52YWx1ZT1rLGouc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOmFic29sdXRlO3Zpc2liaWxpdHk6aGlkZGVuO1wiLC9ecmFuZ2UkLy50ZXN0KGcpJiZqLnN0eWxlLldlYmtpdEFwcGVhcmFuY2UhPT1jPyhmLmFwcGVuZENoaWxkKGopLGg9Yi5kZWZhdWx0VmlldyxlPWguZ2V0Q29tcHV0ZWRTdHlsZSYmaC5nZXRDb21wdXRlZFN0eWxlKGosbnVsbCkuV2Via2l0QXBwZWFyYW5jZSE9PVwidGV4dGZpZWxkXCImJmoub2Zmc2V0SGVpZ2h0IT09MCxmLnJlbW92ZUNoaWxkKGopKTovXihzZWFyY2h8dGVsKSQvLnRlc3QoZyl8fCgvXih1cmx8ZW1haWwpJC8udGVzdChnKT9lPWouY2hlY2tWYWxpZGl0eSYmai5jaGVja1ZhbGlkaXR5KCk9PT0hMTplPWoudmFsdWUhPWspKSxzW2FbZF1dPSEhZTtyZXR1cm4gc30oXCJzZWFyY2ggdGVsIHVybCBlbWFpbCBkYXRldGltZSBkYXRlIG1vbnRoIHdlZWsgdGltZSBkYXRldGltZS1sb2NhbCBudW1iZXIgcmFuZ2UgY29sb3JcIi5zcGxpdChcIiBcIikpfXZhciBkPVwiMi42LjJcIixlPXt9LGY9Yi5kb2N1bWVudEVsZW1lbnQsZz1cIm1vZGVybml6clwiLGg9Yi5jcmVhdGVFbGVtZW50KGcpLGk9aC5zdHlsZSxqPWIuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLGs9XCI6KVwiLGw9e30udG9TdHJpbmcsbT1cIiAtd2Via2l0LSAtbW96LSAtby0gLW1zLSBcIi5zcGxpdChcIiBcIiksbj1cIldlYmtpdCBNb3ogTyBtc1wiLG89bi5zcGxpdChcIiBcIikscD1uLnRvTG93ZXJDYXNlKCkuc3BsaXQoXCIgXCIpLHE9e3N2ZzpcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJ9LHI9e30scz17fSx0PXt9LHU9W10sdj11LnNsaWNlLHcseD1mdW5jdGlvbihhLGMsZCxlKXt2YXIgaCxpLGosayxsPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxtPWIuYm9keSxuPW18fGIuY3JlYXRlRWxlbWVudChcImJvZHlcIik7aWYocGFyc2VJbnQoZCwxMCkpd2hpbGUoZC0tKWo9Yi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGouaWQ9ZT9lW2RdOmcrKGQrMSksbC5hcHBlbmRDaGlsZChqKTtyZXR1cm4gaD1bXCImIzE3MztcIiwnPHN0eWxlIGlkPVwicycsZywnXCI+JyxhLFwiPC9zdHlsZT5cIl0uam9pbihcIlwiKSxsLmlkPWcsKG0/bDpuKS5pbm5lckhUTUwrPWgsbi5hcHBlbmRDaGlsZChsKSxtfHwobi5zdHlsZS5iYWNrZ3JvdW5kPVwiXCIsbi5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGs9Zi5zdHlsZS5vdmVyZmxvdyxmLnN0eWxlLm92ZXJmbG93PVwiaGlkZGVuXCIsZi5hcHBlbmRDaGlsZChuKSksaT1jKGwsYSksbT9sLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobCk6KG4ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuKSxmLnN0eWxlLm92ZXJmbG93PWspLCEhaX0seT1mdW5jdGlvbigpe2Z1bmN0aW9uIGQoZCxlKXtlPWV8fGIuY3JlYXRlRWxlbWVudChhW2RdfHxcImRpdlwiKSxkPVwib25cIitkO3ZhciBmPWQgaW4gZTtyZXR1cm4gZnx8KGUuc2V0QXR0cmlidXRlfHwoZT1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLGUuc2V0QXR0cmlidXRlJiZlLnJlbW92ZUF0dHJpYnV0ZSYmKGUuc2V0QXR0cmlidXRlKGQsXCJcIiksZj1EKGVbZF0sXCJmdW5jdGlvblwiKSxEKGVbZF0sXCJ1bmRlZmluZWRcIil8fChlW2RdPWMpLGUucmVtb3ZlQXR0cmlidXRlKGQpKSksZT1udWxsLGZ9dmFyIGE9e3NlbGVjdDpcImlucHV0XCIsY2hhbmdlOlwiaW5wdXRcIixzdWJtaXQ6XCJmb3JtXCIscmVzZXQ6XCJmb3JtXCIsZXJyb3I6XCJpbWdcIixsb2FkOlwiaW1nXCIsYWJvcnQ6XCJpbWdcIn07cmV0dXJuIGR9KCksej17fS5oYXNPd25Qcm9wZXJ0eSxBOyFEKHosXCJ1bmRlZmluZWRcIikmJiFEKHouY2FsbCxcInVuZGVmaW5lZFwiKT9BPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHouY2FsbChhLGIpfTpBPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGIgaW4gYSYmRChhLmNvbnN0cnVjdG9yLnByb3RvdHlwZVtiXSxcInVuZGVmaW5lZFwiKX0sRnVuY3Rpb24ucHJvdG90eXBlLmJpbmR8fChGdW5jdGlvbi5wcm90b3R5cGUuYmluZD1mdW5jdGlvbihiKXt2YXIgYz10aGlzO2lmKHR5cGVvZiBjIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgZD12LmNhbGwoYXJndW1lbnRzLDEpLGU9ZnVuY3Rpb24oKXtpZih0aGlzIGluc3RhbmNlb2YgZSl7dmFyIGE9ZnVuY3Rpb24oKXt9O2EucHJvdG90eXBlPWMucHJvdG90eXBlO3ZhciBmPW5ldyBhLGc9Yy5hcHBseShmLGQuY29uY2F0KHYuY2FsbChhcmd1bWVudHMpKSk7cmV0dXJuIE9iamVjdChnKT09PWc/ZzpmfXJldHVybiBjLmFwcGx5KGIsZC5jb25jYXQodi5jYWxsKGFyZ3VtZW50cykpKX07cmV0dXJuIGV9KSxyLmZsZXhib3g9ZnVuY3Rpb24oKXtyZXR1cm4gSChcImZsZXhXcmFwXCIpfSxyLmZsZXhib3hsZWdhY3k9ZnVuY3Rpb24oKXtyZXR1cm4gSChcImJveERpcmVjdGlvblwiKX0sci5jYW52YXM9ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cmV0dXJuISFhLmdldENvbnRleHQmJiEhYS5nZXRDb250ZXh0KFwiMmRcIil9LHIuY2FudmFzdGV4dD1mdW5jdGlvbigpe3JldHVybiEhZS5jYW52YXMmJiEhRChiLmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpLmZpbGxUZXh0LFwiZnVuY3Rpb25cIil9LHIud2ViZ2w9ZnVuY3Rpb24oKXtyZXR1cm4hIWEuV2ViR0xSZW5kZXJpbmdDb250ZXh0fSxyLnRvdWNoPWZ1bmN0aW9uKCl7dmFyIGM7cmV0dXJuXCJvbnRvdWNoc3RhcnRcImluIGF8fGEuRG9jdW1lbnRUb3VjaCYmYiBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2g/Yz0hMDp4KFtcIkBtZWRpYSAoXCIsbS5qb2luKFwidG91Y2gtZW5hYmxlZCksKFwiKSxnLFwiKVwiLFwieyNtb2Rlcm5penJ7dG9wOjlweDtwb3NpdGlvbjphYnNvbHV0ZX19XCJdLmpvaW4oXCJcIiksZnVuY3Rpb24oYSl7Yz1hLm9mZnNldFRvcD09PTl9KSxjfSxyLmdlb2xvY2F0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuXCJnZW9sb2NhdGlvblwiaW4gbmF2aWdhdG9yfSxyLnBvc3RtZXNzYWdlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLnBvc3RNZXNzYWdlfSxyLndlYnNxbGRhdGFiYXNlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLm9wZW5EYXRhYmFzZX0sci5pbmRleGVkREI9ZnVuY3Rpb24oKXtyZXR1cm4hIUgoXCJpbmRleGVkREJcIixhKX0sci5oYXNoY2hhbmdlPWZ1bmN0aW9uKCl7cmV0dXJuIHkoXCJoYXNoY2hhbmdlXCIsYSkmJihiLmRvY3VtZW50TW9kZT09PWN8fGIuZG9jdW1lbnRNb2RlPjcpfSxyLmhpc3Rvcnk9ZnVuY3Rpb24oKXtyZXR1cm4hIWEuaGlzdG9yeSYmISFoaXN0b3J5LnB1c2hTdGF0ZX0sci5kcmFnYW5kZHJvcD1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYXx8XCJvbmRyYWdzdGFydFwiaW4gYSYmXCJvbmRyb3BcImluIGF9LHIud2Vic29ja2V0cz1mdW5jdGlvbigpe3JldHVyblwiV2ViU29ja2V0XCJpbiBhfHxcIk1veldlYlNvY2tldFwiaW4gYX0sci5yZ2JhPWZ1bmN0aW9uKCl7cmV0dXJuIEIoXCJiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMTUwLDI1NSwxNTAsLjUpXCIpLEUoaS5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfSxyLmhzbGE9ZnVuY3Rpb24oKXtyZXR1cm4gQihcImJhY2tncm91bmQtY29sb3I6aHNsYSgxMjAsNDAlLDEwMCUsLjUpXCIpLEUoaS5iYWNrZ3JvdW5kQ29sb3IsXCJyZ2JhXCIpfHxFKGkuYmFja2dyb3VuZENvbG9yLFwiaHNsYVwiKX0sci5tdWx0aXBsZWJncz1mdW5jdGlvbigpe3JldHVybiBCKFwiYmFja2dyb3VuZDp1cmwoaHR0cHM6Ly8pLHVybChodHRwczovLykscmVkIHVybChodHRwczovLylcIiksLyh1cmxcXHMqXFwoLio/KXszfS8udGVzdChpLmJhY2tncm91bmQpfSxyLmJhY2tncm91bmRzaXplPWZ1bmN0aW9uKCl7cmV0dXJuIEgoXCJiYWNrZ3JvdW5kU2l6ZVwiKX0sci5ib3JkZXJpbWFnZT1mdW5jdGlvbigpe3JldHVybiBIKFwiYm9yZGVySW1hZ2VcIil9LHIuYm9yZGVycmFkaXVzPWZ1bmN0aW9uKCl7cmV0dXJuIEgoXCJib3JkZXJSYWRpdXNcIil9LHIuYm94c2hhZG93PWZ1bmN0aW9uKCl7cmV0dXJuIEgoXCJib3hTaGFkb3dcIil9LHIudGV4dHNoYWRvdz1mdW5jdGlvbigpe3JldHVybiBiLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikuc3R5bGUudGV4dFNoYWRvdz09PVwiXCJ9LHIub3BhY2l0eT1mdW5jdGlvbigpe3JldHVybiBDKFwib3BhY2l0eTouNTVcIiksL14wLjU1JC8udGVzdChpLm9wYWNpdHkpfSxyLmNzc2FuaW1hdGlvbnM9ZnVuY3Rpb24oKXtyZXR1cm4gSChcImFuaW1hdGlvbk5hbWVcIil9LHIuY3NzY29sdW1ucz1mdW5jdGlvbigpe3JldHVybiBIKFwiY29sdW1uQ291bnRcIil9LHIuY3NzZ3JhZGllbnRzPWZ1bmN0aW9uKCl7dmFyIGE9XCJiYWNrZ3JvdW5kLWltYWdlOlwiLGI9XCJncmFkaWVudChsaW5lYXIsbGVmdCB0b3AscmlnaHQgYm90dG9tLGZyb20oIzlmOSksdG8od2hpdGUpKTtcIixjPVwibGluZWFyLWdyYWRpZW50KGxlZnQgdG9wLCM5ZjksIHdoaXRlKTtcIjtyZXR1cm4gQigoYStcIi13ZWJraXQtIFwiLnNwbGl0KFwiIFwiKS5qb2luKGIrYSkrbS5qb2luKGMrYSkpLnNsaWNlKDAsLWEubGVuZ3RoKSksRShpLmJhY2tncm91bmRJbWFnZSxcImdyYWRpZW50XCIpfSxyLmNzc3JlZmxlY3Rpb25zPWZ1bmN0aW9uKCl7cmV0dXJuIEgoXCJib3hSZWZsZWN0XCIpfSxyLmNzc3RyYW5zZm9ybXM9ZnVuY3Rpb24oKXtyZXR1cm4hIUgoXCJ0cmFuc2Zvcm1cIil9LHIuY3NzdHJhbnNmb3JtczNkPWZ1bmN0aW9uKCl7dmFyIGE9ISFIKFwicGVyc3BlY3RpdmVcIik7cmV0dXJuIGEmJlwid2Via2l0UGVyc3BlY3RpdmVcImluIGYuc3R5bGUmJngoXCJAbWVkaWEgKHRyYW5zZm9ybS0zZCksKC13ZWJraXQtdHJhbnNmb3JtLTNkKXsjbW9kZXJuaXpye2xlZnQ6OXB4O3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDozcHg7fX1cIixmdW5jdGlvbihiLGMpe2E9Yi5vZmZzZXRMZWZ0PT09OSYmYi5vZmZzZXRIZWlnaHQ9PT0zfSksYX0sci5jc3N0cmFuc2l0aW9ucz1mdW5jdGlvbigpe3JldHVybiBIKFwidHJhbnNpdGlvblwiKX0sci5mb250ZmFjZT1mdW5jdGlvbigpe3ZhciBhO3JldHVybiB4KCdAZm9udC1mYWNlIHtmb250LWZhbWlseTpcImZvbnRcIjtzcmM6dXJsKFwiaHR0cHM6Ly9cIil9JyxmdW5jdGlvbihjLGQpe3ZhciBlPWIuZ2V0RWxlbWVudEJ5SWQoXCJzbW9kZXJuaXpyXCIpLGY9ZS5zaGVldHx8ZS5zdHlsZVNoZWV0LGc9Zj9mLmNzc1J1bGVzJiZmLmNzc1J1bGVzWzBdP2YuY3NzUnVsZXNbMF0uY3NzVGV4dDpmLmNzc1RleHR8fFwiXCI6XCJcIjthPS9zcmMvaS50ZXN0KGcpJiZnLmluZGV4T2YoZC5zcGxpdChcIiBcIilbMF0pPT09MH0pLGF9LHIuZ2VuZXJhdGVkY29udGVudD1mdW5jdGlvbigpe3ZhciBhO3JldHVybiB4KFtcIiNcIixnLFwie2ZvbnQ6MC8wIGF9I1wiLGcsJzphZnRlcntjb250ZW50OlwiJyxrLCdcIjt2aXNpYmlsaXR5OmhpZGRlbjtmb250OjNweC8xIGF9J10uam9pbihcIlwiKSxmdW5jdGlvbihiKXthPWIub2Zmc2V0SGVpZ2h0Pj0zfSksYX0sci52aWRlbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcInZpZGVvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMuaDI2ND1hLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndlYm09YS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpfWNhdGNoKGQpe31yZXR1cm4gY30sci5hdWRpbz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpLGM9ITE7dHJ5e2lmKGM9ISFhLmNhblBsYXlUeXBlKWM9bmV3IEJvb2xlYW4oYyksYy5vZ2c9YS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubXAzPWEuY2FuUGxheVR5cGUoXCJhdWRpby9tcGVnO1wiKS5yZXBsYWNlKC9ebm8kLyxcIlwiKSxjLndhdj1hLmNhblBsYXlUeXBlKCdhdWRpby93YXY7IGNvZGVjcz1cIjFcIicpLnJlcGxhY2UoL15ubyQvLFwiXCIpLGMubTRhPShhLmNhblBsYXlUeXBlKFwiYXVkaW8veC1tNGE7XCIpfHxhLmNhblBsYXlUeXBlKFwiYXVkaW8vYWFjO1wiKSkucmVwbGFjZSgvXm5vJC8sXCJcIil9Y2F0Y2goZCl7fXJldHVybiBjfSxyLmxvY2Fsc3RvcmFnZT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oZyxnKSxsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShnKSwhMH1jYXRjaChhKXtyZXR1cm4hMX19LHIuc2Vzc2lvbnN0b3JhZ2U9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oZyxnKSxzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGcpLCEwfWNhdGNoKGEpe3JldHVybiExfX0sci53ZWJ3b3JrZXJzPWZ1bmN0aW9uKCl7cmV0dXJuISFhLldvcmtlcn0sci5hcHBsaWNhdGlvbmNhY2hlPWZ1bmN0aW9uKCl7cmV0dXJuISFhLmFwcGxpY2F0aW9uQ2FjaGV9LHIuc3ZnPWZ1bmN0aW9uKCl7cmV0dXJuISFiLmNyZWF0ZUVsZW1lbnROUyYmISFiLmNyZWF0ZUVsZW1lbnROUyhxLnN2ZyxcInN2Z1wiKS5jcmVhdGVTVkdSZWN0fSxyLmlubGluZXN2Zz1mdW5jdGlvbigpe3ZhciBhPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm4gYS5pbm5lckhUTUw9XCI8c3ZnLz5cIiwoYS5maXJzdENoaWxkJiZhLmZpcnN0Q2hpbGQubmFtZXNwYWNlVVJJKT09cS5zdmd9LHIuc21pbD1mdW5jdGlvbigpe3JldHVybiEhYi5jcmVhdGVFbGVtZW50TlMmJi9TVkdBbmltYXRlLy50ZXN0KGwuY2FsbChiLmNyZWF0ZUVsZW1lbnROUyhxLnN2ZyxcImFuaW1hdGVcIikpKX0sci5zdmdjbGlwcGF0aHM9ZnVuY3Rpb24oKXtyZXR1cm4hIWIuY3JlYXRlRWxlbWVudE5TJiYvU1ZHQ2xpcFBhdGgvLnRlc3QobC5jYWxsKGIuY3JlYXRlRWxlbWVudE5TKHEuc3ZnLFwiY2xpcFBhdGhcIikpKX07Zm9yKHZhciBKIGluIHIpQShyLEopJiYodz1KLnRvTG93ZXJDYXNlKCksZVt3XT1yW0pdKCksdS5wdXNoKChlW3ddP1wiXCI6XCJuby1cIikrdykpO3JldHVybiBlLmlucHV0fHxJKCksZS5hZGRUZXN0PWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGE9PVwib2JqZWN0XCIpZm9yKHZhciBkIGluIGEpQShhLGQpJiZlLmFkZFRlc3QoZCxhW2RdKTtlbHNle2E9YS50b0xvd2VyQ2FzZSgpO2lmKGVbYV0hPT1jKXJldHVybiBlO2I9dHlwZW9mIGI9PVwiZnVuY3Rpb25cIj9iKCk6Yix0eXBlb2YgZW5hYmxlQ2xhc3NlcyE9XCJ1bmRlZmluZWRcIiYmZW5hYmxlQ2xhc3NlcyYmKGYuY2xhc3NOYW1lKz1cIiBcIisoYj9cIlwiOlwibm8tXCIpK2EpLGVbYV09Yn1yZXR1cm4gZX0sQihcIlwiKSxoPWo9bnVsbCxlLl92ZXJzaW9uPWQsZS5fcHJlZml4ZXM9bSxlLl9kb21QcmVmaXhlcz1wLGUuX2Nzc29tUHJlZml4ZXM9byxlLmhhc0V2ZW50PXksZS50ZXN0UHJvcD1mdW5jdGlvbihhKXtyZXR1cm4gRihbYV0pfSxlLnRlc3RBbGxQcm9wcz1ILGUudGVzdFN0eWxlcz14LGV9KHRoaXMsdGhpcy5kb2N1bWVudCk7IiwiLypcclxuICog0JfQsNCy0LjRgdC40YIg0L7RgiBqcXVlcnksIGpxdWVyeS5tb3VzZXdoZWVsINC4IGpxdWVyeS5jdXN0b20uXHJcbiAqXHJcbiAqINCS0LDQttC90L7QtSDQvtCz0YDQsNC90LjRh9C10L3QuNC1OiDQv9C+0LrQsCDRh9GC0L4g0YHQu9C+0Lgg0YHQviDRgdC60L7RgNC+0YHRgtGP0LzQuCDQvNC10L3RjNGI0LUg0LXQtNC40L3QuNGG0YtcclxuICogKNC/0LXRgNC10LTQstC40LPQsNGO0YnQuNC10YHRjyDQvNC10LTQu9C10L3QtdC1LCDRh9C10Lwg0LfRgNC40YLQtdC70YwpXHJcbiAqINGA0LDQsdC+0YLQsNGO0YIg0YLQvtC70YzQutC+INCx0YPQtNGD0YfQuCDRgNCw0LfQvNC10YnQtdC90Ysg0L/RgNGP0LzQviDQstC90YPRgtGA0Lgg0YHQu9Cw0LnQtNCwLFxyXG4gKiDQsCDQvdC1INCyINCz0LvRg9Cx0LjQvdC1INCy0LXRgNGB0YLQutC4LlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgSG90IERvdCBMaWNlbnNlZCBNSVRcclxuICogaHR0cDovL2hvdGRvdC5wcm8vXHJcbiAqICovXHJcblxyXG52YXIgcGFyYVNhbXBsZSA9IHt9LCB1dGlsTGliID0ge30sXHJcblxyXG5cdHdpbmRvd1dpZHRoLCBcclxuXHR3aW5kb3dIZWlnaHQsIFxyXG5cdHdpbmRvd0FzcGVjdCwgXHJcblx0YmFzZUZvbnRTaXplLFxyXG5cdHBhcmEsIFxyXG5cdHdoZWVsc3RlcCxcclxuXHRhUkNEZXNjcmlwdCxcclxuLypcclxuICog0KXRgNCw0L3QuNGCINC60LDRgNGC0LjQvdC60LgsINC60L7RgtC+0YDRi9C1INGF0L7RgtGMINC4INC90LUg0LLQuNC00L3RiyxcclxuICog0L3QviDQsdGD0LTRg9GCINC30LDQs9GA0YPQttC10L3RiyDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtSDRgdGC0YDQsNC90LjRhtGLXHJcbiAqL1xyXG5cdGhpZGRlbkltYWdlc0NvbnRhaW5lcixcclxuXHJcblxyXG5cdGlQYWRNb2RlID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVAvaSksIFxyXG5cdHN1cHBvcnRzVG91Y2hFdmVudHMgPSBcclxuXHRcdCgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHx8ICggL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmV8WnVuZVdQNy9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgKTtcclxuXHJcbi8qICovXHJcblxyXG4oZnVuY3Rpb24obm1zcGMpIHtcclxuXHJcblx0dmFyIGFsZXJ0RmFsbGJhY2sgPSBmYWxzZTtcclxuXHRpZiAoIHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlLmxvZyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0YWxlcnQoJ29oIG5vJyk7XHJcblx0XHRjb25zb2xlID0ge307XHJcblx0XHRpZiAoYWxlcnRGYWxsYmFjaykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKG1zZykge1xyXG5cdFx0XHRcdGFsZXJ0KG1zZyk7XHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyogKi9cclxuXHJcblx0bm1zcGMuREVWSUNFX1RZUEVTID0ge1xyXG5cdFx0aVBhZCA6ICdpUGFkJyxcclxuXHRcdGlQaG9uZTogJ2lQaG9uZScsXHJcblx0XHRhbmRyb2lkIDogJ2FuZHJvaWQnLFxyXG5cdFx0ZGVza3RvcCA6ICdkZXNrdG9wJyxcclxuXHRcdHdQaG9uZSA6ICd3UGhvbmUnXHJcblx0fVxyXG5cdFxyXG5cdG5tc3BjLkJST1dTRVJTID0ge1xyXG5cdFx0c2FmYXJpOiAnU2FmYXJpJyxcclxuXHRcdGNocm9tZTogJ0Nocm9tZSdcclxuXHR9XHJcblx0XHJcblx0bm1zcGMuT1NfVFlQRVMgPSB7XHJcblx0XHRtYWM6ICdNYWMgT1MnLFxyXG5cdFx0d2luOiAnV2luZG93cydcclxuXHR9XHJcblxyXG5cdG5tc3BjLmRldmljZURlc2NyaXB0aW9uID0ge1xyXG5cdFx0dHlwZSA6IHVuZGVmaW5lZCxcclxuXHRcdGJyb3dzZXIgOiB1bmRlZmluZWQsXHJcblx0XHR0b3VjaENhcGFibGUgOiBmYWxzZVxyXG5cdH1cclxuXHRcclxuXHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi50eXBlID0gbm1zcGMuREVWSUNFX1RZUEVTLmRlc2t0b3A7XHJcblxyXG5cdGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ2lQYWQnKSA+IC0xKSB7XHJcblx0XHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi50eXBlID0gbm1zcGMuREVWSUNFX1RZUEVTLmlQYWQ7XHJcblx0fSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ2lQaG9uZScpID4gLTEpIHtcclxuXHRcdG5tc3BjLmRldmljZURlc2NyaXB0aW9uLnR5cGUgPSBubXNwYy5ERVZJQ0VfVFlQRVMuaVBob25lO1xyXG5cdH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSkge1xyXG5cdFx0bm1zcGMuZGV2aWNlRGVzY3JpcHRpb24udHlwZSA9IG5tc3BjLkRFVklDRV9UWVBFUy5hbmRyb2lkO1xyXG5cdH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdXaW5kb3dzIFBob25lJykgPiAtMSkge1xyXG5cdFx0bm1zcGMuZGV2aWNlRGVzY3JpcHRpb24udHlwZSA9IG5tc3BjLkRFVklDRV9UWVBFUy53UGhvbmU7XHJcblx0fVxyXG5cclxuXHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA+IC0xICl7XHJcblx0XHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi5icm93c2VyID0gbm1zcGMuQlJPV1NFUlMuY2hyb21lO1xyXG5cdH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdTYWZhcmknKSA+IC0xKSB7XHJcblx0XHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi5icm93c2VyID0gbm1zcGMuQlJPV1NFUlMuc2FmYXJpO1xyXG5cdH1cclxuXHRcclxuXHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi5vcyA9IHVuZGVmaW5lZDtcclxuXHRcclxuXHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNYWMgT1MnKSA+IC0xICl7XHJcblx0XHRubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi5vcyA9IG5tc3BjLk9TX1RZUEVTLm1hYztcclxuXHR9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignV2luZG93cycpID4gLTEgKXtcclxuXHRcdG5tc3BjLmRldmljZURlc2NyaXB0aW9uLm9zID0gbm1zcGMuT1NfVFlQRVMud2luO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoKCB0eXBlb2YgVG91Y2ggPT0gXCJvYmplY3RcIikgfHwgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpIHtcclxuXHRcdG5tc3BjLmRldmljZURlc2NyaXB0aW9uLnRvdWNoQ2FwYWJsZSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHQvKiAqL1xyXG5cclxuXHRubXNwYy5kZWJ1ID0gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignP2RlYnVnJykgPiAtMTtcclxuXHR2YXIgJGRlYldpbmRvdztcclxuXHJcblx0bm1zcGMuZGViTG9nID0gZnVuY3Rpb24oc3RyKSB7XHJcblx0XHRpZiAoISRkZWJXaW5kb3cpXHJcblx0XHRcdHJldHVybjtcclxuXHRcdCRkZWJXaW5kb3cucHJlcGVuZCgkKCc8cD4nICsgc3RyICsgJzwvcD4nKSk7XHJcblx0fVxyXG5cclxuXHQkKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGlmIChubXNwYy5kZWJ1KSB7XHJcblxyXG5cdFx0XHQkZGViV2luZG93ID0gJCgnPGRpdj48L2Rpdj4nKS5jc3Moe1xyXG5cdFx0XHRcdHBvc2l0aW9uIDogJ2ZpeGVkJyxcclxuXHRcdFx0XHR0b3AgOiAwLFxyXG5cdFx0XHRcdHJpZ2h0IDogMCxcclxuXHRcdFx0XHRkaXNwbGF5IDogJ2lubGluZS1ibG9jaycsXHJcblx0XHRcdFx0d2lkdGggOiAzMDAsXHJcblx0XHRcdFx0J21pbi1oZWlnaHQnIDogMTAwLFxyXG5cdFx0XHRcdGZvbnQgOiAnMTJweCBzYW5zLXNlcmlmJyxcclxuXHRcdFx0XHRjb2xvciA6ICdyZ2JhKDI1NSwyNTUsMjU1LC44KScsXHJcblx0XHRcdFx0J2JhY2tncm91bmQtY29sb3InIDogJ3JnYmEoMCwwLDAsLjUpJyxcclxuXHRcdFx0XHQnei1pbmRleCcgOiA5OTksXHJcblx0XHRcdFx0J21heC1oZWlnaHQnIDogJzUwJScsXHJcblx0XHRcdFx0J292ZXJmbG93LXknIDogJ3Njcm9sbCdcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoJ2JvZHknKS5hcHBlbmQoJGRlYldpbmRvdyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdG5tc3BjLmRlYkxvZyhubXNwYy5kZXZpY2VEZXNjcmlwdGlvbi50eXBlKTtcclxuXHRcdG5tc3BjLmRlYkxvZygnU3RhbmRhcmQtdG91Y2gtY2FwYWJsZTogJyArIG5tc3BjLmRldmljZURlc2NyaXB0aW9uLnRvdWNoQ2FwYWJsZSk7XHJcblxyXG5cdH0pXHJcblxyXG59KSh1dGlsTGliKTtcclxuXHJcblxyXG4oZnVuY3Rpb24oYXJnKXtcclxuXHRcclxuXHRpZighd2luZG93Lk1vZGVybml6cikgcmV0dXJuO1xyXG5cdFxyXG5cdGlmKHdpbmRvdy5Nb2Rlcm5penIuY3NzdHJhbnNmb3JtczNkKXtcclxuXHRcdHBhcmFTYW1wbGUuYmVzdFRyYW5zbGF0ZVR5cGUgPSAndHJhbnNsYXRlM2QnO1xyXG5cdH0gZWxzZSBpZih3aW5kb3cuTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMpe1xyXG5cdFx0cGFyYVNhbXBsZS5iZXN0VHJhbnNsYXRlVHlwZSA9ICd0cmFuc2xhdGUnO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRwYXJhU2FtcGxlLmJlc3RUcmFuc2xhdGVUeXBlID0gJ2xlZnQnO1xyXG5cdH1cclxuXHRcclxuXHQvLyB0cmFuc2xhdGUzZCwgbGVmdCwgdHJhbnNsYXRlXHJcblx0XHJcblx0dmFyIHRyYW5zbGF0ZVR5cGUsXHJcblx0XHR0cmFuc2Zvcm1TdHJpbmc7XHJcblx0XHJcblx0YXJnLmFwcGx5SG9yaXpvbnRhbFNoaWZ0ID0gZnVuY3Rpb24odmFsdWUsICRkaXYsIHRyYW5zbGF0ZVR5cGUpe1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdHRyYW5zbGF0ZVR5cGUgPSB0cmFuc2xhdGVUeXBlIHx8IHBhcmFTYW1wbGUuYmVzdFRyYW5zbGF0ZVR5cGU7XHJcblx0XHRcclxuXHRcdGlmICh2YWx1ZT09JycgfHwgdHJhbnNsYXRlVHlwZSAhPSAnbGVmdCcpIHtcclxuXHJcblx0XHRcdGlmICh2YWx1ZT09Jycpe1xyXG5cdFx0XHRcdHRyYW5zZm9ybVN0cmluZyA9ICcnO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRyYW5zbGF0ZVR5cGUgPT09ICd0cmFuc2xhdGUzZCcpIHtcclxuXHRcdFx0XHR0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoJyArIHZhbHVlICsgJ3B4LCAwcHgsIDBweCknO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRyYW5zbGF0ZVR5cGUgPT09ICd0cmFuc2xhdGUnKSB7XHJcblx0XHRcdFx0dHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZSgnICsgdmFsdWUgKyAncHgsIDBweCknO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRyYW5zbGF0ZVR5cGUgPT09ICd0cmFuc2xhdGVYJykge1xyXG5cdFx0XHRcdHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGVYKCcgKyB2YWx1ZSArICdweCknO1xyXG5cdFx0XHR9IGVsc2UgXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0JGRpdi5jc3Moe1xyXG5cclxuXHRcdFx0XHRXZWJraXRUcmFuc2Zvcm0gOiB0cmFuc2Zvcm1TdHJpbmcsXHJcblx0XHRcdFx0TW96VHJhbnNmb3JtIDogdHJhbnNmb3JtU3RyaW5nLFxyXG5cdFx0XHRcdFRyYW5zZm9ybSA6IHRyYW5zZm9ybVN0cmluZyxcclxuXHRcdFx0XHRtc1RyYW5zZm9ybSA6IHRyYW5zZm9ybVN0cmluZyxcclxuXHRcdFx0XHRPVHJhbnNmb3JtIDogdHJhbnNmb3JtU3RyaW5nLFxyXG5cdFx0XHRcdHRyYW5zZm9ybSA6IHRyYW5zZm9ybVN0cmluZ1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAodmFsdWU9PScnIHx8IHRyYW5zbGF0ZVR5cGUgPT0gJ2xlZnQnKSB7XHJcblxyXG5cdFx0XHQkZGl2LmNzcygnbGVmdCcsIHZhbHVlKTtcclxuXHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0pKHBhcmFTYW1wbGUpO1xyXG5cclxuXHJcbi8qICovXHJcblxyXG5wYXJhU2FtcGxlLnByZWxvYWRlckVuYWJsZWQgPSB0cnVlO1xyXG5cclxucGFyYVNhbXBsZS5zZXR0aW5ncyA9IHtcclxuXHRcclxuXHRyZW1vdmVTY3JvbGxiYXI6IFxyXG5cdFx0dXRpbExpYi5kZXZpY2VEZXNjcmlwdGlvbi50eXBlICE9IHV0aWxMaWIuREVWSUNFX1RZUEVTLndQaG9uZSxcclxuXHRcclxuXHRkaXNhYmxlQXV0b0hhc2hDaGFuZ2U6IHV0aWxMaWIuZGV2aWNlRGVzY3JpcHRpb24udHlwZSA9PSB1dGlsTGliLkRFVklDRV9UWVBFUy5hbmRyb2lkLCBcclxuXHRcdFxyXG5cdHRvdWNoTm90U2Nyb2xsTW9kZTogXHJcblx0XHQodXRpbExpYi5kZXZpY2VEZXNjcmlwdGlvbi50eXBlICE9IHV0aWxMaWIuREVWSUNFX1RZUEVTLmRlc2t0b3ApIFxyXG5cdFx0JiYgdXRpbExpYi5kZXZpY2VEZXNjcmlwdGlvbi50b3VjaENhcGFibGUsXHJcblxyXG5cdG1vdXNld2hlZWxTbG93bmVzczoge1xyXG5cdFx0d2luZG93czogMTUsXHJcblx0XHRtYWM6IDYwXHJcblx0fSxcclxuXHRcclxuXHRwYXVzZVNpZGVBbmltYXRpb25zV2hlbk1vdmluZzogdHJ1ZVxyXG5cdFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJhbGxheChwYXJhbSkge1xyXG5cclxuXHQvKiDQndCw0YHRgtGA0L7QudC60LggKi9cclxuXHJcblx0dmFyIHBhcmFsbGF4SUQgPSBcInBhcmFsbGF4XCIsIFxyXG5cdFx0b3ZlcmZsb3dzUGFyZW50Q2xhc3MgPSBcIm92ZXJmbG93c1NsaWRlXCIsIFxyXG5cdFx0d3JhcHNXaW5kb3dXaWR0aENsYXNzID0gJ3dyYXBzV2luZG93V2lkdGgnLCBcclxuXHRcdHBhcmFsYXhCYWNrZ3JvdW5kQ2xhc3MgPSAncGFyYWxsYXhCYWNrZ3JvdW5kJyxcclxuXHJcblx0Lyog0J7RgtC60LvRjtGH0LDQtdGCINGB0LrRgNC+0LvQu9Cx0LDRgCDQstC+0LLRgdC1ICovXHJcblx0c2Nyb2xsYmFyRnVsbHlSZW1vdmVkID0gcGFyYW0ucmVtb3ZlU2Nyb2xsYmFyO1xyXG5cclxuXHQvKlxyXG5cdCAqINCc0L7QttC90L4g0LfQsNC00LDRgtGMINGC0LjQvyDQsNC90LjQvNCw0YbQuNC4INC/0LDRgNCw0LvQu9Cw0LrRgdCwINC4INGB0LvQvtC10LJcclxuXHQgKiDQuCDQsNC90LjQvNC40YDRg9C10LzQvtC1INGB0LLQvtC50YHRgtCy0L4uXHJcblx0ICpcclxuXHQgKiDQlNCw0LvQtdC1INGB0LvQtdC00YPQtdGCINC+0YbQtdC90LrQsFxyXG5cdCAqINGB0L7QstC80LXRgdGC0LjQvNC+0YHRgtC4INC90LDRgdGC0YDQvtC10LpcclxuXHQgKiDQsiDQstC40LTQtSDRgtCw0LHQu9C40YbRiy5cclxuXHQgKlxyXG5cdCAqINCR0LXQtyDQsNC90LjQvNCw0YbQuNC4INCy0LjRgNGC0YPQsNC70YzQvdC+0LPQviDRgdC60YDQvtC70LvQsDpcclxuXHQgKlxyXG5cdCAqICAgICAgICAgICAgICBYICAgICBKUXVlcnkgICAgIENTUzNcclxuXHQgKiBsZWZ0ICAgICAgfFx0byAgfCAgICBvICAgIHwgICAgbyAgICB8XHJcblx0ICogdHJhbnNsYXRlIHxcdG8gIHwgICAgPyAgICB8ICAgIG8gICAgfFxyXG5cdCAqXHJcblx0ICog0KEg0LDQvdC40LzQuNGA0L7QstCw0L3QvdGL0Lwg0LLQuNGA0YLRg9Cw0LvRjNC90YvQvCDRgdC60YDQvtC70LvQvtC8OlxyXG5cdCAqXHJcblx0ICogICAgICAgICAgICAgIFggICAgIEpRdWVyeSAgICAgQ1NTM1xyXG5cdCAqIGxlZnQgICAgICB8XHRvICB8ICAgIHggICAgfCAgICB4ICAgIHxcclxuXHQgKiB0cmFuc2xhdGUgfFx0byAgfCAgICB4ICAgIHwgICAgeCAgICB8XHJcblx0ICpcclxuXHQgKlxyXG5cdCAqICAqL1xyXG5cclxuXHJcblx0dmFyIGFuaW1hdGlvblR5cGVzID0ge1xyXG5cdFx0Tk9ORSA6IDAsXHJcblx0XHRKUV9FQVNFRCA6IDEsXHJcblx0XHRDU1MzX0VBU0VEIDogMixcclxuXHRcdFNVUEVSX0VBU0VEIDogMyxcclxuXHRcdEVBU0VEIDogNFxyXG5cdH0sIHNoaWZ0UHJvcGVydHlUeXBlcyA9IHtcclxuXHRcdExFRlQgOiAnbGVmdCcsXHJcblx0XHRUUkFOU0xBVEVYIDogJ3RyYW5zbGF0ZVgnLFxyXG5cdFx0VFJBTlNMQVRFIDogJ3RyYW5zbGF0ZScsXHJcblx0XHRUUkFOU0xBVEUzRCA6ICd0cmFuc2xhdGUzZCdcclxuXHR9O1xyXG5cclxuXHR2YXIgbGF5ZXJBbmltYXRpb25UeXBlID0gYW5pbWF0aW9uVHlwZXMuTk9ORSwgXHJcblx0XHRzY3JvbGxWYWx1ZUFuaW1hdGlvblR5cGUgPSBhbmltYXRpb25UeXBlcy5FQVNFRCwgXHJcblx0XHRwYXJhbGxheExlZnRBbmltYXRpb25UeXBlID0gYW5pbWF0aW9uVHlwZXMuTk9ORTtcclxuXHJcblx0dmFyIGxheWVyU2hpZnRQcm9wZXJ0eSA9IHBhcmFtLmxheWVyU2hpZnRQcm9wZXJ0eSB8fCAnbGVmdCcsIFxyXG5cdFx0cGFyYWxsYXhTaGlmdFByb3BlcnR5ID0gcGFyYW0ucGFyYWxsYXhTaGlmdFByb3BlcnR5IHx8ICAnbGVmdCc7XHJcblxyXG5cdC8vaHR0cDovL2Vhc2luZ3MubmV0L3J1XHJcblx0dmFyIHNjcm9sbEVhc2luZyA9ICdlYXNlT3V0RXhwbycsIHNjcm9sbEFuaW1hdGlvbkR1cmF0aW9uID0gMTUwMDtcclxuXHJcblx0Lyog0JrQvtC90LXRhiDQvdCw0YHRgtGA0L7QtdC6LCDQvdCw0YfQsNC70L4g0YDQsNCx0L7Rh9C10LPQviDQutC+0LTQsCAqL1xyXG5cclxuXHR2YXIgcGFyYV9jYWNoZWQgPSB0aGlzO1xyXG5cdFxyXG5cdHZhciB3aW5kb3dXaWR0aDtcclxuXHJcblx0dmFyIHNsaWRlcyA9IHtcclxuXHRcdCRzcmMgOiB1bmRlZmluZWQsXHJcblx0XHRhcnJheSA6IFtdLFxyXG5cdFx0c2luZ2xlU2xpZGVXaWR0aCA6IDBcclxuXHR9O1xyXG5cclxuXHRcclxuXHR2YXIgc2Nyb2xsID0ge1xyXG5cdFx0YWRkIDogZnVuY3Rpb24oKSB7XHJcblx0XHR9LFxyXG5cdFx0Z2V0IDogZnVuY3Rpb24oKSB7XHJcblx0XHR9LFxyXG5cdFx0ZGVsdGEgOiAwLFxyXG5cdFx0Y3VyIDogMCxcclxuXHRcdHByZXZpb3VzIDogMCxcclxuXHRcdG1heExpbWl0IDogMCxcclxuXHRcdGZpcnN0U3RlcCA6IDAsXHJcblx0XHQkc3JjIDogdW5kZWZpbmVkLFxyXG5cdFx0c3RhcnRXaW5kb3dXaWR0aCA6IDAsXHJcblx0XHRyZXNpemVNb2RpZmllciA6IDEsXHJcblx0XHRtaW5pbWFsU3RlcCA6IDBcclxuXHR9O1xyXG5cdFxyXG5cdHBhcmFfY2FjaGVkLnNjcm9sbCA9IHNjcm9sbDtcclxuXHJcblx0dGhpcy5jdXJyZW50U2xpZGVJID0gMDtcclxuXHJcblx0dGhpcy5tb3VzZVdoZWVsVGFyZ2V0ID0gJCgnYm9keScpO1xyXG5cclxuXHR0aGlzLmZpbmRMYXllcldyYXBwZXIgPSBmdW5jdGlvbihzcmMpIHtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgcyA9IHNsaWRlcy5hcnJheVswXTsgaSA8IHNsaWRlcy5hcnJheS5sZW5ndGg7IGkrKywgcyA9IHNsaWRlcy5hcnJheVtpXSkge1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaiA9IDAsIGwgPSBzLmxheWVyc1swXTsgaiA8IHMubGF5ZXJzLmxlbmd0aDsgaisrLCBsID0gcy5sYXllcnNbal0pIHtcclxuXHJcblx0XHRcdFx0aWYgKHNyYyA9PSBsLiRzcmNbMF0pIHtcclxuXHRcdFx0XHRcdHJldHVybiBsO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHZhciBzbGlkZUNoYW5nZU1vZGVsID0gJ29uQm9yZGVyJztcclxuXHRcclxuXHRmdW5jdGlvbiBsYXllcigkc3JjLCBwcm50KSB7XHJcblxyXG5cdFx0Ly8kc3JjLnBhcmVudCgpLmNzcygnZGlzcGxheScsJycpO1xyXG5cclxuXHRcdHZhciBoYXNQYXJhbGF4QmFja2dyb3VuZENsYXNzID0gJHNyYy5oYXNDbGFzcyhwYXJhbGF4QmFja2dyb3VuZENsYXNzKTtcclxuXHJcblx0XHR0aGlzLiRzcmMgPSAkc3JjO1xyXG5cdFx0dGhpcy5wcm50ID0gcHJudDtcclxuXHRcdHRoaXMuc3BkID0gKyRzcmMuYXR0cignYWx0Jyk7XHJcblxyXG5cdFx0aWYgKGhhc1BhcmFsYXhCYWNrZ3JvdW5kQ2xhc3MpIHtcclxuXHRcdFx0JHNyYy5jc3MoJ21pbi1oZWlnaHQnLCAnMTAwJScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzbG93bmVzcyA9IDEgLSB0aGlzLnNwZCwgZXh0cmFTcGVlZCA9IHRoaXMuc3BkIC0gMTtcclxuXHJcblx0XHR2YXIgaGFsZldpbmRvd1dpZHRoLCBoYWxmUGFyZW50V2lkdGgsIHByZUNhbGN1bGF0ZWRQb3NpdGlvbiwgaGFsZldpZHRoO1xyXG5cclxuXHRcdHZhciBoYXNPdmVyZmxvd01hcmtlciA9ICRzcmMuaGFzQ2xhc3Mob3ZlcmZsb3dzUGFyZW50Q2xhc3MpLCBpc1NtYWxsQW5kU2xvdztcclxuXHJcblx0XHR2YXIgcmVsTGVmdEJvcmRlciA9IDAsIHJlbFJpZ2h0Qm9yZGVyO1xyXG5cclxuXHRcdGlmIChsYXllckFuaW1hdGlvblR5cGUgPT0gYW5pbWF0aW9uVHlwZXMuQ1NTM19FQVNFRCkge1xyXG5cdFx0XHRDU1Mzc2V0dXBBZGp1c3QobGF5ZXJTaGlmdFByb3BlcnR5LCB0aGlzLiRzcmMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYXBwbHlXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoIWhhc1BhcmFsYXhCYWNrZ3JvdW5kQ2xhc3MpIHtcclxuXHRcdFx0XHQkc3JjLmF0dHIoJ3N0eWxlJywgJycpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRwYXJhU2FtcGxlLmFwcGx5SG9yaXpvbnRhbFNoaWZ0KCcnLCAkc3JjKTtcclxuXHRcdFx0XHQkc3JjLmNzcyh7XHJcblx0XHRcdFx0XHR3aWR0aCA6ICcnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gT3BlcmE6XHJcblx0XHRcdFx0Ly8g0L/QtdGA0LXQutC70Y7Rh9C10L3QuNC1INC/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNGPXHJcblx0XHRcdFx0Ly8g0YHQu9C+0Y8g0YEg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+0LPQviDQvdCwINCw0LHRgdC+0LvRjtGC0L3QvtC1XHJcblx0XHRcdFx0Ly8g0YDRg9GI0LjRgiDQstC10YDRgdGC0LrRgy5cclxuXHRcdFx0XHR2YXIgdXNpbmdPcGVyYSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignT3BlcmEnKSA+IC0xO1xyXG5cdFx0XHRcdGlmICghdXNpbmdPcGVyYSkge1xyXG5cdFx0XHRcdFx0JHNyYy5jc3Moe1xyXG5cdFx0XHRcdFx0XHRwb3NpdGlvbiA6ICcnXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGhhbGZXaW5kb3dXaWR0aCA9IHdpbmRvd1dpZHRoIC8gMjtcclxuXHRcdFx0aGFsZlBhcmVudFdpZHRoID0gdGhpcy5wcm50LndpZHRoIC8gMjtcclxuXHJcblx0XHRcdC8qdmFyIGlzVGVzdFNsaWRlID0gZmFsc2UmJiRzcmMucGFyZW50KCkuaXMoJyNpbnRybycpOyovXHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaGFzUGFyYWxheEJhY2tncm91bmRDbGFzcykge1xyXG5cclxuXHRcdFx0XHR0aGlzLndpZHRoID0gJHNyYy53aWR0aCgpO1xyXG5cdFx0XHRcdHZhciBtaW5XaWR0aCA9IHRoaXMuc3BkICogKHRoaXMucHJudC5wcm50LndpZHRoIC0gd2luZG93V2lkdGgpICsgd2luZG93V2lkdGg7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLndpZHRoIDwgbWluV2lkdGgpIHtcclxuXHRcdFx0XHRcdHRoaXMud2lkdGggPSBtaW5XaWR0aDtcclxuXHRcdFx0XHRcdCRzcmMud2lkdGgodGhpcy53aWR0aCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyDQkdCw0LMg0LIgKHNpYyEpINCl0YDQvtC80LUuXHJcblx0XHRcdFx0Ly8g0K3Qu9C10LzQtdC90YIgPGltZyBhbHQ9XCI1LjVcIiBjbGFzcz0ndGVzdC1zdWJqZWN0JyBzcmM9XCIvc3RhdGljL2ltZy9tYWluUGFnZS9pbnRyby80LnBuZ1wiIC8+XHJcblx0XHRcdFx0Ly8g0JjQvNC10LXRgiDQv9GA0LDQstC40LvQsCwg0LzQtdC90Y/RjtGJ0LjQtSDQtdCz0L4g0LLRi9GB0L7RgtGDLlxyXG5cdFx0XHRcdC8vINCSINGN0YLQvtGCINC80L7QvNC10L3RgiDQv9GA0L7Qs9GA0LDQvNC80Ysg0KXRgNC+0Lwg0LzQtdC90Y/QtdGCINCy0YvRgdC+0YLRgyDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstC40Lgg0YEg0L/RgNCw0LLQuNC70L7QvCxcclxuXHRcdFx0XHQvLyDQvdC+INC+0YHRgtCw0LLQu9GP0LXRgiDRiNC40YDQuNC90YMg0L3QtdC40LfQvNC10L3QvdC+0LkuXHJcblx0XHRcdFx0Ly8g0J/QvtC/0YDQvtCx0YPQtdC8INCy0YvQu9C10YfQuNGC0Ywg0L3QtdCx0L7Qu9GM0YjQuNC8INCy0YHRgtGA0Y/RhdC40LLQsNC90LjQtdC8INGB0L7RgdGC0L7Rj9C90LjRjyDRjdC70LXQvNC10L3RgtCwLlxyXG5cdFx0XHRcdCRzcmMuY3NzKCdwb3NpdGlvbicsJ2Fic29sdXRlJyk7XHJcblx0XHRcdFx0LyooaWYoaXNUZXN0U2xpZGUpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJHNyYywkc3JjLndpZHRoKCkpO1xyXG5cdFx0XHRcdH0qL1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSAkc3JjLndpZHRoKCk7XHJcblx0XHRcdFx0JHNyYy5jc3MoJ3Bvc2l0aW9uJywnJyk7XHJcblx0XHRcdFx0LyppZihpc1Rlc3RTbGlkZSl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygkc3JjLCRzcmMud2lkdGgoKSk7XHJcblx0XHRcdFx0fSovXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGhhbGZXaWR0aCA9IHRoaXMud2lkdGggLyAyO1xyXG5cdFx0XHRyZWxSaWdodEJvcmRlciA9IHBybnQud2lkdGggLSB0aGlzLndpZHRoO1xyXG5cclxuXHRcdFx0aXNTbWFsbEFuZFNsb3cgPSB0aGlzLnNwZCA8PSAxICYmIHRoaXMud2lkdGggPCB0aGlzLnBybnQud2lkdGg7XHJcblx0XHRcdHRoaXMub3ZlcmZsb3dzUGFyZW50ID0gaGFzT3ZlcmZsb3dNYXJrZXIgfHwgaGFzUGFyYWxheEJhY2tncm91bmRDbGFzcyB8fCAhaXNTbWFsbEFuZFNsb3c7XHJcblxyXG5cdFx0XHR0aGlzLiRzcmMuY3NzKCdsZWZ0JywgJycpO1xyXG5cclxuXHRcdFx0Ly8gTW96OlxyXG5cdFx0XHQvLyDQldGB0LvQuCDQv9C+0LfQuNGG0LjQvtC90LjRgNC+0LLQsNC90LjQtSDRgdC70L7RjyDQvdCwINGN0YLQvtGCINC80L7QvNC10L3RgiDQsNCx0YHQvtC70Y7RgtC90L7QtSxcclxuXHRcdFx0Ly8g0YLQviDQtNCw0LbQtSDRgSDRg9GH0LXRgtC+0Lwg0YDQtdGB0LXRgtCwIGNzcygnbGVmdCcsICcnKVxyXG5cdFx0XHQvLyAuY3NzKCdsZWZ0Jykg0LHRg9C00LXRgiDQstGL0LTQsNCy0LDRgtGMINGH0LjRgdC70L7QstC+0LUg0LfQvdCw0YfQtdC90LjQtSxcclxuXHRcdFx0Ly8g0L3QtSDRgdC+0LTQtdGA0LbQsNGJ0LXQtdGB0Y8g0L3QuCDQsiDQvtC00L3QvtC8INC40Lcg0LrQsNGB0LrQsNC00L3Ri9GFINGB0YLQuNC70LXQuS5cclxuXHRcdFx0dmFyIGNzc0xlZnQgPSAkc3JjLmNzcygnbGVmdCcpO1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICog0JIg0J7Qv9C10YDQtSDQvdC10LvRjNC30Y8g0L/QtdGA0LXQutC70Y7Rh9Cw0YLRjCDQv9C+0LfQuNGG0LjQvtC90LjRgNC+0LLQsNC90LjQtSDRhNC+0L3QvtCy0L7Qs9C+INGB0LvQvtGPLFxyXG5cdFx0XHQgKiDQvdC+INC80L7QttC90L4g0L7Qv9GA0LXQtNC10LvQuNGC0YwsINGH0YLQviBjc3MtbGVmdCA9IGF1dG8sINC/0YDQuCDQsNCx0YHQvtC70Y7RgtC90L7QvC5cclxuXHRcdFx0ICog0JIgRkYg0LzQvtC20L3QviDQv9C10YDQtdC60LvRjtGH0LDRgtGMINC/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNC1INGN0YLQvtCz0L4g0YHQu9C+0Y8sXHJcblx0XHRcdCAqINC90L4g0L3QtdC70YzQt9GPINC+0L/RgNC10LTQtdC70LjRgtGMLCDRh9GC0L4gY3NzLWxlZnQgPSBhdXRvLCDQv9GA0Lgg0LDQsdGB0L7Qu9GO0YLQvdC+0LwuXHJcblx0XHRcdCAqINCg0LXRiNC10L3QuNC1OiDQtNC70Y8g0J7Qv9C10YDRiyDQstGB0LXQs9C00LAg0YHQvtGF0YDQsNC90Y/RgtGMINCw0LHRgdC+0LvRjtGC0L3QvtC1INC/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNC1LFxyXG5cdFx0XHQgKiDQtNC70Y8g0L7RgdGC0LDQu9GM0L3Ri9GFINCx0YDQsNGD0LfQtdGA0L7QsiAtLSDQvtGC0LrQu9GO0YfQsNGC0Ywg0LLQviDQstGA0LXQvNGPINC+0L/RgNC10LTQtdC70LXQvdC40Y8gY3NzLWxlZnQgPSBhdXRvLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0JHNyYy5jc3Moe1xyXG5cdFx0XHRcdGRpc3BsYXkgOiAnaW5saW5lLWJsb2NrJyxcclxuXHRcdFx0XHRvdmVyZmxvdyA6ICd2aXNpYmxlJyxcclxuXHRcdFx0XHRwb3NpdGlvbiA6ICdhYnNvbHV0ZSdcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNb3o6XHJcblx0XHRcdC8vINCt0LvQtdC80LXQvdGC0Ysg0YEg0L/QvtC30LjRhtC40L7QvdC40YDQvtCy0LDQvdC40LXQvCDQvdC1LXN0YXRpY1xyXG5cdFx0XHQvLyDQstGL0LTQsNGO0YIg0YfQuNGB0LvQtdC90L3QvtC1INC30L3QsNGH0LXQvdC40LUg0LTQsNC20LUg0L/RgNC4INC+0YLRgdGD0YLRgdGC0LLQuNC4IGxlZnQg0LIg0YHRgtC40LvQtS5cclxuXHRcdFx0aWYgKGNzc0xlZnQgPT0gJ2F1dG8nKSB7XHJcblx0XHRcdFx0dGhpcy5sZWZ0ID0gaGFsZlBhcmVudFdpZHRoIC0gaGFsZldpZHRoO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubGVmdCA9IHBhcnNlSW50KGNzc0xlZnQsIDEwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGxheWVyU2hpZnRQcm9wZXJ0eSAhPT0gc2hpZnRQcm9wZXJ0eVR5cGVzLkxFRlQpIHtcclxuXHRcdFx0XHR0aGlzLiRzcmMuY3NzKCdsZWZ0JywgJzBweCcpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc3BkID09IDApIHtcclxuXHRcdFx0XHRwcmVDYWxjdWxhdGVkUG9zaXRpb24gPSBoYWxmV2luZG93V2lkdGggLSBoYWxmV2lkdGg7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5zcGQgPiAwICYmIHRoaXMuc3BkIDwgMSkge1xyXG5cdFx0XHRcdHByZUNhbGN1bGF0ZWRQb3NpdGlvbiA9IChoYWxmV2luZG93V2lkdGggLSBoYWxmV2lkdGgpICogKDEgLSB0aGlzLnNwZCkgKyB0aGlzLmxlZnQgKiB0aGlzLnNwZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcmVDYWxjdWxhdGVkUG9zaXRpb24gPSB0aGlzLmxlZnQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0XHQvKlxyXG5cdFx0INCk0L7RgNC80YPQu9GLINC/0L7QtNGB0YfQtdGC0LAg0LIg0YHRi9GA0L7QvCDQstC40LTQtTpcclxuXHJcblx0XHQgc3BkID0gMFxyXG5cdFx0IGhhbGZXaW5kb3dXaWR0aC1oYWxmV2lkdGgraW5TY3JvbGxcclxuXHRcdCBzcGQ6ICgwLDEpXHJcblx0XHQgKGhhbGZXaW5kb3dXaWR0aC1oYWxmV2lkdGgraW5TY3JvbGwpKigxLXRoaXMuc3BkKSt0aGlzLmxlZnQqdGhpcy5zcGRcclxuXHRcdCBzcGQgPiAxXHJcblx0XHQgdGhpcy5sZWZ0LWluU2Nyb2xsKih0aGlzLnNwZC0xKVxyXG5cdFx0ICovXHJcblxyXG5cdFx0dGhpcy5wYXJhbGxheExlZnQgPSBmdW5jdGlvbihpblNjcm9sbCkge1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuc3BkID09IDApIHtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRMZWZ0ID0gcHJlQ2FsY3VsYXRlZFBvc2l0aW9uICsgaW5TY3JvbGw7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5zcGQgPiAwICYmIHRoaXMuc3BkIDwgMSkge1xyXG5cdFx0XHRcdHRoaXMuY3VycmVudExlZnQgPSBwcmVDYWxjdWxhdGVkUG9zaXRpb24gKyBpblNjcm9sbCAqIHNsb3duZXNzO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuY3VycmVudExlZnQgPSBwcmVDYWxjdWxhdGVkUG9zaXRpb24gLSBpblNjcm9sbCAqIGV4dHJhU3BlZWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuY3VycmVudExlZnRcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmFkanVzdCA9IGZ1bmN0aW9uKGluU2Nyb2xsKSB7XHJcblxyXG5cdFx0XHR2YXIgbGVmdCA9IHRoaXMucGFyYWxsYXhMZWZ0KGluU2Nyb2xsKTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCDQodC70L7Rj9C8INC90LAg0L/QtdGA0LXQtNC90LXQvCDQv9C70LDQvdC1ICjQvtGH0LXQvdGMINCx0YvRgdGC0YDRi9C8KVxyXG5cdFx0XHQg0L/QvtC30LLQvtC70Y/QtdC8INCy0YvRhdC+0LTQuNGC0Ywg0LfQsCDQs9GA0LDQvdC40YbRgyDRgdC70LDQudC00LBcclxuXHRcdFx0ICovXHJcblxyXG5cdFx0XHRpZiAoIXRoaXMub3ZlcmZsb3dzUGFyZW50KSB7XHJcblxyXG5cdFx0XHRcdHZhciBsZWZ0Qm9yZGVyID0gcmVsTGVmdEJvcmRlciwgcmlnaHRCb3JkZXIgPSByZWxSaWdodEJvcmRlcjtcclxuXHJcblx0XHRcdFx0aWYgKGxlZnQgPCBsZWZ0Qm9yZGVyKSB7XHJcblx0XHRcdFx0XHRsZWZ0ID0gbGVmdEJvcmRlcjtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGxlZnQgPiByaWdodEJvcmRlcikge1xyXG5cdFx0XHRcdFx0bGVmdCA9IHJpZ2h0Qm9yZGVyO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChsYXllckFuaW1hdGlvblR5cGUgPT0gYW5pbWF0aW9uVHlwZXMuQ1NTM19FQVNFRCB8fCBsYXllckFuaW1hdGlvblR5cGUgPT0gYW5pbWF0aW9uVHlwZXMuTk9ORSkge1xyXG5cclxuXHRcdFx0XHRwYXJhU2FtcGxlLmFwcGx5SG9yaXpvbnRhbFNoaWZ0KGxlZnQsIHRoaXMuJHNyYywgbGF5ZXJTaGlmdFByb3BlcnR5KTtcclxuXHRcdFx0fSBlbHNlIGlmIChsYXllckFuaW1hdGlvblR5cGUgPT0gYW5pbWF0aW9uVHlwZXMuSlFfRUFTRUQpIHtcclxuXHRcdFx0XHRqcXVlcnlBbmltYXRlU2hpZnQodGhpcy4kc3JjLCBsZWZ0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNsaWRlKCRzcmMsIG1hc3RlclNsaWRlLCBwcm50KSB7XHJcblxyXG5cdFx0dGhpcy5tYXN0ZXJTbGlkZSA9IG1hc3RlclNsaWRlO1xyXG5cdFx0dGhpcy5sYXllcnMgPSBbXTtcclxuXHRcdHRoaXMuJHNyYyA9ICRzcmM7XHJcblx0XHR0aGlzLmluaXRpYWxMZWZ0ID0gMDtcclxuXHRcdHRoaXMubGVmdCA9IDA7XHJcblx0XHR0aGlzLndpZHRoID0gMDtcclxuXHRcdHRoaXMuJGF4aXMgPSB7fTtcclxuXHRcdHRoaXMucHJudCA9IHBybnQ7XHJcblx0XHR2YXIgY2hpbGRyZW4gPSB0aGlzLiRzcmMuY2hpbGRyZW4oKTtcclxuXHJcblx0XHR2YXIgd2luZG93V2lkdGhfY2FjaGU7XHJcblxyXG5cdFx0dGhpcy5jaGlsZHJlblZpc2libGUgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuYWRqdXN0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmxlZnQgPSB0aGlzLmluaXRpYWxMZWZ0IC0gdGhpcy5wcm50LiRzcmMuc2Nyb2xsO1xyXG5cclxuXHRcdFx0dmFyIHJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcclxuXHJcblx0XHRcdHZhciB0b1RoZUxlZnRPZlNjcmVlbiA9IHRoaXMubGVmdCA8IDAgJiYgcmlnaHQgPCAwLCB0b1RoZVJpZ2h0T2ZTY3JlZW4gPSB0aGlzLmxlZnQgPiB3aW5kb3dXaWR0aF9jYWNoZSAmJiByaWdodCA+IHdpbmRvd1dpZHRoX2NhY2hlO1xyXG5cclxuXHRcdFx0aWYgKCh0b1RoZUxlZnRPZlNjcmVlbiB8fCB0b1RoZVJpZ2h0T2ZTY3JlZW4pXHJcblx0XHRcdFx0JiYgIXBhcmFtLm5vU2xpZGVIaWRlT3B0aW1pemF0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuY2hpbGRyZW5WaXNpYmxlKSB7XHJcblx0XHRcdFx0XHRjaGlsZHJlbi5oaWRlKCk7XHJcblx0XHRcdFx0XHR0aGlzLmNoaWxkcmVuVmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuY2hpbGRyZW5WaXNpYmxlKSB7XHJcblxyXG5cdFx0XHRcdFx0Y2hpbGRyZW4uc2hvdygpO1xyXG5cdFx0XHRcdFx0dGhpcy5jaGlsZHJlblZpc2libGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Lyog0J/QtdGA0LXRhdC+0LQg0Log0LTQvtGH0LXRgNC90LjQvCDRgdC70L7Rj9C8ICovXHJcblxyXG5cdFx0XHRcdHZhciBzY3JvbGxQb3NpdGlvbiA9IC10aGlzLmxlZnQ7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sYXllcnNbMF0sIGxlbiA9IHRoaXMubGF5ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrLCBsID0gdGhpcy5sYXllcnNbaV0pIHtcclxuXHRcdFx0XHRcdGwuYWRqdXN0KHNjcm9sbFBvc2l0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0XHR2YXIgc2xpZGUgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuYXBwbHlXaW5kb3dTaXplID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHR3aW5kb3dXaWR0aF9jYWNoZSA9IHdpbmRvd1dpZHRoO1xyXG5cdFx0XHR0aGlzLiRzcmMuY3NzKCdkaXNwbGF5JywgJycpO1xyXG5cdFx0XHRpZiAobWFzdGVyU2xpZGUpIHtcclxuXHRcdFx0XHR0aGlzLndpZHRoID0gdGhpcy5wcm50LndpZHRoO1xyXG5cdFx0XHRcdHRoaXMuaW5pdGlhbExlZnQgPSAwO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLndpZHRoID0gd2luZG93V2lkdGg7XHJcblx0XHRcdFx0dGhpcy5pbml0aWFsTGVmdCA9IHRoaXMucHJudC53aWR0aDtcclxuXHRcdFx0XHR0aGlzLiRzcmMuY3NzKCd3aWR0aCcsIHRoaXMud2lkdGgpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHRcdHRoaXMuYXBwbHlXaW5kb3dTaXplKCk7XHJcblxyXG5cdFx0dGhpcy5hcHBseVdpbmRvd1NpemVUb0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRjaGlsZHJlbi5zaG93KCk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgaiA9IHNsaWRlLmxheWVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcclxuXHRcdFx0XHRzbGlkZS5sYXllcnNbaV0uYXBwbHlXaW5kb3dTaXplKCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbml0Q2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBsYXllckNoaWxkcmVuO1xyXG5cclxuXHRcdFx0aWYgKG1hc3RlclNsaWRlKSB7XHJcblx0XHRcdFx0bGF5ZXJDaGlsZHJlbiA9IHRoaXMuJHNyYy5jaGlsZHJlbignW2FsdF0nKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsYXllckNoaWxkcmVuID0gJCgnKlthbHRdJywgdGhpcy4kc3JjKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hpbGRyZW4uc2hvdygpO1xyXG5cclxuXHRcdFx0bGF5ZXJDaGlsZHJlbi5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgJGxheWVyID0gJCh0aGlzKVxyXG5cclxuXHRcdFx0XHRpZiAoJGxheWVyLmF0dHIoJ2FsdCcpID09ICcxJykge1xyXG5cdFx0XHRcdFx0JGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJ1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRzbGlkZS4kYXhpcyA9ICRsYXllcjtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciB3cmFwcGVkID0gbmV3IGxheWVyKCRsYXllciwgc2xpZGUpO1xyXG5cdFx0XHRcdFx0c2xpZGUubGF5ZXJzLnB1c2god3JhcHBlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaW5pdENoaWxkcmVuKCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdHRoaXMuaW5pdCA9IGluaXQ7XHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcblx0XHRzbGlkZXMuJHNyYyA9ICQoJyMnICsgcGFyYWxsYXhJRCk7XHJcblx0XHRzbGlkZXMuJHNyYy5zY3JvbGwgPSAwO1xyXG5cclxuXHRcdGlmIChzY3JvbGxiYXJGdWxseVJlbW92ZWQpIHtcclxuXHRcdFx0JCgnaHRtbCcpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCdodG1sJykuY3NzKHtcclxuXHRcdFx0XHQnb3ZlcmZsb3cteCcgOiAnc2Nyb2xsJyxcclxuXHRcdFx0XHQnb3ZlcmZsb3cteScgOiAnaGlkZGVuJ1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRzbGlkZXMuJHNyYy5jaGlsZHJlbignZGl2JykuY3NzKHtcclxuXHRcdFx0aGVpZ2h0IDogJzEwMCUnLFxyXG5cdFx0XHRwb3NpdGlvbiA6ICdyZWxhdGl2ZScsXHJcblx0XHRcdGZsb2F0IDogJ2xlZnQnLFxyXG5cdFx0XHRvdmVyZmxvdyA6ICdoaWRkZW4nXHJcblx0XHR9KTtcclxuXHJcblx0XHRzbGlkZXMuJHNyYy5jc3Moe1xyXG5cdFx0XHR3aWR0aCA6ICcxMDAlJyxcclxuXHRcdFx0aGVpZ2h0IDogJzEwMCUnLFxyXG5cdFx0XHQnb3ZlcmZsb3cteCcgOiAndmlzaWJsZScsXHJcblx0XHRcdHBvc2l0aW9uIDogJ2ZpeGVkJ1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHBhcmFsbGF4TGVmdEFuaW1hdGlvblR5cGUgPT09IGFuaW1hdGlvblR5cGVzLkNTUzNfRUFTRUQpIHtcclxuXHRcdFx0Q1NTM3NldHVwQWRqdXN0KHBhcmFsbGF4U2hpZnRQcm9wZXJ0eSwgc2xpZGVzLiRzcmMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGluaXRTbGlkZXMoKTtcclxuXHJcblx0XHRhcHBseVdpbmRvd1NpemUoKTtcclxuXHRcdFxyXG5cdFx0YXBwbHlXaW5kb3dTaXplVG9QYXJhbGxheExheWVycygpO1xyXG5cclxuXHRcdHJlZnJlc2hTbGlkZXMoKTtcclxuXHRcdFxyXG5cdFx0Ly8kKCdib2R5JykuYmluZCgnbW91c2V3aGVlbCcsIG9uTW91c2VXaGVlbCk7XHJcblxyXG5cdFx0JCgnLicgKyBwYXJhbGF4QmFja2dyb3VuZENsYXNzKS5jc3MoJ3otaW5kZXgnLCAnYXV0bycpO1xyXG5cclxuXHRcdHNsaWRlcy4kc3JjLnRyaWdnZXIoJ2luaXQnKTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpbml0U2xpZGVzKCkge1xyXG5cclxuXHRcdC8qINCe0LHRi9GH0L3Ri9C1INGB0LvQsNC50LTRiyAqL1xyXG5cclxuXHRcdHNsaWRlcy5hcnJheSA9IFtdO1xyXG5cclxuXHRcdHNsaWRlcy4kc3JjLmZpbmQoJz4gZGl2JykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICRzbGlkZSA9ICQodGhpcyk7XHJcblx0XHRcdGlmICgkc2xpZGUuYXR0cignYWx0JykpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR2YXIgcCA9IG5ldyBzbGlkZSgkc2xpZGUsIGZhbHNlLCBzbGlkZXMpO1xyXG5cclxuXHRcdFx0c2xpZGVzLmFycmF5LnB1c2gocCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRwYXJhX2NhY2hlZC5zbGlkZXNDb3VudCA9IHNsaWRlcy5hcnJheS5sZW5ndGg7XHJcblxyXG5cdFx0Lyog0KHQsNC8INC/0LDRgNCw0LvQu9Cw0LrRgSDQstGL0YHRgtGD0L/QsNC10YIg0LIg0LrQsNGH0LXRgdGC0LLQtSDRgdC70LDQudC00LBcclxuXHRcdCAqINC/0L4g0L7RgtC90L7RiNC10L3QuNGOINC6INGE0L7QvdGDINC/0LDRgNCw0LvQu9Cw0LrRgdCwICovXHJcblxyXG5cdFx0dmFyIHAgPSBuZXcgc2xpZGUoc2xpZGVzLiRzcmMsIHRydWUsIHNsaWRlcyk7XHJcblx0XHRzbGlkZXMuYXJyYXkucHVzaChwKTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcHBseVdpbmRvd1NpemUoKSB7XHJcblxyXG5cdFx0d2luZG93V2lkdGggPSAkKHdpbmRvdykuaW5uZXJXaWR0aCgpO1xyXG5cclxuXHRcdHNsaWRlcy5zaW5nbGVTbGlkZVdpZHRoID0gd2luZG93V2lkdGg7XHJcblxyXG5cdFx0c2Nyb2xsLm1pbmltYWxTdGVwID0gd2luZG93V2lkdGggLyAxMDAwIC8gMTU7XHJcblxyXG5cdFx0c2xpZGVzLndpZHRoID0gMDtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMCwgbCA9IHNsaWRlcy5hcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuXHRcdFx0dmFyIHMgPSBzbGlkZXMuYXJyYXlbaV1cclxuXHRcdFx0cy5hcHBseVdpbmRvd1NpemUoKTtcclxuXHRcdFx0aWYgKCFzLm1hc3RlclNsaWRlKSB7XHJcblx0XHRcdFx0c2xpZGVzLndpZHRoICs9IHMud2lkdGg7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRzbGlkZXMuJHNyYy53aWR0aChzbGlkZXMud2lkdGgpO1xyXG5cdFx0c2Nyb2xsLm1heExpbWl0ID0gc2xpZGVzLndpZHRoIC0gd2luZG93V2lkdGg7XHJcblxyXG5cdFx0aW5pdFNjcm9sbGJhcigpO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFwcGx5V2luZG93U2l6ZVRvUGFyYWxsYXhMYXllcnMoKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgcyA9IHNsaWRlcy5hcnJheVtpXTsgaSA8IHNsaWRlcy5hcnJheS5sZW5ndGg7IGkrKywgcyA9IHNsaWRlcy5hcnJheVtpXSkge1xyXG5cclxuXHRcdFx0cy5hcHBseVdpbmRvd1NpemVUb0NoaWxkcmVuKCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHNsaWRlcy4kc3JjLnRyaWdnZXIoJ2VuZ2luZVJlYnVpbGQnLCBzbGlkZXMuJHNyYy5zY3JvbGwpXHJcblx0XHQvL2N1c3RvbUV2ZW50RW5naW5lLmNhbGwocGFyYV9jYWNoZWQsICdlbmdpbmVSZWJ1aWxkJywgc2xpZGVzLiRzcmMuc2Nyb2xsKTtcclxuXHR9XHJcblxyXG5cdHZhciBpbnRlcnZhbElELCBzdGVwVG9CZTtcclxuXHJcblx0Ly8g0KPRh9Cw0YHRgtC90LjQuiDRgdC+0LHRgdGC0LLQtdC90L3QvtGA0YPRh9C90L4g0YHQtNC10LvQsNC90L3QvtCz0L4g0YHQs9C70LDQttC10L3QvdC+0LPQviDRgdC60YDQvtC70LvQsFxyXG5cdGZ1bmN0aW9uIHN0ZXBGKCkge1xyXG5cclxuXHRcdHN0ZXBUb0JlID0gKHNjcm9sbC5jdXIgLSBzbGlkZXMuJHNyYy5zY3JvbGwpIC8gMTU7XHJcblxyXG5cdFx0aWYgKE1hdGguYWJzKHN0ZXBUb0JlKSA+IHNjcm9sbC5taW5pbWFsU3RlcCkge1xyXG5cdFx0XHRzbGlkZXMuJHNyYy5zY3JvbGwgKz0gc3RlcFRvQmU7XHJcblxyXG5cdFx0XHRyZWZyZXNoU2xpZGVzQW5kRmlyZUxpc3RlbmVycygpO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoc2Nyb2xsLmRvaW5nTmV4dE1vdmUpIHtcclxuXHRcdFx0c2Nyb2xsLmRvaW5nTmV4dE1vdmUgPSBmYWxzZTtcclxuXHJcblx0XHRcclxuXHRcdFx0c2xpZGVzLiRzcmMudHJpZ2dlcignZmluaXNoZWRNb3ZlJywgc2xpZGVzLiRzcmMuc2Nyb2xsKVxyXG5cdFx0XHRzbGlkZXMuJHNyYy5yZW1vdmVDbGFzcygnZGlzYWJsZS1ob3ZlcicpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0dmFyIHN0cmFpZ2h0U2Nyb2xsU3dpdGNoID0gZmFsc2U7XHJcblxyXG5cdGZ1bmN0aW9uIHN0cmFpZ2h0U2Nyb2xsKCkge1xyXG5cclxuXHRcdHNsaWRlcy4kc3JjLnNjcm9sbCA9IHNjcm9sbC5jdXI7XHJcblxyXG5cdFx0cmVmcmVzaFNsaWRlc0FuZEZpcmVMaXN0ZW5lcnMoKTtcclxuXHJcblx0XHRzdHJhaWdodFNjcm9sbFN3aXRjaCA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dmFyIGxhc3RTbGlkZUkgPSAwLCBjdXJyZW50U2xpZGVJID0gMCwgcmF3U2Nyb2xsID0gMDtcclxuXHJcblx0ZnVuY3Rpb24gdHJhY2tTbGlkZUNoYW5nZSgpIHtcclxuXHJcblx0XHRyYXdTY3JvbGwgPSBzY3JvbGwuY3VyIC8gc2xpZGVzLnNpbmdsZVNsaWRlV2lkdGg7XHJcblxyXG5cdFx0aWYoc2xpZGVDaGFuZ2VNb2RlbCA9PSAnb25Cb3JkZXInKXtcclxuXHRcdFx0XHJcblx0XHRcdC8vINGB0LzQtdC90LAg0L/RgNC+0LjRgdGF0L7QtNC40YJcclxuXHRcdFx0Ly8g0L3QsCDQs9GA0LDQvdC40YbQtSDRgdC70LDQudC00L7QslxyXG5cdFx0XHR3aGlsZSAocmF3U2Nyb2xsIDw9IGxhc3RTbGlkZUkgLSAuNSkge1xyXG5cdFx0XHRcdHBhcmEuY3VycmVudFNsaWRlSS0tO1xyXG5cdFx0XHRcdGxhc3RTbGlkZUkgPSBwYXJhLmN1cnJlbnRTbGlkZUk7XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0d2hpbGUgKHJhd1Njcm9sbCA+PSBsYXN0U2xpZGVJICsgLjUpIHtcclxuXHRcdFx0XHRwYXJhLmN1cnJlbnRTbGlkZUkrKztcclxuXHRcdFx0XHRsYXN0U2xpZGVJID0gcGFyYS5jdXJyZW50U2xpZGVJO1xyXG5cdFx0XHR9XHJcblx0XHRcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDRgdC80LXQvdCwINC/0YDQvtC40YHRhdC+0LTQuNGCIFxyXG5cdFx0XHQvLyDQsiDRhtC10L3RgtGA0LUg0YHQvtGB0LXQtNC90LXQs9C+INGB0LvQsNC50LTQsFxyXG5cdFx0XHR3aGlsZSAocmF3U2Nyb2xsIDw9IGxhc3RTbGlkZUkgLSAxKSB7XHJcblx0XHRcdFx0cGFyYS5jdXJyZW50U2xpZGVJLS07XHJcblx0XHRcdFx0bGFzdFNsaWRlSSA9IHBhcmEuY3VycmVudFNsaWRlSTtcclxuXHRcdFx0fVxyXG5cdFxyXG5cdFx0XHR3aGlsZSAocmF3U2Nyb2xsID49IGxhc3RTbGlkZUkgKyAxKSB7XHJcblx0XHRcdFx0cGFyYS5jdXJyZW50U2xpZGVJKys7XHJcblx0XHRcdFx0bGFzdFNsaWRlSSA9IHBhcmEuY3VycmVudFNsaWRlSTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0U2Nyb2xsUG9zaXRpb25BbmRBbmltYXRlRXZlcnl0aGluZygpIHtcclxuXHJcblx0XHRzY3JvbGwuY3VyID0gc2Nyb2xsLmdldCgpO1xyXG5cdFx0c2Nyb2xsLmRlbHRhID0gTWF0aC5hYnMoc2xpZGVzLiRzcmMuc2Nyb2xsIC0gc2Nyb2xsLmN1cik7XHJcblxyXG5cdFx0c2Nyb2xsLmRvaW5nTmV4dE1vdmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0c2xpZGVzLiRzcmMudHJpZ2dlcignc3RhcnRlZE1vdmUnLCBzbGlkZXMuJHNyYy5zY3JvbGwpXHJcblx0XHRcdHNsaWRlcy4kc3JjLmFkZENsYXNzKCdkaXNhYmxlLWhvdmVyJyk7XHJcblxyXG5cdFx0aWYgKGZhbHNlKVxyXG5cdFx0XHRhbGVydCgnZ2V0U2Nyb2xsUG9zaXRpb25BbmRBbmltYXRlRXZlcnl0aGluZyA6IC5jdXI6ICcgKyBzY3JvbGwuY3VyICsgJywgJHNyYy5zY3JvbGw6ICcgKyBzbGlkZXMuJHNyYy5zY3JvbGwpO1xyXG5cclxuXHRcdGlmIChzdHJhaWdodFNjcm9sbFN3aXRjaCkge1xyXG5cclxuXHRcdFx0c3RyYWlnaHRTY3JvbGwoKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHNjcm9sbFZhbHVlQW5pbWF0aW9uVHlwZSA9PSBhbmltYXRpb25UeXBlcy5FQVNFRCkge1xyXG5cclxuXHRcdFx0aWYgKCFpbnRlcnZhbElEKVxyXG5cdFx0XHRcdGludGVydmFsSUQgPSBzZXRJbnRlcnZhbChzdGVwRiwgMTcpO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoc2Nyb2xsVmFsdWVBbmltYXRpb25UeXBlID09IGFuaW1hdGlvblR5cGVzLlNVUEVSX0VBU0VEKSB7XHJcblx0XHRcdGlmIChzY3JvbGwuZGVsdGEgPiA3MCkge1xyXG5cclxuXHRcdFx0XHRzY3JvbGwuZmlyc3RTdGVwID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2xpZGVzLiRzcmMuc3RvcCh0cnVlLCB0cnVlKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHNjcm9sbCA6IHNjcm9sbC5jdXJcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRzdGVwIDogZnVuY3Rpb24obm93LCBmeCkge1xyXG5cclxuXHRcdFx0XHRcdFx0Lyog0LTQuNC60LjQuSDRhdCw0LogKi9cclxuXHRcdFx0XHRcdFx0aWYgKHNjcm9sbC5maXJzdFN0ZXApIHtcclxuXHRcdFx0XHRcdFx0XHRmeC5zdGFydCA9IHNsaWRlcy4kc3JjLnNjcm9sbDtcclxuXHRcdFx0XHRcdFx0XHRzY3JvbGwuZmlyc3RTdGVwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRyZWZyZXNoU2xpZGVzQW5kRmlyZUxpc3RlbmVycygpO1xyXG5cdFx0XHRcdFx0XHRzbGlkZXMuJHNyYy5zY3JvbGwgPSBub3c7XHJcblxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGR1cmF0aW9uIDogc2Nyb2xsQW5pbWF0aW9uRHVyYXRpb24sXHJcblx0XHRcdFx0XHRlYXNpbmcgOiBzY3JvbGxFYXNpbmdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdHNsaWRlcy4kc3JjLnN0b3AodHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdFx0c2xpZGVzLiRzcmMuc2Nyb2xsID0gc2Nyb2xsLmN1cjtcclxuXHRcdFx0XHRyZWZyZXNoU2xpZGVzQW5kRmlyZUxpc3RlbmVycygpXHJcblx0XHRcdH1cclxuXHJcblx0XHR9IGVsc2UgaWYgKHNjcm9sbFZhbHVlQW5pbWF0aW9uVHlwZSA9PSBhbmltYXRpb25UeXBlcy5KUV9FQVNFRCkge1xyXG5cclxuXHRcdFx0c2xpZGVzLiRzcmMuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdHNjcm9sbCA6IHNjcm9sbC5jdXJcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHN0ZXAgOiBmdW5jdGlvbihub3csIGZ4KSB7XHJcblx0XHRcdFx0XHRzbGlkZXMuJHNyYy5zY3JvbGwgPSBub3c7XHJcblx0XHRcdFx0XHRyZWZyZXNoU2xpZGVzQW5kRmlyZUxpc3RlbmVycygpO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGR1cmF0aW9uIDogc2Nyb2xsQW5pbWF0aW9uRHVyYXRpb24sXHJcblx0XHRcdFx0ZWFzaW5nIDogc2Nyb2xsRWFzaW5nXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0cmFpZ2h0U2Nyb2xsKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dHJhY2tTbGlkZUNoYW5nZSgpO1xyXG5cclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gcmVmcmVzaFNsaWRlc0FuZEZpcmVMaXN0ZW5lcnMoKXtcclxuXHRcdFxyXG5cdFx0cmVmcmVzaFNsaWRlcygpO1xyXG5cclxuXHJcblx0XHRzbGlkZXMuJHNyYy50cmlnZ2VyKCdzY3JvbGxDaGFuZ2UnLCBzbGlkZXMuJHNyYy5zY3JvbGwpXHJcblx0XHQvL2N1c3RvbUV2ZW50RW5naW5lLmNhbGwocGFyYV9jYWNoZWQsICdzY3JvbGxDaGFuZ2UnLCBzbGlkZXMuJHNyYy5zY3JvbGwpO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZWZyZXNoU2xpZGVzKCkge1xyXG5cclxuXHRcdGlmIChwYXJhbGxheExlZnRBbmltYXRpb25UeXBlID09IGFuaW1hdGlvblR5cGVzLkNTUzNfRUFTRUQgfHwgcGFyYWxsYXhMZWZ0QW5pbWF0aW9uVHlwZSA9PSBhbmltYXRpb25UeXBlcy5OT05FKSB7XHJcblx0XHRcdHBhcmFTYW1wbGUuYXBwbHlIb3Jpem9udGFsU2hpZnQoLXNsaWRlcy4kc3JjLnNjcm9sbCwgc2xpZGVzLiRzcmMsIHBhcmFsbGF4U2hpZnRQcm9wZXJ0eSk7XHJcblx0XHR9IGVsc2UgaWYgKHBhcmFsbGF4TGVmdEFuaW1hdGlvblR5cGUgPT0gYW5pbWF0aW9uVHlwZXMuSlFfRUFTRUQpIHtcclxuXHRcdFx0anF1ZXJ5QW5pbWF0ZVNoaWZ0KHNsaWRlcy4kc3JjLCAtc2xpZGVzLiRzcmMuc2Nyb2xsKTtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGZvciAodmFyIGkgPSAwLCBzID0gc2xpZGVzLmFycmF5WzBdLCBsZW4gPSBzbGlkZXMuYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyssIHMgPSBzbGlkZXMuYXJyYXlbaV0pIHtcclxuXHRcdFx0cy5hZGp1c3QoKTtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHJcblx0XHQvKlxyXG5cdFx0IGZvcih2YXIgbCBpbiBzY3JvbGxMaXN0ZW5lcnMpe1xyXG5cclxuXHRcdCBzY3JvbGxMaXN0ZW5lcnNbbF0oc2xpZGVzLiRzcmMuc2Nyb2xsKTtcclxuXHRcdCB9Ki9cclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpbml0U2Nyb2xsYmFyKCkge1xyXG5cclxuXHRcdHZhciBzY3JvbGxMaXN0ZW5lclRhcmdldDtcclxuXHJcblx0XHR2YXIgZmlyc3RJbml0ID0gc2Nyb2xsLiRzcmMgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0aWYgKCFmaXJzdEluaXQpIHtcclxuXHRcdFx0c2Nyb2xsLiRzcmMucmVtb3ZlKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzdGFydFdpbmRvd1dpZHRoID0gd2luZG93V2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBhcmFtLnRvdWNoTm90U2Nyb2xsTW9kZSkge1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICQoJ2h0bWwnKS5jc3MoJ292ZXJmbG93JywnaGlkZGVuJyk7XHJcblx0XHRcdCAkKCdib2R5JykuY3NzKCdvdmVyZmxvdycsJ2hpZGRlbicpOyovXHJcblxyXG5cdFx0XHR2YXIgZHVtbXkgPSAkKCc8ZGl2Lz4nKS5jc3Moe1xyXG5cdFx0XHRcdHBvc2l0aW9uIDogJ2Fic29sdXRlJyxcclxuXHRcdFx0XHRkaXNwbGF5IDogJ2hpZGRlbidcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoZmlyc3RJbml0KVxyXG5cdFx0XHRcdCQoJ2JvZHknKS5hcHBlbmQoZHVtbXkpO1xyXG5cclxuXHRcdFx0c2Nyb2xsLiRzcmMgPSAkKCc8ZGl2Lz4nKS5jc3Moe1xyXG5cdFx0XHRcdHdpZHRoIDogc2xpZGVzLndpZHRoLFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHZhciB0b3VjaFN0YXJ0ID0gMDtcclxuXHRcdFx0dGltZSA9IHtcclxuXHRcdFx0XHRzdGFydCA6IDAsXHJcblx0XHRcdFx0ZW5kIDogMFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGRlbHRhLCBzcGVlZCA9IHtcclxuXHRcdFx0XHRjdXIgOiAwLFxyXG5cdFx0XHRcdG1heCA6IDE1LFxyXG5cdFx0XHRcdG1pbiA6IC4xXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAoZmlyc3RJbml0KSB7XHJcblxyXG5cdFx0XHRcdHNsaWRlcy4kc3JjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24oZSkge1xyXG5cclxuXHJcblx0XHRcdFx0XHRpZiAoZS50b3VjaGVzLmxlbmd0aCA+IDEpXHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0dGltZS5lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgZGVsdGFUaW1lID0gdGltZS5lbmQgLSB0aW1lLnN0YXJ0O1xyXG5cclxuXHRcdFx0XHRcdGRlbHRhID0gZS50b3VjaGVzWzBdLnNjcmVlblggLSB0b3VjaFN0YXJ0O1xyXG5cclxuXHRcdFx0XHRcdHNwZWVkLmN1ciA9IGRlbHRhICogZGVsdGEgLyAxNSAqIChkZWx0YSA8IDAgPyAtMSA6IDEpO1xyXG5cclxuXHRcdFx0XHRcdHNjcm9sbC5hZGQoLXNwZWVkLmN1cik7XHJcblxyXG5cdFx0XHRcdFx0dG91Y2hTdGFydCA9IGUudG91Y2hlc1swXS5zY3JlZW5YO1xyXG5cclxuXHRcdFx0XHRcdHRpbWUuc3RhcnQgPSB0aW1lLmVuZDtcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHNsaWRlcy4kc3JjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHRcdFx0XHQvL2UucHJldmVudERlZmF1bHQoKTtcclxuXHJcblxyXG5cdFx0XHRcdHRpbWUuc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0XHRcdFx0XHR0b3VjaFN0YXJ0ID0gZS50b3VjaGVzWzBdLnNjcmVlblg7XHJcblxyXG5cdFx0XHRcdFx0c2Nyb2xsLnN0b3AoKTtcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbWF4U2Nyb2xsID0gc2xpZGVzLndpZHRoIC0gd2luZG93V2lkdGgsIG1pblNjcm9sbCA9IDA7XHJcblxyXG5cdFx0XHRzY3JvbGwuYWRkID0gZnVuY3Rpb24oZGVsdGEpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNjcm9sbC5jdXIgKyBkZWx0YSA+IG1heFNjcm9sbCkge1xyXG5cdFx0XHRcdFx0c2Nyb2xsLmN1ciA9IG1heFNjcm9sbFxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoc2Nyb2xsLmN1ciArIGRlbHRhIDwgbWluU2Nyb2xsKSB7XHJcblx0XHRcdFx0XHRzY3JvbGwuY3VyID0gbWluU2Nyb2xsO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzY3JvbGwuY3VyICs9IGRlbHRhO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Z2V0U2Nyb2xsUG9zaXRpb25BbmRBbmltYXRlRXZlcnl0aGluZygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzY3JvbGwuc3RvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHNjcm9sbC5jdXIgPSBzbGlkZXMuJHNyYy5zY3JvbGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcm9sbC5nZXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsLmN1cjtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdHZhciBzY3JvbGxUYXJnZXQ7XHJcblxyXG5cdFx0XHRpZiAoIXNjcm9sbGJhckZ1bGx5UmVtb3ZlZCkge1xyXG5cclxuXHRcdFx0XHRzY3JvbGwuJHNyYyA9ICQoJzxkaXYvPicpLmNzcyh7XHJcblx0XHRcdFx0XHR3aWR0aCA6IHNsaWRlcy53aWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodCA6ICcxcHgnXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsLiRzcmMpO1xyXG5cclxuXHRcdFx0XHRzY3JvbGxUYXJnZXQgPSB3aW5kb3c7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcm9sbC5nZXQgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0aWYgKHNjcm9sbGJhckZ1bGx5UmVtb3ZlZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHNjcm9sbC5jdXI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gJChzY3JvbGxUYXJnZXQpLnNjcm9sbExlZnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2Nyb2xsLmFkZCA9IGZ1bmN0aW9uKGRlbHRhKSB7XHJcblxyXG5cdFx0XHRcdGlmIChzY3JvbGxiYXJGdWxseVJlbW92ZWQpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgbmV3U2Nyb2xsID0gc2Nyb2xsLmN1ciArIGRlbHRhO1xyXG5cclxuXHRcdFx0XHRcdGlmIChuZXdTY3JvbGwgPCAwKSB7XHJcblx0XHRcdFx0XHRcdG5ld1Njcm9sbCA9IDA7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG5ld1Njcm9sbCA+IHNjcm9sbC5tYXhMaW1pdCkge1xyXG5cdFx0XHRcdFx0XHRuZXdTY3JvbGwgPSBzY3JvbGwubWF4TGltaXQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0c2Nyb2xsLmN1ciA9IG5ld1Njcm9sbDtcclxuXHRcdFx0XHRcdGdldFNjcm9sbFBvc2l0aW9uQW5kQW5pbWF0ZUV2ZXJ5dGhpbmcoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JChzY3JvbGxUYXJnZXQpLnNjcm9sbExlZnQoJChzY3JvbGxUYXJnZXQpLnNjcm9sbExlZnQoKSArIGRlbHRhKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZmlyc3RJbml0ICYmICFzY3JvbGxiYXJGdWxseVJlbW92ZWQpIHtcclxuXHJcblx0XHRcdFx0JChzY3JvbGxUYXJnZXQpLm9uKCdzY3JvbGwnLCBnZXRTY3JvbGxQb3NpdGlvbkFuZEFuaW1hdGVFdmVyeXRoaW5nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHBhcmFfY2FjaGVkLmFkZCA9IHNjcm9sbC5hZGQ7XHJcblxyXG5cdFx0cGFyYV9jYWNoZWQud2lkdGggPSBzbGlkZXMud2lkdGg7XHJcblx0fVxyXG5cclxuXHJcblx0dGhpcy50b1NsaWRlID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdGlmIChpbmRleCA+IC0xICYmIGluZGV4IDwgc2xpZGVzLmFycmF5Lmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLnRvKHdpbmRvd1dpZHRoICogaW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGhpcy50byA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRzY3JvbGwuYWRkKHZhbHVlIC0gc2Nyb2xsLmdldCgpKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xvc2VyR2VuZXJpYyhsZWZ0KSB7XHJcblx0XHR2YXIgY3VyID0gc2Nyb2xsLmdldCgpLCByb3VuID0gbGVmdCA/IE1hdGguZmxvb3IgOiBNYXRoLmNlaWwsIGN1ckluZGV4ID0gY3VyIC8gc2xpZGVzLnNpbmdsZVNsaWRlV2lkdGgsIGRlc3QgPSByb3VuKGN1ciAvIHNsaWRlcy5zaW5nbGVTbGlkZVdpZHRoKTtcclxuXHJcblx0XHRpZiAoY3VyICUgc2xpZGVzLnNpbmdsZVNsaWRlV2lkdGggPT0gMCkge1xyXG5cdFx0XHRkZXN0ICs9IGxlZnQgPyAoLTEpIDogMTtcclxuXHRcdH1cclxuXHRcdGRlc3QgKj0gc2xpZGVzLnNpbmdsZVNsaWRlV2lkdGg7XHJcblx0XHRcclxuXHRcdHBhcmFfY2FjaGVkLnRvKGRlc3QpO1xyXG5cdH1cclxuXHJcblxyXG5cdHRoaXMuY2xvc2VyTGVmdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Y2xvc2VyR2VuZXJpYyh0cnVlKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuY2xvc2VyUmlnaHQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGNsb3NlckdlbmVyaWMoZmFsc2UpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBDU1Mzc2V0dXBBZGp1c3Qoc2hpZnRQcm9wZXJ0eSwgJGRpdikge1xyXG5cclxuXHRcdHZhciB0cmFuc2lUcmFpbGVyID0gc2Nyb2xsQW5pbWF0aW9uRHVyYXRpb24gKyAnbXMgZWFzZS1pbi1vdXQgMW1zJztcclxuXHJcblx0XHRpZiAoc2hpZnRQcm9wZXJ0eSA9PSBzaGlmdFByb3BlcnR5VHlwZXMuTEVGVCkge1xyXG5cclxuXHRcdFx0dHJhbnNpID0gJ2xlZnQgJyArIHRyYW5zaVRyYWlsZXI7XHJcblxyXG5cdFx0fSBlbHNlIGlmIChzaGlmdFByb3BlcnR5ID09IHNoaWZ0UHJvcGVydHlUeXBlcy5UUkFOU0xBVEUgfHwgc2hpZnRQcm9wZXJ0eSA9PSBzaGlmdFByb3BlcnR5VHlwZXMuVFJBTlNMQVRFWCB8fCBzaGlmdFByb3BlcnR5ID09IHNoaWZ0UHJvcGVydHlUeXBlcy5UUkFOU0xBVEUzRCkge1xyXG5cclxuXHRcdFx0dHJhbnNpID0gJy13ZWJraXQtdHJhbnNmb3JtICcgKyB0cmFuc2lUcmFpbGVyO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQkZGl2LmNzcyh7XHJcblx0XHRcdFdlYmtpdFRyYW5zaXRpb24gOiB0cmFuc2ksXHJcblx0XHRcdE1velRyYW5zaXRpb24gOiB0cmFuc2ksXHJcblx0XHRcdE9UcmFuc2l0aW9uIDogdHJhbnNpLFxyXG5cdFx0XHRtc1RyYW5zaXRpb24gOiB0cmFuc2ksXHJcblx0XHRcdHRyYW5zaXRpb24gOiB0cmFuc2lcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGpxdWVyeUFuaW1hdGVTaGlmdCgkZGl2LCB2YWx1ZSkge1xyXG5cclxuXHRcdCRkaXYuc3RvcChmYWxzZSkuYW5pbWF0ZSh7XHJcblx0XHRcdGxlZnQgOiB2YWx1ZSArICdweCcsXHJcblx0XHR9LCBzY3JvbGxBbmltYXRpb25EdXJhdGlvbiwgc2Nyb2xsRWFzaW5nKTtcclxuXHR9XHJcblx0XHJcblxyXG5cdC8qINCe0LHRgNCw0YLQvdGL0LUg0YHQstGP0LfQuCAqL1xyXG5cclxuXHR2YXIgYWJzU2Nyb2xsLCByZWxhdGl2ZVNjcm9sbDtcclxuXHJcblx0dGhpcy5vblJlc2l6ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGFic1Njcm9sbCA9IHNjcm9sbC5nZXQoKTtcclxuXHRcdHJlbGF0aXZlU2Nyb2xsID0gYWJzU2Nyb2xsIC8gd2luZG93V2lkdGg7XHJcblxyXG5cdFx0YXBwbHlXaW5kb3dTaXplKCk7XHJcblxyXG5cdH1cclxuXHJcblx0dGhpcy5vblJlc2l6ZUxheWVycyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGFwcGx5V2luZG93U2l6ZVRvUGFyYWxsYXhMYXllcnMoKTtcclxuXHJcblx0XHRyZWZyZXNoU2xpZGVzQW5kRmlyZUxpc3RlbmVycygpO1xyXG5cclxuXHRcdHZhciBuZXdTY3JvbGwgPSByZWxhdGl2ZVNjcm9sbCAqIHdpbmRvd1dpZHRoO1xyXG5cclxuXHRcdHN0cmFpZ2h0U2Nyb2xsU3dpdGNoID0gdHJ1ZTtcclxuXHJcblx0XHRzY3JvbGwuYWRkKG5ld1Njcm9sbCAtIHNjcm9sbC5nZXQoKSk7XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG4gKiDQl9Cw0LPRgNGD0LfQutCwXHJcbiAqL1xyXG5cclxudmFyIHByZWxvYWRlciA9IHtcclxuXHRkaXNhYmxlIDogdW5kZWZpbmVkLFxyXG5cdHN0YXJ0IDogdW5kZWZpbmVkLFxyXG5cdG9uTG9hZCA6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblx0JHNsaWRlIDogdW5kZWZpbmVkLFxyXG5cdHZpc3VhbHMgOiB1bmRlZmluZWQsXHJcblx0ZmlsbFZpc3VhbHMgOiBmdW5jdGlvbigpIHtcclxuXHR9LFxyXG5cdGZpbGxpbmdUaW1lIDogMTQwMCxcclxuXHRkZWxheUJlZm9yZUxvYWRDaGVjayA6IDAsXHJcblx0dGFyZ2V0TG9nb1dpZHRoIDogMFxyXG59O1xyXG5cclxudmFyIGxvYWRlckNsYXNzID0gJ2xvYWRCYWNrZ3JvdW5kJztcclxuXHJcbnByZWxvYWRlci5maWxsVmlzdWFscyA9IGZ1bmN0aW9uKGZpbGxBbW91bnQsIGNhbGxiYWNrKSB7XHJcblxyXG5cdGlmICghY2FsbGJhY2spXHJcblx0XHRjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0fTtcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdHByZWxvYWRlci52aXN1YWxzLmxvYWRlZC8qLnN0b3AoZmFsc2UsIGZhbHNlKSovLmFuaW1hdGUoe1xyXG5cdFx0XHQnd2lkdGgnIDogcHJlbG9hZGVyLnRhcmdldExvZ29XaWR0aCAqIGZpbGxBbW91bnRcclxuXHRcdH0sIHtcclxuXHRcdFx0ZHVyYXRpb24gOiBwcmVsb2FkZXIuZmlsbGluZ1RpbWUsXHJcblx0XHRcdHF1ZXVlIDogZmFsc2VcclxuXHRcdH0pO1xyXG5cdFx0cHJlbG9hZGVyLnZpc3VhbHMudW5sb2FkZWQvKi5zdG9wKGZhbHNlLCBmYWxzZSkqLy5hbmltYXRlKHtcclxuXHRcdFx0J3dpZHRoJyA6ICgxIC0gZmlsbEFtb3VudCkgKiBwcmVsb2FkZXIudGFyZ2V0TG9nb1dpZHRoXHJcblx0XHR9LCB7XHJcblx0XHRcdGR1cmF0aW9uIDogcHJlbG9hZGVyLmZpbGxpbmdUaW1lLFxyXG5cdFx0XHRxdWV1ZSA6IGZhbHNlLFxyXG5cdFx0XHRjb21wbGV0ZSA6IGNhbGxiYWNrXHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn1cclxuXHJcbnByZWxvYWRlci5kaXNhYmxlID0gZnVuY3Rpb24ocGFyYW0pIHtcclxuXHJcblx0aWYgKHBhcmFtICYmIHBhcmFtLnJvdWdoKSB7XHJcblxyXG5cdFx0JCgnLicgKyBsb2FkZXJDbGFzcykucmVtb3ZlKCk7XHJcblx0XHRwcmVsb2FkZXIuJHNsaWRlLnJlbW92ZSgpO1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdCQoJy4nICsgbG9hZGVyQ2xhc3MpLmRlbGF5KDMwMCkuYW5pbWF0ZSh7XHJcblx0XHRcdCdvcGFjaXR5JyA6IDBcclxuXHRcdH0sIHByZWxvYWRlci5maWxsaW5nVGltZSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRwcmVsb2FkZXIuJHNsaWRlLmFuaW1hdGUoe1xyXG5cdFx0XHQnb3BhY2l0eScgOiAwLFxyXG5cdFx0XHQvKmxlZnQ6IFwiLVwiK3ByZWxvYWRlci4kc2xpZGUud2lkdGgoKStcInB4XCIqL1xyXG5cdFx0fSwgcHJlbG9hZGVyLmZpbGxpbmdUaW1lLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5yZW1vdmUoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcygndW5sb2FkZWQnKTtcclxuXHJcbn1cclxuJChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm47XHJcblx0dmFyICRtZWRpYSA9ICQoJ2h0bWwnKS5maW5kKCdpbWcsdmlkZW8nKTtcclxuXHJcblx0dmFyIGxjID0gMDtcclxuXHQkbWVkaWEub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdGxjKys7XHJcblx0XHR1dGlsTGliLmRlYkxvZygnbG9hZEV2ZW50KCkgZmlyZWQuIFRvdGFsIGZpcmVkOiAnICsgbGMgKyAnXFxuIFN0aWxsIG5lZWQgdG8gbG9hZCAnICsgKCRtZWRpYS5sZW5ndGggLSBsYykpO1xyXG5cdFx0Y29uc29sZS5sb2codGhpcyk7XHJcblx0fSk7XHJcblx0JG1lZGlhLm9uKCdlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0bGMrKztcclxuXHRcdHV0aWxMaWIuZGViTG9nKCdlcnJvckV2ZW50KCkgZmlyZWQuJyk7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzKTtcclxuXHR9KTtcclxufSk7XHJcblxyXG5wcmVsb2FkZXIuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcblx0cHJlbG9hZGVyLnZpc3VhbHMgPSB7XHJcblx0XHRsb2FkZWQgOiAkKCcucHJlbG9hZGVyQ29udCAuZW5kaW5nJyksXHJcblx0XHR1bmxvYWRlZCA6ICQoJy5wcmVsb2FkZXJDb250IC5zdGFydGluZycpXHJcblx0fTtcclxuXHRwcmVsb2FkZXIuJHNsaWRlID0gJCgnLnByZWxvYWRlckNvbnQnKTtcclxuXHRwcmVsb2FkZXIudGFyZ2V0TG9nb1dpZHRoID0gLjkgKiAkKHdpbmRvdykuaW5uZXJXaWR0aCgpO1xyXG59XHJcblxyXG5wcmVsb2FkZXIuc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuXHRcclxuXHRwcmVsb2FkZXIuaW5pdCgpO1xyXG5cdFxyXG5cdHZhciAkbWVkaWEgPSAkKCdodG1sJykuZmluZCgnaW1nLHZpZGVvJyk7XHJcblxyXG5cdHZhciBtZWRpYUNvdW50ID0gJG1lZGlhLmxlbmd0aDtcclxuXHJcblx0dmFyIGxvY2FsX29uQ29udGVudExvYWQgPSB0aGlzLm9uQ29udGVudExvYWQ7XHJcblxyXG5cdHZhciBsb2FkZWQgPSAwO1xyXG5cclxuXHRwcmVsb2FkZXIudmlzdWFscy5sb2FkZWRcclxuXHQuYWRkKHByZWxvYWRlci52aXN1YWxzLnVubG9hZGVkKVxyXG5cdFx0LmNzcygnb3BhY2l0eScsIDApO1xyXG5cclxuXHR2YXIgJHN1YkNvbnQgPSAkKCcucHJlbG9hZGVyQ29udCAuc3ViQ29udCcpO1xyXG5cclxuXHR2YXIgaW1hZ2VBc3BlY3QgPSBwcmVsb2FkZXIudmlzdWFscy5sb2FkZWQuZmluZCgnaW1nJykud2lkdGgoKSAvIHByZWxvYWRlci52aXN1YWxzLmxvYWRlZC5maW5kKCdpbWcnKS5oZWlnaHQoKTtcclxuXHJcblx0cHJlbG9hZGVyLnZpc3VhbHMubG9hZGVkLmZpbmQoJ2ltZycpXHJcblx0LmFkZChwcmVsb2FkZXIudmlzdWFscy51bmxvYWRlZC5maW5kKCdpbWcnKSlcclxuXHQuYWRkKHByZWxvYWRlci52aXN1YWxzLnVubG9hZGVkKVxyXG5cdFx0LmNzcygnd2lkdGgnLCBwcmVsb2FkZXIudGFyZ2V0TG9nb1dpZHRoKTtcclxuXHJcblx0JHN1YkNvbnRcclxuXHQuYWRkKHByZWxvYWRlci52aXN1YWxzLmxvYWRlZC5maW5kKCdpbWcnKSlcclxuXHQuYWRkKHByZWxvYWRlci52aXN1YWxzLnVubG9hZGVkLmZpbmQoJ2ltZycpKVxyXG5cdFx0LmNzcygnaGVpZ2h0JywgcHJlbG9hZGVyLnRhcmdldExvZ29XaWR0aCAvIGltYWdlQXNwZWN0KTtcclxuXHJcblx0XHJcblxyXG5cdGZ1bmN0aW9uIGdldEZpbGVzVG9Mb2FkQ291bnQoKSB7XHJcblxyXG5cdFx0dmFyIGEgPSAkbWVkaWEuZmlsdGVyKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8g0L/RgNC40YfQuNC90LA6INCyINC+0LTQvdC+0Lwg0LjQtyDQsdGA0LDRg9C30LXRgNC+0LIg0L3QtSDQvtCx0L3QsNGA0YPQttC40LsgY29tcGxldGUg0YMgc3ZnLdC40LfQvtCx0YDQsNC20LXQvdC40Y9cclxuXHRcdFx0aWYgKHRoaXMuc3JjICYmIHRoaXMuc3JjLmluZGV4T2YoJ3N2ZycpID4gLTEpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0Ly8g0LLQuNC00LXQvlxyXG5cdFx0XHRcdC8qUkVBRFlfU1RBVEUgaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvYXZfcHJvcF9yZWFkeXN0YXRlLmFzcCovXHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5yZWFkeVN0YXRlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZWFkeVN0YXRlID49IDMpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5jb21wbGV0ZSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9jb25zb2xlLmxvZyh0aGlzKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIGEubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0c2V0VGltZW91dChlYXJseUNhY2hlZERldGVjdGlvbiwgcHJlbG9hZGVyLmRlbGF5QmVmb3JlTG9hZENoZWNrKTtcclxuXHJcblx0ZnVuY3Rpb24gZWFybHlDYWNoZWREZXRlY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGFscmVhZHlMb2FkZWQgPSBnZXRGaWxlc1RvTG9hZENvdW50KCk7XHJcblxyXG5cdFx0aWYgKGFscmVhZHlMb2FkZWQgPT0gMCkge1xyXG5cclxuXHRcdFx0dXRpbExpYi5kZWJMb2coJ05vIG5lZWQgdG8gbG9hZC4nKTtcclxuXHJcblx0XHRcdHByZWxvYWRlci5vbkxvYWQoKTtcclxuXHRcdFx0cHJlbG9hZGVyLmRpc2FibGUoe1xyXG5cdFx0XHRcdCdyb3VnaCcgOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRwcmVsb2FkZXIudmlzdWFscy5sb2FkZWQuYWRkKHByZWxvYWRlci52aXN1YWxzLnVubG9hZGVkKS5hbmltYXRlKHtcclxuXHRcdFx0XHQnb3BhY2l0eScgOiAxXHJcblx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdGEoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGEoKSB7XHJcblxyXG5cdFx0dmFyIG5vdExvYWRlZCA9IGdldEZpbGVzVG9Mb2FkQ291bnQoKTtcclxuXHJcblx0XHR2YXIgbG9hZGVkUGFydCA9IChtZWRpYUNvdW50IC0gbm90TG9hZGVkICkgLyBtZWRpYUNvdW50O1xyXG5cclxuXHRcdGlmIChub3RMb2FkZWQgPT0gMCkge1xyXG5cclxuXHRcdFx0dXRpbExpYi5kZWJMb2coJ0ZpbmlzaGVkIGxvYWRpbmcnKTtcclxuXHJcblx0XHRcdHByZWxvYWRlci5maWxsVmlzdWFscyhsb2FkZWRQYXJ0LCBwcmVsb2FkZXIub25Mb2FkKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChhLCAxMDAwKTtcclxuXHJcblx0XHRcdHV0aWxMaWIuZGViTG9nKCdTdGlsbCBuZWVkIHRvIGxvYWQgJyArIG5vdExvYWRlZCk7XHJcblxyXG5cdFx0XHRwcmVsb2FkZXIuZmlsbFZpc3VhbHMobG9hZGVkUGFydCk7XHJcblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuXHJcblxyXG4vKlxyXG5cclxuXHRyZXNpemVhYmxlcy5qcyBcclxuXHRcclxuICog0J/QvtC20LDQu9GD0LnRgdGC0LAsINC/0YDQtdC00L7RgdGC0LDQstC70Y/QudGC0LUgXHJcbiAqINGA0LXQu9C10LLQsNC90YLQvdGL0LUg0LPQu9C+0LHQsNC70YzQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LVcclxuICogd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgd2luZG93QXNwZWN0XHJcbiAqINC/0LXRgNC10LQg0LLRi9C30L7QstCw0LzQuCByZXNpemVhYmxlcy5hZGp1c3QoKVxyXG4gKi9cclxuXHJcbnZhciByZXNpemVhYmxlcyA9IHtcclxuXHJcblx0ZW5naW5lQ3JlYXRvcjogdW5kZWZpbmVkLFxyXG5cdFxyXG5cdGVuZ2luZTogdW5kZWZpbmVkLFxyXG5cdFxyXG5cdGluaXRGcm9tRGVzY3JpcHQ6IGZ1bmN0aW9uKGQpe1xyXG5cdFx0cmVzaXplYWJsZXMuZW5naW5lLmdldENvbnRhaW5lcnNGcm9tRGVzY3JpcHQoZCk7XHJcblx0fSxcclxuXHRpbml0OiBmdW5jdGlvbigpe1xyXG5cdFx0cmVzaXplYWJsZXMuZW5naW5lLmZpbmRDb250YWluZXJzKCk7XHJcblx0fSxcclxuXHRhZGp1c3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXNpemVhYmxlcy5lbmdpbmUuYWRqdXN0KCk7XHJcblx0fSxcclxuXHRmaWxsTW9kZXM6IHtcclxuXHRcdEZJTExfUEFSRU5UIDogJ2ZpbGxQYXJlbnQnLFxyXG5cdFx0RklUX1BBUkVOVCA6ICdmaXRQYXJlbnQnLFxyXG5cdFx0RklUX1BBUkVOVF9XSURUSCA6ICdmaXRQYXJlbnRXaWR0aCcsXHJcblx0XHROT05FOiAnbm9uZSdcclxuXHR9LFxyXG5cdG9yaWVudGF0aW9uczoge1xyXG5cdFx0TEFORFNDQVBFIDogJ2xhbmRzY2FwZScsXHJcblx0XHRQT1JUUkFJVCA6ICdwb3J0cmFpdCdcclxuXHR9LFxyXG5cdGNyaXRpY2FsUmVhZGFiaWxpdHlDbGFzczogJ2NyaXRpY2FsUmVhZGFiaWxpdHknLFxyXG5cdFxyXG5cdC8qINCc0LjQvdC40LzQsNC70YzQvdC+INC00L7Qv9GD0YHQutCw0LXQvNGL0Lkg0LTQstC40LbQutC+0LwgXHJcblx0ICog0YDQsNC30LzQtdGAINGI0YDQuNGE0YLQsCDQvdCwIC5jcml0aWNhbFJlYWRhYmlsaXR5Ki9cclxuXHRtaW5pbWFsUmVhZGFibGVGb250U2l6ZTogMTFcclxufTtcclxuXHJcblxyXG5cdFxyXG5cdC8qIHdpbmRvdy5pbm5lcldpZHRoINC4IHdpbmRvdy5pbm5lckhlaWdodCBcclxuXHQgKiDQvdCwINC80LDRiNC40L3QtSDQstC10YDRgdGC0LDQu9GM0YnQuNC60LAg0L/RgNC4IDEwMCUg0LfRg9C80LUuICovXHJcblx0XHJcbnJlc2l6ZWFibGVzLnJlZmVyZW5jZSA9IHt3OjEyODAsIGg6OTIzfTtcclxuXHJcbnJlc2l6ZWFibGVzLmVuZ2luZUNyZWF0b3IgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcclxuXHR2YXIgbGlzdCA9IFtdLFxyXG5cdFx0bCxcclxuXHRcdG9iaiA9IHJlc2l6ZWFibGVzO1xyXG5cclxuXHR0aGlzLmZpbmRDb250YWluZXJzID0gZnVuY3Rpb24oKXtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgZm0gaW4gb2JqLmZpbGxNb2Rlcykge1xyXG5cdFx0XHQkKCcuJyArIG9iai5maWxsTW9kZXNbZm1dKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBhID0gbmV3IGFSQ29udGFpbmVyKCQodGhpcyksIG9iai5maWxsTW9kZXNbZm1dKTtcclxuXHRcdFx0XHRsaXN0LnB1c2goYSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0bCA9IGxpc3QubGVuZ3RoO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLmdldENvbnRhaW5lcnNGcm9tRGVzY3JpcHQgPSBmdW5jdGlvbihkKXtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgYVJDSW5kZXggaW4gZCkge1xyXG5cdFx0XHR2YXIgYVJDRGF0YSA9IGRbYVJDSW5kZXhdO1xyXG5cdFx0XHRhUkNEYXRhLiRzcmMgPSAkKGFSQ0RhdGEuc3JjU3RyaW5nKTtcclxuXHRcdFx0dmFyIGFSQyA9IG5ldyBhUkNvbnRhaW5lckdlbmVyaWMoYVJDRGF0YSk7XHJcblx0XHRcdGxpc3QucHVzaChhUkMpO1xyXG5cdFx0fVxyXG5cdFx0bCA9IGxpc3QubGVuZ3RoO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLmFkanVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGFyYyA9IGxpc3RbaV07IGkgPCBsOyBpKyssIGFyYyA9IGxpc3RbaV0pIHtcclxuXHRcdFx0YXJjLmFkanVzdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBhUkNvbnRhaW5lcigkc3JjLCBmaWxsTW9kZSkge1xyXG5cdFx0cmV0dXJuIG5ldyBhUkNvbnRhaW5lckdlbmVyaWMoe1xyXG5cdFx0XHQkc3JjIDogJHNyYyxcclxuXHRcdFx0Zml0dGluZyA6IGZpbGxNb2RlXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFSQ29udGFpbmVyR2VuZXJpYyhzcmMpIHtcclxuXHJcblx0XHR2YXIgJHNyYyA9IHNyYy4kc3JjLCBcclxuXHRcdFx0Zml0dGluZyA9IHNyYy5maXR0aW5nLCBcclxuXHRcdFx0bXVsdGlMYXlvdXQgPSBzcmMubXVsdGlMYXlvdXQsIFxyXG5cdFx0XHRpbml0aWFsRGltLCBcclxuXHRcdFx0aW5pdGlhbERpbVJlbGF0aXZlLCBcclxuXHRcdFx0YXNwZWN0LCBcclxuXHRcdFx0YmFzZUZvbnRTaXplLFxyXG5cdFx0XHR2ZXJzaW9uQjtcclxuXHJcblx0XHR0aGlzLnJlY29sbGVjdE1ldHJpY3MgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGlmKGZpdHRpbmchPW9iai5maWxsTW9kZXMuTk9ORSl7XHJcblx0XHRcdFx0JHNyYy5jc3Moe1xyXG5cdFx0XHRcdFx0d2lkdGggOiAnJyxcclxuXHRcdFx0XHRcdGhlaWdodCA6ICcnLFxyXG5cdFx0XHRcdFx0J2ZvbnQtc2l6ZScgOiAnJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbml0aWFsRGltID0ge1xyXG5cdFx0XHRcdHcgOiAkc3JjLm91dGVyV2lkdGgodHJ1ZSksXHJcblx0XHRcdFx0aCA6ICRzcmMub3V0ZXJIZWlnaHQodHJ1ZSlcclxuXHRcdFx0fTtcclxuXHRcdFx0YXNwZWN0ID0gaW5pdGlhbERpbS53IC8gaW5pdGlhbERpbS5oO1xyXG5cdFx0XHRpbml0aWFsRGltUmVsYXRpdmUgPSB7XHJcblx0XHRcdFx0dyA6IGluaXRpYWxEaW0udyAvIHJlc2l6ZWFibGVzLnJlZmVyZW5jZS53LFxyXG5cdFx0XHRcdGggOiBpbml0aWFsRGltLmggLyByZXNpemVhYmxlcy5yZWZlcmVuY2UuaFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRiYXNlRm9udFNpemUgPSBwYXJzZUludCgkc3JjLmNzcygnZm9udC1zaXplJyksIDEwKTtcclxuXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR2ZXJzaW9uQiA9IHRydWU7Ly9zcmMudmVyc2lvbkI7XHJcblxyXG5cdFx0aWYodmVyc2lvbkIpe1xyXG5cdFx0XHQkc3JjLmNzcygnZGlzcGxheScsJ2lubGluZS1ibG9jaycpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLnJlY29sbGVjdE1ldHJpY3MoKTtcclxuXHJcblx0XHRjcml0aWNhbEVsZW1lbnRzID0gJHNyYy5maW5kKCcuJyArIG9iai5jcml0aWNhbFJlYWRhYmlsaXR5Q2xhc3MpO1xyXG5cdFx0dGhpcy5wYXJlbnQgPSAkc3JjLnBhcmVudCgpO1xyXG5cclxuXHRcdHZhciBjdXJyZW50T3JpZW50YXRpb24sIGxhc3RPcmllbnRhdGlvbiA9ICdub25lJztcclxuXHJcblx0XHRmdW5jdGlvbiB1cGRhdGVPcmllbnRhdGlvbigpIHtcclxuXHRcdFx0Y3VycmVudE9yaWVudGF0aW9uID0gd2luZG93QXNwZWN0ID4gbGF5b3V0U3dpdGNoVGhyZXNob2xkID8gb2JqLm9yaWVudGF0aW9ucy5MQU5EU0NBUEUgOiBvYmoub3JpZW50YXRpb25zLlBPUlRSQUlUO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBsYXlvdXRTd2l0Y2hUaHJlc2hvbGQgPSAxO1xyXG5cdFx0aWYgKHNyYy5sYXlvdXRTd2l0Y2hUaHJlc2hvbGQpIHtcclxuXHRcdFx0bGF5b3V0U3dpdGNoVGhyZXNob2xkID0gc3JjLmxheW91dFN3aXRjaFRocmVzaG9sZDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmFkanVzdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0aWYgKG11bHRpTGF5b3V0KSB7XHJcblxyXG5cdFx0XHRcdHVwZGF0ZU9yaWVudGF0aW9uKCk7XHJcblxyXG5cdFx0XHRcdGlmIChjdXJyZW50T3JpZW50YXRpb24gIT0gbGFzdE9yaWVudGF0aW9uKSB7XHJcblxyXG5cdFx0XHRcdFx0JHNyYy5hZGRDbGFzcyhjdXJyZW50T3JpZW50YXRpb24pLnJlbW92ZUNsYXNzKGxhc3RPcmllbnRhdGlvbik7XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5yZWNvbGxlY3RNZXRyaWNzKCk7XHJcblxyXG5cdFx0XHRcdFx0bGFzdE9yaWVudGF0aW9uID0gY3VycmVudE9yaWVudGF0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZpdHRpbmc9PW9iai5maWxsTW9kZXMuTk9ORSkgcmV0dXJuO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGFuY2hvckRpbSA9ICd3JywgY29tcGxlbWVudERpbSA9ICdoJztcclxuXHJcblx0XHRcdGlmIChmaXR0aW5nID09PSBvYmouZmlsbE1vZGVzLkZJTExfUEFSRU5UKSB7XHJcblx0XHRcdFx0aWYgKGFzcGVjdCA+IHdpbmRvd0FzcGVjdCkge1xyXG5cdFx0XHRcdFx0YW5jaG9yRGltID0gJ2gnO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH0gZWxzZSBpZiAoZml0dGluZyA9PT0gb2JqLmZpbGxNb2Rlcy5GSVRfUEFSRU5UKSB7XHJcblx0XHRcdFx0aWYgKGFzcGVjdCA8IHdpbmRvd0FzcGVjdCkge1xyXG5cdFx0XHRcdFx0YW5jaG9yRGltID0gJ2gnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYoYW5jaG9yRGltPT0naCcpe1xyXG5cdFx0XHRcdGNvbXBsZW1lbnREaW0gPSAndyc7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciB3aWR0aFRvQmUsIGhlaWdodFRvQmUsIGZvbnRTaXplVG9CZTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBkaW1Ub0JlID0ge1xyXG5cdFx0XHRcdGg6IDAsXHJcblx0XHRcdFx0dzogMFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHdpbmRvd0RpbSA9IHtcclxuXHRcdFx0XHRoOiB3aW5kb3dIZWlnaHQsXHJcblx0XHRcdFx0dzogd2luZG93V2lkdGhcclxuXHRcdFx0fTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBtYXJnaW5OYW1lVHJhbnNsYXRpb24gPSB7XHJcblx0XHRcdFx0aDogJ21hcmdpbi1sZWZ0JyxcclxuXHRcdFx0XHR3OiAnbWFyZ2luLXRvcCdcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGRpbVRvQmVbYW5jaG9yRGltXSA9IFxyXG5cdFx0XHRcdHdpbmRvd0RpbVthbmNob3JEaW1dKlxyXG5cdFx0XHRcdChmaXR0aW5nID09PSBvYmouZmlsbE1vZGVzLkZJTExfUEFSRU5UIHx8IHZlcnNpb25CID8gXHJcblx0XHRcdFx0XHQxIFxyXG5cdFx0XHRcdFx0OiBpbml0aWFsRGltUmVsYXRpdmVbYW5jaG9yRGltXVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRkaW1Ub0JlW2NvbXBsZW1lbnREaW1dID0gXHJcblx0XHRcdFx0ZGltVG9CZVthbmNob3JEaW1dO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoY29tcGxlbWVudERpbT09J2gnKXtcclxuXHRcdFx0XHRkaW1Ub0JlW2NvbXBsZW1lbnREaW1dIC89IGFzcGVjdDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkaW1Ub0JlW2NvbXBsZW1lbnREaW1dICo9IGFzcGVjdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdGlmKGRpbVRvQmVbY29tcGxlbWVudERpbV0+d2luZG93RGltW2NvbXBsZW1lbnREaW1dKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcmVtYXJnaW4gPSBcclxuXHRcdFx0XHRcdC0oZGltVG9CZVtjb21wbGVtZW50RGltXSAtIHdpbmRvd0RpbVtjb21wbGVtZW50RGltXSkgLyAyO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBjb21wbGVtZW50TWFyZ2luID0gbWFyZ2luTmFtZVRyYW5zbGF0aW9uW2FuY2hvckRpbV0sXHJcblx0XHRcdFx0XHRhbmNob3JNYXJnaW4gPSBtYXJnaW5OYW1lVHJhbnNsYXRpb25bY29tcGxlbWVudERpbV07XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQkc3JjLmNzcyhhbmNob3JNYXJnaW4sJycpO1xyXG5cdFx0XHRcdCRzcmMuY3NzKGNvbXBsZW1lbnRNYXJnaW4scmVtYXJnaW4pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRmb250U2l6ZVRvQmUgPSBkaW1Ub0JlLmgvaW5pdGlhbERpbS5oO1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cclxuXHRcdFx0JHNyYy53aWR0aChkaW1Ub0JlLncpO1xyXG5cdFx0XHQkc3JjLmhlaWdodChkaW1Ub0JlLmgpO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9udFNpemVUb0JlICo9IGJhc2VGb250U2l6ZTtcclxuXHRcdFx0JHNyYy5jc3MoJ2ZvbnQtc2l6ZScsIGZvbnRTaXplVG9CZSk7XHJcblxyXG5cdFx0XHQvLyDQl9C00LXRgdGMINGB0LvQtdC00LjQvCDQt9CwINGC0LXQvCwg0YfRgtC+0LHRiyDRgyDRgdC/0LXRhtC40LDQu9GM0L3QviDQv9C+0LzQtdGH0LXQvdC90YvRhSDQvdCw0LTQv9C40YHQtdC5XHJcblx0XHRcdC8vINGA0LDQt9C80LXRgCDQsdGL0Lsg0L3QtSDQvNC10L3RjNGI0LUg0L/QvtGA0L7Qs9CwIFsgb2JqLm1pbmltYWxSZWFkYWJsZUZvbnRTaXplIF1cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBjcml0aWNhbEVsZW1lbnRzLmxlbmd0aDsgXHJcblx0XHRcdFx0XHQgaSA8IGw7ICBcclxuXHRcdFx0XHRcdCBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0JGNlID0gJChjcml0aWNhbEVsZW1lbnRzW2ldKTtcclxuXHJcblx0XHRcdFx0JGNlLmNzcygnZm9udC1zaXplJywgJycpO1xyXG5cclxuXHRcdFx0XHR2YXIgY2FsY3VsYXRlZEZvbnRTaXplID0gcGFyc2VJbnQoJGNlLmNzcygnZm9udC1zaXplJyksIDEwKTtcclxuXHJcblx0XHRcdFx0aWYgKGNhbGN1bGF0ZWRGb250U2l6ZSA8IG9iai5taW5pbWFsUmVhZGFibGVGb250U2l6ZSkge1xyXG5cdFx0XHRcdFx0JGNlLmNzcygnZm9udC1zaXplJywgb2JqLm1pbmltYWxSZWFkYWJsZUZvbnRTaXplICsgJ3B4Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbnJlc2l6ZWFibGVzLmVuZ2luZSA9IG5ldyByZXNpemVhYmxlcy5lbmdpbmVDcmVhdG9yKCk7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBhZGp1c3RGb250U2l6ZSgpIHtcclxuXHJcblx0dmFyIGRpbWluaXNoaW5nID0ge1xyXG5cdFx0dyA6IHdpbmRvdy5pbm5lcldpZHRoIC8gcmVzaXplYWJsZXMucmVmZXJlbmNlLncsXHJcblx0XHRoIDogd2luZG93LmlubmVySGVpZ2h0IC8gcmVzaXplYWJsZXMucmVmZXJlbmNlLmhcclxuXHR9O1xyXG5cclxuXHQkKCdib2R5JykuY3NzKCdmb250LXNpemUnLCBiYXNlRm9udFNpemUgKiBNYXRoLm1pbihkaW1pbmlzaGluZy53LCBkaW1pbmlzaGluZy5oKSk7XHJcbn1cclxuXHJcbi8qIGV4LXNhbXBsZS5qcyAqL1xyXG5cclxuXHJcblxyXG4vKiAqINCS0YHQv9C+0LzQvtCz0LDRgtC10LvRjNC90YvQtSDQvtGA0LPQsNC90Ysg0YPQv9GA0LDQstC70LXQvdC40Y9cclxuICovXHJcblxyXG5mdW5jdGlvbiB3aGVlbFN0ZXAod2luZG93V2lkdGgpIHtcclxuXHR2YXIgZGVubyA9IHBhcmFTYW1wbGUuc2V0dGluZ3MubW91c2V3aGVlbFNsb3duZXNzLndpbmRvd3M7XHJcblx0aWYodXRpbExpYi5kZXZpY2VEZXNjcmlwdGlvbi5vcyA9PSB1dGlsTGliLk9TX1RZUEVTLm1hYyl7XHJcblx0XHRkZW5vID0gcGFyYVNhbXBsZS5zZXR0aW5ncy5tb3VzZXdoZWVsU2xvd25lc3MubWFjO1xyXG5cdH0gIFxyXG5cdHJldHVybiB3aW5kb3dXaWR0aCAvIGRlbm87XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTW91c2VXaGVlbChldmVudCwgZGVsdGEpIHtcclxuXHJcblx0cGFyYS5hZGQoLWRlbHRhICogd2hlZWxzdGVwKTtcclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLmtleWRvd24oZnVuY3Rpb24oZSkge1xyXG5cclxuXHRpZiAoZS5rZXlDb2RlID09ICczNycpIHtcclxuXHRcdHBhcmEuY2xvc2VyTGVmdCgpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0gZWxzZSBpZiAoZS5rZXlDb2RlID09ICczOScgfHwgZS5rZXlDb2RlID09ICczMicpIHtcclxuXHRcdHBhcmEuY2xvc2VyUmlnaHQoKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9XHJcblxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIG9uUmVzaXplKCkge1xyXG5cclxuXHRwYXJhLm9uUmVzaXplU2xpZGVzKCk7XHJcblxyXG5cdC8vINCg0LDRgdGJ0LXQv9C70LXQvdC40LUgb25SZXNpemUg0L/QsNGA0LDQu9C70LDQutGB0LAg0Lgg0YLQsNC60LDRjyDQv9C+0YHQu9C10LTQvtCy0LDRgtC10LvRjNC90L7RgdGC0Ywg0YTRg9C90LrRhtC40LlcclxuXHQvLyDQstGL0LfQstCw0L3RiyDRgNCw0LHQvtGC0L7QuSDQtNCy0LjQttC60LAg0LDQstGC0L7QvNCw0YHRiNGC0LDQsdC40YDRg9C10LzRi9GFINC60L7QvdGC0LXQudC90LXRgNC+0LIuXHJcblx0Ly8gb25SZXNpemVMYXllcnMg0LfQsNCy0LjRgdC40YIg0L7RgiDQtdCz0L4g0YDQtdC30YPQu9GM0YLQsNGC0L7QsiAo0YPRgtCy0LXRgNC20LTQtdC90LjQtSDRgtGA0LXQsdGD0LXRgiDQv9GA0L7QstC10YDQutC4KSxcclxuXHQvLyDQv9C+0YLQvtC80YMgb25SZXNpemVMYXllcnMg0YHQu9C10LTRg9C10YIg0L/QvtGB0LvQtS5cclxuXHJcblx0bm9uUGFyYVJlc2l6ZSgpO1xyXG5cclxuXHRwYXJhLm9uUmVzaXplTGF5ZXJzKCk7XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBub25QYXJhUmVzaXplKCkge1xyXG5cclxuXHR3aW5kb3dXaWR0aCA9ICQod2luZG93KS5pbm5lcldpZHRoKCk7XHJcblx0d2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmlubmVySGVpZ2h0KCk7XHJcblx0d2luZG93QXNwZWN0ID0gd2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQ7XHJcblxyXG5cdHdoZWVsc3RlcCA9IHdoZWVsU3RlcCh3aW5kb3dXaWR0aCk7XHJcblxyXG5cdGFkanVzdEZvbnRTaXplKCk7XHJcblx0cmVzaXplYWJsZXMuYWRqdXN0KCk7XHJcblxyXG59XHJcblxyXG5cclxudmFyIGhhc2hQcm9jZXNzaW5nU3lzdGVtID0ge1xyXG5cclxuXHRkb05vdEFwcGx5SGFzaEZyb21BZGRyZXNzTGluZSA6IGZhbHNlLFxyXG5cclxuXHR1c2VyTG9jayA6IGZhbHNlLFxyXG5cclxuXHRsYXN0U2xpZGVJIDogMCxcclxuXHJcblx0YXBwbHlIYXNoRnJvbUFkZHJlc3NMaW5lIDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGFkZHIgPSBzZWxmLmxvY2F0aW9uLnRvU3RyaW5nKCksIHNlbGVjdGVkU2xpZGUgPSBhZGRyLnNsaWNlKGFkZHIuaW5kZXhPZignIycpICsgMSk7XHJcblxyXG5cdFx0aWYgKHNlbGVjdGVkU2xpZGUgPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0Zm9yICh2YXIgaCBpbiBoYXNoUHJvY2Vzc2luZ1N5c3RlbS5hZGRyTWFwKSB7XHJcblx0XHRcdGlmIChzZWxlY3RlZFNsaWRlID09IGhhc2hQcm9jZXNzaW5nU3lzdGVtLmFkZHJNYXBbaF0gJiYgaCAhPSBoYXNoUHJvY2Vzc2luZ1N5c3RlbS5sYXN0U2xpZGVJKSB7XHJcblx0XHRcdFx0aGFzaFByb2Nlc3NpbmdTeXN0ZW0udXNlckxvY2sgPSB0cnVlO1xyXG5cdFx0XHRcdHBhcmEudG9TbGlkZSgoK2gpKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHR0cmFja0hhc2hDaGFuZ2UgOiBmdW5jdGlvbiB0cmFja0hhc2hDaGFuZ2UoKSB7XHJcblxyXG5cdFx0aWYgKHBhcmFTYW1wbGUuc2V0dGluZ3MuZGlzYWJsZUF1dG9IYXNoQ2hhbmdlKSByZXR1cm47XHJcblxyXG5cdFx0Ly8g0JfQvdCw0YfQtdC90LjQtSBwYXJhLmN1cnJlbnRTbGlkZUkg0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIg0L3QtSDRgtC10LrRg9GJ0LXQvNGDINGB0LzQtdGJ0LXQvdC40Y4sXHJcblx0XHQvLyDQsCDQutC+0L3QtdGH0L3QvtC80YMuINCX0L3QsNGH0LjRgiwg0L/QvtGB0LvQtSDRgtC+0LPQviwg0LrQsNC6INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQstCy0LXQuyDRhdGN0YhcclxuXHRcdC8vINC4INC90LDRh9Cw0Lsg0L/QtdGA0LXRhdC+0LQsINC30L3QsNGH0LXQvdC40LUg0L/QvtC80LXQvdGP0LXRgtGB0Y8g0YLQvtC70YzQutC+INC+0LTQuNC9INGA0LDQty5cclxuXHRcdGlmIChwYXJhLmN1cnJlbnRTbGlkZUkgIT0gaGFzaFByb2Nlc3NpbmdTeXN0ZW0ubGFzdFNsaWRlSSkge1xyXG5cclxuXHRcdFx0aGFzaFByb2Nlc3NpbmdTeXN0ZW0ubGFzdFNsaWRlSSA9IHBhcmEuY3VycmVudFNsaWRlSTtcclxuXHJcblx0XHRcdGlmIChoYXNoUHJvY2Vzc2luZ1N5c3RlbS51c2VyTG9jaykge1xyXG5cdFx0XHRcdGhhc2hQcm9jZXNzaW5nU3lzdGVtLnVzZXJMb2NrID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhhc2hQcm9jZXNzaW5nU3lzdGVtLmRvTm90QXBwbHlIYXNoRnJvbUFkZHJlc3NMaW5lID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGluZm9TdHJpbmcgPSAndHJhY2tIYXNoQ2hhbmdlIDogQ2hhbmdpbmcgaGFzaC4gJztcclxuXHRcdFx0aWYgKGhhc2hQcm9jZXNzaW5nU3lzdGVtLmRvTm90QXBwbHlIYXNoRnJvbUFkZHJlc3NMaW5lKSB7XHJcblx0XHRcdFx0aW5mb1N0cmluZyArPSAnIEhhcyBkb05vdEFwcGx5SGFzaEZyb21BZGRyZXNzTGluZS4nO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChoYXNoUHJvY2Vzc2luZ1N5c3RlbS51c2VyTG9jaykge1xyXG5cdFx0XHRcdGluZm9TdHJpbmcgKz0gJyBIYXMgdXNlckhhc2hMb2NrLic7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaFByb2Nlc3NpbmdTeXN0ZW0uYWRkck1hcFtwYXJhLmN1cnJlbnRTbGlkZUldO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbiQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRpZiAoaGFzaFByb2Nlc3NpbmdTeXN0ZW0uZG9Ob3RBcHBseUhhc2hGcm9tQWRkcmVzc0xpbmUpIHtcclxuXHRcdC8vdGRMaWIuZGViTG9nKCdqcS53aW5kb3cub25oYXNoY2hhbmdlIDogZG9Ob3RBcHBseUhhc2hGcm9tQWRkcmVzc0xpbmUsIHNvIHJldHVybmluZy4nKTtcclxuXHRcdGhhc2hQcm9jZXNzaW5nU3lzdGVtLmRvTm90QXBwbHlIYXNoRnJvbUFkZHJlc3NMaW5lID0gZmFsc2U7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRoYXNoUHJvY2Vzc2luZ1N5c3RlbS5hcHBseUhhc2hGcm9tQWRkcmVzc0xpbmUoKTtcclxuXHJcblx0cmV0dXJuIGZhbHNlO1xyXG5cclxufSk7XHJcblxyXG5cclxuLy8g0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDQv9GD0YHQutCw0LXRgiDRjdGC0YMg0YTRg9C90LrRhtC40Y5cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0QWxsUGFyYVN5c3RlbXMoKSB7XHJcblxyXG5cdGlmKE1vZGVybml6ci5oaXN0b3J5IFxyXG5cdFx0JiYgd2luZG93Lmhpc3Rvcnkuc3RhdGUgXHJcblx0XHQmJiB3aW5kb3cuaGlzdG9yeS5zdGF0ZS5tZWRpYUlzTG9hZGVkKXtcclxuXHRcdFx0dXRpbExpYi5kZWJMb2coJ0FsbCBtZWRpYSBpcyBjYWNoZWQuIFNraXBwaW5nIHByZWxvYWRlcicpO1xyXG5cdFx0XHRwYXJhU2FtcGxlLnByZWxvYWRlckVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0XHJcblx0fVxyXG5cdGRlYnVnZ2luZyA9IHNlbGYubG9jYXRpb24udG9TdHJpbmcoKS5pbmRleE9mKCd4ZScpID4gLTE7XHJcblx0dmFyIHBhcmFsbGF4UGFyYW1zID0ge1xyXG5cdFx0cmVtb3ZlU2Nyb2xsYmFyIDogcGFyYVNhbXBsZS5zZXR0aW5ncy5yZW1vdmVTY3JvbGxiYXIsXHJcblx0XHR0b3VjaE5vdFNjcm9sbE1vZGUgOiBwYXJhU2FtcGxlLnNldHRpbmdzLnRvdWNoTm90U2Nyb2xsTW9kZVxyXG5cdH1cclxuXHRpZiAoTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMzZCkge1xyXG5cdFx0cGFyYWxsYXhQYXJhbXMubGF5ZXJTaGlmdFByb3BlcnR5ID0gJ3RyYW5zbGF0ZTNkJztcclxuXHRcdHBhcmFsbGF4UGFyYW1zLnBhcmFsbGF4U2hpZnRQcm9wZXJ0eSA9ICd0cmFuc2xhdGUzZCc7XHJcblx0fSBcclxuXHRwYXJhID0gbmV3IHBhcmFsbGF4KHBhcmFsbGF4UGFyYW1zKTtcclxuXHRiYXNlRm9udFNpemUgPSBwYXJzZUludCgkKCdib2R5JykuY3NzKCdmb250LXNpemUnKSk7XHJcblx0aGlkZGVuSW1hZ2VzQ29udGFpbmVyID0gJCgnLnByZWxvYWRlZEltYWdlcycpO1xyXG5cclxuXHRcclxuXHJcblx0JCgnI3BhcmFsbGF4Jykub24oJ2luaXQnLCBmdW5jdGlvbigpe1xyXG5cclxuXHRcdHBhcmEubW91c2VXaGVlbFRhcmdldC5iaW5kKCdtb3VzZXdoZWVsJywgb25Nb3VzZVdoZWVsKTtcclxuXHRcdCQod2luZG93KS5vbigncmVzaXplJywgb25SZXNpemUpO1xyXG5cdFx0aGFzaFByb2Nlc3NpbmdTeXN0ZW0uYWRkck1hcCA9IFxyXG5cdFx0JCgnI3BhcmFsbGF4PmRpdicpLm1hcChmdW5jdGlvbihpKXtyZXR1cm4gaT09MD8nJzokKHRoaXMpLmF0dHIoJ2lkJyl9KTtcclxuXHRcdGhhc2hQcm9jZXNzaW5nU3lzdGVtLmFwcGx5SGFzaEZyb21BZGRyZXNzTGluZSgpO1xyXG5cdFx0cHJlbG9hZGVyLmRpc2FibGUoKTtcclxuXHRcdFxyXG5cdH0pO1xyXG5cclxuXHQkKCcjcGFyYWxsYXgnKS5vbignc2Nyb2xsQ2hhbmdlJywgZnVuY3Rpb24oYW1vdW50KSB7XHJcblxyXG5cdFx0aGFzaFByb2Nlc3NpbmdTeXN0ZW0udHJhY2tIYXNoQ2hhbmdlKCk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIG9uUHJlbG9hZGVyTG9hZCgpe1xyXG5cdFx0XHJcblx0XHRpZihNb2Rlcm5penIuaGlzdG9yeSl7XHJcblx0XHRcdFxyXG5cdFx0XHQkKCdhJykub24oJ2NsaWNrJyxmdW5jdGlvbiAoYXJncykge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0aWYoaHJlZj09JycgfHwgaHJlZiA9PScjJykgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcclxuXHRcdFx0XHRcdG1lZGlhSXNMb2FkZWQ6ICd0cnVlJ1xyXG5cdFx0XHRcdH0sICdtZWRpYUlzTG9hZGVkJyk7ICBcclxuXHRcdFx0XHRcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXNpemVhYmxlcy5pbml0RnJvbURlc2NyaXB0KGFSQ0Rlc2NyaXB0KTtcclxuXHJcblx0XHRub25QYXJhUmVzaXplKCk7XHJcblxyXG5cdFx0aWYgKHBhcmFsbGF4KSB7XHJcblx0XHRcdHBhcmEuaW5pdCgpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblx0XHJcblx0aWYocGFyYVNhbXBsZS5wcmVsb2FkZXJFbmFibGVkKXtcclxuXHRcdHByZWxvYWRlci5vbkxvYWQgPSBvblByZWxvYWRlckxvYWQ7XHRcclxuXHR9IGVsc2Uge1xyXG5cdFx0cHJlbG9hZGVyLmluaXQoKTtcclxuXHRcdG9uUHJlbG9hZGVyTG9hZCgpO1xyXG5cdH1cclxuXHJcblx0aWYocGFyYVNhbXBsZS5wcmVsb2FkZXJFbmFibGVkKXtcclxuXHRcdHByZWxvYWRlci5zdGFydCgpO1xyXG5cdH1cclxuXHJcbn07IiwiYVJDRGVzY3JpcHQgPSBbIHtcblx0c3JjU3RyaW5nIDogJyNsYXlvdXRzIC5zdG9yeScsXG5cdGZpdHRpbmcgOiByZXNpemVhYmxlcy5maWxsTW9kZXMuTk9ORSxcblx0bXVsdGlMYXlvdXQgOiB0cnVlXG59LCAge1xuXHRzcmNTdHJpbmcgOiAnI3NjYWxpbmcgLnN0b3J5Jyxcblx0Zml0dGluZyA6IHJlc2l6ZWFibGVzLmZpbGxNb2Rlcy5GSVRfUEFSRU5ULFxufV07XG5cblxuLyogKi9cblxudmFyIG9wdGltaXphdGlvblNsaWRlID0ge1xuXHRwYXVzZSA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JChcIiNvcHRpbWl6YXRpb24gLmZhc3RMYXllclwiKS5zdG9wKHRydWUsZmFsc2UpO1xuXHR9LFxuXHRyZXN1bWUgOiBmdW5jdGlvbigpIHtcblxuXHRcdCQoXCIjb3B0aW1pemF0aW9uIC5mYXN0TGF5ZXJcIikuYW5pbWF0ZSh7XG5cdFx0XHQnbWFyZ2luLXRvcCcgOiAnNTAwcHgnXG5cdFx0fSwgNDAwLCAnZWFzZUluT3V0Q3ViaWMnKS5hbmltYXRlKHtcblx0XHRcdCdtYXJnaW4tdG9wJyA6ICcwcHgnXG5cdFx0fSwgNDAwLCAnZWFzZU91dEN1YmljJywgb3B0aW1pemF0aW9uU2xpZGUucmVzdW1lKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMYXllcnMoKXtcblxuXHRmb3IodmFyIGk9MDsgaTwzMDsgaSsrKXtcblxuXHRcdHZhciBsYXllciA9ICQoXCI8ZGl2IGNsYXNzPSdmYXN0TGF5ZXInPjxkaXY+PGRpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7XG5cblx0XHRsYXllci5jc3Moe1xuXHRcdFx0bGVmdDogTWF0aC5yYW5kb20oKSoxNzUwLTM1MCxcblx0XHRcdHRvcDogTWF0aC5yYW5kb20oKSo4NjAtMjAwXG5cdFx0fSk7XG5cdFx0XG5cdFx0dmFyIHEgPSBNYXRoLnJhbmRvbSgpO1xuXHRcdGxheWVyLmZpbmQoJz5kaXYnKS5hdHRyKHtcblx0XHRcdGFsdDogcSo2KzFcblx0XHR9KTtcblx0XHRcblx0XHR2YXIgc2l6ZSA9IHEqMjcwKzMwO1xuXHRcdGxheWVyLmZpbmQoJz5kaXY+ZGl2JykuY3NzKHtcblx0XHRcdHdpZHRoOiBzaXplLFxuXHRcdFx0aGVpZ2h0OiBzaXplLFxuXHRcdFx0J2JvcmRlci1yYWRpdXMnOiBzaXplLFxuXHRcdFx0Jy13ZWJraXQtZmlsdGVyJzogJ2JsdXIoJytxKjE1KydweCknLFxuXHRcdFx0YmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjUpJ1xuXHRcdH0pO1xuXG5cdFx0JCgnI21vcmUgLnBvcHVsYXJSZXNvbHV0aW9uJykuYXBwZW5kKGxheWVyKTtcblxuXHRcdHZhciBhbmltYXRlZENvcHkgPSBsYXllci5jbG9uZSgpO1xuXG5cdFx0JCgnI2FuaW1hdGVkIC5wb3B1bGFyUmVzb2x1dGlvbicpLmFwcGVuZChhbmltYXRlZENvcHkpO1xuXG5cdFx0KGZ1bmN0aW9uKGFuaW1hdGVkQ29weSl7XG5cblx0XHRcdHZhciBwYXVzZWQgPSB0cnVlLFxuXHRcdFx0XHRwcm9ncmVzcyA9IDAsXG5cdFx0XHRcdGluaXRpYWxQb3NpdGlvbiA9IGFuaW1hdGVkQ29weS5wb3NpdGlvbigpLFxuXHRcdFx0XHRzcGVlZEtvZWZmID0gTWF0aC5yYW5kb20oKSxcblx0XHRcdFx0aW5pdGlhbFBoYXNlID0gTWF0aC5yYW5kb20oKSpNYXRoLlBJKjIsXG5cdFx0XHRcdGFtcGxpdHVkZSA9IE1hdGgucmFuZG9tKCkqMTAwKzEwMDtcblxuXHRcdFx0c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYocGF1c2VkKSByZXR1cm47XG5cblx0XHRcdFx0dmFyIGFuZ2xlID0gcHJvZ3Jlc3Mqc3BlZWRLb2VmZitpbml0aWFsUGhhc2U7XG5cdFx0XHRcdGFuaW1hdGVkQ29weS5jc3MoJ2xlZnQnLGluaXRpYWxQb3NpdGlvbi5sZWZ0K01hdGguc2luKGFuZ2xlKSphbXBsaXR1ZGUpO1xuXHRcdFx0XHRhbmltYXRlZENvcHkuY3NzKCd0b3AnLGluaXRpYWxQb3NpdGlvbi50b3ArTWF0aC5jb3MoYW5nbGUpKmFtcGxpdHVkZSk7XG5cblx0XHRcdFx0cHJvZ3Jlc3MrPS4xO1xuXG5cdFx0XHR9LDE3KTtcblxuXHRcdFx0YW5pbWF0ZWRDb3B5LmRhdGEoe1xuXHRcdFx0XHRyZXN1bWU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGF1c2VkID0gZmFsc2U7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHBhdXNlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHBhdXNlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fSkoYW5pbWF0ZWRDb3B5KTtcblxuXHR9O1xufVxuXG5cbiQoZnVuY3Rpb24oKXtcblxuXHRjcmVhdGVMYXllcnMoKTtcblx0b3B0aW1pemF0aW9uU2xpZGUucmVzdW1lKCk7XG5cblx0JCgnI3BhcmFsbGF4Jykub24oJ2ZpbmlzaGVkTW92ZScsIGZ1bmN0aW9uKGFtb3VudCkge1xuXG5cdFx0JCgnI2FuaW1hdGVkIC5wb3B1bGFyUmVzb2x1dGlvbiAuZmFzdExheWVyJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0JCh0aGlzKS5kYXRhKCdyZXN1bWUnKSgpO1xuXHRcdH0pO1xuXHRcdG9wdGltaXphdGlvblNsaWRlLnJlc3VtZSgpO1xuXHR9KTtcblx0JCgnI3BhcmFsbGF4Jykub24oJ3N0YXJ0ZWRNb3ZlJywgZnVuY3Rpb24oKSB7XG5cblx0XHQkKCcjYW5pbWF0ZWQgLnBvcHVsYXJSZXNvbHV0aW9uIC5mYXN0TGF5ZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKHRoaXMpLmRhdGEoJ3BhdXNlJykoKTtcblx0XHR9KTtcblxuXHRcdG9wdGltaXphdGlvblNsaWRlLnBhdXNlKCk7XG5cdH0pO1xuXG5cdC8vIHRoZSBvbmx5IGNhbGwgdG8gdGhlIHBhcmFsbGF4IHN5c3RlbSB5b3UgbmVlZCB0byBtYWtlXG5cdHN0YXJ0QWxsUGFyYVN5c3RlbXMoKTtcblxufSk7XG4iXX0=
