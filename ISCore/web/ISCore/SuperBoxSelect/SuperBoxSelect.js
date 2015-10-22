// vim: sw=4:ts=4:nu:nospell:fdc=4
/*
 *  Copyright 2014 Fred Hutchinson Cancer Research Center
 *
 *  Licensed under the Apache License, Version 2.0 (the 'License');
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

Ext.namespace('Ext.ux.form');
/**
 * <p>
 * SuperBoxSelect is an extension of the ComboBox component that displays
 * selected items as labelled boxes within the form field. As seen on facebook,
 * hotmail and other sites.
 * </p>
 * <p>
 * The SuperBoxSelect component was inspired by the BoxSelect component found
 * here: http://efattal.fr/en/extjs/extuxboxselect/
 * </p>
 *
 * @author <a href=\'mailto:dan.humphrey@technomedia.co.uk\'>Dan Humphrey</a>
 * @class Ext.ux.form.SuperBoxSelect
 * @extends Ext.form.ComboBox
 * @constructor
 * @component
 * @version 1.0b
 * @license TBA
 *
 */

/* var cbStudyVarName = new Ext.ux.form.SuperBoxSelect({
	        lastQuery: '',
            listeners: {
                beforequery: function(qe){
                    qe.combo.onLoad();
                    return false;
                }
            }
        });
*/

Ext.ux.form.SuperBoxSelect = function(config) {
    Ext.ux.form.SuperBoxSelect.superclass.constructor.call(this, config);
    this.addEvents(
            /**
             * Fires before an item is added to the component via user
             * interaction. Return false from the callback function to prevent
             * the item from being added.
             *
             * @event beforeadditem
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             * @param {Mixed}
             *            value The value of the item to be added
             */
            'beforeadditem',

            /**
             * Fires after a new item is added to the component.
             *
             * @event additem
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             * @param {Mixed}
             *            value The value of the item which was added
             * @param {Record}
             *            record The store record which was added
             */
            'additem',

            /**
             * Fires when the allowAddNewData config is set to true, and a user
             * attempts to add an item that is not in the data store.
             *
             * @event newitem
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             * @param {Mixed}
             *            value The new item's value
             */
            'newitem',

            /**
             * Fires when an item's remove button is clicked. Return false from
             * the callback function to prevent the item from being removed.
             *
             * @event beforeremoveitem
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             * @param {Mixed}
             *            value The value of the item to be removed
             */
            'beforeremoveitem',

            /**
             * Fires after an item has been removed.
             *
             * @event removeitem
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             * @param {Mixed}
             *            value The value of the item which was removed
             * @param {Record}
             *            record The store record which was removed
             */
            'removeitem',
            /**
             * Fires after the component values have been cleared.
             *
             * @event clear
             * @memberOf Ext.ux.form.SuperBoxSelect
             * @param {SuperBoxSelect}
             *            this
             */
            'clear');

};
/**
 * @private hide from doc gen
 */
Ext.ux.form.SuperBoxSelect = Ext.extend(Ext.ux.form.SuperBoxSelect,
    Ext.form.ComboBox, {
        maxCustomHeight : null,

        /////////////////////////////
        //      Custom configs     //
        /////////////////////////////
        autoSelect : false,
        emptyText : 'Select...',
        forceSelection: true,
        listEmptyText: '<p align="center">No items on this page.</p>',
        minChars: 0,
        mode: 'local',
        resizable: true,
        triggerAction: 'all',
        typeAhead: true,
        /////////////////////////////

        /**
         * @cfg {Boolean} expandOnClick When set to true, clicking on the field
         *      ( anywhere left of the trigger controls and not on the selected
         *      bubble elements ) toggles the drop-down list; also keeps the list
         *      open on keyboard ENTER press. Defaults to true.
         */
        expandOnClick : true,

        /**
         * @cfg {Boolean} loopKeyNav When set to true, navigating the drop-down list
         *      with keyboard's UP and DOWN keys loops around the list. Defaults to true.
         */
        loopKeyNav : true,

        /**
         * @cfg {Boolean} keepClearBtn When set to true, the clear button does not
         *      disappear, when there are no items, it resets the field on click. Defaults to true.
         */
        keepClearBtn : true,

        /**
         * @cfg {Boolean} anyMatch When set to true, allows items to
         *      be searched via type-ahead anywhere withing the string,
         *      not just the beginning. Defaults to true.
         */
        anyMatch : true,

        /**
         * @cfg {Boolean} caseSensitive When set to true, the type-ahead search
         *      is case sensitive. Defaults to false.
         */
        caseSensitive : false,

        /**
         * @cfg {Boolean} allowAddNewData When set to true, allows items to
         *      be added (via the setValueEx and addItem methods) that do
         *      not already exist in the data store. Defaults to false.
         */
        allowAddNewData : false,

        /**
         * @cfg {Boolean} backspaceDeletesLastItem When set to false, the
         *      BACKSPACE key will focus the last selected item. When set to
         *      true, the last item will be immediately deleted. Defaults to
         *      true.
         */
        backspaceDeletesLastItem : true,

        /**
         * @cfg {String} classField The underlying data field that will be
         *      used to supply an additional class to each item.
         */
        classField : null,

        /**
         * @cfg {String} clearBtnCls An additional class to add to the
         *      in-field clear button.
         */
        clearBtnCls : '',

        /**
         * @cfg {String/XTemplate} displayFieldTpl A template for rendering
         *      the displayField in each selected item. Defaults to null.
         */
        displayFieldTpl : null,

        /**
         * @cfg {String} extraItemCls An additional css class to apply to
         *      each item.
         */
        extraItemCls : 'x-superboxselect-item-default',

        /**
         * @cfg {String} itemHoverCls A css class to apply to each item on hover.
         */
        itemHoverCls : 'x-superboxselect-item-hover',

        /**
         * @cfg {String} itemFocusCls A css class to apply to each item on focus.
         */
        itemFocusCls : 'x-superboxselect-item-focus-default',

        /**
         * @cfg {String} markComboMatchCls A css class to apply to each drop down item
         *      matching the currently typed in string.
         */
        markComboMatchCls : 'mark-combo-match',

        /**
         * @cfg {String/Object/Function} extraItemStyle Additional css
         *      style(s) to apply to each item. Should be a valid argument
         *      to Ext.Element.applyStyles.
         */
        extraItemStyle : '',

        /**
         * @cfg {String} expandBtnCls An additional class to add to the
         *      in-field expand button.
         */
        expandBtnCls : '',

        /**
         * @cfg {Boolean} fixFocusOnTabSelect When set to true, the
         *      component will not lose focus when a list item is selected
         *      with the TAB key. Defaults to true.
         */
        fixFocusOnTabSelect : true,

        /**
         * @cfg {Boolean} navigateItemsWithTab When set to true the tab key
         *      will navigate between selected items. Defaults to true.
         */
        navigateItemsWithTab : true,

        /**
         * @cfg {Boolean} pinList When set to true the select list will be
         *      pinned to allow for multiple selections. Defaults to true.
         */
        pinList : true,

        /**
         * @cfg {Boolean} preventDuplicates When set to true unique item
         *      values will be enforced. Defaults to true.
         */
        preventDuplicates : true,

        /**
         * @cfg {String} queryValuesDelimiter Used to delimit multiple
         *      values queried from the server when mode is remote.
         */
        queryValuesDelimiter : '|',

        /**
         * @cfg {String} queryValuesIndicator A request variable that is
         *      sent to the server (as true) to indicate that we are
         *      querying values rather than display data (as used in
         *      autocomplete) when mode is remote.
         */
        queryValuesIndicator : 'valuesqry',

        /**
         * @cfg {Boolean} removeValuesFromStore When set to true, selected
         *      records will be removed from the store. Defaults to true.
         */
        removeValuesFromStore : true,

        /**
         * @cfg {String} renderFieldBtns When set to true, will render
         *      in-field buttons for clearing the component, and displaying
         *      the list for selection. Defaults to true.
         */
        renderFieldBtns : true,

        /**
         * @cfg {Boolean} stackItems When set to true, the items will be
         *      stacked 1 per line. Defaults to false which displays the
         *      items inline.
         */
        stackItems : false,

        /**
         * @cfg {String} styleField The underlying data field that will be
         *      used to supply additional css styles to each item.
         */
        styleField : null,

        /**
         * @cfg {Boolean} supressClearValueRemoveEvents When true, the
         *      removeitem event will not be fired for each item when the
         *      clearValue method is called, or when the clear button is
         *      used. Defaults to false.
         */
        supressClearValueRemoveEvents : false,

        /**
         * @cfg {String/Boolean} validationEvent The event that should
         *      initiate field validation. Set to false to disable automatic
         *      validation (defaults to 'blur').
         */
        validationEvent : 'blur',

        /**
         * @cfg {String} valueDelimiter The delimiter to use when joining
         *      and splitting value arrays and strings.
         */
        valueDelimiter : ',',
        initComponent : function() {
            Ext.apply(this, {
                items : new Ext.util.MixedCollection(false),
                usedRecords : new Ext.util.MixedCollection(false),
                addedRecords : [],
                remoteLookup : [],
                hideTrigger : true,
                grow : false,
                multiSelectMode : false,
                preRenderValue : null
            });

            if (this.transform) {
                this.doTransform();
            }

            Ext.ux.form.SuperBoxSelect.superclass.initComponent.call(this);
            if (this.mode === 'remote' && this.store) {
                this.store.on('load', this.onStoreLoad, this);
            }

            this.mon(
                this.store, {
                    datachanged:  this.resizeToFitContent,
                    add:          this.resizeToFitContent,
                    remove:       this.resizeToFitContent,
                    load:         this.resizeToFitContent,
                    update:       this.resizeToFitContent,
                    buffer: 10,
                    scope: this
                }
            );
        },
        resizeToFitContent: function(){
            var el = this.getEl();
            if ( el && this.rendered ){
                if (!this.elMetrics){
                    this.elMetrics = Ext.util.TextMetrics.createInstance(this.getEl());
                }
                var m = this.elMetrics, width = 0, s = this.getSize();
                this.store.each(function (r) {
                    var text = r.get(this.displayField);
                    width = Math.max(width, m.getWidth( Ext.util.Format.htmlEncode(text) ));
                }, this);
                width += el.getBorderWidth('lr');
                width += el.getPadding('lr');
                if (this.trigger) {
                    width += this.trigger.getWidth();
                }
                s.width = width;
                width += 3 * Ext.getScrollBarWidth() + 60;
                if ( this.pageSize > 0 && this.pageTb ){
                    var toolbar = this.pageTb.el;
                    width = Math.max(
                        width,
                        toolbar.child('.x-toolbar-left-row').getWidth() +
                        toolbar.child('.x-toolbar-left').getFrameWidth('lr') +
                        toolbar.child('.x-toolbar-right').getFrameWidth('lr') +
                        toolbar.getFrameWidth('lr')
                    );
                }
                this.listWidth = width;
                this.minListWidth = width;
                if ( this.list && this.innerList ){
                    this.list.setSize( width );
                    this.innerList.setWidth( width - this.list.getFrameWidth('lr') );
                    this.restrictHeight();
                }

                if( this.resizable && this.resizer ){
                    this.resizer.minWidth = width;
                }
            }
        },
        initList : function(){
            if(!this.list){
                var cls = 'x-combo-list',
                    listParent = Ext.getDom(this.getListParent() || Ext.getBody());

                this.list = new Ext.Layer({
                    parentEl: listParent,
                    shadow: this.shadow,
                    cls: [cls, this.listClass].join(' '),
                    constrain:false,
                    zindex: this.getZIndex(listParent)
                });

                var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
                this.list.setSize(lw, 0);
                this.list.swallowEvent('mousewheel');
                this.assetHeight = 0;
                if(this.syncFont !== false){
                    this.list.setStyle('font-size', this.el.getStyle('font-size'));
                }
                if(this.title){
                    this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                    this.assetHeight += this.header.getHeight();
                }

                this.innerList = this.list.createChild({cls:cls+'-inner'});
                this.mon(this.innerList, 'mouseover', this.onViewOver, this);
                this.mon(this.innerList, 'mousemove', this.onViewMove, this);
                this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

                if(this.pageSize){
                    this.footer = this.list.createChild({cls:cls+'-ft'});
                    this.pageTb = new Ext.PagingToolbar({
                        store: this.store,
                        pageSize: this.pageSize,
                        renderTo:this.footer
                    });
                    this.assetHeight += this.footer.getHeight();
                }

                if(!this.tpl){
                    /**
                     * @cfg {String/Ext.XTemplate} tpl <p>The template string, or {@link Ext.XTemplate} instance to
                     * use to display each item in the dropdown list. The dropdown list is displayed in a
                     * DataView. See {@link #view}.</p>
                     * <p>The default template string is:</p><pre><code>
                     '&lt;tpl for=".">&lt;div class="x-combo-list-item">{' + this.displayField + '}&lt;/div>&lt;/tpl>'
                     * </code></pre>
                     * <p>Override the default value to create custom UI layouts for items in the list.
                     * For example:</p><pre><code>
                     '&lt;tpl for=".">&lt;div ext:qtip="{state}. {nick}" class="x-combo-list-item">{state}&lt;/div>&lt;/tpl>'
                     * </code></pre>
                     * <p>The template <b>must</b> contain one or more substitution parameters using field
                     * names from the Combo's</b> {@link #store Store}. In the example above an
                     * <pre>ext:qtip</pre> attribute is added to display other fields from the Store.</p>
                     * <p>To preserve the default visual look of list items, add the CSS class name
                     * <pre>x-combo-list-item</pre> to the template's container element.</p>
                     * <p>Also see {@link #itemSelector} for additional details.</p>
                     */
                    this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
                    /**
                     * @cfg {String} itemSelector
                     * <p>A simple CSS selector (e.g. div.some-class or span:first-child) that will be
                     * used to determine what nodes the {@link #view Ext.DataView} which handles the dropdown
                     * display will be working with.</p>
                     * <p><b>Note</b>: this setting is <b>required</b> if a custom XTemplate has been
                     * specified in {@link #tpl} which assigns a class other than <pre>'x-combo-list-item'</pre>
                     * to dropdown list items</b>
                     */
                }

                /**
                 * The {@link Ext.DataView DataView} used to display the ComboBox's options.
                 * @type Ext.DataView
                 */
                this.view = new Ext.DataView({
                    applyTo: this.innerList,
                    tpl: this.tpl,
                    singleSelect: true,
                    selectedClass: this.selectedClass,
                    itemSelector: this.itemSelector || '.' + cls + '-item',
                    emptyText: this.listEmptyText,
                    deferEmptyText: false
                });

                this.mon(this.view, {
                    containerclick : this.onViewClick,
                    click : this.onViewClick,
                    scope :this
                });

                this.bindStore(this.store, true);

                if ( this.pageSize > 0 && this.pageTb ){
                    var toolbar = this.pageTb.el;
                    var width = Math.max(
                        this.getWidth(),
                        toolbar.child('.x-toolbar-left-row').getWidth() +
                        toolbar.child('.x-toolbar-left').getFrameWidth('lr') +
                        toolbar.child('.x-toolbar-right').getFrameWidth('lr') +
                        toolbar.getFrameWidth('lr')
                    );
                    this.listWidth = width;
                    this.minListWidth = width;
                    this.list.setSize( width );
                    this.innerList.setWidth( width - this.list.getFrameWidth('lr') );
                }

                if(this.resizable){
                    this.resizer = new Ext.Resizable(this.list,  {
                        pinned:true, handles:'se', minWidth: this.minListWidth
                    });
                    this.mon(this.resizer, 'resize', function(r, w, h){
                        this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                        this.listWidth = w;
                        this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                        this.restrictHeight();
                    }, this);

                    this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
                }
            }
        },
        selectPrev: function(){
            var ct = this.store.getCount();
            if ( ct > 0 ){
                if ( this.loopKeyNav ){
                    if ( this.selectedIndex == -1 ){
                        this.select( ct - 1 );
                    } else if ( this.selectedIndex > -1 ){
                        this.select( this.selectedIndex - 1 );
                    }
                } else {
                    Ext.ux.form.SuperBoxSelect.superclass.selectPrev.call(this);
                }
            }
        },
        selectNext: function(){
            var ct = this.store.getCount();
            if ( ct > 0 ){
                if ( this.loopKeyNav ){
                    if ( this.selectedIndex < ct - 1 ){
                        this.select( this.selectedIndex + 1 );
                    } else if ( this.selectedIndex == ct - 1 ){
                        this.select( -1 );
                    }
                } else {
                    Ext.ux.form.SuperBoxSelect.superclass.selectNext.call(this);
                }
            }
        },
        getAllValuesAsArray: function(){
            var c = [];

            Ext.each( this.store.data.items, function(r){ c.push( r.data.Value ); } );

            Ext.each( this.usedRecords.items, function(r){ c.push( r.data.Value ); } );

            return c;
        },
        onRender : function(ct, position) {
            Ext.ux.form.SuperBoxSelect.superclass.onRender.call(this, ct, position);

            this.el.dom.removeAttribute('name');

            var extraClass = (this.stackItems === true)
                    ? 'x-superboxselect-stacked'
                    : '';
            if (this.renderFieldBtns) {
                extraClass += ' x-superboxselect-display-btns';
            }
            this.el.removeClass('x-form-text')
                    .addClass('x-superboxselect-input-field');

            this.wrapEl = this.el.wrap({
                tag : 'ul'
            });

            this.outerWrapEl = this.wrapEl.wrap({
                tag : 'div',
                cls : 'x-form-text x-superboxselect ' + extraClass,
                style : Ext.isEmpty(this.maxCustomHeight)
                        ? 'height: auto;'
                        : 'height: ' + this.maxCustomHeight + 'px;'
            });

            this.inputEl = this.el.wrap({
                tag : 'li',
                cls : 'x-superboxselect-input'
            });

            if (this.renderFieldBtns) {
                this.setupFieldButtons().manageClearBtn();
            }

            this.setupFormInterception();

            if (this.preRenderValue) {
                this.setValue(this.preRenderValue);
                this.preRenderValue = null;
            }

        },
        onStoreLoad : function(store, records, options) {
            // accomodating for bug in Ext 3.0.0 where
            // options.params are empty
            var q               =   options.params[this.queryParam] ||
                                    store.baseParams[this.queryParam] || '',
                isValuesQuery   =   options.params[this.queryValuesIndicator] ||
                                    store.baseParams[this.queryValuesIndicator];

            if (this.removeValuesFromStore) {
                this.store.each(function(record) {
                    if (this.usedRecords.containsKey(record
                            .get(this.valueField))) {
                        this.store.remove(record);
                    }
                }, this);
            }
            // queried values
            if (isValuesQuery) {
                var params = q.split(this.queryValuesDelimiter);
                Ext.each(params, function(p) {
                    this.remoteLookup.remove(p);
                    var rec = this.findRecord(this.valueField, p);
                    if (rec) {
                        this.addRecord(rec);
                    }
                }, this);

                if (this.setOriginal) {
                    this.setOriginal = false;
                    this.originalValue = this.getValue();
                }
            }

            // queried display (autocomplete) & addItem
            if (q !== '' && this.allowAddNewData) {
                Ext.each(this.remoteLookup, function(r) {
                    if (typeof r == 'object' && r[this.displayField] == q) {
                        this.remoteLookup.remove(r);
                        if (records.length
                                && records[0].get(this.displayField) === q) {
                            this.addRecord(records[0]);
                            return;
                        }
                        var rec = this.createRecord(r);
                        this.store.add(rec);
                        this.addRecord(rec);
                        this.addedRecords.push(rec); // keep track of records added to store
                        (function() {
                            if (this.isExpanded()) {
                                this.collapse();
                            }
                        }).defer(10, this);
                        return;
                    }
                }, this);
            }

            var toAdd = [];
            if (q === '') {
                Ext.each(this.addedRecords, function(rec) {
                    if (this.preventDuplicates
                            && this.usedRecords.containsKey(rec
                            .get(this.valueField))) {
                        return;
                    }
                    toAdd.push(rec);

                }, this);

            } else {
                var re = new RegExp(Ext.escapeRe(q) + '.*', 'i');
                Ext.each(this.addedRecords, function(rec) {
                    if (this.preventDuplicates
                            && this.usedRecords.containsKey(rec
                            .get(this.valueField))) {
                        return;
                    }
                    if (re.test(rec.get(this.displayField))) {
                        toAdd.push(rec);
                    }
                }, this);
            }
            this.store.add(toAdd);
            this.sortStore();

            if (this.store.getCount() === 0 && this.isExpanded()) {
                this.collapse();
            }

        },
        doTransform : function() {
            var s = Ext.getDom(this.transform), transformValues = [];
            if (!this.store) {
                this.mode = 'local';
                var d = [], opts = s.options;
                for (var i = 0, len = opts.length; i < len; i++) {
                    var o = opts[i], value = (Ext.isIE && !Ext.isIE8 ? o
                            .getAttributeNode('value').specified : o
                            .hasAttribute('value')) ? o.value : o.text, cls = (Ext.isIE
                            && !Ext.isIE8
                            ? o.getAttributeNode('class').specified
                            : o.hasAttribute('class')) ? o.className : '', style = (Ext.isIE
                            && !Ext.isIE8
                            ? o.getAttributeNode('style').specified
                            : o.hasAttribute('style')) ? o.style : '';
                    if (o.selected) {
                        transformValues.push(value);
                    }
                    d.push([value, o.text, cls, style.cssText]);
                }
                this.store = new Ext.data.SimpleStore({
                    'id' : 0,
                    fields : ['value', 'text', 'cls', 'style'],
                    data : d
                });
                Ext.apply(this, {
                    valueField : 'value',
                    displayField : 'text',
                    classField : 'cls',
                    styleField : 'style'
                });
            }

            if (transformValues.length) {
                this.value = transformValues.join(',');
            }
        },
        setupFieldButtons : function() {
            this.buttonWrap = this.outerWrapEl.createChild({
                cls : 'x-superboxselect-btns'
            });

            this.buttonClear = this.buttonWrap.createChild({
                tag : 'div',
                cls : 'x-superboxselect-btn-clear '
                        + this.clearBtnCls
            });

            this.buttonExpand = this.buttonWrap.createChild({
                tag : 'div',
                cls : 'x-superboxselect-btn-expand '
                        + this.expandBtnCls
            });

            this.initButtonEvents();

            return this;
        },
        initButtonEvents : function() {
            this.buttonClear.addClassOnOver('x-superboxselect-btn-over')
                .on('click', function(e) {
                    e.stopEvent();
                    if (this.disabled) {
                        return;
                    }
                    this.reset();
                }, this);

            this.buttonExpand.addClassOnOver('x-superboxselect-btn-over')
                .on('click', this.toggleList, this);
        },
        removeButtonEvents : function() {
            this.buttonClear.removeAllListeners();
            this.buttonExpand.removeAllListeners();
            return this;
        },
        clearCurrentFocus : function() {
            if (this.currentFocus) {
                this.currentFocus.onLnkBlur();
                this.currentFocus = null;
            }
            return this;
        },
        initEvents : function() {
            var el = this.el;

            el.on({
                click : this.onClick,
                focus : this.clearCurrentFocus,
                blur : this.onBlur,

                keydown : this.onKeyDownHandler,
                keyup : this.onKeyUpBuffered,

                scope : this
            });

            this.on({
                collapse : this.onCollapse,
                expand : this.clearCurrentFocus,
                scope : this
            });

            if ( this.expandOnClick ){
                this.mon( this.wrapEl, {
                    click: this.toggleList,
                    scope: this
                });
            } else {
                this.wrapEl.on('click', this.onWrapClick, this);
                this.outerWrapEl.on('click', this.onWrapClick, this);
            }

            this.inputEl.focus = function() {
                el.focus();
            };

            Ext.ux.form.SuperBoxSelect.superclass.initEvents.call(this);

            Ext.apply(this.keyNav, {
                tab : function(e) {
                    if (this.fixFocusOnTabSelect && this.isExpanded()) {
                        e.stopEvent();
                        el.blur();
                        this.onViewClick(false);
                        this.focus(false, 10);
                        return true;
                    }

                    this.onViewClick(false);
                    if (el.dom.value !== '') {
                        this.setRawValue('');
                    }

                    return true;
                },

                down : function(e) {
                    if (!this.isExpanded() && !this.currentFocus) {
                        if ( this.expandOnClick ){
                            this.toggleList(e);
                        } else {
                            this.onTriggerClick();
                        }
                    } else {
                        this.inKeyMode = true;
                        this.selectNext();
                    }
                },

                enter : function() {
                    this.select( this.selectedIndex );
                },

                pageDown : function(){
                    if ( this.pageTb ){
                        var pd = this.pageTb.getPageData();
                        if ( pd.activePage > 1 ){
                            this.pageTb.movePrevious();
                        }
                    }
                },

                pageUp : function(){
                    if ( this.pageTb ){
                        var pd = this.pageTb.getPageData();
                        if ( pd.activePage < pd.pages ){
                            this.pageTb.moveNext();
                        }
                    }
                },

                home : function(){
                    if ( this.pageTb ){
                        var pd = this.pageTb.getPageData();
                        if ( pd.activePage > 1 ){
                            this.pageTb.moveFirst();
                        }
                    }
                },

                end : function(){
                    if ( this.pageTb ){
                        var pd = this.pageTb.getPageData();
                        if ( pd.activePage < pd.pages ){
                            this.pageTb.moveLast();
                        }
                    }
                }
            });
        },
        onClick : function(e) {
            if ( this.expandOnClick ){
                this.toggleList(e);
            } else {
                this.clearCurrentFocus();
                this.collapse();
                this.autoSize();
            }
        },
        beforeBlur : Ext.form.ComboBox.superclass.beforeBlur,
        onFocus : function() {
            this.outerWrapEl.addClass(this.focusClass);

            Ext.ux.form.SuperBoxSelect.superclass.onFocus.call(this);
        },
        onBlur : function() {
            this.outerWrapEl.removeClass(this.focusClass);

            this.clearCurrentFocus();

            if (this.el.dom.value !== '') {
                this.applyEmptyText();
                this.autoSize();
            }

            Ext.ux.form.SuperBoxSelect.superclass.onBlur.call(this);
        },
        onCollapse : function() {
            this.view.clearSelections();
            this.multiSelectMode = false;
        },
        onWrapClick : function(e) {
            e.stopEvent();
            this.collapse();
            this.el.focus();
            this.clearCurrentFocus();
        },
        toggleList : function(e) {
            e.stopEvent();
            if (this.disabled) {
                return;
            }
            if (this.isExpanded()) {
                this.multiSelectMode = false;
            } else if (this.pinList) {
                this.multiSelectMode = true;
            }
            this.onTriggerClick();
        },
        markInvalid : function(msg) {
            var elp, t;
            return;
            if (!this.rendered || this.preventMark) {
                return;
            }
            this.outerWrapEl.addClass(this.invalidClass);
            msg = msg || this.invalidText;

            switch (this.msgTarget) {
                case 'qtip' :
                    Ext.apply(this.el.dom, {
                        qtip : msg,
                        qclass : 'x-form-invalid-tip'
                    });
                    Ext.apply(this.wrapEl.dom, {
                        qtip : msg,
                        qclass : 'x-form-invalid-tip'
                    });
                    if (Ext.QuickTips) { // fix for floating editors
                        // interacting with DND
                        Ext.QuickTips.enable();
                    }
                    break;
                case 'title' :
                    this.el.dom.title = msg;
                    this.wrapEl.dom.title = msg;
                    this.outerWrapEl.dom.title = msg;
                    break;
                case 'under' :
                    if (!this.errorEl) {
                        elp = this.getErrorCt();
                        if (!elp) { // field has no container el
                            this.el.dom.title = msg;
                            break;
                        }
                        this.errorEl = elp.createChild({
                            cls : 'x-form-invalid-msg'
                        });
                        this.errorEl.setWidth(elp.getWidth(true) - 20);
                    }
                    this.errorEl.update(msg);
                    Ext.form.Field.msgFx[this.msgFx].show(this.errorEl,
                            this);
                    break;
                case 'side' :
                    if (!this.errorIcon) {
                        elp = this.getErrorCt();
                        if (!elp) { // field has no container el
                            this.el.dom.title = msg;
                            break;
                        }
                        this.errorIcon = elp.createChild({
                            cls : 'x-form-invalid-icon'
                        });
                    }
                    this.alignErrorIcon();
                    Ext.apply(this.errorIcon.dom, {
                        qtip : msg,
                        qclass : 'x-form-invalid-tip'
                    });
                    this.errorIcon.show();
                    this.on('resize', this.alignErrorIcon, this);
                    break;
                default :
                    t = Ext.getDom(this.msgTarget);
                    t.innerHTML = msg;
                    t.style.display = this.msgDisplay;
                    break;
            }
            this.fireEvent('invalid', this, msg);
        },
        clearInvalid : function() {
            if (!this.rendered || this.preventMark) { // not rendered
                return;
            }
            this.outerWrapEl.removeClass(this.invalidClass);
            switch (this.msgTarget) {
                case 'qtip' :
                    this.el.dom.qtip = '';
                    this.wrapEl.dom.qtip = '';
                    break;
                case 'title' :
                    this.el.dom.title = '';
                    this.wrapEl.dom.title = '';
                    this.outerWrapEl.dom.title = '';
                    break;
                case 'under' :
                    if (this.errorEl) {
                        Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl,
                                this);
                    }
                    break;
                case 'side' :
                    if (this.errorIcon) {
                        this.errorIcon.dom.qtip = '';
                        this.errorIcon.hide();
                        this.un('resize', this.alignErrorIcon, this);
                    }
                    break;
                default :
                    var t = Ext.getDom(this.msgTarget);
                    t.innerHTML = '';
                    t.style.display = 'none';
                    break;
            }
            this.fireEvent('valid', this);
        },
        alignErrorIcon : function() {
            if (this.wrap) {
                this.errorIcon.alignTo(this.wrap, 'tl-tr', [
                    Ext.isIE ? 5 : 2, 3]);
            }
        },
        expand : function() {
            if (this.isExpanded() || !this.hasFocus) {
                return;
            }
            this.list.alignTo(this.outerWrapEl, this.listAlign).show();
            this.innerList.setOverflow('auto'); // necessary for FF
            // 2.0/Mac
            Ext.getDoc().on({
                mousewheel : this.collapseIf,
                mousedown : this.collapseIf,
                scope : this
            });
            this.fireEvent('expand', this);
        },
        restrictHeight : function() {
            var inner = this.innerList.dom, st = inner.scrollTop, list = this.list;

            inner.style.height = '';

            var pad = list.getFrameWidth('tb')
                    + (this.resizable ? this.handleHeight : 0)
                    + this.assetHeight, h = Math.max(inner.clientHeight,
                    inner.offsetHeight, inner.scrollHeight), ha = this
                    .getPosition()[1]
                    - Ext.getBody().getScroll().top, hb = Ext.lib.Dom
                    .getViewHeight()
                    - ha - this.getSize().height, space = Math.max(ha, hb,
                    this.minHeight || 0)
                    - list.shadowOffset - pad - 5;

            h = Math.min(h, space, this.maxHeight);
            this.innerList.setHeight(h);

            list.beginUpdate();
            list.setHeight(h + pad);
            list.alignTo(this.outerWrapEl, this.listAlign);
            list.endUpdate();

            if (this.multiSelectMode) {
                inner.scrollTop = st;
            }
        },
        validateValue : function(val) {
            if (this.items.getCount() === 0) {
                if (this.allowBlank) {
                    this.clearInvalid();
                    return true;
                } else {
                    this.markInvalid(this.blankText);
                    return false;
                }
            } else {
                this.clearInvalid();
                return true;
            }
        },
        setupFormInterception : function() {
            var form;
            this.findParentBy(function(p) {
                if (p.getForm) {
                    form = p.getForm();
                }
            });
            if (form) {
                var formGet = form.getValues;
                form.getValues = function(asString) {
                    if (this.items.getCount() > 0) {
                        this.el.dom.disabled = true;
                    }
                    var oldVal = this.el.dom.value;
                    this.setRawValue('');
                    var vals = formGet.call(form, asString);
                    this.el.dom.disabled = false;
                    this.setRawValue(oldVal);
                    return vals;
                }.createDelegate(this);
            }
        },
        onResize : function(w, h, rw, rh) {
            var reduce = Ext.isIE6 ? 4 : Ext.isIE7 ? 1 : Ext.isIE8 ? 1 : 0;

            this._width = w;
            this.outerWrapEl.setWidth(w - reduce);
            if (this.renderFieldBtns) {
                reduce += (this.buttonWrap.getWidth() + 20);
                this.wrapEl.setWidth(w - reduce);
            }
            Ext.ux.form.SuperBoxSelect.superclass.onResize.call(this, w, h, rw, rh);
            this.autoSize();
        },
        onEnable : function() {
            Ext.ux.form.SuperBoxSelect.superclass.onEnable.call(this);
            this.items.each(function(item) {
                item.enable();
            });
            if (this.renderFieldBtns) {
                this.initButtonEvents();
            }
        },
        onDisable : function() {
            Ext.ux.form.SuperBoxSelect.superclass.onDisable.call(this);
            this.items.each(function(item) {
                item.disable();
            });
            if (this.renderFieldBtns) {
                this.removeButtonEvents();
            }
        },
        /**
         * Clears all values from the component.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name clearValue
         * @param {Boolean}
         *            supressRemoveEvent [Optional] When true, the
         *            'removeitem' event will not fire for each item that is
         *            removed.
         */
        clearValue : function(supressRemoveEvent) {
            this.preventMultipleRemoveEvents = supressRemoveEvent
                    || this.supressClearValueRemoveEvents || false;
            this.removeAllItems();
            Ext.ux.form.SuperBoxSelect.superclass.clearValue.call(this);
            this.fireEvent('clear', this);
            return this;
        },
        onKeyUp : function(e) {
            if (this.editable !== false && !e.isSpecialKey()
                    && (!e.hasModifier() || e.shiftKey)) {
                this.lastKey = e.getKey();
                this.dqTask.delay(this.queryDelay);
            }
        },
        onKeyDownHandler : function(e, t) {
            var toDestroy, nextFocus, idx;
            if ((e.getKey() === e.DELETE || e.getKey() === e.SPACE) && this.currentFocus) {
                e.stopEvent();
                toDestroy = this.currentFocus;
                this.on('expand', function() {
                    this.collapse();
                }, this, {
                    single : true
                });
                idx = this.items.indexOfKey(this.currentFocus.key);

                this.clearCurrentFocus();

                if (idx < (this.items.getCount() - 1)) {
                    nextFocus = this.items.itemAt(idx + 1);
                }

                toDestroy.preDestroy(true);
                if (nextFocus) {
                    (function() {
                        nextFocus.onLnkFocus();
                        this.currentFocus = nextFocus;
                    }).defer(200, this);
                }

                return true;
            }

            var val = this.el.dom.value, it, ctrl = e.ctrlKey;
            if (e.getKey() === e.ENTER) {
                e.stopEvent();
                if (val !== '') {
                    if (ctrl || !this.isExpanded()) { // ctrl+enter
                        // for new
                        // items
                        this.view.clearSelections();
                        this.collapse();
                        this.setRawValue('');
                        this.fireEvent('newitem', this, val);
                    } else {
                        this.onViewClick();
                        // removed from 3.0.1
                        if (this.unsetDelayCheck) {
                            this.delayedCheck = true;
                            this.unsetDelayCheck.defer(10, this);
                        }
                    }
                } else {
                    if (!this.isExpanded()) {
                        return;
                    }
                    this.onViewClick();
                    // removed from 3.0.1
                    if (this.unsetDelayCheck) {
                        this.delayedCheck = true;
                        this.unsetDelayCheck.defer(10, this);
                    }
                }
                return true;
            }

            if (val !== '') {
                this.autoSize();
                return;
            }

            // select first item
            if (e.getKey() === e.HOME) {
                e.stopEvent();

                if ( ! this.isExpanded() ){
                    if ( this.items.getCount() > 0 ){
                        this.collapse();
                        it = this.items.get(0);
                        it.el.focus();
                    }
                }
                return true;
            }
            // backspace remove
            if (e.getKey() === e.BACKSPACE) {
                e.stopEvent();
                if (this.currentFocus) {
                    toDestroy = this.currentFocus;
                    this.on('expand', function() {
                        this.collapse();
                    }, this, {
                        single : true
                    });

                    idx = this.items.indexOfKey(toDestroy.key);

                    this.clearCurrentFocus();
                    if (idx < (this.items.getCount() - 1)) {
                        nextFocus = this.items.itemAt(idx + 1);
                    }

                    toDestroy.preDestroy(true);

                    if (nextFocus) {
                        (function() {
                            nextFocus.onLnkFocus();
                            this.currentFocus = nextFocus;
                        }).defer(200, this);
                    }

                    return;
                } else {
                    it = this.items.get(this.items.getCount() - 1);
                    if (it) {
                        if (this.backspaceDeletesLastItem) {
                            this.on('expand', function() {
                                this.collapse();
                            }, this, {
                                single : true
                            });
                            it.preDestroy(true);
                        } else {
                            if (this.navigateItemsWithTab) {
                                it.onElClick();
                            } else {
                                this.on('expand', function() {
                                    this.collapse();
                                    this.currentFocus = it;
                                    this.currentFocus.onLnkFocus
                                            .defer(
                                            20,
                                            this.currentFocus);
                                }, this, {
                                    single : true
                                });
                            }
                        }
                    }
                    return true;
                }
            }

            if (!e.isNavKeyPress()) {
                this.multiSelectMode = false;
                this.clearCurrentFocus();
                return;
            }
            // arrow nav
            if (e.getKey() === e.LEFT || (e.getKey() === e.UP && !this.isExpanded())) {
                e.stopEvent();
                this.collapse();
                // get last item
                it = this.items.get(this.items.getCount() - 1);
                if (this.navigateItemsWithTab) {
                    // focus last el
                    if (it) {
                        it.focus();
                    }
                } else {
                    // focus prev item
                    if (this.currentFocus) {
                        idx = this.items.indexOfKey(this.currentFocus.key);
                        this.clearCurrentFocus();

                        if (idx !== 0) {
                            this.currentFocus = this.items.itemAt(idx - 1);
                            this.currentFocus.onLnkFocus();
                        }
                    } else {
                        this.currentFocus = it;
                        if (it) {
                            it.onLnkFocus();
                        }
                    }
                }
                return true;
            }
            if (e.getKey() === e.DOWN) {
                if (this.currentFocus) {
                    this.collapse();
                    e.stopEvent();
                    idx = this.items.indexOfKey(this.currentFocus.key);
                    if (idx == (this.items.getCount() - 1)) {
                        this.clearCurrentFocus.defer(10, this);
                    } else {
                        this.clearCurrentFocus();
                        this.currentFocus = this.items.itemAt(idx + 1);
                        if (this.currentFocus) {
                            this.currentFocus.onLnkFocus();
                        }
                    }
                    return true;
                }
            }
            if (e.getKey() === e.RIGHT) {
                this.collapse();
                it = this.items.itemAt(0);
                if (this.navigateItemsWithTab) {
                    // focus first el
                    if (it) {
                        it.focus();
                    }
                } else {
                    if (this.currentFocus) {
                        idx = this.items.indexOfKey(this.currentFocus.key);
                        this.clearCurrentFocus();
                        if (idx < (this.items.getCount() - 1)) {
                            this.currentFocus = this.items.itemAt(idx + 1);
                            if (this.currentFocus) {
                                this.currentFocus.onLnkFocus();
                            }
                        }
                    } else {
                        this.currentFocus = it;
                        if (it) {
                            it.onLnkFocus();
                        }
                    }
                }
            }
            if (e.getKey() === e.TAB) {
            }
        },
        onKeyUpBuffered : function(e) {
            if (!e.isNavKeyPress()) {
                this.autoSize();
            }
        },
        reset : function() {
            Ext.ux.form.SuperBoxSelect.superclass.reset.call(this);
            this.addedRecords = [];
            this.autoSize();
            this.setRawValue('');
            this.blur();
            this.triggerBlur();
            this.clearInvalid();
        },
        applyEmptyText : function() {
            if (this.items.getCount() > 0) {
                this.el.removeClass(this.emptyClass);
                this.setRawValue('');
                return this;
            }
            if (this.rendered && this.emptyText
                    && this.getRawValue().length < 1) {
                this.setRawValue(this.emptyText);
                this.el.addClass(this.emptyClass);
            }
            return this;
        },
        /**
         * @private
         *
         * Use clearValue instead
         */
        removeAllItems : function() {
            this.items.each(function(item) {
                item.preDestroy(true);
            }, this);
            this.manageClearBtn();
            return this;
        },
        resetStore : function() {
            this.store.clearFilter();
            if (!this.removeValuesFromStore) {
                return this;
            }
            this.usedRecords.each(function(rec) {
                this.store.add(rec);
            }, this);
            this.sortStore();
            return this;
        },
        sortStore : function() {
            if ( this.store.multiSortInfo && this.fields ){
                this.store.sort( this.store.multiSortInfo.sorters, this.store.multiSortInfo.direction );
            }
            return this;
        },
        getCaption : function(dataObject) {
            if (typeof this.displayFieldTpl === 'string') {
                this.displayFieldTpl = new Ext.XTemplate(this.displayFieldTpl);
            }
            var caption, recordData = dataObject instanceof Ext.data.Record
                    ? dataObject.data
                    : dataObject;

            if (this.displayFieldTpl) {
                caption = this.displayFieldTpl.apply(recordData);
            } else if (this.displayField) {
                caption = recordData[this.displayField];
            }

            return caption;
        },
        addRecord : function(record) {
            var display = record.data[this.displayField], caption = this
                    .getCaption(record), val = record.data[this.valueField], cls = this.classField
                    ? record.data[this.classField]
                    : '', style = this.styleField
                    ? record.data[this.styleField]
                    : '';

            if (this.removeValuesFromStore) {
                this.usedRecords.add(val, record);
                this.store.remove(record);
            }

            this.addItemBox(val, display, caption, cls, style);
            this.fireEvent('additem', this, val, record);
        },
        createRecord : function(recordData) {
            if (!this.recordConstructor) {
                var recordFields = [{
                    name : this.valueField
                }, {
                    name : this.displayField
                }];
                if (this.classField) {
                    recordFields.push({
                        name : this.classField
                    });
                }
                if (this.styleField) {
                    recordFields.push({
                        name : this.styleField
                    });
                }
                this.recordConstructor = Ext.data.Record
                        .create(recordFields);
            }
            return new this.recordConstructor(recordData);
        },
        /**
         * Adds an array of items to the SuperBoxSelect component if the
         * {@link #Ext.ux.form.SuperBoxSelect-allowAddNewData} config is set
         * to true.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name addItem
         * @param {Array}
         *            newItemObjects An Array of object literals containing
         *            the property names and values for an item. The
         *            property names must match those specified in
         *            {@link #Ext.ux.form.SuperBoxSelect-displayField},
         *            {@link #Ext.ux.form.SuperBoxSelect-valueField} and
         *            {@link #Ext.ux.form.SuperBoxSelect-classField}
         */
        addItems : function(newItemObjects) {
            if (Ext.isArray(newItemObjects)) {
                Ext.each(newItemObjects, function(item) {
                    this.addItem(item);
                }, this);
            } else {
                this.addItem(newItemObjects);
            }
        },
        /**
         * Adds an item to the SuperBoxSelect component if the
         * {@link #Ext.ux.form.SuperBoxSelect-allowAddNewData} config is set
         * to true.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name addItem
         * @param {Object}
         *            newItemObject An object literal containing the
         *            property names and values for an item. The property
         *            names must match those specified in
         *            {@link #Ext.ux.form.SuperBoxSelect-displayField},
         *            {@link #Ext.ux.form.SuperBoxSelect-valueField} and
         *            {@link #Ext.ux.form.SuperBoxSelect-classField}
         */
        addItem : function(newItemObject) {
            var val = newItemObject[this.valueField];

            if (this.disabled) {
                return false;
            }
            if (this.preventDuplicates && this.hasValue(val)) {
                return;
            }

            // use existing record if found
            var record = this.findRecord(this.valueField, val);
            if (record) {
                this.addRecord(record);
                return;
            } else if (!this.allowAddNewData) { // else it's a new
                // item
                return;
            }

            if (this.mode === 'remote') {
                this.remoteLookup.push(newItemObject);
                this.doQuery(val, false, false);
                return;
            }

            var rec = this.createRecord(newItemObject);
            this.store.add(rec);
            this.addRecord(rec);

            return true;
        },
        addItemBox : function(itemVal, itemDisplay, itemCaption, itemClass, itemStyle) {
            var parseStyle = function(s) {
                var ret = '';
                if (typeof s == 'function') {
                    ret = s.call();
                } else if (typeof s == 'object') {
                    for (var p in s) {
                        ret += p + ':' + s[p] + ';';
                    }
                } else if (typeof s == 'string') {
                    ret = s + ';';
                }
                return ret;
            };
            var itemKey = Ext.id(null, 'sbx-item');
            var box = new Ext.ux.form.SuperBoxSelectItem({
                owner : this,
                disabled : this.disabled,
                renderTo : this.wrapEl,
                cls : this.extraItemCls + ' ' + itemClass,
                style : parseStyle(this.extraItemStyle) + ' '
                        + itemStyle,
                caption : itemCaption,
                display : itemDisplay,
                value : itemVal,
                key : itemKey,
                listeners : {
                    'remove' : function(item) {
                        if (this.fireEvent('beforeremoveitem', this, item.value) === false) {
                            return;
                        }
                        this.items.removeKey(item.key);
                        if (this.removeValuesFromStore) {
                            if (this.usedRecords.containsKey(item.value)) {
                                this.store.add(this.usedRecords.get(item.value));
                                this.usedRecords.removeKey(item.value);
                                this.sortStore();
                                if (this.view) {
                                    this.view.render();
                                }
                            }
                        }
                        if (!this.preventMultipleRemoveEvents) {
                            this.fireEvent.defer(
                                    250,
                                    this,
                                    [
                                        'removeitem',
                                        this,
                                        item.value,
                                        this.findInStore(item.value)
                                    ]
                                );
                        }
                        this.preventMultipleRemoveEvents = false;
                    },
                    destroy : function() {
                        if ( !this.expandOnClick ){
                            this.collapse();
                        }
                        this.autoSize().manageClearBtn().validateValue();
                    },
                    scope : this
                }
            });
            box.render();

            box.hidden = this.el.insertSibling({
                tag : 'input',
                type : 'hidden',
                value : itemVal,
                name : (this.hiddenName || this.name)
            }, 'before');

            this.items.add(itemKey, box);
            this.applyEmptyText().autoSize().manageClearBtn().validateValue();
        },
        manageClearBtn : function() {
            if (!this.renderFieldBtns || !this.rendered) {
                return this;
            }
            if ( !this.keepClearBtn ){
                var cls = 'x-superboxselect-btn-hide';
                if (this.items.getCount() === 0) {
                    this.buttonClear.addClass(cls);
                } else {
                    this.buttonClear.removeClass(cls);
                }
            }
            return this;
        },
        findInStore : function(val) {
            var index = this.store.find(this.valueField, val);
            if (index > -1) {
                return this.store.getAt(index);
            }
            return false;
        },
        /**
         * Returns a String value containing a concatenated list of item
         * values. The list is concatenated with the
         * {@link #Ext.ux.form.SuperBoxSelect-valueDelimiter}.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name getValue
         * @return {String} a String value containing a concatenated list of
         *         item values.
         */
        getValue : function() {
            var ret = [];
            this.items.each(function(item) {
                ret.push(item.value);
            });
            return ret.join(this.valueDelimiter);
        },
        /**
         * Iterates and selects all elements available Must take into
         * consideration the ones that are already selected plus the ones
         * from the store.
         */
        selectAll : function() {
            var ret = this.getValuesAsArray();
            var valueField = this.valueField;
            Ext.iterate(this.store.data.items, function(item) {
                ret.push(item.get(valueField));
            });
            if (!Ext.isEmpty(ret)) {
                this.setValue(ret.join(this.valueDelimiter));
            }
        },
        selectItems : function(array) {
            var ret = [];
            Ext.iterate(array, function(item) {
                ret.push(item)
            });
            if (!Ext.isEmpty(ret)) {
                this.setValue(ret.join(this.valueDelimiter));
            }
        },
        /**
         * Returns an Array containing the elements of the
         * {@link #Ext.ux.form.SuperBoxSelect-valueField}
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name getValueAsArray
         * @return {Array} an array of item objects.
         */
        getValuesAsArray : function() {
            var ret = [];
            this.items.each(function(item) {
                ret.push(item.value);
            });
            return ret;
        },
        /**
         * Returns an Array of item objects containing the
         * {@link #Ext.ux.form.SuperBoxSelect-displayField},
         * {@link #Ext.ux.form.SuperBoxSelect-valueField} and
         * {@link #Ext.ux.form.SuperBoxSelect-classField} properties.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name getValueEx
         * @return {Array} an array of item objects.
         */
        getValueEx : function() {
            var ret = [];
            this.items.each(function(item) {
                var newItem = {};
                newItem[this.valueField] = item.value;
                newItem[this.displayField] = item.display;
                newItem[this.classField] = item.cls;
                ret.push(newItem);
            }, this);
            return ret;
        },
        // private
        initValue : function() {
            Ext.ux.form.SuperBoxSelect.superclass.initValue.call(this);
            if (this.mode === 'remote') {
                this.setOriginal = true;
            }
        },
        /**
         * Sets the value of the SuperBoxSelect component.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name setValue
         * @param {String|Array}
         *            value An array of item values, or a String value
         *            containing a delimited list of item values. (The list
         *            should be delimited with the {@link #Ext.ux.form.SuperBoxSelect-valueDelimiter})
         */
        setValue : function(value) {
            if ( value ) {
                value = '' + value;
                if (!this.rendered) {
                    this.preRenderValue = value;
                    return;
                }

                var values = Ext.isArray(value) ? value : value.split(this.valueDelimiter);
                this.removeAllItems().resetStore();

                // reset remoteLookup because setValue should overwrite
                // everything
                // inc pending data
                this.remoteLookup = [];

                Ext.each(values, function(val) {
                    var record = this.findRecord(this.valueField, val);
                    if (record) {
                        this.addRecord(record);
                    } else if (this.mode === 'remote') {
                        this.remoteLookup.push(val);
                    }
                }, this);

                if ( this.mode === 'remote' ) {
                    var q = this.remoteLookup.join( this.queryValuesDelimiter );
                    this.doQuery( q, false, true ); // 3rd param to specify a values query
                }
            } else {
                this.clearValue();
            }
        },
        /**
         * Sets the value of the SuperBoxSelect component, adding new items
         * that don't exist in the data store if the
         * {@link #Ext.ux.form.SuperBoxSelect-allowAddNewData} config is set
         * to true.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name setValue
         * @param {Array}
         *            data An Array of item objects containing the
         *            {@link #Ext.ux.form.SuperBoxSelect-displayField},
         *            {@link #Ext.ux.form.SuperBoxSelect-valueField} and
         *            {@link #Ext.ux.form.SuperBoxSelect-classField}
         *            properties.
         */
        setValueEx : function(data) {
            this.removeAllItems().resetStore();

            if (!Ext.isArray(data)) {
                data = [data];
            }
            Ext.each(data, function(item) {
                this.addItem(item);
            }, this);
        },
        /**
         * Returns true if the SuperBoxSelect component has a selected item
         * with a value matching the 'val' parameter.
         *
         * @methodOf Ext.ux.form.SuperBoxSelect
         * @name hasValue
         * @param {Mixed}
         *            val The value to test.
         * @return {Boolean} true if the component has the selected value,
         *         false otherwise.
         */
        hasValue : function(val) {
            var has = false;
            this.items.each(function(item) {
                if (item.value == val) {
                    has = true;
                    return false;
                }
            }, this);
            return has;
        },
        onSelect : function(record, index) {
            var val = record.data[this.valueField];

            if (this.preventDuplicates && this.hasValue(val)) {
                return;
            }

            this.setRawValue('');
            this.lastSelectionText = '';

            if ( this.fireEvent('beforeadditem', this, val) !== false ) {
                this.addRecord( record );
            }
            if ( ! this.pinList && ( this.store.getCount() === 0 || ! this.multiSelectMode ) ) {
                this.collapse();
            } else {
                this.restrictHeight();
            }
        },
        onDestroy : function() {
            this.items.each(function(item) {
                item.preDestroy(true);
            }, this);

            if (this.renderFieldBtns) {
                Ext.destroy(this.buttonClear, this.buttonExpand, this.buttonWrap);
            }

            Ext.destroy(this.inputEl, this.wrapEl, this.outerWrapEl);

            Ext.ux.form.SuperBoxSelect.superclass.onDestroy.call(this);
        },
        autoSize : function() {
            if (!this.rendered) {
                return this;
            }
            if (!this.metrics) {
                this.metrics = Ext.util.TextMetrics.createInstance(this.el);
            }
            var el = this.el, v = el.dom.value, d = document.createElement('div');

            if (v === '' && this.emptyText && this.items.getCount() < 1) {
                v = this.emptyText;
            }
            d.appendChild(document.createTextNode(v));
            v = d.innerHTML;
            d = null;
            v += '&#160;';
            var w = Math.max(this.metrics.getWidth(v) + 24, 24);
            if (typeof this.width != 'undefined') {
                w = Math.min(this._width, w);
            }
            this.el.setWidth(w);

            if (Ext.isIE) {
                this.el.dom.style.top = '0';
            }
            return this;
        },
        doQuery : function(q, forceAll, valuesQuery) {
            q = Ext.isEmpty(q) ? '' : q;
            var qe = {
                query: q,
                forceAll: forceAll,
                combo: this,
                cancel: false
            };
            if(this.fireEvent('beforequery', qe)===false || qe.cancel){
                return false;
            }
            q = qe.query;
            forceAll = qe.forceAll;
            if(forceAll === true || (q.length >= this.minChars)){
                if(this.lastQuery !== q){
                    this.lastQuery = q;
                    if(this.mode == 'local'){
                        this.selectedIndex = -1;
                        if(forceAll){
                            this.store.clearFilter();
                        }else{
                            this.store.filter(this.displayField, q, this.anyMatch, this.caseSensitive);
                        }
                        this.onLoad();
                    }else{
                        this.store.baseParams[this.queryParam] = q;
                        this.store.baseParams[this.queryValuesIndicator] = valuesQuery;
                        this.store.load({
                            params: this.getParams(q)
                        });
                        this.expand();
                    }
                }else{
                    this.selectedIndex = -1;
                    this.onLoad();
                }
            }
        },
        onTypeAhead: function() {
            var nodes = this.view.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var d = this.view.getRecord(n).data;
                var re = new RegExp('(.*?)(' + '' + Ext.escapeRe(this.getRawValue()) + ')(.*)', this.caseSensitive ? '' : 'i');
                var h = d[this.displayField];

                h=h.replace(re, '$1<span class=\'' + this.markComboMatchCls + '\'>$2</span>$3');
                n.innerHTML=h;
            }
        }
    }
);
Ext.reg('superboxselect', Ext.ux.form.SuperBoxSelect);
/*
 * @private
 */
Ext.ux.form.SuperBoxSelectItem = function(config) {
    Ext.apply(this, config);
    Ext.ux.form.SuperBoxSelectItem.superclass.constructor.call(this);
};
/*
 * @private
 */
Ext.ux.form.SuperBoxSelectItem = Ext.extend(Ext.ux.form.SuperBoxSelectItem,
    Ext.Component, {
        initComponent : function() {
            Ext.ux.form.SuperBoxSelectItem.superclass.initComponent.call(this);
        },
        onElClick : function(e) {
            var o = this.owner;
            o.clearCurrentFocus().collapse();
            if (o.navigateItemsWithTab) {
                this.focus();
            } else {
                o.el.dom.focus();
                var that = this;
                (function() {
                    this.onLnkFocus();
                    o.currentFocus = this;
                }).defer(10, this);
            }
        },

        onLnkClick : function(e) {
            if (e) {
                e.stopEvent();
            }
            this.preDestroy();
            if (!this.owner.navigateItemsWithTab) {
                this.owner.el.focus();
            }
        },
        onLnkFocus : function() {
            this.el.addClass( this.owner.itemFocusCls );
            this.el.addClass( 'x-superboxselect-item-focus' );
            this.owner.outerWrapEl.addClass('x-form-focus');
        },

        onLnkBlur : function() {
            this.el.removeClass( this.owner.itemFocusCls );
            this.el.removeClass( 'x-superboxselect-item-focus' );
            this.owner.outerWrapEl.removeClass('x-form-focus');
        },

        enableElListeners : function() {
            this.el.on('click', this.onElClick, this, {
                stopEvent : true
            });

            this.el.addClassOnOver( this.owner.itemHoverCls );
        },

        enableLnkListeners : function() {
            this.lnk.on({
                click : this.onLnkClick,
                focus : this.onLnkFocus,
                blur : this.onLnkBlur,
                scope : this
            });
        },

        enableAllListeners : function() {
            this.enableElListeners();
            this.enableLnkListeners();
        },
        disableAllListeners : function() {
            this.el.removeAllListeners();
            this.lnk.un('click', this.onLnkClick, this);
            this.lnk.un('focus', this.onLnkFocus, this);
            this.lnk.un('blur', this.onLnkBlur, this);
        },
        onRender : function(ct, position) {
            Ext.ux.form.SuperBoxSelectItem.superclass.onRender.call(this, ct, position);

            var el = this.el;
            if (el) {
                el.remove();
            }

            this.el = el = ct.createChild({
                tag : 'li'
            }, ct.last());
            el.addClass('x-superboxselect-item');

            var btnEl = this.owner.navigateItemsWithTab ? (Ext.isSafari
                    ? 'button'
                    : 'a') : 'span';
            var itemKey = this.key;

            Ext.apply(el, {
                focus : function() {
                    var c = this.down(btnEl
                            + '.x-superboxselect-item-close');
                    if (c) {
                        c.focus();
                    }
                },
                preDestroy : function() {
                    this.preDestroy();
                }.createDelegate(this)
            });

            this.enableElListeners();

            el.update(this.caption);

            var cfg = {
                tag : btnEl,
                'class' : 'x-superboxselect-item-close',
                tabIndex : this.owner.navigateItemsWithTab ? '0' : '-1'
            };
            if (btnEl === 'a') {
                cfg.href = '#';
            }
            this.lnk = el.createChild(cfg);

            if (!this.disabled) {
                this.enableLnkListeners();
            } else {
                this.disableAllListeners();
            }

            this.on({
                disable : this.disableAllListeners,
                enable : this.enableAllListeners,
                scope : this
            });

            this.setupKeyMap();
        },
        setupKeyMap : function() {
            new Ext.KeyMap(this.lnk, [{
                key : [Ext.EventObject.BACKSPACE,
                    Ext.EventObject.DELETE,
                    Ext.EventObject.SPACE],
                fn : this.preDestroy,
                scope : this
            }, {
                key : [Ext.EventObject.RIGHT, Ext.EventObject.DOWN],
                fn : function() {
                    this.moveFocus('right');
                },
                scope : this
            }, {
                key : [Ext.EventObject.LEFT, Ext.EventObject.UP],
                fn : function() {
                    this.moveFocus('left');
                },
                scope : this
            }, {
                key : [Ext.EventObject.HOME],
                fn : function() {
                    var l = this.owner.items.get(0).el.focus();
                    if (l) {
                        l.el.focus();
                    }
                },
                scope : this
            }, {
                key : [Ext.EventObject.END],
                fn : function() {
                    this.owner.el.focus();
                },
                scope : this
            }, {
                key : Ext.EventObject.ENTER,
                fn : function() {
                }
            }]).stopEvent = true;
        },
        moveFocus : function(dir) {
            var el = this.el[dir == 'left' ? 'prev' : 'next']()
                    || this.owner.el;

            el.focus.defer(100, el);
        },
        preDestroy : function(supressEffect) {
            if (this.fireEvent('remove', this) === false) {
                return;
            }
            var actionDestroy = function() {
                if (this.owner.navigateItemsWithTab) {
                    this.moveFocus('right');
                }
                this.hidden.remove();
                this.hidden = null;
                this.destroy();
            };

            if (supressEffect) {
                actionDestroy.call(this);
            } else {
                this.el.hide({
                    duration : 0.2,
                    callback : actionDestroy,
                    scope : this
                });
            }
            return this;
        },
        onDestroy : function() {
            Ext.destroy(this.lnk, this.el);

            this.owner.store.sort( this.valueField, 'ASC' );

            Ext.ux.form.SuperBoxSelectItem.superclass.onDestroy.call(this);
        }
    }
);

