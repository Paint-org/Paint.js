
module Paint {
    export class BarManager {

        paint: Paint.Global;
        private $: JQueryStatic;

        private static htmlIdCount = 0;

        constructor(paint: Paint.Global) {
            this.paint = paint;
            this.$ = paint.$;
        }

        /**
         * Creates new tab
         */
        private createTab(id: string, name: string) {
            var $ = this.$;

            var listEl = $('<li role="tab" class="inline" />');

            listEl.attr('id', id);
            listEl.append('<span class="uppercase">' + name + '</span>');

            var innerDiv = $('<div />');
            innerDiv.addClass('contents absolute');
            listEl.append(innerDiv);
            return listEl;
        }

        addTab(id: string, name: string) {
            var $ = this.$,
                newTab = this.createTab(id, name);

            $('#tabList').append(newTab);

            return newTab;
        }

        getTabs() {
            return $('#tabList');
        }

        private getSeparator() {
            var $ = this.$;

            var sep = $('<div></div>');
            sep.addClass('seperator relative inline');

            return sep;
        }

        /**
         * Aggiunge un nuovo gruppo alla barra principale
         * \param tabId id della tab alla quale aggiungere il gruppo
         * \param groupName nome del nuovo gruppo
         */
        addGroup(tabId: string, groupName: string) {
            var $ = this.$;
            var tabContent = $('#' + tabId + ' > div');

            if (tabContent.length === 1) {
                var newGroup = new Paint.BarGroup(this.paint, BarManager.getUniqueHtmlId(), groupName);

                // If has already some groups of icons, then add a separator
                if (tabContent.children().length > 0)
                    tabContent.append(this.getSeparator());

                tabContent.append(newGroup.node);
            }

            return newGroup;
        }

        // Da decidere come passare gli elementi
        addElement(groupId: string) {
            var group = $('#' + groupId);

            //group.append();
        }

        /**
         * Return a unique ID string to apply to dynamically generated HTML elements.
         */
        public static getUniqueHtmlId(): string {
            var count = this.htmlIdCount++;
            return 'uniq-dynamic-ext-id-' + count;
        }

        /**
         * Adds an icon inside the toolbar, in the tools category.
         * \returns The id of the new HTML element.
         */
        addToolbarToolItem(icon, text: string, tool): string {
            var $ = this.paint.$;

            var escapedStr = $('<div />').text(text).html();
            var id = BarManager.getUniqueHtmlId();

            $("#tools").append('<div class="smallicon" id="' + id + '">\
                              <img draggable="false" style="width: 16px; height:16px" />\
                              <div class="iconlegend"></div>\
                            </div>');

            $("#" + id + " > img").attr("src", icon);
            $("#" + id).css('display', 'inline-block');
            $("#" + id).attr('title', escapedStr);

            // Set group width to avoid overflow
            // FIXME Use CSS3 column-width, column-gap. Needs WebKit support. http://www.w3.org/TR/css3-multicol/
            var iconWidth = 24;
            var epsilon = 3;
            var iconsPerColumn = 2;
            var n = $("#tools").children(".smallicon").length;
            $("#tools").css('width', (iconWidth + epsilon) * Math.ceil(n / iconsPerColumn));

            $("#" + id).click($.proxy(function () {
                this.paint.setCurrentTool(tool, id);
            }, this));

            return id;
        }

        /**
         * Adds a custom indicator to the status bar.
         * \param item HTMLElement to add to the status bar
         * \param priority specifies the relative position in the statusbar. Currently not implemented. FIXME.
         * \param autoWidth specifies if the indicator space width will be auto sized to the content.
         */
        addCustomIndicatorItem(item: HTMLElement, priority: number, autoWidth: boolean): void {
            var $ = this.paint.$;

            var indicator = $('<div class="bottomIndicator" />').append($("<span />").append(item));
            if (autoWidth) {
                indicator.css("width", "auto");
            }
            $("#bottomBar").append(indicator);
        }

        /**
         * Adds a text indicator to the status bar.
         * \param icon The icon of this indicator. Currently not implemented. FIXME.
         * \param priority specifies the relative position in the statusbar. Currently not implemented. FIXME.
         * \param autoWidth specifies if the indicator space width will be auto sized to the content.
         * \returns the element that contains the text
         */
        addTextIndicatorItem(icon: string, priority: number, autoWidth: boolean): HTMLElement {
            var $ = this.paint.$;

            var div = $("<span />");
            if (icon !== null) {
                // FIXME Spostare stili nel CSS
                var img = $('<img style="vertical-align:middle; width:16px; height: 16px; margin-right: 5px;" />');
                img.attr("draggable", "false");
                img.attr("src", icon);
                div.append(img);
            }
            var textSpan = $('<span />')[0];
            div.append(textSpan);
            this.addCustomIndicatorItem(div[0], priority, autoWidth);

            return textSpan;
        }
    }

    export class BarGroup {

        id: string;
        private _node: JQuery;
        paint: Paint.Global;

        get node() {
            return this._node;
        }

        constructor(paint: Paint.Global, id: string, groupName: string) {
            this.id = id;
            this.paint = paint;

            var $ = paint.$;

            var newGroup = $('<div id=' + id + '></div>');
            newGroup.addClass("group relative inline");

            var innerDiv = $('<div />');
            innerDiv.text(groupName);
            innerDiv.addClass('legend absolute');
            newGroup.append(innerDiv);

            this._node = newGroup;
        }

        addCustom(text) {
            this.node.append(text);
        }

        addTool(icon, text: string, tool): string {
            var $ = this.paint.$;

            if (this.node.length === 0)
                return;

            var escapedStr = $('<div />').text(text).html(),
                id = BarManager.getUniqueHtmlId();

            //$("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
            this.node.append('<div class="smallicon" id="' + id + '">\
                              <img draggable="false" style="width: 16px; height:16px" />\
                              <div class="iconlegend"></div>\
                            </div>');

            $("#" + id + " > img").attr("src", icon);
            $("#" + id).css('display', 'inline-block');
            $("#" + id).attr('title', escapedStr);

            $("#" + id).click($.proxy(function () {
                this.paint.setCurrentTool(tool, id);
            }, this));

            return id;
        }
    }
}