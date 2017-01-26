	<div id="HelloWorld_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
		data-params="HelloWorld.instance({message: 'Hello world'})">
		
		<header class="navbar navbar-default fluig-docs-nav" id="top">
			<div class="container-fluid">
				<div class="row">
					<div class="page-header">
						<div class="media">
							<a class="pull-left" href="#">
								<img class="media-object" src="/logwid/wcm/widget/LogVisualizer/src/main/webapp/resources/images/totvs_logo.png"></img>
							</a>
							<div class="media-body">
								<h1><span class="label label-success">FLUIG - LOG Visualizer</span></h1>
								<h3><span class="label label-success">Ferramenta de apoio à visualização de LOG's</span></h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
		
		<div class="page-content container-fluid clearfix">
			<div class="row">
				<div class="panel panel-success">
					<div class="panel-heading">
						<div class="row">
							<div class="col-md-3">
								<h4><p class="label label-warning" style="font-size:20px;display:inline">Parâmetros de Pesquisa</p></h4>
							</div>
							<div class="col-md-2"> 
								<div class="input-group">
									<button id="lSwitchSWAP" type="button" class="btn btn-default" data-swap> Forçar SWAP de Dados
								</div>
							</div>
							<div class="col-md-4">
								<label for="text">Período de LOG's disponível</label><br>
								<label for="text" id="lblPerDe"></label>
							</div>
							<div class="col-md-3"> 
								<button type="button" class="btn btn-info" id="btnLoad" data-loading-text="Carregando...">Carregar</button>
							</div>
						</div>
					</div>
					<div class="panel-body">
					<div class="well" id="WellParameters">
						<div class="row">	<!-- row WellParameters PRIMEIRA LINHA DE PARAMETROS -->
							<div class="col-md-4"> 
								<div class="input-group">
									<div class="form-group">
									<label for="date-time">Período De</label>
									<input type="text" class="form-control" id="InPeriodoDe" placeholder="Date and Time"></input>
									</div>
								</div>
							</div>
								
							<div class="col-md-4"> 
								<div class="input-group">
									<div class="form-group">
									<label for="date-time">Período Ate</label>
									<input type="text" class="form-control" id="InPeriodoAte" placeholder="Date and Time"/></input>
									</div>
								</div>
							</div>
	<!--  
							<div class="col-md-2"> 
								<div class="input-group">
									<div class="form-group">
									<label class="text">Hostname</label><br>
									<input type="text" id="InHostName" placeholder="Name or IP" class="form-control"></input>
									</div>
								</div>
							</div>

							<div class="col-md-2"> 
								<div class="input-group">
									<div class="form-group">
									<label class="text">Severity</label><br>
									<input type="text" id="InSeverity" placeholder="Only Numbers" class="form-control"></input>
									</div>
								</div>
							</div>

							<div class="col-md-2"> 
								<div class="input-group">
									<div class="form-group">
									<label class="text">Version</label><br>
									<input type="text" id="inVersion" placeholder="Only Numbers" class="form-control"></input>
									</div>
								</div>
							</div>

							<div class="col-md-2"> 
								<div class="input-group">
									<div class="form-group">
									<label class="text">AppName</label><br>
									<input type="text" id="InAppName" placeholder="Name" class="form-control"></input>
									</div>
								</div>
							</div>
							
							-->

						</div>		<!-- row WellParameters PRIMEIRA LINHA DE PARAMETROS -->
					</div>	<!-- well1 -->

					<div class="well">	<!-- well2 -->
						<div class="row">
							<div class="panel-body" id="PnlLOGViewer">
								<div class="row">
									<div class="col-md-12"> 
										<div class="col-md-12"> 
										<div class="well">
											<div class="col-md-12"> 
												<!--
												<label for='formVisions'>Visões Disponíveis: </label>
												<form class="btn-group" id='formVisions'>
													<label class="radio-inline" id='lblvision1'><input type="radio" name="rdbVisions" id="rdb1" value="full" checked='checked' onclick='ChangeView()'>Full</label>
													<label class="radio-inline" id='lblvision1'><input type="radio" name="rdbVisions" id="rdb2" value="visao1" checked='checked' onclick='ChangeView()'>Visao1</label>
												</form>
												-->
												<div class="form-group">
													<div class="input-group">
														<input type="text" class="form-control" id="txtQuery" placeholder='Digite sua QUERY AQUI ...' value="">
														<span class="input-group-btn">
														<button type="button" class="btn btn-success btn-md" id="btnLast" onclick='RunQuery()'><i><b><u>R</i></b></u>odar Query
														<span class="glyphicon glyphicon glyphicon-play"></span>
														</button>
														</span>
													</div>
												</div>
											</div>
											
											<div class="col-md-12 scrooltable" id="target" data-isolated-scroll>
												<div id="datatable-area" class="panel-heading">
													<!--
													<div class="row">
														<div id="datatable-area-action" class="col-md-7">
															<button class="btn btn-primary" data-datatable-add-row>Add
															</button>
															<button class="btn btn-primary" data-datatable-del-row>Remove
															</button>
															<button class="btn btn-primary" data-datatable-edit-row>Edit
															</button>
														</div>
														<div class="col-md-3">
															<label>Linhas por página: </label>
														</div>
														<div class="col-md-2">
															<select class="form-control" id='slcNumRow'>
																<option value=10>10</option>
																<option value=20>20</option>
																<option value=30>30</option>
															</select>
														</div>
													</div>
													-->
												</div>
												
												<div id="logTable">
													
												</div>
											</div>
											
											

										<div class="table-container">
											<div class="table-container-header">
												<table class="table table-striped table-hover table-bordered" id="tblHeader"></table>
											</div>
											<div class="table-container-body bodycontainer" style="width: auto;max-height: 50%;overflow-x: scroll;overflow-y: scroll;">
												<table class="table table-striped table-bordered" id='tblData'></table>
											</div>
											<div class="table-container-footer">
												<table class="table table-striped table-hover table-bordered">
													<tfoot>	<!-- início do Footer do DataTable -->
														<div id="Pagination">
														<div class="col-md-9">
															<div class="col-md-3">
																<label for='slcNumRow'>Linhas por Página: </label>
															</div>
															<div class="col-md-2">
																<select class="form-control" id='slcNumRow'>
																	<option value=10>10</option>
																	<option value=20>20</option>
																	<option value=30>30</option>
																</select>
															</div>
															<button type="button" class="btn btn-info btn-md" id="btnFirst" onclick='PageControl(1)'>
															<span class="glyphicon glyphicon-fast-backward"></span>
															Primeiro</button>
															<button type="button" class="btn btn-info btn-md" id="btnAfter" onclick='PageControl(2)'>
															<span class="glyphicon glyphicon-step-backward"></span>
															Anterior</button>
															<button type="button" class="btn btn-info btn-md" id="btnBefore" onclick='PageControl(3)'>
															Próximo<span class="glyphicon glyphicon-step-forward"></span>
															</button>
															<button type="button" class="btn btn-info btn-md" id="btnLast" onclick='PageControl(4)'>
															Último <span class="glyphicon glyphicon-fast-forward"></span>
															</button>
														</div>
														<div class="col-md-3">
															<h4><span class="label label-primary label-md-6" id='lblTotReg'></span></h4>
														</div>
														</div>
													</tfoot>
												</table>
											</div>
										</div>
									</div>
								</div>		<!-- row data-table -->
							</div>
						</div> <!-- fecha a row dos indicadores -->
					</div>	<!-- well2 -->
				</div>
				</div>
			</div>
		</div>

	</div>
