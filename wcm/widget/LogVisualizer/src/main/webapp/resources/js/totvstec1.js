var worker		= new Worker("/LogVisualizer/resources/js/totvstec2.js");	// js do SQLite a ser embado no navegador
var nNumPage	= 1;										// numero da p�gina onde est� ponderado o PONTEIRO, usado no controle de pagina��o
var nNumTotReg	= 0;									// objeto com o total de registros dispon�veis na VIEW
var cTableWork	= null;									// nome da "TABELA" (na verdade � uma VIEW) que est� selecionado no momento
var lstFields	= "TIME_UTC,MSG"						// coluna a serem utilizadas na VIEW ORIGINAL
var aRdViews	= [["rdb1","full"],["rdb2","visao1"]]	// armazena nome dos bot�es RADIO das Vis�es para verificar qual est� ativo.
var cQryPageRun	= null;
var logTable = null;
var ha = 23;

// Open a database
worker.postMessage({action:'open'});

// atalhos dos botoes
document.onkeydown=function(e){
	if ((e.altKey) && (e.which === 67)) {LoadDados();}			// Pesquisar (Alt + C) 	Carregar
	if ((e.altKey) && (e.which === 82)) {RunQuery();}	 		// Pesquisar (Alt + R)	Rodar Query
	if ((e.altKey) && (e.which === 65)) {$("#flip").click();}	// Pesquisar (Alt + A)	Abre/Fecha Filtros Adicionais
	if ((e.altKey) && (e.which === 80)) {						// Pesquisar (Alt + P)	Abre/Fecha Folder de Parametros
		if ($("#pnlParam").is(":visible")){$('#pnlParam').hide();}
		else{$('#pnlParam').show();}
	}
}

function LoadFile(cTable) {
	console.log(cTable)
	// verifica se a table possui dados e caso SIM, fecha a tabela para nova carga
	worker.onmessage = function () {
		
		setTimeout(function() {
			// Altera o nome da tabela para ficar mais amistoso ao usu�rio
		ResultExec("alter table syslog_5424 rename to full","visao");}
		, 500);
		
		// Executa uma Query de criacao da PRIMEIRA VIEW
		ResultExec("CREATE VIEW Visao1 AS SELECT " + lstFields + " FROM full","visao");
		cTableWork =  "Visao1";

		// aguarda a criacao da VIEW para poder atualizar o numero total de registros
		setTimeout(function() {PageControl(5);}, 500);
	}
	try {worker.postMessage({action:'open',buffer:cTable}, [cTable]);}
	catch(exception) {worker.postMessage({action:'open',buffer:cTable});}
}

function ResultExec(commands,cOpcExec) {
	//console.log("ResultExec >> commands" + commands + ">>")
	worker.onmessage = function(event) {
		var results = event.data.results;
		for (var i=0; i<results.length; i++) {
			if (results[i].columns[0].toString().search(/count/i) >= 0 ) {
				$('#lblTotReg').html("Total de Registros " + results[i].values[0][0]);
				nNumTotReg=results[i].values[0][0];
			}
			else {tableCreate(results[i].columns, results[i].values);}
		}
	}
	//try {worker.postMessage({action:'exec',buffer:commands},[event]);}
	//catch(exception) {worker.postMessage({action:'exec',buffer:commands});}
	worker.postMessage({action:'exec', sql:commands,cOpcExec});		//este roda a query
}

// montagem da Tabela com dados din�micos
function tableCreate(_columns,_values) {
    $('#pnlParam').hide();
    $('#PnlLOGViewer').show();
    var html = '<thead>' + '<tr>' + valconcat(_columns,'th') + '</tr>' + '</thead>';
    $('#tblHeader').html(html)
	var rows = _values.map(function(_values){ return valconcat(_values, 'td'); });
    html = '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
	$('#tblData').html(html);
	
	//table FLUIG
	var row='';
	for(i=0; i<_values.length; i++){
		row=row+'<tr>';
		var aux = _values[i];
		/*
		var row = {
				time: aux[0],
				msg: aux[1]
			};
		*/
		row = row + '<td>'+aux[0]+'</td><td>'+aux[1]+'</td></tr>';
		var debug = $('#logTable');
		debug.addRow(0, row);
	}
	//row = row+'</tr>'
	//var tbody = document.getElementById('logTable').getElementsByTagName('tbody');
	var tbody = $('[data-tbody-fluig]');
	tbody.html(row);
};

function valconcat(_values, _columns) {
    if (_values.length === 0) return '';
	var open = '<'+_columns+'>', close='</'+_columns+'>';
	var cRet = open + _values.join(close + open) + close;
	if (_columns == 'td') {cRet = cRet.replace(/\n/g,"<br>\n");}
    return cRet
}
// montagem da Tabela com dados din�micos

// Controle de Pagina��o
function PageControl(nOpc){
	var cWhere		= '';
	cQryPageRun		= (cQryPageRun == null) ? 'SELECT * FROM ' + cTableWork : cQryPageRun;	// null somente na primeira chamada
	var nNumRows	= slcNumRow.value;
	
	if (nOpc == 1 || nOpc == 5) {cWhere = " limit " + nNumRows; nNumPage=1;}
	else if (nOpc == 2){
		if (nNumPage > 0 ){cWhere = " limit " + nNumRows + " offset " + (nNumRows * nNumPage); nNumPage=nNumPage-1;}
		else {cWhere = " limit " + nNumRows; nNumPage=1;}
	}
	else if (nOpc == 3){cWhere = " limit " + nNumRows + " offset " + (nNumRows * nNumPage); nNumPage=nNumPage+1;}
	else if (nOpc == 4){cWhere = " limit " + nNumRows + " offset " + "(select count(*) from " + cTableWork +" )- " + nNumRows; 
		nNumPage=parseInt(nNumTotReg/nNumRows);
	}
	else {}

	// condi��o 5 define que ser� necess�rio efetuar atualizacao do total de registros ap�s montagem da visao
	if (nOpc == 5) {
		ResultExec("SELECT COUNT(*) FROM " + cTableWork,"count");
		cQryPageRun = 'SELECT * FROM ' + cTableWork;
		document.getElementById("txtQuery").value = cQryPageRun;	//ORIGINAL VOLTAR PARA PRODUCAO QDO TERMINAR DEBUG
		//document.getElementById("txtQuery").value = "table {testa} select * from full where PROCID = '6480'";	// SOMENTE PARA DEBUG
	}

	ResultExec(cQryPageRun + cWhere,"tab1");		// nunca alterar a cQryPageRun pois ela sempre ser� a base da pagina��o
	//console.log("PageControl >> commands <<" + cQryPageRun + ">>")
}

// execu��o de query e cria��o de view�s
function RunQuery(){
	var cNameView	= "Visao";
	var cSelectRun	= '';
	var lViewCreate = true;			// vari�vel de controle para a cria��o da vis�o evitando nome duplicado
	var cQryRun		= document.getElementById("txtQuery").value;		// recupera a query digitada pelo usu�rio

	// desconstru��o da query para encaixar o condicionamento de pagina��o
	// primeiro retirar o group by da cla�sula para realinhar depois de um <<MARCADOR>> para substitui��o pela query de pagina��o
	if (cQryRun.search(/vision/i) >= 0 || cQryRun.search(/table/i) >= 0) {
		// so podemos criar uma visao nova fazendo query sobre a tabela real, nunca sobre uma VIEW
		if (cQryRun.search(/ full /i) < 0){
			window.alert("Uma VIEW deve ser criada SOMENTE SOB A TABELA FULL (TABELA REAL), nunca sob uma VISAO. Refa�a por favor !!!");
			lViewCreate = false;
		}
		
		// verifica se foi especificado nome para visao {contagem} select FACILITY,SEVERITY,VERSION,count(*) TOTAL from full group by FACILITY,SEVERITY,VERSIONa vis�o atraves de Caracter Determinante "{" de nome para a VIEW
		// sempre pega a posi��o [1] do array de retorno da fun��o "match"
		if (cQryRun.search(/{/i) > 0){cNameView = cQryRun.match(/\{([^"]*)\}/)[1].replace(/ /ig,"");cQryRun=cQryRun.replace(/\{([^"]*)\}/ig,"")}
		else {cNameView = cNameView + (aRdViews.length);}	// incrementa 1 no nome da vis�o

		// varredura no array de views para garantir unicidade SOMENTE NO NOME DA VIEW
		for (var i=0; i<aRdViews.length; i++) {
			if (aRdViews[i][1].toUpperCase() == cNameView.toUpperCase()){
				lViewCreate = false;
				var MyAlert =  setTimeout(function() {window.alert("Nome de Visao ja EXISTE, Escolha outro !!!");}, 100);
				lViewCreate = false;
			}
		}
		
		if (lViewCreate){
			// pega a Query original para execucao. Em qq das circunstancias trar� a Query da forma como escrita
			cSelectRun		= cQryRun.substr(cQryRun.search(/select/i));

			// cria uma view temporaria (TEMP) e qdo encerrar a conex�o ela ser� removida automaticamente
			//cQryPageRun = cQryRun.replace(/vision/i,"CREATE TEMP VIEW IF NOT EXISTS " + cNameView + " AS ");
			if (cQryRun.search(/vision/i) >= 0) {
				cQryPageRun = cQryRun.replace(/vision/i,"CREATE VIEW IF NOT EXISTS " + cNameView + " AS ");
			}
			else if (cQryRun.search(/table/i) >= 0) {
				cQryPageRun = cQryRun.replace(/table/i,"CREATE TABLE  " + cNameView + " AS ");
			}
			else {}	// para garantir somente dois parametros
			ResultExec(cQryPageRun,"visao");
		
			// cria��o do objeto para amarra��o da View no HTML
			var nIncremental = formVisions.children.length + 1;	// pega a qtd de objetos RDB+N do formVisions e acrescenta 1 para pr�ximo objeto
			var objFrmVisions = document.getElementById("formVisions");
			var cObj = '<label class="radio-inline" id="lblvisionX"><input type="radio" name="rdbVisions" id="rdbX" value="<<VIEW>>" checked="checked" onclick="ChangeView()"><<VIEW>></label>';
			var cObjGood = cObj.replace(/X/g,nIncremental);
			var cObjGood = cObjGood.replace(/<<VIEW>>/g,cNameView);
			objFrmVisions.insertAdjacentHTML('beforeend', cObjGood);
			aRdViews.push(["rbd"+nIncremental,cNameView]);	// acrescenta o novo bot�o e nome da view no array de pesquisa de QUAL RADIO ATIVADO
			cTableWork = cNameView	//pega o nome da vis�o atual para trabalhos
			PageControl(5)	// chama o controle de pagina��o para ajuste na caixa de texto de querys ajustando o numero TOTAL de registros
		}
	}
	else {
		cQryPageRun = cQryRun;
		PageControl(1);			// parametro "tab" determina que ser� montada tabela no frame
	}
}

// troca a tabela ap�s o click na vis�o dispon�vel
function ChangeView() {
	cTableWork = $('input[name="rdbVisions"]:checked').val();
	PageControl(5);
}

// execu��o de query e cria��o de view�s
// select * from full where R_E_C_N_O_ between 57000 and 58000
// vision {range1} select * from full where R_E_C_N_O_ between 57000 and 58000
// select FACILITY,SEVERITY,VERSION,count(*) TOTAL from full whererowid < 1000 group by FACILITY,SEVERITY,VERSION

// SELECT * from sqlite_master
// SELECT name from sqlite_master WHERE type ='view'
// vision {testa} select * from full 
// table {testa} select * from full where PROCID = '6480'

// vision {Nova} SELECT TIME_UTC,HOSTNAME,APPNAME,PROCID,MSG FROM full WHERE MSG LIKE '%Checking Job%'
// TABLE {NaoPaulo} SELECT HOSTNAME,version,TIME_UTC,APPNAME,MSG FROM full where HOSTNAME not like '%PAULOTOVO%'