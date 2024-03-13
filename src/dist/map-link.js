/*! @maps4html/web-map-custom-element 12-03-2024 */

class MapLink extends HTMLElement{static get observedAttributes(){return["type","rel","media","href","hreflang","tref","tms","projection"]}#hasConnected;get type(){return this.getAttribute("type")||"image/*"}set type(t){"text/mapml"!==t&&!t.startsWith("image/")||this.setAttribute("type",t)}get rel(){return this.getAttribute("rel")}set rel(t){["license","alternate","self","style","tile","image","features","zoomin","zoomout","legend","query","stylesheet"].includes(t)&&this.setAttribute("type",t)}get href(){return this.hasAttribute("href")?new URL(this.getAttribute("href"),this.getBase()).href:this.hasAttribute("tref")?this.resolve():void 0}set href(t){t&&this.setAttribute("href",t)}get hreflang(){return this.getAttribute("hreflang")}set hreflang(t){t&&this.setAttribute("hreflang",t)}get tref(){return this.hasAttribute("tref")?this.getAttribute("tref"):M.BLANK_TT_TREF}set tref(t){t&&this.setAttribute("tref",t)}get media(){return M._metaContentToObject(this.getAttribute("media"))}set media(t){this.setAttribute("media",t)}get tms(){return this.hasAttribute("tms")}set tms(t){t&&this.setAttribute("tms","")}get projection(){return this.getAttribute("projection")}set projection(t){["OSMTILE","CBMTILE","WGS84","APSTILE"].includes(t)&&this.setAttribute("projection",t)}get extent(){return this._templateVars?Object.assign(M._convertAndFormatPCRS(this.getBounds(),M[this.parentExtent.units],this.parentExtent.units),{zoom:this.getZoomBounds()}):null}zoomTo(){var h=this.extent;if(h){let t=this.getMapEl()._map,e=h.topLeft.pcrs.horizontal,s=h.bottomRight.pcrs.horizontal,i=h.bottomRight.pcrs.vertical,a=h.topLeft.pcrs.vertical,r=L.bounds(L.point(e,i),L.point(s,a)),o=t.options.crs.unproject(r.getCenter(!0)),n=h.zoom.maxZoom,l=h.zoom.minZoom;t.setView(o,M.getMaxZoom(r,t,l,n),{animate:!1})}}getClosest(t,e){return t?t instanceof ShadowRoot?this.getClosest(t.host,e):t instanceof HTMLElement&&t.matches(e)?t:this.getClosest(t.parentNode,e):null}getMapEl(){return this.getClosest(this,"mapml-viewer,map[is=web-map]")}getLayerEl(){return this.getClosest(this,"layer-")}attributeChangedCallback(t,e,s){if(this.#hasConnected)switch(t){case"type":case"rel":case"href":case"hreflang":break;case"tref":e!==s&&this._initTemplateVars()}}constructor(){super()}connectedCallback(){if(this.#hasConnected=!0,!(this.getLayerEl().hasAttribute("data-moving")||this.parentExtent&&this.parentExtent.hasAttribute("data-moving")))switch(this.rel.toLowerCase()){case"tile":case"image":case"features":case"query":this._initTemplateVars(),this._createTemplatedLink();break;case"style":case"self":case"style self":case"self style":this._createSelfOrStyleLink();break;case"zoomin":case"zoomout":case"legend":break;case"stylesheet":this._createStylesheetLink();break;case"alternate":this._createAlternateLink()}}disconnectedCallback(){"stylesheet"===this.rel.toLowerCase()&&this._stylesheetHost&&this.link.remove()}_createAlternateLink(t){this.href&&this.projection&&(this._alternate=!0)}_createStylesheetLink(){var t,e;this._stylesheetHost=this.getRootNode()instanceof ShadowRoot?this.getRootNode().host:this.parentElement,void 0!==this._stylesheetHost&&(this.link=document.createElement("link"),(this.link.mapLink=this).link.setAttribute("href",new URL(this.href,this.getBase()).href),e=(t=this).link,Array.from(t.attributes).forEach(t=>{"href"!==t.nodeName&&e.setAttribute(t.nodeName,t.nodeValue)}),this._stylesheetHost._layer?this._stylesheetHost._layer.appendStyleLink(this):this._stylesheetHost._templatedLayer&&this._stylesheetHost._templatedLayer.appendStyleLink(this))}async _createTemplatedLink(){if(this.parentExtent="MAP-EXTENT"===this.parentNode.nodeName.toUpperCase()?this.parentNode:this.parentNode.host,this.tref&&this.parentExtent){try{await this.parentExtent.whenReady(),await this._templateVars.inputsReady}catch(t){return void console.log("Error while creating templated link: "+t)}this.mapEl=this.getMapEl(),this.zIndex=Array.from(this.parentExtent.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features]")).indexOf(this),"tile"===this.rel?this._templatedLayer=M.templatedTileLayer(this._templateVars,{zoomBounds:this.getZoomBounds(),extentBounds:this.getBounds(),crs:M[this.parentExtent.units],errorTileUrl:"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",zIndex:this.zIndex,pane:this.parentExtent._extentLayer.getContainer(),linkEl:this}).addTo(this.parentExtent._extentLayer):"image"===this.rel?this._templatedLayer=M.templatedImageLayer(this._templateVars,{zoomBounds:this.getZoomBounds(),extentBounds:this.getBounds(),zIndex:this.zIndex,pane:this.parentExtent._extentLayer.getContainer(),linkEl:this}).addTo(this.parentExtent._extentLayer):"features"===this.rel?(this.attachShadow({mode:"open"}),this._templatedLayer=M.templatedFeaturesLayer(this._templateVars,{zoomBounds:this.getZoomBounds(),extentBounds:this.getBounds(),zIndex:this.zIndex,pane:this.parentExtent._extentLayer.getContainer(),linkEl:this}).addTo(this.parentExtent._extentLayer)):"query"===this.rel&&(this.attachShadow({mode:"open"}),L.extend(this._templateVars,this._setupQueryVars(this._templateVars)),L.extend(this._templateVars,{extentBounds:this.getBounds()}))}}_setupQueryVars(t){for(var e={query:{}},s=t.values,i=0;i<t.values.length;i++){var a=s[i].getAttribute("type"),r=s[i].getAttribute("units"),o=s[i].getAttribute("axis"),n=s[i].getAttribute("name"),l=s[i].getAttribute("position"),h=s[i].getAttribute("rel"),u="map-select"===s[i].tagName.toLowerCase();if("width"===a)e.query.width=n;else if("height"===a)e.query.height=n;else if("location"===a)switch(o){case"x":case"y":case"column":case"row":e.query[o]=n;break;case"longitude":case"easting":l?l.match(/.*?-left/i)?"pixel"===h?e.query.pixelleft=n:"tile"===h?e.query.tileleft=n:e.query.mapleft=n:l.match(/.*?-right/i)&&("pixel"===h?e.query.pixelright=n:"tile"===h?e.query.tileright=n:e.query.mapright=n):e.query[o]=n;break;case"latitude":case"northing":l?l.match(/top-.*?/i)?"pixel"===h?e.query.pixeltop=n:"tile"===h?e.query.tiletop=n:e.query.maptop=n:l.match(/bottom-.*?/i)&&("pixel"===h?e.query.pixelbottom=n:"tile"===h?e.query.tilebottom=n:e.query.mapbottom=n):e.query[o]=n;break;case"i":"tile"===r?e.query.tilei=n:e.query.mapi=n;break;case"j":"tile"===r?e.query.tilej=n:e.query.mapj=n}else if("zoom"===a)e.query.zoom=n;else if(u){const m=s[i].htmlselect;e.query[n]=function(){return m.value}}else{const p=s[i];e.query[n]=function(){return p.getAttribute("value")}}}return e}_initTemplateVars(){var s,t=new RegExp("(?:{)(.*?)(?:})","g"),e=this.parentElement.querySelector('map-input[type="zoom" i]'),i=!1,a=this.tref;if(a===M.BLANK_TT_TREF)for(var r of this.parentElement.querySelectorAll("map-input"))a+=`{${r.getAttribute("name")}}`;this.zoomInput=e;for(var o,n=a.match(t)||[],l=[],h=[];null!==(o=t.exec(a));){let t=o[1],e=this.parentElement.querySelector("map-input[name="+t+"],map-select[name="+t+"]");e?(l.push(e),h.push(e.whenReady()),e.hasAttribute("type")&&"zoom"===e.getAttribute("type").toLowerCase()&&(s=e,i=!0)):console.log("input with name="+t+" not found for template variable of same name")}if(a&&n.length===l.length){!i&&e&&(l.push(e),s=e);let t=e?e.getAttribute("step"):1;t&&"0"!==t&&!isNaN(t)||(t=1),this._templateVars={template:decodeURI(new URL(a,this.getBase())),linkEl:this,rel:this.rel,type:this.type,values:l,inputsReady:Promise.allSettled(h),zoom:s,projection:this.parentElement.units,tms:this.tms,step:t}}}getZoomBounds(){return this._getZoomBounds(this._templateVars.zoom)}getBounds(){var t;let e=this._templateVars.values,s=this.parentElement.units,i={};i.name=M.FALLBACK_CS;let a=M[s].options.crs.tilematrix.bounds(0),r=!1;for(let t=0;t<e.length;t++)if("location"===e[t].getAttribute("type")&&e[t].getAttribute("max")&&e[t].getAttribute("min")){var o=+e[t].getAttribute("max"),n=+e[t].getAttribute("min");switch(e[t].getAttribute("axis").toLowerCase()){case"x":case"longitude":case"column":case"easting":i.name=M.axisToCS(e[t].getAttribute("axis").toLowerCase()),a.min.x=n,a.max.x=o,i.horizontalAxis=e[t].getAttribute("axis").toLowerCase();break;case"y":case"latitude":case"row":case"northing":i.name=M.axisToCS(e[t].getAttribute("axis").toLowerCase()),a.min.y=n,a.max.y=o,i.verticalAxis=e[t].getAttribute("axis").toLowerCase()}}return i.horizontalAxis&&i.verticalAxis&&("x"===i.horizontalAxis&&"y"===i.verticalAxis||"longitude"===i.horizontalAxis&&"latitude"===i.verticalAxis||"column"===i.horizontalAxis&&"row"===i.verticalAxis||"easting"===i.horizontalAxis&&"northing"===i.verticalAxis)&&(r=!0),r?(t=this._templateVars.zoom?.hasAttribute("value")?+this._templateVars.zoom.getAttribute("value"):0,a=M.boundsToPCRSBounds(a,t,s,i.name)):r||(a=this.getFallbackBounds(s)),a}getFallbackBounds(i){let a,r=0,o=this.parentElement.getMeta("extent");if(o){let t=M._metaContentToObject(o.getAttribute("content")),e;r=t.zoom||r;let s=Object.keys(t);for(let t=0;t<s.length;t++)if(!s[t].includes("zoom")){e=M.axisToCS(s[t].split("-")[2]);break}var n=M.csToAxes(e);a=M.boundsToPCRSBounds(L.bounds(L.point(+t["top-left-"+n[0]],+t["top-left-"+n[1]]),L.point(+t["bottom-right-"+n[0]],+t["bottom-right-"+n[1]])),r,i,e)}else{i=M[i];a=i.options.crs.pcrs.bounds}return a}getBase(){var t=this.getRootNode().host,e=this.getRootNode().querySelector("map-base")&&this.getRootNode()instanceof ShadowRoot?this.getRootNode().querySelector("map-base").getAttribute("href"):this.getRootNode()instanceof ShadowRoot?new URL(t.src,t.baseURI).href:this.getRootNode().querySelector("map-base")?.getAttribute("href")||this.baseURI,t=this.getRootNode()instanceof ShadowRoot?new URL(t.src,t.baseURI).href:this.baseURI;return new URL(e,t).href}_getZoomBounds(t){let e={},s=this.parentElement.getMeta("zoom");var i=s?+M._metaContentToObject(s.getAttribute("content"))?.min:null;e.minZoom=i||(t?+t.getAttribute("min"):0),e.minNativeZoom=t?+t.getAttribute("min"):e.minZoom;i=s?+M._metaContentToObject(s.getAttribute("content"))?.max:null;return e.maxZoom=i||(t?+t.getAttribute("max"):M[this.parentElement.units].options.resolutions.length-1),e.maxNativeZoom=t?+t.getAttribute("max"):e.maxZoom,e}_validateDisabled(){let t=!1,e=this.getMapEl(),s=e.zoom,i=e.extent,a=i.topLeft.pcrs.horizontal,r=i.bottomRight.pcrs.horizontal,o=i.bottomRight.pcrs.vertical,n=i.topLeft.pcrs.vertical,l=L.bounds(L.point(a,o),L.point(r,n));if(this._templatedLayer)t=this._templatedLayer.isVisible();else if("query"===this.rel){const u=this.extent.zoom.minZoom,m=this.extent.zoom.maxZoom;this.getBounds().overlaps(l)&&(h=s,u<=h&&h<=m)&&(t=!0)}var h;return t}_createSelfOrStyleLink(){let e=this.getLayerEl();let t=document.createElement("div"),s=t.appendChild(document.createElement("input"));s.setAttribute("type","radio"),s.setAttribute("id","rad-"+L.stamp(s)),s.setAttribute("name","styles-"+L.stamp(t)),s.setAttribute("value",this.getAttribute("title")),s.setAttribute("data-href",new URL(this.href,this.getBase()).href);var i=t.appendChild(document.createElement("label"));i.setAttribute("for","rad-"+L.stamp(s)),i.innerText=this.title,"style self"!==this.rel&&"self style"!==this.rel||(s.checked=!0),this._styleOption=t,s.addEventListener("click",function(t){L.DomEvent.stop(t),e.dispatchEvent(new CustomEvent("changestyle",{detail:{src:t.target.getAttribute("data-href"),preference:this.media["prefers-map-content"]}}))}.bind(this))}getLayerControlOption(){return this._styleOption}resolve(){if(this.tref){let e={};var s=this.parentElement.querySelectorAll("map-input");if("image"===this.rel){for(let t=0;t<s.length;t++){var i=s[t];e[i.name]=i.value}return console.log(e),L.Util.template(this.tref,e)}if("tile"===this.rel)return e;"query"===this.rel||this.rel}}whenReady(){return new Promise((e,s)=>{let i,a,r;switch(this.rel.toLowerCase()){case"tile":case"image":case"features":r="_templatedLayer";break;case"style":case"self":case"style self":case"self style":r="_styleOption";break;case"query":r="shadowRoot";break;case"alternate":r="_alternate";break;default:e()}this[r]&&e(),i=setInterval(function(t){t[r]?(clearInterval(i),clearTimeout(a),e()):t.isConnected||(clearInterval(i),clearTimeout(a),s("map-link was disconnected while waiting to be ready"))},300,this),a=setTimeout(function(){clearInterval(i),clearTimeout(a),s("Timeout reached waiting for link to be ready")},1e4)})}}export{MapLink};
//# sourceMappingURL=map-link.js.map