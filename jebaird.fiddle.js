/*
 * jebaird fiddle fetch local links text via ajax and make them editable
 * @author Jesse Baird <jebaird@gmail.com>
 * 
 */


(function(){

	var fixProtocol = function( content ){
		return content.replace(/\/\//ig,'http://')
	},
	setIframeContent = function( iframe, content ){
		iframe.srcDoc = content;
	}
	
	//use the jebaird window namespace
	var jebaird = window.jebaird || ( window.jebaird = {} );
	
	var fiddle = (function(){
		
		var fiddle = function( element ){
			return new fiddle.prototype.init( element );
		};
		
		fiddle.prototype = {
			init: function( element ){
				this._element = element;
				
				element.style.display = "none";
				
				this._createIframe();
			},
			_createIframe: function(){
				
				this._iframe = document.createElement("iframe");
				var iframe = this._iframe;
				
				var e = this._element;
				var self = this;
				
				iframe.width = '100%';
				
				iframe.classList.add("jb-fiddle-display");
				
				iframe.src = e.getAttribute("href");
				//Todo check source, make sure we can access the contents of the iframe
				this.bind(iframe, 'load', function(){
					var content = (this.contentWindow || this.contentDocument);
					//setup the event handlers, use contentebale 
					//TODO: figure out how to get the whole content including the <html> tag
					self._editorSetup(content.document.body.innerHTML.trim())
				})
				
				this._element.parentNode.insertBefore(iframe,e);
				
			},
			_editorSetup: function( text ){
				var editor = document.createElement("pre"),
					code = document.createElement("code"),
					iframe = this._iframe;
				
				code.innerText = text;
				code.setAttribute("contenteditable", "true");
				
				this.bind(code, "input", function(e){
					//iframe
					setIframeContent(iframe, this.innerText )
				})
				
				editor.classList.add("jb-fiddle-editor");
				
				editor.appendChild(code);
				this._element.parentNode.insertBefore(editor,this._element);
				
			},
			/*
			 * simple cross browser event binding
			 */
			bind: function( element, event, func ){
				var method = (element['addEventListener'] != undefined) ? element['addEventListener'] : element.attachEvent;
				
				method(event,function(){
					func.apply(element, Array.prototype.slice.apply(1, arguments ))
				});
				
				return this;
			}
		};
		
		
		fiddle.prototype.init.prototype = fiddle.prototype;

		return ( jebaird.fiddle = fiddle );
		
	})();
	
	
})();