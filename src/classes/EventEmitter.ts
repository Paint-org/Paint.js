import glob = require('./Global');
import point = require('./Point');

export class EventEmitter {
    
    public static paint : glob.Paint;
    
    /**
     * Get the list of extensions on which trigger some events
     */
    static getExtensionList(list) {
        
        var l = new Array();
        
        /** null, then all extensions must be included */
        if (!list) { 
            var extList = this.paint.Extensions;
            for (var ext in extList) {
                if (extList.hasOwnProperty(ext))
                    l.push(extList[ext]);
            }
        /** Array of extensions */
        } else if (list.contructor === Array)
          
            l = list;
        /** Single extension */
        else 
            l = [list];
        
        return l;
    }
    
    static triggerOnStartDrawing(pt : point.Point, dest) {
        
        var list = this.getExtensionList(dest),
            paint = this.paint;
        
        this.triggerForEach(list, function(ext) {
            if (ext.onStartDrawing) {
                ext.drawing = true;
                ext.onStartDrawing(paint.currentPaper, pt); 
            }
        });
    }
    
    static triggerOnDraw(pt : point.Point, dest) {
     
        var list = this.getExtensionList(dest),
            paint = this.paint;
        
        this.triggerForEach(list, function(ext) {
            if (ext.drawing && ext.onDraw)
                ext.onDraw(paint.currentPaper, pt);    
        });
    }

    static triggerOnStopDrawing(pt : point.Point, dest) {
     
        var list = this.getExtensionList(dest),
            paint = this.paint;
        
        this.triggerForEach(list, function(ext) {
            if (ext.drawing) {
                ext.drawing = false;
                if (ext.onStopDrawing)
                    ext.onStopDrawing(paint.currentPaper, pt);
            }
        });
    }
    
    /**
     * get triggere when click on Paper
     */
    static triggerOnPaperClick(pt : point.Point, dest) {
        
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onPaperClick)
                ext.onPaperClick(pt);
        });
    }
    
    static triggerOnPaperMouseEnter(pt : point.Point, dest) {

        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onPaperMouseEnter)
                ext.onPaperMouseEnter(pt);     
        });
    }
    
    static triggerOnPaperMouseLeave(pt : point.Point, dest) {

        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onPaperMouseLeave)
                ext.onPaperMouseLeave(pt);     
        });
    }
    

    static triggerOnPaperMouseMove(pt : point.Point, dest) {
        
        var list = this.getExtensionList(dest);   
    
        this.triggerForEach(list, function(ext) {
            if (ext.onPaperMouseMove)
                ext.onPaperMouseMove(pt);    
        });
    }
    
    static triggerOnZoom(dest) {
        
       var list = this.getExtensionList(dest);
       
       this.triggerForEach(list, function (ext) {
            if (ext.onZoom) 
                ext.onZoom();
        });
    }
    
    static triggerOnResizeStart(dest) {
        
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onResizeStart)
                ext.onResizeStart();    
        });
    }
    
    static triggerOnResizeEnd(dest) {
        
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onResizeEnd)
                ext.onResizeEnd();
        });
    }
    
    static triggerOnResize(dest) {
        
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onResize)
                ext.onResize();    
        });
    }    
    
    static triggerOnToolSizeChanged(dest) {
        
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onToolSizeChanged)
                ext.onToolSizeChanged();
        });
    }
    
    static triggerOnPrimaryColorChanged(dest) {
     
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onPrimaryColorChanged)
                ext.onPrimaryColorChanged();
        });
    }
    
    static triggerOnSecondaryColorChanged(dest) {
     
        var list = this.getExtensionList(dest);
        
        this.triggerForEach(list, function(ext) {
            if (ext.onSecondaryColorChanged)
                ext.onSecondaryColorChanged();
        });
    }

    static triggerForEach(list, callback) {
        list.forEach(callback);
    }
}