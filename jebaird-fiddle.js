/*
 * jebaird fiddle fetch local links text via ajax and make them editable
 * 

	
	$('a[title="iframe"]').each(function(){
		var $this = $(this);
		var id = "iframe-"+ Math.floor(Math.random()*10000);
		var $iframe = $('<iframe width="100%" height="250" src="'+$this.attr("href")+'" id="'+id+'"></iframe>');

		if(/^http/ig.test($this.attr("href"))== false){
		    
		    $.get($this.attr("href"),function(data){
		        $("<pre>")
		         .css({
                        "max-height": 500,
                        "overflow": "auto"
                    })
                .text(data)
                
                .wrapInner("<code contenteditable='true'></code>")
                .on("input", "> code", function(e){
                	setIframeContent($iframe[0],this.innerText)
                	
                })
                .insertAfter($iframe)
		    })
			
		}
		
		
		
		$iframe.insertAfter($this)
		$this.hide();
			
	})
		
		
			var setIframeContent = function( iframe, content ){
		iframe.src = "data:text/html;charset=utf-8," + encodeURI(fixProtocol(content));
	}
 * 
 */


(function(){
	
	//var pro
	
	
	var fixProtocol = function( content ){
		return content.replace(/\/\//ig,'http://')
	}
	var setIframeContent = function( iframe, content ){
		//iframe.src = "data:text/html;charset=utf-8," + encodeURI(fixProtocol(content));
		iframe.srcDoc = content;
	}
	
	
	
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
				
				iframe.src = e.getAttribute("data-href");
				//Todo check source, make sure we can access the contents of the iframe
				this.bind(iframe, 'load', function(){
					var content = (this.contentWindow || this.contentDocument);
					console.log(e, this.contentWindow)
					//setup the event handlers, use contentebale 
					console.dir(content.window.innerHTML)
					self._editorSetup(content.document.body.innerHTML)
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
					console.log("input triggered")
					setIframeContent(iframe, this.innerText)
				})
				
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
