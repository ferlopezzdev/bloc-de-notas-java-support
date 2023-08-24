/**
    Author: Fernando López
    Documentación: Libreria ace Editor - https://ace.c9.io/#nav=howto
 */


document.addEventListener('DOMContentLoaded', function () {
    let editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/java");

    ace.define("ace/theme/custom", ["require", "exports", "module", "ace/lib/dom"], function(require, exports, module) {
        exports.isDark = false;
        exports.cssClass = "ace-custom";
        exports.cssText = `
            .ace-custom .ace_gutter {
                display: none; /* Ocultar números de línea */
            }
            .ace-custom {
                background-color: #ffffff;
                color: #000000;
            }
            .ace_custom-selected {
                background-color: #0078D4;
                color: white;
            }
        `;
        
        let dom = require("../lib/dom");
        dom.importCssString(exports.cssText, exports.cssClass);
    });
    editor.setTheme("ace/theme/custom");

    // Configuración de autocompletado
    ace.config.loadModule('ace/ext/language_tools', function() {
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        let langTools = ace.require("ace/ext/language_tools");
        langTools.addCompleter({
            getCompletions: function( callback ) {

                // Obbtener autocompletado desde Java-Completer

                let completions = [
                    { value: "System.out.println", caption: "System.out.println", meta: "Java" },
                    { value: "Math.abs", caption: "Math.abs", meta: "Java" }
                ];
                callback(null, completions);
            }
        });
    });

    let isAutocompleteEnabled = true;

    // Función para alternar el autocompletado 
    function toggleAutocomplete() {
        isAutocompleteEnabled = !isAutocompleteEnabled;
        editor.setOptions({
            enableBasicAutocompletion: isAutocompleteEnabled,
            enableSnippets: isAutocompleteEnabled,
            enableLiveAutocompletion: isAutocompleteEnabled
        });
    }

    // Alternar el autocompletado
    editor.commands.addCommand({
        name: "toggleAutocomplete",
        bindKey: { win: "F4", mac: "F4" },
        exec: function(editor) {
            toggleAutocomplete();
        },
        readOnly: true
    });

    // Resaltar texto seleccionado en el editor
    editor.on("selectionChange", function() {
        let selectionRange = editor.getSelectionRange();
        let selectedText = editor.session.getTextRange(selectionRange);
        editor.session.removeMarker(editor.selectionMarker);
        editor.selectionMarker = editor.session.addMarker(selectionRange, "ace_custom-selected", "text");
    });

    editor.setOptions({
        hScrollBarAlwaysVisible: true, 
        vScrollBarAlwaysVisible: true  
    });

    // Función para guardar el contenido en un archivo
    function saveToFile(content, filename) {
        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);
    }

    // Asociar la acción de guardar al botón o evento que prefieras
    document.querySelector("#saveButton").addEventListener("click", function () {
        const input = document.querySelector('#file-name');
        const inputValor = input.value;
        let content = editor.getValue(); 
        let filename = `${inputValor}.java`; 
        saveToFile(content, filename);
    });

    // Ver o no ver titulo del archivo
    const docVer = document.querySelector('#ver');

    docVer.addEventListener('click', () => {
        const input = document.querySelector('#file-name');

        input.classList.toggle('hidden');
    });
});
