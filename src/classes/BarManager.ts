import glob = require('./Global');

export class BarManager {

    paint : glob.Paint;
    private $ : JQueryStatic;
    
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
        
        var sep = $('<div>​&nbsp;​</div>​');
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

    addGroup(tabId : string, groupId : string, groupName : string) {
        var $ = this.$;
        var content = $('#' + tabId + ' > div');
        
        if (content.length === 1) {
            var newGroup = this.createGroup(groupId, groupName);
            
            // If has already some groups of icons, then add a separator
            if (content.children().length > 0)
                content.append(this.getSeparator());
            
            content.append(newGroup);
        }
        
        return newGroup;
    }
    
    // Da decidere come passare gli elementi
    addElement(groupId : string) {
        var group = $('#' + groupId)
        
        //group.append();
    }
}