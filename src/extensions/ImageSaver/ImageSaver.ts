/// <reference path="../../libs/node/node.d.ts" />

import glob = require('../../classes/Global');
import extension = require('../../classes/Extension');

var gui = global.window.nwDispatcher.requireNwGui();

export class ImageSaver extends extension.Extension
{
    static EXTENSION_NAME : string = "com.paintjs.ImageSaver";
    paint : glob.Paint;
    
    private saveFileDialog : HTMLInputElement;
    
    public constructor(paint:glob.Paint) {
        super(paint);
    }
    
    init() {
        super.init();
        var paint = this.paint,
            $ = this.paint.$,
            _this = this;
        
        // Creates input file dialog
        this.saveFileDialog = <HTMLInputElement> $('<input id="saveAs" type="file" nwsaveas accept=".png" />')[0]; 
        
        // Create save submenu
        var mnuSave = new gui.MenuItem({ label: 'Save' })
        
        // add handler for click
        mnuSave.click = function() {
            _this.chooseFile(_this.saveFileDialog, function(filename) {
                if(filename != "") {
                    var image = paint.currentPaper.getCanvas().toDataURL();
                    image = image.replace(/^data:image\/png;base64,/,"");
                    
                    paint.save(filename, image, "base64", function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });   
                } 
            });                   
        }
        
        // Add Save submenu to File menu
        var menus = gui.Window.get().menu.items;

        // Search for File menu
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].label === 'File')
                menus[i].submenu.append(mnuSave);            
        }

    }    
    
    private chooseFile(dialog:HTMLInputElement, callback) {
        var paint = this.paint,
            $ = this.paint.$;
        
        // Reset the FileDialog so that we can receive *change* events
        // even when the file stays the same.
        var fl = new paint.FileList();
        fl.append(new paint.File('', ''));
        fl.append(new paint.File('', 'no_file_selected_...\|/*?'));
        dialog.files = fl;
        
        
        var chooser = $(dialog);
        
        var change = function(evt) {
            $(this).off("change", change);
            callback($(this).val());
        }
        
        chooser.on("change", change);
        chooser.trigger('click');
    }    
}