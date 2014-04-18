import glob = require('./Global');

export class BarManager {

    paint : glob.Paint;
    private $ : JQueryStatic;
    
    private static htmlIdCount = 0;
    
    constructor(paint : glob.Paint) {
        this.paint = paint;
        this.$ = paint.$;   
    }
    
    /**
     * Creates new tab
     */
    private createTab(id : string, name : string) {
        var $ = this.$;
        
        var listEl = $('<li role="tab" class="inline" />'); 
        
        listEl.attr('id', id);
        listEl.append('<span class="uppercase">' + name + '</span>');
        
        var innerDiv = $('<div />');
        innerDiv.addClass('contents absolute');
        listEl.append(innerDiv);
        return listEl;
    }
    
    addTab(id : string, name : string) {
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
        
        var sep = $('<div>​​</div>​');
        sep.addClass('seperator relative inline');
        
        return sep;
    }
    
    private createGroup(id : string, name : string) {
        var $ = this.$;
        
        var newGroup = $('<div id=' + id + '></div>');
        newGroup.addClass(​"group relative inline");
            
        var innerDiv = $('<div />​');
        innerDiv.text(name);
        innerDiv.addClass('legend absolute');
        newGroup.append(innerDiv);
        
        return newGroup;
    }​

    addGroup(tabId : string, groupName : string) {
        var $ = this.$;
        var content = $('#' + tabId + ' > div');
        
        if (content.length === 1) {
            var newGroup = this.createGroup(BarManager.getUniqueHtmlId(), groupName);
            
            // If has already some groups of icons, then add a separator
            if (content.children().length > 0)
                content.append(this.getSeparator());
            
            content.append(newGroup);
        }
        
        return newGroup.attr('id');
    }
    
    // Da decidere come passare gli elementi
    addElement(groupId : string) {
        var group = $('#' + groupId)
        
        //group.append();
    }

    /**
     * Return a unique ID string to apply to dynamically generated HTML elements.
     */
    public static getUniqueHtmlId() : string {
        var count = this.htmlIdCount++;
        return 'uniq-dynamic-ext-id-' + count;
    }
    
    addToolbarItem(icon, groupId : string, text: string, tool) : string {
        var $ = this.paint.$;
        
        var group = $('#' + groupId);
        
        if (group.length === 0)
            return;
        
        var escapedStr = $('<div />').text(text).html();
        var id = BarManager.getUniqueHtmlId();
        
        //$("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
        $(group).append('<div class="smallicon" id="' + id + '">\
                              <img draggable="false" src="libs/ribbon/Icons/IgnoreConversation.png" style="width: 16px; height:16px" />\
                              <div class="iconlegend"></div>\
                            </div>');
        
        $("#" + id).css('display', 'inline-block');
        $("#" + id).attr('title', escapedStr);
        
        $("#" + id).click($.proxy(function() {
            this.paint.setCurrentTool(tool, id);
        }, this));
        
        return id;
    }
    
    /**
     * Adds an icon inside the toolbar, in the tools category.
     * \returns The id of the new HTML element.
     */
    addToolbarToolItem(icon, text:string, tool) : string {
        var $ = this.paint.$;
        
        var escapedStr = $('<div />').text(text).html();
        var id = BarManager.getUniqueHtmlId();
        
        //$("#tools").append('<button id="' + id + '">' + escapedStr + '</button>');
        $("#tools").append('<div class="smallicon" id="' + id + '">\
                              <img draggable="false" style="width: 16px; height:16px" />\
                              <div class="iconlegend"></div>\
                            </div>');
        
        $("#" + id + " > img").attr("src", icon);
        $("#" + id).css('display', 'inline-block');
        $("#" + id).attr('title', escapedStr);
        
        // Set group width to avoid overflow
        var iconWidth = 24;
        var epsilon = 3;
        var n = $("#tools").children(".smallicon").length;
        $("#tools").css('width', (iconWidth + epsilon) * Math.ceil(n / 3));
        
        $("#" + id).click($.proxy(function() {
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
    addCustomIndicatorItem(item:HTMLElement, priority:number, autoWidth:boolean) : void {
        var $ = this.paint.$;
        
        var indicator = $('<div class="bottomIndicator" />').append($("<span />").append(item));
        if(autoWidth) {
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