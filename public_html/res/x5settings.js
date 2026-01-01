(function ( $, x5engine ) {
	var x = x5engine,
		s = x.settings,
		p = s.currentPath,
		b = x.boot;

	b.push(function () {
		x.setupDateTime();
		x.imAccess.showLogout();
		x.utils.autoHeight();
		x.cart.ui.updateWidget();
		x.imGrid.init();
	});
	s.menu = {
		verticalScroll: false,
		orientation: 'horizontal'
	};
	b.push(function () {
		x.menu({
			target: '#imMnMn',
			showCurrent: false,
			verticalScroll: false,
			orientation: 'horizontal',
			menuHeight: 60,
			menuWidth: 181,
			submenuHeight: 30,
			submenuWidth: 180,
			opacity: 1,
			type: 'multipleColumn',
			alignment: 'left',
			effect: 'fade'
		});
	});
	b.push(function () { x.utils.imPreloadImages([p + 'menu/index_h.png',p + 'menu/prices_h.png',p + 'menu/the-guys_h.png',p + 'menu/pics-and-videos_h.png',p + 'menu/faq_h.png',p + 'menu/contact-us_h.png', p + 'res/imLoad.gif', p + 'res/imClose.png']); });

	// ShowBox
	$.extend(s.imShowBox, {
		'effect' : 'fade',
		'shadow' : '3px 3px 10px 0px #808080',
		'background' : 'transparent',
		'borderWidth' : {
			'top': 0,
			'right': 0,
			'bottom': 0,
			'left': 0
		},
		buttonRight: {
			url: p + 'res/b14_r.png',
			position: {
				x: -28,
				y: 0
			}
		},
		buttonLeft: {
			url: p + 'res/b14_l.png',
			position: {
				x: -28,
				y: 0
			}
		},
		'borderRadius' : '5px 5px 5px 5px',
		'borderColor' : '#000000 #000000 #000000 #000000',
		'textColor' : '#000000',
		'fontFamily' : 'Tahoma',
		'fontStyle' : 'normal',
		'fontWeight' : 'normal',
		'fontSize' : '9pt',
		'textAlignment' : 'center',
		'boxColor' : 'transparent',
		'opacity' : 0.5,
		'radialBg' : true // Works only in Mozilla Firefox and Google Chrome
	});

	// PopUp
	$.extend(s.imPopUp, {
		'effect' : 'fade',
		'width' : 500,
		'shadow' : '3px 3px 10px 0px #808080',
		'background' : 'transparent',
		'borderRadius' : 10,
		'textColor' : '#000000',
		'boxColor' : 'transparent',
		'opacity' : 0.5
	});

	// Tip
	$.extend(s.imTip, {
		'borderRadius' : 1,
		'arrow' : true,
		'position' : 'bottom',
		'effect' : 'none',
		'showTail' : true
	});

	// Captcha
	var codes = s.imCaptcha.offlineCodes;
	s.loaded = true;
})( _jq, x5engine );