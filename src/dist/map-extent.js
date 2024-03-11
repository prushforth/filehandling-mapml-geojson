/*! @maps4html/web-map-custom-element 10-03-2024 */

class MapExtent extends HTMLElement{static get observedAttributes(){return["checked","label","opacity","hidden"]}#hasConnected;get units(){return this.getAttribute("units")||M.FALLBACK_PROJECTION}get checked(){return this.hasAttribute("checked")}set checked(e){e?this.setAttribute("checked",""):this.removeAttribute("checked")}get label(){return this.hasAttribute("label")?this.getAttribute("label"):M.options.locale.dfExtent}set label(e){e&&this.setAttribute("label",e)}get opacity(){return+(this._opacity??this.getAttribute("opacity"))}set opacity(e){1<+e||+e<0||this.setAttribute("opacity",e)}get hidden(){return this.hasAttribute("hidden")}set hidden(e){e?this.setAttribute("hidden",""):this.removeAttribute("hidden")}get extent(){const e=e=>Object.assign(M._convertAndFormatPCRS(e._extentLayer.bounds,M[e.units],e.units),{zoom:e._extentLayer.zoomBounds});var t;return this._extentLayer.bounds?e(this):((t=this)._calculateBounds(),e(t))}zoomTo(){var e=this.extent;let t=this.getMapEl()._map,a=e.topLeft.pcrs.horizontal,o=e.bottomRight.pcrs.horizontal,r=e.bottomRight.pcrs.vertical,i=e.topLeft.pcrs.vertical,n=L.bounds(L.point(a,r),L.point(o,i)),s=t.options.crs.unproject(n.getCenter(!0)),l=e.zoom.maxZoom,h=e.zoom.minZoom;t.setView(s,M.getMaxZoom(n,t,h,l),{animate:!1})}getMapEl(){return this.getRootNode()instanceof ShadowRoot?this.getRootNode().host.closest("mapml-viewer,map[is=web-map]")?this.getRootNode().host.closest("mapml-viewer,map[is=web-map]"):this.getRootNode().querySelector("mapml-viewer,map[is=web-map]"):this.closest("mapml-viewer,map[is=web-map]")}getLayerEl(){return this.getRootNode()instanceof ShadowRoot?this.getRootNode().host.closest("layer-")?this.getRootNode().host.closest("layer-"):this.getRootNode().host:this.closest("layer-")}attributeChangedCallback(e,t,a){if(this.#hasConnected)switch(e){case"units":break;case"label":t!==a&&(this._layerControlHTML.querySelector(".mapml-layer-item-name").innerHTML=a||M.options.locale.dfExtent);break;case"checked":this.parentLayer.whenReady().then(()=>{this._handleChange(),this._calculateBounds(),this._layerControlCheckbox.checked=null!==a}).catch(e=>{console.log("Error while waiting on parentLayer for map-extent checked callback: "+e)});break;case"opacity":t!==a&&(this._opacity=a,this._extentLayer&&this._extentLayer.changeOpacity(a));break;case"hidden":t!==a&&this.parentLayer.whenReady().then(()=>{let e=this.parentLayer._propertiesGroupAnatomy;var t=Array.from(this.parentNode.querySelectorAll("map-extent:not([hidden])")).indexOf(this);null!==a?this._layerControlHTML.remove():0===t?e.insertAdjacentElement("afterbegin",this._layerControlHTML):0<t&&this.parentNode.querySelectorAll("map-extent:not([hidden])")[t-1]._layerControlHTML.insertAdjacentElement("afterend",this._layerControlHTML),this._validateLayerControlContainerHidden()}).catch(()=>{console.log("Error while waiting on parentLayer for map-extent hidden callback")})}}constructor(){super(),this._createLayerControlExtentHTML=M._createLayerControlExtentHTML.bind(this),this._changeHandler=this._handleChange.bind(this)}async connectedCallback(){this.parentLayer="LAYER-"===this.parentNode.nodeName.toUpperCase()?this.parentNode:this.parentNode.host,this.hasAttribute("data-moving")||this.parentLayer.hasAttribute("data-moving")||(this.mapEl=this.parentLayer.closest("mapml-viewer,map[is=web-map]"),await this.mapEl.whenProjectionDefined(this.units).catch(()=>{throw new Error("Undefined projection:"+this.units)}),this.isConnected&&(this.#hasConnected=!0,this._map=this.mapEl._map,this.parentLayer.addEventListener("map-change",this._changeHandler),this.mapEl.addEventListener("map-projectionchange",this._changeHandler),this._opacity=this.opacity||1,this._extentLayer=M.extentLayer({opacity:this.opacity,crs:M[this.units],extentZIndex:Array.from(this.parentLayer.querySelectorAll("map-extent")).indexOf(this),extentEl:this}),this._layerControlHTML=this._createLayerControlExtentHTML(),this._calculateBounds(),this._bindMutationObserver()))}_bindMutationObserver(){this._observer=new MutationObserver(e=>{for(var t of e)"childList"===t.type&&this._runMutationObserver(t.addedNodes)}),this._observer.observe(this,{childList:!0})}_runMutationObserver(a){var o=e=>{this.whenReady().then(()=>{this._calculateBounds(),this._validateDisabled()})};for(let t=0;t<a.length;++t){let e=a[t];"MAP-META"===e.nodeName&&e.hasAttribute("name")&&("zoom"===e.getAttribute("name").toLowerCase()||"extent"===e.getAttribute("name").toLowerCase())&&e.hasAttribute("content")&&o(e)}}getLayerControlHTML(){return this._layerControlHTML}_projectionMatch(){return this.units.toUpperCase()===this._map.options.projection.toUpperCase()}_validateDisabled(){if(this._extentLayer){let o=this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]");return!this._projectionMatch()||(()=>{let t=o.length,a=0;for(let e=0;e<t;e++)o[e]._validateDisabled()||a++;return a===t})()?(this.setAttribute("disabled",""),this.disabled=!0):(this.removeAttribute("disabled"),this.disabled=!1),this.toggleLayerControlDisabled(),this._handleChange(),this.disabled}}getMeta(e){e=e.toLowerCase();if("extent"===e||"zoom"===e)return this.parentLayer.src?this.querySelector(`:scope > map-meta[name=${e}]`)||this.parentLayer.shadowRoot.querySelector(`:host > map-meta[name=${e}]`):this.querySelector(`:scope > map-meta[name=${e}]`)||this.parentLayer.querySelector(`:scope > map-meta[name=${e}]`)}toggleLayerControlDisabled(){let e=this._layerControlCheckbox,t=this._layerControlLabel,a=this._opacityControl,o=this._opacitySlider,r=this._selectdetails;this.disabled?(e.disabled=!0,o.disabled=!0,t.style.fontStyle="italic",a.style.fontStyle="italic",r&&r.forEach(e=>{e.querySelectorAll("select").forEach(e=>{e.disabled=!0,e.style.fontStyle="italic"}),e.style.fontStyle="italic"})):(e.disabled=!1,o.disabled=!1,t.style.fontStyle="normal",a.style.fontStyle="normal",r&&r.forEach(e=>{e.querySelectorAll("select").forEach(e=>{e.disabled=!1,e.style.fontStyle="normal"}),e.style.fontStyle="normal"}))}_handleChange(){this.checked&&!this.disabled?(this._extentLayer.addTo(this.parentLayer._layer),this._extentLayer.setZIndex(Array.from(this.parentLayer.querySelectorAll("map-extent")).indexOf(this))):this.parentLayer._layer.removeLayer(this._extentLayer)}_validateLayerControlContainerHidden(){let e=this.parentLayer._propertiesGroupAnatomy,t=this.parentLayer.src?this.parentLayer.shadowRoot:this.parentLayer;e&&(0===t.querySelectorAll("map-extent:not([hidden])").length?e.setAttribute("hidden",""):e.removeAttribute("hidden"))}disconnectedCallback(){this.hasAttribute("data-moving")||this.parentLayer.hasAttribute("data-moving")||!this._extentLayer||(this._validateLayerControlContainerHidden(),this._layerControlHTML.remove(),this.parentLayer._layer&&this.parentLayer._layer.removeLayer(this._extentLayer),this.parentLayer.removeEventListener("map-change",this._changeHandler),this.mapEl.removeEventListener("map-projectionchange",this._changeHandler),delete this._extentLayer,this.parentLayer._layer&&delete this.parentLayer._layer.bounds)}_calculateBounds(){delete this._extentLayer.bounds,delete this._extentLayer.zoomBounds,this.parentLayer._layer&&delete this.parentLayer._layer.bounds;let t=this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]"),a=this.querySelector(":scope > map-meta[name=extent][content]")?M.getBoundsFromMeta(this):void 0,o=this.querySelector(":scope > map-meta[name=zoom][content]")?M.getZoomBoundsFromMeta(this):void 0;for(let e=0;e<t.length;e++){var r=t[e].getZoomBounds(),i=t[e].getBounds(),n=o&&o.hasOwnProperty("maxZoom")?o.maxZoom:-1/0,s=o&&o.hasOwnProperty("minZoom")?o.minZoom:1/0,l=o&&o.hasOwnProperty("minNativeZoom")?o.minNativeZoom:1/0,h=o&&o.hasOwnProperty("maxNativeZoom")?o.maxNativeZoom:-1/0;o?(n=Math.max(n,r.maxZoom),s=Math.min(s,r.minZoom),h=Math.max(h,r.maxNativeZoom),l=Math.min(l,r.minNativeZoom),o.minZoom=s,o.maxZoom=n,o.minNativeZoom=l,o.maxNativeZoom=h):o=Object.assign({},r),a?a.extend(i):a=L.bounds(i.min,i.max)}a?this._extentLayer.bounds=a:this._extentLayer.bounds=L.bounds(M[this.units].options.bounds.min,M[this.units].options.bounds.max),o=o||{},o.hasOwnProperty("minZoom")||(o.minZoom=0),o.hasOwnProperty("maxZoom")||(o.maxZoom=M[this.units].options.resolutions.length-1),o.hasOwnProperty("minNativeZoom")&&o.minNativeZoom!==1/0||(o.minNativeZoom=o.minZoom),o.hasOwnProperty("maxNativeZoom")&&o.maxNativeZoom!==-1/0||(o.maxNativeZoom=o.maxZoom),this._extentLayer.zoomBounds=o}whenReady(){return new Promise((t,a)=>{let o,r;this._extentLayer?t():(o=setInterval(function(e){e._extentLayer?(clearInterval(o),clearTimeout(r),t()):e.isConnected||(clearInterval(o),clearTimeout(r),a("map-extent was disconnected while waiting to be ready"))},300,this),r=setTimeout(function(){clearInterval(o),clearTimeout(r),a("Timeout reached waiting for extent to be ready")},1e4))})}whenLinksReady(){var e;let t=[];for(e of[...this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]")])t.push(e.whenReady());return Promise.allSettled(t)}}export{MapExtent};
//# sourceMappingURL=map-extent.js.map