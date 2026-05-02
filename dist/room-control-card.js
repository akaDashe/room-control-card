function t(t,e,i,o){var s,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new r(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,v=globalThis,g=v.trustedTypes,m=g?g.emptyScript:"",_=v.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const r=s.fromAttribute(e,t.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const r=this.constructor;if(!1===o&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,_?.({ReactiveElement:x}),(v.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,E=w.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,T=`<${P}>`,O=document,z=()=>O.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,M="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,I=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,L=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,G=O.createTreeWalker(O,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,o=[];let s,r=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===N?"!--"===l[1]?n=H:void 0!==l[1]?n=D:void 0!==l[2]?(L.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=I):void 0!==l[3]&&(n=I):n===I?">"===l[0]?(n=s??N,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?I:'"'===l[3]?B:j):n===B||n===j?n=I:n===H||n===D?n=N:(n=I,s=void 0);const h=n===I&&t[e+1].startsWith("/>")?" ":"";r+=n===N?i+T:c>=0?(o.push(a),i.slice(0,c)+S+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[J(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Z{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,r=0;const n=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Z.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(S)){const e=c[r++],i=o.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(L.test(o.tagName)){const t=o.textContent.split(C),e=t.length-1;if(e>0){o.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],z()),G.nextNode(),a.push({type:2,index:++s});o.append(t[e],z())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(C,t+1));)a.push({type:7,index:s}),t+=C.length-1}s++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,o){if(e===q)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const r=R(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=Y(t,s._$AS(t,e.values),s,o)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);G.currentNode=o;let s=G.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new X(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(s=G.nextNode(),r++)}return G.currentNode=O,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),R(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Q(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Z(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new X(this.O(z()),this.O(z()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,o){const s=this.strings;let r=!1;if(void 0===s)t=Y(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const o=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=Y(this,o[i+n],e,n),a===q&&(a=this._$AH[n]),r||=!R(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}r&&!o&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===q)return;const i=this._$AH,o=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Z,X),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new X(e.insertBefore(z(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ht=(t=dt,e,i)=>{const{kind:o,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const vt=n`
  :host {
    --rcc-icon-inactive: var(
      --disabled-color,
      rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.25)
    );
    --rcc-value-size: 12px;
    --rcc-name-size: 16px;
    --rcc-temp-size: 12px;
  }

  ha-card {
    overflow: hidden;
    padding: 10px 12px;
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 56px;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.12s ease;
    user-select: none;
  }

  ha-card:active {
    transform: scale(0.98);
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.06);
  }

  /* Card layout with optional icon */
  .card-layout {
    display: flex;
    align-items: stretch;
    gap: 6px;
    height: 100%;
    min-height: inherit;
    position: relative;
  }

  .room-icon-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.08);
    border: 1.5px solid rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.12);
    align-self: flex-end;
    margin-left: -46px;
    margin-top: -20px;
    margin-bottom: -24px;
  }

  .room-icon {
    --mdc-icon-size: 46px;
    display: flex;
    color: var(--secondary-text-color);
  }

  .card-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Top row */
  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    line-height: 1.2;
  }

  .room-name {
    font-size: var(--rcc-name-size);
    font-weight: 700;
    color: var(--primary-text-color);
    letter-spacing: 0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
  }

  .top-right-icons {
    display: flex;
    flex-wrap: nowrap;
    gap: 2px;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
  }

  .top-right-icons .entity-icon {
    --mdc-icon-size: 20px;
  }

  .top-right-icons .entity-item-wrap.value-only {
    display: inline-flex;
    align-items: center;
    height: 20px;
  }

  /* Bottom row */
  .bottom-row {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    margin-top: 2px;
  }

  .bottom-left-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .bottom-right-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: flex-end;
  }

  .bottom-right-icons .entity-item-wrap.value-only {
    display: inline-flex;
    align-items: center;
    height: 20px;
  }

  /* Entity items */
  .entity-item-wrap {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    line-height: 1;
  }

  .entity-icon {
    --mdc-icon-size: 20px;
    transition: color 0.25s ease;
    display: flex;
  }

  .entity-icon.inactive {
    color: var(--rcc-icon-inactive);
  }

  .entity-value {
    font-size: var(--rcc-value-size);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1;
    white-space: nowrap;
    padding-right: 1px;
  }

  .entity-item-wrap.value-left {
    gap: 0;
  }

  .entity-item-wrap.value-left .entity-value {
    margin-right: 2px;
  }

  .entity-item-wrap.value-left .entity-icon {
    margin-right: -2px;
  }

  .entity-item-wrap.value-only {
    align-items: center;
    line-height: 1.2;
  }

  .entity-item-wrap.value-only .entity-value {
    font-size: var(--rcc-temp-size);
    font-weight: 500;
    align-self: center;
  }

  .top-right-icons .entity-item-wrap.value-only .entity-value {
    font-size: var(--rcc-temp-size);
  }

  /* Responsive */
  @media screen and (max-width: 800px) {
    ha-card {
      padding: 8px 10px;
    }

    :host {
      --rcc-value-size: 12px;
      --rcc-name-size: 15px;
      --rcc-temp-size: 12px;
    }

    .top-right-icons .entity-icon {
      --mdc-icon-size: 20px;
    }

    .entity-icon {
      --mdc-icon-size: 18px;
    }

    .bottom-row {
      margin-top: 2px;
    }
  }
`,gt="room-control-card",mt="room-control-card-editor",_t={light:["on"],switch:["on"],fan:["on"],climate:["heat","cool","heat_cool","fan_only","auto"],media_player:["playing","paused","on"],cover:["open","opening","closing"],lock:["unlocked"],binary_sensor:["on"],sensor:[],camera:["recording","streaming"],vacuum:["cleaning","returning"],person:["home"],device_tracker:["home"]},ft={light:"var(--amber-color, #ffc107)",switch:"var(--amber-color, #ffc107)",fan:"var(--teal-color, #009688)",climate:"var(--deep-orange-color, #ff6f22)",media_player:"var(--indigo-color, #3f51b5)",cover:"var(--blue-color, #2196f3)",lock:"var(--red-color, #f44336)",binary_sensor:"var(--blue-color, #2196f3)",sensor:"var(--teal-color, #009688)",camera:"var(--red-color, #f44336)",vacuum:"var(--green-color, #4caf50)",person:"var(--green-color, #4caf50)",device_tracker:"var(--green-color, #4caf50)"},yt=[{value:"",label:"Default",color:""},{value:"var(--red-color)",label:"Red",color:"#f44336"},{value:"var(--pink-color)",label:"Pink",color:"#e91e63"},{value:"var(--purple-color)",label:"Purple",color:"#926bc7"},{value:"var(--deep-purple-color)",label:"Deep Purple",color:"#6e41ab"},{value:"var(--indigo-color)",label:"Indigo",color:"#3f51b5"},{value:"var(--blue-color)",label:"Blue",color:"#2196f3"},{value:"var(--light-blue-color)",label:"Light Blue",color:"#03a9f4"},{value:"var(--cyan-color)",label:"Cyan",color:"#00bcd4"},{value:"var(--teal-color)",label:"Teal",color:"#009688"},{value:"var(--green-color)",label:"Green",color:"#4caf50"},{value:"var(--light-green-color)",label:"Light Green",color:"#8bc34a"},{value:"var(--lime-color)",label:"Lime",color:"#cddc39"},{value:"var(--yellow-color)",label:"Yellow",color:"#ffeb3b"},{value:"var(--amber-color)",label:"Amber",color:"#ffc107"},{value:"var(--orange-color)",label:"Orange",color:"#ff9800"},{value:"var(--deep-orange-color)",label:"Deep Orange",color:"#ff6f22"},{value:"var(--brown-color)",label:"Brown",color:"#795548"},{value:"var(--grey-color)",label:"Grey",color:"#9e9e9e"},{value:"var(--blue-grey-color)",label:"Blue Grey",color:"#607d8b"}],bt={light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermometer",media_player:"mdi:speaker",cover:"mdi:blinds-horizontal",lock:"mdi:lock",camera:"mdi:cctv",sensor:"mdi:eye",binary_sensor:"mdi:motion-sensor",fan:"mdi:fan",vacuum:"mdi:robot-vacuum",person:"mdi:account",device_tracker:"mdi:map-marker"},$t=[{value:"more-info",label:"More info"},{value:"navigate",label:"Navigate"},{value:"call-service",label:"Call service"},{value:"url",label:"Open URL"},{value:"none",label:"None"}],xt=(async()=>{if(!["ha-entity-picker","ha-icon-picker","ha-switch","ha-textfield"].every(t=>customElements.get(t)))try{const t=await(window.loadCardHelpers?.());if(!t)return;const e=await t.createCardElement({type:"entities",entities:["sun.sun"]});e&&await(e.constructor?.getConfigElement?.())}catch(t){}})();let wt=class extends at{constructor(){super(...arguments),this._expandedEntity="",this._ready=!1}async connectedCallback(){super.connectedCallback(),await xt,this._ready=!0}static get styles(){return n`
      :host {
        display: block;
      }
      .card-config {
        padding: 0;
      }

      /* Sections using HA expansion panel style */
      .section {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        margin-bottom: 8px;
        overflow: visible;
      }
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        cursor: pointer;
        background: var(--card-background-color);
        user-select: none;
      }
      .section-header:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      .section-title {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .section-subtitle {
        font-size: 0.8rem;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }
      .section-chevron {
        --mdc-icon-size: 24px;
        color: var(--secondary-text-color);
        transition: transform 0.2s ease;
      }
      .section-chevron.open {
        transform: rotate(180deg);
      }
      .section-content {
        padding: 0 16px 16px;
        overflow: visible;
      }

      /* Entity items */
      .entity-item {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        margin-bottom: 6px;
      }
      .entity-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
      }
      .entity-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .entity-label {
        flex: 1;
        font-size: 0.85rem;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .entity-actions {
        display: flex;
        gap: 0;
        align-items: center;
      }
      .icon-btn {
        cursor: pointer;
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        padding: 4px;
        border-radius: 50%;
        transition: background 0.15s ease;
      }
      .icon-btn:hover {
        background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
      }
      .icon-btn.remove:hover {
        color: var(--error-color, #f44336);
      }

      /* Entity options */
      .entity-options {
        padding: 8px 12px 12px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .option-row {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
      .option-row > * {
        flex: 1;
      }
      .form-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .switch-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
      }
      .switch-option span {
        font-size: 0.85rem;
        color: var(--primary-text-color);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
        color: var(--primary-color);
        font-size: 0.75rem;
        cursor: default;
      }
      .chip ha-icon {
        --mdc-icon-size: 14px;
        cursor: pointer;
      }
      .active-state-input {
        display: flex;
        gap: 4px;
        align-items: center;
      }
      .active-state-input input {
        flex: 1;
        background: transparent;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        padding: 6px 8px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
      }
      .active-state-input button {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border: none;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 0.8rem;
        cursor: pointer;
      }

      /* Add entity picker */
      .add-entity {
        margin-top: 8px;
      }

      /* Border radius grid */
      .radius-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      /* Action editor */
      .action-select {
        width: 100%;
        background: var(--input-fill-color, var(--card-background-color, #fff));
        border: 1px solid var(--input-ink-color, var(--divider-color, #e0e0e0));
        border-radius: 4px;
        padding: 10px 12px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
        outline: none;
      }

      ha-textfield,
      ha-icon-picker,
      ha-entity-picker {
        display: block;
        width: 100%;
      }

      /* Color dropdown */
      .color-select-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .color-select-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .color-select {
        width: 100%;
        background: var(--input-fill-color, var(--card-background-color, #fff));
        border: 1px solid var(--input-ink-color, var(--divider-color, #e0e0e0));
        border-radius: 4px;
        padding: 10px 12px;
        color: var(--primary-text-color);
        font-size: 0.85rem;
        outline: none;
        appearance: auto;
      }
      .color-swatch {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 6px;
        vertical-align: middle;
      }
    `}setConfig(t){this._config=t}_fire(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_set(t,e){this._config={...this._config,[t]:e},this._fire()}_updateEntity(t,e,i){const o=[...this._config[t]||[]];o[e]={...o[e],...i},this._set(t,o)}_removeEntity(t,e){const i=(this._config[t]||[]).filter((t,i)=>i!==e);this._set(t,i),this._expandedEntity=""}_moveEntity(t,e,i){const o=[...this._config[t]||[]],s=e+i;s<0||s>=o.length||([o[e],o[s]]=[o[s],o[e]],this._set(t,o),this._expandedEntity=`${t}-${s}`)}_addEntity(t,e){const i=[...this._config[t]||[],{entity:e}];this._set(t,i)}_addActiveState(t,e,i){const o=(this._config[t]||[])[e];if(!o)return;const s=o.active_states||[];s.includes(i)||this._updateEntity(t,e,{active_states:[...s,i]})}_removeActiveState(t,e,i){const o=(this._config[t]||[])[e];if(!o)return;const s=(o.active_states||[]).filter(t=>t!==i);this._updateEntity(t,e,{active_states:s.length?s:void 0})}_renderEntitySection(t,e,i){const o=this._config[t]||[];return V`
      <div class="section">
        <div class="section-header">
          <div>
            <div class="section-title">${e}</div>
            <div class="section-subtitle">${i}</div>
          </div>
        </div>
        <div class="section-content">
          ${o.map((e,i)=>{const s=this.hass.states[e.entity],r=s?.attributes?.friendly_name||e.entity,n=e.icon||s?.attributes?.icon||"mdi:help-circle",a=`${t}-${i}`,l=this._expandedEntity===a,c=e.entity.split(".")[0],d=_t[c]||[];return V`
              <div class="entity-item">
                <div class="entity-header">
                  <ha-icon class="entity-icon" icon=${n}></ha-icon>
                  <span class="entity-label">${r}</span>
                  <div class="entity-actions">
                    ${i>0?V`<ha-icon
                          class="icon-btn"
                          icon="mdi:arrow-up"
                          @click=${e=>{e.stopPropagation(),this._moveEntity(t,i,-1)}}
                        ></ha-icon>`:W}
                    ${i<o.length-1?V`<ha-icon
                          class="icon-btn"
                          icon="mdi:arrow-down"
                          @click=${e=>{e.stopPropagation(),this._moveEntity(t,i,1)}}
                        ></ha-icon>`:W}
                    <ha-icon
                      class="icon-btn"
                      icon="mdi:pencil"
                      @click=${t=>{t.stopPropagation(),this._expandedEntity=l?"":a}}
                    ></ha-icon>
                    <ha-icon
                      class="icon-btn remove"
                      icon="mdi:close"
                      @click=${e=>{e.stopPropagation(),this._removeEntity(t,i)}}
                    ></ha-icon>
                  </div>
                </div>
                ${l?V`
                      <div class="entity-options">
                        <ha-entity-picker
                          .hass=${this.hass}
                          .value=${e.entity}
                          .label=${"Entity"}
                          allow-custom-entity
                          @value-changed=${e=>{e.stopPropagation(),this._updateEntity(t,i,{entity:e.detail.value})}}
                        ></ha-entity-picker>

                        <ha-icon-picker
                          .hass=${this.hass}
                          .label=${"Icon override"}
                          .value=${e.icon||""}
                          @value-changed=${e=>{e.stopPropagation(),this._updateEntity(t,i,{icon:e.detail.value||void 0})}}
                        ></ha-icon-picker>

                        <div class="option-row">
                          <div class="color-select-wrap">
                            <span class="color-select-label">Active color</span>
                            <select
                              class="color-select"
                              @change=${e=>this._updateEntity(t,i,{active_color:e.target.value||void 0})}
                            >
                              ${yt.map(t=>V`
                                  <option
                                    value=${t.value}
                                    ?selected=${(e.active_color||"")===t.value}
                                  >
                                    ${t.label}
                                  </option>
                                `)}
                            </select>
                          </div>
                          <div class="color-select-wrap">
                            <span class="color-select-label">Inactive color</span>
                            <select
                              class="color-select"
                              @change=${e=>this._updateEntity(t,i,{inactive_color:e.target.value||void 0})}
                            >
                              ${yt.map(t=>V`
                                  <option
                                    value=${t.value}
                                    ?selected=${(e.inactive_color||"")===t.value}
                                  >
                                    ${t.label}
                                  </option>
                                `)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div class="form-label">
                            Active states
                            ${e.active_states?.length?W:V`<span style="opacity:0.6">
                                  (default: ${d.join(", ")||"any non-off"})</span
                                >`}
                          </div>
                          <div class="chips">
                            ${(e.active_states||[]).map(e=>V`
                                <span class="chip">
                                  ${e}
                                  <ha-icon
                                    icon="mdi:close"
                                    @click=${()=>this._removeActiveState(t,i,e)}
                                  ></ha-icon>
                                </span>
                              `)}
                          </div>
                          <div class="active-state-input">
                            <input
                              type="text"
                              placeholder="e.g. on, playing, &gt;20"
                              @keydown=${e=>{if("Enter"===e.key){const o=e.target,s=o.value.trim();s&&(this._addActiveState(t,i,s),o.value="")}}}
                            />
                            <button
                              @click=${e=>{const o=e.target.previousElementSibling,s=o.value.trim();s&&(this._addActiveState(t,i,s),o.value="")}}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div class="form-label">Active attribute (optional)</div>
                        <div class="option-row">
                          <ha-textfield
                            .label=${"Attribute name"}
                            .value=${e.active_attribute||""}
                            placeholder="e.g. hvac_action"
                            @input=${e=>this._updateEntity(t,i,{active_attribute:e.target.value||void 0})}
                          ></ha-textfield>
                          <ha-textfield
                            .label=${"Attribute value"}
                            .value=${e.active_attribute_value||""}
                            placeholder="e.g. heating"
                            @input=${e=>this._updateEntity(t,i,{active_attribute_value:e.target.value||void 0})}
                          ></ha-textfield>
                        </div>

                        <div class="switch-option">
                          <span>Show only when active</span>
                          <ha-switch
                            .checked=${!0===e.show_only_active}
                            @change=${e=>this._updateEntity(t,i,{show_only_active:e.target.checked||void 0})}
                          ></ha-switch>
                        </div>

                        <div class="switch-option">
                          <span>Show value</span>
                          <ha-switch
                            .checked=${!0===e.show_value}
                            @change=${o=>this._updateEntity(t,i,{show_value:o.target.checked||void 0,value_position:o.target.checked?e.value_position||"right":void 0})}
                          ></ha-switch>
                        </div>

                        ${e.show_value?V`
                              <div class="switch-option">
                                <span>Value left of icon</span>
                                <ha-switch
                                  .checked=${"left"===e.value_position}
                                  @change=${e=>this._updateEntity(t,i,{value_position:e.target.checked?"left":void 0})}
                                ></ha-switch>
                              </div>
                            `:W}

                        <div class="switch-option">
                          <span>Hide icon (value only)</span>
                          <ha-switch
                            .checked=${!0===e.hide_icon}
                            @change=${e=>this._updateEntity(t,i,{hide_icon:e.target.checked||void 0})}
                          ></ha-switch>
                        </div>
                      </div>
                    `:W}
              </div>
            `})}
          <div class="add-entity">
            <ha-entity-picker
              .hass=${this.hass}
              .label=${"Add entity"}
              .value=${""}
              allow-custom-entity
              @value-changed=${e=>{e.stopPropagation();const i=e.detail.value;if(!i)return;this._addEntity(t,i);const o=e.target;requestAnimationFrame(()=>{o.value="",o.comboBox&&(o.comboBox.selectedItem=void 0),o.requestUpdate?.()})}}
            ></ha-entity-picker>
          </div>
        </div>
      </div>
    `}_renderBorderRadius(){const t=this._config.border_radius||{};return V`
      <div class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Border Radius</div>
            <div class="section-subtitle">Set each corner independently</div>
          </div>
        </div>
        <div class="section-content">
          <div class="radius-grid">
            <ha-textfield
              .label=${"Top left"}
              .value=${t.top_left||""}
              @input=${e=>this._set("border_radius",{...t,top_left:e.target.value||void 0})}
            ></ha-textfield>
            <ha-textfield
              .label=${"Top right"}
              .value=${t.top_right||""}
              @input=${e=>this._set("border_radius",{...t,top_right:e.target.value||void 0})}
            ></ha-textfield>
            <ha-textfield
              .label=${"Bottom left"}
              .value=${t.bottom_left||""}
              @input=${e=>this._set("border_radius",{...t,bottom_left:e.target.value||void 0})}
            ></ha-textfield>
            <ha-textfield
              .label=${"Bottom right"}
              .value=${t.bottom_right||""}
              @input=${e=>this._set("border_radius",{...t,bottom_right:e.target.value||void 0})}
            ></ha-textfield>
          </div>
        </div>
      </div>
    `}_renderActionEditor(t,e){const i=this._config[t]||{action:"tap_action"===t?"more-info":"none"};return V`
      <div style="margin-bottom: 8px">
        <div class="form-label">${e}</div>
        <select
          class="action-select"
          @change=${e=>this._set(t,{action:e.target.value})}
        >
          ${$t.map(t=>V`<option value=${t.value} ?selected=${t.value===i.action}>
                ${t.label}
              </option>`)}
        </select>
        ${"navigate"===i.action?V`<ha-textfield
              .label=${"Navigation path"}
              .value=${i.navigation_path||""}
              style="margin-top:4px"
              @input=${e=>this._set(t,{...i,navigation_path:e.target.value})}
            ></ha-textfield>`:W}
        ${"url"===i.action?V`<ha-textfield
              .label=${"URL"}
              .value=${i.url_path||""}
              style="margin-top:4px"
              @input=${e=>this._set(t,{...i,url_path:e.target.value})}
            ></ha-textfield>`:W}
        ${"call-service"===i.action?V`<ha-textfield
              .label=${"Service (e.g. light.toggle)"}
              .value=${i.service||""}
              style="margin-top:4px"
              @input=${e=>this._set(t,{...i,service:e.target.value})}
            ></ha-textfield>`:W}
      </div>
    `}render(){return this.hass&&this._config&&this._ready?V`
      <div class="card-config">
        <ha-textfield
          .label=${"Room Name"}
          .value=${this._config.name||""}
          style="margin-bottom: 12px"
          @input=${t=>this._set("name",t.target.value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .label=${"Room Icon (optional)"}
          .value=${this._config.icon||""}
          style="margin-bottom: 12px"
          @value-changed=${t=>{t.stopPropagation(),this._set("icon",t.detail.value||void 0)}}
        ></ha-icon-picker>

        ${this._renderEntitySection("entities_top_right","Top Right","Icons aligned right on the title row")}
        ${this._renderEntitySection("entities_bottom_left","Bottom Left","Icons on the bottom row, left side")}
        ${this._renderEntitySection("entities_bottom_right","Bottom Right","Icons on the bottom row, right side")}
        ${this._renderBorderRadius()}

        <div class="section">
          <div class="section-header">
            <div>
              <div class="section-title">Actions</div>
              <div class="section-subtitle">Tap, double tap, and hold</div>
            </div>
          </div>
          <div class="section-content">
            ${this._renderActionEditor("tap_action","Tap action")}
            ${this._renderActionEditor("double_tap_action","Double tap action")}
            ${this._renderActionEditor("hold_action","Hold action")}
          </div>
        </div>
      </div>
    `:V``}};t([pt({attribute:!1})],wt.prototype,"hass",void 0),t([ut()],wt.prototype,"_config",void 0),t([ut()],wt.prototype,"_expandedEntity",void 0),t([ut()],wt.prototype,"_ready",void 0),wt=t([ct(mt)],wt),console.info("%c ROOM-CONTROL-CARD %c v0.6.1 ","color: white; background: #4a90d9; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #4a90d9; background: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;");let At=class extends at{constructor(){super(...arguments),this._dblClickTimer=null,this._holdTimer=null,this._held=!1}static get styles(){return vt}static getConfigElement(){return document.createElement(mt)}static getStubConfig(t){const e=Object.keys(t.states).filter(t=>t.startsWith("light.")).slice(0,2).map(t=>({entity:t})),i=Object.keys(t.states).filter(t=>t.startsWith("climate.")).slice(0,1).map(t=>({entity:t}));return{type:`custom:${gt}`,name:"Room",entities_bottom_left:e,entities_top_right:i}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t}getCardSize(){return 2}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")){const e=t.get("hass");if(!e)return!0;return this._getAllEntityIds().some(t=>e.states[t]!==this.hass.states[t])}return!0}_getAllEntityIds(){const t=this._config;return[...t.entities_top_right||[],...t.entities_bottom_left||[],...t.entities_bottom_right||[]].map(t=>t.entity)}_getDomain(t){return t.split(".")[0]}_isActive(t,e){if(t.active_attribute){const i=String(e.attributes[t.active_attribute]??"");return t.active_attribute_value?i===t.active_attribute_value:!!e.attributes[t.active_attribute]}if(t.active_states&&t.active_states.length>0)return t.active_states.includes(e.state);const i=this._getDomain(e.entity_id),o=_t[i];return o&&o.length>0?o.includes(e.state):"off"!==e.state&&"unavailable"!==e.state&&"unknown"!==e.state}_getIcon(t,e){if(t.icon)return t.icon;if(e.attributes.icon)return e.attributes.icon;const i=this._getDomain(e.entity_id),o=e.attributes.device_class;if(o){const t={temperature:"mdi:thermometer",humidity:"mdi:water-percent",pressure:"mdi:gauge",illuminance:"mdi:brightness-5",battery:"mdi:battery",power:"mdi:flash",energy:"mdi:lightning-bolt",voltage:"mdi:sine-wave",current:"mdi:current-ac",gas:"mdi:meter-gas",moisture:"mdi:water",motion:"mdi:motion-sensor",door:"mdi:door-open",window:"mdi:window-open",opening:"mdi:door",occupancy:"mdi:home-account",vibration:"mdi:vibrate",smoke:"mdi:smoke-detector-variant",carbon_monoxide:"mdi:molecule-co",carbon_dioxide:"mdi:molecule-co2",pm25:"mdi:air-filter"};if(t[o])return t[o]}return bt[i]||"mdi:help-circle"}_getActiveColor(t,e){if(t.active_color)return t.active_color;const i=this._getDomain(e.entity_id);if("light"===i&&e.attributes.rgb_color){const[t,i,o]=e.attributes.rgb_color;if((.299*t+.587*i+.114*o)/255<.85)return`rgb(${t}, ${i}, ${o})`}return ft[i]||"var(--state-icon-active-color, var(--primary-color))"}_getInactiveColor(t){return t.inactive_color||"var(--secondary-text-color)"}_getDisplayValue(t){const e=t.attributes.unit_of_measurement||"",i=t.state,o=parseFloat(i);if(!isNaN(o)&&isFinite(o)){const i=this.hass.entities?.[t.entity_id],s=i?.display_precision??t.attributes.display_precision;return null!=s?`${o.toFixed(s)}${e}`:`${Math.round(o)}${e}`}return e?`${i}${e}`:i}_renderEntityIcons(t){return t.map(t=>{const e=this.hass.states[t.entity];if(!e)return W;const i=this._isActive(t,e);if(t.show_only_active&&!i)return W;const o=this._getIcon(t,e),s=i?this._getActiveColor(t,e):this._getInactiveColor(t),r=t.show_value&&"left"===t.value_position,n=t.show_value&&"left"!==t.value_position,a=!0===t.hide_icon,l=a&&!t.show_value;return V`
        <span
          class="entity-item-wrap ${r?"value-left":""} ${a?"value-only":""}"
        >
          ${r?V`<span class="entity-value" style="color: ${s}"
                >${this._getDisplayValue(e)}</span
              >`:W}
          ${a?W:V`<ha-icon
                class="entity-icon ${i?"":"inactive"}"
                icon=${o}
                style="color: ${s}"
              ></ha-icon>`}
          ${n?V`<span class="entity-value" style="color: ${s}"
                >${this._getDisplayValue(e)}</span
              >`:W}
          ${l?V`<span class="entity-value" style="color: ${s}"
                >${this._getDisplayValue(e)}</span
              >`:W}
        </span>
      `})}_getBorderRadiusStyle(){const t=this._config.border_radius;if(!t)return"";const e="var(--ha-card-border-radius, 12px)",i=t.top_left||e,o=t.top_right||e,s=t.bottom_right||e,r=t.bottom_left||e,n=t=>{if(!t)return 0;const e=Number.parseFloat(t.trim());return Number.isNaN(e)?0:e},a=Math.max(n(t.top_left),n(t.bottom_left)),l=Math.max(n(t.top_right),n(t.bottom_right));let c=`border-radius: ${i} ${o} ${s} ${r};`;return a>0&&(c+=` padding-left: ${Math.max(8,Math.round(.6*a))}px;`),l>0&&(c+=` padding-right: ${Math.max(8,Math.round(.6*l))}px;`),c}_handleAction(t){if(t&&"none"!==t.action)switch(t.action){case"more-info":{const t=this._config.entities_bottom_left?.[0]?.entity||this._config.entities_top_right?.[0]?.entity||this._config.entities_bottom_right?.[0]?.entity;t&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}));break}case"navigate":t.navigation_path&&(history.pushState(null,"",t.navigation_path),window.dispatchEvent(new Event("location-changed",{bubbles:!0,composed:!0})));break;case"url":t.url_path&&window.open(t.url_path,"_blank");break;case"call-service":if(t.service){const[e,i]=t.service.split(".");this.hass.callService(e,i,t.service_data||{},t.target)}}}_handleTap(){if(!this._held)return this._dblClickTimer?(clearTimeout(this._dblClickTimer),this._dblClickTimer=null,void this._handleAction(this._config.double_tap_action||{action:"none"})):void(this._dblClickTimer=setTimeout(()=>{this._dblClickTimer=null,this._handleAction(this._config.tap_action||{action:"more-info"})},250));this._held=!1}_handlePointerDown(){this._held=!1,this._holdTimer=setTimeout(()=>{this._held=!0,this._handleAction(this._config.hold_action||{action:"none"})},500)}_handlePointerUp(){this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)}render(){if(!this._config||!this.hass)return V``;const t=this._config.entities_top_right||[],e=this._config.entities_bottom_left||[],i=this._config.entities_bottom_right||[],o=e.length>0||i.length>0,s=this._config.icon;return V`
      <ha-card
        style="${this._getBorderRadiusStyle()}"
        @click=${this._handleTap}
        @pointerdown=${this._handlePointerDown}
        @pointerup=${this._handlePointerUp}
        @pointercancel=${this._handlePointerUp}
      >
        <div class="card-layout">
          ${s?V`<div class="room-icon-wrap">
                <ha-icon class="room-icon" icon=${s}></ha-icon>
              </div>`:W}
          <div class="card-content">
            <div class="top-row">
              ${s?W:V`<span class="room-name">${this._config.name||"Room"}</span>`}
              ${t.length?V`<div class="top-right-icons">${this._renderEntityIcons(t)}</div>`:W}
            </div>
            ${o?V`
                  <div class="bottom-row">
                    <div class="bottom-left-icons">${this._renderEntityIcons(e)}</div>
                    <div class="bottom-right-icons">${this._renderEntityIcons(i)}</div>
                  </div>
                `:W}
          </div>
        </div>
      </ha-card>
    `}};t([pt({attribute:!1})],At.prototype,"hass",void 0),t([ut()],At.prototype,"_config",void 0),At=t([ct(gt)],At),window.customCards=window.customCards||[],window.customCards.push({type:gt,name:"Room Control Card",description:"Compact room tile with entity status icons and tap actions",preview:!0});export{At as RoomControlCard};
