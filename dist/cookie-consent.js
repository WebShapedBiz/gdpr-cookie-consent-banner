function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i])}return n}).apply(this,arguments)}function e(){return window.matchMedia("(prefers-reduced-motion)").matches}var t={expires:a(),path:"/"};function i(n){return Object.keys(n).map(function(e){return e+"="+n[e]}).join("; ")}function o(n){var e=("; "+document.cookie).split("; "+n+"=").pop().split(";").shift();if(e&&"undefined"!==e)return["true","false"].includes(e)?"true"===e:JSON.parse(e)}function s(){return document.cookie.split("; ").map(function(n){var e=n.split("=");return{key:e[0],value:e[1]}})}function c(e,o,s){var c={};c[e]=JSON.stringify(o),c=i(c=n({},c,{},t,{},s)),document.cookie=c}function r(e,o){var s={};s[e]="",s["max-age"]=0,s.path=t.path,(s=n({},s,{},o)).expires=new Date("1996-06-13"),c(e,s=i(s))}function a(n){void 0===n&&(n=365);var e=new Date;return e.setTime(e.getTime()+24*n*60*60*1e3),e}var u={__proto__:null,getCookie:o,getAllCookies:s,setCookie:c,removeCookie:r,clearCookies:function(n,e){var t=s(),i=new RegExp("^"+n,"g");t.forEach(function(n){var t=n.key;t.match(i)&&r(t,e)})},findCookie:function(n){var e=s(),t=new RegExp("^"+n,"g");return e.find(function(n){return t.test(n.key)})||null},getExpirationDate:a},h={ON_UPDATE:"onUpdate",ON_VALUE_CHANGED:"onValueChange",ON_ACCEPT:"onAccept",ON_REJECT:"onReject"},l=function(){function t(e){var t={debug:!1,name:"cookie-consent",banner:document.getElementById("cookiebanner"),notice:document.getElementById("cookienotice"),linkOnly:!1,onRejectEnd:function(){window.location.reload()},onAcceptEnd:function(n){var e=n.getChoices();n.saveUserOptions({choices:e})},capabilities:[{name:"functional",checked:!0,onReject:function(n){n.removeUserOptions()},onAccept:function(n){n.saveUserOptions({consented:!0})}}]};if(this.options=n({},t,{},e),this.queue=[],this.options.banner&&this.options.notice)if(this.button={},this.button.reject=this.options.banner.querySelector(".reject"),this.button.accept=this.options.banner.querySelector(".accept"),this.button.reject&&this.button.accept){this.initEvents();var i=this.loadUserOptions();i&&i.choices?(this.setChoices(i.choices),this.initStartUpEvents()):this.initFields(),i&&i.consented?this.showNotice():this.showBanner()}else console.error("Can not find required buttons!");else console.error("Can not find required elements!")}var i=t.prototype;return i.initFields=function(){var n=this.options.capabilities.map(function(n){return{name:n.name,value:n.checked}});return this.setChoices(n),n},i.initEvents=function(){var n=this;this.button.reject.addEventListener("click",function(){n.options.debug&&console.time("reject");var e=n.initFields();e.forEach(function(e){var t=n.getCapability(e.name);n._runValueEventsFor(t,e),n._runEventFor(t,h.ON_REJECT)}),n._startRunner(),n.setChoices(e),n.saveUserOptions({choices:e}),n.options.onRejectEnd instanceof Function&&n.options.onRejectEnd(n),n.options.debug&&console.timeEnd("reject"),n.hideBanner(),setTimeout(function(){n.showNotice()},160)}),this.button.accept.addEventListener("click",function(){n.options.debug&&console.time("accept"),n.getChoices().forEach(function(e){var t=n.getCapability(e.name);n._runValueEventsFor(t,e),n._runEventFor(t,e.value?h.ON_ACCEPT:h.ON_REJECT)}),n._startRunner(),n.options.onAcceptEnd instanceof Function&&n.options.onAcceptEnd(n),n.options.debug&&console.timeEnd("accept"),n.hideBanner(),setTimeout(function(){n.showNotice()},160)}),this.options.notice.addEventListener("click",function(){n.hideNotice(),n.showBanner()})},i.initStartUpEvents=function(){var n=this;this.getChoices().forEach(function(e){var t=n.getCapability(e.name);n._runEventFor(t,e.value?h.ON_ACCEPT:h.ON_REJECT),n._startRunner()})},i.loadUserOptions=function(){return o(this.options.name)||null},i.saveUserOptions=function(e){var t=n({},o(this.options.name),{},e);c(this.options.name,t)},i.removeUserOptions=function(){o(this.options.name)&&r(this.options.name)},i.getChoice=function(n){return this.options.banner.querySelector('.choice [name="choice:'+n+'"]').checked},i.getChoices=function(){var n=[];return this.options.banner.querySelectorAll(".choice input").forEach(function(e){var t=e.getAttribute("name").replace("choice:","");n.push({name:t,value:e.checked})}),n},i.setChoices=function(n){this.options.banner.querySelectorAll(".choice input").forEach(function(e){var t=e.getAttribute("name").replace("choice:",""),i=n.find(function(n){return n.name===t});i&&(e.checked=i.value)})},i.getCapability=function(n){return this.options.capabilities.find(function(e){return e.name===n})},i.showElement=function(n){"animate"in n&&!e()?n.animate([{opacity:0},{opacity:1}],{duration:320,iterations:1}).addEventListener("finish",function(){n.classList.add("visible")}):n.classList.add("visible")},i.hideElement=function(n){"animate"in n&&!e()?n.animate([{opacity:1},{opacity:0}],{duration:160,iterations:1}).addEventListener("finish",function(){n.classList.remove("visible")}):n.classList.remove("visible")},i.hideBanner=function(){this.hideElement(this.options.banner)},i.showBanner=function(){this.showElement(this.options.banner)},i.hideNotice=function(){this.options.linkOnly||this.hideElement(this.options.notice)},i.showNotice=function(){this.options.linkOnly||this.showElement(this.options.notice)},i._addToQueue=function(n,e){this.queue.push({name:n,func:e})},i._startRunner=function(){var n=this;Object.values(h).forEach(function(e){n.queue.filter(function(n){return n.name===e}).forEach(function(n){return(0,n.func)()})}),this.queue=[]},i._runEventFor=function(n,e,t){var i=this;void 0===t&&(t={}),n&&e&&n[e]&&n[e]instanceof Function?(this._addToQueue(e,function(){return n[e](i,t)}),this.options.debug&&console.info("[CookieConsent]: Added "+n.name+"."+e+" to queue")):this.options.debug&&console.warn("[CookieConsent]: Capability "+n.name+" has no event of name "+e)},i._runValueEventsFor=function(n,e){var t={choice:e.value};this._runEventFor(n,h.ON_UPDATE,t);var i=this.loadUserOptions();if(null==i?void 0:i.choices){var o=i.choices.find(function(n){return n.name===e.name});e.value!==o.value&&this._runEventFor(n,h.ON_VALUE_CHANGED,t)}},t}();l.cookieService=u,module.exports=l;
//# sourceMappingURL=cookie-consent.js.map
