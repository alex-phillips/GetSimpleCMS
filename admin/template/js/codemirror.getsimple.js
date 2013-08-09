var themeFileSave;
var editor;
var loadjscssfile;
jQuery(document).ready(function () {
	
		function keyEvent(cm, e) {
			if (e.keyCode == 81 && e.ctrlKey) {
				if (e.type == "keydown") {
					e.stop();
					setTimeout(function() {foldFunc(cm, cm.getCursor().line);}, 50);
				}
				return true;
			}
		}

		var themes = Array(
			'ambiance',
			'cobalt',
			'eclipse',
			'eclipse',
			'elegant',
			'erlang-dark',
			'lesser-dark',
			'monokai',
			'neat',
			'night',
			'rubyblue',
			'solarized dark',
			'solarized light',
			'twilight',
			'vibrant-ink',
			'xq-dark'
		);

		var customTheme = 'monokai';// '<?php if(isset($theme)) echo $theme; ?>'; 

		var defTheme = 'default';		
		// var customTheme = themes[Math.floor(Math.random()*themes.length)];

		if(customTheme && customTheme != undefined){
			defTheme = customTheme;
			var parts = defTheme.split(' ');
			loadjscssfile("template/js/codemirror/theme/"+parts[0]+".css", "css")
		}	

		$(".code_edit").each(function(i,textarea) {		
			var editor = CodeMirror.fromTextArea(textarea, {
				lineNumbers: true,
				matchBrackets: true,
				indentUnit: 4,
				indentWithTabs: true,
				enterMode: "keep",
				mode: 'application/x-httpd-php',
				tabMode: "shift",
				theme: defTheme,
				fixedGutter : true,
				extraKeys: {
					"Ctrl-Q" : function(cm) { foldFunc(cm, cm.getCursor().line); },
					"F11"    : function(cm) { setFullScreen(cm, !isFullScreen(cm)); },
					"Esc"    : function(cm) { if (isFullScreen(cm)) setFullScreen(cm, false); },
					"Ctrl-S" : function(cm) { customSave(cm);	}
				},
				saveFunction:  function(cm) { customSave(cm); },
				onChange: function(cm){
					// console.log('content changed');
					cm.hasChange = true;
				}

			});
			
			// add reference to this editor to the textarea
			$(textarea).data('editor', editor);

			var hlLine = editor.addLineClass(0, "background", "activeline");

			var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder,'...');
			editor.on("gutterClick", foldFunc);

			editor.on("cursorActivity", function() {

			  // line highlihghting
			  var cur = editor.getLineHandle(editor.getCursor().line);
			  if (cur != hlLine) {
			    editor.removeLineClass(hlLine, "background", "activeline");
			    hlLine = editor.addLineClass(cur, "background", "activeline");
			  }

			  // highlight matching
			  editor.matchHighlight("CodeMirror-matchhighlight");
			});

			Debugger.log(editor.getWrapperElement());

			// add in resizing
			$(editor.getWrapperElement()).resizable({
			  resize: function() {
			    editor.setSize($(this).width(), $(this).height());
			    editor.refresh();
			  }
			});

	});

	function customSave(cm){
		log('saving');
		themeFileSave(cm);
	}

    function isFullScreen(cm) {
      return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
    }

    function winHeight() {
      return window.innerHeight || (document.documentElement || document.body).clientHeight;
    }

    function setFullScreen(cm, full) {
      var wrap = cm.getWrapperElement();
      if (full) {
        wrap.className += " CodeMirror-fullscreen";
        wrap.style.height = winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
      } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        wrap.style.height = "";
        document.documentElement.style.overflow = "";
      }
      cm.refresh();
    }

	CodeMirror.on(window, "resize", function() {
	    var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
	    if (!showing) return;
	    showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px";
	});

	function setThemeSelected(theme){
		$("#cm_themeselect").val(theme);
	}

	setThemeSelected(defTheme);

});