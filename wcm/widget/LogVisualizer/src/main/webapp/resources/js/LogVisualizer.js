var HelloWorld = SuperWidget.extend({
    message: null,
    logTable: null,
    initialData: [],
    
    //Endereco do servidor de logs
    lblPerDe: $('#lblPerDe'),

    init: function () {
    	
        FLUIGC.calendar('#InPeriodoDe',{
        	pickDate: true,
        	pickTime: true,
        	useMinutes: true,
        	useSeconds: true
        });
        FLUIGC.calendar('#InPeriodoAte',{
        	pickDate: true,
        	pickTime: true,
        	useMinutes: true,
        	useSeconds: true
        });
        //$('#PnlLOGViewer').hide();
        
        //$('#PnlLOGViewer').hide();
        
        this.runSWAP();
        
        this.loadTable();
        
        
    },
    
    loadTable: function(){
    	this.initialData = [{
    		time : '11:10:43',
    		msg: 'load completo'
    	}];
    	
    	//LogTable
        this.logTable = FLUIGC.datatable('#logTable', {
        	dataRequest: this.initialData,
            renderContent: ['time', 'msg'],
            header: [
                {
                    'title': 'UTC_TIME',
                    'dataorder': 'UTC_TIME',
                    'size': 'col-md-3',
                    //'display': false
                },
                {
                    'title': 'MSG',
                    'dataorder': 'MSG',
                    //'standard': true,
                    'size': 'col-md-9',
                },
            ],
            //multiSelect: true,
            //classSelected: 'danger',
            scroll: {
                target: '#target',
                enabled: true,
                onScroll: function() {
                    // DO SOMETHING
                }
            },
            search:{
            	enabled:false
            },
            tableStyle:'table-striped'
           /*
            actions: {
                enabled: true,
                template: '.my_template_area_actions',
                actionAreaStyle: 'col-md-9'
            },
            navButtons: {
                enabled: false,
                forwardstyle: 'btn-warning',
                backwardstyle: 'btn-warning',
            },
            
            emptyMessage: '<div class="text-center">No data to display.</div>',
            tableStyle: 'table-striped',
            draggable: {
                enabled: true,
                onDrag: function(dragInfo) {
                    // Do something
                    return false; // If it returns false, will cancel the draggable
                }
               
            }
            */
        }, function(err, data) {
            // DO SOMETHING (error or success)
        });
    	
    },

    bindings: {
        local: {
            'show-message': ['click_showMessage'],
    		'swap': ['click_runSWAP'],
    		'loading-text': ['click_LoadDados'],
    		'rdb1': ['click_rdb1'],
    		'rdb2': ['click_rdb2'],
    		'datatable-add-row': ['click_addRow']
    		
        }
    },
    
    addRow: function(el, ev) {
		var row = {
			time: "11",
			msg: "Santa Catarina"
		};

		this.logTable.addRow(0, row);
		//alert(this.ha);
	},
    
    rdb1:function(){
    	console.log("FULL");
    },
    
    rdb2:function(){
    	console.log("View 1");
    },

    showMessage: function () {
        $div = $('#helloMessage_' + this.instanceId);
        $message = $('<div>').addClass('message').append(this.message);
        $div.append($message);
    },
    
    runSWAP: function(){
    	var that = this;
    	var cURLBase = "172.16.70.112:32234";
    	var request = new XMLHttpRequest();
    	var cURL = "http://"+cURLBase+"/tls/?oper=SWAP";
    	request.open("GET", cURL, true);
    	request.send();
    	request.onreadystatechange= function(){
			if(request.readyState==4){
				if((request.status==200 || request.status==400 || location.href.indexOf("http")==-1 ) && request.responseText != "" ){
					setTimeout(function() {/*window.alert(request.responseText);*/lblPerDe.innerHTML="De: "+ that.RetPerLOG();}, 100);
				}
			}
		}
    	delete request;
    },
    
    RetPerLOG: function(){
    	var cURLBase = "172.16.70.112:32234";
    	var request = new XMLHttpRequest();
    	var cURL = "http://" + cURLBase + "/tls/?oper=DTRG";

    	request.open("GET", cURL, true);
    	request.setRequestHeader('Access-Control-Allow-Origin','*');
    	request.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
    	request.send();
    	request.onreadystatechange=function(){
    		if(request.readyState==4){
    			if (request.status==400){
    				window.alert("Range não Encontrado. Efetue nova pesquisa!!");
    				return;
    			}
    			if((request.status==200 || location.href.indexOf("http")==-1) && request.responseText != ""){
    				cHostName = request.UserHostName;
    				console.log("HostName >> " + request.UserHostName);
    				lblPerDe.innerHTML = request.responseText;
    			}
    		}
    	}
    	delete request;
    },
    
    LoadDados: function(){
    	var cURLBase = "172.16.70.112:32234";
    	
    	// validacao dos campos obrigatorios
    	if (InPeriodoDe.value.length == 0 || InPeriodoAte.value.length == 0){
    		window.alert("Campos Obrigatórios não preenchidos. Reconfigure o filtro de Range");
    		return;
    	}
    	
    	var cPeriodoDe		= (new Date($("#InPeriodoDe").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2-$1-$3"))).toISOString().replace(".000Z","");
    	var cPeriodoDeMS	= "0"
    	var cPeriodoAte		= (new Date($("#InPeriodoAte").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2-$1-$3"))).toISOString().replace(".000Z","");
    	var cPeriodoAteMS	= "0"
    	
    	/*
    	var cHostName	= $("#InHostName").val().length >0 ? "%" + $("#InHostName").val() + "%" : "";
    	var cSeverity	= $("#InSeverity").val().length >0 ? "%" + $("#InSeverity").val() + "%" : "";
    	var cFacility	= $("#InFacility").val().length >0 ? "%" + $("#InFacility").val() + "%" : "";
    	var cInVersion	= $("#InVersion").val().length >0 ? "%" + $("#InVersion").val() + "%" : "";
    	var cInAppName	= $("#InAppName").val().length >0 ? "%" + $("#InAppName").val() + "%" : "";
    	var cInProcID	= $("#InProcID").val().length >0 ? "%" + $("#InProcID").val() + "%" : "";
    	var cInMsgID	= $("#InMsgID").val().length >0 ? "%" + $("#InMsgID").val() + "%" : "";
    	var cInSDData	= $("#InSDData").val().length >0 ? "%" + $("#InSDData").val() + "%" : "";
    	var cInMessage	= $("#InMessage").val().length >0 ? "%" + $("#InMessage").val() + "%" : "";
		*/
    	// conversao dos valores de data e hora para o formato esperado pelo LogServer
    	cPeriodoDe = cPeriodoDe.replace(/(\:)/g,"%3A");
    	cPeriodoAte = cPeriodoAte.replace(/(\:)/g,"%3A");

    	var request = new XMLHttpRequest();
    	request.responseType = "arraybuffer";
    	cURL = "http://" + cURLBase + "/tls/?oper=SLDZ&start_date=" + cPeriodoDe + "&end_date=" + cPeriodoAte
    	cURL = cURL + "&host=" + encodeURIComponent("")
    	cURL = cURL + "&severity=" + encodeURIComponent("")
    	cURL = cURL + "&facility=" + encodeURIComponent("")
    	cURL = cURL + "&version=" + encodeURIComponent("")
    	cURL = cURL + "&appname=" + encodeURIComponent("")
    	cURL = cURL + "&procid=" + encodeURIComponent("")
    	cURL = cURL + "&msgid=" + encodeURIComponent("")
    	cURL = cURL + "&sddata=" + encodeURIComponent("")
    	cURL = cURL + "&msg=" + encodeURIComponent("")

    	request.open("GET", cURL, true);
    	request.send();
    	request.onreadystatechange= function() {
    		if(request.readyState==4) {
    			if (request.status==400) {
    				//window.alert("Range não Encontrado. Efetue nova pesquisa!!");
    				window.alert(arrDecode(request.response));
    				return;
    			}
    			//if((request.status==200 || location.href.indexOf("http")==-1) && request.responseText != "") {
    			if((request.status==200 || location.href.indexOf("http")==-1) && request.response != "") {
    				console.log(request.response);
    				LoadFile(request.response);
    			}
    		}
    	}
    	delete request;
    },
    
    arrDecode: function(buf)  {
    	var dataView = new DataView(buf);
    	var decoder = new TextDecoder('utf-8');
    	var decodedString = decoder.decode(dataView);
    	delete decoder;
    	delete dataView;
    	return decodedString;
    }
    
});