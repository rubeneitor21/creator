
/*
 *  Copyright 2018-2023 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos
 *
 *  This file is part of CREATOR.
 *
 *  CREATOR is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CREATOR is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


  /* jshint esversion: 6 */

  var uielto_save_assembly = {

        props:      {
                      id:                  { type: String, required: true }
                    },

        data:       function () {
                      return {
                        //Saved file name
                        save_assembly: '',
                      }
                    },

        methods:    {
                      //Save assembly code in a local file
                      assembly_save(){
                        var textToWrite = textarea_assembly_editor.getValue();
                        var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
                        var fileNameToSaveAs;

                        if(this.save_assembly == ''){
                          fileNameToSaveAs = "assembly.s";
                        }
                        else{
                          fileNameToSaveAs = this.save_assembly + ".s";
                        }

                        var downloadLink = document.createElement("a");
                        downloadLink.download = fileNameToSaveAs;
                        downloadLink.innerHTML = "My Hidden Link";

                        window.URL = window.URL || window.webkitURL;

                        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                        downloadLink.onclick = destroyClickedElement;
                        downloadLink.style.display = "none";
                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                        this.save_assembly = '';

                        //Google Analytics
                        creator_ga('assembly', 'assembly.save', 'assembly.save');
                      },

                      //Stop user interface refresh
                      debounce: _.debounce(function (param, e) {
                        console_log(param);
                        console_log(e);

                        e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        var re = new RegExp("'","g");
                        e = e.replace(re, '"');
                        re = new RegExp("[\f]","g");
                        e = e.replace(re, '\\f');
                        re = new RegExp("[\n\]","g");
                        e = e.replace(re, '\\n');
                        re = new RegExp("[\r]","g");
                        e = e.replace(re, '\\r');
                        re = new RegExp("[\t]","g");
                        e = e.replace(re, '\\t');
                        re = new RegExp("[\v]","g");
                        e = e.replace(re, '\\v');

                        if(e == ""){
                          this[param] = null;
                          return;
                        }

                        console_log("this." + param + "= '" + e + "'");

                        eval("this." + param + "= '" + e + "'");

                        //this[param] = e.toString();
                        app.$forceUpdate();
                      }, getDebounceTime())
                    },

        template:   ' <b-modal  :id = "id"' +
                    '           title = "Save Assembly" ' +
                    '           ok-title="Save to File" ' +
                    '           @ok="assembly_save">' +
                    ' ' +
                    '   <p> Please write the file name: </p> ' +
                    '   <b-form-input v-on:input="debounce(\'save_assembly\', $event)" ' +
                    '                 :value="save_assembly"' +
                    '                 type="text"' +
                    '                 placeholder="File name where assembly will be saved" ' +
                    '                 title="File name">' +
                    '   </b-form-input>' +
                    ' </b-modal>'
  }

  Vue.component('save-assembly', uielto_save_assembly) ;

  /*Determines the refresh timeout depending on the device being used*/
  function getDebounceTime(){
    if(screen.width > 768){
      return 500;
    }
    else{
      return 1000;
    }
  }